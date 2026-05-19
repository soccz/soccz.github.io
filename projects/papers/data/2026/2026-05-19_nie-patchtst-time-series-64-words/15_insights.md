# 15 — 15 메타 통찰

PatchTST 의 표면적 contribution 너머의 깊이.

---

## 1. ViT 의 transfer — "image patch = time patch"

ViT (Dosovitskiy 2021) 의 핵심 idea 가 시계열에 그대로 transfer:
- 이미지 224×224 pixel → 16×16 patch × 196 token
- 시계열 L=336 timestep → P=16 patch × N=42 token

→ 본질적으로 같은 idea. 다른 modality 의 성공이 시계열에도 가능함을 증명.

**시사**: 다른 modality 의 성공 trick (audio MFCC, video tubelet, point cloud voxel) 도 시계열에 시도 가치.

---

## 2. "DLinear 의 도발이 PatchTST 를 낳다"

2022 DLinear paper "Are Transformers Effective for Time Series Forecasting?" 의 도발이 없었으면 PatchTST 도 없었을 가능성.

paper p.1 명시적:
> With our PatchTST model, we not only confirm that Transformer is actually effective for time series forecasting, but also demonstrate the representation capability...

→ "Transformer is actually effective" — 직접 반박. **Critical paper 가 분야를 진보시키는 패턴**.

---

## 3. Simplicity wins — vanilla > complex variants

Informer (ProbSparse), FEDformer (Fourier), Autoformer (auto-correlation) — 모두 vanilla attention 의 복잡한 변형.

PatchTST 는 vanilla attention + 두 단순 trick.

paper Table 3 결과: **PatchTST > 모든 variant 들**.

→ **"Attention is all you need" — 정말 attention 그대로면 충분**. Trick 은 입력에 (patching + channel-indep).

---

## 4. Inductive bias 의 양면

**Channel-mixing 의 가정**:
- 모든 channel 사이의 cross-correlation 학습 필요
- 그러나 spurious correlation 에 overfit 위험

**Channel-indep 의 가정**:
- 각 channel 이 독립 패턴
- Real cross-channel info 학습 못함
- But generalization 좋음

→ **Channel-indep 는 inductive bias 의 거친 형태** — strong assumption 으로 overfitting 방지.

이후 iTransformer (2024) 가 다시 channel-attention 도입 — but 방향을 바꿈 (token = series, not = patch).

---

## 5. Patching = local semantic 보존

paper p.1:
> we enhance the locality and capture comprehensive semantic information that is not available in point-level by aggregating time steps into subseries-level patches.

**핵심 insight**: 단일 timestep 은 의미가 적음. 16 timestep 의 subseries 가 의미 단위.

비유:
- 단어 알파벳 (한 글자) — 의미 없음
- Subword (한 글자 ~ 5 글자) — BERT
- 단어 (5 글자 ~ 10 글자) — 단어 보존 NLP
- 시계열 단일 timestep — 의미 없음
- 시계열 patch (P=16 timestep) — **시계열 word** ← PatchTST

paper 제목 "A Time Series is Worth 64 Words" 의 metaphor 가 정확.

---

## 6. Longer context with same compute

Patching 이 $N$ 을 $L/S = 1/8$ 로 감소 → $O(N^2)$ attention 이 $O((L/S)^2) = O(L^2/64)$.

같은 compute budget 에서:
- 기존: $L = 96$ 처리
- PatchTST: $L = 768$ 처리

**Insight**: Sparse attention 보다 patching 이 더 simple + effective.

→ Sparse attention 도 같은 목적이지만 patching 이 더 robust + interpretable.

---

## 7. Self-supervised 의 의미

paper p.7:
> on large datasets our pre-training procedure contributes a clear improvement compared to supervised training from scratch.

**의미**: Supervised 학습 data 가 충분해도, **pre-train data 의 추가 signal** 이 있음.

이는 LLM/MAE 의 정신과 동일:
- Supervised: label 의 narrow signal
- Self-sup: unlabeled data 의 rich signal (모든 timestep 의 implicit constraint)

→ 시계열에서도 foundation model 의 path 가 열림.

---

## 8. Channel-indep + weight sharing → foundation model 가능

paper p.5:
> This design can allow the pre-training data to contain different number of time series than the downstream data, which may not be feasible by other approaches.

