# 10 · 사고 확장 (c) — 실험 아이디어 2 개

본 절은 본 논문에서 영감을 받아 APF / Grokking active track 에서 즉시 실험 가능한 아이디어 2 개를 정리한다. 각 아이디어는 가설 / 데이터 / 비교 조건 / 예상 결과 / 반증 조건 / 비용 추정의 6 부 구조.

---

## 아이디어 1 — APF 의 NoPE motif probe 실험

### 가설
APF 의 motif probe 는 PE 별 attention pattern 을 6 종 motif (diag/stripe/block/edge/spike/checker) 로 분류한다. 본 논문이 NoPE attention 이 T5-rel attention 과 닮음을 보였다면, APF motif probe 에서도 NoPE 의 motif 분포가 T5-rel 의 motif 분포와 가장 닮을 것이다. 반대로 ALiBi 와 Rotary 의 motif 분포는 T5-rel / NoPE 와 다른 form 을 가진다.

**구체적 양적 예상**:
- $P_{\text{NoPE}}$ vs $P_{\text{T5-rel}}$ 의 KL: 작음 (예: < 0.1)
- $P_{\text{NoPE}}$ vs $P_{\text{ALiBi}}$ 의 KL: 큼 (예: > 0.3)
- $P_{\text{NoPE}}$ vs $P_{\text{Rotary}}$ 의 KL: 큼 (Rotary 의 oscillating pattern 이 NoPE 에는 없을 것)
- $P_{\text{NoPE}}$ vs $P_{\text{APE-sin}}$ 의 KL: 중간

### 데이터
APF 의 현재 synthetic motif benchmark (trend/seasonal/regime/anomaly/freq drift) + UCR Archive 의 일부 univariate TS. 학습 시 PE 별로 동일 데이터, 동일 architecture (PatchTST 또는 iTransformer 의 backbone), 동일 optimizer, 5 seed.

### 비교 조건
- PE 6 종: NoPE / sinusoidal / learned / RoPE / ALiBi / (선택) T5-rel
- Architecture 2 종: PatchTST encoder, iTransformer (variate-as-token)
- 동일 학습 step, 동일 batch, 동일 lr (단, lr sensitivity 별도 sweep)

### 예상 결과
1. PatchTST + NoPE 의 motif 분포가 PatchTST + T5-rel 의 motif 분포와 가장 닮음 → 본 논문 결과의 TS 도메인 확장 확인.
2. PatchTST + RoPE 의 motif 분포가 oscillating (checker / stripe) 의 비율이 높음.
3. PatchTST + ALiBi 의 motif 분포가 diagonal (recency) 의 비율이 높음.
4. iTransformer 의 variate-as-token 모드에서는 위치성이 없으므로 PE 효과가 약함 — NoPE 가 PE 와 동등할 가능성.

### 반증 조건
- NoPE 의 motif 분포가 T5-rel 보다 ALiBi 와 닮음 → 본 논문의 자연어 결과가 TS 로 직접 외삽되지 않음. APF framing 의 도메인 의존성 강화 필요.
- 모든 PE 가 거의 같은 motif 분포 → APF motif probe 의 sensitivity 부족 또는 PE 효과의 도메인 의존성 (TS 가 자연어보다 PE 효과가 작음).
- Architecture 차이 (PatchTST vs iTransformer) 가 PE 차이보다 크면, PE 변수 통제 실험 자체의 의미가 흔들림.

### 비용 추정
- 6 PE × 2 architecture × 5 seed × 약 5 datasets = 300 runs
- 각 run 약 2 시간 (small TS, PatchTST 정도) × A100 1 장 → 약 600 GPU-hour
- APF status (motif sweep n=12 까지 완료) 의 기존 인프라 재사용 가능 → 추가 코드 변경 작은편
- **추정**: 1 주일 내 실행 가능, 결과 분석까지 2 주

---

## 아이디어 2 — Grokking 의 NoPE phase transition 검증

### 가설
Grokking 의 "memorization → generalization phase transition" 의 timing 과 sharpness 가 PE 선택에 의존한다. 명시 PE 모델은 PE 의 inductive bias 가 generalization 솔루션을 가속 → grokking onset 이 빠르고 sharp. NoPE 모델은 implicit 위치 신호를 학습해야 하므로 grokking onset 이 늦고 더 smooth 또는 더 sharp (왜냐면 "implicit 회로의 갑작스러운 emergence" 가 더 discrete).

