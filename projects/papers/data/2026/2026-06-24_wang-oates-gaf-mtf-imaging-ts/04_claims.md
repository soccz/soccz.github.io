# 4. 핵심 Claim 해체

본 논문은 abstract verbatim 만으로도 명시되는 4 개의 큰 주장을 가진다. 각 주장의 *증거 위치* 는 본문 PDF 차단으로 *섹션 번호 단정* 은 안 하고, 외부 인덱스 + 저자 GitHub + abstract 위치로 추적한다.

---

## Claim 1 — 폴라 좌표 위의 Gram 행렬이 시계열의 *temporal correlation* 을 보존하는 자연스러운 2D 인코딩이다

### 주장 (한 문장)
$[-1, 1]$ 로 정규화된 시계열을 $\arccos$ 로 폴라 각도화한 후 *cosine 합* 또는 *sine 차* 의 Gram 행렬을 만들면, 결과 이미지가 *대각선=짧은 시간 lag · 모서리=긴 시간 lag* 의 *해석 가능한 위치 의미* 와 *symmetric / antisymmetric* 의 *수학적 구조* 를 동시에 갖는다.

### 증거 위치
- Abstract: "We propose a novel framework for encoding time series as different types of images, namely, Gramian Angular Summation/Difference Fields (GASF/GADF)" (verbatim).
- 본문: Section 3 ("Gramian Angular Field"; 식별 위치는 본문 PDF 차단으로 정확한 절 번호 단정 안 함, 그러나 외부 인덱스 보조로 "polar coordinate transformation … θ = arccos(X_norm), r = n/L … GASF = cos(φ_i + φ_j) … GADF = sin(φ_i − φ_j)" 의 정성 식이 verbatim 확인됨).
- 코드: GitHub `serie2GAF.py` (저자 본인 계정) 가 GASF/GADF 두 변형을 *parameter switch* 로 토글하는 구조 — Wiki 의 "GAF type 선택" 옵션으로 간접 확인.

### 숨은 전제
1. *Cosine summation 이 Gram-product 의 일반화* 라는 점 — 일반 Gram 행렬은 $G_{ij} = \langle x_i, x_j \rangle$ 인데, GASF 는 $G_{ij} = \cos(\phi_i + \phi_j) = \tilde{x}_i \tilde{x}_j - \sqrt{1-\tilde{x}_i^2}\sqrt{1-\tilde{x}_j^2}$ 형태로 *cosine 의 덧셈 정리* 를 통해 polar 각도 합의 *시간 짝* 정보를 한 픽셀에 압축. 이게 *내적-친화적* 구조라는 가정이 깔려 있다.
2. *시간 인덱스 자체* 는 GAF 격자의 *행/열 위치* 로만 인코딩 — 즉 시간 정보가 *값* 이 아니라 *축* 에 있다. 이는 vision CNN 의 spatial locality 가정과 호환되도록 의도된 것.
3. *정규화로 인한 정보 손실* 이 무시 가능 — $[-1, 1]$ scaling 은 *절대 크기* 를 버리고 *상대 모양* 만 보존. 본 논문은 *분류* 가 목적이라 이 trade-off 가 정당화되지만, *예측 (forecasting)* 처럼 절대값이 필요한 task 에는 즉각 적용이 어렵다는 주의.

### 쉬운 말 풀이
> "시계열의 각 시점을 *시계 바늘의 각도* 로 바꾸자 — 그러면 한 시계열은 *원 둘레 위의 점들* 이 된다. 그 다음 *모든 점 쌍의 각도를 더해서 cosine* 을 취하면 — 가까운 점은 1 에 가깝고, 정반대 점은 -1 에 가까운 *유사도 행렬* 이 만들어진다. 이게 *시계열의 모양* 을 *2D 그림* 으로 옮긴 것이다."

---

## Claim 2 — 양자화 + 마코프 전이 격자 (MTF) 가 *비-내적적 (non-inner-product)* 정보 채널을 추가로 제공한다

### 주장 (한 문장)
시계열 값을 $Q$ 개 사분위 (quantile bin) 로 양자화해 *상태 시퀀스* 로 보면, 1-step 전이 확률 행렬 $W$ 의 항을 시간 인덱스 짝에 *broadcast* 한 $M_{ij} = W_{q(x_i), q(x_j)}$ 격자는 — Gram 행렬과 *상보적 (complementary)* 인 *비대칭 short-range Markov structure* 를 인코딩한다.

