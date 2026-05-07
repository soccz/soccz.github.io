# 8. 내 연구와의 연결

> 일반론 금지. 사용자의 *active 두 track* (APF + Grokking) 에 어떤 수식 / 발상 / 측정 도구를 *어떤 섹션* 에 *어떤 문장 형태* 로 흡수할지를 구체로 명시.

## 8.1 Grokking active track 과의 연결 (직접 — § Primary)

### 8.1.A 흡수할 기법: Progress measure 의 *TS Transformer 이식*

**원본**: Nanda 의 $\mathcal{L}_{\text{res}}$, $\mathcal{L}_{\text{exc}}$, Gini-on-Fourier — 모두 *modular addition* 의 cyclic group character 위에서 정의.

**이식 방법**: 사용자의 P2 logistic 4-layer 실험에서, *logistic map* $x_{t+1} = r x_t (1-x_t)$ 의 동학을 학습한 transformer 에서 다음 변형 measure 정의:

1. **Restricted loss for periodic regime**: logistic map 이 $r < 3.57$ (chaos 임계값) 에서 *periodic orbit* (period $2^n$) 을 가짐. 학습된 transformer 의 output 을 *period 의 Fourier component* 로 projection. 이 restricted loss 가 학습 중 단조 감소하는지 측정.
2. **Excluded loss for chaos regime**: $r > 3.57$ 의 chaotic regime 에서는 spectrum 이 broadband. *low-frequency component 만* projection 한 excluded loss 측정 — chaos regime 에서 모델이 high-frequency 정보를 사용하는 양상 추적.
3. **Gini on Fourier-decomposed weight matrices**: 학습된 transformer 의 $W_E$ 및 attention $W_Q, W_K$ 의 *temporal axis 의 Fourier 분해* 의 Gini.

**구체 인용 위치**: `Grokking in Time Series Transformers/PAPER_DRAFT.md` 의 §3.2 (Method) 에 다음 형태로 인용:

> "Nanda et al. (2023) define three progress measures for tracking circuit formation in algorithmic transformers: restricted loss, excluded loss, and Gini coefficient of Fourier components. We adapt these to the time-series setting by replacing the modular-arithmetic character basis with the *spectral basis of the underlying dynamical system*. For the logistic map regime $r < 3.57$, this is the dyadic period basis $\{\cos(2\pi k t / 2^n)\}_{k}$; for the chaotic regime, this is the empirical spectrogram support set."

### 8.1.B 충돌/경쟁 지점: Non-stationarity 가 *fixed K* 가정을 깬다

본 논문의 progress measure 는 *학습 종료 후 fixed K* 를 input 으로 받는다. TS forecasting 에서 *non-stationarity* (regime shift) 가 들어오면, 회로가 *시간에 따라* 다른 frequency 를 사용할 수 있다. 즉:

- 본 논문 frame: $K$ 는 static, learning trajectory 의 axis.
- 사용자 frame: $K(t)$ — 시간 의존, 또는 regime 의존.

**해결 방향**: 사용자 paper 에서 "windowed progress measure" 를 정의 — moving window 위에서 $K_t$ 를 추정하고 그 위에 restricted/excluded loss 를 정의. 이게 *Nanda 의 단순 복제가 아닌 사용자 contribution*.

**인용 문장**:
> "Unlike Nanda et al. (2023) where the key-frequency set $K$ is post-hoc fixed across the entire trajectory, time-series transformers operating on non-stationary data exhibit *regime-conditional circuits* — we propose a windowed variant $K_t$ estimated on a sliding window, and demonstrate that the cleanup-phase asymmetry survives this generalization."

### 8.1.C 인용 포인트: Grokking track 의 *척추 인용*

Grokking track 의 22 must-cite 중 본 논문은:
- **Theory section**: progress measure 정의 인용.
- **Method section**: circuit hypothesis 의 *post-hoc 사후 검증* 방법론.
- **Discussion section**: 본 논문의 한계 (algorithmic-only) 를 사용자 contribution 의 *gap* 으로 강조.

### 8.1.D 반면교사: 본 논문이 못 한 *online* 회로 발견

본 논문은 *학습 종료 후* 회로 분석 → progress measure 적용. Online (학습 진행 중) 회로 발견은 ACDC (Conmy 2023) 의 영역. 사용자가 *online* 측정 (학습 동안 진행도 추정) 을 contribution 으로 하면 Nanda 위에 한 단계.

---

## 8.2 APF active track 과의 연결 (간접 — § Secondary)

### 8.2.A 흡수할 기법: Motif progress measure as Fourier analog

