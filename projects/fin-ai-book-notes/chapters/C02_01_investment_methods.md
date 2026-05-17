# 2.1 대표적인 금융 투자 방식 — *Investment Methods & the Rise of Quant*

> **원서 위치**: 김태헌, 《금융 AI의 이해》(제이펍, 2024), §2.1 (pp.43–46)
> **원서 분량**: 약 4쪽 (5가지 투자 방식 + 퀀트 기원 + 알고리즘 트레이딩 시장)
> **해설 분량**: 약 25쪽
> **읽는 데 걸리는 시간**: 약 45분

---

## 🪧 이 절을 한 줄로

> 금융 투자는 **5가지 자산군**(주식·채권·부동산·원자재·상호금융)으로 나뉘고, 그 위에 **두 가지 접근법**(체계적 = 퀀트·재량적 = 인간)이 있다. AI는 **양쪽 모두에서** 점점 핵심 도구가 되고 있다.

책은 §2.1을 5가지 자산 → 퀀트 정의 → 알고리즘 트레이딩 → 퀀트 역사 → 시장 규모 순으로 짧게 나열한다. 이 해설집은:
1. **각 자산군의 AI 응용** 까지 풀고
2. **퀀트 역사 5단계** 를 인포그래픽으로
3. **체계적 vs. 재량적** 의 진짜 차이
4. **알고리즘 트레이딩 시장 글로벌 데이터 보강**

### 📍 미리 그릴 큰 그림

<svg viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">금융 투자 — 5가지 자산 × 2가지 접근법 × AI</text>
  <!-- 5 assets row -->
  <text x="380" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">▼ 자산군 (Asset Classes)</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <rect x="20" y="70" width="135" height="55" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="87" y="92" text-anchor="middle" font-weight="700">📈 주식</text>
    <text x="87" y="110" text-anchor="middle" font-size="10" fill="#57534e">Stock</text>
    <rect x="165" y="70" width="135" height="55" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="232" y="92" text-anchor="middle" font-weight="700">📜 채권</text>
    <text x="232" y="110" text-anchor="middle" font-size="10" fill="#57534e">Bond</text>
    <rect x="310" y="70" width="135" height="55" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="377" y="92" text-anchor="middle" font-weight="700">🏢 부동산</text>
    <text x="377" y="110" text-anchor="middle" font-size="10" fill="#57534e">Real Estate</text>
    <rect x="455" y="70" width="135" height="55" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="522" y="92" text-anchor="middle" font-weight="700">🛢 원자재</text>
    <text x="522" y="110" text-anchor="middle" font-size="10" fill="#57534e">Commodity</text>
    <rect x="600" y="70" width="135" height="55" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="667" y="92" text-anchor="middle" font-weight="700">🤝 상호금융</text>
    <text x="667" y="110" text-anchor="middle" font-size="10" fill="#57534e">P2P, Crowd</text>
  </g>
  <!-- 2 approaches -->
  <text x="380" y="160" text-anchor="middle" font-size="13" font-weight="700" fill="#5a7a96">▼ 접근법 (Approaches)</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <rect x="60" y="175" width="300" height="80" rx="6" fill="#eaf2f8" stroke="#5a7a96" stroke-width="2"/>
    <text x="210" y="200" text-anchor="middle" font-weight="700" fill="#5a7a96">🤖 체계적 (Systematic / Quantitative)</text>
    <text x="210" y="222" text-anchor="middle" font-size="10" fill="#1c1917">규칙·통계·알고리즘 기반 자동 매매</text>
    <text x="210" y="240" text-anchor="middle" font-size="10" fill="#57534e">예: 르네상스, AQR, Two Sigma</text>
    <rect x="400" y="175" width="300" height="80" rx="6" fill="#edf7ef" stroke="#3a7d44" stroke-width="2"/>
    <text x="550" y="200" text-anchor="middle" font-weight="700" fill="#3a7d44">👤 재량적 (Discretionary)</text>
    <text x="550" y="222" text-anchor="middle" font-size="10" fill="#1c1917">경험·직관·판단 기반 매매</text>
    <text x="550" y="240" text-anchor="middle" font-size="10" fill="#57534e">예: 워런 버핏, 피터 린치</text>
  </g>
  <!-- AI in middle -->
  <rect x="280" y="285" width="200" height="55" rx="8" fill="#1c1917"/>
  <text x="380" y="308" text-anchor="middle" font-family="Noto Sans KR,sans-serif" font-size="13" font-weight="700" fill="#fff">+ AI (양쪽 모두에)</text>
  <text x="380" y="325" text-anchor="middle" font-size="10" fill="#fff">"이제 우리 모두 퀀트다"</text>
  <line x1="210" y1="255" x2="350" y2="285" stroke="#1c1917" stroke-width="1.5"/>
  <line x1="550" y1="255" x2="410" y2="285" stroke="#1c1917" stroke-width="1.5"/>
</svg>

---

## 🟢 [초급] — 일상 비유로 잡는 감

### 💭 시작하기 전에

"금융 투자가 뭔가요?" 물으면 대부분 **주식**만 떠올린다. 그런데 사실 5가지가 있다.

### 1. 5가지 투자 자산 한 줄 비유

| 자산 | 한 줄 비유 | 수익 방식 | 위험 |
|------|----------|---------|------|
| **주식** | 회사 조각 사기 | 가격 상승 + 배당 | 변동성 큼 |
| **채권** | 빚 빌려주고 이자 받기 | 이자 + 만기 원금 | 부도 (낮음) |
| **부동산** | 건물·땅 사서 임대/매각 | 임대료 + 시세 차익 | 유동성 낮음 |
| **원자재** | 금/은/석유 사기 | 가격 상승 | 변동성 매우 큼 |
| **상호금융** | 모르는 사람한테 돈 빌려주기 | 이자 | 신용 위험 |

### 2. 왜 다양한 자산에 분산?

**격언**: "Don't put all your eggs in one basket" (계란을 한 바구니에 담지 마라).

이걸 수학적으로 증명한 사람이 **Harry Markowitz** (1952, 노벨상). 자산 간 상관관계가 낮을수록 포트폴리오 위험이 감소.

```
주식만 100%: 수익 8%, 변동성 15%
주식 60% + 채권 40%: 수익 6%, 변동성 9%
   → 수익은 25% 줄지만 위험은 40% 감소
```

### 3. 퀀트 투자 vs. 재량 투자 — 한 줄 비유

#### 재량 투자 (Discretionary)
- "감으로 투자"
- 경험 많은 펀드매니저의 직관
- 예: 워런 버핏 ("좋은 회사를 좋은 가격에 사라")

