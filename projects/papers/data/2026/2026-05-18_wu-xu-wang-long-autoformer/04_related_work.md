# 04. Related Work — 본 논문이 인용하는 모든 prior 작품

> Paper Section 2 의 *모든 인용 작품* 의 brief description + 본 논문과의 관계.

---

## 4.1 챕터 한 줄 요약

> **"본 논문이 인용하는 40+ prior paper 의 cluster 별 정리. (1) 고전 통계 모델 — ARIMA, 필터 류, (2) RNN/CNN/Attention 시계열 모델 — DeepAR/LSTNet/TCN, (3) Transformer 시계열 변형 — LogTrans/Reformer/Informer, (4) 시계열 분해 방법 — Prophet/N-BEATS/STL, (5) 확률 과정 이론 — Chatfield/Papoulis."**

---

## 4.2 Cluster 1 — 고전 통계 시계열 모델

**일상 비유 — 시계열 forecasting 의 *학계 역사***: 마치 *수송 도구 의 진화* — 마차 (통계 모델) → 자전거 (RNN/CNN) → 자동차 (Transformer) → 비행기 (Autoformer). 각 시대 의 *기술 hierarchy*. 본 cluster 가 *가장 오래된 마차*.

### ARIMA (Box & Jenkins 1970, 1968)

- **풀네임**: AutoRegressive Integrated Moving Average.
- **Idea**: 시계열을 *AR (자기 회귀) + I (적분) + MA (이동 평균)* 로 분해 → 예측.
- **장점**: 통계적 해석 가능, *작은 dataset* 에서 효과적.
- **한계**: *비선형성* 처리 X, long-term forecasting 약함.
- **본 논문에서의 역할**: *Univariate baseline* (Table 2).

### Filtering Methods (Christiano-Fitzgerald 2003 / Hodrick-Prescott 1997 / Baxter-King 1998)

- **Idea**: *Bandpass filter* 로 *주파수 영역* 에서 trend / cycle 분리.
- **본 논문에서의 역할**: *Decomposition algorithm baseline* (Table 9 - Appendix D).

### Box-Jenkins Methodology (1970)

- **Idea**: 시계열 *식별 → 추정 → 진단* 의 3 단계 framework.
- **본 논문**: ARIMA 의 *수학적 기반*.

---

## 4.3 Cluster 2 — RNN / CNN / Attention 시계열 모델

**일상 비유**: *마차 → 자전거*. *Deep learning 의 1세대* — 통계 모델 보다 *유연 + 강력*. RNN 의 *순환 기억* + CNN 의 *공간 인지* 적용.

### LSTM (Hochreiter & Schmidhuber 1997)

- **Idea**: *RNN 의 long-term 의존성* 해결 위한 *gating 메커니즘*.
- **본 논문에서의 역할**: *Multivariate baseline* (Table 1).

### DeepAR (Salinas et al 2020)

- **Idea**: *Autoregressive RNN* + *Gaussian likelihood* 의 probabilistic forecasting.
- **본 논문**: *Univariate baseline* (Table 2).

### LSTNet (Lai et al 2018)

- **Idea**: *CNN + RNN + Skip connection* 의 hybrid model. *Short + Long-term* 패턴 모두 잡기.
- **본 논문**: *Multivariate baseline* (Table 1).

### TCN (Bai et al 2018)

- **Idea**: *Causal Convolution* 으로 시계열 모델링. *RNN 의 sequential 처리 한계* 극복.
- **본 논문**: *Multivariate baseline* (Table 1).

### Attention-based RNNs (Yao 2017, Shih 2019, Song 2018)

- **Idea**: RNN 에 *attention* 추가.
- **본 논문**: *전통 attention 시계열* 의 prior.

---

## 4.4 Cluster 3 — Transformer 시계열 변형 (★ 본 논문 의 main baseline)

**일상 비유**: *자전거 → 자동차*. *Deep learning 의 2세대* — Attention 메커니즘 의 *long-range dependency* 처리. 그러나 *시계열 specific 변형* 의 *bounded improvement*.

### Transformer (Vaswani et al 2017)

