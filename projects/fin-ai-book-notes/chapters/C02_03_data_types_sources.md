# 2.4 ~ 2.5 금융 투자 데이터 유형과 소스 — *Data Types & Sources*

> **해설 분량**: 약 25쪽
> **읽는 데 걸리는 시간**: 약 45분

---

## 🪧 이 절을 한 줄로

> 금융 투자 데이터는 **3가지 유형** (마켓·펀더멘털·대체) 으로 나뉘고, **6가지 기준** (신뢰성·세분화·효용성·사용범위·행동가능성·희소성) 으로 평가하며, **무료·유료 소스 7~10개** 가 표준이다.
> 한국 시장 한정 추가 소스 5개 + 글로벌 표준 소스 5개를 정리한다.

책은 §2.4에서 3 데이터 유형 + 데이터 표현을 다루고, §2.5에서 표 2-1로 오픈소스 소스를 요약한다. 이 해설집은:
1. **3가지 유형의 실제 데이터 예시** 코드 포함
2. **한국 특화 데이터 소스** 보강
3. **유료 vs. 무료 비교**
4. **2024년 기준 최신 소스 리스트**

### 📍 미리 그릴 큰 그림

<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">금융 투자 데이터 — 3가지 유형 × 데이터 소스 × 평가 기준</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- 3 Types -->
    <text x="380" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#1c1917">▼ 3가지 데이터 유형</text>
    <rect x="40" y="70" width="220" height="90" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="150" y="92" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">① 마켓 데이터</text>
    <text x="150" y="112" text-anchor="middle" font-size="10" fill="#1c1917">가격, 거래량, 호가</text>
    <text x="150" y="130" text-anchor="middle" font-size="10" fill="#57534e">OHLCV, Bid/Ask</text>
    <text x="150" y="148" text-anchor="middle" font-size="10" fill="#a8a29e">→ 실시간/일간</text>
    <rect x="270" y="70" width="220" height="90" rx="8" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="380" y="92" text-anchor="middle" font-size="13" font-weight="700" fill="#5a7a96">② 펀더멘털 데이터</text>
    <text x="380" y="112" text-anchor="middle" font-size="10" fill="#1c1917">재무제표, 비율</text>
    <text x="380" y="130" text-anchor="middle" font-size="10" fill="#57534e">P/E, ROE, EPS</text>
    <text x="380" y="148" text-anchor="middle" font-size="10" fill="#a8a29e">→ 분기/연간</text>
    <rect x="500" y="70" width="220" height="90" rx="8" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="610" y="92" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">③ 대체 데이터</text>
    <text x="610" y="112" text-anchor="middle" font-size="10" fill="#1c1917">위성, SNS, 거래</text>
    <text x="610" y="130" text-anchor="middle" font-size="10" fill="#57534e">크레딧카드, 트위터</text>
    <text x="610" y="148" text-anchor="middle" font-size="10" fill="#a8a29e">→ 다양</text>
    <!-- 6 Criteria -->
    <text x="380" y="195" text-anchor="middle" font-size="13" font-weight="700" fill="#7a6a9a">▼ 6가지 평가 기준 (저자 전작)</text>
    <rect x="80" y="210" width="120" height="40" rx="6" fill="#f5e6f0" stroke="#7a6a9a"/>
    <text x="140" y="235" text-anchor="middle" font-size="11">신뢰성</text>
    <rect x="210" y="210" width="120" height="40" rx="6" fill="#f5e6f0" stroke="#7a6a9a"/>
    <text x="270" y="235" text-anchor="middle" font-size="11">세분화</text>
    <rect x="340" y="210" width="120" height="40" rx="6" fill="#f5e6f0" stroke="#7a6a9a"/>
    <text x="400" y="235" text-anchor="middle" font-size="11">효용성</text>
    <rect x="470" y="210" width="120" height="40" rx="6" fill="#f5e6f0" stroke="#7a6a9a"/>
    <text x="530" y="235" text-anchor="middle" font-size="11">사용 범위</text>
    <rect x="600" y="210" width="80" height="40" rx="6" fill="#f5e6f0" stroke="#7a6a9a"/>
    <text x="640" y="235" text-anchor="middle" font-size="11">행동 가능성</text>
    <rect x="295" y="260" width="170" height="40" rx="6" fill="#f5e6f0" stroke="#7a6a9a" stroke-width="2"/>
    <text x="380" y="285" text-anchor="middle" font-size="11" font-weight="700">희소성 (최우선)</text>
  </g>
</svg>

---

## 🟢 [초급] — 일상 비유로 잡는 감

### 1. 데이터 3유형 — 한 줄 비유

