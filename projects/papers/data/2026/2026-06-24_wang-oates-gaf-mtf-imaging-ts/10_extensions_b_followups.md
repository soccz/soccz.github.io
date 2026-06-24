# 10.B 사고 확장 ② — Follow-up 3 편 (선행 1 · 경쟁 1 · 후속 1)

## Follow-up 1 (선행, 직접 ancestor) — Silva, de Souza, Batista 2013: *Time Series Classification using Compression Distance of Recurrence Plots* (ICDM 2013)

**어떤 논문**: 시계열을 *recurrence plot* (binary $n \times n$ matrix; pixel $(i, j) = 1$ if $|x_i - x_j| < \epsilon$) 으로 변환한 후, *두 plot 의 압축 거리 (PNG/JPG 압축 후 파일 크기 차이)* 를 *유사도 metric* 으로 정의해 *1-NN 분류* 함. 학습 없음.

**본 논문과의 관계**:
- *시계열-이미지화* 의 *동시기 직접 경쟁자*. 본 논문이 9 개 baseline 중 하나로 RPCD 를 포함했을 것으로 추정 (확인 불가).
- **차이점**:
  - RPCD = *binary image + zero-training distance*
  - 본 논문 = *continuous image + Tiled CNN learning*
- *발상의 우선권* 은 RPCD 에 있지만 *학습 가능성* 으로 본 논문이 *후속 발전 가능성* 을 열었음.

**무엇을 얻을 수 있는가**:
1. *RPCD 의 binary recurrence plot* 도 *Tiled CNN 또는 ResNet 위에서 학습* 시킨다면 — *GAF 와 직접 비교* 가능 → *어떤 시계열-이미지화 인코딩이 vision CNN 과 가장 잘 어울리는가* 의 *공정한 평가* 후보.
2. RPCD 의 *압축 거리* metric 자체가 *invariant to monotonic transformations* — *비정상 시계열* 에서 GAF 보다 robust 할 수 있음. 이 점은 본 논문이 다루지 않은 *수치 대신 구조* 비교의 시사점.
3. APF 의 *attention motif* 와 *recurrence plot* 의 *경쟁 비교* 가능 — 두 격자가 *서로 다른 motif typology* 를 만들 가능성.

**P1 ProTran-TFA 와의 연결**: RPCD 의 *비모수적 거리 metric* 은 *probabilistic forecasting 의 *uncertainty quantification* 에 활용 가능 — 두 시계열의 *분포 유사도* 를 *recurrence-plot-compression* 으로 측정해 *quantile crossover loss* 의 *데이터 증강 weighting* 으로 사용.

---

## Follow-up 2 (경쟁, 같은 시기 다른 갈래) — Wang, Yan, Oates 2017: *Time Series Classification from Scratch with Deep Neural Networks: A Strong Baseline* (IJCNN 2017, arXiv:1611.06455)

**어떤 논문**: 같은 첫 저자 Wang (본 논문) 이 2017 년에 발표한 *1D CNN 직접 적용* 의 후속작. *FCN (Fully Convolutional Network)*, *ResNet 1D*, *MLP* 의 3 가지를 *동일한 학습 protocol* 로 UCR 의 *44 데이터셋* 에서 평가. **결론**: *FCN 1D 가 본 논문 (GAF/MTF + Tiled CNN) 을 능가*.

**본 논문과의 관계**:
- **저자 본인의 *self-critique***: 본 논문은 *2D 이미지화* 가 효과적임을 주장했지만, 2 년 후 같은 저자가 *1D 직접 CNN 이 더 단순하고 강력함* 을 보였다. 즉 본 논문의 *2D 우월성* 주장은 *학습기 발전 (FCN, ResNet) 이전의 시기 한정*.
- **차이점**:
  - 본 논문 = *데이터 표상의 차원 변환* (1D → 2D)
  - 2017 후속 = *학습기 발전* (Tiled CNN → FCN/ResNet 1D)
- **누가 이기나**: *현대적* 1D CNN/Transformer 가 *FCN 1D 위에서* 보통 *GAF + 2D CNN* 을 능가. 단 *시각적 해석 가능성* (사람이 GAF 이미지를 보는 것) 은 본 논문이 유일.

