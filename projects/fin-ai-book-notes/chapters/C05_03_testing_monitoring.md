# 5.5 ~ 5.7 모델 테스트 + 모니터링 + 재학습 — *Testing, Monitoring, Retraining*

> **해설 분량**: 약 25쪽
> **읽는 데 걸리는 시간**: 약 45분

---

## 🪧 이 절을 한 줄로

> **테스트** (Shadow/A-B/Canary 등 6종) → **모니터링** (Drift 감지) → **재학습** (자동/수동 트리거).

### 📍 큰 그림

<svg viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">모델 운영 라이프사이클</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- Test stage -->
    <text x="180" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">▼ ① 테스트 (6종)</text>
    <rect x="40" y="70" width="280" height="180" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="60" y="92" fill="#1c1917">• Shadow Deployment</text>
    <text x="60" y="115" fill="#1c1917">• A/B Testing</text>
    <text x="60" y="138" fill="#1c1917">• Canary Deployment</text>
    <text x="60" y="161" fill="#1c1917">• Interleaving</text>
    <text x="60" y="184" fill="#1c1917">• Two-Stage Experiment</text>
    <text x="60" y="207" fill="#1c1917">• Multi-Armed Bandit</text>
    <text x="180" y="235" text-anchor="middle" font-size="10" font-style="italic" fill="#c4724e">리스크 vs. 데이터 양</text>
    <!-- Monitor stage -->
    <text x="540" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#5a7a96">▼ ② 모니터링 (Drift)</text>
    <rect x="400" y="70" width="280" height="180" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="420" y="92" fill="#1c1917">• Covariate Shift (입력)</text>
    <text x="420" y="115" fill="#1c1917">• Concept Drift (관계)</text>
    <text x="420" y="138" fill="#1c1917">• Label Shift (출력)</text>
    <text x="420" y="167" font-weight="700" fill="#5a7a96">감지 도구:</text>
    <text x="420" y="184" fill="#57534e">PSI, KLD, JSD, Wasserstein, KS</text>
    <text x="420" y="207" fill="#57534e">Alibi Detect, Evidently AI</text>
    <text x="540" y="235" text-anchor="middle" font-size="10" font-style="italic" fill="#5a7a96">PSI > 0.25 → 재학습</text>
    <!-- Retrain stage -->
    <text x="380" y="290" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">▼ ③ 재학습 (Retraining)</text>
    <rect x="180" y="305" width="400" height="40" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="380" y="327" text-anchor="middle" fill="#1c1917">정기 (월/분기) + 트리거 기반 (PSI, 성능)</text>
  </g>
</svg>

---

## 🟢 [초급] — 모델 배포 6가지 방법

### 1. 6가지 배포 전략 (책 본문)

#### ① Shadow Deployment (섀도 배포)
```
[고객 요청]
     ↓
   [기존 모델] → 실제 응답
        ↓ (복사)
   [새 모델] → 응답만 비교 (사용자 못 봄)
```

**장점**: 실전 데이터로 테스트
**단점**: 비용 2배, 사용자 영향 측정 안 됨

#### ② A/B Testing
```
[고객 50%] → 기존 모델
[고객 50%] → 새 모델
   → 결과 비교
```

**장점**: 직접 비교
**단점**: 일부 사용자에 새 모델 영향

#### ③ Canary Deployment
```
1주: 5% 새 모델
2주: 20% 새 모델
3주: 50% 새 모델
4주: 100% 새 모델
```

**장점**: 위험 최소화
**단점**: 시간 오래

#### ④ Interleaving
- 한 사용자에게 두 모델 결과 번갈아 제공
- 검색 결과 순위 등에 적합

#### ⑤ Two-Stage Experiment
- 소규모 → 대규모 단계적 확대
- Canary 변형

#### ⑥ Multi-Armed Bandit
- 여러 모델 중 자동으로 최적 선택
- 실시간 성능 분석 → 가중치 조정

### 2. 어떤 방법을 언제?

| 상황 | 추천 |
|------|------|
| 새 모델, 위험 큼 | Shadow → Canary |
| 명확한 비교 필요 | A/B Testing |
| 검색/추천 | Interleaving |
| 자동 최적화 | Multi-Armed Bandit |
| 대규모 출시 | Canary (5% → 100%) |

