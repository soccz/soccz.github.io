# 8. 내 연구와의 연결

> **§9 봉인 준수 명시**: 이 절에서 사용자 프로젝트에 대해 단정하는 사실은 **`_profile.md`와 `_index.md`에 문자 그대로 적힌 것만**이다. 원격 실행 환경은 로컬 실물 문서(`AETHER_IDEA.md`, `PAPER_DRAFT_V1.md` 등)를 읽지 못하므로, 프로필 밖의 세부는 **"프로필 기준 미상"** 으로 표기하고 창작하지 않는다. 인용 앵커로 제시하는 절 번호·제목은 **본 논문(JKX 2023)의 것만** 원문 확인된 것이고, 사용자 원고의 절 번호는 프로필에 없으므로 지정하지 않는다.

---

## 연결 강도 사전 판정

`_profile.md`의 관심 영역 기준으로 이 논문의 연결 강도를 먼저 솔직히 매긴다.

| 영역 | 강도 | 근거 |
|---|---|---|
| **§D (TS Transformers / 2D 표현 / TSFM interp)** | **🟢 강함 — 직접** | 본 논문이 `ts-as-2d` 계열에서 유일하게 1D 동일-척도 대조군을 세운 사례. APF의 "2D motif → CNN probe" 두 단계와 방법론적으로 정면 겹침 |
| **§C (Attention as Explanation / PE-Attention 기하)** | **🟡 중간 — 방법론 전이** | 본 논문은 attention을 쓰지 않는다. 그러나 §IV의 "행동적 프로빙만으로는 부족하다"는 교훈이 attention-as-explanation 논쟁과 동형(同型) |
| **§E (금융 시계열 응용)** | **🟢 강함 — 직접** | JF 게재 개별종목 수익률 예측. P1 ProTran-TFA의 finance venue 진출 시 필수 인용·비교 대상 |
| **§A (Grokking / Delayed Generalization)** | **🟠 약함 — 전이 가능성만** | 본 논문에 학습 동역학 분석이 전혀 없다(에폭별 곡선·전이점 없음). 다만 "8년 학습 → 19년 고정"이라는 설계가 non-stationarity 축의 프로토콜로 전이 가능 |
| **§B (Mechanistic Interpretability / Circuit)** | **🟡 중간 — 반면교사로 강함** | 본 논문이 mechanistic 도구를 **하나도 쓰지 않은 공백** 자체가 사용자 피벗의 정당화 근거 |
| **§F (원거리)** | 🟠 약함 | 유전 프로그래밍 평행 연구(Liu·Zhou·Zhu 2020)가 후속 후보로 기록될 정도 |

**따라서 아래는 §D·§E를 축으로 쓰고, §B는 반면교사로, §A는 정직하게 "전이 가능성만"으로 다룬다.** 특정 draft 옹호용 강제 매칭은 하지 않는다.

---

## 1. 흡수할 기법 — 어느 수식·설계를 어디에 쓸 것인가

### 흡수 1 (최우선) — Table IX의 "모델 × 표현" 격자를 APF의 필수 대조 프로토콜로 승격

**`_profile.md`가 명시하는 APF 프레임**: "PE → 2D attention motif → CNN probe → causal intervention", 그리고 "PE 비교 (NoPE/sinusoidal/learned/RoPE/ALiBi) × motif 종류 (diagonal/stripe/block/edge/spike/checker)".

이 프레임에는 **본 논문이 자기 논문을 상대로 실행한 것과 정확히 같은 반박 위험**이 내장되어 있다. APF가 "attention motif가 예측/성능을 설명한다"를 보이려 할 때, 심사자가 물을 질문은 이것이다 — **"그 motif 정보가 2D 구조에서 오는가, 아니면 attention 행렬의 스칼라 요약통계(엔트로피·집중도·평균 거리)로 환원되는가?"**

본 논문 Table IX가 제공하는 것은 **그 질문에 답하는 격자 설계 그 자체**다. APF 버전으로 옮기면:

