# 08. 이론적 계보

## 이론적 조상 — 본 논문이 *논리적으로* 어디서 왔는가

### 조상 1 — DLinear (Zeng et al., AAAI 2023; arXiv:2205.13504)

**연결선**: "복잡한 트랜스포머 시계열 모델이 단순 linear 모델보다 정말 더 좋은가?" 라는 *통제된 회의주의* 의 직계 조상. DLinear 는 "linear 한 줄로 SOTA 트랜스포머를 이긴다" 라는 ablation-driven 주장으로 Informer/Autoformer/FEDformer 라인의 *추가 가치* 를 의심했다. Tan 2024 는 같은 방법론적 시선을 *LLM-for-TS* 라인에 적용한 후속.

**차이**: DLinear 는 *전체 모델* 을 단순 linear 로 교체. Tan 2024 는 *LLM 백본만* 교체 — 어댑터/헤드 구조는 보존. 더 통제된 ablation. 또 본 논문의 PAttn 은 *linear 보다 한 단계 위* 의 베이스라인 (patch + attention + linear) 이므로 DLinear 의 단순 linear 메시지보다 *세련된* 양성 결과.

### 조상 2 — PatchTST (Nie et al., ICLR 2023; arXiv:2211.14730)

**연결선**: "patch tokenization + channel independence + 표준 트랜스포머" 의 *효과* 를 입증한 직계 조상. PAttn 의 아키텍처가 PatchTST 의 *1-layer 축소판* — `Patch → Linear → Attention → Linear` 의 핵심 구성. PatchTST 가 multi-layer 트랜스포머로 SOTA 였다면, Tan 2024 는 *그 multi-layer 도 필요 없다* 고 한 단계 더 ablation.

**차이**: PatchTST 는 *양성* 메시지 (patch 토큰화의 가치) 만. Tan 2024 는 *음성 + 양성* — LLM 무용 + PAttn 충분. 메시지의 sharper edge.

### 조상 3 — OneFitsAll / GPT4TS (Zhou et al., NeurIPS 2023)

**연결선**: 본 논문의 *주요 표적 중 하나* 이자 *직접적 자극*. OFA 가 "GPT-2 frozen + LoRA 만 풀어서 시계열 SOTA" 라는 강한 주장을 NeurIPS 23 에서 폈을 때, *그게 진짜 GPT-2 덕분인지* 의 의심이 NeurIPS 24 의 본 논문으로 정확히 1년 뒤 응답.

**차이**: OFA = *주장 측*, Tan 2024 = *검증 측*. 둘이 NeurIPS 1년 간격으로 같은 무대에서 *thesis vs antithesis* 의 명확한 대화. Hegelian 진보의 모범 사례.

### 조상 4 — Mech interp ablation 정통 (ACDC Conmy 2023; IOI Wang 2023; SFC Marks 2024)

**연결선**: ablation 의 *방법론적* 조상. ACDC 가 "edge ablation 으로 회로 발견", IOI 가 "path patching 으로 head 기능 격리", SFC 가 "feature ablation 으로 causal graph 발견" 을 했다면, Tan 2024 는 *architecture-block ablation 으로 LLM 백본 무용 격리*. 같은 *causal scrubbing* 정신.

**차이**: mech interp 의 ablation 은 *내부 회로 수준* (head, edge, feature). Tan 2024 의 ablation 은 *architecture-block 수준* — 한 블록 통째. 거친 입자 ablation 이지만 그 거친 입자가 *바로 mech interp 가 답하지 못하는 거시 질문* 에 답을 줌.

## 평행 연구 — 비슷한 시기 다른 접근

### 평행 1 — "Frozen Pretrained Transformer" 라인 (Lu et al., NeurIPS 2022; "FPT")

**무엇인가**: 사전학습 transformer 의 frozen 가중치가 *언어 외* domain (이미지, bit 시퀀스, protein) 에 transfer 가능한가의 연구. FPT 는 *부분적 transfer* 를 보임.

**Tan 2024 와의 관계**: Tan 2024 는 *시계열* domain 에서 FPT 가설을 강력히 부정. 즉 FPT 의 일반화 주장에 시계열 *반례*. 그러나 FPT 가 시계열에서도 valid 라고 주장했던 OFA 의 직접적 사상적 조상이라는 점에서, Tan 2024 는 *FPT-on-TS* 가설 자체를 반박.

**누가 이기나**: 본 논문의 결론 (시계열엔 FPT 안 통함) 이 보다 robust — 본 ablation 의 sharper 성격 때문. FPT 의 일반 주장은 *다른 도메인* (이미지/protein) 에선 여전히 유효 가능.

### 평행 2 — Chronos / MOIRAI / TimesFM 라인 (2024)

