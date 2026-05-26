# 05a 방법론 — 전체 그림

> **🧒 한 줄 요약**: *Direct intuition*: "neuron → SAE feature → circuit edge" 의 *2-step decomposition* 으로 polysemantic → monosemantic → causal.


**배경 사다리**: ① "autoencoder"는 입력 → 압축(병목) → 복원하는 신경망으로, 병목에서 입력의 핵심 구조를 학습한다는 것; ② "sparse"는 대부분의 값이 0이고 소수만 0이 아님을 의미한다는 것; ③ "gradient(기울기)"는 함수를 약간 변경했을 때 출력이 얼마나 변하는지를 나타내는 값이라는 것만 알면 된다.

---

## 전체 파이프라인 개요

SFC(Sparse Feature Circuits) 방법론은 세 단계 파이프라인이다.

```
[단계 1] SAE 학습
    언어 모델의 내부 활성화
    → 희소 자동인코더(SAE) 학습
    → 특징 사전(Feature Dictionary) 획득
    (각 특징 = 모노시맨틱 방향 벡터)

[단계 2] 특징 회로 발견
    특정 행동 B에 대한 입력 쌍 (x_clean, x_corrupted) 정의
    → 각 특징 f_i의 간접 효과(IE) 계산
        (어트리뷰션 패칭 또는 통합 기울기)
    → IE > τ (임계값) 인 특징 = 회로 노드
    → 노드 쌍의 IE = 회로 엣지 가중치
    → 유향 그래프 G(V, E) = 희소 특징 회로

[단계 3] 응용
    (A) 과학적 이해: 회로 가시화, 충실도/완전도 측정
    (B) 모델 편집: SHIFT — 특정 특징 ablation으로 행동 변경
    (C) 비지도 탐색: 자동 행동 탐지 → 자동 회로 생성
```

---

## 핵심 설계 결정 세 가지

### 결정 1: SAE를 먼저 학습하고 고정한다

SFC는 SAE를 논문 안에서 새로 학습하지 않는다. 이미 학습된 SAE(Towards Monosemanticity 계열의 기존 SAE 또는 Pythia-70M 전용 SAE)를 **고정(frozen)**하고, 그 위에서 회로를 탐색한다. 이 결정은 두 가지를 의미한다:

- **장점**: 특징의 해석 가능성은 별도로 검증된 SAE가 담당하므로, 이 논문은 "회로 발견"에만 집중할 수 있다.
- **위험**: SAE가 나쁘면 회로도 나쁘다 — 쓰레기 입력, 쓰레기 출력(GIGO). SAE 품질에 전적으로 의존.

### 결정 2: 간접 효과(IE)를 가중치로 사용한다

회로를 정의하는 가장 중요한 개념이 IE다. IE는 활성화 패칭(activation patching) 실험에서 온다: "이 구성요소의 활성화를 corrupted 입력의 값으로 바꾸면 출력이 얼마나 변하는가." 이것을 직접 계산하면 조합 폭발이 일어난다 (n개 구성요소 → $2^n$ 가능한 개입). 그래서 **근사**를 쓴다. 두 가지 근사 방법(어트리뷰션 패칭, 통합 기울기)은 다음 파일(05_method_c_attribution.md)에서 상세히 다룬다.

### 결정 3: 엣지도 IE로 정의한다

회로는 노드(특징)만 있으면 되는 것이 아니라, 특징들 사이의 인과 연결(엣지)도 있어야 한다. "특징 $f_i$가 특징 $f_j$에 직접적으로 기여하는가"를 측정하기 위해, 두 특징 사이의 "경로 IE"를 정의한다. 이를 통해 단순한 노드 목록이 아니라 **인과 그래프** — 어떤 특징이 어떤 특징을 통해 최종 출력에 영향을 주는지 — 가 만들어진다.

---

## 회로를 그림으로 상상하기

```
[입력 토큰 임베딩]
    ↓
[레이어 0 SAE 특징들]
   f_0: "복수형 명사 감지" ——→ f_5: "복수 주어 신호 강화"
   f_1: "관계절 시작 감지" ——→ f_7: "주어 번호 보호"
    ↓                              ↓
[레이어 1 SAE 특징들]           [레이어 2 SAE 특징들]
   f_3: "절 경계 추적"              f_8: "복수 동사 선택"
    ↓
[최종 출력 로짓]
   "are" vs "is" 확률 차이
```

이 그림에서 각 노드(f_0, f_1, ...)가 인간이 이름 붙인 개념이고, 화살표가 IE를 통해 측정된 인과 영향이다. ACDC와의 차이: ACDC의 노드는 "어텐션 헤드 L2H3"처럼 해석 불가능한 부품인 반면, SFC의 노드는 "복수형 명사 감지 특징"처럼 의미가 있다.

---

## 파일 안내

본 섹션은 전체 그림만 다뤘다. 세부 내용:
- **05_method_b_sae_features.md**: SAE 구조와 특징 추출 원리
- **05_method_c_attribution.md**: IE, 어트리뷰션 패칭, 통합 기울기의 수식
- **05_method_d_circuit_eval.md**: 충실도(F)·완전도(C) 계산과 해석
- **05_method_e_shift.md**: SHIFT 편집 기법의 작동 원리

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **"neuron → SAE feature" 의 *transformation 의미*?**
2. **"SAE feature → circuit edge" 의 *aggregation 의미*?**
3. **2-step decomposition 의 *cumulative gain*?**

### 답변

1. **Polysemantic → Monosemantic mapping**. Raw neuron = "f_42 fires on `he`, `January`, `<code>`, `Mr.`" (4 concepts). SAE feature = "feature_12 fires only on `he`/`him`/`his`/`himself`" (1 concept). Transformation = *latent disentanglement* — superposition 에 압축된 concepts 를 *separately addressable* 변환.

2. **Causal connection identification**. SAE feature 만으로는 "feature_12 가 `he` 에 fires" 만 알 수 있음 (*descriptive*). Circuit edge = "feature_12 (L3) → feature_847 (L6) → answer" (*causal flow*). Aggregation = *single feature → flow path* 의 *temporal causation*.

3. **Multiplicative gain**. 단순 SAE: 1 feature 의 *isolated meaning*. 단순 circuit: head 의 *coarse function*. 결합: *(disentangled) feature × (causal) flow* = *fine-grained causal mechanism*. 1+1 > 2 — Marks 의 *core insight*.
