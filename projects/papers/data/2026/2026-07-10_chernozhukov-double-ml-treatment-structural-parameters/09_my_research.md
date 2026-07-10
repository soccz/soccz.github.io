# 09. 내 연구와의 연결

원거리 버킷 논문이지만 사용자 자산과 **네 곳** 에서 구체적으로 결합 가능하다. 일반론이 아니라 각 자산의 특정 섹션 · 수식 · 인터페이스에 어떻게 이식되는지 명시.

## 흡수할 기법

### 1. P1 ProTran-TFA (paused, finance venue 재개 대기) — Neyman 직교화를 quantile pinball loss 로 확장

- **위치**: `paper_test/PAPER_DRAFT_V1.md` 의 alpha detection 절 (§4 로 추정).
- **적용**: P1 ProTran-TFA 는 quantile forecast $\hat{q}_\tau(x)$ 를 pinball loss 로 학습. 이 forecast 를 factor covariate `F_t` 로 조정한 뒤 잔차 return 에 신호 `S_t` 를 붙여 alpha 를 검정하려 하면 **quantile 예측기의 편향** 이 alpha 로 흘러든다. DML PLR 의 partialling-out score `[Y - ℓ(X) - θ(D - m(X))][D - m(X)]` 를 pinball loss 대응 score `[ρ_τ(Y-\hat{q}_\tau(X)) - θ(D-\hat{m}(X))][D-\hat{m}(X)]` 로 확장하는 것이 자연스러운 이론적 정당화.
- **인용 문장 초안**: "본 논문의 alpha 검정 절차는 Chernozhukov et al. (2018) 의 double machine learning framework 을 quantile regression 으로 확장한 것이다. Neyman orthogonality condition 을 pinball loss score 함수에 적용함으로써 nuisance quantile forecast 의 편향이 alpha 계수 추정에 1차 근사로 영향을 주지 않도록 보장한다."

### 2. 2022AEL Tactical Factor Allocation (사용자 사전 독파, Saejoon Kim) — macro covariate orthogonalization

- **위치**: 2022AEL 논문의 factor timing 회귀식 `r_{i,t+1} = α_i + β_i·F_t + γ_i·M_t + ε_{i,t+1}` (M_t 는 macro state 벡터).
- **적용**: 이 회귀에서 macro state `M_t` 의 예측기 (예: BEKK · HAR-RV · macro factor autoregression) 편향이 factor 로딩 `β_i` 로 흘러드는 문제를 DML PLR 로 정확히 정식화. `Y = r_{i,t+1}, D = F_t, X = M_t` 로 매핑하고 partialling-out score 적용. 사용자 지도교수 라인의 canonical reference 가 될 수 있음.
- **인용 문장 초안**: "Saejoon Kim (2022 AEL) 의 tactical factor allocation 프레임은 macro state 조정 뒤 factor 신호 잔차의 통계적 유의성 검정을 요구한다. 본 논문은 이 절차의 double robustness 를 Chernozhukov et al. (2018) 의 partialling-out score 로 정당화한다."

### 3. AETHER (🔴 shelved, crypto cycle) — 감성 confounder 흡수

- **위치**: `AETHER_IDEA.md` §3 signal→policy pipeline.
- **적용**: AETHER 의 crypto 3-asset RL agent 가 뉴스 감성 신호 `S_t` 를 alpha 로 삼는다면, on-chain 지표 · 매크로 · SNS mention 등이 `S_t` 와 미래 수익 모두에 영향을 주는 confounder. DML PLIV (endogenous factor + macro instrument) 를 감성 alpha 검정에 이식. 이는 AETHER 를 학술 논문으로 격상할 때 필수 근거.
- **인용 문장 초안**: "AETHER 의 crypto sentiment alpha 검정은 on-chain 및 macro confounder 로 인해 표준 회귀로는 편향된다. 본 절차는 Chernozhukov et al. (2018) 의 PLIV score 를 crypto liquidity instrument 로 특수화한다."

### 4. APF (🟢 active) — motif intervention 의 causal effect 격리

- **위치**: `Attention Pattern Fields/paper/sections/STATUS.md` §5 (motif causality 실험).
- **적용**: APF 는 특정 attention motif (diagonal · stripe · block 등) 를 개입 (masking · patching · swap) 한 뒤 downstream 성능 변화를 관찰. 여러 motif 가 동시에 attention pattern 을 구성하므로 하나의 motif 를 intervention 할 때 다른 motif 는 confounder. DML IRM ATE score $\psi = g_1(X) - g_0(X) + \frac{D(Y-g_1(X))}{m(X)} - \frac{(1-D)(Y-g_0(X))}{1-m(X)} - \theta$ 를 "motif $D$ 존재 여부 (D∈{0,1}) → downstream loss $Y$ 의 ATE" 로 특수화. 다른 motif $X$ 는 covariate 로.
- **인용 문장 초안**: "APF 의 motif intervention 은 관측 attention pattern 위에서의 causal effect 를 추정하려는 시도이며, 여러 motif 가 confounding 관계에 놓인다. 본 절차는 Chernozhukov et al. (2018) IRM ATE score 를 attention motif intervention 에 적용한 첫 시도다."

