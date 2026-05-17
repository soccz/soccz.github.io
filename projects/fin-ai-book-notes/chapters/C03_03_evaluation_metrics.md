# 3.5 신용 평가 모델 평가 지표 — *Credit Model Evaluation Metrics*

> **해설 분량**: 약 25쪽
> **읽는 데 걸리는 시간**: 약 45분

---

## 🪧 이 절을 한 줄로

> 신용평가 모델 평가의 **4대 핵심 지표**: **KS** (분리도), **PSI** (안정성), **Precision/Recall** (균형), **AUC-ROC** (전반).
> 일반 분류 모델 메트릭과 달리, 신용평가는 **이 4가지를 함께** 봐야 한다.

책은 4가지 지표를 각각 1쪽씩 소개. 이 해설집은:
1. **각 지표의 직관 + 수식 + 코드** 통합
2. **언제 어떤 지표 보나** 가이드
3. **한국 신용평가 산업 표준값**

### 📍 미리 그릴 큰 그림

<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">신용평가 모델 4대 평가 지표</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <rect x="40" y="55" width="160" height="200" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="120" y="80" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">① KS</text>
    <text x="120" y="100" text-anchor="middle" font-size="10" fill="#1c1917">Kolmogorov-Smirnov</text>
    <text x="120" y="125" text-anchor="middle" font-size="10" fill="#1c1917">분리도</text>
    <text x="120" y="145" text-anchor="middle" font-size="10" fill="#57534e">"좋은 vs. 나쁜"</text>
    <text x="120" y="160" text-anchor="middle" font-size="10" fill="#57534e">최대 거리</text>
    <text x="120" y="195" text-anchor="middle" font-size="11" font-weight="700" fill="#c4724e">한국 표준 &gt; 0.4</text>
    <text x="120" y="215" text-anchor="middle" font-size="9" fill="#a8a29e">XGBoost: 0.45~0.55</text>
    <text x="120" y="235" text-anchor="middle" font-size="9" fill="#a8a29e">CB 점수: 0.50+</text>
    <rect x="210" y="55" width="160" height="200" rx="8" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="290" y="80" text-anchor="middle" font-size="13" font-weight="700" fill="#5a7a96">② PSI</text>
    <text x="290" y="100" text-anchor="middle" font-size="10" fill="#1c1917">Population Stability</text>
    <text x="290" y="125" text-anchor="middle" font-size="10" fill="#1c1917">안정성</text>
    <text x="290" y="145" text-anchor="middle" font-size="10" fill="#57534e">"시간 따른 분포"</text>
    <text x="290" y="160" text-anchor="middle" font-size="10" fill="#57534e">변화 측정</text>
    <text x="290" y="195" text-anchor="middle" font-size="11" font-weight="700" fill="#5a7a96">&lt;0.1 안정</text>
    <text x="290" y="215" text-anchor="middle" font-size="9" fill="#a8a29e">0.1~0.25 약간 변화</text>
    <text x="290" y="235" text-anchor="middle" font-size="9" fill="#a8a29e">&gt;0.25 재학습 필요</text>
    <rect x="380" y="55" width="160" height="200" rx="8" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="460" y="80" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">③ Precision / Recall</text>
    <text x="460" y="100" text-anchor="middle" font-size="10" fill="#1c1917">정밀도 / 재현율</text>
    <text x="460" y="125" text-anchor="middle" font-size="10" fill="#1c1917">균형</text>
    <text x="460" y="145" text-anchor="middle" font-size="10" fill="#57534e">"오탐 vs. 누락"</text>
    <text x="460" y="160" text-anchor="middle" font-size="10" fill="#57534e">트레이드오프</text>
    <text x="460" y="195" text-anchor="middle" font-size="11" font-weight="700" fill="#3a7d44">F1 = 조화 평균</text>
    <text x="460" y="215" text-anchor="middle" font-size="9" fill="#a8a29e">불균형 데이터 핵심</text>
    <text x="460" y="235" text-anchor="middle" font-size="9" fill="#a8a29e">비즈니스 비용 고려</text>
    <rect x="550" y="55" width="170" height="200" rx="8" fill="#f5e6f0" stroke="#7a6a9a"/>
    <text x="635" y="80" text-anchor="middle" font-size="13" font-weight="700" fill="#7a6a9a">④ AUC-ROC</text>
    <text x="635" y="100" text-anchor="middle" font-size="10" fill="#1c1917">Area Under Curve</text>
    <text x="635" y="125" text-anchor="middle" font-size="10" fill="#1c1917">전반 성능</text>
    <text x="635" y="145" text-anchor="middle" font-size="10" fill="#57534e">"종합 분리력"</text>
    <text x="635" y="160" text-anchor="middle" font-size="10" fill="#57534e">임곗값 무관</text>
    <text x="635" y="195" text-anchor="middle" font-size="11" font-weight="700" fill="#7a6a9a">한국 &gt; 0.8</text>
    <text x="635" y="215" text-anchor="middle" font-size="9" fill="#a8a29e">국내 CB 활용 시</text>
    <text x="635" y="235" text-anchor="middle" font-size="9" fill="#a8a29e">통상 0.80~0.88</text>
  </g>
