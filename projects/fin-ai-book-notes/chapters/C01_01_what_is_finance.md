# 1.1 금융이란 무엇인가? — *What is Finance?*

> **읽는 데 걸리는 시간**: 처음 보는 사람 기준 약 40분

---

## 🪧 이 절을 한 줄로

> 금융이란 **"미래의 돈"과 "오늘의 돈"을 바꿔주는 시스템**이다.
> 그 교환이 일어나는 곳마다 **데이터**가 쌓이고, AI는 그 데이터를 먹고 산다.

책은 §1.1을 1쪽으로 끝내면서 "**현대 금융은 데이터 중심**"이라는 한 줄만 남기고 다음 절로 넘어간다. 이 해설집은 그 한 줄이 **왜** 그런지, 그리고 **어떻게** AI로 연결되는지까지 따라간다.

### 📍 이 절을 읽기 전에 머릿속에 그려둘 그림

<svg viewBox="0 0 760 240" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <defs>
    <marker id="ar0" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#3a7d44"/></marker>
    <marker id="ar1" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#57534e"/></marker>
  </defs>
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">금융 = 시간을 가로지르는 돈의 이동 + 그 흐름이 만드는 데이터</text>
  <!-- Time axis -->
  <line x1="80" y1="130" x2="680" y2="130" stroke="#a8a29e" stroke-width="1.5"/>
  <line x1="80" y1="125" x2="80" y2="135" stroke="#a8a29e" stroke-width="1.5"/>
  <line x1="380" y1="125" x2="380" y2="135" stroke="#a8a29e" stroke-width="1.5"/>
  <line x1="680" y1="125" x2="680" y2="135" stroke="#a8a29e" stroke-width="1.5"/>
  <text x="80" y="155" text-anchor="middle" font-size="12" fill="#57534e">과거</text>
  <text x="380" y="155" text-anchor="middle" font-size="12" fill="#1c1917" font-weight="700">오늘</text>
  <text x="680" y="155" text-anchor="middle" font-size="12" fill="#57534e">미래</text>
  <!-- Past flow (loan repayment) -->
  <path d="M 150 95 Q 270 60, 380 110" fill="none" stroke="#3a7d44" stroke-width="2" marker-end="url(#ar0)"/>
  <text x="265" y="55" text-anchor="middle" font-size="11" fill="#3a7d44">옛날에 빌린 돈, 오늘 갚기</text>
  <!-- Future flow (saving/investment) -->
  <path d="M 380 110 Q 530 60, 650 95" fill="none" stroke="#3a7d44" stroke-width="2" marker-end="url(#ar0)"/>
  <text x="510" y="55" text-anchor="middle" font-size="11" fill="#3a7d44">오늘 모은 돈, 미래에 쓰기</text>
  <!-- Data layer -->
  <rect x="60" y="180" width="640" height="40" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
  <text x="380" y="205" text-anchor="middle" font-family="Noto Sans KR,sans-serif" font-size="13" font-weight="700" fill="#3a7d44">📊 데이터 레이어 — 모든 시간 이동이 기록된다 (AI가 학습하는 재료)</text>
</svg>

> 💬 이 그림이 **이 책 전체의 지도**다. 1장은 윗부분(시간 이동)을, 2~6장은 아랫부분(데이터)을 다룬다.

---

## 🟢 [초급] — 일상 비유로 잡는 감

### 💭 시작하기 전에 — 왜 이 절을 읽어야 하나?

"금융 AI"를 공부하려는데 책의 §1.1이 "**금융은 finis에서 왔다**" 같은 어원 얘기로 시작해서 좀 당황스러웠다면 정상이다.
그런데 이 어원에 **금융의 모든 본질**이 들어 있다. 5분만 따라오면 보인다.

### 1. 금융을 1초만에 이해하는 비유

친구가 너에게 말한다.

> "야, 5만원만 빌려줘. 다음 주 월요일에 갚을게."

이 한 줄이 **금융의 모든 핵심**을 담고 있다. 분해하면 이렇다:

<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <defs>
    <marker id="ar2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#c4724e"/></marker>
  </defs>
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">"5만원만 빌려줘, 다음 주에 갚을게" 한 줄에 숨은 4가지 개념</text>
  <!-- Today -->
  <rect x="50" y="60" width="180" height="100" rx="8" fill="#fff" stroke="#d6d3d1"/>
  <text x="140" y="85" text-anchor="middle" font-family="Noto Sans KR,sans-serif" font-size="13" font-weight="700" fill="#1c1917">오늘 (확실)</text>
  <text x="140" y="110" text-anchor="middle" font-size="14" fill="#3a7d44" font-weight="700">💰 5만원</text>
  <text x="140" y="135" text-anchor="middle" font-size="11" fill="#57534e">"내가 줄 수 있다"</text>
  <!-- Arrow -->
  <path d="M 235 110 Q 360 75, 485 110" fill="none" stroke="#c4724e" stroke-width="2" marker-end="url(#ar2)"/>
  <text x="360" y="70" text-anchor="middle" font-size="11" fill="#c4724e">시간 이동 (1주일)</text>
  <text x="360" y="130" text-anchor="middle" font-size="11" fill="#c4724e">+ 약속</text>
  <!-- Future -->
  <rect x="490" y="60" width="180" height="100" rx="8" fill="#fff" stroke="#d6d3d1"/>
  <text x="580" y="85" text-anchor="middle" font-family="Noto Sans KR,sans-serif" font-size="13" font-weight="700" fill="#1c1917">다음 주 (불확실)</text>
  <text x="580" y="110" text-anchor="middle" font-size="14" fill="#a8a29e" font-weight="700">💰 5만원 (?)</text>
  <text x="580" y="135" text-anchor="middle" font-size="11" fill="#57534e">"진짜 받을 수 있을까?"</text>
  <!-- 4 concepts -->
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <rect x="50" y="190" width="150" height="65" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="125" y="210" text-anchor="middle" font-weight="700" fill="#c4724e">⏱ 시간 이동</text>
    <text x="125" y="228" text-anchor="middle" fill="#1c1917">오늘 → 다음주</text>
    <text x="125" y="244" text-anchor="middle" fill="#57534e">time travel</text>
    <rect x="210" y="190" width="150" height="65" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="285" y="210" text-anchor="middle" font-weight="700" fill="#c4724e">⚠ 위험</text>
    <text x="285" y="228" text-anchor="middle" fill="#1c1917">안 갚을 수도</text>
    <text x="285" y="244" text-anchor="middle" fill="#57534e">risk</text>
    <rect x="370" y="190" width="150" height="65" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="445" y="210" text-anchor="middle" font-weight="700" fill="#c4724e">💵 가격</text>
    <text x="445" y="228" text-anchor="middle" fill="#1c1917">"이자 줄게"</text>
    <text x="445" y="244" text-anchor="middle" fill="#57534e">price of risk</text>
    <rect x="530" y="190" width="150" height="65" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="605" y="210" text-anchor="middle" font-weight="700" fill="#c4724e">🤝 신용</text>
    <text x="605" y="228" text-anchor="middle" fill="#1c1917">친구를 믿는다</text>
    <text x="605" y="244" text-anchor="middle" fill="#57534e">credit / trust</text>
  </g>
</svg>

- **시간 이동(time travel)**: 5만원을 오늘 → 다음 주로 보냈다.
- **위험(risk)**: 친구가 안 갚을 수도 있다.
- **가격(price)**: "이자 줄게" — 위험과 시간의 대가.
- **신용(credit)**: 친구를 믿어서 빌려준다.

> 💡 **금융이란 곧, "시간을 가로지르는 돈의 이동"이다.**
> 은행도, 보험도, 주식도, 채권도, 파생상품도, 모두 이 한 줄의 응용일 뿐이다.

📦 **응용 예시 — 친구 빌리기를 확장하면**:

| 거래 | 시간 이동 | 위험 | 가격 |
|------|----------|------|------|
| **친구 빌리기** | 오늘 → 다음주 | 안 갚을 수도 | 보통 0% |
| **은행 예금** | 오늘 → 1년 후 | 은행 망할 수도 | 연 3% |
| **주식 사기** | 오늘 → 미래 | 가격 떨어질 수도 | 배당 + 자본이득 |
| **보험 가입** | 매달 → 사고날 때 | 사고 안 날 수도 | 보험료 |
| **국채 사기** | 오늘 → 만기 | 정부 부도 (거의 0) | 연 3~4% |

> ✅ **여기까지 따라왔으면**: 금융 상품이 다 같은 구조라는 게 보일 거다. 차이는 "시간이 얼마인지, 위험이 얼마인지, 가격이 얼마인지"뿐이다.

### 2. 어원에 숨은 힌트 — 동서양 모두 "흐름"을 뜻한다

책에 적힌 어원 얘기를 풀어보자:

<svg viewBox="0 0 720 260" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">서양 어원 vs. 동양 어원 — 같은 곳을 가리킨다</text>
  <!-- West -->
  <g>
    <rect x="60" y="50" width="280" height="180" rx="8" fill="#fff" stroke="#d6d3d1"/>
    <text x="200" y="78" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#c4724e">🌍 서양: finance</text>
    <text x="200" y="105" text-anchor="middle" font-size="12" fill="#1c1917">라틴어 <tspan font-weight="700">finis</tspan></text>
    <text x="200" y="125" text-anchor="middle" font-size="11" fill="#57534e">= "끝, 종결"</text>
    <text x="200" y="155" text-anchor="middle" font-size="12" fill="#1c1917">= "<tspan font-weight="700">빚을 끝내는 행위</tspan>"</text>
    <text x="200" y="180" text-anchor="middle" font-size="11" fill="#57534e">= "오늘 빌린 것을 미래에 갚는다"</text>
    <text x="200" y="205" text-anchor="middle" font-size="11" fill="#57534e">→ 결국 <tspan font-weight="700" fill="#c4724e">시간을 거슬러 청산</tspan></text>
  </g>
  <!-- East -->
  <g>
    <rect x="380" y="50" width="280" height="180" rx="8" fill="#fff" stroke="#d6d3d1"/>
    <text x="520" y="78" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#5a7a96">🏯 동양: 金融 (금융)</text>
    <text x="520" y="105" text-anchor="middle" font-size="12" fill="#1c1917"><tspan font-weight="700">金</tspan>(쇠/돈) + <tspan font-weight="700">融</tspan>(녹다/통하다)</text>
    <text x="520" y="125" text-anchor="middle" font-size="11" fill="#57534e">= "돈이 녹아 흐른다"</text>
    <text x="520" y="155" text-anchor="middle" font-size="12" fill="#1c1917">= "<tspan font-weight="700">돈이 막힘없이 이동</tspan>"</text>
    <text x="520" y="180" text-anchor="middle" font-size="11" fill="#57534e">= "필요한 곳으로 돈이 흘러간다"</text>
    <text x="520" y="205" text-anchor="middle" font-size="11" fill="#57534e">→ 결국 <tspan font-weight="700" fill="#5a7a96">시간을 가로지르는 이동</tspan></text>
  </g>
