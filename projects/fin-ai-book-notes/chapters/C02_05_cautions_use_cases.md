# 2.7 ~ 2.8 주의사항 + 실제 응용 사례 — *Pitfalls & Real-World Cases*

> **해설 분량**: 약 22쪽
> **읽는 데 걸리는 시간**: 약 40분

---

## 🪧 이 절을 한 줄로

> AI 투자의 **4가지 함정** (데이터 편향·시계열 특성·과적합·해석 가능성) 을 피하면서, **위성 데이터·BloombergGPT·헤지펀드** 사례에서 배운다.

책은 §2.7에서 4가지 함정을 짧게 다루고 §2.8에서 위성 데이터 + BloombergGPT + 3개 헤지펀드를 나열한다. 이 해설집은:
1. **각 함정의 실제 사례** 와 회피법
2. **사례별 기술 스택** 상세
3. **한국 헤지펀드 사례** 보강

### 📍 미리 그릴 큰 그림

<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">AI 투자 — 4가지 함정과 4가지 사례</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- 4 Pitfalls -->
    <text x="180" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">⚠ 4가지 함정 (Pitfalls)</text>
    <rect x="40" y="70" width="280" height="55" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="180" y="90" text-anchor="middle" font-weight="700" fill="#c4724e">① 데이터 편향</text>
    <text x="180" y="108" text-anchor="middle" font-size="10" fill="#57534e">생존 편향, 미래 참조 편향</text>
    <rect x="40" y="135" width="280" height="55" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="180" y="155" text-anchor="middle" font-weight="700" fill="#c4724e">② 시계열 특성</text>
    <text x="180" y="173" text-anchor="middle" font-size="10" fill="#57534e">지연, 노이즈, 짧은 시퀀스</text>
    <rect x="40" y="200" width="280" height="55" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="180" y="220" text-anchor="middle" font-weight="700" fill="#c4724e">③ 과적합</text>
    <text x="180" y="238" text-anchor="middle" font-size="10" fill="#57534e">학습 잘 → 실전 못</text>
    <rect x="40" y="265" width="280" height="55" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="180" y="285" text-anchor="middle" font-weight="700" fill="#c4724e">④ 해석 가능성</text>
    <text x="180" y="303" text-anchor="middle" font-size="10" fill="#57534e">왜 그런 결정?</text>
    <!-- 4 Cases -->
    <text x="580" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">🏢 4가지 사례 (Cases)</text>
    <rect x="440" y="70" width="280" height="55" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="580" y="90" text-anchor="middle" font-weight="700" fill="#3a7d44">① 위성 이미지 페어</text>
    <text x="580" y="108" text-anchor="middle" font-size="10" fill="#57534e">UA vs. Nike</text>
    <rect x="440" y="135" width="280" height="55" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="580" y="155" text-anchor="middle" font-weight="700" fill="#3a7d44">② BloombergGPT</text>
    <text x="580" y="173" text-anchor="middle" font-size="10" fill="#57534e">500억 파라미터 금융 LLM</text>
    <rect x="440" y="200" width="280" height="55" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="580" y="220" text-anchor="middle" font-weight="700" fill="#3a7d44">③ Castle Ridge / State Street</text>
    <text x="580" y="238" text-anchor="middle" font-size="10" fill="#57534e">DL + GA + Seq2Seq</text>
    <rect x="440" y="265" width="280" height="55" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="580" y="285" text-anchor="middle" font-weight="700" fill="#3a7d44">④ MAN AHL</text>
    <text x="580" y="303" text-anchor="middle" font-size="10" fill="#57534e">2009~ Bayesian ML + NLP</text>
  </g>
</svg>

---

## 🟢 [초급] — 4가지 함정 비유

### 1. 함정 ①: 생존 편향 (Survivorship Bias)

#### 비유: "성공한 가게만 보는 함정"

너가 강남역 가서 "음식점 1000개 다 잘 되더라" 라고 결론. **사실**: 망한 가게 5000개는 안 보임.

#### 금융 사례
- 백테스트할 때 **현재 상장 종목만 사용** → 망한 회사 (코스닥 상폐 등) 제외
- 결과: 수익률 과대평가

