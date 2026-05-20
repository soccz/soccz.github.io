# 14. 용어집 + 표기법 + References — 사전 형태로 정리

이 파일은 ProTran 전체에서 등장하는 **모든 기호와 용어를 사전 형태**로 정리.

찾고 싶은 기호가 있으면 여기서 빠르게 찾아볼 수 있게.

---

## 14.1 핵심 약어

| 약어 | 풀이 | 출처 | 본 해설집 챕터 |
|------|------|------|----------|
| **SSM** | State-Space Model | Section 2.1 | ch04 |
| **LDS** | Linear Dynamical System | Section 2.1 (baseline) | ch04, Fig 1(a) |
| **VAE** | Variational Auto-Encoder | Kingma 2013 [49] | ch01, ch04 |
| **ELBO** | Evidence Lower BOund | Eq 3, 14-15 | ch04 |
| **KL** | Kullback-Leibler divergence | Eq 3 | ch04 |
| **MLP** | Multi-Layer Perceptron | Eq 5, 8, 19 | ch04-08 |
| **LayerNorm** | Layer Normalization | Eq 5-7, 17-20 | ch06 |
| **MAF** | Masked Autoregressive Flow | Transformer-MAF baseline | ch10 |
| **CRPS** | Continuous Ranked Probability Score | Eq 20-style metric | ch01, ch10 |
| **CRPS_sum** | CRPS summed across series | Table 1 metric | ch11 |
| **ADE** | Average Displacement Error | Motion metric | ch01, ch10 |
| **FDE** | Final Displacement Error | Motion metric | ch01, ch10 |
| **RNN** | Recurrent Neural Network | paper 가 거부 | ch03, ch05 |
| **LSTM** | Long Short-Term Memory | RNN 변형 | ch10 (baseline) |
| **GAN** | Generative Adversarial Network | HP-GAN baseline | ch10 |
| **MAP** | Maximum A Posteriori | Inference 용어 | ch07 |
| **HMM** | Hidden Markov Model | 고전 모션 모델 | ch09 |
| **GP** | Gaussian Process | GP-Copula baseline | ch10 |
| **AR** | Autoregressive | DeepAR | ch05, ch10 |
| **VAR** | Vector Autoregression | Baseline | ch10 |
| **NVAE** | Nouveau VAE | Hierarchical VAE 영감 | ch08 |
| **VDVAE** | Very Deep VAE | Hierarchical VAE 영감 | ch08 |

---

## 14.2 표기법 — Time Series

| 기호 | 의미 | 크기 | 비유 |
|------|------|------|------|
| $N$ | 시계열 개수 | scalar | 도로 100개 → $N=100$ |
| $T_i$ | $i$-th 시계열 길이 | scalar | 도로 $i$ 의 측정 시점 수 |
| $T$ | total sequence length | scalar | 모든 시계열의 통일 길이 |
| $C$ | context length | scalar | 학습 시 입력 부분 길이 |
| $x^{(i)}_t$ | $i$ 번째 시계열의 시점 $t$ 값 (스칼라) | scalar | 도로 $i$ 의 09시 트래픽 |
| $x_t \in \mathbb{R}^N$ | 시점 $t$ 의 multivariate observation | $N \times 1$ | 09시 모든 도로 트래픽 벡터 |
| $x_{1:C}$ | context (observed) | $C \times N$ | 과거 $C$ 시점의 다변량 sequence |
| $x_{C+1:T}$ | target (predict) | $(T-C) \times N$ | 미래 예측 대상 |
| $x_{1:T}$ | 전체 sequence | $T \times N$ | context + target 합친 것 |

### 자주 헷갈리는 것

- $x^{(i)}_t$ vs $x_t$: 전자는 한 변수의 한 시점 (스칼라), 후자는 모든 변수의 한 시점 (벡터).
- $T_i$ vs $T$: paper 표기에서 $T_i$ 가 dataset 의 다양한 길이, $T$ 가 모델 입력의 통일 길이. 실험에서는 다 통일된 $T$ 사용.

---

## 14.3 표기법 — Latent + Hidden

