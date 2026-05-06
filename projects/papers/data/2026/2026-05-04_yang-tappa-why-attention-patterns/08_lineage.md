# 08. 이론적 계보

## 이론적 조상 (4편)

### 1. Su et al. 2024 — RoFormer (RoPE)

[arXiv:2104.09864] Rotary Position Embedding 의 원전. RoPE 의 dimension 별 frequency 와 attention 의 long-term decay 의 관계를 처음 분석. TAPPA 의 RoPE frequency-channel 분해는 이 논문의 long-term decay theorem (RoPE 가 |n-m| 증가에 따라 attention score 가 감소하는 envelope 가 dimension 의 weighted sum 으로 도출된다는 결과) 의 직접 후손. 차이는 Su 가 PE 만 분석한 반면 TAPPA 는 query/key dynamics 를 곱한 점.

### 2. Press et al. 2022 — ALiBi

[arXiv:2108.12409] Linear bias 기반 PE 로 length extrapolation 을 시연. RoPE 와 ALiBi 가 같은 motif typology 를 만드는가의 비교 base. TAPPA 가 ALiBi 를 직접 다루지 않은 게 한계지만, ALiBi 도 비슷한 long-term decay 를 가지므로 framework 가 ALiBi 로 확장 가능할 가능성이 큼. 단 ALiBi 는 "회전" 이 아닌 "additive bias" 라 simultaneous-shift invariance 의 algebra 가 다름 — 정리 재증명 필요.

### 3. Xiao et al. 2023 — StreamingLLM (Attention Sink 현상)

[arXiv:2309.17453] Attention sink 의 인과적 설명을 처음 정량화. 첫 토큰의 large activation 이 softmax 의 분모를 보존하기 위한 "trash bin" 으로 작용. TAPPA 가 sink 를 RoPE 저주파 + query continuity 의 결합으로 통합 설명한 것은 Xiao 의 발견을 메커니즘적으로 환원한 결과. Xiao 는 현상을 발견, TAPPA 는 그 mechanism 을 framework 안에 위치시킴.

### 4. Wu et al. ICLR 2025 — Retrieval Head Mechanistically Explains Long-Context Factuality

[arXiv:2404.15574] Retrieval head 라는 head category 의 인과적 정의 (특정 head 를 ablate 하면 long-context factual recall 깨짐). TAPPA 의 re-access pattern 이 retrieval head 의 시각적 manifestation 임을 가정 (저자가 명시적으로 "retrieval head" 와 매핑). 즉 TAPPA 는 Wu 의 "head category" 에 "왜 그 head 가 그런 패턴을 보이는가" 의 메커니즘 설명을 추가.

## 평행 연구 (4편)

### 1. arXiv:2601.08297 — Demystifying the Slash Pattern: The Role of RoPE

같은 1월에 같은 ICLR 2026 cycle 에서 등장한 직접 평행 작업. TAPPA 가 slash 를 q-similarity × RoPE 로 설명한 것을 이 논문은 RoPE 만으로 설명 (q-similarity 부분 부재). TAPPA 가 우월한 점은 (i) slash 외 sink/re-access 까지 통합, (ii) query dynamics 를 명시적 변수로 도입. 단 이 평행 작업이 RoPE-만 설명에서 TAPPA 보다 더 sharp 한 bound 를 가진다면 TAPPA 의 q-similarity 의존성이 본질이 아닐 수 있다는 위험.

### 2. arXiv:2510.00636 — Expected Attention (NVIDIA 2025)

KV cache 압축의 직접 baseline. EA 는 future query distribution 을 예측해 token importance 를 계산. TAPPA 는 query 시계열의 자기유사도라는 "현재 측정 가능" 한 신호로 동일 목적. EA 가 모델 학습이 필요 없는 estimator 인 점, TAPPA 도 학습 불필요 — 동등한 metric scope. TAPPA 의 +11.34 우월은 self-similarity 가 future query distribution 보다 더 robust 한 신호임을 시사 (혹은 EA 가 implementation 약점).

### 3. arXiv:2502.00919 — Attention Sinks: A Catch, Tag, Release Mechanism

같은 시기 attention sink 의 또 다른 설명 — sink head 가 token embedding 을 catch-tag-release 라는 3-step pipeline 으로 처리한다는 framework. TAPPA 가 sink 를 query continuity + RoPE 로 환원한 것과 다른 angle (representation-flow 관점). 두 설명이 양립 가능한지 / 충돌하는지가 향후 통합 연구 거리.

### 4. arXiv:2511.21514 — Mech Interp for Time Series Classification (Kalnāre et al.)

도메인이 다르나 (TS classification vs LLM) **방법론적으로 같은 문제** — attention map 의 motif typology 를 mechanistic interpretability 관점에서 정리. 사용자 (`_profile.md`) 의 또 다른 concurrent work. TAPPA 는 LLM 의 patterning 을 RoPE 로 설명, Kalnāre 는 TS classification 의 patterning 을 다른 lens 로. 두 논문이 사용자 APF (TS Transformer 의 motif analysis) 의 두 접근 wing 을 차지.

## 후손 예측 (3개)

### 후손 예측 1. NoPE / Learned PE 로의 framework 확장

NoPE 와 learned PE 모델에서 q-similarity 가 같은 metric 으로 작동하는지를 보이는 후속. 만약 작동하면 framework 가 PE-agnostic 으로 격상, 단순히 RoPE 만의 결과가 아닌 "query dynamics 가 본질" 임의 증명. 6개월 안 등장 가능성 높음.

### 후손 예측 2. 시계열 도메인 (TS Transformer / TSFM) 으로 이식

q-similarity 측정이 TS Transformer (PatchTST, iTransformer, Chronos) 에서도 같은 motif → 같은 응용 (TSFM 의 patch-level pruning, 또는 forecasting head 의 layer pruning) 으로 작동하는지의 후속. 이건 사용자 APF 가 직접 점유 가능한 niche.

### 후손 예측 3. Training dynamics 로의 확장 (Grokking 연결)

q-similarity 가 inference time 의 metric 이지만, 학습 중 query 의 self-similarity 가 어떻게 evolve 하는지를 추적하면 grokking phase transition 의 또 다른 signature 가 될 수 있음. Lyle 2025 (continual learning + grokking) 와 결합 시 강력. 사용자 grokking track 과 가장 가까운 후손 가능성.

## 핵심 한 문장

> **TAPPA 는 PE 분석 (Su 2024) 과 head-typology (Wu 2025, Xiao 2023) 를 query temporal dynamics 라는 새 차원으로 곱해 통합하려는 1세대 시도이며, 그 후속은 PE-generalization · 도메인 이식 · training-time analysis 의 세 방향으로 갈라질 것이고, 그 중 도메인 이식 (TS Transformer) 은 사용자 APF 가 점유 가능한 niche 다.**
