# 12. 인간 동작 예측 결과 — Section 5.2

paper p.8-9 (Section 5.2). **Table 3 (11 models × 2 datasets) + Fig 3 (pose visualization)**.

이 챕터의 목표: **모션 예측이 시계열 예측과 어떻게 다른지, 결과를 어떻게 읽는지, 그림이 말하는 게 무엇인지** 깊이 풀어 쓴다.

---

## 12.1 모션 예측 — 시계열과 다른 점

### 입력·출력의 차이

| 항목 | 시계열 예측 | 모션 예측 |
|------|-----------|---------|
| 입력 | 과거 트래픽 등 측정값 | 과거 0.25s~0.5s 의 관절 위치 |
| 출력 | 미래 트래픽 분포 | 미래 1~2s 의 관절 위치 sequence |
| 평가 | CRPS_sum (분포 평가) | ADE / FDE (거리 평가) |
| 학계 | 시계열 통계학/ML | 컴퓨터비전/그래픽스 |

### 왜 같은 framework 로 둘 다 가능한가

paper 의 핵심 주장: **둘 다 "context 주고 미래 sequence 예측" 의 conditional prediction 문제**.
- 시계열: $x_t$ 가 트래픽 값.
- 모션: $x_t$ 가 17 관절 × 3D = 51차원 벡터.
- 같은 ProTran framework, 다만 emission MLP 의 출력 차원만 다름.

→ 하나의 architecture 로 두 분야 SOTA 라는 것이 "task-agnostic" 의 증명.

---

## 12.2 Table 3 — 모션 예측 결과

![Table 3 Motion](figures/Table3_motion.png)

(Table 3, paper p.9)

### Step 1 — 표의 구조 이해

**축**:
- **세로 (rows)**: 11 개 모델.
  - 정렬: paper 가 **시간순** (오래된 → 최신).
  - 위 = deterministic RNN (ERD, acLSTM, 2015-2017).
  - 중간 = conditional VAE/GAN (MT-VAE, Pose-Knows, HP-GAN, 2017-2018).
  - 아래 = diversity-optimized (Best-Many, GMVAE, DeliGAN, DSP, 2018-2020).
  - DLow (2020) = 가장 최신 + 가장 강한 경쟁자.
  - **마지막 row = ProTran** (paper 의 모델, **bold**).
- **가로 (columns)**: 2 dataset × 2 metric = 4 columns.
  - Human3.6M ADE ↓
  - Human3.6M FDE ↓
  - HumanEva-I ADE ↓
  - HumanEva-I FDE ↓

### Step 2 — "↓" 화살표의 의미

**Lower is better** — 거리 metric 이므로 작을수록 좋음.

→ paper 가 명시적으로 ↓ 화살표로 표기 — confusion 방지.

### Step 3 — 값의 의미

- **단위**: meter (3D 좌표 공간의 거리).
- **Scale**: ~0.3 to ~0.9 — sub-meter 정확도.
- **Bold**: 각 column 의 best.

**구체 해석**:
- 0.381 ADE = "평균적으로 예측 자세가 정답에서 38.1cm 떨어짐".
- 0.491 FDE = "마지막 시점에서 49.1cm 떨어짐".
- 사람 자세의 scale (~1.7m) 대비 ~20-30% 오차.

### Step 4 — 어느 cell 이 가장 중요한가

**ProTran row 의 4 cell**:
- Human3.6M ADE: **0.381** (best, DLow 0.425 대비 10%)
- Human3.6M FDE: **0.491** (best, DLow 0.518 대비 5%)
- HumanEva-I ADE: 0.258 (DLow 0.251 < ProTran)
- HumanEva-I FDE: **0.255** (best, DLow 0.268 대비 5%)

→ **3/4 best, 1/4 close 2위** = paper 의 SOTA 주장 근거.

### Step 5 — Dataset 차이의 의미

**Human3.6M vs HumanEva-I**:
- Human3.6M = 3.6M frames, 7 subjects, 50Hz, 17 joints.
- HumanEva-I = 3 subjects, 60Hz, 15 joints — **훨씬 작은 dataset**.

