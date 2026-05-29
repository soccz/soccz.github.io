# 05_method_a — 방법론: 전체 흐름의 직관

**배경 사다리**: ① CNN(합성곱 신경망) 이 "작은 필터를 입력 위에서 미끄러뜨려 국소 패턴을 찾는다", ② 합성곱은 입력의 **공간적 위계 (spatial hierarchy)** 가 의미 있을 때 강력하다, ③ LOB 가 시간×가격레벨 의 격자라는 점 — 이 셋이 본 모델의 출발선이다.

---

## 1. 전체 흐름 한 장 요약

```
입력 X ∈ R^{1×100×40}  ──┐ (시간 100, 특징 40, 채널 1)
                         │
   ┌─────────────────────┘
   │
   ▼
[Conv Block 1]  1×2 stride 1×2   ─→ 채널 32, 100 × 20   (가격·거래량 짝 결합)
[Conv Block 1]  4×1 ×2           ─→ 채널 32, 94 × 20    (단기 시간 패턴)
   │
   ▼
[Conv Block 2]  1×2 stride 1×2   ─→ 채널 32, 94 × 10    (bid·ask 짝 결합)
[Conv Block 2]  4×1 ×2           ─→ 채널 32, 88 × 10    (단기 시간 패턴 다시)
   │
   ▼
[Conv Block 3]  1×10             ─→ 채널 32, 88 × 1     (10 레벨 전체 통합)
[Conv Block 3]  4×1 ×2           ─→ 채널 32, 82 × 1     (단기 시간 패턴 다시)
   │
   ▼
[Inception Branch 1]  1×1 → 3×1 (same pad) ─→ 채널 64, 82 × 1
[Inception Branch 2]  1×1 → 5×1 (same pad) ─→ 채널 64, 82 × 1
[Inception Branch 3]  MaxPool 3×1 → 1×1    ─→ 채널 64, 82 × 1
   │      concat in channel dim
   ▼
       채널 192, 시간 82
   │
   ▼
[LSTM(input=192, hidden=64), 마지막 시점]  ─→ 64-dim 벡터
   │
   ▼
[FC(64 → 3)] → softmax ─→ {up, stationary, down}
```

총 파라미터 **143,907**. 이 작은 크기로 FI-2010 에서 75% 정확도(저자 PyTorch 노트북) 를 낸다는 게 핵심.

---

## 2. 왜 conv 인가? — 영상 vs 호가창의 비유

CNN 이 영상에서 성공한 이유는 **인접 픽셀 간에 의미 있는 관계** 가 있기 때문이다. 강아지 사진에서 코 픽셀 옆에는 입 픽셀이, 그 옆에는 턱 픽셀이 온다 — 부분이 모여 더 큰 부분을 이룬다는 위계.

LOB 도 똑같다:
- **가로 방향 (특징 축, 40)**: 가격·거래량 짝 → bid·ask 짝 → 10 레벨 가격 의 위계.
- **세로 방향 (시간 축, 100)**: 인접 tick 간 강한 의존 (LOB 는 보통 한 tick 에 한두 entry 만 바뀜).

이 위계를 conv 커널 모양에 흡수하면, 모델은 *학습 첫 epoch 부터* "이 두 칸은 짝이다" 를 알고 시작한다. 무지에서 시작하는 MLP 보다 훨씬 효율적.

---

## 3. 왜 굳이 stride 를 1×2 로? — 강제 결합의 의도

첫 conv 의 stride 가 (시간 1, 특징 2) 라는 점이 중요하다. stride 1 은 시간축의 모든 정보를 유지하지만, stride 2 는 가로축을 **반으로 줄여** 인접 entry 가 더 이상 짝지어지지 않도록 만든다. 즉, **"가격과 거래량을 한 번 묶고 나면 다시 풀지 못한다"** 는 강한 제약.

이게 왜 좋은가? 만약 stride 1 로 했다면 conv 커널이 (가격₁, 거래량₁) 도 보고, (거래량₁, 가격₂) 도 본다. 후자는 LOB 의 의미상 무의미한 짝(다른 레벨의 거래량과 가격). 의미 없는 짝을 학습이 *잘못 활용* 할 위험을 차단하기 위해 stride 2 로 *forced merge* 를 강제한다.