> ✅ **여기까지 따라왔으면**: 모델 배포 옵션 6가지 차이가 보일 거다.

---

## 🟡 [중급] — Drift 모니터링

### 1. 3가지 Drift 유형

#### Drift ①: Covariate Shift (입력 변화)

> "**입력 데이터 분포 변화**, 관계는 유지"

**예시**:
- 코로나 → 소비 패턴 변화 → 카드 사용 분포 변화
- 모델 학습 시 평균 소득 4천만 → 운영 시 5천만

**수식**:
$$ P_{\text{train}}(X) \neq P_{\text{test}}(X) $$
$$ P(Y|X) \text{는 동일} $$

#### Drift ②: Concept Drift (관계 변화)

> "**입력 → 출력 관계 자체가 변함**"

**예시**:
- 신용카드 사기 새 수법 등장
- 같은 고객 데이터 → 부도율 변화

**수식**:
$$ P(X) \text{ 동일} $$
$$ P_{\text{train}}(Y|X) \neq P_{\text{test}}(Y|X) $$

#### Drift ③: Label Shift (출력 변화)

> "**출력 분포 자체가 변함**"

**예시**:
- 경기 침체 → 부도율 1% → 3%
- 사기 비율 0.1% → 0.5%

### 2. Drift 감지 5가지 방법

#### 방법 ①: PSI (Population Stability Index)

```python
def calculate_psi(reference, current, bins=10):
    """PSI 계산"""
    breakpoints = np.percentile(reference, np.linspace(0, 100, bins+1))
    
    ref_pct = np.histogram(reference, breakpoints)[0] / len(reference)
    cur_pct = np.histogram(current, breakpoints)[0] / len(current)
    
    psi = 0
    for r, c in zip(ref_pct, cur_pct):
        if r > 0 and c > 0:
            psi += (c - r) * np.log(c / r)
    return psi

# 해석
# PSI < 0.1: 안정
# 0.1 < PSI < 0.25: 약간 변화
# PSI > 0.25: 큰 변화 → 재학습 필요
```

#### 방법 ②: KL Divergence

```python
from scipy.stats import entropy

def kl_divergence(p, q):
    return entropy(p, q)

# p: reference 분포
# q: current 분포
```

#### 방법 ③: JSD (Jensen-Shannon Divergence/Distance)

KL의 대칭화 (divergence 정의):
$$ JSD(P \| Q) = \frac{1}{2} KL(P \| M) + \frac{1}{2} KL(Q \| M), \quad M = \frac{P+Q}{2} $$

scipy는 **distance** (= √divergence, metric) 를 반환한다:

```python
from scipy.spatial.distance import jensenshannon

# scipy는 metric (= √JSD divergence) 을 반환. 0~1 범위, base=2 기준.
jsd_distance = jensenshannon(p, q)

# divergence 값이 필요하면 제곱:
jsd_divergence = jsd_distance ** 2
```

> ⚠ 정정: 초기 작성본은 divergence 공식을 적은 뒤 곧바로 `scipy.spatial.distance.jensenshannon(p,q)` 를 동일 값으로 표시했다. scipy 함수는 divergence가 아닌 **metric (√divergence)** 를 반환한다는 점이 누락돼 있었다.

#### 방법 ④: Wasserstein Distance

> "한 분포 → 다른 분포로 옮기는 데 필요한 비용"

```python
from scipy.stats import wasserstein_distance

wd = wasserstein_distance(reference, current)
```

#### 방법 ⑤: K-S Test

```python
from scipy.stats import ks_2samp

ks_stat, p_value = ks_2samp(reference, current)
if p_value < 0.05:
    print("분포 다름!")
```

### 3. 종합 비교

| 방법 | 장점 | 단점 |
|------|------|------|
| **PSI** | 간단, 빠름 | 정확성 한계 |
| **KLD** | 정확 | 비대칭, 해석 어려움 |
| **JSD** | 대칭, 0~1 | 계산 복잡 |
| **Wasserstein** | 직관적 | 가정 필요, 복잡 |
| **K-S Test** | 비모수 | 검정력 약함 |

### 4. 자동 모니터링 도구

#### Evidently AI

```python
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset

report = Report(metrics=[DataDriftPreset()])
report.run(reference_data=X_train, current_data=X_current)
report.save_html('drift_report.html')
```

