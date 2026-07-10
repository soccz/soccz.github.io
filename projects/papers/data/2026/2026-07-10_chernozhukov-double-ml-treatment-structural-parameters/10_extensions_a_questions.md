# 10a. 사고 확장 — 자문 질문 5개

## Q1. Neyman orthogonal quantile score 를 P1 ProTran-TFA 에 이식할 때 어떤 이론적 gap 이 남는가?

**왜 이 질문이 중요한가**: DML 의 PLR partialling-out score 는 mean regression pinball 대응이 없다. 만약 P1 ProTran-TFA 가 quantile forecast $\hat{q}_\tau$ 를 nuisance 로 쓴다면, "orthogonalized quantile regressor $D - \hat{m}(X)$" 라는 개념이 어떻게 정의되는지, 그리고 그 score 가 Neyman orthogonal 인지 유도가 필요. 특히 non-crossing 조건 (Bondell-Reich-Wang 2010) 을 강제할 때 orthogonality 가 무너지는지 여부가 관건.

## Q2. 시계열 DML 의 block K-fold 에서 embargo 길이는 어떻게 정해야 하는가?

**왜 이 질문이 중요한가**: Grokking track 실험 (ETT-mini · Weather-mini) 과 P1 ProTran-TFA 실증 (금융 시계열) 모두 embargo 길이 결정 문제에 마주친다. 너무 짧으면 look-ahead bias, 너무 길면 fold 별 학습 표본 부족 → nuisance rate 위반. Chernozhukov et al. 2020 arXiv:2007.15071 은 mixing 조건 아래 embargo 를 mixing time 의 함수로 정의하지만, 실무에서는 mixing time 이 unknown. Cross-validation 성능이 아니라 embargo sweep 에서의 CI coverage 를 metric 으로 삼는 실무 프로토콜이 필요.

## Q3. attention motif intervention 에서 "propensity score" $m_0(X)$ 를 어떻게 정의하는가?

**왜 이 질문이 중요한가**: APF motif intervention 을 DML IRM ATE score 로 격리하려면 "이 sample 에 이 motif 가 활성화될 확률" $m_0(X)$ 를 추정해야 한다. 그런데 motif 는 관측 attention pattern 에서 사후적으로 정의되므로 "관측 전 propensity" 개념이 자연스럽지 않다. 이를 어떻게 well-defined 하게 만들 것인가 (예: 다른 layer/head 의 attention pattern 을 $X$ 로 삼고, 관심 head 의 motif 활성화를 $D$ 로 삼는 계층적 정식화) 가 명확해야 causal identification 이 성립.

## Q4. Rate 조건 실무 검증 절차를 empirical protocol 로 어떻게 표준화할 것인가?

**왜 이 질문이 중요한가**: 이 논문의 최대 실무 gap 은 "rate 조건이 성립하는지 실무에서 확인 불가능" 이다 (§07 반박 1). 사용자 논문에서 이 gap 을 방어하려면 (i) synthetic DGP 에서 nuisance $L^2$ 오차를 sample size sweep 으로 empirically 회귀 기울기로 추정하고, (ii) 실제 데이터에서는 sample split 을 여러 크기로 나눠 nuisance 예측 오차의 "실효 rate" 를 프록시로 잰다. 이 프로토콜이 표준화되어 있지 않으므로 사용자가 방법론 절 하나를 새로 쓸 수 있는 기회.

## Q5. DML 의 semiparametric efficiency bound 는 grokking transition 을 예측하는 데 정보를 주는가?

**왜 이 질문이 중요한가**: Grokking track 은 "train loss 는 0 인데 test loss 는 여전히 높은" 상태에서 갑작스러운 phase transition 이 언제 일어나는지가 핵심 질문. DML 은 "asymptotic variance $\sigma^2$ 의 hard lower bound (efficiency bound)" 를 제공하며 이는 semiparametric problem 의 "가장 잘해봤자 얼마나 잘 될까" 를 뜻함. Grokking 문제에서 asymptotic variance 개념을 어떻게 정의하고 (task-specific), 그 bound 가 transition timing 예측에 어떤 정보를 주는지가 흥미로운 이론적 교차점. 특히 "grokking timing 을 estimator 로 정식화하고 그 estimator 의 efficiency bound 를 물으면" 어떤 답이 나오는가.
