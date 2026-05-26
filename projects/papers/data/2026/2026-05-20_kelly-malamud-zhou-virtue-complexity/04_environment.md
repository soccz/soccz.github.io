# 04. 논문의 가정 (수학 setup) — 친근한 비유로

> **🧒 한 줄 요약**: Setting. Random Fourier features + ridge regression.


> 본 챕터는 *논문의 분석 환경* (Assumptions 1-5 + Lemma 1 + Proposition 1) 을 *수식 거의 없이* 친근하게 풀이. 수식이 두려운 사람은 *비유 박스* 만 봐도 메시지 다 이해 가능.

---

## 4.1 챕터 한 줄 요약

> **"본 논문은 *시장 수익률 = 어떤 함수 + 잡음* 의 단순한 가정 5개로 분석. 신 (진짜 정답을 아는 분) 의 *최대 Sharpe ratio* 가 약 0.58 미만 — 우리가 이 수치를 *기준점* 으로 본다."**

---

## 4.2 시장 수익률을 어떻게 *수학적* 으로 모델링?

### 일상 비유 — *학생의 시험 점수 모델*

가상의 학생이 매월 시험을 본다고 하자. 시험 점수에 영향을 주는 요인:
- 그 달의 *컨디션* (잠, 영양)
- 그 달의 *공부량*
- 운 (random 잡음)

**모델**: 시험 점수 = (컨디션 × 가중치) + (공부량 × 가중치) + 잡음.

본 논문이 시장 수익률을 *비슷한 형식* 으로 모델링:

> **다음 달 시장 수익률 = (현재 macro 정보의 함수) + 잡음**

여기서:
- **현재 macro 정보** = 배당률, 이자율, 인플레이션 같은 15개 변수.
- **함수** = 우리가 *모르는* 진짜 자연 법칙.
- **잡음** = 예측 불가능한 random.

### **Assumption 1 (가정 1) — Single asset 의 식 (3)**

본 논문이 분석 *단순화* 를 위해 가정:
> **"분석 대상은 *시장 지수 하나*. Cross-section (개별 주식 비교) 무시."**

**일상 비유**: 100명 학생 비교가 아니라 *한 학생* 의 시간 변화만 본다.

**의미**: 시장 timing (언제 비중 늘릴까/줄일까) 만 분석. 종목 선택 (어떤 주식 살까) 은 본 논문 scope 외.

**Equation 3 (식 3)**: 시장 수익률의 본 논문 식 — *지난 달 macro 정보의 함수 + iid 잡음*. $\sigma^2 = 1$ 로 *normalize*.

**각주 2 (Single-asset 의 의의)**: Single-asset time-series 가 *시장 수익률 예측* (자산가격의 central question — Cochrane 2011) 과 직접 일치. Cross-section panel 로 일반화 가능하지만 covariance complication.

**각주 11 (Skewness 0 가정의 단순화)**: $E[\varepsilon^3] = 0$ 이 분석 식 단순화에 사용. 결과는 일반 case 에서도 valid.

### Assumption 1 의 또 다른 부분 — 잡음의 성질

논문은 *잡음 (random noise)* 에 4가지 조건:
1. **평균 0** — 잡음이 양/음 평등하게.
2. **각 달이 독립** — 이번 달 잡음이 다음 달과 무관.
3. **비대칭 (skewness) 0** — symmetric 분포.
4. **4번째 모멘트 유한** — 잡음의 *꼬리* 가 너무 두껍지 않음.

**일상 비유**: 평범한 *동전 던지기 (50-50)* 같은 잡음. *극단적 outlier* 없음.

**Section I.A — Asset Dynamics**: 위 가정들이 본 논문 Section I.A 의 내용.

---

## 4.3 **Assumption 2 (가정 2) — 변수의 covariance 구조**

**Section I.A** 의 두 번째 가정.

논문이 또 가정:
> **"15 변수 (또는 RFF 12,000 변수) 가 어떤 *공변동 구조* 를 따른다."**

