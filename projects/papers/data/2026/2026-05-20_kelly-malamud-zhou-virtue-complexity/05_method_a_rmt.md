# 05a. Random Matrix Theory — 도구를 친근하게

> 본 논문이 사용하는 *수학 도구* 인 Random Matrix Theory (RMT) 를 *수식 거의 없이* 시각화 + 일상 비유로. 이 도구 하나가 본 논문 모든 결과의 *기초*.

---

## 5a.1 챕터 한 줄 요약

> **"본 논문은 *수천 변수의 통계* 를 1967년 발명된 *Random Matrix Theory* 로 분석. 핵심: 모든 portfolio 결과 (Sharpe ratio, R², 기대 수익) 가 *단일 함수 m(-z; c)* 로 결정되며 이 함수가 *데이터에서 직접 계산 가능* — 이게 분석을 *practical* 하게 만든 마법."**

---

## 5a.2 도입 — 왜 새 도구 필요? (**Section II 의 모든 내용**)

### 전통 통계의 *황금률*

학자들이 1900-2000년 동안 사용하던 *황금률*:

> **"데이터 무한대로 많으면 (T → ∞), 표본 통계 → 진짜 모집단 통계."**

**일상 비유**: 동전 1000번 던지면 *앞면 비율* 이 0.5 에 매우 가깝다 (LLN). 100만번 던지면 *더 가깝다*. 데이터 많을수록 *진실에 가까움*.

이 황금률이 *통계학의 모든 도구* (OLS, MLE, 가설 검정) 의 토대.

### 황금률이 *깨지는* 영역

본 논문의 환경: **데이터 수 T 가 무한대로 가는 동시에 변수 수 P 도 무한대로**.

**일상 비유**: 학생 1000명 데이터로 1000 과목을 분석. 데이터 10,000 으로 늘려도 *과목도 10,000 늘리면* 같은 비율.

이 영역에서 *황금률 안 통함*. 즉 *표본 통계 → 진짜 모집단 통계* 가 **거짓**.

→ **새 통계 도구 필요.**

---

## 5a.3 Random Matrix Theory 의 등장

> **"1967년 두 우크라이나 수학자 Marchenko + Pastur 가 *변수 수 = 데이터 수* 영역의 통계를 풀었다."**

### Marchenko-Pastur (1967) 의 핵심 발견

**일상 비유**: 1000명 학생의 1000 과목 시험 점수 표를 모았다. 그 표의 *covariance 행렬* (각 과목 간 상관) 의 *eigenvalue 분포* 가 어떤 모양인가?

**전통 직관**: "데이터 무한대 → eigenvalue 분포가 *진짜 모집단의 eigenvalue 분포* 에 수렴".

**MP 발견**: **아니다**. 데이터 = 변수 비율 (c = P/T) 이 어떤 상수면 *systematic 한 변형* 이 생긴다. 그 변형의 *정확한 closed-form* 식이 *Marchenko-Pastur distribution*.

### 의미

> **"수천 변수의 통계 = 정통 통계 + RMT 변형 보정"**

본 논문이 이 *RMT 변형* 을 정확히 분석해서 *Sharpe ratio limit* 도출.

---

## 5a.4 *변수 vs 데이터* 의 비율 (c = P/T)

본 논문의 *가장 중요한 변수* — **c (모델 복잡도)**.

**정의**: $c = P / T$ = 변수 수 / 데이터 수의 *극한 비율*.

### 4가지 영역

| $c$ 영역 | 의미 | 통상 통계 |
|---------|------|----------|
| **c = 0** | 데이터 무한히 많음 | OLS 작동 — 정통 통계 |
| **c < 1** | 데이터 > 변수 | OLS 작동하지만 노이즈 큼 |
| **c = 1** | 데이터 = 변수 | OLS 폭발 — *interpolation boundary* |
| **c > 1** | 변수 > 데이터 | OLS 정의 안 됨 — *high-complexity* |

### 일상 비유

**c = 0.1**: 학생 10,000명 의 1000 과목. 데이터 풍부.

**c = 1**: 학생 1000명 의 1000 과목. *각 학생의 점수가 회귀선에 정확히 fit* — *zero training error*. 그러나 *새 학생* 예측은 *망함*.

**c = 12 (본 논문 실증의 경우)**: 학생 12명 의 144 과목. 통상 통계로는 *불가능* 인 영역. 그러나 *ridge regression* + *Random Matrix Theory* 로 가능.

---

## 5a.5 *Marchenko-Pastur* 분포

