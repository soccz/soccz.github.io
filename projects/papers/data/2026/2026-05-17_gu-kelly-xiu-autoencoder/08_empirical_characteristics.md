# 08. 실증 (Part C) — 어떤 특성이 중요한가? Robustness.

> Section 3.6–3.7 (journal p.441–444) — Figures 4, 5, 6 + Table 5.

## 📌 이 챕터 다 읽으면 알 수 있는 것

- **변수 중요도** 를 어떻게 측정하는지 (counterfactual zero-out 방식)
- **Fig. 4** — 94 특성 중 top 20 막대그래프
- **Fig. 5** — 94 특성 전체 heatmap (모델 간 합의)
- **Fig. 6** — β 네트워크와 f 네트워크가 같은 변수에 의지하는지 검증
- **Table 5** — odd/even permno robustness (학습 자산과 평가 자산을 완전 분리)
- **Factor Zoo 종말 메시지** — 94 중 ~20 만 진짜

각 Table·Figure 앞에 **📖 처음 보는 사람을 위한 읽기 가이드** 가 박혀 있음.

---

## 8.1 챕터 한 줄 요약

CA 모델이 학습한 가중치를 분석하면, **price trend** (mom1m, mom12m, chmom, indmom, maxret, mom36m), **liquidity** (turn, std_turn, mvel1, dolvol, ill, zerotrade, baspread), **risk** (retvol, idiovol, beta, betasq) — 세 카테고리가 가장 중요. **Top 20 특성이 모델 contribution 의 ~80% (CA0) ~ ~90% (CA1–CA3) 차지**. β 네트워크와 factor 네트워크의 변수 중요도 ranking 이 거의 일치 (Fig. 6). Robustness check: 주식을 odd/even permno 로 분할해도 CA2 의 성능 거의 동일 (Table 5).

---

## 8.2 변수 중요도 측정법 (journal p.441, Section 3.6)

paper 본문 (815–817):
> "We identify influential covariates by ranking them according to a notion of variable importance, defined as the **reduction in total R² resulting from setting all values of a given characteristic to zero** while holding the remaining model estimates fixed. For this analysis, we focus on the five-factor specification of each model."

**측정법**:
1. 학습 끝난 CA 모델 고정.
2. 한 특성 $z^{(j)}$ 의 모든 값을 0 으로 설정 (즉 그 특성 "제거").
3. OOS Total R² 다시 계산.
4. **원래 R² − 변경된 R² = 변수 j 의 importance**.

**왜 이 방법**:
- 단순 partial derivative ($\partial \hat r / \partial z$) 가 아닌 **counterfactual**: "이 특성을 가졌다고 모델에 알려주지 않으면 얼마나 손해?"
- NN 의 비선형 효과를 직접 포착 (gradient 는 한 지점에서의 기울기만).
- **K=5 fixed** for fair comparison across CA0–CA3.

---

## 8.3 Figure 4 — Top 20 특성 (CA0–CA3 별)

![Fig. 4 — Top 20 characteristics by variable importance](figures/page14_Fig4_top20_chars.png)

*journal p.442 Fig. 4 — 4 panel (CA0, CA1, CA2, CA3). 각 panel 의 top 20 특성을 importance 막대로 표시. 모든 모델에서 같은 카테고리 (price trend, liquidity, risk) 가 top.*

### 📖 처음 보는 사람을 위한 — Fig. 4 읽는 법

**한 줄로**: "94개 재무 특성 중 어떤 게 모델 예측에 가장 중요한지 막대그래프로. 4개 모델 (CA0~CA3) 다 거의 같은 특성을 1등으로 꼽음."

**그림 구조** (4 패널, 가로 막대 그래프):

```
   각 패널 (예: CA1):
   
   mvel1   ████████████████   ← 가장 긴 막대 = 가장 중요
   mom1m   ███████████████
   beta    █████████████
   ...                          ← top 20 까지만 표시
   maxret  ████
   ──────────────────────────►  importance (R² 감소량)
```

