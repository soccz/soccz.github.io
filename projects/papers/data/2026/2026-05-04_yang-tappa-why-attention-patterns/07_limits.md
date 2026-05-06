# 07. 가정·한계·반박

## 명시된 가정 (저자가 직접 말한 것)

1. **RoPE 가정**: 본 framework 의 핵심 정리 (Theorem 5.2 등) 는 RoPE relative-position encoding 을 전제. ALiBi, NoPE, learned PE 에 대한 직접 적용 보장 없음.
2. **Predictable / Unpredictable 이항 분류 가능**: attention pattern 이 두 부류로 가분 (separable) 하다고 가정. 경계가 어디인지는 metric 의 hyperparameter 로 처리.
3. **Inference time setting**: 학습 후 고정 모델의 inference 시 query/key 를 분석. 학습 동안의 dynamics (Lyle 2025 의 grokking 관점) 는 다루지 않음.

## 암묵적 가정 (말 안 했지만 깔린 것)

### 1. Query 의 self-similarity 가 task / domain 무관하게 stable
모든 분석은 query 시퀀스의 step-to-step cosine 이 의미 있는 통계량이라는 전제. 그러나:
- **Code generation** 에서는 token-level cyclic syntax 가 query 를 강하게 oscillate 시킬 수 있음 — q-similarity 가 prompt 마다 크게 다름.
- **Multilingual prompt** 에서는 언어 전환 boundary 에서 query 가 jump.
- **Long-context QA** 에서는 question 부분과 context 부분의 query distribution 이 다름.

이런 heterogeneity 가 layer-wise 단일 $S_l$ 로 환원 가능한가는 자명하지 않음. 본 논문이 한 두 task 에서만 테스트했다면 이 가정의 robustness 가 의문.

### 2. Layer 가 head 의 pure aggregator 이상의 구조 없음
$S_l$ 은 layer 평균. 그러나 한 layer 안에서도 head 별 motif 가 매우 다름 (Voita 2019 specialized heads). 평균이 head-level 신호를 평탄화하면 정보 loss. 만약 head-wise scoring 이 layer-wise 보다 훨씬 우월하다면, 본 논문의 layer-wise 결과는 sub-optimal point.

### 3. RoPE channel 의 frequency band 가 head 와 무관
$\theta_i$ 는 RoPE 정의상 dimension index 의 함수이고 head 와 무관. 그러나 학습된 $W_Q, W_K$ projection 이 frequency band 별로 다른 weight 분포를 가지면 head 별 effective frequency response 가 다름. 본 framework 가 그 점을 감안하는지 불명.

### 4. q-similarity 측정의 inference latency 무시
매 step 마다 window $w$ 의 query pair 에 대해 cosine 계산 → $O(L \cdot w^2 \cdot d_h)$. small $w$ 에서는 무시 가능하나 KV cache 의 시간 critical path 에 들어가면 압축 gain 을 latency 가 갉아먹을 수 있음.

## 반박 가능한 지점

### 반박 1: NoPE LLM 에서 retrieval / sink 가 발생한다면 framework 의 universality 가 부서진다

**근거**: Kazemnejad et al. (NeurIPS 2023) "The Impact of Positional Encoding on Length Generalization in Transformers" 는 NoPE (positional encoding 없이) Transformer 가 일부 task (e.g., copy, retrieval) 에서 RoPE 보다 우수한 length generalization 을 보임. 즉 NoPE 에서도 retrieval head 패턴이 학습됨. 만약 q-similarity 가 NoPE 모델에서도 같은 motif typology 를 예측한다면 RoPE-frequency decomposition 은 framework 의 부수 요소가 되고 (q-similarity 가 진짜 본질), 만약 NoPE 에서 패턴이 무너진다면 framework 의 RoPE 의존성이 본질이라는 의미.

**검증 실험**: NoPE Llama (Kazemnejad 의 fork) 에서 (i) attention map 의 motif 분류, (ii) q-similarity 측정, (iii) 둘 사이 회귀. RoPE 모델과 비교. 6 GPU-day 정도. 본 논문이 이 비교를 안 했다면 reviewer 가 가장 먼저 요구할 점.

