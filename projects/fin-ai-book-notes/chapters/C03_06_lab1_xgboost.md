# 실습 1: 밑바닥부터 시작하는 ML 신용평가 모델 — *Lab 1: XGBoost-Based Credit Model*

> **원서 위치**: 김태헌, 《금융 AI의 이해》(제이펍, 2024), 실습 1 (pp.161~)
> **원서 분량**: 약 20쪽
> **해설 분량**: 약 25쪽
> **데이터**: Kaggle American Express Default Prediction
> **소요 시간**: 6~10시간

---

## 🪧 이 실습을 한 줄로

> **Kaggle American Express 데이터** + **XGBoost** 로 신용평가 모델 만들고, **WoE/SHAP** 으로 해석하기.

책은 8단계 (데이터 → EDA → 결측치 → 피처 → 모델 → 평가 → 스코어링 → 해석) 로 진행. 이 해설집은:
1. **각 단계 핵심 코드 압축**
2. **흔한 에러 + 해결**
3. **한국 데이터로 변형**

### 📍 실습 전체 흐름

<svg viewBox="0 0 760 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">Lab 1 — XGBoost 신용평가 8단계</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <rect x="20" y="60" width="130" height="55" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="85" y="83" text-anchor="middle" font-weight="700" fill="#c4724e">① 데이터 로딩</text>
    <text x="85" y="100" text-anchor="middle" font-size="10" fill="#57534e">AmEx 10만건</text>
    <rect x="160" y="60" width="130" height="55" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="225" y="83" text-anchor="middle" font-weight="700" fill="#c4724e">② EDA</text>
    <text x="225" y="100" text-anchor="middle" font-size="10" fill="#57534e">결측치·분포</text>
    <rect x="300" y="60" width="130" height="55" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="365" y="83" text-anchor="middle" font-weight="700" fill="#c4724e">③ 전처리</text>
    <text x="365" y="100" text-anchor="middle" font-size="10" fill="#57534e">결측치·범주형</text>
    <rect x="440" y="60" width="130" height="55" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="505" y="83" text-anchor="middle" font-weight="700" fill="#5a7a96">④ 피처</text>
    <text x="505" y="100" text-anchor="middle" font-size="10" fill="#57534e">WoE/IV</text>
    <rect x="580" y="60" width="160" height="55" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="660" y="83" text-anchor="middle" font-weight="700" fill="#3a7d44">⑤ 학습</text>
    <text x="660" y="100" text-anchor="middle" font-size="10" fill="#57534e">XGBoost + CV</text>
    <rect x="160" y="155" width="130" height="55" rx="6" fill="#f5e6f0" stroke="#7a6a9a"/>
    <text x="225" y="178" text-anchor="middle" font-weight="700" fill="#7a6a9a">⑥ 평가</text>
    <text x="225" y="195" text-anchor="middle" font-size="10" fill="#57534e">KS·AUC·F1</text>
    <rect x="300" y="155" width="130" height="55" rx="6" fill="#fef9e7" stroke="#8a6d2c"/>
    <text x="365" y="178" text-anchor="middle" font-weight="700" fill="#8a6d2c">⑦ 스코어링</text>
    <text x="365" y="195" text-anchor="middle" font-size="10" fill="#57534e">PD → 점수</text>
    <rect x="440" y="155" width="130" height="55" rx="6" fill="#fff" stroke="#1c1917"/>
    <text x="505" y="178" text-anchor="middle" font-weight="700" fill="#1c1917">⑧ 해석</text>
    <text x="505" y="195" text-anchor="middle" font-size="10" fill="#57534e">SHAP</text>
  </g>
</svg>

---

## 🟢 [초급] — 환경과 데이터

### 1. Kaggle 환경 사용

```bash
# Kaggle 노트북: New Notebook → Internet ON
# 데이터: American Express - Default Prediction
# 또는 amex-data-sampled (10만 행 샘플)
```

### 2. 데이터 로딩