</svg>

두 어원이 다른 것 같지만 **결국 같은 말**이다.

> 빚을 끝내려면(서양) 돈이 흘러야(동양) 한다.

이게 단순한 우연이 아니다. **인류가 어디서든 같은 문제(시간을 가로지르는 가치 이동)에 부딪혔다**는 증거다. 그래서 금융은 특정 문화권의 발명품이 아니라 **인류 보편의 시스템**이다.

> 💬 이런 식의 어원 풀이를 책이 안 해줘서 "이게 왜 §1.1에 있지?" 싶었을 수 있다. 답: 금융의 **본질이 시간 이동**임을 어원이 증명하고 있어서.

### 3. 물물교환 → 화폐 → 금융 → 데이터

책이 한 문단으로 압축한 4단계 진화를 풀어 그리면:

<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <defs>
    <marker id="arrow3" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#57534e"/></marker>
  </defs>
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">금융의 4단계 진화 — 매개체가 점점 추상화된다</text>
  <!-- Stage 1: Barter -->
  <g>
    <rect x="20" y="60" width="160" height="120" rx="8" fill="#fff" stroke="#d6d3d1"/>
    <text x="100" y="86" text-anchor="middle" font-family="Noto Sans KR,sans-serif" font-size="13" font-weight="700" fill="#1c1917">1단계 — 물물교환</text>
    <text x="100" y="110" text-anchor="middle" font-size="22">🌾 ↔ 🐟</text>
    <text x="100" y="135" text-anchor="middle" font-size="10" fill="#57534e">곡식 ↔ 물고기</text>
    <text x="100" y="150" text-anchor="middle" font-size="10" fill="#a8a29e">B.C. 9000년</text>
    <text x="100" y="168" text-anchor="middle" font-size="10" fill="#c4724e">한계: "더블 일치 문제"</text>
  </g>
  <line x1="185" y1="120" x2="215" y2="120" stroke="#57534e" stroke-width="1.5" marker-end="url(#arrow3)"/>
  <!-- Stage 2: Money -->
  <g>
    <rect x="220" y="60" width="160" height="120" rx="8" fill="#fff" stroke="#d6d3d1"/>
    <text x="300" y="86" text-anchor="middle" font-family="Noto Sans KR,sans-serif" font-size="13" font-weight="700" fill="#1c1917">2단계 — 화폐</text>
    <text x="300" y="110" text-anchor="middle" font-size="22">🐚 💰 💵</text>
    <text x="300" y="135" text-anchor="middle" font-size="10" fill="#57534e">조개 → 금속 → 종이</text>
    <text x="300" y="150" text-anchor="middle" font-size="10" fill="#a8a29e">B.C. 600년~</text>
    <text x="300" y="168" text-anchor="middle" font-size="10" fill="#c4724e">한계: 보관·운반 비용</text>
  </g>
  <line x1="385" y1="120" x2="415" y2="120" stroke="#57534e" stroke-width="1.5" marker-end="url(#arrow3)"/>
  <!-- Stage 3: Institutions -->
  <g>
    <rect x="420" y="60" width="160" height="120" rx="8" fill="#fff" stroke="#d6d3d1"/>
    <text x="500" y="86" text-anchor="middle" font-family="Noto Sans KR,sans-serif" font-size="13" font-weight="700" fill="#1c1917">3단계 — 금융기관</text>
    <text x="500" y="110" text-anchor="middle" font-size="22">🏦 📜 📊</text>
    <text x="500" y="135" text-anchor="middle" font-size="10" fill="#57534e">은행·증권·보험</text>
    <text x="500" y="150" text-anchor="middle" font-size="10" fill="#a8a29e">A.D. 1400년~</text>
    <text x="500" y="168" text-anchor="middle" font-size="10" fill="#c4724e">한계: 신뢰 비용</text>
  </g>
  <line x1="585" y1="120" x2="615" y2="120" stroke="#57534e" stroke-width="1.5" marker-end="url(#arrow3)"/>
  <!-- Stage 4: Data + AI -->
  <g>
    <rect x="620" y="60" width="130" height="120" rx="8" fill="#edf7ef" stroke="#3a7d44" stroke-width="2"/>
    <text x="685" y="86" text-anchor="middle" font-family="Noto Sans KR,sans-serif" font-size="13" font-weight="700" fill="#3a7d44">4단계 — 데이터+AI</text>
    <text x="685" y="110" text-anchor="middle" font-size="22">💾 🤖</text>
    <text x="685" y="135" text-anchor="middle" font-size="10" fill="#3a7d44">DB의 행(row)</text>
    <text x="685" y="150" text-anchor="middle" font-size="10" fill="#3a7d44">2010년~</text>
    <text x="685" y="168" text-anchor="middle" font-size="10" fill="#3a7d44">한계: 알고리즘 신뢰</text>
  </g>
  <!-- Abstraction axis -->
  <line x1="20" y1="220" x2="750" y2="220" stroke="#a8a29e" stroke-width="1"/>
  <text x="20" y="245" text-anchor="start" font-size="11" fill="#57534e">실물</text>
  <text x="750" y="245" text-anchor="end" font-size="11" fill="#57534e">완전 추상</text>
  <text x="385" y="245" text-anchor="middle" font-size="11" font-weight="700" fill="#1c1917">← 추상화 정도가 점점 높아진다 →</text>
  <text x="380" y="285" text-anchor="middle" font-size="12" font-style="italic" fill="#57534e">곡식은 만질 수 있지만, 화폐는 표상이고, 예금은 약속이고, 데이터는 비트다.</text>
  <text x="380" y="305" text-anchor="middle" font-size="11" fill="#3a7d44" font-weight="700">→ 그래서 "현대 금융 = 데이터 산업"이 된다.</text>
</svg>

> 🔍 **"더블 일치 문제(double coincidence of wants)"란?**
> 물물교환에서 가장 큰 문제. "내가 가진 것 ↔ 상대가 원하는 것"이 **동시에** 일치해야 거래가 된다. 곡식 농부가 신발이 필요한데 신발장수가 곡식이 아니라 생선을 원하면 거래 불가. → 그래서 화폐가 등장했다.

#### 핵심 통찰: 매개체가 추상화될수록 AI가 강력해진다

| 단계 | 매개체 | 분석할 데이터 양 | AI 적용 가능성 |
|------|--------|----------------|---------------|
| 물물교환 | 실물 | 거의 없음 | 불가능 |
| 화폐 | 종이/금속 | 적음 (장부) | 미약 |
| 금융기관 | 약속(예금/증서) | 많음 (디지털 장부) | 일부 |
| **데이터 + AI** | **비트** | **폭발적** | **모든 곳** |

> 💡 그래서 책이 마지막 줄에 "**현대 금융의 중요한 과제는 이 데이터를 효과적으로 분석하고 활용하는 것**"이라고 적은 거다.
> 이 책이 *금융 AI* 책인 이유가 바로 이 한 문장에 압축돼 있다.

> ✅ **여기까지 따라왔으면**: 금융이 "왜 데이터 산업이 됐는지"의 흐름이 보일 것이다. 다음은 이걸 좀 더 정밀하게 본다.

---

## 🟡 [중급] — 동작 원리

### 💭 시작하기 전에

[초급]에서 본 "**금융 = 시간을 가로지르는 돈의 이동**"을 좀 더 정확히 정의하자. 핵심은 **수식 한 줄**이다. 이 한 줄을 알면 모든 금융 상품의 가격이 보인다.

### 1. 시간을 가로지르는 돈: 화폐의 시간 가치 (TVM)

#### 1.1 직관 — 오늘의 1만원 ≠ 1년 뒤의 1만원

내가 너에게 두 가지 옵션을 준다고 하자:

> ① 지금 1만원
> ② 1년 뒤 1만원

당연히 **① 지금**을 택한다. 왜?

세 가지 이유:

1. **기회비용**: 지금 받으면 은행에 넣어서 이자 받을 수 있음 (1년 뒤 1.05만원 등)
2. **인플레이션**: 1년 뒤 1만원의 구매력은 더 낮음
3. **위험**: 1년 뒤 진짜 받을 수 있을지 불확실

이 세 가지를 합쳐서 **할인율(discount rate) $r$** 이라고 부른다.

#### 1.2 수식 — Present Value의 정의

미래 가치를 오늘로 가져오는 공식:

$$ \text{PV} = \frac{\text{FV}}{(1+r)^n} $$

- $\text{PV}$ (Present Value): **현재 가치** — 오늘 기준의 돈
- $\text{FV}$ (Future Value): **미래 가치** — 미래 시점의 돈
- $r$: **할인율** (이자율, 수익률) — 보통 연 단위
- $n$: 기간 (연 단위)

#### 1.3 시각화 — PV/FV 관계

