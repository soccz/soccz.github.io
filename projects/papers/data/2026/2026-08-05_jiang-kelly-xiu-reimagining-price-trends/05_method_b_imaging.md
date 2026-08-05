# 4. 방법론 해부 (B) — "이미징": OHLC 바를 픽셀로 바꾸는 규약

## 이 부분이 왜 필요한가

앞 파일에서 확인한 결론 — 성능의 실질적 원천은 이미지 안에 숨은 재척도화다 — 를 따라가려면, **"이미지로 만든다"가 정확히 어떤 연산의 나열인지** 픽셀 단위로 열어야 한다. 저자들이 인터넷에서 차트를 긁어오지 않고 직접 그린 이유도 여기에 있다. 원문 §I(p.3198) verbatim: "While these charts (and many variations on them) can be captured from the Internet, we generate our own price charts from scratch. This allows us to conduct various experiments by **controlling the amount of information that our CNN 'trader' can observe**." — **CNN 트레이더가 볼 수 있는 정보량을 통제하기 위해서**다. 이것은 해석 가능성을 위한 설계 결정이며, §IV의 해석 시도와 §IV.B의 척도 대조 실험을 가능하게 한 전제다.

## 배경 사다리

① **OHLC**는 하루의 네 가격이다 — Open(시가, 장 시작 가격), High(고가, 그날 최고), Low(저가, 그날 최저), Close(종가, 장 마감 가격). ② **OHLC 바**는 이 넷을 하나의 기호로 그린다: 세로 막대가 고가~저가 범위를 나타내고, 왼쪽으로 튀어나온 짧은 가로선이 시가, 오른쪽이 종가다. ③ **픽셀 행렬**은 이미지를 숫자 표로 본 것이다 — 각 칸이 밝기 값(여기선 0 또는 255)을 갖는 2차원 배열.

---

## 규약 1 — 가격 재구성: 왜 원 가격을 쓰지 않는가

원문 §III.A(p.3206)의 정의:

$$p_{t+1} = (1 + \text{RET}_{t+1})\, p_t$$

그리고 "In each image, we normalize the first day closing price to one" — 창의 첫날 종가를 1로 두고, CRSP 수익률로 이후 종가를 누적 구성한다. 각 날의 시가·고가·저가는 그날 종가 수준에 비례해 배율 조정된다.

### 4줄 해석

1. **기호 뜻**: $p_t$ = 창 내 $t$번째 날의 재구성된 종가 (단위 없음, 첫날 = 1). $\text{RET}_{t+1}$ = CRSP가 제공하는 $t+1$일 총수익률 (배당·분할 조정 후, 단위 = 비율).
2. **일상 비유**: 어떤 회사의 주가를 "액면분할·배당을 다 걷어낸 순수 가치 성장 배수"로 다시 그리는 것이다. 실제 가격이 100원 → 200원 → (2:1 분할) → 100원이었다면, 재구성 경로는 1 → 2 → 2로 **분할 때문에 반토막 나는 가짜 급락이 사라진다.**
3. **왜 이 형태**: 원 가격을 쓰면 이미지에 **인공적 절벽**이 생긴다. 2:1 분할일에는 −50% 급락으로 보이고, 배당락일에는 배당률만큼 하락으로 보인다. CNN은 이런 절벽을 강력한 시각 특성으로 학습하는데, 그것은 예측 신호가 아니라 **회계 처리의 흔적**이다. 원문 표현(p.3198): "We replace prices by CRSP-adjusted returns to translate the opening, closing, high, and low prices into relative scales that abstract from price effects of stock splits and dividend issuance."
4. **조심할 점**: 이 변환은 **레벨 정보를 창 안으로만 제한**한다. "이 주식이 역사적 고점 대비 어디인가"라는 정보는 사라진다(창 밖 역사는 안 보임). 52주 최고가 대비 위치(52WH)와 CNN 예측의 상관이 I5/R5에서 −0.02에 불과한 것(Table V)이 이 설계의 직접 귀결이다. 또한 첫날 종가를 1로 두는 것은 다음 규약(min–max)에 의해 **덮어써진다** — 최종 이미지에서 첫날 종가는 1이 아니라 창 내 상대 위치에 놓인다.

---

## 규약 2 — 기하학화: 하루 = 가로 3픽셀

원문 §I.A(p.3198–3199):

