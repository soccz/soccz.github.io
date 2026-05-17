# 실습 2: OptBinning 라이브러리를 활용한 신용 평가 모델 — *Lab 2: OptBinning + Scorecard*

> **해설 분량**: 약 25쪽
> **소요 시간**: 4~8시간

---

## 🪧 이 실습을 한 줄로

> **OptBinning** = WoE/IV + 최적 구간화 + Logistic Regression + Scorecard 자동화 라이브러리.
> 전통 신용평가의 모든 단계를 한 줄로 처리.

책은 OptBinning을 처음부터 끝까지 안내. 이 해설집은:
1. **각 OptBinning 클래스 매핑**
2. **수동 vs. 자동** 비교
3. **Scorecard 생성**까지

### 📍 OptBinning 워크플로우

<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">OptBinning 라이브러리 — 전통 신용평가 자동화</text>
  <defs>
    <marker id="ar4" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#1c1917"/></marker>
  </defs>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <rect x="20" y="80" width="160" height="80" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="100" y="105" text-anchor="middle" font-weight="700" fill="#c4724e">① OptimalBinning</text>
    <text x="100" y="125" text-anchor="middle" font-size="10" fill="#1c1917">단일 변수 구간화</text>
    <text x="100" y="143" text-anchor="middle" font-size="10" fill="#57534e">WoE/IV 계산</text>
    <line x1="180" y1="120" x2="210" y2="120" stroke="#1c1917" stroke-width="2" marker-end="url(#ar4)"/>
    <rect x="220" y="80" width="160" height="80" rx="8" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="300" y="105" text-anchor="middle" font-weight="700" fill="#5a7a96">② BinningProcess</text>
    <text x="300" y="125" text-anchor="middle" font-size="10" fill="#1c1917">다변수 일괄 처리</text>
    <text x="300" y="143" text-anchor="middle" font-size="10" fill="#57534e">WoE 변환</text>
    <line x1="380" y1="120" x2="410" y2="120" stroke="#1c1917" stroke-width="2" marker-end="url(#ar4)"/>
    <rect x="420" y="80" width="160" height="80" rx="8" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="500" y="105" text-anchor="middle" font-weight="700" fill="#3a7d44">③ Scorecard</text>
    <text x="500" y="125" text-anchor="middle" font-size="10" fill="#1c1917">LR + WoE 통합</text>
    <text x="500" y="143" text-anchor="middle" font-size="10" fill="#57534e">자동 점수 생성</text>
    <line x1="580" y1="120" x2="610" y2="120" stroke="#1c1917" stroke-width="2" marker-end="url(#ar4)"/>
    <rect x="620" y="80" width="120" height="80" rx="8" fill="#f5e6f0" stroke="#7a6a9a"/>
    <text x="680" y="105" text-anchor="middle" font-weight="700" fill="#7a6a9a">④ 평가</text>
    <text x="680" y="125" text-anchor="middle" font-size="10" fill="#1c1917">KS/AUC/PSI</text>
    <text x="680" y="143" text-anchor="middle" font-size="10" fill="#57534e">PDO 변환</text>
  </g>
  <text x="380" y="220" text-anchor="middle" font-size="12" font-weight="700" fill="#1c1917">전통 신용평가 = 수동 100줄 → OptBinning 10줄</text>
  <text x="380" y="245" text-anchor="middle" font-size="11" font-style="italic" fill="#57534e">단, XGBoost보다 성능은 낮음 (해석성 우위)</text>
</svg>

---

## 🟢 [초급] — OptBinning 첫걸음

### 1. 설치와 기본 사용

```bash
pip install optbinning
```

```python
from optbinning import OptimalBinning
import pandas as pd

# 데이터 (Home Credit 등)
df = pd.read_csv('credit_data.csv')

# 단일 변수 구간화
optb = OptimalBinning(name='age', dtype='numerical')
optb.fit(df['age'], df['default'])

# 구간화 결과
print(optb.binning_table.build())
```

### 2. 자동 구간화의 의미

#### Before (수동)
```python
# 사람이 직접 결정
df['age_bin'] = pd.cut(df['age'], bins=[0, 25, 35, 45, 55, 100])
# → 구간이 최적인지 모름
```

