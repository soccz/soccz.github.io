# 7. 이론적 계보

## 이론적 조상 (4편)

### (1) PatchTST — *Patch-based tokenization 의 정착* (Nie et al. ICLR 2023, arXiv:2211.14730)

**연결선**: PatchTST 가 *patch* 를 시계열 Transformer 의 표준 토큰 단위로 정착시켰다. 한 patch = 16 시점 (또는 32) 등을 *한 벡터* 로 사영해 *quadratic attention cost 를 patch 단위로 줄임*. MOIRAI 의 **multi-patch-size projection** 은 이를 *여러 patch size* 로 일반화 — universal 한 freq 처리를 가능하게 함. 또한 PatchTST 의 **channel-independent** 전략은 MOIRAI 의 **Any-Variate Attention** 의 *반례* — channel-mixed 평탄화로 변량 간 상호작용을 살린다는 대안 선택. 즉 MOIRAI 는 PatchTST 의 *토큰화는 계승, channel 처리는 역전*.

**얻을 수 있는 것**: Patch-based 토큰화가 *universal forecaster* 에서 어떻게 freq-adaptive 으로 확장되는지의 *clean diff*. 본 사이트의 *2026-05-19 PatchTST 해체* 와 직접 비교 가능.

### (2) RoFormer / RoPE — *Rotary Position Embedding* (Su et al. arXiv:2104.09864, Neurocomputing 2024)

**연결선**: RoPE 가 query/key 벡터를 위치에 따라 회전시켜 *상대 위치 정보를 attention dot product 안에 자연 내장* 한 결정적 발상. MOIRAI 의 **Any-Variate Attention** Eq.(2) 의 첫 항 $(W^Q x)^T R_{i-j} (W^K x)$ 가 *시간축에 RoPE 적용* — 임의 시간 인덱스 가능 + extrapolation 강건. APF 의 PE-attention geometry 가설 (RoPE 가 *attention motif* 의 *주파수 채널 분해* 를 유도) 와도 직접 연결.

**얻을 수 있는 것**: RoPE 가 시계열 universal 모델의 *long-context zero-shot* 의 핵심 enabler 임을 확인. APF 의 다음 실험으로 *Any-Variate Attention의 RoPE component 를 ALiBi 로 교체했을 때 attention motif 변화* 측정 가능.

### (3) RevIN — *Reversible Instance Normalization* (Kim et al. ICLR 2022)

**연결선**: RevIN 이 *시계열 input 의 mean/std 를 instance 단위로 normalize 한 후, output 에서 다시 inverse-transform* 해 distribution shift 처리. MOIRAI 본문 §3.1: "(non-learnable) instance normalization is applied to inputs/outputs, aligning with the current standard practice for deep forecasting models." 즉 *Universal forecaster 는 distribution shift 흡수가 critical*. RevIN 류의 instance norm 이 모든 입력에 *defacto preprocessing* 으로 들어감.

**얻을 수 있는 것**: Non-stationarity 처리의 *minimal modeling 가정* (instance-level mean/std 정규화) 이 zero-shot universal forecaster 의 *prerequisite* 임을 확인. Grokking-TS 의 non-stationarity track 과 직접 연결.

### (4) DeepAR — *Probabilistic Forecasting Head 의 표준* (Salinas et al. 2020, IJF 2020)

**연결선**: DeepAR 가 *autoregressive LSTM + likelihood head* 로 확률 forecasting 의 표준을 정착. *Gaussian / Student-T / Negative Binomial 중 하나를 dataset 별 사전 선택* 후 NLL 학습. MOIRAI 의 **Mixture Distribution Head** 는 DeepAR 의 *단일 분포 head* 를 *4 component mixture* 로 일반화. 학습 손실 (NLL) 자체는 DeepAR 와 동일 구조.

**얻을 수 있는 것**: Probabilistic forecasting 의 *역사적 baseline* 과 MOIRAI 의 *그 개선*. DeepAR 가 *autoregressive*, MOIRAI 가 *masked encoder* 라는 architectural 차이가 *확률 head 효과* 의 별도 변수.