#### Alibi Detect

```python
from alibi_detect.cd import KSDrift

# Reference 데이터로 학습
cd = KSDrift(X_train, p_val=0.05)

# 새 데이터 체크
preds = cd.predict(X_new)
print(f"Drift Detected: {preds['data']['is_drift']}")
print(f"P-value: {preds['data']['p_val']}")
```

#### AWS SageMaker Model Monitor

- 실시간 모니터링
- 자동 알람
- AWS 통합

> ✅ **여기까지 따라왔으면**: Drift 감지의 5가지 방법 + 도구가 보일 거다.

---

## 🔴 [고급] — 재학습 전략

### 1. 책의 5가지 변화 유형

#### 변화 ①: Feature Change
- 신규 피처 추가
- 기존 피처 제거
- 피처 범위 변경
- 예: '연령' 연 단위 → 월 단위

#### 변화 ②: Label Schema Change
- 출력 범위 변경
- 클래스 추가/제거
- 예: 신용 점수 1~1000 → 1~850

#### 변화 ③: Covariate Shift
- 입력 분포 변화

#### 변화 ④: Concept Drift
- 입력-출력 관계 변화

#### 변화 ⑤: Label Shift
- 출력 분포 변화

### 2. 재학습 트리거

#### 트리거 ①: 정기 (Scheduled)

```python
# Airflow DAG
dag = DAG(
    'monthly_retrain',
    schedule_interval='@monthly',  # 매월 1일
    ...
)

@task
def retrain():
    # 최근 데이터 로드
    df = load_recent_data(months=12)
    
    # 학습
    model = XGBClassifier()
    model.fit(df[features], df['target'])
    
    # 저장
    joblib.dump(model, f'model_v{version}.joblib')
```

#### 트리거 ②: 성능 기반

```python
def check_performance(model, X_test, y_test, threshold=0.80):
    """모델 성능 체크"""
    y_pred = model.predict_proba(X_test)[:, 1]
    auc = roc_auc_score(y_test, y_pred)
    
    if auc < threshold:
        print(f"⚠ Performance Drop! AUC: {auc:.3f}")
        trigger_retraining()
        send_alert(f"AUC dropped to {auc:.3f}")
```

#### 트리거 ③: Drift 기반

```python
def check_drift(reference, current, psi_threshold=0.25):
    psi = calculate_psi(reference, current)
    
    if psi > psi_threshold:
        print(f"⚠ Drift Detected! PSI: {psi:.3f}")
        trigger_retraining()
```

### 3. 재학습 전략 비교

| 전략 | 장점 | 단점 |
|------|------|------|
| **정기** (월/분기) | 안정, 예측 가능 | 변화 대응 늦음 |
| **성능 기반** | 자동 | 임계값 설정 어려움 |
| **Drift 기반** | 사전 대응 | False Positive |
| **하이브리드** | 가장 강력 | 복잡 |

### 4. 점진적 학습 (Incremental Learning)

#### Online Learning

```python
# river 라이브러리
from river import linear_model

model = linear_model.LogisticRegression()

# 한 샘플씩 학습
for x, y in stream:
    pred = model.predict_one(x)
    model.learn_one(x, y)
```

### 5. 모델 버전 관리 (MLflow)

```python
import mlflow
from mlflow.tracking import MlflowClient

# 모델 등록
mlflow.set_tracking_uri('http://mlflow-server:5000')

with mlflow.start_run():
    model.fit(X_train, y_train)
    mlflow.sklearn.log_model(model, 'credit_model')
    mlflow.log_metric('auc', 0.85)

# 버전 관리
client = MlflowClient()
client.transition_model_version_stage(
    name='credit_model',
    version=3,
    stage='Staging'  # → Production → Archived
)
```

> ✅ **여기까지 따라왔으면**: 재학습 트리거 + MLflow까지 완성.

---

## 🟣 [전공자] — 학술적 깊이

### 1. Concept Drift 학술

> 📄 Gama, J., Žliobaitė, I., Bifet, A., Pechenizkiy, M., & Bouchachia, A. (2014). A survey on concept drift adaptation. *ACM Computing Surveys*, 46(4).

Drift 4가지 유형:
- Sudden (급격)
- Gradual (점진)
- Incremental (증분)
- Recurring (재발)

