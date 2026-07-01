# 06. 실험 해부

## 배경 사다리

이 절을 이해하려면 세 개념만 있으면 된다. ① **Zero-shot** = 학습에 안 쓴 새 dataset 에 손 안 대고 바로 예측. ② **MASE** (Mean Absolute Scaled Error) = 예측 오차를 naive 예측 (예: seasonal naive) 의 오차로 나눠 정규화한 지표 — 1 이면 naive 와 동급, <1 이면 더 좋음, >1 이면 더 나쁨. ③ **CRPS** (Continuous Ranked Probability Score) = 확률 예측 지표. 예측 분포 F 와 실제값 y 사이의 거리를 잰다.

**중요 원칙**: 본 remote 환경에서 원 PDF 표 절대 수치를 확인하지 못했다. 따라서 "TimesFM 이 dataset A 에서 MASE 0.xxx" 같은 수치는 이 문서에서 **인용하지 않는다**. 대신 (i) 어느 벤치마크에서 어떤 성격의 비교를 했는지, (ii) 저자 README + secondary 문헌으로 확정된 정성적 결과, (iii) 왜 그런 결과가 나온다고 저자가 주장하는지 만 다룬다.

## 벤치마크 3그룹

논문 §5 는 크게 세 벤치마크 그룹을 다룬다 (secondary 문헌 + v1 README 교차 확인).

### 그룹 1: Monash Time Series Archive

- **어떤 데이터**: Monash 대학 팀 (Godahewa et al. NeurIPS 2021 Benchmarks) 이 정리한 30 여 개의 다양한 도메인 시계열 archive. 소매 판매, 교통, 웹 트래픽, 관광, 은행, 병원, 태양광, 풍력 등. 각 dataset 은 여러 시계열의 collection.
- **왜 적합한가**: 도메인 다양성 → zero-shot foundation model 이 정말 도메인 넘어 일반화하는지 검증하기 좋음. 또한 표준화된 baseline 결과 (LightGBM, Prophet, DeepAR, N-BEATS, WaveNet, PatchTST 등) 이 archive 에 정리돼 있어 비교가 명확.
- **숨은 편향**: (i) Monash 시계열 중 일부는 계열이 짧고 (< 100 obs) TimesFM 의 큰 context 활용이 제한적. (ii) 30 여 dataset 이 균등 가중되는 aggregate metric 은 극단 dataset (예: 이상치 심한 태양광) 이 평균을 왜곡할 수 있음.

### 그룹 2: Darts benchmark

- **어떤 데이터**: Darts (Herzen et al. JMLR 2022) TS 라이브러리가 제공하는 여러 실무 시계열 (M3, M4, Tourism, Weekly Traffic 등의 일부).
- **왜 적합한가**: Darts 는 산업계에서 많이 쓰이는 라이브러리 → downstream 재현/이식이 쉬움. Monash 대비 소량의 대표적 dataset 만 담아 신속 비교 가능.
- **숨은 편향**: dataset 이 적어 통계 검증력이 낮음. 특정 dataset (특히 M4 Yearly) 에 편중되면 결론이 흔들림.

### 그룹 3: Long-horizon TS forecasting (ETT / Weather / Electricity / Traffic)

- **어떤 데이터**: PatchTST/iTransformer/Autoformer 계열이 표준 벤치마크로 쓰는 4 개 dataset. horizon {96, 192, 336, 720} 4 단계.
- **왜 적합한가**: 이 벤치마크는 supervised TS Transformer 커뮤니티의 사실상 표준 → supervised SOTA 와 TimesFM zero-shot 을 직접 비교 가능. "zero-shot 이 supervised 근처까지 가는가?" 라는 논문의 주장을 검증하는 핵심.
- **숨은 편향**: (i) ETT 는 전력 트랜스포머 온도 · 오일 계열이라 단일 도메인. (ii) supervised SOTA 는 이 벤치마크에 특별히 튜닝됨 → "supervised 근처" 는 튜닝된 supervised 근처. (iii) 이 벤치마크의 horizon = {96, 192, 336, 720} 중 96, 192 는 TimesFM output patch $h=128$ 로 rollout 1-2 회면 충분하지만 720 은 rollout 6 회 이상 필요 → exposure bias 위험 증가.

