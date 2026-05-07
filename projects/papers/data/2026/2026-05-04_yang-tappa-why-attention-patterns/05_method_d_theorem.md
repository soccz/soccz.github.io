# 05. 방법론 해부 — Part D: Theorem 5.2 의 분해

## 왜 이 부분이 필요한가

Claim 4 (slash/diagonal 의 통합 설명) 의 수학적 핵심. 이 정리가 제대로 닫혀 있어야 q-similarity 가 단순 측정이 아니라 **이론적으로 정당화된 인과 변수** 가 된다. 한편 정리의 "high self-similarity" 가 정성적이라면 응용에서의 metric 도 휴리스틱 수준에 머문다.

## Theorem 5.2 — 재구성 (저자 framing 으로부터)

검색 스니펫에서 직접 확보한 statement:

> *"under the RoPE relative-position encoding, when queries and keys both exhibit high self-similarity, the rotation structure preserves their interactions under a simultaneous shift, and as a result, attention scores propagate along the (+1, +1) diagonal, producing sequential (slash-like) patterns."*

수식 형태로 재구성 (필자가 standard RoPE 분석으로 채움):

**가정**:
- (A1) Query self-similarity: $\cos(q_t, q_{t+1}) \ge 1 - \epsilon_q$ for all $t$
- (A2) Key self-similarity: $\cos(k_n, k_{n+1}) \ge 1 - \epsilon_k$ for all $n$
- (A3) RoPE 표준식 적용

**결론**: 모든 $(t, n)$ 에 대해

$$\big| \langle q_{t+1}, k_{n+1} \rangle_\mathrm{RoPE} - \langle q_t, k_n \rangle_\mathrm{RoPE} \big| \le C(\epsilon_q + \epsilon_k) \cdot \|q_t\| \|k_n\|$$

여기서 $C$ 는 RoPE 회전 행렬의 norm 에 의존하는 상수 (= 1, 회전 행렬은 norm-preserving).

**해석 (4줄)**

- **기호 뜻**: $\epsilon_q, \epsilon_k$ 는 query/key 의 step-to-step 코사인 deficit. $\|q_t\|$ 는 step $t$ query 의 L2 norm. 좌변은 attention score 의 simultaneous-shift 변동량.
- **일상 비유**: "지도 위에서 한 칸 이동했을 때 풍경이 거의 안 바뀐다" 는 진술. $\epsilon$ 이 작으면 (한 칸 이동의 풍경 변화 작으면) 대각선 위 모든 점에서 같은 풍경이 보인다.
- **왜 이 형태**: RoPE 의 회전이 simultaneous shift 에 대해 정확히 invariant ($R(\theta)$ 자체가 회전이라 simultaneous +1, +1 시 회전각 변화 0). 그래서 변동의 source 는 오직 query/key 의 self-similarity deficit.
- **조심할 점**: bound 가 multiplicative ($\|q\|\|k\|$ 로) 이라서 outlier-norm token (예: BOS, attention sink anchor) 에서는 작은 $\epsilon$ 도 score 변동이 큼. sink 패턴이 별도 분석을 필요로 하는 이유.

## 증명 스케치 (필자 재구성)

RoPE score 표기:
$$\langle q_t, k_n \rangle_\mathrm{RoPE} = q_t^\top R(n - t) k_n$$
($R(\cdot)$ 은 multi-band 회전 행렬, dim-별 $\theta_i$).

simultaneous shift:
$$\langle q_{t+1}, k_{n+1} \rangle_\mathrm{RoPE} = q_{t+1}^\top R((n+1) - (t+1)) k_{n+1} = q_{t+1}^\top R(n - t) k_{n+1}$$

차이:
$$\langle q_{t+1}, k_{n+1} \rangle - \langle q_t, k_n \rangle = q_{t+1}^\top R k_{n+1} - q_t^\top R k_n$$
$$= (q_{t+1} - q_t)^\top R k_{n+1} + q_t^\top R (k_{n+1} - k_n)$$

