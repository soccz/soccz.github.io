# 5. 실험 해부 (B) — 해석 시도(§IV)와 전이학습(§V)

앞 파일이 "얼마나 잘 맞히나"를 다뤘다. 이 파일은 **"무엇을 배웠나"(§IV)** 와 **"어디까지 옮겨지나"(§V)** 를 다룬다. 사용자의 mechanistic interpretability 피벗에 직접 닿는 부분은 §IV이므로 그쪽을 더 깊이 파낸다.

## 배경 사다리

① **프로빙(probing)** = 블랙박스 모델의 출력이나 내부 표현을, 우리가 이미 의미를 아는 변수들로 회귀해서 "무엇에 대응하는지" 알아내는 기법. ② **McFadden $R^2$** = 로지스틱 회귀용 결정계수. 절편만 있는 모형 대비 로그우도가 얼마나 개선됐는지의 비율. ③ **전이학습(transfer learning)** = A 환경에서 학습한 모델을 B 환경에 (재학습 없이) 가져다 쓰는 것.

---

## §IV — 해석 시도: 저자들이 실제로 한 것과 하지 않은 것

### 저자들의 자기 규정

§IV 도입부(p.3219) verbatim: "Interpreting a CNN is difficult due to its recursive nonlinear structure. We attempt to interpret the predictive patterns identified by the CNN using two approaches... **Our attempts at interpretation are admittedly incomplete (as in the CNN literature more broadly). Notwithstanding, they achieve partial success by offering some insight into the complex inner workings of the CNN model.**"

**이 문장을 mechanistic interpretability 관점에서 정확히 위치시키는 것이 이 절의 핵심 작업이다.** 저자들이 한 것은 두 가지 모두 **행동적(behavioral) 프로빙**이다 — 모델의 **입출력 관계**를 외부에서 관찰한다. 그들이 하지 않은 것은 **기계론적(mechanistic) 분석** — 모델 **내부**(필터 가중치, 중간 활성값, 채널별 역할)를 열어 보지 않는다.

| 방법 | 저자가 했는가 | 무엇을 알 수 있는가 | 무엇을 알 수 없는가 |
|---|---|---|---|
| 예측값 vs 기존 특성 상관 (§IV.A) | ✅ | 출력이 알려진 신호와 얼마나 겹치나 | 왜 그렇게 되나 |
| 원 데이터로 출력 근사 (§IV.B) | ✅ | 사람이 읽을 수 있는 근사 규칙 | 근사 오차 부분의 정체 |
| 척도·차원 대조 실험 (§IV.B Table IX) | ✅ | 어느 **표현 성분**이 인과적으로 중요한가 | 모델 내부의 어느 부분이 그것을 계산하나 |
| **필터 시각화** (학습된 5×3 필터를 그려 보기) | ❌ | — | — |
| **활성화 최대화** (어떤 입력이 특정 채널을 최대 활성하나) | ❌ | — | — |
| **Grad-CAM / saliency map** (예측에 기여한 픽셀 영역) | ❌ | — | — |
| **채널 절제(ablation)** (특정 채널을 0으로 만들고 성능 변화 측정) | ❌ | — | — |
| **회로 발견** (예측을 만드는 계산 경로 특정) | ❌ | — | — |

**이 공백이 왜 중요한가**: 이 논문은 이미지 + CNN을 쓰면서 **컴퓨터비전 해석론의 표준 도구를 하나도 쓰지 않았다.** Grad-CAM(2017)이나 필터 시각화(Zeiler·Fergus 2014 — 저자들이 채널 증식 논거로 인용한 바로 그 논문)는 2020년에 이미 표준이었다. 특히 Grad-CAM 계열은 **"이미지의 어느 영역이 예측을 만들었나"** 를 히트맵으로 보여 주므로, "차트의 어느 부분을 보나(최근 며칠? 고가 근처? 거래량?)"라는 이 논문의 중심 질문에 직접 답한다. 저자들이 §IV.B에서 로지스틱 근사로 힘들게 추론한 "첫 번째 lag이 가장 중요하다"는 결론을 **Grad-CAM은 그림 한 장으로 보여 준다.**

