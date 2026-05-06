# 05c — 방법론: 두 회로의 경쟁 메커니즘

> **이 파일은 [05_method_b_tasks.md](05_method_b_tasks.md)에서 이어집니다.** 배경 사다리: ① "회로(circuit)"가 뉴럴 네트워크에서 특정 기능을 수행하는 뉴런·어텐션 헤드·레이어의 서브집합임, ② "L2 정규화(weight decay)"가 가중치의 크기를 작게 만드는 제약임을 알면 된다.

---

## 왜 두 회로가 공존하는가

모델이 훈련 데이터를 학습하는 방법은 유일하지 않다. Composition 태스크에서 "민준이 → 스니커즈"를 학습하는 두 가지 방식이 존재한다:

### 방식 A: 암기 회로 $\mathcal{C}_\text{mem}$ (Memorizing Circuit)

"민준이 → 스니커즈"라는 쌍을 직접 key-value 형태로 저장. 마치 사전처럼, 모든 인퍼드 팩트를 개별적으로 기억하는 방식.

**특성**:
- **빨리 학습됨**: 경사하강법에서 단순 패턴 암기가 먼저 일어난다 (neural network의 "spectral bias").
- **파라미터 비효율**: 인퍼드 팩트가 $N$개라면 대략 $O(N)$ 파라미터가 필요.
- **일반화 불가**: 훈련에 없는 쿼리에 대한 답이 없다.

### 방식 B: 일반화 회로 $\mathcal{C}_\text{gen}$ (Generalizing Circuit)

원자적 사실 두 개를 연결하는 알고리즘을 학습. 마치 "민준이 스포츠 찾기" → "그 스포츠의 용품 찾기"를 순차 실행하는 규칙.

**특성**:
- **느리게 학습됨**: 더 복잡한 알고리즘이므로 학습에 시간이 걸린다.
- **파라미터 효율**: 원자 사실의 수에 비례하는 파라미터로 모든 조합을 처리. $O(|\mathcal{E}| + |\mathcal{R}|)$ 수준.
- **일반화 가능**: 원자 사실이 있는 한 새로운 조합에도 적용.

---

## 경쟁 역학: Weight Decay가 심판이다

훈련 목적함수:
$$\mathcal{L}(\theta) = \mathcal{L}_\text{CE}(\theta) + \lambda \|\theta\|_2^2$$

초반엔 $\mathcal{C}_\text{mem}$이 $\mathcal{L}_\text{CE}$를 빠르게 낮춘다 → 훈련 정확도 100% 도달.

그런데 weight decay 항 $\lambda \|\theta\|_2^2$은 계속 작용한다. $\mathcal{C}_\text{mem}$은 파라미터가 많으므로 $\|\theta_\text{mem}\|_2^2$가 크다. $\mathcal{C}_\text{gen}$은 파라미터 효율적이므로 $\|\theta_\text{gen}\|_2^2$가 작다.

따라서 충분한 훈련이 계속되면:

$$\mathcal{L}(\theta_\text{gen}) = \mathcal{L}_\text{CE}(\theta_\text{gen}) + \lambda \|\theta_\text{gen}\|_2^2 < \mathcal{L}(\theta_\text{mem}) = \mathcal{L}_\text{CE}(\theta_\text{mem}) + \lambda \|\theta_\text{mem}\|_2^2$$

이 시점부터 경사하강법이 $\mathcal{C}_\text{gen}$ 쪽으로 이동하기 시작한다. Grokking은 $\mathcal{C}_\text{gen}$이 훈련 정확도에도 기여하기 시작하는 전환점이다.

---

## 레이어별 역할 분담

Logit lens 분석에서 확인된 구조:

### Composition에서의 레이어별 역할

**레이어 1~4 (하위)**: "첫 번째 hop" 원자 사실 검색.
- "민준이" 토큰의 representation이 이 구간에서 "농구"에 해당하는 의미를 갖게 됨.
- Logit lens에서 `h^(3)` 정도에서 이미 "농구"가 높은 확률로 예측됨.

**레이어 5~8 (상위)**: "두 번째 hop" 계산 및 최종 답 생성.
- "농구"를 받아 "스니커즈"로 변환하는 연산이 이 구간에서 이루어짐.
- Grokking **이전**: 이 구간에서 정답 "스니커즈"가 나타나지 않음 ($\mathcal{C}_\text{mem}$은 직접 답을 검색하므로 중간 hop이 없음).
- Grokking **이후**: 이 구간에서 점진적으로 "스니커즈"의 확률이 높아짐 ($\mathcal{C}_\text{gen}$ 형성).

이것이 grokking의 내부에서 일어나는 일이다: **상위 레이어에 두 번째 hop 회로가 새로 형성된다.**

### Composition $\mathcal{C}_\text{gen}$의 구조 (추정)

```
[입력] (민준, r1∘r2, ?)
   ↓ 하위 레이어
[중간] h^(4) ≈ representation of "농구" (first hop result)
   ↓ 상위 레이어
[출력] h^(8) ≈ representation of "스니커즈" (second hop result)
```

이 구조가 OOD에서 실패하는 이유: OOD 엔티티(훈련 때 인퍼드 팩트로 등장 안 한 엔티티)의 경우, 하위 레이어에서 "first hop 결과"를 얻지만 상위 레이어가 그 결과에 대한 "second hop 경로"를 내부에 갖고 있지 않다. 비순환 구조이므로 하위 레이어로 돌아가 새 first hop을 다시 실행할 수 없다.

---

## 두 회로의 공존 증거

Grokking 이후에도 $\mathcal{C}_\text{mem}$이 완전히 사라지지 않는다는 증거:

- **Activation patching**: $\mathcal{C}_\text{gen}$ 경로를 차단해도 모델이 일부 훈련 데이터는 맞힌다 (= $\mathcal{C}_\text{mem}$ 잔존).
- **Weight norm 분석**: Grokking 이후 weight norm이 감소하지만 제로로 수렴하지는 않는다.

이는 Nanda et al. (2023)의 "cleanup phase" — 암기 회로가 점진적으로 제거되는 단계 — 와 일치한다. 단, 본 논문의 KG 태스크에서는 cleanup이 모듈 산술보다 느리게 진행된다.

---

## 핵심 한 문장 요약

> Grokking = 암기 회로($\mathcal{C}_\text{mem}$)의 파라미터 비효율성이 weight decay에 의해 불이익을 받는 동안, 파라미터 효율적인 일반화 회로($\mathcal{C}_\text{gen}$)가 점진적으로 상위 레이어에 형성되어 결국 지배권을 획득하는 과정이다.

**→ Logit Lens와 Causal Tracing의 구체적 적용은 [05_method_d_analysis.md](05_method_d_analysis.md)에서 계속.**
