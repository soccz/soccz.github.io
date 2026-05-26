# 8. 내 연구와의 연결

> **🧒 한 줄 요약**: APF + Grokking 연결 — ACDC 가 *circuit identification* baseline.


## 연결 강도 우선 매핑

`_profile.md` 의 관심 영역 §A~F 기준:

- **§B (Mech interp / Circuit Analysis)**: **매우 강함**. ACDC 는 §B 의 핵심 도구. APF + Grokking 양 track 모두에 직접 사용.
- **§C (Attention as Explanation / PE-Attention Geometry)**: **강함 (개입 축)**. APF 의 "motif 의 인과성 검증" 단계가 정확히 ACDC 의 절차.
- **§A (Grokking / Delayed Generalization)**: **중간**. Grokking track 의 *post-phase-transition 회로 분석* 도구로 ACDC 가 backbone.
- **§D (TS Transformer / TSFM interp)**: **약함, 전이 가능성 있음**. 시계열 도메인에서 ACDC 의 직접 적용 사례는 거의 없음 (Kalnāre 2025 가 transformer-based TS classification 에 mech interp 적용한 정도). 시계열 prompt 의 *corrupted distribution* 정의가 비자명.
- **§E, §F**: 직접 연결 약함.

## 보유 자산 (`_profile.md` honest status) 별 연결

### 🟢 APF (Attention Pattern Fields) — Active

**프로파일의 framework**: "PE → 2D attention motif → CNN probe → **causal intervention**".

ACDC 는 마지막 *causal intervention* 단계의 **알고리즘적 backbone**.

#### 흡수할 기법 1: edge-level ablation 절차

APF 의 motif sweep (n=8 / 12, NoPE / sinusoidal / learned / RoPE / ALiBi × diagonal/stripe/block/edge/spike/checker) 에서, 각 motif 가 *downstream task 의 어떤 행동* 에 인과적으로 기여하는지를 검증해야 한다. 현재 APF 의 인과 개입은 "TMAO method" 였고 *n=12 에서 falsified* (프로파일 기록). ACDC 의 *edge-by-edge ablation + threshold τ + KL 메트릭* 절차를 그대로 APF 의 attention pattern 단위에 적용 가능.

**구체 차용 지점**: APF paper 의 §4 (causal intervention) 또는 §5 (motif causality) 에서 — "We adapt the ACDC algorithm (Conmy et al., NeurIPS 2023) to operate on **PE-conditioned attention patterns** rather than head-level edges. Each (layer, head, position-pair, motif-class) tuple is treated as a node; intervention sets the pattern to a baseline drawn from a *PE-mismatched* corrupted distribution. Edges below threshold τ are pruned." 인용 형식.

#### 흡수할 기법 2: 6 task 벤치마크 패키지의 *tracr 류* 부분

APF 의 *motif 가설 검증* 에 RASP 같은 *ground-truth motif 가 명시된* synthetic transformer 가 필요할 때, ACDC 의 tracr-reverse / tracr-xproportion 의 *ground-truth circuit* 접근법을 차용. APF 의 synthetic motif benchmark (trend / seasonal / regime / anomaly / freq drift) 의 각 motif 에 대해 *ground-truth attention pattern* 을 컴파일 (RASP-style) 하고 ACDC 로 인과 검증.

#### 충돌·경쟁 지점

APF 의 주장은 "PE 가 motif 의 *통계적 빈도* 를 결정한다" 다. ACDC 는 *주어진 motif 의 인과성* 만 검증할 뿐 *PE → motif 매핑* 자체는 다루지 않음. 즉 ACDC 는 APF 의 **두 번째 절반** (motif → behavior) 을 검증할 뿐 **첫 번째 절반** (PE → motif) 은 검증 불가.

이 분업이 깨끗하다. APF 의 contribution = 첫 절반 (motif-PE 연결을 *발견*) + 둘째 절반 (motif-behavior 인과를 *검증*). 둘째 절반의 인용은 정직하게 ACDC 에 돌리되, 첫 절반은 APF 의 *novel contribution* 으로 남는다.

#### 인용 포인트 (구체)

APF 논문의 *related work* 또는 *methodology* 에서 다음과 같이 인용:

> "For motif-level causal validation we adapt ACDC (Conmy et al., 2023, arXiv:2304.14997) — specifically the recursive reverse-topological edge ablation with corrupted-distribution baselines. Unlike ACDC's head-level computational graph, our graph nodes are *PE-motif (l, h, p, c)* tuples; edges connect (l, h) → (l', h') when there is a direct residual contribution. Threshold τ is calibrated per motif class to account for scale differences between diagonal and edge-pattern motifs."

#### 반면교사

ACDC 의 *6 task 평균 AUC 0.596* 이 SP 의 0.692 보다 낮음 — APF 가 ACDC 류 인과 검증의 *알고리즘 변종* 을 줄 때 이 약점을 **공정하게 표기**. 즉 APF 의 motif intervention 도 *fair grid* 에서 비교해야 하고, attribution patching (EAP) 류 대안도 같이 평가하는 것이 reviewer 의 첫 질문에 대비.

### 🟢 Grokking in Time Series Transformers — Active

**프로파일의 4-way intersection**: Grokking × TS forecasting × non-stationarity × **circuit analysis**.

마지막 축이 ACDC 의 영역.

#### 흡수할 기법 1: phase transition 직후의 회로 형성 추적

