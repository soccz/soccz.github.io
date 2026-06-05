# 02_tldr — 3층 TL;DR

## 🧒 초등학생 수준 (수식 없음)

세상에는 **언제 일어날지 모르는 일들**이 있어요. 누가 트위터에 글을 올리는 시각, 환자가 응급실에 들어오는 시각, 주식의 매수·매도 주문이 들어오는 시각. 이런 일들은 시계처럼 똑딱똑딱 정해진 간격으로 오는 게 아니라, 어떤 일이 일어난 다음에 비슷한 일이 더 자주 일어나기도 하고, 한참 잠잠하다가 한꺼번에 몰리기도 해요. 마치 **불꽃놀이의 폭죽 소리**처럼요. 한 번 터지면 그 다음 폭죽이 곧이어 터질 가능성이 높지만, 시간이 지나면 점점 잠잠해지죠.

옛날 사람들은 이걸 수학적으로 **"호크스 과정"** 이라는 모델로 그렸어요. "지금까지 일어난 모든 사건이 다음 사건의 빈도(강도)를 끌어올린다, 그러나 그 영향은 시간이 지나면서 차차 약해진다" 이렇게요. 그런데 이 모델은 영향이 약해지는 모양(지수함수)이 미리 정해져 있어서, 실제 현실의 복잡한 패턴을 잘 못 그려요.

이 논문은 말해요: **"강도가 어떻게 변하는지, 그 모양 자체를 데이터에서 배우자. 그것도 요즘 인공지능에서 가장 잘 통하는 트랜스포머라는 '주의를 기울이는 메커니즘'을 써서."** 트랜스포머는 마치 친구의 말을 들으면서 **"방금 한 말 중 어느 부분이 가장 중요한지" 머리속에서 표시를 하며 듣는** 사람과 비슷한 일을 해요. 사건들의 시퀀스에서 어느 과거 사건이 지금 다음 사건에 가장 큰 영향을 주는지를 자동으로 골라내는 거죠. 그 결과: 트위터, 의료, 금융, 인터넷 토론장 같은 여러 데이터에서 옛 방법보다 더 잘 맞추게 됐어요.

## 🎓 학부생 수준

### 무엇을 푸는가?

**시간에 따라 띄엄띄엄 일어나는 사건의 시퀀스** $\{(t_1, k_1), (t_2, k_2), \ldots, (t_L, k_L)\}$ 를 모델링한다. 여기서 $t_i$ 는 사건 발생 시각(스칼라 실수), $k_i \in \{1, \ldots, K\}$ 는 사건 종류. 핵심 모델링 대상은 **조건부 강도함수(conditional intensity function)** $\lambda_k(t \mid \mathcal{H}_t)$ — 시각 $t$ 직전까지의 사건 이력 $\mathcal{H}_t$ 가 주어졌을 때, 종류 $k$ 의 사건이 다음 짧은 구간 $[t, t+dt)$ 에 일어날 단위시간 확률. 직관적으로 "지금 이 순간, 이 종류의 사건이 발생할 위험률".

고전적인 **호크스 과정(Hawkes process, Hawkes 1971)** 은 강도를

$$\lambda_k(t) = \mu_k + \sum_{t_i < t} \phi_k(t - t_i)$$

로 모형화한다 — "baseline $\mu_k$ 위에, 과거 사건이 지수적으로 사라지는 영향 $\phi_k(\cdot)$ 를 더한다". 그러나 $\phi_k$ 의 함수형(지수감쇠 등)이 미리 고정되어 현실 데이터의 복잡한 비선형 의존성을 잡지 못한다.

### 핵심 아이디어

논문은 **트랜스포머 인코더의 self-attention** 으로 강도함수를 비-parametric 하게 학습한다. 구체적으로:

1. **사건 (시각, 종류) → 임베딩**: 종류는 통상적 token embedding, 시각은 sinusoidal 변환 후 더함
2. **인코더 4-layer × 4-head self-attention**: 표준 트랜스포머 인코더가 사건 시퀀스 표현 $h_1, \ldots, h_L$ 을 출력
3. **연속시간 강도함수**: $h_j$ 와 학습 가능한 weight $\alpha, \beta, w$ 만으로 임의 시각 $t \in [t_j, t_{j+1})$ 의 강도를 닫힌형(closed-form)으로 구성:

   $$\lambda_k(t) = \mathrm{softplus}\!\left( \alpha_k \cdot \frac{t - t_j}{t_j} + w_k^\top h_j + b_k \right)$$

   (softplus 는 출력이 항상 양수가 되도록 보장. 강도는 정의상 양수여야 한다.)

