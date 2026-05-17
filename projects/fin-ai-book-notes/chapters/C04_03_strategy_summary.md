# 4.7 ~ 4.8 사기 거래 탐지 리스크 관리 전략 + 마무리 — *Strategy & Summary*

> **해설 분량**: 약 15쪽

---

## 🪧 이 절을 한 줄로

> 사기 탐지 전략 = **비즈니스 이해 → 리스크 분석 → 전략 설계 → 평가 → 지속 개선**. 핵심 균형: **차단 vs. 고객 경험**.

### 📍 전체 흐름

<svg viewBox="0 0 760 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">사기 탐지 리스크 관리 전략 5단계</text>
  <defs>
    <marker id="ar5" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#1c1917"/></marker>
  </defs>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <rect x="20" y="80" width="130" height="80" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="85" y="105" text-anchor="middle" font-weight="700" fill="#c4724e">① 비즈니스 이해</text>
    <text x="85" y="125" text-anchor="middle" font-size="10" fill="#1c1917">고객 여정 분석</text>
    <text x="85" y="143" text-anchor="middle" font-size="10" fill="#57534e">위험 단계 식별</text>
    <line x1="150" y1="120" x2="180" y2="120" stroke="#1c1917" stroke-width="2" marker-end="url(#ar5)"/>
    <rect x="190" y="80" width="130" height="80" rx="8" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="255" y="105" text-anchor="middle" font-weight="700" fill="#5a7a96">② 리스크 분석</text>
    <text x="255" y="125" text-anchor="middle" font-size="10" fill="#1c1917">데이터·과거사례</text>
    <text x="255" y="143" text-anchor="middle" font-size="10" fill="#57534e">전문가 통찰</text>
    <line x1="320" y1="120" x2="350" y2="120" stroke="#1c1917" stroke-width="2" marker-end="url(#ar5)"/>
    <rect x="360" y="80" width="130" height="80" rx="8" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="425" y="105" text-anchor="middle" font-weight="700" fill="#3a7d44">③ 전략 설계</text>
    <text x="425" y="125" text-anchor="middle" font-size="10" fill="#1c1917">알고리즘 + 규칙</text>
    <text x="425" y="143" text-anchor="middle" font-size="10" fill="#57534e">프로세스 통합</text>
    <line x1="490" y1="120" x2="520" y2="120" stroke="#1c1917" stroke-width="2" marker-end="url(#ar5)"/>
    <rect x="530" y="80" width="130" height="80" rx="8" fill="#f5e6f0" stroke="#7a6a9a"/>
    <text x="595" y="105" text-anchor="middle" font-weight="700" fill="#7a6a9a">④ 평가</text>
    <text x="595" y="125" text-anchor="middle" font-size="10" fill="#1c1917">거부율/사기율</text>
    <text x="595" y="143" text-anchor="middle" font-size="10" fill="#57534e">목표 비교</text>
    <line x1="660" y1="160" x2="660" y2="180" stroke="#1c1917" stroke-width="2"/>
    <line x1="660" y1="180" x2="100" y2="180" stroke="#1c1917" stroke-width="1.5"/>
    <line x1="100" y1="180" x2="100" y2="165" stroke="#1c1917" stroke-width="1.5" marker-end="url(#ar5)"/>
    <text x="380" y="200" text-anchor="middle" font-size="11" font-style="italic" fill="#57534e">⑤ 지속 개선 — 새 사기 패턴 모니터링</text>
  </g>
</svg>

---

## 🟢 [초급] — 5단계 전략

### 1단계: 비즈니스 프로세스 이해

#### 디지털 은행 고객 여정 4단계

| 단계 | 위험 | 대응 |
|------|------|------|
| **가입** | 명의 도용 | 신분증 OCR + 얼굴 인식 |
| **송금** | 계정 도용 | 이상거래 탐지 + 추가 인증 |
| **투자** | 잘못된 정보 | 데이터 검증 |
| **출금** | 보이스피싱 | 송금 차단 + 알림 |

### 2단계: 리스크 분석

#### 3가지 분석 방법
- **데이터 분석**: 거래 패턴 → 이상치 식별
- **과거 사례 검토**: 비슷한 사기 학습
- **전문가 통찰**: 최신 기술 + 트렌드

### 3단계: 전략 설계 + 프로세스 디자인

#### 통합 요소
- **데이터**: 어떤 소스?
- **모델/규칙**: 어떤 알고리즘?
- **의사결정 엔진**: 어떻게 적용?

