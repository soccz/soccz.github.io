# 1.7 금융 AI 전망과 도전적 과제들 — *Challenges & the Road Ahead*

> **원서 위치**: 김태헌, 《금융 AI의 이해》(제이펍, 2024), §1.7 (pp.35–39)
> **원서 분량**: 약 4쪽 (4개 도전 과제 + 5가지 미래 전망)
> **해설 분량**: 약 30쪽
> **읽는 데 걸리는 시간**: 약 50분

---

## 🪧 이 절을 한 줄로

> 금융 AI는 5가지 미래 가치를 약속하지만, **4가지 큰 장벽**이 가로막고 있다: ① 데이터 확보, ② 규제·보안, ③ 레거시 시스템, ④ 윤리.
> **이 4가지를 푸는 게 향후 5년의 핵심 과제**다.

책은 5가지 전망 + 4가지 과제를 각 1문단씩 다루고 끝난다. 이 해설집은:
1. 각 과제의 **구체적 사례와 해결 방안**
2. **윤리 이슈를 더 깊이** (Apple Card 사건, 차별, 설명가능성)
3. **한국 특수성** 반영

### 📍 미리 그릴 큰 그림

<svg viewBox="0 0 760 380" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">금융 AI의 미래 — 5가지 약속과 4가지 장벽</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- 5 Promises -->
    <text x="180" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">▲ 5가지 약속 (Promises)</text>
    <rect x="40" y="70" width="280" height="40" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="180" y="95" text-anchor="middle" fill="#1c1917">① 깊은 인사이트 도출</text>
    <rect x="40" y="115" width="280" height="40" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="180" y="140" text-anchor="middle" fill="#1c1917">② 생산성 향상·프로세스 자동화</text>
    <rect x="40" y="160" width="280" height="40" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="180" y="185" text-anchor="middle" fill="#1c1917">③ 고객 경험 혁신</text>
    <rect x="40" y="205" width="280" height="40" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="180" y="230" text-anchor="middle" fill="#1c1917">④ 안전한 금융 서비스</text>
    <rect x="40" y="250" width="280" height="40" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="180" y="275" text-anchor="middle" fill="#1c1917">⑤ 리스크 관리 정밀화</text>
    <!-- 4 Barriers -->
    <text x="580" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">▼ 4가지 장벽 (Barriers)</text>
    <rect x="440" y="70" width="280" height="60" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="580" y="92" text-anchor="middle" font-weight="700" fill="#c4724e">① 양질의 데이터 확보</text>
    <text x="580" y="115" text-anchor="middle" font-size="10" fill="#57534e">개인정보, 동종업계 협업, 마이데이터</text>
    <rect x="440" y="135" width="280" height="60" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="580" y="157" text-anchor="middle" font-weight="700" fill="#c4724e">② 규제 및 보안 이슈</text>
    <text x="580" y="180" text-anchor="middle" font-size="10" fill="#57534e">분리망, 동의 기반, FSC 가이드라인</text>
    <rect x="440" y="200" width="280" height="60" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="580" y="222" text-anchor="middle" font-weight="700" fill="#c4724e">③ 레거시 시스템 한계</text>
    <text x="580" y="245" text-anchor="middle" font-size="10" fill="#57534e">COBOL, 메인프레임, 클라우드 이행</text>
    <rect x="440" y="265" width="280" height="60" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="580" y="287" text-anchor="middle" font-weight="700" fill="#c4724e">④ 윤리적 고려</text>
    <text x="580" y="310" text-anchor="middle" font-size="10" fill="#57534e">차별, 설명가능성, 도박성 마케팅</text>
  </g>
  <text x="380" y="360" text-anchor="middle" font-size="11" font-style="italic" fill="#57534e">이 4가지 장벽을 풀지 못하면 5가지 약속도 실현되지 않는다.</text>
</svg>

---

## 🟢 [초급] — 일상 비유로 잡는 감

### 1. 5가지 약속 — 일상으로 풀면

#### 약속 ①: 깊은 인사이트
> "왜 이번 달 카드값이 많지?" → AI가 "지난 달 대비 외식 35% 증가, 평균 1회 이용 금액 +5000원" 답

#### 약속 ②: 생산성 향상
> "대출 심사" → 옛날: 3일, 지금: 5분

#### 약속 ③: 고객 경험 혁신
> "신한 앱 열면 → 내 거래 패턴에 맞는 카드 추천 → 한 번 클릭으로 가입"

#### 약속 ④: 더 안전한 서비스
> "보이스피싱 통화 중 → AI가 감지 → 송금 차단 → 피해 0원"

#### 약속 ⑤: 리스크 관리 정밀화
> "내 신용점수가 750점이면 → 부도 확률 1.5% → 금리 5.2% 책정"

### 2. 4가지 장벽 — 친숙한 비유

#### 장벽 ①: "데이터를 못 합치게 함"
KB의 데이터 + 신한의 데이터를 합쳐서 AI 학습하면 더 좋겠지만 → **법적으로 안 됨**.
→ 마이데이터(2022)가 일부 풀었지만, 여전히 동의 기반.

