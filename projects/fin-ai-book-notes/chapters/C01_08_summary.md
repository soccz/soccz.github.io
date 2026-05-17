# 1.8 마무리 — *Chapter 1 Wrap-up & Bridge to Chapter 2*

> **해설 분량**: 약 15쪽 (1장 전체 요약 + 학습 전략 + Ch2 준비)
> **읽는 데 걸리는 시간**: 약 25분

---

## 🪧 이 절을 한 줄로

> 1장은 **금융 AI를 공부하기 전에 알아야 할 모든 것**을 다뤘다.
> 2장부터는 **각 영역의 구체적 AI 모델과 코드** 로 들어간다.

책은 §1.8을 1쪽의 짧은 마무리로 끝낸다. 이 해설집은:
1. **1장 전체를 한 페이지 요약** (인포그래픽)
2. **Ch2~Ch6 학습 로드맵**
3. **각 챕터 진입 전 사전 학습 권장사항**
4. **금융 AI 학습자의 마음가짐**

---

## 🟢 [초급] — 1장에서 배운 것 한 번에 정리

### 1장 한 페이지 요약

<svg viewBox="0 0 760 600" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="25" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="16" font-weight="700" fill="#1c1917">1장 「금융과 핀테크에서의 AI」 한 페이지 요약</text>
  <!-- §1.1 -->
  <g>
    <rect x="20" y="50" width="220" height="140" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="130" y="73" text-anchor="middle" font-family="Noto Sans KR,sans-serif" font-size="13" font-weight="700" fill="#c4724e">§1.1 금융이란?</text>
    <text x="130" y="95" text-anchor="middle" font-size="11" fill="#1c1917">시간 가로지르는 돈의 이동</text>
    <text x="130" y="113" text-anchor="middle" font-size="11" fill="#1c1917">PV = FV / (1+r)ⁿ</text>
    <text x="130" y="135" text-anchor="middle" font-size="10" fill="#57534e">금융 = 데이터 산업</text>
    <text x="130" y="152" text-anchor="middle" font-size="10" fill="#57534e">Merton-Bodie 6기능</text>
    <text x="130" y="174" text-anchor="middle" font-size="9" font-style="italic" fill="#a8a29e">정보 비대칭 → AI 동기</text>
  </g>
  <!-- §1.2 -->
  <g>
    <rect x="270" y="50" width="220" height="140" rx="8" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="380" y="73" text-anchor="middle" font-size="13" font-weight="700" fill="#5a7a96">§1.2 금융기관 7종</text>
    <text x="380" y="95" text-anchor="middle" font-size="11" fill="#1c1917">은행·비은행예금·보험</text>
    <text x="380" y="113" text-anchor="middle" font-size="11" fill="#1c1917">증권·기타·공적·핀테크</text>
    <text x="380" y="135" text-anchor="middle" font-size="10" fill="#57534e">3축 규제: FSC·FSS·BOK</text>
    <text x="380" y="152" text-anchor="middle" font-size="10" fill="#57534e">핀테크 = 경계 흐림</text>
    <text x="380" y="174" text-anchor="middle" font-size="9" font-style="italic" fill="#a8a29e">금산분리, 마이데이터</text>
  </g>
  <!-- §1.3 -->
  <g>
    <rect x="520" y="50" width="220" height="140" rx="8" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="630" y="73" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">§1.3 AI 용어</text>
    <text x="630" y="95" text-anchor="middle" font-size="11" fill="#1c1917">AI ⊃ ML ⊃ DL ⊃ GenAI ⊃ LLM</text>
    <text x="630" y="113" text-anchor="middle" font-size="11" fill="#1c1917">지도/비지도/강화 학습</text>
    <text x="630" y="135" text-anchor="middle" font-size="10" fill="#57534e">MLP·CNN·RNN·Transformer</text>
    <text x="630" y="152" text-anchor="middle" font-size="10" fill="#57534e">RAG·Agent·Fine-tuning</text>
    <text x="630" y="174" text-anchor="middle" font-size="9" font-style="italic" fill="#a8a29e">금융 ≠ ChatGPT만</text>
  </g>
  <!-- §1.4 -->
  <g>
    <rect x="20" y="210" width="350" height="140" rx="8" fill="#f5e6f0" stroke="#7a6a9a"/>
    <text x="195" y="233" text-anchor="middle" font-size="13" font-weight="700" fill="#7a6a9a">§1.4 금융과 AI</text>
    <text x="195" y="255" text-anchor="middle" font-size="11" fill="#1c1917">한국 금융 AI: 2024년 1.2조 → 2026년 3.2조</text>
    <text x="195" y="275" text-anchor="middle" font-size="11" fill="#1c1917">동력 4: 데이터·정형·수익화·경쟁</text>
    <text x="195" y="295" text-anchor="middle" font-size="11" fill="#1c1917">장벽 5: 인력·기술·데이터·레거시·규제</text>
    <text x="195" y="315" text-anchor="middle" font-size="10" fill="#57534e">NVIDIA 17가지 활용 사례</text>
    <text x="195" y="332" text-anchor="middle" font-size="9" font-style="italic" fill="#a8a29e">한국 글로벌 대비 2.6배 over-indexed</text>
  </g>
  <!-- §1.5 -->
  <g>
    <rect x="390" y="210" width="350" height="140" rx="8" fill="#fef9e7" stroke="#8a6d2c"/>
    <text x="565" y="233" text-anchor="middle" font-size="13" font-weight="700" fill="#8a6d2c">§1.5 금융 AI 6 Pillars</text>
    <text x="565" y="255" text-anchor="middle" font-size="11" fill="#1c1917">① 신용평가 → Ch3</text>
    <text x="565" y="272" text-anchor="middle" font-size="11" fill="#1c1917">② 사기탐지 → Ch4</text>
    <text x="565" y="289" text-anchor="middle" font-size="11" fill="#1c1917">③ 고객서비스 → Ch6 (부분)</text>
    <text x="565" y="306" text-anchor="middle" font-size="11" fill="#1c1917">④ 투자트레이딩 → Ch2</text>
    <text x="565" y="323" text-anchor="middle" font-size="11" fill="#1c1917">⑤ 준법감시 + ⑥ 자동화 → Ch5</text>
    <text x="565" y="343" text-anchor="middle" font-size="9" font-style="italic" fill="#a8a29e">알리페이·페이팔·웰스파고·JP모건</text>
  </g>
  <!-- §1.6 -->
  <g>
    <rect x="20" y="370" width="350" height="140" rx="8" fill="#fef0f0" stroke="#c4724e"/>
    <text x="195" y="393" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">§1.6 문제 정의</text>
    <text x="195" y="415" text-anchor="middle" font-size="11" fill="#1c1917">ML 문제 5유형:</text>
    <text x="195" y="432" text-anchor="middle" font-size="11" fill="#1c1917">분류·회귀·랭킹·군집·생성</text>
    <text x="195" y="452" text-anchor="middle" font-size="11" fill="#1c1917">SMART 프레임워크</text>
    <text x="195" y="472" text-anchor="middle" font-size="11" fill="#1c1917">Oliver Wyman 16개 문제</text>
    <text x="195" y="493" text-anchor="middle" font-size="9" font-style="italic" fill="#a8a29e">"잘 정의된 문제 = 절반 풀린 문제"</text>
  </g>
  <!-- §1.7 -->
  <g>
    <rect x="390" y="370" width="350" height="140" rx="8" fill="#eef4ff" stroke="#5a7a96"/>
    <text x="565" y="393" text-anchor="middle" font-size="13" font-weight="700" fill="#5a7a96">§1.7 전망과 과제</text>
    <text x="565" y="415" text-anchor="middle" font-size="11" fill="#1c1917">5가지 약속:</text>
    <text x="565" y="432" text-anchor="middle" font-size="11" fill="#1c1917">인사이트·자동화·고객경험·안전·리스크</text>
    <text x="565" y="452" text-anchor="middle" font-size="11" fill="#1c1917">4가지 장벽:</text>
    <text x="565" y="472" text-anchor="middle" font-size="11" fill="#1c1917">데이터·규제·레거시·윤리</text>
    <text x="565" y="493" text-anchor="middle" font-size="9" font-style="italic" fill="#a8a29e">DBS Bank 모범, Apple Card 차별 사건</text>
  </g>
  <!-- Bridge to Ch2 -->
  <rect x="60" y="530" width="640" height="60" rx="8" fill="#1c1917"/>
  <text x="380" y="555" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#fff">▼ 다음: 2장 「금융 투자 영역에서의 AI」</text>
  <text x="380" y="578" text-anchor="middle" font-size="11" fill="#fff">실습 3종: 전통 퀀트 · 머신러닝 퀀트 · 딥러닝 퀀트</text>
