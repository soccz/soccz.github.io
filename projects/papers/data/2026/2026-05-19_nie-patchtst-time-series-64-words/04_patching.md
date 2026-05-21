# 04. Patching — 시계열을 토큰으로

## 📌 이 챕터 다 읽으면 알 수 있는 것

- Patching 의 정확한 메커니즘 — L → P × N 분해, padding
- Eq 1 (patch projection) 의 의미
- ViT 의 16x16 patching 정신을 시계열에
- Patching 의 3 이점 (정보 압축·complexity ↓·long L 가능)

---

> 본 논문의 *첫 trick*. 긴 시계열을 *작은 조각 (patch)* 로 자르고 *조각 하나하나* 를 *한 단어* 처럼.

---

## 4.1 챕터 한 줄 요약

> **"긴 시계열 (336 시간) → 16 시간 짜리 작은 조각 42개. 조각 하나 = Transformer 의 한 token. ViT (이미지 16x16 patch) 의 시계열 버전. 효과: attention 22× 빠름 + longer history + local pattern 보존."**

---

## ★ Patching 의 4 가지 동시 이득

| 이득 | 정량 | 어디 입증되는가 |
|------|------|---------------|
| **Attention 복잡도 감소** | $O(L^2) \to O((L/S)^2)$, S=8 → **64× 감소** | 본 chapter |
| **실측 학습 속도 (Traffic)** | **22× speedup** (10040초 → 464초) | ch03 Table 1 |
| **Longer L 가능** | L=336 → 512 → 720 까지 | ch10 Fig 2 |
| **Local pattern 보존** | 한 patch 안의 시간 정보 한 token 으로 | 본 chapter |

→ Patching 의 진짜 가치는 **하나의 trick 으로 4가지 동시 해결**.

---

## 4.2 Patching 이 뭐예요? — 일상 비유

### 비유 1 — 책 읽기

긴 책 (336 페이지) 을 읽을 때:
- *한 글자씩* 읽는다? — 너무 느림 (336 = 336개 element).
- *한 단어씩* 읽는다? — 빠름 (예: 42 단어).

각 *단어* 가 *몇 글자 (P=16)* 의 *조각*. 단어 단위로 의미 파악.

본 논문: 시계열을 *단어 단위* 로 봄. **한 단어 = 16 timestep 의 patch**.

### 비유 2 — 영상 압축

긴 영상 (336 프레임) 을 *한 프레임씩* 처리 vs *짧은 클립 (16 프레임)* 단위로 처리. 후자가 더 *의미 있는 unit*.

### 비유 3 — 음악 듣기

긴 곡을 *한 음표씩* 분석 vs *마디 (measure)* 단위로 분석. 마디가 *local 패턴* (멜로디, 리듬) 보존.

---

## 4.3 Patching 의 정확한 정의

### 입력 / 출력

- **입력**: 시계열 길이 $L = 336$ (예: 지난 336 시간 전력 사용량).
- **Patch length**: $P = 16$ — 한 patch 의 길이.
- **Stride**: $S = 8$ — 다음 patch 가 *얼마나 옮겨* 가는지.
- **출력**: $N$ 개의 patch. **$N = 42$** (정확한 수치).

### N 계산법

**Equation 1 (식 1)**: $N = \lfloor (L-P)/S \rfloor + 2$.

**일상 비유**: 책 페이지 (336) 를 *한 단어 (16 페이지)* 씩 자르되 *옆 단어와 8 페이지 overlap*. 단어 수 = ?

수치 대입:
- $L = 336, P = 16, S = 8$.
- $N = \lfloor (336-16)/8 \rfloor + 2 = 40 + 2 = 42$.

**다른 setting** (PatchTST/64):
- $L = 512$ (더 긴 history).
- $N = \lfloor (512-16)/8 \rfloor + 2 = 64$.

→ **이름의 유래**: "PatchTST**/42**" 의 42 = patch 수. "PatchTST**/64**" 의 64 도 patch 수.

논문 제목 **"A Time Series is Worth 64 Words"** = "*시계열 = 64 개 patch (단어)*".

---

## 4.4 Overlapping vs Non-overlapping

### Overlapping ($S < P$)

- $P = 16$, $S = 8$. 인접 patch 가 $P - S = 8$ timestep *겹침*.
- 본 논문 *Supervised* setting default.

**일상 비유**: 책 단어 들이 *반씩 겹치는* 형태. 정보 유실 줄임.

### Non-overlapping ($S = P$)

- $P = 12$, $S = 12$. 인접 patch 가 *정확히 인접*, 겹침 X.
- 본 논문 *Self-supervised* setting default.

**일상 비유**: 책 단어 들이 *연속이지만 겹침 X*.

