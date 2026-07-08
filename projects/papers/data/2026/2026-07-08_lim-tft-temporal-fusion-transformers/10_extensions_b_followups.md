# 9. 사고 확장 B — Follow-up 3편

## 선행 (1): Salinas et al. 2020, "DeepAR: Probabilistic forecasting with autoregressive recurrent networks" — arXiv:1704.04110, *International Journal of Forecasting* 36(3), 1181-1191 (2020)

**어떤 논문인가**: Amazon SageMaker 에 채택된 최초의 확률적 딥 forecasting. LSTM 백본으로 각 시점에 Gaussian 또는 Negative Binomial 파라미터 (μ, σ) 를 예측하고, autoregressive sampling 으로 다중 지평 확률 예측. Static covariate 는 embedding 후 initial hidden state 로 주입. 여러 시계열을 shared LSTM 파라미터로 학습 (multi-series pooling).

**본 논문과 어떤 관계인가**: TFT 의 직접 선구자. DeepAR 가 확립한 (i) LSTM 백본, (ii) 확률 예측, (iii) static covariate embedding 세 요소는 TFT 에 그대로 계승. 하지만 TFT 는 세 요소를 각각 확장 — (i) LSTM 위에 attention, (ii) parametric → non-parametric quantile, (iii) static 을 4-경로로 분산 주입. DeepAR 를 안 읽으면 TFT 의 architectural choice 가 왜 그렇게 되었는지 이해 어려움.

**무엇을 얻을 수 있는가**: (i) parametric vs non-parametric 확률 예측의 tradeoff 를 명확히 이해, (ii) 여러 시계열 shared parameter 학습 (multi-series pooling) 의 원조를 확인, (iii) P1 ProTran-TFA 에서 DeepAR baseline 을 어떻게 표시할지 원조 spec 확인. Fin-ts-dl 태그 후속 커버 후보.

## 경쟁 (1): Oreshkin et al. 2020, "N-BEATS: Neural basis expansion analysis for interpretable time series forecasting" — arXiv:1905.10437, ICLR 2020

**어떤 논문인가**: Element AI (지금 ServiceNow) 팀이 낸 stacked MLP block 모델. Attention 이나 LSTM 없이 순수 residual MLP block 을 stack 하고, 각 block 이 trend basis + seasonality basis 를 학습. Backward + forward residual 로 각 block 이 이전 block 의 오차만 predict. M4 competition (100k timeseries) 우승. Interpretability 는 basis 분해 (trend + seasonality) 를 통해 사전 설계로 확보.

**본 논문과 어떤 관계인가**: 거의 같은 시기 (2019) 의 경쟁자. TFT 와 정반대 정신 — TFT 는 covariate 을 최대한 활용, N-BEATS 는 univariate only. N-BEATS 의 interpretability 는 architectural constraint (trend + seasonality block), TFT 의 interpretability 는 gating + attention weight 시각화. 두 논문은 "interpretability 를 architecture 로 얻는" 계보의 서로 다른 두 갈래. Retail/Electricity 처럼 covariate 이 강한 데이터에선 TFT 가 이기지만, univariate M4-style 데이터에선 N-BEATS 가 여전히 강함.

**무엇을 얻을 수 있는가**: (i) interpretability 를 "사후 attribution" 이 아니라 "사전 architectural constraint" 로 확보하는 두 갈래 접근의 이해, (ii) univariate vs multivariate 성능 tradeoff 의 뿌리 확인, (iii) 후속 N-BEATSx (Olivares et al. 2022) 가 exogenous 를 붙여 gap 을 메운 방식. ts-transformer-baseline 태그 후속 커버 후보.

## 후속 (1): Wood, Lim, Zohren, Roberts 2022, "A Momentum Transformer for Time Series Momentum" — arXiv:2112.08534, *The Journal of Financial Data Science* 2022

**어떤 논문인가**: Bryan Lim (TFT 저자) 이 이후 Oxford-Man Institute 로 돌아가 Wood·Zohren·Roberts 와 함께 낸 TFT 의 금융 후계자. TFT 의 architecture (LSTM + interpretable attention + VSN) 를 그대로 futures momentum 전략에 이식. 50 개 futures (commodity/equity/rates/FX) × long history 학습, TSMOM (Moskowitz 2012) baseline 상회. TFT 의 5-tier 인터페이스 를 momentum 특화로 curate — static (asset class), known future (roll date), observed past (price/vol history), target (next-period return).

**본 논문과 어떤 관계인가**: TFT 의 직계 금융 후손. 저자 Bryan Lim 이 자신의 TFT 정신을 그대로 finance domain 에 이식. 사용자 자산 관점에서 P1 ProTran-TFA (paused) 와 direct 경쟁 — Momentum Transformer 가 이미 TFT-style 금융 확장을 했으므로 P1 draft 는 (i) 어떻게 다른지 (probabilistic + factor-selective), (ii) Momentum Transformer 를 어떻게 반박·확장하는지 를 명시적으로 서술해야 함.

**무엇을 얻을 수 있는가**: (i) TFT 의 5-tier 인터페이스가 금융에 이식될 때 무엇을 커스터마이즈했는지 확인, (ii) P1 ProTran-TFA 의 differentiation 을 어떻게 표현할지 필수 참조, (iii) 사용자 진로 (quant industry) 의 실무 활용 실증 확인 (JFDS 는 실무 저널). fin-ts-dl 태그 후속 커버 후보 — Deep RL for Trading (Zhang·Zohren·Roberts) 과 같은 Oxford-Man 계보 이지만 Zohren 저자 반복 규칙 (한 달 1회) 을 준수해서 2026-08 월 이후 커버 가능.