### 증거 위치
- Abstract: "Markov Transition Fields (MTF)" (verbatim).
- 본문: Section 4 ("Markov Transition Field"; 정확한 절 번호 단정 안 함). 외부 인덱스: "the given time series is divided into a finite number of non-overlapping intervals acting as the states. For each pair of states $s_i$ and $s_j$, the transition probability of moving from $s_i$ to $s_j$ in one-time step is computed. Lastly, an MTF matrix is constructed where each element M(i, j) corresponds to the transition probability from state $s_i$ to state $s_j$." (verbatim from search snippet).
- 코드: `serie21MTF.py` + `serie2QMlib.py` (저자 GitHub) — 후자가 quantile mapping 라이브러리. Wiki 의 "quantile binning configuration" + "multiple reduction approaches (full, patch, PAA)" 로 간접 확인.

### 숨은 전제
1. *전이 행렬 $W$ 가 전체 시계열에 대해 단일로 추정 가능* — 즉 시계열이 *(국소적으로라도) 정상 (stationary)* 이라는 마코프 가정. 비정상 시계열에서는 $W$ 자체가 시간에 따라 변해야 하는데 본 논문은 *전체에 대해 한 번* 추정한다.
2. *양자화 수 $Q$ 의 선택* 이 결정적 hyperparameter. $Q$ 가 작으면 (예: 4) 정보 손실 + 너무 큰 $W$ 의 noise. $Q$ 가 크면 (예: 50) 전이 sparsity 가 너무 강해 학습 어려움. 본문은 *기본 $Q$* 값을 명시 (외부 인덱스 미확인; GitHub Wiki 가 "quantile binning configuration" 만 표시) 했을 것이지만 본 환경에서는 정확한 디폴트 단정 안 함.
3. *MTF 가 GAF 와 *RGB 채널로* 결합* 됐을 때 *상보성* 이 실제로 발생 — 즉 GASF + GADF + MTF 가 각각 *다른 정보* 를 담아야 한다. 본문에는 이 ablation 이 있을 것으로 추정되나 정확한 표 위치/수치는 미확인.

### 쉬운 말 풀이
> "각 시점의 값을 *낮음·중간·높음·아주 높음* 같은 4 단계로 양자화하자. 그러면 시계열은 *상태 시퀀스* 가 된다. *낮음 → 중간* 으로 가는 확률, *중간 → 아주 높음* 으로 가는 확률 — 이 모든 확률을 표로 만든 게 마코프 전이 행렬. 그 표의 항을 *시간 짝* 에 따라 칠하면, '이 시점 (값 = 중간) 에서 저 시점 (값 = 아주 높음) 으로 갈 확률' 이 한 픽셀에 들어간다. GAF 가 '두 시점이 얼마나 닮았는가' 라면 MTF 는 '두 시점 값 사이의 확률적 흐름' 이다."

---

## Claim 3 — 인코딩된 이미지 위의 Tiled CNN 분류기가 9 개 기존 SOTA TSC 방법과 동등하거나 우월하다 (20 UCR 데이터셋)

### 주장 (한 문장)
GASF / GADF / MTF (또는 셋의 RGB 결합) 이미지를 입력으로 Tiled CNN 을 학습시키면, *손-설계 feature 없이* 20 개 UCR 표준 데이터셋에서 9 개의 기존 SOTA TSC 방법 (DTW-1NN · shapelet · SAX-VSM · BoP · TSBF · COTE 등으로 추정) 과 *highly competitive* 한 분류 성능을 얻는다.

### 증거 위치
- Abstract: "We used Tiled Convolutional Neural Networks (tiled CNNs) on 20 standard datasets to learn high-level features from the individual and compound GASF-GADF-MTF images. Our approaches achieve highly competitive results when compared to nine of the current best time series classification approaches." (verbatim)
- 본문: Section 5 (Experiments — 정확한 절 번호 단정 안 함). 외부 인덱스에서 *Gun Point* 가 UCR 데이터셋의 하나로 사용됐다는 점만 보조 확인.
- **본 환경 미확인**: 20 데이터셋의 정확한 목록, 9 baseline 의 정확한 이름·표 매핑, 각 데이터셋별 error rate, win/tie/loss 카운트, 분산 통계, 어느 인코딩 (GASF / GADF / MTF / 컴파운드) 이 가장 좋았는지의 비교 표는 모두 PDF 차단으로 단정 안 함.

### 숨은 전제
1. *Tiled CNN 의 하이퍼파라미터 (tile size, depth, channel, pooling)* 이 20 데이터셋 전반에 *공통* 으로 잘 작동 — 즉 *데이터셋별 튜닝 없음* 이 비교의 공정성을 정당화한다. (이게 사실인지 본문에서 명시되는지는 미확인.)
2. *9 개 baseline 도 동일하게 튜닝* — 또는 *각 baseline 의 published best* 를 그대로 가져왔는지에 따라 비교 공정성이 달라진다. (정확한 협의는 본문 미확인.)
3. *20 UCR 데이터셋 선정* 이 *cherry-pick 이 아님* — UCR 의 표준 분류 작업 전체가 50+ 데이터셋이라 20 개 부분 선택의 *대표성* 이 항상 논란이 된다. (저자가 선정 기준을 명시했는지 미확인.)