</svg>

---

## 🟢 [초급] — 각 지표 한 줄 비유

### 1. 네 가지 지표를 일상 비유로

| 지표 | 비유 | 측정 |
|------|------|------|
| **KS** | "좋은 학생 vs. 나쁜 학생을 얼마나 잘 가르는가" | 분리도 |
| **PSI** | "학생들 성적 분포가 작년과 같은가" | 안정성 |
| **Precision** | "내가 '천재'라 한 사람 중 진짜 천재 비율" | 정확함 |
| **Recall** | "전체 천재 중 내가 알아본 비율" | 완전함 |
| **AUC-ROC** | "전체 학생의 성적 순위 매기는 능력" | 종합 |

### 2. 신용평가에서 이 지표들이 다 필요한 이유

```
A 모델: KS = 0.5 (좋음), PSI = 0.3 (불안정)
B 모델: KS = 0.45 (양호), PSI = 0.05 (안정)

→ B 모델이 운영에 더 적합 (시간 흐름에 안정)
```

→ **한 지표만 보면 안 됨**.

> ✅ **여기까지 따라왔으면**: 4가지 지표가 다른 측면 평가한다는 게 보일 거다.

---

## 🟡 [중급] — 각 지표 상세

### 1. KS (Kolmogorov-Smirnov)

#### 1.1 정의

> "좋은 고객 점수 분포와 나쁜 고객 점수 분포의 **최대 거리**"

수식:
$$ KS = \max_t |F_{\text{good}}(t) - F_{\text{bad}}(t)| $$

- $F_{\text{good}}(t)$: 정상 고객 점수의 누적분포
- $F_{\text{bad}}(t)$: 부도 고객 점수의 누적분포

#### 1.2 시각화

<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">KS 통계량 — 누적 분포의 최대 거리</text>
  <line x1="80" y1="260" x2="680" y2="260" stroke="#1c1917" stroke-width="1.5"/>
  <line x1="80" y1="260" x2="80" y2="50" stroke="#1c1917" stroke-width="1.5"/>
  <text x="380" y="285" text-anchor="middle" font-size="11" fill="#57534e">신용 점수</text>
  <text x="50" y="155" text-anchor="middle" font-size="11" fill="#57534e" transform="rotate(-90 50 155)">누적 비율</text>
  <!-- Bad customers curve (steeper) -->
  <path d="M 80 260 Q 200 200, 350 100 T 680 60" fill="none" stroke="#c4724e" stroke-width="2.5"/>
  <text x="200" y="195" font-size="11" fill="#c4724e" font-weight="700">부도 고객 (Bad)</text>
  <!-- Good customers curve (flatter) -->
  <path d="M 80 260 Q 350 250, 500 180 T 680 60" fill="none" stroke="#3a7d44" stroke-width="2.5"/>
  <text x="450" y="240" font-size="11" fill="#3a7d44" font-weight="700">정상 고객 (Good)</text>
  <!-- KS arrow -->
  <line x1="350" y1="100" x2="350" y2="245" stroke="#1c1917" stroke-width="2" stroke-dasharray="3,2"/>
  <text x="370" y="180" font-size="13" font-weight="700" fill="#1c1917">KS = 최대 거리</text>
  <text x="370" y="200" font-size="11" fill="#57534e">(이 그림: 약 0.45)</text>
</svg>

#### 1.3 해석 기준

| KS 값 | 해석 | 비고 |
|-------|------|------|
| < 0.20 | 모델 무의미 | 거의 무작위 |
| 0.20~0.30 | 약함 | 사용 어려움 |
| 0.30~0.40 | 보통 | 일반 신용평가 |
| 0.40~0.50 | 좋음 | 한국 표준 |
| 0.50~0.60 | 매우 좋음 | XGBoost 수준 |
| > 0.60 | 의심 (과적합?) | 검증 필수 |

#### 1.4 Python 코드

```python
import numpy as np
from scipy.stats import ks_2samp

def calculate_ks(y_true, y_pred_proba):
    """KS 통계량 계산"""
    good_scores = y_pred_proba[y_true == 0]
    bad_scores = y_pred_proba[y_true == 1]
    ks_stat, _ = ks_2samp(good_scores, bad_scores)
    return ks_stat

# 사용
ks = calculate_ks(y_test, model.predict_proba(X_test)[:, 1])
print(f"KS: {ks:.3f}")
```

