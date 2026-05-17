# 1.2 금융을 다루는 기관들 — *Financial Institutions*

> **원서 위치**: 김태헌, 《금융 AI의 이해》(제이펍, 2024), §1.2 (pp.4–6)
> **원서 분량**: 약 3쪽 (기관별 1~2문단씩) · **해설 분량**: 약 30쪽
> **읽는 데 걸리는 시간**: 약 50분

---

## 🪧 이 절을 한 줄로

> 한국에는 **7가지 유형의 금융기관**이 있고, 각 기관은 §1.1의 **6가지 금융 기능** 중 일부를 맡는다.
> AI는 각 기관의 **데이터 특성에 따라 다른 방식**으로 들어간다.

책은 7가지 기관을 1문단씩 정의하고 끝낸다. 이 해설집은:
1. 각 기관이 **Merton-Bodie 6기능 중 무엇을 하는지** 매핑하고,
2. **어떤 데이터를 다루는지**,
3. **AI가 어떻게 들어가는지**,
4. **한국과 해외가 어떻게 다른지**를 본다.

### 📍 미리 그릴 큰 그림 — 한국 금융기관 전체 지도

<svg viewBox="0 0 760 460" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">한국 금융기관 7종 — 규제기관과 기능별 분포</text>
  <!-- Top: regulators -->
  <rect x="280" y="45" width="200" height="50" rx="6" fill="#1c1917" stroke="#1c1917"/>
  <text x="380" y="68" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">금융위원회 (FSC)</text>
  <text x="380" y="85" text-anchor="middle" font-size="10" fill="#fff">정책 + 인허가</text>
  <rect x="40" y="45" width="200" height="50" rx="6" fill="#5a7a96" stroke="#5a7a96"/>
  <text x="140" y="68" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">한국은행 (BOK)</text>
  <text x="140" y="85" text-anchor="middle" font-size="10" fill="#fff">통화 + 결제</text>
  <rect x="520" y="45" width="200" height="50" rx="6" fill="#7a6a9a" stroke="#7a6a9a"/>
  <text x="620" y="68" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">금융감독원 (FSS)</text>
  <text x="620" y="85" text-anchor="middle" font-size="10" fill="#fff">감독 + 검사</text>
  <!-- Divider -->
  <line x1="20" y1="115" x2="740" y2="115" stroke="#d6d3d1" stroke-width="1" stroke-dasharray="3,2"/>
  <text x="20" y="135" font-size="11" font-weight="700" fill="#57534e">▼ 7가지 금융기관 유형</text>
  <!-- 7 institutions -->
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- Row 1 -->
    <rect x="30" y="150" width="160" height="80" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="110" y="172" text-anchor="middle" font-weight="700" fill="#c4724e">① 은행 (제1금융)</text>
    <text x="110" y="190" text-anchor="middle" fill="#1c1917">예금→대출</text>
    <text x="110" y="207" text-anchor="middle" fill="#57534e">KB·신한·하나</text>
    <text x="110" y="222" text-anchor="middle" fill="#57534e">우리·기업·농협</text>
    <rect x="200" y="150" width="160" height="80" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="280" y="172" text-anchor="middle" font-weight="700" fill="#c4724e">② 비은행예금 (제2)</text>
    <text x="280" y="190" text-anchor="middle" fill="#1c1917">소규모/지역</text>
    <text x="280" y="207" text-anchor="middle" fill="#57534e">저축은행·신협</text>
    <text x="280" y="222" text-anchor="middle" fill="#57534e">새마을금고·우체국</text>
    <rect x="370" y="150" width="160" height="80" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="450" y="172" text-anchor="middle" font-weight="700" fill="#5a7a96">③ 보험회사</text>
    <text x="450" y="190" text-anchor="middle" fill="#1c1917">위험 풀링</text>
    <text x="450" y="207" text-anchor="middle" fill="#57534e">생명·손해·자동차</text>
    <text x="450" y="222" text-anchor="middle" fill="#57534e">삼성생명·교보·DB</text>
    <rect x="540" y="150" width="180" height="80" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="630" y="172" text-anchor="middle" font-weight="700" fill="#5a7a96">④ 금융투자업자</text>
    <text x="630" y="190" text-anchor="middle" fill="#1c1917">증권·자산운용</text>
    <text x="630" y="207" text-anchor="middle" fill="#57534e">미래에셋·한투·삼성증권</text>
    <text x="630" y="222" text-anchor="middle" fill="#57534e">+ 펀드매니저</text>
    <!-- Row 2 -->
    <rect x="30" y="240" width="160" height="80" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="110" y="262" text-anchor="middle" font-weight="700" fill="#3a7d44">⑤ 기타금융기관</text>
    <text x="110" y="280" text-anchor="middle" fill="#1c1917">카드·신용정보</text>
    <text x="110" y="297" text-anchor="middle" fill="#57534e">신한카드·NICE</text>
    <text x="110" y="312" text-anchor="middle" fill="#57534e">KCB·삼성카드</text>
    <rect x="200" y="240" width="160" height="80" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="280" y="262" text-anchor="middle" font-weight="700" fill="#3a7d44">⑥ 공적금융기관</text>
    <text x="280" y="280" text-anchor="middle" fill="#1c1917">정책 지원</text>
    <text x="280" y="297" text-anchor="middle" fill="#57534e">수출입은행·산업은행</text>
    <text x="280" y="312" text-anchor="middle" fill="#57534e">주택금융공사·신보</text>
    <rect x="370" y="240" width="350" height="80" rx="6" fill="#f5e6f0" stroke="#7a6a9a" stroke-width="2"/>
    <text x="545" y="262" text-anchor="middle" font-weight="700" fill="#7a6a9a">⑦ 핀테크 (FinTech)</text>
    <text x="545" y="280" text-anchor="middle" fill="#1c1917">기술 기반 신규 금융</text>
    <text x="545" y="297" text-anchor="middle" fill="#57534e">토스·카뱅·카페이·네페이·뱅크샐러드</text>
    <text x="545" y="312" text-anchor="middle" fill="#7a6a9a" font-style="italic">기존 7유형 경계를 흐림</text>
  </g>
  <!-- Bottom: AI applications -->
  <line x1="20" y1="340" x2="740" y2="340" stroke="#d6d3d1" stroke-width="1" stroke-dasharray="3,2"/>
  <text x="20" y="360" font-size="11" font-weight="700" fill="#57534e">▼ 각 기관의 대표 AI 응용</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="10">
    <text x="110" y="385" text-anchor="middle" fill="#1c1917">신용평가·이상거래</text>
    <text x="280" y="385" text-anchor="middle" fill="#1c1917">소상공인 평가</text>
    <text x="450" y="385" text-anchor="middle" fill="#1c1917">언더라이팅·청구심사</text>
    <text x="630" y="385" text-anchor="middle" fill="#1c1917">알고리즘 트레이딩·로보어드바이저</text>
    <text x="110" y="420" text-anchor="middle" fill="#1c1917">사기 탐지 (FDS)</text>
    <text x="280" y="420" text-anchor="middle" fill="#1c1917">정책 적격성 판정</text>
    <text x="545" y="420" text-anchor="middle" fill="#1c1917">대체 데이터 기반 모든 영역 (LLM 챗봇·간편 KYC)</text>
  </g>
</svg>

> 💬 책의 §1.2 그림(1-1)은 **기관 이름만 나열**한다. 이 그림은 거기에 **규제기관(상단)** + **AI 응용(하단)** 까지 같이 본다. 이 절을 다 읽으면 이 그림이 머릿속에 박힌다.

---

## 🟢 [초급] — 일상 비유로 잡는 감

### 💭 시작하기 전에 — 왜 7가지를 다 알아야 하나?

너가 평소에 쓰는 금융 서비스를 떠올려보자:

- **월급 받기** → 은행 (KB)
- **카드 결제** → 카드사 (신한카드)
- **주식 사기** → 증권사 (미래에셋)
- **자동차 보험** → 보험사 (삼성화재)
- **간편 송금** → 핀테크 (토스)

이미 4~5개의 다른 금융기관과 거래 중이다. **각각이 왜 분리돼 있는지** 알면 한국 금융 전체가 보인다. 그리고 **AI가 각 기관에 어떻게 들어가는지**도 보인다 — 이게 이 책 전체의 무대 설정이다.

### 1. 각 기관을 한 줄 비유로

