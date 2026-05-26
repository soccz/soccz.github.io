# 05-A 방법론 — 전체 흐름의 큰 그림

> **🧒 방법론 한 줄 요약**: 두 가지 시험. **시험 1 (H1)**: attention 이 가리키는 단어와 *다른 방법으로 잰* 중요 단어가 *비슷한가*? **시험 2 (H2)**: attention 을 *바꾸면* 답이 *바뀌는가*? 둘 다 통과해야 attention 이 *진짜 설명* 으로 인정. 본 paper 는 둘 다 *대부분 실패* 함을 보임. 본 챕터는 그 두 시험의 *큰 그림 pipeline*.

> **배경 사다리**: 이 절은 ① 신경망이 입력 $x$ 에서 출력 $\hat{y}$ 를 만드는 *중간 단계* 에 hidden state $h_i$ 가 있고, attention 이 그 $h_i$ 들을 *어떻게 섞을지* 결정한다는 사실, ② "*상관* 측정 (correlation)" 과 "*반사실 측정* (counterfactual)" 이 인과 검증에서 서로 다른 도구라는 점만 알면 된다.

## 한 그림으로 보는 파이프라인

```
입력 시퀀스
     x_1, x_2, ..., x_T
       │
       ▼
   Embedding
       │
       ▼
   Encoder (BiLSTM / CNN / Average)
       │
       ▼
   hidden states  h_1, ..., h_T
       │
       ├──── attention scoring (tanh additive / scaled dot)
       │              │
       │              ▼
       │      attention weights α_1, ..., α_T   (∑ α_i = 1)
       │              │
       │              ▼
       │     context c = Σ α_i · h_i
       │              │
       ▼              ▼
       └──── concatenate / project → 출력 ŷ
```

이 파이프라인의 *어디를* 건드려서 "attention 이 설명인가" 를 시험할 수 있는가가 본 논문의 설계 핵심이다. 두 갈래로 나눈다.

### 갈래 A — *관찰 기반* (H1): attention vs 다른 importance 척도

학습 *완료된* 모델을 그대로 두고, 같은 입력에 대해
- (1) attention $\boldsymbol{\alpha} = (\alpha_1, \dots, \alpha_T)$ 그리고
- (2) gradient 기반 importance $g_i = |\partial \hat{y} / \partial e_i|$ (여기서 $e_i$ 는 embedding) 또는 LOO importance $\ell_i = \|\hat{y} - \hat{y}_{(-i)}\|_1$ (단어 $i$ 만 제거하고 다시 forward)

를 각각 계산. 두 *순위* 사이의 Kendall $\tau$ (또는 Spearman ρ) 를 instance 별로 모아 분포를 본다.

**왜 이 형태인가**: 만약 attention 이 "어느 단어가 출력에 중요한가" 를 진짜 가리킨다면 *다른 방식으로* 잰 importance 와 *대체로* 일치해야 한다. 일치하지 않으면 attention 의 "중요도" 는 *어떤 의미인지* 의문.

### 갈래 B — *개입 기반* (H2): attention 을 *바꾸면* 출력이 *얼마나* 바뀌나

학습 완료된 모델의 attention 값을 *외부에서 강제* — 즉 $\boldsymbol{\alpha} \to \boldsymbol{\alpha}^*$ 로 바꿔서 추론. 두 sub-test:

- **(B1) 순열 (permutation)**: $\boldsymbol{\alpha}^\pi = \text{permute}(\boldsymbol{\alpha})$. 무작위 순열한 분포로 forward → 출력 차이 $\Delta \hat{y}$ 측정. 다중 순열을 모아 median 분포로 보고.
- **(B2) 적대적 (adversarial)**: paper §4.2.2 — gradient ascent 로 다음 제약 최적화:
  $$\max_{\boldsymbol{\alpha}_{\text{adv}} \in \Delta^{T-1}} \; \text{JSD}(\boldsymbol{\alpha}, \boldsymbol{\alpha}_{\text{adv}}) \quad \text{s.t.} \quad \text{TVD}(\hat{y}(\boldsymbol{\alpha}), \hat{y}(\boldsymbol{\alpha}_{\text{adv}})) < \epsilon$$
  paper 의 ε = 0.10 (binary classification), 0.05 (QA). PyTorch 구현은 [14_code.md](14_code.md) §14.5 의 soft Lagrangian.
  
  - $\Delta^{T-1}$: $T$-차원 simplex (확률 분포 공간).
  - $\text{JSD}$: Jensen-Shannon divergence.
  - $\text{TVD}$: total variation distance.

**왜 둘 다 필요한가**:
- 순열은 "*무작위* 대안" 이라 *약한* 검증. 통과해도 모델이 강건한 정도만 보임.
- Adversarial 은 "*최악* 대안" 이라 *강한* 검증. 통과하면 *어떤 의미에서도* attention 이 유일한 분포가 아님이 보장.

두 갈래의 결과를 **데이터셋 × 인코더 × attention 종류** 의 격자로 sweep — 발견이 *특정 조건* 의 우연이 아닌 *구조적 현상* 임을 검증.

## 본 논문이 *하지 않는 것* (오해 방지)

- Transformer 의 multi-head·multi-layer attention 에 대한 직접 검증 — *하지 않음*. 단일 attention layer (BiLSTM/CNN/avg 위) 만 검증. 자주 인용되며 "transformer attention 도 설명이 아니다" 라고 *확장 해석* 되는데 이는 *본 논문의 주장 너머*. (이 점은 본 논문이 발표된 2019년 2월 시점에 BERT/Transformer attention 비판이 막 시작되던 흐름과 분리해서 봐야 한다.)
- *어떤 attention 도 설명일 수 없다* 라고 주장하지 않음. *현재 표준 사용 방식이* 설명이라는 *기본 가정이 정당화되지 않았다* 는 *부정* 명제.
- *대안 설명 방법* 을 제시하지 않음. "attention 대신 LIME 을 써라" 같은 *처방* 없음. 본 논문은 *진단* 에 집중.

## 핵심 한 문장

> Attention 의 "설명력" 을 *상관 검증* + *개입 검증* 의 두 축으로 *명시적으로* 시험하는 protocol 을 도입했고, BiLSTM 류의 강한 contextualization encoder 에서 두 검증 모두 *대부분 실패* 한다는 격자 실험 결과를 제시.

---

## 인터랙티브 — Encoder 비교

```viz:anie-encoder-comparison:title=Encoder Mixing Continuum — BiLSTM vs CNN vs Average,caption=Highlight 셀렉터로 BiLSTM (high mixing) / CNN (mid) / Average (none) 의 τ_g 비교. 9 dataset 에서 *BiLSTM 의 mixing 이 attention 의 explanation 능력 가장 파괴*. CNN 은 중간 (local mixing 만), Average 가 가장 attention-friendly. paper 의 핵심 mechanism — "encoder mixing strength continuum".
```
