# 06_experiments — 실험 해부

**배경 사다리**: ① **FI-2010** 은 Helsinki 5개 Nordic stock 의 LOB 10일치 공개 benchmark, ② 평가 지표는 일반적인 accuracy / precision / recall / F1 의 3-class macro, ③ "out-of-sample" 은 학습에 보지 않은 데이터 (시간 또는 종목) 에 대한 일반화 — 이 셋만 알면 충분.

---

## 1. 데이터셋 1 — FI-2010

### 어떤 데이터인가?
- **출처**: Ntakaris et al. 2018, "Benchmark dataset for mid-price forecasting of limit order book data with machine learning methods", Journal of Forecasting 37(8).
- **구성**: 5개 Nordic 종목 (KESBV, OUT1V, SAMPO, RTRKS, WRT1V) × 10 거래일 (2010-06-01 ~ 2010-06-14) × continuous trading 만.
- **공개**: Tampere University FAIRDATA 인덱스 (etsin.fairdata.fi/dataset/73eb48d7-4dbc-4a10-a52a-da745b47a649) + DeepLOB 저자가 `data.zip` 으로 raw.githubusercontent 에 mirror.
- **정규화 변형**: Auction/NoAuction × DecPre/ZScore/MinMax = 6 가지. DeepLOB 는 **NoAuction + DecPre** 사용.

### 왜 이 데이터가 DeepLOB 의 주장에 적합한가?
- **3-class 라벨이 사전 계산되어 있음** → 다양한 모델 직접 비교 용이.
- **표준 train/test split** 이 명시 (앞 7일 train, 뒤 3일 test) → 재현성.
- **40-dim LOB 표현이 DeepLOB 의 conv 커널 모양과 정확히 일치**.

### 숨은 편향
- **2010 년 데이터** — 이미 15년 이상 됨. HFT 환경, tick size, market microstructure 규제 변화로 실시간 적용 시 차이 큼.
- **Nordic 시장만** — 미국 NASDAQ/NYSE, 아시아 시장의 LOB 다이내믹스와 다를 가능성.
- **5종목 = small N** — 종목 다양성 부족. 종목별 특수성이 보편 패턴으로 잘못 일반화될 위험.
- **continuous trading 만** → opening/closing auction, halt 이후 reopen 같은 흥미로운 regime 배제.

---

## 2. 데이터셋 2 — LSE 2017

### 어떤 데이터인가?
- **출처**: London Stock Exchange 제공 raw LOB tick data (비공개, 저자 OMI 가 industry partner 통해 접근).
- **종목**: Lloyds Bank, Barclays, Tesco, BT, Vodafone — 모두 **FTSE 100 대형주**.
- **기간**: 2017-01-03 ~ 2017-12-24 (약 1년).
- **테스트 기간**: 3개월 (어느 3개월인지 본문 §VI 추정, 직접 미확인).

### 왜 이 데이터인가?
- **Universal features 주장 검증** — 한 종목으로 학습 → 다른 종목 test 의 transfer 가능성.
- **장기 안정성 확인** — 1년 span 으로 regime drift 효과 확인 가능.
- **현대적 데이터** (FI-2010 의 2010 → LSE 의 2017) — modern HFT 환경에서도 작동하는지.

### 숨은 편향
- **5종목 모두 FTSE 100 대형주** — high liquidity, narrow spread. mid/small-cap (sparse LOB) 대응 미확인.
- **2017년은 LSE 의 비교적 안정 regime** — Brexit 직후이긴 하나 큰 충격 없는 해. 2020 COVID, 2022 우크라이나·LDI 위기 같은 격변 미반영.
- **종목 5개의 sector 편향** — Lloyds/Barclays(은행) 2개, Tesco(소매), BT/Vodafone(통신) 2개. 에너지·산업·기술 미포함.

---

## 3. 베이스라인 공정성

### Baselines (저자 보고, 본 해체 본문 표 미확인)
abstract 와 검색 결과에서 언급된 baselines:
- **Lin-SVM** — Linear SVM (Kercheval 2015 핸드크래프트 feature)
- **MLP** — fully-connected baseline
- **CNN-I** — Tsantekidis 2017 단일 1-D CNN
- **B(TABL)** — Tran 2018 bilinear temporal attention
- **LSTM** — vanilla single-layer LSTM
- **BoF / N-BoF** — Bag-of-Features / Normalized BoF (codebook 기반)
- **MCSDA** — Multi-Channel Stacked Denoising Autoencoder

### 공정성 평가
- **데이터 동일** (FI-2010 NoAuction DecPre 표준 분할) — 공정.
- **튜닝 강도**: baselines 의 hyperparameter tuning 가 동등한지 본문 §V 보고 추정 — 직접 미확인. 일반적으로 self-baseline (저자가 자신 방법과 비교) 은 baselines 가 under-tuned 경향 있음 (selection bias). 본 해체는 보고된 우열만 인정하고 효과량은 본문 표 미확인.

### 베이스라인이 진짜 동등하게 튜닝됐는가?
- baselines 의 architecture 가 저자 본래 보고 그대로 구현됐는지, 아니면 reimplementation 인지 본문에 확인 필요. 보통 reimplementation 은 약간 underperform — DeepLOB 의 SOTA 차이를 부풀릴 가능성.

---

## 4. 지표 선택

### Accuracy / Precision / Recall / F1 의 의미
- **Accuracy**: 전체 정답 비율. 3-class 의 chance level 은 33%.
- **Precision (class c)**: 모델이 c 라 예측한 것 중 실제 c 인 비율.
- **Recall (class c)**: 실제 c 인 것 중 모델이 c 라 맞춘 비율.
- **F1**: $2 \cdot \frac{P \cdot R}{P + R}$. P 와 R 의 조화 평균.
- **Macro F1**: class 별 F1 의 단순 평균. class 불균형에 강건.