<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <defs>
    <marker id="arPV" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#c4724e"/></marker>
    <marker id="arFV" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#5a7a96"/></marker>
  </defs>
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">PV ↔ FV — 시간을 가로지르는 환산기</text>
  <!-- Time axis -->
  <line x1="100" y1="160" x2="620" y2="160" stroke="#1c1917" stroke-width="2"/>
  <line x1="100" y1="155" x2="100" y2="165" stroke="#1c1917" stroke-width="2"/>
  <line x1="620" y1="155" x2="620" y2="165" stroke="#1c1917" stroke-width="2"/>
  <!-- Labels -->
  <text x="100" y="185" text-anchor="middle" font-size="13" font-weight="700" fill="#1c1917">오늘 (t=0)</text>
  <text x="620" y="185" text-anchor="middle" font-size="13" font-weight="700" fill="#1c1917">n년 후</text>
  <!-- PV box -->
  <rect x="55" y="100" width="90" height="40" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
  <text x="100" y="125" text-anchor="middle" font-size="14" font-weight="700" fill="#c4724e">PV</text>
  <!-- FV box -->
  <rect x="575" y="100" width="90" height="40" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
  <text x="620" y="125" text-anchor="middle" font-size="14" font-weight="700" fill="#5a7a96">FV</text>
  <!-- Compound arrow (PV → FV) -->
  <path d="M 150 110 Q 360 50, 570 110" fill="none" stroke="#5a7a96" stroke-width="2" marker-end="url(#arFV)"/>
  <text x="360" y="55" text-anchor="middle" font-size="13" fill="#5a7a96" font-weight="700">FV = PV × (1+r)ⁿ</text>
  <text x="360" y="72" text-anchor="middle" font-size="10" fill="#5a7a96">"미래로 키운다 (복리)"</text>
  <!-- Discount arrow (FV → PV) -->
  <path d="M 570 130 Q 360 220, 150 130" fill="none" stroke="#c4724e" stroke-width="2" marker-end="url(#arPV)"/>
  <text x="360" y="245" text-anchor="middle" font-size="13" fill="#c4724e" font-weight="700">PV = FV / (1+r)ⁿ</text>
  <text x="360" y="262" text-anchor="middle" font-size="10" fill="#c4724e">"현재로 할인한다"</text>
</svg>

오른쪽으로 가는 화살표는 **복리(compound)**, 왼쪽으로 가는 화살표는 **할인(discount)**.
이 두 화살표가 금융의 양방향 환산기다.

#### 1.4 직접 계산해보기

> 📝 **예시 1**: $r=5\%$, $n=1$일 때, 1년 뒤 10,000원의 현재가치는?
>
> $$ PV = \frac{10{,}000}{(1+0.05)^1} = \frac{10{,}000}{1.05} \approx 9{,}524원 $$
>
> 해석: "1년 뒤 1만원은 오늘 기준 9,524원의 가치가 있다."

> 📝 **예시 2**: $r=5\%$, $n=10$일 때, 10년 뒤 10,000원의 현재가치는?
>
> $$ PV = \frac{10{,}000}{1.05^{10}} \approx \frac{10{,}000}{1.629} \approx 6{,}139원 $$
>
> 해석: "10년이라는 시간이 가치를 36%나 깎아먹는다."

> 📝 **예시 3**: 반대로 — 오늘 1만원을 5% 이자로 30년 묻어두면?
>
> $$ FV = 10{,}000 \times 1.05^{30} \approx 43{,}219원 $$
>
> 해석: "복리의 마법. 4배 이상으로 불어난다."

> 💡 **이 공식이 금융이 다루는 모든 거래의 본질이다.**
> 채권 가격, 주식 DDM, 옵션 가치, 보험료, 리스료, 연금 — 전부 이 식의 변주.

### 2. 금융의 6가지 기능 (Merton-Bodie, 1995)

책은 "금융 = 자원 효율적 배분 + 위험 관리 + 가치 창출"이라고 추상적으로 적고 끝났다. 그런데 **실제로 금융이 하는 일은 6가지로 명확히 정리된다**. 이 분류를 알면 모든 금융 상품/기관이 어디에 속하는지 한눈에 보인다.

#### 6 functions of finance — 시각화

<svg viewBox="0 0 720 380" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">Merton-Bodie 6가지 기능 — 모든 금융 상품은 이 중 하나 이상이다</text>
  <!-- Center -->
  <circle cx="360" cy="200" r="55" fill="#fff" stroke="#3a7d44" stroke-width="2"/>
  <text x="360" y="195" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="13" font-weight="700" fill="#3a7d44">금융의</text>
  <text x="360" y="215" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="13" font-weight="700" fill="#3a7d44">6가지 기능</text>
  <!-- 6 hexagon nodes -->
  <!-- Top -->
  <g>
    <rect x="280" y="55" width="160" height="80" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="360" y="80" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">① 결제</text>
    <text x="360" y="100" text-anchor="middle" font-size="10" fill="#1c1917">Payments</text>
    <text x="360" y="118" text-anchor="middle" font-size="10" fill="#57534e">카드·송금·CBDC</text>
  </g>
  <!-- Top right -->
  <g>
    <rect x="540" y="120" width="160" height="80" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="620" y="145" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">② 자금 풀링</text>
    <text x="620" y="165" text-anchor="middle" font-size="10" fill="#1c1917">Pooling</text>
    <text x="620" y="183" text-anchor="middle" font-size="10" fill="#57534e">펀드·보험·예금</text>
  </g>
  <!-- Bottom right -->
  <g>
    <rect x="540" y="245" width="160" height="80" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="620" y="270" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">③ 시간/공간 이동</text>
    <text x="620" y="290" text-anchor="middle" font-size="10" fill="#1c1917">Resource transfer</text>
    <text x="620" y="308" text-anchor="middle" font-size="10" fill="#57534e">대출·예금·연금</text>
  </g>
  <!-- Bottom -->
  <g>
    <rect x="280" y="305" width="160" height="80" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="360" y="330" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">④ 위험 관리</text>
    <text x="360" y="350" text-anchor="middle" font-size="10" fill="#1c1917">Risk management</text>
    <text x="360" y="368" text-anchor="middle" font-size="10" fill="#57534e">보험·파생·헤지</text>
  </g>
  <!-- Bottom left -->
  <g>
    <rect x="20" y="245" width="160" height="80" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="100" y="270" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">⑤ 정보 제공</text>
    <text x="100" y="290" text-anchor="middle" font-size="10" fill="#1c1917">Information</text>
    <text x="100" y="308" text-anchor="middle" font-size="10" fill="#57534e">주가·신용등급·평가</text>
  </g>
  <!-- Top left -->
  <g>
    <rect x="20" y="120" width="160" height="80" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="100" y="145" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">⑥ 인센티브 해결</text>
    <text x="100" y="165" text-anchor="middle" font-size="10" fill="#1c1917">Incentive problems</text>
    <text x="100" y="183" text-anchor="middle" font-size="10" fill="#57534e">주주가치·스톡옵션</text>
  </g>
  <!-- Lines to center -->
  <line x1="360" y1="135" x2="360" y2="145" stroke="#a8a29e" stroke-width="1" stroke-dasharray="2,2"/>
  <line x1="540" y1="160" x2="415" y2="180" stroke="#a8a29e" stroke-width="1" stroke-dasharray="2,2"/>
  <line x1="540" y1="285" x2="415" y2="220" stroke="#a8a29e" stroke-width="1" stroke-dasharray="2,2"/>
  <line x1="360" y1="305" x2="360" y2="255" stroke="#a8a29e" stroke-width="1" stroke-dasharray="2,2"/>
  <line x1="180" y1="285" x2="305" y2="220" stroke="#a8a29e" stroke-width="1" stroke-dasharray="2,2"/>
  <line x1="180" y1="160" x2="305" y2="180" stroke="#a8a29e" stroke-width="1" stroke-dasharray="2,2"/>
</svg>

| # | 기능 | 영어 | 예시 |
|---|------|------|------|
| 1 | **결제 시스템** | Payments | 카드 결제, 송금, CBDC |
| 2 | **자금 풀링** | Pooling | 펀드, 보험, 크라우드펀딩 |
| 3 | **시간/공간 이동** | Transferring resources | 대출, 예금, 연금 |
| 4 | **위험 관리** | Managing risk | 보험, 파생상품, 헤지 |
| 5 | **정보 제공** | Providing information | 주가, 신용등급, 평가 |
| 6 | **인센티브 문제 해결** | Dealing with incentive problems | 주주가치, 임원 보상, ESG |

이 분류는 1995년 Robert Merton(1997 노벨상)과 Zvi Bodie가 *Financial Intermediation* 논문에서 제시한 **기능적 관점(functional perspective)** 이다.

#### 왜 이 분류가 중요한가?

기관(은행/보험/증권)이 아니라 **기능**으로 금융을 보면, **AI가 어디에 끼어들지가 명확해진다**.

> 💡 **이 책의 6개 장이 결국 이 6가지 기능과 매핑된다:**
> - Ch2 (투자) → 기능 ③ 시간/공간 이동 + ④ 위험 관리 + ⑤ 정보 제공
> - Ch3 (신용 리스크) → 기능 ⑤ 정보 제공 + ④ 위험 관리
> - Ch4 (사기 탐지) → 기능 ① 결제 + ⑥ 인센티브 해결
> - Ch5 (MLOps) → 인프라 (6기능 전체를 떠받침)
> - Ch6 (생성형 AI) → 기능 ⑤ 정보 제공

**핵심**: 이 책이 무작위로 6장을 모은 게 아니다. **Merton-Bodie의 6 functions에 사실상 1:1 대응**되도록 설계됐다. (저자가 명시적으로 안 적었을 뿐.)

### 3. 중개자 모델: 왜 은행이 존재하는가?

[초급]에서 친구한테 빌리는 얘기를 했다. 그런데 친구가 안 빌려주면? → 은행에 간다. 왜 은행이 빌려주나? → **중개자 모델**.

#### 은행이 푸는 두 가지 미스매치

