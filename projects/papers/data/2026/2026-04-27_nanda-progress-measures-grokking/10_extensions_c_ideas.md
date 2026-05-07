# 9. 사고 확장 (c) — 후속 실험 아이디어 2개

> 사용자가 *직접* 시도해볼 만한 실험 두 개. 각 아이디어는 가설 / 데이터 / 비교 조건 / 예상 결과 / 반증 조건 / 비용 추정.

---

## Idea 1. *Logistic-map 위 progress measure 의 regime-conditional 검증*

### 가설

Logistic map $x_{t+1} = r x_t (1-x_t)$ 의 동학을 학습한 transformer 가, $r$ 이 *bifurcation 점* 을 통과할 때마다 *회로의 frequency 집합 $K$* 이 변한다. 즉:

- $r < 3$: fixed point. $K \approx \emptyset$ (DC 만).
- $3 \leq r < 3.45$: period-2. $K = \{1/2\}$ (frequency in normalized unit).
- $3.45 \leq r < 3.54$: period-4. $K = \{1/4, 1/2\}$.
- $r > 3.57$: chaos. $K$ 가 broadband.

본 논문의 *fixed K* 가정이 이런 regime-shift 환경에서 깨질 것을 검증한다.

### 데이터

- 합성 logistic map trajectory. $r$ 을 학습 도중 *천천히* 변화 ($r(t) = 2.8 + 0.8 \cdot t/T$).
- 초기 $r$ 은 stable, 후기 $r$ 은 chaotic. 학습 종료 시 모델은 chaotic regime 의 다음 step 을 예측.

### 비교 조건

- 조건 A: $r$ 고정 ($r=3.7$, chaotic 직전 region) 에서 학습. Nanda-style fixed K 적용.
- 조건 B: $r$ 가 시간에 따라 변화. windowed $K_t$ 적용.
- 조건 C: $r$ 가 *잡음* 추가 (regime detection 어려움) 위에서 학습.

각 조건에서 (i) test loss trajectory, (ii) $\mathcal{L}_{\text{res}}(t)$, (iii) $\mathcal{L}_{\text{exc}}(t)$, (iv) $G(t)$ 를 매 100 step 측정.

### 예상 결과

- 조건 A: Nanda 와 동일. 단조 progress measure, 깔끔한 3-phase.
- 조건 B: $K_t$ 가 bifurcation 점에서 *jump*. progress measure 가 *piecewise* 단조 — 각 regime 안에서는 단조, regime 변경 시 *re-grokking*.
- 조건 C: 잡음 강도가 클수록 progress measure 의 단조성이 약화 — 학습이 *각 regime 마다 partial circuit* 만 형성.

### 반증 조건

만약 조건 B 에서 $K_t$ 가 bifurcation 과 *무관하게* 변동하거나, 조건 A 의 깔끔한 단조 grokking 이 *재현되지 않는다면* — Nanda 의 frame 이 logistic map 에 옮겨지지 않음. 그 경우 사용자가 *왜 깨지는지* 의 메커니즘 분석 후 alternative measure 제안.

### 비용 추정

- 모델: 4-layer transformer, $d_{\text{model}}=128$, $\sim 5\cdot 10^5$ params.
- 학습: $5 \cdot 10^4$ steps, full batch (~2k samples per regime).
- GPU 시간: 단일 RTX 3090 에서 조건 당 ~2시간. 3 조건 × 5 seed → 30시간 정도. 사용자 P2 환경에서 1주.
- Plot 코드: 사용자 기존 P2 setup 에서 progress measure 만 추가. 1일.
- 총: 1.5 주.

### 이 실험이 좋은 이유

본 논문의 *direct extension* 이고, 사용자 P2 logistic 4-layer 실험과 *완벽히 정렬*. 실험 결과가 어느 방향이든 publishable — 본 논문 frame 이 잘 옮겨지면 *positive validation*, 안 옮겨지면 *gap discovery*.

---

## Idea 2. *APF motif progress measure: PE 별 motif 형성 timeline 비교*

### 가설

PE (NoPE / sinusoidal / learned / RoPE / ALiBi) 의 *선택* 이 attention motif (diagonal / stripe / block 등) 의 *형성 속도* 를 결정. 즉:

- RoPE: rotational structure 가 diagonal motif 를 *빨리* induce (low formation step).
- ALiBi: linear bias 가 stripe motif 를 dominant 로 만듦.
- NoPE: motif 형성 자체가 *늦거나 무질서* 하게.

이 가설을 Nanda-style Gini-on-Fourier-of-attention 으로 정량 검증.

### 데이터

- APF synthetic motif benchmark — trend / seasonal / regime / anomaly / freq drift 의 5 가지 motif type.
- Forecasting task: 길이 96 input → 24 output.
- 각 motif type × 각 PE = 25 조합.

### 비교 조건

- 학습 도중 *매 step* attention pattern 의 2D Fourier 분해 → Gini 측정.
- *Restricted attention loss*: attention pattern 의 *target motif Fourier component* 만 남긴 projection 의 forecasting loss.
- *Excluded attention loss*: 반대.

### 예상 결과

- RoPE × diagonal motif: 가장 빠른 Gini 상승. 학습 ~$10^3$ step 에서 saturate.
- ALiBi × stripe motif: 두 번째로 빠름. ~$2 \cdot 10^3$.
- NoPE × any motif: 매우 느림 또는 불완전 saturate. ~$10^4$ 이상 또는 saturate 못 함.
- *Cross-motif* (PE 가 motif 와 misaligned): motif 형성 지연 또는 *다른 motif 로 collapse*.

이게 검증되면, APF 의 *PE → motif 형성 dynamics* 가 *quantitative timeline* 으로 측정됨.

### 반증 조건

- 만약 *모든* PE 에서 같은 Gini trajectory 가 나오면 — PE 의 inductive bias 가 motif 형성에 *영향을 안 줌* — APF hypothesis 의 핵심이 부정됨. (사용자 가설의 negative result, 그러나 *정직한 publication 가능*.)
- 만약 Gini saturation 이 motif 형성과 *무관* 하게 변동 (예: weight norm 의 simple monotone) — measure 가 *task-specific* 정보를 못 잡음 → 다른 measure 필요.

### 비용 추정

- 모델: APF standard 4-layer transformer, $d_{\text{model}}=64$.
- 학습: 25 조합 × 5 seed × 학습 ~$2 \cdot 10^4$ step.
- GPU 시간: 한 조합 1시간 → 125 시간. RTX 3090 4 GPU 분산 시 1.5일. 단일 GPU 시 1주.
- Plot: PE 별 Gini 곡선 5개 (motif 별).
- 총: 1–2 주.

### 이 실험이 좋은 이유

APF 의 *motif causality* 다음 단계로 *motif 형성 dynamics* 를 측정 — 이건 *시간 axis* 의 새로운 contribution. Nanda 의 progress measure 가 APF 에 어떻게 *이식 가능* 한지 직접 보임. APF paper 의 강한 contribution.

---

## 종합 — 두 실험의 우선순위

- Idea 1 은 사용자 *Grokking track* 의 직접 contribution. NeurIPS 2027 target 의 *first experiment*.
- Idea 2 는 사용자 *APF track* 의 motif causality 후속. APF paper 의 §5 (motif dynamics) 에 추가.

지도교수가 두 track 중 어느 쪽으로 좁히느냐에 따라 둘 중 하나에 집중. *둘 다 1.5–2 주 내 끝나는* 분량이라, 둘 다 시도해 보고 더 깔끔한 결과 쪽으로 paper 라인 결정 가능.
