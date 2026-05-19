# 04 Patching — 시계열 → patch sequence

paper Section 3.1 의 핵심 컴포넌트.

## 입력 / 출력 spec

paper p.3:

> Each input univariate time series $x^{(i)}$ is first divided into patches which can be either overlapped or non-overlapped. Denote the patch length as $P$ and the stride - the non overlapping region between two consecutive patches as $S$, then the patching process will generate the a sequence of patches $x_p^{(i)} \in \mathbb{R}^{P \times N}$ where $N$ is the number of patches, $N = \lfloor \frac{(L-P)}{S} \rfloor + 2$.

**기호 정리**:
| 기호 | 의미 | 일반 값 |
|------|------|--------|
| $L$ | look-back window | 336 또는 512 |
| $P$ | patch length | 16 |
| $S$ | stride | 8 |
| $N$ | 토큰(patch) 수 | 42 (P=16, S=8, L=336 시) |
| $x^{(i)}$ | $i$-th univariate 시계열 ($i = 1, \ldots, M$) | $\in \mathbb{R}^{1 \times L}$ |
| $x_p^{(i)}$ | patched 결과 | $\in \mathbb{R}^{P \times N}$ |

---

## 수식 확인 — N 계산

$N = \lfloor (L-P)/S \rfloor + 2$.

**Default 시나리오** (PatchTST/42, L=336, P=16, S=8):
$$
N = \lfloor (336 - 16)/8 \rfloor + 2 = \lfloor 40 \rfloor + 2 = 42
$$

**PatchTST/64** (L=512, P=16, S=8):
$$
N = \lfloor (512 - 16)/8 \rfloor + 2 = \lfloor 62 \rfloor + 2 = 64
$$

→ 이름의 유래! "**/42**" 와 "**/64**" 는 patch 수.

---

## Padding 처리

paper p.3:
> Here, we pad $S$ repeated numbers of the last value $x_L^{(i)} \in \mathbb{R}$ to the end of the original sequence before patching.

- 마지막 timestep $x_L$ 의 값을 stride $S$ 번 반복해서 끝에 추가
- L=336 → padding 후 길이 $L + S = 344$
- $N = (L+S-P)/S + 1 = (336+8-16)/8 + 1 = 42$

→ Pad 가 없으면 마지막 부분이 truncate 됨. Pad 로 마지막 P 시점도 포함.

---

## Overlapped vs Non-overlapped

| $P$ vs $S$ 관계 | 의미 |
|---|---|
| $S < P$ | **Overlapped** — 인접 patch 가 $P-S$ timestep 겹침 (Supervised default: P=16, S=8) |
| $S = P$ | **Non-overlapped** — 인접 patch 가 정확히 인접 (Self-supervised default) |
| $S > P$ | gap — 사용 안 됨 |

paper p.5 (Section 3.2):
> As opposed to supervised model where patches can be overlapped, we divide each input sequence into regular non-overlapping patches. It is for convenience to ensure observed patches do not contain information of the masked ones.

→ **Supervised**: P=16, S=8 (50% overlap)
→ **Self-supervised**: P=12, S=12 (non-overlap, masked patch 가 다른 patch 와 정보 공유 방지)

---

## Complexity 분석 — 왜 22× 빠른가

paper p.3:
> With the use of patches, the number of input tokens can reduce from $L$ to approximately $L/S$. This implies the memory usage and computational complexity of the attention map are quadratically decreased by a factor of $S$.

**No patching** (token = raw timestep):
- Token 수 = $L = 336$
- Attention complexity = $O(L^2) = O(336^2) = O(112,896)$

**With patching** (P=16, S=8):
- Token 수 = $N = 42$
- Attention complexity = $O(N^2) = O(42^2) = O(1,764)$
- 비율: $112896 / 1764 = 64×$ 이론적 감소

paper Table 1 의 실제 측정:
| Dataset | with patch (s) | without patch (s) | gain |
|---------|----------------|-------------------|------|
| Traffic | 464 | 10040 | **22×** |
| Electricity | 300 | 5730 | **19×** |
| Weather | 156 | 680 | **4×** |

→ 이론은 $S^2 = 64×$, 실제 4-22× — 다른 overhead (forward, IO) 가 있어서 dataset 마다 다름.

---

## 왜 patching 이 효과적인가 — 3 이유

paper Section 1:
> 1. Reduction on time and space complexity ... reducing the complexity quadratically.
> 2. Capability of learning from longer look-back window: Table 1 shows that by increasing look-back window L from 96 to 336, MSE can be reduced from 0.518 to 0.397. ... Patching is a good answer to it.
> 3. Capability of representation learning

| 이유 | 설명 |
|------|------|
| **(1) Complexity** | $N$ 을 줄여서 attention 의 $N^2$ 부담 완화 |
| **(2) Longer window** | 같은 compute 로 더 긴 $L$ 가능 → MSE ↓ |
| **(3) Representation** | Subseries 가 semantic unit — local pattern 보존 |

→ **(3) 가 가장 중요**. 한 patch 안의 P=16 timestep 이 한 token 으로 압축되면서 local temporal pattern (trend, periodicity) 보존.

---

## 인터랙티브 시각화

```viz:pat-patching:title=Patching 메커니즘 — L → P×N 토큰화 (interactive),caption=시계열 길이 L 입력을 patch 길이 P stride S 로 자르는 슬라이딩 윈도우. 토글로 (P=16 S=8 overlapping vs P=12 S=12 non-overlapping) 비교. 점선 박스가 한 patch = 한 token. PatchTST/42 의 N=42 토큰 생성 과정 시각화.
```

---

## Linear projection — Patch → Token embedding

paper p.4:
> The patches are mapped to the Transformer latent space of dimension $D$ via a trainable linear projection $W_p \in \mathbb{R}^{D \times P}$, and a learnable additive position encoding $W_{pos} \in \mathbb{R}^{D \times N}$ is applied to monitor the temporal order of patches: $x_d^{(i)} = W_p x_p^{(i)} + W_{pos}$, where $x_d^{(i)} \in \mathbb{R}^{D \times N}$ denote the input that will be fed into Transformer encoder in Figure 1.

**한 patch 의 변환**:
$$
x_d^{(i)} = W_p \cdot x_p^{(i)} + W_{pos}
$$

- $x_p^{(i)} \in \mathbb{R}^{P \times N}$: patched 시계열 (P timestep × N patch)
- $W_p \in \mathbb{R}^{D \times P}$: linear projection (한 patch 의 P timestep → D 차원 embedding)
- $W_{pos} \in \mathbb{R}^{D \times N}$: learnable position embedding (각 patch 위치)
- $x_d^{(i)} \in \mathbb{R}^{D \times N}$: Transformer input

→ ViT 와 정확히 같은 형태. 한 patch 가 한 token 으로.

---

## Patch length / stride 의 선택 — Fig 4 ablation

paper Figure 4 (p.15):
> MSE scores with varying patch lengths $P = [2, 4, 8, 12, 16, 24, 32, 40]$ where the lookback window is 336 and the prediction length is 96.

paper p.27 결론:
> One observation from Figure 4 is that MSE scores don't vary significantly with different patch length.

→ **P=16 의 선택은 robust**. P=4 부터 P=40 까지 거의 비슷한 성능 — patching 의 효과가 P 의 정확한 값에 민감하지 않음.

다음 [05_channel_independence.md](05_channel_independence.md) 에서 channel-independence 의 메커니즘.
