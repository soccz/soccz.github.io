# 07. Instance Normalization + MSE Loss

> 본 논문의 *마이너 trick* — input/output 의 *각 시계열을 개별 정규화* + MSE loss.

---

## 7.1 챕터 한 줄 요약

> **"각 시계열 (channel) 을 *개별 normalize* 한 후 forecasting. 입력 마지막 값으로 *de-mean + de-var* → forecast 후 *복원*. 이게 *distribution shift* 의 효과. 평범한 MSE loss 사용."**

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

**Mean Squared Error**: $\text{Loss} = \frac{1}{T} \sum_t (\hat y_t - y_t)^2$.

**일상 비유**: 예측 - 실제 의 *제곱 평균*. *L2 거리*.

본 논문: *통상 MSE 그대로*. *시계열 specific loss (예: smoothness penalty)* 없음.

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

### 핵심 3가지
1. **Instance normalization 의 일상 비유?**
2. **Distribution shift 의 의미?**
3. **본 논문의 loss function?**

### 답변
1. **100 학생 시험 점수 비교 시 *raw 점수* 보다 *각 학생의 평균/std 로 normalize 한 점수* 가 공정**. 본 논문: 각 시계열 (channel) 의 *각 input window* 를 *그 평균/std 로 normalize* + forecast 후 *복원*. *Level-invariant* model — 절대값 무관.
2. **Training 데이터의 *분포* 와 test 데이터의 *분포* 가 다름**. 예: 2020 데이터 학습 + 2024 test, *인플레이션으로 평균 다름*. Model 이 *2020 절대값* 에 adapted → *2024 망함*. Instance norm 으로 *level 제거* → *변화 패턴만* 학습 → distribution shift 회피.
3. **표준 MSE (Mean Squared Error)**. *시계열 specific loss 없음*. 이유: (i) Gaussian noise 가정 + MLE 일치, (ii) 큰 오차에 더 penalty, (iii) gradient 계산 쉬움. **Vanilla MSE = best**.

---

다음 챕터: [08_representation_learning.md](08_representation_learning.md) — Self-supervised Masked Reconstruction.
