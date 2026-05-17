# 3.6 신용 평가 모델 개발을 위한 사전 지식 — *Domain Knowledge for Credit Modeling*

> **해설 분량**: 약 25쪽
> **읽는 데 걸리는 시간**: 약 45분

---

## 🪧 이 절을 한 줄로

> 신용평가 모델 개발의 **7가지 도메인 지식** — 연체 기간(M), 관찰 시점/기간, 성능 기간, 종속변수, 빈티지 분석, 데이터 분할 — 이걸 모르면 ML 코드 짜도 무용.

책은 7가지 개념을 시간 축 위에 풀어낸다. 이 해설집은:
1. **시간 축 시각화** (관찰 기간 ↔ 관찰 시점 ↔ 성능 기간)
2. **M 등급 표** + 연체 일수 매핑
3. **빈티지 분석** 실전 코드
4. **데이터 분할 시 실패 사례**

### 📍 미리 그릴 큰 그림

<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">신용평가 모델링 — 시간 축의 3대 개념</text>
  <!-- Time axis -->
  <line x1="60" y1="180" x2="700" y2="180" stroke="#1c1917" stroke-width="2"/>
  <!-- Observation period bar -->
  <rect x="60" y="100" width="320" height="40" rx="6" fill="#eaf2f8" stroke="#5a7a96" stroke-width="2"/>
  <text x="220" y="125" text-anchor="middle" font-family="Noto Sans KR,sans-serif" font-size="12" font-weight="700" fill="#5a7a96">관찰 기간 (Observation Period)</text>
  <text x="220" y="155" text-anchor="middle" font-size="10" fill="#57534e">→ 모델 입력 피처 추출 (과거)</text>
  <!-- Observation point -->
  <circle cx="380" cy="180" r="10" fill="#c4724e" stroke="#1c1917" stroke-width="2"/>
  <text x="380" y="215" text-anchor="middle" font-family="Noto Sans KR,sans-serif" font-size="12" font-weight="700" fill="#c4724e">관찰 시점</text>
  <text x="380" y="232" text-anchor="middle" font-size="10" fill="#57534e">(Observation Point)</text>
  <text x="380" y="250" text-anchor="middle" font-size="10" fill="#57534e">= 대출 신청일</text>
  <!-- Performance period bar -->
  <rect x="380" y="100" width="320" height="40" rx="6" fill="#edf7ef" stroke="#3a7d44" stroke-width="2"/>
  <text x="540" y="125" text-anchor="middle" font-family="Noto Sans KR,sans-serif" font-size="12" font-weight="700" fill="#3a7d44">성능 기간 (Performance Period)</text>
  <text x="540" y="155" text-anchor="middle" font-size="10" fill="#57534e">→ 종속변수 (부도 여부) 추적 (미래)</text>
  <!-- Bottom -->
  <text x="60" y="285" font-size="10" fill="#57534e">과거 (~12개월)</text>
  <text x="380" y="285" text-anchor="middle" font-size="10" fill="#c4724e" font-weight="700">기준점</text>
  <text x="700" y="285" text-anchor="end" font-size="10" fill="#57534e">미래 (~12개월)</text>
  <text x="380" y="55" text-anchor="middle" font-size="11" font-style="italic" fill="#1c1917">"과거 데이터로 학습 → 미래 부도 예측"</text>
</svg>

---

## 🟢 [초급] — 신용평가 시간 축 이해

### 1. 가장 기본적인 시간 개념

```
[과거] ─── [관찰 시점] ─── [미래]
   ↓             ↓             ↓
관찰 기간      대출 신청      성능 기간
(피처)         (모델 호출)    (정답 라벨)
```

#### 예시: 2024년 6월 1일 대출 신청

- **관찰 기간**: 2023년 6월 ~ 2024년 5월 (12개월)
  - 이 기간의 데이터로 피처 생성 (소득, 카드 사용 등)