**측정 방법 (이게 중요)**:
- 막대 길이 = "이 특성을 모델에서 빼면 R² 가 얼마나 떨어지나" 의 양.
- 예: mvel1 막대가 5% = "회사 시가총액 정보를 0 으로 두면 모델 설명력 5%p 손실"
- **partial derivative 가 아닌 counterfactual** — NN 의 비선형 효과 직접 포착.

**4 패널을 비교해서 보는 법**:

1. **CA0, CA1, CA2, CA3 패널의 top 5 변수가 거의 같음** → 모델 우연이 아닌 데이터의 진짜 구조.
2. **막대 길이의 비율도 비슷** — 가장 중요한 변수가 압도적으로 길고, 20위는 작음 → sparsity.
3. **20위 이후는 거의 0** (그림에 표시 안 됨) → 94개 중 ~20개가 거의 모든 설명력.

**Top 변수의 3 카테고리 (기억할 것)**:

| 카테고리 | 대표 변수 | 일상 비유 |
|---------|----------|-----------|
| **Price Trend (가격 추세)** | mom1m, mom12m, chmom | "이 회사 주가가 최근 어떻게 움직였나" |
| **Liquidity (유동성)** | mvel1, turn, dolvol | "이 회사 주식이 얼마나 자주 거래되나" |
| **Risk (변동성)** | retvol, idiovol, beta | "이 회사 주가가 얼마나 흔들리나" |

**한 줄 결론**:
> "94개 중 ~20개로 90% 설명. 그것도 모멘텀·유동성·변동성 3 카테고리. → Cochrane 의 'Factor Zoo' 비판에 ML 의 답."

**놓치기 쉬운 한 가지**: 막대 그래프 안에 **정확한 1위, 2위 numerical ranking 은 paper 본문에 없음** — 카테고리 단위로만 묶어 발표. Fig. 4 시각적 확인만 가능.

**원문 위치**: paper Fig. 4, journal p.442.

```viz:autoencoder-fig4-importance:title=paper Fig. 4 — Top 20 Variable Importance (interactive),caption=Model 토글 CA0~CA3. 변수는 카테고리별 색 (Price Trend / Liquidity / Risk / Other). 모든 CA 모델이 거의 같은 top 변수 선정. paper 본문에 정확한 numerical ranking 미발표 — 본 viz 는 paper 명시 카테고리 + Gu-Kelly-Xiu (2019) 와 거의 일치 한다는 paper 언급 기반 plausible ranking.
```

paper 본문 (journal p.441):
> "Figs. 4 illustrates characteristic importance for each conditional autoencoder specification. It focuses on the top 20 characteristics for each model. Beyond these, variable importance hovers near zero ... The total contribution by the top twenty characteristics is around **80% for CA0, and 90% for CA1 through CA3**."

→ **Sparsity 의 강력한 실증 증거**: 94 개 중 20 개로 거의 모든 explanatory power.

### Top 카테고리 (journal p.441)

paper 가 명시한 **3 카테고리**:

**(A) Price Trend (가격 추세)**:
| 변수 | 의미 |
|------|------|
| **mom1m** | 1-month reversal (단기 역전) |
| **mom12m** | 12-month momentum (12개월 모멘텀) |
| **chmom** | momentum change (모멘텀 변화) |
| **indmom** | industry momentum (산업 모멘텀) |
| **maxret** | recent maximum return (최대 일별 수익) |
| **mom36m** | long-term reversal (장기 역전, 3년) |

**(B) Liquidity (유동성)**:
| 변수 | 의미 |
|------|------|
| **turn** | turnover (회전율) |
| **std_turn** | turnover volatility |
| **mvel1** | log market equity (시가총액 로그) |
| **dolvol** | dollar volume |
| **ill** | Amihud illiquidity |
| **zerotrade** | number of zero trading days |
| **baspread** | bid-ask spread |