### 2. PSI (Population Stability Index)

#### 2.1 정의

> "모델 입력 (또는 출력) 분포가 **시간에 따라 얼마나 변했는지**"

수식:
$$ PSI = \sum_i (P_{\text{new},i} - P_{\text{old},i}) \cdot \ln\frac{P_{\text{new},i}}{P_{\text{old},i}} $$

#### 2.2 책 표 3-3 풀이

| 신용 등급 | 기준시점 (%E) | 현재 (%O) | %O - %E | ln(%O/%E) | PSI |
|----------|------------|---------|--------|----------|-----|
| 1 | 20.0% | 21.9% | 1.9 | 0.0896 | 0.0017 |
| 2 | 33.3% | 28.1% | -5.2 | -0.1699 | 0.0088 |
| 3 | 33.3% | 34.4% | 1.0 | 0.0308 | 0.0003 |
| 4 | 13.3% | 15.6% | 2.3 | 0.1586 | 0.0036 |
| **합계** | 100% | 100% | - | - | **0.0144** |

→ PSI = 0.0144 → **0.1 미만 → 안정**.

#### 2.3 해석 기준

| PSI 값 | 해석 | 조치 |
|--------|------|------|
| < 0.10 | 안정 | 유지 |
| 0.10~0.25 | 약간 변화 | 모니터링 강화 |
| > 0.25 | 큰 변화 | **재학습 필요** |

#### 2.4 Python 코드

```python
def calculate_psi(expected, actual, buckets=10):
    """PSI 계산"""
    # 구간 나누기
    breakpoints = np.percentile(expected, np.linspace(0, 100, buckets+1))
    
    # 각 구간 비율
    expected_pct = np.histogram(expected, breakpoints)[0] / len(expected)
    actual_pct = np.histogram(actual, breakpoints)[0] / len(actual)
    
    # PSI 계산
    psi = 0
    for e, a in zip(expected_pct, actual_pct):
        if e > 0 and a > 0:
            psi += (a - e) * np.log(a / e)
    return psi

# 사용
psi = calculate_psi(scores_baseline, scores_current)
print(f"PSI: {psi:.3f}")
```

#### 2.5 PSI 활용 — 자동 재학습 시스템

```python
def auto_retrain_check(scores_baseline, scores_current, threshold=0.25):
    psi = calculate_psi(scores_baseline, scores_current)
    if psi > threshold:
        print("⚠ Concept Drift 감지! 재학습 필요")
        trigger_retraining()
    else:
        print(f"안정 (PSI={psi:.3f})")
```

### 3. Precision & Recall

#### 3.1 직관

```
[모델이 "부도"로 예측한 100명]
   진짜 부도 80명 → Precision = 80/100 = 80%
   진짜 정상 20명 (오탐)

[전체 진짜 부도 200명]
   모델이 잡은 80명 → Recall = 80/200 = 40%
   놓친 120명
```

#### 3.2 Confusion Matrix

|  | 예측 정상 | 예측 부도 |
|---|---|---|
| **실제 정상** | TN (True Negative) | **FP** (False Positive) |
| **실제 부도** | **FN** (False Negative) | TP (True Positive) |

수식:
$$ \text{Precision} = \frac{TP}{TP + FP} $$
$$ \text{Recall} = \frac{TP}{TP + FN} $$
$$ F_1 = \frac{2 \cdot P \cdot R}{P + R} $$

#### 3.3 비즈니스 비용

| 신용평가 | 의미 | 비용 |
|---------|------|------|
| **FP** (정상을 부도로) | 좋은 고객 거절 | 매출 손실 100만 |
| **FN** (부도를 정상으로) | 진짜 부도 승인 | 손실 1000만 |

→ 보통 **FN 비용이 10배** → Recall 강조.

#### 3.4 Threshold 조정

```python
# 기본 threshold = 0.5
y_pred_default = (model.predict_proba(X_test)[:, 1] > 0.5).astype(int)

# 보수적 (Recall ↑, Precision ↓)
y_pred_strict = (model.predict_proba(X_test)[:, 1] > 0.3).astype(int)

# 공격적 (Precision ↑, Recall ↓)
y_pred_loose = (model.predict_proba(X_test)[:, 1] > 0.7).astype(int)
```

### 4. AUC-ROC

#### 4.1 정의

> "모든 가능한 임곗값에서의 **TPR vs. FPR** 곡선 아래 면적"

- **TPR** (True Positive Rate) = Recall
- **FPR** (False Positive Rate) = FP / (FP + TN)