- 고가·저가 = 가운데 세로 바의 위·아래 끝
- 시가 = 바 왼쪽의 짧은 가로선, 종가 = 오른쪽의 짧은 가로선
- **하루가 가로 3픽셀** — 중앙 바, 시가 표시, 종가 표시가 각각 1픽셀
- $n$일 이미지의 폭 = $3n$ 픽셀 → 5일 = 15px, 20일 = 60px, 60일 = 180px

**왜 3픽셀인가 (원문에 근거 없음, 구조적 추론)**: 원문은 3픽셀 선택의 이유를 별도로 논증하지 않는다. 구조적으로 보면 3은 **시가·종가를 좌우로 분리하기 위한 최소 폭**이다. 1픽셀이면 세 정보가 겹쳐 시가·종가 구분이 불가능하고, 2픽셀이면 중앙 바의 위치가 비대칭이 된다. 즉 3은 OHLC를 손실 없이 표현하는 최소 해상도다.

**중요한 부작용 — 시가/종가는 각각 1픽셀 점이다.** 세로 바는 고가~저가 범위 전체를 채우지만, 시가와 종가는 **각각 단 하나의 픽셀**로 표시된다. 즉 이미지에서 시가·종가의 시각적 비중이 고가·저가 범위보다 압도적으로 작다. 그런데 §IV.B의 로지스틱 근사에서 가장 큰 계수를 받은 것이 **종가 1차 시차**였다(p.3225: "the most important explanatory variables for the CNN forecast are the first lags of closing, high, and low prices"). → **CNN은 픽셀 면적이 가장 작은 요소에 가장 크게 의존한다.** 이는 CNN이 면적이 아니라 상대적 위치 관계를 학습한다는 증거이면서, 동시에 그 1픽셀이 양자화 오차에 가장 취약한 지점이라는 뜻이기도 하다.

---

## 규약 3 — 재척도화: 이 논문의 실질적 심장

원문 §I.A(p.3199) verbatim: "Once days are concatenated, we impose a constant height for all images and **scale the vertical axis so that the maximum and minimum of the OHLC path coincides with the top and bottom of the image.** As a result, all images for the same number of days have the same pixel dimensions."

수식으로 옮기면, 창 $W$ 내의 모든 가격 $x$ (시가·고가·저가·종가·이동평균 전부)에 대해:

$$\tilde{x} = \frac{x - \min_{W}}{\max_{W} - \min_{W}}$$

여기서 $\max_W$ 는 창 안에 등장하는 모든 가격의 최댓값 — 원문 §IV.B(p.3223)가 명확히 한다: "the maximum of all prices appearing in the image (**usually the maximum high price, but sometimes the maximum moving average price**)". 즉 이동평균선이 고가를 넘는 경우도 있으므로 최댓값은 OHLC만이 아니라 **이동평균선까지 포함한 전체**에서 취한다. 거래량도 같은 방식으로 창 내 최대 거래량으로 정규화된다.

### 4줄 해석

1. **기호 뜻**: $\tilde{x} \in [0, 1]$ = 정규화된 가격 (무단위). $\min_W, \max_W$ = 이 창 안에서 관측된 최저·최고 가격 (원 가격 단위, 단 규약 1의 재구성 후). 픽셀 행 인덱스는 $\tilde{x}$ 에 이미지 높이를 곱해 얻는다.
2. **일상 비유**: 반 학생 전원의 키를 재는 대신, **각 반에서 가장 큰 애를 100점, 가장 작은 애를 0점으로 두고 나머지를 그 사이 등수로 환산**하는 것이다. 반이 농구부든 체조부든 상관없이 "우리 반에서 상대적으로 어디인가"만 남는다.
3. **왜 이 형태**: 패널 모형에서 **하나의 파라미터 집합이 모든 종목에 적용**되기 때문이다. 5달러 주식과 500달러 주식, 일변동성 1%와 8%인 주식을 같은 함수에 넣으려면 척도를 통일해야 한다. 대안들과 비교하면 이 형태의 특이점이 드러난다:
   - **대안 A: 누적수익률 척도** (창 첫날 종가로 나눔) — 레벨은 보존하지만 **변동성 정규화가 안 된다.** 변동성이 큰 종목은 이미지 안에서 가격이 크게 출렁이고, 조용한 종목은 거의 평평하다. 같은 필터가 두 경우에서 완전히 다른 반응을 낸다. Table IX 결과: 로지스틱 image scale 5.56 → cum. ret. 2.50.
   - **대안 B: 탈변동성 수익률 척도** (일별 수익률을 EWMA 변동성으로 나눔, 평활 0.05) — 변동성은 정규화되지만 **레벨을 파괴한다.** 차분(수익률)으로 바꾸는 순간 "종가가 고가-저가 범위의 아래쪽인가"라는 정보가 표현 불가능해진다. Table IX: CNN1D에서 **−0.13** (붕괴).
   - **min–max는 두 성질을 동시에 갖는 유일한 척도다** — 창 내 실현 범위로 나누므로 변동성 정규화가 되고, 차분하지 않으므로 레벨 관계가 보존된다.
