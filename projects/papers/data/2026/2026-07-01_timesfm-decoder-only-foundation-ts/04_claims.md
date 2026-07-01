# 04. 핵심 Claim 해체

## 배경 사다리

이 절에서 "claim" 은 논문이 실증 또는 이론으로 뒷받침하려고 시도한 **주장** 이다. 각 claim 을 "무엇을 어디에서 어떻게 뒷받침했는지" 로 해체한다. TimesFM 은 실증 (empirical) claim 이 이론 claim 보다 훨씬 많은 논문이라, 각 claim 은 대체로 §5 실험표에서 뒷받침되지만, 본 remote 환경에서 원 PDF 표 절대 수치를 확인하지 못했으므로 "논문 §5.x 표에서 뒷받침" 이라는 위치 정보만 단정하고 절대 수치는 인용하지 않는다.

---

## Claim 1. Decoder-only Transformer + patching + 100B pretraining 은 **zero-shot 으로 supervised SOTA 근처 성능** 을 낸다.

- **주장**: 사전학습된 TimesFM 을 downstream 데이터에 손대지 않고 zero-shot 으로 던져도, 각 dataset 에 직접 supervised 학습된 SOTA 모델과 견줄 만한 예측 정확도를 낸다. 논문 abstract 의 핵심 문장이자 논문 전체의 존재 이유.
- **증거**: 원문 §5 experiments — Monash benchmark, Darts benchmark, ETT/Weather/Electricity/Traffic long-horizon TS benchmark, 그리고 논문 이후 저자 README 는 GIFT-Eval leaderboard 도 언급 (TimesFM 2.0 aggregated MASE #1, 다음 최고 대비 6% 우위). 원 논문 시점에는 아직 GIFT-Eval 미공개 → 논문에서는 Monash/Darts/ETT-family 가 중심.
- **숨은 전제**: (i) downstream 시계열이 pretraining corpus 와 통계적으로 어느 정도 겹친다 — Google Trends 검색 관심도가 다양한 human-driven periodicity 를 포함하므로 세상 대다수 시계열이 이 통계 안에 들어간다는 가정. (ii) MASE / MAE 같은 point-forecast metric 이 downstream task 의 "성공" 을 대표한다 — 확률적 성공은 이 claim 이 다루지 않음.
- **쉬운 말 풀이**: "한 번 크게 훈련시켜둔 예측 로봇이, 처음 보는 새 데이터에도 손 안 대고 대충 잘 맞춘다. 잘 맞추는 수준은 그 데이터로 처음부터 훈련시킨 최고 모델과 비슷하다."

### Claim 1 의 위험 지점

이 claim 은 **비교 대상의 공정성** 에 예민하다. supervised SOTA 가 각 벤치마크에 얼마나 튜닝되어 있는지가 결과를 크게 바꾼다. 예를 들어 ETT 벤치마크에서 iTransformer / PatchTST / TimesNet 은 lookback / patch / head 수를 seed 별로 grid-search 한 상태이고, 이런 튜닝된 supervised 모델과의 격차를 "zero-shot vs supervised" 라는 축으로만 해석하면 오해 여지가 있다.

---

## Claim 2. **Output patch length $h$ 를 input patch length $p$ 보다 크게** ($h > p$, 논문은 $h=128, p=32$) 두는 것이 좋다.

- **주장**: autoregressive rollout 을 patch 단위로 하는데, 한 번에 예측하는 output patch 를 input 보다 4배 크게 두면 (i) rollout 횟수가 줄어 오차 누적 감소, (ii) 학습 시 batch 당 예측 감독 신호 증가, (iii) 긴 horizon 예측 wall-time 감소.
- **증거**: 원문 §3 model architecture + §5.x ablation (원 PDF 표 절대 수치 미확인). 저자 README + 여러 secondary reviewer 가 이 $p=32, h=128$ 값을 논문 §3 verbatim 으로 재인용.
- **숨은 전제**: (i) 짧은 horizon (예: 128 미만) 은 한 번의 forward 로 마감돼서 rollout error 가 없거나 미미하다. (ii) $h=128$ 이 만드는 학습 시 감독 신호 증가가 model capacity 를 다 흡수한다 — 즉 $h$ 를 더 늘려도 (예: $h=512$) marginal gain 이 남는가는 별개 문제.
- **쉬운 말 풀이**: "한 번에 4개의 다음 조각을 뽑아라. 한 조각씩 뽑으면 오래 걸리고 오차도 쌓인다."

### 대체 설계

이 선택의 대안 3개.

1. **$h = p$ (동일 길이)**: 언어 모델의 next-token prediction 과 정확히 동형. 하지만 rollout 이 4배 늘어남 → 오차 누적 커짐.
2. **$h < p$ (짧은 예측 패치)**: 각 forward 가 예측 감독 신호를 조금만 받음 → 학습 효율 감소. 언어 모델 관점에서 이유 없음.
3. **Variable $h$ (adaptive)**: horizon 이 짧으면 한 번에 다 뽑고, 길면 rollout. TimesFM 은 이걸 안 하고 고정 $h=128$; 이후 후속 (예: TimesFM-ICF 2410.24087) 이 이 방향을 탐색.

TimesFM 이 고정 $h=128$ 을 택한 근거는 §3 에서 "실용적 절충" 정도로 서술한다고 v1 README 및 secondary 는 요약 (원문 절 위치까지만 확인, 정확한 문장 미확인).

---

## Claim 3. **Frequency indicator (0/1/2 categorical)** 를 conditioning 신호로 넣으면 서로 다른 sampling rate 의 시계열이 한 모델을 공유하면서도 각자의 seasonality prior 를 이용한다.

- **주장**: input frequency 를 3-단계 카테고리 (0: 시-분-시간-일간, 1: 주간-월간, 2: 분기-연간) 로 이산화하고 모델에 조건 벡터로 주면, 서로 다른 sampling rate 의 시계열이 seasonal prior 를 공유하지 않으면서 backbone 파라미터는 공유한다.
- **증거**: 원문 §3 model architecture (frequency embedding 위치) + §5 ablation (frequency 를 뺐을 때의 성능 저하). 저자 v1 README verbatim: "TimesFM expects a categorical indicator valued in {0, 1, 2}: 0 (default): high frequency, long horizon time series … 1: medium frequency … 2: low frequency, short horizon" 및 "you do NOT have to strictly follow our recommendation here … you can also view the frequency input as a free parameter and modify it per your specific use case."
- **숨은 전제**: (i) sampling rate 는 seasonality 의 주요 결정 요인이다 — 일간이면 7일 주기, 월간이면 12개월 주기 등이 우세 → 카테고리로 뭉뚱그려도 무방하다. (ii) 유저가 정확한 frequency label 을 줄 수 있다 — mislabel 이면 성능이 어떻게 무너지는지 논문은 답하지 않음.
- **쉬운 말 풀이**: "이 시계열이 몇 분마다 찍혔는지, 며칠마다 찍혔는지, 몇 달마다 찍혔는지 세 단계로만 알려줘라. 그러면 로봇이 상황에 맞는 예측을 한다."

### 대체 설계

1. **연속 log-Δt embedding**: 카테고리 대신 log(sampling_period) 를 실수로 임베딩. 더 표현력 풍부하지만 학습 signal 이 sparse.
2. **자동 감지**: FFT 나 autocorrelation 으로 dominant period 를 감지해 모델에 넣는다 — TimesNet 이 이 방향, but supervised.
3. **Frequency-free**: seasonal prior 를 아예 조건에서 빼고 데이터가 알아서 학습하게 둠. v2.5 는 이 방향으로 이동 ("gets rid of the `frequency` indicator") — 즉 저자들이 4년 뒤 스스로 이 conditioning 을 폐기했다는 게 재미있는 self-refutation.

---

## Claim 4. **약 100B time-points 규모의 real-world (Google Trends + Wikipedia pageviews) + synthetic augmentation** 코퍼스가 이 존재 증명에 필요한 스케일이다.

- **주장**: real-world 다양성 (Trends 의 다양한 human-driven periodicity + Wiki pageviews 의 매체 다양성) 과 synthetic (ARMA / 주기 / 추세 혼합) 을 섞은 코퍼스가 zero-shot 성능의 원천이다. corpus 를 줄이거나 real/synthetic 비율을 바꾸면 zero-shot 성능이 떨어진다.
- **증거**: 원문 §4 pretraining data + §5.x ablation (원 PDF 표 절대 수치 미확인). Google Research 블로그 요약 (본 환경 차단으로 원문 미확인, secondary WebSearch 스니펫 verbatim).
- **숨은 전제**: (i) Google Trends + Wiki pageviews 가 세상 시계열의 "충분히 넓은 표본" 이다 — 하지만 이 코퍼스는 대부분 human-attention-driven 시계열이라 (검색, 조회수) 자연현상 (기상, 지진) 이나 미시금융 (LOB) 통계와 얼마나 겹치는지 알기 어려움. (ii) synthetic 시계열이 real 의 "미보상 통계 조각" (예: heavy tail, regime shift) 을 채운다 — synthetic 의 정확한 파라미터는 원문 §4 에 있다고 언급되지만 본 환경 미확인.
- **쉬운 말 풀이**: "1,000억 개의 시간점을 보여줘야 로봇이 새 데이터에도 감을 잡는다. 이 1,000억 개는 사람들의 검색어 관심도랑 위키 조회수를 대량으로 모아 붙인 것 + 인공 시계열을 조금 섞은 것."

### 재현 위험

corpus 가 라이선스 사정으로 비공개 → **재현 불완전**. 후속 연구자들이 대체 corpus (LOTSA in MOIRAI, GIFT-Pretrain 등) 를 개발한 것이 이 gap 을 반증적으로 확인.

---

## Claim 5. (부수적) **Point forecast 를 우선하고 quantile head 는 실험적으로만** 제공.

- **주장**: 논문 시점(2024)에는 point forecast (single number) 를 제1 출력으로 삼고, quantile forecast 는 10 개의 quantile head 를 실험적으로 두되 사전학습 후 보정하지 않음. 저자 스스로 이 부분을 "not calibrated" 라고 self-report.
- **증거**: v1 README verbatim: "**timesfm-1.0-200m** … It focuses on point forecasts, and does not support probabilistic forecasts. We experimentally offer quantile heads but they have not been calibrated after pretraining." **timesfm-2.0-500m** … It focuses on point forecasts. We experimentally offer 10 quantile heads but they have not been calibrated after pretraining.
- **숨은 전제**: point forecast 만으로 시장가 있는 응용이 성립한다 — 즉 리스크 · 옵션 · 헤지 처럼 확률 예측이 필수인 응용은 이 논문의 스코프 밖.
- **쉬운 말 풀이**: "이 로봇은 '얼마' 는 잘 맞추지만 '얼마 정도의 확신인지' 는 대답하지 않는다."

### 왜 이 claim 이 중요한가

이 self-report 는 논문 스코프의 정직한 경계선이다. 후속 v2.5 (2025-09) 가 별도 30M 파라미터 continuous quantile head 로 이 경계를 밀어냈다는 점, 그리고 QuantileFormer / TimeGrad / ProTran 같은 확률 예측 track 이 완전히 다른 설계 요구를 가진다는 점을 이 claim 하나로 정직하게 확인한다.

---

## Claim 다수의 존재 → 논문의 형식적 성격

TimesFM 은 "새 이론을 증명" 하는 논문이 아니라 **"주장 (design choice) 이 실증으로 성립함을 존재 증명" 하는 논문**. 다섯 claim 이 모두 §5 empirical 결과에 의존 (theorem 없음). 이는 언어·이미지의 파운데이션 모델 논문 형식과 동형이며, 이 형식이 시계열에도 확장 가능함을 형식적으로 보여준 첫 논문 중 하나이다.
