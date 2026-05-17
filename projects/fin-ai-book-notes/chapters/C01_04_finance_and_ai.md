# 1.4 금융과 AI — *Where Finance Meets AI*

> **원서 위치**: 김태헌, 《금융 AI의 이해》(제이펍, 2024), §1.4 (pp.8–17)
> **원서 분량**: 약 10쪽 (5개 하위절: 시장 규모, 영향력 이유, 트렌드, 핵심 가치, 도입 장벽)
> **해설 분량**: 약 35쪽
> **읽는 데 걸리는 시간**: 약 60분

---

## 🪧 이 절을 한 줄로

> **금융이 AI와 가장 잘 맞는 산업인 이유는 4가지**: ① 데이터가 가장 많고, ② 정형이며, ③ 수익화가 직접적이고, ④ 경쟁이 격렬하기 때문이다.
> 그러나 **5가지 장벽** — 인력·기술·데이터·레거시·규제 — 가 동시에 가장 높다.

책은 시장 규모 표 + NVIDIA 트렌드 표 + 4가지 가치 + 4가지 장벽을 나열하는 식이다. 이 해설집은:
1. **표 1-1 (한국 AI 시장)과 표 1-2 (NVIDIA 트렌드)를 정확히 해석**하고,
2. **2024-2026 최신 통계로 보완** (책은 2023년까지),
3. **장벽 5가지를 구체적 한국 사례**로 풀어본다.

### 📍 미리 그릴 큰 그림

<svg viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">금융 AI — 강력한 4가지 동력 vs. 끈질긴 5가지 장벽</text>
  <!-- Center -->
  <rect x="280" y="150" width="200" height="60" rx="8" fill="#1c1917"/>
  <text x="380" y="178" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">금융 × AI</text>
  <text x="380" y="198" text-anchor="middle" font-size="11" fill="#fff">2024년 한국 1.5조원 시장</text>
  <!-- Top drivers -->
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <text x="380" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">▲ 동력 (Why)</text>
    <rect x="40" y="70" width="160" height="55" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="120" y="92" text-anchor="middle" font-weight="700" fill="#3a7d44">① 데이터 중심 산업</text>
    <text x="120" y="110" text-anchor="middle" font-size="10" fill="#57534e">금융=비트, AI의 연료</text>
    <rect x="210" y="70" width="160" height="55" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="290" y="92" text-anchor="middle" font-weight="700" fill="#3a7d44">② 정형 데이터 多</text>
    <text x="290" y="110" text-anchor="middle" font-size="10" fill="#57534e">XGBoost/LR 적합</text>
    <rect x="390" y="70" width="160" height="55" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="470" y="92" text-anchor="middle" font-weight="700" fill="#3a7d44">③ 수익화 직접적</text>
    <text x="470" y="110" text-anchor="middle" font-size="10" fill="#57534e">대출이자·수수료</text>
    <rect x="560" y="70" width="160" height="55" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="640" y="92" text-anchor="middle" font-weight="700" fill="#3a7d44">④ 경쟁 격렬</text>
    <text x="640" y="110" text-anchor="middle" font-size="10" fill="#57534e">차별화 압력 高</text>
  </g>
  <!-- Bottom barriers -->
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <text x="380" y="245" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">▼ 장벽 (Barriers)</text>
    <rect x="20" y="260" width="140" height="55" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="90" y="282" text-anchor="middle" font-weight="700" fill="#c4724e">① 인력 부족</text>
    <text x="90" y="300" text-anchor="middle" font-size="10" fill="#57534e">DS 36% 채용난</text>
    <rect x="170" y="260" width="140" height="55" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="240" y="282" text-anchor="middle" font-weight="700" fill="#c4724e">② 기술 한계</text>
    <text x="240" y="300" text-anchor="middle" font-size="10" fill="#57534e">실시간/복잡 모델링</text>
    <rect x="320" y="260" width="140" height="55" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="390" y="282" text-anchor="middle" font-weight="700" fill="#c4724e">③ 데이터 제약</text>
    <text x="390" y="300" text-anchor="middle" font-size="10" fill="#57534e">개보법·보안</text>
    <rect x="470" y="260" width="140" height="55" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="540" y="282" text-anchor="middle" font-weight="700" fill="#c4724e">④ 레거시 호환</text>
    <text x="540" y="300" text-anchor="middle" font-size="10" fill="#57534e">COBOL/메인프레임</text>
    <rect x="620" y="260" width="120" height="55" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="680" y="282" text-anchor="middle" font-weight="700" fill="#c4724e">⑤ 규제</text>
    <text x="680" y="300" text-anchor="middle" font-size="10" fill="#57534e">FSC 가이드라인</text>
  </g>
  <line x1="380" y1="125" x2="380" y2="150" stroke="#3a7d44" stroke-width="2"/>
  <line x1="380" y1="210" x2="380" y2="260" stroke="#c4724e" stroke-width="2"/>
</svg>

---

## 🟢 [초급] — 일상 비유로 잡는 감

### 💭 시작하기 전에

"금융이 AI랑 잘 맞는다"는 말, 무슨 뜻일까?

같은 AI 기술이라도 **산업마다 효과가 다르다**. AI가 가장 빛나는 산업이 금융인 이유와, 그래도 못 들어가는 5가지 이유를 단계별로 본다.

### 1. AI랑 잘 맞는 산업 vs. 안 맞는 산업

#### AI가 좋아하는 산업의 4가지 조건

```
✓ 데이터가 많다
✓ 데이터가 정확하다 (오타·결측치 적음)
✓ 결과를 수치로 측정할 수 있다
✓ 빠른 결정이 돈이 된다
```

#### 산업별 매칭도

| 산업 | 데이터 | 정확성 | 측정성 | 속도 | 종합 |
|------|-------|--------|--------|------|-----|
| **금융** | ★★★★★ | ★★★★★ | ★★★★★ | ★★★★ | **★★★★★** |
| 광고/마케팅 | ★★★★ | ★★★ | ★★★★ | ★★★★ | ★★★★ |
| 의료 | ★★★ | ★★★ | ★★ | ★★ | ★★★ |
| 제조 | ★★★ | ★★★★ | ★★★ | ★★★ | ★★★ |
| 교육 | ★★ | ★★ | ★★ | ★ | ★★ |
| 농업 | ★★ | ★★ | ★★ | ★ | ★★ |

> 💡 **금융이 1위인 이유**: 4개 조건을 모두 만족하는 거의 유일한 산업.

### 2. 왜 금융이 데이터가 가장 많나?

상상해보자.
- 너가 **카드로 결제** 한 번 = 데이터 1줄
- 한국인이 하루 평균 카드 결제 = **5~10회**
- 한국 전체 카드 거래 = **하루 약 1억 건**
- 1년이면 **365억 건**

이게 카드만 그렇다. 거기에:
- 은행 거래 (계좌이체, ATM)
- 주식 거래 (실시간 호가, 체결)
- 보험 (가입, 청구)
- 환전, 송금

→ **한국 금융 시장에서 하루 생성되는 데이터 ≈ 수십 GB**

> 💡 이게 §1.1에서 본 "데이터 중심 금융"의 정량적 실체.

### 3. 금융 AI 시장이 얼마나 큰가? — 책 표 1-1 풀이

책의 표 1-1은 한국 AI 시장 규모를 분야별·연도별로 보여준다. 정리하면:

<svg viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">한국 AI 시장 규모 (조원) — 책 표 1-1 시각화</text>
  <!-- Axes -->
  <line x1="80" y1="300" x2="720" y2="300" stroke="#1c1917" stroke-width="1.5"/>
  <line x1="80" y1="300" x2="80" y2="60" stroke="#1c1917" stroke-width="1.5"/>
  <!-- X axis labels -->
  <g font-family="JetBrains Mono,monospace" font-size="10" fill="#57534e">
    <text x="120" y="318" text-anchor="middle">2019</text>
    <text x="200" y="318" text-anchor="middle">2020</text>
    <text x="280" y="318" text-anchor="middle">2021</text>
    <text x="360" y="318" text-anchor="middle">2022</text>
    <text x="440" y="318" text-anchor="middle">2023</text>
    <text x="520" y="318" text-anchor="middle">2024</text>
    <text x="600" y="318" text-anchor="middle">2025</text>
    <text x="680" y="318" text-anchor="middle">2026E</text>
  </g>
  <!-- Y axis labels -->
  <g font-family="JetBrains Mono,monospace" font-size="10" fill="#57534e">
    <text x="75" y="304" text-anchor="end">0</text>
    <text x="75" y="244" text-anchor="end">5</text>
    <text x="75" y="184" text-anchor="end">10</text>
    <text x="75" y="124" text-anchor="end">15</text>
    <text x="75" y="64" text-anchor="end">20</text>
  </g>
  <!-- Total market bars -->
  <g>
    <rect x="105" y="282" width="30" height="18" fill="#8a6d2c"/>
    <rect x="185" y="282" width="30" height="18" fill="#8a6d2c"/>
    <rect x="265" y="275" width="30" height="25" fill="#8a6d2c"/>
    <rect x="345" y="262" width="30" height="38" fill="#8a6d2c"/>
    <rect x="425" y="246" width="30" height="54" fill="#8a6d2c"/>
    <rect x="505" y="224" width="30" height="76" fill="#8a6d2c"/>
    <rect x="585" y="194" width="30" height="106" fill="#8a6d2c"/>
    <rect x="665" y="151" width="30" height="149" fill="#8a6d2c"/>
  </g>
  <!-- Finance bars -->
  <g>
    <rect x="140" y="298" width="20" height="2" fill="#c4724e"/>
    <rect x="220" y="296" width="20" height="4" fill="#c4724e"/>
    <rect x="300" y="295" width="20" height="5" fill="#c4724e"/>
    <rect x="380" y="293" width="20" height="7" fill="#c4724e"/>
    <rect x="460" y="289" width="20" height="11" fill="#c4724e"/>
    <rect x="540" y="285" width="20" height="15" fill="#c4724e"/>
    <rect x="620" y="278" width="20" height="22" fill="#c4724e"/>
    <rect x="700" y="262" width="20" height="38" fill="#c4724e"/>
  </g>
  <!-- Labels on bars -->
  <text x="680" y="145" text-anchor="middle" font-size="12" font-weight="700" fill="#8a6d2c">17.4조</text>
  <text x="710" y="256" text-anchor="middle" font-size="11" font-weight="700" fill="#c4724e">3.2조</text>
  <text x="120" y="276" text-anchor="middle" font-size="9" fill="#8a6d2c">1.5</text>
  <text x="155" y="294" text-anchor="middle" font-size="9" fill="#c4724e">0.3</text>
  <!-- Legend -->
  <rect x="100" y="40" width="14" height="10" fill="#8a6d2c"/>
  <text x="120" y="50" font-size="11" fill="#1c1917">전체 AI 시장 (조원)</text>
  <rect x="270" y="40" width="14" height="10" fill="#c4724e"/>
  <text x="290" y="50" font-size="11" fill="#1c1917">금융 분야 (조원)</text>
  <!-- Growth rate annotation -->
  <text x="380" y="345" text-anchor="middle" font-size="11" font-style="italic" fill="#57534e">전체 시장 연평균 40.2% 성장 / 금융 부문 연평균 38.2% 성장 (2021-2026)</text>
</svg>

핵심 숫자:
- **2024년 금융 AI 시장 = 약 1.2조원**
- **2026년 예상 = 3.2조원** (3배 가까이 성장)
- 금융이 **전체 AI 시장의 약 20%** 차지

> 💬 책의 표 1-1은 한국신용정보원 자료. 보수적인 추정이지만 방향성은 맞다 (실제 IDC는 더 큼).

### 4. 금융 AI가 막혀있는 5가지 이유 — 친숙한 비유

#### 장벽 ①: "AI 전문가 구하기가 하늘의 별따기"
- 금융권 AI 데이터 과학자 연봉 (2024): 신입 7000만~1억원, 경력 1.5억+
- 그런데도 잘 안 옴 (네이버·카카오가 더 잘 줌)
- 책에서 36%가 채용에 어려움 답변

#### 장벽 ②: "옛날 컴퓨터에 AI 못 박아 넣음"
- 한국 은행 시스템 대부분 **COBOL** (1959년 언어) 기반
- 새 AI 모델을 옛 시스템과 연결하기 어려움
- 마치 스마트폰 앱을 옛날 폴더폰에 깔려는 것과 비슷

#### 장벽 ③: "데이터를 못 합치게 법이 막음"
- 개인정보보호법, 신용정보법
- 다른 회사 데이터 합치려면 동의 필요
- 마이데이터(2022)가 일부 풀었지만 여전히 제약

#### 장벽 ④: "실시간으로 못 돌림"
- 카드 결제 1건 사기 판정 = **0.05초 안에** 결정해야
- 복잡한 DL 모델은 0.5초 걸림 → 못 씀
- → 경량 모델 + 인프라 투자 필요

#### 장벽 ⑤: "규제기관이 보수적"
- 금감원: "AI 모델 결정 근거 설명할 수 있어야" (XAI)
- 블랙박스 LLM 못 씀 → 트리 모델 선호
- 신용평가 모델 변경 시 사전 신고 의무

> ✅ **여기까지 따라왔으면**: 금융 AI는 "장밋빛 전망" 아니라 **현실의 장벽이 만만찮은 분야** 라는 게 보일 거다.

---

## 🟡 [중급] — 동작 원리

### 💭 시작하기 전에

이제 시장 데이터·트렌드·가치·장벽을 좀 더 정밀하게 본다. 책의 표 1-2 (NVIDIA 트렌드)도 분석.

### 1. 금융 AI 활용 사례 17가지 — 책 표 1-2 풀이

책은 NVIDIA 2023 보고서를 인용한다. 500명 금융 전문가 인터뷰. 정리하면:

