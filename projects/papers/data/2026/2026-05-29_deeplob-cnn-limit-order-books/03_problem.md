# 03_problem — 문제 지형도

**배경 사다리**: ① 현대 증시는 거래소 중앙에서 매수·매도 주문을 가격 우선·시간 우선 원칙으로 매칭하는 **continuous double auction** 방식, ② 매칭되지 않은 잔여 주문이 가격대별로 쌓인 것이 LOB, ③ HFT/마켓메이커는 LOB 의 미시 변화를 보고 ms 단위로 의사결정한다는 것 — 이 셋만 알면 충분하다.

---

## 1. 이 논문이 푸는 실제 문제

### 상황 1: 마켓메이커의 quote 조정
한 마켓메이커가 동시에 매수·매도 호가를 걸어 spread 를 먹는다. 만약 다음 1초 안에 mid-price 가 1 tick 오를 거라면 매수 호가를 더 공격적으로(높게) 걸어야 fill 을 받고, 그 직후 더 비싼 가격에 팔 수 있다. 반대로 떨어질 거라면 quote 를 빼야 adverse selection 손실을 피한다. **mid-price 의 다음 짧은 미래 방향 예측** 이 본질 문제다.

### 상황 2: HFT 의 short-term alpha
LOB 의 imbalance(매수 잔량 vs 매도 잔량) 가 mid-price 변화를 선행한다는 것은 microstructure 학계에서 오래된 stylized fact (Cont 2014 등). 그러나 imbalance 한 변수만으로는 sparse 한 signal. LOB 의 *전체 모양 변화* 가 더 많은 정보를 담는다. **이 정보를 자동 추출하는 모델** 이 필요하다.

### 상황 3: 시장 충격 예측 (taker)
큰 매수 주문을 한 번에 보내면 LOB 의 ask 측 여러 레벨을 동시에 깎고 가격을 끌어올린다 (market impact). 분할 실행(VWAP/TWAP/POV) 시점을 LOB 상태로 결정하면 implementation shortfall 을 줄일 수 있다. 이때도 **다음 짧은 미래의 LOB 다이내믹스** 가 핵심.

---

## 2. 기존 접근 계보 (연대 + 한계)

### (a) 핸드크래프트 feature + 얕은 분류기 (2014~2016)
- **대표**: Kercheval & Zhang 2015 ("Modelling high-frequency limit order book dynamics with support vector machines"). LOB 에서 spread, mid-price, imbalance, 가격 derivative, 평균 거래량 등 **수십 개 통계량** 을 손으로 계산 → SVM/RF 로 분류.
- **장점**: 특징 의미가 명확, 작은 데이터로 작동.
- **한계**: feature engineering 이 도메인 지식에 강하게 의존. 어떤 통계량이 진짜 informative 인지 사전 결정이 필요. LOB 의 다단계 의존(예: 5-7 레벨의 큰 wall 이 1 레벨 가격에 미치는 영향) 은 단순 통계로 포착이 어렵다.
- **교훈**: 자동 추출이 필요하다 — 그게 DL 의 약속.

### (b) MLP / Bag-of-Features (BoF) — 무구조 DL (2017)
- **대표**: Ntakaris et al. 2018 (FI-2010 benchmark 의 baseline 으로 보고). LOB raw 40-dim 을 MLP 에 그대로 넣거나, codebook + 빈도(BoF, N-BoF) 로 변환.
- **장점**: feature engineering 부담 ↓.
- **한계**: LOB 의 *구조적* 정보 (가격레벨 순서, bid-ask 대칭, 시간축) 를 모두 동등 취급. MLP 는 entry 간 위치 관계가 의미 있다는 사실을 모른다. BoF 는 시간 순서를 완전히 버린다.
- **교훈**: LOB 의 spatial 구조를 모델이 "알도록" 해야 한다.

