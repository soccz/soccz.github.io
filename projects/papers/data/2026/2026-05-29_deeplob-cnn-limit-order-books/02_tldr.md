# 02_tldr — 3층 TL;DR

**배경 사다리**: ① 주식 거래소가 매수·매도 주문을 가격 순으로 줄 세워 보관하는 장부가 **호가창(Limit Order Book, LOB)** 이라는 것, ② 이 장부가 시간이 흐르며 매 ms 마다 변한다는 것, ③ 다음 몇 초 후의 주가 움직임(올라간다 / 내려간다 / 그대로)을 맞추는 게 quant 트레이딩의 가장 기본 문제라는 것 — 이 셋만 알면 이 절을 읽을 수 있다.

---

## 🧒 초등학생 수준 (수식 없음)

상상해 보자. 어떤 빵집 앞에 사람들이 줄을 서 있다. 한쪽에는 "이 가격이면 사겠다"는 손님들이, 다른 한쪽에는 "이 가격이면 팔겠다"는 빵집 사람들이 줄을 선다. 사겠다는 사람 줄에서 가장 비싸게 부른 사람부터 1등, 그 다음 2등, …, 10등까지. 팔겠다는 줄도 가장 싸게 부른 1등부터 10등까지. 이 두 줄을 **호가창**이라고 부르자.

이 호가창의 모습은 매 순간 바뀐다. 누군가 새 주문을 넣으면 줄에 끼어들고, 거래가 체결되면 사라진다. 한 시간 동안 이 줄의 모습을 사진처럼 100번 찍어 두면, 우리는 "이 모양이 이렇게 변하면 다음에 빵 값이 오른다"는 패턴을 배울 수 있을지도 모른다.

DeepLOB 는 바로 이 일을 한다. 100장의 사진(시간 = 100 틱)을 가져와서, 한 줄에는 "1등 사겠다는 가격 / 그 수량 / 1등 팔겠다는 가격 / 그 수량 / 2등 사겠다는 가격 / …" 이런 식으로 40개 숫자(10등급 × 2(가격, 수량) × 2(사·팔))를 가지런히 늘어놓은 100 × 40 격자판을 만든다. 이걸 사진으로 보고 다음에 빵 값이 오를지 내릴지 맞추는 모델이 DeepLOB 다.

이 모델의 영리한 점: **사진을 한 번에 통째로 보지 않고 작은 조각부터 본다.** 처음에는 "가격과 수량 짝"을 보고(가로 1칸 × 세로 2칸), 그 다음에는 "1등과 2등 사람 사이의 관계"를 보고(세로 4칸 × 가로 1칸), 마지막에는 "10등급 전부를 한꺼번에 어떻게 흩어져 있나"를 본다. 그 위에 "최근 일/주/달 같은 다른 길이의 시간 흐름을 동시에 보는 망원경 3개"(Inception)를 얹고, 마지막에 "오늘까지 본 걸 기억하는 메모장"(LSTM)에 적어 다음 변화를 예측한다.

결과는? Nordic 시장 5종목으로 만든 표준 시험지(FI-2010)에서 정확도 75% 를 넘기며 당시 그 어떤 방법보다 잘 맞췄다. 더 놀라운 건, 한 번도 학습에 쓰지 않은 다른 회사 주식에서도 잘 작동했다 — 호가창의 보편적 언어를 모델이 배운 것이다.

---

## 🎓 학부생 수준 (수식 인라인)

LOB 의 한 스냅샷은 매수(bid) 측 10 레벨과 매도(ask) 측 10 레벨의 가격·거래량 짝, 총 40개 실수로 표현된다:

$$
x_t = \big[p^{a,1}_t, v^{a,1}_t, p^{b,1}_t, v^{b,1}_t, \ldots, p^{a,10}_t, v^{a,10}_t, p^{b,10}_t, v^{b,10}_t\big] \in \mathbb{R}^{40}
$$

여기서 $p^{a,i}$ 는 i-번째 매도 호가(가격), $v^{a,i}$ 는 그 수량(거래량), $p^{b,i}, v^{b,i}$ 는 매수 측 대응. 시점 $t$ 에서 길이 $T=100$ 인 history $X_t = (x_{t-99}, \ldots, x_t) \in \mathbb{R}^{100 \times 40}$ 를 입력으로 받아 $k$-틱 후 mid-price 변화 방향을 3-class 분류한다: $y \in \{\text{up}, \text{stationary}, \text{down}\}$.

