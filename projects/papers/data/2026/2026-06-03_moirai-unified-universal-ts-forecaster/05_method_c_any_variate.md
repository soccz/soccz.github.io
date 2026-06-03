# 4-C. Any-Variate Attention — 시간×변량 2-축 PE 의 결합

## 왜 이 부분이 필요한가

다변량 시계열을 일반 Transformer 가 다루려면 두 흔한 선택지가 있다:

1. **Channel-Independent (PatchTST 류)**: 각 변량을 *독립* 시퀀스로 취급. 모델 입장에서 변량 간 상호작용을 전혀 학습 못함. 변량 수 무한 확장은 가능하나 *변량 간 정보* 가 사라짐.
2. **Channel-Mixed embedding (Vanilla Transformer / Crossformer)**: $d_y$ 변량을 한 시점의 $d_y$차원 벡터로 묶어 단일 토큰 매핑. *변량 수* 고정 — 학습 시 $d_y$가 정해지면 inference 에서 다른 $d_y$ 처리 불가. 표준 PE (sinusoidal / learned) 으로는 *permutation 불변성* 보장 안 됨.

**Universal forecaster** 는 두 제약 모두를 깨야 한다 — 변량 수 무한 확장 + 변량 간 정보 활용 + 변량 순서 permutation-invariant. *Any-Variate Attention* 이 그 셋을 동시 만족하는 단일 디자인.

## 핵심 수식 — Eq. (2), (3)

논문 Eq.(2):
$$
E_{ij,mn} = (W^Q x_{i,m})^T R_{i-j} (W^K x_{j,n}) + u^{(1)} \cdot \mathbb{1}_{\{m=n\}} + u^{(2)} \cdot \mathbb{1}_{\{m \ne n\}}
$$

Eq.(3):
$$
A_{ij,mn} = \frac{\exp\{E_{ij,mn}\}}{\sum_{k,o} \exp\{E_{ik,mo}\}}
$$

**4줄 해석**:

1. **기호 뜻**:
   - $(i, m)$ = query 의 *(시간 인덱스 i, 변량 인덱스 m)*. $(j, n)$ = key 의 *(시간 j, 변량 n)*.
   - $x_{i,m} \in \mathbb{R}^{d_h}$ = patch $(i, m)$ 의 hidden 표현.
   - $W^Q, W^K \in \mathbb{R}^{d_h \times d_h}$ = 표준 query/key projection.
   - $R_{i-j} \in \mathbb{R}^{d_h \times d_h}$ = RoPE *rotary matrix* (Su et al. 2024). $|i - j|$ 만에 의존하는 block-diagonal 회전.
   - $u^{(1)}, u^{(2)} \in \mathbb{R}$ = layer 마다, head 마다 학습되는 *두 스칼라*. $u^{(1)}$ 은 *같은 변량* (m=n), $u^{(2)}$ 는 *다른 변량* (m≠n).
   - $\mathbb{1}_{\{cond\}}$ = indicator (조건이 참이면 1, 아니면 0).
   - $A_{ij,mn} \in [0,1]$ = 정규화된 attention weight.

2. **일상 비유**:
   $E_{ij,mn}$ 의 첫 항 $(W^Q x)^T R (W^K x)$ 는 *"두 단어가 얼마나 비슷한지 + 그 둘이 시간상 얼마나 떨어졌는지"* 를 한 번에 계산. RoPE 는 *시계 바늘이 시간만큼 회전한 두 시계 바늘 사이 각도* — 그 각도로 *상대 시간* 을 표현. 둘째/셋째 항은 *"같은 화자(같은 변량)인지 다른 화자(다른 변량)인지" 만 +스칼라 / +다른 스칼라로 표시*. 화자 이름은 알 필요 없고, *동일성* 만 표시.

3. **왜 이 형태**:
   - *RoPE 만으로 시간축* — 임의 시간 인덱스 i 확장 가능 (학습 안 본 t 도 처리).
   - *이진 bias* + 두 스칼라 — *변량 수 N 무관, 변량 순서 무관*. 어떤 변량 m, n 이든 *같은가 아닌가* 두 경우만.
   - 두 스칼라 $u^{(1)}, u^{(2)}$ 가 *layer × head 단위로 다름* — layer 마다 "같은 변량 강조" vs "다른 변량 강조" 의 *trade-off* 를 학습 가능.

