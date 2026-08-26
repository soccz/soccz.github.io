# 3. 핵심 Claim 해체 (a) — Claim 1~3

> **배경 사다리**: ① "알파(α)"는 알려진 위험요인으로 설명되지 않고 남는 초과수익. ② "$t$-통계량"은 그 숫자가 우연일 가능성을 재는 값 — 대략 2를 넘으면 유의하다고 말한다(별표 개수로 표기). ③ "$R^2$"는 회귀가 설명한 변동의 비율 — 여기서는 **0에 가까울수록** 전략이 기존 요인과 무관하다는 뜻이라 좋은 신호다.

---

## Claim 1 — 유연한 시계열 신호를 거래 목적함수로 학습하면 표본외 Sharpe 가 벤치마크를 계단식으로 압도한다

**주장 (한 문장)**: 동일한 잔차·동일한 기간·동일한 제약 아래, 신호 함수만 OU → FFT → CNN+Transformer 로 바꾸면 표본외 연율 Sharpe 가 약 1 → 약 2 → 약 4 로 계단을 오른다.

**증거**: **Table I**(2002-01~2016-12 표본외, Sharpe 목적). IPCA 잔차 $K=5$ 열에서 CNN+Trans **4.16**(μ 8.7%, σ 2.1%) / Fourier+FFN **1.90**(7.7%, 4.1%) / OU+Thresh **0.97**(3.8%, 4.0%). PCA $K=5$ 에서는 3.36 / 1.98 / 0.73, Fama-French $K=5$ 에서는 3.21 / 1.66 / 0.38. 원문 §I 의 요약 문장은 "our model can achieve an impressive annual Sharpe ratio larger than four" 이고 §III.D 는 "approximately twice as large as for a comparable Fourier+FFN model and four times higher for the corresponding parametric OU+Threshold model" 이라고 적는다. 평균-분산 목적으로 바꾼 **Table III** 에서는 같은 셀이 SR 3.21 / μ **18.2%** / σ 5.7% 로, Sharpe 를 조금 내주고 평균 수익을 두 배 이상 키운다.

**숨은 전제**: (i) 표본외 잔차 자체가 **미래 정보를 쓰지 않는다** — 저자들은 $\Phi_{t-1}$ 이 $t-1$ 까지의 정보만 쓴다고 §III.B 에서 명시하나, IPCA 는 지난 240개월 월별 수익·특성으로 **매년** 재추정된다. 재추정 시점 이전 구간에 대해 look-ahead 가 없다는 것은 저자 진술에 의존한다. (ii) Sharpe 라는 지표가 이 전략의 위험을 대표한다 — 즉 수익 분포가 두꺼운 꼬리를 갖지 않는다는 전제인데, **왜도·첨도·최대낙폭(MDD)은 원문에 보고되지 않는다.** (iii) σ 2.1% 라는 **매우 낮은 변동성**이 분모에 들어가므로 Sharpe 는 구조적으로 커진다 — 저자도 §III.D 에서 "The mean returns of the CNN+Transformer are similar to the Fourier+FFN model, but have substantially smaller volatilities" 라고 스스로 밝힌다.

**쉬운 말 풀이**: 같은 재료(잔차)로 같은 기간에 요리했는데, 요리사만 바꿨더니 맛이 4배 좋아졌다. 그리고 좋아진 이유의 상당 부분은 "더 많이 벌어서"가 아니라 **"들쭉날쭉함이 줄어서"**다.

---

## Claim 2 — 이 수익은 기존 위험요인으로 설명되지 않으며, 비조건부 알파로 차익 기회를 재는 관행은 그 크기를 심하게 과소평가한다

**주장**: CNN+Transformer 전략 수익을 Fama-French 8요인(FF5 + 모멘텀 + 단기반전 + 장기반전)에 회귀하면 알파가 평균 수익과 거의 같고 $R^2$ 는 0 근처다. 따라서 위험 프리미엄이 아니다. 나아가, **잔차를 시계열 패턴으로 최적 거래했을 때의 수익은 잔차의 비조건부 평균으로 잰 값보다 최대 50배까지 클 수 있다.**