| 기호 | 의미 | 크기 | 단계 |
|------|------|------|------|
| $z_t$ | stochastic latent variable at time $t$ | $d_{latent}$ (16) | Eq 8, 11 |
| $z_{1:T}$ | full latent sequence | $T \times d_{latent}$ | Eq 12 |
| $w_t \in \mathbb{R}^d$ | hidden representation | $d_{model}$ (128) | Eq 9, 20 |
| $w_0$ | learnable context-agnostic initial state | $d_{model}$ | learnable parameter |
| $\bar{w}_t$ | after self-attention (Eq 6) | $d_{model}$ | Eq 6 출력 |
| $\hat{w}_t$ | after cross-attention (Eq 7) | $d_{model}$ | Eq 7 출력 |
| $h_{1:C}$ | context embeddings | $C \times d_{model}$ | Eq 5 |
| $h_{1:T}$ | full embeddings (training only) | $T \times d_{model}$ | Eq 5 (학습 시) |
| $k_t$ | bidirectional summary (Eq 10) | $d_{model}$ | Eq 10 |
| $d_{model}$ | hidden dimension | scalar | 128 |
| $d_{latent}$ | latent dimension | scalar | 16 |

### 자주 헷갈리는 것

| 헷갈리는 한 쌍 | 차이 |
|--------------|------|
| $z_t$ vs $w_t$ | $z$ = stochastic latent (sample). $w$ = deterministic hidden (work variable). $z$ 는 $w$ 안에 encapsulate. |
| $h_t$ vs $w_t$ | $h$ = context observation 의 embedding. $w$ = 시간에 따라 update 되는 hidden. |
| $\bar{w}_t$ vs $\hat{w}_t$ | $\bar{w}_t$ = self-attention 후 (Eq 6). $\hat{w}_t$ = + cross-attention 후 (Eq 7). |
| $h_{1:C}$ vs $h_{1:T}$ | $h_{1:C}$ = test 시에도 사용 (context only). $h_{1:T}$ = 학습 시에만 (target 포함). |

---

## 14.4 표기법 — Multi-layer

| 기호 | 의미 | 단계 |
|------|------|------|
| $L$ | number of layers | 2 또는 3 (실험에서) |
| $\ell$ | layer index | $1 \leq \ell \leq L$ |
| $z_t^{(\ell)}$ | latent at time $t$, layer $\ell$ | Eq 19 |
| $w_t^{(\ell)}$ | hidden at time $t$, layer $\ell$ | Eq 20 |
| $\tilde{w}_t^{(\ell)}$ | after cross-layer attention | Eq 16 (NEW) |
| $\bar{w}_t^{(\ell)}, \hat{w}_t^{(\ell)}$ | within-layer attentions | Eq 17, 18 |

### Multi-layer 의 layer 순서

- $\ell = 1$ : bottom layer (가장 구체적, 짧은 timescale)
- $\ell = L$ : top layer (가장 추상적, 긴 timescale)
- Emission: $x_t = \text{MLP}(w_t^{(L)})$ — **top layer 만 관측 생성**.

---

## 14.5 표기법 — Model parameters

| 기호 | 의미 |
|------|------|
| $\theta$ | generative model parameters |
| $\phi$ | inference (variational) parameters |
| $p_\theta$ | generative distribution (prior) |
| $q_\phi$ | variational posterior |
| $W^Q, W^K, W^V$ | attention projection matrices |
| $W^O$ | attention output projection |
| $H$ | attention heads (= 8) |
| $\beta$ | Laplace scale parameter / KL weight |

### 자주 헷갈리는 것

| 헷갈리는 한 쌍 | 차이 |
|--------------|------|
| $\theta$ vs $\phi$ | $\theta$ = prior (test 시 사용). $\phi$ = posterior (학습 시만). |
| $p$ vs $q$ | $p$ = "진짜" 분포 (모델이 학습하려는). $q$ = 근사 (학습 시 사용). |
| KL($q \| p$) | 비대칭 — $q$ 가 $p$ 와 얼마나 다른가. $p$ 가 학습 목표. |

---

## 14.6 핵심 수식 — 한 곳에 모음

### Eq 1 — SSM 의 일반 형식
$$
p_\theta(x_{1:T} | x_{1:C}) = \int p_\theta(x_{1:T} | z_{1:T}) p_\theta(z_{1:T} | x_{1:C}) dz_{1:T}
$$

### Eq 2 — 분해 (Transition + Emission)
$$
p_\theta(z_{1:T} | x_{1:C}) = \prod_t p_\theta(z_t | z_{1:t-1}, x_{1:C})
$$
$$
p_\theta(x_{1:T} | z_{1:T}) = \prod_t p_\theta(x_t | z_t)
$$

### Eq 3 — Single-layer ELBO
$$
\log p_\theta(x_{1:T}|x_{1:C}) \geq \sum_t \big(\mathbb{E}_q[\log p_\theta(x_t|z_t)] - D_{KL}(q_\phi(z_t|z_{1:t-1}, x_{1:T}) \| p_\theta(z_t|z_{1:t-1}, x_{1:C}))\big)
$$

