# 7. 이론적 계보

> **🧒 한 줄 요약**: *가계도* — Olsson 2022 / Wang 2022 → ★ ACDC 2023 → SFC / Patchscopes 2024.


## 배경 사다리

이 절을 이해하려면 ① 회로 발견의 *수작업 시기* (2021–2022) 가 Anthropic 의 *transformer-circuits.pub* + OpenAI 의 induction 작업으로 시작됐다는 점, ② 그 작업이 *path patching / activation patching* 이라는 인과적 개입 도구를 만들었다는 점, ③ ACDC 가 그 도구를 *알고리즘화* 한 첫 작업이라는 위치만 알면 된다.

## 이론적 조상 (직계)

### (A1) "A Mathematical Framework for Transformer Circuits" — Elhage et al., Anthropic 2021

**직접 연결**: residual stream 이 *linear additive* 라는 관점, head 의 *Q/K/V/O* 의 분해, *direct path* 와 *indirect path* 의 구별. ACDC 가 *edge 단위 직접 path* 를 prune 할 수 있는 이론적 토대를 박은 작업.

ACDC 의 *그래프 정의* 는 사실상 이 framework 의 *알고리즘적 구현*. framework 가 "residual stream 의 모든 contribution 의 합" 으로 모델을 보는 *관점* 을 줬고, ACDC 가 그 관점을 *prune 가능한 그래프* 로 만들어 회로 발견 자동화에 직접 사용.

### (A2) "In-context Learning and Induction Heads" — Olsson et al., Anthropic 2022 (arXiv:2209.11895)

**직접 연결**: induction circuit = previous-token head + induction head 의 가장 단순한 회로 + phase transition 으로의 자동 형성. ACDC 의 *Induction* task 가 이 회로의 재발견을 평가.

ACDC 가 induction 을 *toy validation set* 으로 쓴 이유 — Olsson 의 회로가 깨끗하고 작아 알고리즘 sanity check 에 이상적. *학습된 모델* (RASP 아님) 에서의 정량 평가.

### (A3) "Locating and Editing Factual Associations in GPT (ROME)" — Meng, Bau et al., NeurIPS 2022 (arXiv:2202.05262)

**직접 연결**: *causal mediation analysis*. 특정 MLP layer 의 활성을 *swap* 하면 사실 회상이 어떻게 바뀌는지를 측정. ACDC 의 *개입 → metric 변화 → 중요도* 의 원형이 ROME 의 *indirect effect* 측정.

ROME 은 *어디서 fact 가 저장됐는가* (node 단위), ACDC 는 *어디서 어디로 흐르는 정보가 행동을 만드는가* (edge 단위). ACDC = ROME 의 *edge 단위 일반화*.

### (A4) "Interpretability in the Wild: A Circuit for IOI in GPT-2 Small" — Wang, Variengien, Conmy et al., ICLR 2023 (arXiv:2211.00593)

**직접 연결**: 같은 Arthur Conmy 가 1 저자 그룹에 속한 작업. IOI 회로를 *손작업으로* 발견. 26 head, 4 class, 인과 흐름 정밀 추적.

ACDC 의 *동기* 가 정확히 "IOI 작업을 자동화하자". IOI task 는 ACDC 의 primary benchmark — 사람이 박사 한 명의 수개월로 찾은 회로를 ACDC 가 *τ 하나* 로 재발견하는지가 ACDC 가치의 *증명*. 1 저자 자기 자신의 전작 자동화라는 점에서 **계보가 가장 직접적**.

## 평행 연구 (비슷한 시기, 다른 접근)

### (B1) "Subnetwork Probing" — Cao, Sanh, Wallace, ACL 2021 (Cao 2021) / Davies et al. 2023

**관계**: ACDC 의 *직접 baseline*. 같은 문제 (희소 회로 추출) 에 *학습 mask* 접근.

**왜 ACDC 가 이긴 영역**: 인과성 보장. SP 의 mask 는 *최소 활성 부분* — 회로의 *기능적 인과* 보장 없음.
**왜 SP 가 이긴 영역**: 평균 ROC AUC (Syed 2024 측정 ≈ 0.692 vs ACDC 0.596). 학습이 더 fine-grained 한 선별.

### (B2) "Attribution Patching" — Syed, Heimersheim, Conmy, BlackboxNLP 2023

**관계**: ACDC 의 *동기 비판*. gradient × activation 의 *linear approximation* 으로 모든 edge 의 attribution 을 *single backward pass* 로 추정.

