# 09_my_research — 내 연구와의 연결

이 절은 "Dissecting Chronos"가 APF 트랙과 Grokking 트랙 각각에 어떤 구체적 연결점을 제공하는지를 메커니즘·축·수식 수준에서 분석한다. "이 논문도 중요하다"는 일반론 대신, 어느 실험에서 어떤 수치를 어떻게 참조해야 하는지에 집중한다.

---

## APF 트랙 연결 — Attention Pattern Fields

### 연결 1: "어텐션 패턴 → 예측 기여" 인과 회로의 비교 기준

**APF의 현재 상태**: "PE → 2D attention motif → CNN probe → causal intervention" 파이프라인을 구성 중이며, TMAO method가 n=12에서 falsified됨. motif causality 실험 진행 중.

**APF의 핵심 질문**: "어텐션 헤드의 diagonal/stripe/block/edge/spike/checker 패턴이 예측에 인과적으로 기여하는가?"

**"Dissecting Chronos"가 제공하는 것**:
- APF는 어텐션 패턴(주의 가중치 행렬)의 인과성을 측정하려 하고, "Dissecting Chronos"는 활성화 공간의 SAE 특징 인과성을 측정했다. 측정 지표는 둘 다 ΔCRPS다.
- APF의 causal intervention 단계에서 "어텐션 패턴 하나를 제거하면 CRPS가 얼마나 변하는가"를 측정한다면, 그 ΔCRPS의 **규모 기준점**이 필요하다. "Dissecting Chronos"의 encoder.block.11 ΔCRPS=38.61 (최대치) 및 평균 ΔCRPS=5.15가 이 기준점을 제공한다.
- 구체적으로: APF의 causal intervention에서 diagonal 패턴 제거 → ΔCRPS = X가 나왔을 때, X가 encoder.block.11의 SAE 특징 절제 평균(5.15)보다 크다면 어텐션 패턴이 SAE 특징보다 더 인과적이고, 작다면 반대라는 논의가 가능해진다.

**수식 수준 연결**:
- APF의 인과 측정: $\Delta\text{CRPS}_{\text{head}} = \text{CRPS}(\text{attn\_patched}) - \text{CRPS}(\text{original})$
- Chronos의 인과 측정: $\Delta\text{CRPS}_{j} = \text{CRPS}_{\text{ablated}(j)} - \text{CRPS}_{\text{original}}$
- 두 공식은 동일한 구조다. APF에서 "어텐션 패턴"이 차지하는 역할을 "Dissecting Chronos"에서는 "SAE 특징"이 차지한다. APF 논문을 작성할 때 "인과 측정 방법론"의 related work로 Mishra 2026을 인용할 수 있다.

---

### 연결 2: 계층별 인과 중요도의 비교 가설

**"Dissecting Chronos" 발견**: encoder.block.11(중간) > encoder.block.5(초기) > encoder.block.23(최종) 순서로 인과 중요도.

**APF에의 함의**: APF에서 PE 타입별(NoPE/sinusoidal/RoPE/ALiBi) 어텐션 패턴의 인과 중요도를 레이어별로 측정할 때, Chronos에서 발견된 "중간 층 우위" 패턴이 재현되는지가 흥미로운 비교점이다.

**구체 가설**: 
> "PatchTST/iTransformer의 중간 어텐션 헤드에서 diagonal 패턴의 ΔCRPS가 초기/최종 헤드보다 클 것이다"

이 가설은 "Dissecting Chronos"의 계층 발견에서 직접 파생된다. APF 실험에서 레이어를 구분해서 측정하면 검증 가능하다.

---

### 연결 3: SAE 특징 vs. 어텐션 헤드 — 어떤 단위가 더 모노세맨틱한가?

**APF의 motif taxonomy**: diagonal, stripe, block, edge, spike, checker (6종)
**"Dissecting Chronos"의 feature taxonomy**: frequency_high, frequency_low, high_volatility, low_volatility, level_shift_up, level_shift_down, trend_up, trend_down, seasonality, noise (10종)

SAE 특징의 interpretable 비율이 encoder.block.23에서 59.81%이고 decoder에서 3~5%인 반면, APF의 어텐션 패턴은 어떤 비율로 "해석 가능"한가? 이 두 표현의 해석 가능성 비율 비교가 "TS Transformer의 내부 표현 중 어느 것이 더 모노세맨틱한가"라는 독립적 질문을 형성한다.

---

## Grokking 트랙 연결 — Grokking in TS Transformers

### 연결 1: "학습 중 SAE 특징 계층이 어떻게 변하는가" — Grokking과의 직접 교차

**Grokking 트랙의 핵심 질문**: TS Transformer가 특정 시점(grokking transition)을 기점으로 예측 성능이 비약적으로 향상될 때, 내부 표현에서 무슨 일이 일어나는가?

**"Dissecting Chronos"가 제공하는 프레임**: Chronos의 훈련 완료 시점에서 SAE 특징 계층(초기=주파수, 중간=레벨시프트, 최종=계절성)이 발견됐다. 그렇다면 **훈련 과정 중** 이 계층이 언제 형성되는가?

**Grokking 교차 가설**:
> "TS Transformer의 grokking transition 직전에는 SAE 특징이 난잡하게 분포하고(interpretable 비율 낮음), transition 이후에는 계층 구조가 선명하게 형성된다(interpretable 비율 급증)."

이 가설이 사실이라면, **"feature hierarchy formation = grokking의 mechanistic 설명"** 이 된다.

