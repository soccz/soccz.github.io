# 08. Section VI — Conclusion + Occam's Razor 의 역설

> 논문 Section VI (p.499–500). 결론 + Box 인용 + 머신러닝 자산운용의 이론적 정당화.

---

## 8.1 챕터 한 줄 요약

**자산가격결정 학계는 ML 적용 boom 중이지만 그 portfolio 의 OOS 동작은 잘 이해 안 됨. 본 논문이 RMT 기반 이론으로 'virtue of complexity' 를 확립 — ridgeless 가 임의 큰 P 에서도 양의 SR 개선. R² 가 economic value 의 poor measure 임을 증명. CRSP 1926-2020 실증으로 IR ~0.3 vs buy-and-hold, 14/15 recessions 자동 divest, low downside risk. Occam's razor 가 자산가격에선 Occam's blunder — Box (1976) 의 parsimony 권고를 정면 반박.**

---

## 8.2 첫 단락 — 분야의 ML boom

> **원문 (p.499)**: "The field of asset pricing is in the midst of a boom in research applications using machine learning. The asset management industry is experiencing a parallel boom in adopting machine learning to improve portfolio construction. However, the properties of portfolios based on such richly parameterized models are not well understood."

**풀어 설명**:
- 학계 ML boom: Gu-Kelly-Xiu 2020, Chen-Pelger-Zhu 2023, Freyberger-Neuhierl-Weber 2020, Kozak-Nagel-Santosh 2020 등.
- 업계 ML boom: AQR, Two Sigma, Renaissance Technologies, BlackRock 등.
- 그러나 *왜 ML 이 작동하는지* 의 이론은 부족 — 본 논문이 메우는 공백.

---

## 8.3 둘째 단락 — 본 논문 기여 (이론)

> **원문 (p.499)**: "In this paper, we offer new theoretical insights into the expected out-of-sample behavior of machine learning portfolios. Building on recent advances in the theory of high-complexity models from the machine learning literature, we demonstrate a theoretical 'virtue of complexity' for investment strategies derived from machine learning models. Contrary to conventional wisdom, we prove that market timing strategies based on ridgeless least squares generate positive Sharpe ratio improvements for arbitrarily high levels of model complexity. In other words, the performance of machine learning portfolios can be theoretically improved by pushing model parameterization far beyond the number of training observations, even when minimal regularization is applied. We provide a rigorous foundation for this behavior rooted in techniques from random matrix theory. We complement these technical developments with intuitive descriptions of the key statistical mechanisms."

**핵심 메시지**:
- "**Ridgeless least squares generate positive Sharpe ratio improvements for arbitrarily high P.**"
- 직관과 반대 — overparameterization 이 자산가격 예측에서는 *good*.
- RMT 가 rigorous foundation.

**Theoretical contributions** (논문 기여):
1. Proposition 2: 모든 limit 이 single $m(-z; c)$ 로 결정.
2. Proposition 3, 4: Correctly specified case 의 closed form.
3. Propositions 5, 6: Misspecified case 의 closed form.
4. **Theorem 1 (Virtue of Complexity)**: monotone increasing Sharpe ratio in $q$ with optimal $z$.

---

## 8.4 셋째 단락 — R² 와 economic value 의 분리

> **원문 (p.500)**: "In addition to establishing the virtue of complexity, we demonstrate that out-of-sample $R^2$ from a prediction model is generally a poor measure of its economic value. We prove that a market timing model can earn large economic profits when $R^2$ is large and negative. This naturally recommends that the finance profession focus less on evaluating models in terms of forecast accuracy and more on evaluating them in economic terms, for example, based on the Sharpe ratio of the associated strategy. We compare and contrast the implications of model complexity for machine learning portfolio performance in correctly specified versus misspecified models."

**메시지**:
- **R² 가 economic value 의 poor measure**.
- 음의 R² + 양의 SR 가능 (Proposition 4, Table I).
- **Recommendation**: finance 분야가 R² 보다 SR / IR 같은 economic metric 으로 evaluate 해야.

**Campbell-Thompson (2008) heuristic 의 한계**:
- $R^2 \to SR$ mapping 은 $c = 0$ + correctly specified 의 special case.
- Generic ML setting 에서는 invalid.

