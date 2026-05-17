# 실습 1: 규칙 기반 사기 거래 탐지 — *Lab 1: Rule-Based Fraud Detection*

> **원서 위치**: 김태헌, 《금융 AI의 이해》(제이펍, 2024), 실습 1 (pp.219~)
> **원서 분량**: 약 15쪽
> **해설 분량**: 약 18쪽
> **소요 시간**: 2~4시간

---

## 🪧 이 실습을 한 줄로

> **Faker 라이브러리로 합성 거래 데이터 생성** → **IF-THEN 규칙으로 사기 탐지** → 한계 인식 → ML로 진화.

책은 합성 데이터 + 단순 규칙으로 시작. 이 해설집은:
1. **Faker 데이터 생성 풀이**
2. **규칙 5종 작성**
3. **규칙의 한계** + ML 동기

### 📍 흐름

<svg viewBox="0 0 760 220" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">Lab 1 — 규칙 기반 사기 탐지 흐름</text>
  <defs>
    <marker id="ar6" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#1c1917"/></marker>
  </defs>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <rect x="20" y="80" width="150" height="80" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="95" y="105" text-anchor="middle" font-weight="700" fill="#c4724e">① 합성 데이터</text>
    <text x="95" y="125" text-anchor="middle" font-size="10" fill="#1c1917">Faker</text>
    <text x="95" y="143" text-anchor="middle" font-size="10" fill="#57534e">1000건, 100건 사기</text>
    <line x1="170" y1="120" x2="200" y2="120" stroke="#1c1917" stroke-width="2" marker-end="url(#ar6)"/>
    <rect x="210" y="80" width="150" height="80" rx="8" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="285" y="105" text-anchor="middle" font-weight="700" fill="#5a7a96">② 규칙 정의</text>
    <text x="285" y="125" text-anchor="middle" font-size="10" fill="#1c1917">5가지 IF-THEN</text>
    <text x="285" y="143" text-anchor="middle" font-size="10" fill="#57534e">금액·IP·시간 등</text>
    <line x1="360" y1="120" x2="390" y2="120" stroke="#1c1917" stroke-width="2" marker-end="url(#ar6)"/>
    <rect x="400" y="80" width="150" height="80" rx="8" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="475" y="105" text-anchor="middle" font-weight="700" fill="#3a7d44">③ 적용</text>
    <text x="475" y="125" text-anchor="middle" font-size="10" fill="#1c1917">데이터에 규칙 적용</text>
    <text x="475" y="143" text-anchor="middle" font-size="10" fill="#57534e">사기 후보 식별</text>
    <line x1="550" y1="120" x2="580" y2="120" stroke="#1c1917" stroke-width="2" marker-end="url(#ar6)"/>
    <rect x="590" y="80" width="150" height="80" rx="8" fill="#f5e6f0" stroke="#7a6a9a"/>
    <text x="665" y="105" text-anchor="middle" font-weight="700" fill="#7a6a9a">④ 평가</text>
    <text x="665" y="125" text-anchor="middle" font-size="10" fill="#1c1917">정확도 + Recall</text>
    <text x="665" y="143" text-anchor="middle" font-size="10" fill="#57534e">한계 인식</text>
  </g>
</svg>

---

## 🟢 [초급] — Faker 합성 데이터

### 1. Faker 라이브러리

```bash
pip install faker
```

```python
from faker import Faker
fake = Faker()
Faker.seed(738)

# 예시
print(fake.uuid4())          # '4134ac65-17af-...'
print(fake.ipv4())           # '192.168.1.1'
print(fake.country_code())   # 'KR'
print(fake.currency_code())  # 'USD'
print(fake.time())           # '14:23:45'
```

### 2. 데이터 생성 함수 (책 본문)

