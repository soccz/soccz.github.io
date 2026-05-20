# 03. 왜 Autoformer? — 장기 예측의 두 challenge + 본 논문의 답

> 본 논문이 *왜 나왔는지* 의 학계 역사. 2017년 Transformer 등장부터 2021년 Autoformer 까지.

---

## 3.1 챕터 한 줄 요약

> **"2017년 Transformer 등장 → 2019-2021 학자들이 *시계열 적용* 시도 → 두 가지 큰 벽 발견: (1) 장기 의 *intricate patterns* + (2) sparse attention 의 *information bottleneck*. Autoformer 가 *분해 + Auto-Correlation* 으로 두 벽 모두 깸."**

---

## 3.2 2017년 — Transformer 등장 (NLP 의 혁명)

**Vaswani et al "Attention is All You Need"** (NeurIPS 2017).

NLP 의 *완전 혁명*. Attention 메커니즘으로 *RNN/LSTM 의 long-term 의존성 문제* 해결.

이후:
- **2018-2020**: BERT, GPT-2, GPT-3 — NLP 모델 의 *모든 SOTA*.
- **2020**: ViT (Vision Transformer) — *이미지* 도 정복.
- **2023+**: ChatGPT, GPT-4, Claude 등.

**핵심 메시지**: Transformer 는 *sequence 다루는 universal 도구*. *시계열 도 sequence* → *자연스러운 적용 시도*.

---

## 3.3 2019-2021 — 학자들의 시계열 Transformer 시도

NLP/CV 성공에 자극받은 학자들이 *시계열 Transformer 적용* 시도.

### LogTrans (Li et al, NeurIPS 2019)

- **Trick**: *LogSparse attention* — 시간 점 사이 *log 간격* 으로 attention.
- **장점**: $O(L (\log L)^2)$ 의 효율.
- **단점**: 여전히 *point-wise*.

### Reformer (Kitaev et al, ICLR 2020)

- **Trick**: *LSH (Locality-Sensitive Hashing) attention* — *비슷한 query/key* 끼리 hash bucket.
- **장점**: $O(L \log L)$ 의 효율.
- **단점**: 여전히 *point-wise* + LSH 의 *noise*.

### Informer (Zhou et al, AAAI 2021)

- **Trick**: *ProbSparse attention* — KL divergence 로 *중요 query 선택*.
- **장점**: $O(L \log L)$ 의 효율.
- **단점**: 여전히 *point-wise* + sparse selection 의 *정보 손실*.

### 공통 패턴

이 *3 모델 모두* **시계열 specific self-attention 변형** — 즉 *sparse 한 self-attention*. 모두:

1. *Point-wise* (점 별 비교).
2. *Self-attention 의 변형* (대체 X).
3. *분해 없음* (사전 처리 X, 모델 내부 X).

**일상 비유**: 의사가 환자 *전체 검사* (full attention) 대신 *일부 검사* (sparse) 만 → *놓치는 정보*. 그래도 *검사 방식 자체* 는 같음.

학계 가정: "*Self-attention 의 sparse 버전 = 답*". 그러나 실제 결과 는 *limited improvement*.

---

## 3.4 본 논문이 본 *두 가지 큰 벽*

### 벽 1 — Intricate Temporal Patterns (복잡 시간 패턴)

**문제**: 장기 미래 의 *시간 패턴* 이 *너무 복잡*. *trend + seasonal + noise* 가 *섞임*.

**예시 — Traffic dataset**:
- *Trend* (큰 흐름): 1년 동안 도로 점유율 *서서히 증가*.
- *Seasonal* (주기성): *매일 출근 시간 peak*, *주말 감소*, *공휴일 변동*.
- *Noise*: 사고, 날씨, 이벤트.

장기 예측 (336 timestep) 시 *이 모든 게 섞여* → *진짜 dependency vs noise* 구분 어려움.

**기존 방법**: *Pre-processing decomposition* (사전 분해).
- Prophet (Taylor 2018): Trend + Seasonal + Holiday 분해.
- N-BEATS (Oreshkin 2019): Basis expansion 분해.
- DeepGLO (Sen 2019): Matrix decomposition.

**한계**: *사전 처리* 만 가능 — *학습 후 분해 다시 불가능*. *future 는 모르니* *그 future 에 대한 분해* 불가능.

