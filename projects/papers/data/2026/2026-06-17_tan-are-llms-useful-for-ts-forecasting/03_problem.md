# 03. 문제 지형도 — "LLM 이 시계열에 좋다" 는 주장이 어디서 어떻게 세워졌나

## 배경 사다리

이 절을 이해하려면 ① **사전학습 (pretraining)** 이 "어떤 데이터로 모델을 미리 익히게 해 놓고 다른 일에 활용한다" 는 절차임을, ② **fine-tuning** 이 "그 미리 익힌 모델을 새 일감에 맞춰 살짝 다시 튜닝" 하는 절차임을, ③ **ablation** 이 "어떤 부품을 빼거나 바꿔서 성능에 미치는 영향을 측정" 하는 실험 기법임을 알면 된다. 또 ④ **시계열 예측 (TS forecasting)** 은 "과거 길이 $L$ 의 관측값으로 미래 길이 $H$ 의 값을 예측" 하는 일이라는 것까지.

## 1) 이 논문이 푸는 *실제* 문제 — 일상 예시 3개

- **공장 온도 모니터링**: ETT 데이터셋이 다루는 발전소 변압기 oil temperature. 24시간 주기 + 계절 추세 + 갑작스러운 부하 스파이크. "내일 새벽 3시 온도를 예측" 같은 작업.
- **전력 수요 예측**: Traffic / Electricity / Weather 데이터셋이 다루는 산업적 시계열. 다중 지역 × 다중 센서 × 비정상성(공휴일, 폭염, 계절 변화).
- **질병 발생률 (Illness)**: 주간 인플루엔자-like 환자 수. 연간 주기 + 팬데믹 같은 비정상 점프 + 적은 표본.

이 모든 작업의 공통점: **수십~수천 개 단위변수의 길이 수백~수천 시점 시계열에서, 다음 96~720 시점을 예측** 하는 것. 정량 평가는 MSE / MAE (점 예측 오차) 가 표준.

여기에 2023년부터 새로운 트렌드가 한 줄기 들어왔다: **"GPT-2 / LLaMA / T5 같은 자연어 LLM 의 가중치를 가져와 시계열 백본으로 쓰자"**. 이를 통칭 **LLM-for-TS** 라고 부른다. Tan 2024 가 정면으로 검증하는 가설은 이거다.

## 2) 기존 접근 계보 — 6개 이정표 연대순

### (1) Informer (Zhou 2021, AAAI) — *"트랜스포머 자체로 시계열을 잘하자"*

- 무엇이었나: 첫 번째로 대규모 시계열 forecasting 을 정통 트랜스포머 인코더-디코더로 해결한 작업. ProbSparse attention 으로 sequence length 의 $O(L \log L)$ 시간복잡도 달성.
- 왜 부족했나: PE (positional encoding) 와 attention 의 조합이 실제로 *주기성·계절성* 을 학습하는지 분석 부재. DLinear (Zeng 2023) 가 "Linear 모델로도 충분" 이라며 부분 반박.
- 교훈: 시계열 트랜스포머의 추가 가치를 ablation 으로 입증해야 한다.

### (2) PatchTST (Nie 2023, ICLR) — *"시계열을 토큰처럼 patch 단위로 자르자"*

- 무엇이었나: 길이 $L$ 의 시계열을 길이 $p=16$ 의 patch 로 잘라 토큰처럼 다루는 채널-독립 트랜스포머. **patch + channel-independent attention** 의 단순 조합으로 SOTA.
- 왜 부족했나: LLM 백본을 쓰지 않는 PatchTST 가 동등 또는 더 잘하는데도 LLM-기반 후속들이 "우리는 LLM 이라서 잘한다" 라고 주장. 인과 분해 부재.
- 교훈: **Patch-기반 토큰화 + 작은 어텐션** 이 핵심이고 그 위에 무엇이 얹히든 큰 차이 없을 가능성. 본 논문 Tan 2024 의 PAttn baseline 의 직접적 사상적 조상.

### (3) OneFitsAll / GPT4TS (Zhou 2023, NeurIPS) — *"GPT-2 가중치를 얼리고 LoRA 만 풀자"*

- 무엇이었나: GPT-2 의 transformer block 을 *완전히 얼리고* (혹은 LayerNorm 만 풀어두고) 입출력 어댑터만 시계열에 학습. ETT / Weather / Traffic 등에서 SOTA 주장. "LLM 백본의 representation power 가 시계열에도 전이된다" 는 강한 주장.
- 왜 부족했나: GPT-2 가중치가 *실제로 시계열 신호 변환에 기여* 하는지의 검증 부재. 어댑터만 학습하니까 잘 되는데 그 어댑터가 LLM 안에서 다 한다는 보장 없음.
- 교훈: "사전학습 가중치 = magic" 가설은 cleaner ablation 필요. 이게 Tan 2024 의 직접 표적.

