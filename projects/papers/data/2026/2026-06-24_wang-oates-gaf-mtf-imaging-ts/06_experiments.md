# 6. 실험 해부

## 6.1 데이터셋 — UCR Time Series Archive 20 종

### 6.1.1 어떤 데이터인가
**UCR Time Series Classification Archive** (Keogh et al. 2002 이후 계속 증축) 는 *시계열 분류 (TSC)* 의 *de facto standard benchmark*. 본 논문 시점 (2015) 에는 약 45 개 데이터셋이 포함됐고, 본 논문은 그 중 **20 개** 를 선정 (선정 기준은 본 환경 PDF 차단으로 미확인 — 일반적으로 *시계열 길이가 비슷한 그룹* 또는 *클래스 수 분포* 가 고른 그룹을 고르는 관행).

검증된 UCR 멤버 (외부 인덱스에서 언급된 것):
- **Gun Point** (motion capture, 2-class)
- **Coffee** (spectroscopy, 2-class — 저자 GitHub 의 `Coffee_ALL` 샘플 디렉토리 존재)
- **CBF, SwedishLeaf, ECG** 등 (외부 인덱스 보조)

**정확한 20 데이터셋 목록은 본 환경 PDF 차단으로 단정 안 함.**

### 6.1.2 왜 이 데이터가 적합한가
- TSC 의 *표준 평가셋* — 동시기 baseline 들이 모두 같은 데이터로 보고됨 → 직접 비교 가능.
- *짧은 시계열* (50~500 timestep) 이 많아 *$n \times n$ 이미지* 가 *50×50 ~ 500×500* 정도 → vision CNN 의 표준 입력 크기 (보통 32×32 ~ 256×256) 와 일치.
- 도메인 다양성 (motion / ECG / spectroscopy / industrial sensor) — 인코딩의 *도메인-편의 (domain-invariance)* 검증 가능.

### 6.1.3 숨은 편향 가능성
- **UCR 의 *짧은 시계열* 편향**: 본 논문이 *long-range dependency* 가 강한 시계열 (예: 전력 사용량의 *연 단위 주기*) 에서도 잘 작동할지는 unknown. 11 년 후 TimesNet/VisionTS 가 *Long-term TSF* 까지 확장한 건 이 한계의 보완.
- **선정 20 종이 cherry-pick 일 가능성**: 본문에서 *선정 기준* 을 명시했는지가 critical. 본 환경 미확인.
- **UCR 데이터셋들의 *Train/Test split 이 고정*** — 분산 측정이 어려운 구조. 본 논문이 *cross-validation 또는 multiple seed* 로 분산을 보고했는지는 미확인.

## 6.2 비교 baseline — 9 종

Abstract: "nine of the current best time series classification approaches".

**추정 baseline 목록** (2015 시점 TSC SOTA — 정확한 매핑은 PDF 차단):
1. **DTW-1NN** (Dynamic Time Warping + 1-Nearest-Neighbor) — TSC 의 영원한 baseline
2. **Fast Shapelet** (Rakthanmanon & Keogh 2013) — shapelet 후처리
3. **Learned Shapelet (LTS)** (Grabocka et al. 2014) — shapelet 학습화
4. **SAX-VSM** (Senin & Malinchik 2013) — 기호 양자화 + TF-IDF
5. **Bag-of-Patterns (BOP)** (Lin & Li 2009)
6. **TSBF (Time Series Bag-of-Features)** (Baydogan et al. 2013)
7. **RPCD (Recurrence Plot Compression Distance)** (Silva et al. 2013) — 본 논문과 *시계열-이미지* 분기의 직접 경쟁자!
8. **PROP (Proportional Elastic Distance)** (Lines & Bagnall 2014) — DTW 변형 앙상블
9. **COTE (Collective of Transformations)** (Bagnall et al. 2015) — 11 분류기 앙상블 SOTA

본 논문의 의의: *9 개 baseline 중 8 개가 손-설계 feature/distance* 이고 **1 개 (RPCD) 만 비-CNN 이미지화 접근** — 즉 본 논문은 *시계열-이미지* 분야의 *RPCD 다음 세대* 로 등장.

### 6.2.1 베이스라인 공정성
- *Published best* 를 가져왔다면 — *각 baseline 의 저자가 최적 hyperparameter* 를 보고했으므로 공정.
- *본 논문이 직접 재현* 했다면 — Tiled CNN 위의 GASF/GADF/MTF 와 baseline 의 *튜닝 노력* 이 *동등* 한지가 critical.
- 본문 PDF 차단으로 정확한 reporting protocol 은 단정 안 함.

## 6.3 지표 — 분류 정확도 (error rate)

UCR 의 표준 지표는 **classification error rate** (1 − accuracy). Win/tie/loss 카운트와 *Texas sharpshooter* 식 critical difference 다이어그램 (Demšar 2006) 이 관행. 본 논문이:
- 데이터셋별 error rate 표,
- 9 baseline 대비 win/tie/loss 카운트,
- *통계적 유의성* (Wilcoxon signed-rank test 또는 critical difference)

