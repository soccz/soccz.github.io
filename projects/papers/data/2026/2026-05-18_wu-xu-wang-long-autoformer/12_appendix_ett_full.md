# 12. Appendix A — ETT 4 Variant 전체 벤치마크 (Table 5)

> Paper *Appendix A (p.13)*. 4 ETT variant (h1, h2, m1, m2) 의 *전체 6 horizon* 결과.

---

## 12.1 챕터 한 줄 요약

> **"Main paper Table 1 의 ETTm2 만 보여진 것의 *완전 버전*. ETTh1, ETTh2, ETTm1, ETTm2 × 6 horizons × 6 models. *Autoformer 가 거의 모든 cell 에서 best*. 평균 60% MSE reduction in ETT."**

---

## 12.2 Table 5 — Multivariate ETT (4 variant 전체)

본 논문 *Table 5 (p.13)*. 4 ETT variant 전체 결과.

### Table 5 의 구조

- **4 ETT variants**: ETTh1, ETTh2, ETTm1, ETTm2.
- **6 prediction horizons**: $O \in \{24, 48, 168, 288, 336, 672, 720\}$.
- **7 models**: Autoformer, Informer, LogTrans, Reformer, LSTNet, LSTMa.
- **Total**: 4 × 6 × 7 = 168 cell (* 2 metrics MSE/MAE = 336 수치).

### 어떻게 읽나? (Step-by-step)

**Step 1 — 4 sub-table 구조**:
- 위 부터 ETTh1, ETTh2, ETTm1, ETTm2 순서.

**Step 2 — 각 sub-table 의 6 row** (horizons):
- 시간 단위 dataset (ETTh1, ETTh2): $\{24, 48, 168, 336, 720\}$.
- 15분 단위 dataset (ETTm1, ETTm2): $\{24, 48, 96, 288, 672\}$.

**Step 3 — 비교 방법**:
- 각 row 에서 7 model 의 *MSE 가장 작은 = best (bold)*.
- *Autoformer 의 bold 위치* 확인.

**Step 4 — 핵심 발견**:

**ETTh1 predict-336**:
- Best baseline (Informer): MSE = **1.128**.
- **Autoformer**: MSE = **0.505** (55% 감소).

**ETTh2 predict-336**:
- Best baseline (Informer): MSE = 2.723.
- **Autoformer**: MSE = **0.471** (83% 감소).

**ETTm1 predict-288**:
- Best baseline (Informer): MSE = 1.056.
- **Autoformer**: MSE = **0.634** (40% 감소).

**ETTm2 predict-288**:
- Best baseline (Informer): MSE = 1.047.
- **Autoformer**: MSE = **0.342** (66% 감소).

### 본 논문 명시 수치

본 논문 Appendix A 명시:
- ETTh1 input-96-predict-336: Autoformer 가 *55% MSE 감소* (1.128 → 0.505).
- ETTh2 input-96-predict-336: *80% MSE 감소* (2.544 → 0.471).
- ETTm1 input-96-predict-288: *40% MSE 감소* (1.056 → 0.634).
- ETTm2 input-96-predict-288: *66% MSE 감소* (0.969 → 0.342).
- **ETT 전체 평균: 60% MSE reduction** vs 이전 SOTA.

---

## 12.3 *ETT 4 variant 의 의미*

### ETTh1 vs ETTh2 — 같은 시간 단위, 다른 위치

- *시간 단위* (1시간) 동일.
- *변압기 위치* 만 다름 (1 vs 2).
- *결과*: 같은 패턴 — Autoformer 가 *모든 horizon best*.

→ *위치 invariance* — 모델 이 *특정 변압기 의 특성* 에 *overfit X*.

### ETTm1 vs ETTm2 — *Granularity 차이*

- *15분 단위* — 더 *fine-grained*.
- *Timestep 수* (69,680) 더 많음.

→ Autoformer 가 *fine-grained 시계열* 도 잘 처리.

### ETTh vs ETTm — *Temporal aggregation*

- *시간 단위* (h, ~17k timestep) vs *15분 단위* (m, ~70k timestep).
- *모두* Autoformer 가 best.

→ *Temporal resolution invariance*.

---

## 12.4 *Autoformer 의 ETT 전체 평균 60% 감소* — 의미

본 논문 paper 명시: **ETT 전체 평균 60% MSE reduction**.

**의미**:
- *ETT 가 변압기 dataset* — *에너지 응용*. 60% 감소 의 *실용적 임팩트* 매우 큼.
- *변압기 과열 예측* 의 *60% 정확도 향상* → *유지보수 비용 절감 + 안전성*.

**일상 비유**: 자동차 엔진 의 *과열 알람* 이 *60% 더 정확* → *큰 사고 사전 방지*.

---

## 12.5 본 챕터 정리

```
   Main Paper Table 1 (ETTm2 만)            Appendix A Table 5 (4 variant 전체)
   ─────────────────────────                ──────────────────────────────────

   ETTm2 × 4 horizons                       ETTh1, h2, m1, m2 × 6 horizons
   38% MSE reduction (전체 평균)             60% MSE reduction (ETT 평균)
              ↓                                      ↓
   Autoformer 의 universal 우위              위치 + 시간 단위 invariance
              ↓                                      ↓
   ETT 의 *에너지 응용* 에서 가장 큰 임팩트
   (변압기 과열 예측, 유지보수)
```

---

## 12.6 자기점검

### 핵심 3가지
1. **Table 5 의 *4 ETT variant* 의 의미?**
2. **ETT 전체 *60% MSE reduction* 의 실용적 의미?**
3. **위치 + 시간 단위 invariance 의 증명?**

### 답변
1. **ETTh1, ETTh2** (시간 단위 변압기 1, 2) **+ ETTm1, ETTm2** (15분 단위 변압기 1, 2). 즉 *2 위치 × 2 시간 단위 = 4 variant*. 모두 *7 변수 (변압기 작동)*. Main Table 1 은 ETTm2 만 — Appendix A 가 *4 variant 전체*.
2. **변압기 dataset 의 *60% MSE reduction* 은 *에너지 응용 의 큰 실용적 임팩트***. 예: ETTh2 predict-336 의 *80% 감소* (2.544 → 0.471). 변압기 과열 예측 의 정확도 향상 → *유지보수 비용 절감 + 안전사고 사전 방지*. 자동차 엔진 의 *과열 알람 60% 정확* → *큰 사고 방지*.
3. **(위치 invariance)**: ETTh1 vs ETTh2 (같은 시간 단위, 다른 변압기 위치) 모두 *Autoformer best* — *특정 변압기 의 idiosyncrasy 에 overfit X*. **(시간 단위 invariance)**: ETTh (시간) vs ETTm (15분) 모두 *best* — *temporal resolution* 무관. *Model 의 generalization* 의 강력 증명.

---

다음 챕터: [13_appendix_hyper_input.md](13_appendix_hyper_input.md) — Appendix B-D (Table 6/7/8/9).
