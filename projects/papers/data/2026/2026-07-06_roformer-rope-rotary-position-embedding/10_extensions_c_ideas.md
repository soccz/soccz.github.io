# 10.c 사고 확장 — 실험 아이디어 2개

RoPE 를 검토하며 떠오른 두 실험 아이디어. 각각 (i) 가설, (ii) 데이터, (iii) 비교 조건, (iv) 예상 결과, (v) 반증 조건, (vi) 비용 추정 순으로 구조화.

---

## 아이디어 1 — RoPE-Grokking Timing Modulation (Grokking track 직결)

### 가설
**PE 선택이 grokking phase transition 의 timing 을 유의미하게 shift 시킨다. 특히 RoPE 는 감쇠 편향으로 인해 특정 회로 (예: local pattern-matching head) 를 조기에 발견하지만, 최종 test 성능은 NoPE 대비 낮거나 동등이다.**

### 데이터

- **Primary substrate**: 사용자 P2 logistic 4-layer TS-Transformer (`Grokking in Time Series Transformers/paper/PAPER_PLAN.md` §3 setup). Logistic map $x_{t+1} = r x_t (1 - x_t)$ 의 예측 (period-doubling → chaos 구간 포함).
- **Secondary substrate (cross-check)**: Nanda 2023 modular addition (mod 113) 표준 grokking setup — 이 도메인은 원조 grokking 이 확실히 관측되므로 PE 효과 격리에 유리.
- **Data split**: train 30% / val 20% / test 50% (Grokking 관측에 필요한 소량 train + 다량 test).

### 비교 조건

- **PE 5-way**: NoPE / abs_sinusoidal / abs_learned / **RoPE** / ALiBi.
- **Seed 3-way**: 서로 다른 seed 3 개.
- **Model 크기 2-way**: 2-layer d=64 (small) / 4-layer d=128 (large).
- 총 5 × 3 × 2 = **30 runs**.

### 측정

각 run 에 대해:
1. **Grokking timing metric**: train loss - test loss gap 이 0.1 이하로 처음 떨어지는 epoch (Nanda 2023 방식).
2. **회로 형성 metric**: 회전 스펙트럼 대역별 attention magnitude 시간에 따른 진화 곡선. Grokking 순간 전후로 어느 대역이 shift 하는지 heatmap.
3. **최종 성능**: 학습 마지막 epoch 의 test loss.
4. **Motif classification (APF cross-fertilise)**: 학습 종료 시점 attention pattern 을 APF motif classifier CNN 으로 라벨링.

### 예상 결과

- **Timing**: RoPE 가 grokking 을 sinusoidal 보다 조금 빠르게 진입 (감쇠 편향으로 회로 초기 정렬), NoPE 가 가장 늦음 (편향 없어 회로 탐색 시간 김).
- **최종 성능**: NoPE > RoPE ≈ sinusoidal ≈ learned > ALiBi (NoPE 는 최적화 자유도, ALiBi 는 감쇠 과함).
- **Motif**: RoPE 는 diagonal-band motif 확률이 sinusoidal 대비 유의미하게 높음. ALiBi 는 매우 강한 근접 편향으로 spike motif 발현.
- **회로 spectrum**: RoPE 의 저주파 대역 활성화 shift 가 grokking 순간과 correlated.

### 반증 조건

- 만약 5-way PE 사이 grokking timing 이 seed 분산 범위 안이라면 (예: $\sigma_\text{seed} > $ mean between-PE difference), PE 효과 확립 실패.
- 만약 RoPE 의 motif 편향이 sinusoidal 과 유의미 차이 없다면 (KL divergence < 0.1 등 사전 정의 threshold), APF 의 "PE → motif" 가설 반박.
- 만약 grokking timing 이 PE 별로 다르되 회로 spectrum shift 는 timing 과 uncorrelated 라면, PE 효과는 있으나 회로 mechanism 은 별개.

### 비용 추정

- Training: 30 runs × 10-30 epoch (grokking 관측 위해 긴 학습). 각 run 은 CPU-only 로 30 min-2 hr (small model). 총 25-60 hr wall-clock (single GPU) 또는 100-200 hr CPU-only.
- Analysis: 회로 spectrum 시각화 + motif classification 은 재사용 코드로 낮은 비용.
- 데이터: 소량 (< 10 MB, 합성 데이터).
- **결론**: single GPU 로 3-7 일. 실행 가능.

---

## 아이디어 2 — Domain-Adaptive RoPE Spectrum (APF track 직결)

### 가설

**RoPE 의 주파수 스펙트럼 $\theta_i = 10000^{-2(i-1)/d}$ 는 자연어 도메인에 편향되어 있어, 시계열 (특히 금융) 도메인에서는 다른 스펙트럼이 최적이다. 학습 가능한 $\theta_i$ (LearnRoPE) 를 도메인별로 fine-tune 한 후 최적 스펙트럼을 비교하면 도메인간 유의미한 차이가 발견된다.**

