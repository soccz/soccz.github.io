# 3. 핵심 Claim 해체 (b) — Claim 4~5

> **배경 사다리**: ① "어텐션 가중치"는 모델이 30일 창의 각 날짜에 얼마나 주목했는지를 0~1 사이 숫자로 적어둔 것. ② "기울기(gradient) 기반 중요도"는 입력을 아주 조금 흔들었을 때 출력이 얼마나 흔들리는지로 재는 민감도. ③ 여기서 "해석"은 모델 내부 숫자를 사람이 읽을 수 있는 **패턴 이름**(상승 추세, 반전…)에 대응시키는 작업이다.

---

## Claim 4 — 학습된 거래 정책은 "국소 추세·반전 패턴 × 비대칭 시간 주목"으로 사후 해부된다

**주장**: 이 모델이 배운 것은 8개의 국소 기본 패턴(상승/하락/반전형 3일 모양)과, 이들을 30일 창에서 엮는 4개의 전역 어텐션 패턴이며, 그 어텐션은 **방향에 따라 비대칭**이다 — 하락엔 최근 10일, 상승엔 앞쪽 20일.

**증거**:
- **Figure 14** — 2층 CNN 필터를 2차원 직교 선형필터로 투영한 $D=8$ 개 "basic pattern". 원문 §III.N 진술: "basic patterns 4 and 6 capture local upward trends, basic patterns 3 and 7 track local downward trends and basic patterns 1, 5 and 8 learn reversion patterns." 그리고 곧바로 한계도 적는다: "the basis patterns do not include very spiked, sharp changes."
- **Figure 15** — **합성 사인파 입력** $x_l=\sin(2\pi\frac{l}{30})$ 과 15일 위상 이동판 $\sin(2\pi\frac{l+15}{30})$ 을 넣어 $H=4$ 헤드의 가중치를 관찰. 원문: "the attention head weights discover the sinusoidal pattern although the model was estimated on the empirical data and not specifically trained for this simulated input." 헤드 4 = "negative reversal", 헤드 3 = "early reversal", 헤드 1 = 헤드 4의 감쇠판으로 라벨링.
- **Figure 17** — 대표 잔차 하나에 대해 2006~2016 전 구간의 헤드별 $L=30$ 어텐션 가중치를 히트맵으로 펼침. 헤드 3은 2007·2010·2012 같은 상승 구간에서 값이 커지며 **창의 앞쪽 날짜**에 몰리고, 헤드 4는 2009·2014·2016 중반의 하락 구간에서 커지며 **최근 과거**에 몰린다.
- **Figure 18** — NAAG(normalized average absolute gradient). (a) 기본 패턴 중요도: 평평한 basic pattern 2 는 거의 0, 추세·반전 패턴이 높다. (b) 날짜 중요도: 입력 27일 전부에 중요도가 있고 **최근 14일이 평균적으로 더 크다**.
- 저자의 요약 문장(§III.N): "our CNN+Transformer policy network has learned to act swiftly during downtrends, and more slowly during uptrends. This shows that our model learns in particular the commonly repeated wisdom that 'markets take escalators up and elevators down'."

**숨은 전제**: (i) **어텐션 가중치 = 설명**이라는 전제. 이건 이 레포가 2026-05-18(Jain·Wallace *Attention is not Explanation*)에서 이미 정면으로 문제 삼은 지점이다. 여기서 헤드에 붙인 "early reversal / negative reversal" 라벨은 **개입 실험이 아니라 관찰**로만 뒷받침된다 — 헤드 3을 제거하거나 마스킹했을 때 상승 국면 성과가 무너진다는 인과 증거는 원문에 없다. (ii) 해석 대상이 **하나의 대표 잔차**이고(Figure 16·17 캡션 "a randomly selected, representative residual"), 잔차 전체에 대한 통계량이 아니다. (iii) 해석용 모델은 **8년 고정 학습 모델**(Figure 14~18 캡션 "$T_{\text{train}}$=8 years based on the Sharpe ratio objective")이지 주 결과의 롤링 모델이 아니다 — 해석과 성능이 **같은 모델에서 나온 게 아니다**.

