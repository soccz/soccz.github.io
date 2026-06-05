# 07_limits — 가정·한계·반박

## 명시된 가정 (논문이 직접 말한 것 + 코드가 강제하는 것)

### 가정 1 — Markovian-ish 사건 표현 by self-attention

THP 는 사건 사이 시각 $t \in [t_j, t_{j+1})$ 의 강도가 **마지막 사건의 hidden $h_j$** 와 경과시간 $(t - t_j)$ 만으로 결정된다고 가정. 그 사이의 미세한 시간 변화에 따라 $h$ 가 재계산되지 않음. 즉 한 사건 사이 구간 안에서는 **stationary modeling**.

근거: `transformer/Models.py::Predictor` 의 `forward` — `h_j` 한 번 계산 후 $t$ 만 다르게 입력.

### 가정 2 — 시간 단위 정합성

`temporal_enc(t) = sin(t / 10000^(2i/d))` 의 분모가 고정 → 데이터셋 시간 단위가 다르면 인코딩 의미가 달라짐. **README 가 직접 경고**:

> "the reported event time prediction RMSE and the time stamps provided in the datasets are not of the same unit"

저자 자신이 시간 단위 합의가 안 됐음을 시인.

### 가정 3 — 시간 0 시작 후 양수 진행

$(t - t_j)/t_j$ 의 분모가 $t_j$ → 첫 사건 $t_1 = 0$ 인 시퀀스에선 분모 0 위험. 데이터 전처리에서 $t_1$ offset 또는 epsilon 처리 가정.

### 가정 4 — 사건 종류 간 동일 hidden 공유

$\lambda_k$ 가 모두 같은 $h_j$ 에 weighted projection → 모든 종류가 같은 사건 이력 표현을 공유. **mutual-excitation 의 명시적 행렬 없음** (모든 cross-type 영향이 $w_k$ 학습으로 implicit).

### 가정 5 — Causal mask (forward only)

학습 시 사건 $i$ 는 1, ..., $i-1$ 만 attention. 양방향 정보 없음. 추론 시 인과성 보존되지만 양방향 정보가 도움이 되는 contextual labeling 응용에는 부적합.

---

## 암묵적 가정 (논문이 말 안 했지만 깔린 것)

### 암묵 가정 1 — 사건 시퀀스의 stationarity

학습 train 데이터의 사건 분포와 test 의 분포가 같다고 가정. **regime shift 가 흔한 금융 시퀀스에선 직접 위반** 가능. 시기적 trend (예: COVID 이전 vs 이후의 거래 강도) 는 전이학습 대상이 됨.

### 암묵 가정 2 — 사건 type 의 명확한 categorical 정의

종류 $k \in \{1, ..., K\}$ 가 사전에 결정. 종류 간 의미적 거리 정보 없음. semantic 유사 종류 (예: limit-buy / market-buy) 가 완전히 독립으로 취급.

### 암묵 가정 3 — 사건 시각의 정확한 관측

시각이 ms 단위로 정확하다고 가정. 실제 데이터에서 시각 측정 noise (예: 분산 거래소의 시계 오차) 가 무시.

### 암묵 가정 4 — Long-range trigger 가 실제로 존재

Self-attention 의 우위가 입증되려면 데이터에 long-range dependency 가 실제 있어야 함. 짧은 시퀀스 데이터 (MIMIC-II) 에선 RNN 도 충분히 좋을 수 있음.

### 암묵 가정 5 — Hyperparameter 의 데이터셋 robustness

논문 표가 같은 hyperparameter 셋으로 6 데이터셋 모두 보고했는지, 데이터셋별 튜닝했는지 본문 미접근으로 미확인. 만약 후자라면 우위의 일부는 튜닝 가능성에서 비롯.

---

## 반박 가능한 지점

### 반박 1 — "Self-attention 의 이점이 사건 사이 강도 표현 한계로 상쇄될 수 있다"

**핵심 주장**: THP 의 강도 헤드가 시간선형(linear in $t - t_j$) + softplus 라는 **너무 단순한** 표현 → 사건 사이의 강도가 U-shape, oscillating, multi-modal 인 경우 표현 불가. NHP 의 continuous-time LSTM 은 사건 사이 비단조 표현 가능. 따라서 데이터에 따라 NHP 가 THP 보다 강도 표현력 ↑ 일 수 있다.

**실험 검증 방법**:
1. Synthetic data 에서 강도가 U-shape (감쇠 후 재상승) 인 호크스 확장 (예: bi-exponential kernel) 을 sampling.
2. NHP, THP, 그리고 NHP-attention hybrid (attention encoder + continuous LSTM 강도) 를 학습.
3. 진짜 강도와의 KL divergence 측정. 만약 NHP 가 THP 보다 KL ↓ 이면 강도 표현 한계 증거.

### 반박 2 — "시간 단위 의존성이 보고된 우위의 일부를 설명할 수 있다"