- **Idea**: *Self-attention 의 origin*. NLP 의 혁명.
- **한계**: $O(L^2)$ complexity — long sequence 어려움.
- **본 논문**: *Full attention baseline* (Table 4).

### LogTrans (Li et al 2019)

- **Idea**: *LogSparse attention* — log 간격 으로 sparse.
- **Complexity**: $O(L (\log L)^2)$.
- **본 논문**: *Multivariate + Univariate baseline* (Table 1, 2, 4).

### Reformer (Kitaev et al 2020)

- **Idea**: *LSH (Locality-Sensitive Hashing) attention*.
- **Complexity**: $O(L \log L)$.
- **본 논문**: *Baseline* (Table 1, 4).

### Informer (Zhou et al 2021)

- **Idea**: *ProbSparse attention* — KL divergence 로 important query 선택.
- **Complexity**: $O(L \log L)$.
- **본 논문**: *Main competitor* (Table 1-4 의 가장 강한 baseline).

### Music Transformer (Huang et al 2019)

- **Idea**: 음악 generation 위한 Transformer.
- **본 논문**: Transformer 의 sequential domain 응용 예시.

### Adversarial Sparse Transformer (Wu et al 2020)

- **Idea**: Adversarial training + sparse attention.
- **본 논문**: Sparse attention 변형 의 또 다른 prior.

### 공통 패턴

이 *모든 Transformer 변형* 의 *공통점*:
1. *Sparse self-attention 의 변형*.
2. *Point-wise* (점 별 비교).
3. *분해 없음*.

**본 논문 의 차별점**: Auto-Correlation 으로 *self-attention 자체 교체* + *분해 inner block*.

---

## 4.5 Cluster 4 — 시계열 분해 (Decomposition)

**일상 비유**: *재료 분리 학파*. 시계열을 *trend + seasonal* 같은 *기본 성분* 으로 분리 → 각 따로 처리 → 합치기. *공장 의 분업* 같은 정신. 그러나 *사전 처리* 한계 — *미래 의 분해 불가능*.

### STL (Cleveland 1990)

- **풀네임**: Seasonal-Trend decomposition using Loess.
- **Idea**: *Loess regression* 기반 *robust 분해*.
- **본 논문**: *Decomposition baseline* (Table 9).

### Prophet (Taylor & Letham 2018)

- **Idea**: *Trend + Seasonal + Holiday* 분해 + Bayesian fitting.
- **사용**: Facebook 의 *비즈니스 forecasting* 표준 도구.
- **한계**: 분해 가 *사전 처리* 만.
- **본 논문**: *Pre-decomposition* 의 대표.

### N-BEATS (Oreshkin et al 2019)

- **Idea**: *Basis expansion* (Fourier basis, polynomial basis) 으로 *interpretable forecasting*.
- **본 논문**: *Univariate baseline* (Table 2).

### DeepGLO (Sen et al 2019)

- **Idea**: *Matrix decomposition + Deep network* 의 hybrid.
- **본 논문**: 분해 의 *deep network* 사용 prior.

### 공통 패턴 (Prophet, N-BEATS, DeepGLO)

분해를 *사전 처리* 만 사용. *Future 는 알 수 없으니* *future 의 분해* 불가능.

**본 논문 의 차별점**: 분해 를 *inner block* 으로 — *future hidden representation* 에도 *progressive* 분해 적용.

### Anderson-Kendall 1976 / Hyndman-Athanasopoulos 2018

시계열 분석 의 *표준 textbook*. 분해 의 *수학적 기반*.

---

## 4.6 Cluster 5 — 확률 과정 + FFT 이론

### Chatfield 1981 / Papoulis-Saunders 1989

- **Idea**: *Stochastic process theory* — autocorrelation 의 수학적 정의.
- **본 논문**: *Eq 5 (autocorrelation)* 의 prior.

### Wiener 1930 / Wiener-Khinchin Theorem

- **Idea**: *Power spectrum 의 IFFT = Autocorrelation*. *시간 ↔ 주파수* domain 의 수학적 다리.
- **본 논문**: *Eq 8 (FFT 기반 R 계산)* 의 prior.