#### 회피법
- **상장폐지 데이터까지 포함** (CRSP, KIS 자료)
- "Point-in-Time" 데이터 사용

### 2. 함정 ②: 미래 참조 편향 (Look-Ahead Bias)

#### 비유: "내일 신문 보고 오늘 투자"

미래 정보를 실수로 모델에 넣는 것.

#### 금융 사례
```python
# 잘못된 코드
df['MA20'] = df['Close'].rolling(20).mean()  # OK
df['Signal'] = (df['Close'] > df['MA20']).astype(int)  # OK
df['Return'] = df['Close'].shift(-1) / df['Close']  # OK (다음날 수익)

# 함정!
df['Signal_Wrong'] = (df['Close'] > df['Close'].shift(-1)).astype(int)
# → "내일 가격 알고 오늘 신호 만듦"
```

#### 회피법
- 시계열은 항상 **과거만 사용**
- `shift(1)` 등으로 1일 지연

### 3. 함정 ③: 과적합 (Overfitting)

#### 비유: "시험 족보만 외운 학생"

족보 100점, 실제 시험 50점.

#### 금융 사례
- 백테스트: 연 50% 수익
- 실전: 연 -10% 손실
- → **과거 데이터의 노이즈를 패턴으로 오인**

#### 회피법
- Train/Test Split (반드시 시간 순서)
- Cross-Validation
- Out-of-Sample 검증
- 모델 단순화

### 4. 함정 ④: 해석 가능성 (Explainability)

#### 비유: "AI가 사라고 했는데, 왜인지는 몰라"

손실 났을 때 원인 분석 불가능.

#### 금융 사례
- 딥러닝 모델: 왜 매수했는지 설명 어려움
- 규제 (금융위 가이드라인): 설명 가능성 의무
- → **금융 AI는 XAI (SHAP, LIME) 필수**

> ✅ **여기까지 따라왔으면**: AI 투자의 4가지 함정과 그 회피법이 보일 거다.

---

## 🟡 [중급] — 함정 깊이 보기

### 1. 데이터 편향 5종 — 상세

| 편향 | 원인 | 사례 | 회피 |
|------|------|------|------|
| **Survivorship Bias** | 망한 거 제외 | KOSPI 백테스트에서 상장폐지 누락 | Point-in-Time DB |
| **Look-Ahead Bias** | 미래 정보 사용 | shift(-1) 실수 | 시간 순서 엄격 |
| **Selection Bias** | 좋은 결과만 선별 | "이 종목만 봐도 알파" | 무작위 샘플링 |
| **Time-Period Bias** | 특정 기간 선택 | 2020년 코로나 직전~ | 다양한 기간 |
| **Confirmation Bias** | 가설 맞는 데이터만 | "이 모델이 맞아" | 반증 시도 |

### 2. 시계열 데이터의 특성

#### 2.1 짧은 시퀀스 문제

40년 일간 데이터:
- $40 \times 252 = 10{,}080$ 데이터 포인트
- 그러나 의미 있는 사이클은 수십 회 (경기 침체, 위기)
- → **통계적 유의성 부족**

#### 2.2 비정상성 (Non-Stationarity)

금융 데이터는 **시간에 따라 통계 성질이 변함**:
- 평균 변동
- 분산 변동 (변동성 군집)
- 자기상관 변동

→ ML 모델의 가정 위반 → 성능 저하.

#### 2.3 GBM과 AR(1) 모형

기하 브라운 운동 (GBM):
$$ dS_t = \mu S_t dt + \sigma S_t dW_t $$

이산화하면 사실상 AR(1):
$$ \log P_t - \log P_{t-1} = \mu \Delta t + \sigma \sqrt{\Delta t} \cdot \varepsilon_t $$

→ 단순한 모델이지만 실전에서 충분히 강력.

### 3. 과적합 회피의 4가지 핵심 도구

#### 3.1 시계열 Cross-Validation

