# 4. 방법론 해부 (c) — StableMax: 증상을 막는 손실

> **배경 사다리**: ① 소프트맥스는 임의의 실수 벡터를 "합이 1 인 양수 벡터(확률)"로 바꾸는 장치이며, 그러려면 **양수로 만드는 함수**가 하나 필요하다. 표준 선택이 $e^x$ 다. ② $e^x$ 를 고른 이유는 미분이 예쁘고 지수족(exponential family) 이론과 맞물리기 때문이지, "확률로 만들려면 지수여야 해서"가 아니다. 양수이고 단조증가하면 어떤 함수든 된다. 이 자유도가 StableMax 의 출발점이다.

---

## 왜 이 부분이 필요한가

앞 절에서 SC 의 원인은 $e^x$ 의 **폭발적 증가율** 때문에 항 간 크기 차이가 순식간에 float 표현 범위를 넘어서는 것이었다. 그렇다면 증가율이 완만한 함수로 갈아끼우면 같은 로짓 차이에서도 항들이 흡수되지 않는다. 이게 StableMax 의 전부다.

---

## 식 (5)(6) — StableMax 정의 (Definition 4)

$$\mathrm{StableMax}(x_i) := \frac{s(x_i)}{\sum_j s(x_j)}, \qquad s(x) := \begin{cases} x+1 & x \ge 0 \\ \dfrac{1}{1-x} & x < 0\end{cases}$$

**① 기호 뜻**: $x_i$ 는 클래스 $i$ 의 로짓. $s(\cdot)$ 는 $e^{(\cdot)}$ 를 대신할 양수화 함수. $x\ge 0$ 이면 **선형**으로 증가하고, $x<0$ 이면 **분수 꼴로 0 에 접근**한다. 두 조각은 $x=0$ 에서 값 1 로 이어지고 기울기도 1 로 이어져 부드럽게 연결된다($s'(0^-) = 1/(1-0)^2 = 1$, $s'(0^+)=1$).

**② 일상 비유**: 지수는 "한 계단 오를 때마다 상금이 3배"인 사다리다. 몇 계단만 올라도 아래 사람과 상금 차이가 천문학적이 된다. StableMax 는 "한 계단마다 상금 +1만원"인 사다리다. 차이는 여전히 벌어지지만 **선형으로만** 벌어지므로, 아래 사람의 상금이 장부에서 사라지지 않는다.

**③ 왜 이 형태**: 세 가지 요구를 동시에 만족하는 최소 설계다. (i) **양수성** — 확률로 쓰려면 $s(x)>0$ 이어야 하는데, $x<0$ 구간을 $1/(1-x)$ 로 두면 절대 0 이하로 안 간다. (ii) **단조성** — 로짓 순서가 확률 순서로 보존돼야 argmax 가 안 바뀐다. (iii) **완만한 증가** — 양의 구간에서 선형이므로 로짓이 $10^3$ 배 차이 나야 겨우 $10^3$ 배 항 차이가 난다. float32 유효숫자 $\sim 10^7$ 를 감당하려면 로짓이 천만 배쯤 벌어져야 하는데, 지수라면 로짓 차 16 에서 이미 도달하는 지점이다. 이 차이가 SC 발동 임계를 수십~수백 배 밀어낸다.

**④ 조심할 점**: 이건 **수치 안정 버전의 소프트맥스가 아니라 다른 확률화 함수**다. 손실 지형과 최적해의 성질이 실제로 달라진다. "버그 픽스"로 오독하면 안 된다 — 아래 Proposition 1 이 그걸 명시한다.

---

## 식 (7) — Proposition 1: StableMax 는 워핑된 Softmax

$$g(x) = \begin{cases} \log(x+1) & x \ge 0 \\ -\log(-x+1) & x < 0 \end{cases}, \qquad \mathrm{StableMax}(x) = \mathrm{Softmax}(g(x))$$

**① 기호 뜻**: $g$ 는 로짓을 먼저 압축하는 전처리 함수. 양수 쪽은 $\log(1+x)$, 음수 쪽은 그 홀함수 대칭.

**② 일상 비유**: 소리 크기를 데시벨로 바꾸는 것과 같다. 원래 눈금이 너무 빨리 커지니까 로그 눈금으로 갈아탄 것.

