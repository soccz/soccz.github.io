# 11 Conclusion + Future Work — Section 6

paper p.7-8. 결론 + 4가지 future work direction.

---

## 11.1 챕터 한 줄 요약

> **"TimeGrad = 다변량 확률적 시계열 forecasting 의 SOTA (5/6 datasets). $N$ loop sampling 부담은 Chen 2021 / Song-DDIM 2021 으로 가속 가능. Discrete data dequantization 의 EBM 자연스러움. OOD detection 우월 → anomaly detection 가능. Long sequence: Transformer 로 RNN 교체 + graph NN 결합 가능."**

---

## 11.2 paper 의 결론 — 한 문단

paper p.7:
> "We have presented TimeGrad, a versatile multivariate probabilistic time series forecasting method that leverages the exceptional performance of EBMs to learn and sample from the distribution of the next time step, autoregressively. Analysis of TimeGrad on six commonly used time series benchmarks establishes the new state-of-the-art against competitive methods."

**3 가지 핵심 contribution**:
1. **Versatile**: 6 dataset (diverse domains + scales) 모두 적용 가능.
2. **Multivariate + Probabilistic**: $D$ 차원 joint distribution, 100 sample distribution.
3. **EBM 활용**: functional form 자유의 generative model.

**Empirical**: 6 benchmarks 중 5 SOTA (1 tie).

---

## 11.3 Future Work — 4 방향

### Future 1 — Sampling 가속

paper p.7:
> "We note that while training TimeGrad we do not need to loop over the EBM function approximator $\epsilon_\theta$, unlike in the normalizing flow setting where we have multiple stacks of bijections. However while sampling we do loop $N$ times over $\epsilon_\theta$. A possible strategy to improve sampling times introduced in (Chen et al., 2021) uses a combination of improved variance schedule and an L1 loss to allow sampling with fewer steps at the cost of a small reduction in quality if such a trade-off is required. A recent paper (Song et al., 2021) generalize the diffusion processes via a class of non-Markovian processes which also allows for faster sampling."

**비교**:
- **Training**: 1 forward pass per training step. Flow 의 multiple bijections stack 보다 빠름.
- **Inference**: $N = 100$ loop — slow.

**해결 방향 2가지**:
1. **WaveGrad (Chen 2021)**: improved variance schedule (cosine 등) + L1 loss → $N = 25-50$ 가능.
2. **DDIM (Song 2021)**: non-Markovian process → $N = 10-25$ deterministic sampling.

### Future 2 — Discrete Data 직접 모델링

paper:
> "The use of normalizing flows for discrete valued data dictates that one dequantizes (Theis et al., 2016), by adding uniform noise to the data, before using the flows to learn. Dequantization is not needed in the EBM setting and future work could explore methods of explicitly modeling discrete distributions."

**Normalizing Flow 의 한계**:
- Discrete data (예: Taxi pickup count, Wikipedia views — $\mathbb{N}$) 는 직접 모델링 불가.
- **Dequantization** (Theis 2016): uniform noise 추가 → continuous 로 변환.
- 부정확 + 추가 step.

**EBM 의 advantage**:
- Dequantization 불필요 — discrete distribution 직접 모델링 가능.
- Future work: discrete-aware diffusion (D3PM, Austin 2021 같은 후속).

### Future 3 — Anomaly Detection (OOD)

paper p.7:
> "As noted in (Du & Mordatch, 2019) EBMs exhibit better out-of-distribution (OOD) detection than other likelihood models. Such a task requires models to have a high likelihood on the data manifold and low at all other locations. Surprisingly (Nalisnick et al., 2019) showed that likelihood models, including flows, were assigning higher likelihoods to OOD data whereas EBMs do not suffer from this issue since they penalize high probability under the model but low probability under the data distribution explicitly. Future work could evaluate the usage of TimeGrad for anomaly detection tasks."

**Anomaly detection 의 시계열 응용**:
- 금융: 시장 이상 (flash crash, bubble).
- IoT: sensor 고장 (manufacturing).
- Healthcare: 환자 상태 변화.
- Cybersecurity: traffic anomaly.

**TimeGrad 의 강점**:
- EBM 의 OOD 우월성 (Du-Mordatch 2019 입증).
- 시계열의 multivariate joint distribution 학습 → anomaly score 자연스럽게.

### Future 4 — Long Sequence + Graph Structure

paper p.7-8:
> "For long time sequences, one could replace the RNN with a Transformer architecture (Rasul et al., 2021) to provide better conditioning for the EBM emission head. Concurrently, since EBMs are not constrained by the form of their functional approximators, one natural way to improve the model would be to incorporate architectural choices that best encode the inductive bias of the problem being tackled, for example with graph neural networks (Niu et al., 2020) when the relationships between entities are known."

**Future 4a — Transformer + Diffusion**:
- RNN 의 long-range dependency 한계.
- Transformer (Rasul 2021 의 Transformer-MAF backbone) 로 교체.
- 결과: TMDM (Li 2024, ICLR) 같은 후속.

**Future 4b — Graph Neural Networks**:
- Entities 간 relationship 알려진 경우 (예: 도로 network).
- Niu 2020 의 Score-based Generative Modeling on Graphs.
- TimeGrad + GNN = spatially-aware multivariate diffusion.

---

## 11.4 Long-term Impact

TimeGrad 의 학문적 영향 (본 deep dive 의 추가):

### 1. Diffusion 시계열의 시초

ICML 2021 의 TimeGrad → 후속 paper 들 (모두 ICML/NeurIPS):
- **CSDI** (Tashiro 2021, NeurIPS): Conditional score-based diffusion imputation.
- **TMDM** (Li 2024, ICLR): Transformer-modulated diffusion.
- **Diffusion-TS** (Yuan 2024): full diffusion for time series.
- **TSDiff** (Kollovieh 2023): score-based diffusion for general TS tasks.