#### 퀀트 투자 (Quantitative)
- "수학·통계·코드로 투자"
- 규칙대로만 매매
- 예: 르네상스 테크놀로지 (회사 1982 설립, Medallion Fund 1988 출범, 1988-2018 평균 연 39% 수수료 후)

#### 그림으로

<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">재량 vs. 퀀트 — 의사결정 흐름</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- Discretionary -->
    <text x="180" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">👤 재량 (Discretionary)</text>
    <rect x="40" y="70" width="280" height="160" rx="8" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="60" y="95" font-size="11" fill="#1c1917">1. 뉴스·재무제표 읽음</text>
    <text x="60" y="115" font-size="11" fill="#1c1917">2. 경영진 인터뷰</text>
    <text x="60" y="135" font-size="11" fill="#1c1917">3. "느낌"으로 판단</text>
    <text x="60" y="155" font-size="11" fill="#1c1917">4. "산다 / 안 산다"</text>
    <text x="60" y="175" font-size="11" fill="#1c1917">5. 며칠~몇 주에 한 번</text>
    <text x="180" y="210" text-anchor="middle" font-size="11" font-style="italic" fill="#3a7d44">속도 느림, 감정 개입</text>
    <!-- Quantitative -->
    <text x="540" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#5a7a96">🤖 퀀트 (Quantitative)</text>
    <rect x="400" y="70" width="280" height="160" rx="8" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="420" y="95" font-size="11" fill="#1c1917">1. 가격·거래량 데이터 수집</text>
    <text x="420" y="115" font-size="11" fill="#1c1917">2. 알고리즘 실행</text>
    <text x="420" y="135" font-size="11" fill="#1c1917">3. 규칙대로 신호 생성</text>
    <text x="420" y="155" font-size="11" fill="#1c1917">4. 자동 매수/매도</text>
    <text x="420" y="175" font-size="11" fill="#1c1917">5. 밀리초 단위로 1000+회/일</text>
    <text x="540" y="210" text-anchor="middle" font-size="11" font-style="italic" fill="#5a7a96">속도 빠름, 감정 배제</text>
  </g>
</svg>

### 4. 알고리즘 트레이딩 = "퀀트 전략을 자동 실행"

```
퀀트 전략 = 아이디어 ("MA 5 > MA 20일 때 매수")
        ↓
알고리즘 = 코드로 구현
        ↓
트레이딩 시스템 = 실시간 자동 실행
```

> 💡 책의 핵심 문장: **"퀀트 투자로 얻은 투자 아이디어나 전략을 알고리즘으로 구현하여 실제 투자 활동에 적용하는 것이 알고리즘 트레이딩이라고 할 수 있다."**

> ✅ **여기까지 따라왔으면**: 금융 투자의 자산 종류와 두 가지 접근법(퀀트 vs. 재량)의 차이가 보일 거다.

---

## 🟡 [중급] — 퀀트의 역사와 진화

### 1. 퀀트 5단계 진화사 — Campbell Harvey 정리

듀크대 Campbell Harvey 교수가 정리한 퀀트의 발전사. 책 본문을 시각화:

<svg viewBox="0 0 760 380" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">퀀트 5단계 진화 — 1960s부터 현재까지</text>
  <line x1="60" y1="200" x2="700" y2="200" stroke="#1c1917" stroke-width="2"/>
  <g font-family="Noto Sans KR,sans-serif">
    <!-- Stage 1: Trend Following -->
    <rect x="40" y="70" width="120" height="110" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="100" y="92" text-anchor="middle" font-size="12" font-weight="700" fill="#c4724e">1단계</text>
    <text x="100" y="108" text-anchor="middle" font-size="11" fill="#1c1917">추세 추종</text>
    <text x="100" y="124" text-anchor="middle" font-size="10" fill="#57534e">Trend-following</text>
    <text x="100" y="142" text-anchor="middle" font-size="9" fill="#a8a29e">1970s~</text>
    <text x="100" y="158" text-anchor="middle" font-size="10" fill="#57534e">기술 분석</text>
    <text x="100" y="172" text-anchor="middle" font-size="10" fill="#57534e">알고리즘화</text>
    <line x1="100" y1="180" x2="100" y2="200" stroke="#c4724e" stroke-width="1"/>
    <text x="100" y="218" text-anchor="middle" font-size="9" fill="#57534e">반전 지점</text>
    <text x="100" y="232" text-anchor="middle" font-size="9" fill="#57534e">예측 어려움</text>
    <!-- Stage 2: Stock Selection -->
    <rect x="170" y="70" width="120" height="110" rx="8" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="230" y="92" text-anchor="middle" font-size="12" font-weight="700" fill="#5a7a96">2단계</text>
    <text x="230" y="108" text-anchor="middle" font-size="11" fill="#1c1917">정량 종목선택</text>
    <text x="230" y="124" text-anchor="middle" font-size="10" fill="#57534e">Stock Selection</text>
    <text x="230" y="142" text-anchor="middle" font-size="9" fill="#a8a29e">1980s~</text>
    <text x="230" y="158" text-anchor="middle" font-size="10" fill="#57534e">가치·성장·수익성</text>
    <text x="230" y="172" text-anchor="middle" font-size="10" fill="#57534e">팩터 활용</text>
    <line x1="230" y1="180" x2="230" y2="200" stroke="#5a7a96" stroke-width="1"/>
    <text x="230" y="218" text-anchor="middle" font-size="9" fill="#57534e">Fama-French</text>
    <text x="230" y="232" text-anchor="middle" font-size="9" fill="#57534e">3-Factor</text>
    <!-- Stage 3: Smart Beta -->
    <rect x="300" y="70" width="120" height="110" rx="8" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="360" y="92" text-anchor="middle" font-size="12" font-weight="700" fill="#3a7d44">3단계</text>
    <text x="360" y="108" text-anchor="middle" font-size="11" fill="#1c1917">스마트 베타</text>
    <text x="360" y="124" text-anchor="middle" font-size="10" fill="#57534e">Smart Beta</text>
    <text x="360" y="142" text-anchor="middle" font-size="9" fill="#a8a29e">2000s~</text>
    <text x="360" y="158" text-anchor="middle" font-size="10" fill="#57534e">저비용 ETF</text>
    <text x="360" y="172" text-anchor="middle" font-size="10" fill="#57534e">팩터 인덱스</text>
    <line x1="360" y1="180" x2="360" y2="200" stroke="#3a7d44" stroke-width="1"/>
    <text x="360" y="218" text-anchor="middle" font-size="9" fill="#57534e">iShares MSCI</text>
    <text x="360" y="232" text-anchor="middle" font-size="9" fill="#57534e">Value ETF</text>
    <!-- Stage 4: HFT -->
    <rect x="430" y="70" width="120" height="110" rx="8" fill="#f5e6f0" stroke="#7a6a9a"/>
    <text x="490" y="92" text-anchor="middle" font-size="12" font-weight="700" fill="#7a6a9a">4단계</text>
    <text x="490" y="108" text-anchor="middle" font-size="11" fill="#1c1917">고빈도 거래</text>
    <text x="490" y="124" text-anchor="middle" font-size="10" fill="#57534e">HFT</text>
    <text x="490" y="142" text-anchor="middle" font-size="9" fill="#a8a29e">2000s~</text>
    <text x="490" y="158" text-anchor="middle" font-size="10" fill="#57534e">마이크로초 단위</text>
    <text x="490" y="172" text-anchor="middle" font-size="10" fill="#57534e">초저지연 인프라</text>
    <line x1="490" y1="180" x2="490" y2="200" stroke="#7a6a9a" stroke-width="1"/>
    <text x="490" y="218" text-anchor="middle" font-size="9" fill="#57534e">Renaissance</text>
    <text x="490" y="232" text-anchor="middle" font-size="9" fill="#57534e">Citadel</text>
    <!-- Stage 5: AI -->
    <rect x="560" y="70" width="160" height="110" rx="8" fill="#1c1917"/>
    <text x="640" y="92" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">5단계</text>
    <text x="640" y="108" text-anchor="middle" font-size="11" fill="#fff">AI 시대</text>
    <text x="640" y="124" text-anchor="middle" font-size="10" fill="#fff">ML/DL/LLM</text>
    <text x="640" y="142" text-anchor="middle" font-size="9" fill="#fff">2010s~</text>
    <text x="640" y="158" text-anchor="middle" font-size="10" fill="#fff">"우리 모두 퀀트"</text>
    <text x="640" y="172" text-anchor="middle" font-size="10" fill="#fff">재량+체계 융합</text>
    <line x1="640" y1="180" x2="640" y2="200" stroke="#fff" stroke-width="1"/>
    <text x="640" y="218" text-anchor="middle" font-size="9" fill="#1c1917" font-weight="700">BloombergGPT</text>
    <text x="640" y="232" text-anchor="middle" font-size="9" fill="#1c1917" font-weight="700">MAN AHL</text>
  </g>
  <text x="380" y="290" text-anchor="middle" font-size="12" font-style="italic" fill="#57534e">각 단계는 이전 단계를 대체하지 않고 누적된다 — 한 펀드에 5단계 모두 존재 가능.</text>
  <text x="380" y="315" text-anchor="middle" font-size="11" font-weight="700" fill="#1c1917">"우리는 이제 모두 퀀트다" — Campbell Harvey & MAN Group (2017)</text>
