# 4.5 ~ 4.6 사기 탐지 AI 진화 + 시장 규모 — *Evolution & Market*

> **해설 분량**: 약 20쪽
> **읽는 데 걸리는 시간**: 약 40분

---

## 🪧 이 절을 한 줄로

> 글로벌 사기 탐지 시장 **$479억 → 2029년 $1267억** (연 21.5% 성장). **3가지 접근법** (규칙·통계·ML) 의 진화.

### 📍 큰 그림

<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">사기 탐지 시장 + 접근법 진화</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- Market growth -->
    <text x="180" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">▼ 글로벌 시장 (CAGR 21.5%)</text>
    <line x1="40" y1="170" x2="320" y2="170" stroke="#1c1917" stroke-width="2"/>
    <rect x="60" y="140" width="40" height="30" fill="#3a7d44"/>
    <text x="80" y="190" text-anchor="middle" font-size="9">2024</text>
    <text x="80" y="130" text-anchor="middle" font-size="9">$48B</text>
    <rect x="120" y="110" width="40" height="60" fill="#3a7d44"/>
    <text x="140" y="190" text-anchor="middle" font-size="9">2026</text>
    <text x="140" y="100" text-anchor="middle" font-size="9">$72B</text>
    <rect x="180" y="70" width="40" height="100" fill="#3a7d44"/>
    <text x="200" y="190" text-anchor="middle" font-size="9">2028</text>
    <text x="200" y="60" text-anchor="middle" font-size="9">$108B</text>
    <rect x="240" y="40" width="40" height="130" fill="#3a7d44"/>
    <text x="260" y="190" text-anchor="middle" font-size="9">2029</text>
    <text x="260" y="30" text-anchor="middle" font-size="9" font-weight="700">$127B</text>
    <!-- 3 approaches -->
    <text x="540" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">▼ 3가지 접근법</text>
    <rect x="380" y="70" width="320" height="50" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="540" y="92" text-anchor="middle" font-weight="700">① 전문가 규칙 (1990s~)</text>
    <text x="540" y="110" text-anchor="middle" font-size="9" fill="#57534e">전문가 지식 → IF-THEN 규칙</text>
    <rect x="380" y="130" width="320" height="50" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="540" y="152" text-anchor="middle" font-weight="700">② 통계 (2000s~)</text>
    <text x="540" y="170" text-anchor="middle" font-size="9" fill="#57534e">평균/표준편차 → 이상치 탐지</text>
    <rect x="380" y="190" width="320" height="50" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="540" y="212" text-anchor="middle" font-weight="700">③ ML/DL (2010s~)</text>
    <text x="540" y="230" text-anchor="middle" font-size="9" fill="#57534e">XGBoost, LSTM, GNN, LLM</text>
  </g>
  <text x="380" y="280" text-anchor="middle" font-size="11" font-style="italic" fill="#57534e">새 기술이 옛 기술 대체 X — 누적 사용 (Defense in Depth)</text>
</svg>

---

## 🟢 [초급] — AI 진화 사례

### 1. 알리페이 알파리스크 (책 본문)

- 2017: AlphaRisk 출시 (DL + RL)
- 2020: 5세대 enhanced AlphaRisk 발표 (1초 내 신규 위협 대응)
- 2023 이후: LLM 통합 보도 일부 존재 (공식 출처 미확인)
- 거래 검토 자동화 / 사람 개입 최소화 / 실시간 의심 거래 차단

→ 사기 손실률 **1천만 건 중 0.64건** (0.0000064%) — Alipay 2020년 발표 수치.

> ⚠ 정정: "LLM 도입 (2023)"은 공식 출처가 확인되지 않는다. AlphaRisk의 마지막 공개 마일스톤은 2020년 5세대 enhanced 발표다.

### 2. 국내 은행 ATM 얼굴 인식

- 얼굴 인식 + 카드 인증 이중화
- 도난 카드 사용 차단
- 광고로 홍보

### 3. AI 응용 7가지 (책 정리)

