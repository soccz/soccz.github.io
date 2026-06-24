# 7. 가정·한계·반박

## 7.1 명시된 가정 (논문이 대놓고 말한 것 — abstract + GitHub Wiki 로 확정 가능한 범위)

### A1. 시계열은 $[-1, 1]$ 또는 $[0, 1]$ 로 정규화 가능
*Min-max scaling* 이 모든 시계열에 의미 있다는 가정. *outlier* 또는 *extreme value distribution* 에서는 *대부분 값이 0 근처에 몰리는* 정보 손실 발생.

### A2. *Markov 가정* — MTF 의 1-step 전이만 추정
시계열의 *short-range dependency* 가 1-step 전이로 충분히 표현된다고 가정. *long-range memory* (예: fractional Brownian motion, ARFIMA 류) 에서는 정보 부족.

### A3. *Stationarity* — quantile boundary 가 train/test 에서 동일
$W$ 추정이 *전체 시계열 (train 분포)* 에 대해 *단일* 행렬. *비정상 시계열* 에서는 train 의 $W$ 가 test 에서 의미를 잃을 수 있음.

### A4. *PAA reduction* 이 정보를 적절히 보존
시계열이 *block-wise smooth* — 즉 인접 timestep 들의 *평균* 이 의미 있는 통계량이라는 가정. *고주파 pulse 신호* 에서는 PAA 가 결정적 정보를 잃음.

### A5. *GAF/MTF 의 quadratic 비용 $O(n^2)$* 이 수용 가능
시계열 길이 $n$ 이 $10^3$ 수준 (UCR 의 대부분) 에서는 $10^6$ pixels 이미지가 *GPU 1 카드 + 표준 CNN* 으로 처리 가능. *Long-term TSF* (수천~수만 step) 에서는 PAA 또는 다른 reduction 이 필수.

## 7.2 암묵적 가정 (말 안 했지만 깔려 있는 것)

### B1. *시간 인덱스가 등간격 (regular)*
GAF/MTF 의 *행/열 = 시간 인덱스* 매핑은 timestep 간격이 *상수* 일 때만 의미 있다. *불규칙 시계열* (예: ContiFormer 의 동기 / event 시계열) 에는 직접 적용 불가 — PAA 도 등간격 가정.

### B2. *클래스 라벨이 시계열 전체에 대해 단일* (segment classification, not point classification)
본 논문의 분류는 *한 시계열 → 한 라벨*. *각 시점에 라벨* 이 있는 *sequence labeling* (예: ECG arrhythmia detection at each beat) 에는 직접 적용 어려움 — 별도 sliding window 필요.

### B3. *Tiled CNN 의 hyperparameter (tile size 등) 가 데이터셋 무관*
20 데이터셋 모두에 *동일* hyperparameter 를 썼다고 가정. *데이터셋별 튜닝* 했다면 *9 baseline* 과 공정성이 깨진다.

### B4. *Imputation 의 결측이 random masking*
DA 가 *random elementwise mask* 를 학습하지만, 실세계 결측은 *연속 구간* (예: 센서 다운타임 동안 1 시간 연속 결측) 인 경우가 많다. 본 논문은 *random* 만 다뤘을 가능성 — *연속 결측 (sequential missing)* 에는 일반화 불확실.

### B5. *$L$ (반지름 정규화 상수) 의 정확한 정의가 결정적이지 않다*
외부 인덱스 verbatim: "L is scaling the temporal dimension but does not influence the final matrix" — 즉 *$L$ 의 정확한 값이 무엇이든 GAF 격자의 *상대값* 은 동일*. 단 *CNN 입력 normalization* 단계에서 $L$ 의 절대값이 영향을 줄 가능성은 미확인.

## 7.3 반박 가능한 지점 (각 한 단락 + 검증 방안)

### Refute 1: *GAF 의 정보가 cosine summation 으로 *불필요하게 압축* 됐을 가능성*

본 논문은 *모든* $(i, j)$ 짝에 대해 $\cos(\phi_i + \phi_j)$ 단일 스칼라를 칠한다. 그러나 *원래 polar 좌표* 는 $(\phi_i, r_i)$ 의 *2 차원* — *반지름 정보* $r$ 가 거의 사용되지 않는다 ("does not influence the final matrix"). 즉 polar 좌표의 *시간 정보* (반지름) 가 *위치 인덱스* 로만 인코딩되고 *값* 으로는 인코딩 안 됨. *반지름까지 값으로 인코딩* 한 변형 (예: $G_{ij} = r_i r_j \cos(\phi_i + \phi_j)$) 이 더 정보적일 수 있다.

**검증**: $G_{ij}^{\text{enhanced}} = w_1 \cos(\phi_i + \phi_j) + w_2 r_i r_j$ 류 가중 결합을 만들고, 동일 Tiled CNN 위 같은 20 UCR 데이터셋에서 *base GASF* 대비 error rate 비교. 6 hour GPU 실험.

### Refute 2: *Bijection 의 *practical 견고성* 이 noise 에 약할 가능성*

