# 05 · 방법론 ② TS → image 변환 (코드 6 단계 분해)

## 배경 사다리

이 절을 이해하려면 ① **시계열 길이 $T$ 가 주기 $p$ 의 정수배 $T = p \cdot f$ 일 때 시간축을 frame index $f$ 와 phase index $p$ 두 축으로 풀어낼 수 있다** 는 것, ② **MAE 입력이 $224\times224$ 이미지로 고정** 되어 있다는 것, ③ **einops 의 `rearrange` 는 텐서를 차원 단위로 안전하게 재배열하는 라이브러리** 라는 것만 알면 된다.

이 절은 본 논문의 핵심 인터페이스인 **단계 [1]~[4]** (정규화 / reshape / 이미지화 / 마스크 정렬) 를 코드 fragment 와 함께 분해한다.

---

## [1] 정규화 (RevIN 변형)

**코드 fragment** (`visionts/model.py` summary):
```python
means = x.mean(1, keepdim=True).detach()
x = (x - means) / (x.std(1, keepdim=True).detach() * norm_const + 1e-5)
# norm_const = 0.4 (기본값)
```

**수식**:
$$
\tilde{x}_t = \frac{x_t - \mu}{c \cdot \sigma + \varepsilon}, \quad \mu = \frac{1}{T_{ctx}}\sum_{t=1}^{T_{ctx}} x_t,\ \sigma = \mathrm{std}(x_{1:T_{ctx}}),\ c = 0.4,\ \varepsilon=10^{-5}
$$

**4 줄 해석**:
1. **기호 뜻**: $x_t$ = 시점 $t$ 의 원 시계열 값. $\mu, \sigma$ = context window (과거 $T_{ctx}$ 시점) 의 평균·표준편차. $c$ = 정규화 강도 조절 상수 (default 0.4 → std 를 0.4 배만큼 누름 → MAE 입력 분포에 맞춤). $\varepsilon$ = zero-div 방지.
2. **일상 비유**: 사진을 인쇄하기 전 RGB 값을 0~1 로 맞추는 일과 같다. 다른 카메라(데이터셋)로 찍어도 같은 인쇄 기계(MAE)에 들어갈 수 있도록.
3. **왜 이 형태**: 표준 RevIN (Kim et al. ICLR 2022) 은 $c=1$ 인데, 본 논문은 $c=0.4$ 로 분포를 더 조여 MAE 의 입력 통계 (ImageNet 픽셀의 mean 0.485 / std 0.229 정도) 와 맞춘다. `.detach()` 로 gradient 안 흘러가게 한 건 시계열 normalization 을 학습 가능 파라미터로 두지 않겠다는 명시.
4. **조심할 점**: context 가 매우 짧거나 (extreme low-variance) regime shift 직후엔 $\sigma$ 가 노이즈에 휘둘려 outlier 가 입력 분포를 왜곡할 수 있음. norm_const=0.4 라는 magic number 는 ImageNet 통계와의 ad-hoc 매칭 — 다른 vision backbone (CLIP, DINO 등) 이면 달라야 함.

---

## [2] 주기로 접기 — 2D 격자화 (Periodicity reshape)

**코드 fragment** (`visionts/model.py` summary):
```python
import einops
# x_pad: (B, N, T_pad) 형태, T_pad = p · f (정수배 padding)
x_2d = einops.rearrange(x_pad, 'b n (p f) -> b n f p', f=self.periodicity)
# 결과: (B, N, f, p) — 세로 frame index, 가로 phase
```

**수식 (개념)**:
$$
\text{1D: } \mathbf{x} \in \mathbb{R}^{T} \longrightarrow \text{2D: } X \in \mathbb{R}^{f \times p}, \quad T = f \cdot p, \quad X[i, j] = x_{i \cdot p + j}
$$

**4 줄 해석**:
1. **기호 뜻**: $T$ = 시계열 총 길이 (context + horizon, padding 후), $p$ = `self.periodicity` (외부 지정 주기 정수, ETT-hourly 면 24), $f$ = $T/p$ = 주기 단위 개수. $X[i, j]$ = $i$ 번째 주기의 $j$ 번째 위상의 값.
2. **일상 비유**: 365 일치 일일 평균기온을 12행 30.4열의 달력 격자로 펴는 것 — 위에서 아래로 내려가면 계절, 가로로 가면 한 달 안 위치. 본 논문은 더 짧은 주기 (시간 단위) 에 같은 짓을 한다.
3. **왜 이 형태**: TimesNet (ICLR 2023) 도 같은 reshape 을 한다. 다만 TimesNet 은 FFT 로 top-k 주기를 찾아 여러 $p$ 로 동시에 reshape; 본 논문은 단일 $p$ 만 사용. 그 단순함이 free-lunch 의 조건.
4. **조심할 점**: $p$ 가 잘못 지정되면 격자가 깨진다 (예: 주기 24 인 데이터를 25 로 reshape 하면 phase index 가 의미 잃음). multi-periodic 시계열 (주·일 동시 주기) 의 경우 단일 $p$ 가 약한 면 — 후속 VisionTS++ 가 이걸 어떻게 다뤘는지는 별도 검토 필요.

