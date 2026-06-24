# 2. 3층 TL;DR

## 2.1 🧒 초등학생 수준

여러분이 종이에 매일 키를 기록한다고 해 봅시다. **365 개의 숫자**가 한 줄로 늘어선 거예요. 누군가 "이 친구가 봄에 키가 자라는 속도, 여름에 자라는 속도, 가을·겨울에 자라는 속도를 한 번에 보여줘" 라고 하면, 365 개 숫자를 한 줄로 봐서는 한눈에 알기 어려워요.

이 논문은 이런 기발한 아이디어를 냅니다: **365 개 숫자를 365×365 짜리 "사진" 으로 바꾸자**. 사진의 가로축은 1 월부터 12 월까지, 세로축도 1 월부터 12 월까지예요. 사진의 한 점 (3 월 첫째 주, 8 월 둘째 주) 은 "3 월 첫째 주 키와 8 월 둘째 주 키의 *관계*" — 둘이 비슷하면 밝게, 다르면 어둡게 — 를 칠합니다.

이렇게 만든 사진은 사람 눈에도 패턴이 보입니다. *대각선이 진하면 매일이 비슷*, *오른쪽 위가 밝으면 후반부에 급격히 변화*, *체크무늬가 보이면 주기적 패턴* 같은 식이죠. 그리고 무엇보다 — 이미 *고양이/강아지/자동차* 같은 사진을 잘 분류하는 컴퓨터 프로그램 (CNN) 이 있으니까, 시계열을 사진으로 바꿔놓으면 그 프로그램을 **그대로 가져다 쓸 수 있다**는 게 결정타입니다.

저자들은 두 가지 종류의 "사진" 을 만드는 법을 제안합니다. 하나는 *각도의 합* 으로 (이걸 GASF 라 합니다 — "각도 합 사진"), 또 하나는 *상태 간 이동 확률* 로 (MTF — "다음 상태 사진") 칠합니다. 그리고 사진 분류용 신경망 (Tiled CNN) 을 학습시켜 20 개 표준 시계열 데이터셋에서 좋은 성적을 얻고, 더 놀라운 건 — 시계열에 *구멍* (결측치) 이 났을 때 사진을 복원하면 원본 숫자열도 복원돼서 결측 보간 오차가 **12~48%** 줄었다는 점입니다.

핵심 발상은 **"시계열은 1 차원이라는 편견을 깨라"**. 시계열을 2 차원 그림으로 들어 올리면, 컴퓨터 비전 분야의 11 년치 도구 (CNN, autoencoder, image segmentation) 가 한 번에 시계열에도 적용되는 거예요.

## 2.2 🎓 학부생 수준

### 2.2.1 풀고자 한 문제
2015 년 시점에서 시계열 분류 (Time Series Classification, TSC) 의 SOTA 는 **DTW (Dynamic Time Warping) + 1-NN 분류기** 그리고 **shapelet / bag-of-patterns / SAX-VSM** 같은 *손으로 설계된 feature* 위의 분류기였습니다. 한편 같은 시기 컴퓨터 비전은 AlexNet (2012) → VGG (2014) → ResNet (2015) 등 **CNN 의 폭발적 성공**을 보여주고 있었지만, *시계열* 은 1D 라서 CNN 의 풍부한 도구 (2D conv / max pool / data augmentation / pretrained model 전이) 를 그대로 못 썼습니다.

저자들의 발상은 **"시계열을 이미지로 바꿔서 CNN 을 그대로 쓰자"** 입니다. 즉 *학습기를 시계열용으로 새로 만들기 보다 데이터 표상을 비전 친화적으로 바꾸자* 는 *표상 우선* 의 전략입니다.

### 2.2.2 어떻게 이미지로 만드는가
세 가지 인코딩이 제안됩니다.

1. **GASF (Gramian Angular Summation Field)**: 길이 $n$ 의 시계열 $X = (x_1, \ldots, x_n)$ 을 $[-1, 1]$ 로 정규화한 후 (그러면 $\arccos$ 가 잘 정의됨), 각 값 $\tilde{x}_i$ 를 폴라 좌표의 각도 $\phi_i = \arccos(\tilde{x}_i)$ 로 변환합니다. 그러면 $n \times n$ 짜리 GASF 행렬 $G^{\text{S}}_{ij} = \cos(\phi_i + \phi_j)$ 가 만들어집니다.
2. **GADF (Gramian Angular Difference Field)**: 같은 절차에서 $G^{\text{D}}_{ij} = \sin(\phi_i - \phi_j)$ 를 씁니다.
3. **MTF (Markov Transition Field)**: 시계열 값을 $Q$ 개의 사분위로 양자화해 상태 $s_1, \ldots, s_Q$ 를 만들고, 전이 확률 행렬 $W \in \mathbb{R}^{Q \times Q}$ 를 추정한 후, $M_{ij} = W_{q(x_i), q(x_j)}$ 로 채웁니다.

이 세 가지 이미지 (또는 셋을 RGB-3 채널로 합친 *컴파운드 이미지*) 위에 **Tiled CNN (Le et al. 2010)** — 공유 가중치를 부분적으로만 쓰는 CNN — 을 학습시킵니다.

### 2.2.3 무엇을 보였는가
- **분류**: 20 개 UCR 표준 데이터셋에서 9 개의 기존 SOTA TSC 방법 (DTW-1NN, shapelet, SAX-VSM 등) 과 동등하거나 우월한 성능. Abstract 의 "highly competitive results" 표현.
- **결측 보간**: GASF 가 $[0, 1]$ 로 rescale 된 데이터에 대해 **전단사 (bijection)** 임을 활용해, GASF 이미지를 *denoising auto-encoder (DA)* 로 복원하면 원 시계열도 자동 복원됩니다. 4 표준 데이터셋 + 1 합성 컴파운드에서 raw 데이터 보간 대비 MSE **12.18%–48.02% 감소** (abstract verbatim 수치).

