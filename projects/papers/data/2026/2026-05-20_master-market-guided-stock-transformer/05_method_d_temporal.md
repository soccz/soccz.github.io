# 05_method_d_temporal — 방법론: 시간 집계·예측·학습 설정

## 📌 이 챕터 다 읽으면 알 수 있는 것

- Temporal Aggregation 의 정확한 메커니즘 (마지막 시각 Query 기반 attention)
- 예측 레이어와 손실 함수 설정
- 학습 데이터 분할 (Q1 2008 ~ Q4 2022) 의 의미
- Alpha158 + RobustZScoreNorm + CSZscoreNorm 의 전처리 파이프라인
- 조기 종료 (early stopping) 의 학습 손실 임계값 기반 설계와 그 의의

---

> **배경 사다리**: ① **Cross-Entropy Loss** = 분류 문제의 손실함수 (분포 차이 측정). ② **MSE (Mean Squared Error, 평균제곱오차)** = 회귀 문제에서 예측값과 실제값의 차이를 제곱해 평균. ③ **Rank IC** = 예측 순위와 실제 수익률 순위의 Spearman 상관계수, 범위 $[-1, 1]$, 0.05 이상이면 실무 유의. ④ **RobustZScoreNorm** = 평균/std 대신 중간값/MAD (median absolute deviation) 로 정규화 → outlier robust. ⑤ **CSZscoreNorm** = Cross-Sectional ZScore — 같은 날짜의 종목 간 표준화. 이 절은 앞 세 파일의 연속이므로 $H$, $Z$ 등 기호가 앞 파일에서 이어진다.

### 🌱 Temporal Aggregation — 일상 비유

**한 줄로**: "8일치 정보를 '오늘 입장에서 어떤 과거가 가장 중요한가?' 라는 질문으로 한 줄 요약".

- **다른 방법**: 8일치를 산술 평균 → 모든 날을 똑같이 취급 (구식, 정보 손실)
- **MASTER 방법**: 가장 최신날(t=T) 임베딩이 Query → "내가 예측하는 입장에서 며칠 전이 중요해?" 라고 묻고 차등 가중
- **결과**: 1개의 종합 벡터 $e_n \in \mathbb{R}^d$ → 이 벡터 → 선형 레이어 → 1개의 수익률 점수 $s_n$

**왜 마지막 시각 Query**: 예측은 "지금 이후 5일"이 타깃이므로, 가장 최신 시점이 가장 예측과 관련 깊다. 그가 "과거의 어떤 패턴이 지금 상황과 닮았나?" 를 골라낸다.

### 🌱 두 번째 비유 — 시험 전날 복습

학생이 시험 전날 (= 시점 $T$) 1주일 (= $T=8$ 일) 노트를 보며:

| 단계 | 비유 |
|------|------|
| Q1: 시험 (예측 대상) 본다 | "내일 시험엔 미적분이 핵심이야" — Query 형성 |
| Q2: 1주일 노트 본다 | "어느 날 노트가 가장 미적분 다뤘지?" — Key 비교 |
| Q3: 가중합 | "5일 전 노트 70%, 어제 25%, 그제 5% 참고" — softmax 분배 |
| 결과 | 1주일 정보가 1개 핵심 요약본 ($e_n$) 으로 |

**대안 (단순 평균)** 의 문제: 모든 날을 동등하게 보면 시험과 무관한 날 (예: 영어 수업) 도 25% 포함 → 정보 희석.

---

## 1. 단계 4: 시간 집계 (Temporal Aggregation)

### 1.1 무엇을 하는가

교차 종목 임베딩 $Z \in \mathbb{R}^{N \times T \times d}$ 에서, 각 종목 $n$ 에 대해 "**마지막 시각($t=T$)의 임베딩이 전체 T개 시간 임베딩을 쿼리**" 하여 하나의 종합 종목 임베딩 $e_n \in \mathbb{R}^d$ 을 만든다.

### 1.2 수학적 구조

$$e_n = \text{Attn}\left(Z_{n,T}, Z_{n,:}, Z_{n,:}\right)$$

풀어 쓰면:
$$\alpha_t = \frac{\exp\left(\frac{(Z_{n,T} W_Q)(Z_{n,t} W_K)^\top}{\sqrt{d_k}}\right)}{\sum_{t'=1}^{T} \exp\left(\frac{(Z_{n,T} W_Q)(Z_{n,t'} W_K)^\top}{\sqrt{d_k}}\right)}$$
$$e_n = \sum_{t=1}^{T} \alpha_t \cdot (Z_{n,t} W_V)$$