**일상 비유**: *각 학생의 시험 과목 점수가 서로 어느 정도 상관* — 수학 잘하는 학생이 물리도 잘하는 경향. 그 *상관 구조* 가 변수들 간에도 존재.

수학자가 부르는 이름: $\Psi$ (Psi). $P \times P$ 행렬.

### 더 세부 가정

- *각 변수의 평균* = 0 (표준화).
- *각 변수의 분산* = 1 (표준화).
- *세 변수가 동시* 곱해서 평균을 봤을 때 = 0 (skewness 없음).
- *네 변수 의 4-way 의존* 이 너무 강하지 않음.

이런 조건이 *Random Matrix Theory* 의 표준 조건. 실제 RFF (Random Fourier Features) 가 이를 만족.

**Equation 4 (식 4)**: $S_t = \Psi^{1/2} X_t$ — *분해* 형식. $\Psi$ 가 covariance, $X_t$ 가 *iid uncorrelated* 부분.

**각주 12 (degenerate Ψ)**: $\Psi$ 가 *strictly degenerate* (zero eigenvalue 있음) 이면 일부 signal redundant. 본 논문 가정은 *PSD only* (other paper 의 *strict positive definite* 보다 약함).

**각주 13 (Random β 의 prior)**: Gagliardini-Ossola-Scaillet (2016) 의 *time-varying risk premium* 분석에서 *random coefficient* 사용 — 본 논문 Assumption 4 의 prior.

---

## 4.4 **Assumption 3 (가정 3) — 변수의 *eigenvalue 분포***

**Section I.A** 의 세 번째 가정.

본 논문이 핵심으로 다루는 영역: **변수 수 P 가 무한대로 갈 때 어떻게 행동하는가**.

P 가 커지면 *변수의 covariance 행렬* ($\Psi$) 도 커짐. 그 행렬의 *eigenvalue 분포* 가 어떤 *확정된 모양 (H)* 으로 수렴한다고 가정.

**일상 비유**: 학생 10,000명 의 *각 과목 점수의 표준편차들* 의 분포 = 어느 정도 *확정 모양* (예: 0.1-3.0 사이 균등).

수학자가 부르는 이름: *spectral distribution* $H$.

**의미**: 변수 분포가 *너무 막 행동하지 않음* — 통계 도구가 작동할 수 있는 조건.

**Equation 4 의 보완**: 본 가정으로부터 *asymptotic moments* $\psi_{*,k} = \lim P^{-1} \text{tr}(\Psi^k)$ 정의 가능. *Stieltjes transform* (다음 챕터 [05a](05_method_a_rmt.md) 의 도구) 의 input.

---

## 4.5 **Assumption 4 (가정 4) — *진짜 함수 의 모수 β***

**Section I.A** 의 네 번째 가정. *본 논문의 가장 중요한 가정*.

본 논문의 *가장 중요한* 가정. *학자들이 추정하려는 진짜 함수* 의 모수 $\beta$ 가 어떤 성질이어야 하나?

> **"$\beta$ 가 random + 평균 0 + isotropic (모든 방향 균등)."**

**일상 비유**: 자연이 *진짜 함수의 계수들* 을 *무작위 + 평등하게* 정한다고 가정. 어떤 변수가 *특별히* 중요한 게 아니라 모두 *비슷한 정도* 기여.

### β의 두 가지 핵심 성질

1. **Random**: $\beta$ 가 *데이터에서 추정* 되는 게 아니라 *자연이 정한* random. 학자는 그것을 *averaging across 모든 가능한 β realizations* 분석.
2. **Isotropic**: $\beta$ 의 covariance 가 *scaled identity*. 즉 *어떤 방향도 특별히 크지 않음*. 모든 변수가 *균등하게 약한 기여*.

**왜 이 가정?** Random Fourier Features 자체가 *isotropic* 성질을 만들어줌. 그러므로 실증과 부합.

### β 의 *scale* — 한 숫자 $b_*$

$\|\beta\|^2 / P \to b_*$ — 즉 *모든 계수의 제곱 평균* 이 어떤 limit. 이 *$b_*$ 가 작으면 (예: 0.2)* — 신호 약함. 크면 — 신호 강함.