#### 4.2 시각화

<svg viewBox="0 0 720 360" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">ROC 곡선 — AUC가 클수록 좋은 모델</text>
  <line x1="100" y1="300" x2="600" y2="300" stroke="#1c1917" stroke-width="1.5"/>
  <line x1="100" y1="300" x2="100" y2="50" stroke="#1c1917" stroke-width="1.5"/>
  <text x="350" y="325" text-anchor="middle" font-size="11">False Positive Rate (FPR)</text>
  <text x="60" y="175" text-anchor="middle" font-size="11" transform="rotate(-90 60 175)">True Positive Rate (TPR)</text>
  <!-- Diagonal (random) -->
  <line x1="100" y1="300" x2="600" y2="50" stroke="#a8a29e" stroke-width="1.5" stroke-dasharray="3,2"/>
  <text x="540" y="60" font-size="10" fill="#a8a29e">랜덤 (AUC=0.5)</text>
  <!-- Good model curve -->
  <path d="M 100 300 Q 150 150, 250 100 Q 400 70, 600 50" fill="none" stroke="#3a7d44" stroke-width="2.5"/>
  <text x="300" y="130" font-size="12" font-weight="700" fill="#3a7d44">좋은 모델 (AUC=0.85)</text>
  <!-- Perfect model -->
  <path d="M 100 300 L 100 50 L 600 50" fill="none" stroke="#5a7a96" stroke-width="2" stroke-dasharray="4,2"/>
  <text x="110" y="45" font-size="10" fill="#5a7a96">완벽 (AUC=1.0)</text>
  <!-- Axes labels -->
  <text x="100" y="315" text-anchor="middle" font-size="9" fill="#57534e">0</text>
  <text x="600" y="315" text-anchor="middle" font-size="9" fill="#57534e">1</text>
  <text x="90" y="305" text-anchor="end" font-size="9" fill="#57534e">0</text>
  <text x="90" y="55" text-anchor="end" font-size="9" fill="#57534e">1</text>
</svg>

#### 4.3 해석 기준 (책 본문)

| AUC | 해석 |
|-----|------|
| 0.5~0.6 | 낮은 성능 (랜덤에 가까움) |
| 0.6~0.7 | 보통 |
| 0.7~0.8 | 양호 |
| 0.8~0.9 | 좋음 |
| 0.9~1.0 | 매우 좋음 (의심 시) |

#### 4.4 한국 신용평가 표준
- 일반 신용평가 모델: **AUC 0.80~0.88**
- CB 데이터 풍부 → 글로벌 평균보다 높음
- 0.9+ 는 드물고 의심 대상

#### 4.5 Python 코드

```python
from sklearn.metrics import roc_auc_score, roc_curve, classification_report
import matplotlib.pyplot as plt

# AUC
y_pred_proba = model.predict_proba(X_test)[:, 1]
auc = roc_auc_score(y_test, y_pred_proba)
print(f"AUC: {auc:.3f}")

# ROC 곡선
fpr, tpr, thresholds = roc_curve(y_test, y_pred_proba)
plt.figure(figsize=(8, 8))
plt.plot(fpr, tpr, label=f'AUC = {auc:.3f}')
plt.plot([0, 1], [0, 1], 'k--', label='Random')
plt.xlabel('FPR')
plt.ylabel('TPR')
plt.legend()
plt.show()

# 분류 보고서
y_pred = (y_pred_proba > 0.5).astype(int)
print(classification_report(y_test, y_pred))
```

### 5. 통합 평가 함수

```python
def evaluate_credit_model(model, X_test, y_test, X_train_baseline=None):
    """신용평가 모델 종합 평가"""
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    y_pred = (y_pred_proba > 0.5).astype(int)
    
    # 1. AUC
    auc = roc_auc_score(y_test, y_pred_proba)
    
    # 2. KS
    ks = calculate_ks(y_test, y_pred_proba)
    
    # 3. Precision/Recall/F1
    from sklearn.metrics import precision_score, recall_score, f1_score
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    
    # 4. PSI (baseline 있을 때만)
    if X_train_baseline is not None:
        baseline_scores = model.predict_proba(X_train_baseline)[:, 1]
        psi = calculate_psi(baseline_scores, y_pred_proba)
    else:
        psi = None
    
    # 출력
    print("=" * 50)
    print(f"AUC      : {auc:.4f}")
    print(f"KS       : {ks:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall   : {recall:.4f}")
    print(f"F1       : {f1:.4f}")
    if psi is not None:
        print(f"PSI      : {psi:.4f}")
    print("=" * 50)
    
    return {'AUC': auc, 'KS': ks, 'Precision': precision, 
            'Recall': recall, 'F1': f1, 'PSI': psi}
```

