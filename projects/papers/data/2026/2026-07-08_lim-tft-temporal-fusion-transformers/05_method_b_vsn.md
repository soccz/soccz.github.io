# 4. 방법론 B — Variable Selection Network (VSN)

## 왜 이 부분이 필요한가

기존 시계열 딥 모델들은 여러 개의 입력 변수 (예: 온도, 요일, 프로모션 여부, SNS 지표) 를 concat 해서 하나의 벡터로 처리한다. 그러면 (i) 어느 변수가 지금 시점에 얼마나 중요한지 알 방법이 없고, (ii) irrelevant 변수 (예: 이 상점에는 유가가 무관) 를 학습이 알아서 걸러야 하는데, MLP 는 이걸 명시적으로 학습하기 어렵다. 결과: 노이즈 변수에 오버피팅, 해석 불가.

VSN 은 이 두 문제를 동시에 푼다. 각 시점 $t$ 에서 각 dynamic input 변수 $\chi^{(j)}_t \in \mathbb{R}^{d_{model}}$ 에 대해 **어떤 변수가 얼마나 중요한지** 를 sparse-softmax weight 로 뽑고, 이 weight 로 변수별 GRN 출력을 가중합해 aggregate 한다.

## 수식

각 dynamic input 은 이미 임베딩되어 $\xi^{(j)}_t \in \mathbb{R}^{d_{model}}$ 로 표현되어 있다고 하자 ($j$는 변수 인덱스, 총 $m_\chi$ 개 변수). 이들을 concat 해 $\Xi_t = [\xi^{(1)}_t{}^\top, \ldots, \xi^{(m_\chi)}_t{}^\top]^\top \in \mathbb{R}^{m_\chi \cdot d_{model}}$.

**Step 1 — Variable selection weight**:
$$v_{\chi_t} = \text{Softmax}\bigl(\text{GRN}_{v_\chi}(\Xi_t, c_s)\bigr) \in [0, 1]^{m_\chi}$$

- **기호 뜻**: $v_{\chi_t}[j]$ = 시점 $t$ 에서 $j$ 번 변수의 상대적 중요도. $c_s$ = static covariate encoder 로부터 온 조건화 context 벡터 (static covariate 를 압축한 정적 정보). Softmax 는 $\sum_j v_{\chi_t}[j] = 1$ 을 강제.
- **일상 비유**: 요리사가 재료 5 가지 앞에서 "지금 요리에는 이 재료 70%, 저건 20%, 나머지 10%" 라고 저울에 눈금을 매기는 순간. 이 저울은 매 순간 바뀔 수 있다 (냄비 상태에 따라).
- **왜 이 형태**: (i) Softmax 라 합이 1 → "상대적 중요도" 로 해석 가능. (ii) $c_s$ 로 조건화 → static 정보 (이 매장은 마트/편의점) 에 따라 다른 변수가 중요해질 수 있음. (iii) GRN 으로 gating → 상황에 맞게 skip 가능.
- **조심할 점**: Softmax 는 "상대" 이지 "절대" 가 아님. 모든 변수가 다 무의미해도 softmax 는 여전히 하나에 몰아준다. Sparsemax 를 안 쓴 것은 gradient smoothness 를 위한 tradeoff.

**Step 2 — Variable-specific GRN 처리 + 가중합**:
$$\tilde{\xi}^{(j)}_t = \text{GRN}_{\tilde{\xi}^{(j)}}(\xi^{(j)}_t)$$
$$\tilde{\xi}_t = \sum_{j=1}^{m_\chi} v_{\chi_t}[j] \cdot \tilde{\xi}^{(j)}_t \in \mathbb{R}^{d_{model}}$$

- **기호 뜻**: 각 변수마다 자기 전용 GRN 이 있어 임베딩을 한 번 더 처리. 그 결과를 VSN weight 로 가중합.
- **일상 비유**: 각 재료를 각자의 손질기 (다지기, 갈기, 얇게 썰기) 를 통과시킨 뒤, 저울 눈금대로 냄비에 붓는 것.
- **왜 이 형태**: 변수별 GRN 이 서로 다른 nonlinear 변환을 배우도록 함. 만약 shared GRN 만 쓰면 변수 간 구별이 흐려짐.
- **조심할 점**: 각 변수에 자기 GRN → 파라미터 수 $\propto m_\chi$. 변수 수가 많을수록 (예: Favorita 는 100+ 개 features) 파라미터 폭발.

## 대안 접근으로 했다면 어떻게 달랐을까

1. **Attention-based selection**: 변수를 sequence 처럼 다뤄 self-attention 을 걸어 aggregate. 최근 iTransformer (Liu 2024, 2026-05-06 커버) 가 이 방향. 변수 간 상호작용이 pairwise attention 으로 모델링되어 더 강력하지만, VSN 의 단일 softmax 저울 같은 "명시적 해석 통로" 는 잃음.

2. **Sparsemax / entmax**: softmax 대신 sparsemax 를 쓰면 실제로 몇 개 변수만 non-zero weight 가 되어 진정한 sparse selection. 하지만 gradient 가 discontinuous 라 학습이 어렵고, 저자는 안정성을 위해 softmax 선택.

3. **VSN 없음 (concat + 큰 MLP)**: DeepAR 방식. 변수 선택 능력은 학습이 알아서 배워야 하고, 해석 통로 없음. Ablation 에서 저자가 이 대안과 비교했을 것 (본문 표 확인 필요).

## 이 부분의 핵심 한 문장

**VSN 은 매 시점 "지금 어느 변수가 중요한가" 를 softmax weight 로 명시화하고, 이 weight 를 학습 후 시각화하면 변수 중요도의 사후 지도가 된다 — 그러나 이 지도는 correlational 지 causal 이 아니다.**
