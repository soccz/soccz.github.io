# 02 · 3층 TL;DR

## 🧒 초등학생 수준 (수식 0)

옛날 옛적에, "시계열 예측" 이라는 일이 있었다. 매일의 기온, 매월의 매출, 매시간의 전기 사용량처럼 **숫자가 시간 순서로 길게 늘어선 줄** 을 보고 **다음 칸을 맞히는** 일이다. 이걸 잘하려고 사람들은 두 가지 큰 방법을 만들었다.

첫째는 **글자 모델 (큰 언어모델, LLM)** 에게 숫자를 말로 바꿔 던지는 방법. "어제 24, 오늘 25, 그럼 내일은?" 하고 ChatGPT 같은 친구한테 물어보는 셈이다. 둘째는 **시계열 전용 큰 모델** 을 처음부터 따로 만드는 방법. 큰 시계열 도서관을 모아서 그것만 외워두게 한 것.

VisionTS 의 발상은 깜짝 놀라운 제 3 의 길이다.

> "시계열을 **그림으로 그려서**, **풍경 사진을 잘 보는 친구** 한테 그 그림을 마저 그리라고 시키자."

좀 어이없을 수 있다. 주가 차트는 그림이지만 그게 풍경 사진과 같다고? 그런데 잘 생각하면 주가 차트도, 매출 그래프도, 기온 곡선도, 사람이 종이에 그리면 결국 **밝고 어두운 픽셀의 격자** 가 된다. 그리고 풍경 사진을 잘 보는 친구(MAE: Masked Auto-Encoder, ImageNet 으로 미리 훈련된 시각 모델)는 **그림의 일부를 가린 뒤 나머지를 보고 가린 부분을 채워 넣는 훈련** 만 받았다. 그러니까 "오른쪽 절반이 비어 있는 차트" 를 주면, 그 친구는 자기가 평생 보던 풍경 사진 채우듯이 차트의 뒷부분을 채워 넣는다 — 그게 곧 미래 예측이 된다.

놀라운 점은 이 친구는 **숫자나 차트로 단 한 번도 따로 훈련받지 않았는데** 도 잘한다는 것이다. 이래서 제목이 "공짜 점심" 이다. 풍경 사진 보던 사람한테 시계열 예측을 부탁했더니 그냥 잘 해버린, 그런 이야기다.

## 🎓 학부생 수준 (인라인 수식·기호 풀이 포함)

VisionTS 는 ICML 2025 에서 발표된 시계열 예측 (Time Series Forecasting, TSF) 모델이다. 핵심 발상은 **TSF 를 image inpainting 문제로 재구성** 하는 것이다. 입력 시계열 $\mathbf{x} \in \mathbb{R}^{T_{ctx}}$ (길이 $T_{ctx}$ 의 과거 관측값) 와 예측 horizon $T_{pred}$ 가 주어지면, 다음 절차로 처리한다.

1. **정규화**: 평균을 빼고 norm_const(=0.4)로 표준편차를 스케일링한다. 코드 fragment: `means = x.mean(1, keepdim=True).detach()` (출처: `visionts/model.py` 코드 summary).
2. **2D 격자화 (periodicity-aware reshape)**: 길이 $T = T_{ctx}+T_{pred}$ 의 1D 신호를 주기 $p$ (`periodicity` 하이퍼파라미터) 로 잘라 $T = pf$ 형태의 2D 격자 $(f, p)$ 로 재배치한다. 코드: `einops.rearrange(x_pad, 'b n (p f) -> b n f p', f=self.periodicity)`. 여기서 $f$ 는 frame 수(시간축 위), $p$ 는 한 주기 내 위상.
3. **이미지화**: 그 격자를 PIL 이미지 사이즈 $224 \times 224$ (MAE 기본 입력 사이즈) 로 `input_resize()` 리사이즈. 다변량의 경우 변수를 RGB 채널이나 공간적으로 쌓는다.
4. **마스킹·정렬**: 입력 영역 (왼쪽) + **예측 영역에 해당하는 픽셀을 마스크 토큰으로 채운** 영역 (오른쪽) 을 horizontal concat 으로 한 장의 $224 \times 224$ 이미지로 합친다. 마스크 비율 $r = \frac{\text{num\_patch} - \text{num\_patch\_input}}{\text{num\_patch}}$.
5. **MAE 재구성**: ImageNet pre-trained `MaskedAutoencoderViT` (Base: 768/12/12, Large: 1024/24/16, Huge: 1280/32/16; 모두 decoder 512/8/16) 가 마스크 영역을 픽셀 수준으로 재구성한다. 재구성된 픽셀을 `unpatchify` 해 원래 격자로 펼친 뒤 다시 1D 로 풀어내고, 정규화를 역연산해 최종 예측 $\hat{\mathbf{y}} \in \mathbb{R}^{T_{pred}}$ 를 얻는다.

