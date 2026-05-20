# 13. 메타 통찰 (Meta Insights)

> 본 논문이 던지는 **12 가지 메타 메시지** — 단순 결과를 넘어, 자산가격결정과 ML 학계 전체에 대한 함의.

## 📌 이 챕터 다 읽으면 알 수 있는 것

- 본 논문이 **단순 새 모델 발표가 아닌** 학계 전체에 던지는 12 가지 메시지
- 각 통찰의 **구체적 출처** (어떤 paper 결과에서 도출했는지)
- 후속 학계가 어디로 갈지의 4 가지 방향

각 통찰 머리에 **🌱 일상 비유** 한 줄 + **🎯 구체 증거** 를 박았습니다. 수식 없이도 메시지 자체는 다 받아들일 수 있게.

## 13.1 통찰 1: "ML 의 black box 비판" 은 잘못된 프레임

🌱 **일상 비유**: "AI 가 답을 내지만 왜 그렇게 답하는지 모른다" 는 통념. 사실은 "잘 들여다보는 도구 (variable importance 등) 가 있다" 는 게 본 논문의 답.

🎯 **구체 증거**: paper Prop 1·2 (수학적 동치성) + Fig 4·5 (변수 중요도) + Fig 6 (네트워크 분리 검증) — **3 가지 도구로 black box 비판 반박**.

**통념**: 신경망은 해석 불가능 → 금융처럼 책임이 무거운 도메인에 부적합.

**본 논문 반박**:
- **수학적 동치성** 으로 표준 모델과 연결 (Prop 1, 2) → 출발점이 익숙.
- **Variable importance** (특성 zero-out → R² 감소 측정) 로 변수별 영향 분해 가능 (Fig 4, 5).
- **β-network vs factor-network 분리 importance** 로 모델 내부 구조 검증 (Fig 6).

→ 신경망이 "해석 불가" 인 것이 아니라 **해석을 위한 추가 작업 필요**. 본 논문이 그 작업의 표준 제공.

---

## 13.2 통찰 2: "Factor Zoo" 의 종말

🌱 **일상 비유**: "수십 년간 학계가 'A 가 위험요인이다, B 도, C 도, ...' 하며 동물원 (zoo) 처럼 factor 가 쌓임". 본 논문이 ML 로 "사실 그중 20 개만 진짜" 라고 정리.

🎯 **구체 증거**: paper Fig. 4·5 — 94 특성 중 top 20 이 모델 contribution 의 ~90% (CA1–CA3). 나머지 ~74개는 거의 noise.

**Cochrane (2011 AFA Address)**: 학계가 매년 새 factor 를 발견하지만, 대부분 중복/우연.

**본 논문 응답**:
- 94 개 특성 중 **top 20 이 contribution 의 ~90%** (paper Section 3.6, Fig. 4–5).
- → 새로운 factor 발견보다 **기존 factor 들을 통합/정리** 하는 데이터 기반 접근 필요.

후속 연구 방향: **"Significance under multiple testing"** (Harvey, Liu, Zhu 2016, Fama & French 2018) 의 정량적 검증.

---

## 13.3 통찰 3: "Linear models work" 의 진실은 "limited"

🌱 **일상 비유**: 학생-시험으로 — "수학시험 성적 = 0.3×학습시간 + 0.2×성적 + ..." 같은 선형 진단은 "야간형 + 벼락치기" 같은 **상호작용** 을 못 잡음. 그래서 비선형 NN 필요.

🎯 **구체 증거**: paper Table 2 (K=6) — IPCA 0.30 → CA2 0.58 (~2배). Table 3 — Sharpe 0.96 → 1.53 (~1.6배). Section 4 시뮬에서 nonlinear DGP 일 때 CA1 31.8 vs IPCA 11.9 (2.7배) — **인과적 검증**.

**FF → IPCA** 의 진화는 모두 **선형 모델 안의 확장**. 본 논문은 이 framework 가 **본질적 한계** 를 가짐을 입증.

**증거 (paper Table 2, 3 K=6)**:
- IPCA Predictive R² = 0.30 → CA2 = 0.58 (≈ 1.9x).
- IPCA Sharpe (VW LS) = 0.96 → CA2 = 1.53 (≈ 1.6x).
- 이 격차는 **선형 모델로는 회복 불가능** — paper Section 4 시뮬에서 인과 검증 (Nonlinear DGP 에서 CA1 31.8 vs IPCA 11.9).

