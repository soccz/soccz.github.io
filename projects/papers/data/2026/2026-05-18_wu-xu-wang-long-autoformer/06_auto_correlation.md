# 06. Auto-Correlation 메커니즘 (★ 가장 핵심) — Eq 5-7

> **🧒 한 줄 요약**: FFT-based auto-correlation. Self-attention 의 series-aware variant.


> 본 논문의 *두 번째 큰 contribution*. Self-attention 의 *완전 대체*. *Point-wise → series-wise* 의 paradigm shift.

---

## 6.1 챕터 한 줄 요약

> **"Self-attention 의 *점 별 비교 (point-wise dot product)* 를 *조각 별 비교 (series-wise Auto-Correlation)* 으로 *통째로 교체*. (1) FFT 로 autocorrelation 계산 → Top-k 주기 발견, (2) Roll 으로 sub-series 정렬, (3) Softmax weight 로 aggregation. $O(L \log L)$ + 정확도 우월."**

---

## 6.2 Figure 2 — Auto-Correlation + Time Delay Aggregation (★ 핵심 그림)

![Figure 2 — Auto-Correlation + Time Delay Aggregation](figures/page5_Fig2_autocorr.png)

*paper p.5 Figure 2.*

### 어떻게 읽나? (Step-by-step)

**Step 1 — 좌측 panel (Auto-Correlation 계산 구조)**:
- *Q, K, V*: encoder/decoder 에서 받은 query, key, value.
- *Linear*: 각각 linear projection 통과.
- *FFT* (Q + K): 두 input 의 FFT.
- *Conjugate (K)*: K 의 FFT 의 complex conjugate.
- *× (곱)*: $\mathcal{F}(Q) \cdot \mathcal{F}(K)^*$ — autocorrelation 의 *주파수 영역 형태*.
- *Inverse FFT*: IFFT — *시간 영역 의 R(τ)* 복원.
- *Top-k*: $R(\tau)$ 의 *가장 큰 k 값* 의 *τ 들* 선택.
- *Time Delay Aggregation*: 선택된 $\tau$ 로 *Roll + 가중 합*.

**Step 2 — 우측 panel (Time Delay Aggregation 시각화)**:
- *원본 시계열* (위) + *τ_1, τ_2, ..., τ_k 만큼 Roll 된 sub-series 들* (아래).
- 각 $\text{Roll}(V, \tau_i)$ 에 *Softmax(R(τ_i))* weight 적용.
- *Fusion*: 모두 합쳐 *최종 output*.

**Step 3 — 핵심 메시지**:
- Self-attention 처럼 *점 별 dot product* 계산 X.
- 대신 *조각 별 Roll + weighted sum*.
- 즉 *주기 별 (period-wise) aggregation*.

```viz:autoformer-fft-acorr:title=Auto-Correlation FFT 계산 (interactive),caption=FFT(Q) × Conj(FFT(K)) → IFFT → R(τ) 모든 lag 한 번에 계산.
```

```viz:autoformer-topk-delays:title=Top-k Time Delay Aggregation (interactive),caption=R(τ) Top-k 선택 → Roll(V, τ_i) → Softmax weight → 합쳐서 output.
```

---

## 6.3 Self-Attention vs Auto-Correlation — 일상 비유

### 비유 1 — *점 별 비교 vs 조각 별 비교*

**Self-Attention** (point-wise):
- 시계열 의 *각 시간 점* 이 *다른 모든 시간 점* 과의 *관계* 측정.
- 예: *오늘 오전 9시 의 값* 이 *어제 오후 3시 의 값* 과 *얼마나 관련?*

**Auto-Correlation** (series-wise):
- 시계열 의 *24시간 sub-series* 가 *어제 의 24시간 sub-series* 와 *얼마나 관련?*
- 즉 *조각 vs 조각*.

### 비유 2 — *음악 의 패턴 비교*

음악 *한 마디 (4박자) 의 멜로디* 와 *다음 마디* 비교:
- *Self-attention*: *4박자 의 각 음표* 와 *다른 모든 음표* 비교.
- *Auto-Correlation*: *4박자 마디 전체* 와 *다른 4박자 마디 전체* 비교.

음악 의 *반복 구조* (주기성) 는 *마디 단위* 가 자연스러움.

### 비유 3 — *글 의 문단 비교*

긴 문서 의 *비슷한 문단 찾기*:
- *Self-attention*: 각 *단어* 가 *다른 모든 단어* 와 비교.
- *Auto-Correlation*: 각 *문단* 이 *다른 문단* 과 비교.

문서 의 *주제 구조* 는 *문단 단위* 가 자연.

---

## 6.4 Equation 5 — Autocorrelation 정의

### Equation 5 (paper p.5) — Stochastic Process 의 Autocorrelation

$$
R_{\mathcal{X}\mathcal{X}}(\tau) = \lim_{L \to \infty} \frac{1}{L} \sum_{t=1}^{L} X_t X_{t-\tau}
$$

