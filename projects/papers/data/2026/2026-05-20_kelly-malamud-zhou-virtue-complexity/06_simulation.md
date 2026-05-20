# 06. 이론을 그래프로 — Figures 1-6 시각적 풀이

> 본 논문이 *이론 시뮬* 로 그린 6 개 그래프 를 무지식자 친화로. 각 figure 의 *직관* 위주, 수식 없이.

---

## 6.1 챕터 한 줄 요약

> **"6 개 그래프 가 본 논문 이론을 *눈으로 확인*. *Correctly specified* (Fig 1-3) 에서는 SR 가 c=1 부근 dip. *Misspecified* (Fig 4-6) 에서는 SR 가 *단조 증가* (Theorem 1 의 시각화). 이 두 행동의 차이가 본 논문의 *핵심 메시지*."**

---

## 6.2 공통 설정 — 무엇이 *기준*?

본 논문의 모든 figure 가 같은 *calibration* (가상 데이터):

| 변수 | 값 | 의미 |
|------|-----|------|
| $\Psi$ | $I$ (identity 행렬) | 모든 변수 *균등 분포*, no covariance 구조 |
| $b_*$ | $0.2$ | 진짜 함수의 *signal scale* (작음) |
| $\sigma^2$ | $1$ | 잡음 분산 (normalize) |

이 calibration 의 *기준점* (infeasible 신의 Sharpe):

> **신의 Sharpe ratio ≈ 0.354** (이상적 최대).

모든 그래프의 *빨간 점선* 이 이 값. 학자의 모든 선이 *이 점선 아래*.

---

## 6.3 Figure 1 — *이상적 환경* 의 R²

![Figure 1](figures/page18_Fig1_R2_norm.png)

*paper p.476 Figure 1 — Left: R² vs c. Right: ‖β̂‖.*

### 친근 풀이 — Left panel

**x-axis** = $c = P/T$ = 모델 복잡도. *오른쪽 = 복잡함*.

**y-axis** = OOS R² (예측 정확도). *위쪽 = 정확*.

**색상**: 각 ridge shrinkage 값.
- *검정*: ridgeless (z ≈ 0).
- 노랑·빨강·보라: $z = 0.01, 0.1, 1, 10, 50$.

### 핵심 패턴

1. **빨간 점선 (infeasible)**: R² = 0.167.
2. **검정 (ridgeless)**: c < 1 점차 감소; **c → 1 에서 -∞** (catastrophe!); c > 1 회복.
3. **z > 0**: catastrophe 완화. 가장 부드러운: $z = 1$ (or $z = 10$).
4. **$z = 50$**: R² 거의 0 — over-shrunken.

**메시지**: *변수 ≈ 데이터* 영역이 *통상 통계의 무덤*. Ridge 가 살림.

### Right panel — ‖β̂‖

학자의 *추정 계수 크기* 가 c=1 부근에서 *6+* 까지 spike (= 폭발). Ridge 가 *normal range* 로 끌어내림.

```viz:voc-r2-curve:title=Figure 1 — R² (interactive),caption=c 슬라이더 + z 슬라이더. ridgeless 의 c=1 catastrophe + c>1 회복. 적절한 z 가 catastrophe 완화. infeasible 빨간 점선이 reference.
```

---

## 6.4 Figure 2 — *이상적 환경* 의 기대 수익 + 변동성

![Figure 2](figures/page20_Fig2_E_Vol.png)

*paper p.478 Figure 2.*

### Left panel — Expected return (기대 수익)

**검정 (ridgeless)**: c < 1 에서 *constant 0.2* (infeasible 동일). OLS 의 unbiasedness 덕분. c > 1 에서 감소.

**z > 0**: 모든 c 에서 *기대 수익 감소* (heavier shrinkage 의 bias).

**핵심 메시지**: *Ridgeless 의 c < 1 에서 기대 수익 perfect* — 그러나 *Sharpe ratio* 는 다른 얘기 (Figure 3).

### Right panel — Volatility

**검정 (ridgeless)**: c = 1 에서 *6+ spike*. 좌우 부드럽게 회복.

**z > 0**: *모든 c 에서 안정* (특히 c=1 부근).

**일상 비유**: 학자의 timing 전략의 *변동성* 이 c=1 에서 *폭발*. Ridge 가 *안정장치*.

---

## 6.5 Figure 3 — *이상적 환경* 의 Sharpe ratio ★

![Figure 3](figures/page21_Fig3_sharpe.png)

*paper p.479 Figure 3 — 이 챕터의 *가장 중요한* 그림.*

### 친근 풀이

**y-axis** = Sharpe ratio.
- *빨간 점선* = 0.354 (infeasible 신).
- 모든 선 *이 점선 아래*.

### 핵심 발견 1 — *모든* c 에서 SR > 0

검정 (ridgeless) 부터 z=50 까지 *모든* 선이 *0 위*. 즉 **timing 전략이 *어디서나* 양의 SR 향상**.

