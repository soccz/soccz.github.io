# 10c · 실험 아이디어 2 개

## 배경 사다리
사용자의 APF + Grokking 두 active 트랙에 본 논문의 framework 를 격상 적용하는 두 실험. 각각 가설 / 데이터 / 비교 조건 / 예상 결과 / 반증 조건 / 비용 추정 6 요소 모두 포함.

---

## 아이디어 1 — IOI-style 3-축 메트릭의 motif occurrence 격상 (APF 직접)

### 가설
"APF 가 발견한 motif occurrence 집합 $\mathcal{M} \subseteq A$ 는 Faithfulness $F(\mathcal{M})$, Completeness via $|F(\mathcal{M} \setminus K) - F(A \setminus K)|$, Minimality via $F(\mathcal{M}) - F(\mathcal{M} \setminus \{v\})$ 의 3 축에서 모두 통과한다. 통과 못 하면 그 motif 는 단순 시각적 패턴이지 인과 단위가 아니다."

### 데이터
- **합성 motif benchmark** (APF 보유): trend / seasonal / regime / anomaly / freq drift 5 종 × PE 5 종 (NoPE / sinusoidal / learned / RoPE / ALiBi) 의 grid.
- **UCR Archive** subset (APF 보유) 의 zero-shot test.
- 한 prompt 당 attention map $A \in \mathbb{R}^{n \times n}$ ($n = $ context length, e.g., $n=24$ 또는 $n=64$).
- 한 attention map 안의 motif occurrences = motif typology (diagonal/stripe/block/edge/spike/checker) 별로 (i, j) 좌표 집합.

### 비교 조건
1. **3-axis pass rate by motif type**: 6 typology × 5 PE × 5 task 의 90 cell 에서 각 motif 가 3 축 모두 pass 하는 비율.
2. **Ablation choice sensitivity**: mean vs zero vs resample ablation 으로 3 축 점수의 변동.
3. **APF-extracted vs random motif**: APF 가 추출한 motif vs random 위치 attention pattern 의 3 축 점수 비교 (random 은 모두 fail 해야 정상).
4. **NoPE 차단 효과**: 무 PE 조건 (Kazemnejad 2023 의 NoPE) 에서 motif 가 사라지는지 — PE 의존성 검증.

### 예상 결과
- **Diagonal motif**: faithfulness pass (모델이 actual 사용), completeness pass (외부 backup 없음), minimality pass (각 diagonal pixel 이 필수) → 진짜 인과 motif.
- **Block motif**: faithfulness pass, minimality fail (개별 pixel 이 fail, 전체 block 으로 evaluate 해야 pass) → **단위가 pixel 이 아닌 block 임의 정황**.
- **Spike motif**: 3 축 모두 pass, 단 specific token position 의존성 강함.
- **Random patterns**: 3 축 모두 fail (control).
- **NoPE 조건**: motif 패턴 약화, 3 축 점수 universally degrade — PE 의존성 정당화.

### 반증 조건
- **AppF 의 모든 motif 가 3 축 fail**: motif 가 인과 단위가 아니라 시각적 artifact → APF framework 의 근본 재검토 필요.
- **Random pattern 이 3 축 pass**: 메트릭이 너무 약함 → metric 재정의 필요.
- **Ablation choice 에 따라 3 축 결과 정반대**: APF 의 motif 정의가 ablation 의존 → 본 논문의 한계 (Q1) 와 동일 함정.

### 비용 추정
- **모델**: 작은 TS Transformer (4-layer × 4-head, ~1M param) — 기존 APF setup 활용.
- **계산**: 90 cells × 3 ablation choice × N=100 prompts × path patching 격자 $4^2 = 16$ edges × 3 metrics ≈ **수백만 forward pass**. A100 1 대로 1-2 일.
- **코드**: `redwoodresearch/Easy-Transformer/utils_circuit_discovery.py` 의 `path_patching()` + `completeness.py` 를 APF backbone 으로 포팅. 약 1 주 작업.
- **분석**: 결과 표 작성 + paper §3 의 motif intervention 절 reference.

이 실험이 APF Paper 의 **§3 핵심 정량 결과** 가 될 후보.

---

## 아이디어 2 — Time-indexed Faithfulness 로 grokking phase 의 정량 정의 (Grokking thesis 직접)