```python
import pandas as pd
import numpy as np

# Kaggle 환경
df = pd.read_pickle('/kaggle/input/amex-data-sampled/train_df_sample.pkl')
df = df.reset_index()
print(f"Shape: {df.shape}")  # (100000, 920)
df.head()
```

> ⚠️ **920개 컬럼**! 메모리 주의.

### 3. 데이터 구조

- **target**: 0 (정상) / 1 (부도)
- **customer_ID**: 고객 ID
- **920개 피처**: P_2, D_3, B_1 등 (익명화)
  - P: 결제 (Payment)
  - D: 연체 (Delinquency)
  - B: 잔액 (Balance)
  - R: 위험 (Risk)
  - S: 지출 (Spend)
  - 각 피처에 _mean, _std, _min, _max, _last 접미사

### 4. 첫 점검

```python
# 부도율
print(f"부도율: {df['target'].mean():.2%}")
# 보통 5~10%

# 결측치 비율
missing_pct = df.isnull().mean()
print(f"결측치 50%+ 컬럼 수: {(missing_pct > 0.5).sum()}")
```

> ✅ **여기까지 따라왔으면**: AmEx 데이터의 큰 그림이 보일 거다.

---

## 🟡 [중급] — 전처리와 피처 엔지니어링

### 1. 결측치 처리

#### 1.1 결측치 비율 기반 제거

```python
def drop_null_cols(df, threshold=0.8):
    """결측치 80% 이상 컬럼 제거"""
    null_percent = df.isnull().mean()
    drop_cols = list(null_percent[null_percent >= threshold].index)
    df = df.drop(drop_cols, axis=1)
    print(f"제거: {len(drop_cols)}개 컬럼")
    return df

df = drop_null_cols(df, threshold=0.8)
```

#### 1.2 남은 결측치 대체

```python
# 수치형: 중앙값
num_cols = df.select_dtypes(include=np.number).columns
df[num_cols] = df[num_cols].fillna(df[num_cols].median())

# 범주형: 최빈값
cat_cols = df.select_dtypes(include='object').columns
df[cat_cols] = df[cat_cols].fillna(df[cat_cols].mode().iloc[0])
```

### 2. 범주형 변수 처리

```python
# AmEx 범주형 변수 (책에 명시)
cat_features = ['B_30', 'B_38', 'D_114', 'D_116', 'D_117', 
                'D_120', 'D_126', 'D_63', 'D_64', 'D_68']
cat_features = [f"{cf}_last" for cf in cat_features]

# Label Encoding
from sklearn.preprocessing import LabelEncoder

for col in cat_features:
    if col in df.columns:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
```

### 3. 피처 선택

```python
import random

# 너무 많으면 메모리 부족 → 100개 샘플링
num_cols = df.select_dtypes(include=np.number).columns.tolist()
num_cols = [c for c in num_cols if 'target' not in c and c not in cat_features]
num_cols_sample = random.sample(num_cols, 100)

feature_list = num_cols_sample + cat_features
df = df[feature_list + ['target']]
```

### 4. ID 인코딩

```python
import hashlib

def encode_id(id_str):
    return hashlib.sha256(id_str.encode('utf-8')).hexdigest()[:16]

# (실습에선 ID 사용 안 함, 메모리 절약용)
```

### 5. EDA 요약

```python
def summary(df):
    summ = pd.DataFrame({
        'dtype': df.dtypes,
        'missing': df.isnull().sum(),
        '%missing': df.isnull().sum() / len(df) * 100,
        'unique': df.nunique(),
        'min': df.min(numeric_only=True),
        'max': df.max(numeric_only=True),
    })
    return summ

summary(df)
```

> ✅ **여기까지 따라왔으면**: 전처리가 끝났다. 다음은 학습.

---

## 🔴 [고급] — XGBoost 학습 + 평가

### 1. Train/Test 분리