**ProTran 이 큰 dataset 에서 더 강한 이유**:
- Capacity 활용 ($L=3$ layer + 풍부한 latent).
- 작은 dataset 은 overfitting 위험 — ProTran 의 capacity 가 활용 안 됨.
- → "데이터 많을수록 ProTran 의 강점" 패턴.

### Step 6 — ADE vs FDE 의 의미

- **ADE**: target 의 모든 시점에서 ground truth 와 closest sample 사이 L2 거리 평균.
- **FDE**: **마지막 시점만** 의 거리.

**왜 둘 다 측정하나**:
- ADE = 전체 trajectory 정확도.
- FDE = long-term 끝점 정확도 (오류 누적의 척도).
- 두 metric 의 trade-off 가능 (예: 모델이 중간만 잘 맞고 끝은 빗나갈 수 있음).
- ProTran 은 양쪽 모두 best — balanced.

### Step 7 — 100 samples 의 의미

paper 의 평가 방식:
- 모델이 100 stochastic sample 생성.
- 그 중 ground truth 와 **가장 가까운 sample** 의 거리를 ADE/FDE.

**왜 best-of-N 인가**:
- 사람 동작은 multi-modal (걷기, 멈추기, 방향 전환 등).
- 모델이 다양한 plausible future 중 하나라도 ground truth 근처라면 OK.
- Single sample 평가는 부당 (unfair to stochastic models).

### Step 8 — Variation 분석

각 column 의 best (bold) 와 worst 차이:
- Human3.6M ADE: best 0.381 (ProTran), worst 0.858 (HP-GAN) — **2.3배 차이**.
- HumanEva-I ADE: best 0.251 (DLow), worst 0.772 (HP-GAN) — **3배 차이**.

→ 모델 선택의 중요성. ProTran 은 worst 와 큰 격차 + best 와 동등 이상.

### Table 3 수치 정확히 복원

| Method | Human3.6M ADE↓ | Human3.6M FDE↓ | HumanEva-I ADE↓ | HumanEva-I FDE↓ |
|--------|---------------|---------------|----------------|----------------|
| ERD [32] | 0.722 | 0.969 | 0.382 | 0.461 |
| acLSTM [56] | 0.789 | 1.126 | 0.429 | 0.541 |
| MT-VAE [95] | 0.457 | 0.595 | 0.345 | 0.403 |
| Pose-Knows [87] | 0.461 | 0.560 | 0.269 | 0.296 |
| HP-GAN [6] | 0.858 | 0.867 | 0.772 | 0.749 |
| Best-Many [11] | 0.448 | 0.533 | 0.271 | 0.279 |
| GMVAE [25] | 0.461 | 0.555 | 0.305 | 0.345 |
| DeliGAN [38] | 0.483 | 0.534 | 0.306 | 0.322 |
| DSP [98] | 0.493 | 0.592 | 0.273 | 0.290 |
| DLow [97] | 0.425 | 0.518 | **0.251** | 0.268 |
| **ProTran (Ours)** | **0.381** | **0.491** | 0.258 | **0.255** |

→ 굵게 = best.

---

## 12.3 결과 풀이 — Dataset 별로 자세히

### ① Human3.6M ADE: ProTran 0.381 vs DLow 0.425

**계산**: (0.425 − 0.381) / 0.425 ≈ **10% 개선**.

**의미**:
- 가장 큰 dataset (3.6M frames) 에서 1등.
- DLow (이전 SOTA) 대비 10% 개선.
- ADE 가 평균 거리이므로 "전체적으로 더 잘 따라감".

### ② Human3.6M FDE: ProTran 0.491 vs DLow 0.518

**계산**: (0.518 − 0.491) / 0.518 ≈ **5% 개선**.

**의미**:
- 끝점 거리에서도 1등.
- 2초 예측의 마지막 시점 정확도.
- 비록 5% 만 개선이지만, long-term 예측에서 1등.

### ③ HumanEva-I ADE: DLow 0.251 vs ProTran 0.258

