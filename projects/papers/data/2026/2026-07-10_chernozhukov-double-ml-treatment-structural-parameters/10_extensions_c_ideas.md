# 10c. 사고 확장 — 실험 아이디어 2개

## 실험 A — Quantile-DML for Alpha Detection (P1 ProTran-TFA 확장)

### 가설

Neyman orthogonal partialling-out score 를 mean regression 이 아니라 quantile pinball loss 에 이식하면, quantile forecast (예: ProTran) 를 nuisance 로 하는 alpha 검정이 편향-격리된다. 특히 tail-risk alpha (τ=0.05, 0.95 quantile 에서의 신호) 를 factor covariate 조정 후 검정할 때 표준 quantile regression 보다 CI coverage 가 명목 수준 (95%) 에 가깝게 유지된다.

### 데이터

- **1차**: 사용자 보유 GSPC/IXIC 2022-2024 일별 수익률 (`fin/data/`), Fama-French 5-factor (F_t) + macro state (M_t = VIX, 10Y yield, oil price 로 구성)
- **2차 baseline**: Kenneth French 25 portfolio (사용자 사전 독파 자산) — Fama-French 자체 데이터

### 비교 조건

1. **Baseline**: OLS quantile regression (rq in R quantreg) — alpha 검정 표준
2. **Naive plug-in**: ProTran 으로 $\hat{q}_\tau(F_t)$ 예측한 뒤 잔차에 대해 quantile regression — 직교화 X, 표본 분할 X
3. **Sample splitting only**: naive plug-in + 데이터 반분할 — 직교화 X, 표본 분할 O
4. **Neyman orthogonal only**: pinball loss 대응 orthogonal score 사용 + 같은 표본 재사용 — 직교화 O, 표본 분할 X
5. **Quantile-DML (제안)**: orthogonal score + 5-fold cross-fitting + Purged K-fold (embargo 30일)

### 예상 결과

- (1) 은 macro state 편향으로 alpha 계수 방향/크기 왜곡, CI coverage 무너짐
- (2) 는 ProTran nuisance 편향이 alpha 로 흘러들어 (1) 대비 개선 제한적
- (3) 은 표본 분할로 과적합 편향은 잡지만 정규화 편향은 남음 → CI coverage 부분 개선
- (4) 는 정규화 편향 잡지만 in-sample nuisance 재사용으로 표준오차 과소평가
- (5) 는 CI coverage 명목 95% 근접, alpha point estimate 안정

### 반증 조건

- (5) 의 CI coverage 가 표본 크기 sweep ($n \in \{500, 1000, 3000, 5000\}$) 에서 명목 95% 를 3% 이상 벗어나면 → rate 조건 위반 시사 (Q4 참조)
- (5) 의 alpha point estimate 가 (2) 와 유의미하게 다르지 않으면 → orthogonalization 실질 이득 없음 시사

### 비용 추정

- **계산**: ProTran nuisance 학습 fold 당 30분 × 5 fold × 5 seed × 5 표본 크기 = 62.5 hours (single GPU). Purged K-fold 는 embargo 로 fold 크기 축소 → 실제 학습 시간 20% 감소.
- **개발**: 2-3 주. (i) DoubleML 파이썬 패키지에 pinball loss orthogonal score 추가 (fork PR), (ii) ProTran wrapper 를 DoubleML learner interface 로 감싸기, (iii) Purged K-fold sample splitter 구현 (López de Prado 2018 참조).
- **논문 가능성**: 성공 시 P1 ProTran-TFA 의 방법론 절 확장 → IJF/QF 재개 시 핵심 novelty. 별도 방법론 논문 (Quantile-DML) 으로도 분리 가능.

---

## 실험 B — DML-based Attention Motif Intervention (APF 확장)

### 가설

