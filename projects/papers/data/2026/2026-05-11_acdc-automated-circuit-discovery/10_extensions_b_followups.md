# 9. 사고 확장 (b) — Follow-up 논문 3 편

> **🧒 한 줄 요약**: Follow-up — Olsson 2022 (manual ancestor), SFC 2024 (extension), Patchscopes.


## 선행 (Predecessor): Interpretability in the Wild — IOI Circuit in GPT-2 Small (Wang, Variengien, Conmy et al., ICLR 2023, arXiv:2211.00593)

**어떤 논문인지**: GPT-2 small 의 IOI task ("Mary and John ... John gave a drink to ___" → Mary) 의 회로를 *손작업으로* 발견. 26 head 를 4 class (Duplicate Token Heads, Previous Token Heads, S-Inhibition Heads, Name Mover Heads) 로 묶고 인과 흐름을 정밀 추적. mech interp 의 *가장 정교한 사례 연구*.

**본 ACDC 논문과의 관계**: 1 저자 Conmy 가 공저자로 참여한 직전 작업. ACDC 가 *자동화* 한 작업의 *손작업 원형*. ACDC 의 IOI task evaluation 의 *ground-truth* 가 정확히 이 논문이 발견한 26-head 4-class 회로.

**무엇을 얻을 수 있는가**: (a) ACDC 가 자동화하려 한 *손작업이 무엇이었는지* 의 직접적 감각. (b) IOI 회로의 *backup name mover heads* — 같은 기능의 보상 회로 — 가 *cooperative effect* 의 대표 사례. ACDC 의 *greedy* 한계가 backup mechanism 에서 어떻게 깨지는지 이해의 토대. (c) APF 에 motif intervention 을 적용할 때, *backup motif* 의 존재 가능성을 사전 검토.

**APF / Grokking 활용 우선순위**: ★★★★☆ (필독). 특히 *backup mechanism* 의 존재가 motif intervention 의 해석을 어떻게 흔드는지를 APF paper §4 limitation 으로 다뤄야 함.

---

## 경쟁 (Parallel/Competing): Attribution Patching Outperforms Automated Circuit Discovery (Syed, Heimersheim, Conmy et al., BlackboxNLP 2023, arXiv:2310.10348)

**어떤 논문인지**: ACDC 의 *동기 비판*. *attribution patching* (EAP) = clean / corrupted 의 *gradient × activation* 차이로 edge 점수를 *single backward pass* 에서 추정. ACDC 의 |E| forward pass 대비 1/|E| 비용. 6 task 평균 AUC 에서 EAP ≥ ACDC.

**본 ACDC 논문과의 관계**: Conmy 본인이 공저자로 참여한 *자기 비판*. 그래서 더 신뢰 — 저자가 자기 알고리즘의 한계를 다음 작업에서 솔직히 인정. 두 알고리즘의 비교 표 (Table 1, 2 즕음) 가 ACDC 의 AUC 수치의 cross-source 표준.

**무엇을 얻을 수 있는가**: (a) ACDC 와 attribution patching 의 *Pareto frontier* — 비용 (시간) vs 품질 (AUC). 어느 시점에 어느 알고리즘을 선택해야 하는가. (b) gradient 기반 attribution 이 *linear approximation* 인 한계 — 큰 ablation 의 비선형 효과를 못 잡음. ACDC 는 *true intervention* 이라 이 한계 없음. (c) ACDC 의 알고리즘적 정당화 — 비용 비싸도 *인과 검증* 의 보증이 필요한 경우 (예: safety-critical) 에 ACDC 가 여전히 우월.

**APF / Grokking 활용 우선순위**: ★★★★★ (필독). APF / Grokking-TS 의 인과 검증 절을 쓸 때, *우리는 왜 EAP 가 아니라 ACDC 류를 쓰는가* 의 정당화를 이 논문의 비교 표로 직접 박을 수 있음. 또는 *우리는 사실 EAP 가 더 비용 효과적임을 인정하고 attribution patching 으로 main result + ACDC 로 validation* 의 hybrid 전략으로 갈 수도 있음.