<svg viewBox="0 0 720 360" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <defs>
    <marker id="arBL" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#3a7d44"/></marker>
    <marker id="arBR" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#c4724e"/></marker>
  </defs>
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">은행 = 두 미스매치를 푸는 중개자</text>
  <!-- Left side: Depositors -->
  <g>
    <rect x="40" y="80" width="180" height="100" rx="8" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="130" y="105" text-anchor="middle" font-family="Noto Sans KR,sans-serif" font-size="14" font-weight="700" fill="#3a7d44">예금자 (depositor)</text>
    <text x="130" y="128" text-anchor="middle" font-size="11" fill="#1c1917">• 돈 있음 (현재)</text>
    <text x="130" y="146" text-anchor="middle" font-size="11" fill="#1c1917">• 단기 (언제든 찾고 싶음)</text>
    <text x="130" y="164" text-anchor="middle" font-size="11" fill="#1c1917">• 위험 회피 (안전)</text>
  </g>
  <!-- Right side: Borrowers -->
  <g>
    <rect x="500" y="80" width="180" height="100" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="590" y="105" text-anchor="middle" font-family="Noto Sans KR,sans-serif" font-size="14" font-weight="700" fill="#c4724e">차입자 (borrower)</text>
    <text x="590" y="128" text-anchor="middle" font-size="11" fill="#1c1917">• 돈 필요 (미래 갚음)</text>
    <text x="590" y="146" text-anchor="middle" font-size="11" fill="#1c1917">• 장기 (수년 후 갚음)</text>
    <text x="590" y="164" text-anchor="middle" font-size="11" fill="#1c1917">• 위험 감수 (사업)</text>
  </g>
  <!-- Center: Bank -->
  <g>
    <rect x="270" y="220" width="180" height="100" rx="8" fill="#fff" stroke="#1c1917" stroke-width="2"/>
    <text x="360" y="245" text-anchor="middle" font-family="Noto Sans KR,sans-serif" font-size="14" font-weight="700" fill="#1c1917">🏦 은행</text>
    <text x="360" y="268" text-anchor="middle" font-size="11" fill="#57534e">만기 변환 (단기 → 장기)</text>
    <text x="360" y="286" text-anchor="middle" font-size="11" fill="#57534e">위험 풀링 (분산)</text>
    <text x="360" y="306" text-anchor="middle" font-size="11" font-weight="700" fill="#3a7d44">스프레드 = 수익</text>
  </g>
  <!-- Arrows -->
  <line x1="130" y1="180" x2="280" y2="240" stroke="#3a7d44" stroke-width="2" marker-end="url(#arBL)"/>
  <text x="170" y="215" font-size="11" fill="#3a7d44">예금 (3%)</text>
  <line x1="290" y1="245" x2="140" y2="185" stroke="#3a7d44" stroke-width="2" stroke-dasharray="3,2" marker-end="url(#arBL)"/>
  <text x="170" y="245" font-size="11" fill="#3a7d44">이자 (낮음)</text>
  <line x1="450" y1="240" x2="595" y2="185" stroke="#c4724e" stroke-width="2" marker-end="url(#arBR)"/>
  <text x="510" y="215" font-size="11" fill="#c4724e">대출 (7%)</text>
  <line x1="585" y1="180" x2="445" y2="245" stroke="#c4724e" stroke-width="2" stroke-dasharray="3,2" marker-end="url(#arBR)"/>
  <text x="510" y="250" font-size="11" fill="#c4724e">이자 (높음)</text>
  <!-- Spread -->
  <text x="360" y="345" text-anchor="middle" font-size="12" font-weight="700" fill="#3a7d44">은행 수익 = 7% − 3% = 4% (NIM, Net Interest Margin)</text>
</svg>

은행이 하는 일은 본질적으로 **두 가지 미스매치를 해결**하는 것:

#### 미스매치 ①: 만기 (Maturity)
- **예금자**: 단기 (언제든 찾고 싶음, "수시입출")
- **차입자**: 장기 (집을 사려고 30년 대출)
- **은행의 마법**: 단기 예금을 모아서 장기 대출로 변환 ← **만기 변환(maturity transformation)**

#### 미스매치 ②: 위험 (Risk)
- **예금자**: 위험 회피 (돈 없어지면 안 됨)
- **차입자**: 위험 감수 (사업이 망할 수도)
- **은행의 마법**: 수천 명의 차입자에 분산 대출 → 일부가 망해도 나머지로 메움 ← **위험 풀링(risk pooling)**

> ⚠️ **이게 깨지면 뱅크런(bank run)이 발생한다.**
> 2008 글로벌 금융위기, 2023 SVB(실리콘밸리은행) 사태 모두 이 메커니즘이 무너진 것. SVB는 단기 예금을 받아 장기 채권에 투자했는데, 금리 인상으로 채권 가치가 폭락하면서 예금자들이 한꺼번에 인출 요구 → 며칠 만에 망함.

#### 채권 시장 = 은행을 건너뛴 직접 대출

은행을 끼지 않는 또 다른 방법: **채권 시장(bond market)**.
- 기업이 직접 채권 발행 (예: 삼성전자 3년 회사채 4.5%)
- 투자자가 직접 구매
- 중간에 은행 없음 (대신 증권사가 중개)

이게 발달할수록 은행의 역할이 줄어든다. 그래서 미국은 채권 시장 비중이 크고, 한국은 은행 비중이 크다.

> ✅ **여기까지 따라왔으면**: "왜 은행이 존재하는지"의 경제학적 답을 얻은 거다. 단순히 "예금받고 대출해주는 곳"이 아니라 **두 미스매치를 푸는 알고리즘**이다.

---

## 🔴 [고급] — 영문 용어와 책의 한계

### 💭 시작하기 전에 — 왜 영문 용어를 알아야 하나?

금융 AI 분야는 **영문 자료가 압도적으로 많다**. 논문, 블로그, sklearn 문서, Kaggle 노트북 모두 영어다. 또 "한국어 금융"과 "영어 finance"는 미묘하게 다른 범위를 가진다. 이 절은 그 차이를 정확히 잡는다.

### 1. Finance, Banking, FinTech — 같은 듯 다른 단어들

<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">금융 관련 영문 용어 — 같은 듯 다른 범위</text>
  <!-- Outer circle: Finance -->
  <circle cx="360" cy="180" r="130" fill="none" stroke="#c4724e" stroke-width="2" stroke-dasharray="4,3"/>
  <text x="360" y="65" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">Finance (가장 넓음)</text>
  <text x="360" y="305" text-anchor="middle" font-size="10" fill="#c4724e">자금조달 + 투자 + 위험관리 전반</text>
  <!-- Inner: Banking -->
  <ellipse cx="290" cy="180" rx="55" ry="65" fill="#fdf0ea" stroke="#7a6a9a" stroke-width="1.5"/>
  <text x="290" y="170" text-anchor="middle" font-size="12" font-weight="700" fill="#7a6a9a">Banking</text>
  <text x="290" y="188" text-anchor="middle" font-size="9" fill="#7a6a9a">예금기관</text>
  <text x="290" y="202" text-anchor="middle" font-size="9" fill="#7a6a9a">중심</text>
  <!-- Inner: FinEcon -->
  <ellipse cx="430" cy="160" rx="50" ry="50" fill="#fdf0ea" stroke="#5a7a96" stroke-width="1.5"/>
  <text x="430" y="155" text-anchor="middle" font-size="11" font-weight="700" fill="#5a7a96">Financial</text>
  <text x="430" y="170" text-anchor="middle" font-size="11" font-weight="700" fill="#5a7a96">Economics</text>
  <text x="430" y="186" text-anchor="middle" font-size="9" fill="#5a7a96">학문</text>
  <!-- Inner: QuantFin -->
  <ellipse cx="430" cy="220" rx="45" ry="40" fill="#fdf0ea" stroke="#3a7d44" stroke-width="1.5"/>
  <text x="430" y="218" text-anchor="middle" font-size="11" font-weight="700" fill="#3a7d44">Quant Fin</text>
  <text x="430" y="234" text-anchor="middle" font-size="9" fill="#3a7d44">수학+컴퓨터</text>
  <!-- FinTech outside -->
  <rect x="540" y="155" width="120" height="50" rx="6" fill="#edf7ef" stroke="#3a7d44" stroke-width="1.5"/>
  <text x="600" y="178" text-anchor="middle" font-size="12" font-weight="700" fill="#3a7d44">FinTech</text>
  <text x="600" y="194" text-anchor="middle" font-size="9" fill="#3a7d44">기술+금융 (이 책)</text>
  <line x1="540" y1="180" x2="487" y2="200" stroke="#3a7d44" stroke-width="1" stroke-dasharray="2,2"/>
</svg>

| 용어 | 범위 | 학문/실무 | 한국어 대응 |
|------|------|-----------|------------|
| **Finance** | 가장 넓음. 자금조달·투자 전체 | 학문 + 실무 | 금융 (전체) |
| **Banking** | 예금기관 중심 | 실무 | 은행업 |
| **Financial Economics** | 자산 가격결정의 미시이론 | 학문 | 재무경제학 |
| **Quantitative Finance** | 수학적 모델링 (파생/리스크) | 실무 + 학문 | 계량금융 |
| **FinTech** | 기술 기반 금융 서비스 | 실무 | 핀테크 |
| **Corporate Finance** | 기업 자금조달·투자결정 | 학문 + 실무 | 기업재무 |
| **Investment** | 포트폴리오 운용 | 실무 | 투자론 |

> ⚠️ **책이 "금융 AI"라고 부를 때는 사실 FinTech + Quantitative Finance에 가깝다.**
> 전통적 finance 교과서(예: Bodie-Kane-Marcus *Investments*)와는 다른 결.

#### 어디서 영어 자료를 찾을 것인가?

| 분야 | 1차 자료 영문 | 한국어 자료 |
|------|--------------|-----------|
| 학술 논문 | SSRN, NBER, arXiv (q-fin) | KCI |
| 실무 보고서 | BIS, IMF, McKinsey, Deloitte | 한국은행, 금감원 |
| 코드 | GitHub, Kaggle | (거의 없음) |
| 교과서 | Bodie-Kane-Marcus, Hull | 미슈킨 한국어판 |

> 💬 **금융 AI를 한국어로만 공부하기 힘든 이유**: 영문 자료의 1/100도 안 된다. 영어 안 거치면 결국 닫힌 세계에 머문다.

### 2. 책의 한계 — §1.1을 다시 읽으며 짚는 6가지

저자는 머리말에서 "다루는 주제가 많아 다소 얕게 느껴질 수 있다"고 인정했다. §1.1만 봐도 다음 6가지가 빠져 있다. (비판이 아니라 "이 책 이후에 보충할 것"의 리스트로 읽자.)

#### 한계 ①: 돈의 4가지 기능을 안 다룬다
책은 "돈 = 측정자" 정도로 끝낸다. 그런데 화폐의 기능은 **4가지**다:

| 기능 | 영어 | 예시 |
|------|------|------|
| 교환 매개 | Medium of exchange | 카드 결제 |
| 가치 척도 | Unit of account | 가격표 (1만원/kg) |
| 가치 저장 | Store of value | 예금, 금 |
| 이연 지급 | Standard of deferred payment | 대출, 할부 |

이 4가지를 만족하는 게 "돈"이다. **CBDC, 비트코인, 스테이블코인이 돈이냐**의 논쟁은 이 4가지 중 몇 개를 만족하느냐의 문제다.

