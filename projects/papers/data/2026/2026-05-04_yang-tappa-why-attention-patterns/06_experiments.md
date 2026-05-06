# 06. 실험 해부

## 본문 접근 제약 명시 (앞)

본 섹션은 arXiv html/pdf/ar5iv/alphaxiv/Semantic Scholar 가 모두 403 차단된 상태에서, GitHub README + 검색 엔진 스니펫 + 동시기 비교 논문 정보를 종합하여 작성. 정확한 ablation 수치 행렬·표 plot 의 시각적 디테일은 미확보. 따라서 본 절은 **(i) 실험 설계의 추정 골격, (ii) 헤드라인 수치 (+11.34, +5.60) 의 의미와 한계, (iii) 빠진 ablation 의 추정** 으로 구성.

## 데이터셋·모델·baseline

### KV cache 압축 평가
- **모델**: Qwen2.5 (7B 또는 14B 추정 — 스니펫엔 size 미명시. Qwen2.5 는 GQA + RoPE 변종 사용).
- **데이터**: LongBench (THUDM, ACL'24/'25) 가 KV cache 분야 표준. 2-Wiki, NarrativeQA, HotpotQA 등 single/multi-doc QA + summarization. 본 논문이 LongBench 사용 추정 (본문 미확인).
- **Baseline**: EA (Expected Attention, NVIDIA arXiv:2510.00636 2025), StreamingLLM, H2O, SnapKV, FullKV 등 표준.
- **Budget setting**: 스니펫 명시: "budget 512". 즉 layer 당 512 token 만 보존. 표준 token 수 32K~128K 의 prompt 에서 공격적 압축 영역.

### Pruning 평가
- **모델**: Llama-3.1-8B (32 layer transformer, GQA + RoPE).
- **데이터**: 표준 LM evaluation harness (MMLU, HellaSwag, ARC, PIQA 등 추정).
- **Baseline**: ShortGPT (Baichuan 2024 arXiv:2403.03853), LLM-Pruner (Ma 2023), 균등 random drop.

## 헤드라인 수치 — 의미와 비판적 읽기

### "+11.34 average gain over EA on Qwen2.5 at budget 512"

EA 가 KV cache 압축의 가장 최신/강한 baseline (NVIDIA 2025) 임을 감안하면 **두 자릿수 평균 점수 향상** 은 큰 신호. 단 다음 의문이 남는다:

1. **"average" 의 평균 단위** — 여러 LongBench 서브태스크의 단순 평균인지, weighted average 인지, single-doc vs multi-doc 분리 평균인지 불명. LongBench 는 task 별 metric scale 이 다양 (F1, ROUGE, accuracy) 해서 단순 평균은 misleading 할 수 있음.
2. **Budget 512 가 sweet spot 인가** — KV cache 압축 논문의 common pattern 은 모델별로 특정 budget 에서만 큰 gain 이 나타남. budget 1024, 2048 에서도 gain 이 유지되는지가 robustness 시험.
3. **EA 자체가 specific scenario 에 약할 수 있음** — Expected Attention 은 future query distribution 추정 기반인데, distribution shift 가 큰 prompt (예: 갑자기 주제 전환) 에서 약함. TAPPA 의 q-similarity 는 그런 prompt 에서 query drift 자체를 측정하니 자연스럽게 우월.

### "+5.60 average gain over ShortGPT on Llama-3.1-8B"

Pruning 은 KV cache 보다 baseline 차이가 본래 크고 (drop 한 layer 수에 sensitive), ShortGPT 가 강한 baseline (perplexity 기반 layer importance) 임을 감안하면 +5.60 도 의미. 단:

1. **얼마나 prune 했는가** — drop 비율 (e.g., 32 → 24 layer) 명시 부재. 압축률에 따라 baseline 들의 ranking 바뀜.
2. **MMLU 처럼 zero-shot eval 이 domain mismatch 에서 큰 분산을 가진다** — 평균 점수 +5.60 의 std 가 함께 보고됐는지가 결정적. 단일 seed 평균이라면 reproducibility 의문.

## 추정 ablation 목록 (본문에 있을 가능성)

본 framework 에서 reviewer 가 요구할 ablation:
- **(A1)** $S_l$ 정의 변형: cosine vs Pearson vs angular distance, window size $w$ 의 sensitivity.
- **(A2)** RoPE band threshold $\theta_*$ 의 ablation: low/high freq 분리 위치 변화에 따른 metric 변화.
- **(A3)** Layer-wise vs head-wise scoring: head 별 분리하면 gain 추가 있는지.
- **(A4)** Models: Llama-3.1, Qwen2.5 외 Mistral, Gemma 등에서 generalization.
- **(A5)** Prompt domain: code, math, narrative, multilingual 등 q-similarity 분포가 다른 domain 에서 metric 의 robustness.
- **(A6)** **Causal intervention**: q-similarity 가 정말 인과적으로 attention pattern 을 결정하는지 — query 를 인위적으로 perturb 해서 attention map 이 예측대로 변하는지.

(A6) 가 특히 중요. Theorem 5.2 가 sufficient condition 만 주는데 인과성을 보장하려면 perturbation 실험이 필수. 본 논문이 (A6) 을 했는지가 이 framework 의 진정한 인과성 주장 여부를 가른다.

## 부록에 숨은 신호 (추정)

ICLR 2026 접근 paper 의 부록은 보통:
- **Section A: Detailed proofs** (Theorem 5.2 의 정확한 epsilon-bound).
- **Section B: Per-task LongBench breakdown** (어떤 task 에서 가장 큰 gain — 보통 long-context retrieval task).
- **Section C: Visualization** — 각 layer 의 attention map 과 $S_l$ 의 scatter (재현 어려움).
- **Section D: Compute cost** — q-similarity 측정 overhead. inference latency 에 영향.

본 논문은 GitHub README 가 "Visualization 모듈 예정" 이라 표기 → 부록 시각화는 있을 가능성 큼.

## 베이스라인 공정성 평가

검색으로 확보한 정보로는 (i) baseline reproduce 인지 paper-reported 인지 (ii) hyperparameter tuning 동등성이 불명. KV cache 분야는 baseline reimpl 시 hyperparam 에 sensitive 하고, 같은 baseline 을 다른 논문이 다른 점수로 보고하는 경우 흔함. 본 논문이 baseline 수치를 어디서 가져왔는지 (자체 reimpl vs 원 논문) 가 비교 신뢰성의 핵심.

## 핵심 한 문장

> **헤드라인 두 수치 (+11.34, +5.60) 는 framework 의 실용 가능성을 강력히 시사하나, (i) average 의 단위, (ii) budget/pruning ratio 의 sensitivity, (iii) causal intervention 의 부재 가능성 세 디테일이 본문 확보 후 검증 우선순위.**
