# 05-b. 방법론 — w/o LLM (LLM 백본 통째 제거)

## 왜 이 ablation 이 필요한가

LLM-기반 forecaster 의 *전체 시스템 성능* = `adapter + LLM + head` 의 결합으로 보고, LLM 의 *순수* 기여를 측정하려면 *adapter + head* 만으로 같은 forecasting 함수를 구성해 그 성능과 비교해야 한다. 이것이 ablation 의 기본 — 그러나 LLM-for-TS 라인의 기존 논문 중 *LLM 을 통째로 제거한 비교* 를 메인 결과로 내세운 작업은 거의 없다. 본 ablation 은 그 빈자리를 가장 강하게 메우는 형태.

## 구현 — base method 별 차이

w/o LLM 의 *형태* 는 base method 의 아키텍처에 따라 다음과 같이 인스턴스화된다.

### (a) OneFitsAll (OFA / GPT4TS) 에서

OFA 원본은 `Patch tokenization → Linear input projection → Frozen GPT-2 transformer blocks → Linear forecast head` 구조. (GPT-2 의 transformer block 은 일부 (예: LN/positional embedding) 만 unfreeze.)

w/o LLM 형태:
- Frozen GPT-2 transformer blocks 부분을 **identity** (input = output 으로 pass-through) 로 교체.
- 그러나 hidden dim 이 그대로 흘러야 하므로 `d_model` 유지.
- 결과 함수: $\hat{y} = \mathrm{Linear}_{\text{out}}\big( \mathrm{Linear}_{\text{in}}( \mathrm{Patch}(x) ) \big)$ — 즉 patch + 2 linear 만으로 forecasting.

**4줄 해석**:
1. *기호*: $\mathrm{Patch}$ = lookback $L$ 의 시퀀스를 길이 16 patch 로 비중첩 자르기, $\mathrm{Linear}_{\text{in}}$ = $\text{patch\_size}=16 \to d_{\text{model}}=768$ 의 projection, $\mathrm{Linear}_{\text{out}}$ = flatten 후 $d_{\text{model}} \times \text{num\_patches} \to \text{pred\_len}$.
2. *일상 비유*: 시리얼 자르기 (patch) + 색 바꾸기 (in projection) + 도장 찍기 (out projection). 가운데 "마술 상자" (GPT-2) 는 그냥 통과.
3. *왜 이 형태*: OFA 의 *진짜* 학습은 input projection 과 output projection 에서 일어남 (frozen GPT-2 는 가중치 업데이트 없음). w/o LLM 은 GPT-2 가 무엇을 했는지 비교.
4. *조심할 점*: w/o LLM 으로도 같은 성능이 나오는 것은, 사실 GPT-2 가 한 게 거의 없거나, 혹은 GPT-2 가 한 일이 *후속 layer 가 모방 가능한 단순 변환* 임을 시사. 어느 쪽인지는 본 ablation 만으로는 단정 불가.

### (b) Time-LLM 에서

Time-LLM 원본은 `Patch → Reprogramming module (text prompt + cross-attn) → LLaMA frozen blocks → Output projection`. 핵심은 *Reprogramming* 모듈 — 시계열 patch 를 LLM 의 word embedding 공간으로 cross-attention 매핑.

w/o LLM 형태:
- Reprogramming 결과 embedding 을 LLaMA blocks 거치지 않고 곧장 output projection 으로.
- 결과 함수: $\hat{y} = \mathrm{Linear}_{\text{out}}\big( \mathrm{Reprog}( \mathrm{Patch}(x), \text{prompt} ) \big)$.

여기서 흥미로운 관찰: w/o LLM 에서도 *reprogramming 모듈은 보존* — 즉 cross-attention 으로 prompt 와 시계열을 결합하는 작은 모듈이 남음. 만약 이 reprogramming 이 *진짜로 prompt 의 의미를 활용* 한다면 성능 차이가 나타나야. 그러나 결과적으로 *나타나지 않는다* → reprogramming 의 텍스트 부분도 *별 효과 없음* 시사.

### (c) CALF 에서

CALF 원본은 cross-modal alignment (시계열 patch ↔ LM word embedding) + LM backbone + output projection. w/o LLM 은 LM backbone 부분만 제거.

### 공통 패턴

세 base method 모두에서 w/o LLM 의 변환은 *adapter only* 의 functional form 으로 환원된다. 이 환원이 *7 데이터셋 × 4 horizon* 모두에서 성능을 유지 또는 개선시킨다는 게 핵심.

## 대안 ablation (저자가 안 한 것 — 의미 있는 비교)

저자들이 *안 한* 것이지만 더 강한 ablation:

1. **LLM-weighted adapter ablation**: w/o LLM 후 adapter 의 *파라미터 수* 도 base 와 일치시킴. 현재 w/o LLM 의 adapter 파라미터 수는 base 와 같지만, 만약 LLM 백본 자리에 *더 큰 adapter* 를 두면 그 효과를 따로 측정할 수 있음.
2. **Frozen LLM → identity init**: LLM 을 identity-initialized + 학습 가능 으로 두기 (즉 weights = identity 행렬에서 시작). 이게 frozen 과 random-init 의 중간점. 본 논문은 *random-init only* — Frozen 과 random-init 의 *차이* 가 LLM 사전학습 가치를 정량화한다.
3. **Layer-wise w/o**: LLM blocks 중 *일부 층* 만 제거 (예: 마지막 1/2/3 층만 남기기). "LLM 의 어느 층이 필수인가" 를 분해. 본 논문은 *all-or-nothing* — 통째로 제거.

## 핵심 한 문장

> **"w/o LLM 은 LLM 사전학습 가치의 *upper bound = 0* 을 가장 강하게 주장하는 가장 단순한 ablation 이며, 이 단순함 자체가 본 논문의 강력함의 핵심."**