---

## 8.5 넷째 단락 — 실증 결과 요약

> **원문 (p.500)**: "Finally, we compare theoretically predicted behavior to the empirical behavior of machine learning-based trading strategies. The theoretical virtue of complexity aligns remarkably closely with patterns in real-world data. In a canonical empirical finance application — market return prediction and concomitant market timing strategies — we find out-of-sample IRs on the order of 0.3 relative to a market buy-and-hold strategy, and these improvements are highly statistically significant. The emerging strategies have some remarkable attributes, behaving as long-only strategies that divest the market leading up to recessions. Our high-complexity models learn this behavior without guidance from researcher priors or modeling constraints."

**실증 요약** (Section V 의 한 단락 요약):
- **IR ≈ 0.3** vs market buy-and-hold (1926-2020).
- **Statistically significant** (t > 2.5).
- *Long-only at heart* — Campbell-Thompson constraint 자동 학습.
- *Recession divestment* — 14/15 NBER recessions, purely OOS.

---

## 8.6 다섯째 단락 — Recommendation

> **원문 (p.500)**: "Our results are *not* a license to add arbitrary predictors to a model. Instead, we recommend (i) including all plausibly relevant predictors and (ii) using rich nonlinear models rather than simple linear specifications. Doing so confers prediction and portfolio benefits, even when training data are scarce, particularly when accompanied by prudent shrinkage. Even when the number of raw predictors is small, gains are achieved using those predictors in highly parameterized nonlinear prediction models."

**Practical recommendation** (실무 권고 — 매우 구체적):
1. **All plausibly relevant predictors 포함** — *arbitrary* 가 아닌 *relevant*.
2. **Rich nonlinear models 사용** (e.g., RFF, neural network) — *not simple linear*.
3. **Prudent shrinkage** 필수 — *ridge $z > 0$*.
4. Raw predictor 가 적어도 (15 개라도) **highly parameterized nonlinear**.

→ **현실 적용**: Goyal-Welch 15 predictor + RFF P=12,000 + ridge $z = 10^3$.

각주 함의: **Arbitrary predictor 추가 금지** — 본 논문이 "*overparameterize blindly*" 를 권하는 게 아님. 의미 있는 변수의 nonlinear expansion 이 핵심.

---

## 8.7 여섯째 단락 — Box 의 Parsimony 권고와 충돌

> **원문 (p.500)**: "This recommendation clashes with the philosophy of parsimony frequently espoused by economists and famously articulated by the statistician George Box:
>
> > *Since all models are wrong, the scientist cannot obtain a 'correct' one by excessive elaboration. On the contrary, following William of Occam he should seek an economical description of natural phenomena. Just as the ability to devise simple but evocative models is the signature of the great scientist so overelaboration and overparameterization is often the mark of mediocrity.* (Box (1976))"

**Box quote 의 본질**:
- Box (1976) "Science and Statistics" (JASA paper) 의 유명한 구절.
- "All models are wrong, but some are useful" 의 저자.
- *Parsimony* 의 원칙 — Occam's razor 의 통계학 적용.
- "Overelaboration = mediocrity" — 통계학계의 dominant 입장.

> **원문 (p.500)**: "Our theoretical analysis (along with that of Belkin et al. (2019), Hastie et al. (2022), and Bartlett et al. (2020), among others) shows the flaw in this view—Occam's razor may instead be Occam's blunder. Theoretically, we show that a small model is preferable only if it is correctly specified. But as Box (1976) emphasizes, models are never correctly specified. The logical conclusion is that large models are preferable under fairly general conditions. The machine learning literature demonstrates the preferability of large models in a wide range of real-world prediction tasks. Our results indicate that the same is likely true in finance and economics."

**Occam's blunder**:
- *Correctly specified* 라면 simple 이 좋음.
- *현실: 모델은 절대 correctly specified 아님* (Box 본인이 강조).
- 그러므로 **misspecified 의 logical conclusion** = "**large models are preferable**".
- 통계학 (Belkin, Hastie, Bartlett) + 머신러닝의 발견을 finance 에 적용.

