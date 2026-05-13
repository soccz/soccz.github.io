# 08. 이론적 계보

> **배경 사다리**: ① 계보(lineage) = 이 논문이 어디서 왔고 무엇을 낳았는지의 연결 지도. ② 평행 연구(parallel work) = 비슷한 시기에 비슷한 문제를 다른 방법으로 풀려 한 논문들.

---

## 이론적 조상

### 조상 1: Autoformer (Wu et al., NeurIPS 2021) — 직접 전신

**연결선**: Autoformer는 TimesNet과 같은 THUML 연구실(Mingsheng Long 지도)에서 나온 직접 전신이다. Autoformer의 핵심 기여는 **Auto-Correlation 메커니즘** — FFT를 이용해 시계열의 lag 기반 상관관계를 계산하고, 주기적으로 반복되는 하위 시퀀스(sub-series)를 Attention처럼 집계하는 구조다.

Autoformer와 TimesNet의 연결:
- **공통 직관**: 두 논문 모두 "시계열은 주기적 구조를 갖는다"는 가정에서 출발한다.
- **FFT 활용 방식의 차이**: Autoformer는 FFT를 Attention 계산에 사용(시간 복잡도 $O(T \log T)$). TimesNet은 FFT를 주기 *탐지*에만 사용하고, 주기로 접은 2D 텐서에서 CNN으로 패턴을 학습한다.
- **표현 방식의 차이**: Autoformer는 1D 표현 안에서 주기를 다룬다. TimesNet은 1D→2D로 표현 공간 자체를 바꾼다. 이것이 TimesNet의 핵심 전진이다.
- **한계 계승**: Autoformer의 "공통 주기 가정"(모든 채널이 같은 lag로 집계)이 TimesNet의 "공통 주기 가정"(`FFT_for_Period`에서 채널 평균)으로 이어진다. 두 논문 모두 채널별 이질적 주기를 다루지 않는다.

### 조상 2: GAF/MTF — Wang & Oates (2015) — 개념적 기원

**연결선**: "시계열을 2D 이미지로 변환하면 이미지 분류 기법을 적용할 수 있다"는 아이디어의 원조. Wang & Oates 2015는 Gramian Angular Field(GAF, 직교각 행렬 — 시계열의 각 쌍 값의 각도 합으로 만든 행렬)와 Markov Transition Field(MTF, 상태 전이 확률 행렬)를 이용해 시계열을 2D 이미지로 변환하고 ResNet/CNN으로 분류했다.

TimesNet과의 연결:
- **공통 기반**: 1D → 2D → CNN이라는 파이프라인 구조. ts-as-2d 태그의 개념적 원점.
- **핵심 차이**: GAF/MTF는 2D 변환이 데이터의 글로벌 통계적 구조(각도·전이)를 인코딩. TimesNet의 reshape는 **물리적 주기 구조**를 공간 배치(intraperiod × interperiod)로 인코딩. 훨씬 직접적이고 해석 가능한 2D 변환이다.
- **한계 극복**: GAF/MTF는 *분류 전용*이었고, 예측·보완 등 다른 태스크로 확장하기 어렵다. TimesNet은 같은 2D 표현으로 5개 태스크를 통일한다.

### 조상 3: Non-stationary Transformer (Liu et al., NeurIPS 2022) — 정규화 전략

**연결선**: TimesNet은 이 논문에서 영감 받은 인스턴스 정규화(instance normalization)를 그대로 채택한다. Non-stationary Transformer는 "TS Transformer가 over-stationarization 문제를 겪는다 — 정규화 후 비정상성(non-stationarity) 정보가 사라진다"를 지적하고, 입력을 정규화(평균·표준편차로 나누기)한 후 출력을 역정규화(de-normalization)하는 방식을 제안했다.

TimesNet과의 연결:
- **직접 채택**: TimesNet 코드에서 `means = x_enc.mean(1, keepdim=True).detach()` + `dec_out = dec_out * stdev + means` 패턴이 Non-stationary Transformer의 방법과 동일.
- **의미**: TimesNet의 핵심 주장(2D 표현)과 정규화 전략은 분리된 기여다. 정규화는 선행 연구에서 빌린 것.

### 조상 4: GoogLeNet/Inception (Szegedy et al., CVPR 2014) — 2D CNN 구조

**연결선**: TimesNet의 Inception_Block_V1은 GoogLeNet의 Inception 모듈을 그대로 사용한다. 서로 다른 크기의 합성곱 필터($1\times1$, $3\times3$, $5\times5$, ...)를 병렬로 적용하고 출력을 이어붙이는 구조. ImageNet 이후 표준이 된 멀티스케일 2D CNN 구조다.

TimesNet과의 연결:
- **직접 채택**: 코드에서 `Inception_Block_V1`이 2D TS 텐서에 그대로 적용된다.
- **도메인 전이**: 자연 이미지의 멀티스케일 텍스처 학습 → 시계열 2D 텐서의 intraperiod × interperiod 멀티스케일 패턴 학습.
- **한계**: 자연 이미지에서 "공간적 이동 불변성(translation invariance)"은 합리적 가정이나, 시계열 2D 텐서에서는 row/column 방향의 의미가 비대칭(시간 방향성)이다. Inception Block은 이 비대칭성을 명시적으로 다루지 않는다.

---

## 평행 연구

### 평행 1: PatchTST (Nie et al., ICLR 2023) — 같은 학회, 다른 전략

