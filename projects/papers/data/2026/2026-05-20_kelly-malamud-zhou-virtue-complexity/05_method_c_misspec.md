# 05c. *현실적 환경* + Theorem 1 — 본 논문의 핵심

## 📌 이 챕터 다 읽으면 알 수 있는 것

- 현실적 환경 (misspecified) 의 분석
- **★ Theorem 1** — Virtue of Complexity 의 핵심 정리
- Propositions 5, 6 의 의미
- SR(z; cq; q) 의 monotone + concave 증명

---

> 본 챕터는 본 논문의 *main result* 인 **Theorem 1 (Virtue of Complexity)** 을 친근하게. *Figure 6* 가 시각적 statement.

### 🌱 Theorem 1 — 일상 비유

**한 줄로**: "학자가 변수 더 많이 사용할수록 Sharpe ratio 단조 증가 — 단, 적절한 ridge 와 함께".

| 변수 수 | 학생 비유 | SR |
|--------|----------|-----|
| 변수 5개 (q ≈ 0) | 학생이 5과목 공부 | 낮음 (basic 시험만 가능) |
| 변수 50개 | 학생이 50과목 공부 | 중간 |
| 변수 500개 | 학생이 500과목 공부 | 높음 |
| 변수 5,000개 | 학생이 5,000과목 공부 | 더 높음 (concave 증가) |

**핵심**: 더 많이 알수록 → 더 잘 예측 (단조 증가). 단 추가 효과는 점차 약화 (concave).

**왜 놀라운가**: 통상 통계 직관은 "변수 ≫ 데이터 → overfit → 망함". 그러나 본 논문: **변수 ≫ 데이터 인 환경에서도 ridge 와 함께면 SR 단조 증가**. 이게 자산가격결정의 패러다임 전환.

### 🔣 Theorem 1 의 핵심 기호 4-단 풀이

| 기호 | 의미 | 직관 |
|------|------|------|
| $q$ | 학자/자연 변수 비율 | "학자가 진짜의 몇% 보는가" |
| $c$ | 진짜 자연의 complexity (P_true / T) | 데이터 환경의 고유한 어려움 |
| $cq$ | 학자가 본 empirical complexity | "학자 입장에서의 모델 복잡도" |
| $z$ | Ridge regularization 강도 | "안정장치" |
| $z_*$ | 최적 $z$ | "최선의 안정장치 강도" |
| $\text{SR}(z; cq; q)$ | Sharpe ratio 함수 | "최종 timing 전략 성과" |

**Theorem 1 의 statement**:
> $\text{SR}(z_*; cq; q)$ 는 $cq$ 의 **monotone increasing + concave** 함수.

→ 즉: (i) 학자가 변수 늘릴수록 SR 증가, (ii) 단 추가 효과는 감소.

### 🔑 핵심 통찰

> "Use the largest model you can compute" — 본 논문 결론의 수학적 명령. 실무 의미: 자산운용 시 **계산 가능한 최대 복잡도 모델 + 적절한 ridge** 가 최적.

---

## 5c.1 챕터 한 줄 요약

> **"학자의 model = 진짜 자연의 *일부만* capture 하는 *현실적 환경* 에서, *적절한 ridge shrinkage* 와 함께 *Sharpe ratio* 가 모델 복잡도의 *단조 증가*. 이게 본 논문 핵심 — 'Use the largest model you can compute' 의 수학적 근거."**

---

## 5c.2 *Misspecified* 가 뭐예요? — **Section IV 의 모든 내용**

### 정의

> **"학자의 empirical model 이 진짜 자연 법칙의 *일부만* capture. 즉 *부족한 모델*."**

### 일상 비유

**진짜 자연**: 학생 키 = (유전 점수) + (영양 점수) + (운동 점수) + (수면 점수) + (스트레스 점수) + ... + 잡음.

**학자의 model**: *유전 점수* + *영양 점수* 만 사용. 나머지 *운동, 수면, 스트레스 등* 못 봄.

