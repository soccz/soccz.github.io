# 3.3 ~ 3.4 신용 리스크 관리 체계 + AI 적용 특징 — *Risk Management System & AI Perspective*

> **해설 분량**: 약 25쪽
> **읽는 데 걸리는 시간**: 약 45분

---

## 🪧 이 절을 한 줄로

> 신용 리스크 관리 시스템 = **데이터 체계 + 전략 체계 + 모델 체계** 3축.
> AI 적용 시 4가지 특징 (불균형, 해석력, 다양 모델, 결합 데이터) 이 핵심.

책은 §3.3에서 3대 체계 (데이터·전략·모델) 와 7가지 모델 (Pre/During/Post-loan), §3.4에서 AI 관점의 4가지 특징을 다룬다. 이 해설집은:
1. **시각화된 신용 리스크 관리 풀스택**
2. **모델 7종 매핑** (Pre-loan 4개 + During 3개 + Post 1개)
3. **불균형 학습 + XAI 의무** 의 실전 영향

### 📍 미리 그릴 큰 그림

<svg viewBox="0 0 760 440" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">신용 리스크 관리 풀스택 — 3체계 + 8모델</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- Data Layer -->
    <text x="380" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">① 데이터 체계 (Data Layer)</text>
    <rect x="20" y="65" width="170" height="55" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="105" y="85" text-anchor="middle" font-weight="700">CB 데이터</text>
    <text x="105" y="103" text-anchor="middle" font-size="10" fill="#57534e">NICE, KCB 점수·이력</text>
    <rect x="200" y="65" width="170" height="55" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="285" y="85" text-anchor="middle" font-weight="700">대안 데이터</text>
    <text x="285" y="103" text-anchor="middle" font-size="10" fill="#57534e">공과금, 임대료, 교육</text>
    <rect x="380" y="65" width="170" height="55" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="465" y="85" text-anchor="middle" font-weight="700">행동 데이터</text>
    <text x="465" y="103" text-anchor="middle" font-size="10" fill="#57534e">앱 사용, 클릭, 방문</text>
    <rect x="560" y="65" width="180" height="55" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="650" y="85" text-anchor="middle" font-weight="700">그래프 데이터</text>
    <text x="650" y="103" text-anchor="middle" font-size="10" fill="#57534e">소셜·거래 네트워크</text>
    <!-- Strategy Layer -->
    <text x="380" y="145" text-anchor="middle" font-size="13" font-weight="700" fill="#5a7a96">② 전략 체계 (Strategy Layer)</text>
    <rect x="40" y="155" width="160" height="55" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="120" y="178" text-anchor="middle" font-weight="700">전략 수립</text>
    <text x="120" y="195" text-anchor="middle" font-size="10" fill="#57534e">금리·한도 정책</text>
    <rect x="210" y="155" width="160" height="55" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="290" y="178" text-anchor="middle" font-weight="700">전략 검증</text>
    <text x="290" y="195" text-anchor="middle" font-size="10" fill="#57534e">백테스트·시나리오</text>
    <rect x="380" y="155" width="160" height="55" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="460" y="178" text-anchor="middle" font-weight="700">전략 평가</text>
    <text x="460" y="195" text-anchor="middle" font-size="10" fill="#57534e">KPI 모니터링</text>
    <rect x="550" y="155" width="170" height="55" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="635" y="178" text-anchor="middle" font-weight="700">전략 최적화</text>
    <text x="635" y="195" text-anchor="middle" font-size="10" fill="#57534e">피드백 → 조정</text>
    <!-- Model Layer -->
    <text x="380" y="245" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">③ 모델 체계 (Model Layer) — 8가지 ML 모델</text>
    <rect x="20" y="255" width="230" height="100" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="135" y="277" text-anchor="middle" font-weight="700" fill="#3a7d44">대출 전 (Pre-loan)</text>
    <text x="135" y="295" text-anchor="middle" font-size="10" fill="#1c1917">- 신용 사기 탐지</text>
    <text x="135" y="310" text-anchor="middle" font-size="10" fill="#1c1917">- 진입 통제</text>
    <text x="135" y="325" text-anchor="middle" font-size="10" fill="#1c1917">- 신청 평점 (Application)</text>
    <text x="135" y="340" text-anchor="middle" font-size="10" fill="#1c1917">- 한도 관리</text>
    <rect x="260" y="255" width="230" height="100" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="375" y="277" text-anchor="middle" font-weight="700" fill="#3a7d44">대출 중 (During-loan)</text>
    <text x="375" y="295" text-anchor="middle" font-size="10" fill="#1c1917">- 행동 평점 (Behavioral)</text>
    <text x="375" y="312" text-anchor="middle" font-size="10" fill="#1c1917">- 조기 경보</text>
    <text x="375" y="329" text-anchor="middle" font-size="10" fill="#1c1917">- 고객 유실 경보</text>
    <text x="375" y="346" text-anchor="middle" font-size="9" fill="#57534e">실시간 모니터링</text>
    <rect x="500" y="255" width="240" height="100" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="620" y="277" text-anchor="middle" font-weight="700" fill="#3a7d44">대출 후 (Post-loan)</text>
    <text x="620" y="295" text-anchor="middle" font-size="10" fill="#1c1917">- 추심 모델 (Collection)</text>
    <text x="620" y="315" text-anchor="middle" font-size="10" fill="#1c1917">- 회수 우선순위</text>
    <text x="620" y="332" text-anchor="middle" font-size="10" fill="#1c1917">- 재무 회복 평가</text>
    <text x="620" y="349" text-anchor="middle" font-size="9" fill="#57534e">손실 최소화</text>
    <!-- AI Features -->
    <rect x="100" y="375" width="560" height="50" rx="8" fill="#1c1917"/>
    <text x="380" y="397" text-anchor="middle" font-weight="700" fill="#fff">AI 적용 4가지 특징 (§3.4)</text>
    <text x="380" y="415" text-anchor="middle" font-size="10" fill="#fff">불균형 학습 · 해석력 의무 · 다양한 모델 · 결합 데이터 풍부</text>
  </g>