```python
from sklearn.model_selection import train_test_split

X = df.drop('target', axis=1)
y = df['target']

# 층화 추출 (stratify)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

print(f"Train: {X_train.shape}, Test: {X_test.shape}")
print(f"Train 부도율: {y_train.mean():.2%}")
print(f"Test 부도율: {y_test.mean():.2%}")
```

### 2. XGBoost 학습

```python
from xgboost import XGBClassifier

model = XGBClassifier(
    n_estimators=500,
    max_depth=6,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    scale_pos_weight=10,  # 불균형 보정
    early_stopping_rounds=20,
    eval_metric='auc',
    random_state=42,
    n_jobs=-1,
    verbosity=0,
)

model.fit(
    X_train, y_train,
    eval_set=[(X_test, y_test)],
    verbose=False
)

print(f"학습 완료. Iter: {model.best_iteration}")
```

### 3. 평가 — 4가지 지표

```python
from sklearn.metrics import roc_auc_score, classification_report
from scipy.stats import ks_2samp

# 예측
y_pred_proba = model.predict_proba(X_test)[:, 1]
y_pred = (y_pred_proba > 0.5).astype(int)

# AUC
auc = roc_auc_score(y_test, y_pred_proba)

# KS
ks, _ = ks_2samp(y_pred_proba[y_test == 0], y_pred_proba[y_test == 1])

# Precision/Recall/F1
print(classification_report(y_test, y_pred))

print(f"AUC: {auc:.4f}")
print(f"KS: {ks:.4f}")
# 보통 AUC 0.80~0.85, KS 0.45~0.55
```

### 4. 하이퍼파라미터 튜닝 (Optuna)

```python
import optuna
from sklearn.model_selection import StratifiedKFold

def objective(trial):
    params = {
        'n_estimators': trial.suggest_int('n_estimators', 100, 500),
        'max_depth': trial.suggest_int('max_depth', 3, 10),
        'learning_rate': trial.suggest_loguniform('learning_rate', 1e-3, 1e-1),
        'subsample': trial.suggest_float('subsample', 0.5, 1.0),
        'colsample_bytree': trial.suggest_float('colsample_bytree', 0.5, 1.0),
        'scale_pos_weight': trial.suggest_int('scale_pos_weight', 1, 20),
    }
    
    skf = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)
    aucs = []
    
    for tr_idx, val_idx in skf.split(X_train, y_train):
        X_tr, X_val = X_train.iloc[tr_idx], X_train.iloc[val_idx]
        y_tr, y_val = y_train.iloc[tr_idx], y_train.iloc[val_idx]
        
        m = XGBClassifier(**params, eval_metric='auc')
        m.fit(X_tr, y_tr)
        auc = roc_auc_score(y_val, m.predict_proba(X_val)[:, 1])
        aucs.append(auc)
    
    return np.mean(aucs)

study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=30, show_progress_bar=True)
print(f"Best AUC: {study.best_value:.4f}")
print(f"Best params: {study.best_params}")
```

### 5. SHAP 해석

```python
import shap

# Explainer
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# 전역 중요도
shap.summary_plot(shap_values, X_test, max_display=20)

# 의존성 (개별 피처)
shap.dependence_plot('P_2_mean', shap_values, X_test)

# 개별 설명 (Force plot)
shap.initjs()
shap.force_plot(explainer.expected_value, shap_values[0], X_test.iloc[0])

# Waterfall
shap.waterfall_plot(shap.Explanation(values=shap_values[0],
                                       base_values=explainer.expected_value,
                                       data=X_test.iloc[0].values,
                                       feature_names=X_test.columns.tolist()))
```

### 6. 스코어링 (PD → 신용점수)

