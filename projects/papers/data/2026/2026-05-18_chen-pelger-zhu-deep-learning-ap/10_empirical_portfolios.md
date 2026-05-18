# 10. Characteristic Sorted Portfolios — Section III.E

> Section III.E (paper p.29–32) — 46 anomaly decile portfolios + double-sorted pricing.

## 10.1 챕터 한 줄 요약

paper Table III: 46개 anomaly 의 decile sorted portfolios 모두에서 GAN 이 **XS-R² > 90%** 달성. EN, FFN 은 일부 anomaly 에서만. Figures 9, 10 의 predicted vs actual scatter 가 시각적으로 GAN 압도 확인.

---

## 10.1 평가 setup

paper p.29 본문:
> "Our approach achieves an unprecedented pricing performance on standard test portfolios. Asset pricing testing is usually conducted on characteristic sorted portfolios that isolate the pricing effect of a small number of characteristics. We sort the stocks into value weighted decile and double-sorted 25 portfolios based on the characteristics."

**Test assets**:
- **Single-sorted decile portfolios** (10 per characteristic): 46 chars × 10 deciles = **460 portfolios**.
- **Double-sorted 25 portfolios**: 4 sets (예: ST_REV × momentum, size × BEME 등).

---

## 10.2 Table III — 46 Decile Portfolios

paper Table III (정확한 일부 수치, OOS test, value-weighted):

| Characteristic | EN EV | FFN EV | **GAN EV** | EN XS-R² | FFN XS-R² | **GAN XS-R²** |
|----------------|-------|--------|------------|----------|-----------|---------------|
| **ST_REV** (short-term reversal) | 0.43 | 0.58 | **0.70** | 0.45 | 0.79 | **0.94** |
| **SUV** (standard unexplained volume) | 0.42 | 0.75 | **0.83** | 0.64 | 0.97 | **0.99** |
| **r12_2** (momentum) | 0.26 | 0.27 | **0.54** | 0.66 | 0.71 | **0.93** |
| **NOA** | 0.58 | 0.69 | **0.78** | 0.94 | 0.96 | 0.95 |
| **LME** (size) | 0.83 | 0.78 | **0.86** | 0.96 | 0.95 | 0.97 |
| **BEME** (book-to-market) | 0.70 | 0.75 | **0.82** | 0.97 | 0.94 | 0.98 |
| **IdioVol** | 0.43 | 0.27 | **0.66** | 0.79 | 0.72 | **0.97** |
| **Investment** | 0.54 | 0.65 | **0.75** | 0.91 | 0.94 | **0.98** |
| ... (46개 모두 표 III 참조) | | | | | | |

paper 본문:
> "It is striking that **GAN is always better than the other two models in explaining variation**. At the same time **GAN achieves a cross-sectional R² higher than 90% for all characteristics**. In the few cases where the other models have a slightly higher cross-sectional R², this number is very close to 1, i.e. all models can essentially perfectly explain the pricing information in the deciles. In summary GAN strongly dominates the other methods in explaining sorted portfolios."

**관찰**:
- **EV** (시계열): GAN 이 46개 모두에서 best.
- **XS-R²** (횡단면 mean): GAN 이 거의 모두 > 90%.
- **ST_REV, r12_2 (momentum), IdioVol** 에서 GAN 우위 가장 큼 — 비선형 + interaction 효과.
- **size, BEME** 는 모든 모델 잘함 — well-known easy anomalies.

paper 핵심 결론:
> "The results show (1) that the **non-linearities and interactions matter** as GAN is better than EN and (2) **the no-arbitrage condition extracts additional information** as GAN is better than FFN."

→ GAN 의 우위 = (선형 → 비선형) + (no-no-arb → no-arb) 의 **곱**.

---

## 10.3 Figure 9–10 — Predicted vs Actual

### 10.3.1 Value-weighted (Fig 9)

paper p.31 본문:
> "Figure 9 visualizes the ability of GAN to explain the cross-section of expected returns for all value weighted characteristic sorted deciles. We plot the average excess return and the model implied average excess return. **The GAN SDF captures the correct monotonic behavior, but its prediction is biased towards the mean.** In contrast, the prediction of the other three models show a larger discrepancy which holds for characteristics of all groups."

**해석**:
- GAN: 단조 + linear-ish, mean 으로 약간 bias (regularization 효과).
- FFN, EN, LS: scatter spread 큼.

### 10.3.2 Equally-weighted (Fig 10)

paper p.31:
> "Figure 10 shows the prediction results for equally weighted decile portfolios. All models seem to perform slightly better, but the general findings are the same."

