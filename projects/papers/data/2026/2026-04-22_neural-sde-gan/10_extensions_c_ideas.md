# 10c · 실험 아이디어 2개

---

## 아이디어 1 — Economic Time으로 구동되는 Neural SDE: 시간-변환 생성자

### 가설

Clark (1973)의 경제 시간(economic time)으로 SDE 시간축을 교체하면 — 즉, $dY_{\tau(t)} = \mu_\theta(\tau, Y)\,d\tau + \sigma_\theta(\tau, Y)\,d\tilde{W}_\tau$ 에서 $\tau(t) = \int_0^t v(s)\,ds$ ($v$: 거래량) — 표준 SDE 생성자 대비 금융 경로 생성 품질이 향상된다. 특히 변동성 클러스터링 재현 지표에서 차이가 나타날 것이다.

### 데이터

- S&P500 구성 종목 일간 종가 + 거래량 (2010–2023, Yahoo Finance)
- 비교용: OU 합성 경로 (단순 baseline)

### 비교 조건

| 조건 | 설명 |
|------|------|
| Baseline | 표준 Neural SDE GAN (wall-clock time $t$) |
- | Ours | Economic Time Neural SDE GAN ($\tau(t)$ 기반) |
| Ablation 1 | $\tau(t)$ 대신 cumulative bid-ask spread (거래 비용 기반 시간) |
| Ablation 2 | $\tau(t)$ 대신 VIX 기반 시간 (변동성 지수 누적) |

### 예상 결과

- Economic time 기반 SDE가 변동성 클러스터링 지표(ARCH(1) 계수 차이)에서 baseline을 개선.
- ACF(자기상관함수) 비교에서 economic time 생성 경로의 단기 의존성이 실제 데이터와 더 일치.

### 반증 조건

- Economic time 기반 SDE가 baseline 대비 TSTR·discriminative score에서 유의미한 차이가 없다면 → "economic time이 생성 품질에 유익하지 않다"는 반증. 이 경우 Paper 4의 주장을 생성 맥락이 아닌 *예측* 맥락에만 한정해야 한다.

### 비용 추정

- 코드: torchsde 기반, 시간 변환 적용 ≈ 2일
- 학습: GPU 1개, 10 epochs × 50 배치 ≈ 4~6시간
- 전체: ≈ 1주일 (데이터 정리 포함)

---

## 아이디어 2 — Neural CDE 판별자 vs. Transformer 판별자: Paper 2 재검증

### 가설

Neural CDE 판별자와 Transformer(이산 attention 기반) 판별자를 동일한 Neural SDE 생성자에 붙였을 때, Transformer 판별자는 장기 의존성 캡처에서 Neural CDE와 유사하지만, *불규칙 관측 시계열*에서는 Neural CDE가 의미 있게 우수하다. 이 차이는 Paper 2의 "Representation Utility Gap"의 시계열 생성 유사체이다.

### 데이터

- 불규칙 관측 OU 과정 (관측 확률 $p \in \{0.3, 0.5, 0.8, 1.0\}$으로 랜덤 다운샘플)
- 이 설정에서 두 판별자의 discriminative score와 TSTR을 비교.

### 비교 조건

| 조건 | 판별자 | 생성자 |
|------|--------|--------|
| A | Neural CDE | Neural SDE |
| B | Transformer (sin PE) | Neural SDE |
| C | Transformer (learnable PE) | Neural SDE |
| D | LSTM | Neural SDE |

### 예상 결과

- 규칙 관측($p=1.0$): A ≈ B > D (Transformer와 CDE 동등)
- 불규칙 관측($p=0.3$): A > B > C > D (불규칙 간격에서 CDE가 명확히 우세)
- 이 결과는 "이론적으로 최적인 판별자 = CDE"의 실험적 지지 + 불규칙 관측에서의 실용적 우위를 동시에 보여준다.

### 반증 조건

- Transformer (learnable PE)가 Neural CDE와 통계적으로 동등하다면 → "CDE의 이론적 우위가 실용에서 발현되지 않는다"는 반증. 이 경우 더 간단한 Transformer 판별자로 대체하는 것이 효율적임을 의미한다.

### Paper 2 연결

이 실험의 "conditioning mechanism"을 판별자 구조로, "representation utility"를 생성 품질로 매핑하면 — Paper 2의 결론("input-space conditioning vs. coordinate-space conditioning의 utility gap")을 생성 모델 판별자 영역에서 재검증하는 실험이 된다. 두 실험 결과가 일치하면 "conditioning space의 선택이 용도(예측/생성)와 무관하게 성능에 영향을 준다"는 더 강한 주장이 가능해진다.

### 비용 추정

- 코드: torchsde + HuggingFace Transformer ≈ 3일
- 학습: GPU 1개, 4개 조건 × 4개 결측 비율 = 16 실험, 각 2시간 ≈ 32시간
- 전체: ≈ 2주일
