# 10.C 사고 확장 ③ — 실험 아이디어 2 개

## Idea 1 — *GASF-Attention Alignment Probe* (APF 핵심 가설 직접 검증)

### 가설
**Learned TS Transformer 의 일부 attention head 는, 충분히 학습된 후 *입력 시계열의 GASF 격자* 와 *spatial 구조적으로 정렬 (aligned)* 된다.**

이 가설은 두 형태로 분해:
- **약한 형 (correlation hypothesis)**: head 별 attention map $A^{(\ell, h)}(X)$ 와 GASF $G^{\text{S}}(X)$ 의 Pearson correlation $\rho^{(\ell, h)}(X)$ 가 *random baseline (e.g., uniform attention)* 보다 *유의하게 높은 head 가 적어도 1 개* 존재.
- **강한 형 (causal hypothesis)**: 그 *GASF-aligned head* 의 attention 을 *$G^{\text{S}}(X)$ 로 직접 교체* 해도 모델 출력 (예측 loss) 이 *유의하게 변하지 않는다*.

### 데이터
- **Long-term TSF 7 데이터셋** (ETTh1, ETTh2, ETTm1, ETTm2, Weather, Electricity, Traffic) — Tan 2024 ablation 격자와 직접 비교 가능 substrate.
- **UCR 분류 20 데이터셋** (본 논문 원래 평가셋 — *시간 충분 시 추가*).

### 비교 조건
| 모델 | PE 종류 | 학습 task |
|---|---|---|
| PatchTST | sinusoidal | TSF |
| iTransformer | learnable | TSF |
| Chronos-T5-Small (frozen) | T5 relative | Zero-shot forecasting |
| VisionTS (frozen MAE) | 2D positional | Zero-shot forecasting |

### 실험 절차
1. 각 모델 × 데이터셋 조합에서 *test set 100 sample* 에 대해 *모든 (layer, head) 의 attention map* 추출.
2. 동일 sample 의 GASF 계산 (PAA 로 attention dim 과 일치).
3. *Pearson $\rho^{(\ell, h)}$, SSIM, EMD* 의 3 metric 으로 attention-GASF similarity 측정.
4. *Random shuffle baseline*: GASF 의 *행/열 random permutation* 후 같은 metric 계산 → null distribution.
5. *Causal intervention*: top-1 GASF-aligned head 의 attention 을 GASF 로 교체 → loss 변화 측정.

### 예상 결과
- **약한 형 (correlation)**: *Low layer (l = 1, 2) 의 *content-based head* (특정 RoPE freq channel) 에서 $\rho > 0.3$ 이 *재현 가능* 하게 발생. *High layer* 에서는 task-specific 정보 우세로 GASF 와 멀어짐.
- **강한 형 (causal)**: 약 30~50% head 에서 GASF 교체가 *loss 변화 < 5%* — 즉 *그 head 는 implicit GASF computer*. 나머지 head 는 *비-GASF 정보 (e.g., task-specific token mixing)* 를 학습.

### 반증 조건 (이 가설을 *기각* 하는 결과)
- 모든 모델 × 모든 head 에서 $\rho^{(\ell, h)} \leq$ random baseline → *attention 이 GASF 와 무관하게 학습됨* → APF 의 *data-grid alignment 가설* 자체 기각.
- 또는: $\rho$ 가 높은 head 라도 *causal intervention* 에서 loss 변화 *큼* → *correlation ≠ causation*, *attention 은 GASF 닮은 패턴을 *부수적* 으로 만들 뿐 *실제 계산* 은 다른 정보 기반*.

### 비용 추정
- 모델 추론 4 × 데이터셋 7 × 100 sample × 4 metric: GPU 4 hour (A100).
- Causal intervention: 추가 GPU 2 hour.
- 구현: pyts GAF + transformers attention hook = 300 줄 PyTorch.
- 총 1 주 (분석 + figure 작성 포함).

### 출판 잠재력
- APF main paper §4 또는 §5 의 *기준 검증 실험* 으로 직접 사용.
- TMLR / NeurIPS Workshop "Mechanistic Interpretability for TS" 단독 short paper 가능.

---

## Idea 2 — *GASF + Frozen Vision Backbone for Zero-Shot UCR Classification* (VisionTS 일반화)

