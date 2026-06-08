# 05 · 방법론 (b) — 5 종 PE 수식 정리

본 절은 비교에 사용된 5 종 명시 PE 의 수식 형태를 정리한다. 각 PE 의 attention score 에 어떤 식으로 위치 신호가 결합되는지를 같은 표기 아래 모은다.

## 표기 약속

전 절 공통:
- $i, j \in \{0, 1, \dots, L-1\}$ : query/key 토큰의 위치
- $x_i \in \mathbb{R}^d$ : 토큰 $i$ 의 임베딩
- $q_i = W_Q x_i \in \mathbb{R}^{d_k}$, $k_j = W_K x_j$ : query, key
- $A_{ij}$ : softmax 이전 attention score (logit)
- $d_k$ : per-head 차원
- $H$ : head 수, $h \in \{0, \dots, H-1\}$ : head 인덱스
- $\mathrm{mask}_{ij} = -\infty$ if $j > i$ (causal mask)

표준 self-attention:
$$A_{ij} = \frac{q_i^\top k_j}{\sqrt{d_k}} + \mathrm{mask}_{ij}$$

각 PE 는 이 식에 위치 정보를 어떻게 끼워넣는지가 다르다.

---

## PE 1 — APE Sinusoidal (`pe_abs_sin`)

### 수식
$$\tilde x_i = x_i + \mathrm{PE}(i), \quad A_{ij} = \frac{(W_Q \tilde x_i)^\top (W_K \tilde x_j)}{\sqrt{d_k}}$$

PE 벡터:
$$\mathrm{PE}(i, 2k) = \sin(i / 10000^{2k/d}), \quad \mathrm{PE}(i, 2k+1) = \cos(i / 10000^{2k/d})$$

### 4 줄 해석
- **기호 뜻**: $\mathrm{PE}(i) \in \mathbb{R}^d$ 는 위치 $i$ 에 의존하는 고정 벡터. 각 차원 쌍 $(2k, 2k+1)$ 이 주파수 $1/10000^{2k/d}$ 의 sin·cos.
- **일상 비유**: 위치 $i$ 를 다양한 주파수의 시계로 동시에 읽는 것. 빠른 시계는 옆 토큰과 다르고, 느린 시계는 먼 토큰까지 같다.
- **왜 이 형태**: 학습 길이 너머에도 $\sin / \cos$ 값은 정의되므로 "이론적으로" 외삽 가능. 또 $\sin(a+b) = \sin a \cos b + \cos a \sin b$ 로 상대 위치 표현 가능.
- **조심할 점**: 실제 외삽은 망가짐 — attention head 가 학습된 $i$ 범위의 PE 패턴에만 specialized 됨. 또 PE 가 토큰 임베딩과 같은 공간에 더해져 임베딩의 의미를 부분적으로 변형.

### 이 코드에서 (verbatim)
`configs/models/pe_abs_sin.jsonnet`:
```jsonnet
{ model+: { position_encoding_type: 'abs_sinusoid' } }
```

---

## PE 2 — APE Learned (`pe_abs_lrnd`)

### 수식
$$\tilde x_i = x_i + e_i, \quad e_i \in \mathbb{R}^d \text{ (learnable)}, \quad A_{ij} = \frac{(W_Q \tilde x_i)^\top (W_K \tilde x_j)}{\sqrt{d_k}}$$

### 4 줄 해석
- **기호 뜻**: 각 위치마다 별도의 학습 가능한 벡터 $e_0, e_1, \dots, e_{L_{\max}-1}$.
- **일상 비유**: 좌석 번호마다 고유한 이름표를 임의로 학습. "1 번 좌석" 의 이름표가 "100 번 좌석" 의 이름표와 어떤 관계인지는 학습 데이터에 의해서만 결정.
- **왜 이 형태**: sinusoidal 의 임의 함수 형태 제약을 푸는 ($e_i$ 가 임의 학습) 더 표현력 강한 형태. BERT/GPT-2 가 채택.
- **조심할 점**: **외삽 본질적으로 불가능**. $L_{\max}$ 너머의 $e_i$ 는 학습된 적 없어 0 이거나 undefined. 길이 일반화 baseline 으로는 가장 약한 형태.

---

## PE 3 — T5 Relative Bias (`pe_t5`)

### 수식
$$A_{ij} = \frac{q_i^\top k_j}{\sqrt{d_k}} + b_{\text{bucket}(i-j)}^{(h)} + \mathrm{mask}_{ij}$$

버킷 함수 $\text{bucket}(d)$ — Raffel 2020 의 표준 정의:
- 절대값 $|d|$ 가 작으면 (예: 0~7) 그대로 1:1 버킷
- 크면 로그 스케일로 32 개 버킷에 매핑
- 거리가 매우 크면 마지막 버킷에 clip

각 head 마다 32 개 학습 가능한 bias 값 $b_0^{(h)}, \dots, b_{31}^{(h)}$.

