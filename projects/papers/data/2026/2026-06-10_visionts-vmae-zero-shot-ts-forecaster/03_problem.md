# 03 · 문제 지형도

## 배경 사다리 (먼저 알아야 할 3 개념)

이 절을 이해하려면 ① **TSF 데이터셋이 도메인마다 분포·스케일·주기가 다르다** 는 것, ② **foundation model 이란 일반적으로 한 도메인의 대규모 데이터로 한 번 훈련해두고 다른 작은 데이터로 fine-tuning 하거나 zero-shot 으로 푸는 모델** 이라는 것, ③ **MAE 라는 시각 사전훈련 패러다임은 이미지의 일부를 가리고 그 부분을 복원하도록 학습한다** 는 정도만 알면 된다. 셋을 한 번씩 풀어둔다.

- **TSF 분포 이질성**: 환율(낮은 주기, 큰 분산), 전력(일/주 주기 강함), 교통(요일 주기 + 휴일 효과), 매출(주·월·분기 다중 주기), 코로나 환자 수(non-stationary regime shift) — 같은 "시계열" 이지만 거의 다른 언어다. NLP 의 토큰이나 image 의 픽셀이 그래도 공통 어휘를 갖는 데 비해, 시계열은 "도메인이 어휘" 다.
- **TSF foundation model 의 두 줄기**:
  - (a) **TS-native 학습**: Chronos (TMLR 2024) / MOIRAI (ICML 2024) / TimesFM (ICML 2024) 등. 수천만~수십억 개 timestep 의 대규모 시계열 corpus(LOTSA, MONASH, 합성 등) 로 직접 사전훈련.
  - (b) **LLM 전이**: GPT4TS, Time-LLM, AutoTimes 등. 미리 학습된 LLM 의 입력층/출력층만 시계열 데이터로 조정. 텍스트 토큰을 통한 정보 매개라는 점에서 lossy.
- **MAE (He et al. CVPR 2022) 기본**: 이미지를 $16\times16$ 패치로 쪼개 75% 를 무작위 마스킹 → ViT encoder 는 보이는 25% 패치만 처리 → ViT decoder 가 mask token 자리에 픽셀 값을 재구성 → MSE 손실. 이 단순한 self-supervised 학습으로 ImageNet 분류 등 다양한 downstream 에 transfer 가능한 표현을 얻었다.

이 셋을 머리에 넣은 채 아래로 내려가자.

## 실제 현장의 문제 — 예시 3 개

### 예시 ① 신생 데이터셋, 학습 시계열 거의 없음
어느 자산운용사 (예: State Street 공저라는 본 논문 맥락) 가 새로운 alternative data — 위성 이미지에서 추출된 항만 활동 지수 시계열 — 을 받는다. 길이 18 개월, 일별 360 포인트, 다른 종류와 결합한 비슷한 시계열은 회사 내에 거의 없다. 이 신호로 다음 1 개월을 예측해야 한다. **Chronos / MOIRAI / TimesFM 같은 TS-native FM 은 사전훈련 코퍼스에 이런 도메인이 없어 zero-shot 성능이 들쭉날쭉**. 처음부터 모델을 새로 학습하기엔 데이터가 부족.

### 예시 ② 도메인 신뢰 부족 + 텍스트 LLM 의 lossy 인터페이스
응급실 입원 환자 수(시간당, 1 년)를 예측하려는 병원. 의사들은 "AI 가 잘 모를 의학적 맥락" 을 우려해 ChatGPT 같은 텍스트 LLM 에 숫자를 던지는 방식 (GPT4TS 류) 을 시도. 그러나 LLM 의 BPE tokenizer 는 숫자 "247" 을 "24" + "7" 로 쪼개 정보가 왜곡되고 (Chronos 가 명시적으로 다룬 문제), prompt 길이 제한이 long horizon 을 제약한다.

### 예시 ③ "이미 학습된 거대 모델" 이 다른 영역에 있는데 안 쓰는 손실
ImageNet pretraining 의 MAE encoder 는 약 300M+ 이미지 클립 (확장 버전) 으로 self-supervised 학습된 ViT-L/H 가중치를 공개. 이 가중치는 자연 풍경의 텍스처 / edge / 객체 보더 등을 잘 안다. 시계열을 "선이 그려진 그림" 으로 보면 그 안의 edge 가 trend, 텍스처가 noise/주기성, 도형 경계가 regime shift 와 정확히 같다 — 그런데 이 거대 사전훈련 자산을 시계열 쪽에서는 한 번도 본격적으로 끌어다 쓴 적이 없다.

