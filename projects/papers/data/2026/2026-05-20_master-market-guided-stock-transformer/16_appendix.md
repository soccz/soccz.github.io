# 16 Appendix — 정확한 수치 · 보조 결과 · Reproduction

> **🧒 본 챕터는 "디테일 창고"**: MASTER 정확 수치, hyperparams, reproduction.

## 16.1 챕터 한 줄 요약

> **"paper Table 1-5 (CSI-300/500/800 results), Appendix B (hyperparams), reproduction guide ($150-$400)."**

## 16.2 CSI-300 Results (paper Table 1)

| Model | IC | ICIR | Annual Return | Sharpe | Max Drawdown |
|-------|----:|-----:|--------------:|-------:|-------------:|
| LSTM | 0.045 | 0.312 | 14.8% | 1.12 | -28.5% |
| GAT | 0.052 | 0.385 | 16.5% | 1.28 | -25.3% |
| HATS | 0.058 | 0.421 | 18.2% | 1.45 | -22.1% |
| DTML | 0.063 | 0.461 | 20.1% | 1.62 | -19.8% |
| **MASTER** | **0.072** ★ | **0.521** ★ | **23.4%** ★ | **1.84** ★ | **-17.2%** ★ |

## 16.3 CSI-500 Results (paper Table 2)

| Model | IC | Annual | Sharpe |
|-------|----:|------:|------:|
| LSTM | 0.038 | 12.1% | 0.92 |
| DTML | 0.057 | 17.5% | 1.41 |
| MASTER | **0.067** ★ | **21.2%** ★ | **1.71** ★ |

## 16.4 Hyperparameters (paper Appendix B)

| 항목 | 값 |
|------|------|
| Lookback window | 10 days |
| Stock feature dim | 158 (technical indicators) |
| Market feature dim | 10 |
| `d_model` | 128 |
| `n_heads` | 4 |
| Intra-layers | 2 |
| Inter-layers | 1 |
| Optimizer | Adam |
| Learning rate | 1e-4 |
| Loss | -Pearson correlation |
| Batch size | 32 |
| Epochs | 50 |
| Hardware | 1× V100 |

## 16.5 Reproduction Cost

| 항목 | 시간 | 비용 (AWS V100 $2.5/h) |
|------|----:|--------------------:|
| CSI-300 training | 24h | $60 |
| CSI-500 training | 36h | $90 |
| CSI-800 training | 60h | $150 |
| **Total 3 universes** | **~5 days** | **~$300** |

→ *학부생 budget* 안에 *완전 reproduction*.

## 16.6 Ablation Study (paper §4.5)

| 변경 | IC | 평가 |
|------|----:|------|
| Baseline (all) | **0.072** | ★ standard |
| Without market gating | 0.058 | regime adaptation 잃음 |
| Without intra-attention | 0.061 | time pattern 잃음 |
| Without inter-attention | 0.054 | cross-sectional 잃음 |
| Single-stock LSTM equivalent | 0.045 | no cross-sectional |
| Pre-Norm vs Post-Norm | 0.071 | minor |
| Dropout 0.1 vs 0.3 | 0.071 vs 0.068 | overfit risk |

**결정적 발견**:
- **Inter-stock attention**: most critical (없으면 0.072 → 0.054, -25%)
- **Market gating**: 두 번째 critical (-19%)
- **Intra-attention**: third (-15%)

## 16.7 후속 paper 의 후속 결과

### Sector-aware MASTER (2024 후속)

```
MASTER + sector mask:
  - Inter-stock attention 이 sector 내 cluster
  - Computational cost 감소
  - Performance 유지
```

### Foundation Stock Model (2025)

```
MASTER architecture + pre-training on multiple markets:
  - 학습 corpus: 글로벌 stock universe
  - Zero-shot to new markets
  - "*Stock TFM*" prototype
```

## 16.8 자기점검

### 핵심 3 가지

1. **Inter-stock attention 의 *25% gain* 의 *quant intuition*?**
2. **Annual return 23.4% (Sharpe 1.84) 의 *practical significance*?**
3. **CSI-300/500/800 cross-validation 의 *generalization 입증*?**

### 답변

1. **Cross-sectional dependency 의 *enormous information***. Stock returns 가 *partially correlated* (sector co-movement, market beta, macro). Single-stock 모델 = "*동시 발생 다른 stocks 의 정보 무시*". Inter-stock attention = "*어느 stocks 가 *co-move*? 어느 stocks 가 *diverge*?*" — *rich relative signal*. 25% gain = *cross-sectional info 가 25% explanatory power*.

2. **Top-decile quant hedge fund return**. Industry benchmark: quant fund 의 *annual return 15-25%*, Sharpe 1.2-2.0 = *top quartile*. MASTER 의 23.4% + 1.84 = *industry-leading 성과 in academic backtest*. 실전 deployment (transaction cost, capacity) 시 *수 percent 감소* — but *여전히 우수*.

3. **Three universe size validation**. CSI-300 (large-cap), CSI-500 (mid-cap), CSI-800 (combined). 모든 size 에서 *consistent improvement* over baselines. Universe size 변화에도 *robust* — *generalization 입증*. *Production deployment* 시 다양한 universe 적용 가능.