**수식 수준 연결**:
- Grokking 실험에서 체크포인트별 SAE를 훈련: checkpoint_t에서 interpretable_ratio(t) 측정
- 훈련 손실 L(t)와 interpretable_ratio(t)의 상관이 생기면 계층 형성이 grokking의 내부 메커니즘
- 만약 $\frac{d(\text{interpretable\_ratio})}{dt} > 0$이 $\frac{d(\text{test\_acc})}{dt} > 0$보다 먼저 발생한다면, 특징 계층 형성이 grokking을 *선도(precede)*한다는 인과 순서가 형성된다.

---

### 연결 2: "non-stationarity가 SAE 특징 계층을 변화시키는가"

**Grokking 트랙의 비정상성(non-stationarity) 축**: ETT, Weather 같은 비정상 시계열에서 grokking이 발생하는지, 발생 시점이 달라지는지가 핵심 변수.

**"Dissecting Chronos" 연결**:
- ETT에서 분석된 SAE 특징 계층이 비정상성의 정도(degree of non-stationarity)와 어떤 관계인가?
- 비정상 구간(레벨 시프트 발생 윈도우)에서의 특징 활성화 패턴 vs. 정상 구간에서의 패턴 비교가 Grokking 실험의 전처리 단계로 활용 가능하다.
- 특히 "level_shift_up/down" 특징이 중간 인코더에 집중된다는 발견은, Grokking 실험에서 레벨 시프트를 인위적으로 제어하여 "비정상 사건이 grokking 속도에 영향을 미치는가"를 테스트하는 독립 변수로 사용할 수 있다.

---

### 연결 3: feat#4616 수준의 "병목 특징"이 Grokking transition에 언제 나타나는가

**"Dissecting Chronos" 발견**: encoder.block.11의 feat#4616 하나가 전체 예측 품질의 약 28배 악화를 일으킨다. 이런 "병목 특징"은 특정 훈련 단계에 갑자기 형성되는가, 아니면 점진적으로 발달하는가?

**Grokking 연결**: NLP grokking 연구(Nanda 2023 Fourier circuit)에서 "복잡한 내부 회로가 grokking transition 근처에서 갑자기 형성됨"이 발견됐다. 동일 현상을 TS Transformer의 SAE 병목 특징에서 찾으면:
- 훈련 체크포인트 {1K, 5K, 10K, 20K, 50K steps}에서 SAE 훈련 → 각 체크포인트의 top-1 ΔCRPS 특징 식별
- top-1 ΔCRPS의 크기가 훈련 진행에 따라 **갑자기(discontinuously)** 증가하는 시점이 grokking transition과 일치하는지 측정
- 이 실험이 "병목 특징 출현 = grokking의 mechanistic signal"이라는 연결을 검증한다.

---

## P1 ProTran-TFA 연결 (⏸️ Paused, 재개 가능)

**ProTran-TFA의 정체**: 2022AEL 기반 probabilistic Transformer를 금융 시계열 예측에 적용하는 프로젝트. 확률적 예측(CRPS 기반 평가)과 finance venue 출판이 목표.

**"Dissecting Chronos" 연결**:
- "Dissecting Chronos"에서 CRPS가 평가 지표로 사용된 것은 ProTran-TFA의 평가 프레임워크와 동일하다.
- 더 직접적으로: "Dissecting Chronos"에서 Chronos가 ETT에서 베이스라인 CRPS 1.392를 달성하는 것과 ProTran-TFA의 CRPS를 비교하면, 파운데이션 모델 대비 specialized 모델의 경쟁 구도를 정량화할 수 있다.
- "Dissecting Chronos"가 보여주는 "돌발 역학(level shift)이 예측의 인과적 병목"이라는 발견은, ProTran-TFA에서 금융 시계열의 돌발 충격(fat-tail events, flash crashes)이 CRPS 악화의 주된 원인임을 mechanistic하게 설명하는 근거가 된다.
- 즉, ProTran-TFA 논문의 "왜 CRPS가 특정 구간에서 악화되는가"에 대한 이론적 답변을 "Dissecting Chronos"의 계층 발견으로 뒷받침할 수 있다.

---

## 즉시 활용 가능한 실험 아이디어 (두 트랙)

**APF 즉시 실험**:
- APF causal intervention의 ΔCRPS를 레이어별로 집계 → "Dissecting Chronos"의 레이어별 평균 ΔCRPS와 비교표 작성
- 어텐션 헤드의 "diagonal 패턴 ΔCRPS" vs. encoder.block.11 "SAE 특징 평균 ΔCRPS=5.15" 수치 비교
- 예상 결과: diagonal 패턴이 5.15보다 크다면 "어텐션 패턴이 SAE 특징보다 더 인과적"이라는 APF 논문의 강한 claim이 가능해진다.

**Grokking 즉시 실험**:
- Chronos 훈련 재현 (mini version, 1/10 데이터) + checkpoint별 SAE 훈련
- interpretable_ratio(t) 곡선 vs. test_CRPS(t) 곡선 비교 그래프 생성
- 이 그래프 하나가 "grokking = feature hierarchy formation"이라는 주장의 핵심 도표가 된다.

---

## 인용 계획

이 논문을 APF 논문 또는 Grokking 논문에서 인용하는 가장 적합한 위치:

**APF 논문**: Related Work → "Causal Interpretability of Time Series Models" 섹션
- 인용 포인트: "Mishra (2026)는 동일한 ΔCRPS 기반 인과 측정 프레임워크로 SAE 특징의 인과성을 검증했다."

**Grokking 논문**: Introduction 또는 Background → "Mechanistic Interpretability for TS Transformers" 섹션
- 인용 포인트: "Mishra (2026)는 훈련 완료된 Chronos에서 레이어별 SAE 특징 계층을 보였으며, 우리는 이 계층이 훈련 동역학(grokking)과 어떻게 연결되는지를 조사한다."

---

*→ 이전: `08_lineage.md` | 다음: `10_extensions_a_questions.md`*