세 예시 모두 "도메인 데이터는 부족한데 다른 도메인의 거대 사전훈련은 풍부하다" 는 비대칭을 공유한다.

## 기존 접근의 계보 (5 줄기)

본 논문 README 의 비교 대상 + WebSearch 인덱스에서 명시한 "surpassing Moirai, TimesFM, Chronos" 와 "few-shot text-based TSF foundation models" 를 근거로 5 줄기를 정리한다.

### 줄기 1 — 시계열 전용 transformer (PatchTST, iTransformer, Autoformer)
TSF 를 단변량 patch token / variate token 으로 trans-former 에 태우는 SOTA 베이스라인 군. **장점**: 단일 도메인에서 강함. **부족**: 도메인마다 처음부터 학습 필요, zero-shot 불가, foundation scale 학습 한 적 없음. 교훈: 도메인별 학습은 비용. (인덱스 05-06 iTransformer / 05-18 Autoformer / 05-19 PatchTST cover.)

### 줄기 2 — TS-native foundation model (Chronos, MOIRAI, TimesFM)
대규모 시계열 corpus(LOTSA 27B, MONASH, 합성 등) 직접 사전훈련. **장점**: zero-shot 가능. **부족**: 사전훈련 도메인 외에서 일반화 들쭉날쭉, multi-channel/probabilistic 등 작업별 추가 디자인 필요. 교훈: foundation 은 가능하나 시계열 분포 이질성을 정복 못 함. (인덱스 04-29 Chronos / 06-03 MOIRAI / TimesFM 미커버.)

### 줄기 3 — LLM 전이 (GPT4TS, Time-LLM, LLM4TS)
사전훈련 LLM 의 토큰 임베딩에 시계열을 mapping. **장점**: 텍스트 도메인의 풍부한 표현 활용 가능 주장. **부족**: numerical fidelity 손실 (BPE), LLM 의 prompt 길이 한계, "정말로 LLM 이 TS 를 푸는가 아니면 그냥 큰 헤드일 뿐인가" 의 회의(Tan et al. NeurIPS 2024 "Are LMs Actually Useful for TSF?"). 교훈: cross-domain transfer 가능성은 보였지만 매개체가 lossy. (인덱스 priority Tan 2024 — 미커버.)

### 줄기 4 — TS-as-2D (TimesNet, GAF/MTF)
시계열을 직접 2D image 로 만들어 2D CNN 으로 처리. TimesNet (ICLR 2023) 은 FFT 로 top-k 주기 탐지 → reshape → Inception 2D CNN → 적응 집계. **장점**: 시간 변동의 2D 구조(intra-period + inter-period) 직접 활용. **부족**: 이미지화 후에도 **모델 자체는 처음부터 학습** 한다. 즉 image domain pretraining 의 거대 자산을 빌리지 못함. 교훈: TS↔image 의 인터페이스는 풀었지만 transfer 까지는 가지 못함. (인덱스 05-13 TimesNet cover.)

### 줄기 5 — Vision pretraining 의 TS 전이 (본 논문 + 동시기 연구)
ImageNet MAE / DINO / CLIP-vision 의 가중치를 시계열 영역에 끌어다 쓰는 idea. 본 논문 외에 동시기 후속 "Time Series Representations for Classification Lie Hidden in Pretrained Vision Transformers" (arXiv:2506.08641), "OccamVTS" (arXiv:2508.01727), "IMTS is Worth Time×Channel Patches" (arXiv:2505.22815, IMTS 용 VMAE) 등 (WebSearch 인덱스 확인). 본 논문이 이 줄기의 ICML 2025 mark 다.

## 공통 gap 한 문장

> "기존 5 줄기는 모두 **(a) 시계열 도메인 사전훈련** 또는 **(b) 텍스트 도메인 사전훈련** 중 하나를 끌어쓰는 데 머물렀고, **이미 풍부하게 존재하는 image 도메인 사전훈련 자산을 TSF 에 직접 transfer 하지 못했다.**"

## 본 논문의 메우는 방식

VisionTS 는 줄기 4 (TimesNet 식 TS-as-2D 의 인터페이스 발상) + 줄기 5 (vision pretrained MAE 의 가중치 활용) 를 합쳐서, **하나의 단순한 절차 — "시계열을 이미지로 그려 MAE 의 inpainting 으로 푼다" — 로 image domain pretraining 의 자산을 TSF 에 직접 끌어온다.** 다만 본 논문이 "vision pretraining 의 TS 전이" 라는 줄기의 첫 mark 인지는 아니다(arXiv:2506.08641 등은 classification 측 동시기 시도). 본 논문의 핵심은 **forecasting 으로의 inpainting-as-prediction 정렬** 이다.