4. **조심할 점**:
   - **표현력 한계**: 변량 간 *세부 관계* (예: 변량 1 과 2 는 강한 양의 상관, 1 과 3 은 약한 음의 상관) 는 두 스칼라로 *직접* 표현 불가. 대신 *xformat embedding* $x_{i,m}$ 의 *값 자체* 에서 모델이 학습해야. 즉 attention bias 는 *변량 동일성* 만, 변량별 *특성* 은 hidden 표현에 의존.
   - **Self-loop 효과**: $u^{(1)} \cdot \mathbb{1}_{\{m=n\}}$ 의 절대 크기가 너무 크면 *self-attention 만 dominant* 해질 위험 — head 별 학습으로 mitigate 하지만 layer norm 의 작용에 의존.
   - **Permutation invariance 보장 조건**: 변량 인덱스를 *임의로 재배열* 해도 같은 출력이 나오려면 *positional info* 가 변량 차원에 없어야 한다. $u^{(1)}/u^{(2)}$ 만으로는 보장. *하지만* 변량 인덱스가 *학습 시 sampled order* 로 들어오면 모델이 우연히 *학습된 순서 의존성* 을 갖게 될 위험. 본문은 "permutation invariance w.r.t. variate indices" 를 단언만 — 정량 검증 미보고.

## 왜 RoPE 인가 — sinusoidal/learned 대비

- **Sinusoidal (Vaswani 2017)**: 절대 위치 표현. 학습 안 본 t 에서 extrapolation 약함.
- **Learned PE**: 학습 sequence length 내에서만 동작.
- **ALiBi (Press 2022)**: linear bias, 상대 위치 기반 extrapolation 강함. 하지만 *방향성* 만, 회전 표현 없음.
- **RoPE (Su 2024)**: query/key 벡터를 위치에 따라 회전 — 상대 위치 정보가 *attention dot product* 안에 자연 내장. 학습 안 본 sequence length 에 강함. 본 논문이 *임의 context length* 를 지원하려면 RoPE 가 가장 자연스러운 선택.

저자 본문은 RoPE 선택 이유를 명시하지 않고 "leveraging RoPE" 로만 언급. 추론컨대 *long-context zero-shot* 시 RoPE 의 extrapolation 강건성이 결정적.

## 이진 attention bias — Yang et al. 2022b 인용

논문이 이진 attention bias 형태를 *Yang et al. 2022b* 로부터 차용했다고 명시. Yang 2022b 는 *learned binary attention bias for permutation-invariant set 처리* 의 일반 기법. MOIRAI 는 이를 *변량* 차원에 그대로 적용.

핵심 통찰은 *"같은 변량" vs "다른 변량"* 두 경우만 구분하면 *변량 인덱스 자체에 PE 가 필요 없다*. 변량 i, j 가 같다 ↔ "1 → $u^{(1)}$ 더함", 다르다 ↔ "1 → $u^{(2)}$ 더함". 변량 ID 자체는 *모델 출력에 영향 없음* (단지 *equivalence class* 만 결정). 이 점에서 *완전한* permutation invariance.

## 대안 디자인 비교

**대안 A — variate-axis 에도 RoPE**: 변량 인덱스에도 회전 적용. *효과*: 변량 간 상호작용을 *상대 변량 거리* 로 표현. *부족*: 변량 *순서가 의미 있다는 가정 도입*. 본 논문 목표 (variate permutation invariance) 와 충돌.

**대안 B — graph-style learned variate embedding**: 각 변량마다 학습 가능 임베딩 $e_m \in \mathbb{R}^{d_h}$ 를 가산. *효과*: 변량별 특성을 직접 학습. *부족*: 변량 수 *고정* — 새 변량 처리 불가. 정확히 본 논문이 회피하려는 방향. Ablation Table 7 의 "w/o Any-Variate Attention (additive learned embeddings)" 가 이 baseline 에 해당하고 0.904 (+38%) 로 악화.

**대안 C — variate 마다 별도 attention head**: $d_y$ 변량마다 다른 attention head 학습. *효과*: 변량별 특화. *부족*: head 수가 $O(d_y)$ 로 폭발, $d_y$ 가변 처리 불가.

저자들은 *가장 minimal* (스칼라 두 개) + *imitation invariant guarantee* + *변량 수 무한 확장* 의 세 조건을 *동시* 만족하는 가장 단순한 디자인을 선택. 이 점에서 *parameter-efficient symmetric design* 의 모범.

## 이 부분의 핵심 한 문장

**Any-Variate Attention 은 "RoPE 가 시간축에서 상대 위치를 회전으로 표현하듯, 이진 attention bias 가 변량축에서 *동일성* 을 두 학습 스칼라로 표현"** — 시간과 변량 두 축이 한 attention 안에서 *각자에 적합한 PE* 로 분리 처리되는 디자인. 한계는 변량 간 *세부 관계* 가 hidden 표현에 떠넘겨진다는 점 — APF 의 관점에서 attention motif 가 어떻게 시간×변량 두 축으로 분리되는지가 *다음 실험 후보*.