→ **모델 = 자연의 일부** (misspecified).

### 왜 *현실적* 인가?

학자는 *진짜 자연 법칙을 모름*. 그저 *손에 있는 변수* (예: 15개 macro 변수) 로 *근사*. **현실의 모든 모델 은 misspecified**.

George Box (1976) 의 명언: **"모든 모델은 틀렸지만 일부는 유용하다."**

본 논문이 이 *misspecified 환경에서* 가장 의미 있는 결과 도출.

---

## 5c.3 새 변수 — q (empirical / true 비율)

본 논문이 misspecified case 분석을 위해 새 변수 도입:

> **"$q$ = 학자가 보는 변수 수 / 진짜 자연 의 변수 수."**

### 일상 비유

- *q = 1*: 학자가 *모든* 진짜 변수 봄 (correctly specified — 이상).
- *q = 0.5*: 학자가 *절반* 만 봄.
- *q ≈ 0*: 학자가 *거의 아무것도* 못 봄 (severely misspecified).

### 본 논문 실증의 q

본 논문 실증: *학자가 Goyal-Welch 15 + RFF 12,000 변수 사용*. 진짜 자연이 *훨씬 많은 변수에 의존* 한다면 *q 작음*.

본 논문 calibration: *true c = 10, empirical q* 가 *0 ~ 1 범위* 로 변화 시뮬.

---

## 5c.4 새 *복잡도* 변수 — cq

> **"$cq$ = $P_1 / T$ = *empirical* 복잡도. 본 논문 main statement 가 이 변수의 함수."**

**일상 비유**: q 가 *어느 정도 진짜를 capture*, c 가 *전체 변수 / 데이터 비율*. cq 는 *학자 모델의 변수 / 데이터 비율* = 학자가 실제로 본 모델의 complexity.

- *cq < 1*: 학자 변수 < 데이터 (통상 영역).
- *cq = 1*: 학자 변수 = 데이터 (interpolation boundary).
- *cq > 1*: 학자 변수 > 데이터 (high-complexity).

---

## 5c.5 *두 가지 효과* 의 새 trade-off

**Assumption 5 (가정 5)** — sufficiently mixed signals: $H(x; q)$ 가 $q$-independent.

**Equation 17 (식 17)**: $\xi_{2,1}(z; cq; q)$ + $\widehat\xi_{2,1}(z; cq; q)$ — observed-unobserved cross-correlation traces.

**Equation 18 (식 18)**: $R^2(z; cq; q) = (2\mathcal{E} - \mathcal{L})/(1 + b_* \psi_{*,1}(1))$ — misspecified R² closed form.

**Equation 19 (식 19)**: $\Psi = I$ 의 ridgeless limit 에서 $\mathcal{E}(0; cq; q) = b_*\psi_{*,1} \min\{q, c^{-1}\}$ — Figure 5 의 *flat* 패턴의 정확한 식.

**Proposition 5 (정리 5)**: misspecified case 의 모든 limit.

**Proposition 6 (정리 6)**: $\text{tr}(\Psi_{1,2}\Psi_{2,1}) = o(P)$ 의 경우 simplification.

**각주 32 (finite-dim factor structure)**: $\Psi_P = D_P + Q_P$ where $\text{rank}(Q_P) < \infty$ — factor model 형태. 그 경우 cross-correlation 무시 가능 + Proposition 6 simplification 적용.

본 챕터의 핵심 *trade-off*. 이걸 이해하면 본 논문 다 이해.

### 🔣 misspecified 핵심 기호 4-단 풀이

| 기호 | 의미 | 직관 |
|------|------|------|
| $P_1$ | 학자가 본 변수 수 | empirical model 의 변수 |
| $P_2$ | 학자가 못 본 변수 수 | unobserved variables |
| $P = P_1 + P_2$ | 진짜 자연 변수 수 | true DGP complexity |
| $q = P_1 / P$ | 학자/자연 비율 | "학자가 본 비율" |
| $c = P/T$ | true complexity | 데이터 환경의 고유 어려움 |
| $cq = P_1/T$ | empirical complexity | 학자 모델의 복잡도 |
| $\xi_{2,1}$ | observed-unobserved cross-correlation | 학자가 본 vs 못 본 의 상관 |
| **Sufficiently mixed signals** | 모든 변수가 균등 정보 | RFF 가 자연 만족 |

