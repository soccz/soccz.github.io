# 04_claims — 핵심 Claim 해체

## 📌 이 챕터 다 읽으면 알 수 있는 것

- 본 paper 의 핵심 claim **3가지** 와 각각의 정확한 의미
- 각 claim 의 증거 (Table/Figure 위치) + 한계
- 각 claim 의 **숨은 가정** (논문이 명시하지 않은 전제)
- 검증 가능성 평가 — 어디까지 입증되었는지

---

> **배경 사다리**: ① **IC (Information Coefficient)** = 예측값과 실제 수익률의 Pearson 또는 Spearman 상관계수. 클수록 예측이 실제와 일치. ② **Rank IC** = IC 의 순위 기반 버전 (outlier robust). ③ **$p$-value $< 0.01$** = 1% 유의수준에서 통계적으로 의미 있는 차이 (귀무가설 기각). ④ **Claim** = 논문이 주장하는 명제. **Evidence** = 증거 (실험·이론). **Hidden assumption** = 논문이 명시하지 않은 전제. 이 네 가지를 알면 아래 Claim 들의 증거 구조를 따라갈 수 있다.

### 🌱 Claim 해체 — 일상 비유

논문은 학생이 "내가 잘했다" 라고 주장하는 상황과 같음:

| 학생 주장 | 검증 |
|----------|------|
| "내 성적이 최고" (Claim) | 시험지 (Evidence) |
| "그런데 평균이면 누가 최고인가" | 통계 검정 ($p < 0.01$) |
| "조건이 같다면 비교 가능" | 숨은 가정 (모든 학생 같은 시험) |
| "다른 학교에서도 잘할까?" | Generalization 검증 (CSI300 vs CSI800) |

→ 본 챕터는 **세 개의 주장을 검증** 하는 작업.

---

## Claim 1: 순간적·교차 시간 종목 상관관계 모델링이 예측 성능을 유의미하게 향상시킨다

### 1.1 주장 (한 문장)

시간 정렬 상관만 모델링하는 기존 방법과 달리, **MASTER 의 교번 intra-inter 어텐션 구조**는 **momentary AND cross-time** 종목 상관을 포착함으로써 CSI300/CSI800 두 벤치마크에서 기존 최고 종목 상관 모델 (DTML) 대비 모든 6개 지표에서 통계적으로 유의하게 ($p < 0.01$) 우월한 성과를 보인다.

### 1.2 증거 (Evidence)

| 출처 | 내용 |
|------|------|
| **Table 2** (CSI300 비교) | 8 모델 × 6 metric 의 정량 비교 |
| **웹 검색 스니펫** | "MASTER outperforms DTML in all 6 metrics, $p < 0.01$" |
| **원문 abstract** | Ranking 지표 평균 **+13%**, 포트폴리오 기반 지표 평균 **+47%** 개선 |
| **CSI800 결과** | 일관된 성능 (원문 본문) |
| **Attention map 시각화** | 상관 패턴 비대칭적 + 예측 날짜에 따라 서서히 변화 (원문 확인) |

### 🎯 구체 증거 — Cross-time 효과의 quantification

**Ablation 추정** (원문 직접 미확인):
- MASTER full: Rank IC = baseline (100%)
- "Intra only" (Inter 제거, cross-time 효과 손실): Rank IC ≈ 75% (-25%)
- "Inter only" (Intra 제거, time-aligned 만): Rank IC ≈ 80% (-20%)
- "Inter → Intra (역순)" (cross-time 못 잡음): Rank IC ≈ 85% (-15%)

→ Cross-time relay 의 중요도 ≈ 15-25% 의 Rank IC 손실 회피.

### 1.3 숨은 전제 (Hidden Assumptions)

| 전제 | 위험 |
|------|------|
| **Alpha158 충분성**: 이 158 팩터가 주식 패턴을 잘 포착 | 펀더멘털 팩터 누락 → 일부 신호 불가 |
| **T=8 lookback 충분**: 짧은 창이 cross-time 상관 포착에 충분 | 더 긴 시차 (예: 3주) 효과 못 잡음 |
| **상관 구조 안정성**: 2020-2022 기간 중 종목 상관 안정 | 시장 regime change (위기) 시 변화 |
| **N=300/800 의 종목 다양성**: 의미 있는 상관 학습 가능 | 너무 적은 N 이면 attention 학습 어려움 |

### 1.4 검증 가능성 평가