### Diebold-Kilian 2001

- **Idea**: 시계열 *predictability* 측정 의 macroeconomic 응용.
- **본 논문**: *Exchange dataset (8개국 환율)* 의 *low predictability* 의 정당화.

---

## 4.7 Cluster 6 — 비교 응용 분야

### BERT (Devlin et al 2019) / GPT-3 (Brown et al 2020)

NLP 의 *foundation model*. Transformer 의 *NLP 성공* 의 증명.

### ViT (Dosovitskiy et al 2021)

Vision Transformer. *이미지를 patch 로* + NLP Transformer 적용.

→ 본 논문 *시계열 도 비슷 시도 동기*.

### Swin Transformer (Liu et al 2021)

Hierarchical Vision Transformer.

---

## 4.8 본 논문이 cover 한 References 분류

| 클러스터 | 개수 | 본 논문에서의 역할 |
|----------|------|-------------------|
| 고전 통계 (ARIMA, 필터) | 5+ | Baseline + decomp algorithm |
| RNN/CNN/Attention | 6+ | Baseline |
| **Transformer 시계열** | 5 | **Main baseline + comparison target** |
| 시계열 분해 (Prophet, STL) | 5+ | *Pre-decomposition* 대표 |
| 확률 과정 + FFT | 3+ | *Auto-Correlation* 의 수학적 기반 |
| NLP/CV Transformer | 5+ | Transformer 분야 성공 의 증명 |
| 기타 (Adam, BN 등) | 5+ | 기술적 reference |

→ 약 48 references, 본 deep dive 가 *cluster classified*.

---

## 4.9 본 논문의 *직접 prior* 4개

본 논문이 *가장 깊게* 영향 받은 4 paper:

### 1. Transformer (Vaswani et al 2017)

- **이유**: *Encoder-Decoder + Multi-head attention* framework. 본 논문이 *backbone 으로 유지*.

### 2. Informer (Zhou et al 2021)

- **이유**: 가장 강한 *시계열 Transformer competitor*. 본 논문 *Table 1-4* 의 *main comparison*.

### 3. Prophet (Taylor 2018) / N-BEATS (Oreshkin 2019)

- **이유**: *시계열 분해 의 사전 처리 관행*. 본 논문이 *극복* 대상.

### 4. Chatfield 1981 / Papoulis-Saunders 1989

- **이유**: *Stochastic process theory* 의 *autocorrelation 정의*. 본 논문 *Auto-Correlation 의 수학적 motivation*.

---

## 4.10 자기점검

### 핵심 3가지
1. **Autoformer 의 *직접 prior* 4 개?**
2. **시계열 Transformer 5 변형 의 *공통 한계*?**
3. **분해 (Prophet / N-BEATS) 와 Autoformer 의 *차별점*?**

### 답변
1. **(1) Transformer (Vaswani 2017)** — encoder-decoder framework. **(2) Informer (Zhou 2021)** — 가장 강한 시계열 competitor. **(3) Prophet (Taylor 2018) / N-BEATS (Oreshkin 2019)** — 사전 분해 의 *극복 대상*. **(4) Chatfield 1981 + Papoulis-Saunders 1989** — *autocorrelation 수학적 기반*.
2. **(공통 한계 3가지)**: (i) *Point-wise* (점 별 비교) — 시계열 의 *주기성* 활용 X. (ii) *Sparse self-attention 의 변형* — *self-attention 자체* 는 유지. (iii) *분해 없음* — *trend + seasonal* 의 *명시적 분리* 없음. *Autoformer 가 이 3 가지 모두 차별*.
3. **Prophet / N-BEATS**: 분해 *사전 처리* 만 (학습 전 1회). *Future 의 분해 불가능* — 한계. **Autoformer**: 분해 를 *encoder + decoder 의 inner block*. *Hidden representation 매 layer 마다 분해* — *progressive*. *Future hidden* 에도 적용 가능. 학생 의 *시험 전 1번 점검* vs *문제 풀 때마다 답 점검* 의 차이.

---

다음 챕터: [05_architecture.md](05_architecture.md) — Decomposition architecture (Eq 1-4).
