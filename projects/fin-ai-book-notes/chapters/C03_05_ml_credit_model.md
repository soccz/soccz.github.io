# 3.7 ~ 3.8 머신러닝 기반 신용 평가 모델 개발 + 마무리 — *ML Credit Model + Summary*

> **원서 위치**: 김태헌, 《금융 AI의 이해》(제이펍, 2024), §3.7 (pp.143–161), §3.8 (p.161)
> **원서 분량**: 약 19쪽
> **해설 분량**: 약 35쪽 (이론 + 코드)
> **읽는 데 걸리는 시간**: 약 60분

---

## 🪧 이 절을 한 줄로

> 머신러닝 기반 신용평가 모델의 **전체 개발 파이프라인** (데이터 → 피처 → 모델 → 평가 → 스코어링 → 배포 → 모니터링) 을 한 번에.

책은 §3.7에서 7단계 파이프라인을 다룬다. 이 해설집은:
1. **각 단계의 핵심 + 코드**
2. **WoE/IV + Logistic 스코어카드** 완전 풀이
3. **XGBoost 신용평가** 실전
4. **모니터링 (Data Drift)** 가이드

### 📍 신용평가 모델 개발 7단계

<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">ML 신용평가 모델 개발 — 7단계 파이프라인</text>
  <defs>
    <marker id="ar3" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#1c1917"/></marker>
  </defs>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- Stage 1 -->
    <rect x="20" y="80" width="100" height="80" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="70" y="105" text-anchor="middle" font-weight="700" fill="#c4724e">① 데이터</text>
    <text x="70" y="123" text-anchor="middle" font-size="10" fill="#1c1917">불균형</text>
    <text x="70" y="138" text-anchor="middle" font-size="10" fill="#1c1917">결측치</text>
    <text x="70" y="153" text-anchor="middle" font-size="10" fill="#1c1917">특잇값</text>
    <line x1="120" y1="120" x2="150" y2="120" stroke="#1c1917" stroke-width="2" marker-end="url(#ar3)"/>
    <!-- Stage 2 -->
    <rect x="160" y="80" width="100" height="80" rx="8" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="210" y="105" text-anchor="middle" font-weight="700" fill="#5a7a96">② 피처</text>
    <text x="210" y="123" text-anchor="middle" font-size="10" fill="#1c1917">WoE/IV</text>
    <text x="210" y="138" text-anchor="middle" font-size="10" fill="#1c1917">구간화</text>
    <text x="210" y="153" text-anchor="middle" font-size="10" fill="#1c1917">선택</text>
    <line x1="260" y1="120" x2="290" y2="120" stroke="#1c1917" stroke-width="2" marker-end="url(#ar3)"/>
    <!-- Stage 3 -->
    <rect x="300" y="80" width="100" height="80" rx="8" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="350" y="105" text-anchor="middle" font-weight="700" fill="#3a7d44">③ 모델</text>
    <text x="350" y="123" text-anchor="middle" font-size="10" fill="#1c1917">LR/XGB</text>
    <text x="350" y="138" text-anchor="middle" font-size="10" fill="#1c1917">DL</text>
    <text x="350" y="153" text-anchor="middle" font-size="10" fill="#1c1917">학습</text>
    <line x1="400" y1="120" x2="430" y2="120" stroke="#1c1917" stroke-width="2" marker-end="url(#ar3)"/>
    <!-- Stage 4 -->
    <rect x="440" y="80" width="100" height="80" rx="8" fill="#f5e6f0" stroke="#7a6a9a"/>
    <text x="490" y="105" text-anchor="middle" font-weight="700" fill="#7a6a9a">④ 평가</text>
    <text x="490" y="123" text-anchor="middle" font-size="10" fill="#1c1917">KS/AUC</text>
    <text x="490" y="138" text-anchor="middle" font-size="10" fill="#1c1917">P/R/F1</text>
    <text x="490" y="153" text-anchor="middle" font-size="10" fill="#1c1917">XAI</text>
    <line x1="540" y1="120" x2="570" y2="120" stroke="#1c1917" stroke-width="2" marker-end="url(#ar3)"/>
    <!-- Stage 5 -->
    <rect x="580" y="80" width="160" height="80" rx="8" fill="#fef9e7" stroke="#8a6d2c"/>
    <text x="660" y="105" text-anchor="middle" font-weight="700" fill="#8a6d2c">⑤ 스코어링</text>
    <text x="660" y="123" text-anchor="middle" font-size="10" fill="#1c1917">PD → 점수</text>
    <text x="660" y="138" text-anchor="middle" font-size="10" fill="#1c1917">PDO + Base</text>
    <text x="660" y="153" text-anchor="middle" font-size="10" fill="#1c1917">예: 300~850</text>
    <!-- Stage 6/7 -->
    <rect x="160" y="200" width="240" height="80" rx="8" fill="#fff" stroke="#c4724e" stroke-width="2"/>
    <text x="280" y="225" text-anchor="middle" font-weight="700" fill="#c4724e">⑥ 배포</text>
    <text x="280" y="245" text-anchor="middle" font-size="10" fill="#57534e">Cloud · On-prem · Edge</text>
    <text x="280" y="263" text-anchor="middle" font-size="10" fill="#57534e">Online vs. Batch</text>
    <rect x="440" y="200" width="240" height="80" rx="8" fill="#fff" stroke="#3a7d44" stroke-width="2"/>
    <text x="560" y="225" text-anchor="middle" font-weight="700" fill="#3a7d44">⑦ 모니터링</text>
    <text x="560" y="245" text-anchor="middle" font-size="10" fill="#57534e">Data Drift · PSI · Concept Drift</text>
    <text x="560" y="263" text-anchor="middle" font-size="10" fill="#57534e">Alibi Detect, Evidently</text>
  </g>
