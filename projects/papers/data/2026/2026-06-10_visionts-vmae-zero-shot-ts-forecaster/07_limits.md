# 07 · 가정·한계·반박

## 명시된 가정 (저자가 README/abstract 에서 인정)

본 환경에서 본문 PDF 의 Limitation 절 직접 확인 불가. 다만 README "key feature" + 후속 VisionTS++ 의 motivation 으로부터 본 논문이 인정하는 한정 영역:

1. **Univariate / Multivariate ≤ 3 변수 중심**: RGB 3 채널 매핑이 자연스럽고, multi-channel ≥ 4 의 처리는 후속 VisionTS++ 가 명시적으로 확장 motivation 으로 둠 → 본 논문이 multi-channel 처리에서 자기 한정.
2. **Point forecasting 중심**: PF (probabilistic) 그룹이 있지만 VisionTSpp 변형으로 처리. 본 본문 메인은 point forecasting → uncertainty quantification 은 후속 motivation.
3. **단일 periodicity 가정**: 코드에서 `self.periodicity` 가 init 시 받는 단일 정수. 다중 주기 / unknown periodicity 처리는 명시적으로 미해결.
4. **224×224 이미지 사이즈 고정**: MAE pretrained checkpoint 의 입력 사이즈에 묶임. 매우 짧거나 긴 시계열은 자동 보간으로 처리되지만 정보 손실 명시.

## 암묵적 가정 (말 안 했지만 깔려 있는 것)

### (A) "자연 이미지 픽셀 통계 ≈ 시계열 차트 픽셀 통계"
norm_const=0.4 라는 hyperparameter 가 ImageNet 분포 (mean ~0.485, std ~0.229) 와 정규화된 시계열을 맞추기 위한 조정. 이 매칭은 **ImageNet 외 vision foundation model** (medical imaging, satellite, microscopy 등) 으로 backbone 을 바꾸면 깨진다. 즉 본 논문의 결과는 **MAE × ImageNet 이라는 특정 조합** 에 묶인 결과이지 "vision pretraining 일반" 의 결과가 아닐 수 있음.

### (B) "Contiguous mask 도 random sparse mask 와 같은 분포"
MAE 가 학습 때 본 mask 는 75% random. Inference 때 마스크는 horizon 영역에 contiguous block. He 2022 ablation 에서 "block-wise mask" 가 "random mask" 보다 어렵다는 보고. 본 논문이 이 차이를 어떻게 다뤘는지 본문 미확인 — 대규모 마스크의 contiguous block 으로 일반화가 의외로 잘 됐다는 점 자체가 발견인지 우연인지가 critical 한 검증 영역.

### (C) "시계열의 정보가 픽셀 휘도 (luminance) 만으로 충분히 보존된다"
2D reshape 된 격자를 224×224 로 보간하면 시간축의 미세 변동이 부드러운 픽셀 그라데이션으로 변환됨. 시계열의 **고주파 spike** (예: market microstructure 의 tick volatility, point process spike train) 은 보간 후 어떻게 보존되는지 미검증.

### (D) "MAE 의 decoder 가 추가 모듈 없이 시계열 외삽까지 한다"
MAE 학습 목적은 "본 적 없는 영역의 픽셀 복원" 이지 "시간 인과 (causality)" 를 학습한 게 아니다. 본 논문의 horizontal concat 정렬은 implicit 하게 "왼쪽 → 오른쪽" 의 인과를 부과하지만, MAE 의 양방향 attention 자체는 미래 → 과거 정보 흐름도 허용. 추론 시 정보 누설은 mask 가 차단해서 명시적이지만, 학습된 가중치가 implicit 인과를 어느 정도 갖느냐는 mech interp 필요 영역.

### (E) "ImageNet bias 와 시계열 bias 의 충돌"
ImageNet 은 객체 중심·중앙 배치·자연 색상의 강한 prior 를 갖는다. 시계열 차트는 그런 prior 없음. 본 논문의 forward 에서 변환된 이미지가 ImageNet 분포의 어디에 위치하는지 (out-of-distribution 정도) 본문 미확인. transfer 성공이 "공짜" 인지 "우연한 분포 겹침" 인지의 구분이 본 논문의 가장 미묘한 부분.

## 반박 가능한 지점 (각 한 단락)

### 반박 1 — "Zero-shot ranking 1 위는 evaluation pipeline 의 비공정 비교일 수 있다"
GIFT-EVAL leaderboard 의 zero-shot 평가는 (i) 각 foundation model 이 자체적으로 정의한 context length 와 forecasting horizon, (ii) 데이터셋별 normalization, (iii) 평가 시점의 model checkpoint 버전 차이로 ranking 이 흔들릴 수 있다. 본 논문이 leaderboard 상 #1 인 것은 evaluation 측 일관성을 검증해야 한다. **반박 검증법**: 모든 foundation model (Chronos, MOIRAI, TimesFM, VisionTS) 을 동일 evaluation 코드 + 동일 context length 256 + 동일 horizon 96 / 192 / 336 / 720 으로 통제 비교 → 4 모델 동시 평가 표. 이 실험을 수행하기 전엔 ranking 만으로 "image MAE 가 TS-native FM 을 이긴다" 라는 강한 명제 단정 못 함.

