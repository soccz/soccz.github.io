# 07. 가정·한계·반박

## 명시된 가정 (저자 self-report)

- **Point forecast 중심**: v1 README verbatim: "**timesfm-1.0-200m** … It focuses on point forecasts, and does not support probabilistic forecasts. We experimentally offer quantile heads but they have not been calibrated after pretraining." 즉 논문은 확률 예측을 자기 스코프 밖으로 명시적으로 밀어냄. 이건 정직한 스코프 선언이자 동시에 한계.
- **Univariate forecast**: v1 README verbatim: "It performs **univariate** time series forecasting for context lengths up to 512 timepoints and any horizon lengths, with an optional frequency indicator." 다변량 상호작용은 학습하지 않고, 각 변수를 독립 시계열로 취급. Multi-variate forecasting 을 원하면 시계열을 하나씩 넣어야 함. MOIRAI 의 Any-Variate Attention 이 정확히 이 gap 을 채움.
- **Frequency 카테고리의 3-단계 이산화**: {0: T·MIN·H·D·B·U, 1: W·M, 2: Q·Y}. 이 이산화는 유저에게 명시적 부담을 준다 (freq label 을 주어야 함) + 이산화가 뭉툭 (예: 시간 H 와 일간 D 를 같은 0 으로 묶음).
- **Corpus 재현 불가**: Google Trends + Wikipedia pageviews 는 라이선스/API rate limit 사정으로 제3자 재현 불가.

## 암묵적 가정 (말 안 했지만 깔림)

1. **Downstream 시계열이 pretrain corpus 와 통계적으로 겹친다**. Google Trends + Wiki pageviews 는 human-attention 시계열이라 뉴스, 이벤트, 계절적 관심 등의 통계를 강하게 담는다. 자연현상 (기상, 지진), 초고빈도 금융 (LOB tick), 생물학 신호 (뇌파, 심박) 는 이 통계와 거리가 있음. 논문의 aggregate 벤치마크가 잘 나오더라도 특정 도메인에서는 zero-shot 성능이 급락할 수 있다.
2. **MSE 가 downstream utility 를 대변한다**. 대부분의 실용 응용은 MSE 최소화가 곧 utility 최적이 아니다. 재고 관리는 quantile 예측 (95% 서비스 레벨), 리스크 관리는 VaR/ES, 헤지는 tail-aware loss. 이 논문은 이 gap 을 인정하고 point forecast 로만 성공을 정의.
3. **Patch length $p=32$ 가 다양한 sampling rate 를 커버**. Sampling 이 1분인 시계열에서 32 시간점 = 32분, 일간이면 32일, 월간이면 32달. 이 세 상황이 seasonally meaningful 하려면 각각 다른 주기와 정합해야 하지만 $p=32$ 는 다양한 주기와 어긋난다 (예: 일간의 7일 주기, 월간의 12개월 주기).
4. **Autoregressive rollout 의 exposure bias 는 무시할 수 있다**. 짧은 horizon 은 rollout 없어서 문제 없지만, 720 시간점 horizon 은 6+ 회 rollout → error 누적. 논문은 이 누적을 정량화한 표를 보였는지 원 §5 확인 필요.
5. **Frequency label 이 정확하게 주어진다**. 유저가 mislabel 하면 (예: 실제 월간을 카테고리 0 으로 표기) 성능이 어떻게 무너지는지 논문은 답하지 않음.

## 반박 가능한 지점 1: "Zero-shot 이 정말 zero-shot 인가 — pretrain corpus 와 downstream 사이 데이터 leakage 위험"

**핵심 주장**: Google Trends 는 광범위한 도메인 · 언어권의 검색 관심도를 담고 있어, downstream 벤치마크의 카테고리 (예: 뉴스 트래픽, 이벤트 관련 트래픽) 와 통계 겹침이 있을 수 있다. Wikipedia pageviews 도 마찬가지. 논문의 aggregate zero-shot 성능이 이 leakage 로 부풀려졌을 가능성.

**검증 방법**: (a) Downstream dataset 의 각 시계열을 Trends/Wiki 코퍼스에서 검색해 통계적 유사도 (예: DTW distance) 를 측정, 유사도 상위 20% vs 하위 20% 시계열에 대한 zero-shot 성능 격차를 본다. leakage 가 없다면 격차가 작아야 함. (b) 완전 out-of-domain (예: 실험실 물리 시계열, 지진파, 뇌파) 시계열로 zero-shot 성능을 측정 → aggregate 성능 대비 얼마나 나쁜지 정량화.

