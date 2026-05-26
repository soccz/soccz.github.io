# 12. Conclusion — Section IV

> **🧒 한 줄 요약**: Conclusion. Deep learning SDF + GAN의 *industry-leading 성과*.


> Section IV (paper p.45–46) — 본 논문의 4가지 결론 + 후속 연구 함의.

## 12.1 챕터 한 줄 요약

본 논문은 (1) ML 의 asset pricing 잠재력 입증, (2) **no-arbitrage 가 ML flexibility 보다 중요**, (3) macro 시계열 dynamic 처리 결정적, (4) "**asset pricing 은 single char 으로는 linear, multi char interaction 으로는 nonlinear**" — 4가지 결론. 새로운 benchmark test asset 과 macro hidden state 제공.

---

## 12.2 본 논문 의 핵심 contribution 요약

paper p.45 본문:
> "We propose a new way to estimate asset pricing models for individual stock returns that can take advantage of the vast amount of conditioning information, while keeping a fully flexible form and accounting for time-variation. For this purpose, we combine three different deep neural network structures in a novel way: **A feedforward network** to capture non-linearities, **a recurrent (LSTM) network** to find a small set of economic state processes, and **a generative adversarial network** to identify the portfolio strategies with the most unexplained pricing information. Our crucial innovation is the **use of the no-arbitrage condition as part of the neural network algorithm**."

→ **4가지 element**:
1. FFN — 비선형 / interaction
2. LSTM — economic state 추출
3. GAN (adversarial) — informative test asset 자동 생성
4. No-arbitrage condition as loss

---

## 12.3 4가지 Primary Conclusions

paper p.45:
> "Our primary conclusions are four-fold."

### 결론 1: ML 의 asset pricing 잠재력
> "First, we demonstrate the potential of machine learning methods in asset pricing. We are able to identify the key factors that drive asset prices and the functional form of this relationship on a level of generality and with an accuracy that was not possible with traditional econometric methods."

→ ML 이 asset pricing 에서 **새로운 가능성**. 기존 econometrics 가 못 잡던 함수형·정확도.

### 결론 2: No-arbitrage 의 결정적 역할
> "Second, we show and quantify the importance of including a no-arbitrage condition in the estimation of machine learning asset pricing models. **The 'kitchen-sink' prediction approach with deep learning does not outperform a linear model with no-arbitrage constraints.** This illustrates that a successful use of machine learning methods in finance requires both subject specific domain knowledge and a state-of-the-art technical implementation."

→ **FFN < EN** (Table I). No-arbitrage > ML flexibility.

paper 핵심 메시지: **"domain knowledge + state-of-the-art technique 둘 다 필요"**.

### 결론 3: Time dimension 의 중요성
> "Third, financial data have a time dimension which has to be taken into account accordingly. Even the most flexible model cannot compensate for the problem that macroeconomic data seems to be uninformative for asset pricing if only the last increments are used as input. We show that macroeconomic conditions matter for asset pricing and can be summarized by a small number of economic state variables, which depend on the complete dynamics of all time series."

→ **LSTM hidden states** 가 필수. raw difference 만으로는 macro 정보 손실.

### 결론 4: Linear vs Nonlinear 의 정확한 의미
> "Fourth, **asset pricing is actually surprisingly 'linear'**. As long as we consider anomalies in isolation the linear factor models provide a good approximation. However, **the multi-dimensional challenge of asset pricing cannot be solved with linear models and requires a different set of tools**."

→ 본 논문의 가장 미묘한 발견:
- **Single char → SDF**: linear approximation 잘함.
- **Char × char interaction → SDF**: nonlinear 본질적.

---

## 12.4 실용적 기여 (Practical Benefits)

paper p.45–46:
> "Our results have direct practical benefits for asset pricing researchers that go beyond our empirical findings."

### 기여 1: 새 Benchmark Test Assets
> "First, we provide a new set of benchmark test assets. New asset pricing models can be tested on explaining our SDF portfolio respectively the portfolios sorted according to the risk exposure in our model. These test assets incorporate the information of all characteristics and macroeconomic information in a small number of assets. **Explaining portfolios sorted on a single characteristic is not a high hurdle to pass.**"

→ 향후 asset pricing 연구는 **본 논문의 GAN portfolio + β-sorted decile** 을 test 해야. single-char anomaly 는 너무 쉬워서 차별 안 됨.

### 기여 2: Macro Hidden States
> "Second, we provide a set of macroeconomic time series of hidden states that encapsulate the relevant macroeconomic information for asset pricing. These time series can also be used as an input for new asset pricing models."

