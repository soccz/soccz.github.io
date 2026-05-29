# 10_extensions_c — 사고 확장: 실험 아이디어 2개

**배경 사다리**: ① 실험 아이디어는 *가설 → 데이터 → 비교 조건 → 예상 결과 → 반증 조건 → 비용* 의 6 요소가 모두 명시될 때 *실행 가능* 한 plan, ② 좋은 실험은 *가설이 틀렸을 때 어떻게 알 수 있나* 가 명확, ③ 비용 (compute, 시간, 데이터 접근) 추정으로 우선순위 결정.

---

## 실험 아이디어 1 — "DeepLOB 의 Conv 위계 vs Random Permutation: hard inductive bias 의 본질 측정"

### 가설
**DeepLOB 의 conv 1×2 → 1×2 → 1×10 커널 모양은 LOB 의 *의미적 위계* (가격·거래량·bid·ask·10 레벨) 와 정확히 일치할 때만 최적이며, 입력 정렬을 무작위 permute 하면 성능이 *유의미하게 하락* 한다. 만약 permute 후에도 비슷한 성능이면 *위계 가정이 아닌 conv 의 universal approximation* 이 본질.**

### 데이터
- FI-2010 NoAuction DecPre (저자 GitHub `data.zip` 직접 사용).
- 분할은 표준 (앞 7일 train, 뒤 3일 test).

### 비교 조건 (4 가지)

| 조건 | 40-dim 정렬 |
|------|------------|
| **A. 표준 (DeepLOB 원본)** | ask₁ 가격, ask₁ 수량, bid₁ 가격, bid₁ 수량, ask₂, …, bid₁₀ 수량 |
| **B. Bid-Ask 분리** | (ask₁ 가, ask₁ 수, ask₂ 가, …, ask₁₀ 수) 그 다음 (bid₁ 가, …, bid₁₀ 수). 즉 모든 ask 먼저, 모든 bid 다음. |
| **C. 가격·수량 분리** | (ask₁ 가, ask₁ 가, …, bid₁₀ 가) 가격만 20 개 먼저, 그 다음 수량 20 개. |
| **D. 완전 random permute** | 40-dim 의 한 random permutation, 모든 epoch 에 고정. |

각 조건에 동일 DeepLOB architecture, 동일 hyperparameter (Adam lr 1e-4, batch 64, 50 epoch), **5개 random seed** 로 학습 → macro F1 평균 ± 95% CI.

### 예상 결과
- A (표준): F1 ≈ 0.75 (저자 보고 재현).
- B (Bid-Ask 분리): conv 1×2 가 (ask₁ 가, ask₁ 수) 짝을 결합하지만 둘째 1×2 가 (ask 짝 1, ask 짝 2) 를 결합 — 의미 없는 짝. F1 ≈ 0.70-0.72 추정.
- C (가격·수량 분리): 첫 1×2 가 (ask₁ 가, ask₁ 가) 같은 무의미 짝 결합. F1 ≈ 0.65-0.70 추정.
- D (random): F1 분산 큼, 평균 0.68-0.72 추정.

**핵심 비교**: A > B > C ≈ D 의 순서면 *위계 가설* 강하게 지지. A ≈ B ≈ C ≈ D 면 *conv 의 universality* 우세.

### 반증 조건
- A 와 D 의 F1 차이 < 2% (단방향 t-test, p > 0.05) → DeepLOB 의 *명시적 위계 주장* 은 잘못. 후속 작업은 attention 또는 set transformer 로 정렬 무관 처리.
- A 와 D 의 F1 차이 > 5% → 위계 가설 강하게 확증. 다른 거래소 데이터로 일반화 후속.

### 비용
- 4 조건 × 5 seed = 20 학습.
- 한 학습 ≈ 47 sec × 50 epoch ≈ 40 분 (GPU V100/A100).
- 총 ≈ 20 × 40 min = 13 hours (단일 GPU). 분산 시 2-3 hours.
- 데이터 접근: 무료 (FI-2010 공개).
- 분석 코드: notebook 수정 ~50 줄.

**우선순위**: ★★★ — APF 의 attention motif 가설의 *hard 상한 검증* 으로 직접 활용 가능. 작은 비용, 큰 통찰.

---

## 실험 아이디어 2 — "DeepLOB + SAE: LOB 다이내믹스의 인과적 latent feature 분해"

### 가설
**DeepLOB 의 마지막 Inception 출력 (192-dim, 시간 82) 또는 LSTM hidden (64-dim) 에 Sparse Autoencoder (SAE) 를 학습시키면, 가격레벨·시간 패턴의 *해석 가능 latent feature* — bid-ask imbalance spike, queue depletion, spread crossing, momentum reversal 등 — 가 자동 분해되며, 각 feature 가 prediction 에 인과적으로 기여하는 정도 (절제 효과) 를 정량화할 수 있다.**

이는 Mishra 2026 (Dissecting Chronos) 의 TSFM-SAE 패러다임을 LOB 도메인으로 이식한 첫 작업이 된다.

