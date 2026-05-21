# 08_lineage — 이론적 계보

## 📌 이 챕터 다 읽으면 알 수 있는 것

- MASTER 의 이론적 조상 3계열 (ALSTM, GAT, DTML)
- 평행 연구 2계열 (FinGPT/LLM, FinMamba)
- 예측 후손 2가지 + 실제 후속 (FinMamba 2025)
- Stock Transformer literature 의 3 세대 진화
- 외생 조건부 게이팅의 다른 분야 (TFT) 와의 연결

---

> **배경 사다리**: ① **그래프 신경망(GNN)** = 노드(예: 종목) 와 엣지(예: 상관관계) 로 이루어진 그래프 구조 데이터를 처리하는 신경망. ② **Attention over sequences** = 시퀀스의 각 원소가 다른 원소들에 가중치를 두는 메커니즘. ③ **Factor investing** = 주식 수익률을 설명하는 공통 요인 (팩터) 을 찾아 포트폴리오를 구성하는 투자 전략. ④ **Exogenous conditioning** = 외부 정보 (예: 시장 지수) 를 모델 입력 또는 게이팅에 활용. ⑤ **State Space Model (SSM)** = 선형 시간 복잡도로 시퀀스를 처리하는 모델 (Mamba 등). 이 다섯 개념을 알면 계보의 흐름을 따라갈 수 있다.

### 🌱 학술 계보 — 일상 비유

MASTER 의 academic family tree:

```
      [ALSTM 2019]                    [GAT 2020]
   (LSTM + attention)              (그래프 어텐션)
   "한 종목 시간"                    "종목간 그래프"
        │                                │
        └──────────┬─────────────────────┘
                   │
              [DTML 2022]                [TFT 2021]
        (Dynamic, multi-relation)     (Variable selection)
        "동적 그래프"                  "외생 입력 게이팅"
                   │                       │
                   └───────────┬───────────┘
                               │
                          [MASTER 2024]
                  (Market-guided + Intra-Inter)
                  "Cross-time + Market gating"
                               │
                               ▼
                       [FinMamba 2025]
                  (Mamba + Graph + US/CN)
```

→ MASTER 는 **stock prediction transformer** 진화의 3세대 (cross-time 인식 + 외생 게이팅) 의 대표 모델.

---

## 1. 이론적 조상

### 1.1 조상 1: ALSTM — Attention LSTM (2019)

**무엇이었나**: LSTM 에 attention 메커니즘을 결합해 단일 종목의 시간 패턴을 모델링.

**구조**:
```
종목 1 의 X[t=1..T] → LSTM → hidden h[t] → temporal attention → 예측
종목 2 의 X[t=1..T] → LSTM → ...
... (각 종목 독립)
```

**MASTER 와의 연결선**:
- ALSTM 이 **"단일 종목 내 시간 주의"** 를 열었음
- MASTER 는 이를 **multi-head transformer attention** 으로 교체
- 종목 간 차원 추가 (ALSTM 에 없음)

**ALSTM 이 MASTER 에 남긴 것**: 단일 종목의 시간 표현 추출 → MASTER 의 **intra-stock aggregation 블록의 직접 전신**.

### 🎯 구체 영향

| 항목 | ALSTM | MASTER |
|------|-------|--------|
| 시간 인코더 | LSTM (순차) | Multi-head self-attention (병렬) |
| 시간 attention | LSTM 위 추가 layer | self-attention 자체가 attention |
| 종목간 모델링 | X | ✓ (inter-stock) |
| Cross-time | X | ✓ (relay) |
| 외생 입력 | X | ✓ (market gating) |

### 1.2 조상 2: GAT for Stock (2020–2022 계열)

**무엇이었나**: Graph Attention Network 를 주식 예측에 적용한 여러 연구. 종목을 노드, 상관관계를 엣지로 모델링.

**대표 모델**:
- RSR (Relational Stock Ranking, 2019): 산업 분류 기반 그래프
- HATS (Hierarchical Attention for Stock, 2020): 계층 그래프
- AD-GAT (2021): Adaptive Dynamic GAT

**구조**:
```
종목 1: X[t=1..T] → LSTM → 표현 v_1 ─┐
종목 2: X[t=1..T] → LSTM → 표현 v_2 ─┤
종목 3: X[t=1..T] → LSTM → 표현 v_3 ─┼→ GAT → 갱신된 표현
...                                   ┘
                                  (사전 그래프 또는 학습 그래프)
```

**MASTER 와의 연결선**:
- GAT 이 **"종목 간 어텐션 메커니즘"** 도입
- MASTER 의 **inter-stock aggregation 블록의 직계 조상**