#### 장벽 ②: "금융 데이터는 다른 망에 있어"
보안 때문에 인터넷 안 됨. 외부 API 호출도 제한.
→ AI 모델 클라우드 학습이 어려움.

#### 장벽 ③: "옛날 시스템에 새 AI 못 박음"
1990년대 만든 메인프레임 + COBOL 코드 수백만 줄.
→ 새 AI 모델을 끼우려면 **거대한 미들웨어** 필요.

#### 장벽 ④: "AI가 차별하면 어쩌나"
Apple Card 사건처럼 AI가 학습 데이터의 편향을 그대로 재현.
→ 신뢰 잃으면 한 번에 무너짐.

> ✅ **여기까지 따라왔으면**: 금융 AI가 "장밋빛 미래"가 아니라 "구체적 과제 4개"라는 게 보일 거다.

---

## 🟡 [중급] — 각 장벽 깊이 보기

### 1. 장벽 ①: 양질의 데이터 확보 (§1.7.1)

#### 1.1 왜 어려운가?

금융 데이터의 4가지 제약:

| 제약 | 내용 | 영향 |
|------|------|------|
| **개인정보** | 동의 없이 활용 불가 | 데이터 모음 자체 어려움 |
| **금융실명법** | 거래 정보 보호 | 외부와 공유 불가 |
| **신용정보법** | CB 데이터 활용 제한 | 신용평가 데이터 부족 |
| **GDPR (EU)** | EU 고객 다룰 때 | 글로벌 진출 시 추가 부담 |

#### 1.2 데이터 부족이 만드는 문제

```
[일반 ML 프로젝트]
데이터 100만 행 → 모델 학습 → 좋은 성능

[금융 AI 프로젝트]
- 사기 데이터: 0.1% (1만 행 중 10건)
- 부도 데이터: 1% (100건)
- 청년 신용 데이터: 거의 없음
→ 학습 데이터 부족 → 모델 성능 낮음
```

#### 1.3 한국의 해결 방안 3가지

##### 해법 ①: 마이데이터 (2022~)
- 개인이 자기 데이터 통제권
- 동의 시 → 다른 회사에 데이터 전송
- API 표준화 → 핀테크 폭발

##### 해법 ②: 데이터 결합 전문기관 (2020~)
- 신용정보원 통해 데이터 결합
- 가명처리 후 합쳐서 분석
- 한국전자정부원도 일부 담당

##### 해법 ③: 합성 데이터 (Synthetic Data)
- CTGAN 등으로 가짜 데이터 생성
- 실제 데이터 통계 보존
- 금융보안원이 가이드라인 (2023)

#### 1.4 글로벌 비교

<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">금융 데이터 공유 모델 — 4개국 비교</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <rect x="20" y="60" width="170" height="180" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="105" y="85" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">🇰🇷 한국</text>
    <text x="105" y="108" text-anchor="middle" font-size="10" fill="#1c1917">마이데이터 (동의)</text>
    <text x="105" y="125" text-anchor="middle" font-size="10" fill="#1c1917">데이터 결합기관</text>
    <text x="105" y="142" text-anchor="middle" font-size="10" fill="#1c1917">신용정보법</text>
    <text x="105" y="170" text-anchor="middle" font-size="11" fill="#c4724e" font-weight="700">접근성: 중상</text>
    <text x="105" y="195" text-anchor="middle" font-size="10" fill="#57534e">엄격하지만</text>
    <text x="105" y="210" text-anchor="middle" font-size="10" fill="#57534e">제도 정착됨</text>
    <rect x="200" y="60" width="170" height="180" rx="8" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="285" y="85" text-anchor="middle" font-size="13" font-weight="700" fill="#5a7a96">🇪🇺 EU</text>
    <text x="285" y="108" text-anchor="middle" font-size="10" fill="#1c1917">PSD2 + GDPR</text>
    <text x="285" y="125" text-anchor="middle" font-size="10" fill="#1c1917">Open Banking 의무</text>
    <text x="285" y="142" text-anchor="middle" font-size="10" fill="#1c1917">사용자 권리 강함</text>
    <text x="285" y="170" text-anchor="middle" font-size="11" fill="#5a7a96" font-weight="700">접근성: 중</text>
    <text x="285" y="195" text-anchor="middle" font-size="10" fill="#57534e">규제 가장 강함</text>
    <text x="285" y="210" text-anchor="middle" font-size="10" fill="#57534e">벌금 막강</text>
    <rect x="380" y="60" width="170" height="180" rx="8" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="465" y="85" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">🇺🇸 미국</text>
    <text x="465" y="108" text-anchor="middle" font-size="10" fill="#1c1917">FCRA (신용)</text>
    <text x="465" y="125" text-anchor="middle" font-size="10" fill="#1c1917">CFPB 가이드라인</text>
    <text x="465" y="142" text-anchor="middle" font-size="10" fill="#1c1917">자율 + 주별 차이</text>
    <text x="465" y="170" text-anchor="middle" font-size="11" fill="#3a7d44" font-weight="700">접근성: 상</text>
    <text x="465" y="195" text-anchor="middle" font-size="10" fill="#57534e">상대적 자유</text>
    <text x="465" y="210" text-anchor="middle" font-size="10" fill="#57534e">CB 데이터 풍부</text>
    <rect x="560" y="60" width="160" height="180" rx="8" fill="#f5e6f0" stroke="#7a6a9a"/>
    <text x="640" y="85" text-anchor="middle" font-size="13" font-weight="700" fill="#7a6a9a">🇨🇳 중국</text>
    <text x="640" y="108" text-anchor="middle" font-size="10" fill="#1c1917">사회신용 시스템</text>
    <text x="640" y="125" text-anchor="middle" font-size="10" fill="#1c1917">정부 주도 통합</text>
    <text x="640" y="142" text-anchor="middle" font-size="10" fill="#1c1917">2021 빅테크 규제</text>
    <text x="640" y="170" text-anchor="middle" font-size="11" fill="#7a6a9a" font-weight="700">접근성: 매우 상</text>
    <text x="640" y="195" text-anchor="middle" font-size="10" fill="#57534e">기업엔 자유</text>
    <text x="640" y="210" text-anchor="middle" font-size="10" fill="#57534e">개인엔 제약</text>
  </g>
