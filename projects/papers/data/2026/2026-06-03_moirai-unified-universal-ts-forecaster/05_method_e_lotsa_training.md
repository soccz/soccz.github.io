# 4-E. LOTSA + Unified Training — 데이터·학습 파이프라인

## 왜 이 부분이 필요한가

세 architectural component (multi-patch, any-variate, mixture head) 가 *universal* 인 *가능성* 을 만든다. 그 *가능성* 이 *실현* 되려면 *공개·대규모·다양한* 사전학습 데이터와 *가변 context / horizon / variate-count* 의 통합 학습 pipeline 이 필요. LOTSA + Unified Training 이 그 두 축을 메운다.

저자 동기 (§3.2.1): 기존 *공개* 자원은 Monash + GluonTS 합쳐 *~1B obs* 로 LLM 의 *trillion-tokens* 와 차이 큼. TimesFM 의 *100B+ obs* 는 비공개. *공개 자원에서 가장 큰 시계열 archive* 를 만들겠다는 게 LOTSA 의 출발.

## LOTSA — 27,646,462,733 관측치 9-도메인 archive

### 도메인 구성 (Table 2 원문)

| 도메인 | # Datasets | # Observations | 비율 |
|--------|-----------|----------------|------|
| Energy | 30 | 16,358,600,896 | **59.17%** |
| Transport | 23 | 4,900,453,419 | 17.73% |
| Climate | 6 | 4,188,011,890 | 15.15% |
| CloudOps | 3 | 1,518,268,292 | 5.49% |
| Web | 3 | 428,082,373 | 1.55% |
| Sales | 6 | 197,984,339 | 0.72% |
| Nature | 5 | 28,547,647 | 0.10% |
| **Econ/Fin** | **23** | **24,919,596** | **0.09%** |
| Healthcare | 6 | 1,594,281 | 0.01% |

**총 관측치 27,646,462,733** — *공개 archive 중 최대*. 단 도메인 불균형 극단 (Energy 가 거의 60%, Healthcare 0.01%). 이 불균형이 raw sampling 시 *Energy-편향 모델* 을 만들 위험.

### Frequency 구성 (Table 3 원문)

| Frequency | # Datasets | # Observations | 비율 |
|-----------|-----------|----------------|------|
| Yearly | 4 | 873,297 | 0.003% |
| Quarterly | 5 | 2,312,027 | 0.008% |
| Monthly | 10 | 11,040,648 | 0.04% |
| Weekly | 7 | 18,481,871 | 0.067% |
| Daily | 21 | 709,017,118 | 2.565% |
| (Multi) Hourly | 31 | 19,875,993,973 | **71.89%** |
| (Multi) Minute | 25 | 7,013,949,430 | 25.37% |
| (Multi) Second | 2 | 14,794,369 | 0.054% |

Hourly 가 압도적 (71.89%). 이 또한 sampling cap 필요.

### Sub-dataset sampling cap ε = 0.001

저자 명시:
$$
p(D_k) = \frac{\omega_k}{\sum_{i=1}^K \omega_i}, \quad \omega_k = \min\left(\frac{|D_k|}{\sum_i |D_i|}, \epsilon\right)
$$

**4줄 해석**:
1. **기호 뜻**: $D_k$ = $k$ 번째 sub-dataset (집합 $\{i : i \in D_k\}$ 의 시계열 indices), $|D_k| = \sum_{i \in D_k} T_i$ (그 sub-dataset 의 총 관측치 수), $\epsilon = 0.001$, $K$ = 총 sub-dataset 수.
2. **일상 비유**: *학교 전체에서 1반이 학생 1000명, 2반이 학생 10명일 때, 둘 다 학년 활동에 1/2 씩 참여시키는 게 아니라 1반은 1/2, 2반도 *최소 보장* 비율로 참여 가능*. 단 너무 큰 반(Energy 처럼 60%)은 *상한 0.1%* 로 잘라서 다양성 보존.
3. **왜 이 형태**: 단순 비례면 Energy 가 학습 데이터의 60% — 모델이 *Energy 특화* 됨. Cap $\epsilon=0.001$ 으로 sub-dataset 당 최대 0.1% (전체에서) 만 contribution. *동시에* 너무 작은 dataset 도 *상대적으로* 보존됨.
4. **조심할 점**: $\epsilon=0.001$ 은 *hyperparameter* — 다른 값이 더 좋을 수도. 본문 ablation 없음. 또한 *sub-dataset* 의 정의 ("Monash 의 한 dataset" 인지 "GluonTS 의 한 series 묶음" 인지) 가 본문에서 불명확 (Appendix A 에서 명시).

## Task Distribution — 가변 context / horizon

저자 명시:
- *최대 sequence length 512* (post-flatten, post-patch).
- *최소 sequence length per variate 2*.
- *Horizon 비율 [0.15, 0.5] uniform* — sampled window 길이의 15-50% 가 forecast horizon, 나머지가 context.
- *변량 수 sampling*: beta-binomial(n=128, a=2, b=5) — 최대 128 변량, 평균 ≈ 37 변량.

이 *task distribution* 이 *unified* 의 핵심: inference 시 *임의 horizon, 임의 context* 가 가능한 이유는 학습 시 *random sample* 된 다양한 조합을 봤기 때문.

