# 13. 결론과 의의 — Section 6 풀이

## 📌 이 챕터 다 읽으면 알 수 있는 것

- 본 논문의 5 ML design principles
- 한계 — O(T²) attention complexity
- Sparse Transformer 결합 가능성
- 후속 paper (TimeGrad, CSDI) 와의 관계

---

paper p.9-10 (Section 6). 짧은 결론과 솔직한 한계 명시.

이 챕터의 목표: **paper 가 자신을 어떻게 평가하고, 무엇이 한계이고, 어떻게 발전 가능한지** 풀어 쓴다.

---

## 13.1 원문 — Conclusion

### paper p.9-10
> In this work, we have introduced generative models for multivariate time series that combines strengths of state space models and transformer architectures. In contrast to previous work, our models do not rely on recurrent neural networks but make extensive use of attention mechanism. We also extend our models to include hierarchical latent variables, inspired by recent developments of VAEs for non-sequential data [17, 83]. Empirical experiments show that our models perform remarkably well on time series forecasting and human motion prediction.

(4 문장)

### 한국어 직역
> 본 연구에서 다변량 시계열을 위한 generative model 을 제안 — SSM 과 Transformer 의 장점 결합. 기존 연구와 대조적으로, 우리 모델은 RNN 에 의존하지 않고 attention 메커니즘을 광범위 활용. Hierarchical latent variable 로 확장 — non-sequential 데이터의 VAE 발전에서 영감. 시계열 forecasting + human motion prediction 양쪽 모두 우수한 성능.

### 4 문장 = 4 메시지

| # | 메시지 | 본 deep dive 의 어느 챕터에서 다뤘나 |
|---|------|----------------------------------|
| 1 | SSM + Transformer 결합의 새 generative model | 03, 06, 07 |
| 2 | RNN 완전 거부 (attention 만) | 03, 05 |
| 3 | Hierarchical latent 확장 | 08 |
| 4 | 시계열 + 모션 양쪽 SOTA | 11, 12 |

→ 결론이 4 문장으로 짧지만, 각 문장이 한 챕터씩 대응. 깔끔.

---

## 13.2 한계 (Limitations) — paper 의 솔직한 명시

### 원문 (paper p.10)
> Our models do not come without limitations, however. As in other transformer-based approaches, the reliance on attention incurs a quadratic time and memory complexity. While we do not find it problematic in our experiments, the limitation necessarily hinders applications of our models in tasks characterized by long-term dependencies such as language modelling or music generation [36].

### 풀어 설명 — 핵심 한계

**한계 1: $\mathcal{O}(T^2)$ 복잡도**
- Self-attention 의 표준 약점.
- 시간 + 메모리 모두 sequence 길이 $T$ 의 제곱.

**구체적 영향**:

| 영역 | Sequence 길이 $T$ | 적용 가능성 |
|------|-----------------|---------|
| 시계열 forecasting | ~수백 시점 | ✓ (paper 의 실험) |
| 모션 prediction | ~100 frames | ✓ |
| **NLP language modeling** | 수만 토큰 | ✗ (메모리 부담) |
| **음악 생성** | 수만 timesteps | ✗ |

→ paper 가 인정: "NLP, 음악 같은 long-term 분야에서는 어려움".

### 해결 가능성

paper 인용:
> Fortunately, recent work on sparse transformer [9, 18, 50, 55] can potentially address the issue, and we leave such an investigation for future work.

**sparse transformer 계열**:
- **Sparse Transformer** (Child 2019) — attention 을 일부 패턴만.
- **Longformer** (Beltagy 2020) — local + global attention.
- **Reformer** (Kitaev 2020) — LSH 기반 sparse.
- **Informer** (Zhou 2021) — ProbSparse attention.
- **BigBird** (Zaheer 2020) — sparse + random + global.

→ ProTran 의 attention 을 sparse 로 바꾸면 $\mathcal{O}(T \log T)$ 또는 $\mathcal{O}(T)$ 가능.
→ paper 는 "미래 연구" 로 남김.

---

## 13.3 Broader Impact — 사회적 영향

### 원문 (paper p.10)
> Probabilistic time series forecasting is a fundamental research problem with wide-ranging applications in society. Although we have not explored healthcare applications of our work, previously proposed methods with similar formulations have demonstrated potentials of forecasting techniques [1, 81] in diagnoses or disease control.

### 풀어 설명

**언급된 응용**: Healthcare.
- 진단 (diagnoses).
- 질병 통제 (disease control).
- 환자 상태 예측.

