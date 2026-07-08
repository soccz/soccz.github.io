# 2. 문제 지형도

**배경 사다리**: 이 절을 이해하려면 (i) "시계열 예측"이 지난 관측으로 미래 관측을 맞추는 문제라는 것, (ii) "multi-horizon"이란 한 시점만이 아니라 앞으로 여러 스텝을 한꺼번에 예측하는 세팅, (iii) "quantile 예측"이란 "정확히 얼마"가 아니라 "10%~90% 구간이 얼마"까지 답하는 형태 — 이 셋만 알면 된다.

## 현실에서 이 문제가 어떻게 생기는가

- **에너지 수급 (Electricity)**: 발전소 운영자가 "내일 오후 3-4 시 전력 소비량이 얼마일지"를 지금 결정해야 한다. 정확히 맞추면 좋고, 못 맞추면 발전기를 급하게 켜야 하거나 발전량이 남아 낭비된다. 단순 point forecast (평균 하나)는 "얼마나 대비해야 하는지"를 알려주지 못한다. P90 (상위 10% 확률 상한) 을 알아야 예비 발전을 얼마나 준비할지가 정해진다. 입력은 (i) 이 지역의 인구·산업 구성 같은 정적 정보, (ii) 내일 요일·공휴일 같은 예정된 미래 정보, (iii) 과거 소비 실적·기온 같은 지연 관측 정보로 뒤섞여 있다.

- **소매 재고 관리 (Favorita Retail)**: 슈퍼마켓 체인이 30 일 뒤 매장별·품목별 판매량을 예측해 재고를 발주해야 한다. 상점 위치·개설 연도 같은 static, 예정된 세일·공휴일 같은 known future, 최근 30-90 일 판매량 같은 observed past, 세 축이 다 필요하다. 게다가 지평이 짧을 때 (내일)와 길 때 (30 일 뒤)의 신뢰 구간 크기가 다르다.

- **금융 변동성 예측 (OMI Realized Volatility)**: 옵션 트레이더나 리스크 매니저가 지수의 "다음 주 실현 변동성" 을 예측해 헤지 규모를 정한다. 실현 변동성은 뚱해 있다 폭발하는 fat-tail 분포라 point forecast 로는 리스크 관리가 안 된다. 지수 자체의 정적 정보 (해당 시장 규모·거래시간), 예정된 이벤트 (FOMC·실적 발표), 과거 실현 변동성 시계열이 뒤섞인다.

세 예시의 공통점: **입력이 세 종류로 이미 분리 가능** 하지만, 기존 모델들이 이 분리를 제대로 활용 못 했다.

## 기존 접근 계보 (연대순 이정표)

### (1) ARIMA / ETS — 통계 forecasting 표준 (1970-2000s)

Box-Jenkins ARIMA (자기회귀누적이동평균)와 ETS (Exponential Smoothing 지수평활)는 forecasting 도메인의 표준. 시계열 하나에 대해 자기 자신의 과거만 회귀. 세 축의 입력을 구분해서 조건화하는 방법 없음. 다변량 확장 (VAR/VARMA)은 있지만, 그것도 "정적 vs 동적" 을 구분 안 함. **놓친 것**: 입력 typology. **남긴 교훈**: 통계 기반의 명료한 quantile forecast (Holt-Winters + 정규 오차 가정 등)는 딥러닝 이전의 자연스러운 확률 예측이었다.

### (2) DeepAR (Salinas et al. 2017/2020) — 첫 확률적 딥 forecasting

Amazon SageMaker 에 채택된 DeepAR (Salinas·Flunkert·Gasthaus·Januschowski). LSTM 백본으로 각 시점에 Gaussian/Negative Binomial 파라미터를 낸 뒤 autoregressive sampling. **놓친 것**: (i) known future input 구별 없음 — 미리 아는 공휴일도 그냥 과거 시계열처럼 취급, (ii) static covariate 는 embedding 후 initial hidden state 로만 주입 (경로 하나만), (iii) 특정 parametric family (Gaussian/NB) 가정 필요. **남긴 교훈**: 다중 시계열 (예: 여러 상점 × 여러 품목)에서 shared parameterization 의 힘.