</svg>

### 2. 장벽 ②: 규제 및 보안 이슈 (§1.7.2)

#### 2.1 분리망 (Network Segmentation)

한국 금융권 IT 인프라:

```
┌──────────────────┐  ┌──────────────────┐
│   인터넷망          │  │   업무망          │
│   (대외용)         │  │   (내부 업무)     │
└─────────┬────────┘  └─────────┬────────┘
          │                     │
          ├──[DMZ + 방화벽]─────┤
          │                     │
┌─────────┴────────┐  ┌─────────┴────────┐
│  계정계 (예금/대출)│  │  데이터망 (분석)   │
│  (가장 안전)      │  │  (사용자 분리)    │
└──────────────────┘  └──────────────────┘
```

**문제**: AI 모델 학습은 데이터망에서, 운영은 계정계에서. 둘 사이 동기화가 어려움.

#### 2.2 금융 클라우드 정책

| 시기 | 한국 정책 |
|------|---------|
| ~2019 | 클라우드 사용 사실상 금지 |
| 2019 | 금융 클라우드 가이드라인 (완화) |
| 2021 | 비중요 시스템 클라우드 가능 |
| 2024 | 중요 시스템 일부 클라우드 가능 |

**문제**: 글로벌(AWS, Azure)에 데이터 못 올림 → 한국 클라우드 (네이버, KT)만 사용.

#### 2.3 규제 종류

```
[해야 할 것 (의무)]
- KYC: 신원 확인
- AML: 자금세탁 방지 보고
- 거래 보고: 1만달러 이상
- 모델 검증: SR 11-7 식
- XAI: 설명가능성

[하면 안 되는 것 (금지)]
- 동의 없는 데이터 활용
- 차별적 의사결정
- 정보 유출
- 시장 조작
- 미고지 AI 사용
```

### 3. 장벽 ③: 레거시 시스템 한계 (§1.7.3)

#### 3.1 한국 금융권 IT 부채 현황 (2024)

| 항목 | 상태 |
|------|------|
| 메인프레임 점유율 | 시중은행 코어뱅킹의 상당 부분 (50~60%대 추정, 공식 공시 부재) |
| COBOL 코드 | 수백만 줄 (1980~) |
| 데이터베이스 | 대부분 IBM DB2, Oracle |
| 채널 통합 (인터넷+모바일+지점) | 미완성 |
| 클라우드 이행률 | 약 30% (비중요 시스템) |

#### 3.2 레거시가 AI에 미치는 영향

```
[이상적 AI 시스템]
실시간 데이터 스트림 → ML 모델 → 즉시 적용
        ↑                              ↓
      Kafka                       Microservice

[한국 금융 현실]
일일 배치 → ETL → 데이터 웨어하우스 → ML → 다시 배치
   ↑                                       ↓
COBOL                                   COBOL
(메인프레임)                          (메인프레임)
```

→ **AI의 실시간성을 못 살림**.

#### 3.3 DBS Bank의 모범 사례 — 책 본문 인용

DBS는 2014년부터 디지털 전환 시작:
- **클라우드 First**: AWS 75% 운영
- **MicroservicES**: 모놀리스 → 1000+ 마이크로서비스
- **DevOps**: 일일 배포 평균 200건
- **AI/ML 플랫폼**: ADA (사내 ML 플랫폼)
- **결과**: 매년 *Best Digital Bank in Asia* 수상

**비교**: 한국 시중은행은 DBS의 5년 뒤 (= 2019년) 수준.

#### 3.4 해결 방안

