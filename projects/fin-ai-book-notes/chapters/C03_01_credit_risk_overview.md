# 3.1 ~ 3.2 신용 리스크 관리 개요 + 신용 평가 모델의 활용 — *Credit Risk Overview*

> **원서 위치**: 김태헌, 《금융 AI의 이해》(제이펍, 2024), §3.1 (pp.115–117), §3.2 (pp.117–122)
> **원서 분량**: 약 7쪽
> **해설 분량**: 약 28쪽
> **읽는 데 걸리는 시간**: 약 50분

---

## 🪧 이 절을 한 줄로

> 신용 리스크 관리 = **"이 사람한테 돈 빌려줘도 안 떼일까?"** 를 정량으로 평가하는 일.
> 미국·중국·한국 모두 신용평가 시스템이 발달했고, **핀테크 (BNPL)** 가 새 영역을 열고 있다.

책은 §3.1에서 신용 리스크 관리의 중요성을, §3.2에서 신용 평가 모델의 활용 (대출·카드·보험·투자 + 6개국 비교 + 핀테크 BNPL) 을 다룬다. 이 해설집은:
1. **신용 리스크의 진짜 의미** — 정보 비대칭 해소 (Ch1 §1.1 연결)
2. **글로벌 신용평가 시스템 6국 비교**
3. **한국 신용평가의 특수성** (NICE, KCB)
4. **BNPL과 대안 데이터** 의 미래

### 📍 미리 그릴 큰 그림

<svg viewBox="0 0 760 380" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">신용 리스크 관리 — 큰 그림</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- Definition -->
    <rect x="220" y="50" width="320" height="50" rx="8" fill="#1c1917"/>
    <text x="380" y="73" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">신용 리스크 = 상대방이 안 갚을 가능성</text>
    <text x="380" y="90" text-anchor="middle" font-size="10" fill="#fff">Credit Risk = Probability of Default</text>
    <!-- 3 pillars -->
    <text x="380" y="125" text-anchor="middle" font-size="12" font-weight="700" fill="#5a7a96">▼ 관리 3대 활동</text>
    <rect x="40" y="140" width="220" height="60" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="150" y="162" text-anchor="middle" font-weight="700" fill="#5a7a96">① 신용평가 시스템</text>
    <text x="150" y="180" text-anchor="middle" font-size="10" fill="#57534e">사전 평가 (Application)</text>
    <rect x="270" y="140" width="220" height="60" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="380" y="162" text-anchor="middle" font-weight="700" fill="#5a7a96">② 위험 기반 가격 책정</text>
    <text x="380" y="180" text-anchor="middle" font-size="10" fill="#57534e">금리 차등 (Risk-Based Pricing)</text>
    <rect x="500" y="140" width="220" height="60" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="610" y="162" text-anchor="middle" font-weight="700" fill="#5a7a96">③ 지속 모니터링</text>
    <text x="610" y="180" text-anchor="middle" font-size="10" fill="#57534e">사후 평가 (Behavioral)</text>
    <!-- 5 applications -->
    <text x="380" y="225" text-anchor="middle" font-size="12" font-weight="700" fill="#c4724e">▼ 5대 활용 사례</text>
    <rect x="40" y="245" width="135" height="50" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="107" y="265" text-anchor="middle" font-weight="700" fill="#c4724e">대출 심사</text>
    <text x="107" y="282" text-anchor="middle" font-size="9" fill="#57534e">승인 + 한도</text>
    <rect x="185" y="245" width="135" height="50" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="252" y="265" text-anchor="middle" font-weight="700" fill="#c4724e">카드 발급</text>
    <text x="252" y="282" text-anchor="middle" font-size="9" fill="#57534e">한도 + 등급</text>
    <rect x="330" y="245" width="135" height="50" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="397" y="265" text-anchor="middle" font-weight="700" fill="#c4724e">투자 리스크</text>
    <text x="397" y="282" text-anchor="middle" font-size="9" fill="#57534e">채권 등급</text>
    <rect x="475" y="245" width="135" height="50" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="542" y="265" text-anchor="middle" font-weight="700" fill="#c4724e">보험료 책정</text>
    <text x="542" y="282" text-anchor="middle" font-size="9" fill="#57534e">위험 가격</text>
    <rect x="620" y="245" width="100" height="50" rx="6" fill="#fdf0ea" stroke="#c4724e" stroke-width="2"/>
    <text x="670" y="265" text-anchor="middle" font-weight="700" fill="#c4724e">BNPL</text>
    <text x="670" y="282" text-anchor="middle" font-size="9" fill="#57534e">후불결제 (신규)</text>
    <!-- Bottom: AI driver -->
    <rect x="100" y="315" width="560" height="50" rx="8" fill="#edf7ef" stroke="#3a7d44" stroke-width="2"/>
    <text x="380" y="338" text-anchor="middle" font-weight="700" fill="#3a7d44">▼ AI가 들어와서 무엇이 바뀌나?</text>
    <text x="380" y="355" text-anchor="middle" font-size="10" fill="#57534e">전통 데이터 (CB) + 대체 데이터 (행동·SNS·통신) → 더 정밀한 평가</text>
  </g>
</svg>

---

## 🟢 [초급] — 신용 리스크의 일상 비유

### 1. 친구 빌리기에서 시작

Ch1 §1.1 에서 본 "5만원 빌려줘" 비유 기억나는가?

```
오늘의 5만원 → 다음 주 5만원 (불확실)
                            ↑
                       이게 "신용 리스크"
```

신용 리스크 = **"안 갚을 가능성"**.

#### 친구한테 5만원 빌려줄 때 너가 보는 것들

- 그 친구가 평소에 약속 잘 지키는가?
- 직장 다니는가? (상환 능력)
- 지난번에도 빌렸다가 갚았나? (이력)
- 친구 관계는? (도덕적 부담)

→ 이게 바로 **신용평가의 핵심**.

### 2. 은행이 하는 일도 똑같다

```
[너가 1000만원 신용대출 신청]
         ↓
[은행이 평가]:
  - 직장? 연봉?
  - 다른 대출은?
  - 카드 연체 이력은?
  - 신용점수는? (NICE, KCB)
         ↓
[결과]:
  - 승인 + 한도 1000만 + 금리 5.5%
  - 또는 거절
```

### 3. 왜 신용평가가 중요한가? — 3가지 이유

#### 이유 ①: 은행의 안정 운영
- 부도율이 5% → 10% 로 오르면 → 은행 망함
- 정확한 신용평가 = 부도 미리 차단

#### 이유 ②: 금융기관의 사회적 책임
- 주주, 고객, 규제기관 요구 충족
- 자금 사기·과대출 방지

