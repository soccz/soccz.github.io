# 05_method_c — 방법론: CNN + Inception + LSTM 의 수학적 정의

**배경 사다리**: ① **2-D convolution** $y = W \star x + b$ 는 작은 가중치 행렬 $W$ 를 입력 위에서 stride 만큼 미끄러뜨려 점곱 후 더함, ② **batch normalization** 은 한 minibatch 내에서 채널별 평균·분산을 정규화, ③ **LSTM** 은 forget/input/output gate 로 hidden state 를 시간에 따라 업데이트하는 RNN — 셋만 알면 충분.

---

## 1. Conv Block 1 — 가격·거래량 짝 결합 + 단기 시간 패턴

```python
self.conv1 = nn.Sequential(
    nn.Conv2d(1, 32, kernel_size=(1,2), stride=(1,2)),
    nn.LeakyReLU(0.01), nn.BatchNorm2d(32),
    nn.Conv2d(32, 32, kernel_size=(4,1)),
    nn.LeakyReLU(0.01), nn.BatchNorm2d(32),
    nn.Conv2d(32, 32, kernel_size=(4,1)),
    nn.LeakyReLU(0.01), nn.BatchNorm2d(32),
)
```

수식으로 한 단계씩:

### 1-1. 첫 conv (가격·거래량 짝)
$$
h^{(1)}_{c,t,j} = \mathrm{LeakyReLU}\Big(\sum_{c'=1}^{1} W^{(1)}_{c,c',1,1} x_{c',t,2j-1} + W^{(1)}_{c,c',1,2} x_{c',t,2j} + b^{(1)}_c\Big)
$$
- **기호 뜻**: $x \in \mathbb{R}^{1 \times 100 \times 40}$ 입력, $W^{(1)} \in \mathbb{R}^{32 \times 1 \times 1 \times 2}$ 첫 conv 가중치, $h^{(1)} \in \mathbb{R}^{32 \times 100 \times 20}$. $j \in \{1, \ldots, 20\}$.
- **일상 비유**: 40 칸짜리 진열대에서 2 칸씩 묶어 점원 32명이 각자 다른 "이 짝이 얼마나 흥미로운가" 점수를 매김.
- **왜 이 형태**: stride 2 + 커널 너비 2 가 **인접 짝의 강제 결합** 을 만든다. 의미 없는 짝(다른 레벨 간 가격-거래량 교차) 결합을 차단.
- **조심할 점**: LOB 정렬이 (가격, 거래량) 순이라는 가정에 hard-coded. 다른 거래소 데이터로 옮길 때 정렬 확인 필수.

### 1-2. 둘째·셋째 conv (단기 시간 패턴)
$$
h^{(2)}_{c,t,j} = \mathrm{LeakyReLU}\Big(\sum_{c'=1}^{32}\sum_{\tau=0}^{3} W^{(2)}_{c,c',\tau,1} h^{(1)}_{c',t-\tau,j} + b^{(2)}_c\Big)
$$
- 시간축 4-tick receptive field. padding 없음 → 시간 차원 100 → 97 → 94.
- LeakyReLU(0.01) 는 dead ReLU 회피 + 음수 정보 보존.
- BatchNorm 으로 conv 출력 분포 정규화 → 학습 안정.

### 1-3. block 1 출력
shape $32 \times 94 \times 20$. 파라미터 수:
- conv1 (1→32, 1×2): $1 \cdot 32 \cdot 2 + 32 = 96$
- conv2 (32→32, 4×1): $32^2 \cdot 4 + 32 = 4128$
- conv3 (32→32, 4×1): $4128$
- BN ×3: 64 × 3 = 192

block 1 누적 = 8544. (정확치는 `summary` cell 13 확인)

---

## 2. Conv Block 2 — bid·ask 짝 결합 + Tanh

```python
self.conv2 = nn.Sequential(
    nn.Conv2d(32, 32, kernel_size=(1,2), stride=(1,2)),
    nn.Tanh(), nn.BatchNorm2d(32),
    nn.Conv2d(32, 32, kernel_size=(4,1)),
    nn.Tanh(), nn.BatchNorm2d(32),
    nn.Conv2d(32, 32, kernel_size=(4,1)),
    nn.Tanh(), nn.BatchNorm2d(32),
)
```

- 첫 stride-2 conv 가 20 → 10. 한 단계 위에서 결합된 (ask 짝, bid 짝) 을 다시 결합 → (bid-ask 쌍).
- **Tanh 활성**: $\tanh(z) = (e^z - e^{-z})/(e^z + e^{-z})$.
  - **기호 뜻**: 출력 범위 $(-1, 1)$.
  - **일상 비유**: "찬성·반대 의견의 강도를 ±1 안에 보고" — 한쪽으로 무한히 부풀지 않도록 제한.
  - **왜 이 형태 (Tanh)**: bid-ask 짝의 결과가 *대칭적* 으로 양·음 모두 가능 (bid 가 우세 vs ask 가 우세). Tanh 의 zero-centered 특성이 이 대칭을 자연스럽게 표현. LeakyReLU 라면 음수 쪽이 0.01 기울기로 줄어들어 비대칭.
  - **조심할 점**: Tanh 는 vanishing gradient 문제로 깊은 RNN 에서 비선호. 여기는 깊지 않아서 OK.

shape $32 \times 88 \times 10$.

---

## 3. Conv Block 3 — 10 레벨 통합 + LeakyReLU 복귀

```python
self.conv3 = nn.Sequential(
    nn.Conv2d(32, 32, kernel_size=(1,10)),
    nn.LeakyReLU(0.01), nn.BatchNorm2d(32),
    nn.Conv2d(32, 32, kernel_size=(4,1)),
    nn.LeakyReLU(0.01), nn.BatchNorm2d(32),
    nn.Conv2d(32, 32, kernel_size=(4,1)),
    nn.LeakyReLU(0.01), nn.BatchNorm2d(32),
)
```

- 커널 $1 \times 10$ → 가격레벨 10 개 전체를 한 번에 통합. 출력 가로 1.
- 그 뒤 $4 \times 1$ ×2 로 시간 추출.

shape $32 \times 82 \times 1$.

이 시점에서 가로 차원이 1 이 되어 *spatial dimension 이 사실상 사라지고* 시간축 시퀀스만 남는다. 다음 단계부터는 시계열 처리.

---

## 4. Inception 모듈 — 다중 시간 스케일

```python
self.inp1 = nn.Sequential(  # 1×1 → 3×1
    nn.Conv2d(32, 64, kernel_size=(1,1), padding='same'),
    nn.LeakyReLU(0.01), nn.BatchNorm2d(64),
    nn.Conv2d(64, 64, kernel_size=(3,1), padding='same'),
    nn.LeakyReLU(0.01), nn.BatchNorm2d(64),
)
self.inp2 = nn.Sequential(  # 1×1 → 5×1
    nn.Conv2d(32, 64, kernel_size=(1,1), padding='same'),
    nn.LeakyReLU(0.01), nn.BatchNorm2d(64),
    nn.Conv2d(64, 64, kernel_size=(5,1), padding='same'),
    nn.LeakyReLU(0.01), nn.BatchNorm2d(64),
)
self.inp3 = nn.Sequential(  # MaxPool 3×1 → 1×1
    nn.MaxPool2d((3, 1), stride=(1, 1), padding=(1, 0)),
    nn.Conv2d(32, 64, kernel_size=(1,1), padding='same'),
    nn.LeakyReLU(0.01), nn.BatchNorm2d(64),
)
```

세 평행 가지가 각자 다른 시간 receptive field 를 추출:

| Branch | 시간 receptive field | 의미 |
|--------|--------------------|------|
| inp1 | 3-tick | 짧은 펄스 |
| inp2 | 5-tick | 중간 펄스 |
| inp3 | 3-tick (MaxPool) | 강한 신호 통과 |

### 4-1. 1×1 conv 의 역할
첫 $1 \times 1$ 는 **채널 차원 변환** (32 → 64). 시간/공간 패턴은 건드리지 않고 채널 수만 늘려 다음 큰 커널이 풍부한 특징 위에서 작동하도록 한다. GoogLeNet 의 정확한 차용.

### 4-2. padding='same' 의 의미
padding 을 자동 계산해 출력 시간 차원이 입력과 동일 (82). 세 branch 출력 시간 차원이 일치 → channel concat 가능.

### 4-3. Concat
```python
x = torch.cat((x_inp1, x_inp2, x_inp3), dim=1)
```
3 branch × 64 채널 = **192 채널**. shape $192 \times 82 \times 1$.

### 4-4. 왜 Inception 이지 dilated conv 가 아닌가?
대안: WaveNet 의 dilated conv 로 점점 큰 receptive field 를 한 줄로 쌓는다. Inception 은 *평행*, dilated 는 *직렬* . 두 방법 모두 유효하지만 Inception 은 시간축 길이 보존 (지금처럼 82 → 82) 에 자연스럽다. Dilated 는 깊이가 깊어지며 길이 변화 관리가 복잡.

---

## 5. LSTM(64) — 잔여 장기 의존 + 최종 hidden

```python
self.lstm = nn.LSTM(input_size=192, hidden_size=64, num_layers=1, batch_first=True)
```

shape 변환: $(B, 192, 82, 1)$ → permute → reshape → $(B, 82, 192)$. 그 후 LSTM 적용.

### 5-1. LSTM 식 (간략)
$$
\begin{aligned}
f_t &= \sigma(W_f x_t + U_f h_{t-1} + b_f) \\
i_t &= \sigma(W_i x_t + U_i h_{t-1} + b_i) \\
\tilde{c}_t &= \tanh(W_c x_t + U_c h_{t-1} + b_c) \\
c_t &= f_t \odot c_{t-1} + i_t \odot \tilde{c}_t \\
o_t &= \sigma(W_o x_t + U_o h_{t-1} + b_o) \\
h_t &= o_t \odot \tanh(c_t)
\end{aligned}
$$

- **기호 뜻**: $x_t \in \mathbb{R}^{192}$ 시점 $t$ 입력 (Inception 출력), $h_t \in \mathbb{R}^{64}$ hidden, $c_t \in \mathbb{R}^{64}$ cell state.
- **일상 비유**: $f_t$ (forget gate) = "어제 메모 얼마나 지울까", $i_t$ (input) = "오늘 새로 적을까", $o_t$ (output) = "지금 누구한테 보여줄까". $c_t$ 는 *영구 메모장*, $h_t$ 는 *공개 알림판*.
- **왜 이 형태 (gated)**: 단순 RNN 은 vanishing gradient 로 100-tick 같은 장기 의존을 못 잡는다. Gate 가 long-term info 를 보존.
- **조심할 점**: 단방향이라 미래를 못 본다 (당연 — supervised 라벨이 미래). 양방향이면 정보 누설 (label leakage).

### 5-2. 마지막 시점만 사용
```python
x, _ = self.lstm(x, (h0, c0))
x = x[:, -1, :]
```
시간축 마지막 hidden $h_{82}$ 만 가져옴. 중간 정보는 LSTM 의 cell state 가 누적했다고 가정.

파라미터 수: $4 \cdot (192 + 64 + 1) \cdot 64 = 65,792$ → `summary` 보고 = **66,048** (PyTorch 내부 bias 추가 포함).

---

## 6. FC + Softmax

```python
self.fc1 = nn.Linear(64, 3)
forecast_y = torch.softmax(x, dim=1)
```

64 → 3 (down, stationary, up). softmax 로 확률 normalisation. 학습은 CrossEntropy. 단, softmax + CrossEntropy 조합은 보통 logit 그대로 CE 에 넘기는 게 안정 — 여기서는 forward 에서 softmax 후 CE 적용. 이는 *수치 안정성 면에서 비최적* (이중 log) 이지만 학습은 작동.

파라미터: $64 \cdot 3 + 3 = 195$.

---

## 7. 손실 함수 및 학습

```python
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.0001)
batch_size = 64
epochs = 50
```

- Adam optimiser, learning rate $1 \times 10^{-4}$ — 보수적 (큰 모델에 비해 작은 batch + 작은 lr).
- 50 epoch — convergence 충분. 노트북 cell 17 출력 보면 Epoch 8 부터 val loss 가 0.87 근처에서 plateau, Epoch 14 에서 best 갱신 후 36 epoch 동안 더 개선 없음. **사실상 14 epoch 면 충분** 한 학습 과정.
- Cross-Entropy: 3-class 표준.

---

## 8. 다른 접근으로 했다면? — 대안 3개

### 대안 (a): Transformer 로 LOB 처리
- 40-dim 입력의 attention. 모든 짝을 평등하게 보고 self-attention 으로 위계 학습.
- 장점: design-free, 표현력 ↑.
- 단점: 데이터·계산량 ↑. 작은 데이터(FI-2010 의 20만 sample) 로는 conv 의 inductive bias 가 우세할 가능성.

### 대안 (b): GCN (LOB graph 표현)
- 가격레벨을 노드로, 인접 레벨 간 엣지로 graph 표현. Spectral conv 적용.
- 장점: 가격레벨 비균등 spacing 도 자연스레 처리.
- 단점: graph 구성이 복잡. FI-2010 의 균등 표현에는 over-engineering.

### 대안 (c): TimesNet 풍 2-D FFT + Inception
- 시간축 FFT 로 dominant frequency 찾고 그 주기로 2-D reshape, 그 위에 Inception.
- 장점: 주기성 명시적 표현.
- 단점: LOB 다이내믹스는 강한 주기성이 없다 (intraday seasonality 정도). FFT-based 이득은 제한적.

---

## 9. 한 줄 요약

> **DeepLOB 의 forward 는 6 단계 — (가격·거래량 결합 + 단기시간) × 3 spatial scale → Inception 다중 시간 스케일 → LSTM 장기 의존 → FC → softmax — 로 총 143,907 파라미터를 사용해 LOB 의 위계와 다중 시간 스케일을 한 번에 처리한다.**
