# 5. 실험 해부 (b) — 실전 규모와 Table 1

> **배경 사다리**: ① 논문의 개입이 장난감 과제에서만 통하면 그건 현상 설명이지 도구가 아니다. ② 반대로 실전에서 baseline 을 이기지 못한다고 해서 현상 설명이 틀린 것도 아니다. 이 절은 그 둘을 섞지 않고 읽는 연습이다.

---

## Table 1 — 원문 그대로

**캡션 verbatim**:
> "For the methods introduced in this paper, we report accuracies with standard deviations across five seeds for the CIFAR datasets and three seeds for Imagenet-1k and WikiText-103. We report Top-5 accuracy in the case of WikiText-103."

| Method | CIFAR10 | CIFAR100 | ImageNet-1k | WikiText-103 (Top-5) |
|---|---|---|---|---|
| Softmax CE | 87.17%±0.2 | 59.98%±0.4 | **69.33%±0.04** | **60.48%±0.04** |
| Stablemax CE | 87.01%±0.2 | 60.63%±0.4 | 65.87%±0.22 | 51.85%±0.47 |
| ⟂Grad | **87.22%±0.2** | **62.69%±0.1** | 68.95%±0.03 | 59.64%±0.04 |
| Stablemax Attention | – | – | – | 58.52%±0.04 |

(굵게 표시는 열별 최고값 — **원문 표기가 아니라 본 해체의 강조**)

---

## 이 표에서 실제로 읽어야 하는 것 세 가지

### 1) StableMax 는 실전에서 대가를 치른다

ImageNet-1k 에서 **65.87%±0.22 vs 69.33%±0.04** — 3.46%p 열세. WikiText-103 Top-5 에서 **51.85%±0.47 vs 60.48%±0.04** — 8.63%p 열세. 표준편차 대비 압도적으로 큰 차이라 시드 노이즈로 설명되지 않는다.

이건 05_method_c 에서 짚은 Proposition 1 의 귀결과 일관된다. StableMax 는 로짓에 로그 워핑 $g$ 를 씌우는 것과 같으므로, 모델이 표현 가능한 확신의 범위가 압축된다. 대규모 어휘 분류(WikiText-103)처럼 클래스가 수만 개인 문제에서 이 압축은 특히 비싸다 — 정답 하나를 나머지 수만 개와 구분하려면 큰 로짓 여유가 필요한데, 그걸 깎았기 때문이다. (**이 인과 해석은 본 해체의 추론이며 원문이 명시하지 않는다.**)

흥미로운 예외가 **CIFAR100 에서 StableMax 가 60.63%±0.4 로 baseline 59.98%±0.4 를 근소하게 앞선다**는 것이다. 다만 표준편차 ±0.4 를 감안하면 유의하다고 말하기 어렵다. 정직하게는 "동등"이다.

### 2) ⟂Grad 는 실전에서도 살아남는다

CIFAR10 87.22%±0.2, CIFAR100 **62.69%±0.1**(baseline 59.98%±0.4 대비 **+2.71%p**, 표준편차 대비 명확), ImageNet 68.95%±0.03(baseline 69.33%±0.04 대비 -0.38%p), WikiText 59.64%±0.04(-0.84%p).

**패턴**: 작은/중간 규모에서는 이기거나 동등, 대규모에서는 근소 열세. 이건 개입의 성격상 납득되는 모양이다 — 반경 방향을 금지하는 것은 일종의 암묵적 정규화이고, 정규화는 데이터가 적을수록 이득이 크고 많을수록 손해가 된다. **CIFAR100 의 +2.71%p 는 이 논문에서 유일하게 "부수적으로 실용적 이득"이라 부를 만한 결과다.**

### 3) 네 번째 행 — Stablemax Attention

WikiText-103 에서만 값이 있다(58.52%±0.04). 어텐션의 소프트맥스에도 StableMax 를 적용한 변형으로 읽히며, 손실의 소프트맥스에만 적용한 Stablemax CE(51.85%)보다 **훨씬 낫고** baseline(60.48%)보다는 못하다. 즉 "어디에 적용하느냐"가 성능을 크게 가른다.

**이 행이 시사하는 것**: SC 는 손실 함수만의 문제가 아니라 **어텐션 소프트맥스에서도 발생할 수 있는** 일반 현상이라는 힌트다. 원문이 이 방향을 본격 전개하지는 않지만(본 실행 확인 범위), 어텐션 패턴을 연구 대상으로 삼는 입장에서는 놓칠 수 없는 한 줄이다 → 09 절.

---

## Appendix G — 저자가 스스로 그은 경계선

**제목 verbatim**: "StableMax and ⟂Grad in Realistic Settings"

저자들이 GPT2-Small, CIFAR/ImageNet ResNet 계열로 확장해 본 결과를 담으며, **표준 Softmax CE 대비 성능이 저하되는 경우가 있음**을 보고한다.

