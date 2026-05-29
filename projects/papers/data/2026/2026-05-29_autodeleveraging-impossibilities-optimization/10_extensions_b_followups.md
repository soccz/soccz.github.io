# 10-B · 확장 — 후속 논문 3편

---

## 후속 논문 1: 시장 미시구조 + 청산 슬리피지

**찾아야 할 논문 유형**:
*Kyle (1985) lambda 추정 × 암호화폐 LOB × 청산 가격 충격*

**왜**: 논문의 핵심 가정 3(유동화 전략 추상화)은 가장 강한 가정이다. 실제 ADL 최적화를 하려면 가격 충격 함수 $f(\text{size}, \text{depth})$가 필요하다. 이를 암호화폐 LOB 데이터에서 실증한 논문이 있다면, $g^*$ 도출에서 가정 3을 완화할 수 있다.

**키워드**:
- "permanent price impact perpetual futures"
- "LOB liquidity crypto derivatives ADL"
- "Kyle lambda cryptocurrency order book"

**기대 기여**:
- $D_t$ 계산에서 슬리피지를 내생화 → ADL 최적화 문제가 내생 충격을 포함한 형태로 확장
- g*의 "실제 시장 버전" 계산 가능

---

## 후속 논문 2: 온라인 메커니즘 설계 (경매 이론)

**구체 논문**:

### Roughgarden & Tardos (2002) — "How Bad is Selfish Routing?"
*Journal of the ACM, 49(2)*

**왜**: 메커니즘 설계에서 "이기적 행동이 사회 최적에서 얼마나 이탈하는가"를 Price of Anarchy로 측정한다. ADL에서 트레이더가 이기적으로 행동할 때(Sybil 공격, 레버리지 조작) 사회 최적(최소 총 부족액)에서의 이탈이 Price of Anarchy 프레임으로 측정될 수 있다.

**연결 질문**: ADL 큐 방식의 Price of Anarchy는 얼마인가? — 즉 "트레이더가 모두 이기적으로 행동할 때 총 손실이 협조 최적 대비 몇 배인가?"

### Myerson (1981) — "Optimal Auction Design"
*Mathematics of Operations Research, 6(1)*

**왜**: ADL haircut 배분은 "누가 얼마를 부담하는가"를 결정하는 경매 문제로 재해석 가능하다. Myerson의 Revenue Equivalence Theorem — 어떤 메커니즘이든 트레이더의 기대 지불액이 같다면 거래소의 기대 수익이 같다 — 이 ADL에 적용되면 "공정한 ADL이 거래소 수익을 저해하지 않는다"를 공식화할 수 있다.

**연결**: Theorem 3 (공정성과 지급능력의 양립 불가능성 조건)을 Myerson 프레임으로 재증명.

---

## 후속 논문 3: 암호화폐 시스템 리스크

**구체 논문**:

### Qin, Zhou, Livshits, Gervais (2021) — "Attacking the DeFi Ecosystem with Flash Loans for Fun and Profit"
*IEEE S&P 2021*

**왜**: DeFi 청산 시스템에 대한 실증 공격 분석. ADL의 "외부 공격자"(청산 봇, 플래시 론 조작자)와 ADL 메커니즘 선택이 어떻게 상호작용하는지를 파악하는 배경.

**ADL 연결**:
- Oct 10 2025 이벤트에서 외부 공격자가 ADL 이벤트를 의도적으로 유발했을 가능성이 있다 — 대규모 포지션으로 청산 캐스케이드를 시작한 후 pro-rata 전환을 예측하고 포지션 조정
- 논문은 이 가능성을 분석하지 않는다 — 공백

**기대 기여**: ADL 메커니즘이 외부 조작에 얼마나 취약한가를 실증하는 후속 연구 설계 가능.

---

## 세 논문의 연결 지도

```
내생 가격 충격 (후속 1)
    ↓ 슬리피지 내생화
ADL 최적화 문제 (본 논문)
    ↑ 이기적 행동 분석      ↑ 외부 조작 분석
Price of Anarchy (후속 2)   외부 공격 (후속 3)
```

이 세 방향이 함께 해결되면 ADL 이론이 "추상 메커니즘 설계"에서 "실제 시장 설계"로 이행한다.

---

## 이 절의 핵심 한 문장

**가장 시급한 후속 연구는 내생 가격 충격 모델링(후속 1)이다 — g*의 실제 최적성이 이에 달려 있기 때문이다.**