</svg>

### 1장 한 줄 요약

> **금융이 데이터 산업이고, AI가 그 데이터의 가장 강력한 도구라면, 이 책 5개 장(Ch2~Ch6)이 그 도구를 분야별로 풀어내는 매뉴얼이다.**

---

## 🟡 [중급] — Ch2~Ch6 학습 로드맵

### Ch2~Ch6 챕터 미리보기

| 챕터 | 영역 | 주요 기술 | 실습 데이터 | 난이도 |
|------|------|---------|----------|------|
| **Ch2** | 투자/트레이딩 | 전통 퀀트, XGBoost, LSTM | 한국 주식 OHLCV | ★★★ |
| **Ch3** | 신용 리스크 | LR, XGBoost, OptBinning | American Express (Kaggle) | ★★★★ |
| **Ch4** | 사기 탐지 | Random Forest, GNN, NetworkX | 신용카드 사기 (Kaggle) | ★★★★ |
| **Ch5** | MLOps | 파이프라인, 배포, 모니터링 | 다양함 | ★★★ |
| **Ch6** | 생성형 AI | LLM, RAG, Fine-tuning | 금융 텍스트 | ★★★ |

### 학습 순서 추천

#### 추천 ①: 책 순서 (Ch2→Ch6)
- **장점**: 저자 의도대로
- **단점**: Ch2 (투자)가 가장 어려움 → 좌절 위험

