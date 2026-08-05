# 4. 방법론 해부 (C) — CNN 구성요소 해부

## 이 부분이 왜 필요한가

앞 파일에서 이미지가 만들어졌다. 이제 그 픽셀 행렬을 "오를 확률"로 바꾸는 함수를 열어야 한다. 이 절이 중요한 이유는 두 가지다. ① 저자들이 **왜 완전연결망이 아니라 CNN을 골랐는지**의 논거가 금융 문제에 특유하게 강하다(평행이동 등변성). ② 사용자의 APF 프레임에서 "CNN probe" 단계가 정확히 이 구조를 쓰므로, 필터 크기·stride·dilation의 선택 논리가 그대로 이식 가능하다.

## 배경 사다리

① **합성곱(convolution)** 은 작은 가중치 격자(필터)를 이미지 위에서 한 칸씩 밀면서, 매 위치에서 격자와 그 아래 픽셀들의 **곱의 합**을 계산해 새 행렬을 만드는 연산이다. ② **텐서(tensor)** 는 3차원 배열이다 — 여기서는 `높이 × 너비 × 채널수`. ③ **채널(channel)** 은 "몇 종류의 필터를 썼는가"다. 필터 64개를 쓰면 출력 채널이 64개.

---

## 구성요소 1 — 합성곱: 커널 평활과 무엇이 다른가

원문 Appendix(p.3242)는 합성곱을 **커널 평활(kernel smoothing)의 일반화**로 도입한다. 폭 3의 직사각 커널로 시계열을 평활하면 각 점을 양옆 두 이웃과 평균한다. 합성곱은 이미지에서 같은 일을 하되 결정적 차이가 있다 — 원문 p.3244 verbatim:

> "Smoothing calculates local averages in the image matrix, while convolution instead calculates a weighted sum of nearby image contents, **where the filter weights are parameters to be estimated.**"

### 4줄 해석

1. **기호 뜻**: 필터 $F$ 는 $h_f \times w_f$ 크기의 가중치 행렬 (본 논문은 $5 \times 3$). 이미지 $I$ 의 위치 $(i,j)$ 에서 출력 $O(i,j) = \sum_{a,b} F(a,b) \cdot I(i+a, j+b)$ — 필터와 그 위치 주변 픽셀의 원소별 곱의 합.
2. **일상 비유**: 투명한 격자 스탬프를 그림 위에 놓고 "얼마나 잘 들어맞나"를 점수로 매기며 스탬프를 전 영역에 찍어 보는 것이다. 잘 맞는 곳에서 큰 점수가 나온다. 원문 표현(p.3244): "Sliding the filter over the entire image amounts to **searching the image for this specific pattern.**"
3. **왜 이 형태**: 가중치가 **추정 대상**이라는 점이 핵심이다. 평활은 무엇을 강조할지 사람이 미리 정하지만(예: 균등 평균), 합성곱은 **무엇을 강조하면 수익률 예측이 잘 되는지를 데이터가 결정한다.** 원문 Figure A1의 예시가 이를 구체화한다 — (1, 0, −1)을 각 행에 갖는 3×3 필터는 **수직 경계선을 검출**하고, 전치된 형태는 수평 경계선을 검출한다. 실제 학습에서는 이런 필터가 사람이 지정한 게 아니라 **손실 최소화의 부산물로 나타난다.**
4. **조심할 점**: 필터가 검출하는 것은 **밝기의 국소 대비 패턴**이다. 금융 이미지에서 "수직 경계"는 무엇을 뜻하는가? 흑배경/백객체 이미지에서 수직 방향의 밝기 변화는 **급격한 가격 점프** 또는 **긴 고가-저가 바**에 대응한다. 즉 CNN의 저수준 필터는 사실상 **변동성 검출기**로 시작한다. 이는 저자들이 §I.A에서 Parkinson(1980)을 인용해 예고한 바 — 고가-저가 범위의 세로 길이가 변동성의 정확한 스냅샷 — 와 정합한다.

### 패딩·스트라이드·팽창 (본 논문의 구체적 선택)

원문 Appendix(p.3244–3245)와 각주 18·19, 그리고 최종 사양(p.3247):