| APF 대조군 | 본 논문 대응 | 무엇을 배제하는가 |
|---|---|---|
| 2D CNN probe on full attention matrix $A \in \mathbb{R}^{n\times n}$ | CNN (2D, image scale) | — (기준선) |
| **1D CNN probe on row-wise summaries** (각 query 행의 요약 벡터 $n$개) | **CNN1D (image scale)** | 2D 구조가 행별 요약으로 환원되는지 |
| **로지스틱 probe on 스칼라 요약통계** (attention 엔트로피·최대값·중심거리 등 소수 특성) | Logistic (image scale) | 비선형성이 필요한지 |
| 위 셋 × **정규화 3종** (행별 softmax 그대로 / 행합 정규화 / 전역 min–max) | × 척도 3종 | **이득이 표현의 어느 성분에서 오는지** |

**이것이 이 논문에서 APF가 얻을 가장 큰 실질적 이득이다.** `_profile.md`가 기록한 APF의 현재 상태 — "TMAO method falsified at n=12, motif causality 실험 진행 중" — 는 이미 한 번의 자기 반증을 통과한 프로젝트임을 뜻한다. 즉 사용자는 자기 방법을 falsify하는 데 이미 자원을 쓴 이력이 있다. **본 논문의 Table IX는 그 falsification을 "표현 성분 분해"라는 형태로 체계화한 템플릿**이므로, 다음 review loop(프로필 기준 12회 완료)에서 바로 쓸 수 있다.

**단, 결정적 차이를 반드시 명시해야 한다.** 본 논문의 "2D"는 **가짜 2D**다 — 차트 이미지는 가로축이 시간, 세로축이 값이므로 각 시간 열이 하나의 값(집합)만 담는다. 반면 **APF의 attention 행렬 $A[i,j]$ 는 query 위치 $i$ 와 key 위치 $j$ 의 쌍(pair)을 담으므로 진짜 2차원 객체**다(GAF/MTF가 시간 쌍을 픽셀에 담는 것과 같은 종류). 그러므로 **Table IX의 결과는 APF에 대한 반박이 아니다** — 오히려 APF가 "우리의 2D는 렌더링이 아니라 관계 행렬"이라고 방어할 수 있는 대비 좌표를 제공한다. **이 구분을 APF 원고에 선제적으로 써 두면, "JKX가 2D 무용을 보였다"는 심사자 반박을 한 문장으로 차단한다.**

### 흡수 2 — CNN probe 아키텍처의 희소성 대응 설계 (Appendix p.3246–3247)

APF의 "CNN probe" 단계에서 그대로 쓸 수 있는 구체적 설계 결정 네 개. 모두 **입력이 희소하다**는 공통 조건에서 나온 것이고, attention 행렬도 (특히 diagonal/stripe/spike motif에서) 희소하다.

| 설계 | 본 논문 값 | 논거 (원문) | APF 이식 시 |
|---|---|---|---|
| **비대칭 필터** | 5 × 3 (높이 > 너비) | "Since our images are largely sparse in the vertical dimension" (p.3246) | attention 행렬의 희소 축에 맞춰 비대칭. diagonal motif는 대각 방향 희소 → **대각 방향으로 긴 필터** 또는 대각 재정렬 후 적용 |
| **축별 비대칭 풀링** | 2 × 1 (한 축만 축소) | 최종 사양 (p.3247) | motif의 **어느 축 위치를 보존해야 하는가**를 먼저 결정. APF에서 query 위치(행)는 보존, key 상대거리(열)는 축소가 자연스러움 |
| **축별 stride/dilation** | 수직 stride 1/3/3, dilation 1/2/3 (입력 길이별, 첫 층만) | 각주 19: "dilation preserves the resolution of the original image" | **motif 스케일이 다르면 dilation을 다르게** — stripe(주기적)는 dilation 유리, spike(국소)는 stride=1 필요 |
| **leaky ReLU $k$=0.01** | 각주 20 | dead neuron 방지 | 희소 입력에서 필수. attention 행렬은 대부분 0 근처 → 표준 ReLU 시 초기 필터 대량 사망 위험 |

