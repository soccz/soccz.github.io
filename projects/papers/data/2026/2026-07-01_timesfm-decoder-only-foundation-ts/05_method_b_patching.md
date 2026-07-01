# 05.b 방법론: 입력 패칭 & Residual Block

## 왜 이 부분이 필요한가

Transformer 의 self-attention 은 $N$ 개의 토큰에 대해 $O(N^2)$ 비용이다. 만약 시계열의 **한 시간점 = 한 토큰** 이면, context 길이 $T = 2048$ 일 때 $O(2048^2) \approx 4 \times 10^6$. 이 값이 $L=20$ 층에 걸쳐 forward · backward 로 반복되면 학습이 곧 죽는다. 게다가 한 시간점은 정보량이 극히 작다 — 시계열의 "의미 단위" 는 대체로 여러 시간점의 조합 (한 주기, 한 주말, 한 이벤트) 이다. 그래서 입력을 **여러 시간점을 묶은 패치** 로 잘라 토큰 취급하는 게 필수. TimesFM 은 $p = 32$ 를 선택 — v1 README verbatim.

## 수식

원 시계열 $x = (x_1, x_2, \dots, x_T)$ 를 겹치지 않는 patch 로 자른다:

$$
P_i = (x_{(i-1)p + 1}, \, x_{(i-1)p + 2}, \, \dots, \, x_{ip}) \in \mathbb{R}^p, \quad i = 1, 2, \dots, N = T / p.
$$

각 patch 를 **residual block** (한 층 짜리 MLP + skip connection) 으로 임베딩한다:

$$
z_i = \text{ResidualBlock}(P_i) = W_2 \cdot \phi(W_1 P_i + b_1) + b_2 + W_r P_i \; \in \mathbb{R}^{d_{\text{model}}}.
$$

여기서 $W_1 \in \mathbb{R}^{d_{\text{hidden}} \times p}$, $W_2 \in \mathbb{R}^{d_{\text{model}} \times d_{\text{hidden}}}$, $W_r \in \mathbb{R}^{d_{\text{model}} \times p}$ (skip 경로의 선형 projection), $\phi$ 는 비선형 (GELU/ReLU — 원문 자세한 활성함수는 원 PDF 접근 시 확인해야 함, 저자 README 는 명시 안 함).

### 4줄 해석

1. **기호 뜻**:
   - $p = 32$: 한 patch 안의 시간점 수 (단위: 관측 시각 개수).
   - $N = T / p$: 총 패치 개수 (단위: 개). $T=512$ 면 $N=16$.
   - $z_i \in \mathbb{R}^{d_{\text{model}}}$: 각 patch 의 임베딩 벡터. $d_{\text{model}} = 1280$ (v1 200M 모델).
   - $\phi$: 비선형 activation. GELU 계열로 추정 (원문 확인 필요).
2. **일상 비유**: 옛날 필사본을 옮겨 적을 때 한 글자씩이 아니라 **한 어절씩** 옮기는 것 — 어절이 정보의 자연스러운 단위이고, 필사 시간과 오탈자가 모두 줄어든다.
3. **왜 이 형태**: 단순 선형 embedding (예: $z_i = W P_i$) 만으로도 되지만, residual block 을 쓰면 (a) MLP nonlinearity 로 patch 내 시간 상관 (예: 상승 · 하강 · 주기) 을 vector 방향에 encoding 할 수 있고, (b) skip connection 이 initialization 시점에 identity 근처로 만들어 학습 초기 신호를 안정화. 언어 모델의 token embedding lookup 과 다른 이유는 시계열 patch 가 **연속값 벡터** 이지 discrete id 가 아니기 때문 — lookup 이 불가능하다.
4. **조심할 점**:
   - $p$ 를 너무 크게 하면 (예: $p=128$) 짧은 context 시계열이 patch 몇 개 안 나옴 → Transformer 가 볼 게 없어짐. TimesFM 은 $p=32$ 로 short-context 시계열 (예: 월간 60 관측) 도 patch 로 자르면 $N \approx 2$ 정도 되게 안전선을 잡음.
   - $p$ 가 dominant seasonality 와 정합돼야 patch 안의 정보가 잘 뭉친다. 일간 시계열의 주 7일 주기와 $p=32$ 는 정합적이지 않음 (7 × 4 = 28, 32 ≠ 28) → 이 misalignment 가 실전에서 어떻게 흡수되는지 논문은 명시적으로 답 안 함.
   - Residual block 초기화 스케일이 얼마인지 원문에 명시 안 됐음 (본 환경 미확인) → 재현자가 다른 init 으로 실험하면 성능이 흔들릴 수 있음.

## 왜 다른 값이 아닌 $p=32$

원문은 이 값을 empirical 선택으로 보고. 저자 README v1 verbatim: "The `context_len` in `hparams` here can be set as the max context length of the model … **It needs to be a multiplier of `input_patch_len`, i.e. a multiplier of 32.**" 즉 32 는 context length 를 나누는 정수 조건에도 편리.

다른 값 세 개 비교:
- **$p = 16$**: PatchTST 가 이 값을 자주 씀 (Nie 2023). $N$ 이 2배 → attention 비용 4배. TimesFM 은 큰 pretraining scale 에서는 $p=32$ 가 더 나았다고 §5 ablation 에서 실증 (원 PDF 표 절대 수치 미확인).
- **$p = 64$**: 두 배 뭉침. patch 안 정보량 늘지만 patch 수 절반 → attention 이 볼 게 절반. long-horizon 에서 patch resolution 이 부족해질 위험.
- **Adaptive $p$**: FFT dominant period 에 맞춰 자동 조절 (TimesNet 방향). 학습이 훨씬 복잡. TimesFM 은 안 택함.

## Positional & frequency conditioning

$z_i$ 에 **positional encoding** (원문 §3 확인 필요, v1 README 는 "use_positional_embedding=False" 옵션을 노출 → v2.0 에서는 positional embedding 을 안 쓰는 방향으로 이동) 이 더해진다. v1 논문 시점에는 sinusoidal 또는 learned 를 썼다고 알려져 있음 (secondary 문헌 기준). Positional embedding 이 없어도 causal mask 만으로 순서 정보가 유지된다 — 이는 Kazemnejad et al. NeurIPS 2023 (arXiv:2305.19466) 이 language 에서 실증한 NoPE 결과와 정합.

또한 categorical **frequency indicator** $f \in \{0, 1, 2\}$ 를 임베딩해서 각 $z_i$ (혹은 첫 토큰) 에 더한다. 자세한 배치 위치는 원문 §3 확인 필요. 저자 README verbatim: "For dataframe inputs, we convert the conventional letter coding of frequencies to our expected categories, that 0: T, MIN, H, D, B, U; 1: W, M; 2: Q, Y."

## 이 부분의 핵심 한 문장

**"길이 32 짜리 patch 를 MLP+skip 으로 임베딩해서 Transformer 의 토큰 자리에 놓는다 — 이 한 줄 조작이 시계열을 '언어처럼' 다룰 수 있게 만드는 첫 관문."**