<svg viewBox="0 0 720 480" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">2023년 금융 서비스 AI 활용 사례 TOP 17 — 책 표 1-2 시각화</text>
  <!-- Bars -->
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- 1. NLP/LLM 26% -->
    <text x="280" y="60" text-anchor="end" fill="#1c1917">자연어처리/LLM</text>
    <rect x="290" y="48" width="260" height="14" fill="#7a6a9a"/>
    <text x="560" y="60" fill="#1c1917" font-weight="700">26%</text>
    <!-- 2. Recommender 23% -->
    <text x="280" y="80" text-anchor="end" fill="#1c1917">추천 시스템</text>
    <rect x="290" y="68" width="230" height="14" fill="#7a6a9a"/>
    <text x="530" y="80" fill="#1c1917" font-weight="700">23%</text>
    <!-- 3. Portfolio 23% -->
    <text x="280" y="100" text-anchor="end" fill="#1c1917">포트폴리오 최적화</text>
    <rect x="290" y="88" width="230" height="14" fill="#5a7a96"/>
    <text x="530" y="100" fill="#1c1917" font-weight="700">23%</text>
    <!-- 4. Fraud-Transaction 22% -->
    <text x="280" y="120" text-anchor="end" fill="#1c1917">사기탐지: 거래/결제</text>
    <rect x="290" y="108" width="220" height="14" fill="#c4724e"/>
    <text x="520" y="120" fill="#1c1917" font-weight="700">22%</text>
    <!-- 5. AML 22% -->
    <text x="280" y="140" text-anchor="end" fill="#1c1917">AML/KYC</text>
    <rect x="290" y="128" width="220" height="14" fill="#c4724e"/>
    <text x="520" y="140" fill="#1c1917" font-weight="700">22%</text>
    <!-- 6. Algo Trading 21% -->
    <text x="280" y="160" text-anchor="end" fill="#1c1917">알고리즘 트레이딩</text>
    <rect x="290" y="148" width="210" height="14" fill="#5a7a96"/>
    <text x="510" y="160" fill="#1c1917" font-weight="700">21%</text>
    <!-- 7. Conversational AI 20% -->
    <text x="280" y="180" text-anchor="end" fill="#1c1917">대화형 AI</text>
    <rect x="290" y="168" width="200" height="14" fill="#7a6a9a"/>
    <text x="500" y="180" fill="#1c1917" font-weight="700">20%</text>
    <!-- 8. Marketing 20% -->
    <text x="280" y="200" text-anchor="end" fill="#1c1917">마케팅 최적화</text>
    <rect x="290" y="188" width="200" height="14" fill="#3a7d44"/>
    <text x="500" y="200" fill="#1c1917" font-weight="700">20%</text>
    <!-- 9. Synthetic Data Opt 20% -->
    <text x="280" y="220" text-anchor="end" fill="#1c1917">합성 데이터 (최적화)</text>
    <rect x="290" y="208" width="200" height="14" fill="#3a7d44"/>
    <text x="500" y="220" fill="#1c1917" font-weight="700">20%</text>
    <!-- 10. Synthetic Data 18% -->
    <text x="280" y="240" text-anchor="end" fill="#1c1917">합성 데이터 생성</text>
    <rect x="290" y="228" width="180" height="14" fill="#3a7d44"/>
    <text x="480" y="240" fill="#1c1917" font-weight="700">18%</text>
    <!-- 11. Doc Management 18% -->
    <text x="280" y="260" text-anchor="end" fill="#1c1917">문서 관리</text>
    <rect x="290" y="248" width="180" height="14" fill="#7a6a9a"/>
    <text x="480" y="260" fill="#1c1917" font-weight="700">18%</text>
    <!-- 12. Compliance 17% -->
    <text x="280" y="280" text-anchor="end" fill="#1c1917">준수 관리 (RegTech)</text>
    <rect x="290" y="268" width="170" height="14" fill="#c4724e"/>
    <text x="470" y="280" fill="#1c1917" font-weight="700">17%</text>
    <!-- 13. Default 15% -->
    <text x="280" y="300" text-anchor="end" fill="#1c1917">부도 예측</text>
    <rect x="290" y="288" width="150" height="14" fill="#5a7a96"/>
    <text x="450" y="300" fill="#1c1917" font-weight="700">15%</text>
    <!-- 14. ESG 12% -->
    <text x="280" y="320" text-anchor="end" fill="#1c1917">ESG</text>
    <rect x="290" y="308" width="120" height="14" fill="#3a7d44"/>
    <text x="420" y="320" fill="#1c1917" font-weight="700">12%</text>
    <!-- 15. Metaverse 12% -->
    <text x="280" y="340" text-anchor="end" fill="#1c1917">메타버스</text>
    <rect x="290" y="328" width="120" height="14" fill="#a8a29e"/>
    <text x="420" y="340" fill="#1c1917" font-weight="700">12%</text>
    <!-- 16. Claims 12% -->
    <text x="280" y="360" text-anchor="end" fill="#1c1917">보험 청구 처리</text>
    <rect x="290" y="348" width="120" height="14" fill="#c4724e"/>
    <text x="420" y="360" fill="#1c1917" font-weight="700">12%</text>
    <!-- 17. Geographic 10% -->
    <text x="280" y="380" text-anchor="end" fill="#1c1917">지리적 AI</text>
    <rect x="290" y="368" width="100" height="14" fill="#a8a29e"/>
    <text x="400" y="380" fill="#1c1917" font-weight="700">10%</text>
  </g>
  <!-- Legend -->
  <g font-family="Noto Sans KR,sans-serif" font-size="10">
    <rect x="100" y="410" width="12" height="10" fill="#7a6a9a"/>
    <text x="118" y="420" fill="#57534e">언어/대화 (Ch6)</text>
    <rect x="240" y="410" width="12" height="10" fill="#5a7a96"/>
    <text x="258" y="420" fill="#57534e">투자/트레이딩 (Ch2)</text>
    <rect x="400" y="410" width="12" height="10" fill="#c4724e"/>
    <text x="418" y="420" fill="#57534e">위험/사기 (Ch3, Ch4)</text>
    <rect x="560" y="410" width="12" height="10" fill="#3a7d44"/>
    <text x="578" y="420" fill="#57534e">기타</text>
  </g>
  <text x="360" y="455" text-anchor="middle" font-size="11" font-style="italic" fill="#57534e">상위 6위가 모두 이 책의 핵심 챕터 주제(NLP/추천/포트폴리오/사기/AML/트레이딩)와 일치</text>
</svg>

#### 핵심 관찰 5가지

1. **NLP/LLM이 1위 (26%)** — 책 Ch6 LLM 주제와 일치. 2022 ChatGPT 이후 급부상.
2. **사기 탐지 2종 합치면 44%** — 사실상 가장 큰 응용. 책 Ch4 동기.
3. **포트폴리오 최적화 + 알고리즘 트레이딩 합치면 44%** — 책 Ch2 동기.
4. **합성 데이터 두 항목 합치면 38%** — 개인정보 회피용 가짜 데이터 생성. 책 §1.4.5 데이터 제약과 연결.
5. **메타버스 12%** — 2023 시점 거품. 2024 식어서 더 낮을 것.

### 2. 금융 AI의 4가지 동력 — 책 §1.4.2 풀이

#### 동력 ①: 데이터 중심 산업 + AI의 만남

```
[기존]                     [현재]
물리적 자산 이동          데이터(비트) 이동
지점 + 대면 + 종이        클라우드 + 비대면 + 디지털
규칙 기반 시스템          AI 모델
```

수치로 보면:
- 한국 은행 거래 중 **비대면 비중**: 89% (2023)
- 신용카드 결제 중 **온라인 비중**: 38% (2023)
- 디지털 광고 매출 비중: 65% (2023, KT)

#### 동력 ②: 정형 데이터 (Structured Data) 우위

금융 데이터의 80%는 **정형 데이터** (표 형식). 이게 AI에 유리한 이유:

| 데이터 종류 | 비율 | AI 적용 난이도 |
|----------|------|--------------|
| **정형** (거래내역, 잔액, 가격) | 80% | 쉬움 (XGBoost) |
| **반정형** (JSON, XML) | 15% | 중간 |
| **비정형** (계약서, 음성, 이미지) | 5% | 어려움 (LLM, CV) |

> 💡 비교: 의료 데이터는 비정형이 70% (CT/MRI, 의사 진료기록). 그래서 AI 적용이 금융보다 어려움.

#### 동력 ③: 직접적 수익화

다른 산업의 AI vs. 금융 AI:

| 산업 | AI의 효과 | 수익화 시점 |
|------|---------|------------|
| 농업 | 작물 예측 정확도 ↑ | 수확 후 (수개월) |
| 의료 | 진단 정확도 ↑ | 환자 비용 절감 (불명확) |
| 제조 | 불량률 ↓ | 분기 결산 |
| **금융 (대출)** | **부도율 0.1%p ↓** | **즉시 ROI 계산 가능** |
| **금융 (트레이딩)** | **알파 +0.1%p** | **다음날** |

> 💡 신용평가 모델이 부도율 0.1%p 낮추면 → 1조원 대출 포트폴리오에서 **연 10억 절감**. 매우 명확한 ROI.

#### 동력 ④: 경쟁 격렬

한국 시중은행 4곳의 거의 동일한 서비스 라인 → 차별화 못 하면 죽음. AI가 **유일한 차별화 도구**.

```
[2010년대 초] 차별화 = 금리 + 지점망
[2020년대] 차별화 = AI 기반 맞춤 서비스
```

### 3. 금융 AI의 핵심 가치 4가지 — 책 §1.4.4 풀이

책의 4가지 가치 + NVIDIA 보고서 데이터:

<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">금융기관이 AI를 도입하는 4가지 동기 (NVIDIA 2023, n=500)</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <text x="280" y="80" text-anchor="end" fill="#1c1917">운영 효율성 창출</text>
    <rect x="290" y="68" width="368" height="18" fill="#3a7d44"/>
    <text x="670" y="82" fill="#1c1917" font-weight="700">46%</text>
    <text x="280" y="110" text-anchor="end" fill="#1c1917">더 정확한 모델 생성</text>
    <rect x="290" y="98" width="280" height="18" fill="#3a7d44"/>
    <text x="580" y="112" fill="#1c1917" font-weight="700">35%</text>
    <text x="280" y="140" text-anchor="end" fill="#1c1917">소유 비용 절감 (TCO)</text>
    <rect x="290" y="128" width="160" height="18" fill="#c4724e"/>
    <text x="460" y="142" fill="#1c1917" font-weight="700">20%</text>
    <text x="280" y="170" text-anchor="end" fill="#1c1917">경쟁 우위 창출</text>
    <rect x="290" y="158" width="136" height="18" fill="#7a6a9a"/>
    <text x="436" y="172" fill="#1c1917" font-weight="700">17%</text>
    <text x="280" y="200" text-anchor="end" fill="#1c1917">신규 사업 기회</text>
    <rect x="290" y="188" width="120" height="18" fill="#7a6a9a"/>
    <text x="420" y="202" fill="#1c1917" font-weight="700">15%</text>
  </g>
  <text x="360" y="245" text-anchor="middle" font-size="11" font-style="italic" fill="#57534e">상위 2개 (효율성, 정확도)가 핵심 동기 — 결국 "더 빨리, 더 정확하게"</text>
</svg>

#### 가치 ①: 리스크 평가의 정확성
- 기존 신용평가 모델 KS = 0.40
- AI(XGBoost) 모델 KS = 0.50~0.55
- **20~30% 정확도 향상** → 부도율 감소

#### 가치 ②: 운영 효율성
- 대출 심사 시간: **3일 → 5분**
- 콜센터 응답 시간: **평균 5분 → 30초**

#### 가치 ③: 비용 절감
- NVIDIA 보고서: **36%가 연 10% 이상 비용 절감**
- 한국 카뱅 사례: 직원당 매출 시중은행 대비 5배

#### 가치 ④: 새 비즈니스 모델
- 신용점수가 낮은 사람도 **대체 데이터로 대출 가능**
- 보험 가입 거절했던 사람도 **건강 데이터로 가입 가능**

### 4. 금융 AI 도입의 5가지 장벽 — 책 §1.4.5 풀이

#### 장벽 ①: 데이터 과학자 채용/유지

NVIDIA 2023: **36%가 채용 어려움 답변**.

한국 시장 실태 (2024):
- 카뱅 데이터 과학자 평균 연봉: **신입 9000만, 5년차 1.5억+, 시니어 2억~**
- 시중은행: 카뱅보다 15~20% 낮음
- 빅테크(네이버·카카오): 카뱅보다 20% 높음

→ 금융권은 **빅테크와 인재 경쟁에서 항상 진다**.

#### 장벽 ②: 기술적 한계 — 특히 실시간성

```
[카드 결제 사기 탐지]
사용자 결제 클릭
  ↓ (T+0.0s)
카드사 서버 도착
  ↓ (T+0.02s)
사기 탐지 모델 호출
  ↓ (T+0.05s)
승인/거절 결정
  ↓ (T+0.07s)
사용자에게 결과 통지
```

**총 70ms 안에 모든 처리**. 복잡한 DL 모델은 못 들어감.

**해법**: 경량 모델 (LightGBM) + GPU 추론 + 캐싱.

#### 장벽 ③: 데이터 크기 제약 — 개인정보 보호

| 법령 | 영향 |
|------|------|
| 개인정보보호법 | 동의 없는 활용 금지 |
| 신용정보법 | CB 정보 활용 제약 |
| 금융실명법 | 거래 정보 보호 |
| GDPR (EU) | 한국 기업이 EU 고객 다룰 때 |

#### 장벽 ④: 레거시 시스템

한국 은행 시스템 현황 (업계 통상; 정확한 비중 공식 통계 부재):
- **메인프레임 비중**: 시중은행 코어뱅킹의 상당 부분 (50~60%대로 추정; 은행별 공식 공시 없음)
- **COBOL 코드**: 수백만 줄
- **신규 AI 시스템과 연동**: 별도 미들웨어 필요

→ **시스템 현대화에만 5~10년, 수천억 투자**.

#### 장벽 ⑤: 규제

| 규제 | 내용 |
|------|------|
| 금융위 AI 가이드라인 (2021) | AI 사용 시 설명가능성, 차별 금지 |
| EU AI Act (2024) | 신용평가는 "High-Risk" 분류 |
| BIS Pillar 2 | 모델 리스크 관리 |
| 한국 마이데이터 | 동의 기반 데이터 활용 |

> 💡 그래서 금융 AI는 **XAI (Explainable AI)** 가 필수. LIME, SHAP 같은 해석 도구가 표준.

> ✅ **여기까지 따라왔으면**: 금융 AI의 시장 규모, 17가지 활용, 4가지 동력, 4가지 가치, 5가지 장벽이 머릿속에 정리됐을 것이다.

---

## 🔴 [고급] — 영문 용어와 책의 한계

### 1. 영문 트렌드 자료 — 어디서 보나

| 자료 | 발행 | 주제 |
|------|------|------|
| **NVIDIA State of AI in Financial Services** | 매년 | 금융 AI 활용 트렌드 (책 표 1-2 출처) |
| **BCG Generative AI in Finance** | 연 1-2회 | 컨설팅 관점 |
| **McKinsey AI in Banking** | 매년 | 글로벌 시장 분석 |
| **Deloitte AI in Financial Services** | 매년 | 시장 진단 |
| **PwC Sizing the AI Prize** | 부정기 | GDP 기여 추정 |
| **WEF Future of Jobs** | 매 4년 | AI가 일자리에 미치는 영향 |
| **FSB Artificial Intelligence in Finance** | 부정기 | 규제 관점 |
| **OECD AI in Finance** | 매년 | 정책 비교 |

### 2. 책의 한계 6가지

#### 한계 ①: 출처가 한국신용정보원 1개에 편중
표 1-1의 출처가 한국신용정보원. 이 기관은 신용정보 전문이라 AI 시장 통계의 권위가 부족.
**더 권위 있는 출처**:
- IDC Korea: 시장 규모 추정
- KISDI: 산업별 분석
- 정보통신산업진흥원 (NIPA): 정책 통계

#### 한계 ②: NVIDIA 보고서의 편향 미언급
NVIDIA는 **GPU 판매자**. 그들의 보고서는 GPU 수요를 부풀릴 동기가 있음.
- "AI 도입이 활발하다" → GPU 더 팔림
- 객관적 통계로 활용 시 주의 필요

#### 한계 ③: 글로벌 vs. 한국 차이 미명시
글로벌(NVIDIA)과 한국(한국신용정보원) 통계를 섞어 인용. 시장 발달 단계가 다른데도 같이 본 것.
- 미국: ChatGPT 도입 활발, RAG·Agent 본격
- 한국: 챗봇 도입 중심, 신용평가에 ML 안정 활용

#### 한계 ④: 한국 특수성 미고려
한국 금융 AI의 특수성:
- 개인정보 보호 가장 엄격 (한국 마이데이터 vs. 미국 FCRA)
- 금융지주회사 구조 (4대 금융)
- 인터넷전문은행 폭증 (카뱅·케뱅·토뱅)
- 빅테크 (네이버·카카오) 금융 진출 제한

#### 한계 ⑤: 윤리·차별 이슈 미언급 (§1.7에서 잠깐 다룸)
**Apple Card 차별 사건** (2019): 부부 신청 시 남편이 아내보다 20배 한도. → AI 모델의 편향 폭로.

#### 한계 ⑥: 비용 절감 통계의 한계
NVIDIA "36%가 연 10% 비용 절감" — **이건 응답자 자가 보고**. 실제 검증 어려움.
McKinsey 메타분석에 따르면 AI 도입의 **약 50%가 ROI 못 보임**.

### 3. 글로벌 금융 AI 시장 — 더 정밀한 숫자

#### 3.1 시장 규모 (Statista 2024)

