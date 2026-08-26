# 4. 방법론 해부 (c) — 신호·배분 함수와 결합 최적화 (식 2~6)

> **배경 사다리**: ① "효용함수 $U$"는 투자자가 결과를 얼마나 좋아하는지 점수로 환산한 함수. ② "$\|v\|_1$"은 벡터 원소의 절댓값을 다 더한 값(L1 노름) — 여기서는 "총 베팅 규모"를 뜻한다. ③ "조건부 기댓값 $\mathbb{E}_{t-1}$"은 어제까지 아는 정보만으로 계산한 평균.

## 이 부분이 왜 필요한가

앞 절에서 **무엇을 거래할지**(잔차)가 정해졌다. 이제 두 질문이 남는다: 지난 30일 곡선에서 **무엇을 읽어낼 것인가**(신호), 그리고 그 읽은 값으로 **얼마나 베팅할 것인가**(배분). 고전 문헌은 이 둘을 따로 풀었다 — 먼저 OU 파라미터를 적합시키고(신호), 그 파라미터로 임계값 규칙을 적용한다(배분). 이 논문은 둘을 하나의 최적화로 묶는다.

## 신호 함수 (§II.B)

입력은 최근 $L$ 개 지연 잔차:

$$\epsilon^L_{n,t-1}:=\begin{pmatrix}\epsilon_{n,t-L}&\cdots&\epsilon_{n,t-1}\end{pmatrix}$$

신호 함수는 $\mathbb{R}^L\to\mathbb{R}^p$ 사상 $\boldsymbol\theta(\cdot):\epsilon^L_{n,t-1}\to\theta_{n,t-1}$ 이다. 실제 입력은 잔차를 **누적**한 값이다(§II.D 도입부의 $\mathrm{Int}$ 연산):

$$x:=\mathbf{Int}\left(\epsilon^L_{n,t-1}\right)=\begin{pmatrix}\epsilon_{n,t-L}&\sum_{l=1}^{2}\epsilon_{n,t-L-1+l}&\cdots&\sum_{l=1}^{L}\epsilon_{n,t-L-1+l}\end{pmatrix}$$

즉 수익률의 누적합 = **잔차 "가격" 경로**를 본다. 저자 표현: "We can view the cumulative residuals as the residual 'price' process."

> **왜 누적인가**: 평균회귀는 수익률이 아니라 **가격 수준**의 성질이다. 일별 수익률만 보면 되돌아옴을 읽기 어렵고, 누적하면 "지금 어느 정도 벗어나 있는가"가 곡선의 높이로 보인다. 대신 누적은 **비정상성(추세)** 을 도입할 위험이 있는데, 이건 $L=30$ 이라는 짧은 창으로 제한된다.

원문은 신호가 거래 정책의 **충분통계량**이라고 선언한다 — "all relevant information for trading decisions is summarized in it". 여기서 나오는 강한 함의: **같은 신호를 가진 두 잔차는 같은 가중치를 받는다.** 신호가 차익 포트폴리오들의 동치류(equivalence class)를 정의하는 것이다.

## 배분 함수와 결합 최적화 (§II.C)

배분 함수는 $\boldsymbol{w^\epsilon}:\theta_{n,t-1}\to w^\epsilon_{n,t-1}$ 이고, 오목 효용 $U(\cdot)$ 하에서 **식 (2)(3)**:

$$\max_{\boldsymbol{w^\epsilon}\in\boldsymbol W,\ \boldsymbol\theta\in\Theta}\ \mathbb{E}_{t-1}\left[U\left(w^{R\ \top}_{t-1}R_t\right)\right] \qquad (2)$$

$$\text{s.t.}\quad w^R_{t-1}=\frac{w^{\epsilon\ \top}_{t-1}\Phi_{t-1}}{\|w^{\epsilon\ \top}_{t-1}\Phi_{t-1}\|_1}\quad\text{and}\quad w^\epsilon_{t-1}=\boldsymbol{w^\epsilon}(\boldsymbol\theta(\epsilon^L_{t-1})) \qquad (3)$$

구체적 목적함수는 **식 (4)(5)**:

$$\max_{\boldsymbol{w^\epsilon},\boldsymbol\theta}\ \frac{\mathbb{E}\left[w^{R\ \top}_{t-1}R_t\right]}{\sqrt{\mathrm{Var}(w^{R\ \top}_{t-1}R_t)}}\qquad\text{or}\qquad \max_{\boldsymbol{w^\epsilon},\boldsymbol\theta}\ \mathbb{E}[w^{R\ \top}_{t-1}R_t]-\gamma\,\mathrm{Var}(w^{R\ \top}_{t-1}R_t) \qquad (4)$$

비교 대상인 **분리 추정**은 **식 (6)** 이다 — 신호 $\theta_{t-1}$ 을 먼저 고정한 뒤 배분만 최적화:

$$\max_{w^\epsilon\in\boldsymbol W}\ \mathbb{E}_{t-1}\left[U\left(w^{R\ \top}_{t-1}R_t\right)\right]\quad\text{s.t.}\quad w^R_{t-1}=\frac{w^\epsilon(\theta_{t-1})^\top\Phi_{t-1}}{\|w^\epsilon(\theta_{t-1})^\top\Phi_{t-1}\|_1} \qquad (6)$$

**① 기호 뜻**
- $w^\epsilon_{t-1}$: 잔차(차익 포트폴리오)별 가중치. $w^R_{t-1}$: 실제 주식별 가중치.
- 분모 $\|\cdot\|_1$: 주식 가중치 절댓값 합을 1로 만드는 정규화 = **레버리지 제약**(원문: "The stock weights $w_{t-1}$ are normalized to add up to one in absolute value, which implicitly imposes a leverage constraint").
- $\gamma$: 위험회피 계수. 실험에서는 $\gamma=1$(§III.E).
- $\Theta,\boldsymbol W$: 신호·배분 함수가 사는 함수공간. 여기를 얼마나 크게 잡느냐가 모형 3종의 차이다.

**② 일상 비유**
과외 선생(신호)과 학생(배분)이 있다. 기존 방식은 선생을 "설명을 정확히 하는가"로 평가하고, 그 설명을 받은 학생 성적은 따로 봤다. 이 논문은 **선생을 학생의 최종 성적으로만 평가**한다. 그러면 선생은 "정확한 설명"이 아니라 "이 학생이 시험을 잘 보게 하는 설명"을 하게 된다.

**③ 왜 이 형태여야 하나**
- **대안 A: MSE 예측 후 임계값.** 잔차의 다음 값을 예측하고 예측 부호로 매매. 문제는 MSE 최적 예측이 거래 최적과 다르다는 것 — 예측 오차가 큰 구간이 오히려 수익 기회일 수 있고, 예측이 정확해도 베팅 크기가 틀리면 Sharpe 는 나쁘다.
- **대안 B: 강화학습.** 상태·행동·보상으로 두고 정책을 학습. 저자들은 Cong et al.(2020)을 인용하지만 채택하지 않는다. 여기서는 **보상이 한 스텝 뒤에 즉시 확정**되고(다음 날 수익) 상태전이가 정책에 거의 영향받지 않으므로(개별 소액 전략은 가격에 영향 없음 — 이건 시장충격 무시 가정이다), **미분 가능한 한 스텝 최적화**로 충분하다. 이게 RL 없이 SGD 로 학습 가능한 이유다.
- **Sharpe 를 목적으로 두는 대가**: Sharpe 는 분모에 표본 표준편차가 들어가 **배치 전체에 대한 비분해적(non-decomposable) 손실**이다. 저자들은 학습 집합 위의 연율화 표본 평균·분산으로 대체해 계산한다(Appendix D). 각주 3 에 흥미로운 실무 노트가 있다 — 평균-분산에서 관례적인 분산 페널티 대신 **표준편차**를 쓰는 것이 수치적으로 유리했다고 적는다("we found it is numerically beneficial to use the standard deviation instead").