#### 한계 ②: 신용화폐(credit money)와 법정화폐(fiat money) 구분 없음
현대 통화의 95%는 **신용화폐**다 (은행이 대출 만들 때 같이 생성). 5%만 한국은행이 찍은 **법정화폐**(현금).
이 사실이 빠지면 **"중앙은행 vs. 시중은행"** 의 관계가 안 보인다.

#### 한계 ③: 금융 ≠ 경제 라는 점 미명시
금융은 실물경제의 **거울**이지, 실물 그 자체는 아니다. 주가가 올랐다고 GDP가 올라가지는 않는다.
이 구분이 없으면 "금융 위기 ≠ 경제 위기"가 안 보인다 (예: 2020년 코로나 — 실물 위기지만 주식은 폭등).

#### 한계 ④: 정보 비대칭(asymmetric information) 미언급
Akerlof 1970 *The Market for Lemons* — 금융 시장의 핵심 마찰. **이게 안 다뤄지면 금융 AI의 존재 이유 자체가 흐려진다**. (아래 §3에서 자세히.)

#### 한계 ⑤: 금융 위기의 패턴 미언급
Reinhart-Rogoff 2009 *This Time is Different* — 800년치 금융 위기 데이터. 패턴이 반복된다.
이 책은 위기를 다루지 않지만, **AI가 새로운 위기를 만들 수 있나?** 라는 질문은 늘 따라온다.

#### 한계 ⑥: "데이터 = 금융이라는 주장"의 근거 부족
"디지털 거래 99%"는 어디서 온 수치인가? 책에 출처가 없다.
실제 1차 자료: **BIS Annual Economic Report 2023**, Chapter III. (책에 인용 안 됨.)

### 3. 정보 비대칭 — AI가 끼어드는 진짜 이유

이게 빠지면 금융 AI의 **존재 이유**를 놓친다. 천천히 풀자.

#### 3.1 Lemon Problem — 노벨상 받은 한 장의 그림

George Akerlof가 1970년에 발표한 *The Market for Lemons*. 2001년 노벨 경제학상.

**상황 설정**: 중고차 시장.
- 차에는 **좋은 차(peach)** 와 **고장차(lemon)** 가 있다.
- **판매자**는 자기 차의 상태를 안다.
- **구매자**는 모른다.

<svg viewBox="0 0 720 340" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">Lemon Problem — 정보 비대칭이 시장을 죽이는 과정</text>
  <!-- Step 1 -->
  <g>
    <rect x="20" y="60" width="160" height="240" rx="8" fill="#fff" stroke="#d6d3d1"/>
    <text x="100" y="85" text-anchor="middle" font-size="13" font-weight="700" fill="#1c1917">Step 1</text>
    <text x="100" y="105" text-anchor="middle" font-size="11" fill="#57534e">초기 상태</text>
    <text x="100" y="140" text-anchor="middle" font-size="24">🚗</text>
    <text x="100" y="170" text-anchor="middle" font-size="11" fill="#3a7d44">좋은차 50%: 1000만</text>
    <text x="100" y="195" text-anchor="middle" font-size="24">🚙</text>
    <text x="100" y="225" text-anchor="middle" font-size="11" fill="#c4724e">고장차 50%: 200만</text>
    <text x="100" y="265" text-anchor="middle" font-size="11" font-weight="700" fill="#1c1917">평균: 600만</text>
  </g>
  <!-- Step 2 -->
  <g>
    <rect x="200" y="60" width="160" height="240" rx="8" fill="#fff" stroke="#d6d3d1"/>
    <text x="280" y="85" text-anchor="middle" font-size="13" font-weight="700" fill="#1c1917">Step 2</text>
    <text x="280" y="105" text-anchor="middle" font-size="11" fill="#57534e">구매자 가격 제시</text>
    <text x="280" y="140" text-anchor="middle" font-size="11" fill="#1c1917">"평균값 600만 줄게"</text>
    <text x="280" y="175" text-anchor="middle" font-size="11" fill="#3a7d44">좋은차 주인: "안 팔아"</text>
    <text x="280" y="195" text-anchor="middle" font-size="10" fill="#3a7d44">(1000만짜리를 600만에?)</text>
    <text x="280" y="230" text-anchor="middle" font-size="11" fill="#c4724e">고장차 주인: "팔게!"</text>
    <text x="280" y="250" text-anchor="middle" font-size="10" fill="#c4724e">(200만짜리를 600만에!)</text>
  </g>
  <!-- Step 3 -->
  <g>
    <rect x="380" y="60" width="160" height="240" rx="8" fill="#fff" stroke="#d6d3d1"/>
    <text x="460" y="85" text-anchor="middle" font-size="13" font-weight="700" fill="#1c1917">Step 3</text>
    <text x="460" y="105" text-anchor="middle" font-size="11" fill="#57534e">시장에 남은 차</text>
    <text x="460" y="155" text-anchor="middle" font-size="36">🚙</text>
    <text x="460" y="195" text-anchor="middle" font-size="11" fill="#c4724e">고장차만 남음</text>
    <text x="460" y="215" text-anchor="middle" font-size="11" fill="#c4724e">(좋은차 빠져나감)</text>
    <text x="460" y="255" text-anchor="middle" font-size="11" font-weight="700" fill="#c4724e">→ 구매자도 알게 됨</text>
  </g>
  <!-- Step 4 -->
  <g>
    <rect x="560" y="60" width="140" height="240" rx="8" fill="#fdf0ea" stroke="#c4724e" stroke-width="2"/>
    <text x="630" y="85" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">Step 4</text>
    <text x="630" y="105" text-anchor="middle" font-size="11" fill="#c4724e">시장 붕괴</text>
    <text x="630" y="140" text-anchor="middle" font-size="32">💀</text>
    <text x="630" y="180" text-anchor="middle" font-size="11" fill="#c4724e">아무도 안 산다</text>
    <text x="630" y="200" text-anchor="middle" font-size="11" fill="#c4724e">아무도 못 판다</text>
    <text x="630" y="245" text-anchor="middle" font-size="11" font-weight="700" fill="#c4724e">시장 실패</text>
  </g>
</svg>

#### 3.2 금융 시장에 적용하면

이 lemon problem이 **금융의 거의 모든 시장**에 적용된다:

| 시장 | 정보 우위자 | 정보 열위자 | AI가 푸는 방식 |
|------|------------|------------|---------------|
| **대출 시장** | 차주 (자기 상환능력) | 은행 | **신용평가 AI** (Ch3) |
| **보험 시장** | 가입자 (자기 건강·운전습관) | 보험사 | **언더라이팅 AI** |
| **카드 결제** | 사기범 (거래 의도) | 카드사 | **사기탐지 AI** (Ch4) |
| **주식 시장** | 내부자/HFT | 일반투자자 | **퀀트 AI** (Ch2) |
| **챗봇 상담** | 고객 (자기 의도) | 상담사 | **LLM 챗봇** (Ch6) |

> 💡 **즉, 금융 AI = 정보 비대칭을 데이터로 줄이는 도구.**
> 이 한 줄이 이 책 전체를 관통하는 동력이다. 책이 명시적으로 안 적었을 뿐.

#### 3.3 두 가지 정보 비대칭 — 거래 전 vs. 거래 후

학술적으로는 두 종류로 나뉜다. 이 구분이 금융 AI 응용을 분류하는 데 도움이 된다:

| 종류 | 시점 | 영어 | 예시 | AI 대응 |
|------|------|------|------|--------|
| **역선택** | 거래 **전** | Adverse Selection | "이 차주가 부실인가?" | 신용평가 |
| **도덕적 해이** | 거래 **후** | Moral Hazard | "대출 받고 갚을 의지가 사라짐" | 사후 모니터링 |

> ✅ **여기까지 따라왔으면**: 이 책의 모든 챕터가 정보 비대칭의 어느 부분을 푸느냐의 분류라는 게 보일 것이다.

---

## 🟣 [전공자] — 1차 자료와 수식

### 💭 시작하기 전에

이 절은 **원전(原典)** 을 직접 인용한다. 모든 인용은 출처 확인 가능한 학술 자료다. 수식이 나오지만 의미는 [중급]에서 다 설명했으니, 여기서는 **원래 어떻게 정의됐는지** 본다.

### 1. Modigliani-Miller (1958) — 금융이 학문이 된 출발점

#### 1.1 정리의 의미
자본 구조(부채 vs. 자본 비율)가 기업 가치에 영향을 **주지 않는다**는 충격적인 결과. 1990년 노벨상.

#### 1.2 수식

**MM Proposition I (가정: 세금·파산비용·정보비대칭 없음)**:

$$ V_L = V_U $$

- $V_L$: Levered firm value (부채가 있는 기업의 가치)
- $V_U$: Unlevered firm value (부채가 없는 기업의 가치)

**MM Proposition II (자기자본비용)**:

$$ r_E = r_0 + (r_0 - r_D) \cdot \frac{D}{E} $$

- $r_E$: 자기자본비용
- $r_0$: 자본 무관 비용 (자본구조와 무관한 가중평균)
- $r_D$: 부채비용
- $D/E$: 부채/자본 비율

#### 1.3 의미
이 정리는 **"현실에서는 깨진다"**는 점을 알려주는 데 더 큰 의미가 있다. 깨지는 이유:
- 세금 (tax shield): 부채 이자는 세금 공제 → 부채가 가치 증가
- 파산비용: 부채가 많으면 파산 확률 증가
- 정보 비대칭: 부채 발행 시그널 효과

이 모든 마찰을 연구하는 게 현대 corporate finance다.

> 📄 **원전**: Modigliani, F., & Miller, M. H. (1958). The cost of capital, corporation finance and the theory of investment. *American Economic Review*, 48(3), 261–297.

### 2. Merton-Bodie 기능적 관점 (1995, 2005)

#### 2.1 핵심 주장

> "*Institutional structure changes; functions do not.*"
> — Merton (1995)

기관(은행·증권사·보험사)은 시대마다 모습이 바뀌지만, **금융이 수행하는 6가지 기능은 변하지 않는다**.

#### 2.2 6 functions의 학술적 정의

논문 원문 그대로:

1. *Providing ways of clearing and settling payments* (결제)
2. *Providing a mechanism for the pooling of resources* (풀링)
3. *Providing ways to transfer economic resources through time and across distances* (시간/공간 이동)
4. *Providing ways to manage risk* (위험 관리)
5. *Providing price information that helps coordinate decentralized decision-making* (정보 제공)
6. *Providing ways to deal with incentive problems* (인센티브)