**해석**: 시장의 비선형 anomaly 는 본질적으로 비선형이다. (구체적 함수 형태 — size × momentum interaction 등 — 은 paper 본문 22쪽 내 명시 안 됨.)

---

## 13.4 통찰 4: "No-Arbitrage" 는 자유롭게 설정 가능한 옵션이 아니다

🌱 **일상 비유**: "AI 가 미래 수익을 예측" 은 자유롭게 가능. 하지만 자산가격에서는 "이 수익은 위험 보상 외에서 나오면 안 된다" 는 절대 규칙 (no-arbitrage) 이 있음. 본 논문은 **이 규칙을 모델 구조에 박아 자동 충족**.

🎯 **구체 증거**: paper Eq. 9 — $r = \beta'f + u$ 에 절편 $\alpha$ **없음**. 결과: Fig. 3 — 95 포트폴리오 중 \|t(α)\|>3 개수가 FF5 37 → CA2 **8** (잔존 α 도 < 7 bps/월). 약 78% 감소.

**ML 패러다임 (X → y 예측)**: 모델 형태 자유. Loss 만 정의하면 됨.

**자산가격결정 패러다임**: **r = β'f + u** 형태 강제. **α 가 0** 이 자동 조건. 

본 논문의 통찰: **모델 아키텍처에서 α 자체를 제거**. 그러면 어떤 학습 알고리즘이든 자동으로 no-arbitrage 와 일치.

→ "이론을 손실에 추가" 가 아닌 **"아키텍처에 강제"** 가 깨끗한 방식.

---

## 13.5 통찰 5: "Two networks + dot product" 은 일반적 패턴

🌱 **일상 비유**: "두 사람의 점수 = (사람 A 의 특성) · (사람 B 의 특성)" 형태는 추천 시스템·검색·신약 등에서 표준. 본 논문은 이걸 처음 자산가격에 적용.

🎯 **구체 증거**: paper Fig. 2 — β-network (z 의 함수) + f-network (r 의 함수) + 가운데 dot product. 이게 그 도메인 표준 architecture.

본 논문의 핵심 아키텍처:
$$
\hat r = \beta(z)' f(r)
$$

이 패턴은 자산가격결정을 넘어 광범위하게 응용 가능:

| 도메인 | β | f | dot product 의미 |
|--------|---|---|------------------|
| 추천 시스템 | user embedding | item embedding | preference score |
| NLP retrieval | query embedding | document embedding | relevance |
| 신약 발견 | drug embedding | protein embedding | binding affinity |
| 이미지 검색 | image embedding | text embedding | similarity |

→ 본 논문이 **이 패턴을 자산가격결정에 처음 적용** 한 모범. ML 의 dual encoder 모델군의 금융 적용.

---

## 13.6 통찰 6: "OOS validation" 의 새 기준

🌱 **일상 비유**: 학생-시험으로 — 일반 ML 검증은 "문제집을 무작위 섞어 80/20 분할". 본 논문은 "**1957~1986 으로만 공부 → 1987~2016 본시험**". 시간 순서 절대 안 섞음.

🎯 **구체 증거**: 30년 OOS (1987-2016), 매년 재학습 → 학계 표준 (보통 5-10년 OOS) 의 3배.

대부분 ML 논문: random train/test split (e.g., 80/20).

본 논문: **30년 chronological rolling OOS**.

| 기존 ML 표준 | 본 논문 |
|--------------|---------|
| 80% train, 20% test | 18년 train + 12년 val + 1년 test |
| 단발 평가 | 30번 재학습 (1987–2016) |
| Look-ahead 검증 약함 | 완전 차단 |

→ 시계열 데이터에서는 **chronological + rolling retrain** 이 표준이어야. 본 논문이 그 기준 제시.

---

## 13.7 통찰 7: "Sparsity" 는 가정이 아니라 발견

🌱 **일상 비유**: "데이터에 정답이 있다 — 우리가 가정 안 해도, 모델이 자기 학습으로 '20 개면 충분' 이라고 보여줌". LASSO 가 가정한 sparsity 가 실증적으로 확증.

🎯 **구체 증거**: paper Fig. 4·5 — CA0: top 20 → 80%, CA1-3: top 20 → 90%. 즉 데이터-driven 결과.