</svg>

---

## 🟢 [초급] — 데이터 준비의 3가지 함정

### 1. 불균형 데이터 (Imbalanced Data)

부도 비율 보통 1~5% → 매우 불균형.

**6가지 해결책** (책 본문):
1. 적절한 평가 지표 (Precision/Recall/F1/AUC)
2. Over/Under-sampling
3. Class Weight
4. 층화 교차 검증
5. 층화 추출 (stratified split)
6. 데이터 증강 (주의)

### 2. 특잇값 (Special Values)

신용평가 데이터의 특수 값:
- `NaN`: 결측
- `inf`, `-inf`: 무한대
- `-9999`, `8888`: CB 특별 코드

**처리**: 데이터 제공사 확인 → 별도 카테고리 또는 결측치 처리.

### 3. 결측치 (Missing Values)

3가지 종류:
- **MCAR** (완전 무작위): 단순 삭제 OK
- **MAR** (조건부 무작위): 다중 대체
- **MNAR** (비무작위): 패턴 분석 필요

```python
# 평균 대체
df['income'].fillna(df['income'].mean(), inplace=True)

# 모델 기반 대체 (KNN)
from sklearn.impute import KNNImputer
imputer = KNNImputer(n_neighbors=5)
X_imputed = imputer.fit_transform(X)
```

> ✅ **여기까지 따라왔으면**: 데이터 준비의 3가지 핵심 함정과 해결책이 보일 거다.

---

## 🟡 [중급] — WoE / IV 완전 풀이

### 1. WoE (Weight of Evidence)

#### 1.1 정의

각 구간별 **부도율 vs. 정상율 의 로그비**.

수식:
$$ \text{WoE}_i = \ln \left( \frac{P(\text{Good}_i)}{P(\text{Bad}_i)} \right) $$

또는 (책의 정의):
$$ \text{WoE}_i = \ln \left( \frac{\text{불량}_i / \text{전체 불량}}{\text{우량}_i / \text{전체 우량}} \right) $$

#### 1.2 책 표 3-6 풀이 — 나이 변수의 WoE

| 나이 | 우량 분포(%) | 불량 분포(%) | WoE(%) | IV |
|------|----------|-----------|--------|-----|
| -17 | 2.33 | 4.12 | -57.28 | 0.0103 |
| 18-22 | 8.42 | 24.74 | -107.83 | 0.1760 |
| 23-26 | 13.62 | 27.84 | -71.47 | 0.1016 |
| 27-29 | 22.43 | 23.20 | -3.38 | 0.0003 |
| 30-35 | 26.30 | 12.89 | +71.34 | 0.0957 |
| 36-43 | (생략) | | | |

**해석**:
- 18-22세: WoE = -1.08 (매우 위험)
- 30-35세: WoE = +0.71 (매우 안전)
- → 나이가 강력한 예측 변수

#### 1.3 Python 코드 — WoE 계산

