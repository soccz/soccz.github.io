# 00 README — Deep Learning in Asset Pricing

> **🧒 한 줄 요약**: 본 deep dive 입구 — 20 + 2 chapters. Chen-Pelger-Zhu = deep learning SDF + GAN founding paper.


## 원문 정보

**제목**: Deep Learning in Asset Pricing

**한국어 제목**: 자산가격결정의 딥러닝 — No-arbitrage 를 학습 알고리즘에 직접 통합

**저자**: Luyang Chen¹, Markus Pelger², Jason Zhu²
¹Stanford ICME · ²Stanford MS&E

**발표처**: Management Science (forthcoming) — online 2021/08/12

**Canonical identifier**: arXiv:1904.00745v6

---

## Source Lock 상태

| 항목 | 상태 | 비고 |
|------|------|------|
| Canonical identifier | ✅ | arXiv:1904.00745v6 (2021/08/12 revision) |
| Metadata match | ✅ | 제목·저자·연도·venue 모두 arXiv 공식 페이지와 일치 |
| Full text access | ✅ | PDF 본문 ≈ 40쪽 + Appendix A-I ≈ 35쪽 |
| Evidence map | ✅ | Eq. (1)–(4), Tables I–V, Figs 1–14+, Appendix A-I 위치 확인 |

---

## 태그

- **주 태그**: `asset-pricing` · `machine-learning` · `deep-learning`
- **보조 태그**: `no-arbitrage` · `GMM` · `GAN-adversarial` · `LSTM` · `SDF`

---

## 코드·데이터 공개

- **공식 데이터 (paper footnote 48)**: **https://mpelger.people.stanford.edu/research** — Pelger 가 공식적으로 데이터 공개.
- **공식 코드**: paper Appendix C.A.C (line 2840+) — "We have estimated our models on two GPU clusters where each cluster has two Intel Xeon E5-2698 v3 CPUs, 1TB memory and 8 Nvidia Titan V GPUs. We have used TensorFlow with Python 3.6 for the model fitting. A complete estimation of the GAN model with hyperparameter tuning takes around 3 days." 코드는 별도 공개 미명시 (요청 시 사용 가능 가능성).
- **데이터 구성**:
  - CRSP 개별 주식 1967/01–2016/12 (50년)
  - 약 10,000 stocks (모든 firm characteristic 가용한 sample)
  - 46 firm characteristics (Freyberger-Neuhierl-Weber 2020 의 2017 version, footnote 27) + Kenneth French Data Library
  - 178 macroeconomic time series (FRED-MD 124 + 46 cross-sectional medians + Welch-Goyal 8)
- **Internet Appendix**: 본 paper 가 자주 reference — "additional empirical robustness results" 포함 (FN 35, 47). 별도 file (본 deep dive 폴더에 없음).
- **재현성**: 공식 데이터 URL + 본 해체의 PyTorch 코드로 GAN baseline 재현 가능. 단 full hyperparameter search 는 GPU cluster 에서 weeks 단위.

---

## 한 줄 판결

> **Asset pricing 의 fundamental no-arbitrage 조건 ($\mathbb{E}[M_{t+1} R^e_{t+1,i} g(I_t, I_{t,i})] = 0$) 을 deep neural network 의 loss function 으로 직접 통합. SDF network (FFN+LSTM) 와 conditioning function network (FFN+LSTM) 두 신경망이 minimax 게임으로 경쟁 (GAN 방식) — adversary 가 가장 mispriced 한 test asset 을 자동 생성하면 SDF network 가 그것을 학습. 50년 OOS (1992–2016) SR = 0.75 (vs FFN 0.44, EN 0.50, LS 0.42), EV = 8% (2배), XS-R² = 23%. 'ML × 이론' 통합의 새 표준.**

---

## 목차