학계 통념: 자산가격결정은 소수 factor 로 충분 (예: FF 3-5개).

**본 논문 발견** (paper Section 3.6, Figs 4–5): variable importance 분석에서 **top 20 특성이 contribution 의 ~80% (CA0) ~ ~90% (CA1–CA3) 차지**. 나머지 ~74 개는 near-zero contribution.

→ Sparsity 는 **우리가 가정해야 할 것** 이 아니라 **데이터가 보여주는 사실**. ML + variable importance 가 이 사실을 발견.

---

## 13.8 통찰 8: "Interaction" 이 학계가 놓친 곳

🌱 **일상 비유**: 학생 약점 진단할 때 — "학습시간" 따로, "야간형" 따로 본다. 사실 "야간형 + 벼락치기" 의 **상호작용** 이 더 큼. 학계가 이걸 못 잡았다는 가설.

🎯 **구체 증거**: paper Section 4 simulation, nonlinear DGP — $\beta_2 = 2 c_{i1} \times c_{i2}$ (interaction) + $\beta_3 = 0.6 \cdot \mathrm{sgn}(c_{i3})$. CA1 31.8 vs IPCA 11.9 (Total R², K=3). 2.7배 격차.

대부분 factor 연구: 개별 anomaly 발견 (size, value, momentum, ...).

본 논문 발견: 비선형 NN 만이 잡을 수 있는 효과가 실재 — paper Section 4 simulation 의 nonlinear DGP (c1 × c2 interaction + sgn(c3)) 에서 CA1 이 IPCA 의 2.7× Total R² 달성.

→ 후속 연구는 **single anomaly 발견** 보다 **anomaly 들 사이의 interaction / 함수형 비선형** 에 집중해야. (구체 인터랙션 형태 — size × momentum 등 — 의 paper 본문 명시는 22쪽 내 미발견.)

---

## 13.9 통찰 9: Cross-section robustness

🌱 **일상 비유**: "1반 학생으로 약점 진단법 만든다 → 2반에서 적용해도 정확". 학습한 패턴이 **특정 자산군만의 운** 이 아닌 **시장 보편 구조**.

🎯 **구체 증거**: paper Table 5 — Odd permno 학습 → Even 평가: Total R² 13.6, Pred R² 0.49, SR 2.38 / 1.26. In-sample (Odd→Odd: 13.7, 0.48, 2.42, 1.28) 과 거의 동일.

paper Table 5: CA2 를 odd permno 로만 학습 → even permno 로 평가해도 Total R² 13.5–13.7, Pred R² 0.48–0.54, EW SR 2.38–2.53 — 거의 변동 없음.

→ 학습된 비선형 매핑이 **자산 특이적이 아닌 횡단면 보편 구조** 반영.

학계 함의: 다른 자산군 (다른 시장, 채권, 외환) 으로 확장 가능성 시사. **모델 외삽 (extrapolation) 의 robustness 측정 표준** 제공.

---

## 13.10 통찰 10: "Replication crisis" 의 부분적 해소

🌱 **일상 비유**: "한 명씩 따로 검증하면 통과하는데, 다 같이 검증하면 절반이 떨어진다" — 학계 anomaly 의 replication 위기. 본 논문은 94 개를 동시에 한 framework 에 넣어 자동 순위 매김.

🎯 **구체 증거**: paper Section 3.6 — 94 anomaly 동시 검증, top 20 만 살아남고 ~74 개는 near-zero. McLean-Pontiff (2016) 의 "절반은 못 살아남는다" 와 부합.

학계 위기: 발표된 anomaly 의 절반 이상이 **out-of-sample replication 실패** (McLean & Pontiff 2016).

본 논문 contribution: **94 개 anomaly 를 한 framework 에서 동시 검증**. 결과:
- 그중 **top ~20 이 contribution 의 약 80% (CA0), 90% (CA1–CA3) 차지**.
- 나머지는 contribution near zero.

→ 본 논문이 **각 anomaly 의 relative importance** 를 자동 부여. Replication crisis 대응의 한 도구.

---

## 13.11 통찰 11: "Causality" 는 다음 단계

🌱 **일상 비유**: "겨울에 아이스크림 판매↓, 빙판 사고↓" — 둘이 상관 있지만 인과 아님 (둘 다 추위가 원인). 본 논문은 "예측" 까지, "왜 그런지 (인과)" 는 후속 과제.