</svg>

#### 1.1 1단계: 추세 추종 (Trend-Following, 1970s~)
- 100년 전부터 있던 **기술 분석** 을 알고리즘화
- 가격이 올라가면 매수, 내려가면 매도
- 단점: **반전 지점 예측 어려움**
- 대표: Bill Dunn (Dunn Capital, 1974)

#### 1.2 2단계: 정량 종목 선택 (Stock Selection, 1980s~)
- 단순 가격 → **펀더멘털 정보** 도 활용
- 가치(P/E), 성장(EPS), 수익성(ROE) 등 팩터
- 학술적 기반: **Fama-French 3 factor model (1993)**
- 대표: David Shaw (D.E. Shaw, 1988)

#### 1.3 3단계: 스마트 베타 (Smart Beta, 2000s~)
- 팩터 기반 **저비용 ETF** 출시
- 액티브 운용 비용 (2%) → 패시브 (0.1%)
- 자본 폭증 → 알파 감소 → 비용 절감이 알파
- 대표: Cliff Asness (AQR Capital, 1998)

#### 1.4 4단계: 고빈도 거래 (HFT, 2000s~)
- **마이크로초 단위** 매매
- 시장조성, 차익거래 자동화
- 광케이블·콜로케이션 등 인프라 투자
- 대표: Jim Simons (Renaissance, 회사 1982 / Medallion Fund 1988 출범; 1988-2018 평균 연 39% 수수료 후)

#### 1.5 5단계: AI 시대 (2010s~)
- **머신러닝/딥러닝** 본격 도입
- 비정형 데이터 (뉴스, SNS) 활용
- LLM (BloombergGPT, FinGPT) 등장
- 재량 + 체계의 융합

### 2. "체계적 vs. 재량적" — 진짜 차이

책은 둘을 간단히 구분하지만, 실제로는 **스펙트럼** 이다:

<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">체계적 vs. 재량적 — 스펙트럼 위의 5가지 위치</text>
  <line x1="80" y1="170" x2="680" y2="170" stroke="#1c1917" stroke-width="2"/>
  <text x="80" y="195" text-anchor="middle" font-size="11" font-weight="700" fill="#3a7d44">100% 재량</text>
  <text x="680" y="195" text-anchor="middle" font-size="11" font-weight="700" fill="#5a7a96">100% 체계</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="10">
    <!-- Discretionary side -->
    <circle cx="120" cy="170" r="6" fill="#3a7d44"/>
    <text x="120" y="120" text-anchor="middle" font-weight="700" fill="#3a7d44">개인 투자자</text>
    <text x="120" y="135" text-anchor="middle" fill="#57534e">감, 뉴스, 친구 추천</text>
    <line x1="120" y1="145" x2="120" y2="165" stroke="#3a7d44"/>
    <circle cx="240" cy="170" r="6" fill="#3a7d44"/>
    <text x="240" y="120" text-anchor="middle" font-weight="700" fill="#3a7d44">버핏형 가치투자자</text>
    <text x="240" y="135" text-anchor="middle" fill="#57534e">기업 분석 + 직관</text>
    <line x1="240" y1="145" x2="240" y2="165" stroke="#3a7d44"/>
    <!-- Middle -->
    <circle cx="380" cy="170" r="8" fill="#1c1917"/>
    <text x="380" y="120" text-anchor="middle" font-weight="700" fill="#1c1917">현대 헤지펀드</text>
    <text x="380" y="135" text-anchor="middle" fill="#57534e">AI 보조 + 인간 판단</text>
    <line x1="380" y1="145" x2="380" y2="165" stroke="#1c1917"/>
    <!-- Systematic side -->
    <circle cx="520" cy="170" r="6" fill="#5a7a96"/>
    <text x="520" y="120" text-anchor="middle" font-weight="700" fill="#5a7a96">팩터/스마트 베타</text>
    <text x="520" y="135" text-anchor="middle" fill="#57534e">규칙 기반 자동화</text>
    <line x1="520" y1="145" x2="520" y2="165" stroke="#5a7a96"/>
    <circle cx="640" cy="170" r="6" fill="#5a7a96"/>
    <text x="640" y="120" text-anchor="middle" font-weight="700" fill="#5a7a96">HFT/Renaissance</text>
    <text x="640" y="135" text-anchor="middle" fill="#57534e">완전 자동, 0.001초</text>
    <line x1="640" y1="145" x2="640" y2="165" stroke="#5a7a96"/>
  </g>
  <text x="380" y="240" text-anchor="middle" font-size="11" font-style="italic" fill="#57534e">대부분의 현대 펀드는 양극단이 아닌 중간 어딘가 — AI가 양쪽을 끌어당기는 중력.</text>
