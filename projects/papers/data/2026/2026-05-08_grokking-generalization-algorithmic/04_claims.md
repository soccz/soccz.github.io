# 04 — 핵심 Claim 해체

> **🧒 한 줄 요약**: 4 claims: (1) grokking 실재, (2) modular arithmetic platform, (3) weight decay critical, (4) phase transition.


> **배경 사다리**: 이 절을 이해하려면 ① 훈련 정확도(training accuracy)와 검증 정확도(validation/test accuracy)가 다를 수 있다는 것, ② weight decay(가중치 감쇠)가 큰 파라미터에 벌점을 주어 작은 파라미터 값을 선호하게 만드는 정규화 기법이라는 것, ③ 위상 전이(phase transition)가 연속적 변화 대신 갑작스러운 상태 변화를 뜻한다는 것 정도면 충분하다.

---

## Claim 1 — Grokking: 완벽한 암기 이후 지연된 일반화

**주장 (한 문장)**:  
소규모 알고리즘 데이터셋에서 훈련한 신경망은 훈련 정확도가 100%에 도달한 **훨씬 뒤에** 검증 정확도도 100%에 도달하는 지연 일반화를 보일 수 있다.

**증거 (원문 기준)**:  
모듈 나눗셈 (a ÷ b mod 97, 50% 훈련 분할) 실험에서 훈련 정확도는 $<10^3$ 스텝에 100%에 근접하지만, 검증 정확도는 $\sim 10^6$ 스텝 이후에야 100%에 근접한다 (웹 검색 스니펫에서 원문 직접 인용: "training accuracy becomes close to perfect at < 10³ optimization steps, but it takes close to 10⁶ steps for validation accuracy to reach that level, with very little evidence of any generalization until 10⁵ steps").

**숨은 전제 1**: 모델이 "암기"와 "이해"라는 두 가지 서로 다른 해(solution)를 학습할 수 있다는 것, 즉 훈련 데이터를 완전히 외우는 것과 과제의 알고리즘적 구조를 포착하는 것이 별개의 내부 표현에 해당한다는 가정.

**숨은 전제 2**: 실험이 암기 단계에서 훈련을 멈추지 않고 수백만 스텝 동안 계속 진행된다는 것. 대부분의 실용적 훈련 루틴은 검증 손실 기준 조기 종료(early stopping)를 사용하므로, 표준 관행에서는 이 현상을 놓친다.

**쉬운 말 풀이**:  
"책 전체를 달달 외운 학생이 오랫동안 시험을 못 보다가, 어느 날 갑자기 '아, 이런 원리였구나!'하고 깨달아서 시험을 완벽하게 보는 것." 핵심은 이 깨달음이 '외우기 완료' 직후가 아니라 한참 뒤에 온다는 점이다.

---

## Claim 2 — Weight Decay가 그로킹을 가속한다

**주장 (한 문장)**:  
Weight decay의 크기를 늘리면 완벽한 일반화에 도달하는 데 필요한 최적화 스텝 수가 극적으로 줄어든다.

**증거**:  
원문 직접 인용 (웹 검색 스니펫): "Generalization appears much earlier once they lower the effective decoder capacity with weight decay." 또한: "weight decay is particularly effective at improving generalization on the tasks studied."

**숨은 전제**:  
Weight decay가 일반화를 돕는 메커니즘이 "단순히 과적합을 막는 것"이 아니라 "더 단순하고 알고리즘적인 해로 수렴을 유도하는 것"이라는 주장이다. 하지만 이 논문은 **왜** 그런지 메커니즘을 제시하지 않는다. 이 "왜"는 Nanda 2023이 Fourier 회로 분석으로 일부 답한다.

**대안적 해석 (반박 가능성)**:  
Weight decay가 단순히 파라미터를 작게 유지해 함수 복잡도를 낮추는 것이라면, 이는 표준 regularization 이론으로 충분히 설명된다. 그로킹이 특별한 현상인지, 아니면 L2 정규화의 잘 알려진 효과인지가 논쟁거리다.