**관련 선행 연구**:
- [1] Alaa-van der Schaar 2019 — Attentive SSM, 본 paper 의 attentive SSM 정신의 연속.
- [81] disease forecasting (방향성 표시).

**왜 healthcare 가 좋은 응용인가**:
- 환자별 시계열 (생체 신호, 처방, 검사 결과).
- 다양한 시점에서 불확실성 표현 필요.
- ProTran 의 probabilistic forecasting 정확히 맞음.

---

## 13.4 본 paper 의 한 줄 메시지

paper 가 명시적으로 말하지는 않지만, 4 문장 결론 + 한계 + broader impact 를 합치면:

> **"SSM 의 확률성과 Transformer 의 표현력을 RNN 없이 결합한 새 시계열 generative framework. Hierarchical 확장으로 capacity 까지 scale. 시계열 + 모션 양쪽 SOTA. NLP 처럼 매우 긴 sequence 가 아니라면 즉시 사용 가능."**

---

## 13.5 5 가지 ML 디자인 원칙 — 본 paper 가 가르치는 것

본 deep dive 의 해석으로, ProTran 이 시사하는 5 가지 디자인 원칙:

### 1. Latent attention > Observation attention

표준 Transformer 는 관측 $x$ 에 attention. ProTran 은 **잠재 $z$ 에 attention**.
- 관측 = 노이즈 많은 raw — attention 이 노이즈 전파 위험.
- 잠재 = 정제된 추상 상태 — attention 이 의미 있는 관계 추출.

→ "어디에 attention 을 거는가" 가 architecture 의 핵심.

### 2. Non-autoregressive 가 가능한 영역

NLP 의 autoregressive 가 표준이지만, 시계열 generative 에서는 **non-autoregressive** 가 가능.
- Latent 공간에서 한 번에 결정 → 전체 sequence emit.
- Error accumulation 없음.

→ 분야마다 적합한 generation 방식이 다름.

### 3. Hierarchical latents = depth scaling

VAE 의 hierarchy 가 이미지 (VDVAE, NVAE) 에서 성공.
ProTran 이 같은 정신을 시계열에 transfer.
- Layer 1 = 미세 패턴
- Layer L = 추상 trend

→ Capacity scaling 의 일반 원칙.

### 4. Smoothing > Filtering

표준 RNN 은 unidirectional filtering. ProTran 은 attention 으로 **bidirectional smoothing**.
- 학습 시 미래 관측 활용 → 더 정확한 posterior.
- KL minimization 으로 prior 가 따라감.

→ BERT 의 bidirectional 정신과 같음. 2018-2019 의 NLP advances 가 시계열에 도착.

### 5. Task-agnostic framework

같은 architecture 가 시계열 + 모션 양쪽 SOTA.
- **Conditional prediction problem** 의 general framework.
- Speech, EEG, finance 등 transfer 가능.

→ "한 분야 한 모델" 의 시대를 넘어 "general framework" 의 시대.

---

## 13.6 같은 시기 NeurIPS 2021 시계열 paper 와의 비교

NeurIPS 2021 은 시계열 분야의 **Cambrian explosion** 의 해:

| Paper | 핵심 contribution | Output | 정신 |
|-------|----------------|--------|------|
| **Autoformer** (Wu et al.) | Auto-Correlation + 분해 inner block | 점 | Representation |
| **Informer** (Zhou et al.) | ProbSparse attention | 점 | Efficiency |
| **ProTran** (이 paper) | **SSM + attention, 확률 잠재** | **분포** | **Probabilistic latent** |
| **TimeGrad** (Rasul et al.) | Diffusion 도입 | 분포 | Generative |
| **CSDI** (Tashiro et al.) | Score-based diffusion | 분포 | Generative |

→ 각자 다른 axis 의 contribution. ProTran 의 unique axis = **확률 잠재**.

### 후속 영향

ProTran 이 가능하게 한 후속 연구:

| 후속 모델 | 출처 | ProTran 과의 관계 |
|---------|------|-----------------|
| **TimeGrad** | Rasul 2021 | Diffusion 으로 ProTran 의 stochastic latent 대체 |
| **CSDI** | Tashiro 2021 | Conditional score-based generation |
| **TMDM** | Li 2024 | Transformer-modulated diffusion |
| **Diffusion-TS** | Yuan 2024 | Full diffusion for time series |

→ ProTran 이 **시계열 probabilistic generative model 의 출발점 중 하나**. 이후 diffusion 으로 진화.

---