```python
def proba_to_score(proba, base_score=600, pdo=20, target_odds=50):
    """확률 → 신용 점수"""
    odds = (1 - proba) / (proba + 1e-10)
    factor = pdo / np.log(2)
    offset = base_score - factor * np.log(target_odds)
    score = offset + factor * np.log(odds)
    return np.clip(score, 300, 850).round().astype(int)

# 적용
y_pred_proba = model.predict_proba(X_test)[:, 1]
scores = proba_to_score(y_pred_proba)

# 분포
import matplotlib.pyplot as plt
plt.hist(scores, bins=50, alpha=0.7)
plt.xlabel('Credit Score')
plt.ylabel('Count')
plt.title('Score Distribution')
plt.show()
```

> ✅ **여기까지 따라왔으면**: ML 신용평가 모델 end-to-end를 완성했다.

---

## 🟣 [전공자] — 확장과 한국 데이터 적용

### 1. Time-aware Validation

```python
from sklearn.model_selection import TimeSeriesSplit

tscv = TimeSeriesSplit(n_splits=5)
aucs = []
for tr_idx, val_idx in tscv.split(X):
    X_tr, X_val = X.iloc[tr_idx], X.iloc[val_idx]
    y_tr, y_val = y.iloc[tr_idx], y.iloc[val_idx]
    
    model = XGBClassifier()
    model.fit(X_tr, y_tr)
    auc = roc_auc_score(y_val, model.predict_proba(X_val)[:, 1])
    aucs.append(auc)
    print(f"AUC: {auc:.3f}")
```

### 2. Calibration

```python
from sklearn.calibration import CalibratedClassifierCV, calibration_curve

# Platt Scaling
calibrated = CalibratedClassifierCV(model, method='sigmoid', cv='prefit')
calibrated.fit(X_val, y_val)

# 보정 곡선
prob_true, prob_pred = calibration_curve(y_test, y_pred_proba, n_bins=10)
plt.plot(prob_pred, prob_true, marker='o')
plt.plot([0, 1], [0, 1], 'k--')
plt.xlabel('Predicted Probability')
plt.ylabel('Actual Default Rate')
plt.title('Calibration Plot')
plt.show()
```

### 3. 한국 데이터 변형 (Home Credit 또는 가상)

```python
# 한국 신용평가 데이터가 없으므로 합성 (예시)
import FinanceDataReader as fdr

# 또는 Kaggle "Home Credit Default Risk" 사용
# https://www.kaggle.com/c/home-credit-default-risk

# 동일 흐름:
# 1. 데이터 로딩
# 2. EDA + 결측치
# 3. 피처 엔지니어링
# 4. XGBoost 학습
# 5. SHAP + 점수 변환
```

### 4. Ensemble (XGBoost + LightGBM + LR)

```python
from sklearn.linear_model import LogisticRegression
from lightgbm import LGBMClassifier

# 3가지 모델
xgb = XGBClassifier(n_estimators=300)
lgbm = LGBMClassifier(n_estimators=300, verbose=-1)
lr = LogisticRegression(max_iter=1000)

# 학습
xgb.fit(X_train, y_train)
lgbm.fit(X_train, y_train)

# LR은 정규화 필요
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
lr.fit(X_train_scaled, y_train)

# 앙상블 (평균)
y_pred_xgb = xgb.predict_proba(X_test)[:, 1]
y_pred_lgbm = lgbm.predict_proba(X_test)[:, 1]
y_pred_lr = lr.predict_proba(X_test_scaled)[:, 1]

y_pred_ensemble = (y_pred_xgb + y_pred_lgbm + y_pred_lr) / 3
auc_ensemble = roc_auc_score(y_test, y_pred_ensemble)
print(f"Ensemble AUC: {auc_ensemble:.4f}")
```

### 5. 책의 한계 5가지

#### 한계 ①: WoE 단계 없음
책 실습 1은 XGBoost 직접 학습. WoE는 실습 2 (OptBinning) 에서.

#### 한계 ②: 시간 분리 부재
랜덤 split만. **OOT 검증 필요**.

#### 한계 ③: 검증 모니터링 미언급
운영 후 PSI 모니터링 코드 없음.