#### 이유 ③: 금융 시스템 안정
- 한 은행 망하면 → 전체로 전이 (2008 위기)
- 신용평가가 시스템 방어선

### 4. 신용평가가 쓰이는 5가지 곳

| 활용 | 무엇? | 너가 닿는 순간 |
|------|------|--------------|
| **대출 심사** | 승인/거절, 한도, 금리 | 신용대출 신청 |
| **신용카드 발급** | 한도, 등급 | 카드 신청 |
| **투자 리스크** | 채권 등급 (AAA, BBB) | 채권 펀드 |
| **보험료 책정** | 보험료 차등 | 자동차 보험 |
| **BNPL** | 후불결제 한도 | 토스 페이먼츠 |

### 5. AI가 신용평가에 들어와서 뭐가 바뀌나?

```
[옛날 (1990년대)]
지점장이 사람 보고 판단
   → 주관적, 느림

[과거 (2000년대)]
FICO/NICE 점수
   → 객관적, 빠름
   → 규칙 기반 (Logistic Regression)

[현재 (2020년대)]
ML/DL + 대체 데이터
   → 더 정확, 더 빠름
   → 대체 데이터 (행동, 통신, SNS)
   → 신용 사각지대 해소
```

> ✅ **여기까지 따라왔으면**: 신용평가가 무엇이고 왜 중요한지 보일 거다.

---

## 🟡 [중급] — 글로벌 신용평가 시스템 비교

### 1. 미국 — "신용 사회"의 원조

#### 1.1 FCRA (Fair Credit Reporting Act, 1970)

미국 신용평가의 법적 기반:
- 신용 정보의 공정성·정확성 보장
- 개인이 자기 신용 보고서 조회 권리
- 오류 정정 권리

#### 1.2 3대 CB (Credit Bureau)

| CB | 설립 | 비고 |
|---|---|---|
| **Equifax** | 1899 (미국) | 미국 본사, 글로벌 운영 |
| **Experian** | 1980 (영국 Nottingham CCN으로 시작; 1996 GUS plc가 TRW 합병해 Experian으로 리브랜딩) | 매출 기준 글로벌 최대 |
| **TransUnion** | 1968 (미국) | 시카고 본사 |

→ 미국 시장에서 세 회사가 신용보고서를 제공. 정확한 점유율은 공개 출처마다 편차가 커서 "약 3등분"으로 단순화하기 어렵다.

> ⚠ 정정: 초기 작성본의 "Equifax 35% / Experian 33% / TransUnion 32%" 단일 점유율은 일관된 1차 출처가 없으며, 매출 기준으로는 Experian이 가장 크다(2023 매출 $6.62B > Equifax $5.12B > TransUnion $3.71B). Experian "1996 (영국)" 설립도 정확히는 1980년 CCN(영국 Nottingham)이 모태이고 1996년은 리브랜딩 시점.

#### 1.3 FICO 스코어

- **300~850** 범위
- **300~579**: Poor (대출 어려움)
- **580~669**: Fair
- **670~739**: Good
- **740~799**: Very Good
- **800~850**: Exceptional

#### 1.4 다중 모델 시대
- FICO (전통)
- VantageScore (3개 CB 공동)
- 은행 자체 모델 (Wells Fargo, Chase 등)

### 2. 한국 — NICE와 KCB 양강

#### 2.1 한국 CB

| CB | 설립 | 시장 점유 |
|---|---|---|
| **NICE 평가정보** | 1985 | ~60% |
| **KCB (코리아크레딧뷰로)** | 2005 | ~40% |

#### 2.2 NICE 점수 vs. KCB 점수

| 점수 범위 | NICE | KCB | 해석 |
|---------|------|-----|------|
| 1~1000 | 950+ | 900+ | 최우수 |
| | 850-949 | 800-899 | 우수 |
| | 750-849 | 700-799 | 일반 |
| | 600-749 | 500-699 | 주의 |
| | <600 | <500 | 위험 |

→ NICE와 KCB는 **점수 체계가 다름**. 토스, 카뱅 등은 NICE 사용 다수.

#### 2.3 한국 신용정보법 (2020 개정)

- **마이데이터** 도입
- 본인 동의 시 → 핀테크에 데이터 전송
- → 토스, 카뱅, 뱅크샐러드의 폭발 성장 동력

### 3. 6개국 신용평가 시스템 비교

<svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">6개국 신용평가 시스템 — 책 §3.2.2 + 한국 보강</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="10">
    <!-- USA -->
    <rect x="20" y="55" width="230" height="105" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="135" y="78" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">🇺🇸 미국</text>
    <text x="135" y="98" text-anchor="middle" fill="#1c1917">FCRA + 3대 CB</text>
    <text x="135" y="115" text-anchor="middle" fill="#57534e">Equifax, Experian, TransUnion</text>
    <text x="135" y="132" text-anchor="middle" fill="#57534e">FICO 300~850 점수</text>
    <text x="135" y="149" text-anchor="middle" font-size="9" fill="#a8a29e">가장 발달, 표준 글로벌</text>
    <!-- Canada -->
    <rect x="260" y="55" width="230" height="105" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="375" y="78" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">🇨🇦 캐나다</text>
    <text x="375" y="98" text-anchor="middle" fill="#1c1917">Equifax, TransUnion</text>
    <text x="375" y="115" text-anchor="middle" fill="#57534e">FCRA 유사 법률</text>
    <text x="375" y="132" text-anchor="middle" fill="#57534e">미국과 유사</text>
    <text x="375" y="149" text-anchor="middle" font-size="9" fill="#a8a29e">300~900 범위</text>
    <!-- Korea -->
    <rect x="500" y="55" width="230" height="105" rx="8" fill="#edf7ef" stroke="#3a7d44" stroke-width="2"/>
    <text x="615" y="78" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">🇰🇷 한국 (보강)</text>
    <text x="615" y="98" text-anchor="middle" fill="#1c1917">NICE, KCB 양강</text>
    <text x="615" y="115" text-anchor="middle" fill="#57534e">신용정보법 + 마이데이터</text>
    <text x="615" y="132" text-anchor="middle" fill="#57534e">1~1000 점수</text>
    <text x="615" y="149" text-anchor="middle" font-size="9" fill="#a8a29e">디지털화 OECD 1위</text>
    <!-- Germany -->
    <rect x="20" y="180" width="230" height="105" rx="8" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="135" y="203" text-anchor="middle" font-size="13" font-weight="700" fill="#5a7a96">🇩🇪 독일</text>
    <text x="135" y="223" text-anchor="middle" fill="#1c1917">SCHUFA 단독 강자</text>
    <text x="135" y="240" text-anchor="middle" fill="#57534e">신용 거래 + 은행 거래</text>
    <text x="135" y="257" text-anchor="middle" fill="#57534e">점수 100-999 (2026.3~)</text>
    <text x="135" y="274" text-anchor="middle" font-size="9" fill="#a8a29e">금융 상품 신청 표준</text>
    <!-- Japan -->
    <rect x="260" y="180" width="230" height="105" rx="8" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="375" y="203" text-anchor="middle" font-size="13" font-weight="700" fill="#5a7a96">🇯🇵 일본</text>
    <text x="375" y="223" text-anchor="middle" fill="#1c1917">대형 은행 자체 시스템</text>
    <text x="375" y="240" text-anchor="middle" fill="#57534e">은행-고객 신뢰 기반</text>
    <text x="375" y="257" text-anchor="middle" fill="#57534e">통합 CB 없음</text>
    <text x="375" y="274" text-anchor="middle" font-size="9" fill="#a8a29e">예금 이력 중심</text>
    <!-- China -->
    <rect x="500" y="180" width="230" height="105" rx="8" fill="#f5e6f0" stroke="#7a6a9a" stroke-width="2"/>
    <text x="615" y="203" text-anchor="middle" font-size="13" font-weight="700" fill="#7a6a9a">🇨🇳 중국 (혁신)</text>
    <text x="615" y="223" text-anchor="middle" fill="#1c1917">위챗·알리페이 모바일</text>
    <text x="615" y="240" text-anchor="middle" fill="#57534e">정부 사회신용 별도 운영</text>
    <text x="615" y="257" text-anchor="middle" fill="#57534e">즈마신용 (2017 인가 거부)</text>
    <text x="615" y="274" text-anchor="middle" font-size="9" fill="#a8a29e">현재는 Alibaba 로열티 프로그램</text>
  </g>
  <text x="380" y="320" text-anchor="middle" font-size="11" font-style="italic" fill="#57534e">스페인·호주·인도·이머징 국가는 책 본문 참조</text>
  <text x="380" y="345" text-anchor="middle" font-size="12" font-weight="700" fill="#1c1917">→ 디지털 인프라가 발달할수록 CB 통합 + AI 평가 가능</text>
  <text x="380" y="370" text-anchor="middle" font-size="10" fill="#57534e">한국·중국·미국이 가장 발달, 일본은 의외로 분산</text>
