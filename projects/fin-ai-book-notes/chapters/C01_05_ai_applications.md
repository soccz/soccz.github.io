# 1.5 금융 AI의 주요 활용 분야 — *Six Pillars of Financial AI*

> **원서 위치**: 김태헌, 《금융 AI의 이해》(제이펍, 2024), §1.5 (pp.18–33)
> **원서 분량**: 약 15쪽 (6개 하위절)
> **해설 분량**: 약 40쪽 (이 책 챕터 중 가장 길고 중요한 절)
> **읽는 데 걸리는 시간**: 약 70분

---

## 🪧 이 절을 한 줄로

> 금융 AI의 활용은 **6개 기둥**으로 나뉜다: **신용평가 · 사기탐지 · 고객서비스 · 투자트레이딩 · 준법감시 · 프로세스자동화**.
> 이 6개가 책 Ch2~Ch6의 **목차 구조 그 자체**다.

책은 6개 영역을 각각 짧게 소개하고 글로벌 사례 (S&P·페이팔·웰스파고·JP모건·BoA 등)를 든다. 이 해설집은:
1. 각 영역의 **AI 응용을 구체적 기술 수준**으로 풀고,
2. **한국 사례** 를 추가하며,
3. 책 Ch2~Ch6와의 **매핑**을 명시한다.

### 📍 미리 그릴 큰 그림 — 6 Pillars와 책 챕터 매핑

<svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">금융 AI 6 Pillars → 이 책 6개 장에 어떻게 매핑되는가</text>
  <!-- Center: This book -->
  <rect x="290" y="170" width="180" height="60" rx="8" fill="#1c1917"/>
  <text x="380" y="195" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">《금융 AI의 이해》</text>
  <text x="380" y="215" text-anchor="middle" font-size="11" fill="#fff">Ch2~Ch6</text>
  <!-- 6 pillars -->
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- Top -->
    <rect x="280" y="50" width="200" height="80" rx="8" fill="#fdf0ea" stroke="#c4724e" stroke-width="2"/>
    <text x="380" y="72" text-anchor="middle" font-weight="700" fill="#c4724e">① 신용 평가</text>
    <text x="380" y="90" text-anchor="middle" font-size="10" fill="#1c1917">S&P, NICE, 이머징 국가</text>
    <text x="380" y="106" text-anchor="middle" font-size="10" fill="#57534e">대체 데이터 + AI</text>
    <text x="380" y="122" text-anchor="middle" font-size="10" font-weight="700" fill="#c4724e">→ Ch3 (전체)</text>
    <line x1="380" y1="130" x2="380" y2="170" stroke="#c4724e" stroke-width="1.5"/>
    <!-- Top right -->
    <rect x="540" y="120" width="200" height="80" rx="8" fill="#eaf2f8" stroke="#5a7a96" stroke-width="2"/>
    <text x="640" y="142" text-anchor="middle" font-weight="700" fill="#5a7a96">② 사기 탐지</text>
    <text x="640" y="160" text-anchor="middle" font-size="10" fill="#1c1917">알리페이, 페이팔, 비자</text>
    <text x="640" y="176" text-anchor="middle" font-size="10" fill="#57534e">실시간 ML + GNN</text>
    <text x="640" y="192" text-anchor="middle" font-size="10" font-weight="700" fill="#5a7a96">→ Ch4 (전체)</text>
    <line x1="540" y1="160" x2="470" y2="190" stroke="#5a7a96" stroke-width="1.5"/>
    <!-- Bottom right -->
    <rect x="540" y="225" width="200" height="80" rx="8" fill="#edf7ef" stroke="#3a7d44" stroke-width="2"/>
    <text x="640" y="247" text-anchor="middle" font-weight="700" fill="#3a7d44">③ 고객 서비스</text>
    <text x="640" y="265" text-anchor="middle" font-size="10" fill="#1c1917">웰스파고, BoA Erica</text>
    <text x="640" y="281" text-anchor="middle" font-size="10" fill="#57534e">챗봇 + 추천 + RAG</text>
    <text x="640" y="297" text-anchor="middle" font-size="10" font-weight="700" fill="#3a7d44">→ Ch6 (부분)</text>
    <line x1="540" y1="265" x2="470" y2="220" stroke="#3a7d44" stroke-width="1.5"/>
    <!-- Bottom -->
    <rect x="280" y="295" width="200" height="80" rx="8" fill="#f5e6f0" stroke="#7a6a9a" stroke-width="2"/>
    <text x="380" y="317" text-anchor="middle" font-weight="700" fill="#7a6a9a">④ 투자/트레이딩</text>
    <text x="380" y="335" text-anchor="middle" font-size="10" fill="#1c1917">로보어드바이저, HFT</text>
    <text x="380" y="351" text-anchor="middle" font-size="10" fill="#57534e">LSTM, RL, 알고리즘</text>
    <text x="380" y="367" text-anchor="middle" font-size="10" font-weight="700" fill="#7a6a9a">→ Ch2 (전체)</text>
    <line x1="380" y1="295" x2="380" y2="230" stroke="#7a6a9a" stroke-width="1.5"/>
    <!-- Bottom left -->
    <rect x="20" y="225" width="200" height="80" rx="8" fill="#fef9e7" stroke="#8a6d2c" stroke-width="2"/>
    <text x="120" y="247" text-anchor="middle" font-weight="700" fill="#8a6d2c">⑤ 준법감시/RegTech</text>
    <text x="120" y="265" text-anchor="middle" font-size="10" fill="#1c1917">AML, KYC, 거래감시</text>
    <text x="120" y="281" text-anchor="middle" font-size="10" fill="#57534e">+ 규제 보고 자동화</text>
    <text x="120" y="297" text-anchor="middle" font-size="10" font-weight="700" fill="#8a6d2c">→ Ch5 (인프라)</text>
    <line x1="220" y1="265" x2="290" y2="220" stroke="#8a6d2c" stroke-width="1.5"/>
    <!-- Top left -->
    <rect x="20" y="120" width="200" height="80" rx="8" fill="#fef9e7" stroke="#8a6d2c" stroke-width="2"/>
    <text x="120" y="142" text-anchor="middle" font-weight="700" fill="#8a6d2c">⑥ 프로세스 자동화</text>
    <text x="120" y="160" text-anchor="middle" font-size="10" fill="#1c1917">RPA + AI = 하이퍼오토</text>
    <text x="120" y="176" text-anchor="middle" font-size="10" fill="#57534e">보험 클레임 자동화</text>
    <text x="120" y="192" text-anchor="middle" font-size="10" font-weight="700" fill="#8a6d2c">→ Ch5,6 (부분)</text>
    <line x1="220" y1="160" x2="290" y2="190" stroke="#8a6d2c" stroke-width="1.5"/>
  </g>
</svg>

---

## 🟢 [초급] — 일상 비유로 잡는 감

### 💭 시작하기 전에

은행/카드사/보험사가 너에게 **하루에 몇 번 AI를 보여주는지** 세보자.

- 아침: 토스 앱 열기 → **신용점수** 표시 (AI ①)
- 점심: 카드 결제 → **사기 의심** 확인 (AI ②)
- 오후: 챗봇에 환율 질문 → **자동 응답** (AI ③)
- 저녁: 주식 앱 → **종목 추천** (AI ④)
- 밤: 보험사가 자동차 보험 갱신 안내 → **자동 견적** (AI ⑤+⑥)

→ **하루에 6번 다른 AI를 만난다**. 그게 이 절에서 다루는 6가지 영역.