### (3) MQ-RNN / MQ-CNN (Wen et al. 2017) — Multi-horizon Multi-quantile

Amazon Wen et al. 의 MQ 계열은 encoder (LSTM/CNN) + decoder MLP 로 여러 quantile 을 direct multi-horizon (autoregressive 없이 한 번에 모든 horizon 병렬) 예측. Quantile 을 직접 head 로 뽑는 point 를 처음 확립. **놓친 것**: static / known-future / observed-past 세 typology 분리 API 없음. Attention 없이 LSTM/CNN 이 담당. **남긴 교훈**: multi-horizon direct forecast 의 우수성 (autoregressive 오차 누적 회피), pinball loss 의 실전 유효성.

### (4) ConvTrans (Li·Jin·Xuan et al. NeurIPS 2019) — Transformer 로 시계열 forecasting 진입

Locality-aware attention 을 시계열에 적용. Vaswani 2017 attention 을 forecast 지평까지 확장. Attention 을 시계열에 처음 정착시킴. **놓친 것**: 여전히 raw multivariate 를 flatten 해서 넣음, static 분리 없음. **남긴 교훈**: 시계열에도 self-attention 이 잘 작동한다 — 특히 long-range 의존성 포착.

### (5) N-BEATS (Oreshkin et al. ICLR 2020) — MLP-block 계보

Trend + Seasonality basis 분해를 학습하는 stacked MLP block. Attention 없이도 M4 competition 우승 수준. Interpretable (trend/seasonality) block 을 명시 설계. **놓친 것**: (i) univariate only, exogenous input 지원 부재 (후속 N-BEATSx 이 이를 채움), (ii) static covariate 없음. **남긴 교훈**: interpretability 는 architectural choice — 즉 사후 attribution 이 아니라 사전 설계로 얻을 수 있다. TFT 는 이 정신을 흡수해 "gating + attention weight = 사전 설계 해석 통로" 를 채택.

### (6) 도메인별 hand-crafted forecasting (2019 이전 industry)

전력·소매 각 도메인은 자체 hand-crafted feature (weather regression, promotional lift model, holiday effects) + tree ensemble (LightGBM) 을 오랫동안 사용. 도메인 지식이 없으면 딥 모델이 못 따라잡는 상태. **남긴 교훈**: forecasting 은 domain covariate handling 이 절반 이상 결정 — 이 논문이 겨냥한 지점.

## 공통 gap 한 문장

**"기존 딥 모델들은 입력의 이질성 (static / known-future / observed-past) 을 architecture 수준에서 구별하지 않았고, 그 결과 확률 예측과 해석 가능성을 동시에 얻지 못했다."**

## 이 논문의 gap 메우기 전략

TFT 는 입력을 **5-tier 인터페이스**로 architecture 에 새겨 넣는다:
1. Static covariate (시간 불변) → 별도 static covariate encoder → 4 개 context 벡터 $c_s, c_c, c_h, c_e$ 로 분해 → 네트워크 전체에 조건화.
2. Known future input → 각 시점 VSN 을 지나 decoder LSTM 으로.
3. Observed past → 각 시점 VSN 을 지나 encoder LSTM 으로.
4. Target → 과거 target 자체도 observed 과거의 한 축.
5. Horizon index → decoder 위치.

이 typology 위에 (i) GRN 으로 gating-based skip, (ii) interpretable multi-head attention 으로 head 별 attention 을 하나로 합쳐 시간 중요도 시각화, (iii) VSN weight 로 변수 중요도 시각화, (iv) 다중 quantile head 로 확률 예측, 네 층을 얹어 "성능 + 해석 + 확률" 을 한 모델로 봉합.
