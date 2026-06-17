# 10-c. 사고 확장 — 실험 아이디어 2개 (구체적, 실제 돌릴 수 있는 수준)

## 아이디어 1 — **PAttn 깊이 scan × motif typology 측정** (APF 직접 후속)

### 가설

> **"PAttn 의 e_layers ∈ {1, 2, 4, 8} 을 ETT/Weather/Traffic + 합성 motif benchmark (APF synthetic) 에 학습하고, attention map 의 motif typology distribution 을 측정하면, 깊이별로 motif diversity 가 *비선형* 으로 증가한다. 그러나 forecast 성능은 1 → 8 layer 사이 한계 이득 < 5% (MSE)."**

이 가설이 맞다면 → APF 의 motif analysis 가 *얕은 PAttn 위에서도* 의미 있으며, 깊이는 motif diversity 의 *원인이 아니라 동기* 임. APF paper § Methods 의 baseline 선택 정당화에 직접 반영.

### 데이터

- **표준 long-term TSF**: ETTh1, ETTh2, ETTm1, ETTm2, Weather, Traffic. Tan 2024 가 검증한 데이터 → fair 비교.
- **APF synthetic motif benchmark**: trend / seasonal / regime / anomaly / freq-drift 의 5-카테고리 × N=8 motif 패턴. APF 자체 자산 (`Attention Pattern Fields/data/synthetic/`).
- **Forecast horizon**: 96 (표준).

### 비교 조건

| 조건 | e_layers | PE 종류 | seed |
|---|---|---|---|
| A | 1 | sinusoidal | 5 seeds |
| B | 2 | sinusoidal | 5 seeds |
| C | 4 | sinusoidal | 5 seeds |
| D | 8 | sinusoidal | 5 seeds |
| E | 1 | NoPE | 5 seeds |
| F | 1 | RoPE | 5 seeds |
| G | 1 | ALiBi | 5 seeds |

총 7 × 5 = 35 runs × 6 데이터셋 = 210 runs. 1 run 당 PAttn 디폴트 (epochs=10, batch=512, lr=1e-4) 로 GPU 시간 약 15-30 분 (1× RTX 3090 가정) → 총 약 50-100 GPU 시간. 1주 안에 끝남.

### 측정 지표

1. **Forecast 성능**: MSE, MAE 표준.
2. **Motif typology distribution**: 각 attention head 의 attention map (예: 32 patch × 32 patch matrix) 을 6 motif 카테고리 (diagonal/stripe/block/edge/spike/checker) 중 하나로 자동 분류 — CNN probe (APF 보유 자산) 기반. distribution = head 별 motif 비율.
3. **Motif diversity**: 동일 모델 내 head 들의 motif distribution entropy (Shannon).
4. **Motif causality**: PAttn 의 head 하나를 random-init 으로 교체했을 때 forecast 성능 변화 — APF 의 causal intervention 측정.

### 예상 결과

| 가설 | 예상 |
|---|---|
| Forecast 성능 (1 vs 8 layer) | < 5% MSE 차이 (Tan 2024 의 결과 robust) |
| Motif diversity (1 vs 8 layer) | 1 → 8 layer 갈수록 entropy 증가 (head 다양화) |
| Motif causality (head ablation) | 깊이 1 에서 강한 causality, 깊이 8 에서는 *redundant heads* 가 많아 약한 causality |
| PE 효과 (NoPE vs sinusoidal vs RoPE vs ALiBi) | 각 PE 별로 motif distribution 이 분리됨 (APF 의 핵심 주장 검증) |

### 반증 조건

- 만약 e_layers 1 vs 8 의 *forecast 성능 차이가 > 20%* 면 Tan 2024 결론의 robustness 의심 → 본 데이터셋이 *얕은 모델로 충분* 했을 뿐, 다른 setting 에서 다른 결론 가능.
- 만약 motif distribution 이 *PE 별로 구분 안 됨* (PE 무관) 이면 APF 의 핵심 주장 *심각 약화* → APF paper 의 motivation 재검토 필요.

### 비용 추정

- GPU: 50-100 시간 (1× RTX 3090 또는 RTX 4090)
- 사람 시간: 코드 작성 1주 (PAttn 코드 fork + APF motif probe 통합) + 실험 1주 + 분석 1주 = 3주
- 산출물: APF paper § Robustness 챕터 1.5 페이지 + supplementary table 1개 + figure 2개

---

## 아이디어 2 — **PAttn vs Chronos 의 *grokking 가능성* 측정** (Grokking 직접 후속)

### 가설

> **"PAttn (random-init, 얕은) 과 Chronos (시계열 pretrained, 깊은) 를 *logistic map chaotic iterate* 와 *regime-switching synthetic* 두 task 에 학습할 때, PAttn 은 grokking 을 보이지 않지만 Chronos 는 (또는 PAttn-8L 은) delayed generalization 을 보인다."**