```python
from sklearn.model_selection import TimeSeriesSplit

tscv = TimeSeriesSplit(n_splits=5)
for train_idx, test_idx in tscv.split(X):
    X_train, X_test = X[train_idx], X[test_idx]
    y_train, y_test = y[train_idx], y[test_idx]
    # 학습 및 평가
```

#### 3.2 Walk-Forward Analysis

```
훈련: 2010-2015 → 검증: 2016
훈련: 2010-2016 → 검증: 2017
훈련: 2010-2017 → 검증: 2018
...
```

#### 3.3 Regularization

```python
# Lasso (L1)
from sklearn.linear_model import Lasso
model = Lasso(alpha=0.1)

# Ridge (L2)
from sklearn.linear_model import Ridge
model = Ridge(alpha=0.1)

# Elastic Net (둘 다)
from sklearn.linear_model import ElasticNet
model = ElasticNet(alpha=0.1, l1_ratio=0.5)
```

#### 3.4 Deflated Sharpe Ratio (López de Prado)

여러 모델 시도 시 알파의 운(luck) 보정:
$$ \hat{SR}_{Deflated} = \frac{SR - E[\max_n SR]}{\hat{\sigma}_{SR}} $$

### 4. XAI 도구 — 해석 가능성 확보

#### 4.1 SHAP

```python
import shap

# Tree 모델 (XGBoost)
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X)

# 시각화
shap.summary_plot(shap_values, X)
shap.dependence_plot('momentum', shap_values, X)
shap.force_plot(explainer.expected_value, shap_values[0], X.iloc[0])
```

#### 4.2 LIME

```python
from lime.lime_tabular import LimeTabularExplainer

explainer = LimeTabularExplainer(X_train.values, feature_names=X_train.columns)
exp = explainer.explain_instance(X_test.iloc[0].values, model.predict_proba)
exp.show_in_notebook()
```

> ✅ **여기까지 따라왔으면**: 4가지 함정과 그 회피 도구를 알게 됐을 거다.

---

## 🔴 [고급] — 실제 응용 사례 상세

### 1. 사례 ①: 위성 이미지 페어 트레이딩

#### 1.1 책 본문 사례
> "Pairs Trading Strategy with Geolocation Data—The Battle between Under Armour and Nike"
> *Journal of Financial Data Science* 2(1), 126–143 (2020) — Liew et al.

#### 1.2 방법론

```
[데이터]
- 위성 이미지: Spire Global, Planet Labs
- Under Armour vs. Nike 매장 주차장 사진
- 차량 수 자동 카운트 (CNN)

[분석]
- 매장 방문자 → 매출 추정
- 두 회사 매출 트렌드 비교
- 한 회사 더 강하면 → 페어 트레이딩

[성과]
- 백테스트: 연 8~12% 알파
- 단, 데이터 비용 매우 비쌈
```

#### 1.3 시각화

<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">위성 데이터 페어 트레이딩 — 데이터 흐름</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <rect x="20" y="80" width="140" height="80" rx="8" fill="#fef9e7" stroke="#8a6d2c"/>
    <text x="90" y="105" text-anchor="middle" font-weight="700" fill="#8a6d2c">🛰 위성 데이터</text>
    <text x="90" y="125" text-anchor="middle" font-size="10" fill="#57534e">Spire, Planet</text>
    <text x="90" y="142" text-anchor="middle" font-size="10" fill="#57534e">$10K~/year</text>
    <text x="165" y="125" font-size="20" fill="#a8a29e">→</text>
    <rect x="190" y="80" width="140" height="80" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="260" y="105" text-anchor="middle" font-weight="700" fill="#c4724e">🤖 CNN 분석</text>
    <text x="260" y="125" text-anchor="middle" font-size="10" fill="#57534e">차량 수 카운트</text>
    <text x="260" y="142" text-anchor="middle" font-size="10" fill="#57534e">매장별, 일간</text>
    <text x="335" y="125" font-size="20" fill="#a8a29e">→</text>
    <rect x="360" y="80" width="140" height="80" rx="8" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="430" y="105" text-anchor="middle" font-weight="700" fill="#5a7a96">📊 매출 예측</text>
    <text x="430" y="125" text-anchor="middle" font-size="10" fill="#57534e">UA: $1B</text>
    <text x="430" y="142" text-anchor="middle" font-size="10" fill="#57534e">Nike: $5B</text>
    <text x="505" y="125" font-size="20" fill="#a8a29e">→</text>
    <rect x="530" y="80" width="170" height="80" rx="8" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="615" y="105" text-anchor="middle" font-weight="700" fill="#3a7d44">💰 페어 매매</text>
    <text x="615" y="125" text-anchor="middle" font-size="10" fill="#57534e">Long Nike</text>
    <text x="615" y="142" text-anchor="middle" font-size="10" fill="#57534e">Short UA</text>
  </g>
  <text x="360" y="210" text-anchor="middle" font-size="11" font-style="italic" fill="#57534e">실적 발표 (분기 후행) 전에 매출 신호 확보 → 알파 창출</text>
