# 1.6 금융 AI 핵심 문제 정의 — *From Use Cases to Problem Statements*

> **해설 분량**: 약 20쪽
> **읽는 데 걸리는 시간**: 약 35분

---

## 🪧 이 절을 한 줄로

> "AI를 활용해 X를 해결한다"는 막연한 말을 **검증 가능한 문제 정의 (problem statement)** 로 바꾸는 게 모든 ML 프로젝트의 시작점이다.
> Oliver Wyman 2023 글로벌 핀테크 해커톤의 16개 문제가 **현장의 진짜 고민** 을 보여준다.

책은 §1.6에서 해커톤 문제 16개를 4개 카테고리로 나눠 나열한다. 이 해설집은:
1. 16개 문제를 **ML 문제로 번역하는 법** (분류·회귀·생성·랭킹 등)
2. **한국 금융 시장의 현장 문제** 추가
3. **나만의 문제 정의 작성 가이드**

### 📍 미리 그릴 큰 그림

<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">"문제 → ML 문제 → 모델 → 결과" — 모든 금융 AI 프로젝트의 흐름</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <rect x="20" y="80" width="160" height="100" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="100" y="105" text-anchor="middle" font-weight="700" fill="#c4724e">① 비즈니스 문제</text>
    <text x="100" y="128" text-anchor="middle" font-size="10" fill="#1c1917">"사기 거래 줄이고 싶다"</text>
    <text x="100" y="148" text-anchor="middle" font-size="10" fill="#57534e">- 막연함</text>
    <text x="100" y="163" text-anchor="middle" font-size="10" fill="#57534e">- 측정 불가</text>
    <text x="190" y="135" text-anchor="middle" font-size="20" fill="#a8a29e">→</text>
    <rect x="210" y="80" width="160" height="100" rx="8" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="290" y="105" text-anchor="middle" font-weight="700" fill="#5a7a96">② 문제 정의</text>
    <text x="290" y="128" text-anchor="middle" font-size="10" fill="#1c1917">"거래 → P(사기) 분류"</text>
    <text x="290" y="148" text-anchor="middle" font-size="10" fill="#57534e">- 입력/출력 명확</text>
    <text x="290" y="163" text-anchor="middle" font-size="10" fill="#57534e">- 측정 가능 (F1)</text>
    <text x="380" y="135" text-anchor="middle" font-size="20" fill="#a8a29e">→</text>
    <rect x="400" y="80" width="160" height="100" rx="8" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="480" y="105" text-anchor="middle" font-weight="700" fill="#3a7d44">③ ML 모델</text>
    <text x="480" y="128" text-anchor="middle" font-size="10" fill="#1c1917">XGBoost + RNN</text>
    <text x="480" y="148" text-anchor="middle" font-size="10" fill="#57534e">- 학습/검증</text>
    <text x="480" y="163" text-anchor="middle" font-size="10" fill="#57534e">- 성능 비교</text>
    <text x="570" y="135" text-anchor="middle" font-size="20" fill="#a8a29e">→</text>
    <rect x="590" y="80" width="150" height="100" rx="8" fill="#f5e6f0" stroke="#7a6a9a"/>
    <text x="665" y="105" text-anchor="middle" font-weight="700" fill="#7a6a9a">④ 비즈니스 결과</text>
    <text x="665" y="128" text-anchor="middle" font-size="10" fill="#1c1917">"사기 손실 -X%" (목표)</text>
    <text x="665" y="148" text-anchor="middle" font-size="10" fill="#57534e">- ROI 측정</text>
    <text x="665" y="163" text-anchor="middle" font-size="10" fill="#57534e">- 다음 단계</text>
  </g>
  <text x="380" y="225" text-anchor="middle" font-size="13" font-weight="700" fill="#1c1917">가장 어려운 단계 = ① → ② (문제 정의)</text>
  <text x="380" y="250" text-anchor="middle" font-size="11" font-style="italic" fill="#57534e">"잘 정의된 문제는 절반 풀린 문제다" — 존 듀이</text>
  <text x="380" y="275" text-anchor="middle" font-size="11" fill="#57534e">이 절의 목표: 막연한 비즈니스 문제를 ML 문제로 변환하는 법</text>
</svg>

---

## 🟢 [초급] — 일상 비유로 잡는 감

### 1. "AI로 뭐 만들고 싶어?" — 잘못된 질문

회사 임원이 묻는다.

> "야, AI로 뭐 좋은 거 만들어봐."

이 한 줄이 **모든 AI 프로젝트가 실패하는 출발점**.

왜? 너무 막연해서.

#### 좋은 질문 vs. 나쁜 질문

| 나쁜 질문 | 좋은 질문 |
|----------|---------|
| "AI로 사기를 줄이자" | "현재 카드 사기 손실률 0.05%를 0.01%로 낮추기" |
| "챗봇 만들자" | "콜센터 상담 5분 → 30초로 줄이고, 80%를 자동 응답으로" |
| "신용평가 개선" | "기존 점수 KS 0.40 → 0.50, 부도율 -10%" |
| "투자 추천 AI" | "고객 만족도 NPS 60 → 75, 자산 평균 ROI +2%p" |

**핵심**: 문제는 **숫자**로 정의해야 한다.

### 2. 문제 정의의 4 요소 — SMART 프레임워크

좋은 문제 정의는 **SMART** 해야 한다:

| 글자 | 의미 | 예시 |
|------|------|------|
| **S**pecific | 구체적 | "사기 거래 탐지" (X) → "신용카드 CNP 사기 탐지" (O) |
| **M**easurable | 측정 가능 | "잘 잡기" (X) → "PR-AUC 0.85 이상" (O) |
| **A**chievable | 달성 가능 | "사기 100% 차단" (X) → "85% Recall + 95% Precision" (O) |
| **R**elevant | 관련성 | "주가 예측" (X, 그게 사기랑 무슨 관계?) → "거래 시계열 패턴" (O) |
| **T**ime-bound | 시한 | "언젠가" (X) → "Q4 2024 출시" (O) |

### 3. 문제를 ML 문제로 번역하기 — 5가지 유형

모든 ML 문제는 5가지 중 하나:

<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">ML 문제 5가지 유형 — 모든 금융 AI는 이 중 하나</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <rect x="20" y="55" width="140" height="120" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="90" y="80" text-anchor="middle" font-weight="700" fill="#c4724e">① 분류</text>
    <text x="90" y="98" text-anchor="middle" font-size="10" fill="#1c1917">Classification</text>
    <text x="90" y="120" text-anchor="middle" font-size="10" fill="#1c1917">출력: 카테고리</text>
    <text x="90" y="140" text-anchor="middle" font-size="10" fill="#57534e">예: 사기/정상</text>
    <text x="90" y="155" text-anchor="middle" font-size="10" fill="#57534e">예: 부도/정상</text>
    <text x="90" y="170" text-anchor="middle" font-size="10" fill="#a8a29e">→ Ch3,4</text>
    <rect x="170" y="55" width="140" height="120" rx="8" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="240" y="80" text-anchor="middle" font-weight="700" fill="#5a7a96">② 회귀</text>
    <text x="240" y="98" text-anchor="middle" font-size="10" fill="#1c1917">Regression</text>
    <text x="240" y="120" text-anchor="middle" font-size="10" fill="#1c1917">출력: 숫자</text>
    <text x="240" y="140" text-anchor="middle" font-size="10" fill="#57534e">예: 가격 예측</text>
    <text x="240" y="155" text-anchor="middle" font-size="10" fill="#57534e">예: 신용점수</text>
    <text x="240" y="170" text-anchor="middle" font-size="10" fill="#a8a29e">→ Ch2,3</text>
    <rect x="320" y="55" width="140" height="120" rx="8" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="390" y="80" text-anchor="middle" font-weight="700" fill="#3a7d44">③ 랭킹</text>
    <text x="390" y="98" text-anchor="middle" font-size="10" fill="#1c1917">Ranking</text>
    <text x="390" y="120" text-anchor="middle" font-size="10" fill="#1c1917">출력: 정렬</text>
    <text x="390" y="140" text-anchor="middle" font-size="10" fill="#57534e">예: 상품 추천</text>
    <text x="390" y="155" text-anchor="middle" font-size="10" fill="#57534e">예: 검색 결과</text>
    <text x="390" y="170" text-anchor="middle" font-size="10" fill="#a8a29e">→ Ch5</text>
    <rect x="470" y="55" width="140" height="120" rx="8" fill="#f5e6f0" stroke="#7a6a9a"/>
    <text x="540" y="80" text-anchor="middle" font-weight="700" fill="#7a6a9a">④ 군집</text>
    <text x="540" y="98" text-anchor="middle" font-size="10" fill="#1c1917">Clustering</text>
    <text x="540" y="120" text-anchor="middle" font-size="10" fill="#1c1917">출력: 그룹</text>
    <text x="540" y="140" text-anchor="middle" font-size="10" fill="#57534e">예: 고객 세그먼트</text>
    <text x="540" y="155" text-anchor="middle" font-size="10" fill="#57534e">예: 이상 패턴</text>
    <text x="540" y="170" text-anchor="middle" font-size="10" fill="#a8a29e">→ Ch4</text>
    <rect x="170" y="190" width="290" height="110" rx="8" fill="#fef9e7" stroke="#8a6d2c"/>
    <text x="315" y="215" text-anchor="middle" font-weight="700" fill="#8a6d2c">⑤ 생성 (Generation)</text>
    <text x="315" y="240" text-anchor="middle" font-size="11" fill="#1c1917">출력: 새로운 데이터 (텍스트·이미지·시계열)</text>
    <text x="315" y="260" text-anchor="middle" font-size="10" fill="#57534e">예: 챗봇 답변, 합성 데이터, 리포트 자동 작성</text>
    <text x="315" y="285" text-anchor="middle" font-size="10" fill="#a8a29e">→ Ch6 (LLM, GenAI)</text>
  </g>
</svg>

> 💡 비즈니스 문제를 듣고 **"이건 어떤 유형이지?"** 를 먼저 묻는 게 습관이 돼야 한다.

> ✅ **여기까지 따라왔으면**: "AI로 뭐 좋은 거 만들어봐" 같은 막연한 요구를 ML 문제로 번역하는 첫 단계가 보일 거다.

---

## 🟡 [중급] — Oliver Wyman 16개 문제 풀이

### 💭 시작하기 전에

책은 Oliver Wyman Global FinTech Hackathon 2023의 16개 문제를 4개 카테고리로 인용. 각 문제를 **ML 유형 + 데이터 + 메트릭** 으로 분해하자.

### 1. 카테고리 ① — 고객 경험 향상 (4개 문제)

#### 문제 1-1: 개인화된 경험 제공

