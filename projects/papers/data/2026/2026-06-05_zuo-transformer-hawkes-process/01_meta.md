# 01_meta — 메타 & 선정 이유

## 인용 / 권위 / 컨텍스트

- **인용 수**: 이 환경에서 Semantic Scholar / Google Scholar 정확 수치는 차단(403)으로 직접 확인 불가. 다만 (a) 2021 이후 점과정 분야 후속작 다수(SMURF-THP, Mamba Hawkes Process, Temporal Attention Augmented THP, From Hawkes to Attention, Interpretable Transformer Hawkes Processes 등)가 본 논문을 anchor 로 인용한다는 사실은 WebSearch 결과 인덱스로 확인됨. (b) ICML 2020 accepted paper. (c) dblp 기준 ICML 2020 정식 등재(`conf/icml/ZuoJLZZ20`). 점과정의 transformer 도입 표준 인용 baseline 이라는 점은 확정적.
- **저자 권위**:
  - **Tuo Zhao** (corresponding) — Georgia Tech ISyE, Bayesian/optimization-theoretic ML 학계 리더. Microsoft Research collaboration 다수.
  - **Hongyuan Zha** — Georgia Tech (현 CUHK Shenzhen). Recommender system / point process / network science 의 권위자. RMTPP(Du-Zha 2016, NHP 의 전신 격) 의 공저자.
  - **Simiao Zuo** (1저자) — Tuo Zhao 학생. 후속작 다수.
  - **Haoming Jiang · Zichong Li** — 같은 Georgia Tech 라인.
- **DOI / 식별자**: arXiv:2002.09291 (v1 2020-02-21). PMLR v119 zuo20a (`http://proceedings.mlr.press/v119/zuo20a.html`, `http://proceedings.mlr.press/v119/zuo20a/zuo20a.pdf`). dblp `conf/icml/ZuoJLZZ20`. ACM DL `10.5555/3524938.3526022`.
- **코드 공개**: github.com/SimiaoZuo/Transformer-Hawkes-Process (저자 본인 계정). PyTorch 1.4, Python 3.7, single-GPU. License 미명시. README 에 "데이터셋 시간 단위와 reported RMSE 단위 불일치 주의" 명시.

## 근거 지도 (Evidence Map)

본 해체의 모든 단정은 다음 직접 검증 경로에서 도출. **본문 PDF (arxiv/proceedings) 는 환경 호스트 정책으로 미접근.** 따라서 본문 표 절대 수치는 본 해체에서 단정하지 않으며, 방법론과 결과의 방향성만 코드 + 검색 인덱스 abstract 로 교차 검증.

| 내용 | 검증 경로 | 신뢰도 |
|------|----------|--------|
| 제목 · 저자 5인 · ICML 2020 · arXiv ID | dblp `conf/icml/ZuoJLZZ20` + ACM DL + PMLR proceedings 색인 + GitHub README 의 인용문구 | 🟢 확정 |
| Abstract 핵심 문장 ("self-attention 으로 long-term dependency + 계산 효율 + likelihood/event prediction 에서 notable margin 초과") | WebSearch 인덱스 verbatim (다수 후속 논문 인용에서 일치) | 🟢 확정 |
| 데이터셋 6종 (Synthetic Hawkes / Financial buy-sell / MIMIC-II / StackOverflow / MemeTrack / Retweet) | (a) WebSearch 인덱스 verbatim, (b) GitHub `run.sh` 에 `data/data_so/fold1/` 경로 = StackOverflow 의 표준 디렉토리명, (c) `preprocess/Dataset.py` 의 `(time_since_start, time_since_last_event, type_event)` 포맷 = NHP 공개 데이터의 정규 포맷 | 🟢 확정 |
| Architecture: temporal encoding + 4-head × 4-layer encoder + 강도 헤드 + 시간/타입 헤드 | (a) `transformer/Models.py` 의 `Encoder` / `Predictor` 클래스, (b) `transformer/Layers.py` 의 `EncoderLayer`, (c) `transformer/SubLayers.py` 의 `MultiHeadAttention` + `PositionwiseFeedForward`, (d) `transformer/Modules.py` 의 `ScaledDotProductAttention` | 🟢 확정 |
| Sinusoidal temporal encoding (시간값을 sin/cos 로 인코딩) | `transformer/Models.py` 의 `temporal_enc` 메서드 (시간을 `10000^(2i/d)` 로 나눠 sin/cos alternating 적용) | 🟢 확정 |
| Continuous-time intensity = softplus(alpha · (t - t_j) + β · embedding) | `transformer/Models.py` 의 학습 가능한 `alpha`, `beta` 파라미터 + `Utils.py` 의 `softplus` hard-threshold(20) 안정화 | 🟢 확정 |
| 로그가능도 = Σ log λ(t_i) − ∫ λ(t) dt (∫ 은 (1) 사다리꼴 = biased, (2) 100-sample Monte Carlo = unbiased 두 방식) | `Utils.py` 의 `compute_event` (사건 항) + 두 적분 함수 verbatim | 🟢 확정 |
| 학습 setup: Adam lr=1e-4, 10 epoch 마다 lr×0.5 step decay, batch=4, dropout=0.1, label smoothing=0.1, d_model=64 default (run.sh 는 512 권장) | `Main.py` optimizer/scheduler + `run.sh` 인자값 | 🟢 확정 |
| 평가 metric: log-likelihood (총 사건 수 normalize), event type accuracy, time RMSE | `Main.py` validation 루프 | 🟢 확정 |
| Baseline: RMTPP, NHP, SAHP | WebSearch 인덱스 (THP 후속작들이 본 논문 비교표를 인용하며 동일 baseline 셋 reference) | 🟡 본문 미접근, 후속작 교차 |
| Table 1~3 의 절대 수치 (각 데이터셋별 log-likelihood, type acc, RMSE 자릿수) | ❌ 본문 미접근 | 본 해체에서 **단정하지 않음** ("THP > RMTPP/NHP/SAHP" 의 방향성만 사용) |
| Limitation / Discussion 의 명시 위치 | ❌ 본문 미접근. README 의 "time unit warning" + 코드의 "biased vs unbiased 적분" 트레이드오프로부터 inference | "원문 한계 위치 미확인" 명시 |

