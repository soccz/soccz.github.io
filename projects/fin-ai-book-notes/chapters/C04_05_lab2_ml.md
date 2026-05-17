# 실습 2: 머신러닝 기반 신용카드 사기 탐지 — *Lab 2: ML-Based Fraud Detection*

> **해설 분량**: 약 28쪽
> **데이터**: Kaggle Credit Card Fraud Detection
> **소요 시간**: 6~10시간

---

## 🪧 이 실습을 한 줄로

> **지도 학습 (XGBoost + SMOTE)** + **비지도 학습 (Isolation Forest, Autoencoder)** 으로 신용카드 사기 탐지.

책은 4가지 ML 방법 (지도 + 비지도) 으로 진행. 이 해설집은:
1. **Kaggle Credit Card 데이터 풀이**
2. **SMOTE 깊이 보기**
3. **Isolation Forest + Autoencoder** 비교
4. **앙상블 전략**

### 📍 흐름

<svg viewBox="0 0 760 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">Lab 2 — ML 기반 사기 탐지 4가지 방법</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <rect x="40" y="60" width="160" height="180" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="120" y="85" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">지도 ① XGBoost+SMOTE</text>
    <text x="120" y="115" text-anchor="middle" font-size="10" fill="#1c1917">불균형 → SMOTE</text>
    <text x="120" y="135" text-anchor="middle" font-size="10" fill="#1c1917">분류기 학습</text>
    <text x="120" y="160" text-anchor="middle" font-size="11" fill="#c4724e" font-weight="700">PR-AUC: 0.85</text>
    <text x="120" y="190" text-anchor="middle" font-size="9" fill="#57534e">알려진 패턴</text>
    <text x="120" y="220" text-anchor="middle" font-size="9" fill="#57534e">학습 표준</text>
    <rect x="210" y="60" width="160" height="180" rx="8" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="290" y="85" text-anchor="middle" font-size="13" font-weight="700" fill="#5a7a96">지도 ② Logistic+SMOTE</text>
    <text x="290" y="115" text-anchor="middle" font-size="10" fill="#1c1917">해석 가능</text>
    <text x="290" y="135" text-anchor="middle" font-size="10" fill="#1c1917">빠른 학습</text>
    <text x="290" y="160" text-anchor="middle" font-size="11" fill="#5a7a96" font-weight="700">PR-AUC: 0.75</text>
    <text x="290" y="190" text-anchor="middle" font-size="9" fill="#57534e">베이스라인</text>
    <text x="290" y="220" text-anchor="middle" font-size="9" fill="#57534e">규제 친화</text>
    <rect x="380" y="60" width="160" height="180" rx="8" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="460" y="85" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">비지도 ③ Isolation Forest</text>
    <text x="460" y="115" text-anchor="middle" font-size="10" fill="#1c1917">트리 기반</text>
    <text x="460" y="135" text-anchor="middle" font-size="10" fill="#1c1917">이상치 탐지</text>
    <text x="460" y="160" text-anchor="middle" font-size="11" fill="#3a7d44" font-weight="700">PR-AUC: 0.40</text>
    <text x="460" y="190" text-anchor="middle" font-size="9" fill="#57534e">라벨 불필요</text>
    <text x="460" y="220" text-anchor="middle" font-size="9" fill="#57534e">새 패턴 발견</text>
    <rect x="550" y="60" width="170" height="180" rx="8" fill="#f5e6f0" stroke="#7a6a9a"/>
    <text x="635" y="85" text-anchor="middle" font-size="13" font-weight="700" fill="#7a6a9a">비지도 ④ Autoencoder</text>
    <text x="635" y="115" text-anchor="middle" font-size="10" fill="#1c1917">DL 기반</text>
    <text x="635" y="135" text-anchor="middle" font-size="10" fill="#1c1917">재구성 오차</text>
    <text x="635" y="160" text-anchor="middle" font-size="11" fill="#7a6a9a" font-weight="700">PR-AUC: 0.55</text>
    <text x="635" y="190" text-anchor="middle" font-size="9" fill="#57534e">복잡한 패턴</text>
    <text x="635" y="220" text-anchor="middle" font-size="9" fill="#57534e">GPU 필요</text>
  </g>
