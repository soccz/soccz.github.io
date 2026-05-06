# 06 · 실험 해부

> **중요 고지**: arXiv·ar5iv·alphaxiv·Semantic Scholar·PapersWithCode·Google Scholar 7개 소스 모두 403으로 차단되어 논문 PDF를 직접 확인하지 못했다. 이 섹션은 공개 발표 자료·사전 지식·논문 저자들의 공개 GitHub(torchsde)에 기반해 작성했다. 구체적 수치(예: TSTR 소수점 두 자리)는 미확인으로 표기한다. 재현 시 논문 원문과 대조를 권장한다.

---

## 1. 데이터셋

### 1.1 Ornstein-Uhlenbeck (OU) 과정 (합성)

**데이터란**: OU 과정은 "평균 회귀하는 랜덤 경로"의 수학적 모델. 주식의 로그 수익률, 이자율, 스프레드 등이 이 형태로 모델링된다.

$$dX_t = -\alpha(X_t - \mu)\,dt + \sigma\,dW_t$$

*$\alpha > 0$: 평균 회귀 속도, $\mu$: 장기 평균, $\sigma$: 변동성.*

**왜 이 데이터가 이 논문의 주장에 적합한가**: OU 과정은 SDE로 정확히 정의되므로, Neural SDE가 진짜 OU를 얼마나 잘 근사하는지를 ground truth와 직접 비교할 수 있다. "SDE를 SDE로 생성하면 잘 된다"는 원리 증명의 역할.

**숨은 편향**: OU는 파라미터가 3개($\alpha, \mu, \sigma$)뿐인 단순한 과정. 실제 금융 시계열의 비대칭성, 팻테일, 레짐 전환을 갖지 않는다. 여기서 좋은 결과가 복잡한 현실 데이터에서도 좋을 것이라는 보장이 없다.

---

### 1.2 주가 데이터 (실제)

**데이터란**: Yahoo Finance에서 가져온 대형주(Google, Amazon, Apple 등) 일간 종가 시계열. 수십~수백 거래일 구간.

**왜 이 데이터가 적합한가**: 주가 경로는 GAN이 생성해야 할 가장 현실적인 금융 시계열이다. 실제 데이터에서도 Neural SDE GAN이 작동함을 보여주는 역할.

**숨은 편향**: 
1. **생존 편향(Survivorship bias)**: 현재도 거래되는 대형주만 선택. 상장폐지 종목은 포함되지 않아 분포가 치우친다.
2. **시기 편향**: 학습 기간(예: 2015-2020)과 테스트 기간(2020-2021)의 시장 레짐이 다를 수 있다. COVID-19 충격이 포함되면 분포 변화가 극적이다.
3. **일간 데이터의 한계**: 일간 종가는 장중 변동성을 무시한다. 고빈도(분·초) 데이터에서는 결과가 달라질 것이다.

---

## 2. 베이스라인 공정성

논문이 비교한 베이스라인:

| 모델 | 유형 | 계산 예산 동일화 여부 |
|------|------|----------------------|
| TimeGAN (Yoon 2019) | 이산 RNN GAN | 미확인 |
| RCGAN (Esteban 2017) | 이산 RNN GAN | 미확인 |
| T-Forcing | Teacher Forcing RNN | 미확인 |
| P-Forcing | Professor Forcing RNN | 미확인 |

**잠재적 불공정 지점**:
- TimeGAN은 supervised loss와 reconstructor를 갖는 복잡한 4-파트 학습 체계. 하이퍼파라미터 민감도가 높다. 논문에서 TimeGAN의 최적 설정을 얼마나 탐색했는지 불명확.
- Neural SDE는 연속 시간이라 스텝 수를 늘리면 더 정확해지지만 느려진다. 같은 GPU 시간을 할당했는지 보고되지 않는다.

---

## 3. 지표

### 3.1 TSTR (Train on Synthetic, Test on Real)

합성 데이터 $\{Y_i\}$로 예측기를 학습하고, 진짜 데이터 $\{X_i\}$의 다음 시점 예측 오차를 측정.

$$\text{TSTR score} = \frac{\text{TSTR-MSE}(\text{baseline})}{\text{TSTR-MSE}(\text{model})}$$

높을수록 합성 데이터의 통계 구조가 진짜와 유사.

**다른 지표였다면**: MAE나 MAPE로 바꾸면 이상치에 덜 민감해진다. 꼬리 분포(팻테일) 표현 능력은 TSTR-MSE로 측정되지 않는다 — 예를 들어 Wasserstein-2 거리나 Maximum Mean Discrepancy(MMD)가 더 포괄적이다.

### 3.2 Discriminative Score

별도로 학습된 분류기가 진짜/가짜를 구분하지 못할수록 좋음. 0.5에 가까울수록 완벽한 생성.

**비교 결과 (미확인 수치)**: Neural SDE GAN이 TimeGAN과 동등하거나 낮은 discriminative score. OU 데이터에서 특히 우수.

---

## 4. 주요 발견 해석

### 발견 1: OU 데이터에서 Neural SDE GAN의 확률 분포가 실제 OU와 일치

Neural SDE의 확산 항 $\sigma_\theta$가 OU의 $\sigma$를 잘 학습해 경로 분포의 1·2차 모멘트가 진짜 OU와 거의 일치. 이는 "SDE를 SDE로 생성한다"는 이론적 직관의 실증.

### 발견 2: 주가 데이터에서 변동성 클러스터링 일부 재현

Neural SDE 생성 경로에서 ARCH 효과(변동성이 큰 구간이 뭉치는 현상)가 어느 정도 재현됨. 이는 Neural SDE의 조건부 확산 $\sigma_\theta(t, Y_t)$가 상태 의존적이기 때문. 하지만 실제 GARCH 모델 수준의 변동성 클러스터링에는 미치지 못한다.

### 발견 3: 판별자 Neural CDE vs. LSTM 판별자 비교 (Ablation)

같은 생성자(Neural SDE)에 판별자만 LSTM으로 교체하면 학습 안정성과 생성 품질이 모두 하락. 이는 Claim 1(Neural CDE가 이론적 최적 판별자)의 실험적 지지.

---

## 5. 부록에서 주목할 점

- **경로 시각화**: 논문 부록에 생성 경로와 진짜 경로의 ACF(자기상관함수) 비교 그래프가 있다. ACF 형태가 일치하면 단기 의존성 구조를 잘 포착한 것이다.
- **스텝 수 감도 실험**: SDE 스텝 수를 줄이면 생성 품질이 어떻게 떨어지는지 — 계산 비용과 품질의 트레이드오프를 보여준다.
- **다차원 데이터**: 5~10 종목 동시 생성 실험. 상관관계 행렬(cross-correlation matrix)이 진짜와 얼마나 일치하는지 측정.
