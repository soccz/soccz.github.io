# 05 · 방법론 ④ 추론·미세조정·구현 디테일

## 배경 사다리

이 절을 이해하려면 ① **`unpatchify` 가 ViT 의 patch 토큰 시퀀스를 다시 원래 이미지 grid 로 펼치는 inverse 연산** 이라는 것, ② **시계열 RevIN 류 정규화는 inference 끝에 역연산해 원 스케일을 복원** 한다는 것, ③ **fine-tuning 1 epoch 이 시계열에서는 통상 100~1000 배치 정도** 라는 것만 알면 된다.

이 절은 추론 경로 (단계 [5]~[6]) + 미세조정 옵션 + 구현 디테일을 본 환경에서 확인 가능한 코드 fragment 와 `run.py` 기본값 verbatim 으로 정리한다.

---

## [5] MAE forward — 마스크 영역의 픽셀 재구성

코드 fragment summary (model.py + models_mae.py):

```python
# Image input: (B, 3, 224, 224)
# 1. Patchify (Conv 1×1 stride 16): -> (B, 196, 1024) tokens
# 2. Apply mask: keep input-region tokens, replace prediction-region tokens with mask_token
# 3. Encoder (24-layer ViT): -> (B, 196, 1024) — note: in original MAE, encoder only sees unmasked tokens; in VisionTS forward, the mask alignment is per-patch contiguous
# 4. Decoder projection: 1024 -> 512
# 5. Decoder (8-layer): -> (B, 196, 512)
# 6. Decoder head: Linear(512, patch_size² * 3) -> (B, 196, 768)  # 16*16*3 = 768 for patch_size=16
# 7. Unpatchify: reshape back to (B, 3, 224, 224)
```

**핵심 차이 (vs He 2022 원조 MAE)**:
- He 2022 학습: **인코더는 25% 만 입력**, 디코더는 75% mask token 채움.
- VisionTS inference: **인코더가 모든 196 패치를 입력** 받되 mask 영역의 토큰은 mask_token 으로 대체. 또는 인코더 입력에서 빠지고 decoder 에서만 추가. 본 환경에서 forward path 의 정확한 implementation 은 model.py 의 라인 단위 미확인.

이 차이는 mech interp 에선 중요하다. 만약 인코더에 mask token 이 들어간다면 attention 패턴이 "보이는 토큰끼리 + mask 토큰이 보이는 토큰 query" 같은 비대칭이 생기고, APF 의 motif 분석 시 stripe/checker pattern 이 생길 가능성이 있다 (09_my_research 에서 다룸).

---

## [6] 역변환 — 이미지에서 시계열로 복원

코드 fragment summary:

```python
# After MAE forward: pred_image (B, 3, 224, 224)
# 1. input_resize_inverse: 224×224 -> (f, p) original grid
# 2. einops.rearrange(grid, 'b n f p -> b n (p f)'): 2D -> 1D (T_pad length)
# 3. unpad to length T = T_ctx + T_pred
# 4. denormalize: x_hat = x_norm * (sigma * norm_const + eps) + mu
# 5. Slice prediction window: y_hat = x_full[..., T_ctx:]
```

**4 줄 해석**:
1. **기호 뜻**: $f, p$ 는 단계 [2] 의 reshape 차원, `T_pad` 는 패딩 후 길이, `T_ctx + T_pred` 는 실제 시계열 길이. `mu, sigma` 는 정규화 통계.
2. **일상 비유**: 친구가 채운 그림을 다시 표로 풀고, 표를 한 줄로 펴고, 원래 단위(예: 섭씨 기온, 원화 매출액)로 변환하는 것.
3. **왜 이 형태**: 단계 [1]~[4] 의 정확한 역연산. 어떤 임의 변환을 끼우면 정렬이 깨지므로 invertible 함수만 사용.
4. **조심할 점**: input_resize 가 비-invertible (예: down-sampling) 이면 역연산이 손실 있음. 224×224 → 원 격자로 돌릴 때 보간 noise 가 예측 값에 더해짐. 본 환경에서 input_resize 의 정확한 함수 (Nearest? Bilinear? AdaptiveAvgPool? interpolate?) 는 model.py 라인 단위 확인 안 됨.

---

## Fine-tuning 옵션

코드 `VisionTS.__init__(finetuning_strategy=...)` 인자에서 명시. 본 환경 미확인 옵션값 후보 (일반 deep learning 관행 + GitHub README 의 4-grade 평가 그룹 추론):

