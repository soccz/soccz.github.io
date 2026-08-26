# 4. 방법론 해부 (d) — CNN + Transformer 필터

> **배경 사다리**: ① "합성곱(convolution)"은 작은 창(예: 3일)을 시계열 위로 미끄러뜨리며 같은 패턴 도장을 찍어보는 연산 — 어디에 있든 같은 모양이면 같게 반응한다(translation invariance). ② "어텐션"은 각 시점이 다른 시점들을 얼마나 참고할지 가중치를 계산해 섞는 연산. ③ 여기서 CNN 은 **국소 모양**을, 트랜스포머는 **그 모양들의 시간적 배치**를 담당한다.

## 이 부분이 왜 필요한가

FFT 는 30일 창을 **미리 정한 삼각함수 기저**로 분해한다. 문제는 실제 잔차가 "사인파의 합"으로 잘 근사되지 않을 때다 — 국소적으로 한 번 꺾이는 반전, 갑작스러운 스파이크, 서로 다른 구간에서 다른 주파수가 섞이는 경우. 원문 §II.D.2 의 진단: FFT 는 "fails if the data follows a pattern that cannot be well approximated by a small number of the pre-specified basis functions." 그래서 **기저 자체를 데이터에서 배우는** 장치가 필요하다.

## 구성요소 1 — CNN: 국소 기저를 배운다

**본문 형태**(§II.D.3):

$$y^{(0)}_l=\sum_{m=1}^{D_{\text{size}}}W^{(0)}_m x_{l-m+1},\qquad x^{(1)}_{l,d}=\mathrm{ReLU}\left(y^{(0)}_{l,d}\right):=\max(y^{(0)}_{l,d},0)$$

$$y^{(2)}_{l,d}=\sum_{m=1}^{D_{\text{size}}}\sum_{j=1}^{D}W^{(1)}_{d,j,m}x^{(1)}_{l-m+1,j},\qquad x^{(2)}_{l,d}=\mathrm{ReLU}\left(y^{(1)}_{l,d}\right)$$

**실제 구현**(Appendix C.1, 식 (A.1)~(A.3))은 세 가지를 추가한다 — 편향항 $b^{(i)}$, **instance normalization**(활성화 직전 $\frac{y-\mu^{(i)}_d}{\sigma^{(i)}_d}$ 로 표준화), **잔차 연결** $\tilde{x}_{l,d}=x^{(2)}_{l,d}+x^{(0)}_l$. 저자들의 이유: 최적화 가속과 ReLU 포화로 인한 기울기 소실 방지, 그리고 기울기 전파.

**① 기호 뜻**: $D=8$(필터 개수), $D_{\text{size}}=2$(국소 창 크기, 단위=일), $L=30$(입력 길이), 출력 $\tilde x\in\mathbb{R}^{L\times D}$ — **각 날짜마다 8개의 "이 근처가 어떤 모양인가" 점수**.

**② 일상 비유**: 지문 감식에서 "소용돌이형/활형/고리형" 같은 기본 무늬 카드 8장을 들고 지문 위를 훑으며 어디에 어떤 무늬가 있는지 표시하는 것.

**③ 왜 이 형태인가**: 2층인 이유는 표현력과 해석 가능성의 절충이다. $D_{\text{size}}=2$ 이지만 2층이므로 **실효 수용영역(receptive field)이 3일**이 되고, 그래서 Figure 2·14 의 basic pattern 이 3점 꺾은선으로 그려진다(§II.D.3: "because of the 2-layer structure it captures information from two neighboring points. Hence, the projection on a one-dimensional linear filter has a local window size of three"). 층수는 검증 데이터로 선택된 하이퍼파라미터라고 명시한다.
- **대안**: 1층 선형 필터라면 $W^{(0)}_m$ 벡터 자체가 곧 패턴이라 해석은 쉽지만 표현력이 낮다. 3층 이상이면 표현력은 늘지만 **투영을 통한 시각화가 더 어려워진다** — 저자들은 이미 2층에서도 비선형 필터를 2차원 선형필터로 "투영"해야 했고, 그 투영이 완전한 표현이 아님을 각주 7 에서 명시한다.

**④ 조심할 점**: Figure 2·14 의 그림은 **필터 자체가 아니라 필터의 투영**이다. 원문 각주 7 은 그 투영을 $\arg\min_{x_{\text{loc},d}}\|\phi(x_{\text{loc},d})-e_d\|_2$ 로 정의하고, 일반적으로 역상은 집합이며 유일하지 않다고 적는다. **해석 그림을 "이 필터는 이 모양이다"로 읽으면 안 되고 "이 필터를 가장 강하게 켜는 대표 모양 하나"로 읽어야 한다.**

## 구성요소 2 — Transformer: 국소 모양들을 시간축에서 엮는다

본문은 먼저 **단순화된 선형 투영판**으로 직관을 준다:

$$h^{\text{simple}}_i=\sum_{j=1}^{L}\alpha_{i,j}\tilde x_j\qquad i=1,\dots,H,\qquad \alpha_{i,j}=\boldsymbol\alpha_i(\tilde x_L,\tilde x_j)$$

여기서 어텐션 함수 $\boldsymbol\alpha_i(\cdot,\cdot)\in[0,1]$ 은 **마지막 국소 패턴 $\tilde x_L$ 과 이전 패턴 $\tilde x_j$ 사이의 의존성**을 잰다. 실제 구현은 축소 차원 스케일드 닷프로덕트(Appendix C.2):

$$V_i=\tilde xW^V_i+b^V_i,\quad K_i=\tilde xW^K_i+b^K_i,\quad Q_i=\tilde xW^Q_i+b^Q_i\ \in\mathbb{R}^{L\times D/H}$$