</svg>

---

## 🟢 [초급] — 3대 체계 비유

### 1. 큰 그림 — 신용 리스크 관리 = 식당 운영

식당 운영에 비유하면:

| 식당 | 신용 리스크 관리 |
|------|----------------|
| 식재료 (데이터) | CB + 대안 + 행동 + 그래프 데이터 |
| 메뉴 (전략) | 대출 상품·금리·한도 정책 |
| 셰프 (모델) | ML 모델 (사기탐지, 평점 등) |

### 2. 데이터 체계 — 4가지 데이터원

#### 데이터 ①: 개인신용평가기관 (CB) 데이터
- "전통" 데이터
- NICE 점수, KCB 점수
- 대출 이력, 카드 사용

#### 데이터 ②: 대안 데이터 (Alternative Data)
- "기존 시스템 밖" 데이터
- 공과금 납부 (전기·가스·통신)
- 임대료 납부
- 교육 수준, 직장

#### 데이터 ③: 플랫폼 행동 데이터
- "디지털 발자취"
- 앱 사용 패턴
- 웹사이트 방문 기록
- 클릭률, 체류 시간

#### 데이터 ④: 그래프 데이터
- "네트워크" 관계
- 소셜 친구 관계
- 송금 네트워크
- 직장·학교 연결

### 3. 전략 체계 — 4단계 PDCA

```
[전략 수립] → [전략 검증] → [전략 평가] → [전략 최적화]
   ↑___________________________________________|
              피드백 루프 (PDCA)
```

#### 예시: "신규 청년 대출 상품"

1. **수립**: "20~30대, 무담보 1000만원, 금리 8%"
2. **검증**: 백테스트 시뮬레이션 → 부도율 예상 5%
3. **평가**: 출시 후 6개월 → 실제 부도율 7% (예상보다 높음)
4. **최적화**: 금리 9% 또는 한도 800만원으로 조정

### 4. 모델 체계 — 대출 생애주기별 8모델

#### Pre-loan (대출 전) — 4가지

| 모델 | 역할 |
|------|------|
| **신용 사기 탐지** | "이 신청서 가짜?" |
| **진입 통제** | "기본 자격 미달?" |
| **신청 평점 (Application)** | "이 사람 점수?" |
| **한도 관리** | "얼마까지?" |

#### During-loan (대출 중) — 3가지

| 모델 | 역할 |
|------|------|
| **행동 평점 (Behavioral)** | "이 사람 현재 위험?" |
| **조기 경보** | "곧 연체할까?" |
| **고객 유실 경보** | "다른 은행 갈까?" |

#### Post-loan (대출 후) — 1가지

| 모델 | 역할 |
|------|------|
| **추심 (Collection)** | "회수 우선순위는?" |

> ✅ **여기까지 따라왔으면**: 신용 리스크 관리의 풀스택 (데이터-전략-모델) 이 보일 거다.

---

## 🟡 [중급] — 각 체계 깊이 보기

### 1. 데이터 체계 — 인프라 도구

#### 1.1 실시간 처리: Apache Kafka

```
[거래 발생] → [Kafka Topic] → [실시간 분석]
                  ↓
              [모델 호출]
                  ↓
              [의사결정]
```

#### 1.2 데이터 저장: Cloud DW

| 도구 | 특징 |
|------|------|
| **Amazon Redshift** | AWS, 페타바이트급 |
| **Google BigQuery** | 서버리스, 빠른 쿼리 |
| **Snowflake** | 멀티 클라우드 |
| **한국**: KT Cloud, Naver Cloud | 국내 규제 친화 |

#### 1.3 파이프라인: Apache Airflow

```python
from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from datetime import datetime

def collect_data():
    # CB 데이터 수집
    pass

def update_model():
    # 모델 재학습
    pass

dag = DAG('credit_pipeline', start_date=datetime(2024, 1, 1), schedule_interval='@daily')

task1 = PythonOperator(task_id='collect', python_callable=collect_data, dag=dag)
task2 = PythonOperator(task_id='update', python_callable=update_model, dag=dag)

task1 >> task2
```

#### 1.4 보안과 규제
- 데이터 암호화 (전송·저장)
- 접근 제어 (IAM)
- 감사 로그
- 개인정보보호법, 신용정보법 준수

### 2. 전략 체계 — Rule Engine 시스템

#### 2.1 Rule Engine 구조

```
[입력 데이터]
   ↓
[Rule Engine] ← [Rule Repository]
   ↓
[규칙 실행]
   ↓
[결과 (승인/거절/검토)]
```

#### 2.2 예시 규칙

```yaml
rule_1:
  condition: "신용점수 < 600"
  action: "거절"
  
rule_2:
  condition: "신용점수 >= 600 AND 부채비율 > 50%"
  action: "심사 강화"
  
rule_3:
  condition: "신용점수 >= 800 AND 연봉 > 5000만"
  action: "자동 승인 + 한도 5000만"
```

#### 2.3 주요 Rule Engine
- **Drools** (Java, 오픈소스)
- **AWS Decision Tables**
- **FICO Blaze Advisor**
- **IBM ODM**

### 3. 모델 체계 — 8가지 모델 상세

#### 3.1 Application Scoring (신청 평점)

**가장 핵심 모델**. 신청 시점 데이터로 부도 확률 예측.

