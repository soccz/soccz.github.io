# 02. 제목과 Abstract 풀어 읽기

## 2.1 제목 — "Deep Learning in Asset Pricing"

한국어: **"자산가격결정의 딥러닝"**

단어별 풀이:

| 영어 | 한국어 | 풀이 |
|------|--------|------|
| Deep Learning | 딥러닝 | 다층 신경망 학습 기법 |
| Asset Pricing | 자산가격결정 | 위험과 기대수익의 균형 이론 |

→ "**딥러닝 도구를 자산가격결정 문제에 정통적 (no-arbitrage 일관) 방식으로 적용**".

---

## 2.2 저자 정보

| 저자 | 소속 | 역할 |
|------|------|------|
| **Luyang Chen** | Stanford ICME (Institute for Computational and Mathematical Engineering) | 1저자, 박사과정 |
| **Markus Pelger** | Stanford MS&E (Management Science & Engineering) | 책임저자, Lettau-Pelger (2020) RP-PCA 의 동일 저자 |
| **Jason Zhu** | Stanford MS&E | 공저자 |

**중요**: Pelger 가 RP-PCA (Lettau-Pelger 2020, 자산가격결정의 PCA 일반화) 직후 발표한 후속 연구. RP-PCA 와의 비교가 본 논문 Section III.J 에 포함.

---

## 2.3 Abstract — 3 sentences 정확히

paper Abstract (arXiv v6, journal p.1, 정확한 원문):

### 첫 문장
> **원문**: "We use deep neural networks to estimate an asset pricing model for individual stock returns that takes advantage of the vast amount of conditioning information, while keeping a fully flexible form and accounting for time-variation."

**의역**: "개별 주식 수익률의 자산가격결정 모델을 deep neural network 로 추정. 대량의 conditioning 정보 활용 + 완전 자유 함수형 + 시간 변동 반영."

**풀이**:
- **Conditioning information**: 자산 특성 (firm characteristics) + 거시 변수 (macroeconomic variables). 총 46 + 178 변수.
- **Fully flexible form**: 신경망의 universal approximation → 어떤 함수도 근사.
- **Time-variation**: β 와 risk premium 모두 시점에 따라 변동.

### 둘째 문장
> **원문**: "The key innovations are to use the fundamental no-arbitrage condition as criterion function, to construct the most informative test assets with an adversarial approach and to extract the states of the economy from many macroeconomic time series."

**의역**: "핵심 혁신: (1) **no-arbitrage 조건을 criterion (loss) 으로 사용**, (2) **adversarial 접근으로 가장 정보적인 test asset 구성**, (3) **여러 macroeconomic 시계열에서 경제 상태 추출**."

**풀이**: 본 논문의 **3가지 핵심 contribution**:
1. **No-arbitrage as loss**: $\mathbb{E}[M R^e g] = 0$ 의 squared deviation 을 minimize.
2. **Adversarial GAN**: 가장 mispriced 한 $g$ 를 자동 발견.
3. **LSTM macro states**: 178 macro 시계열 → 4 hidden state.

### 셋째 문장 (마지막)
> **원문**: "Our asset pricing model outperforms out-of-sample all benchmark approaches in terms of Sharpe ratio, explained variation and pricing errors and identifies the key factors that drive asset prices."

**의역**: "Sharpe ratio, explained variation, pricing error 모든 면에서 OOS 에서 benchmark 압도 + key factor 식별."

**풀이**:
- **3개 지표 통합 평가**:
  - SR (Sharpe ratio of SDF): 운용 효율
  - EV (explained variation): 시계열 R² 같은 것
  - XS-R² (cross-sectional R²): 횡단면 pricing error
- **Key factor**: 변수 중요도 ranking 으로 어떤 특성이 SDF 에 가장 기여하는지 명시.

---

## 2.4 Keywords 및 JEL Classification

paper 본문 (Abstract 하단):

**Keywords**:
- Conditional asset pricing model
- No-arbitrage
- Stock returns
- Non-linear factor model
- Cross-section of expected returns
- Machine learning
- Deep learning
- Big data
- Hidden states
- GMM

**JEL Classification**: C14, C38, C55, G12

---

## 2.5 Abstract 를 한 그림으로

```
┌──────────────────────────────────────────────────────────┐
│  Fundamental no-arbitrage condition (Eq 2):                │
│       E[ M(t+1) · R^e(t+1,i) · g(I_t, I_{t,i}) ] = 0      │
│                                                           │
│       └──┬──┘     └──────────┘     └──────────┘           │
│         SDF      excess return    test asset cond.        │
│       (network) (data)            (network!)              │
│                                                           │
│  Minimax game (Eq 3):                                     │
│    min_ω  max_g  (1/N) Σ_j |E[M R^e g]|²                  │
│    └─┬─┘  └─┬─┘                                           │
│    SDF    Adversary                                       │
│   (FFN+   (FFN+                                           │
│    LSTM)   LSTM)                                          │
│                                                           │
│  Macro states (LSTM):                                     │
│    178 macro time series  →  4 hidden states              │
│                                                           │
│  Result (paper Table I, OOS Test 1992–2016):              │
│    Model    SR     EV       XS-R²                         │
│    GAN     0.75   0.08      0.23  ← all three best        │
│    EN      0.50   0.04      0.19                          │
│    FFN     0.44   0.04      0.15                          │
│    LS      0.42   0.03      0.14                          │
│  → GAN dominates on all three metrics                     │
└──────────────────────────────────────────────────────────┘
```

→ **No-arbitrage loss + adversarial + LSTM macro = compounded contributions**.

---

## 2.6 미리 던지는 질문들

이 Abstract 가 본문에서 어떻게 펼쳐지나:

1. **No-arbitrage 가 loss 가 된다는 게 정확히 무슨 의미?** → Section I.B (Eq 2, 3)
2. **Adversarial 이 어떻게 GAN 으로 구현되나?** → Section II.D
3. **178 macro 시계열을 LSTM 으로 어떻게 처리?** → Section II.C
4. **3개 지표 (SR, EV, XS-R²) 의 정확한 정의?** → Section II.F
5. **SR=0.75 vs FFN=0.44 가 정말 의미있는 차이인가?** → Section III.C, Table I
6. **어떤 firm characteristic 이 가장 중요?** → Section III.F, Figs 11–12
7. **Macro 시계열의 hidden state 가 business cycle 을 잡나?** → Section III.G, Fig 13

각 챕터에서 답을 찾아간다.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. **본 논문의 3가지 key innovation 은?**
2. **GAN minimax 게임의 두 네트워크가 각각 무엇을 결정?**
3. **3개 평가 지표 (SR, EV, XS-R²) 가 모두 필요한 이유는?**

### 답변
1. (a) No-arbitrage 조건 $\mathbb{E}[M R^e g] = 0$ 의 squared deviation 을 loss 로 사용, (b) adversarial 접근으로 가장 mispriced 한 conditioning function $g$ 를 자동 발견, (c) LSTM 으로 178 macro 시계열에서 hidden states 추출.
2. **SDF network**: $\omega(I_t, I_{t,i})$ — 어떤 자산을 얼마나 long/short 하여 SDF portfolio 만들지. **Conditional network**: $g(I_t, I_{t,i})$ — 어떤 test asset 으로 SDF 를 검사할지. minimax: SDF 는 pricing error 최소화, conditional 은 최대화.
3. (a) SR 은 운용 효율, EV 는 시계열 변동 설명, XS-R² 는 횡단면 mean 설명. (b) 한 모델이 SR 만 높을 수 있음 (예: extreme portfolio loading만 잘 잡음). 세 지표가 함께 좋아야 진짜 자산가격결정 모델. (c) paper Appendix B simulation 이 이를 증명.

---

## 2.7 Keywords 의 자세한 의미

paper 의 Keywords 10개를 한 줄씩 풀이:

| Keyword | 의미 | paper 에서의 역할 |
|---------|------|----------------|
| **Conditional asset pricing model** | $\omega_t = f(I_t, I_{t,i})$ — char + macro 의 함수 | 본 paper 의 framework |
| **No-arbitrage** | $\exists M$ such that $E[M R^e] = 0$ | Loss 의 토대 |
| **Stock returns** | CRSP individual returns 1967-2016 | Empirical 분야 |
| **Non-linear factor model** | $\beta = f(z)$ (nonlinear) vs linear FF | GAN 의 차별 |
| **Cross-section of expected returns** | $E[R^e_i]$ 의 자산 간 차이 | XS-R² 의 측정 대상 |
| **Machine learning** | NN + adversarial | 도구 |
| **Deep learning** | Multi-layer NN | FFN, LSTM |
| **Big data** | 178 macro + 46 chars + 10K stocks × 600 month | 데이터 scale |
| **Hidden states** | LSTM 의 economic state | Macro processing |
| **GMM** | Generalized Method of Moments | Eq 2 의 framework |

→ 10 keywords 가 paper 의 모든 핵심 element 포함.

---

## 2.8 JEL Classification 의 자세한 의미

| Code | 분야 | paper 에서의 위치 |
|------|------|----------------|
| **C14** | Semiparametric and Nonparametric Methods | NN 의 universal approximation |
| **C38** | Classification methods, cluster analysis, principal components, factor models | Factor models, FFN, LSTM |
| **C55** | Large data sets — modeling and analysis | Big data (178 + 46 chars) |
| **G12** | Asset pricing, trading volume, bond interest rates | Main application domain |

→ JEL codes 가 paper 의 **methodological breadth + financial application** 강조.

---

## 2.9 Acknowledgments 에서 보이는 학계 위치

paper 의 acknowledgments 섹션은 매우 길어 (약 50명+) 본 paper 가 주류 자산가격결정 학계의 깊은 review 거쳤음을 보여줌:

- **Bryan Kelly** — Yale, KPS IPCA 의 동일 저자.
- **Doron Avramov** — ML asset pricing 권위자.
- **John Cochrane** — "Asset Pricing" 교과서 저자.
- **Andreas Neuhierl** — Freyberger-Neuhierl-Weber 의 동일 저자.
- **Lars Hansen** — GMM 원조 (acknowledgment 없지만 GMM 인용).
- **Nick Polson** — Bayesian ML 권위자.
- 다수의 conference: Utah Winter Finance, GSU-RSF FinTech, LBS Summer Symposium 등.

→ paper 가 학계에서 **highly cited + carefully reviewed** 인 증거.

---

## 2.10 paper 의 4 contribution summary (Methodological + Empirical)

### Methodological (3 contributions)

1. **Adversarial GMM** — Hansen-Jagannathan minimax 의 NN 일반화 (Section I.B).
2. **LSTM macro states** — 178 macro → 4 hidden state (Section II.C).
3. **Low-SNR risk premium extraction** — no-arbitrage 로 noise 차단 (Section II).

### Empirical (5 findings)

1. **Economic constraints help ML** — EN > FFN (Table I).
2. **Linear in isolation, nonlinear in interaction** — Figs 14/15.
3. **Test assets matter** — adversarial → SR 20% ↑.
4. **Macroeconomic states matter** — LSTM 의 결정적 효과 (Fig 6).
5. **Complementary to multi-factor models** — IPCA 와 결합 (Section III.J).

→ 3 methodological + 5 empirical = paper 의 **full contribution profile**.
