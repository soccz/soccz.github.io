# 5. 실험 해부 (a) — 그로킹 과제

> **배경 사다리**: ① "훈련 정확도"는 공부한 문제에서의 점수, "테스트 정확도"는 새 문제에서의 점수다. 그로킹 그림은 앞의 것이 먼저 100% 가 되고 뒤의 것이 한참 뒤에 오르는 모양이다. ② 이 절의 그림들은 모두 x축이 학습 스텝, y축이 정확도 또는 손실이다. 읽을 때 봐야 할 건 **곡선의 모양이 아니라 조건 간 차이**다.

---

## 데이터셋별 검토

### Modular arithmetic (modulo 113, 40% 훈련)

**어떤 데이터인가**: $a, b < 113$ 두 정수를 one-hot 으로 넣고 $y = a * b \bmod 113$ 을 맞히는 분류 문제. 클래스 수 113, 가능한 입력 쌍 $113^2 = 12{,}769$ 개 중 40% 인 약 5,108 개가 훈련.

**왜 이 데이터가 이 논문의 주장에 적합한가**: 세 가지 이유가 겹친다. ① 그로킹 문헌의 **표준 벤치마크**라 기존 결과와 직접 비교된다(Power 2022 → Nanda 2023 → 본 논문). ② 정답 규칙이 완전히 알려져 있어 "일반화했다"의 정의가 모호하지 않다. ③ one-hot 입력이라 **암기가 무료**여서 과적합 지점에 빨리 도달하고, 그 뒤 NLM 레짐이 길게 관찰된다.

**이 데이터 선택에 숨은 편향**: ③번이 바로 편향이기도 하다. §4.1 이 스스로 밝히듯, **입력 표현을 14차원 랜덤 이진 벡터로 바꾸면 그로킹이 사라진다**. 즉 이 벤치마크는 "그로킹이 일어나는 과제"가 아니라 "**그로킹이 일어나도록 표현을 고른 과제**"다. 저자들이 이 사실을 숨기지 않고 Figure 4(right)로 전면에 내놓는 것은 정직하지만, 동시에 이 논문 결론의 적용 범위를 스스로 좁힌다 — SC·NLM 이 문제가 되는 건 "암기가 무료인 표현" 레짐이라는 뜻이기 때문이다.

### Sparse parity (2000 샘플, 균등 분할)

**어떤 데이터인가**: 이진 벡터 입력에서 **정해진 소수의 비트만** XOR 한 값을 맞히는 과제. 랜덤 수준이 50% 인 이진 분류(Figure 4 캡션 명시).

**왜 적합한가**: modular arithmetic 과 **완전히 다른 대수 구조**를 가지면서도 그로킹이 관찰되는 과제다. 두 과제에서 같은 처방(StableMax)이 통하면 "modulo 113 에서만 되는 트릭"이라는 반박이 막힌다.

**숨은 편향**: sparse parity 는 이 레포가 2026-06-22 커버한 Merrill et al. 의 주 실험 과제이기도 하다. 즉 이 벤치마크 위에는 이미 "희소/조밀 부분망 경쟁"이라는 **경쟁 설명**이 올라와 있다. 본 논문은 그 설명과 자신의 설명이 어떻게 공존/충돌하는지를 정면으로 다루지 않는다 → 07 절 반박 지점.

### MNIST (200 샘플)

**어떤 데이터인가**: 손글씨 숫자 이미지 분류. 훈련을 200장으로 잘라냈다.

**왜 적합한가**: **대수적 구조가 없는** 실제 데이터에서도 같은 현상이 재현되는지 보는 장치다. 그로킹이 "알고리즘 과제만의 기현상"이라는 반박을 막는다(이 레포 2026-06-12 Omnigrok 이 개척한 논점).