**계산**: ProTran 이 0.007 (2.7%) 뒤짐.

**의미**:
- **유일하게 ProTran 이 1등 아닌 cell**.
- 그러나 매우 작은 격차.
- HumanEva-I 는 작은 dataset (3 subjects 만) — overfitting 영향 가능.

### ④ HumanEva-I FDE: ProTran 0.255 vs DLow 0.268

**계산**: (0.268 − 0.255) / 0.268 ≈ **5% 개선**.

**의미**:
- 끝점에서는 1등.

### Best per cell 요약

| Cell | Best | Value | 2위 | 2위 값 |
|------|------|-------|-----|--------|
| Human3.6M ADE | **ProTran** | 0.381 | DLow 0.425 (10% gap) |
| Human3.6M FDE | **ProTran** | 0.491 | DLow 0.518 (5% gap) |
| HumanEva-I ADE | DLow | 0.251 | **ProTran** 0.258 (2.7% gap) |
| HumanEva-I FDE | **ProTran** | 0.255 | DLow 0.268 (5% gap) |

→ **3/4 cells best, 1/4 close 2위** = 사실상 압도적.

---

## 12.4 paper 의 honest 자기 평가

### 원문 (paper p.9)
> Table 3 shows that our models convincingly outperform all baselines based on both metrics ADE and FDE, with the gains significantly higher for the larger dataset Human3.6M. We emphasize that our favorable performance is evaluated using random samples, while the closest competitor, DLow [97], relies on a separate model for selecting samples to promote diversity, which can potentially be combined with our probabilistic transformer for further improvements.

### 풀어 설명 — 두 가지 주장

**주장 1: Human3.6M 에서 큰 차이**
- "gains significantly higher for the larger dataset Human3.6M".
- Human3.6M (3.6M frames) 에서 10% 차이.
- HumanEva-I (3 subjects) 에서는 작은 차이.
- → **데이터가 많을수록 ProTran 의 강점이 드러남** — capacity 활용.

**주장 2: ProTran 은 random samples, DLow 는 sample selection 사용**
- ProTran: 100 sample 을 그냥 random 으로 뽑음.
- DLow: 별도의 "diversity-promoting" 모델로 100 sample 을 골라서 뽑음.
- 즉 **DLow 는 평가 시점에 추가 trick 사용**, ProTran 은 raw.
- paper: "DLow 의 trick 을 ProTran 에 합치면 더 개선 가능" 시사.

### 왜 이 honest 평가가 중요한가

좋은 paper 의 표지:
- "우리가 모든 면에서 압도" 라 단정하지 않음.
- **공정한 비교 조건 명시** + 미래 개선 방향 제시.
- 이런 honest writing 이 신뢰성을 높임.

---

## 12.5 어떤 baseline 을 이긴 게 의미 있나

### 의미 있는 비교

**vs Deterministic RNN (ERD, acLSTM)**:
- Human3.6M ADE: ERD 0.722, acLSTM 0.789 → ProTran 0.381. **약 2배 개선**.
- 의미: 확률적 모델이 결정론적 모델 압도.

**vs Conditional VAE (MT-VAE, Pose-Knows)**:
- Human3.6M ADE: MT-VAE 0.457, Pose-Knows 0.461 → ProTran 0.381. **16-17% 개선**.
- 의미: **Global latent 보다 time-dependent + hierarchical latent 가 우수**.

**vs Conditional GAN (HP-GAN)**:
- Human3.6M ADE: HP-GAN 0.858 → ProTran 0.381. **55% 개선**.
- 의미: GAN 의 mode collapse 가 큰 약점 — VAE 정신이 더 적합.

**vs Diversity-optimized (Best-Many, GMVAE, DeliGAN, DSP)**:
- Human3.6M ADE: 0.448-0.493 → ProTran 0.381. **15-23% 개선**.
- 의미: ProTran 의 framework 가 diversity 도 자연스럽게 학습.

**vs DLow (가장 강한 경쟁자)**:
- 3/4 cells 에서 outright win, 1/4 에서 2.7% 뒤짐.
- 의미: **SOTA 와 동등 이상**, 더 큰 dataset 에서 더 강함.

