# 05.a 방법론: 큰 그림 (intuition)

## 배경 사다리

이 절을 이해하려면 두 개념만 있으면 된다. ① **Transformer** 는 "여러 개의 벡터들이 서로 얼마나 관련 있는지 (attention) 를 계산해서 각 벡터를 그 관계에 따라 다시 섞는 신경망". ② **Autoregressive** 는 "이전 결과를 입력으로 다시 넣어 다음 결과를 뽑는" 방식. GPT 가 대표.

## 한 문장 요약

**"길이 32짜리 시계열 조각(patch) 을 언어 모델의 단어(token) 처럼 취급하고, 20층 decoder-only Transformer 를 태워서 마지막에 residual block 으로 다음 128 시간점을 한꺼번에 뽑는다."**

## 다이어그램 (지문)

```
원시 시계열  x_1, x_2, ..., x_T           (T = context 길이, 최대 512(v1)·2048(v2)·16384(v2.5))
       ↓ 32개씩 자름
Patch 목록  P_1, P_2, ..., P_N            (N = T/32)
       ↓ residual block (MLP + skip)
Token 벡터  z_1, z_2, ..., z_N            (각 z_i 는 1280-차원)
       ↓ + positional encoding (freq embedding 도 concat)
       ↓
20 × [Causal Multi-Head Self-Attention (16 heads) + FeedForward]
       ↓
마지막 hidden state  h_N
       ↓ output residual block (MLP + skip)
예측 patch  ŷ = (ŷ_{T+1}, ..., ŷ_{T+128})   (한 번에 128 시간점)
       ↓ 필요 시 autoregressive rollout
       ↓  (예측을 다시 입력에 붙이고 다음 128 시간점 뽑기)
```

이 다이어그램의 다섯 부분이 이후 §05.b–§05.e 각 파일에서 하나씩 해체된다.

## 왜 이 골격인가 — 세 개의 "안 그럴 수도 있었다" 를 논박

### 대안 1: Encoder-only (BERT / MOMENT 스타일)

**아이디어**: masked patch prediction 으로 사전학습하고, downstream 에서는 마지막 hidden state 를 pooling 해서 예측 head 를 붙인다. MOMENT (Goswami et al. ICML 2024) 가 이 방향.

**TimesFM 이 안 택한 이유**: (i) zero-shot 예측이 masked reconstruction 을 통해 간접적. (ii) autoregressive rollout 로 임의 길이 horizon 을 뽑는 게 어려움 — encoder-only 는 fixed-horizon 학습을 하면 그 길이에 특화되고, longer horizon 은 별도 처리를 요구. (iii) 언어 분야 경험 (GPT vs BERT) 에서 decoder-only 가 generative task 에 더 자연스러움.

### 대안 2: Encoder-decoder (T5 / Chronos 스타일)

**아이디어**: 시계열 값을 discretize 해서 token 으로 만든 뒤 T5 encoder-decoder 에 태운다. Chronos (Ansari et al. 2024) 가 이 방향.

**TimesFM 이 안 택한 이유**: (i) 값 이산화가 정보 손실 (Chronos 는 quantile-based bin 4096 개인데 극단값 재현에 손실). (ii) encoder-decoder 는 parameter budget 이 decoder-only 대비 2배 (encoder + decoder). (iii) 시계열 예측은 "번역" 이 아니라 "자기회귀" 에 더 가까움 → 자연스러운 매칭.

### 대안 3: LLM 재활용 (GPT4TS / OFA / Time-LLM 스타일)

**아이디어**: 이미 학습된 LLM (GPT-2, LLaMA) 파라미터를 얼리고 시계열 patch 를 embedding 만 새로 붙여서 재활용. Zhou et al. NeurIPS 2023 (OneFitsAll / GPT4TS) 계열.

**TimesFM 이 안 택한 이유**: (i) 언어 pretraining 이 시계열 통계에 관련 없음 — 이후 Tan et al. NeurIPS 2024 Spotlight (arXiv:2406.16964) 가 "LLM 백본을 single random-init attention layer 로 대체해도 성능 동일" 실증. (ii) 새로 학습하는 게 파라미터 효율적. (iii) 언어와 시계열의 vocabulary size 격차 (수만 개 vs 연속값) 로 임베딩 layer 낭비.

## 이 골격의 세 가지 결정적 트릭

### 트릭 1: 패치 = 토큰 (input patching)

$p=32$ 시간점을 하나의 토큰으로 취급 → context 길이 $T=512$ 일 때 $N = 16$ 토큰. Transformer 의 O(N²) 비용은 O(16²) = 256 으로 감당. PatchTST (Nie et al. ICLR 2023) 가 supervised 세팅에서 이미 검증한 문법을 pretraining scale 로 확장한 것.

### 트릭 2: output patch $h > p$ (output patching)

$h=128$ 로 4×p. 한 forward 로 128 시간점 예측 → 짧은 horizon 은 rollout 없이 마감, 긴 horizon 은 rollout 횟수 감소. 이 비대칭은 시계열 고유 설계 — 언어 모델은 대체로 $h=p=1$ (다음 1 토큰).

### 트릭 3: real-value regression head (no vocabulary)

output residual block 이 실수값을 직접 낸다. 이산화 없음. Chronos 는 이산화 방향을 택했지만 TimesFM 은 최소 정보 손실을 우선. Regression MSE 로 학습.

## 이 절의 핵심 한 문장

**"언어 모델의 토큰-과-쿼리라는 문법을, 시계열의 패치-와-실수값이라는 새 syntax 로 최소 손실로 이식하고, 스케일 (100B time-points) 로 밀어붙였다."**

다음 §05.b 부터 각 트릭을 수식과 함께 뜯어본다.
