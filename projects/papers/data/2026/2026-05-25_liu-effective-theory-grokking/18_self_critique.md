# 18 Self-Critique

> **🧒 본 챕터는 "자기 비판"**: 본 deep dive missing pieces.

## 18.1 챕터 한 줄 요약

> **"4 약점: (1) Mean field 가정의 *real network 한계*, (2) Universality claim 의 *empirical undertest*, (3) Phase boundary 의 *quantitative imprecision*, (4) Toy → Real transfer 의 *open question*."**

## 18.2 약점 1 — Mean Field Approximation

Liu 의 analytical analysis = mean field assumption. *Real deep network* 의 *fluctuations + correlations* 무시. *Approximation valid* 범위 의 *empirical bound* 미공개.

## 18.3 약점 2 — Universality Empirical Test

"*Same universality class*" claim = modular addition 1 task 의 *empirical 측정*. *Cross-task universal* (multiplication, parity 등) 시스템적 미검증.

## 18.4 약점 3 — Phase Boundary Precision

Phase 분류 의 threshold (0.5, 0.9) = arbitrary. *Continuous accuracy* 의 *artificial categorization*. *Quantitative boundary equation* (WD ∝ LR^α) 의 *empirical fit quality* 미공개.

## 18.5 약점 4 — Toy → Real Transfer

Toy 2-layer linear network → real 12-layer Transformer 의 *qualitative same behavior* 가정. *Quantitative match* 미증명.

## 18.6 자기점검

### 핵심 3 가지

1. **본 deep dive 의 *가장 critical missing piece*?**
2. **Mean field 의 *production ML 적용 한계*?**
3. **Universality empirical validation 의 *future research direction*?**

### 답변

1. **Toy → Real transfer 의 *systematic study* 부재**. Liu 의 toy analysis 의 *real Transformer 적용* 가정. *Quantitative phase boundary* 가 *real network 에서 동일* 인지 미검증. 본 deep dive 가 이를 *uncritically accept* — *empirical caveat 부족*. **Future work**: real Transformer 의 *full phase diagram*.

2. **Strong correlations + fluctuations**. Mean field = "*모든 neurons identical avg behavior*" — real network 의 *layer-specific dynamics*, *attention head heterogeneity*, *training noise* 무시. *Quantitative prediction error* ~10-30% — *qualitative correct, quantitative imprecise*. Production ML 의 *high-precision required* 시 *additional theory* 필요.

3. **Multi-task systematic study**. Modular addition / multiplication / parity / boolean / arithmetic 등 *다양한 tasks* 에서 *phase boundary measurement* + *critical exponent extraction* → *universality class identification*. 본 deep dive 가 이 *active research direction* 명시. 2025-2026 의 *empirical universality study* 가 *open frontier*.
