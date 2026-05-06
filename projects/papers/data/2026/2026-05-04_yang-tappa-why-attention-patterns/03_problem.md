# 03. 문제 지형도 — "패턴은 왜 존재하는가" 라는 무거운 질문

## 배경 사다리

이 절을 이해하려면 ① **attention map** 이 "각 위치 $t$ 의 query 가 모든 key $n \le t$ (causal mask 가정) 에 얼마나 가중치를 주는지" 의 $T \times T$ 행렬이라는 것, ② attention map 을 그림으로 그리면 layer/head 마다 시각적 motif (대각선·세로 막대·점박이 등) 가 반복된다는 경험적 관찰이 있다는 것 — 이 두 가지면 충분하다. RoPE / sink head 같은 용어는 본 절 안에서 풀이한다.

## 문제가 현실에서 어떻게 등장하는가

**상황 1: KV cache 폭발**. 64K token context 의 LLM 을 추론할 때 모든 layer 가 모든 과거 token 의 key/value 를 메모리에 올려놓는 비용은 모델 파라미터 비용보다 크다. 어느 token 을 버려도 출력 품질이 거의 안 바뀌는지 (= "쓸모없는 attention 부분이 어디인가") 를 알면 메모리를 절감한다. 그런데 어느 head 의 어느 token 이 redundant 인지를 일반 원칙으로 알 길이 없어, 휴리스틱이 난립 (StreamingLLM, H2O, SnapKV, EA …).

**상황 2: head pruning / structural pruning**. Llama-3.1-8B 를 모바일에 올리려면 layer 수를 30→15 로 줄여야 하는데, 어느 layer 가 redundant 인지를 정량으로 정하지 못해 "perplexity 영향 작은 layer 부터" 같은 사후식 휴리스틱 (ShortGPT) 에 의존. 이 의존이 hardware-dependent 이고 task-dependent.

**상황 3: 해석가능성의 분절화**. attention sink 는 Xiao 2023 이 "softmax 의 degenerate solution 회피" 로, retrieval head 는 Wu 2025 가 "long-context factuality 를 담당하는 head" 로, slash pattern 은 arXiv:2601.08297 이 "RoPE 고주파의 결과" 로 — 각각 다른 개념적 언어로 이야기된다. 같은 attention map 위에서 같은 시간에 일어나는 현상들이 **공통 원인** 인지, 단지 표면적 유사인지 모른다.

이 세 상황은 표면적으로 다르지만 모두 같은 질문에 의존한다: **"attention pattern 의 모양은 어떤 latent factor 의 함수인가?"** 그 factor 를 알면 (1) 고가치 token 을 보존하고 (2) 저가치 layer 를 자르고 (3) 파편화된 헤드 분류를 통합할 수 있다.

## 기존 접근 계보

### 1세대: 시각적 분류 (2019~2021)
**Clark et al. 2019** ("What Does BERT Look At?") 와 **Voita et al. 2019** ("Specialized Heads Do the Heavy Lifting") 가 BERT/Transformer-base 의 head 를 syntactic head, positional head, rare-word head 로 나눈다. 방법은 사람이 attention map 을 눈으로 본 뒤 "이 head 는 다음 token 에 attention 이 집중된다" 같은 묘사를 한다. **부족했던 점**: 묘사적 (descriptive) — 왜 그런 head 가 학습되는지 메커니즘 설명 없음. **남긴 교훈**: 패턴이 head 단위로 reproducible 하다는 사실 자체는 robust.

### 2세대: 인과적 회로 분석 (2022~2023)
**Olsson et al. 2022** ("In-context Learning and Induction Heads") 가 induction head (이전에 본 token 패턴을 다시 인식하는 head) 를 인과적 ablation 으로 분리. **Wang et al. 2023** ("IOI Circuit") 와 **Conmy et al. 2023** ("ACDC") 가 multi-head 회로 자동 발견. **부족했던 점**: 한 task (modular addition, IOI) 에 한정. 일반 corpus 의 다양한 패턴까지 커버 못함. **교훈**: causal intervention 이 attention 해석의 표준 방법론으로 정착.