DeepLOB 의 핵심 아이디어는 이 100×40 행렬을 **하나의 이미지**로 보고 CNN 으로 처리하되, **가격축(가로 40)** 과 **시간축(세로 100)** 을 **별도로 다룬다**는 점이다:

1. **첫 conv 블록**: 커널 $1 \times 2$ (가로 2 stride 2) 로 가격-거래량 짝 결합 → 40 → 20. 그 위에 $4 \times 1$ 커널 두 번 (세로 시간 방향 4틱) 으로 짧은 시간 패턴 추출.
2. **둘째 conv 블록**: 다시 $1 \times 2$ 로 bid-ask 결합 → 20 → 10. 동일 $4 \times 1$.
3. **셋째 conv 블록**: $1 \times 10$ 으로 10 레벨 전체를 통합 → 10 → 1. 동일 $4 \times 1$ × 2.
4. **Inception module**: 세 평행 가지 — ($1 \times 1$ + $3 \times 1$), ($1 \times 1$ + $5 \times 1$), MaxPool + $1 \times 1$ — 다중 시간 스케일을 한 번에 본다. 채널 차원에서 concat → 192 채널.
5. **LSTM(64)** + **FC(3)** + softmax 로 분류.

학습은 cross-entropy + Adam(lr=$10^{-4}$), 배치 64, 50 epoch. FI-2010 의 NoAuction DecPre normalisation 분할(처음 7일 train, 마지막 3일 test) 에서 PyTorch 구현 기준 **test accuracy 0.7535, macro F1 0.7533** (저자 공식 노트북 셀 20·22 직접 확인). 추가로 LSE 5종목 1년 tick 데이터에서 학습 종목과 미학습 종목 모두 안정적 예측 정확도 보고 → "universal features" 주장의 근거.

---

## 🔬 전문가 수준 (Contribution 압축)

본 논문의 **주장 가능한 4가지 기여**:

1. **LOB 의 conv 패러다임 정립 — 가격축 vs 시간축 분리 처리.** LOB 의 40-dim 입력에서 (가격-거래량)·(bid-ask)·(가격레벨 간) 의 위계를 명시적으로 풀어내는 conv 커널 설계(1×2 → 1×2 → 1×10) 를 제안. fully-connected baseline 이 모든 entry 를 동등 취급한 데 비해, LOB 의 *구조적 사전지식* 을 architecture 에 흡수.

2. **Inception 모듈로 다중 시간 스케일 동시 포착.** GoogLeNet 의 Inception 사상을 LOB 의 1-D 시간축에 이식 (3×1, 5×1, MaxPool 평행). 단일 RNN 의 fixed-horizon 한계와 단일 CNN 의 fixed-receptive-field 한계를 함께 우회.

3. **FI-2010 SOTA + 추가 horizon-wise 분석.** FI-2010 benchmark 의 5개 예측 horizon($k \in \{10, 20, 30, 50, 100\}$) 모두에서 동시기 baseline (Lin-SVM, MLP, CNN-I, B(TABL), LSTM, BoF/N-BoF, MCSDA) 대비 정확도·precision·recall·F1 모두 우위 (구체 수치는 본문 표 IV·V·VI·VII 추정, 본 해체는 본문 표 미접근으로 수치 단정 안 함).

4. **Universal features — out-of-sample transfer.** LSE 2017 한 종목 학습 → 학습에 없던 종목 test 에서도 정확도 유지. 이는 LOB 다이내믹스의 일부가 종목 무관 보편 패턴(예: spread imbalance, queue depletion) 임을 시사 — 단일 종목 specialist 모델 → universal LOB model 전환의 첫 실증.

**방어 가능한 이론적 기여**: limit. 본 논문은 architecture engineering paper 이며, 일반화 한계나 PAC-스타일 이론은 제시하지 않는다. 그 대신 **귀납적 편향 설계** 의 좋은 사례로서 이후 BDLOB(2018), DeepLOB-attention(Zhang 2021), Tran(2018), B(TABL) 계열로 이어지는 LOB DL 의 표준 비교축이 됐다.

**한계 (저자 명시 + 본 해체 추정)**:
- FI-2010 의 normalization (DecPre, ZScore, MinMax 중 DecPre 만 사용) 선택의 영향 미분석.
- 클래스 불균형 처리는 horizon $k$ 기준 보조 label 선택(`k=4`, $k=100$) 으로 우회. 실거래 시 transaction cost 가 결과를 어떻게 깎는지 미보고.
- LSE 실험은 5개 대형주만. mid·small-cap 의 sparse LOB 에서는 conv 의 가격축 가정이 깨질 가능성.