→ **Eq 18-19 의 핵심**: $\mathcal{E}(0; cq; q) = b_* \psi_{*,1} \min\{q, c^{-1}\}$ — Figure 5 의 monotone 증가 패턴의 explicit form.

### 효과 1 — Approximation gain (근사 이득)

> **"q ↗ (학자가 더 많은 진짜 변수 capture) → *진짜 자연 에 더 가까운 모델* → 더 나은 예측."**

**일상 비유**: 의사가 환자의 증상 5개 → 50개 → 500개 보면 *더 정확한 진단*.

### 효과 2 — Statistical cost (통계 비용)

> **"cq ↗ (학자 모델의 복잡도) → *추정 variance 증가* → 더 안 좋은 추정."**

**일상 비유**: 의사가 *변수 많을수록* 각 변수의 효과를 *정확히 추정* 하기 어려움 (데이터 부족).

### 균형점

q ↗ 하면 *둘 다* 변화:
- (+) Approximation gain
- (-) Statistical cost

**핵심 질문**: *근사 이득 > 통계 비용* 인가?

**Theorem 1 의 답**: **YES** — *적절한 ridge* 와 함께.

---

## 5c.6 **Theorem 1 (정리 1) — *복잡함의 미덕***

**본 논문 main result**. **Section IV** 의 결정적 정리.

본 논문의 **가장 중요한 정리**:

> **"*Sufficiently mixed signals* + *적절한 ridge* 의 조건 하에서, Sharpe ratio 가 *q 의 단조 증가 + concave* 함수."**

### 무지식자 친근 풀이

**Theorem 1 의 두 문구 풀이**:

#### "Sufficiently mixed signals"
**일상 비유**: 학자의 *각 변수* 가 *비슷한 정도의 정보* 를 줌. 어떤 변수가 *특별히* 결정적이 아니라 *모두 균등 분포*. RFF 가 이를 자연 만족.

#### "적절한 ridge ($z_*$)"
**일상 비유**: *너무 작지도, 너무 크지도 않은* shrinkage. 본 논문 식: $z_* = c(1 + b_*(\psi_{*,1}(1-q)))/b_*$ — *복잡할수록 더 큰* ridge.

### Theorem 1 의 의미 (한 줄)

> **"학자가 *empirical model 의 복잡도 q 를 0 에서 1 까지 늘릴 때*, Sharpe ratio 가 *단조 증가* (계속 좋아짐) + *concave* (증가 속도 점차 둔화)."**

### *Use the largest model you can compute* — 의 정확한 의미

**Theorem 1 implication**:
- 학자는 *q 를 최대화* 하라.
- 즉 *모든 가능한 변수* 를 사용하라.
- *적절한 ridge* 만 추가하면 *과적합 위험 없음*.

본 논문 conclusion 의 명언: **"Use the largest model you can compute."**

---

## 5c.7 *Figure 6* — Theorem 1 의 시각적 statement ★

![Figure 6 — Theorem 1 의 시각화](figures/page28_Fig6_misspec_monotone.png)

*paper p.486 Figure 6 — Misspecified case 의 Sharpe ratio vs cq.*

### 무지식자 친근 풀이

**x-axis**: $cq$ (학자 모델 의 복잡도).

**y-axis**: Sharpe ratio.

**여러 선**: 각 *ridge shrinkage* (z).
- 검정 (ridgeless): 약간의 dip at $cq = 1$.
- $z = 10^{-2}, 10^{-1}, ...$: 점점 부드러워짐.
- $z = 50$: 가장 부드럽게 monotone 증가.

