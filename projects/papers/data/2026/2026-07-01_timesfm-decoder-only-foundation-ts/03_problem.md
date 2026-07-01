# 03. 문제 지형도

## 배경 사다리

이 절을 이해하려면 세 개의 개념만 미리 알면 된다. ① **시계열 예측(time-series forecasting)** 은 "지난 값들을 보고 앞으로의 값을 맞추는 문제"라는 것. ② **zero-shot** 이란 "학습에 쓰지 않은 새 데이터에 손대지 않고 바로 예측하는 것" — 반대말은 "각 데이터에 맞춰 다시 학습하는 supervised". ③ **파운데이션 모델(foundation model)** 은 "한 번 크게 만들어두고 여러 downstream task 에 재사용하는 대형 모델"이라는 것. GPT · CLIP · DINO 같은 것들이 대표다.

## 이 논문이 푸는 실제 문제

시계열 예측이 현실에서 어떻게 등장하는지 예시 3개.

- **상황 1: 소매업 판매 예측.** 어떤 대형 유통사가 상품 100만 개의 다음 4주 판매량을 매주 예측해야 한다. 지금은 상품별로 (혹은 상품군별로) SARIMA 나 LightGBM 을 하나씩 붙여 학습한다. 상품 하나 죽고 새 상품이 들어오면 처음부터 다시 학습해야 한다. 학습 인프라가 상시 회전해야 하고, 새 상품에 첫 예측이 나오기까지 시간이 걸린다.
- **상황 2: 인프라 용량 계획.** 데이터센터 팀이 각 서비스의 시간당 트래픽을 예측해서 서버 오토스케일링을 설정한다. 서비스가 수천 개인데 각 서비스가 서로 다른 주기·트렌드·계절성을 가진다. 서비스별 모델을 학습·모니터링·재학습하는 비용이 서비스 개수에 비례해서 커진다.
- **상황 3: 재무·수요 예측.** 재무팀이 매출·비용·현금흐름 등 수백 개의 월간·분기 시계열을 예측한다. 데이터가 짧고 (수십 관측치), 서비스별 커스텀 모델을 붙일 만큼의 표본이 없다.

세 상황의 공통 짐(pain) 은 **"모델을 시계열 개수만큼 곱해서 유지해야 한다"**. 한 시계열 당 한 모델은 학습 비용도 유지 비용도 시계열 수에 비례한다.

**언어·이미지·비디오 분야는 이 짐을 이미 해결했다.** GPT/T5/PaLM 은 한 번 사전학습하고 downstream 에 zero-shot / few-shot 으로 던진다. CLIP/DINO/MAE 는 이미지 pretraining backbone 을 다양한 downstream 에 재사용한다. **왜 시계열은 이런 파운데이션 모델을 못 만들었는가?** 이 논문의 문제 정의가 이 물음이다.

## 기존 접근 계보 (연대순)

### (A) Classical statistical baselines (1970s–2010s): ARIMA / ETS / Prophet

- **무엇이었나**: Box-Jenkins ARIMA (자기회귀 이동평균), state-space ETS (지수평활), Facebook Prophet (선형 트렌드 + Fourier seasonality). 시계열마다 파라미터를 최대가능도(MLE) 로 학습.
- **왜 부족했나**: 각 시계열이 자체 학습을 요구 → 시계열 수 만큼 fit; 비선형 상호작용·복잡 seasonality 어려움; regime shift 취약.
- **교훈**: seasonality prior 를 명시적으로 넣는 것은 강력하다 (Prophet 의 성공). → TimesFM 이 **frequency indicator** 로 이 prior 를 조건화하는 아이디어의 원류.

### (B) Global deep learning models (2017–2020): DeepAR / N-BEATS / N-HiTS

- **무엇이었나**: DeepAR (Salinas et al. 2019, RNN + Gaussian/NegBin likelihood, Amazon), N-BEATS (Oreshkin et al. ICLR 2020, deep MLP stack + basis expansion), N-HiTS. "많은 시계열을 한 모델에" 라는 첫 시도 — 다만 여전히 dataset-specific.
- **왜 부족했나**: pretraining 이 아니라 dataset-specific supervised 학습. 데이터셋을 바꾸면 처음부터 재학습. 하지만 "하나의 신경망이 수천 개 시계열을 동시에 학습" 하는 mental model 을 정립.
- **교훈**: multi-series 학습이 지금까지의 시계열 예측 통념을 깼다. 이 통념을 한 걸음 더 밀면 "여러 dataset 을 한꺼번에 학습" 이 된다. TimesFM 의 pretraining 스케일 발상.

### (C) Attention-based long-horizon TS (2020–2023): Informer / Autoformer / FEDformer / PatchTST / iTransformer

