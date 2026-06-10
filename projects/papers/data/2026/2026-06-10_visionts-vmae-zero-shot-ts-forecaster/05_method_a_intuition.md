# 05 · 방법론 ① 큰 그림 (intuition)

## 배경 사다리

이 절을 이해하려면 ① **MAE (Masked Auto-Encoder) 가 자연 이미지를 패치 단위로 가리고 그 부분을 픽셀로 복원하는 self-supervised 방법** 이라는 것, ② **시계열은 1차원 신호이지만 주기 단위로 접으면 자연스럽게 2차원 격자가 된다** 는 것, ③ **MAE 가 처리하는 이미지 사이즈는 $224\times224$, 패치 사이즈는 $16\times16$ 이 표준** 이라는 것만 알면 된다.

## 한 문단 요약

VisionTS 의 전체 흐름은 6 단계로 깔끔하게 나뉜다 (`visionts/model.py` 코드 fragment summary 기반).

```
[1D 시계열 (context + horizon)]
   │
   ├─[1] Normalize (mean·std)
   │
   ├─[2] Reshape to 2D grid using periodicity p:  einops 'b n (p f) -> b n f p'
   │
   ├─[3] Resize to image (input_resize → 224×224 픽셀 그리드)
   │     · 다변량은 RGB 또는 공간 stack
   │
   ├─[4] Mask-align: 입력 영역 | 마스킹된 예측 영역 → horizontal concat → 한 장의 224×224 이미지
   │
   ├─[5] MAE encoder + decoder 가 마스크 영역을 픽셀 단위로 재구성
   │
   └─[6] Unpatchify → resize back → denormalize → 최종 예측 시계열
```

여기서 [1]·[6] 은 표준 RevIN 류 normalization 의 시계열판이라 익숙하다. [2]·[3]·[4] 는 본 논문의 인터페이스 발명. [5] 는 외부 (Facebook MAE) 가중치 그대로 import.

**핵심 통찰 한 줄**: "시계열을 그림으로 변환하는 단계 [2]~[4] 만 잘 디자인하면, 나머지는 이미 학습된 거대 모델이 알아서 해준다."

## 왜 단순한 디자인이 이긴다고 주장하나

본 논문의 단순함은 두 면에서 인상적이다.

### (i) Periodicity 외부 지정 = "TimesNet 의 FFT 자동탐지" 제거
TimesNet 은 FFT 로 top-k 주기를 찾아 다중 reshape 했다. VisionTS 는 그러지 않고 **데이터셋 메타에서 단일 주기를 받는다**. 이는 일견 후퇴 같지만, **ImageNet pretrained MAE 가 강력하므로 정교한 주기 발견 메커니즘 없이도 잘 통한다** 는 주장이 함의된다. 단순함이 transfer 자산을 살린다.

### (ii) RGB 색상은 다변량용, 단변량은 grayscale 평균
WebFetch 코드 summary: "Color encoding optionally maps variables to RGB channels; grayscale averaging recovers univariate output." 즉 단변량 forecast 의 경우 grayscale 한 채널만 쓰거나 RGB 출력을 평균. **단순한 채널 운용** 이 multivariate 와 univariate 모두 동일 파이프라인으로 통합되게 한다.

## 다른 길로 갔다면 어떻게 됐을까 (대조)

| 대안 디자인 | VisionTS 와의 차이 | 예상 trade-off |
|---|---|---|
| (A) FFT 자동 주기 탐지 (TimesNet 식) | periodicity 를 데이터에서 학습 | 더 일반화 가능 but 학습 가능 모듈 추가 → pretrained MAE 의 free-lunch 성격 깎임 |
| (B) Image augmentation 후 fine-tune 만 | zero-shot 포기 | 잘 통할 수 있으나 본 논문의 "공짜" 메시지 약화 |
| (C) Vision encoder 만 import + 새 decoder | decoder 도 학습 | training overhead ↑, MAE 의 inpainting 정렬 발상 깨짐 |
| (D) CLIP-vision / DINO encoder 사용 | encoder 가 contrastive | reconstruction objective 불일치 → inpainting 정렬 안 됨 → 추가 헤드 필요 |
| (E) Sliding window image stack 으로 sequence-of-images | image LM 또는 video model 식 | pretraining 도메인 불일치 (video data scarce), 본 논문 simplicity 깨짐 |

대조해 보면, **본 논문의 디자인은 "MAE 의 학습 목적 = inpainting" 을 그대로 살리는 minimal interface** 다. (A)/(C) 가 가장 강한 대안이며, 본 논문이 (A) 를 explicit 으로 비교했는지는 본문 표 미확인. 후속 VisionTS++ 가 vision MAE 의 **continual pretraining** 으로 (D) 식 변형을 시도한 점은 본 논문이 (D) 를 일부 인정한 셈.

## 이 절의 한 줄 요약

> "VisionTS = (시계열 → 2D 격자 → 224×224 이미지) **인터페이스 함수** 하나 + **얼린 ImageNet MAE 가중치** 하나. 그 외엔 없다."

이 단순함 자체가 **재현 가능성** 과 **mech interp 분석 용이성** 의 두 부수 이점을 만든다. 학습 가능한 새 모듈이 적기 때문에 attention motif 분석 (APF 류) 을 했을 때 "시계열이 MAE 의 어느 head 를 어떻게 자극하는지" 를 곧바로 추적할 수 있다. 09_my_research 에서 다시 다룬다.