🎯 **구체 증거**: 본 논문은 predictive R² (Eq. 21) 평가만. Causal 효과는 별도 framework (DAG, IV) 필요.

본 논문은 **predictive** 모델 — 특성이 미래 수익을 **예측**.

**한계**: 예측력 ≠ 인과성. 예:
- "작은 회사가 더 큰 reversal 효과" — 인과? 아니면 작은 회사의 다른 특성 (illiquidity 등) 이 진짜 원인?

**다음 단계**: 
- **Causal inference** (DAG, instrumental variable).
- **Mechanism analysis**: 왜 작은 회사에서 reversal 이 강한가?

→ 본 논문 framework 가 그 출발점.

---

## 13.12 통찰 12: "ML × 경제이론" 의 모범

🌱 **일상 비유**: "ML 도구 + 도메인 지식 + 점진적 일반화 + 엄격한 검증" 의 깨끗한 통합. 본 논문이 다른 도메인 (의료·교육·기후 등) ML 응용의 **레시피북** 역할 가능.

🎯 **구체 증거**: 7 단계 (이론 출발 → ML 선택 → 이론 부합으로 수정 → 동치성 증명 → 일반화 → OOS 검증 → 해석 가능성). 각 단계가 본 논문에 정확히 매핑.

본 논문이 **ML + 경제이론 통합의 모범 예시**:

| 단계 | 본 논문의 행동 |
|------|----------------|
| 1. 이론에서 출발 | r = β'f, no-arbitrage 명시 |
| 2. 표준 ML 도구 선택 | autoencoder (dual encoder + bottleneck) |
| 3. 이론과 일치하게 수정 | α 제거, dot product 강제 |
| 4. 기존 방법과 연결 | Prop 1, 2 로 PCA, IPCA 와 동치 |
| 5. 일반화로 확장 | NN 깊이 추가 → CA1, CA2, CA3 |
| 6. 엄격한 검증 | 30년 OOS rolling, simulation |
| 7. 해석 가능성 | variable importance (zero-out R²), β/factor-network 분리 importance |

→ 어떤 도메인의 ML 적용도 이 7단계를 따르면 좋음. **"ML 으로 새로운 결과 얻기"** 의 표준 절차.

---

## 13.13 메타 통찰 종합

🌱 **일상 비유**: "AI 가 의사를 대체하는 게 아니라, 의학 이론을 더 정확히 구현하는 도구다" — 본 논문이 자산가격결정에서 한 일.

```
┌────────────────────────────────────────────────────┐
│  본 논문이 던지는 가장 큰 한 가지 메시지:           │
│                                                    │
│  "ML 은 자산가격결정을 대체하지 않는다.            │
│   ML 은 자산가격결정을 **완성** 한다."             │
│                                                    │
│  - 이론 (no-arbitrage) 을 강제하고                 │
│  - 데이터 (94 anomaly) 의 비선형을 발견하고        │
│  - 30년 OOS 에서 검증되는                          │
│  - 통합된 framework                                │
└────────────────────────────────────────────────────┘
```

🎯 **구체 증거**: 4개 평가 지표 (Table 1·2·3·4 + Fig 3) 모두 압도 + Prop 1·2 (수학적 연결성) + Section 4 시뮬 (인과 검증). **이론 + 데이터 + 검증의 3 방향이 동시 만족** 되는 드문 경우.

---

## 13.13b 🆚 본 논문 vs RPPCA (Lettau-Pelger 2020) — 자매 논문 비교

> 본 해체와 [RPPCA deep dive](../2026-05-17_lettau-pelger-rppca/00_README.md) 는 **같은 날짜 (2026-05-17) 출간** + **같은 주제 (잠재 요인 자산가격결정)** 를 다룸. 두 paper 가 같은 문제를 다른 방향으로 풀었다는 점을 명시.

### 두 paper 의 공통 문제

> "자산가격결정에서 잠재 요인을 더 잘 추정하려면?"

### 두 paper 의 다른 답