### 2. ProTran (NeurIPS 2021) 의 baseline

Tang-Matteson (ProTran 2021) 의 Table 1 baseline. ProTran 이 5/5 dataset 에서 TimeGrad 능가했지만, concurrent works.

### 3. Industry adoption

- **Zalando**: 이커머스 demand forecasting (원산지).
- **GluonTS** (AWS): 표준 시계열 라이브러리 의 TimeGrad 구현 포함.

---

## 11.5 본 paper 의 메시지 — 한 줄

> **"Image generation 의 diffusion SOTA (Ho 2020 DDPM) 가 시계열 forecasting 의 SOTA 도 됨. EBM 의 functional form 자유 + Langevin sampling 의 generality 가 multivariate probabilistic time series 의 첫 본격 적용. 4 future work direction 명시 — 후속 paper 의 출발점."**

---

## 11.6 5 가지 ML 디자인 원칙 (본 deep dive 의 해석)

### 원칙 1: General tool > Domain-specific variation

DDPM (image 용 일반 도구) 을 시계열로 직접 적용 — domain-specific variation 만들지 않음. Autoformer / Informer 같은 시계열 Transformer 변형과 대조적.

### 원칙 2: Conditional generation 의 표준 trick

RNN hidden state $\mathbf{h}_{t-1}$ 을 noise prediction network 의 추가 입력으로. Vanilla DDPM 의 simple extension — image conditional generation (Dhariwal-Nichol 2021) 의 trick 과 동일.

### 원칙 3: EBM 의 functional form 자유

Normalizing flow / VAE 의 architectural 제약 (Jacobian determinant, encoder-decoder symmetry) 없음. Multivariate high-D distribution 학습에 결정적.

### 원칙 4: Sampling cost trade-off 명시

paper 가 N=100 loop 의 bottleneck 명시 + 해결책 (Chen 2021, Song 2021) 명시. Honest research style — 후속 paper 의 출발점 제공.

### 원칙 5: OOD detection 의 EBM 우월성

Nalisnick 2019 의 likelihood 모델 counterintuitive OOD 발견 → EBM 의 advantage 명시. Future work 로 anomaly detection 명시 — clear research direction.

---

## 11.7 Autoformer / QuantileFormer / ProTran 과 비교 종합

| 측면 | Autoformer (2021) | QuantileFormer (2025) | ProTran (2021) | **TimeGrad (이 paper, 2021)** |
|------|-------------------|--------------------|----------------|--------------------------|
| 출처 | NeurIPS 2021 | IJCAI 2025 | NeurIPS 2021 | **ICML 2021** |
| 핵심 메커니즘 | Auto-Correlation (FFT) | Pattern-mixture decomp + VAE | Variational SSM + Attention | **DDPM diffusion + RNN** |
| Output | Point | Multi-quantile | Probability sample (latent) | **Probability sample (denoising)** |
| RNN 사용 | × | × | × (paper 가 강조) | **✓ (LSTM)** |
| Probabilistic | × | ✓ (quantile) | ✓ (variational SSM) | **✓ (diffusion)** |
| 응용 | Forecasting | Forecasting | Forecasting + Motion | **Forecasting** |

→ 4개 paper 가 다른 contribution axis. TimeGrad = **probabilistic generation 의 diffusion 접근**, 나머지는 architecture / decomposition / SSM 측면. 모두 2021 NeurIPS/ICML 의 시계열 Cambrian explosion 중 다른 방향들.

---

## 11.8 마지막 한 줄

> "Image 의 diffusion SOTA 가 시계열에 도착 — multivariate probabilistic forecasting 의 첫 EBM 기반 접근. 5/6 SOTA + 4 future direction 으로 후속 paper 의 토대."

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **paper 의 4가지 future work direction 의 우선순위 (실용성)?**
2. **TimeGrad 의 training vs inference 의 부담 비대칭과 그 이유?**
3. **TimeGrad 와 ProTran (concurrent works of NeurIPS/ICML 2021) 의 다른 contribution axis 는?**

### 답변

1. **우선순위 (실용성 기준)**: (1) **Sampling 가속 (DDIM/WaveGrad)**: inference bottleneck 해결 — 즉시 industrial 적용. **이미 후속 paper 들에서 활발**. (2) **Transformer + Diffusion**: long-sequence 의존성. TMDM (2024) 이 실현. (3) **Anomaly detection**: financial / IoT / healthcare 응용. CSDI (2021) 의 imputation 으로 일부 실현. (4) **Discrete data + Graph NN**: 특수 domain. D3PM 등 후속.
2. **Training**: 1 forward per step — fast. Normalizing flow 의 multiple bijections stack 보다 빠름. **Inference**: $N = 100$ loop — slow. 이유: training 은 noise prediction 한 random $n$ 만 학습 (Algorithm 1) → unbiased gradient. Inference 는 sample 생성 — Markov chain 의 정확한 sequential reverse process 필요. Random skip 불가. 이 비대칭이 DDPM 류 모든 모델의 특징.
3. **TimeGrad**: **Generative method** (diffusion). EBM lineage 의 시계열 적용 — functional form 자유, high-D distribution 학습 표준. **ProTran**: **Architectural innovation** (SSM + Transformer). RNN 완전 제거 + latent space attention — 시계열 architecture 의 paradigm shift. 두 paper 가 같은 task (multivariate probabilistic forecasting) 의 다른 axis 공략. concurrent works of NeurIPS/ICML 2021 — 시계열 Cambrian explosion 의 다른 갈래.

다음 [12_glossary.md](12_glossary.md) — 용어집 + 표기법 + References.
