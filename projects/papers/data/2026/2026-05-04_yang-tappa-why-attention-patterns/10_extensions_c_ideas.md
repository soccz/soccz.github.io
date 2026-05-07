# 10. 사고 확장 — Part C: 실험 아이디어 2개

## 아이디어 1 — q-similarity 의 TS Transformer 이식 + Multi-PE 비교 (APF 의 직접 sub-experiment)

**가설**: TAPPA 의 q-similarity 가 LLM 에서 motif typology 와 강한 회귀 (high $S_l$ → re-access pattern, high freq RoPE → slash pattern) 를 보였다면, TS Transformer (PatchTST, iTransformer) 에서도 비슷한 회귀가 보이는가? 그리고 그 회귀가 (i) RoPE, (ii) sinusoidal, (iii) ALiBi, (iv) NoPE, (v) learned PE 다섯 PE 에서 어떻게 다른가?

**데이터**: 
- 합성 데이터 (사용자 보유): logistic map (chaotic), sin/periodic (high autocorr), regime-switching (q-sim discontinuity 유도). 각 1000 sequence × length 512.
- 실제 데이터: ETT-mini, Weather-mini, Traffic-mini (사용자 보유).

**비교 조건**: 
- 모델: PatchTST 4-layer × 4-head × $d_h = 64$ (small for cheap sweep)
- PE: 5 종 × 모델 동일 설정 → 5 모델 학습
- Motif typology: APF 의 6 motif (diagonal/stripe/block/edge/spike/checker) 분류 + TAPPA 의 3 motif (slash/sink/reaccess) 분류 두 set 비교
- Layer-wise q-similarity 측정 + motif label 과 회귀

**예상 결과**:
- RoPE 모델에서 TAPPA 의 q-sim → motif 회귀가 LLM 에서와 같이 강함 (cross-domain replication)
- ALiBi 에서는 invariance algebra 가 다르므로 회귀 약화
- NoPE 에서는 q-sim 이 motif 와 무관 (RoPE-frequency 가 중요했던 게 본질이라는 증거)
- Learned PE 에서는 회귀가 prompt 의존적
- TS-specific motif (block, checker) 는 어느 PE 에서도 q-sim 만으로는 설명 안 됨

**반증 조건**: 
- 만약 NoPE 에서도 q-sim 이 motif 와 강하게 회귀한다면 TAPPA 의 RoPE-frequency decomposition 이 본질이 아니라 q-sim 자체가 본질 → APF 의 multi-PE 비교 차별화 약화 → APF 가 다른 차별화 (causal intervention) 에 더 의존해야 함.
- 만약 TS Transformer 에서 q-sim 자체가 LLM 과 너무 다른 분포를 보여 (예: 모든 layer 에서 거의 동일 $S_l$) layer-wise allocation 이 의미 없으면, TS 도메인에서는 다른 metric 필요 → APF 가 TS 특화 metric 발견의 niche.

**비용 추정**: 5 PE × 4 dataset × 4 seed = 80 small training run × 10 min/run = 13 GPU-hours (1 A100). Motif 분석 + 회귀 분석 = 추가 2일 분석. 총 1주.

---

## 아이디어 2 — q-similarity 의 학습 dynamics 추적: Grokking 의 새 signature

**가설**: Grokking phase transition (memorization → generalization) 동안 query self-similarity 가 sharp transition 을 보인다. 구체적으로 (i) memorization phase 에서 q-sim 이 noise-level (random query distribution 으로 인한 낮은 cosine), (ii) grokking 직전 q-sim 이 sudden jump (representation collapse → structured query manifold), (iii) post-grokking 에서 high stable q-sim. 이 trajectory 가 grokking 의 또 다른 progress measure (Nanda 2023 의 restricted/excluded loss 와 보완적) 가 된다.

**데이터**:
- Modular addition (Power 2022, Nanda 2023 표준 grokking task): mod-113 addition, 5000 examples train / rest test
- Logistic map (사용자 보유, grokking 적용 thesis 의 task): 학습 task = next-step prediction
- Optionally: TS forecasting on logistic map with grokking-inducing setting (small data + weight decay)

**비교 조건**:
- Architecture: 1-layer Transformer (Nanda 2023 setting), 4-layer Transformer (사용자 P2 logistic 4-layer 실험)
- Track: 매 100 step 마다 layer-wise / head-wise q-sim 측정
- Compare with: Nanda 의 progress measures (restricted loss, excluded loss, gini coefficient)

**예상 결과**:
- Grokking 발생 시점 (test acc sudden jump) 의 ~ 1000 step 전부터 q-sim 이 monotonic increase
- q-sim trajectory 가 progress measure 와 strong correlation
- Pre-grokking phase 의 layer 별 q-sim 분산이 큼 (some layers are already in "correct" regime, others lagging)

**반증 조건**:
- q-sim 이 grokking 전 학습 내내 거의 평탄하다면 inference-only metric 에 머무름 → training signature 로의 확장 무효
- q-sim 의 변화가 grokking 시점과 무관하게 다른 시점에 jump 한다면 (예: weight decay 의 phase transition 과 동기) q-sim 이 grokking-specific 이 아닌 일반적 학습 dynamics 의 byproduct → contribution 약화

**확장 가설** (낚시): grokking 발생을 q-sim threshold 로 **predict** 가능. 학습 중 q-sim 이 특정 임계값을 넘으면 N step 안 grokking 발생. 만약 사실이면 grokking induction 의 early stopping 신호.

**비용 추정**: modular addition × 1-layer = 30 min/run × 10 seed = 5 GPU-hours. Logistic 4-layer × Grokking-inducing setting = 2 hour/run × 10 seed = 20 GPU-hours. 분석 = 3일. 총 2주.

---

## 두 아이디어의 cross-track 가치

이 두 아이디어가 사용자의 두 active track (APF + Grokking) 양쪽에 직접 기여:
- **아이디어 1**: APF 의 motif sweep 의 세 번째 축 (q-sim) 추가 + multi-PE 비교 의 baseline / sanity check.
- **아이디어 2**: Grokking 의 새 progress measure + APF 의 inference metric 의 학습 dynamics 확장.

두 아이디어가 같은 metric (q-similarity) 으로 두 track 을 연결한다는 점에서, TAPPA 의 framework 를 사용자 연구의 unifying methodology 로 흡수 가능. ICLR 2026 의 강한 작업을 lemma 로 빌리면서 두 track 모두 차별화 niche 를 점유하는 전략적 추출.