| | **RPPCA** (Lettau-Pelger 2020) | **AE-AP** (Gu-Kelly-Xiu 2021) |
|---|--------------------------------|--------------------------------|
| **핵심 도구** | PCA + 평균 페널티 (γ) | Autoencoder (β-net = NN) |
| **공격 지점** | "PCA 는 평균을 무시" | "IPCA 는 선형" |
| **추가 prior** | 위험프리미엄 (mean signal) 정규화 | 비선형 함수형 (NN) |
| **수학적 도구** | Marchenko-Pastur, Cauchy transform (RMT) | Universal approximation, NN training |
| **잡는 요인** | 약한 + 높은 SR 요인 (PCA 미검출) | 비선형 노출도 (IPCA 미검출) |
| **실증 자랑 수치** | Sharpe 2배 (vs PCA) | Sharpe 1.53 vs FF -0.53 |
| **데이터** | Kozak·Nagel·Santosh N=370 portfolios | CRSP individual stocks, 30K + 94 chars |
| **검증 강도** | Theorem 1·2, RMT 점근 + 시뮬 | Prop 1·2 동치성 + Monte Carlo + 60년 OOS |

### 두 paper 의 학계 메시지 비교

| | **RPPCA** | **AE-AP** |
|---|------------|------------|
| 한 줄 메시지 | "**통계학 + 자산가격이론 의 60년 분리** 를 끝낸 사례 — 도메인 prior 를 정규화로 끼워넣기" | "**ML 은 자산가격결정 을 대체하지 않는다, 완성한다** — 이론 (no-arbitrage) 을 강제하고 데이터 (94 anomaly) 의 비선형을 발견" |
| 통찰 일반화 | "도메인 prior 를 어떤 ML 도구에든 끼워넣기" 가능 | "Two networks + dot product" 아키텍처가 자산가격 외에도 추천·NLP·신약 등 광범위 응용 |

### 두 paper 가 같이 보면 더 강력한 이유

1. **둘 다 같은 framework (잠재 요인 모델)** 안에서 작동.
2. **둘 다 PCA/IPCA 한계 극복** — 다른 각도로.
3. **결합 가능성**: RP-PCA 의 mean penalty + AE 의 비선형 NN → 하이브리드 모델 (학계 후속 연구).

### 두 paper 가 본 해체에서 다루는 chapter 매핑

| 주제 | RPPCA 챕터 | AE 챕터 |
|------|------------|---------|
| 동기 | [03_motivation](../2026-05-17_lettau-pelger-rppca/03_motivation.md) | [03_motivation](03_motivation.md) |
| 방법론 (수식) | [05_method_a~f](../2026-05-17_lettau-pelger-rppca/05_method_a_objective.md) | [05_method_a~d](05_method_a_standard_AE.md) |
| 시뮬레이션 | [06_simulation](../2026-05-17_lettau-pelger-rppca/06_simulation.md) | [09_simulation](09_simulation.md) |
| 실증 | [07_empirical](../2026-05-17_lettau-pelger-rppca/07_empirical.md) | [07_empirical + 08_chars](07_empirical_R2_sharpe_alpha.md) |
| 증명 | [09_appendix_proof](../2026-05-17_lettau-pelger-rppca/09_appendix_proof.md) | [11_appendix_proofs](11_appendix_proofs.md) |
| 통찰 | [11_insights](../2026-05-17_lettau-pelger-rppca/11_insights.md) | [13_insights](13_insights.md) (이 챕터) |
| 코드 | [12_code](../2026-05-17_lettau-pelger-rppca/12_code.md) | [14_code](14_code.md) |

---

## 13.14 본 논문 이후 — 학계의 4가지 갈래

🌱 **일상 비유**: "이 논문이 4개 길의 입구가 됐다. 후속 연구가 이 4 방향으로 펼쳐짐". 본 논문은 **branching point** 역할.

본 논문 이후 자산가격결정 + ML 의 연구 방향:

### 갈래 1: Architecture 진화
- Transformer 기반 factor model.
- Recurrent factor model (time-varying state).
- Attention mechanism 으로 cross-sectional weighting.

🌱 **비유**: "MLP 에서 Transformer 로 — NLP 의 발전을 자산가격에 transfer".

### 갈래 2: Cross-Asset 확장
- 채권, 외환, 상품, 암호화폐로 확장.
- 자산군 간 spillover 학습.

🌱 **비유**: "주식만의 학생-시험을 → 채권·외환 학생도 같은 framework 로 진단". Table 5 의 cross-section robustness 가 이 확장의 근거.

