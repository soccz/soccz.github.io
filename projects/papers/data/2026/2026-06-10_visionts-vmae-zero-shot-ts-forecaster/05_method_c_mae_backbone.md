# 05 · 방법론 ③ MAE 백본 — 무엇이 얼려 있고 무엇이 작동하는가

## 배경 사다리

이 절을 이해하려면 ① **Vision Transformer (ViT) 가 이미지를 패치 단위로 토큰화한 뒤 transformer 로 처리** 하는 모델이라는 것, ② **MAE 의 encoder 는 마스크되지 않은 패치만 입력받고, decoder 는 마스크 토큰을 채워 픽셀을 복원** 한다는 비대칭 구조라는 것, ③ **He 2022 (CVPR) 가 원조 논문** 이라는 것만 알면 된다.

이 절은 `visionts/models_mae.py` 의 `MaskedAutoencoderViT` 정의를 verbatim summary 로 분해한다.

---

## MAE 의 클래스 정의 (코드 fragment summary)

```python
class MaskedAutoencoderViT(nn.Module):
    def __init__(self,
        img_size=224, patch_size=16, in_chans=3,
        embed_dim=1024, depth=24, num_heads=16,
        decoder_embed_dim=512, decoder_depth=8, decoder_num_heads=16,
        mlp_ratio=4., norm_pix_loss=False, quantile=False):
        ...
```

**3 변형** (코드 정의):

| 변형 | encoder embed_dim | encoder depth | encoder heads | decoder embed_dim | decoder depth | decoder heads | patch_size |
|---|---|---|---|---|---|---|---|
| Base | 768 | 12 | 12 | 512 | 8 | 16 | 16 |
| Large | 1024 | 24 | 16 | 512 | 8 | 16 | 16 |
| Huge | 1280 | 32 | 16 | 512 | 8 | 16 | 14 |

**관찰**:
- **decoder 는 모든 변형에서 동일** (512 / 8 / 16). 이는 He 2022 원조와 같다 — encoder 만 커지고 decoder 는 가볍게 둠.
- **Huge 만 patch_size=14**. 224/14 = 16 → num_patch = 256 (다른 변형의 14×14=196 보다 많음). 더 fine-grained.
- 시계열 측에선 어느 변형을 권장하는지는 README 의 표/그림에서 확인하면 가장 정확하나 본 환경에선 PDF 표 미확인. 통상 Large 가 vision MAE 표준 권장이며 VisionTS GitHub 코드 default 도 그것으로 보인다.

---

## 무엇이 얼려 있고 무엇이 작동하는가

본 논문의 zero-shot 주장은 "추가 학습 0" 이라는 의미다. 코드 인터페이스에서 보면:

| 구성 | 사전 학습 | 시계열 학습 | zero-shot 추론 |
|---|---|---|---|
| `MaskedAutoencoderViT.patch_embed` (Conv2d 1×1 stride 16) | ImageNet pretrained | freeze | 그대로 적용 |
| `pos_embed` (sinusoidal 2D fixed) | non-learnable (sinusoidal) | n/a | 그대로 적용 |
| `cls_token` | learnable (ImageNet trained) | freeze | 사용 (또는 무시 — 본문 확인 불가) |
| Encoder blocks (24 layer × MSA + FFN, GELU) | ImageNet pretrained | freeze | 그대로 적용 |
| Decoder embed projection (1024→512) | ImageNet pretrained | freeze | 그대로 적용 |
| Decoder blocks (8 layer × MSA + FFN) | ImageNet pretrained | freeze | 그대로 적용 |
| Decoder head (Linear → patch pixel) | ImageNet pretrained | freeze | 그대로 적용 |
| VisionTS 의 normalization 상수 `norm_const=0.4` | n/a | 고정 hyperparam | 그대로 적용 |
| `periodicity` | n/a | 외부 지정 (데이터셋 메타) | 그대로 적용 |

**결론**: VisionTS 의 zero-shot 경로에 학습 가능 파라미터는 0 개다. 모든 가중치는 (a) ImageNet MAE 사전훈련 가중치 (b) 정해진 하이퍼파라미터 둘 중 하나.

Fine-tuning 경로 (Claim 4) 에는 encoder + decoder 의 일부 또는 전부 학습 가능하게 풀어주는 옵션이 있을 것으로 추정되나, 본 환경에서 본문 표 미확인이라 단정 안 함. 코드의 `finetuning strategy` 인자가 어떻게 동작하는지는 demo.ipynb 셀이 필요 (본 환경에서 noteboook 차단됨).

