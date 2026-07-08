# 6. 가정·한계·반박

## 명시된 가정 (저자가 대놓고 말한 것)

1. **입력 typology 사전 라벨**: 데이터에 static covariate / known future / observed past 가 이미 라벨링되어 있다는 것. 저자는 이 라벨이 "domain expert 가 제공" 이라고 명시. 예: Retail 의 "이 변수는 known future 입니다" 라는 정보는 저자가 수동으로 붙임.

2. **Quantile 이 서로 순서 지켜짐 (implicit assumption of no crossing)**: 여러 quantile head 를 독립 학습하지만, quantile crossing 은 실전에서 심각하지 않다는 낙관 — 저자가 이를 명시적 constraint 로 강제 안 함.

3. **관측 시계열의 stationarity 는 요구 안 함**: 반대로 non-stationarity 를 architecture 로 커버하겠다는 정신. 특히 quantile 예측이 heteroscedasticity 를 자연스럽게 흡수한다는 주장.

4. **GLU gate 가 데이터에 따라 열고 닫힌다**: GRN 의 gate 가 진짜 학습 데이터 복잡도에 반응 — 이는 저자의 architecture 정신 명시. 그러나 gate activation 분포는 논문에서 정량적으로 안 보여줌 (본문 확인 필요).

## 암묵적 가정 (말 안 했지만 깔려 있는 것)

1. **Attention weight = 중요도**: Jain-Wallace 2019 (attention is not explanation) 이 지목한 정확한 가정. TFT 의 "interpretable" 이란 이름표는 head 평균 attention weight 를 시간 중요도 로 시각화 가능하다는 것이지, causal intervention (예: 시점 $t$ 의 특정 변수를 강제로 0 으로 두면 예측이 어떻게 바뀌나) 을 수행한 것이 아니다. 즉 correlation-attribution 수준.

2. **VSN weight = 변수 중요도**: 위와 같은 attention-as-explanation 논리의 변수 축 판. VSN weight 이 softmax 라 합 1 이고 모든 변수를 다 무시할 수 없다. 만약 실제로 모든 변수가 무의미해도 softmax 는 하나에 몰아준다 — spurious attribution 위험. 또, correlated 변수는 weight 이 나뉘어 저평가.

3. **LSTM 이 유익하다**: TFT 는 LSTM 을 attention 앞에 놓는데, iTransformer (Liu 2024) 는 반박했다 — attention-only 로도 (variate-wise inverted attention 을 통해) 동등 이상. TFT 아키텍처는 LSTM 필요성을 정면 검증한 실험이 부족.

4. **Static covariate 4-경로 주입이 필요**: 그 중 어느 경로가 실제 성능에 기여하는지 4-way ablation 이 필요한데, 논문 §5.4 에서 부분 커버 (확인 필요). 이론적 정당화 없음.

5. **표준 forecasting 벤치마크는 tail 이 심하지 않다**: OMI Volatility 를 제외하면 Electricity/Traffic/Retail 은 상대적으로 well-behaved. 진짜 tail-heavy (예: crypto price, VIX spike) 에서 quantile 예측이 잘 작동하는지는 별도 검증 필요.

## 반박 가능한 지점

### 반박 1: "Interpretable" 라는 이름표는 attention-is-not-explanation 반박에 그대로 노출

**핵심 주장**: 저자는 attention weight + VSN weight 를 "interpretable" 이라고 부르지만, 이는 correlation-attribution 이지 causal 이 아니다. Jain-Wallace 2019 는 (i) attention weight 와 gradient-based feature importance 의 Kendall τ 상관이 낮음, (ii) attention weight 을 permute 해도 예측이 크게 바뀌지 않는 counterexample 이 존재, 두 반박으로 attention-as-explanation 을 흔들었다. TFT 의 interpretable MHA 는 head 평균이라도 같은 반박에 노출.

