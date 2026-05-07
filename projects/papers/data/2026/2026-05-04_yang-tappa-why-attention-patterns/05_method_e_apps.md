# 05. 방법론 해부 — Part E: 응용으로의 번역 (KV cache & pruning)

## 왜 이 부분이 필요한가

이론이 옳아도 그것이 실용 metric 으로 매끄럽게 환산되지 않으면 ICLR reviewer 는 "interesting framing, weak engineering" 으로 본다. 본 절은 q-similarity 가 KV cache 압축 / structural pruning 의 두 응용에 어떻게 직접 입력되는지 정리.

## 응용 1 — KV cache budget allocation

### 표준 setting

LLM inference 시 모든 layer × 모든 token 의 (key, value) 를 메모리에 보관하는 KV cache 의 메모리 사용량은:
$$M = 2 \cdot L \cdot T \cdot H \cdot d_h \cdot \text{bytes}$$
($L$ = layer 수, $T$ = context length, $H$ = head 수, $d_h$ = head dim, factor 2 = K + V). 64K context 의 Llama-3-70B 추정 → 수십 GB. 압축 필수.

전형적 KV cache 압축 framework:
1. **Layer 별 budget** $B_l$ 결정 (총합 = target budget)
2. **각 layer 내** 보존할 token 선택 (heavy hitter / recent / sink anchor 등)
3. 나머지 token 의 K/V 폐기

전통적으로는 **모든 layer 에 균등 budget** 또는 **layer importance 휴리스틱** (e.g. layer-wise attention entropy) 사용.

### TAPPA 의 layer-wise budget rule

**핵심 직관**: q-similarity $S_l$ 이 **낮은** layer 는 query 가 step 마다 크게 바뀌므로 **다양한 과거 token 이 매번 새로 필요** → budget 더 줘야 함. q-similarity 가 높은 layer 는 query 가 거의 동일 → 매번 같은 소수 token 만 필요 → budget 적게.

수식 (필자 재구성):
$$B_l = B_\text{total} \cdot \frac{f(1 - S_l)}{\sum_{l'} f(1 - S_{l'})}$$

$f$ 는 단조증가 normalization (softmax-with-temp 또는 단순 linear). 검색 스니펫: *"q-similarity is instantiated using cosine similarity, which is used to compute the layer-wise score for KV cache compression."*

**4줄 해석**

- **기호 뜻**: $B_l$ = layer $l$ 이 받는 token 보유 quota. $B_\text{total}$ = 전체 budget (예: 평균 token 당 N 개).
- **일상 비유**: 회사가 부서마다 사무실 면적을 배정할 때, 일이 매번 새로운 부서 (R&D, low $S_l$) 에 큰 사무실, 일이 반복적 부서 (회계, high $S_l$) 에 작은 사무실. TAPPA 는 layer 의 "일 변동성" 으로 면적 정하기.
- **왜 이 형태**: theoretical framing 에서 직접 — predictable layer 는 redundant 가 많아 큰 budget 불필요. unpredictable layer 가 over-truncate 되면 정보 손실 큼.
- **조심할 점**: $S_l$ 이 input prompt 의존 (long-context QA 와 short chat 에서 같은 layer 의 $S_l$ 다를 수 있음). 따라서 **dynamic per-prompt** 측정인지 **static profiling** 인지가 디테일.

### 결과

스니펫 직접 인용: *"For KV cache compression, lower q-similarity is assigned more budget (token retention), achieving up to +11.34 average gain over EA (NVIDIA, 2025) on Qwen2.5 at budget 512."*

EA (Expected Attention, NVIDIA arXiv:2510.00636 2025) 는 KV cache 압축의 강한 baseline. +11.34 가 어떤 metric 인지 (LongBench 평균 점수 추정) 명확치 않으나, 휴리스틱 baseline 대비 두 자릿수 개선이면 의미 있는 발전.

## 응용 2 — Structural pruning

### 표준 setting

LLM 의 layer 수를 줄이는 structural pruning. ShortGPT (Baichuan 2024) 는 layer importance 를 probe (e.g., perplexity drop after layer skip) 로 측정하고 importance 낮은 layer 를 drop.

### TAPPA 의 pruning probability

**핵심 직관**: q-similarity 가 **높은** layer 는 query 가 step 간 거의 동일 → 그 layer 가 더 add 하는 information 이 작음 → drop 해도 큰 손실 없음. (Reverse of KV: 거기선 high-$S$ 가 redundant token 보유, 여기선 high-$S$ 가 redundant layer 자체.)

수식 (필자 재구성):
$$p_l^\text{prune} = \frac{g(S_l)}{\sum_{l'} g(S_{l'})}$$

$g$ 는 단조증가. 보다 단순하게는 **top-$k$ layers by $S_l$** 를 drop.

### 결과

스니펫: *"for LLM structural pruning, higher q-similarity corresponds to a higher pruning probability, achieving up to +5.60 average gain over ShortGPT (Baichuan 2024) on Llama-3.1-8B."*

ShortGPT 가 강한 baseline 인데 +5.60 평균 (downstream task accuracy 추정) 향상이면 robust.

## 두 응용의 대칭성 — 본 framework 의 우아함

같은 metric $S_l$ 이 두 응용에서 **반대 방향** 으로 쓰인다:
- KV cache: **low** $S_l$ → **more** budget (token 을 보존)
- Pruning: **high** $S_l$ → **more** pruning prob (layer 자체를 제거)

두 방향 모두 "redundancy" 의 같은 정의 — high $S_l$ 면 그 layer 의 query 가 시간적으로 redundant → (a) 그 layer 가 보존할 token 도 적어도 됨 (KV), (b) 그 layer 자체를 빼도 됨 (pruning). 한 metric 으로 양 방향 응용 가능한 점이 framework 의 진짜 가치.

## 다른 응용으로 갈 수 있다면

대안 1: **Adaptive computation** — high $S_l$ layer 는 sparse attention (top-k key) 로 전환, low $S_l$ layer 는 full attention. 본 논문 미언급.

대안 2: **Speculative decoding 의 verification** — q-similarity 높은 layer 는 draft 모델 prediction 을 그대로 신뢰, 낮은 layer 만 verify. 미언급.

대안 3: **Continual learning 의 plasticity 신호** — high $S_l$ layer 는 stale, fine-tune 시 그 layer 에 더 큰 LR. 미언급.

본 논문이 KV/pruning 두 vertical 만 다룬 건 ICLR scope 한계 (한 paper 에 모든 응용 못 담음). 후속 연구 여지 큼.

## 핵심 한 문장

> **단일 metric q-similarity 가 추가 학습 없이 inference 시간에 측정 가능하면서 KV cache 와 structural pruning 두 다른 vertical 에 (방향 반대로) 적용 가능하다는 사실이 TAPPA framework 의 실용 layer 의 본질적 가치다 — metric 한 개가 두 응용에서 SOTA 를 갱신했다는 점에서 framework 의 robustness 를 간접 증명한다.**
