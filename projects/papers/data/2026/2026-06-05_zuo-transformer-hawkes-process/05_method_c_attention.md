# 05_method_c — 방법론 (3) 어텐션·인코더 블록

## 이 부분이 왜 필요한가

THP 의 핵심 가설은 **"사건 시퀀스의 long-range trigger 는 self-attention 으로 직접 학습 가능"** 이다(Claim 1). 그 가설을 구현하는 모듈이 마스킹된 multi-head self-attention 의 4-layer 스택. 이 절에서 **입력 임베딩 $x_1, \ldots, x_L$ → 출력 hidden $h_1, \ldots, h_L$** 의 변환을 코드 verbatim 으로 본다.

---

## 1) Scaled Dot-Product Attention

### 수식

$$\text{Attention}(Q, K, V) = \text{softmax}\!\left( \frac{QK^\top}{\sqrt{d_k}} + M \right) V$$

- $Q \in \mathbb{R}^{L \times d_k}$ : queries (각 row = 한 사건의 query vector)
- $K \in \mathbb{R}^{L \times d_k}$ : keys
- $V \in \mathbb{R}^{L \times d_v}$ : values
- $M \in \mathbb{R}^{L \times L}$ : **마스크 행렬** — 0 (허용) 또는 $-\infty$ (차단)
- $\sqrt{d_k}$ : 점수 스케일링 분모 (학습 안정화)

### 4줄 해석

1. **기호 뜻**: $Q K^\top$ 의 $(i, j)$ 원소는 "사건 $i$ 의 query 가 사건 $j$ 의 key 와 얼마나 닮았는가" 의 점수. softmax 가 row-wise → 사건 $i$ 가 모든 사건에 분배할 attention 가중치 합 = 1.
2. **일상 비유**: 도서관에서 책 한 권($i$) 의 색인 카드(query) 를 들고 가서 모든 책($j$) 의 표지(key) 를 비교해 "가장 관련 있는 책에 손을 뻗는 강도" 를 만든 뒤, 그 강도로 책들의 내용(value) 을 가중합.
3. **왜 이 형태**: (a) 내적 = 차원 vector 의 유사도 측정의 표준. (b) $\sqrt{d_k}$ 나누기 = $d_k$ 가 크면 내적 분산이 커져 softmax 가 saturate → gradient vanish. 분모로 normalize 해서 안정화. (c) softmax = 확률 분포 보장. (d) 마스크 $M$ = causal (미래 차단), padding (가짜 token 차단) 인코딩.
4. **조심할 점**:
   - **Causal mask**: $M_{ij} = -\infty$ for $j > i$ — 사건 $i$ 는 미래 $j > i$ 에 attention 못 함. 추론 시 인과성 보장.
   - **Padding mask**: 배치 내 길이 다른 시퀀스의 padding 위치 차단.
   - **Softmax 의 분산**: 매우 긴 시퀀스에서 한 token 에 attention 집중하기 어려움 (entropy 증가). 사건이 매우 많은 시퀀스(Financial avg 2000) 에서 self-attention 의 표현력 한계.

### 코드 verbatim (`transformer/Modules.py::ScaledDotProductAttention`)

```python
attn = torch.matmul(q / self.temperature, k.transpose(2, 3))
if mask is not None:
    attn = attn.masked_fill(mask, -1e9)
attn = self.dropout(F.softmax(attn, dim=-1))
output = torch.matmul(attn, v)
```

`self.temperature = d_k ** 0.5`.

---

## 2) Multi-Head Attention

### 수식

$$\text{MultiHead}(X) = \text{Concat}(\text{head}_1, \ldots, \text{head}_h) W^O$$

$$\text{head}_i = \text{Attention}(X W^Q_i, X W^K_i, X W^V_i)$$

- $X \in \mathbb{R}^{L \times d_{\text{model}}}$ : 입력 시퀀스
- $W^Q_i, W^K_i \in \mathbb{R}^{d_{\text{model}} \times d_k}$, $W^V_i \in \mathbb{R}^{d_{\text{model}} \times d_v}$ : i번째 head 의 projection (Xavier uniform init)
- $W^O \in \mathbb{R}^{h d_v \times d_{\text{model}}}$ : output projection
- $h = 4$ (THP default, run.sh: `n_head=4`)

### 4줄 해석

