# 09 · 내 연구와의 연결

> **방법**: `_profile.md` 의 §A~F 관심 영역과 보유 자산 (🟢 Grokking in TS Transformers, 🟢 APF, ⏸ P1 ProTran-TFA, 🔴 EOA, ⏸ P2 Autonomous Research Loop) 의 *구체적 mechanism / axis / 수식 요소* 를 지정해 연결. 일반론 금지. 본 논문이 관심 영역과 충돌하는 곳은 솔직히 표기.

---

## 1) 매핑 정리

| 본 논문 요소 | 직접 연결 자산 | 매칭 강도 | 사용 형태 |
|--------------|---------------|-----------|----------|
| sparse vs dense subnetwork 경쟁 | 🟢 **Grokking in TS Transformers** | ★★★★★ | 핵심 *가설 substrate* |
| 뉴런 노름 시계열 측정 | 🟢 **Grokking** + 🟢 **APF** | ★★★★ | *progress measure* 후보 |
| circuit_discovery_binary (norm-ranked masking + binary search) | 🟢 **APF** (motif 의 attention head 인덱싱) | ★★★★ | *primitive 차용* |
| ArityFinder (per-neuron input dependency) | 🟢 **Grokking** | ★★★ | *regime detector* 측정 도구 |
| sparse parity task | (직접 substrate 아님) | ★★ | *비교 baseline* 으로만 |
| FF1 minimal architecture | (사용 안 함, depth 부족) | ★ | 의미 없음 |

---

## 2) 흡수할 기법

### 흡수 1 — `circuit_discovery_binary` 의 *시간 시계열 회로 발견* 패러다임을 Grokking in TS Transformers 의 **week 1-3 setup** 에 직접 차용

사용자 보유 자산 `Grokking in Time Series Transformers/paper/PAPER_PLAN.md` 의 P2 logistic 4-layer 실험에서, train acc 가 plateau 한 뒤 test acc 가 jump 하는 *grokking-like* 신호를 본 환경에서 측정해야 함. 이때 표준은 acc/loss curve 만 보는 것이지만, 본 논문 protocol 을 그대로 **회로 차원** 측정으로 격상:

- TS transformer 의 hidden state $h_l(t) \in \mathbb{R}^{d_{\text{model}}}$ 각 차원에 대해 **L2 노름 시계열** $\eta_j^{(l)}(t) := \|h_l^{(t)}[j,:]\|_2$ (단, MLP 가 아니라 attention 의 경우 head-별 노름, FFN 의 경우 hidden activation 의 차원별 노름).
- **단조성 가정 + binary search** 로 epoch 별 *최소 활성 차원 수* $k^\star(t)$ 측정. faithfulness = "원본 forecast 와의 sign 또는 quantile bin 일치율".
- TS forecasting 에서 sign-equality 가 부적절하면 — **quantile-bin agreement** (forecast 분포의 5/50/95 percentile 의 같은 bin) 으로 metric 교체. 이 metric 은 ProTran 의 distributional forecast 와 직접 호환.

→ Grokking in TS Transformers 의 §3 (방법론) 또는 §4 (실험 setup) 의 "회로 측정 도구" 절을 본 논문 식 4 종 시계열로 명시.

### 흡수 2 — Norm bimodality 를 grokking *예측 지표* 로 재포지셔닝

본 논문이 노름 양극화를 *현상 관측* 으로 봤다면, 사용자 TS 트랙에선 *조기 예측 지표* 로 사용. 학습 중 hidden dim 노름의 분포가 *bimodal* 화하기 시작하는 epoch — 변동계수 (CV) 또는 Kullback-Leibler divergence to uniform — 가 phase transition *예고* 인지 검증.

- Hypothesis: $\mathrm{KL}(p_{\eta}(t) \| p_{\text{uniform}}) > \tau$ 가 되는 첫 epoch $t^\star$ 이 grokking 시작 epoch 의 *N step 선행 지표* (N 의 값은 데이터 의존).
- 데이터: P2 logistic map (이미 보유) + ETT-mini regime-switching.
- 활용: NeurIPS 2027 plan 의 *"regime detection grokking"* 가설의 progress measure 로 차용 가능 — Nanda 2023 progress measure 의 *TS* 변형.

### 흡수 3 — APF 의 motif causal intervention 의 *시간축 확장*

APF 트랙의 `motif causality 실험 진행 중` 상태에서, motif 자체를 *학습 끝* 모델에서만 측정하는 한계가 있음. 본 논문의 epoch 별 sparse subnetwork 측정 protocol 을 attention motif 에 옮기면:

- "epoch 별 attention head 노름 시계열" → motif intensity 의 시간 진화 추적.
- "motif faithfulness" — 특정 motif (diagonal/stripe/block) 만 활성화한 forward 가 원본과 일치하는 비율 의 시계열.
- "motif arity" — 각 motif 가 진짜 의존하는 input position 수.

이 시간축 확장이 APF 의 *static* motif typology 를 *dynamic* mechanism 으로 격상시키는 다리.

---

## 3) 충돌·경쟁 지점

### 충돌 1 — TS forecasting 의 "sparse subnetwork = generalizing" 가설은 부정될 수 있다

본 논문의 핵심 가설은 "sparse = 일반화, dense = 외우기". 그러나 *TS forecasting* 에선 일반화 회로가 sparse 하지 *않을* 가능성:

- non-stationarity 가 있으면 regime-specific *복수* sparse 회로의 *혼합* 이 일반화일 수 있음 (mixture-of-experts 식).
- 이 경우 "single sparse subnetwork" frame 이 부적합 → 본 논문의 frame 을 그대로 차용하면 *false negative* (회로 경쟁 미검출) 위험.

