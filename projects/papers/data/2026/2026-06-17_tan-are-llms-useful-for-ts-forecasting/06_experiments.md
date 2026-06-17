# 06. 실험 해부

## 데이터셋 각각 — 왜 이 7개인가, 어떤 편향이 있나

본 논문의 실험 격자에서 단정 가능한 데이터셋 7종 (저자 GitHub README verbatim):

### (1) ETTh1, ETTh2 — Electricity Transformer Temperature (Hourly)

- *어떤 데이터인가*: 중국의 전력 발전 변압기에서 측정한 oil temperature 와 6 가지 부하 관련 변수 (HUFL, HULL, MUFL, MULL, LUFL, LULL). 2년간 시간당 (1h) 측정. 7 변수.
- *왜 이 데이터가 적합한가*: Informer (Zhou 2021) 가 도입한 long-term TSF 표준 벤치. 강한 일간 + 약한 계절성 + 가끔 비정상 부하 점프. LLM-for-TS 라인의 모든 논문이 평가하는 표준 → fair 비교.
- *숨은 편향*: 7-변수만 있는 *소규모 다변량* — high-channel 의존성을 못 묻는다. 또 일간 주기성이 *너무 강해서* 단순 패치-어텐션 베이스라인이 이미 SOTA 인 경향. 즉 LLM 의 추가 가치가 *원래도* 잘 안 나타나는 데이터셋. (단, 이게 본 ablation 메시지에 유리/불리한가는 양면.)

### (2) ETTm1, ETTm2 — 15분 단위 변형

- *어떤 데이터인가*: 동일 변압기, 15분 (15m) 단위 측정. ETTh 의 4배 해상도.
- *왜 적합한가*: 같은 시스템의 *세밀 해상도* 시계열에서도 같은 결론이 나는지 검증. 시간 축의 *밀집도* 가 LLM 의 의미를 바꾸지 않는다는 robustness 신호.
- *숨은 편향*: ETTh 와 동일 source 라 *correlated* — 데이터셋 다양성이 실제로 7 ≠ 7 (4 ETT + Weather + Traffic + Illness = 4 가족).

### (3) Weather — 21 변수 기상

- *어떤 데이터인가*: 막스 플랑크 생물지화학 연구소의 기상 관측 — 온도, 습도, 풍향, 풍속, 강수량, 이슬점 등 21 변수. 10분 단위.
- *왜 적합한가*: 다변량 + 비정상 + 약한 계절성 (날씨는 일주일 주기는 없고 계절-연단위 추세 만). LLM 이 잘하리라 기대되는 setting (자연어로 표현 가능한 패턴) 인데도 못한다는 것 → 강한 음성 신호.
- *숨은 편향*: 다변량이지만 변수 간 상관이 강함 (온도-습도-이슬점은 강한 종속) → 채널 독립 모델이 정보 손실. 본 ablation 은 이를 통제하지 않음.

### (4) Traffic — 862 sensor 도로 점유율

- *어떤 데이터인가*: 캘리포니아 고속도로의 862 개 sensor 의 시간당 점유율. PAttn 디폴트 `enc_in=862` 가 여기서 유래.
- *왜 적합한가*: 다변량 *대규모* (862 vars), 강한 시간-요일 주기성. 채널 독립 모델이 *충분한가* 의 시험대.
- *숨은 편향*: 변수 간 *공간 인접* 정보가 강함 (옆 sensor 끼리 correlated). 채널 독립 무시 → 정보 손실. PAttn 의 channel-independence 가 *부당하게 핸디캡* 일 수 있음.

### (5) Illness — 미국 ILI (Influenza-Like Illness) 비율

