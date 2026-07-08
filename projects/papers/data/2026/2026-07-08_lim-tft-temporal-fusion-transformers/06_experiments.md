# 5. 실험 해부

**배경 사다리**: 이 절을 이해하려면 (i) q-Risk 는 pinball loss 를 target 총합으로 정규화한 지표라는 것 (앞 절 참조), (ii) 실험은 대부분 P50 (중앙값) 과 P90 (상위 10% quantile) 두 quantile 을 보고, (iii) 낮을수록 좋다는 것만 알면 된다.

## 4-도메인 데이터셋 산문 해설

저자는 서로 다른 세 유형의 forecasting 문제를 대변하는 4 개 데이터셋을 벤치마크에 담았다. 각 데이터셋 선택은 특정 architecture 요소가 정말 유용한지 test 하는 의도적 표본.

### 1) Electricity (전력 소비)

- **어떤 데이터**: UCI Machine Learning Repository 의 Electricity Load Diagrams 20112014. 370 client 의 시간당 전력 소비 kW. 저자는 2014-01-01 이후 데이터 사용, 168 시간 (7 일) look-back, 24 시간 (1 일) forecast horizon.
- **왜 이 데이터가 이 논문의 주장에 적합한가**: (a) 시간별 관측치라 **hour-of-day, day-of-week 라는 강한 known future signal** 이 있음 — TFT 의 known future 경로가 진짜 유용한지 검증. (b) client 수가 많아 **static covariate (client ID) 로 인한 heterogeneity** 를 static covariate encoder 가 잡을 수 있는지 test. (c) 짧은 horizon (24h) 이라 attention 의 long-range 능력을 크게 요구하지 않음 — LSTM 이 기본 충분.
- **숨은 편향**: 이 데이터셋은 확립된 forecasting 벤치마크. 이미 여러 기존 논문 (DeepAR, MQ-RNN) 이 이걸로 성능을 튜닝한 상태 — 최신 논문이 이길 유리한 조건. Multiple testing 문제 (여러 논문이 같은 데이터셋에서 hyperparameter 튜닝을 반복하면 test set 오염).

### 2) Traffic (도로 점유율)

- **어떤 데이터**: UCI PEMS-SF 데이터셋. 샌프란시스코 베이 963 개 센서의 도로 점유율 (0 ~ 1 사이). 시간별 관측. Electricity 와 유사한 구조지만 target 이 [0,1] bounded 라 학습이 다르다.
- **왜 이 데이터**: Electricity 와 유사한 configuration 이지만 **target 성질이 다름** (bounded vs unbounded) — 확률 예측이 두 유형 모두에서 잘 작동하는지 test.
- **숨은 편향**: Traffic 도 forecasting 벤치마크 표준. 여기서도 multiple testing 문제.

### 3) Volatility (금융 실현 변동성)

- **어떤 데이터**: Oxford-Man Institute (OMI) Realized Library. 31 개 stock index (S&P 500, FTSE 100, Nikkei 225 등) 의 daily realized volatility 값. Look-back / forecast horizon 은 **"next week (5 business days)"** — WebSearch verbatim 확인.
- **왜 이 데이터**: (a) 금융 시계열은 **잘 알려진 fat-tail, heteroscedasticity** — 확률 예측의 진가가 발휘되어야 하는 영역. (b) known future signal 이 약함 (요일 효과는 있지만 강하지 않음, 예정 이벤트 정보 없음) — TFT 의 known future 경로가 이득 없어야 정직한 실험 (또는 그럼에도 이득이 있다면 static encoder 덕분). (c) 저자 Bryan Lim 이 당시 Oxford-Man 박사과정 — 이 데이터셋에 대한 domain expertise.
- **숨은 편향**: (a) 31 개 index 는 major economy 편중, emerging market fat-tail 커버 부족. (b) daily 관측이라 intraday microstructure 무시. (c) Realized volatility 는 이미 잘 알려진 잘 예측되는 (log-linear model 로 상당한 predictive power) 시계열 — 진짜 어려운 tail event 는 realized vol 이 잡기 전에 이미 발생.

### 4) Retail (Favorita Grocery Sales)

- **어떤 데이터**: Kaggle Favorita 대회 데이터셋. 에콰도르 슈퍼마켓 체인 매장 × 품목 × 일별 판매량. Static covariate (매장 위치, 품목 계열), known future (공휴일, 프로모션), observed past (지난 판매량, 유가). 90 일 look-back, 30 일 forecast horizon (WebSearch verbatim "30 days into the future, using 90 days of past information").
- **왜 이 데이터**: (a) TFT 가 설계된 정확한 use case — 세 종류 입력이 다 풍부. (b) 5-tier 인터페이스의 실전 검증. (c) 30 일 horizon 이라 attention 의 long-range 필요.
- **숨은 편향**: (a) Kaggle 데이터라 이미 leaderboard 최적화 상태. (b) 에콰도르 유가·정치 이벤트가 target 에 영향 — 지역 편중, 다른 나라 소매에는 일반화 어려움.

## 베이스라인 공정성

논문 §5 에 등장하는 baseline (WebSearch verbatim 인덱스로 확인, 정확한 hyperparameter 는 본문 확인 필요):

