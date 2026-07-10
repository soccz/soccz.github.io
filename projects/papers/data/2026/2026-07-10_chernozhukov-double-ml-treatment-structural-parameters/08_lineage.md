# 08. 이론적 계보

## 이론적 조상 (직접 선행)

### 조상 1 — Robinson (1988) "Root-N-consistent Semiparametric Regression" (Econometrica)

**논문 개요**: Partially linear model $Y = D\theta_0 + g_0(X) + \zeta$ 에서 $g_0$ 를 kernel 로 nonparametric 추정한 뒤, $Y$-잔차와 $D$-잔차의 회귀로 $\theta_0$ 을 $\sqrt{n}$-일치로 추정. 이 논문의 이름을 딴 "Robinson's double residual regression".

**본 논문과의 직접 연결**: DML PLR partialling-out score $[Y - \ell(X) - \theta(D-m(X))][D-m(X)]$ 는 정확히 Robinson (1988) 의 잔차 회귀 형식. 이 논문은 이 형식을 kernel 자리에 **임의의 ML** 을 꽂을 수 있게 확장. 즉 DML 은 Robinson 을 "예측기 종속에서 예측기 독립으로" 옮긴 것.

**차이 축**: Robinson 은 저차원 kernel, DML 은 고차원 ML. Robinson 은 Donsker 조건 필요, DML 은 sample splitting 으로 우회.

### 조상 2 — Newey (1990) "Semiparametric Efficiency Bounds" (JAE)

**논문 개요**: semiparametric 모형에서 관심 저차원 모수 $\theta_0$ 의 **efficient influence function (EIF)** 을 canonical 하게 유도. Bickel-Klaassen-Ritov-Wellner 계열 이론을 econometrics 응용에 정착.

**본 논문과의 직접 연결**: DML 의 Neyman 직교 점수는 정확히 EIF. 이 논문은 EIF 를 ML 예측기와 결합하는 절차를 정식화. Newey 는 이론 축, DML 은 알고리즘 축.

### 조상 3 — Belloni-Chernozhukov-Hansen (2014) "Inference on Treatment Effects after Selection amongst High-Dimensional Controls" (RES)

**논문 개요**: $g_0, m_0$ 가 sparse linear 하다는 가정 아래 double-selection (또는 immunized) lasso 추정치가 $\sqrt{n}$-일치 asymptotic normal 임을 증명. Chernozhukov 팀의 pre-DML 이론.

**본 논문과의 직접 연결**: DML 은 BCH 2014 의 아이디어를 확장 — sparsity 대신 rate 조건만 요구. sparsity 가정을 지우면서 lasso 대신 아무 ML 예측기가 가능해짐.

**차이 축**: BCH 는 lasso only + sparsity, DML 은 아무 ML + rate.

### 조상 4 — Van der Laan-Rubin (2006) "Targeted Maximum Likelihood Learning" (Int. J. Biostat.)

**논문 개요**: TMLE — nuisance 를 학습한 뒤 "targeting step" 으로 편향 방향으로 조정. 결과 추정치가 EIF 를 만족하도록 강제. van der Laan 계열의 semiparametric 인과 추론 프레임.

**본 논문과의 직접 연결**: TMLE 와 DML 은 close cousin — 둘 다 EIF 기반. TMLE 는 nuisance 조정 축, DML 은 점수 직교화 + 표본 분할 축. 실무적으로 TMLE 는 finite-sample 안정성 강점, DML 은 구현 단순성 강점.

## 평행 연구 (같은 시기, 다른 접근)

### 평행 1 — Athey-Imbens (2016) "Recursive Partitioning for Heterogeneous Causal Effects" (PNAS)

**요약**: Causal Tree — 회귀 트리를 인과 추정에 특화 (honest splitting: 트리 구조 학습 표본과 leaf 값 추정 표본 분리). 이후 GRF (Athey-Tibshirani-Wager 2019, arXiv:1610.01271) 로 발전.

**왜 DML 이 이겼는가**: (i) DML 은 아무 ML 을 nuisance 로 갈아 끼울 수 있음 — Athey 계열은 forest 종속. (ii) DML 이 CFI (Continuous 처치) · IV · IIVM 등 인과 모형 다양성 커버 — Causal Tree/Forest 는 heterogeneous ATE 특화.

**어떤 영역에서 상대가 나은가**: heterogeneous treatment effect (CATE) 개인화 예측 — Causal Forest 가 leaf 별 heterogeneity 를 직접 추정. DML 은 평균 ATE 에 특화.