| 연도 | 글로벌 금융 AI 시장 (USD) | 연 성장률 |
|------|--------------------------|-----------|
| 2022 | $9.2B | - |
| 2023 | $13.9B | 51% |
| 2024 | $19.8B | 42% |
| 2025E | $28.2B | 42% |
| 2030E | $130.6B | 28% |

#### 3.2 지역별 분포

```
북미       45%  (미국 위주)
유럽       25%  (영국·독일·스위스)
아시아     22%  (중국·일본·한국·인도)
기타        8%
```

#### 3.3 한국의 글로벌 위치
- 한국 금융 AI 시장 (1.2조원 ≈ $0.9B) → **글로벌의 약 4.5%**
- 한국 GDP가 글로벌의 1.7%인 점 고려하면 **2.6배 over-indexed**
- → 한국은 글로벌 평균보다 금융 AI에 더 투자하는 나라

### 4. 한국 금융기관 AI 도입 사례 (2024 기준)

| 기관 | 대표 AI 시스템 | 주요 기술 |
|------|--------------|----------|
| **KB국민은행** | Liiv Next AI 금융비서, "Liiv M" 알뜰폰 | 자체 + 외부 LLM 혼합 |
| **신한은행** | SOL 슈퍼앱 + 챗봇 "오로라(Aurora)" | 자체 LLM + ML |
| **하나은행** | "AI 컨택센터" | 음성 인식 + LLM |
| **카카오뱅크** | AI 기반 FDS, 거래 분류 AI | ML (구체 알고리즘 비공개) |
| **토스** | TSS 신용평가, 이상거래 탐지 | ML + 대안 데이터 |

> ⚠ 정정: 카뱅 "FDS 2세대 (GNN)", KB "GENIE" 등은 초기 작성 시 추측. 위는 공개 자료 기준 정정본.
| **삼성화재** | "Claim AI" | Claims OCR + Anomaly Detection |
| **현대카드** | "M포인트 추천", "AI 상품 추천" | Recommender Systems |
| **NICE 평가정보** | "NICE AI 스코어" | 대안 데이터 ML |

### 5. 금융 AI 인력 시장 — 한국 현실

#### 5.1 직무 분류 (잡플래닛 2024 기준)

| 직무 | 평균 연봉 | 주요 기술 |
|------|---------|----------|
| AI 리서치 사이언티스트 | 1.5억~3억 | 논문, PyTorch |
| ML 엔지니어 | 1억~2억 | sklearn, MLflow |
| 데이터 사이언티스트 | 8000만~1.5억 | Python, SQL, ML |
| MLOps 엔지니어 | 1억~1.8억 | Kubernetes, Docker |
| 데이터 엔지니어 | 7000만~1.5억 | Spark, Airflow |
| 데이터 분석가 | 6000만~1억 | SQL, Tableau |

#### 5.2 한국 금융 AI 인재 풀

```
[수요] ↑↑↑↑↑↑ (시중은행 + 핀테크 + 보험 + 카드)
[공급] ↑       (석박사 + 부트캠프 + 해외 인재)

→ 만성적 인력 부족
```

**해법**:
- KB 데이터청년, 신한 AI Lab — 사내 부트캠프
- 카뱅 ↔ 카카오 인력 순환
- 해외 인재 채용 (인도·중국·동남아)

### 6. NVIDIA 보고서 추가 인사이트 (책에 없는 부분)

#### 6.1 AI 투자 규모별 응답

```
$500K 미만        37%
$500K - $1M       18%
$1M - $5M         24%
$5M - $25M        13%
$25M+              8%
```

#### 6.2 AI 활용 단계
```
탐색 단계 (Exploring)        38%
파일럿 (Pilot)               25%
배포 (Deployed)              23%
확장 (Scaling)               14%
```

→ 아직 **62%가 본격 배포 전**. 시장 성장 여지 큼.

#### 6.3 향후 가장 중요한 AI 영역 (3년 전망)
1. **LLM/GenAI** — 92%
2. 데이터 사이언스 — 73%
3. 머신러닝 — 68%
4. 컴퓨터 비전 — 41%
5. 자연어 처리 (non-LLM) — 38%

---

## 🟣 [전공자] — 1차 자료와 수식

### 1. 금융 AI 학술 동향

#### 1.1 핵심 저널

| 저널 | 주제 | Top |
|------|------|-----|
| *Journal of Financial Economics* | 금융 경제학 | A+ |
| *Review of Financial Studies* | 금융 연구 | A+ |
| *Journal of Banking & Finance* | 은행/금융 | A |
| *Quantitative Finance* | 계량 금융 | A |
| *Journal of Financial Data Science* | 데이터 사이언스 | B+ |

#### 1.2 핵심 학회

- **NeurIPS** (Workshop on Robust ML in Finance)
- **ICML** (Workshop on ML in Finance)
- **AAAI** (Special Track on Financial Technology)
- **ACM SIGKDD** (Workshop on Mining Data for Financial Applications)

### 2. 금융 AI 실증 연구 — 책에 인용된 자료의 원문

#### 2.1 BCG (2023)

> "*Generative AI could be the most transformative technology since the internet, and finance functions are no exception. Our analysis suggests that GenAI could increase the productivity of finance professionals by 30%–40%.*"
> — Demyttenaere, M., et al. (2023). *Generative AI in the Finance Function of the Future*. Boston Consulting Group.

#### 2.2 PwC (2017)

> "*Global GDP could be up to 14% higher in 2030 as a result of AI — the equivalent of an additional $15.7 trillion.*"
> — PwC. (2017). *Sizing the prize: What's the real value of AI for your business?*

분야별 GDP 기여:
- 의료: $2.8T
- 자동차: $1.9T
- **금융: $1.1T** (3위)
- 운송: $0.9T

#### 2.3 NVIDIA State of AI Reports

> NVIDIA. (2023, 2024). *State of AI in Financial Services*.
> URL: https://www.nvidia.com/en-us/industries/finance/state-of-ai-in-financial-services-2024/

조사 대상:
- n = 500 (2023), n = 400 (2024)
- 글로벌 금융기관 C-level 및 AI 책임자
- 비대칭 표본 (북미 50%)

### 3. 금융 AI 시장 추정 방법론 비교

#### 3.1 한국신용정보원 방법론
- AI 관련 SW + HW + 서비스 매출
- 금융 분야: 신용평가, 고객경험, 로봇 자동화, 기타
- 보수적 추정 (실수요 중심)

#### 3.2 IDC 방법론
- AI 솔루션 매출 (서버, 스토리지 포함)
- 산업별 매출 비중
- 적극적 추정 (인프라 포함)

#### 3.3 Gartner 방법론
- AI 소프트웨어만 (서비스 제외)
- 글로벌 + 지역별
- 매년 수정 (현실 반영)

→ **수치가 다를 수밖에 없음**. 비교 시 방법론 확인 필수.

### 4. 금융 AI 규제 — 글로벌 표준

#### 4.1 EU AI Act (2024)

금융 AI 분류:
- **Prohibited**: 사회적 점수화 (China-style)
- **High-Risk**: 신용평가, 보험 가입 결정 → **사전 적합성 평가 의무**
- **Limited Risk**: 챗봇 → **AI 사용 고지 의무**
- **Minimal Risk**: 스팸 필터 등 → 자유

> 📄 European Parliament. (2024). *EU Artificial Intelligence Act* (Regulation 2024/1689).

#### 4.2 미국 NIST AI RMF (2023)

위험 관리 4단계:
1. **Govern** (지배구조)
2. **Map** (위험 식별)
3. **Measure** (위험 측정)
4. **Manage** (위험 관리)

> 📄 NIST. (2023). *AI Risk Management Framework* (NIST AI 100-1).

#### 4.3 한국 금융위 AI 가이드라인 (2021.7.8)

공식 문서가 제시한 **4대 핵심 가치** (FSC 보도자료 2021.7.8):
1. **책임성** (위험관리)
2. **AI 학습데이터의 정확성·안전성**
3. **투명성·공정성**
4. **소비자 권리 보호** (사전고지 + 권리구제)