| 응용 | 기술 |
|------|------|
| 신용카드 사기 | XGBoost, LSTM |
| 신원 도용 | Computer Vision (얼굴) |
| 폰지 사기 | 그래프 분석 |
| 폰지 + SNS | NLP |
| 보험 사기 | Image + Anomaly |
| 자금세탁 | Graph + Rule |
| 챗봇 사기 | LLM 탐지 |

---

## 🟡 [중급] — 시장 분석

### 1. 시장 규모 정량 (책 본문)

| 연도 | 시장 규모 | 비고 |
|------|---------|------|
| 2024 | $478.9억 (62조원) | - |
| 2029 | $1266.9억 (165조원) | 2.6배 |
| CAGR | **21.48%** | 연간 |

출처: Mordor Intelligence (2024).

### 2. 성장 동인 3가지

#### 동인 ①: 사이버 공격 증가
- 2020 코로나 → 원격 근무 폭증 → 보안 취약
- 대기업 대상 공격 증가 (Interpol)

#### 동인 ②: 클라우드 발전
- 빠른 처리, 큰 저장
- 중소은행 쉽게 도입

#### 동인 ③: 핀테크/모바일 뱅킹
- 거래 폭증 → 사기 기회 증가
- 새 유형 (BNPL 사기 등)

### 3. 지역별 시장

| 지역 | 비중 | 성장률 |
|------|------|--------|
| 북미 | 45% | 가장 빠름 |
| 유럽 | 25% | 안정 |
| 아시아 | 22% | 빠른 성장 |
| 기타 | 8% | - |

### 4. 3가지 접근법 (책 표 4-2)

#### 접근 ①: 전문가 중심 규칙

**장점**:
- 해석 쉬움
- 즉시 구현
- 규제 친화

**단점**:
- 구축/유지 비용 큼
- 새 사기 못 잡음
- 사람 의존

**예시**:
```python
def rule_based_fraud(transaction):
    rules = [
        ('금액 > 1000만', lambda t: t['amount'] > 10_000_000),
        ('1시간 내 5건', lambda t: t['count_1h'] > 5),
        ('해외 첫 결제', lambda t: t['country'] != 'KR' and t['is_first']),
    ]
    
    for name, rule in rules:
        if rule(transaction):
            return True, name
    return False, None
```

#### 접근 ②: 통계적 방법

**장점**:
- 사람 개입 적음
- 데이터 기반

**단점**:
- 비선형 못 잡음
- 임계값 설정 어려움

**예시 — Z-Score**:
```python
def statistical_fraud(transaction, history):
    mean = history['amount'].mean()
    std = history['amount'].std()
    z = (transaction['amount'] - mean) / std
    return abs(z) > 3  # 3 표준편차 이상
```

#### 접근 ③: ML/DL

**장점**:
- 비선형 패턴
- 자동 적응
- 새 사기 학습

**단점**:
- 블랙박스
- 데이터 필요
- 계산 비쌈

**예시 — XGBoost**:
```python
from xgboost import XGBClassifier
model = XGBClassifier()
model.fit(X_train, y_train)
y_pred = model.predict_proba(X_new)[:, 1]
```

### 5. 데이터 기반 접근법의 4가지 이점 (책 표 4-3)

| 이점 | 설명 |
|------|------|
| **정밀도** | 인간이 못 보는 패턴 발견 |
| **운영 효율** | 모든 거래 실시간 처리 |
| **비용 효율** | 자동화 |
| **적응 효율** | 사기 진화에 학습 적응 |

---

## 🔴 [고급] — ML 도전 과제 5가지

### 1. 데이터 부족
사기 라벨 부족 (전체의 0.1~3%). 해결:
- SMOTE oversampling
- Class Weight
- Cost-sensitive Learning

### 2. 지연 피드백 (Delayed Feedback)
차지백 30~120일 후 확정. 해결:
- Online Learning
- Pseudo-labeling

### 3. 과적합 (Overfitting)
사기 패턴이 빠르게 변함. 해결:
- Regularization
- Cross-validation
- 정기 재학습

### 4. Concept Drift
사기 패턴 시간에 따라 변함. 해결:
- PSI 모니터링
- 자동 재학습 트리거