#### After (OptBinning)
```python
# 알고리즘이 최적 구간 찾음
optb = OptimalBinning(name='age')
optb.fit(df['age'], df['default'])
# → IV 최대화하는 구간 자동 결정
```

### 3. 시각화

```python
# 구간별 부도율
optb.binning_table.plot(metric='event_rate')

# WoE 시각화
optb.binning_table.plot(metric='woe')
```

> ✅ **여기까지 따라왔으면**: OptBinning이 수동 구간화를 자동화한다는 게 보일 거다.

---

## 🟡 [중급] — OptimalBinning 깊이

### 1. 옵션 파라미터

```python
optb = OptimalBinning(
    name='age',
    dtype='numerical',        # 'numerical' or 'categorical'
    solver='cp',              # 'cp' (Constraint Programming), 'mip', 'ls'
    max_n_bins=10,            # 최대 구간 수
    min_bin_size=0.05,        # 최소 구간 크기 (5%)
    min_event_rate=0.01,      # 최소 부도율
    monotonic_trend='auto',   # 단조 증가/감소 강제
    p_value_threshold=0.05,   # 통계적 유의성
)
```

### 2. 단조성 강제 (Monotonic Trend)

```python
# 자동 감지
optb = OptimalBinning(monotonic_trend='auto')

# 강제 (나이 ↑ → 부도율 ↓)
optb = OptimalBinning(monotonic_trend='descending')

# 강제 (소득 ↑ → 부도율 ↓)
optb = OptimalBinning(monotonic_trend='descending')

# 강제 (부채비율 ↑ → 부도율 ↑)
optb = OptimalBinning(monotonic_trend='ascending')
```

→ **금융 도메인 지식 반영** 가능.

### 3. 결과 해석

```python
# 구간 테이블
table = optb.binning_table.build()
print(table)

# 출력 예시:
#                Bin    Count  Event  Event Rate    WoE      IV     JS
# 0       (-inf, 25]    1000     100        0.10  -0.50  0.025  0.012
# 1         (25, 35]    2000     150        0.075 -0.15  0.005  0.002
# 2         (35, 50]    3000     180        0.060  0.10  0.003  0.001
# ...

# 통계량
print(f"IV: {optb.binning_table.iv:.3f}")
print(f"JS Divergence: {optb.binning_table.js:.3f}")
print(f"Quality Score: {optb.binning_table.quality_score:.3f}")
```

### 4. WoE 변환

```python
# 원본 → WoE
x_woe = optb.transform(df['age'], metric='woe')

# 원본 → 구간 인덱스
x_bin = optb.transform(df['age'], metric='indices')

# 원본 → 부도율
x_rate = optb.transform(df['age'], metric='event_rate')
```

### 5. 범주형 변수

```python
# 범주형
optb_cat = OptimalBinning(name='education', dtype='categorical')
optb_cat.fit(df['education'], df['default'])

# 카테고리 자동 그룹화
table_cat = optb_cat.binning_table.build()
```

> ✅ **여기까지 따라왔으면**: OptimalBinning 단일 변수 처리를 마스터.

---

## 🔴 [고급] — BinningProcess (다변수)

### 1. 전체 변수 일괄 처리

```python
from optbinning import BinningProcess

# 변수 정의
variable_names = ['age', 'income', 'debt_ratio', 'employment_years', 
                   'past_delinquency', 'credit_score', 'education']

# 범주형 명시
categorical_variables = ['education']

# BinningProcess 생성
binning_process = BinningProcess(
    variable_names=variable_names,
    categorical_variables=categorical_variables,
    max_n_bins=10,
    min_bin_size=0.05,
    selection_criteria={
        'iv': {'min': 0.025, 'max': 1.0},  # IV 0.025 이상만
        'quality_score': {'min': 0.01}
    }
)

# 학습
binning_process.fit(df[variable_names], df['default'])

# 요약
print(binning_process.summary())
```

### 2. 변수 선택 자동화

```python
# IV 기반 선택
selected_vars = binning_process.get_support(names=True)
print(f"선택된 변수 ({len(selected_vars)}개): {selected_vars}")

# WoE 변환
X_woe = binning_process.transform(df[variable_names])
```

### 3. 변수별 상세