#### 2.3 AI 시대에 왜 중요한가?

AI/FinTech가 기관을 바꾼다 해도, 이 6가지 기능은 그대로다.
- Toss가 은행 라이선스 없이도 결제(기능①)와 자산이동(기능③)을 한다.
- 카카오뱅크가 전통 은행 점포 없이 예금/대출을 한다.

**기능을 보면 미래가 보인다**. 이 책의 6개 장도 사실상 이 6 functions 매핑이다.

> 📄 **원전**: Merton, R. C. (1995). A functional perspective of financial intermediation. *Financial Management*, 24(2), 23–41.
> 📄 Merton, R. C., & Bodie, Z. (2005). The design of financial systems: Towards a synthesis of function and structure. *Journal of Investment Management*, 3(1), 1–23.

### 3. Shiller — Finance의 사회적 정당성

#### 3.1 핵심 주장
Robert Shiller(2013 노벨상)는 *Finance and the Good Society* (2012)에서 금융을 **"문명을 가능케 한 사회 기술(social technology)"** 로 정의한다.

> "*Finance is not merely the manipulation of money or the management of risk. It is the stewardship of society's assets.*"
> — Shiller (2012), p. 7

이 관점이 책 §1.1의 "금융은 자원을 효율적으로 배분하고, 위험을 관리하며, 경제적 가치를 창출"이라는 문장의 학술적 출처다.

#### 3.2 Shiller의 5가지 금융 직무 분류 (책 ch.1-19)
Merton-Bodie가 기능을 분류했다면, Shiller는 **직업**을 분류했다:
- CEOs, Investment Managers, Bankers
- Investment Bankers, Mortgage Lenders
- Traders, Market Makers, Insurers
- Market Designers, Financial Engineers
- Derivatives Providers, Lawyers, Financial Advisors

이 분류는 "**금융이 일자리를 어떻게 만드는가**"를 보여준다. 금융 AI가 어느 직무를 자동화할지 예측할 때 유용.

> 📄 **원전**: Shiller, R. J. (2012). *Finance and the Good Society*. Princeton University Press.

### 4. 데이터 = 금융의 미래 (BIS, 2023)

#### 4.1 BIS의 정의
국제결제은행(Bank for International Settlements)이 2023 Annual Economic Report에서 미래 통화 시스템을 정의:

> "*A future monetary system in which tokenisation plays a key role. ... Programmable platforms hosting tokenised central bank money, commercial bank money and other tokenised claims.*"
> — BIS (2023), Chapter III

이게 책의 "데이터 중심 금융"의 실체다 — **모든 금융 자산이 토큰(데이터 객체)이 되는 미래**.

#### 4.2 정량 근거
- 글로벌 결제 시장 $2.2T (McKinsey 2023)
- 비현금 거래 비중 96.5% (BIS 2022)
- 데이터 분석 부문 연 6.2% 성장

> 📄 BIS. (2023). *Annual Economic Report 2023*, Chapter III: *Blueprint for the future monetary system*.
> 📄 McKinsey & Company. (2023). *On the cusp of the next payments era: Future opportunities for banks*.

### 5. 정보 비대칭 — 2001년 노벨상 3인방

#### 5.1 Akerlof (1970) — Lemon Problem 수식

**가정**:
- 시장에 좋은 차 $q$ 비율, 나쁜 차 $(1-q)$ 비율
- 좋은 차 가치 $V_g$, 나쁜 차 가치 $V_b$ ($V_g > V_b$)
- 구매자는 평균만 알고, 판매자만 자기 차를 안다

**구매자의 최대 지불의사**:

$$ P_{buyer} = q V_g + (1-q) V_b $$

**좋은 차 판매자의 행동**: 만약 $P_{buyer} < V_g$ 이면 시장에서 이탈.
$$ q V_g + (1-q) V_b < V_g \iff (1-q)(V_b - V_g) < 0 $$
좋은 차가 비쌀수록 ($V_g$ 클수록) 이탈 압력 증가.

**균형**: 좋은 차가 점진적으로 이탈 → $q \to 0$ → 시장 청산 가격이 $V_b$로 수렴 → **시장 붕괴**.

#### 5.2 신용평가 AI는 이걸 어떻게 푸나?

대출 시장 적용:
- 좋은 차주 → 상환 가능성 높음
- 나쁜 차주 → 상환 가능성 낮음
- 은행이 구분 못 하면 → 좋은 차주 이탈 → 시장 붕괴

**AI의 역할**: 차주의 데이터(거래내역, 소득, 행동)로 $V_g$ vs $V_b$를 구분 → **정보 비대칭 해소**.

이게 Ch3에서 다룰 신용평가 모델의 학술적 정당성이다.

#### 5.3 Stiglitz-Weiss (1981) — Credit Rationing

은행이 금리를 무한정 올려서 시장 청산을 하지 **않는** 이유:

> 금리를 올리면 → 위험한 차주만 남는다 (역선택) → 부도율 ↑ → 은행 손실 ↑

그래서 은행은 **금리 대신 양적 제한**(credit rationing)을 한다.

<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">Stiglitz-Weiss: 은행 기대수익은 금리에 단조 증가하지 않는다</text>
  <!-- Axes -->
  <line x1="80" y1="240" x2="660" y2="240" stroke="#1c1917" stroke-width="1.5"/>
  <line x1="80" y1="240" x2="80" y2="60" stroke="#1c1917" stroke-width="1.5"/>
  <text x="660" y="260" text-anchor="end" font-size="11" fill="#1c1917">대출금리 r</text>
  <text x="85" y="50" text-anchor="start" font-size="11" fill="#1c1917">은행 기대수익</text>
  <!-- Curve: increasing then decreasing -->
  <path d="M 80 230 Q 200 180, 320 100 Q 440 80, 500 130 Q 580 200, 660 230" fill="none" stroke="#c4724e" stroke-width="2.5"/>
  <!-- Optimal r -->
  <line x1="380" y1="240" x2="380" y2="85" stroke="#3a7d44" stroke-width="1" stroke-dasharray="3,2"/>
  <text x="380" y="260" text-anchor="middle" font-size="11" fill="#3a7d44">r*</text>
  <text x="380" y="70" text-anchor="middle" font-size="11" font-weight="700" fill="#3a7d44">최적 금리</text>
  <!-- Annotations -->
  <text x="200" y="160" text-anchor="middle" font-size="11" fill="#57534e">금리 ↑ → 수익 ↑</text>
  <text x="200" y="175" text-anchor="middle" font-size="10" fill="#57534e">(정상 영역)</text>
  <text x="540" y="160" text-anchor="middle" font-size="11" fill="#c4724e">금리 ↑ → 수익 ↓</text>
  <text x="540" y="175" text-anchor="middle" font-size="10" fill="#c4724e">(역선택 발생)</text>
</svg>

은행은 $r^*$ 에서 멈추고, 그 가격에 사고 싶은 모든 차주에게 대출해주지 **않는다**. → 신용 배급.

> 📄 **원전**:
> - Akerlof, G. A. (1970). The market for "lemons": Quality uncertainty and the market mechanism. *Quarterly Journal of Economics*, 84(3), 488–500.
> - Spence, M. (1973). Job market signaling. *QJE*, 87(3), 355–374.
> - Stiglitz, J. E., & Weiss, A. (1981). Credit rationing in markets with imperfect information. *American Economic Review*, 71(3), 393–410.

### 6. 화폐의 본질 — 신용화폐와 통화 창출

#### 6.1 Bank of England의 충격적 공식 인정 (2014)

> "*Whenever a bank makes a loan, it simultaneously creates a matching deposit in the borrower's bank account, thereby creating new money.*"
> — McLeay, Radia, & Thomas (2014), Bank of England Quarterly Bulletin Q1

#### 6.2 의미

은행 대출 한 건은 **새로운 통화 창출**이다. 통화량의 95%가 이렇게 만들어진다.

```
대출 전:
  A의 예금: 100만
  
A가 50만 대출받음:
  A의 예금: 100만 (변화 없음)
  A의 대출: 50만 (새 부채)
  A의 예금: +50만 (대출금이 예금으로 들어옴)
  
은행 장부:
  자산 (loan): +50만
  부채 (deposit): +50만
  → 차감하면 변동 없음. 그런데 통화량은 +50만 증가.
```

#### 6.3 이게 §1.1의 "데이터 중심 금융"의 진짜 의미

대출 한 건 = SQL `INSERT` 한 줄. 통화가 데이터베이스의 행이라면, 통화 정책도 데이터베이스 트랜잭션이다.

> 📄 McLeay, M., Radia, A., & Thomas, R. (2014). Money creation in the modern economy. *Bank of England Quarterly Bulletin*, 54(1), 14–27.

---

### 🟣 [전공자 심화] — Akerlof(1970)·MM(1958)의 한계와 후속 연구

> 💭 위에서 다룬 Akerlof Lemon 모형과 Modigliani-Miller 정리는 **금융학의 출발점**이지만, 둘 다 **현실에서는 깨지는 가정** 위에서 작동한다. 그 균열을 메운 후속 연구들이 현대 정보경제학·자본구조론을 만들었다.

#### 1. Akerlof(1970) Lemon Problem — 원논문의 한계

**원논문의 4가지 가정 한계**:
1. **분리 균형 부재**: Akerlof 모형은 "역선택 → 시장 붕괴"라는 풀링(pooling) 결과만 제시. 좋은 차/나쁜 차를 시장이 어떻게 **구분(separate)** 할 수 있는지는 미해결.
2. **시그널링 메커니즘 부재**: 정보를 가진 쪽(seller)이 정보를 전달할 수단을 모형에 넣지 않음.
3. **신용 시장 외 일반화 미흡**: 모형은 중고차 시장만 다루고, 노동·신용 시장으로의 확장은 후속 연구가 담당.
4. **단일 기간 모형**: 평판(reputation)·반복 거래의 동학을 무시.

