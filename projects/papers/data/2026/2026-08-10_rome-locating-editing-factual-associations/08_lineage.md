# 7. 이론적 계보

> **배경 사다리**: ① 논문의 계보를 읽는 건 "누구를 인용했나"가 아니라 **"어떤 문제를 물려받아 어떻게 비틀었나"** 를 읽는 일이다. ② 이 논문은 세 갈래(인과추론 / 연상기억 / 모델편집)의 합류점에 있다. ③ 아래 인용 정보는 모두 원문 §3.1·§4의 인용 서술과, 후속작의 경우 공식 arXiv 메타에서 확인한 것이다.

---

## 이론적 조상

### ① Pearl (2001) — 인과 매개 분석

**연결선.** 이 논문의 §2 전체가 Pearl의 **간접효과(indirect effect)** 개념을 신경망에 이식한 것이다. 원문이 두 곳에서 명시적으로 Pearl을 앵커로 쓴다 — §2.1의 "causal mediation analysis, which quantifies the contribution of intermediate variables in causal graphs (Pearl, 2001)"과 §2.2의 경로 절단을 "a way of probing **path-specific effects** (Pearl, 2001)"로 규정하는 대목. §4에서는 자기 기여를 "explicit measurement of causal indirect effects (Pearl, 2001) of individual hidden state vectors"로 정리한다.

**무엇을 물려받고 무엇을 버렸나.** 물려받은 것은 총효과/간접효과의 분해 틀과 경로 특이적 효과 개념. **버린 것은 직접효과**다 — 각주 5가 "noisy and uninformative"라며 경험적으로 포기한다. 즉 Pearl의 프레임을 온전히 쓰는 게 아니라 **간접효과 반쪽만** 가져왔다.

### ② Vig et al. (2020b, 2020a) — 인과 매개 분석의 첫 신경망 이식

**연결선.** §2.1의 첫 문장이 이들을 직접 지목한다: "As Vig et al. (2020b) have shown, this is a natural case for causal mediation analysis." 이들은 성별 편향에 기여하는 **개별 뉴런**을 찾았다. 각주 5에서 직접효과가 무익하다는 판단도 "in line with results by Vig et al. (2020b)"라며 이들의 결과를 근거로 든다.

**비틀기.** Vig가 **뉴런** 단위였다면 이 논문은 **은닉상태 벡터 전체 + 모듈별 기여** 단위로 올라갔다. 그리고 결정적으로 **짝 개입(paired intervention)** 형태를 도입해 "손상 → 선택적 복원"이라는 재현 가능한 프로토콜로 정식화했다. 이 정식화가 오늘날 "activation patching"이라 불리는 것의 표준형이 됐다.

### ③ Geva et al. (2021) — MLP는 키–값 기억이다

**연결선.** §3의 출발점. "Geva et al. (2021) observed that MLP layers (Figure 4cde) can act as two-layer key–value memories, where the neurons of the first layer $W_{fc}$ form a key, with which the second layer $W_{proj}$ retrieves an associated value." §2.3에서도 자기 국소화 가설이 "consistent with the Geva et al. (2021) view that MLP layers store knowledge"라고 정렬한다.

**결정적 비틀기.** 같은 문단에서 즉시 갈라선다: "We hypothesize that MLPs can be modeled as a **linear associative memory**; note that this differs from Geva et al.'s **per-neuron** view." 뉴런 단위 관점에서는 편집이 "특정 행 고쳐쓰기"가 되고, 행렬 단위 관점에서는 **제약 최소제곱**이라는 잘 정의된 문제가 된다. Table 4에서 per-neuron 진영의 대표(Dai et al.의 KN)가 ES 28.7로 실패한 것은 두 관점의 실증적 판정으로도 읽힌다.

### ④ Kohonen (1972) / Anderson (1972) / Bau et al. (2020) — 선형 연상 기억과 rank-1 삽입

**연결선.** §3.1의 첫 문장이 Kohonen·Anderson을 든다. 실질적 조상은 **Bau et al. (2020)** — "a new key–value pair $(k_*, v_*)$ can be inserted optimally into the memory by solving a constrained least-squares problem." 저자 David Bau 본인의 이전 작업이다.

**비틀기.** 원문이 차이를 정확히 짚는다: "In a convolutional network, Bau et al. solve this using an **optimization**, but in a fully-connected layer, we can derive a **closed form solution**." 도메인이 CNN → 트랜스포머 MLP로 바뀌면서 반복 최적화가 대수로 대체됐다. 그리고 Appendix A가 자기 유도를 "a review of the classical solution of least-squares with equality constraints"라고 정직하게 격하한다 — **수학적 신규성은 없고 매핑이 기여다.**