- **DeepAR** (Salinas et al. 2020) — LSTM + Gaussian/NB
- **MQ-RNN** (Wen et al. 2017) — LSTM encoder + MLP decoder, multi-quantile
- **ConvTrans** (Li et al. NeurIPS 2019) — locality-aware attention
- **Seq2Seq** — 표준 LSTM enc-dec
- **N-BEATS** (Oreshkin et al. ICLR 2020) — trend+seasonality basis
- **ARIMA / ETS** — 통계 baseline

**공정성 관찰**:
- 저자는 각 baseline 에 대해 자체 hyperparameter search 수행 (README 에 iter 수 명시: Volatility 240, Traffic 60, 기타 60).
- 하지만 baseline 원저자 tuning 이 아니라 TFT 저자 tuning 이라 baseline 이 원 논문 성능보다 낮게 나올 위험 (baseline 저자 vs TFT 저자의 tuning 자원 비대칭).
- N-BEATS 는 univariate 라 exogenous 정보를 활용 못 함 — 이건 TFT 의 유리한 조건이지 저자 선택은 아님.

## 지표 선택 정당성

- **q-Risk P50 & P90**: 실무에서 median forecast 와 tail forecast 를 관리한다 — 이 지표는 실무 지향적. 학술 baseline 비교에도 표준.
- **다른 지표였다면?**:
  - **CRPS (Continuous Ranked Probability Score)**: 전체 CDF 를 하나로 요약. MOIRAI, TimesFM 이 CRPS 를 표준으로 사용. TFT 는 CRPS 를 안 쓴 게 이후 계보에서 metric 통일성을 해쳤음.
  - **Coverage (P90 이 실제로 90% cover?)**: quantile 이 진짜 correct calibrated 인지 검증. TFT 는 이걸 명시적으로 보고 안 함 — pinball loss 자체가 좋아도 calibration 이 나쁠 수 있음.
  - **MAE / RMSE**: point forecast 지표. Quantile forecasting 세팅에는 부차.

## 주요 결과 (본문 표 정확 값은 단정 안 함)

WebSearch verbatim 인덱스 verbatim: "TFT outperforms competing methods across experiments, improving on the next best alternative method between 3% and 26%." + "on the original paper's electricity, traffic, and retail datasets, TFT surpassed the next-best deep model (N-BEATS) by 7-14% in quantile loss and classical methods by >30%."

정확한 P50 / P90 quantile loss 소수점 값과 Table 1-4 절대 수치는 본문 PDF 차단으로 단정 안 함. MQTransformer 논문 (KDD MILETS 2022) Table 9 에 재보고된 값이 있지만 그건 MQTransformer 저자의 재현 결과이며 원 논문 값과 완전 일치를 보장 못 함.

## Ablation

저자가 §5 (본문 확인 필요) 에서 다음 요소 제거 실험을 수행했을 것으로 예상 (README 및 architecture 논리로부터 재구성):

1. **VSN 제거** (concat + shared GRN 만): 변수 중요도 통로 부재. 성능 저하 예상.
2. **Static covariate encoder 4-경로 → 1-경로 (예: initial state 만)**: DeepAR 스타일. Static-dynamic 상호작용 축소.
3. **Interpretable MHA → standard MHA**: interpretability 통로 없음. 저자 주장이 "성능 차이는 미미" — 하지만 표 확인 필요.
4. **LSTM 제거**: attention-only. 국소 처리 손실. iTransformer 방향.
5. **Quantile head → point forecast + gaussian**: DeepAR 스타일. Pinball 대신 log-likelihood.

원문 표 정확 수치와 어떤 ablation 이 실제로 수행되었는지는 본문 PDF 확인 필요.

## 부록에 숨은 신호

Github README + WebSearch 인덱스로부터 추정한 부록 신호:
- **Hyperparameter grid**: Volatility 240 iter, Traffic 60 iter, others 60 iter default. iter 수 차이 = Volatility 가 hyperparameter 에 더 민감함을 시사 (fat-tail 데이터에서 튜닝이 중요).
- **Random search**: script_hyperparam_opt.py 가 random search. Grid search 아님 — 자원 절약.
- **Data preprocessing**: script_download_data.py 가 각 도메인별 preprocessing pipeline 을 담고 있음. 각 도메인 preprocessing 이 성능에 큰 영향 — 재현 시 원저자 script 를 그대로 써야 함.

## 수치 투명성

- 정확한 P50/P90 quantile loss 소수점 값: **원문 표 미확인, 단정 안 함**.
- N-BEATS 대비 개선율: WebSearch verbatim "7-14% quantile loss improvement over N-BEATS".
- 통계 baseline 대비 개선율: WebSearch verbatim ">30% over classical methods".
- Seed variance: **원문에 명시 여부 확인 필요**. 만약 없다면 재현성 감점 요소.

## 정리

4-도메인 벤치마크는 TFT 아키텍처의 **일반화 가능성** (전력/도로/금융/소매 전 도메인에서 이김) 을 강하게 지지한다. 다만 (i) baseline hyperparameter 튜닝 자원 비대칭, (ii) CRPS/coverage 같은 calibration metric 부재, (iii) seed variance 보고 상태 불명 — 세 gap 이 재현성/일반화 강도의 상한을 정한다.