- *어떤 데이터인가*: CDC 가 보고하는 주간 인플루엔자-like 환자 비율. 9 년치 주간 데이터. 7 변수.
- *왜 적합한가*: *적은 표본* (≈ 400 weeks) — few-shot 자연 환경. 강한 연간 주기 + 팬데믹 시 비정상 점프.
- *숨은 편향*: 시퀀스가 짧아 *통계적 유의성* 이 약함. horizon 도 더 짧음 (24/36/48/60). LLM 의 *적은 데이터* 가치를 평가하기엔 좋지만, 표본 수 자체가 적어 conclusion 의 신뢰성 약함. 본 논문은 이 데이터셋에서도 LLM 무용을 보임 → claim 2 (few-shot) 의 주요 근거.

### 데이터셋 선택의 *부재* — 무엇이 빠졌나

- **Electricity** (Yeh-Fang Wang 2003 의 전력 데이터셋, 321 vars): Informer benchmark 표준 7개 중 하나인데 본 논문의 7 개에서 빠짐 (README 기준). 본 환경 미확정 — 본문에 있을 수 있음.
- **Exchange-Rate**: 환율 시계열. *시계열 forecast 의 가장 비정상적이고 예측 불가한* 데이터. TimesNet (Wu 2023) 이 "Exchange-Rate 에선 FFT-period detection 이 허위" 라고 경고. 본 논문이 *이걸 안 다룬 것* 자체가 한계 (금융 시계열 일반화 약화).
- **M4 / M5 / Monash / GIFT-EVAL**: zero-shot/cross-domain 벤치마크. *진짜 LLM 의 가치가 있다고 주장* 되는 setting. 본 논문은 이걸 안 다루므로 "in-domain ablation 만 했다" 는 한계.

## 베이스라인 공정성

본 ablation 의 fairness 핵심:

- **Base method 의 원본 hyperparameter 유지**. 즉 "LLM 빼고 lr 만 더 잘 잡았다" 가 아님. 본 README 의 실험 스크립트가 base method 별 디렉토리 분리로 hyperparameter 격리 → 이 부분 robust.
- **PAttn 의 hyperparameter** 는 별도 — `lr=1e-4, batch=512, epochs=10, patience=3`. 이건 PatchTST 디폴트와 가까움 → "PAttn 만 특별히 튜닝됐다" 는 비판 차단.
- **Seed averaging**: README 의 실험 스크립트가 multi-seed runner 인지는 본 환경 미확인. *3~5 seed 평균* 이 표준인데, 만약 single seed 라면 표 절대 수치의 robustness 약함.

## 지표 선택 — MSE / MAE 가 적절한가

본 논문은 표준 long-term TSF metric:

- **MSE** (Mean Squared Error): 큰 오차에 강한 페널티. 정상성 가정 하에 unbiased.
- **MAE** (Mean Absolute Error): robust to outlier. 실용적.

*만약 다른 지표였다면*:
- **CRPS** (Continuous Ranked Probability Score): 분포 forecast 의 정밀도. LLM-for-TS 라인 중 분포 head 를 쓰는 변형 (예: Time-LLM 의 일부 변형) 에선 CRPS 가 더 적절. 본 논문은 *점 forecast* 만 — 분포 결론은 미해결.
- **MASE** (Mean Absolute Scaled Error): scale-free, naive forecast 대비 비율. zero-shot 벤치 (Monash / GIFT-EVAL) 표준. 본 논문은 in-domain MSE/MAE 만.
- **Quantile loss / pinball**: tail-risk 평가. 금융 응용에 본질적. 본 논문 미적용.

→ 본 논문의 *결론 범위는 point forecast MSE/MAE 평균에서의 LLM 무용*. 분포/tail/zero-shot 결론은 *별도 검증 필요*.

## 주요 결과 — 본 환경 단정 가능 수준

본 환경에서 표 절대 수치는 미접근. 따라서 다음 진술만 단정 가능 (Source Lock 통과):

