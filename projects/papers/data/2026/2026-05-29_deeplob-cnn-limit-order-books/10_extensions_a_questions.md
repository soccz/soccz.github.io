# 10_extensions_a — 사고 확장: 자문 질문 5개

**배경 사다리**: ① 좋은 연구는 답 보다 *질문* 에서 시작, ② 자문 질문 (self-pose) 은 해체자가 *놓친 관점* 또는 *후속 가치* 를 끌어내는 도구, ③ 각 질문은 "왜 이 질문이 중요한가" 가 동반되어야 단순 호기심이 아닌 *연구 지렛대* 가 된다.

---

## Q1. "DeepLOB 의 conv 커널 모양은 진짜 LOB 의 위계와 일치하는가, 아니면 *어떤 위계든* 정렬 순서를 따르면 작동하는가?"

### 왜 중요한가
- DeepLOB 의 1×2 → 1×2 → 1×10 디자인이 *LOB 의 의미적 위계* 를 따른다고 저자는 주장하지만, conv 는 입력 정렬 순서만 보고 작동한다. 만약 입력 40-dim 의 순서를 *완전히 무작위 permute* 해도 conv 의 receptive field 패턴은 동일.
- 진짜 가설 검증: (가설 A) "DeepLOB 의 성능은 LOB 의 *의미적* 정렬 덕분" vs (가설 B) "어떤 fixed 정렬이든 conv 가 적응 학습".
- **이 답이 가설 A 면 LOB 도메인 지식이 본질적, 가설 B 면 conv 자체가 본질적** — 후속 연구의 방향이 달라진다.

### 실험 디자인 힌트
- (가설 A 지지) LOB 의 40-dim 정렬을 random permute → 같은 학습 → 성능 크게 하락하면 의미적 위계가 본질.
- (가설 B 지지) Permute 해도 비슷한 성능 → conv 의 universal approximation 우세.

---

## Q2. "FI-2010 의 라벨 ($k$-tick 후 mid-price 변화) 의 $k$ 가 모델 design 의 효율을 어떻게 바꿀까?"

### 왜 중요한가
- 본 논문이 어떤 $k$ 에 가장 우세한지 본문 표 §V 가 보여 줄 것으로 추정 — 본 해체는 미확인.
- 짧은 $k=10$ (즉시 변화) 은 conv 의 *spatial 정보* 가 더 우세할 가능성, 긴 $k=100$ 은 *temporal 정보* (LSTM) 가 더 우세할 가능성.
- 만약 horizon 별 architecture 가 달라야 한다면 *single-model-fits-all* 의 한계.

### 실험 디자인 힌트
- 같은 architecture 로 $k \in \{10, 20, 30, 50, 100\}$ 5번 학습 → F1 곡선.
- 각 $k$ 에서 ablation: Inception 제거, LSTM 제거 시 F1 변화. *어느 component 가 어느 $k$ 에 기여* 분해.

---

## Q3. "Universal features 의 진짜 정체는 무엇인가? — 어떤 LOB 패턴이 종목 간 transfer 되는가?"

### 왜 중요한가
- 저자는 LSE 5종목에서 transfer 가능 보고. 그러나 *어떤 패턴이 transfer 되는지* 는 미분석.
- 본 작업 (APF) 의 motif 가설과 직접 연결: *queue depletion*, *spread crossing*, *bid-ask imbalance spike* 같은 *meta-패턴* 이 종목 무관 universal 일 가능성.
- 만약 universal patterns 을 *이름붙일* 수 있다면, *해석 가능한 LOB 모델* 의 첫 걸음.

### 실험 디자인 힌트
- DeepLOB 의 마지막 LSTM hidden (64-dim) 의 *probe* — 각 dim 이 어떤 LOB 패턴에 활성화되나.
- Mechanistic interpretability 의 *circuit discovery* (ACDC, Sparse Feature Circuits) 를 LOB conv 회로에 적용.
- → §F (microstructure) + §B (mech interp) 의 교차 후속.

---

## Q4. "DeepLOB 의 *failure mode* 는 어떤 시점에 집중되는가? 시장 충격·뉴스 발표·개장 직후?"

### 왜 중요한가
- 평균 정확도 75% 는 좋지만, *실거래의 의사결정은 실패 시점의 잘못된 신호로 손실이 집중* 된다.
- 만약 모델이 *시장 충격 직후 (volatility spike)* 에 systematically 잘못 예측하면, 실거래는 그 순간 사이즈 조절 필수.
- → *시점별 reliability* 가 *평균 정확도* 보다 실무적 가치.

### 실험 디자인 힌트
- LSE 1년 데이터에서 *시각별 confusion matrix*: 9:00 (open), 12:00 (lunch), 15:30 (close), Federal/BoE 발표 직후 (15:00 GMT) 등.
- 시각별 calibration plot (Brier score) — 어떤 시점에 모델이 *과대확신* 하나.

---

## Q5. "DeepLOB 의 분류 정확도 75% 가 *최적 거래 전략* 의 어느 부분에 해당하나? — 정확도와 PnL 의 정량적 다리"

### 왜 중요한가
- 본 논문의 가장 큰 학술-실무 간극.
- 75% 라는 숫자가 *실거래 PnL* 로 어떻게 환산되는지 *정량 모델* 이 필요.
- 단순 backtest 가 아닌, *information ratio / hit ratio* 와 *expected PnL* 의 *이론적 관계*.

### 실험 디자인 힌트
- *Kelly criterion* 적용: 모델 출력 (3-class softmax 확률) → 최적 포지션 크기.
- transaction cost 모델 (commission + 0.5-spread + market impact $\propto \sqrt{volume}$) → net PnL.
- 시뮬레이션: LSE 1년 데이터에서 모델 기반 거래 vs random/buy-hold/momentum 비교.
- *정확도 vs PnL* 의 함수 형태 fit — 75% 에서 한계 PnL 이 +/-1% 정확도당 얼마 변화하나.

---

## 메타 질문 — 위 5개의 공통 thread

세 질문 (Q1, Q3, Q5) 은 모두 **"DeepLOB 의 성공의 진짜 원인은 무엇인가"** 를 다른 각도로 묻는다:
- Q1: architecture choice vs LOB 도메인
- Q3: 어떤 패턴이 universal 인가
- Q5: 분류 metric vs 거래 metric

Q2, Q4 는 *robustness*: 다른 $k$, 다른 시점에서 작동하나.

이 5개 질문이 모두 답을 받으면 DeepLOB 는 더 이상 black-box 가 아니라 *해석 가능한 microstructure 모델* 이 된다. 이것이 본 해체자의 후속 연구 방향.