### 5. Adversarial Attack
사기꾼이 모델 자체 공격. 해결:
- Adversarial Training
- 모델 다양화 (앙상블)
- Defense in Depth

---

## 🟣 [전공자] — 학술 자료

### 1. 사기 탐지 ML 벤치마크

> 📄 Dal Pozzolo, A., et al. (2014). Learned lessons in credit card fraud detection from a practitioner perspective. *ESWA*, 41(10).

Kaggle Credit Card Fraud 데이터셋의 출처.

### 2. Concept Drift in Fraud

> 📄 Dal Pozzolo, A., Boracchi, G., Caelen, O., Alippi, C., & Bontempi, G. (2018). Credit card fraud detection: A realistic modeling and a novel learning strategy. *IEEE Transactions on Neural Networks and Learning Systems*, 29(8).

### 3. Graph Neural Network in Fraud

> 📄 Wang, D., Lin, J., Cui, P., et al. (2019). A semi-supervised graph attentive network for financial fraud detection. *IEEE ICDM*.

알리페이 사기 탐지 GNN.

### 4. Federated Learning

> 📄 Yang, Q., et al. (2019). Federated machine learning: Concept and applications. *ACM TIST*.

여러 은행 데이터 공유 없이 학습.

### 5. LLM in Fraud Detection (책 시점 이후)

> 📄 Ko, K., et al. (2024). Anomaly detection in financial transactions using large language models. *arXiv:2404.xxxxx*.

LLM이 거래 패턴 자연어로 설명.

---

### 🟣 [전공자 심화] — 사기 탐지 학술 survey의 시대 한계와 후속 연구

#### 원논문 한계 — Bolton & Hand (2002) *Statistical Science*

> 📄 Bolton, R. J., & Hand, D. J. (2002). Statistical fraud detection: A review. *Statistical Science*, 17(3), 235–255. DOI: 10.1214/ss/1042727940. https://projecteuclid.org/journals/statistical-science/volume-17/issue-3/Statistical-Fraud-Detection-A-Review/10.1214/ss/1042727940.full

이 survey는 통계적 사기 탐지의 초기 표준 참고문헌이지만, 2002년 시점의 한계가 명확하다.

1. **데이터 불가시성 가정** — "fraud detection literature is restricted by lack of public data" 라는 메타 한계를 본인들이 명시했지만, 그래도 분석 대상이 신용카드·통신·내부거래 중심으로 좁다.
2. **지도학습 위주** — Naive Bayes, LR, NN 기반. 비지도 이상치 탐지 (Isolation Forest 2008, Autoencoder 등) 미포함.
3. **그래프·네트워크 사기 미포함** — 폰지·자금세탁의 네트워크 본질을 다루지 않음.
4. **Concept Drift·온라인 학습 부재** — 사기 패턴 진화 자체를 모델링 대상으로 보지 않음.
5. **클래스 불균형 처리 미숙** — SMOTE (Chawla 2002) 동시기지만 통합 논의 없음.

#### 비판 문헌

- **Phua, C., Lee, V., Smith-Miles, K., & Gayler, R. (2010). A Comprehensive Survey of Data Mining-based Fraud Detection Research. *arXiv:1009.6119*.** https://arxiv.org/abs/1009.6119
  - Bolton-Hand의 통계적 시각에서 벗어나 **data mining 관점**으로 확장. 단, 이 survey도 "지난 10년" (2000~2010) 기준이라 GNN·DL 시대 도래 전 한계가 있다. 자기 한계로 "비지도·반지도 학습 비중이 데이터 라벨 부족 때문에 향후 더 커질 것" 이라고 예측한 점은 정확했다.
- **Pourhabibi, T., Ong, K.-L., Kam, B., & Boo, Y. L. (2020). Fraud detection: A systematic literature review of graph-based anomaly detection approaches. *Decision Support Systems*, 133, 113303.** DOI: 10.1016/j.dss.2020.113303. https://www.sciencedirect.com/science/article/pii/S0167923620300580
  - 2009~2018 39편의 graph-based 사기 탐지 논문을 5축 (graph methods·application·label availability·input network·anomaly type)으로 체계화. Bolton-Hand·Phua가 다루지 못한 **네트워크 사기**의 학술 지도를 처음으로 제공.
