# 10 · 사고 확장 ③ — 실험 아이디어 2개

## 아이디어 1 — *Regime-Shift Goldilocks Zone Drift* (사용자 TS track 직접 후속)

**가설**: Time series 의 regime shift (예: low-vol → high-vol 전환, structural break) 가 LU mechanism 의 Goldilocks zone 중심 $w_c$ 를 *시간의 함수* $w_c(t)$ 로 만든다. 이 drift 속도가 weight decay 의 effective drift rate $\gamma$ 보다 빠르면 weight vector 가 *zone 을 따라잡지 못해* delayed generalization 이 *regime change 마다 재발* (recurrent grokking).

**데이터**: 
- (a) Synthetic regime-switching time series — 두 AR(1) process 사이를 random switch (사용자 보유 자산).
- (b) Logistic map at different control parameter $\lambda$ — period-doubling chaos cascade 의 각 단계가 regime 역할 (사용자 보유 자산, P2 thesis baseline).
- (c) 금융 데이터 — GSPC 2022-2024 (사용자 보유, low-vol/high-vol 명확 구분 가능).

**비교 조건**:
1. **Stationary baseline**: 같은 AR(1) 또는 같은 logistic $\lambda$ 에서 학습 — 기존 Omnigrok 의 LU 가 그대로 보여야 함.
2. **Regime-shift treatment**: 학습 도중 regime 강제 전환 — $w_c$ drift 측정.
3. **Slow vs fast regime shift**: drift 속도와 weight decay $\gamma$ 의 비율 sweep.
4. **Architecture sweep**: simple MLP / iTransformer / PatchTST 에서 같은 setup — architecture 가 zone drift 추적 능력에 미치는 영향.

**예상 결과**:
- Stationary 에서 LU 의 정적 zone 재현 — Omnigrok 의 *cross-domain replication* 으로서 자체 contribution.
- Fast regime shift 에서 *recurrent grokking* 관찰 — 매 regime 전환마다 train→test 갭이 다시 벌어졌다가 좁혀짐.
- Slow regime shift 에서 zone 이 *준-stationary* 로 보이고 grokking 이 한 번만 일어남.

**반증 조건**:
- Stationary baseline 에서도 LU 가 안 보이면 *TS 도메인에 LU 자체가 적용 안 됨* — 본 가설 전부 폐기, 다른 framework 모색.
- Regime shift 에서 $w_c$ 의 *drift 자체가 안 잡힘* — landscape 측정 방법이 TS 에 부적합, sphere projection 의 대안 (예: layer-wise projection) 필요.

**비용 추정**: 작은 transformer (≤ 4 layer, ≤ 8 head, d_model=128) + 작은 dataset (10k-100k samples) → GPU 1 장으로 1 condition 당 수 시간. 4 conditions × 5 seeds × 3 architecture = 60 run, 1 주일 sweep 으로 완료 가능. P2 thesis 의 기존 logistic baseline 코드에 *Omnigrok-style sphere projection mode* 만 추가하면 즉시 실행 가능.

## 아이디어 2 — *Layer-wise LU Decomposition for Attention Pattern Fields* (APF 직접 후속)

**가설**: APF 의 *PE → motif → CNN probe* framework 에서 *각 layer 의 attention motif* 가 *그 layer 의 weight norm $\|W^{(\ell)}\|$* 의 함수로 emerge 한다. 즉 *layer-wise LU mechanism* — 각 layer 마다 자기 Goldilocks zone 이 있고, motif (diagonal / stripe / block / edge / spike / checker) 는 그 zone 안에서만 *clean하게* 등장.

**데이터**:
- APF 의 synthetic motif benchmark (trend / seasonal / regime / anomaly / freq drift, 사용자 보유).
- UCR Archive (사용자 보유).
- 비교용으로 MNIST + IMDb (Omnigrok 의 두 도메인) — APF method 가 Omnigrok 의 도메인에서도 작동하는지의 sanity check.

**비교 조건**:
1. **Global weight norm vs layer-wise weight norm**: 전체 모델의 $\|w\|$ 로 sphere project (Omnigrok 원본) vs 각 layer 별로 따로 project (APF 확장) — 두 가지 reduced landscape 의 비교.
2. **PE 별 sweep**: NoPE / sinusoidal / learned / RoPE / ALiBi — 각 PE 의 layer-wise Goldilocks zone 의 *위치 · 폭* 비교.
3. **Motif emergence order**: 학습 중 (a) 각 motif 가 emerge 하는 step, (b) 그 step 의 각 layer weight norm — 둘이 어떻게 정합하는지.

**예상 결과**:
- 같은 PE 에서 *얕은 layer 가 먼저 Goldilocks zone 에 진입* → diagonal/stripe 같은 *local motif* 먼저 emerge, 깊은 layer 가 늦게 진입 → block/edge 같은 *global motif* 늦게 emerge.
- RoPE vs ALiBi 의 motif emergence order 가 *layer-wise zone 진입 순서* 의 차이로 설명됨 → APF 의 PE-motif 매핑이 *training dynamics* 의 직접 결과로 보임 (현재 APF 는 trained 모델 위 *cross-sectional* 분석 위주).
- Global LU 가 가려 보이지 않는 *layer-wise 비-단조* 관계 (예: 중간 layer 가 zone 을 *지나쳤다가 돌아오는*) 발견 가능 → modern transformer 의 representation hierarchy 관점에서 새 insight.

**반증 조건**:
- 각 layer 의 norm 이 *학습 내내 균등 비율* 로 증가 — layer-wise 와 global 이 정성적으로 동일, layer-wise 분해의 추가 정보 없음.
- Motif emergence 가 layer norm 과 *correlation 없음* — layer-wise LU 가설 폐기, motif emergence 의 다른 결정 인자 찾아야 함 (예: layer 별 effective 학습률, batch norm 의 영향).

**비용 추정**: APF 의 기존 motif sweep 코드 (n=8/PE, 사용자 진행 중) 에 *layer-wise sphere projection* 한 줄 추가 + reduced landscape 측정 mode 한 개. 기존 12 review loop 의 13 번째 loop 으로 자연스럽게 통합. GPU 1 장으로 1 PE 당 하루, 5 PE × 3 motif × 5 seed = 75 run, 2 주일 완료 가능. 결과가 잘 나오면 *APF + Omnigrok* 의 결합으로 NeurIPS Workshop 또는 ICLR Tiny Paper grade contribution.
