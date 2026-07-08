# 8. 내 연구와의 연결

## 활성 자산과 매칭 (`_profile.md` 관심 영역 §D + §E + §C)

### ⏸️ P1 ProTran-TFA (paused, 재개 가능) — 가장 직접적 연결

`paper_test/PAPER_DRAFT_V1.md` + `protran_tfa/` 의 P1 ProTran-TFA 는 2022 AEL Tactical Factor Allocation 과 ProTran (NeurIPS 2021 Tang·Matteson, 2026-05-19 커버) 을 결합하는 finance venue 지향 확장. TFT 는 이 draft 의 **baseline 3순위 필수 후보** — 지금 정리 안 하면 finance venue (IJF/QF) 진출 시 인용 gap 발생.

**흡수할 기법**:
- **VSN 을 factor selection 으로 재해석**: P1 draft §4.2 (baseline 비교 절) 에서 VSN weight 를 "each factor 의 conditional relevance" 로 인용하고, ProTran-TFA 의 factor gating 이 VSN 의 static-conditioned 판이라 서술. 인용 문장 초안: "Lim et al. (2021) 은 각 시점 변수 중요도를 softmax gating 으로 명시화하는 Variable Selection Network 를 제안했다. 본 논문의 factor selection layer 는 이 정신을 (i) tactical asset allocation 의 factor 축으로 이식하고, (ii) static context 를 (VSN 의 static-conditioned 대신) macro regime indicator 로 대체한 확장이다."
- **Static covariate 4-경로 주입 → factor 4-경로**: TFT 의 4 개 context 벡터 ($c_s, c_c, c_h, c_e$) 정신을 (regime, initial state, hidden bias, enrichment) 로 재해석해 macro 상태를 4 지점 주입.
- **Multi-quantile pinball loss**: ProTran 의 확률 예측이 parametric 이지만, TFT-style non-parametric pinball 도 함께 학습해 quantile 예측을 확보. Regime-shift 근처에서 tail 예측 안정성 실험.

**충돌/경쟁 지점**:
- ProTran 이 Gaussian mixture parametric 인 반면 TFT 가 non-parametric — 이 두 확률 예측 방식의 tradeoff (parametric = extrapolation 강함, non-parametric = misspecification 없음) 를 P1 draft §7 (Discussion) 에서 정리.
- Quantile crossing 은 ProTran mixture 에는 자연 발생 안 함 (parametric distribution 은 항상 monotone CDF). TFT-style quantile head 를 도입할 때 crossing 관리 필요.

**인용 포인트 초안 (P1 draft 안에)**:
- §2 Related Work: "Lim et al. (2021) 은 static/known-future/observed-past 5-tier 입력을 architecture 수준으로 분리한 Temporal Fusion Transformer (TFT) 를 제안했다. 그러나 TFT 는 (a) financial factor 를 직접 다루지 않고, (b) parametric mixture 가 없어 factor return 의 stylized fact (skew, kurtosis, autocorrelation) 를 명시적으로 흡수 못 한다. 본 논문은 이 두 gap 을 겨냥한다."
- §4.2 Method comparison table: TFT 를 baseline 으로 포함.
- §5 Experiments: OMI Volatility 데이터셋을 factor-return 확장으로 재사용해 TFT 원저자 조건에서 P1 성능 비교.

**반면교사**:
- TFT 의 "interpretable" 는 correlation-attribution 수준. P1 draft 에서는 (i) attention permutation 반박, (ii) causal intervention (path patching) 유무 를 명시적으로 언급해 P1 이 이 gap 을 어떻게 다루는지 (또는 안 다루는지) 를 정직하게 서술.

## 🟢 APF (Attention Pattern Fields) — main track — 방법론 흡수 + 반박 대상 이중

`/mnt/20t/fin/Attention Pattern Fields/README.md` 의 APF 는 "PE → 2D attention motif → CNN probe → causal intervention" framework. TFT 의 interpretable MHA 는 motif 관점의 direct 실험 대상.

**흡수할 기법**:
- **Head 평균 attention weight → motif 분류**: TFT 의 interpretable MHA 는 $\bar{A} = \frac{1}{H} \sum_h A_h$ 라는 단일 attention 지도를 제공. APF main paper §5 (motif intervention) 에서 이 head-averaged attention 을 diagonal/stripe/block/edge/spike/checker 6-motif 로 분류하는 baseline 실험 substrate.
- **VSN 을 variable-dimension motif classifier 로 확장**: APF 가 시간축 motif 를 다루는데, VSN 은 변수축의 sparsity pattern 을 다룸. 두 축을 동시 분류하는 2D motif tensor 로 확장 가능.

