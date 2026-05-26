# 12 Glossary & References — Power 2022 (Grokking)

> **🧒 본 챕터는 "용어와 참고문헌의 길잡이"**: Grokking 의 원조 paper. Modular arithmetic + delayed generalization + memorization-grokking transition 의 핵심 개념.

## 12.1 챕터 한 줄 요약

> **"Power et al. ICLR 2022 *Grokking 의 founding paper* 의 30+ terminology + 20+ references (modular arithmetic, weight decay, OOD generalization, training dynamics)."**

## 12.2 Top-30 핵심 용어

| 용어 | 정의 | 출처 |
|------|------|------|
| Grokking | delayed generalization phenomenon | Power 2022 ★ |
| Modular arithmetic | (a + b) mod p tasks | Power 2022 |
| Algorithmic dataset | composable structured tasks | Power 2022 |
| Memorization phase | train 100%, OOD 0% | Power 2022 |
| Generalization phase | OOD performance jump | Power 2022 |
| Transition | memorize → grok | Power 2022 |
| OOD | Out-of-distribution | classical |
| ID | In-distribution | classical |
| Weight decay | L2 regularization | classical |
| AdamW | weight decay variant | Loshchilov 2019 |
| Training step | gradient update unit | NN |
| Plateau | flat loss region | NN |
| Phase transition | rapid behavior change | physics |
| Modular addition | (a+b) mod p | math |
| Modular subtraction | (a-b) mod p | math |
| Modular multiplication | (a*b) mod p | math |
| Modular division | a * b^{-1} mod p | math (p prime) |
| Group operation | abstract algebra | math |
| Cyclic group | Z_p (integers mod p) | math |
| Transformer | self-attention architecture | Vaswani 2017 |
| Token embedding | digit → R^d | NN |
| Position embedding | position → R^d | NN |
| Decoder-only | GPT-style | Radford 2018 |
| Cross-entropy loss | classification loss | NN |
| Dropout | random masking | Srivastava 2014 |
| Batch norm | per-batch normalization | Ioffe 2015 |
| Train accuracy | training set performance | NN |
| Val accuracy | validation set performance | NN |
| Hyperparameter | non-trained config | NN |
| Generalization gap | train - val accuracy | NN |
| Implicit regularization | architecture/algorithm induced | NN theory |

## 12.3 References (20+)

```
Power et al. ICLR 2022 — Grokking (★ 본 paper)
Nanda et al. 2023 — Progress Measures (mech interp)
Wang et al. 2024 — Grokked Transformers as Reasoners
Lyle et al. 2024 — Grokking under non-stationarity
Liu et al. 2023 — Omni grokking
Thilak et al. 2022 — Slingshot mechanism
Vaswani et al. 2017 — Transformer
Loshchilov & Hutter 2019 — AdamW
```

## 12.4 자기점검

### 핵심 3 가지

1. **Modular arithmetic task 가 *grokking 실험 platform* 으로 적합한 이유?**
2. **Weight decay 의 *grokking 유발 메커니즘*?**
3. **Grokking 의 *delayed generalization* 의 phase 구조?**

### 답변

1. **Compositional + finite + decomposable**. p=97 prime modular addition = (a + b) mod 97. *Finite vocabulary* (0-96 의 97 tokens), *compositional* (a, b → answer), *exact correctness* (수학적 ground truth). → Synthetic toy + structured = *controlled experiment platform*. *Memorization vs generalization 의 clean separable*.

2. **Implicit Occam's razor**. Weight decay = L2 penalty → *small magnitude weights preferred*. Random init 의 *high-magnitude noise* → memorization (lookup table 같은 weight pattern). Weight decay 가 *consistent small-magnitude pattern* 강요 → *circuit-like structured weights* (e.g., Fourier features). → *Generalizable circuit* 가 *minimum-norm solution*. *Implicit prior* 이 generalization 유도.

3. **3-phase trajectory**. Phase 1 (steps 0-100): random predictions (train ≈ val ≈ chance). Phase 2 (100-1M): memorization (train ↑ to 100%, val plateau ≈ chance). Phase 3 (1M-5M): *grokking transition* (val jumps from chance to 100%). → *Delayed generalization 의 signature*: train 100% 도달 후에도 *지속 학습* → 갑자기 *circuit emerge*. *Surprising empirical finding*.