</svg>

#### 1.4 한계
- **비싸다**: 위성 데이터 $10K~100K/년
- **알파 빠르게 사라짐**: 모두 알게 되면 효과 ↓
- **노이즈**: 차량 수 추정 정확도 80%

### 2. 사례 ②: BloombergGPT — 금융 특화 LLM

#### 2.1 스펙

| 항목 | BloombergGPT | GPT-3 (비교용; GPT-3.5 파라미터 비공개) |
|------|------------|---------|
| 파라미터 | 500억 | 1,750억 |
| 데이터셋 | 708B 토큰 (학습 사용 569B) | 약 300B 토큰 |
| 금융 데이터 | 363B 토큰 (FinPile) | 적음 |
| 학습 비용 | $2.67M~$10M 추정 | $1000만+ |
| 학습 시간 | 53일 (64 nodes = **512 A100 GPUs**) | 더 김 |

> ⚠ 정정: GPT-3.5의 정확한 파라미터 수는 공식 비공개. "1,750억"은 GPT-3의 수치다. BloombergGPT 학습 데이터는 "데이터셋 708B 중 실제 학습 사용 569B 토큰"이 정확한 표현.

#### 2.2 데이터 구성

```
금융 데이터 51%:
- 블룸버그 자체 (FinPile)
- 뉴스 기사
- 보도자료
- SEC 공시
- Bloomberg Terminal 데이터

일반 데이터 49%:
- C4 (Common Crawl)
- GitHub
- Wikipedia
- Books
```

#### 2.3 성능

| 벤치마크 | BloombergGPT | GPT-3 |
|---------|------------|--------|
| **일반 벤치마크** | 비슷 | 비슷 |
| **금융 NER** | 압도 | - |
| **감정 분석 (FPB)** | 51% | 28% |
| **헤드라인 분류** | 80% | 70% |

#### 2.4 활용 사례
- 금융 보고서 자동 요약
- 시장 동향 자연어 분석
- 펀더멘털 데이터 추출
- 블룸버그 터미널 통합

#### 2.5 한계
- 비공개 (블룸버그 고객만)
- 실시간 데이터 X (학습 시점 까지)
- 환각 (Hallucination) 위험

#### 2.6 대안: FinGPT (오픈소스)

```python
from transformers import pipeline

# FinGPT
pipe = pipeline("text-generation", model="FinGPT/fingpt-mt_llama2-7b_lora")
result = pipe("Samsung's quarterly earnings beat expectations.")
```

### 3. 사례 ③: Castle Ridge Asset Management

#### 3.1 W.A.L.L.A.C.E 알고리즘

- 자체 개발 알고리즘 (실존, Castle Ridge Mgmt 본사 Toronto/NY)
- **"Geno-Synthetic Algorithms"** (자체 명칭, 진화 계산 기반)
- 42+ 차원의 데이터 분석
- 시장 하강 국면 포착 특화

#### 3.2 데이터 구성
공식 자료엔 구체 비중 미공개. 다양한 정형/비정형 데이터 융합으로 알려짐.

> ⚠ 정정: 초기 작성본의 "주가 45% / 재무 35% / 텍스트 15%" 비중은 출처 미확인 → 제거. Castle Ridge 공식 자료엔 비중 미공개.

