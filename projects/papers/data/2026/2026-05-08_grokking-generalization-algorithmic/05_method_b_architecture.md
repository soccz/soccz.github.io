# 05b — 방법론 해부: Transformer 구조

> **배경 사다리**: 이 절을 이해하려면 ① 행렬 곱이 "고차원 공간에서 정보를 섞는 연산"이라는 것, ② softmax가 여러 수를 확률처럼 변환하는 함수라는 것, ③ "레이어(layer)"가 "처리 단계"를 뜻한다는 것 정도면 된다.

**출처 근거**: 이 절의 구조·수식·파라미터는 `github.com/openai/grok`의 `grok/transformer.py` (Transformer, AttentionHead, MultiHeadAttention, DecoderBlock 클래스)에서 직접 확인된 코드에 기반한다.

---

## 전체 아키텍처

```
입력 토큰 [a, ◦, b, =]
    ↓
Token Embedding (vocab_size × d_model)
    ↓ (+ 위치 인코딩 덧셈)
Sinusoidal Positional Encoding
    ↓
[DecoderBlock × 2]    ← 2-layer decoder-only Transformer
  ├─ Multi-Head Self-Attention (4 heads, causal mask)
  └─ Feed-Forward Network (d_model → 4·d_model → d_model, ReLU)
    ↓
Linear Projection (d_model → vocab_size)
    ↓
Cross-entropy loss vs. target token
```

**핵심 파라미터** (Transformer 클래스 기본값, `transformer.py`):

| 파라미터 | 값 | 설명 |
|---------|-----|------|
| `n_layers` | 2 | decoder block 수 |
| `n_heads` | 4 | 어텐션 헤드 수 |
| `d_model` | 256 | 임베딩 차원 |
| `d_key` | 64 | 헤드당 키/쿼리/밸류 차원 (= d_model / n_heads) |
| `dropout` | 0.0 (기본) | 드롭아웃 비율 |
| PE 종류 | Sinusoidal | 학습되지 않는 고정 위치 인코딩 |
| 비선형 활성 | ReLU | FFN 활성화 함수 |
| Attention bias | 없음 | Q, K, V, O 모두 `bias=False` |

---

## 임베딩과 위치 인코딩

### Token Embedding

각 입력 토큰 인덱스 $i$를 $d_\text{model}$차원 벡터로 변환:

$$\mathbf{e}_i = \mathbf{W}_E[i] \in \mathbb{R}^{d_\text{model}}$$

- **기호 뜻**: $\mathbf{W}_E \in \mathbb{R}^{|V| \times d_\text{model}}$ 는 학습 가능한 임베딩 행렬, $|V|$는 어휘 크기
- **일상 비유**: 각 단어(토큰)를 서로 다른 방향을 가리키는 화살표로 변환하는 것. 비슷한 토큰이 비슷한 방향의 화살표를 가지도록 학습됨
- **왜 이 형태**: 이산 기호를 연속 벡터 공간에 매핑해야 미분 가능한 학습이 가능하기 때문
- **조심할 점**: 이 모델에서 임베딩 행렬은 최종 분류 레이어 $\mathbf{W}_U$와 **공유되지 않는다** (별도의 Linear 레이어 사용). Weight tying 없음.

### Sinusoidal Positional Encoding

$$\text{PE}(pos, 2i) = \sin\!\left(\frac{pos}{10000^{2i/d}}\right), \quad \text{PE}(pos, 2i{+}1) = \cos\!\left(\frac{pos}{10000^{2i/d}}\right)$$

- **기호 뜻**: $pos$는 시퀀스 내 위치(0, 1, 2, …), $i$는 임베딩 차원 인덱스, $d = d_\text{model} = 256$
- **일상 비유**: 음악의 각 박자마다 다른 높이의 음을 배치해 "지금 몇 번째 박자인지"를 알리는 것. 각 주파수가 다른 시간 해상도를 커버함
- **왜 이 형태**: Vaswani et al. (2017) 원래 제안. 상대적 위치를 내적으로 표현하고 길이 외삽(extrapolation)에도 어느 정도 강건함
- **조심할 점**: 이 모델은 시퀀스 길이가 최대 50으로 고정되어 있어 외삽은 문제가 안 됨. 위치 인코딩은 임베딩 벡터에 **더해진다** (concat이 아님)

