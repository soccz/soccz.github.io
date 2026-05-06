# 09. 내 연구와의 연결

> 이 섹션은 `_profile.md`의 관심 영역 §A~F와 보유 자산(APF, Grokking track)에 구체적으로 연결한다. 일반론 나열 금지 — mechanism, axis, 수식 요소를 지정해 연결.

---

## §D 연결 (TS Transformers / TSFM Interp — APF 직접 입력)

### 연결 1: Chronos 어텐션 패턴이 APF의 "미발굴 광산"이다

APF 프레임워크의 현재 상태: 합성 TS 모티프(diagonal/stripe/block/edge/spike/checker) 위에서 sinusoidal/learned/RoPE/ALiBi PE가 만드는 어텐션 패턴을 PatchTST·iTransformer 수준 모델에서 분석한다.

Chronos는 T5 인코더-디코더 아키텍처에서 **4096 token 어휘로 표현된 이산 TS 시퀀스**를 처리한다. 이때 어텐션 패턴은 어떤 모습인가? 이 질문에 답한 논문이 아직 없다.

**구체 연결 포인트**:
- Chronos 인코더의 Self-Attention 가중치 행렬 $A^{(l,h)}[t, t']$ (레이어 $l$, 헤드 $h$에서 위치 $t$가 위치 $t'$를 얼마나 주목하는지) — APF의 "2D attention motif"로 직접 해석 가능
- Chronos가 주기성이 강한 시계열(M4 monthly)을 처리할 때의 어텐션 패턴 vs. 금융 시계열(랜덤워크 성질)을 처리할 때의 패턴 비교 — APF의 "입력 모티프 → 어텐션 모티프 매핑" 가설을 파운데이션 모델에서 테스트

**인용 포인트**: APF 논문 방법론 섹션에서 "분석 대상 아키텍처"를 소개할 때, Chronos를 "TS 파운데이션 모델의 대표 사례"로 나열하고 "자기회귀 토큰 예측 설정에서의 어텐션 패턴은 별도 탐구가 필요하다"는 맥락으로 인용 가능.

### 연결 2: TSFM 해석론의 공백 — Wilinski 2025와의 비교

Wilinski et al. (ICML 2025, "Exploring Representations and Interventions in TS Foundation Models")은 TSFM의 내부 표현에 개입(intervention) 실험을 한다. Chronos는 이 논문의 분석 대상 중 하나일 가능성이 높다.

**구체 연결 포인트**: APF가 제안하는 "CNN probe로 어텐션 패턴에서 모티프를 분류하는" 방법론을 Chronos에 적용하면, Wilinski 2025와 직접 비교 가능한 보완적 분석이 된다. Wilinski가 "표현(representation)" 공간에 초점을 맞춘다면, APF는 "어텐션(attention)" 공간에 초점을 맞추는 차별화.

---

## §A 연결 (Grokking — 훈련 동학 직접 입력)

### 연결 3: Chronos 사전학습에서 Grokking이 일어나는가?

Chronos 학습의 구조를 Grokking 렌즈로 보면:
- 입력: 이산 토큰 시퀀스 $c_1, \ldots, c_T$
- 출력: 다음 토큰 분포 $P(c_{T+1} \mid c_1, \ldots, c_T)$
- 손실: Cross-entropy

이것은 Nanda et al. (2023, Progress Measures for Grokking)이 분석한 모듈식 산술 학습과 **구조가 동일**하다 — 이산 입력 → 다음 토큰 예측 → cross-entropy. 차이는 (1) 입력이 4096 어휘의 수치 토큰, (2) 시퀀스 길이가 512, (3) 데이터가 진짜 시계열.

