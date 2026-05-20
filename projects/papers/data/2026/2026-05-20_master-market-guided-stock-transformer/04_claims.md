# 04_claims — 핵심 Claim 해체

> **배경 사다리**: ① IC (Information Coefficient) = 예측값과 실제 수익률의 Spearman 상관계수, 값이 클수록 예측이 실제와 더 일치. ② Rank IC = IC의 순위 기반 버전 (outlier에 robust). ③ p-value < 0.01 = 1% 유의수준에서 통계적으로 의미 있는 차이. 이 세 가지를 알면 아래 Claim들의 증거 구조를 따라갈 수 있다.

---

## Claim 1: 순간적·교차 시간 종목 상관관계 모델링이 예측 성능을 유의미하게 향상시킨다

**주장 (한 문장)**

시간 정렬 상관만 모델링하는 기존 방법과 달리, MASTER의 교번 intra-inter 어텐션 구조는 momentary AND cross-time 종목 상관을 포착함으로써 CSI300/CSI800 두 벤치마크에서 기존 최고 종목 상관 모델(DTML) 대비 모든 6개 지표에서 통계적으로 유의하게(p < 0.01) 우월한 성과를 보인다.

**증거**

- 원문 위치: Table 2 (CSI300 비교), 웹 검색 스니펫에서 "MASTER outperforms DTML in all 6 metrics, p < 0.01" 확인
- 전체 베이스라인 대비 ranking 지표 평균 +13%, 포트폴리오 기반 지표 평균 +47% (원문 abstract 기준)
- CSI300과 CSI800 두 데이터셋 모두에서 일관된 성능 (원문 설명 확인)
- Attention map 시각화 제공: 상관 패턴이 비대칭적이고 예측 날짜에 따라 서서히 변함을 보임 (원문 확인)

**숨은 전제**

- Alpha158 팩터가 이미 "주식의 역사적 패턴"을 잘 포착한다는 가정 하에, 종목 간 상관 구조 추가가 차별점이 된다
- T=8의 짧은 lookback window가 "cross-time" 상관을 포착하기에 충분하다고 암묵적으로 가정
- 중국 A주 시장의 상관 구조가 논문 검증 기간(2020–2022)에 걸쳐 안정적이라는 가정

**쉬운 말 풀이**

"같은 시각의 주식들만 비교하던 기존 방법보다, 시간을 넘나들며 비교하는 MASTER가 더 좋은 수익 순위 예측을 보인다. 그것도 우연이 아님을 통계적으로 증명했다."

---

## Claim 2: 시장 유도 게이팅이 시장 변동에 따른 특징 선택을 자동화한다

**주장 (한 문장)**

시장 지수 정보 $m_\tau$로부터 생성된 게이팅 계수가 158개 Alpha 팩터의 상황별 유효성을 동적으로 조절하며, 이는 고정 특징 가중치 방식 또는 게이팅 없는 기준선 대비 ranking/portfolio 지표 모두를 개선한다.

**증거**

- Figure 4: β 온도 파라미터 변화에 따른 MASTER 성능. 수평 점선 = market-guided gating 없는 기준선. β가 너무 작으면(too hard selection) 또는 너무 크면(gating 효과 사라짐) 성능 저하 (원문 위치 확인)
- "the influence of temperature β in the gating mechanism is studied, where a smaller β results in stronger feature selection, while a larger β reduces the gating effect" (웹 검색 스니펫)
- "The intuition to generate coefficients from market status (m_τ) is that the effectiveness of features is influenced by market status" (웹 검색 스니펫, 원문 텍스트로 추정)

**숨은 전제**

- 63차원 시장 벡터($m_\tau$)가 "현재 시장 국면"을 충분히 표현한다는 가정
- 중국 3대 지수(CSI300, CSI500, CSI800)의 통계치(mean, std × 5가지 window)가 국면 정보로서 충분함
- 게이팅 계수가 모든 종목에 동일하게 적용되어도 된다는 가정 (종목별 차별화 없음)

**쉬운 말 풀이**

"'오늘 시장이 폭등 중이냐 폭락 중이냐'를 읽어서 어떤 분석 지표가 지금 유효한지 자동으로 선택하는 필터를 달았더니, 달지 않은 것보다 결과가 좋아졌다. 단, 필터를 너무 빡빡하거나 너무 느슨하게 하면 오히려 역효과가 난다."

---

## Claim 3: Intra → Inter 순서의 교번 패턴이 대규모 어텐션 필드를 효과적으로 분해한다

**주장 (한 문장)**

전체 $(N \cdot T) \times (N \cdot T)$의 단일 대규모 어텐션 대신, 먼저 $T \times T$ (주내)를 수행한 뒤 $N \times N$ (주간)을 수행하는 분해 방식이 계산 효율과 예측 성능을 동시에 달성한다.

**증거**

- Ablation study: (N1, N2) 조합 실험 — N1은 intra-stock 어텐션 수, N2는 inter-stock 어텐션 수. 최적 조합이 존재함 (원문 Figure 또는 Table, 위치 직접 미확인)
- 설계 근거: "MASTER uses intra-stock aggregation followed by inter-stock aggregation to break down the large and complex attention field. Intra-stock aggregation is performed first due to its smaller attention field and simpler distribution" (웹 검색 스니펫, 원문 텍스트로 추정)
- 역순(inter → intra) 및 N1=0 또는 N2=0 케이스 ablation 결과 미확인, 단 최적 (N1, N2) 조합이 도출됨 (원문 ablation 절 기준)

**숨은 전제**

- 주내 어텐션이 "더 작고 단순한 분포"를 가진다는 가정이 경험적으로 정당화되어야 한다
- T=8이라는 짧은 시퀀스에서 self-attention이 over-smoothing 없이 유효한 local embedding을 생성한다는 가정
- N과 T의 곱이 충분히 클 때 (N≈300, T=8) 이 분해가 계산 이익을 가져온다는 가정 — N이 매우 작으면 분해 이점이 사라질 수 있음

**쉬운 말 풀이**

"300개 주식 × 8일 = 2,400개 원소를 한꺼번에 비교하면 컴퓨터가 힘들다. 먼저 '한 주식 안에서 8일끼리 비교' (작은 그룹 8개), 그 다음 '모든 주식들끼리 비교' (큰 그룹 300개)로 나누면 효율적이다. 어떤 순서가 좋은지 실험으로 찾아냈다."

---

## Claim 요약 표

| Claim | 핵심 주장 | 주요 증거 | 숨은 가정 |
|-------|----------|----------|-----------|
| 1 | Cross-time 상관이 성능 향상 | Table 2, +13%/+47% | Alpha158 충분성, T=8 lookback 충분 |
| 2 | 시장 유도 게이팅이 특징 선택 향상 | Figure 4 (β ablation) | 시장 벡터 63차원 충분성 |
| 3 | Intra→Inter 분해가 효율·성능 동시 달성 | (N1,N2) ablation | T×T 가 N×N보다 단순한 분포 |