---

## [3] 이미지화 — Render to 224×224

**코드 fragment** (`visionts/model.py` summary):
```python
# 2D 격자 → (B, N, 224, 224) 이미지로 resize
img = self.input_resize(x_2d)  # nn.AdaptiveAvgPool 또는 Interpolation
# 다변량 N>1: 변수를 RGB 채널 (N<=3) 또는 공간 stack (N>3)
```

**4 줄 해석**:
1. **기호 뜻**: `input_resize` = 학습 불가 (또는 고정 파라미터) 의 spatial 변환. 결과 텐서 형태는 `(B, C_in=3, 224, 224)`.
2. **일상 비유**: 작은 엑셀 표를 큰 종이에 인쇄하면서 칸 사이를 부드럽게 흐리게 만드는 것. 격자가 너무 작거나 너무 크면 224×224 에 맞춰지면서 정보가 약간 깎이거나 보간된다.
3. **왜 이 형태**: MAE 는 $224\times224$ 입력에만 작동하도록 ImageNet 으로 학습됨. 이 사이즈를 바꾸면 positional embedding 도 다시 만들어야 함 → simplicity 깨짐.
4. **조심할 점**: $f \cdot p = T_{ctx}+T_{pred}$ 가 224 보다 작으면 보간 결과가 흐릿하고, 훨씬 크면 down-sampling 으로 고주파 정보 손실. context 길이와 horizon 의 합이 일정 범위 안에 있을 때 가장 잘 통하는 sweet-spot 존재. 본 논문이 어떤 context 길이 범위를 권장하는지는 본문 미확인.

---

## [4] 마스크 정렬 — Horizontal concat to one image

**코드 fragment** (model.py summary):
```python
# input region (context) | masked prediction region (horizon)
image = horizontal_concat(input_image, masked_image)  # (B, 3, 224, 448) 후 224×224 crop
# 또는 한 224×224 안에 좌우 분할
mask_ratio = (num_patch - num_patch_input) / num_patch
```

**수식**:
$$
\text{mask\_ratio} = \frac{\text{num\_patch}_{\text{total}} - \text{num\_patch}_{\text{input}}}{\text{num\_patch}_{\text{total}}}, \quad \text{num\_patch} = \left(\frac{224}{16}\right)^2 = 196
$$

**4 줄 해석**:
1. **기호 뜻**: `num_patch_input` = 입력 영역(왼쪽)에 해당하는 패치 수, `num_patch_total` = 224×224 이미지 전체의 패치 수 (=196). `mask_ratio` 가 0 이면 가린 게 없고, 1 이면 전부 가림. 표준 MAE 학습 때는 0.75.
2. **일상 비유**: 한 장의 가로 1920×1080 화면을 왼쪽 절반은 보이고 오른쪽 절반은 검정으로 가린 뒤 친구한테 보여주는 것. 친구가 본 적 있던 풍경 사진의 통계 지식으로 오른쪽 검정 부분을 채워 넣는다.
3. **왜 이 형태**: MAE 의 학습 목적이 "masked patch → 픽셀 복원" 이므로, **예측 영역을 가린 패치로 표현하면 학습 목적과 inference 목적이 정렬** 된다. 이게 본 논문의 핵심 발명.
4. **조심할 점**: MAE 가 학습 때 본 mask 는 **random sparse** 였고, inference 의 mask 는 **contiguous block (예측 horizon 만큼)**. 분포 mismatch. 큰 horizon (예: $T_{pred} > T_{ctx}$) 의 경우 mask_ratio > 0.5 가 되어 MAE 가 학습한 적 없는 영역으로 들어감.

이 부분이 본 논문의 **가장 강한 가설이자 가장 약한 가설** 이다. 강함은 발상의 깔끔함, 약함은 random → contiguous mask 분포 일반화의 검증 필요.

## 다른 디자인으로 했다면?

- (대안 1) **Vertical concat**: 위 input, 아래 prediction → 같은 효과지만 phase 순서가 깨진다. Phase 가 가로 축인 본 논문 reshape 와 충돌. 따라서 horizontal 이 자연스러움.
- (대안 2) **Frame-by-frame iterative inpainting**: 한 번에 horizon 전체를 채우지 않고 자기회귀적으로 한 frame 씩. Chronos/TimesFM 류와 닮음. MAE 의 single-pass parallel reconstruction 의 장점이 깎임.
- (대안 3) **Multi-scale mask**: horizon 영역 안에서도 일부만 가리고 나머지는 보이게. Test-time 에 정보 누설 위험.

본 논문이 (1) horizontal concat + (2) one-shot inpainting + (3) full horizon mask 를 택한 것은 **MAE 의 본 분포에 최대한 가깝게 한다는 단일 원칙** 으로 일관된다.

## 이 절의 한 줄 요약

> "정규화 → 주기로 접기 → 224 로 리사이즈 → 입력·마스크 좌우 정렬. 이 4 단계로 어떤 시계열도 MAE 가 학습 때 보던 형태로 변환된다. 그 안에 정보 손실은 있지만 MAE 의 강력한 시각 사전훈련 자산을 빌려 쓰는 비용."
