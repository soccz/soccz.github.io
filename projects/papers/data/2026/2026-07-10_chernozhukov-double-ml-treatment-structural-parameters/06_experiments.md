# 06. 실험 해부

## 배경 사다리

인과 추론 논문의 실험은 두 종류로 갈린다: (i) synthetic Monte Carlo — DGP 를 알고 있으므로 bias/variance/coverage 를 정확히 잴 수 있음, (ii) real-world — bias 는 못 재지만 실용성을 보임. DML 논문은 둘 다 한다. 저자 진영 진술에 따르면 시뮬레이션 파트는 partially linear model 과 IRM 모두 커버하고, 실증 파트는 401(k) 저축 계획을 중심으로 진행.

## 실증 응용 — 401(k) 자산 효과 (§5)

### 데이터

- **표본 크기**: N = 9,915 개인 (WebSearch verbatim 확인 + DoubleML R 패키지 `fetch_401k` reference 페이지 verbatim)
- **원출처**: 1991 Survey of Income and Program Participation (SIPP) 데이터
- **관측 변수**:
  - $Y$: 순금융자산 (net financial assets)
  - $D$: 401(k) 계획 참여 여부 (binary)
  - $Z$: 401(k) 계획 접근 자격 (eligibility, IV 로 사용)
  - $X$: 소득 · 연령 · 결혼 · 교육 · 가족 크기 · IRA 참여 · pension 자격 등 covariate 벡터 (약 10-20 차원)

### 왜 이 데이터가 이 논문 주장에 적합한가

1. **overlap 조건이 자연스럽게 성립**: eligibility $Z$ 가 회사 특성으로 결정되므로 개인 특성으로 완전히 예측되지 않음. propensity $m_0(X) \in (0.1, 0.9)$ 정도 범위.
2. **unconfoundedness 위협이 명확**: 저축 성향 (savings taste) 은 관측되지 않는 confounder 이지만, $X$ 에 IRA 참여 여부를 포함하면 대체 지표로 흡수 가능하다는 문헌적 argument (Poterba-Venti-Wise 1994) 이 있음.
3. **정책적 관심 큼**: 401(k) 는 미국 세제 지원 은퇴 저축의 핵심 → 결과가 실질 정책 함의 갖는다.
4. **비교 baseline 풍부**: Poterba-Venti-Wise 1994/1995, Abadie 2003, Chernozhukov-Hansen 2004 등 동일 데이터 계열의 계량 논문 다수 존재 → DML 결과가 얼마나 이전과 다른지 비교 가능.

### 이 데이터 선택의 숨은 편향

- **1991년 데이터**: 30 년 이상 지난 데이터 → 현재 은퇴 저축 구조와 다름 (401(k) 매칭 정책, 자동가입 정책 미도입). 결과가 최신 정책에 그대로 이식되지 않음.
- **SIPP 표본의 저소득 과대표집**: SIPP 는 소득분포 하위 40% 를 oversample. 자산 효과 추정치가 저소득 쪽으로 기울 가능성.
- **자기보고 자산**: SIPP 자산 데이터는 자기보고 → 측정오차 존재. DML 이론은 iid 관측 가정하지만 측정오차는 별개 축.

## 시뮬레이션 (§4/§Appendix)

원 논문에서는 partially linear 모형과 IRM 모형에 대해 synthetic DGP 를 설계해 bias · variance · coverage 를 잰다. 본 환경에서 원문 표 정확 위치·수치 접근 실패 → 정성 골격만 정리.

### 확인 가능한 실험 골격

- **DGP**: $g_0(X), m_0(X)$ 를 sparse linear · nonlinear · high-dim 등 여러 종류로 세팅
- **nuisance 예측기**: lasso · post-lasso · random forest · boosting · neural network 다양하게 스윕
- **비교 metric**: bias · MC standard deviation · MSE · 95% CI coverage
- **비교 baseline**: (i) naive plug-in (직교화 X, sample splitting X), (ii) orthogonal 없음 + splitting O, (iii) orthogonal O + splitting X, (iv) DML (둘 다 O). 두 축이 각자 어떤 편향을 잡는지 ablation.

원문 정확한 표 번호·수치 (bias 값·coverage %·표본 크기 sweep) 는 본문 PDF 차단으로 단정 안 함.

## 베이스라인 공정성 검토

이 논문은 신제안 알고리즘 논문이 아니라 이론 프레임 논문이므로 "baseline 이 fair 하게 튜닝되었는가" 논쟁이 상대적으로 덜 첨예. 다만:

- **소박 plug-in 을 straw-man 으로 세우는 위험**: `basics.html` verbatim 골격에서 소박 plug-in 이 $|\sqrt{n}(\hat{\theta}-\theta)|\to_P\infty$ 로 발산한다고 보이는데, 이는 이론적 발산이지 유한 표본 성능은 실제로 얼마나 나쁜지 별개. 유한 표본에서 소박 plug-in 이 몇 % 편향인지가 실무적으로 중요.
- **직교화만 vs. 교차적합만 ablation 의 중요성**: 두 축이 각자 어떤 편향을 잡는지 격리 실험이 논문의 주장 근간. 이 ablation 이 원문 어느 표에 정확히 있는지 확인 필요 (원문 접근 실패로 단정 안 함).
- **ML 예측기 하이퍼파라미터 튜닝**: RF depth · lasso $\lambda$ · boosting iteration 수를 어떻게 정했는지. cross-validation 을 nuisance 학습 안에서 추가로 돌리면 표본이 삼중 분할 → 각 fold 안에 nested CV 라는 복잡한 구조.

## 지표 선택

- **95% CI coverage**: DML 의 핵심 주장이 "표준 통계 도구 재활용 가능" 이므로 CI coverage 가 명목 수준 (95%) 에 가까이 도달하는지가 핵심. 이론이 옳으면 coverage → 95% (표본 크기 커질수록).
- **MC bias**: DML 이 소박 plug-in 대비 얼마나 편향을 줄였는지.
- **MC variance**: DML 이 원 semiparametric bound 를 달성하는지 (효율성 판정).

이 세 metric 이 canonical 조합. 다른 metric 이었다면 결론이 크게 흔들리지 않을 것 (인과 추론에서 CI coverage 는 대체 불가능한 안전성 지표).

## 주요 표·그림 3-5 개 해석 (원문 접근 제한적)

원문 PDF 접근 실패로 정확한 표 번호·수치를 명시할 수 없다. 이하 정성 골격 (WebSearch 인덱스 및 저자 후속작 arXiv:1701.08687 정성 요약):

1. **Table (401(k) main result)**: DML 추정치와 여러 ML nuisance 조합 (RF · lasso · boosting · NN) 을 나열. 저자 진술 verbatim — 다양한 ML 예측기 조합에도 DML 추정치가 강건 (즉 point estimate 가 크게 안 흔들림).
2. **Table (simulation main)**: DML1 vs DML2 vs naive plug-in vs Robinson kernel 등 방법론 비교. 예상 결과 (이론 맞으면): DML1/DML2 는 명목 coverage 달성, naive plug-in 은 coverage 폭락, kernel 은 차원 낮을 때만 유효.
3. **Figure (편향 분해)**: sample size 를 sweep 하면서 편향 vs 표준편차 커브. DML 은 표본 커질수록 편향 → 0 이지만 소박 plug-in 은 편향이 감소하지 않음.

**수치 투명성 규칙 적용**: 정확한 표 번호·소수점 수치·seed σ·hyperparameter grid 는 본문 PDF 차단으로 "원문에 수치 미보고" 로 처리.

## Ablation — 저자가 일부러 넣은 것과 숨긴 것

**저자가 명시적으로 넣은 것**:
- 직교화 유무 × 교차적합 유무 2×2 ablation (아마도)
- 여러 ML 예측기 (lasso · RF · boosting · NN) 스윕
- DML1 vs DML2 비교

**숨겼거나 강조 덜 한 것 (추정)**:
- $K$ 값 sensitivity (K=2 vs K=5 vs K=10 비교가 원문 얼마나 자세한지 미확인)
- nuisance rate 조건 위반 시나리오 (일부 예측기가 rate 못 맞추면 어떻게 되는지)
- IIVM 실험 (PLIV 대비 상대적 강조 약함 — 후속 논문에서 확장)

## 부록에 숨은 신호

원문 Appendix 접근 실패로 정확 확인 불가. 일반적으로 이런 논문의 부록에는 (a) Theorem 3.1 등 일반 정리의 증명, (b) $b^*$ 항이 어떤 조건에서 실제 소실되는지의 엄밀한 조건, (c) rate 조건 위반 시 debias 확장 (Chernozhukov-Belloni 2018 계열) 이 들어감.

## 이 절의 핵심 한 문장

**"401(k) 실증 응용은 DML 이론이 실제 정책적 질문에 답할 수 있음을 보이는 canonical 데모이며, 다양한 ML nuisance 예측기 교체에도 결과가 강건하다는 점이 프레임의 실용성을 뒷받침한다 — 다만 정확한 표 수치는 본 환경 접근 제약으로 미확인."**