→ EW 가 VW 보다 fitting 쉬움 (작은 stock 노이즈가 평균으로 약화).

---

## 10.4 Double-Sorted Portfolios (Table A.IV)

paper p.29–30:
> "Table A.IV repeats the same analysis on short-term reversal and momentum double-sorted and size and book-to-market double-sorted portfolios. The takeaways are similar to the decile sorted portfolios. **GAN outperforms FFN and EN on the momentum related portfolios, while all three models are able to explain the size and value double-sorted portfolios. Importantly, the linear EN becomes worse on the double-sorted reversal and momentum portfolios. This is due to the extreme corner portfolios, which are in particular low momentum and high short-term reversal stocks. This implies that the linear model cannot capture the interaction between characteristics, while the GAN model successfully identifies the potentially non-linear interaction effects.**"

→ **Double-sorted = interaction effect 검증**. Linear EN 은 single-sorted 에서는 OK 지만 double-sorted 에서 collapse. GAN 만 잘함.

---

## 10.5 Section III.G — SDF Structure (Section III.F 의 일부)

paper p.36 (Section G):
> "We study the structure of the SDF weights and betas as a function of the characteristics. Our main findings are two-fold: Surprisingly, **individual characteristics have an almost linear effect on the pricing kernel and the risk loadings**, i.e. non-linearities matter less than expected for individual characteristics. Second, **the better performance of GAN is explained by non-linear interaction effects**, i.e. the general functional form of our model is necessary for capturing the dependency between multiple characteristics."

**두 가지 핵심 발견**:
1. **개별 특성 → SDF**: 거의 선형. 그래서 linear EN 도 single-sorted 잘함.
2. **특성 간 interaction → SDF**: 본질적으로 비선형. GAN 만 잡음.

paper Figure 14 (Section G 의 시각화): SDF weight $\omega$ as function of two characteristics (예: ST_REV × r12_2, LME × BEME). **multiplicative interaction** 패턴 명확.

---

## 10.6 정리

```
[ Table III — 46 Anomaly Deciles (OOS Test) ]
                                                       
  EN  EV: 0.26 – 0.83   XS-R²: 0.45 – 0.98             
  FFN EV: 0.27 – 0.79   XS-R²: 0.71 – 0.98             
  GAN EV: 0.54 – 0.86   XS-R²: 0.90 – 0.99             
                                                       
  → GAN 의 EV / XS-R² 가 항상 best                     
  → GAN 의 XS-R² 모두 > 90%                            
                                                       
[ 비선형 / no-arb 의 분해 ]                            
  Linear no-arb (EN) > Nonlinear no-no-arb (FFN)       
  Nonlinear no-arb (GAN) > both                        
  → GAN 우위 = (1) nonlinearity + (2) no-arbitrage     
                                                       
[ Double-sorted (Table A.IV) ]                         
  Single-sorted: EN, FFN 모두 OK                       
  Double-sorted: EN collapse — interaction 못 잡음     
  → 비선형 interaction 이 본질                          
                                                       
[ SDF Structure (Sec III.G) ]                          
  Individual char → SDF: 거의 linear                   
  Interaction (char × char) → SDF: 강한 nonlinear      
```

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. GAN 이 ST_REV, IdioVol 에서 특히 우위인 이유?
2. Single-sorted vs double-sorted 에서 EN 의 행동 차이?
3. "Individual char 선형 + interaction 비선형" 의 의미?

### 답변
1. **ST_REV (1-month reversal)**: 짧은 시계열 reversal 은 **size 와 interaction** 강함 (small stocks 의 reversal 효과가 더 큼). EN 은 size×ST_REV 곱항 못 잡음. **IdioVol**: lottery-like preference 의 비선형 — 매우 낮은 IdioVol 영역에서만 효과 큼. GAN 의 비선형 FFN 이 이를 잡음. EN/FFN 모두 못 잡음.
2. **Single-sorted**: 한 특성 quantile 만. EN 의 선형 weights 로도 monotonic 효과 잘 잡음. **Double-sorted**: 두 특성 quantile cross. extreme corner (예: small + low momentum) 이 가장 mispriced. EN 은 두 특성의 선형 합만 잡고 곱은 못 잡음 → corner portfolio underfit.
3. paper Section III.G 의 발견. **개별 char × SDF**: SDF weight $\omega$ 와 한 char 의 관계가 거의 선형 (Fig 14 의 각 char 별 plot). → linear model 도 single-sorted 잘함. **char × char × SDF**: 두 char 의 contour 가 saddle/dome shape — 강한 nonlinearity. → linear 못 잡고 GAN 만 잡음. **이게 GAN 의 진짜 차별점**.