(이는 single-head attention 의 풀이. multi-head 면 $h$ 번 반복 + concat.)

### 1.3 🔣 Temporal Aggregation 4-단 풀이

| 기호 | 의미 | 차원 | 직관 |
|------|------|------|------|
| $Z_{n,:} \in \mathbb{R}^{T \times d}$ | 종목 $n$ 의 $T$ 시점 inter-stock 출력 | $(8, d)$ | "8일치 사후 시장 일기" |
| $Z_{n,T}$ (Query) | 가장 최신 (예측 직전) 시점 | $(d,)$ | "내가 예측하는 입장" |
| $Z_{n,:}$ (Key, Value) | 모든 $T$ 개 시각 임베딩 | $(T, d)$ | "참고할 과거 자료" |
| $\alpha_t$ | $t$ 시점에 대한 어텐션 가중치 | scalar | "$t$ 시점이 얼마나 중요한가" (합 1) |
| $e_n$ | 종합 종목 임베딩 | $(d,)$ | "예측을 위한 압축 정보" |

**유의**: Query 가 단 하나 ($Z_{n,T}$) 이므로 어텐션 행렬이 $1 \times T$ 가 됨. 출력도 단일 벡터 $e_n$.

### 1.4 왜 이 형태 — 대안 비교

| 시간 집계 방법 | 동작 | 장점 | 단점 |
|---------------|------|------|------|
| **Mean pooling** | $e_n = \frac{1}{T}\sum_t Z_{n,t}$ | 단순, 빠름 | 모든 날 동등 → 정보 희석 |
| **Last timestep** | $e_n = Z_{n,T}$ | 단순, 최신 강조 | 과거 정보 완전 무시 |
| **Self-attention (full)** | $T \times T$ 어텐션 | 모든 쌍 관계 | 출력 $T$ 개 → 추가 집계 필요 |
| **MASTER 의 Query-T attention** | $1 \times T$ (Query = 마지막) | 단순 + 최신 중심 차등 | Query 가 1개 → 표현력 제한 |

**MASTER 의 선택 이유**:
- 예측 시점이 $T+1, \ldots, T+5$ → 가장 최신 시점이 예측과 가장 관련.
- 단일 Query 라 추가 집계 불필요 → 효율적.
- 어텐션 가중치 $\alpha_t$ 가 해석 가능 → "어느 날이 중요했나" 분석 가능.

### 1.5 일상 비유

8일치 일기를 다 쓴 후, 오늘 (마지막 날) 입장에서:
- "내일 시험에 가장 중요한 내용이 무엇이었을까?" 질문
- 과거 7일 일기에서 관련 내용을 골라 요약본 생성
- 요약본 (= $e_n$) 이 시험 예측의 입력

### 1.6 조심할 점

- **정보 병목**: 이 단계에서 Query 가 $Z_{n,T}$ 단 하나 → 어텐션 출력 $e_n$ 도 단일 벡터. 이전 단계처럼 $T$ 개 임베딩 유지 X. **정보 압축 단계**.
- **최신 편향**: Query 가 마지막 시점이므로 비슷한 시점 정보에 더 큰 가중치 줄 가능성. 만약 예측에 5일 전 정보가 더 중요하면 손실 가능.

### 🔑 핵심 통찰

> Temporal aggregation 의 묘수는 **"예측 입장에서 과거 평가"**. 평균이 아닌 **목적 지향적 집계** 가 모델 성능의 핵심.

---

## 2. 단계 5: 예측 (Prediction)

### 2.1 수식

$$s_n = W_p \, e_n + b_p, \qquad W_p \in \mathbb{R}^{1 \times d}, \quad b_p \in \mathbb{R}$$

$s_n \in \mathbb{R}$ 이 종목 $n$ 의 "**5거래일 뒤 수익률** 예측 스코어".

### 2.2 출력 의미

- $s_n$ 높음 → 모델이 종목 $n$ 의 5일 후 수익률이 높다고 예측
- $s_n$ 낮음 → 낮다고 예측

**유의**: $s_n$ 의 절대값은 큰 의미 X. **순위 (rank)** 가 중요. 모든 종목의 $s_n$ 을 내림차순 정렬 → 상위 $k\%$ 가 매수 후보.

