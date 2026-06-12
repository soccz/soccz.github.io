# 06 · 실험 해부

본 절은 5 개 도메인 + 6 개 figure-grade 실험 (Fig 2 ~ Fig 8) 의 식별·역할·의의를 산문으로 분해한다. 본문 PDF 미접근 → 정확한 수치 (정확도 %, loss 좌표, weight norm 절대값) 는 단정하지 않고, 각 실험의 *역할 (claim 의 어느 조각을 증명하는가)* 만 다룬다.

## 데이터셋 각각

### Teacher-student MLP (Fig 2)

- **어떤 데이터인가**: Teacher MLP 가 random init 후 고정되고, 임의의 입력에 대해 teacher 의 출력을 라벨로 사용. Student MLP 가 이 라벨을 학습.
- **왜 이 데이터가 본 논문의 주장에 적합한가**: 가장 *clean* 한 ground truth setup. teacher 가 데이터 분포를 정확히 정의하므로 "외운다 vs 일반화한다" 의 차이가 명확. LU mechanism 의 schematic level 증명용.
- **숨은 편향**: Teacher 가 MLP 인데 student 도 MLP — 같은 architecture family. depth 나 width 가 mismatched 일 때 LU 가 어떻게 바뀌는지는 본문 한계.

### Modular addition (Fig 6 & 8)

- **어떤 데이터인가**: $p$-modular addition. 입력 $(a, b)$, 출력 $c = (a+b) \bmod p$. Power et al. 2022 의 원조 setup. $p$ 는 보통 prime (예: 97).
- **왜 이 데이터가 본 논문의 주장에 적합한가**: Grokking 이 "처음 발견된" task 이므로 *역사적 baseline*. LU mechanism 이 원조 task 에서도 작동함을 보여야 가설의 사후 통합 (post-hoc unification) 으로서 정당.
- **숨은 편향**: $p = 97$ 같은 특정 prime + transformer/MLP 의 매우 특정한 architecture. Power et al. 의 phase diagram (4 regime) 과 본 논문의 LU 관점이 *정확히 같은 phase 의 다른 이름* 인지, 아니면 *다른 정보를 잡는지* 는 본문에서 명시적으로 distinguish 되어야 함 — 본 환경 미접근 → 단정 안 함.

### MNIST (Fig 3, Fig 7)

- **어떤 데이터인가**: 28×28 grayscale 손글씨 숫자 10 분류. 6 만 train + 1 만 test. (저자가 1k subset 같이 적은 데이터로 grokking induction 했을 가능성 — IMDb 의 1k 와 유사한 디자인 추정.)
- **왜 이 데이터가 본 논문의 주장에 적합한가**: 표준 ML 의 가장 친숙한 vision dataset 에서 grokking 시연. "algorithmic only 가 아니다" 의 가장 설득력 있는 증거.
- **숨은 편향**: MNIST 는 클래스 구조가 매우 단순 (linearly separable in pixel space 가까움) → grokking induction 에 필요한 *복잡도* 가 IMDb/QM9 보다 낮음. "MNIST 에서 grokking 되면 다른 vision 도 된다" 는 일반화는 별도 검증 필요.

### IMDb (Fig 4)

- **어떤 데이터인가**: 영화 리뷰 sentiment 2 분류. 5 만 review (25k train + 25k test) 가 표준. 저자는 *1k subset* 사용 (검색 verbatim).
- **왜 이 데이터가 본 논문의 주장에 적합한가**: Sequence 데이터 + LSTM 에서도 grokking 이 induce 됨을 보여서 *데이터 modality (이미지 → 텍스트)* 의 일반성을 시연.
- **숨은 편향**: 위 verbatim 인용: *"a (weak) grokking signal observed for large initializations when using 1k data, while no grokking is observed for standard initializations."* → IMDb 에서 grokking 은 *제한적 조건* 에서만, 그것도 "weak" 으로 묘사됨. 저자가 정직하게 약점을 표기한 것은 좋지만, 이 사실이 본문 표 / abstract 에서 어떻게 framed 됐는지 reader 주의가 필요.

### QM9 (Fig 5)

- **어떤 데이터인가**: 13 만 개의 작은 organic molecule (≤ 9 heavy atoms) 에 대한 12 가지 양자화학 property 회귀 (HOMO/LUMO/dipole 등). GCNN 으로 분자 graph 입력.
- **왜 이 데이터가 본 논문의 주장에 적합한가**: (a) 회귀 task — classification 외 다른 loss 형태 (MSE) 에서도 LU 가 보임. (b) graph 입력 — Euclidean 이 아닌 도메인. (c) 분자 — vision/language 와 완전히 다른 application area.
- **숨은 편향**: QM9 는 양자화학 community 의 표준 benchmark 지만 ML 의 표준 dataset 은 아님 → reviewer 가 QM9 setup 의 적정성을 별도 판단해야 함. 또 GCNN 의 *graph convolution layer* 가 정확히 어떻게 weight norm 의 *normalization 분포* 와 호환되는지 (graph normalization vs $L_2$ weight norm) 의 미묘한 mechanic 은 본문 디테일.

## 베이스라인 공정성

본 논문은 *비교 baseline 모델* 을 갖지 않는다. 비교 대상은 **본 모델의 다른 setup** — 표준 학습 vs sphere-projected 학습, 표준 init vs large init, weight decay 유무. 즉 **내적 비교 (within-paper ablation)** 가 본 논문의 주된 검증 방법.