이것이 **§4-bis 정신으로 말할 수 있는 것과 없는 것의 경계**다. 원문이 이 도구들을 쓰지 않은 것은 확인된 사실이고, "왜 안 썼는가"는 원문에 없으므로 추측하지 않는다. 다만 **결과적으로 이 논문이 남긴 구멍이 사용자의 APF 프레임이 정확히 채우는 구멍**이라는 점은 §9에서 다룬다.

### §IV.A의 진짜 발견 — 지평별 신호 재발견

[Claim 2](04_claims_a_claim1_2.md)에서 Table V·VI·VII을 이미 해체했다. 실험 설계 관점에서 강조할 것은 **이것이 sanity check로서 매우 강력하다**는 점이다.

감독 지평만 바꾸면(같은 이미지 길이) 모델이 그 지평에 맞는 기존 신호를 자동으로 재발견한다:
- I5/R5 → WSTR(1주 반전)과 −0.34, MOM과 **0.00**
- I60/R60 → MOM과 **0.21**, WSTR과 −0.01

**부호의 방향까지 맞다.** 주간 지평에서 반전 신호와 **음의** 상관이라는 것은, CNN이 "최근 오른 종목은 내릴 것"이라는 반전 논리를 학습했다는 뜻이다(WSTR 신호가 큰 = 최근 많이 오른 종목이므로). 60일 지평에서 모멘텀과 **양의** 상관은 "오른 종목이 계속 오른다"는 지속 논리다. **아무도 가르쳐 주지 않았는데 지평에 따라 반전↔지속을 스스로 전환한다** — 이것이 이 논문에서 가장 설득력 있는 "모델이 진짜 뭔가를 이해했다"의 증거다.

**단, 앞 파일에서 지적한 교란을 다시 상기해야 한다**: 세 모델은 아키텍처(stride·dilation·층수·파라미터 수)도 다르므로, 이 상관 구조 이동은 순수하게 감독 지평의 효과가 아니다. **깨끗한 검증은 "아키텍처 고정 + 감독 지평만 변경"인데, 논문 설계상 이미지 길이와 아키텍처가 묶여 있어 불가능하다.** (I5 이미지로 R5·R20·R60 세 지평을 예측하는 조합은 Table IX에 있으므로 부분적으로는 분리 가능하다 — I5 고정 시 지평별 샤프 7.15 / 2.35 / 1.30. 다만 Table V의 상관 구조는 이 조합으로 재보고되지 않는다.)

### §IV.B의 진짜 발견 — 사람이 읽을 수 있는 규칙 하나

원문 p.3226 verbatim: "We find that the largest regression coefficients tend to be on the first lag of the high, low, and close prices. Taken together, their coefficients suggest a signal that is roughly equal to $\frac{1}{2}(\text{High} + \text{Low}) - \text{Close}$ for the previous day. In other words, **future returns tend to be high when the price closes at the low end of the recent high-low range.**"

### 이 신호의 4줄 해석

