# 11. Analysis — Figures 4-13 의 deep 해석

> 본 논문 *Section 4.3 + Appendix E* 의 *시각화 figures* 의 step-by-step 풀이. *모델 의 작동 원리* 의 시각적 증명.

---

## 11.1 챕터 한 줄 요약

> **"4 가지 visualization: (1) Fig 4 — Progressive decomposition (decomp block 0/1/2/3 의 누적 효과), (2) Figs 5-6 — Dependencies learning + Lag histograms (학습된 주기 의 의미), (3) Fig 7 — Efficiency, (4) Figs 8-13 — Prediction showcases (Autoformer 의 진짜 vs 예측 일치)."**

---

## 11.2 Figure 4 — Progressive Decomposition (★ 핵심)

![Figure 4 — Progressive Decomposition](figures/page9_Fig4_decomp_steps.png)

*paper p.9 Figure 4 — ETT predict-720 의 decomposition block 0/1/2/3 의 누적 효과.*

### 어떻게 읽나? (Step-by-step)

**Step 1 — 4 sub-panel 구조**:
- **(a) Without decomposition block** (0개): 분해 없이 학습.
- **(b) One decomposition block** (1개): decoder 의 1 layer 에 1 decomp block.
- **(c) Two decomposition blocks** (2개): 2 decomp blocks.
- **(d) Three decomposition blocks** (3개): 3 decomp blocks — *Autoformer default*.

**Step 2 — 각 panel 의 3 곡선**:
- *Time Series* (검정): 원본 시계열.
- *Seasonal Part* (밝은 색): 학습 된 seasonal 부분.
- *Trend-cyclical Part* (어두운 색): 학습 된 trend 부분.

**Step 3 — 핵심 발견**:

**(a) No decomp**:
- *Seasonal + Trend 분리 안 됨* — *모두 섞임*.
- 예측 의 *peak/trough 못 잡음*.

**(b) 1 decomp**:
- Trend 시작 정렬.
- *Seasonal 의 진동* 일부 분리.

**(c) 2 decomps**:
- Trend 가 *더 정확* — 부드러운 곡선.
- Seasonal 의 *주기성 더 명확*.

**(d) 3 decomps (Autoformer)**:
- *Trend + Seasonal 모두 진짜와 거의 일치*.
- *Long-term trend 정확* + *seasonal 의 peak/trough 정확*.

**Step 4 — 의미**: **Progressive decomposition 의 *시각적 증명***. *3 단계* 가 *충분* — *너무 많으면* 오히려 *과학적 발견*. Autoformer 가 *최적 깊이* 찾음.

```viz:autoformer-progressive-decomp:title=Fig 4 — Progressive Decomposition (interactive),caption=Decomp block 0/1/2/3 의 누적. 3 blocks 에서 trend + seasonal 모두 진짜와 일치.
```

---

## 11.3 Figure 5 — Dependencies Learning

![Figure 5 — Dependencies learning](figures/page10_Figs5-7_deps_lags_efficiency.png)

*paper p.10 Figure 5 (왼쪽 panel).*

### 어떻게 읽나?

**Step 1 — 4 sub-panel 비교**:
- **(a) Auto-Correlation**: top-6 시간 지연 $\tau_1, ..., \tau_6$ 의 *위치* 표시 (red lines).
- **(b) Full Attention**: 점 끼리 attention.
- **(c) LSH Attention**: hash bucket 끼리.
- **(d) ProbSparse Attention**: 선택 된 query 들.

**Step 2 — 빨간 별 (red stars)**: *마지막 시점 (last time step) 의 의존성*.

**Step 3 — 발견**:

**(a) Auto-Correlation**:
- *Top-6 τ 들 이 시계열 의 *진짜 주기 위치*** — *명확 한 패턴*.
- *없는 omission* — 모든 비슷한 sub-series 포함.

**(b) Full**: 모든 점 끼리 → *흩어진 점들*.

**(c) LSH**: hash 의 *noise* → *부정확*.

**(d) ProbSparse**: 일부 선택 → *놓치는 점*.

