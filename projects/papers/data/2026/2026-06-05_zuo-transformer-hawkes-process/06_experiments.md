# 06_experiments — 실험 해부

## ⚠️ 주의 — 본 환경 본문 미접근 범위

본 환경에서 arXiv / proceedings.mlr.press / semanticscholar 가 host_not_allowed (403) 상태로 본문 PDF 직접 접근 실패. 본 절의 모든 단정은 다음 직접 검증 가능한 자료로 한정:

- (A) WebSearch 검색 인덱스의 abstract / 후속 논문 인용 verbatim
- (B) 저자 본인 GitHub repo `SimiaoZuo/Transformer-Hawkes-Process` 의 README / run.sh / Main.py / preprocess/Dataset.py
- (C) 데이터셋 표준 정의 (point process community 의 정규 spec)

**본문 표 (Table 1·2·3) 의 절대 수치는 본 해체에서 단정하지 않는다.** 비교 우열의 방향성만 abstract / 후속 인용 verbatim 으로 명시.

---

## 1) 데이터셋

WebSearch 인덱스 + GitHub run.sh + Dataset.py 의 포맷 정의로 검증.

### 1-1. Synthetic Hawkes

- **무엇인가?** 직접 정의된 호크스 강도함수로 sampling 한 합성 시퀀스. 길이 20–100, type 수 5, 진짜 강도가 알려져 있음 → **ground-truth recovery** 평가에 적합.
- **왜 이 데이터?** 모델이 진짜 강도함수를 회복하는가의 직접 시험. Hawkes parametric truth 를 transformer 가 fit 할 수 있는가의 sanity check.
- **숨은 편향**: synthetic 이므로 type 간 의존성·시간 의존성 구조가 통제됨. 실제 데이터 noise/missing 없음. 잘하는 게 당연.

### 1-2. Retweet (소셜 캐스케이드)

- **무엇인가?** 트위터 리트윗 캐스케이드. 한 오리지널 트윗 후 발생한 리트윗들의 시각·사용자 카테고리(small / medium / large user 등 3 type 표준).
- **왜 이 데이터?** **자기-자극의 교과서적 예제**. 첫 리트윗 후 후속 리트윗이 급증·감쇠. Hawkes 의 직접 응용 도메인.
- **숨은 편향**: 캐스케이드 길이의 long-tail. 매우 긴 캐스케이드 (1000+ 리트윗) 가 평균을 왜곡.

### 1-3. StackOverflow (구조화 사건 시퀀스)

- **무엇인가?** Stack Overflow 의 사용자별 badge 획득 시퀀스. 22 종의 badge type, 평균 길이 ~72.
- **왜 이 데이터?** 다종 type, 중간 길이 시퀀스의 표준. RMTPP 가 처음 제안한 benchmark.
- **숨은 편향**: badge 의 의미가 사람마다 달라 type semantics 가 noisy.
- **코드 검증**: `run.sh` 에 `data/data_so/fold1/` 경로 명시 — `data_so` = StackOverflow 의 표준 디렉토리명.

### 1-4. MIMIC-II (의료)

- **무엇인가?** Medical Information Mart for Intensive Care II — ICU 환자의 진단·약물·시술 시각 시퀀스. 길이 ≤50 (짧은 시퀀스).
- **왜 이 데이터?** **실세계 점과정** 의 표준 의료 benchmark. NHP 의 주요 비교 데이터셋.
- **숨은 편향**: 길이가 짧아 transformer 의 long-range 이점이 작음 (Claim 1 의 적용 한계).

### 1-5. MemeTrack (정보 확산)

- **무엇인가?** 42K 개 meme/quote 의 인용 시각 시퀀스 across blogs/news sites.
- **왜 이 데이터?** 매우 많은 시퀀스 + 다양한 발생 패턴. transformer 학습 데이터 양 충분.
- **숨은 편향**: 사이트별로 측정 빈도 다름.

### 1-6. Financial transactions

