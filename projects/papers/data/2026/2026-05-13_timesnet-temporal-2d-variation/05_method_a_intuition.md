# 05a. 방법론 큰 그림 — TimesNet 전체 흐름

> **배경 사다리**: ① 텐서(tensor) = 다차원 배열 — 1D는 벡터, 2D는 행렬, 3D는 행렬의 묶음. ② 배치(batch) = 한 번에 처리하는 데이터 묶음. ③ 채널(channel) = 다변량 시계열에서 하나의 관측 변수 (예: 기온, 강수량이 각 1개 채널).

---

## TimesNet의 큰 그림

TimesNet의 아이디어를 한 문장으로: **"1D 시계열을 2D 이미지체럼 접어서, 이미지 인식 기술(2D CNN)로 시계열 패턴을 분석한다."**

전체 파이프라인은 5단계로 이뤄진다:

```
입력 1D 시계열
     ↓
[1단계] 데이터 임베딩 (DataEmbedding)
     ↓
[2단계] 예측 태스크의 경우 시간 차원 확장 (predict_linear)
     ↓
[3단계] TimesBlock × e_layers 반복
   ├── FFT로 k개 지배 주기 탐지
   ├── 각 주기마다: 1D→2D reshape → Inception 2D Conv → 2D→1D reshape
   ├── k개 출력을 FFT 진폭으로 가중합
   └── Residual 연결
     ↓
[4단계] LayerNorm
     ↓
[5단계] 태스크별 Head (예측/보완/이상탐지/분류)
     ↓
출력
```

---

## 각 단계의 역할 (수식 최소화)

### 1단계: 데이터 임베딩

입력 시계열 $\mathbf{x} \in \mathbb{R}^{B \times T \times C}$ (배치×시간×채널)을 $\mathbb{R}^{B \times T \times d_{\text{model}}}$로 변환. $d_{\text{model}}$은 모델의 내부 표현 차원 (예: 64 또는 128).

DataEmbedding은 값 임베딩(value embedding) + 시간 특성 임베딩(시간대, 요일, 월 등 temporal features) + 위치 임베딩(positional embedding)의 합이다. 코드: `self.enc_embedding = DataEmbedding(...)`.

### 2단계: 시간 차원 확장 (예측 태스크만)

장·단기 예측의 경우, 입력 길이 $T$에서 예측 길이 $T + T_{\text{pred}}$로 미리 선형 투영(linear projection)한다. 이렇게 하면 TimesBlock이 항상 동일한 길이의 시퀀스를 처리할 수 있다.

코드: `enc_out = self.predict_linear(enc_out.permute(0, 2, 1)).permute(0, 2, 1)`

이것이 없으면 TimesBlock 내부의 2D reshape가 입력과 출력의 시간 차원을 맞추기 어렵다 — 예측이 "미래로 확장"이 아니라 "현재 패턴의 재현"이 되어버린다.

### 3단계: TimesBlock (핵심)

→ 05b, 05c 파일에서 수식과 코드로 상세 해부.

### 4단계: LayerNorm

각 TimesBlock 출력에 LayerNorm을 적용한다: `enc_out = self.layer_norm(self.model[i](enc_out))`.

LayerNorm (레이어 정규화) = 각 샘플의 특성 차원(feature dimension)에 걸쳐 평균과 분산을 정규화하는 것. 배치 크기에 독립적이어서 소규모 배치에서도 안정적이다.

### 5단계: 태스크별 Head

| 태스크 | Head 동작 |
|--------|----------|
| 장·단기 예측 | `projection(enc_out)[:, -pred_len:, :]` — 예측 구간만 슬라이싱 |
| 결측 보완 | `projection(enc_out)` — 전체 시퀀스 재구성 |
| 이상 탐지 | `projection(enc_out)` — 재구성 오류로 이상 점수 계산 |
| 분류 | `projection(flatten(GELU(enc_out)))` — 시퀀스 전체를 하나의 벡터로 압쳐 후 분류 |

---

## 정규화 전략

TimesNet은 **Non-stationary Transformer** (Liu et al., NeurIPS 2022)에서 영감 받은 인스턴스 정규화(instance normalization) + 역정규화(de-normalization)를 사용한다.

```python
# 예측 태스크에서:
means = x_enc.mean(1, keepdim=True).detach()
x_enc = x_enc - means
stdev = torch.sqrt(torch.var(x_enc, dim=1, ...) + 1e-5)
x_enc = x_enc / stdev
# ... TimesBlock 처리 ...
dec_out = dec_out * stdev + means  # 역정규화
```

이 방식은 RevIN(Reversible Instance Normalization, Kim et al. 2022)과 유사하다. 목적: 분포 이동(distribution shift) 문제를 완화. 각 시퀀스를 평균=0, 분산=1로 정규화하면 절대값보다 상대적 패턴에 집중할 수 있다.

---

## 전체 구조의 핵심 설계 원칙

1. **하나의 블록, 다섯 태스크**: TimesBlock은 태스크와 무관하게 동일하게 동작한다. 태스크 특이성은 head에만 있다.
2. **하이브리드 1D+2D**: 입력은 1D, 내부 처리는 2D, 출력은 다시 1D. 기존 TS 파이프라인과 호환.
3. **적응적 주기 가중합**: 중요한 주기(FFT 진폭이 큰)에 더 높은 가중치를 자동으로 부여.
4. **효율성**: FFT $O(T \log T)$ + 2D Conv $O(T)$ — Attention의 $O(T^2)$보다 효율적.

→ 다음 파일(05b)에서 FFT_for_Period의 수학을 상세히 해부.
→ 05c에서 reshape + Inception Block + aggregation을 해부.