- **관찰 시점**: 2024년 6월 1일
  - 대출 심사 시점
- **성능 기간**: 2024년 6월 ~ 2025년 5월 (12개월)
  - 이 기간에 연체 발생 여부 → 정답 라벨

### 2. 연체 기간 M0~M7+

#### 직관

| 등급 | 연체 일수 | 의미 |
|------|---------|------|
| **M0** | 0일 | 정상 |
| **M1** | 1~30일 | 약간 늦음 |
| **M2** | 31~60일 | 주의 |
| **M3** | 61~90일 | 위험 |
| **M4** | 91~120일 | 심각 |
| **M5** | 121~150일 | 매우 심각 |
| **M6** | 151~180일 | **파산 임박** |
| **M7+** | 180일 이상 | **파산** |

#### 어원
"M" = **Month on book** (장부에 기록된 개월). "book" = 대출 장부.

### 3. 종속변수 (Y) 정의 — 책의 분류

| Y 값 | 의미 |
|------|------|
| **Y = 0** (정상) | 성능 기간 동안 연체 없음 |
| **Y = 1** (부도) | M1+ 연체 발생 (또는 M3+, M6+ 등 정책별) |
| **판단 보류** | M0 미만의 단기 지연 (7일 등) |

### 4. 핵심 7개념 한 줄 정리

| 개념 | 한 줄 |
|------|------|
| **연체 기간 (M)** | "얼마나 늦었나" |
| **관찰 시점** | "언제 대출 평가" |
| **관찰 기간** | "과거 얼마 봐서 피처 만들기" |
| **성능 기간** | "미래 얼마 봐서 부도 판단" |
| **종속변수 (Y)** | "부도/정상 라벨 정의" |
| **빈티지 분석** | "발행 시기별 부도 패턴" |
| **데이터 분할** | "Train/Val/Test 나누기" |

> ✅ **여기까지 따라왔으면**: 신용평가 시간 축 7개념의 큰 그림이 보일 거다.

---

## 🟡 [중급] — 각 개념 깊이 보기

### 1. 연체 기간 (M) 세부 분석

#### 1.1 책 표 3-4 풀이 — 전이 확률

| 현재 상태 | M0 | M1 | M2 | M3 | M4 |
|---------|-----|-----|-----|-----|-----|
| **M0 (정상)** | 99.71% | 0.29% | - | - | - |
| **M1 (1~30일)** | - | - | 54.34% | - | - |
| **M2 (31~60일)** | - | - | - | 90.04% | - |
| **M3 (61~90일)** | - | - | - | - | 93.72% |

**해석**:
- M0 → M1 전이 0.29% (매우 낮음)
- M1 → M2 전이 54% (절반이 악화)
- M2 → M3 전이 90% (대부분 악화)
- M3 → M4 전이 94% (거의 회복 불가)

> 💡 **핵심 인사이트**: M1 → M2가 임계점. 여기서 회복 도와야 비용 절감.

#### 1.2 Markov Chain으로 모델링

```
State: M0, M1, M2, M3, M4, M5, M6, M7+
Transition Matrix: 8×8 확률 행렬

P(t+1 상태 | t 상태) = 확률
→ Markov property 가정
```

### 2. 관찰 시점 (Observation Point) 의 의미

#### 2.1 모델 유형별 관찰 시점

| 모델 유형 | 관찰 시점 |
|---------|---------|
| **Application Scoring** | 대출 신청일 |
| **Behavioral Scoring** | 매월 말 (정기 평가) |
| **Collection Scoring** | 부도 발생일 |
| **Pre-screening** | 캠페인 시점 |

#### 2.2 관찰 시점 선택의 중요성

```
잘못된 예:
관찰 시점 = 데이터 수집 가능한 가장 늦은 날
   → 운영 시점과 다름 → 모델 성능 저하

올바른 예:
관찰 시점 = 실제 의사결정 시점
   → 운영과 일관성
```