#### 3.3 의의
- 진화 계산 + ML 융합
- 위기 대응 특화
- 비공개 알고리즘 (구체 동작 미공개)

### 4. 사례 ④: State Street Corporation

#### 4.1 거래량 예측 DL

- Seq2Seq 모델 (RNN 기반)
- CNN과 결합
- PyTorch 사용
- 미국 5대 수탁은행 중 하나

#### 4.2 활용
- 주식 거래 실행 (Best Execution)
- 시장조성
- 슬리피지 최소화

### 5. 사례 ⑤: MAN AHL (런던 헤지펀드)

#### 5.1 개요
- 1987 설립, 모회사 **Man Group 전체 AUM 약 $168.6B (FY2024 결산, Man Group 공식)**
- AHL은 Man Group의 systematic strategies 사업부 (Discretionary/Systematic/Solutions/Credit 중 systematic 부문)
- AHL 단독 AUM은 공식 분리 공시되지 않음 (GSFM 등 한정 출처에서 $60B대 추정 보도)
- **2009년부터 ML 본격 도입**

> ⚠ 정정 (2차): 초기 "$80B+" 및 1차 정정의 "$60.3B (2024.3)" 모두 단일 출처 한계. Man Group은 사업부별 AUM을 별도 공시하지 않으며, **Man Group 전체 $168.6B (FY2024)** 가 공식 검증 가능한 수치. AHL 단독은 추정 범위로만 언급 가능.

#### 5.2 사용 기술
- **Bayesian Machine Learning**: 불확실성 정량화
- **Deep Learning**: 패턴 인식
- **NLP**: 뉴스 감정 분석
- **호가창 (Order Book) 데이터**: 시장 미시구조
- **Python**: 주요 언어

#### 5.3 전략
- Managed Futures (선물)
- Multi-Strategy
- ESG 통합

### 6. 한국 사례 (책에 없는 추가)

#### 6.1 타임폴리오 자산운용
- 한국 1위 헤지펀드 (운용 10조원+)
- ML 기반 멀티 전략
- 시중은행과 협업

#### 6.2 한국투자증권 알고리즘 트레이딩
- 자체 알고리즘 거래 시스템
- 외국인 대비 한국 시장 마이크로구조 특화

#### 6.3 신한AI
- 신한금융지주의 AI 자회사
- 금융 LLM 자체 개발
- 한국어 특화

#### 6.4 KB자산운용 KB STAR
- AI 기반 ETF 운용
- 팩터 모델 + ML

---

## 🟣 [전공자] — 학술적 깊이

### 1. 백테스트 함정 (López de Prado)

#### 7 Sins of Quantitative Investing
> 📄 López de Prado, M. (2018). The 10 reasons most machine learning funds fail. *Journal of Portfolio Management*, 44(6).

1. **Sirens of Beauty**: 너무 정교한 모델 (단순한 게 낫다)
2. **Backtest Overfitting**: 백테스트만 좋음
3. **Misuse of CV**: 시계열에 일반 CV 사용
4. **Misuse of Hyperparameter Tuning**
5. **Ignoring Microstructure**
6. **Crowded Strategies**
7. **Ignoring Regime Changes**
8. **Memory Loss**
9. **Failure to Acknowledge Uncertainty**
10. **Lack of Realism**

#### Probability of Backtest Overfitting (PBO)

$$ \text{PBO} = \frac{|\{n : R^*_n < \tilde{R}^*_n\}|}{N} $$

여러 전략 시도 시 In-Sample 최고가 Out-of-Sample에서도 최고일 확률.

### 2. Concept Drift in Finance

> 📄 Krawczyk, B., et al. (2017). Ensemble learning for data stream analysis: A survey. *Information Fusion*, 37.

금융 데이터는 항상 변함:
- 2008 금융위기: 모델 가정 깨짐
- 2020 코로나: 변동성 폭증
- 2022 인플레이션: 금리 환경 변화

**대응**:
- Online Learning
- Adaptive Models
- Concept Drift Detection

### 3. BloombergGPT 학술 자료

> 📄 Wu, S., Irsoy, O., Lu, S., et al. (2023). BloombergGPT: A large language model for finance. arXiv:2303.17564.