### ⑤ Elhage et al. (2021) — 어텐션의 정보 복사 역할

**연결선.** §2.3이 자기 가설의 후반부(중간층 MLP 출력이 어텐션에 의해 마지막 토큰으로 복사됨)를 정렬시키는 근거로 "the Elhage et al. (2021) study showing an **information-copying role for self-attention**"을 든다. `_index.md` priority 목록의 미커버 항목 "A Mathematical Framework for Transformer Circuits (Anthropic 2021)"이 바로 이 문헌이다.

---

## 평행 연구 (같은 시기, 다른 접근)

논문 §3.2·§3.3이 이들 **전부를 baseline으로 실험에 넣는다** — 계보를 논하면서 동시에 이긴다는 구조.

### Dai et al. (2022) — Knowledge Neurons

**접근.** gradient 기반 귀속으로 "지식 뉴런"을 고르고(수천 → ≈1000 → ≤10의 2단 정제), MLP 행렬의 해당 행에 스케일된 임베딩 벡터를 더한다(Appendix E.2).

**왜 졌나.** Table 4에서 **ES 28.7**로 사실상 편집이 안 된다. 두 가지 이유로 읽힌다. (i) 위치 선정이 **gradient saliency = 상관 기반**이다 — §2.2가 인과추적이 integrated gradients보다 낫다고 보인 바로 그 약점. (ii) 값 주입을 **출력 임베딩**으로 한다 — 중간층 MLP의 값 공간과 출력 토큰 임베딩 공간이 같지 않다.

**어떤 영역에서 상대가 나은가.** KN은 "어느 뉴런이 관여하는가"라는 **뉴런 수준 해석**을 준다. ROME은 rank-1 방향을 주지만 그것이 어느 뉴런에 대응하는지는 말하지 않는다.

### De Cao et al. (2021) — Knowledge Editor / Mitchell et al. (2021) — MEND

**접근.** 가중치 변화를 **예측하는 하이퍼네트워크**를 따로 학습. KE는 LSTM, MEND는 그래디언트의 rank-1 분해를 변환하는 네트워크.

**왜 졌나.** Table 4에서 전용 학습판(KE-CF S=18.1, MEND-CF S=14.9)이 오히려 미학습판(KE 52.2, MEND 57.9)보다 나쁘다. 목표 지표(ES·PS)에 최적화하다 NS를 6.9·5.5로 파괴했기 때문이다. **분포 내에서 학습된 편집기는 분포를 벗어난 요구에서 무너진다.**

**어떤 영역에서 상대가 나은가.** **속도**다. Appendix E.5가 인정한다 — 하이퍼네트워크는 추론이 100ms 수준으로 ROME(2초)보다 20배 빠르다. 다만 "hours-to-days of additional training overhead"라는 선불이 있다. 그리고 zsRE 홈그라운드에서는 MEND-zsRE가 Paraphrase 99.3으로 ROME(88.1)을 **이긴다**(Table 1).

### Zhu et al. (2020) — Constrained Fine-Tuning

**접근.** fine-tuning에 $L_\infty$ 노름 제약을 걸어 가중치가 멀리 못 가게 한다. 본 논문의 FT+L baseline.

**왜 졌나.** 제약이 **등방적(isotropic)** 이다 — 모든 방향으로 똑같이 $\epsilon$만큼만 허용한다. Eqn. 2의 $C^{-1}$이 "기존 기억이 빽빽한 방향은 피하고 성긴 방향으로 크게"라는 **비등방적** 이동을 계산하는 것과 대비된다. 그 결과 FT+L은 안전하지만 둔하다(NS 70.3인데 PS 48.7).

**어떤 영역에서 상대가 나은가.** 구현 단순성과 아키텍처 무관성. ROME은 MLP의 키–값 구조를 전제하지만 FT+L은 아무 가중치에나 적용된다.

---

## 후손

### ① 직계 후속 — MEMIT (저자 본인들)

**Mass-Editing Memory in a Transformer** — Kevin Meng, Arnab Sen Sharma, Alex Andonian, Yonatan Belinkov, David Bau. **arXiv:2210.07229** (comments: "18 pages, 11 figures. Code and data at https://memit.baulab.info").