| 기관 | 한 줄 비유 | 너랑 닿는 순간 |
|------|----------|--------------|
| **① 은행** | "돈 보관소 + 돈 빌려주는 곳" | 월급통장, 주택담보대출 |
| **② 비은행예금** | "동네 은행" | 새마을금고, 우체국 적금 |
| **③ 보험회사** | "위험 공동구매 모임" | 자동차보험, 실손보험 |
| **④ 증권사** | "주식 시장의 중개인" | 키움증권 앱 |
| **⑤ 기타 (카드·신용정보)** | "결제 카드 + 신용점수 매기는 곳" | 신한카드, NICE 신용등급 |
| **⑥ 공적금융** | "정부가 만든 금융" | 수출 기업 대출, 주택금융공사 |
| **⑦ 핀테크** | "앱으로 다 되는 금융" | 토스, 카뱅, 카카오페이 |

### 2. 왜 이렇게 나뉘었나? — 역사가 만든 분리

옛날엔 **은행이 다 했다**. 그런데 1929년 대공황 때 한 은행이 망하면 거기 맡긴 예금자도 다 잃고, 그 은행이 산 주식도 가치 없어지고, 보험까지 다 같이 망하는 일이 벌어졌다.

그래서 미국은 1933년 **Glass-Steagall Act** 라는 법으로 **상업은행과 투자은행(증권)** 을 강제로 분리했다. 보험과 은행의 분리는 1956년 **Bank Holding Company Act** 가 다뤘다. 한국도 비슷한 분리 체계를 따랐다.

> ⚠ 정정: 초기 작성본은 Glass-Steagall이 "은행/증권/보험" 전부 분리한 것으로 단순화했으나, 사실 1933년 Glass-Steagall은 은행/증권 분리만 다뤘고 보험은 별도 입법(1956)으로 분리됐다.

<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">왜 분리됐나? — 1929 대공황과 Glass-Steagall</text>
  <!-- Before -->
  <g>
    <rect x="40" y="60" width="280" height="180" rx="8" fill="#fff" stroke="#d6d3d1"/>
    <text x="180" y="85" text-anchor="middle" font-size="13" font-weight="700" fill="#1c1917">1929년 이전</text>
    <text x="180" y="115" text-anchor="middle" font-size="36">🏦</text>
    <text x="180" y="145" text-anchor="middle" font-size="12" fill="#1c1917">하나의 은행이 다 함</text>
    <text x="180" y="165" text-anchor="middle" font-size="11" fill="#57534e">예금 + 대출 + 주식 + 보험</text>
    <text x="180" y="195" text-anchor="middle" font-size="11" fill="#c4724e" font-weight="700">⚠ 위험 한곳에 집중</text>
    <text x="180" y="215" text-anchor="middle" font-size="10" fill="#c4724e">→ 대공황으로 연쇄 도산</text>
  </g>
  <!-- Arrow -->
  <text x="370" y="155" text-anchor="middle" font-size="14" font-weight="700" fill="#1c1917">→</text>
  <text x="370" y="180" text-anchor="middle" font-size="10" fill="#57534e">Glass-Steagall</text>
  <text x="370" y="195" text-anchor="middle" font-size="10" fill="#57534e">1933 (미국)</text>
  <!-- After -->
  <g>
    <rect x="420" y="60" width="280" height="180" rx="8" fill="#fff" stroke="#d6d3d1"/>
    <text x="560" y="85" text-anchor="middle" font-size="13" font-weight="700" fill="#1c1917">1933년 이후</text>
    <text x="560" y="115" text-anchor="middle" font-size="20">🏦 🏛 🏪 🛡</text>
    <text x="560" y="145" text-anchor="middle" font-size="12" fill="#1c1917">기능별로 분리</text>
    <text x="560" y="165" text-anchor="middle" font-size="11" fill="#57534e">은행/증권 분리 (1933) + 보험 1956</text>
    <text x="560" y="195" text-anchor="middle" font-size="11" fill="#3a7d44" font-weight="700">✓ 위험 분산</text>
    <text x="560" y="215" text-anchor="middle" font-size="10" fill="#3a7d44">→ 한 곳 망해도 나머지 안전</text>
  </g>
</svg>

> 💡 이 분리 원칙이 **2008 글로벌 금융위기 직전 미국이 완화했다** (Gramm-Leach-Bliley Act, 1999). 그러다 위기 터지고 다시 강화 (Dodd-Frank, 2010). 한국도 비슷한 흐름.

### 3. 핀테크가 이 분리를 흔든다

요즘 **토스 앱** 하나만 봐도:
- 송금 (은행 기능)
- 카드 (카드사 기능)
- 주식 (증권 기능)
- 보험 (보험사 기능)
- 신용평가 (신용정보 기능)

→ 옛날엔 5개 다른 회사에 가서 했던 일을 **한 앱**에서 한다.

이게 가능한 이유: **핀테크는 라이선스를 따로따로 받아서** 한 회사 안에서 여러 기능을 같이 한다. 토스는 토스뱅크, 토스증권, 토스인슈어런스 등 **그룹사**로 나뉘어 있다.

> ✅ **여기까지 따라왔으면**: 한국 금융이 왜 이렇게 복잡하게 나뉘어 있는지, 그리고 핀테크가 왜 그 경계를 흔드는지 보일 거다.

---

## 🟡 [중급] — 각 기관 깊이 보기

### 💭 시작하기 전에

이제 7가지 기관을 하나씩 본다. 각각:
- **무슨 일을 하나** (비즈니스 모델)
- **어떤 데이터를 다루나**
- **어떤 AI가 들어가나**
- **Merton-Bodie 6기능 중 무엇인가**

### 1. 은행 (제1금융기관) — 가장 큰 형

#### 1.1 비즈니스 모델 — Net Interest Margin

은행의 수익 = **예대마진 (NIM, Net Interest Margin)**

$$ \text{NIM} = \text{대출 이자율} - \text{예금 이자율} - \text{운영비} - \text{대손충당금} $$

2023년 한국 시중은행 평균 NIM: 약 **1.6~1.7%**.
은행이 1조원 운용하면 **약 160억 마진**.

#### 1.2 한국 주요 은행

| 구분 | 은행 | 특징 |
|------|------|------|
| 시중은행 | KB·신한·하나·우리 | 4대 은행, 자산 400조 이상 |
| 시중은행 | NH농협·IBK기업 | 정부 출자 비중 있음 |
| 인터넷전문은행 | 카카오뱅크·케이뱅크·토스뱅크 | 핀테크 출신, 오프라인 점포 없음 |
| 지방은행 | 부산·대구·경남·광주·전북·제주 | 지역 거점 |
| 외국계 | SC제일·씨티 | 글로벌 네트워크 |
| 특수은행 | 한국산업·한국수출입·NH농협·수협 | 정책 목적 |

#### 1.3 은행에서 AI가 들어가는 곳

<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">은행의 AI 응용 — 어디에 어떻게 쓰이나</text>
  <!-- Process flow -->
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- 1. KYC -->
    <rect x="20" y="60" width="140" height="90" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="90" y="82" text-anchor="middle" font-weight="700" fill="#c4724e">① 고객 가입 (KYC)</text>
    <text x="90" y="105" text-anchor="middle" fill="#1c1917">신분증 OCR</text>
    <text x="90" y="122" text-anchor="middle" fill="#1c1917">얼굴 인식</text>
    <text x="90" y="139" text-anchor="middle" fill="#57534e">→ Computer Vision</text>
    <!-- 2. Credit -->
    <rect x="180" y="60" width="140" height="90" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="250" y="82" text-anchor="middle" font-weight="700" fill="#c4724e">② 신용 평가</text>
    <text x="250" y="105" text-anchor="middle" fill="#1c1917">대출 승인/한도</text>
    <text x="250" y="122" text-anchor="middle" fill="#1c1917">금리 책정</text>
    <text x="250" y="139" text-anchor="middle" fill="#57534e">→ Ch3</text>
    <!-- 3. Fraud -->
    <rect x="340" y="60" width="140" height="90" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="410" y="82" text-anchor="middle" font-weight="700" fill="#c4724e">③ 이상거래 탐지</text>
    <text x="410" y="105" text-anchor="middle" fill="#1c1917">FDS</text>
    <text x="410" y="122" text-anchor="middle" fill="#1c1917">자금세탁 (AML)</text>
    <text x="410" y="139" text-anchor="middle" fill="#57534e">→ Ch4</text>
    <!-- 4. Chatbot -->
    <rect x="500" y="60" width="140" height="90" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="570" y="82" text-anchor="middle" font-weight="700" fill="#c4724e">④ 고객 상담</text>
    <text x="570" y="105" text-anchor="middle" fill="#1c1917">챗봇/콜봇</text>
    <text x="570" y="122" text-anchor="middle" fill="#1c1917">RAG 기반</text>
    <text x="570" y="139" text-anchor="middle" fill="#57534e">→ Ch6</text>
    <!-- Row 2 -->
    <rect x="100" y="170" width="140" height="90" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="170" y="192" text-anchor="middle" font-weight="700" fill="#5a7a96">⑤ 자산관리</text>
    <text x="170" y="215" text-anchor="middle" fill="#1c1917">로보 어드바이저</text>
    <text x="170" y="232" text-anchor="middle" fill="#1c1917">포트폴리오</text>
    <text x="170" y="249" text-anchor="middle" fill="#57534e">→ Ch2</text>
    <rect x="260" y="170" width="140" height="90" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="330" y="192" text-anchor="middle" font-weight="700" fill="#5a7a96">⑥ 마케팅</text>
    <text x="330" y="215" text-anchor="middle" fill="#1c1917">상품 추천</text>
    <text x="330" y="232" text-anchor="middle" fill="#1c1917">이탈 예측</text>
    <text x="330" y="249" text-anchor="middle" fill="#57534e">→ Ch5</text>
    <rect x="420" y="170" width="140" height="90" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="490" y="192" text-anchor="middle" font-weight="700" fill="#5a7a96">⑦ 컴플라이언스</text>
    <text x="490" y="215" text-anchor="middle" fill="#1c1917">RegTech</text>
    <text x="490" y="232" text-anchor="middle" fill="#1c1917">규정 자동 점검</text>
    <text x="490" y="249" text-anchor="middle" fill="#57534e">→ Ch6</text>
  </g>
  <text x="360" y="300" text-anchor="middle" font-size="11" font-style="italic" fill="#57534e">은행 하나에 7~10개 AI 시스템이 동시 작동한다 — 이 책의 모든 챕터가 은행 한 곳에 다 들어간다.</text>
