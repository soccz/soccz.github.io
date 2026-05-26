# 9. 사고 확장 (c) — 실험 아이디어 2 개

> **🧒 한 줄 요약**: 실험 아이디어 — TS Transformer circuit identification, Cross-architecture comparison.


## 아이디어 1 — PE-conditional ACDC: motif 가 회로 분포를 어떻게 바꾸는가 (APF direct)

### 가설

같은 task (예: synthetic motif benchmark 의 trend 예측) 를 4 개 PE 종류 (NoPE / sinusoidal / learned / RoPE / ALiBi) 의 동일 transformer 에 학습시킨 뒤 ACDC 를 돌리면, *같은 행동을 만드는 회로* 의 *edge 분포* 가 PE 에 따라 *통계적으로 유의하게 다르다*. 구체적으로:

- **NoPE**: edge 가 *전 layer 에 광범위* — 위치 정보가 head 의 학습된 *positional contextual bias* 에 의존. ACDC 회로의 edge density ∝ uniform.
- **Sinusoidal absolute PE**: *embed → 각 layer head* 의 edge 가 강하게 활성 — embedding 단계에서 위치 정보 주입. embed 에서 나오는 edge 의 ACDC 유지율 ↑.
- **RoPE**: edge 가 *상대 position 거리* 에 의존 — 가까운 token 쌍의 head edge 가 강하게 prune 안 됨. ACDC 회로의 edge length distribution 이 *짧은 쪽* 에 치우침.
- **ALiBi**: 거리 비례 bias 로 *먼 token edge* 가 자동으로 prune. ACDC 회로의 *최대 edge 길이* 가 PE 에 의해 결정.

### 데이터·모델

- **데이터**: `_profile.md` 의 APF synthetic motif benchmark (trend / seasonal / regime / anomaly / freq drift), 각 5,000 시퀀스, sequence length 64. 또는 simple algorithmic task (modular arithmetic with positional structure).
- **모델**: 동일 architecture (4-layer × 4-head Transformer, hidden 128, MLP 4× hidden) × 5 PE 변종. 각 모델 30k step 학습, train loss 동일 수준에서 stop.
- **하드웨어**: single A100 또는 4090. ACDC 의 |E| ≈ 4·4 + 4 = 20 노드 + edge 약 200 — 빠름 (시간 단위 미만).

### 비교 조건

- **Treatment**: 5 PE 별로 ACDC 돌리고 회로 추출 (KL metric, random ablation, τ scan).
- **Control 1**: 같은 데이터, 같은 모델 architecture 지만 *random initialization* 의 *학습 전* 모델 — ACDC 의 회로 *prior*. PE 효과가 학습으로 인한 것임을 확인.
- **Control 2**: 같은 모델 architecture 의 *다른 seed* — PE 와 무관한 회로 variance.

### 예상 결과

3 개 측정치:

1. **회로 *edge length distribution*** (head-to-head edge 의 layer 거리 분포): RoPE / ALiBi 가 *짧은 쪽 skew*, sinusoidal / NoPE 가 *균등*. Wasserstein distance 로 정량.
2. **회로 *edge density per layer***: sinusoidal 은 *embed → layer 1* edge ratio ↑, RoPE 는 *각 layer 의 horizontal* edge ratio ↑.
3. **회로 *Jaccard similarity 행렬*** (5×5): 같은 PE 의 두 seed = high (0.7+), 다른 PE = low (< 0.4). 이게 *PE → motif → circuit* 사심의 직접 증거.

### 반증 조건

(a) 5 PE 의 회로 Jaccard similarity 가 모두 0.7+ → PE 가 회로에 무관, APF 가설 *기각*.
(b) Jaccard 가 모두 < 0.4 (같은 PE 도) → 회로 자체가 *random* — ACDC 가 의미 없는 결과. 다른 알고리즘 (EAP) 으로 재확인.
(c) 회로 다르지만 *행동 (metric)* 도 모두 다름 → "같은 행동, 다른 회로" 가 아니라 *다른 행동, 다른 회로*. 학습 stop 시점의 metric 동일성을 엄격히 통제.

### 비용 추정

- 모델 학습: 5 PE × 3 seed = 15 모델 × 30k step × 1 GPU-hour = 15 GPU-hour.
- ACDC: 15 모델 × τ scan (10 값) × 시간당 회로 5 개 = 30 GPU-hour.
- 분석·플롯: 1 일.
- **총: 약 1 주, 50 GPU-hour, single A100**. APF active track 의 다음 sprint 에 적합.

---

## 아이디어 2 — Checkpoint-delta ACDC: grokking 의 회로 형성 추적 (Grokking-TS direct)

### 가설

Grokking 의 phase transition 직후, ACDC 가 *새로 들어온* edge 들의 집합 $\Delta E_{t \to t+\Delta t}$ 가 *grokking circuit* 이다. 즉:

- pre-grok 시점 $t_1$ (train loss 낮음, test loss 높음): ACDC 회로 = *memorization circuit* (큰, dense, polysemantic).
- grok-onset 시점 $t_2$ (test loss 갑자기 하락 시작): ACDC 회로의 *edge 절반* 이 prune 됨 — *sparsification event*.
- post-grok 시점 $t_3$ (test loss 정착): ACDC 회로 = *generalization circuit* (작은, sparse, monosemantic).

$\Delta E = E_{t_2} \setminus E_{t_1}$ (없어진 edge) 와 $E_{t_2} \setminus E_{t_1}$ (들어온 edge — 사실 ACDC 는 *prune* 하므로 *덜 prune 된 edge*) 의 *기능 분석* 이 grokking 의 *circuit-level 본질*.

### 데이터·모델

- **데이터**: `_profile.md` 의 logistic map (chaotic iterates), sin/periodic synthetic, 또는 regime-switching synthetic. 이 중 *grokking 이 관찰된* 데이터부터 시작 (currently P2 logistic 4-layer 실험에 활용 중).
- **모델**: 4-layer TS-Transformer, 4-head, hidden 64. P2 setup 그대로.
- **학습**: 100k step. Grokking 이 typically *late phase* 에 일어남.

### 비교 조건

- **Treatment**: 10 개 checkpoint (10k, 20k, ..., 100k step) 에서 ACDC 돌리고 회로 추출. τ 는 *각 checkpoint 별로 same metric loss budget* 으로 calibrate (예: 모든 회로가 KL loss < 0.1 을 만족).
- **Control 1**: train loss 가 *지속 감소* 하는 non-grokking 모델 (예: 큰 모델, 빠른 학습) 에서 동일 절차. *sparsification event* 가 없을 것 — null hypothesis.
- **Control 2**: 같은 모델, *다른 task* (예: sin → cos 변경) — task-specific 한 회로 vs grokking-specific 한 회로 분리.

### 예상 결과

3 개 그래프:

1. **회로 크기 vs step**: pre-grok 까지 큰 회로, grok-onset 에서 *cliff* 형태로 sparse 화, post-grok 정착. 이 cliff 가 grokking 의 *circuit signature*.
2. **Edge churn rate**: $|\Delta E_{t \to t+1}| / |E_t|$ — pre-grok 작음, grok-onset 큼, post-grok 작음. Cohen's d 로 정량.
3. **Edge 기능 라벨링**: post-grok 에 *새로 strong* 한 edge 들 — 어느 head 사이? Nanda 2023 의 Fourier head 와 동등한 구조를 TS 의 *주파수 채널 head* 에서 발견할 수 있는가?

### 반증 조건

(a) Grokking 보여도 회로 크기 곡선이 *smooth* — sparsification event 가 없으면 ACDC 의 *cliff* signature 가 가설 1 의 핵심 — 가설 *기각*.
(b) Non-grokking 모델도 같은 cliff 보여 → cliff 가 grokking 의 *특이 signature* 가 아닌 *학습 자체의 일반 특성* — 가설 *기각* 또는 약화.
(c) 회로 ground-truth 가 없어 새 edge 의 *기능 라벨링* 이 어려운 경우 — RASP-style 컴파일된 TS-transformer (logistic map 의 *fixed-point* / *cycle* attractor 를 explicit 회로로 표현) 를 별도 sanity check 로 추가.

### 비용 추정

- 모델 학습: 4 task (logistic, sin, periodic, regime-switch) × 3 seed = 12 모델 × 100k step × 1 GPU-hour = 12 GPU-hour.
- ACDC: 12 모델 × 10 checkpoint × 회로 추출 = 120 회로 × 10 분 = 20 GPU-hour.
- 분석: 회로 시각화 + 기능 라벨링 — 1 주.
- **총: 약 2 주, 50 GPU-hour, single A100**. Grokking-TS Week 4-6 sprint 에 적합.

---

## 두 아이디어의 *동일 backbone*

두 아이디어 모두 *ACDC 의 알고리즘 자체를 그대로 차용* 하고, *입력 차원 (PE 변종 / training checkpoint)* 만 다르게 한다. 즉 ACDC 가 *비교 인터페이스* 라는 본 해체의 핵심 통찰을 정확히 활용 — APF 는 *PE 축에서 회로를 비교*, Grokking-TS 는 *time/checkpoint 축에서 회로를 비교*. 두 axis 모두 ACDC 의 *single hyperparameter τ* 덕분에 *Pareto frontier* 라는 단일 비교 언어로 정량화 가능.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **2 idea base?**
2. **반증 조건?**
3. **contribution figure?**

### 답변

1. paper §-references + 본 deep dive 의 cross-reference 기반.

2. ACDC (Conmy 2023) 의 핵심 mechanism (edge-by-edge ablation + KL metric) 의 통합 관점.

3. APF / Grokking 트랙의 baseline — manuscript §1-§6 + Appendix.
