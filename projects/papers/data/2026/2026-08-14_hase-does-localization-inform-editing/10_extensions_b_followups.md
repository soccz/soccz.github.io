# 9. 사고 확장 (B) — Follow-up 논문 3편

> **배경 사다리**: 반증 논문을 읽은 뒤에는 세 방향으로 읽어야 한다 — 무엇을 반증했는지(선행), 같은 시기 누가 다르게 접근했는지(경쟁), 반증 이후 분야가 어디로 갔는지(후속).

---

## 선행 — ROME: Locating and Editing Factual Associations in GPT

**식별자**: arXiv:2202.05262 · NeurIPS 2022 · Meng, Bau, Andonian, Belinkov
**이 레포 커버**: **2026-08-10** ([폴더](../2026-08-10_rome-locating-editing-factual-associations/))

**어떤 논문인가**: Causal Tracing을 제안해 GPT의 사실 지식이 중간층 MLP에 국소화된다고 보고하고, 그 층의 down-projection 가중치를 rank-1로 갱신하는 편집 기법 ROME을 내놓았다. CounterFact 벤치마크와 rewrite/paraphrase/neighborhood 지표도 이 논문의 산물이다.

**본 논문과의 관계**: **직접 반박 대상**이자 동시에 **재료 공급원**이다. 본 논문은 ROME의 도구를 하나도 바꾸지 않고 그대로 쓴다 — 잡음 $\sigma=0.094$까지 물려받았다(원문 verbatim *"following [Meng et al. 2022a]"*). 반박하는 것은 ROME의 성능이 아니라 **그 성능의 귀속(attribution)** 이다. ROME은 잘 작동한다. 다만 Causal Tracing 덕분이 아니다.

**무엇을 얻는가**: 두 논문을 함께 읽어야 "국소화 → 편집" 사슬의 어느 고리가 끊겼는지가 정확히 보인다. **ROME만 읽으면 이미 반박된 명제를 인용하게 되고, 본 논문만 읽으면 무엇이 반박됐는지 모른다.** 이 레포에서 두 논문이 4일 간격으로 커버된 이유가 이것이다.

---

## 경쟁 — Sparse Feature Circuits: Discovering and Editing Interpretable Causal Graphs

**식별자**: arXiv:2403.19647 · ICLR 2025 Oral · Marks, Rager, Michaud, Belinkov, Bau, Mueller
**이 레포 커버**: **2026-05-15** ([폴더](../2026-05-15_sparse-feature-circuits/))

**어떤 논문인가**: SAE(sparse autoencoder, 희소 오토인코더)로 얻은 **특징(feature) 단위**의 인과 그래프를 발견하고, 그 그래프를 **편집**해 모델 행동을 바꾼다. 국소화의 입도가 층이 아니라 특징이다.

**본 논문과의 관계**: **같은 질문에 다른 답을 하는 경쟁 노선**이다. 본 논문이 "층 단위 국소화는 편집을 안내하지 못한다"고 결론지은 자리에서, Marks et al.은 **더 미세한 입도라면 안내한다**는 입장을 실증으로 밀고 나간다. 두 논문 모두 Bau·Belinkov가 관여했다는 점(ROME 저자군과도 겹침)이 흥미롭다 — 같은 그룹이 자기 방법의 한계를 인정하고 입도를 바꿔 재도전한 것으로 읽을 수 있다.

**무엇을 얻는가**: **"국소화가 실패했다"가 아니라 "어떤 입도의 국소화가 성공하는가"** 로 질문을 옮기는 법. 그리고 §6.3 반박 2(입도 불일치)가 실제 연구 프로그램으로 어떻게 구현되는지의 실례. SAE 계열은 측정 단위와 개입 단위가 **같은 특징 공간**이라 입도가 자동으로 정렬된다.

---

## 후속 — Mechanistic Unlearning: Robust Knowledge Unlearning and Editing via Mechanistic Localization

**식별자**: arXiv:2410.12949
**이 레포 커버**: 미커버 (본 해체에서 처음 지목)

**어떤 논문인가**: 지식 언러닝·편집을 **기계론적 국소화에 기반해** 강건하게 수행하려는 시도. 제목 자체가 본 논문에 대한 응답 구조다 — 본 논문이 "국소화는 편집을 안내하지 못한다"고 했는데, 이쪽은 "**어떤 국소화라면 안내한다**"를 주장한다.

**본 논문과의 관계**: **반증에 대한 건강한 반응의 표본**이다. 반증을 부정하지 않고, 반증이 성립하는 조건(층 단위 denoising 기반 국소화)을 인정한 뒤 **다른 종류의 국소화**로 조건을 바꿔 재도전한다. 본 논문 §8이 스스로 열어 둔 문("Our conclusions may not necessarily hold for the breadth of localization and editing methods")으로 정확히 들어간 후속작이다.

**무엇을 얻는가**: 세 가지. ① 본 논문 이후 분야가 실제로 어디로 갔는지의 좌표. ② **반증 논문을 인용하는 올바른 방식** — "따라서 국소화는 무용하다"가 아니라 "따라서 우리는 X 종류의 국소화를 쓴다"로 쓰는 법. ③ 내 APF 논문에서 motif 인과성을 방어할 때 참고할 수 있는 논증 템플릿(입도·기법을 특정해 조건부로 주장하기).

**주의**: 본 실행에서 이 논문의 **전문(全文)은 확인하지 않았다.** arXiv ID와 제목만 검색 결과로 확인했으므로, 위 서술 중 논문 내용에 대한 부분은 **제목이 함의하는 관계**까지만 신뢰할 것. 실제로 다루려면 Source Lock을 별도로 수행해야 한다.
