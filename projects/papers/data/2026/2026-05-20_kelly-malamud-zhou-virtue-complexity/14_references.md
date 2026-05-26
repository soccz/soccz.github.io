# 14. References 풀이 — paper 가 인용하는 70+ 작품

> **🧒 한 줄 요약**: References. Fama, Cochrane, ML double descent papers.


> Paper p.501-503 의 모든 references 의 *brief description* + 본 논문과의 관계. 클러스터별로 정리.

---

## 14.1 챕터 한 줄 요약

**본 deep dive 가 cover 한 references 는 paper 의 main argument 와 관련된 핵심 ~25개 (Hastie, Bartlett, Belkin, Hornik, Jacot, Rahimi-Recht, Goyal-Welch, Cochrane, Kelly 계열). 그 외 ~45개 references 는 보조 cite (다른 분야 결과, 기술 lemma, alternative 비교). 클러스터별로 paper 가 이들을 어떻게 사용했고, 본 논문과의 관계가 무엇인지 정리.**

---

## 14.2 ML Theory — Benign Overfit + Double Descent (10편)

본 논문의 *통계학적 토대*. P > T 영역의 ridge(less) regression 의 OOS 성능 분석.

### Hastie, Montanari, Rosset, Tibshirani (2022, *Annals of Statistics*)
- **제목**: "Surprises in high-dimensional ridgeless least squares interpolation"
- **본 논문과 관계**: 가장 가까운 prior. Finite-sample bounds for ridge(less) misspecified case. 본 논문이 이 결과를 asymptotic ($P, T \to \infty$, $P/T \to c$) + 약한 가정 (PSD $\Psi$, non-iid signals) 으로 확장. **각주 9 + 5a.5 + 09_appendix_proof 에 자세히**.

### Bartlett, Long, Lugosi, Tsigler (2020, *PNAS*)
- **제목**: "Benign overfitting in linear regression"
- **본 논문과 관계**: **Benign overfit** 의 정의 + 조건. 본 논문의 핵심 phenomenon. **각주 4 인용**.

### Tsigler, Bartlett (2023, *JMLR*)
- **제목**: "Benign overfitting in ridge regression"
- **본 논문과 관계**: Ridge regression 의 benign overfit + optimal regularization 결과. 본 논문이 활용.

### Belkin, Hsu, Ma, Mandal (2019, *PNAS*)
- **제목**: "Reconciling modern machine-learning practice and the classical bias-variance trade-off"
- **본 논문과 관계**: **Double descent** 의 발견. 본 논문이 이 statistical phenomenon 을 finance timing 의 *double ascent* 로 변환. **각주 8 + 5b.10 (Fig 1 풀이)**.

### Belkin, Hsu, Xu (2020)
- **제목**: "Two models of double descent for weak features"
- **본 논문과 관계**: Double descent 의 weak feature regime. 본 논문의 RFF setting 과 관련.

### Belkin, Rakhlin, Tsybakov (2019, *AISTATS*)
- **제목**: "Does data interpolation contradict statistical optimality?"
- **본 논문과 관계**: Interpolation boundary 이후의 statistical 성능. 본 논문의 $c > 1$ 영역.

### Spigler, Geiger, d'Ascoli, Sagun, Biroli, Wyart (2019, *J. Phys. A*)
- **제목**: "A jamming transition from under- to over-parameterization affects generalization in deep learning"
- **본 논문과 관계**: NN 의 jamming transition (phase transition at $c=1$). 본 논문의 $c \approx 1$ catastrophe 의 physical 해석.

### Wu, Xu (2020, *NeurIPS*)
- **제목**: "On the optimal weighted $\ell_2$ regularization in overparameterized linear regression"
- **본 논문과 관계**: 본 논문의 ridge regression 분석과 직접 연관. **각주 9**.

### Richards, Mourtada, Rosasco (2021, *AISTATS*)
- **제목**: "Asymptotics of ridge(less) regression under general source condition"
- **본 논문과 관계**: 본 논문과 같은 asymptotic regime. Gaussian iid 가정 — 본 논문이 이를 4-moment bound 로 relax. **각주 9**.

### Mei, Misiakiewicz, Montanari (2022, *J. Pure Appl. Math.*)
- **제목**: "Generalization error of random feature and kernel methods"
- **본 논문과 관계**: RFF 의 generalization error 분석. 본 논문 Section V.F 의 nonlinearity discussion 의 토대. **각주 36 + 7.10**.