### (논문 이후 추가된 그룹) GIFT-Eval

- **논문 시점 (2024-04)**: 미공개.
- **논문 이후 (2024-Q4~)**: Salesforce/HuggingFace 의 GIFT-Eval (55 dataset, 97 test case) leaderboard 에 TimesFM 2.0 이 등록되어 **aggregated MASE 로 1위, 다음 최고 대비 6% 우위** (저자 v1 README verbatim). v2.5 는 MASE + CRPS 모두 1위 (저자 최신 README).
- **함의**: 원 논문의 존재 증명이 이후 표준 leaderboard 로 검증된 셈.

## 베이스라인 공정성

논문 §5 는 다음 baseline 을 비교 (secondary 문헌 + v1 README 재구성):

- **Classical**: seasonal naive, ARIMA, ETS, Prophet.
- **Global DL supervised**: DeepAR, N-BEATS, TFT (Temporal Fusion Transformer), PatchTST, iTransformer.
- **동시대 TSFM**: LagLlama (2023), MOMENT (2024), Chronos (2024).

**공정성 우려**:
1. **Chronos 등 동시대 TSFM 의 학습 코퍼스가 서로 다름** → "zero-shot" 이라는 동일 조건이라도 학습 데이터 다양성에 따라 다른 downstream 에 유리/불리. 이걸 통제하는 vs 통제하지 않는 실험은 어렵다. 논문은 이 gap 을 어떻게 다뤘는지 원 §5 확인 필요.
2. **Supervised baseline 은 각 dataset 에 hyperparameter 튜닝됨** → supervised 가 잘 되는 게 당연. "zero-shot 이 그럭저럭 근접" 이라는 주장은 이 튜닝 비대칭을 인정하고 읽어야 한다.
3. **PatchTST · iTransformer 는 lookback / patch size 를 dataset 별 grid search 함** → 원 논문의 zero-shot vs supervised 비교가 절대 수치로는 supervised 승이지만, "adaptation 비용 대비 성능" 이라는 이차 지표를 도입하면 TimesFM 유리.

## 지표 선택

- **Point forecast: MASE / MAE / MSE / sMAPE**. 각각 강점: MASE 는 scale-invariant + naive baseline 비교 자연스러움; MAE 는 median-optimal (heavy tail 에 안정); MSE 는 학습 loss 와 정합 (하지만 outlier 에 민감); sMAPE 는 상대오차라 large-scale 시계열에 유리하지만 0 근처 시계열에서 불안정.
- **Probabilistic forecast (부분적)**: CRPS. TimesFM v1 은 quantile head 가 미보정이라 CRPS 를 primary metric 으로 쓰기 어려움 → 논문 §5 는 대부분 point forecast metric 위주. 이 gap 이 P1 ProTran-TFA 같은 확률 예측 track 의 존재 이유.
- **왜 다른 지표였다면 결론 변화**: 만약 tail-aware metric (VaR miss ratio, ES) 을 썼다면 TimesFM 이 훨씬 나빠질 것. 이 논문은 tail 성능을 주장 안 하고, 이 정직함이 self-report ("point forecast only") 와 정합.

## 주요 표·그림 (원 논문 §5, 정확한 표 번호는 원 PDF 확인 필요)

1. **Aggregate performance table (Monash & Darts)**: TimesFM zero-shot vs supervised SOTA 의 aggregate MASE/MAE. 논문의 핵심 결과.
2. **Long-horizon table (ETT/Weather/Electricity/Traffic)**: TimesFM zero-shot vs iTransformer / PatchTST / TimesNet / TSMixer. horizon {96, 192, 336, 720} 별로.
3. **Ablation: input patch length $p$**: $p \in \{8, 16, 32, 64\}$ 스캔의 zero-shot 성능. $p=32$ 가 최선인 이유 정량 증거.
4. **Ablation: output patch length $h$**: $h \in \{32, 64, 128, 256\}$ 스캔. $h=128$ 이 rollout 오차 vs 학습 시 감독 신호 밀도의 trade-off 최적점임을 보임.
5. **Ablation: pretraining corpus 크기**: 코퍼스를 10%/50%/100% 로 스케일하며 성능 곡선. 100B → SOTA 근처, 10B → 격차 벌어짐 등의 scaling law 관찰이 있을 것으로 예상.
6. **Ablation: real vs synthetic 비율**: real-only, real+synthetic 비교. Synthetic 이 real 이 커버 못하는 통계 조각을 채우는 증거.