| 항목 | 선택 | 원문 논거 |
|---|---|---|
| **필터 크기** | **5 × 3** (높이 5, 너비 3) | "Since our images are largely sparse in the vertical dimension, we use 5 × 3 convolutional filters" (p.3246–3247). 세로가 희소하니 세로로 더 넓게 본다 |
| **패딩** | 경계에서 없는 이웃을 0으로 채움 | 각주 18: "a common CNN practice known as 'padding' and ensures that the convolution output has the same dimension as the image itself" (Simonyan·Zisserman 2015 인용) |
| **수평 stride** | 1 | 가로는 시간축 — 매일을 놓치지 않고 봐야 한다 |
| **수직 stride** | 5·20·60일 모델에서 각각 **1, 3, 3** (첫 층에만) | 세로는 가격축 — 희소하므로 건너뛰어도 정보 손실이 적다 |
| **수직 dilation** | 5·20·60일 모델에서 각각 **1, 2, 3** (첫 층에만) | 각주 19: "while both stride and dilation reduce the computational burden and encourage parsimony, **dilation preserves the resolution of the original image**" |
| **최대풀링 필터** | **2 × 1** (최종 사양) | 세로만 절반으로 줄이고 가로(시간)는 보존 |

**stride와 dilation의 차이 — 4줄 해석**

- **기호 뜻**: stride $s$ = 필터가 한 번에 몇 칸 이동하는가. dilation rate $k$ = 필터 원소 사이에 $(k-1)$개의 0을 끼워 필터의 **유효 시야를 넓히되 파라미터 수는 그대로 두는** 것.
- **일상 비유**: stride는 **책을 읽을 때 몇 줄씩 건너뛰며 읽는 것**(빠르지만 놓친다). dilation은 **같은 개수의 단어를 읽되 더 넓게 흩어진 위치에서 뽑아 읽는 것**(넓은 맥락을 같은 노력으로 본다).
- **왜 둘을 같이 쓰는가**: 세로 방향은 대부분 검은 배경이므로 촘촘히 볼 가치가 낮다. stride 3으로 계산량을 3분의 1로 줄이면서, dilation 2~3으로 시야는 오히려 넓힌다. 즉 **"희소한 축에서는 성기게 보되 멀리 본다."**
- **조심할 점**: 이 선택은 **이미지 길이에 따라 다르다**(1/2/3). 즉 5일·20일·60일 모델은 저수준 특성 추출 방식 자체가 다르다. 따라서 **세 모델의 예측을 "같은 종류의 패턴을 다른 창에서 본 것"으로 해석하면 안 된다.** Table V에서 지평별로 상관 구조가 크게 달랐던 것(I5/R5는 WSTR과 −0.34, I60/R60은 MOM과 0.21)에는 감독 신호 차이뿐 아니라 **아키텍처 차이도 섞여 있다.** 논문은 이 교란을 분리하지 않는다.

---

## 구성요소 2 — 활성화: leaky ReLU

원문 각주 20(p.3246)이 정의를 명시한다:

$$\text{LeakyReLU}(x) = \begin{cases} x, & x \geq 0 \\ kx, & x < 0 \end{cases}, \quad k = 0.01$$

원문 verbatim: "where $k = 0.01$ is the coefficient that controls the angle of the negative slope" (Maas·Hannun·Ng 2013 인용).

### 4줄 해석

1. **기호 뜻**: $x$ = 합성곱 필터의 출력값 하나 (무단위). $k = 0.01$ = 음수 영역의 기울기. 출력은 $x$ 와 같은 단위.
2. **일상 비유**: **한쪽으로만 잘 열리는 밸브**다. 양의 신호는 그대로 통과시키고, 음의 신호는 100분의 1로 줄여서 **아주 조금만** 통과시킨다. 완전히 막지 않는 것이 요점이다.
3. **왜 이 형태 (원문 각주 20의 두 논거)**: 표준 ReLU($x<0$ 에서 정확히 0)의 두 결함을 고친다. ① "when inputs are all positive, the gradients are either all positive or all negative, which introduces obstacles to the gradient descent in the training step" — 기울기 부호가 한쪽으로 쏠려 최적화가 지그재그로 느려진다. ② "certain neurons may never activate because all gradients flowing through these units fall into the zero region" — **죽은 뉴런(dead neuron)** 문제. 한번 음수 영역에 갇힌 뉴런은 기울기가 0이라 영원히 학습되지 않는다. $k=0.01$ 은 그 뉴런에게 **부활할 최소한의 기울기 통로**를 남긴다.
4. **조심할 점**: 본 논문 이미지가 **극도로 희소**(대부분 검은 배경)하다는 점에서 죽은 뉴런 위험이 특히 크다. 대부분의 위치에서 필터 출력이 0 또는 음수가 되기 쉬우므로, 표준 ReLU를 썼다면 상당 비율의 필터가 학습 초기에 죽었을 가능성이 있다. **즉 leaky ReLU 선택은 이 도메인에서 관습이 아니라 실질적 필요다.** (원문은 이 도메인-특유 논거를 명시하지 않는다 — 필자 추론.) 반면 $k$ 값 0.01의 민감도 실험은 원문에 없다.