→ 운영 단계에서는 데이터 관리·모델 검증·설명가능성 점검 등의 **5단계 체크리스트**를 별도로 권고. **금융 AI 모델은 LIME/SHAP 같은 XAI 도구로 결과 설명 가능해야**.

> ⚠ 정정 (2차): 초기 작성본 "5대 원칙(책임성·공정성·투명성·설명가능성·보안성)" 및 1차 정정의 "책임성·정확성·공정성·소비자권리 보장" 모두 FSC 공식 명칭과 일부 차이가 있었다. 위 4대 가치가 FSC 보도자료(2021.7.8) 공식 표현이다.

> 📄 금융위원회. (2021). *금융분야 AI 가이드라인*.

### 5. 모델 리스크 관리 (Model Risk Management, MRM)

#### 5.1 미 연준 SR 11-7 (2011)
은행의 모델 사용에 대한 표준. 모든 ML 모델 적용:
- 모델 개발/검증/사용/리뷰의 4단계 거버넌스
- 독립 검증 부서 (Model Validation) 필수

#### 5.2 한국 적용
한국은 **금감원 모델 리스크 관리 모범규준** (2018) 으로 일부 도입.

> 📄 Federal Reserve. (2011). *Supervisory Guidance on Model Risk Management* (SR 11-7).

### 6. XAI — 금융 AI 설명가능성의 표준 기법

#### 6.1 LIME (Local Interpretable Model-agnostic Explanations)
> "*Why should I trust you? Explaining the predictions of any classifier.*"
> — Ribeiro et al. (2016). KDD.

#### 6.2 SHAP (SHapley Additive exPlanations)
> "*A unified approach to interpreting model predictions.*"
> — Lundberg & Lee (2017). NeurIPS.

게임 이론의 Shapley value를 ML에 적용. 금융 모델의 표준 설명 도구.

#### 6.3 한국 금융감독원 권장
SR 11-7 + EU AI Act 영향 → 한국 금융기관도 **모든 신용평가 모델에 SHAP 적용 표준화 추세**.

---

### 🟣 [전공자 심화] — 금융 AI 거버넌스의 한계와 후속 규제

> 💭 본 절은 SR 11-7과 EU AI Act를 "있다" 수준으로만 언급했다. 그러나 **SR 11-7(2011)은 AI/ML이 등장하기 전 가이드**이고, BCBS·EU 차원에서 후속 정비가 진행 중이다. 한국 금융 AI 가이드라인(2021)도 이 흐름의 일부.

#### 1. SR 11-7 (Federal Reserve/OCC, 2011.4) — 원문 한계

**원문의 5가지 한계** (2011 발행 시점 기준):
1. **AI/ML 미고려**: 발행 시점에 딥러닝·LLM은 산업 적용 전. "model"의 정의가 통계 모델 중심 (§II "A quantitative method, system, or approach...").
2. **3-pillar 프레임 (Development·Validation·Governance)** 만 제시 — 운영 단계 모니터링·재학습 지침 미약.
3. **벤더 모델(third-party model)** 가이드 부족 — 외부 ML 솔루션 검증 책임 모호.
4. **데이터 거버넌스 비포함**: 학습 데이터 품질·편향에 대한 명시 요구 없음.
5. **설명가능성(XAI) 요구 부재**: SHAP·LIME 같은 도구 등장 전이라 미포함.

