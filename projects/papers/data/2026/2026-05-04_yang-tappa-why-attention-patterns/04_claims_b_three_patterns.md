# 04. 핵심 Claim 해체 — Part B (re-access / sink / slash 통합)

---

## Claim 2 — Re-access (retrieval) pattern: 두 재료의 조합

### 주장

**먼 과거의 특정 token 으로 attention 이 안정적으로 되돌아가는 "re-access" (= retrieval head 의 패턴) 는 (i) 연속 query 의 높은 자기유사도 + (ii) RoPE 의 저주파 채널이 query-key 정렬을 시간이 지나도 보존한다는 두 조건이 동시에 만족될 때 발생한다.**

### 증거

저자 본문 추정 정리 + 검색 스니펫 직접 인용: *"The stability of reaccess pattern relies on two factors: (1) high self-similarity of consecutive queries, which prevents attention scores from drifting, and (2) the low-frequency components of RoPE, which preserve alignment between queries and fixed keys even as time progresses."* 시각적 증거는 layer × head 분해 후 attention map 을 (i) low-freq RoPE 채널만 keep / (ii) high-freq 만 keep 의 ablation 으로 비교한 그림에 있을 것 (스니펫 미확보).

### 숨은 전제

- **Key 는 고정 / Query 만 시간 진화** — KV cache 맥락에서는 자연스러우나, 학습 중 token 갱신을 보면 key 도 변함. 본 분석은 inference time 의 정적 key 가정.
- **RoPE 의 채널별 frequency 가 head 단위로 균일하지 않다** — 이건 사실. RoPE 는 dimension index $i$ 에 따라 회전 각속도 $\theta_i = 10000^{-2i/d}$ 가 결정되어 자연스럽게 multi-band. 이 사실 자체가 "low-freq vs high-freq" 분해의 정당화.
- **Re-access 의 "안정성" 을 attention score 의 시간적 분산으로 정의** — 만약 task-level retrieval accuracy 로 정의한다면 결과가 다를 수 있음.

### 쉬운 말 풀이

retrieval head (필요할 때 책의 특정 페이지를 찾아가는 머리) 가 안정적으로 작동하려면 두 가지가 동시에 되어야 한다. 첫째, **묻는 사람의 마음이 흔들리지 않아야** (query 가 시간이 지나도 비슷해야) 한다. 둘째, **위치 표시 시스템이 멀리 떨어진 페이지의 표지를 또렷이 유지** (RoPE 저주파가 멀리서도 정렬 보존) 해야 한다. 둘 중 하나만 약해도 retrieval 은 흔들린다.

### 비판 지점

이 두 조건이 **충분 (sufficient)** 인지 **필요 (necessary)** 인지 이론적 명세가 중요. 충분조건이라면 "그 외 다른 메커니즘으로도 retrieval 이 일어날 수 있는가" 가 열려 있고 (예: NoPE 의 retrieval — Kazemnejad 2023), 필요조건이라면 NoPE retrieval 이 발생하지 않는다는 강한 예측. 후자라면 NoPE LLM 에 대한 반증 실험이 결정적. 본문이 어느 쪽으로 가는지가 reviewer 가 가장 먼저 물을 점.

---

## Claim 3 — Sink pattern: 첫 토큰 + 저주파의 합작

### 주장

**Attention sink (첫 토큰에 비정상적으로 큰 attention 이 집중되는 현상) 는 query continuity 또는 첫 key 와 모든 query 사이의 작은 각도, 그리고 RoPE 저주파의 회전 정렬이 결합된 결과로 통합 설명된다.**

### 증거

검색 스니펫 발췌: *"prior work has attributed the attention sink phenomenon to query continuity or to the small angle between the first key and all queries, while others observed its correlation with low-frequency RoPE rotations. However, TAPPA provides a unified account of why they align under the same mechanism."* 즉 저자는 기존 sink 설명들 (Xiao 2023 의 softmax-degenerate, Sun 2024 의 query-key angle, Lin 2024 의 RoPE rotation) 이 **분리된 설명이 아니라 같은 매커니즘의 다른 측면** 임을 논증한다고 함.

### 숨은 전제

- **첫 토큰의 key $k_1$ 이 학습 중 일종의 "anchor" 로 수렴** — 이 사실 자체가 다른 논문의 결과 (Xiao 2023). TAPPA 는 이를 가정으로 차용.
- **RoPE 저주파 회전각이 작아 $k_1$ 과 모든 query 의 dot product 가 RoPE 회전 후에도 가까이 보존** — 수학적으로는 $R_{\theta(t-1)} k_1$ 가 $t$ 에 무딘 변화. 이 부드러움이 sink 의 안정성 근거.