### 3세대: 위치 인코딩 메커니즘론 (2022~2025)
**Press et al. 2022** (ALiBi), **Su et al. 2024** (RoPE), **Kazemnejad et al. 2023** (PE length-gen) 등이 **PE 가 attention 의 거리-decay 모양을 결정** 한다는 것을 증명·분석. **Foumani et al. 2024** (tAPE/eRPE) 와 같은 후속이 도메인 특화 변형. **부족했던 점**: PE 자체를 구성요소로 보지만 query/key 의 시간 진화와 결합한 메커니즘 설명은 부재. **교훈**: PE 는 motif 의 절반만 결정한다 (나머지 절반은 query/key 동학).

### 4세대: head-typology (2023~2025)
**Xiao et al. 2023** (StreamingLLM) → attention sink head 를 **softmax 의 분모 보존** 으로 설명. **Wu et al. ICLR 2025** ("Retrieval Head Mechanistically Explains Long-Context Factuality") → retrieval head 가 long-context factual recall 의 caries 라는 인과 증명. **arXiv:2601.08297** ("Demystifying the Slash Pattern") → slash 가 RoPE 고주파의 결과. **부족했던 점**: 각 head type 별로 다른 메커니즘론 — 통합 framework 부재. **교훈**: 통합 시도가 시급하다는 인식이 만연.

### 5세대: KV cache 압축의 휴리스틱 분화 (2024~2026)
**StreamingLLM** (sink + recent), **H2O** (heavy hitter), **SnapKV** (recent attention concentrated), **EA / Expected Attention** (NVIDIA 2025, future-query-distribution 추정) 등 휴리스틱이 폭증. 각자 다른 가정으로 어느 token 을 살릴지 결정. **부족했던 점**: 휴리스틱이 모델·task 에 fragile. **교훈**: 메커니즘론이 실용 metric 의 우월성을 결정한다.

## 공통 gap

5세대 모두를 관통하는 gap 한 문장:

> **"Attention pattern 은 인지되지만, '왜 이 패턴이 이 head 에 나오는가' 의 first-principles 답이 없다."**

기존 방법은 "pattern → 분류 label" 또는 "pattern → 휴리스틱 use" 로 갔지, "pattern ← latent factor" 의 역방향 인과는 부재. 이 부재 때문에 (a) 새 모델·새 PE 가 나오면 매번 head 분류를 재시작해야 하고, (b) KV/pruning 휴리스틱의 일반화 한계가 모델 의존적이고, (c) 해석가능성과 실용 acceleration 이 같은 언어를 못 쓴다.

## TAPPA 의 답

TAPPA 는 latent factor 를 **두 개로 환원** 한다:
- **(F1) Query 시간 자기유사도** $S(\Delta t) = \cos(q_t, q_{t+\Delta t})$
- **(F2) RoPE 회전 채널의 frequency band** (low-freq 채널이 우세하면 long-range alignment 보존, high-freq 가 우세하면 인접만)

그리고 (F1, F2) 의 격자 위에 (re-access, sink, slash) 세 patterns 을 위치시킨다 (high $S$ × low-freq → re-access; low $S$ × high-freq → noise/unpredictable; high $S$ × high-freq → slash; sink 는 query-key initial geometry + low-freq 의 결합).

이 framing 의 매력은 **PE 와 query 동학을 분리하지 않고 곱한** 데 있다. 5세대까지 PE-쪽 (3세대) 과 head-쪽 (4세대) 이 평행하게 진행됐는데, TAPPA 는 그걸 명시적으로 "PE channel response × query temporal continuity" 의 곱으로 본다. 이게 이 논문의 framing 한 줄이고, 본 해체는 이 한 줄이 정말 (i) 이론적으로 닫혀 있는지 (ii) 실용 metric 이 그 이론을 기반으로 우월한지 (iii) 가정의 한계가 어디인지 를 본격적으로 본다.