### 1. 6가지 영역을 한 줄 비유로

| 영역 | 한 줄 비유 | 너랑 닿는 순간 |
|------|----------|--------------|
| ① **신용 평가** | "너 얼마나 빌릴 수 있어?" 자동 판정기 | 토스에서 신용점수 보기 |
| ② **사기 탐지** | "이거 진짜 너야?" 24시간 감시카메라 | 카드 결제 의심 알림 |
| ③ **고객 서비스** | 24시간 친절한 상담원 | 챗봇, 음성봇 |
| ④ **투자/트레이딩** | "이걸 사라" 자동 코치 | 로보어드바이저, 주식 추천 |
| ⑤ **준법 감시** | "법 잘 지키고 있나?" 자동 점검 | 보이는 곳엔 없음 (백오피스) |
| ⑥ **프로세스 자동화** | 단순 반복 업무 자동화 봇 | 보험 청구 자동 심사 |

### 2. 각 영역의 "성공 = 무엇?"

#### ① 신용 평가
- **성공**: 갚을 사람만 정확히 골라냄 (KS 통계량 ↑)
- **실패**: 진짜 갚을 사람 거절 (False Negative) 또는 안 갚을 사람 승인 (False Positive)

#### ② 사기 탐지
- **성공**: 사기 99.99% 막음 (PR-AUC ↑)
- **실패**: 진짜 거래를 사기로 오인 (고객 불편), 사기 못 잡음 (손실)

#### ③ 고객 서비스
- **성공**: 고객이 "사람보다 낫다" 느낌
- **실패**: 챗봇이 같은 말 반복, 답 못 함

#### ④ 투자/트레이딩
- **성공**: 시장 평균(KOSPI)보다 높은 수익률
- **실패**: 손실 + 거래 비용 + 세금

#### ⑤ 준법 감시
- **성공**: 규제 위반 0건, 사기 0건
- **실패**: 금감원 제재, 과징금

#### ⑥ 프로세스 자동화
- **성공**: 사람 일자리 → 봇이 대체, 처리 시간 단축
- **실패**: 봇이 잘못 처리, 사람이 두 번 일함

> ✅ **여기까지 따라왔으면**: 6가지 영역마다 "AI가 잘했다 = 무엇?"이 명확히 보일 것이다. 다음은 각 영역의 구체적 사례.

---

## 🟡 [중급] — 각 영역 깊이 보기

### 1. 신용 평가 — AI와 대체 데이터의 결합 (§1.5.1)

#### 1.1 핵심 변화: 전통 데이터 → 대체 데이터

```
[전통 신용평가]
- 재무제표
- 신용 기록 (CB)
- 소득 증명서
- 부채 잔액
   ↓
"이 사람 점수 700점"

[AI + 대체 데이터]
- 위의 모든 것
+ 소셜미디어 활동
+ 위치 데이터
+ 통신 사용 패턴
+ 온라인 거래
+ 위성 이미지 (기업의 경우)
   ↓
"이 사람 점수 750점 (더 정확)"
```

#### 1.2 S&P 글로벌 사례 — 디지털 발자취

S&P Global Market Intelligence는 다음을 신용평가에 추가:
- **웹사이트 트래픽** (회사의 인터넷 방문자 수)
- **검색 엔진 노출도**
- **소셜미디어 언급량**
- **사이버 리스크 점수**

→ 전통 신용평가에 **'살아있는' 데이터** 추가.

#### 1.3 이머징 국가 사례 — 신용 정보 없는 사람들

**문제**: 인도, 인도네시아, 베트남 등은 신용평가사가 부족 → 처음 대출 신청 시 점수가 없음.

**해법** (그림 1-6 풀이):

<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">이머징 국가 신용평가 데이터 출처 — 전통 vs. 대체</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- Traditional sources -->
    <text x="180" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#5a7a96">전통 데이터 (사용률)</text>
    <text x="50" y="80" fill="#1c1917">은행 거래</text>
    <rect x="120" y="68" width="240" height="14" fill="#5a7a96"/>
    <text x="365" y="80" font-weight="700" fill="#5a7a96">60%</text>
    <text x="50" y="100" fill="#1c1917">고용/급여</text>
    <rect x="120" y="88" width="180" height="14" fill="#5a7a96"/>
    <text x="305" y="100" font-weight="700" fill="#5a7a96">45%</text>
    <text x="50" y="120" fill="#1c1917">세금 신고</text>
    <rect x="120" y="108" width="124" height="14" fill="#5a7a96"/>
    <text x="249" y="120" font-weight="700" fill="#5a7a96">31%</text>
    <text x="50" y="140" fill="#1c1917">유틸리티</text>
    <rect x="120" y="128" width="100" height="14" fill="#5a7a96"/>
    <text x="225" y="140" font-weight="700" fill="#5a7a96">25%</text>
    <text x="50" y="160" fill="#1c1917">신용조사</text>
    <rect x="120" y="148" width="80" height="14" fill="#5a7a96"/>
    <text x="205" y="160" font-weight="700" fill="#5a7a96">20%</text>
    <!-- Alternative sources -->
    <text x="540" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">대체 데이터 (사용률)</text>
    <text x="420" y="80" fill="#1c1917">디지털 거래</text>
    <rect x="490" y="68" width="200" height="14" fill="#3a7d44"/>
    <text x="695" y="80" font-weight="700" fill="#3a7d44">50%</text>
    <text x="420" y="100" fill="#1c1917">SNS 활동</text>
    <rect x="490" y="88" width="140" height="14" fill="#3a7d44"/>
    <text x="635" y="100" font-weight="700" fill="#3a7d44">35%</text>
    <text x="420" y="120" fill="#1c1917">신원 디지털</text>
    <rect x="490" y="108" width="120" height="14" fill="#3a7d44"/>
    <text x="615" y="120" font-weight="700" fill="#3a7d44">30%</text>
    <text x="420" y="140" fill="#1c1917">위치 데이터</text>
    <rect x="490" y="128" width="80" height="14" fill="#3a7d44"/>
    <text x="575" y="140" font-weight="700" fill="#3a7d44">20%</text>
    <text x="420" y="160" fill="#1c1917">대출 대체</text>
    <rect x="490" y="148" width="60" height="14" fill="#3a7d44"/>
    <text x="555" y="160" font-weight="700" fill="#3a7d44">15%</text>
  </g>
  <line x1="380" y1="40" x2="380" y2="220" stroke="#a8a29e" stroke-width="1" stroke-dasharray="3,2"/>
  <text x="360" y="250" text-anchor="middle" font-size="11" font-style="italic" fill="#57534e">선진국은 전통 데이터 중심, 이머징 국가는 대체 데이터 비중 더 높음 → 모바일 결제 보편화 효과</text>
</svg>

#### 1.4 한국 사례 — 토스 TSS (Toss Scoring System)
- **문제**: 청년 대학생, 프리랜서, 자영업자는 NICE/KCB 점수 낮거나 없음
- **AI**: 토스 앱 사용 패턴 + 통신 데이터 + 위치 데이터로 평가
- **성과**: NICE 점수 미평가 고객의 80% 대출 가능

**책 Ch3에서 본격 다룸**.

### 2. 사기 탐지 (FDS, Fraud Detection System) — §1.5.2

#### 2.1 시장 규모 (책 본문)
- 글로벌 FDP 시장: 2023년 **$260억** (약 33조원)
- 2026년 예상: **$780억** (3배)
- **금융 AI에서 가장 큰 단일 시장**