| 결과 종류 | 단정 가능 진술 |
|---|---|
| Ablation 결과 (Main Table) | 3 ablation × 3 base × 7 dataset 에서 *대부분의 셀* 에서 ablation 이 원본보다 같거나 더 좋음 (README verbatim "in most cases the results even improved") |
| 학습 시간 비교 | Time-LLM 의 LLM 제거 시 평균 28.2× 가속, OFA 2.3×, LLaTA 1.2× (WebSearch verbatim) |
| Few-shot | 줄어든 학습 split 에서도 ablation 우위 또는 동등 (WebSearch verbatim "do not assist in few-shot settings") |
| Shuffle | 입력 셔플 시 성능 큰 변화 없음 (WebSearch verbatim "do not represent the sequential dependencies in time series") |
| PAttn vs base | PAttn 이 3 LLM-base 변형과 동등 또는 그 이상 (README verbatim "matches performance") |
| 표 절대 수치 | **본 환경 미확인** — 본 해체에서 단정하지 않음 |

## 주요 표·그림 해석 (단정 가능 범위)

본 환경에서 *어떤 표가 어디 있는지* 까지는 단정 가능하지만 *셀 안의 숫자* 는 단정 불가. 따라서 메타 해석만:

1. **Main ablation table** (예상 Table 1 또는 2): 3 base × 4 변형 (original + 3 ablations) × 7 dataset × 4 horizon 의 격자. *대각선 패턴* — 모든 base 의 ablation 행이 original 행과 비슷하거나 더 좋은 값 — 이 본 논문의 가장 강력한 시각적 메시지.
2. **Training time table** (예상 Table): Time-LLM 28.2× 행이 가장 큰 효과 — 가장 비싼 LLM (LLaMA-7B/13B class) 백본을 가진 base 가 가장 많이 절감.
3. **Few-shot figure** (예상 Figure): 학습 비율을 x 축, MSE/MAE 를 y 축으로 plot. ablation 곡선이 original 곡선 아래에 (또는 같이) 흐르는 패턴 예상.
4. **Shuffle figure** (예상): 셔플 정도 vs 성능 변화. LLM original 이 ablation 보다 *더 빠르게 망가지지 않음* — 즉 *진짜로 순서 정보를 쓴다면* 더 빠르게 망가져야 하는데 안 그러는 패턴 예상.

## Ablation 의 *숨은 추가* — 저자가 일부러 넣은 / 숨긴 것

본 환경에서 단정 가능한 추가 ablation 시그널:

- README 의 디렉토리 트리에 *각 base method 별로 같은 ablation 변형* 이 다 들어있음 → ablation 통일성 강조 (저자가 *공정* 한 비교임을 강조).
- `PAttn/script` 디렉토리에 7 데이터셋별 실험 스크립트 → reproducibility 강.
- README 가 *시각화 디렉토리* `/pic` 을 따로 둠 → 본문에 figure 가 다수 있음 시사.

저자가 *안 한* 것 (한계 신호):

- **Cross-method ablation** — 예: OFA 의 어댑터를 Time-LLM 의 어댑터로 바꿔보기. 어댑터 자체의 효과 분해 없음.
- **Layer-depth ablation** — LLM 블록 중 *몇 층까지* 가 무용한지 분해 없음 (all-or-nothing).
- **Pretrain-data ablation** — LLM 의 *어떤 pretrain corpus* 가 무용한지 (LLaMA vs GPT-2 vs BERT) 비교 일부만.

## 부록에 숨은 신호 (추정)

본 환경 미확정이지만, NeurIPS 표준 패턴:
- Appendix 에 *각 ablation 의 seed 별 분산* 보고 (가능성 높음).
- Appendix 에 *추가 데이터셋* (예: Electricity) 결과.
- Appendix 에 *visualization* — attention map 비교 (LLM original vs LLM2Attn).
- Appendix 에 *추가 base method* (예: TEMPO, LLM4TS) 의 ablation.

## 수치 투명성 선언

본 해체는 *결과의 형태와 방향* 만 단정한다. 표 셀의 절대 수치 (예: ETTh1 horizon 96 의 MSE = 0.??) 는 **본 환경 PDF 미접근으로 단정하지 않는다**. 사용자가 원논문 PDF 에 접근 가능해지면 단정 가능.
