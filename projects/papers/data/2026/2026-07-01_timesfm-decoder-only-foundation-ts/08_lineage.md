# 08. 이론적 계보

## 배경 사다리

이 절은 TimesFM 을 앞뒤로 놓인 논문들과 잇는 도로 지도. 조상 4편 → TimesFM → 평행 4편 → 후손 3편 순으로 배치.

## 이론적 조상 4편

### 조상 1: Vaswani et al. 2017 — "Attention Is All You Need" (NeurIPS 2017)

- **연결선**: Transformer 골격의 원 부모. Causal multi-head self-attention + FFN + layer normalization 의 3-요소는 TimesFM 이 그대로 이식. decoder-only 구조는 GPT (Radford et al. 2018) 계열이 세부화한 변형.
- **왜 이 논문이 TimesFM 의 핵심 근거인가**: Vaswani 는 텍스트를 사례로 attention 만으로 sequence 학습이 가능함을 실증. TimesFM 은 텍스트 대신 시계열 patch 를 넣어 동일 골격이 시계열에도 통함을 실증. 즉 TimesFM 은 "Transformer 는 modality-agnostic" 라는 가설의 시계열 판.

### 조상 2: Nie et al. 2023 — "A Time Series is Worth 64 Words: Long-term Forecasting with Transformers (PatchTST)" (ICLR 2023, arXiv:2211.14730)

- **연결선**: **패치 = 토큰** 문법의 시계열 원조. PatchTST 는 supervised 세팅에서 이미 patch length $p=16$ (또는 12/8) 을 실증하고, patch-wise attention 이 point-wise attention 보다 (i) 계산 비용, (ii) 성능 양쪽에서 우수함을 보임.
- **왜 이 논문이 TimesFM 의 핵심 근거인가**: TimesFM 은 PatchTST 의 patching 트릭을 **pretraining scale 로 확장**. 즉 TimesFM = PatchTST 의 pretrained · zero-shot 판. 두 논문 사이의 차이는 (a) 학습 데이터 규모 (dataset-specific vs 100B corpus), (b) supervised vs zero-shot, (c) fixed lookback vs 다양한 context.
- **참고**: PatchTST 는 `_index.md` 에서 사용자 이미 사전 독파 (arXiv:2211.14730, 5-19 QuantileFormer 세션에서도 dep-cover).

### 조상 3: Salinas et al. 2020 — "DeepAR" + Oreshkin et al. 2020 — "N-BEATS" (ICLR 2020)

- **연결선**: Global deep learning TS forecasting 의 원조. "여러 시계열을 한 모델에" 라는 mental model 을 확립. DeepAR (RNN + Gaussian/NegBin likelihood, Amazon), N-BEATS (deep MLP + basis expansion).
- **왜 이 논문들이 TimesFM 의 핵심 근거인가**: TimesFM 이 100B time-points 로 학습할 수 있다는 발상 자체가 "global model" 아이디어를 극단화한 것. DeepAR/N-BEATS 는 수천 시계열 규모의 global learning; TimesFM 은 수억 시계열 규모의 global learning + pretraining.

### 조상 4: Brown et al. 2020 — "Language Models are Few-Shot Learners (GPT-3)" (NeurIPS 2020)

- **연결선**: "대량 데이터 + 큰 모델 + 오래 학습 = zero-shot / few-shot 능력" 이라는 파운데이션 모델 패러다임의 원조. TimesFM 은 이 패러다임의 시계열 판.
- **왜 이 논문이 TimesFM 의 핵심 근거인가**: 논문 abstract 자체가 "language 파운데이션 모델의 시계열 판을 만들 수 있는가?" 라는 존재 질문. GPT-3 이 없었다면 이 질문 자체가 성립하지 않음. GPT-3 의 patching (subword tokenization) 을 시계열의 patching 으로 치환한 셈.

## 평행 연구 4편 (동시대, 다른 접근)

### 평행 1: Ansari et al. 2024 — "Chronos: Learning the Language of Time Series" (TMLR 2024, arXiv:2403.07815) [2026-04-29 ✓]

- **접근 차이**: 시계열 값을 4096 개 quantile bin 으로 이산화하고 T5 encoder-decoder 에 넣음. 이산화 → discrete token → LLM 문법 그대로 재활용.
- **어느 영역에서 TimesFM 이 이기나**: (i) 이산화 손실 없음, (ii) decoder-only 파라미터 효율, (iii) real-valued regression 이 자연스러움.
- **어느 영역에서 Chronos 가 이기나**: (i) 이산화하면 sampling (확률 예측) 이 자연스러움 → Chronos 는 확률 예측이 native, TimesFM v1 은 미보정. (ii) LLM 문법 재활용으로 few-shot in-context 가 가능. (iii) T5 encoder 가 bidirectional context 를 쓸 수 있음.

### 평행 2: Woo et al. 2024 — "MOIRAI: Unified Training of Universal Time Series Forecasting Transformers" (ICML 2024 Oral, arXiv:2402.02592) [2026-06-03 ✓]