```python
from xgboost import XGBClassifier
from sklearn.metrics import roc_auc_score

# 피처
features = ['age', 'income', 'debt_ratio', 'credit_score', 
            'employment_years', 'past_delinquency']

# 학습
X_train = df_train[features]
y_train = df_train['default']

model = XGBClassifier(n_estimators=200, max_depth=6)
model.fit(X_train, y_train)

# 예측
y_pred_proba = model.predict_proba(X_test)[:, 1]
auc = roc_auc_score(y_test, y_pred_proba)
print(f"AUC: {auc:.3f}")  # 보통 0.7~0.85
```

#### 3.2 Behavioral Scoring (행동 평점)

**대출 중** 행동 데이터로 미래 위험 예측.

```python
# 행동 피처
features_behav = [
    'recent_delay_count',     # 최근 연체 횟수
    'avg_balance_3m',         # 3개월 평균 잔액
    'utilization_rate',       # 한도 사용률
    'payment_amount_change',  # 결제액 변화
    'overdraft_count',         # 마이너스 통장 사용
]
```

#### 3.3 Early Warning (조기 경보)

연체 발생 **전** 위험 감지.

#### 3.4 Collection Model (추심 모델)

부도 발생 **후** 회수 우선순위:
- 회수 가능성 높은 채무자 우선
- 비용 효율적 추심 채널 선택 (전화 vs. 우편 vs. 방문)

### 4. 모델 생애주기 시각화

<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">대출 생애주기 + 모델 매핑</text>
  <line x1="40" y1="160" x2="680" y2="160" stroke="#1c1917" stroke-width="2"/>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- Pre-loan -->
    <text x="160" y="80" text-anchor="middle" font-weight="700" fill="#c4724e">대출 전 (Pre)</text>
    <rect x="60" y="100" width="200" height="40" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="160" y="125" text-anchor="middle" font-size="10">신청 → 사기탐지 → Application Score → 한도</text>
    <line x1="160" y1="140" x2="160" y2="155" stroke="#c4724e" stroke-width="2"/>
    <text x="160" y="180" text-anchor="middle" font-size="10" fill="#c4724e">⬇ 대출 승인</text>
    <!-- During-loan -->
    <text x="380" y="80" text-anchor="middle" font-weight="700" fill="#5a7a96">대출 중 (During)</text>
    <rect x="280" y="100" width="200" height="40" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="380" y="125" text-anchor="middle" font-size="10">Behavioral → 조기경보 → 이탈예측</text>
    <line x1="380" y1="140" x2="380" y2="155" stroke="#5a7a96" stroke-width="2"/>
    <text x="380" y="180" text-anchor="middle" font-size="10" fill="#5a7a96">⬇ 부도 발생 시</text>
    <!-- Post-loan -->
    <text x="600" y="80" text-anchor="middle" font-weight="700" fill="#3a7d44">대출 후 (Post)</text>
    <rect x="500" y="100" width="160" height="40" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="580" y="125" text-anchor="middle" font-size="10">Collection 모델 → 추심</text>
    <line x1="580" y1="140" x2="580" y2="155" stroke="#3a7d44" stroke-width="2"/>
    <text x="580" y="180" text-anchor="middle" font-size="10" fill="#3a7d44">⬇ 회수 완료/손실</text>
  </g>
  <text x="360" y="225" text-anchor="middle" font-size="11" font-style="italic" fill="#57534e">각 단계마다 다른 모델 사용 → 종합적 위험 관리</text>
  <text x="360" y="250" text-anchor="middle" font-size="10" fill="#57534e">한 고객이 8가지 모델의 평가를 받음</text>
</svg>

> ✅ **여기까지 따라왔으면**: 신용 리스크 관리의 풀스택과 모델 8종이 보일 거다.

---

## 🔴 [고급] — §3.4 AI 적용 특징 4가지

### 1. 특징 ①: 불균형 학습 (Class Imbalance)

#### 1.1 문제
부도 비율이 **1~5%** 수준 → 클래스 불균형.

```
[원본 데이터]
정상 (label=0): 99,000
부도 (label=1):  1,000
   비율: 99:1 → 매우 불균형
```

#### 1.2 영향
- 모델이 "모두 정상" 예측 → Accuracy 99%
- 실제로는 부도를 하나도 못 잡음
- **Accuracy 무의미**, PR-AUC·F1 사용

#### 1.3 해결 방법

##### Oversampling — SMOTE
```python
from imblearn.over_sampling import SMOTE

smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X_train, y_train)

print(f"Before: {y_train.value_counts()}")
# 0: 99000, 1: 1000
print(f"After: {pd.Series(y_resampled).value_counts()}")
# 0: 99000, 1: 99000 (균형)
```

##### Undersampling
```python
from imblearn.under_sampling import RandomUnderSampler

rus = RandomUnderSampler(random_state=42)
X_resampled, y_resampled = rus.fit_resample(X_train, y_train)

# 0: 1000, 1: 1000 → 데이터 소실 위험
```

##### Class Weight
```python
from xgboost import XGBClassifier

model = XGBClassifier(scale_pos_weight=99)  # 99:1 비율 보정
```

##### Cost-Sensitive Learning
```python
# 부도를 놓치는 비용이 10배
# False Negative cost = 10
# False Positive cost = 1
```

### 2. 특징 ②: 해석력 의무 (Explainability)

#### 2.1 왜 필수?
- 한국 금융위 AI 가이드라인 (2021.7.8): 운영 5단계 체크리스트의 핵심 항목 (4대 핵심가치 = 책임성·데이터 정확성/안전성·투명성/공정성·소비자 권리 보호)
- EU AI Act (2024): High-Risk 분류 → 설명 의무
- 미국 FCRA: 거절 시 사유 통지 의무

#### 2.2 해석 도구 비교

| 도구 | 강점 | 약점 |
|------|------|------|
| **선형 모델 계수** | 직관적 | 비선형 못 잡음 |
| **Tree Feature Importance** | 빠름 | 편향 있음 |
| **Permutation Importance** | 정확 | 느림 |
| **LIME** | 모델 무관 | 국지적만 |
| **SHAP** | 정확 + 전역/국지 | 느림 |