### 다른 지표라면?
- **MCC (Matthews Correlation Coefficient)**: class 불균형에 더 강건. 본문 미사용.
- **AUC**: 2-class 본질이라 3-class 에는 OvR/OvO 변형 필요. 보고 안 됨.
- **거래 수익률 (Sharpe, Sortino)**: 학술 ML 지표가 아닌 *실무* 지표. backtesting 단계가 필요한데 DeepLOB 는 거기까지 가지 않음 — *"분류 성능 ≠ 거래 수익"* 의 간극이 본 논문의 가장 큰 한계.

### 지표 선택이 결론을 바꿨을까?
- accuracy, F1, precision, recall 모두 비슷한 방향. → "DeepLOB 가 baselines 보다 우수" 의 결론은 강건 추정.
- 단, **PnL backtest** 추가 시 결과가 같을지는 별개. transaction cost, market impact, latency 가 분류 정확도와 수익을 분리한다.

---

## 5. 주요 결과 — 직접 검증된 수치

### FI-2010 NoAuction DecPre, $k=100$ horizon
저자 공식 PyTorch 노트북 (cell 17, 20, 22) 실행 결과 (2021-07-14 환경):

**학습 곡선** (notebook cell 17):
- Epoch 1 train loss 0.918 / val loss 1.079 → Epoch 8 train 0.737 / val 0.871 (best 진입)
- Epoch 14 val 0.870 (best, 이후 36 epoch 동안 개선 없음)
- 결국 train loss 는 계속 감소하나 val loss plateau → 약한 overfitting 발생 (early stopping 권장).

**최종 결과** (notebook cell 20 직접 출력):
> Test acc: **0.7535**

**Classification Report** (notebook cell 22 직접 출력):
| Class (0=down, 1=stationary, 2=up) | Precision | Recall | F1 | Support |
|---|---|---|---|---|
| 0 (down) | 0.7341 | 0.7524 | 0.7431 | 47,915 |
| 1 (stationary) | **0.8074** | 0.7622 | **0.7841** | 48,050 |
| 2 (up) | 0.7204 | 0.7451 | 0.7325 | 43,523 |
| macro avg | 0.7540 | 0.7532 | 0.7533 | 139,488 |
| weighted avg | 0.7551 | 0.7535 | 0.7540 | 139,488 |

### 해석
- **Stationary class 가 가장 잘 잡힘** (F1 0.7841). 이는 dataset 의 class 분포 + $\alpha$ 임계 설정상 stationary 가 가장 "안전한" 예측이기 때문 — 모델이 불확실하면 stationary 로 fallback 하는 경향.
- **Down 과 up 의 F1 비대칭** (down 0.7431 vs up 0.7325). down 이 약간 더 잘 잡힘. 시장의 *비대칭* (panic selling 의 신호가 더 뚜렷) 또는 데이터 우연.
- **Recall 이 Precision 보다 약간 낮은 class 들**: stationary recall 0.7622 < precision 0.8074. → 모델이 stationary 인데 up/down 으로 잘못 예측하는 경우 (false negative) 가 stationary 라고 잘못 예측하는 경우 (false positive) 보다 더 많음.

### 본문 보고 vs 노트북 결과
본문 §V 에는 다른 horizon (k=10, 20, 30, 50, 100) 에서의 표 IV·V·VI 가 있을 것으로 추정 — 본 해체는 본문 표 미접근으로 정확 수치는 단정 안 함. 단 abstract 의 "outperforms all existing state-of-the-art" 와 노트북의 ~75% 가 일관.

---

## 6. Ablation: 저자가 일부러 넣은 것과 숨긴 것

### 일부러 넣었을 것 (추정)
- **Inception 유무 비교** — 저자 같은 그룹 후속 논문 (BDLOB 2018, Sirignano-Cont 평행) 의 흐름상 본문 §V-D 추정에 ablation 표가 있을 가능성 高.
- **LSTM 유무** — Inception 만으로 충분한지.
- **Conv block 1/2/3 의 한 단계 제거** 시 성능 변화.

### 숨겼을 가능성
- **다른 정규화 (ZScore, MinMax) 결과** — 본문 보고 안 했다면 결과가 비슷하거나 약간 떨어졌을 가능성.
- **다른 horizon $k$ 의 모델 별도 학습 비용** — 5개 horizon 각각 별도 모델? 아니면 multi-task head?
- **Hyperparameter sensitivity** — Adam 의 lr, batch size, T(lookback) 변화 시 결과.

---

## 7. 부록에 숨은 신호 (추정)

본문 §VI 또는 Appendix 에 LSE 실험의 종목별 (Lloyds → Barclays, Tesco → BT 같은 cross-instrument) confusion matrix 가 있을 가능성. 본 해체 미접근.

---

## 8. 수치 투명성

원문 본문 §V 의 표 IV·V·VI·VII (5 horizon × 8 baseline × 4 metric = 약 160 entry) 의 절대 수치는 본 해체에서 확인 불가. 단 노트북 단일 실행 결과 (k=100, accuracy 0.7535, macro F1 0.7533) 만 직접 검증. 그 외 수치 단정은 모두 회피한다.

---

## 9. 한 줄 요약

> **DeepLOB 는 FI-2010 NoAuction DecPre 표준 분할에서 horizon k=100 의 3-class 분류를 75.35% accuracy / macro F1 0.7533 으로 처리하고 (저자 공식 PyTorch 노트북 직접 검증), 학습은 14 epoch 만에 사실상 수렴하며, stationary class 의 precision 0.81 이 가장 높고 stationary class 의 recall 이 가장 낮은 비대칭이 나타난다.**