**쉬운 말 풀이**: 모델을 열어보니 안에 "3일짜리 모양 도장" 8개와 "30일 중 어디를 볼지 정하는 눈" 4개가 들어 있었다. 그 눈은 시장이 떨어질 때는 코앞만 보고, 오를 때는 멀리까지 본다. 다만 **"그 눈을 가리면 성과가 무너진다"는 실험은 안 했으므로**, 지금까지는 "그렇게 보인다"이지 "그래서 그렇다"가 아니다.

---

## Claim 5 — 시계열 패턴은 수익률이 아니라 잔차에서 뽑아야 한다

**주장**: 같은 아키텍처·같은 목적함수라도 입력을 원 수익률로 두면 성능이 급락한다. 수익률은 소수의 요인이 지배해 실질적인 독립 시계열 정보가 적고 기업 특성에 따라 이질적이기 때문이다.

**증거**: **Table I** 의 $K=0$ 행 — CNN+Trans 가 SR **1.64**(μ 13.7%, σ 8.4%)로, 같은 모델의 IPCA $K=5$ 4.16 대비 3분의 1 수준. 세 요인 계열의 $K=0$ 값이 동일한 것은 정의상 당연하다(요인을 하나도 빼지 않은 원 수익률이므로). **Table II** 는 여기에 결정적 증거를 하나 더 준다 — $K=0$ 전략의 8요인 회귀 $R^2$ 가 **30.3%** 로, 잔차 기반 전략의 0.5~9.5% 와 확연히 다르다. 즉 $K=0$ 전략은 **차익이 아니라 요인 익스포저를 상당 부분 사고 있다.** 저자 진술(§I): "stock returns are dominated by a few factors, which severely limits the actual independent time-series information, and are strongly heterogeneous due to their variation in firm characteristics." 각주 13은 Pelger(2020)를 인용해 "개별 주식 수익률의 약 3분의 1이 잠재 4요인으로 설명된다"고 적는다.

**숨은 전제**: (i) 잔차의 **정상성(stationarity)** — §II.B 가 명시적으로 "the residual time-series follow a stationary distribution conditioned on its lagged returns" 를 implicit assumption 으로 선언한다. 요인 모형이 잘못 지정되면 잔차에 요인 성분이 남아 이 전제가 깨진다. 저자들은 §II.A 에서 "우리 접근은 일부 위험요인을 빠뜨려도 여전히 유효하다 — 그때는 흉내내기 포트폴리오 대비 시계열 편차를 이용하는 것일 뿐"이라고 방어한다. **이 방어는 수익성에 대해서는 성립하지만 "차익이지 위험 프리미엄이 아니다"라는 Claim 2 에 대해서는 성립하지 않는다** — 빠뜨린 요인이 프리미엄을 갖는다면 그 프리미엄을 먹고 있는 것이기 때문이다. (ii) $L=30$ 개의 지연 수익률이 신호의 **충분통계량**이라는 전제(§II.B). Table V(L=60)가 이걸 부분적으로 검증한다 — IPCA $K=5$ 에서 3.90 으로 L=30 의 4.16 과 유사하다.

**쉬운 말 풀이**: 원 수익률에는 "시장 전체가 오늘 어떻게 움직였나"라는 큰 파도가 섞여 있어서, 그 안의 작은 물결(개별 종목의 일시적 어긋남)을 보기 어렵다. 파도를 먼저 빼고 물결만 남겨야 그 물결의 리듬을 배울 수 있다. 그리고 **파도를 안 뺀 전략은 물결이 아니라 파도를 타고 있었다**는 게 $R^2$ 30.3% 의 의미다.