## 충돌·경쟁 지점

### 충돌 1 — Grokking track 의 non-stationarity 와 DML 의 iid 가정

- **핵심**: Grokking 실험 (P2 logistic map, ETT-mini 등) 은 시계열 데이터. DML 표준 프레임의 iid 가정 위반.
- **어떻게 반박·수용할 것인가**: 사용자는 (i) 시계열 DML 확장 (Chernozhukov et al. 2020 arXiv:2007.15071) 을 substrate 로 채택하거나 (ii) block CV / purged K-fold 를 DoubleML `apply_cross_fitting` 파라미터로 강제하는 형태로 실무 대응. Grokking 논문의 실험 파트는 이 확장 없이 표준 K-fold 를 그대로 쓸 수 없음을 명시적으로 각주 처리 필요.

### 충돌 2 — Rate 조건과 딥러닝의 실증 rate

- **핵심**: DML rate 조건 $\|\hat{\eta} - \eta_0\|_{L^2} = o_P(n^{-1/4})$ 는 딥러닝 (Transformer 특히) 에서 검증 어렵다. 사용자 P1 ProTran-TFA 는 probabilistic Transformer forecast 를 nuisance 로 쓸 것이므로 이 rate 가 실제로 만족되는지 불확실.
- **어떻게**: (i) 사용자 실증 파트에서 sample size sweep 으로 nuisance rate 를 empirically 추정하고, (ii) DML 유효 coverage 를 sample size 별로 report 하는 sensitivity 절 추가. 이 논문 §07 반박 1 을 자기 논문에서 정면 다루는 방식.

## 인용 포인트 (각 track 별 초안)

### APF main paper §2 (Related Work — Interpretability 담론)

> "Attention-as-explanation 계열 (Jain-Wallace 2019; Wiegreffe-Pinter 2019) 은 attention weight 를 중요도로 해석하는 관점의 한계를 지적하나 causal identification 도구를 제공하지 않는다. 본 연구는 motif intervention 을 Chernozhukov et al. (2018) 의 IRM ATE score framework 위에 정식화하여 attention motif 의 인과 효과를 편향-격리된 형태로 추정한다."

### Grokking-in-TS-Transformers §4 (Method — non-stationarity 조정)

> "P2 logistic map 실험에서 regime shift 는 시계열 confounder 를 유발한다. 본 절은 Chernozhukov et al. (2018) DML framework 을 block cross-fitting 확장 (Chernozhukov et al. 2020) 과 결합하여 regime-adjusted grokking transition timing 을 추정한다."

### P1 ProTran-TFA §3 (Alpha detection)

> "본 절차의 double robustness 는 Chernozhukov, Chetverikov, Demirer, Duflo, Hansen, Newey and Robins (2018, Econometrics Journal 21) 의 partialling-out score 를 quantile pinball loss 로 확장한 것이다 [식 4.2 참조]. Neyman orthogonality condition 아래에서 factor covariate 및 macro state 의 quantile 예측기 편향이 alpha 계수 추정에 1차 근사로 영향을 주지 않음을 보장한다."

## 반면교사

- **저자들이 못한 것**: (a) 시계열/네트워크/panel 확장 (별개 논문으로 후속), (b) rate 조건의 실무 검증 절차 부재, (c) misspecified 인과 그래프 (관측되지 않은 confounder 존재) 에 대한 sensitivity analysis 부재.
- **사용자가 어떻게 다룰 것인가**:
  - 시계열 확장은 Chernozhukov 2020 후속작 인용으로 우회.
  - Rate 조건 검증은 sample size sweep + $\|\hat{\eta}-\eta_0\|_{L^2}$ empirical 추정 절차를 자기 실증에 포함 (§07 반박 1 실험 검증안).
  - 관측되지 않은 confounder 는 sensitivity analysis (Cinelli-Hazlett 2020 "Making Sense of Sensitivity") 를 자기 논문 부록에 추가.

## 이 절의 핵심 한 문장

**"DML 은 P1 ProTran-TFA · 2022AEL 확장 · AETHER 학술화 · APF motif intervention 4 곳에서 각각 다른 방식으로 이식 가능하며, 특히 Neyman orthogonality condition 을 pinball loss score 로 확장하는 것이 P1 finance venue 진출 시 canonical 인용 지점이다."**