### 추가 augmentation:
- (i) Multivariate sub-sampling: 다변량 시계열에서 변량 일부만 *uniform random sub-sample*.
- (ii) Univariate concat: 단변량 sub-dataset 의 시계열들을 *randomly concat* 해 *가짜 다변량* 구성.

이 두 trick 이 *학습 시* 다양한 변량 조합을 만들어 *inference 시* 어떤 변량 수가 와도 처리 가능하게 만든다.

## Pre-training Hyperparameters (Table 4)

| Size | Layers | $d_{model}$ | $d_{ff}$ | Heads | $d_{kv}$ | Params |
|------|--------|------------|---------|-------|----------|--------|
| MOIRAI-Small | 6 | 384 | 1536 | 6 | 64 | 14M |
| MOIRAI-Base | 12 | 768 | 3072 | 12 | 64 | 91M |
| MOIRAI-Large | 24 | 1024 | 4096 | 16 | 64 | **311M** |

- Optimizer: **AdamW**, lr=1e-3, weight_decay=1e-1, $\beta_1=0.9$, $\beta_2=0.98$.
- Schedule: linear warmup 10,000 steps + cosine annealing.
- Steps: **Small 100k, Base/Large 1,000,000** (10× 차이 — 작은 모델에 학습 짧게).
- Batch size: 256.
- Hardware: **NVIDIA A100-40G + TF32 precision**.

## Sequence Packing — padding 61.08% → 0.38%

저자 핵심 efficiency trick: *sequence packing* (Raffel et al. 2020 T5 의 trick 차용). 가변 길이 sample 을 *padding 으로 같은 길이로 맞추지 않고* 한 batch slot 안에 *짧은 sample 여러 개를 이어붙임*.

저자 측정 (§4.4 본문): 1000 iterations 측정 시:
- **packing 없이**: padding 비율 *61.08%* — 학습 token 의 60% 가 무의미한 padding.
- **packing 적용**: padding 비율 *0.38%* — 사실상 모든 token 이 학습에 기여.

효과: *동일 compute 로 ~1.6× 효과적 학습*. Table 7 ablation 의 "w/o packing" 이 0.785 (+20%) 로 악화 — packing 이 *데이터 효율* 의 큰 부분.

## 학습 의사코드 (저자 본문 기반 재구성)

```
for step in range(total_steps):
    # 1. Sub-dataset sampling (cap-applied)
    k = sample_subdataset(p(D_k))
    
    # 2. Time series & window sampling
    (Y, Z) = sample_timeseries_from(D_k)
    window_len = uniform_random(min=2*n_variates, max=512)
    window = crop_random(Y, Z, length=window_len)
    
    # 3. Horizon split
    h_ratio = uniform_random(0.15, 0.5)
    h = int(h_ratio * window_len)
    l = window_len - h
    
    # 4. Variate augmentation (multivariate → subsample, univariate → concat)
    n_vars = sample_beta_binomial(n=128, a=2, b=5)
    variates = subsample_or_concat(window, n_vars)
    
    # 5. Multi-patch tokenization (freq-aware patch size)
    patches = multi_patch_project(variates, patch_size=lookup_freq(D_k))
    
    # 6. Mask horizon
    masked_patches = mask(patches, horizon_positions=range(l, l+h))
    
    # 7. Sequence packing (multiple samples per batch slot)
    packed_batch = pack(masked_patches)
    
    # 8. Forward + NLL
    phi_hat = moirai(packed_batch)
    loss = -log_p_mixture(Y_horizon | phi_hat).mean()
    
    # 9. Backward + AdamW step
    loss.backward()
    optimizer.step()
```

## 대안 디자인 비교

**대안 A — Fixed context / horizon (PatchTST 식)**: *효과*: 학습 단순. *부족*: inference 시 *학습 안 본* horizon / context 처리 어려움. Universal 목표와 정면 충돌.

**대안 B — Proportional sub-dataset sampling (no cap)**: *효과*: dataset 크기에 비례한 학습. *부족*: Energy 60% 편향. Table 7 의 "w/o LOTSA" (사실은 *부분 LOTSA* — Monash + GluonTS만) 가 0.809 (+24%) 로 악화 — 다양성이 필수.

**대안 C — Decoder-only autoregressive 학습 (Lag-Llama / TimesFM)**: *효과*: long-horizon 자연. *부족*: parallel inference 어려움, masked encoder 의 *bidirectional context* 손실. 저자는 *masked encoder* 가 시계열에서 superior 라는 자기 이전 작 (Woo 2023) 을 근거로 decoder-only 회피.

## 이 부분의 핵심 한 문장

**LOTSA + Unified Training 은 "공개 자원 27.6B obs 의 도메인·freq 극단 불균형을 cap=0.001 sampling 으로 압축하고, 가변 context/horizon/variate-count 의 task distribution 으로 inference-time flexibility 를 *학습 시에* 흡수"** — architectural universality 의 *data-side* 보완. Sequence packing 이 *60% padding → 0.4% padding* 의 효율 trick 으로 학습 budget 의 ~60% 를 회수.