**후속 연구 ①: Spence(1973) — Job Market Signaling**
- 정보를 가진 쪽이 **비용 있는 신호(signal)** 를 보내 분리 균형을 달성하는 메커니즘 제시.
- 교육이 대표적 신호: 능력 높은 사람은 교육 비용이 상대적으로 낮으므로 학위가 능력 신호로 작동.
- 📄 Spence, M. (1973). Job market signaling. *Quarterly Journal of Economics*, 87(3), 355–374. [DOI: 10.2307/1882010](https://doi.org/10.2307/1882010) · [PDF (SFU)](https://www.sfu.ca/~allen/Spence.pdf)
- **2001년 노벨상 공동 수상** (Akerlof·Spence·Stiglitz).

**후속 연구 ②: Stiglitz-Weiss(1981) — Credit Rationing**
- 신용 시장의 역선택 문제를 정식화. 은행이 금리를 올리면 **위험한 차주만 남는** 역선택 + **위험한 프로젝트를 선택하는** 도덕적 해이 두 가지 동시 발생.
- 결론: 은행은 금리 인상 대신 **양적 신용 배급(credit rationing)** 을 선택. 시장 청산이 일어나지 않는 균형 존재.
- 📄 Stiglitz, J. E., & Weiss, A. (1981). Credit rationing in markets with imperfect information. *American Economic Review*, 71(3), 393–410. [JSTOR](https://www.jstor.org/stable/1802787) · [PDF (UCSD)](https://pages.ucsd.edu/~aronatas/project/academic/Stiglitz%20credit.pdf)

#### 2. Modigliani-Miller(1958) — 원논문의 한계

**원논문의 5가지 비현실적 가정**:
1. **세금 없음**: 부채 이자 세금 공제(tax shield) 무시.
2. **파산 비용 없음**: 부채 과다 → 파산 확률↑ → 직접/간접 파산비용 발생.
3. **거래비용·정보비대칭 없음**: 차익거래로 $V_L = V_U$ 강제 가능 가정.
4. **균질한 위험 클래스**: 동일 위험 기업이 존재한다는 가정.
5. **개인-기업 차입 동일성**: 개인이 기업과 동일 금리로 차입 가능 가정.

**후속 연구 ①: Miller(1977) — Debt and Taxes**
- 본인의 1958년 정리를 본인이 보완: **법인세만이 아니라 개인 소득세도 고려**해야 한다고 주장.
- 채권자(이자 소득세)와 주주(자본이득세)의 세율 차이까지 넣으면 부채의 세제 혜택이 **상당 부분 상쇄**됨.
- 결론: "최적 부채비율은 산업 수준에서 결정되며, 개별 기업의 부채비율은 무관(irrelevant)" — 1958년 결론을 세금 도입 후에도 다른 경로로 재확인.
- 📄 Miller, M. H. (1977). Debt and taxes. *Journal of Finance*, 32(2), 261–275. [DOI: 10.1111/j.1540-6261.1977.tb03267.x](https://doi.org/10.1111/j.1540-6261.1977.tb03267.x) · [JSTOR](https://www.jstor.org/stable/2326758) (AFA Presidential Address, 1976.9.17)

**후속 연구 ②: Myers-Majluf(1984) — Pecking Order**
- 정보 비대칭(경영진 > 외부 투자자) 하에서 자본조달 순서: **내부자금 > 부채 > 신주 발행** 순.
- 신주 발행은 "주가 고평가 신호"로 해석되어 발행 즉시 주가 하락 → 경영진은 가장 마지막에 선택.
- 책 §1.1이 "정보 비대칭"을 언급조차 않은 것에 대한 직접 보완.
- 📄 Myers, S. C., & Majluf, N. S. (1984). Corporate financing and investment decisions when firms have information that investors do not have. *Journal of Financial Economics*, 13(2), 187–221. [DOI: 10.1016/0304-405X(84)90023-0](https://doi.org/10.1016/0304-405X(84)90023-0)

#### 3. 비판 문헌·통합 리뷰

- **Frank, M. Z., & Goyal, V. K. (2009)**. Capital structure decisions: Which factors are reliably important? *Financial Management*, 38(1), 1–37. — Pecking order vs. Trade-off vs. Market timing 실증 비교.
- **Leary, M. T., & Roberts, M. R. (2010)**. The pecking order, debt capacity, and information asymmetry. *Journal of Financial Economics*, 95(3), 332–355. — Pecking order의 실증 한계 정량화. [PDF (Wharton)](https://finance.wharton.upenn.edu/~mrrobert/resources/Publications/PeckingOrderJFE2010.pdf)

#### 4. 후속 연구 동향 (2020~)

- **머신러닝 신용 위험 (2020~)**: Bracke, P., Datta, A., Jung, C., & Sen, S. (2019). Machine learning explainability in finance: An application to default risk analysis. *Bank of England Staff Working Paper* No. 816. → Stiglitz-Weiss credit rationing의 ML 시대 적용.
- **대안 데이터로 정보 비대칭 축소**: Berg, T., Burg, V., Gombović, A., & Puri, M. (2020). On the rise of FinTechs: Credit scoring using digital footprints. *Review of Financial Studies*, 33(7), 2845–2897. [DOI: 10.1093/rfs/hhz099](https://doi.org/10.1093/rfs/hhz099) — 디지털 발자취로 차주 식별 가능성 향상 → 역선택 문제 일부 해소.
- **자본구조 ML 예측**: Amini, S., et al. (2022). Machine learning prediction of corporate capital structure. *Journal of Corporate Finance*, 77, 102282. — MM 가정 위반 요인들을 ML로 정량화.

#### 5. 한국 적용 시 주의점

1. **재벌 구조의 정보 비대칭 이중성**: 한국 재벌은 내부자본시장(internal capital market)을 통해 외부 정보 비대칭을 상쇄하지만, **외부 소액주주 대비 정보 비대칭은 오히려 심함**. Bae, K.-H., et al. (2002, *JoF*) "Tunneling or value added?" 참고.
2. **회사채 시장 미발달**: 한국은 회사채 시장이 미국 대비 작아 Myers-Majluf의 "부채 > 신주" 위계가 **은행 대출 > 회사채 > 신주**로 한 단계 더 비틀린다.
3. **신용평가사 과점**: KIS·NICE·KR 3사 과점 구조 → 신용등급 정보의 표준화는 강하나 **혁신적 신호(대안 데이터)** 채택은 느림.
4. **개인정보보호법 + 신용정보법**: 마이데이터(2022) 이후 차주 데이터 활용은 가능해졌으나, **EU GDPR보다 엄격한 제약**(가명정보 결합 절차)이 ML 모델 학습 데이터 풀을 좁힘.
5. **금산분리 규제**: 비금융 기업이 보유한 대안 데이터(쿠팡·네이버 거래내역)를 금융사가 직접 활용하기 어려움 → Berg et al.(2020) 식 디지털 발자취 신용평가의 적용 범위가 미국·중국 대비 제한적.

---

## 📚 책에는 없지만 알면 좋은 것

### 🔍 보충 1 — 화폐의 4가지 기능 (Jevons, 1875)

책은 돈의 등장만 다루고 끝난다. 화폐가 무엇을 하는지는 4가지로 나뉜다. 19세기 경제학자 William Stanley Jevons가 정리:

| 기능 | 영어 | 예시 | AI 관련성 |
|------|------|------|-----------|
| 교환 매개 | Medium of exchange | 카드 결제 | 결제 사기 탐지 |
| 가치 척도 | Unit of account | 가격표 (1만원/kg) | 가격 책정 모델 |
| 가치 저장 | Store of value | 예금·금·부동산 | 자산 배분 |
| 이연 지급 | Standard of deferred payment | 대출·할부 | 신용 평가 |

#### CBDC vs. 비트코인 vs. 스테이블코인 vs. 카뱅 예금 — 4기능 비교

| | 교환 매개 | 가치 척도 | 가치 저장 | 이연 지급 |
|---|---|---|---|---|
| **현금 (한은)** | ✅ | ✅ | ✅ | ✅ |
| **카뱅 예금** | ✅ | ✅ | ✅ | ✅ |
| **CBDC** | ✅ | ✅ | ✅ | ✅ |
| **스테이블코인** | ✅ | ✅ | ✅ (1:1 페그) | △ |
| **비트코인** | △ (변동성) | ❌ (가격이 변함) | △ (장기) | ❌ |
| **카카오 콩** | ✅ (제한된 곳) | △ | ❌ | ❌ |

> 💬 비트코인이 "디지털 금"이라 불리는 이유: 4기능 중 **가치 저장**만 일부 만족. 진짜 화폐는 못 됐다.

### 🔍 보충 2 — Bank of England가 인정한 "은행이 돈을 만든다" (2014)

[전공자] §6에서 다룬 내용을 [초보자도 이해할 수 있게 다시] 풀어보자.

#### 직관적 설명: "대출이 곧 돈"

기존 신화 (잘못된 이해):
- "은행은 예금을 받아서 그 돈을 대출해준다"
- "예금 100만이면 대출 100만"

실제 (Bank of England 인정):
- "은행은 대출할 때 새 예금을 만든다"
- "예금 1000만이면 대출 1억 가능 (지급준비율에 따라)"

#### 그림으로

```
[잘못된 이해]
예금자 ─[100만]─▶ 은행 ─[100만]─▶ 차입자

[실제]
                  ┌─[+50만 예금 생성]─▶ 차입자 계좌
은행 (장부에)
                  └─[+50만 대출 기록]─▶ 차입자 부채
                  
→ 통화량 +50만 증가 (예금이 새로 생김)
```

#### 함의

1. **인플레이션이 왜 일어나는지** 설명됨: 대출이 많으면 통화량 증가 → 물가 상승
2. **중앙은행이 금리 인상으로 대출 억제** → 통화 창출 억제 → 인플레이션 통제
3. **2020 코로나 양적완화** → 대출 폭증 → 자산 가격 폭등 (주식·부동산)

> 📄 McLeay, Radia, & Thomas (2014). Money creation in the modern economy. *Bank of England Quarterly Bulletin* Q1.

### 🔍 보충 3 — 금융 위기는 반복된다 (Reinhart-Rogoff, 2009)

#### 800년치 데이터의 결론

Carmen Reinhart와 Kenneth Rogoff가 800년간 66개 국가의 금융 데이터를 분석:

> "*Excessive debt accumulation, whether by the government, banks, corporations, or consumers, often poses greater systemic risks than it seems during a boom.*"

**핵심 패턴**:
1. 자산 가격 폭등 (주식·부동산)
2. 부채 폭증 (대출·신용카드)
3. "이번엔 다르다 (This time is different)" 라는 믿음
4. 작은 충격
5. 부채 디레버리징
6. 자산 가격 폭락
7. 은행 위기 → 경제 위기

#### AI 시대의 위험

> AI가 자동으로 신용평가/거래/위험관리를 하면, **모든 AI가 같은 패턴을 학습**해서 같은 신호에 같이 반응할 수 있다 → flash crash 위험.

2010년 5월 6일 "Flash Crash" — 다우지수가 약 5~10분 사이에 ~9% 폭락 후 36분간 회복. 알고리즘 트레이딩의 연쇄 반응.

> 📄 Reinhart, C. M., & Rogoff, K. S. (2009). *This Time is Different: Eight Centuries of Financial Folly*. Princeton University Press.

### 🔍 보충 4 — 한국 금융의 특수성

#### 한국이 다른 점

1. **은행 중심 (Bank-based)**: 미국·영국은 자본시장 중심, 한국은 은행 중심
   - 미국 가계금융: 주식 35%, 채권 5%, 예금 13%
   - 한국 가계금융: 주식 22%, 채권 1%, 예금 43%

2. **재벌 구조**: 금산분리 원칙 (재벌이 은행 못 가짐) → 한국 특유 규제
3. **부동산 비중**: 한국 가계자산의 약 75~80%가 부동산 (한국은행·통계청 가계금융복지조사 기준; OECD 평균 비교는 출처별로 편차가 큼)
4. **신용 정보 집중**: NICE, KCB 두 곳이 신용평가 독점 → 데이터 풍부 (AI에 유리)

#### 함의: 한국 금융 AI의 강점/약점

| 강점 | 약점 |
|------|------|
| 신용 데이터 집중도 높음 | 자본시장 데이터 빈약 |
| 디지털 금융 인프라 (계좌이체·간편결제) 세계 최고 | 영문 자료 부족 |
| 핀테크 규제 샌드박스 | 보수적 금융 규제 |

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. "데이터 중심 금융"이라는데, 정확히 뭔 뜻?

**A.** 두 가지 의미가 섞여 있다:

#### 의미 ①: 거래 매개체가 데이터다

카드 결제는 무엇인가?
- 너의 카드 → POS 단말기 → VAN사 → 카드사 DB
- 결국 **카드사 데이터베이스에 행(row) 하나가 추가**되는 일

현금은 점점 안 쓴다. 한국은행 통계 (2023):
- 비현금 결제 비중: 78.5%
- 카드: 53.9%
- 계좌이체: 24.6%
- 현금: 14.9%

#### 의미 ②: 의사결정 매개체가 데이터다

대출 승인을 누가 결정하나?
- 옛날 (1990년 이전): 지점장이 사람 보고 판단
- 지금 (FICO, NICE 등): 신용평가 점수 (데이터)로 자동 결정

이 두 가지가 합쳐져서 **"금융업 = 데이터를 잘 다루는 능력 경쟁"** 으로 바뀐 게 핵심.

### Q2. AI가 금융에 들어온 게 그렇게 새로운 일인가?

**A.** 의외로 **40년 된 일**이다. 책이 이걸 안 짚어줘서 "ChatGPT 이후 갑자기 등장한 신문물" 같이 느낄 수 있다.

#### 금융 AI의 역사

```
1968: Altman Z-score (선형 판별 분석으로 파산 예측)
       ↓
1989: FICO score (소비자용 신용점수 공식 출시; 회사 설립은 1956)
       ↓
1994: LTCM 헤지펀드 설립 (노벨상 수상자들의 수학 모델, 1998 폭망)
       ↓
2000년대: 신경망 기반 신용평가
       ↓
2007-09: 금융위기 (모델이 위기를 못 잡았다)
       ↓
2014: 미국 주식 거래의 다수(추정치 60-75%)가 알고리즘
       ↓
2020년대: 딥러닝, GAN을 금융 데이터 생성에 적용
       ↓
2023~: LLM, RAG, 생성형 AI (이 책 Ch6)
```

> 💡 **"금융 AI"는 새로운 분야가 아니라, 매번 새 도구가 들어오는 오래된 분야다.**
> 이 책이 가르치는 것은 그 흐름의 **현재 챕터**다. 다음 챕터는 또 올 거다.

### Q3. "은행, 보험, 증권"의 차이가 헷갈린다

**A.** 1.2절(다음 섹션)에서 자세히 다루지만, 미리 정리하면:

| 기관 | 핵심 기능 (Merton-Bodie 분류) | 데이터의 종류 | 대표 AI 응용 |
|------|----------|---------------|------------|
| **은행** | ③ 시간/공간 이동 (예금→대출) | 거래 내역, 잔액, 대출 상환 | 신용평가 |
| **보험** | ② 풀링 + ④ 위험 관리 | 사고 데이터, 건강 데이터 | 언더라이팅 |
| **증권** | ② 풀링 + ⑤ 정보 제공 | 가격, 거래량, 재무제표 | 알고리즘 트레이딩 |
| **카드** | ① 결제 | 결제 내역, 가맹점 데이터 | 사기 탐지 |
| **자산운용** | ② 풀링 (펀드) | 수익률, 포트폴리오 | 로보 어드바이저 |

> 💡 **결국 6가지 기능 중 어느 것을 주로 하느냐의 차이.**

### Q4. PV 공식이 갑자기 등장했는데, 이게 왜 그렇게 중요하다는 건지?

**A.** 한 줄로: **PV 공식이 못 푸는 금융 거래는 없기 때문**.

#### PV로 본 금융 상품

- **채권 가격**: 미래 쿠폰 + 원금의 PV 합
$$ P_{bond} = \sum_{t=1}^{T} \frac{C}{(1+r)^t} + \frac{F}{(1+r)^T} $$

- **주식 가격 (DDM)**: 미래 배당의 PV 합
$$ P_{stock} = \sum_{t=1}^{\infty} \frac{D_t}{(1+r)^t} $$

- **연금 (Annuity)**: 미래 정기 지급의 PV 합
$$ PV_{annuity} = \frac{C}{r} \left[1 - \frac{1}{(1+r)^n}\right] $$

- **옵션 가치 (Black-Scholes)**: 미래 페이오프의 위험중립 기대값의 PV
$$ C = e^{-rT} \cdot \mathbb{E}^Q[\max(S_T - K, 0)] $$

- **보험 보험료**: 미래 보험금 지급액의 PV
- **부동산 가격**: 미래 임대료의 PV

> 💡 **그래서 finance를 "응용 할인학(applied discounting)"이라고 부르기도 한다.**

### Q5. 정보 비대칭이 그렇게 중요하면, AI 없을 때는 어떻게 풀었나?

**A.** 인간 사회가 발명한 다양한 메커니즘:

| 메커니즘 | 예시 | 한계 |
|---------|------|------|
| **담보** | 부동산 담보 대출 | 담보 없는 사람은 못 빌림 |
| **보증** | 연대보증 | 한국 IMF 사태의 원인 |
| **신용평가사** | FICO, NICE | 표준화된 데이터에만 의존 |
| **공시 의무** | 상장회사 분기보고서 | 비상장은 깜깜이 |
| **감사** | 회계감사 | 분식회계 (엔론, 대우조선) |
| **레이팅** | S&P, Moody's | 2008년 위기 — AAA 채권 폭망 |

**AI가 추가하는 것**: 표준화 안 된 비정형 데이터 활용 (행동 패턴, 위치 데이터, 통신 이력 등) → 담보 없는 사람도 평가 가능.

---

## 🎯 이 절에서 가져갈 핵심 5가지

1. **금융 = 시간을 가로지르는 돈의 이동**, 본질은 PV/FV 공식 한 줄에 압축된다.
2. **금융의 6가지 기능 (Merton-Bodie)** 이 이 책 6개 장과 1:1 대응된다.
3. **데이터 중심 금융 = 거래 + 의사결정 둘 다 데이터로 한다는 뜻**. 매개체가 추상화될수록 AI가 강력해진다.
4. **금융 AI의 존재 이유 = 정보 비대칭 해소** (Akerlof 1970 lemon problem).
5. **금융 AI는 새로운 분야가 아니라 오래된 분야의 현재 챕터**. 1968년 Altman부터 2024년 LLM까지의 연장선.

---

## 📖 더 읽을거리

### 입문서 (한국어)
- 미슈킨, F. *화폐와 금융기관*. 퍼스트북. — 화폐금융론 표준 교재.
- 한국은행. (2024). *우리나라의 금융제도*. — 무료 PDF, 한국 특화.

### 입문서 (영어)
- Bodie, Z., Kane, A., & Marcus, A. J. (2024). *Investments* (13th ed.). McGraw-Hill. — 투자론 표준 교재.
- Hull, J. C. (2022). *Options, Futures, and Other Derivatives* (11th ed.). Pearson. — 파생상품 표준.

### 1차 자료 (원문 — 무료 접근)
- Merton, R. C. (1995). A functional perspective of financial intermediation. *Financial Management*, 24(2), 23–41.
- Akerlof, G. A. (1970). The market for "lemons". *QJE*, 84(3), 488–500. [무료: economics.harvard.edu]
- Stiglitz, J. E., & Weiss, A. (1981). Credit rationing in markets with imperfect information. *AER*, 71(3), 393–410.
- Modigliani, F., & Miller, M. H. (1958). The cost of capital. *AER*, 48(3), 261–297.
- McLeay, M., Radia, A., & Thomas, R. (2014). Money creation in the modern economy. *Bank of England Quarterly Bulletin* Q1. [무료: bankofengland.co.uk]
- BIS. (2023). *Annual Economic Report 2023*, Ch. III. [무료: bis.org]

### 대중서 (개념 잡기)
- Shiller, R. J. (2012). *Finance and the Good Society*. Princeton UP.
- Reinhart, C. M., & Rogoff, K. S. (2009). *This Time is Different*. Princeton UP.
- Mishkin, F. S. (2022). *The Economics of Money, Banking and Financial Markets* (13th ed.). Pearson.

### 한국 자료
- 한국은행 경제연구원. *경제분석* (분기간행물). — 한국 금융 데이터 분석.
- KIF (한국금융연구원). *주간 금융 브리프*.

---

> **다음 절 예고** — §1.2 금융을 다루는 기관들
> 본 절에서 본 "6가지 기능"이 한국의 7가지 금융기관 유형(은행·비은행예금취급기관·보험·증권·기타·공적·핀테크)으로 어떻게 나뉘는지 매핑하고, 각 기관에서 AI가 어떻게 쓰이는지 본격 분석한다.
