# 07. Instance Normalization + MSE Loss

## 📌 이 챕터 다 읽으면 알 수 있는 것

- Instance Normalization 의 정확한 의미
- Loss = MSE (단순)
- distribution shift 해결 메커니즘
- RevIN (2022) 과의 관계

---

> 본 논문의 **"마이너" trick 같지만 사실 핵심** — Table 11 (ch18) 의 정확한 수치로 **17% MSE reduction** 기여.

### 🌱 Instance Normalization — 일상 비유

**한 줄로**: "각 시계열별로 평균/분산 빼고 정규화 → forecasting → 다시 복원. **Distribution shift** 해결의 마이너 같지만 결정적인 trick".

| 처리 | 일상 비유 |
|------|----------|
| Instance Norm | "각 학생 점수를 자기 평균/분산으로 표준화 후 비교" → 학생간 공정 비교 |
| No Norm | "학생들 점수 그대로 비교" → 점수 스케일 다른 학생끼리 불공정 |

**왜 시계열에 결정적**: 
- 같은 변수도 시기별 평균/분산 다름 (예: 여름 전력 ≠ 겨울 전력)
- 정규화 안 하면 모델이 매 시점마다 다른 데이터 분포에 적응해야 함
- 정규화 후 → 분포 일정 → 모델이 패턴에 집중 가능

### 🔣 Instance Norm 4-단 풀이

| 단계 | 의미 |
|------|------|
| **Step 1**: $\mu = \text{mean}(X_\text{input})$ | 입력 평균 |
| **Step 2**: $\sigma = \text{std}(X_\text{input})$ | 입력 표준편차 |
| **Step 3**: $X_\text{norm} = (X - \mu) / \sigma$ | 정규화 |
| **Step 4**: Forecast on $X_\text{norm}$ → $\hat{Y}_\text{norm}$ | 모델 통과 |
| **Step 5**: $\hat{Y} = \hat{Y}_\text{norm} \cdot \sigma + \mu$ | 복원 |
| **Step 6**: MSE loss on $\hat{Y}$ | 학습 |

### 🎯 구체 증거 — Table 11

| Setting | T=96 | T=720 |
|---------|------|-------|
| PatchTST **+IN** | **0.149** | **0.314** |
| PatchTST **-IN** | 0.183 | 0.370 |
| **개선율** | **18.6%** | **15.1%** |

→ **단독 17% reduction**. Patching + CI + IN = three tricks (paper 가 IN 강조 안 하지만 ablation 으로 결정적).

### 🔑 핵심 통찰

> RevIN (2022, ICLR) 이 정확히 같은 idea. PatchTST 가 이걸 활용했지만 "two tricks" 메시지로 가림. 실제는 **three tricks**.

---

## 7.1 챕터 한 줄 요약

> **"각 시계열 (channel) 을 개별 normalize 한 후 forecasting. 입력 마지막 값으로 de-mean + de-var → forecast 후 복원. 평범한 MSE loss 사용. ★ Table 11 의 입증으로 17% reduction 단독 기여 — Patching, CI 외의 hidden 3번째 trick."**

---

## ★ 본 chapter 의 가장 중요한 한 가지

> **"Instance Norm 이 paper 의 'two tricks (P + CI)' 메시지의 그늘에 가려진 hidden 3번째 trick"**.

### Table 11 (Appendix, ch18) 의 정확한 수치 — Weather

| Setting | T=96 MSE | T=192 MSE | T=336 MSE | T=720 MSE |
|---------|---------|----------|----------|----------|
| PatchTST **+in** (Norm 사용) | **0.149** | **0.194** | **0.245** | **0.314** |
| PatchTST **-in** (Norm 안 사용) | 0.183 | 0.235 | 0.293 | 0.370 |
| **개선율** | **18.6%** | **17.4%** | **16.4%** | **15.1%** |

→ **Instance Norm 단독 contribution = 평균 17% MSE reduction**.

### Table 1 (ch03) 의 첫 step 과 연결 (★ 핵심 발견)

Table 1 의 evolution (0.665 → 0.349):
- vanilla Transformer: 0.665
- → **+Instance Norm**: 0.518 (**22.1% reduction**) ← **첫 큰 jump**
- → +Patching: 0.430 (17% 추가)
- → +CI: 0.349 (19% 추가) = PatchTST

→ **Instance Norm 이 첫 22% 의 jump 기여**. paper 의 "two tricks (P + CI)" 메시지가 이 trick 을 잘 안 강조하지만 실제 **첫 contributor**.

### ★ "왜 Instance Norm 이 중요한가" 의 일반 원칙