## 13.7 ProTran 의 spiritual lineage

```
        SSM (Kalman 1960, LDS)
              ↓
        Deep SSM (KVAE, VRNN, DKS, 2015-2019)
              ↓
        [한계: Markov + RNN]
              ↓
        Transformer (Vaswani 2017)
              ↓
   ┌──────────────────────────────────┐
   │   ProTran (이 paper, 2021)      │
   │   = SSM × Transformer × VAE     │
   └──────────────────────────────────┘
              ↓
        TimeGrad / CSDI / TMDM (2021-2024)
              ↓
        Diffusion-based 시계열 모델 시대
```

→ ProTran 은 **SSM 시대의 끝 + Diffusion 시대의 시작** 의 다리.

---

## 13.8 가장 honest 한 평가 — paper 의 약점도 짚자

### 약점 1: Wikipedia 와 Electricity 에서 marginal

- Table 1 에서 ProTran 이 outright best 가 아닌 두 경우.
- "all best" 라 단정하기 어려움.
- paper 도 honest 명시.

### 약점 2: $\mathcal{O}(T^2)$ 복잡도

- NLP, 음악 등 매우 긴 sequence 에는 부담.
- Sparse 변형 없이는 사용 어려움.

### 약점 3: Sequence-internal latent dynamics 가 recursive

- Multi-step latent 생성이 recursive (Eq 6-9 가 매 $t$ 마다 순차).
- 완전한 parallel 안 됨 — Transformer 의 parallel 장점 일부 손실.

### 약점 4: Inference 와 generation 의 architectural overhead

- Eq 10 의 추가 attention + Eq 11 의 concat → 추가 파라미터.
- Memory 와 computation 약간 증가.

### 종합 — 그럼에도 왜 의미 있나

위 약점들에도 불구하고:
- **확률 잠재 + Transformer** 의 첫 본격 시계열 적용.
- 같은 framework 로 두 분야 SOTA.
- 후속 diffusion 시계열의 정신적 시조.

→ 약점은 incremental 한 future work 의 여지로 남고, 본 paper 의 contribution 은 paradigm shift.

---

## 13.9 핵심 수치로 보는 paper 의 contribution

paper 의 contribution 을 정량적 숫자로 정리:

### 시계열 forecasting (Table 1)

| 측면 | 수치 |
|------|------|
| Best ratio | **4/5 outright, 1/5 tie** |
| Solar 개선 (vs TimeGrad) | **32%** (0.287 → 0.194) |
| Traffic 개선 (vs TimeGrad) | **36%** (0.044 → 0.028) |
| Taxi 개선 (vs TimeGrad) | **26%** (0.114 → 0.084) |
| Wikipedia 개선 (vs TimeGrad) | 4% (0.049 → 0.047) |
| Electricity | tie with NKF at 0.016 |

### 모션 prediction (Table 3)

| 측면 | 수치 |
|------|------|
| Best ratio | **3/4 outright, 1/4 close 2위** |
| Human3.6M ADE 개선 (vs DLow) | **10%** (0.425 → 0.381) |
| Human3.6M FDE 개선 (vs DLow) | 5% (0.518 → 0.491) |
| HumanEva-I FDE 개선 (vs DLow) | 5% (0.268 → 0.255) |
| HumanEva-I ADE | DLow 0.251 > ProTran 0.258 |

### Ablation (Table 2, Traffic)

| Component 제거 | 악화율 (B 대비) |
|------------|------------|
| Multi-layer | +11% (0.028 → 0.031) |
| Context attention | +6% (0.031 → 0.033) |
| **Stochastic latent** | **+32%** (0.031 → 0.041) — 가장 중요 |

### Architecture 디테일

| 측면 | 값 |
|------|----|
| Attention heads | 8 |
| MLP layers | 2 |
| $d_{model}$ ($w$ dim) | 128 |
| $d_{latent}$ ($z$ dim) | 16 |
| Layers $L$ | 1-3 (dataset dependent) |
| Test samples | 100 |
| Time complexity | $O(LT^2 d)$ |
| Memory complexity | $O(T^2 d)$ |

### 비교 baselines

| 분야 | Baselines 수 |
|------|----------|
| 시계열 | 11 (VES, VAR, GARCH, DeepAR, GP-Copula, LSTM-Copula, KVAE, NKF, Transformer-MAF, TimeGrad, VAR-Lasso) |
| 모션 | 9 (ERD, acLSTM, MT-VAE, Pose-Knows, HP-GAN, Best-Many, GMVAE, DeliGAN, DSP) + DLow |

