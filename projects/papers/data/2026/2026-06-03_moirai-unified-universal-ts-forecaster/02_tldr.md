# 1. 3층 TL;DR

## 🧒 초등학생 수준 (그림으로)

옛날에는 시계열 예측을 이렇게 했어요. **"전기 사용량을 맞추는 인공지능"**, **"비행기 승객 수를 맞추는 인공지능"**, **"날씨를 맞추는 인공지능"** — 각각 다른 인공지능을 따로따로 만들어서, 자기 분야 데이터만 보고 공부시켰지요. 마치 *국어 선생님, 수학 선생님, 영어 선생님이 따로 있어서, 다른 과목은 절대 가르치지 못하는 학원*과 같아요.

이 논문은 묻습니다 — **"하나의 슈퍼-과외 선생님이 모든 과목을 한꺼번에 가르치게 만들 순 없을까?"** 마치 *챗GPT 가 영어로 물어도 한국어로 물어도 같은 모델 하나가 다 대답하는 것*처럼요.

문제는 시계열은 글이나 그림과 달리 *형태가 너무 제각각*이라는 점이에요. 어떤 데이터는 1분마다, 어떤 건 한 시간마다, 어떤 건 일 년에 한 번 기록돼요. 어떤 건 변수가 1개, 어떤 건 1,000개에요. 어떤 건 항상 양수(전기 사용량), 어떤 건 음수도 가능(주식 수익률), 어떤 건 정수만 가능(고객 수). 한 모델이 이 모든 걸 다루려면 **세 가지 트릭**이 필요했어요:

1. **여러 크기의 패치 (Multi-Patch-Size)**: 한 시간짜리 빠른 데이터는 큰 조각으로, 일 년짜리 느린 데이터는 작은 조각으로 잘라요. *책 두께가 다른 책들을 동일한 손가락 두께로 넘기지 말고, 두꺼운 책은 큰 손가락, 얇은 책은 작은 손가락으로 넘기는 셈*.
2. **무엇이든-변량 어텐션 (Any-variate Attention)**: 변수가 몇 개든 상관없이 모든 변수를 한 줄로 쭉 펴서, *"같은 변수끼리"* 와 *"다른 변수끼리"* 만 따로 표시하면 그만이에요. *반-친구 자리배치에서, 같은 반은 가까이, 다른 반은 멀리 — 만 표시하면, 학생 수가 30명이든 300명이든 똑같이 작동*.
3. **혼합 분포 (Mixture Distribution)**: 미래가 *"평균 100, 더 클 수도 작을 수도 있다"* 라고만 말하는 게 아니라, *"학생-T 분포 35%, 음이항분포 25%, 로그정규 25%, 좁은-정규 15%"* 처럼 여러 모양을 섞어서 표현. *주사위 하나로는 1-6 만 나오지만, 주사위 4개를 모양 다르게 만들면 어떤 숫자 패턴이든 흉내낼 수 있는 셈*.

이 세 트릭으로 만든 모이라이를 **270억 개 관측치(LOTSA, 9개 도메인)** 로 한 번 학습시키면, *처음 본 데이터셋도 추가 학습 없이* (zero-shot, "처음 보고 바로 맞히기") 잘 예측해요. 마치 한 번도 본 적 없는 책을 읽자마자 줄거리를 요약할 수 있는 *진짜 똑똑한 선생님*인 셈이에요.

## 🎓 학부생 수준

이 논문은 시계열 예측 분야의 *foundation model* 패러다임 전환을 시도한 ICML 2024 Oral 페이퍼다. 기존 deep forecasting 은 **one-model-per-dataset** — Informer / Autoformer / PatchTST 모두 ETTh1 학습한 모델은 ETTh1 만, Weather 학습한 모델은 Weather 만 다룬다. 저자들은 이를 *"FM 시대 이전의 antiquated paradigm"* 으로 규정하고 **단일 사전학습 모델이 임의의 시계열 예측 문제를 다루는 universal forecaster** 를 목표한다.

핵심 문제는 시계열의 *이질성(heterogeneity)*: (i) **frequency** 가 yearly / quarterly / monthly / ... / second-level 까지 7-8 단계로 흩어져 있어 cross-frequency 학습 시 negative interference 발생, (ii) **variate 차원** 이 데이터셋마다 1~수백으로 다르고 변수 의미도 다름, (iii) **분포** 가 양수만 / 정수만 / 대칭 / 비대칭 등 제각각.

해법 MOIRAI 는 마스크드 인코더 Transformer 위에:

1. **Multi-Patch-Size Projection** — 사전정의 표(Appendix B.1)로 freq → patch size 매핑(고주파 = 큰 patch). 하나의 weight set 만 학습.
2. **Any-Variate Attention** — 다변량을 한 시퀀스로 평탄화. attention score $E_{ij,mn} = (W^Q x_{i,m})^T R_{i-j} (W^K x_{j,n}) + u^{(1)} \mathbb{1}_{m=n} + u^{(2)} \mathbb{1}_{m \ne n}$, 즉 시간 차원은 RoPE 회전행렬 $R_{i-j}$, 변량 차원은 학습 가능 스칼라 $u^{(1)}, u^{(2)}$ 두 개로 표지. 변량 순서 permutation-equivariant, 변량 개수 무관.
3. **Mixture Distribution Head** — Student-T(꼬리), Negative Binomial(이산 양수), log-normal(우측편향), low-var Normal(고확신). softmax 가중치로 단일 확률밀도함수 $p(Y_{t:t+h}|\phi) = \sum_{i=1}^c w_i p_i(Y_{t:t+h}|\phi_i)$ 구성.

학습 데이터로 LOTSA — 9 도메인 27.6B 관측치 — 를 공개. AdamW (lr 1e-3, wd 1e-1, β2=0.98), 1M 스텝(base/large), batch 256, A100-40G 에서 sequence packing 적용(padding 61.08% → 0.38%). 평가는 in-distribution(Monash) + out-of-distribution(probabilistic 6개 + long-sequence 6개), zero-shot 만으로 dataset-specific full-shot SOTA 와 동등 / 우위 달성.

## 🔬 전문가 수준 (Contribution 4개)

1. **새 architecture component 3종 패키지 (§3.1)**: (a) freq-bucketed 다중 patch-size projection layer set 의 동시 학습(공유 weight 매핑, projection 1개당 patch size 하나 — Appendix B.1 에 단일 사전정의 lookup); (b) Any-Variate Attention — RoPE × binary attention bias 의 하이브리드. RoPE 는 임의 시간 인덱스, bias 는 임의 변량 인덱스. 변량 permutation invariance/equivariance 와 임의 변량 수 모두 만족(저자 명시); (c) 4-mixture distribution head 와 학습 시 NLL 최적화 — Awasthi et al. 2022 (LR-consistent target metric) 의 결과 활용. 세 component 가 "임의 변량 + 임의 frequency + 임의 분포" 의 3-축 보편성을 분해.

2. **LOTSA — 27,646,462,733 관측치 9-도메인 open archive (§3.2.1)**: Energy 16.4B (59.17%) / Transport 4.9B (17.73%) / Climate 4.2B (15.15%) / CloudOps 1.5B / Web 428M / Sales 198M / Nature 28.5M / Econ-Fin 24.9M / Healthcare 1.6M. Frequency 분포 hourly 71.89%, minute-level 25.37%. 이전 최대치(Monash + GluonTS ≈ 1B obs, TimesFM 의 비공개 100B+) 대비 *공개* 자원에서 최대 규모. Sub-dataset sampling cap ε=0.001 으로 도메인 불균형 완화(Energy 가 단순 비례하면 60% 점유).

3. **Unified Training pipeline (§3.2.2)**: (a) 가변 context $l$ + 가변 forecast horizon $h$ — 단일 시간 윈도우에서 [0.15, 0.5] 범위 horizon 비율 균등 샘플; (b) max seq len 512(post-flatten); (c) 변량 수는 beta-binomial(n=128, a=2, b=5) 평균 37 으로 샘플, 단변량 sub-dataset 은 랜덤 concat 으로 다변량 합성; (d) sequence packing 으로 padding 61.08% → 0.38% (저자 측정).

4. **Zero-shot 평가 (§4) — full-shot SOTA 와 동등 / 우위**:
   - **Monash in-distribution** (Figure 3): Moirai-Small/Base/Large 모두 PR-Naive / N-BEATS / DeepAR / WaveNet / Transformer / TFT / TBATS 등 dataset-trained baseline 보다 낮은 normalized MAE.
   - **Probabilistic OOD** (Table 5, 6 데이터셋, CRPS / MSIS): Moirai-Large 가 Electricity CRPS 0.050(2nd, TiDE 0.048), Solar 0.406(best), Weather 0.041(best for Small) 등 4/6 best/2nd-best.
   - **Long sequence** (Table 6, ETT + Electricity + Weather, MSE/MAE 평균 over h={96,192,336,720}): Moirai-Large ETTh2 MSE 0.354 vs full-shot iTransformer 0.383 / TimesNet 0.414, Moirai-Base ETTm2 MAE 0.321 vs full-shot best 0.326 (PatchTST).
   - **Ablation (Table 7, Monash normalized MAE)**: 기준 0.655 → "w/o multi patch size" 1.156 (가장 큰 악화, +76%), "w/o Any-Variate Attention" 0.904 (+38%), "w/o mixture distribution" 0.740 (+13%), "w/o LOTSA" 0.809 (+24%), "w/o packing" 0.785 (+20%).

핵심 방어 주장은 **"보편 forecaster 는 in-domain SOTA 와 동률, OOD 는 zero-shot 만으로 가능"**. 한계 명시(§5): multi-patch-size 매핑이 *heuristic*, 고차원 변량 (≫128) 지원 제약, hyperparameter tuning 자원 제약, latent diffusion 미탐색. Impact statement 는 일반적 ML advancement 만 명시.