#### 한계 ④: 정규화/Calibration 없음
ML 모델 확률은 보정 필요.

#### 한계 ⑤: Fairness 검증 없음
차별 검증 (gender, age 등) 없음.

---

### 🟣 [전공자 심화] — XGBoost / GBDT 의 신용평가 적용과 후속 연구

#### XGBoost (Chen-Guestrin 2016) 의 한계
- **2차 미분 근사 (Newton boosting)**: cross-entropy 손실 가정. 비즈니스 비용 함수(asymmetric cost) 에 직접 적용 어려움.
- **범주형 변수 처리**: 원본 XGBoost (≤1.5) 는 one-hot 필요. CatBoost (Prokhorenkova 2018) 의 ordered target statistics 와 비교.
- **결측치 처리의 split-aware 가정**: 결측을 한 방향으로 일관 라우팅. 결측 패턴이 부도와 강한 상관일 때 OK 이나, MAR 아닐 시 편향.
- **Calibration 부재**: GBDT 의 sigmoid 출력은 well-calibrated 아님. Isotonic / Platt scaling 필수.
- **해석 가능성**: SHAP 으로 보완 가능하나, 깊은 트리 + 많은 변수에서 직관적 reason code 생성 어려움.

#### 비판/비교 문헌
- Chen, T., & Guestrin, C. (2016). XGBoost: A scalable tree boosting system. *KDD 2016*, 785-794. https://doi.org/10.1145/2939672.2939785 — 원논문.
- Ke, G., Meng, Q., Finley, T., Wang, T., Chen, W., Ma, W., Ye, Q., & Liu, T.-Y. (2017). LightGBM: A highly efficient gradient boosting decision tree. *NeurIPS 2017*. — GOSS + EFB 로 속도 5-10배 향상.
- Prokhorenkova, L., Gusev, G., Vorobev, A., Dorogush, A. V., & Gulin, A. (2018). CatBoost: Unbiased boosting with categorical features. *NeurIPS 2018*. — Target leakage 제거 + 범주형 자연 처리.
- Shwartz-Ziv, R., & Armon, A. (2022). Tabular data: Deep learning is not all you need. *Information Fusion*, 81, 84-90. https://doi.org/10.1016/j.inffus.2021.11.011 — **정형 데이터에서 GBDT 가 TabNet/SAINT 등 DNN 보다 일관되게 우위**.
- Grinsztajn, L., Oyallon, E., & Varoquaux, G. (2022). Why do tree-based models still outperform deep learning on typical tabular data? *NeurIPS 2022 Datasets and Benchmarks*. — 작은 정형 데이터에서 GBDT 우위의 원인(불균일 함수 학습, 회전 불변성 부재 등) 분석.

#### 후속 연구 동향 — 신용평가 ML (2020~)
- Gunnarsson, B. R., vanden Broucke, S., Baesens, B., Óskarsdóttir, M., & Lemahieu, W. (2021). Deep learning for credit scoring: Do or don't? *European Journal of Operational Research*, 295(1), 292-305. — 신용평가에서 DNN 의 추가 가치 미미.
- Moscato, V., Picariello, A., & Sperlí, G. (2021). A benchmark of machine learning approaches for credit score prediction. *Expert Systems with Applications*, 165, 113986. — XGBoost/LightGBM/CatBoost 비교, LightGBM 우세 보고.
- Bussmann, N., Giudici, P., Marinelli, D., & Papenbrock, J. (2021). Explainable machine learning in credit risk management. *Computational Economics*, 57(1), 203-216. — XGBoost + SHAP 의 IFRS 9 ECL 적용.
- Roa, L., Correa-Bahnsen, A., Suarez, G., Cortés-Tejada, F., Luque, M. A., & Bravo, C. (2021). Super-app behavioral patterns in credit risk models: Financial, statistical and regulatory implications. *Expert Systems with Applications*, 169, 114486. — 콜롬비아 super-app(라파니 류) 행동 데이터 + GBDT.
- Babaei, G., Giudici, P., & Raffinetti, E. (2025). Explainable artificial intelligence for credit scoring in banking. *Journal of Risk*, forthcoming. — Shapley-Lorenz 측도로 fairness 통합.

