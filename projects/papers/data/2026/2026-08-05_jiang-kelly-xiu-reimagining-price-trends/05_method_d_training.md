# 4. 방법론 해부 (D) — 학습·정규화·구현 디테일

## 이 부분이 왜 필요한가

앞의 세 파일에서 "무엇을 입력하고 어떤 함수를 쓰는가"를 열었다. 남은 것은 **"그 함수를 어떻게 맞추는가"** 다. 금융 데이터에서 이 단계가 특히 결정적인 이유는 신호대잡음비가 극도로 낮아서, 정규화 설계가 조금만 어긋나면 모델이 잡음을 외우고 표본외 성능이 0이 되기 때문이다. 이 절의 세부는 대부분 Gu·Kelly·Xiu(2020)에서 상속되었고 — 사용자가 이미 읽은 논문이므로 — **새로 흡수할 것은 표본 분할 설계와 손실함수, 그리고 회전율 정의 세 가지**다.

## 배경 사다리

① **학습/검증/테스트 분할** — 학습 표본으로 파라미터를 맞추고, 검증 표본으로 "언제 멈출까" 같은 메타 결정을 하고, 테스트 표본은 **한 번도 보지 않은 채** 최종 성능만 잰다. ② **에폭(epoch)** = 학습 데이터 전체를 한 번 훑는 것. ③ **과적합(overfitting)** = 학습 데이터의 우연한 패턴까지 외워서, 새 데이터에서 성능이 떨어지는 현상.

---

## 1. 손실함수 — 식 (1)

원문 §II.C(p.3205), **식 (1)**:

$$L(y, \hat{y}) = -y \log(\hat{y}) - (1-y)\log(1-\hat{y})$$

원문 설명 verbatim: "where $\hat{y}$ is the softmax output from the final step in the CNN. If the predicted probability exactly corresponds with the label, $\hat{y} = y$, then the loss function is zero, otherwise the loss is positive."

### 4줄 해석

1. **기호 뜻**: $y \in \{0, 1\}$ = 실제 레이블 (1이면 후속 수익률 > 0). $\hat{y} \in (0,1)$ = CNN의 softmax 출력, 즉 "오를 확률" 추정치. $L$ = 관측치 하나의 손실 (무단위, 정보량 단위로 읽으면 nat).
2. **일상 비유**: **일기예보관의 벌점 규칙**이다. "비 올 확률 90%"라고 말했는데 비가 안 오면 큰 벌점, "60%"라고 말했는데 안 오면 작은 벌점. 그리고 "100% 확실"이라고 말했는데 틀리면 **벌점이 무한대**다. 즉 이 규칙은 정직한 확신 수준을 말하도록 유도한다.
3. **왜 이 형태**: 두 항 중 하나만 살아남는 구조다. $y=1$ 이면 $-\log(\hat{y})$, $y=0$ 이면 $-\log(1-\hat{y})$. 대안인 MSE $(y - \hat{y})^2$ 와 비교하면 결정적 차이가 있다 — **확신을 갖고 틀렸을 때의 기울기**다. $y=1, \hat{y} \to 0$ 일 때 MSE의 기울기는 유한하게 $-2$ 로 수렴하지만, 교차엔트로피의 기울기는 $-1/\hat{y} \to -\infty$ 로 발산한다. 즉 교차엔트로피는 **자신만만하게 틀린 예측을 즉시, 강하게 교정**한다. 금융처럼 SNR이 낮은 환경에서 이건 양날의 칼인데(뒤의 조심할 점), 확률 출력의 캘리브레이션을 위해서는 필수다. 더불어 교차엔트로피는 로그우도의 음수이므로, 이 손실 최소화 = **베르누이 최대우도추정**이다 → 추정량의 통계적 성질이 알려져 있다.
4. **조심할 점 — 두 가지 심각한 함의**:
   - **꼬리 관측치에 대한 과잉 처벌.** 금융 수익률은 상당 부분 예측 불가능하다. 시장 전체가 폭락한 날, 모델이 "오른다 95%"라고 예측했던 종목들은 전부 무한대에 가까운 손실을 낸다. 그런데 그건 모델이 나빴던 게 아니라 **예측 불가능한 충격**이었다. 교차엔트로피는 이 구분을 못 한다. 이것이 저자들이 **50% 드롭아웃과 early stopping을 무겁게 쓰는** 이유의 배경으로 읽힌다(원문은 이 인과를 명시하지 않음 — 필자 추론).
   - **레이블 불균형이 결과를 왜곡한다.** 상승장이 길게 이어지면 $y=1$ 이 압도적으로 많아지고, 모델은 "항상 오른다"라고 답하는 게 손실 최소가 된다. 저자들이 이 문제를 **표본 분할 설계로** 해결한다(바로 다음 절).

