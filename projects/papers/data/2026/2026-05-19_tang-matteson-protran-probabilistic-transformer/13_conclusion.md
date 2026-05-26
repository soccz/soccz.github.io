# 13 Conclusion & Discussion — Section 6

> **🧒 한 줄 요약**: Conclusion. Probabilistic Transformer의 structured approach.


paper p.9-10.

## 원문

> In this work, we have introduced generative models for multivariate time series that combines strengths of state space models and transformer architectures. In contrast to previous work, our models do not rely on recurrent neural networks but make extensive use of attention mechanism. We also extend our models to include hierarchical latent variables, inspired by recent developments of VAEs for non-sequential data [17, 83]. Empirical experiments show that our models perform remarkably well on time series forecasting and human motion prediction.

(4 문장)

---

## 한국어 직역

> 본 연구에서 다변량 시계열의 generative model 을 제안 — SSM 과 Transformer 의 장점 결합. 기존 연구와 대조적으로, RNN 에 의존하지 않고 attention 메커니즘을 광범위 활용. Hierarchical latent variable 로 확장 — non-sequential 데이터의 VAE 발전에서 영감. 시계열 forecasting + human motion prediction 양쪽 모두 우수한 성능.

---

## 한계 (paper 가 명시한 limitations)

paper p.10:
> Our models do not come without limitations, however. As in other transformer-based approaches, the reliance on attention incurs a quadratic time and memory complexity. While we do not find it problematic in our experiments, the limitation necessarily hinders applications of our models in tasks characterized by long-term dependencies such as language modelling or music generation [36].

**한계 1**: **$O(T^2)$ 복잡도** — attention 의 standard 문제. Long sequences (language, music) 에 부담.

**해결 가능성** (paper p.10):
> Fortunately, recent work on sparse transformer [9, 18, 50, 55] can potentially address the issue, and we leave such an investigation for future work.

→ Sparse Transformer (Longformer, BigBird, Informer 등) 와 결합 가능 — 미래 work.

---

## Broader Impact

paper p.10:
> Probabilistic time series forecasting is a fundamental research problem with wide-ranging applications in society. Although we have not explored healthcare applications of our work, previously proposed methods with similar formulations have demonstrated potentials of forecasting techniques [1, 81] in diagnoses or disease control.

→ Healthcare 응용 명시. Alaa-van der Schaar [1] 의 attentive SSM 이 disease progression 모델링한 예 참조.

---

## 본 paper 의 메시지 — 한 줄

> SSM + Transformer 의 결합으로 RNN 없이 multivariate 시계열의 generative 모델링. Probabilistic + non-autoregressive + hierarchical. 2 task 7 dataset SOTA.

---

## 5 가지 ML 디자인 원칙 (본 deep dive 의 해석)

### 1. Latent attention > observation attention
표준 Transformer 가 observation 에 attention 한다면, ProTran 은 **latent variable** 에 attention. 이론적으로 더 expressive (latent 가 모든 정보 응축).

### 2. Non-autoregressive 가 가능한 영역
NLP 의 autoregressive 가 표준이지만, 시계열의 generative modeling 에서는 **non-autoregressive** 가 가능. Latent sample → 전체 시퀀스 한 번에 생성.

### 3. Hierarchical latents = depth scaling
VAE 의 hierarchy 가 image 에 효과적 (VDVAE, NVAE). 시계열에도 그대로 transfer 가능.

### 4. Smoothing > Filtering
표준 RNN 은 unidirectional filtering. ProTran 은 attention 으로 **bidirectional smoothing** — past + future 모두 활용.

### 5. Task-agnostic framework
같은 architecture 가 time series + motion 양쪽 SOTA. **Conditional prediction problem** 의 general framework.

---

## Autoformer / QuantileFormer 와 비교 종합

| 측면 | Autoformer (2021) | QuantileFormer (2025) | **ProTran (2021)** |
|------|-------------------|--------------------|------------------|
| 출처 | NeurIPS 2021 | IJCAI 2025 | **NeurIPS 2021** |
| 핵심 메커니즘 | Auto-Correlation (FFT) | Pattern-mixture decomp + VAE | **Variational SSM + Attention** |
| Output | Point | Multi-quantile | **Distribution sample (latent)** |
| RNN 사용 | × | × | **× (paper가 강조)** |
| Hierarchy | × | × | **✓ (multi-layer)** |
| 응용 | Forecasting | Forecasting | **Forecasting + Motion** |

→ ProTran 은 같은 NeurIPS 2021 에서 Autoformer 의 정신 (분해/inner block) 과 다른 axis (probabilistic latent) 의 contribution.

---

## 마지막 한 줄

> "RNN 없는 probabilistic 시계열 모델링의 첫 번째 본격 시도. State-space 의 우아함과 Transformer 의 표현력을 모두 가진 generative framework."

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **paper 가 명시한 한계 ($O(T^2)$ complexity) 의 해결 방향과 paper 가 언급한 후속 접근은?**
2. **본 deep dive 가 정리한 5 가지 디자인 원칙 중 NLP 의 BERT 와 정신 동일한 것은?**
3. **NeurIPS 2021 동시기 시계열 paper 4-5개 중 ProTran 의 contribution 축은?**

### 답변

1. **한계**: $O(T^2)$ 의 time + memory — long sequence (language, music) 에 부담. **해결**: Sparse Transformer 변형 — Longformer [9], Sparse Transformer [18], Reformer [50], Informer-style [55]. paper 가 future work 로 명시.
2. **Smoothing > Filtering** 원칙. BERT 의 **bidirectional attention** 이 NLP 의 unidirectional GPT 모델 한계 (filtering 같은 unidirectional) 를 깬 것과 동일 — Eq 10 의 $h_{1:T}$ 에 self-attention 이 시계열 inference 에 bidirectional 도입.
3. **Probabilistic axis** (latent + variational + non-autoregressive). Autoformer = "representation (분해)", Informer = "efficiency (sparse)", TimeGrad = "generation (diffusion)", ProTran = "probabilistic (SSM + latent)". 각 paper 가 다른 contribution 축에서 SOTA.

---

다음 [14_glossary.md](14_glossary.md) 에서 용어집 + References.
