# 9-C. 사고 확장 — 실험 아이디어 2개

> **🧒 한 줄 요약**: 내 *연구 아이디어*: TS-domain SAE, grokked + SAE, hierarchical SAE, online SAE, SAE-based reward model debugging.


---

## 아이디어 1 — "SAE Motif Attribution": 시계열 Transformer에서 Attention Motif의 SAE 특징 원인 규명

### 가설

APF 연구에서 관찰되는 attention pattern motif(diagonal, stripe, block, edge, spike 등)는 특정 입력 시계열 특징에 의해 유발된다. 스파스 오토인코더(SAE)를 시계열 Transformer의 MLP 레이어에 훈련시키면, 어떤 SAE 특징이 어떤 attention motif와 인과적으로 연결되는지 규명할 수 있다.

### 데이터

- **모델**: APF 실험에서 이미 사용 중인 시계열 Transformer (PatchTST 또는 iTransformer 아키텍처)
- **입력 데이터**: APF 합성 motif 벤치마크 (trend/seasonal/regime/anomaly/freq drift) + ETTh1/ETTm1
- **SAE 훈련 데이터**: 동일 모델의 MLP post-ReLU 활성화 캡처

### 비교 조건

1. **SAE 없는 기준**: 원시 뉴런 활성화와 attention motif 간 상관관계 (폴리시맨틱 기준선)
2. **SAE 있음 (n=d)**: 딕셔너리 크기 = 뉴런 수 (슈퍼포지션 해소 안 됨)
3. **SAE 있음 (n=4d)**: 딕셔너리 4× 확장 (슈퍼포지션 해소 시작)
4. **SAE 있음 (n=8d)**: 딕셔너리 8× (더 많은 특징 분리)

각 조건에서 "diagonal motif 존재" 레이블을 target으로, SAE 특징 활성화를 feature로 하는 로지스틱 회귀 정확도 측정.

### 예상 결과

SAE (n=4d, 8d) 조건에서 로지스틱 회귀 정확도가 원시 뉴런 기준보다 높을 것. 특히 단일 SAE 특징 하나만 사용했을 때도 높은 정확도를 보이면, 그 특징이 diagonal motif의 주요 원인이라는 강한 증거.

### 반증 조건

SAE 조건에서 원시 뉴런과 동등하거나 낮은 정확도가 나오면: (a) 이 Transformer의 MLP가 슈퍼포지션을 쓰지 않거나, (b) attention motif의 원인이 MLP가 아닌 다른 곳(attention Q/K 투영)에 있음을 시사.

### 비용 추정

- SAE 훈련: 이미 사용 중인 모델에서 활성화 캡처 → 소형 SAE (2-4 레이어) 훈련. 단일 GPU 기준 1-2일.
- 로지스틱 회귀 실험: 빠름 (<1시간).
- APF 실험 인프라 재사용 가능 → 추가 개발 비용 낮음.
- **이 실험이 APF 논문에 포함된다면**: §4(Causal Intervention) 섹션의 강력한 보조 결과가 될 수 있음.

---

## 아이디어 2 — "Grokking Feature Atlas": Grokking 전후 SAE 특징 분포 변화 추적

### 가설

Grokking 현상 (memorization → generalization 전환)은 모델 표현 수준에서 관찰 가능한 불연속적 변화를 수반한다. 구체적으로, SAE로 추출한 특징들의 분포가 grokking 전후에 질적으로 달라진다:
- **Grokking 이전**: 훈련 샘플별 "암기 특징"들이 많고 분산됨 (고활성화, 저희박성)
- **Grokking 이후**: 소수의 "알고리즘 특징"들(ex. 주기 함수 기반)이 희박하게 활성화됨 (저활성화 수, 고해석가능성)

### 데이터

- **태스크**: Modular arithmetic (Power 2022와 동일한 설정: $a + b \pmod{p}$, $p=97$)
- **모델**: 4-layer transformer (Grokking 실험 표준 아키텍처)
- **체크포인트**: Grokking이 발생하는 epoch 전후로 10개 이상의 체크포인트 저장

### 측정 지표

1. **활성 특징 수 (Active Features per Input)**: 각 체크포인트에서 평균 $\|f(x)\|_0$ (0-norm) 추적 — grokking 이후 감소 예상
2. **특징 집중도**: 상위 특징 k개가 활성화의 몇 %를 차지하는가? (grokking 이후 더 집중될 것으로 예상)
3. **Fourier 특징 존재율**: Nanda (2023)이 발견한 Fourier 기저 특징과 SAE 특징의 cosine similarity 분포 변화
4. **특징 안정성**: 연속 체크포인트에서 SAE 특징들의 cosine similarity — grokking 후 안정화 예상

### 비교 조건

1. **Grokking이 발생하는 훈련** (L2 weight decay 있음)
2. **Grokking이 발생하지 않는 훈련** (큰 weight decay 없음, memorization에 머뭄)
3. **둘 다 동일한 SAE 아키텍처로 분석**: 조건 1vs.2에서 특징 분포 차이가 Grokking의 본질

### 예상 결과

Grokking이 발생한 모델(조건 1)에서만 Fourier 기저와 일치하는 SAE 특징들이 emergence. Grokking 전환점에서 active features per input이 급격히 감소. Grokking이 없는 모델(조건 2)에서는 이런 패턴 없음.

### 반증 조건

SAE가 Grokking 전후에 동일한 특징 분포를 보인다면: Grokking의 메커니즘이 표현(representation) 수준이 아닌 다른 곳(optimizer 상태, weight 크기 분포 등)에 있음을 시사. 이것도 중요한 결과다.

### 비용 추정

- 모델 훈련: A100 1개, ~12시간 × 2 조건 = 24시간
- 체크포인트별 SAE 훈련: 10개 × 2시간 = 20시간 (병렬 가능)
- 분석: 하루
- **총**: GPU-day 기준 약 3일
- **Grokking 논문의 §3 메커니즘 분석의 핵심 기여**가 될 수 있음 (Nanda 2023을 넘어서는 새로운 방법론)

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **TS-domain SAE 의 *unique challenge*?**
2. **Grokked + SAE 의 *feature emergence trajectory* 추적?**
3. **SAE-based reward model debugging 의 *practical 가치*?**

### 답변

1. **Token boundary 의 부재**. TS = continuous, no semantic tokens. SAE 의 input = *per-time-step residual* (or per-variate, in iTransformer). Feature 의미 = *temporal attribute* (e.g., "trending up", "high volatility regime") 형태. *Visualization* = *time series highlight* (어느 time interval 에서 activate) — 새 protocol 필요.

2. **Phase-wise SAE**. Grokking 의 4 phases (random / memorize / transition / grokked) 각각의 SAE 학습 → feature 의 *emergence / disappearance* 추적. Phase transition 시 *어느 features 가 새로 나타남* → *circuit formation trajectory* 의 *temporal map*. Grokking 의 *mechanistic explanation* 강화.

3. **Reward model 의 internal feature 분석**. RLHF reward model 의 residual → SAE → feature 별 의미. *"Reward hacking" features* (e.g., "긴 답변 prefer", "특정 phrase repeat") 식별 → 선택적 ablation → *better-aligned reward*. *Practical safety value*.
