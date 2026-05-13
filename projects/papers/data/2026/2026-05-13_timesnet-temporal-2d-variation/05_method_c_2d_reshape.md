# 05c. 1D→2D 변환 & Inception Block & 적응적 집계

> **배경 사다리**: ① Reshape = 배열의 원소 순서는 유지하면서 형태(shape)를 바꾸는 연산. ② Inception Block = GoogLeNet에서 시작된 구조 — 서로 다른 크기의 필터를 병렬로 적용하고 결과를 이어붙임. ③ Softmax = 여러 숫자를 합이 1이 되는 확률 분포로 변환.

---

## 1D→2D 변환 (TimesBlock 핵심)

FFT_for_Period가 주기 $p$를 반환하면, TimesBlock은 다음 연산을 수행한다:

```python
# x: [B, T+pred_len, N] — 배치 × 시간 × 채널
period = period_list[i]  # FFT로 찾은 i번째 지배 주기

# 1. 패딩 (시퀀스 길이가 p의 배수가 아닌 경우)
if (T + pred_len) % period != 0:
    length = ((T + pred_len) // period + 1) * period
    padding = torch.zeros([B, length - (T+pred_len), N])
    out = torch.cat([x, padding], dim=1)  # 오른쪽에 0 패딩
else:
    length = T + pred_len
    out = x

# 2. 1D → 2D reshape
out = out.reshape(B, length//period, period, N)
out = out.permute(0, 3, 1, 2)  # → [B, N, length//period, period]
# 행(rows) = length//period = 주기 개수 (interperiod 방향)
# 열(cols) = period          = 주기 길이 (intraperiod 방향)

# 3. 2D Inception 합성곱
out = self.conv(out)  # Inception_Block_V1 × 2 (d_model→d_ff→d_model)

# 4. 2D → 1D reshape 복원
out = out.permute(0, 2, 3, 1)  # → [B, length//period, period, N]
out = out.reshape(B, -1, N)     # → [B, length, N]
out = out[:, :(T+pred_len), :]  # 패딩 제거
```

### 핵심 수식

$$\mathbf{X}^{(i)}_{2D} = \text{Reshape}_{p_i}\left(\text{Pad}(\mathbf{x})\right) \in \mathbb{R}^{B \times C \times \lceil L/p_i \rceil \times p_i}$$

$$\hat{\mathbf{X}}^{(i)}_{2D} = \text{InceptionBlock}(\mathbf{X}^{(i)}_{2D})$$

$$\hat{\mathbf{x}}^{(i)} = \text{Reshape}^{-1}\left(\hat{\mathbf{X}}^{(i)}_{2D}\right)[:, :L, :] \in \mathbb{R}^{B \times L \times C}$$

여기서 $L = T + T_{\text{pred}}$, $p_i$는 $i$번째 지배 주기.

**기호 뜻**: $B$=배치, $C$=채널수, $L$=전체 시퀀스 길이(입력+예측), $p_i$=주기 길이, $\lceil L/p_i \rceil$=주기 개수(올림).

**일상 비유**: 긴 줄자를 주기 $p$ 길이로 접어 쌓는 것과 같다. 접은 후에는 각 줄(row)이 하나의 주기, 각 열(column)이 주기 내의 위치를 나타낸다. 사진이 된 줄자에서 "주기 간 트렌드"는 세로 방향(row간)으로, "주기 내 모양"은 가로 방향(column간)으로 보인다.

**왜 이 형태인가**: 1D 합성곱 커널은 인접한 시점만 볼 수 있다. 2D 합성곱 커널 크기 $(k_r, k_c)$로는 $k_r$개의 주기에 걸친 정보와 한 주기 내 $k_c$개 연속 지점을 동시에 볼 수 있다. 이로써 짧은 커널 하나가 intraperiod + interperiod 정보를 동시에 포착한다.

**조심할 점**: `reshape` + `permute`의 순서가 중요하다. `reshape(B, L//p, p, N)` 후 `permute(0, 3, 1, 2)`는 [B, C, rows, cols] 형태를 만든다. 순서가 바뀌면 행/열의 의미가 달라진다.

---

## Inception_Block_V1: 파라미터 효율적 2D 합성곱

```
TimesBlock.conv = Sequential(
    Inception_Block_V1(d_model, d_ff, num_kernels=...),
    GELU(),
    Inception_Block_V1(d_ff, d_model, num_kernels=...)
)
```