</svg>

#### 1.4 Merton-Bodie 매핑
은행 = **③ 시간/공간 이동** (예금→대출) + ① 결제 + ⑤ 정보 제공 (신용평가).

### 2. 비은행예금취급기관 (제2금융기관) — 동네 은행

#### 2.1 왜 "비은행"인데 예금을 받나?

법적으로 **은행법(Banking Act)** 적용을 안 받는 기관들. 따로 법(상호저축은행법, 신용협동조합법 등)으로 규율.

| 기관 | 법 | 특징 |
|------|-----|------|
| 저축은행 | 상호저축은행법 | 지역·소상공인 대출 |
| 신용협동조합 | 신용협동조합법 | 직장·지역 조합 |
| 새마을금고 | 새마을금고법 | 5인 이상 조합 가입 |
| 우체국 예금 | 우정사업본부 | 전국 우체국 |
| 종합금융회사 | 자본시장법 | 단기금융 (CP 등) |

#### 2.2 이자율이 더 높은 이유

```
[은행] 안전 (예금자보호 5000만원) → 낮은 금리 (연 3%)
[저축은행] 위험 큼 (대출 부실 ↑) → 높은 금리 (연 4~5%)
```

**예금자보호한도**는 둘 다 5000만원으로 같다. 그런데 저축은행은 망할 확률이 더 높다. 그래서 더 높은 이자로 예금자를 모은다.

> ⚠️ 2011년 부산저축은행 사태: 저축은행 7곳 동시 영업정지. 5천만원 한도 초과 예금자 약 8.2만~10만명이 피해를 입었다(예보 발표 기준; 자료별 7.4만~10만으로 편차).

#### 2.3 AI 응용 — 소상공인 대안 평가

대형은행은 데이터가 부족한 소상공인을 잘 못 평가한다. 제2금융권은 **대안 데이터 (alternative data)** 로 평가:
- 카드 매출
- 배달앱 주문량
- 지역 위치 정보
- SNS 평판

→ Ch3에서 자세히 다루는 **대체 데이터 기반 신용평가**의 주요 응용처.

#### 2.4 Merton-Bodie 매핑
주로 **③ 시간/공간 이동** (소규모/지역).

### 3. 보험회사 — 위험 공동구매

#### 3.1 비즈니스 모델 — 대수의 법칙 (Law of Large Numbers)

100명이 매년 100만원씩 보험료 → 총 1억.
이 중 평균 5명에게 보험금 1000만원씩 지급 → 5천만 지출.
**차액 5천만 = 보험사 수익** (운영비 제외).

수학적으로:
$$ \text{보험료} \geq \mathbb{E}[\text{보험금}] + \text{운영비} + \text{이익마진} $$

대수의 법칙: 가입자가 많을수록 실제 청구가 기대값에 수렴 → 안정적 수익.

#### 3.2 보험 종류 — 한국 분류

| 대분류 | 종류 | 예시 |
|--------|------|------|
| **생명보험** | 사망·종신·연금 | 삼성생명, 교보생명, 한화생명 |
| **손해보험** | 자동차·화재·해상·기술 | 삼성화재, DB손보, 현대해상 |
| **건강보험** | 실손·암·치아 | 메리츠화재 (실손 1위) |
| **재보험** | 보험사를 위한 보험 | 코리안리 (한국 유일) |

#### 3.3 보험 AI의 4단계

<svg viewBox="0 0 720 240" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <defs>
    <marker id="arIns" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#5a7a96"/></marker>
  </defs>
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">보험 AI의 가치사슬 4단계</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- 1. Pricing -->
    <rect x="20" y="80" width="150" height="100" rx="6" fill="#fff" stroke="#5a7a96"/>
    <text x="95" y="105" text-anchor="middle" font-weight="700" fill="#5a7a96">① 가격 산정</text>
    <text x="95" y="125" text-anchor="middle" fill="#1c1917">언더라이팅</text>
    <text x="95" y="142" text-anchor="middle" fill="#57534e">UBI (운전 기록)</text>
    <text x="95" y="159" text-anchor="middle" fill="#57534e">건강 데이터</text>
    <text x="95" y="173" text-anchor="middle" font-style="italic" font-size="10" fill="#a8a29e">"이 사람 위험 얼마?"</text>
    <line x1="175" y1="130" x2="200" y2="130" stroke="#5a7a96" stroke-width="1.5" marker-end="url(#arIns)"/>
    <!-- 2. Sales -->
    <rect x="200" y="80" width="150" height="100" rx="6" fill="#fff" stroke="#5a7a96"/>
    <text x="275" y="105" text-anchor="middle" font-weight="700" fill="#5a7a96">② 판매</text>
    <text x="275" y="125" text-anchor="middle" fill="#1c1917">맞춤 상품 추천</text>
    <text x="275" y="142" text-anchor="middle" fill="#57534e">고객 세그멘테이션</text>
    <text x="275" y="159" text-anchor="middle" fill="#57534e">이탈 예측</text>
    <text x="275" y="173" text-anchor="middle" font-style="italic" font-size="10" fill="#a8a29e">"어떤 상품 팔까?"</text>
    <line x1="355" y1="130" x2="380" y2="130" stroke="#5a7a96" stroke-width="1.5" marker-end="url(#arIns)"/>
    <!-- 3. Claims -->
    <rect x="380" y="80" width="150" height="100" rx="6" fill="#fff" stroke="#5a7a96"/>
    <text x="455" y="105" text-anchor="middle" font-weight="700" fill="#5a7a96">③ 청구 심사</text>
    <text x="455" y="125" text-anchor="middle" fill="#1c1917">자동 심사</text>
    <text x="455" y="142" text-anchor="middle" fill="#57534e">진단서 OCR</text>
    <text x="455" y="159" text-anchor="middle" fill="#57534e">보험 사기 탐지</text>
    <text x="455" y="173" text-anchor="middle" font-style="italic" font-size="10" fill="#a8a29e">"이거 진짜 청구?"</text>
    <line x1="535" y1="130" x2="560" y2="130" stroke="#5a7a96" stroke-width="1.5" marker-end="url(#arIns)"/>
    <!-- 4. Investment -->
    <rect x="560" y="80" width="150" height="100" rx="6" fill="#fff" stroke="#5a7a96"/>
    <text x="635" y="105" text-anchor="middle" font-weight="700" fill="#5a7a96">④ 자산 운용</text>
    <text x="635" y="125" text-anchor="middle" fill="#1c1917">보험금 적립</text>
    <text x="635" y="142" text-anchor="middle" fill="#57534e">국채·회사채 투자</text>
    <text x="635" y="159" text-anchor="middle" fill="#57534e">리스크 관리</text>
    <text x="635" y="173" text-anchor="middle" font-style="italic" font-size="10" fill="#a8a29e">"어디 투자?"</text>
  </g>
  <text x="360" y="215" text-anchor="middle" font-size="11" font-style="italic" fill="#57534e">보험사 = 통계학과 운영의 결합. AI가 가장 일찍 들어간 금융 분야 중 하나.</text>
</svg>

> 💡 **UBI(Usage-Based Insurance) 예시**: 현대해상의 카니발/그랜저 운전자가 ADAS 데이터 제공하면 보험료 할인. → 운전 데이터로 위험 평가.

