# 10c — 사고 확장: 실험 아이디어 2개

---

## 실험 아이디어 1 — ELR 역학이 TS 트랜스포머 Grokking을 예측하는가?

### 가설
시계열 트랜스포머(PatchTST, iTransformer)를 비정상 합성 데이터(regime-switching)로 훈련할 때, **ELR 붕괴 속도**가 grokking(지연된 일반화) 발생 시점과 강한 역상관 관계를 보인다. 즉, ELR이 빨리 붕괴할수록 grokking이 더 늦게 또는 아예 발생하지 않는다.

### 데이터 설계
- **Synthetic Regime-Switching**: AR(1) 프로세스 2개를 주기적으로 전환. Parameter A: $y_t = 0.8 y_{t-1} + \epsilon_t$ (지속적), Parameter B: $y_t = -0.3 y_{t-1} + \epsilon_t$ (평균회귀). 전환 주기는 100 스텝.
- **ETT-mini** (실제 데이터 검증): Oil temperature 예측.
- 훈련:테스트 비율 = 40:60 (의도적으로 소량 훈련, grokking 유도 조건)

### 비교 조건
1. Baseline: standard Adam, weight decay 없음
2. Weight Decay: Adam + L2 $\lambda = 0.01$ (Power 2022 설정)
3. NaP: ELR 일정 유지
4. ELR Re-warming ($T = 100$)
5. ELR Re-warming ($T = 500$)

### 측정 지표
- 테스트 MSE 곡선 (훈련 스텝 × 테스트 MSE)
- ELR_t 곡선 (각 레이어별)
- **Grokking 발생 시점**: 테스트 MSE가 훈련 MSE의 1.2배 이하로 처음 떨어지는 스텝
- Nanda 진행 측도: restricted weight norm (= 1/ELR 역수)

### 예상 결과
- Baseline: grokking 없음 (ELR → 0)
- Weight Decay: grokking 발생 (수천 스텝)
- NaP: grokking 발생 (weight decay보다 빠름 또는 비슷)
- Re-warming T=100: grokking이 가장 빠름 (주기적 ELR 복원)
- Re-warming T=500: grokking이 Re-warming T=100보다 느리지만 Baseline보다 빠름

### 반증 조건
만약 ELR re-warming을 적용해도 grokking이 발생하지 않는다면, TS 트랜스포머에서 grokking을 막는 다른 요인(시계열의 강한 temporal correlation, 데이터 분포의 연속성 등)이 있는 것이다.

### 비용 추정
- 모델 크기: 2층 PatchTST (파라미터 ~500K)
- 훈련 스텝: 50K per condition × 5 conditions × 3 seeds = 750K 스텝 총
- 예상 실행 시간: 1 GPU × ~6시간
- 구현 복잡도: 낮음 (NaP/Re-warming은 10줄 코드)

---

## 실험 아이디어 2 — Head-Wise ELR과 Attention Motif 등장의 상관관계

### 가설
트랜스포머에서 Attention Head마다 **Head-Wise ELR**을 측정했을 때, 특정 motif(diagonal, stripe, global average 등)가 등장하는 시점과 해당 head의 ELR이 높은 시점이 상관관계를 보인다. 구체적으로: "High ELR head → task-specific motif 형성 먼저". 이것은 APF(Attention Pattern Fields) 트랙에서 관찰하는 PE × motif 관계에 ELR 역학 차원을 추가한다.

### 데이터 설계
- Modular arithmetic (표준 grokking 설정, $p = 97$)
- 소형 트랜스포머: 2층, 4 head per layer
- 입력: one-hot encoded integers

### 측정 지표
- **Head-Wise ELR**: 각 head의 QKV 행렬 노름으로 계산
  $$\text{ELR}_t^{(l,h)} = \frac{\eta}{\|\theta_t^{(l,h)}\|}$$
  ($\theta_t^{(l,h)}$: 레이어 $l$, head $h$의 QKV 파라미터 concat 벡터)
- **Attention Motif Score**: 각 head의 attention 행렬 $A^{(l,h)} \in \mathbb{R}^{n \times n}$에 대해:
  - Diagonal score: $\text{tr}(A^{(l,h)}) / n$
  - Stripe score: $\max_i \sum_j A^{(l,h)}_{ij} / n$ (행 최댓값)
  - Flat score: $1 - \text{Var}(A^{(l,h)}) \cdot n^2$
- **Mutual Information** between ELR_t^{(l,h)} and Motif_Score_t^{(l,h)} across time

### 비교 조건
1. Standard training (ELR 자연 감소)
2. NaP (ELR 일정)
3. ELR Re-warming (ELR 주기적 상승)

각 조건에서 head별 ELR × motif 상관관계 비교.

### 예상 결과
- **Standard training**: 초기 high-ELR 기간(스텝 0~1000)에 task-specific motif 형성 시작. ELR 붕괴(스텝 > 2000) 후 motif가 고정 또는 소멸.
- **NaP**: ELR이 일정하게 유지되므로 motif가 더 안정적으로 발전.
- **Re-warming**: Re-warming 직후 ELR이 상승하고, 이 시점에 motif가 재조직화됨. 마치 "motif가 주기적으로 리셋 후 재형성"되는 패턴.

### 반증 조건
만약 head-wise ELR과 motif score 사이에 유의미한 상관관계가 없다면, motif 형성은 ELR 독립적인 다른 메커니즘(예: attention head specialization의 경쟁, entropy regularization 등)에 의해 결정되는 것이다.

### 비용 추정
- 모델 크기: 2층 트랜스포머, 4 head ($p=97$ 모듈러 산수)
- 훈련 스텝: 20K × 3 conditions × 5 seeds = 300K 스텝
- 추가 로깅: 매 100 스텝마다 attention 행렬 + 파라미터 노름 저장 → ~1GB
- 예상 실행 시간: 1 GPU × ~3시간
- APF 트랙과의 시너지: 이 실험 결과를 APF 논문의 appendix에 직접 포함 가능. "ELR 역학이 attention motif 형성에 미치는 영향"이라는 새 분석 축 추가.
