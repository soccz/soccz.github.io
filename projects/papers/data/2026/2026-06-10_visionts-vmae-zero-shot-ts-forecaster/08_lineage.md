# 08 · 이론적 계보

## 이론적 조상 (4 편) — 본 논문이 어떤 어깨를 빌렸는가

### 조상 1 — He et al. 2022 "Masked Autoencoders Are Scalable Vision Learners" (CVPR 2022)
**핵심**: Encoder 가 25% 패치만 보고, 가벼운 decoder 가 75% mask 토큰을 픽셀로 복원. MSE loss. ImageNet-1K 으로 self-supervised. ViT-L/Huge 가 supervised pretrained 보다 더 잘 transfer.

**본 논문과의 연결**: VisionTS 의 backbone 그 자체. `visionts/models_mae.py` 는 He 2022 의 `MaskedAutoencoderViT` 를 거의 그대로 복제 (encoder embed_dim/depth/heads + decoder embed_dim/depth/heads 가 He 2022 와 동일). **VisionTS 가 한 일은 He 2022 의 MAE 를 "시계열을 그림으로 바꾼 뒤 그 그림에 적용" 한 것** — 즉 MAE 의 가중치도 학습 목적도 그대로 받음.

**왜 어깨가 됐는가**: MAE 가 (a) encoder-decoder reconstruction 통합 학습, (b) ImageNet 사전훈련된 가중치 공개, (c) 마스크 비율 조정 가능 — 이 세 조건을 모두 만족하는 거의 유일한 대규모 vision backbone 이기 때문. CLIP/DINO/SAM 은 (a) reconstruction head 가 없거나 다른 형태로 학습돼 있어 본 논문이 못 빌림.

### 조상 2 — Dosovitskiy et al. 2021 "An Image is Worth 16x16 Words" (ICLR 2021, ViT)
**핵심**: 이미지를 $16\times16$ 패치로 잘라 transformer 에 태움. 사전훈련 데이터가 충분히 크면 CNN 을 능가.

**본 논문과의 연결**: ViT 의 patch tokenization 이 본 논문의 TS-as-image 와 정확히 align. patch_size=16, image_size=224 → 14×14 토큰 그리드는 VisionTS 의 reshape 결과와 매끄럽게 호환. 즉 ViT 의 patch grid 자체가 시계열의 (frame × phase) 격자와 같은 위상기학적 구조를 갖는다.

**왜 어깨가 됐는가**: ViT 의 token 단위가 image patch 라는 점에서 시계열 patch 와 직접 매핑 가능. CNN 백본이었다면 patch 토큰화 단계가 없어 시계열 정렬이 어색했을 것.

### 조상 3 — Wu, Hu, Liu, Zhou, Wang, Long 2023 "TimesNet" (ICLR 2023, 인덱스 05-13 cover)
**핵심**: FFT 로 시계열의 top-k 주기 탐지 → 각 주기로 reshape 해 2D 격자 → Inception 2D CNN → 적응 집계.

**본 논문과의 연결**: TS-as-2D 의 직접 직계 조상. VisionTS 의 `einops.rearrange 'b n (p f) -> b n f p'` 는 TimesNet 의 `Reshape1Dto2D` 와 같은 변환이다. 차이는 **TimesNet 은 FFT 로 자동 주기 탐지 + 모델 처음부터 학습**, **VisionTS 는 단일 주기 외부 지정 + ImageNet pretrained MAE 의 weight 그대로 사용**.

**왜 어깨가 됐는가**: TimesNet 이 시계열을 2D 로 펴는 게 의미 있다는 것을 ICLR 2023 mark 로 검증. 본 논문은 그 위에서 한 단계 더 — "2D 격자에 image pretrained 가중치를 직접 얹어도 되는가" — 를 풀었다. TimesNet 이 없었다면 VisionTS 의 인터페이스 디자인 정당화가 어려웠을 것.

### 조상 4 — Wang, Oates 2015 "Imaging Time-Series to Improve Classification and Imputation" (IJCAI 2015, GAF/MTF)
**핵심**: Gramian Angular Field (GAF), Markov Transition Field (MTF) 변환으로 시계열을 image 로 만든 뒤 CNN 으로 분류.

**본 논문과의 연결**: TS-as-image 의 최초 mark. 본 논문은 명시적으로 인용하는지 본문 미확인이지만, **시계열을 이미지로 보는 발상의 origin** 으로 본 논문의 사상적 계보의 출발점. 차이는 GAF/MTF 는 nonlinear 변환 (각도 / 마르코프 전이) 으로 image 를 만든 반면, VisionTS 는 linear reshape + resize 만 사용.

**왜 어깨가 됐는가**: GAF/MTF 가 "TS 를 image 로 매개해도 분류가 잘 된다" 를 보였기에, "예측도 가능하지 않을까" 의 사유 공간을 열었다. 다만 본 논문은 GAF 같은 비선형 변환은 거부하고 linear reshape 만 — image domain pretrained 가중치를 가능한 한 그대로 활용하기 위해.

---

## 평행 연구 (동시기, 다른 접근) 4 편

### 평행 1 — Ansari et al. 2024 "Chronos" (TMLR 2024, 인덱스 04-29 cover)
시계열을 BPE 토큰화해 LLM 처럼 사전훈련. **본 논문과의 비교 결과**: README 가 "VisionTS surpasses Chronos in zero-shot ranking" 명시. 즉 본 논문이 이긴 모델. **왜 이겼는가 (추정)**: Chronos 의 BPE 토큰화가 numerical fidelity 손실 → VisionTS 는 픽셀 단위 직접 표현으로 그 손실 회피.