</svg>

---

## 🟢 [초급] — Kaggle Credit Card 데이터

### 1. 데이터셋 소개

**Kaggle Credit Card Fraud Detection**:
- 유럽 신용카드 거래 (2013.9)
- **284,807 거래**
- **492건이 사기** (0.172%)
- 28개 PCA 변환된 피처 (V1~V28) + Time + Amount + Class

> 💡 책 §4 실습 2 도입부 인용: **"신용카드 사기 사건 중 60% 이상이 가짜 신용카드를 통해 발생"** → 사기 탐지가 단순 "도난 카드" 가 아닌 **위조·복제 카드** 식별 문제임을 강조. 이 비율은 PCA 변환된 V1~V28 피처가 잡으려는 핵심 패턴.

```python
import pandas as pd

df = pd.read_csv('/kaggle/input/creditcardfraud/creditcard.csv')
print(f"Shape: {df.shape}")
print(f"사기율: {df['Class'].mean():.3%}")
df.head()
```

### 2. 사기 라벨링 방법 — 책 본문

#### 방법 ①: 고객 제보 (Chargeback)
- 명세서에서 "내가 안 한 거래" 발견
- 카드사에 이의 제기
- 30~120일 후 라벨 확정

#### 방법 ②: 내부 전문가 식별
- 사기 탐지 팀 운영
- 의심 거래 모니터링
- 즉시 라벨링 (며칠 단위)

### 3. 데이터 시각화

```python
import matplotlib.pyplot as plt
import seaborn as sns

# 클래스 분포
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

axes[0].pie(df['Class'].value_counts(), labels=['Normal', 'Fraud'], 
            autopct='%1.2f%%', colors=['#3a7d44', '#c4724e'])
axes[0].set_title('Class Distribution')

# Amount 분포
sns.histplot(data=df, x='Amount', hue='Class', bins=50, log_scale=True, ax=axes[1])
axes[1].set_title('Amount Distribution')

# Time 분포
sns.histplot(data=df, x='Time', hue='Class', bins=50, ax=axes[2])
axes[2].set_title('Time Distribution')

plt.tight_layout()
plt.show()
```

> ✅ **여기까지 따라왔으면**: 데이터 환경 준비 완료.

---

## 🟡 [중급] — 지도 학습: XGBoost + SMOTE

### 1. 데이터 분할 + Stratify

```python
from sklearn.model_selection import train_test_split

X = df.drop('Class', axis=1)
y = df['Class']

# 층화 추출 (사기 비율 유지)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

print(f"Train: {len(X_train)}, 사기: {y_train.sum()}")
print(f"Test: {len(X_test)}, 사기: {y_test.sum()}")
```

### 2. SMOTE — 불균형 해결

```python
from imblearn.over_sampling import SMOTE

# SMOTE 적용 (Train에만!)
smote = SMOTE(random_state=42)
X_train_res, y_train_res = smote.fit_resample(X_train, y_train)

print(f"Before SMOTE: {y_train.value_counts().to_dict()}")
print(f"After SMOTE: {pd.Series(y_train_res).value_counts().to_dict()}")
```

> ⚠️ **SMOTE는 Train에만 적용**. Test에 적용하면 평가 왜곡.

### 3. XGBoost 학습

```python
from xgboost import XGBClassifier

model = XGBClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1,
    eval_metric='aucpr',  # PR-AUC (불균형 데이터에 적합)
    random_state=42,
)

# SMOTE 데이터로 학습
model.fit(X_train_res, y_train_res)
```

### 4. 평가 — PR-AUC 중심

```python
from sklearn.metrics import (
    roc_auc_score, average_precision_score,
    precision_recall_curve, classification_report
)

y_pred_proba = model.predict_proba(X_test)[:, 1]
y_pred = model.predict(X_test)

# 메트릭
print(f"ROC-AUC: {roc_auc_score(y_test, y_pred_proba):.3f}")
print(f"PR-AUC: {average_precision_score(y_test, y_pred_proba):.3f}")
print(classification_report(y_test, y_pred))

# PR Curve
precision, recall, thresholds = precision_recall_curve(y_test, y_pred_proba)
plt.plot(recall, precision)
plt.xlabel('Recall')
plt.ylabel('Precision')
plt.title(f'PR Curve (AP={average_precision_score(y_test, y_pred_proba):.3f})')
plt.show()
```

