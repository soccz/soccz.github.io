# 01. 시작하기 전에 — 미리 알아둘 개념

> **🧒 한 줄 요약**: Paper intro. SDF + macro state + adversarial moments framework.


## 이 논문이 뭘 하는 논문인가요?

한 문장으로:

> **"자산가격결정의 fundamental no-arbitrage 조건 (E[M·R = 0]) 을 deep neural network 의 loss 로 직접 통합한다. GAN (Generative Adversarial Network) 방식으로 SDF 와 test asset 을 동시 학습."**

조금 더 풀면:

- 자산가격이론의 fundamental equation: $\mathbb{E}[M_{t+1} R^e_{t+1,i}] = 0$ (모든 자산 $i$). $M$ 은 stochastic discount factor (SDF).
- 무한히 많은 test asset 가능 — $\mathbb{E}[M_{t+1} R^e_{t+1,i} g(I_t, I_{t,i})] = 0$ for any function $g$.
- 본 논문: **두 신경망이 경쟁** — (1) SDF network 는 $M$ 을 만들어 pricing error 최소화, (2) Conditional (adversarial) network 는 $g$ 를 만들어 mispriced test asset 최대화. minimax 게임.
- 추가 혁신: **LSTM 으로 macroeconomic 시계열 (178개) → 4개 hidden state**. business cycle dynamics 자동 학습.
- 결과: 50년 OOS (1992–2016) **SR 0.75 vs FFN 0.44 vs EN 0.50 vs LS 0.42** — 압도.

---

## 이 해설집 구성

논문은 4개 Section + Appendix A-I. 우리 해설은 18 챕터로 분해:

```
[Section I] Model
   I.A No-Arbitrage (Eq 1)
   I.B Adversarial GMM (Eq 2, 3)
   I.C Alternative Models
        ↓
[Section II] Estimation
   II.A Loss Function (Eq 4)
   II.B FFN
   II.C RNN with LSTM
   II.D GAN
   II.E Hyperparameters + Ensemble
   II.F Model Comparison + Metrics
        ↓
[Section III] Empirical Results
   III.A Data (50년, 10K stocks, 46 chars, 178 macro)
   III.B Illustrative GAN example (SVI)
   III.C-D Cross section (Tables I, II)
   III.E Characteristic sorted portfolios
   III.F-G Variable importance + SDF structure
   III.H-J Robustness + multi-factor models
        ↓
[Section IV] Conclusion
        ↓
[Appendix A-I] FFN/RNN details, simulation, SDF overview, characteristics list, etc.
```

---

## 미리 알아둬야 하는 5가지 개념

각 개념은 **친근한 비유 → 정확한 정의 → 본 논문 역할** 순서로 풀어 설명한다.

### 1. "Stochastic Discount Factor (SDF)" 이 뭐예요?

#### 친근한 비유 먼저

**시간 여행자의 환율 변환표** 같은 것. 미래 1달러가 지금 얼마 가치인가? — 평소엔 0.95달러쯤, 호황엔 0.99, 불황엔 0.85. 즉 **상황 (state) 마다 다른 할인율**.

자산가격결정의 관점: "**미래 수익을 지금 가치로 환산할 때**, 시점·상황에 따라 다른 할인율 적용" — 이게 SDF.

- 시장 호황 시 미래 1달러 가치 ↓ (할인율 작음) → 위험 자산이 많이 벌 때는 그 돈이 덜 귀함.
- 시장 불황 시 미래 1달러 가치 ↑ (할인율 큼) → 위험 자산 손실 시 그 돈이 매우 귀함.

이 "state-dependent 할인율" 이 SDF $M$.

#### 정확한 정의

자산가격결정의 **fundamental 도구**. 모든 자산 가격을 한 변수 $M$ 으로 표현:

$$
\mathbb{E}[M_{t+1} R^e_{t+1,i}] = 0 \quad \text{for all } i
$$

- $R^e$ = excess return (risk-free 빼기)
- $M$ = SDF (= 1 / gross return on a particular portfolio)
- **모든 자산의 expected excess return = 0 when discounted by M**.

**의미**: SDF $M$ 으로 할인하면 모든 자산의 기대 초과수익이 0 — 즉 "공정 가격".