핵심 기여:
- 금융 특화 LLM의 효과성 입증
- 도메인 특화 vs. 일반 모델의 trade-off
- FinPile: 새로운 금융 LLM 학습 데이터셋

### 4. Satellite Data in Finance

> 📄 Liew, J. K.-S., Budavári, T., Kang, Z., Li, F., Wang, X., Ma, S., & Fremin, B. (2020). Pairs trading strategy with geolocation data — The battle between Under Armour and Nike. *Journal of Financial Data Science*, 2(1), 126–143.

위성 + 페어 트레이딩의 학술적 검증. (⚠ 정정: 초기 작성본의 "Mukherjee, A., et al. (2021), 3(1), 126–135" 인용은 저자·연도·권·페이지 모두 잘못. 위가 정확한 1차 자료.)

> 📄 Katona, Z., et al. (2018). On the capital market consequences of alternative data: Evidence from outer space. *Journal of Financial Economics*.

위성 데이터가 가격 발견에 기여.

### 5. Bayesian ML in Finance

> 📄 Avramov, D., et al. (2023). Machine learning vs. economic restrictions: Evidence from stock return predictability. *Management Science*, 69(5).

Bayesian 접근의 효과성. 사전 정보 (이론) + 데이터 결합.

---

### 🟣 [전공자 심화] — BloombergGPT 이후 Finance LLM 동향

#### BloombergGPT의 한계 — 학계 평가
- **폐쇄형**: 모델·코드·가중치·정확한 학습 데이터 구성 비공개 → 재현 불가.
- **벤치마크 한계**: 비교 대상이 BLOOM/GPT-NeoX/OPT 등 동시대 오픈 모델. GPT-3.5/4와의 본격 비교 부재. 후속 연구는 GPT-4가 다수 finance task에서 BloombergGPT를 능가한다고 보고.
- **task scope**: 감성·NER·분류 위주. 멀티스텝 reasoning(수익률 계산, 회계 처리) 평가 부족.
- **fine-tune의 marginal value**: 일반 LLM + RAG/few-shot이 도메인 fine-tune과 비슷한 성능을 낸다는 보고 다수.

#### 비판 문헌
- Li, X., Chan, S., Zhu, X., et al. (2023). Are ChatGPT and GPT-4 general-purpose solvers for financial text analytics? arXiv:2305.05862. https://arxiv.org/abs/2305.05862 — GPT-4가 BloombergGPT 대등/우위 task 다수.
- Shah, R. S., et al. (2022). When FLUE meets FLANG: Benchmarks and large pre-trained language model for financial domain. *EMNLP 2022*. arXiv:2211.00083.

#### 후속 연구 — 오픈소스 Finance LLM
- Yang, H., Liu, X.-Y., & Wang, C. D. (2023). FinGPT: Open-source financial large language models. arXiv:2306.06031. https://arxiv.org/abs/2306.06031 — LoRA 기반 경량 파인튜닝, AI4Finance-Foundation/FinGPT GitHub.
- Xie, Q., Han, W., Zhang, X., et al. (2023). PIXIU: A large language model, instruction data and evaluation benchmark for finance. *NeurIPS 2023 Datasets & Benchmarks*. arXiv:2306.05443.
- Wang, N., Yang, H., & Wang, C. D. (2023). FinGPT: Instruction tuning benchmark for open-source large language models in financial datasets. arXiv:2310.04793.
- Araci, D. (2019). FinBERT: Financial sentiment analysis with pre-trained language models. arXiv:1908.10063. — pre-LLM 시대 encoder-only 도메인 모델. BloombergGPT(decoder-only generative)와 활용 task가 다름.

#### 실무 적용 시 주의점
- 한국어 금융 LLM은 SOTA 한국어 base(EXAONE, HyperCLOVA-X, Polyglot-Ko) 위에 DART 공시·증권사 보고서·연합인포맥스 뉴스로 LoRA 파인튜닝하는 패턴 일반화.
- 표준화된 한국어 finance benchmark 부재(KorFin-ASA 정도). 영어 FPB/FiQA 결과를 한국어로 확장 검증 불가.
- 환각 위험: 종목코드·재무수치 생성 시 RAG + 검증 단계 필수. 단독 LLM 출력 신뢰 금지.