**숨은 편향**: 200장은 MNIST 전체의 0.33% 다. 이 정도로 자르면 어떤 모델이든 즉시 완전 암기하므로, 다시 "암기 무료" 레짐이다. 세 데이터셋이 서로 다른 도메인에서 왔지만 **레짐 측면에서는 셋 다 같은 곳**에 있다. 도메인 다양성이 레짐 다양성으로 이어지지 않는다는 점은 짚어야 한다.

---

## 주요 그림 해석

### Figure 1 — 논문의 요약 그림

캡션 verbatim: "Our contributions demonstrated through results obtained in addition modulo 113 task. We show that the delay in generalization induced by NLM can be reversed using the proposed ⟂AdamW ((a) and (b)) and that the numerical errors that lead to overfitting instead of grokking can be avoided by using the proposed $\mathrm{StableMax}$ ((b) and (c))."

**해석**: 캡션이 두 기여를 **서로 다른 병리에 배정**한다는 데 주목해야 한다. ⟂AdamW 는 "지연(delay)"을 되돌리고, StableMax 는 "그로킹 대신 과적합으로 끝나게 만드는 수치 오류"를 피한다. 즉 저자들은 그로킹 실험의 실패를 **두 종류**로 나눈다 — 늦게 오는 것(NLM)과 아예 안 오는 것(SC). 이 구분이 논문 전체 구조를 결정한다.

### Figure 2 — 정밀도 대조 (가장 결정적인 그림)

캡션 verbatim: "As dataset size increases (subplots a to c), MLPs trained on modular addition begin to generalize without regularization until this is stopped by SC making the gradient from a large fraction of the samples equal to zero. This stopping point comes earlier for $\mathrm{float32}$ than $\mathrm{float64}$ and with small enough datasets it comes before the model makes any progress on test accuracy."

**해석 1**: 이 그림은 **2차원 실험 격자**다 — (데이터 크기 3수준) × (정밀도 2수준). 데이터 축만 있었다면 "데이터가 적어서 일반화 못 한다"는 평범한 결론이었을 것이다. 정밀도 축이 붙어야만 "정지 지점이 산술의 함수"라는 게 드러난다. **실험 설계의 승부처가 여기다.**

**해석 2**: "with small enough datasets it comes before the model makes any progress on test accuracy" — 이 조건절이 무섭다. 데이터가 충분히 작으면 SC 가 **테스트 정확도가 1%p 도 오르기 전에** 도착한다. 그러면 실험자는 완벽하게 평평한 곡선을 보게 되고, 이를 "이 설정에서는 그로킹이 없다"로 기록한다. **그로킹 문헌의 음성 결과(negative results) 중 일부는 이 함정에 걸린 것일 수 있다.**

**해석 3**: 동시에 이 그림은 논문의 주장을 **제한**하기도 한다. float64 로 바꿔도 정지는 결국 온다(더 늦게 올 뿐). 즉 SC 는 학습 정지의 **시점**을 정하는 요인이지, 정밀도만 올리면 무한히 학습되는 건 아니다.

### Figure 4 — StableMax 개입 결과 (3분할)

세 패널의 역할이 각각 다르다.

- **(left)**: 개입 효과. 동일 설정(40% modulo 113)에서 SCE 는 랜덤 수준에 갇히고 StCE 는 그로킹한다. → Claim 2 의 인과 고리.
- **(middle)**: **기존 이론에 대한 반례.** verbatim — "grokking induced without weight decay does not follow the commonly observed trend of rapidly decreasing weight norm during generalization." 노름 급감 없이 그로킹이 온다. 2026-06-12 Omnigrok 편과 나란히 읽어야 할 그림.
- **(right)**: **자기 결론의 범위 표시.** 입력 표현을 바꾸면 modular addition 이 "regular machine learning task" 가 되어 훈련·테스트 정확도가 나란히 오른다. 그로킹이 표현 선택의 산물임을 저자 스스로 명시.

### Figure 5 — NLM 정렬 측정