### 3. 관찰 기간 (Observation Period)

#### 3.1 일반적 길이

| 데이터 종류 | 관찰 기간 |
|----------|---------|
| **단기 (Application)** | 6개월 |
| **중기 (Behavioral)** | 12개월 (표준) |
| **장기 (Macro 영향)** | 24개월 |

#### 3.2 피처 엔지니어링 예시

12개월 관찰 기간에서 추출 가능한 피처:

```python
def create_features(transactions, observation_point):
    """관찰 시점 기준 과거 12개월 데이터로 피처 생성"""
    obs_start = observation_point - pd.DateOffset(months=12)
    
    # 12개월 이내 거래만
    df = transactions[(transactions['date'] >= obs_start) & 
                       (transactions['date'] < observation_point)]
    
    features = {
        # 평균
        'avg_balance_12m': df['balance'].mean(),
        'avg_transaction_12m': df['amount'].mean(),
        
        # 최근성 (3개월)
        'avg_balance_3m': df[df['date'] >= observation_point - pd.DateOffset(months=3)]['balance'].mean(),
        
        # 행동 패턴
        'overdraft_count_12m': (df['balance'] < 0).sum(),
        'large_withdraw_count': (df['amount'] < -1000000).sum(),
        
        # 추세
        'balance_trend': df.groupby(df['date'].dt.month)['balance'].mean().pct_change().mean(),
    }
    
    return features
```

### 4. 성능 기간 (Performance Period)

#### 4.1 일반적 길이

| 대출 종류 | 성능 기간 |
|---------|---------|
| **신용카드** | 6개월 |
| **개인 신용대출** | 12개월 (표준) |
| **주택담보** | 24개월 |
| **자영업자 대출** | 18개월 |

#### 4.2 너무 짧으면? 너무 길면?

```
[너무 짧음 (3개월)]
   - 부도 발생 전 데이터 미반영
   - 모델이 부도 못 잡음

[너무 김 (24개월)]
   - 거시경제 변화 영향 큼
   - 모델 일반화 어려움
   - 학습 데이터 줄어듦 (옛날 데이터만)

[최적 (12개월)]
   - 균형
   - 한국 산업 표준
```

### 5. 종속변수 (Y) 정의의 함정

#### 5.1 정의에 따른 데이터 양 변화

| 정의 | 부도 비율 | 모델 학습 |
|------|---------|---------|
| **M1+ (1일 이상)** | 5% | 학습 데이터 많음 |
| **M3+ (61일 이상)** | 2% | 균형 |
| **M6+ (181일 이상)** | 0.5% | 매우 불균형 |

→ 정의가 엄격할수록 부도 데이터 줄어듦.

#### 5.2 한국 BIS 표준
대부분 **M3+ (90일 이상 연체)** 를 "부도"로 정의 (Basel II 기준).

#### 5.3 비즈니스 정의

| 정의 | 활용 |
|------|------|
| **M1+** | 조기 경보 모델 |
| **M3+** | 신용평가 모델 (표준) |
| **M6+** | Collection 모델 |
| **법적 파산** | 손실 충당금 |

### 6. 빈티지 분석 (Vintage Analysis)

#### 6.1 개념

"같은 시기에 발행된 대출들" 의 시간 흐름별 부도율 추적.

#### 6.2 책 그림 3-7 해석

```
2022년 4월 발행 코호트:
  - 0개월: 부도율 0%
  - 3개월: 부도율 1%
  - 6개월: 부도율 2.5%
  - 10개월: 부도율 4% (평탄화)
  - 12개월: 부도율 4.2%

2023년 4월 발행 코호트:
  - 비슷한 패턴
  - 10개월 평탄화점
```

→ **10개월이 안정화 시점** → 성능 기간 10개월로 설정 가능.

#### 6.3 Python 코드

