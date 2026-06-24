# 3. 문제 지형도

## 3.1 배경 사다리

이 절을 이해하려면 ① **시계열 분류 (TSC, Time Series Classification)** 가 "주어진 시계열이 어느 카테고리에 속하는지 맞추는 일" (예: ECG 가 정상/부정맥, GunPoint 동작이 권총/손동작) 이라는 것, ② **CNN (합성곱 신경망)** 이 *이미지 위에서 이웃한 픽셀들이 함께 보이는 패턴* 을 추출하도록 설계된 신경망이라는 것, 그리고 ③ 시계열은 본래 *1 차원 수열* 이라 CNN 의 2D conv 가 직접 적용되지 않는다는 것 — 이 3 가지를 알면 충분하다.

## 3.2 실제 문제가 생기는 현실 상황

### 시나리오 1 — ECG 부정맥 자동 판독
병원에서 24 시간 홀터 모니터로 측정된 환자 ECG 는 *시간당 수만 개 샘플 × 24 시간* 의 1D 시계열이다. 임상에서 부정맥 패턴 (VT, AF, PVC 등) 을 자동 분류하려면 *수십 개 다른 종류의 비주기/주기 패턴* 을 구분해야 한다. 1D CNN 으로 풀 수도 있지만, 한 환자의 데이터가 500 만 샘플쯤 되면 *kernel size = 7* 인 1D conv 는 *시간 축의 다중 스케일* (P-Q-R-S-T 복합파 안의 0.1 초 단위 vs 호흡 주기 5 초 단위 vs 심박변동 분 단위) 을 한 모델 안에서 다루기 어렵다. **2D 이미지로 바꿔서 vision CNN 을 쓰자** 는 발상은 — 이미 ImageNet 에서 *멀티 스케일 텍스처* 를 잘 잡는 도구들이 있기 때문에 자연스럽다.

### 시나리오 2 — 산업 센서 결측 보간
공장의 진동 센서가 5 분에 한 번 측정값을 기록하다가 *간헐적으로 통신 끊김* 으로 연속 30 분 (= 6 개 샘플) 결측이 발생한다. 단순히 *선형 보간* 하면 진동의 *주기성·비선형성* 이 다 무너진다. RNN 기반 보간기를 따로 학습시켜도 *결측 비율/길이* 가 달라지면 새로 학습해야 한다. 본 논문이 던지는 답: **시계열 → 이미지 → 이미지 결측 보간 (image inpainting) 도구로 풀어라**. 이미 vision 분야에 *denoising auto-encoder, U-Net, partial conv* 등 image inpainting 의 도구가 풍부하다.

### 시나리오 3 — 주식 캔들 차트 패턴 분류
주식의 *분봉/일봉 캔들 차트* 는 사실상 시계열을 사람이 손으로 *이미지화* 한 것이다. *Hammer / Doji / Engulfing / Head-and-Shoulders* 등의 기술적 분석 패턴은 *수치보다 그림 모양* 에 가깝다. 그런데 사람이 차트로 그리는 이미지는 *임의적인 색칠 규칙* 에 의존한다. 본 논문의 GAF/MTF 는 *수학적으로 일관된* 차트화 — 즉 임의성을 제거한 일대일 대응을 제공한다. (이 분기가 Tsai 2019 "Encoding Candlesticks as Images" 등 금융 응용으로 직접 이어진다.)

## 3.3 기존 접근 계보 — 2015 년 직전까지의 5 이정표

### 이정표 1: DTW (Dynamic Time Warping) + 1-NN — Berndt & Clifford 1994
> **무엇이었나**: 두 시계열의 *시간축 늘이기/줄이기* 를 허용하면서 유사도를 측정하는 알고리즘. 그 위에 1-Nearest-Neighbor 분류기를 얹은 *DTW-1NN* 은 1990 년대 후반부터 2014 년 무렵까지 TSC 의 *unbeatable baseline* 으로 알려졌다.
> **왜 부족했나**: $O(n^2)$ 비용에 *학습이 없다* (lazy classification). 데이터 양이 늘어도 모델이 학습 신호를 흡수하지 못한다. 또 *지역적 형상* 만 매칭 — 글로벌 동적 / 비주기 패턴은 약하다.
> **남긴 교훈**: TSC 의 *기본 단위* 는 "시계열의 모양 (shape)" 이라는 인식. 본 논문은 이 *shape* 을 이미지로 들어 올린다.

