# 02. 3층 TL;DR

## 👶 초등학생 수준 (이미지 비유)

종이에 긴 선을 그렸다고 상상해보자. 아주 긴 선이라서 한눈에 파악하기가 어렵다. 그런데 이 선이 사실 매일 오르락 내리락 하는 패턴을 반복하고 있다면, 선을 하루 단위로 잘라서 위아래로 쌓으면 어떨까? 갑자기 **표**수렉 보이기 시작한다. 가로(각 날의 패턴)와 세로(날마다 어떻게 변하는지)를 동시에 볼 수 있게 된다.

TimesNet이 하는 일이 바로 이것이다. 길고 복잡한 시계열 데이터를 "규칙적인 주기"로 접어서 2D 이미지(직사각형 표)로 만든다. 그러고 나면 사진을 인식하는 AI(CNN)를 써서 이 표의 패턴을 읽어낼 수 있다.

신기한 점은 이 방법 하나로 **예측, 빈칸 쉡우기, 이상 탐지, 분류** 4가지 문제를 전부 잘 풀 수 있다는 것이다. 요리를 잘 하는 사람이 볶음·짜음·구이를 다 잘 하는 것처럼, TimesNet은 "2D 이미지로 변환"이라는 하나의 요리 기술로 다양한 시계열 문제를 해결한다.

---

## 🎓 학부생 수준 (개념 + 아이디어)

**문제**: 기존 시계열 Transformer 모델은 1D 시퀀스를 그대로 처리하면서 **intraperiod-variation**(한 주기 안에서의 단기 패턴)과 **interperiod-variation**(여러 주기에 걸친 장기 추세)를 동시에 포착하기 어려웠다. Attention 메커니즘은 장거리 의존성을 학습할 수 있지만 O(T²) 비용이 들고, 1D 합성곱 커널은 인접한 시점만 볼 수 있어서 장기 의존성을 놓친다.

**아이디어**: 실세계 시계열은 **다중 주기성(multi-periodicity)**을 지닌다 — 기온은 하루·일주일·계절 주기가 격치고, 주식은 개장·마감·주간·분기 주기가 격친다. FFT(Fast Fourier Transform, 고속 푸리에 변환 — 신호를 주파수 성분으로 분해하는 알고리즘)로 지배적인 $k$개 주기 $p_1, p_2, \ldots, p_k$를 자동으로 탐지한다.

주기 $p$를 이용해 1D 시퀀스 $\mathbf{x} \in \mathbb{R}^{T \times C}$를 2D 텐서 $\mathbf{X}^{2D} \in \mathbb{R}^{C \times \lceil T/p \rceil \times p}$로 **reshape** 한다:
- **행(rows)**: 주기의 개수 $\lceil T/p \rceil$ — 시간이 흘르면서 주기가 어떻게 변하는지 (interperiod)
- **열(cols)**: 주기 길이 $p$ — 한 주기 안에서의 패턴 (intraperiod)

이 2D 텐서를 Inception 블록(여러 크기의 2D 커널을 병렬 사용하는 효율적 합성곱 구조)으로 처리한 뒤 다시 1D로 복원한다. $k$개 주기 각각의 출력을 FFT 진폭으로 가중 평균하여 최종 표현을 만든다.

**결과**: 5개 주류 TS 분석 태스크(장·단기 예측, 결측 보완, 이상 탐지, 분류) 전부에서 15개 이상 baseline 대비 state-of-the-art. 단기 예측(M4 데이터셋): SMAPE 11.829, MASE 1.585, OWA 0.851.

---

## 🔬 전문가 수준 (Contribution 목록)

**Contribution 1 — 1D→2D 변환 원리의 정형화**:
실세계 시계열의 복잡한 시간 변화를 *intraperiod-variation*과 *interperiod-variation* 두 축으로 분해하고, 이 분해가 FFT 주기 탐지 + reshape 연산으로 자연스럽게 실현됨을 보인다. 이는 시계열을 "접힌 2D 이미지"로 보는 이론적 프레임을 처음으로 체계화한 것이다.

**Contribution 2 — TimesBlock: 태스크 불가지론적(task-agnostic) 범용 블록**:
FFT_for_Period → 1D→2D reshape → Inception_Block_V1(GELU) → 2D→1D reshape → softmax 가중합 → residual 연결이라는 하나의 블록이 예측·보완·이상탐지·분류 모두에서 동일하게 동작한다. 태스크별 head만 교체하는 구조.

**Contribution 3 — 5개 태스크 통합 벤치마크 SOTA (2023년 시점)**:
- 장기 예측: ETT×4, Electricity, Traffic, Weather, Exchange, ILI에서 DLinear, Non-stationary Transformer 대비 우위 (80% 이상 케이스)
- 단기 예측(M4): SMAPE 11.829
- 결측 보완(Imputation), 이상 탐지(5개 benchmark), 분류(UEA): SOTA

**Contribution 4 — CKA 기반 표현 계층성 분석**:
Centered Kernel Alignment(CKA — 두 신경망 층의 표현이 얼마나 유사한지를 측정하는 지표)로 분석하면, 예측·이상탐지는 업은 층(low-level) 표현을 주로 쓰고, 보완·분류는 깊은 층(hierarchical) 표현을 쓴다. 이는 TimesNet이 태스크에 따라 표현 깊이를 적응적으로 사용하는 foundation model적 성질을 가짘을 시사한다.

**한계 (방어 가능한 주장의 경계)**:
- FFT 주기 탐지는 **전역 정상성(global stationarity)**을 가정한다 — 시간에 따라 주기가 바뀜는 비정상 시계열(regime shift 등)에서는 잘못된 주기를 탐지할 수 있다.
- 주기가 없는 금융 시계열(Exchange-Rate 등)에서는 2D 변환의 이점이 제한적이다.
- 2024년 이후 등장한 PatchTST·TimeMixer·iTransformer에게 예측 태스크에서 추월당했다 (Time-Series-Library leaderboard 기준 장기 예측 1위는 TimesNet이 아님).