입력 벡터 = `embed(token_idx) + PE(position)`

---

## 스케일드 닷-프로덕트 어텐션

어텐션 헤드 하나는 다음을 수행한다:

$$\text{Attn}(\mathbf{Q}, \mathbf{K}, \mathbf{V}) = \text{softmax}\!\left(\frac{\mathbf{Q}\mathbf{K}^\top}{\sqrt{d_k}}\right) \mathbf{V}$$

- **기호 뜻**:
  - $\mathbf{Q} = \mathbf{X}\mathbf{W}_Q$: 쿼리 행렬 (각 위치가 "무엇을 찾는지")
  - $\mathbf{K} = \mathbf{X}\mathbf{W}_K$: 키 행렬 (각 위치가 "무엇을 제공하는지")
  - $\mathbf{V} = \mathbf{X}\mathbf{W}_V$: 밸류 행렬 (각 위치가 실제로 전달하는 정보)
  - $d_k = 64$: 헤드당 차원 (= d_model / n_heads = 256/4)
  - softmax: 행별로 확률 분포로 변환
- **일상 비유**: 도서관에서 "키워드"(Q)로 책을 검색(K)해서 관련 정보(V)를 가져오는 것. $\sqrt{d_k}$로 나누는 것은 키워드가 너무 극단적으로 매칭되지 않도록 스케일을 맞추는 것
- **왜 이 형태**: QK 내적이 위치 간 유사도를 측정하고 softmax가 가중 평균 계수를 만듦. $\sqrt{d_k}$로 나누지 않으면 차원이 커질수록 내적 값이 폭발해 소프트맥스가 one-hot에 가까워짐
- **조심할 점**: 이 모델은 `bias=False`이므로 $\mathbf{W}_Q, \mathbf{W}_K, \mathbf{W}_V \in \mathbb{R}^{d \times d_k}$ 모두 bias 없음

### Causal Masking (인과 마스킹)

미래 위치의 어텐션을 막는 하삼각 행렬:

$$M_{ij} = \begin{cases} 0 & \text{if } i < j \text{ (future)}\\ 1 & \text{if } i \geq j \text{ (past/present)}\end{cases}$$

마스킹된 위치는 softmax 전에 $-\infty$로 채워짐 → softmax 이후 0에 수렴.

**왜 필요**: Decoder-only 모델로 자기회귀(autoregressive) 예측을 수행하므로 미래 토큰을 볼 수 없어야 함. "a ÷ b = ?"에서 ?를 예측할 때 앞의 a, ÷, b, = 만 사용 가능.

---

## Multi-Head Attention과 Decoder Block 구조

4개 헤드의 출력을 concat 후 선형 변환:

$$\text{MHA}(\mathbf{X}) = \text{concat}(\text{head}_1, \ldots, \text{head}_4)\mathbf{W}_O$$

각 Decoder Block의 forward 과정 (코드 기반):
```
a1 = MultiHeadAttention(x) + drop(...)
a1 = LayerNorm(x + a1)              ← Pre-norm이 아닌 Post-norm
a2 = FFN(a1)
a2 = LayerNorm(a1 + a2)
```

FFN (Feed-Forward Network):
$$\text{FFN}(\mathbf{x}) = \text{ReLU}(\mathbf{x}\mathbf{W}_1 + b_1)\mathbf{W}_2 + b_2$$

$\mathbf{W}_1 \in \mathbb{R}^{256 \times 1024}$, $\mathbf{W}_2 \in \mathbb{R}^{1024 \times 256}$ (코드에서 `4 * d_model` 확장 추정).

---

## 모델 크기 추정

- Embedding: $|V| \times 256$ ($|V|$는 97 + 연산자 + 특수 토큰으로 ~120)
- Attention per head: $(256 \times 64) \times 3 = 49,152$ (Q, K, V)
- Attention output: $4 \times 64 \times 256 = 65,536$ (Wo)
- FFN per block: $256 \times 1024 + 1024 \times 256 = 524,288$
- Total per block: ~700K 파라미터
- 2 blocks: ~1.4M, + Embedding ~30K ≈ **총 ~1.5M 파라미터**

이는 현대 LLM(수십억 파라미터)과 비교하면 극소형 모델이다. 이 소규모가 그로킹 현상을 깔끔하게 관찰할 수 있는 조건이기도 하다.