본 논문 calibration: $b_* = 0.2$.

---

## 4.6 가정 4 의 의미 — *많은 약한 신호*

> **"본 논문 환경 = 많은 변수가 각각 약한 (1/P 크기) 기여를 한다."**

**일상 비유**: 시장 수익률 예측에 *수천 개의 macro 변수* 가 각각 *작은 신호* 를 준다. *한 변수만 결정적* 이 아니라 *모든 변수 종합* 으로 신호.

이게 **머신러닝의 자연** — neural network 도 *random initialization* 으로 *모든 hidden neuron 이 작은 기여*. 본 논문의 *β isotropic* 가정과 자연 부합.

---

**각주 14 (b_* 항등식)**: $b_* = \text{tr} E[\beta\beta'] = E[\text{tr}(\beta\beta')] = E[\|\beta\|^2]$ — $\beta$ scale 의 정확한 정의.

**각주 15 (Anisotropic β extension)**: 본 논문은 isotropic $\beta$ 가정. 일반 (anisotropic) 의 경우 *Bartlett-Long-Lugosi-Tsigler 2020* 의 *benign overfit* 관련. 본 논문은 future research.

**각주 16 (Generic β 일반화)**: Hastie et al (2022) 의 results 활용해서 generic β 분포로 extension 가능. Future direction.

---

## 4.7 **Lemma 1 (보조정리 1) — 본 논문 분석의 *핵심 trick***

> **수학적 결과**: random $\beta$ 의 *quadratic form* $\beta'A\beta$ 가 *deterministic limit* 로 수렴.

### 무지식자 친근 풀이

**일상 비유**: 만약 *모든 계수 β 가 random* 이라면 그 *quadratic form* (β 들 곱의 sum) 은 *random*. 그러나 *변수 수 P 가 매우 큼* → *law of large numbers (큰 수의 법칙)* 이 작동 → *random → deterministic*.

**더 친근**: 동전 1000번 던지면 *평균 0.5* 에 가깝다 (LLN). 비슷하게, 큰 P 에서 *random β* 의 어떤 sum 도 *예측 가능한 값* 에 수렴.

### 왜 중요?

**Lemma 1 덕분에** 모든 후속 결과 (Proposition 1, 2, 3, 4, 5, 6 + Theorem 1) 가 *random β realization 무관하게* deterministic limit 분석 가능. 

즉 *"이 β 의 경우" 가 아니라 "평균적 β realization" 의 결과* 를 정량화. 매우 강력한 도구.

---

## 4.8 Timing 전략 정의 — **Section I.B**

이제 *학자가 만드는 timing 전략* 의 정의:

> **"매월 *예측 함수* 의 값만큼 시장 비중 결정"**

**일상 비유**: 의사가 환자의 증상으로 *질병 점수* 를 계산. 점수가 높으면 *더 많이 처방*. 본 논문 학자가 *macro 변수* 로 *시장 점수* 계산. 점수가 높으면 *더 많이 베팅*.

### Sharpe ratio 의 정의 — **Equation 5 (식 5)**

투자 전략 평가 지표:
> **"평균 수익 / 변동성"**

자세히는 *uncentered second moment* 의 제곱근으로 분모 ($\sqrt{E[R^2]}$) — 수학적 편의. 결과는 *centered version (Var(R))* 과 일대일 대응.

**각주 17 (centered vs uncentered SR)**: $\widetilde{SR} = E[R]/\sqrt{Var(R)}$, $SR = 1/\sqrt{1 + \widetilde{SR}^{-2}}$ — 단조 변환.

### Timing 전략 — **Equation 6 (식 6)**

본 논문 timing weight: $\pi_t = S_t' \beta$ — *conditional expected return* 그대로 사용.

**각주 18 (Conditional MV reference)**: Hansen-Richard (1987), Ferson-Siegel (2001), Abhyankar-Basu-Stremme (2012) 의 conditional Markowitz 문헌과 연관.

