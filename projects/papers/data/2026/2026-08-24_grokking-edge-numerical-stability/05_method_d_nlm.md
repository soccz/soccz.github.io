# 4. 방법론 해부 (d) — Naïve Loss Minimization 의 형식화

> **배경 사다리**: ① 함수 $f$ 가 **동차(homogeneous)**라는 건 입력을 $c$ 배 하면 출력이 $c$ 의 거듭제곱배로 나오는 성질이다. ReLU 망에서 bias 가 없으면 각 층이 1차 동차라 $L$ 층 전체가 $L$ 차 동차가 된다. ② 파라미터 벡터 $\theta$ 를 원점에서 뻗은 화살표로 보면, "반경 방향(radial)"은 화살표를 같은 방향으로 늘리는 움직임이고 "접선 방향(tangential)"은 방향을 돌리는 움직임이다. 학습에서 진짜 정보가 담기는 건 방향 쪽이다.

---

## 왜 이 부분이 필요한가

SC 는 "로짓이 너무 커지면" 발동한다. 그러면 **왜 로짓이 계속 커지나?** 이 질문에 답하지 못하면 SC 는 우연한 사고에 불과하고, 왜 하필 그로킹 과제에서 재현성 있게 일어나는지 설명할 수 없다. NLM 은 그 "왜"에 대한 답이다.

---

## 식 (8)(9) — NLM 의 정의 (Definition 5)

$$\mathcal{L}\big(f(\theta + d_{nlm}(\theta), \cdot)\big) < \mathcal{L}\big(f(\theta, \cdot)\big)$$
$$f\big(\theta + d_{nlm}(\theta), x\big) = c\, f(\theta, x), \quad \forall x \in \mathcal{X}, \ c>1$$

**① 기호 뜻**: $\theta$ 는 전체 파라미터, $d_{nlm}(\theta)$ 는 현재 위치에서의 NLM 방향 벡터, $\mathcal{X}$ 는 입력 공간 전체, $c$ 는 1보다 큰 스칼라. 식 (8)은 "이 방향으로 가면 손실이 준다", 식 (9)는 "그런데 모든 입력에 대해 출력이 그냥 $c$ 배가 될 뿐이다"를 뜻한다.

**② 일상 비유**: 지도에서 "북쪽으로 가면 목적지에 가까워진다"고 나침반이 알려주는데, 알고 보니 지도 축척만 커진 것이라 실제 위치는 그대로인 상황. 계기판(손실)은 개선을 보고하지만 세계(예측)는 안 움직인다.

**③ 왜 이 형태**: 두 조건을 **동시에** 요구하는 게 정의의 힘이다. 식 (9)만 있으면 "출력 스케일링"에 불과하고, 식 (8)만 있으면 평범한 하강 방향이다. 둘이 겹칠 때만 "**손실은 개선되는데 아무것도 학습되지 않는**"이라는 병리가 성립한다. 그리고 CE 손실에서 이 겹침은 우연이 아니다 — 훈련 데이터를 다 맞힌 뒤에는 $-\log \mathrm{softmax}(cz)_y$ 가 $c$ 에 대해 단조 감소하므로, 식 (9)를 만족하는 방향은 **자동으로** 식 (8)도 만족한다.

**④ 조심할 점**: 정의는 $\forall x \in \mathcal{X}$ — 훈련 집합이 아니라 **입력 공간 전체**에 대해 요구한다. 이건 강한 조건이고, 실제 모델에서 정확히 성립하려면 동차성 같은 구조가 필요하다. 그래서 바로 다음 정의가 온다.

---

## 식 (10) — Positive Homogeneity (Definition 6)

$$f(c\theta, x) = c^{L} f(\theta, x), \quad c > 0$$

**① 기호 뜻**: 파라미터 전체를 $c$ 배 하면 출력이 $c^L$ 배가 된다. $L$ 은 동차 차수로, 대체로 층 수(정확히는 스케일이 곱해지는 파라미터 그룹의 수)에 대응한다.

**② 일상 비유**: 요리 재료를 전부 2배로 넣으면 완성된 요리 양도 정확히 2배가 되는 레시피. 재료 비율(= 방향)은 하나도 안 바뀌었다.

**③ 왜 이 형태**: 이 식이 **NLM 방향의 정체를 구체적으로 지목**한다. 식 (9)의 추상적 "출력 $c$ 배" 조건이, 동차 모델에서는 "파라미터를 반경 방향으로 $c^{1/L}$ 배" 라는 **구체적인 파라미터 공간 방향**이 된다. 추상적 정의가 측정 가능한 양이 되는 순간이고, 이게 있어야 Figure 5 의 "기울기와 NLM 방향의 정렬도" 측정이 가능하다.