### Mei, Montanari (2022, *Communications on Pure and Applied Math.*)
- **제목**: "The generalization error of random features regression: Precise asymptotics and the double descent curve"
- **본 논문과 관계**: RFF 의 double descent. 본 논문의 empirical pattern 의 prior.

### Ghorbani et al (2020, *NeurIPS*)
- **제목**: "When do neural networks outperform kernel methods?"
- **본 논문과 관계**: RFF/kernel 의 한계와 NN 의 advantage. 각주 22, 36.

---

## 14.3 Universal Approximation + Neural Network Theory (5편)

본 논문의 RFF = wide NN 의 등가물 정당화.

### Hornik, Stinchcombe, White (1990, *Neural Networks*)
- **제목**: "Universal approximation of an unknown mapping and its derivatives using multilayer feedforward networks"
- **본 논문과 관계**: NN 의 universal approximation 정리. 본 논문 Eq (2) 의 직접 인용. **Section 3.3**.

### Jacot, Gabriel, Hongler (2018, *NeurIPS*)
- **제목**: "Neural tangent kernel: Convergence and generalization in neural networks"
- **본 논문과 관계**: **NTK** — wide NN ↔ kernel regression equivalence. 본 논문이 RFF 를 NN 의 등가물로 활용하는 직접 정당화. **각주 7**.

### Allen-Zhu, Li, Song (2019, *ICML*)
- **제목**: "A convergence theory for deep learning via over-parameterization"
- **본 논문과 관계**: Over-parameterized NN 의 gradient descent convergence. NTK 와 연관.

### Du, Lee, Li, Wang, Zhai (2019)
- **제목**: "Gradient descent finds global minima of deep neural networks"
- **본 논문과 관계**: NN over-parameterization → global min 도달. NTK 의 보완.

### Du, Zhai, Poczos, Singh (2018)
- **제목**: "Gradient descent provably optimizes over-parameterized neural networks"
- **본 논문과 관계**: NN 의 trainability 결과.

### Ali, Kolter, Tibshirani (2019, *AISTATS*)
- **제목**: "A continuous-time view of early stopping for least squares regression"
- **본 논문과 관계**: NN 의 **early stopping** ≈ ridge regularization 결과. 본 논문 Section IV.A 의 인용.

---

## 14.4 Random Features (4편)

### Rahimi, Recht (2007, *NeurIPS*)
- **제목**: "Random features for large-scale kernel machines"
- **본 논문과 관계**: **RFF** 의 발명. 본 논문 Eq (20) 의 직접 사용. **각주 1, 36 + Section 7.3**.

### Rahimi, Recht (2008, *NeurIPS*)
- **제목**: "Weighted sums of random kitchen sinks: Replacing minimization with randomization in learning"
- **본 논문과 관계**: Random features 의 일반화. 본 논문 Section V.B 에서 인용.

### Liu et al (2021, *IEEE TPAMI*)
- **제목**: "Random features for kernel approximation: A survey on algorithms, theory, and beyond"
- **본 논문과 관계**: RF method survey. 본 논문 각주 37 인용.

### Sutherland, Schneider (2015, *UAI*)
- **제목**: "On the error of random Fourier features"
- **본 논문과 관계**: RFF 의 error bound. 본 논문 각주 37 — RFF 함수형 form 선택의 정당화.

### Rudi, Rosasco (2017, *NeurIPS*)
- **제목**: "Generalization properties of learning with random features"
- **본 논문과 관계**: RFF 의 generalization. 본 논문 각주 36.

---

## 14.5 Random Matrix Theory (6편)

본 논문의 RMT 도구의 토대.

### Marčenko, Pastur (1967, *Mathematics of the USSR-Sbornik*)
- **제목**: "Distribution of eigenvalues for some sets of random matrices"
- **본 논문과 관계**: **Marchenko-Pastur 정리** — sample covariance eigenvalue 분포. 본 논문의 가장 깊은 토대. **각주 24 + 5a.5**.

### Silverstein, Bai (1995, *J. Multivariate Analysis*)
- **제목**: "On the empirical distribution of eigenvalues of a class of large dimensional random matrices"
- **본 논문과 관계**: MP 의 일반화 (non-Gaussian). 본 논문 Internet Appendix Theorem 2 의 토대.

### Bai, Zhou (2008, *Statistica Sinica*)
- **제목**: "Large sample covariance matrices without independence structures in columns"
- **본 논문과 관계**: 본 논문 Theorem 1A (IA) 의 직접 prior — non-iid signals 의 spectral 결과.