```python
import pandas as pd
import matplotlib.pyplot as plt

def vintage_analysis(df, cohort_col='loan_month', max_periods=24):
    """빈티지 분석"""
    cohorts = df[cohort_col].unique()
    
    results = pd.DataFrame()
    for cohort in cohorts:
        cohort_data = df[df[cohort_col] == cohort]
        
        # 월별 부도율
        for period in range(max_periods):
            default_rate = (cohort_data['default_at_month'] == period).sum() / len(cohort_data)
            results.loc[cohort, period] = default_rate
    
    # 누적
    results_cumulative = results.cumsum(axis=1)
    
    # 시각화
    results_cumulative.T.plot(figsize=(12, 6))
    plt.xlabel('Months Since Origination')
    plt.ylabel('Cumulative Default Rate (%)')
    plt.title('Vintage Analysis')
    plt.show()
    
    return results_cumulative
```

#### 6.4 빈티지 분석으로 알 수 있는 것

1. **부도 발생 시점**: 평균 6~10개월
2. **안정화 시점**: 10~12개월 (성능 기간 결정 근거)
3. **시기별 비교**: 2022년 코호트 vs. 2023년 코호트
4. **거시 영향**: 코로나 시기 코호트의 이상 패턴

### 7. 데이터 분할 전략

#### 7.1 신용평가 특화 고려 사항

##### 고려 ①: 불균형 데이터
```python
from sklearn.model_selection import train_test_split

# 잘못된 예
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
# → 부도 비율이 train/test에서 달라질 수 있음

# 올바른 예 (stratified)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)
```

##### 고려 ②: 시간 순서
```python
# 시계열 데이터는 시간 순으로 분할
df = df.sort_values('observation_date')
split_date = '2023-01-01'
df_train = df[df['observation_date'] < split_date]
df_test = df[df['observation_date'] >= split_date]
```

##### 고려 ③: 외부 이벤트
```python
# 코로나 시기 (2020.3~2020.12) 별도 분석
df_pre_covid = df[df['date'] < '2020-03-01']
df_covid = df[(df['date'] >= '2020-03-01') & (df['date'] < '2020-12-31')]
df_post_covid = df[df['date'] >= '2021-01-01']
```

#### 7.2 OOT (Out-of-Time) 검증

```
[Train] 2020~2022
[Validation] 2023.Q1~Q2
[Test (OOT)] 2023.Q3~Q4
```

→ **시간 흐름에 따른 모델 안정성** 검증.

> ✅ **여기까지 따라왔으면**: 7가지 도메인 지식이 머릿속에 정리됐을 거다.

---

## 🔴 [고급] — 실전 시간 축 설계

### 1. 시간 축 설계의 표준 케이스

#### 1.1 Application Scorecard

```
[관찰 기간 (12개월)]   [관찰 시점]   [성능 기간 (12개월)]
   2022.6~2023.5        2023.6.1        2023.6~2024.5
        ↓                  ↓                  ↓
   피처 생성            대출 신청        부도 발생 추적
```

#### 1.2 Behavioral Scorecard

```
[관찰 기간 (6개월)]    [관찰 시점]    [성능 기간 (12개월)]
   2023.1~2023.6        2023.6.30       2023.7~2024.6
        ↓                    ↓                  ↓
   대출 후 행동         월별 평가         미래 위험 평가
```

### 2. 빈티지 분석 심화

#### 2.1 Origination Curve

```
부도율 누적
    ↑
 5% │       ────────────  ← 평탄화 (10~12개월)
    │     ╱
 3% │   ╱
    │  ╱
 1% │ ╱
    │/
 0% └─────────────────────────→ 개월
    0    3    6    9    12    15    18
```

#### 2.2 Maturity 분석

```python
def maturity_analysis(df):
    """대출 만기까지의 부도 패턴"""
    df['months_to_maturity'] = (df['maturity_date'] - df['observation_date']).dt.days // 30
    
    maturity_buckets = pd.cut(df['months_to_maturity'], bins=[0, 12, 24, 36, 60, 120])
    default_by_maturity = df.groupby(maturity_buckets)['default'].mean()
    
    return default_by_maturity
```