### 핵심 발견 1 — *모든* z 에서 단조 증가

검정 (ridgeless) 부터 $z = 50$ 까지 *모두* — *cq 가 증가하면 SR 도 증가*. *단조*.

→ **본 논문 main statement 의 시각적 증명**.

### 핵심 발견 2 — *Double ascent* (ridgeless 의 dip)

Ridgeless 에서 *$cq = 1$ 부근 약한 dip*. 그러나 *그 후 다시 증가* — 즉 *증가 → dip → 증가* 의 *double ascent* 패턴.

**일상 비유**: 학생 성적이 *공부 1시간 → 좋아짐 → interpolation boundary → 약간 떨어짐 → 다시 좋아짐*.

### 핵심 발견 3 — *Permanent ascent* ($z > 0$)

$z > 0$ 의 선들은 *dip 없이 부드럽게 monotone 증가* — *permanent ascent*.

→ **Theorem 1 의 정확한 statement**: *적절한 ridge 면 dip 사라짐*.

---

### 📖 Figure 6 (Theorem 1 시각화) 정밀 읽는 법

**무엇이 표시되나**:
- **단일 panel**: x축 = cq (학자 empirical complexity), y축 = Sharpe ratio
- **6 색 곡선**: ridgeless (검정), z=0.001~50 (5색)
- **Calibration**: True DGP c=10 고정, cq sweep 0-10

**5 단계 분석**:
1. **cq=0 근처**: 모든 선 0 근처 (학자가 변수 거의 못 봄, timing X)
2. **cq = 0.1-0.9**: 모든 선 점차 상승 (approximation gain 발현)
3. **★ cq = 1 근처**: 검정 (ridgeless) 약한 dip, 다른 선은 부드럽게 증가
4. **cq = 1.5-5**: 모든 선 계속 상승, 기울기 점차 둔화 (concave)
5. **cq = 10 (correctly specified)**: 모든 선 최고점, SR ≈ 0.05

**4 핵심 발견**:
- ★ **모든 z 에서 monotone 증가** = Theorem 1 의 시각적 statement
- **Ridgeless 의 double ascent** (cq=1 dip but 결국 증가)
- **z > 0 의 permanent ascent** (dip 없이 부드럽게)
- **Concavity** (diminishing returns to complexity)

**숨은 함정**:
- "모든 z 에서 증가" 라고 모든 dataset 에 적용은 X — calibration 가정 필요
- y축 scale (0-0.06) 작음 → 작은 변화도 의미

### 🎯 구체 증거 — Theorem 1 의 strength

| 발견 | 의미 |
|------|------|
| Monotone 증가 | 학자가 변수 ↑ 할수록 SR ↑ — "Use the largest model" |
| Concave (둔화) | 추가 변수의 marginal gain ↓ — 무한대로 좋지 않음 |
| ridgeless 의 dip | $cq = 1$ 의 catastrophe 는 statistical metric (R²) 에선 큰 영향, SR 에선 약함 |
| z > 0 의 robust | 적절한 ridge 면 catastrophe 회피 |

---

## 5c.8 *Double descent* vs *Double ascent* vs *Permanent ascent*

이 세 용어를 정리:

### Double descent (통계학 2019)

**Belkin et al (2019)** 의 발견. MSE (예측 오차) 가 *cq 의 함수* 로:
- *cq < 1*: 점차 증가 (전통).
- *cq = 1*: spike (catastrophe).
- *cq > 1*: **다시 감소** (benign overfit).

즉 *증가 → spike → 감소* — *MSE 의 두 번 하강 (double descent)*.

### Double ascent (본 논문, ridgeless case)

**Sharpe ratio** 의 *cq 함수*:
- *cq < 1*: 점차 증가.
- *cq = 1*: dip (약한 감소).
- *cq > 1*: 다시 증가.

즉 *증가 → dip → 증가* — *Sharpe 의 두 번 상승 (double ascent)*. MSE 의 거울 이미지.

### Permanent ascent (본 논문, optimal ridge)