4. **조심할 점 — 이 척도가 도입하는 **미래 정보 누출은 없지만 통계적 부작용은 있다**:
   - **정규화 상수가 확률변수다.** $\max_W, \min_W$ 는 창 내 데이터로만 계산되므로 **look-ahead bias는 없다**(중요). 그러나 이 두 값은 극단적 순서통계량(order statistic)이라 **단 하나의 이상 거래일이 창 전체의 척도를 결정**할 수 있다. 그날 플래시 크래시가 있었다면 나머지 19일이 이미지 중앙에 압축된다.
   - **정보의 비대칭적 소실.** 창의 실현 변동성 자체(절대 수준)는 척도로 흡수되어 **이미지에서 사라진다.** 그래서 CNN은 "이 종목이 원래 변동성이 큰가"를 알 수 없다. Table V에서 변동성(Volat.)과의 상관이 I5/R5에서 −0.01인 것은 무상관이 아니라 **설계상 관측 불가**의 결과다. 반면 60일 이미지에서는 −0.26까지 올라가는데, 이는 긴 창에서 변동성 구조가 **형태**로 드러나기 때문으로 보인다(단, 이 해석은 원문에 없는 필자 추론).
   - **픽셀 이산화 손실.** 연속값 $\tilde{x}$ 를 픽셀 행으로 반올림하는 과정에서 정보가 버려진다. 원문 Figure 4 캡션(p.3204)이 이를 예시로 인정한다: "each unit on the y-axis of the image is 0.1. Because the difference between 1.04 and 1.0 is smaller than 0.05, the discretized prices on the image are flat over the first two periods." → **1.04와 1.00이 같은 픽셀로 붕괴한다.** 이것이 [Claim 3](04_claims_b_claim3_5.md)에서 지적한 "1D가 2D를 이기는 이유 중 일부는 2D의 양자화 손실"이라는 진단의 근거다.

---

## 규약 4 — 부가 채널: 이동평균선과 거래량 바

### 이동평균선 (§I.B, p.3200)
- 창 길이와 **같은** 윈도우 길이를 쓴다 — 20일 이미지에는 20일 이동평균선.
- 각 날마다 중앙 열에 1픽셀을 찍고, 그 점들을 선으로 연결한다.
- 논거: 전통적 기술적 분석에서 이동평균은 **적정가치로부터의 이탈**을 재는 기준선이다. 원문은 Fama·French(1988)와 Kelly·Pruitt(2013)을 인용해 "The comparison of price to its moving average may be useful as a **value signal that avoids the need for balance sheet data**"라고 쓴다(p.3200) — 재무제표 없이 가치 신호를 얻는 우회로.

**여기에 미묘한 문제가 있다.** 창 길이와 이동평균 길이를 같게 두면, **창의 시작 부분에서 이동평균은 창 밖의 데이터를 필요로 한다.** 20일 이동평균의 첫 값은 그 날 이전 20일을 봐야 하는데, 그건 이미지 창의 시작 이전이다. 즉 **이동평균선은 창 밖의 정보를 이미지 안으로 밀반입하는 채널**이다. 이는 look-ahead(미래 정보)가 아니라 look-back(과거 정보 확장)이므로 부정한 것은 아니지만, "이미지가 창 내 정보만 담는다"는 순진한 독법은 틀리다. 원문은 이 점을 명시적으로 논의하지 않는다.