**(C) Risk (위험 측정)**:
| 변수 | 의미 |
|------|------|
| **retvol** | total return volatility |
| **idiovol** | idiosyncratic volatility (CAPM 잔차 stddev) |
| **beta** | CAPM beta |
| **betasq** | beta-squared |

paper 본문 (827–828):
> "Interestingly, all variants of the autoencoder model agree on the importance of these three categories."

→ **CA0, CA1, CA2, CA3 모두 같은 카테고리를 top 으로 선정**. ML 모델의 일관성.

paper 본문 (828–833):
> "Moreover, these results closely coincide with the findings of Gu et al. (2019), who track variable importance using R²pred ... This consistency of variable importance across different objectives is an indication of robustness in our list of key variables."

→ Gu, Kelly, Xiu (2019, RFS) supervised ML 예측 모델의 top 변수와도 일치 → **변수 ranking 의 robustness**.

### 정확한 순위 (1, 2, 3, ...)

**주의**: paper 의 Fig. 4 는 **막대그래프** 만 제공. 본문에 명시적 numerical ranking 없음. 카테고리 단위에서만 "이 변수들이 top 20" 으로 묶음.

→ "1위 = mvel1, 2위 = mom1m, ..." 같은 specific ordering 은 paper 에서 확인 불가. **Fig. 4 막대 그래프 시각 확인** 만 가능.

---

## 8.4 Figure 5 — 94 특성 전체 Ranking Heatmap

![Fig. 5 — Overall importance rankings of all characteristics](figures/page15_Fig5_all94_heatmap.png)

*journal p.443 Fig. 5 — 94 특성을 모든 모델 합산 ranking 내림차순. 5 column (IPCA, CA0–CA3). 진한 파랑 = 매우 중요, 흰색 = 거의 무관.*

### 📖 처음 보는 사람을 위한 — Fig. 5 읽는 법

**한 줄로**: "94개 특성을 위에서 아래로, 5개 모델을 왼쪽에서 오른쪽으로 정렬한 색깔 격자. 진한 파랑이 많을수록 중요, 흰색이면 무시."

**그림 구조** (heatmap):

```
                      ┌────────────────────┐
                      │ IPCA CA0 CA1 CA2 CA3│
                      ├────────────────────┤
   ↑ rank 1 (top)     │ ▓▓  ▓▓  ▓▓  ▓▓  ▓▓ │ ← 모든 모델 진한 파랑 = 공통 1위
                      │ ▓▓  ▓▓  ▓▓  ▓▓  ▓▓ │
   상위 ~20개         │ ▓   ▓▓  ▓▓  ▓▓  ▓▓ │ ← 진한 파랑 영역
                      │  ▓  ▓   ▓   ▓▓  ▓▓ │
                      │  ▓   ▓  ▓    ▓  ▓  │ ← 중간 영역 (옅은 파랑)
                      │     ▒        ▒    │
                      │                    │
   하위 ~74개         │                    │ ← 흰색 영역 = 거의 무시
                      │                    │
                      │                    │
   ↓ rank 94 (bottom) │                    │
                      └────────────────────┘
```

**왜 heatmap?**
- 막대그래프 (Fig 4) 가 한 모델의 top 20 만 보여줬다면, 이건 **94 개 전체** 를 한 그림에 → 정보 압축.
- 색 = 그 모델에서 그 특성의 중요도 (진한 = 중요, 흰색 = 무시).

**보면 알 수 있는 3가지**:

1. **위쪽 (상위 20개) 이 모든 column 에서 진한 파랑** → **모델 간 합의**. CA0~CA3 + IPCA 가 같은 변수를 중요하다고 함.
2. **아래쪽 (rank 50+) 거의 흰색** → **모델 간 합의로 무시**. 학계가 발표한 anomaly 의 절반 이상이 noise/중복임을 시사.
3. **상-하 경계가 뚜렷함 (~20위 즈음)** → **자연스러운 이중분할** (informative ~20 vs uninformative ~74).