---

## 2. 표본 분할 — 이 논문에서 가장 논쟁적인 설계 결정

원문 §II.C·§III.A(p.3204–3206):

```
1993 ─────────── 2000 │ 2001 ──────────────────────── 2019
├─ 학습 70% (무작위) ─┤│
├─ 검증 30% (무작위) ─┤│
   [8년, 단 한 번]     │  [19년, 전부 out-of-sample, 재학습 없음]
```

### 설계 A — 무작위 학습/검증 분할 (시간순 분할이 아니다)

원문 verbatim(p.3204): "In this eight-year sample, we randomly select 70% images for training and 30% for validation. **Randomly selecting the training and validation sample helps balance positive and negative labels in our classification problem, which attenuates a potential bias in classification due to extended periods of bullish or bearish market swings.** The resulting training and validation images have approximately 50% 'up' and 50% 'down' labels in all scenarios we consider."

**이 결정을 어떻게 평가할 것인가.** 시계열에서 무작위 분할은 보통 **금기**다 — 검증 표본이 학습 표본의 미래와 과거에 섞여 있으므로 정보 누출(leakage)이 생긴다. 특히 5일·20일·60일 중첩 창을 쓰므로 **같은 날의 데이터가 학습과 검증 이미지에 동시에 들어간다.**

그럼에도 이 설계가 방어 가능한 이유:
- 검증 표본의 유일한 용도가 **early stopping 시점 결정**이다. 파라미터 자체는 학습 표본에서만 추정된다. 즉 누출의 영향은 "몇 에폭에서 멈출까" 하나로 국한된다.
- 그 대가로 얻는 것이 **레이블 균형 50:50**이다. 시간순으로 자르면 1993–1997(학습)과 1998–2000(검증)이 되는데, 후자는 닷컴 버블 국면이라 상승 레이블이 압도적이다. 그러면 early stopping이 "상승장 편향 모델"을 최적으로 판정한다.
- 그리고 **최종 성능 평가는 2001–2019 완전 분리 표본**에서만 이루어진다. 누출이 있었다면 이 19년에서 성능이 무너져야 한다.

**그러나 남는 문제**: early stopping 시점의 누출은 "이 아키텍처가 이 데이터에서 몇 에폭이 적절한가"라는 정보를 검증 표본에서 빌려 온 것이므로, 엄밀하게는 **테스트 성능의 상방 편향**을 만든다. 그 크기는 작을 것으로 보이지만 정량화되지 않았다.

### 설계 B — 재학습 없음 (19년간 모델 고정)

원문 verbatim(p.3206): "we do not recursively retrain the model... The trained CNN model is then held fixed for the entire 2001 to 2019 test sample. **This design is due primarily to capacity in computational resources.** Adopting a rolling window and repeatedly retraining is likely to further improve the predictions."

**이것은 저자들에게 유리한 동시에 불리하다.**

**유리한 해석 (저자의 의도)**: 1993–2000년에 학습한 모델이 닷컴 붕괴(2000–2002), 글로벌 금융위기(2008–2009), 제로금리·QE 시대(2009–2015), 변동성 매도 붕괴(2018)를 **모두 통과하며 계속 작동했다.** 이는 발견된 패턴이 레짐에 조건적이지 않다는 극도로 강한 강건성 증거다. 롤링 재학습을 하는 논문들은 "표본외"라고 주장하면서도 모델이 최근 데이터를 계속 흡수하므로 이런 주장을 할 수 없다.