**무엇인가**: *시계열 sequence 자체* 로 사전학습한 foundation 모델. Chronos (Ansari 2024) 가 84B token 시계열로 T5 학습, MOIRAI (Woo 2024) 가 LOTSA 27.6B token, TimesFM (Das 2024) 가 decoder-only.

**Tan 2024 와의 관계**: Tan 2024 의 음성 결론을 *우회* 하는 흐름. "*언어* 사전학습이 무용하다면, *시계열* 사전학습은 어떤가?" 라는 자연스러운 후속 질문에 *양성* 답을 줌. Mishra 2026 (Dissecting Chronos) 의 SAE 분석이 *Chronos 의 시계열 사전학습은 실제 인과 feature 를 형성* 함을 보여 — 이게 Tan 2024 의 결론 *밖* 의 영역.

**누가 이기나**: 영역별. Tan 2024 = *LLM-for-TS* 영역의 결정타. Chronos/MOIRAI/TimesFM = *TSFM 영역* 의 양성 baseline. 두 라인은 *상호 보완적* — Tan 2024 가 TSFM 의 시계열 사전학습 가치를 *반증으로 강조* 하는 효과.

### 평행 3 — Lag-Llama (Rasul et al., 2024)

**무엇인가**: lag-feature + LLaMA 의 decoder-only 변형으로 distributional univariate forecasting.

**Tan 2024 와의 관계**: Lag-Llama 는 LLM-for-TS 의 한 변형이지만, 시계열로 *재학습* 됨. Tan 2024 의 LLM-frozen 라인과 다름. LLaTA 가 LLM-Lag 의 한 형태로 본 ablation 에 포함되기도.

### 평행 4 — VisionTS (Chen et al., ICML 2025; arXiv:2408.17253)

**무엇인가**: 자연어 LLM 대신 *frozen ImageNet-pretrained MaskedAutoencoderViT* 를 시계열 백본으로. "TS-as-2D 로 reshape 한 후 image inpainting 으로 forecast".

**Tan 2024 와의 관계**: 흥미로운 대조점. VisionTS 는 *언어가 아니라 vision* 사전학습이 시계열에 transfer 됨을 양성으로 주장. Tan 2024 가 *언어 pretrain 무용* 을 보인 직후의 후속.

**누가 이기나**: 본 환경 비교는 미완. 가설: Tan 2024 ablation 을 VisionTS 에 적용하면 (즉 frozen MAE 백본을 random-init 으로 교체하면) 어떤 결론이 날까? 만약 *같은* 결과면 → vision pretrain 도 무용 → 본 결론의 *modality-agnostic 일반화*. 만약 *다른* 결과면 → *vision pretrain 만 진짜 가치* — 본 결론의 한계.

## 후손 예측 — 본 논문에서 파생될 후속

### 후손 1 — TSFM ablation 라인 (이미 진행 중)

**예측**: Chronos, MOIRAI, TimesFM 에 본 ablation 격자를 그대로 적용한 후속 논문. *시계열 사전학습 가중치 vs random-init* 의 직접 비교. 본 환경에서 *진행 중* 으로 추정. Mishra 2026 (Dissecting Chronos SAE) 가 이미 *causal feature 형성 + ablation 효과 측정* 을 SAE 입자로 함.

### 후손 2 — Distribution-aware LLM-for-TS ablation

**예측**: 본 논문이 안 다룬 *분포 forecast* 영역에서의 ablation. Time-LLM 의 *distributional head* (또는 ProTran-style probabilistic Transformer) 에 본 ablation 격자를 적용. CRPS / NLL 평가. 만약 *분포 forecast 에서도 LLM 무용* 이면 본 결론의 보편성 확대. 만약 *분포에서만 LLM 가치* 면 *진짜 LLM 가치는 표현이 아니라 분포 prior 임* 이라는 새 가설.

### 후손 3 — Cross-domain / Zero-shot 일반화 ablation

**예측**: GIFT-EVAL, Monash, M5 같은 cross-domain 벤치에서 본 ablation 격자 적용. 가설: zero-shot setting 에선 LLM 사전학습이 *최소한의 prior* 를 제공할 수 있어 LLM 변형 우위 가능. 본 논문 결론의 *영역* 을 명확히 확정.

## 계보의 메시지

본 논문은 *TS-ML 의 정통 회의주의 라인* (DLinear → Tan 2024) 과 *mech interp ablation 정통* (ACDC → IOI → SFC → Tan 2024) 의 *교차점* 에 있다. 두 lineage 의 만남이 본 논문을 NeurIPS Spotlight 으로 만든 핵심. 이 교차점은 사용자의 두 active track (APF = mech interp on TS, Grokking = TS dynamics) 와도 직접 닿는다.