**GAT 의 한계 (MASTER 가 극복)**:
- **(a) 사전 그래프 의존**: 산업 분류 등 사전 정의된 엣지
- **(b) Time-aligned 상관만**: 같은 시각의 표현끼리만 어텐션
- **(c) Symmetric edge**: 양방향 동등 → leader-follower 비대칭 못 잡음

### 🎯 구체 영향

| 항목 | GAT | MASTER |
|------|-----|--------|
| 종목간 attention | ✓ | ✓ |
| 그래프 구조 | 사전 정의 + 일부 학습 | 완전 학습 |
| 시차 효과 | X (time-aligned) | ✓ (cross-time relay) |
| 비대칭 | X (보통) | ✓ |

### 1.3 조상 3: DTML — Dynamic Temporal Multi-relational Learning (2022–2023)

**무엇이었나**: MASTER 가 직접 비교하고 이기는 당시 최고 성능 모델. 다중 관계 유형 (산업, 공급망, 지수 소속) 을 동시에 모델링 + 시간에 따라 그래프 구조 동적 업데이트.

**개선점**:
- 동적 그래프 (시간 따라 엣지 변화)
- Multi-relational (산업, 공급망, 지수 등 여러 관계 동시)
- Asymmetric attention (방향성 ✓)

**MASTER 와의 연결선**:
- DTML 이 **"종목 간 상관의 동적 모델링"** 중요성 입증
- MASTER 는 DTML 의 **multi-relation 을 제거** 하는 대신, 더 유연한 어텐션 구조 + cross-time 모델링 + 시장 유도 게이팅으로 대체

**MASTER 가 DTML 을 능가하는 이유**:
- DTML 도 여전히 **time-aligned** 가정
- 시장 국면 변화에 따른 특징 유효성 변화 모델링 X
- MASTER 가 이 두 gap 을 동시 해결

### 🎯 구체 영향

| 항목 | DTML | MASTER |
|------|------|--------|
| 동적 그래프 | ✓ | ✓ (학습) |
| Multi-relational | ✓ (명시적) | X (단일 학습 graph) |
| Asymmetric | ✓ | ✓ |
| Cross-time | X | ✓ |
| 시장 국면 게이팅 | X | ✓ |

### 1.4 조상 4 (개념적): TFT — Temporal Fusion Transformer (2021)

**무엇이었나**: Google 의 multi-horizon forecasting 모델. **Variable Selection Network (VSN)** 으로 외생 변수 (covariates) 의 중요도 동적 선택.

**MASTER 와의 개념적 연결**:
- TFT 의 VSN ↔ MASTER 의 시장 유도 게이팅
- 둘 다 **외생 정보로 특징 가중치 동적 조절**
- TFT 는 univariate forecasting, MASTER 는 cross-sectional stock prediction

**TFT 가 MASTER 에 남긴 것**: 외생 조건부 (exogenous conditioning) 입력을 모델에 통합하는 패턴 → MASTER 의 게이팅 design 의 개념적 inspiration.

### 🔑 핵심 통찰

> MASTER 는 4 조상의 결합: **ALSTM (intra) + GAT (inter) + DTML (동적, 비대칭) + TFT (외생 게이팅)**. 각 조상의 강점을 통합 + cross-time relay 라는 새 design 추가.

---

## 2. 평행 연구 (Parallel Research)

### 2.1 평행 1: FinGPT / LLM for Financial Forecasting (2023–2024)

**무엇**: LLM (GPT, BERT, FinBERT 등) 을 금융 예측에 적용. 뉴스 텍스트·공시 정보를 인코딩해 주가 예측에 활용.

**대표 모델**:
- FinGPT (2023): GPT 기반 금융 도메인 fine-tuning
- BloombergGPT (2023): Bloomberg 데이터 기반
- FinBERT (2019, 다양한 후속): 금융 sentiment 분류

**왜 MASTER 와 다른가**:
- **입력 데이터 종류**: MASTER = 가격·거래량 기반 Alpha158 팩터. LLM = 텍스트.
- **시간 척도**: MASTER = 5일 후 예측. LLM = 이벤트 기반 단기 (1-3일).
- **해석 가능성**: MASTER = attention map 시각화. LLM = 텍스트 추론.

**어떤 영역에서 LLM 이 더 나은가**:
- 실적 발표 후속 가격 효과
- 공시 (M&A, 신제품 출시) 단기 반응
- 뉴스 sentiment 기반 단기 트레이딩
- 비정형 정보 (소문, 시장 분위기)

**어떤 영역에서 MASTER 가 더 나은가**:
- 시계열 패턴 기반 systematic 예측
- 고빈도 (daily) cross-sectional ranking
- 대규모 종목 풀 (300+ 종목) 처리
- Quant 운용

**상호 보완성**: 실무에서 앙상블 가능. MASTER 의 systematic 신호 + LLM 의 이벤트 신호.