**왜 self-supervised 에서 non-overlap?**: Mask 한 patch 가 *다른 patch 와 정보 공유 X* 보장. *학습 목표 명확*.

---

## 4.5 Padding 처리

마지막 patch 가 *경계 밖* 으로 나갈 때:
- 시계열 마지막 값 $x_L$ 을 *$S$ 번 반복* 해서 끝에 추가.
- 효과: $L + S$ 길이가 되어 *마지막 patch 도 정상* 만들어짐.

**예**: $L = 336$, $S = 8$. Padding 후 $L + S = 344$. 마지막 patch 가 *원래 마지막 시점* 도 포함.

---

## 4.6 Patching 의 *3가지 이점* — Step-by-step

### 이점 1 — *Attention 22× 빠름*

#### 어떻게?

**전통 (No patching)**: Token = 각 timestep. $L = 336$ 개 token.
- Attention 복잡도: $O(L^2) = O(336^2) = O(112,896)$.

**Patching (P=16, S=8)**: Token = 각 patch. $N = 42$ 개 token.
- Attention 복잡도: $O(N^2) = O(42^2) = O(1,764)$.

**이론 비율**: $112,896 / 1,764 = 64\times$.

**실제 측정 (Table 1)**:

| Dataset | with patch | without patch | Speedup |
|---------|-----------|---------------|---------|
| Traffic | 464초 | 10,040초 | **22×** |
| Electricity | 300초 | 5,730초 | **19×** |
| Weather | 156초 | 680초 | **4×** |

→ **이론 64×, 실제 4-22×** — 다른 overhead (forward, IO) 가 dataset 별로 다름.

### 이점 2 — *Longer Look-back Window 가능*

같은 *compute budget* 으로:
- No patching: $L = 96$ 정도 까지 (그 이상 너무 느림).
- Patching: $L = 336$ 또는 $512$ 까지 (충분히 빠름).

#### 왜 longer $L$ 이 좋은가?

**Table 1 의 결과 (Traffic dataset)**:
- $L = 96$: MSE = 0.518.
- $L = 336$: MSE = 0.397.
- 즉 *longer L 로 MSE 23% 감소*.

**일상 비유**: 학생 시험 예측에 *지난 1년* vs *지난 5년* 보면 정확도 다름. 정보 많을수록 좋다.

### 이점 3 — *Local Semantic 정보 보존*

**한 patch (16 timestep)** 안에 *local pattern* 통째로 포함:
- *Trend* (오르락내리락).
- *Periodicity* (주기적 변동).
- *Spikes* (이상 값).

**한 timestep** 만 보면 *이 patterns 안 보임*.

**일상 비유**: 음악 마디 단위로 들으면 *멜로디* 보임. 한 음표만 들으면 *멜로디* 안 보임.

---

## 4.7 Patch → Token Embedding

Patching 후 각 patch 를 *Transformer 가 이해하는 token* 으로 변환.

### 방법 — Linear Projection

각 patch (16 timestep) → *D 차원 vector* (예: D = 128).

**일상 비유**: 책의 *각 단어* 를 *embedding vector* 로 변환. NLP 의 word embedding 과 동일.

**+ Position Embedding**: 각 patch 의 *위치 정보* 도 더해줌 (Transformer 가 *순서* 알기 위해).

```viz:pat-patching:title=Patching 메커니즘 (interactive),caption=시계열 L=336 → P=16, S=8 으로 자른 N=42 토큰. 토글로 overlap (P=16 S=8) vs non-overlap (P=12 S=12) 비교. 점선 박스가 한 patch.
```

---

## 4.8 Patch Length 선택 — Robust?

**Figure 4 (paper p.15)**: Patch length $P \in \{2, 4, 8, 12, 16, 24, 32, 40\}$ 의 MSE 비교.

### 📖 Figure 4 (Patch length P sensitivity) 정밀 읽는 법

**무엇이 표시되나**:
- **단일 panel** (or 여러 dataset)
- **X축**: Patch length $P$ ∈ {2, 4, 8, 12, 16, 24, 32, 40} (대수 스케일 가능)
- **Y축**: MSE (forecasting error)
- **곡선**: 다양한 dataset (Weather, Traffic, ETT 등)

**4 단계 분석**:
1. **곡선의 모양 확인**: 평탄한가? U자 형태인가? → 평탄하면 robust, U자면 민감
2. **P=16 의 위치**: 곡선의 최저점 또는 평탄 영역? → 논문 default 가 합리적인지 확인
3. **P=2 (가장 작음)**: token 수 ↑ (계산 ↑) but 정보 분산 → 보통 약간 나쁨
4. **P=40 (가장 큼)**: token 수 ↓ (계산 ↓) but 정보 응축 ↑ → 보통 약간 나쁨