#### 3.4 Merton-Bodie 매핑
보험 = **② 풀링** (가입자 자금 모음) + **④ 위험 관리** (지급 책임).

### 4. 금융투자업자 — 자본시장의 중개인

#### 4.1 자본시장법이 만든 6대 업무

2009년 **자본시장통합법(자본시장과 금융투자업에 관한 법률)** 이 종전의 증권업·자산운용업·선물업·신탁업 등을 통합하면서 **6가지 금융투자업**으로 재편:

| # | 업무 | 영어 | 예시 |
|---|------|------|------|
| 1 | **투자매매업** | Dealing | 자기 자본으로 매매 (PI) |
| 2 | **투자중개업** | Brokerage | 위탁매매, 인수합병 |
| 3 | **집합투자업** | Collective Investment | 펀드 운용 (자산운용사) |
| 4 | **투자자문업** | Investment Advisory | 자문 (보수만 받음) |
| 5 | **투자일임업** | Discretionary Investment | 일임 (재량 운용) |
| 6 | **신탁업** | Trust | 신탁 (위탁 자산 운용) |

#### 4.2 한국 주요 증권사

| 구분 | 회사 | 특징 |
|------|------|------|
| 대형 | 미래에셋·한국투자·NH투자·KB | 종합 IB |
| 종합 | 삼성·신한·하나 | 은행계 |
| 인터넷 | 키움증권 | 개인투자자 1위 |
| 핀테크 | 토스증권·카카오페이증권 | 모바일 특화 |

#### 4.3 AI 응용 — 알고리즘 트레이딩이 핵심

증권사 AI는 **거래 자동화**에 집중:
- **시장조성(Market Making)**: 매수/매도 호가 자동 제출
- **알고리즘 트레이딩**: VWAP·TWAP·Implementation Shortfall
- **로보 어드바이저**: 개인 포트폴리오 자동 구성
- **리서치 자동화**: 재무제표 자동 분석, ESG 점수 산정

→ Ch2에서 본격적으로 다룬다.

#### 4.4 Merton-Bodie 매핑
증권사 = **② 풀링** (펀드) + **⑤ 정보 제공** (리서치) + **③ 시간/공간 이동** (자본 매칭).

### 5. 기타금융기관 — 카드사와 신용정보회사

#### 5.1 신용카드사

한국 카드사 = 7개. **취급액 기준 점유율 (2023, 컨슈머뉴스)**:
1. **신한카드** — 17.57%
2. **삼성카드** — 16.26%
3. **현대카드** — 15.50%
4. **KB국민카드** — 14.37%
5. **롯데카드** — 10.60%
6. **우리카드** — 7.94%
7. **하나카드** — 6.91%

> ⚠ 정정: 초기 작성본에서 KB > 현대, 우리 > 롯데 로 순서를 잘못 적었음. 위는 2023년 실제 취급액 기준.

**수익 구조**:
- 가맹점 수수료 (1.0~2.0%)
- 카드론 이자 (15~20%)
- 현금서비스 이자 (10~20%)
- 회비 (프리미엄 카드)

> ⚠️ 가맹점 수수료는 정부 규제 대상 (영세업자 보호) → 카드사들의 카드론·현금서비스 의존도 증가.

#### 5.2 신용정보회사 (CB: Credit Bureau)

한국은 **2개 회사 독점**:
- **NICE 평가정보** (구 한국신용정보, KIS)
- **KCB (코리아크레딧뷰로)**

이들이 너의 **신용점수**를 매긴다.

```
[데이터 흐름]
은행/카드사/통신사 → CB → 신용평점 → 다시 은행/카드사로
```

#### 5.3 AI 응용

| 기관 | 핵심 AI |
|------|---------|
| 카드사 | **FDS** (사기탐지) + 추천 시스템 |
| CB | **신용평가 모델** 자체 (Ch3) |

#### 5.4 Merton-Bodie 매핑
카드사 = **① 결제** + **⑤ 정보 제공** (소비 데이터).
CB = **⑤ 정보 제공** 전문.

### 6. 공적금융기관 — 정부 정책의 금융 손

#### 6.1 한국의 주요 공적 금융기관

| 기관 | 역할 |
|------|------|
| **한국은행** | 중앙은행 (통화·금융정책) |
| **한국산업은행** | 산업 정책 자금 |
| **한국수출입은행** | 수출입 금융 |
| **중소기업은행 (IBK)** | 중소기업 대출 |
| **한국주택금융공사 (HF)** | 주택담보·전세 보증 |
| **신용보증기금** | 중소기업 대출 보증 |
| **기술보증기금** | 기술벤처 보증 |
| **한국무역보험공사** | 수출 보험 |
| **신용회복위원회** | 개인 워크아웃 |
| **예금보험공사** | 예금자 보호 (5000만원) |

#### 6.2 왜 정부가 직접 금융을?

**시장 실패** 분야 보완:
- 중소기업 대출 (위험 높아 은행이 안 함)
- 수출 보험 (외환 리스크 큼)
- 주택담보 (장기·고정금리 공급)
- 정책 자금 (탄소중립, R&D)

#### 6.3 AI 응용 — 정책 적격성 판정

기보의 기술평가 모델: 특허·연구실적·시장성 등 **비정형 데이터**로 기술 점수 산정 → 대출 보증.

#### 6.4 Merton-Bodie 매핑
공적금융 = 6가지 기능 전체에 걸쳐 시장 실패 보완.

### 7. 핀테크 — 모든 경계를 흐리는 신참

#### 7.1 핀테크의 4가지 유형 (KB 경영연구소 분류)

| 유형 | 예시 | 핵심 기술 |
|------|------|----------|
| **결제·송금** | 토스, 카카오페이, 네이버페이 | 간편 결제 |
| **자산관리** | 뱅크샐러드, 핀크, 토스인베스트먼트 | 데이터 통합 + ML |
| **대출·신용** | 렌딧, 8퍼센트 (P2P 폐지) | 신용평가 알고리즘 |
| **인슈어테크** | 캐롯손해보험, 보맵 | UBI, 보험 비교 |

#### 7.2 한국 핀테크의 분기점 — 2017년 마이데이터

**마이데이터(MyData) 제도** (2022 본격 시행):
- 개인이 자기 금융 데이터에 대한 권리를 가짐
- 다른 회사에 데이터 이동 요청 가능 (오픈뱅킹)
- 핀테크가 통합 데이터로 서비스 제공 가능

> 이게 토스/카뱅 성장의 결정적 발판.

#### 7.3 핀테크가 7가지 기관 경계를 무너뜨리는 방식

<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">토스 그룹 — 한 기업이 6가지 금융 라이선스를 동시에 가진다</text>
  <!-- Toss center -->
  <circle cx="360" cy="160" r="50" fill="#1c1917"/>
  <text x="360" y="155" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">토스</text>
  <text x="360" y="172" text-anchor="middle" font-size="11" fill="#fff">(비바리퍼블리카)</text>
  <!-- Subsidiaries -->
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- Top -->
    <rect x="290" y="60" width="140" height="40" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="360" y="78" text-anchor="middle" font-weight="700" fill="#c4724e">토스뱅크</text>
    <text x="360" y="92" text-anchor="middle" font-size="9" fill="#57534e">인터넷전문은행</text>
    <line x1="360" y1="100" x2="360" y2="115" stroke="#a8a29e"/>
    <!-- Right -->
    <rect x="520" y="90" width="160" height="40" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="600" y="108" text-anchor="middle" font-weight="700" fill="#5a7a96">토스증권</text>
    <text x="600" y="122" text-anchor="middle" font-size="9" fill="#57534e">금융투자업</text>
    <line x1="520" y1="115" x2="410" y2="150" stroke="#a8a29e"/>
    <rect x="520" y="180" width="160" height="40" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="600" y="198" text-anchor="middle" font-weight="700" fill="#5a7a96">토스인슈어런스</text>
    <text x="600" y="212" text-anchor="middle" font-size="9" fill="#57534e">보험 판매대리</text>
    <line x1="520" y1="195" x2="410" y2="170" stroke="#a8a29e"/>
    <!-- Left -->
    <rect x="40" y="90" width="160" height="40" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="120" y="108" text-anchor="middle" font-weight="700" fill="#3a7d44">토스페이먼츠</text>
    <text x="120" y="122" text-anchor="middle" font-size="9" fill="#57534e">전자금융업</text>
    <line x1="200" y1="115" x2="310" y2="150" stroke="#a8a29e"/>
    <rect x="40" y="180" width="160" height="40" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="120" y="198" text-anchor="middle" font-weight="700" fill="#3a7d44">토스플레이스</text>
    <text x="120" y="212" text-anchor="middle" font-size="9" fill="#57534e">결제 단말기</text>
    <line x1="200" y1="195" x2="310" y2="170" stroke="#a8a29e"/>
    <!-- Bottom -->
    <rect x="290" y="225" width="140" height="40" rx="6" fill="#f5e6f0" stroke="#7a6a9a"/>
    <text x="360" y="243" text-anchor="middle" font-weight="700" fill="#7a6a9a">토스CX</text>
    <text x="360" y="257" text-anchor="middle" font-size="9" fill="#57534e">고객센터/CCM</text>
    <line x1="360" y1="225" x2="360" y2="210" stroke="#a8a29e"/>
  </g>