**Step 4 — 의미**: **Auto-Correlation 이 *진짜 의존성 (주기) 정확 발견***. 다른 sparse attention 보다 *완전 한 발견*.

---

## 11.4 Figure 6 — Learned Lag Histograms (★ 진짜 주기 발견 의 증거)

![Figure 6 — Lag Histograms](figures/page10_Figs5-7_deps_lags_efficiency.png)

*paper p.10 Figure 6 (가운데 panel).*

### 어떻게 읽나?

**Step 1 — 4 dataset 의 lag 분포 histogram**:
- **(a) Electricity** (Hourly): Daily Period (24h) 강함.
- **(b) Exchange** (Daily): Monthly + Quarterly + Yearly Period 강함.
- **(c) Traffic** (Hourly): Daily + Weekly Period 강함.
- **(d) Weather** (10min): Daily Period 강함.

**Step 2 — 의미**:

**(a) Electricity**: *24시간 주기* 가 *압도적* — 매일 전력 사용 패턴 (출근/잠).

**(b) Exchange**: *비주기* 같지만 *Monthly (~30 day), Quarterly (~90 day), Yearly (~365 day)* 주기 모두 발견 — *경제 의 cycle*.

**(c) Traffic**: *Daily (24h) + Weekly (168h)* — 매일 출퇴근 + 주중 vs 주말.

**(d) Weather**: *Daily (24h)* + *연간 cycle* — 매일 기온 + 계절.

**Step 3 — 핵심 메시지**: **Auto-Correlation 이 *시계열 의 진짜 주기 (real-world 의미)* 자동 발견**. 사람이 *수동 으로 명시* 안 해도 *학습 으로 발견*.

→ ***Interpretable forecasting*** — 학습 된 lag 가 *해석 가능*.

```viz:autoformer-lag-histogram:title=Fig 6 — Lag Histograms (interactive),caption=4 dataset 의 학습된 lag 분포. Electricity Daily, Exchange Monthly/Quarterly/Yearly, Traffic Daily/Weekly, Weather Daily.
```

---

## 11.5 Figure 7 — Efficiency (이미 ch07 참조)

이미 *Chapter 07 (Complexity)* 에서 다룸.

**핵심**: Auto-Correlation 이 *memory + time 모두* 최고. *Full Attention* 은 *L > 3000* 에서 OOM, Auto-Corr 은 *L = 8192* 까지도 *작동*.

---

## 11.6 Figure 8-11 — ETT Prediction Showcases (★ 시각적 SOTA 증명)

![Figure 8-11 — ETT predictions](figures/page15_Figs8-11_predictions.png)

*paper p.15 Figure 8 (predict-96), 9 (predict-192), 10 (predict-336), 11 (predict-720).*

### 어떻게 읽나?

**Step 1 — 4 figure 각각**:
- 4 model 비교 (Autoformer, Informer, LogTrans, Reformer).
- 각 panel 의 *blue = ground truth*, *orange = prediction*.

**Step 2 — predict-96 (Fig 8)**:
- 모든 model 이 *어느 정도 작동*.
- Autoformer 가 *가장 정확*.

**Step 3 — predict-192 (Fig 9)**:
- Informer, LogTrans, Reformer 가 *over-smoothing* 시작.
- Autoformer 만 *peak/trough 명확*.

**Step 4 — predict-336 (Fig 10)**:
- 다른 모델 들 *큰 편차*.
- Autoformer 가 *진짜 와 거의 일치*.

**Step 5 — predict-720 (Fig 11)**:
- *Informer 가 완전 over-smoothing* (직선).
- *LogTrans, Reformer 는 noise 만*.
- *Autoformer 만 진짜 패턴 잡음*.

**Step 6 — 의미**: **prediction length 늘수록 *Autoformer 의 우위 더 분명***. *Long-term robustness* 의 시각적 증명.

---

## 11.7 Figure 12 — Exchange (비주기) Prediction Showcase

![Figure 12 — Exchange predictions](figures/page16_Figs12-13_exchange.png)

