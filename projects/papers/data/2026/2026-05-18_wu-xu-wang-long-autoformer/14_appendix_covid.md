# 14 Appendix F — COVID-19 Case Study

paper p.16–17 Appendix F. **제한된 데이터** 와 **짧은 input** 조건에서 Autoformer 의 robustness.

---

## 데이터

> We also apply our model to the COVID-19 real-world data [15]. This dataset contains the data collected from countries, including the number of confirmed deaths and recovered patients of COVID-19 recorded daily from January 22, 2020, to May 20, 2021. (p.16)

- 출처: Dong-Du-Gardner [15] (Lancet Infect. Dis., 2020).
- 기간: 2020/01/22–2021/05/20 (약 16개월).
- 변수: 사망자, 회복 환자 일별.
- Split: 7:1:2 chronological + normalized.

> We select two anonymous countries in Europe for the experiments. (p.16)

→ Country 1, Country 2 익명. 데이터 한계 (~365일 train).

---

## 실험 설정 — 매우 도전적

> Note that this problem is quite challenging because the training data is limited. (p.16)

> We still follow the long-term forecasting task and let the model predict the next week, half month, full month respectively. The prediction lengths are 1, 2.1, 4.3 times the input length. (p.16)

| Input $I$ | Predict $O$ | $O/I$ 비율 | 의미 |
|----------|-----------|------------|------|
| 7 | 7 | 1× | 일주일 입력 → 일주일 |
| 7 | 15 | ~2.1× | 일주일 입력 → 반달 |
| 7 | 30 | ~4.3× | 일주일 입력 → 한달 |

→ $O > I$ — input 보다 더 긴 미래를 예측해야 한다. 일반 forecasting setting (input-96-predict-96) 보다 훨씬 어려움.

---

## Table 11 — Quantitative Results (paper p.16)

### Country 1

| O | Autoformer MSE/MAE | Informer | LogTrans | Reformer | Transformer |
|---|-----|----|----|----|----|
| 7  | **0.110** / **0.213** | 0.168 / 0.323 | 0.190 / 0.311 | 0.219 / 0.312 | 0.156 / 0.254 |
| 15 | **0.168** / **0.264** | 0.443 / 0.482 | 0.229 / 0.361 | 0.276 / 0.403 | 0.289 / 0.382 |
| 30 | **0.261** / **0.319** | 0.443 / 0.482 | 0.311 / 0.356 | 0.276 / 0.403 | 0.362 / 0.444 |

### Country 2

| O | Autoformer | Informer | LogTrans | Reformer | Transformer |
|---|-----|----|----|----|----|
| 7  | **1.747** / **0.891** | 1.806 / 0.969 | 1.834 / 1.013 | 2.403 / 1.071 | 1.798 / 0.955 |
| 15 | **1.749** / **0.905** | 1.842 / 0.969 | 1.829 / 1.004 | 2.627 / 1.111 | 1.830 / 0.999 |
| 30 | **1.749** / **0.903** | 2.087 / 1.116 | 2.147 / 1.106 | 3.316 / 1.267 | 2.190 / 1.172 |

→ **6/6 settings 모두 Autoformer SOTA**.

> Autoformer still keeps the state-of-the-art accuracy under the limited data and short input situation. (p.16)

---

## Figure 14 — Showcase

![Fig. 14 COVID showcase](figures/page17_Fig14_covid.png)

(Figure 14, paper p.17. Country 2 input-7-predict-15 setting)

> Compared to other models, our Autoformer can accurately predict the peaks and troughs at the beginning and can almost predict the exact value in the long-term future. The forecasting of extreme values and long-term trends are essential to epidemic prevention and control. (p.16)

핵심:
- Autoformer 의 예측 (orange) 이 ground truth (blue) 의 **peak/trough 시점** 을 일치.
- 다른 baseline (Informer/LogTrans/Reformer/Transformer) 는 trend 만 따라가거나 진폭이 압축됨.

---

## 작은 데이터에서도 작동하는 이유

paper 가 명시적으로 분석하진 않지만, 본 deep dive 의 해석:

1. **Inductive bias**: Decomposition 이 trend/seasonal 분리를 강제 → small data 에서도 잘 generalize.
2. **Top-k $\tau$ 의 절대 수**: $L=7$ 이면 $k = \lfloor c \log 7 \rfloor$ ≈ 2-3개. 충분히 작아 overfitting 회피.
3. **Roll 의 정보 보존**: 7개 시점 모두 aggregation 에 참여 → 정보 손실 없음.

→ Autoformer 가 **데이터-효율적** (data-efficient) 임을 시사. 단 paper 본문엔 명시적 주장 없음.

---

## Finance/Risk 응용 시사

COVID 의 daily 사망자 패턴은 finance 의 daily volatility 와 구조적 유사 — short-history + extreme events + long-horizon planning. paper 가 직접 finance application 을 언급하진 않지만, 본 case study 의 셋업이 **financial stress forecasting** 의 기본 골격과 일치:

- 짧은 input (단기 데이터만 사용 가능, regime change)
- 긴 horizon (정책 결정 위한 한 달치 outlook)
- Peak detection 의 중요성 (crisis, default cluster)

---

## COVID case 의 추가 통찰

### Country 1 vs Country 2 의 MSE 격차

paper Table 11 정확 인용:
- **Country 1** MSE: 0.110 / 0.168 / 0.261 (predict 7/15/30)
- **Country 2** MSE: 1.747 / 1.749 / 1.749 (predict 7/15/30)

Country 2 의 MSE 가 Country 1 의 **약 7-15배** 큼. 또한 Country 2 의 predict 7/15/30 MSE 가 거의 같음 — 매우 평평.

**해석**:
- Country 2 는 **wave pattern 의 진폭이 크고 noise 가 많은** 데이터일 가능성. 절대 MSE 가 큰 이유.
- predict 길이를 늘려도 MSE 가 거의 안 변함 — 모델이 **trend 만 잡고 peak/trough 의 정확한 타이밍 못 잡음**. 그래도 다른 baseline 보다 잘함.
- Country 1 은 더 작은 진폭 + 명확한 패턴 → 더 정확한 prediction.

### Cross-country generalization 의 가능성

paper 가 두 country 를 **anonymized** 으로 처리. 본 deep dive 의 추측:
- 두 country 는 European Union (paper text: "two anonymous countries in Europe")
- COVID wave 는 transboundary 현상 — Country 1 wave 가 Country 2 wave 의 leading indicator 일 수 있음.
- 그러나 paper 는 두 country 를 독립적으로 학습 — joint multi-country model 은 future work.

### 정책 응용 — Peak forecasting

paper p.16:
> The forecasting of extreme values and long-term trends are essential to epidemic prevention and control.

**peak forecasting** 이 핵심:
- 단순 trend prediction 만으로 부족 — 의료 시스템 capacity, lockdown timing 결정엔 peak height + timing 둘 다 필요.
- Autoformer 의 Auto-Correlation 이 **process-similarity** 를 잡아 — 비슷한 wave pattern 을 재배치 → peak 위치 예측에 자연.

### Financial stress 와 매핑

| COVID 응용 | Finance 응용 (analogy) |
|----------|---------------------|
| 일별 사망자 | 일별 default rate / VIX |
| Wave pattern | Volatility regime |
| Peak timing | Crisis onset |
| Country 1 vs 2 | Sector / Country 별 stress |
| 7-day history | 단기 trading data |
| 30-day horizon | Quarterly planning |
| Transboundary spread | Contagion effect |

→ **Autoformer 의 COVID 결과** 가 **finance stress forecasting** 의 직접 transfer 가능성 시사. 정확한 finance dataset (Exchange) 의 결과도 Section 4.1 에서 강력 (61% MSE 감소) → 두 응용의 일관성.

### 한계

paper 가 명시 안 한 COVID 의 한계:
- **2 country 만** — 일반화 어려움
- **Single dimensional** (사망자만) — multi-dimensional (cases + deaths + recoveries + hospitalizations) 더 complex
- **No exogenous variables** (정책, vaccination rate, mobility) — real-world forecasting 에 필수

본 case study 는 **proof-of-concept** 로 valuable 하지만 production 응용엔 추가 작업 필요.

---

다음 [15_conclusion.md](15_conclusion.md) 에서 paper 결론.