### 3. 데이터 누설 회피

#### 3.1 시간 누설 (Time Leakage)

```python
# 잘못된 코드
df['next_month_payment'] = df['payment'].shift(-1)  # 미래 정보!
df['target'] = (df['next_month_payment'] == 0).astype(int)
features = df.drop('target', axis=1)  # next_month_payment 포함됨!

# 올바른 코드
features = df.drop(['target', 'next_month_payment'], axis=1)
```

#### 3.2 라벨 누설 (Label Leakage)

```python
# 부도 후 변경된 피처를 사용하면 누설
df['current_delinquency'] = df['days_past_due']  # 부도 시점 데이터!
# 학습엔 좋지만 운영엔 무용 (부도가 이미 발생함)
```

### 4. 책의 한계 5가지

#### 한계 ①: 한국 BIS 표준 미명시
- 책은 M1+ ~ M6+ 다양한 정의 소개
- **실제 한국 표준**: M3+ (90일 연체) = 부도

#### 한계 ②: Markov Chain 활용 미설명
- 표 3-4 (전이 확률) 가 사실 Markov Matrix
- Markov 모델로 부도 확률 시뮬레이션 가능

#### 한계 ③: 거시경제 보정 미언급
- 빈티지 분석 시 거시경제 (실업률, 금리) 보정 필요
- 그렇지 않으면 같은 패턴도 다르게 해석

#### 한계 ④: 데이터 분할 코드 부재
- 책은 개념만 설명, 실제 sklearn 코드 없음
- 위 §[중급] 7번에서 보완

#### 한계 ⑤: OOT vs. K-Fold 비교 부재
- 신용평가에선 OOT (Out-of-Time) 가 표준
- 일반 K-Fold는 시간 누설 위험

---

## 🟣 [전공자] — 학술 자료

### 1. 빈티지 분석의 학술적 기원

> 📄 Breeden, J. L. (2007). Modeling data with multiple time dimensions. *Computational Statistics & Data Analysis*, 51(9), 4761–4785.

**Age-Period-Cohort (APC)** 분석:
- Age: 대출 후 경과 시간
- Period: 절대 시점 (예: 2023.6)
- Cohort: 발행 시기

세 차원의 효과를 분리.

### 2. Roll Rate Analysis

> 📄 Thomas, L. C. (2009). *Consumer Credit Models*. Oxford UP. Ch. 5.

각 M 상태 간 전이 확률 (책 표 3-4):
- Roll-Forward Rate: 더 나빠질 확률
- Roll-Back Rate: 회복 확률

수식:
$$ \text{Roll-Forward}_{M_i \to M_{i+1}} = \frac{\text{Count}(M_i \to M_{i+1})}{\text{Count}(M_i)} $$

### 3. Markov Chain 모델

> 📄 Bluhm, C., Overbeck, L., & Wagner, C. (2016). *Introduction to Credit Risk Modeling* (2nd ed.). CRC Press.

신용 등급 전이 매트릭스로 다년 부도 확률 계산.

### 4. Survival Analysis

> 📄 Stepanova, M., & Thomas, L. (2002). Survival analysis methods for personal loan data. *Operations Research*, 50(2).

대출 부도까지의 "**생존 시간**" 분석:
- Cox Proportional Hazards
- Kaplan-Meier Curve

```python
from lifelines import KaplanMeierFitter, CoxPHFitter

# Kaplan-Meier
kmf = KaplanMeierFitter()
kmf.fit(df['duration'], df['default'])
kmf.plot_survival_function()

# Cox 모델
cph = CoxPHFitter()
cph.fit(df, duration_col='duration', event_col='default')
print(cph.summary)
```

### 5. Reject Inference

> 📄 Banasik, J., & Crook, J. (2007). Reject inference, augmentation, and sample selection. *European Journal of Operational Research*, 183(3).

