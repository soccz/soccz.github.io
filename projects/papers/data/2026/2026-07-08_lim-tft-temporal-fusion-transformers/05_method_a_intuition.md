# 4. 방법론 A — 5개 입력 소스와 큰 그림

**배경 사다리**: 이 파일을 이해하려면 (i) encoder-decoder 구조 (과거 정보를 요약해 인코더로 압축하고, 미래 예측을 디코더로 뽑는 파이프라인), (ii) attention 이 "어디에 얼마나 주목할지 가중치를 매기는 layer" 라는 상식적 정의 — 이 둘만 알면 나머지는 이 절이 풀어준다.

## 입력 5-tier 인터페이스

TFT 는 예측 문제를 다음과 같이 형식화한다. 각 시계열 (예: 상점 $i$의 판매량) 을 $i \in \mathcal{I}$ 로 색인, 관측 시점 $t$, 예측 지평 $\tau \in \{1, \ldots, \tau_{\max}\}$.

각 시점에서 모델이 보는 입력은 다섯 종류:

1. **Static covariate** $s_i \in \mathbb{R}^{d_s}$: 시간 불변 메타데이터. Electricity 예에서 이 client 의 시장/카테고리, Retail 예에서 매장 위치·업종, Volatility 예에서 지수 코드. 시간 축 없음.

2. **Known future input** $x_{i, t+\tau} \in \mathbb{R}^{d_x}$, $\tau \in \{-k, \ldots, \tau_{\max}\}$: 과거·미래 모두 미리 아는 정보. 요일, 월, 공휴일, 예정된 프로모션. 미래 방향으로 접근 가능하므로 decoder 에 그대로 들어감.

3. **Observed past input** $z_{i, t-k}, \ldots, z_{i, t} \in \mathbb{R}^{d_z}$: 과거만 관측되고 미래는 아직 모르는 exogenous 시계열. 온도, 유가, SNS mentions. Encoder 에만 넣고 decoder 에는 넣지 않는다 (leak 방지).

4. **Target history** $y_{i, t-k}, \ldots, y_{i, t}$: 예측 대상의 과거 실현치. Encoder 에 observed past 와 함께 넣음.

5. **Horizon index** $\tau$: decoder 위치 자체. 시간 순서 정보.

여기서 $k$ 는 look-back window (Electricity 168시간, Retail 90일 등). $\tau_{\max}$ 는 forecast horizon (Electricity 24시간, Retail 30일, Volatility 5 business days).

## 전체 아키텍처의 큰 그림

TFT 는 이 다섯 tier 를 아래 파이프라인으로 처리:

```
Static covariate s_i
        │
        ▼
┌───────────────────────┐
│  Static Covariate     │  ← s_i 를 embed 하고 VSN 을 통과
│  Encoder              │
└──────┬────────────────┘
       │ 4 개 context 벡터로 분해
       │   c_s : dynamic VSN 조건
       │   c_c : LSTM initial cell state
       │   c_h : LSTM initial hidden state
       │   c_e : Static enrichment (post-LSTM)
       ▼
  ┌─────┬────┬─────┐
  ▼     ▼    ▼     ▼
  │
  ▼                          
[Known future / Observed past + Target history]
        ▼
Time-step VSN (c_s 로 조건화된 변수 선택)
        ▼
LSTM Encoder (past) + LSTM Decoder (future)
        │ (c_c, c_h 로 initial state)
        ▼
Post-LSTM Gate + Add & Norm
        ▼
Static Enrichment (c_e 로 조건화된 GRN)
        ▼
Interpretable Multi-Head Attention
   (decoder positions attend to encoder + earlier decoder positions,
    causal mask, head-wise attention weight aggregated)
        ▼
Post-attention Gate + Add & Norm
        ▼
Position-wise Feed-forward (GRN)
        ▼
Quantile Output Head — τ 별 여러 quantile 동시 출력
```

세 가지 관측 포인트:

- **각 처리단마다 gate + skip**: LSTM 후, attention 후, feed-forward 후 마다 GLU + Add & LayerNorm 형태의 gate 가 붙어 있다. 데이터가 단순하면 skip 이 지배적, 복잡하면 gate 열림.
- **Static 은 4-경로 주입**: 정적 정보가 단일 concat 이 아니라 4 개 서로 다른 지점 (VSN 조건, LSTM initial state 두 개, attention 앞 enrichment) 에 분산 주입. 이것이 static-dynamic 상호작용을 architecture 수준에서 새겨 넣는 방식.
- **Attention 은 seq2seq LSTM 위에 얹히는 second-order 모듈**: 순수 attention-only (예: ConvTrans, PatchTST)가 아니라 **LSTM 이 local pattern 을 먼저 처리하고 그 위에 attention 이 long-range 를 얹는** 이단 구조. 이는 이후 iTransformer (2024) 같은 attention-only 접근이 "LSTM 층은 필요 없다"고 반박하는 지점이 된다.

## 왜 이 구조가 필요한가

기존 접근이 실패한 이유는 세 가지:
1. **Static covariate 무시**: DeepAR 은 static 을 embedding 후 initial hidden state 한 곳에만 주입. TFT 는 이를 4 지점에 분산.
2. **Known future 와 observed past 혼동**: MQ-RNN, ConvTrans 는 두 종류를 같은 encoder 에 flatten. TFT 는 encoder (past) 와 decoder (future) 로 명시적 분리, 각각 VSN 을 앞에 둠.
3. **Attention weight 를 해석 지표로 못 씀**: 표준 multi-head 에선 head 별 서로 다른 subspace 이라 head weight 를 그대로 시각화하기 어려움. TFT 는 head-wise value projection 을 shared 로 두어 head weight 를 단일 표면으로 통합.

## 이 구조의 핵심 한 문장 요약

**TFT 는 "입력의 이질성" 을 architecture 로 새겨 넣고, 그 위에 gating + attention + quantile 세 축의 해석 통로를 조립한 seq2seq 모델이다.**

다음 파일들은 이 큰 그림의 각 부품 (VSN → GRN → LSTM+Static → Attention → Quantile) 을 하나씩 해부한다.