→ **통상 직관 ("변수 > 데이터 → 망함") 의 정면 반박**.

### 핵심 발견 2 — c = 1 부근 dip

모든 선 의 SR 가 c = 1 부근 *최소*. 그러나 *양수 유지*.

**일상 비유**: 학자가 *interpolation boundary 근처* 에서 timing 한다 해도 *근거 약함* 정도 — 망하진 않음.

### 핵심 발견 3 — *Ridge 가 ridgeless 보다 우월*

$z = 1$ 같은 *적당한 ridge* 가 *모든 c 에서 ridgeless 위*.

→ **본 논문 권장**: *적당한 ridge 항상 사용*.

### 핵심 발견 4 — 비대칭 회복

c > 1 에서 ridgeless 의 SR 가 *영원히* 양수 유지. **Theorem 1 의 *precursor* (correctly specified case)**.

```viz:voc-sharpe-curve:title=Figure 3 — Sharpe ratio (interactive),caption=c 슬라이더 + z 슬라이더. 모든 c 에서 ridgeless SR > 0 (R² 음수 임에도). c=1 dip 그러나 양수 유지. z=1 가장 robust.
```

---

## 6.6 *Correctly* vs *Misspecified* — 패러다임 전환

이제 *misspecified* 결과 (Figure 4-6) 로 가는데, 그 전에 *왜 misspecified 분석이 필요* 한지.

### Correctly specified — 비현실의 baseline

지금까지 본 Figure 1-3 는 모두 *학자의 model = 진짜 자연* 의 가정. 즉 *이상적*.

**현실**: 학자가 *진짜 자연 전체* 를 capture 못 함. *부족한 모델*.

### Misspecified — 현실

학자가 *진짜 자연의 일부* (예: 15개 macro 변수) 만 사용. 자연이 *훨씬 더 많은 변수* 에 의존한다면 *학자 모델 ≠ 자연*.

### 새 변수 — q (학자/자연 비율)

- $q = 1$: 학자 = 자연 (correctly specified).
- $q < 1$: 학자 < 자연 (misspecified).

본 논문 misspecified Figure 의 calibration: *true c = 10*, *학자의 cq* 가 [0, 10] 범위 sweep.

---

## 6.7 Figure 4 — *현실 환경* 의 R²

![Figure 4](figures/page27_Fig4_R2_misspec.png)

*paper p.485 Figure 4 — Left: R². Right: ‖β̂‖.*

### 친근 풀이

**x-axis** = $cq$ (학자 모델의 복잡도). True c = 10 고정.

**y-axis** = OOS R².

### 패턴 (Figure 1 과 비교)

- *전체적 모양 비슷*: cq → 1 catastrophe + cq > 1 회복.
- *다른 점*: simple model (cq 작음) 의 R² 가 *Figure 1 보다 더 낮음* — **approximation gap**.

**메시지**: 학자가 *진짜 자연의 일부* 만 보면 *예측 정확도 손실*. 이게 *misspecified cost*. 그러나 cq 늘리면 손실 줄어듦.

---

## 6.8 Figure 5 — *현실 환경* 의 기대 수익 + 변동성

![Figure 5](figures/page27_Fig5_E_Vol_misspec.png)

*paper p.485 Figure 5.*

### Left panel — Expected return (가장 큰 차이)

**Figure 2 와 비교**:
- Figure 2 (correctly specified): ridgeless 의 기대 수익 *c < 1 constant* (no decrease).
- **Figure 5 (misspecified)**: ridgeless 의 기대 수익 *cq 의 monotone increasing*! 

**핵심 발견**:
- Simple model (cq 작음): 기대 수익 낮음 (approximation gap).
- cq ↗: 기대 수익 *단조 증가*.
- *cq = 1 에서 peak* ($b_*\psi_{*,1} \cdot c^{-1} = 0.02$).
- *cq > 1 에서 flat* (Equation 19 의 정확한 식).

이게 **본 논문의 가장 강력한 발견**: *Misspecified 에서 기대 수익이 복잡도와 함께 증가*.

### Right panel — Volatility

Figure 2 와 유사: cq = 1 spike + 회복.

---

## 6.9 Figure 6 — Theorem 1 의 시각적 statement ★★

![Figure 6](figures/page28_Fig6_misspec_monotone.png)

*paper p.486 Figure 6 — **본 논문 의 가장 중요한 그림**.*

### 친근 풀이

**y-axis** = Sharpe ratio.

**핵심 발견 1 — *모든* z 에서 monotone 증가**

검정 (ridgeless) 부터 $z = 50$ 까지 **모든 선이 cq 의 monotone increasing 함수**.

→ **Theorem 1 의 시각적 statement**.

### 핵심 발견 2 — Ridgeless 의 *double ascent*

검정 (ridgeless) 에서 *cq = 1 부근 약한 dip*. 그러나 *그 후 다시 증가*. 즉:
- *cq < 1*: 증가.
- *cq = 1*: 약한 감소.
- *cq > 1*: 다시 증가.

