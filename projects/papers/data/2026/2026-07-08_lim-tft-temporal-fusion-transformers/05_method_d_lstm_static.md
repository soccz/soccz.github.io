# 4. 방법론 D — LSTM 인코더-디코더 + Static Covariate 4-경로 주입

## 왜 이 부분이 필요한가

시계열은 **국소 (local) 패턴** — 최근 몇 시간의 급격한 감소, 요일에 따른 반복적 상승 — 과 **전역 (global) 패턴** — 지난 30일의 추세, 연간 주기 — 이 섞여 있다. Attention 은 전역·장거리에 강하지만 국소 시간 순서 인식에는 상대적으로 약하다 (별도의 positional encoding 이 필요). LSTM (Long Short-Term Memory, 장단기 기억 재귀 신경망) 은 반대로 국소·순차 패턴 학습에 자연스럽다.

TFT 는 이 둘을 **직렬** 로 놓는다: LSTM 이 먼저 국소 처리, 그 위에 attention 이 전역 결합. 이는 이후 iTransformer (Liu 2024) 가 "attention-only 로 충분" 하다고 반박하는 지점 — TFT 시대 (2019-2020) 의 표준적 hybrid 접근이었다.

## 아키텍처

### Step 1 — Sequence-to-sequence LSTM 인코더-디코더

Encoder 는 과거 look-back window $[t-k, t]$ 의 VSN 출력 $\tilde{\xi}_{t-k}, \ldots, \tilde{\xi}_t$ 를 순차 처리:
$$(\phi_{t-k}, \ldots, \phi_t) = \text{LSTM-Enc}(\tilde{\xi}_{t-k}, \ldots, \tilde{\xi}_t; h_0, c_0)$$

Decoder 는 미래 지평 $[t+1, t+\tau_{\max}]$ 의 known future VSN 출력을 순차 처리:
$$(\phi_{t+1}, \ldots, \phi_{t+\tau_{\max}}) = \text{LSTM-Dec}(\tilde{\xi}_{t+1}, \ldots, \tilde{\xi}_{t+\tau_{\max}}; h_t, c_t)$$

- **기호 뜻**: $\phi_t$ = LSTM 이 시점 $t$ 에서 내는 hidden state (locally-processed 표현). $h_0, c_0$ = encoder 의 initial hidden/cell state. Encoder 의 마지막 상태 $(h_t, c_t)$ 를 decoder 의 initial state 로 넘김.

- **일상 비유**: 편지 봉투 봉인기 (encoder) 가 과거 편지들을 한 줄씩 봉인해 나가고, 마지막에 봉인 상태를 다음 답장 작성기 (decoder) 에 넘기는 것. 그 봉인 상태가 "지금까지 무슨 이야기가 오갔나" 를 요약.

- **왜 이 형태**: encoder-decoder 는 sequence-to-sequence 의 표준. 특히 미래 시점에서 **미래 known input (요일, 공휴일)** 을 decoder 에 그대로 넣고, past-only (observed exogenous) 는 encoder 에만 넣어 leak 을 방지하는 clean separation.

- **조심할 점**: LSTM 은 vanishing gradient 로 long-range 를 놓치기 쉽다 (그래서 attention 이 위에 필요). 또, encoder 와 decoder 사이 상태 넘김이 information bottleneck 이라, 매우 긴 시계열에서 (예: 수년) 성능 저하.

### Step 2 — Post-LSTM Gate + Add & Norm

LSTM 출력을 그대로 attention 에 넣지 않고, 한 층의 gate + skip 을 통과:
$$\tilde{\phi}_t = \text{LayerNorm}\bigl(\tilde{\xi}_t + \text{GLU}(\phi_t)\bigr)$$

- **왜 이 형태**: LSTM 이 필요 없을 때 (예: horizon 이 짧고 VSN 출력이 이미 충분) gate 가 닫혀 원본 $\tilde{\xi}_t$ 가 통과. 이는 GRN 정신의 반복 (skip + gate + norm).

- **조심할 점**: LSTM 이 사실상 skip 될 수 있다는 것은 LSTM 이 항상 유용하지 않다는 사실을 architecture 가 인정한 셈. iTransformer 는 이 skip 관찰을 극단화해 LSTM 자체를 제거.

### Step 3 — Static Covariate Encoder 로부터 4-경로 주입

Static covariate encoder 는 $s_i$ 로부터 4 개의 context 벡터를 뽑는다. 각각 서로 다른 학습된 GRN 을 통해:
$$c_s = \text{GRN}_{c_s}(s_i), \quad c_c = \text{GRN}_{c_c}(s_i), \quad c_h = \text{GRN}_{c_h}(s_i), \quad c_e = \text{GRN}_{c_e}(s_i)$$

각각의 용도:
- $c_s$: **VSN 안의 variable selection weight 계산 조건화** — 매 시점 어떤 변수가 중요한지가 static 정보 (매장 유형) 에 따라 달라진다.
- $c_c$: **LSTM initial cell state** — 과거 처리 시작 상태에 static 정보 주입.
- $c_h$: **LSTM initial hidden state** — 마찬가지.
- $c_e$: **Static enrichment layer 조건화** — attention 앞의 GRN 이 $c_e$ 를 조건으로 받아 LSTM 출력을 enrich.

$$\theta_t = \text{GRN}_\theta(\tilde{\phi}_t, c_e)$$

- **기호 뜻**: $\theta_t$ = static-enriched 표현 = "이 시점의 dynamic 정보 + 이 시계열의 static 정보" 가 결합된 벡터.
- **일상 비유**: 이 지점에서 요리사가 "우리 가게가 마트인 걸 감안하면" 이라는 맥락을 냄비에 부어 넣는 것 — 이미 손질된 재료 (dynamic) 를 정리하기 직전에.
- **왜 이 형태**: static 정보를 **4 지점에 분산 주입** 하는 이유는 단일 지점 주입이 static-dynamic 상호작용을 충분히 표현 못 한다는 저자의 가설. Ablation §5.4 (본문 확인 필요) 에서 이 4 경로 중 일부를 제거하고 성능 변화를 봤을 것.
- **조심할 점**: $\text{GRN}$ 이 additive combine 만 지원하므로 static-dynamic 의 곱셈적 상호작용 (예: "홀리데이 효과의 크기는 매장 크기에 비례") 을 명시적으로는 못 잡음.

## 대안 접근

1. **Static 을 concat 만**: $[\tilde{\phi}_t, s_i]$ 를 attention 에 넣기. 4-경로 주입의 architecture inductive bias 없음. Ablation 이 이 대안을 커버.

2. **Static 을 별도 static-only transformer 로**: static 을 별도 transformer 로 처리한 뒤 cross-attention 으로 dynamic 과 결합. TFT 시대 이후 널리 쓰이는 접근.

3. **LSTM 대신 Temporal Convolutional Network (TCN)**: WaveNet/TCN 은 dilated conv 로 국소 처리. LSTM 보다 병렬화 유리. TFT 저자는 LSTM 을 선택 — 당시 (2019) TCN 이 sequence-to-sequence 로 아직 완전히 표준이 아니었음.

4. **LSTM 제거, attention-only**: iTransformer, PatchTST 방향. TFT 논문 이후 몇 년 후에야 인기.

## 이 부분의 핵심 한 문장

**LSTM 인코더-디코더는 국소 순차 처리, static covariate encoder 는 4-경로 조건화 신호 — 두 시스템이 만나서 "이 시계열이 어떤 시계열인가" 와 "지금 이 시점 어떤 국소 패턴이 있나" 를 동시에 attention 앞에 놓이는 표현으로 통합한다.**