4. **로그가능도 최대화**: $\log L = \sum_i \log \lambda_{k_i}(t_i) - \int_{t_1}^{t_L} \lambda(t) \, dt$. 적분은 (a) 사다리꼴 근사(biased) 또는 (b) 100-sample Monte Carlo(unbiased) 두 방식.

### 결과

- **Synthetic Hawkes / Retweet / StackOverflow / MIMIC-II / MemeTrack / Financial** 6 데이터셋에서 RMTPP, NHP, SAHP 보다 우수한 log-likelihood / type accuracy / time RMSE 보고. (절대 수치는 본문 표 참조 — 본 해체에서는 미접근으로 단정하지 않음.)
- Self-attention 의 inductive bias 가 RNN 의 sequential bias 보다 long-range event dependency 에 적합하다는 직접 증거.

### 한 줄

"호크스 과정의 직접 자기-자극 가정 → 트랜스포머의 self-attention 으로 일반화". 점과정 + 딥러닝의 anchor 작업.

## 🔬 전문가 수준

### Contribution

1. **Transformer encoder 를 marked TPP(temporal point process) 강도함수의 backbone 으로 처음 도입**. NHP(Mei-Eisner 2017)의 continuous-time LSTM 을 self-attention 으로 교체함으로써 (i) 장거리 사건 의존성을 직접 attention 으로 모델링하고, (ii) sequential RNN 의 vanishing 문제를 우회한다.
2. **연속시간 강도의 새 parametric 형태** $\lambda_k(t) = \mathrm{softplus}(\alpha_k \cdot (t - t_j)/t_j + w_k^\top h_j + b_k)$ 제안. RMTPP(Du 2016)의 강도 $\exp(\cdot)$ 가 시간에 대해 단조 증가/감소만 표현하던 제약을 softplus 의 numerically stable 양수성 보장과 학습 가능한 $\alpha_k$ 의 부호 자유도로 완화. **3-parameter family(시간 항 $\alpha_k$, 임베딩 가중치 $w_k$, 편향 $b_k$) 의 sufficient richness** 가 핵심.
3. **Log-likelihood 의 적분 항** $\int_{t_1}^{t_L} \lambda(t) dt$ 를 두 방식으로 평가하고 코드에서 모두 제공: (a) **사다리꼴 근사** (선형 보간; 사건 사이의 강도를 양 끝점의 평균으로 근사 → biased 이나 빠름), (b) **Monte Carlo 100-sample 적분** (구간 $[t_j, t_{j+1}]$ 에서 균일 sampling → unbiased 이나 비용 대). 사용자 트레이드오프 선택권 제공.
4. **점과정 표준 6 벤치마크 모두에서 SOTA** 보고. Synthetic Hawkes 의 ground-truth 강도 회복(parameter recovery)부터, 실제 사건 시퀀스(Retweet, StackOverflow, MIMIC-II, MemeTrack, Financial)의 log-likelihood / accuracy / RMSE 까지. baseline 은 RMTPP, NHP, SAHP.

### 방어 가능한 주장

- **Self-attention 의 distance-agnostic 가중** 이 사건 시퀀스의 **long-range trigger** (예: 한 주 전 게시물이 오늘의 reply 를 유발) 를 잡는다는 inductive-bias 정당화.
- **Closed-form 강도** 가 사건 사이 임의 시각의 강도를 $h_j$ 만으로 재구성 가능 → 로그가능도 적분이 dimensional collapse 없이 계산 가능.

### 약한 / 의심 가는 지점

- **시간 임베딩의 선택**: sinusoidal time encoding 은 wall-clock 단위에 의존. 데이터셋별 단위 차이(초/분/시/일)가 성능에 직접 영향 — 저자 README 가 "RMSE 단위 불일치 주의" 를 직접 경고.
- **강도의 시간 의존성이 $\alpha_k \cdot (t - t_j)/t_j$ 라는 단순 선형 항으로 표현**됨. NHP 의 continuous-time LSTM 처럼 강도가 사건 사이에서 비-단조로 변할 수 있는 표현력을 잃었을 가능성. (대안: Neural ODE 강도, attention 자체를 연속화)
- **적분의 unbiased 방식이 비용을 100× 부담** (100 samples × 모든 사건 구간). 실용에선 biased 사다리꼴이 default 일 가능성.
- **본 환경 본문 미접근**으로 절대 수치·구체 baseline 차이는 본 해체에서 단정하지 않음.

### 이론적 기여

마운트 베이스라인을 **"강도 = embedding 의 affine + softplus"** 라는 한 줄로 통합했고, 이 결정이 이후의 모든 transformer-based TPP(Temporal Attention Augmented THP, SMURF-THP, Mamba Hawkes Process, From Hawkes to Attention, Interpretable THP) 가 그대로 채택하는 표준 강도 헤드가 되었다.
