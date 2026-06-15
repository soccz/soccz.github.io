# 10b · Follow-up 논문 3 편

## 배경 사다리
선행 1 / 경쟁 1 / 후속 1 의 trio. 각 논문이 본 논문과 어떤 관계이고, 무엇을 추가로 얻을 수 있는지.

---

## (선행) Olsson et al. — In-context Learning and Induction Heads (Anthropic 2022, arXiv:2209.11895)

**어떤 논문인가**: Anthropic 의 mech interp 분야 초기 대표작. Attention-only transformer + small full Transformer 의 in-context learning 능력이 **induction head** 라는 2-layer composition (previous-token head + induction head) 에서 emerge 함을 phase change 추적과 함께 보임. 본 논문의 induction class (4 head, layer 5-6) 의 직접 prequel.

**본 논문과의 관계**:
- **재사용 가능 부품 (induction head) 의 발견** → 본 논문이 IOI 회로의 한 class 로 instantiate.
- **Phase change 추적 (학습 동안 능력 emerge)** → 본 논문에서는 단일 weight snapshot 만, Olsson 은 시간축. Grokking thesis 의 영감원이 됨.
- **회로 식별의 표준 establish** → 본 논문이 그 표준을 자연어 task 로 격상.

**무엇을 얻을 수 있나** (사용자 입장):
1. **Induction head 의 정확한 정의** — APF 의 motif typology 에서 "induction motif" 의 ground truth 정의.
2. **Phase change 의 정량 추적 방법** — Grokking thesis 의 회로 emergence 추적 framework.
3. **Anthropic 의 mech interp 어휘 (residual stream, QK/OV, virtual head)** — 본 논문보다 더 본격적으로 설명.
4. **Replicate 의 가치** — induction head 가 다른 모델에서도 발견된다는 universality 입증.

**우선 읽을 절**: §3 (Inferring high-level structure of in-context learning), §6 (Induction head phase change).

---

## (경쟁) Geiger et al. — Causal Abstractions of Neural Networks (NeurIPS 2021 + 후속)

**어떤 논문인가**: Causal mediation / interchange intervention 의 수학적 formal framework. 신경망의 일부분이 어떤 abstract algorithm 을 "구현" 한다는 의미를 causal abstraction 으로 정의. 본 논문의 path patching 의 수학적 조상.

**본 논문과의 관계**:
- **경쟁이라기보다 보완** — Geiger 의 framework 가 더 일반적이고 추상적, Wang 이 specific case 에 적용.
- 본 논문이 Geiger 의 framework 를 직접 인용하지는 않지만, swap-intervention 의 수학적 정당성은 Geiger 에 빚짐.
- 만약 본 논문이 Geiger 처럼 더 추상적 formal framework 를 추가했더라면, 회로 정의의 임의성 (Q3 의 polysemanticity) 문제를 더 깨끗하게 다룰 수 있었을 가능성.

**무엇을 얻을 수 있나**:
1. **Causal abstraction 의 형식 정의** — 회로 = abstract algorithm 의 구현 이라는 view 를 formalize.
2. **Interchange Intervention Training (IIT)** — abstract structure 를 학습으로 강제하는 방법. APF / Grokking thesis 에서 motif 또는 generalizing circuit 을 "강제" 학습으로 induce 하는 실험 디자인의 이론적 토대.
3. **DAS (Distributed Alignment Search)** — 회로가 단일 head 가 아니라 subspace 인 case 의 분석. SFC 의 SAE-feature 격상과 자연스럽게 연결.

**우선 읽을 절**: Geiger 의 후속 "Finding Alignments Between Interpretable Causal Variables and Distributed Neural Representations" (NeurIPS 2023) 의 DAS 절.

---

## (후속) Conmy et al. — Towards Automated Circuit Discovery (ACDC) (NeurIPS 2023 Spotlight, arXiv:2304.14997)

**어떤 논문인가**: 본 레포 2026-05-11 cover. 본 논문의 manual top-down search 절차를 자동화. recursive reverse-topological edge prune 알고리즘 + KL/LD/NLL 3 메트릭 비교 + 6 tasks (IOI 포함) benchmark.

**본 논문과의 관계**:
- **직접 자손**. Conmy 가 본 논문 저자 중 한 명, 본인이 본인 논문의 절차를 자동화.
- **벤치마크로 본 논문의 IOI 회로를 ground truth 사용** — ACDC 의 recall/precision 은 본 논문 회로를 정답으로 가정.
- **Mean vs zero vs random ablation 비교** 가 ACDC 에서 본격 수행 — 본 논문이 못한 ablation choice sensitivity 검증.

**무엇을 얻을 수 있나**:
1. **자동화된 회로 발견의 한계** — ACDC 가 본 논문 회로를 얼마나 recover 하는지 (정확 수치 본 레포 2026-05-11 cover 에서 정리).
2. **3 메트릭 (KL/LD/NLL) 의 비교** — 어느 메트릭이 가장 robust 한 회로를 만드는가.
3. **Edge-level ablation vs node-level ablation** 의 차이 — APF 의 path patching 격상 시 어느 단위를 쓸지의 정량 비교.
4. **6 tasks (IOI, Greater-Than, Docstring, tracr-reverse, tracr-xproportion, induction)** 의 benchmark — APF / Grokking thesis 가 새 framework 를 만들 때 비교 baseline.

**우선 읽을 절**: ACDC paper 의 §4 (Algorithm), §5 (Experiments on 6 tasks), Table 1-2 (IOI 회로 recovery 정확도).

---

## 3 편의 메타 관계

```
[Olsson 2022 induction heads]            [Geiger 2021+ causal abstraction]
       (prequel: 회로 단위)                    (parallel: 수학적 정당성)
              \                                    /
               \                                  /
                v                                v
              [Wang 2023 IOI Circuit (본 논문)]
                          |
                          v
              [Conmy 2023 ACDC (자동화)]
                          |
                          v
              [Marks 2024 SFC (단위 격상)]   ← 본 레포 2026-05-15 cover
                          |
                          v
              [Adaptive Circuit 2024+ (한계 탐구)]
```

본 논문은 이 chain 의 **중심 hub**. 위로는 Olsson + Geiger 의 합성, 아래로는 Conmy + Marks 가 격상.

사용자 입장에서 4 편 (Olsson, Geiger, Wang, Conmy) + Marks 까지 **5 편이 mech interp 의 핵심 reference cluster**. Wang 을 중심으로 위 (Olsson, Geiger) 와 아래 (Conmy, Marks) 를 모두 읽으면 APF / Grokking thesis 의 method section 의 reference 가 완성됨.