</svg>

### 4. 신용평가 모델의 5대 활용

#### 활용 ①: 대출 심사

```
[너의 데이터] → [모델] → [결과]
- 연봉 5천만
- 부채 1천만           승인
- 신용점수 800       한도 5000만
- 직장 3년           금리 5.5%
- 카드 연체 0회
```

#### 활용 ②: 신용카드 발급

```
[신청] → [평가] → [등급 + 한도]
- 일반 신용카드: 한도 300만
- 골드 카드: 한도 1000만
- 플래티넘: 한도 3000만+
```

#### 활용 ③: 투자 리스크 (채권 등급)

| 등급 | S&P | Moody's | 의미 |
|------|------|---------|------|
| AAA | AAA | Aaa | 최우수 (미 국채) |
| AA | AA | Aa | 우수 |
| A | A | A | 양호 |
| BBB | BBB | Baa | **투자 적격 최저** |
| BB | BB | Ba | 투자 부적격 (Junk) |
| B | B | B | 위험 |
| CCC | CCC | Caa | 매우 위험 |
| D | D | D | 부도 |

→ BBB 이상 = Investment Grade, 미만 = Junk Bond.

#### 활용 ④: 보험료 책정

미국에선 신용점수가 자동차 보험료에도 영향:
- 좋은 점수: 보험료 할인
- 나쁜 점수: 할증

한국은 직접 영향 적음 (별도 보험 신용평가 모델).

#### 활용 ⑤: BNPL (Buy Now Pay Later)

> ✅ **여기까지 따라왔으면**: 글로벌 신용평가 시스템과 활용 분야가 보일 거다. 다음은 BNPL.

---

## 🔴 [고급] — 핀테크 BNPL의 혁명

### 1. BNPL이란?

#### 1.1 정의
> "지금 사고, 나중에 (보통 4번 분할) 무이자로 결제"

#### 1.2 글로벌 BNPL 시장

| 시기 | 시장 규모 (출처별 상이) |
|------|---------|
| 2020 | $90.69B (Allied Market Research) |
| 2024 | $300B 추정 (다양) |
| 2030E | $3.98T (Allied) ~ $560B (Precedence) — 추정 폭 매우 큼 |

→ 연 평균 20~45% 성장 추정 (출처 마다 차이).

> ⚠ 정정: 초기 작성본의 "2024 $300B → 2030 $1.2T" 는 단일 출처 없음. BNPL 시장 추정은 **보고서간 편차가 매우 큼** (Allied $3.98T vs. Precedence $560B). 단일 수치 인용 시 주의.

#### 1.3 글로벌 주요 BNPL 회사

<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">글로벌 BNPL 회사 — 책 그림 3-1 시각화</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- US -->
    <rect x="20" y="60" width="220" height="180" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="130" y="85" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">🇺🇸 미국</text>
    <text x="130" y="108" text-anchor="middle" fill="#1c1917">Affirm (Max Levchin)</text>
    <text x="130" y="125" text-anchor="middle" fill="#1c1917">PayPal Pay Later</text>
    <text x="130" y="142" text-anchor="middle" fill="#1c1917">Apple Pay Later</text>
    <text x="130" y="159" text-anchor="middle" fill="#1c1917">Zip (호주 진출)</text>
    <text x="130" y="176" text-anchor="middle" fill="#1c1917">Sezzle</text>
    <text x="130" y="193" text-anchor="middle" fill="#1c1917">Splitit</text>
    <text x="130" y="220" text-anchor="middle" font-size="11" font-weight="700" fill="#c4724e">시가총액: $50B+ 합계</text>
    <!-- Europe -->
    <rect x="260" y="60" width="220" height="180" rx="8" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="370" y="85" text-anchor="middle" font-size="13" font-weight="700" fill="#5a7a96">🇪🇺 유럽 + 호주</text>
    <text x="370" y="108" text-anchor="middle" fill="#1c1917">Klarna (스웨덴)</text>
    <text x="370" y="125" text-anchor="middle" fill="#1c1917">Afterpay (호주 → Block 인수)</text>
    <text x="370" y="142" text-anchor="middle" fill="#1c1917">Clearpay (영국)</text>
    <text x="370" y="159" text-anchor="middle" fill="#1c1917">Scalapay (이탈리아)</text>
    <text x="370" y="176" text-anchor="middle" fill="#1c1917">Alma (프랑스)</text>
    <text x="370" y="220" text-anchor="middle" font-size="11" font-weight="700" fill="#5a7a96">Klarna 가치: $46B (2021)</text>
    <!-- Asia -->
    <rect x="500" y="60" width="220" height="180" rx="8" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="610" y="85" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">🌏 아시아 + 한국</text>
    <text x="610" y="108" text-anchor="middle" fill="#1c1917">알리페이 (중국)</text>
    <text x="610" y="125" text-anchor="middle" fill="#1c1917">Tabby (UAE)</text>
    <text x="610" y="142" text-anchor="middle" fill="#1c1917">네이버파이낸셜 (한국)</text>
    <text x="610" y="159" text-anchor="middle" fill="#1c1917">카카오페이 (한국)</text>
    <text x="610" y="176" text-anchor="middle" fill="#1c1917">토스 (한국)</text>
    <text x="610" y="193" text-anchor="middle" fill="#1c1917">쿠팡 (한국, 후불결제)</text>
    <text x="610" y="220" text-anchor="middle" font-size="11" font-weight="700" fill="#3a7d44">한국: 월 30만원 한도 시범</text>
  </g>