**불리한 해석**: ① 학습 기간이 **단 8년**이고, 그것이 1990년대 후반이라는 특정 레짐이다. 이 시기는 십진화(decimalization, 2001년 도입) 이전이라 **호가 단위가 1/16달러**였고 스프레드 구조가 지금과 다르다. 즉 학습 데이터의 미세구조가 테스트 기간과 체계적으로 다르다. ② "재학습하면 더 좋아질 것"이라는 문장은 **검증되지 않은 낙관**이다. 반대로 재학습이 최근 레짐에 과적합해 나빠질 수도 있다. ③ 계산자원이 이유라는 고백은 2020년대 초 논문으로서 설득력이 약하다 — 파라미터 3백만 개 모델이다.

**가장 중요한 관찰**: 저자들은 이 설계를 **하한(lower bound) 주장**의 근거로 쓴다. 각주 7의 "our empirical analysis provides, at best, a lower bound on the extent of predictability"와 결합하면, 논문 전체의 주장 형식은 **"최소한 이만큼은 예측 가능하다"** 이다. 이 형식이 정확히 지켜지는 한 위 비판들은 결론을 무너뜨리지 못한다. 다만 **"이 수치가 실현 가능한 알파다"** 로 읽는 순간 전부 유효한 반박이 된다.

---

## 3. 정규화 세트 — 다섯 겹의 방어 (§II.C, p.3205)

전부 Gu·Kelly·Xiu(2020)에서 상속. 원문은 "Gu, Kelly, and Xiu (2020) outline the intuition behind these choices, so for the sake of brevity, we omit this discussion"라며 논의를 생략한다.

| 기법 | 설정 | 역할 | 이 논문에서의 특유한 의미 |
|---|---|---|---|
| **Xavier 초기화** (Glorot·Bengio 2010) | 각 층 가중치 | "prediction variance begins on a comparable scale to that of the labels" → 수렴 가속 | 희소 흑백 이미지에서 초기 활성값이 폭발/소실하기 쉬움 |
| **Adam** (Kingma·Ba 2014) | 초기 학습률 **1×10⁻⁵**, 배치 **128** | 적응적 학습률 | **학습률이 매우 작다.** 통상 1e-3~1e-4인데 1e-5는 SNR이 낮은 데이터에서 잡음 방향으로 크게 움직이지 않으려는 선택으로 읽힌다 |
| **배치정규화** (Ioffe·Szegedy 2015) | 합성곱과 활성화 **사이**, 각 블록 내 | "to reduce covariate shift" | 블록마다 활성 분포를 재정규화 → §5의 척도 논의와 별개 층위에서 정규화가 또 일어난다 |
| **드롭아웃** (Srivastava et al. 2014) | **50%**, 완전연결층에만 | 과적합 억제 | 명시적 논거(p.3205): "the relatively low parameterization in convolutional blocks avoids the need for dropout there" → 파라미터가 몰린 곳만 정규화 |
| **Early stopping** | 검증 손실이 **2에폭 연속** 개선 실패 시 중단 | 과적합 억제 | 인내심(patience) 2는 매우 짧다 → 강하게 조기 종료하는 보수적 설정 |

**추가 전처리** (각주 8, p.3205): 모든 이미지를 학습 데이터 전체 픽셀값의 평균·표준편차로 표준화하고, 같은 상수를 검증·테스트에 적용한다. 저자들의 정직한 부연: "although skipping this step has negligible impact on our results." → **이 정규화는 실질적으로 무관하다.** 이것이 중요한 대비를 만든다: 픽셀 레벨 표준화는 효과가 없고, **창 내 min–max 재척도화는 성능을 지배한다**(Table IX). 두 정규화의 차이는 "무엇에 대해 상대적인가"다 — 전자는 전체 데이터셋 통계, 후자는 **그 종목·그 창 고유의 통계**. 후자만이 횡단면 비교가능성을 만든다.

---

## 4. 예측 앙상블

원문 §III.A(p.3206): "Because the CNN optimization is stochastic, for each model configuration we independently retrain the CNN **five times** and average the forecasts (following Gu, Kelly, and Xiu (2020))."