### Yaskov (2016, *Comptes Rendus Mathematique*)
- **제목**: "A short proof of the Marchenko-Pastur theorem"
- **본 논문과 관계**: 본 논문이 사용하는 method of proof. **Section 3.11 + 09_appendix**.

### Ledoit, Péché (2011, *Probability Theory and Related Fields*)
- **제목**: "Eigenvectors of some large sample covariance matrix ensembles"
- **본 논문과 관계**: 본 논문 Propositions 2-3 의 일부 형식의 prior. **Section 5b.5**.

### Ledoit, Wolf (2020, *Annals of Statistics*)
- **제목**: "Analytical nonlinear shrinkage of large-dimensional covariance matrices"
- **본 논문과 관계**: Nonlinear shrinkage estimator. 본 논문 각주 25 의 옵션.

---

## 14.6 Asset Pricing — Return Predictability (8편)

### Goyal, Welch (2008, *Review of Financial Studies*)
- **제목**: "A comprehensive look at the empirical performance of equity premium prediction"
- **본 논문과 관계**: **본 논문 정면 반박 대상**. 15 predictor 비관 결론을 같은 데이터로 정반대 결과 도출. **Section 3.2 + 7.8**.

### Goyal, Welch, Zafirov (2023)
- **제목**: "A comprehensive 2021 look at the empirical performance of equity premium prediction II"
- **본 논문과 관계**: GW 2008 의 update. timing-strategy performance 일부 다룸. **각주 33, 43**.

### Cochrane (2011, *Journal of Finance, Presidential Address*)
- **제목**: "Discount rates"
- **본 논문과 관계**: Discount rates 의 시간 변화 — asset pricing 의 central question. 본 논문의 motivation. **각주 2 + 6 + Section 3.1**.

### Koijen, Van Nieuwerburgh (2011, *Annual Review of Financial Economics*)
- **제목**: "Predictability of returns and cash flows"
- **본 논문과 관계**: 시장 예측 가능성 survey. **각주 6**.

### Campbell, Thompson (2008, *Review of Financial Studies*)
- **제목**: "Predicting excess stock returns out of sample: Can anything beat the historical average?"
- **본 논문과 관계**: **Campbell-Thompson constraint** + R² → timing mapping. 본 논문이 GW 결론에 부분적으로 응답 + nonnegativity constraint 비교. **Section 5b.10 + 7.10**.

### Hansen, Richard (1987, *Econometrica*)
- **제목**: "The role of conditioning information in deducing testable restrictions implied by dynamic asset pricing models"
- **본 논문과 관계**: Conditional vs unconditional moment restrictions. 본 논문 각주 18.

### Ferson, Siegel (2001, *Journal of Finance*)
- **제목**: "The efficient use of conditioning information in portfolios"
- **본 논문과 관계**: 본 논문 각주 18.

### Abhyankar, Basu, Stremme (2012, *Journal of Banking & Finance*)
- **제목**: "Portfolio efficiency and discount factor bounds with conditioning information"
- **본 논문과 관계**: 본 논문 각주 18.

---

## 14.7 ML × Finance — Empirical (11편)

### Rapach, Strauss, Zhou (2010, *Review of Financial Studies*)
- **제목**: "Out-of-sample equity premium prediction: Combination forecasts and links to the real economy"
- **본 논문과 관계**: Forecast combination 으로 shrinkage 효과. **각주 5 + Section 3.11**.

### Rapach, Zhou (2013, *Handbook of Economic Forecasting*)
- **제목**: "Forecasting stock returns"
- **본 논문과 관계**: ML × finance survey 의 prior.

### Rapach, Zhou (2020, *Machine Learning for Asset Management*)
- **제목**: "Time-series and cross-sectional stock return forecasting: New machine learning methods"
- **본 논문과 관계**: ML × finance method survey.

### Rapach, Zhou (2022, *Oxford Research Encyclopedia of Economics and Finance*)
- **제목**: "Asset pricing: Time-series predictability"
- **본 논문과 관계**: 최신 survey. **각주 6**.

### Ludvigson, Ng (2007, *J. Financial Economics*)
- **제목**: "The empirical risk-return relation: A factor analysis approach"
- **본 논문과 관계**: Macro PCA + market return. **Section 3.11**.

### Kelly, Pruitt (2013, *Journal of Finance*)
- **제목**: "Market expectations in the cross-section of present values"
- **본 논문과 관계**: PLS on present-value identity. **각주 6, Section 3.11**.