</svg>

> 💡 책 본문 인용: **"우리는 이제 모두 퀀트다 (We are all quants now)"** — Campbell Harvey & MAN Group (2017)

### 3. 알고리즘 트레이딩 시장 — 책 본문 + 보강

#### 책의 데이터 (Acumen Research, 2021 추정)
- **2020년 글로벌 시장**: $121.43억
- **2028년 예상**: $314.94억
- **CAGR**: 12.7%
- **미국 단독**: $35억 (2021), CAGR 11.3%

> ⚠ 정정: 위 수치는 책에서 인용된 옛 Acumen 보고서. **2025년 현재 Acumen 추정은 $14.1B (2021) → $41.9B (2030), CAGR 12.9%** 로 갱신. 보고서 갱신 시기마다 추정 차이 큼.

#### 보강 통계 (다른 자료)

| 출처 | 2024 시장 규모 | 2030 예상 | CAGR |
|------|--------------|---------|------|
| Allied Market Research (2023) | $17.7B | $42.0B | 12.2% |
| Mordor Intelligence (2024) | $19.0B | $35.0B | 10.9% |
| Grand View Research (2024) | $17.0B | $43.0B | 13.8% |

→ 보고서마다 다르지만 **연 11~14% 성장** 일관.

#### 글로벌 거래 중 알고리즘 비중 (2024)

```
미국 주식: 70% (NYSE, NASDAQ)
유럽 주식: 65%
한국 주식: 약 40% (외국인 + 기관)
일본 주식: 70%
중국 주식: 50%
암호화폐: 80~90% (MM, 차익거래)
```

#### 한국 알고리즘 트레이딩 현황
- **기관 투자자**: 80%+ 알고리즘 사용 (VWAP, TWAP)
- **외국인**: 90%+
- **개인 투자자**: 10% 미만 (대부분 수동)
- **규제**: 시장조성 의무, 호가 단위 제한

> ✅ **여기까지 따라왔으면**: 퀀트가 어디서 왔고 어디로 가는지 (5단계), 그리고 알고리즘 트레이딩이 시장에서 차지하는 비중이 보일 거다.

---

## 🔴 [고급] — 영문 용어와 책의 한계

### 1. 투자 분야 영문 용어

#### 1.1 자산군 (Asset Classes)
- **Equity (Stock)**: 주식
- **Fixed Income (Bond)**: 채권
- **Real Estate**: 부동산
- **Commodity**: 원자재
- **Currency (Forex)**: 외환
- **Cryptocurrency**: 암호화폐
- **Derivative**: 파생상품
- **Alternative Investment**: 대안 투자 (PE, HF, VC)

#### 1.2 투자 접근법
- **Discretionary**: 재량적
- **Systematic / Quantitative**: 체계적, 정량적
- **Active**: 액티브 (시장 초과수익 추구)
- **Passive**: 패시브 (인덱스 추종)
- **Long-only**: 매수만
- **Long-Short**: 매수+공매도

#### 1.3 거래 전략
- **Trend-Following**: 추세 추종
- **Mean Reversion**: 평균 회귀
- **Pairs Trading**: 페어 트레이딩
- **Statistical Arbitrage**: 통계적 차익거래
- **Market Making**: 시장 조성
- **High-Frequency Trading (HFT)**: 고빈도 거래
- **Algorithmic Trading**: 알고리즘 거래
- **Smart Beta**: 스마트 베타
- **Factor Investing**: 팩터 투자

#### 1.4 헤지펀드 분류
- **Equity Long-Short**: 주식 롱숏
- **Global Macro**: 글로벌 매크로
- **Event-Driven**: 이벤트 드리븐
- **Distressed**: 부실 기업
- **Multi-Strategy**: 멀티 전략
- **Quant**: 정량
- **Activist**: 행동주의

### 2. 책 §2.1의 한계 5가지

#### 한계 ①: 한국 자산 분류 미반영
책의 5가지 자산은 글로벌 표준. **한국 특수성**:
- ELS/ELB (주가연계증권) — 한국 특화 상품
- 공모주 청약 — 한국에서 매우 인기
- 청년희망적금 등 정책 상품

#### 한계 ②: 액티브 vs. 패시브 미언급
재량/체계만 다루고 **액티브/패시브 구분 누락**. 사실 더 중요:
- 액티브: 시장 초과수익 추구 (수수료 1%+)
- 패시브: 인덱스 추종 (수수료 0.1%)
- 2024 전 세계 ETF 자산 $13조, 펀드 자산의 50%+

#### 한계 ③: 행동재무학 (Behavioral Finance) 미언급
재량 투자의 한계인 **인지 편향**:
- 손실회피 (Kahneman-Tversky)
- 확증 편향
- 군중심리

→ AI가 이걸 어떻게 해결하는지 안 다룸.

#### 한계 ④: 알고리즘 트레이딩 시장 데이터 편향
**Acumen Research** 단일 출처. 더 권위 있는 자료:
- WFE (World Federation of Exchanges) 통계
- TABB Group 보고서
- Greenwich Associates 조사

#### 한계 ⑤: 한국 퀀트 시장 미언급
- 한국 사모펀드(기관전용 사모) 약정액 약 150조원대 (2024, KDI/금감원); 한국형 헤지펀드(전문사모집합투자기구) 단독 통계는 금융투자협회 freesis 참조
- 한국 퀀트 펀드: 10% 미만
- 한국 알고리즘 트레이딩 발달도: 미국·일본 대비 5년 뒤

### 3. Campbell Harvey의 학술적 기여

#### 3.1 핵심 논문
- Harvey, C. R., & Liu, Y. (2016). **Lucky factors**. *JFE*. — 팩터 P-hacking 위험 경고.
- Harvey, C. R., Liu, Y., & Zhu, H. (2016). **... and the cross-section of expected returns**. *Review of Financial Studies*. — 316개 팩터 발견 → 대부분 가짜 가능성.

