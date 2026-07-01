# 10.a 사고 확장: 자문 질문 5개

각 질문마다 "왜 이 질문이 지금 나에게 중요한가" 를 2~3 줄로 답한다. 질문은 TimesFM 본문을 (i) 인접 track (APF/Grokking) 과, (ii) paused 자산 (P1 ProTran-TFA), (iii) shelved 자산 (RegFiLM/EOA) 에 연결시키는 축으로 배치.

## Q1. TimesFM 200M 의 attention pattern (20 layer × 16 head) 을 APF motif taxonomy 로 분류하면, 어느 depth × motif 조합이 다수를 차지하는가?

**왜 중요한가**: APF main paper §3 은 motif typology 를 소형 실험 (4-layer × 4-head sinusoidal PE 시계열 GPT) 에서만 검증. TimesFM 은 20 층 × 16 head, no-PE (v2.0+), 100B pretraining 된 대규모 실전 모델. 이 큰 모델에서도 APF motif 6-class 가 재현되면 taxonomy 의 **scale-invariance** 가 강하게 검증됨. 만약 새로운 motif 가 관찰되면 taxonomy 확장 근거. 실험 비용은 TimesFM 1.0 200M 체크포인트 다운로드 + 소량 시계열 (예: ETT-mini 1000 계열) 로 forward → attention pattern 저장 → APF classifier 적용. GPU 1 대로 하루 이내 예상.

## Q2. TimesFM v1 의 미보정 10-quantile head 를 conformal prediction 으로 post-hoc calibrate 하면, MOIRAI 의 4-mixture native probabilistic 대비 CRPS 격차가 얼마나 줄어드는가?

**왜 중요한가**: P1 ProTran-TFA 의 존재 이유가 "calibrated during training" 인데, 만약 conformal post-hoc 로 격차가 크게 줄면 P1 의 differentiation 이 약해진다. 반대로 격차가 여전히 크게 남으면 P1 의 "training-time calibration" 이 실증적 정당화. 실험 비용 낮음: TimesFM 1.0-200m 체크포인트 + Monash 벤치마크 subset + conformal wrapper 코드 (예: MAPIE 라이브러리) 로 수 시간 내 수행 가능.

## Q3. TimesFM 을 처음부터 재학습하되 100B corpus 대신 1B 로 축소하면, downstream zero-shot 성능이 어떻게 감소하며 그 감소 곡선이 Liu et al. 2022 4-phase diagram 의 comprehension → grokking → memorization 전이를 재현하는가?

**왜 중요한가**: 이 질문이 Grokking TS Transformers 프로젝트의 심장. TSFM 학습이 정말 "충분 데이터 → comprehension" 을 사용하는지, 데이터 부족 조건에서 grokking-like delayed generalization 이 나타나는지 확인. 실험 비용은 크다 (재학습 필요) 하지만 100B → 1B → 10M → 100k 로 log-scale 스캔하면 Liu 4-phase 를 재현 가능. GPU/TPU 예산 확보 필요. 결과는 NeurIPS 2027 plan 의 핵심 novel contribution 이 될 수 있음.

## Q4. TimesFM 의 3-단계 frequency indicator 를 (a) 연속 log-Δt embedding 으로 대체, (b) 완전히 제거 (v2.5 방향), (c) fine-grain regime label (RegFiLM 방향) 로 확장 — 세 변형의 zero-shot 성능 차이는?

**왜 중요한가**: TimesFM 저자 스스로 v2.5 에서 frequency indicator 를 폐기했지만 그 근거를 학술적으로 정량화한 논문은 아직 없음 (v2.5 는 README 만 있고 별도 논문 없음). 만약 (b) 가 최적이면 왜 그런가 — sampling rate 정보가 실제로 학습에서 자동 흡수되는지, 아니면 conditioning 이 downstream 편향을 만드는지. 이 질문의 답이 RegFiLM/EOA (shelved) 를 재활성화할지 결정. 실험 비용은 finetuning 규모.

## Q5. TimesFM 을 heavy-tailed 시계열 (예: 금융 log-return, S&P 500 일간, 지진 진폭, LOB spread) 에 zero-shot 으로 던지면, MSE/MAE 기반 성능은 어떻게 무너지고 tail-aware 지표 (VaR miss ratio, Expected Shortfall) 는 어떻게 실패하는가?

**왜 중요한가**: TimesFM 의 pretrain corpus 가 Google Trends + Wiki pageviews 라 heavy-tail 이 상대적으로 얕음. 금융 · 지진 · 시장 극단값처럼 heavy-tail dominant 시계열에서 이 corpus bias 가 얼마나 무너지는지가 P1 ProTran-TFA 및 shelved AETHER (BTC cycle) 의 응용 관점에서 중요. 만약 심하게 무너지면 P1 이 "TSFM zero-shot 은 tail 응용에 부적합" 이라는 강한 논거를 확보. 실험 비용은 낮음 — 공개 금융 데이터 + TimesFM zero-shot forward 로 하루 이내.