**구체적 양적 예상**:
- Train accuracy 가 99% 도달하는 step 수: 모든 PE 가 비슷
- Test accuracy 가 99% 도달하는 step 수 (= grokking onset): NoPE 가 명시 PE 보다 약 2-5 배 늦음
- Grokking onset 의 sharpness (10% → 90% 까지 step 수): NoPE 가 명시 PE 보다 sharp 또는 smooth — 둘 중 어느지가 hypothesis differentiator

### 데이터
- P2 (Grokking track 의 currently 계획된) logistic map prediction. Logistic map $x_{n+1} = r x_n (1 - x_n)$ with $r \in [3.57, 4.0]$ (chaotic regime).
- 학습: 짧은 sequence ($L = 64$ 또는 $128$).
- 평가: 동일 길이 (length generalization 이 아니라 grokking 자체).

### 비교 조건
- PE 6 종: NoPE / sinusoidal / learned / RoPE / ALiBi / T5-rel (Kazemnejad 의 5 종 + NoPE)
- Backbone: small transformer (2-4 layer, 4-8 head), 동일 사이즈
- 5 seed × PE → 30 runs
- Hyperparameter: weight decay 0.01, lr 1e-3, max steps 100k (grokking 에는 긴 학습 필요)

### 예상 결과
1. 모든 PE 가 train accuracy 99% 빠르게 (1k step 이내) 달성.
2. Test accuracy: 명시 PE 가 10k~30k step 에서 grokking, NoPE 가 50k~100k step 에서 grokking.
3. NoPE 의 grokking sharpness 가 명시 PE 보다 sharp (implicit 회로의 emergence 는 더 discrete).
4. Final test accuracy: NoPE 가 미세하게 높음 (Kazemnejad 의 length-gen 우위와 일관).

### 반증 조건
- NoPE 가 grokking 을 안 함 (test accuracy 가 영원히 train 보다 낮음) → 본 논문 framing 의 logistic map 도메인 부적합 또는 NoPE 의 implicit 위치 신호가 chaotic 시계열에서 안 emerge.
- 모든 PE 가 비슷한 timing 에 grokking → PE 가 grokking dynamics 에 큰 영향 없음. 본 가설 부정.
- Grokking 자체가 안 일어남 (모든 PE 에서) → P2 logistic 실험 setup 의 hyperparameter (weight decay, lr) 가 grokking regime 밖. Grokking track 의 다른 실험 setup 필요.

### 비용 추정
- 6 PE × 5 seed × 100k step × small transformer → 약 30 GPU-hour (작은 모델이라 가능)
- Grokking track 의 현재 setup (Week 1 setup, P2 logistic 진행 중) 의 직접 확장
- 추가 코드: PE 6 종 모듈화 (Kazemnejad 코드 참조 가능). 약 1 주 작업.
- **추정**: 2 주 내 실행, 분석 1 주 → 총 3 주.

### Grokking track 의 must_cite.md 갱신 trigger
- 결과가 가설 지지 → Kazemnejad et al. (2023) 를 grokking dynamics 의 PE 변수 reference 로 인용.
- 결과가 가설 부정 → 본 논문의 결과 (NoPE 우위) 가 grokking dynamics 가 아닌 다른 메커니즘 (architecture / data) 에서 온다는 해석 강화.

---

## 두 아이디어의 조합

두 실험이 모두 실행되면, APF 와 Grokking track 양쪽에 동시에 본 논문의 contribution 을 확장:
- APF: PE → motif → causal intervention 의 sweep 에 NoPE control 추가.
- Grokking: PE × grokking phase 의 새 dimension 추가.

두 결과를 종합한 한 줄 takeaway 가 만약 가설을 지지하면:
> "NoPE 의 우위 (Kazemnejad 2023) 는 (1) attention motif level 에서는 T5-rel-like motif 의 emergence (APF), (2) training dynamics level 에서는 늦은 sharp grokking phase transition (Grokking) 의 결합으로 mechanistic 하게 설명된다."

이게 NeurIPS 2027 plan 의 핵심 narrative 후보 중 하나.