</svg>

→ **하나의 모바일 앱**이 7가지 다른 라이선스의 서비스를 통합 제공. **앱 사용자는 단일 경험**이지만, 뒤에서는 6개 자회사가 각자의 규제 영역에서 운영.

> 💬 이게 한국 금융의 미래 모습. **기관 분리는 규제 측면**에서만 유의미하고, **사용자 경험**에서는 통합된다.

#### 7.4 Merton-Bodie 매핑
핀테크 = **6가지 기능 전체 가능** (라이선스 조합에 따라).

> ✅ **여기까지 따라왔으면**: 한국 금융이 7가지 분리된 구조지만 핀테크가 그 위에 통합 레이어를 만들고 있다는 게 보일 것이다.

---

## 🔴 [고급] — 영문 용어와 책의 한계

### 💭 시작하기 전에

이 절은 **한국 금융을 영문 자료와 연결**하는 데 집중한다. 영어로 어떻게 부르는지, 해외와 어떻게 다른지, 그리고 책이 안 다룬 5가지 한계.

### 1. 영문 용어 사전 — 한국 ↔ 글로벌

| 한국어 | 영어 | 비고 |
|--------|------|------|
| 은행 | Commercial Bank / Universal Bank | 한국은 commercial bank 중심 |
| 시중은행 | Nationwide Bank | 영어로 직역 안 됨 |
| 인터넷전문은행 | Internet-only Bank / Neo-bank | 미국은 Chime, 영국은 Monzo |
| 저축은행 | Mutual Savings Bank | 영국 building society와 유사 |
| 신용협동조합 | Credit Union | 미국 NCUA 규제 |
| 보험회사 | Insurance Company | 손보=P&C, 생보=Life |
| 증권회사 | Securities Firm / Broker-Dealer | 미국은 broker-dealer |
| 자산운용사 | Asset Management Company (AMC) | BlackRock, Vanguard |
| 카드사 | Credit Card Issuer | 미국은 issuer vs network 분리 |
| 신용정보회사 | Credit Bureau (CB) | 미국: Equifax, Experian, TransUnion |
| 핀테크 | FinTech | 글로벌 공통 용어 |
| 인슈어테크 | InsurTech | 보험 + 기술 |
| 자산관리 | Wealth Management (WM) | HNW 고객 대상 |
| 사모펀드 | Private Equity (PE) | KKR, Blackstone |
| 헤지펀드 | Hedge Fund | Citadel, Bridgewater |

### 2. 해외 금융기관 구조와의 비교

#### 2.1 미국 — Universal Banking 모델

미국은 1999년 **Gramm-Leach-Bliley Act** 이후 **은행+증권+보험 결합** 가능:
- **JPMorgan Chase**: 상업은행 + 투자은행 + 자산운용 + 카드
- **Bank of America**: 비슷한 구조
- **Goldman Sachs**: 투자은행 + 자산운용 + 디지털뱅킹 (Marcus)

> 한국과 차이: 한국은 금산분리·금융지주회사 구조로 **법적으로 분리**, 미국은 **하나의 금융지주 아래 통합**.

#### 2.2 영국 — Building Societies 전통

- **Mutual ownership**: 저축은행과 비슷하지만 회원이 주인
- **Building Societies Association**: 약 43개 회원사
- 대표: **Nationwide Building Society** (자산 2,490억 파운드)

#### 2.3 독일 — 3중 구조 (Drei-Säulen-System)

1. **상업은행** (Commerzbank, Deutsche Bank)
2. **저축은행** (Sparkasse) — 지자체 소유
3. **협동조합 은행** (Volksbanken, Raiffeisen) — 회원 소유

> 한국 다금융권 체계와 비슷하지만, 독일은 협동조합 비중이 훨씬 큼 (예금의 30%).

#### 2.4 중국 — 빅테크 금융

- **Ant Group**: 알리페이 + 위어바오 + 즈마신용
- **Tencent**: 위챗페이
- 2020년 Ant Group IPO 중단 → 정부의 빅테크 규제 시작
- 디지털 위안화 (e-CNY) — 세계 최초 CBDC 본격 운영

> 중국 모델은 토스/카카오 모델의 원형. 한국은 중국보다 보수적 규제.

#### 2.5 시각화 — 4개 국가 비교

<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">4개국 금융 구조 — 분리도 vs. 핀테크 침투</text>
  <!-- Axes -->
  <line x1="80" y1="280" x2="680" y2="280" stroke="#1c1917" stroke-width="1.5"/>
  <line x1="80" y1="280" x2="80" y2="60" stroke="#1c1917" stroke-width="1.5"/>
  <text x="680" y="300" text-anchor="end" font-size="11" fill="#57534e">→ 통합도 (Universal Banking)</text>
  <text x="80" y="55" text-anchor="middle" font-size="11" fill="#57534e">↑ 핀테크 침투</text>
  <!-- Quadrant labels -->
  <text x="180" y="80" text-anchor="middle" font-size="10" fill="#a8a29e">분리 + 핀테크 강함</text>
  <text x="580" y="80" text-anchor="middle" font-size="10" fill="#a8a29e">통합 + 핀테크 강함</text>
  <text x="180" y="270" text-anchor="middle" font-size="10" fill="#a8a29e">분리 + 핀테크 약함</text>
  <text x="580" y="270" text-anchor="middle" font-size="10" fill="#a8a29e">통합 + 핀테크 약함</text>
  <!-- Countries -->
  <circle cx="280" cy="150" r="35" fill="#fdf0ea" stroke="#c4724e" stroke-width="2"/>
  <text x="280" y="148" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">🇰🇷 한국</text>
  <text x="280" y="165" text-anchor="middle" font-size="9" fill="#57534e">금산분리, 토스</text>
  <circle cx="550" cy="170" r="35" fill="#eaf2f8" stroke="#5a7a96" stroke-width="2"/>
  <text x="550" y="168" text-anchor="middle" font-size="13" font-weight="700" fill="#5a7a96">🇺🇸 미국</text>
  <text x="550" y="185" text-anchor="middle" font-size="9" fill="#57534e">GLB Act, BigTech</text>
  <circle cx="450" cy="100" r="35" fill="#edf7ef" stroke="#3a7d44" stroke-width="2"/>
  <text x="450" y="98" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">🇨🇳 중국</text>
  <text x="450" y="115" text-anchor="middle" font-size="9" fill="#57534e">Ant, Tencent</text>
  <circle cx="200" cy="220" r="35" fill="#f5e6f0" stroke="#7a6a9a" stroke-width="2"/>
  <text x="200" y="218" text-anchor="middle" font-size="13" font-weight="700" fill="#7a6a9a">🇩🇪 독일</text>
  <text x="200" y="235" text-anchor="middle" font-size="9" fill="#57534e">3-Säulen, 보수</text>
</svg>

### 3. 책의 한계 — §1.2를 다시 읽으며

저자는 7가지를 간단히 나열했다. 이 책이 §1.2에서 안 다룬 것 5가지:

#### 한계 ①: 규제기관 구조 미언급
한국 금융을 이해하려면 규제기관 3축을 알아야 한다:
- **금융위원회 (FSC, Financial Services Commission)**: 정책·법령·인허가
- **금융감독원 (FSS, Financial Supervisory Service)**: 일상 감독·검사
- **한국은행 (BOK, Bank of Korea)**: 통화정책·결제·외환

이 3축의 권한 분배가 한국 금융 AI 규제의 핵심이다 (예: 마이데이터 = FSC, 데이터 보안 = 개인정보보호위원회).

#### 한계 ②: 그림자금융 (Shadow Banking) 미언급
한국 가계대출의 약 30%는 **제도권 밖 또는 회색지대**:
- P2P 대출 (현재 온투법으로 규제화)
- 사채
- 일수
- 카드론·현금서비스 (제도권이지만 그림자금융적 성격)

이게 안 다뤄지면 **신용평가 AI가 왜 중요한지** (Ch3)의 동기가 약해진다.

#### 한계 ③: 금융지주회사 구조 미언급
한국 4대 금융은 **금융지주회사** 형태:
- KB금융지주 → KB국민은행, KB증권, KB손해보험, KB카드 등
- 신한금융지주 → 신한은행, 신한카드, 신한투자증권 등

