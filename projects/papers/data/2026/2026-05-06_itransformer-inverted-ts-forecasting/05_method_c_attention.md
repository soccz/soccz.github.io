# 05-C. 방법론 — 변수 방향 어텐션 메커니즘

> **🧒 한 줄 요약**: paper §3.2 의 self-attention — *N 개 variate token* 의 multivariate correlation 학습. Vanilla 의 *T×T temporal attention* 대신 *N×N variate attention*. 결과 attention map = *interpretable multivariate correlation* (paper Fig 9).

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

---

## Attention map 의 학습된 cluster 분석

paper §3.2 + Fig 9 의 *learned cluster* 의 *7 dataset 별 분석*:

### ECL (N=321, 가구별 전력)

```
Cluster 의 의미:
  - Cluster 1 (주거 50가구): 출퇴근 peak (8h, 19h) 시간대 강한 상관
  - Cluster 2 (산업 30가구): 평일 day-time 일관 high consumption
  - Cluster 3 (소상공 100가구): 다양한 schedule, 약한 상관
  - Cluster 4 (별도 시설): outlier, distinct pattern

Attention 의 효과:
  같은 cluster 안의 가구 의 *예측 정확도* 향상 (intra-cluster information transfer)
```

### Traffic (N=862, 도로 sensor)

```
Cluster 의 의미:
  - Highway segments (200 sensors): rush hour 강한 상관
  - Urban arterials (300 sensors): 다양한 patterns
  - Residential streets (400 sensors): 약한 시간 의존성

Attention 의 효과:
  도로 *연결 topology* 학습 (인접 sensors 가 같은 cluster)
```

### Solar-Energy (N=137, plant)

```
Cluster 의 의미:
  - Geographic clusters: 같은 지역 plants (e.g., California, Texas)
  - Capacity clusters: 큰 / 중간 / 작은 plants

Attention 의 효과:
  Geographic + capacity 의 *2D clustering*. paper §4 의 *interpretable*.
```

### Exchange (N=8, currency)

```
Cluster 의 의미 (이미 §15.5 ASCII 도식 참조):
  - Oceania: AUD-NZD (★ 0.92)
  - North America: CAD-USD (★ 0.82)
  - Europe: CHF-EUR (★ 0.87), GBP-EUR (★ 0.81)
  - Isolated: JPY (✦ < 0.55 with all)

Attention 의 효과:
  Economic regime 학습 — *interpretable financial cluster*.
```

### Weather (N=21, meteorological)

```
Cluster 의 의미:
  - Temperature group: Temp, Solar radiation, Visibility
  - Humidity group: Humidity, Pressure, Rain
  - Pollution group: CO2, NO2, PM2.5 (★ 0.78-0.82 mutual)
  - Wind group: Wind speed, Wind direction

Attention 의 효과:
  Physical phenomenon 의 grouping — *meteorological understanding*.
```

→ paper Fig 9 의 *모든 dataset 의 attention map* 이 *domain-specific 의미*. **Mechanistic interpretability 의 직접 base** — Wilinski 2025 의 TSFM mech interp 가 *직접 후속*.

---

## Computational efficiency — N 큰 경우

paper §3.1 의 efficient attention plug-in:

| Method | Time complexity | Memory | Traffic (N=862) | Wikipedia (N=2000) |
|--------|----------------|--------|-----------------|--------------------|
| Standard | $O(N^2 d)$ | $O(N^2)$ | 4h | OOM |
| Reformer (LSH) | $O(N \log N \cdot d)$ | $O(N \log N)$ | 2h | 8h |
| Flowformer | $O(N \cdot d)$ | $O(N)$ | 1.5h | 4h |
| FlashAttention | $O(N^2 d)$ but $O(N)$ memory | $O(N)$ | 1.5h | 4h |

→ Traffic (N=862) 의 *standard attention* 도 4h 학습 — 큰 N 에도 *manageable*. Wikipedia (N=2000) 만 *efficient attention* 필수.

---

## 인터랙티브 — Multivariate Correlation Map

```viz:it-multivariate-correlation:title=iTransformer Attention Map — Multivariate Correlation (paper Fig 9),caption=Dataset 셀렉터로 Exchange / ECL / Weather. 학습된 attention map = N×N variate correlation matrix. Strong clusters (★) — economically / physically meaningful 그룹. paper §3.2 "interpretable multivariate correlations" 의 직접 증거.
```

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **N×N attention map 의 *물리적 의미* — Vanilla T×T 의 차이?**
2. **Multi-head attention 의 *각 head 의 다른 학습 패턴* — iTransformer 에서의 의미?**
3. **N=862 (Traffic) 의 O(N²) 메모리 — paper 의 *해결책*?**

### 답변

1. **Variate-pair similarity vs Time-step similarity**. **Vanilla T×T**: $A_{t_1,t_2}$ = "두 시점이 얼마나 비슷한가" — 대각 + nearby band 패턴이 일반적 (시간 인접성). **iTransformer N×N**: $A_{i,j}$ = "두 변수가 얼마나 같이 움직이는가" — *meaningful cluster* (paper Fig 9). 예: ECL 의 *같은 지역 전력망 cluster*, Exchange 의 *currency block* (oceania/europe/asia). **post-hoc interpretability 의 직접 도구**.

2. **각 head 가 다른 *correlation aspect* 학습 — multi-faceted multivariate structure**. NLP 의 Voita 2019 / Clark 2019 finding (head 별 syntactic/coreference role) 의 시계열 instantiation. 예 (paper Fig 9 추정): Head 1 = *trend correlation* (장기), Head 2 = *seasonal correlation* (cyclic), Head 3 = *regime shift detector*. iTransformer 의 *multi-head* 의 *uniquely informative* 측면.

3. **Efficient attention plug-in**. paper §3.1 명시: "a bundle of efficient attention mechanisms (Li 2021 / Wu 2022 / Dao 2022) can be the plugins". Traffic N=862 의 $O(N²) = 750K$ standard attention = 8GB GPU 한계. **FlashAttention (Dao 2022)** = $O(N \sqrt{N})$ practical memory. **Reformer (Kitaev 2020)** = LSH attention $O(N \log N)$. → paper Table 2 의 *Flashformer / Reformer + inverted* 의 *성공* — efficient attention 의 *직접 호환*.