### 2.3 실제 사용 — 포트폴리오 구성

```
모든 종목 n=1..N 에 대해 s_n 계산
        ↓
내림차순 정렬 → 순위 ranking
        ↓
상위 10% 또는 30 종목 선택 (k% 또는 top-K)
        ↓
동일 가중치 (equal weight) 또는 시그모이드 가중치로 포지션 사이즈 결정
        ↓
다음 거래일 시가에 매수 → 5일 후 매도
        ↓
누적 수익률, Sharpe, MDD 등 계산
```

이 과정이 IC/Rank IC 와 **포트폴리오 성과** 를 연결한다.

### 🎯 구체 증거 — IC vs Portfolio 의 관계

- IC = 0.05 같은 "약한" 통계적 신호가 **상위 10% 선택** 으로 증폭 → 누적 수익률 큰 차이.
- 예: IC = 0.05 모델이 1년 운용 시 상위 10% 포트폴리오는 시장 대비 +5% ~ +15% 초과 수익 가능 (학계 보고 평균).
- MASTER 의 +47% 포트폴리오 metric 개선 (vs baseline) = IC 절대값의 작은 차이가 portfolio 에선 큰 증폭으로 나타남.

---

## 3. 손실 함수와 학습

### 3.1 손실 함수 — IC 기반 또는 MSE?

**원문 직접 확인 미달** — 추정:
- 후보 1: **MSE loss** $\mathcal{L} = \frac{1}{N}\sum_n (s_n - y_n)^2$
- 후보 2: **IC loss** $\mathcal{L} = 1 - \text{IC}(s, y) = 1 - \text{corr}(s, y)$
- 후보 3: **Rank IC loss** — Spearman 상관 기반

대부분의 stock prediction transformer 가 MSE 또는 IC loss 사용. MASTER 도 둘 중 하나 추정.

### 3.2 🔣 손실 함수 4-단 풀이 (가정: IC loss)

| 기호 | 의미 |
|------|------|
| $s = (s_1, \ldots, s_N)$ | 모델 예측 스코어 벡터 |
| $y = (y_1, \ldots, y_N)$ | 실제 5일 후 수익률 |
| $\text{IC}(s, y) = \frac{\text{Cov}(s, y)}{\sigma_s \sigma_y}$ | Pearson 상관 |
| $\mathcal{L} = -\text{IC}(s, y)$ | 손실 (IC 클수록 좋음 → 부호 반전) |

**왜 IC loss 가 좋을 수 있나**:
- MSE 는 절대값 차이 최소화 → 순위 보전 보장 X
- IC loss 는 상관 (순위 영향) 직접 최적화 → 포트폴리오 운용 목적에 부합

### 🔑 핵심 통찰

> **순위 기반 손실** 이 stock prediction 의 자연스러운 metric. MSE 는 "수익률 절대값" 맞추기에 집중하지만, 실무에선 "상위 vs 하위" 분류가 중요.

---

## 4. 학습 설정 (Training Setup)

### 4.1 데이터 분할

| 기간 | 용도 | 길이 |
|------|------|------|
| Q1 2008 ~ Q1 2020 | 학습 (Train) | 약 12년 (3,000 거래일) |
| Q2 2020 | 검증 (Validation) | 1분기 (약 60 거래일) |
| Q3 2020 ~ Q4 2022 | 테스트 (Test) | 약 2.5년 (600 거래일) |

### 4.2 테스트 기간 의의

테스트 기간 (2020 Q3 ~ 2022 Q4) 의 시장 국면 다양성:
- **2020 Q3-Q4**: COVID-19 후반부 회복기 (강한 모멘텀)
- **2021 전체**: 강세장 + 메가캡 주도
- **2022 H1**: 금리 상승 + 기술주 하락
- **2022 H2**: 변동성 ↑ + 약세장

→ **다양한 국면 포함** = 모델의 generalization 검증에 좋은 setup. 단일 국면 (예: 강세장만) 평가는 cherry-picking 위험.

### 4.3 입력 데이터 — 정밀

#### 종목 특징
- **사용 팩터**: **Alpha158** — Qlib 프레임워크의 158개 알파 인자
- **Alpha158 포함**:
  - MACD, RSI, Williams %R (모멘텀 지표)
  - Bollinger Bands, ATR (변동성 지표)
  - VWAP, OBV (거래량 지표)
  - 단기/장기 이동평균선 (5일, 10일, 20일, 60일)
  - 가격 변화율 (ROC, momentum)