#### 3.2 "Man vs. Machine" 논문 (2017)
> 📄 Harvey, C. R., Rattray, S., Sinclair, A., & Van Hemert, O. (2017). Man vs. Machine: Comparing discretionary and systematic hedge fund performance. *Journal of Portfolio Management*, 43(4), 55–69.

**주요 발견**:
- 헤지펀드 9000개 분석
- 체계적 펀드와 재량 펀드 성과 **거의 동일**
- 차이는 변동성: 체계적이 더 일관됨

### 4. Renaissance Technologies — 전설의 비공개 정보

#### Medallion Fund 성과
- 1988-2018 평균 연 39% (수수료 후)
- S&P 500의 5배
- 1조 달러 운용 가능했지만 자체 제한
- **외부 투자자 못 받음** (사내 직원만)

#### 비공개 알고리즘 — 알려진 단편
- Hidden Markov Model 기반
- 수천 개의 약한 신호 결합
- 5분 이하 단기 매매
- 직원의 80%가 박사 (수학, 물리)

> 📄 Zuckerman, G. (2019). *The Man Who Solved the Market: How Jim Simons Launched the Quant Revolution*. Portfolio.

---

## 🟣 [전공자] — 1차 자료와 학술적 배경

### 1. 퀀트 투자의 학술적 출발점

#### 1.1 Markowitz (1952) — Modern Portfolio Theory

> 📄 Markowitz, H. (1952). Portfolio selection. *Journal of Finance*, 7(1), 77–91.

평균-분산 최적화:

$$ \min_{w} \frac{1}{2} w^T \Sigma w \quad \text{s.t.} \quad w^T \mu = \mu_p, \quad w^T \mathbf{1} = 1 $$

#### 1.2 Sharpe (1964) — CAPM

$$ E[r_i] = r_f + \beta_i (E[r_M] - r_f) $$

> 📄 Sharpe, W. F. (1964). Capital asset prices. *Journal of Finance*, 19(3), 425–442.

#### 1.3 Fama-French (1993) — 3 Factor Model

$$ r_i - r_f = \alpha + \beta_M (r_M - r_f) + \beta_{SMB} \text{SMB} + \beta_{HML} \text{HML} + \varepsilon $$

- **SMB** (Small Minus Big): 소형주 - 대형주
- **HML** (High Minus Low): 가치주 - 성장주

> 📄 Fama, E. F., & French, K. R. (1993). Common risk factors in the returns on stocks and bonds. *JFE*, 33(1), 3–56.

#### 1.4 Carhart (1997) — 4 Factor Model

3 Factor + **Momentum**:
$$ r_i - r_f = \alpha + \beta_M (r_M - r_f) + \beta_{SMB} \text{SMB} + \beta_{HML} \text{HML} + \beta_{MOM} \text{MOM} + \varepsilon $$

> 📄 Carhart, M. M. (1997). On persistence in mutual fund performance. *JoF*, 52(1), 57–82.

#### 1.5 Fama-French (2015) — 5 Factor Model

기존 3 + **Profitability + Investment**.

> 📄 Fama, E. F., & French, K. R. (2015). A five-factor asset pricing model. *JFE*, 116(1), 1–22.

### 2. 머신러닝 + 자산 가격 결정

> 📄 Gu, S., Kelly, B., & Xiu, D. (2020). Empirical asset pricing via machine learning. *Review of Financial Studies*, 33(5), 2223–2273.

**핵심 발견**:
- 60년치 미국 주식 데이터에 ML 적용
- **Neural Network + Tree (XGBoost)** 가 전통 모델 압도
- 월 단위 Sharpe Ratio 1.5+ (3 Factor 모델은 0.4)

### 3. 알고리즘 트레이딩 학술 자료

> 📄 Hendershott, T., Jones, C. M., & Menkveld, A. J. (2011). Does algorithmic trading improve liquidity? *Journal of Finance*, 66(1), 1–33.

→ 알고리즘 트레이딩이 시장 유동성 개선에 기여.

> 📄 Brogaard, J., Hendershott, T., & Riordan, R. (2014). High-frequency trading and price discovery. *Review of Financial Studies*, 27(8), 2267–2306.

→ HFT의 가격 발견 기능.

### 4. 한국 퀀트 학술 자료

- 한국증권학회지 (KOSCAJ)
- 한국재무학회지 (Asia-Pacific Journal of Financial Studies)
- 한국FinTech학회지

대표 연구:
- KOSPI 모멘텀 효과 (이재현, 2012)
- 한국 주식의 가치 프리미엄 (김동회, 2015)
- AI 기반 한국 주식 예측 (다수, 2020~)

---

### 🟣 [전공자 심화] — Markowitz MPT의 한계와 후속 연구

#### 원논문 한계
- **정규분포 가정**: 평균-분산 최적화는 자산 수익률이 정규(또는 적어도 타원형) 분포라 가정. 실제로는 fat tail, 비대칭 skewness가 큼 (특히 위기 시).
- **분산을 위험 척도로 사용**: 분산은 상방·하방을 동등 취급. 투자자가 신경 쓰는 것은 주로 하방 위험.
- **단일 기간 모형**: 다기간 동적 헷지·소비-투자 의사결정 미반영(Merton 1969 ICAPM 이전).
- **추정 오차 민감성**: 입력 $\mu, \Sigma$의 추정 오차가 작아도 최적 비중이 극단적으로 흔들림 (Michaud 1989 "error maximizer").
- **상관계수의 시변성**: 위기 시 상관계수가 1로 수렴하여 분산 효과가 사라지는 "diversification meltdown".

#### 비판 문헌
- Michaud, R. O. (1989). The Markowitz optimization enigma: Is 'optimized' optimal? *Financial Analysts Journal*, 45(1), 31–42. — MV 최적화가 "오차 극대화기"라는 고전 비판.
- Artzner, P., Delbaen, F., Eber, J.-M., & Heath, D. (1999). Coherent measures of risk. *Mathematical Finance*, 9(3), 203–228. — VaR가 일관성(coherence)을 만족하지 못함을 증명.
- Embrechts, P., McNeil, A., & Straumann, D. (2002). Correlation and dependence in risk management: properties and pitfalls. *Risk Management: Value at Risk and Beyond*, Cambridge UP. — 정규 상관계수의 한계, copula 필요성.