**여기에 본 논문이 남긴 경고 하나를 반드시 붙여야 한다**: 본 논문은 **입력 길이별로 아키텍처를 다르게** 했고(stride/dilation 1/2/3, 블록 2/3/4), 그 결과 Table V의 "지평별 상관 구조 이동"을 순수한 지평 효과로 해석할 수 없게 되었다([06_experiments_a_us.md](06_experiments_a_us.md) 참조). **APF에서 motif 종류별로 probe 아키텍처를 바꾸면 같은 교란이 생긴다** — "block motif가 spike motif보다 예측력이 높다"가 motif 성질 때문인지 probe 아키텍처 때문인지 분리 불가능해진다. → **APF는 probe 아키텍처를 전 motif에 고정하고, motif 종류만 변수로 두어야 한다.**

### 흡수 3 — min–max 창내 정규화를 Grokking track의 non-stationarity 축 도구로

`_profile.md`가 기록한 Grokking track 데이터: "sin/periodic synthetic, logistic map, regime-switching synthetic, ETT-mini, Weather-mini, Traffic-mini". 그리고 4-way 교차의 한 축이 **non-stationarity**다.

본 논문 Table IX가 제공하는 것은 **세 가지 정규화의 예측력 순위**다 — 창내 min–max ≫ 누적수익률 척도 > 탈변동성 척도(붕괴). 이 순위는 시계열 정규화 선택이 **결과를 지배할 수 있다**는 정량 증거이며, 특히:

- **창내 min–max는 "국소 정규화"** 다 — 각 입력 창이 자기 자신의 통계로 정규화된다. 이것은 non-stationarity에 대한 **암묵적 대응 기법**이다(분포가 이동해도 창 내부 상대 구조는 보존).
- **탈변동성 수익률 척도는 "전역/과거 정규화"** 다 — EWMA(평활 0.05)로 창 밖의 긴 역사를 끌어온다. 그리고 이것이 **붕괴**했다(CNN1D 5일 이미지 EW 샤프 −0.13).

**Grokking track에 대한 구체적 함의**: regime-switching synthetic 데이터에서 grokking(지연된 일반화) 실험을 할 때, **입력 정규화를 국소(창내 min–max)로 할 것인가 전역으로 할 것인가가 grokking 발생 여부·타이밍을 바꿀 수 있다.** 국소 정규화는 레짐 전환을 입력 수준에서 "지워 버리므로", 모델이 레짐 구조를 학습할 필요 자체를 없앨 수 있다. 반대로 전역 정규화는 레짐 정보를 남기지만 척도 불일치로 학습을 어렵게 한다. **이 이분법을 grokking 실험의 통제 변수로 승격시키는 것이 본 논문에서 Grokking track이 얻는 것이다.**

정직한 유보: **본 논문에는 학습 동역학 분석이 전혀 없다** — 에폭별 학습/검증 곡선, 전이점, 표현 형성 시점 중 아무것도 보고되지 않는다(early stopping patience 2만 명시). 따라서 이 연결은 **"정규화 선택이 결과를 지배한다"는 사실의 전이**이지, grokking 현상에 대한 직접 증거가 아니다. **연결 강도: 전이 가능성만.**

### 흡수 4 — 회전율 정의식을 실무 지표로

본 논문 §III.B(p.3210)의 회전율 정의는 **가격 변동에 의한 비중 표류를 정확히 상쇄**하는 형태다:

$$\text{Turnover} = \frac{1}{M}\frac{1}{T}\sum_{t}\sum_{i}\left| w_{i,t+1} - \frac{w_{i,t}(1 + r_{i,t+1})}{1 + \sum_j w_{j,t} r_{j,t+1}} \right|$$

`_profile.md`의 진로 항목이 "석사 졸업 후 퀀트 / **차트 분석** industry"다. 순진한 $|w_{i,t+1} - w_{i,t}|$ 를 쓰면 표류를 거래로 오인해 회전율을 과대평가하고, 그러면 거래비용 추정이 부풀려져 멀쩡한 전략을 기각하게 된다. **이 식은 프로필의 금융 backup 데이터(Ken French 25, GSPC/IXIC 2022-2024)로 어떤 전략 백테스트를 하든 즉시 쓸 수 있는 실무 자산이다.** 그리고 최대치가 $200\%/M$ 임을 알아야 690%라는 수치를 "최대치 800%의 86%"로 정확히 읽을 수 있다.

---

## 2. 충돌·경쟁 지점

### 충돌 1 — "2D 표현이 이득이다"는 APF의 전제와 Table IX의 정면 충돌 (해소 가능)