1. **기호 뜻**: High, Low, Close = 전일의 고가·저가·종가 (모두 **이미지 척도로 정규화된 값**, [0,1] 무단위). $\tfrac{1}{2}(\text{High}+\text{Low})$ = 그날 범위의 중점.
2. **일상 비유**: **하루의 줄다리기 결과를 읽는 것**이다. 그날 가격이 위아래로 오갔던 범위의 중간점보다 **마감 가격이 아래쪽**이면(즉 매도세가 마지막에 이겼으면), 다음 기간에 오른다. 마치 "너무 세게 눌린 스프링이 되튄다"는 것과 같다.
3. **왜 이 형태**: 이것은 사실 문헌에 이름이 있는 양이다 — 일중 반전(intraday reversal) 또는 종가의 범위 내 상대위치. 그리고 **min–max 척도가 이 신호를 표현할 수 있게 만든 유일한 척도**임을 상기하라([Claim 3](04_claims_b_claim3_5.md)) — 탈변동성 수익률 척도는 차분으로 레벨을 파괴하므로 이 신호를 원리적으로 담을 수 없고, 그래서 CNN1D(devol) 샤프가 −0.13으로 붕괴한다. **§IV.B의 발견과 Table IX의 발견이 서로를 설명한다.**
4. **조심할 점**: 이 규칙은 **근사의 일부일 뿐**이다. 로지스틱 근사가 CNN 출력 변동의 21.86~35.16%만 설명하므로(Table VIII McFadden $R^2$), 이 규칙은 CNN이 하는 일의 3분의 1 이하다. 저자도 이를 반복 명시한다(p.3226): "the approximating pattern explains less than half of the content in CNN predictions."

**추가 발견**: "The regression also isolates features that look like deviations of the lagged prices from their recent averages. **Recent rises in volume also notably predict positive future returns**"(p.3226). Table VIII 발췌에서 거래량 시차 계수가 유의하다(vol lag 2: 0.21*/0.52*/0.58*, vol lag 3: 0.13*/0.15*/0.57*, vol lag 4: −0.07*/0.12*/0.09*, vol lag 5: 0.05*/0.01/0.30*). → 이미지 면적의 1/5만 차지하는 거래량이 실질적 예측 성분.

### §IV.B의 결정적 대조 — 비선형성의 몫

Table VIII의 마지막 행들(p.3227)이 **CNN vs 로지스틱의 최종 판정**이다:

| 지표 | 값 |
|---|---|
| CNN 출력 근사 McFadden $R^2$ (5·20·60일 지평) | 35.16 / 33.15 / 21.86 |
| **수익률 예측 OOS McFadden $R^2$** — CNN 단독 | **0.73 / 0.47 / 1.33** |
| 같은 것 — 로지스틱(이미지 척도) 단독 | 0.55 / 0.47 / 1.39 |
| 같은 것 — CNN + 로지스틱 결합 | 0.73 / 0.46 / 1.24 |

**세 가지를 읽어야 한다**:
1. **절대 수준이 1% 내외다.** 이 논문 전체의 예측력이 OOS McFadden $R^2$ 로 0.5~1.4%다. 샤프 7.15는 이 미약한 우위를 수천 종목 × 950여 주에 걸쳐 반복 누적한 결과다. **논문이 이 숫자를 강조하지 않으므로 독자가 오독하기 쉽다.**
2. **주간 지평에서만 CNN이 로지스틱을 이긴다** (0.73 vs 0.55). 20일 지평은 동일(0.47 vs 0.47), 60일 지평은 **로지스틱이 이긴다**(1.33 vs 1.39). 저자 서술(p.3227): "The logistic approximation delivers a lower $R^2$ at the weekly horizon, yet a **similar $R^2$ at monthly and quarterly horizons**... the nonlinear component of the CNN forecast incorporates useful additional information **most evident at a shorter horizon.**" → **딥러닝의 가치가 초단기에 국한된다.**
3. **결합 모형이 CNN 단독보다 나쁘다** (0.73 vs 0.73, 0.46 vs 0.47, 1.24 vs 1.33). 저자 서술(p.3227): "The combined $R^2$... is worse than that of the CNN-only regression" 그리고 "controlling for the underlying market data does not increase the predictive coefficient on the CNN-based forecast." → 로지스틱이 추가 정보를 주지 않는다(CNN이 이미 그 정보를 포함).

---

## §V — 전이학습: 무엇이 진짜 발견인가

[Claim 4](04_claims_b_claim3_5.md)에서 수치를 다뤘다. 실험 설계 관점에서 세 가지를 추가한다.