#### 후속 연구 동향 (2000~)
- Rockafellar, R. T., & Uryasev, S. (2000). Optimization of conditional value-at-risk. *Journal of Risk*, 2(3), 21–41. — CVaR(=ES)를 선형계획법으로 최적화. https://sites.math.washington.edu/~rtr/papers/rtr179-CVaR1.pdf
- Rockafellar, R. T., & Uryasev, S. (2002). Conditional value-at-risk for general loss distributions. *Journal of Banking & Finance*, 26(7), 1443–1471. — 일반 분포에 대한 CVaR 이론 확장.
- Black, F., & Litterman, R. (1992). Global portfolio optimization. *Financial Analysts Journal*, 48(5), 28–43. — 시장 균형(implied returns) + 투자자 views를 베이지안으로 결합해 입력 추정 문제 완화.
- Meucci, A. (2010). The Black-Litterman approach: original model and extensions. *Encyclopedia of Quantitative Finance*. SSRN: https://papers.ssrn.com/abstract=1117574 — BL의 일반 분포·CVaR 확장.

#### 실무 적용 시 주의점
- 한국 시장은 KOSPI 200 내 반도체 비중이 매우 높아(2024 기준 삼성전자 단일 종목이 시총 20%+), naive MV 최적해는 반도체 단일 종목으로 쏠리는 경향. shrinkage(Ledoit-Wolf 2003)나 BL 사전(prior)이 사실상 필수.
- 외환위기·2008·2020 코로나처럼 5~10년 주기로 fat-tail 이벤트가 반복되므로 정규 가정 하 MV는 위기 시 손실 과소평가. ES(Expected Shortfall) 또는 historical CVaR로 검증 권장.
- 한국 공모펀드 운용지침은 여전히 MV 기반 트래킹 에러 관리가 표준이지만, 사모/헤지펀드는 2010년대 후반부터 ES 한도를 병행하는 사례 증가.

---

### 🟣 [전공자 심화] — Fama-French 모델의 한계와 후속 연구

#### 원논문 한계
- **factor zoo 문제**: 1993년 3-factor → 2015년 5-factor로 확장됐지만, 1990년대 이후 학계에서 발표된 "유의" 팩터 누적 316개(Harvey-Liu-Zhu 2016). 사후 데이터 마이닝 의심.
- **표준 t > 2 임계값**: 다중 비교 보정 없는 단일 가설 임계값. multiple testing 보정 시 t > 3.0 필요(Harvey-Liu-Zhu 2016).
- **publication bias / p-hacking**: 음의 결과는 출판되지 않는 경향.
- **out-of-sample 약화**: 발표 후 동일 팩터를 활용한 거래 증가 → 알파 감소.
- **경제적 메커니즘 불명확**: HML, SMB가 왜 작동하는지 risk-based vs. behavioral 논쟁 미해결.

#### 비판 문헌
- McLean, R. D., & Pontiff, J. (2016). Does academic research destroy stock return predictability? *Journal of Finance*, 71(1), 5–32. https://doi.org/10.1111/jofi.12365 — 97개 cross-sectional predictor 분석. **out-of-sample 26% 감소**, **post-publication 58% 감소**. 즉 발표 자체가 알파를 갉아먹음.
- Harvey, C. R., Liu, Y., & Zhu, H. (2016). … and the cross-section of expected returns. *Review of Financial Studies*, 29(1), 5–68. https://doi.org/10.1093/rfs/hhv059 — 1967~2014 발표 팩터 316개 카탈로그. 새 팩터는 t > 3.0을 넘어야 한다고 제안.
- Hou, K., Xue, C., & Zhang, L. (2020). Replicating anomalies. *Review of Financial Studies*, 33(5), 2019–2133. — 452개 anomaly 중 64%가 표준 NYSE 기준에서 통계적으로 재현 안 됨.

#### 후속 연구 동향 (2020~)
- Jensen, T. I., Kelly, B. T., & Pedersen, L. H. (2023). Is there a replication crisis in finance? *Journal of Finance*, 78(5), 2465–2518. — 153개 factor를 93개국에 걸쳐 재검증, 베이지안 계층 모형으로 82% 재현 성공. NBER WP: https://www.nber.org/papers/w28432
- Kozak, S., Nagel, S., & Santosh, S. (2020). Shrinking the cross-section. *Journal of Financial Economics*, 135(2), 271–292. — 수백 개 팩터를 SDF 관점에서 베이지안 shrinkage로 압축, 소수 PCs로 충분.
- Chinco, A., Neuhierl, A., & Weber, M. (2021). Estimating the anomaly base rate. *Journal of Financial Economics*, 140(1), 101–126. — 학계 발표 anomaly 중 진짜 base rate는 11~14% 추정.

#### 실무 적용 시 주의점
- 한국 시장(KOSPI/KOSDAQ)에서 SMB(소형주 프리미엄)는 일관되게 강하지만, HML(가치)은 2010년대 후반 이후 약화. 단일 시장 백테스트로 검증 시 sample period 의존성 큼.
- 외국인 매매 비중 30%+ → 글로벌 factor 노출이 KOSPI 종목에 동시 영향. 미국 5-factor가 한국 cross-section에서 통계적으로 유의한 경우 다수.
- 한국 학계에서 발표된 한국형 anomaly(예: 외국인 순매수, 기관 동시매수)는 표본 짧고 거래비용/공매도 제약 반영 시 알파가 사라지는 경우 흔함.

---

### 🟣 [전공자 심화] — Gu-Kelly-Xiu(2020) ML 자산 가격의 한계와 후속 연구

#### 원논문 한계
- **거래비용 미반영**: 보고된 Sharpe는 gross. 월 단위 리밸런싱 가정이지만 실제 거래비용 반영 시 small-cap 알파 상당 부분 소멸 가능.
- **인과 해석 부재**: NN의 예측력을 보여주지만 **어떤** 특성이 왜 작동하는지 경제적 메커니즘 약함.
- **샘플 외 미래**: 1957~2016 학습. 2017 이후 ML 알파 사용 증가 → crowding 위험.
- **micro-cap 의존**: 알파의 큰 부분이 시총 하위 종목에서 발생. 실제 자본 운용 시 제약.
- **하이퍼파라미터 선택**: 무수한 NN 구조 중 사후 보고된 것만 발표 → "selection on the dependent variable" 위험.

#### 비판 문헌
- Avramov, D., Cheng, S., & Metzker, L. (2023). Machine learning vs. economic restrictions: Evidence from stock return predictability. *Management Science*, 69(5), 2587–2619. — ML 알파의 큰 부분이 micro-cap, 고변동성, 무신용등급 종목에서 발생. 경제적 제약(예: liquidity filter) 부과 시 알파 절반 이상 감소.
- Leippold, M., Wang, Q., & Zhou, W. (2022). Machine learning in the Chinese stock market. *Journal of Financial Economics*, 145(2), 64–82. — 중국 시장에서 ML 적용. 미국과 다른 패턴(개인투자자 비중 高).