| 유형 | 비유 | 예시 | 어디서 |
|------|------|------|--------|
| **마켓 데이터** | "지금 가격 얼마?" | 삼성전자 종가 75,000원 | 거래소, Yahoo Finance |
| **펀더멘털 데이터** | "이 회사 얼마짜리?" | 삼성전자 매출 300조 | DART, Bloomberg |
| **대체 데이터** | "이 회사 사람 많이 찾나?" | 갤럭시 검색량 ↑ | Google Trends, 위성 |

### 2. 같은 회사를 3 데이터로 보기 — 삼성전자 예시

#### 마켓 데이터 (Market Data)
```
2024-05-15: 
  시가 75,000  / 고가 75,800
  저가 74,500  / 종가 75,200
  거래량 12,345,678주
```
→ "오늘 거래 어떻게 됐나?"

#### 펀더멘털 데이터 (Fundamental Data)
```
2024 Q1:
  매출 71조 / 영업이익 6.6조
  EPS 1,260원 / PER 25배
  ROE 6.5% / 부채비율 22%
```
→ "이 회사 얼마나 잘 벌고 있나?"

#### 대체 데이터 (Alternative Data)
```
- 갤럭시 S25 사전예약 50만대 (출처: 통신사)
- "삼성전자" 트위터 멘션 +15% (출처: SNS)
- 평택 공장 위성사진: 컨테이너 +20% (출처: Spire Global)
- 임직원 LinkedIn 채용 글 -10% (출처: LinkedIn)
```
→ "회사 미래가 좋아지나?"

### 3. 데이터를 잘 고르는 6가지 기준

저자 전작 《퀀트 전략을 위한 인공지능 트레이딩》(2020) 에서 제시한 기준:

#### 기준 ①: 신뢰성 (Reliability)
- "이 데이터 진짜야?"
- 부정확하면 모델도 부정확 (GIGO)

#### 기준 ②: 세분화 (Granularity)
- "얼마나 잘게 쪼개졌어?"
- 일간 vs. 분 단위 vs. 호가 단위

#### 기준 ③: 효용성 (Utility)
- "내 문제 푸는 데 쓸 수 있어?"
- 흥미로워도 활용 못 하면 의미 없음

#### 기준 ④: 사용 범위 (Scope)
- "여러 문제에 쓸 수 있어?"
- 한 가지에만 쓰는 데이터는 가치 낮음

#### 기준 ⑤: 행동 가능성 (Actionability)
- "이걸 보고 뭘 해야 할지 명확해?"
- 통계만 봐도 의사결정 어려우면 무의미

#### 기준 ⑥: 희소성 (Rarity) — **최우선**
- "남이 못 가진 데이터야?"
- 모두가 가진 데이터로는 알파 못 만듦

> 💡 **희소성이 알파의 원천**. Renaissance가 외부에 알고리즘 공개 안 하는 이유.

> ✅ **여기까지 따라왔으면**: 데이터를 그냥 모으는 게 아니라 평가하는 기준이 있다는 게 보일 거다.

---

## 🟡 [중급] — 데이터 유형별 깊이 보기

### 1. 마켓 데이터 (Market Data) — 가장 기본

#### 1.1 OHLCV 데이터 — 일봉의 표준

```
O (Open):  시가
H (High):  고가
L (Low):   저가
C (Close): 종가
V (Volume): 거래량
```

#### 1.2 캔들 차트로 시각화

<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">캔들스틱 — OHLCV 1봉의 시각화</text>
  <line x1="80" y1="240" x2="680" y2="240" stroke="#1c1917" stroke-width="1.5"/>
  <line x1="80" y1="240" x2="80" y2="50" stroke="#1c1917" stroke-width="1.5"/>
  <!-- Bullish candle (green) -->
  <g>
    <line x1="180" y1="80" x2="180" y2="180" stroke="#3a7d44" stroke-width="1"/>
    <rect x="170" y="100" width="20" height="60" fill="#3a7d44"/>
    <text x="220" y="80" font-size="10" fill="#3a7d44">고가</text>
    <text x="220" y="100" font-size="10" fill="#3a7d44">종가 (close > open)</text>
    <text x="220" y="160" font-size="10" fill="#3a7d44">시가</text>
    <text x="220" y="180" font-size="10" fill="#3a7d44">저가</text>
    <text x="180" y="265" text-anchor="middle" font-size="11" font-weight="700" fill="#3a7d44">상승 캔들</text>
  </g>
  <!-- Bearish candle (red) -->
  <g>
    <line x1="480" y1="80" x2="480" y2="180" stroke="#c4724e" stroke-width="1"/>
    <rect x="470" y="100" width="20" height="60" fill="#c4724e"/>
    <text x="520" y="80" font-size="10" fill="#c4724e">고가</text>
    <text x="520" y="100" font-size="10" fill="#c4724e">시가 (open > close)</text>
    <text x="520" y="160" font-size="10" fill="#c4724e">종가</text>
    <text x="520" y="180" font-size="10" fill="#c4724e">저가</text>
    <text x="480" y="265" text-anchor="middle" font-size="11" font-weight="700" fill="#c4724e">하락 캔들</text>
  </g>