### 거래량 바 (§I.B, p.3200)
- 이미지 하단 **1/5**에 거래량, 상단 **4/5**에 OHLC + 이동평균선.
- 창 내 최대 거래량이 거래량 구역의 상한이 되도록 정규화.
- 비중이 1/5인 이유는 원문에 논증되지 않는다. 정보량 대비 저장 효율의 절충으로 서술된다("The image design strikes a balance between information content and storage efficiency", p.3201).

**거래량의 실증적 중요성**: §IV.B의 로지스틱 근사에서 "the first lag of moving average price and trading volume"이 종가·고가·저가 다음으로 중요했고(p.3225), "Recent rises in volume also notably predict positive future returns"(p.3226)라고 보고된다. Table VIII 발췌에서 거래량 시차 계수들이 유의하다(vol lag 2: 0.21*/0.52*/0.58*, vol lag 3: 0.13*/0.15*/0.57*). 즉 **1/5 면적만 차지하는 거래량이 실질적 예측 성분**이다.

---

## 규약 5 — 색·배경: 왜 흑백인가

원문 §I.A(p.3200):
- **배경 = 검정 (0,0,0), 객체 = 흰색.** 이유: 차트는 대부분 여백이므로 검정 배경이 **희소(sparse) 표현**을 만들어 저장이 효율적이다.
- **상승일/하락일 색 구분을 하지 않는다.** 이유(verbatim): "The use of different colors for 'up' and 'down' days, as is common practice by Bloomberg and others, **is redundant** because the direction of the price change is implied from the opening and closing price marks." → 시가·종가 표시의 상하 관계에서 방향이 이미 결정되므로 색은 중복 정보다.
- 결과: **RGB 3채널이 아니라 2차원 픽셀 행렬 하나**로 다룰 수 있다("Omitting such redundancy allows us to focus on two-dimensional pixel matrices, rather than having to track a third dimension for RGB pixel intensities").

**평가**: 이 결정은 계산량을 3분의 1로 줄이는 실용적 이득이 크고, 논거도 타당하다. 다만 "중복이므로 제거"는 **정보이론적으로만 참**이다. 색으로 인코딩하면 CNN이 방향을 **1픽셀 관계 추론 없이 즉시** 읽을 수 있으므로 학습 효율이 달라질 수 있다(중복 인코딩이 학습을 돕는 것은 표현학습에서 흔한 현상). 원문은 이 가능성을 검토하지 않는다. §III.E가 언급하는 강건성 검사에 "using minimal white pixels to represent the data"는 있으나 색 추가 실험은 없다.

---

## 결측치 처리 (§I.A, p.3199–3200 + 각주 5)

IPO나 상장폐지가 창 안에서 일어나는 종목은 **제외**하되, 이력 중간의 결측은 허용한다. 결측일에 해당하는 픽셀 열은 **비워 둔다**(부분 정보만 있으면 부분적으로 비움). 각주 5의 세부 규약: 고가나 저가가 없으면 중앙 바를 그릴 수 없으므로 **바 전체를 검게** 남긴다. 고가·저가는 있고 시가·종가가 없으면 **세로 바만** 그린다.

**이 설계의 함의** (각주 5 verbatim): "The ability to obtain price trend–based forecasts in the presence of incomplete data is an example of image-based CNN robustness to noisy data." — 결측을 특수 토큰이나 대체값(imputation)으로 채우지 않고 **"없음"을 그대로 표현**할 수 있는 것이 이미지 표현의 실질적 이점이다. 시계열 모형에서는 결측에 대해 반드시 대체 결정을 내려야 하는데, 이미지에서는 "검은 픽셀"이 자연스러운 결측 표현이 된다. **이것은 Table IX가 반박하지 못한, 2D 표현의 진짜 고유 이점 후보다.** (단, 논문은 이 이점을 정량적으로 검증하지 않는다 — 결측률별 성능 비교 실험은 없다.)

---

## 이 부분의 핵심 한 문장 요약

> "이미징"은 실제로는 세 개의 독립적 연산이 한 이름으로 묶인 것이다 — ① 배당·분할 제거를 위한 **가격 재구성**, ② OHLC를 3픽셀 폭 기호로 만드는 **기하학화**, ③ 창 내 max/min으로의 **min–max 재척도화**. 저자 자신의 Table IX가 성능의 원천을 ③으로 지목했으므로, ②는 (양자화 손실이라는 비용을 동반하는) 선택 사항이고 ①과 ③이 필수 구성요소다.