</svg>

### 2. 한국 BNPL — 규제 샌드박스

#### 2.1 규제 개선 (책 표 3-1)

| 회사 | 한도 | 기간 |
|------|------|------|
| **네이버파이낸셜** | 월 30만원 | 2021.2 지정 (혁신금융서비스) |
| **카카오페이** | 월 15만원 (교통) | 2022.1 지정 |
| **비바리퍼블리카 (토스)** | 월 30만원 | 2022.3 지정 |

> ⚠ 정정: 초기 작성본에서 토스/카카오페이 한도가 반대로 표기됐었음 (2026.5 검증으로 수정).

→ 금융위 혁신금융서비스 지정 → 정식 출시 가능.

#### 2.2 한국 BNPL 특징
- 한도 제한적 (월 30만원)
- 신용평가 미발달 청년층 타겟
- 무이자 (수수료는 가맹점이 부담)

### 3. 대안 신용평가 (Alternative Credit Scoring)

#### 3.1 전통 데이터 vs. 대안 데이터

```
[전통 데이터]                [대안 데이터]
- 대출 이력                  - SNS 활동
- 카드 이용                  - 통신 사용
- 소득 증명                  - 위치 데이터
- 자산                       - 앱 사용 패턴
                            - 온라인 쇼핑
                            - 결제 행동
                            - 이메일 영수증
```

#### 3.2 대안 데이터의 장점
- **신용 사각지대 해소**: 청년, 자영업자, 이민자
- **더 정밀**: 행동 패턴이 의도보다 정직
- **빠른 평가**: 실시간 가능

#### 3.3 한국 대안 신용평가 사례

| 회사 | 활용 데이터 | 효과 |
|------|-----------|------|
| **토스** | 토스 앱 사용, 통신 | 청년 대출 한도 +30% |
| **카뱅** | 카뱅 거래, 마이데이터 | 신용 미보유자 평가 |
| **NICE** | 통신 + 전자상거래 | NICE Zero 점수 (1000점 새 모델) |
| **KCB** | 모바일 데이터 | KCB Black Box |

#### 3.3 책 표 3-2 풀이 — 한국 은행/핀테크의 대안 데이터 신용평가 (2022~)

책 §3.2.3에서 표 3-2로 나열한 7개 사례:

| 회사 | 대안 데이터 | 타겟 |
|------|-----------|------|
| **신한은행 '땡겨요'** | 배달앱 매출 데이터 | 소상공인 (음식점 사장) |
| **우리은행** | BC카드 가맹점 결제 데이터 | 자영업자 |
| **하나은행** | 자체 입출금 거래 패턴 | 직장 초년생 |
| **SK텔레콤 'T스코어'** | 통신요금 납부·로밍·앱 사용 | 통신만 있는 신파일러 |
| **네이버파이낸셜** | 스마트스토어 매출 + 네이버페이 거래 | 1인 사업자 |
| **카카오뱅크 가명결합** | 교보문고·예스24·롯데멤버스·카카오모빌리티 등 11개 기관 | 일반 차주 (가명정보 결합) |
| **카카오페이** | 결제·송금·교통카드 | 청년 후불결제 |

→ 공통점: **금융권 데이터만으로 부족한 신파일러(thin-file) 평가에 비금융 데이터 결합**. 마이데이터(2022.1) 이후 본격화.

### 4. 핀테크의 신용평가 혁신

#### 4.1 4가지 변화
1. **속도**: 3일 → 5분
2. **데이터**: 정형 → 정형 + 비정형
3. **범위**: 30% 인구 → 80%+ 인구
4. **개인화**: 일률적 → 맞춤 (RLHF)

#### 4.2 단점
- **블랙박스**: 왜 거절됐는지 설명 어려움
- **편향**: 학습 데이터의 차별 재현
- **규제**: 금융위 가이드라인 (XAI 의무)

> ✅ **여기까지 따라왔으면**: BNPL과 대안 신용평가의 의미가 보일 거다.

---

## 🟣 [전공자] — 신용 리스크 학술과 규제

### 1. 신용 리스크의 학술적 정의

#### 1.1 Probability of Default (PD)

기본 정의:
$$ PD = P(\text{Default}) $$

확장 정의 (Basel):
$$ PD = P(\text{Default in next 12 months}) $$

#### 1.2 신용 손실의 3요소

$$ \text{Expected Loss} = PD \times LGD \times EAD $$

- **PD** (Probability of Default): 부도 확률
- **LGD** (Loss Given Default): 부도 시 손실률
- **EAD** (Exposure at Default): 부도 시 잔액

#### 1.3 예시
- PD = 5%
- LGD = 60%
- EAD = 1억
- → Expected Loss = 0.05 × 0.6 × 1억 = **300만원**

### 2. Basel 자본규제와 신용평가

#### 2.1 Basel I (1988)
- 신용 리스크에 대한 자기자본 비율 8% 의무
- 단순한 위험 가중치 (정부 0%, 은행 20%, 기업 100%)

#### 2.2 Basel II (2004)
- **신용 등급별** 정밀 가중치
- 두 가지 방법:
  - **Standard Approach**: 외부 등급 (S&P 등) 사용
  - **Internal Ratings-Based (IRB)**: 은행 자체 모델

#### 2.3 Basel III (2010~)
- 위기 후 자본·유동성 강화
- 신용평가 모델의 검증 의무 강화

> 📄 BCBS. (2017). *Basel III: Finalising post-crisis reforms*. https://www.bis.org/bcbs/publ/d424.htm

### 3. 신용평가의 학술적 발전

#### 3.1 Altman Z-Score (1968)