</svg>

#### 1.3 마켓 데이터의 시간 단위

| 단위 | 데이터 양 | 활용 |
|------|---------|------|
| Tick | 가장 세밀 | HFT |
| 1초 | 매우 큼 | Day Trading |
| 1분 | 일간 480 봉 | Swing |
| 5분 | 일간 80 봉 | Swing |
| 30분 | 일간 13 봉 | Position |
| 일간 | 1년 250 봉 | Long-term |
| 주간 | 1년 52 봉 | Long-term |
| 월간 | 1년 12 봉 | Macro |

#### 1.4 호가 (Bid/Ask) 데이터

```
[매도 호가]                    [매수 호가]
75,500 - 1,000주          75,400 - 2,000주
75,600 - 2,500주          75,300 - 3,500주
75,700 - 5,000주          75,200 - 1,000주
...                       ...

→ 매수/매도 압력 파악
```

### 2. 펀더멘털 데이터 (Fundamental Data)

#### 2.1 재무제표 3종

| 재무제표 | 영문 | 내용 | 빈도 |
|---------|------|------|------|
| 손익계산서 | Income Statement | 매출·비용·이익 | 분기 |
| 재무상태표 | Balance Sheet | 자산·부채·자본 | 분기 |
| 현금흐름표 | Cash Flow Statement | 영업·투자·재무 CF | 분기 |

#### 2.2 주요 비율 (Financial Ratios)

| 비율 | 공식 | 해석 |
|------|------|------|
| **P/E** (Price/Earnings) | $P/EPS$ | 주가 / 주당순이익. 25배 = 25년 수익 |
| **P/B** (Price/Book) | $P/BPS$ | 주가 / 주당장부가. 1배 미만 = 자산보다 저렴 |
| **ROE** (Return on Equity) | $NI/E$ | 자본 효율성. 10% 이상이면 우량 |
| **ROA** (Return on Assets) | $NI/A$ | 자산 효율성 |
| **부채비율** | $D/E$ | 부채 / 자본. 100% 이하 안전 |
| **유동비율** | $CA/CL$ | 유동자산 / 유동부채. 150% 이상 |
| **PER** (Price/Earnings Ratio) | $P/EPS$ | P/E와 동일 |
| **EV/EBITDA** | $EV/EBITDA$ | 기업가치 / 영업이익+감가상각 |

#### 2.3 한국 펀더멘털 데이터 출처
- **DART** (전자공시): https://dart.fss.or.kr/ — 무료, 공시 의무
- **KRX** (한국거래소): 상장사 정보
- **네이버 금융**: 종합 (무료, API 제한)
- **에프앤가이드**: 컨센서스 데이터 (유료)

### 3. 대체 데이터 (Alternative Data) — 가장 핫한 영역

#### 3.1 대체 데이터의 6가지 카테고리

| 카테고리 | 예시 | 활용 |
|---------|------|------|
| **위성 이미지** | 주차장 차량 수, 공장 가동률 | 매출 예측 |
| **SNS/뉴스** | 트위터 멘션, 뉴스 감정 | 단기 가격 |
| **신용카드 거래** | 익명화 결제 데이터 | 매출 예측 |
| **검색 트렌드** | Google Trends, Naver | 수요 예측 |
| **모바일 위치** | 매장 방문 | 리테일 |
| **임직원 데이터** | LinkedIn 채용 | 회사 동향 |

#### 3.2 책의 예시 — Under Armour vs. Nike Pairs Trading

<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">대체 데이터 페어 트레이딩 — Under Armour vs. Nike</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- Satellite -->
    <rect x="40" y="60" width="180" height="80" rx="8" fill="#fef9e7" stroke="#8a6d2c"/>
    <text x="130" y="85" text-anchor="middle" font-weight="700" fill="#8a6d2c">🛰 위성 이미지</text>
    <text x="130" y="105" text-anchor="middle" font-size="10" fill="#1c1917">매장 방문자 수</text>
    <text x="130" y="120" text-anchor="middle" font-size="10" fill="#1c1917">컨테이너 적재량</text>
    <!-- Analysis -->
    <text x="260" y="105" text-anchor="middle" font-size="20" fill="#a8a29e">→</text>
    <rect x="280" y="60" width="180" height="80" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="370" y="85" text-anchor="middle" font-weight="700" fill="#c4724e">📊 AI 분석</text>
    <text x="370" y="105" text-anchor="middle" font-size="10" fill="#1c1917">Nike +20%</text>
    <text x="370" y="120" text-anchor="middle" font-size="10" fill="#1c1917">UA -10%</text>
    <!-- Trade -->
    <text x="500" y="105" text-anchor="middle" font-size="20" fill="#a8a29e">→</text>
    <rect x="520" y="60" width="180" height="80" rx="8" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="610" y="85" text-anchor="middle" font-weight="700" fill="#3a7d44">💰 매매</text>
    <text x="610" y="105" text-anchor="middle" font-size="10" fill="#1c1917">Long Nike</text>
    <text x="610" y="120" text-anchor="middle" font-size="10" fill="#1c1917">Short UA</text>
  </g>
  <text x="360" y="195" text-anchor="middle" font-size="12" font-weight="700" fill="#1c1917">결과: 두 회사 실적 발표 전에 페어 트레이딩 알파 확보</text>
  <text x="360" y="220" text-anchor="middle" font-size="11" font-style="italic" fill="#57534e">출처: "Pairs Trading Strategy with Geolocation Data" (Journal of Financial Data Science, 2021)</text>