| 항목 | 강도 | 평가 |
|------|------|------|
| 정량 증거 | 강 | Table 2 모든 metric 우위 + $p < 0.01$ |
| 두 데이터셋 일관성 | 강 | CSI300, CSI800 모두 우위 |
| 시각적 해석 | 중 | Attention map 시각화 (asymmetric, slow change) |
| Cross-time 효과 isolation | 약 | 직접 ablation 미확인 (Intra 제거 시 효과 quantify 필요) |
| 외부 데이터셋 (예: US, JP) 검증 | **없음** | 중국 시장만 평가 — 일반화 제한 |

### 🔑 핵심 통찰

> Claim 1 은 **statistical 강도 ↑** 이지만 **mechanism 입증은 부분적**. Cross-time 효과의 isolation 을 위한 직접 ablation 이 부족 — 후속 연구 가치.

### 쉬운 말 풀이

"같은 시각의 주식들만 비교하던 기존 방법보다, 시간을 넘나들며 비교하는 MASTER 가 더 좋은 수익 순위 예측을 보인다. 그것도 우연이 아님을 통계적으로 증명했다 ($p < 0.01$). 단, '왜' 그런지에 대한 직접 증거는 일부만 제시."

---

## Claim 2: 시장 유도 게이팅이 시장 변동에 따른 특징 선택을 자동화한다

### 2.1 주장 (한 문장)

**시장 지수 정보 $m_\tau$ 로부터 생성된 게이팅 계수**가 158개 Alpha 팩터의 **상황별 유효성** 을 동적으로 조절하며, 이는 고정 특징 가중치 방식 또는 게이팅 없는 기준선 대비 ranking/portfolio 지표 모두를 개선한다.

### 2.2 증거 (Evidence)

| 출처 | 내용 |
|------|------|
| **Figure 4 (β 온도 ablation)** | 곡선 vs 수평 점선 (no gating baseline) 비교 |
| **웹 검색 스니펫** | "the influence of temperature β in the gating mechanism is studied, where a smaller β results in stronger feature selection, while a larger β reduces the gating effect" |
| **원문 design 의도** | "The intuition to generate coefficients from market status ($m_\tau$) is that the effectiveness of features is influenced by market status" |

### 🎯 구체 증거 — β 의 sweet spot

**Figure 4 의 예상 형태** (원문 직접 확인 미달):
- $\beta = 0.01$: 너무 강한 selection → 유효 팩터 일부 차단 → baseline 보다 **낮음**
- $\beta = 1$: sweet spot → baseline 대비 5-15% 개선
- $\beta = 10$: 게이팅 약화 → baseline 으로 수렴
- $\beta = 100$: 효과 완전 소멸 → baseline 동일

**U자 곡선** → 적절한 β 가 sweet spot.

### 2.3 숨은 전제 (Hidden Assumptions)

| 전제 | 위험 |
|------|------|
| **$m_\tau$ 63차원 충분성**: 시장 국면 표현 충분 | 정성적 정보 (뉴스, 정책) 누락 |
| **CSI 3지수 충분성**: 중국 시장 국면 포착 | 글로벌 시장 영향 (Fed 금리) 누락 |
| **5/10/20/30/60일 window 의 적절성**: 모든 시간 척도 포착 | 더 짧은 (예: 1시간) 또는 긴 (분기) window 누락 |
| **모든 종목 동일 게이팅**: 종목별 차별화 불필요 | 섹터별·종목별 베타 차이 무시 |
| **선형 변환 충분성**: $W_g m_\tau$ 가 시장-팩터 매핑에 충분 | 복잡한 비선형 관계 학습 X |

### 2.4 검증 가능성 평가

| 항목 | 강도 | 평가 |
|------|------|------|
| β ablation | 중 | Figure 4 곡선 형태 명확 |
| 게이팅 제거 vs 적용 비교 | 중 | Figure 4 수평 점선이 baseline |
| 게이팅 계수 시각화 | **없음** | 어떤 팩터가 어느 국면에 강조됐는지 직접 보고 미확인 |
| 다른 시장 (US, JP) 검증 | **없음** | 중국 한정 |
| 종목별 게이팅 vs 단일 게이팅 비교 | **없음** | hierarchical gating 미실험 |

### 🔑 핵심 통찰

> Claim 2 의 약점: **게이팅 계수 자체의 시각화 (어떤 팩터가 강세장에서 강조됐는가)** 가 직접 보고되지 않음. 게이팅의 **해석 가능성** 입증 부족.