```python
import pandas as pd
import numpy as np
import random
from faker import Faker

# 시드 설정 (재현성)
seed = 738
random.seed(seed)
np.random.seed(seed)
fake = Faker()
Faker.seed(seed)

def create_sample_data(num_samples=1000, num_frauds=100):
    """합성 거래 데이터 생성"""
    data = []
    
    for _ in range(num_samples):
        row = {
            'transaction_number': fake.uuid4(),
            'transaction_amount': round(random.uniform(5.0, 10000.0), 2),
            'is_domestic_ip': random.choice([True, False]),
            'transaction_ip': fake.ipv4(),
            'recent_7d_amount': round(random.uniform(5.0, 78000.0), 2),
            'recent_7d_payment_methods': random.randint(1, 5),
            'account_age_days': random.randint(1, 3650),
            'transaction_time': fake.time(),
            'country_code': fake.country_code(),
            'currency_code': fake.currency_code(),
            'customer_age': random.randint(18, 80),
            'account_balance': round(random.uniform(0.0, 50000.0), 2),
            'num_past_transactions': random.randint(0, 100),
            'device_id': fake.uuid4(),
            'payment_method': random.choice(['credit_card', 'debit_card', 'paypal', 'bank_transfer']),
            'is_new_account': random.choice([True, False]),
            'has_promo_code': random.choice([True, False]),
            'shipping_address_change': random.choice([True, False]),
            'num_recent_login_failures': random.randint(0, 10),
            'label': 0,  # 대부분 정상
        }
        data.append(row)
    
    # 100건을 사기로 변경
    df = pd.DataFrame(data)
    fraud_indices = random.sample(range(num_samples), num_frauds)
    df.loc[fraud_indices, 'label'] = 1
    
    return df

# 사용
df = create_sample_data(1000, 100)
print(f"Shape: {df.shape}")
print(f"사기 비율: {df['label'].mean():.2%}")
df.head()
```

### 3. EDA — 기본 확인

```python
# 사기 vs. 정상 비교
print(df.groupby('label')['transaction_amount'].describe())

# 시각화
import matplotlib.pyplot as plt
import seaborn as sns

fig, axes = plt.subplots(2, 2, figsize=(12, 8))

# 금액 분포
sns.boxplot(data=df, x='label', y='transaction_amount', ax=axes[0, 0])
axes[0, 0].set_title('Amount by Label')

# 로그인 실패
sns.boxplot(data=df, x='label', y='num_recent_login_failures', ax=axes[0, 1])
axes[0, 1].set_title('Login Failures by Label')

# 신규 계정
sns.countplot(data=df, x='is_new_account', hue='label', ax=axes[1, 0])
axes[1, 0].set_title('New Account')

# 도메스틱 IP
sns.countplot(data=df, x='is_domestic_ip', hue='label', ax=axes[1, 1])
axes[1, 1].set_title('Domestic IP')

plt.tight_layout()
plt.show()
```

> ✅ **여기까지 따라왔으면**: 합성 데이터로 사기 탐지 환경 준비 완료.

---

## 🟡 [중급] — 규칙 5종 작성

### 1. 규칙 ① — 큰 금액 + 신규 계정

```python
def rule_1(row):
    """큰 금액 + 신규 계정 (예: 책은 $5,080 임계값; 한국 맥락 의역 1,000만원)"""
    # 책 원문: transaction_amount > 5080  (USD 기준 데이터셋)
    # 한국 의역: 1,000만원 (KRW)
    return row['transaction_amount'] > 10_000_000 \
           and row['account_age_days'] < 30

df['rule_1'] = df.apply(rule_1, axis=1).astype(int)
print(f"Rule 1 탐지: {df['rule_1'].sum()}건")
```

### 2. 규칙 ② — 해외 IP + 큰 금액

```python
def rule_2(row):
    """해외 IP + 500달러 초과"""
    return not row['is_domestic_ip'] and row['transaction_amount'] > 500

df['rule_2'] = df.apply(rule_2, axis=1).astype(int)
```

### 3. 규칙 ③ — 로그인 실패 多 + 새 거래

```python
def rule_3(row):
    """최근 로그인 실패 5회 이상 + 신규 결제 수단"""
    return row['num_recent_login_failures'] >= 5 \
           and row['recent_7d_payment_methods'] >= 3

df['rule_3'] = df.apply(rule_3, axis=1).astype(int)
```

### 4. 규칙 ④ — 새벽 시간 + 큰 금액

