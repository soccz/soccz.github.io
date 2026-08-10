# 9-B. Follow-up 논문 3편

> **선정 규율**: 아래 세 편의 서지 정보(제목·저자·venue·arXiv ID·초록 문장)는 본 실행에서 **공식 arXiv abs 페이지에서 직접 확인**했다. 확인하지 못한 항목은 표기하지 않는다.

---

## 【선행】 A Mathematical Framework for Transformer Circuits — Elhage et al. (Anthropic, 2021)

**어떤 논문인가.** ROME §2.3이 자기 국소화 가설의 후반부를 정렬시키는 근거로 직접 인용하는 문헌이다 — "the **Elhage et al. (2021)** study showing an **information-copying role for self-attention**". 트랜스포머를 QK 회로와 OV 회로로 분해해 어텐션 헤드가 무엇을 계산하는지 대수적으로 서술한다.

**본 논문과의 관계.** ROME의 가설은 두 부분이다: (i) 중간층 MLP가 subject 속성을 산출하고 (ii) **그 정보가 어텐션에 의해 마지막 토큰으로 복사된다**. (i)은 ROME이 직접 실험으로 세우지만 **(ii)는 세우지 않는다** — Elhage에게서 빌려온다. 즉 ROME의 그림은 절반이 남의 논문에 의존한다. Appendix I의 AttnEdit 실험(후반 어텐션 편집 → 앵무새 반복)이 (ii)에 대한 ROME의 유일한 자체 증거인데, 그것도 부록에 있다.

**무엇을 얻을 수 있나.** ① ROME이 왜 "어텐션은 복사, MLP는 계산"이라는 역할 분담을 **가정으로 깔 수 있었는지**의 근거. ② `_index.md` priority Tier 2에 **아직 미커버로 남아 있는 항목**이며(`- | A Mathematical Framework for Transformer Circuits | Elhage et al. (Anthropic 2021, transformer-circuits.pub) | mech-interp-circuits`), 2026-07-13 SKIP 로그에도 접근 실패로 기록돼 있다. ③ APF의 motif taxonomy를 QK/OV 회로 언어로 재서술할 수 있는지가 열린 질문 — 내 기하 motif(stripe/block/spike)가 QK 회로의 무엇에 대응하는지 매핑되면 APF의 이론적 지분이 크게 오른다.

**주의.** 이 문헌은 arXiv가 아닌 transformer-circuits.pub 게재라 §4-bis 소스 등급상 1차 자격 판정을 별도로 해야 한다(2026-05-22 Monosemanticity 커버 때는 transformer-circuits.pub 게재본으로 발행한 선례가 있다).

---

## 【경쟁·반박】 Does Localization Inform Editing? Surprising Differences in Causality-Based Localization vs. Knowledge Editing in Language Models — Hase, Bansal, Kim, Ghandeharioun

**서지 (공식 arXiv abs 확인).** arXiv:2301.04213 · **NeurIPS 2023 (Spotlight)** · 26 pages, 22 figures · 저자 Peter Hase, Mohit Bansal, Been Kim, Asma Ghandeharioun.

**어떤 논문인가.** 초록 첫 두 문장 verbatim: "Language models learn a great quantity of factual information during pretraining, and recent work localizes this information to specific model weights like **mid-layer MLP weights**. In this paper, we find that we can change how a fact is stored in a model by **editing weights that are in a different location than where existing methods suggest that the fact is stored**."

**본 논문과의 관계 — 정면 반박이다.** 첫 문장이 ROME을 지목하고("mid-layer MLP weights"), 둘째 문장이 [06_experiments_b_localization.md](06_experiments_b_localization.md)에서 짚은 §3.4의 약한 다리를 끊는다. ROME의 논증은 "인과추적 지도와 편집 성능 지도가 겹친다"였는데, 겹치지 **않는** 곳에서도 편집이 성공한다면 그 수렴은 국소화를 확립하지 못한다.

**흥미로운 계보상의 아이러니.** ROME §3.3이 C OUNTER FACT를 만든 이유로 인용한 것이 **Hase et al. (2021)** 의 벤치마크 난이도 지적이다. 같은 저자가 2년 뒤 ROME의 국소화 논증 자체를 겨눴다. ROME이 방법론적 비판을 받아들여 데이터셋을 개선했듯, 이번엔 논증을 개선할 차례라는 뜻이다.