#### 본 논문의 역할

**핵심 사실**: SDF 가 존재 ⇔ no-arbitrage. 따라서 SDF 추정 = no-arbitrage 와 일치하는 자산가격결정 모델. paper 는 SDF $M_{t+1} = 1 - \omega_t^\top R^e_{t+1}$ 형태로 정규화하고 $\omega_t$ 를 deep neural network 로 학습.

### 2. "No-arbitrage" 가 뭐예요?

#### 친근한 비유 먼저

**공짜 점심은 없다** 는 시장 원리. 만약 "**위험 없이 무조건 수익**" 이 가능하다면, 모든 사람이 그 기회를 노려 가격이 즉시 조정 → 기회 소멸. 그래서 **균형 시장에는 무위험 차익 기회 없음** = no-arbitrage.

예: "주식 A 를 사고 B 를 팔면 위험 없이 +1% 수익" 이 가능하다면, 모두가 그렇게 함 → A 가격 ↑, B 가격 ↓ → 즉시 그 차이 소멸.

#### 정확한 정의

**위험 없는 초과수익이 없다** 는 시장 조건.

- 수학적: 모든 자산의 α (pricing error) = 0.
- SDF 표현: $\exists$ strictly positive $M$ such that $\mathbb{E}[M R^e] = 0$.

#### 본 논문의 역할

이 조건을 **신경망 loss 에 직접** 통합. 기존 ML 모델 (FFN 등) 은 이 조건 무시 → variance 학습은 잘 하지만 risk premium 학습 약함. paper 는 loss function 에 $\mathbb{E}[M R^e g]$ 형태로 명시적 도입.

### 3. "GMM (Generalized Method of Moments)" 이 뭐예요?

#### 친근한 비유 먼저

**여러 시험을 동시에 통과하는 학생**. 한 시험만 만점이면 우수 학생? 아닐 수도. **수학 + 영어 + 과학 모두** 만점이어야 진짜 우수 학생. GMM 의 정신: "**여러 모멘트 조건을 동시에 만족시키는 모수**" 추정.

OLS: 1 조건만 사용 (FOC). GMM: $D$ 조건 사용. 더 많은 조건 ↔ 더 robust 추정.

#### 정확한 정의

계량경제학 표준 기법. **모멘트 조건**$\mathbb{E}[\text{moment}_d(\theta)] = 0$ 으로 모수 $\theta$ 추정.

본 논문: 모멘트 조건이 무한개 — $\mathbb{E}[M R^e g(I)] = 0$ for any $g$.

**Adversarial** : 가장 mispriced 한 $g$ 를 찾아 SDF 를 그것에 맞춰 학습.

#### 본 논문의 역할

**무한 GMM** → **Adversarial 로 무한을 유한으로 환원**. Adversary 가 "지금 가장 mispriced 된 portfolio" 를 자동 발견 → SDF 가 그걸 고치도록 학습. 80,000 test asset 같은 효과.

### 4. "GAN (Generative Adversarial Network)" 이 뭐예요?

#### 친근한 비유 먼저

**위조 화폐 사례**. 두 사람이 게임:
- **위조범** (Generator): 가짜 지폐 만든다, 진짜처럼 보이게 노력.
- **수사관** (Discriminator): 진짜 vs 가짜 구분 노력.

둘이 경쟁하며 위조범은 더 정교한 위조 + 수사관은 더 예리한 감별. 균형 도달 시 **위조 지폐가 진짜와 거의 구별 안 됨** = generator 가 진짜 distribution 학습 완료.

본 논문 (adversarial 응용):
- **SDF network ($\omega$)** = "**가격 책정자**" — 자산 가격을 SDF $M$ 으로 책정. Pricing error 최소화 노력.
- **Conditional network ($g$)** = "**아비트라저**" — 가장 mispriced 된 portfolio 찾기 시도. Pricing error 최대화.
- 둘 경쟁 → SDF 가 점점 robust 해짐 (모든 portfolio 정확 가격결정).

#### 정확한 정의

ML 분야의 minimax 게임 학습. 원래 (Goodfellow 2014):
- Generator: 가짜 데이터 만든다
- Discriminator: 진짜 vs 가짜 구분