**원본 idea**: Nanda 가 *Fourier sparsity* 로 회로 진행도를 측정.

**APF 이식**: APF 의 *motif* (diagonal, stripe, block, edge, spike, checker) 도 attention pattern 의 *2D 도메인 위 sparse representation*. 즉:

- Diagonal motif → 2D Fourier 의 diagonal stripe peak (single frequency on the diagonal).
- Stripe motif → axis-aligned frequency.
- Block motif → low-frequency rectangular envelope.
- Spike motif → broadband impulse.

각 motif 가 *2D Fourier basis 의 sparse component* 라면, Nanda 의 Gini 측정을 APF 의 *motif progress measure* 로 직접 이식 가능.

**구체 인용 위치**: APF 의 `attention pattern field motif sweep` 실험에서, 학습 동안 attention pattern 의 2D Fourier 분해의 Gini 를 매 step 측정. *언제 motif 가 형성됐는지* 의 quantitative timeline 이 만들어짐.

**인용 문장 (APF paper draft 의 §4.3)**:
> "Following Nanda et al. (2023), who use the Gini coefficient of Fourier components as a progress measure for circuit formation in algorithmic transformers, we adapt the same measure to the 2D attention pattern: at each training step, we compute the 2D Fourier transform of the attention matrix and measure the Gini of squared Fourier coefficients. This provides a *task-agnostic motif-formation timeline* applicable across PE choices (NoPE, RoPE, ALiBi)."

### 8.2.B 충돌 지점: Attention pattern 은 *softmax* 출력 — Fourier 분해의 normalization 문제

Nanda 의 weight matrix Fourier 분해는 unnormalized weight 위에서 작동. APF 의 attention pattern 은 *softmax 후 row-stochastic* 이라 Fourier component 의 의미가 다름. 

해결: log-attention (logit 단계, softmax 전) 의 Fourier 분해를 측정. 이는 본 논문의 logit-based restricted/excluded loss 와 더 정렬됨.

### 8.2.C APF 의 motif causality 실험에서의 활용

APF 가 motif → CNN probe → causal intervention 의 framework. Nanda 의 *causal intervention* 부분 (frequency ablation) 이 APF 의 *motif ablation* 과 메커니즘적으로 동형. 

APF paper 의 *related work* 섹션:
> "Nanda et al. (2023) demonstrated that ablating non-key Fourier components of an algorithmic transformer preserves task performance, while ablating key components destroys it — providing causal evidence for the discovered circuit. We perform an analogous causal experiment in the attention-pattern domain: ablating non-motif components of the 2D attention map (zeroing out non-stripe / non-diagonal frequencies) is shown to preserve forecasting accuracy, while ablating the motif itself collapses generalization."

---

## 8.3 *교차* 연결: APF + Grokking 동시 활용

본 논문이 *유일하게* 두 track 모두에 핵심으로 들어오는 이유:

| Track | Nanda 의 어디 |
|---|---|
| Grokking | progress measure (3종) — *학습 동학* 측정 |
| APF | causal intervention (frequency ablation) — *공간적 회로* 검증 |

이 두 axis 를 *결합* 한 사용자 paper 가능 — "PE 선택이 attention motif 형성 dynamics 에 어떻게 영향을 주는가" 를 Nanda-style progress measure (시간 axis) + APF-style motif causality (공간 axis) 로 합쳐 측정. 이는 *현재 어떤 paper 도 안 한* 영역. (지도교수 결정 후 두 track 통합 시 paper 1의 backbone 가능.)

---

## 8.4 *전이 가능성만 있는* 약한 연결 (정직한 표시)

- **Paper 1 (ProTran-TFA)**: probabilistic / quantile forecasting 위주. Nanda 의 회로 분석은 *deterministic* — 직접 연결 약함. *전이 가능성만*: probabilistic transformer 의 attention head 가 distributional regime detection 회로를 가질 수 있다는 가설 — 이건 사용자 paper 가 *처음으로* 다룰 영역.
- **금융 응용 (factor / momentum)**: Nanda 본 논문과 거의 직접 연결 없음. 다만 *grokking 이 finance ML 에서도 일어나는가* 라는 question 이 가능하지만, 본 사용자 두 main track 의 *원거리 axis*. — 금요일 버킷에 들어가는 *separate* 라인.

---

## 8.5 한 줄 종합

본 논문은 사용자의 *Grokking track 척추* 이고, *APF track 의 motif progress measure 의 원형* 이다. 두 track 모두에서 직접 인용 + 직접 흡수 + 직접 한계 차별화 가능. *연결 강도* 로 보면 본 해체에서 다룬 모든 paper 중 **최상위**.
