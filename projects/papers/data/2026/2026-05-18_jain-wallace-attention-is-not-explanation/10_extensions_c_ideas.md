# 10-C 실험 아이디어 2개

## 아이디어 1 — *PE × Faithfulness 격자* (APF 의 H1·H2 격자)

**가설**: PE choice 는 attention 의 faithfulness 의 *큰 조절자*. 특히 *position-anchored* PE (RoPE, ALiBi, FIRE) 가 NoPE 와 sinusoidal 보다 *더 faithful*. 이유: position-anchored PE 는 query/key 의 *기하학적 구조* 를 *강제* 하여 attention 의 *임의 분포 적합성* 을 제약 → adversarial 분포의 *가능성 공간* 이 작아짐 → H2 통과.

**데이터**:
- *Synthetic motif benchmark* (APF 가 이미 보유): trend / seasonal / regime / anomaly / freq-drift 5 종 motif × controlled length.
- *UCR Archive* 의 분류 task (control). 다양한 도메인.
- *ETT-mini* (forecasting baseline) 으로 cross-domain check.

**비교 조건**:
- PE: NoPE / sinusoidal / learned-absolute / RoPE / ALiBi / FIRE
- Encoder: 단순 Transformer (2 layer, 4 head) — *fixed* architecture, PE 만 변동.
- Faithfulness probe: Jain-Wallace H1 (Kendall τ vs gradient) + H2-a (permutation) + H2-b (constrained adversarial — motif-typology aware).
- 추가: APF 의 motif typology 분류기로 *adversarial 분포의 typology 일치* 비율 측정 (*adversarial 이 같은 motif typology 안에 머무는가*).

**예상 결과**:
1. NoPE / sinusoidal: H2 fail (Jain-Wallace 패턴 재현).
2. RoPE / ALiBi: H2 *부분 통과* — adversarial 분포의 *JSD 가 작아짐* 또는 *typology consistency 가 높아짐*.
3. FIRE 등 *learned adaptive* PE: 중간 — adversarial 가능성은 RoPE 보다 약간 큼.
4. **핵심 발견**: PE 의 *기하학적 anchor 강도* 와 attention faithfulness 의 *quantitative correlation* — APF 논문의 *main result figure*.

**반증 조건**: 모든 PE 에서 H2 가 *동일* 하게 fail 또는 pass. 이 경우 본 논문의 결론은 *PE-robust* 이며 APF 의 *PE 가 motif 의 인과* 라는 메인 가설이 *약화* (PE 가 motif 의 *통계적 prior* 일 뿐 *causally important* 가 아님). 이 경우 APF 의 결론을 *재구성* 해야 함.

**비용 추정**: 모델 2 layer × 6 PE × 5 motif task × 5 random seed = 150 학습 run. 각 run 약 10-30 분 (GPU 1 장). 총 **~25-75 GPU-시간**. APF 의 *기존 motif sweep* 파이프라인 위에 *faithfulness probe* 만 추가. 기존 코드 baseline 위에서 *1-2 주* 안에 실험 완료 가능.

---

## 아이디어 2 — *Grokking transition 에서 attention faithfulness 의 phase change 추적*

**가설**: 표준 grokking task (modular arithmetic mod-97) 에서 학습 *전 과정* 의 매 checkpoint 에서 attention faithfulness (Jain-Wallace H2 의 permutation TVD) 를 측정하면, *generalization phase transition 시점* 에 *quantitative phase change* 가 관측됨. 두 시나리오:
- **시나리오 A**: post-grok 에서 *faithfulness 증가* — generalization circuit 이 *attention-mediated*.
- **시나리오 B**: post-grok 에서 *faithfulness 감소* — generalization circuit 이 *attention-bypass* (e.g., MLP / embedding 기반).

Nanda 2023 의 *Fourier circuit* 발견은 *embedding 단계의 Fourier feature* 가 핵심이라 했으므로, 시나리오 B 를 예측. 그러나 *attention head 의 Fourier feature 누적* 도 일부 역할 → 두 시나리오의 *부분 혼합* 가능.

**데이터**:
- Power 2022 의 mod-97 modular addition (표준).
- Logistic map 4-bit/8-bit (`Grokking in TS Transformers` 트랙의 P2 baseline) — 비교용 *iterative dynamical* task.
- (선택) Time-series sin/periodic synthetic (Grokking 트랙 보유).

**비교 조건**:
- Checkpoint: 학습 step 100, 1k, 10k, 50k, 100k, 200k, 500k (transition 전후 dense 샘플링).
- Faithfulness probe: H2-a (permutation TVD distribution) + 추가로 *Nanda progress measure* (gradient symmetry, restricted loss).
- Architecture: 표준 2-layer Transformer (Nanda 2023 의 모델 재현).

**예상 결과**:
- Pre-grok (memorization): TVD 가 *작음* (permutation 무관, 즉 attention 분포에 *덜 의존*).
- Mid-transition: TVD 의 *분포가 broaden* — instance 별 *bimodal* (어떤 instance 는 attention 의존, 어떤 instance 는 비의존).
- Post-grok (generalization): 
  - 시나리오 A: TVD *상승* (attention 의존 증가).
  - 시나리오 B: TVD 가 *더욱 작음* (attention 비의존).
- **핵심 발견**: Grokking 의 4-phase diagram (Power) 또는 3-phase trajectory (Nanda) 위에 *faithfulness phase trace* 가 *추가 dimension* 으로 그려짐. Grokking literature 에 *novel circuit-level diagnostic* 추가.

**반증 조건**: TVD 가 학습 step 에 *무관* (constant). 이 경우 attention 의 faithfulness 가 *학습 dynamics 와 무관* 한 *입력-구조의 함수* 만이라는 의미 → Grokking 분석에서 *attention 은 무관* 한 component 라는 결론. APF 와 Grokking 트랙의 *연결 가설* (PE → motif → faithfulness over training) 이 *부분 무력화*.

**비용 추정**: Modular arithmetic Transformer 는 단일 GPU 에서 *수 시간* 학습. 50 checkpoint × 다중 seed (5) × 2-3 task = 약 **10-20 GPU-시간**. Nanda 의 기존 코드 베이스 (`https://github.com/neelnanda-io/Grokking`) 위에 *faithfulness probe* 만 추가하면 됨. **1-2 주** 실험 완료 가능. **NeurIPS 2027 Grokking 논문의 자체 contribution figure** 후보.
