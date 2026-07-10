# 10b. 사고 확장 — Follow-up 3편

## 선행 (Ancestor) — Belloni-Chernozhukov-Hansen (2014) "Inference on Treatment Effects after Selection amongst High-Dimensional Controls" (RES)

**어떤 논문인가**: Chernozhukov 팀의 pre-DML 이론 원저. 관심 인과 모수 $\theta_0$ 을 $\hat{Y}, \hat{D}$ 잔차 회귀로 얻되 nuisance 를 lasso (또는 post-lasso) 로 학습하는 특수 케이스. sparsity 조건 아래 $\sqrt{n}$-consistent asymptotic normal 을 증명. Robinson (1988) 을 lasso 로 확장한 첫 논문 계열.

**본 논문과의 관계**: BCH 2014 → DML 2018 은 "lasso only + sparsity" 에서 "임의 ML + rate 조건" 으로의 이론적 일반화. DML 이론의 특수 케이스가 BCH 2014.

**무엇을 얻을 수 있는가**: (i) sparsity 가 실제로 성립하는 도메인 (예: sparse factor model, high-dim macro forecast 등) 에서 DML 대신 BCH lasso post-selection 을 쓰면 rate 조건이 관대해질 수 있음 — 실무 tradeoff. (ii) DML 이 왜 "임의 ML" 로 확장 가능한지의 이론적 씨앗 — sparsity 를 rate 로 대체하는 트릭이 어떻게 유도되는지 파악하는 데 필수. (iii) 사용자 P1 ProTran-TFA 가 sparse factor 회귀를 쓴다면 BCH 계열이 직접 baseline. RES 게재 (Tier 1 top econometrics journal) 로 canonical 지위.

## 경쟁 (Parallel) — Athey-Imbens-Wager (2019) "Estimation and Inference of Heterogeneous Treatment Effects using Random Forests" GRF (JASA)

**어떤 논문인가**: arXiv:1510.04342, JASA 2019. Athey 계열의 Generalized Random Forest 프레임. DML 의 Neyman orthogonal score 위에 forest local weighting 을 결합해 CATE (Conditional Average Treatment Effect) 를 heterogeneous 하게 추정. 사용자가 개인 수준 처치 효과에 관심 있으면 GRF 가 자연스러운 확장.

**본 논문과의 관계**: 같은 시기 (2015-2019) 진행된 병행 프레임. DML 은 평균 인과 (ATE) 특화, GRF 는 heterogeneous (CATE) 특화. 두 프레임은 서로 orthogonal 축을 커버 — 통합 가능하지만 실제 논문은 분리.

**무엇을 얻을 수 있는가**: (i) 사용자 APF 의 motif intervention 이 sample 별 heterogeneity 를 갖는다면 (예: sequence 별로 motif effect 크기 다름) GRF 확장이 DML 만으로는 못 얻는 정보를 준다. (ii) `grf` R 패키지 (Stanford, Athey lab) 는 `causal_forest`, `instrumental_forest`, `regression_forest` 를 완전 구현 → DoubleML 과 상호 참조 가능. (iii) 사용자가 factor investing 에서 asset 별 heterogeneous alpha 를 추정한다면 GRF 가 DML PLR 보다 직접적. Athey Nobel-track economics ML 대가.

## 후속 (Descendant) — Chernozhukov-Newey-Singh (2022) "Automatic Debiased Machine Learning of Causal and Structural Effects" (Econometrica)

**어떤 논문인가**: arXiv:1809.05224 (v1 2018) → Econometrica 2022 게재. DML 의 "매 모형별로 Neyman orthogonal score 를 손으로 유도해야 하는" procedural gap 을 자동화. Riesz representer 를 ML 로 학습하고 이를 통해 orthogonal score 를 자동 생성. AutoDML.

**본 논문과의 관계**: DML 이 4 개 canonical 모형 (PLR/PLIV/IRM/IIVM) 에서 score 를 유도했지만, mediation analysis · partial identification · policy learning · dynamic treatment 등 새 모형에 확장하려면 매번 유도가 필요했다. AutoDML 은 이 부담을 원천 제거. Econometrica (Tier 1 top venue) 게재로 authority 확보.

**무엇을 얻을 수 있는가**: (i) 사용자 APF motif intervention 이 IRM 프레임에 딱 안 들어맞고 조금 다른 형태 (예: continuous motif intensity + interaction with other motifs) 를 요구하면, AutoDML 로 자동 score 유도. 손으로 유도하는 부담 해소. (ii) 사용자가 새 인과 프레임을 발명하고 싶을 때 (예: attention motif hierarchy 를 causal DAG 로 정식화) AutoDML 이 이론적 문법 제공. (iii) Riesz representer 개념은 semiparametric efficiency 이론의 핵심 — 이 논문을 읽으면 DML 논문 §3-4 이론의 깊이가 급상승.

---

## 3편 관계 지도

```
BCH 2014 (선행) — sparse lasso, RES Tier 1
     │
     ↓ 이론 일반화 (sparsity → rate)
     │
[이 논문] Chernozhukov et al. 2018 DML — 임의 ML, Econometrics J Tier 2
     │
     ├─→ Athey-Wager 2019 GRF (경쟁) — heterogeneous CATE, JASA Tier 1
     │
     └─→ CNS 2022 AutoDML (후속) — 자동 score 유도, Econometrica Tier 1
```

이 3 편을 함께 읽으면 causal ML 프레임의 **역사 (BCH), 확장 축 1 [heterogeneity] (GRF), 확장 축 2 [자동화] (AutoDML)** 를 90° 3-axis 로 커버.