**충돌의 형태**: APF가 "attention을 2D motif로 보는 것이 정보를 드러낸다"를 전제한다면, 심사자는 Table IX를 인용해 "JKX는 2D 렌더링이 1D 대비 이득이 없음을 보였다"고 반박할 수 있다.

**수용할 부분**: 반박의 핵심 논리는 타당하다 — **2D 표현의 이득은 주장이 아니라 대조군으로 증명해야 한다.** APF는 1D 대조군을 반드시 세워야 한다.

**반박할 부분**: 위 흡수 1에서 정리한 구분이 방어선이다. 본 논문의 2D는 **1D 시계열의 시각적 렌더링**(가로=시간, 세로=값)이고, APF의 attention 행렬은 **위치 쌍의 관계 행렬**($A[i,j]$ = query $i$가 key $j$를 얼마나 보는가)이다. 후자는 원리적으로 1D로 환원 불가능하다 — $n \times n$ 개의 쌍 정보를 $n$ 개의 시점 정보로 압축하면 반드시 정보를 잃는다. **즉 Table IX는 "모든 2D가 무용하다"가 아니라 "렌더링형 2D는 척도 효과였다"를 보인 것이며, 관계형 2D는 미검증 상태다.**

**원고에 쓸 방어 문장 초안** (APF 관련 연구 절):
> "Jiang, Kelly, and Xiu (2023) provide the only systematic decomposition we are aware of that separates the gain of a 2D representation into (i) the geometry of two-dimensional convolution and (ii) the implicit min–max rescaling that image rendering enforces; their Table IX shows that a 1D CNN matched on the latter attains equal or superior performance (e.g., 7.85 vs. 4.89 annualized Sharpe on 60-day inputs). We stress that their 2D object is a *rendering* of a univariate path — the horizontal axis is time and the vertical axis is value — whereas an attention matrix $A[i,j]$ encodes *pairs* of positions and therefore admits no lossless 1D reduction. We nonetheless adopt their control design: every motif-based probe in this paper is reported alongside a 1D probe on row-wise summaries and a logistic probe on scalar attention statistics, so that any gain we report is attributable to relational 2D structure rather than to normalization."

### 충돌 2 — 상관 기반 프로빙 vs 인과 개입 (APF가 우위인 지점)

본 논문 §IV의 해석은 **전부 상관 기반**이다 — 예측값과 기존 특성의 상관(Table V), 로지스틱 근사(Table VIII). `_profile.md`의 APF 프레임 마지막 단계는 **"causal intervention"** 이다. 이것이 사용자가 본 논문보다 방법론적으로 앞서 있는 유일한 지점이며, **가장 강하게 주장해야 할 차별점**이다.

본 논문이 이 한계를 스스로 인정한다 — §IV 도입부(p.3219): "Our attempts at interpretation are admittedly incomplete (as in the CNN literature more broadly)." 그리고 §IV.C(p.3232): "Of course, our CNN model is not ground truth."

**주목할 대비**: 본 논문에서 **인과적 성격의 실험은 딱 하나** 있다 — Table IX의 척도 교체다. 표현 성분을 바꿔 성능 변화를 측정하는 것은 **개입(intervention)** 이다. 그리고 그 유일한 개입이 논문의 가장 중요한 발견을 낳았다. **이것이 "개입 > 상관"이라는 APF의 방법론적 주장에 대한, 본 논문 스스로가 제공하는 최고의 증거다.** 인용할 때 이 아이러니를 쓸 수 있다.

### 충돌 3 — 분류 vs 확률 예측 (P1 ProTran-TFA와의 상보성)

`_profile.md`: "P1 ProTran-TFA (`paper_test/PAPER_DRAFT_V1.md` + `protran_tfa/`) — finance venue (IJF/QF) 가능", "2022AEL probabilistic Transformer 확장".

본 논문은 수익률의 **부호만** 예측한다($y \in \{0,1\}$, 식 (1) 교차엔트로피). 즉 **크기 정보를 의도적으로 버린다.** 결과의 성격이 이를 반영한다 — 주간 H-L 수익 0.83%에 샤프 7.15, 즉 **작고 확실한 우위의 대량 반복**이다. 그리고 OOS McFadden $R^2$ 가 0.73~1.39%에 불과하다(Table VII·VIII).