## 평행 연구 (4편 — 동시기 다른 접근)

### (1) Chronos — *Token-based Language Modeling 으로 시계열* (Ansari et al. TMLR 2024, arXiv:2403.07815) [본 사이트 2026-04-29 ✓]

**같은 시기, 다른 접근**: Chronos 는 T5 backbone 으로 *시계열 값을 quantization bin 으로 tokenize* 한 후 *언어모델처럼 autoregressive 학습*. MOIRAI 는 *patch 기반 마스크드 인코더 + 연속 mixture distribution*.

**왜 MOIRAI 가 이기는 영역 / Chronos 가 이기는 영역**:
- MOIRAI 우위: (a) 다변량 시계열 (Chronos 는 univariate 만), (b) *연속 분포* head 효율, (c) *임의 horizon* 의 parallel inference.
- Chronos 우위: (a) *기존 LLM 인프라* 재사용 (T5 architecture, tokenizer), (b) *categorical distribution* 의 *true flexibility* (어떤 분포든 quantization 으로 표현), (c) *프롬프트* 통합 가능 (텍스트 + 시계열).

**얻을 수 있는 것**: 같은 데이터 + 같은 zero-shot 목표에서 *마스크드 인코더+ 연속분포* vs *autoregressive token + categorical* 의 *trade-off matrix*. ProTran-TFA 의 *분포 head 선택* 결정에 직접 안내.

### (2) TimesFM — *Decoder-only Foundation Model* (Das et al. ICML 2024, arXiv:2310.10688)

**같은 시기, 다른 접근**: TimesFM 은 *decoder-only* (GPT-like) + *larger output patch size* (효율적 decoding) + Google Trends/Wiki 의 100B+ 비공개 시점 학습. MOIRAI 는 *encoder-only* + *공개 27.6B obs* + *probabilistic*.

**왜 MOIRAI 가 이기는 / TimesFM 이 이기는**:
- MOIRAI 우위: (a) 공개 데이터 → 재현 가능, (b) probabilistic, (c) 다변량.
- TimesFM 우위: (a) 학습 시점 100B+ (3.6× MOIRAI), (b) *Google 의 계산 자원* 으로 더 큰 모델 (200M+).

**얻을 수 있는 것**: Encoder vs decoder 아키텍처가 시계열 FM 에서 *어떻게 다른 강점* 을 만드는지. Long-horizon autoregressive 가 decoder, parallel masked reconstruction 이 encoder. 도메인 별 적합 선택의 *guideline*.

### (3) Lag-Llama — *LLaMA architecture + Lag features* (Rasul et al. 2023, arXiv:2310.08278)

**같은 시기, 다른 접근**: Lag-Llama 는 *LLaMA-2 decoder backbone* 에 *lagged time series features (autoregressive lag 들을 input feature 로)* 결합. *neural scaling laws for TS* 의 첫 실증.

**왜 MOIRAI 가 이기는**: (a) *다변량* (Lag-Llama 단변량만), (b) *flexible distribution* (Lag-Llama Student-T 만), (c) *다양한 freq* (Lag-Llama frequency-agnostic 미설계).

**Lag-Llama 가 이기는 영역**: (a) *Neural scaling laws* 의 정량 실증 — MOIRAI 가 *제시 못한 부분* (저자 인정).

**얻을 수 있는 것**: 시계열 *neural scaling law* 의 *empirically curve*. Grokking-TS 의 *학습 dynamics × 데이터 규모* 분석에서 baseline.

### (4) MOMENT — *Time Series Pile + Masked Reconstruction* (Goswami et al. ICML 2024, arXiv:2402.03885)

**같은 시기, 다른 접근**: MOMENT 가 *Time Series Pile* (open data) + *masked patch reconstruction* + *RevIN 적용* + 64 patches of 8 시점. MOIRAI 와 *동시 ICML 2024 등재* (저자들이 본문 비교 없음, 동시 발표).