이 가설이 맞다면 → Grokking track 의 *task choice* 정당화 (Tan 2024 가 다룬 표준 TSF 는 grokking 안 보임 → Grokking 은 *별도* 영역) + *깊이* 가 grokking 의 필요조건임의 정량화.

### 데이터

- **Logistic map**: $x_{t+1} = r \cdot x_t (1 - x_t)$, $r \in [3.7, 4.0]$ 의 chaotic 영역. 10k step 학습용 + 1k step val + 1k step test. lookback 64, horizon 16.
- **Regime-switching synthetic**: 사용자의 *Grokking in TS Transformers* 자산 (`Grokking in Time Series Transformers/data/`). 2-state HMM × AR(1) per state. lookback 64, horizon 16.
- **ETTh1 (control)**: Tan 2024 의 데이터셋으로 *grokking 안 나타남* 을 baseline 으로.

### 비교 조건

| 조건 | 모델 | 깊이 | Pretrain |
|---|---|---|---|
| A | PAttn | 1 layer | None (random init) |
| B | PAttn | 4 layers | None |
| C | PAttn | 8 layers | None |
| D | Chronos-small | T5-small (12L) | 84B TS token |
| E | Chronos-small | T5-small (12L) | Random init (fair comparison: Tan 2024 LLM2Trsf-style) |

총 5 모델 × 3 데이터셋 × 3 seeds = 45 runs. 각 run 은 *long horizon* training (5000-10000 epochs) — grokking 관찰을 위해. PAttn 1-layer 는 1 epoch 당 1 분 이내 → 5000 epoch 약 80 시간 / run. Chronos-small 는 1 epoch 5 분 → 5000 epoch 약 400 시간 / run. 부담스러우면 epoch 수를 2000 으로 줄임.

### 측정 지표

1. **Train loss vs val loss curve**: grokking 의 정의 (train converges 후 val 이 *별도 시점* 에 converge).
2. **Generalization gap timing**: $T_\text{grok} = \arg\min_t (\text{val loss}(t) < \text{val loss}_\infty + \epsilon)$ 와 $T_\text{train}$ 의 비율.
3. **Layer-wise representation similarity** (Chronos 의 12 layer 의 layer-wise hidden 표현이 train vs val 시점에 어떻게 변하는지) — Mishra 2026 SAE 의 layer hierarchy 와 비교.
4. **Attention motif evolution**: 각 head 의 motif distribution 이 grokking 시점 전후로 변하는지 (APF 의 motif probe 활용).

### 예상 결과

| 가설 | 예상 |
|---|---|
| PAttn-1L on logistic map | Train converge 하지만 val 도 동시에 — grokking 안 보임 |
| PAttn-4L/8L on logistic map | Train 1k epoch 후 converge, val 은 3-5k epoch 에 *delayed* converge — grokking 관찰 |
| Chronos-small (pretrained) on logistic map | Train 빠르게 converge, val 도 빠르게 (사전학습 prior) → grokking 안 보임 (이미 generalize) |
| Chronos-small (random init) on logistic map | PAttn-8L 과 유사한 grokking pattern |
| ETTh1 (control) | 모든 모델에서 grokking 안 보임 (얕은 task) |

### 반증 조건

- 만약 *PAttn-1L 에서도 grokking* 이 보이면 → 깊이는 grokking 의 필요조건 아님. Grokking track 의 *깊이 가설* 폐기.
- 만약 *깊은 모델에서도 grokking 안 보임* 면 → logistic map 도 grokking 의 자연 서식지 아님. Grokking track 의 task choice 다시 재설계 (예: modular arithmetic on TS).
- 만약 *Chronos pretrained 가 grokking* 을 보이면 → 사전학습이 grokking 을 *지연시키지 않음* (가설과 반대). 본 가설 폐기.

### 비용 추정

- GPU: 500-1000 시간 (Chronos 학습이 비쌈). 짧게 가면 100-200 시간. 1× A100 또는 2× RTX 3090.
- 사람 시간: 코드 작성 2주 (Grokking track 자산 + Chronos fine-tune 통합) + 실험 2주 + 분석 2주 = 6주.
- 산출물: Grokking paper § Methods 의 *task choice* 정당화 (1 페이지), § Results 의 *깊이 × pretrain 의 2D scan* (1 page + 4 figures + 1 supplementary table), Tan 2024 의 정확한 후속 위치 점유.

---

## 두 아이디어의 *공통 자산 reuse*

- **PAttn 코드 fork**: 둘 다 PAttn 의 `e_layers` arg 만 변경. 코드 작성 비용 절감.
- **APF motif probe**: 둘 다 APF 의 CNN probe (motif classifier) 사용. 통합 비용 절감.
- **결합 산출물**: 두 실험을 결합하면 *APF + Grokking 의 hybrid paper* — "Depth × Pretraining 의 2D scan 으로 attention motif 진화와 generalization timing 을 동시 측정" 이 *NeurIPS/ICLR 2027 의 단일 paper* 로 묶임. 사용자의 두 active track 의 통합 가능성.