#### 2.3 SHAP 사용

```python
import shap

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# 1. 전역 중요도
shap.summary_plot(shap_values, X_test)

# 2. 개별 예측 설명
shap.force_plot(explainer.expected_value, shap_values[0], X_test.iloc[0])

# 3. 의존성
shap.dependence_plot('credit_score', shap_values, X_test)
```

#### 2.4 거절 사유 자동 생성

```python
def generate_reject_reason(customer_data, shap_vals, feature_names):
    """가장 부정적 SHAP 값 → 자연어 거절 사유"""
    negative_features = []
    for i, val in enumerate(shap_vals[0]):
        if val < -0.1:  # 큰 부정 영향
            negative_features.append((feature_names[i], val))
    
    # 정렬 (영향 큰 순)
    negative_features.sort(key=lambda x: x[1])
    
    # 사유 생성
    top_reason = negative_features[0][0]
    reason_map = {
        'credit_score': '신용점수가 낮습니다',
        'debt_ratio': '부채 비율이 높습니다',
        'past_delinquency': '연체 이력이 있습니다',
    }
    
    return reason_map.get(top_reason, '기타 사유로 거절되었습니다')
```

### 3. 특징 ③: 다양한 모델 필요

#### 3.1 8가지 모델 각각 다른 알고리즘

| 모델 | 추천 알고리즘 |
|------|------------|
| 신용 사기 탐지 | XGBoost + Anomaly Detection |
| Application Scoring | Logistic Regression / XGBoost |
| 한도 관리 | Regression (회귀) |
| Behavioral | LSTM (시계열) |
| 조기 경보 | XGBoost + SHAP |
| 고객 유실 | Random Forest |
| Collection | Ranking 모델 |

#### 3.2 모델 간 협업

```
[고객 데이터]
     ↓
[Application Scoring] → 부도 확률 0.1
     ↓
[Fraud Detection] → 사기 확률 0.01
     ↓
[Limit Management] → 한도 5000만 결정
     ↓
[승인 결정] → 종합 점수로 최종 판단
```

### 4. 특징 ④: 결합 가능한 데이터 풍부

#### 4.1 데이터 결합의 힘

```
[전통 데이터만]
   AUC = 0.72

[+ 대안 데이터]
   AUC = 0.78 (+0.06)

[+ 행동 데이터]
   AUC = 0.82 (+0.04)

[+ 그래프 데이터]
   AUC = 0.85 (+0.03)
```

→ 각 데이터원이 약 0.03~0.06 AUC 기여.

#### 4.2 데이터 결합 시 주의

- **중복성**: 같은 정보 다른 형태로 들어옴 → 과적합
- **결측치**: 한 소스에 없으면 처리 필요
- **시간 일관성**: 각 데이터의 업데이트 시점 다름
- **개인정보**: 마이데이터 동의 필수

> ✅ **여기까지 따라왔으면**: AI 적용 시 4가지 특징과 대응 도구가 보일 거다.

---

## 🟣 [전공자] — 학술적 깊이

### 1. 불균형 학습 학술

#### 1.1 SMOTE 원논문
> 📄 Chawla, N. V., Bowyer, K. W., Hall, L. O., & Kegelmeyer, W. P. (2002). SMOTE: Synthetic minority over-sampling technique. *Journal of Artificial Intelligence Research*, 16, 321–357.

#### 1.2 ADASYN (적응형)
> 📄 He, H., Bai, Y., Garcia, E. A., & Li, S. (2008). ADASYN: Adaptive synthetic sampling approach for imbalanced learning. *IJCNN*.

#### 1.3 Focal Loss
> 📄 Lin, T.-Y., Goyal, P., Girshick, R., He, K., & Dollár, P. (2017). Focal loss for dense object detection. *ICCV*.

분류 어려운 샘플에 더 큰 가중치:
$$ \text{FL}(p_t) = -(1-p_t)^\gamma \log(p_t) $$

### 2. 신용 평가 모델 평가 메트릭

#### 2.1 KS (Kolmogorov-Smirnov)

$$ KS = \max_t |F_{\text{good}}(t) - F_{\text{bad}}(t)| $$

```python
from scipy.stats import ks_2samp

ks_stat, p_value = ks_2samp(scores[y==0], scores[y==1])
print(f"KS Statistic: {ks_stat:.3f}")
```

**해석**:
- KS > 0.5: Excellent
- 0.4 < KS < 0.5: Good
- 0.3 < KS < 0.4: Acceptable
- KS < 0.3: Poor

#### 2.2 PSI (Population Stability Index)

모델의 안정성 (시간에 따른 분포 변화):

$$ PSI = \sum_i (P_{\text{new},i} - P_{\text{old},i}) \cdot \ln \frac{P_{\text{new},i}}{P_{\text{old},i}} $$

**해석**:
- PSI < 0.1: 안정
- 0.1 < PSI < 0.25: 약간 변화
- PSI > 0.25: 큰 변화 → 재학습 필요

### 3. XAI 학술적 발전

#### 3.1 SHAP 원논문
> 📄 Lundberg, S. M., & Lee, S.-I. (2017). A unified approach to interpreting model predictions. *NeurIPS*.

게임이론 Shapley value 응용.

#### 3.2 LIME
> 📄 Ribeiro, M. T., Singh, S., & Guestrin, C. (2016). "Why Should I Trust You?": Explaining the predictions of any classifier. *KDD*.

#### 3.3 Integrated Gradients
> 📄 Sundararajan, M., Taly, A., & Yan, Q. (2017). Axiomatic attribution for deep networks. *ICML*.

DL 모델 해석.

### 4. 신용평가 ML 벤치마크