**핵심 가설**: Chronos 학습 과정에서도 "처음엔 암기(memorization), 이후 일반화된 알고리즘 형성"이라는 Grokking 패턴이 나타나는가? 특히:
- 주기성 패턴(M4 monthly) 학습 시: Fourier 알고리즘 형성? (Nanda et al.의 modular addition Fourier circuit과 analogous)
- 추세 패턴 학습 시: 선형 외삽 알고리즘 형성?
- 무작위 금융 패턴 학습 시: Grokking 없이 암기만?

**인용 포인트**: Grokking track 논문 §2 Related Work에서 "Grokking이 언어모델 학습에서 일어나는 것처럼(Nanda 2023), TS 파운데이션 모델 학습에서도 유사한 지연 일반화가 나타날 수 있다는 가설을 세운다. Ansari et al. (2024)의 Chronos는 cross-entropy 기반 이산 토큰 예측 모델로, Grokking 분석의 자연스러운 출발점이 된다."

### 연결 4: 비정상성(Non-stationarity)과 Grokking의 교차

Chronos는 사전학습 후 새 데이터셋에서 fine-tuning 없이 예측한다. 하지만 금융 TS처럼 분포가 지속 변화하는 시계열에서는 어떻게 되는가? 이것은 Grokking track의 "non-stationarity × grokking" 교차점과 연결된다:

- Lyle et al. (2025, "Grokking and Primacy Bias in Continual Learning") 이 제안한 틀: continual learning 환경에서 grokking이 "primacy bias"를 낳는다 — 초기 데이터 패턴을 과도하게 기억해 새 패턴을 학습하지 못하는 현상.
- Chronos의 사전학습 후 fine-tuning 없는 zero-shot 사용이 바로 이 상황과 유사하다 — 사전학습 분포와 다른 새 TS에 대한 성능 저하.

**내 연구에서의 활용**: Grokking track §2에서 "사전학습 TS 모델이 비정상 시계열에 노출될 때의 훈련 동학"을 future work로 언급하면서 Chronos를 구체적 분석 대상으로 명시할 수 있다.

---

## §E 연결 (금융 응용 — P1 ProTran-TFA와의 전이 가능성)

### 연결 5: Chronos의 이산화 토크나이제이션 → ProTran-TFA에 적용 가능성

P1 ProTran-TFA ("Probabilistic Transformer for Financial Asset Allocation", ⏸️ Paused)는 Transformer 기반 확률 예측 모델로, 금융 자산 배분에 적용하려는 초안이다.

**구체 전이 가능성**:
1. **토크나이제이션 transfer**: Chronos의 mean-scaling + bin quantization을 ProTran-TFA의 입력 파이프라인에 적용하면 교차 자산 학습(cross-asset pretraining)이 가능해진다. 서로 다른 자산(주식, 채권, 원자재)을 단일 모델에서 처리하는 공통 어휘를 만드는 것.

2. **한계 인식**: 금융 TS의 heavy-tail 분포는 균등 bin이 아니라 log-scale bin 또는 분포 적응 bin이 필요하다. 이 수정이 ProTran-TFA의 기술적 기여로 자리잡을 수 있다.

**인용 포인트**: ProTran-TFA 논문 방법론 섹션 "Tokenization"에서 "Chronos (Ansari et al., 2024)의 mean-scaling + uniform quantization을 금융 TS에 적용하면 heavy-tail에서 bin이 편향되는 문제가 있으며, 이를 수정하기 위해 우리는 log-return 기반 분위수 bin을 제안한다."

---

## 반면교사: Chronos가 못한 것을 내가 어떻게 다룰지

1. **어텐션 패턴 블랙박스**: Chronos는 어텐션이 무엇을 학습했는지 분석하지 않는다. APF는 이 공백을 채운다.

2. **훈련 동학 분석 부재**: 학습 곡선, grokking phase, 표현 구조 변화를 분석하지 않는다. Grokking track이 이 공백을 채운다.

3. **금융 TS 특화 설계 부재**: 균등 bin이 금융 tail risk에 부적합함을 인정하지만 해결하지 않는다. ProTran-TFA가 이 공백을 채울 수 있다.
