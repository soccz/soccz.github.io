# 10c 사고 확장 — 실험 아이디어 2개

> **🧒 한 줄 요약**: 내 *연구 아이디어*: TS-domain SAE, grokked + SAE, causal-loop SAE, multi-task circuit composition.


---

## 실험 아이디어 1: Grokking 국면 전환을 특징 회로 변화로 추적하기

### 가설

Grokking 국면 전환 (memorization phase → generalization phase) 은 단순한 "어텐션 헤드 회로 등장"이 아니라, **SAE 특징 회로의 질적 재구성**을 수반한다. 구체적으로:
- Memorization 단계: 훈련 데이터의 특정 입력-출력 쌍을 "암기"하는 특징들이 회로를 지배 → "패턴 X가 입력에 있으면 출력 Y" 형태의 특징
- Generalization 단계: 추상적 규칙을 인코딩하는 특징들이 회로를 지배 → "이 규칙이 성립하는가" 형태의 특징

이 전환이 특징 회로에서 어떻게 나타나는가?

### 데이터 & 설계

**모델**: 4~6층 Transformer, modular arithmetic (mod 97 덧셈) 과제 (Power 2022 설정 재사용)
- 입력: $(a, b, \_)$ → 출력: $(a + b) \mod 97$의 원-핫 레이블
- 데이터: 전체 $97 \times 97 = 9409$ 쌍 중 30~50% 훈련, 나머지 검증

**SAE 학습**: 각 훈련 체크포인트에서 MLP 레이어 활성화를 수집하고, 독립적으로 SAE 학습 (또는 단일 SAE를 모든 체크포인트에 적용 — 두 전략 비교)

**SFC 적용**: 각 체크포인트에서 동일한 행동 정의 (올바른 답 토큰의 로짓 vs 틀린 답) 에 대해 특징 회로 발견

**비교 조건**:
1. Memorization 단계 회로 (훈련 정확도 → 1, 검증 정확도 ≈ 0.5)
2. Generalization 단계 회로 (훈련 정확도 → 1, 검증 정확도 → 1)
3. 두 회로의 노드 집합의 Jaccard 유사도와 엣지 패턴 변화 측정

**예상 결과**:
- 회로 크기: Memorization 단계가 더 크다 (많은 특징이 데이터를 "외우기" 위해 관여)
- 회로 구성: Generalization 단계에서 Fourier 주파수 관련 특징(Nanda 2023이 예측)이 명시적으로 등장
- 충실도: Generalization 단계의 회로가 더 높은 F와 낮은 Comp를 보임 (더 "깔끔한" 구조)

**반증 조건**: 두 단계에서 특징 회로가 거의 동일하다면 — 회로 변화 없이 Grokking이 일어난다는 주장이 되며, 특징 해상도에서 Grokking은 어텐션 헤드 수준에서만 포착 가능하다는 결론.

**비용 추정**:
- SAE 학습: 4층 Transformer 크기에서 레이어당 SAE 1개, 여러 체크포인트 → 약 10~20 GPU 시간
- SFC 발견: 체크포인트당 IE 계산 (AP 근사 사용 시 빠름) → 약 1~2 GPU 시간/체크포인트 × 10체크포인트 = 10~20 GPU 시간
- 총 추정: 20~40 GPU 시간. 실현 가능한 규모.

---

## 실험 아이디어 2: 시계열 예측 Transformer에서의 행동 정의와 SFC 적용

### 가설

시계열 예측 Transformer (예: PatchTST나 소형 Vanilla Transformer)에서도 SAE를 적용하면 의미있는 특징들이 추출된다. 구체적으로:
- "현재 스텝이 상승 추세 중에 있다"를 인식하는 특징
- "이 시계열이 주기적이다"를 인식하는 특징
- "이전 K스텝 평균이 현재보다 낮다" 같은 간단한 통계적 특징

그리고 이 특징들로 구성된 회로가 "예측 오차가 큰 경우 vs 작은 경우"를 구분하는 행동을 설명할 수 있다.

### 데이터 & 설계

**모델**: 4층 소형 Transformer, ETT-mini 데이터셋 (Electricity Transformer Temperature, 1시간 단위) + 합성 주기 시계열 (sine wave + noise)
- 예측 지평: 96스텝
- 행동 정의 (2가지 후보):
  - (A) 방향 행동: 다음 스텝이 올라가는가 내려가는가 (이진)
  - (B) 오차 행동: 이 입력 윈도우에서 예측 MSE가 상위 25%에 속하는가 (하위 75% vs 상위 25%)

**비교 조건**:
1. (A)와 (B) 중 어느 행동 정의가 더 의미있는 SFC를 만들어내는가 (F/Comp로 판단)
2. 합성 데이터 (알려진 구조) vs 실제 데이터 (ETT) 에서 SAE 특징의 해석가능성 비교
3. Patch 단위 SAE (각 patch의 임베딩에 SAE 적용) vs 레이어별 residual stream SAE

**예상 결과**:
- 행동 정의 (B)가 더 명확한 회로를 만들어냄: "예측이 어려운 입력"에는 "분포 이동을 감지하는 특징", "주기성이 깨지는 특징"이 회로에 포함될 것.
- 합성 데이터에서 "주파수 감지 특징"이 SAE에서 명시적으로 추출됨을 확인.

**반증 조건**: 시계열 Transformer에서 SAE 특징들이 인간이 이름 붙이기 어려운 고차원 통계 패턴만 캡처하고, 의미있는 개념(추세, 주기성)에 대응하지 않는다면 — "언어 모델에서의 특징 해석가능성이 시계열 Transformer로 전이되지 않는다"는 부정적 결론.

**비용 추정**:
- 소형 Transformer 훈련: 4층, ETT-mini → 2~4 GPU 시간
- SAE 학습: 레이어당 1개 × 4레이어 × 2 데이터셋 = 약 4~8 GPU 시간
- SFC 발견: 행동 정의별 × 비교 조건 → 약 10~15 GPU 시간
- 총 추정: 20~30 GPU 시간. 주말 실험으로 실행 가능.

**이 실험이 내 연구에서 하는 역할**: APF의 mech-interp 툴링 → SFC 이식 가능성 검증의 선행 실험. APF 논문의 "향후 작업" 섹션에 이 실험 결과를 포함하거나, Grokking track의 회로 분석 방법론 기반으로 활용.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **TS-domain SAE 의 *unique challenge* (no token boundary)?**
2. **Grokked + SAE 의 *feature emergence trajectory* 추적?**
3. **Causal-loop SAE (cross-attention) 의 *mechanistic implication*?**

### 답변

1. **Token boundary 부재**. TS Transformer 의 input = continuous values, not discrete tokens. SAE feature 의 *activation pattern* 이 *continuous attribute* (e.g., "uptrend", "high volatility") 형태 — *categorical concept 와 다른 nature*. → *feature visualization* 의 *protocol 재정의* 필요.

2. **Phase-conditional feature**. Grokking 의 4 phases (random / memorize / transition / grokked) 각각의 SAE 적용. *Phase transition* 시 *어느 feature 가 emerge / disappear* 추적 → *circuit formation trajectory* 의 *temporal map*. → grokking 의 *mechanistic explanation* upgrade.

3. **Cross-attention 의 SAE**. Encoder-decoder 의 cross-attn = *2-stream interaction*. SAE 적용 시 *cross-modal feature* (e.g., "source token X ↔ target token Y") 식별. → Translation, multi-modal 의 *causal mechanism* 분석.