**Implication**:
- Pre-train: Electricity (321 channel)
- Fine-tune: ETTh1 (7 channel)
- **다른 dimension 의 dataset 사이 transfer 가능**

→ 시계열 foundation model 의 fundamental 요구사항. Chronos, TimesFM, Moirai 가 모두 channel-indep + sequence-as-univariate 사용.

---

## 9. Vanilla 의 진가 — Attention 자체가 강하다

Informer/Autoformer/FEDformer/Pyraformer/LogTrans — 모두 attention 의 **variant** 제안 + 시계열 specific bias 주입.

PatchTST 는 그 모든 variant 를 vanilla attention 이 이김.

paper p.8:
> these Transformer-based baselines have not benefited from longer look-back window L, which indicates their ineffectiveness in capturing temporal information.

→ **시계열 특화 attention 변형 들이 실제로 temporal 정보 captured 못함**. Vanilla 가 longer L 에서 정직하게 학습.

---

## 10. Channel-indep 의 universality

Table 15 (Appendix): Informer / Autoformer / FEDformer 에 Channel-indep 만 추가해도 성능 개선.

→ **PatchTST 만의 trick 아님**. 시계열 Transformer 의 general principle.

paper 이후 모든 work 가 channel-indep 옵션 제공 (또는 deliberate channel mixing 정당화 필요).

---

## 11. Patching 의 transferability

paper Section 5:
> Patching is simple but proven to be an effective operator that can be transferred easily to other models.

**예시**: 
- PatchTST + MLP: patching + linear projection 만으로도 강력 (Table 7 의 "P only" 가 Original 보다 좋음)
- PatchTST + SSM (Mamba, S4): 가능성

→ Patching 은 architecture-agnostic operator.

---

## 12. 시계열 forecasting 의 두 학파

| 학파 | 정신 | 대표 모델 |
|------|------|---------|
| **Decomposition-first** | Trend + Seasonality + Residual 분리 | Autoformer, FEDformer, DLinear, TimesNet |
| **Tokenization-first** | 시계열 → token sequence → Transformer | PatchTST, iTransformer, Chronos |

→ PatchTST 가 후자의 시작. 2023-2024 의 흐름은 tokenization-first 가 우세.

---

## 13. Foundation model 의 building block

paper Section 5:
> Our model exhibits the potential to be the based model for future work of Transformer-based forecasting and be a building block for time series foundation models.

이후 발전:
- **Chronos** (Ansari 2024): T5 + tokenization (PatchTST 정신)
- **TimesFM** (Das 2024): Decoder-only Transformer + patching
- **Moirai** (Woo 2024): Multi-resolution masked encoder (PatchTST self-sup 정신)

→ PatchTST = **시계열 foundation model 시대의 catalyst**.

---

## 14. Domain transfer — Forecasting → Quant Finance

PatchTST 의 직접 적용 가능 분야:

| 분야 | Channel | 의미 |
|------|--------|---|
| 주가 forecasting | 종목별 (M = 500+) | univariate prediction per stock |
| Portfolio | 자산별 | risk forecasting |
| 옵션 | strike × maturity | implied volatility surface |
| 채권 | maturity × credit | yield curve forecasting |

→ AI Quant 의 universal forecasting backbone 으로 사용 가능. AlphaPortfolio (Cong 2024) 와 결합 가능.

---

## 15. 한 줄 평가

> "DLinear 의 도전에 vanilla Transformer 가 두 trick (patching + channel-indep) 으로 응답하여, 시계열 deep learning 의 paradigm 을 'specialized attention' 에서 'tokenization-first' 로 전환시켰다. 시계열 foundation model 의 출발점."

---

## 후속 paper 와의 관계

| 후속 | 차별점 |
|------|------|
| **TimesNet** (Wu 2023, ICLR) | Period decomposition, 2D conv on (period, time) — decomposition 학파 |
| **iTransformer** (Liu 2024, ICLR) | Token = series, attention = cross-channel — PatchTST 의 reverse |
| **Chronos** (Ansari 2024) | T5 backbone + tokenization — foundation model |
| **TimesFM** (Das 2024) | Decoder-only — autoregressive foundation |
| **Moirai** (Woo 2024) | Multi-resolution + frequency conditioning — flexible foundation |

→ 모두 PatchTST 의 정신 (patching + channel-indep + self-sup) 의 확장.

다음 [16_code.md](16_code.md) 에서 PyTorch 구현.
