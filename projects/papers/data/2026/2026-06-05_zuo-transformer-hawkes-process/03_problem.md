# 03_problem — 문제 지형도

## 배경 사다리

이 절을 이해하려면 ① "사건 시퀀스" 가 정해진 시간 간격이 아니라 **불규칙한 시각**에 도착하는 데이터(트위터 글, 응급실 입원, 주식 거래) 라는 것, ② "조건부 강도(intensity)" 는 **"지금 이 순간 다음 사건이 일어날 비율"** 을 가리키는 수 (단위시간당 확률), ③ 호크스 과정(Hawkes process)이 "**과거 사건이 미래 사건의 강도를 끌어올린다**" 는 **자기-자극(self-excitation)** 모델이라는 것 — 이 셋만 알면 된다.

---

## 실제 문제: 어디서 발생하는가

### 상황 1 — 트위터 리트윗 캐스케이드

오리지널 트윗이 올라오고 10분 만에 100명이 리트윗한다. 그 다음엔 1시간 동안 50명, 다음날엔 30명, 일주일 후엔 잠잠해진다. 사용자가 알고 싶은 것: **"오늘 밤 10시까지 추가 리트윗이 몇 건 더 발생할까?"** 또는 **"어떤 사용자가 다음으로 리트윗할까?"**.

### 상황 2 — 환자 ICU 입원·시술 시퀀스

한 환자가 응급실에 도착(시각 $t_1$). 30분 뒤 흉부 X-ray 촬영($t_2$). 2시간 뒤 항생제 투약($t_3$). 다음날 새벽 산소포화도 급락 알람($t_4$). 의사가 알고 싶은 것: **"이 환자가 24시간 내 ICU 이송 시술을 받을 위험이 얼마나 되는가?"** (= 다음 사건 종류 prediction + 시간 prediction).

### 상황 3 — 주식의 매수·매도 도착

한 종목에 대해 매수 주문이 9:30:01.235, 매수 9:30:01.481, 매도 9:30:01.512, 매도 9:30:02.103, ... 이렇게 ms 단위로 도착. 시장조성자가 알고 싶은 것: **"다음 100ms 동안 매수 도착 강도가 얼마이고, 그게 매도 강도와 어떤 관계인가?"** — 이게 시장조성 호가 갱신 빈도, 청산 cascade 위험률을 직접 결정.

세 상황의 공통점: **이산 사건이 연속 시간 위에서 발생**한다. 사건 사이 간격은 무작위. 사건 종류는 multi-categorical. 한 사건이 다른 사건의 빈도를 끌어올린다(self-excitation 혹은 mutual-excitation).

---

## 기존 접근의 계보

### 이정표 1 — Hawkes (1971): 자기-자극 점과정의 시초

**무엇이었나?** Alan Hawkes 가 지진 여진(aftershock) 모델링을 위해 제안. 조건부 강도를

$$\lambda_k(t) = \mu_k + \sum_{t_i < t} \alpha_{k, k_i} \cdot \exp(-\beta(t - t_i))$$

baseline 강도 $\mu_k$ + 모든 과거 사건이 지수 감쇠로 영향 주는 항. $\alpha_{k, k_i}$ 는 종류 $k_i$ 의 사건이 종류 $k$ 의 다음 사건을 얼마나 흥분시키는지.

**왜 부족했나?** $\exp(-\beta(t-t_i))$ 감쇠 형태가 미리 고정. 실제 응용(금융, 소셜미디어)의 감쇠는 **power-law tail** 이나 **여러 시간상수의 혼합**처럼 더 복잡. 매개변수 $\alpha, \beta$ 가 모든 사건 쌍에 대해 같은 형태를 강요하는 강한 가정.

**교훈?** **"강도를 과거 사건의 영향 합으로 분해"** 라는 발상 자체는 강력 — 모든 후속작이 이 분해를 이어받음. 다만 영향함수 $\phi$ 를 **데이터에서 학습**해야 한다.

### 이정표 2 — Du, Dai, Trivedi, Upadhyay, Gomez-Rodriguez, Song (KDD 2016, RMTPP)

