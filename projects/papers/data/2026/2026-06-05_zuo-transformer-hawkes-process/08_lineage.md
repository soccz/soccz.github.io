# 08_lineage — 이론적 계보

## 직접 조상 (Direct Ancestors)

### 조상 1 — Hawkes (1971): "Spectra of some self-exciting and mutually exciting point processes" · Biometrika

**연결**: Alan Hawkes 가 지진 여진 모델링을 위해 도입한 **자기-자극 점과정**. 강도가 baseline + 과거 사건의 지수 감쇠 영향의 합으로 표현되는 frame. THP 의 모든 형식은 이 frame 의 deep learning 일반화.

**THP 가 이어받은 것**:
- 강도함수 자체를 모델링 대상으로 삼는 결정.
- "사건 간 영향 누적" 의 직관 — THP 는 self-attention 가중합으로 일반화.

**THP 가 깬 것**:
- 영향함수 $\phi(t)$ 의 fixed parametric (exponential) 가정 → transformer 의 비-parametric 학습으로 대체.

### 조상 2 — Du, Dai, Trivedi, Upadhyay, Gomez-Rodriguez, Song (KDD 2016): RMTPP

**연결**: **첫 번째 neural temporal point process**. RNN 으로 사건 이력 압축 → exp 강도 헤드. neural TPP 패러다임의 시초.

**THP 가 이어받은 것**:
- "RNN 압축 → parametric 강도" 의 2 단 분리.
- 사건 시퀀스의 hidden state representation 의 표준.
- $\log L = \sum \log \lambda - \int \lambda dt$ 의 NLL 학습 신호.

**THP 가 바꾼 것**:
- RNN → transformer self-attention (이력 표현 변경).
- exp 강도 → softplus 강도 (수치 안정 + 부드러움).
- 시간 항 $w \cdot (t - t_j)$ → $\alpha_k \cdot (t - t_j)/t_j$ (relative time normalize).

### 조상 3 — Mei & Eisner (NeurIPS 2017): Neural Hawkes Process

**연결**: **연속시간 LSTM** 으로 RMTPP 의 강도 표현력 확장. THP 의 직계 부모. 같은 저자 Hongyuan Zha 가 THP 의 last author 로 직접 계승.

**THP 가 이어받은 것**:
- Softplus 강도 헤드 (NHP 가 먼저 도입).
- 사건 사이 연속시간에서 강도 정의의 표준.
- 평가 지표 3종 (log-likelihood / type acc / time RMSE) 의 표준.
- 6 벤치마크 (Synthetic / Retweet / MIMIC-II / StackOverflow / MemeTrack / Financial) 의 표준 평가 셋업.

**THP 가 깬 것**:
- continuous-time LSTM 의 sequential bottleneck → self-attention 으로 long-range trigger 직접 표현.
- 강도의 동적 evolution (ODE-like) → relative-time 의 linear-softplus 닫힌형.

### 조상 4 — Vaswani et al. (NeurIPS 2017): Attention Is All You Need

**연결**: Transformer 의 원조. THP 의 인코더 블록 (multi-head + scaled dot-product + FFN + residual + LN + sinusoidal PE) 은 본질적으로 Vaswani 의 인코더 그대로.

**THP 가 이어받은 것**:
- Multi-head scaled dot-product attention 의 전 구조.
- Position-wise FFN, residual + LN, dropout, label smoothing.
- Sinusoidal positional encoding 의 분모 $10000^{2i/d}$ 의 직접 차용.

**THP 가 변경한 것**:
- PE 의 입력이 정수 position → 실수 시간 (점과정 응용).
- Encoder-decoder → encoder only (점과정엔 generation 대상 없음).

---

## 평행 연구 (같은 시기, 다른 접근)

### 평행 1 — Zhang, Lipton, Li, Smola (ICML 2020): Self-Attentive Hawkes Process (SAHP)

**연결**: THP 와 **같은 ICML 2020** 의 직접 경쟁작. transformer self-attention 으로 호크스 강도 학습 — 같은 발상.

**차이점**:
- **강도 헤드 정의가 다름**: SAHP 는 사건 사이 강도를 attention 의 weighted average 형태로 다룸. THP 는 hidden state $h_j$ + relative time linear 의 단순 형태.
- **시간 인코딩 위치**: SAHP 는 attention score 에 시간 정보 직접 주입. THP 는 임베딩 층에서만.
- **결과 비교**: WebSearch 인덱스 — THP 가 SAHP 를 마진으로 이긴다는 후속작 인용. (단, 본문 표 미접근으로 정확 자릿수 미단정.)

**누가 이겼나?**
- THP 가 후속 인용 anchor (Mamba Hawkes, SMURF-THP, From Hawkes to Attention 등이 모두 THP 강도 헤드 채택).
- SAHP 의 attention-time 직접 결합은 후속 연구 (TAA-THP 2021) 가 일부 흡수.