**한 줄 결론**:
> "94 변수의 자연스러운 이분법: ~20 informative + ~74 noise. 학계 위기 (Factor Zoo) 의 ML 진단."

**Fig 4 와 차이**:
- Fig 4: **각 모델의 top 20** 을 막대로 (=어떤 변수가 중요한가, 모델별).
- Fig 5: **모든 94 특성을 한 표에** 색으로 (=모델 간 합의를 한눈에).
- 같은 메시지를 두 시각으로 강화.

**원문 위치**: paper Fig. 5, journal p.443.

```viz:autoencoder-fig5-heatmap:title=paper Fig. 5 — 94 Characteristics Heatmap (interactive),caption=토글로 Top 30 vs 94 전체 모드. 5 column (IPCA, CA0~CA3) × 94 행 (특성). 진한 파랑 = 매우 중요, 흰색 = 거의 무관. 위쪽 ~20 개는 모든 모델 진한 파랑 (합의 영역), 아래쪽 ~74 개는 흰색 일색 — sparsity 의 시각적 증거.
```

journal p.443, Fig. 5 note:
> "This figure ranks 94 stock-level characteristics in terms of overall model contribution. Characteristics are ordered based on the sum of their ranks over all models, with the most influential characteristics on top and least influential on bottom. Columns correspond to individual models, and color gradients within each column indicate the most influential (dark blue) to least influential (white) variables."

**시각화 구조**:
- 행: 94 특성 (위에서 아래로 모든 모델 합산 ranking 내림차순).
- 열: 각 모델 (IPCA, CA0, CA1, CA2, CA3).
- 색: 진한 파랑 = 그 모델에서 매우 중요, 흰색 = 거의 무관.

**관찰**:
- 위쪽 (top 20) 이 거의 모든 모델에서 진한 파랑 — 모델 간 합의.
- 아래쪽 (rank 50+) 은 흰색 일색 — 거의 모든 모델에서 무시.
- **→ 94 특성의 자연스러운 dichotomy**: ~20 importan + ~74 거의 noise.

---

## 8.5 Figure 6 — β 네트워크 vs Factor 네트워크 분리

![Fig. 6 — Separate importance rankings (β vs factor networks)](figures/page17_Fig6_separate_importance.png)

*journal p.445 Fig. 6 — 좌측 panel: β-network 만의 importance. 우측 panel: factor-network 만의 importance. 둘 다 같은 순서로 정렬된 94 특성 × CA1/CA2/CA3 컬럼. 두 panel 의 진한 파랑 패턴이 거의 일치 → 두 네트워크가 같은 특성 사용.*

### 📖 처음 보는 사람을 위한 — Fig. 6 읽는 법

**한 줄로**: "Fig. 5 의 heatmap 을 두 번 그린 것 — 왼쪽은 β 네트워크만, 오른쪽은 factor 네트워크만. **두 그림이 거의 똑같으면** 두 네트워크가 같은 변수에 의지한다는 증거."

**왜 따로 그렸나?**
- CA 모델 안에는 **두 신경망 (β-net + f-net)** 이 따로 있음 (Fig. 2 참조).
- 둘이 같은 데이터 (94 특성) 를 보지만 **다른 일을 함**:
  - β-net: "이 회사의 위험 노출도가 얼마"
  - f-net: "이번 달 시장 전체의 위험 충격이 얼마"
- 두 네트워크가 **같은 변수에 의지하나, 다른 변수에 의지하나** 가 궁금.

**그림 구조**:

```
   좌측 패널: β network            우측 패널: factor network
   ┌─────────────┐                ┌─────────────┐
   │ CA1 CA2 CA3 │                │ CA1 CA2 CA3 │
   ├─────────────┤                ├─────────────┤
   │ ▓▓ ▓▓ ▓▓    │ ← rank 1       │ ▓▓ ▓▓ ▓▓    │ ← 같은 행이 같은 변수
   │ ▓▓ ▓▓ ▓▓    │                │ ▓▓ ▓▓ ▓▓    │   (예: rank 1 = mvel1)
   │ ▓  ▓▓ ▓▓    │                │ ▓  ▓▓ ▓▓    │
   │ ...         │                │ ...         │
   └─────────────┘                └─────────────┘
```

**보면 알 수 있는 1가지 (이게 핵심)**:
- **두 패널의 진한 파랑 위치가 거의 동일** → β 와 f 두 네트워크가 **같은 변수에 의지**.
- 둘이 독립으로 학습됐는데 같은 결론 → **데이터의 진짜 구조** 가 강제한 결과.

**왜 이게 중요한가?**
- ML 모델의 큰 비판 = "랜덤 초기화 운에 결과가 갈린다".
- Fig. 6 이 그 비판에 답: **두 네트워크가 독립 학습됐는데 같은 변수를 중요하게** → 우연 아닌 **데이터-driven**.

**한 줄 결론**:
> "β-net 과 f-net 이 같은 변수에 의지 → 모델의 일관성. 학습된 importance 가 데이터의 진짜 구조 반영."

**원문 위치**: paper Fig. 6, journal p.445.

paper 본문 (journal p.444):
> "We further look into the importance of characteristics for the beta and factor networks separately, in Fig. 6. To calculate the characteristics importance for the beta (resp. factor) network, we again set all values of a given characteristic in the beta (resp. factor) network to zero, without altering the values of this characteristic in the factor (resp. beta) network, and then measure the reduction in total R². Interestingly, the **relative importance of characteristics is consistent for the two networks**."

→ β 네트워크 (특성 → 노출도) 와 factor 네트워크 (managed portfolio 의 가중치 학습) 모두 **거의 같은 특성** 을 중요하게 봄. 모델 내부의 일관성.

**왜 중요**: 두 네트워크가 독립적으로 학습되었지만 같은 특성을 중요하게 선정 → 변수 중요도가 모델 우연 (random initialization 등) 이 아닌 **데이터의 진짜 구조 반영**.

---

## 8.6 Table 5 — Odd / Even Permno 분할 Robustness (journal p.444, Section 3.7)

paper 본문 (881–885):
> "We re-train the CA2 model using subsamples of stocks comprised of odd or even permnos, respectively. We report the out-of-sample total R² (%), predictive R² (%), equal-weight and value-weight Sharpe ratios for the subsamples in Table 5."

**테스트 구조**:
- 약 30,000 개 주식을 permno (CRSP 고유 ID) 의 홀짝으로 분할 → 14,984 odd + 14,908 even.
- 각 부분집합으로 **별도 학습** + 다른 부분집합에서 평가 (또는 같은).
- **CA2 K=5 만 검정** (paper Table 5 note: "All estimates are based on the five-factor CA2 model").

### 📖 처음 보는 사람을 위한 — Table 5 읽는 법

**이 표가 묻는 것**: "이 모델이 학습한 패턴이 **자산 일부만** 의 우연인가, 아니면 **모든 자산** 의 보편 구조인가?"

**테스트 디자인**:
- 30,000 개 주식을 **permno (CRSP 주식 ID) 홀짝** 으로 둘로 가름. 14,984 odd + 14,908 even.
- 한 절반으로 모델 **학습** + 다른 절반으로 **평가**.
- 만약 자산 일부만의 우연이면 → 다른 절반에선 성능 추락. 보편 구조면 → 거의 같은 성능.

**행 4개 의미**:

| 행 | 무슨 의미 | 일상 비유 |
|---|----------|-----------|
| Odd→Odd | 홀수로 학습, 홀수로 평가 (in-sample 기준선) | 1반 학생들로 약점 진단법 만들고 1반 다시 평가 |
| **Odd→Even** | 홀수로 학습, 짝수로 평가 (**진짜 OOS**) | 1반으로 만든 진단법을 2반에 적용 |
| **Even→Odd** | 짝수로 학습, 홀수로 평가 | 2반으로 만든 진단법을 1반에 적용 |
| Even→Even | 짝수로 학습, 짝수로 평가 | 2반 자체 점검 |

**어디를 봐야 하나?**
- **Odd→Even 과 Even→Odd 행** 이 핵심 (실제 generalization 테스트).
- 이 두 행의 숫자가 in-sample (Odd→Odd, Even→Even) 과 거의 같으면 → 모델이 **자산 보편** 구조 학습.

**3개만 보면 됨**:

1. **모든 셀 Total R² = 13.5~13.7** (변동 0.2%p) → 학습/평가 sample 분리해도 거의 동일.
2. **EW SR 2.38~2.53** (변동 0.15) → Sharpe 도 거의 동일.
3. **Pred R² 0.48~0.54** (변동 0.06%p) → Predictive 도 OK.

**한 줄 결론**:
> "CA2 가 학습한 비선형 매핑이 자산 절반만의 우연이 아닌 **전체 시장의 보편 구조**. 다른 시장 (해외·다른 자산군) 으로의 확장 가능성 시사."

**원문 위치**: paper Table 5, journal p.444.

---

```viz:autoencoder-table5-robustness:title=paper Table 5 — CA2 Cross-Section Robustness (interactive),caption=지표 토글 (Total R² / Pred R² / EW SR / VW SR). 4 시나리오 (Odd→Odd, Odd→Even, Even→Odd, Even→Even) 의 막대 비교. 모든 지표에서 변동 < 5% — 자산 절반 완전 분리해도 성능 유지 → cross-section 보편 구조.
```

### paper Table 5 (정확한 paper 수치)

| Testing sample | Training sample | Total R² (%) | Pred R² (%) | EW SR | VW SR |
|----------------|-----------------|--------------|-------------|-------|-------|
| Odd | Odd | 13.7 | 0.48 | 2.42 | 1.28 |
| Odd | Even | 13.6 | 0.49 | 2.38 | 1.26 |
| Even | Odd | 13.6 | 0.52 | 2.52 | 1.29 |
| Even | Even | 13.5 | 0.54 | 2.53 | 1.19 |

**관찰**:
- **모든 셀이 거의 동일 값**: Total R² 13.5–13.7, Pred R² 0.48–0.54, EW SR 2.38–2.53, VW SR 1.19–1.29.
- 학습 sample 과 평가 sample 이 **완전히 분리** 되어도 (예: Odd 로 학습 → Even 으로 평가) 성능 거의 변동 없음.

paper 본문 (884–885):
> "Throughout, the CA2 model performs almost equally well, **even when the assets used in the training and testing samples are completely non-overlapped**."

**의미**: CA2 가 **자산 특이적 (asset-specific) 패턴** 이 아닌 **횡단면 보편 패턴** 을 학습 — 일반화 가능성의 강력한 증거.

---

## 8.7 함의 — Factor Zoo 와 Sparsity

본 절의 발견은 학계 위기를 직접 다룸:

### (1) "Factor Zoo" 비판에 대한 응답
- Cochrane (2011 AFA Address): "학계가 매년 새 factor 를 발견하지만 대부분 중복/우연".
- 본 논문 발견: **94 특성 중 20개로 ~90% explanatory power**. → 나머지 ~74개는 거의 noise 또는 중복.
- → ML 모델이 **데이터 주도적으로 진짜 factor 선별**.

### (2) Sparsity 의 실증 증거
- LASSO 가 통계학적으로 가정하는 sparsity 가 **데이터 자체에서 발현**.
- → 학계가 향후 새 factor 발견보다 **기존 factor 의 통합/정리** 에 집중해야.