### 5. Pipeline으로 통합

```python
from imblearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('smote', SMOTE(random_state=42)),
    ('xgb', XGBClassifier(eval_metric='aucpr'))
])

pipeline.fit(X_train, y_train)
y_pred_proba = pipeline.predict_proba(X_test)[:, 1]
```

> ✅ **여기까지 따라왔으면**: 지도 학습 사기 탐지 모델 완성.

---

## 🔴 [고급] — 비지도 학습: Isolation Forest

### 1. Isolation Forest 개념

#### 핵심 아이디어
> "이상치는 빨리 분리된다"

```
[정상]: 깊은 트리에서야 분리
[이상]: 얕은 트리에서 분리
   → Path Length로 점수
```

#### 수식
$$ s(x, n) = 2^{-\frac{E(h(x))}{c(n)}} $$

- $E(h(x))$: 평균 path 길이
- $c(n)$: 정상화 상수

값:
- 점수 → 1 (이상치)
- 점수 → 0.5 (정상)
- 점수 → 0 (확실 정상)

### 2. 학습

```python
from sklearn.ensemble import IsolationForest

# 비지도 (라벨 X)
iso_forest = IsolationForest(
    n_estimators=200,
    contamination=0.002,  # 사기 비율 (0.172%)
    max_samples='auto',
    random_state=42,
    n_jobs=-1,
)

# 학습 (정상 데이터만 또는 전체)
iso_forest.fit(X_train)

# 예측
# -1: 이상치 (사기), 1: 정상
predictions = iso_forest.predict(X_test)
y_pred = (predictions == -1).astype(int)

# 이상 점수
anomaly_scores = -iso_forest.score_samples(X_test)  # 음수 → 양수로
```

### 3. 평가

```python
from sklearn.metrics import roc_auc_score, average_precision_score

auc = roc_auc_score(y_test, anomaly_scores)
ap = average_precision_score(y_test, anomaly_scores)
print(f"ROC-AUC: {auc:.3f}")
print(f"PR-AUC: {ap:.3f}")
# 보통: ROC-AUC 0.94, PR-AUC 0.40
```

### 4. Threshold 조정

```python
import numpy as np

# 상위 N%를 사기로 분류
threshold = np.percentile(anomaly_scores, 99.8)  # 상위 0.2%
y_pred = (anomaly_scores > threshold).astype(int)

print(classification_report(y_test, y_pred))
```

### 5. 하이퍼파라미터 튜닝

```python
from sklearn.model_selection import ParameterGrid

param_grid = {
    'n_estimators': [100, 200, 500],
    'max_samples': [256, 512, 1024],
    'contamination': [0.001, 0.002, 0.005],
}

best_score = 0
best_params = None
for params in ParameterGrid(param_grid):
    iso = IsolationForest(**params, random_state=42)
    iso.fit(X_train)
    scores = -iso.score_samples(X_test)
    auc = roc_auc_score(y_test, scores)
    
    if auc > best_score:
        best_score = auc
        best_params = params

print(f"Best AUC: {best_score:.3f}")
print(f"Best params: {best_params}")
```

---

## 🟣 [전공자] — Autoencoder + 앙상블

### 1. Autoencoder 기반 사기 탐지

#### 1.1 아이디어
> "정상 데이터로 학습 → 사기는 재구성 잘 안 됨 → 큰 오차 = 사기"

#### 1.2 모델

```python
import tensorflow as tf
from tensorflow.keras import layers, Model

# 정규화
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X_train_normal = X_train[y_train == 0]  # 정상만
X_train_scaled = scaler.fit_transform(X_train_normal)
X_test_scaled = scaler.transform(X_test)

# Autoencoder 구조
input_dim = X_train_scaled.shape[1]
encoding_dim = 14

input_layer = tf.keras.Input(shape=(input_dim,))

# Encoder
encoded = layers.Dense(28, activation='relu')(input_layer)
encoded = layers.Dense(encoding_dim, activation='relu')(encoded)

# Decoder
decoded = layers.Dense(28, activation='relu')(encoded)
decoded = layers.Dense(input_dim, activation='linear')(decoded)

autoencoder = Model(input_layer, decoded)
autoencoder.compile(optimizer='adam', loss='mse')

# 학습 (정상만)
history = autoencoder.fit(
    X_train_scaled, X_train_scaled,
    epochs=20,
    batch_size=64,
    validation_split=0.1,
    verbose=0
)
```