> **원문**: "AI를 활용해 내외부의 다양한 데이터를 분석하고, 고객의 깊은 요구와 기대치를 파악하면서 어떻게 개인화된 경험을 제공할 수 있을까?"

**ML 번역**:
- **유형**: ③ 랭킹 + ⑤ 생성
- **입력**: 고객 거래내역, 인구통계, 외부 데이터 (소셜)
- **출력**: TOP-N 상품 추천 + 맞춤 메시지
- **메트릭**: CTR (Click-Through Rate), 컨버전율, NPS

#### 문제 1-2: 안전한 자동 응답 인터페이스

> **원문**: "조직 및 규제 기준을 준수하면서 고객의 질문에 안전하게 직접 응답하는 인터페이스"

**ML 번역**:
- **유형**: ⑤ 생성 (LLM + RAG)
- **입력**: 고객 질문 + 사내 정책 문서 (RAG)
- **출력**: 자연어 답변 + 출처
- **메트릭**: 답변 정확도, 규정 준수율, 응답 시간

→ **Ch6에서 본격 다룸**.

#### 문제 1-3: 콜센터 실시간 지원

> **원문**: "고객 서비스의 콜센터나 운영 팀이 각각의 상황을 고려하여 고객의 질문이나 요구에 신속하게 반응할 수 있도록"

**ML 번역**:
- **유형**: ⑤ 생성 (요약 + 추천)
- **입력**: 실시간 통화 음성 → STT → 텍스트
- **출력**: 상담사에게 "이 고객의 과거 이력 + 다음 질문 제안" 표시
- **메트릭**: 평균 통화 시간 감소, 1차 해결률(FCR) 증가

#### 문제 1-4: 서비스 품질 일관성 유지

> **원문**: "고객과의 상호작용을 분석하여 서비스 품질을 AI로 어떻게 일관되게 유지하고 향상시킬 수 있을까?"

**ML 번역**:
- **유형**: ① 분류 (감정 분석)
- **입력**: 통화 녹취록, 챗봇 로그, 리뷰
- **출력**: 만족/불만족 + 이유 카테고리
- **메트릭**: CSAT (Customer Satisfaction)

### 2. 카테고리 ② — 운영 효율성 향상 (4개 문제)

#### 문제 2-1: 포트폴리오 관리 + 투자 전략 추천

> **원문**: "실시간 시장 데이터와 고객의 선호도를 기반으로, AI를 활용하여 트레이딩 기관이나 자산 관리사가 포트폴리오를 관리하고 최적의 투자 전략을 추천받는 방법"

**ML 번역**:
- **유형**: ② 회귀 (수익률 예측) + 최적화
- **입력**: 시장 가격, 고객 리스크 프로파일, 매크로 지표
- **출력**: 자산별 비중 (포트폴리오)
- **메트릭**: Sharpe Ratio, Maximum Drawdown

→ **Ch2 실습 1,2,3에서 본격 다룸**.

#### 문제 2-2: 청약·대출·결제 프로세스 최적화

> **원문**: "보험 청약, 대출 발행, 결제 등의 과정에서 AI를 활용하여 정보 수집, 정리, 분석 작업을 어떻게 효율적으로 최적화"

**ML 번역**:
- **유형**: ⑤ 생성 (OCR + 정보 추출) + ① 분류
- **입력**: 신분증, 소득 증명서, 거래내역 (이미지)
- **출력**: 구조화된 데이터 → 자동 심사
- **메트릭**: 처리 시간 (분→초), 정확도

#### 문제 2-3: 비표준 보고서 자동 생성

> **원문**: "고객이나 내부 팀의 특별한 요청에 대한 비표준 보고서나 응답을 생성"

**ML 번역**:
- **유형**: ⑤ 생성 (LLM)
- **입력**: 자연어 요청 + DB 쿼리 결과
- **출력**: 자연어 보고서 + 차트
- **메트릭**: 정확성, 사용자 채택률

#### 문제 2-4: 청구서 자동 분류·처리

> **원문**: "청구서의 다양한 형식을 효과적으로 분류하고 처리"

**ML 번역**:
- **유형**: ① 분류 (Document Classification)
- **입력**: 청구서 이미지 (다양한 양식)
- **출력**: 카테고리 + 추출 정보
- **메트릭**: 정확도, 자동 처리율

### 3. 카테고리 ③ — 리스크/규제/사기 모니터링 (4개 문제)

#### 문제 3-1: 잠재 리스크와 사기 자동 탐지

> **원문**: "인간의 개입 없이 고객의 개인 정보 보호 수준을 유지하면서 잠재적 리스크와 사기 활동을 어떻게 자동으로 감지"

**ML 번역**:
- **유형**: ④ 군집 (Anomaly Detection) + ① 분류
- **입력**: 거래 데이터 (실시간)
- **출력**: 정상/의심/사기
- **메트릭**: PR-AUC, F1

→ **Ch4에서 본격 다룸**.

#### 문제 3-2: 포트폴리오/고객 리스크 평가

> **원문**: "내외부 데이터를 분석하여 포트폴리오나 고객의 리스크 수준을 AI로 어떻게 평가하고 매핑"

**ML 번역**:
- **유형**: ② 회귀 (Risk Score)
- **입력**: 자산 구성, 시장 변동성, 거시지표
- **출력**: VaR, Expected Shortfall
- **메트릭**: 백테스팅 적중률

#### 문제 3-3: 사기 법인 가치 평가 신뢰도