### 가설
"Grokking 현상은 학습 시점 $t$ 의 모델 weight 에서 추출한 generalizing circuit $C_G^{(t)}$ 의 **time-indexed faithfulness** $F_t(C_G^{(t)})$ 가 sigmoid 형태로 phase transition 함으로 정의된다. Sigmoid midpoint $t^*$ 가 grokking time, transition slope 가 sharpness."

### 데이터
- **Logistic map sequence** (Grokking thesis 의 P2 실험, 진행 중): $x_{n+1} = r x_n (1 - x_n)$, $r \in [3.57, 4.0]$ (chaotic regime).
- **Modular arithmetic** (control task): $a + b \mod p$, $p = 113$ (Nanda 2023 의 setup).
- **TS regime-switching synthetic** (Grokking thesis 보유): 두 distinct regime 의 alternation.
- 모델 weight checkpoint 을 학습 동안 매 $10^k$ step 마다 저장 (k = 1, 2, ..., 6).

### 비교 조건
1. **3 task × time series of $F_t(C_G^{(t)})$**: 학습 동안의 faithfulness 곡선.
2. **Memorizing vs generalizing circuit 의 분리**:
   - $C_M^{(t)}$ = train-set 에서만 fit 하는 회로.
   - $C_G^{(t)}$ = test-set 에서도 fit 하는 회로.
   - 두 회로의 head 중복도 추적.
3. **Phase metric**: $\phi(t) = F_t(C_G^{(t)}) / (F_t(C_G^{(t)}) + F_t(C_M^{(t)}))$ 가 sigmoid 인지 확인.
4. **Nanda 의 progress measure 와 비교**: Fourier-feature progress 와 time-indexed faithfulness 의 timing 일치 여부.

### 예상 결과
- **Modular arith**: $\phi(t)$ 가 step 10^5 근처에서 sigmoid 형태로 0 → 1 jump. Nanda 의 결과와 일치.
- **Logistic map**: phase transition 이 더 점진적 (또는 두 stage) 일 가능성 — chaotic dynamics 의 영향.
- **TS regime switching**: regime 마다 다른 회로 emerge, regime-shift 시 회로 재조직. 본 논문이 못 다룬 non-stationary case 의 새 발견.

### 반증 조건
- **$\phi(t)$ 가 sigmoid 가 아니라 linear**: grokking 이 회로 emergence 가 아닌 다른 동학 (e.g., norm growth) → grokking 의 새 메커니즘 가설 필요.
- **$C_M$ 과 $C_G$ 가 분리 불가능 (head overlap 100%)**: 본 논문의 회로 분리 framework 가 grokking 에 부적합 → Marks 의 SAE-feature 단위로 격상.
- **Time-indexed faithfulness 가 test accuracy 와 weakly correlated**: 회로 분석이 grokking 의 진짜 메커니즘이 아닐 가능성.

### 비용 추정
- **모델**: small TS Transformer (4-layer × 4-head, ~1M param) — Grokking thesis baseline.
- **체크포인트**: ~6 checkpoint × 3 task = 18 weight snapshot. 각각 path patching 격자 측정.
- **계산**: 각 snapshot 마다 IOI-style 발견 절차 (수동 또는 ACDC 자동) — ACDC 자동으로 1 snapshot 당 A100 약 1 시간 → 18 시간 total.
- **분석**: 시간축 시각화, sigmoid fit, phase transition 검증.
- **코드**: ACDC repo (`ArthurConmy/Automatic-Circuit-Discovery`) 를 Grokking baseline 에 적용. 약 2 주 작업.

이 실험이 Grokking thesis 의 **§4 또는 §5 핵심 결과** 후보. 본 논문의 Wang et al. 2023 + Conmy 2023 + Nanda 2023 의 3 reference 가 모두 인용됨.

---

## 두 아이디어의 연결

- **공통 framework**: 두 실험 모두 IOI 의 3-축 메트릭 + path patching 을 격상.
- **APF 격상 차원**: 단위 (head → motif occurrence) 격상, fixed weight 분석.
- **Grokking 격상 차원**: 시간 (snapshot → time series) 격상, head 단위 유지.
- 두 axis 모두 가능하면 **APF × time-indexed = motif emergence during grokking** 의 4-way intersection 실험 — Grokking thesis 의 ultimate 목표 ("0 papers found" 의 4-way intersection 의 한 instantiation).

본 논문의 framework 의 격상 axis 가 **단위 (APF) + 시간 (Grokking)** 둘이라는 것 자체가 사용자 두 트랙의 합집합이 본 논문 framework 의 자연스러운 확장 공간임을 시사.