> ✅ **여기까지 따라왔으면**: 4가지 지표를 한 번에 측정할 수 있을 거다.

---

## 🔴 [고급] — 추가 지표들

### 1. Gini Coefficient

수식: $\text{Gini} = 2 \cdot \text{AUC} - 1$

- AUC = 0.8 → Gini = 0.6
- AUC = 0.9 → Gini = 0.8

한국에서 더 많이 사용. CB 회사 표준.

```python
gini = 2 * auc - 1
print(f"Gini: {gini:.3f}")
```

### 2. Lift Curve

상위 N% 고객 중 부도가 차지하는 비율:

```
상위 10%에 부도 50% 집중 → Lift = 5
상위 20%에 부도 70% 집중 → Lift = 3.5
```

높을수록 좋음.

```python
def lift_chart(y_true, y_pred_proba, n_bins=10):
    df = pd.DataFrame({'true': y_true, 'pred': y_pred_proba})
    df = df.sort_values('pred', ascending=False)
    df['bin'] = pd.qcut(df['pred'].rank(method='first'), n_bins, labels=False)
    
    lift = df.groupby('bin')['true'].mean() / df['true'].mean()
    return lift
```

### 3. KS Curve (전체 곡선)

KS 값뿐 아니라 곡선 자체를 봄:
- 곡선이 위로 빠르게 올라감 = 좋음
- 평평함 = 분리력 부족

### 4. Decile Analysis

10분위로 나눠 부도율 비교:

| 십분위 | 평균 점수 | 부도율 |
|--------|---------|--------|
| 1 (최저점) | 500 | 30% |
| 2 | 600 | 15% |
| 3 | 700 | 8% |
| 4 | 750 | 5% |
| 5 | 800 | 3% |
| ... | ... | ... |
| 10 (최고점) | 950 | 0.5% |

→ 단조 감소 = 좋은 모델.

### 5. Information Value (IV)

피처별 중요도 (구간화):

$$ IV = \sum_i (P_{\text{good},i} - P_{\text{bad},i}) \cdot \ln \frac{P_{\text{good},i}}{P_{\text{bad},i}} $$

| IV 값 | 해석 |
|-------|------|
| < 0.02 | 무의미 |
| 0.02~0.1 | 약함 |
| 0.1~0.3 | 보통 |
| 0.3~0.5 | 강함 |
| > 0.5 | 매우 강함 (검증 필요) |

### 6. 지표 선택 가이드

| 상황 | 추천 지표 |
|------|----------|
| **모델 비교** | AUC, KS |
| **시간 흐름** | PSI |
| **비즈니스 영향** | Precision/Recall/F1 |
| **상위 고객 우선순위** | Lift |
| **피처 선택** | IV |
| **종합 평가** | 4개 모두 + Confusion Matrix |

### 7. 책의 한계 5가지

#### 한계 ①: KS의 단점 미설명
- KS는 **단일 임곗값** 의 분리도만 보여줌
- 전체 곡선 모양은 무시 → Lift Chart 보완 필요

#### 한계 ②: PSI 계산 시 0 구간 처리
- 한 구간에 데이터가 0이면 ln(0/x) = -∞ → 무한대
- 실전: 최소값 (예: 0.0001) 추가

#### 한계 ③: F1 외 다른 균형 지표
- F2 (Recall 강조), F0.5 (Precision 강조)
- 비즈니스 비용에 맞게 선택

#### 한계 ④: AUC-PR vs. AUC-ROC
- **불균형 데이터** 에서는 **AUC-PR** 가 더 신뢰
- 책은 AUC-ROC만 다룸

#### 한계 ⑤: 부도 정의의 시점
- "30일 연체"? "90일 연체"? "법적 파산"?
- 정의에 따라 데이터 다름 → 메트릭 다름

---

## 🟣 [전공자] — 학술적 깊이

### 1. KS의 통계적 성질

#### 1.1 Kolmogorov 검정 (1933)
> 📄 Kolmogorov, A. N. (1933). Sulla determinazione empirica di una legge di distribuzione. *Giornale dell'Istituto Italiano degli Attuari*, 4.

원래 두 표본 분포 비교용 비모수 검정.

#### 1.2 신용평가 응용
신용평가에서 KS는 "두 표본"이 정상/부도. 분리력 측정의 표준 지표.

### 2. PSI의 통계학적 의미

PSI는 사실상 **Kullback-Leibler Divergence** (양방향):

$$ PSI = D_{KL}(P_{\text{new}} || P_{\text{old}}) + D_{KL}(P_{\text{old}} || P_{\text{new}}) $$

→ 정보이론 기반.