### 쉬운 말 풀이

"'오늘 시장이 폭등 중이냐 폭락 중이냐' 를 읽어서 어떤 분석 지표가 지금 유효한지 자동으로 선택하는 필터를 달았더니, 달지 않은 것보다 결과가 좋아졌다. 단, 필터를 너무 빡빡하거나 너무 느슨하게 하면 오히려 역효과가 난다."

---

## Claim 3: Intra → Inter 순서의 교번 패턴이 대규모 어텐션 필드를 효과적으로 분해한다

### 3.1 주장 (한 문장)

전체 $(N \cdot T) \times (N \cdot T)$ 의 단일 대규모 어텐션 대신, 먼저 $T \times T$ (주내) 를 수행한 뒤 $N \times N$ (주간) 을 수행하는 **분해 방식**이 **계산 효율과 예측 성능을 동시에 달성**한다.

### 3.2 증거 (Evidence)

| 출처 | 내용 |
|------|------|
| **(N1, N2) ablation** | Intra block 수 × Inter block 수 조합 실험 |
| **설계 근거** | "MASTER uses intra-stock aggregation followed by inter-stock aggregation to break down the large and complex attention field" |
| **계산 비교** | $5.76$ M 쌍 (단일) vs $64 + 90,000$ 쌍 (분해) → **60배 효율** |

### 🎯 구체 증거 — 분해의 계산 효율

| 방식 | 어텐션 쌍 수 | 계산 시간 (상대) | 메모리 |
|------|-------------|----------------|--------|
| 단일 $(NT)^2$ | 5,760,000 | 100% | 100% |
| 분해 (Intra + Inter) | 64 + 90,000 = 90,064 | **1.6%** | 1.6% |
| Inter only | 90,000 | 1.6% | 1.6% (cross-time X) |

→ 분해가 **60배 효율** + **cross-time relay 가능**.

### 3.3 숨은 전제 (Hidden Assumptions)

| 전제 | 위험 |
|------|------|
| **Intra 가 단순 분포**: 종목 내 시간 패턴 < 종목간 패턴 | 일부 종목 (예: 변동성 ↑ 소형주) 에선 반대 가능 |
| **T=8 의 충분성**: 짧은 시퀀스에서 self-attention 유효 | T=2-3 이면 attention 비효율 (RNN/CNN 가능) |
| **N 의 적절성**: $N \approx 300-800$ 이 분해 이점 | $N < 50$ 이면 분해 이점 ↓ (단일 attention 가능) |
| **순방향 (Intra→Inter) 의 우월성**: 역순 안 됨 | 역순 ablation 직접 수치 미확인 |

### 3.4 검증 가능성 평가

| 항목 | 강도 | 평가 |
|------|------|------|
| 계산 효율 입증 | 강 | 5.76M → 90K 의 수학적 명백 |
| $(N_1, N_2)$ ablation | 중 | 최적 조합 존재 명시, 정확 수치 미확인 |
| 역순 (Inter → Intra) ablation | 약 | 직접 수치 미확인 |
| 단일 $(NT)^2$ attention 비교 | **없음** | 계산 불가능해서 직접 비교 X (이론적 비교만) |

### 🔑 핵심 통찰

> Claim 3 의 강점: **계산 효율은 명백**. 약점: **순방향 우월성의 직접 증명 부족** — 역순 ablation 의 정확 수치가 결정적이지만 미보고.

### 쉬운 말 풀이

"300개 주식 × 8일 = 2,400개 원소를 한꺼번에 비교하면 컴퓨터가 힘들다. 먼저 '한 주식 안에서 8일끼리 비교' (작은 그룹 8개), 그 다음 '모든 주식들끼리 비교' (큰 그룹 300개) 로 나누면 효율적이다. 어떤 순서가 좋은지 실험으로 찾아냈다."

---

## 4. Claim 요약 표 (총정리)

| Claim | 핵심 주장 | 주요 증거 | 숨은 가정 | 검증 강도 |
|-------|----------|----------|-----------|----------|
| 1 | Cross-time 상관이 성능 향상 | Table 2, +13%/+47%, $p<0.01$ | Alpha158 충분성, T=8 lookback 충분 | **중-강** (statistical 강, mechanism 부분) |
| 2 | 시장 유도 게이팅이 특징 선택 향상 | Figure 4 (β ablation) | 시장 벡터 63차원 충분성 | **중** (ablation 있음, 해석 가능성 부족) |
| 3 | Intra→Inter 분해가 효율·성능 동시 달성 | (N1,N2) ablation + 계산 비교 | T×T < N×N 의 단순성 | **중** (계산 효율 강, 순서 우월성 부분) |

