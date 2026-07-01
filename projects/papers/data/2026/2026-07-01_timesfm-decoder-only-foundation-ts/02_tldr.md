# 02. 3층 TL;DR

## 🧒 초등학생 수준 (수식 금지)

옛날에는 "내일 아이스크림이 몇 개 팔릴까?"를 알고 싶으면 그 아이스크림 가게 자기 자료로만 배우는 예측 로봇을 하나 새로 만들어야 했다. 다음 가게, 그 다음 가게마다 로봇을 새로 만들어야 하니까 번거로웠다.

이 논문은 이렇게 말한다: **글자를 하나씩 배우는 대신에 "여러 단어"를 한 번에 통째로 보는 것처럼**, 시간 그래프도 몇 개의 시간 조각(예: 30분씩 묶은 조각) 을 하나의 "말 조각(토큰)"으로 보고, 이런 조각을 아주 많이 (전세계 인터넷 검색 그래프 100,000,000,000 개 시간점만큼) 보여주면, **한 번 만든 로봇이 처음 보는 새 가게의 그래프도 그럭저럭 잘 예측**할 수 있다는 것.

핵심 발상의 전환은 세 가지다. ① 시계열의 한 점을 한 단어로 보지 말고 여러 점을 뭉쳐서 한 단어처럼 취급하자. ② 예측할 때는 한 점씩 뽑지 말고 여러 점을 한 번에 뽑자 (그래야 훨씬 빠름). ③ 학습 자료를 특정 분야가 아니라 세상 온갖 시계열 (검색량, 위키 조회수, 날씨, 전기 등) 로 하자.

그 결과 로봇은 "이건 주기적 시계열이구나", "이건 상승 추세구나" 같은 감을 저절로 익히게 되고, 새 가게에 바로 던져도 못하지는 않는다. 다만 "얼마나 자신 있는지" 를 말하는 훈련은 덜 됐다.

## 🎓 학부생 수준

TimesFM 은 **시계열 예측용 파운데이션 모델(foundation model)** 이다. "파운데이션 모델" 은 "한 번 크게 학습해두면 여러 downstream task 에 그대로 (zero-shot) 쓸 수 있는 대형 모델" 이라는 뜻으로, 자연어 처리의 GPT 계열과 이미지의 CLIP 계열이 그 원형이다. 저자들은 language model 에 쓰인 **decoder-only Transformer** 골격을 시계열에 그대로 이식하되, 다음 세 가지를 시계열에 맞게 바꾼다.

1. **입력 패칭 (input patching)**: 원 시계열 $x_1, x_2, \dots, x_T$ 를 길이 $p$ 짜리 겹치지 않는 조각 (patch) 으로 자른다. 이 패치 하나를 언어 모델의 "토큰(token)" 자리에 놓는다. 각 패치는 **residual block** (한 층 짜리 MLP + skip connection) 으로 $d_{\text{model}}$ 차원 벡터로 임베딩된다. 이 논문에서는 $p = 32$.
2. **Decoder-only Transformer 코어**: 마스크된 self-attention 과 feed-forward 층을 $L$ 회 쌓는다. 이 논문에서는 $L=20$, $d_{\text{model}}=1280$, 16 heads, 총 200M params (버전 1.0 기준).
3. **출력 패칭 (output patching)**: 마지막 hidden state 를 또 다른 residual block 으로 통과시켜 길이 $h$ 짜리 미래 조각을 한 번에 뽑는다. 이 논문에서 $h = 128$ (입력 패치 $p=32$ 보다 4배 김). 남은 horizon 은 autoregressive 로 이어붙인다.

그리고 학습 데이터로 **약 1,000억(100 billion) time-points** 를 썼는데, 이 중 대다수는 Google Trends 의 검색 관심도 시계열 + Wikipedia 페이지뷰 시계열이고, 여기에 ARMA·주기·추세를 인위적으로 섞은 synthetic 시계열을 추가한다.

**zero-shot 성능** 은 supervised 모델(각 dataset 에 직접 학습된 모델) 과 견줄 만하다. GIFT-Eval 같은 zero-shot 벤치마크에서 TimesFM 2.0 은 aggregated MASE(Mean Absolute Scaled Error) 로 다음 최고 모델을 6% 앞선다고 저자 README 는 보고한다.

한계는 **확률 예측**. 저자 스스로 v1 README 에서 "10-quantile head 를 실험적으로 제공하지만 사전학습 후 보정(calibration) 되지 않았다" 고 명시한다. 이 한계는 2025-09 의 v2.5 부터 별도 30M 파라미터 continuous quantile head 로 부분 해결되지만, 원 논문(ICML 2024) 시점에는 여전히 point forecast 중심이다.

## 🔬 전문가 수준

논문의 방어 가능한 contribution 은 다음 4개.

1. **Decoder-only + input patching + output patching 의 3-요소 조합이 zero-shot TS foundation model 로 충분히 작동함을 대규모 실증**. 즉 언어 모델의 "next-token prediction" 을 "next-patch prediction" 으로 확장한 최소 골격만으로도, 100B time-points 를 학습하면 supervised 모델과 견줄 zero-shot 성능이 나온다는 실증 (§5 experiments).
2. **Output patch length $h \gg$ input patch length $p$ 로 두는 설계 선택**. 이는 언어 모델의 "1 토큰씩 예측" 과 다른 시계열 고유 설계로, autoregressive rollout 을 4배 짧게 만들어 (i) 롱-호라이즌 예측 속도 개선 + (ii) 오차 누적 감소 + (iii) 학습 시 mini-batch 당 더 많은 예측 감독 신호를 준다 (§3 architecture).
3. **Frequency indicator 를 categorical soft-conditioning** 으로 도입 (0: T/MIN/H/D/B/U, 1: W/M, 2: Q/Y). 이는 seasonality prior 를 파라미터에 강제하지 않고 조건 벡터로 넣어, 서로 다른 sampling rate 의 시계열이 한 모델을 공유하게 만드는 절충안 (§3.x, v1 README verbatim).
4. **100B time-points 규모의 real-world + synthetic 혼합 pretraining corpus** 구축 및 그 조합 비율의 empirical 검증. 대부분이 Google Trends 검색 관심도 + Wikipedia pageviews 라는 점은 (i) 재현 불가능성이라는 약점과 (ii) "search / pageview 는 다양한 human-driven periodicity 를 포함하므로 좋은 시계열 사전" 이라는 강점을 동시에 갖는다 (§4 data).

이론적 기여는 "zero-shot TSFM 이 존재 가능함을 존재 증명 (existence proof) 한다" 는 것으로, 이후 Chronos(Ansari 2024, tokenization + T5), MOIRAI(Woo 2024, Any-Variate Attention + multi-patch-size), VisionTS(Chen 2024, image bijection), TimesFM-ICF (Das 2024, in-context finetuning) 등 후속 연구의 축이 된다. 한계로는 (i) **quantile head 미보정** → 진정한 probabilistic forecast 불가 (v1 README self-report), (ii) **corpus 재현 불가** → open-science 결핍, (iii) **univariate only** → cross-variate 상관 활용 부재 (MOIRAI 의 Any-Variate Attention 이 이 지점을 채움), (iv) **frequency 카테고리의 3-단계 이산화** 가 seasonal prior 를 뭉툭하게 강제 (예: 일간 T 와 시간 H 를 같은 0-카테고리로 묶음) 등.
