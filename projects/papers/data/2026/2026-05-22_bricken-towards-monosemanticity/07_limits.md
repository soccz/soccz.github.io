# 6. 가정·한계·반박

> **🧒 한 줄 요약**: 5 주요 한계: 1-layer only, λ empirical magic, dead features, seed non-uniqueness, monosemanticity 의 incomplete 87%.


---

## 명시된 가정 (논문이 대놓고 말한 것)

**§Limitations에서 저자들이 직접 인정한 것** (원문 §Limitations — 명시 섹션 존재):

1. **규모 제한 (Scale Limitation)**: 1-layer transformer에서만 실험. 대형 모델(수십~수백억 파라미터)에서 동일한 방법이 작동하는지 불명확. 저자들은 이것을 "중요한 미래 연구 방향"으로 제시.

2. **완전성 불명확 (Completeness)**: SAE가 모든 중요한 특징을 포착했다는 보장이 없다. 35%의 설명 안 된 분산(≥65% explained의 이면)에 중요한 특징이 숨어 있을 수 있다.

3. **고유성 부재 (Non-Uniqueness)**: SAE가 찾는 특징 사전이 유일하지 않다. 다른 초기화나 다른 $\lambda$ 값에서 출발하면 다른 특징 집합이 나올 수 있다. 어떤 것이 "진짜" 특징인가?

4. **계산 비용 (Computational Cost)**: 충분히 큰 딕셔너리의 SAE를 훈련하는 것은 비용이 크며, 대형 모델 스케일에서는 더욱 그렇다.

---

## 암묵적 가정 (말 안 했지만 깔려 있는 것)

**암묵적 가정 1 — 1-layer transformer가 대형 모델의 대표 사례다**:
저자들은 1-layer 실험 결과를 전체 언어 모델 해석가능성 문제의 해법으로 제시한다. 하지만 1-layer와 100-layer 모델의 내부 표현은 질적으로 다를 수 있다 — 깊은 모델에서는 층 간 상호작용이 복잡해지며, 단순히 층별로 SAE를 적용하는 것이 전체 계산을 포착할 수 없다.

**암묵적 가정 2 — MLP post-ReLU 활성화가 "의미 있는" 표현을 담는 공간이다**:
SAE를 MLP post-ReLU에 적용하는 것은 그곳이 의미론적 특징이 집중된 곳이라는 가정이다. 하지만 언어 모델의 잔차 연결(residual stream), 어텐션 head 출력, 레이어 정규화 전/후 등 다른 위치에도 중요한 표현이 있을 수 있다. post-ReLU 선택이 최적인지는 체계적으로 비교하지 않았다.

**암묵적 가정 3 — "해석 가능한" 특징이 곧 "기능적으로 중요한" 특징이다**:
인간이 해석 가능한 특징이 모델의 중요한 계산 경로를 담는다는 가정. 하지만 모델은 인간에게 해석 불가능하지만 기능적으로 중요한 특징도 가질 수 있다. SAE가 해석 가능한 특징을 찾는 것을 최적화하면, 해석 불가능하지만 중요한 특징을 놓칠 수 있다.

---

## 반박 가능한 지점

### 반박 1 — L1 페널티가 "진짜" 특징이 아닌 인위적 분해를 강요한다

**핵심 주장**: L1 희박성 페널티는 단지 수학적 편의를 위한 것이지, 실제 신경망이 슈퍼포지션을 인코딩하는 방식을 반영하지 않는다. 모델이 실제로는 비희박하고 분산된 표현을 사용하는데, SAE가 인위적으로 그것을 희박하게 조각낸 것일 수 있다.

**실험적 반증 방법**: (a) 여러 다른 희박성 수준(다양한 $\lambda$)에서 특징 구조가 일관되는지 테스트. (b) 인과 중요성이 더 높은 특징들이 더 희박하게 활성화되는지 상관관계 분석. (c) 재구성 손실과 해석가능성 점수 간의 Pareto frontier 분석.

### 반박 2 — "단의미성"은 인간의 개념 범주 투영일 뿐이다

**핵심 주장**: "DNA 특징"이라는 이름 자체가 인간의 생물학 개념을 모델에 투영한 것이다. 모델은 실제로 DNA/히브리어/법률 같은 범주로 세상을 분류하지 않고, 더 기하학적이고 통계적인 방식으로 작동할 수 있다. 우리가 찾는 "단의미성"은 모델의 진짜 내부 구조가 아닌 인간 해석의 산물일 수 있다.

**실험적 반증 방법**: (a) 서로 다른 문화권/언어 배경을 가진 평가자들에게 같은 특징을 평가시켜서 해석의 문화 의존성 측정. (b) 동일한 특징에 대해 프로그래머, 의사, 언어학자가 다른 해석을 내리는지 비교. (c) 모델이 DNA 서열 생성 과제를 할 때 활성화되는 특징이 "DNA 특징"과 반드시 일치하는지 검증.

---

## 재현성 평가

**코드 공개**: transformer-circuits.pub에 코드와 인터랙티브 데모 존재 (이 환경에서 원문 직접 확인 불가).

**재현에 필요한 미보고 세부사항**:
- 훈련 데이터 정확한 구성 및 크기
- SAE 훈련에 쓰인 총 computation (GPU-시간)
- 죽은 특징(dead features) 처리 구체 방법
- 인간 평가자 수, 평가 지침 전문
- AutoInterp에 쓰인 Claude 모델 버전 및 프롬프트

**분산 보고**: 평균값만 보고됐는지, 아니면 분산/신뢰구간도 보고됐는지 — [원문에 수치 미보고]

**재현 예상 난이도**: 중~고. SAE 훈련 자체는 비교적 표준적인 코드로 구현 가능하지만, 1-layer transformer 자체를 훈련하는 코드와 정확한 tokenization, 특징 평가 파이프라인을 모두 재구현하려면 상당한 엔지니어링이 필요.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **1-layer toy 의 *multi-layer generalization* 의문?**
2. **λ 의 *empirical magic* 의 first-principle 부재?**
3. **SAE non-uniqueness 의 *practical impact*?**

### 답변

1. **Layer interaction 의 *unsolved***. 1-layer = no inter-layer feature flow. 12-layer = *layer-wise feature evolution* + *cross-layer interaction*. *Layer 4 feature* 와 *Layer 8 feature* 의 *relationship* 미연구. Templeton 2024 의 *cross-layer SAE* 가 *partial answer* 하지만 *fundamental answer* 미존재.

2. **Theory 부재**. λ=1e-3 = grid search + visual inspection. *Information-theoretic foundation* (MDL, MIC) 부재. *Bayesian prior 의 strength* 의 *first-principle choice* 미존재. → *field 의 open problem* 으로 인정 — 본 deep dive §18 self_critique 에서 명시.

3. **Per-SAE re-identification overhead**. Practical: "*feature_12 = he*" 가 *specific SAE 의 specific index*. Re-train SAE → index 변경 → 모든 downstream tool (steering, ablation) 의 *재설정 필요*. Production: *fixed SAE* 사용 + *frozen index* — but *re-training cost*. *Engineering overhead*.
