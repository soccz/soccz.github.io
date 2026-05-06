# 9. 사고 확장 (b) — Follow-up 논문 3편

> 본 논문 *전후* 의 paper 중 사용자가 다음으로 읽어야 할 3편.

---

## Follow-up 1 (선행). Liu et al. (2022) — "Towards Understanding Grokking: An Effective Theory of Representation Learning"

**무엇인가**: grokking 을 *representation manifold* 위의 phase transition 으로 모델링한 *이전* paper. order parameter 추출 시도. NeurIPS 2022.

**본 논문과의 관계**: Liu 가 phase transition 의 *추상* 을 보였고, Nanda 가 그 *구체* (Fourier circuit + 진행도) 를 닫는다. Liu 의 framework 가 *큰 그림*, Nanda 가 *세부 그림*.

**얻을 것**: 
- Representation learning 의 *phase transition* language. critical point, order parameter 의 ML 정의.
- 사용자 paper 의 *theoretical framing* 에 인용 가능 — "grokking 은 learning dynamics 의 phase transition (Liu 2022) 의 specific instantiation 에서 측정 가능 (Nanda 2023)".

**우선순위**: Tier 3, 4–6 시간 분량.

**이 논문이 사용자 work 의 어디에 들어갈지**: Grokking paper 의 §2 (Background) 에 *phase transition framework* 인용. Nanda 와 함께 *paired citation*.

---

## Follow-up 2 (경쟁). Merrill et al. (2023) — "A Tale of Two Circuits: Grokking as Competition of Sparse and Dense Subnetworks"

**무엇인가**: *sparse parity* task 위에서 grokking 을 *dense memorization circuit* + *sparse generalization circuit* 의 경쟁으로 모델링. ICML 2023 또는 NeurIPS 2023.

**본 논문과의 관계**: 동시기 *경쟁* 작업. 같은 결론 (두 circuit 의 cleanup 시간 비대칭) 을 *다른 task* 에서 도출. Nanda 가 *closed form* 으로 회로를 보였고, Merrill 이 *task family generality* 를 보였다.

**얻을 것**:
- Sparse parity 라는 *다른* algorithmic task 에서의 회로 — 회로 형태가 task 마다 어떻게 변하는지.
- Two-circuit 경쟁 이론의 *수식적 정리* — Nanda 보다 *동학식* 측면을 더 명시적으로 다룸.
- 사용자가 logistic map 위에서 같은 frame 을 적용할 때, *Merrill 의 sparse/dense decomposition language* 가 *Nanda 의 Fourier/non-Fourier decomposition language* 보다 더 일반화 가능.

**우선순위**: Tier 3, Grokking track 의 next-target literature.

**이 논문이 사용자 work 의 어디에 들어갈지**: Grokking paper 의 §3 (Method) 에 두 circuit 경쟁 frame 을 인용 — "Following Merrill et al. (2023) and Nanda et al. (2023), we model the learning dynamics as a competition between a memorization circuit (high-norm, dense) and a generalization circuit (low-norm, structured)".

---

## Follow-up 3 (후속). Lyle et al. (2025) — "Grokking and Primacy Bias in Continual Learning"

**무엇인가**: Continual learning setting 에서 grokking 이 어떻게 변하는지. Non-stationarity 가 본 논문의 깔끔한 3-phase 를 어떻게 *재배열* 하는지. 2025 paper. (사용자 priority list 에 등재됨.)

**본 논문과의 관계**: 본 논문 frame 의 *직접적 generalization*. Stationary task 에서 non-stationary task 로 옮기면, cleanup phase 가 *task switch* 와 얽히면서 회로의 *primacy bias* (먼저 본 task 가중치가 우선) 가 발생. 이건 사용자 Grokking track 의 *non-stationarity 측 핵심 문제* 와 정확히 같은 question.

**얻을 것**:
- Non-stationarity 가 progress measure 에 어떻게 영향을 주는지 — 본 논문의 *fixed K* 가정이 어떻게 깨지는지.
- TS forecasting 의 *regime shift* 와 continual learning 의 *task switch* 의 동형성. 사용자 paper 가 *finance non-stationarity* 와 연결할 수 있는 방법론적 다리.
- 본 사용자 thesis 의 *직접 prior work* 가 됨 — Lyle 2025 위에 사용자가 한 단계.

**우선순위**: Tier 1 (사용자 priority list 에 이미 등재). Grokking track 의 *most-direct prior*.

**이 논문이 사용자 work 의 어디에 들어갈지**: Grokking paper 의 §1 (Introduction) 의 *gap statement* 에 핵심 인용 — "Lyle et al. (2025) extended Nanda's progress measures to continual learning, observing primacy bias. We extend further to *intrinsically non-stationary* time-series forecasting, where the regime shift is not externally imposed but emerges from the data-generating process itself."

---

## 종합 — 4편의 reading order

사용자가 *이미 읽은* Power 2022 + *오늘 다룬* Nanda 2023 위에:

1. **Liu 2022** (4시간) — phase transition framework.
2. **Merrill 2023** (4–6시간) — two-circuit decomposition.
3. **Lyle 2025** (6–8시간) — non-stationarity 일반화.

이 3편을 다 읽으면 Grokking track 의 *literature 척추* 가 완성된다 (총 22 must-cite 중 핵심 4편 + 본 논문). 다음 코어 버킷 월요일에 위 3편 중 하나가 후보.