#### 후속 연구 동향 (2020~)
- Chen, L., Pelger, M., & Zhu, J. (2024). Deep learning in asset pricing. *Management Science*, 70(2), 714–750. https://doi.org/10.1287/mnsc.2023.4695 — no-arbitrage 조건을 손실 함수에 직접 부과(GAN 구조), SDF를 신경망으로 직접 추정. arXiv: https://arxiv.org/abs/1904.00745
- Kelly, B. T., & Xiu, D. (2023). Financial machine learning. *Foundations and Trends in Finance*, 13(3-4), 205–363. https://doi.org/10.1561/0500000064 — 분야 전반 서베이. "virtue of complexity" 명제(고차원 모델이 경제적으로도 유리).
- Bryzgalova, S., Pelger, M., & Zhu, J. (2025). Forest through the trees: Building cross-sections of stock returns. *Journal of Finance*. — 트리 기반 통합 cross-section 구축.

#### 실무 적용 시 주의점
- 한국 시장 적용 시 표본 길이가 짧음(KOSPI 시계열 ~1980, COMPUSTAT-Korea ~1990). 60년 미국 데이터 기반 결론 그대로 적용 위험.
- KOSDAQ 소형주는 일중 가격제한·상하한가, 거래정지 빈도가 높아 거래비용/슬리피지 모델링이 미국보다 훨씬 더 보수적이어야 함.
- 한국형 ML factor 연구는 외국인 매매·공매도 잔고 등 한국 고유 변수 포함 시 SOTA 모델 대비 추가 알파 보고 사례 있음(예: 정찬식·왕수봉 2022 한국증권학회지).

---

## 📚 책에는 없지만 알면 좋은 것

### 🔍 보충 1 — 액티브 vs. 패시브 — 한국 ETF 시장

#### 글로벌 트렌드
- 2024년 글로벌 ETF 자산: **$13조** (전체 펀드의 50%)
- 액티브 펀드 비중 매년 감소
- 패시브가 액티브를 이긴다는 학술 증거 다수