### ① 국제 전이 설계의 강점 — 대조군이 정확하다

이 실험의 설계가 좋은 이유는 **비교 대상이 "아무것도 안 함"이 아니라 "현지 재학습"** 이라는 점이다(§V.A, p.3233): "We assess the benefits of transfer learning by comparing with **otherwise identical CNN models estimated using local image data** for each foreign market." 즉 아키텍처·전처리·정규화를 모두 동일하게 두고 **학습 데이터만** 미국 vs 현지로 바꾼다. 이보다 깨끗한 전이 실험 설계는 드물다.

**결과 요약** (Table X, p.3234):

| | 전이(미국 모델) | 현지 재학습 | 유의한 개선 국가 수 |
|---|---|---|---|
| 동일가중 평균 샤프 | **3.6** | 2.3 | 20 / 26 (개선 자체는 21/26) |
| 시총가중 평균 샤프 | **1.9** | 1.0 | 22 / 26 |

### ② 저자들의 정직한 자기-약화 — Figure 9

**이것이 §V에서 가장 중요한 그림이다.** Figure 9(p.3235)는 국가별 샤프 이득을 종목 수에 대해 산점도로 그린다. 저자 해석(p.3236) verbatim: "In these countries [작은 시장], portfolio Sharpe ratios tend to benefit especially from U.S. transfer relative to locally trained CNN models. But **for larger markets on the right side of the plots, the expected gains (based on the best-fit line) are small or slightly negative.** These results suggest there are benefits to local retraining when there is sufficient data, **likely due to some degree of heterogeneity in predictive patterns across countries** that transfer learning does not account for."

**해석**: 전이 이득의 상당 부분은 "패턴이 보편적"이어서가 아니라 **"현지 데이터가 부족해서 현지 모델이 과적합하기 때문"** 이다. 이는 전이학습의 표준 현상이며(적은 데이터 + 강한 사전확률 > 많은 파라미터 + 적은 데이터), "가격 패턴은 전 지구적 현상"이라는 더 강한 해석은 데이터가 지지하는 범위를 넘는다. 그리고 저자들이 이를 스스로 지적한다. **이것을 은폐하지 않고 제안까지 붙인다** — "A direction for further optimization... would combine a global image model to capture shared differences with a country-specific model that accommodates some degree of heterogeneity. The model weights in this combination could be dictated by the relative informativeness of global and country-specific data **in a Bayesian fashion**"(p.3236). 즉 계층적 베이즈 축소(hierarchical shrinkage)를 후속 방향으로 제시.

### ③ 국제 전이의 결정적 제약 — 첫 5일만

원문 p.3236 verbatim: "In Tables IA.VII and IA.VIII, we also decompose the monthly strategy performance into returns on days 1 to 5 versus days 6 to 20. There we find that **international return prediction is insignificant beyond the first five days.**"

**미국(Table III: 6~20일 샤프 0.4/1.2/0.8, 전부 10% 유의 이상)과의 대비가 결정적이다.** 이 비대칭은 두 해석 중 하나를 시사한다:
- **해석 A (유동성 프리미엄)**: 신호가 실제로는 초단기 유동성 공급 대가이고, 미국의 6~20일 지속성은 미국 시장 고유의 (더 깊은 시장·더 느린 정보 확산 등) 특성 때문이다.
- **해석 B (데이터 품질)**: 국제 데이터(Datastream, 중위 300종목)의 노이즈가 커서 약한 장기 신호가 검출되지 않는다.

논문은 이 두 해석을 구분하지 않는다. **어느 쪽이든 "가격 패턴이 보편적"이라는 주장은 "초단기 가격 패턴이 보편적"으로 축소되어야 한다.**

### ④ 시간척도 전이 — 가장 이론적으로 도발적인 결과

