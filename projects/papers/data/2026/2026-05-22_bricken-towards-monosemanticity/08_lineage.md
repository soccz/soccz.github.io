# 7. 이론적 계보

> **🧒 한 줄 요약**: Olshausen 1996 → Elhage 2022 (toy) → Bricken 2023 (real) → Marks 2024 (circuit) → Templeton 2024 (Sonnet).


---

## 이론적 조상 — 이 논문을 낳은 4개의 뿌리

### 조상 1 — Olshausen & Field (1996): 희박 코딩 이론

**연결선**: 시각 신경과학에서 V1 피질의 단순 세포(simple cell)가 자연 이미지를 희박하게 표현한다는 발견. 희박 코딩이 신경망에서 효율적 표현의 원리라는 주장. Monosemanticity 논문은 이 원리를 딥러닝으로 직접 가져온다 — 인공 신경망도 자연 신경망과 동일한 효율성 압력을 받아 슈퍼포지션을 사용하고, 이를 역으로 풀어낼 때 희박 코딩 원리가 자연스럽게 등장한다.

### 조상 2 — Elhage et al. "A Mathematical Framework for Transformer Circuits" (2021)

**연결선**: 이 논문은 Monosemanticity의 직접적 조상이다. 저자들(Chris Olah 등 Anthropic 팀)이 트랜스포머를 수학적으로 분해하는 프레임워크를 제공했다. 특히 "잔차 연결 스트림(residual stream)"이라는 개념을 도입하고, 각 층의 기여가 더해지는 구조를 명확히 했다. Monosemanticity는 이 프레임워크 위에서 "뉴런 수준보다 더 기본적인 단위가 있다"는 것을 보인다.

### 조상 3 — Elhage et al. "Toy Models of Superposition" (2022)

**연결선**: Monosemanticity의 직접적 이론 기반. 인공 데이터셋에서 슈퍼포지션이 어떻게 발생하는지, 어떤 조건에서 더 강해지는지(희박 활성화, 낮은 중요도 특징들이 많을수록)를 엄밀하게 분석. Monosemanticity는 이 장난감 모델에서 실제 언어 모델로 브리지를 놓는다.

### 조상 4 — Olah et al. "Zoom In: An Introduction to Circuits" (2020)

**연결선**: 합성곱 신경망에서 개별 뉴런과 그 연결(회로)을 시각적으로 해석하는 선구적 연구. "회로 분석"이라는 방법론의 발원지. Monosemanticity는 이 접근을 자연어 처리 트랜스포머로 확장하되, 폴리시맨틱 뉴런 문제를 SAE로 먼저 해결한 뒤 회로를 분석한다는 핵심 개선을 추가했다.

---

## 평행 연구 — 비슷한 시기, 다른 접근

### 평행 연구 1 — Cunningham et al. "Sparse Autoencoders Find Highly Interpretable Features in Language Models" (2023)

**관계**: 사실상 동시 제출 연구 (ICLR 2024 채택). GPT-2 Small에 SAE를 적용하는 거의 동일한 접근. **왜 Monosemanticity가 더 영향력이 컸는가**: (a) Anthropic 팀의 자원으로 더 체계적인 실험과 4가지 독립 평가 기준을 제시. (b) transformer-circuits.pub 생태계와의 연결로 mech-interp 커뮤니티 내에서 레퍼런스로 자리잡음. (c) AutoInterp(언어 모델로 특징 설명 생성 및 검증) 파이프라인의 혁신성. **Cunningham이 앞선 점**: 실제 학술 피어리뷰 채널(ICLR)에 공식 발표됨.

### 평행 연구 2 — 지도 학습 프로브 (Supervised Probes, 2019~2022)

**관계**: 특정 개념(gender, number, syntax)이 모델 활성화에 어떻게 인코딩되는지 분류기를 훈련시켜 확인하는 방법. **왜 SAE가 우월한가**: 지도 학습 프로브는 어떤 개념이 있는지 미리 알아야 하며, 슈퍼포지션으로 숨겨진 개념은 발견 불가. SAE는 비지도로 어떤 개념이 있는지조차 모르고 시작한다. **지도 학습 프로브가 나은 점**: 특정 개념에 대한 집중 분석에서는 프로브가 더 민감하고 해석하기 쉽다.

---

## 후손 예측 — 이 논문에서 파생된 연구 방향

### 후손 1 — Scaling Monosemanticity (Templeton et al. 2024, 실제 발표됨)

Monosemanticity의 가장 직접적인 후속. Claude 3 Sonnet 규모의 모델에 SAE를 적용하여 수백만 개의 특징을 추출. "다중 모달 뉴런" (동시에 물리적 개념과 심리적 개념에 반응하는 특징), "안전 관련 특징" (편향, 위험한 콘텐츠 관련 특징) 발견. 이것은 Monosemanticity의 스케일링 가설을 직접 검증한다.

### 후손 2 — Sparse Feature Circuits (Marks et al. 2024, ICLR 2025 Oral — 이미 다룸: 2026-05-15)

SAE 특징을 기반으로 인과 회로를 발견하고 편집하는 방법. Monosemanticity가 "개별 특징"을 다뤘다면, Sparse Feature Circuits는 "특징들 간의 네트워크"를 다룬다. 이 논문에서 이미 상세 분석했으므로, Monosemanticity → Sparse Feature Circuits의 계보가 완성된다.

### 후손 3 — SAE 비판 논문: "Sparse Autoencoders Do Not Find Canonical Features" (ICLR 2025)

검색 결과에서 발견된 논문. SAE가 독립적이고 유일한 특징 기저를 찾는다는 보장이 없다는 이론적·실험적 비판. 이것은 Monosemanticity의 "고유성 부재" 한계를 직접 공격한다. 이 계통의 비판이 SAE 방법론 전체에 어떤 영향을 미칠지가 2025-2026년의 핵심 논쟁이다.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **Olshausen 1996 의 *neuroscience origin* 의 의의?**
2. **Elhage 2022 (toy) → Bricken (real) 의 *bridge 의 critical step*?**
3. **Templeton 2024 의 *scaling 후속* 의 direct continuation?**

### 답변

1. **Biological substrate 의 algorithmic discovery**. Olshausen 의 *V1 sparse coding* = *biological observation*. Bricken 의 *transformer SAE* = *artificial mimicry*. 동일 algorithm 의 *biological & artificial 양쪽 emergence* = "*sparse coding 가 universal representation principle*". → AI ↔ neuroscience 의 *unifying principle*.

2. **Toy → Real 의 *empirical viability* 입증**. Elhage 2022 = "*superposition 가능 in toy*" — 하지만 real model 미증명. Bricken 2023 = "*SAE decompression 가능 in real transformer*" — *critical empirical bridge*. Without Bricken, *all subsequent SAE work* (Marks SFC, Templeton scaling) 의 *empirical premise* 부재.

3. **Same method, scaling only**. Templeton 의 Sonnet SAE = *동일 architecture* (encoder + decoder + L1), *동일 training* (Adam + resample), *동일 evaluation* (auto-interp). *유일 차이* = *model size + training data scale*. → "*Bricken methodology 의 1000× scaling*" — *direct continuation*, not new method.
