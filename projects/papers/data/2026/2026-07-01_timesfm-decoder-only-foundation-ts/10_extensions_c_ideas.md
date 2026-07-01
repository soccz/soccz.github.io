# 10.c 사고 확장: 실험 아이디어 2개

## 실험 A. TimesFM Attention Motif Depth-Distribution × PE 축 재현 (APF ↔ TimesFM 다리)

- **가설**: APF main paper §3 의 6-class motif taxonomy (diagonal / stripe / block / edge / spike / checker) 는 소형 4-layer × 4-head 실험에서 정의되었지만, TimesFM 1.0 200M (20-layer × 16-head, no-PE 로 v2.0 이후 이동) 에서도 재현된다. 특히 (a) diagonal motif 는 초기 layer (0~4) 에 지배적, (b) stripe/edge 는 중간 layer (5~14) 에 지배적, (c) block/checker 는 후기 layer (15~19) 에 지배적이다.
- **데이터**: (i) ETT-mini (사용자 보유 자산). (ii) UCR Archive 20 dataset (APF 표준). (iii) 사용자 보유 sin/periodic/logistic map synthetic (Grokking track 자산 재활용). 각 dataset 에서 시계열 100 개 random sample → TimesFM forward → 각 (layer, head) attention pattern 저장.
- **비교 조건**: 
  1. TimesFM 1.0-200m (PE 있음 가정 · 원 §3 확인 필요) 
  2. TimesFM 2.0-500m (`use_positional_embedding=False`)
  3. APF 소형 baseline (4-layer × 4-head sinusoidal PE) 
  4. PatchTST supervised 학습 모델 (같은 dataset 에 학습)
- **예상 결과**: 6-class taxonomy 가 재현되면서 (a)-(c) depth 분포가 확인됨. 만약 TimesFM 에서 새로운 motif (예: "diagonal-with-shift" 처럼 offset diagonal) 이 관찰되면 taxonomy 확장 근거. PE 유/무 비교로 sinusoidal 이 어떤 motif 를 강화하는지 확인.
- **반증 조건**: 만약 TimesFM 이 4-class 만 또는 8-class 로 관찰되면 (기존 6 이 소형-특화), taxonomy 를 scale-dependent 로 재정의해야 함. 또는 depth 분포가 무작위 (uniform) 면 layer-specialization 가설이 무너짐.
- **비용 추정**: TimesFM 1.0-200m 다운로드 ~800 MB, 100 시계열 forward 로 GPU 1대 (RTX 3090 급) 로 4~8 시간. attention pattern 저장 500 GB 급 (per 시계열 20 × 16 × context² 실수 값). APF classifier 적용 CPU 로 하루 이내. 총 예산: GPU 1주일 × 1대.

## 실험 B. Pretrain Data 규모별 Grokking Phase 관찰 (Grokking TS ↔ TimesFM 다리)

- **가설**: TimesFM 아키텍처 (200M, decoder-only, patch=32) 를 corpus size 를 4-단계 (100M / 1B / 10B / 100B time-points) 로 학습하면, Liu et al. NeurIPS 2022 4-phase diagram (comprehension / grokking / memorization / confusion) 이 재현된다. 특히 (a) 100B → comprehension (즉시 generalization), (b) 10B → soft grokking (delayed generalization epoch 존재), (c) 1B → memorization dominant, (d) 100M → confusion (안 배움). 이는 시계열 분야에서 Liu 4-phase 를 최초로 실증하는 결과.
- **데이터**: 100M / 1B / 10B / 100B 규모 pretraining subset. 100B corpus 는 재현 어려우니 **대체 corpus (Chronos KernelSynth + Monash 아카이브 확장 + custom synthetic)** 로 구축. Downstream 평가: Monash + ETT + Weather.
- **비교 조건**:
  1. 각 corpus 규모 × 3 seed = 12 pretrain 실행
  2. weight decay ∈ {0, 0.01, 0.1} 스캔 (Liu 4-phase 는 wd 축을 사용)
  3. 각 실행에서 epoch 별 train MSE / test MSE / attention entropy (motif complexity proxy) 시계열 기록
- **예상 결과**: 만약 grokking phase 가 재현되면 시계열 분야 최초. 만약 재현 안 되면 이유 분석 — (i) corpus 다양성이 부족했나 (ii) 시계열은 discrete task 와 근본적으로 다른 4-phase 를 가지나 (iii) TimesFM 아키텍처가 grokking-resistant 인가. 어느 결과든 Grokking TS paper 의 §4 (실험) 핵심.
- **반증 조건**: (a) 4-phase 가 재현 안 되고 오히려 loss 곡선이 monotonic 하강만 → grokking 이 시계열에 부재. (b) 4-phase 는 재현되지만 wd 축 sensitivity 가 Liu 실험과 다르면 phase boundary 가 dataset-dependent → paper 의 "phase diagram universal" 주장 수정 필요.
- **비용 추정**: 크다. 200M 모델 × 100B token 사전학습은 TPU/GPU cluster 규모 필요. 축소된 20M 모델 × 100M ~ 10B corpus 로 proxy 실험 가능. 학교 GPU 예산 (RTX A6000 × 4 대 → 3~6 개월) 로는 20M 급 proxy 실험까지 실현 가능. 실제 200M 급은 industry collaboration (Google/Meta) 이나 CoLLAs/NeurIPS Compute grant 필요.

## 두 실험 배치 논리

- **A (motif taxonomy 재현)**: 비용 낮음, 결과 명확, APF main paper 의 즉시 활용 자원. 우선순위 1.
- **B (grokking phase 재현)**: 비용 크지만 NeurIPS 2027 Grokking TS 논문의 핵심 novel contribution. 우선순위 2 — 20M proxy 로 예비 실험 후 결과에 따라 full-scale grant 신청 결정.

두 실험 모두 TimesFM 이 "관찰 substrate" 로 사용됨 — 즉 TimesFM 자체를 개선하는 실험이 아니라 TimesFM 이 검증되지 않은 (attention motif, grokking phase) 성질을 재는 도구로 씀. 이 배치는 사용자 profile 의 두 active track (APF, Grokking) 각각에 하나씩 정확히 매칭.