원 PDF 접근 불가로 위 표들의 **절대 수치는 이 문서에서 인용하지 않음**. "논문 §5 표 X 에서 Y 를 뒷받침" 이라는 위치 지시만 사용.

## Ablation: 저자가 일부러 넣은 것

원 논문 §5 (표 정확한 번호는 원 PDF 확인 필요) 는 다음 ablation 을 수행할 것으로 예상 (secondary 문헌 및 논문 구조로 재구성):
- **Frequency conditioning 유무**: 유의미한 성능 gap 있어야 이 conditioning 이 정당화됨.
- **Positional embedding 유무**: v1 은 있음, v2.0 은 없음으로 이동 → v1 논문 자체가 없어도 되는지의 실험을 했는지 확인 필요.
- **Residual block vs 단순 linear embedding**: MLP+skip 이 정말 필요한지.
- **Model size**: 200M vs 500M scaling 곡선 (v1 대비 v2.0).

## Ablation: 저자가 숨긴 것

- **재현 protocol 의 seed 개수**: 3 seed 인지 5 seed 인지 원 §5 확인 필요. seed 하나면 통계 검증력 약함.
- **Downstream dataset 이 pretrain corpus 와 얼마나 겹치는가**: Google Trends 코퍼스에 downstream 에서 쓴 카테고리가 실제로 있는지 (예: ETT 는 특수 도메인이라 겹칠 확률 낮음, 반면 Traffic 은 겹칠 확률 존재). 이 leakage 문제는 저자가 명시적으로 답 안 하고 넘어갔을 가능성이 있음 (§5 확인 필요).
- **Tail-aware / extreme value performance**: heavy-tail 시계열 (금융 log-return, 지진, 자연재해) 에서의 zero-shot 성능. 저자는 point forecast 중심임을 인정하고 이 실험을 생략.

## 부록에 숨은 신호

- **Failure modes**: 특정 도메인 (예: 정상성 강한 짧은 시계열) 에서 TimesFM 이 크게 실패하는지. 원 논문 부록에 실패 사례 시각화가 있을 것으로 예상.
- **Frequency mislabel 실험**: freq label 을 일부러 틀린 카테고리로 넣으면 zero-shot 성능이 얼마나 무너지는지. 유저 오류에 대한 robustness. 원 부록 확인 필요.
- **Fine-tuning 결과**: pretrained 를 downstream 에 소량 fine-tune 한 결과. supervised SOTA 를 넘어서는지. v1 README 는 이후 노트북 (`notebooks/finetuning.ipynb`) 으로 이 방향을 지원한다고 언급.

## 수치 투명성 원칙

- 본 문서는 **원 PDF 표 절대 수치를 인용하지 않는다**. 저자 README 에 명시된 정성적 결과 ("TimesFM 2.0 이 GIFT-Eval aggregate MASE 로 다음 최고 대비 6% 우위") 만 인용.
- Ablation 결과는 "논문 §5 표 X 에서 뒷받침" 이라는 위치 지시로 처리. 이 문서로 실증 수치를 인용해야 할 경우 반드시 원 PDF 재확인 후 사용.
- MASE/CRPS 리더보드 순위는 GIFT-Eval 페이지 및 저자 README 를 verbatim source 로 사용.

## 실험 파트의 한 문장 요약

**"3 그룹 벤치마크 (Monash + Darts + long-horizon) 에서 TimesFM zero-shot 이 supervised SOTA 근처까지 붙는다 — 절대 수치는 원 §5 표에서 확인 필요, 이후 GIFT-Eval leaderboard 도 이 존재 증명을 aggregate MASE 1위로 재확인."**
