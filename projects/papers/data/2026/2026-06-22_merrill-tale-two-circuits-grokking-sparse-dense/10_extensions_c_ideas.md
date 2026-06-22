# 10 · 사고 확장 (c) — 실험 후속 아이디어 2 개

> **형식**: 각 아이디어마다 가설 / 데이터 / 비교 조건 / 예상 결과 / 반증 조건 / 비용 추정의 6 요소.

---

## 아이디어 1 — "Regime-aware grokking" 측정 in P2 logistic map

### 가설

P2 logistic map (`x_{t+1} = 4 x_t (1 - x_t)` 의 chaotic regime 변형, 사용자 보유 자산) 에서 학습된 4-layer transformer 는 train MSE 가 plateau 한 뒤 한참 *늦은* epoch 에서 test MSE 가 *sharp drop* — 이때 본 논문 식 norm bimodality 가 *FFN block 의 hidden dim* 에서 관측 가능하며, **bimodality 의 등장 epoch 이 test MSE drop 의 *N 선행 지표*** (N: 데이터·hyperparameter 의존, 수십~수백 epoch 가정).

이 가설이 참이면 — TS forecasting 의 grokking 이 본 논문의 mechanism (sparse vs dense 경쟁) 의 *직접 instance* 임을 *최초로* 입증.

### 데이터

- **substrate**: P2 logistic map (50 stationary regime 합성 + 50 chaotic regime mixture). 사용자 보유.
- **train / test split**: 학습 길이 1024 token, test 분리는 input distribution 의 *out-of-time* (시간 끝부분 분리). regime label 은 hidden — 모델이 regime 검출 회로를 *자체 발견* 해야 함.
- **sample 수**: 5000 train sequence, 1000 test sequence.

### 비교 조건

| 조건 | 설명 |
|------|------|
| **C0 (control)** | 표준 학습 (Adam, MSE, wd=0). norm dynamics 만 *관측*. |
| **C1 (본 논문 mirror)** | SGD + Huber + wd=0.01. 본 논문 setup 의 TS 미러. norm bimodality 더 잘 보일 예상. |
| **C2 (intervention)** | C1 base 에서 phase transition 직전 (= bimodality 등장 시점 이후 10 epoch) sparse 후보 dim 의 norm 을 *강제로 1.5× scale up*. → phase transition 이 *trigger 되는가*. |
| **C3 (counter-intervention)** | C1 base 에서 같은 시점 sparse 후보 dim 의 norm 을 *강제로 동결*. → phase transition 이 *지연 / 안 일어남* 인가. |

### 예상 결과

- **C1**: bimodality 가 FFN hidden 의 일부 dim 에서 등장 → 그 등장 epoch 이 test MSE drop 의 50~200 epoch 전. plot: $(\text{norm CV}, \text{test MSE})$ 의 2축 시계열에서 CV 의 inflection 이 test MSE drop 보다 *왼쪽*.
- **C2**: phase transition 이 평균 30~50 epoch 앞당겨짐 (정량은 실험으로 확인).
- **C3**: phase transition 이 평균 100+ epoch 지연 또는 *발생 안 함*.

### 반증 조건

- C1 에서 norm bimodality 가 *발생 안 함* → 본 논문 mechanism 이 TS 로 *전이 안 됨* → frame 차용 자체를 폐기하고 *다른 mechanism* (e.g., Thilak slingshot, Liu effective theory 의 representation mode) 으로 우회.
- C2/C3 의 개입이 phase transition 시점을 *바꾸지 않음* → norm dynamics 가 *원인이 아닌 결과* 라는 결론. mechanism 을 한 단계 더 위로 (representation, hessian eigenvalue) 끌어올림.
- bimodality 가 있지만 test MSE drop 과 *시간적 상관 없음* → 두 phenomenon 이 *우연히 같이 일어난 것* 일 뿐. 사용자 트랙의 "grokking-as-progress-measure" 가설 폐기.

### 비용 추정

- **GPU-hour**: 1 조건 당 8 GPU-hour (4-layer transformer × 5000 sample × 1000+ epoch). 4 조건 × 5 seed = 160 GPU-hour. 단일 A100 20-day 또는 4× A100 5-day.
- **인력**: 1 인 (사용자 본인) × 2 주 (코드 작성 + 디버깅 + 결과 정리).
- **risk**: substrate (P2 logistic) 의 grokking-prone 성 자체가 미검증 — preliminary run 에서 grokking-like 곡선이 안 보이면 substrate 변경 필요 (regime-switching synthetic 또는 ETT-mini 로 대체). preliminary 1 일 cost.

### 기대 산출

- NeurIPS 2027 plan 의 *§5 실험 1* 으로 직접 배치. 본 논문의 mechanism 이 TS 로 *최초 전이* 됨을 보임으로써 contribution 의 첫 evidence. paper 의 *opening figure* (regime-aware grokking 의 progression) 후보.

---

## 아이디어 2 — APF motif 의 "phase transition" 측정 (시간축 motif causality)

### 가설