---

## 📚 책에 없지만 알면 좋은 것

### 🔍 보충 1 — Renaissance Medallion vs. 다른 펀드

| 펀드 | 1988-2018 연평균 |
|------|----------------|
| Medallion | **39%** (수수료 후) |
| S&P 500 | 9% |
| 평균 헤지펀드 | 7% |
| 평균 액티브 펀드 | 5% |

→ Medallion은 통계적 이상치. **외부 자금 안 받음 → 규모 제한 → 알파 유지**.

### 🔍 보충 2 — 한국 시장 AI 적용의 어려움

#### 데이터 한계
- KOSPI 30년 (미국 100년)
- 회계 기준 변경 (IFRS 2011)
- 상장 종목 시계열 짧음

#### 시장 특성
- 외환위기, 글로벌 위기 영향 큼
- 외국인 비중 30% → 거시 의존
- 산업 집중도 높음 (반도체)

#### 규제
- 공매도 제한 (부분 재개)
- 시장조성 의무
- 호가 단위 제한

### 🔍 보충 3 — Deepfake와 시장 조작

#### 새로운 위협
- AI 생성 가짜 뉴스
- 가짜 CEO 음성/영상
- 자동 SNS 봇

#### 사례
- 2023.5: 가짜 펜타곤 폭발 사진 → 일시 S&P -0.3%
- 2024: AI 생성 가짜 어닝 콜

#### 대응
- 출처 검증 자동화
- 멀티모달 감지 모델

### 🔍 보충 4 — Quantum Computing in Finance

#### 미래 잠재력
- 포트폴리오 최적화 (이론상 더 빠름)
- 옵션 가격 결정 (Monte Carlo 가속)
- 시뮬레이션

#### 현실
- 양자 컴퓨터 아직 실용 수준 아님
- IBM, Google이 연구 단계
- 5~10년 후 실용화 추정

### 🔍 보충 5 — 한국 금융 AI 일자리 트렌드

#### 채용 트렌드 (2024)
- 카뱅·토스: ML 엔지니어 가장 많음
- 시중은행: 데이터 사이언티스트 확대
- 헤지펀드: 매우 제한적
- 자산운용사: AI 부서 신설

#### 연봉 (2024 기준)
- 신입: 7000만~1.5억
- 시니어: 1억~3억
- 카뱅·토스 가산점: 10~20%

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. 4가지 함정 중 가장 흔한 것은?

**A.** **과적합**. 거의 모든 ML 프로젝트가 처음에 함정에 빠짐.

방지법:
- Train/Validation/Test 엄격 분리
- 시간 순서 유지
- 모델 단순화
- Out-of-Sample 검증

### Q2. 위성 데이터가 진짜 알파를 만드나?

**A.** **만들었지만 빠르게 사라짐**.
- 2015~2018: 초기 진입자 큰 알파
- 2020~: 일반화 → 알파 감소
- 2024: 대형 펀드들 모두 사용 → "공공 정보"

### Q3. BloombergGPT를 일반 투자자가 쓸 수 있나?

**A.** **블룸버그 터미널 가입자만**.
- 비용: $24K/년
- 대안: **FinGPT** (오픈소스) 또는 GPT-4 + 자체 RAG

### Q4. 한국에 비슷한 사례가 있나?

**A.** **부분적으로**.
- 신한AI: 자체 LLM
- 네이버 클로바: 금융 도메인 모델
- 카카오엔터프라이즈: 금융 LLM (개발 중)
- 한국어 특화 금융 LLM은 **현재 거의 없음**

### Q5. 헤지펀드 들어가려면?

**A.** **매우 어려움**.

필요:
- 통계/수학 박사 (선호) 또는 강력한 실무 경험
- ML 프로젝트 포트폴리오
- Kaggle 상위권
- 영어 능력

한국에선 자산운용사 → 헤지펀드 경로가 일반적.

### Q6. AI 트레이딩 시스템을 개인이 만들 수 있나?

