# 08. 결론과 의의 — 무엇이 남았나

> **🧒 한 줄 요약**: Conclusion. Complexity virtue + ridge regularization.


> 본 논문이 *자산가격결정* 분야에 *무엇을 남겼는지* 한 페이지에 정리. *Occam's blunder* 의 의미.

---

## 8.1 챕터 한 줄 요약

> **"2008년 Goyal-Welch 의 *시장 예측 불가* 결론을 같은 데이터로 *정반대* 결론으로 변환. 통계학자 George Box (1976) 의 *parsimony* 권고가 *misspecified 모델 (= 모든 현실 모델)* 에서는 *틀린 권고* 임을 RMT 로 증명. 머신러닝 자산운용의 이론적 정당화 + *Occam's razor → Occam's blunder*."**

---

## 8.2 본 논문이 *학계에 남긴* 5가지

### 1. *복잡함의 미덕* (Theorem 1)

> **"적절한 ridge shrinkage 와 함께, 모델 복잡도 ↗ → OOS Sharpe ratio *단조 증가*."**

**Implication**: *Use the largest model you can compute*. 자산가격결정 분야의 새 *권장 사항*.

### 2. *R² ≠ 경제 가치*

> **"R² 가 *마이너스 100% 이하* 여도 Sharpe ratio 양수 가능."**

**Implication**: 학계가 50년 *R²* 만 보던 관습 끝. *Sharpe ratio, IR, max loss, skewness* 같은 *경제 metric* 으로 evaluate.

### 3. *Misspecified > Correctly specified*

> **"이상적 환경에선 simple model OK. 그러나 *모든 현실 모델은 misspecified* → complex 가 더 좋다."**

**Implication**: *Box (1976) 의 parsimony 권고* 가 *실제 응용에선 틀림*.

### 4. *Random Matrix Theory 의 finance 적용*

> **"1967년 발명된 *RMT* 가 자산가격결정 의 *새 분석 도구* 임을 증명."**

**Implication**: 향후 finance 연구가 *RMT 위에 build*.

### 5. *실증 결과 — Risk on/off 자동 학습*

> **"머신러닝이 *constraint 없이* Campbell-Thompson nonnegativity + recession divestment 자동 학습."**

**Implication**: 자산운용 업계 (AQR, ...) 의 *ML 활용* 의 학문적 정당화.

---

## 8.3 *Occam's Razor → Occam's Blunder* — 본 논문 의 핵심 메시지

본 논문의 *가장 인상적인 발견*. 통계학자 George Box (1976, *Science and Statistics*) 의 두 명언:

### Box 의 명언 1 — "모든 모델은 틀렸다"

> **"All models are wrong, but some are useful."**

→ *Universal misspecification* — 모델은 *항상* 자연의 *일부만* capture.

### Box 의 명언 2 — Parsimony 권고

> **"Just as the ability to devise simple but evocative models is the signature of the great scientist, so overelaboration and overparameterization is often the mark of mediocrity."**

→ *Simple model 이 좋고 complex model 은 *bad* 라는 권고.

### Box 의 self-contradiction

본 논문이 짚은 *내부 모순*:
- (명언 1) 이 *misspecification 의 universality*.
- (명언 2) 가 *parsimony 권고*.
- *Misspecified* 에서 *simple* 이 좋다는 (2) 가 (1) 의 universality 와 *충돌*.

### 본 논문의 해결

> **"Misspecified + optimal ridge → *complex > simple* (Theorem 1)."**

Box 본인의 (1) 을 *logical conclusion* 까지 밀고 가면 (2) 가 *틀리다*.

### Memorable phrase

본 논문 conclusion 의 명언:

> **"Occam's razor may instead be Occam's blunder."**

번역: *"오컴의 면도날이 사실 오컴의 실수일 수 있다."*

→ 14세기 윌리엄 오브 옥캄 (William of Occam) 의 *간단함의 원칙* 이 *21세기 misspecified ML 에서는 실수*. 본 논문의 *학문적 도전* 이 정리된 명언.

---

## 8.4 본 논문의 *practical recommendation* (저자의 직접 권고)

본 논문 conclusion 에서 저자가 *명시적* 으로 학자/실무자에게 권고:

### 권고 1 — *All plausibly relevant predictors* 포함

> **"임의 변수 추가하지 마라. *합리적으로 관련 있는 모든* 변수 포함하라."**

핵심: *arbitrary* 아닌 *relevant*. Goyal-Welch 15 변수처럼 *finance 이론적으로 의미 있는* 변수.

### 권고 2 — *Rich nonlinear models* 사용

> **"단순 선형 모델보다 *비선형 (nonlinear)* 모델."**

방법: Random Fourier Features, neural network, kernel methods. 본 논문 사용: RFF.

### 권고 3 — *Prudent shrinkage*

> **"*적절한* ridge shrinkage 사용. 너무 작지도, 너무 크지도 않게."**

본 논문 실증: $z = 10^3$ 정도가 robust.

### 권고 4 — *Small raw predictors 도 OK*

> **"Raw 변수가 적어도 (15개 같은) — *비선형 확장 (RFF)* 으로 *high-dim* 만들면 됨."**

본 논문: 15 → 12,000.

---

## 8.5 *미래 연구 방향* (저자가 명시)

본 논문이 *open question* 으로 남긴 것들:

### 1. Cross-section 으로 확장

