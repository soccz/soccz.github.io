# 5.C 방법론 ③ Markov Transition Field

## 5.C.1 이 부분이 왜 필요한가

GASF/GADF 가 *연속값의 cosine 유사도* 를 인코딩한다면, MTF 는 *이산화된 양자 상태 사이의 확률적 흐름* 을 인코딩한다. 두 정보는 *상호 보완* — GAF 는 *내적 기반 (inner-product)*, MTF 는 *전이 기반 (transition-based)*. 둘을 RGB 채널로 묶으면 vision CNN 이 *두 종류의 시간 정보* 를 동시에 학습할 수 있다.

## 5.C.2 단계 1 — 양자화 (Quantile binning)

시계열 값의 분포를 *$Q$ 개 사분위로 균등 분할* 해 *상태 (state) $s_1, \ldots, s_Q$* 를 만든다. 각 시점 $x_i$ 가 어느 상태에 속하는지를 함수 $q(\cdot)$ 로 표기:

$$q: x_i \mapsto s_k \in \{s_1, \ldots, s_Q\}, \quad k = \text{quantile index of } x_i$$

**4 줄 해석**:
- **기호 뜻**: $Q$ = 양자화 단계 수 (기본값은 본 환경 미확인; 통상 4~10), $q(x_i)$ = 시점 $i$ 가 속한 상태.
- **일상 비유**: 키 데이터를 *키 작은 25% / 25~50% / 50~75% / 큰 25%* 의 4 분위로 라벨링하는 것. 절대값 대신 *순위 등급* 만 남긴다.
- **왜 이 형태**: *quantile* (사분위) 양자화는 *분포에 robust* — outlier 가 있어도 양자 경계가 *분포의 25/50/75 백분위수* 에 자동으로 맞춰진다.
- **조심할 점**: *$Q$ 의 선택* 이 결정적 — 작으면 정보 손실, 크면 sparse transition matrix. 또 *quantile* 은 *value distribution* 에 의존하므로 *비정상 시계열* 에서 train/test 의 quantile boundary 가 달라질 수 있다.

## 5.C.3 단계 2 — Markov 전이 행렬

양자화된 상태 시퀀스 $(q(x_1), q(x_2), \ldots, q(x_n))$ 로부터 *1-step 전이 확률* 행렬 $W \in [0, 1]^{Q \times Q}$ 를 추정:

$$W_{kl} \;=\; \Pr\bigl(q(x_{t+1}) = s_l \,\big|\, q(x_t) = s_k\bigr) \;=\; \frac{\#\{t : q(x_t) = s_k \wedge q(x_{t+1}) = s_l\}}{\#\{t : q(x_t) = s_k\}}$$

각 행의 합이 1 인 *행 확률 행렬 (right-stochastic matrix)*.

**4 줄 해석**:
- **기호 뜻**: $W_{kl}$ = 상태 $k$ 에서 1 step 뒤 상태 $l$ 로 이동할 확률.
- **일상 비유**: 학교에서 *현재 성적 등급* 으로부터 *다음 시험 등급* 으로 갈 확률을 표로 만든 것. 우등생은 우등생으로 갈 확률이 높고, 중위권은 양쪽으로 흩어진다.
- **왜 이 형태**: *Markov 가정* (현재 상태만으로 다음 상태 분포 결정) — 시계열의 *short-range dependency* 의 가장 단순한 모델. *비모수적 통계 추정* 으로 즉시 계산.
- **조심할 점**: *Markov 가정* 자체가 강한 가정 — 시계열이 *long-range dependency* 를 가지면 $W$ 만으로는 충분하지 않다. 본 논문은 *GAF + MTF compound* 로 이를 보완.

## 5.C.4 단계 3 — MTF 격자 채우기

$n \times n$ 행렬 $M \in [0, 1]^{n \times n}$ 의 각 항을 *시간 짝 $(i, j)$ 의 상태 사이의 전이 확률* 로 채운다:

$$M_{ij} \;=\; W_{\,q(x_i),\, q(x_j)}$$

**4 줄 해석**:
- **기호 뜻**: $M_{ij}$ = 시점 $i$ 의 상태에서 시점 $j$ 의 상태로 *1-step 으로 이동할 확률*.
- **일상 비유**: 만약 "현재 키 등급 = 중위" 라면 다음 측정에서 "키 등급 = 상위" 가 될 확률 — 이 값을 *현재 시점 $i$ × 미래 시점 $j$* 그리드의 한 픽셀에 칠한다.
- **왜 이 형태**: *시간 인덱스* 가 그리드의 *위치* 로, *상태 정보* 가 *값* 으로 분리 — GAF 와 같은 *위치-의미 분리* 원칙.
- **조심할 점**: $M_{ij}$ 는 *1-step* 전이만 본다. $|i - j|$ 가 크면 (멀리 떨어진 시점) 실제로는 *$|i-j|$-step* 전이 $W^{|i-j|}$ 가 더 적합. 본 논문이 *상수 1-step* 만 본다는 점은 *time-invariant* 가정의 강한 적용. 멀리 떨어진 시점 짝의 *MTF 값* 은 *마코프적으로* 무의미 (단일 step transition prob 가 distance 와 무관히 broadcast 됨).

## 5.C.5 단계 4 — Reduction (선택적)

저자 GitHub Wiki: "MTF reduction approaches — full, patch, PAA". 즉 $n$ 이 크면:

- **full**: 그대로 $n \times n$
- **patch**: $m \times m$ patch 평균
- **PAA**: 시계열 자체를 PAA 로 압축 → MTF 도 $m \times m$

**4 줄 해석**:
- **기호 뜻**: $m < n$ 이 reduction 후 차원.
- **일상 비유**: 1000×1000 픽셀 사진을 100×100 으로 줄이는 것 — 세부는 흐려지지만 *전체 구조* 는 유지.
- **왜 이 형태**: *quadratic 메모리* 부담을 *학습 가능* 한 크기로 낮춤. CNN 입력 크기와 GPU 메모리 제약 일치.
- **조심할 점**: patch reduction 은 *block-mean* 인지 *block-sample* 인지에 따라 정보 손실이 다르다. PAA reduction 은 *원 시계열을 먼저 줄임* — MTF 의 *상태 추정 표본 수* 가 줄어 $W$ 가 noise 에 약해진다.

## 5.C.6 한 문장 정리

> "MTF 는 *quantile 양자화 + 마코프 1-step 전이 + 시간 짝 broadcast* 의 3 줄 수식으로 시계열에서 *비대칭적 short-range 확률 흐름* 을 $n \times n$ 격자로 들어 올린다 — 그 격자는 GAF 의 *cosine 유사도* 격자와 *RGB 채널 결합* 으로 vision CNN 에 *시간의 두 얼굴* (유사도 + 확률) 을 동시에 학습시킨다."