### 쉬운 말 풀이

"첫 단어가 항상 잡음 흡수기로 쓰인다" 는 현상의 세 가지 다른 설명 (sotmax 가 모든 분모를 0 이 아니게 하려 함 / 첫 토큰의 방향이 query 들과 비슷해서 / 위치 회전이 천천히 돌아서 첫 토큰을 멀리서도 보존) 을 저자들은 "사실 같은 한 줄 메커니즘 — 저주파 RoPE 의 정렬보존" 의 변주로 본다.

### 비판 지점

3개 설명을 묶어내려면 정량적으로 어느 설명이 핵심 변수인지 분리하는 ablation 이 필요. 예: RoPE 를 없앤 NoPE 모델에서도 sink 가 나타나는지 (실제로 나타난다 — Xiao 2023 NoPE 결과), 그렇다면 RoPE 저주파가 **충분조건이 아니라 강화조건** 임이 드러남. 본문이 이 NoPE-sink 사실을 어떻게 처리하는가가 통합 framing 의 robustness 시험.

---

## Claim 4 — Slash/diagonal pattern: Theorem 5.2 의 수학적 결론

### 주장

**Sequential (slash-like, near-diagonal) attention pattern 은 query 와 key 모두 self-similarity 가 높을 때 RoPE 의 회전 구조가 simultaneous shift $(t,n) \to (t+1, n+1)$ 하에서 attention score 를 보존 (translation-equivariant) 하기 때문에 (+1, +1) 대각선으로 propagate 한다.**

### 증거

직접 인용 (Theorem 5.2): *"under the RoPE relative-position encoding, when queries and keys both exhibit high self-similarity, the rotation structure preserves their interactions under a simultaneous shift, and as a result, attention scores propagate along the (+1, +1) diagonal, producing sequential (slash-like) patterns."* 

수학적으로 RoPE 의 score 는 $\langle q_t, k_n \rangle_\mathrm{RoPE} = q_t^\top R_{\theta(n-t)} k_n$ 형태인데, $q_{t+1} \approx q_t$ 이고 $k_{n+1} \approx k_n$ 이면 $q_{t+1}^\top R_{\theta((n+1)-(t+1))} k_{n+1} \approx q_t^\top R_{\theta(n-t)} k_n$ 이므로 score 가 대각선 $\{(t,n) : n-t = \mathrm{const}\}$ 위에서 거의 일정. 그러나 *"Q-similarity alone is sufficient to encourage local, near-diagonal attention, but it does not guarantee the smooth, globally shift-invariant diagonal pattern observed in the full model"* — q-similarity 는 국소 대각선만 만들고, 전역적 shift-invariance 까지 가려면 RoPE 와의 결합이 필수. 이 한 줄이 Theorem 5.2 의 정수.

### 숨은 전제

- **Self-similarity 가 두 step 사이의 cosine 으로 환원 가능** — 더 긴 lag 의 의존성은 무시.
- **RoPE 의 회전 구조 자체가 perturbation 없이 정확히 평행이동 등변성 (translation equivariance)** — 학습 후 weight 가 이 구조를 깨지 않는다는 가정. 실제 LLM 에선 weight 가 RoPE 의 구조를 부분적으로 깰 수 있음 (Han 2024 RoPE-extended Yarn 등 변형).

### 쉬운 말 풀이

"앞에서 본 단어를 그대로 다음 자리에 옮겨놓는 것" 같은 패턴 (slash) 이 생기는 이유는 두 가지 부드러움이 만나기 때문이다. (i) 묻는 사람이 한 칸 옮겨가도 거의 같은 것을 묻고, (ii) 위치 회전 시스템이 (한 칸, 한 칸) 동시 이동에 대해 결과가 안 바뀌는 성질 (translation equivariance) 을 가지면, 결과적으로 (대각선 위) 의 모든 점에서 같은 값이 나온다 — 이것이 대각선 줄무늬의 정체.

### 비판 지점

Theorem 5.2 가 **"high self-similarity"** 의 임계값을 명시하는지가 핵심. "high" 가 정성적 개념이면 정리는 직관적 진술에 가깝고, 정량적 bound (예: $S(\Delta t) \ge 1 - \epsilon$ 면 attention score deviation $\le f(\epsilon)$) 가 있으면 쓸모 있음. 후자라면 본 논문 가치가 크게 올라가고, 실제로 KV cache budget $\propto 1/S_l$ 같은 실용 metric 이 이론에서 도출 가능. 본문 검토 핵심.
