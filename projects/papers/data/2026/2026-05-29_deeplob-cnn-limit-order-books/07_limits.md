# 07_limits — 가정·한계·반박

**배경 사다리**: ① 모든 ML 논문은 *명시적으로 인정한 한계* 와 *암묵적으로 깔린 가정* 의 두 층, ② "반박 가능 (falsifiable)" 한 주장은 *어떤 실험을 하면 무너지나* 가 명시될 때 성립, ③ 재현성은 코드/데이터/하이퍼파라미터/random seed 의 네 요소 모두 공개돼야 완전.

---

## 1. 명시된 가정 (저자가 대놓고 말한 것)

(본문 §I, §III, §V 추정 — 본 해체는 abstract + GitHub README + 코드로부터 도출)

1. **LOB 의 10 레벨만으로 충분**. 11레벨 이상의 정보는 무시. (FI-2010 의 데이터 정의에 hard-coded.)
2. **DecPre 정규화의 적합성**. ZScore/MinMax 대비 DecPre 가 *상대 크기 비교 보존* 면에서 우수.
3. **3-class 라벨의 충분성**. up/stationary/down 의 이산 분류로 다음 가격 변화의 의사결정에 필요한 정보를 충분히 잡는다 (회귀가 아닌 분류).
4. **continuous trading regime 의 단일성**. opening/closing auction 은 별도 처리 필요.

---

## 2. 암묵적 가정 (말 안 했지만 깔려 있는 것)

### (a) 학습-실시간 latency gap 의 무시
모델은 100-tick lookback 으로 다음 $k$-tick 후를 예측한다. 학습 시점에는 t-100 ~ t-1 의 정확한 LOB 가 가용하지만, **실시간 운영에서는 t 시점의 신호를 처리해 결정하기까지 ms 단위 latency** 가 있다. 즉, 100-tick 전체를 활용하는 게 아니라 t-100 ~ t-1 - δ (δ = latency) 의 정보만 가용. 이 *time-of-flight* 효과로 inference 시 성능이 학술 보고보다 떨어질 가능성. 본 논문은 이 gap 을 다루지 않는다.

### (b) Sequential trade 가 i.i.d. 같다는 가정
학습 시 minibatch 를 무작위 셔플해 SGD 한다. 이는 *각 100-tick window 가 통계적으로 독립* 이라는 암묵적 가정. 실제 LOB 다이내믹스는 강한 시간 의존이 있어 인접 window 는 매우 상관됨. 이로 인해 *effective sample size* 가 보고된 20만보다 훨씬 작을 가능성 — 즉 모델이 보는 *진짜 독립 정보* 가 적다.

### (c) Stationarity within day
FI-2010 의 10 거래일 train+test 는 intraday seasonality (open volatility / lunch lull / close 마감 효과) 의 영향을 받는다. 모델은 시점-of-day 입력을 받지 않으므로 *모든 시각이 동등* 가정. 실거래에서는 시각별 전략 변경이 필요.

### (d) Mid-price 의 의미 동등
모델은 mid-price $\frac{p^{a,1} + p^{b,1}}{2}$ 의 변화를 라벨로 받는다. 그러나 실거래에서는 매수/매도가 다른 가격에 체결되며, mid-price 의 변화 ≠ 실거래 이익. 특히 spread 가 넓은 종목에서 이 간극이 큼.

### (e) Universal features 의 의미 제한
LSE 5종목 모두 FTSE 100 대형주, 모두 narrow spread, 모두 high liquidity. "universal" 은 사실 *이 sub-universe 내에서의 universal*. 진짜 universal (cross-asset, cross-region, cross-volatility) 은 미검증.

---

## 3. 반박 가능한 지점 (실험적으로 falsifiable)

### 반박 1: "Inception 모듈은 dilated conv 와 등가 — 단순한 conv 만으로 충분하다"

**주장**: DeepLOB 의 Inception (3×1, 5×1, MaxPool) 평행 가지는 *충분히 큰 receptive field 의 단일 dilated conv* 또는 *깊은 시간 conv* 와 등가일 가능성. Inception 의 평행 구조는 architecture engineering 의 화려함이지 본질적 이득이 아닐 수 있다.

**검증 실험**: 
- DeepLOB 의 Inception 블록을 dilated conv (예: dilation = [1, 2, 4] × 3 layer) 로 교체.
- 같은 FI-2010 분할에서 F1 비교.
- 만약 dilated 가 동등 또는 우수하면 Inception 차용은 정당화 불가 — 본 논문의 *명시적 design choice 중 하나가 무력화*.