### 평행 2 — Farrell (2015) "Robust Inference on Average Treatment Effects with Possibly More Covariates than Observations" (JoE)

**요약**: 처치 효과 추정에서 $p > n$ 인 경우 이중 선택 (double selection) 을 확장한 lasso 기반 estimator. BCH 2014 계열 연장선.

**왜 DML 이 이겼는가**: DML 이 예측기를 lasso 로 제한하지 않음. Farrell 은 sparsity 조건에 종속. 하지만 sparsity 가 실제로 성립하는 도메인에서는 Farrell 의 rate 조건이 더 관대할 수 있음.

### 평행 3 — Bang-Robins (2005) "Doubly Robust Estimation in Missing Data and Causal Inference" (Biometrics)

**요약**: AIPW 형식의 doubly robust estimator. $g$ 정확 OR $m$ 정확 중 하나만 맞아도 무편향. IRM ATE score 의 canonical 배경.

**왜 DML 이 이겼는가**: Bang-Robins 는 parametric nuisance 를 가정. DML 은 nonparametric ML nuisance 로 확장하면서 rate 조건을 명확히 정식화. Bang-Robins 는 이론적 조상 (아이디어), DML 은 실용적 후손 (프레임).

## 후손 예측 (파생될 수 있는 연구 방향)

### 후손 1 — Athey-Wager (2019) "Estimation and Inference of Heterogeneous Treatment Effects using Random Forests" GRF (JASA)

**실제 발생**: ✓ arXiv:1510.04342. DML 이론 프레임 + 그 위에 forest local weighting 을 결합해 CATE (Conditional Average Treatment Effect) 를 heterogeneous 하게 추정. DML 의 자연 확장.

**연구 방향 요지**: DML 은 평균 인과 효과 (ATE, ATTE) 에 특화. 개인 수준 CATE 를 추정하려면 forest local weighting 또는 kernel local weighting 이 필요. GRF 는 forest + Neyman 직교 score 를 결합한 첫 대규모 확장.

### 후손 2 — Chernozhukov-Newey-Singh (2022) "Automatic Debiased Machine Learning of Causal and Structural Effects" (Econometrica)

**실제 발생**: ✓ arXiv:1809.05224. Riesz representer 를 학습해 Neyman 직교 점수를 **자동 생성** — 저자가 손으로 유도할 필요 없게 만듦. DML 의 procedural gap (매 모형별 score 유도 필요) 를 자동화.

**연구 방향 요지**: DML 은 4 개 모형에 대해 score 를 명시적으로 유도. 다른 모형 (예: 부분 identification, mediation analysis) 에 확장하려면 score 유도 필요. AutoDML 은 이 부담을 자동화.

### 후손 3 — 시계열/네트워크 데이터 DML 확장

**실제 발생**: 부분 ✓. Chernozhukov et al. 2020 arXiv:2007.15071 시계열 DML, Chernozhukov et al. 2022 network DML (arXiv:2211.11758). 아직 완전한 canonical 확장은 미완성.

**연구 방향 요지**: iid 가정을 mixing time series · network dependent data · panel data 로 확장. 표준 K-fold 대신 block CV · purged CV · leave-cluster-out 등 새 splitting 프로토콜 개발. 사용자 P1 ProTran-TFA 의 금융 시계열 응용에 직결 (§07 반박 3 참조).

## 계보 지도 (요약)

```
Robinson (1988)          Newey (1990)             Bang-Robins (2005)
   partial linear           EIF theory                  AIPW
        │                       │                          │
        └──────────┬────────────┴──────────────┬──────────┘
                   │                            │
         BCH (2014) sparse post-selection       Van der Laan TMLE (2006)
                   │                            │
                   └──────────┬─────────────────┘
                              │
                     Chernozhukov et al. (2018) DML  ← 이 논문
                              │
              ┌───────────────┼───────────────┐
        GRF (Athey-Wager)  AutoDML (CNSDD)  시계열 DML
```

## 이 절의 핵심 한 문장

**"DML 은 Robinson (1988) 의 잔차 회귀 형식 + Newey (1990) 의 EIF 이론 + BCH (2014) 의 rate 조건 접근 + Bang-Robins (2005) 의 doubly robust 아이디어 + Van der Laan 의 TMLE 계열의 sample-splitting 아이디어를 하나의 프레임으로 통합한 canonical 결정판이며, 이후 GRF · AutoDML · 시계열 DML 등 확장 라인의 공통 substrate 이 된다."**