> 📄 Lessmann, S., Baesens, B., Seow, H.-V., & Thomas, L. C. (2015). Benchmarking state-of-the-art classification algorithms for credit scoring. *EJOR*, 247(1), 124–136.

**41개 알고리즘 비교**:
1. Random Forest: 최고
2. Gradient Boosting: 2위
3. Neural Networks: 3위
4. Logistic Regression: 4위 (해석성으로 여전히 인기)
5. SVM, Naive Bayes: 중간
6. Decision Tree (단일): 하위

### 5. Graph Neural Network in Credit Risk

> 📄 Wang, D., et al. (2019). A semi-supervised graph attentive network for financial fraud detection. *IEEE ICDM*.

알리페이가 사용. 송금 그래프 분석 → 사기/부도 탐지.

---

### 🟣 [전공자 심화] — Lessmann et al. 2015 EJOR 의 한계와 후속 연구

#### 원논문 한계
- **데이터셋 8개 한정**: Australian/German/Japanese UCI + Bene1/Bene2/UK/Thomas/PAK. 모두 수천~수만 건 규모로 **현대 빅데이터(수억 건) 환경의 모형 행동을 대표 못함**.
- **시간 분리 부재**: 모든 데이터셋이 random split. OOT(Out-of-Time) 검증이 없어 concept drift 환경 성능 불명.
- **Cost-sensitive 평가 부재**: AUC/PCC/BS/H-measure 중심. 신용평가의 비대칭 비용(FN cost >> FP cost) 미반영.
- **앙상블 우승 = 운영 가능성 결론 비약**: HCES-Bag/AvgS 등 41개 모형 평균 앙상블이 LR 보다 통계적으로 유의하게 우수하나, 규제(SR 11-7, EBA) 환경에서 **41개 모형 앙상블의 모형 리스크 관리 불가능**.
- **Demšar (2006) 검정 적용은 표본 수 8개**: Friedman + Nemenyi post-hoc 의 검정력이 데이터셋 수에 강하게 의존 → 8개로는 인접 순위 모형 간 차이 검출 어려움.

#### 비판 문헌
- Demšar, J. (2006). Statistical comparisons of classifiers over multiple data sets. *Journal of Machine Learning Research*, 7, 1-30. — Friedman + Nemenyi/Bonferroni-Dunn 표준 절차 제시. 그러나 본인이 "**low power with few datasets**" 명시. https://www.jmlr.org/papers/v7/demsar06a.html
- Benavoli, A., Corani, G., Demšar, J., & Zaffalon, M. (2017). Time for a change: a tutorial for comparing multiple classifiers through Bayesian analysis. *Journal of Machine Learning Research*, 18, 1-36. — Frequentist NHST 대신 **Bayesian 신호-잡음 분리** 권장. https://www.jmlr.org/papers/v18/16-305.html
- Hand, D. J. (2009). Measuring classifier performance: a coherent alternative to the area under the ROC curve. *Machine Learning*, 77(1), 103-123. — AUC 가 **클래스별 비용 분포에 대해 분류기마다 다른 가중을 부여**한다는 incoherence 문제 제기. H-measure 제안.

#### 후속 연구 동향 (2020~)
- Gunnarsson, B. R., vanden Broucke, S., Baesens, B., Óskarsdóttir, M., & Lemahieu, W. (2021). Deep learning for credit scoring: Do or don't? *European Journal of Operational Research*, 295(1), 292-305. — DNN 이 XGBoost 대비 **유의한 우위 없음**. 작은 정형 데이터에서 GBDT 우세 재확인. https://doi.org/10.1016/j.ejor.2021.03.006
- Dastile, X., Celik, T., & Potsane, M. (2020). Statistical and machine learning models in credit scoring: A systematic literature review. *Applied Soft Computing*, 91, 106263. — 2010-2018 74개 논문 메타분석. 앙상블이 단일 모형 능가 재확인하나, **데이터셋·평가지표 표준화 부재** 가 비교 가능성을 훼손한다고 지적.
- Lessmann/Baesens 후속(IRBA framework): Roeder, J., Palmer, M., & Muntermann, J. (2022). Data-driven decision-making in credit risk management: The information value of analyst reports. *Decision Support Systems*, 158, 113770.
- Stevenson, M., Mues, C., & Bravo, C. (2021). The value of text for small business default prediction: A deep learning approach. *European Journal of Operational Research*, 295(2), 758-771. — 비정형 텍스트(loan application narrative) + BERT 가 정형 변수 단독 대비 AUC +0.039 향상.

#### Baesens 계열 벤치마크 계보
- Baesens, B., Van Gestel, T., Viaene, S., Stepanova, M., Suykens, J., & Vanthienen, J. (2003). Benchmarking state-of-the-art classification algorithms for credit scoring. *Journal of the Operational Research Society*, 54(6), 627-635. — 원조 벤치마크. SVM/LS-SVM/NN/LR/MLP/RBF 8개 데이터셋.
- Lessmann et al. (2015) — 위 후속 (41개 알고리즘, 8개 데이터셋).
- 향후 과제: 빅데이터(>100M rows), 시계열 분리, fairness metric 통합한 차세대 벤치마크 필요.

#### 한국 적용 시 주의점
- UCI German Credit (1000건) 같은 소형 벤치마크 결과를 NICE/KCB (수천만 행) 환경에 직접 외삽 금지. 규모 효과로 LR ↔ XGBoost 격차가 흔히 축소됨.
- 마이데이터 통합 후 변수 차원이 수백~수천 으로 폭증 → Lessmann 시대 가정(p ≈ 20-50) 깨짐. L1/L2 정규화 + IV 사전 필터 표준화 필요.
- 한국 시중은행은 **단일 LR 스코어카드 + ML 보조 (Champion-Challenger)** 가 표준. 41개 앙상블은 모형 거버넌스(금감원 모범규준 2018) 통과 불가.