| 방안 | 설명 | 한국 적용 |
|------|------|---------|
| Strangler Fig | 점진적 교체 (옛 시스템 옆에 새 시스템 → 트래픽 이동) | 카카오뱅크 (처음부터 새로) |
| API Wrapper | 옛 시스템을 API로 감싸기 | 시중은행 일부 |
| 데이터 이중화 | 옛 DB + 새 DB 동시 유지 | 신한 (2021~) |
| Microservices 분해 | 모놀리스 분해 | KB (2020~) |

### 4. 장벽 ④: 윤리적 고려 (§1.7.4)

#### 4.1 윤리 이슈의 3가지 차원

##### 차원 ①: 차별 (Discrimination)
AI가 학습 데이터의 편향을 그대로 재현.

**유명 사례**:
- **Apple Card (2019)**: 부부 동일 조건인데 한도 20배 차이
- **COMPAS (미국 사법)**: 흑인 재범 확률 과대 평가
- **Amazon 채용 AI (2018)**: 여성 지원자 점수 깎음 (폐기)

##### 차원 ②: 설명가능성 (Explainability)
AI가 왜 그런 결정을 내렸는지 설명할 수 있어야.

**규제 요구**:
- 한국 금융위 AI 가이드라인 (2021.7.8): 4대 핵심 가치(① 책임성-위험관리, ② 데이터 정확성·안전성, ③ 투명성·공정성, ④ 소비자 권리 보호)와 별도로 운영 5단계 체크리스트에 설명가능성·투명성 점검 포함
- EU AI Act (2024): High-Risk AI는 설명 의무
- 미국 FCRA: 신용 거절 시 사유 통지 의무

##### 차원 ③: 도박성 마케팅
AI가 고객의 약점을 파고드는 마케팅.

**사례**:
- 도박 중독자에게 카지노 광고 추천
- 과소비 패턴 사람에게 한도 증액 권유
- 노인에게 복잡한 파생상품 판매

→ 책 본문이 명시: **"AI 기술의 활용 범위와 한계를 정확히 인지하고, 이를 기반으로 한 마케팅 전략은 항상 윤리적인 가치와 함께 고려되어야 한다."**

#### 4.2 한국의 윤리 대응

**금융위 AI 가이드라인 (2021.7.8)** — 4대 핵심 가치 + 운영 5단계 체크리스트:

핵심 가치 4가지 (FSC 보도자료 공식 표현):
1. **책임성** (위험관리): AI 사용 책임은 금융사
2. **AI 학습데이터의 정확성·안전성**: 데이터 품질·보안
3. **투명성·공정성**: 차별 금지, 사용 사실 공개
4. **소비자 권리 보호**: 사전고지 + 권리구제

운영 5단계 체크리스트(설명가능성·모델 검증·데이터 관리·모니터링·재학습 등)는 4대 핵심 가치를 구체화하는 도구로 별도 권고.

> ⚠ 정정 (2차): 초기 "5대 원칙(책임성·공정성·투명성·설명가능성·보안성)" 및 1차 정정의 "책임성·정확성·공정성·소비자권리 보장" 모두 FSC 공식 명칭과 다름. 위 4대 가치가 FSC 보도자료(2021.7.8) 정확한 표현.

#### 4.3 차별 방지 기술 — Fairness in ML

```
[학습 데이터의 편향]
   ↓
[Pre-processing] 데이터 재샘플링, 가중치 조정
   ↓
[In-processing] Fairness constraint 추가
   ↓
[Post-processing] 결과 보정 (예: 그룹별 threshold 조정)
```

**주요 라이브러리**:
- IBM AI Fairness 360 (AIF360)
- Microsoft Fairlearn
- Google What-If Tool

> ✅ **여기까지 따라왔으면**: 금융 AI의 4가지 장벽이 단순 기술 문제가 아니라 법·제도·문화 문제임이 보일 것이다.

---

## 🔴 [고급] — 영문 용어와 책의 한계

### 1. 데이터 거버넌스 영문 용어

- **Data Governance**: 데이터 지배구조
- **Data Quality**: 데이터 품질
- **Data Lineage**: 데이터 계보 (어디서 왔는지)
- **Data Catalog**: 데이터 카탈로그
- **Master Data Management (MDM)**: 마스터 데이터 관리
- **Privacy-Enhancing Technologies (PETs)**:
  - **Differential Privacy**: 차등 정보보호
  - **Federated Learning**: 연합 학습
  - **Homomorphic Encryption**: 동형 암호
  - **Secure Multi-Party Computation (SMPC)**: 안전 다자 계산

### 2. 책 §1.7의 한계 7가지

#### 한계 ①: PETs 미언급
**Federated Learning, Differential Privacy** 같은 기술이 데이터 공유 없이 AI 학습 가능하게 함. 책에 없음.

#### 한계 ②: 모델 리스크 관리 (MRM) 미언급
SR 11-7 (미 연준), Basel BCBS 239 등 글로벌 표준. 한국도 적용. 책에 없음.