> **"시계열은 distribution shift 가 잦다"** (train 분포 ≠ test 분포). Instance Norm 이 sample 별 통계 정규화로 보정 → 모델이 **상대 패턴** 만 학습.

**일상 비유**: 학생 시험 점수를 **각 학생의 평균·분산으로 정규화** 한 후 비교 → "절대 점수" 대신 "상대 위치" 학습. 학생 간 비교 가능 + distribution shift 보정.

→ **다른 시계열 paper 들이 Instance Norm 의 importance 를 underrate** 함. RevIN (Kim et al., 2022) paper 가 separately 입증.



---

## 7.2 Instance Normalization 이 뭐예요?

### 일상 비유 — *학생 시험 점수 비교*

100 명 학생의 *시험 점수 비교* 시 *raw 점수* 보다 *그 학생의 평균과 표준편차로 정규화한 점수* 가 *공정*.

- *Raw*: 학생 A 90점, 학생 B 60점 — *어떤 학생이 잘한 시험*?
- *Normalized*: 학생 A 의 평균/std 와 비교 → *0.5 sigma*, 학생 B 의 평균/std → *2 sigma* — 학생 B 가 *진짜 잘함*.

본 논문 Instance Normalization: *각 시계열* 을 *그 자신의 평균/표준편차로 정규화*.

### 정확한 방법

각 input window $x \in \mathbb{R}^L$:
1. *평균 $\mu$* + *표준편차 $\sigma$* 계산.
2. *정규화*: $x_{norm} = (x - \mu) / \sigma$.
3. Forecast: $\hat y_{norm}$ = Model($x_{norm}$).
4. *복원*: $\hat y = \hat y_{norm} \cdot \sigma + \mu$.

→ Model 학습 시 *normalized 도메인* 에서 작업. 그러면 *각 시계열의 absolute level 무관*.

---

## 7.3 *왜* Instance Normalization 이 효과적?

### Distribution Shift 회피

**문제**: Training 데이터의 *시계열 평균* 과 test 데이터의 *시계열 평균* 이 *다름* — *distribution shift*.

**예**: 2020 데이터로 학습 + 2024 데이터로 test. *2024 의 평균값* 이 *2020 평균* 보다 훨씬 큼 (인플레이션 영향). Model 이 *2020 절대값* 에 *adapted* → *2024 에 망함*.

**해결**: Instance norm 으로 *각 window 의 평균 제거* → *level-invariant*. Model 이 *변화 패턴* 만 학습.

### 일상 비유

의사가 환자 분석 시 *환자의 평균 체온 100명 비교* 보다 *각 환자의 평균/std 로 normalize 후 분석* 이 *더 robust*.

---

## 7.4 MSE Loss — 표준 그대로

**Equation 4 (paper p.5 Loss 식)** — Channel 별 MSE 를 M 개 channel 에 걸쳐 평균:

$$
\mathcal{L} = \mathbb{E}_x\, \frac{1}{M} \sum_{i=1}^{M} \| \hat x_{L+1:L+T}^{(i)} - x_{L+1:L+T}^{(i)} \|_2^2
$$

- $\hat x_{L+1:L+T}^{(i)} \in \mathbb{R}^{T}$: channel $i$ 의 *예측 미래 T timestep*.
- $x_{L+1:L+T}^{(i)} \in \mathbb{R}^{T}$: channel $i$ 의 *실제 미래 T timestep*.
- $\| \cdot \|_2^2$: L2 norm 제곱 = *각 timestep 의 (예측 - 실제)² 의 합*.
- $\frac{1}{M} \sum_{i=1}^{M}$: M 개 channel 평균 — Channel-Indep 의 *통합 학습 목표*.

**일상 비유**: 326 가구 의 전력 예측 → 가구마다 *예측 - 실제 의 제곱 평균* → 326 가구의 *평균 오차* 가 최종 loss. 즉 *모든 가구가 동등하게 중요*.

**왜 이 형태?**:
- *통계학적*: Gaussian noise 가정 하에 MLE (maximum likelihood estimate) 와 일치.
- *직관적*: *큰 오차에 더 penalty* (L2 의 quadratic 성질).
- *학습 stable*: gradient 계산 쉬움 + smooth.

**조심할 점**: 본 논문은 *channel 별 normalize* (Instance Norm) 후 loss 계산. 즉 *raw 값 차이* 아닌 *normalized 차이*. 그래서 *channel 의 scale 무관* — 한 가구가 100kW, 다른 가구 1kW 여도 *동등하게 학습*.