### 2. Wasserstein Distance 학술

> 📄 Villani, C. (2008). *Optimal transport: Old and new*. Springer.

수학적으로 정의된 분포 간 거리.

### 3. Multi-Armed Bandit 학술

#### Thompson Sampling
> 📄 Russo, D., Van Roy, B., Kazerouni, A., Osband, I., & Wen, Z. (2018). A tutorial on Thompson sampling. *Foundations and Trends in Machine Learning*, 11(1).

#### Upper Confidence Bound (UCB)
> 📄 Auer, P. (2002). Using confidence bounds for exploitation-exploration trade-offs. *JMLR*, 3.

### 4. Online Learning 학술

> 📄 Hazan, E. (2016). Introduction to online convex optimization. *Foundations and Trends in Optimization*, 2(3-4).

### 5. Adversarial Drift

> 📄 Lu, J., Liu, A., Dong, F., Gu, F., Gama, J., & Zhang, G. (2018). Learning under concept drift: A review. *IEEE TKDE*, 31(12).

### 🟣 [전공자 심화] — Drift 탐지 지표(PSI/KS/KLD)의 한계와 후속 연구

#### 원논문 / 표준 지표의 한계

**PSI (Population Stability Index)** — Karakoulas, G. (2004). *Empirical Validation of Retail Credit-Scoring Models.* RMA Journal — 신용평가 실무 standard
- PSI는 *데이터 분포(covariate)* 변화만 측정 → $P(Y|X)$가 바뀌는 *concept drift* 는 못 잡음.
- bin 경계와 개수에 매우 민감 → 데이터셋 간 직접 비교 어려움.
- "0.1 안전 / 0.25 위험" 임계값은 학술적 근거 없는 휴리스틱(SAS 백서 등에서 전파).
- 클래스 불균형이 큰 사기 탐지에선 PSI가 0이어도 사기율은 급변할 수 있음.

**KS Test (Kolmogorov-Smirnov)**
- 일변량 분포만 검정 → 다변량 공동분포 변화 미감지.
- 표본 크기가 크면 *모든* 차이를 통계적으로 유의하게 만들어 false alarm 폭발.
- 이산형/범주형 변수에 직접 적용 불가.

**KLD/JSD**
- KLD는 비대칭 + 한쪽 분포에서 0인 bin이 있으면 발산.
- JSD는 대칭이지만 sample 추정 시 편향 큼.

**Gama et al. (2014) survey의 한계**
- "데이터 드리프트 vs 개념 드리프트" 구분을 강조하지만, 실무에서는 라벨 지연 때문에 둘을 *관측 시점에서* 분리 불가능 → 후속 연구는 *unlabeled drift detection*에 집중.

#### 비판 문헌

- **Webb, G. I., Hyde, R., Cao, H., Nguyen, H. L., & Petitjean, F. (2016). Characterizing concept drift. *Data Mining and Knowledge Discovery*, 30(4), 964–994.** — drift 유형 분류의 학술적 정밀화. Sudden/gradual 등 단순 분류로는 부족.
- **Rabanser, S., Günnemann, S., & Lipton, Z. C. (2019). Failing loudly: An empirical study of methods for detecting dataset shift. *NeurIPS 2019*.** arXiv:1810.11953 — PSI 류 단변량 지표가 다변량 shift 탐지에서 자주 실패함을 실증. BBSD(Black Box Shift Detection)·MMD 기반 방법 제안.
- **Lipton, Z., Wang, Y. X., & Smola, A. (2018). Detecting and correcting for label shift with black box predictors. *ICML 2018*.** arXiv:1802.03916 — label shift만 별도로 추정·보정.
- **Garg, S., Wu, Y., Balakrishnan, S., & Lipton, Z. C. (2020). A unified view of label shift estimation. *NeurIPS 2020*.** — 기존 label shift 추정기들이 동일 추정방정식의 특수해임을 보임.
- **Ackerman, S., Farchi, E., Raz, O., Zalmanovici, M., & Dube, P. (2021). Automatically detecting data drift in machine learning classifiers. *AAAI 2021 SafeAI Workshop*.** — PSI/KS 한계와 model output 기반 drift detection 비교.

#### 후속 연구 동향 (2020~)

