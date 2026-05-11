# 2. 문제 지형도

## 배경 사다리

이 절을 이해하려면 ① Transformer 의 **residual stream** 이 "모든 layer 의 출력이 누적되어 흐르는 1 차원 wire" 라는 점, ② mech interp 의 핵심 가정 — "특정 행동은 모델 안 **소수의 컴포넌트** (attention head 몇 개 + MLP 몇 개) 가 협력해 만든다" — 이라는 점, ③ "회로 (circuit)" 가 그 컴포넌트들 + 그 사이 연결의 **sub-graph** 라는 점, 이 세 가지만 알면 된다. circuit 이 발견된 가장 유명한 예 = IOI (Indirect Object Identification, Wang et al. 2023): "Mary and John went to the store. John gave a drink to ___" 에서 GPT-2 small 이 *Mary* 를 예측하는 26 개 attention head 의 4 클래스 회로.

## 실제 문제: 손작업 회로 발견의 비용

2022–2023 의 mech interp 흐름은 이런 식이었다.

- **사례 1 — IOI (Wang 2023)**: GPT-2 small 의 144 head 중 어느 26 개가 indirect object 를 예측하는지, 그 26 개가 4 개 기능 클래스 (Duplicate Token Heads / Previous Token Heads / S-Inhibition Heads / Name Mover Heads) 로 어떻게 묶이는지, 클래스 사이 인과 흐름은 어떤지를 — **수개월의 손작업** 으로 분리했다. 사용한 도구: path patching, KO ablation, score 분석.
- **사례 2 — Greater-Than (Hanna 2023)**: "The war lasted from the year 1740 to 17 __" 에서 GPT-2 small 이 두 자리 숫자를 ">40" 분포로 예측하는 회로. 역시 수개월 작업.
- **사례 3 — Induction Heads (Olsson 2022)**: 가장 단순한 in-context 학습 회로 (previous-token head + induction head 2-layer) 가 phase transition 으로 형성됨을 보임.

이 흐름의 공통 문제는 **확장성 부재** 다. 각 행동마다 사람이 모델을 들여다보고, 가설을 세우고, ablation 을 손으로 짜고, 결과를 해석한다. 회로 1 개당 박사과정 학생 한 명의 수개월. 이러면 mech interp 가 LLM 의 행동 수 (수천 수만) 를 따라가지 못한다. 도구 사다리에서 자동화가 빠지면 분야는 결국 *anecdote* 의 박물관이 된다.

## 기존 접근 계보 (연대순)

### (A) Activation patching / Causal mediation (Vig 2020, Meng 2022 ROME)

**무엇이었나**: 특정 input 의 컴포넌트 활성을 다른 input 의 활성으로 *swap* 하고 출력 변화를 측정. 인과 경로 분리의 기본 도구. ROME 은 한 발 더 가서 specific MLP layer 의 활성을 *edit* 해 사실 회상 (Eiffel Tower → Rome) 을 옮긴다.

**왜 부족했나**: "어느 컴포넌트가 중요한가" 까지만 알려준다. 컴포넌트 사이의 **연결** (어떤 화살표가 정보를 옮기는가) 은 사람이 일일이 path patching 으로 다시 풀어야 한다.

**남긴 교훈**: 개입은 회로 발견의 핵심 원자다. ACDC 는 이걸 edge-단위로 잘게 삐개 자동 반복한다.

### (B) Path patching / Iterative patching (Wang 2023 IOI, Goldowsky-Dill 2023)

**무엇이었나**: 두 개의 hook (sender, receiver) 을 두고, sender 의 출력이 receiver 까지 어떤 경로로 흐러가는지를 측정. IOI 의 26-head 회로는 이 도구의 손작업 적용 결과.

**왜 부족했나**: 경로마다 사람이 설계해야 함. 모델이 커지면 경로 조합이 폭발.

**남긴 교훈**: edge (= path 의 일반화) 단위 개입이 올은 입도. ACDC 는 이걸 *모든* edge 에 대해 자동 시도.

### (C) Subnetwork Probing / Mask learning (Cao 2021, Davies 2023)

**무엇이었나**: 각 컴포넌트에 학습 가능한 mask (continuous → Gumbel-Sigmoid) 를 붙이고, "mask 가 켜진 부분만으로도 task 가 풀린다" 는 sparse mask 를 SGD 로 학습. ACDC 의 직접 비교 baseline.

**왜 부족했나**: (1) 학습이라는 의존성 — sparsity coefficient + mask 학습 epoch + reg loss 등 hyperparam 다중. (2) mask 의 의미가 회로의 "구조" 라기보단 "최소 활성 부분" 에 가까움 — head 차원에서 좋아도 edge 수준 인과성은 잃기 쉬움. (3) optimization 잡음.

**남긴 교훈**: 회로 발견에 두 흐름 — **개입 기반 (ACDC)** vs **학습 기반 (SP)** — 이 있다는 명시적 비교 축의 정립.

### (D) HISP / Head Importance Score for Pruning (Michel 2019, Voita 2019)

**무엇이었나**: 각 head 의 *gradient × activation* 으로 중요도 점수를 매기고, 낮은 점수부터 prune. NLP 의 head pruning literature 의 표준.

**왜 부족했나**: head 단위 점수라 edge 단위 회로 구조를 못 줌. 또 task 의 메트릭이 변하지 않더라도 score 가 들쎄날쎄. ACDC 가 사용하는 *intervention 기반 metric drop* 보다 noisy.

**남긴 교훈**: gradient-based attribution 의 효율성은 매력 — 이게 정확히 후속 *attribution patching* (Syed 2023) 이 ACDC 를 추월하는 입구.

### (E) Sparse autoencoder / dictionary learning (Bricken 2023, Marks 2024 SFC)

**무엇이었나**: 직접적 head/MLP 단위 회로가 아니라, **features** (residual stream 에 dictionary learning 으로 학습된 sparse basis) 단위로 분해. ACDC 와 다른 입도.

**왜 부족했나** (당시 ACDC 와 비교 관점): SAE feature 의 의미를 사람이 일일이 라벨링해야 함. 회로의 *기능 단위* 가 명확하지 않으면 회로 그림이 안 그려짐.

**남긴 교훈**: ACDC 의 후신 (SFC) 가 이 흐름과 결합 — feature × feature edge 단위로 ACDC 를 일반화.

## 공통 gap

기존 흐름은 (a) **개입 측면**: head/MLP 단위까지만 (edge 단위 자동화 부재), (b) **자동화 측면**: gradient/learning 기반은 noisy + opaque, (c) **벤치마크 측면**: 정답 회로 데이터셋 부재. 합치면 **"개입 기반 + edge 단위 + 단일 hyperparameter + 정답 회로로 검증"** 의 빈 칸.

## 이 논문이 그 gap 을 어떻게 메우나

ACDC 는 (a) edge 단위 개입을 (b) 역위상정렬 greedy 라는 단일 알고리즘으로 (c) threshold τ 라는 단일 hyperparameter 로 묶고, (d) IOI / Greater-Than / Docstring / tracr-reverse / tracr-xproportion / Induction 6 개 태스크의 ground-truth 회로와 비교 가능한 ROC 벤치마크 패키지를 함께 푸다. 알고리즘의 weakness (greedy, 비용) 는 명시적이고, baseline (SP, HISP) 과의 비교에서 SP 가 평균 AUC 에서 약간 이긴다는 사실도 표에 노출한다. 이 솔직함이 후속 비판 (attribution patching, EAP) 의 진입을 용이하게 했다 — 즉 ACDC 는 자신을 일부러 **명확한 비교 기준** 으로 박은 작업이다.
