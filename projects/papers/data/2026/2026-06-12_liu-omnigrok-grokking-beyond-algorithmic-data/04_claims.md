# 04 · 핵심 Claim 해체

본 논문의 주장을 4 개로 분해한다. 각 Claim 은 (a) 주장 한 문장 / (b) 증거 위치 (원문 PDF 미접근 → 추정 + 본 환경에서 확인된 보조 소스 표기) / (c) 숨은 전제 / (d) 무배경 독자용 쉬운 말 풀이.

---

## Claim 1 — Grokking 은 algorithmic 데이터 한정 현상이 아니다

**주장**: Modular arithmetic 같은 algorithmic dataset 에서만 보였던 grokking (train 100% 후 한참 뒤 test 가 갑자기 generalize 하는 phase transition) 은 *image · text · molecule* 등 표준 ML 데이터셋에서도 induce 가능하다.

**증거 위치**: 
- 본문 §4–§5 (추정). GitHub README 의 6 folder 구조 — `mnist/`, `imdb/`, `qm9/`, `mod-addition/`, `teacher-student/`, `mnist-repr/` — 가 각 도메인을 대표.
- Figure 매핑 (저자 README + 검색 카드): Fig 2 (teacher-student), Fig 3 (MNIST), Fig 4 (IMDb), Fig 5 (QM9), Fig 6 & 8 (mod-addition), Fig 7 (mnist-repr).
- WebSearch verbatim: "An LSTM is used to predict IMDb reviews, with a (weak) grokking signal observed for large initializations when using 1k data, while no grokking is observed for standard initializations." (= IMDb 의 grokking 은 *제한적 조건* 에서만 — large init + 1k data — 관찰됨을 저자 본인이 표기)
- Abstract verbatim 마지막 문장: *"Guided by the intuitive picture, we are able to induce grokking on tasks involving images, language and molecules."*

**숨은 전제**:
1. "Grokking" 의 정의가 phase transition 의 *모양* (loss 곡선의 갑작스러운 점프) 으로 통일된다는 전제. 그러나 "약한 signal" (IMDb) 까지 grokking 으로 묶으면 정의가 느슨해지고, "어느 정도면 grokking 인가" 의 임계가 사후적으로 정해질 위험.
2. 다섯 도메인의 model architecture (MLP / LSTM / GCNN / transformer) 가 다른데도 LU mechanism 이 공통이라는 전제 — depth · activation · attention 의 영향이 weight norm 축으로 압축된다는 강한 가정.

**쉬운 말 풀이**: "수학 문제집만 외운 다음 갑자기 푸는 줄 알았더니, 사진·영화 리뷰·분자 데이터에서도 같은 일을 시킬 수 있더라." 단, "어떤 조건 (큰 초기값, 적은 데이터) 에서만 잘 보임" 도 같이 인정한다.

---

## Claim 2 — LU mechanism: weight norm 축 위 L 자 train + U 자 test 의 mismatch 가 grokking 의 원인

**주장**: 가중치 norm $w \equiv \|w\|_2$ 를 x 축으로 하고 reduced train loss 와 test loss 를 그리면, train loss 는 $w$ 가 작을 때 매우 높고 어떤 임계 $w_c$ 를 넘으면 매우 낮은 **L 자**, test loss 는 $w_c$ 부근에서 가장 낮고 양 옆에서 다시 올라가는 **U 자** 모양이 된다. 두 곡선의 *형태 불일치* 가 grokking 을 만든다.

**증거 위치**: 
- 본문 §2 또는 §3 (추정). Fig 1 / Fig 3 의 schematic + MNIST 패널이 LU 모양을 직접 보여 줌 (저자 README "Figure 3 (MNIST)" mapping + 검색 카드 "Loss landscapes of MNIST are visualized to verify the LU mechanism").
- WebSearch verbatim: "training loss has an L-shape, with many overfitting solutions for w > w_c but high training losses for w < w_c" 및 "The test loss forms a U-shape (higher both when w > w_c and w < w_c)".

**숨은 전제**:
1. **Reduced landscape 가 의미 있다** 는 전제. 즉, $\|w\|$ 를 고정한 채 나머지 자유도 (방향) 에서 optimal 을 잡았을 때의 loss 가 실제 학습 dynamics 의 *attractor* 를 잘 근사한다는 가정. 고차원 비등방성 (anisotropy) 이 크면 이 축 한 개로 압축 못 한다.
2. **$w_c$ 가 존재하고 dataset/model 에 대해 잘 정의된다** 는 전제. 실제로는 train loss 의 L 자 corner 와 test loss 의 U 자 minimum 이 정확히 같은 $w_c$ 일 필요가 없다 — 두 임계 사이의 간격 자체가 grokking 의 강도 (gap) 와 관계 있을 가능성.

**쉬운 말 풀이**: "다이얼 크기를 한 줄로 늘어놓고 점수를 그리면, 외운 점수는 다이얼이 커지면 갑자기 좋아지고 (L 자), 진짜 실력 점수는 다이얼이 중간일 때만 좋다 (U 자). 두 그림의 어긋남이 외운 뒤에 한참 헤매다 깨우치는 이유다."