### (4) Time-LLM (Jin 2024, ICLR) — *"시계열을 자연어 prompt 로 reprogramming 하자"*

- 무엇이었나: 시계열 patch 를 텍스트 token embedding 공간으로 "reprogramming" 하고 prompt-tuning. LLaMA / GPT-2 백본 그대로. Dataset prompt ("This is electricity load data...") 를 직접 흘려넣는다.
- 왜 부족했나: reprogramming 모듈 자체가 학습 가능한 cross-attention 이라, *실제로 LLM 이 텍스트로 시계열을 "이해" 하는지* 와 "reprogramming 모듈이 다 잘하는 거 아닌지" 가 분리 불가.
- 교훈: "LLM 이 텍스트 prompt 로 시계열을 이해" 라는 주장이 너무 강함. Tan 2024 가 가장 비싼 학습 비용 (28.2× 가속 가능) 의 모델로 정조준.

### (5) CALF (Liu 2024) — *"LLM 의 word embedding 분포와 시계열 분포를 정렬하자"*

- 무엇이었나: 시계열의 patch 분포를 LLM 의 cross-modal 정렬 모듈을 통해 word-embedding 분포에 *분포 일치* 시키는 것. cross-modal 정합으로 cross-modal transfer 의 신뢰성 강화.
- 왜 부족했나: 정렬 자체가 효과적이면, LLM 백본 없이도 정렬 모듈 + 작은 attention 이면 충분할 가능성. (그게 정확히 Tan 2024 의 발견.)
- 교훈: 정렬 모듈 vs LLM 의 효과 분해 필요.

### (6) LLaTA / Lag-Llama / Chronos / MOIRAI / TimesFM (2024 후반기) — *"진짜 시계열 전용 foundation model 을 처음부터 사전학습하자"*

- 무엇이었나: LLM 가중치를 빌리는 게 아니라, *시계열 코퍼스* (예: Chronos 84B token, MOIRAI 27.6B token from LOTSA) 로 처음부터 시계열 foundation 모델을 사전학습. 또 다른 라인: 분포 head + tokenizer + autoregressive decoder.
- 왜 부족했나 / 부족하지 않았나: 본 Tan 2024 의 범위 *밖* — 본 논문은 LLM (자연어) 가중치를 재사용하는 OFA/Time-LLM/CALF 만 직접 ablation. Chronos/MOIRAI 는 "LLM 이 아니라 TSFM 이다" 라서 본 결론이 직접 적용되지 않는다.
- 교훈: Tan 2024 의 결론은 **LLM (자연어 사전학습) → TS** 라인에 *한정* 됨. TSFM (시계열 사전학습) → TS 는 본 ablation 으로 부정되지 않는다 (이 구분이 본 해체의 §07 한계 절에서 핵심).

## 3) 기존 방법들이 공통으로 놓친 *핵심 gap*

> **"LLM 백본의 effect 와 입출력 adapter + 작은 attention 의 effect 가 인과적으로 분리되지 않은 채, 전체 시스템 성능을 '백본 덕분' 으로 귀속시켜 왔다."**

이는 *attribution fallacy* 의 전형 — "A + B 가 잘하면 A 덕분이다" 라고 가정하지만, 실제로는 B 만 있어도 같거나 더 잘할 수 있다. Mech interp 의 ablation 원칙 (Conmy ACDC, Wang IOI, Marks SFC) 이 *LM 내부 회로 수준* 에서 했던 것을, Tan 2024 는 *모델 아키텍처 수준* 에서 한다.

## 4) 이 논문이 그 gap 을 어떻게 메우는가

**3 ablation 변형 × 3 LLM-base 모델 × 7 데이터셋** 격자 평가로 LLM 백본의 *조건부 추가 가치* 를 직접 측정. 통제 절차:

1. base model 의 입출력 인터페이스를 그대로 유지 (즉 patch tokenizer, projection, forecast head 는 그대로).
2. *LLM 블록만* 빼거나 (w/o LLM) 단일 무작위 초기화 attention/transformer 블록으로 교체.
3. 같은 데이터/하이퍼파라미터/평가 split 으로 비교.

여기에 더해 PAttn 이라는 "원시적 패치-어텐션 1층 모델" 을 동등 비교에 넣어, **"LLM 까지 갈 것 없이 패치 + 단일 어텐션 + 직선 투영 만으로 SOTA 가 나온다"** 는 양성 결과까지 같이 제출. 이 양성 결과가 음성 결과 (LLM 무용) 의 *대안* 을 제시함으로써 논문의 메시지가 단순한 *비판* 이 아니라 *대안 제시* 가 된다. NeurIPS 2024 Spotlight 으로 인정된 이유의 절반은 이 *양성+음성 결합 메시지* 의 균형감이라고 본다.
