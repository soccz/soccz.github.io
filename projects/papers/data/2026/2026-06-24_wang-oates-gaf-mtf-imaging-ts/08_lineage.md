# 8. 이론적 계보

## 8.1 이론적 조상 (이 논문이 직접 빌려온 4 개)

### Ancestor 1 — Eckmann, Kamphorst, Ruelle 1987: *Recurrence Plots*
> *"Recurrence Plots of Dynamical Systems"* (Europhysics Letters, 4(9), 973–977, 1987).

*시계열을 $n \times n$ 격자에 binary 픽셀로 그리는* 첫 작품. *각 픽셀 $(i, j)$ 가 시점 $i, j$ 의 상태가 충분히 가까우면 1, 아니면 0*. 본 논문 GAF/MTF 는 이 *시계열 → 정사각 픽셀 격자* 발상의 *연속값·확률* 일반화. **연결선**: recurrence plot 의 *binary similarity* → GAF 의 *continuous cosine similarity* → MTF 의 *probabilistic transition*. 9 baseline 중 1 개로 추정되는 RPCD (Silva et al. 2013) 가 recurrence plot 의 *압축 거리* 분류기 — 본 논문과 *직접 경쟁자*.

### Ancestor 2 — Lin, Keogh, Wei, Lonardi 2007: *SAX (Symbolic Aggregate approXimation)*
> *"Experiencing SAX: a Novel Symbolic Representation of Time Series"* (DAMI 15(2)).

PAA (Piecewise Aggregate Approximation) + *기호 양자화* 의 결합. 본 논문은 PAA 를 *그대로* 차원 축소 도구로 채용, MTF 는 *기호 양자화* 대신 *quantile 양자화* 를 사용. **연결선**: SAX 의 *시계열 → 기호 시퀀스* → MTF 의 *시계열 → 양자 상태 시퀀스 → 전이 행렬*. SAX-VSM (Senin & Malinchik 2013) 이 *기호 시퀀스의 vector space* 분류 — 본 논문 9 baseline 중 1 개로 추정.

### Ancestor 3 — Le, Karpenko, Ngiam, Ng 2010 (NIPS): *Tiled Convolutional Neural Networks*
> *"Tiled Convolutional Neural Networks"* (NIPS 2010).

*완전 가중치 공유 (full sharing) → 부분 공유 (partial sharing)* 의 발상. 본 논문이 *학습기로 그대로 채택*. **연결선**: Tiled CNN 의 *위치-의존* 학습 능력이 GAF/MTF 의 *대각선/모서리 위치별 의미 차이* 와 정확히 부합. 본 논문 시점에 이미 *AlexNet 2012* 등 *full sharing CNN* 이 더 표준이었는데 *굳이* Tiled CNN 을 선택한 건 표상 기하학에 맞춘 deliberate choice.

### Ancestor 4 — Vincent, Larochelle, Bengio, Manzagol 2008 (ICML): *Denoising Auto-encoders*
> *"Extracting and Composing Robust Features with Denoising Autoencoders"* (ICML 2008).

*입력에 noise 를 가하고 복원을 학습* 하는 unsupervised 표현 학습. 본 논문이 *결측 보간 분기* 에서 그대로 채택. **연결선**: DA 의 *noise → clean* 학습이 *masked image → original image* 의 *random masking inpainting* 으로 일반화 가능. 본 논문은 이를 *GASF bijection* 과 결합해 *image inpainting → 시계열 보간* 의 무료 다리를 만든다.

## 8.2 평행 연구 (비슷한 시기, 다른 접근)

### Parallel 1 — Silva, de Souza, Batista 2013: *RPCD (Recurrence Plot Compression Distance)*
> *"Time Series Classification using Compression Distance of Recurrence Plots"* (ICDM 2013).

*시계열 → recurrence plot → 압축 거리 (PNG compression size) → 분류*. 본 논문과 *시계열-이미지화* 카테고리에서 *직접 경쟁자*. **차이**: RPCD 는 *binary 이미지 + 무학습 거리*, 본 논문은 *연속값 이미지 + Tiled CNN 학습*. **누가 이기나**: 일반적으로 *학습기 있는* 접근이 더 강하지만 RPCD 의 *zero-training* 효율성은 *데이터 적은 시나리오* 에서 유리. UCR 의 작은 데이터셋들에서 *RPCD 가 의외로 강한* 데이터셋이 있을 수 있음 — 정확한 매핑은 본문 표 미확인.

### Parallel 2 — Karpathy, Toderici, Shetty 2014 (CVPR): *Large-scale Video Classification with CNNs*
> 동시기 *비-이미지 → 이미지 변환* 의 다른 갈래 — 비디오를 *프레임 시퀀스* 로 보고 CNN 으로 분류. 본 논문이 *시계열 → 정적 이미지* 라면 비디오 분류는 *시계열 → 시퀀스 이미지*. **차이**: 비디오는 *원래 이미지 시퀀스* 이므로 변환 needed 없음, 본 논문은 *순수 시계열* 을 *인위적으로 이미지화*. 두 갈래가 *2D 표상의 vision CNN 적용* 이라는 공통 발상을 공유.