같은 논리가 둘째 conv 의 stride $1 \times 2$ (bid-ask 짝) 와 셋째 conv 의 $1 \times 10$ (10 레벨 통합) 에도 적용된다. 각 단계마다 conv 가 "다음 의미 단위" 로 한 번에 점프한다.

---

## 4. 왜 4×1 시간 conv 를 끼워넣었는가?

$1 \times 2$ → $1 \times 2$ → $1 \times 10$ 만 했다면 모델은 *한 시점에서만* 가격레벨을 통합한다. 그러나 LOB 의 다음 가격 변화는 *최근 몇 tick* 의 변화에 의존한다. 그래서 각 spatial 단계 직후 $4 \times 1$ (시간축 4-tick) 커널을 두 번 끼워 넣는다.

이는 **"한 spatial scale 에서 짧은 시간 패턴을 추출 → 다음 spatial scale 로 진입"** 의 반복. spatial 과 temporal 을 번갈아 처리하는 design.

수식적으로: $4 \times 1$ 커널 두 번이면 receptive field 가 시간축으로 7-tick 정도. 세 conv 블록을 거치면 누적 receptive field 는 약 19-tick (= 6 + 6 + 6 + ε, padding 없이). 그래서 마지막 conv 출력 시 시간 차원이 100 → 82 로 축소된다.

---

## 5. 왜 Inception 이 그 다음에 오는가?

19-tick receptive field 는 단기 패턴 추출에 충분하지만 100-tick 전체를 한 번에 보지 못한다. Inception 모듈은 그 시점 시간축 82 위에서 **여러 receptive field 를 평행 추가**:

- Branch 1 ($3 \times 1$): 추가 3-tick 패턴.
- Branch 2 ($5 \times 1$): 추가 5-tick 패턴.
- Branch 3 (MaxPool $3 \times 1$ + $1 \times 1$): 인접 3-tick 의 최댓값 통과 — 시간축의 spike 검출.

세 branch 의 출력 (각 채널 64) 을 채널 차원으로 concat → 192. 이는 GoogLeNet 의 정확한 차용. 시간축 1-D 변형.

---

## 6. 왜 마지막에 LSTM 인가? — conv 만으로는 부족한 부분

conv + Inception 의 누적 receptive field 는 약 30-tick 정도 (대략). 그러나 LOB 의 일부 패턴은 *100-tick 전체* 를 봐야 의미가 있다 (예: queue depletion 의 누적). LSTM 은 시간축 82 시퀀스를 받아 hidden state 에 누적, 마지막 시점 hidden 만 다음 층에 넘긴다.

LSTM 이 단층(64)이라는 점이 중요: 무거운 RNN 으로 가는 대신, **conv 가 충분히 일을 한 뒤 LSTM 이 가벼운 통합만** 하도록 설계.

---

## 7. 활성 함수 선택 — LeakyReLU 와 Tanh 의 혼용 이유 (추정)

notebook cell 11 에서 conv 1·3 블록은 LeakyReLU(slope=0.01), conv 2 블록은 Tanh, Inception 은 LeakyReLU 다. 본문에 이 선택의 이유가 명시됐는지는 미확인. 추정:
- **Conv 1 LeakyReLU**: 음수 유지로 거래량의 부호적 정보 보존 (그러나 거래량은 비음수, ReLU 도 가능 — 미스터리).
- **Conv 2 Tanh**: bid-ask 짝의 출력이 *대칭적* 으로 분포해야 하므로 bounded activation. mid-price 중심의 양·음 편향을 모두 표현.
- **Conv 3 LeakyReLU**: 10 레벨 통합 후 다시 unbounded — 큰 imbalance 신호의 amplitude 를 유지.

이는 *해체자의 가설*이며 본문 명시 없음. 본 해체는 architecture 의 작동 사실만 단정.

---

## 8. 한 줄 요약

> **DeepLOB 는 LOB 의 위계 (가격·거래량 → bid·ask → 10 레벨 → 다중 시간 스케일 → 장기 의존) 를 conv 커널 모양으로 차례로 풀어내는 6 단계 파이프라인이며, 각 단계마다 spatial 통합과 temporal 추출을 번갈아 수행해 raw LOB 행렬에서 직접 학습한다.**