> **원문**: "사기 법인의 가치 평가에 대한 투자자의 신뢰도를 어떻게 향상"

**ML 번역**:
- **유형**: ① 분류 (사기 법인 탐지) + ② 회귀 (정상 가치 평가)
- **입력**: 재무제표, 공시 정보, 뉴스
- **출력**: 사기 확률 + 진짜 가치 추정
- **메트릭**: 사기 적발률, 가치 평가 오차

#### 문제 3-4: 기업/SNS 활동 모니터링

> **원문**: "기업 및 소셜 미디어 플랫폼에서의 활동을 AI로 모니터링하여, 의심스러운 활동을 어떻게 감지"

**ML 번역**:
- **유형**: ① 분류 (Sentiment + Anomaly)
- **입력**: SNS, 뉴스, 공시
- **출력**: 정상/의심 + 감정 점수
- **메트릭**: 조기 경보 정확도

### 4. 카테고리 ④ — ESG 솔루션 활성화 (2개 문제)

#### 문제 4-1: ESG 데이터 표준화·검증

> **원문**: "기관 간에 제한되고 파편화된 데이터를 고려하여, AI는 어떻게 기후 리스크, 배출, ESG 데이터를 효과적이고 신뢰할 수 있게 표준화하여 측정, 추적, 검증"

**ML 번역**:
- **유형**: ⑤ 생성 (NLP로 비정형 → 구조화)
- **입력**: 기업 ESG 보고서 (텍스트, PDF)
- **출력**: 표준화된 지표 (CDP, GRI, SASB 형식)
- **메트릭**: 추출 정확도, 표준 준수율

#### 문제 4-2: 넷제로 계획 지원

> **원문**: "예상되는 기후 리스크, 산업 표준, 규제 요구 사항 또는 비즈니스 목표와 같은 요인들을 고려하여, 사업의 특성과 지속 가능한 경로를 기반으로 넷제로 계획을 지원"

**ML 번역**:
- **유형**: ② 회귀 + 시나리오 분석
- **입력**: 현재 배출량, 사업 계획, 규제
- **출력**: 2030/2050 배출 경로 + 권장 조치
- **메트릭**: 시나리오 정확도

### 5. 한국 금융 시장의 추가 핵심 문제 6가지

책 + Oliver Wyman 에 없는 한국 특화 문제:

#### 문제 5-1: 보이스피싱 실시간 차단
- **유형**: ① 분류 + 음성 인식
- **입력**: 통화 음성, 송금 패턴
- **출력**: 보이스피싱 의심 → 송금 차단
- **메트릭**: 차단율, 오차단율

#### 문제 5-2: 부동산 PF 부실 조기 경보
- **유형**: ② 회귀 + 시계열
- **입력**: PF 사업장 데이터, 분양률, 지역 부동산 시세
- **출력**: 부실 확률 6개월 전 예측
- **메트릭**: 조기 적발률

#### 문제 5-3: 청년 신용평가 (대안 데이터)
- **유형**: ② 회귀 (Credit Score)
- **입력**: 통신 데이터, 위치, 앱 사용, SNS
- **출력**: 청년 신용 점수
- **메트릭**: 미평가자 평가 성공률

#### 문제 5-4: 마이데이터 기반 자산 진단
- **유형**: ⑤ 생성 (개인화 리포트)
- **입력**: 통합 자산 데이터 (마이데이터)
- **출력**: 자산 현황 + 개선 제안
- **메트릭**: 사용자 채택률, 행동 변화율

#### 문제 5-5: 고령 고객 디지털 어시스턴트
- **유형**: ⑤ 생성 (음성 LLM)
- **입력**: 음성 질문 (사투리, 노인 발화)
- **출력**: 단계별 안내 음성
- **메트릭**: 작업 완료율 (송금, 조회 등)

#### 문제 5-6: 기후 변화 대출 영향 평가
- **유형**: ② 회귀
- **입력**: 대출 포트폴리오, 기후 시나리오 (IPCC)
- **출력**: 기후 시나리오별 부도 확률
- **메트릭**: 시나리오 일치도

### 6. 문제 정의 작성 가이드 — 템플릿

#### 한 페이지 문제 정의 템플릿

```markdown
# 문제 정의: [프로젝트 이름]

## 1. 비즈니스 문제
[1-2 문장으로 막연한 문제 진술]
예: "신용카드 사기 손실이 증가하고 있다"

## 2. 측정 가능한 목표
- 현재 (Baseline): [수치]
- 목표: [수치] (개선폭 명시)
예: 사기 손실률 0.05% → 0.02% (60% 감소)

## 3. ML 문제 유형
[분류/회귀/랭킹/군집/생성 중 선택]
예: 이진 분류 (binary classification)

## 4. 입력 (Features)
- 데이터 소스: [어디서 오는지]
- 형태: [정형/비정형/시계열]
- 크기: [행 수, 컬럼 수]
예: 신용카드 거래 (1억 행, 200 컬럼)

## 5. 출력 (Target)
- 형태: [확률/카테고리/숫자/텍스트]
- 라벨링 방법: [어떻게 정답 얻나]
예: 0 (정상) / 1 (사기), 사후 30일 차지백 기반

## 6. 평가 지표
- 1차 지표: [모델 평가]
- 2차 지표: [비즈니스 가치]
예: 1차 = PR-AUC, 2차 = 사기 손실액 감소

## 7. 제약 조건
- 응답 시간: [실시간/배치]
- 인프라: [GPU/CPU, 클라우드/온프렘]
- 규제: [개보법, 신용정보법 등]
예: 50ms 안에 응답, 한국 개보법 준수

## 8. 성공 기준
[3개월/6개월/1년 마일스톤]
예: 3개월 POC (PR-AUC 0.80), 6개월 운영 배포

## 9. 비ML 대안
[ML 없이 푸는 방법도 검토]
예: 규칙 기반 + 인간 검토 (현재 운영)

## 10. 위험과 가정
- 위험: [모델 실패 시 영향]
- 가정: [데이터 품질, 라벨 정확성 등]
```

