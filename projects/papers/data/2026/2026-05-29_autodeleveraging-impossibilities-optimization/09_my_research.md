# 09 · 내 연구와의 연결

---

## 연결 지도 (4개 축)

| 내 연구 | ADL 논문과의 접점 | 구체적 연결 |
|---------|------------------|------------|
| **AETHER** (shelved, 재개 가능) | 암호화폐 시장 ML | 직접 배경 |
| **APF** (active) | 불가능성 정리 구조 | 메타 패턴 유사성 |
| **Grokking TS** (active) | 위상 전이 / 수렴 | 알고리즘 학습 동역학 |
| **P1 ProTran-TFA** (paused) | 금융 확률 예측 | 꼬리 리스크 응용 |

---

## 축 1: AETHER와의 직접 연결

AETHER는 shelved 상태이지만 "BTC 사이클 예측 + 크립토 ML"을 목표로 했다. 이 논문은 AETHER의 직접 배경 문헌이 된다.

### 배울 수 있는 것
1. **영구 선물 모델**: AETHER가 실제 파생상품 시장을 다루려면 영구 선물 구조($q_i, c_i, \ell_i$, 펀딩 비율)를 이해해야 한다. 이 논문의 §2 형식 모델이 그 기초.
2. **청산 캐스케이드**: 대규모 청산이 연쇄할 때 가격 충격이 다시 청산을 유발하는 피드백 — AETHER의 크래시 예측에 이 동역학이 핵심 인풋.
3. **레버리지 질량**: $\ell_t^+ = \sum_{i \in \mathcal{W}_t} \lambda_{i,t}^+$는 시스템 레버리지의 집계 지표. BTC 상승장/하락장 전환에서 레버리지 질량의 급변이 선행 지표가 될 수 있다.

### AETHER 재개 시 우선 체크
- Hyperliquid 공개 데이터에서 레버리지 질량 시계열 추출 가능 여부
- ADL 이벤트를 "극단 하락 선행 신호"로 사용하는 feature engineering

---

## 축 2: APF와의 메타 연결 — 불가능성 정리의 패턴

APF는 "어텐션 패턴이 왜 특정 구조(diagonal/stripe/block)로 수렴하는가"를 연구한다. 이 논문의 Theorem 1 (ADL 트릴레마)과 APF 사이에는 **메타 패턴 유사성**이 있다.

### 유사 구조
- **ADL 트릴레마**: 세 금융 공리(지급능력·수익·공정성)는 동시 불가능
- **APF의 잠재적 트릴레마**: 어텐션 헤드가 동시에 (1) 위치 인코딩 구조 반영, (2) 의미적 유사도 최대화, (3) 긴 의존성 포착을 최적화할 수 없는가?

이는 아직 가설 수준이지만, "세 목적 함수의 동시 최적화 불가능성"이라는 구조를 APF에 적용해볼 실험 설계가 가능하다.

### 구체 아이디어
- 멀티헤드 어텐션에서 각 헤드가 "불가능성 트릴레마의 한 꼭짓점"을 담당한다는 가설 검증 — ACDC 회로 분석 도구로.

---

## 축 3: Grokking TS와의 연결 — 알고리즘 수렴 동역학

Grokking은 "모델이 외우다가 갑자기 일반화로 도약하는 위상 전이"다. Mirror descent의 $O(\sqrt{T})$ 후회 수렴은 Grokking의 수렴 동역학과 흥미로운 대조를 이룬다.

### 유사점
- **Mirror descent**: 매 라운드 점진 업데이트, 충분한 $T$ 후 수렴 — 단조 수렴(smooth convergence)
- **Grokking**: 오랜 외우기 단계 후 갑자기 일반화 — 비단조 위상 전이(phase transition)

### 질문
"ADL 정책 학습에서도 Grokking이 일어나는가?" — 작은 교환소에서 ADL 이벤트가 드물다면, 충분한 데이터가 쌓이기 전까지 mirror descent가 수렴하지 못하고, 임계 데이터 밀도를 넘는 순간 갑자기 최적 정책으로 도약하는 현상이 관찰될 수 있다.

이는 Grokking track의 "비정상 시계열에서의 Grokking" 연구와 직접 연결된다 — ADL 데이터는 극단 이벤트가 드물어 본질적으로 non-stationary하고 tail-heavy하다.

### 실험 아이디어 (Grokking × ADL)
- 합성 ADL 데이터에서 mirror descent의 학습 곡선 추적
- "Grokking 임계점"이 ADL 이벤트 빈도의 함수인지 관찰
- 이 결과를 Grokking × TS non-stationarity 논문의 보조 실험으로 포함 가능

---

## 축 4: P1 ProTran-TFA와의 연결 — 꼬리 리스크 예측

P1 ProTran-TFA는 확률론적 트랜스포머 기반 금융 시계열 예측이다. ADL 논문과의 연결:

### 꼬리 리스크 정량화
ADL이 발생하는 조건($D_t > \text{IF}_t$)은 청산 실패의 꼬리 사건이다. ProTran-TFA가 이런 꼬리 사건의 확률을 예측할 수 있다면:
- 거래소는 ADL 이벤트 확률 $P(D_t > \text{IF}_t)$를 사전에 추정하여 동적 ADL 정책 조정 가능
- Mirror descent의 학습률 $\eta$를 예측된 꼬리 확률에 따라 적응적으로 조정 가능

### 구체 연결 시나리오
1. ProTran-TFA로 $D_t$ 분포의 꼬리 예측 → ADL 발생 확률 추정
2. 이 예측을 mirror descent의 사전 정보(prior)로 사용
3. ADL 정책의 "예측적 적응(predictive adaptation)" — 단순 반응적(reactive) mirror descent보다 선제적

---

## 즉각 활용 가능한 것

| 활용 항목 | 내 연구에서 쓸 곳 |
|-----------|------------------|
| 형식 모델 §2 ($P_n$, $D_t$, $\text{Solv}_T$) | AETHER 재개 시 데이터 스키마 |
| PTSR 지표 | 크립토 극단 이벤트 특징화에 feature로 사용 |
| Mirror descent 후회 분석 | Grokking 비교 기준점 — "부드러운 수렴" vs. "Grokking 도약" |
| Oct 10 2025 HyperReplay 데이터 | 공개 데이터 — 직접 다운로드 실험 가능 |
| 불가능성 정리 구조 | APF 확장 가설 수립 |

---

## 이 절의 핵심 한 문장

**ADL 트릴레마는 AETHER의 직접 배경이고, mirror descent의 단조 수렴은 Grokking의 위상 전이와 대비되는 비교 기준이며, PTSR 지표는 ProTran-TFA의 꼬리 리스크 예측 파이프라인에 즉각 통합 가능하다.**