1. **기호 뜻**: 한 입력을 $h$ 개의 다른 "관점" (각각 다른 query/key/value 부분공간) 으로 분해해 attention 을 독립적으로 계산한 뒤, 결과를 concat 해서 다시 합성.
2. **일상 비유**: 같은 사건 시퀀스를 **4 명의 분석가가 각각 다른 관점** (예: 1번 분석가는 시간 패턴, 2번은 사건 종류, 3번은 강도 변화, 4번은 사이클) 으로 분석하고 결과를 회의로 종합.
3. **왜 이 형태**: 단일 attention 의 표현 한계 (한 attention 분포만으로는 여러 종류의 의존성 동시 표현 어려움) 를 분할정복. 학습된 head 가 specialize 되는 현상이 자연어 트랜스포머에서 잘 알려져 있음 (Voita 2019, Clark 2019).
4. **조심할 점**:
   - **$d_k = d_v = d_\text{model} / h$ 강제 안 함**: THP run.sh 는 $d_\text{model} = d_k = d_v = 512$, $h = 4$ → 총 attention 차원이 4 × 512 = 2048 → output projection 으로 다시 512 로 reduce. 일반 transformer 보다 head 당 차원 큼 → 표현력 ↑ 비용 ↑.
   - **Head 수 4 의 선택 근거 본문 미접근**: 점과정의 사건 종류 수 vs head 수 관계는 추후 ablation 필요.

### 코드 verbatim (`transformer/SubLayers.py::MultiHeadAttention.forward`)

```python
q = self.w_qs(q).view(sz_b, len_q, n_head, d_k)
k = self.w_ks(k).view(sz_b, len_k, n_head, d_k)
v = self.w_vs(v).view(sz_b, len_v, n_head, d_v)
q, k, v = q.transpose(1, 2), k.transpose(1, 2), v.transpose(1, 2)  # b x n x lq x dv
output, attn = self.attention(q, k, v, mask=mask)
output = output.transpose(1, 2).contiguous().view(sz_b, len_q, -1)
output = self.dropout(self.fc(output))
output += residual
output = self.layer_norm(output)
```

**Pre/Post norm**: `normalize_before` flag 로 LN 위치 조절. default 는 post-norm.

---

## 3) Position-wise Feed-Forward Network (FFN)

### 수식

$$\text{FFN}(z) = \text{GELU}(z W_1 + b_1) W_2 + b_2$$

- $z \in \mathbb{R}^{d_\text{model}}$ : attention 출력 한 위치
- $W_1 \in \mathbb{R}^{d_\text{model} \times d_\text{hid}}$, $W_2 \in \mathbb{R}^{d_\text{hid} \times d_\text{model}}$
- GELU: $z \cdot \Phi(z)$ 여기서 $\Phi$ 는 표준정규 누적분포.

### 4줄 해석

1. **기호 뜻**: 각 위치별로 독립적인 2-layer MLP. attention 으로 얻은 vector 를 비선형 변환.
2. **일상 비유**: attention 으로 모은 정보를 각 사건이 **자기 입장에서 한 번 더 가공** — 표준어로 번역하는 단계.
3. **왜 이 형태**: 표준 트랜스포머에서 검증된 구조. GELU 는 ReLU 보다 부드럽고, 음수 영역에서도 작은 gradient 가 흐름 → 학습 안정.
4. **조심할 점**:
   - $d_\text{hid} = 128$ (Main.py default) 또는 더 큼 (run.sh: `d_inner_hid=1024`).
   - FFN 도 residual + LN 으로 감싸짐.

### 코드 verbatim (`transformer/SubLayers.py::PositionwiseFeedForward.forward`)

```python
residual = x
x = self.w_2(F.gelu(self.w_1(x)))
x = self.dropout(x)
x += residual
x = self.layer_norm(x)
```

---

## 4) Encoder Layer 와 마스크 처리

### Encoder Layer (`transformer/Layers.py`)

```python
def forward(self, enc_input, non_pad_mask=None, slf_attn_mask=None):
    enc_output, enc_slf_attn = self.slf_attn(
        enc_input, enc_input, enc_input, mask=slf_attn_mask)
    enc_output *= non_pad_mask
    enc_output = self.pos_ffn(enc_output)
    enc_output *= non_pad_mask
    return enc_output, enc_slf_attn
```

