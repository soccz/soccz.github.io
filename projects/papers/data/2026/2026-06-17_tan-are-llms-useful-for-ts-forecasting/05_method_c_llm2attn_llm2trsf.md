# 05-c. 방법론 — LLM2Attn & LLM2Trsf (무작위 초기화 교체)

## 왜 *교체* 가 *제거* 보다 더 강한 메시지인가

w/o LLM 의 한계: "LLM 을 빼면 hidden 차원의 *흐름* 자체가 사라지니, 변환 능력이 줄어든다" 는 반박 가능. 즉 "LLM 이 무용한 게 아니라, LLM 없이는 입력이 잘 흘러갈 수 없어 다른 데서 변환을 떠안은 것" 이라는 해석.

LLM2Attn / LLM2Trsf 는 이 반박을 차단한다: **백본 자리에 *같은 hidden dim 의* 작은 모듈 (1-layer attention 또는 1-block transformer) 을 무작위로 초기화해서 학습 가능하게 둠**. 즉:

- 모델의 변환 capacity 가 비슷한 위계로 유지됨.
- 그러나 사전학습 가중치 (LLM 의 자랑인 부분) 만 *완전히 제거*.
- 만약 결과가 비슷하다면 → "LLM 의 가치 = 사전학습이 아니라 단순히 변환 layer 가 한 층 있는 것".

이건 mech interp 의 **"path patching with random replacement"** (Wang IOI Circuit 2023) 의 architecture-level 적용. IOI 에서 attention head 자리에 random head 를 끼워 *그 head 의 정보* 를 격리하듯, 여기서는 LLM 자리에 random Attn/Trsf 를 끼워 *LLM 의 사전학습 정보* 를 격리.

## LLM2Attn — 구현

LLM 백본 위치에 **단일 multi-head self-attention layer** 를 무작위 초기화로 삽입:

$$
h' = \mathrm{Softmax}\!\left(\frac{Q K^\top}{\sqrt{d_h}}\right) V
$$

where $Q = h W_Q$, $K = h W_K$, $V = h W_V$, $W_{Q,K,V} \in \mathbb{R}^{d_{\text{model}} \times d_{\text{model}}}$ 모두 *무작위 초기화* (예: Xavier).

**4줄 해석**:
1. *기호*: $h$ = 입력 patch embedding (shape `(batch, num_patches, d_model)`), $Q/K/V$ = query/key/value projection, $d_h = d_{\text{model}} / n_{\text{heads}}$ (예: 768/16=48).
2. *일상 비유*: 도서관에서 "이 페이지가 어떤 다른 페이지와 비슷한가?" 를 검색하는 매트릭스 검색. LLM 은 이 검색을 1억 권 책으로 사전학습한 셈인데, LLM2Attn 은 *책 1권으로 처음부터 검색법 익히는 것*.
3. *왜 이 형태*: PatchTST 가 이미 입증한 "patch + attention" 의 핵심 구성을 *최소 단위* 로 가져옴. 1 layer 면 충분한지 검증.
4. *조심할 점*: 1-layer attention 은 *intra-sequence* 만 봄 (다층 stack 없으므로 hierarchical feature 추출 불가). 그래도 잘하는 것은, *patch 간 직접 비교* 자체가 시계열에 강한 inductive bias 임을 시사.

## LLM2Trsf — 구현

LLM2Attn 에 **FFN (feedforward network)** 한 층을 더 붙임. 즉 standard transformer encoder block 1개:

$$
h_1 = \mathrm{LN}(h + \mathrm{Attn}(h)), \quad h' = \mathrm{LN}(h_1 + \mathrm{FFN}(h_1))
$$

where $\mathrm{FFN}(x) = W_2 \, \sigma(W_1 x + b_1) + b_2$, $W_1 \in \mathbb{R}^{d_{\text{model}} \times d_{\text{ff}}}$ ($d_{\text{ff}}=512$ 디폴트).