본 논문 핵심 그림 중 하나가 *Marchenko-Pastur distribution*. 

```viz:rppca-mp-spectrum:title=Marchenko-Pastur 분포 (RMT 의 출발점),caption=변수 수 P 가 데이터 수 T 보다 같거나 많을 때 sample covariance 의 eigenvalue 가 따르는 분포. c=P/T 슬라이더로 변화. c 클수록 spread (작은 eig 0 쪽 large 쪽). 본 논문의 모든 분석의 토대.
```

### 무지식자 친근 풀이

**상황**: 1000명 학생 의 100 과목 (c=0.1). 통상 통계: *모든 과목 분산이 1 정도*.

**상황 변경**: 100명 학생 의 100 과목 (c=1.0). 표본 covariance 의 eigenvalue 분포는?
- *작은 eigenvalue*: 0 에 가까움 (some 과목 사이 spurious correlation).
- *큰 eigenvalue*: 4 에 가까움 (some 과목 사이 spurious anti-correlation).
- *Spread* 가 *진짜 분포보다 훨씬 큼*.

**상황 변경 2**: 12명 학생 의 144 과목 (c=12). 위 spread 가 *더 극단적*.

**핵심**: *Sample covariance 의 eigenvalue 가 systematic 하게 *진짜 covariance 의 eigenvalue 와 다름*. MP 가 이 정확한 차이를 closed-form 으로.

### MP 의 공식 (옵션 박스, 안 봐도 OK)

c = P/T 영역에서 i.i.d. 잡음 case 의 closed-form:
$$m(-z; c) = \frac{-((1-c) + z) + \sqrt{((1-c) + z)^2 + 4cz}}{2cz}$$

이게 m(-z; c) 라는 *함수* 의 explicit form.

---

## 5a.6 Stieltjes transform — 분포 압축의 마법

본 논문이 가장 자주 사용하는 *수학 도구*: **Stieltjes transform**.

### 일상 비유

**문제**: 1000개 숫자의 *분포* 를 *한 사람에게 설명* 한다. 어떻게?

**옵션 1**: 1000 숫자 다 list. → 너무 길음.

**옵션 2**: 평균, 분산, 표준편차 같은 *몇 가지 통계량* 만. → 정보 손실.

**옵션 3 (Stieltjes)**: *한 함수* 를 정의. 그 함수가 *분포 전체* 를 *완벽히 결정*. 정보 손실 없음. 함수 = *분포 압축*.

**수학적**: $m(z) = \int \frac{1}{x - z} dF(x)$. 분포 F 의 모든 정보가 함수 m 으로 압축.

**다시 복원**: m 이 있으면 *Stieltjes inversion formula* 로 F 를 복원 가능. 정보 손실 0.

### 본 논문에서의 활용

본 논문이 분석하는 *모든 핵심 quantity* (R², Sharpe ratio, 기대 수익, leverage) 가 *결국 m(-z; c) 한 함수* 로 결정.

→ 학자가 *진짜 모집단의 eigenvalue 분포 (관찰 불가능)* 가 *아니라* **표본의 m(-z; c) (관찰 가능)** 만 알면 모든 결과 계산 가능. 이게 **Proposition 2 의 마법**.

---

## 5a.7 Ridge Regression — 안정장치

이제 본 논문이 사용하는 *회귀 방법*. 

### 통상 OLS (가장 단순한 선형 회귀)

**일상 비유**: 학생 점수 데이터로 *선형 회귀* — "수익률 = a × 배당률 + b × 이자율 + ...".

**문제**: 변수 > 데이터 면 *역행렬 안 됨* — OLS 정의 X.

### Ridge regression — *대각선에 z 더하기*

**해결**: 역행렬 안 되는 부분에 *z 라는 작은 상수* 를 더해서 *안정장치* 만듦.

**일상 비유**: 신인 야구 선수의 첫 시즌 타율이 0.400 인데, 그걸 *0.250 (전체 평균) 쪽으로 약간 끌어당기는* 게 더 정확. *끌어당김 강도 = z*.

- *z = 0*: 안 끌어당김 (OLS).
- *z 작음*: 약간 끌어당김.
- *z 큼*: 많이 끌어당김 (계수 0 쪽으로).

### Ridgeless — z → 0+ limit

P > T 면 z = 0 정확히는 안 되지만 *z → 0+* limit 정의 가능. 이걸 **ridgeless regression** 이라 부름.

**놀라운 발견** (통계학 2019+): P >> T 영역에서 ridgeless 가 *implicit regularization* 으로 작동 → *zero training error 임에도 OOS 잘 됨*. 이게 *benign overfit*.