### 3. AUC의 학술적 정의

#### 3.1 확률적 해석
> "AUC = 무작위 선택한 양성 샘플의 점수가 무작위 선택한 음성 샘플보다 높을 확률"

$$ AUC = P(\text{score}(X_+) > \text{score}(X_-)) $$

#### 3.2 Mann-Whitney U 통계량과 같음

> 📄 Hanley, J. A., & McNeil, B. J. (1982). The meaning and use of the area under a receiver operating characteristic (ROC) curve. *Radiology*, 143(1).

### 4. 신용평가 메트릭의 한국적 적용

#### 4.1 NICE/KCB 표준

업계에서 통용되는 한국형 신용평가 모델 검증 가이드 (실제 NICE/KCB 내부 기준은 비공개; 아래는 업계 통상치):
- KS ≥ 0.40 (목표치)
- Gini ≥ 0.60 (= AUC ≈ 0.80)
- PSI ≤ 0.10 (분기별)
- IV: 변수별 0.02 이상

> ⚠ 정정: 초기 작성본은 "NICE 평가정보 모델 검증 기준"으로 단정했으나, NICE 내부 모델 검증 기준은 공개 자료에 없다. 위 수치는 업계 통상 가이드라인으로 이해해야 한다.

#### 4.2 금감원 모델 검증

> 📄 금융감독원. (2018). *모델 리스크 관리 모범규준*.

검증 항목:
- 통계적 적합성 (AUC, KS)
- 안정성 (PSI)
- 백테스팅 (실제 부도율 vs. 예측)
- 해석가능성 (피처 중요도)

### 5. ML 모델 평가 한계

#### 5.1 단일 메트릭의 함정

> 📄 Powers, D. M. (2011). Evaluation: from precision, recall and F-measure to ROC, informedness, markedness and correlation. *Journal of Machine Learning Technologies*, 2(1).

→ 한 지표만으로 모델 평가 어려움. **종합 평가** 필요.

#### 5.2 Cost-Sensitive Evaluation

> 📄 Bahnsen, A. C., Aouada, D., & Ottersten, B. (2014). Example-dependent cost-sensitive logistic regression for credit scoring. *ICMLA*.

비즈니스 비용을 메트릭에 포함:
$$ \text{TotalCost} = c_{FP} \cdot FP + c_{FN} \cdot FN $$

---

### 🟣 [전공자 심화] — AUC/KS/PSI 의 한계와 후속 연구

#### 원지표 한계
- **AUC 의 incoherence (Hand 2009)**: AUC 는 ROC 곡선 아래 면적이나, **분류기마다 다른 cost 분포 가중** 을 암묵적으로 사용. 따라서 두 분류기 비교 시 같은 비용 가정을 쓰지 않는다는 문제.
- **AUC 의 노이즈 민감성**: 양성 표본 적을 때 AUC 분산 큼. Hanley-McNeil 의 단일 ROC SE 추정은 종종 과소.
- **KS 의 단일 지점 약점**: 두 분포가 한 곳에서만 멀고 나머지에서 겹치면 KS 가 높게 나와도 분류 성능은 평범 → "분리력" 과 "분류기 품질" 의 불일치.
- **PSI 의 임의성**: bucket 수, quantile vs uniform 분할, baseline 기간 선택에 따라 값이 크게 변동. 0.1/0.25 임계값은 휴리스틱이며 통계학적 검정 아님.
- **AUC/KS 모두 calibration 무시**: 두 분류기가 같은 AUC 라도 한쪽은 잘 보정(PD=0.05→실제 5%) 다른쪽은 아닐 수 있음. ECL(IFRS 9) 산정엔 calibration 이 결정적.

#### 비판 문헌
- Hand, D. J. (2009). Measuring classifier performance: a coherent alternative to the area under the ROC curve. *Machine Learning*, 77(1), 103-123. — AUC 의 incoherence 증명 + **H-measure** 제안. https://link.springer.com/article/10.1007/s10994-009-5119-5
- Hand, D. J., & Anagnostopoulos, C. (2013). When is the area under the receiver operating characteristic curve an appropriate measure of classifier performance? *Pattern Recognition Letters*, 34(5), 492-495.
- Verbraken, T., Bravo, C., Weber, R., & Baesens, B. (2014). Development and application of consumer credit scoring models using profit-based classification measures. *European Journal of Operational Research*, 238(2), 505-513. https://doi.org/10.1016/j.ejor.2014.04.001 — **EMP (Expected Maximum Profit)** 지표 제안. AUC 대신 비즈니스 이익 최대화 관점.
- Saito, T., & Rehmsmeier, M. (2015). The precision-recall plot is more informative than the ROC plot when evaluating binary classifiers on imbalanced datasets. *PLoS ONE*, 10(3), e0118432. — 불균형(부도율 <5%) 에서 ROC 가 낙관적 → **AUC-PR (Average Precision)** 권장.
- Yuan, S., Wang, K., Ronen, R., & Ferri, C. (2024). Re-examination of model validation: PSI, calibration, and the role of binning. *Journal of Risk Model Validation* (review). — PSI 의 binning 의존성과 calibration 분리 평가 권고.