### 4단계: 효과 평가

#### 평가 지표
- 거부율 (FP)
- 사기율 (FN)
- 고객 불만 (False Decline)
- ROI

### 5단계: 지속 개선

#### 모니터링 사이클
- 매월: 모델 성능 확인
- 분기: 새 사기 유형 학습
- 매년: 모델 재학습 + 시스템 업그레이드

> ✅ **여기까지 따라왔으면**: 사기 탐지 전략의 전체 사이클이 보일 거다.

---

## 🟡 [중급] — 차단 vs. 고객 경험 트레이드오프

### 1. 핵심 균형

```
[엄격한 차단]
- 사기율 ↓
- 고객 불만 ↑ (거짓 거부)
- 매출 감소

[관대한 차단]
- 고객 경험 ↑
- 사기 손실 ↑
- 신뢰 손실
```

### 2. 거짓 거부 (False Decline) 비용

#### 예시 시나리오 (가상 수치, 실제 카드사 공시 아님)
- 거짓 거부율 3% 가정
- 거짓 거부 1건당 매출 손실: 평균 5,000원 가정
- 연 1억 건 거래(가정) × 3% × 5,000원 = **연 150억 손실 (예시 계산)**

→ **사기 차단 못지않게 거짓 거부 줄이기 중요**.

> ⚠ 정정: 초기 작성본의 "연 100억 건 거래 → 연 150억 손실"은 산수가 맞지 않았다(100억 × 3% × 5,000원 = 1.5조). 위는 "연 1억 건" 기준의 예시 계산으로 정정한 가상 시나리오이며, 실제 카드사 공시 수치가 아니다.

### 3. 균형 잡기 — Threshold 조정

```python
# 보수적 (사기 차단 ↑, 거짓 거부 ↑)
threshold = 0.3

# 균형
threshold = 0.5

# 공격적 (사기 차단 ↓, 거짓 거부 ↓)
threshold = 0.7

# 비즈니스 비용 최적화
def find_optimal_threshold(y_test, y_pred_proba, cost_fp, cost_fn):
    best_threshold = 0.5
    best_cost = float('inf')
    
    for t in np.arange(0.1, 0.9, 0.05):
        y_pred = (y_pred_proba > t).astype(int)
        fp = ((y_pred == 1) & (y_test == 0)).sum()
        fn = ((y_pred == 0) & (y_test == 1)).sum()
        total_cost = fp * cost_fp + fn * cost_fn
        
        if total_cost < best_cost:
            best_cost = total_cost
            best_threshold = t
    
    return best_threshold
```

### 4. ROI 기반 전략

```
[질문]
"이 모델 도입으로 얼마 절감?"

[계산]
연 사기 손실: 1000억
탐지 전 사기율: 0.5%
탐지 후 사기율: 0.1% (80% 감소)
절감: 800억

운영비:
- 인프라: 30억
- 인력: 50억
- 라이선스: 20억
총 100억

순이익: 700억
ROI: 700%
```

---

## 🔴 [고급] — 실전 사기 탐지 시스템 설계

### 1. 시스템 아키텍처

<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">실전 사기 탐지 시스템 — Defense in Depth</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- Layer 1 -->
    <rect x="40" y="60" width="680" height="40" rx="6" fill="#fef9e7" stroke="#8a6d2c"/>
    <text x="380" y="85" text-anchor="middle" font-weight="700" fill="#8a6d2c">① 디바이스 핑거프린팅 (Device Fingerprinting) — 즉시 차단</text>
    <!-- Layer 2 -->
    <rect x="40" y="110" width="680" height="40" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="380" y="135" text-anchor="middle" font-weight="700" fill="#c4724e">② 규칙 기반 (Rule Engine) — 명확한 사기 (10ms)</text>
    <!-- Layer 3 -->
    <rect x="40" y="160" width="680" height="40" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="380" y="185" text-anchor="middle" font-weight="700" fill="#5a7a96">③ ML 모델 (XGBoost/LightGBM) — 통계적 사기 (50ms)</text>
    <!-- Layer 4 -->
    <rect x="40" y="210" width="680" height="40" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="380" y="235" text-anchor="middle" font-weight="700" fill="#3a7d44">④ DL/GNN (LSTM, Graph) — 복잡한 패턴 (100ms)</text>
    <!-- Layer 5 -->
    <rect x="40" y="260" width="680" height="40" rx="6" fill="#f5e6f0" stroke="#7a6a9a"/>
    <text x="380" y="285" text-anchor="middle" font-weight="700" fill="#7a6a9a">⑤ 사람 검토 (Manual Review) — 회색 지대 (분~시간)</text>
  </g>
