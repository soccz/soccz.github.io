# 04_claims — 핵심 Claim 해체

THP 의 핵심 주장을 4개로 분해한다. 각 주장마다 (a) 한 문장 요약, (b) 근거 위치, (c) 숨은 전제, (d) 무배경 독자용 재진술 을 적는다.

---

## Claim 1 — Self-attention 이 RNN 점과정의 long-range trigger 학습 한계를 깨뜨린다

### 주장 (한 문장)

마스킹된 self-attention 으로 사건 이력을 표현하면, RNN 기반 점과정(RMTPP, NHP) 의 sequential vanishing 으로 인한 long-range trigger 표현 한계를 직접 해소할 수 있다.

### 근거 위치

- **본문**: WebSearch 인덱스 verbatim 에서 "THP outperforms NHP during the entire training process by large margins on both of the datasets" + abstract 의 "long-term dependency" 직접 표기.
- **코드 검증**: `transformer/Modules.py` 의 `ScaledDotProductAttention` 이 query·key 의 dot product 후 mask(upper-triangular for causality + padding) 적용 → softmax. 모든 사건 쌍의 점수가 거리에 무관하게 직접 학습됨. 거리에 따른 가중치 감쇠가 hard-coded 되지 않음.
- **실험 위치**: 본문 §5 Experiments — Synthetic Hawkes / Retweet / StackOverflow / MIMIC-II / Financial / MemeTrack 6 데이터셋 비교표 (절대 수치 본문 표 미접근으로 본 해체에서 단정 안 함).

### 숨은 전제

1. **사건 시퀀스가 충분히 길어 self-attention 의 이점이 노출됨**: 짧은 시퀀스(< 10 사건)에서는 RNN 도 충분. 본 논문 실험은 평균 길이 50~2000 사건의 데이터셋 위주.
2. **"Long-range trigger 가 실제로 존재함"**: 데이터에 한참 떨어진 두 사건 간 통계적 의존성이 실제로 있어야 self-attention 이 이긴다. 데이터셋 선택의 사전 편향.
3. **충분한 학습 데이터**: transformer 는 sample-efficient 하지 않다. 사건 시퀀스가 적으면 RNN 이 더 빠르게 수렴할 가능성.

### 쉬운 말 풀이

옛날 방식(RNN)은 사건들을 **한 명씩 줄 세워 차례로 보는** 사람이다. 첫 번째 사건을 본 다음 두 번째를 보고 그 다음 세 번째, ... 시퀀스가 길어지면 첫 번째 사건의 기억이 흐려진다. 트랜스포머는 모든 사건을 **테이블에 펼쳐놓고 동시에 본 뒤, "지금 이 사건과 관련된 것은 어느 거지?" 를 검색** 하는 사람이다. 첫 번째 사건과 마지막 사건이 얼마나 떨어져 있든 상관 없이 직접 연결한다. 사건의 거리에 무관한 의존성을 잡을 수 있다는 뜻.

---

## Claim 2 — 강도 헤드의 새로운 parametric 형태 (시간선형 + softplus) 가 충분한 표현력을 갖는다

### 주장

연속시간 강도를

$$\lambda_k(t) = \mathrm{softplus}\!\left( \alpha_k \cdot \frac{t - t_j}{t_j} + w_k^\top h_j + b_k \right), \quad t \in [t_j, t_{j+1})$$

로 정의해도, RMTPP 의 $\exp$ 헤드나 NHP 의 LSTM 헤드보다 우수한 likelihood 를 얻는다.

### 근거 위치

- **코드 검증**: `transformer/Models.py` 의 `Predictor` 클래스가 `softplus(alpha * t_norm + linear(h))` 구조. `Utils.py` 의 `softplus` 함수가 hard-threshold(20) 안정화. 학습 가능 파라미터 `alpha`, `beta` 명시 (`alpha` 는 시간 항 계수, `beta` 는 softplus softness).
- **본문**: WebSearch 인덱스 — "softplus 가 부드러워서 사건 사이의 선형 보간으로 인한 bias 가 작다" 의 직접 표기.
- **실험**: 6 데이터셋 likelihood 비교 (RMTPP/NHP/SAHP 대비 본문 표; 절대 수치 본문 미접근).

### 숨은 전제

1. **사건 사이 강도의 시간 의존성이 "선형 + softplus" 로 충분히 근사됨**: 강도가 사건 사이에서 매우 복잡한 비선형 곡선(예: U자 또는 W자) 인 경우 표현 부족. 다행히 softplus 의 출력 자체가 logistic 함수의 적분이므로 부드러운 비단조성을 부분 표현 가능.
2. **시간 항이 $(t - t_j)/t_j$ 의 **상대시간 normalize** 형태인 이유**: $t_j$ 가 0 에 가까운 매우 짧은 시퀀스에서 numerical instability 위험. 데이터 정규화 필수.
3. **$\alpha_k$ 의 부호가 사건 종류 $k$ 마다 다를 수 있음**: 어떤 사건은 사건 사이에서 강도가 증가하고(자기-자극 잔향) 어떤 사건은 감소함(피로/소진). 이 부호 자유도가 표현력의 핵심.

### 쉬운 말 풀이