### 2.2 평행 2: FinMamba — Market-Aware Graph Enhanced Multi-Level Mamba (2025, arXiv:2502.06707)

**무엇**: MASTER 의 접근을 **Mamba (SSM 계열)** 와 **그래프 신경망**으로 확장한 후속/경쟁 연구.

**개선점**:
- **Mamba**: $O(N)$ 선형 복잡도 → MASTER 의 $O(N^2)$ attention 보다 효율적
- **US + CN 양 시장 검증**: MASTER 의 단일 시장 한계 극복
- **인터-스톡 상관관계를 동적 그래프로** 모델링

**왜 MASTER 와 다른가**:
- **계산 효율**: Mamba 선형 복잡도 → 더 큰 $N$ 또는 더 긴 $T$ 처리 가능
- **그래프 vs Attention**: 명시적 그래프 구조 vs 학습된 attention
- **해석 가능성 trade-off**: Mamba 는 attention map 시각화 어려움

**🎯 구체 영향**: FinMamba 가 MASTER 를 baseline 으로 사용 (검색 스니펫 추정) → MASTER 가 **standard reference** 가 됨.

### 2.3 평행 3: 후속 stock transformer 연구

다른 평행 연구 (학계 흐름):
- **STHGCN (2024)**: Spatio-Temporal Hyper-Graph CNN
- **MQAttention (2024)**: Multi-Query attention for stocks
- **StockMamba (2024)**: Mamba 변형 for stocks
- **GraphTransformer (다양한 후속)**: Graph + Transformer hybrid

**공통 트렌드**:
- Cross-time 모델링 강조 (MASTER 의 영향)
- Multi-modal 입력 (가격 + 뉴스)
- 효율성 강조 (Mamba, sparse attention)

---

## 3. 후손 예측 및 실제 후속

### 3.1 예측된 후손 1: 종목별 게이팅 + 섹터 인식 MASTER

**예측**: 현재 단일 게이팅 $g$ 를 모든 종목에 적용하는 한계를 극복하기 위해, 각 종목의 섹터·특성에 따라 **다른 게이팅 계수 적용** 하는 연구 자연스럽게 파생.

**가능한 구조**:
```
m_τ → W_g → ℓ (158 차원)
       ↓
종목별 임베딩 e_n → W_n → ℓ_n (158 차원, 종목별 조정)
       ↓
g_n = softmax((ℓ + ℓ_n) / β) · F  ← 종목별 게이팅
```

**왜 자연스러운가**: [[07_limits]] 의 가정 E (동일 게이팅) 의 직접 극복.

### 3.2 예측된 후손 2: 글로벌 다시장 MASTER

**예측**: 중국 CSI + 미국 S&P + 한국 KOSPI 를 **동시에 모델링** 하는 다시장 MASTER. 글로벌 지수 간 cross-market cross-time 상관 포착.

**가능한 구조**:
```
시장 1 (CSI): X^{(1)} (N_1 × T × F)  ─┐
시장 2 (SPY): X^{(2)} (N_2 × T × F)  ─┤→ Cross-Market Attention
시장 3 (KS):  X^{(3)} (N_3 × T × F)  ─┘
                                      │
                            글로벌 매크로 m^{global}_τ
                                      ↓
                                  게이팅
                                      ↓
                                  예측
```

**왜 자연스러운가**: [[07_limits]] 의 가정 D (단일 시장) 의 직접 극복.

### 3.3 실제 후속: FinMamba (2025)

**확인된 후속**: arXiv:2502.06707 FinMamba 가 MASTER 를 baseline 으로 사용 (웹 검색 스니펫 기준).

**FinMamba 의 contributions**:
- Mamba 기반 인터-스톡 그래프 집계
- US/CN 양 시장 검증
- MASTER 대비 효율 + 일반화 ↑

**의의**: MASTER 의 어텐션 구조가 **계산 비용 과도할 때 Mamba 로 대체 가능** 함을 시사. 또한 단일 시장 한계 극복.

### 🎯 구체 영향 — MASTER 의 후속 연구 임팩트

| 후속 연구 | 시기 | MASTER 와의 관계 |
|----------|------|----------------|
| FinMamba (2025) | 2025-02 | Baseline + Mamba 대체 + 양 시장 |
| (예측) Hierarchical MASTER | 2025-2026 | 종목별 게이팅 확장 |
| (예측) Global MASTER | 2026+ | 다시장 확장 |
| (예측) LLM + MASTER hybrid | 2025+ | 텍스트 + 가격 결합 |

---

## 4. 역사적 위치

### 4.1 Stock Prediction Transformer 의 3 세대 진화

**1세대 (2017-2019)**: 단일 종목 시계열
- 대표: LSTM, ALSTM, Transformer (단일 종목)
- 한계: 종목 간 정보 X