이론적으로 GASF 는 $[0, 1]$ rescale 에서 bijection 이지만, DA 의 출력에 *작은 noise* 가 있을 때 $\sqrt{(\hat{G}^{\text{S}}_{ii} + 1) / 2}$ 의 *제곱근* 이 noise 를 *증폭* (특히 $\hat{G}^{\text{S}}_{ii} \approx -1$ 즉 $\tilde{x} \approx 0$ 근처). *연속 결측 시점에서 값이 0 근처일 때* 보간 오차가 비대칭적으로 커질 수 있다.

**검증**: *시계열 값이 $[0.05, 0.15]$ 범위* 에 집중된 합성 데이터셋을 만들고 *random masking* 대신 *연속 구간 masking* 으로 imputation MSE 비교. 또 *비대각 항* 까지 사용해 *redundant 보정* 한 변형과 *대각만 사용* 한 vanilla 의 차이 측정.

### Refute 3: *RPCD (Recurrence Plot Compression Distance) 와의 직접 비교가 불충분할 가능성*

본 논문이 *시계열-이미지화* 의 *동시기 경쟁자* 인 RPCD (Silva et al. 2013) 를 9 baseline 중 1 개로 포함했을 것이라 추정. 그러나 RPCD 의 *recurrence plot* 도 *binary $n \times n$ 이미지* — 본 논문의 GAF/MTF 와 *카테고리 동일* (모두 TS-as-image). *공정한 비교* 라면 RPCD 도 *Tiled CNN 학습기* 위에서 평가해야 하는데, 본 논문이 그렇게 했는지가 불분명. (PDF 차단으로 미확인.)

**검증**: RPCD 의 binary recurrence plot 도 같은 Tiled CNN 위에 학습시키고 GAF/MTF 와 *동일 분류기 조건* 에서 비교. 만약 RPCD 가 동등하거나 우월하다면 — 본 논문의 *novel encoding* 의 기여보다 *기존 encoding + better CNN* 의 기여가 큰 것일 수 있음.

### Refute 4: *시계열 길이 의존성 — *$n$ 이 커지면* GAF/MTF 가 *vision CNN* 의 표준 입력 (224×224 ImageNet) 과 *경합 가능*?

UCR 의 대부분 시계열은 *$n \leq 500$* 이라 *PAA 로 224 이하* 압축 가능. 하지만 *long-term TSF* (PatchTST 의 $n = 720, 1440$) 에서는 *224×224 PAA* 가 *원본 정보의 (224/720)² ≈ 10%* 만 보존 → 정보 손실이 결정적. 본 논문은 *short TS* 만 검증.

**검증**: TimesNet/PatchTST 의 *long-horizon* 데이터셋 (ETT, Weather, Traffic) 에서 GASF + PAA-224 vs PatchTST 분류·예측 성능 비교. *PAA 손실의 정량 측정*.

## 7.4 재현성 평가

### Pos: 코드·데이터 공개
- **저자 본인 GitHub** (`cauchyturing/Imaging-time-series-to-improve-classification-and-imputation`) — 핵심 인코딩 파일 (`serie2GAF.py`, `serie21MTF.py`, `serie2QMlib.py`) 공개.
- **데이터** UCR Archive — 공개·표준.
- Wiki 에 PAA dimension, GAF type, rescale 옵션 등 *주요 hyperparameter* 명시.

### Neg: 학습기·실험 디테일 비공개
- Tiled CNN 의 *정확한 architecture file* 이 본 환경에서 확인 안 됨. 저자 GitHub 의 *데이터 변환* 파일은 있지만 *학습 파이프라인* 은 별도 directory 일 가능성.
- *Random seed 통제, multi-seed 분산 보고, statistical significance test* 는 본문 PDF 차단으로 미확인.
- *9 baseline* 의 정확한 implementation 또는 *어느 published value 를 인용했는지* 미확인.

### 11 년 후 재현성 평가
GAF/MTF 인코딩은 **pyts** (Python Time Series 라이브러리) 에 표준 구현 — `pyts.image.GramianAngularField`, `pyts.image.MarkovTransitionField` — 으로 *완전 재현 가능*. 학습기는 PyTorch ResNet 등으로 *현대화* 가능. **즉 본 논문의 *방법* 은 재현 가능하지만 *원 논문의 정확한 실험 수치 재현* 은 어려울 가능성**.

## 7.5 한 줄 결론

> "본 논문의 *한계* 는 *명시된 5 개 가정* (정규화·Markov·정상성·등간격·quadratic 비용) 이 *2015 시점 TSC 의 짧은 시계열* 에서는 무리 없지만, *현재 (2026) 의 long-term TSF / 비정상 / 이벤트 시계열* 로 영역이 확장되면 *모든 가정이 한 번씩 무너진다*. 즉 본 논문은 *훌륭한 시작점* 이지만 *후속 11 년의 확장 (TimesNet → VisionTS) 이 각 가정의 *점진적 완화* 이기도* 하다."