**핵심 주장**: 저자 README 가 직접 시인 — RMSE 단위가 데이터셋과 불일치. 만약 baseline 들이 같은 단위로 RMSE 측정하지 않았다면, THP 가 실제로 baseline 을 이긴 것인지 단위 변환 효과인지 분리되지 않음.

**실험 검증**:
1. 6 데이터셋의 시간 단위 명시화 (초 / 분 / 시 / 일).
2. THP, RMTPP, NHP, SAHP 모두 동일 단위로 normalize.
3. 동일 normalize 후 RMSE 재측정. 우위 자릿수 변화 측정.

### 반박 3 — "Self-attention 의 O(L²) 비용이 매우 긴 시퀀스(Financial L~2000)에서 RNN 의 효율 우위로 상쇄"

**핵심 주장**: Financial 데이터의 평균 길이 2000 에서 $L^2 = 4 \times 10^6$. 4 layer × 4 head × $L^2$ 가 계산의 dominant cost. 실용 trading 시스템에서 100ms 안에 다음 강도 추론 필요한 경우 RNN 의 sequential O(L) 이 더 빠를 수 있음.

**실험 검증**:
1. 동일 hardware 에서 inference latency vs 시퀀스 길이 측정.
2. RNN ↔ THP 의 throughput 비교.
3. 100ms 제약 만족하는 길이 한계 측정.

### 반박 4 — "Hawkes ground-truth recovery 가 보장되지 않을 수 있다"

**핵심 주장**: Synthetic Hawkes 에서 THP 가 진짜 강도함수를 회복하는가? Transformer 의 표현력이 풍부해서 가능도가 높을 수는 있으나, 학습된 강도가 진짜와 다를 수 있다 (overparameterized). NHP 처럼 LSTM 의 더 빈약한 표현력이 오히려 진짜 강도에 가깝게 수렴 가능.

**실험 검증**:
1. Synthetic Hawkes 의 진짜 $\mu, \alpha, \beta$ 알려진 sampling.
2. THP, NHP, RMTPP 학습 후 학습된 강도와 진짜 강도의 pointwise L2 거리 평가.
3. 가능도 우위 ≠ 강도 회복 우위인지 확인.

---

## 재현성 평가

### 코드 공개

- ✅ github.com/SimiaoZuo/Transformer-Hawkes-Process (저자 본인 계정)
- ✅ Models / Layers / Modules / SubLayers / Utils / Main / preprocess 모두 공개
- ✅ run.sh 의 hyperparameter 가 default 보고값

### 데이터 공개

- 🟡 Google Drive 링크로 별도 제공 (저자 README). 다운로드 후 `data/` 폴더에 배치 필요.
- 🟡 데이터셋별 시간 단위 명시 미흡 (README 경고).

### 환경 의존성

- ⚠️ PyTorch 1.4 (2020 년 버전) — 현행 PyTorch 2.x 와 호환성 마이그레이션 필요.
- ⚠️ Python 3.7 — Python 3.11 default 환경에서 deprecated.
- ⚠️ Single-GPU only (저자 README 명시) — multi-GPU scaling 미지원.

### 통계 보고

- ❓ 평균 vs std: 본문 표가 평균만 보고했는지 std 도 보고했는지 본 환경 미확인. 점과정 평가 (특히 Monte Carlo 적분) 의 분산이 큰 점을 고려하면 std 보고는 신뢰성에 중요.
- ❓ Seed 변동: run.sh 에 random seed 고정 명시 없음 — 매 실행 결과가 약간씩 다를 수 있음.

### 사용자 측 보충 필요 (현 환경 제약)

- 본문 PDF 직접 확인 시: Table 1·2·3 의 자릿수, ablation 표 정확값, std 의 보고 여부, 부록 단위 표 위치.

---

## 한계 종합

### "잘 작동하는" 범위

- ✅ 길이 50–2000 의 marked event sequence (점과정 표준 길이)
- ✅ 사건 종류 2–22 개의 medium-K
- ✅ Long-range trigger 가 실제로 존재하는 도메인 (소셜 캐스케이드, 금융 high-freq)
- ✅ Stationary distribution 의 train/test

### "잘 안 될" 범위

- ❌ 매우 긴 시퀀스 (L > 10⁴) — self-attention 의 O(L²)
- ❌ 사건 사이 강도가 U-shape/oscillating — 강도 헤드 표현 한계
- ❌ Distribution shift (regime change) — stationarity 가정 위반
- ❌ K > 100 의 다종 사건 — 강도 헤드의 $w_k$ 매트릭스 폭발
- ❌ 매우 짧은 시퀀스 (L < 10) — self-attention 이점 무.

### 명시 위치

- **본문 §6 또는 §7 Limitations**: 본 환경 미접근으로 정확 위치 미확인. 사용자가 본문 PDF 접근 시 우선 확인.
- **README 의 4-line 한계 명시**: single GPU, time unit 불일치, hyperparameter sensitivity, optional RNN.