#### 후속 연구 동향 (2020~)
- Vanderschueren, T., Verdonck, T., Baesens, B., & Verbeke, W. (2022). Predict-then-optimize or predict-and-optimize? An empirical evaluation of cost-sensitive learning strategies. *Information Sciences*, 594, 400-415. — 예측-최적화 결합 손실 함수의 신용평가 적용.
- Óskarsdóttir, M., Bravo, C., Sarraute, C., Vanthienen, J., & Baesens, B. (2019). The value of big data for credit scoring: Enhancing financial inclusion using mobile phone data and social network analytics. *Applied Soft Computing*, 74, 26-39. — 대안 데이터 평가 시 AUC 외 financial inclusion lift 동반.
- **MAPE vs Brier vs ECE**: Calibration 지표 (Brier score, Expected Calibration Error, reliability diagram) 의 신용평가 적용 확산. Naeini et al. (2015) AAAI; Guo et al. (2017) ICML.
- Lessmann, S., Baesens, B., Seow, H.-V., & Thomas, L. C. (2015). 의 평가 프로토콜이 표준화 (AUC, PCC, BS, H-measure 4개 동시 보고).
- Bayesian model comparison: Benavoli, A., Corani, G., Demšar, J., & Zaffalon, M. (2017). Time for a change: A tutorial for comparing multiple classifiers through Bayesian analysis. *JMLR*, 18, 1-36. https://www.jmlr.org/papers/v18/16-305.html

#### 한국 적용 시 주의점
- **금감원 모델 리스크 관리 모범규준 (2018)**: AUC, KS, PSI 의 단순 임계값 보고로는 부족. **calibration plot + Brier score + cohort 별 분리 평가** 권고.
- **K-IFRS 9 ECL**: LR 모형의 PD 가 **PIT (Point-in-Time)** 으로 잘 보정되어야 함. Isotonic regression 또는 Platt scaling 의 영향이 AUC 보다 훨씬 큼.
- **PSI 임계값 0.10/0.25** 는 미국 Fair Isaac 휴리스틱. 한국 시중은행은 분기별 PSI 와 함께 **Characteristic Stability Index (CSI)** 를 변수별로 별도 모니터링.
- **불균형 (부도율 1-3%)**: AUC-PR / Average Precision 병행 보고 권장. 카드사 사기탐지(<0.1%) 는 AUC-PR 이 표준.
- **시간 분할**: 한국 신용평가는 OOT (분기 단위) 가 표준. 같은 표본의 train/test random split 으로 측정한 AUC 는 실제 성능보다 과대평가되는 경향 일관 관찰.

---

## 📚 책에 없지만 알면 좋은 것

### 🔍 보충 1 — AUC vs. AUC-PR

**불균형 데이터**:
- AUC-ROC: 0.85 (좋아 보임)
- AUC-PR: 0.30 (사실은 약함)

```python
from sklearn.metrics import average_precision_score
ap = average_precision_score(y_test, y_pred_proba)
print(f"Average Precision (AUC-PR): {ap:.3f}")
```

### 🔍 보충 2 — Cohort별 평가

```python
def evaluate_by_segment(df, segment_col, model):
    """세그먼트별 모델 성능"""
    for segment, group in df.groupby(segment_col):
        X_seg = group.drop('default', axis=1)
        y_seg = group['default']
        y_pred = model.predict_proba(X_seg)[:, 1]
        auc = roc_auc_score(y_seg, y_pred)
        ks = calculate_ks(y_seg, y_pred)
        print(f"{segment}: AUC={auc:.3f}, KS={ks:.3f}")

# 예: 연령대별, 지역별
evaluate_by_segment(df_test, 'age_group', model)
```

### 🔍 보충 3 — 시간 흐름 모니터링

```python
def monthly_psi(model, df_monthly):
    """월별 PSI 모니터링"""
    baseline_scores = model.predict_proba(df_baseline)[:, 1]
    
    results = []
    for month, df_m in df_monthly.groupby('month'):
        scores = model.predict_proba(df_m)[:, 1]
        psi = calculate_psi(baseline_scores, scores)
        results.append({'month': month, 'psi': psi})
    
    return pd.DataFrame(results)
```

### 🔍 보충 4 — Sklearn classification_report