이 문제는 논문에 어떻게 다뤄졌는지 원 §5.x + Appendix 확인 필요. 저자 README 및 secondary 문헌은 이 leakage 관점을 명시적으로 다루지 않았다.

## 반박 가능한 지점 2: "Point forecast 중심의 성공 정의는 실용 응용의 대부분을 놓친다"

**핵심 주장**: 재고 관리 · 리스크 관리 · 헤지 · 이상 탐지 · 시나리오 시뮬레이션 등 대부분의 산업 응용은 확률적 예측 (quantile, distribution, sample path) 을 요구. TimesFM v1 의 미보정 quantile head 는 이 요구에 부적합. 따라서 "TSFM 은 성공했다" 라는 함의는 조심스럽게 읽어야 함 — MSE 벤치마크만 대변한 성공.

**검증 방법**: (a) CRPS · pinball loss 로 quantile head 를 정량 평가, MOIRAI (4-mixture) 대비 얼마나 뒤처지는지. (b) 재고 최적화 시뮬레이션 (예: newsvendor loss) 으로 downstream utility 를 재정의하고, TimesFM vs MOIRAI vs Chronos vs 전통 statistical baseline 비교.

이 부분은 v2.5 의 continuous quantile head 로 저자 스스로 문제를 부분 해결했지만, 원 논문 (2024) 은 이 gap 이 열린 상태.

## 반박 가능한 지점 3: "Univariate-only 는 다변량 상호작용을 놓친다"

**핵심 주장**: 실전 예측 대부분은 다변량 (여러 시계열이 상호 영향). Traffic + weather, product sales + promotion + price, portfolio returns + risk factors 등. Univariate 는 각 변수를 독립 취급 → cross-variate 정보 손실.

**검증 방법**: (a) 다변량 벤치마크 (Electricity 321-변수, Traffic 862-변수) 에서 TimesFM univariate 처리 vs iTransformer (variate-token) vs MOIRAI (Any-Variate Attention) 성능 비교. (b) 이벤트 지시자 (promotion binary) 나 외생 covariate 를 추가하는 시나리오 → TimesFM v1 에는 이 기능이 없고 v2.0 이후 XReg (`forecast_with_covariates`) 로 확장.

이 gap 은 MOIRAI (다변량 native) 및 TimesFM v2.0+ XReg 확장으로 저자들이 이후 인정한 셈.

## 재현성 평가

- **코드 공개**: Apache-2.0, `google-research/timesfm` GitHub 저장소 + PyPI. 인퍼런스 코드는 완전 공개.
- **모델 체크포인트 공개**: HuggingFace 3 개 (1.0-200m, 2.0-500m, 2.5-200m). 완전 공개.
- **학습 코드 공개**: v1 README 는 "This repo contains the code to load public TimesFM checkpoints and run model inference." 즉 **inference 만 공개, pretraining 학습 코드는 공개 안 함**. Fine-tuning 은 이후 notebook 으로 공개 (`notebooks/finetuning.ipynb`).
- **학습 코퍼스 공개**: **미공개** (라이선스 사정). 재현자는 대체 corpus 를 구축해야 하고, 결과가 저자 성능을 재현할지 불확실.
- **논문에 안 나온 디테일**:
  - 정확한 optimizer / lr / warmup / weight decay
  - Batch size / gradient accumulation
  - Positional embedding 종류 (v1 은 sinusoidal? learned?)
  - Real vs synthetic 비율
  - 사용된 TPU/GPU 개수 및 학습 wall-clock 시간
  - Frequency 카테고리 를 정확히 어느 위치에 embedding 하는지
- **평균만 보고됐는가**: 원 §5 표에서 seed 통계 (평균 ± 표준편차) 를 어떻게 보고했는지 원 PDF 확인 필요. Secondary 문헌은 이 부분을 재인용 안 함 → 대체로 아래에 보고했더라도 소수 seed 로 추정.

## 요약: 이 논문의 한계 스펙트럼

- **강한 한계 (저자 self-report)**: point forecast 중심, univariate, quantile head 미보정, 코퍼스 재현 불가.
- **중간 한계 (암묵적)**: leakage 위험, MSE = utility 등가 가정, patch length 다양 seasonality 정합 부족.
- **약한 한계 (아마도)**: seed 통계 보고 부족, hyperparameter 상세 부족.

이 한계들은 이후 논문들 (MOIRAI, Chronos, VisionTS, TimesFM v2.0/v2.5, Tan et al. NeurIPS 2024) 이 각자 방향에서 채우는 도로 표지판 역할을 한다.
