# 05_method_b — 방법론: LOB 입력 표현

**배경 사다리**: ① **호가창(LOB)** 의 각 스냅샷은 매수 측 N 레벨과 매도 측 N 레벨의 (가격, 거래량) 쌍으로 구성된 벡터, ② DeepLOB 는 N=10 즉 40-dim 입력을 사용, ③ 모델은 단일 스냅샷이 아닌 **연속된 100 스냅샷의 시퀀스** 를 입력으로 받는다.

---

## 1. 입력 텐서의 정확한 모양

```
X ∈ R^{1 × T × F}
T = 100  (시간 길이, lookback)
F = 40   (특징 차원)
1        (단일 채널)
```

원본 FI-2010 raw 파일 (예: `Train_Dst_NoAuction_DecPre_CF_7.txt`) 의 shape 은 (149, N_time):
- 첫 40 행: LOB 특징 ($x_t$ 의 40 차원)
- 행 41–144: 추가 특징 (저자가 사용 안 함, notebook cell 9 의 `prepare_x` 함수가 `data[:40, :].T` 로 잘라 옴 — 직접 확인)
- 마지막 5 행 (149-5 ~ 149): 5 개 prediction horizon 의 label

본 모델은 raw 40 차원만 사용. 나머지는 무시. notebook cell 9 코드:

```python
def prepare_x(data):
    df1 = data[:40, :].T
    return np.array(df1)

def get_label(data):
    lob = data[-5:, :].T
    return lob
```

이 두 함수가 핵심.

---

## 2. 40 차원의 의미 분해

FI-2010 표준 순서 (Ntakaris 2018 benchmark 의 정의):

| 인덱스 | 의미 |
|--------|------|
| 0 | $p^{a,1}$ — 1번째 매도 호가 가격 (best ask) |
| 1 | $v^{a,1}$ — 1번째 매도 호가 거래량 |
| 2 | $p^{b,1}$ — 1번째 매수 호가 가격 (best bid) |
| 3 | $v^{b,1}$ — 1번째 매수 호가 거래량 |
| 4 | $p^{a,2}$ |
| 5 | $v^{a,2}$ |
| 6 | $p^{b,2}$ |
| 7 | $v^{b,2}$ |
| … | … |
| 36 | $p^{a,10}$ |
| 37 | $v^{a,10}$ |
| 38 | $p^{b,10}$ |
| 39 | $v^{b,10}$ |

즉 40차원은 **(ask 가격, ask 수량, bid 가격, bid 수량) × 10 레벨** 로 정렬. 이 정렬이 conv 커널 모양 설계의 기반.

### 정렬과 1×2 커널의 일치
- **1×2 커널 첫 번째 적용 (stride 2)**: 인덱스 (0,1) → (가격, 거래량) 짝, (2,3) → (가격, 거래량) 짝, …, (38,39). 한 번에 20 개 짝.
- **1×2 커널 두 번째 적용 (stride 2)**: 위에서 나온 20 개 중 인덱스 (0,1) → (ask 짝, bid 짝) → (bid-ask) 쌍. 10 개로 축소.
- **1×10 커널 세 번째 적용**: 10 개 가격레벨을 한 번에 통합.

이 정렬이 conv 커널 모양과 정확히 맞물리는 게 DeepLOB 의 가장 중요한 design constraint.

---

## 3. 정규화 (Normalisation): DecPre

FI-2010 데이터는 세 가지 정규화로 공개됨:
- **DecPre** (Decimal Precision): 가격과 거래량을 $10^{-k}$ 로 나눠 일관된 스케일.
- **ZScore**: 종목별 평균·표준편차 정규화.
- **MinMax**: 종목별 min-max 정규화.

DeepLOB 는 **DecPre** 만 사용 (notebook 파일명 `Train_Dst_NoAuction_DecPre_CF_7.txt`). 이유 (추정):
- DecPre 는 가격·거래량의 *상대적 크기 비교* 를 보존 (ZScore 는 평균 빼서 손실).
- 절대값 정보가 보존되어 conv 가 'spread 가 얼마' 같은 절대적 특징도 배울 수 있다.