#### 추천 ②: 난이도 순서 (Ch5→Ch2→Ch6→Ch3→Ch4)
- **장점**: MLOps 인프라부터 → 다른 챕터 실습 환경 구축
- **단점**: 도메인 지식 순서가 맞지 않음

#### 추천 ③: 본인 관심 분야부터
- 투자: Ch2
- 핀테크: Ch4
- 카드사: Ch3
- 챗봇: Ch6
- 데이터 엔지니어: Ch5

### 사전 학습 권장 (Pre-requisites)

#### 모든 챕터 공통
- **Python**: 기본 문법, NumPy, Pandas
- **ML 기초**: sklearn, train_test_split, cross_validation
- **통계**: 평균, 분산, 분포, 검정

#### Ch2 (투자) 사전
- **금융 기초**: 수익률, 변동성, 샤프 비율
- **시계열**: ARIMA, GARCH (선택)
- **DL**: LSTM 기본 구조

#### Ch3 (신용 리스크) 사전
- **신용평가**: KS, Gini, IV, WoE 용어
- **XGBoost**: 기본 사용법
- **OptBinning**: 구간화 기법

#### Ch4 (사기 탐지) 사전
- **불균형 데이터**: SMOTE, undersampling
- **NetworkX**: 그래프 기본
- **이상치 탐지**: Isolation Forest

#### Ch5 (MLOps) 사전
- **도커**: 컨테이너 기본
- **클라우드**: AWS/GCP 기본
- **CI/CD**: GitHub Actions

#### Ch6 (생성형 AI) 사전
- **Hugging Face**: transformers 라이브러리
- **OpenAI API**: 기본 호출
- **RAG**: 벡터 DB 개념

---

## 🔴 [고급] — 금융 AI 학습자의 마음가짐

### 1. 학습자 유형별 전략

#### 유형 A: 금융 도메인은 강함, AI 약함
- **추천 순서**: Ch1 → AI 기초 학습 → Ch2~Ch6
- **추가 학습**: 《핸즈온 머신러닝》 (Géron)
- **주의**: AI 기초 다지지 않으면 코드 따라가기 어려움

#### 유형 B: AI 강함, 금융 도메인 약함
- **추천 순서**: Ch1 깊이 → Ch2~Ch6
- **추가 학습**: 미슈킨 화폐금융론, Bodie *Investments*
- **주의**: 도메인 이해 없이 모델만 만들면 실무에서 무의미

#### 유형 C: 둘 다 약함 (학생)
- **추천 순서**: Ch1 → Python/ML 기초 → 금융 기초 → Ch2~Ch6
- **추가 시간**: 책 외 6~12개월
- **주의**: 욕심내지 말고 하나씩

#### 유형 D: 둘 다 강함 (실무자)
- **추천 순서**: 본인 분야 챕터 → 나머지
- **추가 활용**: 실제 회사 데이터로 응용
- **주의**: 책의 예제 수준이 본인 업무보다 단순할 수 있음

### 2. 금융 AI 실무자가 알아야 할 5가지 진실

#### 진실 ①: ML은 80%가 데이터 작업
- 모델 학습은 10% 시간
- 데이터 수집·정제·검증이 80%
- 평가·운영이 10%

#### 진실 ②: 최신 모델 ≠ 최고 모델
- 신용평가에서 GPT-4 < XGBoost
- 금융 데이터는 정형 위주 → 트리 모델 강세
- **DL > Tree 라는 신화는 비정형 데이터에만 적용**