Grokking 의 정의 — *test loss 가 train loss 와 분리되어 갑자기 떨어지는 지점* — 직후에 어떤 회로가 *새로 형성* 됐는지를 ACDC 로 측정. Nanda 2023 의 Progress Measures 가 *Fourier circuit* 을 손작업으로 찾았다면, TS grokking 의 회로는 *어떤* 모양인지를 ACDC 로 자동 추출.

**구체 차용 지점**: Grokking-TS paper 의 §6 (circuit analysis) 또는 §7 (post-grok mech interp) 에서 — "We apply ACDC at three checkpoints: pre-grok (train loss ↓, test ↑), grok-onset (test loss inflection), post-grok (both ↓). The circuit *delta* between checkpoints isolates the *grokking circuit* — the edges that activate during the transition."

#### 흡수할 기법 2: tracr 류 synthetic ground-truth

TS grokking 의 toy 시리즈 (logistic map, sin/periodic, regime-switching synthetic — `_profile.md` 보유 데이터) 에서, *진짜 정답 회로가 알려진* RASP-style 컴파일된 TS-transformer 를 만들고 ACDC 로 검증. 이게 paper plan 의 P2 logistic 4-layer 실험과 직접 연결.

#### 충돌·경쟁 지점

ACDC 는 *동질적 task* (IOI 류 prompt 패턴) 에서 잘 작동. TS grokking 은 *non-stationarity* — regime shift 가 있으면 corrupted distribution 정의 자체가 어려워짐. 한 regime 의 prompt 와 다른 regime 의 prompt 가 *task-relevant 한 정보만 다른* 짝이라는 가정이 깨질 수 있음.

이 충돌이 Grokking-TS paper 의 *방법론 contribution*: regime-aware ACDC. 각 regime 별로 분리된 corrupted distribution 을 정의하고 회로를 비교.

#### 인용 포인트 (구체)

Grokking-TS paper §3 (methodology) 에서:

> "To locate the *grokking circuit* in our TS-Transformer, we adapt the ACDC framework (Conmy et al., 2023, NeurIPS Spotlight). Building on the canonical 3-step mech-interp workflow — (M1) define behavior+metric, (M2) identify abstract units, (M3) edge prune — we extend (M3) to operate across *training checkpoints*: $\tau$ is calibrated per-checkpoint to make the Pareto frontier comparable, and the circuit delta $\Delta E_{t \to t+\Delta t}$ between adjacent checkpoints isolates the edges activated during the grokking transition."

#### 반면교사

Lyle 2025 (covered 2026-05-01) 는 grokking 의 *non-stationarity* 측면을 강조했다. ACDC 의 *stationary task* 가정과 충돌. Grokking-TS 의 방법론 contribution 은 이 충돌의 정직한 직시 — *regime-aware* ACDC + *checkpoint-delta* analysis 가 필요함을 paper §3 에서 명시.

### ⏸️ Paused — P1 ProTran-TFA / P2 Autonomous Research Loop

- P1 ProTran-TFA (probabilistic Transformer 확장, finance venue): ACDC 의 직접 응용 약함. 다만 ProTran 의 attention 의 *어느 head 가 분위수 예측에 인과 기여* 인지 ACDC 로 검증할 가능성 있음. 우선순위 낮음.
- P2 Autonomous Research Loop: daemon 죽음 + 403 hypothesis. ACDC 와 연결 없음.

### 🔴 Shelved — EOA / F6 / Option D / Paper 1-3 / RegFiLM / AETHER

- EOA (economic ODE attention): ACDC 와 *시간축* 정의가 다른 layer. 연결 약함, 전이 가능성만 있음.
- 나머지 shelved 자산: ACDC 와의 직접 연결 부재.

## 인용 형식 초안 (BibTeX)

```bibtex
@inproceedings{conmy2023acdc,
  title={Towards Automated Circuit Discovery for Mechanistic Interpretability},
  author={Conmy, Arthur and Mavor-Parker, Augustine N. and Lynch, Aengus and Heimersheim, Stefan and Garriga-Alonso, Adri{\`a}},
  booktitle={Advances in Neural Information Processing Systems},
  year={2023},
  note={Spotlight}
}
```

`Attention Pattern Fields/PRIOR_ART.md` 에 추가할 한 줄:

> Conmy et al. 2023 (ACDC) — edge-level causal pruning for circuit discovery; we adopt the recursive reverse-topological intervention as the motif-causal-intervention backbone of APF §4, and report a Pareto frontier in (motif retention) × (downstream metric loss).

`Grokking in Time Series Transformers/references/must_cite.md` 의 Tier 2 (mech interp methodology) 에 다음 한 줄 추가:

> Conmy 2023 (ACDC) — automated circuit discovery via recursive reverse-topological edge ablation; we adapt for *checkpoint-delta circuit analysis* of the grokking transition.

## 일반론이 아닌 한 줄 요약

> APF §4 의 motif causal intervention 의 알고리즘 변종 + Grokking-TS §3 의 checkpoint-delta circuit isolation 의 알고리즘 backbone — 단, 두 응용 모두 ACDC 의 *greedy + 단일 τ* 한계를 *그대로 상속* 한다는 점은 limitation 절에서 정직하게 노출.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **APF 와의 integration?**
2. **Circuit identification baseline?**
3. **Reviewer expectation?**

### 답변

1. paper §-references + 본 deep dive 의 cross-reference 기반.

2. ACDC (Conmy 2023) 의 핵심 mechanism (edge-by-edge ablation + KL metric) 의 통합 관점.

3. APF / Grokking 트랙의 baseline — manuscript §1-§6 + Appendix.