</svg>

#### 3.3 대체 데이터의 한계
- **비싸다**: 위성 데이터 $10K~100K/년
- **노이즈 많음**: 위성 사진 → 차량 수 추정 정확도 80%
- **법적 회색지대**: 신용카드 데이터 익명화 필수
- **알파 빨리 사라짐**: 모두 알게 되면 무용

### 4. 데이터 표현 (Data Representation)

#### 4.1 4가지 시각화 방법

| 방법 | 용도 |
|------|------|
| **막대그래프 (Bar Chart)** | 카테고리 비교 |
| **선그래프 (Line Graph)** | 시계열 추이 |
| **캔들스틱 (Candlestick)** | 일/시간봉 가격 |
| **히트맵 (Heat Map)** | 상관관계, 시간×자산 |

#### 4.2 비주얼 데이터를 ML 입력으로

최근 연구: **차트 이미지를 CNN에 입력** → 매수/매도 신호 학습.

> 📄 Cohen, N., Balch, T., & Veloso, M. (2019). Trading via image classification. arXiv:1907.10046.

```python
# 캔들 차트 → 이미지 → CNN
from tensorflow.keras import layers, models

model = models.Sequential([
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(64, 64, 3)),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dense(2, activation='softmax')  # 매수/매도
])
```

> ✅ **여기까지 따라왔으면**: 마켓·펀더멘털·대체 데이터의 차이와 한계가 보일 거다.

---

## 🔴 [고급] — 데이터 소스 가이드

### 1. 책의 표 2-1 (오픈소스 소스) 정리

| 소스 | 영문 | 데이터 | 빈도 | 비고 |
|------|------|--------|------|------|
| Investing.com | yfinance | OHLCV + 기본정보 | 1분~월간 | 가장 많이 씀 |
| Yahoo Finance | yfinance | OHLCV + 재무 | 1분~월간 | Python 친화 |
| Taifex | taifex | 호가 데이터 | 일간 | 대만 |
| Kaggle | kaggle | OHLCV | 일간 | 대회 데이터 |
| Tushare | tushare | 매출, ROE 등 | 일간 | 중국 |
| Stooq | stooq | OHLCV | 일간 | 폴란드 |

### 2. 한국 시장 특화 소스 (책에 없는 추가)

#### 무료
| 소스 | 데이터 | API |
|------|--------|-----|
| **pykrx** | 한국 주식 OHLCV, 펀더멘털 | Python 라이브러리 |
| **FinanceDataReader** | 한국 + 미국 주식 | Python 라이브러리 |
| **DART** | 공시·재무제표 | OpenDART API |
| **한국은행 ECOS** | 거시지표 | API |
| **KRX 데이터샵** | 거래소 공식 | 일부 무료 |
| **NAVER 금융** | 종합 | 비공식 크롤링 |

#### 유료
| 소스 | 데이터 | 비용 |
|------|--------|------|
| **에프앤가이드** | 컨센서스 | 연 $5K~ |
| **Quantiwise** | 전문 | 연 $10K~ |
| **인포맥스** | 종합 | 연 $10K~ |
| **Bloomberg** | 글로벌 종합 | 월 $2K |
| **Refinitiv Eikon** | 글로벌 | 월 $2K |

### 3. 대체 데이터 소스 (글로벌)

| 소스 | 데이터 | 비고 |
|------|--------|------|
| **Spire Global** | 위성 이미지 | $10K+/년 |
| **Planet Labs** | 위성 | 글로벌 1위 |
| **Yipit Data** | 신용카드 거래 | 헤지펀드용 |
| **Earnest Analytics** | 신용카드, 이메일 영수증 | 헤지펀드용 |
| **Thinknum** | 웹 스크래핑 (LinkedIn 등) | $10K~ |
| **Quandl (Nasdaq Data Link)** | 종합 대체 데이터 | 일부 무료 |
| **Estimize** | 군중 기반 컨센서스 | $1K~/년 |
| **RavenPack** | 뉴스 감정 분석 | $50K+/년 |

