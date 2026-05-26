# 12 용어집 · 표기법 · References

## 12.1 용어집 (Glossary)

### 핵심 용어

**Attention mechanism** (어텐션 메커니즘)
입력 시퀀스 $x_1, \ldots, x_T$ 에 대해 각 위치에 가중치 $\alpha_i \ge 0$, $\sum_i \alpha_i = 1$ 을 부여하는 모듈. Bahdanau et al. 2014 의 neural MT 에서 도입. paper 의 standard form:
$$\alpha = \mathrm{softmax}(\phi(h, Q)), \quad h_\alpha = \sum_{t=1}^T \alpha_t h_t$$

**Attention as explanation** (어텐션의 설명력)
"Attention weight $\alpha_i$ 가 큰 token $x_i$ 가 prediction 의 *이유*" 라는 implicit 가정. 본 paper 가 시험하는 가설. 두 가지 강한 의미:
- **Faithful explanation**: 모델 internal mechanism 의 정확한 반영.
- **Plausible explanation**: 사람이 보기에 합리적 (Wiegreffe-Pinter 2019 의 후속 반론 영역).

**Feature importance** (특징 중요도)
각 input feature 가 prediction 에 미치는 기여도. paper 가 사용한 두 측정법:
- **Gradient-based**: $g_t = |\sum_{w=1}^{|V|} \mathbb{1}[x_{tw}=1] \cdot \partial \hat{y}/\partial x_{tw}|$ — input 의 미분 norm.
- **Leave-One-Out (LOO)**: $\Delta \hat{y}_t = \mathrm{TVD}(\hat{y}(x_{-t}), \hat{y}(x))$ — token $t$ 제거 시 prediction 변화.

**Counterfactual attention** (반사실 어텐션)
"학습된 $\alpha$ 가 아닌 *다른* $\tilde\alpha$ 로 같은 prediction 이 나오는가?" 의 검증. 두 종류:
- **Permutation**: $\alpha$ 의 entries 를 random 으로 재배치 (Algorithm 2).
- **Adversarial**: $\alpha$ 와 maximally different 한 $\tilde\alpha$ 를 gradient 로 explicit 탐색 (paper §4.2.2).

**Kendall τ** (켄달 타우)
두 ranking 사이의 concordance 측정. $\tau \in [-1, 1]$:
- $\tau = 1$: 완전 일치.
- $\tau = 0$: 무관.
- $\tau = -1$: 완전 반대.
paper 의 H1 (correlation) 검증에 사용 — $\tau_g$ (vs gradient), $\tau_{loo}$ (vs LOO).

**TVD — Total Variation Distance**
두 probability distribution 사이의 거리:
$$\mathrm{TVD}(\hat{y}_1, \hat{y}_2) = \frac{1}{2} \sum_{i=1}^{|Y|} |\hat{y}_{1i} - \hat{y}_{2i}|$$
값 $\in [0, 1]$. paper 가 prediction 변화 측정에 사용.

**JSD — Jensen-Shannon Divergence**
두 distribution 사이의 symmetric KL:
$$\mathrm{JSD}(\alpha_1, \alpha_2) = \frac{1}{2}\mathrm{KL}(\alpha_1 \| M) + \frac{1}{2}\mathrm{KL}(\alpha_2 \| M)$$
where $M = (\alpha_1 + \alpha_2)/2$. paper 가 attention distribution 변화 측정에 사용.

**Faithful** (충실한)
설명이 **모델 internal 작동** 과 일치. paper 의 핵심 검증 목표. Ross et al. 2017 의 정의 채택. Contrast with *plausible* (사람이 보기에 합리).

**BiLSTM** (Bidirectional Long Short-Term Memory)
양방향 LSTM encoder. paper 의 main encoder. Token $t$ 의 hidden state $h_t$ 가 **모든 다른 token 의 영향** 받음 → contextualization 강함 → attention 의 explanation 어려움.

**Average encoder** (평균 인코더)
Linear projection + ReLU. 각 hidden state $h_t$ 가 token $t$ 만의 함수. **Mixing 약함** → attention 의 explanation 자연.

**Adversarial heatmap**
원본 $\alpha$ 와 매우 다른 $\tilde\alpha$ 로 같은 prediction $\hat{y}$ 만드는 attention 분포. paper Figure 1 의 예: "waste" 강조 → "was" 강조 로 바뀌어도 prediction (0.01) 동일.

### 보조 용어

**ICD9** (International Classification of Diseases, 9th)
의료 진단 코드. paper 의 MIMIC-III Diabetes / Anemia dataset 에서 label.

**MIMIC-III** (Medical Information Mart for Intensive Care, version III)
50,000+ ICU 환자의 의료 기록 + 진단 코드 dataset. paper 의 Diabetes, Anemia 사용.