**설계의 영리함**(§V.B, p.3236–3237): I5/R5 모델은 **5기간 이미지**를 받는다. "1기간 = 1일"이라는 해석을 **"1기간 = 4일"** 로 바꾸면, 같은 모델이 20일 데이터를 받는다. 각 OHLC 바가 4일 구간의 시가·고가·저가·종가를 나타내게 된다. 원문: "By down-sampling market data from once per day to once every four days, we can apply I5/R5 estimates to a 20-day image."

**결과** (Table XI·XII):

| | 1:4 척도 (I5/R5 → 20일/20일) | 1:12 척도 (I5/R5 → 60일/60일) |
|---|---|---|
| 기준선 (정공법 CNN) | (I20/R20) | EW 0.4 / VW 0.5 |
| 저빈도 재학습 | EW 2.2 / VW 0.3 | EW 0.4 / VW 0.0 |
| **전이** | EW **2.1** / VW **0.7** | EW **0.9** / VW **0.3** |
| 50/50 기준선+전이 | EW **2.5** | — |

**세 가지 관찰**:
1. **1:12 척도에서 전이가 정공법을 2배 이상 상회한다**(0.9 vs 0.4). 즉 **저빈도 예측을 하려면 저빈도 데이터로 학습하지 말고 고빈도 데이터로 학습한 뒤 접어서 쓰는 게 낫다.** 이는 금융 데이터의 근본 제약(§V.B 도입부: "we experience only one history of financial market prices")에 대한 실용적 우회로다.
2. **전이 신호와 기준선 신호의 상관이 42%뿐**(p.3237)이다. 즉 두 경로가 **다른 것을 본다.** 그래서 50/50 결합이 각각보다 좋다(2.5 > 2.2, 2.1). 이건 앙상블 다양성의 교과서적 사례다.
3. **저자의 이론적 해석과 그 한계**: p.3239 verbatim — "This evidence of time-scale transfer is inconsistent with the linear autoregressive model ubiquitous in models of price dynamics and conditional expected returns. Instead, these patterns are **reminiscent of the Mandelbrot (2013) hypothesis that prices are fractal processes that demonstrate self-similarity when studied at different time scales.** Honing in on a model of price dynamics that is consistent with the evidence above represents an interesting problem for future research (and unfortunately beyond the scope of this paper)."

**이 추론의 논리적 지위를 정확히 하자.** 자기유사성 → 시간척도 전이 작동은 성립한다. 그러나 **역은 성립하지 않는다.** 대안 설명: 모델이 학습한 것이 $\tfrac{1}{2}(\text{High}+\text{Low}) - \text{Close}$ 같은 **척도 불변(scale-free) 통계량**이라면, 그것은 어떤 시간 해상도에서도 동일하게 정의되므로 프랙탈 구조 없이도 전이가 작동한다. "4일 구간의 종가가 그 구간 범위의 아래쪽인가"는 "1일의 종가가 그날 범위의 아래쪽인가"와 **문법적으로 같은 질문**이다. 저자들이 "reminiscent of"라는 조심스러운 표현을 쓰고 구조적 설명을 명시적으로 후속 과제로 남긴 것은 적절하다.

---

## 이 파일의 핵심 한 문장 요약

> §IV의 해석은 **행동적 프로빙에 머물러 기계론적 분석(필터 시각화·saliency·채널 절제·회로 발견)을 전혀 시도하지 않았고**, 그래서 "CNN이 무엇을 배웠나"에 대해 사람이 읽을 규칙 하나($\tfrac{1}{2}(\text{High}+\text{Low})-\text{Close}$)와 "나머지 65% 이상은 비선형"이라는 잔차 진술까지만 도달한다. §V의 전이 결과는 강력하지만 저자 자신의 Figure 9(대형 시장에서 이득 소멸)와 국제 6~20일 무의미성이 "보편적 패턴" 해석을 **"초단기 척도불변 통계량의 보편성"** 으로 축소한다.