#### 1.3 평가

```python
# 재구성
X_test_reconstructed = autoencoder.predict(X_test_scaled)

# 재구성 오차 (MSE)
mse = np.mean(np.power(X_test_scaled - X_test_reconstructed, 2), axis=1)

# 평가
auc = roc_auc_score(y_test, mse)
ap = average_precision_score(y_test, mse)
print(f"ROC-AUC: {auc:.3f}")
print(f"PR-AUC: {ap:.3f}")
# 보통: ROC-AUC 0.95, PR-AUC 0.55
```

#### 1.4 시각화

```python
plt.figure(figsize=(10, 5))
plt.hist(mse[y_test == 0], bins=100, alpha=0.5, label='Normal', density=True)
plt.hist(mse[y_test == 1], bins=100, alpha=0.5, label='Fraud', density=True)
plt.xlabel('Reconstruction Error')
plt.ylabel('Density')
plt.yscale('log')
plt.legend()
plt.show()
```

### 2. 앙상블 — 3가지 모델 결합

```python
# 각 모델 점수
score_xgb = pipeline.predict_proba(X_test)[:, 1]
score_iso = -iso_forest.score_samples(X_test)
score_ae = mse

# 정규화 (0~1)
def normalize(scores):
    return (scores - scores.min()) / (scores.max() - scores.min())

score_xgb_norm = normalize(score_xgb)
score_iso_norm = normalize(score_iso)
score_ae_norm = normalize(score_ae)

# 가중 평균
ensemble_score = 0.5 * score_xgb_norm + 0.25 * score_iso_norm + 0.25 * score_ae_norm

# 평가
auc = roc_auc_score(y_test, ensemble_score)
ap = average_precision_score(y_test, ensemble_score)
print(f"Ensemble ROC-AUC: {auc:.3f}")
print(f"Ensemble PR-AUC: {ap:.3f}")
# 보통 단일 모델보다 0.03~0.05 향상
```

### 3. 책의 한계 5가지

#### 한계 ①: PR-AUC 강조 부재
불균형 데이터에서 PR-AUC 필수. 책은 ROC-AUC 위주.

#### 한계 ②: SMOTE 한계 미언급
SMOTE는 가상 데이터 → 실제 사기 패턴과 다를 수 있음.

#### 한계 ③: Threshold 최적화 부재
비즈니스 비용 기반 임계값 결정 없음.

#### 한계 ④: 시계열 미반영
사기는 시퀀스 패턴 → LSTM 필요 (Lab 3).

#### 한계 ⑤: 앙상블 전략 미언급
실전 시스템은 다중 모델 결합.

### 🟣 [전공자 심화] — Autoencoder · 앙상블 사기 탐지의 한계와 후속 연구

#### 원논문 한계

**Autoencoder 기반 이상 탐지 (Hawkins et al. 2002; Sakurada & Yairi 2014)**
- "정상으로만 학습 → 사기 재구성 오차 큼" 가정은 사기가 정상에 *임베디드*된 경우(예: 카드 도용 직후 평균 사용 패턴 모방) 깨짐.
- 모델 capacity가 충분히 크면 사기 데이터도 재구성해 버려 점수 분리력 상실.
- Threshold 선택이 학습 데이터의 reconstruction error 분위수에 의존 → 분포 변화에 취약.

**Dal Pozzolo et al. (2014) — Undersampling/SMOTE**
- SMOTE는 minority 클래스의 k-NN 보간 → 사기와 정상이 같은 manifold 가까이 있으면 *경계 부근* 합성 데이터가 오히려 결정경계를 흐림.
- Random undersampling은 정상 클래스의 정보 손실 → 모델의 calibration 무너짐(편향된 사후확률).