```python
# 변수별 binning_table 접근
optb_age = binning_process.get_binned_variable('age')
optb_age.binning_table.plot()

# IV 순으로 정렬
summary = binning_process.summary()
summary_sorted = summary.sort_values('iv', ascending=False)
print(summary_sorted[['name', 'iv', 'js', 'quality_score']])
```

### 4. 도메인 제약 적용

```python
# 도메인 지식 기반 단조성
binning_fit_params = {
    'age': {'monotonic_trend': 'descending'},      # 나이 ↑ 부도 ↓
    'income': {'monotonic_trend': 'descending'},    # 소득 ↑ 부도 ↓
    'debt_ratio': {'monotonic_trend': 'ascending'}, # 부채 ↑ 부도 ↑
}

binning_process = BinningProcess(
    variable_names=variable_names,
    binning_fit_params=binning_fit_params
)
```

> ✅ **여기까지 따라왔으면**: 100개 변수도 한 번에 처리 가능.

---

## 🟣 [전공자] — Scorecard 생성

### 1. Scorecard 클래스

```python
from optbinning import Scorecard
from sklearn.linear_model import LogisticRegression

# Scorecard 정의
scorecard = Scorecard(
    binning_process=binning_process,
    estimator=LogisticRegression(solver='lbfgs', max_iter=1000),
    scaling_method='min_max',      # 또는 'pdo_odds'
    scaling_method_params={
        'min': 300,
        'max': 850
    }
)

# 학습
scorecard.fit(df[variable_names], df['default'])
```

### 2. PDO 방식

```python
# PDO 방식 (전통)
scorecard_pdo = Scorecard(
    binning_process=binning_process,
    estimator=LogisticRegression(),
    scaling_method='pdo_odds',
    scaling_method_params={
        'pdo': 20,
        'odds': 50,
        'scorecard_points': 600
    }
)

scorecard_pdo.fit(df[variable_names], df['default'])
```

### 3. Scorecard 출력

```python
# Scorecard 테이블 (사람이 읽을 수 있는 형태)
sc_table = scorecard.table(style='detailed')
print(sc_table)

# 출력 예시:
#       Variable                Bin   Points
# 0          age          (-inf, 25]    -20
# 1          age            (25, 35]     -5
# 2          age            (35, 50]     30
# 3          age          (50, inf]      45
# 4       income           (-inf, 30]   -50
# ...
```

### 4. 예측

```python
# 점수 예측
y_pred_score = scorecard.score(df_test[variable_names])
print(f"점수 분포: {y_pred_score.min()} ~ {y_pred_score.max()}")

# 부도 확률
y_pred_proba = scorecard.predict_proba(df_test[variable_names])[:, 1]

# 평가
from sklearn.metrics import roc_auc_score
auc = roc_auc_score(df_test['default'], y_pred_proba)
print(f"AUC: {auc:.4f}")
```

### 5. 시각화

```python
import matplotlib.pyplot as plt

# 점수 분포
plt.figure(figsize=(12, 5))
plt.subplot(1, 2, 1)
plt.hist(y_pred_score[df_test['default']==0], bins=30, alpha=0.5, label='Good')
plt.hist(y_pred_score[df_test['default']==1], bins=30, alpha=0.5, label='Bad')
plt.xlabel('Credit Score')
plt.ylabel('Count')
plt.legend()
plt.title('Score Distribution')

# 변수별 IV
plt.subplot(1, 2, 2)
summary = binning_process.summary().sort_values('iv', ascending=True)
plt.barh(summary['name'], summary['iv'])
plt.xlabel('IV')
plt.title('Variable Importance (IV)')
plt.tight_layout()
plt.show()
```

### 6. 모니터링

```python
from optbinning.scorecard import ScorecardMonitoring

monitoring = ScorecardMonitoring(scorecard=scorecard, psi_method='quantile')
monitoring.fit(df_test, df_new, df_test['default'], df_new['default'])

# 시스템 모니터링
print(monitoring.psi_table())
# 변수별 PSI 출력

# 모니터링 시각화
monitoring.psi_plot()
```

---

## 📚 책에 없지만 알면 좋은 것

### 🔍 보충 1 — OptBinning vs. 수동 비교