```python
def rule_4(row):
    """새벽 (0-6시) + 5000달러 초과"""
    hour = int(row['transaction_time'].split(':')[0])
    return (0 <= hour < 6) and row['transaction_amount'] > 5000

df['rule_4'] = df.apply(rule_4, axis=1).astype(int)
```

### 5. 규칙 ⑤ — 7일간 거래 폭증

```python
def rule_5(row):
    """7일 거래액 70000달러 초과 (정상의 거의 한계)"""
    return row['recent_7d_amount'] > 70_000

df['rule_5'] = df.apply(rule_5, axis=1).astype(int)
```

### 6. 통합 — 어느 규칙이라도 매칭하면 사기 의심

```python
rules = ['rule_1', 'rule_2', 'rule_3', 'rule_4', 'rule_5']
df['fraud_predicted'] = df[rules].max(axis=1)

print(f"전체 사기 의심: {df['fraud_predicted'].sum()}건")
print(f"실제 사기: {df['label'].sum()}건")
```

> ✅ **여기까지 따라왔으면**: 규칙 기반 사기 탐지 시스템 완성.

---

## 🔴 [고급] — 규칙 평가와 한계

### 1. 성능 평가

```python
from sklearn.metrics import precision_score, recall_score, f1_score, classification_report

y_true = df['label']
y_pred = df['fraud_predicted']

print(f"Precision: {precision_score(y_true, y_pred):.3f}")
print(f"Recall: {recall_score(y_true, y_pred):.3f}")
print(f"F1: {f1_score(y_true, y_pred):.3f}")

print("\n", classification_report(y_true, y_pred))
```

### 2. Confusion Matrix

```python
from sklearn.metrics import confusion_matrix
import seaborn as sns

cm = confusion_matrix(y_true, y_pred)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=['Normal', 'Fraud'],
            yticklabels=['Normal', 'Fraud'])
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.show()
```

### 3. 규칙별 기여도

```python
# 각 규칙이 잡은 사기 비율
for rule in rules:
    detected = df[df[rule] == 1]
    true_fraud = detected['label'].sum()
    total = len(detected)
    print(f"{rule}: {true_fraud}/{total} ({true_fraud/total*100:.1f}% 진짜 사기)")
```

### 4. 규칙 기반의 한계

#### 한계 ①: 새 사기 못 잡음
- 사기꾼이 5가지 규칙 피하면 안 잡힘
- "1000만원 → 999만원" 으로 회피

#### 한계 ②: 거짓 양성 (False Positive) 多
- 합법 거래도 규칙에 걸림
- 고객 불편 증가

#### 한계 ③: 유지보수 비용
- 사기 패턴 변할 때마다 규칙 수정
- 사람 의존

#### 한계 ④: 비선형 패턴 못 잡음
- "금액 + 시간 + IP" 조합 패턴
- 단순 IF-THEN으론 어려움

#### 한계 ⑤: 규칙 충돌
- 여러 규칙이 모순될 때

> ✅ **규칙 기반 → ML로 진화 동기**: 위 한계가 ML의 존재 이유.

---

## 🟣 [전공자] — 규칙 + ML 하이브리드

### 1. Rule Engine + ML 결합

```python
def hybrid_fraud_detection(transaction, ml_model):
    """규칙 + ML 결합"""
    
    # 1. 규칙 기반 (즉시 차단)
    if transaction['amount'] > 50_000_000:  # 5천만원 초과 - 즉시 차단
        return 'BLOCK', '대규모 거래'
    
    if transaction['login_failures'] > 10:
        return 'BLOCK', '로그인 실패 다발'
    
    # 2. ML 모델
    proba = ml_model.predict_proba(transaction)[0, 1]
    
    if proba > 0.8:
        return 'BLOCK', f'ML 사기 확률 {proba:.2f}'
    elif proba > 0.5:
        return 'REVIEW', f'ML 의심 {proba:.2f}'
    else:
        return 'APPROVE', '정상'
```

### 2. Drools (Rule Engine)