> 💡 이 템플릿을 채우다 보면 "사실 문제가 아직 명확하지 않다"는 게 드러난다. 그게 가장 중요한 발견.

> ✅ **여기까지 따라왔으면**: 16개 Oliver Wyman 문제를 모두 ML 유형으로 분류할 수 있을 것이다.

---

## 🔴 [고급] — 문제 정의의 함정

### 1. ML 문제 정의의 7가지 함정

#### 함정 ①: 라벨 정의의 모호성

**예시**: "사기 거래"의 정의?
- 차지백 발생?
- 고객 신고?
- 모델이 의심 표시?

→ **라벨 정의에 따라 모델 성능이 달라진다**.

#### 함정 ②: Selection Bias

**예시**: 대출 거절자의 데이터가 없음
- 거절했으니 부도 데이터도 없음
- → 모델은 "승인한 사람" 데이터로만 학습
- → 거절했던 사람의 부도율 예측 불가능

**해법**: Reject Inference (거절자 추론) 기법.

#### 함정 ③: Label Leakage

**예시**: 신용평가에 "현재 연체 일수" 사용
- 이건 이미 부도 여부와 매우 강함
- → 모델이 "치트키"로 점수 계산
- → 실제 운영에선 미래 부도 예측 불가능

**해법**: 시점 (time-aware) 피처 엔지니어링.

#### 함정 ④: 평가 메트릭의 함정

**예시**: 사기 탐지에서 Accuracy 99.9% 자랑
- 사기율 0.1%이면 "모두 정상" 예측해도 Accuracy 99.9%
- → **PR-AUC, F1** 같은 적합 메트릭 필수

#### 함정 ⑤: 비즈니스 비용 비대칭 무시

**예시**: 신용평가에서
- False Positive (정상인을 부도로 판정): 고객 이탈 → 매출 손실 100만원
- False Negative (부도자를 정상으로 판정): 부도 → 손실 1000만원
- → **10배 비대칭** → cost-sensitive learning 필요

#### 함정 ⑥: 시간 변화 (Concept Drift)

**예시**: 2019년 데이터로 학습한 사기 탐지 모델
- 2020년 코로나 → 비대면 결제 폭증 → 사기 패턴 변화
- → 모델 성능 급락
- → **재학습 주기 결정** 필요

#### 함정 ⑦: 데이터 양질 부족

**예시**: "AI 안 됐대" — 흔한 원인:
- 데이터가 1만 행밖에 없음
- 라벨이 부정확함
- 결측치가 30%
- 시계열 데이터가 불연속

→ **"Garbage In, Garbage Out"** — 데이터 정제가 ML의 80%.

### 2. 학술적 문제 정의 프레임워크

#### 2.1 CRISP-DM (Cross-Industry Standard Process for Data Mining)

```
1. Business Understanding
   ↓
2. Data Understanding
   ↓
3. Data Preparation
   ↓
4. Modeling
   ↓
5. Evaluation
   ↓
6. Deployment
   ↑__________ (피드백 루프)
```

> 📄 Chapman, P., et al. (2000). *CRISP-DM 1.0: Step-by-step data mining guide*.

#### 2.2 Microsoft TDSP (Team Data Science Process)

CRISP-DM의 확장. **Modeling 단계를 더 세분화** (feature engineering, model evaluation, model deployment).

#### 2.3 Andrew Ng's Data-Centric AI

> "*Instead of focusing on the code, focus on the data.*"
> — Andrew Ng (2021)

→ 모델보다 **데이터 품질이 더 중요** 하다는 패러다임 전환.

### 3. 책의 한계

#### 한계 ①: 16개 문제 모두 "솔루션 미정의"
원문에선 문제만 던지고 해법은 없음. 책도 마찬가지. → 독자가 직접 ML로 번역해야 함.

#### 한계 ②: 한국 사례 없음
Oliver Wyman은 싱가포르/홍콩 기관 중심. 한국 특화 문제 누락.

#### 한계 ③: 문제 정의 가이드 없음
"이런 문제들이 있다"만 보여주고 "어떻게 정의할지"는 안 다룸.

---

## 🟣 [전공자] — 1차 자료

### 1. Oliver Wyman Global FinTech Hackathon 공식 자료

> 📄 Oliver Wyman. (2023). *AI in Finance Global Challenge*.
> URL: https://www.oliverwyman.com/our-expertise/insights/2023/jul/global-fintech-hackathon-2023.html

참여 기관 (책 본문):
- Allianz SE Singapore
- ANZ Singapore
- Bank of Singapore
- BNP Paribas
- Citibank
- DBS Bank (Asia best digital bank 6년 연속)
- Experian Credit Services
- FWD Group
- Great Eastern Life
- Illuminate Financial Management
- Jari Cap Pte. Ltd
- London Stock Exchange Group
- Maybank Singapore
- Munich Reinsurance Company
- New Silk Road Investment
- OCBC Bank
- Passion Venture Capital Pte Ltd
- S&P Global Market Intelligence