- **Alibi Detect** (Seldon): Klaise, J., Van Looveren, A., Vacanti, G., & Coca, A. (2021). *Alibi Explain: Algorithms for explaining machine learning models.* JMLR 22(181). https://github.com/SeldonIO/alibi-detect — MMD, learned kernel, classifier-based drift, online drift detector 등 통합.
- **Evidently AI** open-source: https://github.com/evidentlyai/evidently — Wasserstein, PSI, KLD, KS 통합 + drift report 시각화 표준화.
- **River (streaming ML)**: Montiel, J., Halford, M., Mastelini, S. M., et al. (2021). *River: machine learning for streaming data in Python.* JMLR 22(110). arXiv:2012.04740 — ADWIN, DDM, EDDM 등 streaming drift detector 표준 구현.
- **MMD-based detection**: Gretton, A., Borgwardt, K. M., Rasch, M. J., Schölkopf, B., & Smola, A. (2012). *A kernel two-sample test.* JMLR 13. — 다변량 분포 차이 검정의 학술 표준. 후속 deep kernel 확장: Liu, F., Xu, W., Lu, J., et al. (2020). *Learning deep kernels for non-parametric two-sample tests.* ICML 2020. arXiv:2002.09116
- **Causal drift / spurious drift 구분**: Schrouff, J., Harris, N., Koyejo, O. O., et al. (2022). *Diagnosing failures of fairness transfer across distribution shift in real-world medical settings.* NeurIPS 2022. arXiv:2202.01034

#### 한국 적용 시 주의점

- 한국 신용평가·사기 탐지 실무는 여전히 PSI 0.25 임계값과 KS-statistic 중심으로 보고서를 작성 → 학술 기준에선 약함. SR 11-7 ongoing monitoring 요건 충족을 위해 *다변량* MMD 또는 *output-based* drift도 함께 보고하는 것을 권장.
- 라벨 지연이 30~120일인 사기 탐지에서는 *concept drift 즉시 감지 불가능*. → unlabeled covariate drift + prediction drift + claim/chargeback lag 모니터링 3종 병행.
- Evidently AI / Alibi Detect를 망분리 환경에 도입할 때 외부 telemetry(데이터 전송) 옵션을 꺼야 함 — 라이브러리 기본값에 따라 사용 통계가 외부로 전송될 수 있어 컴플라이언스 위험.
- 한국은행·금감원 모형 검증 가이드에서 "사후 모니터링 지표"의 학술 근거가 명시되지 않음 → 내부 모형 위원회 문서에 *원논문 인용*과 *임계값 근거*를 명시하는 것이 검증 통과에 유리.

---

## 📚 책에 없지만 알면 좋은 것

### 🔍 보충 1 — Concept Drift 4가지 유형 시각화

```
[Sudden Drift]    [Gradual Drift]    [Incremental Drift]    [Recurring Drift]
   ↓ 갑작스러움      ↓ 천천히               ↓ 점진적                ↓ 주기적
                                                                   
A: ━━┐                A: ━━╲                A: ━━╲                A: ━━┐  ┌━━
     │                       ╲                      ╲                  │  │
B:   └━━              B:      ╲━━           B:       ╲━              B: └━━┘
```

### 🔍 보충 2 — Champion-Challenger

```python
# 트래픽 분할
def predict(request):
    if hash(request.user_id) % 100 < 10:
        return challenger_model.predict(request)
    else:
        return champion_model.predict(request)

# 성능 추적
def track_performance(prediction, actual):
    if prediction.model == 'champion':
        champion_metrics.update(actual)
    else:
        challenger_metrics.update(actual)

# 교체 결정 (6개월 후)
if challenger_metrics.auc > champion_metrics.auc * 1.02:
    promote_to_champion(challenger_model)
```

### 🔍 보충 3 — Model Cards

Google 제안. 모델 출시 시 동봉:

```markdown
# Model Card: Credit Scoring v3

## Intended Use
- 한국 시중은행 신용평가
- 18~70세 일반인

## Performance
- AUC: 0.84
- KS: 0.48
- Training Data: 2020-2023

## Limitations
- 자영업자 정확도 낮음
- 외국인 데이터 부족

## Ethical Considerations
- 차별 검증: 성별·연령 그룹 fairness 점검
- Demographic Parity: 0.03 (낮음)
```