APF 의 motif intervention (예: diagonal motif 를 masking) 은 다른 motif 의 confounding 을 무시하고 직접적 causal effect 를 잰다. IRM ATE score 를 attention pattern intervention 에 특수화하면 (i) motif 별 causal effect 를 confounder-adjusted 형태로 격리 가능하고, (ii) 각 motif 의 unique contribution 이 총 downstream loss 에 기여하는 비율이 additive decomposition 을 만족한다.

### 데이터

- **synthetic motif benchmark**: 사용자 APF 데이터 (trend/seasonal/regime/anomaly/freq-drift 5 종 × 각 5 subtypes) — DGP 를 알고 있어 ground truth causal effect 계산 가능
- **UCR Archive**: 128 real datasets, motif intervention 의 실제 downstream 성능 변화 관측
- **ETT-mini**: 사용자 보유 활성 benchmark

### 비교 조건

각 motif $D_j \in \{0,1\}$ ($j=1,\ldots,6$: diagonal/stripe/block/edge/spike/checker) 에 대해:

1. **Direct intervention** (baseline): motif $j$ 만 masking → downstream loss 변화. 다른 motif confounder 무시.
2. **Regression adjustment**: 다른 motif 활성화 비율을 covariate 로 넣고 OLS/RF 회귀. Confounder 부분 조정.
3. **Propensity weighting only (IPW)**: 각 sample 에서 다른 motif 조합을 $X$ 로, motif $j$ 활성화 여부를 $D$ 로 두고 IPW 로만 조정.
4. **DML IRM ATE (제안)**: AIPW/doubly robust score $\psi = g_1(X) - g_0(X) + \frac{D(Y-g_1(X))}{m(X)} - \frac{(1-D)(Y-g_0(X))}{1-m(X)} - \theta$ 를 motif $j$ 별로 적용. $g_j(X), m_j(X)$ 는 attention pattern 관측 위의 ML 예측기.

### 예상 결과

- (1) 은 motif 간 상관 (예: diagonal-stripe 동시 활성화) 이 강한 sequence 에서 편향 큼
- (2) 는 다른 motif 를 linear 로 조정 → 상호작용 놓침
- (3) 은 propensity extreme value 에서 발산
- (4) 는 doubly robust — 편향 격리 + 추정치 강건

### 반증 조건

- Synthetic DGP 에서 알고 있는 ground truth ATE 와 (4) 추정치의 차이가 (2), (3) 대비 작지 않으면 → DML 이 실제 이득 없음
- UCR 실 데이터에서 (4) 의 ATE 순위가 sequence 별로 심하게 다르면 → homogeneity 가정 위반, GRF 확장 필요

### 비용 추정

- **계산**: attention pattern 추출 (Transformer inference) + motif 분류 (CNN probe) 이미 APF 파이프라인에 존재. DML step 은 motif 별 IRM ATE score 계산 + 5-fold cross-fitting. UCR 128 dataset × 6 motif × 4 method = 3072 실험 조건. Single GPU 로 1-2 일.
- **개발**: 3-4 주. (i) motif propensity $m_j(X)$ 정의 (Q3 참조) — 다른 motif 활성화 비율을 covariate 로, (ii) DoubleML IRM wrapper 를 APF 파이프라인에 통합, (iii) synthetic DGP 로 ground truth 검증, (iv) additive decomposition property 를 실험적으로 확인.
- **논문 가능성**: 성공 시 APF main paper 의 §5 (motif causality) 를 "attention-as-causal-inference" 새 축으로 격상. 별도 methodology paper 로 NeurIPS/ICLR workshop 제출 가능. Grokking track 과도 연결 (motif emergence 의 causal timing).

---

## 두 실험의 시너지

두 실험은 각각 P1 (finance venue) 과 APF (ML/NeurIPS venue) 에서 DML 을 canonical 로 인용하는 근거. Quantile-DML 은 사용자의 finance 방향 대비 방법론적 depth 확보, Attention DML 은 사용자의 mech interp 방향 대비 novel intersection. 두 실험 모두 DoubleML/EconML 오픈소스에 실제 PR 로 기여 가능 → 사용자의 오픈소스 포트폴리오 강화.
