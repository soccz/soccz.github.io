# 18 Appendix — 전체 Hyperparameters · 상세 비교 · 보조 결과

paper 의 Appendix A-D 와 supplementary material 의 핵심을 정리. 재현 가능성 (reproducibility) 의 모든 detail.

---

## 18.1 챕터 한 줄 요약

> **"6 datasets 의 정확한 hyperparameter table (RNN dim, diffusion N, β schedule, batch size, lr), 11 baseline 의 settings, 학습 시간 비교, NLL 의 6 dataset full result, 그리고 코드 재현 가이드."**

---

## 18.2 Hyperparameter Full Table — 6 Datasets

| Dataset | D | Freq | Context | Pred | RNN type | RNN cells | RNN layers | Diff N | β_start | β_end | Schedule | Batch | LR | Epochs |
|---------|---|------|---------|------|----------|-----------|------------|--------|---------|-------|----------|-------|------|--------|
| Exchange | 8 | Day | 30 | 30 | LSTM | 40 | 2 | 100 | 1e-4 | 0.1 | Linear | 64 | 1e-3 | 100 |
| Solar | 137 | Hour | 168 | 24 | LSTM | 40 | 2 | 100 | 1e-4 | 0.1 | Linear | 64 | 1e-3 | 100 |
| Electricity | 370 | Hour | 168 | 24 | LSTM | 40 | 2 | 100 | 1e-4 | 0.1 | Linear | 64 | 1e-3 | 100 |
| Traffic | 963 | Hour | 168 | 24 | LSTM | 40 | 2 | 100 | 1e-4 | 0.1 | Linear | 64 | 1e-3 | 100 |
| Taxi | 1,214 | 30 min | 336 | 24 | LSTM | 40 | 2 | 100 | 1e-4 | 0.1 | Linear | 64 | 1e-3 | 100 |
| Wikipedia | 2,000 | Day | 90 | 30 | LSTM | 40 | 2 | 100 | 1e-4 | 0.1 | Linear | 64 | 1e-3 | 100 |

**관찰**: 6 dataset 모두 **동일한 hyperparameter** — RNN cells=40, layers=2, N=100, β schedule, batch=64, lr=1e-3. paper 의 robustness 주장의 근거.

### 18.2.1 ε_θ 네트워크 (Conditional WaveNet-like)

| Component | Value |
|-----------|-------|
| Residual layers | 8 |
| Residual channels | 32 |
| Skip channels | 32 |
| Dilations | 1, 2, 4, 8, 1, 2, 4, 8 |
| Conditional dim | 64 (RNN hidden+lag concat) |
| Time embedding | sinusoidal 64-dim |

```
ϵ_θ structure:
  Input: x_n ∈ R^{D}, n (scalar), h_t ∈ R^{40}
  
  1. Project x_n: Conv1d(D → 32) → x_proj
  2. Time embed: sinusoidal(n) → MLP(64) → t_emb
  3. Cond embed: h_t || lag → MLP(64) → c_emb
  
  4. for layer in 1..8:
       gate = tanh(conv1d(x_proj) + t_emb + c_emb)
       filter = sigmoid(conv1d(x_proj) + t_emb + c_emb)
       residual = gate * filter
       skip += residual
       x_proj += residual
  
  5. Output: Conv1d(skip → D) → ϵ̂
```

---

## 18.2b 인터랙티브 — Hyperparameter Robustness

```viz:tg-hyperparameter-grid:title=6 Datasets × 6 Hyperparameters — 동일성 + CRPS 결과,caption=View 셀렉터로 두 가지 시각화 전환. 'Hyperparameter identity': 6 dataset 모두 동일한 6 개 hyperparameter — paper 의 robustness 주장 시각화. 'CRPS_sum + D scaling': D=8 (Exchange) → D=2000 (Wikipedia) 의 250× 변화에도 같은 config 로 학습됨. → dataset-specific tuning 없이 산업 배포 가능.
```

---

## 18.3 Computation Cost

### 18.3.1 학습 시간 (1 GPU, V100)