---

### 🟣 [전공자 심화] — SMOTE (Chawla 2002) 의 한계와 후속 연구

#### 원논문 한계
- **k-NN 기반 선형 보간 → boundary contamination**: 소수 클래스 샘플과 그 k-최근접 이웃 간 선형 보간. 이웃이 다수 클래스와 가까우면 **합성 샘플이 결정경계를 침범**.
- **노이즈/이상치 증폭**: 소수 클래스 outlier 가 그대로 SMOTE 의 seed 로 사용되어 합성 샘플로 outlier 영역이 확대.
- **고차원에서의 무의미성**: 차원의 저주 → k-NN 거리가 모든 점에서 비슷해져 보간이 의미 없는 점 생성 (Blagus & Lusa 2013 BMC Bioinformatics).
- **범주형 변수 미지원**: 원본 SMOTE 는 연속형 전용. SMOTE-NC (nominal-continuous) 가 별도 필요.
- **train-test 누설 위험**: SMOTE 를 fit 전체에 적용하면 test set 정보가 train 으로 새어 들어감. **반드시 CV fold 내부에서만** 적용해야 한다는 점이 원논문에 불명확.

#### 비판 문헌
- He, H., & Garcia, E. A. (2009). Learning from imbalanced data. *IEEE Transactions on Knowledge and Data Engineering*, 21(9), 1263-1284. — SMOTE 류 oversampling 의 한계와 cost-sensitive learning/ensemble 의 대안 종합 리뷰.
- Blagus, R., & Lusa, L. (2013). SMOTE for high-dimensional class-imbalanced data. *BMC Bioinformatics*, 14, 106. — **고차원에서 SMOTE 는 분류성능을 향상시키지 못함** 실증.
- Elor, Y., & Averbuch-Elor, H. (2022). To SMOTE, or not to SMOTE? *arXiv:2201.08528*. — **현대 강한 분류기(XGBoost, LightGBM)에서 SMOTE 효과 미미**. https://arxiv.org/abs/2201.08528
- Hassanat, A. B., Tarawneh, A. S., Altarawneh, G. A., & Almuhaimeed, A. (2022). On the failure of the SMOTE-related approach to handle class imbalance in regards to noisy and small datasets. *arXiv:2206.09147*.

#### 후속 연구 동향 — SMOTE 변종
- **Borderline-SMOTE**: Han, H., Wang, W.-Y., & Mao, B.-H. (2005). Borderline-SMOTE: A new over-sampling method in imbalanced data sets learning. *ICIC 2005* (LNCS 3644), 878-887. — "DANGER 그룹"(과반수 이웃이 다수 클래스인 소수 샘플) 에만 SMOTE 적용.
- **ADASYN**: He, H., Bai, Y., Garcia, E. A., & Li, S. (2008). ADASYN: Adaptive synthetic sampling approach for imbalanced learning. *IJCNN 2008*, 1322-1328. — 학습 난이도 가중치로 합성 샘플 개수 가변. https://ieeexplore.ieee.org/document/4633969
- **SMOTE-ENN / SMOTE-Tomek**: Batista, G. E. A. P. A., Prati, R. C., & Monard, M. C. (2004). A study of the behavior of several methods for balancing machine learning training data. *SIGKDD Explorations*, 6(1), 20-29. — 합성 후 ENN/Tomek-link 로 노이즈 제거.

#### Cost-sensitive 대안 (SMOTE 우회)
- **Focal Loss**: Lin, T.-Y., Goyal, P., Girshick, R., He, K., & Dollár, P. (2017). Focal loss for dense object detection. *ICCV 2017*, 2980-2988. — FL(p_t) = -(1-p_t)^gamma log(p_t). 쉬운 음성 샘플의 손실 기여를 down-weight.
- **Class-balanced Loss**: Cui, Y., Jia, M., Lin, T.-Y., Song, Y., & Belongie, S. (2019). Class-balanced loss based on effective number of samples. *CVPR 2019*, 9268-9277. — Effective number (1 - beta^n)/(1 - beta) 로 재가중.
- **Cost-sensitive XGBoost**: `scale_pos_weight` 파라미터로 양성 클래스 그라디언트 가중. SMOTE 없이 동등/우수 성능 (Elor & Averbuch-Elor 2022).
- Bahnsen, A. C., Aouada, D., & Ottersten, B. (2014). Example-dependent cost-sensitive logistic regression for credit scoring. *ICMLA 2014*, 263-269. — 샘플별 비용(승인 한도·LGD 비례) 명시적 손실 함수.

#### 한국 적용 시 주의점
- 한국 시중은행 신용평가 데이터의 부도율은 통상 1-5%. **극단 불균형(<0.1%) 아님** → SMOTE 효과 제한적, scale_pos_weight 로 충분.
- 신용카드 사기는 0.1% 수준 → SMOTE 고려 가치 있으나 Borderline-SMOTE/ADASYN + ENN 후처리 권장.
- 마이데이터 환경에서 합성 샘플의 **개인정보 재식별 가능성** 미정: 익명화된 데이터에서 SMOTE 가 원본 근사 → 차분 프라이버시 결합 (DP-SMOTE) 검토.

---

### 🟣 [전공자 심화] — SHAP (Lundberg-Lee 2017) 의 한계와 후속 연구

