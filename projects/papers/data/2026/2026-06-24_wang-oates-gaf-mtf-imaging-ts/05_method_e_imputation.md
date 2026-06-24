# 5.E 방법론 ⑤ GASF bijection 기반 시계열 결측 보간

## 5.E.1 이 부분이 왜 필요한가

GAF/MTF 의 *분류* 응용 (5.B~5.D) 은 *시계열 → 이미지 → 라벨* 의 *forward* 파이프라인이다. 그러나 *결측 보간 (imputation)* 은 *시계열 → 이미지 → 복원 → 시계열* 의 *왕복* 이라 — *이미지 → 시계열* 의 *역변환* 이 잘 정의돼 있어야 한다. **GASF 가 $[0, 1]$ rescaled 데이터에 대해 bijection (전단사)** 이라는 점이 이 왕복을 가능하게 한다.

## 5.E.2 Bijection 의 증명 (정성)

$\tilde{x}_i \in [0, 1]$ 로 rescale 하면 $\phi_i = \arccos(\tilde{x}_i) \in [0, \pi/2]$. 이 범위에서:

$$G^{\text{S}}_{ii} \;=\; \cos(2\phi_i) \;=\; 2\cos^2(\phi_i) - 1 \;=\; 2\tilde{x}_i^2 - 1$$

이 등식은 $\tilde{x}_i \in [0, 1]$ 에서 *단조 증가* (왜냐하면 $\tilde{x}_i^2$ 이 그 범위에서 단조 증가). 따라서:

$$\tilde{x}_i \;=\; \sqrt{\frac{G^{\text{S}}_{ii} + 1}{2}}$$

즉 **GASF 의 대각선 항만 알아도 시계열 전체가 정확히 복원** 된다. 비대각선 항은 *redundant* (대각선 정보가 정확하다면 비대각 항은 정합성 검사용).

**4 줄 해석**:
- **기호 뜻**: $\tilde{x}_i \in [0, 1]$ 이 단조 단사이므로 $\tilde{x}_i^2$ 도 단사, 따라서 $G^{\text{S}}_{ii}$ 에서 $\tilde{x}_i$ 가 유일 복원.
- **일상 비유**: 시계열을 사진으로 압축했는데 *사진의 대각선* 만 봐도 원본을 *정확히* 복원할 수 있다는 뜻. 사진의 나머지 영역은 *압축의 자기 검증용 잉여*.
- **왜 이 형태**: $[0, 1]$ rescale 이 *$\arccos$ 의 image 를 $[0, \pi/2]$ 의 단사 구간으로 제한* — $[-1, 1]$ rescale 이면 $[0, \pi]$ 인데 이 범위는 $\cos(2\phi)$ 가 *비단조* (즉 $\tilde{x}$ 의 부호 모호) 라 복원 안 됨.
- **조심할 점**: bijection 은 *정확한 GASF 값* 을 알 때 성립. 결측 부분의 *GASF 값을 복원* 하는 단계 (DA) 에 *noise* 가 있으면 그게 곧장 시계열 보간 오차로 직결.

## 5.E.3 Denoising Auto-encoder (DA) 의 사용

GASF 이미지의 결측 영역을 *random masking* 으로 표시한 후, *DA* 가 그 mask 를 복원하도록 학습:

$$\hat{G}^{\text{S}} \;=\; \text{DA}\bigl(G^{\text{S}} \odot \text{mask}\bigr)$$

DA 의 학습 목표:

$$\mathcal{L}_{\text{DA}} \;=\; \mathbb{E}_{\text{mask}} \bigl\|\text{DA}(G^{\text{S}} \odot \text{mask}) - G^{\text{S}}\bigr\|_2^2$$

복원된 $\hat{G}^{\text{S}}$ 의 대각선 항에서 시계열 보간:

$$\hat{\tilde{x}}_i \;=\; \sqrt{\frac{\hat{G}^{\text{S}}_{ii} + 1}{2}}$$

**4 줄 해석**:
- **기호 뜻**: $\odot$ = elementwise mask 곱, $\hat{G}^{\text{S}}$ = DA 가 복원한 GASF, $\hat{\tilde{x}}_i$ = 복원된 시계열 값.
- **일상 비유**: 사진 일부에 검은 칠을 한 후, 그 부분을 *주변 픽셀의 정보로 추정* 하는 사진 복원 기술. 시계열의 결측이 *이미지의 검은 부분* 으로 변환된다.
- **왜 이 형태**: *이미지 inpainting* 의 도구를 *시계열 보간* 으로 재활용. DA 는 그 시점 비전에서 가장 표준적인 *image-to-image* 모델.
- **조심할 점**: DA 의 *capacity* 가 작으면 *복원* 이 *평균화* 로 수렴해 *고주파* 정보를 잃는다. 본 논문이 DA 의 layer 수 / hidden size / training schedule 을 명시했을 것이나 본 환경에서는 미확인.

## 5.E.4 이 분기에서 보인 성과 (Abstract verbatim)

> "Inspired by the bijection property of GASF on 0/1 rescaled data, we train Denoised Auto-encoders (DA) on the GASF images of four standard and one synthesized compound dataset. The imputation MSE on test data is reduced by 12.18%-48.02% when compared to using the raw data."

즉 **4 표준 + 1 합성 컴파운드** 데이터셋에서 *동일한 DA architecture* 를 *raw 시계열 위* vs *GASF 이미지 위* 두 곳에 적용해 비교 → GASF 위 학습이 **12.18% ~ 48.02% MSE 감소**.

**해석**:
- 12.18% (최소) 데이터셋은 *short-range, low-noise* 시계열일 가능성 — 이런 데이터에서는 raw DA 도 충분히 잘 함.
- 48.02% (최대) 데이터셋은 *long-range correlation 또는 multi-scale periodicity* 가 있는 시계열일 가능성 — GASF 의 *전역적 grid 구조* 가 이를 잘 잡음.
- 정확한 데이터셋 매핑은 본 환경 미확인.

## 5.E.5 대안 inpainting 접근 (논문 이후 발전)

| 대안 | 설명 | 본 논문과의 관계 |
|---|---|---|
| **Conditional GAN inpainting** (2017+) | GAN 으로 사실적 inpainting | 본 논문은 DA 만 — 11 년 후 GAF-on-GAN 변종 등장 |
| **Partial Convolution** (Liu 2018) | mask-aware convolution | 본 논문의 *masked DA* 의 strict 보다 robust 한 inpainting |
| **GAIN (Generative Adversarial Imputation Network)** (Yoon 2018) | 시계열 결측 보간 전용 GAN | 본 논문의 *이미지 inpainting → 시계열 보간* 의 *raw-domain* 경쟁자 |
| **BRITS / SAITS** (2018~2023) | RNN/Transformer 기반 시계열 보간 | 본 논문의 *learned representation* 경쟁자 |

본 논문이 등장한 2015 시점에는 *DA + 단순 random mask* 가 합리적 선택. 11 년 후의 발전을 적용하면 더 강력한 GASF-inpainting 이 가능.

## 5.E.6 한 문장 정리

> "GASF 가 $[0, 1]$ rescaled 데이터에 대해 *전단사* 라는 *수학적 성질* 이 시계열 결측 보간을 *이미지 inpainting* 의 11 년치 도구 생태계에 직접 연결시킨다 — 4+1 데이터셋에서 12~48% MSE 감소는 *학습기 변화가 아니라 표상 변화만으로* 얻어진 성과이며, 이것이 본 논문의 *표상 우선 (representation-first)* 철학의 가장 강한 실증이다."