#### 한국 적용 시 주의점
- **한국 시중은행의 ML 도입**: KB·신한·우리·하나 모두 XGBoost/LightGBM 을 보조 모형(Challenger) 로 운영. Champion 은 여전히 LR 스코어카드 (해석성 + 모형 거버넌스).
- **금감원 모형 검증**: ML 모형도 검증 항목 동일 (AUC, KS, PSI, 백테스팅) 이나, **SHAP global feature importance + monotonicity constraint** 권고. XGBoost `monotone_constraints` 활용.
- **인터넷전문은행**: 카카오뱅크/케이뱅크/토스뱅크는 LightGBM/CatBoost 메인. 마이데이터 변수 (수백 개) 활용 + 자동 승인율 70% 이상.
- **K-IFRS 9 PD calibration**: GBDT raw probability → Isotonic regression 으로 PIT-PD 변환 표준. Brier score < 0.05 목표.
- **변수 중요도 안정성**: XGBoost gain-based importance 는 학습 sample 변동에 민감. SHAP global importance + permutation importance 병행 권장.
- **데이터 누설 (target leakage)**: K-IFRS 적용일 이후 관측된 변수 (예: 잔액, 연체일수) 가 학습 데이터에 들어가지 않도록 시점 통제 필요. CatBoost 의 ordered TS 가 leakage 방지에 유리.

---

## 📚 책에 없지만 알면 좋은 것

### 🔍 보충 1 — 메모리 절약

```python
# 데이터 타입 다운캐스팅
def reduce_mem_usage(df):
    for col in df.columns:
        col_type = df[col].dtype
        if col_type != object:
            c_min, c_max = df[col].min(), df[col].max()
            if str(col_type)[:3] == 'int':
                if c_min > np.iinfo(np.int8).min and c_max < np.iinfo(np.int8).max:
                    df[col] = df[col].astype(np.int8)
                elif c_min > np.iinfo(np.int16).min and c_max < np.iinfo(np.int16).max:
                    df[col] = df[col].astype(np.int16)
                elif c_min > np.iinfo(np.int32).min and c_max < np.iinfo(np.int32).max:
                    df[col] = df[col].astype(np.int32)
            else:
                if c_min > np.finfo(np.float16).min and c_max < np.finfo(np.float16).max:
                    df[col] = df[col].astype(np.float16)
                elif c_min > np.finfo(np.float32).min and c_max < np.finfo(np.float32).max:
                    df[col] = df[col].astype(np.float32)
    return df
```

### 🔍 보충 2 — Feature Importance 비교

```python
# 1. Built-in
xgb.feature_importances_

# 2. Permutation
from sklearn.inspection import permutation_importance
perm = permutation_importance(xgb, X_test, y_test, n_repeats=10, random_state=42)

# 3. SHAP (가장 정확)
shap_values = explainer.shap_values(X_test)
shap_importance = np.abs(shap_values).mean(axis=0)
```

### 🔍 보충 3 — Cross-validation Score

```python
from sklearn.model_selection import cross_val_score, StratifiedKFold

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(model, X, y, cv=skf, scoring='roc_auc')
print(f"CV AUC: {scores.mean():.4f} ± {scores.std():.4f}")
```

### 🔍 보충 4 — Lift / Gain Chart

```python
import matplotlib.pyplot as plt

def gain_chart(y_true, y_pred_proba, n_bins=10):
    df = pd.DataFrame({'y': y_true, 'p': y_pred_proba})
    df = df.sort_values('p', ascending=False)
    df['bin'] = pd.qcut(df['p'].rank(method='first'), n_bins, labels=False)
    
    gain = df.groupby('bin')['y'].sum().cumsum() / df['y'].sum()
    return gain

gain = gain_chart(y_test, y_pred_proba)
plt.plot(range(1, 11), gain.values, marker='o')
plt.plot([1, 10], [0.1, 1], 'k--', label='Random')
plt.xlabel('Decile')
plt.ylabel('Cumulative % of Defaults')
plt.title('Gain Chart')
plt.legend()
plt.show()
```

