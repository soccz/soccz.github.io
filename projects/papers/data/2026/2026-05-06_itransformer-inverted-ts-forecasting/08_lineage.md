# 08. 이론적 계보

---

## 이론적 조상

### 조상 1 — "Attention Is All You Need" (Vaswani et al., NeurIPS 2017)

iTransformer는 트랜스포머의 기본 컴포넌트(멀티헤드 어텐션, FFN, 잔차 연결, LayerNorm)를 그대로 사용한다. Vaswani 2017이 정의한 블록 구조가 iTransformer의 골격이다. 연결선: 이 논문이 없으면 iTransformer도 없다. 그러나 Vaswani 2017은 "토큰이 무엇이어야 하는가"를 자연어 처리(단어)의 맥락에서만 논의했고, 다변량 시계열에서 "변수가 토큰이 되어야 한다"는 아이디어로 자연스럽게 이어지지 않았다.

### 조상 2 — DLinear / "Are Transformers Effective for TS?" (Zeng et al., AAAI 2023)

역설적으로, 트랜스포머에 도전한 이 논문이 iTransformer를 탄생시켰다. DLinear가 단순 선형 모델로 트랜스포머를 이기자, 연구 커뮤니티는 "트랜스포머 어텐션이 왜 TS에서 실패하는가"를 진지하게 분석하기 시작했다. iTransformer는 그 분석의 결론 중 하나("토큰화 방향이 잘못됐다")를 아키텍처로 구현한 것이다.

### 조상 3 — PatchTST (Nie et al., ICLR 2023)

PatchTST는 "단일 타임스텝 토큰은 정보가 너무 작다 — 패치로 묶어야 한다"는 방향으로 토큰화를 개선했다. iTransformer는 같은 방향에서 더 극단적 결론으로 나아간다: "타임스텝 방향으로 토큰화 자체를 포기하고, 변수 방향으로 간다." 두 논문은 "어떤 단위가 자연스러운 TS 토큰인가"라는 같은 질문에 다른 답을 제시한다.

---

## 평행 연구

### 평행 1 — Crossformer (Zhang & Yan, ICLR 2023)

Crossformer는 시간과 변수 두 축 모두에서 어텐션을 계산하는 "Cross-Dimension" 어텐션을 제안했다. iTransformer가 N×N 어텐션만 사용하는 반면, Crossformer는 T×T와 N×N을 계층적으로 조합한다. 왜 iTransformer가 이겼나: 단순성. Crossformer의 계층 설계가 과적합이나 최적화 어려움을 초래한 반면, iTransformer의 "오직 N×N"은 학습이 안정적이다. 다만 변수 수가 적은 ETT에서는 Crossformer와 비슷하거나 더 낮을 수 있다.

### 평행 2 — TimesNet (Wu et al., ICLR 2023)

같은 thuml 랩의 논문. TimesNet은 1D 시계열을 주기성 기반으로 2D 이미지로 재구성해 CNN을 적용한다. "시계열의 2D 구조"라는 아이디어 공유. 왜 iTransformer가 대규모 데이터에서 이겼나: TimesNet의 2D 변환은 주기 추출을 필요로 하며 비정상 시계열에서 주기가 불명확할 때 실패하기 쉽다. iTransformer는 주기 가정 없이 변수 상관관계를 직접 학습한다.

---

## 후손 예측

### 후손 1 — 희소 변수 어텐션

$N$이 수천 이상일 때 $O(N^2)$ 복잡도는 실용적 한계다. FlashAttention을 N×N에 적용하거나, 변수 클러스터링으로 블록 희소 어텐션을 구성하는 연구가 파생될 것이다. 실제로 "Sparse iTransformer" 계열 논문들이 2024-2025년에 등장하기 시작했다.

### 후손 2 — 해석 가능 iTransformer

N×N 어텐션 맵이 변수 간 상관을 반영한다면, 이를 활용해 Granger 인과관계나 인과 구조를 추출하려는 연구가 가능하다. Sprang 2024(Concept Bottleneck for TS Transformers)와 같은 방향. APF의 motif-to-mechanism 분석을 N×N 어텐션 맵에 적용하는 것이 자연스러운 확장이다.

### 후손 3 — 금융 응용

FT-iTransformer(MDPI 2025)처럼 주가 예측에 iTransformer를 적용한 사례가 이미 나왔다. 변수 수가 적고(예: 10개 주식) 상관이 약한 금융 TS에서의 성능 한계와 개선 방향을 탐구하는 연구가 후속으로 나올 것이다. 특히 P1 ProTran-TFA 맥락에서 "확률적 예측 + 변수 어텐션"의 결합이 연구 가능하다.