**실험적 검증 방법**:
- **Attention permutation counterexample**: Volatility 데이터에서 TFT 학습 후, 특정 지평의 attention weight 를 random permute 하고 예측 변화를 관찰. 예측이 크게 안 바뀌면 attention 이 "설명" 이 아님을 시사.
- **Path patching (Wang 2023 IOI Circuit 스타일)**: attention head 를 causal intervention 대상으로 삼아 sender-receiver Q/K/V freeze 실험을 TFT 에 적용. 어떤 head 를 masking 하면 quantile 예측이 얼마나 바뀌는지 정량화.
- **ACDC 적용**: Conmy 2023 의 ACDC 를 TFT 에 실행해 진짜 causal circuit 을 발견 — attention weight 가 지목한 곳과 일치하는지 검증.

### 반박 2: LSTM 층이 진짜 필요한가

**핵심 주장**: TFT 는 LSTM encoder-decoder 위에 attention 을 얹는 hybrid. 하지만 iTransformer 2024 (2026-05-06 커버) 는 attention-only 로도 (variate-wise inverted) 우수한 성능. LSTM 이 실제 성능 기여도 최소일 가능성. Post-LSTM GLU gate 가 열려 있다면 LSTM 이 쓰인 거지만, gate 가 닫혀 있다면 LSTM 이 사실상 skip 됨 — 이 gate activation 분포를 논문이 안 보여줌.

**실험적 검증 방법**:
- **LSTM removed ablation**: LSTM 층을 제거하고 VSN 출력 → static enrichment → attention 직접 연결. 성능 변화를 도메인별로 관찰.
- **Post-LSTM gate activation histogram**: 학습된 TFT 의 GLU gate output 을 도메인별로 히스토그램. 0 에 몰려 있으면 LSTM 이 skip 되는 셈.
- **Attention-only 대안 (iTransformer 스타일)**: LSTM 을 attention 층으로 대체하고 같은 benchmark 재실행. Wall-clock 및 성능 비교.

### 반박 3: Quantile crossing 을 architecture 로 강제 안 함

**핵심 주장**: TFT 는 여러 quantile head 를 독립 output 으로 뽑고 pinball loss 로 각각 학습. 하지만 quantile 은 monotone 이어야 한다 (P90 ≥ P50 ≥ P10). 학습 결과 이 monotone 을 강제하는 mechanism 없어 crossing 발생. TimesFM v2.5 (2025) 가 `fix_quantile_crossing=True` 옵션을 도입한 것은 이 문제가 실제 issue 임을 후향적으로 입증.

**실험적 검증 방법**:
- **Crossing rate 측정**: 학습된 TFT 예측에서 test set 상 quantile crossing (예: P90 예측치 < P50 예측치) 이 얼마나 자주 발생하는지 %.
- **Monotone constraint 도입 실험**: quantile 을 사전 정렬 (cumulative softplus 등) 으로 monotone 강제하는 alternative head 를 학습해 crossing rate 0 이 되지만 pinball loss 가 어떻게 바뀌는지 비교.

## 재현성 평가

- **코드 공개**: `google-research/google-research/tft` (Apache-2.0, TF1.x). 매우 공개적, 4-도메인 스크립트 완비.
- **데이터 공개**: Electricity (UCI), Traffic (UCI), OMI Volatility (오픈 라이브러리), Favorita (Kaggle). 모두 공개.
- **논문에 안 나온 디테일**: (i) preprocessing 정확 수순 (log 변환 여부, normalization scheme), (ii) seed 통계 σ (여러 seed 로 실험 반복 여부 논문에서 명시 확인 필요), (iii) hyperparameter 최종 값 (README 는 "random search 로 뽑음" 만 언급, 최종 값은 configuration 파일에 있음).
- **평균만 vs 분산도**: WebSearch 인덱스로부터 원 논문이 seed variance 명시적 보고 여부 확인 필요. 만약 안 했다면 감점.
- **재현체**: PyTorch Forecasting, Nixtla neuralforecast, Darts 등 4-5 개 재현체 존재. 이들 재현체 성능이 저자 원본 재현체와 일치하는지는 최근 벤치마크 논문 (Godahewa 2021 등) 이 검증한 자료 참고.
