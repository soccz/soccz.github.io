# 9. 사고 확장 (B) — Follow-up 논문 3편

## 배경 사다리

본 절은 본 논문을 둘러싼 (i) 선행 1편, (ii) 경쟁 1편, (iii) 후속 1편 — 3편의 follow-up 을 짚어 본 논문의 좌표를 부여한다. 각 4~6줄 — 어떤 논문인지, 본 논문과 어떤 관계인지, 무엇을 얻을 수 있는지.

## 선행 1편 — Ben-Tal & Teboulle (2007): "An old-new concept of convex risk measures: The optimized certainty equivalent"

**위치**: *Mathematical Finance* 17(3), pp. 449-476.

**무엇**: 1986년 Ben-Tal 이 처음 도입한 OCE (Optimized Certainty Equivalent) 를 convex risk measure 의 표현방식으로 재정립. 핵심 정리: cash-invariant convex risk measure 의 (넓은) 부분집합이 $\rho(X) = \inf_y \{y + \mathbb{E}[\ell(-X-y)]\}$ 의 OCE 형식으로 표현됨. AVaR/CVaR, entropic, mean-variance 의 OCE 표현 명시.

**Deep Hedging 과의 관계**: 본 논문의 손실 정의가 **이 OCE 표현의 직접 응용**. Ben-Tal-Teboulle 없이는 Deep Hedging 의 학습 골격이 SGD 친화로 떨어지지 않는다. 본 논문이 인용하는 핵심 ancestor 1.

**얻을 수 있는 것**:
1. OCE 표현의 함수 클래스 정확한 정의 — 어떤 risk measure 가 OCE 가능, 어떤 게 안 되는지.
2. dual variable $y$ 의 해석 — "거래자의 reservation price" 또는 "VaR threshold" 의 의미.
3. 다른 금융 응용 (portfolio optimization, stress testing) 에서 OCE 의 표준 사용 패턴.

## 경쟁 1편 — Carbonneau (2021): "Deep Hedging of Long-Term Financial Derivatives"

**위치**: *Insurance: Mathematics and Economics* 99, pp. 327-340 + arXiv 사본 (검색 인덱스 'sciencedirect.com/science/article/abs/pii/S0167668721000512').

**무엇**: Deep Hedging framework 를 30년 (long-term) 보험·연금 상품에 적용. Heston 의 mean reversion 으로 충분하지 않은 stationary 가정의 한계를 long-term 에서 직격. equity-linked GLWB (Guaranteed Lifetime Withdrawal Benefit) 헤지 응용.

**Deep Hedging 과의 관계**: 본 논문의 단기 (수개월) horizon 을 **long-term horizon 으로 확장** — 새 simulator (long-term stochastic vol + interest rate joint), 새 risk measure (보험사 capital 모형), 새 instrument (지수형 보험). 본 논문 framework 의 적용 범위 확장이지만, 정책 학습 구조는 동일.

**얻을 수 있는 것**:
1. 본 논문 framework 의 long-term scalability 증거.
2. 보험 응용에서의 risk measure 차이 (entropic 보다 spectral / Wang transform 이 표준).
3. P1 ProTran-TFA 가 long-term forecasting 으로 확장 가능한지에 대한 reference.

## 후속 1편 — Buehler-Murray-Wood (2022): "Deep Bellman Hedging"

**위치**: arXiv:2207.00932.

**무엇**: 본 논문의 OCE 손실을 **Bellman recursion 으로 분해** — value function $V_t(s)$ 를 정의하고 $V_t(s) = \min_a \{c(a) + V_{t+1}(\Phi(s,a))\}$ 의 동적 계획법 형태로 학습. 이로써 (i) 더 긴 horizon 의 학습 효율, (ii) Q-learning 등 RL 표준 알고리즘과의 호환성, (iii) off-policy 데이터 활용 가능.

**Deep Hedging 과의 관계**: 본 논문이 horizon 전체를 한 forward 로 학습 (open-loop) 한 것을 **stage-wise 학습 (closed-loop)** 으로 재정식화. risk measure 의 일관성 (time-consistency) 를 명시 — 본 논문은 OCE 가 시간일관 risk measure 가 아닐 수도 있다는 점을 흐릿하게 둠.

**얻을 수 있는 것**:
1. risk measure 의 time-consistency 와 시간동학의 정합성 분석 framework.
2. Q-learning 등 표준 RL 알고리즘으로 deep hedging 을 reformulate 하는 방법.
3. 본 논문 framework 의 약점 (긴 horizon 의 학습 분산) 해결책.

## 3편의 좌표

```
                    선행 (OCE 표현)
                    Ben-Tal & Teboulle 2007
                              │
                              ▼
              ┌───── Deep Hedging (본 논문) ─────┐
              │                                  │
              ▼                                  ▼
     경쟁 (long-term 응용)              후속 (Bellman 분해)
     Carbonneau 2021                    Buehler-Murray-Wood 2022
```

- **선행 (위)**: 본 논문이 어디서 수학적 도구를 받았는가.
- **경쟁 (좌)**: 본 논문 framework 의 응용 확장 — 같은 framework 의 다른 도메인 적용.
- **후속 (우)**: 본 논문의 학습 구조 자체를 재구성 — 같은 문제의 다른 학습 패러다임.

## 추가 후속 (사용자 연구 직접 연결)

위 3편 외에도 본 논문과 사용자 연구의 교차로:

- **Imaki et al. (2023) Adversarial Deep Hedging** (arXiv:2307.13217) — 본 논문의 simulator 의존 약점 정면 공격. Distributionally robust 의 deep hedging 버전. APF 의 motif robustness 와 연결 가능.
- **Wiese et al. (2019) Deep Hedging Learning to Simulate** (SSRN 3470756) — GAN 으로 simulator 학습. 🔴 AETHER 의 BTC 시장 simulator 학습에 직접 차용 가능.

## 핵심 한 문장

> **"본 논문은 Ben-Tal-Teboulle (수학 도구) 을 받아 Carbonneau (응용 확장) 와 Buehler-Murray-Wood (학습 재구성) 의 두 방향으로 갈라지는 분기점 — 사용자 연구는 Adversarial / Simulator-GAN 의 두 변형을 통해 본 논문에 접속할 수 있다."**