---

## 구성요소 3 — 최대풀링: 왜 평균이 아니라 최대인가

원문 Appendix(p.3245–3246)가 두 역할을 명시한다.

**역할 1 — 차원 축소.** "a 2 × 2 pooling filter shrinks the height and width of the input by half, and does so **without introducing new parameters to be estimated**, further promoting parsimony." 파라미터 없이 크기를 절반으로 줄인다. 저자들은 이를 신호처리의 다운샘플링에 대응시킨다.

**역할 2 — 국소 변형에 대한 강건성(denoising).** "by taking local maxima throughout the image, the output is left generally unaffected by small perturbations of the input pattern... max-pooling is a denoising tool that enhances CNN robustness to **local deformation**, much like the convolution operation aids CNN robustness to **variation in object position.**"

Figure A1 Panel B가 이를 수치로 예시한다(캡션 p.3243 verbatim): 6×6 이미지의 경계선을 회색(픽셀값 122)으로 흐리게 만들면 "Nonzero values from Output Channel 1 are significantly changed. However, after max-pooling is applied, the original upper-right value of **765** remains intact while the original bottom-right value of **510** is replaced with **632**, a slightly larger number." → **합성곱 출력은 노이즈에 크게 흔들렸지만, 풀링 후 값은 거의 그대로 유지된다.**

### 왜 최대인가 (평균 풀링과의 비교 — 원문에 없는 필자 분석)

원문은 최대 대 평균의 선택을 논증하지 않는다. 그러나 본 논문의 이미지 특성에서 답이 나온다. **이미지가 흑배경/백객체로 극도로 희소하다.** 2×1 창 안에 흰 픽셀이 하나, 검은 픽셀이 하나 있을 때:
- **평균 풀링**: (255 + 0)/2 = 127.5 → 신호가 **절반으로 희석**된다. 희소 이미지에서 평균 풀링을 반복하면 객체가 배경에 녹아 없어진다.
- **최대 풀링**: max(255, 0) = 255 → **신호가 보존**된다.

즉 희소 표현에서는 최대 풀링이 필수적이고 평균 풀링은 정보를 체계적으로 파괴한다. 원문 p.3245의 표현이 이 직관을 담고 있다 — "If any of the neurons in the filter region are stimulated, max-pooling detects it."

**조심할 점**: 최대 풀링은 **위치 정보를 버린다.** "이 2칸 중 어디에 신호가 있었나"가 사라진다. 시간축(가로)에서 이걸 잃으면 "며칠 전 사건인가"가 흐려진다. **본 논문의 최종 사양이 2×1 풀링(세로만 절반, 가로는 보존)인 것이 정확히 이 문제의 해결책이다** — 가격축의 미세 위치는 버려도 되지만 시간축의 위치는 지켜야 한다. Appendix 본문 서술이 일반론으로 2×2를 설명하고(p.3245) 최종 사양에서 2×1을 밝히는(p.3247) 구조라 읽을 때 혼동하기 쉬운 지점이다.

---

## 구성요소 4 — 블록의 조립과 채널 증식

원문 Appendix Figure A2 캡션(p.3246)이 규칙을 명시한다:

> "In general, with input of size $H \times W \times D$, the output has size $H/2 \times W/2 \times 2D$. One exception is the first building block of each CNN model that takes the gray-scale image as input: The input has depth of one and the number of CNN filters is 32, boosting the depth of the output to 32."