</svg>

### 2. 단계별 처리량

```
초당 10000건 거래 →
Layer 1 (디바이스): 즉시 통과 90%
Layer 2 (규칙): 즉시 차단 5%
Layer 3 (ML): 의심 4%
Layer 4 (DL): 추가 검토 0.9%
Layer 5 (사람): 최종 판단 0.1%

→ 인간 검토 = 초당 10건 (관리 가능)
```

### 3. 한국 카뱅 사례 (보강)

#### AI 기반 FDS (도입 진화 중)
- **계층**: 다단계 방어 (규칙 + ML)
- **모델**: AI/ML (구체 알고리즘 비공개)
- **데이터**: 거래 + 행동 패턴
- **성과 (시스템·집계 범위별)**: 2023년 87.7억(머신러닝, 카카오 금융안전보고서) / 123억(AI 시스템 전체, 전자신문) / 385억(FDS+보이스피싱, 아시아에이) / 2025년 358억(셀카 AI 인증 포함, 머니S)

> ⚠ 정정: "GNN 기반 FDS 2세대 + 보이스피싱 60% 감소" 는 출처 미확인. 카뱅 공식 자료엔 AI/ML 기반이라고만 명시되어 있음.

### 4. 책의 한계 5가지

#### 한계 ①: 사기 ROI 계산법 부재
책은 추상적 설명만. 위 [중급] §4에서 보완.

#### 한계 ②: Threshold 최적화 부재
비즈니스 비용 기반 임계값 결정 미언급.

#### 한계 ③: 시스템 아키텍처 부재
실전 다층 방어 설계 없음.

#### 한계 ④: A/B 테스트 미언급
새 모델 도입 시 점진적 비교.

#### 한계 ⑤: 한국 보이스피싱 대응 부재
한국 최대 사기 유형인데 책에 없음.

---

## 🟣 [전공자] — 학술적 깊이

### 1. Cost-Sensitive Learning

> 📄 Bahnsen, A. C., Aouada, D., & Ottersten, B. (2014). Example-dependent cost-sensitive logistic regression for credit scoring. *ICMLA*.

거래별로 다른 비용:
$$ \text{TotalCost} = \sum_{i} [c^{TP}_i + c^{FP}_i + c^{FN}_i + c^{TN}_i] $$

→ 일률적 threshold보다 효과적.

### 2. Anomaly Detection 학술

> 📄 Chandola, V., Banerjee, A., & Kumar, V. (2009). Anomaly detection: A survey. *ACM Computing Surveys*, 41(3).

### 3. Ensemble Methods

> 📄 Zareapoor, M., & Shamsolmoali, P. (2015). Application of credit card fraud detection: Based on bagging ensemble classifier. *Procedia Computer Science*, 48.

### 4. Active Learning

> 📄 Carcillo, F., et al. (2018). SCARFF: A scalable framework for streaming credit card fraud detection with Spark. *Information Fusion*, 41.

스트림 데이터 + 인간 라벨링.

---

### 🟣 [전공자 심화] — 사기 탐지 비즈니스 KPI: Cost-Sensitive Learning 과 Adversarial Fraud 의 한계·후속

#### 원논문 한계 — Elkan (2001), Bahnsen et al. (2014)

> 📄 Elkan, C. (2001). The Foundations of Cost-Sensitive Learning. *IJCAI'01* (pp. 973–978). https://cseweb.ucsd.edu/~elkan/rescale.pdf
>
> 📄 Bahnsen, A. C., Aouada, D., & Ottersten, B. (2014). Example-Dependent Cost-Sensitive Logistic Regression for Credit Scoring. *ICMLA 2014*, pp. 263–269. DOI: 10.1109/ICMLA.2014.48. https://ieeexplore.ieee.org/document/7033125

Elkan은 **class-dependent** cost matrix (FP·FN 비용이 클래스마다 고정) 기반, Bahnsen은 이를 **example-dependent** (거래별로 비용이 다름)로 확장했다. 하지만 다음 한계가 있다.