$$h_{i,l}=\sum_{j=1}^{L}w_{l,j,i}V_{i,j},\qquad w_{l,j,i}=\frac{\exp(K_{i,l}\cdot Q_{i,j})}{\sum_{m=1}^{L}\exp(K_{i,l}\cdot Q_{i,m})}\in[0,1]$$

헤드를 결합하고 최종 신호를 뽑는다:

$$h=\mathrm{Concat}(h_1,\dots,h_H)W^O+b^O\in\mathbb{R}^{L\times D},\qquad \theta^{\text{CNN+Trans}}=h^{\text{proj}}_L\in\mathbb{R}^{H}$$

**① 기호 뜻**: $H=4$(어텐션 헤드 = "전역 패턴" 개수), $W^O\in\mathbb{R}^{D\times D}$, 최종 신호는 **창의 마지막 시점 투영 벡터 하나**. 각주 9 에 선택 근거가 있다 — 전체 행렬 $h\in\mathbb{R}^{L\times D}$ 를 신호로 쓸 수도 있으나 "the global pattern at the end of the time period should be the most relevant for the next realization", 그리고 실제로 전체 행렬을 쓴 구현도 결과가 비슷했으며 변수 중요도 순위가 $h_L$ 만 선택함을 시사했다고 적는다.

**② 일상 비유**: CNN 이 악보에서 "도-미-솔" 같은 화음 조각을 찾아냈다면, 트랜스포머는 "이 곡에서 그 조각들이 어떤 순서·간격으로 배치돼 하나의 악절을 이루는가"를 읽는다. 어텐션 헤드 4개는 4가지 악절 유형이다.

**③ 왜 이 형태인가**
- **저자들의 명시적 프레이밍**: 트랜스포머 투영은 "analogous to a Fourier filter, but without pre-specifying the global patterns a priori"(§II.D.3). 즉 $H$ 개의 어텐션 헤드 = **데이터에서 학습된 $H$ 개의 전역 기저**다. FFT 가 30개의 고정 기저를 쓰는 자리에 4개의 학습된 기저를 놓는다.
- **대안 A: LSTM.** 원문 §II.D.3 은 트랜스포머가 "replacing older recurrent neural network models such as the Long Short-Term Memory (LSTM) network" 라고 적지만, **LSTM 대조군 실험은 원문에 없다.** ("§III.K 에서 LSTM 을 비교했다"는 서술은 이 논문에 존재하지 않는다 — §III.K 는 *Portfolio Weight Concentration* 이다.) 즉 "트랜스포머가 LSTM 보다 낫다"는 **이 논문이 검증한 명제가 아니다.**
- **대안 B: CNN 만.** 국소 패턴은 잡지만 30일 창 전체에서 "언제의 패턴이 지금 중요한가"를 못 정한다.
- **대안 C: 트랜스포머만.** 원 시계열에 바로 어텐션을 걸면 토큰이 스칼라 하나라 유사도가 빈약하다. CNN 이 각 시점을 **8차원 패턴 벡터로 승격**시켜야 닷프로덕트 유사도가 의미를 갖는다. **CNN 은 사실상 토크나이저다.**

**④ 조심할 점 — 위치 인코딩이 없다**
본문 §II.D.3 과 Appendix C.2 의 정의 어디에도 **위치 인코딩(positional encoding) 항이 등장하지 않는다.** 표준 트랜스포머라면 순열불변성 때문에 PE 가 필수인데, 여기서는 (i) CNN 이 국소 순서를 이미 인코딩하고, (ii) 어텐션이 **마지막 시점 $\tilde x_L$ 을 기준으로** 다른 시점을 보는 비대칭 구조이며, (iii) 신호가 $h^{\text{proj}}_L$ 하나로 축약되므로 "마지막으로부터의 상대 위치"가 암묵적으로 들어간다. 그러나 **이건 논문이 논증한 것이 아니라 구조에서 따라오는 것**이고, Figure 15~17 에서 "헤드가 창의 앞쪽/뒤쪽에 주목한다"는 해석은 정확히 이 암묵적 위치 정보의 산물이다. 이 지점은 §09 에서 APF 연결의 핵심 고리가 된다.

또 하나: 어텐션 가중치 $w_{l,j,i}$ 는 $L$ 개 시점에 대한 **softmax 라서 합이 1**이다. Figure 15·16 의 y축이 0.02~0.06 근처에 몰려 있는 이유가 이것이다($1/30\approx0.033$ 이 균등 기준선). **즉 관찰된 편차는 균등 대비 ±50% 수준이지, 특정 날짜에 몰빵하는 구조가 아니다.**

## 배분

$$\boldsymbol{w^{\epsilon|\text{CNN+Trans}}}\left(\theta^{\text{CNN+Trans}}\right)=\boldsymbol g^{\text{FFN}}\left(\theta^{\text{CNN+Trans}}\right)$$

트랜스포머 뒤의 FFN 은 Vaswani et al.(2017) 식 2층 구조이며, 중간층 크기(HDN)와 드롭아웃(DRP)이 하이퍼파라미터다(Appendix C.2).

## 핵심 한 문장

> **CNN 은 "무엇이 보이는가"(국소 기저 8개)를, 트랜스포머는 "그것이 언제 보이는가가 왜 중요한가"(전역 기저 4개)를 담당하며, 이 분업 자체가 §III.N 의 사후 해부를 가능하게 만든 설계상의 선물이다 — 해석 가능성이 사후에 얻어진 게 아니라 아키텍처 분할에서 나왔다.**