- **정규화**: **RobustZScoreNorm** (학습 전체 종목 기준 중간값/MAD 추정, 이상값 ±3 클리핑)
- **레이블**: 5거래일 수익률, **CSZscoreNorm** (날짜별 단면 표준화) + 극단값 5% 제거

#### 시장 특징
- 63차원 $m_\tau$ (앞 챕터 [[05_method_b_gating]] 에서 설명)
- 사전 처리 없이 raw 또는 간단한 스케일링 적용 추정 (원문 미확인)

### 4.4 🔣 전처리 파이프라인 4-단 풀이

```
Step 1: Raw 가격·거래량 데이터 수집
        ↓ (Qlib API)
Step 2: Alpha158 팩터 계산
        ↓ (158개 기술 지표 → 각 종목 × 시점 × 158)
Step 3: RobustZScoreNorm 적용
        X_normalized = clip( (X - median(X)) / MAD(X), -3, 3 )
        ↓
Step 4: 모델 입력 ready
```

**RobustZScoreNorm vs StandardScaler (z-score)**:

| 항목 | Standard z-score | RobustZScore |
|------|-----------------|--------------|
| 중심 | 평균 (mean) | 중간값 (median) |
| 스케일 | 표준편차 (std) | MAD (median absolute deviation) |
| Outlier 영향 | 크게 영향 받음 | 영향 최소화 |
| 주식 데이터 적합도 | 극단 수익률 (예: +30% 하루) 에 휘둘림 | 안정적 |

→ 주식 데이터는 fat-tail 분포 (정규 분포 아님) → **RobustZScore 가 적절한 선택**.

### 4.5 조기 종료 (Early Stopping)

**학습 손실 임계값(training loss threshold) 기반 조기 종료** 사용.

**원문 GitHub README 노트**:
- 이전 공개 버전에서 **검증 세트 처리 오류** 발견 (Yujin 의 issue 보고).
- 그러나 조기 종료 기준이 "**검증 손실이 아닌 학습 손실 임계값**" 이므로 체크포인트와 실제 결과에는 **영향 없음**.

**의미**: 학습 손실이 특정 임계값 (예: 0.5) 아래로 떨어지면 학습 중단. 이는 일반적이지 않은 설계 (보통 validation loss 기반) 이지만, 시계열 데이터의 시간 분할 특성상 validation overfitting 위험 회피 의도 추정.

### 4.6 하이퍼파라미터

| 파라미터 | 값 | 출처 |
|---------|-----|------|
| $T$ (lookback 창) | **8** 거래일 | 본문 |
| $\beta$ (게이팅 온도) | Figure 4 ablation 으로 결정 | 본문 (정확값 미확인) |
| $(N_1, N_2)$ (intra/inter block 수) | Ablation 으로 결정 | 본문 (정확값 미확인) |
| 모델 hidden $d$ | 추정 64-256 | 원문 미확인 |
| 옵티마이저 | Adam 계열 추정 | 원문 미확인 |
| 학습률 | 추정 1e-3 ~ 1e-4 | 원문 미확인 |
| Batch size | 추정 64-256 | 원문 미확인 |

---

## 5. 전체 처리 흐름 요약 (치수 추적)

```
X ∈ ℝ^(N × T × F)     시장벡터 m_τ ∈ ℝ^D_m
  N=300, T=8, F=158        D_m=63
        │                      │
        └──────────────────────┘
               ↓ 게이팅 (Step 1)
               g = F · softmax(W_g m_τ / β)
               X̂ = X ⊙ g
       X̂ ∈ ℝ^(N × T × F)
               ↓ 선형 투영
       X̃ ∈ ℝ^(N × T × d)
               ↓ Intra-stock attention (Step 2, N번 독립)
        H ∈ ℝ^(N × T × d)
               ↓ Inter-stock attention (Step 3, T번 시점별)
        Z ∈ ℝ^(N × T × d)
               ↓ Temporal Aggregation (Step 4, N번 독립)
               e_n = Attn(Z_{n,T}, Z_{n,:}, Z_{n,:})
        e ∈ ℝ^(N × d)
               ↓ 선형 레이어 (Step 5)
               s_n = W_p e_n + b_p
        s ∈ ℝ^N   →   순위화 → 포트폴리오
```

