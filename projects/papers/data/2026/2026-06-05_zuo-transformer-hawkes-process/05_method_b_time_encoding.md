# 05_method_b — 방법론 (2) 시간 인코딩

## 이 부분이 왜 필요한가

표준 트랜스포머의 positional encoding 은 **위치 인덱스** (1번째, 2번째, ...) 의 함수다. 그러나 점과정의 사건은 **연속 시간** 위에 있다. 9:30:01.235 과 9:30:01.236 사이 1 ms 의 차이가 "1번째 → 2번째" 의 차이와 의미상 완전히 다르다. 따라서 **시간 스칼라 자체를 어떻게 vector embedding 으로 변환할 것인가** 가 점과정 transformer 의 첫 디자인 결정.

THP 는 표준 트랜스포머의 sinusoidal positional encoding 을 **위치 → 시간** 으로 재해석해서 그대로 사용한다.

---

## 수식

시각 $t$ (스칼라, 단위는 데이터셋에 따름 — 초/분/일) 를 차원 $d$ 의 vector 로 임베딩:

$$\text{temporal\_enc}(t)_{2i} = \sin\!\left( \frac{t}{10000^{2i/d}} \right), \quad \text{temporal\_enc}(t)_{2i+1} = \cos\!\left( \frac{t}{10000^{2i/d}} \right)$$

$i \in \{0, 1, \ldots, d/2 - 1\}$ 이 vector 의 짝수 인덱스(0, 2, 4, ...) 에는 sin, 홀수 인덱스(1, 3, 5, ...) 에는 cos.

### 4줄 해석

1. **기호 뜻**:
   - $t$ : 사건 발생 시각 (스칼라 실수, 단위는 데이터셋에 의존)
   - $d$ : 임베딩 차원 (THP run.sh: 512, default: 64)
   - $i$ : 임베딩 vector 내 인덱스, 한 쌍이 한 주파수 채널 표현
   - $10000^{2i/d}$ : **주기 조절 분모** — $i$ 가 클수록 분모 큼 → 주기 길어짐. 즉 첫 차원은 빠른 주기, 마지막 차원은 느린 주기로 시간을 표현
2. **일상 비유**: 시간을 **회중시계의 여러 바늘들이 동시에 가리키는 위치들의 모음** 으로 변환. 초침은 빨리 돌고, 분침은 천천히, 시침은 더 천천히. 시간 한 스칼라를 "각 바늘이 어디를 가리키는가" 의 vector 로 풀어쓴 것.
3. **왜 이 형태**: (a) 시간 차이 $t' - t$ 가 vector 차이 $\text{enc}(t') - \text{enc}(t)$ 의 **선형 변환**으로 표현 가능 (sin/cos 의 가법성). 즉 모델이 "사건 간 간격" 정보를 학습하기 쉬움. (b) 여러 주파수 채널이 동시에 있어 짧은 간격과 긴 간격 모두 분해 가능. (c) 학습 가능한 파라미터 0개 → 추가 학습 부담 없음.
4. **조심할 점**:
   - **단위 의존성**: $t = 86400$ (초 단위 1일) 과 $t = 1$ (일 단위 1일) 의 인코딩이 완전히 다른 vector. 데이터셋 시간 단위를 통일하거나 normalize 해야 함.
   - **$t$ 가 매우 크면**: $\sin(t/10000^0) = \sin(t)$ 가 빠르게 회전 → 인접 사건의 인코딩이 random-like. high-freq 도메인(밀리초 단위 금융) 에서 단위 변환 필수.
   - **표준 PE 와의 차이**: 표준은 $t \in \mathbb{Z}_{\geq 0}$ 정수만, THP 는 $t \in \mathbb{R}_{\geq 0}$ 실수. 실수 입력은 표준 PE 보다 정보 분해가 더 부드러워 학습에 유리.

### 코드 verbatim (re-derived)

`transformer/Models.py::Encoder.temporal_enc(self, time, non_pad_mask)`:

```python
def temporal_enc(self, time, non_pad_mask):
    """
    Input: batch * seq_len.
    Output: batch * seq_len * d_model.
    """
    result = time.unsqueeze(-1) / self.position_vec
    result[:, :, 0::2] = torch.sin(result[:, :, 0::2])
    result[:, :, 1::2] = torch.cos(result[:, :, 1::2])
    return result * non_pad_mask
```

여기서 `self.position_vec = torch.tensor([math.pow(10000.0, 2.0 * (i // 2) / d_model) for i in range(d_model)])` — Vaswani 2017 의 PE 와 동일 분모 구조.

---

## 다른 접근으로 했다면

### 대안 A — Learnable time embedding (e.g., MLP(t))

- 장점: 데이터셋 단위에 더 강건. 임의 비선형 변환 학습.
- 단점: 추가 파라미터, 데이터 적을 때 overfitting. 가법성(시간 차의 vector 차) 보장 안 됨.

### 대안 B — Time2Vec (Kazemi et al. 2019)

- $\text{Time2Vec}(t) = [\omega_0 t + \phi_0; \sin(\omega_1 t + \phi_1); \ldots; \sin(\omega_{d-1} t + \phi_{d-1})]$ — 주파수 $\omega_i$ 와 phase $\phi_i$ 가 모두 학습 가능.
- 장점: sinusoidal 의 분해성 유지 + 학습 가능.
- 단점: 시간 vector 자체에 학습 신호 부담. 점과정 학습 신호가 강하지 않으면 underfit.

### 대안 C — 시간 차 인코딩 (Δt 만)

- 사건 시각 $t_i$ 대신 직전 사건과의 차 $\Delta t_i = t_i - t_i-1$ 만 인코딩.
- 장점: 시작 시각의 임의성에 강건. 데이터 normalize 자동.
- 단점: 절대 시각 정보(예: 오전 9시 vs 오후 9시) 손실. 일주기 패턴 학습 불가.

### THP 의 선택

표준 sinusoidal PE 그대로 + 시각을 실수 스칼라로 — **추가 파라미터 0**, **분해성 보장**, **계산 비용 무시 가능**. 단위 의존성은 사용자의 데이터 normalize 책임.

---

## 임베딩 합산

최종 입력 임베딩은

$$x_i = U[k_i] + \text{temporal\_enc}(t_i)$$

- $U \in \mathbb{R}^{(K+1) \times d}$ : event type embedding table ($K$ 개 type + 1 padding)
- $U[k_i] \in \mathbb{R}^d$ : 사건 $i$ 의 종류 임베딩
- 표준 트랜스포머와 같은 "token + position" 의 직접 차용

이게 가능한 이유: 표준 트랜스포머의 PE 더하기는 token embedding 과 PE 가 **다른 차원 부분공간** 에 살도록 학습됨이 알려져 있고 (Vaswani 2017), 같은 trick 이 점과정에서도 통한다는 가설.

---

## 핵심 한 문장 요약

> **시간 인코딩은 점과정 트랜스포머의 첫 번째 디자인 결정이며, THP 는 "표준 PE 의 위치 인덱스 자리에 실수 시각을 그대로 대입" 이라는 가장 단순한 선택을 했고, 이 선택의 의존성·한계는 데이터 normalize 정책으로 모두 처리한다.**

다음 절(`05_method_c`) 에서 이 임베딩 위에 작동하는 self-attention 의 구조를 본다.