- **무엇이었나**: Long-horizon TS forecasting benchmark (ETT, Weather, Traffic, Electricity) 에서 Transformer 를 시계열에 맞게 개조하려는 흐름. Informer (ProbSparse), Autoformer (auto-correlation), FEDformer (frequency-enhanced), PatchTST (Nie et al. ICLR 2023 — **패치를 토큰으로**), iTransformer (Liu et al. ICLR 2024 — **변수를 토큰으로**).
- **왜 부족했나**: 여전히 dataset-specific supervised. 각 벤치마크에 학습해야 함. 그러나 PatchTST 가 정확히 "패치를 토큰으로 취급" 이라는 TimesFM 의 핵심 트릭을 supervised 세팅에서 검증. → TimesFM 은 이 트릭을 pretraining scale 로 밀어올린 것.
- **교훈**: patching 은 시계열 Transformer 의 필수 문법. Point-wise attention 은 T² 비용이라 long context 에서 죽지만 patch-wise attention 은 (T/p)² 로 감당 가능.

### (D) First-generation TSFM 시도 (2023): LagLlama / MOMENT / GPT4TS-family

- **무엇이었나**: LagLlama (Rasul et al. 2023, univariate probabilistic, StudentT head), MOMENT (Goswami et al. ICML 2024, encoder-only + masking), GPT4TS/OFA (Zhou et al. NeurIPS 2023, LLM 백본을 시계열에 재활용).
- **왜 부족했나**: LagLlama 는 확률 예측을 지향했지만 단일 StudentT 로 다양한 도메인의 heteroscedasticity 를 뭉툭하게 다룸 (MOIRAI 2024 가 반박). MOMENT 는 encoder-only 라 zero-shot 예측이 masked reconstruction 을 통해서 간접적. GPT4TS 는 LLM 파라미터를 얼려서 재활용하는 방식이 정말 시계열에 유효한지 나중에 Tan 2024 NeurIPS Spotlight 가 반박 ("LLM 백본은 무용, single random-init attention layer 로 대체 가능").
- **교훈**: encoder-only vs decoder-only, 단일 분포 vs 혼합 분포, LLM 재활용 vs 처음부터 학습 등 여러 갈래가 열려 있었다. TimesFM 은 **decoder-only + 처음부터 학습 + point forecast 우선** 조합을 택하고, 이 조합의 실전 성능을 실증.

### (E) 동시대 경쟁 (2024–): Chronos / MOIRAI / VisionTS / Moment 후속

- **무엇이었나**: Chronos (Ansari et al. 2024, TMLR — 시계열 값을 tokenize 해서 T5 encoder-decoder 에 넣음), MOIRAI (Woo et al. ICML 2024 Oral — masked encoder + Any-Variate Attention + 4-mixture distribution, LOTSA 27.6B 9-domain), VisionTS (Chen et al. ICML 2025 — TS 를 이미지로 reshape 해서 frozen MAE 로 예측).
- **왜 부족했나** (역으로): Chronos 는 값 이산화 손실 + T5 encoder-decoder 비용; MOIRAI 는 masked encoder 라 next-patch autoregressive 대비 실시간 inference 살짝 무거움; VisionTS 는 single-periodicity reshape 이 aperiodic 시계열에 취약.
- **교훈 (TimesFM 관점)**: 자기 자신은 **가장 minimalist 한 골격 (decoder-only + patching + real-value regression head)** 을 유지 — 여기가 왜 "존재 증명 (existence proof)" 로 가치가 있는지의 근거.

## 공통 gap 한 문장

**"시계열 예측을 위한 언어 모델급 파운데이션 모델은 존재 가능한가 — decoder-only Transformer 를 patching 트릭으로 이식하고 100B time-points 규모로 사전학습하면 정말로 zero-shot 성능이 dataset-specific supervised 수준까지 올라가는가?"** 이 질문은 언어·이미지 분야에서는 이미 실증적으로 "yes" 였지만, 시계열은 (i) domain (retail/finance/climate/…) 별 통계 특성이 매우 다양하고 (ii) 표본 길이가 짧아 pretraining scale 을 확보하기 어려우며 (iii) "언어의 vocabulary" 에 해당하는 이산화 단위가 자명하지 않다는 이유로 오래도록 미해결이었다.

## 이 논문이 그 gap 을 메우는 방식

TimesFM 은 **패치 = 토큰** 등가로 언어 모델 문법을 시계열에 이식하고, Google Trends + Wikipedia pageviews 라는 대규모 (100B time-points) real-world corpus 로 사전학습해서 위 세 어려움을 각각 우회한다. (i) domain 다양성 → corpus 다양성으로 흡수, (ii) 짧은 시계열 → 각 시계열의 patch 단위로 sample 을 늘려 학습 신호 확보, (iii) 이산화 vocabulary → **이산화를 아예 안 하고 real-valued residual block 임베딩** 으로 우회. 결과적으로 "존재 증명" 을 완성 — supervised SOTA 근처 zero-shot 성능. 이 존재 증명은 이후 Chronos·MOIRAI·VisionTS 등 대안 골격들의 벤치마크가 되는 baseline 을 확립한다.