**무엇을 얻을 수 있는가**:
1. *저자 본인이 *2 년 후 패배* 를 인정한 사례* — 표상 변환의 한계를 솔직히 보여줌. APF 도 *attention 기반 해석* 이 *결국 *raw input level 해석* 보다 우월한가* 의 *self-check 가설* 을 정직하게 다뤄야 함.
2. *2D 이미지화의 *살아남은 자리*: TimesNet (FFT-주기-2D), VisionTS (frozen MAE), 그리고 *해석성/시각화 도구* 로서의 GAF. *순수 분류 성능* 만으로는 *1D 가 우월*.
3. P2 Logistic 4-layer 와의 연결: *FCN 1D + grokking 동학 비교* 를 *GAF + Tiled CNN + grokking 동학* 과 *동일 task 에서* 측정. *어느 표상이 grokking transition 을 더 잘 보여주는가* 의 직접 답.

---

## Follow-up 3 (후속, 본 논문의 직계) — Chen, Shen, Z. Li, X. Wang, Sun, C. Liu 2024 (ICML 2025): *VisionTS: Visual Masked Autoencoders Are Free-Lunch Zero-Shot Time Series Forecasters* (arXiv:2408.17253)

**어떤 논문**: 시계열을 *single-periodicity reshape* 으로 2D 이미지화한 후 *frozen ImageNet pretrained MAE (Masked Autoencoder)* 를 *튜닝 없이* 적용. *Zero-shot point forecast* 에서 *GIFT-EVAL MASE #1* (Moirai/TimesFM/Chronos 상회). [이미 2026-06-10 cover.]

**본 논문과의 관계**:
- **11 년 후 직계 후손**. 같은 *1D → 2D + vision model* 발상의 *frozen pretrained model* 일반화.
- **차이점**:
  - 본 논문 = *결정론적 인코딩 (GAF/MTF) + 학습 (Tiled CNN)*
  - VisionTS = *비결정론적 reshape (단일 주기 기준) + frozen MAE (학습 없음)*
- **누가 이기나**: VisionTS 의 *zero-shot* 능력은 본 논문이 보여주지 못한 자리. 단 본 논문은 *결정론적 invertible* 이라 *imputation* 에 더 자연스러움. *FORECASTING (VisionTS) vs IMPUTATION (본 논문)* 으로 *응용 분기 분담*.

**무엇을 얻을 수 있는가**:
1. *Hybrid 가설*: VisionTS 의 *reshape* 자리에 *GAF* 를 넣으면 — *주기성 무관* 의 *zero-shot 시계열 → 이미지 → frozen MAE → 분류/예측* 의 *완전 새 baseline* 가능. (10.C 의 실험 아이디어 1 로 전개.)
2. APF 의 *frozen MAE 위의 attention motif* 분석은 *학습된 head 가 GASF 격자에 수렴하는지* 의 직접 검증 — *frozen* 이라서 *외생/내생 격자의 fixed 매칭* 으로 측정 깨끗.
3. Tan 2024 ("Are LMs useful for TS?") 의 *3-ablation 격자* 를 VisionTS + GASF hybrid 에 적용해 *MAE 백본의 marginal contribution* 측정.

---

## 3 편의 공통 substrate

- **선행 (RPCD 2013)**: *binary recurrence plot* — *시계열-이미지화* 의 *예비 형* + *압축 거리* 의 *zero-training* 접근.
- **경쟁 (Wang 2017 FCN)**: *같은 저자의 self-critique* — *2D 이미지화 vs 1D 직접 CNN* 의 *11 년 결말 (1D 가 보통 이김)*.
- **후속 (VisionTS 2024)**: *11 년 후 직계* — *frozen 비전 모델 + 시계열 이미지화* 의 *free-lunch zero-shot* 결합.

이 3 편을 *본 논문 + APF + Grokking* 와 함께 읽으면 — *시계열-이미지화* 분야의 *13 년 진화 (1987 recurrence plot → 2013 RPCD → 2015 본 논문 → 2017 self-critique → 2023 TimesNet → 2024 VisionTS → 2026 APF intervention)* 의 *완전한 계보* 를 한 줄로 그릴 수 있다.