### 2. CRISP-DM 1.0

> 📄 Chapman, P., Clinton, J., Kerber, R., et al. (2000). *CRISP-DM 1.0: Step-by-step data mining guide*. SPSS.

### 3. Data-Centric AI

> 📄 Ng, A. (2021). *MLOps: From Model-centric to Data-centric AI*. NeurIPS Data-Centric AI Workshop Keynote.

### 4. 문제 정의의 학술적 고찰

> 📄 Roh, Y., Heo, G., & Whang, S. E. (2021). A survey on data collection for machine learning. *IEEE TKDE*, 33(4).

→ 문제 정의 → 데이터 수집 단계의 학술 표준.

### 5. Label Leakage 학술 자료

> 📄 Kaufman, S., Rosset, S., & Perlich, C. (2012). Leakage in data mining: Formulation, detection, and avoidance. *KDD*.

---

### 🟣 [전공자 심화] — CRISP-DM의 한계와 ML 프로세스 모형 진화

> 💭 본 절은 SMART·CRISP-DM 프레임을 "참고"로만 다뤘다. CRISP-DM은 1996~2000년에 만들어진 **데이터 마이닝(DM) 시대 산물**이며, ML/DL 시대에는 여러 후속 모형이 등장했다.

#### 1. KDD Process — CRISP-DM의 학술적 선조 (Fayyad et al., 1996)