> 📄 Altman, E. I. (1968). Financial ratios, discriminant analysis and the prediction of corporate bankruptcy. *Journal of Finance*, 23(4).

판별분석 (Discriminant Analysis) 기반 부도 예측:

$$ Z = 1.2 X_1 + 1.4 X_2 + 3.3 X_3 + 0.6 X_4 + 1.0 X_5 $$

- X1: 운전자본/총자산
- X2: 이익잉여금/총자산
- X3: EBIT/총자산
- X4: 시가총액/총부채
- X5: 매출/총자산

**해석**:
- Z > 2.99: 안전
- 1.81 < Z < 2.99: 회색 지대
- Z < 1.81: 부도 위험

→ **60년 지난 지금도 사용** (M&A 실사, 신용 분석).

#### 3.2 Merton Model (1974)

> 📄 Merton, R. C. (1974). On the pricing of corporate debt: The risk structure of interest rates. *Journal of Finance*, 29(2).

기업 부도를 옵션 가격 결정 모델로:
- 기업 자산 가치를 기초자산
- 부채를 행사가격
- 자산이 부채 미만 = 부도

$$ PD = N(-d_2) $$

(Black-Scholes 식의 $d_2$)

#### 3.3 KMV Model
Merton 모델의 실용화. Moody's가 인수 (2002).

#### 3.4 Logistic Regression (전통 신용평가)

가장 많이 쓰이는 모델:

$$ P(\text{Default}) = \frac{1}{1 + e^{-(\beta_0 + \beta_1 X_1 + \dots + \beta_n X_n)}} $$

→ 해석 가능 + 안정 → 규제 친화적.

#### 3.5 머신러닝 (2010~)

> 📄 Lessmann, S., Baesens, B., Seow, H.-V., & Thomas, L. C. (2015). Benchmarking state-of-the-art classification algorithms for credit scoring. *European Journal of Operational Research*, 247(1), 124–136.

41개 알고리즘 벤치마크. **Random Forest 와 앙상블 계열**(HCES-Bag, AvgS 등) 이 LR 단독보다 유의하게 우수. NN과 GB도 상위권. 단일 우승 알고리즘이 아니라 "앙상블이 LR을 일관되게 이긴다"는 게 핵심 결론.

### 4. 미국 신용평가 규제

#### 4.1 FCRA (Fair Credit Reporting Act, 1970)
- 신용 정보의 공정성
- 소비자 권리

#### 4.2 ECOA (Equal Credit Opportunity Act, 1974)
- 신용 차별 금지
- 인종, 성별, 종교, 출신국 등 보호 사유

#### 4.3 Reg B
- ECOA 시행규칙
- AI 시대에 **Disparate Impact** (간접 차별) 적용

#### 4.4 CFPB (Consumer Financial Protection Bureau)
- 신용평가 감독 기관
- 알고리즘 차별 조사 권한

### 5. 한국 신용정보법

> 📄 신용정보의 이용 및 보호에 관한 법률 (마이데이터 도입 개정: **법률 제16957호, 2020.2.4**).
> ⚠ 정정: 초기 작성본의 "법률 제17354호 (2020.2.4)" 는 오류. 17354호는 2020.6.9 다른 법 개정. 마이데이터 도입은 16957호가 정확.

핵심:
- 신용평가 회사 (CB) 인가
- 본인신용정보관리업 (마이데이터)
- 데이터 전송 의무

#### 5.1 한국 마이데이터 시행 (**2022.1.5 16:00 전면 시행**)
- 본인 동의 → 다른 기관에 데이터 전송
- 표준 API
- 핀테크의 결정적 인프라
- 당초 2022.1.1 예정이었으나 API 안정화 문제로 1.5 로 연기 (코스콤 보도)

### 6. AI 신용평가의 윤리적 도전

#### 6.1 Apple Card 차별 (2019)
- 부부 동일 조건, 남편 한도 20배
- NYDFS 조사
- 결론: 모델이 성별을 직접 안 봤어도 **Proxy 변수**로 차별 가능

#### 6.2 한국 금융위 AI 가이드라인 (2021.7.8)
4대 핵심 가치 (FSC 공식): ① 책임성-위험관리, ② AI 학습데이터의 정확성·안전성, ③ 투명성·공정성, ④ 소비자 권리 보호. 설명가능성은 운영 5단계 체크리스트에 포함.

#### 6.3 EU AI Act (2024)
신용평가 = **High-Risk** → 사전 적합성 평가 의무.

---

### 🟣 [전공자 심화] — Altman Z-score (1968) 의 한계와 후속 연구

#### 원논문 한계
- **다변량 판별분석 (MDA) 가정의 강함**: 두 집단(부도/정상)의 공분산 동등 + 다변량 정규성 가정. Ohlson (1980) 이 첫 정면 비판.
- **표본 매칭 편향**: Altman 원논문은 33쌍 매칭(부도 vs 동종업 정상). 모집단 부도율(<3%)과 표본 부도율(50%) 의 큰 괴리 → 사후 확률 보정 필요.
- **제조업 + 미국 상장사 한정**: X4 = 시가총액/총부채 가 비상장기업에 무의미 → Altman 본인이 Z'(비상장), Z''(비제조업, X5 제거) 로 재계측.
- **시간 비정상성 (non-stationarity)**: 1968 추정 계수가 60년 동안 고정. 1990년대 이후 IFRS/K-IFRS 회계기준 변화로 X2(이익잉여금/총자산) 의 의미가 달라짐.
- **이머징마켓 적용 시 정확도 급락**: 멕시코 표본에서 부도기업 오분류율 75%(SciELO 2021), 1년 전 정확도 51.8% → 4년 전 11.4% 로 시계열 열화.

#### 비판 문헌
- Ohlson, J. A. (1980). Financial ratios and the probabilistic prediction of bankruptcy. *Journal of Accounting Research*, 18(1), 109-131. — MDA 의 분포 가정을 비판하고 **로지스틱 회귀 기반 O-Score** 제시. 1년 전 정확도 96.12%.
- Zmijewski, M. E. (1984). Methodological issues related to the estimation of financial distress prediction models. *Journal of Accounting Research*, 22, 59-82. — **Probit 모형 + 선택 편향(choice-based sampling)** 문제 정식화.
- Shumway, T. (2001). Forecasting bankruptcy more accurately: A simple hazard model. *Journal of Business*, 74(1), 101-124. — Altman 의 정적 모형이 시계열 정보를 버린다는 점을 지적. Hazard 모형으로 상위 decile 부도 정확도 75% vs Altman 63% vs Zmijewski 43%.