### 평행 2 — Woo et al. 2024 "MOIRAI" (ICML 2024, 인덱스 06-03 cover)
LOTSA 27B 시계열 corpus 직접 사전훈련 + Any-Variate Attention + 4-mixture distribution. **본 논문과의 비교**: README 가 "surpassing Moirai" 명시. **왜 이겼는가 (추정)**: MOIRAI 가 시계열 데이터로 처음부터 학습 → 다양한 도메인 시계열을 잘 다루나 ImageNet 규모의 시각적 prior 부재. 단순한 trend/edge 인식에서는 MAE 의 시각 prior 가 더 강할 수 있음.

### 평행 3 — Das et al. 2024 "TimesFM" (ICML 2024, priority 목록에 있지만 미커버)
디코더만 사용한 시계열 foundation model. ICLR 2024 oral. **본 논문과의 비교**: README 가 "surpassing TimesFM" 명시. **왜 이겼는가 (추정)**: TimesFM 의 디코더만 구조가 generation efficiency 강점이지만 시계열 전용 사전훈련 corpus 만 사용 → cross-modal vision prior 부재.

### 평행 4 — Zhou et al. 2024 "OFA / GPT4TS" (ICLR 2024)
사전훈련 GPT-2 의 attention/FFN 만 freeze 하고 시계열에 적용. **본 논문과의 비교**: README 가 "few-shot text-based TSF foundation models" 보다 강함 명시. **왜 이겼는가 (추정)**: GPT4TS 의 텍스트 토큰 매개가 lossy → VisionTS 는 이미지 픽셀 직접 → 정보 손실 적음.

---

## 후손 예측 (이미 나왔으면 인용 + 미래 예측)

### 후손 1 — VisionTS++ (arXiv:2508.04379, 2025-08, **이미 발표됨**, 동일 저자)
"Cross-Modal Time Series Foundation Model with Continual Pre-trained Vision Backbones". 본 논문이 단정한 univariate / point forecasting 한정을 **multi-channel + probabilistic** 으로 확장. ImageNet pretrained MAE 를 시계열 corpus 로 **continual pretraining** — 즉 본 논문의 "frozen" 전제를 일부 풀고 시계열 데이터로 추가 학습.

### 후손 2 — IMTS is Worth Time × Channel Patches (arXiv:2505.22815, **이미 발표됨**)
Irregular Multivariate TS 용 VMAE 변형. 본 논문의 정규 (regular) 시계열 가정을 풀고 irregular 관측 (의료, 센서 누락 등) 으로 확장. 본 논문이 "regular grid 가정" 이라는 한계를 명시적으로 풀어줌.

### 후손 3 — TS as 2D + Mech Interp (예상)
본 논문의 frozen MAE backbone 에 APF / Wilinski / Mishra 류 mech interp 도구를 적용해 "시계열을 image 화한 뒤 MAE 의 어느 head 가 시계열 trend/seasonality/regime-shift 를 잡는지" 를 circuit 단위로 분석하는 연구. 본 인덱스 05-27 (Mishra Dissecting Chronos SAE) 와 직접 연결되는 미래 방향. **본 논문 + Mishra-style SAE 적용 = TS-as-image foundation model 의 cross-modal interpretability** 라는 새 niche.

### 후손 4 — OccamVTS (arXiv:2508.01727, **이미 발표됨**)
"Distilling Vision Models to 1% Parameters for Time Series Forecasting". 본 논문의 거대 MAE 가중치 (ViT-Huge 600M+) 를 작은 모델로 distillation 해 efficiency 개선. 본 논문이 무거운 사전훈련 모델을 그대로 쓰는 cost 의 직접 대응.

### 후손 5 — 비정상·금융 시계열 도메인 적용 (예상)
P1 ProTran-TFA 와 결합 가능. State Street 공저인 본 논문의 다음 단계로 자연스러운 금융 응용. 자산 수익률, 거시 지표, intraday volatility 의 시계열에 VisionTS 를 적용했을 때 image inpainting prior 가 fat-tail / regime shift 를 어떻게 다루는지의 검증 연구.

---

## 이 논문이 "다음 5 년" 의 시계열 foundation 흐름을 바꾼 정도

본 논문의 ICML 2025 mark 는 시계열 foundation model 분야에 **제 3 의 길** 을 정식 인정한 사건이다. 2023 (PatchTST, TimesNet) ~ 2024 (Chronos, MOIRAI, TimesFM, GPT4TS) 의 흐름은 "어떤 데이터로 사전훈련하는가" — 시계열 vs 텍스트 — 의 두 갈래였다. 본 논문은 **"어떤 데이터로 사전훈련했는지에 무관하게, reconstruction objective 가 정렬되어 있으면 transfer 가능"** 이라는 더 일반적인 명제를 시사한다. 향후 vision-CLIP, multimodal foundation, video foundation 등이 모두 시계열 측 후보로 검토될 길을 연다. 이게 본 논문이 단순한 "또 하나의 SOTA" 가 아닌 "category shift" 인 이유.

## 이 절의 한 줄 요약

> "He 2022 MAE + Dosovitskiy 2021 ViT 의 vision foundation 줄기 × Wu 2023 TimesNet + Wang 2015 GAF 의 TS-as-2D 줄기 의 첫 본격 교차로. 위 4 평행 연구를 zero-shot ranking 으로 누른 mark 이지만, 본질 기여는 ranking 자체가 아니라 'reconstruction objective 정렬의 일반 원리' 의 입증."