즉 **한 블록을 통과할 때마다 공간 크기는 절반, 채널 수는 두 배.** 그런데 본문 최종 사양(p.3247)은 다른 숫자를 준다: "The number of filters for the first building block is **64** for all three models" 그리고 채널이 "64, 128, 256, and 512"로 증가(60일 모델 4층). → **Figure A2 캡션의 32는 그림 예시용 수치이고, 실제 모델은 첫 블록 64채널이다.** (원문 안에서 이 두 수치가 병존하므로, 읽을 때 캡션 예시와 실제 사양을 구분해야 한다.)

**왜 채널을 2배씩 늘리는가**: 원문은 Zeiler·Fergus(2014)를 근거로 든다(p.3247) — "learned features become more complex in deeper layers, so we follow the literature and increase the number of filters after each convolutional layer by a factor of two." 얕은 층은 단순한 패턴(경계·선)을 몇 종류만 찾으면 되지만, 깊은 층은 그 조합으로 만들 수 있는 복합 패턴이 조합적으로 많아지므로 더 많은 채널이 필요하다.

**공간은 줄고 채널은 늘어난다는 것의 의미**: 정보가 "어디에 무엇이 있나"(공간적)에서 "무엇이 있나"(의미적)로 점진적으로 번역된다. 원문 표현(p.3246): "the network first creates representations of small components of the image and then gradually assembles them into representations of larger areas."

### 블록 개수와 파라미터 수 (p.3247 verbatim)

| 모델 | 블록 수 | 완전연결층 입력 뉴런 | **총 파라미터 수** |
|---|---|---|---|
| 5일 이미지 | 2 | 15,360 | **155,138** |
| 20일 이미지 | 3 | 46,080 | **708,866** |
| 60일 이미지 | 4 | 184,320 | **2,952,962** |

저자의 자기-유보(p.3247 verbatim): "Of course, the effective parameterization of these models is much smaller than this parameter count due to heavy regularization that shrinks most parameters close to zero."

**여기서 중요한 관찰**: 파라미터가 압도적으로 **완전연결층에 몰려 있다.** 5일 모델의 총 파라미터 155,138 중 완전연결층 입력이 15,360 뉴런이므로 FC 가중치만 약 15,360 × 2 = 30,720개(+합성곱). 60일 모델은 184,320 뉴런 → FC 가중치 약 368,640개. 그런데 §II.C에서 **드롭아웃 50%를 완전연결층에만** 적용한다고 명시한다("We apply 50% dropout to the fully connected layer (the relatively low parameterization in convolutional blocks avoids the need for dropout there)", p.3205). → **정규화 설계가 파라미터 분포를 정확히 따라간다.** 합성곱 블록은 파라미터 공유 덕에 이미 희소하므로 드롭아웃이 불필요하고, FC층이 진짜 과적합 위험이다.

---

## 구성요소 5 — 두 개의 교차-파라미터 제약: 이 논문에서 CNN을 정당화하는 핵심

원문 Appendix(p.3244–3245)가 CNN의 이점을 **두 제약**으로 정식화한다:

1. **파라미터 공유(parameter sharing)**: "CNN applies a small filter uniformly to all locations in an image, while a general network allows separate weight parameters for each element of the image matrix."
2. **희소 상호작용(sparse interactions)**: "the CNN maps the information from a given location in the input matrix only to the neighborhood of the same location in the output matrix, while a general network would allow for cross-connectivity between all elements."

그리고 이 둘의 귀결(p.3245 verbatim): "because the same filters are applied uniformly to all locations in the image, they detect relevant objects regardless of their position (in other words, CNN forecasts are **'translation equivariant'**)."

### 금융 문제에서 평행이동 등변성이 왜 결정적인가

**이것이 이 논문에서 CNN을 쓸 가장 강한 논거이며, Table IX가 반박하지 못한 것이다.**