확률/분위 예측(ProTran-TFA 계열)은 정확히 그 반대 축에 선다 — 크기와 불확실성을 함께 모델링한다. **따라서 이것은 충돌이 아니라 상보성이며, 논문의 포지셔닝 재료다**: "JKX는 방향만으로 샤프 7을 얻었다. 그렇다면 크기·꼬리를 함께 모델링하면 무엇을 더 얻는가?"가 자연스러운 후속 질문이 된다. 특히 본 논문의 신호가 **극단 분위에서 변동성이 억제된다**는 성질(Figure 6·7, 그리고 그것이 척도에서 온다는 §IV.B 결론)은 분위 예측 모형이 **직접 목표로 삼을 수 있는 대상**이다.

**정직한 유보**: ProTran-TFA 원고의 절 구조·수식 번호는 **프로필 기준 미상**이므로 구체 절을 지정하지 않는다. 아래 인용 초안은 절 지정 없이 문장 형태로만 제시한다.

---

## 3. 인용 포인트 — 실제로 쓸 문장 초안

### (A) APF 관련연구 절 — 2D 표현의 정당화 겸 대조군 예고
위 "충돌 1"의 방어 문장 초안을 그대로 사용.

### (B) APF 방법 절 — CNN probe 설계 근거
> "Our probe architecture follows the sparsity-adapted choices of Jiang, Kelly, and Xiu (2023, Appendix): an asymmetric $5\times3$ filter and $2\times1$ max-pooling, motivated there by inputs that are 'largely sparse in the vertical dimension.' Attention matrices exhibit the analogous property along the key axis for diagonal and spike motifs. Unlike JKX, however, we hold the probe architecture **fixed across all motif classes**; JKX vary stride and dilation with input length (1/2/3 across 5-, 20-, and 60-day images), which confounds their horizon-wise comparisons in Table V with architectural differences."

### (C) APF 논의 절 — causal intervention의 필요성
> "Existing interpretations of vision-style probes on financial and temporal data remain correlational. Jiang, Kelly, and Xiu (2023, §IV) relate CNN forecasts to known predictors and to logistic approximations of the underlying series, and explicitly describe these attempts as 'admittedly incomplete.' Notably, the single intervention they do perform — substituting the input rescaling in their Table IX — overturns the most natural reading of their own headline result. We take this as direct evidence that intervention, not association, is the operative tool for representation-level claims, and structure our motif analysis accordingly."

### (D) Grokking track 관련연구 절 — non-stationarity 정규화 축
> "The choice between local (per-window) and global (history-based) input normalization is not innocuous: Jiang, Kelly, and Xiu (2023, Table IX) report that replacing per-window min–max scaling with EWMA-devolatized returns drives out-of-sample performance from an annualized Sharpe of 7.20 to −0.13 under an otherwise identical model. We therefore treat normalization scope as a controlled factor rather than a preprocessing detail in our regime-switching experiments."

### (E) P1 ProTran-TFA (finance venue 진출 시) — 필수 인용 + 포지셔닝
> "Directional classification of price-chart images achieves large risk-adjusted spreads (Jiang, Kelly, and Xiu, 2023), yet by construction discards magnitude and tail information: their objective is a binary cross-entropy on the sign of the subsequent return, and their reported out-of-sample McFadden $R^2$ against a stock-level in-sample mean benchmark is between 0.73% and 1.39%. Our probabilistic formulation targets the complementary object — the conditional distribution — and we report both directional and distributional metrics to make the two comparable."

---

## 4. 반면교사 — 이 논문이 못한 것을 내가 어떻게 다룰지

`_profile.md`의 목표 venue는 **Grokking track이 "NeurIPS 2027 1순위 / TMLR backup"** 이다. 즉 **ML 학회 심사 기준**을 통과해야 한다. 본 논문은 JF(금융 저널) 기준을 충족했지만 **ML 학회 기준으로는 여러 항목이 미달**이다. 이 격차가 그대로 체크리스트가 된다.