### 반박 2 — "Periodicity 외부 지정은 hidden hyperparameter tuning"
본 논문이 코드에서 `periodicity` 를 외부에서 받는 점은 **데이터셋마다 manual tuning** 이라는 뜻이다. Chronos / MOIRAI / TimesFM 은 데이터셋 specific 하이퍼파라미터를 거의 받지 않거나 자동 추출. 본 논문이 "1-st rank zero-shot" 일 때, 모든 데이터셋에서 periodicity 가 잘 맞춰진 채 평가됐다면 그건 fair comparison 이 아닐 수 있다. **반박 검증법**: periodicity 를 (i) FFT 자동 추출 (ii) 임의 정수 [12, 24, 36, 48] 균등 분포로 sampling 한 평균 (iii) periodicity 효과 무시 (단순 stack reshape) — 세 조건 비교 → VisionTS 의 ranking 이 유지되는지 측정. **만약 이 robustness 가 약하면 zero-shot 주장에 강한 단서 첨가 필요**.

### 반박 3 — "Image-domain bias 가 시계열의 본질적 패턴을 왜곡할 수 있다"
ImageNet pretrained MAE 는 자연 풍경의 hierarchical feature 를 학습. 그러나 시계열의 **regime shift** (정상성 깨짐) 나 **fat-tail** (극단치 발생) 같은 본질 패턴은 자연 이미지에 거의 없다. 본 논문이 이런 도메인 (finance volatility, point process, earthquake) 을 평가했는지 본문 미확인 — Monash 29 에 일부 포함될 수도 있으나 ranking 평균에 묻혔을 가능성. **반박 검증법**: 극단적 non-stationary / heavy-tail 시계열 (S&P500 daily returns, BTC 1h returns, Hawkes process simulation) 만 추출해 VisionTS vs MOIRAI vs TimesFM 비교 → image inpainting prior 가 fat-tail 을 어떻게 다루는지 확인. 이건 P1 ProTran-TFA 와 직접 연결되는 실험.

### 반박 4 — "MAE decoder 의 시간 인과 결여가 'next-step' 의미를 약화시킨다"
시계열 forecasting 의 본질은 인과 (과거 → 미래) 다. MAE decoder 는 양방향 attention 으로 mask 영역을 채우므로 image inpainting 측면에선 자연스러우나 시계열 측에선 잠재적 정보 누설 위험. 본 논문의 정렬 (mask 가 horizon 영역만 차지) 이 이를 방지하지만, **학습된 가중치 자체에 양방향성 bias 가 깔려있다**. **반박 검증법**: MAE decoder 의 attention pattern 을 추출해 query 위치(horizon 안의 한 패치) 가 어느 key 위치(context vs 다른 horizon 패치) 를 참조하는지 시각화. 만약 horizon 내부 다른 mask 패치를 강하게 참조한다면 양방향 bias 가 inference 출력에 영향. APF / Wilinski 2025 / Mishra 2026 (인덱스 05-27) 의 SAE 도구로 이 분석 가능.

### 반박 5 — "1 epoch fine-tune SOTA 주장은 compute 정규화 필요"
1 epoch fine-tune 으로 SOTA 라는 주장은 compute-efficient 처럼 들리지만, **fine-tune 직전 단계가 'ImageNet 으로 1.6M step pretrain' 된 MAE Large/Huge** 다. 이 사전훈련 비용을 0 으로 카운트하면 안 됨. 다른 모델 (예: TimesFM 의 100B parameter pretrain) 와 ImageNet MAE 의 compute 를 동일 단위로 환산하면 ranking 이 바뀔 수 있음. **반박 검증법**: FLOPs / GPU-hour / energy 단위로 사전훈련 + fine-tune 비용을 정규화한 efficiency frontier 그래프. compute-vs-accuracy curve 비교.

## 재현성 평가

- **코드 공개**: ✅ (MIT, github.com/Keytoyze/VisionTS, PyPI `visionts`).
- **모델 가중치 공개**: 외부 (Facebook MAE 공식 weight) 를 로드 — VisionTS 가 새로 학습한 가중치는 zero-shot 경로에 없으므로 weight 공개 issue 없음. fine-tune 가중치는 본 환경에서 README 명시 미확인.
- **데이터셋 공개**: LTSF 6 / Monash 29 모두 공개. PF 의 Walmart/Istanbul Traffic/Turkey Power 는 공개 데이터셋 (각각 Kaggle / Istanbul govt / TEIAS).
- **하이퍼파라미터 명시**: run.py default 는 명확. periodicity 의 데이터셋별 값은 본 환경에서 README 미확인 — 표준 LTSF 데이터셋 메타에서 유추 가능 (h=24, m=96, Weather=144, Traffic=168).
- **평균/분산 보고**: 본 환경에서 본문 표 미확인. 통상 ICML 논문은 3+ seed 평균 + 표준편차 보고가 표준이나 본 논문이 그렇게 했는지 직접 확인 필요.

전체 재현성 점수: **상** (코드/데이터/PyPI 모두 공개, 외부 MAE weight 도 공개). 단, periodicity 데이터셋별 값과 fine-tune 정확한 epoch/learning rate 가 본문/appendix 에서 검증돼야 완전 재현 가능.

## 이 절의 한 줄 요약

> "본 논문의 5 가지 암묵 가정 — ImageNet bias 매칭, contiguous mask 일반화, 픽셀 보존, MAE 양방향 인과, 단일 periodicity — 중 어느 하나라도 깨지는 시계열 도메인에서 zero-shot 성능 ranking 이 흔들릴 가능성. 본 환경에서 본문 표 미확인이므로 후속 검증에서 우선 점검할 항목."