### 이정표 2: Shapelet — Ye & Keogh 2009
> **무엇이었나**: 시계열의 *특정 짧은 부분구간* (shapelet) 만 잘 찾으면 그게 분류의 결정적 단서가 된다는 발상. 학습 = 가장 정보적인 shapelet 후보를 *수많은 부분구간* 에서 검색.
> **왜 부족했나**: 검색 비용 $O(n^4)$ 이상 — 후처리 (fast shapelet, learned shapelet) 가 있어도 여전히 *명시적 patch* 단위라 *전역 구조* 는 못 본다.
> **남긴 교훈**: 시계열의 *부분 패턴* 이 결정적이라는 점 → 본 논문 GAF 의 *국소 비대각 영역* 이 그 부분 패턴을 *암묵적으로 인코딩*.

### 이정표 3: SAX-VSM (Symbolic Aggregate approXimation + Vector Space Model) — Senin & Malinchik 2013
> **무엇이었나**: 시계열을 *기호 시퀀스* 로 양자화한 후 *bag-of-words* 표현으로 다룬 방식. *TF-IDF* 가중치로 클래스 분리.
> **왜 부족했나**: *양자화 시점에서 정보 손실* — 사다리 함수처럼 평탄한 구간이 한 기호로 압축되면 fine-grained 차이를 못 본다.
> **남긴 교훈**: 양자화 (quantization) 가 *Markov 마디 (state)* 로 추상화될 수 있다 — 본 논문 MTF 는 양자화 + 전이 확률 의 결합으로 *Markov-식 short-range structure* 를 보존.

### 이정표 4: Bag-of-Patterns (BOP) / TSBF (Time Series Bag-of-Features) — Lin & Li 2009 / Baydogan et al. 2013
> **무엇이었나**: SAX 의 확장 — 시계열을 *여러 길이 윈도우* 로 자르고 각 윈도우의 SAX 단어 분포를 *bag-of-pattern* 으로 다룬 방식.
> **왜 부족했나**: 윈도우 길이 hyperparameter 가 *데이터셋마다 다르게 잘 작동* — 보편성 부족.
> **남긴 교훈**: 다중 스케일의 윈도우 정보가 함께 있어야 한다는 점. GAF 는 이를 *전체 행렬의 다중 스케일 구조* (대각선=짧은 lag, 모서리=긴 lag) 로 한 번에 표현.

### 이정표 5: Collective of Transformation-based Ensembles (COTE) — Bagnall et al. 2015
> **무엇이었나**: 위 방법들 (DTW, shapelet, SAX, BOP …) 의 *앙상블* — TSC 의 새로운 SOTA 였다.
> **왜 부족했나**: *해석성 ↓, 계산 비용 ↑*. 11 개 분류기를 모두 학습/추론해야 한다. 깊은 학습 (deep learning) 의 *single end-to-end* 매력과 정반대.
> **남긴 교훈**: TSC 가 *하나의 강력한 표상 + 하나의 분류기* 로 풀려야 한다는 욕구 — 본 논문은 그 욕구에 *image representation + CNN* 으로 답한다.

(여기에 vision 쪽 이정표 — AlexNet 2012, VGG 2014, Tiled CNN of Le 2010 — 가 합류해 "이미지 분류기를 그대로 TS 에 쓰자" 는 발상이 떠오를 토양이 갖춰진다.)

## 3.4 기존 방법들이 공통으로 놓친 핵심 gap (한 문장)

> 2015 년 시점 TSC 의 모든 *손-설계 feature* 또는 *손-설계 거리 함수* 방법은 — *시계열 → 1D 학습기* 의 패러다임에 갇혀 있어서, 같은 시기 비전이 누리던 *2D conv · pretrained CNN · image inpainting · data augmentation* 등의 *11 년치 도구 생태계* 를 *데이터 표상 차원에서* 가져올 수 없었다.

## 3.5 이 논문이 그 gap 을 메우는 방식

본 논문은 **학습기를 바꾸지 않는다**. 대신 **데이터 표상의 차원을 1D → 2D 로 들어 올리는 *수학적으로 정의된* 두 가지 인코딩 (GAF, MTF) 을 제안**한다. 이 인코딩의 핵심 미덕은:

1. **결정론적** — 데이터마다 다른 hyperparameter 가 (거의) 없다. 정규화 후 polar 좌표 + Gram 행렬 = 한 줄 수식.
2. **Invertible (GASF on $[0, 1]$ rescaled data)** — 이미지에서 원 시계열을 *완전 복원 가능* → 이미지 복원기를 그대로 시계열 보간기로 활용 가능.
3. **CNN-친화적** — 2D 이미지가 *symmetric · positive semi-definite-like* 구조를 가져, 인접 픽셀이 *실제로 상관 있는* 친절한 격자가 만들어진다.

이 세 미덕이 합쳐져 — 비전의 표준 도구 (CNN, DA) 를 *튜닝 없이* TS 분류·보간에 적용 가능하게 만든 게 본 논문의 골격이다.