**증거**: **Table II**. IPCA $K=5$ 에서 α **8.3%** ($t_\alpha$ 16***), $R^2$ **3.9%**, μ 8.7% ($t_\mu$ 16***). PCA $K=5$ 는 α 14.1% ($t_\alpha$ 13***), $R^2$ 1.3%. 대조적으로 $K=0$(잔차가 아닌 원 수익률) 행은 $R^2$ **30.3%** — 원 수익률로 만든 전략은 3분의 1이 기존 요인으로 설명된다. OU+Thresh 하위표에서는 Fama-French·PCA 잔차 기준 알파가 1% 수준에서 유의하지 않다(예: FF $K=5$ α 0.5%, $t_\alpha$ 0.9). 50배 진술은 §III.F 원문: "have mean returns that can be larger by a factor of 50" — 근거 표는 Appendix **Table A.VI / A.VII** 로 위임돼 있고, **본 해체는 그 표의 셀 값을 전사하지 않았다**(본문 인용 위치만 확인).

**숨은 전제**: (i) Fama-French 8요인이 "알려진 위험"의 충분한 대리변수다 — 유동성 요인, 변동성 요인, 산업 요인은 회귀에 없다. (ii) 알파가 위험 프리미엄이 아니라면 곧 차익이라는 이분법 — **거래비용·차입제약·자본제약이 만드는 "한계적 차익"** 이라는 제3의 해석을 회귀는 배제하지 못한다(저자들도 §III.M 에서 지속성의 설명으로 "limited capacity of arbitrageurs"를 먼저 든다).

**쉬운 말 풀이**: "이 수익은 남들이 아는 위험을 대신 짊어져서 받은 대가가 아니다"까지는 표가 잘 보여준다. 다만 "그럼 공짜 점심이다"로 건너뛰면 안 된다 — **아무도 못 주워 먹고 있던 이유가 비용일 수 있고**, 실제로 Table IX 가 그 가능성을 지지한다(§06b).

---

## Claim 3 — 병목은 신호추출이지 요인 모형도, 배분 함수의 유연성도 아니다

**주장**: 요인 계열(FF/PCA/IPCA)을 바꾸거나 요인 개수를 5개 이상으로 늘려도 성능은 크게 안 변한다. 반대로 신호 함수를 제약하면 성능이 무너지고, 배분 함수만 유연하게 만들어도 회복되지 않는다.

**증거**: (i) **Table I** 의 $K$ 방향 포화 — CNN+Trans·IPCA 는 $K=5$ 4.16, $K=8$ 3.95, $K=10$ 3.97, $K=15$ 4.17 로 평평하다. 저자 진술 "Increasing the number of risk factors beyond five has only a marginal effect"(§I). (ii) 신호 방향 붕괴 — 같은 행에서 Fourier+FFN 1.90, OU+Thresh 0.97. (iii) **§III.G 의 두 ablation**: **OU+FFN**(OU 의 4차원 신호를 그대로 두고 배분만 FFN 으로 유연화)은 "similar or even worse than the simple parametric thresholding rule", 그리고 **신호 없이 잔차 자체를 FFN 배분기에 직접 넣은 모형**도 시계열 필터를 쓴 딥러닝 모형보다 나쁘다. 두 결과의 수치는 Appendix **Table A.IX** 로 위임돼 있다(**본 해체 미전사**). 저자 결론 verbatim: "A flexible allocation function is not sufficient to compensate for an uninformative signal."

**숨은 전제**: (i) "요인 모형이 중요하지 않다"는 결론은 **비교된 세 계열이 이미 충분히 좋다**는 조건부다 — $K=0$(요인 제거 없음)에서 4.16 → 1.64 로 떨어지는 것을 보면 "요인을 빼는 행위 자체"는 결정적이다. 중요하지 않은 것은 **어떤 요인을 쓰느냐**이지 **요인을 쓰느냐**가 아니다. (ii) 신호/배분 분해가 유일하지 않다는 §II.C 의 자기 인정이 이 claim 을 미묘하게 흔든다 — 표현이 유일하지 않다면 "신호가 중요하다"는 것은 엄밀히는 **"입력 시계열의 시간 구조를 명시적으로 모형화하는 층이 중요하다"**로 읽어야 한다.

**쉬운 말 풀이**: 재료 손질법(요인 모형)은 웬만하면 다 비슷하고, 접시에 담는 솜씨(배분 함수)만 좋아도 소용없다. **불 조절(시계열 신호 추출)이 요리의 전부**였다는 이야기다.