→ 사용자 트랙의 응답: "sparse-mixture vs dense" 의 3-population view 로 확장. 본 논문의 binary search 를 *복수 sparse cluster* 의 spectral clustering 으로 교체. NeurIPS 2027 plan 의 §3 에 *명시적 차별화* 로 등록.

### 충돌 2 — Hinge loss 의존의 한계

본 논문의 결과는 hinge + SGD + weight decay 의 *조합 특화*. 사용자의 TS forecasting 은 **MSE / NLL / quantile loss + Adam** 이 표준 — 본 논문의 norm bimodality 가 그대로 보존된다는 보장 없음.

→ 사용자 트랙의 응답: 첫 step 으로 P2 logistic map 에서 (a) Adam + MSE, (b) Adam + Huber, (c) SGD + MSE 의 3 setup 비교하여 norm bimodality 가 어디서 살아남는지 검증. 살아남지 않으면 본 논문 protocol 의 *광학* 한계 솔직 인정 → P1 ProTran 의 quantile loss 와 weight decay 의 결합 설정에서 다시 시험.

### 충돌 3 — Workshop paper 의 인용 적합성

본 논문은 ICLR 2023 워크샵 페이퍼. NeurIPS 2027 main track 의 *방법론* 인용 시 reviewer 가 "워크샵 페이퍼" 라는 이유로 약하게 볼 위험. 대안:
- 본 논문을 *원형 reference* 로 인용하되, 사용자가 같은 protocol 의 *TS 확장* 을 NeurIPS-quality 결과로 만들어 *후손 매김*.
- 또는 본 논문 인용 + 같은 결과를 main-track quality 로 재현한 *후속 main-track paper* (예: Bridging Lottery Ticket and Grokking arXiv:2310.19470) 를 *교차 인용*.

---

## 4) 인용 포인트 — 실제 사용자 논문 어디에 어떻게 인용할지 초안

### NeurIPS 2027 (Grokking in TS Transformers) §2 Related Work — 회로 경쟁 view 의 출처

> "While most grokking literature treats the phase transition as a phenomenon on the loss curve (Power et al., 2022; Liu et al., 2022) or as a progress measure on a single discovered circuit (Nanda et al., 2023), **Merrill, Tsilivis, and Shukla (2023)** reframe the phase transition itself as a **competition** between two functionally distinct subnetworks — a dense memorizing subnetwork and a sparse generalizing subnetwork. Our work extends this circuit-competition view to time-series forecasting, where the natural sparse structure of stationary periodic components must compete with the dense memorization of regime-specific samples under non-stationarity."

### NeurIPS 2027 §3.X Methodology — 회로 측정 primitive 의 차용

> "Following the norm-ranked subnetwork discovery protocol of Merrill et al. (2023) [Equation/§3 of their paper], we define the per-epoch effective circuit size $k^\star(t)$ as the smallest top-$k$ neurons (by hidden-state L2 norm) whose masked forward agrees with the full-model forecast above the agreement threshold $\tau$. **Unlike their binary-label sign-equality criterion, we use quantile-bin agreement** to accommodate distributional forecasts (cf. ProTran [Tang & Matteson, 2021]), ensuring metric coherence with our downstream evaluation."

### TMLR backup (APF) §X Attention motif dynamics

> "We extend the static motif typology of Yang et al. (TAPPA, ICLR 2026) and Kalnāre et al. (2025) into a **temporal axis** by adapting the epoch-wise norm-bimodality analysis of Merrill, Tsilivis, and Shukla (2023). Where they trace the emergence of a sparse subnetwork in a single 2-layer MLP, we trace the emergence of a sparse motif-set across attention heads of a TS transformer, providing the first dynamic account of *when* a particular motif (diagonal, stripe, block) becomes load-bearing during training."

---

## 5) 반면교사 — 본 논문이 못한 것을 사용자가 어떻게 다룰지

| 본 논문의 부재 | 사용자의 응답 |
|----------------|---------------|
| Single task (sparse parity 만) | TS forecasting 3 substrate (logistic, regime-switching synthetic, ETT) 로 *3× 일반화* |
| Single architecture (FF1) | Transformer + LN + residual 의 full encoder-decoder 까지 격상 |
| 인과 개입 부재 (관측만) | 노름 강제 고정 / 마스킹 시간 개입 실험 추가 (do-calculus 식) |
| Sparse → generalizing 의 binary frame | Sparse-mixture (regime별 회로) vs dense-memorization 의 *3-population* view |
| Workshop 길이 (4 page 추정) | Main track 분량의 *완전* ablation (n, k, width, lr, wd, optimizer, loss sweep) |
| DNF 닮음 분석은 *근사적* | Truth-table enumerate + boolean circuit synthesis 의 *정확* 비교 (TS 의 경우 *regime decomposition 의 정확 형태* 분석) |

---

## 6) 한 줄 요약 — 본 논문이 사용자 연구 지도에서 차지하는 자리

> **Grokking active track 의 *회로 경쟁* substrate 의 mechanism-level seed.** Power 2022 의 phenomenon + Nanda 2023 의 progress measure + Lyle 2025 의 non-stationarity 사이의 *왜 phase transition 인가* 의 빈 자리에 직접 핀으로 꽂힐 논문. 사용자의 NeurIPS 2027 plan §2 Related Work 에 *6 번째 must-cite* 로 즉시 등록 가능. TMLR backup 의 APF motif 동학 분석에는 *primitive (norm-ranked masking + faithfulness + arity)* 의 직접 차용.