→ **Double ascent** 패턴.

### 핵심 발견 3 — *Permanent ascent* (적절한 z)

$z > 0$ 의 선들 (특히 $z = 10$, $50$): *dip 없이 부드럽게 monotone 증가* — **Permanent ascent**.

→ Theorem 1 의 정확한 statement: *적절한 ridge 면 dip 사라짐*.

### 의미

**Use the largest model you can compute** — *수학적 명령*.

```viz:voc-misspec-monotone:title=Figure 6 — Theorem 1 (Virtue of Complexity) (interactive),caption=★ 본 논문의 가장 중요한 시각화. cq 슬라이더 + z 슬라이더. 모든 z 에서 SR monotone increasing — Theorem 1. Ridgeless 의 cq=1 dip (double ascent), z > 0 에서 smooth (permanent ascent).
```

→ **이 viz 가 본 deep dive 의 preview** (LANDING 페이지의 preview).

---

## 6.10 정리 — Correctly vs Misspecified 한 표

| 항목 | Correctly Specified | Misspecified |
|------|--------------------|--------------|
| **R² (vs c or cq)** | catastrophe at c=1 + 회복 | 같은 패턴 + approximation gap |
| **기대 수익 (vs c or cq)** | ridgeless c<1 constant | **monotone increasing** ★ |
| **Sharpe ratio (vs c or cq)** | c=1 dip 후 회복 | **monotone increasing (Theorem 1)** ★ |
| **Optimal $z_*$** | $c/b_*$ — R² 와 SR 동시 최적 | $c(1+b_*(\psi(1-q)))/b_*$ |
| **Implication** | simple model 도 OK | **complex model better** |

---

## 6.11 본 챕터의 *visual 흐름*

```
   Figure 1 (R²)            →   c=1 catastrophe + 회복
        ↓
   Figure 2 (E + Vol)       →   ridgeless E constant c<1
        ↓
   Figure 3 (SR)            →   모든 c 에서 SR > 0, c=1 dip
        ↓
        |
   [Correctly Specified ↑]
   ─────────────────────────────────────────────
   [Misspecified ↓]
        |
        ↓
   Figure 4 (R²)            →   Figure 1 + approximation gap
        ↓
   Figure 5 (E + Vol)       →   ★ E monotone increasing
        ↓
   Figure 6 (SR)            →   ★★ Theorem 1 visualization
                                 monotone increasing (Permanent ascent)
```

---

## 6.12 *실증과의 mapping* — 미리보기

Figure 1-6 가 *이론* 시뮬. 그러나 본 논문 Section V (Chapter 07) 의 *실증* 이 정확히 같은 패턴을 *CRSP 1926-2020 + RFF* 로 보임:

- **Figure 7** (실증, T=12) = Figure 4 의 empirical version.
- **Figure 8** (실증, Sharpe) = Figure 6 의 empirical version — *monotone increasing in c*.

저자 표현: **"Extraordinary agreement between empirical patterns and our theoretical predictions"** (놀라울 정도의 이론↔실증 일치).

다음 챕터 [07_empirical](07_empirical.md) 가 이 *실증* 부분.

---

## 6.13 자기점검

### 핵심 3가지
1. **Figure 1 (correctly) 와 Figure 4 (misspecified) 의 가장 큰 차이?**
2. **Figure 3 의 *놀라운* 발견?**
3. **Figure 6 의 의미 — 본 논문 main statement?**

### 답변
1. **R²**의 전체 모양 (c=1 catastrophe + 회복) 은 양쪽 비슷. **결정적 차이는 *기대 수익***: Figure 2 (correctly) 에서는 ridgeless 기대 수익이 *c < 1 에서 constant* (no decrease), Figure 5 (misspecified) 에서는 *cq 의 monotone increasing* — *복잡할수록 기대 수익 증가*. 이게 *misspecified 환경의 본질적 차이*.
2. **Ridgeless (검정) 의 Sharpe ratio 가 *모든 c 에서 양수***. 즉 통상 직관 "변수 > 데이터 → overfit → 망함" 의 정면 반박. R² 가 *마이너스 100% 이하* 인 영역 (Figure 1) 에서도 Sharpe > 0 — *R² 와 Sharpe 의 분리*. 또한 *Ridge z > 0 가 모든 c 에서 ridgeless 보다 우월*.
3. **모든 z 에서 Sharpe ratio 가 cq 의 monotone increasing** — Theorem 1 의 시각적 statement. Ridgeless 에서 *cq = 1 근처 약한 dip (double ascent)*, $z > 0$ 에서 *smooth monotone (permanent ascent)*. 의미: *Use the largest model you can compute* + *적절한 ridge 사용*. 이게 본 논문 의 *Use the largest model* 권장의 *수학적 근거*.

---

다음 챕터: [07_empirical.md](07_empirical.md) — 실제 미국 시장 1926-2020 결과 — *가장 흥미로운* 챕터.