단 본문에 다른 정규화 비교 표가 있는지는 미확인. 본 해체는 architecture choice 만 단정.

---

## 4. NoAuction 분할

FI-2010 은 두 분할 옵션:
- **Auction**: 시장 개장·종장 부근 (auction phase) 포함.
- **NoAuction**: continuous trading 만.

DeepLOB 는 NoAuction 사용. Auction 시기는 LOB 다이내믹스가 크게 달라(보다 단발적), continuous market 의 일관 패턴 학습을 위해 제외.

---

## 5. 슬라이딩 윈도우: T=100 의 의미

notebook cell 9 `data_classification(X, Y, T)`:

```python
def data_classification(X, Y, T):
    [N, D] = X.shape
    dY = np.array(Y)
    dataY = dY[T - 1:N]
    dataX = np.zeros((N - T + 1, T, D))
    for i in range(T, N + 1):
        dataX[i - T] = df[i - T:i, :]
    return dataX, dataY
```

각 샘플은 100 연속 tick. **마지막 tick 의 label** 을 그 100-tick 윈도우의 정답으로 사용. 이 windowing 으로 $N$ tick raw → $(N - T + 1)$ 샘플.

`dec_train.shape = (149, 203800)` → train 8:2 split 후 약 16만 samples train, 4만 samples validation. test 셋도 비슷한 규모. notebook cell 8 출력:
```
torch.Size([203701, 1, 100, 40]) torch.Size([203701])
```

20만 개 train 샘플 → 작은 모델(14만 param) 에 충분.

---

## 6. 라벨 (Label): 3-class with horizon k

`get_label(data)` 가 last 5 행을 가져오는 이유: FI-2010 은 **5 개 horizon $k \in \{10, 20, 30, 50, 100\}$ tick 후 mid-price 변화** 를 미리 계산해 둔다. 라벨은 1, 2, 3 (각각 down, stationary, up) 중 하나, `-1` 보정으로 0/1/2 로 변환.

notebook cell 8 의 `k=4` 는 5 개 horizon 중 마지막 (인덱스 4 = $k=100$): "100-tick 후 가격이 어떻게 변할까" 를 맞추는 task.

### Stationary 의 정의
FI-2010 의 label 생성은 임계 비율 $\alpha$ 기반:
$$
\ell_t = \mathrm{sign}\big(m^+_{t,k} - m_t\big) \cdot \mathbf{1}\{|m^+_{t,k} - m_t| > \alpha \cdot m_t\}
$$
- $m_t$: 현재 mid-price
- $m^+_{t,k}$: $k$-tick 후 mid-price 의 평균 (smoothed)
- $\alpha$: 임계 (FI-2010 표준 $\alpha = 2 \times 10^{-5}$, 단 본문 명시 미확인)
- $\ell_t \in \{-1, 0, +1\}$

이 임계 때문에 class 분포가 거의 균형 (notebook cell 22 결과: down 47915, stationary 48050, up 43523 → 약 35:35:31). 균형이 자연스레 맞춰진 게 horizon $k=100$ + 표준 $\alpha$ 의 결과.

---

## 7. 입력 표현이 갖는 두 가지 강한 가정

1. **(가설 1) 가격레벨이 정확히 10 으로 충분**. 11번 이상의 깊이가 정보를 더 담을 가능성은 무시.
2. **(가설 2) 100 tick lookback 으로 충분**. 더 긴 history (500, 1000) 가 의미 있는 신호를 가질 가능성은 미실험.

두 가설 모두 architecture choice 로 hard-coded. 변경 시 conv 커널 사이즈가 모두 바뀐다.

---

## 8. 한 줄 요약

> **DeepLOB 의 입력은 (ask₁ 가격, ask₁ 거래량, bid₁ 가격, bid₁ 거래량, …, ask₁₀, …, bid₁₀, vol_bid₁₀) × 100 tick 의 100×40 행렬이며, FI-2010 의 DecPre·NoAuction 정규화 분할을 표준으로, $k$-tick 후 mid-price 의 3-class 변화 방향을 라벨로 받는다.**
