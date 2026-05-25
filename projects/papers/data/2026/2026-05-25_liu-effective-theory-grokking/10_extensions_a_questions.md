# 9a. 사고 확장 — 자문 질문 5개

---

## Q1. 연속 도메인(시계열 예측)에서 "구조화 임베딩"은 무엇인가?

Liu (2022)에서 구조화 = 순환군의 원형 배치였다. 하지만 시계열 예측에서 입력은 이산 군 원소가 아닌 연속 실수 벡터다. 시계열의 "올바른 구조"는 무엇인가? 후보: (a) 어트랙터 재구성(Takens' embedding)의 기하학, (b) 주파수 스펙트럼의 저차원 집중, (c) 시간적 부드러움(인접 시점의 임베딩이 가까움). 이 질문에 답하지 않으면, "TS에서의 grokking"은 정의 자체가 불명확해진다.

**왜 중요한가**: Grokking track의 전체 프로젝트가 이 질문의 답에 의존한다. 구조화의 정의 없이는 위상 다이어그램을 구축할 수 없고, progress measure를 설계할 수 없다.

## Q2. Weight decay 외의 정규화도 같은 4-위상을 유도하는가?

Liu (2022)는 $L_2$ weight decay만 분석했다. Dropout, label smoothing, spectral normalization, $L_1$, 또는 데이터 증강(data augmentation)이 같은 4-위상 구조를 만드는가? 만약 만든다면, "정규화 일반"이 grokking의 메커니즘이며 weight decay는 한 인스턴스일 뿐. 만약 만들지 않는다면, weight decay의 $L_2$ 노름 제약에 특수한 무언가가 있는 것.

**왜 중요한가**: Grokking track의 실험에서 PatchTST, iTransformer 등은 다양한 정규화 기법을 사용한다. Weight decay만이 grokking을 유도한다면 실험 설계가 제한되고, 범정규화(pan-regularization) 효과라면 더 넓은 실험 공간이 열린다.

## Q3. 4-위상은 정말 4개인가, 아니면 연속 스펙트럼의 이산화인가?

재현 연구에서 "memorization이 실은 더 지연된 grokking"이라는 관찰이 있었다. 이는 memorization과 grokking의 경계가 "충분히 오래 기다렸는가"의 문제일 수 있음을 시사. 극단적으로, 모든 memorization은 $t \to \infty$에서 grokking으로 전환될 수 있는가? 만약 그렇다면 "진정한 memorization"은 존재하지 않으며, 4-위상은 3-위상(comprehension / grokking / confusion)으로 줄어든다.

**왜 중요한가**: 위상의 수가 연구의 프레이밍을 결정한다. 4-위상이 robust하면 "위상 전이"라는 물리학적 언어가 정당화되고, 이산화의 인공물이면 "정도의 차이"라는 더 보수적 프레이밍이 필요.

## Q4. 대규모 모델(GPT-2, LLaMA)에서도 grokking이 발생하는가?

Liu (2022)의 모든 실험은 소형 모델(< 1M 파라미터)이다. 대규모 모델은 (a) 파라미터가 매우 많아 memorization 용량이 거대하고, (b) 다양한 과제를 동시에 학습하며, (c) 학습률 스케줄링이 다르다. 대규모 모델에서 특정 과제(예: modular arithmetic이 학습 데이터에 소량 포함)에 대해 grokking이 발생하는지? 이것은 grokking 연구의 "실용적 관련성"(practical relevance) 질문.

**왜 중요한가**: 소형 모델에서만 관찰되는 현상이라면 학술적 호기심에 그치지만, 대규모 모델에서도 발생한다면 학습 커리큘럼 설계, 데이터 구성, early stopping 정책에 직접적 함의.

## Q5. Grokking의 "에너지 장벽"을 직접 측정하고 조작할 수 있는가?

Liu (2022)의 유효 이론은 국소 최솟값(memorization)과 전역 최솟값(generalization) 사이의 에너지 장벽을 간접적으로 예측한다. 하지만 이 장벽을 loss landscape 분석 도구(예: loss surface visualization, Hessian eigenvalue 분석, mode connectivity 분석)로 직접 측정한 연구는 드물다. 장벽을 측정할 수 있다면, 장벽을 인위적으로 낮추어 grokking을 가속하거나(Grokfast의 접근), 높여서 memorization을 강제하는 것이 가능해진다.

**왜 중요한가**: 유효 이론의 핵심 예측(에너지 장벽의 존재)을 직접 검증하는 것은 이론의 신뢰성을 결정짓는 실험. 또한, 장벽 조작은 grokking을 "제어 가능한 현상"으로 만드는 첫 걸음.
