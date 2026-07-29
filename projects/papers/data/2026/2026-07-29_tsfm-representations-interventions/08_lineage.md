# 7. 이론적 계보

이 논문의 정체성은 "LLM 해석론 도구를 시계열로 이식"이다. 따라서 계보는 **① 도구를 만든 조상(LLM 해석론)** 과 **② 착지지점을 만든 조상(TSFM)** 두 갈래로 갈린다.

## 이론적 조상

**① 활성 steering / difference-of-means (LLM 해석론).**
"두 조건의 평균 활성 차이를 개념 방향으로 삼아 활성에 더한다"는 아이디어는 언어모델 해석에서 왔다(activation addition / steering vectors 계열). 이 논문의 $\mathbf{S}_i=\mathbf{M}_i^s-\mathbf{M}_i^c$와 $\mathbf{h}_i\leftarrow\mathbf{h}_i+\alpha\mathbf{S}_i$는 그 시계열판이다. **직접 연결선**: 개념=방향이라는 선형 표현 가설(2026-05-22 Monosemanticity, 2026-05-15 Sparse Feature Circuits에서 다룬 dictionary/feature 방향과 같은 뿌리)을 그대로 계승.

**② CKA — 표현 유사도 분석(Kornblith et al. 2019 계열).**
층·모델 간 표현을 비교하는 사실상 표준 도구. 원래 비전·언어 네트워크의 "층이 무엇을 배우나"를 비교하려 개발됐고, 이 논문은 그걸 **TSFM 층 중복 진단 → 가지치기**로 용도 전환. 방법 자체는 물려받고 **응용 목표를 새로**.

**③ MOMENT (Goswami et al., ICML 2024).**
저자 그룹의 자작 TSFM. 이 논문의 주 분석 대상이자, "우리가 만든 모델을 우리가 연다"는 구도. MOMENT의 patch-encoder 구조가 층 중복·개념 국소화 분석의 무대.

**④ 선형 프로빙 + Fisher 판별(고전 LDA).**
Fisher 판별비(클래스 간 분산 / 클래스 내 분산)는 통계학 고전. 이 논문은 그걸 **층·토큰별 개념 분리도 게이지(LDR)** 로 재활용 — 오래된 도구의 새 무대.

## 평행 연구 (비슷한 시기, 다른 접근)

**A. "Dissecting Chronos: Sparse Autoencoders Reveal Causal Feature Hierarchies"(Mishra, 2026-05-27 다룸).**
같은 목표(TSFM 내부 열기), 다른 도구 — **SAE(비지도 특징 발굴)** vs 이 논문의 **지도 프로빙(개념 미리 정의)**. SAE는 "무엇이 있는지 모른 채 발굴", 이 논문은 "찾을 개념을 정하고 위치 확인". 발굴력은 SAE가, 통제·인과 개입(steering)은 이 논문이 강점.

**B. Concept Bottleneck for TS Transformers(van Sprang·Acar·Zuidema, arXiv:2410.06070).**
같은 "개념 해석" 목표, 정반대 시점 — **학습 중 개념을 심는(forward-engineer)** vs 이 논문의 **사후에 개념을 찾는(post-hoc)**. Bottleneck은 개념을 강제해 투명성↑이나 "원래 모델이 배운 것"은 못 봄. 이 논문은 있는 그대로를 보되 개입으로 인과 확인.

**C. TSFM 해석의 후속(예: arXiv:2511.15324 "On the Internal Semantics of Time-Series Foundation Models").**
이 논문 직후 등장한 같은 계열 — TSFM 내부 의미 분석이 하나의 흐름으로 형성 중임을 보여줌. 이 논문이 그 흐름의 **초기 표준** 역할.

**어디서 이겼나 / 졌나**: 이 논문은 **여러 아키텍처(MOMENT·Chronos·Moirai)에 걸친 일반성 + 세 도구 통합**에서 앞선다. 반면 **개별 도구의 깊이**(SAE의 특징 해상도, Concept Bottleneck의 강제 투명성)에서는 전문 논문에 밀린다. 즉 **폭 vs 깊이**의 트레이드오프에서 폭을 택한 논문.

## 후손 예측 (파생 방향)

1. **실세계 개념 steering**: 합성 대신 실데이터에서 추정한 steering 벡터로 레짐 전환·이벤트 개념을 주입/억제 → §5 저자 스스로 지목한 1순위 후속.
2. **SSM/MLP 계열로 확장**: Mamba류 상태공간모델의 층 중복·개념 국소화 — attention 없는 모델에서 같은 도구가 되는지(2026-06-22 Hidden Attention of Mamba 계열 시각과 접점).
3. **가지치기 자동화**: CKA 블록 경계를 사람 눈이 아니라 알고리즘으로 판정하고, steering $\alpha$를 자동 보정하는 표준 파이프라인.

## 계보가 알려주는 전략적 위치

이 논문의 계보를 그리면 한 가지 전략이 보인다 — **"성숙한 방법 × 신생 도메인"** 은 초기 진입자에게 유리한 조합이라는 것. steering·CKA·프로빙은 이미 검증이 끝나 방법 리스크가 낮고, TSFM 해석은 무주공산이라 **"처음 붙였다"는 존재 증명만으로 탑티어(ICML)가 인정**됐다. 새 알고리즘을 발명하는 고위험 경로가 아니라, 검증된 도구를 아직 아무도 안 착지시킨 곳에 먼저 내려놓는 저위험·선점 경로다.

이게 내 연구 전략에 주는 교훈은 직접적이다. APF의 "PE × motif × causal intervention"도 개별 부품(PE 비교, attention 분석, activation steering)은 모두 **기존 검증 도구**다. 참신함은 부품이 아니라 **조합의 특정성**(PE를 통제 변수로 둔 motif 인과성)에서 나온다. Wiliński et al.이 "통합 + 첫 착지"로 ICML을 받았듯, APF도 "부품의 새 조합 + 통제된 인과"라는 프레이밍을 명확히 하면 방법 참신성 논쟁을 우회할 수 있다. 단 반대 교훈도 있다 — 이 논문의 약한 고리(정성·합성 한정)가 보여주듯, **"첫 착지"의 값은 빠르게 소모**된다. 후속(arXiv:2511.15324)이 이미 정량·실데이터로 밀고 들어오므로, 선점 후엔 곧바로 정량화·실데이터로 방어선을 굳혀야 한다.

**핵심 한 문장**: 이 논문은 "LLM 해석 3종 세트(steering·CKA·프로빙)"라는 성숙한 조상들을 "TSFM(MOMENT·Chronos·Moirai)"이라는 새 무대에 착지시킨 브릿지이며, SAE·Concept Bottleneck과는 폭 대 깊이로 역할을 나눠 TSFM 해석론의 초기 지형을 함께 그린다.