### 데이터

- **Domain 1 (자연어)**: WikiText-2 (표준 LM). Baseline 도메인.
- **Domain 2 (자연 시계열)**: UCR Archive 서브셋 (10 개 데이터셋).
- **Domain 3 (금융 시계열)**: SPX daily returns 2005-2024 + BTC hourly 2018-2024 (사용자 보유 데이터).
- **Domain 4 (합성 chaotic)**: Logistic map + Lorenz63 궤적. Ground-truth 상대거리 구조 (Lyapunov exponent) 를 알기 위한 통제.

### 비교 조건

- **Baseline**: RoPE 원본 (θ_i = 10000^{-2(i-1)/d}), 고정.
- **LearnRoPE-A**: 초기화 sinusoidal, 각 도메인 fine-tune 시 $\theta_i$ 를 학습.
- **LearnRoPE-B**: 초기화 uniform ($\theta_i \in [0, 2\pi]$ 균등), 각 도메인 fine-tune 시 $\theta_i$ 를 학습.
- **LearnRoPE-C**: 초기화 log-uniform, 학습.
- **NoPE control**: PE 없음, 도메인별 성능 참조점.

총 5-way × 4-domain × 3-seed = **60 runs**.

### 측정

1. **Downstream 성능**: LM perplexity (자연어), test MSE (시계열).
2. **최종 학습된 스펙트럼**: 각 도메인 × 각 initialization 별 최종 $\theta_i$ 분포를 시각화 (log-log plot).
3. **도메인 간 스펙트럼 차이**: 자연어 vs 시계열 vs 금융 시계열의 최종 $\theta_i$ 분포 사이 Wasserstein distance.
4. **Motif 편향의 스펙트럼 의존성**: 각 학습된 스펙트럼이 유도하는 motif 확률 분포 (APF classifier 로 라벨링) 를 domain 별로 비교.

### 예상 결과

- **자연어**: 최종 스펙트럼이 baseline (10000-based) 과 크게 다르지 않음. Sinusoidal 유산이 자연어에는 잘 맞음.
- **자연 시계열**: 저주파 대역이 baseline 대비 확대됨 (long-range dep 이 강해). 특히 UCR 의 seasonal 데이터에서 계절 주기에 맞는 대역 강화.
- **금융 시계열**: 매우 저주파 (extreme low) 와 매우 고주파 (extreme high) 로 이극화 (bimodal). 저주파는 regime 전환용, 고주파는 tick-level 노이즈용.
- **Chaotic**: Lyapunov exponent 와 대응되는 특정 대역 (예: $\theta_i \approx \lambda_L$) 의 강한 활성화.
- 최종 스펙트럼의 도메인간 Wasserstein 거리 > 0.5 (사전 정의된 유의미 threshold).

### 반증 조건

- 모든 도메인의 최종 스펙트럼이 baseline 근방으로 수렴 (즉 baseline 이 대체로 좋은 초기값이고 학습 여지가 작음) → 가설 반박, sinusoidal 스펙트럼의 범용성 확인.
- LearnRoPE 가 baseline 대비 downstream 에서 유의미한 개선 없음 → 학습 여지가 있어도 downstream impact 는 미미 (사용자 관점 실용 결론).
- 도메인간 스펙트럼 분포가 모두 유사 → 도메인 특화 스펙트럼이라는 가설 반박.

### 비용 추정

- 60 runs × pretrain 5-10 epoch + fine-tune 10-30 epoch. Small model (2-layer d=128). Single GPU 5-15 hr per run → 총 300-900 hr (약 15-40 일 single GPU) 또는 8-GPU 로 2-5 일.
- 분석 (스펙트럼 시각화, Wasserstein 계산, motif 라벨링) 은 낮은 비용.
- 데이터: 자연어 + UCR + SPX/BTC + 합성 chaotic (< 5 GB).
- **결론**: 단일 GPU 로는 무겁고, 4-8 GPU 로 1-2 주. APF paper 실험 챕터의 flagship candidate.

---

## 두 아이디어의 통합 시야

- **아이디어 1** 은 즉시 실행 가능 (3-7 일), Grokking track 직결, 사용자 P2 substrate 재활용. `grokking_ts_transformers/experiments/` 아래 새 폴더로 세팅 가능.
- **아이디어 2** 는 중대형 실험 (1-2 주), APF track 직결, 도메인 다양성 필요. `Attention Pattern Fields/experiments/domain_spectrum/` 폴더로 세팅.

두 실험은 **공통 codebase 를 공유** 할 수 있다 — LearnRoPE 구현, motif classifier, 회전 spectrum 시각화 함수는 모두 재사용 가능. 아이디어 1 을 파일럿 (3-7 일 안에 결과) 으로 먼저 실행하면 아이디어 2 의 대규모 세팅에 필요한 hyperparameter (learning rate for $\theta_i$, initialization variance 등) 를 조기에 확보할 수 있다.