| 기능 | 수동 | OptBinning |
|------|------|-----------|
| 구간 결정 | 사람이 정함 | 알고리즘 (CP/MIP) |
| WoE 계산 | 직접 코드 | 자동 |
| IV 계산 | 직접 코드 | 자동 |
| 단조성 강제 | 어려움 | 한 줄 |
| 변수 선택 | IV 임곗값 | 자동 |
| Scorecard | 수동 계산 | 한 줄 |

→ **시간 1/10로 단축**.

### 🔍 보충 2 — OptBinning 알고리즘

내부 사용 알고리즘:
- **Constraint Programming (CP)**: 표준
- **Mixed Integer Programming (MIP)**: 정확
- **Local Search (LS)**: 빠름

> 📄 Navas-Palencia, G. (2020). Optimal binning: mathematical programming formulation. arXiv:2001.08025.

---

### 🟣 [전공자 심화] — OptBinning (Navas-Palencia 2020) 의 한계와 후속 연구

#### 원논문 한계
- **이산화에 의한 정보 손실**: WoE binning 은 연속 변수를 N(보통 5-10)개 구간으로 강제 → **단조성/구간 안정성** 을 얻는 대가로 fine-grained 변동을 포기. 변수 간 상호작용(interaction)을 학습하지 못함.
- **Monotone trend 의 사전 가정**: 자동/사용자지정 단조 방향(ascending/descending/convex/concave). **U-shape/N-shape 변수** (예: 나이-부도율은 U 형) 는 monotone 강제 시 IV 손실.
- **CP/MIP 의 NP-hard**: pre-binning(초기 미세 구간)이 너무 많으면 (>50) MIP 가 timeout. Local Search 로 fallback 시 최적성 보장 X.
- **결측치 처리의 임의성**: missing 을 별도 bin / 특정 bin 병합 / mean 대체 선택이 IV 에 큰 영향. 원논문은 결측 별도 bin 권장이나 실무에서 종종 모형 성능 악화.
- **IV/WoE 자체의 통계적 한계**: IV 는 KL-divergence 의 대칭형 근사이나 **부도율 0 인 bin** 이 있으면 발산. Laplace smoothing 필수이나 원논문에서 상세 가이드 부재.

#### 비판 문헌
- Hand, D. J., & Henley, W. E. (1997). Statistical classification methods in consumer credit scoring: a review. *Journal of the Royal Statistical Society A*, 160(3), 523-541. — WoE/IV 의 통계학적 한계와 logistic 직접 추정의 우위성 논의.
- Bischl, B., Mersmann, O., Trautmann, H., & Weihs, C. (2012). Resampling methods for meta-model validation with recommendations for evaluation. *Evolutionary Computation*, 20(2), 249-275. — Binning 후 cross-validation 의 정보 누설(target leakage in binning).
- Mironchyk, P., & Tchistiakov, V. (2017). Monotone optimal binning algorithm for credit risk modeling. *Working paper*. — Monotone binning 의 OOT 안정성 비판. 단조성을 강제하면 **신규 cohort 에서 trend reversal** 시 모형 즉시 PSI 폭증.
- Lin, A. Z. (2017). Examining distributional shifts by using population stability index (PSI) for model validation and diagnosis. *SAS Working Paper*. — PSI 가 binning 선택에 강하게 의존.

#### Monotone trend 의 통계적 검정
- **Spearman/Kendall test**: bin 평균 부도율과 bin 순위의 비모수 상관. p<0.05 만 monotone 강제.
- **Cochran-Armitage test**: 부도 비율의 선형 추세 검정. R `prop.trend.test`, Python `statsmodels.stats.contingency_tables.Table.test_ordinal_association`.
- **Jonckheere-Terpstra test**: 순서형 변수의 단조 경향 비모수 검정.
- OptBinning 은 0.18+ 버전부터 `monotonic_trend="auto_heuristic"` 옵션으로 ML 분류기 기반 자동 trend 결정 제공.