### 🔍 보충 5 — 모델 저장과 로드

```python
# 저장
import joblib
joblib.dump(model, 'credit_model.pkl')

# 로드
loaded = joblib.load('credit_model.pkl')
predictions = loaded.predict_proba(X_new)
```

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. AmEx 데이터 50GB가 너무 큼

**A.** **샘플 사용 권장**.
- `amex-data-sampled` (10만 행)
- 또는 직접 일부만 로딩

### Q2. AUC 0.95+ 나옴

**A.** **의심**. 점검:
- 라벨 누설 (target 정보가 피처에 섞임)
- 시간 분리 안 함
- target 인코딩 잘못

### Q3. SHAP가 너무 느림

**A.** **샘플링** 또는 **GPU**:
```python
# 1000개만
shap_values = explainer.shap_values(X_test.sample(1000))
```

### Q4. XGBoost vs. LightGBM?

**A.**

| | XGBoost | LightGBM |
|---|---|---|
| 속도 | 보통 | 빠름 |
| 메모리 | 많이 | 적게 |
| 정확도 | 비슷 | 비슷 |
| 작은 데이터 | OK | 별로 |

→ **AmEx 같은 큰 데이터: LightGBM**, 작은 데이터: XGBoost.

### Q5. 부도율 5%면 어떻게 처리?

**A.** 옵션:
1. `scale_pos_weight=19` (XGBoost)
2. SMOTE oversampling
3. 데이터는 그대로 + 메트릭만 PR-AUC 사용

→ 1, 3 추천.

### Q6. 학습 시간이 너무 김

**A.**
- `early_stopping_rounds` 설정
- `tree_method='hist'` (XGBoost)
- 데이터 샘플링
- GPU 사용

```python
model = XGBClassifier(tree_method='hist', device='cuda')
```

### Q7. 모델이 운영 가능한 수준?

**A.** 체크리스트:
- ✓ AUC > 0.80
- ✓ KS > 0.40
- ✓ Calibration 확인
- ✓ SHAP 해석 가능
- ✓ Fairness 검증
- ✓ OOT 검증
- ✓ PSI 모니터링 준비

---

## 🎯 핵심 7가지

1. **AmEx 데이터** = 920개 익명 피처 + 부도 라벨.
2. **결측치 80%+ 컬럼 제거** + 나머지 중앙값 대체.
3. **XGBoost + scale_pos_weight** 로 불균형 처리.
4. **Stratified Split + Early Stopping** 표준.
5. **AUC 0.80~0.85, KS 0.45~0.55** 가 한국 표준 수준.
6. **SHAP** 으로 모델 해석 + 거절 사유 생성.
7. **PD → Credit Score** 변환 (PDO 20, Base 600).

---

## 📖 더 읽을거리

### Kaggle
- AmEx 대회: https://www.kaggle.com/c/amex-default-prediction
- Home Credit: https://www.kaggle.com/c/home-credit-default-risk
- 1위 솔루션 노트북 (책의 데이터 기반)

### XGBoost
- Chen, T., & Guestrin, C. (2016). XGBoost: A scalable tree boosting system. *KDD*.

### SHAP
- Lundberg, S. M., & Lee, S.-I. (2017). A unified approach to interpreting model predictions. *NeurIPS*.

### 한국 신용평가 코드
- pykrx 활용 한국 주식
- NICE/KCB는 비공개 데이터

---

> **다음 실습** — Lab 2: OptBinning 라이브러리를 활용한 신용 평가 모델
> WoE/IV 자동화 + Scorecard 생성 + Logistic Regression.
