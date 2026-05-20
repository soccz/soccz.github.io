# 06. Transformer Encoder — Vanilla 그대로

## 📌 이 챕터 다 읽으면 알 수 있는 것

- 본 논문이 쓰는 Transformer encoder — vanilla 그대로
- Eq 2 (patch projection + position embedding)
- Eq 3 (multi-head self-attention)
- BatchNorm vs LayerNorm 의 minor modification

---

> 본 논문이 사용한 *Transformer encoder* 의 구조. *시계열 specific 변형 없이* vanilla 그대로.

---

## 6.1 챕터 한 줄 요약

> **"Patching + Channel-Indep 외에는 *완전 vanilla Transformer encoder*. NLP 의 BERT, GPT 가 사용하는 *같은 구조*. 시계열 specific attention 변형 (Informer, Autoformer) 없음. *Simple is better*."**

---

## ★ 본 chapter 의 가장 중요한 통찰

> **"본 paper 의 negative contribution (= '추가 안 한 것') 도 contribution"**.

paper 가 **명시적으로 거절**한 것:
- Informer 의 ProbSparse self-attention.
- Autoformer 의 Auto-correlation + Series Decomposition.
- FEDformer 의 Fourier-enhanced attention.

→ 모두 **시계열 specific 변형** = paper 이 "**우리 안 씁니다**" 라고 명시.

**Fig 6 (attention maps, ch18) 이 정당화**: vanilla self-attention 만으로도 **local + periodic 패턴 학습** — 시계열 specific 변형 불필요.

→ **paper 의 message**: "**시계열 분야에서 Auto-correlation/FFT 같은 architectural innovation 보다 patching + CI 같은 representation innovation 이 더 중요**".



---

## 6.2 Vanilla Transformer 가 뭐예요?

### 일상 비유 — *ChatGPT 의 기본 부품*

ChatGPT, BERT, GPT 같은 *모든 NLP 모델* 의 *기본 부품*. 2017년 Google 발명.

구성:
1. **Multi-head Self-Attention** (다중 헤드 자기 주의)
2. **Feed-Forward Network** (피드포워드 신경망)
3. **Layer Normalization** (층 정규화)
4. **Residual Connection** (잔차 연결)

본 논문: 이 *4 부품 그대로* 시계열 적용. *Modification 없음*.

---

## 6.3 Multi-head Self-Attention — 핵심 메커니즘

### 일상 비유

문장 "*The cat sat on the mat*" 을 이해할 때:
- "sat" 이 *어떤 단어* 와 연관? — *cat (주어), on (전치사), mat (위치)*.
- *각 단어가 다른 모든 단어* 와의 *관계* 측정.

본 논문: 시계열의 *각 patch* 가 *다른 모든 patch* 와의 *관계* 측정.

### Multi-head 의 의미

**Single head**: *한 관점* 의 관계 측정.

**Multi-head**: *여러 관점* 동시 측정. 예: *head 1* 은 *short-term 관계*, *head 2* 는 *long-term 관계*, *head 3* 은 *주기성 관계*.

### Default hyperparameter (paper A.1.4)

**큰 dataset (Weather, Traffic, Electricity, ETTm1, ETTm2)** 의 default:

| 설정 | 값 | 의미 |
|------|----|----|
| Encoder layer 수 | **3** | Transformer block 의 깊이 |
| Multi-head 수 H | **16** | 동시 학습 관점 수 |
| Hidden dim D | **128** | Token embedding 크기 |
| FFN dim F | **256** | FFN 내부 차원 = $2D$ |
| Activation | **GELU** | (Hendrycks & Gimpel 2016) — ReLU 보다 부드러움 |
| Dropout | **0.2** | Regularization |

**작은 dataset (ILI, ETTh1, ETTh2)** 의 reduced setting:

| 설정 | 값 |
|------|----|
| Multi-head 수 H | **4** (16 의 1/4) |
| Hidden dim D | **16** (128 의 1/8) |
| FFN dim F | **128** |

**이유**: ILI 는 *966 timestep*, ETTh1/h2 는 *17,420* — 작은 dataset 에서 *큰 모델 (H=16, D=128)* 사용 시 *overfitting*. *Reduced 로 overfitting 방지*.

**일상 비유**: 작은 시험 (10 문제) 에 *전문가 16명* 채용 = 과잉. *전문가 4명* 으로 충분. 큰 시험 (1만 문제) 에는 *16명 필요*.

### Self-attention 의 정확한 정의

각 patch 의 *query, key, value* 벡터 생성:
- $Q$ (query): "내가 *어떤 정보 찾는가*".
- $K$ (key): "*어떤 정보 가지고 있는가*".
- $V$ (value): "*실제 정보 내용*".

**Equation 2 (paper p.4 식)** — Patch projection + position embedding:

$$
x_d^{(i)} = W_p\, x_p^{(i)} + W_{pos}
$$

- $x_p^{(i)} \in \mathbb{R}^{P \times N}$: 한 channel 의 patch 시계열.
- $W_p \in \mathbb{R}^{D \times P}$: patch → token 의 linear projection. *학습되는 weight*.
- $W_{pos} \in \mathbb{R}^{D \times N}$: 각 patch 의 *순서* 정보 (learnable). NLP 의 position embedding.
- $x_d^{(i)} \in \mathbb{R}^{D \times N}$: D 차원 token N 개.