**SNLI** (Stanford Natural Language Inference)
570K English sentence pair, label = entailment / contradiction / neutral.

**bAbI**
Facebook 의 reasoning task — 1 (single supporting fact), 2 (two facts), 3 (three facts chained).

**SST** (Stanford Sentiment Treebank)
10,662 sentences, sentiment 1-5 scale. paper 가 binary (1-2 negative, 4-5 positive) 로 변환.

**ADR** (Adverse Drug Reaction)
약물 부작용 — Twitter dataset 의 binary classification label.

---

## 12.2 표기법 (Notation)

paper §2 의 표기 정리:

| 기호 | 의미 | 차원 |
|------|------|------|
| $x \in \mathbb{R}^{T \times |V|}$ | input — one-hot encoded words | $T \times |V|$ |
| $T$ | sequence length | scalar |
| $|V|$ | vocabulary size | scalar |
| $E$ | embedding matrix | $|V| \times d$ |
| $x_e = xE$ | dense token representation | $T \times d$ |
| $h = \mathrm{Enc}(x_e)$ | encoder hidden states | $T \times m$ |
| $m$ | hidden dim | scalar |
| $Q \in \mathbb{R}^m$ | query (QA: question, NLI: hypothesis) | $m$ |
| $\phi(h, Q)$ | similarity function | $T$ (scores) |
| $\alpha = \mathrm{softmax}(\phi(h, Q))$ | attention | $T$ |
| $h_\alpha = \sum_t \alpha_t h_t$ | weighted representation | $m$ |
| $\hat{y} = \sigma(\theta \cdot h_\alpha)$ | prediction | $|Y|$ |
| $\theta$ | decoder weights | $m \times |Y|$ |
| $|Y|$ | label set size | scalar |

**유사도 함수 (Similarity)**
- **Additive** (Bahdanau): $\phi(h, Q) = v^T \tanh(W_1 h + W_2 Q)$, where $v, W_1, W_2$ learnable.
- **Scaled Dot-Product** (Vaswani): $\phi(h, Q) = hQ/\sqrt{m}$.

**Counterfactual / Adversarial**
- $\tilde\alpha$: counterfactual attention distribution.
- $\alpha^p$: permuted attention (random reshuffling).
- $\hat{y}^p = \mathrm{Dec}(h, \alpha^p)$: prediction with permuted attention (encoder $h$ unchanged!).
- $\Delta \hat{y}^p = \mathrm{TVD}(\hat{y}^p, \hat{y})$: prediction change.

---

## 12.3 References (paper 본문 인용)

### 핵심 인용 — Attention foundation

- **Bahdanau, D., Cho, K., & Bengio, Y. (2014).** "Neural machine translation by jointly learning to align and translate." *arXiv:1409.0473*. — Attention mechanism 발명.
- **Vaswani, A., et al. (2017).** "Attention is all you need." *NeurIPS 2017*. — Transformer + scaled dot-product attention.

### Interpretability 방법

- **Ross, A. S., Hughes, M. C., & Doshi-Velez, F. (2017).** "Right for the right reasons: Training differentiable models by constraining their explanations." *IJCAI 2017*. — Faithful explanation 의 정의.
- **Sundararajan, M., Taly, A., & Yan, Q. (2017).** "Axiomatic attribution for deep networks." *ICML 2017*. — Integrated Gradient.
- **Li, J., Monroe, W., & Jurafsky, D. (2016).** "Understanding neural networks through representation erasure." *arXiv:1612.08220*. — Leave-One-Out method.
- **Lipton, Z. C. (2016).** "The mythos of model interpretability." *arXiv:1606.03490*. — Interpretability 의 모호성 critique.

### Attention as explanation 비판

- **Feng, S., et al. (2018).** "Pathologies of neural models make interpretations difficult." *EMNLP 2018*. — Saliency 의 일반적 한계.
- **Alvarez-Melis, D., & Jaakkola, T. (2017).** "A causal framework for explaining the predictions of black-box sequence-to-sequence models." *EMNLP 2017*. — Causal explanation.

### 후속 반박 / 정제 (paper 발표 후)

- **Wiegreffe, S., & Pinter, Y. (2019).** "Attention is not not Explanation." *EMNLP 2019*. — 본 paper 의 main rebuttal. "*plausible* explanation 으로서는 가치 있음" 주장.
- **Serrano, S., & Smith, N. A. (2019).** "Is attention interpretable?" *ACL 2019*. — Independent confirmation of weak correlation.
- **Brunner, G., et al. (2019).** "On identifiability in transformers." *arXiv:1908.04211*. — Multi-head attention 의 identifiability theory.