### Kelly, Xiu (2022, *Working paper*)
- **제목**: "Financial machine learning"
- **본 논문과 관계**: ML × finance survey, by the same author.

### Gu, Shihao, Kelly, Xiu (2020, *Review of Financial Studies*)
- **제목**: "Empirical asset pricing via machine learning"
- **본 논문과 관계**: ML × asset pricing 의 first wave 의 결정작. **[Deep dive ✓](../2026-05-17_gu-kelly-xiu-autoencoder/)**.

### Chen, Pelger, Zhu (2023, *Management Science*)
- **제목**: "Deep learning in asset pricing"
- **본 논문과 관계**: GAN no-arbitrage. **[Deep dive ✓](../2026-05-18_chen-pelger-zhu-deep-learning-ap/)**.

### Freyberger, Neuhierl, Weber (2020, *RFS*)
- **제목**: "Dissecting characteristics nonparametrically"
- **본 논문과 관계**: Nonparametric characteristic-based prediction.

### Kozak, Nagel, Santosh (2020, *Journal of Financial Economics*)
- **제목**: "Shrinking the cross-section"
- **본 논문과 관계**: Ridge regression on anomaly portfolios.

### Dong, Li, Rapach, Zhou (2022, *Journal of Finance*)
- **제목**: "Anomalies and the expected market return"
- **본 논문과 관계**: 100 long-short anomaly portfolio 로 시장 예측.

---

## 14.8 Market Efficiency + ML Implications (3편)

### Martin, Nagel (2022, *Journal of Financial Economics*)
- **제목**: "Market efficiency in the age of big data"
- **본 논문과 관계**: ML 시대의 market efficiency. 본 논문 conclusion.

### Da, Nagel, Xiu (2022, *Working paper*)
- **제목**: "The statistical limit of arbitrage"
- **본 논문과 관계**: ML 환경에서 arbitrage 의 통계적 한계.

### Fan et al (2022)
- **제목**: "Structural deep learning in conditional asset pricing"
- **본 논문과 관계**: NN × conditional AP.

### Fan, Guo, Zheng (2022, *J. American Statistical Association*)
- **제목**: "Estimating number of factors by adjusted eigenvalues thresholding"
- **본 논문과 관계**: Factor 수 추정. RMT 활용.

### Fan, Fan, Lv (2008, *J. Econometrics*)
- **제목**: "High dimensional covariance matrix estimation using a factor model"
- **본 논문과 관계**: 고차원 covariance estimation. RMT 적용.

---

## 14.9 Mean-Variance + Sharpe Ratio + Time-Series Momentum (3편)

### Moskowitz, Ooi, Pedersen (2012, *JFE*)
- **제목**: "Time series momentum"
- **본 논문과 관계**: 본 논문 Section V.F 에서 robustness check 대상. ML 의 시그널 ≠ 단순 TSMOM. **각주 49**.

### Leitch, Tanner (1991, *American Economic Review*)
- **제목**: "Economic forecast evaluation: Profits versus the conventional error measures"
- **본 논문과 관계**: 본 논문 각주 5 — economic value vs statistical error.

### Cenesizoglu, Timmermann (2012, *J. Banking & Finance*)
- **제목**: "Do return prediction models add economic value?"
- **본 논문과 관계**: 본 논문 각주 5 — 같은 주장.

---

## 14.10 Other (2편)