### 4 줄 해석
- **기호 뜻**: $b_{\text{bucket}(i-j)}^{(h)}$ 는 head $h$ 의 학습 가능한 bias. 거리 의존, 절대 위치 무의존.
- **일상 비유**: "옆 칸 가족", "같은 줄 가족", "옆 줄 가족", "먼 줄 가족" 같은 거리 카테고리별 가산 점수.
- **왜 이 형태**: 버킷화로 파라미터를 32 개 head 별로만 두면서 모든 거리를 cover. 학습 외 거리는 가장 가까운 큰 버킷에 떨어지므로 외삽 시 graceful — 정확히 NoPE 와 닮은 inductive bias 가 emerge 하는 이유의 1 차 후보.
- **조심할 점**: 버킷이 거칠어서 fine-grained 거리 변화에 둔감. 학습 외 거리는 학습되지 않은 버킷에 떨어질 수 있어 그 영역의 attention 이 "익숙하지 않은 boundary effect" 를 가질 수 있다.

### 이 코드에서 (verbatim)
`configs/models/pe_t5.jsonnet`:
```jsonnet
{ model+: { position_encoding_type: 't5_relative_bias' } }
```

---

## PE 4 — ALiBi (`pe_alibi`)

### 수식
$$A_{ij} = \frac{q_i^\top k_j}{\sqrt{d_k}} - m_h \cdot (i - j) + \mathrm{mask}_{ij}$$

(causal decoder 에서 $i \geq j$ 이므로 $|i-j| = i - j$.)

각 head 의 기울기 $m_h$ 는 학습되지 않고 고정. Press et al. 2022 의 표준 schedule:
$$m_h = 2^{-8(h+1)/H}, \quad h = 0, 1, \dots, H-1$$

또는 기하 비율 $r = 2^{-8/H}$ 로 $m_h = r \cdot r^h$.

### 4 줄 해석
- **기호 뜻**: $m_h > 0$ 는 head $h$ 의 "거리 페널티 기울기". 각 head 가 서로 다른 receptive field 길이 스케일을 가짐.
- **일상 비유**: 어떤 head 는 "매우 가까운 토큰만 본다" (큰 $m_h$), 다른 head 는 "멀리까지 본다" (작은 $m_h$). 라디오 채널들이 서로 다른 주파수 대역을 듣는 것.
- **왜 이 형태**: 선형 페널티는 거리에 의한 monotone decay 라는 명확한 inductive bias. 학습 외 거리 $|i-j|$ 에도 값이 정의 (단순 곱셈) 되므로 외삽 가능.
- **조심할 점**: $m_h$ 가 고정이라 모델이 "가까운 head, 먼 head" 의 비율을 조정할 수 없다. 또 모든 head 가 "거리 단조 감소" 라는 같은 함수 모양 — head 가 더 복잡한 거리 의존을 학습할 자유가 없음. 본 논문이 ALiBi 를 "not well suited" 라고 한 한 이유의 후보.

### 이 코드에서 (verbatim)
`configs/models/pe_alibi.jsonnet`:
```jsonnet
{ model+: { position_encoding_type: 'alibi' } }
```

추가 변형 `pe_alibi_lrnd` (`alibi_learned`) 는 $m_h$ 를 학습 가능하게 한 ablation 변형.

---

## PE 5 — Rotary (RoPE, `pe_rotary`)

### 수식
2D 회전 행렬:
$$R(\theta) = \begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix}$$

$q_i, k_j \in \mathbb{R}^{d_k}$ 를 $d_k / 2$ 개의 2D 쌍으로 보고, 각 쌍 $k$ 마다 주파수 $\omega_k = 10000^{-2k/d_k}$, 회전 각 $\theta_{i,k} = i \omega_k$ 적용:
$$\tilde q_i^{(k)} = R(\theta_{i,k}) q_i^{(k)}, \quad \tilde k_j^{(k)} = R(\theta_{j,k}) k_j^{(k)}$$

그러면 dot product:
$$\tilde q_i^\top \tilde k_j = \sum_{k} q_i^{(k) \top} R(\theta_{j,k} - \theta_{i,k}) k_j^{(k)} = \sum_k q_i^{(k) \top} R((j-i)\omega_k) k_j^{(k)}$$

→ **$i, j$ 가 아닌 $j - i$ 에만 의존**.

$$A_{ij} = \frac{\tilde q_i^\top \tilde k_j}{\sqrt{d_k}} + \mathrm{mask}_{ij}$$

