# 08_lineage — 이론적 계보

**배경 사다리**: ① 모든 논문은 *조상* (직접 영향을 준 선행) + *평행* (같은 시기 다른 답) + *후손* (이 논문이 낳은 것) 의 세 축에서 자리잡힌다, ② "왜 이 논문이 이겼나 / 어떤 면에선 졌나" 는 평행 작업과의 비교에서만 명확, ③ 후손은 *어떤 방향으로 갈라졌나* 가 본 논문의 영향력의 진짜 척도.

---

## 1. 이론적 조상 (직접 영향)

### (a) Kercheval & Zhang 2015 — "Modelling high-frequency limit order book dynamics with support vector machines"
- **관계**: LOB 의 ML 분류 문제 정의를 제공. 핸드크래프트 feature (spread, mid-price, imbalance, 가격 derivatives) + SVM.
- **DeepLOB 와의 차이**: DeepLOB 는 *raw 40-dim 에서 직접 학습* — feature engineering 을 architecture engineering 으로 대체.
- **계승 vs 단절**: 문제 정의 계승, 방법론 단절. 그러나 baselines 으로 SVM 이 살아남아 비교 대상.

### (b) Ntakaris et al. 2018 — "Benchmark dataset for mid-price forecasting..." (Journal of Forecasting)
- **관계**: FI-2010 benchmark 의 정의·공개. DeepLOB 의 평가 데이터셋이 이 작업에서 나옴.
- **DeepLOB 와의 차이**: Ntakaris 는 데이터셋 + 단순 baseline 만 제공. DeepLOB 는 그 위에서 SOTA 갱신.
- **인과**: Ntakaris 없었으면 DeepLOB 의 평가 표준 부재. 둘은 *공생적 관계*.

### (c) Szegedy et al. 2015 — "Going Deeper with Convolutions" (GoogLeNet, CVPR)
- **관계**: Inception 모듈 사상의 원천. 평행 branch + 채널 concat 의 발명.
- **DeepLOB 와의 차이**: GoogLeNet 은 2-D 영상 (224×224 픽셀, RGB) 용. DeepLOB 는 *1-D 시간축으로 차원 축소* 후 적용.
- **계승**: $1 \times 1$ → $3 \times 3$, $1 \times 1$ → $5 \times 5$, MaxPool + $1 \times 1$ 의 3-branch 구조 정확히 차용. $3 \times 3 \to 3 \times 1$, $5 \times 5 \to 5 \times 1$ 로 시간축 1-D 변형.

### (d) Hochreiter & Schmidhuber 1997 — "Long Short-Term Memory"
- **관계**: LSTM 의 원형. forget/input/output gate.
- **DeepLOB 와의 차이**: 본 논문은 LSTM 을 *최종 통합기* 로만 사용 (한 층, hidden 64). LSTM-centric 이 아니라 *CNN-centric + LSTM 마무리*.

### (e) Tsantekidis et al. 2017 — "Forecasting stock prices from the limit order book using CNNs"
- **관계**: LOB 에 CNN 을 처음 적용한 평행 / 직전 작업.
- **DeepLOB 와의 차이**: Tsantekidis 의 CNN 은 1-D 시간 conv 만, spatial 위계 처리 없음. DeepLOB 는 spatial 위계를 명시적 conv 커널 모양에 흡수.
- **DeepLOB 의 주장**: "CNN-I" 라 부르며 baselines 비교에서 능가.

---

## 2. 평행 연구 (같은 시기, 다른 접근)

### (a) Tran et al. 2018 — "Temporal Attention-Augmented Bilinear Layer (B-TABL)" / "Tensorial Bilinear Network (TABL)"
- **시점**: 2017-2018, DeepLOB 와 동시기.
- **접근**: LOB 의 (time, feature) 2-D 표현에 bilinear attention 적용. attention 으로 중요 시점·feature 가중치.
- **DeepLOB 와의 비교**: TABL 은 attention-only — conv 의 spatial 위계 인덕션 없음. 일부 horizon 에서 TABL 이 강하다는 보고 있으나, FI-2010 전체에서 DeepLOB 가 우세 (저자 보고, 본문 표 미확인).
- **승부의 본질**: DeepLOB 의 *hard inductive bias* (1×2, 1×10) vs TABL 의 *soft attention*. small-N 에서는 hard bias 가 유리.

### (b) Sirignano 2019 — "Deep learning for limit order books"
- **시점**: 2019 Quantitative Finance.
- **접근**: 다층 NN 으로 LOB 의 조건부 distribution 모델링. spatially convolutional layer 일부 차용.
- **DeepLOB 와의 비교**: Sirignano 는 *generative / regression*, DeepLOB 는 *분류*. 다른 task. 그러나 둘 다 OMI / Cont 그룹의 LOB DL 시리즈.