**④ 조심할 점**
- **분해 비유일성**: $w^\epsilon(\boldsymbol\theta(\cdot))$ 의 합성에서 신호/배분 경계는 유일하지 않다(§II.C 명시). 따라서 "신호가 중요하다"는 결론은 **"시간 구조를 명시적으로 모형화하는 층"이 중요하다**로 읽어야 안전하다.
- **정규화의 부작용**: $\|w^R\|_1=1$ 은 레버리지를 막지만, 동시에 **베팅 크기의 절대 스케일을 학습에서 제거**한다. 모델은 "얼마나 크게 걸까"가 아니라 "어디에 얼마 비중으로 걸까"만 배운다. 그래서 확신이 낮은 날에도 총 노출은 항상 1이다 — 현금 비중을 늘려 물러설 자유가 없다. Figure 7 이 보여주듯 공매도 비중은 대체로 0.5 근처를 맴돈다.
- **조건부 기댓값의 실체**: 식 (2)의 $\mathbb{E}_{t-1}$ 는 실제로는 학습 창 전체의 표본 평균으로 근사된다. 즉 "조건부"라는 표기에도 불구하고 학습은 **창 안에서 정상성(stationarity)을 가정**한다. 롤링 재추정(1,000일 창, 125일마다)이 이 가정의 완충장치다.

## 세 모형의 신호 (§II.D.1~2)

**OU 모형**: $dX_t=\kappa(\mu-X_t)dt+\sigma dB_t$ 를 AR(1) $X_{t+1}=a+bX_t+e_t$ 로 이산 추정하며, 추정량은 $\hat\kappa=-\frac{\log(\hat b)}{\Delta t}$, $\hat\mu=\frac{\hat a}{1-\hat b}$, $\frac{\hat\sigma}{\sqrt{2\kappa}}=\sqrt{\frac{\hat\sigma_e^2}{1-\hat b^2}}$ 이다(Appendix B). 신호는 5개 성분:
$$\theta^{\mathrm{OU}}_{n,t-1}=\begin{pmatrix}\hat\kappa_{n,t-1}&\hat\mu_{n,t-1}&\hat\sigma_{n,t-1}&\textstyle\sum_{l}\epsilon_{n,\cdot}&R^2_{n,t-1}\end{pmatrix}$$
(네 번째 성분은 원문 표현으로 "the last cumulative sum" — 누적잔차 경로의 마지막 값이다. 첨자 세부 표기는 PDF 판독에서 완전히 확정하지 못해 $\sum_l\epsilon$ 로 둔다.)
배분은 임계값 규칙 — $\frac{X_L-\mu}{\sigma/\sqrt{2\kappa}}>c_{\text{thresh}}$ 이고 $R^2>c_{\text{crit}}$ 이면 $-1$, 반대면 $+1$, 아니면 $0$. 하이퍼파라미터는 검증에서 $c_{\text{thresh}}=1.25$, $c_{\text{crit}}=0.25$ 로 선택됐고, 저자들은 이 값이 Avellaneda·Lee(2010)·Yeo·Papanicolaou(2017)의 최적값과 일치한다고 적는다(Appendix B).

**FFT 모형**: $x_l=a_0+\sum_{j=1}^{L/2-1}\left(a_j\cos\frac{2\pi j}{L}l+b_j\sin\frac{2\pi j}{L}l\right)+a_{L/2}\cos(\pi l)$ 의 계수 $\theta^{\mathrm{FFT}}\in\mathbb{R}^L$ 을 신호로 쓰고 FFN 으로 배분. **FFT 는 가역변환이므로 정보 손실이 없다** — 저자들의 지적이 날카롭다: 정보가 같은데도 성능이 다르다면, 차이는 **표현(representation)** 에서 온다. 그래서 "잔차 원본 + FFN"(§III.G 두 번째 ablation)이 "FFT 계수 + FFN"보다 나쁘다는 결과가 의미를 갖는다.

## 핵심 한 문장

> **식 (2)~(6)의 진짜 내용은 신경망이 아니라 "채점표를 예측에서 거래로 옮기고, 신호와 정책을 한 번에 채점한다"는 결정이며, 이 결정이 §III.G 의 ablation 을 통해 논문 전체의 실증적 중심이 된다.**