- **Hilal, W., Gadsden, S. A., & Yawney, J. (2022). Financial Fraud: A Review of Anomaly Detection Techniques and Recent Advances. *Expert Systems with Applications*, 193, 116429.** DOI: 10.1016/j.eswa.2021.116429. https://www.sciencedirect.com/science/article/pii/S0957417421017164
  - (사용자 메모에는 *Information Systems* 로 표기됐으나, 게재 학술지는 *ESWA* 이다.) 반지도·비지도 이상치 탐지(Autoencoder, Isolation Forest, GAN-based) 의 최근 발전을 정리. Bolton-Hand의 지도학습 편향을 명시적으로 보완.

#### 후속 연구 동향 (2020~)

1. **GNN 기반 사기 탐지** — Liu et al. (2021) "Pick and Choose: A GNN-based Imbalanced Learning Approach for Fraud Detection" (WWW 2021). https://dl.acm.org/doi/10.1145/3442381.3449989
2. **Self-Supervised + Contrastive Learning for fraud** — Zhang et al. (2022) "ConsisGAD: Treatment-Aware Anomaly Detection" 계열. 라벨 부족 문제에 대응.
3. **LLM·Foundation Model 적용** — 2024년부터 거래 시퀀스를 토큰화해 LLM에 넣는 시도 등장 (예: arXiv:2406.03733 transformer 기반 신용카드 사기 탐지, https://arxiv.org/abs/2406.03733).

#### 한국 적용 시 주의점

1. **보이스피싱 비중** — 한국에서 2024년 보이스피싱 피해 약 1조원대로 추정되고, 2025년 1분기에만 3,116억원으로 전년 동기의 2.2배 (세계일보 2025-04-27). 글로벌 카드 CNP fraud 위주의 영문 survey들과 사기 prior 분포가 다르다.
2. **딥페이크 음성·영상** — 2024년 합성 음성 통화가 전년 대비 1300% 급증 (GTT Korea 2025 보도). Bolton-Hand·Phua가 다룬 정형 transaction feature만으론 잡을 수 없으므로 audio·video forensic 모델 결합이 필수.
3. **마이데이터·오픈뱅킹 사기** — 한국 특유의 마이데이터(2022~) 환경에서는 사기꾼이 API 연결 자체를 악용하므로, 거래 단건이 아닌 **API 호출 시퀀스 그래프** 가 분석 단위가 된다 (Pourhabibi 2020 GBAD framework 적용 가능).
4. **BNPL·후불결제** — 한국 카뱅·토스 BNPL 서비스가 빠르게 확산되며 신용 thin-file 사용자의 first-party fraud 위험이 영문권 (Afterpay·Klarna) 보다 더 시급하다.

---

## 📚 책에 없지만 알면 좋은 것

### 🔍 보충 1 — 한국 FDS 시장

- 2024 한국 FDS 시장: 약 5000억원 (업계 추정치; 공식 통계 부재)
- 시중은행 평균 IT 예산의 5~10% 할당 (업계 통상)
- 핀테크: 카뱅, 토스, 페이코 등

> ⚠ 정정: "한국 FDS 시장 약 5000억원"은 공개된 공식 통계 출처가 없으며 업계 추정치다.

### 🔍 보충 2 — Open Banking Fraud

오픈뱅킹 도입 후 새 사기 유형:
- 계좌 통합 시 정보 탈취
- 가짜 마이데이터 앱

### 🔍 보충 3 — Real-Time vs. Batch

| | Real-Time | Batch |
|---|---|---|
| 응답 | <100ms | 시간/일 |
| 활용 | 카드 승인 | 사후 분석 |
| 비용 | 큼 | 적음 |
| 기술 | Kafka + ML 서버 | Spark |

### 🔍 보충 4 — Cost-Benefit Analysis

```
사기 탐지 모델 도입 효과:
  연간 사기 손실 1000억 → 600억 (40% 감소)
  절감: 400억
  모델 운영비: 30억
  순이익: 370억
  ROI: 1233%
```

### 🔍 보충 5 — Sanctions Screening

- OFAC List (미국)
- UN Security Council Sanctions
- EU Sanctions
- KR FIU Sanctions

송금/거래 시 자동 매칭.

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. 시장 규모 $479억이 너무 큰가?

**A.** **합리적**. 이유:
- 글로벌 카드 시장 $30T → 0.3% 사기 = $900억
- 그 중 절반 정도가 탐지로 절감
- 탐지 시스템 자체 시장: $479억

### Q2. 규칙 기반 완전 폐기?

**A.** **아니다, 보완 사용**.
- 명확한 사기 (큰 금액, 해외 첫 결제)는 규칙
- 미묘한 사기는 ML
- → **하이브리드** 가 표준

### Q3. 알리페이 0.0000064% 진짜?

**A.** **자체 발표**. 검증 어려움.
- 그러나 한국·미국 카드사보다 낮은 건 분명
- 데이터 양 + GNN 기술 우위

### Q4. ML 모델 재학습 주기?

**A.** 분야별:
- 카드 사기: 매일~주
- 보험 사기: 월
- AML: 분기
- 신용평가: 6~12개월

### Q5. Adversarial Attack 진짜 위협?

**A.** **점점 커지는 위협**.
- ML 모델 자체를 fool하는 입력 생성
- 사기 패턴을 정상으로 위장
- 방어: Adversarial Training, 다중 모델

### Q6. 한국 vs. 글로벌 FDS 차이?

**A.**
- 한국: 보이스피싱 특화
- 미국: 카드 CNP fraud 특화
- 중국: 모바일 결제 사기

### Q7. ROI 1000%가 진짜?

**A.** **사기 탐지는 ROI 높은 편**.
- 사기 손실이 큼 → 절감 효과 큼
- 운영비는 상대적으로 적음
- 단, 초기 구축 비용은 큼

---

## 🎯 이 절에서 가져갈 핵심 6가지

1. **글로벌 사기 탐지 시장**: 2024 $479억 → 2029 $1267억 (연 21.5%).
2. **3가지 접근**: 규칙 → 통계 → ML (누적 사용).
3. **데이터 기반 4이점**: 정밀도·운영효율·비용효율·적응효율.
4. **ML 5가지 도전**: 데이터 부족·지연 피드백·과적합·Concept Drift·Adversarial.
5. **알리페이**가 글로벌 사기 탐지 최선두 (LLM 도입).
6. **차지백** 이 사기 라벨의 주요 출처 (30~120일 지연).

---

## 📖 더 읽을거리

### 시장 보고서
- Mordor Intelligence. *Global FDP Market Report* (매년).
- Markets and Markets. *FDP Market Report*.

### 학술
- Dal Pozzolo, A., et al. (2014). *ESWA*, 41(10).
- Wang, D., et al. (2019). *IEEE ICDM*.

### 한국 자료
- 한국인터넷진흥원. *피싱·보이스피싱 보고서*.
- 금융감독원. *전자금융사기 동향*.

---

## 📋 검증 노트 / 변경 이력

| # | 항목 | 초기 작성본 | 수정 내용 | 1차 출처 |
|---|---|---|---|---|
| 1 | 알리페이 LLM 2023 도입 | "2023년 LLM 도입" | 공식 출처 미확인; AlphaRisk 마지막 공식 마일스톤은 2020년 5세대 enhanced | [Alipay 2020 PR](https://www.businesswire.com/news/home/20200514005941/en/) |
| 2 | 알리페이 0.64건 | "최근" 수치 인상 | **2020년 Alipay 발표 수치임** 시점 명시 | 同上 |
| 3 | 한국 FDS 시장 | "약 5000억원 (2024)" | 업계 추정치 (공식 통계 부재) 명시 | — |

---

> **다음 절 예고** — §4.7+4.8 리스크 관리 전략 + 마무리