신용평가 모델은 **승인된 고객 데이터만** 학습:
- 거절된 고객은 부도 여부 모름
- → Selection Bias

대응:
- **Augmentation**: 거절 데이터에 추정 라벨 부여
- **Reweighting**: 승인/거절 비율 보정

---

### 🟣 [전공자 심화] — Reject Inference 와 Survival Analysis 의 한계와 후속 연구

#### Reject Inference 의 원논문 한계
- **MAR (Missing At Random) 가정**: Banasik-Crook (2007) Augmentation/Reweighting 은 거절 사유가 관측 변수로 설명된다는 가정. 그러나 인간 심사관 정성 판단(예: 면담)이 결정 변수면 MNAR(Missing Not At Random) → 모든 imputation 편향.
- **Heckman 2단계의 식별 가정**: Banasik-Crook 등이 사용한 bivariate probit 은 **exclusion restriction** (승인에만 영향 + 부도에는 영향 없는 변수) 가 필요하나, 신용평가에서 그런 변수 찾기 어려움.
- **Counterfactual 부재**: 거절된 사람의 "만약 승인됐다면" 부도 여부는 본질적으로 관측 불가. 어떤 reject inference 도 가정 기반 추정.

#### Reject Inference 비판 문헌
- Crook, J., & Banasik, J. (2004). Does reject inference really improve the performance of application scoring models? *Journal of Banking & Finance*, 28(4), 857-874. — 본인들의 후속 연구에서 **reject inference 의 효과가 미미하거나 음수** 일 수 있음을 실증.
- Anderson, B. (2022). The Credit Scoring Toolkit: Theory and Practice for Retail Credit Risk Management and Decision Automation (2nd ed.). Oxford UP, Ch. 18. — Reject inference 의 5가지 방법(Parceling, Augmentation, Reclassification, Extrapolation, Bivariate) 비교 + 실무 비판.
- Bücker, M., van Kampen, M., & Krämer, W. (2013). Reject inference in consumer credit scoring with nonignorable missing data. *Journal of Banking & Finance*, 37(3), 1040-1045. — MNAR 시나리오에서 Heckman 모형의 성능 평가.

#### Reject Inference 후속 연구 동향 (2020~)
- Liu, F., Hua, Z., & Lim, A. (2020). Identifying future good and bad credit applicants: A deep learning approach. *Decision Support Systems*, 133, 113290. — Self-training + GAN 기반 거절 라벨 추정.
- Mancisidor, R. A., Kampffmeyer, M., Aas, K., & Jenssen, R. (2020). Deep generative models for reject inference in credit scoring. *Knowledge-Based Systems*, 196, 105758. https://doi.org/10.1016/j.knosys.2020.105758 — VAE/GAN 기반 거절 분포 학습.
- Shen, F., Zhao, X., Kou, G., & Alsaadi, F. E. (2021). A new deep learning ensemble credit risk evaluation model with an improved synthetic minority oversampling technique. *Applied Soft Computing*, 98, 106852. — Reject inference + 불균형 학습 통합.

#### Survival Analysis 의 원논문 한계 (Stepanova-Thomas 2002)
- **Cox PH 의 비례위험 가정**: 시간에 따라 hazard ratio 일정 가정. 신용평가는 거시 사이클·금리 변동으로 시계열에 따라 변동 → 비례성 위반 흔함 (Schoenfeld residual test 로 검정).
- **Censoring 가정 (non-informative)**: 조기상환(prepayment) 이 부도와 상관 없이 발생 가정. 실제로는 신용 좋은 차주가 재대출 → 조기상환 → 표본에서 사라짐 = informative censoring.
- **Competing risk 무시**: 부도 vs 조기상환 vs 만기 도달 = 3개 사건의 경쟁. 단일 Cox 모형은 부적합.