---

## 12.6 Fig 3 — Pose Prediction 시각화

![Fig 3 Human poses](figures/Fig3_human_poses.png)

(Figure 3, paper p.9)

### 어떻게 읽는 그림인가

**구조**:
- **6 columns**: 6 종류의 동작 (Smoking, Walk Together, Phoning, Walking, Discussion, Walk Dog).
- **각 column 의 2 rows**:
  - **1행 (녹색)**: ground truth (실제 동작).
  - **2행 (빨강)**: ProTran 의 예측.
- **색의 진하기**: 시간 진행을 표현.
  - **흐린 색 (faded)**: 과거 시점.
  - **진한 색 (solid)**: 미래 시점.

paper caption:
> Ground-truth pose sequences (first row) and corresponding predictions by ProTran (second row). Solid colors indicate later time-steps and faded ones are older. The body-part movements in the predicted and ground-truth poses resemble similar patterns, while certain variations are retained.

### 무엇을 보아야 하나

**관찰 1: 자세 모양의 유사성**:
- 각 동작에 대해 ground truth (녹색) 와 예측 (빨강) 의 **윤곽이 비슷**.
- 6 activity 모두 일관된 동작 표현.

**관찰 2: 시간 흐름의 자연스러움**:
- 흐린 색 → 진한 색 의 전환이 자연스럽게 흘러감.
- 즉 **모션이 일관된 dynamics** 로 진행됨.
- 갑작스런 자세 변화 없음 — 학습된 motion prior 가 유효.

**관찰 3: 약간의 variation**:
- ground truth 와 예측이 **완전히 같지는 않음**.
- 약간의 자세 차이 있음.
- paper caption: "while certain variations are retained" — 의도된 다양성.

### Activity 별 자세한 분석

#### Column 1: Smoking
- 동작: 한 손이 입 근처로 반복 이동 (담배 들기).
- 핵심 신호: **손목·팔꿈치 관절의 좁은 영역 내 반복 운동**.
- ProTran 의 예측: 손이 입 근처 영역 유지 — 핵심 패턴 학습.
- 어려운 점: 미세한 손 동작 (정확한 손가락 위치) — pose-level 평가에서는 OK.

#### Column 2: Walk Together
- 동작: 걷는 보행자, 다른 사람과 함께 (interaction).
- 핵심 신호: **두 발의 alternating 패턴 + 팔 swing**.
- ProTran 의 예측: 걷는 cycle 자연스러움.
- 어려운 점: 다른 사람과의 spatial relationship (이건 single-person setup 으로 처리).

#### Column 3: Phoning
- 동작: 한 손이 귀 근처에 유지 (통화).
- 핵심 신호: **한 쪽 팔의 정적 자세 + 다른 쪽의 자연 swing**.
- ProTran 의 예측: 한 쪽 팔의 안정성 학습.
- 어려운 점: 두 팔의 asymmetric 동작.

#### Column 4: Walking
- 동작: 보행 (단순 걷기).
- 핵심 신호: **반복적 cyclical motion**.
- ProTran 의 예측: 가장 깔끔한 예측 — 가장 단순한 동작.
- 어려운 점: 적음. Baseline 으로서의 동작.

#### Column 5: Discussion
- 동작: 손 제스처, 몸 회전 등 다양한 자세.
- 핵심 신호: **상체의 다양한 움직임**.
- ProTran 의 예측: 복잡한 패턴 학습.
- 어려운 점: 높은 stochasticity — 같은 시작에서도 매우 다양한 미래.

#### Column 6: Walk Dog
- 동작: 걷기 + 한쪽 손이 줄 잡기 (asymmetric).
- 핵심 신호: **보행 + 한 손의 특수 자세 + 가끔 줄 당김**.
- ProTran 의 예측: 양쪽 동작의 분리 학습.
- 어려운 점: 비정형적 동작 (dog 의 movement 에 따라 변동).

### 시간 진행 (faded → solid) 의 의미

paper caption:
> Solid colors indicate later time-steps and faded ones are older.