```python
# Drools는 Java 기반 룰 엔진
# Python에서는 pyke, durable_rules 등 사용

# 또는 단순 dict 기반
rules_config = {
    'rule_1': {
        'condition': lambda x: x['amount'] > 10_000_000,
        'action': 'review',
        'priority': 1
    },
    'rule_2': {
        'condition': lambda x: not x['is_domestic_ip'] and x['amount'] > 500,
        'action': 'block',
        'priority': 2
    }
}

def evaluate_rules(transaction, rules):
    results = []
    for name, rule in sorted(rules.items(), key=lambda x: x[1]['priority']):
        if rule['condition'](transaction):
            results.append({'rule': name, 'action': rule['action']})
            if rule['action'] == 'block':
                break  # 최우선 규칙
    return results
```

### 3. 규칙 자동 학습 (Decision Tree)

```python
from sklearn.tree import DecisionTreeClassifier, export_text

# 학습
features = ['transaction_amount', 'is_domestic_ip', 'account_age_days',
            'num_recent_login_failures', 'recent_7d_amount']
X = df[features]
y = df['label']

tree = DecisionTreeClassifier(max_depth=3, random_state=42)
tree.fit(X, y)

# 규칙 추출
rules_text = export_text(tree, feature_names=features)
print(rules_text)

# 출력 예:
# |--- transaction_amount > 8000
# |   |--- is_domestic_ip = False
# |   |   |--- class: 1 (사기)
# |--- transaction_amount <= 8000
# |   |--- num_recent_login_failures > 7
# |   |   |--- class: 1 (사기)
```

→ Decision Tree로 **데이터에서 규칙 자동 발견**.

---

### 🟣 [전공자 심화] — 규칙 기반 vs ML 한계: expert system 비판과 ML 전환의 학술적 토대

#### 원논문 한계 — Davis (1982)

> 📄 Davis, R. (1982). Expert Systems: Where Are We? And Where Do We Go from Here? *AI Magazine*, 3(2). https://ojs.aaai.org/aimagazine/index.php/aimagazine/article/view/367

Davis는 expert system이 좁은 도메인에서 성공했지만 다음 문제를 가진다고 1982년에 이미 정리했다 (이른바 expert system winter의 학술적 진단).

1. **Brittleness** — 규칙이 정의된 영역 바로 밖에서 graceful degradation 없음. 사기 패턴이 한 글자만 달라져도 룰 실패.
2. **Knowledge Acquisition Bottleneck** — 전문가 인터뷰로 룰을 뽑는 비용이 룰 수에 따라 super-linear로 증가.
3. **Maintenance Explosion** — 룰 간 모순·우선순위·conflict resolution이 룰 100개를 넘으면 사실상 관리 불가.
4. **No Learning** — 새 패턴을 만나면 모델이 스스로 적응하지 못함 (사기 탐지의 concept drift에 치명적).
5. **Implicit Knowledge 표현 불가** — 룰로 표현하기 어려운 perceptual·tacit knowledge (예: "이 거래는 어딘가 이상하다" 라는 베테랑 심사역의 직관) 인코딩 불가.

이 5가지는 1990년대 expert system 쇠퇴와 2000년대 statistical ML 부상의 직접 동기가 된다 (Bolton-Hand 2002 도 같은 진단).

#### 비판 문헌

- **Domingos, P. (2012). A Few Useful Things to Know About Machine Learning. *Communications of the ACM*, 55(10), 78–87.** DOI: 10.1145/2347736.2347755. https://homes.cs.washington.edu/~pedrod/papers/cacm12.pdf
  - Davis의 expert system 진단에 대응되는 12 가지 ML "folk wisdom" 을 정리. 사기 탐지 룰 → ML 전환 시 직접 적용되는 교훈:
    1. *"Generalization counts"* — Train 성능보다 unseen fraud pattern 성능.
    2. *"Data alone is not enough"* — 룰(=도메인 지식)을 features·priors로 인코딩해야 ML이 잘 동작.
    3. *"Overfitting has many faces"* — Lab 1 의 룰 5개도 일종의 hard overfit; ML 모델은 soft overfit.
    4. *"Feature engineering is the key"* — 룰을 그대로 binary feature로 만들어 ML에 입력하는 hybrid가 강력.
    5. *"Simplicity does not imply accuracy"* — IF-THEN이 단순하다고 항상 robust한 건 아니다.