**③ 왜 이 형태 (그리고 왜 이 명제가 중요한가)**: 이 명제는 StableMax 를 **소프트맥스 이론과 다시 연결**해 준다. 즉 StableMax CE 는 "로짓에 $g$ 를 씌운 뒤 평범한 CE 를 쓴 것"이므로, 소프트맥스에 대해 알려진 성질(볼록성, 캘리브레이션 논의 등)을 $g$ 를 통해 번역해 쓸 수 있다. 동시에 이 명제는 **불편한 진실**도 말한다 — 로짓을 $\log$ 로 압축했으니, NLM 이 로짓을 $c$ 배 키워도 손실 감소량이 $\log c$ 로만 늘어난다. **StableMax 는 SC 를 막을 뿐 아니라 NLM 의 수익률도 깎는다.** 그래서 "증상만 막았다"는 앞 절의 요약은 절반만 맞다. 저자들이 개입 두 개를 따로 둔 이유는, ⟂Grad 는 NLM 을 **원리적으로** 0 으로 만드는 반면 StableMax 는 **약화**시킬 뿐이기 때문으로 읽힌다(원문이 이 대비를 이 문장 그대로 쓰지는 않는다 — **해석**).

**④ 조심할 점**: $g$ 가 로짓을 압축한다는 것은 **모델이 표현할 수 있는 확신의 최댓값이 사실상 제한**된다는 뜻이다. 확률 캘리브레이션(예측 확률이 실제 빈도와 맞는지)이 필요한 응용에서는 이 왜곡을 반드시 재검사해야 한다. 원문 Table 1 의 WikiText-103 성능 저하(StableMax CE 51.85%±0.47 vs Softmax CE 60.48%±0.04)는 이 비용이 실재함을 보여주는 신호로 읽을 수 있다 — **다만 원문이 그 저하의 원인을 캘리브레이션으로 귀속하지는 않는다(해석)**.

---

## 이걸 쓰면 실제로 무슨 일이 생기나

**Figure 4 (left)** 캡션 verbatim: "Grokking with StCE loss and no regularization on three common grokking datasets using an MLP with 2 hidden layers of width 200. We use 40% of all pairs modulo 113 which is the same setting as [fig. 2(a)] where regular SCE gets stuck at random level performance (random level is 50% for sparse parity)."

읽는 법: **동일 설정**(40% modulo 113, width 200 2층 MLP, weight decay 없음)에서 손실 함수만 바꿨더니, 랜덤 수준에 갇혀 있던 것이 그로킹으로 바뀌었다. 이게 Claim 2 의 인과 고리다.

**Figure 4 (middle)** 캡션 verbatim: "Evolution of model weight norms during training for the same models and tasks. This shows that grokking induced without weight decay does not follow the commonly observed trend of rapidly decreasing weight norm during generalization."

읽는 법: **Omnigrok 계열의 "노름 급감 = 일반화" 서사에 대한 직접 반례**. 노름이 안 줄어도 그로킹이 온다면, 노름 감소는 그로킹의 필요조건이 아니다. 이 레포 2026-06-12 편과 나란히 놓고 읽어야 하는 그림이다.

**Figure 4 (right)** 캡션 verbatim: "Changing input representations turns modular addition into regular machine learning tasks with train and test accuracy increasing in tandem, see [section 4]."

읽는 법: 여기서 그로킹은 과제의 본질이 아니라 **입력 표현의 선택**에 달린 것으로 드러난다. §4.1 이 이를 뒷받침한다 — one-hot 인코딩 대신 14차원 랜덤 이진 벡터를 쓰면 "overfitting is prevented and models generalize without need for regularization". 즉 modular addition 은 "그로킹하는 과제"가 아니라 "one-hot 으로 주면 암기가 너무 쉬운 과제"였다.

---

## 다른 접근으로 했다면

- **대안 1 — $s(x) = \mathrm{softplus}(x) = \log(1+e^x)$**: 양수·단조·부드러움을 다 만족하고 큰 $x$ 에서 선형으로 간다. 사실상 StableMax 와 같은 계열의 효과를 낼 수 있다. Appendix F 제목이 "Alternatives to StableMax in Preventing SC" 인 것으로 보아 저자들도 대안군을 검토했다(**세부 내용은 본 실행에서 미확인**).
- **대안 2 — 온도(temperature) 조절**: 로짓을 $z/T$ 로 나눠 $T$ 를 키우면 항 간 차이가 줄어 SC 를 미룬다. 그러나 $T$ 는 상수이므로 로짓이 계속 커지면 결국 따라잡힌다. **미봉책**이라는 점에서 float64 와 같은 범주.
- **대안 3 — 손실을 MSE 로 교체**: §5.2 의 논리대로면 NLM 자체가 사라지므로 근본적이다. 그러나 분류 성능·수렴 속도에서 CE 를 포기하는 대가가 크다.

## 이 절의 핵심 한 문장

**StableMax 는 소프트맥스의 지수를 완만한 함수로 갈아끼워 흡수 오차를 밀어내는 장치이며, Proposition 1 이 보여주듯 이는 로짓에 로그 워핑을 가한 소프트맥스와 같아서 SC 차단과 동시에 NLM 의 유인까지 함께 깎는다 — 대가는 실전 벤치마크에서의 성능 저하다.**