```python
import pandas as pd
import numpy as np

def calculate_woe(df, feature, target, bins=10):
    """WoE 계산"""
    # 구간화 (qcut으로 분위수 기반)
    df['bin'] = pd.qcut(df[feature], q=bins, duplicates='drop')
    
    # 전체 우량/불량 수
    total_good = (df[target] == 0).sum()
    total_bad = (df[target] == 1).sum()
    
    # 구간별 집계
    grouped = df.groupby('bin').agg(
        good=(target, lambda x: (x == 0).sum()),
        bad=(target, lambda x: (x == 1).sum())
    )
    
    # 분포
    grouped['good_pct'] = grouped['good'] / total_good
    grouped['bad_pct'] = grouped['bad'] / total_bad
    
    # WoE (log(우량/불량))
    grouped['woe'] = np.log((grouped['good_pct'] + 1e-10) / (grouped['bad_pct'] + 1e-10))
    
    return grouped
```

### 2. IV (Information Value)

#### 2.1 정의

WoE의 가중 합:

$$ IV = \sum_i (P(\text{Good}_i) - P(\text{Bad}_i)) \times \text{WoE}_i $$

#### 2.2 해석 기준

| IV 값 | 예측력 |
|-------|--------|
| < 0.02 | 무의미 |
| 0.02 ~ 0.1 | 약함 |
| 0.1 ~ 0.3 | 보통 |
| 0.3 ~ 0.5 | 강함 |
| > 0.5 | **의심** (과적합) |

#### 2.3 코드

```python
def calculate_iv(grouped):
    """IV 계산 (위 calculate_woe 결과 사용)"""
    grouped['iv_part'] = (grouped['good_pct'] - grouped['bad_pct']) * grouped['woe']
    iv = grouped['iv_part'].sum()
    return iv

# 사용
woe_df = calculate_woe(df, 'age', 'default', bins=10)
iv = calculate_iv(woe_df)
print(f"Age IV: {iv:.3f}")
```

### 3. WoE 변환과 Logistic Regression

#### 3.1 WoE 변환의 장점

```
[원본 데이터]              [WoE 변환]
- 다양한 스케일            - 모두 동일 스케일
- 비선형 관계              - 선형화
- 이상치 영향              - 영향 감소
- 결측치 별도              - 별도 구간으로 처리
```

#### 3.2 변환 후 Logistic Regression

```python
from sklearn.linear_model import LogisticRegression

# WoE 변환된 데이터로 학습
X_woe = woe_transform(X)  # WoE 변환
model = LogisticRegression()
model.fit(X_woe, y)

# 결과 해석 쉬움
for feature, coef in zip(features, model.coef_[0]):
    print(f"{feature}: {coef:.3f}")
```

### 4. OptBinning 라이브러리

#### 4.1 자동 최적 구간화

```python
from optbinning import OptimalBinning

# 단일 변수
optb = OptimalBinning(name='age', dtype='numerical')
optb.fit(df['age'], df['default'])

# 시각화
optb.binning_table.build()
optb.binning_table.plot(metric='woe')

# 변환
X_age_woe = optb.transform(df['age'], metric='woe')
```

#### 4.2 BinningProcess (다변수)

```python
from optbinning import BinningProcess

# 모든 변수 한번에
variable_names = ['age', 'income', 'debt_ratio', ...]
binning_process = BinningProcess(variable_names)
binning_process.fit(X, y)

# WoE 변환
X_transformed = binning_process.transform(X)
```

> ✅ **여기까지 따라왔으면**: WoE/IV가 신용평가의 핵심 도구임을 알게 됐을 거다.

---

## 🔴 [고급] — 스코어카드 + 신용점수 변환

### 1. 스코어카드 (Scorecard) — 전통 신용평가의 표준

#### 1.1 정의

> Logistic Regression + WoE → 사람이 읽을 수 있는 **점수표**.

```
[고객 신청서]                [스코어카드]              [총점]
- 나이 25           →   나이 25-29: +20점
- 소득 4천          →   소득 3-5천: +15점
- 부채 0            →   부채 0: +30점
- 신용점수 750      →   CB 700-800: +40점
                        ──────────────
                        총점: 105점 + Base 500 = 605점
```

#### 1.2 PDO와 Base Score

**PDO** (Points to Double the Odds): Odds를 2배로 만드는 점수 증가량.

예시:
- PDO = 20
- Base Score = 600
- Target Odds = 50:1 (정상:부도)
- → 점수가 20 올라가면 odds가 100:1로 증가

#### 1.3 점수 계산 공식

$$ \text{Factor} = \frac{\text{PDO}}{\ln(2)} $$
$$ \text{Offset} = \text{Base Score} - \text{Factor} \times \ln(\text{Target Odds}) $$
$$ \text{Score} = \text{Offset} + \text{Factor} \times \ln(\text{Odds}) $$

#### 1.4 변수별 점수 분배

