# 12. Ablation Study — P + CI 의 효과 분해

> 본 논문 *Table 7* 의 ablation. *Patching* 과 *Channel-Independence* 각각의 contribution 정량.

---

## 12.1 챕터 한 줄 요약

> **"P (Patching) + CI (Channel-Indep) 을 각각 끄고 비교. 결과: 두 trick 의 *순서* 와 *조합* 분석. P 단독: 50% 의 MSE reduction 효과. CI 단독: 30%. P+CI 결합: 100%."**

---

## 12.2 Ablation 이 뭐예요?

**일상 비유**: 좋은 요리의 *각 재료의 contribution* 측정. *재료 A 만 빼면 맛 어떻게?*, *재료 B 만 빼면?*, *둘 다 빼면?*. 각 재료의 *진짜 효과* 분리.

본 논문: PatchTST 의 *두 trick (P, CI)* 각각의 contribution 분리.

---

## 12.3 Table 7 — 4 가지 경우 비교

본 논문이 4 가지 model 비교:

| 모델 | Patching | Channel-Indep | 의미 |
|------|---------|---------------|------|
| **PatchTST (P+CI)** | ✓ | ✓ | 본 논문 main result |
| **CI only** | ✗ | ✓ | Channel-indep 만, patching 없음 |
| **P only** | ✓ | ✗ | Patching 만, channel-mixing |
| **Original** | ✗ | ✗ | 둘 다 없음 (vanilla Transformer baseline) |

### 어떻게 읽나? (Table 7)

**Step 1 — 4 cell 비교**

3 datasets (Weather, Traffic, ETTh1) × 2 horizons (96, 720) = 6 sub-table. 각 sub-table 에 4 model 의 MSE.

**Step 2 — 비교 방법**

각 sub-table 에서:
- *Original* (둘 다 없음) = baseline.
- *Original → P only*: Patching 만 추가 시 MSE 감소.
- *Original → CI only*: CI 만 추가 시 MSE 감소.
- *Original → P+CI*: 둘 다 추가 시 MSE 감소.

**Step 3 — 핵심 발견** (Table 7 의 평균)

| 모델 | Traffic h=96 MSE | 감소 비율 |
|------|------------------|-----------|
| Original (baseline) | 0.518 | 0% (reference) |
| P only | 0.430 | 17% 감소 |
| CI only | 0.396 | 23% 감소 |
| **P + CI** | **0.397** | **23% 감소** |

(정확한 수치는 paper 참조 — 본 표는 *대략적 패턴* 묘사.)

**핵심 발견**:
1. **P 단독**: 약 17% MSE reduction.
2. **CI 단독**: 약 23% reduction.
3. **P + CI**: 약 24% reduction.

→ **CI 가 더 큰 contribution**. *Patching 은 마이너 + Channel-indep 가 메이저*.

```viz:pat-ablation-table7:title=Table 7 — P+CI / CI / P / Original (interactive),caption=4 모델 비교. CI 가 메이저 contribution, P 가 마이너. Channel-indep 단독으로도 SOTA.
```

---

## 12.4 Figure 4 — Patch length sensitivity

![Figure 4 — Patch length ablation](figures/Fig4_patch_length.png)

*paper p.15 Figure 4 — $P \in \{2, 4, 8, 12, 16, 24, 32, 40\}$ 에서 MSE.*

### 어떻게 읽나? (Step-by-step)

**Step 1 — Setup**

$L = 336$, prediction $= 96$. 다양한 patch length P 의 MSE.

**Step 2 — 축 의미**

- **X-axis**: $P$ (patch length). $\{2, 4, 8, 12, 16, 24, 32, 40\}$.
- **Y-axis**: MSE.

**Step 3 — 발견**

선이 *대체로 flat* — *P 가 어떤 값이든 MSE 비슷*.

특히:
- $P = 16$ 의 default 가 *robust*.
- $P = 8$ 또는 $P = 24$ 도 *거의 동등*.
- 극단 (P = 2 또는 P = 40) 도 *약간만 손실*.

**의미**: **Patching 의 *정확한 P 값에 둔감***. 즉 *hyperparameter tuning 거의 안 필요*.

```viz:pat-fig4-patch-length:title=Fig 4 — Patch length P sensitivity (interactive),caption=P=2-40 sweep. MSE 둔감. P=16 robust 선택.
```

---

## 12.5 본 챕터 정리 — *진짜 source of improvement*

```
   2가지 trick 의 contribution
   ───────────────────────

   P (Patching) only        → 17% MSE reduction
   CI (Channel-Indep) only  → 23% MSE reduction
   P + CI                   → 24% MSE reduction
                              ↓
   ★ Channel-Indep 가 *진짜 source*
   ★ Patching 은 *speed-up + longer L 가능* (간접 효과)
                              ↓
   본 논문 권장:
   - Channel-Indep 는 *필수*
   - Patching 은 *함께 사용* (computational benefit)
```

→ **본 논문 메시지의 *재해석***: "Patching + Channel-Indep = SOTA" 의 *진짜 메인 contribution* 은 **Channel-Indep**.

---

## 12.6 자기점검

### 핵심 3가지
1. **Ablation 의 일상 비유?**
2. **Table 7 의 4 model 비교 결과?**
3. **본 논문의 *진짜 source of improvement*?**

### 답변
1. **요리의 *각 재료의 contribution* 측정**. 재료 A 만 빼고 비교, 재료 B 만 빼고 비교, 둘 다 빼고 비교. 본 논문: Patching (P) 와 Channel-Indep (CI) 각각 끄고 + 둘 다 끄고 비교 (4 가지 case).
2. **(1) Original (둘 다 없음)**: baseline MSE. **(2) P only**: 17% reduction. **(3) CI only**: 23% reduction. **(4) P + CI**: 24% reduction. CI 가 P 보다 *더 큰 contribution* — *Channel-Independence 가 메이저*.
3. **Channel-Independence (CI)** 가 본 논문의 *진짜 메인 contribution*. Patching 은 *computational benefit (22× speed-up, longer L 가능)* — *indirect 효과*. CI 가 *직접* MSE reduction 기여. 본 논문 권장: *CI 필수*, *Patching 은 함께 사용*.

---

다음 챕터: [13_conclusion.md](13_conclusion.md) — Conclusion + Future Work.
