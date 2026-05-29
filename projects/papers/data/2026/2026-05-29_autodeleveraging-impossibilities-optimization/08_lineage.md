# 08 · 이론 계보

---

## 직계 선조: 메커니즘 설계 불가능성 정리

### Gibbard–Satterthwaite (1973/1975)
**핵심**: 3개 이상의 대안이 있을 때, 전략적으로 조작 불가능하고 전체적이며 비독재적인 사회적 선택 함수는 존재하지 않는다.

**ADL 연결**: 논문의 Theorem 1 (ADL 트릴레마)은 Gibbard–Satterthwaite와 동일한 "공리 집합의 양립 불가능성" 구조다. 다른 점: GS는 집합적 선택에 관한 것이고 ADL 트릴레마는 금융 메커니즘에 관한 것 — 하지만 수학적 전략은 같다: 세 조건을 동시에 만족하는 것이 불가능하다는 것을 공리에서 도출.

### CAP 정리 (Brewer, 2000)
**핵심**: 분산 시스템은 일관성(Consistency), 가용성(Availability), 분할 허용(Partition Tolerance) 중 두 가지만 동시에 만족할 수 있다.

**ADL 연결**: 구조적 동형(structural isomorphism)에서 가장 가까운 선조. ADL 트릴레마의 세 꼭짓점(지급능력·수익·공정성)은 CAP의 세 꼭짓점과 대응한다. 논문이 명시적으로 "ADL은 금융 CAP 정리"라고 표현하지 않지만, 그 정신은 동일하다.

### Arrow 불가능성 정리 (1951)
**핵심**: 세 개 이상의 후보가 있을 때 파레토 효율성·비독재성·무관 대안 독립성을 동시에 만족하는 사회 후생 함수는 없다.

**ADL 연결**: Theorem 1이 "세 금융 공리는 동시 불가능"을 주장한다는 점에서 Arrow 정리와 같은 계열. 차이: Arrow 정리는 선호 집계, ADL 트릴레마는 청산 분배에 관한 것.

---

## 시장 미시구조 선조

### Kyle (1985) — Continuous Auctions and Insider Trading
**핵심**: 내부자, 시장조성자, 소음 거래자 세 주체 모형. 정보 비대칭이 가격 발견을 어떻게 방해하는지.

**ADL 연결**: ADL 역선택 문제와 직결. 고레버리지 포지션 보유자는 청산 압력에 대한 "내부 정보"(언제 청산될지)를 가진다. 큐 방식에서 Sybil 전략(지갑 분산)은 Kyle 모형의 전략적 정보 은닉과 같은 구조.

### Sannikov–Skrzypacz (2016) — Feedback Effects of Dynamic Trading
**핵심**: 동적 게임에서 거래소(중간자)의 정책이 트레이더 전략에 피드백을 준다.

**ADL 연결**: Theorem 5 (Stackelberg 게임)와 직결. 거래소의 ADL 정책이 공개되면 트레이더는 반응하고, 이 반응이 다시 ADL 빈도를 바꾼다 — 피드백 루프.

---

## 온라인 학습 선조

### Zinkevich (2003) — Online Convex Programming and Generalized Infinitesimal Gradient Ascent
**핵심**: 온라인 볼록 최적화의 기초. 학습률 $\eta = 1/\sqrt{T}$로 $O(\sqrt{T})$ 후회를 달성.

**ADL 연결**: 동적 ADL의 mirror descent 알고리즘은 Zinkevich의 OCP 프레임워크를 Bregman divergence로 확장한 것. 후회 경계 $O(\sqrt{T})$는 Zinkevich 결과와 정확히 일치.

### Nemirovski–Yudin (1983) — Problem Complexity and Method Efficiency
**핵심**: Mirror descent의 원형 — 비유클리드 기하학에 맞는 경사 하강법.

**ADL 연결**: 논문의 mirror descent는 Nemirovski–Yudin의 Bregman divergence 기반 업데이트의 직접 응용. 특히 확률 심플렉스 위의 ADL 정책 공간은 엔트로피 거리가 자연스럽다 — Nemirovski–Yudin이 다루는 비유클리드 설정의 전형적 예.