**핵심 발견**:
- MSE 가 P 의 정확한 값에 **둔감** (P=4 부터 P=40 까지 거의 비슷)
- **P=16 의 선택은 robust** — 정확한 P 값 튜닝 불필요
- 다른 dataset 에서도 같은 패턴 → universal robustness

**숨은 함정**:
- "P=16 권장" 이지만 dataset 별로 약간 다를 수 있음 → 실무에선 빠른 sweep 권장
- 매우 짧은 시계열 (L=96) 에선 P=4 가 더 적합할 수 있음
- 매우 긴 시계열 (L=720) 에선 P=24 도 가능

### 🔑 핵심 통찰

> Figure 4 의 발견 (P robustness) 가 **PatchTST 실무 배포의 핵심**. 다른 시계열 transformer 모델 (Informer, FEDformer) 은 hyperparameter sensitive — PatchTST 는 robust. 운영 부담 ↓.

```viz:pat-fig4-patch-length:title=Fig 4 — Patch length P 의 effect (interactive),caption=P=2-40 sweep. MSE 가 P 에 둔감. P=16 의 robust 선택 정량.
```

---

## 4.9 자기점검

### 핵심 5가지

1. **Patching 의 일상 비유?**
2. **"PatchTST/42" 의 42 의 의미?**
3. **Patching 의 3가지 이점?**
4. **Overlap (S<P) vs Non-overlap (S=P) 의 선택 기준?**
5. **Patching 의 robustness — 왜 P 값에 둔감한가?**

### 답변

1. **긴 책 (336 페이지) 을 *한 단어 (16 페이지) 씩* 읽는 것**. 한 글자씩 (1 timestep) 이 아니라 *단어 단위* (16 timestep patch) 로. ViT (image 16x16 patching) 의 시계열 버전. 음악 *마디* 단위로 듣는 것과 같음. **NLP 와의 유사성**: BERT, GPT 가 word/subword 단위, PatchTST 가 patch 단위 — 같은 패러다임. **CV 와의 유사성**: ViT (2020) 가 image 를 16x16 patch 로 나눠 transformer 적용. PatchTST 가 시계열에 그대로 transfer.

2. **시계열을 *42개 patch* 로 자른 setting**. $L = 336, P = 16, S = 8$ → $N = \lfloor (336-16)/8 \rfloor + 2 = 42$. PatchTST/**64** 는 $L = 512$ 의 setting → $N = 64$. **논문 제목 "A Time Series is Worth 64 Words" 의 64 = 64 patch**. **이름의 의미**: 모델 size 가 아니라 **token 수** 표기 — NLP 의 transformer 분류 (BERT-base, GPT-3.5 등) 와 다른 표기 convention.

3. **(1) Attention 22× 빠름**: token 수 $L = 336$ → $N = 42$ → attention 복잡도 $O(L^2) \to O(N^2)$ = $112,896 \to 1,764$, 이론 64× 효율, 실측 22× (Traffic). **(2) Longer history**: 같은 compute 로 $L = 336$ 또는 512 가능 (vs no patching 의 96 만). $L$ 늘릴수록 MSE 감소 (Table 1: 0.518 → 0.397, 23% 향상). **(3) Local pattern 보존**: 한 patch 안에 *trend, periodicity, spike* 통째로 — semantic unit. RNN/CNN 의 step-by-step 처리는 이 패턴 분산.

4. **Overlap ($S < P$, supervised default)**: P=16, S=8 → 인접 patch 50% 겹침. **장점**: 정보 유실 ↓, 경계 패턴 보존. **단점**: 토큰 수 ↑ → 계산 약간 ↑. **Non-overlap ($S = P$, self-supervised default)**: P=12, S=12 → 정확히 인접, 겹침 X. **장점**: Mask 한 patch 가 다른 patch 와 정보 공유 X → 학습 목표 명확 (BERT masked language modeling 처럼). **선택 기준**: Supervised forecasting → overlap (정보 보존), Masked pre-training → non-overlap (학습 신호 명확).

5. **Figure 4 의 발견**: P ∈ {2, 4, 8, 12, 16, 24, 32, 40} sweep → MSE 가 P 값에 **거의 둔감**. P=4 부터 P=40 까지 비슷한 성능. **이유**: (i) Attention 이 patch 내부 정보를 자동으로 결합 → P 의 정확한 크기보다 attention 패턴이 더 중요, (ii) Linear projection 이 다양한 P 에 robust 한 representation 학습, (iii) 시계열의 시간 patterns 가 multiple 시간 척도에 존재 — 어느 P 선택해도 일부 패턴 capture. **실무 의미**: P=16 권장 but 정확한 튜닝 불필요 — robust 한 hyperparameter.

---

다음 챕터: [05_channel_independence.md](05_channel_independence.md) — Channel-Independence 메커니즘.