**예상**: dilated 가 약간 우세할 가능성 30~40%. (WaveNet 의 dilated 사상이 더 elegant 하기 때문.)

### 반박 2: "LOB 의 위계는 conv 가 아닌 attention 으로 더 잘 표현된다"

**주장**: conv 1×2 → 1×2 → 1×10 의 hard-coded 위계는 *FI-2010 의 특수한 정렬* 에 강하게 종속. 다른 거래소 데이터 (NASDAQ ITCH, NYSE TAQ) 에서는 정렬이 다르고, 시간-가변적 가용 깊이 (변동하는 LOB depth) 도 다르다. **Self-attention 으로 (가격, 거래량) 짝을 *데이터에서 학습* 하게 하면 universality 가 더 강해진다**.

**검증 실험**:
- 같은 FI-2010 에서 Transformer encoder + LSTM 또는 attention-only 모델 학습.
- LSE 2017 → 학습 안 한 mid-cap (예: ITV, easyJet) 으로 transfer test.
- DeepLOB vs Transformer 의 transfer F1 비교.

**예상**: small-N FI-2010 에서는 DeepLOB 가 작은 inductive bias 이득으로 우세할 가능성. 그러나 large LSE 데이터 + cross-cap transfer 에서는 Transformer 가 우세 가능. → **DeepLOB 의 universality 주장이 sub-universe 내에서만 성립** 임을 입증.

### 반박 3: "성능 향상이 transaction cost 흡수 후에는 사라진다"

**주장**: 75% accuracy 는 인상적이지만, 실거래에서는 transaction cost (commission + spread + market impact) 가 mid-price 분류의 우위를 잠식. 특히 stationary 가 35% 인 데이터에서 모델의 *진짜 정보 이득* 은 35% 의 chance 대비 +40% 정도이며, 이 중 절반 이상이 transaction cost 로 사라질 가능성.

**검증 실험**:
- 단순 long/short 전략 backtest: 모델이 up 예측 → BUY, down 예측 → SELL. stationary 는 무시.
- LSE 2017 1년 데이터로 round-trip cost (commission + 0.5-spread 인식) 가정.
- Sharpe ratio, total return, max drawdown 보고.

**예상**: gross 수익 양호, net 수익 (cost 차감 후) 거의 0 또는 음수. → 본 논문이 *학술적 성공* 이지만 *실무적 의의* 는 별도 검증 필요.

---

## 4. 재현성 평가

| 항목 | 평가 | 비고 |
|------|------|------|
| **코드 공개** | ✅ 우수 | TensorFlow v1, v2, PyTorch 1.9 3개 버전 |
| **데이터 공개** | ✅ FI-2010 zip 직접 다운로드 가능 | LSE 데이터는 비공개 |
| **하이퍼파라미터 명시** | ✅ 노트북에 직접 (lr, batch, epoch) | 본문 §V 에 더 자세할 가능성 |
| **랜덤 시드** | ⚠️ 노트북에 명시 없음 | 결과 분산 미보고 |
| **결과 분산** | ❌ 평균만 (단일 실행) | 분산 미공개 |
| **다른 horizon ($k$) 결과** | ⚠️ notebook 은 $k=4$ 만 | 본문 표 추정 |
| **Ablation 코드** | ❌ 미공개 | Inception 빼고 학습하려면 사용자 재구현 필요 |

### 분산 미보고의 의미
notebook 의 0.7535 가 *단일 실행*. seed 변화에 따른 ±2% 정도 흔들림이 일반적인 작은 모델에서 예상되며, 보고된 75% 가 "평균인지 best 인지" 불명. 일반적으로 single best 일 가능성.

→ **재현성은 형식적으로 OK, 통계적 신뢰도는 제한적**.

---

## 5. 가장 큰 미답

> **"분류 정확도 75% 가 실거래에서 어떤 의미인가?"** 의 질문에 본 논문은 답하지 않는다. 학술 ML 의 metric (F1, accuracy) 과 quant industry 의 metric (Sharpe, IR, hit ratio after cost) 의 다리를 놓는 것이 본 연구의 가장 큰 후속 과제이며, 이는 9년 후 (2024 MASTER, 2025 LOB-RL 등) 까지 미해결.

---

## 6. 한 줄 요약

> **DeepLOB 의 한계는 (a) 분류·실거래 metric 분리, (b) FI-2010·LSE 의 small-N + 대형주 편향, (c) Inception 의 대안 (dilated, attention) 미실험, (d) 단일 실행 결과로 분산 미보고 — 본 논문이 architecture engineering 의 우수성을 증명한 만큼, 후속 작업이 위 4개 모두를 풀어야 한다.**