### Eq 4 — Multi-head Attention
$$
O_h = \text{Softmax}\!\left(\frac{Q_h K_h^T}{\sqrt{d}}\right) V_h
$$

### Eq 5 — Context embedding
$$
h_t = \text{LayerNorm}(\text{MLP}(x_t) + \text{Position}(t))
$$

### Eq 6 — Self-attn over past latents
$$
\bar{w}_t = \text{LayerNorm}(w_{t-1} + \text{Attention}(w_{t-1}, w_{1:t-1}, w_{1:t-1}))
$$

### Eq 7 — Cross-attn to context
$$
\hat{w}_t = \text{LayerNorm}(\bar{w}_t + \text{Attention}(\bar{w}_t, h_{1:C}, h_{1:C}))
$$

### Eq 8 — Generative sample (test 시)
$$
z_t = \text{Sample}(\mathcal{N}(\text{MLP}(\hat{w}_t), \text{Softplus}(\text{MLP}(\hat{w}_t))))
$$

### Eq 9 — Hidden update
$$
w_t = \text{LayerNorm}(\hat{w}_t + \text{MLP}(z_t) + \text{Position}(t))
$$

### Eq 10 — Bidirectional attention (smoothing, 학습 시만)
$$
k_t = \text{Attention}(h_{1:T}, h_{1:T}, h_{1:T})
$$

### Eq 11 — Inference sample (학습 시만)
$$
z_t = \text{Sample}(\mathcal{N}(\text{MLP}([\hat{w}_t, k_t]), \text{Softplus}(\text{MLP}([\hat{w}_t, k_t]))))
$$

### Eq 12-13 — Multi-layer decomposition
$$
p_\theta(x_{1:T}, z_{1:T}^{(1:L)} | x_{1:C}) = \prod_t p_\theta(x_t|z_t^{(L)}) \prod_{\ell, t} p_\theta(z_t^{(\ell)} | z_{1:t-1}^{(\ell)}, z_{1:T}^{(\ell-1)}, x_{1:C})
$$

### Eq 14-15 — Multi-layer ELBO
$$
\log p_\theta(x_{1:T}|x_{1:C}) \geq \sum_t \mathbb{E}_q[\log p_\theta(x_t|z_t^{(L)})] - \sum_\ell \text{KL}(q_\phi \| p_\theta)
$$

### Eq 16 — Cross-layer attention (NEW)
$$
\tilde{w}_t^{(\ell)} = \text{LayerNorm}(w_{t-1}^{(\ell)} + \text{Attention}(w_{t-1}^{(\ell)}, w_{1:T}^{(\ell-1)}, w_{1:T}^{(\ell-1)}))
$$

### Eq 17-20 — Multi-layer per-layer steps
(Eq 17 = Eq 6 의 multi-layer 버전, Eq 18 = Eq 7, Eq 19 = Eq 8, Eq 20 = Eq 9)

---

## 14.7 자주 헷갈리는 것들 — 주의

### ① "Generation" vs "Inference"
- **Generation (생성)**: prior $p_\theta$ 로 잠재 sample. Test 시 사용. Eq 8.
- **Inference (추론)**: posterior $q_\phi$ 로 잠재 sample. **학습 시에만**. Eq 11.
- **두 단어가 비슷해 보이지만 정반대 방향** — generation 은 latent → observation, inference 는 observation → latent.

### ② "Filtering" vs "Smoothing"
- **Filtering**: 과거 + 현재 관측만 사용 → $z_t$ 추정. RNN 의 자연스러운 방식.
- **Smoothing**: 과거 + 현재 + **미래** 관측 모두 사용 → $z_t$ 재추정. Kalman smoother. **ProTran 의 Eq 10 이 smoothing 정신**.

### ③ "Autoregressive" vs "Non-autoregressive"
- **Autoregressive**: 매 step 의 출력이 다음 step 의 입력. 표준 NLP Transformer.
- **Non-autoregressive**: 잠재 공간에서 한 번에 전체 sequence 결정. ProTran 의 정신.

### ④ "Self-attention" vs "Cross-attention"
- **Self-attention**: Q = K = V (한 source 안에서).
- **Cross-attention**: Q 와 K/V 가 다른 source.
- ProTran 은 둘 다 사용 (Eq 6 = self, Eq 7 = cross).

