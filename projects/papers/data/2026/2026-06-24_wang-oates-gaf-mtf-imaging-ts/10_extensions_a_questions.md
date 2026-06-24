# 10.A 사고 확장 ① — 자문 질문 5 개

## Q1. GAF 의 격자 위치-의미 (대각선=짧은 lag, 모서리=긴 lag) 가 *attention 의 학습된 위치-의미* 와 *얼마나 정확히* 일치하는가?

**왜 이 질문이 중요한가**:
APF 의 motif typology (diagonal / stripe / block / edge / spike / checker) 가 *학습된 attention 의 분류 체계* 라면, GAF/MTF 의 격자는 *외생적으로 만들어진 격자* 다. 두 격자의 *위치-의미 매핑* 이 정확히 일치한다면 — 즉 *학습된 diagonal motif 가 GASF 의 대각선과 같은 정보* 를 담는다면 — APF 의 motif causality 는 *데이터 격자의 직접 학습* 으로 환원된다 (= TAPPA 의 q-similarity 가설의 강한 형). 일치하지 않는다면 — *학습된 격자가 GAF 와 다른 무언가* 를 담는다면 — *PE 가 데이터 격자를 *왜곡* 해서 새로운 격자를 만든다* 는 더 풍부한 가설이 필요.

이 질문은 *APF 의 핵심 가설을 1 회 실험으로 검증할 수 있는* 환원 — 실험 비용도 적다 (학습된 모델에 GAF 만 계산하면 됨).

---

## Q2. GASF 의 *bijection on $[0, 1]$* 이 시계열의 *invertible representation* 으로서 *normalizing flow* 와 어떻게 비교되는가?

**왜 이 질문이 중요한가**:
2015 년에는 *normalizing flow* (Rezende & Mohamed 2015 의 NF, 2018 Glow, 2019 Flow++) 가 막 시작한 시점. 그런데 본 논문의 GASF 는 *비학습 invertible representation* — *deterministic bijection* + *2D 격자로 들어 올림*. 11 년 후 시각에서 보면, GASF 는 *학습 없는 NF* 의 special case 로 볼 수 있다. *왜 학습 가능한 NF 가 결국 GAF 같은 *deterministic + interpretable* representation 을 *발견하지 못했는가*? 또는 *발견했다면 GAF 와 어떻게 다른가*?

이 질문은 *interpretability vs flexibility* 의 trade-off 를 정량적으로 살펴볼 자리. P1 ProTran-TFA 가 *probabilistic + invertible* 표현을 다루기 시작한다면 GAF 가 *infinite-flexibility flow* 와 *zero-flexibility deterministic* 의 두 극단 중 어느 쪽에 더 가까운지 정해야 한다.

---

## Q3. MTF 의 *single Markov 전이 가정* 이 *비정상 (regime-switching) 시계열* 에서 어떻게 무너지는가? *time-varying MTF* 의 비용·이득은?

**왜 이 질문이 중요한가**:
금융 시계열의 *bull/bear regime*, 산업 센서의 *normal/fault 상태*, climate 의 *El Niño/La Niña* — 모두 *전이 행렬이 시간에 따라 변하는* 시스템이다. 본 논문의 MTF 는 *단일* $W$ 를 전체 시계열에 추정. *time-varying MTF* — 예: sliding window $W_t$, 또는 *latent state* 의 *Hidden Markov MTF* — 는 *비정상성 처리* 의 정량 개선을 가져올 가능성.

이 질문은 *AETHER (crypto, regime-switching) 와 P1 ProTran-TFA (volatility regime) 의 동시 응용 후보*. *non-stationarity-ts* 태그의 *직접 연결*.

---

## Q4. 시계열의 *RGB 컴파운드 이미지 (GASF + GADF + MTF) 가 단일 채널 대비 *실제로* 정보 추가* 하는가? 아니면 단순히 *redundancy* 인가?

**왜 이 질문이 중요한가**:
본 논문은 *compound RGB image* 가 *highly competitive* 라 주장하지만, *각 채널의 marginal contribution* 의 정량 분석 (예: GASF 만 vs GASF+GADF vs GASF+MTF vs all-3) 은 본 환경에서 미확인. 만약 GASF 만으로도 거의 같은 성능이라면 *RGB 컴파운드는 학습기 친화적 hack* 일 뿐이고, MTF 의 *probabilistic 정보 추가* 는 *실제로는 marginal*. 반대로 *MTF 가 결정적 보강* 한다면 *probabilistic vs geometric* 의 *서로 다른 정보축* 이 검증됨.

이 질문은 *APF 의 motif typology 의 정보 redundancy 검증* 과 같은 메커니즘 — 6 종 motif 중 *몇 종이 실제로 독립* 인가의 문제와 동형.

---

## Q5. *frozen ImageNet pretrained CNN* (또는 ViT) 위에 GASF 를 그대로 투입하면 *zero-shot* 시계열 분류가 작동하는가?

**왜 이 질문이 중요한가**:
VisionTS (2024/ICML 2025) 가 *frozen MAE* 로 zero-shot forecasting 을 보여줬다. 그러나 VisionTS 의 *single periodicity reshape* 은 시계열의 *주기성* 에 의존. **GASF 는 주기성 무관 — *모든* 시계열에 적용 가능**. 만약 *frozen ResNet50* 위에 GASF + 단순 linear head 로 zero-shot UCR 분류가 *튜닝 없이* 잘 작동한다면, *시계열 → 이미지 zero-shot* 의 *VisionTS 보다 더 보편적인* alternative.

이 질문은 *VisionTS 의 free-lunch zero-shot 가설* 의 *주기성-불요* 일반화 — 즉 *시계열 → 이미지 + frozen ImageNet* 의 표준 baseline 을 확립.

---

## 5 질문의 공통 substrate

5 질문 모두 *"GAF/MTF 의 *외생적* 결정론적 격자가 *내생적* 학습된 표상 (attention, NF, time-varying transition, RGB compound, frozen pretrained representation) 과 어떻게 관계 맺는가"* 의 변형. APF 의 motif typology 가 *학습된 격자의 *분류* 학* 이라면, 본 질문 5 개는 *학습된 격자와 외생 격자의 *비교* 학*. 두 측면이 만나는 자리가 *시계열 mechanistic interpretability* 의 핵심.
