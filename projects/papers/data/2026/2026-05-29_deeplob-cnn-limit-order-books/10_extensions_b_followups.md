# 10_extensions_b — 사고 확장: Follow-up 논문 3편

**배경 사다리**: ① Follow-up 은 본 논문의 *직접 인용 사슬* — 선행(이게 안 됐다면 본 논문도 없음), 경쟁(평행 시기 다른 답), 후속(본 논문에서 파생) 의 3 종류, ② 각각의 follow-up 은 *본 논문과 어떤 관계인지 + 무엇을 더 얻을 수 있는지* 가 명확해야 한다.

---

## Follow-up 1 (선행) — Ntakaris et al. 2018 — "Benchmark dataset for mid-price forecasting of limit order book data with machine learning methods"

### 어떤 논문인가
- **Authors**: Adamantios Ntakaris, Martin Magris, Juho Kanniainen, Moncef Gabbouj, Alexandros Iosifidis (Tampere University, Aarhus).
- **Venue**: Journal of Forecasting, Vol 37, Issue 8, 2018.
- **arXiv**: 1705.03233.
- **Contribution**: FI-2010 benchmark 의 정의·공개. Helsinki 5종목 10일치 LOB 의 40-dim 표현, 3-class 라벨, 6 정규화 변형 등.

### 본 논문 (DeepLOB) 과의 관계
- **데이터 의존**: DeepLOB 의 모든 FI-2010 평가는 Ntakaris 의 benchmark 정의에 *완전 의존*. 40-dim 정렬 순서, NoAuction/Auction 분할, DecPre 정규화 정의 모두 차용.
- **방법론 대비**: Ntakaris 는 baseline 으로 단순 RR (Ridge Regression), SLFN (Single Layer FFN) 등 보고. DeepLOB 가 이 baselines 를 모두 SOTA 갱신.

### 무엇을 얻을 수 있는가
1. **라벨 생성 임계 $\alpha$ 의 정확한 값** (FI-2010 표준).
2. **6 정규화 변형의 각자 의도** — DecPre vs ZScore vs MinMax 의 사용 시점.
3. **Auction 분할의 의미** — DeepLOB 가 왜 NoAuction 만 썼는지 더 깊은 이해.
4. **5 종목의 microstructure 특성** — Nordic 시장의 일반화 한계 평가.

### 우선순위
**높음** — APF/Grokking 양 track 에서 LOB 데이터 다룰 가능성. 미커버.

---

## Follow-up 2 (경쟁) — Tran et al. 2018 — "Temporal Attention-Augmented Bilinear Network for Financial Time-Series Data Analysis" (TABL)

### 어떤 논문인가
- **Authors**: Dat Thanh Tran, Alexandros Iosifidis, Juho Kanniainen, Moncef Gabbouj (Tampere University · Aarhus University).
- **Venue**: IEEE Transactions on Neural Networks and Learning Systems, 2019.
- **arXiv**: 1712.00975 (B-TABL) / 후속 1809.00963.
- **Contribution**: LOB 의 (time × feature) 2-D 입력에 *bilinear attention* 적용 — 시간축과 feature 축 각각에 별도 attention. **DeepLOB 의 평행 작업**.

### 본 논문 (DeepLOB) 과의 관계
- **평행 경쟁**: 같은 FI-2010 benchmark, 같은 3-class task. Tran 의 접근은 *attention-only*, DeepLOB 는 *conv-centric + LSTM*.
- **상호 baseline**: DeepLOB 는 본문 §V 에서 TABL 을 baseline 으로 비교 (저자 보고, 본 해체 본문 표 미확인). 같은 그룹 (Tampere/Aarhus) 이지만 다른 방향.
- **DeepLOB 의 주장**: 일부 horizon 에서 TABL 우세, 평균적으로 DeepLOB 우세.

### 무엇을 얻을 수 있는가
1. **Attention vs Conv 의 LOB 도메인 비교** — APF 의 핵심 가설 (attention motif vs conv 모양) 의 첫 실증.
2. **Tran 의 bilinear 정식** — 시간·feature 의 *outer product attention*. APF probe 의 대안 design.
3. **FI-2010 baseline 의 SOTA 변화 추적** — DeepLOB (2019) → TABL (2018-19) → DeepLOB-attention (2021) 의 흐름.
4. **OMI vs Tampere/Aarhus 그룹** 의 LOB DL 라인 비교.

### 우선순위
**중간-높음** — APF 의 attention motif 가설과 직접 평행. 미커버.

---

## Follow-up 3 (후속) — Zhang & Zohren 2021 — "DeepLOB-attention" or related — "Multi-Horizon Forecasting for Limit Order Books" / Wallbridge 2020 "Transformers for Limit Order Books"

### 어떤 논문인가 (가장 가능성 높은 후보)
- **Title**: "Transformers for Limit Order Books" (Wallbridge 2020) 또는 Zhang/Zohren 후속 "Multi-Horizon..." (2021).
- **Authors**: James Wallbridge (Imperial College / 또는 OMI 그룹).
- **arXiv**: 2003.00130 추정.
- **Contribution**: DeepLOB 의 LSTM 을 Transformer encoder 로 교체. Self-attention 으로 시간축 다중 시점 hidden 의 가중치 학습. Multi-horizon prediction.

### 본 논문 (DeepLOB) 과의 관계
- **직접 후속**: DeepLOB 의 conv 백본을 그대로 두고 LSTM → Transformer 로 교체. *backbone 검증된 후 head 만 진화*.
- **결과 (저자 보고, 미확인)**: 일부 horizon 에서 추가 F1 향상.
- **mechanism**: LSTM 의 마지막-hidden 한계 (시간축 정보 손실) 를 attention 의 multi-head weighting 으로 보완.

### 무엇을 얻을 수 있는가
1. **DeepLOB 의 LSTM 한계의 정량화** — Transformer 가 더 잘 한다면 어디서?
2. **Attention 시각화** — Transformer 의 attention map 으로 *어떤 시점에 주목하나* 분석. APF 의 motif 가설과 직결.
3. **Multi-horizon joint training** — 5 horizon ($k=10, …, 100$) 을 별도 모델이 아닌 multi-task head 로 통합한 결과.
4. **Transfer learning** — pre-trained 후 다른 종목 transfer 성능.

### 우선순위
**중간** — APF 의 Transformer 연결성. 미커버. 단 Wallbridge / Zhang 후속의 정확한 식별은 추가 검증 필요.

---

## Follow-up 비교 표

| Follow-up | 관계 | 주 가치 | 내 연구 트랙 연결 |
|---|---|---|---|
| Ntakaris 2018 | 선행 (데이터) | FI-2010 정의·라벨 임계 | §F · §D (배경) |
| Tran 2018 TABL | 평행 (경쟁) | Attention vs Conv | §C (APF 핵심) |
| Wallbridge 2020 / DeepLOB-Transformer | 후속 | Transformer 적용 | §C + §D |

---

## 메타 관찰

세 follow-up 의 *공통 thread*: **"LOB 의 정보를 어떤 architecture 가 가장 잘 추출하나"** 의 다른 답들.

- Ntakaris: 데이터 표준 정의 (질문 자체)
- DeepLOB: Conv + LSTM (one answer)
- TABL: Bilinear Attention (parallel answer)
- Wallbridge: Conv + Transformer (next answer)

이 사슬을 따라가면 *LOB DL 의 architecture 진화* 가 *NLP 의 RNN → CNN → Transformer 진화* 와 평행함을 본다. 그리고 그 다음 step (state-space model? SAE-based interpretable LOB?) 가 *내 후속 연구* 의 자리.