### ⑤ "Prior" vs "Posterior" (Bayesian terminology)
- **Prior**: 데이터 보기 전 분포 — ProTran 의 $p_\theta$.
- **Posterior**: 데이터 본 후 분포 — ProTran 의 $q_\phi$.
- 학습 시 KL 로 prior 가 posterior 를 흉내.

### ⑥ "Markov" vs "non-Markov"
- **Markov**: 현재가 직전만 의존.
- **Non-Markov**: 현재가 전체 과거 의존. ProTran 의 정신.

---

## 14.8 한 눈에 — 데이터 표기

```
시계열 데이터
─────────────────────────────────────────────────────
N개 시계열, 각각 T 시점:
        x^{(1)}_1, x^{(1)}_2, ..., x^{(1)}_T    (도로 1)
        x^{(2)}_1, x^{(2)}_2, ..., x^{(2)}_T    (도로 2)
                                ⋮
        x^{(N)}_1, x^{(N)}_2, ..., x^{(N)}_T    (도로 N)
                ▼
              (벡터로 묶기)
                ▼
        x_t = (x^{(1)}_t, x^{(2)}_t, ..., x^{(N)}_t) ∈ ℝ^N
                ▼
        x_{1:T} = (x_1, x_2, ..., x_T)  ← 모델 입력
                ▼
        Context: x_{1:C} (학습/예측 시 보는 부분)
        Target:  x_{C+1:T} (예측 대상)
```

---

## 14.9 한 눈에 — Latent 구조

```
Single-layer:
─────────────
시점:     t=1      t=2      t=3     ...     t=T
잠재:     z_1   →   z_2   →   z_3   →  ...  →  z_T
           ↘     ↗  ↘    ↗  ↘     ↗
           attention (모든 시점 ↔ 모든 시점)
           
hidden:   w_0 → w_1 → w_2 → w_3 → ... → w_T
            (deterministic + stochastic hybrid)
            
emission:           x_1  x_2  x_3  ...  x_T

Multi-layer (L=3):
──────────────────
              t=1       t=2       t=3
Layer 3:    z₁⁽³⁾  →  z₂⁽³⁾  →  z₃⁽³⁾  →  x_t (emission)
              ↑          ↑          ↑
            Eq 16 (cross-layer attention)
              ↑          ↑          ↑
Layer 2:    z₁⁽²⁾  →  z₂⁽²⁾  →  z₃⁽²⁾
              ↑          ↑          ↑
            Eq 16
              ↑          ↑          ↑
Layer 1:    z₁⁽¹⁾  →  z₂⁽¹⁾  →  z₃⁽¹⁾
```

---

## 14.10 한 눈에 — ELBO 의 의미

```
ELBO (Eq 3) = E_q[log p(x|z)] - KL(q || p)
              ↑                  ↑
              Reconstruction     Regularization
              "x 를 z 로 잘     "q 가 p 와 너무
               복원하나"         다르지 않게"
              
              ▲                  ▲
              │                  │
              학습 시 두 항을    동시에 최적화
              
              ⇓
              
              Prior p 가 Posterior q 를 따라가도록 학습
              ⇓
              Test 시: prior 만 사용해도 좋은 잠재 추정
```

---

## 14.11 자주 등장하는 hyperparameter

| Hyper | 값 | 의미 |
|-------|----|----|
| $d_{model}$ | 128 | hidden $w$ 차원 |
| $d_{latent}$ | 16 | 잠재 $z$ 차원 |
| heads $H$ | 8 | attention head 수 |
| MLP layers | 2 | 각 MLP 깊이 |
| Layers $L$ | 1-3 | dataset 별 |
| Samples | 100 | 평가 시 sample 수 |
| $\beta$ | cross-validated | KL weight |

---

## 14.12 paper References — 101 papers 중 본 deep dive 의 핵심

paper References 가 [1]-[101] 총 101개. 본 deep dive 가 cite 한 핵심:

### Foundations
- **[27]** Durbin-Koopman (2012) — SSM textbook
- **[66]** non-Gaussian SSM (Pearlmutter)
- **[85]** Vaswani (2017) — Transformer
- **[5]** Bahdanau-Cho-Bengio (2015) — Attention NMT
- **[49]** Kingma (Auto-Encoding VB) — VAE
- **[74]** Rezende (Stochastic Backprop) — VAE
- **[4]** Ba-Kiros-Hinton (2016) — LayerNorm
- **[42]** Hochreiter-Schmidhuber (1997) — LSTM
- **[35]** Gneiting-Raftery (2007) — Proper scoring rule (CRPS theory)
- **[65]** Matheson-Winkler — CRPS