*paper p.16 Figure 12 (Exchange predict-192).*

### 어떻게 읽나?

**Step 1 — Setup**: Exchange dataset 의 *predict-192*. Exchange 는 *비주기* (random walk-like).

**Step 2 — 4 model 비교**:
- *Autoformer*: 큰 변동 + trend 모두 잡음.
- *Informer/LogTrans/Reformer*: *trend 못 잡음* + over-smoothing.

**Step 3 — 의미**: **Autoformer 가 *주기성 없는 데이터에서도 SOTA***. 이는 *Auto-Correlation 의 *generalizability* — 명확한 주기 없어도 *trend + small fluctuations* 잡음.

---

## 11.8 Figure 13 — ETT Univariate Showcase

![Figure 13 — ETT Univariate](figures/page16_Figs12-13_exchange.png)

*paper p.16 Figure 13 (ETT univariate predict-720).*

### 어떻게 읽나?

**Step 1 — Setup**: ETT 의 *univariate (oil temperature 만)* + *predict-720*.

**Step 2 — 5 model 비교** (Autoformer, Informer, LogTrans, Reformer, DeepAR):
- *Autoformer*: 진짜 와 일치 + *over-smoothing 없음*.
- *DeepAR*: prediction length 늘면 *over-smoothing* (단조 곡선).
- *Informer/LogTrans*: *큰 편차*.

**Step 3 — 의미**: **Univariate 도 SOTA**. *DeepAR 의 over-smoothing 문제* 회피.

---

## 11.9 본 챕터 정리

```
   Figure 4 (Progressive decomposition)         Figures 5-6 (Dependencies + Lags)
   ─────────────────────────────────────         ────────────────────────────────

   decomp block 0/1/2/3                          Auto-Corr 의 Top-k τ 가
   3 blocks 가 trend+seasonal 정확             진짜 주기 발견
              ↓                                              ↓
              Figure 7 (Efficiency)                Figures 8-13 (Prediction showcases)
              ──────────────────                  ───────────────────────────────
              Memory/Time 효율                    ETT 96/192/336/720
              Long sequence 가능                   Exchange (비주기) + Univariate
              ↓                                              ↓
                   모든 이 figures = Autoformer 의 *시각적 SOTA 증명*
```

---

## 11.10 자기점검

### 핵심 3가지
1. **Figure 4 (progressive decomposition) 의 의미?**
2. **Figure 6 (lag histograms) 의 *real-world 발견*?**
3. **Figures 8-11 의 *prediction length 영향*?**

### 답변
1. **decomp block 0 → 1 → 2 → 3 의 *누적 효과*** 시각. *0 blocks*: trend + seasonal 분리 안 됨. *1-2 blocks*: 점진적 분리. *3 blocks (Autoformer default)*: trend + seasonal 모두 *진짜 와 거의 일치*. **Progressive decomposition 의 *시각적 증명*** — *반복적 정제* 가 *근본*.
2. **Auto-Correlation 의 Top-k τ 들 이 *시계열 의 진짜 주기 (real-world 의미) 자동 발견***. **(a) Electricity**: Daily (24h) — *매일 전력 사용 패턴*. **(b) Exchange**: Monthly + Quarterly + Yearly — *경제 cycle*. **(c) Traffic**: Daily + Weekly — *출퇴근 + 주중/주말*. **(d) Weather**: Daily + Yearly — *매일 + 계절*. *Interpretable forecasting* — 학습 된 lag 가 *해석 가능*.
3. **Predict length 늘 수록 *Autoformer 의 우위 더 분명***. predict-96 에서는 모든 model 어느 정도 작동. predict-720 에서는: *Informer 완전 over-smoothing (직선)*, *LogTrans/Reformer noise 만*, *Autoformer 만 진짜 패턴 잡음*. *Long-term robustness* 의 시각적 증명 — *장기 예측 의 진정한 SOTA*.

---

다음 챕터: [12_appendix_ett_full.md](12_appendix_ett_full.md) — Appendix A (ETT 4 variant 전체 벤치마크).