**왜 필요한가**: 초기값·미니배치 순서·드롭아웃 마스크가 무작위이므로 같은 데이터에서도 다른 모델이 나온다. 5회 평균은 이 분산을 줄인다.

**재현성 관점의 문제**: 보고된 모든 수치가 **5개 모델 평균의 성과**다. 그런데 **5개 개별 모델의 성과 분산이 보고되지 않는다.** 만약 5개 중 하나가 샤프 12이고 넷이 5라면, "이 방법이 안정적으로 7을 낸다"와 "운이 좋으면 7이 나온다"가 구분되지 않는다. Table I은 시계열 유의성(***)은 보고하지만 **seed 간 분산은 보고하지 않는다.** → §7 재현성 평가에서 다시 다룬다.

---

## 5. 포트폴리오 구성과 회전율 정의

### 10분위 정렬 (§III.A, p.3206)
매 예측 시점(주/월/분기)마다 표본외 CNN 상승확률로 종목을 10분위로 정렬. 10분위(High) 매수 + 1분위(Low) 공매도 = H-L 스프레드 포트폴리오. **보유기간 = 예측 지평**과 일치(이미지 마지막 날 이후 5·20·60일).

### 회전율 (§III.B, p.3210)

$$\text{Turnover} = \frac{1}{M}\frac{1}{T}\sum_{t=1}^{T}\sum_{i}\left| w_{i,t+1} - \frac{w_{i,t}(1 + r_{i,t+1})}{1 + \sum_j w_{j,t} r_{j,t+1}} \right|$$

원문 정의 verbatim: "where $M$ is the number of months in the holding-period, $T$ is the number of trading periods, $r_{i,t+1}$ is the return of stock $i$ at time $t+1$, and $w_{i,t}$ is the portfolio weight of stock $i$ at time $t$."

### 4줄 해석

1. **기호 뜻**: $w_{i,t}$ = 시점 $t$ 에서 종목 $i$ 의 포트폴리오 비중 (합 1). 분수 항은 **거래를 안 했을 때** $t+1$ 에서 자연히 생기는 비중 — 분자는 그 종목의 성장, 분모는 포트폴리오 전체의 성장. $M$ = 보유기간의 개월 수 (주간 전략은 1/4, 분기 전략은 3).
2. **일상 비유**: **"가만히 있었으면 이렇게 됐을 비중"과 "실제로 만든 비중"의 차이를 다 더한 것**이다. 주식이 올라서 비중이 커진 건 거래가 아니므로 세지 않고, 내가 사고팔아서 바꾼 부분만 센다.
3. **왜 이 형태**: 순진하게 $|w_{i,t+1} - w_{i,t}|$ 를 쓰면 **가격 변동으로 인한 비중 표류(drift)를 거래로 오인**한다. 분수 항이 그 표류를 정확히 상쇄한다. $M$ 으로 나누는 이유는 원문이 명시한다(p.3210): "Dividing by the number of months makes the turnover measure comparable across different holding-periods... scaling down quarterly strategy turnover by a factor of one-third or scaling up weekly strategy turnover by a factor of four."
4. **조심할 점**: 월 단위 정규화 때문에 **최대 회전율이 200%/M** 이다. 즉 주간 전략($M = 1/4$)의 최대치는 800%. Table I의 CNN 회전율 690%는 최대치 800%의 86%에 해당한다 — **거의 매주 포트폴리오를 전부 갈아엎는다는 뜻이다.** 이 맥락 없이 "690%"만 보면 크기를 오판하기 쉽다. 저자들이 이를 인정한다(p.3210): "While Table I demonstrates that image-based strategies are highly profitable in gross terms, it also shows that they require significant trading."

---

## 이 부분의 핵심 한 문장 요약

> 학습 설계의 두 축은 **레이블 균형을 위해 정보 누출을 감수한 무작위 학습/검증 분할**과 **19년간 재학습을 포기해 극단적 강건성을 증거로 전환한 모델 고정**이며, 둘 다 "최적 성능"이 아니라 **"하한 증명"** 을 목표로 하는 논문의 주장 형식과 정합한다 — 그러므로 이 논문의 수치를 실현 가능한 알파로 읽는 것은 저자의 주장을 넘어서는 독법이다.
