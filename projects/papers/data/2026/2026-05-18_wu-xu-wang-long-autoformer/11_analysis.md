# 11 Model Analysis — Figs 4, 5, 6, 7 (Section 4.3)

paper p.9–10. **시각화 4종**으로 본 paper 의 메커니즘이 실제로 작동함을 입증.

---

## Figure 4 — Time Series Decomposition Visualization

![Fig. 4 Decomposition steps](figures/page9_Fig4_decomp_steps.png)

(Figure 4, paper p.9. ETT predict-720 setting. (a) decomposition block 0개, (b) 1개, (c) 2개, (d) 3개)

> Visualization of learned seasonal $\mathcal{X}_{de}^M$ and trend-cyclical $\mathcal{T}_{de}^M$ of the last decoder layer. We gradually add the decomposition blocks in decoder from left to right. This case is from ETT dataset under input-96-predict-720 setting. For clearness, we add the linear growth to raw data additionally. (p.9, Fig 4 caption)

**관찰**:
- (a) **분해 없음**: time series 의 trend 와 seasonal 이 섞여 있음 → 예측이 peak 를 놓침.
- (b) **1개 블록**: seasonal 이 trend 와 약간 분리.
- (c) **2개 블록**: trend 가 매끄럽게, seasonal 의 진폭이 정확해짐.
- (d) **3개 블록**: trend 가 깔끔한 단조 증가 라인, seasonal 이 주기적 진동만 남음.

paper p.9:
> By adding the series decomposition blocks, Autoformer can aggregate and refine the trend-cyclical part from series progressively. This design also facilitates the learning of the seasonal part, especially the peaks and troughs.

→ **점진성** 이 핵심. 한 번에 분해하지 않고 layer 마다 조금씩.

---

## Figure 5 — Dependencies Learning

![Figs 5-7 (Figure 5 is top)](figures/page10_Figs5-7_deps_lags_efficiency.png)

(Figure 5, paper p.10. (a) Auto-Correlation 의 학습된 시간 지연, (b) Full Attention, (c) LSH Attention, (d) ProbSparse Attention)

> The marked time delay sizes in Figure 5(a) indicate the most likely periods. Our learned periodicity can guide the model to aggregate the sub-series from the same or neighbor phase of periods by $\text{Roll}(\mathcal{X}, \tau_i)$, $i \in \{1, \cdots, 6\}$. For the last time step (declining stage), Auto-Correlation fully utilizes all similar sub-series without omissions or errors compared to self-attentions. (p.9)

**해석**:
- Auto-Correlation: top-6 의 $\tau$ 가 raw series 의 **주기적인 위치** (피크/트로프) 에 정확히 떨어진다 → 시계열의 **process 적 구조** 와 일치.
- Full Attention: 최근 점 위주로 선택 — local. 장기 dependency 놓침.
- LSH: 임의 hashing 으로 점을 골라 → 분산되지만 의미 없음.
- ProbSparse: KL divergence 로 일부 점 선택 — 다양하지만 같은 phase 가 아님.

→ **Auto-Correlation 만 "잠재 주기" 를 학습**.

---

## Figure 6 — Complex Seasonality

![Figs 5-7 (Figure 6 middle)](figures/page10_Figs5-7_deps_lags_efficiency.png)

(Figure 6, paper p.10. 4개 dataset 의 학습된 lag 분포)

> The lags that Autoformer learns from deep representations can indicate the real seasonality of raw series. For example, the learned lags of the daily recorded Exchange dataset present the monthly, quarterly and yearly periods (Figure 6 (b)). For the hourly recorded Traffic dataset (Figure 6 (c)), the learned lags show the intervals as 24-hours and 168-hours, which match the daily and weekly periods of real-world scenarios. (p.9-10)

### 학습된 주기 (paper Figure 6 정확 인용)

| Dataset | 빈도 | 학습된 lag 의 주된 peak |
|---------|------|-----------------------|
| (a) Electricity | hourly | **Weekly Period**, Daily Period |
| (b) Exchange | daily | **Monthly Period**, Quarterly Period, Yearly Period |
| (c) Traffic | hourly | **Daily Period (24h)**, Weekly Period (168h) |
| (d) Weather | 10min | **Daily Period** |

→ **데이터의 실제 주기와 일치** — 즉 Autoformer 가 학습한 $\tau$ 는 우연이 아니라 **실제 process** 를 reveal.

paper p.10:
> These results show that Autoformer can capture the complex seasonalities of real-world series from deep representations and further provide a human-interpretable prediction.

**해석 가능성(Interpretability)** 의 강조 — finance 같은 분야에서 **"왜 이 예측?" 답이 가능**.

---

## Figure 7 — Memory / Time Efficiency

(같은 page10 그림의 하단)

> We compare the running memory and time among Auto-Correlation-based and self-attention-based models (Figure 7) during the training phase. The proposed Autoformer shows $O(L \log L)$ complexity in both memory and time and achieves better long-term sequences efficiency. (p.10)

**실험 셋업** (caption):
- Memory: input=96, predict output 의 길이를 192→3072 까지 변화.
- Time: Auto-Correlation 또는 self-attention 만 분리해서 $10^3$ 회 실행 평균. Output 192 → 8192.

**핵심**:
- Auto-Correlation: 모든 길이에서 가장 낮은 memory & time.
- Full Attention (Transformer): 매우 가파른 증가 — 결국 OOM.
- ProbSparse (Informer): $O(L \log L)$ 이지만 Auto-Correlation 보다 큼.
- LSH (Reformer): 중간.

(자세한 수치는 [07_complexity_efficiency.md](07_complexity_efficiency.md) 에 정리)

---

## 통합 — 4개 그림이 같이 말하는 것

| Figure | 무엇을 입증? |
|--------|------------|
| 4 | 점진적 분해가 trend 와 seasonal 을 깔끔히 분리 → **representation** 측면 |
| 5 | Auto-Correlation 이 series 의 **실제 주기 위치** 를 학습 → **dependencies** 측면 |
| 6 | 학습된 lag 가 **real-world seasonality** 와 일치 → **interpretability** |
| 7 | Auto-Correlation 의 **wall-clock 효율** 이 self-attention 모두를 능가 → **scalability** |

이 네 측면이 함께 → Autoformer 가 단순히 ablation 수치만 좋은 것이 아니라 **그 메커니즘이 의도대로 작동** 함을 증명.

---

## 예측 시각화 (Figs 8–11)

![Figs 8-11 predictions](figures/page15_Figs8-11_predictions.png)

(Figures 8–11, paper p.15. ETT 의 predict-96/192/336/720, 마지막 dimension 만)

각 figure 가 **input 96 길이 + predict O 길이** 의 ground truth (blue) vs prediction (orange). Autoformer 가 periodicity 와 amplitude 모두 가장 정확하게 추적.

### Exchange (무주기 데이터)

![Fig. 12 Exchange](figures/page16_Figs12-13_exchange.png)

(Figure 12, paper p.16. Exchange predict-192)

> Compared to other models, Autoformer can still predict the exact long-term variations. It is verified the robustness of our model performance among various data characteristics. (p.16, Appendix E.2)

→ 무주기 환율에서도 trend 잡힘.

---

## 다음

3개 appendix chapters:
- [12_appendix_ett_full.md](12_appendix_ett_full.md) — Table 5 (ETT 4 variants)
- [13_appendix_hyper_input.md](13_appendix_hyper_input.md) — Tables 6/7/8/9 (c, input length, decoder input, decomp algos)
- [14_appendix_covid.md](14_appendix_covid.md) — Appendix F (COVID case)