### 4. 영문 용어 사전

#### 4.1 데이터 종류
- **Market Data**: 마켓 데이터
- **Fundamental Data**: 펀더멘털 데이터
- **Alternative Data**: 대체 데이터
- **Tick Data**: 틱 데이터
- **Level 1 / Level 2 Data**: 호가 깊이
- **Time and Sales**: 거래 체결 정보
- **OHLCV**: 시가, 고가, 저가, 종가, 거래량
- **Bid-Ask Spread**: 매수-매도 호가 차이
- **VWAP** (Volume-Weighted Average Price): 거래량 가중 평균가
- **TWAP** (Time-Weighted Average Price): 시간 가중 평균가

#### 4.2 데이터 품질
- **Completeness**: 완전성 (결측치)
- **Consistency**: 일관성
- **Accuracy**: 정확성
- **Timeliness**: 적시성
- **Granularity**: 세분도
- **Coverage**: 적용 범위

### 5. 책의 한계 5가지

#### 한계 ①: 한국 데이터 소스 미언급
표 2-1이 글로벌 위주. **pykrx, DART, ECOS, FinanceDataReader** 같은 한국 핵심 도구 빠짐.

#### 한계 ②: 데이터 비용 미언급
무료 vs. 유료 비용 차이가 매우 큼. 책은 "표 참고" 정도.

#### 한계 ③: 데이터 라이선스 미언급
- yfinance: 비상업 사용 OK
- Kaggle 데이터: 대부분 비상업
- Bloomberg: 엄격한 재배포 제한
- 위성 데이터: 픽셀 단위 라이선스

#### 한계 ④: 데이터 품질 검증 가이드 없음
"신뢰성" 만 언급. 실제로 어떻게 검증할지 (DQ checks):
- 결측치 비율
- 이상치 탐지
- 분포 변화 (Distribution Drift)
- 시계열 일관성

#### 한계 ⑤: 데이터 엔지니어링 미언급
- ETL/ELT 파이프라인
- 데이터 레이크 vs. 웨어하우스
- Stream vs. Batch
- 시계열 DB (InfluxDB, TimescaleDB)

---

## 🟣 [전공자] — 1차 자료와 학술

### 1. Alternative Data 학술

#### 1.1 정의
> "*Alternative data refers to data used by investors to evaluate a company or investment that is not within their traditional data sources.*"
> — JPMorgan (2019)

#### 1.2 분류 (Eagle Alpha, 2024)
- **Consumer Generated**: 검색, SNS, 리뷰
- **Business Process**: 신용카드, 영수증, 거래
- **Sensor Generated**: 위성, 모바일 위치, IoT

#### 1.3 시장 규모
- 2019: $1.7B
- 2024: $11.0B
- 2030E: $137B (CAGR 50%+)

> 📄 Eagle Alpha. (2024). *Alternative Data Annual Report*.

### 2. 데이터 표현의 ML 입력 활용

#### 2.1 Image-based Stock Prediction
> 📄 Cohen, N., Balch, T., & Veloso, M. (2019). Trading via image classification. arXiv:1907.10046.

캔들 차트 이미지 → CNN → 매수/매도 예측. 평균 53% 정확도 (시장 50%).

#### 2.2 Time-Series Imaging
> 📄 Wang, Z., & Oates, T. (2015). Encoding time series as images for visual inspection and classification using tiled convolutional neural networks. *AAAI*.

GAF (Gramian Angular Field), MTF (Markov Transition Field) 등으로 시계열 → 이미지 변환.

### 3. 데이터 품질 학술

#### 3.1 6 Dimensions of Data Quality (DAMA)
1. **Completeness** (완전성)
2. **Uniqueness** (유일성)
3. **Timeliness** (적시성)
4. **Validity** (유효성)
5. **Accuracy** (정확성)
6. **Consistency** (일관성)

#### 3.2 Garbage In, Garbage Out (GIGO)
> "*A computer program will not produce correct results if the input data is bad.*"
> — George Fuechsel, IBM (1957)

ML에서 이 원칙이 가장 중요.

### 4. 한국 시장 데이터 학술 자료

#### 4.1 KOSPI 데이터 특성
- 상장 종목 수: 약 848 (2024.12, KRX 기준; KOSDAQ 포함 시 더 많음)
- 외국인 비중: 30~35%
- 거래소: KRX
- 거래 시간: 09:00~15:30

#### 4.2 한국 데이터 한계
- 30년 데이터 (미국 100년 대비)
- 시장 안정성 부족 (외환위기, 글로벌 위기)
- 회계 기준 변경 (한국 IFRS 도입 2011)

