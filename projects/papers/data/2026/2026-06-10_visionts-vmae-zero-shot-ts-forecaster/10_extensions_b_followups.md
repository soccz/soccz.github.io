# 10 · 사고 확장 (b) — Follow-up 논문 3 편

본 논문의 위와 아래로 3 편 추천. 선행 1 / 경쟁 1 / 후속 1 의 구조.

---

## Follow-up 1 (선행) — He, Chen, Xie, Li, Dollár, Girshick 2022 "Masked Autoencoders Are Scalable Vision Learners" (CVPR 2022, arXiv:2111.06377)

**어떤 논문인가**: VisionTS 의 backbone 그 자체. 인코더 25% 만 보고 디코더가 75% mask 를 픽셀로 복원하는 self-supervised 학습. ViT-L/H 가 ImageNet 분류·detection·segmentation 모두 supervised pretrain 보다 잘함을 입증.

**본 논문과 어떤 관계인가**: 이 논문 없이 VisionTS 가 작동하지 않는다. `visionts/models_mae.py` 의 `MaskedAutoencoderViT` 정의 (embed_dim=1024, depth=24, num_heads=16, decoder_embed_dim=512, decoder_depth=8, decoder_num_heads=16, mask 75%) 는 He 2022 와 동일. VisionTS 의 모든 zero-shot 성능은 He 2022 가 학습한 가중치에서 옴.

**무엇을 얻을 수 있는가 (내 연구 측)**:
1. APF 가 cross-modal 확장을 할 때, **He 2022 의 ablation** (encoder depth, decoder depth, mask ratio sweep) 을 직접 활용 가능. He 2022 는 "decoder depth=8 이 충분" 을 보였는데, 시계열 측에서도 같은 ablation 으로 확인하면 본 논문의 transfer 가 어디까지 가는지 정량화.
2. He 2022 의 **block-wise mask 실험 (Table 2c)** 이 본 논문의 contiguous mask 와 직접 연결. He 2022 는 block-wise 가 random 보다 어렵다고 보고. 본 논문이 contiguous block (= 가장 어려운 form) 에서도 transfer 가 통한다는 게 발견인지 우연인지의 단서.
3. 5 줄 강의용 — APF / Grokking 페이퍼의 §2 (Background) 에 "MAE 의 자기지도 학습이 픽셀 단위 복원 목적과 ViT 의 토큰 단위 표현이 직접 연결되는 점이 본 연구의 cross-modal 확장 가능성을 시사" 의 인용 핵심.

**파일로 두는 자리**: APF 페이퍼의 must_cite.md "Vision foundation MAE backbone" 칸으로 등록. Grokking 페이퍼에는 "representation utility 의 self-supervised 사례" 칸.

---

## Follow-up 2 (경쟁) — Tan, Kim, Spangher, Beery, Liang 2024 "Are Language Models Actually Useful for Time Series Forecasting?" (NeurIPS 2024)

**어떤 논문인가**: LLM-based TSF (GPT4TS, Time-LLM, LLMTime, LLaMA-2 등) 의 실제 효용에 대한 회의 연구. LLM 의 weight 를 무작위 ablation 했을 때 성능이 거의 떨어지지 않음을 보임 → LLM 의 사전훈련 정보가 TSF 에 직접 기여하지 않는다는 강한 명제.

**본 논문과 어떤 관계인가**: **직접 경쟁 / 비판 paper**. Tan 2024 가 "LLM transfer 는 비효율적" 이라고 비판한 후, VisionTS 는 "vision transfer 는 효율적" 이라고 주장. 두 논문의 핵심 갈래는:
- Tan 2024: cross-modal pretraining transfer 는 lossy interface (BPE 텍스트화) 때문에 의미 없다.
- VisionTS: cross-modal pretraining transfer 는 reconstruction objective 정렬 + 픽셀 직접 인터페이스 덕분에 효과적.

만약 두 주장이 모두 맞는다면, **정렬되는 cross-modal 전이 (image inpainting) 와 정렬되지 않는 cross-modal 전이 (텍스트 next-token) 의 두 paradigm 이 다른 결과를 낸다** 는 통합 narrative 가 가능.