**Memorable phrase**: 
> **Occam's razor may instead be Occam's blunder.**

→ 14세기 William of Occam ("**Pluralitas non est ponenda sine necessitate**") 의 *razor* 가 21세기 misspecified ML 에서는 *blunder* (실수).

---

## 8.8 일곱째 단락 — Future directions

> **원문 (p.501)**: "Our findings point to a number of interesting directions for future work, such as studying the theoretical behavior of high-complexity models in cross-sectional trading strategies and more extensive empirical investigation into the virtue of complexity across different asset markets."

**Future research**:
1. **Cross-sectional ML** — 본 논문은 single-asset (market timing) 만. Cross-section 으로 일반화 (Gu-Kelly-Xiu 2020 의 framework + VoC).
2. **Other asset markets** — equity 외 bond, FX, commodity 등.
3. (각주 14, 15, 16 에서) Non-isotropic $\beta$ — Bartlett-style benign overfit.
4. Time-varying $\beta$ — regime change.

---

## 8.9 한 그림으로 — 본 논문이 자산가격에 남긴 것

```
   1950s-2010s                              2024 VoC
   ─────────                                ────────

   Parsimony (Box, Occam)                  Virtue of Complexity
   "small model is good"                   "use the largest model"
        ↓                                          ↓
   Goyal-Welch 2008                        Kelly-Malamud-Zhou 2024
   OOS R² < 0 → "unpredictable"            OOS SR > 0 even at R² << 0
        ↓                                          ↓
   "return prediction failed"             "rationale for ML in asset pricing"
        ↓                                          ↓
   2010s ML 실증 (Gu-Kelly-Xiu 등)         RMT-based theoretical foundation
   "empirically works"                     "we now know WHY"
        ↓                                          ↓
   2024:                                   "Recommend: all relevant predictors
   "WHY does it work?"                     + nonlinear models + prudent shrinkage"
        ↓                                          ↓
      ?                                    Theorem 1 (Virtue of Complexity)
                                                  ↓
                                          14/15 NBER recessions
                                          auto-divest (purely OOS)
                                          IR ≈ 0.3 vs market
```

---

## 8.10 자기점검 (이 챕터)

### 핵심 3가지
1. **본 논문 5가지 contributions 한 줄씩?**
2. **"Occam's razor may be Occam's blunder" 의 정확한 의미?**
3. **저자의 practical recommendation 3가지?**

### 답변
1. (i) **RMT-based theory** of high-complexity ridge regression for return prediction (Proposition 2). (ii) **Theorem 1 (Virtue of Complexity)** — SR monotone increasing in empirical complexity $q$ with optimal shrinkage. (iii) **R² ≠ Economic value** — negative R² 임에도 timing 의 양의 SR 가능 (Proposition 4). (iv) **Correctly vs misspecified** 분리 — 후자가 main result. (v) **Empirical confirmation** — CRSP 1926-2020 + RFF + 15 Goyal-Welch predictors → IR≈0.3, 14/15 NBER recessions divest.
2. Box (1976) 의 "small model good" parsimony 권고는 *correctly specified* 일 때만 valid. 그러나 Box 본인이 "all models are wrong" — *현실 모델은 절대 correctly specified 아님*. 따라서 misspecified 에서는 simple 이 nonoptimal — **large nonlinear model + prudent shrinkage** 가 선호. Occam's razor (parsimony) 가 misspecified ML 에서는 *blunder (실수)* — large model 의 approximation benefit 이 statistical cost 능가. Box 의 권고를 정면 반박하면서도 Box 본인의 "all models are wrong" 논리를 활용.
3. (i) **All plausibly relevant predictors 포함** — *arbitrary* 가 아닌 *relevant*. (ii) **Rich nonlinear models 사용** (e.g., RFF + ridge regression). (iii) **Prudent shrinkage** ($z > 0$, especially near interpolation boundary). → 실증의 P=12,000 + RFF + Goyal-Welch 15 + $z = 10^3$ 가 이 3 권고의 구현.

---

다음 파일 [09_appendix_proof.md](09_appendix_proof.md) — 핵심 증명 (Proposition 2 의 Stieltjes identity + Theorem 1 의 monotonicity) 풀이.