**왜 MOIRAI 가 이기는 / MOMENT 가 이기는**: 둘 다 마스크드 인코더 + 공개 데이터 + zero-shot 목표. 차이는:
- MOIRAI: *probabilistic*, *Any-Variate Attention*, *Multi-Patch-Size*, *27.6B obs*.
- MOMENT: *point forecast 만*, *channel-independent*, *고정 patch 8*, *Time Series Pile (이전 발표 자료 기반, 정확 obs 수 본 환경 미확인)*.

**얻을 수 있는 것**: 같은 *masked encoder + open data* 패러다임 안에서 *probabilistic + Any-variate* 가 어떤 가치를 더하는지의 *natural ablation*.

## 후손 예측 (3개 — 본 논문이 낳을 / 낳은 연구)

### (1) Moirai-MoE — *Sparse Mixture-of-Experts 확장* (Liu et al. arXiv:2410.10469, 2024-10 후속)

**연결선**: 동일 저자진의 직접 후속작. MOIRAI의 dense FFN 을 *sparse MoE* 로 교체해 *효과적 capacity* 를 늘림. 본 사이트 검색결과 (`liu2024moiraimoe`) 에 따르면 동일 backbone 의 MoE 화. MOIRAI 의 *모델 size scaling* 미보고 한계를 *expert size scaling* 으로 우회.

**왜 이 후손이 자연**: MOIRAI 가 *normalized MAE 가 Small > Base > Large 일관 우위* 못 보였다 — *모델 사이즈만 키워서는 부족*. MoE 가 *유효 활성 파라미터* 와 *총 파라미터* 를 분리해 *fixed cost 로 큰 capacity*.

### (2) GIFT-Eval — *Time Series Foundation Model Benchmark* (Aksu et al. arXiv:2410.10393, 2024-10)

**연결선**: 동일 저자진이 발표한 *TSFM 평가 표준*. MOIRAI 가 *zero-shot OOD 평가 표준* 의 부재를 한계로 (저자 본문) 지적했고, *그 부재를 자기들이 해결*. 즉 MOIRAI → GIFT-Eval 의 *문제 → 해결* 연속.

**왜 이 후손이 자연**: Zero-shot 비교의 *공정성* 부족이 본 논문 Table 5 의 약점 (각 universal forecaster 의 open weight 결여) — 표준 benchmark 가 *모든 TSFM 비교* 를 가능케 함.

### (3) Latent Diffusion Forecaster (저자 §5 명시)

**연결선**: 저자들이 §5 Limitations 에서 *latent diffusion architecture* 로의 확장을 명시. Feng 2024 (AAAI Latent Diffusion for TS) 인용. *Mixture distribution 의 다음 단계* — 더 *flexible* 한 분포 표현.

**왜 이 후손이 자연**: Mixture 4 컴포넌트가 *zero-inflated / bimodal* 등 못 다룬다 (07_limits 의 약점). Diffusion 이 그 표현력 한계를 *임의 분포* 로 확장. 단 *학습 / 추론 cost* 의 trade-off.

## 계보 종합

**MOIRAI 의 학술적 좌표**:
- *수직축* (시간 - 역사적 lineage): DeepAR (확률 head 표준) → Informer/Autoformer/PatchTST (Transformer + patch 도입) → Lag-Llama/TimesFM (FM 시도) → **MOIRAI** (공개 + 다변량 + 확률 FM).
- *수평축* (동시기 평행): MOIRAI vs Chronos (encoder vs decoder/T5) vs TimesFM (공개 vs 비공개) vs Lag-Llama (mixture vs single Student-T) vs MOMENT (probabilistic vs point).
- *미래* (후손): Moirai-MoE (capacity scaling), GIFT-Eval (평가 표준), Diffusion-Moirai (분포 표현력).

이 좌표 안에서 MOIRAI 는 *공개 자원 + 다변량 + probabilistic + masked encoder* 의 4-교차점에서 *유일한 ICML 2024 Oral*. 이 좌표가 비어 있었다는 사실 자체가 본 논문의 *historical contribution* 의 충분조건.