**핵심**:
- `slf_attn_mask` = causal (upper-triangular) + padding mask 의 OR 결합
- `non_pad_mask` = padding 위치 곱셈 차단 (attention 후, FFN 후 양쪽에)
- attention weight `enc_slf_attn` 반환 → 시각화 가능

### 마스크 코드 (`transformer/Models.py`)

```python
def get_non_pad_mask(seq):
    assert seq.dim() == 2
    return seq.ne(Constants.PAD).type(torch.float).unsqueeze(-1)

def get_subsequent_mask(seq):
    sz_b, len_s = seq.size()
    subsequent_mask = torch.triu(
        torch.ones((len_s, len_s), device=seq.device, dtype=torch.uint8), diagonal=1)
    subsequent_mask = subsequent_mask.unsqueeze(0).expand(sz_b, -1, -1)
    return subsequent_mask

def get_attn_key_pad_mask(seq_k, seq_q):
    len_q = seq_q.size(1)
    padding_mask = seq_k.eq(Constants.PAD)
    padding_mask = padding_mask.unsqueeze(1).expand(-1, len_q, -1)
    return padding_mask
```

---

## 5) Optional RNN layers

THP 는 **선택적으로 transformer 위에 LSTM 1-layer** 를 둘 수 있다 (run.sh 에서 `n_rnn_layers=1`). 이유: 사건이 매우 spiky 한 도메인(예: spike train) 에서 RNN 의 sequential bias 가 도움. transformer 의 long-range + RNN 의 local sequential 의 hybrid.

`transformer/Models.py::RNN_layers`:

```python
class RNN_layers(nn.Module):
    def __init__(self, d_model, d_rnn):
        super().__init__()
        self.rnn = nn.LSTM(d_model, d_rnn, num_layers=1, batch_first=True)
        self.projection = nn.Linear(d_rnn, d_model)

    def forward(self, data, non_pad_mask):
        lengths = non_pad_mask.squeeze(2).long().sum(1).cpu()
        pack_enc_output = nn.utils.rnn.pack_padded_sequence(
            data, lengths, batch_first=True, enforce_sorted=False)
        temp = self.rnn(pack_enc_output)[0]
        out = nn.utils.rnn.pad_packed_sequence(temp, batch_first=True)[0]
        out = self.projection(out)
        return out
```

**해석**: padding-aware pack_padded_sequence 로 효율 처리. 출력 차원 $d_\text{rnn} = 256$ (run.sh) 을 $d_\text{model}$ 로 projection. RNN 사용 여부는 데이터셋별 hyperparameter.

---

## 다른 접근으로 했다면

### 대안 A — Attention 자체에 시간 정보 주입

- query/key 에 $\text{temporal\_enc}(t_i - t_j)$ 을 곱하거나 더해 attention 점수 자체가 시간 차의 함수가 되도록.
- 장점: 강도 헤드 부담 줄임. attention 이 시간적으로 의미 있는 가중.
- 단점: 적분 $\int \lambda dt$ 가 attention 의 시간 의존성 때문에 복잡해짐.
- 후속작 (TAA-THP 2021, From Hawkes to Attention 2026) 이 이 방향.

### 대안 B — Mamba / SSM backbone

- self-attention 대신 selective state space.
- 장점: 매우 긴 시퀀스에 O(L) (vs attention O(L²)).
- 단점: long-range trigger 의 직접 attention 학습 못 함.
- 후속작 (Mamba Hawkes Process 2024) 이 직접 비교.

### 대안 C — Bidirectional attention

- THP 는 causal mask 로 단방향. encoder 자체는 양방향 가능하지만 점과정의 인과성 보존을 위해 단방향 선택.
- 양방향이면 학습 가속 가능하나 inference 시 미래 정보 누설 위험.

---

## 핵심 한 문장 요약

> **THP 의 attention 블록은 자연어 transformer 의 표준 그대로 — multi-head + causal mask + position-wise FFN + 옵션 LSTM stack — 이며, 점과정 특수성은 입력 임베딩(시간) 과 출력 강도 헤드에 모두 격리시켜 표준 트랜스포머의 모든 최적화 기법(label smoothing, dropout, GELU, Xavier init, pre/post norm) 을 그대로 적용 가능하게 했다.**

다음 절(`05_method_d`) 에서 attention 의 출력 $h_j$ 가 어떻게 연속시간 강도 $\lambda_k(t)$ 로 변환되는지 본다.