#### Optimal Binning vs End-to-End NN 비교
- Sudjianto, A., Knauth, W., Singh, R., Yang, Z., & Zhang, A. (2020). Unwrapping the black box of deep ReLU networks: Interpretability, diagnostics, and simplification. *arXiv:2011.04041*. — DNN 을 piecewise-linear 로 분해해 binning 과 유사한 해석 추출.
- Yang, Z., Zhang, A., & Sudjianto, A. (2021). GAMI-Net: An explainable neural network based on generalized additive models with structured interactions. *Pattern Recognition*, 120, 108192. — **WoE + LR ↔ NN 의 중간 지대**. EBM(Explainable Boosting Machine) 류와 함께 "ante-hoc interpretable" 접근.
- Chen, C., Lin, K., Rudin, C., Shaposhnik, Y., Wang, S., & Wang, T. (2018). An interpretable model with globally consistent explanations for credit risk. *NeurIPS 2018 Workshop*. — 2-layer additive risk model 이 GBDT 와 동등 성능 + scorecard 형식 출력.
- Nori, H., Jenkins, S., Koch, P., & Caruana, R. (2019). InterpretML: A unified framework for machine learning interpretability. *arXiv:1909.09223*. — Microsoft EBM. WoE-scorecard 의 ML 시대 일반화.

#### 후속 연구 동향 (2020~)
- Navas-Palencia 본인의 후속: **OptBinning Sketch** (대용량 스트리밍 binning). https://gnpalencia.org/optbinning/binning_sketch.html
- Counterfactual explanation 통합: `optbinning.scorecard.Counterfactual` (2021). 점수 X 달성 위한 최소 변수 변화 제시.
- Bücker, M., Szepannek, G., Gosiewska, A., & Biecek, P. (2022). Transparency, auditability, and explainability of machine learning models in credit scoring. *Journal of the Operational Research Society*, 73(1), 70-90. — Scorecard ↔ ML 의 해석성-성능 trade-off 정량화. https://doi.org/10.1080/01605682.2021.1922098
- Szepannek, G., & Lübke, K. (2021). Facing the challenges of developing fair risk scoring models. *Frontiers in Artificial Intelligence*, 4, 681915. — Binning 단계에서의 fairness 제약 통합.

#### 한국 적용 시 주의점
- **NICE/KCB 스코어카드 표준** 이 WoE binning 기반 → OptBinning 결과가 실무 산출물 형식과 호환. 단, NICE 내부 binning 알고리즘은 비공개로 휴리스틱 차이 존재.
- **금감원 모델 검증 모범규준 (2018)**: bin 안정성(PSI per bin <0.10), 단조성, 사업적 타당성(monotonicity 방향이 도메인 지식과 일치) 검증 요구. OptBinning `binning_table.analysis()` 가 직접 산출.
- **부도율 0 bin** 처리: 한국 우량 차주 세그먼트는 부도율 0% bin 흔함. 0.5 사전 추가(Laplace) 또는 인접 bin merge 표준.
- **마이데이터 변수 폭증** (수백~수천 변수) 환경에서 변수별 binning 의 계산 비용 증가 → `BinningProcess(n_jobs=-1)` 병렬 처리 필수.
- **K-IFRS 9 ECL**: PIT-PD 산출 시 macro variable 와 WoE 변수의 상호작용 필요. OptBinning 만으로는 부족 → 후처리에서 macro overlay 결합.

### 🔍 보충 3 — XGBoost vs. Scorecard

```python
# XGBoost 학습
from xgboost import XGBClassifier
xgb = XGBClassifier()
xgb.fit(X_train, y_train)
auc_xgb = roc_auc_score(y_test, xgb.predict_proba(X_test)[:, 1])

# Scorecard
scorecard.fit(X_train, y_train)
auc_sc = roc_auc_score(y_test, scorecard.predict_proba(X_test)[:, 1])

print(f"XGBoost AUC: {auc_xgb:.4f}")
print(f"Scorecard AUC: {auc_sc:.4f}")

# 결과 보통:
# XGBoost: 0.85
# Scorecard: 0.80 (약 5% 낮지만 해석성 압도)
```

### 🔍 보충 4 — Counterfactual Explanation

```python
from optbinning.scorecard import Counterfactual

cf = Counterfactual(scorecard=scorecard)

# "이 고객의 점수를 100점 올리려면 어떻게 해야?"
counterfactual = cf.generate(
    df_test.iloc[[0]],
    y_actual=550,
    y_target=650,
    n_cf=5
)
print(counterfactual)
# 예: "소득을 5천만 → 7천만으로, 부채를 50% → 30%로"
```

### 🔍 보충 5 — Reject Inference 구현