#### 비판 문헌

- **Liu, X.-Y., Wu, J., & Zhou, Z.-H. (2009). Exploratory undersampling for class-imbalance learning. *IEEE Trans. SMC-B*, 39(2).** — Random undersampling의 정보 손실을 EasyEnsemble·BalanceCascade로 보완.
- **Krawczyk, B. (2016). Learning from imbalanced data: open challenges and future directions. *Progress in Artificial Intelligence*, 5(4), 221–232.** — SMOTE 변종(Borderline-SMOTE, ADASYN, SMOTE-NC)의 trade-off 정리.
- **Goldstein, M., & Uchida, S. (2016). A comparative evaluation of unsupervised anomaly detection algorithms for multivariate data. *PLOS ONE*, 11(4).** — Autoencoder가 모든 비지도 AD를 일관되게 이기지 못함을 19개 데이터셋 실증.
- **Le Borgne, Y.-A., Siblini, W., Lebichot, B., & Bontempi, G. (2022). *Reproducible Machine Learning for Credit Card Fraud Detection — Practical Handbook*.** https://fraud-detection-handbook.github.io/ — Dal Pozzolo 후속 그룹의 신용카드 사기 탐지 reproducible 핸드북. SMOTE 한계와 시계열 split 강조.

#### 후속 연구 동향 (2020~)

- **Deep SVDD**: Ruff, L., Vandermeulen, R., Goernitz, N., et al. (2018). *Deep one-class classification.* ICML 2018. — Autoencoder의 reconstruction loss 대신 hypersphere objective 사용, "hypersphere collapse" 회피 기법 포함.
- **f-AnoGAN**: Schlegl, T., Seeböck, P., Waldstein, S. M., et al. (2019). *f-AnoGAN: Fast unsupervised anomaly detection with generative adversarial networks.* Medical Image Analysis, 54. — GAN 기반 재구성으로 Autoencoder의 over-generalization 완화.
- **PyOD 통합**: Zhao, Y., Nasrullah, Z., & Li, Z. (2019). PyOD: A Python toolbox for scalable outlier detection. *JMLR* 20(96). https://pyod.readthedocs.io/ — 40+ 알고리즘 단일 인터페이스로 ensemble.
- **Cost-sensitive deep learning**: Khan, S. H., Hayat, M., Bennamoun, M., Sohel, F. A., & Togneri, R. (2018). *Cost-sensitive learning of deep feature representations from imbalanced data.* IEEE TNNLS, 29(8). arXiv:1508.03422
- **Self-supervised 사기 탐지**: Bergman, L., & Hoshen, Y. (2020). *Classification-based anomaly detection for general data.* ICLR 2020. arXiv:2005.02359 — 비지도 task로 self-supervision 후 분류기 활용.

#### 한국 적용 시 주의점

- 한국 카드사 실데이터는 시간 순 누락·차지백 지연이 결합 → *반드시* time-based split + 라벨 지연 모델링. Random split 결과는 lab 결과보다 과대평가됨.
- Autoencoder는 학습 시 GPU 1장으로도 가능하나, 실제 운영 시 *재학습 주기*가 짧아야 함(분포 변화) → MLOps 비용 부담.
- 카뱅·토스 같은 모바일 중심 환경은 디바이스·세션 피처가 풍부 → tabular Autoencoder만으로는 약하고 sequence model(Transformer for tabular sequence) 또는 GNN 보완 필요.
- SMOTE를 production pipeline에 넣을 때는 *fold 내부에서만* 적용해야 data leakage 방지(Lab 1의 sklearn `Pipeline` + `imblearn.Pipeline` 차이 주의).

---

## 📚 책에 없지만 알면 좋은 것

### 🔍 보충 1 — One-Class SVM

```python
from sklearn.svm import OneClassSVM

ocsvm = OneClassSVM(nu=0.002, kernel='rbf', gamma='auto')
ocsvm.fit(X_train_normal)  # 정상만 학습

scores = -ocsvm.score_samples(X_test)
```

### 🔍 보충 2 — Local Outlier Factor

```python
from sklearn.neighbors import LocalOutlierFactor

lof = LocalOutlierFactor(n_neighbors=20, novelty=True, contamination=0.002)
lof.fit(X_train_normal)
scores = -lof.score_samples(X_test)
```