**Optimal $z_*$** 에서:
- 모든 cq 에서 *단조 증가*. *Dip 없음*.

→ Theorem 1 의 정확한 statement.

### 학자에게 의미

> **"통계학자가 발견한 double descent (Belkin 2019) → finance 학자가 Sharpe ratio 의 double ascent → 적절한 ridge 면 permanent ascent."**

본 논문이 이 *세 단계* 의 흐름을 자산가격결정 에 적용.

---

## 5c.9 Theorem 1 의 *조건* 정리

본 정리 가 성립하려면 *두 조건*:

### 조건 1 — Sufficiently mixed signals

학자의 변수 들이 *균등 정보 분포*. RFF 가 자연 만족.

### 조건 2 — Bounded cross-correlation

$\text{tr}(\Psi_{1,2}\Psi_{2,1}) = o(P)$ — observed 변수 와 unobserved 변수 의 *상관* 이 *너무 강하지 않음*.

**일상 비유**: 학자가 보는 *영양 점수* 가 학자가 못 보는 *운동 점수* 와 *매우 강하게* 연결되어 있다면, *영양만 봐도 운동 효과 어느 정도 들어옴*. 본 조건은 *그렇게까지 강하진 않음* 의 조건.

본 논문 실증: RFF + finite-dim factor structure 가 이 조건 만족.

---

## 5c.10 본 논문의 *full result chain* (이론)

본 챕터의 모든 정리를 한 그림으로:

```
   가정 1-5 + Lemma 1 (Ch 04)
              ↓
   Proposition 2 (Ch 05a)
   모든 limit = m(-z; c) 의 함수
              ↓
   ┌─ Section III ─ Correctly Specified ─┐
   │ Proposition 3 (R², E, L)             │   ← Ch 05b
   │ Proposition 4 (V, SR, z_*)           │
   │ Figure 1, 2, 3                       │
   └──────────────────────────────────────┘
              ↓
   ┌─ Section IV ─ Misspecified ─────────┐
   │ Assumption 5 (mixed signals)         │   ← Ch 05c (지금)
   │ Proposition 5 (all limits)           │
   │ Proposition 6 (simplified)           │
   │ ★ THEOREM 1 (Virtue of Complexity) ★ │
   │ Figures 4, 5, 6                      │
   └──────────────────────────────────────┘
              ↓
   *Use the largest model you can compute*
              ↓
   ┌─ Section V ─ Empirical 검증 ─────────┐
   │ 1926-2020 CRSP + Goyal-Welch + RFF   │   ← Ch 07
   │ SR 0.47, 14/15 recessions divest     │
   └──────────────────────────────────────┘
```

---

## 5c.11 본 정리의 *경제적 의미*

### 1. *Goyal-Welch (2008) 비관* 의 정리

> **"GW 2008 의 결론은 *correctly specified + ridgeless* 영역에서만 valid. Misspecified + ridge 에서는 *정반대* (Theorem 1)."**

본 논문이 *학계 통념 14년* 을 무너뜨림.

### 2. *머신러닝 자산운용* 의 이론적 근거

> **"학자가 *최대한 많은 변수* + *적절한 ridge* 사용해야 한다는 *수학적 명령*."**

자산운용 업계 (AQR, Two Sigma 등) 의 *ML 활용* 의 학문적 정당화.

### 3. *Box (1976) 의 parsimony 반박*

> **"Box 의 *간단한 모델이 좋다* 는 *correctly specified 일 때만 valid*. 모델은 *항상* misspecified 이므로 *복잡할수록 좋다*."**

본 논문 conclusion 의 *"Occam's razor may be Occam's blunder"*.

---

## 5c.12 자기점검

### 핵심 5가지

1. ***Correctly specified* vs *Misspecified* 의 본질적 차이?**
2. **Theorem 1 의 정확한 statement?**
3. **Double descent vs Double ascent vs Permanent ascent 의 구분?**
4. **Approximation gain vs Statistical cost trade-off + 균형점?**
5. **Theorem 1 의 두 조건 (sufficiently mixed + bounded cross-correlation) 의 의미?**