### (3) Cross-Model Consistency
- CA0, CA1, CA2, CA3 모두 같은 top 카테고리 선정.
- Gu, Kelly, Xiu (2019) supervised ML 의 top 변수와도 일치.
- → 변수 importance 의 **objective-invariant robustness**.

---

## 8.8 비선형 효과 — 추정 (paper 본문 미세부)

**주의**: 본 논문은 변수 importance 만 보고. **partial dependence plot** 이나 **size × momentum interaction heatmap** 은 paper Figure 에 명시되지 않음 (Online Appendix 가 있을 수 있으나 본 PDF 22쪽 본문엔 미포함).

→ CA 가 어떤 함수형 (비선형 함수의 모양) 으로 매핑하는지의 직접 시각화는 본 논문 본문 범위 외. 후속 연구 또는 본 해체의 **인터랙티브 viz** 에서 재현할 항목.

paper 본문 (3.6 절 끝) 의 명시: 변수의 **상호작용 (interaction)** 효과는 정량적 시각화 미발표.

---

## 8.9 그림으로

### 📖 처음 보는 사람을 위한 — 정리 그림 읽는 법

아래 ASCII 그림은 본 챕터의 세 결과 (Fig 4·5·6 + Table 5) 를 한 그림으로 압축:

**상단 박스**: "94 특성 → 모델 contribution"
- **Rank Top 20** (위) — 3 카테고리 (Price trend / Liquidity / Risk) 가 contribution 의 ~90%.
- **Rank 21-94** (아래) — near-zero contribution. → 학계의 "Factor Zoo" 가 사실 ~20 개 core + ~74 개 잡음.
- 비유: "94 권 책 중 20 권만 잘 읽으면 90% 의 가치" — Sparsity 의 실증 증거.

**중단 박스**: "β 네트워크 vs Factor 네트워크"
- 두 네트워크가 **독립 학습** 됐는데 **같은 특성** 을 중요하다고 선정 → 데이터의 진짜 구조 (cross-network consistency).
- Fig 6 의 두 패널이 거의 동일하게 보이는 이유.

**하단 박스**: "Odd/Even permno robustness (Table 5)"
- 자산을 절반으로 분리 학습/평가해도 성능 거의 동일 → 학습된 매핑이 자산 보편 구조.
- 향후 다른 자산군 (해외, 채권, 외환) 으로 확장 가능성 시사.

**박스 3 개의 공통 메시지**: 본 논문이 학습한 것이 **데이터의 진짜 구조** (asset/network/sample 모두에 안정적). → 모델의 강한 신뢰성.

---


```
[ 94 특성 → 모델 contribution ]

  Rank        Categories
  ─────       ──────────────────────────────────
  Top 20      Price trend:   mom1m, mom12m, chmom, indmom, maxret, mom36m
              Liquidity:     turn, std_turn, mvel1, dolvol, ill, zerotrade, baspread
              Risk:          retvol, idiovol, beta, betasq
              (+ 일부 valuation, profitability 변수)
                   │
                   │ Contribution: ~80% (CA0), ~90% (CA1-CA3)
                   │
  Rank 21-94  Near-zero contribution
                   │
                   │ Sparsity 의 실증 증거
                   │ → "Factor Zoo" 종말

[ β 네트워크 vs Factor 네트워크 (Fig. 6) ]
  같은 특성을 중요하게 선정 (cross-network consistency)

[ Odd/Even permno robustness (Table 5) ]
  완전 분리 학습/평가 → 성능 거의 동일
  → Cross-section generalizability
```

---

## 8.10 학계 기여

본 절의 학계적 의미:

### (1) Anomaly Replication Crisis
- 학계 발표 anomaly 의 절반 이상이 OOS replication 실패 (McLean & Pontiff 2016, Harvey et al. 2016).
- 본 논문: 94 anomaly 를 한 framework 에서 동시 검증 → **20 개만 robust**.