### 4 줄 해석
- **기호 뜻**: 위치 $i$ 에 따라 query/key 벡터의 각 2D 쌍을 다른 주파수로 회전. 회전 각 $\theta_{i,k}$ 이 주파수 $\omega_k$ 와 위치 $i$ 의 곱.
- **일상 비유**: 시계 침을 query/key 벡터로 보고, 위치 $i$ 마다 시계가 한 칸씩 회전. 같은 시계 (같은 주파수 채널) 의 두 위치는 각도 차이만큼만 보이게 됨.
- **왜 이 형태**: 회전은 norm 을 보존하므로 attention score 의 크기 분포가 위치에 따라 흔들리지 않음. 그리고 곱셈식으로 상대 위치 의존 — 절대 위치는 사라지고 거리만 남음.
- **조심할 점**: 학습 길이 너머에서 $i\omega_k$ 가 학습 중 본 적 없는 각도가 됨. 회전이 한 바퀴 돌아 학습 길이 너머에서도 "닮은 각도" 가 나올 수 있으나 (저주파수 채널) 고주파수 채널은 외삽 시 위상이 어긋남. NTK / YaRN / position interpolation 류 후속 보정의 이유.

### 이 코드에서 (verbatim)
`configs/models/pe_rotary.jsonnet`:
```jsonnet
{ model+: { position_encoding_type: 'rotary' } }
```

추가 변형 `pe_newRot` (`new_rotary`), `pe_rotary_rerun` 가 있어 Rotary 의 미세한 변형 / 재실행이 ablation 됨.

---

## PE 6 — NoPE (`pe_none`)

### 수식
$$A_{ij} = \frac{q_i^\top k_j}{\sqrt{d_k}} + \mathrm{mask}_{ij}$$

PE 도, bias 도, 회전도, embedding 도 **없음**. 토큰 임베딩이 그대로 들어가고 causal mask 만 적용.

### 4 줄 해석
- **기호 뜻**: $q_i, k_j$ 는 토큰 임베딩 $x_i, x_j$ 의 선형 변환. 위치 정보는 (causal mask 의 비대칭 + 첫 토큰 BOS 의 anchoring) 으로 implicit 하게 emerge.
- **일상 비유**: 시간 표시 없이 사진들을 줄에 걸어둔 상태에서, "왼쪽 끝에서 몇 번째인가" 를 사진의 내용과 옆 사진과의 관계만으로 추론.
- **왜 이 형태**: Inductive bias 를 0 으로 만든 baseline. 본 논문 주장의 핵심.
- **조심할 점**: Causal mask 가 없으면 (encoder 모델) NoPE 는 위치 정보를 전혀 못 만든다. 따라서 본 논문의 NoPE 주장은 decoder-only causal 모델에 한정 — 본 논문이 강조하는 핵심 조건.

### 이 코드에서 (verbatim)
`configs/models/pe_none.jsonnet`:
```jsonnet
{ model+: { position_encoding_type: 'none' } }
```

---

## 표 — 6 종 PE 의 inductive bias 비교

| PE | 어디에 더해지나 | 절대/상대 | 학습? | 외삽 메커니즘 |
|---|---|---|---|---|
| APE sinusoidal | embedding | 절대 | × (고정) | 함수 정의역 무한 (이론적) |
| APE learned | embedding | 절대 | ○ | × (학습 외 위치 미정의) |
| T5-rel | attention bias (additive) | 상대 (버킷) | ○ (bias) | 가장 가까운 큰 버킷 clip |
| ALiBi | attention bias (additive) | 상대 (선형) | × (m 고정) | 선형 함수 정의역 무한 |
| Rotary | q/k vector (rotation) | 상대 (위상) | × (각도 고정) | 회전 함수 정의역 무한 (위상 불일치 위험) |
| **NoPE** | 없음 | implicit | × | causal mask + BOS anchor |

## 다른 접근으로 했다면 어떻게 달랐을까

- **만약 7번째 PE 로 "Adaptive learned ALiBi" 를 추가했다면** ($m_h$ 도 학습, FIRE 와 비슷) — 학습 길이 내에서 더 좋아질 수 있으나 외삽에서는 미정의된 $m_h$ 가 없어 비슷하게 graceful 했을 것. 본 논문은 이 변형을 `pe_alibi_lrnd` 로 ablation 함.
- **만약 attention bias 형태가 비선형 (예: exponential decay)** 이었다면 — 가까운 토큰만 거의 보고 먼 토큰을 무시. ALiBi 의 단조 감소를 강화. 본 논문 framework 내에서 추가 baseline 가능.
- **만약 PE 를 절대 + 상대 결합** 으로 했다면 (예: sinusoidal + T5-rel 동시) — 두 inductive bias 의 합집합이 표현력은 늘리나 외삽 시 두 약점이 모두 누적될 가능성. 본 논문이 굳이 single PE 만 본 것은 protocol 의 깔끔함을 위해서로 추정 (본문 미확보).

## 핵심 한 문장 요약
"5 종 명시 PE 는 위치 정보를 (1) embedding 에 더하거나 (APE), (2) attention bias 로 더하거나 (T5, ALiBi), (3) q/k 를 회전시키거나 (Rotary) 의 셋 중 하나로 주입한다. NoPE 는 어느 것도 안 하고, causal mask 의 비대칭과 BOS 의 anchoring 에만 의존한다."