**충돌/경쟁 지점**:
- TFT 의 "Interpretable MHA" 는 head 별 value subspace 특수화를 포기한 대가로 시각화 통로 확보. APF 는 정반대 정신 — head 를 독립적으로 취급하고 각 head 의 attention pattern 을 개별 motif 로 분류. APF main paper §3 (motif taxonomy) 은 TFT-style head 평균이 정보를 지운다고 반박할 수 있음.
- APF 는 causal intervention (path patching) 을 통해 attention 이 진짜 사용되는지 검증. TFT 는 안 함. APF main paper §6 (limitations) 에서 이 gap 을 "TFT-style interpretable attention 의 인과적 지위 결핍" 으로 명명 가능.

**인용 포인트 초안 (APF main 안에)**:
- §2 Related Work: "Lim et al. (2021) 의 Interpretable Multi-Head Attention 은 head 별 value projection 을 공유해 head-averaged attention 을 단일 시간 중요도 지도로 통합한다. 그러나 이 시각화는 causal intervention 없이 correlational — 본 논문의 APF 는 head 별 attention pattern 을 motif 로 분류한 뒤 causal intervention 으로 각 motif 의 인과적 역할을 명명한다."
- §5 Experiments: TFT 를 APF 방법론이 적용 가능한 forecasting transformer 의 대표로 삼아, TFT 의 head-averaged attention 위에 motif 분류를 실행하고, 그 뒤 head 개별 attention 을 복원해 motif diversity 를 측정.

## 🟢 Grokking in TS Transformers — active — 5-tier 입력이 non-stationarity 통제 도구

`/mnt/20t/fin/Grokking in Time Series Transformers/README.md` 의 Grokking track 은 "Grokking × TS forecasting × non-stationarity × circuit analysis" 4-way 교차. TFT 의 5-tier 인터페이스는 non-stationarity 가 유입되는 축 을 명시적으로 분리하는 도구.

**흡수할 기법**:
- **Non-stationarity 축 분리 실험 설계**: Grokking-under-non-stationarity 실험에서 shift 가 어느 축에서 들어오는지 통제해야 한다. TFT 의 5-tier 는 (static covariate shift / known future distribution shift / observed past shift / target shift) 4 유형으로 shift 를 세분화. 각 유형에서 grokking timing 이 어떻게 달라지는지 정량화 가능.
- **VSN weight 시계열 = non-stationarity monitor**: 학습 중 VSN weight 의 shift 를 log 하면 어느 변수 축에서 distribution shift 가 발생했는지 track 가능. Grokking 순간 (test loss drop) 근처 VSN weight 이 어떻게 shift 하는지가 "circuit 형성 순간" 의 시각적 signature 가 될 수 있음.

**충돌/경쟁 지점**:
- Grokking track 은 Nanda 2023 (Progress Measures) 정신에서 mechanistic interpretability 를 지향. TFT 의 "interpretable" 은 correlational — Grokking track 이 필요로 하는 causal circuit 발견 도구 아님. TFT 는 baseline architecture 이지 mech interp 방법론이 아님.

**인용 포인트 초안 (Grokking paper 안에)**:
- §2 Related Work / §4 Experiment Design: "TFT (Lim et al. 2021) 의 5-tier 입력 인터페이스 (static / known future / observed past / target / horizon) 는 시계열의 이질적 입력 축을 architecture 수준으로 분리한다. 본 논문은 이 인터페이스를 non-stationarity 유입 축의 통제 도구로 재활용하되, TFT-style interpretable attention 은 (correlation-only 이므로) grokking 순간의 circuit 분석에 사용하지 않는다."

## 🔴 Shelved (연결 약함, 전이 가능성만)

- **EOA (Paper 4) 의 economic time axis**: TFT 는 wall-clock 시간에 고정된 seq2seq. Economic time (거래량, 정보량 기반 time subordination) 을 자연스럽게 흡수 못 함. 연결 약함, 전이 가능성만.
- **AETHER (crypto cycle)**: TFT 의 5-tier 인터페이스가 crypto (on-chain covariate as static, halving schedule as known future, price as observed past) 에 이식 가능하지만, AETHER 는 currently code 부재 — 실전 사용 불가.

## 정리 — 왜 이 논문이 지금 나에게 필요한가

TFT 는 (1) P1 ProTran-TFA 의 finance venue 진출 시 **필수 인용 baseline**, (2) APF main paper 의 **interpretable attention 담론에서 반박 대상 및 방법론 흡수원**, (3) Grokking track 의 **non-stationarity 축 분리 도구**, 세 활성 자산 모두에 걸침. 지금 정리해두면 이후 세 draft 어디에도 참조 가능.

특히 P1 ProTran-TFA (paused) 를 재개할 때 finance venue 논문의 형식 요건 상 TFT 를 인용 안 하면 reviewer 가 지적할 정도로 표준적 baseline 이라, 지금 미리 정리해 두는 게 시간 절약.