**A.** **가능, 그러나 알파 만들기는 어려움**.

가능:
- 시스템 구축: Python + API
- 백테스팅: backtrader, zipline
- 자동 매매: 키움/한투 API

어려움:
- 일관된 알파
- 수수료/슬리피지 극복
- 거시 변동 대응

### Q7. AI vs. 인간 트레이더, 미래는?

**A.** **둘 다 살아남되 역할 분리**.

- HFT, 시장조성: AI
- 단기 매매: AI 위주
- 중장기 가치 투자: 인간 + AI 보조
- 거시 매크로: 인간 우위 유지

---

## 🎯 이 절에서 가져갈 핵심 7가지

1. **AI 투자 4가지 함정**: 데이터 편향·시계열 특성·과적합·해석 가능성.
2. **생존 편향**: 상장폐지 데이터 누락 → 수익률 과대평가.
3. **시계열 CV** 가 일반 CV보다 중요 (시간 순서 유지).
4. **위성 데이터 페어 트레이딩**: 책 본문 사례, $10K+/년.
5. **BloombergGPT**: 500억 파라미터 금융 LLM, FinPile 데이터.
6. **MAN AHL**: 2009~ ML 본격 도입 헤지펀드 (Bayesian + DL + NLP).
7. **한국 사례**: 타임폴리오, 신한AI, KB STAR — 아직 글로벌 헤지펀드 수준엔 미달.

---

## 📖 더 읽을거리

### 백테스트 함정
- López de Prado, M. (2018). *Advances in Financial Machine Learning*. — **함정 회피의 바이블**.
- Bailey, D. H., & López de Prado, M. (2014). The deflated Sharpe ratio. *JPM*.

### 위성 데이터
- Liew, J. K.-S., et al. (2020). Pairs trading strategy with geolocation data — The battle between Under Armour and Nike. *Journal of Financial Data Science*, 2(1), 126–143.
- Katona, Z., et al. (2018). On the capital market consequences of alternative data. *JFE*.

### BloombergGPT
- Wu, S., et al. (2023). BloombergGPT. arXiv:2303.17564.
- FinGPT: https://github.com/AI4Finance-Foundation/FinGPT

### 헤지펀드 사례
- Zuckerman, G. (2019). *The Man Who Solved the Market* (Renaissance).
- MAN Group: https://www.man.com/research

### XAI
- Lundberg, S. M., & Lee, S. I. (2017). A unified approach to interpreting model predictions. *NeurIPS*.
- Molnar, C. (2024). *Interpretable Machine Learning*. — 무료 PDF.

### 한국
- 한국증권학회. 매년 학술지 발간.
- 자본시장연구원. 동향 보고서.

---

## 📋 검증 노트 / 변경 이력

| # | 항목 | 초기 작성본 | 수정 내용 | 1차 출처 |
|---|---|---|---|---|
| 1 | BloombergGPT GPT-3.5 비교 | "GPT-3.5 1,750억 파라미터" | **GPT-3 1,750억**; GPT-3.5 파라미터는 공식 비공개 | [BloombergGPT 논문 2303.17564](https://arxiv.org/abs/2303.17564) |
| 2 | BloombergGPT 토큰 | "학습 데이터 7,080억 토큰" | **데이터셋 708B, 학습 사용 569B 토큰** | 同上 |
| 3 | MAN AHL AUM | "$80B+ (2024)" | **Man Group 전체 ~$168.6B (FY2024 공식)**; AHL 사업부 단독은 공식 분리 공시 없음 | [Man Group 2024](https://www.man.com/results-for-the-financial-year-ended-31-december-2024) |
| 4 | WALLACE 45/35/15 가중치 | 명시적 수치 | **출처 없음 → 삭제** | Castle Ridge 발표만 |
| 5 | LOXM acronym | "Limit Order eXecution Model" | **공식 acronym 미확인 → 표현 약화** | — |

---

> **다음 절 예고** — §2.9 마무리 + 실습 1, 2, 3 진입
> Ch2 전체 요약 후 본격 실습 (전통 퀀트 → ML → DL) 들어간다.