각 변수의 기여도:
$$ \text{Score}_i = -(\beta_i \times \text{WoE}_i) \times \text{Factor} + \frac{\text{Offset}}{n} $$

#### 1.5 책 예시 풀이

3변수 (수입, 나이, 가입 기간) 모델:
- 계수: 0.5, 0.3, 0.1
- WoE: 0.2, 0.1, 0.05
- 각 변수 점수: 0.1, 0.03, 0.005
- 총점: 0.135
- Factor = 20/ln(2) ≈ 28.85
- Offset = 600
- 최종 점수 = 600 + 28.85 × ln(1 + exp(0.135)) ≈ **622점**

### 2. 머신러닝 모델 → 신용 점수 변환

#### 2.1 XGBoost 확률 → 점수

```python
def proba_to_score(proba, base_score=600, pdo=20, target_odds=50):
    """모델 확률을 신용 점수로 변환"""
    odds = (1 - proba) / proba  # 정상/부도 비율
    factor = pdo / np.log(2)
    offset = base_score - factor * np.log(target_odds)
    score = offset + factor * np.log(odds)
    return score.round().astype(int)

# 사용
y_pred_proba = model.predict_proba(X_test)[:, 1]
credit_scores = proba_to_score(y_pred_proba)

# 분포
print(f"점수 범위: {credit_scores.min()} ~ {credit_scores.max()}")
print(f"평균: {credit_scores.mean():.0f}")
```

### 3. 모델 선택 가이드

#### 3.1 모델별 장단점

| 모델 | 장점 | 단점 | 적합 상황 |
|------|------|------|---------|
| **Logistic Regression** | 해석 쉬움, 빠름 | 비선형 한계 | 규제 친화 |
| **XGBoost** | 비선형 강함 | 과적합 위험 | 최고 성능 |
| **LightGBM** | 빠름, 메모리 효율 | 작은 데이터 약함 | 대규모 |
| **CatBoost** | 범주형 잘 처리 | 느림 | 범주 多 |
| **TabNet** | DL, 자동 피처 학습 | 해석 어려움 | 대규모 + 비정형 |

#### 3.2 한국 시중은행 선택 가이드
- **소비자 대출**: Logistic Regression (해석성)
- **신용카드**: XGBoost (성능)
- **소상공인**: XGBoost + 대안 데이터
- **챗봇/마케팅**: LightGBM (빠른 응답)

### 4. 모델 해석력 — 4가지 접근

#### 4.1 Local Interpretability (개별 예측)
- **LIME**: 국지 선형 근사
- **SHAP**: Shapley value (전역+국지)
- **Counterfactual**: "이걸 바꾸면 어떻게 될까?"

#### 4.2 Global Interpretability (전체)
- **Feature Importance**
- **Partial Dependence Plot (PDP)**
- **SHAP Summary Plot**

#### 4.3 코드

```python
import shap

# SHAP
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# 전역
shap.summary_plot(shap_values, X_test)

# 개별 (거절 사유 생성)
shap.force_plot(explainer.expected_value, shap_values[0], X_test.iloc[0])

# 의존성
shap.dependence_plot('income', shap_values, X_test)
```

#### 4.4 거절 사유 자동 생성

```python
def get_rejection_reason(model, customer_data, feature_names):
    """가장 부정적인 SHAP 값으로 거절 사유"""
    shap_values = shap.TreeExplainer(model).shap_values(customer_data)
    
    # 부정적 SHAP (점수 깎는 요인)
    negative = [(name, val) for name, val in zip(feature_names, shap_values[0]) if val < 0]
    negative.sort(key=lambda x: x[1])
    
    reasons = []
    reason_map = {
        'credit_score': "신용점수가 낮습니다",
        'debt_ratio': "부채 비율이 높습니다",
        'employment_years': "근속 기간이 짧습니다",
        'past_delinquency': "과거 연체 이력이 있습니다",
    }
    
    for name, val in negative[:3]:  # 상위 3개
        if name in reason_map:
            reasons.append(reason_map[name])
    
    return reasons
```

> ✅ **여기까지 따라왔으면**: 스코어카드와 ML 모델의 점수 변환까지 마스터.

---

## 🟣 [전공자] — 배포와 모니터링

### 1. 배포 (Deployment) 4가지 방법

#### 1.1 클라우드 (Cloud)
- **AWS SageMaker**: ML 전용 플랫폼
- **GCP Vertex AI**: Google
- **Azure ML**: Microsoft

장점: 확장성, 관리 편함
단점: 비용, 한국 금융권 규제