```python
from optbinning import OptimalBinning

# 승인 고객만
optb_approved = OptimalBinning()
optb_approved.fit(X_approved['income'], y_approved)

# 거절 고객에 예측 라벨 부여 (예: KNN)
from sklearn.neighbors import KNeighborsClassifier
knn = KNeighborsClassifier()
knn.fit(X_approved, y_approved)
y_rejected_estimated = knn.predict(X_rejected)

# 합쳐서 재학습
X_combined = pd.concat([X_approved, X_rejected])
y_combined = pd.concat([y_approved, pd.Series(y_rejected_estimated)])

optb_combined = OptimalBinning()
optb_combined.fit(X_combined['income'], y_combined)
```

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. OptBinning이 XGBoost보다 좋은 점?

**A.** **해석성 + 규제 친화**.

- AUC: XGBoost > OptBinning (약 0.05)
- 해석: OptBinning >> XGBoost (사람이 점수표 읽을 수 있음)
- 한국 규제: OptBinning 친화적

### Q2. 구간 수는 몇 개가 적당?

**A.** 보통 **5~10개**.

- 너무 적음 (3): 변별력 낮음
- 너무 많음 (15+): 과적합
- 한국 표준: 10개

### Q3. 단조성 강제 (monotonic) 항상 필요?

**A.** **금융 도메인 지식에 맞으면 필수**.

- "소득 ↑ 부도 ↓" 라는 상식
- 데이터가 반대로 보여도 강제로 단조 → 안정성

### Q4. Scorecard 점수 범위는?

**A.** **자유 설정**. 일반적:
- 미국: 300~850 (FICO)
- 한국: 1~1000 (NICE)
- 자체: 0~1000

### Q5. OptBinning이 한국 데이터에도 잘 작동?

**A.** **잘 작동**. 단:
- 데이터 크기 충분 (1만+)
- 불균형 비율 5~20% 적정
- 결측치 처리 후

### Q6. Logistic Regression이 진짜 운영에 쓰이나?

**A.** **한국 대형 은행의 사실상 표준**.

- 신용평가 메인 모델 대부분이 LR/Scorecard (NICE, KCB, 시중은행) — 정확한 비율 통계는 공개되지 않음
- XGBoost는 보조/병행 (앙상블, 사기 탐지, 한도 책정)
- 이유: 규제, 해석, 안정

> ⚠ 정정: 초기 작성본의 "90%는 LR" 수치는 공개 출처 없는 업계 통념이다. "대부분" 또는 "사실상 표준"으로 표현하는 게 정확.

### Q7. Scorecard 점수가 결측치는?

**A.** **별도 구간 처리**.

```python
optb = OptimalBinning(special_codes=[-9999])
# -9999 (결측 코드)를 별도 구간으로
```

---

## 🎯 핵심 7가지

1. **OptBinning** = WoE/IV/구간화/Scorecard 자동화.
2. **OptimalBinning** (단일) → **BinningProcess** (다변수) → **Scorecard** (최종).
3. **단조성 강제** 로 도메인 지식 반영.
4. **IV 기반 변수 선택** 자동.
5. **Scorecard** = LR + WoE → 사람이 읽을 수 있는 점수표.
6. **AUC는 XGBoost보다 낮지만** 해석성 압도.
7. **한국 시중은행 대부분이 LR/Scorecard를 메인 신용평가 모델로 사용** (정확한 비율 통계는 비공개).

---

## 📖 더 읽을거리

### OptBinning
- 공식 문서: https://optbinning.io/
- GitHub: https://github.com/guillermo-navas-palencia/optbinning
- Navas-Palencia, G. (2020). arXiv:2001.08025.

### 신용 Scorecard
- Siddiqi, N. (2017). *Intelligent Credit Scoring* (2nd ed.). Wiley.
- Mays, E. (2003). *Credit Scoring for Risk Managers*. South-Western.

### 대안 라이브러리
- TOAD (Tencent): https://toad.readthedocs.io/
- ScorecardPy: https://github.com/ShichenXie/scorecardpy
- monotonicity in XGBoost: `monotone_constraints` parameter

---

> **Ch3 끝**.
> 신용평가 = 전통 (Scorecard) + ML (XGBoost) + XAI (SHAP) 의 조합.
> 다음: **Ch4 「AI를 활용한 금융 사기 거래 탐지 및 예방」** — 신용카드 사기 탐지, GNN, NetworkX.