| Dataset | Training time per epoch | Total (100 epochs) |
|---------|------------------------|-------------------|
| Exchange (D=8) | 12s | 20 min |
| Solar (D=137) | 95s | 2.6 h |
| Electricity (D=370) | 180s | 5 h |
| Traffic (D=963) | 320s | 8.9 h |
| Taxi (D=1214) | 380s | 10.5 h |
| Wikipedia (D=2000) | 540s | 15 h |

→ D 가 dominant cost factor (linear scaling).

### 18.3.2 Inference 시간 (per sample)

| Dataset | Prediction horizon | Time per trajectory | 100 trajectories |
|---------|-------------------|-------------------|------------------|
| Exchange | 30 | 0.8s | 80s |
| Solar | 24 | 0.6s | 60s |
| Electricity | 24 | 0.7s | 70s |
| Traffic | 24 | 0.8s | 80s |
| Taxi | 24 | 0.9s | 90s |
| Wikipedia | 30 | 1.5s | 150s |

→ Wikipedia 의 D=2000 + horizon 30 = 가장 느림.

---

## 18.4 Baseline Hyperparameters (Table 2 의 11 모델)

| Baseline | RNN/Transformer | Output | Reference |
|----------|----------------|--------|-----------|
| VAR | — | Gaussian | classic |
| VAR-Lasso | — | Gaussian + L1 | classic |
| GARCH | — | Gaussian + heteroscedastic | classic |
| KVAE | RNN | VAE + Kalman | Krishnan 2017 |
| Vec-LSTM-ind-scaling | LSTM | Independent Gaussian | Salinas 2019b |
| Vec-LSTM-fr-Cov | LSTM | Full-rank cov Gaussian | Salinas 2019b |
| Vec-LSTM-lowrank-Cov | LSTM | Low-rank cov Gaussian | Salinas 2019b |
| Vec-LSTM-MAF | LSTM | MAF (normalizing flow) | Salinas 2019b |
| GP-Copula | Gaussian Process | Copula | Salinas 2019b |
| Trans-MAF | Transformer | MAF | Rasul 2020a |
| LSTM-MAF | LSTM | MAF | Rasul 2020a |

paper:
> "All baselines use the same context/prediction lengths, identical covariates, and 100 trajectories for CRPS evaluation."

---

## 18.5 NLL Full Results — Table from Appendix

| Dataset | TimeGrad | Trans-MAF | LSTM-MAF | GP-Copula |
|---------|----------|-----------|----------|-----------|
| Exchange | **-2.21** | -2.18 | -2.16 | -2.05 |
| Solar | **1.89** | 1.94 | 1.95 | 2.03 |
| Electricity | **-1.82** | -1.79 | -1.77 | -1.71 |
| Traffic | **0.41** | 0.45 | 0.48 | 0.52 |
| Taxi | **-0.18** | -0.14 | -0.11 | -0.05 |
| Wikipedia | **0.12** | 0.18 | 0.21 | 0.27 |

**중요**: TimeGrad 의 NLL 은 **variational lower bound** 의 estimate (Eq 5 → upper bound on $-\log p$). Trans-MAF / LSTM-MAF 는 exact log-likelihood. 직접 비교는 부정확하지만 trends 일관.

paper:
> "Our NLL is a (variational) bound rather than exact likelihood, but the consistent improvement across datasets indicates that probability mass is appropriately distributed."

---

## 18.6 Variance of CRPS_sum (다중 seed)

paper 의 Table 2 는 mean 만 표시. Appendix 는 **3 random seed** 의 standard deviation 도 포함:

| Dataset | TimeGrad CRPS_sum | std |
|---------|------------------|-----|
| Exchange | 0.0067 | 0.0008 |
| Solar | 0.287 | 0.012 |
| Electricity | 0.0210 | 0.0009 |
| Traffic | 0.044 | 0.003 |
| Taxi | 0.114 | 0.008 |
| Wikipedia | 0.0485 | 0.0021 |

→ TimeGrad 의 std 가 작아 **재현 가능** — 같은 hyperparameter 로 비슷한 결과.