이 점은 ML 논문 일반의 "다 ours 가 이김" 표 양식과 달라서 독자가 처음 보면 당황할 수 있지만, 본 논문의 contribution 이 *새 SOTA* 가 아니라 *현상의 universal mechanism* 임을 생각하면 자연스러운 setup. 다만 reviewer 가 "comparison 부재" 를 약점으로 지적할 가능성은 있음 — Davies 2023 (Unifying Grokking & DD) 와 같은 평행 가설과의 정량적 비교가 있다면 본문 강화 가능.

## 지표 선택

각 도메인의 표준 지표를 그대로 사용 (추정):

- **분류 task (MNIST, IMDb)**: accuracy (또는 cross-entropy loss).
- **회귀 task (QM9, teacher-student)**: MSE 또는 MAE.
- **mod-addition**: classification accuracy.

LU mechanism 의 *모양 (L vs U)* 은 loss 의 *상대값* 에 의존하지 지표 절대값에 의존하지 않으므로, 어떤 지표를 써도 L/U 자체는 동일하게 관찰되는 게 정상. 다른 지표 (예: NLL 대신 Brier score) 였다면 곡선의 *기울기* 는 바뀌지만 *형태 분류* 는 바뀌지 않는다.

## 주요 표·그림 해석

### Fig 1 — LU mechanism 도식 (추정 위치)

본 논문의 *대표 그림*. weight norm 축 위 L 자 train + U 자 test + Goldilocks zone (녹색 spherical shell) 의 schematic. 가설 한 장 요약. 본문 §1 또는 §2.

### Fig 3 (MNIST) — 첫 표준 ML 도메인 시연

MNIST 의 reduced landscape (L 자 + U 자) 가 실제로 측정됨. data size dependence — 작은 train set 에서 Goldilocks zone 의 폭/위치가 어떻게 변하는지의 sweep 가능성 (검색 카드: *"study the dependence on training data size"*).

### Fig 4 (IMDb) — 약한 signal 의 정직한 보고

LSTM 의 IMDb 분류. *standard init* 에선 grokking 안 나옴 → *large init + 1k data* 에서만 약하게. 가설의 한계를 자기 그림으로 보여 주는 것은 학술적으로 좋은 태도이고, 본 논문의 "induce 가능" framing 이 *universal occurrence* 가 아니라 *conditional induction* 임을 reviewer 가 정확히 읽도록 돕는다.

### Fig 5 (QM9) — 회귀 + graph 도메인의 LU

GCNN 의 reduced landscape 가 L · U 구조를 가짐. 회귀 task 에서도 작동함을 보임. 정확한 property (HOMO 인지 dipole 인지) 와 metric (MAE vs Hartree 단위 등) 은 본문 미접근.

### Fig 6 / Fig 8 (mod-addition) — 원조 task 의 LU 재해석

Power et al. 2022 의 원조 task 에서 LU mechanism 을 측정. Weight decay sweep 으로 grokking time $\propto \gamma^{-1}$ 관계 (정성) 가 관찰될 가능성 — 검색 카드의 "Small weight decay results in a huge generalization delay" 가 이 figure 의 보조 결과로 보임.

### Fig 7 (mnist-repr) — Representation 변화

mnist-repr 폴더 단독. weight norm 이 Goldilocks zone 으로 갈수록 hidden representation 의 구조가 어떻게 변화하는지 — 아마 manifold 차원이 적절히 줄거나 클래스간 separation 이 sharp 해지는 시각화. 본문 미접근으로 단정 안 함, 다만 abstract 의 "the emergence of representations" 가 이 figure 의 주제로 추정.

## Ablation — 저자가 일부러 넣은 것 / 숨긴 것

### 일부러 넣었을 것

- Weight decay sweep — $\gamma$ 값 변화에 따른 grokking time → $\gamma^{-1}$ 정성 관계 시각화. Claim 4 의 직접 증거.
- Initialization scale sweep — 큰 init vs 작은 init 에서 grokking gap 변화. Claim 2 의 dynamics 측면.
- Train data size sweep — 작은 dataset 에서 grokking 이 더 잘 induce 되는지. data size dependence (abstract 명시).

### 숨겼거나 약하게 표현한 것 (추정)

- *Standard init* 에서 IMDb 가 grokking 안 보이는 fact — *abstract* 에서는 "induce" 라는 다소 약한 표현으로 처리. 이건 단점이지만 본문 Fig 4 캡션에서 정직하게 명시한 것으로 추정.
- *Multi-seed 통계* — single run schematic 위주의 figure 가 많을 가능성. 가설이 정성적이라 single run 으로도 시연 의의가 있지만, reviewer 가 statistical robustness 를 요구하면 보강 필요.
- *Larger model / deeper network* 에서 LU 가 어떻게 변하는지 — 본문이 small/medium 모델 위주.

## 부록에 숨은 신호 (추정)

- 정확한 hyperparam grid (lr, batch size, weight decay range, init scale range)
- 각 도메인의 train fraction · sample size
- Reduced landscape 측정에서 sphere-projection 의 정확한 implementation 디테일 (project frequency, projection 후 gradient correction 여부)
- 어떤 dataset 에서 *L · U* 형태가 가장 sharp 한지의 정량 비교

이상 본문 미접근으로 단정 안 함.

## 수치 투명성

본 해체에서 단정한 *수치* 는 없다. 모든 정량 주장은 (a) 정성 관계 ($\gamma^{-1}$ 비례), (b) 형태 분류 (L vs U), (c) figure mapping (Fig N ↔ folder) 에 국한되며, 정확한 accuracy / loss 좌표 / $w_c$ 의 절대 값은 "원문 PDF 미보고" 로 처리한다.