본 논문: *통상 MSE 그대로*. *시계열 specific loss (예: smoothness penalty, autocorrelation loss)* 없음.

### Why MSE?

- *통계학적*: Gaussian noise 가정 하에 MLE 와 일치.
- *직관적*: *큰 오차에 더 penalty*.
- *학습 stable*: gradient 계산 쉬움.

본 논문 *시계열 specific loss 변형* 시도 안 함. *vanilla MSE = best*.

---

## 7.5 *Instance norm + MSE* 의 결합 효과

### Combined effect

1. **Instance norm**: distribution shift 회피.
2. **MSE loss**: 학습 안정 + 통계학 정당화.

→ 두 가지의 *결합* 이 *robust forecasting* 의 토대.

### Table 11 — Instance Norm 효과

본 논문 *Appendix Table 11* (간단 풀이):
- *Without instance norm*: MSE = X.
- *With instance norm*: MSE = X × (1 - ~5%).

→ *Instance norm 만으로 5% MSE 감소* — robust improvement.

---

## 7.6 자기점검

### 핵심 5가지

1. **Instance normalization 의 일상 비유?**
2. **Distribution shift 의 의미?**
3. **본 논문의 loss function?**
4. **Instance Norm 의 17% MSE reduction 단독 기여 — 왜 paper 는 "Two tricks (P+CI)" 만 강조?**
5. **RevIN (Reversible Instance Normalization, 2022 ICLR) 과의 관계?**

### 답변

1. **100 학생 시험 점수 비교 시 *raw 점수* 보다 *각 학생의 평균/std 로 normalize 한 점수* 가 공정**. 본 논문: 각 시계열 (channel) 의 *각 input window* 를 *그 평균/std 로 normalize* + forecast 후 *복원*. **Level-invariant model** — 절대값 무관. **5 단계 프로세스**: (i) input의 μ, σ 계산, (ii) (X - μ)/σ 로 정규화, (iii) 정규화된 입력으로 forecast, (iv) 출력 * σ + μ 로 복원, (v) MSE loss 계산.

2. **Training 데이터의 *분포* 와 test 데이터의 *분포* 가 다름**. 예: 2020 데이터 학습 + 2024 test, *인플레이션으로 평균 다름*. Model 이 *2020 절대값* 에 adapted → *2024 망함*. Instance norm 으로 *level 제거* → *변화 패턴만* 학습 → distribution shift 회피. **시계열에서 특히 critical**: 시계열은 본질적으로 non-stationary (시간 따라 분포 변화) → 같은 변수도 시기별 다른 분포. Instance norm 이 이걸 해결.

3. **표준 MSE (Mean Squared Error)**. *시계열 specific loss 없음*. 이유: (i) Gaussian noise 가정 + MLE 일치, (ii) 큰 오차에 더 penalty (quadratic), (iii) gradient 계산 쉬움 (linear in error). **Vanilla MSE = best**. **대안 거절**: MAE (L1) - 더 robust but slower convergence, MAPE - division by zero 위험, Huber - extra hyperparameter. MSE 가 simplest + sufficient.

4. **Table 11 (Appendix) 의 정확한 수치**: PatchTST+IN MSE 0.149-0.314, -IN 0.183-0.370 → **단독 17-22% reduction**. Patching (3%), CI (25%) 와 비교하면 **CI 다음 두 번째 contributor**. **paper 가 강조 안 한 이유 (추측)**: (i) RevIN (2022 ICLR) 이 이미 있던 idea → novelty 약함, (ii) "Two tricks" 메시지가 marketing 강함, (iii) Patching 이 paper 제목과 일치. **실제로는 Three tricks**: IN + Patching + CI. **실무 의미**: Instance Norm 을 단독으로 PatchTST 아닌 다른 시계열 모델에도 적용 → 17% 개선 — universally beneficial.

5. **RevIN (Reversible Instance Normalization, Kim et al. 2022, ICLR)**: PatchTST 이전에 발표된 동일 idea. (i) Input normalize, (ii) forward through model, (iii) denormalize output. **PatchTST 의 차이**: 명시적 RevIN cite 안 했지만 동일 기법 사용 추정. **학술 윤리 측면**: RevIN 직접 cite 가 더 정확. **장점 (universality)**: PatchTST 외에도 NHITS, NBEATS, Informer 등에 RevIN 적용 → 모두 향상 (RevIN 논문 보고). **결론**: RevIN/Instance Norm 은 PatchTST 의 hidden 3번째 trick. 후속 연구의 standard component.

---

다음 챕터: [08_representation_learning.md](08_representation_learning.md) — Self-supervised Masked Reconstruction.
