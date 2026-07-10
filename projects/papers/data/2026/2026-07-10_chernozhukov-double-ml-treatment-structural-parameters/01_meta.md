# 01. 메타 & 선정 이유

## 서지 · 인용 · 권위

- **인용 수**: 본 환경에서 Semantic Scholar / Google Scholar 접근 불가 (403 차단) 로 정확 수치 미확인. 다만 (i) 저자 진영 공식 후속작 arXiv:1701.08687 · arXiv:2103.09603 (DoubleML 패키지 논문, JMLR 2022) · arXiv:2301.09397 (Stata `ddml`) 세 편 모두 본 논문을 canonical reference 로 인용, (ii) `docs.doubleml.org` 전면이 본 논문을 이론 원전으로 지목, (iii) EconML · CausalML · CausalForest · grf · ddml · doubleml 등 6개 이상 대형 오픈소스 패키지가 본 논문을 참조 구현 원전으로 명시 → 인과 ML 계 canonical 지위 확정.
- **DOI**: 10.1111/ectj.12097 (Wiley Online Library)
- **저자 권위 배경**:
  - **Victor Chernozhukov** (MIT Economics): 고차원 계량경제학·econometric ML 의 대표 이론가. Belloni-Chernozhukov 계열의 sparse regression / IV / quantile regression 이론.
  - **Esther Duflo** (MIT Economics): 2019 노벨경제학상 (RCT 개발경제학). 본 논문에는 이론 저자로서 실증 응용 관점 참여.
  - **Whitney Newey** (MIT Economics): Newey-West HAC 표준오차 · GMM 이론의 원저자.
  - **James Robins** (Harvard Biostatistics): 인과추론 g-formula · targeted learning 계열의 원저자, Neyman orthogonality 를 인과 추정에 도입한 semiparametric efficiency 이론 계열.
  - Chetverikov · Demirer · Hansen 은 각각 UCLA · MIT Sloan · Chicago Booth 소속으로 이론+응용 균형.
- **연구실 이력**: Chernozhukov 팀은 본 논문 이전 arXiv:1501.04564 (Belloni-Chernozhukov-Hansen 2014 "Inference on treatment effects after selection amongst high-dimensional controls", Review of Economic Studies), arXiv:1502.05070 (Belloni-Chernozhukov-Hansen 2015 sparse quantile IV) 등 sparse 회귀 계열 5+편의 semiparametric 이론 논문을 축적. 본 논문은 sparse-specific 이론을 **모든 ML 예측기 (RF · boosting · lasso · NN)** 로 일반화하는 확장.

## 근거 지도 (Evidence Map)

- **핵심 claim (Neyman 직교성 + K-fold 교차적합 → √n-일치)**: 원문 Introduction §1 · Theorem 3.1 (일반화 theorem), Corollary 3.1 (PLR 적용) 위치로 알려짐. 본 환경에서 본문 PDF 차단 → DoubleML `basics.html` 의 "Overcoming regularization bias by orthogonalization" · "Overcoming the impact of overfitting on estimating θ₀" · "Error decomposition (a* + b* + c*)" 절 verbatim 으로 정성 골격 확인.
- **방법론 수식**: PLR score `[Y-ℓ(X)-θ(D-m(X))][D-m(X)]` 는 DoubleML `plm_models.inc` verbatim, IRM score 는 `irm_models.inc` verbatim 확인. DML1/DML2 알고리즘 pseudocode 는 `algorithms.rst` verbatim.
- **실험**: §5 (401(k) 응용 · N=9,915) · §6 (Angrist-Krueger 1995 IV split-sample 비교) 위치로 알려짐. N=9,915 는 WebSearch 인덱스 verbatim + `fetch_401k` R 문서 verbatim 로 확정.
- **한계·부록**: Appendix A (theorem 증명) · Appendix B (linear regression 예제 확장) 위치로 알려짐. 정확한 절 번호는 본문 PDF 접근 실패로 단정 안 함.

## 선정 이유

1. **원거리 버킷 태그 균형 (rule #1)**: `causal-ml-finance` 커버 수 0 → algorithmic-grok(3) 과 3 이상 벌어짐. 균형 규칙 발동으로 최우선 후보.
2. **`_profile.md` §F 원거리 명시적 포함**: "Causal ML in finance" 가 원거리 축의 명시 항목.
3. **P1 ProTran-TFA (paused, finance venue 재개 대기) 직결**: quantile regression + factor covariate 로 alpha 를 검정할 때 "예측기의 편향" 이 alpha 로 흘러드는 문제 (double-dipping bias) 를 정확히 이 논문의 프레임으로 격리 가능. Neyman orthogonality 를 quantile pinball loss 위로 확장하는 것이 P1 ProTran-TFA 의 causal identification 자리 매김 논거.
4. **2022AEL tactical factor allocation (사용자 사전 독파 자산) 확장**: 회귀식 `r_{i,t+1} = α_i + β_i·F_t + γ_i·M_t + ε` 에서 macro state `M_t` 로 조정한 뒤 factor `F_t` 의 신호를 추출하려 할 때 M 의 예측기 편향이 F 계수에 흘러드는 문제를 DML 로 해결. 사용자 지도교수 (Saejoon Kim) 의 2022AEL 논문 라인이 요구하는 covariate 조정을 이론적으로 정당화하는 canonical reference.
5. **APF · Grokking 두 main track 에서는 원거리이지만 전이 가능**: cross-fitting 은 attention motif intervention (APF §5) 에서 "관측 데이터로 어떤 motif 의 causal effect 를 추정할 때 다른 motif 의 confounding 을 제거하는" 도구로 이식 가능. Grokking track 은 continual learning + non-stationarity 에서 "regularization 이 학습 동학을 왜곡하는" 문제와 상통.
6. **Tier 2 top venue (Econometrics Journal) + canonical**: Source Lock (canonical identifier 확정 + 저자 공식 문서 verbatim) 통과. 이후 후속 논문 대부분이 이 논문을 필수 인용하는 substrate.