**4줄 해석**:
1. *기호*: $\mathrm{LN}$ = LayerNorm, $\sigma$ = activation (보통 GELU), $h_1$ = residual + attention 의 중간 표현.
2. *일상 비유*: 책 검색 (attention) 한 다음에 정리 정돈 (FFN) 한 번 하는 사서. LLM 은 1 천명 사서를 1억 페이지 책으로 훈련시킨 셈이지만, LLM2Trsf 는 *사서 1 명에 책 1 권*.
3. *왜 이 형태*: standard transformer block 의 *최소* 형태. attention 만 (LLM2Attn) 보다 FFN 한 층 더 있어 nonlinear capacity 가 늘어남.
4. *조심할 점*: 1-block transformer 가 LLM 의 N 층 stack 보다 더 *flat* 한 함수 클래스. 그럼에도 forecast 가 동등하면 → "시계열 forecast 의 함수 복잡도 자체가 transformer block 1개로 표현 가능한 수준" 이라는 결론. 이게 더 큰 함의.

## 두 변형의 *비교* 가 주는 추가 정보

- LLM2Attn (attention only) vs LLM2Trsf (attention + FFN) 의 *작은 차이* 는 FFN 의 nonlinear capacity 가 시계열 forecast 에 얼마나 기여하는지를 isolate.
- 본 환경 미확인이지만, README + WebSearch 인덱스 톤으로 보면 두 변형 모두 *original LLM 과 동등 또는 더 좋음* — 즉 FFN 의 추가 가치도 작음. → 시계열 forecast 는 *주로 attention 의 patch 간 매칭* 으로 충분.

## 무작위 초기화의 통계적 디테일 (저자가 *반드시* 통제해야 하는 것)

이 ablation 의 신뢰성을 위해 본문은 다음을 통제해야 (Source Lock 미확인이지만 standard practice):

1. **Seed 다양화**: 같은 random-init seed 만 쓰면 *그 seed* 의 운으로 잘 나올 수 있음. 여러 seed (예: 3~5 개) 평균 보고.
2. **Init scale**: Xavier vs Kaiming vs scaled Xavier 등 init 스킴이 결과에 영향. 보통 PyTorch 디폴트.
3. **Optimizer/warmup**: random-init 모듈은 frozen LLM 과 학습 dynamic 이 다르므로 *fair learning rate / warmup* 가 필요. 본 논문은 base method 의 원본 hyperparameter 를 그대로 쓴다고 가정 (그러면 이 부분은 보수적 / fair).

## 대안 ablation — 저자가 안 한 더 강한 변형

1. **LLM2BIGAttn**: LLM 자리에 *더 큰* (예: 4 layer × 8 head) random-init transformer 를 두는 ablation. 만약 *작은 1 layer 보다 더 큰 random-init 이 더 좋다면* → 백본의 가치 = "더 큰 함수 클래스" 라는 결론. 만약 *같다면* → "이미 capacity saturate" 결론. 본 논문은 이 비교 없음.
2. **LLM2PretrainedTrsf**: LLM 자리에 *시계열로 사전학습된 작은 transformer* (예: PatchTST pretrain checkpoint) 삽입. 만약 이게 LLM 보다 좋다면 → "사전학습은 도움되지만 *시계열 사전학습이 도움됨*" 결론. Chronos / MOIRAI 의 논리적 정당화. 본 논문은 *LLM-vs-no-pretrain* 만 비교.
3. **LLM2RandomMLP**: attention 도 빼고 *random-init MLP only* 변형. 만약 이게 *LLM2Attn 보다 나쁘다* 면 → "attention 자체는 essential" 결론. 본 논문은 PAttn 의 양성 결과로 부분적으로 응답.

## 핵심 한 문장

> **"LLM2Attn 과 LLM2Trsf 는 'LLM 의 사전학습 가치' 와 '백본의 단순 변환 capacity' 를 인과적으로 분리하는 ablation 으로, *변환 capacity 만 동등하게 유지한 채 사전학습만 0 으로* 두는 가장 깨끗한 비교."**
