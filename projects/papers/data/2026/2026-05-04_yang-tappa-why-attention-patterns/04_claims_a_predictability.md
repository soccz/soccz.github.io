# 04. 핵심 Claim 해체 — Part A (예측가능 / 불가능 이분법)

## 배경 사다리

본 절을 이해하려면 ① 시계열의 **자기유사도** (autocorrelation 또는 cosine similarity 의 lag 함수) 가 "신호가 시간이 지나도 자기 자신과 닮은 정도" 라는 것, ② attention 확률 분포 $\alpha_t = \mathrm{softmax}(q_t^\top K / \sqrt{d})$ 가 step 마다 새로 계산된다는 것 — 두 개면 충분.

---

## Claim 1 — 예측가능 / 불가능 이분법 (Predictability dichotomy)

### 주장

**모든 attention 패턴은 두 부류로 나뉜다: (a) clear regularity 가 있어 다음 step 의 패턴을 직전 step 들로부터 예측할 수 있는 "predictable patterns", (b) effectively random 으로 보여 그런 예측이 의미 없는 "unpredictable patterns".**

### 증거

저자들의 framing 글 (abstract + intro 추정 본문) 에서 직접: *"Attention patterns can be characterized as predictable patterns with clear regularities and unpredictable patterns that appear effectively random, and this distinction can be explained by the degree of query self-similarity along the temporal dimension."* 정량적으로는 layer × head 단위 attention map 시퀀스 $\{\alpha^{(l,h)}_t\}_{t=1}^T$ 에 대해 예측가능성 척도 (필자 추정: time-series 자기상관 또는 next-step KL 거리) 를 측정한 후, 이를 query self-similarity $S(\Delta t)$ 와 회귀하는 그림이 본문에 있을 것 (스니펫 미확보).

### 숨은 전제

- **Query 시계열이 충분히 길다** — 짧은 seq (예: $T < 64$) 에서는 자기유사도 추정 noise 가 신호를 압도. 본 논문은 LLM long-context 가정 (수천~수만 token).
- **Attention 패턴이 "stationary 또는 slowly varying" 하다** — predictable / unpredictable 이분법 자체가 패턴이 단일 구조를 유지한다는 가정. 만약 head 가 phase 마다 다른 패턴을 띠면 (multi-modal) 이 분류가 무너짐.
- **Self-similarity 가 충분 통계량 (sufficient statistic) 으로 본다** — 사실 query 시계열의 통계량은 자기유사도 외에도 (variance, drift, burstiness 등) 많은데, 저자는 self-similarity 한 차원으로 환원.

### 쉬운 말 풀이

말하자면 "이 head 는 비슷한 일을 계속 반복하나? 아니면 매번 새로운 일을 하나?" 라는 질문에 한 줄짜리 점수를 매기면, 그 점수가 높으면 attention 모양이 늘 비슷해 (predictable), 낮으면 매번 들쭉날쭉 (unpredictable) 이라는 주장. 그리고 "비슷한 일을 반복하는" head 는 패턴이 정해진 모양으로 수렴하기 때문에 그 모양을 이론적으로 도출할 수 있다 — 이것이 Claim 2~4 로 이어진다.

### 비판 지점

이 이분법이 **완전 이항** 인지 **연속 spectrum** 인지 본문이 어떻게 정리하는지가 관건. 만약 spectrum 이라면 "어디부터가 predictable 인가" 의 threshold 가 hyperparameter 가 되고, 그 hyperparameter 가 task/model 의존이라면 metric 의 일반성이 약해진다. KV cache 응용에서 layer-wise score $S_l$ 을 직접 budget 함수로 쓰는 것을 보면 저자들은 spectrum 으로 다루는 것 같으나, 그렇다면 "이분법" 이라는 강한 framing 이 marketing 에 가까워진다.
