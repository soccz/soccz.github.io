# 08_lineage — 이론적 계보

## 📌 이 챕터 다 읽으면 알 수 있는 것

- 본 paper 의 이론적 계보
- Stock Transformer literature
- Quant finance ML literature

---

> **배경 사다리**: ① 그래프 신경망(GNN) = 노드(예: 종목)와 엣지(예: 상관관계)로 이루어진 그래프 구조 데이터를 처리하는 신경망. ② Attention over sequences = 시퀀스의 각 원소가 다른 원소들에 가중치를 두는 메커니즘. ③ Factor investing = 주식 수익률을 설명하는 공통 요인(팩터)을 찾아 포트폴리오를 구성하는 투자 전략. 이 세 개념을 알면 계보의 흐름을 따라갈 수 있다.

---

## 1. 이론적 조상

### 조상 1: Stock Trend Prediction via Feature Selection (ALSTM, 2019)

ALSTM은 LSTM에 attention 메커니즘을 결합해 단일 종목의 시간 패턴을 모델링했다. MASTER의 intra-stock 어텐션 구조는 ALSTM의 직계 후손이다. 연결선: ALSTM이 "단일 종목 내 시간 주의"를 열었다면, MASTER는 이를 multi-head transformer attention으로 교체하고 종목 간 차원을 추가한다.

**ALSTM이 MASTER에 남긴 것**: 단일 종목의 시간 표현 추출 → MASTER의 intra-stock aggregation 블록의 직접 전신.

### 조상 2: GAT for Stock (2020–2022년 계열)

Graph Attention Network를 주식 예측에 적용한 여러 연구들. 종목을 노드로, 상관관계를 엣지로 모델링해 "종목 i가 종목 j의 정보를 참고"하는 구조를 도입했다. MASTER의 inter-stock aggregation 구조의 직계 조상이다.

**GAT가 MASTER에 남긴 것**: 종목 간 어텐션 메커니즘. 그러나 GAT는 time-aligned 상관만 포착했고, 고정 그래프 구조(사전 정의된 엣지)에 의존하는 경우가 많았다.

### 조상 3: DTML — Dynamic Temporal Multi-relational Learning (2021–2023)

MASTER가 직접 비교하고 이기는 당시 최고 성능 모델. 다중 관계 유형(산업, 공급망, 지수 소속)을 동시에 모델링하고, 시간에 따라 그래프 구조를 동적으로 업데이트한다.

**DTML이 MASTER에 남긴 것**: 종목 간 상관관계의 동적 모델링이 중요하다는 것을 보여줬다. MASTER는 DTML의 multi-relation을 제거하는 대신, 더 유연한 어텐션 구조와 cross-time 모델링, 시장 유도 게이팅으로 대체한다.

---

## 2. 평행 연구

### 평행 1: FinGPT / LLM for Financial Forecasting (2023–2024)

같은 시기에 LLM을 금융 예측에 적용하는 연구들이 폭발적으로 등장했다. 이들은 뉴스 텍스트·공시 정보를 인코딩해 주가 예측에 활용한다.

**왜 MASTER가 다른가**: MASTER는 순수 가격·거래량 기반 Alpha158 팩터를 사용하며, LLM 기반 방법은 비정형 텍스트를 활용한다. 두 접근은 상호 보완적이며, 실무에서는 앙상블이 가능하다.

**어떤 영역에서 평행 연구가 더 나은가**: 실적 발표, 공시, 뉴스 이벤트 기반 단기 반응 예측에서는 LLM 기반이 우월할 가능성이 크다.

### 평행 2: FinMamba — Market-Aware Graph Enhanced Multi-Level Mamba (2025, arXiv:2502.06707)

MASTER의 접근을 Mamba(SSM 계열)와 그래프 신경망으로 확장한 후속/경쟁 연구. 미국·중국 양 시장에서 검증하며 인터-스톡 상관관계를 동적 그래프로 모델링한다. MASTER와의 직접 비교가 있을 가능성이 높다.

**왜 MASTER와 다른가**: Mamba의 선형 복잡도 → N이 클 때 더 효율적. 그러나 어텐션 기반 inter-stock 상관 시각화가 어렵다는 해석 가능성 트레이드오프가 있다.

---

## 3. 후손 예측 및 실제 후속

### 예측된 후손 1: 종목별 게이팅 + 섹터 인식 MASTER

현재 단일 게이팅 $g$를 모든 종목에 적용하는 한계를 극복하기 위해, 각 종목의 섹터·특성에 따라 다른 게이팅 계수를 적용하는 연구가 자연스럽게 파생될 것이다.

### 예측된 후손 2: 글로벌 다시장 MASTER

중국 CSI + 미국 S&P + 한국 KOSPI를 동시에 모델링하는 다시장 MASTER. 글로벌 지수 간 cross-market cross-time 상관을 포착하는 방향으로 확장 가능하다.

### 실제 후속 (FinMamba, 2025)

arXiv:2502.06707 FinMamba가 MASTER를 베이스라인으로 사용하며 Mamba 기반 인터-스톡 그래프 집계가 어떤 영역에서 어텐션보다 나은지 비교하는 것으로 보인다 (웹 검색 스니펫 기준). 이는 MASTER의 어텐션 구조가 계산 비용이 과도할 때 Mamba로 대체 가능함을 시사한다.

---

## 4. 역사적 위치

MASTER는 "단일 종목 RNN → 그래프 기반 종목 상관 → cross-time 어텐션 기반 종목 상관"의 세 세대 주식 예측 트랜스포머 진화에서 두 번째에서 세 번째 세대로의 전환점에 해당한다. 시장 정보 유도 게이팅은 이 계보에서 새로 도입되는 요소로, 외생 조건부(exogenous conditioning) 입력을 종목 예측에 통합하는 선구 역할을 한다. 이 패턴은 TFT(Temporal Fusion Transformer)의 variable selection network와 개념적으로 유사하며, 주가 예측 특화 맥락에서 재구현한 것으로 볼 수 있다.