#### 1.2 온프레미스 (On-premise)
- 자체 서버
- 보안 강력
- 한국 금융권 표준

#### 1.3 엣지 (Edge)
- 스마트폰, ATM
- 빠른 응답
- 신용평가엔 드뭄

#### 1.4 모델 서버
- **TensorFlow Serving**
- **NVIDIA Triton**
- **Seldon Core**

### 2. 배포 타입: Online vs. Batch

| | Online (실시간) | Batch (배치) |
|---|---|---|
| 응답 | 밀리초 | 시간/일 |
| 활용 | Application Scoring | Behavioral Scoring |
| 인프라 | API 서버 | Spark/Airflow |
| 비용 | 높음 | 낮음 |
| 예시 | 대출 즉시 심사 | 매일 밤 위험 평가 |

### 3. 모니터링 — 3가지 Data Drift

#### 3.1 Covariate Shift (공변량 시프트)

> "**입력 분포** 가 바뀜"

예: 코로나 → 소비 패턴 변화 → 카드 사용 분포 변화

```python
# PSI로 감지
psi = calculate_psi(X_train['amount'], X_recent['amount'])
if psi > 0.25:
    print("⚠ Covariate Shift!")
```

#### 3.2 Label Shift (레이블 시프트)

> "**출력 분포** 가 바뀜"

예: 경기 침체 → 부도율 1% → 3% 상승

```python
# Train 부도율 vs. 최근 부도율
train_default_rate = y_train.mean()
recent_default_rate = y_recent.mean()
print(f"Train: {train_default_rate:.2%}, Recent: {recent_default_rate:.2%}")
```

#### 3.3 Concept Drift (개념 드리프트)

> "**입력 → 출력 관계** 가 바뀜"

예: 새 신용평가 기준 도입 → 같은 데이터도 다른 결과

→ 가장 어려운 감지.

### 4. 모니터링 도구

#### 4.1 Alibi Detect

```python
from alibi_detect.cd import KSDrift

# Train 데이터 기준
cd = KSDrift(X_train, p_val=0.05)

# 새 데이터 체크
preds = cd.predict(X_new)
print(f"Drift Detected: {preds['data']['is_drift']}")
```

#### 4.2 Evidently AI

```python
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset

report = Report(metrics=[DataDriftPreset()])
report.run(reference_data=X_train, current_data=X_new)
report.save_html('drift_report.html')
```

#### 4.3 자동 재학습

```python
def auto_retrain(model, X_train, X_new, y_new, psi_threshold=0.25):
    """PSI 기반 자동 재학습"""
    psi = calculate_psi(X_train, X_new)
    
    if psi > psi_threshold:
        print("재학습 시작...")
        new_model = clone(model)
        new_model.fit(X_new, y_new)
        
        # 성능 비교 후 교체
        if evaluate(new_model) > evaluate(model):
            return new_model
    
    return model
```

### 5. 책의 한계 5가지

#### 한계 ①: A/B Testing 미언급
모델 교체 시 점진적 A/B 테스트 표준. 책에 없음.

#### 한계 ②: Champion-Challenger 패턴 미언급
운영 모델 (Champion) + 도전 모델 (Challenger) 병렬 운영.

#### 한계 ③: Federated Learning 미언급
여러 은행 협업 학습 (개인정보 보호).

#### 한계 ④: 모델 버전 관리 미언급
MLflow, DVC 같은 도구.

#### 한계 ⑤: 비용 효율성 미언급
모델 호출 비용 (GPU 추론) 고려.

---

### 🟣 [전공자 심화] — EU AI Act 와 신용평가 High-Risk 규제

#### 1차 법령 출처
- **Regulation (EU) 2024/1689** — 2024년 6월 13일 EU 의회·이사회 채택, 2024년 8월 1일 발효. 신용평가 관련 의무는 2026년 8월 2일부터 적용.
  - 공식 EUR-Lex: https://eur-lex.europa.eu/eli/reg/2024/1689/oj
- **Annex III, Point 5(b)**: "AI systems intended to be used **to evaluate the creditworthiness of natural persons or establish their credit score**, with the exception of AI systems used for the purpose of detecting financial fraud."
- **Article 6(2)**: Annex III 에 열거된 AI 시스템 = **High-Risk**.