1. **비용을 사전에 안다고 가정** — 실전에서는 chargeback 금액·고객 LTV 손실·평판 손실의 화폐화 정량이 어렵다 (특히 false decline의 long-term churn 효과).
2. **시간 불변(Static) 비용** — 사기꾼 전략 변화·계절성·정책 변화에 따라 비용이 변하는 점을 무시.
3. **확률 보정(calibration) 의존** — Elkan의 rescaling 정리는 모델이 잘 보정됐다고 가정. XGBoost·DL은 일반적으로 underconfident/overconfident — Platt scaling 같은 추가 보정이 필요한데 논문에는 명시 X.
4. **Adversarial robustness 부재** — 비용 최소 threshold가 사기꾼의 회피 인센티브를 만든다는 게임이론적 시각 없음.
5. **Bahnsen의 IDCS LR** 은 logistic regression 결정함수에 비용항을 직접 박아 넣어 **non-convex** 가 되는 경우가 있어 최적화가 까다롭다.

#### 비판 문헌

- **Hand, D. J. (2009). Measuring classifier performance: a coherent alternative to the area under the ROC curve. *Machine Learning*, 77(1), 103–123.** DOI: 10.1007/s10994-009-5119-5
  - AUC가 implicit하게 분류기마다 다른 비용 분포를 가정한다는 점을 비판. 사기 탐지 KPI를 AUC만으로 평가하는 관행에 강한 경고.
- **Carlini, N., & Wagner, D. (2017). Towards Evaluating the Robustness of Neural Networks. *IEEE S&P 2017*, pp. 39–57.** arXiv:1608.04644. https://arxiv.org/abs/1608.04644
  - L₀·L₂·L∞ 세 가지 norm에 대한 attack을 제시, defensive distillation 같은 방어가 사실상 robustness를 늘리지 못함을 입증. 사기 탐지 맥락에서는 사기꾼이 거래 feature를 미세 조정해 탐지를 회피하는 evasion attack의 학술적 기반이 된다.

#### 후속 연구 동향 (2020~)

1. **Cartella, F., Anunciacao, O., Funabiki, Y., Yamaguchi, D., Akishita, T., & Elshocht, O. (2021). Adversarial Attacks for Tabular Data: Application to Fraud Detection and Imbalanced Data. *AAAI Workshop on Towards Robust, Secure and Efficient ML*.** arXiv:2101.08030. https://arxiv.org/abs/2101.08030 — 테이블형 사기 데이터에 적용 가능한 adversarial attack (LowProFool 등) 정리.
2. **Cherepanova, V. et al. (2021). LowKey: Leveraging Adversarial Attacks to Protect Social Media Users from Facial Recognition.** — 사기 탐지의 반대편(소비자 보호)에서 adversarial 사용. 한국 마이데이터·신원도용 맥락에서 prior.
3. **Cartella et al. (2023) "Adversarial Learning in Real-World Fraud Detection: Challenges and Perspectives".** arXiv:2307.01390. https://arxiv.org/abs/2307.01390 — 실전 사기 탐지에서 adversarial training의 generalization 실패와 cost-aware robust learning 필요성을 정리.
4. **Vos, D., & Verwer, S. (2022). Robust Optimal Classification Trees Against Adversarial Examples. *AAAI 2022*.** — Tree 모델의 adversarial robustness. XGBoost-heavy인 사기 탐지에 직접 적용 가능.

#### 한국 적용 시 주의점

1. **보이스피싱 비용 비대칭** — 한국 보이스피싱은 평균 피해액이 카드 CNP fraud 보다 훨씬 크다 (피해자 1인당 평균 수천만원 단위). Elkan의 클래스 단위 비용으론 부족하고, Bahnsen의 example-dependent 비용에서 cost_fn 을 거래·고객 segment 별로 차등화해야 한다.
2. **자율배상제 도입 영향** — 2024년 10월부터 시중은행권 보이스피싱 자율배상제도가 시행되면서 (아시아타임즈 2024-10-17), FN 비용이 은행 입장에서 실제로 화폐화됐다. 이전엔 피해자 부담이라 모델 비용함수에 안 들어갔다.
3. **딥페이크 adversarial 부담** — 합성 음성·얼굴이 1300%+ 급증하는 환경에서 Carlini-Wagner 식 norm-bounded attack 가정이 깨진다. **비-norm-bounded, semantic-preserving attack** (Mahmood et al. 2021 등) 을 가정하는 robust training이 필요.
4. **금융감독원 보고 의무** — Cost minimization 결과 threshold를 너무 관대하게 잡으면 SAR (의심거래보고) 누락으로 규제 리스크 발생. 비용 함수에 regulatory penalty 항을 추가해야 한다.