**기호 뜻**:
- $\{X_t\}$: discrete-time stochastic process (시계열).
- $\tau$: time-delay (시간 지연).
- $R_{\mathcal{X}\mathcal{X}}(\tau)$: $\tau$ 에서의 *autocorrelation*.
- *Sum*: $X_t$ 와 *$\tau$ 만큼 전의 값 $X_{t-\tau}$* 의 *곱 의 평균*.

**일상 비유**: 
- *$\tau = 24$h*: *오늘 12시 의 값* 와 *어제 12시 의 값* 의 *유사도*. 매일 출근 패턴 이 비슷하면 *$R(24)$ 크다*.
- *$\tau = 168$h (1주일)*: *오늘 의 패턴* 과 *지난 주 같은 요일* 의 유사도.

**왜 이 형태?**: *Stochastic process theory* 의 *autocorrelation 의 표준 정의* (Chatfield 1981, Papoulis-Saunders 1989).

**조심할 점**: $L \to \infty$ 의 *limit* — 실제로는 *유한 L* 사용. 그래서 *추정치 (estimate)*.

### 직관 — *R(τ) 가 큰 τ = 주기*

$R(24) = 0.9$ (매우 큰 값) → *24 시간 주기성 강함* → *Top-k 의 첫 번째 $\tau$* 후보.

본 논문 Auto-Correlation 은 *Top-k 의 큰 R 값 의 τ 들* 만 *사용* — *진짜 주기 만 활용*.

---

## 6.5 Equation 6 — Auto-Correlation Mechanism (★ 핵심)

### Equation 6 (paper p.5) — Time Delay Aggregation

$$
\tau_1, \ldots, \tau_k = \arg\text{Topk}_{\tau \in \{1, \ldots, L\}} (R_{\mathcal{Q}, \mathcal{K}}(\tau))
$$
$$
\hat R_{\mathcal{Q}, \mathcal{K}}(\tau_1), \ldots, \hat R_{\mathcal{Q}, \mathcal{K}}(\tau_k) = \text{SoftMax}(R_{\mathcal{Q}, \mathcal{K}}(\tau_1), \ldots, R_{\mathcal{Q}, \mathcal{K}}(\tau_k))
$$
$$
\text{Auto-Correlation}(\mathcal{Q}, \mathcal{K}, \mathcal{V}) = \sum_{i=1}^{k} \text{Roll}(\mathcal{V}, \tau_i) \cdot \hat R_{\mathcal{Q}, \mathcal{K}}(\tau_i)
$$

**기호 뜻**:
- $\mathcal{Q}, \mathcal{K}, \mathcal{V}$: query, key, value (self-attention 처럼).
- $R_{\mathcal{Q}, \mathcal{K}}(\tau)$: $\mathcal{Q}$ 와 $\mathcal{K}$ 의 *cross-correlation* (Q=K 이면 self-correlation).
- $\arg\text{Topk}$: $R$ 값 의 *가장 큰 k 개 의 τ*.
- $\hat R$: $R$ 값 의 *softmax normalization* (확률 분포).
- $\text{Roll}(\mathcal{V}, \tau)$: $\mathcal{V}$ 를 $\tau$ 만큼 *cyclic shift*.
- $k = \lfloor c \log L \rfloor$: paper default $c = 1 \sim 3$ (hyperparameter).

**일상 비유**:
- **Step 1 (Topk)**: *진짜 주기 만 골라*. 예: 24시간 주기, 168시간 주기.
- **Step 2 (Softmax)**: 각 주기 의 *중요도 (가중치)* 결정.
- **Step 3 (Roll + Sum)**: 각 주기 만큼 *Value 를 옮긴 후* *가중 합* — *같은 phase 의 sub-series 들 의 aggregation*.

**왜 이 형태?**:
- *Topk*: *모든 lag* (1 ~ L) 사용 시 *noise 포함*. *Top-k 만 진짜 주기*.
- *Softmax*: 확률 분포 → *각 주기 의 상대적 중요도*.
- *Roll*: cyclic shift 로 *length 유지* + *주기성 자연 활용*.
- *Sum*: 여러 주기 의 *조합* 활용.

**조심할 점**: 
- $k = c \log L$ 의 *log-scale* — *L 늘어도 k 안 폭증* — *효율*.
- *Cross 모드* (Q ≠ K) 도 같은 공식 — encoder-decoder 의 *cross-attention 자리* 에 그대로.

---

## 6.6 Multi-head Auto-Correlation — Eq 7

### Equation 7 (paper p.6) — Multi-head

$$
\text{MultiHead}(\mathcal{Q}, \mathcal{K}, \mathcal{V}) = W_{\text{output}} \cdot \text{Concat}(\text{head}_1, \ldots, \text{head}_h)
$$
$$
\text{where } \text{head}_i = \text{Auto-Correlation}(\mathcal{Q}_i, \mathcal{K}_i, \mathcal{V}_i)
$$