#### 진실 ③: 코드는 쉽고, 의사결정은 어렵다
- sklearn으로 모델 만들기 = 한 줄
- "어떤 모델 쓸지", "어떤 메트릭으로 평가할지" = 한 달
- → **문제 정의 + 평가 설계가 진짜 어려운 부분**

#### 진실 ④: 모델은 운영에서 떨어진다 (Concept Drift)
- 학습 시 AUC 0.90
- 운영 6개월 후 AUC 0.75
- **모니터링 + 재학습 시스템이 모델보다 중요**

#### 진실 ⑤: 비즈니스 가치가 모든 것
- 모델 AUC 0.95라도 비즈니스 효과 없으면 무의미
- "이 모델로 회사가 얼마 더 벌었나?" — 항상 묻기

### 3. 책 활용 팁

#### 팁 ①: 실습 코드 직접 실행
- GitHub에서 코드 받기: `github.com/datakim/AI_FOR_FINANCE`
- Kaggle 환경 활용 (저자 권장)
- 한 줄씩 이해하며 진행

#### 팁 ②: 한 챕터 → 작은 프로젝트
- Ch2 끝나면 → 본인 관심 종목 분석
- Ch3 끝나면 → Kaggle 신용평가 대회 참가
- Ch4 끝나면 → 가상의 사기 데이터 만들어보기

#### 팁 ③: 영문 1차 자료 같이 보기
- 책 → 인용된 NVIDIA 보고서 직접 다운로드
- 책 → 인용된 학술 논문 1편 정독
- 영문 자료가 한국어보다 풍부

#### 팁 ④: 동료/스터디 그룹 활용
- 혼자 푸는 것보다 협업이 깊은 학습
- 인프런/패스트캠퍼스 강의 + 책 병행
- Kaggle 대회 팀 참가

---

## 🟣 [전공자] — 학술적 후속 학습 경로

### 1. 금융 AI 핵심 학술 자료

#### 1.1 교과서
- López de Prado, M. (2018). *Advances in Financial Machine Learning*. Wiley.
- Dixon, M. F., Halperin, I., & Bilokon, P. (2020). *Machine Learning in Finance*. Springer.
- Russell, S., & Norvig, P. (2021). *Artificial Intelligence: A Modern Approach* (4th ed.).
- Bodie, Z., Kane, A., & Marcus, A. J. (2024). *Investments* (13th ed.).

#### 1.2 학술 저널
- *Journal of Financial Economics*
- *Review of Financial Studies*
- *Journal of Banking & Finance*
- *Quantitative Finance*
- *Journal of Financial Data Science*

#### 1.3 학회
- **NeurIPS** Workshop on ML in Finance
- **ICML** Workshop on AI in Finance
- **ACM SIGKDD** Workshop on Mining Data for Financial Applications
- **AAAI** Special Track on FinTech

### 2. 한국 학술 자원

- **한국FinTech학회**: 학회지 *Financial Innovation Review*
- **한국금융학회**: *Asia-Pacific Journal of Financial Studies*
- **한국경영과학회**: AI 관련 논문 다수
- **금융보안원 보고서**: 한국 금융 AI 현장 자료

### 3. 추천 온라인 강의

| 강의 | 플랫폼 | 가격 | 특징 |
|------|------|------|------|
| Stanford CS229 (ML) | YouTube | 무료 | Andrew Ng, ML 입문 표준 |
| Stanford CS231N (CV) | YouTube | 무료 | DL/CNN |
| Stanford CS224N (NLP) | YouTube | 무료 | LLM 기반 |
| MIT 18.S096 (Math Finance) | OCW | 무료 | 금융 수학 |
| Andrew Ng Deep Learning Specialization | Coursera | $50/월 | DL 전반 |
| Practical Deep Learning | fast.ai | 무료 | 실용적 DL |
| **MLOps Specialization** | Coursera | $50/월 | MLOps |

### 4. 한국 금융 데이터 자료

| 데이터 | 출처 | 라이선스 |
|--------|------|---------|
| 한국 주식 OHLCV | KRX, Naver Finance | 일부 무료 |
| 금융 거래 (가공) | AIHub | 무료 |
| 신용평가 | 한국신용정보원 | 학술 신청 |
| 보험 클레임 | 손해보험협회 | 신청 |
| 거시지표 | 한국은행 ECOS | 무료 |
| 경제통계 | KOSIS | 무료 |

---

### 🟣 [전공자 심화] — 금융 AI 전체 학술 지형도 (Ch1 종합)

> 💭 Ch1 §1.1~§1.8을 학술적으로 묶으면 **5개 학문 영역의 교집합**으로 정리된다. 후속 학습 시 어느 영역에 더 깊이 들어갈지 결정하는 데 도움이 되는 지형도다.