**일상 비유**: 책의 각 *단어 (patch)* 를 *embedding vector* 로 변환 + *몇 번째 단어인지 (position)* 표시. 그래야 Transformer 가 *순서* 알고 attention 계산.

**Equation 3 (paper p.5 Attention 식)** — Multi-head self-attention output:

$$
(O_h^{(i)})^T = \text{Attention}(Q_h^{(i)}, K_h^{(i)}, V_h^{(i)}) = \text{softmax}\!\left(\frac{Q_h^{(i)} (K_h^{(i)})^T}{\sqrt{d_k}}\right) V_h^{(i)}
$$

- $Q_h^{(i)} = (x_d^{(i)})^T W_h^Q$, $K_h^{(i)} = (x_d^{(i)})^T W_h^K$, $V_h^{(i)} = (x_d^{(i)})^T W_h^V$.
- $W_h^Q, W_h^K \in \mathbb{R}^{D \times d_k}$, $W_h^V \in \mathbb{R}^{D \times D}$ 가 *head h 의 학습 weight*.
- $\sqrt{d_k}$ 로 나누는 이유: dot product 가 너무 커지면 softmax 의 gradient *vanish* — *scaled* dot product.

**왜 이 형태?**: softmax 안의 $QK^T$ 는 *각 patch 쌍 의 유사도*. 유사도 큰 patch 의 value 가 *큰 weight* 로 합쳐짐 → 각 patch 가 *관련 있는 다른 patch 정보* 흡수.

**조심할 점**: *Self-attention* 이라 부르는 이유 — $Q, K, V$ 모두 *같은 input* $x_d^{(i)}$ 로부터. 즉 *자기 자신과의 비교*. NLP 에서 *cross-attention* (decoder 에 encoder 의 output 을 query 로) 은 본 논문에서 *사용 안 함*.

---

## 6.4 Feed-Forward Network — 비선형 변환

각 patch 의 *embedding 을 더 풍부하게*:
- *Linear projection → ReLU/GELU → Linear projection*.
- 본 논문: D = 128 (default) 또는 16 (작은 모델).

**일상 비유**: 단어 의미를 *더 풍부한 표현* 으로 (예: "*cat* → '*4발 동물 + 털 + 야옹*' 의 vector").

---

## 6.5 Layer Normalization + Residual Connection

### Layer Norm
각 layer 의 output 을 *normalize* — 학습 안정화.

### Residual Connection
*입력 + layer output* — *deep network 학습 가능* (vanishing gradient 방지).

본 논문: NLP Transformer 의 *정확한 설계 그대로*.

---

## 6.6 *BatchNorm 으로 교체* — 본 논문의 마이너 변경

본 논문의 *유일한 작은 modification*: **Layer Norm → Batch Norm**.

### 왜?

시계열에서 *batch norm 이 layer norm 보다 약간 더 좋음* (실증 발견). 

**일상 비유**: NLP 에서는 *문장 단위 정규화 (layer norm)* 가 자연. 시계열에서는 *batch (여러 시점 묶음) 단위 정규화 (batch norm)* 가 *통계적으로 안정*.

### Quantitative effect

본 논문 *Table 11 (Appendix)*: BN > LN 약 *2-3% MSE* 차이.

```viz:pat-table11-instance-norm:title=Table 11 — Instance/Batch Norm effect (interactive),caption=BN vs LN 비교. 시계열에서 BN 약간 우월.
```

---

## 6.7 *Vanilla Transformer 의 효과 — Simplicity Wins*

본 논문 메시지의 *재해석*:

> **"학자들이 *시계열 specific attention 변형* 에 5년 매달렸지만, *NLP 의 vanilla Transformer 그대로* 가 *효과적*."**

이건 *과학사적* 의미 큰 발견. 학자들의 *over-engineering 경향* 의 반박.

---

## 6.8 자기점검

### 핵심 3가지
1. **Vanilla Transformer 의 4 부품?**
2. **Multi-head self-attention 의 일상 비유?**
3. **본 논문의 *유일한 마이너 modification*?**

### 답변
1. **(1) Multi-head Self-Attention** — 각 token (patch) 의 *다른 token 들과의 관계* 측정. **(2) Feed-Forward Network** — 각 token 의 *비선형 변환*. **(3) Layer Normalization** — output normalize, 학습 안정. **(4) Residual Connection** — *입력 + output*, deep network 학습 가능.
2. **문장 "*The cat sat on the mat*" 의 *각 단어* 가 *다른 모든 단어* 와의 *관계* 측정**. "sat" → "cat (주어), on (전치사), mat (위치)" 의 *관련도*. Multi-head = *여러 관점* (단기/장기/주기성) 동시 측정. 본 논문: 16 head.
3. **Layer Norm → Batch Norm**. 시계열에서 *batch norm 이 layer norm 보다 약간 더 안정* (Table 11). 즉 본 논문의 *진짜 modification 은 patching + channel-indep + batch norm 3 개* — *나머지 다 vanilla NLP Transformer*.

---

다음 챕터: [07_instance_norm_loss.md](07_instance_norm_loss.md) — Instance Normalization + MSE Loss.