| 본 논문의 공백 | ML 학회에서는 필수 | 내 원고에서 할 일 |
|---|---|---|
| **seed 간 분산 미보고** (5회 앙상블 평균만) | 다중 seed 평균 ± 표준편차 필수 | motif sweep과 PE 비교 전 셀에서 **seed별 결과 분포**를 보고. 프로필 기준 APF는 "motif sweep n=8" 규모이므로 seed 5개면 40 run — 감당 가능 |
| **분류 정확도·AUC 미보고** (이진 분류기인데!) | 태스크 표준 지표 필수 | probe 성능을 **정확도·AUC·캘리브레이션** 모두 보고. 특히 OOS $R^2$ 가 1% 수준일 때 "약한 우위의 누적"임을 명시 |
| **CNN1D 아키텍처 사양 미보고** (핵심 대조군인데) | 모든 baseline의 하이퍼파라미터·파라미터 수 공개 필수 | 1D 대조군의 **파라미터 수를 2D probe와 정확히 일치**시키고 그 수치를 표에 명시. 용량 공정성을 선제 증명 |
| **학습 동역학 전무** (에폭별 곡선 없음) | 학습 곡선은 사실상 필수 | Grokking track은 이것이 **연구 대상 자체**다. 본 논문이 안 한 것을 하는 것이 곧 기여 |
| **결정적 ablation을 Internet Appendix로 위임** (거래량·이동평균 제외 시 성능) | 핵심 ablation은 main text | "이미지 표현이 이겼다" vs "입력 변수가 더 많았다"를 본문에서 분리. APF도 **motif 정보 vs 추가 입력 채널**을 본문에서 분리 |
| **평행이동 등변성의 실증 미검증** (이론적 논거만) | 주장한 귀납편향은 검증 필요 | motif를 시퀀스 내에서 **의도적으로 이동**시킨 합성 데이터로 probe의 등변성을 직접 측정. 프로필의 "synthetic motif benchmark (trend/seasonal/regime/anomaly/freq drift)"에 **위치 이동 조건을 추가** |
| **mechanistic 도구 전무** (필터 시각화·saliency·채널 절제 없음) | interpretability 논문의 최소 요건 | APF의 causal intervention 단계가 이것 — **본 논문의 최대 공백이 사용자 프레임의 최대 차별점** |

**가장 중요한 반면교사 한 줄**: 본 논문은 **자기 논문의 헤드라인을 흔드는 대조 실험(Table IX)을 실제로 실행했고 본문에 실었다.** 그런데 그 발견이 제목·초록·서론의 프레이밍을 수정하지 못했고, 그 결과 **인용 문헌에서 정반대 주장의 근거로 쓰이고 있다.** 교훈: **자기 반증 실험을 하는 것만으로는 부족하고, 그 결과가 논문의 주장 문장을 실제로 고쳐 써야 한다.** 프로필 기준 APF는 "12 review loops 완료" + "TMAO method falsified at n=12"의 이력이 있으므로 반증 실행 문화는 이미 있다 — 남은 것은 **반증 결과가 초록·제목까지 거슬러 올라가 수정하게 만드는 규율**이다.

---

## 5. 즉시 실행 가능한 작은 일 (프로필 기록 자산 기준)

`_profile.md`의 "금융 backup 데이터: Ken French 25, **GSPC/IXIC 2022-2024**, GEFCom Wind/Solar"를 감안하면, 본 논문의 부분 재현은 규모상 불가능하다(CRSP 개별종목 패널 27년 필요). 대신 **척도 대조 실험만 떼어내는 것은 가능하다**:

GSPC/IXIC 2022-2024 지수 OHLC로 (i) 창내 min–max, (ii) 누적수익률 척도, (iii) EWMA 탈변동성 척도 세 가지 입력을 만들고 동일한 소형 1D CNN에 먹여 방향 예측 성능을 비교한다. 지수 수준이므로 횡단면 정렬은 불가하고 시계열 방향 정확도만 나오지만, **Table IX의 열 방향 패턴(척도가 성능을 지배)이 재현되는지**는 확인할 수 있다. 이는 APF·Grokking 양 track의 정규화 선택 결정을 뒷받침하는 최소 실증이 되고, 비용은 CPU 몇 시간 수준이다. (본 논문의 결과 자체가 개별종목 횡단면에서 나온 것이므로 **지수에서 재현되지 않는 것도 유효한 정보**다 — 그 경우 "이 효과는 횡단면 비교가능성 때문"이라는 해석이 강화된다.)