**Fayyad, U., Piatetsky-Shapiro, G., & Smyth, P. (1996)**. The KDD process for extracting useful knowledge from volumes of data. *Communications of the ACM*, 39(11), 27–34. [DOI: 10.1145/240455.240464](https://doi.org/10.1145/240455.240464)
- 9단계: Selection → Preprocessing → Transformation → Data Mining → Interpretation/Evaluation 등.
- KDD를 "**비자명(non-trivial)** 한, 유효하고 새로운, 잠재적으로 유용한 패턴 식별 과정"으로 정의.
- **CRISP-DM과 차이**: KDD는 **학술 중심·기술 단계 위주**, CRISP-DM은 **산업 중심·비즈니스 이해 단계 포함**.

📄 [Fayyad et al. 1996 PDF (KDNuggets)](https://www.kdnuggets.com/gpspubs/aimag-kdd-overview-1996-Fayyad.pdf)

#### 2. CRISP-DM 1.0 (Chapman et al., 2000) — 원문 한계

**Chapman, P., Clinton, J., Kerber, R., Khabaza, T., Reinartz, T., Shearer, C., & Wirth, R. (2000)**. *CRISP-DM 1.0: Step-by-step data mining guide*. SPSS Inc.
- 6단계: Business Understanding → Data Understanding → Data Preparation → Modeling → Evaluation → Deployment.
- SIG (Special Interest Group) NCR·Daimler·SPSS·OHRA 컨소시엄 결과물.

**원문의 5가지 한계** (현대 ML 관점):
1. **Deployment 단계 추상화**: 모니터링·재학습·드리프트 관리 미약. 대부분의 실무 보고서가 deployment를 사실상 다루지 않음 (Schröer et al., 2021 *Procedia CS* SLR).
2. **버전 관리·실험 추적 부재**: Git·MLflow·DVC 같은 도구 등장 전.
3. **데이터 품질 자동화 부재**: 데이터 검증을 사람의 "이해(understanding)"에만 의존.
4. **공정성·설명가능성 미고려**: 1999~2000년 작성 → 알고리즘 책임 개념 없음.
5. **Agile/iterative 부족**: 6단계 순환은 있으나, **스프린트 단위 협업·CI/CD** 개념 없음.

**핵심 비판 문헌**:
- **Schröer, C., Kruse, F., & Gómez, J. M. (2021)**. A systematic literature review on applying CRISP-DM process model. *Procedia Computer Science*, 181, 526–534. [DOI: 10.1016/j.procs.2021.01.199](https://doi.org/10.1016/j.procs.2021.01.199) — CRISP-DM 적용 사례 SLR. **연구의 대다수가 deployment 단계를 다루지 않는다**고 지적.

#### 3. Microsoft Team Data Science Process (TDSP, 2016~)

- 2016년 9월 Microsoft Ignite에서 첫 공개. GitHub 공개 문서.
- 5단계: Business Understanding → Data Acquisition & Understanding → Modeling → Deployment → Customer Acceptance.
- **CRISP-DM과 차이**:
  - 팀 역할 정의 (Solution Architect, Project Manager, Data Engineer, Data Scientist, Application Developer, Project Lead).
  - 표준 프로젝트 구조(템플릿) + Git 워크플로우 통합.
  - Azure ML과 결합.

📄 [Microsoft TDSP GitHub](https://github.com/Azure/Microsoft-TDSP) · [Microsoft Learn TDSP 아카이브](https://learn.microsoft.com/en-us/archive/blogs/machinelearning/the-microsoft-team-data-science-process-tdsp-recent-updates)

**한계**: Azure 중심 → 다른 클라우드 환경에서 도구 종속성. 학술 인용도는 CRISP-DM 대비 낮음.

#### 4. CRISP-ML(Q) — ML 시대의 CRISP-DM 확장 (Studer et al., 2021)

**Studer, S., Bui, T. B., Drescher, C., Hanuschkin, A., Winkler, L., Peters, S., & Müller, K.-R. (2021)**. Towards CRISP-ML(Q): A machine learning process model with quality assurance methodology. *Machine Learning and Knowledge Extraction*, 3(2), 392–413.

(정정: 사용자가 *Data* 학술지로 언급했으나 실제 게재지는 **Machine Learning and Knowledge Extraction (MDPI)**.)

- [arXiv:2003.05155](https://arxiv.org/abs/2003.05155) · [DOI: 10.3390/make3020020](https://doi.org/10.3390/make3020020)
- 6단계: Business & Data Understanding(통합) → Data Preparation → Modeling → Evaluation → Deployment → **Monitoring & Maintenance**.
- 핵심 차별점:
  1. **품질보증(Q) 방법론을 각 단계에 명시** — 단계별 리스크와 완화 방법.
  2. **Business와 Data Understanding을 병합** — 데이터 가용성이 비즈니스 타당성을 결정하는 ML 특성 반영.
  3. **Monitoring & Maintenance를 별도 단계**로 격상 — concept drift, 데이터 드리프트 관리.
  4. 사용 권장: Müller 그룹 (TU Berlin, 한국 고려대 협력) 표준 ML 워크플로우.

#### 5. 추가 비교 모형

| 모형 | 출시 | 단계 | 특징 |
|------|------|------|------|
| **KDD Process** (Fayyad) | 1996 | 9 | 학술 중심, 기술 단계 |
| **CRISP-DM 1.0** | 2000 | 6 | 산업 표준, 비즈니스 포함 |
| **SEMMA** (SAS) | 1990s | 5 | Sample-Explore-Modify-Model-Assess |
| **TDSP** (Microsoft) | 2016 | 5 | Azure 통합, 팀 워크플로우 |
| **CRISP-ML(Q)** | 2021 | 6 | ML 특화, QA + Monitoring 강화 |
| **MS MLOps Maturity Model** | 2020 | 0~4 | 운영 성숙도 측정 |

#### 6. 후속 동향 (2020~)

- **Data-Centric AI** (Ng, 2021): 모델 고정·데이터 개선. CRISP-ML(Q)의 Data Understanding 강조와 일치.
- **MLOps Specification (Kreuzberger et al., 2023)**: Kreuzberger, D., Kühl, N., & Hirschl, S. (2023). Machine learning operations (MLOps): Overview, definition, and architecture. *IEEE Access*, 11, 31866–31879. [DOI: 10.1109/ACCESS.2023.3262138](https://doi.org/10.1109/ACCESS.2023.3262138) — MLOps 9가지 원칙·역할·기술 통합.
- **Responsible AI Process** (Microsoft, Google): 공정성·투명성·책임 단계 명시적 추가.

#### 7. 한국 적용 시 주의점

1. **금융권 IT 거버넌스 충돌**: 한국 금융기관은 **EA(엔터프라이즈 아키텍처)·ISMS·전자금융감독규정** 위에서 ML 프로세스를 정의해야 함. CRISP-DM/TDSP를 그대로 도입 불가.
2. **변경관리(Change Management) 절차**: 모델 배포 = "전산시스템 변경" → 변경자문위원회(CAB) 승인 필요. CRISP-ML(Q)의 Deployment 단계 한국화 시 2~3주 추가.
3. **모델 검증위원회**: 신용평가·FDS 모델은 **내부 모델검증부서(MVT) 독립 검증** 필수. CRISP-DM Evaluation 단계가 사내 거버넌스로 확장됨.
4. **클라우드 망분리**: 학습 환경(Public Cloud)과 운영 환경(망분리)이 다름 → MLOps 파이프라인 단절. TDSP의 Azure-only 가정 적용 불가.
5. **데이터 마이그레이션 제약**: 가명정보 결합은 금융보안원·신용정보원·통계청 등 **데이터전문기관** 경유 필수 → Data Preparation 단계가 외부 기관 의존.
6. **모범사례**: KB·신한·하나의 AI 거버넌스 문서 일부 공개. 카카오뱅크 Tech Blog의 MLOps 시리즈 (2022~) 참고.

---

## 📚 책에는 없지만 알면 좋은 것

### 🔍 보충 1 — Andrew Ng의 ML 프로젝트 5단계

> "*Define project, Collect data, Train model, Deploy model, Maintain model.*"

각 단계의 핵심 질문:
1. Define: "성공이 뭔가?" (메트릭)
2. Collect: "충분한가, 깨끗한가?"
3. Train: "기존보다 나은가?"
4. Deploy: "운영에서도 작동하나?"
5. Maintain: "성능이 떨어지나?"

### 🔍 보충 2 — Failure Mode Analysis

문제 정의 시 "**실패하면 무엇이 깨지나?**" 미리 고민:
- **신용평가 모델 실패** → 부도율 ↑ → 은행 손실
- **사기탐지 모델 실패** → 사기 손실 ↑ → 고객 신뢰 ↓
- **챗봇 실패** → 잘못된 답변 → 규제 위반 + PR 위기
- **트레이딩 모델 실패** → 손실 → 회사 폐쇄 (LTCM 1998)

### 🔍 보충 3 — A/B 테스트 설계

ML 모델 배포 전 검증:
- **A/B Test**: 새 모델 vs. 기존 모델
- **Champion-Challenger**: 운영 중 점진적 교체
- **Bandit**: 실시간 비중 조정 (Thompson Sampling)

### 🔍 보충 4 — 모델 카드 (Model Card)

Google이 제안. 모델 출시 시 동봉할 정보:
- 의도된 사용 사례
- 평가 데이터셋
- 성능 메트릭
- 윤리적 고려
- 알려진 한계

→ 금융 AI도 점점 표준화.

### 🔍 보충 5 — 한국 금융권의 문제 정의 워크숍

**한국 시중은행 KB·신한·하나** 등에서 분기별 진행:
- 사업부서 + AI 부서 + 컴플라이언스 팀 협업
- 문제 정의 → ML 검토 → 우선순위 선정
- 6개월 단위 로드맵

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. 문제 정의가 그렇게 중요하다는데, 실제로는 어떻게 시작?

**A.** 3단계:
1. **현장 인터뷰**: 사업부 직원에게 "지금 가장 답답한 게 뭔가요?"
2. **데이터 탐색**: 실제 데이터를 보고 "ML로 풀 수 있는 부분"을 식별
3. **MVP 정의**: 가장 작은 실험으로 시작

### Q2. 16개 문제 중 가장 어려운 건?

**A.** ESG 표준화 (4-1). 이유:
- 데이터 표준 자체가 미정의 (CDP/GRI/SASB 여러 표준)
- 비정형 텍스트 → 구조화 어려움
- 평가 어려움 (정답이 없음)

### Q3. "문제 정의는 잘 했는데 데이터가 없다"면?

**A.** 3가지 옵션:
1. **공개 데이터 활용**: Kaggle, AIHub
2. **외부 데이터 구매**: NICE, KCB
3. **합성 데이터**: CTGAN으로 생성

### Q4. ML 안 쓰고 풀 수 있는 문제는 ML로 안 풀어야 하나?

**A.** **그렇다**. ML 도입 시 비용:
- 인프라 (서버, GPU): 수억
- 인력 (DS, MLE): 수억/년
- 유지보수: 지속 비용

만약 **규칙 기반으로 90% 풀린다면 ML 안 쓰는 게 낫다**. ML은 마지막 10%를 위한 도구.

### Q5. Oliver Wyman 16개 문제 중 한국에서 가장 핫한 건?

**A.** 분야별:
- **AML/사기탐지**: 자금세탁 규제 강화 (FATF)
- **개인화 챗봇**: LLM 등장으로 폭증
- **로보어드바이저**: 마이데이터 + 동학 개미
- **ESG**: 2024 의무공시 시작

### Q6. CRISP-DM과 TDSP가 뭐가 다른가?

**A.**

| | CRISP-DM | TDSP |
|---|---|---|
| 출시 | 1996 (오래됨) | 2016 (현대화) |
| 단계 | 6단계 | 5단계 (Modeling 세분화) |
| 도구 | 일반 | Microsoft Azure 중심 |
| 인기 | 학계 | 실무 (특히 Azure) |

### Q7. 좋은 문제 정의 1줄로 요약하면?

**A.** **"X가 Y면 행복할까?"**
- X = 입력 (객관적 측정 가능)
- Y = 출력 (수치)
- 행복? = 비즈니스 가치 (검증 가능)

예: "거래 데이터 100만 행 입력하고 사기 의심 거래 1000개 출력하면 → 사기 손실 50억 줄까?"

---

## 🎯 이 절에서 가져갈 핵심 5가지

1. **막연한 비즈니스 문제 → 구체적 ML 문제로 번역**하는 것이 모든 AI 프로젝트의 출발점.
2. ML 문제는 **5가지 유형**: 분류, 회귀, 랭킹, 군집, 생성.
3. **Oliver Wyman 16개 문제**가 현장의 진짜 고민 — 책 Ch2~Ch6의 동기.
4. 문제 정의의 **7가지 함정**: 라벨 모호, Selection Bias, Label Leakage, 메트릭 오용, 비용 비대칭, Concept Drift, 데이터 부족.
5. **SMART + CRISP-DM** 프레임워크가 표준.

---

## 📖 더 읽을거리

### 문제 정의 및 ML 프로젝트
- Ng, A. (2018). *Machine Learning Yearning*. — 무료 PDF. **최고 입문서**.
- Burkov, A. (2020). *The Hundred-Page Machine Learning Book*.
- Géron, A. (2022). *Hands-On Machine Learning* (3rd ed.). O'Reilly.

### CRISP-DM
- Chapman, P., et al. (2000). *CRISP-DM 1.0: Step-by-step data mining guide*. SPSS.
- Wirth, R., & Hipp, J. (2000). CRISP-DM: Towards a standard process model for data mining. *PADD*.

### Data-Centric AI
- Ng, A. (2021). *MLOps: From Model-centric to Data-centric AI*. NeurIPS Keynote.
- Whang, S. E., et al. (2023). Data collection and quality challenges in deep learning. arXiv:2112.06409.

### Oliver Wyman 자료
- Oliver Wyman. (2023). *AI in Finance Global Challenge*. https://oliverwyman.com/

### 금융 ML 프로젝트
- López de Prado, M. (2020). *Machine Learning for Asset Managers*. CUP.
- Dixon, M. F., et al. (2020). *Machine Learning in Finance*. Springer.

---

> **다음 절 예고** — §1.7 금융 AI 전망과 도전적 과제들
> 본 절에서 정의한 문제들을 풀어나가는 데 부딪히는 4가지 큰 과제 (데이터 확보, 규제·보안, 레거시 시스템, 윤리) 를 본다.