**④ 조심할 점**: **bias 항이 있으면 동차성이 깨진다.** $\mathrm{ReLU}(Wx+b)$ 에서 $W,b$ 를 함께 $c$ 배 하면 $\mathrm{ReLU}(c(Wx+b)) = c\,\mathrm{ReLU}(Wx+b)$ 로 살아나긴 하지만, layer norm·skip connection 이 들어가면 일반적으로 무너진다. §7 이 "A formal characterization [of] quasi-homogenous models could shed light on this kind of dynamics for models including skip connections and bias terms" 라고 자인하는 지점이다. Figure 5(a)(b)가 bias 유/무를 나란히 보여주는 건 이 이론적 구멍을 **경험적으로** 때우려는 시도로 읽힌다.

---

## Figure 5 를 읽는 법

캡션 verbatim: "MLPs with (a) and without (b) bias terms trained on modular addition receive updates that are significantly aligned with the direction of NLM beyond the point of overfitting. In (c) we show these results for a selection of parameters for our one layer transformer. We highlight the embed and unembed matrices as well as the weights of the MLP. These are highlighted in the plot using the notation from [Elhage et al. 2021]."

세 가지를 짚어야 한다.

1. **"beyond the point of overfitting"** — 정렬은 처음부터 있는 게 아니라 **훈련 데이터를 다 맞힌 뒤부터** 두드러진다. 이건 NLM 이 "손실을 줄일 다른 방법이 소진된 뒤 남는 방향"이라는 그림과 일치한다. 훈련 오차가 남아 있는 동안은 진짜 학습 방향이 더 큰 손실 감소를 주므로 그쪽이 이긴다.
2. **파라미터 그룹별 분해** — 트랜스포머에서 embed / unembed / MLP 를 나눠 본다. 전역 평균 하나가 아니라 **어느 부품이 스케일을 키우고 있는지**를 본다는 뜻이다. APF 처럼 부품별 개입을 설계하는 연구에는 이 분해 방식 자체가 방법론적 참고물이다.
3. **Elhage et al. 2021 표기법 채택** — 이 논문이 `A Mathematical Framework for Transformer Circuits` 의 표기(embed/unembed 행렬 분해)를 명시적으로 빌린다. 즉 저자들은 이 작업을 최적화 논문이 아니라 **mech interp 문헌과 같은 좌표계 위에** 놓으려 한다. (이 레포 대기 후보의 Elhage 편이 미커버로 남아 있는 이유가 여기서 또 한 번 드러난다.)

---

## §4.1 — 왜 하필 그로킹 과제인가

NLM 이 CE 손실 일반의 성질이라면, 왜 ImageNet 학습에서는 그로킹이 안 보이나? 저자들의 답은 **과적합의 난이도**다(§4.1 "Ease of overfitting in grokking tasks"). 저자 요지: modular addition 이 그로킹을 유발하는지 여부는 **표현의 선택**에 달렸고, one-hot 인코딩 대신 14차원 랜덤 이진 벡터를 쓰면 "overfitting is prevented and models generalize without need for regularization."

읽는 법: one-hot 인코딩은 모든 입력 쌍이 서로 직교하므로 **암기가 거의 무료**다. 훈련 손실이 순식간에 바닥나고, 그 직후부터 남는 유일한 손실 감소 경로가 NLM 이다. 반면 입력 표현이 압축돼 있으면 암기가 비싸서 모델이 일반화 특징을 먼저 찾는다. **그로킹은 과제의 속성이 아니라 (표현 × 손실함수) 조합의 속성**이라는 결론이 여기서 나온다.

---

## 다른 접근으로 했다면

- **대안 1 — 파라미터 노름 대신 로짓 노름을 직접 추적**: NLM 을 "출력 스케일 증가율"로 정의하면 동차성 가정이 필요 없다. 측정은 더 쉬워지지만, 파라미터 공간의 어느 부품이 원인인지(Figure 5(c)의 분해)를 잃는다.
- **대안 2 — margin 이론으로 접근**: 최대 마진 방향으로의 수렴(implicit bias) 문헌이 이미 "CE 는 로짓을 무한히 키운다"를 다룬다. 저자들의 기여는 그 알려진 사실을 **유한 정밀도**와 접속시킨 것이다 — 이론에서는 $\theta \to \infty$ 가 무해한 극한이지만, float32 에서는 그 경로 위에 절벽이 있다.
- **대안 3 — NLM 성분의 손실 감소 기여를 회귀로 분해**: Hase et al.(2026-08-14 커버)이 tracing effect 에 했던 것처럼 $R^2$ 증분을 재면 "정렬"이 아니라 "설명력"을 말할 수 있다. 원문은 여기까지 가지 않는다. → 07 절 반박 지점 2.

## 이 절의 핵심 한 문장

**NLM 은 "훈련 데이터를 다 맞힌 교차엔트로피 학습기에게 남은 유일한 무료 점심"이며, 동차 모델에서는 그것이 파라미터 반경 방향과 일치하기 때문에 측정 가능한 양이 되고, 그 무료 점심을 계속 먹은 결과가 Softmax Collapse 다.**