#### 한국 ETF 시장 (2024 말)
- ETF 순자산총액: 약 **170조원** (한국거래소 발표)
- 종목 수: 약 900개
- 점유율: 삼성자산운용 KODEX, 미래에셋 TIGER 양강 (각각 약 35~40% 추정; 정확 수치는 [topdaily.kr](https://en.topdaily.kr/articles/9143) 등 보도 참고)

#### Active 비용 vs. Passive 비용
```
Active 펀드 비용: 1.5~2.0%/년
Passive ETF 비용: 0.05~0.5%/년
   → 30년 복리 차이: 약 50%
```

### 🔍 보충 2 — Hedge Fund 분류 (Credit Suisse 9 Strategy)

| 전략 | 핵심 | 대표 펀드 |
|------|------|---------|
| Long-Short Equity | 주식 롱숏 | Tiger, Pershing |
| Global Macro | 거시경제 | Bridgewater |
| Event-Driven | M&A, 도산 | Elliott |
| Convertible Arbitrage | 전환사채 차익 | Citadel |
| Fixed Income Arbitrage | 채권 차익 | LTCM (폐기) |
| Emerging Markets | 신흥시장 | Och-Ziff |
| Multi-Strategy | 멀티 | Citadel, Millennium |
| Managed Futures | 선물/CTA | Man AHL |
| Quant Statistical Arbitrage | 통계 차익 | Renaissance, DE Shaw |

### 🔍 보충 3 — 한국 헤지펀드 현황 (2024)

- **자산**: 한국 사모펀드 약정액 약 150조원대(2024, KDI/금감원). 한국형 헤지펀드(전문사모집합투자기구) 단독 통계는 금융투자협회 freesis 참조 권장
- **운용사**: 약 300개
- **법적 형태**: 한국형 헤지펀드 (전문 사모집합투자기구)
- **대표**: 타임폴리오, 라임 (사기로 폐쇄), DS자산운용
- **한계**: 미국 헤지펀드 대비 약 1/50~1/100 규모

> ⚠ 정정: 초기 작성본의 "약 30조원"은 2020-2021년 시점 수치. 2024년 기준 한국형 헤지펀드 AUM은 약 50~60조원대로 확대.

### 🔍 보충 4 — Two Sigma & D.E. Shaw — Quant Giants

#### Two Sigma (뉴욕)
- 운용 자산: $60B+ (2024)
- 설립: 2001
- 직원: 1700+ (50% 데이터 과학자)
- 기술 스택: Python, C++, GPU 클러스터

#### D.E. Shaw (뉴욕)
- 운용 자산: hedge fund AUM 약 $65B+ (2024), 총 운용자산(discretionary AUM) ~$120B+ (2024 Form ADV)
- 설립: 1988 (David Shaw)
- D.E. Shaw 출신: Jeff Bezos (Amazon 창업 전 D.E. Shaw 부사장으로 근무)
- 다양한 전략 (퀀트 + 재량 혼합)

> ⚠ 정정: 초기 작성본의 "$60B+"는 과소이며, "알파벳 출신: Jeff Bezos"는 표현 오류. Bezos는 Google 모회사 Alphabet과 무관하며, Amazon 창업 전 1990-1994년 D.E. Shaw에 재직했다.

### 🔍 보충 5 — 한국 알고리즘 트레이딩 진입 방법

#### 개인 투자자가 알고리즘 거래 시작하려면

1. **API 접근**: 키움 API, 한국투자 API
2. **백테스팅 라이브러리**: backtrader, zipline, QuantConnect
3. **데이터**: pykrx (한국 주식), FinanceDataReader
4. **전략 학습**: 책 Ch2 실습 1, 2, 3

#### 시작 가이드

```python
# 키움 API 예시 (간소화)
import KiwoomOpenAPI

api = KiwoomOpenAPI()
api.connect()

# 종목 코드 가져오기
codes = api.get_code_list("0")  # 코스피

# 가격 조회
price = api.get_current_price("005930")  # 삼성전자

# 주문 (실제론 더 복잡)
api.send_order("매수", "005930", 10, price)
```

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. 퀀트 투자랑 알고리즘 트레이딩이 같은 말?

**A.** **아니다, 포함 관계**.
- 퀀트 투자: 정량적 분석 + 전략 (아이디어 단계 포함)
- 알고리즘 트레이딩: 그 전략을 코드로 자동 실행

```
퀀트 투자 ⊃ 알고리즘 트레이딩
   (전략)   ⊃   (실행)
```

### Q2. 재량 투자자가 더 이상 안 통하는 시대인가?

**A.** **부분적으로 맞음**.
- HFT 영역: 인간 못 따라감 (마이크로초)
- 펀더멘털 영역: 여전히 강함 (워런 버핏)
- **AI가 둘 다 도움**: 재량 투자자도 AI로 데이터 분석

### Q3. 르네상스의 39% 수익이 진짜인가?

**A.** **진짜지만 일반화 어려움**.
- 30년 평균 (1988~2018)
- 그러나 **외부 투자 안 받음**
- 일반 투자자는 못 참여
- Medallion 외 다른 펀드 (RIEF, RIDA)는 성과 평범

### Q4. 한국에서 알고리즘 트레이딩 시작 어려운가?

**A.** **상대적으로 어려움**.
- 미국: TradeStation, Interactive Brokers → 쉬움
- 한국: 키움/한투 API 제공하지만 사용 복잡
- 백테스팅 데이터 부족
- 규제 (시장조성 의무, 주문 제한)

### Q5. 5가지 자산 외 다른 건?

**A.** 책에 빠진 것:
- **외환 (FX)**: 일일 거래량 $7T (가장 큰 시장)
- **암호화폐**: 시가총액 $2T+
- **파생상품**: 옵션, 선물, 스왑
- **대안 투자**: PE, VC, Hedge Fund
- **수집품**: 와인, 미술품, NFT

### Q6. "체계적 vs. 재량적" 중 뭐가 좋은가?

**A.** **상황에 따라 다름**.

| 상황 | 더 유리한 쪽 |
|------|----------|
| 안정적 시장 | 체계적 (일관성) |
| 큰 충격 (코로나, 전쟁) | 재량적 (직관) |
| 단기 매매 | 체계적 (속도) |
| 장기 가치 투자 | 재량적 (기업 이해) |
| 정보 비대칭 시장 | 재량적 |
| 효율적 시장 | 체계적 (저비용) |

### Q7. AI가 인간 투자자를 완전히 대체할까?

**A.** **단기 매매는 거의 완료, 장기 투자는 아직**.

- HFT, 시장조성: AI가 99%
- 중기 매매 (일~월): AI 비중 증가
- 장기 가치 투자: 여전히 인간이 강함
- 사모/VC: 인간 네트워크 중요

→ **AI가 빼앗는 일자리 vs. AI가 만드는 일자리**: 새 트레이딩은 줄지만 ML 엔지니어 증가.

---

## 🎯 이 절에서 가져갈 핵심 7가지

1. **금융 투자 = 5가지 자산** (주식·채권·부동산·원자재·상호금융) + 외환/파생/대안.
2. **2가지 접근법**: 체계적 (퀀트) vs. 재량적 (인간).
3. **퀀트 5단계 진화**: 추세→종목선택→스마트베타→HFT→AI 시대.
4. **알고리즘 트레이딩 = 퀀트 전략의 자동 실행** (퀀트 ⊃ 알고 트레이딩).
5. **글로벌 알고리즘 트레이딩 시장**: 2024년 $19B, 2030년 $40B (CAGR 11~14%).
6. **"우리는 이제 모두 퀀트다"** (Harvey 2017) — 재량+체계 융합.
7. **AI는 양쪽 모두에서 핵심 도구**가 됨. 책 Ch2 실습 3개가 그 진화의 축소판.

---

## 📖 더 읽을거리

### 입문
- 강환국. (2017). *할 수 있다! 퀀트 투자*. 에프엔미디어. — **한국어 퀀트 입문 베스트**.
- 신진오. (2023). *파이썬 증권 데이터 분석* (2판). 한빛미디어.

### 학술
- López de Prado, M. (2018). *Advances in Financial Machine Learning*. Wiley.
- López de Prado, M. (2020). *Machine Learning for Asset Managers*. CUP.
- Harvey, C. R., Rattray, S., & Van Hemert, O. (2021). *Strategic Risk Management*. Wiley.

### 헤지펀드/퀀트 역사
- Zuckerman, G. (2019). *The Man Who Solved the Market*. Portfolio. — Renaissance 비화.
- Lewis, M. (2014). *Flash Boys*. Norton. — HFT 다큐.
- Mallaby, S. (2010). *More Money Than God*. Penguin. — 헤지펀드 역사.

### 1차 자료 (학술 논문)
- Markowitz, H. (1952). Portfolio selection. *JoF*.
- Fama, E. F., & French, K. R. (1993). Common risk factors. *JFE*.
- Harvey, C. R., et al. (2017). Man vs. Machine. *Journal of Portfolio Management*.
- Gu, S., Kelly, B., & Xiu, D. (2020). Empirical asset pricing via machine learning. *RFS*.

### 한국 자료
- 한국증권학회. 한국증권학회지.
- 한국거래소. 매년 시장 통계.
- 자본시장연구원. 동향 보고서.

---

## 📋 검증 노트 / 변경 이력

| # | 항목 | 초기 작성본 | 수정 내용 | 1차 출처 |
|---|---|---|---|---|
| 1 | 르네상스 Medallion | "1989~" | 회사 1982 설립, **Medallion Fund 1988 출범**, 1988-2018 평균 연 39% 수수료 후 | [Renaissance Wikipedia](https://en.wikipedia.org/wiki/Renaissance_Technologies) |
| 2 | 한국형 헤지펀드 시장 | "약 30조원 (2024)" | **한국 사모펀드 약정액 ~150조 (KDI/금감원); 한국형 헤지펀드 단독은 freesis 참조** | [KDI](https://eiec.kdi.re.kr/policy/materialView.do?num=268220) |
| 3 | D.E. Shaw | "$60B+, 알파벳 출신 Bezos" | **hedge fund AUM ~$65B, 총 운용자산 ~$120B+ (2024 Form ADV)**; Bezos는 1990-1994년 D.E. Shaw 부사장 | [Hedgeweek 2024](https://www.hedgeweek.com/de-shaw-to-return-billions-to-investors-after-stellar-2024-performance/) |
| 4 | Algorithm trading 시장 | $121B → $315B | **Acumen 기준 $14.1B (2021) → $41.9B (2030), CAGR 12.9%** (출처별 편차 큼) | [Acumen](https://www.acumenresearchandconsulting.com/) |

---

> **다음 절 예고** — §2.2 + §2.3
> 금융 투자에서 AI가 왜 각광받는지의 3가지 이유 (컴퓨팅·데이터·오픈소스) 와 AI 투자의 장단점을 본다.
