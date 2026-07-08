# 1. 3층 TL;DR

## 🧒 초등학생 수준 (400~600자)

내일 아이스크림을 몇 개 팔지 예측한다고 하자. 우리가 아는 정보는 세 종류다.
- **바뀌지 않는 정보**: 이 가게가 있는 도시, 가게 규모, 브랜드.
- **미리 아는 미래 정보**: 내일이 공휴일인지, 내일 예정된 축제.
- **지난 일들**: 어제까지의 판매량, 지난주 날씨, 지난달 SNS 반응.

기존 예측 모델은 이 세 종류를 다 뒤섞어 "그냥 숫자"로 만들어 넣었다. 그래서 "왜 그렇게 예측했어?"라고 물어도 대답을 못 했다.

TFT (Temporal Fusion Transformer, 시간융합 트랜스포머)는 세 종류를 **문에 따라 분리해서 넣는 냉장고** 같은 구조다. 도시·크기는 위쪽 서랍, 내일 공휴일 정보는 오른쪽 서랍, 지난 판매량은 왼쪽 서랍. 각 서랍에는 "지금 이 서랍의 이 재료가 얼마나 중요한가?"를 판단하는 작은 저울 (variable selection network, 변수 선택망) 이 붙어 있다.

또 하나 큰 발상은 **"몇 개 팔지"만 답하지 않고 "20% 확률로 최소 몇 개, 90% 확률로 최대 몇 개"까지 함께 답하는** 것이다. 이걸 quantile (분위수) 예측이라고 부른다. 이렇게 답하면 창고를 얼마나 준비할지 결정하기가 훨씬 쉽다.

## 🎓 학부생 수준 (500~800자)

**문제**: 다시계열-지평 (multi-horizon) 예측은 (i) static covariate (시간 불변 메타데이터: 지역·업종), (ii) known future input (미리 알 수 있는 미래: 요일·공휴일·프로모션 스케줄), (iii) observed past (과거만 관측되는 외생 시계열: 온도·SNS 지표), 세 종류의 입력이 섞여 있다. DeepAR·MQ-RNN·ConvTrans 같은 기존 딥 forecasting 모델은 세 종류를 구별해서 다루는 **명시적 API 가 없다**.

**아이디어**: 세 종류를 각각의 **경로**로 넣고, 각 경로 입구에 **Variable Selection Network (VSN)** 을 두어 "이 시점에 이 변수가 얼마나 중요한가"를 softmax weight 로 뽑는다. Static covariate 는 별도의 static covariate encoder 로 4 개 context 벡터 $c_s, c_c, c_h, c_e$ 로 압축해 다른 경로에 조건화 신호로 주입한다. 지역 시간 패턴은 **sequence-to-sequence LSTM 인코더-디코더**, 장기 의존성은 **interpretable multi-head attention**, 비선형 처리는 **Gated Residual Network (GRN)** — GRN 은 $\text{GRN}(a, c) = \text{LayerNorm}(a + \text{GLU}(\eta_1))$ 형태로 skip connection + gating 을 갖추어 필요 없으면 자기 자신을 건너뛴다.

**출력**: 각 지평 $\tau \in \{1, \ldots, \tau_{\max}\}$ 에서 여러 분위수 $q \in \{0.1, 0.5, 0.9, \ldots\}$ 예측을 동시에 내고, pinball loss $Q L(y, \hat{y}, q) = q(y-\hat{y})_+ + (1-q)(\hat{y}-y)_+$ 로 학습.

**결과**: Electricity·Traffic·OMI Volatility·Favorita Retail 4-도메인에서 DeepAR·MQ-RNN·ConvTrans·N-BEATS·전통 ARIMA/ETS 대비 quantile loss (q-Risk P50 & P90) 3-26% 개선. 부가로 (1) VSN weight 로 변수 중요도, (2) attention weight 로 시간 중요도, (3) attention head 별 pattern 으로 **주기·이벤트·regime shift 세 시각적 signature** 를 뽑는 3-축 해석 통로를 제공.

## 🔬 전문가 수준 (600~1,000자)

**Contribution 4 축**:

1. **입력 typology 명시화**: 다시계열-지평 예측의 입력을 (static / known future / observed past / target / horizon-index) 5-tier 로 분리하고, 각 tier 를 각기 다른 sub-network 로 처리하는 architecture-level API 를 제공. 이 typology 는 이후 MQTransformer, PatchTST 와 같은 후속 baseline 이 명시적으로 계승 (혹은 flatten 하는 대안 형태로 반박) 하는 표준 인터페이스가 된다.

2. **Interpretable multi-head attention**: standard multi-head 는 각 head 가 서로 다른 $W^V_h$ 를 갖지만, 저자는 **모든 head 가 하나의 shared $W_V$ 를 공유** 하고 head-wise attention weight 만 다르게 두어 head 별 attention 을 단순 평균하도록 변경. 이 단일 변형이 "각 head 가 다른 subspace 를 본다" 는 induction bias 를 포기하고 **attention weight 자체를 해석 가능한 단일 표면으로 통합**. 이후 Chefer 2021 (Generic Attention Explainability) 및 attention rollout 계열 반박·확장 대상.

3. **VSN 기반 변수 중요도 + Static context 4-경로 주입**: variable-level relevance 를 $[0, 1]^d$ softmax 로 명시화한 뒤 GRN 을 통해 gating. Static covariate 는 4 개 context 벡터 ($c_s$: VSN weight 조건, $c_c$: seq2seq initial cell state, $c_h$: initial hidden state, $c_e$: static enrichment) 로 분해되어 architecture 전체에 조건화 신호로 분산 주입. 이 static-dynamic 분해는 이후 도메인 적응 (transfer learning) 실험의 표준 abstraction 이 된다.

4. **Multi-quantile pinball loss + q-Risk**: 여러 quantile 을 동시에 head 로 뽑아 pinball loss (asymmetric absolute error) 로 학습. 평가는 target 총합으로 정규화한 q-Risk $\rho_q = \frac{2 \sum QL(y, \hat{y}, q)}{\sum |y|}$. 이 metric 이 이후 MQ 계열, Chronos, MOIRAI, TimesFM 이 shared benchmark 로 계승.

**방어 가능한 주장**: (i) 4-도메인 상 3-26% 개선; (ii) VSN weight ablation 시 성능 하락 (다만 부록에서 확인 필요); (iii) attention pattern 이 domain-specific 주기와 정성적 일치.

**이론적 기여의 한계**: (a) "Interpretable" 은 correlation-attribution 수준 — Jain-Wallace 2019 반박 궤도에 그대로 노출; (b) causal intervention (ACDC, ROME 계열) 없이 VSN weight 로 인과 언명을 확정하기 어려움; (c) 5-tier 인터페이스가 데이터에 이미 주어질 때만 성립 (raw multivariate 시계열에는 static/known-future 라벨 붙이는 사전 작업 필요).