---

## 후속 (Successor): Sparse Feature Circuits — Discovering and Editing Interpretable Causal Graphs (Marks, Rager, Michaud, Belrose, Smith, Tegmark, ICLR 2024)

**어떤 논문인지**: ACDC 의 *입도 일반화* + *해석 가능성 강화*. ACDC 의 노드가 head/MLP 였다면, SFC 는 노드를 *SAE feature* (sparse autoencoder 로 학습된 monosemantic feature) 로 내림. edge 단위 prune 절차는 ACDC 와 유사하지만, *features* 가 *기능 의미* 가 사전에 라벨링되므로 회로의 해석이 즉시 가능. Anthropic 의 monosemantic features (Bricken 2023) 와 ACDC 의 자동화 절차 의 결합.

**본 ACDC 논문과의 관계**: ACDC 의 직계 후손. 알고리즘 형식 거의 그대로 — recursive prune, threshold τ, ablation. 다만 *노드 입도* 가 head 에서 feature 로 내려가며 polysemantic head 문제 해결. 또 SFC 가 *bias detection* (예: gender bias 의 회로) 등 *실용 응용* 을 보임.

**무엇을 얻을 수 있는가**: (a) ACDC 의 *head 단위 입도* 가 가진 한계 — polysemantic head 에서 회로 해석이 흐려짐. SFC 가 이를 SAE 로 해결. (b) APF 의 *motif 입도* 가 ACDC 의 head 단위 와 SFC 의 feature 단위 의 *중간* 에 위치. motif 가 *PE-conditional 한 attention 패턴 클래스* 라는 점에서, SFC 의 *학습된 feature* 입도 보다는 *사전 typology* 입도. 이 위치를 paper introduction 에서 명시. (c) SFC 의 *editing* (회로 일부를 ablate 하면 bias 가 줄어듦) 응용은 APF 의 *motif intervention* 응용의 직접적 모델.

**APF / Grokking 활용 우선순위**: ★★★★☆ (선택 필독). APF paper §2 (related work) 에서 *입도 비교* 표 (head ←→ motif ←→ feature) 를 만들 때 SFC 가 *feature 입도* 의 대표.

---

## 위 3 편을 *한 곡선 위* 에 배치하면

```
        cost (per circuit)
              │
     높음 ────┤      ● ACDC (Conmy 2023, 본 논문)
              │      ↑
              │      │ 입도 일반화: head → feature
              │      ↓
              │      ● SFC (Marks 2024)
              │
     낮음 ────┤      ● EAP (Syed 2023)
              │
              └─────────────────────► 품질 / 일반성
              낮음                    높음
```

(텍스트 다이어그램, 정확한 좌표 아닌 정성 배치)

ACDC 의 가치는 *비교 인터페이스 정립* 에 있고, *후속 작업이 ACDC 를 이긴* 영역들이 정확히 ACDC 의 *기여를 검증* 하는 방식이다. 즉 ACDC 는 *최종 algorithm of choice* 가 아니라 *비교 기준점*. APF / Grokking-TS 의 인과 검증도 이 *비교 기준점* 으로서 ACDC 를 인용하면 reviewer 가 *왜 더 새 알고리즘 (EAP, SFC) 을 안 썼는가* 를 물을 것 — 그 답은 *우리는 인과 보증이 필요하고 입도가 motif 수준* 이므로 SFC (feature) 도 EAP (gradient approx) 도 *우리 입도* 와 안 맞고, ACDC 의 *intervention 보증* 이 가장 적합.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **next deep dive?**
2. **SFC 의 direct extension?**
3. **책임도?**

### 답변

1. paper §-references + 본 deep dive 의 cross-reference 기반.

2. ACDC (Conmy 2023) 의 핵심 mechanism (edge-by-edge ablation + KL metric) 의 통합 관점.

3. APF / Grokking 트랙의 baseline — manuscript §1-§6 + Appendix.