### SSM lineage
- **[92]** LDS / Kalman filter classics
- **[46]** Extended Kalman filter
- **[88]** Unscented Kalman filter
- **[22]** Chung (VRNN, 2015)
- **[30]** Fraccaro (Sequential VAE, 2016)
- **[31]** Fraccaro (KVAE, 2017)
- **[39]** Hafner (PlaNet, 2019)
- **[51]** Krishnan/Fraccaro (DKS or KVAE) ← Table 1 baseline
- **[71]** Rangapuram (Deep State Space, 2018)
- **[47]** Karl (Deep Variational Bayes Filter)
- **[23]** **de Bézenac (NKF, 2020)** ← Table 1 baseline

### Time Series Forecasting
- **[12]** Box-Jenkins (textbook)
- **[43]** Hyndman (exponential smoothing) — VES baseline
- **[61]** Lutkepohl (VAR textbook)
- **[7]** Bauwens (Multivariate GARCH survey)
- **[84]** Tsay (GARCH)
- **[76]** **Salinas (DeepAR, 2020)** ← Table 1 baseline
- **[75]** **Salinas (GP-Copula, 2019)** ← Table 1 baseline
- **[33]** Gasthaus (Spline quantile)
- **[72]** **Rasul (Transformer-MAF)** ← Table 1 baseline
- **[73]** **Rasul (TimeGrad, 2021, diffusion)** ← Table 1 가장 강한 경쟁자

### Human Motion
- **[32]** **Fragkiadaki (ERD)** ← Table 3 baseline
- **[56]** **Li (acLSTM)** ← Table 3 baseline
- **[95]** **Yan (MT-VAE)** ← Table 3 baseline
- **[87]** **Walker (Pose-Knows)** ← Table 3 baseline
- **[6]** **Barsoum (HP-GAN, 2018)** ← Table 3 baseline
- **[11]** **Bhattacharyya (Best-Many)** ← Table 3 baseline
- **[25]** **Dilokthanakul (GMVAE)** ← Table 3 baseline
- **[38]** **Gurumurthy (DeliGAN)** ← Table 3 baseline
- **[98]** **Yuan (DSP)** ← Table 3 baseline
- **[97]** **Yuan-Kitani (DLow, 2020)** ← Table 3 가장 강한 경쟁자

### Hierarchical VAE 영감
- **[17]** Child (Very Deep VAEs, 2020)
- **[80]** Sønderby (Ladder VAE)
- **[83]** Vahdat-Kautz (NVAE)
- **[101]** Zhao (Hierarchical VAE)

### Sparse Transformer (한계 해결책)
- **[9]** Beltagy (Longformer, 2020)
- **[18]** Child (Sparse Transformer, 2019)
- **[50]** Kitaev (Reformer)
- **[55]** Li (Informer-style)

→ **총 101 references**, 본 deep dive 가 약 50개 이상 cite 또는 brief mention.

---

## 14.13 자기점검 (이 챕터)

### 핵심 4가지
1. **$z_t$ 와 $w_t$ 의 차이를 한 줄로?**
2. **Filtering 과 Smoothing 의 차이를 한 줄로?**
3. **$h_{1:C}$ 와 $h_{1:T}$ 는 언제 각각 사용되나?**
4. **ELBO 의 두 항이 학습에서 하는 역할은?**

### 답변
1. $z_t$ = stochastic latent (Gaussian sample). $w_t$ = deterministic component 가 있는 hidden — attention 의 Q/K/V 로 사용되는 안정적 작업 변수. $z$ 가 $w$ 안에 encapsulate.
2. Filtering = 과거+현재 관측만 사용해서 잠재 추정 (RNN 의 자연 방식). Smoothing = 과거+현재+**미래** 모두 사용해서 잠재 재추정 (Kalman smoother, ProTran 의 Eq 10).
3. $h_{1:C}$ = context embedding (학습+test 시 모두 사용). $h_{1:T}$ = 전체 sequence embedding (**학습 시에만** — target 정답 필요, Eq 10 의 입력).
4. (a) Reconstruction term $\mathbb{E}_q[\log p(x|z)]$ → emission 정확도 ↑. (b) KL term $D_{KL}(q || p)$ → prior 가 posterior 를 따라가도록 학습 → test 시 prior 만 써도 작동.

---

다음 [15_insights.md](15_insights.md) 에서 메타 통찰 15개.
