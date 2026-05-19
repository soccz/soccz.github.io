# 06 Pattern-Mixture Decomposition — Section 4.1

paper p.3–4 의 Section 4.1. 본 paper 의 가장 깊은 contribution — **시계열 분해의 quantile-aware + distribution-aware 일반화**.

![Fig. 2 architecture — 좌측 부분](figures/Fig2_architecture.png)

(Figure 2 의 좌측: Pattern-Mixture Decomposition. Drift-Divergence 와 Gaussian Mixture 두 submodule)

---

## 2 submodule 구조

> The pattern-mixture decomposition consists of two submodules: a drift-divergence decomposition and a Gaussian mixture decomposition. (paper p.3)

```
원본 χ (시계열)
   │
   ↓ submodule 1: Drift-Divergence Decomposition (Eq 4)
   ├── χ^Q = {χ^q}_{q ∈ Q}  ← quantile drift 들
   └── χ^d = χ - χ^{0.5}     ← divergence pattern
                │
                ↓ submodule 2: Gaussian Mixture Decomposition (Eq 5-7)
                D = {(μ_k, Σ_k)}_{k=1}^{K}  ← K Gaussian components
```

---

## Submodule 1: Drift-Divergence Decomposition (Eq 4)

paper Eq 4:
$$
\chi^q = \text{QuantileFilt}(\text{Padding}(\chi), q)
$$
$$
\chi^d = \chi - \chi^{0.5}
$$

### 핵심 도구 — `QuantileFilt`

paper text:
> For each quantile $q$ in the quantile set $Q$, we extract the drift component $\chi^q$ of the original series using a sliding window. We use $\chi^Q$ to represent the set containing all the drift components, i.e., $\chi^Q = \{\chi^q\}_{q \in Q}$. (paper p.3)

`QuantileFilt(X, q)` = sliding window 의 **q-th quantile** 계산.

비교:
- **Autoformer 의 AvgPool**: 각 window 의 평균.
- **QuantileFormer 의 QuantileFilt**: 각 window 의 q-th quantile.

예 (window=3, q=0.9):
```
X = [3, 5, 2, 7, 4, 9, 6, 1, 8]
window @ t=1: [3, 5, 2] → 0.9-quantile ≈ 5.0
window @ t=2: [5, 2, 7] → 0.9-quantile ≈ 7.0
window @ t=3: [2, 7, 4] → 0.9-quantile ≈ 7.0
...
```

→ AvgPool 이 single trend 만 추출하는 반면 QuantileFilt 는 **각 quantile level 마다 다른 trend** 추출. 위 quantile 의 데이터의 "envelope" 모양.

### `Padding`

`Padding(χ)` = sliding window 의 양쪽 끝 보강 (output length = input length 유지).

Autoformer 의 동일 도구 (paper Eq 1) 와 동등한 역할.

### Quantile Drift $\chi^Q$ — 핵심 의의

- $Q = \{0.5, 0.6, 0.7, 0.8, 0.9\}$ → 5개 quantile drift.
- 각 drift 는 **smooth trend** 한 신호.
- **여러 quantile** 의 trend 를 동시에 보유 → upper/lower envelope 변화 파악.

### Divergence Pattern $\chi^d$ — 핵심 의의

$\chi^d = \chi - \chi^{0.5}$:
- 원본에서 median (0.5-quantile) 을 뺌 → **median-centered residual**.
- 노이즈가 아닌 **median 으로부터 일관된 편차** 가 들어있음.
- 복잡한 주기 + statistical 특성이 남음.

paper text (p.3):
> The quantile drift $\chi^Q$ represents smooth components of the time series, and the divergence component $\chi^d$ contains complex periodic patterns and distribution characteristics.

→ **Smooth (drift) vs Complex (divergence)** 의 2 path 로 분리.

---

## 인터랙티브 시각화 — Drift-Divergence 분해

```viz:qf-drift-divergence:title=Drift-Divergence Decomposition (Eq 4),caption=Quantile slider 로 q ∈ {0.1 0.3 0.5 0.7 0.9} 의 drift 비교. 원본 series + 5개 quantile drift + divergence pattern 동시 표시. q=0.5 가 median drift. q=0.9 는 상위 envelope. divergence 는 median 으로부터의 편차로 복잡 패턴 보존.
```