본 논문 (adversarial 응용):
- SDF network ($\omega$): SDF 만든다 → pricing error 최소화 시도
- Conditional network ($g$): mispriced test asset 만든다 → pricing error 최대화 시도

→ 두 네트워크가 **경쟁** 하며 SDF 가 robust 해짐.

#### 본 논문의 역할

paper 의 핵심 architectural innovation. 단순 NN 으로 SDF 추정하면 일부 자산만 잘 가격결정 + 나머지는 무시. Adversarial 로 "모든 자산을 동시에 잘 가격결정" 강제.

### 5. "LSTM (Long Short-Term Memory)" 이 뭐예요?

#### 친근한 비유 먼저

**일기장 + 메모지** 의 차이. 단순 RNN 은 메모지 — 매일 새로운 메모로 옛 메모 덮어씀. 1주일 전 일은 거의 잊음. LSTM 은 일기장 + **gate 시스템**:
- **Forget gate**: "이 옛 기억은 지워도 됨" 판단
- **Input gate**: "이 새 정보는 일기장에 기록할 가치 있음" 판단
- **Output gate**: "지금 결정에 어떤 과거 기억 꺼낼까" 판단

결과: **수십 년 전 일도 필요하면 정확히 기억**. Business cycle (10년 주기) 같은 장기 dependency 학습에 결정적.

#### 정확한 정의

RNN (Recurrent Neural Network) 의 변형. **장기 시계열 의존성** 학습.

본 논문 사용: **178개 macroeconomic 시계열 → 4개 hidden state** 압축. business cycle 같은 long-range dynamics 자동 학습.

비유: 단순 RNN 이 "최근 몇 달만 기억" 하면, LSTM 은 "기억할 가치 있는 것만 골라 장기 보관".

#### 본 논문의 역할

178 macro time series 의 raw input 직접 사용은 비효율. LSTM 이 **시간 정보 + 변수 정보 둘 다 압축** → 4 차원 hidden state. 이 4개 state 가 SDF/Adversary network 의 macro 조건으로 입력. **Time-aware compression**.

---

## 이 논문을 읽을 때의 마음가짐

| 관심 | 우선 챕터 |
|------|--------|
| 큰 그림만 | 01 (이 파일) → 02 → 03 → 09 (실증) |
| 방법론 | 04 → 05 (4 파일) → 06 |
| 신경망 / ML | 05b (FFN) → 05c (LSTM) → 05d (GAN) |
| 실증 / 응용 | 08 → 09 → 10 → 11 |
| 통찰 / 시사 | 15 |
| 실행 코드 | 16 |

---

## 한 가지 약속

- 수식은 모두 보여준다 (생략 X)
- 한 줄씩 풀어 설명한다 (의역 X)
- 처음 등장 용어는 그 자리에서 풀이한다
- 무배경 독자도 따라올 수 있게, 전공자도 새 통찰 얻게

다음 [02_abstract.md](02_abstract.md) — Abstract 한 문장씩.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. **SDF 가 자산가격결정에서 핵심인 이유는?**
2. **GAN 의 두 네트워크가 본 논문에서 무엇을 만드나?**
3. **LSTM 이 왜 RNN 보다 본 논문에 적합한가?**

### 답변
1. SDF 가 존재 ⇔ no-arbitrage. 따라서 SDF 추정 = no-arbitrage 와 일관된 자산가격결정 모델 추정. 모든 자산의 expected return 을 한 변수 $M$ 으로 통합 설명.
2. **SDF network ($\omega$)**: stochastic discount factor $M_{t+1} = 1 - \omega^\top R^e$ 의 weights 학습 → pricing error 최소화. **Conditional network ($g$)**: test asset conditioning function 학습 → mispriced asset 발견 (pricing error 최대화). 두 네트워크가 minimax 경쟁.
3. macroeconomic 시계열은 **business cycle** 같은 장기 의존성 (수년~수십년) 포함. 단순 RNN 은 long-range gradient 가 vanish/explode 함. LSTM 은 gate 구조로 "기억할 가치 있는 정보만 장기 보관" 가능 → business cycle pattern 자동 학습.
