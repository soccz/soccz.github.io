# 01. 시작하기 전에 — 미리 알아둘 개념

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

### 1. "Stochastic Discount Factor (SDF)" 이 뭐예요?

자산가격결정의 **fundamental 도구**. 모든 자산 가격을 한 변수 $M$ 으로 표현:

$$
\mathbb{E}[M_{t+1} R^e_{t+1,i}] = 0 \quad \text{for all } i
$$

- $R^e$ = excess return (risk-free 빼기)
- $M$ = SDF (= 1 / gross return on a particular portfolio)
- **모든 자산의 expected excess return = 0 when discounted by M**.

**비유**: 모든 자산을 "공정 가격" 으로 만드는 universal 할인율.

**핵심 사실**: SDF 가 존재 ⇔ no-arbitrage. 따라서 SDF 추정 = no-arbitrage 와 일치하는 자산가격결정 모델.

### 2. "No-arbitrage" 가 뭐예요?

**위험 없는 초과수익이 없다** 는 시장 조건.

- 수학적: 모든 자산의 α (pricing error) = 0.
- SDF 표현: $\exists$ strictly positive $M$ such that $\mathbb{E}[M R^e] = 0$.

본 논문이 통합하는 것: 이 조건을 **신경망 loss 에 직접** 포함.

### 3. "GMM (Generalized Method of Moments)" 이 뭐예요?

계량경제학 표준 기법. **모멘트 조건**$\mathbb{E}[\text{moment}_d(\theta)] = 0$ 으로 모수 $\theta$ 추정.

본 논문: 모멘트 조건이 무한개 — $\mathbb{E}[M R^e g(I)] = 0$ for any $g$.

**Adversarial** : 가장 mispriced 한 $g$ 를 찾아 SDF 를 그것에 맞춰 학습.

### 4. "GAN (Generative Adversarial Network)" 이 뭐예요?

ML 분야의 minimax 게임 학습.

원래 (Goodfellow 2014):
- Generator: 가짜 데이터 만든다
- Discriminator: 진짜 vs 가짜 구분

본 논문 (adversarial 응용):
- SDF network ($\omega$): SDF 만든다 → pricing error 최소화 시도
- Conditional network ($g$): mispriced test asset 만든다 → pricing error 최대화 시도

→ 두 네트워크가 **경쟁** 하며 SDF 가 robust 해짐.

### 5. "LSTM (Long Short-Term Memory)" 이 뭐예요?

RNN (Recurrent Neural Network) 의 변형. **장기 시계열 의존성** 학습.

본 논문 사용: **178개 macroeconomic 시계열 → 4개 hidden state** 압축. business cycle 같은 long-range dynamics 자동 학습.

비유: 단순 RNN 이 "최근 몇 달만 기억" 하면, LSTM 은 "기억할 가치 있는 것만 골라 장기 보관".

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