#### Survival Analysis 후속 연구 동향
- Dirick, L., Claeskens, G., & Baesens, B. (2017). Time to default in credit scoring using survival analysis: a benchmark study. *Journal of the Operational Research Society*, 68(6), 652-665. — Cox / AFT / mixture cure model 등 비교.
- Bellotti, T., & Crook, J. (2013). Forecasting and stress testing credit card default using dynamic models. *International Journal of Forecasting*, 29(4), 563-574. — 거시 변수 + Cox 시간변동 covariate.
- Lee, C., Yoon, J., & van der Schaar, M. (2019). Dynamic-DeepHit: A deep learning approach for dynamic survival analysis with competing risks based on longitudinal data. *IEEE Transactions on Biomedical Engineering*, 67(1), 122-133. — Competing risk 딥러닝 모형. 신용평가 적용 시 부도 vs 조기상환 동시 모형.
- Wang, P., Li, Y., & Reddy, C. K. (2019). Machine learning for survival analysis: A survey. *ACM Computing Surveys*, 51(6), Article 110. — Survival 분석의 ML 확장 종합 리뷰.

#### 한국 적용 시 주의점
- **한국 시중은행의 reject inference 실태**: 4대 은행 모두 augmentation 시도는 있으나, **선형 reweighting + LR 보조** 가 대부분. 거절 라벨의 신뢰성 낮아 실무에서는 미반영.
- **금감원 모범규준 (2018)** 은 reject inference 를 "검토 권고" 수준으로만 언급. 의무 아님.
- **K-IFRS 9 lifetime PD**: Survival analysis 는 lifetime PD 산출에 자연스러우나, 한국 은행은 대부분 **연도별 transition matrix (Markov)** 방식 채택. Survival 모형은 학술 연구 단계.
- **조기상환 (한국)**: 주택담보대출의 조기상환률 (CPR) 은 금리 사이클에 강하게 의존. competing risk 모형 미적용 시 부도확률 과대추정.
- **마이데이터 시대의 long-format data**: 월별 잔액·연체일수 시계열 가용 → Dynamic-DeepHit 같은 longitudinal survival 모형 적용 가능성 확대.

---

## 📚 책에 없지만 알면 좋은 것

### 🔍 보충 1 — Vintage Analysis 한국 사례

#### 한국 시중은행 표준
- 매월 빈티지 분석 수행
- 신상품 출시 시 6개월 모니터링
- 12개월 평탄화 → 성능 기간 표준

#### 카드사
- 발행 직후 3개월 무이자 → 부도 늦게 발생
- 12~18개월 평탄화

### 🔍 보충 2 — Stress Testing

빈티지 분석 + 시나리오:
- 정상 시나리오: 부도율 4%
- 침체 시나리오 (실업률 7%): 부도율 8%
- 위기 시나리오 (실업률 10%): 부도율 12%

→ 자본 충당 충분 여부 검증.

### 🔍 보충 3 — Cohort Analysis vs. Vintage Analysis

| | Vintage | Cohort |
|---|---|---|
| **차원** | 시간 (발행 시점) | 특성 (연령, 지역) |
| **용도** | 신용평가 | 마케팅, CRM |
| **유사** | 같은 시기 발행 | 같은 그룹 |

### 🔍 보충 4 — Customer Lifecycle Management

```
[신청] → [평가] → [한도 부여] → [활성화] → [모니터링] → [부도/만기]
   ↓        ↓          ↓             ↓             ↓               ↓
신청 모델  Application   Limit       Behavior     Behavioral    Collection
           Scoring     Management   monitoring     Scoring       Model
```

→ 각 단계마다 다른 모델.

### 🔍 보충 5 — Lifetime Value (LTV)

부도 외 다른 라벨도 가능:
- **LTV**: 고객 평생 수익 예측
- **Churn**: 이탈 확률
- **Cross-sell**: 추가 상품 가능성

→ 신용평가 + 마케팅 통합.

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. M3+ 와 M6+ 중 어느 정의가 표준?