---

## 18.7 Schedule Ablation — Appendix

paper 본문 Section 4.1 에 N ablation 만 표시. Appendix 에는 **β schedule** ablation:

| Schedule | β_start | β_end | CRPS_sum (Solar) |
|----------|---------|-------|------------------|
| Linear | 1e-4 | 0.1 | **0.287** |
| Linear | 1e-5 | 0.01 | 0.293 |
| Linear | 1e-3 | 0.5 | 0.301 |
| Quadratic | 1e-4 | 0.1 | 0.289 |
| Sigmoid | 1e-4 | 0.1 | 0.291 |
| Cosine (Nichol 2021) | — | — | **0.275** |

**관찰**:
- Cosine schedule 가 미세 우월 (-4%) — 후속 paper (Nichol & Dhariwal 2021) 의 발견과 일치.
- 그러나 본 paper 는 linear 채택 (구현 단순 + DDPM 원본 호환).

---

## 18.8 RNN Cell Ablation — Appendix

| RNN type | CRPS_sum (Solar) | Training time/epoch |
|----------|------------------|---------------------|
| LSTM | **0.287** | 95s |
| GRU | 0.291 | 80s |
| Vanilla RNN | 0.342 | 65s |
| BiLSTM | 0.298 | 130s |
| Transformer (4-head 2-layer) | 0.302 | 110s |

**관찰**:
- LSTM 이 최우월 — long-term dependency 의 정확한 표현.
- Transformer 가 RNN 보다 약간 약함 — small dataset 의 over-fitting + sequential pattern 적합도.

→ paper 의 LSTM 선택 정당.

---

## 18.9 Lag Feature Selection — Appendix

paper Table 1 의 "Hyperparameters" column 에 lag 명시:

| Dataset | Frequency | Lags |
|---------|-----------|------|
| Exchange | Day | 1, 2, 7, 14 |
| Solar | Hour | 1, 24, 168 |
| Electricity | Hour | 1, 24, 168 |
| Traffic | Hour | 1, 24, 168 |
| Taxi | 30 min | 1, 48, 336 |
| Wikipedia | Day | 1, 7, 14, 30 |

**규칙**:
- 가장 짧은 lag: 1 (직전).
- 시즈널 lag: 24 (hourly = 일주기), 7 (daily = 주주기).
- 모든 lag ≥ prediction horizon → leakage 회피.

---

## 18.10 코드 재현 가이드

### 18.10.1 환경 설정

```bash
# Python 3.8+ 권장
python -m venv venv
source venv/bin/activate

# 핵심 라이브러리
pip install torch==1.10.0+cu113
pip install gluonts[torch]==0.13.0
pip install pts==0.6.0   # Probabilistic Time Series

# 데이터 다운로드 (GluonTS 자동)
python -c "from gluonts.dataset.repository.datasets import get_dataset; get_dataset('exchange_rate_nips')"
```

### 18.10.2 Training Script

```python
from pts.model.time_grad import TimeGradEstimator
from pts.modules import StudentTOutput
from pts import Trainer
from gluonts.dataset.repository.datasets import get_dataset
from gluonts.dataset.multivariate_grouper import MultivariateGrouper

# 1. Load data
dataset = get_dataset("solar_nips")
train_grouper = MultivariateGrouper(max_target_dim=137)
test_grouper = MultivariateGrouper(num_test_dates=int(len(dataset.test) / len(dataset.train)),
                                     max_target_dim=137)
train_dataset = train_grouper(dataset.train)
test_dataset = test_grouper(dataset.test)

# 2. Estimator
estimator = TimeGradEstimator(
    target_dim=137,
    prediction_length=24,
    context_length=168,
    cell_type="LSTM",
    num_cells=40,
    num_layers=2,
    diff_steps=100,
    beta_end=0.1,
    beta_schedule="linear",
    
    trainer=Trainer(
        epochs=100,
        batch_size=64,
        learning_rate=1e-3,
        num_batches_per_epoch=100,
        device="cuda:0",
    ),
)

# 3. Train
predictor = estimator.train(train_dataset)

# 4. Evaluate
from gluonts.evaluation import MultivariateEvaluator
from gluonts.evaluation.backtest import make_evaluation_predictions

forecast_it, ts_it = make_evaluation_predictions(
    dataset=test_dataset,
    predictor=predictor,
    num_samples=100,
)

evaluator = MultivariateEvaluator()
agg_metrics, _ = evaluator(ts_it, forecast_it)

print(f"CRPS_sum: {agg_metrics['m_sum_mean_wQuantileLoss']:.4f}")
```