- **Wagstaff, K. L. (2012). Machine Learning that Matters. *ICML 2012*.** arXiv:1206.4656 — ML 연구가 toy benchmark에 갇혀 실전 영향이 적다는 비판. 사기 탐지처럼 비용함수가 명확한 도메인이 오히려 ML의 가치를 입증하는 장.

#### Drools/Faker 라이브러리의 학술·실무 한계

- **Drools (JBoss/Red Hat)** — Rete algorithm (Forgy 1982, *Artificial Intelligence* 19(1))에 기반. 룰 1만 개까지는 ms 단위 매칭 가능하지만, 룰 간 conflict resolution이 declarative하지 않아 디버깅이 어렵다. 최근 (2020+) Red Hat 자체도 Drools 8 부터 의사결정 부분을 DMN (Decision Model and Notation) 표준으로 이전, 점차 cloud-native rule engine으로 대체되는 추세.
- **Faker** — 통계적 분포 일치성이 보장되지 않는다. 사기 patterns의 **결합 분포** (예: "큰 금액 + 해외 IP + 새벽" 의 joint distribution)를 못 만들기 때문에, Faker로 만든 데이터로 학습한 모델은 실데이터에서 가짜 robustness를 보일 수 있다. CTGAN (Xu et al. 2019, *NeurIPS*) 같은 deep tabular synthesizer가 학술적으로 권장된다.

#### 후속 연구 동향 (2020~)

1. **Neuro-Symbolic Fraud Detection** — 룰 + DL 결합. Hitzler et al. (2022) "Neuro-symbolic approaches in artificial intelligence" *National Science Review*. https://doi.org/10.1093/nsr/nwac035
2. **Differentiable Rule Learning** — Wang et al. (2021) "Learning Interpretable Rules for Multi-Label Classification" 등. Decision Tree보다 expressive하면서 추출된 규칙이 human-readable.
3. **TabPFN / TabM (2024)** — Foundation-model 식 tabular ML이 룰 엔지니어링을 거의 없애는 방향. Hollmann et al. (2023) *ICLR*. arXiv:2207.01848.

#### 한국 적용 시 주의점

1. **금감원 규제 친화성** — 한국은 모델 설명가능성 요구가 강해 (전자금융감독규정 §31) 순수 DL 모델 단독 운영이 어렵다. 룰 + ML 하이브리드 (룰을 hard guard로, ML을 score)가 사실상 강제된다.
2. **Faker 한국어 데이터의 함정** — `Faker('ko_KR')` 의 주소·전화번호는 학습용 토큰일 뿐, 실제 한국 통신·주소 패턴 (서울 집중도, KT/SKT/LGU+ 분포)이 다르다. 모델이 "지역명 = feature" 로 학습하면 deployment에서 성능 저하.
3. **보이스피싱 룰의 빠른 무력화** — 한국 금융사가 "010-XXXX-XXXX 패턴이 변동된 번호" 같은 룰을 운영하지만, 보이스피싱 조직이 며칠 내로 회피한다. Davis (1982) 의 brittleness 문제가 한국에서 가장 극단적으로 나타나는 사례.
4. **개인정보보호법 충돌** — Drools 같은 in-memory rule engine은 PII를 메모리에 적재해야 하는데, 한국 개인정보보호법(2024 개정)에서 가명처리 후 처리 의무가 강화돼 룰 엔진 아키텍처 자체에 영향.

---

## 📚 책에 없지만 알면 좋은 것

### 🔍 보충 1 — 한국 카드사 실제 규칙 (예시)

| 규칙 | 조건 | 처리 |
|------|------|------|
| 해외 첫 결제 | 첫 해외 사용 | OTP 인증 |
| 큰 금액 | 100만원 초과 | SMS 알림 |
| 새 디바이스 | 새 기기 로그인 | 추가 인증 |
| 새벽 결제 | 0-6시 + 50만원+ | 보안문자 |
| 카드 잠금 | 5회 연속 실패 | 잠금 |

