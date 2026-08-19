# 9. 사고 확장 (b) — Follow-up 논문 3편

> **배경 사다리**: 선행 1편 / 경쟁 1편 / 후속 1편을 고른다. 각 논문의 식별자는 **`_index.md` 또는 본 논문 참고문헌에서 확인된 것만** 적고, 확인되지 않은 것은 그렇게 표기한다.

---

## 📖 선행 — Olsson et al. 2022, *In-context Learning and Induction Heads* (arXiv:2209.11895)

**어떤 논문인가.** Anthropic 의 트랜스포머 회로 연구 중 가장 널리 인용되는 편. 트랜스포머 내부에 "문맥에서 `A B ... A` 패턴을 발견하면 다음에 `B` 를 내놓는" **induction head** 라는 구체적 회로가 존재함을 보이고, 이 회로의 형성 시점이 in-context learning 능력의 급격한 개선 시점과 일치함을 제시했다.

**본 논문과의 관계.** 본 논문 §2 가 *"In its simplest form, an induction head copies repeating tokens in the context to make predictions"* 로 직접 인용하며, §5.2 에서 역할 대응을 명시한다: *"the query lookup acts as a copy head, the nearest-neighbor match is a selector, and the exact repetition is the aggregation operation."* **즉 본 논문의 해석 틀 전체가 이 논문에서 빌려온 것**이다.

**무엇을 얻을 수 있는가.** 세 가지. ① **회로를 실제로 찾는 방법론** — 본 논문이 유비로 남긴 자리를 메우려면 이 논문의 측정 도구(prefix matching score, ablation 프로토콜)가 필요하다. ② **형성 동역학** — induction head 가 학습 중 언제 어떻게 생기는지에 대한 서술은 내 Grokking 트랙과 직접 겹친다. "복사 회로의 급격한 출현"과 "grokking"이 같은 현상의 다른 이름일 가능성은 검토할 가치가 있다. ③ `_index.md` priority Tier 2 의 **미커버 항목**이므로, 이 편을 읽으면 우선 목록도 함께 소진된다.

**읽는 순서 권고**: 본 논문 → Olsson → 다시 본 논문 §5.2. 두 번째 읽을 때 유비의 정확한 한계(이산 정확 일치 vs 연속 근사 일치)가 보인다.

---

## ⚔️ 경쟁 — Wiliński et al., *Exploring Representations and Interventions in Time Series Foundation Models* (arXiv:2409.12915, ICML 2025) — 이 레포 2026-07-29 커버

**어떤 논문인가.** TSFM 의 내부 표현을 조사하고 **개입(intervention)** 을 가하는 연구. `_index.md` 기준 CMU Auton Lab(MOMENT 팀)의 작업이며, 이 레포가 이미 커버해 해체본을 보유하고 있다.

**본 논문과 어떤 관계인가.** **경쟁이자 상보**다. 두 논문 모두 "TSFM 안에서 무슨 일이 일어나는가"를 묻지만 접근이 정반대다. 본 논문은 **바깥에서** 행동을 모사하는 베이스라인을 세워 역으로 추론하고(black-box), Wiliński et al. 은 **안에서** 표현을 열고 개입한다(white-box). 그래서 본 논문의 가장 큰 약점([07_limits.md](07_limits.md) 반박 1: 메커니즘 증명 부재)이 정확히 상대의 강점이다.

**무엇을 얻을 수 있는가.** **두 편을 합치면 즉시 실행 가능한 연구 설계가 나온다** — Wiliński et al. 의 개입 도구로 TSFM 내부에서 복사 관련 성분을 찾고, 본 논문의 parroting 출력을 **행동 기준선(behavioral target)** 으로 삼아 "그 성분을 끄면 예측이 parroting 에서 얼마나 멀어지는가"를 잰다. 이게 [10_extensions_c_ideas.md](10_extensions_c_ideas.md) 아이디어 1 의 뼈대다. 이미 해체본이 레포에 있으므로 착수 비용이 낮다.

---

## 🌱 후속 — Kalnāre, Kitharidis, Bäck, van Stein, *Mechanistic Interpretability for Transformer-based Time Series Classification* (arXiv:2511.21514)

**어떤 논문인가.** `_index.md` priority Tier 2 의 **미커버** 항목이며, `_profile.md` 기준 내 APF 트랙의 **concurrent work 2개 중 하나**로 식별돼 있다. 제목 기준 시계열 분류 트랜스포머에 mech interp 방법론을 적용한 작업이다.

> **주의**: 본 해체는 이 논문의 **본문을 열지 않았다.** 아래 서술은 `_index.md`·`_profile.md` 에 기록된 서지 정보와 제목 수준의 판단이며, **내용·수치는 단정하지 않는다.** 실제 선정 시 Source Lock + §4-bis 를 새로 수행해야 한다.

**본 논문과 어떤 관계인가.** 본 논문이 **예측(forecasting)** 쪽 TSFM 에서 복사 전략을 지목했다면, 이쪽은 **분류(classification)** 쪽에서 회로를 본다. 두 과제는 어텐션이 하는 일이 다르다 — 예측은 "다음에 무엇이 오는가"이므로 복사가 통하지만, 분류는 "이 전체가 무엇인가"이므로 **집계(aggregation) 회로**가 필요하다. 따라서 두 편을 나란히 놓으면 **"과제가 회로를 결정하는가"** 라는 질문이 자연스럽게 생긴다.

**무엇을 얻을 수 있는가.** ① [10_extensions_a_questions.md](10_extensions_a_questions.md) Q5(“stripe 외 나머지 motif 는 무엇인가”)의 답이 **분류 과제에 있을 가능성**을 검증할 통로. ② 프로필 기준 APF 의 concurrent work 이므로 **차별화 포인트를 정하기 위해 반드시 읽어야 하는 논문**이다. ③ 이 레포의 priority 소진에도 기여한다.

**읽는 순서 권고**: 본 논문(예측·행동 수준) → Wiliński(예측·개입 수준) → Kalnāre(분류·회로 수준). 이 순서로 읽으면 **"같은 도구가 과제를 건너갈 때 무엇이 유지되고 무엇이 바뀌는가"** 라는 축이 자연스럽게 잡힌다.

---

## 세 편을 관통하는 한 문장

**Olsson 은 복사 회로가 존재함을 보였고, 본 논문은 그 회로가 시계열에서 성능의 상당 부분을 만든다고 주장했으며, Wiliński 와 Kalnāre 는 그 주장을 실제로 열어볼 도구를 갖고 있다 — 세 편 사이의 빈칸이 곧 내 APF 트랙이 서 있어야 할 자리다.**
