# 05b. FFT 주기 탐지 — FFT_for_Period 수식 해부

> **배경 사다리**: ① 이산 푸리에 변환(DFT) = 유한 길이 이산 신호를 주파수 성분(복소수)으로 변환. ② 진폭(amplitude) = 복소수의 절덧값 — 그 주파수 성분이 얼마나 강한지. ③ 주파수 인덱스(frequency index) $f$ = DFT 결과의 $f$번째 성분; 신호 길이 $T$에서 $f$번째 성분의 주기는 $T/f$ 시간 단계.

---

## 왜 FFT 주기 탐지가 필요한가

TimesNet의 핵심 가정은 "시계열에는 지배적인 주기가 있고, 그 주기로 접으면 의미 있는 2D 구조가 생긴다"이다. 주기를 사전에 정해두면(하이퍼파라미터로 고정) 데이터마다 달라지는 주기성을 반영하지 못한다. 따라서 FFT로 **데이터에서 자동으로 주기를 탐지**해야 한다.

---

## FFT_for_Period 수식

```python
def FFT_for_Period(x, k=2):
    xf = torch.fft.rfft(x, dim=1)
    frequency_list = abs(xf).mean(0).mean(-1)
    frequency_list[0] = 0
    _, top_list = torch.topk(frequency_list, k)
    top_list = top_list.detach().cpu().numpy()
    period = x.shape[1] // top_list
    return period, abs(xf).mean(-1)[:, top_list]
```

이 함수가 하는 일을 수식으로 쓰면:

$$\mathbf{X}_f = \text{FFT}(\mathbf{x}, \text{dim}=\text{time}) \in \mathbb{C}^{B \times \lfloor T/2+1 \rfloor \times C}$$

$$A_f = \frac{1}{BC} \sum_{b=1}^{B} \sum_{c=1}^{C} |\mathbf{X}_f[b, f, c]| \quad \text{(주파수 } f \text{의 평균 진폭)}$$

$$A_0 = 0 \quad \text{(DC 성분 제거)}$$

$$\{f_1, f_2, \ldots, f_k\} = \text{TopK}(\{A_1, A_2, \ldots\}, k)$$

$$p_i = \lfloor T / f_i \rfloor \quad \text{(주기 길이 = 시퀀스 길이 / 주파수 인덱스)}$$

반환값: $(p_1, \ldots, p_k)$ (주기들), $(A_{b, f_1}, \ldots, A_{b, f_k})$ (샘플별 가중치용 진폭)

### 기호 뜻
- $B$: 배치 크기 (처리하는 시계열 개수)
- $T$: 시퀀스 길이 (시간 단계 수)
- $C$: 채널 수 (변수 개수)
- $f$: 주파수 인덱스 (1부터 $T/2$ 사이의 정수)
- $p_i$: $i$번째 지배 주기의 길이 (시간 단계 수)

### 일상 비유
음악에서 "이 곡에서 1박, 2박, 4박 중 어떤 리듬이 가장 강한가"를 세어 상위 $k$개 리듬을 선택하는 것. FFT는 "각 리듬(주파수)이 얼마나 강한가"를 한 번에 계산해준다.

### 왜 이 형태인가
- **rfft** (real FFT): 실수 신호에 대한 FFT는 켤레 대칭이 있어 절반만 계산하면 된다. 출력 크기 $T/2+1$로 효율적.
- **`mean(0).mean(-1)`**: 배치($B$)와 채널($C$) 전체에 걸친 평균 — 모든 샘플·채널이 공유하는 공통 주기를 찾는다.
- **`frequency_list[0] = 0`**: DC 성분(f=0, 즉 전체 평균값)을 주기로 해석하면 $p = T/0 = \infty$가 되어 의미 없다. 강제로 0으로 설정해 TopK에서 배제.
- **`period = T // top_list`**: 정수 나눗셈이므로 주기가 정확히 $T$의 약수가 아닌 경우 올림 패딩이 필요하다.

### 조심할 점
1. **채널 공통 주기 가정**: 모든 채널의 진폭을 평균 내서 채널별로 지배 주기가 다른 경우(예: 기온과 풍속이 서로 다른 주기를 가지는 경우) 일부 채널에 맞지 않는 주기가 선택될 수 있다.
2. **비정수 주기**: 실세계에서 주기가 정확히 정수 시간 단계인 경우가 드물다. 예: 일주일 = 7일 = 168시간이면 시간 단위 데이터에서 주기 168은 정확히 표현되지만, 태양 주기 = 365.25일은 분 단위에서 근사될 수밖에 없다.
3. **단기 시퀀스에서 주파수 해상도 부족**: FFT의 주파수 해상도는 $1/T$이다. $T$가 짧으면 비싷한 주기 두 개를 구분하지 못한다.
4. **비정상 시계열(non-stationary)**: FFT는 전체 시퀀스 구간에 걸쳐 일정한 주기를 가정한다. 주기가 시간에 따라 변하면 잘못된 주기를 탐지한다.

---

## 반환값의 사용

FFT_for_Period는 두 가지를 반환한다:

1. **`period`** = 주기 길이 배열 $[p_1, p_2, \ldots, p_k]$ → TimesBlock에서 1D→2D reshape에 사용
2. **`abs(xf).mean(-1)[:, top_list]`** = 샘플별 주파수 진폭 $\in \mathbb{R}^{B \times k}$ → TimesBlock에서 $k$개 결과의 가중합에 사용

이 두 가지가 TimesBlock에서 어떻게 쓰이는지는 05c에서 다룬다.

---

## 대안 비교

| 접근 | 장점 | 단점 |
|------|------|------|
| **FFT top-k (TimesNet)** | 자동 탐지, 데이터 적응적, O(T log T) | 채널 공통, 비정상 취약 |
| **고정 주기 (사전 지식)** | 단순, 해석 쉬움 | 데이터마다 달라야 함, 자동화 불가 |
| **학습 가능한 주기 (gradient descent)** | 완전 자동, 비정수 주기 가능 | 복잡, 불안정, 해석 어려움 |
| **Autoformer의 Auto-Correlation** | 시차(lag) 기반, 학습 과정에서 주기 탐지 | 고정 top-k, 공유 주기 |

→ 05c에서 탐지된 주기를 이용한 1D→2D 변환과 Inception Block을 해부.
