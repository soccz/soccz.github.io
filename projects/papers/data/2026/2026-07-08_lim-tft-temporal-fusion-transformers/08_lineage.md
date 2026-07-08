# 7. 이론적 계보

## 이론적 조상 (직접 계승 관계)

### 1) Vaswani et al. 2017, "Attention Is All You Need" (사용자 사전 독파 arXiv:1706.03762)

TFT 의 multi-head attention block 은 vanilla Transformer 의 표준 형식을 그대로 계승. Query/Key/Value projection, softmax scaled dot-product, LayerNorm + residual — 모두 Vaswani 로부터. TFT 의 차별 지점은 (i) sinusoidal PE 없이 LSTM 이 순서 정보 제공, (ii) head 별 $W^V_h$ 를 shared $W_V$ 로 두는 interpretable 변형, (iii) attention 앞뒤로 static enrichment / GLU gate 를 추가한 것. Vaswani 없이는 존재할 수 없는 논문이면서, "Attention Is All You Need" 라는 급진적 정신을 (LSTM 위에 얹는) 온건화로 완화한 사례.

### 2) Sutskever et al. 2014 / Cho et al. 2014, "Sequence to Sequence Learning"

Encoder-decoder LSTM 의 원조. TFT 의 seq2seq LSTM 인코더-디코더 구조는 이 계보의 직접 계승. Sutskever 2014 는 "encoder 의 마지막 hidden state 를 decoder 의 initial state 로 넘김" 을 확립 — TFT 도 정확히 이를 채택하되, 그 initial state 에 static covariate encoder 로부터 온 $c_c, c_h$ 를 조건화 신호로 얹음.

### 3) Salinas et al. 2020, "DeepAR" (JIF 2020)

TFT 의 직접 경쟁자이자 선구자. DeepAR 는 (i) LSTM 백본 + parametric output (Gaussian/NB), (ii) static covariate 을 embedding 후 hidden state initial condition 으로 주입, (iii) 확률 예측 정신. TFT 는 이 셋을 모두 유지하되 (i) LSTM 에 attention 추가, (ii) static 주입을 4-경로로 확장, (iii) parametric 대신 non-parametric quantile head 로 확장. DeepAR 없이 TFT 의 architectural choice 는 없다.

### 4) Wen et al. 2017/2018, "MQ-RNN / MQ-CNN" (WWW 2018 / arXiv:1711.11053)

Multi-quantile + multi-horizon direct forecast 를 처음 확립한 논문. Amazon Wen et al. 이 pinball loss + quantile head 를 시계열에 도입. TFT 의 quantile output + pinball loss 는 MQ-RNN 의 직접 계승. TFT 는 이 위에 attention 과 VSN 을 추가.

## 평행 연구 (같은 시기, 다른 접근)

### 1) N-BEATS (Oreshkin et al. ICLR 2020, arXiv:1905.10437)

TFT 와 거의 같은 시기 (2019). Basis expansion (trend + seasonality) 을 학습하는 stacked MLP block. Attention 없이 M4 competition 우승. **왜 TFT 가 이겼나 (또는 왜 못 이겼나)**: N-BEATS 는 univariate only — exogenous 정보 (known future, observed past, static) 를 못 씀. Retail/Electricity/Traffic 처럼 covariate 이 강한 데이터에선 TFT 가 이김. 반대로 univariate 만 있는 M4-style 데이터에서는 N-BEATS 가 여전히 강함. 후속 N-BEATSx (Olivares et al. 2022) 가 exogenous 를 붙여 이 gap 을 부분 메움.

### 2) ConvTrans (Li et al. NeurIPS 2019, arXiv:1907.00235 — 사용자 사전 독파)

Locality-aware attention (LogSparse + causal conv Q/K/V) 로 시계열에 attention 을 정착. TFT 의 attention 은 이 정신을 상속하되, LogSparse 같은 attention sparsity 는 안 씀 — 대신 look-back window 자체를 짧게 (168h, 90 days) 두어 quadratic cost 를 관리. **왜 TFT 가 이겼나**: ConvTrans 는 attention 만 강조하고 static/known-future typology 부재. TFT 는 architecture 수준의 typology 로 승부.

### 3) Informer (Zhou et al. AAAI 2021, arXiv:2012.07436 — 사용자 사전 독파)

TFT 논문 직후 등장. ProbSparse attention 으로 long-sequence forecasting 을 겨냥. 서로 다른 목표 — TFT 는 covariate 활용 + interpretability, Informer 는 long-sequence attention 효율성. 직접 경쟁 아님. 다만 이후 forecasting transformer 논문들이 두 계보 (interpretability vs efficiency) 로 갈라짐.

### 4) Deep AR + attention (Rangapuram et al. 2018 등)

DeepAR 저자 그룹이 attention 을 붙이는 여러 실험을 진행. TFT 와 유사한 정신이지만 architecture 통합이 덜 정돈. 결과적으로 TFT 가 더 인기.

## 후손 예측 (파생 연구 방향)

### 1) MQTransformer (Eisenach et al. Amazon, arXiv:2009.14799)

Amazon 이 MQ-RNN 을 attention 으로 확장 — TFT 와 유사한 정신. TFT 등장 이후 MQ 계열 진화 방향. Context-dependent attention + Bregman volatility. 실제 후속작으로 등장.

### 2) Temporal Fusion Transformer + Conformal Prediction

Conformal prediction 은 학습 후 calibration set 으로 marginal coverage 를 보장. TFT quantile + conformal 조합은 실무에서 예측 구간의 신뢰 보장 확보. 여러 논문 (예: 2023-2025) 이 이 방향.

### 3) TFT + Foundation Model (fine-tune from Chronos/TimesFM)

Chronos, TimesFM 같은 foundation model 이 pretrained representation 을 제공. TFT 의 5-tier 인터페이스 (VSN/static/quantile) 를 fine-tuning head 로 얹는 것 — 특히 소량 데이터의 domain-specific forecasting.

### 4) Momentum Transformer (Wood·Lim·Zohren·Roberts, arXiv:2112.08534, JFDS 2022)

Bryan Lim 이 이후 TFT 정신을 그대로 금융 (specifically futures momentum) 에 이식. LSTM+attention + Variable Selection Network + interpretable weights 를 그대로 옮겨 futures return 예측. TFT 의 직계 후손. 2026-07-03 커버 Deep RL for Trading (Zhang·Zohren·Roberts) 과 같은 Oxford-Man 계열 lineage.

### 5) Interpretable TS Foundation Models (Concept Bottleneck TS, Sprang 2024)

TFT 의 "architecture 로 해석 통로 심기" 정신을 foundation model 시대로 이식하는 연구. Priority 목록의 arXiv:2410.06070 (Sprang·Acar·Zuidema Concept Bottleneck for TS Transformers) 이 대표. 향후 tsfm-interp 태그로 커버할 논문.
