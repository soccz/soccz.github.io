# 04_claims — 핵심 Claim 해체

**배경 사다리**: ① "주장(claim)" 은 논문이 독자에게 *증명·설득* 하려는 명제, ② 각 claim 은 증거(실험 표/그림/정리) 로 뒷받침되고 *숨은 전제* 위에 서 있다, ③ 무배경 독자가 보기에 claim 의 뜻과 그 한계를 분리해 이해할 수 있어야 한다.

DeepLOB 의 핵심 claim 4개를 차례로 해부한다.

---

## Claim 1 — "LOB 의 위계적 구조를 conv 커널 모양에 흡수하면, 작은 모델로도 raw 40-dim 입력에서 직접 학습할 수 있다"

### 주장 (한 문장)
LOB 의 (가격, 거래량) 짝, (bid, ask) 짝, 가격레벨 위계를 그대로 따라가는 conv 커널 설계 (1×2 → 1×2 → 1×10) 만으로 약 14만 파라미터의 작은 모델이 SVM/MLP/단일 CNN/단일 LSTM baseline 을 모두 능가한다.

### 증거
- **Source**: 모델 정의는 GitHub `jupyter_pytorch/run_train_pytorch.ipynb` cell 11 (`class deeplob`) 직접 확인. `summary` 출력(cell 13) 에 Total params **143,907** 명시.
- **Result**: FI-2010 NoAuction DecPre k=4 (label index, $k=100$ horizon 추정) PyTorch 노트북 실행 결과 **Test accuracy 0.7535, macro F1 0.7533** (cell 20, 22 직접 확인).
- 본문 표(저자 보고) 의 baseline 별 절대 수치는 본 해체에서 미확인. 단 abstract verbatim 에 "outperforms all existing state-of-the-art algorithms on the benchmark LOB dataset" 명시.

### 숨은 전제
1. **LOB 입력의 정렬 순서 (ask₁, vol_ask₁, bid₁, vol_bid₁, ask₂, …) 가 일관됨**. FI-2010 은 이 정렬이 표준화되어 있어 conv 커널이 의미를 가짐. 만약 다른 거래소가 (bid₁, ask₁, vol_bid₁, vol_ask₁, …) 순서로 인코딩하면 1×2 커널은 다른 짝을 결합하게 된다.
2. **고정 10 레벨**. 마지막 conv 의 $1 \times 10$ 은 정확히 10 레벨을 가정. LSE 데이터의 가용 레벨 수가 시점마다 변하면 zero-padding 또는 truncation 이 필요.
3. **정규화 선택의 무관성**. NoAuction DecPre 사용. ZScore 나 MinMax 변형 시 결과 변화는 본문 미확인.

### 쉬운 말 풀이
"호가창은 사실 처음부터 규칙이 있는 표였다. 어떤 칸이 가격이고 어떤 칸이 수량인지, 어떤 줄이 사겠다는 사람이고 어떤 줄이 팔겠다는 사람인지 정해져 있다. 모델한테 이 규칙을 직접 알려 주려면? 칸 모양을 알려 주면 된다. 가로 2칸씩 합치는 도장(1×2 커널) 을 찍으면 모델은 '아, 이 두 칸이 짝이구나' 를 자동으로 안다. 이걸 세 번 차근차근 하니까, 모델이 처음부터 표를 해석하느라 힘 빼지 않고 진짜 어려운 일 — 미래 가격 예측 — 에만 집중할 수 있게 된다."

---

## Claim 2 — "Inception 모듈이 LOB 시간축의 다중 스케일 의존을 단일 CNN/LSTM 보다 효율적으로 포착한다"

### 주장 (한 문장)
LSTM 직전에 ($1 \times 1, 3 \times 1$), ($1 \times 1, 5 \times 1$), MaxPool + ($1 \times 1$) 의 세 평행 가지를 concat 한 Inception 블록을 두면, 단일 시간 receptive field 만 가지는 CNN/LSTM 대비 짧고 긴 시간 패턴을 동시에 잡는다.

### 증거
- **Source**: notebook cell 11, Inception 모듈 `self.inp1, inp2, inp3` 정의 직접 확인.
- Inception 출력 후 concat 차원 = 64 × 3 = **192 채널** → LSTM input_size=192 일치. 이것이 코드 일관성으로 검증됨.
- 본문 ablation 표 (Inception 유무 비교) 는 미확인.

### 숨은 전제
1. **GoogLeNet 의 multi-branch 사상이 1-D 시간축에서도 동등 효과**. 영상 vision 의 multi-scale 사상이 시계열에서도 작동한다는 가정. 직관적으로 그럴듯하지만, 1-D 에서는 dilated conv 가 더 자연스러운 대안이라는 비판이 있다 (WaveNet 류).
2. **3-tick 과 5-tick 의 선택이 LOB 다이내믹스에 적합**. LOB 의 평균 inter-tick 시간이 거래소·종목별로 다르므로 5-tick 의 실시간 의미가 달라진다.
3. **MaxPool 브랜치의 보조 역할이 의미 있다**. 이는 Inception 의 원래 모티프로, 모델이 "강한 신호를 통과시키는 우회 경로" 를 갖도록 보장.