---

## Patch embedding 의 의미

코드: `nn.Conv2d(in_chans=3, embed_dim=1024, kernel_size=16, stride=16)`

즉 입력 이미지 $224\times224\times3$ → $14\times14$ 위치 × $1024$ 채널 = 196 토큰 시퀀스. 시계열 측으로 해석하면:

- 가로(phase) 14 × 세로(frame) 14 의 격자 안에서 **각 16×16 픽셀 영역이 하나의 토큰** 이다.
- 시계열 reshape 가 $f \times p$ 격자였으므로, 격자 → 224×224 → 14×14 토큰 의 두 번의 변환을 거친다. 이때 한 토큰이 다루는 영역의 시간 폭은 $(T/14) \times 16/16 = T/14$ 시점 정도 (정확한 매핑은 input_resize 의 보간에 따라 다름).
- ETT-h1 (시간단위, $T_{ctx}=336, T_{pred}=96$, $T=432$ 라면) → 토큰 1 개 = 약 30 시점 = 1.25 일 분량. 이게 본 논문의 implicit "패치 = 1.25 일 의 시간 윈도우" 라는 해석.

이건 PatchTST (인덱스 05-19) 가 명시적으로 한 작업 — 단변량 시계열을 patch 단위로 토큰화 — 과 정확히 같다. 차이는 **PatchTST 는 patch_size 가 hyperparam (보통 16) 이고 학습 데이터로 직접 학습하는 transformer 인 반면, VisionTS 는 patch_size=16 이 vision pretrained 로 고정** 이라는 점.

---

## Decoder 의 비대칭 디자인

He 2022 원조 MAE 의 핵심 발견은 "decoder 를 작게 만들어도 (depth 8 / embed 512) 픽셀 재구성에는 충분" 이라는 것. 본 논문은 이걸 그대로 받음.

**시계열 관점에서 의미**:
- Encoder 가 입력 시계열의 **context window 표현** 을 압축.
- Decoder 가 **horizon (마스크 영역)** 의 픽셀 = 시계열 값 을 한 번에 재구성.
- 즉 forecasting 의 "예측 헤드" 는 ViT decoder 자체이고, 이는 시계열 도메인의 어떤 학습된 정보도 받지 않는다.

이게 본 논문의 가장 충격적인 부분이다: **시계열 예측 헤드가 이미지 픽셀 재구성 헤드와 동일하게 학습된 채로 시계열에 그대로 통한다**. APF 관점에서 보면 decoder 의 cross-attention 패턴이 input 영역 ↔ horizon 영역으로 흐르는 방식이 그대로 시계열 forecasting 의 "과거 → 미래" 정보 흐름과 일치한다는 가설.

---

## 다른 backbone 으로 했다면?

| 대안 backbone | 차이 | 예상 결과 |
|---|---|---|
| CLIP-vision encoder | contrastive 학습 (이미지-텍스트 alignment) | 픽셀 재구성 헤드가 없어 추가 학습 필요 → free-lunch 깨짐 |
| DINO/DINOv2 | self-distillation (정렬된 dense feature) | reconstruction head 없으므로 같은 문제 |
| SAM (Segment Anything) | mask decoder 학습됐으나 binary mask 출력 | 픽셀 재구성 호환 안 됨 |
| SAR-CLIP / 위성영상 사전훈련 | 자연 이미지 외 distribution | 시계열 통계와 더 가까울 수도 (연구 idea) |
| ViT supervised (ImageNet-1k 분류 학습) | decoder 없음 | 동일 문제 |

**결론**: **MAE 만이 "encoder + decoder + 픽셀 재구성 헤드" 의 완전 정렬을 학습된 채로 가지고 있다.** 그래서 본 논문이 MAE 를 택한 건 backbone 선택 자유의 결과가 아니라 **inpainting-as-forecasting 정렬의 강제** 였다.

이 관찰은 후속 연구가 "다른 vision foundation model 로도 같은 게 가능한가?" 를 물을 때 본 논문의 답이 "MAE 외 backbone 은 reconstruction head 가 없어서 그대로 못 한다" 임을 가리킨다.

## 이 절의 한 줄 요약

> "MAE 의 encoder + decoder + 픽셀 재구성 헤드, 이 셋이 한 묶음으로 학습돼 있다는 점이 본 논문이 backbone 자유도가 없는 이유이자 free-lunch 가능한 이유다."