**시각화의 trick**:
- 한 panel 안에 multiple time frames 를 겹쳐 그림.
- 흐린 색 = 과거 (faded).
- 진한 색 = 미래 (solid).
- 한 자세가 아니라 **trajectory** 를 한 그림에 보여줌.

**왜 이렇게 보여주나**:
- 정적 자세보다 dynamics 가 핵심.
- 시간 흐름을 시각적으로 명확히.
- 동작의 자연성 평가 가능.

### Fig 3 가 보여주는 핵심 메시지

1. **Dynamics 학습**: 자세의 변화 (예: 걷기의 다리 cycle) 자연스러움.
2. **Activity 다양성**: 6 종류 동작 모두 학습.
3. **Stochasticity**: variation 존재 — multi-modal output.
4. **Pose-level accuracy**: 큰 관절 위치 정확 (small detail 무시).

→ ProTran 의 framework 가 인간 동작의 본질적 dynamics 잡음.

### paper 의 해석

paper p.9:
> We show in Figure 3 human pose predictions made by our model that are most similar to the corresponding ground truths among a collection of such stochastic predictions. The similarities between the body-part movements in both sequences suggest that our model has been able to capture the temporal dynamics quite well.

**풀어 설명**:
- 100 sample 중 ground truth 와 가장 가까운 것 을 보여줌 (best-of-N).
- 비슷한 동작 패턴이 나옴 → **temporal dynamics 학습 잘 됨**.
- 다만 **완전히 같지는 않음** — stochastic 모델의 자연스러운 결과.

### 왜 stochastic 이 중요한가 (Fig 3 가 시사)

**Deterministic 모델의 한계** (가상의 결정론적 모델이라면):
- 같은 입력에서 항상 같은 출력.
- 사람의 미래 동작이 진짜 한 개로 정해진다고 가정 — 비현실적.

**Stochastic 모델 (ProTran)**:
- 같은 입력에서 매번 다른 sample.
- 100개 sample 중 ground truth 에 가까운 것 존재.
- → **multiple plausible futures** 를 학습.

Fig 3 는 그 중 가장 가까운 sample 을 보여준 것. 다른 sample 들은 "걸음 속도가 약간 다르거나, 방향이 약간 다른" 그럴 듯한 변형들.

---

## 12.7 Random Samples 의 의미 — paper 가 강조하는 점

### 원문 재인용
> We emphasize that our favorable performance is evaluated using random samples, while the closest competitor, DLow [97], relies on a separate model for selecting samples to promote diversity, which can potentially be combined with our probabilistic transformer for further improvements.

### 풀어 설명

**평가 방식의 차이**:

| 모델 | Sample 생성 방식 | 평가 시 |
|------|---------------|--------|
| ProTran | **100 random samples** | 그 중 ground truth 와 가장 가까운 것 |
| DLow | Diversity-promoting model 이 100 sample 선택 | 그 중 가장 가까운 것 |

**왜 이게 중요한가**:
- ProTran 은 "raw" 모델만 사용.
- DLow 는 "raw + diversity selection trick" 사용.
- 그럼에도 ProTran 이 3/4 cells 에서 이김.

→ ProTran 의 기본 architecture 가 강하다는 의미.

**미래 가능성**:
- DLow 의 diversity selection trick 을 ProTran 과 결합하면 더 좋아질 수 있음.
- paper 가 honest 하게 명시: "can potentially be combined for further improvements".

---

## 12.8 Motion vs Forecasting — 통합

### 두 task 의 ProTran 결과 요약

| 측면 | 시계열 (Section 5.1) | 모션 (Section 5.2) |
|------|-------------------|------------------|
| Best ratio | 4/5 outright, 1/5 tie | 3/4 outright, 1/4 close 2위 |
| Metric | CRPS_sum (분포) | ADE / FDE (거리) |
| Sample 수 | 100 | 100 |
| Layers | 1~2 | 2~3 |
| Best 비교 모델 | TimeGrad (NeurIPS 2021) | DLow (CVPR 2020) |

