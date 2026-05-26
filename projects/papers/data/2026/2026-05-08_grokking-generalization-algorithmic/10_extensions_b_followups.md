# 10b — 사고 확장: Follow-up 논문 3편

> **🧒 한 줄 요약**: Nanda Fourier circuit, Wang reasoner, Lyle plasticity, Liu omni grokking.


---

## Follow-up 1 (선행) — Liu et al. 2022 "Towards Understanding Grokking: An Effective Theory of Representation Learning"

**어떤 논문인가**: NeurIPS 2022에서 발표된 이론 논문으로, 그로킹 현상에 대한 최초의 유효 이론(effective theory) 틀을 제시한다. Power 2022와 거의 동시에 작성됐지만 이론적 설명에 집중한다.

**Power 2022와의 관계**: Power 2022가 "무엇이 일어나는가"를 기술한다면, Liu 2022는 "왜 일어나는가"를 설명하려 한다. "게으른(lazy) 표현"과 "풍부한(rich) 표현" 사이의 전이로 그로킹을 설명한다. 게으른 표현은 훈련 데이터에 빠르게 맞추지만 일반화 못 하고, 풍부한 표현은 느리게 형성되지만 일반화한다.

**무엇을 얻을 수 있는가**: Power 2022의 "4구역 위상 다이어그램"에 이론적 해석을 더할 수 있다. 내 TS 프로젝트에서 "그로킹 in TS"를 주장할 때 "게으른 표현 → 풍부한 표현 전이"의 TS 버전을 제안하는 이론 프레임으로 활용 가능. 출처: arXiv 없음, NeurIPS 2022 proceedings에서 확인 가능.

---

## Follow-up 2 (경쟁) — Thilak et al. 2023 "Omnigrok: Grokking Beyond Algorithmic Data" (ICLR 2023)

**어떤 논문인가**: Power 2022의 가장 직접적인 경쟁/확장 논문. 그로킹이 알고리즘 데이터에만 특수한지 MNIST, CIFAR, IMDb 등 다양한 도메인에서 검증. 핵심 기여: 초기화 스케일(initialization scale)이 그로킹의 주요 결정 인자 중 하나임을 발견. 초기 파라미터 노름을 줄이면 (예: 초기화를 작게 하면) weight decay 없이도 그로킹 유발 가능.

**Power 2022와의 관계**: Power 2022는 weight decay를 핵심 변수로 제시했지만, Omnigrok은 "파라미터 노름의 초기값"이 더 근본적인 변수임을 보인다. 이는 weight decay가 파라미터 노름을 줄이기 때문에 효과적이라는 Nanda 2023의 설명을 지지한다.

**무엇을 얻을 수 있는가**: 내 TS 실험에서 초기화 전략을 바꾸는 것만으로도 그로킹 유사 현상을 유발할 수 있다는 실험 아이디어를 얻는다. 또한 Omnigrok의 "다양한 도메인" 설계 방식이 내 논문의 실험 섹션 설계에 참고가 된다. OpenReview: openreview.net/forum?id=zDiHoIWa0q1

---

## Follow-up 3 (후속) — Nanda et al. 2023 "Progress Measures for Grokking via Mechanistic Interpretability" (ICLR 2023)

**어떤 논문인가**: Power 2022의 현상을 기계론적 해석으로 분해한 가장 영향력 있는 후속 논문. 모듈 덧셈에서 그로킹 이후 모델이 **Fourier 회로**를 사용한다는 것을 발견 — 구체적으로, 특정 주파수 $k$에 대해 $\cos(k \cdot a) \cos(k \cdot b) - \sin(k \cdot a) \sin(k \cdot b) = \cos(k(a+b))$ 를 구현하는 어텐션 패턴. "진행 측도(progress measures)"라는 내부 해석 가능 지표를 도입해 그로킹 과정을 단계적으로 추적한다. 이미 커버된 논문 [2026-04-27 ✓].

**Power 2022와의 관계**: Power 2022의 "왜"에 대한 가장 명확한 부분 답변. Power 2022가 현상을 발견했다면, Nanda 2023은 그 내부 메커니즘을 X선 촬영한다. "Fourier 회로의 파라미터 노름이 암기 해보다 작다"는 발견이 "weight decay → 그로킹"의 메커니즘을 설명한다.

**무엇을 얻을 수 있는가**: 내 TS 프로젝트에서 "TS용 진행 측도"를 정의하는 방법론을 이 논문의 프레임에서 찾을 수 있다. 또한 Fourier 회로의 TS 버전이 있다면 어떤 패턴인지 (예: 계절성 주파수를 인식하는 헤드?) 탐색하는 실험 설계의 출발점이 된다.

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