**이걸 어떻게 평가할 것인가**: 두 가지 독법이 가능하고 둘 다 맞다.

- **호의적 독법**: 이 논문의 목표는 SOTA 옵티마이저를 만드는 게 아니라 **가설을 검정할 개입 도구를 만드는 것**이었다. 도구가 그로킹 레짐에서 예측대로 작동했으면 임무 완수다. 실전 성능은 보너스였고, 저자들은 그 보너스가 없다는 걸 숨기지 않았다.
- **비판적 독법**: 그렇다면 Table 1 을 **본문에** 둔 것은 무엇인가. 본문 표에 실전 벤치마크를 올리는 순간 독자는 그것을 성능 주장으로 읽는다. 실제로 ⟂Grad 는 CIFAR100 에서 이기고, 그 셀이 표에서 가장 눈에 띈다. 표의 배치와 논문의 주장 사이에 미세한 긴장이 있다.

**균형 잡힌 판정**: 저자들은 불리한 수치를 표에 그대로 실었다. ImageNet 3.46%p, WikiText 8.63%p 열세는 감추려면 부록으로 밀 수 있었다. 그러지 않았다는 점에서 이 논문의 보고 태도는 신뢰할 만하다. 이 레포가 2026-08-19 Context parroting 편에서 본 "자기 이전 결과를 스스로 뒤집는" 태도와 같은 계열의 정직함이다.

---

## Appendix H — SC 와 Slingshot Effect

**제목 verbatim**: "SC and the Slingshot Effect"

저자들의 제안: 적응형 옵티마이저에서 관찰되는 slingshot(손실이 급등했다가 떨어지는 현상)이 "could lead to generalization because they prevent full SC" — 즉 손실 스파이크가 로짓을 흔들어 SC 를 깨뜨리기 때문에 일반화를 부를 수 있다는 가설. 저자들은 곧바로 "more research would be needed to properly show this"라고 못 박는다.

**왜 이 부록이 중요한가**: 이 레포의 priority 목록 Tier 3 에 **Thilak et al. "The Slingshot Mechanism"** 이 미커버로 남아 있다. 본 논문은 그 미커버 항목에 **연결선을 미리 깔아준다** — slingshot 과 SC 가 같은 메커니즘의 양면일 수 있다는 가설. 다음에 Thilak 편을 커버할 때 이 부록이 대조 축이 된다.

**동시에 주의**: 이건 **추측 수준**이고 저자들도 그렇게 표기했다. 인용할 때 "Prieto et al. 이 slingshot 을 SC 로 설명했다"고 쓰면 과장이다. 정확히는 "제안했으나 검증은 향후 과제로 남겼다"이다.

---

## 부록에 숨은 신호 (목록 수준 확인)

원문 부록 구성은 A~I 이며, 본 실행에서 **제목 수준으로** 확인한 것들 중 눈에 띄는 항목:

- **Appendix A: Proofs** — Proposition 1·2 의 증명 소재.
- **Appendix C: Effective Learning Rate** — §7 이 "weight decay 가 그로킹을 일으키는 이유에 대한 설명이 effective learning rate 분석으로 보강될 수 있다"고 남긴 숙제와 짝을 이룬다. 가중치 노름이 커지면 실효 학습률이 줄어드는 알려진 효과가 지연의 **또 다른** 경로일 수 있는데, 본문이 이를 주 메커니즘으로 삼지 않았다는 점은 07 절의 반박 지점이 된다.
- **Appendix F: Alternatives to StableMax in Preventing SC** — StableMax 가 유일한 선택이 아님을 저자들이 알고 있다는 표시.
- **Appendix I: Additional Details About Floating Points** — 수치 논증의 근거 자료.

**세부 내용은 본 실행에서 미확인**이므로, 위 항목들에 대해 제목 이상의 주장을 하지 않는다.

---

## 수치 투명성 기록

- **본 해체가 원문 표에서 직접 옮긴 수치**: Table 1 전 셀(위 표).
- **본문에서 확인한 수치**: Figure 6(a) ⟂SGD 400 iteration 이내 100% 테스트 정확도.
- **설정 수치**: modulo 113 / 40% 훈련 분할, sparse parity 2000 샘플 균등 분할·랜덤 수준 50%, MNIST 200 샘플, MLP width 200 2 hidden layers, 트랜스포머 1층 4헤드, $\lambda=0$, float32 머신 엡실론 $2^{-23}$.
- **원문에 수치 미보고 / 본 실행 미확인**: 그로킹 과제 실험의 시드 수와 분산, 학습률·배치·총 스텝, SC 진입 시점의 정량 값(몇 스텝·샘플 몇 %), Appendix G 의 개별 벤치마크 수치, StableMax·⟂Grad 조합 조건.
