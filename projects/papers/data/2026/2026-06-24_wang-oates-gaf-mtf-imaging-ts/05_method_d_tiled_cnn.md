# 5.D 방법론 ④ Tiled CNN 학습기 — 왜 *완전 공유* 가 아니라 *부분 공유* 인가

## 5.D.1 이 부분이 왜 필요한가

GASF/GADF/MTF 이미지는 *일반 사진* 과는 다른 통계적 구조를 가진다. 일반 ImageNet 사진은 *translation-equivariant* (고양이가 어디 있어도 같은 고양이) 가 잘 맞아 *모든 위치에서 같은 conv kernel 가중치* 를 공유 (full weight sharing) 하는 *표준 CNN* 이 자연스럽다. 그러나 GAF 격자의:

- *대각선 영역* (짧은 lag) 에서 보이는 패턴 (예: *high diagonal value cluster*) 과
- *모서리 영역* (긴 lag) 에서 보이는 패턴 (예: *block-like long-range coupling*)

는 *서로 다른 의미* 를 가진다. 같은 *blob* 모양이라도 *어디에 있는지* 가 결정적. 즉 GAF 의 *공간적 의미* 는 *translation-invariant 가 아니다*.

이 *위치-의존* 통계를 잡기 위해 본 논문은 **Tiled CNN (Le et al. 2010, NIPS)** 를 채택. Tiled CNN 의 핵심: **타일 (tile) 안에서만 weight sharing**.

## 5.D.2 Tiled CNN 의 정성 정의

표준 CNN 의 한 conv layer 는 모든 위치에서 *하나의 필터* $w \in \mathbb{R}^{k \times k}$ 를 공유한다. Tiled CNN 은 입력을 *$s \times s$ 크기의 타일* 로 나누고, 각 타일에 *서로 다른 필터* 를 적용:

$$y[i, j] \;=\; w_{\,\text{tile}(i, j)} \,\star\, x_{\,\text{patch}(i, j)}$$

여기서 $\text{tile}(i, j)$ 는 픽셀 $(i, j)$ 가 속한 타일 인덱스, $\text{patch}(i, j)$ 는 그 픽셀 주위의 receptive field.

**4 줄 해석**:
- **기호 뜻**: $w_{\,\text{tile}(i, j)}$ = 해당 타일의 conv kernel, $\star$ = 합성곱 연산.
- **일상 비유**: 학교 교실을 *4 사분면으로 나누고 각 사분면에 다른 선생님 배치*. 좌상단 사분면 학생은 좌상단 선생님 스타일, 우하단 학생은 우하단 선생님 스타일에 따라 평가받는다.
- **왜 이 형태**: GAF 의 *대각선/모서리 의미 차이* 를 *각 타일이 다른 필터* 로 학습 → translation-invariance 의 강한 가정을 *완화*. 동시에 *완전 독립 필터* (per-pixel weight) 의 *overparameterization* 도 피함.
- **조심할 점**: *타일 크기* $s$ 와 *타일 수* 가 결정적 hyperparameter — 본 논문이 어떤 값을 썼는지 본 환경에서는 미확인. 또 *padding* 정책, *pooling* 종류는 본문 PDF 차단으로 단정 안 함.

## 5.D.3 Tiled CNN 의 학습 (Le et al. 2010 의 원형)

원형의 Tiled CNN 은 **Topographic ICA (TICA)** 의 *unsupervised pre-training* 으로 가중치를 초기화한 후 *supervised fine-tuning* 한다. *Mahjiang 식 weight sharing* 으로 *receptive field 가 작은 타일 안의 비슷한 위치들* 만 가중치를 공유, *멀리 떨어진 위치는 서로 다른 가중치* 를 학습.

본 논문이 *unsupervised pre-training 을 그대로 채택했는지* (TICA pretrain 포함) 또는 *supervised only fine-tuning* 만 했는지는 본 환경에서 PDF 차단으로 정확한 단정 안 함. 단 저자 GitHub 코드 (`serie2QMlib.py` + `serie2GAF.py` + `serie21MTF.py`) 가 *데이터 변환* 위주이고 *학습기* 자체의 디테일은 별도 directory (코드 보관 위치 미확인) 에 있을 것으로 추정.

## 5.D.4 대안 학습기와의 비교 (논문이 안 다룬 가설적 대안)

| 대안 | 차이점 | 예상 동작 |
|---|---|---|
| **표준 CNN (full weight sharing)** | 모든 위치에서 같은 필터 | GAF 의 *대각선 vs 모서리* 구분이 흐려져 *조립된 패턴* 학습 불가. 단 데이터 양이 충분하면 *암묵적으로* 학습할 수도 있음. |
| **완전 독립 (per-pixel) MLP** | 각 픽셀에 다른 가중치 | Overparameter, 일반화 안 됨. 작은 UCR 데이터셋에서 즉시 과적합. |
| **2D ResNet** (2015년 직후 SOTA) | 잔차 연결 + full sharing | 본 논문 시점에는 막 등장. 후속 연구가 *시계열-이미지 위 ResNet/VGG/DenseNet* 변형으로 확장 (Jiang 2018, Hatami 2018 등). |
| **Graph Conv (GCN)** | 격자 → 그래프, 이웃 정의 명시 | 본 논문 이후 RP-GCN (recurrence plot + GCN) 류로 확장. *비-격자* 거리 함수에 강하지만 GAF/MTF 의 *해석 가능 위치* 의미를 잃음. |

## 5.D.5 한 문장 정리

> "Tiled CNN 은 GAF/MTF 격자의 *위치-의존적 의미* (대각선=짧은 lag, 모서리=긴 lag) 를 *전체 공유 conv* 보다 더 잘 잡도록 *타일 단위 부분 공유* 를 도입한 학습기 — 즉 본 논문의 *학습기 선택* 도 *데이터 표상의 기하학* 에 맞춰져 있다."
