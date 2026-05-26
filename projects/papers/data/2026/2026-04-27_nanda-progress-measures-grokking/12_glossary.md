# 12 용어집 · 표기법 · References

> **🧒 이 챕터는 사전**: Nanda et al. 2023 (ICLR) "Progress Measures for Grokking via Mechanistic Interpretability" 의 모든 *기술 용어* + *수학 기호* + *인용 paper* 의 빠른 참조. "Modular arithmetic 이 뭐였더라?", "Fourier circuit 작동 원리?", "Progress measure 종류?" 같은 질문에 즉시 답하는 페이지.

## 12.1 용어집 (Glossary)

### 핵심 용어

**Grokking** (Power et al. 2022)
*Delayed generalization* — 학습 시 *train accuracy 100% 도달 후 추가 학습* 으로 *validation accuracy 가 갑자기 일반화*. *unpredictable transition* 가 기존 가설; **Nanda 2023** 가 *predictable transition* 입증.

**Modular Arithmetic Task**
$a + b \mod p$ (paper 의 main task: $p = 113$).
- Input: $(a, b)$ where $a, b \in [0, p-1]$
- Output: $(a + b) \mod p$
- Total: $p^2 = 12,769$ possible inputs
- Train ratio: 30% (3,830 examples)
- Test: 나머지 70%

**Fourier Basis Circuit** (paper §3)
Nanda 가 발견한 *generalization circuit*. Modular addition 의 학습된 weight 가 *Fourier transform-like* 구조:

$$\cos((a + b) k \cdot \frac{2\pi}{p}) = \cos(a k \frac{2\pi}{p}) \cos(b k \frac{2\pi}{p}) - \sin(a k \frac{2\pi}{p}) \sin(b k \frac{2\pi}{p})$$

→ *Trigonometric identity* 의 *직접 implementation*. 학습된 모델이 *modular arithmetic 의 implicit Fourier transform* 사용.

**Progress Measures** (paper §4)
Grokking 의 *quantitative tracking* 의 3 measure:

1. **Restricted Loss** ($L_{\text{restricted}}$): Fourier basis 의 *주요 frequency* 만 사용했을 때 loss. Generalization circuit 의 emergence 직접 측정.
2. **Gradient Symmetry** ($G_{\text{sym}}$): gradient 의 *symmetric structure* — Fourier circuit 의 emergence 의 *학습 dynamics* 신호.
3. **Trigonometric Loss** ($L_{\text{trig}}$): Fourier basis projection 후 loss.

**4-Phase Training Dynamics** (paper §4)
Grokking 의 *4 단계* 학습:

1. **Phase 1 — Random** (steps 0-1K): random predictions
2. **Phase 2 — Memorization** (1K-30K): train accuracy → 100%, val stays at chance
3. **Phase 3 — Circuit Formation** (30K-100K): generalization circuit 의 *gradual emergence*
4. **Phase 4 — Cleanup** (100K+): memorization circuit 의 *pruning*

→ Progress measures 가 *각 phase 의 transition 시점* 정확히 측정.

**Logit Lens** (nostalgebraist 2020)
Transformer 의 *각 layer hidden state* → unembed → 예측 분포. Nanda 의 *layer-by-layer analysis* 도구.

**Mechanistic Interpretability**
신경망의 *internal computation* 을 *reverse engineering*. Nanda 2023 가 *modular arithmetic Transformer* 의 *Fourier circuit* 의 *exact mechanism* 식별 — mechanistic interp 의 *milestone*.

**Embedding Matrix** ($W_E$)
Token → embedding 의 weights. paper §3 의 *embedding 의 Fourier basis* 발견 — *most singular values* 가 *trigonometric* component.

**Unembedding Matrix** ($W_U$)
Hidden state → logit 의 weights. *읽기* 단계의 Fourier basis 사용.

**Critical Frequencies** ($k \in K$)
Modular addition 의 *주요 Fourier frequency*. paper 에서 ~6 critical frequencies 식별 — 모델의 *주요 학습된 frequency*.

### 보조 용어

**Weight Decay** ($\lambda$)
$L_2$ regularization 강도. **paper §5 의 critical finding**: weight decay 가 *grokking enabler*. WD = 0 → never grok. WD = 1 → too slow.

**Random Seed Sensitivity**
같은 hyperparameter + 다른 seed → *transition step 변화* (예: 30K ~ 100K). 단 *4-phase 패턴* 은 일관.

**Fourier Transform (DFT)**
$F[k] = \sum_n f[n] e^{-2\pi i k n / N}$. Discrete Fourier Transform. paper 의 modular addition circuit 의 *exact mathematical form*.

---

## 12.2 표기법 (Notation)

paper §3 의 표기:

| 기호 | 의미 |
|------|------|
| $p$ | modulus (paper: $p=113$, prime) |
| $a, b$ | input integers $\in [0, p-1]$ |
| $c = (a+b) \mod p$ | target output |
| $W_E \in \mathbb{R}^{p \times d}$ | embedding matrix |
| $W_U \in \mathbb{R}^{d \times p}$ | unembedding matrix |
| $d$ | model dim (paper: $d=128$) |
| $L$ | number of layers (paper: $L=1$) |
| $H$ | number of heads (paper: $H=4$) |
| $K$ | set of critical frequencies (paper: $\|K\| = 6$) |
| $k \in K$ | individual frequency index |

**Trigonometric identity** (paper §3.2):
$$\cos((a+b)k) = \cos(ak)\cos(bk) - \sin(ak)\sin(bk)$$

**Progress measures**:
- $L_{\text{restricted}}(\theta) = L_{\text{xent}}(\hat{y}_K(\theta), y)$ where $\hat{y}_K$ = logit restricted to frequencies in $K$
- $G_{\text{sym}}(\theta) = \sum_k |\nabla_{W[k]} L - \nabla_{W[-k]} L|$ (symmetry measure)

---

## 12.3 References (paper 본문 인용)

### Grokking 시조

- **Power, A., et al. (2022).** "Grokking: Generalization Beyond Overfitting on Small Algorithmic Datasets." *arXiv:2201.02177*. — Grokking 발견 paper.
- **Liu, Z., et al. (2022).** "Towards Understanding Grokking: An Effective Theory of Representation Learning." *NeurIPS 2022*.
- **Liu, Z., et al. (2023).** "Omnigrok: Grokking Beyond Algorithmic Data." — Grokking 일반화.

### Mechanistic Interpretability

- **nostalgebraist (2020).** "Interpreting GPT: the Logit Lens." — Layer-wise analysis.
- **Olsson, C., et al. (2022).** "In-context Learning and Induction Heads." Anthropic. — Induction circuit 발견.
- **Elhage, N., et al. (2021).** "A Mathematical Framework for Transformer Circuits." Anthropic.

### Transformer / Optimization

- **Vaswani, A., et al. (2017).** "Attention is all you need." *NeurIPS 2017*.
- **Loshchilov, I., & Hutter, F. (2019).** "Decoupled Weight Decay Regularization." *ICLR 2019*. — AdamW.

### 후속 paper (Wang 2024 / Chughtai 2024 등)

- **Wang, B., et al. (2024).** "Grokked Transformers are Implicit Reasoners." *ICLR 2024*. — Nanda 의 *practical extension*.
- **Chughtai, B., et al. (2024).** "Understanding Grokking with Activation Patching."
- **Bricken, T., et al. (2023).** "Toward Monosemanticity." Anthropic. — SAE methodology.

---

## 12.4 약어집

| 약어 | 풀이 |
|------|------|
| ICLR | International Conference on Learning Representations |
| DFT | Discrete Fourier Transform |
| WD | Weight Decay |
| SAE | Sparse Autoencoder |
| CKA | Centered Kernel Alignment |
| MLP | Multi-Layer Perceptron |
| FFN | Feed-Forward Network |
| ROME | Rank-One Model Editing |

---

## 12.5 자기점검 (이 챕터)

### 핵심 3 가지

1. **Modular Arithmetic 의 *왜 prime $p=113$* 인가?**
2. **Fourier basis 가 *어떻게 modular addition* 의 *natural representation* 인가?**
3. **3 Progress Measures 중 *가장 critical* 한 것?**

### 답변

1. **Prime $p$ 의 *fully periodic group structure***. $\mathbb{Z}/p\mathbb{Z}$ (mod $p$ integers) 는 *cyclic group of order p*. **Prime**: composite $p$ (예: $p=12$) 면 sub-cyclic group 있어 학습 *trivial shortcut* — modular arithmetic 의 *진정한 generalization* 시험 X. $p=113$ = paper 의 *clean* choice — *finite enough* (학습 가능) + *prime* (subgroup 없음).

2. **Cyclic group 의 *natural representation* = *roots of unity***. $\mathbb{Z}/p\mathbb{Z}$ 의 *characters* = $\{e^{2\pi i k n / p}\}_{k=0}^{p-1}$. 즉 *Fourier basis* 가 *mathematically natural*. **Addition 의 *frequency domain representation***: $f(a+b) = f(a) \cdot f(b)$ when $f(x) = e^{2\pi i k x / p}$. → Convolution becomes multiplication — 학습된 transformer 가 *발견* 한 *암묵적 Fourier transform*.

3. **Restricted Loss** ($L_{\text{restricted}}$). Gradient symmetry 와 trigonometric loss 도 의미 있지만, *Restricted Loss* 가 *most direct generalization metric* — Fourier circuit 의 *주요 frequencies* 만으로 *test accuracy* 측정. *전체 모델 의 noise* 분리 → *pure generalization 추적*. paper 의 Figure 5 의 *core progress measure*.
