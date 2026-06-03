# 4-A. 방법론 직관 — 전체 아키텍처의 큰 그림

## 배경 사다리

이 절을 이해하려면 ① **마스크드 인코더 (masked encoder)** 가 "BERT 처럼 일부 토큰을 [MASK] 로 가리고 그 자리를 맞히도록 학습된 Transformer encoder", ② **patch-based tokenization** 이 "시점 단위가 아니라 K-시점 묶음 단위를 한 토큰으로 보는 방식 (PatchTST 식)", ③ **RoPE (Rotary Position Embedding)** 가 "쿼리/키 벡터를 시간 위치에 따라 회전시켜 상대 위치 정보를 attention 점수에 자연스럽게 주입하는 PE" — 이 셋만 알면 된다. 셋 다 모르면 본 절을 읽고 다음 분할 파일들 (05_method_b ~ e) 에서 각 component 가 어떻게 동작하는지 단계별로 확인하면 된다.

## 한 그림으로 본 전체 아키텍처 (Figure 2)

논문 Figure 2 는 *3-variate 시계열 (변량 0, 1, 2)* 가 다음 순서로 흐르는 것을 보여준다 (PDF p.4):

```
[Variate 0 raw] → [Multi-Patch-Size Input Projection (patch_size ∈ {8,16,32,64,128})]
[Variate 1 raw] → [Multi-Patch-Size Input Projection]              ↓
[Variate 2 raw] → [Multi-Patch-Size Input Projection]      [Patch Embeddings]
                                                                    ↓
                                              [Add Time ID 0,1,2 / Variate ID 0,0,0 | 1,1,1 | 2,2,2]
                                                                    ↓
                                              [일부 패치 = forecast horizon → [mask] 임베딩으로 대체]
                                                                    ↓
                                       [Transformer (Full Self-Attention + RoPE on time + binary bias on variate)]
                                                                    ↓
                                              [Multi-Patch-Size Output Projection]
                                                                    ↓
                                              [Mixture Distribution Parameters → 4-component p(Y|φ)]
```

세 줄로 요약하면:

1. **입력 (Pre-Transformer)**: 다변량 시계열을 *모든 변량 한 시퀀스로 평탄화* (이게 핵심 발상). Patch 단위로 토큰화하되, *freq 에 맞춘 patch size* 를 사용 (high-freq = big patch). 각 token 에 시간 인덱스 + 변량 인덱스를 메타데이터로 부여.
2. **Transformer 본체**: pre-normalization, RMSNorm, query-key normalization, SwiGLU FFN, bias 제거 — *최신 LLM 의 모범 관행을 그대로 차용한 encoder-only* Transformer. 핵심은 attention 안에 RoPE(시간) + 이진 bias(변량) 가 *공존*.
3. **출력 (Post-Transformer)**: forecast horizon 에 해당하는 위치의 출력 hidden state 를 4-component mixture 분포의 parameter 로 mapping. Patch 크기에 따라 output projection 도 multiple.

## 왜 이 디자인인가 — 큰 그림 차원의 정당화

저자들의 *발상의 흐름* (§3 doors 와 §3.1 architecture 본문에서 추론):

1. **"먼저 마스크드 인코더가 옳다는 가정"** — 저자 자신들의 이전 작업 (Woo et al. 2023, SimMTM 류) 에서 마스크드 reconstruction 이 시계열 사전학습에 강하다는 증거 확보. 그래서 출발점부터 BERT-style encoder 만 사용 (decoder-only Lag-Llama / TimesFM 과의 차별점).
2. **"변량 차원을 별도 축으로 두지 말고 시간과 한 시퀀스로 평탄화"** — iTransformer (2024 ICLR Spotlight, 2026-05-06 ✓ 본 인덱스 covered) 가 *변량을 token 으로* 라는 극단을 제시. MOIRAI 는 그 반대 극단 — *변량과 시간을 모두 평탄화한 후 attention 안에서 두 종류 PE 로 구분*. 한 attention 으로 (time × variate) 의 모든 교차를 다룬다.
3. **"frequency 는 *입출력층* 에서 흡수, Transformer 본체는 freq-agnostic 으로"** — Multi-patch-size projection 만 freq-aware. Transformer encoder 자체는 어떤 frequency 의 시계열이 들어와도 *patch 단위의 universal sequence* 로만 인식. 이 분리가 component 직교성 (Claim 1 의 가정) 의 architectural 근거.
4. **"분포는 *출력층* 에서 mixture 로"** — 단일분포 가정의 limitation 을 head 한 군데로 격리. mixture weights $w_i$ 는 데이터 입력에 따라 *adaptive* 으로 결정 (Eq. 4).

## 무배경 독자용 비유

전체 아키텍처를 **다국적 동시통역사 양성소** 로 비유하자면:

- **Multi-Patch-Size Projection** = *언어별 음절 길이 다른 입력 마이크* — 한국어는 음절 단위, 영어는 단어 단위, 중국어는 글자 단위로 받는 입력단.
- **평탄화 (flatten)** = *여러 화자가 동시에 말하면, 전부 한 줄로 시간순 + 화자별 라벨 붙여서 정리*.
- **RoPE × 이진 bias attention** = 통역사가 *"누가 언제 말했는지"* 를 시간(누가 먼저인지) + 화자(같은 사람인지 다른 사람인지) 두 축으로만 추적.
- **Mixture Distribution Head** = 통역의 *답* 을 단일 정답이 아닌 *"이렇게도, 저렇게도 들릴 수 있다"* 의 확률 가중 mixture 로 출력.

이 비유의 한계: 실제 인간 통역사는 화자의 *개성/억양* 을 (변량별로) 학습하지만, MOIRAI 는 변량의 *의미* 를 모르고 *동일성 여부만* 두 스칼라로 표시한다. 그 추상화의 결과 변량 N 개의 무한 확장이 가능해진다.

## 핵심 한 문장

**MOIRAI 의 architectural genius 는 "시계열 이질성을 *입력층(freq) - attention(변량) - 출력층(분포)* 세 격리된 모듈로 분리해 각각을 universal 화하면서, Transformer body 는 완전히 freq/variate/distribution 무관하게 유지한 것"**. 다음 4개 분할 파일에서 각 모듈이 어떻게 그 universal 성을 확보하는지 단계별 수식과 함께 본다.
