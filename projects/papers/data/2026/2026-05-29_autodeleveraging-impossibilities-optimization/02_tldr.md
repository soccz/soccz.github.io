# 02 · 3층 TL;DR

---

## 🧒 초등학생 수준

코인 거래소를 운영한다고 상상해 보자. 사람들은 "레버리지"라는 것을 써서 — 예를 들어 자기 돈 10만 원으로 100만 원짜리 거래를 하는 것 — 코인을 사고판다. 코인 가격이 갑자기 폭락하면 돈을 잃는 사람(패자)이 생기는데, 그 손실이 너무 커서 자기 보증금보다 많아질 수 있다. 이때 거래소가 직접 돈을 내야 한다. 돈이 없으면 거래소도 파산한다.

이를 막으려고 거래소는 "ADL"이라는 장치를 쓴다: **돈을 번 사람(승자)의 포지션을 강제로 닫아서 패자의 빚을 갚게 하는 것**이다. 승자는 원치 않는데도 거래가 강제 종료되며 일부 이익을 잃는다.

이 논문이 묻는 질문: "누구에게 얼마만큼 손실을 전가할 것인가?" 그리고 증명하는 것: **어떤 방법을 써도 세 가지 조건 — (①거래소가 망하지 않을 것, ②거래소가 돈을 많이 벌 것, ③승자에게 공평할 것) — 을 동시에 만족할 수 없다.** 세 가지 모두를 잡으려 하면 반드시 하나가 무너진다.

실제 사례: 2025년 10월 10일, Hyperliquid라는 거래소에서 12분 만에 2조 1천억 원 규모의 강제 청산이 발생했다. 이 논문 계산으로는 실제 필요한 손실 전가액의 28배를 과잉 적용했고, 그로 인해 약 7,000억 원의 불필요한 손해가 발생했다.

---

## 🎓 학부생 수준

**문제:** 영구 선물(perpetual futures) 거래소에서 대규모 가격 이탈이 발생하면 "bad debt"(부족액, $D_t$)가 생긴다. 거래소는 지급능력(solvency)을 유지하기 위해 자동손실사회화(ADL, Autodeleveraging)를 실행한다 — 승자(winning traders, $\mathcal{W}_t$)의 포지션을 강제 청산해 $D_t$를 메운다. 어느 승자에게 얼마씩 haircut(강제 손실)을 부과할지가 ADL policy 설계 문제다.

**핵심 아이디어:** 이 논문은 ADL를 **형식적 최적화 문제**로 처음 공식화한다. 각 트레이더 $i$의 포지션 정보 $(q_i, c_i, t_i, b_i)$ — 수량·담보·진입시각·방향 — 으로 정의된 거래소 $\mathcal{P}_n$을 만들고, 지분(equity)을 $e_i = c_i + \text{PNL}_i$로, 부족액을 $D_t = \sum_i (-\tilde{e}_i)_-$로 정의한다.

**왜 어려운가:** 세 가지 바람직한 성질이 있다:
- **지급능력(Solvency)**: $\text{Solv}_T \geq 0$
- **수익 극대화(Revenue)**: 거래소 보험기금(IF) 최대화
- **공정성(Fairness)**: 승자의 손실이 부당하지 않을 것

**주된 결과:**

*Theorem 1 (Trilemma):* 세 조건을 동시에 만족하는 ADL 정책은 존재하지 않는다.

*Theorem 2–3 (Pro-rata의 유일성):* 세 가지 공정성 공리 — (i) 단조성 (ii) 규모 불변성 (iii) Sybil 저항성 — 를 동시에 만족하는 메커니즘은 **pro-rata**(각 승자 포지션 비례 haircut)뿐이다. 이는 오목 효용함수에서의 사회 후생 최대화도 달성한다.

*Theorem 4 (강건 최적화):* 반복 충격 확률 과정 하에서 g*-가중 pro-rata가 기대 총 부족액을 최소화하는 유일한 최적 위험 모델 g*를 볼록 쌍대성으로 도출할 수 있다.

*Theorem 5 (Stackelberg 게임):* 다중 ADL 라운드 설정에서 지급능력 회복 속도를 최소화하는 전략은 필연적으로 장기 거래소 수익을 최대화한다 — 즉 "빠른 청산"과 "수익 보전"은 tradeoff다.

**실증:** Hyperliquid 2025년 10월 10일 데이터: 34,983건 ADL 집행, 19,337개 지갑, 162개 종목. 실제 부족액 ~$23.2M 대비 $2.1B haircut 적용 → **28배 과잉**. Pro-rata였다면 부족액만 사회화됐을 것.

---

## 🔬 전문가 수준

**Contribution 1 — 최초 형식 모델:** 영구 선물 거래소를 $\mathcal{P}_n = \{(q_i, c_i, t_i, b_i)\}$으로 정의하고, funding rate·PNL·지분·maintenance margin·유동화 가격을 완전히 수학적으로 전개한다. "leverage mass" $\ell^\pm_t = \sum_{i \in \mathcal{W}/\mathcal{L}_t} \lambda^\pm_{i,t}$와 PTSR(Profit-to-Solvency Ratio) 개념을 도입해 도덕적 해이를 정량화한다.

**Contribution 2 — 불가능성:** Trilemma는 세 성질이 수학적으로 충돌함을 증명한다. 도덕적 해이는 $O(b_n / n)$로 증가해 "규모를 키워 해결"이 불가능함을 극값 이론(Extreme Value Theory)으로 보인다.

**Contribution 3 — 공리적 + 최적화적 공정성:** 세 공리(monotonicity, scale invariance, Sybil resistance)로부터 pro-rata를 유도하는 동시에, 오목 효용 최대화 관점에서도 같은 결과를 얻는다. 이중 characterization.

**Contribution 4 — 강건 최적화:** 주어진 충격 분포 하에서 g*-가중 pro-rata를 볼록 쌍대성으로 도출하고 선형 시간 알고리즘으로 구현한다.

**Contribution 5 — Stackelberg 게임 분석 + 온라인 학습:** 다중 라운드 ADL을 Principal-Agent 게임으로 모델링하고 mirror descent로 지급능력-수익 joint 목표에서 vanishing regret을 달성한다.

**Contribution 6 — 실증:** Hyperliquid 블록체인 원시 데이터(HyperReplay)에서 재생한 실험에서 생산 큐 메커니즘이 최적 대비 28× 과잉 ADL을 실행했고 $653M의 불필요한 haircut을 부과했음을 보인다. 이벤트 후 Hyperliquid의 미결제약정(OI)이 50% 감소한 반면 경쟁사(Lighter, Binance)는 회복됐다는 점도 기록.

**한계:** LOB·AMM 구체 유동성 모델 추상화; 영구 선물에 한정; 알고리즘적 ADL만 (수동 사회화 제외); 저자 신원·소속 미공개(필명 논문).