#### 2.2 알리페이 알파리스크 (Ant Group, 중국)

세계 최고 수준의 FDS:
- **사기 손실률**: **1천만 건 중 0.64건** (0.0000064%) — Alipay 2020년 발표 수치
- **응답 시간**: 거래 결제 처리 단위인 **100ms 안에 판정** (정확한 공식 수치는 비공개)
- **기술 진화**:
  - 2017년: AlphaRisk 출시 (DL + RL 도입)
  - 2020년: 5세대 enhanced AlphaRisk 발표 (신규 위협을 1초 내 대응)
  - 2023년 이후: LLM 통합 보도가 일부 있으나 공식 출처는 확인되지 않음

> ⚠ 정정: 초기 작성본은 "0.05초" 응답 시간과 "2023년 LLM 도입"을 단정했으나, 0.05초는 카드 결제 일반 처리시간 기준일 뿐 Alipay 공식 수치가 아니며, 2023년 LLM 도입 시점도 공식 출처가 확인되지 않는다. AlphaRisk의 마지막 공개 공식 마일스톤은 2020년 5세대 enhanced 발표다.

> 💡 비교: 한국 카드사 평균 사기 손실률 약 **1만건 중 1건** (0.01%). 알리페이가 1만 배 낮음.

#### 2.3 페이팔 Simility — 실시간 적응형

페이팔이 2018년 인수. 핵심 특징 5가지:

| 특징 | 의미 |
|------|------|
| **적응형 모델링** | ML이 새 사기 패턴 자동 학습 |
| **화이트/블랙 리스트** | 안전/위험 IP·계정 빠른 필터 |
| **실시간 분석** | 거래 발생 즉시 판정 |
| **시각화** | 대시보드로 패턴 파악 |
| **자동화** | 의심 거래 자동 차단/검토 |

#### 2.4 Visa VAA (Visa Advanced Authorization)

- 전 세계 발급기관에 **실시간 리스크 점수** 제공
- 클러스터링 알고리즘 중심 (유사 거래 그룹화)
- 카드 거래 0.05초 안에 점수 산출
- 비공개 알고리즘 (블랙박스)

#### 2.5 시각화 — FDS 시스템의 데이터 흐름

<svg viewBox="0 0 720 340" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <defs>
    <marker id="arF" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#5a7a96"/></marker>
  </defs>
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">FDS 데이터 흐름 — 카드 결제 수준의 실시간 판정</text>
  <!-- Data sources -->
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <rect x="20" y="50" width="120" height="50" rx="6" fill="#fff" stroke="#d6d3d1"/>
    <text x="80" y="72" text-anchor="middle" font-weight="700">거래 데이터</text>
    <text x="80" y="88" text-anchor="middle" font-size="10" fill="#57534e">금액·시간·위치</text>
    <rect x="20" y="115" width="120" height="50" rx="6" fill="#fff" stroke="#d6d3d1"/>
    <text x="80" y="137" text-anchor="middle" font-weight="700">디바이스 데이터</text>
    <text x="80" y="153" text-anchor="middle" font-size="10" fill="#57534e">IP·기기 ID</text>
    <rect x="20" y="180" width="120" height="50" rx="6" fill="#fff" stroke="#d6d3d1"/>
    <text x="80" y="202" text-anchor="middle" font-weight="700">고객 프로필</text>
    <text x="80" y="218" text-anchor="middle" font-size="10" fill="#57534e">과거 거래</text>
    <rect x="20" y="245" width="120" height="50" rx="6" fill="#fff" stroke="#d6d3d1"/>
    <text x="80" y="267" text-anchor="middle" font-weight="700">소셜 그래프</text>
    <text x="80" y="283" text-anchor="middle" font-size="10" fill="#57534e">연결 네트워크</text>
    <!-- Arrows -->
    <line x1="140" y1="75" x2="195" y2="150" stroke="#5a7a96" stroke-width="1.5" marker-end="url(#arF)"/>
    <line x1="140" y1="140" x2="195" y2="160" stroke="#5a7a96" stroke-width="1.5" marker-end="url(#arF)"/>
    <line x1="140" y1="205" x2="195" y2="170" stroke="#5a7a96" stroke-width="1.5" marker-end="url(#arF)"/>
    <line x1="140" y1="270" x2="195" y2="180" stroke="#5a7a96" stroke-width="1.5" marker-end="url(#arF)"/>
    <!-- ML Models -->
    <rect x="200" y="120" width="140" height="100" rx="6" fill="#eaf2f8" stroke="#5a7a96" stroke-width="2"/>
    <text x="270" y="145" text-anchor="middle" font-weight="700" fill="#5a7a96">ML 앙상블</text>
    <text x="270" y="165" text-anchor="middle" font-size="10" fill="#1c1917">Rule-based</text>
    <text x="270" y="180" text-anchor="middle" font-size="10" fill="#1c1917">XGBoost</text>
    <text x="270" y="195" text-anchor="middle" font-size="10" fill="#1c1917">DL (RNN)</text>
    <text x="270" y="210" text-anchor="middle" font-size="10" fill="#1c1917">GNN</text>
    <line x1="340" y1="170" x2="395" y2="170" stroke="#5a7a96" stroke-width="1.5" marker-end="url(#arF)"/>
    <!-- Decision -->
    <rect x="400" y="120" width="140" height="100" rx="6" fill="#fdf0ea" stroke="#c4724e" stroke-width="2"/>
    <text x="470" y="145" text-anchor="middle" font-weight="700" fill="#c4724e">의사결정</text>
    <text x="470" y="170" text-anchor="middle" font-size="10" fill="#1c1917">정상 (97%)</text>
    <text x="470" y="190" text-anchor="middle" font-size="10" fill="#8a6d2c">검토 (2%)</text>
    <text x="470" y="210" text-anchor="middle" font-size="10" fill="#c4724e">차단 (1%)</text>
    <line x1="540" y1="170" x2="595" y2="170" stroke="#5a7a96" stroke-width="1.5" marker-end="url(#arF)"/>
    <!-- Action -->
    <rect x="600" y="120" width="100" height="100" rx="6" fill="#edf7ef" stroke="#3a7d44" stroke-width="2"/>
    <text x="650" y="145" text-anchor="middle" font-weight="700" fill="#3a7d44">조치</text>
    <text x="650" y="170" text-anchor="middle" font-size="10" fill="#1c1917">승인 전송</text>
    <text x="650" y="190" text-anchor="middle" font-size="10" fill="#1c1917">알림 푸시</text>
    <text x="650" y="210" text-anchor="middle" font-size="10" fill="#1c1917">계정 잠금</text>
  </g>
  <text x="360" y="320" text-anchor="middle" font-size="11" font-style="italic" fill="#57534e">한 거래당 50ms 안에 모든 단계 완료 — 그래서 경량 모델 + GPU 추론 필수</text>
</svg>

#### 2.6 한국 사례 — 카뱅 AI 기반 FDS
- AI/ML 기반 사기 탐지 (구체 알고리즘 비공개)
- **카뱅 사기 예방 (시스템·집계 범위별)**: 2023년 87.7억(머신러닝, 카카오 금융안전보고서) / 123억(AI 시스템 전체, 전자신문) / 385억(FDS+보이스피싱 전체, 아시아에이) / 2025년 358억(셀카 AI 인증 포함, 머니S)
- 카뱅 → 시중은행 → 토스 순으로 AI FDS 확대