### 벽 2 — Information Utilization Bottleneck (정보 활용 병목)

**문제**: Sparse attention (Informer, Reformer, LogTrans) 의 *점만 보기* → *정보 손실*.

**예시 — 시계열 (1000 timestep)**:
- *Full attention*: $O(L^2) = 1,000,000$ 연산 — 너무 느림.
- *Sparse* (예: 100 점 만): $O(L \log L) \approx 10,000$ 연산 — 빠름. 그러나 *900 점 무시*.

**일상 비유**: 책 1000 페이지 중 *100 페이지만 보고* 요약 → *주요 정보 손실 위험*.

→ **Sparse 의 *효율* 와 *정확도* 사이 trade-off**.

---

## 3.5 본 논문의 답 — *두 벽 모두 깨기*

**Autoformer (Wu et al, NeurIPS 2021)** 가 두 벽 모두 깸.

### Architecture 의 한 눈에 — Figure 1 미리 보기

![Figure 1 — Autoformer Architecture (preview)](figures/page4_Fig1_architecture.png)

*paper p.4 Figure 1 — Autoformer 의 *전체 구조*.*

**핵심 시각 메시지**:
- 위 *Encoder*: Auto-Correlation + Series Decomp 의 *반복*. *Trend 버림 + Seasonal 만 학습*.
- 아래 *Decoder*: Auto-Correlation + Series Decomp 의 *반복*. *Trend 누적 + Seasonal refinement*.
- 마지막 *합치기*: Seasonal + Trend = 최종 예측.

자세한 step-by-step 은 [05_architecture.md](05_architecture.md) 참조.

### 핵심 메시지

> **"Sparse self-attention 의 *효율 + 정확도 trade-off* 자체 가 *잘못된 framing*. Self-attention 을 *통째로 교체* + 분해를 *모델 내부* 로 끌어들임."**

### 두 가지 *새 기법*

#### 기법 1 — Auto-Correlation (벽 2 의 해법)

**기존 self-attention** (point-wise, $O(L^2)$):

$$
\text{Attn}(Q,K,V) = \text{Softmax}\!\left(\frac{QK^T}{\sqrt{d}}\right) V
$$

**Autoformer 의 Auto-Correlation** (series-wise, $O(L \log L)$):

$$
\text{AutoCorr}(Q,K,V) = \sum_{i=1}^{k} \text{Roll}(V, \tau_i) \cdot \hat R(\tau_i)
$$

- $\tau_i$: Top-$k$ 의 *시간 지연* (period).
- $\text{Roll}(V, \tau)$: $V$ 를 $\tau$ 만큼 cyclic shift.
- $\hat R(\tau_i)$: $\tau_i$ 에서의 *autocorrelation* (FFT 로 계산).

**일상 비유**: 의사가 환자의 *지난 24시간 (sub-series)* + *어제 같은 시간 24시간 (sub-series)* + *그저께 같은 시간 24시간* 들을 *주기 별 비교* — *조각 끼리 (series-wise)*.

**기존**: *Sparse attention* 으로 점 일부만.

**본 논문**: *Auto-Correlation* 으로 *전체 시계열의 주기성 활용* + *FFT 로 $O(L \log L)$*.

#### 기법 2 — Inner Decomposition Block (벽 1 의 해법)

**기존 분해 (Prophet, N-BEATS)**: 사전 처리 만.

**본 논문**: 분해를 *encoder + decoder 의 매 layer 마다 inner block* 으로.

**Series Decomposition Block** (Eq 1):

$$
X_t = \text{AvgPool}(\text{Padding}(X)), \quad X_s = X - X_t
$$

- $X_t$: trend (이동 평균 으로 *부드러운 큰 흐름* 추출).
- $X_s$: seasonal (전체에서 trend 뺀 *나머지*).

**일상 비유**: 학생이 *문제 풀 때* 마다 *답 점검 (trend 추출)* + *나머지 다시 풀기 (seasonal refinement)*. *매 단계 정제* — *반복적 향상*.

#### 결과

**6 datasets × 4 horizons 평균**:
- **MSE reduction**: 38%.
- 최대: ETTm2 predict-336 의 *74% MSE 감소* (1.334 → 0.339).

