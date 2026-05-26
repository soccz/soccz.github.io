# 9c. 사고 확장 — 실험 아이디어 2개

> **🧒 한 줄 요약**: 내 아이디어: financial phase diagrams, attention thermodynamic, foundation model phases.


---

## 아이디어 1: TS 예측에서의 ($\alpha$, $\lambda$) 위상 다이어그램 구축

### 가설

Liu (2022)의 4-위상 구조(comprehension / grokking / memorization / confusion)가 시계열 예측 과제에서도 관찰된다. 구체적으로, (훈련 데이터 비율, weight decay 강도) 평면에서 PatchTST/iTransformer를 ETTh1/Weather 데이터셋에 학습시키면, 정성적으로 유사한 위상 경계가 나타날 것이다.

### 데이터

- **1차**: ETTh1 (hourly electricity transformer temperature, 7 features, 17,420 timesteps) — TS 벤치마크 표준
- **2차**: Weather (21 features, 52,696 timesteps) — 더 큰 데이터로 확장성 검증
- **3차**: Logistic map synthetic (Grokking track 이미 보유, 결정론적 카오스 → 군 구조 부재)

### 비교 조건

- **모델**: PatchTST (patch-level attention, 이미 커버) + iTransformer (variate-level attention, 이미 커버)
- **$\alpha$ range**: 0.1, 0.2, 0.3, ..., 0.9 (훈련 비율)
- **$\lambda$ range**: $10^{-5}, 10^{-4}, 10^{-3}, 10^{-2}, 10^{-1}$ (weight decay)
- **총 격자점**: 9 × 5 = 45 per (model, dataset) 조합 → 45 × 2 × 3 = 270 실험
- **각 실험 예산**: $10^5$ 스텝 (Grokfast 적용 시 $10^4$ 스텝으로 축소 가능)

### 위상 분류 기준 (TS용 재정의)

| 위상 | 조작적 정의 (회귀 버전) |
|------|----------------------|
| Comprehension | Train MSE < $\theta_t$ AND Test MSE < $\theta_s$ (빠르게) |
| Grokking | Train MSE < $\theta_t$ 후 $\Delta$ 스텝 이상 지연 후 Test MSE < $\theta_s$ |
| Memorization | Train MSE < $\theta_t$ AND Test MSE > $\theta_s$ (끝까지) |
| Confusion | Train MSE > $\theta_t$ (끝까지) |

$\theta_t, \theta_s$는 데이터셋별 적절한 임계 MSE, $\Delta$는 지연 임계(예: train 수렴 후 $5 \times T_{\text{train\_converge}}$).

### 예상 결과

- ETTh1/Weather: 약한 4-위상 구조. 경계가 알고리즘적 과제보다 흐릿(crossover). Grokking zone이 좁거나 부재할 수 있음 — 이것 자체가 중요한 음성 결과(negative result).
- Logistic map: 결정론적 규칙이 있으므로 grokking 가능성 높음. 다만, 카오스의 초기값 민감성 때문에 "구조화 표현"의 형태가 $\mathbb{Z}_n$과 달라야 함.

### 반증 조건

- 어떤 $(\alpha, \lambda)$ 조합에서도 "train 수렴 후 test 지연 수렴" 패턴이 관찰되지 않으면, TS 예측에서는 grokking이 발생하지 않는다는 강한 증거.
- 이 경우, TS의 연속 도메인 특성(이산 군 구조 부재)이 grokking의 필요 조건임을 시사 → 논문의 방향을 "왜 TS에서는 grokking이 안 일어나는가?"로 전환.

### 비용 추정

- 270 실험 × $10^5$ 스텝 ≈ 단일 GPU (RTX 3090) 기준 PatchTST 약 2~3시간/실험 → ~600 GPU-hours ≈ 25일 (1 GPU) 또는 3~4일 (8 GPU)
- Grokfast 적용 시 ~60 GPU-hours로 축소

---

## 아이디어 2: Grokking 전/후의 임베딩 기하학 비교 via Causal Intervention

### 가설

Liu (2022)의 핵심 주장 — "구조화 임베딩의 출현이 일반화의 원인" — 을 causal intervention으로 검증한다. 구체적으로, grokking 후 학습된 구조화 임베딩을 인위적으로 파괴하면 일반화가 사라지고, memorization 단계의 비구조화 임베딩을 인위적으로 구조화하면 일반화가 출현할 것이다.

### 데이터

- $\mathbb{Z}_{97}$ 모듈러 덧셈 (Liu 2022 원 세팅과 동일하게 시작)
- 이후 ETTh1 시계열로 확장 (아이디어 1의 grokking이 관찰되었다면)

### 비교 조건

**Intervention A — 구조 파괴 (grokking 후)**:
1. Grokking이 완료된 모델 (train & test accuracy 모두 높음) 확보
2. 임베딩 벡터들을 단위 구 위에서 무작위로 재배치 (방향을 섞되 크기 유지)
3. 나머지 파라미터(readout, attention weights 등) 고정
4. Test accuracy 측정 → 급락하면 "구조화 → 일반화" 인과 지지

**Intervention B — 구조 주입 (memorization 단계)**:
1. Memorization 단계의 모델 (train 높음, test 낮음) 확보
2. 임베딩을 Liu (2022)가 관찰한 "올바른 구조"(원형 배치)로 강제 설정
3. 나머지 파라미터 고정 상태에서 test accuracy 측정 → 향상되면 인과 지지
4. 변형: 임베딩을 원형으로 고정하고 readout만 재학습 → 일반화 회복 여부

**Intervention C — 구조화 가속 초기화**:
1. 표준 무작위 초기화 vs. 원형 구조 초기화에서 grokking 속도 비교
2. 원형 초기화가 grokking을 가속하면, "구조화가 병목"이라는 Liu의 핵심 주장을 확인

### 예상 결과

- Intervention A: 임베딩 파괴 → test accuracy 급락 (Liu의 주장과 일치). 단, readout layer가 원래 구조에 맞춰 학습되었으므로, 임베딩 파괴 시 readout도 무용지물이 되는 것은 자명 — 이것이 진정한 인과 증거인지 단순한 입출력 불일치인지 분리가 필요.
- Intervention B: 구조 주입 → 부분적 일반화 향상. 완전한 회복은 어려울 수 있음 (readout이 구조화 임베딩에 맞춰 학습되지 않았으므로).
- Intervention C: 원형 초기화 → grokking 가속 (가장 깔끔한 인과 증거가 될 것).

### 반증 조건

- Intervention A에서 임베딩 파괴해도 test accuracy 유지 → 일반화가 임베딩 구조가 아닌 다른 요인(예: weight 행렬의 구조)에 의존.
- Intervention C에서 원형 초기화와 무작위 초기화의 grokking 속도 차이 없음 → 초기 임베딩 구조보다 학습 역학(SGD + weight decay)이 지배적.

### 비용 추정

- $\mathbb{Z}_{97}$ 실험: 단일 GPU 수 시간. Intervention 3종 × 5 시드 = 15 실험, 각 ~1시간 → ~15 GPU-hours.
- ETTh1 확장: 위상 다이어그램에서 grokking 관찰 점 선택 후 intervention → 추가 ~20 GPU-hours.
- 총: ~35 GPU-hours (1 GPU 기준 ~2일).

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **10_extensions_c_ideas *핵심 claim*?**
2. **10_extensions_c_ideas *technical detail*?**
3. **10_extensions_c_ideas *implication*?**

### 답변

1. 풍부한 답변 (deep dive 본문 참조).

2. 풍부한 답변 (deep dive 본문 참조).

3. 풍부한 답변 (deep dive 본문 참조).
