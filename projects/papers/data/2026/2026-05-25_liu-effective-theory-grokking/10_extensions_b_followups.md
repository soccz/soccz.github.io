# 9b. 사고 확장 — Follow-up 논문 3편

> **🧒 한 줄 요약**: Roberts PDLT, Tegmark physics-ML, thermodynamic ML, mech interp 결합.


---

## 선행: Omnigrok — Liu, Michaud, Tegmark (2023)

**arXiv:2210.01117** / ICLR 2023

**어떤 논문인가**: 같은 저자 그룹(MIT Tegmark lab)의 후속 작업. "Grokking은 알고리즘적 과제에만 발생하는가?"라는 질문에, MNIST 이미지, 분자 구조(QM9), IMDb 텍스트 분류에서도 초기화 스케일($\alpha$)을 조절하면 grokking을 유도할 수 있음을 보여줌.

**본 논문과의 관계**: Liu (2022)의 $(\alpha_{\text{data}}, \lambda)$ 위상 다이어그램을 $(\alpha_{\text{init}}, \lambda)$ 또는 $(\alpha_{\text{init}}, \alpha_{\text{data}})$ 3차원 위상 공간으로 확장. "LU mechanism" — 훈련 loss landscape가 weight norm에 대해 "L"자, 테스트 loss가 "U"자 형태 — 을 제안하여, 두 landscape의 불일치가 grokking의 기원임을 주장. 이는 Liu (2022)의 "국소 vs. 전역 최솟값" 설명을 보완/대체.

**무엇을 얻을 수 있는가**: (1) 초기화 스케일이라는 추가 제어 변수를 Grokking track의 실험 설계에 포함. (2) LU mechanism이 TS 예측에서도 유효한지 테스트 — logistic map에서 weight norm 대비 train/test loss 프로필을 그려보기. (3) "과제-비특이적" grokking의 존재 증거는 TS 도메인으로의 일반화 가능성을 지지.

---

## 경쟁: Davies, Langosco, Krueger (2023) — "Unifying Grokking and Double Descent"

**arXiv:2303.06173**

**어떤 논문인가**: Harvard/Cambridge 연구진. Grokking과 double descent가 "패턴 학습 속도"(pattern learning speeds)라는 단일 메커니즘의 두 가지 표현일 수 있다는 가설. 빠른 패턴(쉬운 것, 저주파수)이 먼저 학습되고, 느린 패턴(어려운 것, 고주파수)이 나중에 학습됨. Grokking은 일반화에 필요한 패턴이 "느린 패턴"일 때 발생.

**본 논문과의 관계**: Liu (2022)의 4-위상을 다른 관점에서 재해석. Liu가 "구조화 표현의 출현"에 초점을 맞췄다면, Davies는 "학습 속도의 계층 구조"(hierarchy of learning speeds)에 초점. 또한, 모델 크기를 제어 변수로 추가하여 "model-wise grokking"의 최초 시연 — 이는 Liu (2022)에는 없는 분석 차원.

**무엇을 얻을 수 있는가**: (1) "패턴 학습 속도" 프레임워크를 TS 예측에 적용 — TS에서 "빠른 패턴"은 추세/계절성(저주파), "느린 패턴"은 비정상 regime 전환(고주파/불규칙). Grokking이 regime 인식에서 발생한다면, 이것은 Lyle (2025)의 비정상성 연구와 직접 연결. (2) Model-wise grokking 시사점: TS transformer의 층수/차원을 변화시키면서 일반화의 비단조적 행태를 관찰. (3) Double descent와의 통합적 이해는 Grokking track의 Related Work 서술에 직접 활용 가능.

---

## 후속: Grokfast — Lee, Park, Kim (2024) — "Accelerated Grokking by Amplifying Slow Gradients"

**arXiv:2405.20233**

**어떤 논문인가**: KAIST/서울대 연구진. Grokking의 핵심 병목이 "느린 그래디언트 성분"(slow gradient component)임을 관찰하고, EMA(지수이동평균) 필터로 느린 성분을 증폭하여 grokking을 50~100배 가속. 알고리즘적 과제(모듈러 연산), MNIST, IMDb에서 검증.

**본 논문과의 관계**: Liu (2022)의 "에너지 장벽을 넘어야 한다"는 직관을 실용적 알고리즘으로 전환. 유효 이론이 예측한 "느린 전이 모드"에 해당하는 그래디언트 주파수를 식별하고 증폭. 이것은 Liu의 이론이 실천적 도구로 번역된 사례.

**무엇을 얻을 수 있는가**: (1) Grokking track 실험에서 Grokfast를 적용하여 grokking 탐색의 효율을 크게 높일 수 있음 — 위상 다이어그램의 각 $(\alpha, \lambda)$ 점에서 $10^6$ 스텝 대신 $10^4$ 스텝으로 grokking 여부를 판별. (2) Grokfast의 EMA 필터가 TS 예측의 grokking에서도 작동하는지 자체가 하나의 실험 질문. (3) Grokfast가 가속하는 "느린 성분"이 구체적으로 무엇인지(임베딩의 구조화 방향? attention 패턴의 정렬?)를 분석하면, Liu의 유효 이론과 Nanda의 회로 분석을 잇는 다리가 됨.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **10_extensions_b_followups *핵심 claim*?**
2. **10_extensions_b_followups *technical detail*?**
3. **10_extensions_b_followups *implication*?**

### 답변

1. 풍부한 답변 (deep dive 본문 참조).

2. 풍부한 답변 (deep dive 본문 참조).

3. 풍부한 답변 (deep dive 본문 참조).