APF (Attention Pattern Fields) 의 motif (diagonal / stripe / block / edge / spike / checker) 는 학습 *초기* 에 *uniform/dense* 한 attention pattern 에서 시작하여, *특정 epoch* 에서 *motif type 별로 sharp 형성* 되는 *phase transition* 을 보인다. 이 phase transition 의 *epoch* 은 (a) PE 종류 (NoPE / sinusoidal / RoPE / ALiBi), (b) motif type, (c) input data 의 *underlying structure* (stationary / regime-switching / trend) 의 함수. 본 논문 식 norm-ranked + faithfulness 측정을 attention head level 로 옮기면 *어느 head 가 어느 motif 를 언제 인수했는가* 의 시계열 measurement 가능.

이 가설이 참이면 — APF 의 *static* motif typology 가 *dynamic* mechanism (motif emergence 의 phase transition + PE-dependent timing) 으로 확장 가능. ICLR 2026 TAPPA (Yang) 후속의 *시간축 완성*.

### 데이터

- **substrate**: APF synthetic motif benchmark (사용자 보유: trend / seasonal / regime / anomaly / freq drift 5 종) + UCR Archive 일부 (실데이터 cross-validation).
- **모델**: 2-layer transformer, d_model=128, 4 head, FFN dim 512. PE 종류 sweep (NoPE / sinusoidal / RoPE / ALiBi 4 종).
- **학습**: AdamW, MSE forecast loss, 500 epoch 이상 (grokking-like phase transition 관측을 위해 충분).

### 비교 조건

| 조건 | PE | motif 측정 |
|------|----|-----------|
| **C0** | sinusoidal | epoch 별 attention pattern (head-별 N×N 행렬) → motif type 분류기 (사용자 보유 CNN probe) 의 확률 출력 시계열 |
| **C1** | RoPE | 동일 |
| **C2** | NoPE | 동일 |
| **C3** | ALiBi | 동일 |
| (모두) | head 별 faithfulness | head 별로 attention pattern 을 *그 motif* 의 *이상화 패턴* (예: 정확한 diagonal) 으로 *대체* 한 forward 의 forecast MSE 가 원본 대비 얼마나 보존되는가 |

### 예상 결과

- 4 PE × 5 motif × 4 head = 80 시계열. 각 시계열에서 *motif probability* 가 0 → 1 로 sharp jump 하는 *motif-emergence epoch* 식별.
- PE 별 motif-emergence pattern:
  - RoPE: diagonal motif 가 빨리 (~50 epoch), block motif 가 늦게 (~300 epoch).
  - NoPE: 모든 motif 가 더 늦게 발현, 또는 일부 motif 가 발현 *안 함*.
  - ALiBi: edge motif 가 가장 두드러짐.
  - (위 예상은 가설 — 실제 결과는 실험으로 확인.)
- head-faithfulness: 특정 head 의 motif 를 *이상화* 했을 때 forecast MSE 가 원본 대비 5% 이내로 보존되면 그 head 는 그 motif 를 *직접 사용* — *동기적* causality.

### 반증 조건

- motif emergence 가 *gradual* 하고 *no phase transition* → APF motif typology 가 *시간 동학* 으로 격상되지 않음 → APF 의 dynamic 측면은 부정되고 *static* typology 만 contribution.
- PE 별 motif emergence pattern 이 *random* (즉 PE 가 motif 시간 동학을 *제어 안 함*) → APF 의 PE × motif causality 가설 폐기.
- head-faithfulness 가 모든 head 에서 *50% 미만* → motif 가 *공동 분산 표현* 으로 작동, 단일 head 가 단일 motif 를 "소유" 하지 않음 — APF 의 head-level localization 가설 폐기.

### 비용 추정

- **GPU-hour**: 1 PE × 1 substrate 당 6 GPU-hour. 4 PE × 5 substrate × 5 seed = 100 조건 × 6 GPU-hour = 600 GPU-hour. 8× A100 4 days.
- **분석 cost**: motif 분류기 (CNN probe) 가 이미 사용자 보유 자산 → 추가 cost 적음. faithfulness 측정은 motif 이상화 pattern 만 별도 정의 필요 (5 motif × 1 ideal pattern 각).
- **인력**: 1 인 × 3 주.

### 기대 산출

- APF 트랙의 TMLR submission 의 *§5 시간축 실험* 으로 직접 배치. ICLR 2026 TAPPA 의 static motif typology 를 *time × PE × motif* 의 3D dynamic space 로 확장하는 *최초* 결과.
- 부수 산출: motif × head 의 *유일성* (한 head 가 한 motif 만 소유하는지) 의 *measurement-invariance* test 가 자연 부산물 — Q4 의 부분 답.

---

## 두 아이디어의 묶음 의미

아이디어 1 은 사용자 **Grokking active track** 의 *직접* 후속 — 본 논문 mechanism 의 *TS 전이*. 아이디어 2 는 사용자 **APF active track** 의 *간접* 후속 — 본 논문 protocol (norm-ranked masking + faithfulness 의 시간 시계열) 의 *attention motif 로의 전이*. 두 아이디어 모두 본 논문의 *4 종 시계열 측정 패러다임* 을 핵심 instrument 로 차용하되, *대상* (TS hidden dim / attention head) 과 *측정 metric* (forecast quantile agreement / motif probability) 을 사용자 트랙에 맞게 customize. 본 논문 1 편이 사용자의 두 main track 의 *공통 instrument* 가 되는 자리.
