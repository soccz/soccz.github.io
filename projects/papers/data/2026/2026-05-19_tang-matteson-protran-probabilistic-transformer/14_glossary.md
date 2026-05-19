# 14 Glossary + Notation + References

## 핵심 약어

| 약어 | 풀이 | 출처 |
|------|------|------|
| SSM | State-Space Model | Section 2.1 |
| LDS | Linear Dynamical System | Section 2.1 (baseline 비교) |
| VAE | Variational AutoEncoder | Kingma 2013 |
| ELBO | Evidence Lower BOund | Eq 3, 14-15 |
| KL | Kullback-Leibler divergence | Eq 3 |
| MLP | Multi-Layer Perceptron | Eq 5, 8, 19 |
| LayerNorm | Layer Normalization | Eq 5-7, 17-20 |
| MAF | Masked Autoregressive Flow | Transformer-MAF baseline |
| CRPS | Continuous Ranked Probability Score | Eq 20-style metric |
| CRPS_sum | CRPS summed across series | Table 1 metric |
| ADE | Average Displacement Error | Motion metric |
| FDE | Final Displacement Error | Motion metric |
| ERD | Encoder-Recurrent-Decoder | Motion baseline |
| acLSTM | autocorrelative LSTM | Motion baseline |
| GMVAE | Gaussian Mixture VAE | Motion baseline |
| HP-GAN | Human Pose GAN | Motion baseline |
| DSP | Diversity Sample Population | Motion baseline |
| DLow | Diversifying Latent Flows | Motion 2위 baseline |
| RNN | Recurrent Neural Network | paper 가 거부 |
| MAP | Maximum A Posteriori | inference 용어 |

---

## 표기법

### Time Series

| 기호 | 의미 |
|------|------|
| $N$ | 시계열 개수 |
| $T_i$ | $i$-th 시계열 길이 |
| $T$ | total sequence length |
| $C$ | context length |
| $x^{(i)}_t$ | $i$-th 시계열의 시점 $t$ 값 (scalar) |
| $x_t \in \mathbb{R}^N$ | 시점 $t$ 의 multivariate observation |
| $x_{1:C}$ | context (observed) |
| $x_{C+1:T}$ | target (predict) |

### Latent + Hidden

| 기호 | 의미 |
|------|------|
| $z_t$ | stochastic latent variable at time $t$ |
| $z_{1:T}$ | full latent sequence |
| $w_t \in \mathbb{R}^d$ | hidden representation (deterministic + stochastic) |
| $w_0$ | learnable context-agnostic initial state |
| $\bar{w}_t$ | after self-attention (Eq 6) |
| $\hat{w}_t$ | after cross-attention (Eq 7) |
| $h_{1:C}$ | context embeddings |
| $h_{1:T}$ | full embeddings (training time only) |
| $k_t$ | bidirectional summary (Eq 10) |
| $d$ | hidden dimension (128 for $w$, 16 for $z$) |

### Multi-layer

| 기호 | 의미 |
|------|------|
| $L$ | number of layers (2 or 3 in experiments) |
| $z_t^{(\ell)}$ | latent at time $t$, layer $\ell$ |
| $w_t^{(\ell)}$ | hidden at time $t$, layer $\ell$ |
| $\tilde{w}_t^{(\ell)}$ | after cross-layer attention (Eq 16) |
| $\bar{w}_t^{(\ell)}, \hat{w}_t^{(\ell)}$ | after within-layer attentions |

### Model parameters

| 기호 | 의미 |
|------|------|
| $\theta$ | generative model parameters |
| $\phi$ | inference (variational) parameters |
| $p_\theta$ | generative distribution |
| $q_\phi$ | variational posterior |
| $W^Q, W^K, W^V$ | attention projection matrices |
| $H$ | attention heads (=8) |
| $\beta$ | Laplace scale parameter / KL weight |

---

## 핵심 수식 정리

### Eq 1 — SSM
$$p_\theta(x_{1:T} | x_{1:C}) = \int p_\theta(x_{1:T} | z_{1:T}) p_\theta(z_{1:T} | x_{1:C}) dz_{1:T}$$