#### 후속 연구 동향 (2015~)
- Tian, S., Yu, Y., & Guo, H. (2015). Variable selection and corporate bankruptcy forecasts. *Journal of Banking & Finance*, 52, 89-100. — **LASSO 기반 변수 선택**으로 39개 후보 변수에서 데이터 주도형 선택. https://doi.org/10.1016/j.jbankfin.2014.12.003
- Altman, E. I., Iwanicz-Drozdowska, M., Laitinen, E. K., & Suvas, A. (2017). Financial distress prediction in an international context: A review and empirical analysis of Altman's Z-score model. *Journal of International Financial Management & Accounting*, 28(2), 131-171. — 31개국 데이터로 Z-score 의 국가별 보정 필요성 실증.
- Mai, F., Tian, S., Lee, C., & Ma, L. (2019). Deep learning models for bankruptcy prediction using textual disclosures. *European Journal of Operational Research*, 274(2), 743-758. — MD&A 텍스트 + CNN/Average Embedding 으로 회계 기반 모형 보완.
- Barboza, F., Kimura, H., & Altman, E. (2017). Machine learning models and bankruptcy prediction. *Expert Systems with Applications*, 83, 405-417. — RF/SVM/Boosting 이 Altman 대비 AUC 0.93 vs 0.81 로 약 12%p 우수.

#### 한국 적용 시 주의점
- **K-IFRS 도입 (2011)** 이후 영업이익 정의 변화 → X3 (EBIT/총자산) 계수 재추정 필수. 한국신용평가/NICE 평가정보는 자체 가중치 사용.
- **시가총액 부재**: 코스닥/코넥스 비상장 중소기업은 X4 가 정의되지 않음 → Altman Z' 또는 Z'' 사용.
- **재벌 구조의 상호출자**: 연결재무제표 vs 별도재무제표 선택이 X4, X5 에 큰 차이. NICE/KCB 는 연결 우선.
- **부도 정의 차이**: 한국은 회생/파산법상 회생절차개시(법원 결정) 가 표준. Altman 은 Chapter 7/11 기준 → 한국 표본 라벨링 시 회생개시 ≠ 청산 구분.

---

### 🟣 [전공자 심화] — Merton (1974) 구조 모형의 한계와 후속 연구

#### 원논문 한계
- **자본구조 극단 단순화**: 만기 T 단일 zero-coupon bond 1개만 가정. 실제 기업은 만기/순위/담보 다층 구조.
- **자산가치 V_t 의 비관측성**: V_t 와 sigma_V 는 직접 관측 불가 → 주가 변동성으로부터 역산해야 함 (Jones-Mason-Rosenfeld 1984 iterative procedure, KMV 의 EM 알고리즘).
- **만기 시점에만 부도**: T 이전 부도 불가 → 단기 신용스프레드가 0으로 수렴하는 "credit spread puzzle"(Eom-Helwege-Huang 2004 RFS).
- **무위험 이자율/변동성 상수 가정**: GBM(기하브라운운동) 가정 + sigma_V 상수 → 변동성 미소(volatility skew) 미반영. Hull-Nelken-White (2004) 가 정면 비판.
- **회수율 내생화 부재**: LGD 가 (V_T/D) 로 자동 결정되나 실증적으로 회수율은 산업/순위/거시 사이클에 강하게 의존 (Altman-Brady-Resti-Sironi 2005 JBF).

#### 비판 문헌
- Jones, E. P., Mason, S. P., & Rosenfeld, E. (1984). Contingent claims analysis of corporate capital structures: An empirical investigation. *Journal of Finance*, 39(3), 611-625. — Merton 모형이 **투자등급 채권 스프레드를 체계적으로 과소예측**함을 실증.
- Eom, Y. H., Helwege, J., & Huang, J. Z. (2004). Structural models of corporate bond pricing: An empirical analysis. *Review of Financial Studies*, 17(2), 499-544. — Merton/Geske/Leland-Toft/Collin-Dufresne-Goldstein/Longstaff-Schwartz 5개 모형 동시 평가, 모두 단기 스프레드 과소예측.
- Hull, J., Nelken, I., & White, A. (2004). Merton's model, credit risk, and volatility skews. *Journal of Credit Risk*, 1(1), 3-28. — 옵션 시장 변동성 미소가 Merton sigma_V 추정에 시사하는 바.

#### 후속 연구 동향 (확장 모형)
- **Black & Cox (1976)** — *Journal of Finance*, 31(2), 351-367. First-passage 모형으로 만기 이전 부도 도입. 부도 장벽(barrier) 개념의 효시.
- **KMV / Moody's EDF** — Crosbie, P., & Bohn, J. (2003). *Modeling Default Risk*. Moody's KMV White Paper. Distance-to-Default (DD) → 경험적 EDF 매핑. https://www.moodys.com/sites/products/ProductAttachments/MFKMV_DefaultRisk.pdf
- **CreditGrades (2002)** — Finger, C. C., Finkelstein, V., Lardy, J.-P., Pan, G., Ta, T., & Tierney, J. *CreditGrades Technical Document*. RiskMetrics Group. 부도 장벽의 불확실성(uncertain default barrier) 도입으로 단기 스프레드 puzzle 완화. https://www.creditrisk.ru/publications/files_attached/cgtechdoc.pdf
- **Leland & Toft (1996)** — *Journal of Finance*, 51(3), 987-1019. 최적 자본구조 + 만기 분포(rolling debt) 내생화. Endogenous default barrier.
- **Bharath & Shumway (2008)** — Forecasting default with the Merton distance to default model. *Review of Financial Studies*, 21(3), 1339-1369. — KMV-Merton DD 의 예측력은 모형 자체보다 **DD 의 입력 변수(레버리지, 자산 변동성)** 에서 기인함을 보임 → "naive DD" 가 정식 DD 와 거의 동등.
- Duan, J.-C., Sun, J., & Wang, T. (2012). Multiperiod corporate default prediction—A forward intensity approach. *Journal of Econometrics*, 170(1), 191-209. — Forward intensity model. NUS-CRI 부도확률 시스템의 기초.

#### 한국 적용 시 주의점
- **재벌 상호지급보증**: V_t 의 경계가 모호 (계열사 채무인수 가능성). 단독 Merton 적용 시 PD 과대평가.
- **KRX 상장요건 + 관리종목 지정** 이 사실상 부도 장벽으로 작동 → Black-Cox 가 더 현실적.
- **변동성 추정**: KOSPI/KOSDAQ 일중 변동성 vs 옵션 임플라이드 변동성 선택. 코스닥 소형주는 거래 빈도 낮아 옵션 시장 없음 → 역사적 변동성만 가능.
- **한국형 EDF**: 한신평·NICE 의 내부 모형은 Merton 보다 Reduced-form(Hazard) 우세. 단, IFRS 9 ECL 산정 시 PIT-PD 산출에서 Merton DD 가 macro overlay 로 활용.

