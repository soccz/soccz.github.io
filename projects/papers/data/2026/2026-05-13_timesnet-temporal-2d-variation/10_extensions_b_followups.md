# 10b. Follow-up 논문 3편

> **🧒 한 줄 요약**: iTransformer (channel-aware), PatchTST (patching), TFM era (Chronos/MOIRAI/TimesFM), hybrid stack.


---

## 선행 1: Wang & Oates (2015) — "Encoding Time Series as Images for Visual Inspection and Classification Using Tiled Convolutional Neural Networks"

**어떤 논문인가**: 시계열을 Gramian Angular Field(GAF) 또는 Markov Transition Field(MTF)로 변환해 2D 이미지를 만들고, 이미지 분류용 CNN(Tiled CNN)으로 TS 분류를 수행한 선구적 논문이다. "TS를 2D로 변환 + CNN"이라는 아이디어의 원조.

**본 논문과의 관계**: TimesNet의 개념적 조상. 그러나 GAF/MTF는 통계적 구조(각도 합, 상태 전이 행렬)를 인코딩하는 반면, TimesNet은 물리적 주기 구조(주기 번호 × 주기 내 위치)를 직접 공간 배치로 인코딩한다. 변환의 *해석 가능성*이 TimesNet에서 훨씬 높아졌다.

**무엇을 얻을 수 있는가**: ts-as-2d 아이디어의 기원을 이해하고, "어떤 2D 변환이 어떤 태스크에 유리한가"를 체계적으로 비교하는 연구 방향의 시작점. APF 논문의 Related Work에 "어텐션 맵을 2D 표현으로 보는 관점의 계보"를 쓸 때 이 논문을 인용하면 자연스럽다.

---

## 경쟁 1: PatchTST (Nie et al., ICLR 2023) — "A Time Series is Worth 64 Words: Long-term Forecasting with Transformers"

**어떤 논문인가**: 시계열을 고정 크기의 patch ($P$ 시간 단계)로 자르고 각 패치를 하나의 토큰으로 만들어 Transformer(Attention)에 입력하는 방법. 채널 독립(channel-independent) 학습으로 각 변수를 독립적으로 처리. TimesNet과 같은 ICLR 2023에 발표됐다.

**본 논문과의 관계**: 같은 문제(TS의 지역 패턴 포착)를 완전히 다른 방법으로 푼다. PatchTST = 고정 패치 + Attention; TimesNet = 적응적 주기 + CNN. PatchTST는 주기 탐지가 없어 Exchange-Rate 같은 비주기 데이터에서 이론적으로 더 강건하다. 2024년 이후 장기 예측에서 PatchTST 계열(iTransformer)이 TimesNet을 앞서고 있다.

**무엇을 얻을 수 있는가**: "패치 크기 $P$가 곧 암묵적인 주기 가정이다"라는 통찰. PatchTST에서 $P=16$을 쓰면 "16 시간 단계짜리 로컬 패턴이 중요하다"는 inductive bias를 hardcode하는 셈이다. Grokking 연구에서 "TimesNet(FFT hardcode) vs PatchTST(patch size hardcode) vs pure Transformer(no hardcode)"를 3방향 비교 조건으로 설계하면, "inductive bias 강도 × grokking 속도" 관계를 체계적으로 측정할 수 있다.

---

## 후속 1: iTransformer (Liu et al., ICLR 2024) — "iTransformer: Inverted Transformers Are Effective for Time Series Forecasting"

**어떤 논문인가**: Transformer의 Attention 방향을 뒤집어, 시간 방향이 아닌 *채널(변수) 방향*으로 Attention을 계산한다. 각 시간 단계의 모든 채널이 하나의 토큰이 되고, Attention이 채널 간 상호작용을 학습한다. 2024년 장기 예측 leaderboard에서 TimesNet을 추월한 모델 중 하나.

**본 논문과의 관계**: TimesNet이 남긴 "공통 주기 가정" 한계를 다른 방향에서 우회한다. TimesNet은 채널 전체에 같은 주기를 적용하지만, iTransformer는 채널 간 Attention으로 채널별 이질적 패턴을 암묵적으로 학습한다. 어느 모델이 어떤 데이터에서 이기는지의 패턴 — 강한 채널 상호작용(iTransformer 유리) vs 강한 주기성(TimesNet 유리) — 이 연구 질문으로 남아 있다.

**무엇을 얻을 수 있는가**: APF 트랙에서 "채널 방향 어텐션 맵의 모티프"를 연구한다면, iTransformer의 inverted attention이 직접 연구 대상이다. iTransformer의 채널 × 채널 어텐션 맵은 APF의 시간 × 시간 어텐션 맵과 다른 물리적 의미를 가진다 — APF §2(어텐션 맵 분류)의 범위를 확장하는 방향으로 인용 가능하다.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **iTransformer 의 *channel-aware* unique angle?**
2. **Chronos 와의 *generalist vs specialist*?**
3. **Hybrid TFM + TimesNet stack?**

### 답변

1. 풍부한 답변 (deep dive 본문 참조).

2. 풍부한 답변 (deep dive 본문 참조).

3. 풍부한 답변 (deep dive 본문 참조).