---

## Claim 3 — Goldilocks zone: $\|w\| \approx w_c$ 의 spherical shell 에서만 generalize 한다

**주장**: 고차원 가중치 공간에서 generalize 하는 해는 norm 이 $w_c$ 근처인 **얇은 구면 껍질 (spherical shell)** 에만 존재한다. 이 zone 을 저자들은 Goldilocks zone — "너무 크지도 작지도 않은 딱 좋은 띠" — 라 명명. 이 zone 밖의 해는 overfit (norm 큰 쪽) 이거나 underfit (norm 작은 쪽).

**증거 위치**:
- 본문 §3 (추정). Fig 1 의 도식 (저자 README 의 "Figure 1" + Semantic Scholar figure index 에 도식 캡션) + Fig 7 (mnist-repr) 의 representation 변화 패널.
- WebSearch verbatim: "Omnigrok identifies a spherical shell in weight space called the 'Goldilocks zone,' where generalization is better than outside this zone. The Goldilocks zone is illustrated as a green area with average radius w_c."

**숨은 전제**:
1. **Norm 만 중요하고 방향은 상대적으로 덜 중요** 하다는 강한 단순화. 즉 generalize 하는 해의 집합이 *방향에 대해 대략 균질* 하다고 가정. (현실에서는 특정 방향이 더 generalize 하는 anisotropic case 가 흔하다 — 예: low-rank 구조.)
2. **Spherical shell 의 두께** (Goldilocks zone 의 width) 가 dataset · model 에 따라 *비-zero 의 유한한 폭* 으로 잘 정의된다는 전제. 두께가 너무 좁으면 weight decay 가 zone 을 지나쳐 버릴 위험, 두께가 너무 두꺼우면 generalize 와 overfit 의 경계가 모호.

**쉬운 말 풀이**: "다이얼 크기 = 반지름 이라 보면, 진짜 실력은 양파 껍질 한 켜에만 산다. 너무 두꺼우면 외우고 (overfit), 너무 얇으면 모르고 (underfit), 딱 그 한 켜에 들어와야 안 본 문제도 푼다."

---

## Claim 4 — Grokking time 은 weight decay 의 역수에 정성적으로 비례한다

**주장**: Weight decay 계수 $\gamma$ 가 작을수록 학습이 norm 큰 overfit 영역에서 Goldilocks zone 까지 "radial drift" 하는 시간이 길어지고, 따라서 grokking 의 delay (train 도달 → test 도달 사이 step) 는 대략 $\gamma^{-1}$ 의 함수가 된다. 큰 weight decay 는 즉시 generalize, 작은 weight decay 는 huge generalization delay.

**증거 위치**:
- 본문 §3 또는 §4 (추정). Fig 6 또는 Fig 8 (mod-addition) 의 weight decay sweep 패널.
- WebSearch verbatim: "Small weight decay results in a huge generalization delay (grokking), as the time to generalize is proportional to γ^(-1)."

**숨은 전제**:
1. **Radial drift 가 단조 (monotonic)** 라는 전제 — weight 가 한 번 overfit 영역으로 들어간 뒤에 다시 Goldilocks zone 으로 돌아오는 경로가 단순 직선 (norm 축 위 1D 이동) 으로 잘 근사된다는 가정. 실제로는 angular drift (방향 회전) 도 동시에 일어남.
2. **$\gamma$ 가 너무 크면 generalize 가 지나쳐 underfit** 으로 가야 하는데, abstract 에는 그 한쪽 끝에 대한 언급이 없음. 즉 본 가설은 "$\gamma$ 가 충분히 작은 regime" 에서만 정성 관계가 성립한다는 묵시적 한정.

**쉬운 말 풀이**: "다이얼을 크기 줄이는 힘 (weight decay) 이 약하면, 외운 자리에서 딱 좋은 자리까지 굴러가는 데 한참 걸린다. 그 시간이 바로 grokking 의 늦음. 굴려 주는 힘을 두 배로 세게 하면 굴러가는 시간은 절반."

---

## Claim 간 위계 — 어디까지가 핵심인가

- **Claim 2 (LU mechanism)** 이 *원인 가설* 의 본체. 나머지는 따라온다.
- **Claim 3 (Goldilocks zone)** 은 Claim 2 의 기하학적 표현 — "두 곡선의 교차" 를 "spherical shell" 로 격상.
- **Claim 4 ($\gamma^{-1}$ 의존성)** 은 Claim 2 + Claim 3 의 dynamics 예측.
- **Claim 1 (Omnigrok)** 은 Claim 2 가 universal 임을 보이기 위한 *시연 contribution* — 5 도메인 실험이 모두 Claim 2 가 데이터/모델에 robust 임을 증명하는 보조 증거.

저자들의 framing 상 Claim 2 가 거짓이면 Claim 1·3·4 모두 흔들리고, Claim 2 만 살아도 Claim 4 의 정량 관계는 따로 검증해야 한다 (정성 vs 정량 의 갭).