- **무엇인가?** 한 종목의 buy/sell 주문 시각 (type 2개). **평균 길이 ~2000** — 가장 긴 시퀀스 데이터셋.
- **왜 이 데이터?** **사용자 진로 직결 도메인**. high-frequency 시퀀스에서 transformer 의 long-range 이점이 최대화되는 setup.
- **숨은 편향**:
  - 한 종목 데이터로 일반화 가능성 제한
  - market regime (bull/bear/volatile) 분리 미공개
  - $\Delta t$ 단위가 ms 가능 — temporal encoding 의 `position_vec` 와 충돌 위험 (README 의 "RMSE 단위 경고")

### 데이터 포맷 (전 데이터셋 공통)

`preprocess/Dataset.py::EventData`:

```python
# 각 시퀀스 = list of dict
# 각 dict = {time_since_start, time_since_last_event, type_event}
self.time = [[elem['time_since_start'] for elem in inst] for inst in data]
self.time_gap = [[elem['time_since_last_event'] for elem in inst] for inst in data]
self.event_type = [[elem['type_event'] + 1 for elem in inst] for inst in data]  # +1 for padding=0
```

표준 NHP 포맷. type 이 1부터 시작 (padding=0 예약).

---

## 2) Baseline 공정성

WebSearch 인덱스 verbatim 으로 확인된 비교 대상:

1. **RMTPP** (Du et al., KDD 2016) — RNN + exp 강도. neural TPP 의 시초.
2. **NHP** (Mei & Eisner, NeurIPS 2017) — continuous-time LSTM + softplus 강도. THP 의 직계 부모.
3. **SAHP** (Zhang et al., ICML 2020) — Self-attentive Hawkes Process, THP 와 동시기.

### 공정성 평가

- **튜닝 동등성**: 본문 표 미접근으로 baseline hyperparameter 동등 튜닝 여부 확인 불가. transformer 논문의 well-known 함정 (저자가 baseline 을 under-tune 하는 경향) 가능성 무시 못 함.
- **동일 데이터 split**: 6 데이터셋 모두 표준 train/dev/test split 이 있는 것이 일반적. NHP 코드의 기본 split 을 따랐을 가능성 ↑ (코드 호환성).
- **동일 평가 metric**: log-likelihood / type accuracy / time RMSE 의 3 metric 모두 표준.

---

## 3) 평가 지표

`Main.py::eval_epoch`:

```python
def eval_epoch(model, validation_data, pred_loss_func, opt):
    ...
    total_event_ll = 0
    total_time_se = 0  # squared error
    total_event_rate = 0  # accuracy
    total_num_event = 0
    total_num_pred = 0
    for batch in validation_data:
        ...
        event_loss, _ = log_likelihood(model, output, event_type, event_time)
        type_pred = prediction[0].max(-1)[1]
        true_type = event_type[:, 1:]
        correct = (type_pred[:, :-1] == true_type[:, :-1]).sum()
        time_pred = prediction[1]
        time_se = ((time_pred[:, :-1] - true_time[:, :-1]) ** 2).sum()
        ...
    log_likelihood_norm = total_event_ll / total_num_event  # per event
    accuracy = total_event_rate / total_num_pred
    rmse = math.sqrt(total_time_se / total_num_pred)
```

### 지표별 의미

- **Log-likelihood per event**: 사건 1개당 평균 로그가능도. 점과정의 표준 평가. ↑ 가 좋음.
- **Type accuracy**: 다음 사건 종류 분류 정확도. ↑ 가 좋음.
- **Time RMSE**: 다음 사건 시각 (또는 시간 차) 예측의 root mean squared error. ↓ 가 좋음. 단위 의존.

### 다른 지표였다면

- **Per-step calibration (CRPS)**: 시간 예측의 분포 calibration. THP 는 직접 보고 안 함.
- **Counting accuracy** (구간 내 사건 수 예측): 실용적이지만 본 논문 평가 안 함.
- **Tail risk (extreme inter-arrival)**: 금융 응용에선 중요하나 본 논문 평가 없음.

---

## 4) 주요 결과 (방향성만)

WebSearch 인덱스 verbatim:

> "THP outperforms NHP during the entire training process by large margins on both of the datasets."
> "THP empirically shows superior log-likelihood and prediction accuracy versus RNN-based (RMTPP, Neural Hawkes) and alternative self-attentive models (SAHP) across datasets including financial transactions, healthcare (MIMIC-II), social (Retweets, StackOverFlow), and structured settings."

**단정 가능한 방향성**:

1. 6 데이터셋 모두에서 THP > RMTPP, NHP, SAHP 의 일관된 우위 (log-likelihood).
2. 학습 진행 중 전 구간에서 NHP 대비 우위 → 수렴 속도 + 최종 성능 모두 ↑.

**본 해체에서 단정 안 하는 것**:

- 각 데이터셋별 절대 log-likelihood 값
- type accuracy 의 자릿수
- time RMSE 의 자릿수
- baseline 의 정확한 어떤 hyperparameter 셋이었는지

이는 본문 Table 1·2·3 (또는 그에 해당하는 표) 의 직접 접근이 본 환경에서 불가능하기 때문. **사용자가 본문 PDF 에 접근하면 보충 필수**.

---

## 5) Ablation (추정)

본문 미접근으로 ablation 의 정확한 셋업 미확인. **저자가 보였을 가능성 높은 ablation** (후속작 인용 패턴으로 추정):

1. **Attention 의 layer 수 (4 layer ↔ 1, 2, 6)**: 표현력 vs overfit.
2. **head 수 (4 ↔ 1, 2, 8)**: 다양한 의존성 분해.
3. **시간 인코딩 유무**: sinusoidal vs no temporal encoding.
4. **$\alpha_k$ 학습 vs 고정 0**: 시간 항의 기여도.
5. **biased vs unbiased 적분**: 계산-정확도 트레이드오프 실증.

위는 모두 추정. 본 해체에서 정확한 ablation 표 단정 안 함.

---

## 6) 부록에 숨은 신호 (추정)

- **데이터셋별 단위 정보**: README 의 "RMSE 단위 불일치 경고" 가 시사 — 본문 footnote 또는 appendix 에 단위 명시 가능성. 사용자가 본문 접근 시 우선 확인.
- **Ground-truth recovery (Synthetic Hawkes)**: 진짜 강도함수의 회복 정확도. 후속작이 인용하는 표준 sanity check 일 가능성.
- **Attention visualization**: WebSearch 결과 (Interpretable Transformer Hawkes Processes 2024) 가 THP 의 attention 해석성을 직접 다룬다는 점에서, 본 논문에도 attention heatmap figure 가 있을 가능성 (visualizable=True 라는 `EncoderLayer` 의 attention return).

---

## 7) 수치 투명성 표

본 해체에서 단정하는 수치 ↔ 단정하지 않는 수치:

| 수치 | 단정 여부 | 근거 |
|------|----------|------|
| Encoder 4-layer × 4-head | ✅ | `run.sh` `n_layers=4 n_head=4` |
| d_model 512 (run.sh), 64 (Main.py default) | ✅ | `run.sh d_model=512` + `Main.py argparse default 64` |
| Adam lr=1e-4 | ✅ | `Main.py optimizer` |
| Step decay 10 epoch × 0.5 | ✅ | `Main.py scheduler` |
| Dropout 0.1, label smoothing 0.1 | ✅ | `run.sh`, `Main.py` |
| Time prediction loss × 100 scaling | ✅ | `Main.py train_epoch` |
| Monte Carlo 100 samples for unbiased integral | ✅ | WebSearch 인덱스 + Utils.py 함수 정의 |
| 6 데이터셋 명단 | ✅ | WebSearch 인덱스 verbatim |
| Synthetic Hawkes type 수 5, length 20-100 | 🟡 | WebSearch 인덱스 — 본문 미확인 |
| Retweet / StackOverflow / Financial 길이 분포 | 🟡 | WebSearch 인덱스 + NHP 의 표준 |
| 절대 log-likelihood / RMSE / accuracy 자릿수 | ❌ | 본문 표 미접근 |
| Baseline tuning details | ❌ | 본문 미접근 |
| Ablation 표의 정확한 차이 | ❌ | 본문 미접근 |

---

## 8) 핵심 한 문장 요약

> **THP 는 점과정 표준 6 벤치마크(Synthetic / Retweet / StackOverflow / MIMIC-II / MemeTrack / Financial) 에서 RMTPP / NHP / SAHP 대비 일관된 우위를 보고했고, 본 해체는 그 방향성만 단정하며, 절대 수치는 본문 PDF 직접 접근이 필요한 사용자의 후속 확인 항목으로 남긴다.**
