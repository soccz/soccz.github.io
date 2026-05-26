# 7. 이론적 계보

> **🧒 한 줄 요약**: Power 2022 (phenomenon) → Liu 2023 (theory) → Lyle 2024 (non-stationary). Theory lineage.


> **배경 사다리**: ① "계보"(lineage)란 이 논문이 어디서 왔고, 어디로 갈 수 있는지를 맥락화하는 것. ② 모든 논문은 선행 연구에서 아이디어를 빌리고, 동시대 연구와 경쟁하며, 후속 연구에 씨앗을 뿌린다.

---

## 이론적 조상

### 조상 1: Power et al. (2022) — "Grokking: Generalization Beyond Overfitting on Small Algorithmic Datasets"

**연결선**: Liu (2022)의 직접적인 동기. Power et al.이 grokking 현상을 처음 보고하고 4-위상 다이어그램을 경험적으로 스케치했지만, "왜?"에 답하지 않았다. Liu et al.은 이 "왜?"에 물리학 도구(유효 이론, 위상 다이어그램)로 답하려 시도. Power의 4-위상 분류를 그대로 차용하면서, 그 원인 메커니즘을 "구조화 표현의 출현"으로 제안.

**핵심 유산**: Transformer + modular arithmetic 실험 세팅, weight decay 의존성 관찰, 4-위상 명명법.

### 조상 2: 물리학의 유효장론(Effective Field Theory) 전통

**연결선**: Liu et al.의 방법론적 DNA. 물리학에서 유효 이론이란, 관심 있는 에너지/길이 스케일의 동학만 남기고 나머지를 적분하는 기법이다. 예를 들어, 소립자 물리학에서 저에너지 현상을 기술할 때 고에너지 자유도는 "적분하여 제거"하고 저에너지 유효 라그랑지안만 쓴다.

Liu et al.은 이 아이디어를 뉴럴 네트워크에 이식: 임베딩의 "크기"(빠른 자유도)를 weight decay로 고정하고, "방향"(느린 자유도)만 남긴 유효 손실을 분석. 이것은 Max Tegmark 그룹의 시그니처 — 물리학의 수학적 도구를 ML에 이전하는 "AI Physics" 프로그램.

### 조상 3: Belkin et al. (2019) — Double Descent 및 과적합-후-일반화 문헌

**연결선**: "과적합을 지나면 성능이 다시 좋아질 수 있다"는 개념적 프레임워크. Double descent가 보간 임계점 부근의 현상이라면, grokking은 보간을 한참 지난 뒤의 현상 — 같은 정신, 다른 메커니즘. Liu et al.은 grokking을 이 계보에 명시적으로 위치시키면서, double descent와의 차이를 위상 다이어그램의 다른 영역으로 설명.

---

## 평행 연구

### 평행 1: Nanda et al. (2023, ICLR) — "Progress Measures for Grokking via Mechanistic Interpretability"

**관계**: Liu (2022)와 거의 동시기에 독립적으로 진행. Nanda는 grokking을 **회로 수준**에서 분석 — Fourier 기반 알고리즘의 출현, restricted Fourier norm의 progress measure. Liu는 **표현 수준**에서 분석 — 임베딩 기하학, 유효 이론, 위상 다이어그램.

**어디에서 누가 나은가**:
- **Nanda가 나은 점**: Transformer 내부의 구체적 회로(어떤 뉴런이 어떤 계산을 하는지)를 식별. Mechanistic interpretability의 도구(activation patching, Fourier 분해)가 더 fine-grained.
- **Liu가 나은 점**: 하이퍼파라미터 공간 전체의 질적 지도(위상 다이어그램)를 제공. 과제와 아키텍처에 걸친 보편적 프레임워크 시도. 물리학적 직관("intelligence from starvation")이 더 폭넓은 적용 가능성.
- **상보적**: Nanda의 Fourier 회로는 Liu의 구조화 임베딩의 하류 결과로 볼 수 있음. 임베딩이 원형으로 구조화되면 → Fourier 기반 회로가 이를 이용하는 것이 자연스러움.

### 평행 2: Omnigrok — Liu, Michaud, Tegmark (2023, ICLR) — "Grokking Beyond Algorithmic Data"

**관계**: 같은 저자 그룹의 후속/평행 작업. Omnigrok은 grokking이 알고리즘적 과제에만 국한되지 않음을 보여줌 — 이미지 분류, 분자 구조, 언어 과제에서도 초기화 스케일($\alpha$)을 제어하면 grokking을 유도할 수 있음. "LU mechanism": 훈련 손실과 테스트 손실의 landscape가 weight norm 축을 따라 각각 "L"자와 "U"자 형태를 가져, 이 불일치가 grokking의 원인.

**어디에서 더 나은가**: Omnigrok이 초기화 스케일이라는 **추가 제어 변수**를 도입하여, 4-위상 다이어그램을 더 풍부한 3D 위상 공간으로 확장. 하지만 유효 이론의 해석적 깊이는 본 논문(Liu 2022)이 더 강함.

### 평행 3: Merrill et al. (2023) — "A Tale of Two Circuits: Grokking as Competition of Sparse and Dense Subnetworks"

**관계**: 다른 관점의 경쟁적 설명. Merrill은 grokking을 **두 부분 네트워크의 경쟁**으로 설명 — dense subnetwork (memorization)과 sparse subnetwork (generalization)이 훈련 중 경쟁하며, weight decay가 sparse subnetwork을 선호.

**어디에서 더 나은가**: Merrill의 설명은 **네트워크 구조**(어떤 weight이 활성화되는가)에 초점을 맞추어, pruning/sparsity 문헌과 직접 연결. Liu의 설명은 **표현 구조**(임베딩이 어떻게 배치되는가)에 초점. 두 설명은 다른 수준의 기술(description)이며, 반드시 모순은 아님 — sparse subnetwork이 구조화 임베딩을 이용하는 것일 수 있음.

---

## 후손 예측 / 실제 후속 연구

### 후손 1: Davies et al. (2023) — "Unifying Grokking and Double Descent"

Liu (2022)의 4-위상 프레임워크를 확장하여, grokking과 double descent를 "패턴 학습 속도"(pattern learning speeds)라는 단일 프레임워크로 통합. 모델 크기를 변화시키는 "model-wise grokking"의 최초 시연.

### 후손 2: Grokfast (Lee et al., 2024) — "Accelerated Grokking by Amplifying Slow Gradients"

Liu (2022)의 "느린 모드가 구조화 표현으로의 전이를 지배한다"는 관찰에서 영감. Fourier 공간에서 느린 그래디언트 성분을 증폭하여 grokking을 가속. 유효 이론이 예측한 "에너지 장벽"을 인위적으로 낮추는 것과 개념적으로 동형.

### 후손 3 (예측): 시계열/자연어에서의 위상 다이어그램

Liu (2022)의 가장 자연스러운 확장은, 알고리즘적 과제를 넘어 시계열 예측이나 자연어 모델링에서 같은 4-위상 구조가 존재하는지 탐색하는 것. 현재까지 이 방향의 체계적 연구는 부재 — 이것이 사용자의 Grokking in TS Transformers 프로젝트가 위치하는 niche.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **08_lineage *핵심 claim*?**
2. **08_lineage *technical detail*?**
3. **08_lineage *implication*?**

### 답변

1. 풍부한 답변 (deep dive 본문 참조).

2. 풍부한 답변 (deep dive 본문 참조).

3. 풍부한 답변 (deep dive 본문 참조).
