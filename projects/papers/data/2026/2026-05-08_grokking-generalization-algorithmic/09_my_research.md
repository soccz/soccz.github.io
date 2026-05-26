# 09 — 내 연구와의 연결

> **🧒 한 줄 요약**: 내 연구 (APF) 와 연결: grokking 현상이 *real reasoning model* 에 적용 가능성.


> **이 절에서 참조하는 내 연구**: `_profile.md`의 §A (Grokking axis), §B (Mech interp), §C (Attention-PE geometry), §D (TS Transformer), §F (원거리). 주요 active 프로젝트: Grokking in TS Transformers (active §A/§B), APF (active §B/§C).

---

## 핵심 연결: Grokking in TS Transformers (§A — 직접 연결)

**Power 2022는 내 Grokking track의 직접 출발점 논문이다.**

내 프로젝트 "Grokking in TS Transformers"는 "Grokking × TS forecasting × non-stationarity × circuit analysis 4-way intersection"을 목표로 한다. 이 교차점의 첫 번째 꼭짓점인 "Grokking"이 Power 2022에서 정의되고 실험적으로 기록됐다.

### 인용 포인트 1 — 그로킹 현상 정의

내 논문의 서론(Introduction) 또는 배경(Background) 섹션에서:

> "Grokking, first identified by Power et al. (2022), refers to the phenomenon whereby a neural network achieves perfect training accuracy but only reaches perfect generalization accuracy after continued optimization—often by orders of magnitude more steps. In this work, we investigate whether an analogous phenomenon arises in Transformer-based time series forecasting under distribution shift."

**구체 연결**: Power 2022가 정의한 그로킹의 두 핵심 구성 요소 — (1) 훈련 정확도의 이른 완벽화, (2) 검증 정확도의 지연된 완벽화 — 를 TS 도메인에서 어떻게 측정할지가 내 프로젝트의 첫 번째 방법론 문제다. 모듈 산술에서는 "검증 정확도"가 명확하지만, TS 예측에서는 "그로킹이 일어났다"는 기준을 MSE 기반으로 정의해야 한다.

**내가 해결해야 할 확장 문제**: Power 2022는 이산 분류 과제 (정확히 맞거나 틀리거나)에서 그로킹을 관찰한다. TS 예측은 연속 회귀 과제이므로, "그로킹 지점"을 in-sample MSE와 out-of-sample MSE의 괴리로 정의해야 한다. 이 정의 문제가 아직 해결되지 않았다.

---

### 인용 포인트 2 — 위상 다이어그램과 TS 버전의 위상 지도

Power 2022의 (weight decay × 데이터 비율) 위상 다이어그램은 내 연구에서 유사한 분석 프레임이 필요함을 보여준다. 내 TS 버전에서는:

- X축: 훈련 시퀀스 길이 (또는 데이터 비율)
- Y축: 분포 변화(Distribution shift) 강도
- 4구역: 빠른 적응 / 그로킹 / 암기 / 혼돈

이 위상 지도가 TS Transformer에서도 성립하는지가 내 P2 실험의 핵심 질문 중 하나다.

**인용 형태**: 내 논문 Methods 섹션에서 "We adopt the phase diagram framework introduced by Power et al. (2022) to characterize the generalization behavior of our models, adapting the axes from (weight decay, data fraction) to (distribution shift intensity, training window length)."

---

## 연결 2: APF — Attention Pattern Fields (§B/§C — 간접 연결)

APF는 PE(위치 인코딩) × 어텐션 패턴의 인과 관계를 연구한다. Power 2022와의 연결은 다음 두 경로로 이뤄진다:

### 경로 2a — 회로(Circuit)의 형성 조건

Power 2022는 weight decay가 그로킹을 유발하고, 이후 Nanda 2023이 그로킹된 모델에서 Fourier 회로를 발견했다. 이 계보에서 중요한 질문이 생긴다:

> "APF에서 관찰하는 어텐션 모티프(diagonal, stripe, block, edge)는 어떤 훈련 조건에서 어떤 순서로 형성되는가? 혹시 이것도 그로킹 유사 위상 전이로 설명될 수 있는가?"

즉, APF의 "motif 인과성" 실험에서 관찰하는 어텐션 패턴 변화가 Power 2022의 위상 전이 프레임으로 해석될 여지가 있다. 이것은 직접 연결이 아니라 **아이디어적 전이 가능성**이다.

**구체 메커니즘**: APF의 TMAO(훈련 단계별 motif 출현 순서) 실험이 n=12에서 falsified됐다. Power 2022의 관점에서 이를 재해석하면: "TMAO가 관찰되지 않는 것이 실험 규모 문제인가, 아니면 motif 형성이 그로킹처럼 훨씬 긴 훈련이 필요한 것인가?"

### 경로 2b — Sinusoidal PE의 Fourier 구조

Power 2022의 모델은 **sinusoidal positional encoding**을 사용한다 (코드 확인). Nanda 2023이 발견한 Fourier 회로가 이 sinusoidal PE와 어떻게 상호작용하는지가 APF의 §C 축 (PE-Attention Geometry)과 직결된다.

**인용 형태 (APF 논문용)**: "We note that the 'Fourier circuit' mechanism discovered by Nanda et al. (2023) in models trained to grok modular arithmetic operates on sinusoidal position encodings similar to those used in our attention pattern analysis (Power et al., 2022). This suggests that PE geometry may be a contributing factor not only to attention motif formation but also to the emergence of algorithmic circuits."

---

## 연결 3: Regularization이 Interpretability에 미치는 영향 (§B)

