# 10a — 사고 확장: 자문 질문 5개

---

## Q1 — ELR Re-warming이 시계열 비정상성(non-stationarity)을 처리하는 범용 도구가 될 수 있는가?

**왜 이 질문이 중요한가?**  
이 논문은 ELR re-warming이 grokking·warm-starting·RL primacy bias에 효과를 보임을 보였다. 이 세 설정의 공통점은 "분포가 변하거나, 초기 경험에 과적합되는 문제"다. 시계열 예측에서의 concept drift는 구조적으로 동일한 문제다 — 2019년 데이터로 훈련된 모델이 COVID 이후의 새로운 volatility regime에서 작동하지 않는 것처럼. 만약 ELR re-warming이 시계열 모델의 "개념 드리프트 적응 속도"를 높인다는 것이 실증된다면, 이것은 금융 ML에서의 범용 도구가 된다.

**더 깊은 질문**: Re-warming의 최적 주기 $T$가 데이터의 "비정상성 주기"와 어떤 관계에 있는가? 일 단위 변동성(intraday)에는 $T = 100$ 스텝이, 월 단위 regime 변화에는 $T = 10000$ 스텝이 적합할까?

---

## Q2 — Lazy vs Rich 이분법이 실제로 연속적 스펙트럼인가?

**왜 이 질문이 중요한가?**  
Lyle의 프레임워크는 "lazy regime"과 "rich regime"을 이분법적으로 제시하지만, 현실은 스펙트럼일 가능성이 높다. ELR이 "충분히 크면" rich, "충분히 작으면" lazy라면, 그 경계는 어디인가? 이 경계값이 태스크 복잡도, 네트워크 크기, 데이터셋 크기에 따라 어떻게 달라지는가?

**더 깊은 질문**: Liu et al.(2022)의 유효 이론에서 lazy/rich 전환은 초기화 스케일의 함수였다. Lyle의 ELR 공식으로는, "ELR_threshold = C / (dataset_complexity × model_size)"와 같은 형태의 임계값을 유도할 수 있는가? 이것이 성립하면 Re-warming 주기 $T$를 자동으로 설정하는 이론이 된다.

---

## Q3 — ELR 관리가 Catastrophic Forgetting과 Grokking을 동시에 설명하는가?

**왜 이 질문이 중요한가?**  
Catastrophic Forgetting(파국적 망각)은 "새 태스크를 배우면서 이전 태스크를 잊는" 문제로, 지속학습의 핵심 문제다. 반면 Grokking은 "오랫동안 기억한 후 갑자기 일반화"하는 현상이다. 이 두 현상은 ELR 프레임워크에서 어떻게 통합되는가?

**가설**: ELR이 높은 상태(rich regime)에서는 새 특징을 빨리 배우지만(grokking 촉진) 이전 특징을 덮어쓸 위험도 높다(forgetting 촉진). ELR이 낮은 상태(lazy regime)에서는 새 특징을 못 배우지만(grokking 억제, plasticity loss) 이전 특징은 보존된다(anti-forgetting). 이 trade-off를 ELR로 명시적으로 제어한다면, "언제 배울 것인가(high ELR)와 언제 기억을 보존할 것인가(low ELR)"를 인지적으로 분리할 수 있다.

**더 깊은 질문**: Elastic Weight Consolidation(EWC)과 같은 catastrophic forgetting 방지 방법이 ELR 프레임워크에서 어떤 역할인가? EWC는 특정 파라미터의 변화를 억제하는데, 이것이 효과적으로 특정 파라미터의 ELR을 선택적으로 낮추는 것과 같은가?

---

## Q4 — 트랜스포머의 Attention Head는 Layer-별로 다른 ELR 역학을 갖는가?

**왜 이 질문이 중요한가?**  
현재 ELR 정의는 레이어 전체의 파라미터 노름을 사용한다. 그러나 트랜스포머의 Query, Key, Value, Output 행렬들은 각각 다른 역할을 하며, 서로 다른 속도로 훈련된다는 것이 알려져 있다(Clark 2019 등). Layer-wise ELR을 Head-wise ELR로 세분화하면 어떤 head가 먼저 rich regime에 진입하는가? 이것이 Induction Head(Olsson 2022)의 등장 시점과 관련이 있는가?

**더 깊은 질문**: APF(Attention Pattern Fields) 연구에서 관찰하는 attention motif(diagonal, stripe, block 등)의 등장이 해당 head의 ELR과 상관관계를 보이는가? "Diagonal motif는 high-ELR head에서 먼저 등장한다"는 가설을 APF 실험에서 직접 테스트할 수 있다.

---

## Q5 — 그로킹이 불필요한가? 언제는 "lazy regime 유지"가 더 좋은가?

**왜 이 질문이 중요한가?**  
이 논문은 암묵적으로 "rich regime = 좋은 것"이라고 가정한다. 하지만 항상 그런가? 의료 AI나 금융 고빈도 거래처럼 안정성이 최우선인 응용에서는, 기존 학습을 손상시키지 않는 것이 새 특징을 빨리 배우는 것보다 중요할 수 있다. 

**반대 가설**: Lazy regime(낮은 ELR, 높은 노름)은 이미 잘 학습된 표현을 "동결"하는 자연스러운 메커니즘일 수 있다. 이것이 모델의 "신뢰성"을 높이는 기능이라면, ELR re-warming은 오히려 해로울 수 있다.

**더 깊은 질문**: Transfer Learning에서 ImageNet 사전훈련 모델을 파인튜닝할 때 흔히 "하위 레이어를 동결(freeze)"한다. 이것은 하위 레이어의 ELR을 0으로 만드는 것과 유사하다. 그렇다면 "선택적 ELR 관리" — 어떤 레이어는 re-warm하고 어떤 레이어는 동결 — 가 최적 전략인가?