**A.** **M3+가 BIS 표준**.

- M3+ = 90일 연체 = Basel II "Default" 정의
- M6+ = 180일 = "Charge-off" (손실 인식)

→ 모델링은 M3+, 회수는 M6+ 기준.

### Q2. 관찰 기간 12개월이 표준인 이유?

**A.** 균형:
- 짧으면 (3개월): 계절성 못 잡음
- 길면 (24개월): 거시 변동 영향 큼
- **12개월**: 1년 사이클, 안정적

### Q3. 빈티지 분석에서 평탄화점이 다르면?

**A.** 평탄화점 = **성능 기간 결정 근거**.
- 평탄화점이 6개월 → 성능 기간 6개월
- 12개월 → 12개월
- 18개월 → 18개월 (장기 대출)

### Q4. OOT 검증을 항상 해야 하나?

**A.** **시계열 데이터면 필수**.

OOT 안 하면:
- 미래 정보 누설 위험
- 운영 시 성능 급락
- Concept Drift 못 감지

### Q5. Reject Inference 정말 효과?

**A.** **이론적으론 좋고 실전은 어려움**.

- 거절된 고객의 진짜 부도율은 알 수 없음
- 가정에 의존 → 오해 가능
- 대형 은행만 부분 적용

### Q6. Survival Analysis vs. Logistic Regression?

**A.**

| | Survival | Logistic |
|---|---|---|
| 출력 | "언제 부도?" | "부도/정상" |
| 데이터 | 시간 + 라벨 | 라벨만 |
| 활용 | LTV, 추심 | 일반 평가 |
| 한국 적용 | 적음 | 표준 |

### Q7. 신용평가 모델을 처음 만들 때 데이터가 부족하면?

**A.** 우선순위:
1. **Public 데이터** 활용 (Home Credit, American Express)
2. **합성 데이터** 생성 (CTGAN)
3. **전이 학습** (다른 도메인 모델)
4. **점진적 학습** (소규모 출시 → 데이터 축적)

---

## 🎯 이 절에서 가져갈 핵심 7가지

1. **연체 기간 M0~M7+**: 30일 단위, M3+가 BIS 표준 부도.
2. **관찰 기간 (과거)** + **관찰 시점 (현재)** + **성능 기간 (미래)** 3축이 신용평가 모델링의 시간 구조.
3. **종속변수 Y**: M1+/M3+/M6+ 중 비즈니스 목적별 선택.
4. **빈티지 분석**: 발행 시기별 부도 추적 → 성능 기간 결정.
5. **데이터 분할 3원칙**: 불균형 (stratify) + 시간 순서 + 외부 이벤트 분리.
6. **OOT (Out-of-Time) 검증** 이 시계열 신용평가의 표준.
7. **Markov Chain + Roll Rate** 가 전이 확률 분석의 학술 기반.

---

## 📖 더 읽을거리

### 신용평가 도메인
- Siddiqi, N. (2017). *Intelligent Credit Scoring* (2nd ed.). Wiley.
- Thomas, L. C. (2009). *Consumer Credit Models*. Oxford UP.
- Bluhm, C., et al. (2016). *Introduction to Credit Risk Modeling*. CRC Press.

### 학술
- Breeden, J. L. (2007). Modeling data with multiple time dimensions. *CSDA*.
- Stepanova, M., & Thomas, L. (2002). Survival analysis methods for personal loan data. *OR*.
- Banasik, J., & Crook, J. (2007). Reject inference. *EJOR*.

### Survival Analysis
- lifelines: https://lifelines.readthedocs.io/
- scikit-survival: https://scikit-survival.readthedocs.io/

---

> **다음 절 예고** — §3.7 머신러닝 기반 신용 평가 모델 개발
> 모델 학습 파이프라인, 피처 엔지니어링, 하이퍼파라미터 튜닝, 모델 평가.