**ACDC 와의 비교**: cost 가 ACDC 의 1/|E|. 평균 AUC 도 비슷하거나 더 좋음 — *6 task 평균 EAP ≥ ACDC*. ACDC 의 *비용-품질 균형* 을 무너뜨림. 단, ACDC 가 인과성을 *직접* (개입) 검증한다는 보증은 EAP 가 못 줌 — EAP 는 *linearization* 에 의존.

### (B3) "ROME / MEMIT" — Meng et al. 2022 / 2023

**관계**: ACDC 가 *회로 발견*, ROME 이 *회로 편집*. 같은 인과적 개입 toolkit 의 두 응용.

**왜 ACDC 가 다른가**: ACDC 는 *어떤 회로가 있는가* 를 묻고, ROME/MEMIT 은 *어떤 회로를 어디서 어떻게 바꾸는가* 를 답함. 두 방향이 보완적 — ACDC 가 발견한 회로 위에서 ROME 이 편집 가능.

### (B4) "Causal Scrubbing" — Anthropic 2022 (저자 Conmy 등 일부 참여)

**관계**: ACDC 와 *동일한 인과적 검증* 의 *더 엄격한* 형태. 가설된 회로의 *모든 외부 정보 흐름* 을 ablate 해 가설의 *완전성* 을 테스트.

**왜 ACDC 가 다른가**: causal scrubbing 은 *주어진 가설을 검증*, ACDC 는 *가설을 자동 생성*. 둘은 보완적.

## 후손 예측 (실제로 나온 것 인용)

### (C1) "Sparse Feature Circuits" — Marks et al., ICLR 2024 (Marks 2024)

**예측 실현**: ACDC 의 *head/MLP 입도* 가 SAE feature 단위로 일반화. ACDC 의 *edge prune* 절차를 *feature × feature edge* 에 적용. Anthropic 의 monosemantic features (Bricken 2023) + ACDC 의 회로 발견 = SFC.

회로 발견의 입도가 head 에서 feature 로 내려가면서 *polysemantic head 문제* 가 해결된다. ACDC 의 *알고리즘 형식* 은 거의 그대로 유지.

### (C2) "EAP-IG" — Hanna, Lieberum, Pearce et al. 2024 (arXiv:2407.00886)

**예측 실현**: attribution patching 의 *integrated gradient* 버전. 0 활성에서 clean 까지의 적분으로 edge 기여 추정. ACDC 의 cost 문제를 *완전 해결* + linearization 의 한계도 일부 완화.

EAP-IG 는 ACDC 의 *대체* 가 아니라 *Pareto frontier 의 다른 점*. ACDC 는 비용 비싸지만 *인과 검증*, EAP-IG 는 싸지만 *근사 검증*.

### (C3) "HyperDAS / Distributed Alignment Search" — Wu et al., ICLR 2025

**예측 실현**: mech interp 자동화의 *완전 자동화* 시도. *행동 발견* (M1) 까지 LLM 이 함. ACDC 의 자동화가 (M3) 뿐이었던 것을 (M1), (M2), (M3) 전체로 확장.

ACDC 의 *비교 인터페이스* — 알고리즘 + 6 task + ROC AUC — 가 HyperDAS 의 evaluation 표준이 됨.

## 계보 그림 (텍스트)

```
Elhage 2021 (Mathematical Framework)
  ├── Olsson 2022 (Induction Heads)
  ├── Meng 2022 (ROME)
  └── Wang 2023 (IOI) ─── 같은 Conmy 그룹
        │
        ▼
  ACDC 2023 (Conmy et al.) ── 이 논문
        ├── Subnetwork Probing (Cao 2021 baseline)  ── 평행
        ├── Attribution Patching (Syed 2023)        ── 비판
        ├── Causal Scrubbing (Anthropic 2022)       ── 보완
        │
        ▼
  Sparse Feature Circuits (Marks 2024)              ── 후손 (입도 일반화)
  EAP-IG (Hanna 2024)                              ── 후손 (cost 해결)
  HyperDAS (Wu 2025)                                ── 후손 (자동화 확장)
```

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **4 ancestors?**
2. **parallels?**
3. **3 descendants?**

### 답변

1. paper §-references + 본 deep dive 의 cross-reference 기반.

2. ACDC (Conmy 2023) 의 핵심 mechanism (edge-by-edge ablation + KL metric) 의 통합 관점.

3. APF / Grokking 트랙의 baseline — manuscript §1-§6 + Appendix.