### Parallel 3 — Cui, Chen, Chen 2016: *Multi-scale CNN for Time Series Classification*
> *"Multi-Scale Convolutional Neural Networks for Time Series Classification"* (arXiv:1603.06995, 본 논문 이후 1 년).

*1D CNN 을 직접 시계열에 적용* — 본 논문의 *대척점*. **차이**: MCNN 은 *1D 시계열 → 1D conv*, 본 논문은 *1D → 2D 이미지 → 2D conv*. **누가 이기나**: *작은 데이터셋 + 단순 패턴* 에서는 MCNN 의 효율성이 유리, *복잡 다중 스케일 패턴* 에서는 본 논문의 *2D 표현이 직관적*. 이후 *FCN/ResNet 1D* (Wang 2017) 등 *1D CNN* 분기가 결국 *Inception 1D* 까지 발전하면서 본 논문의 *2D 분기* 와 양립.

### Parallel 4 — Tran, Bourdev, Fergus 2015: *C3D — 3D Convolutional Networks for Spatiotemporal Feature Learning*
> *비디오 → 3D conv* 의 발상. *2D 공간 + 1D 시간* 의 *통합 3D conv*. 본 논문의 시계열-이미지화와 *시간을 한 축으로 들어 올린다* 는 발상을 공유하지만 — *시간을 픽셀로 직접 인코딩* (본 논문) 한 게 아니라 *시간을 conv 의 한 차원으로 추가* (C3D). 11 년 후의 *Video Transformer* 도 이 line.

## 8.3 후손 예측 (이미 등장한 + 등장할 것)

### Descendant 1 — Tsai, Liu, Yang 2019: *Encoding Candlesticks as Images for Patterns Classification Using Convolutional Neural Networks*
> arXiv:1901.05237. 본 논문의 *금융 직접 응용*. 주식의 *캔들 차트* 를 GAF 류 인코딩으로 표상화 → CNN 분류. 본 논문이 *암묵적으로 가능성을 제시* 한 *시계열-차트-이미지 직접 처리* 의 명시적 구현. **사용자 P1 ProTran-TFA / AETHER 의 multimodal extension* 의 직접 reference**.

### Descendant 2 — Wu, Hu, Liu, Zhou, Wang, Long 2023 (ICLR): *TimesNet — Temporal 2D-Variation Modeling for General Time Series Analysis*
> arXiv:2210.02186. **본 논문의 11 년 후 직계 후손**. 같은 *1D → 2D* 발상이지만:
> - *Reshape 기준* 이 다름: 본 논문 = polar 좌표 + Gram 행렬, TimesNet = *FFT 로 주기 탐지 → 주기 단위 reshape*.
> - *학습기* 가 다름: 본 논문 = Tiled CNN, TimesNet = Inception 2D CNN (TimesBlock).
> - *공통점*: 시계열을 2D 격자로 들어 올려 vision-friendly 학습기에 투입.
> TimesNet 은 본 논문을 *직접 인용* (Related Work) — *image-encoding line of work* 의 효시로 명시. *이미 cover 함 (2026-05-13).*

### Descendant 3 — Chen, Shen, Z. Li, X. Wang, Sun, C. Liu 2024 (ICML 2025): *VisionTS — Visual Masked Autoencoders Are Free-Lunch Zero-Shot Time Series Forecasters*
> arXiv:2408.17253. **본 논문의 11 년 후 사촌**. *시계열을 이미지화 + frozen ImageNet pretrained MAE 적용* — 본 논문의 *이미지화 + CNN 학습* 의 *frozen 비전 모델 활용* 변형. *이미 cover 함 (2026-06-10).*

### Descendant 4 (가설) — *GAF + Diffusion Inpainting for TS Imputation* (예상 2024~2026)
> 본 논문의 *DA → GAF 역변환* 의 *11 년 현대화*: DA 를 *Diffusion model (denoising score matching)* 로 교체. *Stable Diffusion 의 inpainting* 능력으로 *연속 결측 시퀀스* 를 더 잘 보간 가능. arXiv 에 *GAF-Diffusion* 검색하면 2023~2024 의 medical imaging 응용이 일부 등장 (예: ECG inpainting). 정확한 인용은 확인 안 함.

### Descendant 5 (가설) — *Attention-based encoding of GAF/MTF* (APF connection)
> 본 논문의 *Tiled CNN* 위치를 *Vision Transformer* 로 대체. ViT 의 *self-attention* 이 GAF 의 *대각선/모서리* 영역에 *다른 attention pattern* 을 학습할 것 — **APF 의 motif typology 가 GAF 인코딩과 만나는 자리**. (실험 아이디어로 10.C 에서 전개.)

## 8.4 한 줄 요약

> "본 논문은 *recurrence plot (1987) + SAX (2007) + Tiled CNN (2010) + DA (2008)* 의 *4 가지 ancestor 가 시계열-이미지화 + 비전-친화적 학습기* 라는 한 점에 모인 *synthesis paper* 이고, 11 년 후의 *TimesNet · VisionTS · Tsai candlestick · GAF-Diffusion* 이 모두 *이 한 점에서 분기한 후손*. 즉 본 논문은 *시계열 표상 학습* 의 *분기점 (branching point)* 이다."