### (c) 단일 CNN / LSTM (2017~2018)
- **대표**: Tsantekidis et al. 2017 ("Forecasting stock prices from the limit order book using CNNs"). 1-D CNN 으로 시간축만 처리. LSTM-only baseline 도 존재.
- **장점**: 시간 의존성 또는 spatial 패턴 중 하나는 잡는다.
- **한계 (CNN-only)**: receptive field 가 고정. 짧은 패턴은 잘 보지만 100-tick 이상의 장기 의존은 약하다. **한계 (LSTM-only)**: 매 시점 40-dim 을 통째로 넣으면 가격레벨 간 spatial 위계를 학습기가 처음부터 발견해야 함 — 비효율.
- **교훈**: **spatial CNN + temporal RNN 의 융합** 이 필요하다.

### (d) Inception 사상 (병렬 도메인, 2014)
- **대표**: Szegedy et al. 2015 GoogLeNet (vision). 단일 CNN 의 fixed receptive field 한계를 평행 branch 로 해결 — $1 \times 1, 3 \times 3, 5 \times 5$ + MaxPool 을 동시에 적용하고 채널 차원 concat.
- **연결**: LOB 시간축에 똑같은 원리 — 단기·중기·장기 시간 패턴을 한 번에 보는 모듈.
- **교훈**: 이 모듈을 **1-D 시간축으로** 변형해 LOB 에 이식 가능.

### (e) Bilinear / TABL 계열 (2018, 평행)
- **대표**: Tran et al. 2018 B(TABL), Tran et al. 2017 "Temporal Bag-of-Features". LOB 를 2-D bilinear 곱으로 attentive aggregation.
- **장점**: 시간·feature 축에 attention 적용.
- **한계**: spatial 구조에 대한 명시적 prior 없음 (모든 feature 동등). 일부 horizon 에서 강하지만 FI-2010 전체에서 일관된 SOTA 는 아니다.
- **교훈**: 좀 더 강한 도메인 prior(가격레벨 위계) 가 필요하다.

---

## 3. 기존 방법들이 공통으로 놓친 핵심 gap

> **LOB 의 40-dim 입력 안에 숨은 위계적 구조 — (가격, 거래량) 짝 → (bid, ask) 짝 → 가격레벨 위계 → 시간 흐름의 다중 스케일 — 를 architecture 차원에서 명시적으로 풀어낸 모델이 없었다.** MLP 는 모두 동등 취급하고, 단일 CNN/LSTM 은 한 축만 본다.

---

## 4. 이 논문이 그 gap 을 어떻게 메우겠다는가

DeepLOB 의 답은 *"네트워크의 conv 커널 모양 자체를 LOB 의 위계에 맞춘다"* 이다. 구체적으로:

- **첫 conv**: 커널 $1 \times 2$ (가로 2, 세로 1) + stride $1 \times 2$. → (가격, 거래량) 짝을 묶어 20개 특징으로 압축. *이것이 LOB 의 가장 작은 의미 단위*.
- **둘째 conv**: 또 $1 \times 2$. → (bid, ask) 짝을 묶어 10개 가격레벨로 압축.
- **셋째 conv**: $1 \times 10$. → 10 레벨 전부를 한꺼번에 통합. 가격레벨 간 long-range 의존을 한 번에 끝낸다.
- 사이사이에 $4 \times 1$ (세로 시간 방향) 커널을 두어 **각 spatial 단계마다 짧은 시간 패턴**을 추출.
- 그 위에 **Inception** 으로 다중 시간 스케일을 평행 추출.
- 마지막으로 **LSTM(64)** 가 시계열의 잔여 장기 의존을 처리.

이렇게 함으로써 모델은 **"이미 알려진 LOB 의 구조" 를 학습 시작점으로 받고**, 학습은 "그 구조 위에서 어떤 패턴이 다음 가격 변화를 예측하나" 에 집중할 수 있다. 이것이 vanilla MLP 가 처음부터 spatial 위계를 발견해야 하는 부담을 덜어 주는 **귀납적 편향 (inductive bias)** 의 본질이다.