#### 원논문 한계
- **계산 복잡도 #P-hard**: 정확한 Shapley value 계산은 2^n 부분집합 평가 → KernelSHAP 은 표본 근사. TreeSHAP 만 트리 모형에서 O(TLD^2) 다항시간.
- **Feature independence 가정**: KernelSHAP 의 marginal expectation 은 **변수 독립** 가정 위에서 정의됨. 신용평가처럼 변수 상관관계 강한 경우 잘못된 attribution.
- **Off-manifold 평가**: 결합분포 외부의 가짜 데이터(예: 소득 1000만 + 부채 10억) 에서 모형을 평가 → 외삽 오류.
- **인과성 부재**: Shapley value 는 상관관계 기반 attribution 일 뿐 인과적 설명 아님. Janzing et al. (2020) 가 정면 비판.
- **TreeSHAP path-dependent vs interventional 모순**: Lundberg-Erion-Lee (2020 *Nat. Mach. Intell.*) 의 TreeSHAP "path-dependent" 모드는 conditional expectation 을 근사하나, Janzing 등은 interventional 이 옳다고 주장.

#### 비판 문헌
- Janzing, D., Minorics, L., & Blöbaum, P. (2020). Feature relevance quantification in explainable AI: A causal problem. *AISTATS 2020*, PMLR 108, 2907-2916. — **observational conditional vs interventional conditional 구분 부재** 가 SHAP 의 핵심 결함이라고 주장. unconditional(=interventional) 이 올바른 baseline 이라고 결론. http://proceedings.mlr.press/v108/janzing20a.html
- Sundararajan, M., & Najmi, A. (2020). The many Shapley values for model explanation. *ICML 2020*, PMLR 119, 9269-9278. — Baseline/conditional/Aumann-Shapley 등 여러 변형이 다 다른 값을 주며, "옳은" 정의가 무엇인지에 대한 통일된 답이 없음을 명시.
- Kumar, I. E., Venkatasubramanian, S., Scheidegger, C., & Friedler, S. (2020). Problems with Shapley-value-based explanations as feature importance measures. *ICML 2020*, PMLR 119, 5491-5500. — Shapley 의 인간 직관(local accuracy, fairness) 과 ML 해석의 정합성 부재.
- Slack, D., Hilgard, S., Jia, E., Singh, S., & Lakkaraju, H. (2020). Fooling LIME and SHAP: Adversarial attacks on post hoc explanation methods. *AIES 2020*, 180-186. — **SHAP/LIME 설명은 적대적 학습으로 위조 가능** → 차별 모형을 정상으로 위장 가능.
- Aas, K., Jullum, M., & Løland, A. (2021). Explaining individual predictions when features are dependent: More accurate approximations to Shapley values. *Artificial Intelligence*, 298, 103502. — 변수 의존성을 고려한 Gaussian/Copula/Empirical conditional 추정. https://doi.org/10.1016/j.artint.2021.103502

#### 후속 연구 동향 (2020~)
- **TreeSHAP 확장**: Lundberg, S. M., Erion, G., Chen, H., DeGrave, A., Prutkin, J. M., Nair, B., Katz, R., Himmelfarb, J., Bansal, N., & Lee, S.-I. (2020). From local explanations to global understanding with explainable AI for trees. *Nature Machine Intelligence*, 2, 56-67. https://www.nature.com/articles/s42256-019-0138-9
- **Causal Shapley Values**: Heskes, T., Sijben, E., Bucur, I. G., & Claassen, T. (2020). Causal Shapley values: Exploiting causal knowledge to explain individual predictions of complex models. *NeurIPS 2020*. — Pearl do-calculus 결합. https://proceedings.neurips.cc/paper/2020/hash/32e54441e6382a7fbacbbbaf3c450059-Abstract.html
- **Shapley Interactions (SHAP-IQ)**: Muschalik, M., Baniecki, H., Fumagalli, F., Kolpaczki, P., Hammer, B., & Hüllermeier, E. (2024). shapiq: Shapley interactions for machine learning. *NeurIPS 2024 Datasets and Benchmarks Track*. arXiv:2410.01649. https://arxiv.org/abs/2410.01649 — 2차 이상 상호작용 attribution.
- **SHAP 의 #P-hardness 재확인**: Arenas, M., Barceló, P., Bertossi, L., & Monet, M. (2023). The tractability of SHAP-scores over deterministic and decomposable Boolean circuits. *AAAI 2023*. — 깊은 트리/Boolean circuit 에서도 정확 SHAP 계산은 일반적으로 어려움.
- **SHAP 신뢰성 부정 결과**: Marques-Silva, J., & Huang, X. (2024). Explainability is NOT a game. *Communications of the ACM*. — Shapley 기반 설명이 형식논리적 설명(formal abductive explanation) 과 정합성 없음을 증명.

#### 한국 적용 시 주의점
- **금융위 AI 가이드라인 (2021.7)** 의 "설명가능성" 요건 충족 도구로 SHAP 표준화. 단, **거절 사유 자연어 변환**은 별도 LLM/룰 필요.
- **상관관계 강한 변수**(예: 신용카드 사용액 / 신용카드 한도) 가 흔함 → KernelSHAP 의 독립가정 위반. TreeSHAP path-dependent 또는 Aas et al. (2021) 의 empirical conditional 권장.
- **모형 거버넌스**: 금감원 모범규준은 "변수 기여도" 보고 의무. SHAP global mean(|phi|) 가 표준 산출물이나, Janzing 비판 고려해 **interventional / conditional 어느 쪽인지 명시** 필요.
- **개인정보**: SHAP 값 공개 시 역추론 위험(membership inference). 한국 신정법상 가명정보 처리 시 SHAP local explanation 노출 범위 검토 필요.

---

## 📚 책에 없지만 알면 좋은 것

### 🔍 보충 1 — 한국 금융권 신용평가 시스템 실태

#### 시중은행
- **자체 모델 + NICE/KCB 점수** 결합
- 일반 신용대출: Logistic Regression 기반 스코어카드
- 신규 모델: 점진적으로 XGBoost 도입

#### 인터넷전문은행 (카뱅, 케뱅, 토뱅)
- **처음부터 ML/AI 중심**
- 대안 데이터 적극 활용
- 마이데이터 연동
- 자동 승인율 70%+