### 두 task 모두에서 강함이 의미하는 것

**Task-agnostic framework 의 증명**:
- 시계열 (재무·산업 데이터) 과 모션 (그래픽스·로보틱스) 은 학계가 완전히 분리.
- 그러나 본질적으로 같은 conditional prediction 문제.
- ProTran 의 framework 가 **둘 다 SOTA** = **본질적 generality**.

**다른 가능한 응용**:
- Speech generation
- EEG signal modeling
- Autonomous driving trajectory
- Financial volatility forecasting
- Disease progression

→ 같은 framework 가 transfer 가능.

---

## 12.9 핵심 baseline 별 약점 분석 — 왜 ProTran 이 이긴 이유

### vs ERD / acLSTM (Deterministic RNN)
- Human3.6M ADE: ERD 0.722, acLSTM 0.789 → ProTran 0.381 = **약 2배 개선**.
- 두 모델 모두 **결정론적** — single prediction per input.
- 사람의 미래 동작은 multiple plausible — 한 예측만 학습하면 불가능 양상의 평균에 갇힘.
- → Stochastic prediction = ProTran 의 결정적 장점.

### vs MT-VAE (Conditional VAE, global latent)
- Human3.6M ADE: MT-VAE 0.457 → ProTran 0.381 = **17% 개선**.
- MT-VAE 는 **global latent** — 전체 sequence 에 한 개 잠재.
- 시점별 dynamics 표현 부족.
- → Time-dependent latent = ProTran 의 차별.

### vs Pose-Knows (Conditional VAE)
- Human3.6M ADE: Pose-Knows 0.461 → ProTran 0.381 = **17% 개선**.
- 같은 conditional VAE 정신, global latent.
- 한계 같음.

### vs HP-GAN (Conditional GAN)
- Human3.6M ADE: HP-GAN 0.858 → ProTran 0.381 = **55% 개선**.
- GAN 의 mode collapse — 다양한 plausible 동작 중 일부만 학습.
- VAE 정신 (KL term 으로 latent 다양성 강제) 이 GAN 보다 적합.
- → ProTran 의 stochastic latent 가 mode 다양성 자연 학습.

### vs Best-Many / GMVAE / DeliGAN / DSP (Diversity-optimized)
- Human3.6M ADE: 0.448-0.493 → ProTran 0.381 = **15-23% 개선**.
- 이 모델들은 **heuristic** 으로 diversity 최적화.
- ProTran 은 framework 자체가 diversity 자연 학습 (잠재 분포).
- → Principled framework 가 heuristic 보다 우수.

### vs DLow (가장 강한 경쟁)
- Human3.6M: DLow 0.425/0.518 → ProTran 0.381/0.491 = **10%/5% 개선**.
- HumanEva-I ADE: DLow 0.251 < ProTran 0.258 (DLow 약간 우수).
- DLow 는 **별도 diversity-promoting model** 로 sample 선택 — extra trick.
- ProTran 은 raw 모델만 — fair comparison.
- → Trick 없이도 거의 동등 → ProTran 의 기본 architecture 가 강함.

### 결론 — ProTran 이 모션에서 이긴 4 가지 이유

1. **Stochastic latent**: vs deterministic (ERD, acLSTM) — multiple plausible 학습.
2. **Time-dependent latent**: vs global latent (MT-VAE) — 시점별 dynamics.
3. **Variational framework**: vs GAN — mode collapse 회피.
4. **Hierarchical (L=3)**: vs single global — multi-scale temporal pattern.

→ Multivariate forecasting 의 성공 이유 (11.10) 와 본질적으로 같은 정신.

---

## 12.10 결과의 실무적 함의

### 산업 응용

**Computer Animation / 게임**:
- ProTran 의 stochastic 예측 → NPC 동작의 다양성.
- 같은 시작 자세에서도 매번 다른 동작 → 더 자연스러운 캐릭터.

**Robotics (협업 로봇)**:
- 사람과 같이 작업하는 로봇이 사람의 다음 동작 예측 필요.
- Multiple plausible → 다양한 가능성 대비.
- 안전성 ↑.