1. **freeze_all**: zero-shot 그대로. 학습 가능 0.
2. **linear_probe**: decoder head 의 마지막 Linear 만 학습. 시계열 도메인 fine-tune 의 최소 단위.
3. **decoder_only**: decoder 전체 (8 layer) 만 학습. encoder freeze.
4. **end_to_end**: 전체 encoder + decoder 학습. Full-shot 그룹에서 가장 좋은 성능 기대.

본 논문 README 가 "with fine-tuning for one epoch" 이라고만 명시한 점에서 통상 (3)~(4) 중간 옵션을 의미할 가능성. 학습률 `lr=1e-4` (run.py default), `batch_size=32`, `train_epochs=10, patience=3` (early stopping) 으로 보면 1 epoch 만에 수렴한다는 건 transfer learning 의 강한 사전훈련을 가리킴.

---

## 구현 디테일 (run.py defaults — verbatim summary)

```python
# Optimization
parser.add_argument('--learning_rate', type=float, default=0.0001)
parser.add_argument('--batch_size', type=int, default=32)
parser.add_argument('--train_epochs', type=int, default=10)
parser.add_argument('--patience', type=int, default=3)
parser.add_argument('--lradj', type=str, default='type1')  # cosine/step/etc.

# Model (residual from TSlib base; not all used by VisionTS)
parser.add_argument('--d_model', type=int, default=512)
parser.add_argument('--n_heads', type=int, default=8)
parser.add_argument('--e_layers', type=int, default=2)
parser.add_argument('--d_layers', type=int, default=1)
parser.add_argument('--dropout', type=float, default=0.1)

# Task
parser.add_argument('--task_name', choices=['long_term_forecast','short_term_forecast',
                                            'imputation','anomaly_detection','classification'])
parser.add_argument('--features', choices=['M','S','MS'])  # multivariate-to-multivariate, etc.

# VisionTS specific (inferred from model.py)
periodicity, mae_arch ∈ {'base','large','huge'}, finetuning_strategy, norm_const=0.4
```

이 default 들은 본 논문이 **TSlib (Time-Series-Library, github.com/thuml/Time-Series-Library)** 의 fork 위에서 작동함을 명시한다. README 가 그 점을 "Built on Time-Series-Library, MAE, and GluonTS frameworks" 로 적시.

`d_model=512, n_heads=8, e_layers=2, d_layers=1, dropout=0.1` 은 TSlib 의 일반 base transformer 인자라 VisionTS 자체 모델에는 직접 적용되지 않으나, baseline (예: iTransformer, TimesNet) 의 통일된 학습 조건을 보장한다 — fair comparison 측면.

---

## 의사코드 (전체 흐름 정리)

```
def visionts_zero_shot_forecast(x_ctx: Tensor[T_ctx], T_pred: int, p: int) -> Tensor[T_pred]:
    # [1] Normalize
    mu, sigma = x_ctx.mean(), x_ctx.std()
    x_norm = (x_ctx - mu) / (sigma * 0.4 + 1e-5)

    # [2] Reshape with periodicity
    T_total = T_ctx + T_pred
    f = ceil(T_total / p)
    x_pad = pad(x_norm, total_len=f*p)  # zeros or repeat
    x_2d = einops.rearrange(x_pad, '(f p) -> f p')

    # [3] Render to 224x224
    image_input = input_resize(x_2d, target=(224, 224))  # bilinear/etc.
    image_input = stack_to_rgb(image_input)  # (3, 224, 224)

    # [4] Mask alignment
    num_patch_input = round(T_ctx / T_total * 196)
    mask = make_horizontal_mask(num_patch_input, total_patch=196)
    image_masked = apply_mask(image_input, mask)  # mask_ratio computed

    # [5] MAE forward
    image_pred = mae_model(image_masked, mask)  # (3, 224, 224)

    # [6] Inverse
    pred_2d = input_resize_inverse(image_pred, target=(f, p))
    pred_1d = einops.rearrange(pred_2d, 'f p -> (f p)')[:T_total]
    pred_denorm = pred_1d * (sigma * 0.4 + 1e-5) + mu
    return pred_denorm[T_ctx:]  # last T_pred values
```

이 의사코드는 정확한 model.py 라인을 옮긴 게 아니라 코드 fragment summary 와 README 발췌를 합쳐 재구성한 것이다. 정확한 implementation 은 PyPI `visionts` 패키지의 `VisionTS.forward` 를 직접 확인해야 한다.

## 이 절의 한 줄 요약

> "추론 = MAE forward + 정확한 역변환 6 단계. 새로 학습되는 파라미터는 zero-shot 경로에서 0 개. fine-tuning 도 1 epoch 면 충분하다는 게 본 논문의 transfer 강도 주장."