각 항에 대해 Cauchy-Schwarz + $\|R\| = 1$:
$$\le \|q_{t+1} - q_t\| \|k_{n+1}\| + \|q_t\| \|k_{n+1} - k_n\|$$

cosine deficit 정의로 $\|q_{t+1} - q_t\|^2 = \|q_{t+1}\|^2 + \|q_t\|^2 - 2\|q_{t+1}\|\|q_t\| \cos(q_{t+1}, q_t)$. unit-norm 가정 하에 $\|q_{t+1} - q_t\| \le \sqrt{2\epsilon_q}$ 정도. 따라서 결과 bound 는 $O(\sqrt{\epsilon_q + \epsilon_k})$. 본문이 정확한 constant 와 unit-norm 처리 (LayerNorm 후 query 의 norm 분포) 를 어떻게 다루는지가 디테일.

## 이 정리의 강점과 약점

### 강점

1. **First-principles**: RoPE 의 algebraic 성질 + cosine 가정으로만 도출. 데이터 의존 없음.
2. **Tight 하지 않을 수 있어도 tractable**: bound 가 sharp 하지 않더라도 monotonicity (q-similarity 높을수록 slash 강해진다) 는 보존. KV cache 응용에 충분.
3. **General**: 모델 크기·layer 별로 동일하게 적용. q-similarity 가 layer-wise score 로 직접 사용 가능한 근거.

### 약점

1. **One-step shift 만 분석**: $(t, n) \to (t+1, n+1)$ 의 한 칸. multi-step shift 의 누적 변동은 복합 bound 필요. 실제 long context 에서는 여러 칸 propagate 의 stability 가 더 중요.
2. **Self-similarity 의 origin 은 미분석**: query/key 가 왜 high self-similarity 를 가지게 되는가 (학습 과정·데이터 통계·모델 구조의 어떤 함수인가) 는 본 논문 범위 밖. 결과적으로 q-similarity 가 high 인 head 가 task 와 어떤 관계인지 (task-conditional analysis) 가 후속 연구로 남음.
3. **NoPE / ALiBi 미분석**: "RoPE under" 라는 가정이 본질적. 다른 PE 들에선 simultaneous-shift invariance 가 다르게 나타나거나 (ALiBi 는 additive bias 라 invariance 비대칭) 부재 (NoPE). 그래서 framing 의 universality 주장은 RoPE-tribe 한정.
4. **High-freq 의 contribution 처리**: bound 가 $\|R\| = 1$ 만 쓰므로 high-freq channel 의 빠른 진동이 score 에 어떻게 들어가는지는 묵시. low-freq 가 dominant 인 head 에선 bound 가 informative, high-freq dominant 에선 bound 가 vacuous 가능.

## 다른 접근으로 했다면

대안 1: **RKHS / kernel mean embedding** 으로 attention 의 stability 분석 — Tsai 2019 등의 노선. 더 일반적 (PE-agnostic) 이나 metric 추출 어려움.

대안 2: **이론 없이 경험적 phase diagram** 만 — head 별 (q-sim, RoPE freq response) 측정 후 motif label 과 회귀. 이론은 약하나 더 광범위 cover 가능.

대안 3: **Lyapunov-style stability** — attention map 의 perturbation propagation. 더 깊은 dynamical systems 관점. RNN 시대 stability 분석의 transformer 변종. 미답분야.

저자가 elementary algebraic 증명을 택한 이유는 **응용 metric 의 정당화** 에 그 정도면 충분하기 때문. 이론적 깊이보다 응용 신뢰성이 우선이라는 판단으로 보임.

## 핵심 한 문장

> **Theorem 5.2 는 RoPE 의 simultaneous-shift invariance 와 query/key self-similarity 의 결합으로 attention score 가 (+1,+1) 대각선 위에서 보존됨을 보이고, 이로써 slash pattern 이 "학습된 head 의 특수성" 이 아니라 "RoPE + 부드러운 query 의 algebraic 결과" 임을 처음으로 명시한다 — 비록 bound 가 sharp 하지 않더라도.**