→ 4 LSTM hidden state 가 **다른 asset pricing 모델의 input** 으로 활용 가능.

### 기여 3: 개별 자산의 risk + portfolio weight
paper p.46:
> "Last but not least, our model is directly valuable for investors and portfolio managers. The main output of our model is the risk measure β and the SDF weight ω as a function of characteristics and macroeconomic variables. Given our estimates, the user of our model can assign a risk measure and its portfolio weight to an asset even if it does not have a long time series available."

→ **β, ω 가 char, macro 의 함수** — 새 자산 (IPO 등) 도 short series 만 있으면 즉시 적용 가능.

---

## 12.5 본 논문 의 학술적 위치 — 한 그림

```
[ Asset Pricing 의 진화 ]                                
                                                          
  CAPM (1964)                                             
    │                                                     
    ▼  단일 요인                                          
  Fama-French 3, 5 (1993, 2015)                           
    │                                                     
    ▼  observable factors, static β                       
  PCA factor models (Connor-Korajczyk 1986)               
    │                                                     
    ▼  latent factors                                     
  KPS / IPCA (2019)                                       
    │                                                     
    ▼  conditional, linear β(z)                           
  Lettau-Pelger RP-PCA (2020)                             
    │                                                     
    ▼  variance + mean (risk-premium aware PCA)           
  Gu-Kelly-Xiu Autoencoder (2021)                         
    │                                                     
    ▼  conditional, nonlinear β(z)                        
  ┌──────────────────────────────────────────────┐        
  │  본 논문 Chen-Pelger-Zhu (2021)               │        
  │  conditional, nonlinear, no-arbitrage loss   │        
  │  + adversarial test asset + LSTM macro       │        
  └──────────────────────────────────────────────┘        
    │                                                     
    ▼  ?                                                  
  (Future): causal, cross-asset, regime-aware            
```

---

## 12.6 본 논문 후속의 자연스러운 방향

paper 미명시지만 명백한 후속:

### (1) Causal / Mechanism analysis
GAN 의 SDF 가 **무엇 때문에** 잘 작동? interpretability 강화.

### (2) Cross-asset extension
주식 외 채권, 외환, 상품, 암호화폐 등.

### (3) Real-time deployment
ensemble training cost 절감, online learning.

### (4) Multi-factor model integration (이미 본 논문 III.J)
IPCA factor 와 GAN SDF 결합 — paper Section III.J 가 시작.

### (5) Macro state 의 economic interpretation
4 hidden state 가 정확히 어떤 경제 quantity 인지 — explicit mapping.

---

## 12.7 가장 강력한 한 문장

본 논문을 한 문장으로 요약하면:

> **"No-arbitrage 를 loss 로, adversarial network 를 test asset 생성기로, LSTM 을 economic state extractor 로 — 세 신경망과 한 이론 제약으로 50년 OOS 에서 SDF Sharpe 0.75 의 자산가격결정 모델을 얻었다."**

이 문장이 본 논문의:
- **방법론** (no-arb + GAN + LSTM)
- **결과** (OOS SR 0.75)
- **기여** (ML × 자산가격결정 통합)

을 모두 포착.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. 본 논문 4 conclusions 중 가장 surprising 한 것?
2. "Kitchen-sink prediction does not outperform linear no-arbitrage" 의 의미?
3. 본 논문이 후속 연구자에게 남긴 가장 큰 도구?

### 답변
1. **결론 4** — "Asset pricing is actually surprisingly 'linear'" 가 가장 surprising. 통념 (그리고 본 논문 의 motivation): "복잡한 비선형 필요". 실제 발견: **개별 특성** 의 SDF 효과는 거의 linear. 비선형은 **특성 간 interaction** 에서. 이는 linear FF model 의 60년 성공을 설명하면서 동시에 비선형의 정확한 위치 (multi-dim) 를 지정.
2. paper 본문: GAN > EN > FFN > LS. 즉 **EN (linear + no-arb) > FFN (nonlinear + no-no-arb)**. 단순 ML "데이터 던지면 deep network 가 답 줘" approach 가 linear 의 이론 제약 모델 보다 못함. **Domain knowledge (no-arbitrage) + ML technique 둘 다** 필요. ML 만 으로는 자산가격결정 안 됨.
3. **새 benchmark test asset**. β-sorted GAN portfolio 와 GAN SDF portfolio 자체. 향후 새 자산가격결정 모델은 single-char anomaly 만 설명해서는 안 되고, **GAN portfolio 도 설명** 해야 함. 본 논문 자체가 "explaining portfolios sorted on a single characteristic is not a high hurdle to pass" 라고 명시. 학계의 새 standard.