**용어 풀이**: MAE (Masked Auto-Encoder, He et al. CVPR 2022) = 입력 이미지의 75% 정도를 무작위 패치로 가리고 나머지로 가린 부분을 픽셀-MSE 로 재구성하도록 ViT 를 자기지도 학습시킨 모델. ImageNet 1.3M 이미지로 사전 훈련됨. ViT (Vision Transformer, Dosovitskiy et al. ICLR 2021) = 이미지를 $16 \times 16$ 픽셀 패치로 잘라 토큰으로 만들고 trans-former 로 처리하는 구조.

저자 주장: **VisionTS 는 어떤 시계열 데이터로도 따로 훈련받지 않은 채(zero-shot) 로, 텍스트 기반 TSF foundation model (Chronos · GPT4TS 계열) 과 TS 기반 foundation model (MOIRAI · TimesFM) 을 능가하거나 동등한 성능을 보인다** (README 의 Key Result + GIFT-EVAL 2024-11 #1 ranking). 1 epoch fine-tuning 만 거치면 대부분의 long-term TSF 벤치마크에서 SOTA 를 갱신한다.

## 🔬 전문가 수준 (contribution 압축)

본 논문의 명시적·암묵적 contribution 을 정리한다 (논문 본문 직접 미확인 → README + 코드 + WebSearch verbatim 발췌 기반).

**Contribution 1 — Cross-modal pretraining bridge 의 존재 증명.** Image MAE 의 픽셀 재구성 능력을 시계열 영역으로 **추가 시계열 학습 없이** transfer 시킬 수 있음을 실증. 기존 cross-modal 시도(LLM → TSF, e.g. GPT4TS) 가 텍스트 토큰 인터페이스에서 정보 손실을 겪던 한계를, "TS 를 image space 에 직접 임베딩" 으로 우회.

**Contribution 2 — Inpainting-as-forecasting reformulation.** 예측 horizon 을 image inpainting 의 mask region 으로 정렬해 MAE 의 학습 목적과 inference 목적을 정확히 일치시킨다 (출처: `model.py` 의 horizontal concat to $224\times224$ + mask_ratio 계산식). 이는 GPT4TS 의 "텍스트화 후 다음 토큰 예측" 보다 픽셀 차원이 직접 출력층에 노출되는 점에서 더 잘 align 된다.

**Contribution 3 — 4-grade large-scale benchmark verification.** Long-term TSF (6 데이터셋) + Monash forecasting archive (29 데이터셋, 자동 다운로드 파이프라인) + probabilistic forecasting (LTSF 6 + Walmart/Istanbul Traffic/Turkey Power 3 proprietary) + Full-shot (8 long-term, 전체 학습 데이터). 이 grade 화는 zero-shot / fine-tuned / full-shot 세 setting 의 transition 을 정량 비교한다 (README 의 evaluation 단락).

**Contribution 4 — Periodicity 를 외부 하이퍼파라미터로 인정.** 코드 `forward` 에서 `periodicity` 는 FFT 자동 탐지가 아니라 **외부에서 받는 정수** 다. 즉 본 논문은 TimesNet 처럼 데이터에서 주기를 발견하지 않고, **사용자/데이터셋 메타에서 받은 주기를 강하게 신뢰** 한다. 이 단순화 덕분에 MAE 의 $224\times224$ grid 에 잘 들어맞는다는 trade-off — 단순함이 robustness 와 충돌하는 점은 07_limits 에서 다룬다.

**Contribution 5 — 후속 expansion 의 출발점.** README 가 명시한 VisionTS++ (arXiv:2508.04379, 2025-08) 는 multi-channel + probabilistic 확장. 본 논문은 univariate / point forecasting 에 한정된 prototype 이라는 자기 한정 (후속 motivation 으로 역추정).

방어 가능한 주장 vs 한계: zero-shot 성능 ranking (vs Chronos/MOIRAI/TimesFM) 은 GIFT-EVAL leaderboard 라는 **외부 검증된 ranking** 으로 뒷받침되므로 강하다. 다만 **periodicity 미지정 / 비정상 도메인 / 고변량 다채널 / extreme tail** 에서는 본 환경에서 본문 표 미확인이라 단정 불가. 이 영역에 대한 검증은 follow-up VisionTS++ 와 비교했을 때 본 논문이 자기 한정한 부분이라고 해석 가능.