### Eq 2 — Decomposition
$$p_\theta(z_{1:T} | x_{1:C}) = \prod_t p_\theta(z_t | z_{1:t-1}, x_{1:C})$$
$$p_\theta(x_{1:T} | z_{1:T}) = \prod_t p_\theta(x_t | z_t)$$

### Eq 3 — ELBO
$$\log p_\theta(x_{1:T}|x_{1:C}) \geq \sum_t \big(\mathbb{E}_q[\log p_\theta(x_t|z_t)] - D_{KL}(q_\phi(z_t|z_{1:t-1}, x_{1:T}) \| p_\theta(z_t|z_{1:t-1}, x_{1:C}))\big)$$

### Eq 4 — Multi-head attention
$$O_h = \text{softmax}(Q_h K_h^T / \sqrt{d}) V_h$$

### Eq 5 — Context embedding
$$h_t = \text{LayerNorm}(\text{MLP}(x_t) + \text{Position}(t))$$

### Eq 6-9 — Single-layer generation
$$\bar{w}_t = \text{LN}(w_{t-1} + \text{Attn}(w_{t-1}, w_{1:t-1}, w_{1:t-1}))$$
$$\hat{w}_t = \text{LN}(\bar{w}_t + \text{Attn}(\bar{w}_t, h_{1:C}, h_{1:C}))$$
$$z_t = \text{Sample}(\mathcal{N}(\text{MLP}(\hat{w}_t), \text{Softplus}(\text{MLP}(\hat{w}_t))))$$
$$w_t = \text{LN}(\hat{w}_t + \text{MLP}(z_t) + \text{Position}(t))$$

### Eq 10-11 — Inference (smoothing)
$$k_t = \text{Attn}(h_{1:T}, h_{1:T}, h_{1:T})$$
$$z_t = \text{Sample}(\mathcal{N}(\text{MLP}([\hat{w}_t, k_t]), \text{Softplus}(\text{MLP}([\hat{w}_t, k_t]))))$$

### Eq 12-13 — Multi-layer decomposition
$$p_\theta(x_{1:T}, z_{1:T}^{(1:L)} | x_{1:C}) = \prod_t p_\theta(x_t|z_t^{(L)}) \prod_{\ell, t} p_\theta(z_t^{(\ell)} | z_{1:t-1}^{(\ell)}, z_{1:T}^{(\ell-1)}, x_{1:C})$$

### Eq 14-15 — Multi-layer ELBO
$$\geq \sum_t \mathbb{E}_q[\log p_\theta(x_t|z_t^{(L)})] - \sum_\ell \text{KL}(q_\phi \| p_\theta)$$

### Eq 16-20 — Multi-layer generation per layer
$$\tilde{w}_t^{(\ell)} = \text{LN}(w_{t-1}^{(\ell)} + \text{Attn}(w_{t-1}^{(\ell)}, w_{1:T}^{(\ell-1)}, w_{1:T}^{(\ell-1)}))$$
(...등 5 step)

---

## paper References — 101 papers

paper References 가 [1]-[101] 총 101개. 본 deep dive 의 핵심 referenced (ch01-13 에서 cited):

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
- **[73]** **Rasul (TimeGrad, 2021, diffusion)** ← Table 1 baseline (가장 강한 경쟁자)

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

### Hierarchical VAE inspiration
- **[17]** Child (Very Deep VAEs, 2020)
- **[80]** Sønderby (Ladder VAE)
- **[83]** Vahdat-Kautz (NVAE)
- **[101]** Zhao (Hierarchical VAE)

### Sparse Transformer (paper limitation 해결책)
- **[9]** Beltagy (Longformer, 2020)
- **[18]** Child (Sparse Transformer, 2019)
- **[50]** Kitaev (Reformer)
- **[55]** Li (Informer-style)

→ **총 101 references**, 본 deep dive 가 약 50개 이상 cite 또는 brief mention.

---

다음 [15_insights.md](15_insights.md) 에서 메타 통찰.
