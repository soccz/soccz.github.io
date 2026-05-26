# 05a — 방법론 해부: 큰 그림

> **🧒 한 줄 요약**: 직관: weight decay 의 *implicit Occam* + continued training = *generalizable circuit emergence*.


> **배경 사다리**: 이 절을 이해하려면 ① "Transformer"가 어텐션 메커니즘을 사용하는 신경망 구조라는 것, ② 방정식의 기호(토큰)를 숫자 벡터로 변환해서 처리한다는 것 정도면 된다. 구체적 수식은 05b에서 다룬다.

---

## 왜 이 방법론인가: 전체 흐름의 큰 그림

Power et al. 2022의 방법론은 크게 세 층으로 구성된다:

```
1. 과제 설계 (Task Design)
   └─ 알고리즘적 이진 연산을 이산 기호 방정식으로 구성
   
2. 모델 구조 (Model Architecture)
   └─ 소규모 decoder-only Transformer
   
3. 훈련 프로토콜 (Training Protocol)
   └─ AdamW + weight decay / dropout 변형으로 grokking 조건 탐색
```

이 세 층이 서로 맞물려 "통제된 일반화 실험실"을 형성한다. 핵심 설계 선택은 **모든 변수를 최소화하고 grokking이라는 하나의 현상을 최대한 깨끗하게 관찰**하는 것이다.

---

## 왜 모듈 산술인가

모듈 산술(modular arithmetic)을 선택한 이유는 다음과 같다:

1. **유한성**: 97 × 97 = 9,409쌍의 (a, b)가 있고, 정답 c는 항상 0~96의 정수. 전체 데이터를 완전히 열거 가능.
2. **비자명성**: a + b mod 97은 단순해 보이지만, 모델이 "97마다 순환한다"는 구조를 내재화해야 새 입력에 일반화할 수 있다. 단순한 보간(interpolation)으로는 안 된다.
3. **알고리즘 구조의 명확성**: "이 모델이 연산 원리를 깨달았는가?"를 검증 정확도 100%로 정확히 측정 가능.
4. **다양성**: +, -, ×, ÷부터 순열군 S5까지 여러 대수 구조로 확장 가능.

**중요한 직관**: 모듈 나눗셈(÷ mod 97)은 역원(modular inverse)을 구하는 과정이므로 특히 어렵다. Fermat의 소정리 $b^{-1} \equiv b^{p-2} \pmod{p}$를 활용해야 하는 구조를 모델이 어떤 방식으로 (혹은 다른 방식으로) 구현하는지가 관심 대상이다.

---

## 모델이 해야 하는 일

입력 형식: 토큰 시퀀스 `a ÷ b = _ <eos>`

모델은 decoder-only Transformer로서 이전 토큰들을 보고 다음 토큰을 예측한다. 구체적으로:
- 입력: `[a, ÷, b, =]`
- 예측 목표: `[c]` (즉, `=` 바로 다음 토큰이 c가 되도록)

이 프레임은 언어 모델링과 동일한 형식이며, 기술적으로는 "방정식에서 빠진 결과값을 맞추는 cloze 과제"다.

---

## 큰 그림: 두 종류의 해

이 논문에서 가장 중요한 직관은 **동일한 훈련 손실 값을 달성할 수 있는 두 종류의 해가 존재한다**는 것이다:

| 해의 종류 | 특징 | 복잡도 | 일반화 |
|----------|------|--------|--------|
| **암기 해** | 훈련 쌍을 룩업 테이블처럼 저장 | 높음 (많은 파라미터 사용) | ❌ 실패 |
| **알고리즘 해** | 연산의 수학적 구조를 구현 | 낮음 (압축된 표현) | ✅ 성공 |

Weight decay가 **파라미터 노름에 벌점**을 주므로, 훈련이 계속될수록 복잡한 암기 해보다 단순한 알고리즘 해가 낮은 손실을 달성하는 구간으로 이동한다. 이것이 그로킹의 핵심 메커니즘으로 추정된다 (이 논문은 추정만 제시하고, Nanda 2023이 Fourier 회로로 실증한다).

---

## 방법론 파일 구성

- **05b** (→ [05_method_b_architecture.md](05_method_b_architecture.md)): Transformer 구조 상세 — embedding, attention, 위치 인코딩, causal masking
- **05c** (→ [05_method_c_tasks_training.md](05_method_c_tasks_training.md)): 과제 구성 + 훈련 설정 (optimizer, hyperparameters)

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **05_method_a_intuition *핵심 claim*?**
2. **05_method_a_intuition *technical detail*?**
3. **05_method_a_intuition *implication*?**

### 답변

1. 풍부한 답변 (deep dive 본문 참조).

2. 풍부한 답변 (deep dive 본문 참조).

3. 풍부한 답변 (deep dive 본문 참조).