**쉬운 말 풀이**:  
"자꾸 외우려는 습관에 벌점을 주면, 어쩔 수 없이 진짜 원리를 빨리 파악하게 된다." Weight decay는 불필요하게 큰 파라미터에 벌점을 주므로, 모델이 "복잡한 암기"보다 "단순한 알고리즘"을 더 선호하게 된다.

---

## Claim 3 — 4구역 위상 다이어그램

**주장 (한 문장)**:  
(훈련 데이터 비율 × weight decay 강도) 평면은 4가지 서로 다른 학습 결과 구역으로 분할된다: 이해(comprehension), 그로킹(grokking), 암기(memorization), 혼돈(confusion).

**증거**:  
원문 직접 인용 (Liu 2022 인용 스니펫): "Both comprehension and grokking are able to generalize in the 'Goldilocks zone,' although the grokking phase has delayed generalization. Memorization is also called overfitting, and confusion means failure to even memorize training data."

**각 구역의 정의**:
- **이해(Comprehension)**: 훈련 정확도와 검증 정확도가 거의 동시에 완벽해짐. 충분한 데이터 + 강한 정규화.
- **그로킹(Grokking)**: 훈련 정확도는 빠르게 완벽해지지만 검증은 수십만~수백만 스텝 뒤에야 따라옴. 제한된 데이터 + 중간 정규화 조합의 "골디락스 존".
- **암기(Memorization)**: 훈련 정확도는 100%이지만 검증은 영원히 올라오지 않음.
- **혼돈(Confusion)**: 훈련 정확도조차 100%에 도달하지 못함.

**숨은 전제**:  
이 위상 경계가 명확하고 재현 가능하다는 것. 실제로는 경계가 fuzzy하고 초기화(random seed)에 따라 달라질 수 있다.

**쉬운 말 풀이**:  
"수학 공부 결과는 공부한 양(데이터 비율)과 어려운 문제 선호도(weight decay)에 따라 네 가지로 나뉜다: 완전 이해, 늦게 깨달음(그로킹), 영원히 못 깨달음, 아무것도 못 배움."

---

## Claim 4 — 데이터 크기와 일반화 시간의 관계

**주장 (한 문장)**:  
훈련 데이터 비율이 줄어들수록 완벽한 일반화에 도달하는 데 필요한 최적화 스텝 수가 기하급수적으로 증가한다.

**증거**:  
원문 직접 인용 (웹 검색 스니펫): "smaller datasets require increasing amounts of optimization for generalization."

**중요성**:  
이 발견은 그로킹이 단순한 "더 많이 훈련하면 된다"의 문제가 아니라, 데이터 효율성과 연결된 현상임을 시사한다. 데이터가 아주 적으면 사실상 무한한 훈련 시간이 필요해 실용적 의미의 그로킹은 불가능해진다.

**숨은 전제**:  
훈련 스텝 수가 충분히 길면 언제든 일반화가 온다는 가정. 이것이 실제로 항상 성립하는지, 일부 세팅에서는 일반화가 영원히 오지 않는지는 이 논문에서 명확히 검증되지 않는다.

**쉬운 말 풀이**:  
"문제집 페이지가 줄어들수록 원리를 깨닫는 데 필요한 연습 횟수가 폭발적으로 늘어난다."

---

## Claim 간 관계 요약

```
Claim 1 (현상 존재)
       ↓
Claim 4 (데이터 크기 → 지연 시간)  
Claim 2 (weight decay → 가속)
       ↓
Claim 3 (2D 위상 다이어그램으로 통합)
```

4가지 Claim은 독립적이 아니라, Claim 1의 현상을 조건 변수로 분해한 것이 Claim 2·4이고, Claim 3은 그 통합 지도다.

이 구조는 탐색적 연구(exploratory research)의 전형적인 형태다: 현상 발견 → 조건 변수 식별 → 조건 공간 지도화. 메커니즘 설명은 의도적으로 후속 연구에 위임한다.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **04_claims *핵심 claim*?**
2. **04_claims *technical detail*?**
3. **04_claims *implication*?**

### 답변

1. 풍부한 답변 (deep dive 본문 참조).

2. 풍부한 답변 (deep dive 본문 참조).

3. 풍부한 답변 (deep dive 본문 참조).