**Autonomous driving**:
- 보행자/cyclist 의 trajectory 예측.
- "이 사람이 좌회전할까 우회전할까" — multiple plausible 필요.
- ProTran framework 가 그대로 transfer 가능.

**Healthcare (재활 모니터링)**:
- 환자의 움직임 패턴 학습 → 정상 vs 비정상 동작 감지.
- Probabilistic = "이 동작이 환자의 정상 분포에서 벗어났을 확률" 정량화.

### 시계열 vs 모션 의 통합 framework 가치

paper 의 가장 큰 의의: **하나의 architecture 가 두 분야 SOTA**.

| 분야 | 학계 | 표준 도구 |
|------|------|---------|
| 시계열 forecasting | 통계학 / ML | ARIMA, DeepAR |
| 모션 prediction | 컴퓨터비전 | CVAE, GAN |

→ ProTran 이 둘을 통합 → **분야 간 architectural pattern 의 transfer 가능성**.

응용 확장:
- Speech generation (audio frame sequence)
- EEG (brain activity sequence)
- Financial volatility (asset return sequence)
- Disease progression (patient state sequence)

→ 모두 "conditional probabilistic sequence prediction" 의 instance.

---

## 12.11 자기점검 (이 챕터)

### 핵심 5가지
1. **Fig 3 의 녹색 자세와 빨간 자세가 완전히 같지 않은 것의 의미는?**
2. **ADE 와 FDE 의 차이를 한 줄로?**
3. **ProTran 이 HumanEva-I 보다 Human3.6M 에서 더 큰 격차로 이긴 이유는?**
4. **왜 DLow 가 HumanEva-I ADE 만 ProTran 보다 약간 우수했나?**
5. **ProTran 의 framework 가 다른 어떤 분야로 transfer 가능한가?**

### 답변
1. ProTran 이 stochastic 모델이라 매번 다른 sample 생성. Fig 3 는 100 sample 중 ground truth 와 가장 가까운 것을 보여줌. 완전히 같지 않은 것은 **자연스럽고 의도된 결과** — 사람의 미래 동작은 본질적으로 multiple plausible 이므로 약간씩 다른 sample 들이 모두 그럴듯한 미래.
2. ADE = 모든 시점의 거리 평균 (전체적으로 잘 따라가나). FDE = 마지막 시점에서만의 거리 (장기 끝점이 얼마나 정확한가). 둘 다 lower = better.
3. Human3.6M 이 훨씬 큰 dataset (3.6M frames vs HumanEva-I 의 3 subjects). 데이터가 많을수록 ProTran 의 capacity (특히 3-layer hierarchical latents) 가 활용됨. 작은 dataset (HumanEva-I) 에서는 overfitting 위험으로 큰 모델의 장점이 줄어듦.
4. DLow 는 **별도 diversity-promoting model** 로 sample 선택 — 평가 시 추가 trick. ProTran 은 100 random samples 그대로 사용 — fair comparison. HumanEva-I 가 작은 dataset 이라 DLow 의 sample selection trick 이 의미 있음. ProTran 의 trick 결합 시 더 좋아질 가능성 (paper 명시).
5. **Speech generation** (음성 frame), **EEG modeling** (뇌파 채널), **Autonomous driving** (보행자 trajectory), **Financial volatility** (자산 수익률 sequence), **Disease progression** (환자 상태 변수). 모두 "conditional probabilistic sequence prediction" 의 instance.

---

## 인터랙티브 시각화

```viz:pt-motion-table3:title=paper Table 3 — Motion Prediction ADE / FDE (interactive),caption=Dataset 토글 (Human3.6M / HumanEva-I) + Metric 토글 (ADE / FDE). 11 models 비교. ProTran 이 Human3.6M 양쪽 + HumanEva-I FDE 에서 best. HumanEva-I ADE 만 DLow 가 0.251 with ProTran 0.258 직후.
```

다음 [13_conclusion.md](13_conclusion.md) 에서 **결론 + 한계 + ProTran 이 시계열 분야에 남긴 영향**.