### (c) Zhang, Zohren, Roberts 2018 — "BDLOB: Bayesian Deep Convolutional Neural Networks for Limit Order Books" (NeurIPS workshop)
- **시점**: 2018-12, DeepLOB 발표 직후.
- **접근**: DeepLOB architecture + MC Dropout 으로 불확실성 추정.
- **관계**: 본 논문의 직속 후속. 동일 저자 그룹의 *불확실성 확장*. DeepLOB 의 architecture 가 검증되자마자 그 위에 Bayesian 층을 얹은 것.

### (d) Doering et al. 2017 — "Convolutional Neural Networks for High Frequency Trading"
- **시점**: 2017.
- **접근**: 1-D CNN + technical indicator.
- **DeepLOB 와의 비교**: technical indicator 의존, raw LOB 미사용. DeepLOB 가 raw 에서 직접 학습한 점에서 우세.

---

## 3. 후손 (이 논문에서 파생된 방향)

### 후손 1: BDLOB (Zhang 2018) — 불확실성 정량화
- **변형**: DeepLOB + MC Dropout 으로 prediction 의 epistemic uncertainty 보고.
- **의의**: 거래소 실무에서는 "얼마나 확신하나" 가 사이즈 결정에 중요. DeepLOB 의 확률 출력이 *miscalibrated* 일 가능성을 보완.
- **확인**: 동일 GitHub 그룹 내 후속 작업.

### 후손 2: DeepLOB-attention (Zhang 2021) — Transformer 확장
- **변형**: DeepLOB 의 LSTM 을 Transformer encoder 로 교체.
- **의의**: attention 이 LSTM 의 마지막-only-hidden 한계를 보완. 모든 시점 hidden 을 동시 weighted aggregation.
- **결과 (저자 보고)**: 일부 horizon 에서 추가 성능 향상.

### 후손 3: DeepLOB + RL (Zhang, Zohren, Roberts 2020) — "Deep Reinforcement Learning for Trading"
- **변형**: DeepLOB 분류 출력을 RL agent 의 state representation 으로 사용.
- **의의**: *분류 → 거래* 의 간극을 RL 로 직접 메움. transaction cost 처리.

### 후손 4: 평행 도메인 — Crypto LOB / Futures LOB
- **변형**: Briola et al., Pearson 등의 crypto / futures market 에서 DeepLOB architecture 재사용.
- **의의**: "universal features" 주장이 cross-asset 까지 확장되는지 검증.

### 후손 5: 후속 benchmark (BMG-LOB, NBBO-LOB)
- **변형**: FI-2010 의 작은 크기 한계를 보완하는 더 큰 LOB benchmark 들이 2020s 에 등장.
- **의의**: DeepLOB 의 architecture 를 더 큰 데이터로 재평가 가능.

---

## 4. 왜 이 논문이 살아남았나 (vs 평행 작업)

세 가지 요인:

1. **재현 가능한 코드 + 표준 benchmark**. TensorFlow 1, 2, PyTorch 3개 버전, FI-2010 직접 다운로드 가능 → 후속 연구자가 쉽게 baseline 재현. *학술 표준 baseline* 의 자격을 얻음.

2. **명확한 design rationale**. conv 커널 모양의 의미가 *LOB 의 위계와 정확히 대응* — 후속 연구자들이 비판하든 계승하든 *명확한 토론 대상*.

3. **OMI / Roberts 그룹의 연속 publication**. BDLOB, DeepLOB-attention, RL 후속 등 동일 그룹이 *생태계* 를 형성. 후속이 본 논문을 인용 → 인용 누적 가속.

반면, 평행 작업 TABL 도 살아남았지만 *별도 라인*. Sirignano 의 generative 작업은 *다른 task*. DeepLOB 는 "LOB 분류" 의 표준 baseline 자리를 차지.

---

## 5. 어느 면에서 졌나

- **Generative / probabilistic modeling**: Sirignano 가 우세. DeepLOB 는 deterministic classifier.
- **Long-horizon (k > 100)**: 명시적 처리 없음. TimesNet / Autoformer 류의 super-long-horizon 사상과 결합 미진행.
- **Cross-asset universality**: LSE 대형주만. Sirignano 의 generative 접근이 cross-asset transfer 에 더 강할 가능성.

---

## 6. 한 줄 요약

> **DeepLOB 는 Kercheval-SVM(문제 정의) + Ntakaris-FI2010(데이터) + GoogLeNet-Inception(아키텍처) + Tsantekidis-CNN-I(직접 평행) 의 네 흐름을 conv 위계 + Inception + LSTM 의 단일 architecture 로 묶어 LOB 분류의 표준 baseline 자리를 차지했고, BDLOB → DeepLOB-attention → DeepLOB-RL 의 OMI 후속 라인으로 생태계를 구축했다.**