### 가설
**VisionTS 가 *주기성-친화적 reshape* + frozen MAE 로 zero-shot forecasting 을 보였다면, *GASF + frozen ImageNet pretrained CNN* 으로 *주기성-무관* zero-shot UCR 분류가 *학습 0 epoch* 또는 *최소 linear-probe* 만으로 *전통적 학습 baseline 의 80%+* 성능을 낼 수 있다.**

### 데이터
- **UCR Archive 의 20~30 데이터셋** (본 논문 원래 평가셋 + UEA 의 다변량 일부).
- **시계열 길이 $n \leq 500$** 의 *short TS* 에 우선 집중.

### 비교 조건
| Baseline | Encoding | Backbone | Training |
|---|---|---|---|
| **DTW-1NN** | raw | none | none |
| **본 논문 (재현)** | GAF/MTF | Tiled CNN | full training |
| **Wang 2017 FCN 1D** | raw | FCN 1D | full training |
| **GASF + ResNet50 (frozen) + linear probe** | GASF | frozen ImageNet ResNet50 | linear head only |
| **GASF + ViT-Base (frozen) + linear probe** | GASF | frozen DINOv2 ViT-B | linear head only |
| **GASF + MAE-Base (frozen) + zero-shot** | GASF | frozen ImageNet MAE-B | zero training, k-NN on embedding |

### 실험 절차
1. 각 UCR 데이터셋에서 train/test split (standard).
2. *Train* 시계열을 GASF 변환 (PAA reduce to $128 \times 128$ for ImageNet input).
3. Frozen vision backbone 에서 *embedding* 추출 (penultimate layer).
4. Linear probe (logistic regression) 학습 또는 k-NN classification (zero-shot).
5. *Test* 시계열도 같은 pipeline 으로 분류.
6. *공정성*: 모든 baseline 의 *training compute budget* 보고.

### 예상 결과
- **Zero-shot k-NN**: UCR 의 *비주기 단순* 데이터셋에서는 DTW-1NN 근처 또는 약간 우월.
- **Linear probe**: *FCN 1D full training* 의 70~85% 성능 — *0 epoch 학습으로 이만큼* 이라는 점이 *transfer learning* 의 가치 증명.
- **Frozen MAE > Frozen ResNet50**: MAE 의 *masked reconstruction* 학습이 GASF 의 *symmetric 격자* 와 더 친화적.

### 반증 조건
- 모든 frozen baseline 이 DTW-1NN 보다 *현저히 떨어짐* → *ImageNet 의 비전 표현이 GASF 격자에 *전이 가치 없음* → *VisionTS 의 free-lunch* 가설이 *주기성에 한정* 됨을 보임.
- 또는: Frozen MAE 가 ResNet50 과 *유사* 한 성능 → *MAE 의 masked 학습이 *시계열 변종에 특별히 잘 맞지 않음* → VisionTS 의 성공이 *주기성 reshape* 의 효과지 *MAE 백본* 의 효과 아님.

### 비용 추정
- Frozen backbone 추론 (no training): GPU 6 hour (전체 UCR 20~30 데이터셋 × 3 backbone).
- Linear probe 학습: CPU 1 시간 / 데이터셋 × 30 = 30 시간 (병렬 가능).
- 구현: pyts + timm 라이브러리 = 200 줄 PyTorch.
- 총 5 일 (분석 + figure).

### 출판 잠재력
- TMLR / ICLR workshop "Foundation Models for Time Series" 단독 short paper.
- VisionTS 의 *주기성-한정* 자리를 *주기성-무관 (GASF)* 으로 확장하는 직접 기여.
- 사용자의 *APF + tsfm-interp* literature 에 새로운 항목 추가.

---

## 두 아이디어의 공통 substrate

두 실험 모두 *학습 없이 또는 최소 학습으로* — *외생적 결정론적 격자 (GASF) 가 *현대 vision 모델* 의 *학습된 표현* 과 어떻게 관계 맺는지* 를 정량적으로 측정. **Idea 1** 은 *학습된 attention 안에 implicit 한 GASF 가 있는가* (interpretability), **Idea 2** 는 *frozen vision 모델이 GASF 를 명시적으로 받아 잘 처리하는가* (transferability). 두 결과가 합쳐지면 — APF 의 *motif typology* 가 *외생적 격자 라이브러리 (GAF/MTF/recurrence plot/PE)* 의 *학습된 mixture* 라는 *통합 가설* 의 검증 substrate 완성.