PatchTST는 TimesNet과 같은 ICLR 2023에 나왔다. 아이디어: 시계열을 고정 크기의 패치(patch, 연속된 $P$개 시간 단계의 묶음)로 자르고, 각 패치를 하나의 토큰으로 만들어 Transformer에 입력한다. 주기 탐지 없이 고정 패치 크기를 사용한다.

TimesNet이 이긴 영역: 장기 예측 이외의 4개 태스크(특히 보완·이상탐지). PatchTST는 예측에 특화됐고 나머지 태스크를 공식 지원하지 않는다.

PatchTST가 나은 영역: 2024년 이후 장기 예측 leaderboard에서 PatchTST 계열(iTransformer 등)이 TimesNet을 추월. 채널 독립(channel-independent) 학습으로 단변량 패턴에 더 집중.

### 평행 2: DLinear (Zeng et al., AAAI 2023) — 단순성의 도전

DLinear는 "단순한 선형 레이어 하나가 복잡한 Transformer를 이긴다"를 보인 충격적 논문. 채널별로 $y = Wx + b$ 형태의 선형 매핑만 학습.

TimesNet vs DLinear: TimesNet은 DLinear보다 훨씬 복잡하다(FFT + reshape + Inception + Residual). 파라미터 수 대비 성능 비교에서 DLinear의 효율성은 여전히 강력한 반박이다. 두 논문이 "보완·이상탐지·분류"에서는 비교하지 않는다는 점이 논문 비교의 사각지대다.

### 평행 2-1 보충: DLinear가 TimesNet보다 나은 조건

파라미터 수가 동일할 때 성능 비교는 TimesNet의 중요한 미답 질문이다. DLinear는 단변량 시계열에서 각 채널마다 $W \in \mathbb{R}^{T_{in} \times T_{out}}$ 크기의 행렬 하나가 전부다. TimesNet은 FFT 계산 + Inception Block + Residual로 훨씬 많은 파라미터를 쓴다. DLinear가 TimesNet보다 유리한 조건: (a) 훈련 데이터가 적을 때 (과적합 위험), (b) 채널 간 상호작용이 없을 때, (c) 비주기적 단조 트렌드가 지배적일 때. 이 세 조건은 금융 데이터에서 자주 동시에 성립하므로, Exchange-Rate에서 DLinear의 경쟁력이 TimesNet보다 높을 수 있다.

### 평행 3: FEDformer (Zhou et al., ICML 2022) — 주파수 도메인 Transformer

FEDformer는 Attention을 주파수 도메인에서 수행 — Fourier/Wavelet 계수에 Attention을 적용한다. TimesNet과 공통점은 FFT를 활용한다는 점이나, FEDformer는 Transformer 구조를 유지하고 TimesNet은 CNN으로 교체한다.

TimesNet이 이긴 이유: 주파수 도메인 Attention은 $O(T^2)$ 대신 선택된 주파수 수 $M$에 따라 $O(TM)$이지만, TimesNet의 CNN 방식이 실제 속도에서 더 단순하다. 또한 FEDformer는 비예측 태스크 확장이 제한적이다.

---

## 후손 예측

### 후손 1: 채널별 적응 주기 탐지

TimesNet의 가장 큰 한계(공통 주기 가정) 해소. 각 채널(변수)마다 독립적인 FFT top-k를 수행하고, 채널별 주기로 2D 변환을 수행한다. 구현 비용은 O(채널 수) 배로 늘지만, 기온과 강수량이 서로 다른 주기를 가지는 경우에 대한 표현력이 크게 향상된다. **TimeMixer (Wang et al., ICLR 2024)** 가 멀티스케일 채널 분리 방향으로 일부 이 공간을 채웠다.

### 후손 2: 학습 가능한 주기 탐지

FFT 기반 주기 탐지는 non-stationary 시계열에서 취약하다. 주기를 gradient descent로 학습하는 "learnable period" 접근이 자연스러운 다음 단계다. 입력 의존적(input-dependent) 주기를 end-to-end로 학습하면, 비정수 주기와 시변 주기도 처리 가능하다. **iTransformer (Liu et al., ICLR 2024)** 는 채널 Attention으로 다른 방향을 택했지만, 학습 가능한 주기의 공간은 아직 열려 있다.

### 후손 2-1 보충: 비주기 데이터를 위한 혼합 backbone

TimesNet의 FFT 기반 주기 탐지는 주기가 약한 데이터(금융, 웹 트래픽 등)에서 spurious 주기를 탐지할 위험이 있다. 자연스러운 후속 방향은 "주기 탐지 모듈을 데이터에 맞게 교체 가능한 plug-in 구조"로 TimesBlock을 재설계하는 것이다. 예를 들어, 주기가 강한 데이터에는 FFT top-k를, 비주기 데이터에는 wavelet 기반 멀티스케일 분해를, 금융 데이터에는 레짐 탐지 기반 segmentation을 연결하는 구조. 이렇게 하면 TimesNet의 "1D→2D→CNN" 파이프라인은 유지하면서 도메인 적합성을 높일 수 있다.

### 후손 3: TimesNet × Foundation Model

TimesNet의 5-태스크 통일 구조는 Foundation Model 방향의 초기 시도다. CKA 분석이 보이듯 태스크마다 표현 깊이가 다르게 활용된다. 더 많은 데이터와 더 많은 태스크(회귀, 분류, 예측을 동시에)로 사전 학습하고, TimesBlock을 backbone으로 fine-tuning하는 방향이 자연스럽다. **Chronos (Ansari et al., 2024)**, **MOIRAI (Woo et al., 2024)** 가 같은 방향이지만 아키텍처가 다르다 (Transformer-based). CNN-based TS foundation model 공간은 아직 탐색 중이다.
