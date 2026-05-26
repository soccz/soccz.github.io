# 12 Glossary & References — Liu Effective Theory of Grokking

> **🧒 본 챕터는 "용어와 참고문헌의 길잡이"**: Effective theory, phase diagrams, toy model 의 핵심 개념.

## 12.1 챕터 한 줄 요약

> **"Liu et al. 2023 *Effective Theory of Grokking* 의 30+ terminology + 20+ references (effective theory, phase diagrams, grokking, toy models, weight decay)."**

## 12.2 Top-30 핵심 용어

| 용어 | 정의 | 출처 |
|------|------|------|
| Effective theory | macroscopic emergent dynamics | physics |
| Phase diagram | parameter space partition | physics |
| Toy model | simplified analyzable model | NN theory |
| Representation learning | implicit feature discovery | NN |
| Embedding dynamics | embedding vector evolution | NN |
| Goldilocks zone | optimal hyperparameter region | NN |
| Generalizing phase | learning generalizes | Liu 2023 |
| Memorizing phase | overfit only | Liu 2023 |
| Comprehension phase | partial generalization | Liu 2023 |
| Confusion phase | no learning | Liu 2023 |
| Modular addition | (a+b) mod p | math |
| Group theory | abstract algebra | math |
| Cyclic group | Z_p | math |
| Symmetry breaking | spontaneous order | physics |
| Order parameter | macroscopic state variable | physics |
| Critical exponent | scaling behavior | physics |
| Universality class | shared scaling behavior | physics |
| Weight decay critical | threshold for grok | Liu 2023 |
| Learning rate critical | threshold for grok | Liu 2023 |
| Mean field | average behavior | physics |
| Renormalization | scale-dependent analysis | physics |
| Fixed point | dynamical stability | physics |
| Bifurcation | phase transition point | physics |
| Order from disorder | structure emerges from random | physics |
| Spontaneous symmetry | structure breaking symmetry | physics |
| Slingshot | loss landscape motion | Thilak 2022 |
| Lottery ticket | sparse subnet hypothesis | Frankle 2018 |
| Neural Tangent Kernel | linearized NN dynamics | Jacot 2018 |
| Lazy regime | NTK regime | Chizat 2019 |
| Rich regime | feature learning | Chizat 2019 |
| Concept blending | feature combination | Liu 2023 |

## 12.3 References (20+)

```
Liu et al. 2023 — Effective Theory of Grokking (★ 본 paper)
Power et al. 2022 — Grokking
Nanda et al. 2023 — Progress Measures
Thilak et al. 2022 — Slingshot
Frankle & Carbin 2018 — Lottery ticket
Jacot et al. 2018 — Neural Tangent Kernel
Chizat & Bach 2019 — Lazy/rich training
Lyle et al. 2024 — Grokking + plasticity
Roberts et al. 2022 — PDLT (Principles of Deep Learning Theory)
```

## 12.4 자기점검

### 핵심 3 가지

1. **Effective theory 가 *physics 의 ML 적용* 으로 의의?**
2. **4 phases (confusion / memorization / comprehension / generalization) 의 분류 기준?**
3. **Phase diagram 의 *empirical analysis methodology*?**

### 답변

1. **Macroscopic phenomenology framework**. Physics: microscopic atoms 의 macroscopic *phase transition* (water → ice). Liu 적용: microscopic gradient steps 의 macroscopic *learning phase transition*. → *Microscale 의 chaos* 가 *macroscale 의 order* 로 emerge — physics 의 *unifying principle* 의 ML *적용*. *Statistical mechanics 의 ML* 분야.

2. **Train/Val accuracy 의 *2D plane* 의 4 quadrants**. Confusion: Train≈Val≈chance — no learning. Memorize: Train high, Val≈chance — overfit only. Comprehend: Train high, Val partially high — partial transfer. Generalize: Train≈Val≈100% — full grok. *2-axis classification* 의 *natural emergence*.

3. **Hyperparameter sweep + accuracy mapping**. WD × LR × train_fraction 의 *3D parameter space* 를 *grid search*. 각 point 의 *final accuracy* → 4 phases 의 *region mapping*. Heatmap visualization → *phase boundaries* 의 *empirical identification*. *Statistical mechanics 의 ML 적용*.