를 보고했을 것으로 추정되지만 정확한 표 위치와 수치는 본 환경 미확인.

### 6.3.1 왜 error rate 인가
- UCR 의 표준이라 *baseline 들과 직접 비교* 가능.
- 단점: *비균형 클래스* (예: 1:99 분류) 에서 *trivial classifier* 가 99% accuracy → error rate 가 *오해의 소지*. UCR 의 대부분 데이터셋은 *balanced* 라 큰 문제 없음.

### 6.3.2 다른 지표였다면 결론이 바뀌었을지
- **F1-score / AUC**: 비균형 데이터셋에서는 더 적합. 본 논문 시점에는 *UCR 의 균형성* 때문에 error rate 로 충분.
- **Macro F1**: 다중 클래스에서 각 클래스 동등 가중. UCR 일부 다중 클래스 데이터셋에서는 차이 가능.

## 6.4 주요 표·그림 (추정)

본문 PDF 차단으로 정확한 캡션·축·수치는 단정 안 함. 외부 인덱스 (ResearchGate / SemanticScholar / 다른 후속 논문의 인용) 에서 *언급* 된 그림:

1. **Figure 1** (추정): GASF/GADF/MTF 이미지의 *예시 시각화* — *시계열 → 폴라 좌표 시각화 → Gram 행렬 이미지* 의 3-패널 다이어그램. 본 논문의 *교과서적 이미지* 로 자주 후속 논문이 재인용.
2. **Figure 2** (확인): ResearchGate snippet "Pipeline of time series imputation by image recovery. Raw GASF → broken GASF → …" — imputation pipeline 의 시각적 설명.
3. **Figure 3 ~ 4** (추정): 분류 정확도 비교 표 / critical difference diagram.

## 6.5 Ablation — 저자가 일부러 넣은 것 vs 숨긴 것

**일부러 넣었을 것 (추정)**:
- *GASF 단독 vs GADF 단독 vs MTF 단독 vs 컴파운드 RGB* 의 *4-way ablation* — 인코딩 *상보성* 의 정량 측정.
- *Tiled CNN vs 표준 CNN* 비교 — *부분 공유 vs 완전 공유* 의 정당화.
- *PAA dimension* sweep — 차원 축소가 성능에 미치는 영향.

**숨겼을 가능성 (추정)**:
- *MTF 의 quantile 수 $Q$ sweep* — 보통 *single best $Q$* 만 보고하는 관행.
- *Tiled CNN hyperparameter (tile size, depth, channel) 의 데이터셋별 튜닝 여부*.
- *DA 의 layer 수 / hidden size* 의 imputation 분기 디테일.

## 6.6 부록에 숨은 신호 (추정 — 본 환경 미확인)

본 논문의 *진짜 가치* 는 부록에 있을 가능성이 높다. 추정:
- **GASF 의 *역변환 정확도*** 가 *noise level* 에 어떻게 의존하는지의 quantitative 결과.
- **RPCD vs GAF** 의 *시계열-이미지화 도구* 직접 비교 — 이게 가장 중요한 baseline 일 수 있음.
- **클래스별 평균 GAF 이미지** 의 시각화 — 각 클래스의 *prototypical 이미지* 가 어떻게 다른지.

## 6.7 수치 투명성 — 본 환경에서 단정 가능 vs 미확인

| 수치 | 단정 가능? | 출처 |
|---|---|---|
| 데이터셋 수 = 20 | ✓ | abstract verbatim |
| Baseline 수 = 9 | ✓ | abstract verbatim |
| Imputation MSE 감소 12.18% – 48.02% | ✓ | abstract verbatim |
| Imputation 데이터셋 수 = 4 표준 + 1 합성 | ✓ | abstract verbatim |
| 데이터셋별 error rate 수치 | ✗ | PDF 차단, 단정 안 함 |
| Win/tie/loss 카운트 | ✗ | PDF 차단 |
| Tiled CNN hyperparameter | ✗ | PDF 차단 |
| Quantile 수 $Q$ 디폴트 | ✗ | PDF 차단 |
| 4 imputation 표준 데이터셋 매핑 | ✗ | PDF 차단 |
| 합성 compound 데이터셋 구성 | ✗ | PDF 차단 |
| Statistical significance test 종류 | ✗ | PDF 차단 |

## 6.8 한 줄 결론

> "본 논문의 실험은 *abstract 의 2 숫자 (20 dataset, 9 baseline) + 1 범위 (12.18~48.02%)* 까지가 본 환경에서 확정적으로 단정 가능한 범위이고, 그 안의 *데이터셋별 세부 수치 · 인코딩 ablation · hyperparameter sensitivity* 는 본문 PDF 차단으로 추정만 가능 — 그러나 후속 11 년의 *수많은 인용 (578+) 과 후계 (TimesNet, VisionTS) 의 정착* 이 본 논문의 *실증적 유효성* 의 간접 증거."