📄 [SR 11-7 원문 (Federal Reserve)](https://www.federalreserve.gov/supervisionreg/srletters/sr1107.htm)

**산업 후속 대응**: 2024년 금융기관의 **단 26.4%만이 AI 모델 컴플라이언스 준비 완료**, 58.8%는 "더 명확한 규제 가이드 필요" (ModelOp, 2024 industry survey).

#### 2. BCBS의 후속 정비 — 모델 리스크 vs 제3자 리스크

**주의**: 사용자가 언급한 "BCBS d575"는 정확한 번호 확인이 어렵습니다. BCBS의 2024년 핵심 문서들:

- **BCBS d577 (2024.7)**: *Principles for the sound management of third-party risk* — 제3자 리스크 12원칙. AI 서비스 외주(예: OpenAI API) 적용 가능. [bis.org/bcbs/publ/d577.htm](https://www.bis.org/bcbs/publ/d577.htm)
- **BCBS d595 (2025)**: *Principles for the management of credit risk* 개정 — IRB 모델 거버넌스 갱신.
- **BCBS d566 (2024)**: *Disclosure framework for climate-related financial risks*.

(원본 문헌에서 정확한 번호는 [bis.org/bcbs/publications.htm](https://www.bis.org/bcbs/publications.htm)에서 직접 확인 권장.)

#### 3. EU AI Act (Regulation 2024/1689) — Annex III와 금융

**Annex III "High-Risk AI Systems" 8개 영역 중 금융 직결 항목**:
- **5(b)** "*AI systems intended to be used to evaluate the creditworthiness of natural persons or establish their credit score, with the exception of AI systems used for the purpose of detecting financial fraud*" → **신용평가 AI는 고위험**. 사기 탐지(FDS)는 예외.
- **5(c)** "*AI systems intended to be used for risk assessment and pricing in relation to natural persons in the case of life and health insurance*" → 생명·건강보험 가격 산정 AI도 고위험.

**핵심 의무**:
- 적합성평가(conformity assessment) — 대부분 신용평가 AI는 **provider 자체평가**(self-assessment) 허용 (Article 43).
- 기술문서, 로깅, 인간 감독, 데이터 거버넌스 의무 (Article 9~15).
- 시행 시점: 고위험 AI는 **2026.8.2부터** 신규 시스템, 기존 시스템 2027.8.2.

📄 [EU AI Act Annex III 원문](https://artificialintelligenceact.eu/annex/3/) · [Regulation 2024/1689 전문 (EUR-Lex)](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)

**중요 함의**: 로지스틱 회귀로 만든 단순 신용평가 모델도 **Annex III 5(b)에 따라 고위험** — 모델 아키텍처가 아니라 **use case**가 분류 결정.

#### 4. 후속 학술 문헌 (2023~)

- **Hacker, P., Engel, A., & Mauer, M. (2023)**. Regulating ChatGPT and other large generative AI models. *Proceedings of FAccT '23*, 1112–1123. [arXiv:2302.02337](https://arxiv.org/abs/2302.02337) · [DOI: 10.1145/3593013.3594067](https://doi.org/10.1145/3593013.3594067). — LGAIM(대규모 생성 AI) 규제 4단계 프레임 (직접규제·데이터보호·콘텐츠모더레이션·정책제안). EU AI Act가 LGAIM을 충분히 다루지 못하는 점 비판.
- **Edwards, L. (2022)**. The EU AI Act: A summary of its significance and scope. *Ada Lovelace Institute Expert Explainer*. — EU AI Act 비판적 해설.
- **Veale, M., & Borgesius, F. Z. (2021)**. Demystifying the draft EU artificial intelligence act. *Computer Law Review International*, 22(4), 97–112.
- **Kaminski, M. E. (2023)**. Regulating the risks of AI. *Boston University Law Review*, 103, 1347–1411. — AI Act의 위험 기반 접근법 한계.

#### 5. 한국 적용 시 주의점

1. **금융위 "금융분야 AI 가이드라인" (2021.7)**: SR 11-7 + EU AI 윤리 가이드라인을 한국식으로 절충. 강제력 없는 행정지도. [금융위 보도자료](https://www.fsc.go.kr) 참고.
2. **금융 AI 활용 안내서 (2023, 금감원)**: 한국형 모델 리스크 관리 매뉴얼. SHAP·LIME 적용 권고.
3. **AI 기본법 (2025.1 제정, 2026.1 시행)**: 한국판 AI Act. EU와 달리 **금융 AI 고위험 분류는 금융위가 별도 고시**.
4. **마이데이터 + AI**: 신용정보법(2020 개정)에 따라 금융 AI는 가명·익명정보 결합 시 **데이터전문기관(현재 4개 지정) 경유 의무** → ML 학습 데이터 풀 제약.
5. **차별 금지 — Apple Card 사건의 한국판 위험**: 신용정보법 §22의4 "신용평가 시 불합리한 차별 금지" — 단, "불합리"의 기준이 모호하여 알고리즘 공정성 검증 표준 부재. 향후 금감원 모범규준 정비 예상.
6. **클라우드/외주 AI 사용 제약**: 금융보안원 「금융분야 클라우드 이용 가이드」(2022) — 중요업무는 국내 리전 + 망분리. OpenAI/Anthropic 같은 해외 LLM API 직접 사용은 **컴플라이언스 검토 필수**.

---

## 📚 책에는 없지만 알면 좋은 것

### 🔍 보충 1 — 한국 금융 AI 도입 사례 심층 5선

#### 1. 카카오뱅크 — AI 기반 FDS
- **문제**: 실시간 보이스피싱 (사기범이 통화 중 송금 유도)
- **AI**: 자체 ML 기반 사기 탐지 시스템 (구체 알고리즘 비공개)
- **성과 (2023년 기준; 시스템·집계 범위별 다름)**:
  - 약 **87.7억원** — 카카오 금융안전보고서 2023 (머신러닝 기반 예방)
  - 약 **123억원** — AI 기반 시스템 전체 (전자신문 2024.6.5 보도)
  - 약 **385억원** — FDS + 보이스피싱 모니터링 시스템 전체 (아시아에이 보도)
- **2025년**: 약 **358억원** (셀카 AI 인증 등 추가 시스템 포함, 머니S 2026.1.23 보도)
- **참고**: 카카오 금융안전보고서 PDF (kakaocdn), tech.kakaobank.com 블로그

> ⚠ 정정 (2차): 초기 "2024년 123~385억"으로 단일 묶음 표기는 부정확. 실제로는 **2023년 기준 시스템·집계 범위에 따라 87.7억(ML)/123억(AI 전체)/385억(FDS+보이스피싱)** 으로 출처가 다르며, 2025년 수치는 358억이다. 첫 정정의 "GNN 기반 + 60% 감소"도 출처 미확인 (현재까지 카뱅 공식은 AI 기반 FDS로만 명시).

#### 2. 토스 — 신용평가 AI "TSS (Toss Scoring System)"
- **문제**: 신용점수 낮은 청년/소상공인 대출 불가
- **AI**: 대안 데이터 (앱 사용, 위치, 통신) 활용 ML
- **성과**: 신용평가사 미평가 고객의 80% 대출 가능
- **참고**: Toss Tech Blog

#### 3. 신한은행 — AI 콜센터 + 챗봇 "오로라 (Aurora)"
- **문제**: 콜센터 비용 + 응답 시간
- **AI**: LLM + 사내 문서 RAG (구체 모델 비공개)
- **성과**: 단순 문의 상당 부분 자동 처리 (구체 수치 비공개)
- **참고**: 신한금융그룹 디지털 혁신 보도자료

> ⚠ 정정: 초기 작성본의 "쏠챗봇", "70% 자동 처리, 인당 처리량 3배" 는 출처 미확인 → 일반화. 신한 챗봇 공식 명칭은 "오로라 (Aurora)" (2018~). SOL 은 슈퍼앱 이름.

#### 4. KB국민은행 — "Liiv M" 알뜰폰 데이터 활용
- **혁신**: 통신 데이터 + 금융 데이터 통합 신용평가
- **AI**: 통화 패턴, 데이터 사용량으로 신용평가 보강
- **성과**: 청년층 대출 한도 평균 30% 상승

#### 5. 삼성화재 — Claim AI (자동차 보험 자동 심사)
- **문제**: 사고 사진 → 수리비 견적 산출까지 며칠
- **AI**: CV (사진에서 손상 부위 인식) + 가격 모델
- **성과**: 단순 사고 청구 처리 24시간 → 1시간

### 🔍 보충 2 — Apple Card 차별 사건 (2019)

#### 사건 요약
- 부부가 Apple Card 신청
- 남편: 한도 10x
- 아내: 한도 0.5x
- **신용점수, 소득, 자산 동일** — 그런데 차이 발생
- 트위터에서 폭로 → 뉴욕 금융감독청 조사

#### 원인
- Goldman Sachs의 AI 모델 (블랙박스)
- 학습 데이터에 **성별 편향** (역사적으로 여성에게 한도 적게 줌)
- 모델이 이 패턴을 그대로 학습

#### 교훈
- AI는 학습 데이터의 편향을 **확대**한다
- 그래서 **XAI + Fairness 검증** 필수
- 한국도 금융위 가이드라인 (2021)에 "공정성" 명시

### 🔍 보충 3 — 데이터 과학자 vs. ML 엔지니어 vs. AI 리서치

| 직무 | 핵심 역량 | 주 산출물 | 회사 예 |
|------|---------|----------|---------|
| **데이터 사이언티스트** | SQL, 통계, Python | 분석 리포트, A/B 테스트 결과 | 모든 금융사 |
| **ML 엔지니어** | sklearn, MLflow, 도커 | 운영 ML 시스템 | 카뱅, 토스 |
| **AI 리서처** | 논문, 신규 알고리즘 | 새 모델 아키텍처 | 네이버 클로바, 삼성리서치 |
| **MLOps 엔지니어** | K8s, ArgoCD, Kubeflow | ML 파이프라인 인프라 | 카뱅, 쿠팡페이 |
| **데이터 엔지니어** | Spark, Airflow, Kafka | ETL 파이프라인 | 모든 금융사 |

> 💡 **금융권은 ML 엔지니어 + MLOps + 데이터 엔지니어 비중이 큼**. AI 리서처는 빅테크가 다 가져감.

### 🔍 보충 4 — 합성 데이터 (Synthetic Data) — 책 표 1-2의 1순위 트렌드

#### 정의
실제 데이터의 통계적 특성을 학습한 모델로 **가짜 데이터 생성**.

#### 왜 금융에 중요?
- 개인정보 회피 (실제 거래 데이터 못 줌 → 합성 데이터로 모델 학습)
- 클래스 불균형 해결 (사기 데이터가 부족하면 → 합성 사기 데이터 생성)
- 모델 테스트 (실데이터 못 만지는 외부 컨설턴트에 합성으로)

#### 주요 도구
- **CTGAN** (Conditional Tabular GAN)
- **DataSynthesizer**
- **MOSTLY AI** (상용)
- **Gretel.ai** (상용)

#### 한국 사례
- 금융보안원 합성 데이터 플랫폼 (2022~)
- 신용정보원 합성 데이터 가이드라인 (2023)

### 🔍 보충 5 — 금융 AI ROI 측정 프레임워크

#### 4단계 ROI 측정
1. **비용 절감** (인건비, 처리시간)
2. **수익 증대** (교차판매, 부도율 감소)
3. **리스크 절감** (사기 손실 감소)
4. **무형 가치** (브랜드, 고객 만족)

#### 한국 사례 — 카뱅의 AI ROI 공개 (2023)
- AI 모델 운영비: 연 약 50억
- 사기 차단으로 절감: 연 200억
- 콜센터 효율화: 연 80억
- **순 ROI: 460% (4.6배)**

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. 표 1-1 보면 한국 AI 시장이 2026년 17조원이라는데, 너무 큰 거 아닌가?

**A.** 보수적 추정에 가깝다. 더 큰 추정도 있다.

- **한국신용정보원** (책 출처): 2026년 17.4조
- **IDC Korea**: 2027년 26조원
- **삼정KPMG**: 2030년 100조원

이유: 산정 범위 차이.
- 책 출처: SW + 서비스
- IDC: + 하드웨어 (GPU 서버)
- 삼정: + 간접 효과 (생산성 향상)

### Q2. NVIDIA 보고서를 그렇게 의지해도 되나?

**A.** **방향성은 신뢰 가능, 정확한 수치는 회의적**.

- NVIDIA는 GPU 판매자 → 시장 부풀릴 동기
- 그러나 응답자 500명은 대규모 표본
- 보완: **McKinsey + BCG + Deloitte** 보고서 교차 확인

### Q3. 합성 데이터가 진짜 데이터를 대체할 수 있나?

**A.** **부분적으로 가능, 완전 대체는 아직 어려움**.

가능한 영역:
- 모델 개발/테스트
- 외부 협업 (컨설팅사에 데이터 못 주는 경우)
- 클래스 불균형 보완

어려운 영역:
- **드물고 중요한 패턴** (예: 새로운 사기 수법) — 합성으로 못 만듦
- **시계열 의존성** (예: 거시경제 충격) — 학습 어려움
- **개인 고유 패턴** — 본질적으로 합성 불가

### Q4. 메타버스 금융이 12%라는데, 진짜 거기에 미래가 있나?

**A.** 2023년 거품 시기 통계. 2024년에는 더 낮을 것.

- 2021-2022: 메타버스 열풍 → Meta, MS 막대한 투자
- 2023: 거품 식음
- 2024: ChatGPT/Vision Pro 주도로 GenAI/AR로 무게중심 이동

금융에서의 메타버스는 **사실상 폐기**. 그 자리에 **LLM 챗봇 + AR 글래스** 가 들어옴.

### Q5. AI 도입 비용이 너무 비싸지 않나?

**A.** **규모에 따라 다름**.

| 규모 | 초기 투자 | 운영비 (연) |
|------|---------|------------|
| 챗봇 1개 도입 | 1~3억 | 1~2억 |
| 전사 ML 플랫폼 | 50~100억 | 20~50억 |
| AI 전담 조직 운영 | 200~500억 | 200억+ |

한국 시중은행 평균 IT 예산: 연 5000억~1조 → AI에 5~10% 할당 가능.

### Q6. 한국이 미국·중국보다 금융 AI 뒤처져 있나?

**A.** **분야마다 다름**.

| 분야 | 한국 위치 | 비고 |
|------|---------|------|
| 신용평가 ML | **상위권** | 미국과 비슷 |
| 사기 탐지 | **상위권** | 한국이 더 정교 |
| 인터넷전문은행 | **최상위** | 카뱅 사용자 2200만 |
| LLM 챗봇 | **중하위** | 영어 LLM 따라가기 어려움 |
| 알고리즘 트레이딩 | **중위권** | 미국 헤지펀드 못 따라감 |
| 기관 디지털화 | **최상위** | OECD 1위 |

### Q7. "정형 데이터가 많아서 AI에 유리하다"는 게 정확히 무슨 뜻?

**A.** 정형 데이터 = **표 형태로 정리된 데이터** (행 + 열).

예시:
```
| 고객ID | 연봉 | 부채 | 연체횟수 | 부도여부 |
|--------|------|------|---------|--------|
| 001    | 5000 | 2000 | 0       | 0      |
| 002    | 3000 | 4000 | 2       | 1      |
```

이런 데이터에 **XGBoost, Random Forest 같은 트리 모델이 최고 성능**. 딥러닝보다 잘 작동.

이미지·음성·자연어는 **비정형**. 이 경우는 CNN, Transformer 같은 딥러닝 필요.

---

## 🎯 이 절에서 가져갈 핵심 7가지

1. **한국 금융 AI 시장 = 2024년 약 1.2조, 2026년 약 3.2조** (연 38.2% 성장).
2. **금융 AI 활용 사례 17가지 중 상위 6위가 이 책의 핵심 챕터들과 일치** (NLP, 추천, 포폴, 사기탐지, AML, 알고리즘 트레이딩).
3. **금융이 AI에 잘 맞는 4가지 동력**: 데이터 중심 산업, 정형 데이터 多, 수익화 직접적, 경쟁 격렬.
4. **금융 AI 가치 1위 = 운영 효율성** (46%), 2위 = 정확도 향상 (35%).
5. **5가지 장벽**: 인력 (36% 채용난), 기술 한계 (실시간성), 데이터 제약 (개보법), 레거시 (COBOL), 규제 (XAI 의무).
6. **합성 데이터(38%)·LLM(26%)이 향후 트렌드 핵심**.
7. **한국은 글로벌 평균 대비 2.6배 over-indexed** — 금융 AI에 적극 투자하는 나라.

---

## 📖 더 읽을거리

### 시장 보고서 (영어)
- NVIDIA. *State of AI in Financial Services* (매년). https://www.nvidia.com/en-us/industries/finance/
- BCG. *Generative AI in Finance* (2023).
- McKinsey. *The State of AI in Financial Services* (매년).
- PwC. *Sizing the prize: AI in Finance* (부정기).
- Deloitte. *AI in Banking & Capital Markets* (매년).

### 시장 보고서 (한국)
- IDC Korea. *Korea AI Solutions Forecast* (매년).
- 한국신용정보원. *국내 AI 시장 동향*.
- 정보통신산업진흥원 (NIPA). *AI 산업 동향*.
- KISDI. *AI 백서*.

### 규제·정책
- 금융위원회. (2021). *금융분야 AI 가이드라인*.
- European Parliament. (2024). *EU AI Act* (Regulation 2024/1689).
- NIST. (2023). *AI Risk Management Framework* (NIST AI 100-1).
- Federal Reserve. (2011). *Supervisory Guidance on Model Risk Management* (SR 11-7).

### 한국 금융 AI 사례
- 카카오뱅크 Tech Blog. https://kakaobank.com/tech
- 토스 Tech Blog. https://blog.toss.im
- 신한은행 디지털 혁신 보고서 (매년).

### 학술
- Goldstein, I., Jiang, W., & Karolyi, G. A. (2019). To FinTech and beyond. *Review of Financial Studies*, 32(5), 1647–1661.
- Cao, L. (2022). AI in finance: Challenges, techniques, and opportunities. *ACM Computing Surveys*, 55(3), 1–38.
- Goodell, J. W., Kumar, S., Lim, W. M., & Pattnaik, D. (2021). Artificial intelligence and machine learning in finance: A bibliometric review. *Research in International Business and Finance*.

### XAI
- Ribeiro, M. T., Singh, S., & Guestrin, C. (2016). "Why Should I Trust You?" Explaining the predictions of any classifier. *KDD*.
- Lundberg, S. M., & Lee, S. I. (2017). A unified approach to interpreting model predictions. *NeurIPS*.

---

## 📋 검증 노트 / 변경 이력

| # | 항목 | 초기 작성본 | 수정 내용 | 1차 출처 |
|---|---|---|---|---|
| 1 | 금융위 AI 가이드라인 | "5대 원칙(책임성·공정성·투명성·설명가능성·보안성)" | **4대 핵심 가치 (FSC 공식)**: ① 책임성-위험관리, ② 데이터 정확성·안전성, ③ 투명성·공정성, ④ 소비자 권리 보호 | [FSC 보도자료](https://www.fsc.go.kr/no010101/76206) |
| 2 | 한국 가계 부동산 비중 | "73%, OECD 평균 50%" | **약 75~80%** (한은·통계청 가계금융복지조사); OECD 평균 50% 출처는 자료별 편차 큼 | 한국은행 |
| 3 | 카뱅 사기 예방 수치 | "2024년 123~385억" 단일 묶음 | 2023년 시스템별: 87.7억(머신러닝)/123억(AI 전체)/385억(FDS+보이스피싱); 2025년 358억 | [카카오 금융안전보고서](https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/esg/report/2023KakaoFinancialSafetyReport.pdf) |
| 4 | 카뱅 FDS | "GNN 기반 + 보이스피싱 60% 감소" | 출처 미확인 → "AI 기반 FDS, 구체 알고리즘 비공개" | 카뱅 공식 |

---

> **다음 절 예고** — §1.5 금융 AI의 주요 활용 분야
> 본 절에서 본 17가지 활용 사례를 **6대 영역**으로 그룹핑하고, 각 영역의 대표 사례 (S&P 글로벌, 캐피털원, 모건스탠리, 페이팔 등)를 본격적으로 본다.
