# 3. 핵심 Claim 해체 (b) — Naïve Loss Minimization

> **배경 사다리**: ① 신경망의 출력 점수(logit)는 **크기**와 **방향**으로 나눠 볼 수 있다. 어느 클래스를 고를지는 점수들의 **상대적 순서**만 정하지, 전체를 몇 배로 키웠는지는 예측을 바꾸지 않는다. ② 그런데 교차엔트로피 손실은 전체를 키우기만 해도 계속 줄어든다. 이 어긋남이 NLM 의 씨앗이다.

---

## Claim 3 — 과적합 이후 기울기는 "예측을 바꾸지 않고 손실만 줄이는" 방향(NLM)과 강하게 정렬된다

**주장 (한 문장)**: 훈련 데이터를 다 맞힌 뒤 모델이 하는 일의 상당 부분은 학습이 아니라 **로짓 스케일 키우기**이며, 이것이 일반화 지연의 원인이자 결국 SC 를 부르는 경로다.

**증거 (원문 위치)**:
- **§4.2 "Naïve loss minimization"** — Definition 5. 방향 $d_{nlm}(\theta)$ 가 다음을 만족하면 NLM 이다:
  - 식 **(8)**: $\mathcal{L}(f(\theta + d_{nlm}(\theta), \cdot)) < \mathcal{L}(f(\theta, \cdot))$ — 손실은 줄고,
  - 식 **(9)**: $f(\theta + d_{nlm}(\theta), x) = c\, f(\theta, x),\ \forall x \in \mathcal{X}$ (단 $c > 1$) — 모든 입력에 대해 출력이 **상수배**로만 바뀐다.
- **Definition 6 (positive homogeneity)**, 식 **(10)**: $f(c\theta, x) = c^{L} f(\theta, x)$, $c>0$ — 동차 모델에서는 가중치를 반경 방향으로 키우는 것이 곧 출력 스케일링이다.
- **Figure 5** 캡션 verbatim: "MLPs with (a) and without (b) bias terms trained on modular addition receive updates that are significantly aligned with the direction of NLM beyond the point of overfitting. In (c) we show these results for a selection of parameters for our one layer transformer. We highlight the embed and unembed matrices as well as the weights of the MLP. These are highlighted in the plot using the notation from [Elhage et al. 2021]."
- **초록 verbatim**: "beyond the point of overfitting, the gradients strongly align with what we call the naïve loss minimization (NLM) direction. This component of the gradient does not alter the model's predictions but decreases the loss by scaling the logits, typically by scaling the weights along their current direction."

**숨은 전제**:
1. **동차성(homogeneity)**. 식 (10)이 성립해야 "가중치 반경 방향 = 로짓 스케일링"이라는 등식이 깔끔하다. §7 이 자인하듯 저자들의 NLM 분석은 **동차 또는 근사 동차 모델**에 한정되며, skip connection·bias 를 가진 모델의 형식적 특성화는 미해결로 남긴다. Figure 5(a)(b)가 bias 유/무를 나란히 보여주는 건 이 취약점을 경험적으로 방어하려는 장치로 읽힌다.
2. **정렬(alignment)의 크기가 인과의 크기와 비례한다**는 암묵적 가정. Figure 5 는 코사인 정렬이 유의하게 높다는 것을 보이지만, 정렬이 높다고 해서 그 성분이 **지연 시간의 대부분을 설명한다**는 정량 분해는 본 실행에서 확인한 범위에 없다. → 이 레포가 2026-08-14 Hase 편에서 배운 교훈($R^2$ 증분으로 분해하기 전에는 "상관"에 불과)이 여기에도 적용된다.
3. NLM 은 **손실 함수의 성질**이지 데이터의 성질이 아니다. 따라서 이 메커니즘은 CE 를 쓰는 모든 분류 학습에 잠재하고, 그로킹 과제는 그것이 **관측 가능해지는** 특수 조건일 뿐이라는 게 저자들의 그림이다.

