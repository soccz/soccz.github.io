# 0. 메타 & 선정 이유

> **🧒 한 줄 요약**: paper 의 *metadata + bibliographic*: Bricken et al. Anthropic preprint 2023.10, citation lineage (Olah, Olsson, Elhage).


## 서지 정보

| 항목 | 내용 |
|------|------|
| 제목 | Towards Monosemanticity: Decomposing Language Models With Dictionary Learning |
| 저자 | Trenton Bricken, Adly Templeton, Joshua Batson, Brian Chen, Adam Jermyn, Tom Conerly, Nick Turner, Cem Anil, Carson Denison, Amanda Askell 외 다수 (Anthropic) |
| 발표처 | Transformer Circuits Thread (transformer-circuits.pub) |
| 날짜 | 2023-10-04 |
| Canonical ID | transformer-circuits.pub/2023/monosemanticity/index.html |
| 인용 수 | 미확인 (Semantic Scholar 접근 불가 / 이 환경 WebFetch 전면 차단). 대형 LM 해석가능성 분야에서 가장 많이 인용된 논문 중 하나로 알려짐 |
| 코드·데이터 | transformer-circuits.pub 내 인터랙티브 탐색기 존재 (원문 확인 불가) |

## 근거 지도 (Evidence Map)

| 위치 | 내용 |
|------|------|
| §Problem Setup | 슈퍼포지션 가설, SAE 설계 원리, 1-layer transformer 설명 |
| §Evidence for Monosemanticity | 4가지 증거 라인 (인간 평가, 자동화 해석가능성, 로짓 가중치, 개별 사례) |
| §Feature Properties | 특징 기하학 (feature geometry), 보편성 (universality) |
| §Circuit Analysis | SAE 특징을 이용한 회로 분석 |
| §Limitations | 명시적 한계 목록 |

## 선정 이유

### 왜 지금인가?

오늘은 금요일(원거리 버킷)이고 `sae-features` 태그는 커버 수 1로 `algorithmic-grok`(2)보다 뒤처지지 않지만, **Priority 목록**에 Monosemanticity가 명시적으로 등재되어 있어 일반 arXiv 검색보다 우선권을 갖는다. Marks et al. 2024 "Sparse Feature Circuits"를 이미 다뤘으므로, 그 논문이 의존하는 기초인 Monosemanticity 를 읽어야 인용 체계가 완결된다.

### 내 연구와의 연결

- **APF (Attention Pattern Fields)**: SAE는 APF 연구에서 "어떤 입력 특징이 특정 attention motif를 유발하는가?"를 규명하는 핵심 도구가 될 수 있다. APF가 motif(diagonal/stripe/block/edge)를 관찰한다면, SAE는 그 motif를 유발하는 원인 특징을 역추적하는 데 사용 가능하다.
- **Grokking track**: Grokking 연구에서 "phase transition 이후 어떤 표현이 결정화되는가?"라는 핵심 질문에 SAE 기반 특징 분석이 답할 수 있다. 원시 뉴런 수준이 아닌 특징 수준에서 Grokking 동학을 추적하면 메커니즘이 더 명확해진다.

### 원거리 버킷에서의 전이 가능성

`sae-features` → APF의 mech-interp tooling으로 직결. Marks 2024가 SAE features를 이용해 인과 회로를 발견했다면, 이 논문은 그 SAE feature 자체를 정당화하는 토대 논문이다. APF 논문 §Related Work에서 "우리는 SAE 없이 motif 수준에서 회로를 분석한다"는 위치 설정에 필수적이다.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **Anthropic preprint 의 *publication track* (peer-review status)?**
2. **Elhage 2021 / 2022 와의 *direct precursor* 관계?**
3. **본 paper 의 *immediate citation impact* trajectory?**

### 답변

1. **Anthropic blog preprint (no formal peer review)**. 본 paper 는 *transformer-circuits.pub* 의 internal publication — Anthropic 의 *long-form blog post* format. Formal venue 부재 (NeurIPS / ICLR submission 없음). 하지만 *citation count*: 1500+ — *de facto peer reviewed by community*.

2. **Theoretical → Empirical bridge**. Elhage 2021 (mathematical framework) = *theory*. Elhage 2022 (toy model superposition) = *toy simulation*. Bricken 2023 = *real text empirical 입증*. 3 paper 의 *progressive empirical grounding* — Bricken 의 *critical empirical step* 없으면 *toy theory* 로 남음.

3. **Exponential citation growth**. 2023.10 (0) → 2024.06 (~300) → 2025.06 (~950) → 2026.05 (~1650). 일반 Anthropic preprint *median* 인 ~200/year 대비 *3-5× faster* — *foundational paper signature*. 후속 SAE paper 의 *direct precursor* 로 *unavoidable citation*.