- **문제 상황**: "급락 후 3일간 횡보 후 반등"이라는 패턴이 창의 앞부분에 있을 때와 뒷부분에 있을 때, 사람 눈에는 같은 패턴이다. 그런데 각 lag에 별도 계수를 주는 회귀(예: $r_{t-1}, r_{t-2}, \ldots, r_{t-20}$ 각각에 계수)에게는 **완전히 다른 입력**이다. 20일 창에서 어떤 패턴이 나타날 수 있는 위치가 15개라면, 회귀는 그 패턴을 **15번 따로 배워야** 한다.
- **CNN의 해결**: 같은 필터가 전 위치를 스캔하므로 **한 번 배우면 모든 위치에서 작동한다.** 데이터 효율이 위치 개수 배만큼 좋아진다.
- **그런데 1D CNN도 이 성질을 갖는다.** 필터가 시간축으로 슬라이딩하므로 시간 방향 평행이동 등변성은 동일하다. **2D가 추가로 얻는 것은 "가격축 방향의 평행이동 등변성"** — "가격 수준이 어디에 있든 같은 모양이면 같게 반응"이다.
- **그리고 min–max 재척도화가 이미 가격축을 [0,1]로 고정했으므로, 가격축 평행이동 등변성의 가치가 대부분 소진된다.** 창 내에서 가격은 이미 정규화되어 있어서 "같은 모양이 다른 가격 수준에 나타나는" 상황 자체가 드물다.

**이것이 Table IX의 구조적 설명이다.** 척도 정규화가 2D 합성곱이 제공하려던 불변성(invariance)의 상당 부분을 **전처리 단계에서 미리 달성**해 버린다. 그러므로 min–max 이미지 척도 위에서는 2D 합성곱의 한계효용이 작아지고, 1D CNN이 (양자화 손실 없이) 동등하거나 더 나은 성능을 낸다. **저자들은 이 메커니즘을 명시적으로 서술하지 않으므로 이 설명은 필자 추론이지만, Table IX·Figure 7의 패턴과 정합한다.**

---

## 다른 접근으로 했다면 (대안 3개)

1. **Vision Transformer (ViT) 계열** — 이미지를 패치로 쪼개 self-attention을 적용. 장점: 원거리 관계(창 앞부분과 뒷부분의 상호작용)를 층 하나로 잡는다. 단점: 본 논문 표본 크기에서 과적합 위험이 크고 귀납편향이 약하다. 학습 데이터가 8년(1993–2000)뿐이라는 제약에서 CNN의 강한 귀납편향이 유리했을 것이다. **APF 맥락에서는 이 대안이 정확히 사용자 트랙과 겹친다** — attention motif를 보려면 attention 기반 모델이어야 한다.
2. **LSTM 등 순환신경망** — 저자 자신이 각주 7(p.3204)에서 인정한 대안이다 verbatim: "While we advocate the use of CNN models over time-series models, we cannot rule out the possibility that a well-crafted time-series model, say, Long Short-term Memory networks (LSTM), may outperform the CNN." 그리고 논문의 목적을 재규정한다 — "our objective here is not to find the best return prediction model... Rather, our empirical analysis provides, at best, **a lower bound** on the extent of predictability." **이 각주가 논문 전체의 주장 강도를 정의한다: 이것은 최적성 주장이 아니라 하한 주장이다.**
3. **Gramian Angular Field / Recurrence Plot 계열의 명시적 2D 인코딩** — 시계열을 각도·거리 행렬로 변환해 진짜 2차원 구조를 만드는 방법(`ts-as-2d` 태그의 GAF/MTF, 2026-06-24 커버). 본 논문의 "차트 그림"은 시각적으로는 2D지만 정보 구조상 **여전히 1D 시계열의 시각화**다 — 가로축이 시간이고 세로축은 값이므로, 각 시간 열은 독립적으로 하나의 값(집합)만 담는다. GAF는 시간 $i$와 시간 $j$의 **쌍(pair)** 을 픽셀 $(i,j)$에 담으므로 진짜로 2차원 정보를 만든다. **본 논문의 Table IX 결과는 GAF 계열에 대한 반박이 아니다** — 오히려 "차트 이미지는 가짜 2D였고, 진짜 2D 인코딩은 아직 시험되지 않았다"는 해석의 문을 연다. (§8 계보와 §10 실험 아이디어에서 이 갈래를 따라간다.)

---

## 이 부분의 핵심 한 문장 요약

> CNN의 이점은 파라미터 공유·희소 상호작용에서 나오는 **평행이동 등변성**인데, 본 논문의 min–max 재척도화가 가격축 불변성을 전처리에서 이미 달성해 버리므로 2D 합성곱의 한계효용이 소진되고, 남는 것은 시간축 등변성 — 즉 1D CNN이 이미 갖고 있는 것 — 뿐이다.

다음 파일에서 이 구조를 실제로 학습시키는 절차를 다룬다 → [05_method_d_training.md](05_method_d_training.md)