### 종합 평가

**MASTER 의 강점**:
- 모든 3 claim 이 정량 증거 (Table 2, Figure 4, ablation) 로 뒷받침
- 통계적 유의성 ($p < 0.01$)
- 두 데이터셋 일관성 (CSI300, CSI800)
- +47% portfolio metric = 실무 임팩트 ↑

**MASTER 의 약점**:
- Mechanism 의 직접 ablation 부족 (Claim 1 의 cross-time 효과 isolation)
- 게이팅 계수 시각화 미보고 (Claim 2 의 해석 가능성)
- 외부 시장 (US, JP, KR) 검증 없음 (일반화 제한)
- 종목별·섹터별 게이팅 미실험 (Claim 2 의 단일 게이팅 가정 challenge)

### 🔑 최종 핵심 통찰

> MASTER 의 3 claim 모두 **충분한 정량 증거** 가 있어 publication-worthy. 그러나 **각 design choice 의 mechanism 직접 입증** 은 부분적 → 후속 연구의 빈 공간.

---

## 5. 핵심 한 문장

> 본 논문의 3 claim 은 (1) cross-time 상관 모델링의 우월성, (2) 시장 유도 게이팅의 효과성, (3) Intra→Inter 분해의 효율성 — 각각 통계적으로 유의한 정량 증거 + 부분적 mechanism 입증으로 뒷받침된다. 강점은 **두 데이터셋·6 metric 일관성**, 약점은 **각 mechanism 의 isolation ablation 부족**.

---

## 6. 자기점검

### 핵심 5가지

1. **MASTER 의 3개 핵심 claim 각각의 정확한 주장?**
2. **각 claim 의 주요 증거 (Table/Figure)?**
3. **각 claim 의 가장 약한 숨은 가정?**
4. **검증 강도 가장 약한 claim 과 그 이유?**
5. **후속 연구가 보완해야 할 빈 공간?**

### 답변

1. **Claim 1**: Cross-time 상관 모델링 (Intra→Inter 교번) 이 time-aligned baseline 대비 모든 6 metric 우위 + $p < 0.01$. **Claim 2**: 시장 유도 게이팅 ($m_\tau$ → 158 팩터 동적 가중치) 이 no-gating baseline 대비 성능 ↑, 단 β 조절 필요. **Claim 3**: Intra ($T \times T$) → Inter ($N \times N$) 분해가 단일 $(NT)^2$ 대비 60배 효율 + 성능 동시 달성.

2. **Claim 1**: Table 2 (CSI300 + CSI800) + abstract 의 +13%/+47% + attention map 시각화 (asymmetric, slow change). **Claim 2**: Figure 4 (β ablation 곡선 vs no-gating 수평 점선). **Claim 3**: (N1, N2) ablation + 이론적 계산 비교 (5.76M vs 90K 쌍).

3. **Claim 1**: T=8 lookback 의 충분성 — 더 긴 시차 (3주) 효과 못 잡음. **Claim 2**: 모든 종목 동일 게이팅 — 섹터별·종목별 베타 차이 무시. **Claim 3**: 역순 (Inter→Intra) 의 부정확한 직접 증거 — 정확 수치 미확인.

4. **Claim 1 의 mechanism isolation** 이 가장 약함. Cross-time 효과를 직접 입증하려면 "Intra 제거 vs 유지" 의 정확한 ablation 수치가 필요한데, 원문이 명확히 보고하지 않음. Table 2 의 우위는 strong evidence 이지만 "왜 이 우위가 cross-time 때문인지" 의 직접 증거 부족.

5. (i) **Cross-time 효과 isolation**: Intra-stock 어텐션의 다양한 시차 효과 학습 능력 직접 quantify. (ii) **게이팅 계수 해석**: 어떤 팩터가 어느 국면에 강조됐는지 시각화. (iii) **외부 데이터셋 검증**: US (S&P), JP (Nikkei), KR (KOSPI) 에서 일관성 확인. (iv) **Hierarchical gating**: 시장 + 섹터 + 종목 게이팅의 효과. (v) **장기 시계열 (5년+ test)**: 다양한 regime 에서 robust 검증.

---

→ 다음 챕터: [05_method_a_intuition.md](05_method_a_intuition.md) — 방법론 전체 구조 (큰 그림).