---

## 3.6 본 논문의 *핵심 발견 4가지*

본 논문이 *empirically* 보인 것:

### 발견 1 — Auto-Correlation > Self-Attention

본 논문 *Table 4 ablation*:
- Auto-Correlation vs Full / LogSparse / LSH / ProbSparse Attention 비교.
- *Auto-Correlation 이 모든 baseline 능가*.

### 발견 2 — Inner Decomposition > Pre-processing

본 논문 *Table 3 + 9 ablation*:
- Inner decomposition vs *Sep* (사전 분해 + 별도 학습).
- *Inner decomposition 이 능가*.

### 발견 3 — $O(L \log L)$ Complexity

**Figure 7** (paper p.10): Memory + Time 측정.
- Auto-Correlation 의 *$O(L \log L)$* 가 Full / LSH / ProbSparse 보다 *훨씬 효율적*.

### 발견 4 — Long-Term Robustness

**Figure 2, Figure 4**: prediction length 가 늘어도 *MSE 안정*.

→ *장기 예측* 의 *robustness*.

---

## 3.7 본 논문의 의의 — 학계 흐름의 *turning point*

```
   2017 Transformer (NLP)
              ↓
   2019-2021 시계열 Transformer 시도
   LogTrans, Reformer, Informer
   "Sparse self-attention 으로 효율"
              ↓
   2021 Autoformer ★
   "Self-attention 자체 를 교체 + 분해를 inner block 으로"
              ↓
   38% MSE reduction (평균)
              ↓
   2022-2023 후속 paper 들 영향
   FEDformer (2022) — Fourier 분해
   PatchTST (2023) — Patching
   iTransformer (2024) — Channel attention
```

**메시지**: Autoformer 는 시계열 분야의 *paradigm shift*. *Sparse attention 변형* 의 *bounded improvement* 에서 *근본적 mechanism 교체* 로.

---

## 3.8 본 논문이 *재고* 시킨 통념

| 학계 통념 (2019-2021) | Autoformer 발견 |
|---------------------|----------------|
| Self-attention 의 *sparse 버전* 이 답 | Self-attention 자체 를 *교체* (Auto-Correlation) |
| 분해는 *사전 처리* 만 가능 | *모델 inner block* 으로 가능 |
| Point-wise 비교 가 자연스러움 | *Series-wise (조각 별)* 가 *시계열 구조* 와 일치 |
| $O(L \log L)$ + 정확도 trade-off | *둘 다 동시 달성 가능* |

---

## 3.9 자기점검

### 핵심 3가지
1. **장기 예측 의 *두 가지 벽* 의 의미?**
2. **Autoformer 의 *두 가지 새 기법* 의 직관?**
3. **본 논문 의 *paradigm shift* 의 의의?**

### 답변
1. **(벽 1) Intricate Temporal Patterns**: 장기 미래 의 *trend + seasonal + noise 가 섞임* → *진짜 dependency* 찾기 어려움. Prophet/N-BEATS 의 *사전 분해* 가 *future 에 적용 X* — 한계. **(벽 2) Information Bottleneck**: Informer/Reformer/LogTrans 의 *sparse self-attention* 이 *효율* 위해 *정보 손실*. 책 1000 페이지 중 100 페이지 만 보는 격.
2. **(기법 1) Auto-Correlation**: Self-attention 의 *point-wise dot product* 를 *series-wise* Auto-Correlation 으로 *교체*. 24시간 주기 의 *매일 오전 9시* sub-series 들 끼리 *조각 별 비교*. FFT 로 $O(L \log L)$. **(기법 2) Inner Decomposition**: 분해 를 *매 layer 마다 inner block* — *progressive 분리*. 학생 이 *매 단계 답 점검* 같음.
3. **Paradigm shift**: *sparse attention 변형* (효율-정확도 trade-off) → *근본 mechanism 교체* (둘 다 동시 달성). 후속 (FEDformer, PatchTST, iTransformer) 가 *Autoformer 의 방향* 위에 build. 38% MSE reduction 평균 + ETTm2-336 의 *74% 감소* — paradigm 의 *quantitative 증명*.

---

다음 챕터: [04_related_work.md](04_related_work.md) — Related Work 의 cluster 별 정리.
