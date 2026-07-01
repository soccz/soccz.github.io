# 05.c 방법론: Decoder-only Transformer 코어

## 왜 이 부분이 필요한가

패치가 토큰 자리에 놓였으니, 이제 이 토큰들이 "서로 얼마나 관련 있는지" 를 계산하고 각 토큰을 그 관계로 다시 섞어야 한다. Transformer 의 self-attention 이 이 역할. 그리고 시계열 예측은 "과거 → 미래" 인과성을 지켜야 하므로 attention 은 **causal (미래 마스킹)** 이어야 한다. GPT 계열이 이 골격을 언어에서 검증. TimesFM 은 이걸 그대로 이식한다.

## 수식

각 층 $\ell = 1, \dots, L$ 에서:

$$
\tilde{z}^{(\ell)}_i = z^{(\ell-1)}_i + \text{CausalMHSA}\bigl(z^{(\ell-1)}_1, \dots, z^{(\ell-1)}_i\bigr),
$$
$$
z^{(\ell)}_i = \tilde{z}^{(\ell)}_i + \text{FFN}\bigl(\tilde{z}^{(\ell)}_i\bigr),
$$

여기서:
- **CausalMHSA (Multi-Head Self-Attention)**: 
  $$
  \text{Att}(Q, K, V) = \text{softmax}\left( \frac{Q K^\top}{\sqrt{d_k}} + M \right) V,
  $$
  $M_{ij} = 0$ if $i \geq j$ else $-\infty$ (causal mask), 16 heads, head dim $d_k = d_{\text{model}} / 16 = 80$.
- **FFN (FeedForward Network)**: 
  $$
  \text{FFN}(x) = W_2 \phi(W_1 x + b_1) + b_2,
  $$
  hidden dim 은 v1 secondary 문헌에 따르면 model dim 과 동일 ($d_{\text{model}} = 1280$). LayerNorm 위치 (Pre-LN vs Post-LN) 는 원 PDF 확인 필요 — 저자 README 는 명시 안 함, secondary 문헌은 대체로 Pre-LN 을 가정 (GPT-2 유산).

논문 스펙 (v1 200M, README verbatim + secondary 인용):
- $L = 20$ layers
- $d_{\text{model}} = 1280$
- $h = 16$ attention heads
- $d_k = d_{\text{model}} / h = 80$
- 총 파라미터 ≈ 200M

v2.0 500M (v1 README verbatim):
- $L = 50$ layers
- $d_{\text{model}} = 1280$ (동일)
- context_len = 2048 (4배 확장)

### 4줄 해석

1. **기호 뜻**:
   - $Q, K, V$: query · key · value 행렬. 각각 $z^{(\ell-1)}$ 에 서로 다른 linear projection 을 걸어 만든다.
   - $M$: causal mask. 미래 위치 참조 금지.
   - $\sqrt{d_k}$: attention score 의 분산을 head dim 에 상관없이 일정하게 유지하는 scaling.
   - $L=20$: 층 수. layer index $\ell$ 이 늘어날수록 더 추상적 시계열 특성 (예: multi-scale seasonality, regime state) 을 encoding 하는 것으로 알려짐 (SFC/mech interp 분야의 표준 가정).
2. **일상 비유**: 회사 회의실에서 여러 사람이 서로의 발언을 참고해 자기 의견을 갱신하는 것 — 단, "미래 발언" 은 못 참고 (causal), "여러 관점 (16 heads)" 으로 동시에 다르게 참고, 이걸 20번 반복.
3. **왜 이 형태**: (a) causal mask 는 시계열 인과성 필수. (b) multi-head 는 서로 다른 시간 관계 (짧은 lag / 긴 lag / seasonality / trend) 를 서로 다른 head 로 병렬 학습. (c) 20 층은 언어 GPT-2 small 과 비슷한 depth — pretraining budget 과의 균형.
4. **조심할 점**:
   - Attention $O(N^2)$ 비용. $N = T/p = 2048/32 = 64$ (v2.0) → $O(4096)$ 로 감당. 하지만 v2.5 는 context 를 16k 로 늘렸으므로 $N = 512$ → $O(2.6 \times 10^5)$ 로 커짐 — v2.5 는 sliding window 나 flash-attention 같은 최적화가 필수 (v2.5 README 확인 필요).
   - Causal mask 는 학습 시 각 위치가 자기 오른쪽 (미래) 만 예측 target 으로 삼는 next-patch prediction 을 자연스럽게 강제 → 별도의 shifted target 없이 그냥 이 아키텍처에 넣으면 학습됨. 언어 GPT 와 동형.
   - LayerNorm 위치와 initialization scale 은 재현자에게 민감한 hyperparameter. 원문 명시 여부는 본 환경 미확인.

## Positional encoding 논쟁

v1 (2023-2024) 은 positional embedding 을 사용 (secondary 문헌 기준 sinusoidal 로 추정), v2.0 (2024-12) 은 v1 README verbatim "`use_positional_embedding=False`" 를 노출 → **저자들이 pretrain 이후 positional embedding 을 안 쓰는 방향으로 이동**.

이는 Kazemnejad et al. NeurIPS 2023 (arXiv:2305.19466) 의 **NoPE 관찰** 과 정합 — decoder-only 에서는 causal mask 자체가 순서 정보를 encoding 하므로 positional embedding 없이도 (혹은 없는 편이 length generalization 관점에서 나음) 학습 가능. TimesFM 이 실전에서 이 학술적 관찰을 채택한 셈. (이 논문은 pe-attention-geometry 태그로 2026-06-08 커버.)

## 대체 골격 3개

1. **Bidirectional (BERT-style)**: causal mask 를 빼고 양방향 attention. 예측이 아니라 representation learning 에 유리. MOMENT (Goswami 2024) 가 이 방향.
2. **State-space (Mamba-style)**: attention 대신 선택적 상태공간 모델. 시계열 응용은 아직 초기 (S-Mamba, TimeMachine).
3. **Sparse attention (Longformer / ProbSparse)**: attention 을 sparse 화. Informer (Zhou 2021) 가 시계열에서 시도. TimesFM 은 안 씀 — patching 만으로도 $N$ 이 충분히 작아졌기 때문.

TimesFM 이 dense causal attention 을 유지한 것은 "언어 모델 검증된 문법을 최소 변형" 이라는 미니멀리즘 원칙과 정합.

## 이 부분의 핵심 한 문장

**"20층 × 16 head causal Transformer 라는 GPT-2 급 최소 골격으로 patch 토큰들 사이의 시간 관계를 학습한다 — positional embedding 은 없어도 causal mask 가 이미 순서를 강제한다."**