#### 한계 ③: 사이버 보안 AI 미언급
**금융 AI의 5번째 장벽**: 사이버 공격. 책에 없음.

#### 한계 ④: 환경 (기후) 미언급
ESG → 기후 리스크 → 신용평가에 영향. 책에 없음.

#### 한계 ⑤: 양자 컴퓨팅 위협 미언급
양자 컴퓨터가 현 암호 깨면 → 금융 시스템 붕괴 위험. 책에 없음.

#### 한계 ⑥: 빅테크 vs. 금융권 경쟁 미언급
네이버/카카오의 금융 진출 → 시중은행 위기. 책에 없음.

#### 한계 ⑦: 일자리 대체 미언급
McKinsey: 금융 일자리의 30%가 AI로 자동화. 사회적 영향 미고려.

### 3. 글로벌 금융 AI 규제 동향

| 국가 | 주요 규제 | 시기 |
|------|---------|------|
| EU | AI Act (High-Risk = 신용평가) | 2024.8 |
| 미국 | NIST AI RMF + CFPB 가이드라인 | 2023 |
| 영국 | FCA AI Discussion Paper | 2023 |
| 한국 | 금융위 AI 가이드라인 | 2021 |
| 싱가포르 | MAS Veritas Initiative | 2019 |
| 중국 | 알고리즘 규제 (인터넷정보판공실) | 2022 |
| 일본 | METI AI 거버넌스 가이드 | 2022 |

### 4. PETs 기술 4가지

#### 4.1 Federated Learning (연합 학습)
- 데이터를 한 곳에 모으지 않고 **모델을 분산 학습**
- 각 기관이 로컬 학습 → 모델 파라미터만 교환
- 예: Google Gboard (다음 단어 예측)
- 금융 활용: 여러 은행이 사기 탐지 모델 협업

#### 4.2 Differential Privacy (차등 정보보호)
- 데이터에 **노이즈 추가** → 개인 식별 불가
- ε (epsilon) 파라미터로 노이즈 양 조절
- Apple, Microsoft 사용
- 금융 활용: 통계 공개 (예: "30대 평균 대출액") 시 보호

#### 4.3 Homomorphic Encryption (동형 암호)
- **암호화된 상태로 계산** 가능
- 데이터 복호화 없이 ML 가능
- 매우 느림 (실용성 한계)

#### 4.4 Secure Multi-Party Computation (SMPC)
- 여러 기관이 **자기 데이터 노출 없이** 공동 계산
- 예: 여러 은행이 "전체 대출 평균"만 계산 (개별 데이터 안 나옴)
- 한국 금융보안원 시범 사업

---

## 🟣 [전공자] — 1차 자료

### 1. SR 11-7 — 모델 리스크 관리 표준

> 📄 Federal Reserve & OCC. (2011). *Supervisory Guidance on Model Risk Management* (SR 11-7).

핵심 요구사항:
1. **Conceptual Soundness**: 모델 설계의 이론적 타당성
2. **Implementation Verification**: 구현 검증
3. **Ongoing Monitoring**: 지속적 모니터링
4. **Independent Validation**: 독립 검증 부서

→ 한국 모범규준 (2018) 도 이를 기반.

### 2. EU AI Act

> 📄 European Parliament. (2024). *EU Artificial Intelligence Act* (Regulation 2024/1689).

**금융 AI 분류**:
- **Prohibited (금지)**: 사회적 점수화 (China-style)
- **High-Risk (고위험)**: 신용평가, 보험 가입, 채용 → **사전 적합성 평가** + **CE 마킹**
- **Limited Risk (제한)**: 챗봇 → AI 사용 고지 의무
- **Minimal Risk (최소)**: 스팸 필터 → 자유

**위반 시 벌금**: 매출의 7% 또는 €3500만 중 더 큰 것.

### 3. Fairness in Machine Learning 학술 자료

#### 3.1 Equalized Odds (Hardt et al. 2016)
> "*A classifier satisfies equalized odds if its prediction is conditionally independent of the protected attribute given the true outcome.*"

$$ P(\hat{Y}=1 | A=0, Y=y) = P(\hat{Y}=1 | A=1, Y=y), \quad y \in \{0, 1\} $$

#### 3.2 Demographic Parity
$$ P(\hat{Y}=1 | A=0) = P(\hat{Y}=1 | A=1) $$

#### 3.3 Calibration
$$ P(Y=1 | \hat{Y}=v, A=0) = P(Y=1 | \hat{Y}=v, A=1) $$

> 📄 Hardt, M., Price, E., & Srebro, N. (2016). Equality of opportunity in supervised learning. *NeurIPS*.

#### 3.4 Trade-off 불가능 (Chouldechova 2017)
**모든 Fairness 정의를 동시 만족할 수 없다** — 수학적으로 증명.

> 📄 Chouldechova, A. (2017). Fair prediction with disparate impact. *Big Data*, 5(2), 153–163.

### 🟣 [전공자 심화] — Fair ML Impossibility 정리의 한계와 후속 연구