**쉬운 말 풀이**: 시험에서 정답을 이미 다 맞힌 학생이 점수를 더 올리려고 답안지에 "확실함!!!"을 크게 여러 번 쓰는 것과 같다. 채점 규칙이 자신감에도 점수를 주면, 학생은 새 내용을 공부하는 대신 자신감만 키운다. 성적표(손실)는 계속 좋아지는데 실력은 그대로다. 그러다 자신감이 너무 커지면 채점기가 만점으로 반올림해 버리고(SC), 거기서 학생은 완전히 멈춘다.

---

## Claim 4 — 기존 그로킹 유도법 세 가지는 모두 NLM 축으로 통일 설명된다

**주장 (한 문장)**: weight decay, MSE 손실, 초기 가중치 스케일링이라는 서로 무관해 보이는 세 관찰은 "NLM 을 억제하는가/촉진하는가"라는 하나의 질문의 세 답변이다.

**증거 (원문 위치 — §5.2 "Explaining the success of existing methods for grokking")**:

1. **weight decay**. 저자 진술 verbatim(부분): "Since weight decay corresponds to pulling back the weights along this same direction at every step during training, it is unsurprising…that it is the most reliable way to induce grokking." — weight decay 는 가중치를 반경 방향으로 되당기므로 NLM 을 매 스텝 상쇄한다. **Figure 6(c)** 캡션은 이 줄다리기의 궤적을 보여준다: "initially SCE loss is reduced at the cost of increasing the L2 loss but eventually the two losses decrease simultaneously".
2. **MSE 손실**. verbatim: "When using MSE loss the logits can overshoot the target, meaning that larger logits often do not lead to a lower MSE loss. This explains why [prior works] observed grokking with MSE loss without regularization." — MSE 는 타깃을 지나치면 손실이 커지므로 식 (8)의 "손실이 줄어든다"가 깨진다. 즉 **MSE 에는 NLM 방향이 존재하지 않는다**.
3. **가중치 스케일 확대**. 초기 가중치를 키우면 NLM 이 쉬워져 일반화가 지연되지만, 그 뒤에 오는 SC 를 막으려면 정규화가 필요하다는 설명.

**왜 이 통일이 중요한가**: 개별 트릭의 사후 변명이 아니라 **이식 가능성 판단 기준**을 준다. 새 도메인에서 "여기서도 그로킹이 올까?"를 물을 때, 이제 물어야 할 것은 "이 손실 함수에 NLM 방향이 존재하는가?"다. 회귀 손실이라면 답은 대체로 아니오이고, 그러면 그 도메인의 지연 현상은 **다른 원인**을 찾아야 한다. 시계열 예측이 정확히 이 경계에 걸린다 → 09 절에서 자세히.

**숨은 전제**:
1. **MSE 설명은 "타깃을 정해진 값으로 맞히는" 회귀에서만 성립한다.** 타깃이 스케일 불변이거나 정규화된 예측을 요구하는 손실(예: 분위수 손실의 일부 형태, 확률 밀도 기반 NLL)에서는 별도 분석이 필요하다.
2. **세 트릭의 설명이 사후적(post-hoc)이다.** §5.2 는 새 예측을 검증하기보다 기존 관찰을 재해석한다. 유일하게 예측적인 부분은 ⟂Grad — "NLM 을 아예 금지하면 빨라져야 한다"는 예측을 만들고 **Figure 6(a)** 에서 확인한다(트랜스포머 subtraction mod 113 에서 ⟂SGD 가 **400 iteration 이내에 100% 테스트 정확도** 도달, 본문 진술).

**쉬운 말 풀이**: "자신감만 키우기"라는 하나의 나쁜 습관을 상정하면, 지금까지의 민간요법이 다 설명된다. 벌점 주기(weight decay)는 자신감을 매번 깎는 것, MSE 로 바꾸기는 자신감에 점수를 안 주는 채점 규칙으로 바꾸는 것, 초기 자신감을 크게 주기는 나쁜 습관을 더 쉽게 만드는 것. 그리고 저자들의 ⟂Grad 는 아예 **자신감을 키우는 방향의 움직임을 물리적으로 차단**하는 장치다.