### 답변

1. **Correctly specified**: 학자의 model = 진짜 자연 (q = 1). 이론적 baseline, 비현실. *Simple > complex*. **Misspecified**: 학자의 model ⊂ 진짜 자연 (q < 1). 현실적 — 모든 실제 model 이 이 경우. *두 효과 trade-off*: (+) approximation gain (변수 ↑ = 진짜에 가까움) + (-) statistical cost (변수 ↑ = 추정 잡음 ↑). **본 논문 main result 인 Theorem 1 이 후자에서만 성립**. Box (1976) "All models are wrong, but some are useful" → 본 논문이 이 격언의 정확한 수학적 의미 부여.

2. **Sufficiently mixed signals + bounded cross-correlation 조건 하에서, optimal shrinkage $z_*$ 와 함께 Sharpe ratio $SR(z_*; cq; q)$ 가 q ∈ [0, 1] 에서 *strictly monotone increasing + concave***. 즉 *학자가 empirical model 의 복잡도를 증가시킬수록 SR 단조 증가* (단, 추가 효과 감소). **Implication: Use the largest model you can compute** — 실무 명령. 단 "+ proper ridge" 가 핵심 — 무차별 복잡도 ↑ 는 catastrophe 위험. 자산운용 업계 (AQR, Two Sigma) 의 ML 활용의 학문적 정당화.

3. **Double descent (Belkin 2019, 통계학)**: MSE 의 *cq 함수* — 증가 → cq=1 spike → 감소 (benign overfit). **Double ascent (본 논문 ridgeless)**: Sharpe ratio 의 *cq 함수* — 증가 → cq=1 dip → 증가. MSE 의 거울 이미지. **Permanent ascent (본 논문 optimal ridge)**: 모든 cq 에서 단조 증가, dip 없음. Theorem 1 의 정확한 statement — *적절한 ridge 가 dip 사라지게*. 의미: 통계학자가 발견한 double descent 가 finance 에선 double ascent → optimal ridge 면 permanent ascent. 세 단계 학문적 진화.

4. **Approximation gain**: $q$ ↑ (학자가 더 많은 진짜 변수 capture) → 진짜 자연에 더 가까운 모델 → 더 나은 예측 → SR ↑. 의사가 환자 증상 5 → 50 → 500 개 보면 진단 정확도 ↑. **Statistical cost**: $cq$ ↑ (학자 모델 복잡도) → 추정 variance ↑ → 더 안 좋은 추정 → SR ↓. 의사가 변수 많을수록 각 변수의 효과 정확히 추정 어려움. **균형점**: Theorem 1 의 발견 — *적절한 ridge* 와 함께면 **approximation gain > statistical cost**. 결과: 균형점이 항상 "더 많은 변수 쪽" → monotone 증가.

5. **Sufficiently mixed signals (Assumption 5)**: 학자의 모든 변수가 *비슷한 정도의 정보* 제공. 어떤 변수가 특별히 결정적이 아니라 모두 균등 분포. RFF (Random Fourier Features) 가 자연 만족 — Gaussian random projection 이라 statistically 비슷. **Bounded cross-correlation** ($\text{tr}(\Psi_{1,2}\Psi_{2,1}) = o(P)$): 학자가 본 변수와 못 본 변수의 상관이 *너무 강하지 않음*. 만약 강하면 학자가 일부만 봐도 모두 본 것 같은 효과 (information leakage). 본 조건은 *그렇지 않음* 가정. RFF + finite-dim factor structure 가 자연 만족. **의의**: 두 조건이 *RFF 사용 시 자연 만족* → 본 논문 실증의 RFF 선택이 *조건 만족 + analytical tractability* 의 묘수.

---

다음 챕터: [06_simulation.md](06_simulation.md) — Figures 1-6 의 *이론 시뮬* 을 시각적으로.