#### 원논문 (Chouldechova 2017, Hardt-Price-Srebro 2016, Kleinberg-Mullainathan-Raghavan 2017) 의 한계

- **Base rate 차이 가정**: Chouldechova의 불가능성은 두 집단의 base rate $P(Y=1|A=0) \neq P(Y=1|A=1)$ 일 때 성립. 그러나 이 base rate 자체가 역사적 차별로 왜곡되었을 가능성은 다루지 않음(measurement bias).
- **정적 관점**: 단일 시점 분포에 대한 정의 → 의사결정이 미래 분포(연체율, 신용형성 기회)에 미치는 동적 효과 미반영.
- **이진 보호속성·이진 결과**: 다중·교차 보호속성(여성+이민자+청년)은 별도 확장이 필요.
- **인과 구조 무시**: Demographic parity / equalized odds는 모두 관찰 분포에 대한 통계적 정의. 차별이 *직접 효과*인지 *간접 효과*(legitimate proxy 경유)인지 구분하지 못함.
- **Equalized odds는 calibration과 양립 불가**: Kleinberg et al. (2017)이 증명한 trade-off는 두 기준 중 하나를 포기해야 함을 의미하지만, 실무에서는 어느 것을 선택할지의 *가치 판단*은 학술적으로 결정 불가.

#### 비판 문헌

- **Kleinberg, J., Mullainathan, S., & Raghavan, M. (2017). Inherent trade-offs in the fair determination of risk scores. *ITCS 2017*.** arXiv:1609.05807 — Calibration, balance for positive class, balance for negative class 세 가지를 동시 만족하는 분류기는 base rate가 같거나 완벽한 분류기뿐임을 증명.
- **Corbett-Davies, S., & Goel, S. (2018). The measure and mismeasure of fairness: A critical review of fair machine learning.** arXiv:1808.00023 — anti-classification, classification parity, calibration 세 정의 모두 실제 차별 완화에 실패할 수 있음을 사례로 보임.
- **Liu, L. T., Dean, S., Rolf, E., Simchowitz, M., & Hardt, M. (2018). Delayed impact of fair machine learning. *ICML 2018*.** arXiv:1803.04383 — fairness 제약 도입이 장기적으로 보호집단의 신용 분포를 *악화*시킬 수 있는 동적 효과를 모델링.
- **Wachter, S., Mittelstadt, B., & Russell, C. (2021). Why fairness cannot be automated: Bridging the gap between EU non-discrimination law and AI. *Computer Law & Security Review*, 41.** — EU 법체계의 contextual equality 개념은 수식화된 fairness 정의 어떤 것과도 정확히 매칭되지 않음.

#### 후속 연구 동향 (2020~)

- **Causal Fairness**: Plecko, D., & Bareinboim, E. (2024). *Causal fairness analysis: A causal toolkit for fair machine learning.* Foundations and Trends in Machine Learning, 17(3). arXiv:2207.11385 — 직접효과/간접효과/spurious effect를 분해.
- **Multi-calibration**: Hébert-Johnson, U., Kim, M., Reingold, O., & Rothblum, G. (2018/2024). *Multicalibration: Calibration for the (computationally-identifiable) masses.* ICML 2018. — 교차 부분집단에 대한 calibration 보장.
- **Long-term fairness / sequential decision-making**: D'Amour, A., Srinivasan, H., Atwood, J., Baljekar, P., Sculley, D., & Halpern, Y. (2020). *Fairness is not static: deeper understanding of long term fairness via simulation studies.* FAccT 2020.
- **금융 특화 review**: Das, S., Donini, M., Gelman, J., et al. (2021). *Fairness measures for machine learning in finance.* AWS, *Journal of Financial Data Science*, 3(4). arXiv:2110.13755

#### 한국 적용 시 주의점

- **금융위 「금융분야 AI 가이드라인」(2021)** 은 "차별 금지 원칙"을 선언하지만 어떤 fairness 정의를 적용할지 규정하지 않음 → 실무에서는 자체 기준 선택이 필수.
- 한국 금융 데이터에서 "성별" 입력 자체가 신용평가에 활용되지 않더라도, 직업·소득·지역 등 proxy를 통해 간접 차별이 발생할 수 있음 (Apple Card 사례와 동일). → causal fairness 분석 권장.
- Demographic parity를 강제하면 base rate 차이가 큰 그룹(예: 자영업자 vs 직장인)에서 오히려 부실률 증가로 보호집단 신용 형성에 악영향 가능 (Liu et al. 2018). 한국 신용평가 모델 재검증 시 long-term simulation도 함께 수행해야 함.
- 미신용·thin-file 청년 대상 대안신용평가는 데이터 양 자체가 적어 Rademacher complexity 측면의 일반화 위험과 fairness 위험이 동시에 큼.

### 4. Federated Learning

> 📄 McMahan, B., Moore, E., Ramage, D., et al. (2017). Communication-efficient learning of deep networks from decentralized data. *AISTATS*.

