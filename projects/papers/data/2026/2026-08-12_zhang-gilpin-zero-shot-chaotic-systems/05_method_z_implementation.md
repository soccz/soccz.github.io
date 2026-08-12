# 4-Z. 구현 디테일 — 베이스라인 하이퍼파라미터, 계산량, 그리고 파인튜닝 실패

> **배경 사다리**: 이 절은 "재현하려면 무엇을 알아야 하는가"와 "저자가 시도했다가 안 된 것은 무엇인가"를 모은다. 후자가 이 논문에서 가장 값진 부록일 수 있다.

---

## Z.1 베이스라인 하이퍼파라미터 (Appendix F.1, 전부 verbatim)

공통 규칙: **모든 모델이 lookback 계열 하이퍼파라미터 하나만** $\{0.067, 0.167, 0.333, 0.5, 0.833, 1\}$ Lyapunov 시간 중에서 계별로 튜닝된다. 나머지는 아래 고정값이며, 대부분 Darts 예측 라이브러리(Herzen et al., 2022)의 참조 구현·기본값을 따른다.

| 모델 | 고정 하이퍼파라미터 (Appendix F.1 verbatim) |
|---|---|
| **N-BEATS** (Oreshkin 2019) | Number of Stacks 30 · Blocks 1 · Layers 4 · Layer Widths 256 · Expansion Coefficient Dimension 5 · Degree of Trend Polynomial 2 · Dropout 0.0 · ReLU |
| **Transformer** (Vaswani 2017) | Attention Heads 4 · Encoder Layers 3 · Decoder Layers 3 · Dimension Feedforward 512 · Dropout 0.1 · ReLU (본문 §4 에서 "a small encoder-decoder Transformer with 0.5M trainable parameters" 로 명시) |
| **TiDE** (Das 2023) | Encoder Layers 1 · Decoder Layers 1 · Decoder Output Dim 16 · Hidden Dim 128 · Past/Future Temporal Width 4/4 · Past/Future Temporal Hidden None/None · Temporal Decoder Hidden 32 · Dropout 0.1 |
| **NVAR** (Gauthier 2021) | Maximum Order 2 · Regularization $10^{-4}$ · Stride 1.0 (원 논문 기본 설정 사용) |
| **LSTM** (Hochreiter 1997) | Hidden Dimensionality 25 · Recurrent Layers 2 · Dropout 0.0 · Training Length 24 |

**읽는 법.** 이 표에서 눈에 띄는 비대칭이 하나 있다. NBEATS 는 stack 30 · width 256 으로 상당히 큰데 LSTM 은 hidden 25 · 2층으로 매우 작다. 즉 "LSTM 이 졌다"는 결과는 **이 크기의 LSTM 이 졌다**는 뜻이며, 순환 구조 일반에 대한 판정으로 확대 해석하면 안 된다. 저자들도 하이퍼파라미터 선택 근거를 선행 연구 답습으로 밝힌다 verbatim: "Our baseline models follow the experiment design and hyperparameter tuning procedure used in prior works on the chaotic systems dataset (Gilpin, 2021; 2023)."

## Z.2 Chronos 쪽 설정

- 평가 대상 5종 (§3 verbatim): "We evaluate five pre-trained variants of Chronos, denoted by the sizes of the underlying T5 architecture: $8M$, $20M$, $46M$, $200M$, and $710M$ parameters." Figure 4 캡션의 이름 대응 verbatim: "tiny (8M parameters), mini (20M ), small (46M ), base (200M ), and large (710M )".
- 문맥 길이 (§5.5 verbatim): "We vary the context length of the base Chronos model between 5 and its maximum value of 512".
- 튜닝 없음 (§4 verbatim): "It is also analogous to the context window in Chronos, for which we tune no other hyperparameters in the zero-shot setting."
- 다변량 처리 (§3 verbatim): "Because Chronos is a univariate forecast model, we separately forecast each coordinate of the attractor and **reset the model state between each forecast**." — 채널 간 정보 누수를 차단한 설계.

## Z.3 계산량