### 반박 2: Theorem 5.2 의 "high self-similarity" 가 정량 임계값을 갖지 못하면 metric 의 이론적 정당화는 한정적

**근거**: 정리가 $\epsilon \to 0$ 에서 만 attention propagation 을 보장한다면 finite $\epsilon$ 의 경우의 quantitative behavior 는 미해결. 실제 LLM 의 query self-similarity 는 0.7~0.95 정도 (head 별로 추정), 즉 $\epsilon = 0.05 \sim 0.3$. 이 "moderate" regime 에서 정리의 bound 가 tight 한지가 응용의 정당성 결정.

**검증 실험**: 합성 데이터 (controlled $S_l$) 로 attention map 시뮬레이션 → bound 와 실제 deviation 의 ratio 측정. 이론과 경험의 gap 정량화. 1 GPU-week.

### 반박 3: 단일 metric 으로 두 응용에 우월하다는 주장은 selection bias 가능

**근거**: 같은 metric 으로 KV cache 와 pruning 모두 SOTA 라는 결과는 매력적이지만, 두 응용의 baseline 이 모두 metric 이 미흡한 영역 (KV cache 는 future query distribution 추정의 어려움, pruning 은 layer importance 의 흔들림) 일 가능성. metric 이 우월하다기보다 baseline 들이 약했을 수 있음.

**검증 실험**: q-similarity 가 의미 없는 응용 (e.g., training-time gradient routing) 에 강제 적용 후 실패하는지 확인. 만약 어디서나 잘 작동한다면 metric 자체가 trivially good (예: norm proxy), 만약 일부에서 실패한다면 신뢰성 증명.

### 반박 4: q-similarity 가 task 와 무관한 시간적 통계량이라면 task accuracy 를 직접 예측 못 한다

**근거**: framework 가 attention pattern 을 설명할 뿐 그 pattern 이 down-stream accuracy 에 어떻게 기여하는지 (예: retrieval head 가 깨지면 accuracy drop) 의 다리는 본 논문 미언급. 즉 layer 를 prune 했을 때 attention pattern 이 깨진 정도와 task accuracy drop 사이의 mediation 미증명.

**검증 실험**: Pruning 후 (i) attention pattern shift 측정, (ii) task accuracy drop 측정, (iii) 두 변화의 correlation. mediation 강하면 framework 신뢰성 증가, 약하면 metric 이 task-relevant 신호가 아닌 다른 무엇 (e.g., layer norm scale) 의 proxy.

## 재현성 평가

- **코드 공개**: 부분적. GitHub `MIRALab-USTC/LLM-TAPPA` 가 KVCache 모듈 (q-similarity guided budget allocation) 만 공개. Pruning, Visualization 모듈 "예정". 즉 헤드라인 +5.60 (pruning) 결과 재현 불가능 (현재 시점 기준 2026-04 말 ~ 5월 초).
- **데이터**: LongBench / MMLU 등 공개 benchmark 추정.
- **Hyperparameter**: window size $w$, frequency threshold $\theta_*$ 등의 sensitivity 가 보고되지 않으면 reproduction 시 차이 큼.
- **변산성**: 평균만 보고됐는지 분산도 보고됐는지 (스니펫에서 단일 수치 +11.34, +5.60 만 확인 → 분산 미확인). 단일 seed 평균이라면 ±2 정도의 noise 가능.
- **GitHub commit history 확인 필요**: 2026-02-04 첫 release, 그 후 update 빈도 확인 시 maintenance 강도 파악 가능.

## 핵심 한 문장

> **본 framework 의 가장 큰 약점은 RoPE-기반 모델로의 한정성 (NoPE/ALiBi 미검증), Theorem 5.2 의 quantitative bound 모호성, 그리고 metric → attention pattern → task accuracy 의 mediation 미증명 — 이 셋이 함께 닫혀야 framework 가 진정한 universal 이론 지위를 얻는다.**
