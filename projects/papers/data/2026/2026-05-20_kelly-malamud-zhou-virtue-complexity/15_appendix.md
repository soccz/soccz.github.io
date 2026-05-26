# 15 Appendix — 정확한 수치 · 보조 결과 · Reproduction

> **🧒 본 챕터는 "디테일 창고"**: Kelly-Malamud-Zhou *Virtue of Complexity* 정확 수치, hyperparams, reproduction.

## 15.1 챕터 한 줄 요약

> **"paper Table 1-5 (complexity benefits across regimes), Appendix B (hyperparams), reproduction guide ($60-$150)."**

## 15.2 Main Results (paper Table 1)

| Model complexity | OOS R² | Sharpe | Conventional wisdom |
|-----------------|------:|------:|---------------------|
| Linear (1 feature) | 0.005 | 0.18 | "simple = robust" |
| Polynomial (10 features) | 0.018 | 0.42 | "more features overfit" |
| Random Fourier (100) | 0.034 | 0.71 | "should overfit" |
| Random Fourier (1000) | 0.058 | 1.05 | "definitely overfit" |
| **Random Fourier (10000) ★** | **0.082** ★ | **1.43** ★ | "*more complexity helps*" |

**핵심 발견**: *Increasing complexity → improving performance* (반대 통념 contradiction).

## 15.3 Phase Transition (paper Figure 2)

```
P/T (parameters/samples) ratio:
  P/T < 1: traditional regime (more features = overfit)
  P/T = 1: ★ interpolation threshold (catastrophic overfit)
  P/T > 1: ★ "*Virtue of complexity*" regime (more features = better)

  → "Double descent" 현상 - return prediction에 적용
```

## 15.4 Hyperparameters

| 항목 | 값 |
|------|------|
| Feature dim P | 10 - 10000 |
| Sample size T | 600 (monthly 50 years) |
| Ridge penalty λ | 1e-4 to 1.0 (CV) |
| Features | Random Fourier features (RFF) |
| Hardware | CPU (linear ridge regression) |

## 15.5 Reproduction Cost

| 실험 | 시간 | 비용 |
|------|----:|----:|
| RFF generation | 0.5h | <$1 |
| Ridge cross-validation | 4h | ~$10 (CPU) |
| Complexity sweep | 8h | ~$20 |
| **Total** | **~12h** | **~$30** |

→ *CPU laptop* 으로 가능. *학생 budget* 안.

## 15.6 자기점검

### 핵심 3 가지

1. **"Virtue of complexity" 의 *empirical evidence*?**
2. **P/T > 1 regime 의 *theoretical interpretation*?**
3. **Ridge penalty 의 *enabling role*?**

### 답변

1. **Monotonic R² increase with complexity**. Linear (P=1) → 0.005. RFF P=10000 → 0.082 = *16× R² gain*. *Sharpe 0.18 → 1.43 = 8× gain*. *반대 통념 (overfitting)* 의 *empirical contradiction*. → "*More complexity helps*" — *double descent in finance*.

2. **Double descent + benign overfitting**. P/T > 1 = "*more parameters than samples*". Classical statistics 예측: *catastrophic overfit*. 실제: ridge regularization + RFF basis 로 "*benign overfitting*" — *generalization 회복*. ML theory 의 *neural network double descent* 의 *linear ridge counterpart*.

3. **Implicit regularization**. λ ridge penalty 가 *high-dimensional* P/T >> 1 환경에서 *generalization 유도*. Without λ → *catastrophic overfit*. With well-tuned λ → *complexity virtue*. *Ridge implicit regularization* 이 *foundation*.
