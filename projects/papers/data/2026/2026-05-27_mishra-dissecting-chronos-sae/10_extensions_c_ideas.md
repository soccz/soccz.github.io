# 10_extensions_c — 사고 확장: 실험 아이디어

두 가지 독립적인 실험 아이디어를 제시한다. 각각 완전한 설계를 포함한다.

---

## 실험 아이디어 1: Grokking Transition과 SAE 특징 계층 형성의 인과 순서

### 가설

TS Transformer가 grokking transition을 경험할 때, SAE 특징의 interpretable 비율이 급격히 증가한다. 이 증가는 test-CRPS 개선보다 **먼저** 발생하여 grokking의 선행 신호(precursor)가 된다.

형식화:

$$t^*_{\text{feature}} < t^*_{\text{grokking}}$$

여기서 $t^*_{\text{feature}}$는 interpretable_ratio가 급증하는 시점, $t^*_{\text{grokking}}$는 test-CRPS가 급감하는 시점.

### 데이터

- **시계열**: ETT-mini (Grokking 트랙 보유 데이터)
- **모델**: Chronos-T5-Mini (가장 작은 버전, 파라미터 ∼10M)
- **훈련 데이터**: ETT-mini의 80% (훈련) / 20% (테스트)

### 실험 조건

**체크포인트**: 훈련 스텝 {500, 1K, 2K, 5K, 10K, 20K, 50K}에서 모델 저장

각 체크포인트마다:
1. encoder.block.{2, 5, 11}에서 활성화 추출 (각 추출점 50K 윈도우)
2. TopK-SAE 훈련 (d_sae=2048, k=32, 10K 스텝, 빠른 버전)
3. taxonomy 분류 (11-class) → interpretable_ratio 계산
4. decoder-norm 상위 64개 특징의 단일 절제 → 평균 ΔCRPS 계산
5. test-CRPS 측정 (num_samples=20)

### 예상 결과

- **Hypothesis A (가설 지지)**: interpretable_ratio 급증이 t*=10K 스텝에서, test-CRPS 급감이 t*=20K 스텝에서 발생 → 특징 계층이 grokking을 선도함.
- **Hypothesis B (가설 반박)**: 두 시점이 동시이거나 순서가 역전 → 특징 계층 형성이 grokking의 원인이 아닌 결과.
- **중간 결과**: interpretable_ratio가 단조 증가하고 grokking transition이 없음 → ETT-mini에서는 grokking이 발생하지 않음 (null result, 별도 실험 필요).

### 반증 기준

다음 결과가 나오면 가설 기각:
1. interpretable_ratio의 급격한 불연속 변화가 관찰되지 않음 (단조 증가만)
2. t*_feature > t*_grokking (특징 형성이 성능 개선보다 늦음)

### 비용 추정

- GPU: NVIDIA A100 1장, 약 12시간 (Mini 모델 × 7 체크포인트 × SAE 훈련)
- 코드: Chronos GitHub + "temporal-monosemanticity" GitHub 조합
- 기간: 2주 (코드 셋업 1주 + 실험 1주)

---

## 실험 아이디어 2: Level Shift Activation Steering — Chronos의 돌발 사건 예측 개선

### 가설

encoder.block.11의 feat#4616 (level_shift 관련, ΔCRPS=38.61)을 돌발 사건 입력 시 인위적으로 강화(activation steering, 계수 +α)하면, 해당 돌발 사건 구간의 CRPS가 감소한다. 반대로 계절성 패턴 구간에서는 이 특징을 강화해도 CRPS가 변하지 않거나 악화된다.

형식화:

$$\text{CRPS}(\text{f}_{4616} + \alpha) < \text{CRPS}(\text{original}) \quad \text{(레벨 시프트 구간에서)}$$
$$\text{CRPS}(\text{f}_{4616} + \alpha) \approx \text{CRPS}(\text{original}) \quad \text{(정상 구간에서)}$$

### 데이터