### Box (1976, *J. American Statistical Association*)
- **제목**: "Science and statistics"
- **본 논문과 관계**: **"All models are wrong, but some are useful" + parsimony 권고**. 본 논문이 정면 반박. **Section 8.7 (Occam's razor / blunder)**.

### Gagliardini, Ossola, Scaillet (2016, *Econometrica*)
- **제목**: "Time-varying risk premium in large cross-sectional equity data sets"
- **본 논문과 관계**: 본 논문 각주 13 — random coefficient $\beta$ 가정의 prior.

### Giannone, Lenza, Primiceri (2021, *Econometrica*)
- **제목**: "Economic predictions with big data: The illusion of sparsity"
- **본 논문과 관계**: 경제 데이터에서 sparsity 의 *illusion*. 본 논문 각주 22 — LASSO 대신 ridge 선택의 정당화.

### Dobriban, Wager (2018, *Annals of Statistics*)
- **제목**: "High-dimensional asymptotics of prediction: Ridge regression and classification"
- **본 논문과 관계**: Ridge regression 의 고차원 asymptotic. 본 논문 각주 9.

---

## 14.11 References 의 cluster 별 통계

| 클러스터 | 개수 | 본 논문에서의 역할 |
|----------|------|-------------------|
| ML Theory (Hastie, Bartlett, Belkin 등) | 12 | Benign overfit + double descent — **본 논문의 statistical foundation** |
| Universal Approximation + NN | 5 | RFF = NN equivalence 정당화 |
| Random Features | 4 | Eq (20) RFF 의 출처 |
| Random Matrix Theory | 6 | **Stieltjes + Marchenko-Pastur — 본 논문 도구** |
| Asset Pricing — Predictability | 8 | **본 논문 motivation + GW 2008 반박 대상** |
| ML × Finance Empirical | 11 | 본 논문 실증의 baseline + competitor |
| Market Efficiency | 5 | 본 논문 시사점 |
| Mean-Variance + TSMOM | 3 | Section V.F robustness |
| 기타 (Box, Gagliardini, ...) | 5 | 다양한 minor references |
| **총합** | **~59 (paper References 의 ~85%)** | |

→ Paper 의 References 70+ 중 **~59 cluster-classified**. 나머지 ~10 references 는 minor citations (proceedings, working papers, web sources) — 본 논문 main argument 와 관련성 낮음.

---

## 14.12 본 deep dive 가 인용한 다른 deep dive

본 논문이 Kelly-Pelger 계보의 마무리이므로, 다른 deep dive 를 cross-link:

- **[Lettau-Pelger 2020 RP-PCA](../2026-05-17_lettau-pelger-rppca/)** — 약한 요인 검출 (분산 + 평균 페널티). VoC 의 RMT 도구를 finance 에 가져오는 *prior*.
- **[Gu, Kelly, Xiu 2020 Autoencoder Asset Pricing](../2026-05-17_gu-kelly-xiu-autoencoder/)** — Conditional autoencoder factor model. ML × AP 의 *empirical breakthrough*.
- **[Chen, Pelger, Zhu 2023 DLAP](../2026-05-18_chen-pelger-zhu-deep-learning-ap/)** — GAN no-arbitrage. *empirical capstone* of pre-VoC era.
- **[Nie et al 2023 PatchTST](../2026-05-19_nie-patchtst-time-series-64-words/)** — Time series Transformer. ML for time series 의 *modern building block*.

본 deep dive 가 이 lineage 의 **theoretical capstone** — RMT + ridge regression 으로 ML × finance 의 모든 실증 결과를 정당화.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. **본 논문 references 의 가장 중요한 5편?**
2. **"Hastie et al 2022" 와 본 논문의 본질적 차이?**
3. **본 deep dive 가 paper references 중 cover 한 것은 몇 %?**

### 답변
1. **(i) Hastie-Montanari-Rosset-Tibshirani (2022)** — 본 논문의 가장 가까운 prior, finite-sample ridge(less). **(ii) Bartlett-Long-Lugosi-Tsigler (2020)** — benign overfit 의 정의. **(iii) Marchenko-Pastur (1967)** — RMT 의 출발점, 본 논문 Stieltjes 도구의 토대. **(iv) Rahimi-Recht (2007)** — RFF 의 발명, 본 논문 Eq (20). **(v) Goyal-Welch (2008)** — 본 논문 정면 반박 대상.
2. Hastie 는 *finite-sample* + *strictly PSD $\Psi$* + *iid Gaussian signals* 가정의 ridge regression 의 *error variance* (statistical metric) 의 bound. 본 논문은 *asymptotic* ($P, T \to \infty$) + *PSD only* (degenerate eigenvalue 허용) + *4-moment bounded signals* (RFF 같은 non-iid OK) 의 *economic metric* (Sharpe ratio, alpha, IR, R², expected return, leverage) 의 *closed form limit*. 분석 도구 (RMT + Lemma 1) 와 결과 형식 (Theorem 1 의 monotonicity) 가 다름.
3. paper References ~70편 중 본 deep dive 가 **cluster-classified + brief description 한 것은 ~59편 (85%)**. 나머지 ~10편은 proceedings / minor citations / web sources — main argument 와 관련성 낮음. 다른 deep dive 의 References cover 율 (보통 핵심 ~20편 = 30-40%) 대비 본 deep dive 가 **3배 깊이**.

---

이로써 본 deep dive 의 모든 챕터 완성. paper main text (Sections I-VI) + Internet Appendix (Theorems 1A/2, Propositions IA1, Figures IA1-IA12, Tables IA1-IA2) + References (70+ 의 85%) 모두 cover.