### 쉬운 말 풀이
> "20 개 시계열 데이터셋을 가져와서 — 그게 ECG, 모션 캡처, 산업 센서 등 — 모두 이미지로 바꾸고, 그 이미지를 보는 신경망을 학습시켰더니, *기존 시계열 전문 방법들 9 가지를 다 합쳐도 못 이긴* 데이터셋이 많았다. 더 중요한 건 — *시계열-전용 알고리즘을 새로 만들지 않고도* 이런 결과가 나왔다는 점이다."

---

## Claim 4 — GASF 의 *bijection* 성질로 GASF-DA 가 raw-data DA 보다 결측 보간 MSE 를 12.18%–48.02% 감소

### 주장 (한 문장)
$[0, 1]$ 로 rescaled 된 시계열에 대해 GASF 가 *전단사 (bijection)* 이므로, 결측 부분을 GASF 이미지로 변환한 후 *Denoising Auto-encoder (DA)* 로 이미지를 복원하면 원 시계열의 결측치 보간 MSE 가 raw data 위 DA 대비 **12.18% ~ 48.02% 감소** 한다 (4 표준 + 1 합성 컴파운드 데이터셋).

### 증거 위치
- Abstract: "Inspired by the bijection property of GASF on 0/1 rescaled data, we train Denoised Auto-encoders (DA) on the GASF images of four standard and one synthesized compound dataset. The imputation MSE on test data is reduced by 12.18%-48.02% when compared to using the raw data." (verbatim — 두 수치는 abstract 자체 명시).
- 본문: Section 5.2 또는 Section 6 (Imputation — 정확한 위치 미확인). Figure 2 의 "Pipeline of time series imputation by image recovery. Raw GASF → broken GASF →…" 캡션이 ResearchGate snippet 으로 확인.
- **본 환경 미확인**: 4 표준 데이터셋 정확한 매핑, 1 합성 compound 데이터셋 구성, 결측 비율 sweep, 각 데이터셋별 정확한 MSE 절대 수치 (12.18%/48.02% 의 정확한 데이터셋 매칭은 단정 안 함).

### 숨은 전제
1. *GASF 가 진짜로 $[0, 1]$ 위 bijection* 인 이유는 — 대각선 항 $G^{\text{S}}_{ii} = \cos(2\phi_i) = 2\tilde{x}_i^2 - 1$ 에서 $\tilde{x}_i \in [0, 1]$ 의 단사성 + 비대각 항으로의 redundant 확인. 단 *$[-1, 1]$ rescale* 에서는 $\arccos$ 의 image 가 $[0, \pi]$ 라 $\tilde{x}_i$ 와 $-\tilde{x}_i$ 가 모두 같은 *cos* 값을 줄 수 있어 bijection 이 깨진다. **이게 본 논문이 imputation 에는 $[0, 1]$ rescale 을 쓰는 이유** — 본문에 이 정확한 정당화가 있을 것으로 추정.
2. *Denoising Auto-encoder (DA)* 가 image inpainting 의 대용 — 즉 결측 영역을 noise 로 두고 DA 가 그 noise 를 복원. 이 가정이 *Markov 적 결측* (random masking) 에서는 작동하지만 *연속 구간 결측* 에서는 약할 수 있다.
3. *raw vs GASF 의 DA 비교* 가 *DA 의 architecture·hyperparameter 가 동일* 하다는 가정 아래에서만 유효. 본문에 이 통제가 명시되는지 미확인.

### 쉬운 말 풀이
> "시계열에 *구멍* 이 났다고 하자. 그 구멍을 그냥 *값에서* 메우려고 하면, 이웃 값을 단순히 평균 내는 정도밖에 못 한다. 본 논문의 트릭: 시계열을 이미지로 바꾸면, 그 이미지에서 *구멍에 해당하는 픽셀들* 은 *시계열의 다른 부분과의 상관 관계* 가 사라진 부분이다. 그런데 *이미지의 다른 픽셀들* 은 그 상관 관계를 여전히 알고 있으니까 — 이미지 복원기 (auto-encoder) 가 그 정보로 구멍을 메운다. 그리고 GASF 가 *invertible* 이라서, 이미지를 다시 시계열로 변환하면 결측도 자동으로 메워진다. 결과: raw 데이터 위에서 같은 복원기를 쓴 것보다 **12~48% 정확함**."