### 5. 마이데이터 - 한국 핀테크 데이터 인프라

> 📄 신용정보의 이용 및 보호에 관한 법률 (2020 개정).

마이데이터는 개인이 자기 데이터에 대한 권리:
- 본인의 동의 → 다른 기관에 데이터 전송
- 핀테크가 통합 데이터로 서비스
- 2022.1 본격 시행

---

### 🟣 [전공자 심화] — 대체 데이터(Alternative Data) 연구의 한계와 후속 연구

#### 원논문의 가정과 한계

대체 데이터 알파를 학술적으로 정량화한 대표 연구는 **Katona, Painter, Patatoukas, Zeng (2018)** 의 *On the Capital Market Consequences of Big Data: Evidence from Outer Space* (SSRN 3222741, 추후 *JFQA* 게재) 다. 이들은 RS Metrics 가 제공한 **미국 67개 리테일러 주차장 위성 이미지**(2011–2017) 로 분기 실적 발표 전 정보 우위를 측정해 **연 4.4% 알파**를 보고했다. 그러나 다음 5가지 가정/한계가 있다.

1. **표본 편향**: Walmart, Target 등 **대형 리테일러 67개**로 한정 — 산업·시가총액 일반화 어려움.
2. **이미지 → 매출 변환의 노이즈**: 주차장 차량 수가 실제 매출과 0.6 내외 상관(논문 자체 보고치). 날씨·계절성 미통제.
3. **거래비용·시장충격 미반영**: 알파는 종이상 long-short 포트폴리오, 실제 헤지펀드 구현 시 alpha decay 크다.
4. **데이터 가격 미반영**: RS Metrics 라이선스 비용 $10K~$100K/년을 차감하면 net-of-fee 알파는 훨씬 작음.
5. **공개 후 알파 소멸**: 같은 데이터가 다수 펀드에 판매되면 가격 발견이 가속되어 알파가 빠르게 침식.

#### 비판·검증 문헌