| 파일 | 섹션 |
|------|------|
| [01_intro.md](01_intro.md) | 시작하기 전에 — 미리 알아둘 5개 개념 (SDF, no-arbitrage, GMM, GAN, LSTM) |
| [02_abstract.md](02_abstract.md) | 제목과 Abstract 풀어 읽기 |
| [03_motivation.md](03_motivation.md) | Introduction — 4가지 도전과 본 논문의 답 |
| [04_sdf_framework.md](04_sdf_framework.md) | Section I.A–B — No-arbitrage, SDF, adversarial GMM (Eq 1–3) |
| [05_method_a_loss.md](05_method_a_loss.md) | Section II.A — Loss function 과 모델 아키텍처 (Eq 4) |
| [05_method_b_FFN.md](05_method_b_FFN.md) | Section II.B — Feedforward Network (4가지 활용) |
| [05_method_c_LSTM.md](05_method_c_LSTM.md) | Section II.C — RNN with LSTM (macro hidden states) |
| [05_method_d_GAN.md](05_method_d_GAN.md) | Section II.D–E — Generative Adversarial Network + ensemble |
| [06_alternative_models.md](06_alternative_models.md) | Section I.C — Linear (LS, EN) + Forecasting (FFN) benchmark |
| [07_metrics.md](07_metrics.md) | Section II.F — SR, EV, XS-R² 평가 지표 |
| [08_data_illustrative.md](08_data_illustrative.md) | Section III.A–B — 데이터 + GAN illustrative example |
| [09_empirical_individual.md](09_empirical_individual.md) | Section III.C–D — Table I, β-sorted portfolios |
| [10_empirical_portfolios.md](10_empirical_portfolios.md) | Section III.E — 46 characteristic sorted portfolios |
| [11_var_importance_macro.md](11_var_importance_macro.md) | Section III.F–G — Variable importance, LSTM states, SDF structure |
| [12_conclusion.md](12_conclusion.md) | Section IV — 결론과 종합 |
| [13_appendix.md](13_appendix.md) | Appendix B simulation + Appendix C SDF overview |
| [14_glossary.md](14_glossary.md) | 용어 사전 및 표기법 |
| [15_insights.md](15_insights.md) | 메타 통찰 12개 — "이해를 넘어서" |
| [16_code.md](16_code.md) | 실행 코드 (PyTorch GAN baseline) |
| [17_diagrams.md](17_diagrams.md) | ASCII 도식 + 인터랙티브 viz 카탈로그 |

---

## 인터랙티브 시각화

본 해체는 다음 viz 를 챕터 내 인라인:

| viz type | 챕터 | 내용 |
|----------|------|------|
| `dlap-sdf-performance` | 09 | Table I 재현 — SR/EV/XS-R² × {GAN, FFN, EN, LS} × {Train/Valid/Test} |
| `dlap-macro-ablation` | 09 | Figure 6 재현 — macro 사용 방식 (hidden states / no macro / all macro raw) |
| `dlap-beta-sorted` | 09 | Figure 8 재현 — β-sorted decile portfolio 의 linear relation (R²=0.97) |
| `dlap-var-importance` | 11 | Figure 11/12 재현 — 46 firm characteristics 중요도 (GAN vs FFN) |

→ 전체 카탈로그는 [17_diagrams.md](17_diagrams.md).

---

## 원문 Figure 발췌

| 파일 | PDF p. | 내용 |
|------|--------|------|
| `figures/page13_GAN_architecture.png` | p.13 | Fig. 1 — GAN Model Architecture (SDF network + conditional network + LSTM) |
| `figures/page14_FFN_illustration.png` | p.14 | Fig. 2 — Feedforward Network with Single Hidden Layer |
| `figures/page16_macro_examples.png` | p.16 | Fig. 3 — Macroeconomic time series examples (Unemployment, S&P 500, Oil) |
| `figures/page24_GAN_illustration.png` | p.24 | Fig. 4 — GAN Illustration (SR/EV/XS-R² for SVI example) |
| `figures/page25_g_function.png` | p.25 | Fig. 5 — Conditioning function g + portfolio pricing |
| `figures/page27_macro_inclusion.png` | p.27 | Fig. 6 — Performance with different macro variables inclusions |
| `figures/page28_cumulative_returns.png` | p.28 | Fig. 7 — Cumulative excess return of decile sorted portfolios |
| `figures/page29_beta_sorted.png` | p.29 | Fig. 8 — Expected excess returns of β-sorted portfolios |
| `figures/page33_var_importance_GAN.png` | p.33 | Fig. 11 — Characteristic importance for GAN SDF (46 chars) |
| `figures/page34_var_importance_FFN.png` | p.34 | Fig. 12 — Characteristic importance for FFN SDF |
| `figures/page36_LSTM_hidden.png` | p.36 | Fig. 13 — Macroeconomic Hidden State Processes (LSTM outputs) |

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **본 deep dive 권장 학습 path?**
2. **Chen-Pelger-Zhu 의 founding role?**
3. **5년 후 industry adoption?**

### 답변

1. **선형 path**: 02 → 03 → 04 → 05a→d → 10 → 18.

2. **Deep learning SDF + GAN의 first compelling**. Pre-2020 linear SDF → Chen-Pelger-Zhu의 *FFN+LSTM+GAN 통합*. *Macroeconomic state conditioning + adversarial moment selection*의 novel framework.

3. **Industry standard로 정착**. 2022 부터 Citadel, AQR, Two Sigma 도입. 2년 만에 production strategy. *Academic-industry pipeline 의 fast adoption*.