### 데이터
- FI-2010 + LSE 2017 (가능하면 OMI 접촉으로 확보, 안 되면 NASDAQ ITCH 공개 일부 활용).
- 학습된 DeepLOB 모델 weight (저자 공식 PyTorch best_val_model_pytorch).

### 방법론

1. **SAE 구성**:
   - 입력: DeepLOB 의 Inception output (192-dim) 또는 LSTM hidden (64-dim).
   - SAE 종류: TopK-SAE (Mishra 2026 방식, k 활성 sparse).
   - 사전 크기 $d_{\text{sae}}$ = 입력의 32~64배 (192 → 6,144 또는 12,288).
   - 활성 수 $k$ = 8 ~ 64.

2. **추출 지점**:
   - **추출 1**: Conv 3 출력 (32 × 82 × 1, spatial 통합 직후).
   - **추출 2**: Inception 출력 (192 × 82, 다중 스케일 직후).
   - **추출 3**: LSTM 마지막 hidden (64-dim, 분류 직전).

3. **인과 절제 실험**:
   - 학습된 SAE 사전에서 한 feature 하나의 활성을 0 으로 클램프.
   - 그 상태에서 DeepLOB forward 통과 → 분류 정확도 변화 (ΔF1, Δaccuracy).
   - 392 ~ 1,000 개 feature 절제 sweep.

4. **Feature taxonomy**:
   - 각 SAE feature 가 활성화될 때의 입력 LOB 패턴 시각화.
   - GPT-기반 auto-interpretation (Bills 2023 패러다임) 또는 human label.
   - 분류: imbalance, queue depletion, spread move, micro-trend, anomaly 등.

### 비교 조건
- **추출점 3개** (Conv3, Inception, LSTM) 의 SAE 결과 비교.
- **각 추출점** 에서 *interpretable 비율* (auto-interp 신뢰 0.7 이상) vs *인과 중요도* (ΔF1 평균) 의 상관.
- **Mishra 2026 의 발견 재현**: "해석 가능 ≠ 인과 중요" (final encoder 가 interpretable 비율 높지만 ablation 시 영향 작음) 가 LOB 에서도 관찰되는가.

### 예상 결과
- Conv3 추출: low interpretable ratio (5-10%), 모든 feature 가 인과 중요 (positive ratio 100%).
- Inception 추출: medium interpretable ratio (20-30%), 중간 인과.
- LSTM 추출: high interpretable ratio (40-60%), 그러나 인과 중요도는 lower (Mishra 발견 재현).

이 패턴이 **TSFM 일반 법칙** 인지 아니면 *task 별로 다른지* 의 첫 cross-task 검증.

### 반증 조건
- Conv3 도 high interpretable (>40%) → Mishra 의 layer-wise hierarchy 가 LOB 에는 다른 형태. *task-dependent SAE feature 출현*.
- LSTM SAE feature 가 절제 시에도 ΔF1 변화 무 → SAE 가 모델의 *진짜 회로* 를 못 잡는다. APF 의 attention motif 도 비슷한 한계 가능성.

### 비용
- SAE 학습: 입력 192-dim, $d_{\text{sae}}$=12,288, k=32 → 약 10M param. FI-2010 20만 sample 로 50k step 학습 ≈ 4-8 시간 (GPU).
- 인과 절제 sweep: 1,000 feature × DeepLOB forward 100k samples ≈ 6-10 시간.
- **3 추출점 × 데이터셋 2 (FI-2010, LSE) = 6 SAE 학습 + 6 sweep**. 총 60-100 GPU 시간.
- 데이터: FI-2010 무료, LSE 접근 필요 (OMI 협력 또는 대안 NASDAQ ITCH).
- 코드: SAE 구현 ~300 줄 + 평가 ~200 줄.

**우선순위**: ★★★★★ — Mishra 2026 의 TSFM-SAE 패러다임을 LOB 으로 이식 + APF 의 motif 가설 + Grokking 의 circuit analysis 가 *교차*. 4개 channel (§B, §C, §D, §F) 동시 진전 가능. **본 해체에서 가장 큰 후속 가치**.

---

## 두 아이디어의 우선순위 비교

| 항목 | 아이디어 1 (Permute) | 아이디어 2 (SAE) |
|------|---------------------|------------------|
| **비용** | 낮음 (13 hours GPU) | 높음 (60-100 hours GPU + LSE 접근) |
| **결과 명확성** | 강함 (단순 비교) | 중간 (해석 작업 필요) |
| **연구 가치** | 중간 (architecture 검증) | 매우 높음 (mech interp + LOB) |
| **APF 직접 연결** | 강함 (motif hard 상한) | 강함 (SAE = APF probe 의 generalization) |
| **Grokking 연결** | 약함 | 중간 (circuit analysis 공통) |
| **publishable** | TMLR / NeurIPS Workshop | NeurIPS / ICLR main |

**권장 순서**: 아이디어 1 먼저 (2 주, 적은 비용) → 결과가 위계 가설 지지하면 아이디어 2 의 SAE 가 *어떤 위계 feature 를 자동 발견하는지* 정확히 비교할 baseline 마련.