핵심 알고리즘: **FedAvg**
$$ w_{t+1} = \sum_{k=1}^{K} \frac{n_k}{n} w_{t+1}^k $$

각 클라이언트의 모델 파라미터를 데이터 양 가중 평균.

### 5. Differential Privacy

> 📄 Dwork, C. (2006). Differential privacy. *ICALP*.

**ε-DP 정의**:
$$ \frac{P(M(D) \in S)}{P(M(D') \in S)} \leq e^{\varepsilon} $$

이웃 데이터셋 $D, D'$의 출력 분포 차이가 $e^\varepsilon$ 이하.

### 6. XAI - SHAP의 학술 기반

> 📄 Lundberg, S. M., & Lee, S. I. (2017). A unified approach to interpreting model predictions. *NeurIPS*.

Shapley value (게임 이론):
$$ \phi_i = \sum_{S \subseteq F \setminus \{i\}} \frac{|S|!(|F|-|S|-1)!}{|F|!} [f(S \cup \{i\}) - f(S)] $$

각 피처의 기여도를 공정하게 분배.

---

## 📚 책에는 없지만 알면 좋은 것

### 🔍 보충 1 — Apple Card 차별 사건 심층 분석 (2019)

#### 사건 전말
- David Heinemeier Hansson (Ruby on Rails 창시자)이 트위터에 폭로
- 부부 모두 동일 신용점수, 동일 자산
- 남편 한도: $10,000+
- 아내 한도: $500
- → 20배 차이

#### 조사 결과 (NY DFS, 2021)
- Goldman Sachs는 "**성별을 모델 입력으로 안 썼다**" 주장
- 그러나 학습 데이터에 역사적 편향 존재
- → 모델이 간접적으로 성별 추론 가능

#### 교훈
- **"성별을 모델에 안 넣음" ≠ 성별 중립**
- Proxy variable (직장, 직업) 통해 간접 편향
- → Causal Fairness 분석 필요

> 📄 NYDFS. (2021). *Report on Apple Card Investigation*.

### 🔍 보충 2 — COMPAS 사법 AI 차별 사건

#### 사건
- 미국 형사 사법 시스템의 재범 예측 AI
- ProPublica 조사 (2016): 흑인을 백인보다 **2배 높은 재범 예측**
- 실제 재범률은 비슷한데, 모델이 흑인을 과대 예측

#### 의의
- AI 윤리의 대표 사례
- "예측 정확도 vs. 그룹 공정성" 양립 불가 증명
- → 사법, 금융, 의료 모든 분야 영향

> 📄 Angwin, J., Larson, J., Mattu, S., & Kirchner, L. (2016). Machine bias. *ProPublica*.

### 🔍 보충 3 — DBS Bank의 디지털 전환 5단계

#### 2014-2024 여정
1. **2014**: Digital First 선언
2. **2015-2016**: 인도네시아 Digibank 출시 (지점 0개)
3. **2017-2018**: AWS 75% 이행
4. **2019-2020**: AI 플랫폼 ADA 구축
5. **2021-2024**: Generative AI 도입, 일일 100만 거래

#### 한국 시중은행과 비교
| 항목 | DBS | 한국 시중은행 평균 |
|------|-----|------------------|
| 클라우드 비중 | 75% | 15% |
| 일일 배포 | 200건 | 1~10건 |
| 모바일 거래 | 90% | 78% |
| AI 모델 수 | 500+ | 50~100 |

### 🔍 보충 4 — 한국 금융권 디지털 전환 사례

#### 신한금융그룹 — "쏠"
- 슈퍼앱 전략 (신한 + 신한카드 + 신한투자증권)
- LLM 챗봇 도입 (2024)
- AI 신용평가 (2023)

#### KB금융그룹 — "KB Star Banking + Liiv"
- KB Mobile Cert (인증 통합)
- AI 콜센터 (2023)
- 데이터청년 부트캠프

#### 카카오뱅크 — 처음부터 클라우드
- AWS 100% (한국 최초)
- 일일 배포 300+ 건
- 사용자 2200만 명

### 🔍 보충 5 — AI 윤리 vs. 비즈니스 — 어떻게 화해하나?

**4가지 접근**:
1. **선언적**: 윤리 헌장 발표 (페이스북, 구글)
2. **거버넌스**: AI 윤리 위원회 (미 IBM, MS)
3. **기술적**: Fairness 도구 도입 (AIF360)
4. **규제적**: 법적 의무화 (EU AI Act)

한국 금융: **거버넌스 + 기술적** 단계.

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. 마이데이터가 정말 한국 금융 AI에 큰 영향을 줬나?

**A.** **결정적**. 영향:
- 토스/카뱅 사용자 데이터 통합 → AI 학습 데이터 폭증
- 다른 은행 계좌 한꺼번에 보기 → UX 혁신
- 신용평가 대안 데이터 활용 → 청년/소상공인 대출

### Q2. 분리망이 정말 그렇게 큰 장벽인가?

**A.** **AI 학습에 큰 제약**. 이유:
- 클라우드 학습 못 함 (인터넷 차단)
- 사전학습 LLM 모델 다운로드 어려움
- 오픈소스 라이브러리 업데이트 지연

**해결 방향**: 망분리 완화 (2024 정부 검토 중) + 사내 클라우드 구축.

### Q3. COBOL이 정말 지금도 쓰이나?

**A.** **압도적으로 많이 쓰임**.
- 한국 시중은행 코어 시스템의 60%
- 미국 은행도 마찬가지 (Bank of America 등)
- COBOL 프로그래머 평균 연령 60+ → **인력 부족 위기**

**대안**: Java/Kotlin/Python으로 점진적 교체 중.

### Q4. Apple Card 사건이 한국에서도 가능한가?

**A.** **이미 발생했을 가능성 있음**. 한국에서:
- 청년/여성/이민자 신용평가 차별 의심 사례 있음
- 금융위 가이드라인 (2021) 이후 점검 중
- 그러나 외부 폭로 없음 → 모르고 넘어가는 경우 다수

### Q5. 한국 금융 AI가 글로벌 대비 어디쯤?

**A.** **분야별로 다름**:
- 디지털화 인프라: **세계 최고** (OECD 1위)
- 신용평가 AI: 미국과 비슷
- 사기 탐지: 알리페이/페이팔보다 약간 뒤
- LLM 챗봇: **글로벌 대비 1-2년 뒤** (영어 모델 의존)

### Q6. 윤리적 AI를 만들면 성능이 떨어지나?

**A.** **약간 떨어짐 (1-3%)**.
- Fairness 제약 추가 → 모델 자유도 ↓
- 그러나 **장기적으로는 성능 = 신뢰**
- 규제 위반 시 벌금 + 신뢰 손실 > 성능 저하

### Q7. Federated Learning이 한국 금융에 들어왔나?

**A.** **초기 단계**. 사례:
- 금융보안원 시범 사업 (2022~)
- KB-신한 사기탐지 공동 학습 (계획)
- 아직 본격 운영 사례 없음

---

## 🎯 이 절에서 가져갈 핵심 6가지

1. **금융 AI의 5가지 약속**: 인사이트·자동화·고객경험·안전·리스크 관리.
2. **4가지 장벽**: 데이터 확보·규제 보안·레거시·윤리.
3. **마이데이터(2022)**가 한국 데이터 부족 문제의 부분 해법.
4. **DBS Bank**가 디지털 전환의 모범 사례 (한국 5년 앞섬).
5. **윤리 이슈 3차원**: 차별·설명가능성·도박성 마케팅.
6. **PETs (연합학습, 차등프라이버시 등)** 이 향후 데이터 공유 문제 해결책.

---

## 📖 더 읽을거리

### 데이터 거버넌스
- 한국정보화진흥원. (2024). *데이터 거버넌스 가이드라인*.
- DAMA International. *Data Management Body of Knowledge (DMBOK)*.

### 규제·정책
- 금융위원회. (2021). *금융분야 AI 가이드라인*.
- European Parliament. (2024). *EU AI Act* (Regulation 2024/1689).
- Federal Reserve. (2011). *SR 11-7: Supervisory Guidance on Model Risk Management*.

### AI 윤리
- O'Neil, C. (2016). *Weapons of Math Destruction*. Crown.
- Eubanks, V. (2018). *Automating Inequality*. St. Martin's Press.
- Floridi, L. (2022). *Ethics, Governance, and Policies in Artificial Intelligence*. Springer.

### Fairness in ML
- Barocas, S., Hardt, M., & Narayanan, A. (2023). *Fairness and Machine Learning*. fairmlbook.org. **무료 PDF**.
- Hardt, M., Price, E., & Srebro, N. (2016). Equality of opportunity in supervised learning. *NeurIPS*.

### PETs (Privacy-Enhancing Technologies)
- McMahan, B., et al. (2017). Communication-efficient learning of deep networks from decentralized data. *AISTATS*.
- Dwork, C., & Roth, A. (2014). The algorithmic foundations of differential privacy. *Foundations and Trends in TCS*.

### 디지털 전환
- Sironi, P. (2020). *Banks and Fintech on Platform Economies*. Wiley.
- DBS Bank Annual Reports (2014~).

### 한국 금융 디지털 전환
- 한국은행. (매년). *국내 은행의 디지털 전환 현황*.
- 금융위원회. (2024). *디지털 금융 혁신 가이드*.

### XAI
- Lundberg, S. M., & Lee, S. I. (2017). A unified approach to interpreting model predictions. *NeurIPS*.
- Ribeiro, M. T., Singh, S., & Guestrin, C. (2016). "Why Should I Trust You?" *KDD*.

---

> **다음 절 예고** — §1.8 마무리
> 1장 전체를 한 페이지로 요약하고, Ch2~Ch6 본격 학습을 위한 마음가짐과 학습 전략을 다룬다.