> ⚠ 정정: "GNN 기반 + 보이스피싱 60% 감소" 는 출처 미확인 → 카뱅 공식 발표 기준으로 정정.

**책 Ch4에서 본격 다룸**.

### 3. 고객 서비스 — §1.5.3

#### 3.1 4가지 AI 활용

| 영역 | 대표 사례 | 핵심 기술 |
|------|---------|----------|
| 챗봇/AI 비서 | 웰스파고 Fargo | LLM (Google PaLM) |
| 추천 시스템 | JP모건 추천 | Collaborative Filtering + ML |
| 고객 여정 | BoA Erica | Customer Journey ML |
| 상품 마케팅 | AmEx 추천 | Behavior Analytics |

#### 3.2 BCG 조사 — 고객이 원하는 은행

"은행이 어떤 모습으로 나를 대하길 원하나요?"

<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">고객이 원하는 은행의 모습 (BCG Retail Banking Survey)</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <text x="280" y="65" text-anchor="end" fill="#1c1917">🛒 아마존처럼</text>
    <rect x="290" y="53" width="296" height="20" fill="#c4724e"/>
    <text x="600" y="67" font-weight="700">37%</text>
    <text x="280" y="95" text-anchor="end" fill="#1c1917">🤵 개인 비서처럼</text>
    <rect x="290" y="83" width="232" height="20" fill="#5a7a96"/>
    <text x="535" y="97" font-weight="700">29%</text>
    <text x="280" y="125" text-anchor="end" fill="#1c1917">🏪 슈퍼마켓처럼</text>
    <rect x="290" y="113" width="128" height="20" fill="#3a7d44"/>
    <text x="430" y="127" font-weight="700">16%</text>
    <text x="280" y="155" text-anchor="end" fill="#1c1917">🩺 의사/치과처럼</text>
    <rect x="290" y="143" width="88" height="20" fill="#7a6a9a"/>
    <text x="390" y="157" font-weight="700">11%</text>
    <text x="280" y="185" text-anchor="end" fill="#1c1917">🏋 피트니스처럼</text>
    <rect x="290" y="173" width="48" height="20" fill="#8a6d2c"/>
    <text x="350" y="187" font-weight="700">6%</text>
  </g>
  <text x="360" y="230" text-anchor="middle" font-size="12" font-weight="700" fill="#1c1917">합계 66%가 "이커머스 스타일" (아마존 + 개인 비서)을 원한다</text>
  <text x="360" y="250" text-anchor="middle" font-size="11" font-style="italic" fill="#57534e">→ 은행의 디지털 전환 방향: AI 기반 개인화 서비스</text>
</svg>

#### 3.3 한국 사례

| 은행 | 챗봇 이름 | 특징 |
|------|---------|------|
| KB | Liiv Next AI 금융비서 | 자체 + 외부 LLM |
| 신한 | "오로라(Aurora)" (2018~) | SOL 슈퍼앱 내 챗봇 |
| 하나 | AI 컨택센터 | 음성 인식 + LLM |
| 카카오뱅크 | OpenAI API + 사내 RAG | UX 우선 |
| 토스 | Toss AI 챗봇 (2025~ 도입) | LLM 기반 |

> ⚠ 정정: 초기 작성본의 "쏠챗봇", "STA" 등은 확인되지 않은 명칭. 위는 공개 자료 기준.

**책 Ch6 (생성형 AI)에서 챗봇/RAG 본격 다룸**.

### 4. 투자와 트레이딩 — §1.5.4

#### 4.1 로보어드바이저 시장

한국 로보어드바이저 시장 (코스콤 테스트베드 기준):

```
2017: 3000억
2020: 1.5조
2023: 8조
2025E: 30조 (예상)
```

**주요 플랫폼**:
- 미국: Betterment, Wealthfront, Vanguard PAS
- 한국: AIM, FOUNT, 핀트, 두물머리 불릴레오

#### 4.2 4가지 AI 활용

| 활용 | 기술 | 사례 |
|------|------|------|
| 포트폴리오 자동 구성 | MPT + ML | Betterment |
| 시장 예측 | LSTM, Transformer | 헤지펀드 |
| 고빈도 거래 (HFT) | RL, 강화학습 | Renaissance, Citadel |
| 감성 분석 | NLP (LLM) | Bloomberg AI |

#### 4.3 한국 사례
- **삼성자산운용 KODEX AI** — 자동 리밸런싱
- **미래에셋 AI ETF** — ML 기반 종목 선정
- **트레디다 (구 마이번스)** — LSTM 기반 가격 예측

**책 Ch2에서 본격 다룸** (실습 1: 전통 퀀트, 실습 2: ML, 실습 3: DL).

### 5. 준법 감시와 규제 (RegTech) — §1.5.5

#### 5.1 6가지 RegTech 응용

| 응용 | 영문 | 사례 |
|------|------|------|
| 자동 규제 보고 | Regulatory Reporting Automation | 매일 금감원 보고 자동화 |
| AML | Anti-Money Laundering | 자금세탁 의심거래 탐지 |
| KYC | Know Your Customer | 신원 확인 자동화 |
| 거래 감시 | Trade Surveillance | 시장조작/내부거래 탐지 |
| 규제 변화 예측 | Predictive Analytics | 새 법령 영향 분석 |
| 컴플라이언스 | Compliance Monitoring | 임직원 행동 감시 |

#### 5.2 AML/KYC가 가장 큰 영역

**시장 규모** (Markets and Markets 2023):
- 전 세계 AML 솔루션: $2.5B (3.3조원)
- 연 성장률 14.5%

**주요 회사**:
- SAS Institute (AML 솔루션 1위)
- Oracle Financial Services
- 한국: 더존비즈온, 마이크로프 솔루션

#### 5.3 KYC AI의 작동 원리

```
신규 가입 신청
   ↓
신분증 사진 업로드 → OCR (Computer Vision)
   ↓
얼굴 인식 (Liveness Detection)
   ↓
정보 검증 (외부 DB 조회)
   ↓
위험 점수 계산 (ML)
   ↓
승인/검토/거절
```

#### 5.4 한국 사례
- **금융결제원 오픈뱅킹** — KYC 표준화
- **금감원 RegTech 가이드라인** (2024)

**책 Ch4 (사기 탐지) 및 Ch5 (MLOps)에서 부분적으로 다룸**.

### 6. 프로세스 자동화 — §1.5.6

#### 6.1 RPA + AI = 하이퍼오토메이션

```
[기존 RPA]                        [하이퍼오토메이션]
규칙 기반 자동화                AI + RPA + ML
사람이 정한 절차 반복             지능적 판단 + 자동화
"같은 일 1000번 반복"           "다른 케이스도 학습해서 처리"
   |                                |
   v                                v
단순 데이터 이동                  복잡 의사결정
양식 작성 자동화                  보험 청구 자동 심사
```

#### 6.2 보험 클레임 자동화 사례

**문제**: 자동차 사고 보험금 청구
- 기존: 사고 사진 → 조사관 출동 → 견적 → 보험금 결정 (며칠~몇주)
- AI: 사고 사진 → CV로 손상 부위 인식 → 가격 모델 → 자동 견적 (1시간~1일)

**기술 스택**:
- Computer Vision (손상 인식): CNN, Mask R-CNN
- 가격 모델: XGBoost (수리비 예측)
- 사기 탐지: Anomaly Detection (가짜 청구 검출)
- 챗봇: LLM (고객 안내)

