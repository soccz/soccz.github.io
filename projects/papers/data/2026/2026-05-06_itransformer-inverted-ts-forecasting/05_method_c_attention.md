# 05-C. 방법론 — 변수 방향 어텐션 메커니즘

> **배경 사다리**: ① 내적(dot product)은 두 벡터의 원소를 곱해 더한 스칼라 값으로, 두 벡터가 비슷할수록 크다. ② 소프트맥스(softmax)는 여러 실수 값을 받아 합이 1이 되는 확률 분포로 변환한다. ③ 멀티헤드 어텐션은 어텐션을 $H$개 독립 "헤드"로 병렬 실행해 서로 다른 관계 패턴을 포착하는 변종이다.

---

## 표준 어텐션 vs iTransformer 어텐션: 핵심 차이

| | 표준 TS 트랜스포머 | iTransformer |
|--|--|--|
| 입력 토큰 시퀀스 | $H \in \mathbb{R}^{T \times D}$ | $H \in \mathbb{R}^{N \times D}$ |
| Q, K, V 형상 | $T \times D$ | $N \times D$ |
| 어텐션 맵 | $T \times T$ | $N \times N$ |
| 어텐션이 포착하는 것 | 타임스텝 간 유사도 | **변수 간 상관관계** |

---

## 수식: 변수 방향 멀티헤드 어텐션

입력: $H \in \mathbb{R}^{N \times D}$ (N개 변수 토큰, 각 D-dim)

헤드 $k$에 대해 ($k = 1, \ldots, H_\text{heads}$):

$$Q^{(k)} = H W_Q^{(k)}, \quad K^{(k)} = H W_K^{(k)}, \quad V^{(k)} = H W_V^{(k)}$$

여기서 $W_Q^{(k)}, W_K^{(k)}, W_V^{(k)} \in \mathbb{R}^{D \times d_k}$ ($d_k = D / H_\text{heads}$).

어텐션 점수 행렬:

$$A^{(k)} = \text{softmax}\!\left(\frac{Q^{(k)} {K^{(k)}}^\top}{\sqrt{d_k}}\right) \in \mathbb{R}^{N \times N}$$

헤드 $k$의 출력:

$$\text{head}^{(k)} = A^{(k)} V^{(k)} \in \mathbb{R}^{N \times d_k}$$

멀티헤드 연결 후 선형 프로젝션:

$$\tilde{H} = \text{Concat}(\text{head}^{(1)}, \ldots, \text{head}^{(H_\text{heads})}) W_O \in \mathbb{R}^{N \times D}$$

**4줄 해석 — 어텐션 점수 행렬 $A^{(k)}$**:
1. **기호 뜻**: $A^{(k)}_{ij} \in [0,1]$은 "헤드 $k$에서, 변수 $i$를 업데이트할 때 변수 $j$의 정보를 얼마나 참조하는가"를 나타내는 가중치다. $\sum_j A^{(k)}_{ij} = 1$.
2. **일상 비유**: 기상청 예보관이 "내일 서울 기온을 예측할 때, 어제의 어떤 도시 데이터를 가장 많이 참고하는가"를 결정하는 참조 가중치와 같다. iTransformer에서 "도시" 대신 "변수"가 들어간다.
3. **왜 이 형태**: $Q K^\top / \sqrt{d_k}$는 두 변수 표현 벡터의 유사도를 측정한다. $\sqrt{d_k}$로 나누는 이유는 벡터 차원이 커질수록 내적 값이 커져 소프트맥스가 saturate되는 것을 방지하기 위함이다.
4. **조심할 점**: $N$이 크면(예: Traffic 862개 변수) $A^{(k)} \in \mathbb{R}^{862 \times 862}$, 저장에 약 2.4MB (float32). 헤드 수 곱이면 수십 MB. GPU 메모리 효율을 위해 FlashAttention을 플러그-인해서 이 계산을 청크(chunk) 단위로 나눠 처리한다.

---

## N×N 어텐션 맵의 물리적 해석

$A_{ij}$가 크다는 것은 "변수 $j$의 시간 패턴이 변수 $i$를 업데이트하는 데 중요하다"는 뜻이다. 이것은 변수 $i$와 $j$가 상관되어 있다는 soft-assignment다.

실제 ECL 데이터 시각화(논문 Figure 4)에서:
- 같은 지역 전력망에 속하는 변수 군(群)이 어텐션 맵에서 **블록 구조**를 형성한다.
- 이 블록 구조는 실제 전력망의 지역적 그룹핑과 일치한다.
- 표준 트랜스포머의 T×T 어텐션 맵에는 이런 의미 있는 패턴이 나타나지 않는다.

**APF 연구 관점 첨언**: APF(Attention Pattern Fields)가 연구하는 T×T 모티프(대각선/블록/스트라이프 등)는 "타임스텝 간 유사도"를 반영한다. iTransformer의 N×N 모티프는 "변수 간 상관관계"를 반영한다 — 완전히 다른 의미의 2D 패턴이다. APF가 T×T 분류 체계를 발표할 때, "N×N 어텐션 대안이 존재한다"는 사실을 Discussion에서 명시해야 한다.

---

## 레이어 반복

어텐션 출력 $\tilde{H}$에 잔차 연결(residual connection)과 LayerNorm을 더한다:

$$H' = \text{LN}(H + \tilde{H})$$

그 후 FFN(05-D에서 설명)을 거쳐 다시 잔차 연결:

$$H'' = \text{LN}(H' + \text{FFN}(H'))$$

이 블록을 $L$번 쌓아 깊은 표현을 형성한다 (보통 $L = 3$ 또는 4).