---

## Submodule 2: Gaussian Mixture Decomposition (Eq 5-7)

paper p.3:
> Gaussian Mixture Models (GMM) is a probabilistic model that represents a mixture of multiple Gaussian distributions.

### 단일 Gaussian (Eq 5)
$$
f(x | \mu, \Sigma) = \frac{1}{(2\pi)^{d/2} |\Sigma|^{1/2}} \exp\!\left(-\tfrac{1}{2}(x - \mu)^T \Sigma^{-1}(x - \mu)\right)
$$

- $\mu$ = 평균 vector
- $\Sigma$ = 공분산 matrix
- $d$ = 데이터 dimension

### Mixture (Likelihood, Eq 6)
$$
L(\Theta | \chi^d) = \prod_{i=1}^{N} P(x_i; \Theta)
$$

$\Theta = \{(\mu_k, \Sigma_k)\}_{k=1}^{K}$ 가 데이터 $\chi^d$ 를 가장 잘 설명하는 K Gaussian 의 parameter set.

### `GauDe(·)` (Eq 7)

paper text:
> GMM decomposition aims to maximize the above likelihood function, which can be achieved by an iterative optimization algorithm such as Expectation-Maximization. We use $\text{GauDe}(\cdot)$ to summarize the above operations.

$$
D = \text{GauDe}(\chi^d)
$$

- $D = \{(\mu_k, \Sigma_k)\}_{k=1}^{K}$.
- $K$ = hyperparameter (paper section 5.3 의 ablation, ch14 참조).

**Expectation-Maximization (EM)** 의 핵심 iter (Dempster 1977):
1. **E-step**: 각 데이터 $x_i$ 가 component $k$ 에 속할 확률 추정 — $\gamma_{ik} = \frac{\pi_k \mathcal{N}(x_i | \mu_k, \Sigma_k)}{\sum_j \pi_j \mathcal{N}(x_i | \mu_j, \Sigma_j)}$.
2. **M-step**: $\mu_k, \Sigma_k, \pi_k$ 갱신.

→ 수렴할 때까지 반복. Output = $D$.

---

## 인터랙티브 시각화 — GMM 분해

```viz:qf-gmm-decomp:title=Gaussian Mixture Decomposition of Divergence (Eq 7),caption=K slider 로 component 수 조작 (2~10). Divergence pattern (1D)의 histogram + 추정된 K Gaussian 의 PDF overlay. K 가 작으면 underfit. K 가 너무 크면 overfit. paper 가 권장하는 K ∈ [6 10] 영역에서 fit 이 부드러움.
```

---

## 통합 — Pattern-Mixture Decomposition 의 의의

```
원본 χ ──→ Drift-Divergence (Eq 4) ──→ χ^Q (drift) ──→ Transformer Encoder
                                  └─→ χ^d (divergence) ──→ GMM (Eq 7) ──→ D ──→ VAE
```

**왜 2-stage decomposition?**:

| Stage | 무엇을 잡나? | 후속 처리 |
|-------|------------|-----------|
| Drift-Divergence (Eq 4) | Smooth quantile-level trends + median-centered residual | 각각 별도 path 로 |
| GMM (Eq 7) | Divergence 안의 statistical distribution | VAE 로 latent 추론 |

→ **3 정보 source** 가 생성:
1. $\chi^Q$ — quantile-aware trends (deterministic)
2. $\chi^d$ — divergence residual (deterministic)
3. $D$ — statistical components (probabilistic)

이 셋이 ch07–09 의 fusion architecture 에서 결합.

---

## Autoformer 와의 비교

| 측면 | Autoformer (2021) | QuantileFormer (2025) |
|------|-------------------|----------------------|
| 분해 횟수 | 1 stage (trend + seasonal) | **2 stage** (drift+divergence + GMM) |
| Drift 추출 | AvgPool (single) | QuantileFilt (multi-quantile) |
| Residual 처리 | seasonal = X - trend (그대로) | divergence + **추가 GMM 분해** |
| 확률 측면 | 없음 | GMM 으로 distribution 추정 |

→ Autoformer 의 단순 분해를 **2 stage + probability-aware** 로 확장. 

다음 [07_vae_inference.md](07_vae_inference.md) 에서 GMM components $D$ 의 VAE 처리 (Eq 8–15).