#### 사업자가 충족해야 할 7가지 의무 (Articles 8-15)
- **Article 9**: 위험관리 시스템(생애주기 전체).
- **Article 10**: 훈련/검증/테스트 데이터의 품질·대표성·편향 평가.
- **Article 11**: 기술 문서(technical documentation) — 모형 카드, 학습 절차, 평가 결과.
- **Article 12**: 자동 로깅(audit log) — 부도확률 산출 이력 추적 가능.
- **Article 13**: 사용자(=deployer)에 대한 투명성·정보 제공.
- **Article 14**: **인간 감독 (human oversight)** — 자동 거절에 대한 인간 개입 기능.
- **Article 15**: 정확성·강건성·사이버보안.

#### 비판 문헌
- Smuha, N. A., Ahmed-Rengers, E., Harkens, A., Li, W., MacLaren, J., Piselli, R., & Yeung, K. (2021). How the EU can achieve legally trustworthy AI: A response to the European Commission's proposal for an AI Act. *LEADS Lab Working Paper*. SSRN: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3899991 — Article 14 의 "human oversight" 가 형식적 의무에 그칠 위험.
- Veale, M., & Borgesius, F. Z. (2021). Demystifying the Draft EU Artificial Intelligence Act. *Computer Law Review International*, 22(4), 97-112. — Annex III 의 범위 모호성, 자기인증(self-assessment) 의존의 위험성.
- Edwards, L. (2022). Regulating AI in Europe: Four problems and four solutions. *Ada Lovelace Institute Report*. — fundamental rights impact assessment(FRIA, Art. 27) 미흡.

#### BIS/BCBS 의 모형 리스크 거버넌스
- BCBS. (2024). *Digitalisation of finance*. https://www.bis.org/bcbs/publ/d575.htm — AI/ML 사용 시 explainability, governance, financial stability 3대 축.
- BCBS. Newsletter on artificial intelligence and machine learning (Mar 2024). https://www.bis.org/publ/bcbs_nl27.htm — 신용 모형의 ML 사용에서 모형 리스크 강화 권고.
- Crisanto, J. C., Leuterio, C. B., Prenio, J., & Yong, J. (2024). Regulating AI in the financial sector: recent developments and main challenges. *FSI Insights on policy implementation*, no 63, December 2024. https://www.bis.org/fsi/publ/insights63.pdf — EU AI Act 와 미국 SR 11-7, 영국 PRA SS1/23, 싱가포르 FEAT 비교.
- Perez-Cruz, F., Prenio, J., Restoy, F., & Yong, J. (2025). Managing explanations: How regulators can address AI explainability. *BIS Occasional Paper*. https://www.bis.org/fsi/fsipapers24.pdf — 신용·보험 등 high-stakes 분야의 설명가능성 강제.
- 미국 Fed/OCC. (2011). *SR 11-7 / OCC 2011-12 Supervisory Guidance on Model Risk Management*. https://www.federalreserve.gov/supervisionreg/srletters/sr1107.htm — Conceptual soundness + Ongoing monitoring + Outcomes analysis 3축. AI/ML 모형도 동일 적용.
- EBA. (2023). *Final Report on Machine Learning for IRB Models*. EBA/REP/2023/28. https://www.eba.europa.eu/ — IRB(내부등급법) PD 모형에서 ML 사용 시 explainability/validation 추가 요건.

#### 후속 연구 동향 (2023~)
- Hacker, P., Engel, A., & Mauer, M. (2023). Regulating ChatGPT and other large generative AI models. *FAccT 2023*, 1112-1123. — 생성AI 와 AI Act 의 상호작용. 신용평가 LLM 활용 시 dual classification(GPAI + high-risk).
- Mökander, J., Schuett, J., Kirk, H. R., & Floridi, L. (2024). Auditing large language models: A three-layered approach. *AI and Ethics*, 4, 1085-1115.
- Bartlett, R., Morse, A., Stanton, R., & Wallace, N. (2022). Consumer-lending discrimination in the FinTech era. *Journal of Financial Economics*, 143(1), 30-56. https://doi.org/10.1016/j.jfineco.2021.05.047 — 핀테크 알고리즘이 인종별 금리 차별을 30% 감소시키나 여전히 잔존.

#### 한국 시중은행 적용 시 모델 거버넌스 변화
- **금감원 모범규준 (2018) "모델 리스크 관리"** 가 SR 11-7 변형. 검증·모니터링·outcomes analysis 3축은 동일.
- **금융위 AI 가이드라인 (2021.7.8)** + **금융분야 AI 개발·활용 안내서 (2022.8)**: 책임성·정확성·공정성·소비자권리 보장 4대 원칙. 신용평가는 "고위험" 분류.
- EU AI Act 발효(2026.8) 후 **EU 시장 진출 한국 핀테크** (예: 카카오뱅크 글로벌 진출 시) 는 conformity assessment(부합성 평가) 의무. 적합성 평가 기관(notified body) 또는 내부통제 기반.
- **한국 vs EU 차이**:
  - 한국: 자율 가이드라인 + 신정법/개인정보법 결합. fines 규모 작음.
  - EU: 최대 전세계 매출 7% 벌금 (Art. 99). High-risk system 비준수는 최대 3500만 유로.