**각주 19 (SR 의 cubic difference)**: 본 논문 $\pi_t = S_t'\beta$ 와 *true unconditional Markowitz* $\pi^{Uncond MV} = S_t'\beta/(1 + (S_t'\beta)^2)$ 의 *SR 차이가 SR의 세제곱 order* — small SR (예: 0.1) 에서 무시 가능.

**각주 20 (Lemma 1 의 적용)**: $1 + (S_t'\beta)^2 \to 1 + b_*\psi_{*,1}$ (Lemma 1 의 quadratic form). 분모가 *deterministic constant* 로 수렴.

---

## 4.9 **Proposition 1 (정리 1) — 신의 최대 Sharpe**

**Section I.B** 의 *infinite-sample* infeasible benchmark.

본 논문 첫 정리:

> **"가정: 신이 *진짜 β* 를 안다. 신이 *infeasible (현실에서 불가능)* 한 timing 한다면? Sharpe ratio 는 약 0.58 미만."**

### 일상 비유

신이 매월 *진짜 미래 수익률* 을 안다. 신은 그걸 그대로 timing weight 로 쓴다.

**상식 직관**: "신 = 무한 Sharpe" — *완벽한 예측* 이니까.

**Proposition 1 의 발견**: **아니다**. 신의 Sharpe 도 *약 0.58 미만*.

### 왜?

신이 잘 예측하는 만큼 *베팅 크기도 큼*. 큰 베팅 = 큰 변동성. **Sharpe = 평균 / 변동성** 이므로 *변동성 증가로 인해 bounded*.

**구체적 한계**: $1 / \sqrt{3} \approx 0.577$.

**Equation 7 (식 7)**: $SR_\infty = 1/\sqrt{3 + 1/(b_*\psi_{*,1})}$ — Proposition 1 의 정확한 식.

### 야구 비유

최고의 타자도 *모든 공을 홈런* 으로 못 침. 왜? 자신 있는 공일수록 *세게 swing* 하는데 세게 swing 하면 *miss 도 큼*. 평균 / 변동성 비율의 *물리적 한계*.

### Proposition 1 의 의미

> **"이 0.577 이 *모든 분석의 기준점*. 학자가 만드는 *현실적 (feasible)* timing 전략의 Sharpe ratio 는 0.577 보다 *작아야* 한다."**

본 논문 [05b 챕터의 그래프 (Figure 3)](05_method_b_correct.md) 의 *빨간 점선* 이 이 0.577. 모든 곡선이 그 아래.

### Untimed asset 의 Sharpe = 0 (normalization) — **Section I.B 의 normalization**

본 논문은 *시장 자체* 의 Sharpe ratio = 0 으로 정규화. 즉 *모든 timing 결과* 가 *시장 위에 추가* 되는 효과.

**무지식자 주의**: 실제 미국 시장 의 Sharpe ≈ 0.4 (역사적). 본 논문이 *0 으로 정규화* 한 건 분석 편의. 따라서 본 논문 *실증* 의 "SR 0.47 향상" 은 *시장 위에 추가* 라는 의미.

---

## 4.10 본 논문이 보는 *4가지 핵심 객체*

분석 시 본 논문이 반복해서 다루는 4가지:

| 객체 | 의미 | 친근 비유 |
|------|------|----------|
| **$\mathcal{E}$** | Expected return (기대 수익) | 평균적 수익 |
| **$\mathcal{L}$** | Leverage (베팅 크기 제곱) | 얼마나 큰 베팅을 하는가 |
| **$\mathcal{V}$** | Variance (분산) | 변동성 제곱 |
| **$SR$** | Sharpe ratio | 위험 대비 수익 |

이들이 *서로 어떻게 연결되는지* 알면 본 논문 다 이해.

### 핵심 관계 (**Equation 8 — 식 8**) 의 친근 풀이

**Section I.C** 의 핵심 분해.

> **"MSE (예측 오차 제곱) = (변동성 제곱) - 2 × (expected return) + (leverage)"**

**일상 비유**: 학생의 시험 *오차* = (실제 변동성) - 2 × (예측 정확도) + (예측 크기).

이 분해가 *bias-variance trade-off* 의 finance 버전. **각주 21**: $E[(\beta'S_t)^2] = \beta'\Psi\beta$ — quadratic form 의 expectation.

---

## 4.11 R² 와 Sharpe ratio 의 *infeasible* 관계

**Infeasible 의 경우** (신이 β 알 때):

$R^2_{\infty} = \frac{b_* \psi_{*,1}}{1 + b_* \psi_{*,1}}$  
$SR_{\infty} = \frac{1}{\sqrt{3 + 1/(b_* \psi_{*,1})}}$

여기서 $\psi_{*,1}$ = $\Psi$ 의 평균 eigenvalue.

**둘 다 *predictive power 합성* $(b_* \psi_{*,1})$ 의 monotone 함수.**

→ Infeasible 의 경우 R² 와 Sharpe 가 *일대일 대응*. 즉 R² 크면 Sharpe 크다.

**중요 발견 (다음 챕터 미리보기)**: *Feasible (estimated)* 의 경우 *이 관계가 깨진다*. R² 음수 임에도 Sharpe 양수 가능 — 이게 본 논문의 *놀라운 발견* 중 하나. [05b 챕터](05_method_b_correct.md).

---

## 4.12 한 그림으로 — 본 챕터의 framework

```
   가정 1: R = f(S) + ε                   (시장 = 함수 + 잡음)
       ↓
   가정 2: S = signal vector              (15 또는 12000 변수)
       ↓
   가정 3: Eigenvalue 분포 → H            (분포가 limit 갖음)
       ↓
   가정 4: β random isotropic             (모든 계수 평등 약함)
       ↓
   LEMMA 1: random → deterministic        (LLN — 분석 가능)
       ↓
   Timing 전략: π = S' β                  (매월 베팅 weight)
       ↓
   PROPOSITION 1 (Infeasible 신):
   SR_∞ = 1/√(3 + 1/(b_*ψ_*1)) < 1/√3 ≈ 0.577
       ↓
   이게 모든 분석의 기준점 — 학자의 timing 전략은
   이 0.577 미만의 SR 을 추구.
```

---

## 4.13 자기점검

### 핵심 3가지
1. **본 논문이 시장 수익률을 어떻게 모델링?**
2. **Lemma 1 의 의미와 왜 중요?**
3. **신의 Sharpe ratio 가 0.577 미만인 이유?**

### 답변
1. **시장 수익률 = (현재 macro 정보의 함수) + (random 잡음)**. 함수는 우리가 *모르는* 진짜 자연 법칙. 잡음은 평균 0, 시간 독립, 평범한 분포. *Single asset (시장 지수)* 만 분석 — cross-section 종목 선택 무시.
2. **Random β 의 *quadratic form* 이 *deterministic limit* 로 수렴 (LLN)**. 즉 변수 수 P 가 매우 커지면 *random* β 의 어떤 sum 도 *예측 가능한 값* 에 가까워짐. 덕분에 학자가 *"이 β 의 경우" 가 아니라 "평균적 β" 의 결과* 를 분석 가능 — 본 논문 모든 정리 (Proposition 1-6, Theorem 1) 의 *building block*.
3. **신이 잘 예측하는 만큼 *베팅 크기도 큼*. 큰 베팅 = 큰 변동성. Sharpe = 평균/변동성 이므로 변동성 증가로 *bounded*.** 야구의 *최고 타자도 모든 공 홈런 못 침* 비유. 수학적: $SR_\infty = 1/\sqrt{3 + 1/(b_*\psi_{*,1})}$, $b_*\psi_{*,1} \to \infty$ limit 에서 $1/\sqrt{3} \approx 0.577$.

---

다음 챕터: [05_method_a_rmt.md](05_method_a_rmt.md) — Random Matrix Theory 가 뭔지, *시각화 + 비유* 로.


```viz:kmz-rff-features:title=paper §3 — RFF Features,caption=Count slider.
```