#### 6.3 한국 사례
- **삼성화재 Claim AI** — 자동차 보험
- **현대해상 다이렉트** — 다이렉트 자동 견적
- **DB손보** — 화재 보험 자동 심사

**책 Ch5 (MLOps) 및 Ch6 (LLM)에서 부분적으로 다룸**.

> ✅ **여기까지 따라왔으면**: 금융 AI 6 Pillars 각각의 대표 사례와 기술이 머릿속에 정리됐을 것이다.

---

## 🔴 [고급] — 영문 용어와 책의 한계

### 1. 영문 용어 보강

#### 1.1 신용 평가
- **Credit Scoring**: 신용평가
- **Credit Decisioning**: 대출 승인/거절 자동화
- **Alternative Data**: 대체 데이터
- **Open Banking Data**: 오픈뱅킹 데이터 (한국 마이데이터)
- **Behavioral Scoring**: 행동 점수
- **Application Scoring**: 신청 점수
- **Behavioral Underwriting**: 행동 기반 언더라이팅

#### 1.2 사기 탐지
- **FDS (Fraud Detection System)**
- **FDP (Fraud Detection and Prevention)**
- **AML (Anti-Money Laundering)**
- **CTR (Currency Transaction Report)**: 1만달러 이상 현금 거래 신고
- **SAR (Suspicious Activity Report)**: 의심 거래 보고
- **Account Takeover (ATO)**: 계정 탈취
- **Card Not Present (CNP) Fraud**: 비대면 카드 사기
- **Synthetic Identity Fraud**: 가공 신원 사기

#### 1.3 고객 서비스
- **CRM (Customer Relationship Management)**
- **CDP (Customer Data Platform)**
- **Personalization Engine**
- **Conversational AI**
- **NPS (Net Promoter Score)**
- **CSAT (Customer Satisfaction Score)**
- **Journey Orchestration**

#### 1.4 투자/트레이딩
- **Robo-Advisor**: 로보어드바이저
- **Algorithmic Trading**: 알고리즘 거래
- **HFT (High-Frequency Trading)**: 고빈도 거래
- **Smart Beta**: 스마트 베타
- **Quantitative Strategy**: 정량 전략
- **Alpha Generation**: 알파 창출
- **Risk Parity**: 리스크 패리티

#### 1.5 RegTech
- **SupTech (Supervisory Technology)**: 감독 기술 (규제 기관의 AI)
- **InsurTech**: 인슈어테크
- **WealthTech**: 자산관리 핀테크
- **LegalTech**: 법률 기술
- **PSD2** (EU): 결제 서비스 지침 2 — 오픈뱅킹 강제

### 2. 책 §1.5의 한계 7가지

#### 한계 ①: 6 영역 분류의 자의성
책 본문도 인정: "이는 업계 표준이 아니라 책의 편의를 위한 선택." → **Capgemini, KPMG 등 컨설팅사 분류와 다름**.

대안 분류:
- **Capgemini (2024)**: 4 영역 (Retail Banking, Wealth, Insurance, Capital Markets)
- **WEF (2018)**: 5 영역 (Payments, Insurance, Deposits & Lending, Capital Raising, Investment Management, Market Provisioning)

#### 한계 ②: 영역 간 중첩 미설명
사기 탐지 ⊂ 리스크 관리, AML ⊂ 사기 탐지 + 규제. 책은 이런 중첩을 안 그림.

#### 한계 ③: 한국 사례 부재
모든 사례가 미국(웰스파고, JP모건, BoA, AmEx) + 중국(알리페이) + 글로벌(페이팔, 비자) 중심. **한국 카뱅, 토스, KB, 신한 사례 거의 없음**.

#### 한계 ④: 비용/ROI 정량 분석 부재
사례 소개만 있고 "AI 도입 후 얼마나 절약했는지", "어떤 KPI가 얼마나 개선됐는지" 수치가 거의 없음.

#### 한계 ⑤: 윤리/차별 이슈 미언급 (§1.7로 미룸)
신용평가 AI의 차별 (Apple Card 사건), 사기탐지의 인종 편향, RegTech의 권리 침해 등 다루지 않음.

#### 한계 ⑥: 실패 사례 없음
모두 성공 사례. 실제로는 많은 도입 시도가 실패함:
- Citigroup AI 트레이딩 (2017 폐지)
- Wells Fargo Personalization Failure (2021 GDPR 위반)
- LTCM (1998 폭망) — AI 아니지만 모델 신뢰의 위험

#### 한계 ⑦: 6 영역 외 분야 누락
- **ESG (Environmental, Social, Governance)** — 책 표 1-2엔 있지만 §1.5엔 없음
- **Climate Risk** — 점점 중요해지는 분야
- **Cybersecurity AI** — 금융 보안 핵심

### 3. 글로벌 금융 AI 도입 사례 — 책 외 50선

#### 3.1 미국
- Capital One — Eno 챗봇 + AI 마케팅
- Square (Block) — Cash App 결제 + 사기 탐지
- Stripe — Radar (사기 탐지)
- Plaid — Open Banking API
- Robinhood — 알고리즘 트레이딩

#### 3.2 유럽
- Revolut — 멀티 통화 + AI 추천
- N26 — 독일 인터넷전문은행
- Klarna — BNPL + 신용평가
- Adyen — 결제 + 사기 탐지

#### 3.3 중국
- Ant Group (Alipay) — 알파리스크
- WeBank (Tencent) — 인터넷전문은행
- JD Finance — 신용평가
- DiDi Pay — 모빌리티 결제

#### 3.4 인도
- Paytm — 결제 + 신용평가
- PhonePe — 결제 슈퍼앱
- Razorpay — B2B 결제 + AI
- LendingKart — SME 대출

#### 3.5 동남아
- Grab Financial — 동남아 슈퍼앱
- Sea Group (Shopee Pay)
- GoTo Financial

---

## 🟣 [전공자] — 1차 자료와 수식

### 1. 신용평가 핵심 지표 — KS·Gini·AUC

#### 1.1 KS (Kolmogorov-Smirnov)

신용평가 모델의 표준 지표:

$$ KS = \max_t |F_{good}(t) - F_{bad}(t)| $$

- $F_{good}(t)$: 정상 차주의 점수 누적분포
- $F_{bad}(t)$: 부도 차주의 점수 누적분포

**해석**:
- KS = 0: 모델 무의미
- KS = 0.3: 일반적 신용평가
- KS = 0.4: 좋은 모델
- KS = 0.5+: 매우 좋은 모델 (XGBoost 평균)

#### 1.2 Gini Coefficient

$$ \text{Gini} = 2 \cdot \text{AUC} - 1 $$

AUC와 1:1 변환. 한국에서 더 많이 쓰임.

#### 1.3 IV (Information Value)

피처 선택용:

$$ IV = \sum_i (P_{good,i} - P_{bad,i}) \cdot \ln\frac{P_{good,i}}{P_{bad,i}} $$

- IV < 0.02: 약함
- 0.02 ≤ IV < 0.1: 중간
- 0.1 ≤ IV < 0.3: 강함
- IV ≥ 0.3: 매우 강함

> 📄 Siddiqi, N. (2017). *Intelligent Credit Scoring: Building and Implementing Better Credit Risk Scorecards* (2nd ed.). Wiley.

### 2. 사기 탐지 핵심 지표 — Precision/Recall

#### 2.1 왜 Accuracy가 의미 없는가

사기율 0.1% 상황:
- 모든 거래를 "정상"이라 예측 → Accuracy = 99.9% (그러나 사기를 하나도 못 잡음)
- → **PR-AUC** (Precision-Recall Area Under Curve) 필수