### 🔍 보충 3 — DBSCAN

```python
from sklearn.cluster import DBSCAN

# Noise (cluster=-1) = 이상치
dbscan = DBSCAN(eps=0.5, min_samples=5)
clusters = dbscan.fit_predict(X)
y_pred = (clusters == -1).astype(int)
```

### 🔍 보충 4 — Variational Autoencoder (VAE)

```python
# VAE - 확률적 잠재 공간
# 더 정교한 이상치 탐지
class VAE(tf.keras.Model):
    def __init__(self, latent_dim):
        super().__init__()
        # Encoder
        self.encoder = ...
        # Decoder
        self.decoder = ...
    
    def call(self, x):
        z_mean, z_log_var = self.encoder(x)
        z = self.sample(z_mean, z_log_var)
        return self.decoder(z)
```

### 🔍 보충 5 — Cost-Sensitive Loss

```python
# XGBoost custom loss
def custom_obj(y_pred, dtrain):
    y_true = dtrain.get_label()
    cost_fp = 1   # 정상 → 사기 오인
    cost_fn = 10  # 사기 → 정상 누락
    
    weights = np.where(y_true == 1, cost_fn, cost_fp)
    grad = (y_pred - y_true) * weights
    hess = np.ones_like(y_pred) * weights
    return grad, hess
```

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. SMOTE를 Test에 적용하면?

**A.** **절대 안 됨**. 이유:
- Test는 실전 분포를 반영해야
- SMOTE 적용 시 결과 왜곡
- → Train에만 적용

### Q2. Isolation Forest가 XGBoost보다 못한가?

**A.** **다른 강점**.

- XGBoost: 알려진 사기 정확
- Isolation Forest: 새 사기 발견
- **앙상블이 최고**

### Q3. Autoencoder 학습이 너무 느림

**A.**
- GPU 사용
- Batch size 키움
- Early Stopping
- 모델 단순화 (encoding_dim 작게)

### Q4. PR-AUC가 ROC-AUC보다 좋은 이유?

**A.** **불균형 데이터**에서:
- ROC-AUC: 양성/음성 비율 둔감
- PR-AUC: 양성 (사기)에 민감

→ 사기율 0.172% 같은 극단 불균형에 적합.

### Q5. 비지도 학습이 실전에 쓰이나?

**A.** **하이브리드로**:
- 1차: 지도 학습 (알려진 사기)
- 2차: 비지도 (새 패턴 발견)
- 3차: 사람 검토

### Q6. 모델 성능이 너무 좋게 나옴

**A.** 점검:
- Test에 SMOTE 적용?
- 시간 누설 (Time column)?
- PCA 변환 시 정보 누설?

### Q7. 실전에서 어느 모델?

**A.** **XGBoost + SMOTE** 가 한국 카드사 표준.
- 안정적
- 해석 쉬움 (SHAP)
- 실시간 가능

---

## 🎯 핵심 7가지

1. **Kaggle Credit Card** 데이터: 284K 거래, 492건 사기 (0.172%).
2. **SMOTE는 Train에만** 적용 (Test 절대 X).
3. **PR-AUC** 가 불균형 데이터에 적합.
4. **Isolation Forest**: 비지도, 새 사기 발견.
5. **Autoencoder**: 정상 데이터 학습 → 재구성 오차 = 사기.
6. **앙상블** (XGBoost + Iso + AE) 이 단일 모델보다 0.03~0.05 향상.
7. **Cost-sensitive Loss** 로 FN/FP 비용 비대칭 반영.

---

## 📖 더 읽을거리

### 데이터
- Kaggle: https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud

### 학술
- Liu, F. T., et al. (2008). Isolation forest. *ICDM*.
- Dal Pozzolo, A., et al. (2014). Learned lessons in credit card fraud detection. *ESWA*.

### 라이브러리
- imbalanced-learn: https://imbalanced-learn.org/
- PyOD (Python Outlier Detection): https://pyod.readthedocs.io/

---

> **다음 실습** — Lab 3: 딥러닝 기반 사기 탐지 (LSTM, Transformer)