→ **두 task 도합 7 datasets × 20+ baselines** — 광범위한 검증.

---

## 13.10 ProTran 의 4 가지 design choice 정리 — 마지막 한 그림

```
   ┌────────────────────────────────────────────────────────────┐
   │                    ProTran = 4 design choices              │
   ├────────────────────────────────────────────────────────────┤
   │                                                            │
   │ ❶ Attention 의 대상: 관측 x → **잠재 z (의 hidden w)**     │
   │    → noise 전파 회피, 정제된 의미들끼리 비교                 │
   │                                                            │
   │ ❷ Transition: RNN → **Attention** (RNN 완전 거부)          │
   │    → gradient vanishing 회피, long-range 직접 연결          │
   │                                                            │
   │ ❸ Generation: Autoregressive → **잠재 기반 non-autoregressive** │
   │    → error accumulation 회피, 장기 예측 안정                │
   │                                                            │
   │ ❹ 잠재 구조: Single → **Hierarchical (L layers)**          │
   │    → multi-scale temporal pattern, capacity scaling         │
   │                                                            │
   └────────────────────────────────────────────────────────────┘
   
   이 4 choices 의 합 = ProTran
   각 choice 의 ablation = Table 2 (Stochastic latent 제거가 가장 큰 타격)
   각 choice 의 영감 = NLP (Transformer), VAE (variational), VDVAE (hierarchical)
```

---

## 13.11 paper 의 "ProTran" 이름의 의미

**Pro**babilistic **Tran**sformer 의 합성.

| 글자 | 의미 |
|------|------|
| Pro | Probabilistic — 확률적 출력 |
| Tran | Transformer — attention 기반 |

→ paper 의 핵심 두 contribution 이 이름에 응축. 이름 자체가 paper 의 essence.

---

## 13.12 자기점검 (이 챕터)

### 핵심 5가지
1. **ProTran 의 가장 큰 한계는 무엇이고, 어떻게 해결 가능한가?**
2. **paper 가 명시하지 않은 응용 분야 중 ProTran 이 적합할 만한 것은?**
3. **ProTran 이 후속 시계열 모델 (TimeGrad 등) 에 어떤 영향을 줬나?**
4. **Table 2 ablation 에서 가장 중요한 component 와 가장 marginal 한 component 는?**
5. **ProTran 이름의 두 글자 의미는?**

### 답변
1. **$\mathcal{O}(T^2)$ time + memory complexity**. Attention 의 표준 약점. NLP, 음악 같은 매우 긴 sequence 에 부담. 해결책: Sparse Transformer (Longformer, BigBird, Informer, Reformer) 와 결합 — $\mathcal{O}(T \log T)$ 또는 $\mathcal{O}(T)$ 로 줄임. paper 가 future work 로 명시.
2. **Finance / Risk** — 다자산 (multivariate) + 분포 예측 (VaR, ES, tail risk) + 잠재 regime (시장 상태) — 모두 ProTran framework 와 정확히 일치. 또한 **Healthcare** (paper 가 broader impact 에서 시사), **Speech generation**, **Autonomous driving trajectory**, **EEG modeling**, **Disease progression** 등.
3. ProTran 은 "시계열에 확률적 잠재 변수" 의 첫 본격적 시도. 후속 diffusion-based 모델들 (TimeGrad, CSDI, TMDM, Diffusion-TS) 이 같은 정신 — "잠재 공간에서 stochastic sampling" — 을 diffusion process 로 진화. ProTran 이 그 정신적 시조 중 하나.
4. **가장 중요**: Stochastic latent ($z$) — 제거 시 B 대비 +32% 악화 (0.031 → 0.041). **가장 marginal**: Context attention — 제거 시 B 대비 +6% 악화 (0.031 → 0.033). 즉 "확률적 잠재 변수" 가 ProTran 의 핵심이고, context attention 은 보조적.
5. **Pro**babilistic + **Tran**sformer. 두 핵심 contribution 이 이름 자체에 응축 — 확률적 출력 + attention 기반.

---

## 13.13 마지막 한 줄

> **"RNN 없는 probabilistic 시계열 모델링의 첫 번째 본격 시도. State-space 의 우아함과 Transformer 의 표현력을 모두 가진 generative framework. 시계열 분야의 paradigm shift 의 일부."**

다음 [14_glossary.md](14_glossary.md) 에서 용어집 + 표기법 + References. 또는 [15_insights.md](15_insights.md) 에서 메타 통찰.