- **Mukherjee 등 (2025), "Institutional trading and satellite data," *Finance Research Letters* 71** — 위성 데이터의 수익률 예측력 향상은 **비-헤지펀드(non-hedge fund) 기관 거래**가 주도하며, 정보비대칭이 큰 소형주·낮은 애널리스트 커버리지 종목에서 효과가 강하다. **헤지펀드 자체의 incremental 알파는 통계적으로 약하다**고 보고. ([sciencedirect.com](https://www.sciencedirect.com/science/article/pii/S1544612324013709))
- **Da, Engelberg, Gao (2011), "In Search of Attention," *Journal of Finance* 66(5), 1461–1499. DOI: 10.1111/j.1540-6261.2011.01679.x** — Google SVI(Search Volume Index) 가 개인투자자 관심을 측정하며, SVI 상승 → 2주 단기 가격 상승 후 1년 내 반전. **alpha decay 가 12개월 내 발생**한다는 핵심 증거. ([wiley.com](https://onlinelibrary.wiley.com/doi/10.1111/j.1540-6261.2011.01679.x))

> ⚠️ **검증 노트**: "Froot & Kang (2019) 신용카드 거래 데이터" 인용은 *공개 SSRN 원문이 확인되지 않아* 본 해설집에서 제외했다. 대신 동일 주제(신용카드 거래 → 매출 예측)는 학계에서 **Agarwal & Qian (2014, AER)**, **Baker, Bloom, Davis, Kost, Sammon, Viratyosin (2020)** 등으로 후속 연구가 이어지고 있다.

#### 후속 연구 동향 (2020~)

- Mukherjee 등 (2025), *Institutional trading and satellite data*, *Finance Research Letters* 71. — 위성 데이터 효과의 **소형주 한정성**. [sciencedirect.com](https://www.sciencedirect.com/science/article/pii/S1544612324013709)
- *Eye in outer space: satellite imageries of container ports can predict world stock returns* (2023), *Humanities and Social Sciences Communications*. 컨테이너 항만 위성 이미지가 **글로벌 주식 수익률**을 예측. [nature.com](https://www.nature.com/articles/s41599-023-01891-9)
- "Displaced by Big Data? Evidence from Active Fund Managers" (AEA 2025 세션). 위성 데이터 도입 후 **액티브 펀드 매니저의 종목 선정 능력 하락** — 정보가 가격에 빨리 반영되어 전통 펀드 매니저의 알파가 침식. [aeaweb.org](https://www.aeaweb.org/conference/2025/program/paper/44sGrR3h)

#### 한국 적용 시 주의점

- **KRX 데이터 길이 부족**: 미국 CRSP 는 1926년부터, KRX 일별 OHLCV 는 신뢰성 있게 보면 **1980년대 후반~** (코스닥은 1996년~). 위성 알파 검증을 위한 시계열 표본이 짧다.
- **위성 커버리지의 한국 종목 부족**: RS Metrics, Orbital Insight, Spire 등 글로벌 사업자의 한국 리테일러 커버리지는 신라면세점·롯데마트 등 **수개 종목 한정**. 페어 트레이딩 구성 자체가 어렵다.
- **외국인 비중 30~35%**: 정보 비대칭의 주체가 **외국인 vs. 개인**으로 양극화 — 미국형 "헤지펀드 vs. 개인" 프레임이 한국에선 "외국인·기관 vs. 개인"으로 변형돼야 한다.
- **마이데이터 vs. 대체 데이터의 법적 구분**: 한국은 **신용정보법** 으로 신용카드 거래 데이터의 개인 단위 이용을 엄격히 제한 — 미국식 익명화 신용카드 데이터 알파 전략의 직접 이식이 어렵다.
- **위성 데이터 라이선스 비용 vs. 한국 헤지펀드 AUM**: 한국 헤지펀드 평균 AUM (수백억원~수천억원) 으로는 글로벌 위성 라이선스 (연 $100K+) 가 비용 대비 효율이 낮다.

---

## 📚 책에는 없지만 알면 좋은 것

### 🔍 보충 1 — Python으로 한국 데이터 가져오기

#### pykrx
```python
from pykrx import stock

# 삼성전자 일봉
df = stock.get_market_ohlcv("20240101", "20240515", "005930")
print(df.head())

# KOSPI 전체 종목
tickers = stock.get_market_ticker_list("20240515", market="KOSPI")
print(len(tickers))  # 약 848 (2024.12 기준)

# 펀더멘털
fundamental = stock.get_market_fundamental("20240515", "20240515", "005930")
print(fundamental)
```

#### FinanceDataReader
```python
import FinanceDataReader as fdr

# 삼성전자
df = fdr.DataReader('005930', '2024-01-01', '2024-05-15')

# 미국 주식
df_aapl = fdr.DataReader('AAPL', '2024-01-01')

# 한국 ETF
df_etf = fdr.DataReader('069500')  # KODEX 200
```

#### OpenDART
```python
import OpenDartReader

dart = OpenDartReader('your_api_key')

# 삼성전자 공시
disclosures = dart.list('005930', start='2024-01-01')

# 재무제표
fs = dart.finstate('005930', 2023)
```

### 🔍 보충 2 — Bloomberg Terminal vs. 무료 대안

#### Bloomberg Terminal
- 비용: $24K/년 (월 $2K)
- 데이터: 전 세계 거의 모든 자산
- 분석 도구: 무료 사용
- 채팅: 금융권 표준 통신
- **대체 어려움**: 글로벌 표준

#### 무료 대안 조합
- 데이터: yfinance + FinanceDataReader + pykrx
- 분석: Python (pandas + sklearn)
- 통신: Slack / Discord
- **한계**: 실시간성, 데이터 깊이

### 🔍 보충 3 — 데이터 엔지니어링 (책에 없는 핵심)

#### ETL vs. ELT
```
ETL (전통):
  추출 (Extract) → 변환 (Transform) → 적재 (Load)
  
ELT (현대):
  추출 → 적재 → 변환 (DB 안에서)
  
→ ELT가 더 빠르고 유연
```

#### 한국 금융권 데이터 스택
- **Source**: KRX, DART, Bloomberg
- **Ingestion**: Apache Kafka, AWS Kinesis
- **Storage**: S3, HDFS, BigQuery
- **Transform**: Spark, dbt
- **Serve**: API, Tableau, Grafana
- **Orchestration**: Airflow, Prefect

### 🔍 보충 4 — 데이터 라이선스 주의 사항

#### 무료 데이터의 함정
- yfinance: 일부 데이터 누락 (한국 종목 펀더멘털 등)
- Yahoo Finance: 비공식 API → 변경 시 깨짐
- 한국 네이버: 크롤링 법적 회색지대

#### 상업 사용 시 주의
- 알고리즘 트레이딩 == 상업적 사용
- 무료 데이터로 펀드 운영 → 라이선스 위반 가능
- 헤지펀드는 모두 유료 데이터 라이선스 보유

### 🔍 보충 5 — 데이터 시각화 도구

#### Python
- **Matplotlib**: 표준 정적 차트
- **Plotly**: 인터랙티브
- **mplfinance**: 캔들 차트 특화
- **Seaborn**: 통계 시각화

#### BI 도구
- Tableau, Power BI, Looker
- Grafana (실시간 대시보드)

#### 금융 특화
- TradingView (차트 + 백테스팅)
- Bloomberg Terminal
- Refinitiv Eikon

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. 어떤 데이터부터 시작해야?

**A.** **마켓 데이터부터**. 이유:
- 가장 접근 쉬움 (무료)
- 다른 데이터의 기반
- ML 모델 학습 시작 가능

순서: 마켓 → 펀더멘털 → 대체.

### Q2. 무료 데이터로 헤지펀드 수준 가능한가?

**A.** **아니다**. 이유:
- 무료 데이터는 일/분 단위 (HFT 불가)
- 빠지는 데이터 많음
- 펀더멘털 데이터 부족
- 대체 데이터 거의 없음

→ 학습용·연구용으로는 충분, 실전은 어려움.

### Q3. 데이터의 6가지 평가 기준 중 가장 중요한 건?

**A.** **희소성 (Rarity)**.
- 같은 데이터를 모두 가지면 알파 없음
- 헤지펀드들이 위성·신용카드 데이터에 거금 쓰는 이유

### Q4. 위성 데이터로 진짜 돈 벌 수 있나?

**A.** **이미 활발히 활용 중**.
- Walmart 주차장 → 매출 예측
- 원유 저장 탱크 → 유가 예측
- 조선소 컨테이너 → 무역 예측
- 단, **알파가 빨리 사라짐** (모두 알게 되면)

### Q5. 한국 데이터가 미국보다 부족한 이유?

**A.** 여러 이유:
- **역사**: 한국 30년 vs. 미국 100년
- **거래소**: KRX 단일 vs. 미국 다수 (NYSE, NASDAQ, BATS 등)
- **API**: 미국 풍부, 한국 제한적
- **언어**: 영문 자료 vs. 한글 자료

### Q6. 펀더멘털 데이터는 분기마다 1번인데 ML에 충분?

**A.** **부족, 보완 필요**.
- 분기 데이터 → 1년 4회
- 10년 = 40개 데이터 포인트
- ML에는 너무 적음

**해결**:
- 회사 수를 늘림 (1000개 × 40 = 40K)
- 시계열 일별 데이터와 결합
- 대체 데이터로 보강

### Q7. 데이터 표현 (차트 이미지)을 ML에 쓰는 게 진짜 효과?

**A.** **부분적으로 효과, 한계 명확**.
- CNN으로 차트 → 매수/매도: 53~55% 정확도
- 시장 50% 대비 약간 좋음
- 그러나 수치 기반 ML (XGBoost)이 보통 더 좋음
- → **연구 가치 있지만 실전은 미흡**

---

## 🎯 이 절에서 가져갈 핵심 7가지

1. **데이터 3유형**: 마켓 (가격), 펀더멘털 (재무), 대체 (위성/SNS).
2. **데이터 평가 6기준**: 신뢰성·세분화·효용성·사용범위·행동가능성·**희소성**.
3. **OHLCV가 마켓 데이터의 표준** (캔들스틱으로 시각화).
4. **재무비율 핵심 7개**: P/E, P/B, ROE, ROA, 부채비율, 유동비율, EV/EBITDA.
5. **대체 데이터 시장 폭증**: Grand View 기준 2024 $11.65B → 2030 $135.72B, CAGR ~63% (출처별 편차 큼).
6. **한국 무료 데이터 표준**: pykrx, FinanceDataReader, DART, ECOS.
7. **데이터 라이선스 주의**: 알고리즘 트레이딩은 상업적 사용 → 유료 라이선스 필수.

---

## 📖 더 읽을거리

### 데이터 가이드
- 관련: 동일 저자군의 2020년 전작 (한빛미디어) — 데이터 평가 6기준 출처
- 신진오. (2023). *파이썬 증권 데이터 분석* (2판). 한빛미디어.

### 대체 데이터
- Denev, A., & Amen, S. (2020). *The Book of Alternative Data*. Wiley.
- Eagle Alpha. (매년). *Alternative Data Annual Report*.

### 한국 데이터 도구
- pykrx 문서: https://github.com/sharebook-kr/pykrx
- FinanceDataReader 문서: https://github.com/FinanceData/FinanceDataReader
- OpenDART: https://opendart.fss.or.kr/

### 학술
- Cohen, N., et al. (2019). Trading via image classification. arXiv:1907.10046.
- Bartram, S. M., et al. (2021). Machine learning and finance: A bibliometric review. *Journal of Economic Surveys*.

### 시각화
- Plotly Documentation: https://plotly.com/python/
- mplfinance: https://github.com/matplotlib/mplfinance
- Bloomberg Terminal 가이드 (대학원생 무료): https://www.bloomberg.com/professional/

---

> **다음 절 예고** — §2.6 전통 퀀트 vs. AI 퀀트
> 두 접근법의 8가지 차이점을 정리하고, 전통 퀀트 5대 전략 (평균회귀·추세추종·페어트레이딩·요인모델·이벤트드리븐) 을 풀이.