---

## 📚 책에 없지만 알면 좋은 것

### 🔍 보충 1 — 한국 신용평가 점수 체계 상세

#### NICE 1000점 척도 (참고)

NICE 평가정보 공식 점수는 1000점 만점. **공식 통계상 900점 이상이 약 40~47% 차지** (점수대 기준 공시).

| 점수대 | 의미 |
|------|------|
| 950+ | 최우수 (1등급 수준) |
| 900-949 | 우수 |
| 850-899 | 양호 |
| 750-849 | 일반 |
| 600-749 | 주의~저신용 |
| <600 | 위험 |

> ⚠ 정정: 초기 작성본에서 1등급 5%, 2등급 15%, 3등급 25% ... 등 등급별 정확한 인구 비율을 제시했으나, **NICE 는 점수대 기준으로만 공시하며 위와 같은 등급별 비율은 NICE 공식 자료에 없음**. 점수대별 상위 비율 (예: 900점+ 가 40~47%) 만 확인 가능.

#### 점수 영향 요소
1. **상환 이력 (50%)**: 연체 여부, 빈도
2. **부채 수준 (30%)**: 총 부채 / 소득
3. **신용 거래 기간 (10%)**: 오래될수록 좋음
4. **신용 형태 (5%)**: 다양한 종류 활용
5. **조회 빈도 (5%)**: 짧은 시간 다수 조회 = 부정적

### 🔍 보충 2 — 신용카드 시장의 신용평가

#### 한국 카드사 신용평가
- 자체 모델 + NICE/KCB 점수 결합
- 회원별 한도 자동 조정
- 사기 탐지 (Ch4)

#### 한국 7대 카드사 점유 (2023, 취급액 기준)
1. 신한카드 — **17.57%**
2. 삼성카드 — **16.26%**
3. 현대카드 — **15.50%**
4. KB국민카드 — **14.37%**
5. 롯데카드 — **10.60%**
6. 우리카드 — **7.94%**
7. 하나카드 — **6.91%**

> ⚠ 정정: 초기 작성본에서 순서/수치 오류. 실제 현대 > KB, 롯데 > 우리.
> 출처: 컨슈머뉴스 (2024)

### 🔍 보충 3 — Subprime Crisis 2008과 신용평가 실패