### 🔍 보충 4 — Shadow Mode 코드

```python
import logging

async def predict_with_shadow(request):
    # 기존 모델 (사용자 응답)
    response = champion_model.predict(request)
    
    # 새 모델 (그림자 - 사용자 안 봄)
    asyncio.create_task(shadow_predict(request, response))
    
    return response

async def shadow_predict(request, champion_response):
    """그림자 예측 (비동기)"""
    challenger_response = challenger_model.predict(request)
    
    # 비교 로그
    if champion_response != challenger_response:
        logging.info(f"Disagreement: champion={champion_response}, challenger={challenger_response}")
```

### 🔍 보충 5 — Bayesian A/B Testing

전통 A/B는 빈도주의. Bayesian은 사전 확률 활용:

```python
import pymc as pm

with pm.Model() as model:
    # 사전 분포
    p_a = pm.Beta('p_a', alpha=1, beta=1)
    p_b = pm.Beta('p_b', alpha=1, beta=1)
    
    # 관측
    obs_a = pm.Binomial('obs_a', n=n_a, p=p_a, observed=conversions_a)
    obs_b = pm.Binomial('obs_b', n=n_b, p=p_b, observed=conversions_b)
    
    # 차이
    diff = pm.Deterministic('diff', p_b - p_a)
    
    trace = pm.sample(2000)

# B가 A보다 좋을 확률
print(f"P(B > A) = {(trace.posterior['diff'] > 0).mean():.3f}")
```

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. Shadow vs. A/B 차이?

**A.**
- **Shadow**: 사용자엔 영향 없음, 두 모델 비교
- **A/B**: 일부 사용자엔 새 모델 적용, 비교

→ Shadow가 안전, A/B가 정확.

### Q2. Canary 비율 어떻게?

**A.** **점진적 확대**:
- Day 1: 1%
- Week 1: 5%
- Week 2: 25%
- Week 3: 50%
- Week 4: 100%

### Q3. PSI vs. KLD?

**A.**
- **PSI**: 실무 표준 (간단, 빠름)
- **KLD**: 학술 표준 (정확)
- **JSD**: 둘 사이 절충

### Q4. Drift 감지 어떻게 자주?

**A.**
- 실시간 시스템: 매시간/일
- 일배치 모델: 매주
- 월배치 모델: 매월

### Q5. 재학습 자동화 위험?

**A.** **위험 있음**.
- 잘못된 데이터로 학습 → 모델 악화
- → 검증 후 자동 배포

### Q6. Multi-Armed Bandit이 진짜 좋은가?

**A.** **트래픽 많을 때만**.
- 통계적 신뢰 위해 큰 표본 필요
- 작은 트래픽엔 A/B가 효과적

### Q7. 책에 없는 최신 트렌드?

**A.**
- **Adversarial Drift**: 의도적 공격
- **Causal Drift Detection**: 인과 추론
- **Federated Drift**: 분산 학습에서 Drift

---

## 🎯 핵심 7가지

1. **배포 6종**: Shadow, A/B, Canary, Interleaving, Two-Stage, Multi-Armed Bandit.
2. **Drift 3유형**: Covariate (입력), Concept (관계), Label (출력).
3. **감지 5도구**: PSI, KLD, JSD, Wasserstein, K-S Test.
4. **PSI > 0.25** = 재학습 필요.
5. **재학습 3트리거**: 정기, 성능, Drift.
6. **Evidently AI, Alibi Detect** 가 표준 도구.
7. **Champion-Challenger** 패턴이 안전한 모델 교체.

---

## 📖 더 읽을거리

### Drift Detection
- Gama, J., et al. (2014). A survey on concept drift adaptation. *ACM Computing Surveys*.
- Lu, J., et al. (2018). Learning under concept drift: A review. *IEEE TKDE*.

### 도구
- Evidently AI: https://evidentlyai.com/
- Alibi Detect: https://docs.seldon.io/projects/alibi-detect/
- AWS SageMaker Model Monitor: https://docs.aws.amazon.com/sagemaker/

### A/B Testing
- Kohavi, R., et al. (2020). *Trustworthy Online Controlled Experiments*. Cambridge UP.

### Online Learning
- River: https://riverml.xyz/

---

> **다음 절 예고** — §5.8+5.9 성과 측정 + 마무리