#### 2.2 핵심 지표

$$ \text{Precision} = \frac{TP}{TP + FP} \quad \text{(사기로 판정 중 진짜 사기 비율)} $$

$$ \text{Recall} = \frac{TP}{TP + FN} \quad \text{(전체 사기 중 잡은 비율)} $$

$$ F_1 = \frac{2 \cdot P \cdot R}{P + R} $$

**금융 사기 모델 표준 목표**:
- Precision @ 10%: 90%+ (상위 10% 의심 거래 중 90%가 진짜)
- Recall @ 1% FPR: 80%+ (False Positive 1% 허용 시 80% 사기 잡음)

> 📄 Bhattacharyya, S., Jha, S., Tharakunnel, K., & Westland, J. C. (2011). Data mining for credit card fraud: A comparative study. *Decision Support Systems*, 50(3), 602–613.

### 3. 알리페이 알파리스크의 학술적 분석

#### 3.1 Ant Group의 공개 논문

Ant Group은 일부 기술을 공개. 알려진 내용:
- **그래프 신경망**: 거래 네트워크 분석
- **시계열 모델 (LSTM, Transformer)**: 사용자 행동 학습
- **연합 학습**: 여러 자회사 데이터 결합 (개인정보 보호)

> 📄 Wang, D., et al. (2019). A Semi-supervised Graph Attentive Network for Financial Fraud Detection. *IEEE ICDM*.

#### 3.2 Defense in Depth

알파리스크의 5단계 방어:
1. Pre-transaction: 디바이스/네트워크 검증
2. Authentication: 다중 인증
3. Real-time scoring: ML 모델
4. Post-transaction: 사후 분석
5. Recovery: 사기 발생 시 복원

### 4. 로보어드바이저 — 학술적 배경

#### 4.1 Modern Portfolio Theory (Markowitz 1952)

평균-분산 최적화:

$$ \min_{w} \frac{1}{2} w^T \Sigma w \quad \text{s.t.} \quad w^T \mu \geq \mu_0, \quad w^T \mathbf{1} = 1 $$

- $w$: 자산 비중 벡터
- $\mu$: 기대수익률 벡터
- $\Sigma$: 공분산 행렬

#### 4.2 CAPM (Sharpe 1964)

$$ E[r_i] = r_f + \beta_i (E[r_M] - r_f) $$

#### 4.3 Black-Litterman (1992)

베이지안 관점: 시장 균형 + 투자자 견해.

#### 4.4 로보어드바이저의 핵심
대부분 Markowitz MPT + 시장 인덱스 ETF 조합. **AI는 리밸런싱 자동화** 가 핵심.

> 📄 Markowitz, H. (1952). Portfolio selection. *Journal of Finance*, 7(1), 77–91.
> 📄 Black, F., & Litterman, R. (1992). Global portfolio optimization. *Financial Analysts Journal*, 48(5), 28–43.

### 5. RegTech — 학술 자료

#### 5.1 BIS (2018)
> "*The use of new technologies to facilitate regulatory compliance — RegTech — is expanding rapidly.*"
> — BIS. (2018). *Sound Practices: Implications of fintech developments for banks and bank supervisors*.

#### 5.2 SupTech의 부상
규제기관도 AI 사용. 예: 한국 금감원의 AI 기반 위험은행 모니터링.

> 📄 FSB. (2020). *The Use of Supervisory and Regulatory Technology by Authorities and Regulated Institutions*.

### 6. 프로세스 자동화 — 학술

#### 6.1 RPA의 한계

> "*RPA is limited to rule-based, repetitive tasks. Hyperautomation extends RPA with AI/ML to handle judgement-based decisions.*"
> — Gartner. (2020). *Hyperautomation Glossary*.

#### 6.2 보험 클레임 AI 사례 연구
- **Lemonade (미국)**: AI 챗봇 Jim으로 보험 가입 + 청구 (세계 기록 3초 청구 처리는 2016.12 단일 사례; 평균이 아닌 "최고 기록"이며 약 40% 청구가 즉시 자동 처리됨)
- **ZhongAn (중국)**: AI 기반 인터넷 보험
- 한국 캐롯손해보험: UBI (운전 데이터) + 클레임 AI

> 📄 Eling, M., & Lehmann, M. (2018). The impact of digitalization on the insurance value chain. *Geneva Papers on Risk and Insurance*, 43(3).

---

### 🟣 [전공자 심화] — FDS/RegTech 학술 동향과 후속 연구

> 💭 본 절은 사기 탐지(FDS)와 RegTech를 산업 사례 중심으로 다뤘다. 학술적으로는 **Bhattacharyya(2011)·Phua(2010) 2개 논문이 출발점**이고, 이후 10년간 컴퓨테이셔널 인텔리전스·딥러닝·GNN 시대로 확장되었다.

#### 1. 출발점 논문 — 한계 정리