### (2) Methodology Standardization
- 변수 중요도 측정의 표준 방법 제시 (zero-out reduction in R²).
- 분리 네트워크 importance (Fig 6) 의 framework — β 와 factor 의 의미 분해.

### (3) Cross-Validation Standard
- Table 5 의 odd/even permno 분할 → 자산 universe 의 robustness test 표준 제공.
- Time-only OOS 외 cross-section split 도 적용 가능.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. 변수 중요도 측정 방법의 핵심은? (partial derivative 와의 차이)
2. Top 20 특성이 ~90% contribution 인 것의 의미는?
3. Table 5 의 odd/even permno 결과가 의미하는 것은?

### 답변

1. **변수 중요도 측정 방법 — counterfactual + NN 비선형 효과 직접 포착**:
   - **방법**: 학습 끝난 CA 모델 고정 → 한 특성 $z^{(j)}$ 의 모든 값을 0 으로 → OOS Total R² 재계산 → **원래 R² - 변경된 R²** = importance.
   - **vs Partial Derivative**: ∂R²/∂z 는 한 지점의 기울기만 측정. NN 의 globally nonlinear 효과 (saturation, interaction) 못 포착.
   - **Counterfactual 의 의미**: "이 특성을 아예 안 보면 모델이 얼마나 나빠지나" — NN 의 비선형 전체 효과 직접 측정.
   - **K=5 고정의 이유**: CA0~CA3 간 공정 비교 위해. K 변하면 모델 capacity 변동.
   - **paper 의 검증**: 같은 measurement 가 supervised ML (Gu-Kelly-Xiu 2019) 의 top 변수와 일치 → robust.

2. **Top 20 특성이 ~90% contribution 의 3 함의**:
   - **(a) Sparsity 의 실증 증거**: 94 변수 중 대부분 (~74) 이 noise/중복 — 학계 통념의 "factor zoo" 가 사실 ~20 core factors 의 노이즈 확장.
   - **(b) Cochrane 2011 AFA Address 응답**: "학계가 새 factor 발견에 매몰" 비판에 대한 ML 답 — 데이터-driven sparsity. 학계가 새 factor 보다 **정리/통합** 에 집중해야.
   - **(c) Cross-model consistency**: CA0, CA1, CA2, CA3 + Gu-Kelly-Xiu (2019) supervised ML 까지 모두 같은 top 변수 선정 → **모델 우연 아닌 데이터의 진짜 구조** 반영.
   - **(d) Replication crisis 부분 해소**: McLean-Pontiff (2016) 의 "절반 anomaly OOS 실패" 와 부합. 본 논문이 94 를 동시 검증해 ~20 만 살림.
   - **(e) 운용 함의**: 실제 quant fund 가 모든 94 특성 살필 필요 없음 — top 20 으로 90% 효과.

3. **Table 5 의 odd/even permno 결과의 의미**:
   - **테스트 설계**: 30,000 주식을 permno (CRSP 고유 ID) 홀짝으로 분할 → 14,984 odd + 14,908 even.
   - **결과**: 학습/평가 sample 완전 분리해도 Total R² 13.5~13.7 (변동 0.2%p), EW SR 2.38~2.53 (변동 0.15).
   - **의미 (a) Cross-section robustness**: 학습된 비선형 매핑이 **자산 특이 (asset-specific) 가 아닌** 데이터 전체의 **보편 구조** 반영.
   - **의미 (b) 외삽 (extrapolation) 가능성**: 보편 구조 → 다른 자산군 (해외 주식, 채권, 외환, 상품) 으로의 확장 가능성 시사.
   - **의미 (c) Overfitting 부재 증명**: 한 절반에서 학습한 게 다른 절반에서도 통함 → 신경망이 noise 가 아닌 진짜 신호 학습.
   - **운용 함의**: 30 년 검증 + 자산 분할 검증 두 가지 모두 통과 → CA2 모델의 **실제 운용 신뢰성** 매우 높음.