- **접근 차이**: masked encoder + **Any-Variate Attention** (RoPE × binary bias) + **4-mixture output** (Student-T / log-normal / NegBin / low-var-Normal) + LOTSA 27.6B 9-domain 코퍼스.
- **어느 영역에서 TimesFM 이 이기나**: (i) decoder-only 라 autoregressive 자연스러움 (긴 horizon rollout). (ii) 학습 코퍼스 규모 (100B vs 27.6B). (iii) 단순한 골격 → 재현 · 이식 쉬움.
- **어느 영역에서 MOIRAI 가 이기나**: (i) 다변량 native (Any-Variate Attention). (ii) 4-mixture 확률 예측 native. (iii) LOTSA 코퍼스는 real-world 이면서 부분 공개 → 재현성 나음. (iv) sub-dataset cap ε=0.001 로 도메인 불균형 정공법.

### 평행 3: Ansari et al. 2024 — "LagLlama" (arXiv:2310.08278)

- **접근 차이**: decoder-only 이면서 lagged 시계열 표현 + Student-T 단일 output 분포. 시점적으로 TimesFM 과 거의 동시대 (2023-10) 프리프린트.
- **어느 영역에서 TimesFM 이 이기나**: (i) 코퍼스 규모 및 다양성. (ii) Patching 트릭. (iii) point forecast 성능.
- **어느 영역에서 LagLlama 가 이기나**: (i) 확률 예측 native (Student-T likelihood 학습). (ii) 소규모 fine-tuning 시 이식 쉬움.

### 평행 4: Goswami et al. 2024 — "MOMENT" (ICML 2024)

- **접근 차이**: encoder-only, patch masking pretraining, multi-task downstream (forecasting / classification / imputation / anomaly).
- **어느 영역에서 TimesFM 이 이기나**: forecasting-only 로 zero-shot autoregressive 자연스러움.
- **어느 영역에서 MOMENT 가 이기나**: multi-task 지원 → classification, anomaly detection 에 zero-shot 이식.

## 후손 예측 3편

### 후손 1: Das et al. 2024 — "TimesFM-ICF: In-Context Fine-Tuning for Time-Series Foundation Models" (arXiv:2410.24087)

- **관계**: 저자 자신의 후속. TimesFM 이 downstream 에 few-shot / in-context 예시를 받으면 성능이 얼마나 좋아지는지 정량화. 즉 zero-shot → few-shot 확장.
- **핵심 아이디어**: pretrained TimesFM 의 context 에 downstream 시계열 예시 (fewshot demonstration) 를 prepend 해서 in-context learning 을 유도.
- **의미**: 논문 원본이 열어놓은 "zero-shot 은 되지만 dataset-specific supervised 는 얼마나 어렵나?" 질문에 답 시도.

### 후손 2: TimesFM v2.0 → v2.5 발전 (2024-12, 2025-09; secondary source: 저자 README 및 Marktechpost 등)

- **관계**: 저자 자신의 후속. 원 논문의 self-report 한계 (quantile head 미보정, univariate) 를 부분 해결.
- **핵심 발전**: (i) context 확장 512 → 2048 → 16k. (ii) 30M param continuous quantile head (v2.5). (iii) XReg 로 covariate 지원 (v2.0+). (iv) frequency indicator 제거 (v2.5).
- **의미**: 원 논문의 아키텍처가 얼마나 확장 가능한지의 증거.

### 후손 3: Chen et al. 2024 — "VisionTS: Visual Masked Autoencoders Are Free-Lunch Zero-Shot Time Series Forecasters" (arXiv:2408.17253, ICML 2025) [2026-06-10 ✓]

- **관계**: TimesFM 이 "TS pretraining 이 가능함" 을 증명하자, VisionTS 는 "TS pretraining 은 필요 없다 — 이미지 pretrained backbone 을 재활용" 이라는 반대 방향을 실증. TimesFM 의 존재 증명에 대한 미니멀리즘 반박.
- **의미**: TimesFM 이 열어놓은 "존재 증명 vs 이식 재활용" 스펙트럼의 반대 끝. 두 논문 모두 valid — 서로 다른 상황에 서로 다른 답.

## Lineage 시각화

```
언어 모델      Vaswani 2017  →  Radford GPT 2018  →  Brown GPT-3 2020
                                                        │
                                                        ↓ (파운데이션 모델 문법 정착)
시계열 예측    ARIMA/ETS  →  DeepAR/N-BEATS 2020  →  PatchTST 2023
                                                        │
                                                        ↓ (patch = token 정착)
파운데이션 시계열                               →  ─┬─ TimesFM 2024 (본 논문)
                                                     ├─ Chronos 2024 (이산화 + T5)
                                                     ├─ MOIRAI 2024 (다변량 + mixture)
                                                     └─ LagLlama 2023 (lag + StudentT)
                                                        │
                                                        ↓
                                                     TimesFM-ICF, TimesFM v2.5,
                                                     VisionTS (이미지 재활용 반박)
```

이 지도는 TimesFM 이 "언어 파운데이션 모델 문법 + PatchTST 의 patching 트릭 + Google 규모 corpus" 의 세 조상 흐름을 하나로 합친 지점임을 보여준다.