#### 1. 5개 학문 영역의 교집합

```
        [정보경제학]                      [금융이론]
   Akerlof·Spence·Stiglitz           MM·Merton·Sharpe
   (정보 비대칭, 시그널링)             (자본구조, 옵션 가격)
              ╲                          ╱
               ╲                        ╱
                ╲          ╔══════════╗
                 ╲         ║ 금융 AI  ║
                  ╲        ║          ║
                   ╲       ╚══════════╝
                    ╲      ╱        ╲
        [통계학·ML]  ╲    ╱          ╲  [규제·법]
   Breiman·Vapnik   ╲  ╱            ╲  Basel·EU AI Act
   (RF·SVM·DL)       ╳              ╲  SR 11-7·신용정보법
                    ╱ ╲              ╲
                   ╱   ╲              ╲
              [컴퓨터과학]
        Fayyad·Ng·Goodfellow
        (KDD·MLOps·DL 시스템)
```

#### 2. Ch1 절별 학술 매핑

| 절 | 주 학문 영역 | 핵심 1차 자료 | 후속 연구 키워드 |
|---|---|---|---|
| §1.1 금융이란 | 금융이론·정보경제 | Modigliani-Miller (1958); Akerlof (1970); Merton (1995) | Pecking order, Credit rationing, Functional perspective |
| §1.2 금융기관 | 규제·산업조직론 | Glass-Steagall (1933); GLBA (1999); Dodd-Frank (2010); Basel III (2010) | Bank capital, TBTF, Shadow banking |
| §1.3 AI 용어 | 컴퓨터과학 | Russell & Norvig (2021); Goodfellow et al. (2016) | Foundation model, Multimodal |
| §1.4 금융 + AI | 산업분석·정책 | NVIDIA State of AI in FS (annual); BCG, McKinsey | AI adoption, ROI measurement |
| §1.5 응용 분야 | 응용 ML | Bhattacharyya (2011); Phua (2010); Arner et al. (2017) | Graph FDS, Federated learning, RegTech |
| §1.6 문제 정의 | 데이터 사이언스 방법론 | Fayyad et al. (1996) KDD; Chapman et al. (2000) CRISP-DM | CRISP-ML(Q), TDSP, MLOps |
| §1.7 도전 과제 | AI 거버넌스·윤리 | SR 11-7 (2011); EU AI Act (2024); Hacker et al. (2023) | Fairness, XAI, Model risk |
| §1.8 요약 | 통합 | — | — |

#### 3. 추천 후속 학습 경로 (3-track)

**Track A: 금융이론 심화** (경제·금융학 백그라운드 강화)
1. Tirole, J. (2006). *The Theory of Corporate Finance*. Princeton UP. — 정보 비대칭·계약이론 총정리.
2. Brunnermeier, M. K., & Pedersen, L. H. (2009). Market liquidity and funding liquidity. *RFS*, 22(6). — 유동성 위기 모형.
3. Allen, F., & Gale, D. (2007). *Understanding Financial Crises*. Oxford UP.