### Datasets

- **Socher, R., et al. (2013).** "Recursive deep models for semantic compositionality over a sentiment treebank." *EMNLP 2013*. — SST dataset.
- **Maas, A. L., et al. (2011).** "Learning word vectors for sentiment analysis." *ACL 2011*. — IMDB dataset.
- **Bowman, S. R., et al. (2015).** "A large annotated corpus for learning natural language inference." *EMNLP 2015*. — SNLI dataset.
- **Johnson, A. E., et al. (2016).** "MIMIC-III, a freely accessible critical care database." *Scientific Data*. — MIMIC-III medical dataset.
- **Hermann, K. M., et al. (2015).** "Teaching machines to read and comprehend." *NeurIPS 2015*. — CNN QA dataset.
- **Weston, J., et al. (2015).** "Towards AI-complete question answering: A set of prerequisite toy tasks." *arXiv:1502.05698*. — bAbI dataset.
- **Nikfarjam, A., et al. (2015).** "Pharmacovigilance from social media: mining adverse drug reaction mentions using sequence labeling." *JAMIA*. — ADR Twitter dataset.

### 후속 transformer interpretability

- **Clark, K., et al. (2019).** "What does BERT look at? An analysis of BERT's attention." *BlackboxNLP 2019*.
- **Voita, E., et al. (2019).** "Analyzing multi-head self-attention." *ACL 2019*.
- **Abnar, S., & Zuidema, W. (2020).** "Quantifying attention flow in transformers." *ACL 2020*.

---

## 12.4 약어집

| 약어 | 풀이 |
|------|------|
| ANIE | Attention is Not Explanation (이 paper 의 acronym, 일부 후속 작품에서 사용) |
| NAACL | North American Chapter of the Association for Computational Linguistics |
| BiLSTM | Bidirectional Long Short-Term Memory |
| Bi-RNN | Bidirectional Recurrent Neural Network |
| LSTM | Long Short-Term Memory |
| GRU | Gated Recurrent Unit |
| MLP | Multi-Layer Perceptron |
| ReLU | Rectified Linear Unit |
| NLI | Natural Language Inference |
| QA | Question Answering |
| ICD | International Classification of Diseases |
| TVD | Total Variation Distance |
| JSD | Jensen-Shannon Divergence |
| KL | Kullback-Leibler divergence |
| LOO | Leave-One-Out |
| IG | Integrated Gradient |
| SST | Stanford Sentiment Treebank |
| ADR | Adverse Drug Reaction |
| SNLI | Stanford Natural Language Inference |
| MIMIC | Medical Information Mart for Intensive Care |
| H1 | Hypothesis 1 (correlation test) |
| H2 | Hypothesis 2 (counterfactual test) |

---

## 12.5 자기점검 (이 챕터)

### 핵심 3 가지

1. **TVD 와 JSD 가 같은 분포 거리이면서 다른 곳에 쓰는 이유?**
2. **Kendall τ 가 paper 의 H1 에 적합한 이유?**
3. **"Faithful" vs "Plausible" explanation 의 정확한 구분?**

### 답변

1. **TVD = output 변화 측정** ($\hat{y}_1$ vs $\hat{y}_2$, $L_1$ -based, prediction 의 절대 차이). **JSD = attention 변화 측정** ($\alpha_1$ vs $\alpha_2$, KL-based, 분포의 information-theoretic 거리). 두 metric 의 핵심 사용처 (TVD 가 $\hat{y}$ space, JSD 가 $\alpha$ space) 가 paper 의 결과 표현에 결정적 — Figure 7 의 "high JSD with low TVD" = "attention 매우 다른데 prediction 동일" = 핵심 결과.

2. **Attention 도 importance score 도 "ranking"**. Token 의 *순서* 가 같은가가 핵심 ("어떤 token 이 1등, 2등...?"). 절대값 차이 (Pearson) 보다 ranking concordance 가 의미. Kendall τ 의 추가 장점: tie 처리, non-Gaussian distribution 견고, sample size 안정. paper 가 6 datasets 의 다양한 length 에서 일관 적용 가능.

3. **Faithful**: 설명이 모델 internal mechanism 을 정확히 반영. "이 token 이 진짜 prediction 원인". Ross et al. 2017 의 strong 정의. **Plausible**: 사람이 보기에 그럴듯. "이 token 이 prediction 의 reasonable 이유로 보임". paper 는 *faithful* 의 강한 형태로 explanation 정의 → 그래서 *fail* 하지만, **plausible** 의 의미에서는 가치 있음 (Wiegreffe-Pinter 2019 의 후속 반론 영역).

---

다음 [13_insights.md](13_insights.md) — 메타 통찰 12개.