### 본 논문에서의 z 의 의미

- 본 논문 실증: *$z = 10^3 \approx 1000$* 이 가장 좋음.
- 즉 *상당한 ridge shrinkage* 가 좋다.
- 그러나 *z = 0 (ridgeless)* 도 *나쁘지 않음* — c = P/T 가 충분히 크면.

**Section II.A — Least Squares Estimation**: 위 모든 내용 (OLS limit, ridge, ridgeless) 이 본 논문 Section II.A.

**각주 22 (sparse vs ridge)**: 본 논문이 *LASSO* (sparse) 대신 *ridge* 선택의 이유 — (i) Giannone-Lenza-Primiceri (2021): 경제 데이터의 sparsity 는 illusion. (ii) RFF 같은 generated feature 는 sparsity 불명확. (iii) $\ell_1$ analysis 가 이론적으로 더 어려움.

**각주 23 (Moore-Penrose pseudo-inverse 정의)**: $A^+ = \lim_{z \to 0+} (zI + A'A)^{-1} A' = \lim_{z \to 0+} A'(zI + AA')^{-1}$ — ridgeless 의 정확한 정의.

---

## 5a.8 **Proposition 2 (정리 2) — 본 챕터의 *핵심 정리***

**Section II.B** — Random Matrix Theory connection.

**Equation 9 (식 9)**: $m_\Psi(z) = \int 1/(x - z) dH(x) = \lim P^{-1} \text{tr}((\Psi - zI)^{-1})$ — *Stieltjes transform* 의 정의.

**Equation 10 (식 10)**: $\xi(z;c) = (1 - z m(-z;c))/(c^{-1} - 1 + z m(-z;c))$ — Proposition 2 의 핵심 식.

**각주 24 (Marchenko-Pastur 의 정확한 식)**: $\Psi = I$ 의 case 에서 $m(-z;c) = (-((1-c)+z) + \sqrt{((1-c)+z)^2 + 4cz})/(2cz)$ — explicit closed form. 또한 *$P > T$ ($c > 1$) 면 $\hat\Psi$ 가 $P-T$ 개의 zero eigenvalue 가짐 → singular part $(1-1/c)z^{-1}$*.

**각주 25 (Nonlinear shrinkage)**: Ledoit-Wolf (2020) 의 nonlinear shrinkage estimator 사용 가능 — but 진짜 eigenvalue 분포 필요. 본 논문은 ridge 만.

**각주 26 (Heuristic on E[Ψ̂])**: $E[\hat\Psi] = \Psi$ 이므로 *heuristically* $\text{tr} E[(zI+\hat\Psi)^{-1}\Psi] \approx \text{tr} E[(zI+\hat\Psi)^{-1}\hat\Psi]$. 그러나 random matrix corrections 가 *nonlinear* 관계로 만듦.

> **"본 논문 분석의 모든 결과 (R², Sharpe ratio, 기대 수익, leverage) 가 *단일 함수 m(-z; c)* 로 결정. 이 함수가 *표본에서 직접 계산 가능* — 진짜 모집단 정보 필요 없음."**

### 일상 비유

**상황**: 학자가 표본 데이터만 보고 *진짜 자연 법칙* 을 추측해야 한다.

**전통 통계**: "진짜 자연 법칙의 모든 디테일을 다 알아야 한다 — 불가능."

**Proposition 2 의 마법**: **아니다**. *표본에서 직접 계산 가능한 한 함수 m(-z; c)* 만 알면 *진짜 자연 법칙의 결과* 예측 가능.

### 왜 마법인가?

**진짜 자연 법칙의 eigenvalue 분포 (H)** = *관찰 불가능*. 학자가 이걸 알 방법 없음.

**표본의 m(-z; c)** = *데이터에서 직접 계산*. 표본 covariance 행렬의 eigenvalue 의 어떤 변환.

Proposition 2 가 보임: **모든 portfolio 의 limit 이 m(-z; c) 의 함수로 표현**. 즉:
- $\mathcal{E}$ (기대 수익) = m(-z; c) 의 어떤 함수
- $\mathcal{V}$ (분산) = m(-z; c) 의 어떤 함수
- $SR$ (Sharpe ratio) = m(-z; c) 의 어떤 함수

→ **학자는 m(-z; c) 한 함수만 알면 모든 결과 계산.**

### 친근 비유 — *대본 한 권*