**Track B: 금융 ML 방법론 심화**
1. López de Prado, M. (2018). *Advances in Financial Machine Learning*. Wiley. — 백테스트 편향·메타라벨링 표준.
2. Bali, T. G., Beckmeyer, H., Mörke, M., & Weigert, F. (2023). Option return predictability with machine learning and big data. *RFS*, 36(9), 3548–3602. — 금융 시계열에 ML 적용 모범 사례.
3. Israel, R., Kelly, B. T., & Moskowitz, T. J. (2020). Can machines "learn" finance? *Journal of Investment Management*, 18(2). [DOI: 10.3905/jfds.2020.1.029](https://doi.org/10.3905/jfds.2020.1.029)

**Track C: AI 거버넌스·정책**
1. Barocas, S., Hardt, M., & Narayanan, A. (2023). *Fairness and Machine Learning: Limitations and Opportunities*. MIT Press. [무료: fairmlbook.org](https://fairmlbook.org/)
2. Bommasani, R., et al. (2021). On the opportunities and risks of foundation models. [arXiv:2108.07258](https://arxiv.org/abs/2108.07258) — 파운데이션 모델 위험·기회 종합 백서 (Stanford CRFM).
3. Hacker, P., Engel, A., & Mauer, M. (2023). Regulating ChatGPT and other large generative AI models. [arXiv:2302.02337](https://arxiv.org/abs/2302.02337)

#### 4. 금융 AI 학술 학회·저널 우선순위

**Tier 1 — 금융 AI 전문**:
- *Journal of Financial Data Science* (J.P. Morgan AI Research 산하) — 금융 AI 전문 저널.
- *Quantitative Finance* — ML in finance 정기 게재.

**Tier 1 — 금융학**:
- *Journal of Finance* (AFA)
- *Review of Financial Studies* (SFS)
- *Journal of Financial Economics*

**Tier 1 — ML/AI**:
- NeurIPS / ICML / ICLR — 핵심 ML 방법론.
- ACM FAccT — 공정성·책임·투명성 (AI 거버넌스 1순위 학회).
- KDD — 응용 ML, 사기 탐지·신용평가 정기 게재.

**Tier 2 — 응용**:
- *Expert Systems with Applications* (FDS·신용평가 응용)
- *Decision Support Systems* (Bhattacharyya 2011 게재지)
- *Computers & Security* (West-Bhattacharya 2016 게재지)

#### 5. 한국 적용 시 종합 고려사항

1. **데이터 접근성**: 한국은 미국·EU 대비 금융 데이터 공개가 제한적 → **Kaggle·AIHub 우회 + 산학협력** 필요.
2. **규제 차익 추적**: 한국은 미국 SR 11-7 + EU AI Act + 자체 신용정보법·전자금융감독규정의 **다층 규제** 환경. 변경 모니터링 필수.
3. **금융 도메인-AI 인재 풀의 격차**: 한국은 양 분야 모두 풍부하나 **교집합 인력**이 부족. 책 같은 입문서가 그 갭을 메우는 역할.
4. **국문 학술 자료**: 한국FinTech학회 *Financial Innovation Review*, 한국금융학회 *Asia-Pacific Journal of Financial Studies*, 금융보안원 연차보고서 — 한국 특수성을 반영한 1차 자료.
5. **카뱅·토스 Tech Blog**: 학술지에 없는 한국 핀테크 실무 자료. 인용 시 출처 표기만 명확히.
6. **연구 기회 영역** (영어권 문헌이 부족한 한국 특화 주제):
   - 보이스피싱 탐지 (음성·문자 멀티모달)
   - 마이데이터 기반 신용평가
   - 개인사업자(대포통장·작업대출) 사기 탐지
   - 한국형 ESG 평가 (K-ESG)
   - 부동산 PF 부실 조기경보
   - 한국어 LLM 금융 응용 (KB-Albert, Kanana 등)

#### 6. 본 해설집의 1차 자료 인용 원칙

본 [전공자 심화] 시리즈 (§1.1·1.2·1.4·1.5·1.6·1.8)는 다음 원칙으로 작성됨:
- 모든 학술 인용은 **저자·연도·학술지·DOI/URL** 명시.
- 사용자 요청 시 정확한 학술지명이 불분명한 경우 (예: Hilal et al. 2022는 *Expert Systems with Applications*가 맞음, *Information Systems*가 아님; Studer et al. 2021은 *MAKE*, *Data*가 아님) → **정정 명시**.
- BCBS 문서 번호 (d575 등) 미확정 시 **bis.org에서 직접 확인 권장** 안내.
- 한국 적용 시 주의점은 한국 법령·규정·산업 보고서에 근거.

---

## 📚 책에는 없지만 알면 좋은 것

### 🔍 보충 1 — 금융 AI 커뮤니티

#### 한국
- **데이터야놀자**: 연 1회 컨퍼런스
- **PyCon Korea Finance Track**
- **한국 AI 학회 (KAIST·서울대 주최)**
- **금융 AI 스터디 (페이스북, 카카오 오픈채팅)**
- **Kaggle Korea**: 슬랙 채널

#### 글로벌
- **r/MachineLearning** (Reddit)
- **Towards Data Science** (Medium)
- **Quantopian Community** (지금은 폐쇄, QuantConnect로)
- **Quant Stack Exchange**

### 🔍 보충 2 — 금융 AI 자격증 (참고용)

#### 한국
- **빅데이터 분석기사** (한국데이터산업진흥원)
- **ADP/ADsP** (한국데이터산업진흥원)
- **SQLD/SQLP**
- **TOPCIT**

#### 글로벌
- **CFA** (3단계, 금융 전반)
- **FRM** (Financial Risk Manager)
- **CQF** (Certificate in Quantitative Finance)
- **CAIA** (Alternative Investments)

### 🔍 보충 3 — 실무 진입 경로

#### 금융 AI 데이터 사이언티스트 채용 트렌드 (2024)

**시중은행 채용**:
- 신입: 석사 우대, ML 프로젝트 경험
- 경력: 3년+ 실무, Kaggle 경험 가산점

**핀테크 채용**:
- 빠른 의사결정, 코드 실력 중시
- Python + SQL + 클라우드 필수
- 카뱅·토스: 평균 연봉 시중은행 대비 1.2~1.5배

**경력 전환**:
- 도메인 (금융) → AI: 도메인 지식 강점, ML 부트캠프 필요
- AI (테크) → 금융: 빠른 적응 가능, 금융 기초 학습 필요

### 🔍 보충 4 — 향후 5년 트렌드 예측

| 트렌드 | 영향 |
|--------|------|
| **CBDC 본격화** | 결제 시스템 재편 |
| **Embedded Finance** | 비금융 기업의 금융 진출 |
| **AI Agent 자동화** | 챗봇 → 자율 의사결정 |
| **양자 컴퓨팅** | 암호 깨질 위험 → Post-quantum 암호 도입 |
| **기후 금융** | ESG 의무화 → AI 기반 측정 |
| **개인화 극단화** | 1인 1요금제 시대 |
| **글로벌 규제 통일** | EU AI Act가 표준화 추진 |

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. 책 끝나면 어디서부터 시작?

**A.** 3단계:
1. **재학습**: Ch2~Ch6 실습 코드 다시 한 번 (이해 위주)
2. **응용**: Kaggle 대회 1개 참가 (책 데이터 활용)
3. **확장**: 본인 도메인 (관심 분야) 데이터로 응용

### Q2. 영어가 약한데 어떻게?

**A.**
- **한국어 자료 먼저**: 책 + 한국 자료 → 기본
- **번역기 활용**: DeepL, ChatGPT로 영문 논문 번역
- **점진적 도전**: 한 달에 영문 논문 1편씩
- **유튜브 강의**: 자막 있는 영어 강의

### Q3. 수학이 약하면 금융 AI 못 하나?

**A.** **수준에 따라 다름**:
- **응용 수준** (sklearn 사용): 고등학교 수학 정도
- **이론 이해** (모델 동작): 대학 미적분·선형대수
- **연구 수준** (논문 작성): 확률·통계 깊이

→ **응용은 가능**. 이론은 점진적 학습.

### Q4. 금융권 vs. 핀테크, 어디가 좋나?

**A.**

| | 금융권 (KB, 신한 등) | 핀테크 (토스, 카뱅) |
|---|---|---|
| 안정성 | 매우 안정 | 중간 |
| 연봉 | 중상 | 상 |
| 워라밸 | 좋음 | 보통 |
| 기술 스택 | 보수적 (Java, 메인프레임) | 모던 (Python, AWS) |
| 의사결정 | 느림 | 빠름 |
| 학습 기회 | 제한적 | 풍부 |

**선택 기준**: 안정성 → 금융권, 빠른 성장 → 핀테크.

### Q5. 학생인데 금융 AI 어떻게 준비?

**A.** 추천 경로:
1. **학부 1~2학년**: Python + 통계 + 기초 ML
2. **학부 3학년**: Kaggle 대회 참가, 금융 데이터 분석 프로젝트
3. **학부 4학년**: 인턴십 (시중은행, 핀테크) + 포트폴리오
4. **대학원**: 금융 AI 관련 연구실 (KAIST, 서울대 등)

### Q6. 책 한 번 봤는데 이해가 안 됨

**A.** **정상**. 추천:
- **2~3회독**: 첫 번째는 큰 그림, 두 번째는 디테일
- **실습 병행**: 책 읽기만 하지 말고 코드 직접 실행
- **동료와 토론**: 본 것 설명해보기
- **시간 두고**: 6개월~1년 학습 권장

### Q7. 책 이후 다음 책 추천?

**A.** 분야별:
- **투자**: López de Prado *Advances in Financial Machine Learning*
- **신용평가**: Siddiqi *Intelligent Credit Scoring*
- **사기탐지**: 학술 논문 위주 (책 부족)
- **LLM**: Karpathy YouTube + Anthropic 문서
- **MLOps**: *Designing Machine Learning Systems* (Chip Huyen)

---

## 🎯 1장 핵심 — "이것만은 기억하자" 10가지

### 정의
1. **금융 = 시간을 가로지르는 돈의 이동**. PV/FV 공식 하나로 압축됨.
2. **AI ⊃ ML ⊃ DL ⊃ GenAI ⊃ LLM** — 포함 관계.

### 구조
3. **한국 금융 = 7가지 기관 유형** + 3축 규제 (FSC·FSS·BOK).
4. **금융의 6가지 기능 (Merton-Bodie)** 이 이 책 6개 장과 매핑.

### 시장
5. **한국 금융 AI 시장: 2024년 1.2조 → 2026년 3.2조** (연 38% 성장).
6. **17가지 활용 사례 중 NLP/LLM이 1위 (26%)**.

### 응용
7. **금융 AI 6 Pillars**: 신용평가·사기탐지·고객서비스·투자트레이딩·준법감시·프로세스자동화.
8. **금융 AI = 정보 비대칭(Akerlof)을 데이터로 줄이는 도구**.

### 도전
9. **5가지 약속**: 인사이트·자동화·고객경험·안전·리스크 관리.
10. **4가지 장벽**: 데이터 확보·규제 보안·레거시 시스템·윤리.

---

## 🌉 Ch2 진입 전 준비

### 2장 미리보기 — "금융 투자 영역에서의 AI"

> "투자는 금융의 꽃이라 할 수 있다."

**다룰 내용**:
- 대표적인 금융 투자 방식
- 퀀트의 기원과 AI 시대
- 알고리즘 트레이딩 시장
- AI 기반 vs. 전통 퀀트
- **실습 1**: 금융 시계열 + 파이썬 전통 퀀트
- **실습 2**: 머신러닝 투자 전략
- **실습 3**: 딥러닝 투자 전략

### Ch2 준비 체크리스트

```
□ Python 환경 준비 (Kaggle 노트북 추천)
□ 기본 라이브러리 설치 (pandas, numpy, matplotlib, sklearn)
□ 한국 주식 데이터 접근 방법 (FinanceDataReader, pykrx)
□ 금융 시계열 기초 (수익률, 변동성, 샤프 비율)
□ XGBoost 기본 사용법
□ LSTM 기본 구조 이해
□ Backtest 개념
```

### Ch2 학습 자세

> 💡 Ch2는 책에서 가장 어려운 챕터 중 하나. **한 번에 다 이해 못 해도 OK**. 실습 3을 못 따라가도 실습 1만 완료해도 큰 성과.

---

## 📖 1장 전체 더 읽을거리 (Top 20)

### 입문 (한국어)
1. 미슈킨, F. *화폐와 금융기관*. 퍼스트북.
2. 한국은행. (2024). *우리나라의 금융제도*. — 무료.
3. 김기현. (2021). *김기현의 자연어 처리 딥러닝 캠프*. 한빛미디어.

### 입문 (영어)
4. Bodie, Z., Kane, A., & Marcus, A. J. (2024). *Investments* (13th ed.). McGraw-Hill.
5. Russell, S., & Norvig, P. (2021). *Artificial Intelligence: A Modern Approach* (4th ed.).
6. Ng, A. (2018). *Machine Learning Yearning*. — 무료 PDF.
7. Géron, A. (2022). *Hands-On Machine Learning* (3rd ed.). O'Reilly.

### 금융 AI 심화
8. López de Prado, M. (2018). *Advances in Financial Machine Learning*. Wiley.
9. Dixon, M. F., et al. (2020). *Machine Learning in Finance*. Springer.

### 1차 자료 (학술)
10. Merton, R. C. (1995). A functional perspective of financial intermediation. *Financial Management*.
11. Akerlof, G. A. (1970). The market for "lemons". *QJE*.
12. Vaswani, A., et al. (2017). Attention is all you need. *NeurIPS*.

### 시장 보고서
13. NVIDIA. (매년). *State of AI in Financial Services*.
14. BCG. (2023). *Generative AI in Finance*.
15. McKinsey. (매년). *AI in Banking*.

### 규제·정책
16. 금융위원회. (2021). *금융분야 AI 가이드라인*.
17. European Parliament. (2024). *EU AI Act*.
18. Federal Reserve. (2011). *SR 11-7*.

### 사회·윤리
19. O'Neil, C. (2016). *Weapons of Math Destruction*.
20. Barocas, S., Hardt, M., & Narayanan, A. (2023). *Fairness and Machine Learning*. — 무료.

---

> **다음 챕터** — Ch2 「금융 투자 영역에서의 AI」
>
> 이 책 가장 긴 챕터. 전통 퀀트 → ML 퀀트 → DL 퀀트의 3단계 실습.
> 실습 1 (전통 퀀트)이 가장 쉽고, 실습 3 (LSTM)이 가장 어려움.
> 모든 코드는 `github.com/datakim/AI_FOR_FINANCE` 에서 다운로드.

---

> 1장 끝.
> 약 30시간 분량의 해설집을 다 읽었다면, 금융 AI의 큰 그림이 명확해졌을 것이다.
> 이제부터 본격적인 모델 작업이다.
