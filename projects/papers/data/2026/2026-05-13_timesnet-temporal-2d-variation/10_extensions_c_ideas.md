# 10c. 실험 아이디어 2개

> **🧒 한 줄 요약**: 내 아이디어: TimesNet + TFM hybrid, financial TimesNet, online TimesNet, multi-resolution TimesNet.


---

## 실험 아이디어 1: "TimesNet 2D 텐서에서 intraperiod vs interperiod 방향 분리가 실제로 이루어지는가"

### 가설

TimesNet의 2D reshape가 intraperiod(column 방향)와 interperiod(row 방향) 정보를 공간적으로 분리한다고 저자들은 주장한다. 그러나 Inception Block이 실제로 이 방향 구분을 학습하는지 확인된 바 없다. 가설: **Inception Block의 학습된 필터 중 row 방향 필터(interperiod)와 column 방향 필터(intraperiod)가 유의미하게 분화되어 있으며, 이 분화가 예측 성능의 핵심 기여를 한다.**

반증 가설: Inception Block은 방향 구분 없이 대각선 또는 등방향(isotropic) 패턴을 주로 학습하며, 2D 변환은 단지 계산 편의일 뿐이다.

### 데이터 및 조건

**데이터**: ETTh1 (강한 일주기), Exchange-Rate (약한 주기) — 두 대비적 데이터셋에서 실험.

**비교 조건** (4가지):
1. **원본 TimesNet** (TimesNet.py 공식 코드)
2. **Row-only 커널**: Inception Block의 모든 커널을 $n\times1$ 형태로 제한 (interperiod 전용)
3. **Column-only 커널**: 모든 커널을 $1\times n$ 형태로 제한 (intraperiod 전용)
4. **Scrambled 2D**: 2D reshape 후 텐서의 row/column을 랜덤으로 셔플하고 Inception 적용 — 공간 구조 파괴

### 예상 결과

ETTh1에서:
- 원본 TimesNet이 최고 성능
- Row-only ≈ Column-only < 원본 (각 방향 정보가 모두 필요함을 시사)
- Scrambled 2D가 가장 낮음 (2D 구조가 실제로 사용됨을 시사)

Exchange-Rate에서:
- 네 조건 간 성능 차이가 ETTh1보다 작음 (약한 주기 → 2D 구조 무의미)
- Scrambled 2D가 원본과 비슷할 수 있음 (주기 구조가 없으면 셔플이 무해)

### 반증 조건

가설이 **틀렸다고 볼 수 있는 조건**: ETTh1에서 Scrambled 2D가 원본 TimesNet과 5% 이내 성능 차이를 보이면, 2D 공간 구조가 실제로 활용되지 않는다는 증거. 이 경우 TimesNet의 성능은 2D 변환이 아닌 다른 요인(표현 차원 증가, residual connection 등)에서 온다는 수정 가설이 필요하다.

### 비용 추정

- 데이터 준비: ETTh1·Exchange-Rate — 공개 데이터, 다운로드 즉시 가능
- 코드 수정: Inception_Block_V1의 커널 크기 제한 + Scramble augmentation — 약 50~100 LOC 수정
- 학습 시간: TimesNet 공식 설정(ETTh1, pred_len=96)에서 1 run = GPU 1시간(V100 기준). 4조건 × 2데이터 × 3 random seed = 24 runs → 약 24 GPU-시간
- 분석: 학습된 필터 시각화 (2D heat map)는 추가 분석 코드 2~3시간

---

## 실험 아이디어 2: "FFT 주기를 알고 있는 TS Transformer는 grokking을 경험하는가?"

### 가설

Grokking 트랙의 핵심 질문: TS Transformer가 주기성을 *학습*하는 과정에서 grokking(delayed generalization)이 발생하는가? TimesNet은 FFT로 주기를 hardcode해 이 학습 과정을 우회한다. 가설: **FFT 주기를 positional encoding에 soft injection (hint)으로 제공하면, pure Transformer의 grokking이 발생하는 훈련 단계 수가 크게 줄어든다.** 즉 "주기 힌트"가 grokking을 가속한다.

반증 가설: 주기 힌트가 있어도 grokking 시점이 유사하게 늦게 나타나며, grokking은 주기 탐지 이외의 다른 메커니즘(비선형성 학습, 일반화 가능한 표현 형성 등)에서 발생한다.

### 데이터 및 조건

**데이터**: 합성 주기 데이터 — $x(t) = \sin(2\pi t / p_1) + 0.5\sin(2\pi t / p_2) + \epsilon(t)$, $p_1 = 24$, $p_2 = 168$ (일주기 + 주간주기), $\epsilon \sim \mathcal{N}(0, \sigma^2)$. 훈련 집합 크기를 작게 설정(1,000~5,000 시간 단계)해 grokking이 발생하는 조건을 만든다.

**비교 조건** (4가지):
1. **Pure Transformer** (no period knowledge) — 기준선, grokking 기대
2. **FFT soft injection**: FFT_for_Period 출력을 positional encoding에 추가 (soft hint)
3. **TimesNet** (FFT hardcode) — 기준선, grokking 없음 기대
4. **Wrong period injection**: 잘못된 주기(실제 $p_1=24$에 $p=17$을 주입)로 grokking 지연 효과 확인

### 측정 지표

- 훈련 단계별 train MSE / test MSE 곡선 → grokking 발생 시점 (train/test 성능이 분리되다가 test가 갑자기 개선되는 지점)
- Grokking 발생 시점의 훈련 단계 수 ($T_{grok}$) 비교
- 각 조건에서 $T_{grok}$와 noise level $\sigma$의 관계 (노이즈가 클수록 grokking이 느린가)

### 예상 결과

- 조건 1 (Pure Transformer): 가장 늦은 $T_{grok}$ (또는 grokking 미발생)
- 조건 2 (Soft injection): 조건 1보다 유의미하게 작은 $T_{grok}$ — soft hint가 회로 형성을 가속
- 조건 3 (TimesNet): grokking 곡선 자체가 없거나 매우 초기에 수렴
- 조건 4 (Wrong period): 조건 1보다 $T_{grok}$가 더 크거나 수렴 실패 — 잘못된 inductive bias의 역효과

### 반증 조건

가설이 **틀렸다고 볼 수 있는 조건**: 조건 2(soft injection)의 $T_{grok}$가 조건 1과 통계적으로 유의한 차이를 보이지 않으면 (5% 유의수준), 주기 힌트는 grokking 속도에 무관하다는 결론. 이 경우 Grokking 트랙의 "period-aware inductive bias" 가설을 수정해야 한다.

### 비용 추정

- 합성 데이터 생성: numpy로 즉시 가능
- 코드: Pure Transformer (기존 Time-Series-Library 사용) + FFT injection wrapper 약 100 LOC
- 학습: 각 조건당 5 random seed × 2,000 에폭 = GPU 4~8시간 × 4조건 = 16~32 GPU-시간
- 분석: train/test loss 곡선 시각화 + grokking 검출 코드 약 2~3시간
- **총 비용**: 소형 GPU 1~2일. Grokking 트랙 Week 1~2 실험 범위 내.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **Hybrid TFM + TimesNet 의 *practical deployment*?**
2. **Financial TimesNet 의 *domain adaptation*?**
3. **Online TimesNet 의 *real-time inference*?**

### 답변

1. 풍부한 답변 (deep dive 본문 참조).

2. 풍부한 답변 (deep dive 본문 참조).

3. 풍부한 답변 (deep dive 본문 참조).