**무엇을 얻을 수 있나.** ① **ROME을 인용할 때 반드시 함께 인용해야 할 문헌.** 이것 없이 ROME만 인용하면 "사실은 중간층 MLP에 저장된다"는 이미 반박된 명제를 유통시키게 된다. ② APF에 직접 이식할 방어 논리 — [09_my_research.md](09_my_research.md) §2(a)에서 설계한 "주장 범위를 storage가 아닌 load-bearing으로 축소" 전략의 근거 문헌. ③ 내 개입 실험을 설계할 때 **"개입 성공 ≠ 국소화 확립"** 이라는 반례가 어떤 실험 형태로 구성되는지의 템플릿.

**우선순위: 최상.** 코어 버킷 `causal-intervention` 태그의 다음 후보로 최우선 검토 대상이다 — 게이트 A(NeurIPS 2023 Spotlight) 충족이 arXiv comments로 확인됐고, 오늘 커버한 논문과 짝을 이룬다.

---

## 【후속】 Mass-Editing Memory in a Transformer (MEMIT) — Meng, Sen Sharma, Andonian, Belinkov, Bau

**서지 (공식 arXiv abs 확인).** arXiv:2210.07229 · 18 pages, 11 figures · code/data at https://memit.baulab.info · 저자 Kevin Meng, Arnab Sen Sharma, Alex Andonian, Yonatan Belinkov, David Bau (ROME 저자 4인 + Sen Sharma).

**어떤 논문인가.** 초록 첫 두 문장 verbatim: "Recent work has shown exciting promise in updating large language models with new memories, so as to replace obsolete information or add specialized knowledge. However, **this line of work is predominantly limited to updating single associations**."

**본 논문과의 관계.** ROME이 **두 번** 예고한 직계 후속이다 — §3.7("A scalable approach for multiple simultaneous edits built upon the ideas in ROME is developed in Meng, Sen Sharma, Andonian, Belinkov, and Bau (2022)")과 §5(같은 문장 반복). ROME §3.7 한계 1번("it only edits a single fact at a time")을 정면으로 받는다.

**왜 이 확장이 자명하지 않은가.** [04_claims_b_editing.md](04_claims_b_editing.md)에서 봤듯 rank가 1인 것은 **선택이 아니라 결과**다 — 등식 제약이 하나이므로 라그랑주 승수도 하나다. 사실 $n$개면 제약이 $n$개라 rank-$n$이 되고, 그러면 Eqn. 2의 "최소 교란" 보장이 급격히 약해진다. 게다가 여러 층에 나눠 쓸지 한 층에 몰 지, 편집 간 간섭을 어떻게 다룰지가 모두 새 문제다.

**무엇을 얻을 수 있나.** ① ROME 대수가 **어디까지 확장 가능하고 어디서 깨지는지**의 경계. ② APF §6.2의 injection 실패([09_my_research.md](09_my_research.md) §2(b) 참조 — README 기록상 "TMAO injection-as-prior under-powered null, n=12, p≈0.10")를 다시 설계할 때, **다중 제약 하의 최소 교란**을 어떻게 푸는지가 직접 참고 자료가 된다. 내 경우 "여러 motif를 동시에 주입"이 자연스러운 다음 단계이므로 구조가 겹친다. ③ 스케일링이 국소화 주장에 주는 역압력 — 사실 1만 개를 한 모델에 넣으면 "각 사실이 국소적"이라는 그림이 유지되는지가 검증대에 오른다.

---

## 세 편의 읽는 순서 추천

1. **Hase et al. (2301.04213)** 먼저. ROME의 결론을 어디까지 믿을지가 여기서 정해지고, 그게 내 APF 주장 범위 설정에 즉시 반영된다.
2. **Elhage et al. (2021)** 다음. ROME이 빌려 쓴 절반(어텐션 복사 역할)을 채우면 오늘 읽은 그림이 완성되고, priority Tier 2 미커버 항목도 해소된다.
3. **MEMIT (2210.07229)** 마지막. 확장의 공학적 디테일이라 급하지 않지만, APF injection 재설계에 착수할 때 반드시 필요하다.
