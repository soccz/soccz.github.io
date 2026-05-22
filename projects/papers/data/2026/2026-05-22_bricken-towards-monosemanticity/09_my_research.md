# 8. 내 연구와의 연결

---

## APF (Attention Pattern Fields) — 직접 연결: mech-interp tooling

APF 연구는 PE(위치 인코딩) 설계가 attention pattern motif(diagonal/stripe/block/edge/spike/checker)에 어떤 영향을 미치는지 분석하고, 그 motif의 기능적 역할을 규명하는 것이다. Monosemanticity는 이 연구 체계에서 다음과 같이 직접 연결된다:

### 흡수할 기법 1 — Motif 원인 규명에 SAE 활용

**현재 APF 상태**: TMAO(Temporal Motif Attribution Operation) 방법이 n=12에서 기각됨. 현재 motif causality 실험을 다른 방식으로 진행 중.

**Monosemanticity에서 흡수**: 
- **어느 수식/정리**: SAE 인코더-디코더 구조 + AutoInterp 파이프라인
- **어떻게 내 연구에 쓸지**: APF의 다음 단계 — "어떤 입력 특징이 diagonal motif를 유발하는가?" — 에 SAE를 적용. 구체적으로:
  1. APF 실험에 사용되는 시계열 Transformer의 MLP 또는 attention 레이어에 SAE를 훈련
  2. SAE 특징들 중 "diagonal motif가 강한 토큰"에 높은 활성화를 보이는 특징들을 식별
  3. 그 특징들을 절제(ablation)하여 diagonal motif가 사라지는지 확인
  4. 이것이 APF의 causal intervention 실험이다

**인용 포인트**: APF 논문 §4(Methodology)에서 "In the spirit of Bricken et al. (2023), we apply a sparse autoencoder to identify the input features causally responsible for each attention motif. Unlike Bricken et al. who analyzed MLP activations, we apply SAE to the query-key pre-attention activations to directly probe the geometric origin of motif patterns."

### 흡수할 기법 2 — 4-라인 증거 구조 적용

APF 논문이 "이 motif가 기능적으로 중요하다"를 주장할 때, Monosemanticity의 4-라인 증거 구조(사례 분석 + 인간 평가 + 자동화 검증 + 출력 방향 분석)를 그대로 적용할 수 있다:
- **사례 분석**: diagonal motif가 나타나는 특정 입력 시계열 패턴 심층 분석
- **인간/자동화 평가**: motif가 나타날 때와 나타나지 않을 때의 예측 성능 차이
- **출력 방향 분석**: diagonal motif가 활성화된 head에서 어떤 미래 시점을 강조하는지

### 충돌/경쟁 지점 1 — SAE 고유성 문제 vs. APF 재현성

APF가 PE 조건별로 motif 분포를 측정하는데, 만약 SAE 특징이 고유하지 않다면(Monosemanticity의 한계 3) 실험 재현성이 떨어질 수 있다. 즉 다른 SAE 훈련 결과가 다른 "motif 원인 특징"을 지목할 수 있다.

**해결**: APF에서는 SAE를 단일 모델 인스턴스에 여러 번 훈련시키고 특징들의 일관성(Monosemanticity의 보편성 분석과 유사)을 먼저 확인한 뒤 motif causality 주장을 한다.

---

## Grokking Track — 연결: "학습 후 특징이 결정화되는가?"

### 흡수할 기법 3 — Grokking 단계 전환에서 SAE 특징 추적

**Grokking 연구의 핵심 질문**: Phase transition (memorization → generalization) 전후에 모델 내부 표현이 어떻게 바뀌는가? Nanda et al. (2023)이 modular arithmetic에서 Fourier 특징이 나타난다는 것을 보였다 — 이것이 SAE 없이 수동으로 찾은 결과다.

**Monosemanticity에서 흡수**:
- SAE를 grokking 전후의 모델에 각각 훈련시켜, 발견된 특징 집합이 어떻게 변하는지 추적
- Phase transition 이전(memorization): SAE 특징들이 훈련 샘플별 "개별 사례" 특징에 치우칠 것으로 예측
- Phase transition 이후(generalization): 더 구조적이고 일반화된 특징들(Fourier basis 성분)이 나타날 것으로 예측
- 이 SAE-based feature tracking이 Grokking 논문의 핵심 기여가 될 수 있다

**인용 포인트**: Grokking 논문 §3(Feature Analysis)에서 "We apply the sparse autoencoder framework of Bricken et al. (2023) to the grokked and pre-grokked models to characterize the qualitative change in feature structure across the phase transition. This provides a mechanistic account of what 'generalized features' look like at the representation level."

### 흡수할 기법 4 — AutoInterp 파이프라인 차용

Grokking 연구에서 발견된 특징들이 실제로 "주기 함수 관련 특징"인지 자동화 검증할 때, Monosemanticity의 AutoInterp 파이프라인을 직접 차용 가능. "이 특징의 의미를 설명하라" → "이 설명이 새 데이터에서 예측력을 갖는가?" 검증.

---

## 반면교사 — Monosemanticity가 못한 것을 내가 할 것

### 반면교사 1 — 시계열 도메인 SAE 적용 부재

Monosemanticity는 자연어 모델만 다룬다. 시계열 모델(APF, Grokking 실험의 TS Transformer)에 SAE를 적용하면 어떤 특징이 나오는가? 자연어에서의 "DNA 서열 특징" 대신 "계절성 특징", "추세 특징", "체제 전환 특징" 등이 나올 것으로 예측. 이것은 완전히 새로운 탐색 영역이다.

### 반면교사 2 — Attention 레이어 SAE 부재

Monosemanticity는 MLP 레이어에만 SAE를 적용한다. 하지만 APF 연구는 attention 패턴에 집중한다. Attention head의 QK(쿼리-키) 상호작용에 SAE를 적용하여 "어떤 특징이 diagonal attention을 유발하는가?"를 분석하는 것은 Monosemanticity가 열어 놓았지만 직접 탐구하지 않은 방향이다.

---

## 연결 강도 요약

| 연결 | 강도 | 구체 mechanism |
|------|------|---------------|
| APF + SAE → motif causality | **강함** | SAE 특징 절제 → diagonal/stripe/block motif 소멸 실험 |
| APF 4-라인 증거 구조 | **중간** | Monosemanticity 프로토콜 → APF 주장 강화 |
| Grokking + SAE feature tracking | **강함** | Phase transition 전후 SAE 특징 비교 → 진화 메커니즘 |
| AutoInterp in TS domain | **중간** | 새 도메인에서 자동화 해석가능성 구축 |