### 평행 2 — Chen et al. (2018): Neural Hawkes Process variant with attention encoder

**연결**: NHP 와 attention 의 hybrid 시도. RNN + attention.

**차이점**: 본격 transformer 가 아니라 attention 을 RNN 보조로 사용. THP 가 더 깔끔하게 transformer-only.

### 평행 3 — Omi, Ueda, Aihara (2019): Fully Neural Network based Model for Point Processes

**연결**: 점과정 강도를 cumulative function 으로 학습. parametric 가정 회피.

**차이점**: THP 는 강도 자체를 직접 모델링 (점과정의 정통 frame). Omi 는 cumulative 를 학습해 적분 우회. 다른 학습 신호 디자인 철학.

### 평행 4 — Lin et al. (2020): Universal Transformer for Hawkes Process

**연결**: THP 와 거의 동시기. transformer + Hawkes process. 본 환경 식별자 미상.

**차이점**: Universal Transformer 의 weight tying (모든 layer 가중치 공유) 적용. THP 는 layer 독립.

---

## 직계 후손 (이미 출현한 후속 연구)

### 후손 1 — Yang, Yan, Zha (2022): Temporal Attention Augmented Transformer Hawkes Process (TAA-THP)

**무엇인가?** arXiv:2112.14472. THP 의 attention score 자체에 시간 정보를 추가 주입. THP 의 SAHP-style 한계를 극복하려는 시도.

**THP 와의 관계**: 강도 헤드는 그대로 유지, attention 의 시간 의존성만 확장.

### 후손 2 — Zhang et al. (2024): Mamba Hawkes Process

**무엇인가?** arXiv:2407.05302. THP 의 transformer backbone 을 Mamba (selective state space model) 로 교체. 매우 긴 시퀀스 효율화.

**THP 와의 관계**: 강도 헤드 정의 그대로. backbone 만 SSM 으로 변경. THP 가 정의한 강도 frame 의 영향력 증명.

### 후손 3 — Dong, Yan, Zhao (2023): SMURF-THP

**무엇인가?** arXiv:2310.16336. Score Matching-based Uncertainty THP. NLL 대신 score matching 으로 학습.

**THP 와의 관계**: Architecture 그대로, loss 만 변경. uncertainty quantification 추가.

### 후손 4 — Bhattacharjya et al. (2024): Interpretable Transformer Hawkes Processes

**무엇인가?** arXiv:2405.16059. THP 의 attention 을 명시적으로 사회망 상호작용으로 해석.

**THP 와의 관계**: THP 의 attention pattern 을 후속 해석성 분석의 대상으로 삼음. mech interp 의 관점.

### 후손 5 — Chen et al. (2026): From Hawkes Processes to Attention

**무엇인가?** arXiv:2601.09220. THP-style attention 과 Hawkes 의 통합 framework. transformer 의 attention 자체를 호크스 강도의 일반화로 재해석.

**THP 와의 관계**: 본 논문이 안 한 이론적 통합. THP 의 anchor 역할 입증.

---

## 후손 예측 (THP frame 에서 파생 가능한 후속)

### 예측 1 — Continuous-time Attention for TPP

THP 의 강도 헤드 한계 (사건 사이 단조성) 를 극복하기 위해 **attention 자체가 사건 사이 시각의 함수** 가 되도록. 가능도 적분이 attention 의 시간 적분으로 환원되는 closed-form 일반화.

### 예측 2 — Multi-modal TPP (text + event sequence)

THP 의 사건 type 임베딩에 LLM 의 text embedding 결합. 예: 트위터 리트윗 + 트윗 텍스트 → 다음 리트윗 시각·사용자 예측. 점과정 + 멀티모달 의 융합.

### 예측 3 — Causal intervention 으로 점과정 회로 발견

THP 의 attention head 를 mechanistic interpretability 의 대상으로 삼아, 어떤 head 가 어떤 trigger 패턴 (자기-자극 / mutual / refractory) 을 학습하는지 회로 분석. ACDC-style edge ablation 점과정 응용. (사용자 연구 직결 — `mech-interp-circuits` ↔ `point-process` 교차.)

---

## 핵심 한 문장

> **THP 는 Hawkes (1971) 의 점과정 frame + RMTPP (2016) 의 neural 1차 분리 + NHP (2017) 의 softplus 강도 표준 + Vaswani (2017) 의 transformer 인코더 의 4 가지를 합성해, 점과정 분야에 transformer turn 을 가져온 anchor 논문이며, 그 강도 헤드 정의는 5+편의 후속 작업이 그대로 채택하는 표준이 되었다.**