### 갈래 3: Causal & Mechanism
- 단순 예측 → 인과 해석.
- Anomaly 의 economic mechanism 발견.

🌱 **비유**: "이 학생이 약점이 있는 게 왜 인지 — 추측에서 인과로". 통찰 11 의 후속.

### 갈래 4: Production / Trading
- Transaction cost, capacity constraint 통합.
- Real-time inference, online learning.
- Reinforcement learning 으로 직접 policy 학습.

🌱 **비유**: "이론적 Sharpe 1.53 을 실제 거래비용·매매한도 아래 0.8 정도라도 안정적 운용". 학계 → 실제 자금운용으로의 다리.

본 논문은 이 4갈래 모두의 **공통 출발점**.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. 본 논문이 ML 의 black box 비판에 답하는 3가지 방법은?
2. Factor Zoo 문제와 본 논문의 sparsity 발견의 관계는?
3. "ML × 경제이론" 의 7단계 모범 중 가장 어려운 단계는?

### 답변

1. **본 논문이 ML 의 black box 비판에 답하는 3 가지 방법**:
   - **(a) 수학적 동치성 (Prop 1·2)**: "신경망이 새로운 게 아니라 PCA/IPCA 의 자연스러운 확장". Standard AE = PCA, Conditional AE (CA0) = IPCA — 친숙한 모델로 가는 다리.
   - **(b) Variable Importance (zero-out R² reduction)**: 한 특성을 0 으로 두고 R² 감소량 측정 → 각 특성의 **NN 비선형 효과 직접 포착**. partial derivative 보다 정확.
   - **(c) β-network vs factor-network 분리 importance (Fig 6)**: 두 네트워크가 독립 학습됐는데 같은 특성을 중요하게 → **모델 내부 구조 검증**. 우연 아닌 데이터 구조.
   - **종합**: ML 이 "interpret 불가" 가 아닌 "**해석을 위한 추가 작업 필요**". 본 논문이 그 작업의 표준 제공.

2. **Factor Zoo 와 sparsity 발견의 관계**:
   - **Factor Zoo 의 정의 (Cochrane 2011 AFA)**: "학계가 매년 새 factor 를 발견하지만 대부분 중복/우연. 학계가 동물원 (zoo) 처럼 너무 많은 factor 를 쌓아둠".
   - **본 논문의 응답**: 94 개 anomaly 를 한 framework 에 동시 검증 → top 20 이 contribution 의 **~90%** (CA1-3) / ~80% (CA0). 나머지 ~74 개는 near-zero.
   - **메커니즘**: ML 이 **사후 검증 도구** 역할. 단일 factor 만으로 검증하면 다 의미 있어 보이지만, 동시에 검증하면 진짜 ~20 만 살아남음.
   - **학계 함의**: 새 factor 발견의 **brake (제동)** 역할. 향후 연구는 새 발견보다 **기존 정리·통합** 에 집중.
   - **Replication crisis 부분 해소**: McLean-Pontiff (2016) 의 "절반 OOS 실패" 와 부합 — 본 논문이 그 절반을 자동 식별.

3. **7 단계 모범 중 가장 어려운 단계**:
   - **단계 3 — "이론과 일치하게 수정"** 이 가장 어려움.
   - **이유 1 — 도메인 이론 깊이 이해 필요**: 본 논문 저자들이 IPCA 의 정확한 메커니즘 (KPS 의 동일 저자 Kelly 포함) 을 알아야 했음. 자산가격결정 (no-arbitrage, SDF, conditional factor) 의 미묘한 통찰 필요.
   - **이유 2 — ML 도구 자유도 정확 파악**: Autoencoder 의 어디를 건드릴 수 있고 어디를 건드리면 망가지는지 알아야. β-network 만 비선형, f-network 는 단일 선형 유지 — 이런 디자인은 ML 표준 가르치는 데 안 나옴.
   - **본 논문의 미묘한 통찰**: "α 제거 = no-arbitrage 강제" — Loss 에 추가가 아닌 **아키텍처에 강제**. 이게 단계 3 의 정확한 실현.
   - **다른 6 단계도 어려운가?**: 단계 1 (이론 출발) 은 익숙. 단계 4 (동치성 증명) 은 mathematical labor. 단계 6 (OOS 검증) 은 computational labor. 단계 3 은 **창의적 통찰** 이 필요.
