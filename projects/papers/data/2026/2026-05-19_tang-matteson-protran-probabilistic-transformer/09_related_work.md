# 09 Related Work — Section 4

paper p.6. 4 카테고리로 정리된 lineage.

## 4.1 Deep State Space Models

paper p.6:
> Deep neural networks have been extensively combined with state space models, resulting in flexible, yet principledly motivated latent variable approaches.

| 분기 | 모델 | 출처 | 특징 |
|------|------|------|------|
| Linear transition + neural emission | KVAE | Fraccaro 2017 [31, 51] | Kalman filter 활용 |
| Linear + neural emission | NKF | de Bézenac 2020 [23] | Normalizing flow + Kalman |
| RNN nonlinear transition | VRNN | Chung 2015 [22] | RNN + latent |
| RNN + latent | DKS | Krishnan [51] | Deep Kalman Smoother |
| RNN + latent | DRecCMD | Hafner 2019 [39] | World model |
| RNN + latent | DSSM | [3, 8, 30, 77] | 다양한 변형 |

**ProTran 의 차별**:
> Our models are similarly non-Markovian, but the dependencies on the past states are done via attention, which allows for easy connections between long-distance time steps. In addition, while most existing deep SSMs represent each time step with a single latent variable, our models include several layers of hierarchical latent variables with tractable inference mechanism.

→ Non-Markovian + **attention** (RNN 대신) + **hierarchical** latents.

## 4.2 Attentive Recurrent Networks

paper p.6:
> Attention mechanism has also been widely adopted in recent time series work using sequence-to-sequence models [1, 28] or transformer architectures [14, 55, 57, 72, 81, 94].

**다른 attention 적용 시계열 모델**:
- Seq2seq with attention: [1] Alaa-van der Schaar attentive SSM, [28] multi-horizon ATT
- Transformer time series: [14] Cao, [55] Li, [57] Lin, [72] Rasul (Transformer-MAF baseline), [81], [94]

**ProTran 의 차별**:
> While our models are equipped with latent variables, these transformer approaches [55, 72] lack inference mechanism and are susceptible to feeding back observation noise into the dynamics model at test time.

→ 기존 Transformer 들은 **latent + inference mechanism 결여**. Test time 에 observation noise 누적.

paper 추가:
> Our work, however, can be considered as an extension of the attentive state space model proposed in [1], with discrete latent states replaced by their continuous analogs.

→ Alaa-van der Schaar (2019) 의 attentive SSM 의 continuous latent 확장.

## 4.3 Time Series Forecasting

paper p.6:
> Traditional univariate time series models, such as Box-Jenkins methods [12] and exponential smoothing [43], often assume independence between any collection of time series.

**고전 통계**: Box-Jenkins ARIMA, 지수 평활.

**Multivariate 확장**:
- VAR (vector autoregression) [82]
- Multivariate GARCH [7]

→ 모두 stationarity 와 homoscedasticity 가정 필요.

**Deep learning forecasting**:
- Point forecasts: [53, 70, 96]
- RNN probabilistic: [76] DeepAR, [33] spline quantile, [75] GP-Copula, [23] NKF (normalizing flow), [73] TimeGrad (diffusion)

**ProTran 의 차별**:
> In contrast, our models are entirely devoid of such recurrent architectures and rely on latent variables to output distributional forecasts.

→ **No RNN at all** + latent-based distributional output.

## 4.4 Human Motion Prediction

paper p.6:
> Despite being almost identical in formulation, human motion prediction has often been studied independently from time series forecasting.

**Motion prediction 분기**:
- Deterministic generation: [13, 32, 34, 56] ERD, acLSTM
- HMM-based: [93]
- Gaussian processes: [89]
- Conditional VAE global latent: [95] MT-VAE, [97] DLow

**ProTran 의 차별**:
> In contrast to earlier work [95, 97] that employ a global latent variable across different time steps via conditional VAE [49], we leverage the principled framework of state space models for learning and inference of hierarchical, time-dependent latent variables.

→ 기존 VAE 는 **global latent** (시간 무관 1개). ProTran 은 **time-dependent + hierarchical** latents.

---

## Lineage 종합

```
Linear SSM (LDS) (Kalman 1960)
    ↓
Deep SSM
   ├── Linear transition: KVAE, NKF
   └── RNN transition: VRNN, DKS, DSSM, ...
                          ↓
              "Markovian + RNN can't catch long-range"
                          ↓
                       ProTran (이 paper, 2021)
                       ├── Attention 으로 non-Markovian
                       ├── RNN 완전 제거
                       └── Hierarchical latents

Transformer Time Series
   ├── Point forecast: Informer, Transformer-MAF
   └── No latent + autoregressive
                          ↓
              "lack inference + observation noise"
                          ↓
                       ProTran 의 다른 측면

Conditional VAE Motion
   ├── Global latent: MT-VAE, DLow
   └── Single time-agnostic z
                          ↓
              "global latent 부족"
                          ↓
                       ProTran: time-dependent + hierarchical
```

다음 [10_data_baselines.md](10_data_baselines.md) 에서 실험 셋업.
