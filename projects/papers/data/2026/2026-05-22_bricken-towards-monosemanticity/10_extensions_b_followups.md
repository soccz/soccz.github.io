# 9-B. 사고 확장 — Follow-up 논문 3편

---

## Follow-up 1 — 선행: "Toy Models of Superposition" (Elhage et al. 2022)

**어떤 논문인가**: Anthropic 팀이 인공적으로 설계된 단순 신경망(2개 MLP 레이어)에서 슈퍼포지션이 어떻게 발생하고, 어떤 요인이 슈퍼포지션의 강도를 결정하는지 이론적·실험적으로 분석한 논문. Monosemanticity의 직접적 이론 기반이다.

**본 논문(Monosemanticity)과의 관계**: Toy Models는 "슈퍼포지션이 존재한다"는 이론을 장난감 설정에서 증명했고, Monosemanticity는 그것을 실제 언어 모델에서 실증하고 해소하는 방법을 제시했다. Monosemanticity를 완전히 이해하려면 Toy Models를 먼저 읽어야 한다.

**얻을 수 있는 것**: 슈퍼포지션이 어떤 수학적 조건에서 발생하는지(ReLU의 역할, 희박성의 중요성, 특징 중요도의 영향), 그리고 이것이 딕셔너리 크기 선택에 어떤 함의를 갖는지를 엄밀하게 이해할 수 있다.

---

## Follow-up 2 — 경쟁: "Sparse Autoencoders Do Not Find Canonical Features" (ICLR 2025)

**어떤 논문인가**: 검색 결과에서 발견된 논문 (proceedings.iclr.cc/paper_files/paper/2025/file/84ca3f2d9d9bfca13f69b48ea63eb4a5-Paper-Conference.pdf). SAE가 고유한 기저 특징 집합을 찾는다는 암묵적 가정에 이론적·실험적으로 도전하는 논문. "규칙적(canonical)" 특징이 존재하지 않거나 SAE가 그것을 찾지 못한다는 주장. [이 환경에서 원문 직접 확인 불가 — 검색 결과에서 제목만 확인]

**본 논문(Monosemanticity)과의 관계**: 직접적 비판 논문이다. Monosemanticity가 열어 놓은 "고유성 부재" 한계를 정면으로 공격한다. 이 논문이 맞다면, SAE 기반 해석가능성 전체가 재평가되어야 한다.

**얻을 수 있는 것**: SAE 방법론의 취약점을 이해하고, 더 강건한 특징 발견 방법을 설계하는 데 필요한 비판적 시각. 내 APF 연구에서 SAE를 활용할 때 어떤 caveat를 달아야 하는지 명확해진다.

---

## Follow-up 3 — 후속: "Scaling Monosemanticity: Extracting Interpretable Features from Claude 3 Sonnet" (Templeton et al. 2024)

**어떤 논문인가**: 1-layer transformer에서 시작한 Monosemanticity를 Claude 3 Sonnet (수십억 파라미터 규모)으로 확장한 논문. 수백만 개의 특징을 추출하고, "금문교 특징", "성별 편향 특징", "감정 상태 특징" 등 전례 없이 풍부한 특징 생태계를 발견. 또한 특징 조작(steering)으로 모델 행동을 제어하는 실험도 포함.

**본 논문(Monosemanticity)과의 관계**: 직접적 후속이며 스케일링 검증. 1-layer에서 성립한 SAE 방법론이 실제 대형 모델에서도 통함을 보인다. 단 대형 모델에서 추가로 발견된 복잡한 특징들 ("다중 모달", "추상적 개념")은 단순 단의미성을 넘어서는 구조를 보여준다.

**얻을 수 있는 것**: SAE 특징이 "시계열 모델에서도 비슷하게 풍부하게 나오는가?"라는 내 연구 질문에 대한 기대치를 설정해준다. 또한 특징 조작(steering) 기술이 APF에서 "원하는 attention motif를 유발하는 방향으로 모델을 조종"하는 데 사용될 수 있는 가능성도 제시한다.