**무엇이었나?** **Recurrent Marked Temporal Point Process** (이정표 논문). RNN 으로 사건 이력 $\mathcal{H}_t$ 를 hidden state $h$ 로 압축한 뒤, 강도를

$$\lambda(t) = \exp\!\left( v^\top h_j + w \cdot (t - t_j) + b \right)$$

$h_j$ 는 마지막 사건 $j$ 직후 RNN hidden state, $w \cdot (t - t_j)$ 는 시간이 지남에 따른 강도의 단조 변화 항.

**왜 부족했나?**
- $\exp$ 와 $w$ 의 부호 → **시간이 지남에 따라 강도가 단조 증가 OR 단조 감소만** 표현 가능. 강도가 "감쇠 후 재상승" 같은 비-단조 패턴은 불가능.
- RNN 의 sequential 처리 → 시퀀스가 길어지면 vanishing 으로 long-range trigger 정보 손실.

**교훈?** **RNN 압축 → parametric 강도** 의 2단 분리. 학습 가능한 점과정의 표준 frame.

### 이정표 3 — Mei & Eisner (NeurIPS 2017, Neural Hawkes Process / NHP)

**무엇이었나?** RMTPP 의 강도 표현력을 키우려, **연속시간 LSTM** 을 도입. LSTM의 hidden state $h(t)$ 자체가 시간 연속함수가 되도록 셀 상태에 지수감쇠를 내장. 강도는 $\lambda_k(t) = f_k(h(t))$ 로, $f_k$ 는 softplus.

**왜 부족했나?**
- LSTM 의 **단방향 sequential** 가정 그대로. 시퀀스가 매우 길거나 장거리 trigger 가 있을 때 표현력 한계.
- continuous-time LSTM 의 추론 복잡도가 큼 (모든 시각에 대해 state 시간발전).

**교훈?** **연속시간 hidden 표현** + **softplus 강도** 의 조합 = neural TPP 의 표준. THP 가 그대로 채택.

### 이정표 4 — Self-Attentive Hawkes Process (Zhang et al., ICML 2020 동기)

**무엇이었나?** **THP 와 같은 ICML 2020** 의 평행 작업. transformer 의 self-attention 으로 사건 이력 표현. 다만 강도 헤드 정의가 다소 다름.

**왜 부족했나? (또는 어떤 부분에서 THP 가 앞서갔나?)** THP 가 강도의 시간 의존성에 학습 가능한 $\alpha_k \cdot (t - t_j)/t_j$ 항을 명시적으로 두어 **사건 사이의 연속 시각에서의 강도 변화** 를 더 직접 모델링. (정확한 비교는 본문 표 미접근으로 단정하지 않음.)

**교훈?** **transformer = TPP 의 새 backbone** 이 2020 년 동시 출현. 점과정의 transformer turn 의 시작.

---

## 공통 gap

위 네 이정표가 **공통으로 놓친 것**:

> **"사건 시퀀스의 long-range trigger 를 parametric 가정 없이 모델링하면서, 사건 사이 임의 시각의 강도를 닫힌형으로 효율적으로 계산하는 표현"** — Hawkes 는 parametric, RMTPP/NHP 는 RNN 의 sequential bottleneck, SAHP 는 transformer 도입했으나 강도 헤드의 시간 의존성 표현력이 제한적.

## THP 의 메움 방식

THP 는 두 조각으로 답한다:

1. **이력 표현은 transformer self-attention** — 각 사건이 모든 이전 사건에 직접 attention. distance-agnostic 가중으로 long-range trigger 직접.
2. **강도 헤드는 학습 가능한 3-항 affine + softplus** — $\lambda_k(t) = \mathrm{softplus}(\alpha_k \cdot (t-t_j)/t_j + w_k^\top h_j + b_k)$. $\alpha_k$ 가 사건 사이 시간에 따른 강도 변화의 **부호와 강도**를 학습. $w_k^\top h_j$ 가 사건 이력 정보. softplus 가 양수성 + numerical stability. 사건 사이 임의 시각의 강도가 $h_j$ 만으로 닫힌형 계산.

이 두 조각의 결합이 anchor. 후속 5+편이 이 강도 헤드 정의를 거의 그대로 재사용.
