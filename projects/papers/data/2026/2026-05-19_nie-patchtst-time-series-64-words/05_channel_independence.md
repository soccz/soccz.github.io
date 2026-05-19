# 05 Channel-independence — M 변수 모두 같은 weight

paper Section 3.1 의 또 다른 핵심.

## Forward 정의

paper p.3:

> We denote a $i$-th univariate series of length $L$ starting at time index 1 as $x_{1:L}^{(i)} = (x_1^{(i)}, \ldots, x_L^{(i)})$ where $i = 1, \ldots, M$. The input $(x_1, \ldots, x_L)$ is split to $M$ univariate series $x^{(i)} \in \mathbb{R}^{1 \times L}$, where each of them is fed independently into the Transformer backbone according to our channel-independence setting. Then the Transformer backbone will provide prediction results $\hat{x}^{(i)} = (\hat{x}_{L+1}^{(i)}, \ldots, \hat{x}_{L+T}^{(i)}) \in \mathbb{R}^{1 \times T}$ accordingly.

**핵심**:
1. Multivariate $(x_1, \ldots, x_L)$ 를 $M$ 개의 **univariate** $x^{(i)}$ 로 split
2. 각 univariate 를 **independently** 같은 Transformer 에 forward
3. 출력도 univariate $\hat{x}^{(i)}$, 마지막에 concatenate 하여 multivariate

---

## Pseudo-code

```python
def channel_independent_forward(x: torch.Tensor) -> torch.Tensor:
    """
    x: (B, M, L) — batch, channels, look-back length
    Returns: (B, M, T) — multivariate prediction
    """
    B, M, L = x.shape
    
    # 모든 (batch, channel) pair 를 univariate 으로 펼침
    x_flat = x.reshape(B * M, 1, L)  # (B*M, 1, L)
    
    # 같은 Transformer 에 forward — weight 공유
    pred_flat = transformer_backbone(x_flat)  # (B*M, 1, T)
    
    # 다시 multivariate 로 재구성
    pred = pred_flat.reshape(B, M, T)  # (B, M, T)
    
    return pred
```

**중요**:
- `transformer_backbone` 은 **하나의 instance** — 모든 채널이 같은 weight 사용
- `reshape` 으로 batch 차원에 M 을 흡수 → 채널 간 independence 보장
- Channel 끼리 attention 없음 — 정보 교류는 weight sharing 으로만

---

## Channel-mixing vs Channel-independence

```
=== Channel-Mixing (Informer / FEDformer / Autoformer) ===

시점 t 의 multivariate:
  x_t = [x_t^(1), x_t^(2), ..., x_t^(M)] ∈ R^M
  
한 token = 한 timestep 의 모든 변수
  token_t = MLP(x_t) ∈ R^D
  
모든 변수가 같은 token 에 섞임 (mixing)


=== Channel-Independence (PatchTST) ===

각 변수 i 의 univariate:
  x^(i) = (x_1^(i), ..., x_L^(i)) ∈ R^L

각 변수가 독립적으로 patching → tokenization
  tokens_i = patching(x^(i)) ∈ R^{D×N}
  
같은 Transformer 가 각 변수에 독립 적용
  z^(i) = Transformer(tokens_i)   ← same weights for all i
  
출력 concatenate
  pred = [z^(1), z^(2), ..., z^(M)] ∈ R^{M×T}
```

---

## 인터랙티브 시각화

```viz:pat-channel-indep:title=Channel-independence vs Channel-mixing (interactive),caption=토글로 두 방식 비교. Channel-mixing 은 한 시점의 모든 변수를 한 token 으로 (Informer 스타일). Channel-independence 는 각 변수를 독립 forward 하되 같은 weight 공유 (PatchTST). M 변수 = 3 channels 로 시각화.
```

---

## 왜 channel-independence 가 효과적인가

paper Section 4.3 본문 + Appendix A.7 분석.

**가설 1 — Overfitting 감소**:
- Channel-mixing 은 $M \cdot L$ 차원의 입력 → parameter 가 $M$ 에 비례하여 증가
- Channel-indep 는 univariate 만 처리 → parameter $M$ 에 독립

**가설 2 — Universal pattern 학습**:
- 모든 시계열에 공통된 patterns (trend, periodicity) 만 학습
- Cross-channel correlation 은 명시적 modeling 없이 implicit 학습

**가설 3 — Cross-channel correlation 의 약점**:
- 시계열 사이의 correlation 은 종종 spurious (e.g., Electricity dataset 의 321 변수 모두 비슷한 hourly pattern)
- Channel-mixing 은 spurious correlation 에 overfit 위험

paper p.8:
> The motivation of patching is natural; furthermore this technique improves the running time and memory consumption as shown in Table 1 due to shorter Transformer sequence input. Channel-independence, on the other hand, may not be as intuitive as patching is in terms of the technical advantages. Therefore, we provide an in-depth analysis on the key factors that make channel-independence more preferable in Appendix A.7.

→ **저자도 "Channel-indep 의 효과는 직관적이지 않다" 인정**. Appendix 에서 추가 분석.

---

## Appendix A.7 의 발견 — Figure 7

paper p.21 (Figure 7):
> Channel-independence vs channel-mixing on Weather dataset. The base model is...

**Figure 7 결과** (Weather):
- **Train loss**: channel-indep 가 더 빨리 감소
- **Test loss**: channel-mixing 은 처음 몇 epoch 후 overfitting → loss 증가 / channel-indep 은 계속 감소

paper:
> Channel-mixing models show overfitting after a few initial epochs, while channel-independent models continue optimizing the [loss on test data].

→ **Channel-mixing 의 핵심 약점: overfitting**.

---

## Channel-indep 의 비용 — cross-channel pattern 손실

paper Section 5 (Conclusion):
> Channel-independence, on the other hand, can be further exploited to incorporate the correlation between different channels. It would be an important future step to model the cross-channel dependencies properly.

**한계 인정**:
- Channel 간의 실제 dependency (예: 전력의 한 지역 → 인근 지역 영향) 를 명시적으로 modeling 못함
- Future work 으로 cross-channel dependency 추가 필요

→ **PatchTST 는 simplest baseline**. 이후 work (iTransformer 등) 가 channel-attention 다시 도입.

---

## Channel-indep + Patching 의 시너지

| 디자인 | 효과 |
|---------|------|
| Channel-indep alone | Linear models (DLinear) 가 이미 사용 — 작동하지만 표현력 부족 |
| Patching alone | Transformer 토큰 수 감소 — 효율적이지만 forecasting 약함 |
| **Patching + Channel-indep** | 둘 다 결합 → SOTA |

paper Table 7 ablation:

| Case | Patching | Channel-indep | MSE on Electricity (T=96) |
|------|----------|---------------|---------------------------|
| (a) Both | ✓ | ✓ | **0.152** |
| (b) CI only | × | ✓ | 0.164 |
| (c) P only | ✓ | × | 0.168 |
| (d) Neither | × | × | 0.177 (DLinear original) |

→ **둘 다 essential**, **개별로도 효과 있음**. 시너지 분명.

다음 [06_transformer_encoder.md](06_transformer_encoder.md) 에서 Transformer encoder 의 정확한 spec.