(a) bias 있는 MLP / (b) bias 없는 MLP / (c) 1층 트랜스포머의 파라미터 그룹별. 05_method_d 에서 다뤘으므로 여기서는 실험 설계 관점만 덧붙인다. **bias 유/무를 나란히 놓은 것은 이론의 구멍(동차성 가정)을 겨냥한 방어 실험**이다. 이론이 커버하는 건 (b)인데 (a)에서도 같은 정렬이 보인다면, 동차성은 편의적 가정이지 현상의 필수 조건이 아니라는 논거가 된다. 좋은 방어다. 다만 **정렬의 크기가 지연 시간의 얼마를 설명하는지**는 여전히 정량화되지 않는다.

### Figure 6 — ⟂Grad 효과

캡션 verbatim: "Comparing ⟂AdamW and ⟂SGD with baseline optimizers and AdamW with weight decay on (a) a transformer trained on subtraction mod 113 and (b) an MLP trained on addition modulo 113. In (c) we highlight the trade-off between L2 and SCE loss, initially SCE loss is reduced at the cost of increasing the L2 loss but eventually the two losses decrease simultaneously."

**해석**: 비교군 구성이 좋다 — 단순 baseline 뿐 아니라 **AdamW + weight decay**(= 현재 커뮤니티의 표준 그로킹 유도법)를 같이 놓는다. "우리 방법이 무처치보다 낫다"가 아니라 "**현행 최선의 처방보다 낫다**"를 주장할 수 있는 배치다. 본문 수치로 확인된 것은 **(a)에서 ⟂SGD 가 400 iteration 이내 100% 테스트 정확도** 도달.

**주의**: (a)는 subtraction, (b)는 addition 이다. 서로 다른 연산이므로 두 패널의 스텝 수를 직접 비교하면 안 된다.

---

## 지표 선택에 대한 검토

- 주 지표는 **테스트 정확도**와 **손실**이다. 그로킹은 정의상 "정확도의 시간적 분리"이므로 정확도가 자연스러운 선택이다.
- 다만 Appendix 목록에 "Studying Loss vs Accuracy in grokking learning curves"에 해당하는 절이 있다(Kumar 논문 쪽 부록 제목과 혼동하지 말 것 — 본 논문 Appendix 구성은 A~I 이며, 손실 대 정확도 논의의 소재는 본 실행에서 **부록 제목 수준으로만 확인**). 손실 곡선과 정확도 곡선이 다른 시점에 꺾인다는 것은 그로킹 문헌의 알려진 함정이고, SC 는 정확히 **손실 곡선을 신뢰할 수 없게 만드는** 요인이므로 이 구분은 본 논문에서 특히 중요하다.
- **다른 지표였다면 결론이 바뀌었을까**: 만약 주 지표가 "테스트 손실"이었다면 SC 의 영향이 더 극적으로 보였을 것이다(손실이 0 으로 붙으니까). 정확도를 주 지표로 쓴 것은 오히려 **보수적**인 선택이다.

## Ablation — 저자가 넣은 것과 넣지 않은 것

**넣은 것**: 정밀도(float32/64), 데이터 크기 3수준, 손실 함수(SCE/StCE), 옵티마이저(SGD/AdamW/⟂SGD/⟂AdamW/+weight decay), bias 유무, 입력 표현(one-hot vs 14차원 이진).

**넣지 않은 것 (본 실행 확인 범위)**:
- **모델 크기 sweep** — width 200 고정. SC 임계는 클래스 수·로짓 분포에 의존하므로 폭·깊이에 따라 달라질 수 있다.
- **StableMax 와 ⟂Grad 의 조합** — 둘을 동시에 켜면 어떻게 되는지. 증상과 원인을 동시에 막는 조건은 자연스러운 셀인데 주 결과에서 보이지 않는다.
- **클래스 수 의존성** — modulo $p$ 를 바꾸면 소프트맥스 분모의 항 수가 바뀌어 흡수 조건이 달라진다. $p$ sweep 은 SC 이론의 직접 검증이 될 수 있는데 확인되지 않는다.