본 논문 §3.7과 §5가 **두 번** 이 후속작을 예고한다: "A scalable approach for multiple simultaneous edits built upon the ideas in ROME is developed in Meng, Sen Sharma, Andonian, Belinkov, and Bau (2022)." MEMIT 초록 verbatim 두 문장: "Recent work has shown exciting promise in updating large language models with new memories, so as to replace obsolete information or add specialized knowledge. However, **this line of work is predominantly limited to updating single associations**." → ROME의 §3.7 한계 1번을 정면으로 받는다. [04_claims_b_editing.md](04_claims_b_editing.md)에서 봤듯 제약이 $n$개면 rank-$n$ 업데이트가 되므로, 확장 방향 자체는 Eqn. 2의 구조가 이미 지시하고 있었다.

### ② 반박 후손 — Hase et al. (예측이 아니라 실제로 나왔고, 이 논문의 결론을 뒤집는다)

**Does Localization Inform Editing? Surprising Differences in Causality-Based Localization vs. Knowledge Editing in Language Models** — Peter Hase, Mohit Bansal, Been Kim, Asma Ghandeharioun. **arXiv:2301.04213**, **NeurIPS 2023 (Spotlight)**, 26 pages, 22 figures.

초록 첫 두 문장 verbatim: "Language models learn a great quantity of factual information during pretraining, and recent work localizes this information to specific model weights like mid-layer MLP weights. In this paper, we find that we can change how a fact is stored in a model by **editing weights that are in a different location than where existing methods suggest that the fact is stored**."

**의미.** 첫 문장이 ROME을 정확히 지목하고(“mid-layer MLP weights”), 둘째 문장이 §3.4의 수렴 논증을 무너뜨린다. **국소화 성공과 편집 성공이 해리된다**는 것. [07_limits.md](07_limits.md) 반박 1이 예측한 검증이 실제로 수행되었고 결과가 ROME에 불리했다. 흥미로운 건 논문 §3.3이 인용한 Hase et al. (2021)의 그 Hase가 2년 뒤 이 논문을 겨눴다는 점 — ROME이 벤치마크 난이도 지적을 받아들여 C OUNTER FACT를 만들었듯, 같은 연구자가 이번엔 국소화 논증 자체를 겨눈 것이다.

### ③ 예상 후손 — activation patching의 표준화

본 논문이 정식화한 "손상 → 선택적 복원 → 확률 회복량" 프로토콜은 이후 회로 분석의 기본 프리미티브가 된다. `_index.md` 커버 이력이 그 확산을 보여준다 — **ACDC**(Conmy et al., NeurIPS 2023 Spotlight, arXiv:2304.14997, 2026-05-11 커버)가 이 개입을 자동 탐색 루프로 돌리고, **IOI Circuit**(Wang et al., ICLR 2023, arXiv:2211.00593, 2026-06-15 커버)이 같은 개입으로 회로 하나를 완전 해부하며, **Sparse Feature Circuits**(Marks et al., ICLR 2025 Oral, arXiv:2403.19647, 2026-05-15 커버 — **Belinkov·Bau 공저**)가 개입 대상을 뉴런에서 SAE 특징으로 갈아끼운다. ROME은 그 계보의 **방법론적 조상**이다.

### ④ 예상 후손 — 시계열·비언어 도메인으로의 이식

`_coverage.md` `tsfm-interp` 계보가 이미 이 방향으로 움직이고 있다. **Wiliński et al.** (ICML 2025, arXiv:2409.12915, 2026-07-29 커버)이 LLM 해석 3종(CKA·선형 프로빙·steering)을 얼린 TSFM에 이식했다. ROME 계열의 **가중치 편집**은 아직 시계열로 오지 않았다 — 그 이유와 기회를 [09_my_research.md](09_my_research.md)와 [10_extensions_c_ideas.md](10_extensions_c_ideas.md)에서 다룬다.

---

## 계보도 한 장 요약

```
Pearl 2001 (인과 매개)            Kohonen 1972 / Anderson 1972 (연상 기억)
        │                                      │
Vig et al. 2020 (뉴런 단위 이식)      Bau et al. 2020 (CNN rank-1 삽입, 최적화)
        │                                      │
        │            Geva et al. 2021 (MLP = per-neuron 키–값)
        │                          │           │
        └──────────┬───────────────┴───────────┘
                   ▼
        ★ ROME (Meng·Bau·Andonian·Belinkov, NeurIPS 2022) ★
        §2 Causal Tracing  +  §3 rank-1 closed form  +  §3.4 지도 일치
                   │
     ┌─────────────┼──────────────────┬────────────────────┐
     ▼             ▼                  ▼                    ▼
  MEMIT       Hase et al. 2023    activation patching   TSFM interp
 (확장,저자)   (반박, NeurIPS       표준화 (ACDC ·        (미도래 —
              2023 Spotlight)      IOI · SFC)          기회 영역)
```