핵심 메시지: **"잘 설계된 데이터 표상은 모델 아키텍처보다 더 큰 자유도를 가진다"** — 시계열용 RNN/Transformer 를 새로 만들기 *전에*, 이미 검증된 CNN 으로 풀 수 있게 표상을 바꿔라.

## 2.3 🔬 전문가 수준

### Contribution 4 (논문 abstract + GitHub 코드 + 외부 인덱스 verbatim 으로 단정 가능한 범위)

**C1. TS-as-image 의 prinicpled 인코딩 2 종 + 양자화 전이 변형 1 종 제시**: GASF 와 GADF 는 polar coordinate 위의 inner-product Gram matrix (cosine summation / sine difference) 로 시계열의 *temporal correlation* 을 $n \times n$ pixel 격자에 *대칭/반대칭* 두 형식으로 인코딩한다. MTF 는 *마코프 양자화* 격자로 같은 격자 위에 *비대칭 전이 정보* 를 인코딩한다. 세 인코딩을 GASF-GADF-MTF 3-channel compound image 로 결합해 vision CNN 에 그대로 투입.

**C2. Bijection on $[0, 1]$ rescaled data → 결측 보간으로의 직접 분기**: $\tilde{x}_i \in [0, 1]$ 에서 $\phi_i = \arccos(\tilde{x}_i) \in [0, \pi/2]$ 이므로 GASF 의 대각선 항 $G^{\text{S}}_{ii} = \cos(2\phi_i) = 2\tilde{x}_i^2 - 1$ 에서 $\tilde{x}_i$ 가 유일하게 복원된다. 이 성질이 *이미지를 denoise → 시계열을 imputation* 의 명시적 도구로 활용. **이건 단순한 표상 변환이 아니라 invertible representation 의 학습 활용** 인데, 11 년 후 *flow 기반 invertible neural network* 와 *normalizing flow for TS* 의 사고와 동형.

**C3. Tiled CNN (Le 2010) 의 1D-TS-via-2D-image 응용**: 보통 CNN 의 weight-sharing 가정 (모든 위치에서 같은 conv kernel) 은 *시간 축의 비정상성* (한 구간에서의 패턴이 다른 구간에서는 다른 의미) 과 충돌할 수 있다. Tiled CNN 은 *같은 타일 내에서만 가중치 공유* 라는 부분 공유 방식 — 본 논문은 이 특성이 GAF/MTF 의 *대각선·반대각선 구조* 와 잘 맞음을 실험으로 보여줌. (정확한 tiled CNN hyperparameter — tile size · 채널 수 · 깊이 — 는 본문 PDF 차단으로 단정 안 함; 단 GitHub `serie2QMlib.py` 에 quantile mapping primitive 가 있고 학습 코드도 함께 제공됨.)

**C4. 시각화로서의 부가가치**: GAF 이미지가 본질적으로 *Gram matrix* 이기 때문에 *symmetric · positive semi-definite 의 일부 성질* 을 띤다. 이는 단순히 분류 성능을 올린 것 외에 — *직관적인 시각화 도구* 로도 사용 가능. (Wang & Oates 의 AAAI 2015 워크샵 자매 논문 제목 "Encoding Time Series as Images for **Visual Inspection** and Classification" 이 이 시각적 가치를 직접 명시.)

### 방어 가능한 주장 & 이론적 한계
- **방어**: GAF 의 polar 좌표 인코딩은 *temporal correlation* 의 *non-Cartesian* 표현이라 *시간축 비등간* 데이터에서도 자연스럽다 (각도와 반지름이 시간/값을 분리). MTF 는 *비모수적 마코프 가정* 으로 short-range temporal dependency 를 명시.
- **한계** (저자 명시 부분 + 본문 PDF 미확인이라 추정 한계 별도 표기):
  - 명시: 시계열 길이 $n$ 이 크면 $n \times n$ 이미지가 *quadratic* 메모리 → PAA (Piecewise Aggregate Approximation) 로 차원 축소 (저자 GitHub `serie2QMlib.py` 의 PAA reduction 옵션 + Wiki PAA dimensionality 파라미터로 간접 확인).
  - 추정: MTF 의 quantile 수 $Q$ 선택 민감도, GASF/GADF/MTF 의 RGB 결합이 단일 채널 대비 얼마나 성능 기여하는지 ablation, 비단조 시계열에 대한 polar 변환의 모호성 (단조구간 가정) — 이들은 *본문 본문 표 절대 수치* 가 PDF 차단으로 미확인이라 단정 안 함.

### Why now / Why this paper
TS-as-image 분야의 **11 년 후 두 후계** — TimesNet (2023, ICLR) 의 FFT-주기-2D-reshape 와 VisionTS (2024, ICML 2025) 의 frozen ImageNet MAE 적용 — 가 이미 cover 됐는데, 그 두 논문이 모두 **본 논문을 직접 인용·계승**한다. 즉 *조상* 을 채우지 않으면 후손의 prior choice (왜 reshape 인가, 왜 이미지 추상화인가) 의 정당성 분석이 불완전하다. APF 가 attention map 을 *N×N* 격자로 다루는 한 — GAF 가 만드는 *외생적* N×N 격자와 학습된 *내생적* N×N 격자의 **관계 자체** 가 APF 의 motif causality 가설을 검증하는 통제 변수가 된다.
