# 4. 방법론 ⑤ — 구현 디테일 & 재현 가능성

> Hyperparameter 가 *극단값* 들로 가득하다. 일반 NLP/CV 의 directrionable 학습과는 매우 다른 setup — 이 distinct ness 자체가 grokking 을 *induce* 하는 데 필요.

## 5.E.1 핵심 hyperparameter 표

| 항목 | 값 | 표준값 대비 |
|---|---|---|
| $p$ (modulus, prime) | 113 | (task-specific) |
| Vocabulary size | $p+1 = 114$ | tiny |
| Sequence length | 3 (a, b, =) | tiny |
| Train fraction $\rho$ | 0.3 | small (실제 학습에 약 3,800 example) |
| Layers | 1 | tiny |
| $d_{\text{model}}$ | 128 | small |
| Attention heads | 4 (head_dim 32) | standard |
| MLP hidden dim | 512 (= 4·d) | standard |
| Activation | ReLU | standard |
| Optimizer | AdamW | standard |
| Learning rate | $10^{-3}$ | standard |
| Weight decay $\lambda$ | **1.0** | **약 100x 표준** |
| Batch size | full batch (~3,800) | unusual (보통 mini-batch) |
| Total steps | $\sim 4 \times 10^4$ | small |
| Initialization | standard (e.g., Xavier) | standard |

**굵게 표시한 weight decay** 가 핵심 — 일반적 fine-tuning 의 0.01 보다 100 배 크다.

## 5.E.2 왜 full-batch 인가

Mini-batch 면 noise 가 들어가 progress measure 의 *단조성* 이 깨질 수 있음. Full-batch + AdamW + weight decay 의 deterministic 학습이 *실험의 깔끔한 phase 분해* 를 가능케 함.

학술적으론 단점 — full-batch 는 SGD 의 *implicit regularization* (large-batch 학습이 sharp minima 에 빠지는 known 효과) 의 일부 효과를 잃음. 본 논문이 *이 효과를 사용하지 않는다는 것* 자체가 결론의 generality 에 미치는 영향.

## 5.E.3 코드 / 재현

저자들은:

- **Colab 노트북** 공개 — 단일 GPU 에서 1~2 시간 내 grokking trajectory 재현.
- **TransformerLens** 라이브러리 (Nanda 본인 작) 와의 호환 — circuit 분석 standard.
- **Github reproduction**: 비공식 repo 다수 (검색 시 nanda + grokking 으로 다수 retrieve).

재현성은 비교적 양호하다고 알려짐. 다만 *progress measure 자체* 의 official implementation 이 깔끔한 라이브러리로 정리됐는지는 (2026-04 시점 본문 차단으로) 확인 못 함.

## 5.E.4 LayerNorm / Bias 처리

- **LayerNorm**: 각 sublayer 전후. 분석할 때는 normalized 모델 (LN free) 로 *fold-in* 후 분석. 또는 LN 의 scale parameter 만 fix 한 ablation.
- **Bias terms**: embedding bias 는 보통 0 으로 fix. 다른 bias 는 학습.

## 5.E.5 측정 freqency & overhead

- Train/Test loss: 매 step 측정 (full batch 라 cheap).
- Restricted/Excluded loss: 매 100 step 정도 (test set 전체에 대해 Fourier 분해 + softmax — 비용은 GPU 1초 정도).
- Gini: 매 step 측정 가능 (weight 만 보면 됨, FFT 한 번).
- 전체 학습 시간: $40k$ step × full-batch ($\sim 3,800$ example) → 단일 RTX 3090 에서 1~2 시간.

## 5.E.6 재현 시 흔한 함정

1. **Weight decay 를 0.01 로 설정** — grokking 자체가 안 나옴. 0.5~2.0 사이로 설정해야 함.
2. **Train fraction 을 0.5 로 설정** — grokking 이 너무 빨리 일어나 phase 분리가 안 됨. 0.2~0.4 가 sweet spot.
3. **Learning rate scheduling** — cosine annealing 같은 schedule 추가 시 cleanup phase 가 학습률 감소와 *얽혀* 분해 어려움. constant LR 권장.
4. **AdamW 가 아닌 Adam** — 일반 Adam 의 L2 reg 는 effective learning rate scaling 과 얽혀 weight decay 효과가 약해짐. AdamW 의 *decoupled* weight decay 가 필수.
5. **Batch size mini-batch** — noise 증가, progress measure 의 단조성 약화.

## 5.E.7 핵심 한 문장 요약

본 논문의 hyperparameter setting 은 *grokking 을 가장 깔끔히 induce 하는 모서리값* — 일반 ML training 의 표준에서 weight decay 가 ~100배, batch size 가 full-batch, train fraction 이 작은 conjunction. 이 *설정의 fragility* 가 본 논문의 한계와 직접 연결 (§7).

---

→ 이제 §5 (방법론) 끝. `06_experiments.md` 로 넘어가 실험 결과를 해부한다.