이게 안 보이면 "왜 KB가 다 한데?" 가 이해 안 됨.

#### 한계 ④: 디지털 금융 인프라 미언급
한국이 글로벌 1위인 분야:
- **간편결제 점유율**: 한국 35% (글로벌 평균 15%)
- **인터넷뱅킹 이용률**: 78% (OECD 1위)
- **금융 클라우드**: 2019년 규제 완화 이후 급성장

이건 한국 금융 AI가 발달한 인프라적 기반.

#### 한계 ⑤: ESG·기후 금융 미언급
2023년 한국 금융기관의 ESG 의무 공시 시작. 기후 리스크 평가에 AI 활용 증가.
- TCFD (Task Force on Climate-related Financial Disclosures)
- 한국형 녹색분류체계 (K-Taxonomy)

> 💬 이 5가지는 책이 6장 한도 안에 안 다루는 게 합리적이지만, 알아두면 금융 AI 전체 그림이 입체적이 됨.

---

## 🟣 [전공자] — 1차 자료와 수식

### 💭 시작하기 전에

이 절은 한국 금융기관의 법적 근거와 국제 표준(Basel)을 다룬다. 모든 인용은 법령과 BIS 공식 문서다.

### 1. 한국 금융법 체계 — 7가지 기관의 법적 근거

| 기관 | 근거법 | 주요 내용 |
|------|--------|----------|
| 은행 | **은행법** (1950) | 인허가, 동일인 한도 |
| 비은행예금 | 상호저축은행법·신용협동조합법 등 | 별도 규율 |
| 보험 | **보험업법** (2003 전면개정) | 생보·손보 구분 |
| 금융투자 | **자본시장법** (2007) | 6가지 업무 통합 |
| 카드 | **여신전문금융업법** (1997) | 카드·할부·시설대여 |
| 신용정보 | **신용정보법** (1995) | CB 인가 |
| 핀테크 | **전자금융거래법** + 개별법 | 라이선스 모자이크 |
| 마이데이터 | **신용정보법** 개정 (2020) | 본인신용정보관리업 |

#### 1.1 자본시장법의 통합 의미

2007년 이전:
- 증권거래법 (주식)
- 선물거래법 (파생)
- 신탁업법 (신탁)
- 자산운용업법 (펀드)
- 종합금융회사에 관한 법률 (CP)

→ 2007년 **자본시장법**으로 통합 → 6가지 금융투자업으로 재편 → **기능별 규제(functional regulation)** 도입.

이 변화가 한국에서 Merton-Bodie 기능적 관점이 법제화된 사례.

> 📄 자본시장과 금융투자업에 관한 법률 (법률 제8635호, 2007.8.3 제정).

### 2. Basel 자본규제 — 은행의 자기자본 비율

#### 2.1 BIS 비율 (Capital Adequacy Ratio)

$$ \text{BIS 비율} = \frac{\text{자기자본}}{\text{위험가중자산 (RWA)}} \geq 8\% $$

- **Tier 1 자본**: 보통주, 이익잉여금 (가장 안전)
- **Tier 2 자본**: 후순위 채권 등 (부차적)
- **위험가중자산 (RWA, Risk-Weighted Assets)**: 자산을 위험도에 따라 가중

#### 2.2 Basel 발전사

| 버전 | 연도 | 핵심 변경 |
|------|------|----------|
| Basel I | 1988 | 8% 최소비율, 단순 가중치 |
| Basel II | 2004 | 신용/시장/운영 리스크 정밀화, 내부등급법 (IRB) |
| Basel III | 2010~ | 위기 후 자본·유동성 강화, LCR/NSFR |
| Basel III.5 | 2017 | "Basel IV" — 모델 사용 제한 강화 |

#### 2.3 한국 적용

한국 시중은행 평균 총자본비율 (2023): **약 15~16%** (금감원 발표 기준 약 15.58%, 최소 8%의 약 2배).

> ⚠ 정정: 초기 작성본의 "약 17%"는 과대 표기. 금감원 2023년 말 발표 기준 국내 은행 총자본비율 평균은 약 15.58%다.

> 📄 Basel Committee on Banking Supervision (BCBS). https://www.bis.org/bcbs/

### 3. Solvency II — 보험사의 자본규제

EU 2016년 도입. 한국은 **K-ICS (한국형 ICS)** 로 2023년 시행.

$$ \text{지급여력비율} = \frac{\text{가용자본}}{\text{요구자본}} \geq 100\% $$

요구자본은 **VaR 99.5%** (1년 내 0.5% 확률 손실) 기준.

> 📄 EIOPA. Solvency II Directive (2009/138/EC).

### 4. 마이데이터 — 한국 핀테크의 법적 기반

#### 4.1 신용정보법 제22조의9 (본인신용정보관리업)

> "금융위원회의 허가를 받아 개인인 신용정보주체의 본인신용정보를 ... 종합하여 제공하는 영업을 본인신용정보관리업이라 한다."
> — 신용정보법 §22의9 ①항

#### 4.2 데이터 전송 의무

> "신용정보제공·이용자등은 ... 신용정보주체의 요구에 따라 본인신용정보관리회사에 정보를 ... 전송하여야 한다."
> — 신용정보법 §33의2

이 법이 **API 표준화 + 의무화** 를 만들었고 → 핀테크 폭발의 인프라.

> 📄 신용정보의 이용 및 보호에 관한 법률 (마이데이터 도입 개정: **법률 제16957호, 2020.2.4**).

### 5. Financial Stability Board (FSB)의 글로벌 시스템적 중요 기관

#### 5.1 G-SIBs (Globally Systemically Important Banks)

매년 FSB가 발표. 2023년 30개:
- **Bucket 4** (가장 중요, +2.5%p 추가자본): JPMorgan
- **Bucket 3** (+2.0%p): Bank of America, Citigroup, HSBC
- ... 등

한국은 **G-SIB에 없음**. 그러나 D-SIB (Domestic SIB) 로 5대 시중은행 지정.

> 📄 FSB. (2023). 2023 List of Global Systemically Important Banks (G-SIBs).

### 6. 인터넷전문은행법 — 한국의 특수 입법

2018년 **인터넷전문은행 설립 및 운영에 관한 특례법** 통과:
- 산업자본의 은행 지분 한도 **34%** (일반 은행 4% → 특례)
- 그래서 카카오(34%) → 카카오뱅크, KT/우리은행 → 케이뱅크 가능

#### 의미

**금산분리 원칙의 부분적 완화**. 인터넷전문은행만 가능하고, 일반 시중은행은 여전히 금산분리.

> 📄 인터넷전문은행 설립 및 운영에 관한 특례법 (법률 제15856호, 2018.10.16).

---

### 🟣 [전공자 심화] — 금융제도 진화의 한계와 후속 연구

> 💭 본 절은 한국 금융 7기관을 설명하지만, 이 구조의 **역사적 진화(Glass-Steagall → GLB → Dodd-Frank)** 와 **BIS Basel I/II/III의 자본규제 한계**를 다루지 않았다. 이 둘이 한국 금융제도의 외생적 제약을 결정한다.

#### 1. 미국 은행규제 100년 — 분리 → 통합 → 재분리