*총평*: **architecture / training / loss / metric / dataset 의 mechanism 은 저자 본인 코드로 직접 verbatim 검증**. **결과 절대 수치와 한계 본문 위치만 미확인**. 이는 2026-05-29 DeepLOB 작성 시와 동일한 가용 자료 패턴이며, 같은 strictness 로 작성한다.

## 선정 이유 — 지금 이 시점에 내가 왜 이걸 봐야 하는가

### 1) 오늘 버킷·태그 정합

- 금요일 = 원거리 버킷. `_coverage.md` 의 원거리 태그 중 **`point-process` 가 커버 수 0** 으로 가장 뒤처짐(llm-finance/rl-trading/causal-ml-finance/deep-hedging 도 0 이지만 후술 비교에서 Source Lock 통과 우선).
- `_profile.md` §F 의 명시 항목: "Point processes (Hawkes, neural TPP)". Quant industry 의 high-frequency event 모델링(주문 도착 / 거래 발생 / 청산) 의 정통 도구.

### 2) 후보 비교 (Source Lock 통과 기준)

| 후보 | venue · tier | Source Lock 결과 | 선정 |
|------|-------------|------------------|------|
| **Transformer Hawkes Process (Zuo 2020)** | ICML 2020 · **Tier 1** | 저자 본인 GitHub 코드 (Models/Utils/Layers 전부) 접근 ✅ + abstract WebSearch verbatim ✅ + dblp/ACM 메타 일치 ✅ | **선정** |
| Neural Hawkes Process (Mei & Eisner 2017) | NeurIPS 2017 · Tier 1 | GitHub repo (`HMEIatJHU/neurawkes`) 존재하나 README 짧음. arxiv 차단. method 코드 검증 가능하지만 점과정 transformer 라인의 직계 부모인 THP 가 사용자 연구 transformer 축과 더 직결 | 차순위 보류 |
| Self-Attentive Hawkes Process (Zhang 2020) | ICML 2020 · Tier 1 | THP 와 동기. 다만 본 논문이 THP 의 직접 baseline 이며 후속 인용 anchor 는 THP 가 우세 | 차순위 보류 |
| Deep Hedging (Buehler 2019) | Quantitative Finance · Tier 3 | 공식 코드 부재. arxiv 차단. method 본문 미확인 | 폐기 (2026-05-29 동일 결론) |
| FinBERT (Yang 2020) | arXiv only · Tier 4 | 모델 weight 는 공개되지만 abstract 외 본문 method 본 환경 미접근 | 보류 |

THP 가 Tier 1 + Source Lock 통과 + 사용자 연구 두 축(APF transformer + Grokking TS) 모두에 정중앙으로 꽂힌다.

### 3) 사용자 연구 연결도 (구체 mechanism)

1. **APF(Attention Pattern Fields)와 직결** — THP 의 `temporal_enc` 는 **시간 스칼라 → sinusoidal vector** 라는 PE 의 가장 정직한 사용례다. 표준 트랜스포머가 **position index(이산)** 를 sinusoidal 로 인코딩하는 데 반해, THP 는 **wall-clock time(연속)** 을 그대로 sinusoidal 로 인코딩한다. APF 의 motif 가설 — "PE 변경이 attention motif 형태를 직접 결정한다" — 를 **연속 시간축 PE** 위에서 검증할 수 있는 가장 단순한 setting. (APF must-cite 의 "PE TS Survey" Irani-Metsis 2025 가 다루는 핵심 변환 중 하나.)
2. **Grokking-TS 와 직결** — 점과정의 self-attention 학습은 **사건 시퀀스에서의 long-range dependency 학습**이며, Grokking 의 "지연 일반화" 현상이 사건 도착 간격 modular pattern 에서 발생하는지 자연스럽게 묻을 수 있다. 사용자의 logistic-map grokking 실험과 직접 비교 가능 (둘 다 chaotic 시간 신호).
3. **P1 ProTran-TFA(paused)에 분포 헤드 통찰** — THP 의 강도함수 = `softplus(α·Δt + β·embedding)` 는 **non-Gaussian conditional intensity 의 가장 단순한 parametric 형태**다. ProTran-TFA 의 확률 헤드 설계에 (Student-T 와 별개의) 단조성 보장된 강도 헤드 옵션을 제공.
4. **AETHER(crypto-ml, shelved)에 직접 응용** — 암호화폐 시장의 거래 도착 강도(transaction arrival intensity)와 청산(liquidation) cascade 는 marked point process. THP 의 `Financial` 데이터셋 (Buy/Sell sequence) 가 이 영역의 직접 ancestor.

### 4) 신선도·재현성

- 2020 년 논문이지만 **점과정 + transformer 결합의 anchor**. 후속작 5+편이 THP 의 강도 정의를 그대로 채택.
- 코드 공개 + 데이터 Google Drive 공개. 단점: PyTorch 1.4 의존 (현행 환경에서 마이그레이션 필요).