### Hazan (2016) — Introduction to Online Convex Optimization
**핵심**: OCP의 현대적 정리. 강볼록성·부드러움 조건 하에서 $O(\log T)$ 후회.

**ADL 연결**: 논문의 동적 ADL 분석의 직접적 교과서 레퍼런스.

---

## 극단값 이론 (EVT) 선조

### Fisher–Tippett–Gnedenko 정리 (1928/1943)
**핵심**: 최대값의 극한 분포는 세 가지(Gumbel·Fréchet·Weibull) 중 하나.

**ADL 연결**: Theorem 2에서 PTSR의 점근 분석이 EVT에 근거한다. "최대 승자 PNL이 얼마나 클 수 있는가"는 최대값 분포 문제이고, EVT가 tail behavior를 결정한다.

### de Haan–Ferreira (2006) — Extreme Value Theory: An Introduction
**핵심**: 다변량 EVT와 tail dependence의 현대적 정리.

**ADL 연결**: 복수 트레이더의 동시 극단 손실은 다변량 EVT 문제. 논문은 단변량 설정에서 시작하지만, 실제 ADL 이벤트(10월 10일, 162개 종목 동시)는 다변량 꼬리 사건.

---

## DeFi / 암호화폐 청산 선조

### Gudgeon et al. (2020) — DeFi Protocols for Loanable Funds
**핵심**: 초기 DeFi 청산 시스템(Compound, Aave)의 경제적 분석.

**ADL 연결**: 전통 청산과 ADL의 차이점을 부각하는 배경. DeFi에서는 청산인(liquidator)이 프로토콜이 아닌 외부 참가자이고, 수익 추구 봇이 과잉 청산을 할 동기가 있다 — ADL의 "과잉 사회화" 문제와 평행.

### Qin et al. (2021) — Attacking the DeFi Ecosystem with Flash Loans for Fun and Profit
**핵심**: 플래시 론을 이용한 DeFi 프로토콜 조작.

**ADL 연결**: 플래시 론 공격과 ADL Sybil 공격은 같은 계열의 메커니즘 조작이다 — 다수의 작은 거래로 집중 위험을 회피하거나 이익을 극대화. 논문의 Sybil 저항 공리가 왜 필요한지를 보여주는 동기.

---

## ADL 자체의 역사적 계보

```
BitMEX (2016) ─── 최초 큐 기반 ADL 구현
       ↓
Binance (2019) ─── 큐 방식 + 보험기금 확장
       ↓
Bybit / OKX (2020) ─── 유사 큐 방식 + 자체 변형
       ↓
Hyperliquid (2023) ─── 완전 온체인 큐 방식 (최초 블록체인 ADL 기록)
       ↓
Oct 10 2025 이벤트 ─── $2.1B ADL — 이론 공백의 실증
       ↓
논문 (arXiv:2512.01112) ─── 최초 공리적 체계화
```

---

## 논문이 채우는 공백

이전 문헌들은:
1. **메커니즘 설계 이론**은 선거/경매에 집중 — 금융 청산에 적용한 사례 없음
2. **시장 미시구조**는 정보 비대칭·가격 발견에 집중 — 손실 사회화 최적화 없음
3. **온라인 학습**은 거래 알고리즘에 응용됐지만 — ADL 정책 공간에 적용된 사례 없음
4. **DeFi 청산 연구**는 실증 중심 — 공리적 불가능성 정리 없음

논문은 이 네 줄기를 하나의 형식 체계로 통합한 최초 시도다.

---

## 이 절의 핵심 한 문장

**ADL 트릴레마는 Arrow·CAP·Gibbard–Satterthwaite의 불가능성 전통을, 최적 메커니즘은 Kyle·Zinkevich·Nemirovski의 학습·경매 이론을 암호화폐 청산 문제에 수렴시킨 것이다.**