- **ETT 데이터**: ETTh1 (훈련/테스트 표준 분할)
- **레벨 시프트 구간 식별**: Bai-Perron breakpoint detection으로 ETTh1의 레벨 시프트 시점을 자동 탐색 → 전후 64 스텝 윈도우를 "레벨 시프트 구간"으로 지정
- **정상 구간**: 레벨 시프트 구간 외 무작위 샘플링 64개 윈도우

### 실험 조건

```python
# 인코딩 단계에서 feat#4616 계수 조작
f = TopK(W_enc @ x + b_enc)  # 기존 인코딩
f_steered = f.clone()
f_steered[4616] = f_steered[4616] + alpha  # steering
x_steered = W_dec @ f_steered + b_dec      # 수정된 활성화 주입
```

**α 스윕**: α ∈ {0, 0.5, 1.0, 2.0, 5.0, 10.0} (기존 계수 크기 대비 상대값)

**측정**: 각 α에서 (1) 레벨 시프트 구간 CRPS, (2) 정상 구간 CRPS, (3) 전체 ETT CRPS

**비교 그룹**: 
- 그룹 A: feat#4616만 steering
- 그룹 B: decoder-norm 상위 10개 특징 동시 steering
- 그룹 C: 랜덤 10개 특징 steering (대조군)

### 예상 결과

**기대 패턴**:
- 레벨 시프트 구간: α=1.0~2.0에서 CRPS 최소값 (역U자 곡선 — 너무 강하면 과보정)
- 정상 구간: α에 관계없이 CRPS 변화 미미 (특이성 확인)
- 랜덤 특징 steering(대조군): 모든 구간에서 CRPS 악화

**함의**: 이 결과가 재현되면 "SAE 특징 조작을 통한 선택적 성능 개선"이 가능함을 최초로 보임. 금융 시계열(fat-tail events)에 대한 같은 실험이 즉시 가능한 확장이다.

### 반증 기준

1. α > 0 에서 레벨 시프트 구간 CRPS가 개선되지 않음 (단조 증가 또는 무변화)
2. 정상 구간과 레벨 시프트 구간의 CRPS 변화 패턴이 동일함 (특이성 없음)
→ 이 경우 feat#4616이 인과적으로 중요하되 steering으로는 제어되지 않음을 의미. 인과 방향이 "활성화 강도 ↔ 예측 품질"의 단순 선형 관계가 아님을 시사.

### 비용 추정

- GPU: A100 1장, 약 4시간 (Chronos-T5-Large는 이미 사전학습, SAE만 로드하면 됨)
- 코드: "temporal-monosemanticity" 코드 + steering 루프 추가 (∼100줄 수정)
- 기간: 1주 (코드 수정 2일 + 실험 + 분석 각 2일)
- **현실 제약**: feat#4616이 실제로 level_shift에 관여하는지 SAE 시각화로 먼저 확인 필요. 만약 feat#4616이 다른 개념에 관여한다면 실험 설계를 수정해야 한다.

---

## 두 아이디어의 상보성

| 항목 | 아이디어 1 (Grokking×SAE) | 아이디어 2 (Steering) |
|------|--------------------------|---------------------|
| **목적** | 이해 (grokking의 mechanistic 설명) | 제어 (예측 성능 개선) |
| **결과 형태** | 분석 논문 (interpretability 기여) | 응용 논문 (CRPS 수치 개선) |
| **연결 트랙** | Grokking 트랙 | APF 트랙 + ProTran |
| **비용** | 12시간 GPU | 4시간 GPU |
| **위험도** | 중간 (null result 가능성 있음) | 낮음 (선행 결과 명확) |
| **기간** | 2주 | 1주 |

두 실험이 모두 성공한다면, "Dissecting Chronos"의 분석 → "grokking transition" 발견 → "steering으로 개선"이라는 하나의 내러티브가 형성된다. 이것이 APF + Grokking 두 트랙을 SAE라는 공통 언어로 연결하는 방향이다.

---

*→ 이전: `10_extensions_b_followups.md` | 다음: `11_verdict.md`*