**무엇을 얻을 수 있는가 (내 연구 측)**:
1. APF 가 cross-modal 확장을 할 때, **Tan 2024 의 ablation 방법론 (weight 무작위 → 성능 측정)** 을 VisionTS 의 MAE encoder/decoder 에 동일하게 적용. **결과가 다르게 나온다면** (vision pretrain 은 ablate 했을 때 성능 떨어짐) cross-modal 전이의 paradigm 차이가 실증됨.
2. Grokking 페이퍼의 §6 (discussion) 에 "cross-modal pretrained representation 의 task-utility 가 모달리티에 따라 다르다 (Tan 2024 vs Chen 2024)" 인용.
3. P1 ProTran-TFA 의 finance venue 측 narrative — "vision pretrain 은 retail/sales 같은 visual-pattern 도메인에서 효율적이나, 금융 자산 수익률은 vision 도메인과 거리가 멀어 ProTran-TFA 의 시계열 native 사전훈련이 우위" 라는 강한 motivation.

**파일로 두는 자리**: `_index.md` priority 목록의 "TS Transformer baselines" 칸에 이미 등록 (미커버, 향후 코어/원거리 버킷 선정 후보).

---

## Follow-up 3 (후속) — VisionTS++ (Chen et al. arXiv:2508.04379, 2025-08, 동일 저자)

**어떤 논문인가**: VisionTS 의 본격 확장. "Cross-Modal Time Series Foundation Model with Continual Pre-trained Visual Backbones". ImageNet MAE 를 시계열 corpus (LOTSA + Monash + 추가) 로 **continual pretraining**. multi-channel (≥4 변수) + probabilistic forecasting (quantile head). Salesforce + Zhejiang 합작.

**본 논문과 어떤 관계인가**: 본 논문의 한정 영역 (univariate / point) 을 정면 풀음. 본 논문 = "ImageNet MAE → TS 직접 적용", VisionTS++ = "ImageNet MAE → TS continual pretrain → multi-channel + probabilistic". 즉:
- 본 논문: **frozen vision backbone** + 정렬된 inpainting 의 강점.
- VisionTS++: **vision backbone + 시계열 continual pretrain** 의 hybrid.

**무엇을 얻을 수 있는가 (내 연구 측)**:
1. P1 ProTran-TFA 의 baseline 비교에 VisionTS 와 VisionTS++ 를 동시에 추가. zero-shot (VisionTS) vs few-shot (VisionTS++) 의 양극단을 한 표에서 비교.
2. APF 의 cross-modal motif 분석에서 **frozen vs continually-trained backbone 의 motif 변화** 측정. continual pretrain 이 어떤 motif 를 추가/제거하는지가 APF 의 PE-motif 결정성 주장의 더 정밀한 검증.
3. **금융 응용 측**: VisionTS++ 의 quantile forecasting 이 Walmart sales 에서 잘 작동한다면, 자산 수익률에도 적용 가능성. State Street 공저 라인이 P1 ProTran-TFA finance venue 와 자연 연결.

**파일로 두는 자리**: `_index.md` priority 의 새 칸 "Cross-modal TSFM (VisionTS family)" 신설 후보. 또는 ts-transformer-baseline 의 추가 행.

---

## 3 편의 종합 정리

```
  [선행]              [본 논문]           [경쟁]            [후속]
 He 2022 MAE   ──→   VisionTS    ←──    Tan 2024 LLM 비판
   (CVPR)         (ICML 2025)         (NeurIPS 2024)
                       │
                       ↓
                  VisionTS++
                  (2025-08, multi-channel + probabilistic)
```

이 4 노드의 **3 변** (He→VisionTS, Tan→VisionTS, VisionTS→VisionTS++) 위에 내 연구 라인 3 개 (APF, Grokking, P1 ProTran-TFA) 를 얹으면:

- **APF**: 4 노드 모두 motif 분류기로 측정 가능 (frozen vs trained, vision-pretrained vs LLM-pretrained vs TS-native).
- **Grokking**: He 2022 의 self-supervised representation utility + Tan 2024 의 transfer 회의 + VisionTS 의 frozen transfer → 3 paradigm 의 representation spectrum.
- **P1 ProTran-TFA**: VisionTSpp 의 quantile head 가 가장 직접적인 baseline. Tan 2024 의 LLM 회의가 finance 측 motivation 강화.

각 follow-up 한 편당 3 가지 사용처 — 인용 (paper text), 베이스라인 (실험 표), 자료 (must_cite.md) — 가 명확하다.
