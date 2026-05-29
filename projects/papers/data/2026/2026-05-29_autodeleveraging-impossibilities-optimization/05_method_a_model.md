# 05-A · 방법론 해부 — 형식 모델: 영구 선물 거래소의 수학적 구조

> **배경 사다리**: 이 섹션은 논문이 다루는 모든 수식의 기초다. (1) "포지션(position)"이란 코인 선물을 보유한 상태를 뜻한다. (2) "담보(collateral)"는 거래를 위해 맡겨 둔 돈. (3) "펀딩 비율(funding rate)"은 롱-숏 불균형을 맞추기 위해 둘 사이에 주고받는 수수료다. 이 세 개념만 있으면 충분하다.

---

## 왜 이 형식 모델이 필요한가

기존 거래소들은 "이렇게 운영하면 잘 된다"는 경험칙으로 ADL을 설계했다. 수학적으로 어떤 조건이 만족되는지, 어떤 조건이 충돌하는지 분석하려면 먼저 모든 개념을 정밀하게 정의해야 한다. 이 절은 "ADL 연구를 위한 공통 언어"를 만드는 작업이다.

---

## 영구 선물 거래소 정의 (§2, Definition 2.1)

거래소는 $n$명의 트레이더로 구성된다:

$$\mathcal{P}_n = \{(q_i, c_i, t_i, b_i) \in \mathbb{R}_+^3 \times \{-1, +1\} : i \in [n]\}$$

각 트레이더의 포지션 $\mathfrak{p}_i = (q_i, c_i, t_i, b_i)$:

| 기호 | 의미 | 단위 |
|------|------|------|
| $q_i$ | 보유 명목 수량 | 코인 수 |
| $c_i$ | 담보 (초기 마진) | 달러 |
| $t_i$ | 포지션 개설 시각 | 타임스탬프 |
| $b_i$ | 방향 (+1 롱, -1 숏) | 무단위 |

- **일상 비유**: 포지션은 "아파트 임대차 계약서"와 같다 — 계약 수량, 보증금, 계약일, 매도/매수 방향이 모두 명시된 문서.

---

## 핵심 수량 1: 명목 노출과 레버리지 (§2, Def 2.2–2.3)

**명목 노출(Notional Exposure)**:

$$n_{i,t} = p_t \cdot q_i$$

현재 가격 $p_t$로 환산한 포지션의 달러 가치.

**레버리지(Leverage)**:

$$\ell_i = \frac{p_{t_i} \cdot q_i}{c_i}$$

포지션 개설 시점의 명목 가치를 담보로 나눈 값. 레버리지 10이면 담보의 10배 포지션.

초기 마진 요건: $m_I \cdot p_{t_i} \cdot q_i \leq c_i$, 즉 최대 레버리지 $\ell^{\max} = 1/m_I$.

- **조심할 점**: 레버리지는 개설 시점 가격 기준이고, 이후 가격이 움직이면 실효 레버리지가 바뀐다.

---

## 핵심 수량 2: 펀딩 비율과 자금 축적 (§2, Def 2.4–2.5)

**펀딩 비율(Funding Rate)**:

$$\gamma_t = \kappa \left(\frac{L(\mathcal{P}_n, p_t)}{S(\mathcal{P}_n, p_t)} - \frac{p_t}{\hat{p}_t}\right)$$

- **기호 뜻**: $L, S$ = 롱·숏 총 미결제약정(open interest), $\hat{p}_t$ = 현물 오라클 가격, $\kappa > 0$ = 감쇄 상수
- **일상 비유**: 에스컬레이터에서 올라가는 사람이 내려가는 사람보다 많으면 올라가는 사람이 내려가는 사람에게 "탑승료"를 내는 것
- **왜 이 형태**: 선물가격을 현물가격에 묶어두기 위한 자동 조정 메커니즘. L/S 불균형이 클수록 기여율이 높아진다
- **조심할 점**: 펀딩은 제로섬이다 — $\sum_i (b_i q_i) \gamma_t p_t = 0$. 거래소는 펀딩에서 돈을 버는 게 아니다

**누적 펀딩(Cumulative Funding)**:

$$\Gamma(\mathfrak{p}_{i,t}, t, T) = \sum_{s=t+1}^{T} (b_i q_i) \gamma_s p_s$$

포지션 개설 후 $T$까지 받은/낸 펀딩 총액.

---

## 핵심 수량 3: PNL과 지분 (§2, Def 2.6–2.7)

**손익(Profit and Loss, PNL)**:

$$\text{PNL}_{s:T}(\mathfrak{p}_i) = \mathbf{1}_{s \leq t_i < T} \left[ b_i q_i (p_T - p_{t_i}) + \Gamma(\mathfrak{p}_{i,t_i}, t_i, T) \right]$$

- **기호 뜻**: $p_T - p_{t_i}$ = 종료 가격 - 진입 가격 (방향 $b_i$ 곱으로 롱은 상승이 이익, 숏은 하락이 이익)
- **일상 비유**: "매입가와 처분가의 차이에 수량을 곱한 것, 그리고 그 동안 받거나 낸 '임대료'(펀딩)를 더한 것"

**지분(Equity)**:

$$e(\mathfrak{p}_{i,t}) = c_{i,t} + \text{PNL}_T(\mathfrak{p}_{i,t})$$

남은 담보에 PNL을 더한 것. 지분 = 0이 "파산선(bankruptcy line)".

---

## 핵심 수량 4: 유동화와 부족액 (§2.1)

트레이더 지분이 **maintenance margin** 이하로 떨어지면 강제 청산이 실행된다:

$$e(\mathfrak{p}_{i,t}) \leq m_\mu \cdot p_t \cdot |q_i|$$

**파산 가격(Bankruptcy Price)** — 지분이 0이 되는 가격:

$$p^{bk}(\mathfrak{p}_{i,t}) = p_t \cdot \max\left(1 - \frac{b_i}{\ell_{i,t}}, 0\right)$$

레버리지 10이고 롱이면 $p^{bk} = p_t \cdot (1 - 1/10) = 0.9 p_t$. 즉 10% 하락이면 파산.

**총 부족액(Total Shortfall, Bad Debt)**:

$$D_t = \sum_{\mathfrak{p} \in \mathcal{P}_n} \left(-\tilde{e}(\mathfrak{p}_{i,t})\right)_-$$

여기서 $\tilde{e}$는 청산 후 조정 지분. 부족액은 청산 실패로 인해 거래소가 추가로 떠안아야 하는 금액.

---

## 핵심 수량 5: 거래소 지급능력과 보험기금 (§2.2)

**지급능력(Solvency)**:

$$\text{Solv}_T(\mathcal{P}_n) = \sum_{\mathfrak{p} \in \mathcal{P}_n} e_T(\mathfrak{p}) = \sum_i c_i + \text{PNL}_T(\mathfrak{p}_i)$$

모든 지분의 합이 0 이상이어야 한다. 흥미로운 사실: 펀딩이 제로섬이므로 $\text{Solv}_T$는 "전체 담보 + 실현 PNL의 합"으로, 거래소가 별도 이익/손실이 없는 한 불변이어야 한다. 그러나 청산 슬리피지·수수료 등으로 실제로는 변한다.

**보험기금(Insurance Fund) 동학**:

$$\text{IF}_{t+1} = \text{IF}_t + \alpha \sum \tau_t(\Delta q_j) + \eta p_t V_t + \beta \sum |\gamma_t| p_t q_i - \min\{\text{IF}_t, D_t\}$$

- $\tau_t$: 청산 수수료 (거래소 수익의 일부)
- $V_t$: 총 거래량 (수수료 기반 수익)
- $|\gamma_t|$: 펀딩 비율 절댓값 (선택적 펀딩 수수료)
- $\min\{\text{IF}_t, D_t\}$: 부족액이 발생하면 보험기금에서 지출

보험기금이 소진되면 ADL이 실행된다.

---

## 레버리지 질량: 리스크의 집계 측도 (§3)

논문은 "레버리지 질량"이라는 새로운 개념을 도입한다:

$$\ell_t^+ = \sum_{i \in \mathcal{W}_t} \lambda_{i,t}^+, \quad \ell_t^- = \sum_{i \in \mathcal{L}_t} \lambda_{i,t}^-$$

여기서 효과적 레버리지는 $\lambda_{i,t}^+ = n_{i,t} / e_i$ (승자), $\lambda_{i,t}^- = n_{i,t} / |e_i|$ (패자).

- **직관**: "시장에 얼마나 많은 레버리지 위험이 집중되어 있는가"의 척도
- **용도**: 가격 충격이 $\Delta p$일 때 기대 부족액을 $\ell_t^-$로 근사할 수 있어 리스크 모니터링에 활용

---

## 이 절의 핵심 한 문장

**거래소의 지급능력·공정성·수익이라는 세 성질은 이 형식 모델에서 모두 $e, D_t, \text{IF}$의 부등식으로 표현되며, 이 부등식들 사이의 충돌이 트릴레마의 수학적 본질이다.**