- 전체 실험 (§4 verbatim): "$5.5 \times 10^7$ training points, $3.2 \times 10^7$ test points, and $3.2 \times 10^8$ generated forecasts across all models. The experiments require $10^4$ walltime compute hours on an Nvidia A100 GPU."
- 비용 비교 (§5.5, Figure 6C 캡션 verbatim): "The single-node walltime for zero-shot forecasts (Chronos-base), compared to the training and inference costs of NBEATS (including hyperparameter tuning). All curves show medians and standard errors over 20 different initial conditions from each of 135 dynamical systems."
- 결론 verbatim: "We find that the computational cost of Chronos can be favorable at long context lengths when compared to NBEATS (Fig. 6C)."
- **저자의 자기 유보 (각주 1, verbatim)**: "Walltime imperfectly measures computational costs, as different models are specialized for different hardware (e.g. paralleization or GPU acceleration). Nonetheless, walltime within a given model class provides a proxy for a model's practical performance." — 자기 유리한 지표에 스스로 별표를 단 대목.
- 어텐션 비용의 한계 명시 verbatim: "The inference time of Chronos is bounded by the quadratic scaling of attention layers with the context length. This limitation motivates newer architectures like Mamba (for language) and TiDE (for time series), which exhibit linear scaling."

> **수치 투명성**: Figure 6C 의 절대 walltime 값(초·시간)은 그림 축에만 있고 본문에 없다 → **원문에 수치 미보고**.

## Z.4 실패한 시도 — Chronos 파인튜닝 (Appendix F.2)

이 부록은 논문의 결론을 강화하지도, 방법을 설명하지도 않는다. 순수하게 "해봤는데 안 됐다"는 기록이며, 그래서 재현자에게 가장 유용하다.

**설정** verbatim: "we compiled a collection of $1.3 \times 10^6$ observations, corresponding to trajectories of length 512 timepoints originating from 20 initial conditions for each of 135 chaotic dynamical systems. We fine-tuned Chronos-base using the authors' original training scripts, with all hyperparameters matching those used in the original Chronos training run".

**결과** verbatim: "we did not observe a strong improvement in Chronos's validation scores on held-out trajectories. Instead, the loss plateaued early during training, and the qualitative appearance of forecasts did not improve over the zero-shot case. When we instead tried only fine-tuning on a single system, the Lorenz attractor, we observed similar results. Moreover, we observe a weak reduction in forecast accuracy on datasets randomly drawn from Chronos's training corpus."

**저자의 진단** verbatim: "we conclude that the training behavior of Chronos is decoupled from properties of the underlying datasets in the training regime we reach in our fine-tuning experiments. We thus conjecture that the chaotic systems time series dataset strongly differs from the large time series corpus on which Chronos was originally trained, leading to fine-tuning failing due to strong task shift Kumar et al. (2022). This phenomenon represents a variant of out-of-distribution generalization error, manifesting as slow convergence on new datasets."

**필요 규모 추정** verbatim: "We therefore expect that fine-tuning Chronos for chaotic systems will require full retraining on a dataset comparable in size to the Chronos training corpus ($10^{10} - 10^{11}$ observations), as well as potential customizations of the tokenizer and language model to better handle dynamical systems datasets." 본문 §6 에도 같은 취지 verbatim: "In initial experiments, we found that at least two orders of magnitude more data were required to stably update the weights and validation scores of Chronos. However, this came at the expense of worse performance on the original Chronos training dataset".

**이게 왜 중요한가.** 세 가지를 한꺼번에 말해 준다.
1. **제로샷 성능이 "튜닝 안 해서 낮은 하한"이 아니다.** 파인튜닝으로 쉽게 올라갈 수 있었다면 이 논문의 비교는 불공정했을 것이다. 안 올라간다는 사실이 오히려 제로샷 결과를 정당화한다.
2. **파인튜닝 실패가 카오스 데이터의 분포적 이질성을 역으로 증명한다** — 즉 "오염되지 않은 테스트셋"이라는 이 논문의 대전제에 대한 독립적 증거다.
3. **망각(catastrophic forgetting)의 그림자**: 원 코퍼스 성능이 약간 나빠졌다는 관찰은 continual learning 문헌(이 레포 2026-08-07 Dohare et al. 커버)과 곧장 이어진다.

**저자의 후속 제안** verbatim: "alternative strategies such as low-rank adaptation Hu et al. (2021), and its generalizations for time series forecasting Gupta et al. (2024), may be applied in future work."

---

## 이 절의 핵심 한 문장

**재현에 필요한 상수는 전부 부록에 있고, 재현할 필요가 없는 것 — 파인튜닝 — 도 실패 기록으로 남아 있다. 그 실패가 이 논문의 대전제(카오스 = 분포 밖 데이터)를 뒷받침하는 두 번째 증거라는 점이 이 부록의 숨은 값어치다.**