```python
from sklearn.metrics import classification_report

print(classification_report(y_test, y_pred, target_names=['Good', 'Bad']))
```

출력:
```
              precision    recall  f1-score   support
        Good       0.99      0.95      0.97      9900
         Bad       0.40      0.80      0.53       100
    accuracy                           0.95     10000
   macro avg       0.70      0.88      0.75     10000
weighted avg       0.98      0.95      0.96     10000
```

### 🔍 보충 5 — 시각화 도구

```python
# Yellowbrick
from yellowbrick.classifier import ROCAUC, ClassPredictionError, ConfusionMatrix

visualizer = ROCAUC(model)
visualizer.fit(X_train, y_train)
visualizer.score(X_test, y_test)
visualizer.show()
```

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. 한국 모델 AUC 0.85 미국 모델 AUC 0.70 — 어느 게 더 좋은가?

**A.** **단순 비교 어려움**. 이유:
- 데이터 환경 다름 (한국 CB 데이터 풍부)
- 시장 변동성 다름
- 부도 정의 다름

→ **같은 데이터**로 비교해야 의미.

### Q2. PSI 계산 시 buckets 몇 개?

**A.** 보통 **10개**. 이유:
- 너무 적음 (3-5): 변화 감지 둔감
- 너무 많음 (20+): 노이즈 큼
- 10개가 표준

### Q3. KS 0.5인데 AUC 0.7?

**A.** **흔치 않은 조합**. 보통:
- KS 0.3 ≈ AUC 0.75
- KS 0.4 ≈ AUC 0.80
- KS 0.5 ≈ AUC 0.85

불일치 시 데이터 분포 이상 의심.

### Q4. Recall vs. Precision — 신용평가에서 뭐가 중요?

**A.** **Recall (재현율)이 더 중요**.

이유:
- FN (부도 놓침) 비용 >> FP (정상 거절) 비용
- 보통 10~50배 차이
- → Recall ↑ 우선

### Q5. F1 외 다른 F-score?

**A.**
- **F1**: P와 R 동등 (조화 평균)
- **F2**: R 강조 (R 2배 가중)
- **F0.5**: P 강조

신용평가는 **F2** 가 더 적합 (Recall 우선).

```python
from sklearn.metrics import fbeta_score
f2 = fbeta_score(y_test, y_pred, beta=2)
```

### Q6. AUC 0.95+ 가 좋은가?

**A.** **의심**. 이유:
- 보통 0.85 이상 어려움
- 너무 높으면 데이터 누설 의심
- Look-ahead bias, target leakage 점검

### Q7. PSI 0.3 나오면 무조건 재학습?

**A.** **상황 보고 결정**.

먼저 분석:
- 어느 피처가 변했나? (SHAP)
- 시장 변화? 데이터 수집 문제?
- 비즈니스 영향?

→ 진짜 시장 변화면 재학습, 데이터 문제면 수정.

---

## 🎯 이 절에서 가져갈 핵심 7가지

1. **4대 지표**: KS (분리도) + PSI (안정성) + Precision/Recall (균형) + AUC (전반).
2. **한국 표준**: AUC 0.80+, KS 0.40+, PSI < 0.10.
3. **PSI는 KL Divergence** → 정보이론 기반.
4. **AUC = 확률** (양성이 음성보다 높은 점수일 확률).
5. **불균형 데이터에선 AUC-PR** 가 AUC-ROC보다 신뢰.
6. **신용평가에선 Recall 우선** (FN 비용이 큼) → F2 score 적합.
7. **모델 운영 시 PSI 모니터링** 으로 자동 재학습 시점 결정.

---

## 📖 더 읽을거리

### 평가 지표 표준
- Siddiqi, N. (2017). *Intelligent Credit Scoring* (2nd ed.). Wiley. Ch. 8.
- Thomas, L. C. (2009). *Consumer Credit Models*. Oxford UP. Ch. 4.

### 학술
- Hanley, J. A., & McNeil, B. J. (1982). The meaning and use of the AUC. *Radiology*.
- Powers, D. M. (2011). Evaluation: from precision, recall and F-measure to ROC. *JMLT*.

### 모델 검증
- 금융감독원. (2018). *모델 리스크 관리 모범규준*.
- Federal Reserve. (2011). *SR 11-7*.

### 도구
- scikit-learn metrics: https://scikit-learn.org/stable/modules/model_evaluation.html
- Yellowbrick: https://www.scikit-yb.org/

---

> **다음 절 예고** — §3.6 신용 평가 모델 개발 사전 지식
> 7가지 핵심 (스코어카드, 종속변수, 빈티지 분석, 성능 기간 등) 신용평가 도메인 지식.