**Glass-Steagall Act (1933.6.16)**
- 1929 대공황 이후 상업은행과 투자은행 **분리**. 예금자 보호(FDIC 설립)와 투기 차단.
- 핵심 조항 §16, §20, §21, §32 (소위 "Glass-Steagall 4개 조항"): 회원은행이 비정부 증권 인수·중개 금지.
- 📄 [Federal Reserve History — Glass-Steagall Act](https://www.federalreservehistory.org/essays/glass-steagall-act)

**Gramm-Leach-Bliley Act (GLBA, 1999.11.12)**
- Glass-Steagall §20, §32 폐지 → 상업은행·투자은행·보험 **통합** 허용 (Financial Holding Company 도입).
- 직접적 계기: 1998 Citicorp-Travelers 합병 (당시 위법, GLBA로 사후 합법화).
- 📄 [Federal Reserve History — GLBA](https://www.federalreservehistory.org/essays/gramm-leach-bliley-act)

**Dodd-Frank Act (2010.7.21)**
- 2008 글로벌 금융위기 대응. Glass-Steagall 전면 부활은 아님.
- **Volcker Rule** (§619): 상업은행의 자기자본 투기 거래(proprietary trading) 제한 — Glass-Steagall 정신의 부분 복원.
- CFPB(소비자금융보호국), FSOC(금융안정감시위원회) 신설. 시스템적 중요 금융기관(SIFI) 지정.

**한계와 비판 문헌**:
- **Crawford, C. (2011)**. The repeal of the Glass-Steagall Act and the current financial crisis. *Journal of Business & Economics Research*, 9(1), 127–134. — GLBA 폐지가 2008 위기의 직접 원인이었는지에 대한 논쟁 정리.
- **Acharya, V. V., Cooley, T. F., Richardson, M. P., & Walter, I. (2010)**. *Regulating Wall Street: The Dodd-Frank Act and the New Architecture of Global Finance*. Wiley. — Dodd-Frank의 규제 차익(regulatory arbitrage) 한계 비판.

#### 2. BIS Basel Accord — 자본규제의 진화와 한계

**Basel I (1988)**: 자본/위험가중자산(RWA) ≥ 8%. **위험가중치가 너무 단순** (OECD 국가채 0%, 기업대출 100%) → 차익거래 유발.

**Basel II (2004)**: IRB(Internal Ratings-Based) 도입 → 은행 자체 모델로 위험가중 산출. **문제**: 경기순행성(procyclicality) 심화 — 불황기에 PD↑ → RWA↑ → 자본요구↑ → 대출축소 → 불황 심화.
- 📄 Repullo, R., & Suarez, J. (2013). The procyclical effects of bank capital regulation. *Review of Financial Studies*, 26(2), 452–490. [CEPR voxeu](https://cepr.org/voxeu/columns/procyclical-effects-basel-ii)

**Basel III (2010~, finalised 2017)**: 자본 보존 버퍼 2.5%, 경기대응완충자본(CCyB) 0~2.5%, 레버리지비율 3%, LCR·NSFR 도입. 2023.7 GHOS 회의에서 시행 시점 2025.1.1로 연기 → 미국·EU 차별 적용.

**핵심 비판 문헌**:
- **Admati, A. R., & Hellwig, M. F. (2013)**. *The Bankers' New Clothes: What's Wrong with Banking and What to Do About It*. Princeton University Press. — **자기자본을 자산 대비 20–30%로 올려야 한다**고 주장. Basel III의 ~10% 수준은 여전히 부족하다는 입장. [Princeton UP](https://press.princeton.edu/books/paperback/9780691251707/the-bankers-new-clothes)
- **Admati, A. R., DeMarzo, P. M., Hellwig, M. F., & Pfleiderer, P. (2013)**. The parade of the bankers' new clothes continues: 31 flawed claims debunked. *Rock Center for Corporate Governance Working Paper* No. 143. [SSRN: 2292229](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2292229)
- **Morris, N., & Vines, D. (eds.) (2014)**. *Capital Failure: Rebuilding Trust in Financial Services*. Oxford University Press. ISBN 978-0-19-871222-0. — 금융위기 이후 신뢰 회복을 위한 제도 재설계 논문집. [Oxford UP](https://global.oup.com/academic/product/capital-failure-9780198712220)
- **Acharya, V. V. (2013)**. Adapting micro prudential regulation for emerging markets. — Basel 자본규제는 정적 위험가중치, 동질적 리스크 가정, 상관관계 무시 등에서 구조적 결함이라고 비판.

#### 3. 후속 연구 동향 (2020~)

- **거시건전성 규제 vs. 시스템 리스크**: Adrian, T., & Boyarchenko, N. (2018, *RFS*) 후속으로 Brunnermeier, M. K., et al. (2020). The fundamental principles of financial regulation. → DSGE 통합 모형.
- **암묵적 보조금(implicit subsidy) 정량화**: Atkeson, A. G., d'Avernas, A., Eisfeldt, A. L., & Weill, P.-O. (2019). Government guarantees and the valuation of American banks. *NBER Macroeconomics Annual*, 33, 81–145. — TBTF 은행의 정부 보증 가치 추정.
- **기후 리스크 + Basel**: BCBS. (2022). *Principles for the effective management and supervision of climate-related financial risks* (BCBS d532). [bis.org/bcbs/publ/d532.htm](https://www.bis.org/bcbs/publ/d532.htm) — Basel 프레임에 기후 리스크 통합.
- **암호자산 자본규제**: BCBS. (2022.12). *Prudential treatment of cryptoasset exposures* (BCBS d545). [bis.org/bcbs/publ/d545.htm](https://www.bis.org/bcbs/publ/d545.htm) — Group 1(전통자산 토큰화) vs Group 2(비전통 암호자산, 1250% 위험가중) 이원 체계.

#### 4. 한국 적용 시 주의점

1. **금융지주회사법(2000)이 한국형 GLBA**: 미국 GLBA보다 1년 빨리 도입(법률 제6219호, 2000.10.23). 단, **금산분리 원칙 유지** → 비금융 모기업의 금융지주 지배 제한.
2. **Basel III 도입 시차**: 한국은 2013년 12월부터 단계적 적용, LCR은 2015년 100% 조기 달성. 그러나 **NSFR은 2018년 100% 적용**으로 글로벌 평균과 유사.
3. **D-SIB(국내 시스템적 중요 은행) 추가자본 1%p**: KB·신한·하나·우리·NH·IBK 6개사. SIFI 미지정.
4. **인터넷전문은행 특례(2018)**: 비금융주력자(ICT 기업) 한도 4% → 34% 완화. 단 카카오·KT 등 **재벌 금융지주 진입 차단**은 유지 → Glass-Steagall 정신의 한국식 변형.
5. **금융감독 3축**: 한은(통화)·금융위(정책)·금감원(감독)의 분리는 **영국 FCA·PRA 분리(2013) 모형과 유사**하나, 금융위-금감원 갈등이 종종 발생 → 단일 통합감독청(영국 FSA 이전) 회귀론 vs. 분리 유지론 학술적 논쟁 진행 중.
6. **그림자금융 규제 공백**: P2P 대출(온라인투자연계금융업법, 2020.8 시행)은 자기자본 5억원·총자산 한도 등 **은행 대비 약한 규제** → Basel 적용 대상 아님. FSB. (2023). *Global Monitoring Report on NBFI* 한국 챕터 참고.

---

## 📚 책에는 없지만 알면 좋은 것

### 🔍 보충 1 — 금산분리 (Separation of Industrial Capital and Financial Capital)

#### 원칙
**일반 기업이 은행을 못 가진다**. 삼성그룹이 은행 못 가지는 이유. (삼성생명, 삼성카드는 가능)

#### 이유
1. **자금 사금화** 방지: 그룹 계열사에 부당 대출
2. **시스템 리스크**: 비금융업 부실이 금융으로 전이
3. **고객 보호**: 산업 정보로 금융 의사결정

#### 적용 범위
- **은행**: 동일인 4%, 의결권 4% 한도
- **인터넷전문은행**: 34% (특례)
- **금융지주**: 비금융 자회사 보유 금지

#### 토론
경쟁국 (미국·EU)은 금산결합 허용. 한국·일본만 엄격. 핀테크 시대에 적합한가?

### 🔍 보충 2 — 그림자금융 (Shadow Banking)

#### 정의 (FSB)
> "*Credit intermediation involving entities and activities outside the regular banking system.*"

#### 한국 그림자금융 예시
- P2P 대출 (현 온투법 적용)
- 부동산 PF (Project Financing)
- 헤지펀드
- MMF (Money Market Fund)
- 자산유동화 (ABS, MBS)

#### 왜 위험한가?
- 규제 사각지대
- 유동성 변환 (단기 자금 → 장기 투자)
- 은행 시스템과 연계 → 위기 전이

2008년 미국 위기는 **CDO + Repo 시장** (전형적 그림자금융)에서 시작.

> 📄 FSB. (2023). *Global Monitoring Report on Non-Bank Financial Intermediation*.

### 🔍 보충 3 — Open Banking과 마이데이터의 차이

| | Open Banking | 마이데이터 |
|---|---|---|
| **시작** | 2019.12 (한국) | 2022.1 (한국) |
| **범위** | 은행 계좌 정보 | 전 금융 데이터 + 통신·공공 |
| **API 표준** | 금융결제원 | 신용정보원 |
| **목적** | 계좌이체 비용 절감 | 데이터 주권 + 핀테크 |
| **운영** | 은행 ↔ 핀테크 | 데이터 보유사 ↔ 마이데이터 사업자 |

> 💡 토스/카뱅 앱에서 "다른 은행 계좌 한꺼번에 보기"가 가능한 이유: 마이데이터.

### 🔍 보충 4 — 한국 금융기관의 디지털 전환 통계

| 지표 | 2018 | 2023 | 변화 |
|------|------|------|------|
| 인터넷뱅킹 이용 비중 | 71% | 89% | +18%p |
| 모바일뱅킹 이용 비중 | 51% | 78% | +27%p |
| 영업점 수 | 7,000개 | 4,500개 | -36% |
| 비대면 신규계좌 비중 | 5% | 42% | +37%p |
| 챗봇 도입 은행 | 4개 | 17개 | +325% |

> 📄 한국은행. (2024). *국내 은행의 디지털 전환 현황 및 시사점*.

### 🔍 보충 5 — 핀테크 라이선스 종류 (한국)

토스/카카오 같은 핀테크가 따야 하는 라이선스:

| 라이선스 | 영문 | 규제기관 |
|---------|------|----------|
| 전자금융업 | Electronic Financial Business | FSC |
| 인터넷전문은행 | Internet-only Bank | FSC |
| 금융투자업 (6종) | Securities Business | FSC |
| 보험판매대리점 | Insurance Agent | FSC |
| 본인신용정보관리업 | MyData Business | FSC |
| 소액해외송금업 | Small-amount Foreign Remittance | FSC |
| 가상자산사업자 | VASP | FIU |

→ 한 기업이 풀스택 핀테크 하려면 **7개 이상 라이선스** 필요. 그래서 자회사 구조.

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. 제1금융, 제2금융, 제3금융이 무슨 차이?

**A.**

- **제1금융권**: 은행 (안전, 낮은 금리)
- **제2금융권**: 비은행예금취급기관, 보험, 증권 등 (위험·금리 중간)
- **제3금융권**: 대부업, 사채 등 (위험 큼, 금리 매우 높음, 법정 최고금리 20%)

**예시 — 5000만원 1년 빌릴 때 이자**:
- 제1금융 (KB) 신용대출: 5~7% → 250만원
- 제2금융 (저축은행): 8~15% → 400~750만원
- 제3금융 (대부업): 18~20% → 900~1000만원

### Q2. 금융위원회 vs. 금융감독원, 뭐가 다른가?

**A.** 잘 헷갈리는 부분. 핵심 차이:

| | 금융위원회 (FSC) | 금융감독원 (FSS) |
|---|---|---|
| 성격 | 정부 행정위원회 | 무자본 특수법인 |
| 역할 | **정책·법령·인허가** | **일상 감독·검사** |
| 대표 | 위원장 (장관급) | 원장 |
| 비유 | "법 만드는 사람" | "법 집행하는 경찰" |

→ **금감원은 금융위의 정책을 집행**하는 구조. 비슷한데 권한이 다름.

### Q3. 한국은행은 시중은행에 돈 빌려주나?

**A.** 네, 그게 **기준금리(base rate)** 다.

```
한국은행 ─[기준금리 3.5%]─▶ 시중은행 ─[5%]─▶ 너
                                      ↑
                              스프레드 1.5% = 은행 마진
```

- **기준금리 인상** → 시중은행도 대출금리 인상 → 너의 대출이자 증가
- **기준금리 인하** → 시중은행도 인하 → 대출 늘어남 → 경기 부양

이게 통화정책의 핵심 메커니즘.

### Q4. 예금자보호한도 5000만원이 정확히 뭔가?

**A.** 은행 망하면 **예금보험공사**가 1인당 5000만원까지 보장.
- 원금 + 이자 합산
- **은행별로 5000만**: KB에 5000, 신한에 5000 → 둘 다 보호
- 외화예금도 포함 (원화 환산)
- 보호 안 되는 것: 주식, 펀드, 외화환매조건부채권

> 💬 부자들이 여러 은행에 분산 예치하는 이유.

### Q5. 토스가 은행이야, 핀테크야?

**A.** 둘 다.

- **비바리퍼블리카(주)** = 핀테크 본체 = 토스 앱 운영
- **토스뱅크** = 인터넷전문은행 = 비바리퍼블리카의 자회사
- 너가 토스 앱에서 보는 모든 서비스 = 7개 자회사가 각자 라이선스로 제공

법적으로 "토스"라는 단일 회사는 없고, **토스 그룹**이 7~10개 회사로 구성.

### Q6. 신용카드사가 왜 은행 자회사가 많아?

**A.** **여신전문금융업법** 때문.

- 카드사는 예금 못 받음 → 자금 조달이 어려움
- 은행에 소속되면 → 모회사 자금 조달력 활용
- 또 카드 결제 데이터 + 은행 거래 데이터 = 마케팅 강력

그래서 4대 시중은행 모두 카드사 보유:
- KB → KB국민카드
- 신한 → 신한카드
- 하나 → 하나카드
- 우리 → 우리카드

예외: **삼성카드 (삼성그룹), 현대카드 (현대차그룹), 롯데카드 (MBK파트너스)** — 비은행계.

### Q7. 핀테크가 기존 7가지 기관 분류를 의미 없게 만드나?

**A.** **법적으로는 의미 있고, 사용자 경험은 무의미해짐**.

- 법적으로: 토스도 토스뱅크 라이선스로 은행, 토스증권 라이선스로 증권사. 분류 안 사라짐.
- 사용자: 토스 앱에서 "이게 은행 서비스인지 증권 서비스인지" 인지 안 함.

→ 미래 트렌드: **Embedded Finance** (예: 쿠팡에서 결제 + 대출 + 보험을 자동 통합). 7가지 기관이 "보이지 않는" 인프라가 됨.

---

## 🎯 이 절에서 가져갈 핵심 7가지

1. **한국 금융 = 7가지 기관 유형**. 각각 다른 법·다른 규제·다른 데이터·다른 AI.
2. **분리 이유**: 1929 대공황 학습 효과 (Glass-Steagall 정신).
3. **각 기관은 Merton-Bodie 6기능 중 일부를 담당** — §1.1 매핑 그대로.
4. **3축 규제기관**: 한국은행(통화) + 금융위원회(정책) + 금융감독원(감독).
5. **핀테크가 분리 경계를 흐리고 있다** — 라이선스 조합으로 통합 서비스.
6. **마이데이터(2022)**가 한국 핀테크의 결정적 인프라.
7. **금융지주회사 구조**가 한국 4대 금융의 통합 메커니즘 (지주 → 은행+증권+카드+보험).

---

## 📖 더 읽을거리

### 한국 금융 구조
- 한국은행. (2024). *우리나라의 금융제도*. — 무료, 매년 개정. **최우선 추천**.
- 금융감독원. (매년). *금융감독 핸드북*.
- 금융위원회. (매년). *금융정책 백서*.

### 핀테크
- KB금융경영연구소. (매년). *핀테크 동향 보고서*.
- 한국핀테크지원센터. *KOREA FINTECH WEEK* 자료.

### 국제 비교
- IMF. (매년). *Global Financial Stability Report*. — 무료, BIS 사이트.
- World Bank. *Global Findex Database*. — 금융 포용성 데이터.
- Bank for International Settlements. (매년). *Annual Economic Report*. — 무료.

### 1차 자료
- 은행법 (법률 제18128호, 2021.4.20 개정)
- 자본시장과 금융투자업에 관한 법률 (법률 제18651호, 2022.1.18 개정)
- 신용정보의 이용 및 보호에 관한 법률 (마이데이터 도입 개정: 법률 제16957호, 2020.2.4)
- BCBS. (2017). *Basel III: Finalising post-crisis reforms*.
- FSB. (2023). *Global Monitoring Report on NBFI*.

### 학술
- Merton, R. C., & Bodie, Z. (2005). The design of financial systems: Towards a synthesis of function and structure. *JOIM*, 3(1), 1–23.
- Goldstein, I., Jiang, W., & Karolyi, G. A. (2019). To FinTech and beyond. *Review of Financial Studies*, 32(5), 1647–1661.

---

## 📋 검증 노트 / 변경 이력

| # | 항목 | 초기 작성본 | 수정 내용 | 1차 출처 |
|---|---|---|---|---|
| 1 | Glass-Steagall 1933 | "은행/증권/보험 강제 분리" | **은행/증권 분리만**. 보험 분리는 1956 Bank Holding Company Act | [Wikipedia](https://en.wikipedia.org/wiki/Glass%E2%80%93Steagall_legislation) |
| 2 | 한국 시중은행 BIS | "약 17%" | **약 15.58% (금감원 2023 말 기준 총자본비율)** | [금감원](https://www.fss.or.kr/) |
| 3 | 부산저축은행 예금자 피해 | "약 11만명" | **약 8.2~10만명** (자료별 7.4만~10만) | [한국어 Wikipedia](https://ko.wikipedia.org/wiki/2011%EB%85%84_%EC%83%81%ED%98%B8%EC%A0%80%EC%B6%95%EC%9D%80%ED%96%89_%EC%98%81%EC%97%85%EC%A0%95%EC%A7%80_%EC%82%AC%EA%B1%B4) |

---

> **다음 절 예고** — §1.3 AI와 그 주변 용어들
> AI, ML, DL, GenAI 같은 헷갈리는 용어들을 풀고, 각각이 금융에서 어떤 의미를 갖는지 본다. 책이 가장 간단히 다룬 절이지만, 해설집은 가장 정확한 정의를 다룰 부분.