#### 사건
- 미국 주택 대출에서 **Subprime** (저신용) 대출 폭증
- 신용평가 회사 (S&P, Moody's) 가 MBS에 AAA 등급 부여
- 실제로는 BBB 이하 → 폭락 → 글로벌 위기

#### 교훈
- **신용평가 회사가 발행자에게 보수 받음** = 이해상충
- 모델 가정의 한계 (정상 분포)
- AI 시대도 같은 위험 가능

### 🔍 보충 4 — BNPL의 다크사이드

#### 부도율 동향
- 2024 미국 BNPL 평균 부도율: 약 1.5~2% 수준 (Richmond Fed 등). 신용카드 30+일 연체율은 8.8% (2024 Q3 NY Fed) — **BNPL이 카드보다 낮음**.
- 단, BNPL **이용자 중 위험군**(소득 하위, 다중 BNPL 사용자) 의 부도율은 5%를 넘기도 함 → "BNPL 자체가 위험"이 아니라 **타깃 인구 차이**.
- "Phantom Debt" (어디서 빌렸는지 추적 어려움) 우려는 여전히 존재.

> ⚠ 정정: 초기 작성본은 "BNPL 부도율 5% > 신용카드 3%"로 표현했으나 평균치는 정반대다. BNPL 평균 부도율은 신용카드 연체율보다 낮은 편이며, "특정 위험군 5%+" 표현이 정확.

#### 규제 강화
- 미국 CFPB 2024.5 Interpretive Rule로 BNPL을 Regulation Z 일부 적용 대상으로 해석 (분쟁/환불/명세서 권리). **2025.4 신규 CFPB 지도부가 해석 규칙 철회** — 다만 법원은 여전히 2024 해석을 참고 가능.
- EU도 신용 평가 의무화 추진
- 한국도 한도 제한 유지

### 🔍 보충 5 — Open Banking과 신용평가

#### Open Banking 효과
- 다른 은행 데이터 합법적 조회
- AI 신용평가의 데이터 폭증
- 한국 마이데이터 = Open Banking 확장판

#### 글로벌 트렌드
- 영국: PSD2 (2018)
- 호주: CDR (Consumer Data Right, 2020)
- 한국: 마이데이터 (2022)
- 미국: CFPB 1033 (2024)

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. 한국 신용점수 NICE 850점 = 미국 FICO 몇 점?

**A.** **대략 700~720점** (Good 등급).

```
NICE 950+ (1등급) ≈ FICO 800+ (Exceptional)
NICE 900   (2등급) ≈ FICO 740-799 (Very Good)
NICE 850   (3등급) ≈ FICO 700-739 (Good)
NICE 750   (5등급) ≈ FICO 670-699 (Fair)
NICE 600   (8등급) ≈ FICO 580-619 (Poor)
```

### Q2. CB 회사들이 내 점수를 어떻게 계산?

**A.** 비공개. 추정:
- 5가지 요소 가중 평균 (위 보충 1)
- 머신러닝 모델 (대안 데이터 추가 시)
- 정기 업데이트 (월 단위)

### Q3. 신용카드 안 쓰면 점수 어떻게 되나?

**A.** **점수 형성 자체가 안 됨** → 미평가자.
- 새 대출 시 불리 (정보 없음)
- 해결: 작은 신용카드 1개 + 잘 갚기

### Q4. BNPL 쓰면 신용점수 영향?

**A.** **글로벌**: 일부 BNPL은 CB에 보고 (점수 영향).
**한국**: 아직 영향 적음 (한도 30만원).

### Q5. 대체 데이터로 신용평가받으려면?

**A.** **마이데이터 동의** 필요:
- 토스, 카뱅 등에 본인 동의
- 통신 + 금융 데이터 합산
- 새 점수 산출 (NICE Zero, KCB Pro 등)

### Q6. 신용평가 모델이 차별하면 어떻게?

**A.** 구제 방법:
- 한국: 금감원 분쟁 조정
- 미국: CFPB 신고
- 법적 대응: 신용정보법 위반 시 손해배상

→ **AI 시대에 더 중요**. Apple Card 사건이 경고.

### Q7. 신용평가 모델 만드는 회사에 취업하려면?

**A.** 한국 주요 회사:
- NICE 평가정보 / KCB
- 시중은행 신용평가 팀
- 핀테크 (토스, 카뱅, 뱅크샐러드)
- 신용정보회사 (Equifax 한국 진출 등)

필요 역량:
- Python + sklearn + XGBoost
- 통계 + 시계열
- 금융 도메인 (대출, 카드)
- SAS (전통 회사)

---

## 🎯 이 절에서 가져갈 핵심 7가지

1. **신용 리스크 = 안 갚을 가능성 (PD)**. 정보 비대칭 해소가 본질.
2. **3대 활동**: 신용평가 시스템 + 위험 기반 가격 + 지속 모니터링.
3. **5대 활용**: 대출·카드·투자·보험·BNPL.
4. **6개국 비교**: 미국 (CB 3사) · 한국 (NICE/KCB) · 독일 (SCHUFA) · 일본 (은행 자체) · 중국 (모바일 혁신) · 캐나다 (미국 유사).
5. **BNPL 시장 폭증** (출처별 차이 큼): 2020 $91B → 2030E 추정 $560B~$3.98T.
6. **대안 데이터 (통신, SNS, 행동)** 가 신용 사각지대 해소.
7. **AI 시대의 윤리**: Apple Card 사건처럼 차별 위험 + 규제 (한국 금융위, EU AI Act).

---

## 📖 더 읽을거리

### 신용평가 표준 교과서
- Siddiqi, N. (2017). *Intelligent Credit Scoring* (2nd ed.). Wiley. — **바이블**.
- Thomas, L. C. (2009). *Consumer Credit Models*. Oxford UP.
- Bessis, J. (2015). *Risk Management in Banking* (4th ed.). Wiley.

### 학술 논문
- Altman, E. I. (1968). Financial ratios, discriminant analysis and the prediction of corporate bankruptcy. *JoF*.
- Merton, R. C. (1974). On the pricing of corporate debt. *JoF*.
- Lessmann, S., et al. (2015). Benchmarking state-of-the-art classification algorithms for credit scoring. *EJOR*.

### 한국 자료
- 신용정보의 이용 및 보호에 관한 법률 (2020 개정).
- 한국신용정보원 보고서.
- 금융위원회 마이데이터 가이드라인.

### Basel 규제
- BCBS. (2017). *Basel III: Finalising post-crisis reforms*. https://www.bis.org/

### BNPL
- McKinsey. (2024). *BNPL: From Niche to Norm*.
- CB Insights. (2024). *State of BNPL Report*.

### AI 차별
- NYDFS. (2021). *Report on Apple Card Investigation*.
- Barocas, S., Hardt, M., & Narayanan, A. (2023). *Fairness and Machine Learning*. — 무료.

---

## 📋 검증 노트 / 변경 이력

> 이 절의 본문 내 "⚠ 정정" 주석을 한곳에 모은 변경 이력.

| # | 항목 | 초기 작성본 | 수정 내용 | 1차 출처 |
|---|---|---|---|---|
| 1 | NICE 등급별 인구 비율 | "1등급 5% / 2등급 15% ..." 등 등급별 정확 비율 | NICE는 점수대 기준으로만 공시. 등급별 비율 공식 자료 없음 | NICE 공식 |
| 2 | 카드사 시장 점유율 순서 | 신한 → 삼성 → 현대 → KB → 롯데 → 우리 | 신한 → 삼성 → **현대 → KB → 롯데 → 우리** (순서 정정) | [여신금융협회](https://www.crefia.or.kr/) |
| 3 | 신용정보법 제17354호 | 법률 제17354호 (2020.2.4) | **법률 제16957호 (2020.2.4)** | [법제처](https://www.law.go.kr/) |
| 4 | 마이데이터 시행일 | 2022년 1월 시행 | **2022.1.5 16:00 전면 시행** (당초 1.1 예정 → API 안정화로 연기) | [코스콤](https://newsroom.koscom.co.kr/29464) |
| 5 | 토스/카카오페이 BNPL 한도 | 토스 15만 / 카카오 30만 | **카카오 15만(교통)/토스 30만** (반대) | 각사 보도자료 |
| 6 | BNPL 시장 규모 | "2024 $300B → 2030 $1.2T" | 단일 출처 없음; 보고서간 편차 큼 (Allied $3.98T vs Precedence $560B) | [Grand View Research](https://www.grandviewresearch.com/industry-analysis/bnpl-market) |
| 7 | 미국 3대 CB 점유율 | Equifax 35% / Experian 33% / TransUnion 32% | 단일 출처 없음; 매출은 Experian이 최대 (2023 $6.62B) | [Experian Wikipedia](https://en.wikipedia.org/wiki/Experian) |
| 8 | Experian 설립 | 1996 (영국) | **1980 (CCN, Nottingham UK)**; 1996은 리브랜딩 | 同上 |
| 9 | SCHUFA 점수 | 100 만점 | **100-999 (2026.3.17~ 신시스템)** | [SCHUFA](https://www.schufa.de/) |
| 10 | 즈마신용 | "대화·친구·쇼핑 분석" | 2017 인가 거부, 2020 신용평가 중단, 현재 Alibaba 로열티 프로그램 | [Zhima Credit Wikipedia](https://en.wikipedia.org/wiki/Zhima_Credit) |
| 11 | Lessmann 2015 결론 | "RF/GB 최고" | **앙상블이 LR 일관 능가** (RF/HCES-Bag/AvgS), NN/GB 상위권. 단일 우승 아님 | [EJOR 2015](https://www.sciencedirect.com/science/article/abs/pii/S0377221715004208) |
| 12 | BNPL vs 카드 부도율 | "BNPL 5% > 카드 3%" | **반대**: BNPL 평균 <2%, 카드 30+일 연체율 8.8% (2024 Q3 NY Fed). 위험군은 5%+ | [Richmond Fed 2025](https://www.richmondfed.org/publications/research/economic_brief/2025/eb_25-03) |
| 13 | CFPB BNPL 2024 규제 | "신용카드와 동일 규제" | Reg Z 일부 적용 해석 → **2025.4 신규 지도부가 해석 규칙 철회** | [CFPB withdrawn](https://www.consumerfinanceandfintechblog.com/2025/03/cfpb-to-withdraw-bnpl-interpretive-rule-amid-broader-agency-rollback/) |
| 14 | 금융위 AI 가이드라인 | "5대 원칙" | **4대 핵심 가치** (책임성-위험관리·데이터 정확성/안전성·투명성/공정성·소비자 권리 보호) | [FSC](https://www.fsc.go.kr/no010101/76206) |

---

> **다음 절 예고** — §3.3 + §3.4 신용 리스크 관리 체계
> 4가지 관리 시스템 (Application/Behavioral/Collection/Recovery) + AI 적용 영역 특징.