### 쉬운 말 풀이
"한 가지 시간 단위로만 보면 놓치는 게 있다. 어떤 패턴은 3-tick 만에 끝나고, 어떤 패턴은 5-tick 에 걸쳐 천천히 펼쳐진다. Inception 모듈은 망원경 세 개를 동시에 들이대 — 짧은 거 (3-tick), 좀 더 긴 거 (5-tick), 그리고 '최댓값만 통과시키는 필터' (MaxPool) — 그 결과를 모두 합쳐서 다음 층에 넘긴다. 이렇게 하면 모델이 'spike 적인 짧은 신호' 와 'gradual 한 긴 신호' 를 모두 본다."

---

## Claim 3 — "LSTM(64) 추가는 conv 만으로 잡지 못하는 100-tick 이상의 잔여 장기 의존을 처리한다"

### 주장 (한 문장)
Inception 출력 시퀀스(시간축 82 잔존) 를 단일 LSTM 레이어(hidden 64) 가 받아 시간 마지막 hidden state 를 FC(3) + softmax 에 전달, conv 만으로 부족한 시간 의존을 보강한다.

### 증거
- **Source**: notebook cell 11 LSTM 정의 (`nn.LSTM(input_size=192, hidden_size=64, num_layers=1, batch_first=True)`).
- forward 에서 `x = x[:, -1, :]` 로 시간축 마지막만 사용 → many-to-one. 학습 가능 LSTM 파라미터 = 66,048 (`summary` cell 13).
- LSTM 유무 ablation 표는 본문 미확인. 본 해체는 architecture choice 로만 주장 — 효과량 미주장.

### 숨은 전제
1. **마지막 hidden 만으로 충분**. attention/pooling 없이 마지막만 사용. 만약 중요 신호가 시간축 중간에 있으면 손실 가능. LSTM 의 forget gate 가 이를 보존한다고 가정.
2. **단층 LSTM 으로 충분**. 더 깊은 RNN 이 더 좋을지 미실험.
3. **bidirectional 불필요**. inference 시 미래를 모르므로 단방향. 학습 시점에서도 단방향. (이는 라벨이 미래에 결정되는 supervised 의 자연스러운 선택.)

### 쉬운 말 풀이
"앞에서 망원경(Inception) 으로 본 단기·중기 패턴들을 시간 순서로 한 줄에 쭉 늘어놓고, 마지막에 '오늘까지 본 걸 한 줄 메모로 압축' 하는 단계가 LSTM 이다. 메모(hidden state) 가 64자 까지 적힌다. 마지막 시점에 적힌 메모만 보고 다음을 예측한다. conv 가 1초·3초 짜리 짧은 패턴을 봤다면 LSTM 은 '그래서 종합하면 지금 분위기는?' 을 적는다."

---

## Claim 4 — "DeepLOB 는 LOB 의 'universal features' 를 학습한다 — 학습에 없던 종목에서도 정확도 유지"

### 주장 (한 문장)
LSE 2017 데이터의 일부 종목으로 학습한 모델이, 학습에 등장하지 않은 종목에 대해서도 안정적 out-of-sample 예측 정확도를 보인다 — LOB 의 일부 다이내믹스가 종목 무관 보편 패턴임을 시사한다.

### 증거
- **Source**: abstract verbatim ("The model translates well to instruments which were not part of the training set, indicating the model's ability to extract universal features").
- LSE 데이터: Lloyds Bank, Barclays, Tesco, BT, Vodafone (1년, 2017-01-03 ~ 2017-12-24), 테스트 기간 3개월 (WebSearch 확인).
- 종목별 absolute accuracy / sample-out-of-sample 비교 표는 본문 §VI(추정) — 본 해체 미확인. 본 해체는 "universal features 주장의 실증" 까지만 인정하고 효과량 미주장.

### 숨은 전제
1. **5종목이 LSE 의 다양성을 대표한다**. 모두 FTSE 100 대형주. mid·small-cap 의 sparse LOB 에서는 transfer 실패 가능.
2. **2017년 시장 regime 의 단일성**. 1년 안에서는 macro 환경이 비교적 안정 — Brexit/금리 충격 후. 다른 regime (예: 2008 위기, 2020 코로나) 에서는 transfer 결과가 다를 가능성.
3. **종목 간 normalisation 의 합리성**. DecPre 가 종목별 가격 스케일 차이를 흡수한다고 가정. 절대가격이 매우 다른 종목 간 transfer 가능성의 기술적 토대.

### 쉬운 말 풀이
"호가창의 일부 변화 패턴은 어느 회사 주식이든 비슷하다는 가설이다. 예를 들어 '매수 쪽 잔량이 5초 동안 매도 쪽보다 두 배 이상 많아지면 가격이 올라가는 경향' 같은 패턴. 이런 게 사실이라면, 한 회사로 학습한 모델이 다른 회사에서도 작동해야 한다. DeepLOB 는 그게 실제로 작동한다고 보여 줬다. 단, 모든 회사가 아니라 — 비슷한 종류의 (대형주) 회사들 사이에서. 다른 종류 (잡주, 신흥시장) 에서는 별도 검증이 필요하다."

---

## Claim 간 의존도

- Claim 1 (conv 위계) + Claim 2 (Inception 다중 스케일) + Claim 3 (LSTM 장기) = architecture 의 세 기둥. 모두 ablation 으로 분해 가능해야 하지만 본문 ablation 표 미확인.
- Claim 4 (universal) 는 Claim 1~3 의 architecture 가 *spurious correlation* 이 아닌 *진짜 LOB 패턴* 을 학습한다는 간접 증거.
