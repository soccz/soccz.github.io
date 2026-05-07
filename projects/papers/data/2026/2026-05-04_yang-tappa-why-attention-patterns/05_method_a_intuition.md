# 05. 방법론 해부 — Part A: 큰 그림 (시간 연속 관점)

## 배경 사다리

이 절을 이해하려면 ① **causal LLM inference** 가 step $t = 1, 2, \dots, T$ 에서 한 token 씩 생성하면서 매 step query $q_t$ 를 새로 만들고 모든 과거 key $k_1, \dots, k_t$ 와 inner product 한다는 것, ② 그 결과 attention vector $\alpha_t \in \Delta^{t-1}$ (확률 simplex) 가 매 step 길이가 늘어나는 시계열을 이룬다는 것 — 이 둘만 알면 된다.

## 큰 그림

기존 연구들은 attention map 을 **공간적 (한 시점의 $T \times T$ 행렬)** 객체로 본다. TAPPA 의 발상 전환은 이걸 **시간적 (step 마다 길어지는 시퀀스)** 객체로 본다는 데 있다. 즉 같은 head 의 attention 을:

$$\{\alpha_t\}_{t=1}^T, \quad \alpha_t \in \Delta^{t-1}$$

으로 쓰고, 이 시퀀스의 **시간 차원의 자기상관** 을 분석 대상으로 삼는다.

이렇게 보면 자연스럽게 두 질문이 나온다:
- **(Q1)** $\alpha_t$ 와 $\alpha_{t+1}$ 가 얼마나 닮았는가? — predictability
- **(Q2)** 닮음의 패턴은 어떤 구조를 가지는가? — re-access (멀리 떨어진 같은 위치 반복) / sink (첫 위치 고정) / slash (인접 위치)

저자들의 핵심 발상은 (Q1) 이 **거의 전적으로 query 시퀀스 $\{q_t\}$ 의 자기유사도** 에 의해 결정된다는 것이다. 왜? attention 은 $\alpha_t = \mathrm{softmax}(q_t^\top K_t / \sqrt{d})$ 이고 (causal mask), key matrix $K_t = [k_1, \dots, k_t]$ 는 한 step 에 한 column 만 추가될 뿐 기존 columns 는 불변. 따라서 $\alpha_{t+1} - \alpha_t$ 의 변동성의 source 는 (i) $q_{t+1} - q_t$ 의 변화, (ii) $k_{t+1}$ 의 새 column 추가. (ii) 는 새 query 와의 dot-product 한 항의 추가로 통제 가능하므로, 본질적으로 (i) 가 지배. 그러므로:

> **"Query 자기유사도 = attention 패턴 예측가능성의 sufficient signal"**

이라는 가설이 그럴듯해진다.

(Q2) 는 (Q1) 의 미시구조다. attention map 의 두 정보소스가 query 내적에 어떻게 들어가는가:
- query 의 방향성 (semantic 정보)
- RoPE 가 query/key 위치 정보로 곱하는 회전 (positional 정보)

전자는 학습된 representation 에 의존, 후자는 PE 메커니즘에 의존. RoPE 는 dimension 별로 주파수가 정해진 회전이므로 channel 마다 다른 주파수 응답을 갖는다. 저주파 (느린 회전) channel 은 멀리 떨어진 query-key pair 의 정렬을 보존, 고주파 (빠른 회전) channel 은 작은 위치 차이만 정렬 보존 — 이 사실로부터 자연스럽게 (re-access ↔ low-freq, slash ↔ high-freq) 의 매핑이 나온다.

## 다이어그램 지문 (본문 그림 추정)

본문 Figure 1 (저자 framing 그림) 은 대략 이런 구조일 것이다:

```
              high q-similarity     low q-similarity
            +------------------+------------------+
low-freq    |    re-access /   |   sink (residual)|
RoPE 우세   |    sink          |    or noise      |
            +------------------+------------------+
high-freq   |    slash /       |    unpredictable |
RoPE 우세   |    diagonal      |    (random-look) |
            +------------------+------------------+
```

(2 × 2 phase diagram. 실제 본문에 phase diagram 표기로 등장하는지는 미확인 — 검색 스니펫엔 직접 안 나옴. 그러나 framing 의 논리상 이 구조가 자연스럽다.)

## 다른 접근으로 했다면

대안 1: **공간적 통계 (e.g. attention entropy, top-k mass)** 만으로 motif 를 분류 — 기존 SnapKV / H2O 노선. 한계: head 의 시간 진화를 무시. TAPPA 가 우월한 이유는 시간 통계량 (q-similarity) 이 단일 시점 통계량이 잡지 못하는 head 동학을 잡음.

대안 2: **PE 만 보고 attention motif 를 예측** — Press 2022 ALiBi · Su 2024 RoPE 의 분석. 한계: 같은 PE (RoPE) 라도 head 마다 다른 motif 가 나오는 사실을 설명 못함 (PE 는 head-invariant, motif 는 head-variant).

대안 3: **head representation 만 보고 motif 분류** — Wu 2025 retrieval head 같은 학습 후 head probe. 한계: PE 를 갈아끼우면 motif 가 어떻게 바뀌는지 예측 불가.

TAPPA 의 의의는 **세 대안의 공집합** — query 동학 (alternative 3 의 일부) 과 PE 메커니즘 (alternative 2) 을 곱한다. 이게 새 framing 인지 단순한 양 노선의 합인지는 reviewer 가 가를 부분.

## 핵심 한 문장

> **TAPPA 의 method 1차 contribution 은 attention 패턴의 인과 변수를 (query 자기유사도, RoPE channel 주파수) 의 곱으로 환원한 데 있고, 그 곱이 충분 통계량으로 기능하면 (Theorem 5.2) 패턴의 형태가 강제되며, 그 metric (q-similarity) 이 학습 없이 inference 시간에 측정 가능하므로 즉시 KV/pruning 에 응용된다.**