**Bhattacharyya, Jha, Tharakunnel, & Westland (2011)** — Data mining for credit card fraud: A comparative study. *Decision Support Systems*, 50(3), 602–613. [DOI: 10.1016/j.dss.2010.08.008](https://doi.org/10.1016/j.dss.2010.08.008)
- **공헌**: 실제 국제 카드사 2006~2007 데이터로 RF·SVM·LR 비교. 5% depth에서 RF가 사기의 약 90%를 식별.
- **한계 ①**: 단일 카드사 단일 시기 데이터 → 일반화 한계.
- **한계 ②**: 클래스 불균형(<1% 사기율) 처리 단순 (under-sampling만).
- **한계 ③**: 시간 변화(concept drift) 미고려 — 사기범도 모델에 적응.
- **한계 ④**: 비용 비대칭(FP cost ≠ FN cost) 손실함수 미사용 — 단순 AUC만 사용.
- **한계 ⑤**: 딥러닝·앙상블·그래프 기반 방법 등장 전.

**Phua, Lee, Smith-Miles, & Gayler (2010)** — A comprehensive survey of data mining-based fraud detection research. [arXiv:1009.6119](https://arxiv.org/abs/1009.6119)
- **공헌**: 2000년대 사기 탐지 연구를 체계적으로 분류. 지도학습/비지도학습/하이브리드 매핑.
- **한계 ①**: 2010년 발표 → **딥러닝·GAN·트랜스포머 미반영**.
- **한계 ②**: 산업 사례(알리페이·페이팔 등) 미포함.
- **한계 ③**: 데이터 공개 부족 한계만 지적, 합성 데이터(SMOTE 변형, CTGAN) 미제안.
- **한계 ④**: 적대적 공격(adversarial attack) 관점 부재.

#### 2. 비판·확장 문헌

- **West, J., & Bhattacharya, M. (2016)**. Intelligent financial fraud detection: A comprehensive review. *Computers & Security*, 57, 47–66. [DOI: 10.1016/j.cose.2015.09.005](https://doi.org/10.1016/j.cose.2015.09.005) · [arXiv:1510.07165 (확장판)](https://arxiv.org/abs/1510.07165)
  - 50여 편(2004~2014) 리뷰. CI(Computational Intelligence) 기반 방법 비교.
  - **핵심 비판**: 대부분 연구가 **공개 데이터 부재**, **모델 평가 비표준화**, **실시간 처리 미고려**.

- **Pourhabibi, T., Ong, K.-L., Kam, B. H., & Boo, Y. L. (2020)**. Fraud detection: A systematic literature review of graph-based anomaly detection approaches. *Decision Support Systems*, 133, 113303. [DOI: 10.1016/j.dss.2020.113303](https://doi.org/10.1016/j.dss.2020.113303) — 그래프 신경망(GNN) 기반 사기 탐지 메타분석.

- **Ali, A., Abd Razak, S., Othman, S. H., et al. (2022)**. Financial fraud detection based on machine learning: A systematic literature review. *Applied Sciences*, 12(19), 9637. [DOI: 10.3390/app12199637](https://doi.org/10.3390/app12199637) — 최근 10년 ML 사기 탐지 SLR.

#### 3. 후속 연구 동향 (2020~)

- **Hilal, W., Gadsden, S. A., & Yawney, J. (2022)**. Financial fraud: A review of anomaly detection techniques and recent advances. *Expert Systems with Applications*, 193, 116429. [DOI: 10.1016/j.eswa.2021.116429](https://doi.org/10.1016/j.eswa.2021.116429)
  - (정정: 사용자가 언급한 *Information Systems*가 아니라 **Expert Systems with Applications**에 게재.)
  - 핵심: **지도학습이 여전히 주류**, 비지도·딥러닝·강화학습·반지도학습은 부수적.
  - 추세: 오토인코더, isolation forest, GAN 기반 합성 데이터.

- **그래프 신경망 FDS 응용**: Wang, J., et al. (2021). A semi-supervised graph attentive network for financial fraud detection. *ICDM 2021*. — 거래 네트워크를 그래프로 모델링.
- **연합학습(Federated Learning) 사기 탐지**: Yang, W., et al. (2019). FFD: A federated learning based method for credit card fraud detection. *Big Data – BigData 2019*. — 은행 간 데이터 공유 없이 협업 학습.
- **LLM + RegTech**: Chen, B., et al. (2024). When large language models meet personalization. — KYC/AML 문서 자동 분석.

#### 4. RegTech 학술 동향

- **Arner, D. W., Barberis, J. N., & Buckley, R. P. (2017)**. FinTech, RegTech, and the reconceptualization of financial regulation. *Northwestern Journal of International Law & Business*, 37(3), 371–413. — RegTech 학술 정의 출발점.
- **Anagnostopoulos, I. (2018)**. Fintech and regtech: Impact on regulators and banks. *Journal of Economics and Business*, 100, 7–25.
- **Butler, T., & O'Brien, L. (2019)**. Understanding RegTech for digital regulatory compliance. — 컴플라이언스 자동화 사례 연구.

#### 5. 한국 적용 시 주의점

1. **공개 데이터 부재**: 한국 금융사 거래 데이터는 신용정보법 §32에 따라 외부 공개 거의 불가 → **국내 학술 FDS 연구는 Kaggle IEEE-CIS·European 카드 데이터에 의존**.
2. **금융보안원 합성 데이터 플랫폼 (2022~)**: 한국형 우회로. 단, 실제 사기 패턴 재현도가 제한적 → 학술 연구·벤치마크 용도.
3. **K-FDS 표준 미정립**: 미국 SR 11-7 같은 모델 거버넌스 표준이 FDS 영역에 명시적으로 적용되지 않음. 금감원 「FDS 가이드라인」(2020)이 있으나 모델 검증 절차 모호.
4. **보이스피싱 특화**: 한국은 통신금융사기(보이스피싱) 비중이 글로벌 평균 대비 매우 높음 → 음성·문자 멀티모달 FDS 연구가 한국 특화 영역. 이상엽 외 (2023). 보이스피싱 탐지를 위한 BERT 기반 한국어 문자메시지 분류. *정보과학회 컴퓨팅의 실제 논문지*, 29(4).
5. **개인사업자 사기 (대포통장·작업대출)**: 한국 특유 패턴. 영어권 FDS 문헌에 거의 없음 → 한국 데이터로 연구 필요.
6. **AML 측면**: FIU(금융정보분석원) 보고 의무. 한국 SAR(의심거래보고) 데이터로 학술 연구가 사실상 불가 → 산학 협력 모델 필요.

---

## 📚 책에는 없지만 알면 좋은 것

### 🔍 보충 1 — ESG 투자 + AI

#### 책 표 1-2 ESG 12%
ESG는 미래 핵심 분야. AI 응용:
- **ESG 점수 산정**: 비정형 데이터 (뉴스, 보고서) 분석
- **그린워싱 탐지**: 가짜 ESG 주장 식별
- **기후 리스크 모델링**: 자산 가치에 미치는 영향 예측

#### 주요 도구
- MSCI ESG Ratings (전통)
- Truvalue Labs (NLP + 뉴스)
- Sustainalytics

### 🔍 보충 2 — Cybersecurity AI

금융 보안의 핵심:
- **이상 트래픽 탐지**: ML로 DDoS, 침입 감지
- **봇 감지**: 사람 vs. 봇 구분
- **취약점 자동 탐지**: ML 기반 코드 보안 검사

주요 회사: Darktrace, CrowdStrike, Palo Alto Networks.

### 🔍 보충 3 — 금융 AI 실패 사례

#### Citigroup AI 트레이딩 (2017)
- $2억 투자 후 폐기
- 이유: 시장 변동성 대응 실패 + 모델 신뢰성 부족

#### Apple Card 차별 (2019)
- 부부 신청 시 남편 한도가 아내 20배
- 원인: 학습 데이터 편향
- 결과: 뉴욕 금융감독청 조사

#### LTCM (1998)
- 노벨상 수상자들의 헤지펀드
- 수학 모델 의존 → 1998 러시아 위기로 폭망
- 교훈: **블랙 스완은 모델이 예측 못 함**

### 🔍 보충 4 — Open Source 금융 AI 라이브러리

| 라이브러리 | 분야 | 주요 기능 |
|----------|------|---------|
| **scikit-learn** | ML 전체 | 표준 ML 알고리즘 |
| **XGBoost / LightGBM** | Tree | 신용평가/사기탐지 표준 |
| **PyTorch / TensorFlow** | DL | 신경망 |
| **Hugging Face Transformers** | NLP/LLM | 사전학습 모델 |
| **OptBinning** | 신용평가 | 이산화·구간화 |
| **PyOD** | 이상치 탐지 | 사기 탐지 |
| **NetworkX** | 그래프 | 금융 네트워크 분석 |
| **QuantLib** | 파생 가격 결정 | 금융 공학 |
| **zipline / backtrader** | 백테스팅 | 알고리즘 트레이딩 |
| **FinRL** | 강화학습 | 금융 RL |

### 🔍 보충 5 — Kaggle 금융 AI 대회

학습용으로 좋은 Kaggle 대회:
- **Home Credit Default Risk** — 신용평가 (1억 행 데이터)
- **IEEE-CIS Fraud Detection** — 사기 탐지
- **Two Sigma Financial News** — 뉴스 → 주가 예측
- **JPX Tokyo Stock Exchange Prediction** — 일본 주식 예측
- **American Express - Default Prediction** — 책 Ch3 실습 데이터

→ **책의 모든 실습이 Kaggle 데이터 기반**.

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. 책의 6개 영역이 업계 표준인가?

**A.** **아니다**. 책 본문도 인정. 다른 분류:
- **WEF**: Payments, Insurance, Deposits & Lending, Capital Raising, Investment Management, Market Provisioning
- **Capgemini**: Retail Banking, Wealth Management, Insurance, Capital Markets
- **Korea FSS**: 신용평가, 사기탐지, 챗봇, RPA, 자산관리, 마이데이터

→ 모두 비슷하지만 다름. **책의 분류는 "이 책 챕터 구성"에 최적화** 된 것.

### Q2. 알리페이의 사기 손실률 0.0000064%가 정말 가능한가?

**A.** 발표 수치이긴 하지만 **검증 어려움**. 회의적 시각:
- 알리페이 자체 보고
- 어떤 사기 정의인지 불명확
- 차단된 거래는 손실에 포함 안 됨

그러나 **글로벌 최고 수준** 인 것은 분명 (한국 카드사보다 10~100배 낮음).

### Q3. 로보어드바이저가 정말 인간 운용역보다 나은가?

**A.** **장단점 있음**.

**장점**:
- 수수료 낮음 (인간 0.5~2% → 로보 0.1~0.5%)
- 24/7 운영
- 감정 배제

**단점**:
- 시장 급변 시 (코로나, 우크라이나 전쟁) 자동 매도 → 손실 확정
- 인간 같은 직관 부재
- 모두 비슷한 알고리즘 → 결과 비슷해짐

**결론**: 보수적 장기 투자엔 좋음. 단기/전술 운용엔 인간 필요.

### Q4. KYC AI가 그렇게 정확한가?

**A.** **90~95% 자동 처리, 5~10%는 사람 검증**.

자동 가능:
- 신분증 OCR 95%
- 얼굴 인식 99%
- 단순 위험 점수 95%

수동 필요:
- 외국인 (특수 국가)
- PEP (Politically Exposed Person)
- 고위험 거래 패턴

### Q5. RegTech 시장이 그렇게 큰가?

**A.** **빠르게 성장 중**. Markets and Markets (2024):
- 2024: $13.5B (18조원)
- 2030: $44B (60조원)
- 연 21% 성장

한국은 글로벌 평균보다 작지만 빠르게 성장 중 (금감원이 2024 RegTech 가이드라인 발표).

### Q6. 클레임 AI가 사람 일자리 다 빼앗나?

**A.** **단순 클레임은 그렇지만, 복잡 클레임은 사람 필요**.

자동 처리 가능 (60~70%):
- 자동차 단순 사고
- 의료비 청구 (영수증 OCR)
- 분실 신고

여전히 사람 필요 (30~40%):
- 대형 사고 (사망, 중상)
- 사기 의심
- 분쟁 사례

### Q7. 6개 영역 외에 미래 분야는?

**A.**

- **ESG/Climate**: 책 표 1-2엔 12%지만 빠르게 성장
- **CBDC**: 중앙은행 디지털화폐
- **Embedded Finance**: 쇼핑몰/SNS에 금융 임베디드
- **Web3/DeFi**: 탈중앙 금융 (논쟁 중)
- **Quantum Computing**: 양자 컴퓨팅 금융 모델 (10년+ 미래)

---

## 🎯 이 절에서 가져갈 핵심 8가지

1. **금융 AI = 6 Pillars** (신용평가·사기탐지·고객서비스·투자트레이딩·준법감시·프로세스자동화).
2. **이 6개가 책 Ch2~Ch6 챕터 구성과 1:1 매핑**.
3. **신용평가 트렌드**: 전통 데이터 → **대체 데이터(소셜, 위치, 통신)** 결합.
4. **사기 탐지가 가장 큰 단일 시장** ($260억 → 2026년 $780억).
5. **알리페이 알파리스크**: 글로벌 최고 사기 탐지 (1천만 건 중 0.64건 사기).
6. **고객 서비스 미래**: 66%의 고객이 "아마존/개인비서 스타일"을 원함 → AI 개인화 필수.
7. **로보어드바이저**가 한국에서 폭발 성장 (2023 8조 → 2025E 30조).
8. **RegTech/AML**이 규제 강화로 빠르게 성장 (연 21%).

---

## 📖 더 읽을거리

### 금융 AI 전반
- López de Prado, M. (2018). *Advances in Financial Machine Learning*. Wiley.
- Dixon, M. F., Halperin, I., & Bilokon, P. (2020). *Machine Learning in Finance*. Springer.

### 신용평가 (Ch3 사전)
- Siddiqi, N. (2017). *Intelligent Credit Scoring* (2nd ed.). Wiley. — **신용평가 표준 교과서**.
- Thomas, L. C. (2009). *Consumer Credit Models*. Oxford UP.

### 사기 탐지 (Ch4 사전)
- Phua, C., Lee, V., Smith, K., & Gayler, R. (2010). A comprehensive survey of data mining-based fraud detection research. arXiv:1009.6119.

### 알고리즘 트레이딩 (Ch2 사전)
- Chan, E. P. (2017). *Machine Trading*. Wiley.
- Aldridge, I. (2013). *High-Frequency Trading*. Wiley.

### 로보어드바이저
- Sironi, P. (2016). *FinTech Innovation: From Robo-Advisors to Goal Based Investing*. Wiley.

### RegTech
- Arner, D. W., Barberis, J. N., & Buckley, R. P. (2017). FinTech, RegTech, and the reconceptualization of financial regulation. *Northwestern Journal of International Law & Business*, 37, 371.

### 보험 + AI
- Eling, M., & Lehmann, M. (2018). The impact of digitalization on the insurance value chain. *Geneva Papers on Risk and Insurance*, 43(3).

### Kaggle 학습
- Home Credit Default Risk
- IEEE-CIS Fraud Detection
- American Express - Default Prediction (책 Ch3 실습 데이터)
- Two Sigma Financial News

---

## 📋 검증 노트 / 변경 이력

| # | 항목 | 초기 작성본 | 수정 내용 | 1차 출처 |
|---|---|---|---|---|
| 1 | 알리페이 응답 시간 | "0.05초" 단정 | 100ms 안에 판정 (Alipay 공식 수치 비공개; 0.05초는 카드 결제 일반 처리시간 기준) | [Alipay 2020 PR](https://www.businesswire.com/news/home/20200514005941/en/) |
| 2 | 알리페이 LLM 2023 도입 | "2023년 LLM 도입" | 공식 출처 미확인; AlphaRisk 마지막 공식 마일스톤은 2020년 5세대 enhanced | 同上 |
| 3 | Lemonade 청구 처리 | "평균 3초" | **세계 기록 3초 (2016.12 단일 사례)**; 평균이 아닌 최고 기록, 약 40% 청구가 즉시 자동 처리 | [Lemonade Blog](https://www.lemonade.com/blog/lemonade-sets-new-world-record/) |
| 4 | 카뱅 사기 예방 수치 | "2024년 123~385억" | 2023년 시스템별: 87.7억(머신러닝)/123억(AI 전체)/385억(FDS+보이스피싱); 2025년 358억 | [카카오 금융안전보고서](https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/esg/report/2023KakaoFinancialSafetyReport.pdf) |
| 5 | KB GENIE / 신한 쏠챗봇 | "KB GENIE / 신한 쏠챗봇" | **KB Liiv Next AI 금융비서 / 신한 "오로라(Aurora)" (2018.12 출시)** | [ZDNet 2018.12.26](https://zdnet.co.kr/view/?no=20181226105927) |
| 6 | 토스 TS Score | "TS Score" | **TSS (Toss Scoring System)** | 토스 공식 |

---

> **다음 절 예고** — §1.6 금융 AI 핵심 문제 정의
> 본 절에서 본 6 Pillars를 어떻게 **AI 문제로 정의(problem statement)** 하는지 본다. Oliver Wyman Global FinTech Hackathon 2023의 16개 문제를 풀이.