Inception Block은 GoogLeNet(Szegedy et al. 2014)에서 비롯된 구조로, 서로 다른 크기의 2D 합성곱 필터를 병렬 적용하고 출력을 이어붙인다:

$$\text{InceptionBlock}(\mathbf{X}) = \text{Concat}\left[\text{Conv}_{1\times1}(\mathbf{X}), \text{Conv}_{3\times3}(\mathbf{X}), \text{Conv}_{5\times5}(\mathbf{X}), \ldots\right]$$

(채널 수를 맞추기 위한 1×1 conv 포함)

**TimesNet에서의 의미**:
- 작은 커널 ($1\times1$, $3\times3$): 주기 내의 세밀한 패턴 (intraperiod fine-grained)
- 큰 커널 ($5\times5$ 이상): 여러 주기에 걸친 넓은 패턴 (interperiod coarse)
- 병렬로 처리 후 합침 → 다중 해상도 패턴을 동시에 포착

파라미터 효율성: 고정 큰 커널 하나보다 다양한 작은 커널을 병렬 사용하면 비슷한 표현력을 더 적은 파라미터로 달성할 수 있다 (Inception 원래 논문의 동기와 동일).

---

## 적응적 집계 (Adaptive Aggregation)

$k$개 주기 각각에 대해 독립적으로 처리된 출력 $\hat{\mathbf{x}}^{(1)}, \ldots, \hat{\mathbf{x}}^{(k)}$를 FFT 진폭으로 가중합한다:

```python
res = torch.stack(res, dim=-1)  # [B, T, N, k]

# FFT 진폭을 가중치로 softmax 정규화
period_weight = F.softmax(period_weight, dim=1)  # [B, k]
period_weight = period_weight.unsqueeze(1).unsqueeze(1).repeat(1, T, N, 1)

res = torch.sum(res * period_weight, -1)  # [B, T, N]

# Residual 연결
res = res + x
```

수식으로:

$$w_i = \frac{\exp(A_{b, f_i})}{\sum_{j=1}^{k} \exp(A_{b, f_j})} \quad \text{(softmax 가중치)}$$

$$\hat{\mathbf{x}} = \sum_{i=1}^{k} w_i \cdot \hat{\mathbf{x}}^{(i)} + \mathbf{x} \quad \text{(가중합 + residual)}$$

**기호 뜻**: $A_{b, f_i}$는 배치 $b$에서 $i$번째 주기의 FFT 진폭, $w_i$는 softmax로 정규화된 가중치.

**일상 비유**: 여러 음악가(각각 다른 리듬 전문가)가 각자 편곡한 버전을 만들었을 때, 원곡에서 그 리듬이 얼마나 강했는지에 비례해 각 편곡을 섭는다. 강한 리듬의 편곡이 더 많이 반영된다.

**왜 이 형태인가**: 단순 평균(all $w_i = 1/k$)이면 중요한 주기와 덜 중요한 주기를 동등하게 취급한다. FFT 진폭으로 가중합하면 데이터에서 실제로 강한 주기 성분이 더 많이 반영된다. 이 가중치는 **학습되는 것이 아니라** 입력 데이터에서 즐시 계산된다.

**조심할 점**: 이 가중합은 입력 $\mathbf{x}$의 FFT 진폭으로만 결정되고, TimesBlock이 처리한 후의 출력 품질은 반영되지 않는다. 즉 FFT 진폭이 크더라도 해당 주기의 Inception 처리 결과가 나쁜 수 있는데, 그 주기에 높은 가중치가 부여된다.

---

## TimesBlock 전체 흐름 요약

```
x: [B, T, N]
  │
  ├─ FFT_for_Period(x, k) → period_list, period_weight
  │
  │  for i in range(k):
  ├─── 패딩 (if 필요)
  ├─── reshape: [B,T,N] → [B,N,T//p,p] (1D→2D)
  ├─── Inception_Block_V1 × 2 (GELU 사이)
  ├─── reshape: [B,N,T//p,p] → [B,T,N] (2D→1D)
  └─── 결과 저장
  │
  ├─ softmax(period_weight) → 가중치
  ├─ 가중합: Σ (w_i × 결과_i)
  └─ + x (residual)
  │
출력: [B, T, N]
```

TimesBlock 여러 개를 쌓으면 (e_layers), 각 블록이 이전 블록의 출력을 입력으로 받아 점점 더 정교한 표현을 학습한다.