**2세대 (2020-2022)**: 종목 간 그래프 + Time-aligned
- 대표: GAT 계열, RSR, HATS, DTML
- 한계: Time-aligned 상관만, 시장 국면 적응 X

**3세대 (2023-2024)**: Cross-time + 외생 조건부
- 대표: **MASTER (2024)**, 일부 평행 연구
- 새로움: Cross-time relay + Market-guided gating

**4세대 (2025+, 예상)**: 효율 + 일반화 + 멀티모달
- 대표: FinMamba (Mamba 기반), LLM 결합 모델
- 방향: 효율 ↑, 외부 시장 ↑, 텍스트 + 가격

### 4.2 MASTER 의 역사적 위치

**전환점**: MASTER 는 "단일 종목 RNN → 그래프 기반 종목 상관 → cross-time 어텐션 기반 종목 상관" 의 세 세대 진화에서 **2세대 → 3세대 전환점**.

**선구자적 역할**:
- 시장 정보 유도 게이팅 = 외생 조건부 입력의 stock prediction 첫 적용
- Cross-time relay = time-aligned 패러다임 극복
- TFT 의 variable selection 정신을 stock prediction 으로 재구현

### 🔑 핵심 통찰

> MASTER 의 가치는 **single innovation** 이 아닌 **여러 line of research 의 통합**. ALSTM (시간) + GAT (종목) + DTML (동적) + TFT (외생) 의 통합 + cross-time relay 라는 새 design.

---

## 5. 핵심 한 문장

> MASTER 는 **stock prediction transformer** 의 3세대 (cross-time + 외생 게이팅) 대표 모델이며, ALSTM (intra) + GAT (inter) + DTML (동적) + TFT (외생) 의 통합 위에 cross-time relay 를 새로 추가하여, FinMamba 같은 4세대 후속 연구의 baseline reference 가 되었다.

---

## 6. 자기점검

### 핵심 5가지

1. **MASTER 의 4 조상 (ALSTM, GAT, DTML, TFT) 의 각 기여?**
2. **GAT 의 3가지 한계 (사전 그래프, time-aligned, symmetric) 와 MASTER 의 극복?**
3. **평행 연구 (FinGPT vs FinMamba) 와 MASTER 의 상호 보완성?**
4. **예측된 후손 2가지 와 [[07_limits]] 의 한계 연결?**
5. **Stock prediction transformer 의 3 세대 진화와 MASTER 의 위치?**

### 답변

1. **ALSTM (2019)**: 단일 종목 시간 attention → MASTER 의 intra-stock 의 직계 전신. **GAT (2020-)**: 종목 간 그래프 attention → inter-stock 의 직계 조상. **DTML (2022-)**: 동적 + 다중 관계 + 비대칭 → 더 유연한 inter-stock 의 design 영감. **TFT (2021)**: Variable Selection Network → 시장 유도 게이팅의 개념적 영감.

2. **사전 그래프 의존**: 산업 분류 등 → MASTER 는 **완전 학습** 그래프 (attention weight 자체가 그래프). **Time-aligned**: 같은 시각 정보만 → MASTER 는 **cross-time relay** (intra 출력이 시간 압축 → inter 가 사실상 cross-time). **Symmetric**: 양방향 동등 → MASTER 는 **비대칭** attention (leader-follower 학습).

3. **FinGPT (LLM)**: 텍스트 기반, 이벤트 단기 반응. **MASTER**: 가격 기반, systematic 시계열. **상호 보완**: 실무 앙상블 가능 — MASTER 의 systematic 신호 + LLM 의 이벤트 신호. **FinMamba (2025)**: MASTER 의 직접 후속, Mamba 로 효율 ↑ + US/CN 양 시장. MASTER 가 baseline reference 가 됨.

4. **후손 1 (종목별 게이팅 + 섹터 인식)**: [[07_limits]] 가정 E (동일 게이팅) 극복. 섹터·종목별 게이팅 = 시장 + 섹터 + 종목 hierarchical. **후손 2 (글로벌 다시장)**: [[07_limits]] 가정 D (단일 시장) 극복. 중국 + 미국 + 한국 동시 모델링 + 글로벌 매크로 게이팅. 둘 다 자연스러운 확장 + 실무 가치 ↑.

5. **1세대 (2017-2019)**: 단일 종목 시계열 (LSTM, ALSTM). 한계: 종목간 X. **2세대 (2020-2022)**: 종목간 그래프 + time-aligned (GAT, DTML). 한계: cross-time X, 국면 적응 X. **3세대 (2023-2024)**: Cross-time + 외생 (MASTER ★). **4세대 (2025+)**: 효율 + 일반화 + 멀티모달 (FinMamba, LLM hybrid). MASTER 는 **2 → 3세대 전환점**.

---

→ 다음 챕터: [09_my_research.md](09_my_research.md) — Hana 연구와의 연결.