**기호 뜻**:
- $h$: head 수 (paper default = 8).
- $\mathcal{Q}_i, \mathcal{K}_i, \mathcal{V}_i \in \mathbb{R}^{L \times \frac{d_{\text{model}}}{h}}$: head $i$ 의 input.
- $W_{\text{output}} \in \mathbb{R}^{d_{\text{model}} \times d_{\text{model}}}$: output projection.

**일상 비유**: 
- *Single head*: 한 관점 의 주기성.
- *Multi-head (8 head)*: *8 가지 관점* 의 주기성 — *24시간, 168시간, 일별 다른 주기, …*.
- *Concat + projection*: 8 관점 의 *통합*.

**왜 multi-head?**: Self-attention 의 *multi-head* 정신 그대로. *여러 관점* 동시 학습.

---

## 6.7 Figure 3 — Self-Attention 4 변형 vs Auto-Correlation 비교

![Figure 3 — Auto-Correlation vs Self-Attention](figures/page6_Fig3_attention_compare.png)

*paper p.6 Figure 3.*

### 어떻게 읽나?

**Step 1 — 4 sub-panel**:
- **(a) Full Attention**: 모든 점 끼리 *full connection*. $O(L^2)$.
- **(b) Sparse Attention**: 일부 점 선택 (ProbSparse 같은). $O(L \log L)$.
- **(c) LogSparse Attention**: log 간격 선택. $O(L (\log L)^2)$.
- **(d) Auto-Correlation**: *주기 별 sub-series 끼리* 연결. $O(L \log L)$.

**Step 2 — 시각적 차이**:
- (a, b, c) 모두 *점 끼리* 의 연결.
- (d) 만 *조각 (Period 1, Period 2, ...) 끼리* 의 연결.

**Step 3 — 핵심 메시지**:
- 기존 *점-wise* 변형 들 (a, b, c) 모두 *information bottleneck*.
- Auto-Correlation 만 *series-wise* — *주기성 활용*.

→ **본 논문 의 *paradigm shift* 의 시각적 증명**.

---

## 6.8 Auto-Correlation 의 *2 가지 모드*

### Mode 1 — Self Auto-Correlation

Encoder/Decoder 의 *self-attention 자리* 에서:
- $\mathcal{Q} = \mathcal{K} = \mathcal{V}$ from same source.
- $R_{\mathcal{X}\mathcal{X}}(\tau)$ = autocorrelation (Eq 5).

**일상 비유**: 자기 자신 의 *과거 패턴 끼리 비교* — *나 의 24시간 전 vs 나 의 지금*.

### Mode 2 — Cross Auto-Correlation

Decoder 의 *cross-attention 자리* 에서:
- $\mathcal{Q}$ from decoder, $\mathcal{K}, \mathcal{V}$ from encoder.
- $R_{\mathcal{Q}, \mathcal{K}}(\tau)$ = cross-correlation.

**일상 비유**: *미래 예측 자리 (decoder)* 가 *과거 정보 (encoder)* 를 *주기 별 sub-series 로 조회*.

### 통일된 framework

두 모드 모두 *같은 Eq 6 형식*. 즉 *self/cross 모두 동일 mechanism* — *통일된 구현*.

---

## 6.9 자기점검

### 핵심 3가지
1. **Self-attention vs Auto-Correlation 의 *근본 차이*?**
2. **Eq 6 의 *3 단계 (Topk → Softmax → Roll+Sum)* 의 의미?**
3. **Multi-head Auto-Correlation 의 직관?**

### 답변
1. **Self-attention: *점 별 비교* ($Q \cdot K^T$ 의 *dot product*) — 각 시간 점 이 다른 모든 시간 점 과 비교**. **Auto-Correlation: *조각 별 비교* ($R(\tau) = $ 시간 지연 $\tau$ 에서의 *autocorrelation*) — 24시간 주기 의 *sub-series 끼리* 비교**. *Series-wise* 가 *시계열 의 본질적 구조 (주기성)* 활용. 음악 의 *마디 단위 비교* 와 같은 직관.
2. **(Step 1) Topk**: $R(\tau)$ 의 *가장 큰 k 개 의 τ* 선택 — *진짜 주기 만 발견* (noise 제거). $k = c \log L$ 의 log-scale. **(Step 2) Softmax**: 선택된 τ 들 의 *상대적 중요도* (확률 분포). **(Step 3) Roll + Sum**: 각 τ_i 만큼 *Value 를 cyclic shift* + *Softmax weight 로 가중 합*. *같은 phase 의 sub-series 들 의 aggregation*.
3. **Single head: *한 가지 주기* (예: 24시간 만) 학습. Multi-head (8 head): *8 가지 다른 주기 들* 동시 학습** — 24시간, 168시간, 일별 차이 등. *Concat + projection 으로 통합*. Self-attention 의 multi-head 정신 그대로. 시계열 의 *복합 주기성* (예: 일별 + 주간 + 월간) 을 *동시 capture*.

---

다음 챕터: [07_complexity_efficiency.md](07_complexity_efficiency.md) — FFT 기반 $O(L \log L)$ + Figure 7.


```viz:autoformer-correlation:title=paper §3.2 — Auto-Correlation,caption=Period selector.
```