Power 2022의 핵심 발견 중 하나는 weight decay가 암기에서 알고리즘적 해로의 전환을 유도한다는 것이다. 이것은 interpretability 연구에 중요한 함의를 가진다:

**흡수할 기법**: 내 APF와 Grokking 프로젝트 모두에서, "정규화 강도가 회로의 해석 가능성(interpretability)에 미치는 영향"을 실험할 때 Power 2022의 위상 다이어그램 프레임을 참조할 수 있다. 구체적으로: 강하게 정규화된 모델은 "단순하고 해석 가능한" 어텐션 패턴을 사용할 가능성이 높다.

**내 논문 §3.2 (가설)에 직접 인용 가능**: "Following Power et al. (2022), we hypothesize that strong regularization (weight decay) induces not just generalization but also interpretable circuit formation, as the model is forced to adopt parsimonious representations."

---

## 충돌/경쟁 지점

**충돌 1**: Power 2022는 소규모 이산 데이터에서의 그로킹을 연구한다. 내 TS 프로젝트는 연속 실수값 예측이므로, "일반화가 갑자기 일어나는가?"를 같은 방식으로 측정할 수 없다. 이 갭은 내 방법론의 첫 번째 도전이다 — 해결책은 아직 없으므로, 논문에서 "이 논문은 Power 2022의 이산 분류 프레임을 연속 예측에 적응시킨 첫 시도"로 포지셔닝.

**충돌 2**: Power 2022의 그로킹은 weight decay가 필수적으로 관여한다. 그러나 내 TS Transformer 실험에서는 standard AdamW weight decay가 이미 기본 설정에 포함돼 있다. "이미 weight decay가 있는 설정에서도 그로킹 유사 현상이 관찰되는가?"가 질문이므로, 내 실험 설계가 Power 2022와 다른 레짐일 수 있다.

---

## 반면교사

Power 2022가 못한 것:
1. "왜" 그로킹이 일어나는지 메커니즘 제시를 하지 않음 → 내 논문은 회로 분석(circuit analysis)으로 "왜"를 제시하려 한다
2. TS 등 연속 데이터로 확장하지 않음 → 내 프로젝트의 존재 이유
3. 비정상성(non-stationarity)과의 연결 제시 없음 → Lyle 2025가 부분적으로 채웠고 내 프로젝트가 더 깊이 파고든다

---

## 연결 강도 요약

| 연구 프로젝트 | 연결 강도 | 연결 축 |
|-------------|---------|--------|
| Grokking in TS Transformers | **매우 강함** | §A: 출발점 논문 |
| APF (mech-interp tooling) | **중간** | §B/§C: 회로 형성 프레임 |
| P1 ProTran-TFA | **약함** | §F: 훈련 dynamics 참조 가능하나 직접 연결 없음 |

---

## 구체적 논문 작성 계획 (내 Grokking 논문 §2 배경 섹션)

내 논문의 §2 Background에서 Power 2022를 다음 순서로 인용·활용해야 한다:

### §2.1 Grokking 정의 및 선행 연구

**초안 문장 (영문)**:
> "We build on the grokking phenomenon first identified by Power et al. (2022), in which a transformer trained on small algorithmic datasets achieves perfect training accuracy in approximately $10^3$ steps but only reaches perfect validation accuracy after $10^6$ or more steps—well past the point of overfitting. We extend this framework from discrete algebraic tasks to continuous time series forecasting, where the notion of 'algorithmic generalization' must be reformulated in terms of distributional robustness rather than binary classification accuracy."

**왜 이 형태**: Power 2022를 직접 인용하면서 내 연구의 차별점 (discrete → continuous, 분류 → 회귀, 대수 구조 → 분포 변화)을 동시에 명시한다.

### §2.2 정규화와 일반화의 관계

**초안 문장**:
> "Power et al. (2022) demonstrate that weight decay is 'particularly effective at improving generalization' on these tasks, suggesting that L2 regularization induces a bias toward parsimonious algorithmic representations over memorizing solutions. We leverage this finding to formulate Hypothesis H2 (Section 3.2): that in time series forecasting, weight decay similarly biases the model toward generalizable temporal patterns rather than in-sample interpolation."

이 인용 형태는 Power 2022의 경험적 발견을 내 이론적 가설의 동기로 활용한다.

---

## 실제 실험 코드 상에서의 기술적 연결

Power 2022의 공식 코드(`github.com/openai/grok`)는 내 Grokking 실험의 기술적 참조점이 된다:

1. **Architecture 재사용 가능성**: `grok/transformer.py`의 2-layer decoder-only Transformer를 TS 예측 Transformer의 베이스라인으로 사용할 수 있다 (d_model, n_heads는 다르게 설정하더라도 구조는 동일)
2. **Optimizer 참조**: `CustomAdamW`의 β₂=0.98 설정이 표준보다 최신 gradient에 민감하다는 것을 알고, 내 실험에서 같은 β₂=0.98을 쓸지 표준 0.999를 쓸지 결정해야 함
3. **위상 다이어그램 코드**: 2D 파라미터 스윕(weight decay × 데이터 크기) 실험 설계를 참조해 나의 (weight decay × non-stationarity) 스윕을 설계할 수 있음

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **09_my_research *핵심 claim*?**
2. **09_my_research *technical detail*?**
3. **09_my_research *implication*?**

### 답변

1. 풍부한 답변 (deep dive 본문 참조).

2. 풍부한 답변 (deep dive 본문 참조).

3. 풍부한 답변 (deep dive 본문 참조).
