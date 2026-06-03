# 4-B. Multi-Patch-Size Projection — 주파수를 흡수하는 입출력층

## 왜 이 부분이 필요한가

PatchTST(Nie et al. 2023) 가 시계열 토큰화의 표준을 *patch* (예: 16 시점을 한 벡터로 사영) 으로 정착시켰지만, 단일 patch size 라는 hyperparameter 가 *그 데이터셋에 묶여 있다*. ETT(시간 단위)에 16, Traffic(시간 단위)에 32 처럼 데이터셋별 tune 가 일상. *Universal forecaster* 는 yearly 4 시점짜리 시계열과 second-level 86,400 시점짜리 시계열을 *한 모델*로 다뤄야 한다. 토큰 수가 균형 잡힐 수 있는 *frequency-adaptive patch size* 가 입출력층에 필요한 이유.

저자들의 명시적 동기 (§3.1.1):

> "opting for a larger patch size to handle high-frequency data, thereby lower the burden of the quadratic computation cost of attention while maintaining a long context length. Simultaneously, we advocate for a smaller patch size for low-frequency data to transfer computation to the Transformer layers, rather than relying solely on simple linear embedding layers."

즉 *고주파* = 데이터가 많으니 *큰 patch* (compute 줄이고 context length 늘림), *저주파* = 데이터가 적으니 *작은 patch* (Transformer 에서 충분히 modeling 하도록).

## 수식 / 구조

논문에 명시적 수식은 없다 (Appendix B.1 의 lookup table 만 존재). 구조적으로는 *patch_size $P \in \{8, 16, 32, 64, 128\}$ 5 종*에 대해 각각 *input projection $W_P^{in} \in \mathbb{R}^{P \times d_h}$* 와 *output projection $W_P^{out} \in \mathbb{R}^{d_h \times \theta_P}$* (여기서 $\theta_P$ 는 patch 안의 모든 시점의 mixture 분포 parameter 차원) 를 별도 학습.

입력 측: 한 patch $\mathbf{x}_{i:i+P} \in \mathbb{R}^P$ 에 대해

$$
\mathbf{h}_{patch} = W_P^{in} \mathbf{x}_{i:i+P} \in \mathbb{R}^{d_h}
$$

출력 측: hidden state $\mathbf{h}_{out} \in \mathbb{R}^{d_h}$ 에 대해

$$
\phi_{patch} = W_P^{out} \mathbf{h}_{out} \in \mathbb{R}^{\theta_P}
$$

**4줄 해석**:

1. **기호 뜻**: $P$ = patch 크기(시점 개수), $d_h$ = Transformer hidden dim, $\theta_P$ = 그 patch 의 forecast 분포 파라미터 차원 (예: 4-mixture, 분포당 평균 3 파라미터, weights c=4 → $\theta_P \approx P \times (4 \times 3 + 4)$).
2. **일상 비유**: *책장 한 칸에 5 종류 크기의 책꽂이*가 미리 끼워져 있다 — 두꺼운 책(고주파)은 큰 책꽂이, 얇은 책(저주파)은 작은 책꽂이. 책꽂이 하나당 사서 한 명이 전담, 다른 책꽂이 사서와 weight 공유 없음.
3. **왜 이 형태**: 단일 $W^{in}$ 으로 *임의 길이 patch* 를 받으려면 *interpolate / pad* 가 필요해 정보 손실 + 학습 시 noise. *고정 5종 size* 의 별도 weight 가 가장 단순하고 효과적. 5 라는 수는 Appendix B.1 의 freq-bucket 수와 일치.
4. **조심할 점**: (a) 5종 size 가 *전부* 인지 — 1024 patch (초고주파) / 2 patch (초저주파) 가 필요한 도메인은 미지원. (b) freq → patch_size 매핑이 *사전정의*: 새 freq (예: nano-second) 에 대한 합리적 매핑이 없음. (c) Patch 안의 시점은 *단순 linear* 만 거쳐 들어옴 — patch 내부 비선형성은 Transformer 첫 layer 가 담당.

## Appendix B.1 의 명시 lookup table (논문 부록)

저자들은 본문에 정확한 freq → patch_size 매핑을 명시하지 않고 "see Appendix B.1" 로 미루었다. (Appendix B.1 본문은 짧고 lookup 표는 다음 형태로 정리됨, 원문 정확 수치 확인 위치 = §B.1)

- Yearly / Quarterly: small patch (8)
- Monthly / Weekly: medium-small (16)
- Daily / Multi-Hourly (sparse): medium (32)
- Hourly: medium-large (64)
- Minute / Second-level: large (128)

이 매핑은 *공유 weight*: 만약 두 freq 가 같은 patch size 를 매핑받으면 동일 $W_P^{in}$ 을 사용. 예컨대 yearly 와 quarterly 가 모두 8 로 매핑되면 같은 weight 학습.

## 대안 디자인과의 비교

**대안 A — 단일 patch size + frequency embedding 추가**: ALiBi-식 frequency token 을 sequence 앞에 prepend. *효과*: 모델이 freq 를 토큰 단위로 학습. *부족*: attention 의 quadratic cost 가 고주파 데이터에서 폭발 (가장 critical 한 trade-off 가 보호 안됨).

**대안 B — 동적 patch size (input-conditioned)**: input 의 spectral content 를 보고 patch size 를 dynamically 선택. *효과*: 더 flexible. *부족*: 학습 안정성 저하, inference 시 latency 증가. 저자들 §5 Limitations 에서 "future work should design a more flexible and elegant approach" 라고 *직접* 이 디자인 한계를 시인.

**대안 C — Patch 자체 없이 시점-level token (Informer 식 ProbSparse)**: *효과*: patch 의 정보 손실 없음. *부족*: long-sequence 에서 attention cost 폭발. PatchTST 이후로 *patch* 가 long-sequence 의 표준이 된 이유.

저자들은 대안 A vs B 사이에서 *제일 단순한* 사전정의 lookup 으로 결정. Table 7 ablation 의 "w/o patch size constraints" (대안 A 방향) 가 0.655 → 0.720 (+10%) 으로 악화 — *제약 자체*가 효과를 만든다는 증거.

## 이 부분의 핵심 한 문장

**Multi-Patch-Size Projection 은 "freq 별 token 길이 차이를 입출력층에서 *완전히 흡수*해 Transformer body 가 freq-agnostic 으로 작동하게 만드는 격리장치"** 이며, 사전정의 5-bucket lookup 의 *단순성* 이 그 격리의 정확성을 보증한다. 한계는 그 lookup 의 *고정성* — §5 Limitations 에서 저자 자신이 "heuristic" 이라고 인정하는 부분.