#### 핀테크 (토스, 뱅크샐러드)
- 마이데이터 + 자체 모델
- 대출 비교 + 자체 추천

### 🔍 보충 2 — Stress Test와 신용 리스크

#### 정기 스트레스 테스트
한국은 매년 금감원이 시중은행 대상:
- 시나리오: 경기 침체, 부동산 폭락, 환율 폭등
- 손실 추정
- 자본 충당 여부 검증

#### Reverse Stress Test
"어떤 시나리오면 우리가 망하나?" 역추론.

### 🔍 보충 3 — Vintage Analysis

대출 발행 시기별 부도율 추적:

```
2020 발행 대출의 24개월 누적 부도율
2021 발행 대출의 24개월 누적 부도율
...

→ 시기별 비교로 모델 안정성 평가
```

### 🔍 보충 4 — Champion-Challenger

#### 운영 중 모델 교체 방식
```
[Champion 모델] 운영 중 (70% 트래픽)
[Challenger 모델] 새 모델 (30% 트래픽)
   ↓
6개월 후:
   - Challenger가 더 나으면 → 교체
   - 비슷하면 → 유지
```

#### A/B Test 와의 차이
A/B Test: 둘 비교 후 선택
Champion-Challenger: **항상 새 모델 시도 (점진적 진화)**

### 🔍 보충 5 — Federated Learning in Credit

여러 은행이 데이터 안 공유하고 모델만 협업:
- 각 은행 로컬 학습
- 모델 파라미터만 교환
- 글로벌 모델 업데이트

→ **개인정보 보호 + 협업 학습** 동시 가능.

한국에서 금융보안원이 시범 사업 (2022~).

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. 8개 모델 다 만들어야 하나?

**A.** **금융기관 규모에 따라 다름**.

- 시중은행: 8개 모두 (필수)
- 인터넷전문은행: 6-7개
- 핀테크 (BNPL): 3-4개 (사기, Application, 한도)
- 대안 평가 회사: Application 중심

### Q2. SHAP가 정말 거절 사유로 쓰일 수 있나?

**A.** **사용되고 있음**.

- 미국 FCRA: 거절 시 "신용점수가 낮음" 같은 사유 의무
- 한국: 금융위 가이드라인 (2021) 이후 SHAP 도입 가속화
- 단, **자동 자연어 생성** 은 추가 가공 필요

### Q3. SMOTE가 실전에서도 좋은가?

**A.** **상황별 다름**.

좋을 때:
- 클래스 비율 1:100 이상 극단
- 데이터가 충분

나쁠 때:
- 합성 샘플이 비현실적
- 모델이 합성 패턴에 과적합

**대안**: Class Weight, Cost-Sensitive Learning 도 검토.

### Q4. Rule Engine을 ML로 완전 대체?

**A.** **부분 대체**. 이유:
- 규제 요구 (특정 조건 거절 의무)
- 빠른 응답 (ML 모델 호출 비용)
- 명확성 (규제기관 요구)

→ **Rule + ML 하이브리드** 가 표준.

### Q5. 행동 평점이 왜 어려운가?

**A.** **시계열 + 동적 변화** 때문.

- Application Scoring: 한 시점 데이터 (정적)
- Behavioral Scoring: 6~12개월 행동 (동적)
- LSTM 같은 시퀀스 모델 필요

### Q6. 추심 모델은 누가 사용?

**A.** 사용처:
- 시중은행 채권관리부
- 신용회복위원회
- 대부업체
- 자산관리회사 (KAMCO)

### Q7. 한국 신용평가가 미국보다 발달했나?

**A.** **부분적으로 발달**.

- 인프라: 한국 우위 (오픈뱅킹, 마이데이터)
- AI 도입: 비슷
- 데이터 다양성: 미국 우위 (CB 3사 경쟁)
- 신용 사각지대 해소: 한국 점진적 개선

---

## 🎯 이 절에서 가져갈 핵심 7가지

1. **3대 체계**: 데이터 (CB+대안+행동+그래프) + 전략 (PDCA) + 모델 (8가지).
2. **8가지 모델** = Pre-loan 4개 + During-loan 3개 + Post-loan 1개.
3. **AI 적용 4특징**: 불균형 학습·해석력 의무·다양 모델·결합 데이터.
4. **SMOTE / Class Weight / Cost-sensitive** 가 불균형 해결책.
5. **SHAP** 이 금융 AI 해석의 표준.
6. **KS·PSI·Gini·AUC** 가 모델 평가 표준.
7. **Rule + ML 하이브리드** 가 한국 금융권 표준.

---

## 📖 더 읽을거리

### 신용 리스크 시스템
- Bessis, J. (2015). *Risk Management in Banking* (4th ed.). Wiley.
- Joseph, C. (2013). *Advanced Credit Risk Analysis and Management*. Wiley.

### 불균형 학습
- He, H., & Garcia, E. A. (2009). Learning from imbalanced data. *IEEE TKDE*, 21(9).
- Krawczyk, B. (2016). Learning from imbalanced data: open challenges and future directions. *Progress in Artificial Intelligence*, 5.

### XAI
- Molnar, C. (2024). *Interpretable Machine Learning* (2nd ed.). — 무료 PDF.
- Barocas, S., Hardt, M., & Narayanan, A. (2023). *Fairness and Machine Learning*.

### 그래프 신경망 + 금융
- Wang, D., et al. (2019). A semi-supervised graph attentive network for financial fraud detection. *IEEE ICDM*.

### 한국 자료
- 한국신용정보원 보고서.
- 금융감독원. *모델 리스크 관리 모범규준* (2018).
- 금융위. *AI 가이드라인* (2021).

---

> **다음 절 예고** — §3.5 신용 평가 모델 평가 지표
> KS, PSI, 정밀도/재현율, AUC-ROC 4가지 지표 상세 + 코드.