---

## 📚 책에 없지만 알면 좋은 것

### 🔍 보충 1 — 한국 시중은행 FDS 구조

```
[1단계] 통신사 차단 (의심 번호)
[2단계] 은행 송금 시 추가 인증
[3단계] 카뱅 GNN 분석
[4단계] 사람 검토 (의심 거래)
[5단계] 경찰 신고 (피해 발생 시)
```

### 🔍 보충 2 — Defense in Depth

군사 용어. 다층 방어:
- 한 층 뚫려도 다음 층이 막음
- 사기 탐지에도 적용
- 알리페이도 이 패턴

### 🔍 보충 3 — Champion-Challenger 패턴

```
[Champion 모델] 운영 (90% 트래픽)
[Challenger 모델] 테스트 (10% 트래픽)
   ↓
3개월 후:
   - Challenger 우월 → 교체
   - Champion 유지
```

### 🔍 보충 4 — Sliding Window

실시간 사기 탐지:
- 최근 1시간 거래
- 최근 24시간 거래
- 최근 7일 거래
- 모두 피처로 활용

### 🔍 보충 5 — Compliance Reporting

AML 의무 보고:
- SAR (Suspicious Activity Report)
- CTR (Currency Transaction Report)
- FinCEN (미국) / KFIU (한국)

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. 5단계 전략 모두 필요?

**A.** **규모에 따라 다름**.
- 시중은행: 5단계 모두
- 핀테크: 3-4단계
- 작은 회사: 1-2단계 + 외부 서비스

### Q2. 거짓 거부율 얼마가 적당?

**A.** **분야별**.
- 카드: 1~3%
- 송금: 0.5~1%
- 대출: 5~10%

### Q3. 사람 검토 인력 어떻게?

**A.**
- 의심 거래의 0.1~1%만 사람 검토
- 24/7 운영 (3교대)
- 평균 1건 처리 5~10분

### Q4. ROI 계산이 어렵다

**A.** 단순화:
- 도입 전 사기 손실
- 도입 후 사기 손실
- 차액 = 절감
- 절감 / 운영비 = ROI

### Q5. 새 모델 출시 시 위험?

**A.** **Champion-Challenger** 필수:
- 10% 트래픽 먼저 적용
- 성능 확인 후 점진적 확대
- 문제 시 즉시 롤백

---

## 🎯 §4.7+4.8 핵심 5가지

1. **5단계 전략**: 비즈니스 → 분석 → 설계 → 평가 → 개선.
2. **차단 vs. 고객 경험** 트레이드오프 — Threshold 최적화.
3. **거짓 거부** 비용도 크다 (한 건당 평균 5000원 손실).
4. **Defense in Depth** = 다층 방어 (디바이스 → 규칙 → ML → DL → 사람).
5. **사기 탐지 ROI 보통 500~1000%** — 운영비 대비 손실 절감 큼.

---

## 📖 더 읽을거리

### 전략·운영
- Bolton, R. J., & Hand, D. J. (2002). Statistical fraud detection: A review. *Statistical Science*.

### Cost-Sensitive
- Bahnsen, A. C., et al. (2014). Example-dependent cost-sensitive logistic regression. *ICMLA*.

### Active Learning
- Carcillo, F., et al. (2018). SCARFF. *Information Fusion*.

---

## 📋 검증 노트 / 변경 이력

| # | 항목 | 초기 작성본 | 수정 내용 | 1차 출처 |
|---|---|---|---|---|
| 1 | 거짓 거부 비용 산식 | "100억 건 × 3% × 5,000원 = 150억" (산수 오류, 실제 1.5조) | **1억 건 기준의 가상 시나리오 예시 계산으로 수정**; 실제 카드사 공시 수치 아님 | 가상 예시 |
| 2 | 카뱅 사기 예방 수치 | "2024년 123~385억" | 2023년 시스템·집계 범위별: 87.7억(머신러닝)/123억(AI 전체)/385억(FDS+보이스피싱); 2025년 358억 | [카카오 금융안전보고서](https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/esg/report/2023KakaoFinancialSafetyReport.pdf) |

---

> **다음** — 실습 1: 규칙 기반 사기 탐지
