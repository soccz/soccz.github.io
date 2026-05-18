# 04 Related Work — Section 2

## 2.1 Time Series Forecasting 모델의 계보

### 고전 통계 모델
- **ARIMA** [7, 6]: 비정상 → 차분 → 정상화 → autoregressive + moving-average. 1968–1970.
- **Filtering**: Kalman filter, normalizing kalman [12, 24]. 상태공간 모델.

### Deep Learning 1세대 — RNN 기반
- **DeepAR** [34]: autoregressive RNN + 확률적(probabilistic) 분포 출력. 산업 표준 (Amazon).
- **LSTNet** [25]: CNN + recurrent-skip — 짧은 단기와 긴 장기 패턴 동시 모델링.
- **Attention-based RNN** [46, 36, 37]: 시간 attention. (dual-stage attention, temporal pattern attention).
- **TCN** [40, 5, 4, 35]: causal convolution. WaveNet [40], Bai-Kolter [4].

### Deep Learning 2세대 — Transformer 기반 (본 paper 의 직접 비교 대상)

| 모델 | 어떻게 self-attention 을 sparse 화? | 복잡도 |
|------|---------------------------------|--------|
| Vanilla Transformer [41] | Full attention | $O(L^2)$ |
| LogTrans [26] | LogSparse — 지수적 간격으로 시간점 선택 | $O(L (\log L)^2)$ |
| Reformer [23] | LSH (Local-Sensitive Hashing) attention | $O(L \log L)$ |
| Informer [48] | KL-divergence 기반 ProbSparse | $O(L \log L)$ |
| **Autoformer** | **Auto-Correlation** (series-wise) | **$O(L \log L)$** |

paper 의 한 줄 (p.2):
> Note that these methods are based on the vanilla Transformer and try to improve the self-attention mechanism to a sparse version, which still follows the point-wise dependency and aggregation. In this paper, our proposed Auto-Correlation mechanism is based on the inherent periodicity of time series and can provide series-wise connections.

→ **모든 기존 Transformer 변형이 point-wise** 에 머문다. Autoformer 만 series-wise.

---

## 2.2 시계열 분해의 사용법 — 기존 vs 본 paper

### 기존: pre-processing only

> For the forecasting tasks, decomposition is always used as the pre-processing of historical series before predicting future series [20, 2], such as Prophet [39] with trend-seasonality decomposition and N-BEATS [29] with basis expansion and DeepGLO [35] with matrix decomposition. (p.3)

기존 사용법:
1. 과거 시계열을 trend / seasonal / residual 로 분해.
2. 각 component 를 따로 예측.
3. 합쳐서 미래 prediction.

문제:
> Such pre-processing is limited by the plain decomposition effect of historical series and overlooks the hierarchical interaction between the underlying patterns of series in the long-term future. (p.3)

- 미래는 모르니 미래 시점에서 분해 불가능.
- Hierarchical interaction (trend·seasonal 의 상호작용) 무시.
- 본 paper 의 ablation (Table 9, ch13) 에서 이 4가지 분해 알고리즘 (STL, Hodrick-Prescott, Christiano-Fitzgerald, Baxter-King) 으로 사전처리 후 Transformer 두 개로 separate prediction → 모두 Autoformer 보다 열세.

### Autoformer: progressive inner block

> This paper takes the decomposition idea from a new progressive dimension. Our Autoformer harnesses the decomposition as an inner block of deep models, which can progressively decompose the hidden series throughout the whole forecasting process, including both the past series and the predicted intermediate results. (p.3)

핵심:
- 분해 = deep network 의 layer 마다 적용되는 **operation**.
- Past 와 future 둘 다 분해 (decoder 의 intermediate prediction 도 분해 대상).
- → 미래의 trend·seasonal 상호작용을 모델이 layer 마다 refine.

---

## 본 paper 의 관련 분야 위치

```
[Forecasting]
   │
   ├── Classical: ARIMA, Filter
   │
   ├── RNN/CNN: DeepAR, LSTNet, TCN
   │
   └── Transformer
          │
          ├── Point-wise sparse: LogTrans, Reformer, Informer
          │
          └── Series-wise (NEW): Autoformer  ← 본 논문

[Decomposition]
   │
   ├── STL [33], Hodrick-Prescott [18], Christiano-Fitzgerald [11], Baxter-King [44]
   │   └── used as pre-processing: Prophet, N-BEATS, DeepGLO
   │
   └── Progressive inner block (NEW): Autoformer  ← 본 논문
```

Autoformer 는 두 영역의 **교차점** — Transformer 의 series-wise extension + Decomposition 의 inner-block 화. 둘이 결합되어 **시너지** 를 낸다 (ablation Table 3 가 증명).

---

## 본 paper 와 Lettau-Pelger (2020) / Gu-Kelly-Xiu (2021) 가 다른 점

(같은 deep_dive 폴더의 다른 paper 들과 비교)

| 측면 | Lettau-Pelger RP-PCA / Gu-Kelly-Xiu Autoencoder | **Autoformer** |
|------|-----------------------------------------------|----------------|
| 대상 | 자산 가격결정 (asset pricing) | 일반 시계열 forecasting |
| 출력 | factor loadings, returns | 미래 시점의 다변량 값 |
| 핵심 도구 | PCA / Autoencoder | Transformer + 분해 |
| 평가 | Sharpe ratio, R² | MSE, MAE |
| 응용 데이터 | CRSP 주식, 94 firm chars | ETT, Traffic, Weather, Exchange (FX) 등 |

**Finance 와의 접점**: Exchange dataset (8개국 일간 환율, 1990–2016) — economics 카테고리. paper 는 다음과 같이 언급 (p.7):
> This situation of ARIMA can be benefited from its inherent capacity for non-stationary economic data but is limited by the intricate temporal patterns of real-world series.

Exchange 의 무주기성(aperiodicity) 에 대한 Autoformer 의 robustness 가 별도 강조 (Section 4.1, Appendix E.2).

다음 [05_architecture.md](05_architecture.md) 에서 architecture 의 핵심 수식 (Eq 1–4) 으로.
