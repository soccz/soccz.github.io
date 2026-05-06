# 05. 방법론 해부 — Part C: RoPE 의 주파수 채널 분해

## 왜 이 부분이 필요한가

q-similarity 가 attention 의 시간 변동을 통제한다 해도, 그 변동이 **공간적으로 어디로 propagate** 하는지 (대각선 / 첫 토큰 / 멀리 떨어진 같은 위치) 는 PE 가 결정한다. RoPE 의 회전이 dimension 에 따라 다른 주파수를 갖는 사실이 그 분해의 출발.

## RoPE 표준식 복습 (배경 사다리)

RoPE (Su et al. 2024) 는 query/key 를 **2차원 쌍** 으로 묶어 위치 의존 회전을 곱한다. dimension index $i = 0, 1, \dots, d/2 - 1$ 에 대해 회전 각속도를:

$$\theta_i = b^{-2i/d}, \quad b = 10000$$

으로 정한다. 위치 $m$ 의 query 의 $i$-번째 2D-쌍은 회전행렬:

$$R(m\theta_i) = \begin{pmatrix} \cos(m\theta_i) & -\sin(m\theta_i) \\ \sin(m\theta_i) & \cos(m\theta_i) \end{pmatrix}$$

으로 곱해진다. 핵심 성질: $q_m^\top k_n$ 의 RoPE-version 은 상대거리 $n - m$ 에만 의존:

$$\langle q_m, k_n \rangle_\mathrm{RoPE} = \sum_{i=0}^{d/2-1} \big[\, q_m^{[i]\top} R((n-m)\theta_i) k_n^{[i]} \,\big]$$

**4줄 해석**

- **기호 뜻**: $q_m^{[i]} \in \mathbb{R}^2$ 는 $i$-번째 2D 쌍 (channel). $\theta_i$ 는 그 channel 의 회전 각속도. $b = 10000$ 은 base — Vaswani 2017 sinusoidal PE 에서 물려받음.
- **일상 비유**: 시계의 초침/분침/시침이 다른 속도로 회전하듯, RoPE 의 dim 별 회전이 다른 주파수. 초침 (high $\theta_i$) 은 1초만 지나도 크게 회전 → 인접 위치 정보 민감, 시침 (low $\theta_i$) 은 1시간 가야 1/12 만 회전 → 멀리 떨어져도 정렬 보존.
- **왜 이 형태**: 기하수열 $\theta_i = b^{-2i/d}$ 는 multi-scale 을 가장 효율적으로 cover. $b = 10000$ 은 max context length 의 log 와 비례하도록 tuned (Vaswani 의 "long enough" heuristic).
- **조심할 점**: $\theta_i$ 가 너무 작으면 (low-freq) 거의 정적 → query/key 가 변할 때 회전이 noise 에 가려짐. $\theta_i$ 가 너무 크면 (high-freq) 인접 token 도 정렬 깨짐. 그래서 **multi-band 이 본질**.

## TAPPA 의 분해 — Low-freq vs High-freq 채널

저자들의 분해 핵심은 channel 들을 두 group 으로:

$$\underbrace{i \in I_\mathrm{low} = \{i : \theta_i < \theta_*\}}_{\text{slow rotation}}, \quad \underbrace{i \in I_\mathrm{high} = \{i : \theta_i \ge \theta_*\}}_{\text{fast rotation}}$$

threshold $\theta_*$ 는 ablation 으로 결정 (본문 미확인). 그리고 attention score 를 두 group 의 기여 합으로 분해:

$$\langle q_m, k_n \rangle_\mathrm{RoPE} = A_\mathrm{low}(m, n) + A_\mathrm{high}(m, n)$$

검색 스니펫 직접: *"the low-frequency components of RoPE preserve alignment between queries and fixed keys even as time progresses"* + *"High-frequency components in RoPE have been demonstrated to be responsible for the formation of diagonal or previous-token patterns."*

### 수학적 직관

- **Low-freq channel**: $|n - m| \theta_i$ 가 작아서 $R((n-m)\theta_i) \approx I + (n-m)\theta_i J$ ($J = \begin{pmatrix} 0 & -1 \\ 1 & 0\end{pmatrix}$). 즉 회전이 거의 identity → 멀리 떨어진 $m, n$ 도 정렬 보존. 결과: 멀리서 retrieval/sink 가능.
- **High-freq channel**: $|n - m| \theta_i$ 가 $2\pi$ 를 빠르게 넘김. $|n - m|$ 이 작을 때만 $R$ 이 identity 근처. 즉 **인접 위치만** 정렬. 결과: diagonal/slash pattern.

이 분해는 본 논문의 **핵심 메커니즘 한 그림** 이다. 사실 같은 직관은 Su 2024 부터 (long-term decay 분석) 있었으나, TAPPA 는 그걸 **head 별 motif typology 와 직접 매핑** 한다.

## 다른 접근으로 했다면

대안 1: **NTK / fourier feature 분석** (Tancik 2020). RoPE 의 frequency band 를 NTK 식으로 학습 ‑ 일반화 영향까지 분석. 더 깊지만 실용 metric 추출은 어려움.

대안 2: **PE 를 학습 가능 (learned)** 으로 두고 channel response 자체를 학습. 그러면 motif 분석이 모델별로 다 달라져 **일반 framework** 라는 강점 사라짐.

대안 3: **NoPE (PE 없이) 만 사용**. Kazemnejad 2023 이 보였듯 retrieval / induction 일부 head 는 PE 없이도 학습됨. 그러나 motif 의 기하학적 구조 (정확한 slash 위치) 는 약화. TAPPA 는 RoPE 에 한정해 분석이 깊어짐.

저자가 RoPE 만 다룬 이유는 **모던 LLM 의 사실상 표준** (Llama-2/3, Qwen, Mistral, GPT-4 추정 모두 RoPE 변종) 이기 때문. 실용성 측면에서 합리적.

## 핵심 한 문장

> **RoPE 의 dimension-별 기하수열 주파수 분포는 자연스럽게 multi-band 응답을 만들고, low-freq 가 long-range alignment 를 (re-access/sink), high-freq 가 short-range alignment 를 (slash/diagonal) 담당하므로, motif typology 가 PE 의 spectrum 안에 이미 인코딩되어 있다.**