- **한국 IRB 은행 (4대 시중은행)** 의 PD 모형이 ML 도입 시 EBA 2023 Final Report 와 BIS BCBS 권고 양쪽을 참조. 금감원은 2024-2025년 "AI 활용 신용평가 모형 검증 가이드라인" 개정 작업 중.
- **FRIA (Fundamental Rights Impact Assessment, Art. 27)**: 은행은 deployer 로서 FRIA 의무. 한국 은행이 EU 자회사 운영 시 별도 절차 필요.

#### 한국 적용 시 실무 체크리스트
1. **모형 인벤토리**: 신용평가 ML 모형 전부 등록 (모형 ID, 소유자, 검증주기).
2. **Data lineage**: 학습 데이터 출처·수집 시점·전처리 로그.
3. **Bias testing**: 성별/연령/지역별 KS/AUC 차이 검정.
4. **Drift monitoring**: PSI(월별), characteristic stability index(변수별).
5. **Human override**: 자동 거절의 인간 재검토 경로(SLA 명시).
6. **Audit log**: 모든 신청 건의 (input, score, decision, explanation) 보관 (Art. 12, EU AI Act).
7. **Adverse action notice**: 미국 ECOA/Reg B 와 동등 — 거절 사유 자연어 설명. SHAP/scorecard reason code 활용.

---

## 📚 책에 없지만 알면 좋은 것

### 🔍 보충 1 — Reject Inference 코드

```python
def reject_inference(model, X_approved, y_approved, X_rejected):
    """거절 데이터에 추정 라벨 부여"""
    # 1차 모델로 거절 데이터 예측
    predicted_default = model.predict_proba(X_rejected)[:, 1]
    
    # 임계값 기준 라벨 (Augmentation)
    estimated_y = (predicted_default > 0.5).astype(int)
    
    # 2차 모델 학습 (승인 + 거절 데이터 합침)
    X_combined = pd.concat([X_approved, X_rejected])
    y_combined = pd.concat([y_approved, pd.Series(estimated_y)])
    
    # 거절 데이터에 낮은 가중치
    sample_weight = [1.0] * len(X_approved) + [0.3] * len(X_rejected)
    
    new_model = XGBClassifier()
    new_model.fit(X_combined, y_combined, sample_weight=sample_weight)
    
    return new_model
```

### 🔍 보충 2 — Calibration

ML 모델 확률 보정:

```python
from sklearn.calibration import CalibratedClassifierCV

# Platt Scaling
calibrated = CalibratedClassifierCV(model, method='sigmoid', cv='prefit')
calibrated.fit(X_val, y_val)

# Isotonic Regression
calibrated_iso = CalibratedClassifierCV(model, method='isotonic', cv='prefit')
calibrated_iso.fit(X_val, y_val)

# 보정 곡선
from sklearn.calibration import calibration_curve
prob_true, prob_pred = calibration_curve(y_test, y_pred_proba, n_bins=10)
```

### 🔍 보충 3 — Federated Learning

```python
# FATE (Federated AI Technology Enabler) 또는 Flower 같은 프레임워크
# 각 은행은 로컬 학습, 파라미터만 교환

import flwr as fl

class CreditClient(fl.client.NumPyClient):
    def get_parameters(self):
        return [w for w in self.model.coef_]
    
    def fit(self, parameters, config):
        self.model.coef_ = parameters
        self.model.fit(self.X_train, self.y_train)
        return self.get_parameters(), len(self.X_train), {}
```

### 🔍 보충 4 — MLOps 도구

| 도구 | 역할 |
|------|------|
| **MLflow** | 모델 실험 추적 |
| **DVC** | 데이터 버전 관리 |
| **Kubeflow** | ML 파이프라인 |
| **Weights & Biases** | 실험 시각화 |
| **Prefect / Airflow** | 워크플로 자동화 |

### 🔍 보충 5 — Fair Lending Compliance

미국 ECOA / 한국 금융위 가이드라인 준수:

```python
from fairlearn.metrics import demographic_parity_difference

# 인종/성별 그룹 간 승인율 차이
dp_diff = demographic_parity_difference(
    y_true=y_test, 
    y_pred=y_pred, 
    sensitive_features=df_test['gender']
)
print(f"Demographic Parity Difference: {dp_diff:.3f}")
# 0에 가까울수록 공정
```

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. Logistic Regression이 XGBoost보다 인기?