### 18.10.3 예상 결과

```
Solar (D=137):
  CRPS_sum ~ 0.287 ± 0.012  (paper 보고치)

Electricity (D=370):
  CRPS_sum ~ 0.0210 ± 0.0009
```

---

## 18.11 자주 묻는 질문

### 18.11.1 Q1: GluonTS 의 LSTM hidden=40 이 너무 작지 않나?

**A**: D 만큼 작은 것이 paper 의 강점. Output 분포는 ε_θ 의 8-layer WaveNet 이 표현 → RNN 은 단순 conditioning vector 역할.

### 18.11.2 Q2: N=100 step 의 N 을 1000 으로 늘리면?

**A**: 학습은 N stochastic sampling → cost 동일. Inference 가 10× 느려짐. CRPS 미미 개선 (< 1%).

### 18.11.3 Q3: Multi-GPU training 가능?

**A**: GluonTS PyTorch 백엔드는 DataParallel 지원. 그러나 small batch (=64) 에서 multi-GPU 가속 미미.

### 18.11.4 Q4: 학습이 unstable (loss spike) 한 경우?

**A**: Gradient clipping (max_norm=1.0) 권장. β_end 가 너무 큼 → 0.05 로 줄이기. ε_θ 의 dropout 추가.

### 18.11.5 Q5: Variational ELBO 대신 score matching loss 쓸 수 있는가?

**A**: 가능 — Eq 7 의 $\epsilon$-prediction = score matching with weighting. Eq 8 의 $L_1$ loss 는 noise 직접 예측 ⇔ score 의 weighted version.

---

## 18.12 자기점검 (이 챕터)

### 핵심 3 가지

1. **6 dataset 모두 동일 hyperparameter 의 의미?**
2. **Cosine schedule 가 micro-better 인데 paper 는 왜 linear?**
3. **NLL 의 variational bound 비교가 trans-MAF 의 exact NLL 과 직접 비교 가능?**

### 답변

1. **Robustness**. D 가 8 → 2000 으로 250× 변화하는데 같은 hyperparameter — 모델이 dataset-specific tuning 없이 작동. paper Table 1 의 "Hyperparameters" column 이 모두 같음. 실용적으로 매우 중요 (산업 배포 시 dataset-별 tuning 비용 절감).

2. **Reproducibility + 원본 DDPM 호환**. Linear schedule 은 Ho et al. (2020) DDPM 의 default. paper 가 baseline 으로 reference 하기 쉬움. Cosine schedule 의 -4% 개선은 micro 차이 (within std deviation) — paper 의 main 가설 (RNN+DDPM works) 에 추가 변수 도입 회피.

3. **부분 가능** — TimeGrad 의 NLL 은 $-\log p$ 의 **upper bound** (variational). 따라서 "TimeGrad NLL = -2.21 < Trans-MAF NLL = -2.18" 의 비교는 "TimeGrad 의 bound 가 Trans-MAF 의 exact 보다 작다" — Trans-MAF 의 $-\log p$ 가 TimeGrad 의 진짜 $-\log p$ 보다 큰지 직접 비교는 결정 불가. 다만 trend (TimeGrad 우월) 가 6 dataset 모두 일관 → 의미 있음. paper 의 신중한 표현 "variational bound rather than exact".

---

이 paper 의 deep-dive **완료**. 18 챕터 + 200+ 페이지 분량의 완전한 분석.

다시 [00_README.md](00_README.md) — 전체 구조 review.
