# 02. 3층 TL;DR

## 🧒 초등학생 수준

수백 개의 머리(head)를 가진 거대한 책 읽는 로봇(LLM, 거대언어모델 — 사람처럼 글을 쓰는 인공지능)이 있다고 생각해 보자. 각 머리는 책장의 어떤 줄을 어디에 연결할지 결정하는데, 그 연결선들을 모아 그리면 묘하게 같은 모양이 자꾸 반복해서 나타난다. 어떤 머리는 **대각선** 모양 (바로 앞 단어만 본다), 어떤 머리는 **첫 단어만 빨아들이는 막대** 모양 (이 첫 단어는 "쓰레기통" 처럼 쓰인다고 알려져 있다), 또 어떤 머리는 **드문드문 다시 같은 자리로 돌아가는 점선** 모양이다.

지금까지 과학자들은 이 모양들을 하나씩 따로 발견했고 ("아, 대각선이 있네", "아, 흡인구가 있네") 각각 다른 이유로 설명했다. 이 논문은 한 번에 묻는다. **"세 모양 모두 같은 한 가지 원리에서 나오는 게 아닐까?"**

저자들의 답은 두 가지 재료의 조합이다. (1) 로봇이 단계마다 던지는 "질문 벡터" 가 시간이 지나도 비슷한지 (= **질문 자기유사도**, q-similarity). (2) 위치 정보를 회전으로 표현하는 트릭 (RoPE) 의 **빠른 회전 부분이냐 느린 회전 부분이냐**. 이 두 다이얼만 돌리면 세 모양이 자동으로 튀어나온다는 것이다. 게다가 이 발견을 써서 메모리 절약(KV cache 압축) 과 모델 가지치기(pruning) 도 더 잘 된다는 걸 보여줬다.

## 🎓 학부생 수준

Transformer (자가어텐션 기반 신경망 모델) 의 attention map (어떤 토큰이 어떤 토큰을 얼마나 보는가의 행렬) 은 layer × head 단위로 들여다보면 **재현되는 시각적 motif** 가 있다 — diagonal stripe, attention sink, retrieval/reaccess pattern 같은 것들. 기존 연구는 이 motif 들을 각각 (i) 위치 인코딩의 고주파 성분 (Press et al. ALiBi 2022, Su et al. RoPE 2024), (ii) 첫 토큰의 큰 norm (Xiao et al. 2023 attention sink), (iii) 특정 retrieval head 의 학습 결과 (Wu et al. ICLR 2025) 등 **개별 메커니즘** 으로 설명해 왔다.

TAPPA (Temporal Attention Pattern Predictability Analysis) 는 이걸 하나의 우산 아래에 둔다. 핵심 가설은:

> **"step 단위 query 벡터의 시계열 $\{q_t\}_{t=1}^T$ 의 자기유사도 $S(\Delta t) = \cos(q_t, q_{t+\Delta t})$ 가 높을수록 attention 확률 분포 $\alpha_t$ 도 시간 차원에서 예측 가능 (predictable) 하다."**

여기서 $q_t \in \mathbb{R}^d$ 는 step $t$ 의 query, $\cos$ 은 코사인 유사도. 이 $S$ 가 1에 가까우면 다음 step 의 attention 도 직전 step 과 거의 같다는 결론. 거기에 RoPE (Rotary Position Embedding — 위치 $m,n$ 의 쌍에 회전행렬을 곱해 상대거리만 의존하게 만드는 PE) 의 **저주파 채널** 이 결합하면 멀리 떨어진 동일 토큰이 안정적으로 재참조 (retrieval/reaccess) 되고, **고주파 채널** 이 결합하면 인접 토큰만 보는 diagonal/slash 패턴이 된다는 정리(Theorem 5.2 등) 를 제시한다.

응용으로 (a) KV cache 압축 시 **q-similarity 가 낮은** 레이어에 더 많은 메모리를 할당 (불안정한 query 일수록 더 많은 과거 정보 필요), (b) pruning 시 **q-similarity 가 높은** 영역을 우선 잘라낸다 (예측 가능 = redundant 가능성 높음). Qwen2.5 와 Llama-3.1-8B 에서 EA(NVIDIA 2025), ShortGPT(Baichuan 2024) 대비 각각 +11.34, +5.60 평균 점수 향상.

## 🔬 전문가 수준

Contributions (필자가 본 4개):

1. **통합 framing 제안**: attention pattern 을 (predictable, unpredictable) 의 이항 분류로 환원하고, predictable 영역 안에서 (re-access, sink, slash/diagonal) 세 patterns 을 query temporal continuity × RoPE frequency-channel response 의 **2축 격자** 로 위치시킨다. 이 framing 은 종래의 "head-typology" (induction head, copy head, retrieval head, sink head ... 의 categorical labeling) 를 **연속적 phase diagram** 으로 바꾸려는 시도다.

2. **이론적 결과**: 핵심은 Theorem 5.2 (Sequential Patterns under High Self-similarity). RoPE 의 회전 행렬 $R_\theta$ 는 query/key 의 simultaneous shift $(q_t, k_n) \to (q_{t+1}, k_{n+1})$ 에 대해 $q_t^\top R_{\theta(n-t)} k_n$ 형태의 attention score 를 보존 (translation-equivariant) 한다. $q_t, k_n$ 모두 self-similarity 가 높으면 score 가 $(+1,+1)$ 대각선 방향으로 propagate → slash/diagonal pattern. Re-access 와 sink 는 RoPE 저주파 channel 의 alignment-preserving 성질로 별도 조건으로 유도. 

3. **실용 metric 제안**: layer-wise q-similarity $S_l = \frac{1}{|W|} \sum_{(t,t') \in W} \cos(q_t^{(l)}, q_{t'}^{(l)})$ (recent window $W$ 내). 이 $S_l$ 을 KV cache budget allocation 의 **inverse** 로 (낮은 $S_l$ → 큰 budget), pruning probability 의 **proportional** 로 사용.

4. **경험적 검증**: KVCache 압축에서 EA(Expected Attention, NVIDIA 2025) 대비 Qwen2.5 budget 512 setting 에서 +11.34 점, structural pruning 에서 ShortGPT(Baichuan 2024) 대비 Llama-3.1-8B 에서 +5.60 점. 이론 → 실용 다리가 끊기지 않았음을 보여준다.

방어 가능한 핵심: q-similarity 를 측정하는 데 추가 학습이 필요 없다 (run-time metric). 한계: (i) "두 축 격자" 가 정말 모든 head 를 커버한다는 보장은 없다 (induction head, K-V copy 등은 미언급), (ii) RoPE 가 아닌 PE (NoPE, ALiBi, learned) 에 대해서는 직접 확장하지 않음, (iii) 검색 스니펫 한계로 정확한 ablation matrix 미확인. 섹션 06·07 참조.