### 🔍 보충 2 — Faker로 한국 데이터

```python
fake_ko = Faker('ko_KR')

print(fake_ko.name())         # '김민준'
print(fake_ko.address())       # '서울특별시 강남구...'
print(fake_ko.phone_number())  # '010-1234-5678'
```

### 🔍 보충 3 — 규칙 라이브러리

| 라이브러리 | 언어 | 특징 |
|----------|------|------|
| Drools | Java | 표준 |
| Pyke | Python | 간단 |
| Durable Rules | Python | 비동기 |
| AWS Decision Manager | 클라우드 | 관리형 |

### 🔍 보충 4 — Rule + Score Combination

```python
def combined_score(transaction):
    score = 0
    
    # 규칙별 점수
    if transaction['amount'] > 10_000_000:
        score += 30
    if not transaction['is_domestic_ip']:
        score += 20
    if transaction['login_failures'] > 5:
        score += 25
    if transaction['account_age_days'] < 30:
        score += 15
    
    # ML 모델 점수
    ml_proba = ml_model.predict_proba([transaction])[0, 1]
    score += ml_proba * 100
    
    # 최종 결정
    if score > 80:
        return 'BLOCK'
    elif score > 50:
        return 'REVIEW'
    else:
        return 'APPROVE'
```

### 🔍 보충 5 — Sequential Rules

여러 거래 시퀀스 분석:

```python
def sequential_rule(transactions_24h):
    """24시간 내 거래 시퀀스 패턴"""
    
    # 빠른 연속 거래
    times = [t['time'] for t in transactions_24h]
    intervals = [t2 - t1 for t1, t2 in zip(times[:-1], times[1:])]
    if any(i < 60 for i in intervals):  # 1분 내
        return True
    
    # 금액 증가 패턴 (사기꾼 테스트 후 큰 금액)
    amounts = [t['amount'] for t in transactions_24h]
    if amounts == sorted(amounts):
        return True
    
    return False
```

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. 합성 데이터로 진짜 사기 탐지 가능?

**A.** **학습용으로 충분**. 한계:
- 실제 사기 패턴 못 반영
- 실전 모델은 실제 데이터 필수

### Q2. 규칙 몇 개가 적당?

**A.**
- 핵심 규칙: 10~20개
- 보조 규칙: 50~100개
- 너무 많으면 관리 어려움

### Q3. 규칙 vs. ML — 우선순위?

**A.** **규칙 먼저, ML은 보완**.
- 규칙: 명확한 사기 즉시 차단
- ML: 회색 지대 판정

### Q4. 규칙이 같은 사기를 자꾸 잡음

**A.** **규칙 효과**. 단,
- 같은 패턴 반복 = 사기꾼 변형 안 함 (드뭄)
- 새 패턴 자동 학습 필요 (ML)

### Q5. 규칙을 사기꾼이 알면?

**A.** **상시 회피 시도**. 대응:
- 규칙 비공개
- 정기 업데이트
- ML 보완

### Q6. Decision Tree로 규칙 자동 학습 정말 좋은가?

**A.** **시작점으로 좋음**. 한계:
- 깊이 제한 (3-5 단계) → 단순 규칙만
- 비선형 못 잡음

### Q7. 실전에서 규칙 + ML 비중?

**A.** **30:70 정도**.
- 규칙: 명확한 사기 30%
- ML: 미묘한 사기 70%

---

## 🎯 핵심 5가지

1. **Faker**로 합성 데이터 빠르게 생성.
2. **규칙 5종**: 큰 금액, 해외 IP, 로그인 실패, 새벽, 7일 폭증.
3. **규칙 한계**: 새 사기 못 잡음, 거짓 양성, 유지비용, 비선형 못 잡음.
4. **Decision Tree** 로 데이터에서 규칙 자동 발견.
5. **규칙 + ML 하이브리드** 가 실전 표준.

---

## 📖 더 읽을거리

- Faker: https://faker.readthedocs.io/
- Drools: https://www.drools.org/
- pyke (Python): https://pyke.sourceforge.net/

---

> **다음 실습** — Lab 2: ML 기반 (Isolation Forest 등)