### 🎯 구체 증거 — 파라미터 수 추정

- $W_g$: $158 \times 63 = 9,954$
- 선형 투영 ($F \to d$, $d=128$ 가정): $158 \times 128 = 20,224$
- Intra MultiHead ($d=128, h=8$): 약 $4 d^2 = 65,536$ (per layer × N_1 layers)
- Inter MultiHead: 마찬가지 $\approx 65,536$ × N_2
- Temporal Aggregation: $\approx 4d^2 = 65,536$
- Final linear: $d \times 1 = 128$

**총합 추정**: 0.5M ~ 2M 파라미터 (N_1, N_2 에 따라 변동). 비교: GPT-2 small = 124M → MASTER 는 그보다 60배 작음. 주식 예측의 데이터 부족 (12년 × 300 종목 ≈ 1M 샘플) 환경에 적합한 사이즈.

---

## 6. 핵심 한 문장

> 시간 집계 단계는 "최신 시각이 과거를 취사선택해 요약" 하는 어텐션으로 구현되어, 예측 직전 시각의 맥락에서 가장 유용한 과거 신호를 선별하는 방식으로 마무리되는 설계다. RobustZScoreNorm + 학습 손실 임계값 조기 종료 + 다양한 국면 테스트 기간 (2020-2022) 이 전체 학습 setup 을 차분히 받쳐준다.

---

## 7. 자기점검

### 핵심 5가지

1. **Temporal aggregation 의 Query·Key·Value 와 출력 차원?**
2. **왜 마지막 시각 ($T$) 을 Query 로 선택했는가?**
3. **데이터 분할의 의의 — 테스트 기간 (2020-2022) 의 시장 국면 다양성?**
4. **RobustZScoreNorm vs Standard z-score 의 차이?**
5. **MSE vs IC loss 의 trade-off 와 stock prediction 의 자연스러운 손실?**

### 답변

1. **Query**: $Z_{n,T} \in \mathbb{R}^{d}$ — 마지막 시각 (예측 직전) 임베딩. 단일 벡터. **Key, Value**: $Z_{n,:} \in \mathbb{R}^{T \times d}$ — 모든 $T$ 시각 임베딩. **출력**: $e_n \in \mathbb{R}^{d}$ — 종합 종목 임베딩, 단일 벡터. 어텐션 행렬 모양 $1 \times T$. **정보 병목**: $T$ 개 → $1$ 개 압축.

2. **예측 시점** ($T+1, \ldots, T+5$) **이 마지막 시각 ($T$) 과 가장 가까움** → 마지막 시각의 상태가 예측과 가장 관련. **단순 평균** 대신 마지막 시각이 "과거 어느 시점이 지금과 닮았나" 질의 → 차등 가중. **단일 Query** 라 추가 집계 불필요 + 어텐션 가중치 해석 가능.

3. **2020 Q3-Q4**: COVID 회복 (모멘텀). **2021**: 강세장 + 메가캡. **2022 H1**: 금리 상승 + 기술주 하락. **2022 H2**: 약세장. **다양한 국면** 포함 → cherry-picking 회피 + generalization 검증. 단일 국면 (강세장만) 평가는 모델의 robust 성을 못 확인.

4. **Standard z-score**: 평균/std 기반 → fat-tail 분포 (주식) 에서 outlier 가 평균·std 를 왜곡 → 정규화 결과 부정확. **RobustZScore**: 중간값/MAD 기반 → outlier 영향 최소화 → 안정. 추가로 $\pm 3$ 클리핑 → 극단값 한계 설정. **주식 데이터에 적합**: 일일 수익률이 종종 $\pm 10\%$ 발생하는 fat-tail.

5. **MSE**: 예측값과 실제값의 절대 차이 최소화. **순위 보전 보장 X** — MSE 가 작아도 순위 어긋날 가능. **IC loss** ($1 - \text{IC}$ 또는 $-\text{IC}$): 상관 직접 최적화 → 순위 보전 강함. **Stock prediction 의 자연 손실**: 포트폴리오 운용은 "상위 vs 하위" 분류 → IC loss 가 자연스럽다. 단, IC 자체가 미분 불가능 (Spearman) 이라 실무에선 Pearson 기반 IC 또는 ListMLE 등 변형 사용.

---

→ 다음 챕터: [06_experiments.md](06_experiments.md) — 실험 결과와 ablation 의 정밀 해부.