다음 폭죽이 언제 터질지 그 가능성(강도)를 그래프로 그린다. 옛 방식($\exp$)은 그래프가 **계속 올라가거나 계속 내려가는 것** 두 가지뿐이었다. THP 는 그래프 시작점 높이는 **그 사건 이전의 모든 이력**으로 정하고, 기울기(올라갈지 내려갈지)는 사건 종류에 맞춰 **학습된 계수 $\alpha_k$** 가 결정한다. softplus 라는 함수는 "**음수 절대 안 나오게 부드럽게 꺾이는 곡선**" — 강도는 음수면 안 되니까.

---

## Claim 3 — 로그가능도 적분의 두 가지 평가 방법 모두 실용적이다

### 주장

로그가능도 $\log L = \sum_i \log \lambda_{k_i}(t_i) - \int_{t_1}^{t_L} \lambda(t) \, dt$ 의 적분 항을 (a) 사다리꼴 근사(biased, 빠름) 또는 (b) Monte Carlo 100-sample (unbiased, 비용 ↑) 으로 평가할 수 있고, 둘 다 수치적으로 안정.

### 근거 위치

- **코드 검증**: `Utils.py` 의 두 적분 함수가 명시적으로 분기. `compute_event` 는 사건 항. `compute_integral_biased` 와 `compute_integral_unbiased` (이름은 다를 수 있으나) 두 함수가 동일 인터페이스로 제공.
- **본문**: WebSearch 인덱스 — "biased method: 선형 보간 / unbiased method: 100 Monte Carlo samples".

### 숨은 전제

1. **사건 사이 구간의 강도가 매우 spiky 하지 않다**: 사다리꼴 근사가 통하려면 구간 내 강도가 양 끝점 평균과 크게 다르지 않아야 함. spiky 한 강도(짧은 시간에 큰 변화) 가 있으면 biased 추정의 편향이 큼.
2. **Monte Carlo 100 sample 이 충분히 분산을 줄임**: 사건 사이 구간이 매우 짧으면 100 sample 의 가치가 작음. 매우 길면 100 이 부족할 수도.
3. **계산 비용**: unbiased 는 (모든 구간 × 100 sample × forward pass) 가 필요 → 학습 batch 가 작은 (run.sh: batch=4) 이유.

### 쉬운 말 풀이

강도 그래프 아래 면적을 구하는 게 적분이다. 빠른 방법 = **양 끝점만 보고 사다리꼴 면적** 으로 어림잡기. 정확한 방법 = **그래프 위 100 곳을 무작위로 찍어 평균** 내기. 첫 번째는 빠르지만 그래프가 휘면 틀린다. 두 번째는 정확하지만 100 번 봐야 해서 100 배 느리다. THP 는 둘 다 쓸 수 있게 코드를 짜놨다.

---

## Claim 4 — 점과정 표준 벤치마크 6종에서 일관된 우위

### 주장

Synthetic Hawkes / Retweet / StackOverflow / MIMIC-II / MemeTrack / Financial 6 데이터셋 모두에서, log-likelihood / next event type accuracy / next event time RMSE 세 metric 모두에서 RMTPP / NHP / SAHP 보다 우수.

### 근거 위치

- **본문**: §5 Experiments 의 Table 1·2·3 — 본 환경 미접근. WebSearch 인덱스 verbatim 으로 방향성("THP > existing models by notable margin", "across financial transactions, healthcare, social, structured settings") 만 확인.
- **코드**: `Main.py` validation 루프에서 세 metric(log-likelihood / accuracy / RMSE) 동시 계산.
- **데이터셋 명단**: GitHub `run.sh` (StackOverflow 디렉토리 `data_so/fold1`) + WebSearch 인덱스 verbatim 의 6 데이터셋 명시.

### 숨은 전제

1. **baseline 의 튜닝 공정성**: RMTPP / NHP / SAHP 가 THP 와 동등하게 튜닝되었는가? 본 환경 본문 미접근으로 검증 불가. transformer baseline 의 well-known 함정.
2. **데이터셋 시간 단위**: README 의 "RMSE 단위 불일치 경고" 가 시사 — 데이터셋별 단위 차이로 RMSE 자릿수가 직접 비교되지 않을 위험. 저자 자신이 인지한 limitation.
3. **6 데이터셋의 시퀀스 길이 다양성** (Financial 평균 ~2000, MIMIC-II ≤50): self-attention 의 이점이 노출되는 긴 시퀀스 위주의 선택 가능성.

### 쉬운 말 풀이

같은 시험을 RMTPP, NHP, SAHP, THP 네 학생에게 6 과목 치게 했다. 각 과목마다 시험 3개씩 (log-likelihood, accuracy, RMSE). 결과: THP 가 모든 과목에서 평균적으로 더 잘 봤다. 단 (1) 시험 채점 단위가 과목마다 달라서(예: 시간 단위 차이) 직접 자릿수 비교에 주의, (2) 다른 학생들이 동등한 사교육을 받았는지 본 해체에선 검증 안 됨.

---

## Claim 들의 상호 관계

- **Claim 1** 은 backbone 의 정당화 (왜 transformer 인가).
- **Claim 2** 는 강도 헤드의 새 정의 (어떻게 transformer 의 출력을 강도로 만드는가).
- **Claim 3** 은 학습 신호의 정의 (강도가 정해지면 어떻게 학습하는가).
- **Claim 4** 는 종합 성능 입증.

논리적으로 Claim 1+2 가 본 논문의 **architectural contribution**, Claim 3 가 **training contribution**, Claim 4 가 **empirical contribution**. 후속 작업들이 Claim 2 의 강도 헤드를 거의 그대로 채택했다는 점에서 가장 영향력 큰 contribution.