**A.** **규제 + 해석성** 때문.

- 한국 금융감독원 모델리스크 관리 모범규준: 모델 변경 시 **내부 검증·문서화·사후 점검** 의무 (일반적인 "사전 신고 의무"는 아니며, 중대한 신용평가 모델 교체는 별도 신고/심사 절차가 적용)
- LR: 계수 명확 → 변경 영향 분석 쉬움
- XGBoost: 블랙박스 → 설명 어려움

> ⚠ 정정: 초기 작성본은 "모델 변경 시 사전 보고" 의무를 단정했으나, 금감원 모범규준은 검증/문서화/사후 점검 중심이며 사전 신고 의무는 모델 종류·규모에 따라 다르다.

→ **신규 모델은 XGBoost로 검증 후 LR로 단순화** 가 일반적.

### Q2. WoE 변환이 진짜 필요?

**A.** **Logistic Regression엔 필수, XGBoost엔 선택**.

- LR: WoE로 비선형성 보완
- XGBoost: 자체적으로 비선형 학습 → WoE 안 해도 OK

### Q3. PDO를 왜 20으로?

**A.** **업계 관행**. 의미:
- PDO 20: 점수 20점 차이 = Odds 2배 차이
- 너무 작으면 점수 변별력 떨어짐
- 너무 크면 점수 의미 약함

### Q4. 거절 사유 자동 생성 정말 쓰이나?

**A.** **미국에서는 표준 (FCRA 의무)**.

- "Adverse Action Notice": 신용 거절 시 사유 통지 의무
- 한국은 점진적 도입 중 (금융위 가이드라인)

### Q5. Concept Drift 감지가 어렵다는데?

**A.** **간접적으로 감지**:
- Performance Drop (정확도 ↓)
- 라벨 분포 변화 (Label Shift)
- Feature 중요도 변화

→ **정기 재학습 (월/분기)** 이 안전한 대응.

### Q6. 클라우드 vs. 온프레미스 — 한국 금융권은?

**A.** **혼합** 추세.

- 금융감독원: 비중요 시스템 클라우드 허용 (2019~)
- 시중은행: 60~70% 온프레미스
- 인터넷은행 (카뱅): 100% AWS

### Q7. 신용평가 모델 한 번 만들면 끝?

**A.** **절대 아니다**. 평균 수명:
- 6개월: 첫 PSI 체크
- 12~18개월: 재학습 권장
- 24개월: 강제 재학습 (한국 표준)

---

## 🎯 §3.7~3.8 핵심 10가지

1. **신용평가 모델 7단계**: 데이터 → 피처 → 모델 → 평가 → 스코어링 → 배포 → 모니터링.
2. **불균형 데이터 6가지 해결**: 메트릭, sampling, weight, CV, stratify, augmentation.
3. **WoE = 구간별 우량/불량 로그비**, IV = WoE 가중 합.
4. **IV 0.02~0.5** 가 사용 가능 범위 (그 이상은 의심).
5. **스코어카드** = LR + WoE → Base Score + Factor × ln(Odds).
6. **PDO** = Odds 2배 만드는 점수 (보통 20).
7. **모델 선택**: 해석성 → LR, 성능 → XGBoost.
8. **XAI** (SHAP) 가 거절 사유 자동 생성에 필수.
9. **3가지 Data Drift**: Covariate, Label, Concept.
10. **모델 수명 12-18개월** → 정기 재학습 필요.

---

## 📖 더 읽을거리

### 신용평가 모델링 표준
- Siddiqi, N. (2017). *Intelligent Credit Scoring* (2nd ed.). Wiley. — **바이블**.
- Thomas, L. C. (2009). *Consumer Credit Models*. Oxford UP.

### ML 라이브러리
- OptBinning: https://optbinning.io/
- TOAD (Tencent): https://toad.readthedocs.io/
- SHAP: https://shap.readthedocs.io/
- Alibi Detect: https://docs.seldon.io/projects/alibi-detect/

### MLOps
- MLflow: https://mlflow.org/
- Evidently AI: https://evidentlyai.com/

### Fairness
- Fairlearn: https://fairlearn.org/
- AIF360 (IBM): https://aif360.res.ibm.com/

---

> **다음 절 예고** — 실습 1: 밑바닥부터 시작하는 ML 신용 평가 모델 개발
> Kaggle American Express + XGBoost.
