# 03. 문제 지형도

## 배경 사다리 (Background Ladder)

이 절을 이해하려면 세 개념만 필요하다. ① **모수 추정** — 데이터로부터 미지의 실수 $\theta_0$ 를 추정하는 문제. ② **일치성 (consistency)** — 표본이 커질 때 추정치 $\hat{\theta}$ 가 참값 $\theta_0$ 로 확률적으로 수렴한다는 성질. 표본 크기 $n$ 이 커지면 오차 $\hat{\theta} - \theta_0$ 가 $O_P(n^{-1/2})$ 로 줄어드는 것이 통계학 표준 목표. ③ **혼란변수 (confounder)** — 관심 변수 $D$ (예: 신약 복용) 와 결과 $Y$ (예: 회복) 모두에 영향을 주는 제3 변수 $X$ (예: 나이·건강). $X$ 를 무시하면 $D$ 의 효과가 $X$ 의 영향에 오염된다.

## 이 논문이 푸는 실제 문제

**상황 1 — 401(k) 참여의 순자산 효과**: 401(k) 저축 계획에 참여하는 것이 개인의 순자산을 얼마나 늘리는가? 소득 · 연령 · 결혼 상태 · 교육 수준 · 저축 성향 등이 참여 여부와 결과에 동시에 영향을 주므로 단순 회귀는 편향된다. covariate 벡터 $X$ 가 수십 차원이면 parametric linear 모형은 강한 함수 형태 가정을 요구하고, ML 로 $\mathbb{E}[Y|X], \mathbb{E}[D|X]$ 를 예측하는 것이 자연스럽다.

**상황 2 — 온라인 광고의 인과 매출 효과**: 광고 노출 $D$ 가 고객 구매 $Y$ 에 얼마나 인과적으로 기여하는가? 고객의 과거 행동 로그 $X$ 는 수백~수만 차원 (원-핫 카테고리 + 시퀀스 임베딩). $\mathbb{E}[Y|X]$ 를 lasso 로 예측하면 sparsity 가정이 필요하고, RF/boosting 으로 예측하면 편향-분산 trade-off 가 필요한데, 소박한 plug-in 은 편향을 그대로 계승.

**상황 3 — factor investing 의 alpha 검정**: 자산 수익률 $r_{i,t+1}$ 에 대해 factor 벡터 $F_t$ 를 조정한 뒤 특정 신호 $S_t$ (예: 뉴스 감성, 옵션 정보, 대체 데이터 지표) 가 잔차 return 을 얼마나 예측하는가? $F_t$ 는 Fama-French 5 요인 + macro 요인 + 산업 더미로 수십~수백 차원. $\mathbb{E}[r|F,S]$ 와 $\mathbb{E}[S|F]$ 를 각각 ML 로 예측한 뒤 신호 $S$ 의 계수를 orthogonalized regression 으로 재는 것이 DML 프레임의 자연스러운 응용.

## 기존 접근 계보

### 1단계 (~1990s): Semiparametric 계열 — Robinson (1988), Newey (1990)

**무엇이었나**: partially linear 모형 $Y = D\theta_0 + g_0(X) + \zeta$ 에서 $g_0$ 를 kernel/series 로 nonparametric 추정, $\theta_0$ 는 $Y-\hat{g}(X), D-\hat{m}(X)$ 의 잔차 회귀로 잰다 (Robinson 1988 의 double residual). 이론적으로는 $\theta_0$ 가 $\sqrt{n}$-일치.

**왜 부족했나**: (i) $X$ 차원이 저차원 (typically $d \le 5$) 이어야 kernel/series 수렴률이 살아남는다. curse of dimensionality. (ii) nonparametric 학습기가 강한 Donsker 조건 (bracketing entropy 유한) 을 만족해야 하는데, 이는 사실상 smoothness 클래스에 매여 있다.

**교훈**: "$Y$ 와 $D$ 를 각각 $X$ 로 잔차화한 뒤 $\theta$ 를 잰다" 는 형식이 이미 canonical. 새 세대는 이 형식을 유지하면서 $\hat{g}, \hat{m}$ 자리에 임의의 ML 예측기를 꽂을 수 있게 만들어야 한다.

### 2단계 (2010s 초): Sparse ML — Belloni-Chernozhukov-Hansen (2014)

**무엇이었나**: $g_0, m_0$ 이 $L_1$-sparse 하다는 강한 가정 하에서 post-lasso · double-selection · immunized 추정치를 제안. RES 2014 논문 "Inference on treatment effects after selection amongst high-dimensional controls" 가 대표.

**왜 부족했나**: (i) sparsity 가정 자체가 실무에서 검증 어려움. (ii) lasso 이외의 예측기 (RF · boosting · NN) 에는 이론이 확장되지 않았다. (iii) 이론이 예측기 종속적이라 재작업 부담이 크다.

**교훈**: sparsity 가 아니라 "예측기의 nuisance rate" 라는 더 추상적인 조건으로 이론을 재정식화해야 한다. rate 조건만 만족하면 아무 ML 예측기나 갈아 끼울 수 있어야 한다.

### 3단계 (2016 프리프린트, 2018 저널): 이 논문 — Chernozhukov et al. DML

**무엇이 새로운가**: 두 축의 완전한 분리. **① 이론 축**: Neyman 직교 조건은 예측기 종속이 아니라 모형-점수 함수 종속으로 재정식화. **② 알고리즘 축**: K-fold 교차적합은 예측기 종속이 아니라 데이터 분할 프로토콜로 완전히 분리. 두 축을 조합하면 어떤 ML 예측기든 (그것이 nuisance rate 조건만 만족하면) √n-일치 인과 추정치를 얻는다.

### 4단계 (2018~현재): 파생 · 확장

**DR/AIPW 확장**: 원 논문의 IRM 점수 함수가 AIPW/doubly robust 형식과 동치. Chernozhukov 2022 (arXiv:2203.09330) "Riesz representer" 확장.  
**Causal Forest**: Athey-Wager 2019 GRF (arXiv:1510.04342, JASA) — DML 프레임을 forest 로 heterogeneity 축까지 확장.  
**패키지 생태**: DoubleML (Bach et al. JMLR 2022), EconML (Microsoft), CausalML (Uber), grf (Stanford), ddml (Stata).

## 기존 방법들이 공통으로 놓친 gap

**한 문장**: 모든 이전 계보는 예측기 (nonparametric estimator) 의 통계적 성질과 인과 모수 $\theta_0$ 의 identification/추정 성질을 하나의 이론으로 얽어 놓았기 때문에, 예측기를 바꿀 때마다 이론이 부서졌다.

## 이 논문이 gap 을 메우는 방식

이 논문은 예측기 자리와 인과 모수 자리를 **직교화 + 교차적합** 이라는 두 단계 프로토콜로 격리한다. 예측기는 "만족해야 할 rate 조건" 이라는 블랙박스 형태로 축약되고, 이론은 rate 조건 + Neyman 직교 조건 위에서만 돌아간다. 이 덕분에 예측기를 lasso → RF → boosting → NN 으로 갈아 끼워도 이론이 그대로 통용된다. 이것이 이후 EconML · CausalML · GRF · CausalForest · doubleml 생태 전체가 이 논문을 canonical 로 삼는 이유다.