> *"본 논문은 single asset (시장 지수) 만. Cross-section (개별 주식) 으로 일반화?"*

자산운용의 *cross-section ML* (Gu-Kelly-Xiu 2020 등) 에 본 논문 *Theorem 1 의 cross-section version* 적용 필요.

### 2. Non-isotropic β

> *"본 논문은 β isotropic 가정. 일반 β 분포 (Bartlett 의 benign overfit 같은 PC concentration) 로 확장?"*

Hastie et al (2022) 의 generic β 분석을 본 논문 framework 에 통합.

### 3. Time-varying β

> *"본 논문은 stationary 가정. Regime change (1970s 인플레, 2008 GFC, 2020 COVID) 의 implication?"*

Time-varying coefficient model 로 확장.

### 4. Other asset markets

> *"Equity 외 bond, FX, commodity, crypto?"*

다른 시장에서 *Virtue of Complexity 의 robustness* 검증.

### 5. Online learning

> *"Recursive 학습 (본 논문) 대신 online sequential 학습?"*

Real-time 적용 가능성.

---

## 8.6 *학계 임팩트* — 본 논문이 가져올 변화

### Theoretical wave 의 출발점

2018-2023 ML × finance 의 *empirical wave* 이후, 본 논문이 *theoretical wave 의 first work*. 향후 5+년 동안:
- *Cross-section ML 의 이론* (Theorem 1 의 cross-section version).
- *Multi-asset ML 의 이론*.
- *Regime-aware ML* 의 이론.

→ 모두 본 논문의 *framework (RMT + ridge + RFF)* 위에 build.

### Evaluation paradigm 전환

학계가 50년 *R²* 만 보던 관습 → *Sharpe / IR / tail risk* 의 panel.

특히 Goyal-Welch (2008) 같은 *R² 비관 논문* 들의 *재해석*. 같은 데이터로 *정반대 결론* 가능 — *방법론의 한계* 였다는 정리.

### 실무 (자산운용) 의 정당화

AQR (Bryan Kelly 본인이 head of ML), Two Sigma, Renaissance 같은 *ML 자산운용 기업* 들의 *학문적 정당화*. *"ML 이 작동한다"* + *"왜 작동하는지"* 양쪽.

---

## 8.7 한 그림으로 — 본 논문이 자산가격에 남긴 것

```
   1950-2024 자산가격결정 학계의 흐름
   ─────────────────────────────────

   1960s-1980s    CAPM, APT (Ross 1976)              ◀── 이론 출발
        │
        ▼
   1990s          Fama-French 3 factor              ◀── 실증 시도
        │
        ▼
   2000s          Conditional, Bayesian models      ◀── 정교화 시도
        │
        ▼
   2008 GW shock  "시장 예측 불가"                   ◀── 학계 비관
        │
        ▼
   2010s ML wave  Gu-Kelly-Xiu, Chen-Pelger-Zhu     ◀── 실증 성공
        │       (empirically works but why?)
        ▼
   ★ 2024 VoC ★  Kelly-Malamud-Zhou                ◀── 이론적 정당화
        │       Theorem 1 (Virtue of Complexity)
        │       Random Matrix Theory + ridge
        │
        ▼
   향후 5+년      Cross-section, multi-asset,        ◀── *향후 paper*
                   regime-aware, online learning
                   (모두 본 논문 framework 위에 build)
```

---

## 8.8 자기점검

### 핵심 3가지
1. **본 논문이 학계에 남긴 5가지?**
2. **"Occam's razor may be Occam's blunder" 의 의미?**
3. **저자의 practical recommendation 4가지?**

### 답변
1. **(i) Theorem 1 (Virtue of Complexity)** — Sharpe ratio 가 complexity 의 monotone 증가. **(ii) R² ≠ economic value** — R² 음수 임에도 Sharpe 양수 가능. **(iii) Misspecified > correctly specified** — 모든 현실 모델 misspecified, complex 가 더 좋다. **(iv) RMT 의 finance 적용** — 1967년 도구의 자산가격결정 응용. **(v) ML 자산운용의 이론적 정당화** — 실증 효과의 *왜* 의 답.
2. Box (1976) 의 두 명언의 *내부 모순*: "(1) 모든 모델은 틀렸다 + (2) parsimony 가 좋다". (1) 의 universality 가 (2) 의 권고와 *충돌*. 본 논문이 (1) 의 logical conclusion 까지 밀고 가면 *(2) 가 틀림* — *misspecified + optimal ridge → complex > simple* (Theorem 1). 14세기 William of Occam 의 *간단함의 원칙* 이 21세기 misspecified ML 에서는 *실수 (blunder)*.
3. **(i) All plausibly relevant predictors 포함** — arbitrary 가 아닌 relevant. **(ii) Rich nonlinear models** — 단순 선형이 아닌 비선형 (RFF, NN, kernel). **(iii) Prudent shrinkage** — 적절한 ridge ($z = 10^3$ 정도). **(iv) Small raw predictors 도 OK** — 15 변수라도 *비선형 확장 (RFF 12,000)* 으로 high-dim 만들면 됨. → 실증의 *Goyal-Welch 15 + RFF + $z = 10^3$* 가 이 4 권고의 구현.

---

다음 챕터: [11_insights.md](11_insights.md) — 메타 통찰 12개 — *논문이 진짜 가르치는 것*.