영화 한 편을 만드는데 *시나리오 + 캐릭터 설정 + 음악 + 의상 + ...* 모두 필요해 보이지만, 사실 *대본 한 권* 만 있으면 *모든 세부* 가 derive 가능. Proposition 2 가 *대본 (m(-z; c))* = *영화 (Sharpe ratio 등)* 의 관계.

### 의미

Proposition 2 가 **본 논문 모든 후속 결과 (Proposition 3, 4, 5, 6 + Theorem 1) 의 토대**. 즉 이 정리 없이는 다른 정리들 다 도출 불가.

---

## 5a.9 본 챕터의 한 그림

```
   1000개 숫자 (eigenvalue) 의 분포        Stieltjes transform
                ↓                              ↓
   F (확률 분포)                       m(z) = ∫ 1/(x-z) dF(x)
   *너무 복잡*                          *한 함수로 압축*
                ↓                              ↓
                  ←   정보 손실 없음    →
                ↓
   Marchenko-Pastur 정리: m 의 변환 규칙
   sample covariance 의 m(-z; c) ≠ 진짜 covariance 의 m_Ψ(-z)
                ↓
   Proposition 2: ALL portfolio limits depend on
                  only m(-z; c) (관찰 가능!)
                ↓
   본 논문 분석의 *practical* 가능성 증명
```

---

## 5a.10 무지식자 정리 — 한 페이지

### Q1: RMT 가 뭐예요?
**A**: 변수 수 가 데이터 수 와 비슷하거나 더 많은 영역의 *통계학*. 1967년 우크라이나 수학자 Marchenko-Pastur 가 발명. 본 논문이 자산가격에 *처음 적용*.

### Q2: c = P/T 가 왜 중요?
**A**: 본 논문의 *모델 복잡도* measure. *c 작음* = 데이터 풍부 = 통상 통계 작동. *c 큼* = 변수 많고 데이터 적음 = 새 통계 (RMT) 필요. 본 논문 실증: c = 1000 (변수 12,000, 데이터 12).

### Q3: Stieltjes transform 이 뭐예요?
**A**: 분포의 *압축 표현*. 1000개 숫자의 분포를 *한 함수* 로 표현 + *복원 가능*. 본 논문이 *분포 비교* 에 사용 (sample vs population).

### Q4: Marchenko-Pastur 가 뭘 알려주나?
**A**: *Sample covariance* 의 eigenvalue 분포가 *진짜 covariance* 의 eigenvalue 분포와 *systematic 하게 다름*. 그 차이의 *정확한 closed-form*.

### Q5: Ridge regression 이 왜 작동?
**A**: 변수 > 데이터 면 OLS 가 *역행렬 안 됨*. Ridge 가 *대각선에 z 더해서* 안정화. 또한 *bias 약간 도입 + variance 큰 감소* → 결국 better MSE.

### Q6: Proposition 2 가 무슨 마법?
**A**: 모든 portfolio 결과가 *한 함수 m(-z; c)* 로 결정. 이 함수는 *데이터에서 직접 계산 가능* — *unknown 진짜 모집단 정보 필요 없음*. 본 논문 분석을 *practical* 하게 만든 핵심.

---

## 5a.11 자기점검

### 핵심 3가지
1. **왜 본 논문이 *Random Matrix Theory* 라는 새 도구 필요?**
2. **Stieltjes transform 의 *역할*?**
3. **Proposition 2 가 본 논문에 *왜 핵심*?**

### 답변
1. **전통 통계는 *T → ∞, P fixed* 의 영역만 다룸**. 본 논문은 *P, T 둘 다 무한대 + P/T → c > 0* 의 영역 — *새 통계* 필요. 1967년 Marchenko-Pastur 의 RMT 가 그 도구. 본 논문이 *자산가격에 처음 적용*.
2. **분포의 *압축 표현*** — 1000개 숫자의 분포를 *한 함수* 로 표현. 정보 손실 0. 분포 비교 (sample vs population) 에 사용. 본 논문의 *m_Ψ(z)* (진짜 모집단) vs *m(z; c)* (표본) 의 비교가 RMT 의 핵심 결과.
3. **모든 portfolio limit (R², Sharpe, 기대 수익, leverage) 이 *단일 함수 m(-z; c)* 로 결정**. 이 함수는 *데이터에서 직접 계산 가능*. 즉 *unknown 진짜 모집단의 디테일* 알 필요 없음. 본 논문 분석을 *practical* 하게 만든 마법. Proposition 3-6 + Theorem 1 모두 이 정리 위에 build.

---

다음 챕터: [05_method_b_correct.md](05_method_b_correct.md) — *이상적 환경* 의 결과를 *그림* 위주로.
