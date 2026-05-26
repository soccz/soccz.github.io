# 18 본 deep dive 의 자기비판 — 한계와 추가 작업

> **🧒 본 챕터는 "deep dive 자체의 한계 인정"**: 본 deep dive (24 챕터 + 신규 viz JS) 가 *완성* 인가의 *솔직한* 자기 평가. APF / Grokking reviewer 가 *언제든 던질 수 있는* objection 의 사전 명시.

## 18.1 챕터 한 줄 요약

> **"본 deep dive 가 paper 의 *대부분* 측면을 다루지만 *line-by-line PDF citation*, *official repo source code 매칭*, *citation real-time*, *친화 톤 의 lettau-virtue 최고 수준* 까지는 미도달. 단 이 한계들은 *명시적 known unknown*."**

## 18.2 본 deep dive 가 *못 한* 6 가지

### 1. paper PDF 의 line-by-line citation X

§-level + Figure/Table 번호 까지만. *individual 문장 의 page-line* 위치 X.

### 2. Official code repo 매칭 X

paper 의 official code 는 *unannounced*. 본 14_code 의 PyTorch 는 *paper description* 기반 재구현 — *exact match* 불가능.

### 3. Citation count real-time X

11_verdict + 17_aftermath 의 citation 추정 (1,050+) 은 *합리적 estimate*. Google Scholar 실시간 X.

### 4. 친화 톤 lettau-virtue 최고 수준 X

24/24 wrapper 추가했지만 *수식 4 줄 풀이 + 일상 비유* 의 *full 적용* 까지는 X.

### 5. Chughtai 2024 / Anthropic SAE follow-up 의 정확 수치 X

17_aftermath 의 후속 결과는 *합리적 추정*. exact 결과 (e.g., "L5 head 3 = first-hop lookup") 은 *paper 가 명시* 안 한 영역.

### 6. LLM 비교 의 *실시간 결과* X

paper 의 GPT-4 (2024.01) 결과 — 2026 시점 의 *최신 GPT-4o*, *o1*, *Claude 3.5 Sonnet* 등 *재실험* X.

## 18.3 추가 작업

### Phase A (1 주):
1. Google Scholar live query
2. Official code repo 접근 후 14_code 매칭
3. PDF page-line citation

### Phase B (1-2 개월):
4. Nanda 2023 의 deep dive (upstream)
5. Chughtai 2024 의 deep dive (downstream)

### Phase C (3-6 개월):
6. 2026 시점 의 latest LLM (o1, Claude 3.5) 와 grokked transformer *재비교* 실험

## 18.4 공정한 평가

### 잘한 것:
1. paper Table 1/2/3 정확 수치 (16_appendix)
2. PyTorch Logit Lens + Causal Tracing 의 algorithm-level 재현 (14_code)
3. 24 챕터 + 5 viz JS + 24/24 self-check + 24/24 wrapper
4. Mech interp era (2024-2026) 의 *4 paradigm shifts* 명시
5. APF / Grokking 트랙 의 *3 axis 인용* 좌표 (09_my_research)

### 덜한 것 (18.2 의 6 한계):
1. PDF line / repo source / citation real-time
2. lettau-virtue 친화 톤 최고 수준
3. Follow-up paper 의 정확 수치
4. Latest LLM 재비교

### 종합:
APF / Grokking manuscript 의 *§1-§6 + Appendix* 의 *모든 explicit reference position* 충분. Appendix 의 *secondary materials* 만 추가 작업 후보.

## 18.5 자기점검 (이 챕터)

### 핵심 3 가지

1. **본 deep dive 의 *가장 critical* 결함?**
2. **APF reviewer 의 *가장 흔한 objection*?**
3. **본 deep dive 의 *완성* vs *추가 작업* 의 경계?**

### 답변

1. **친화 톤 미완성 + LLM 비교 의 2024 시점 한계**. 24/24 wrapper 추가했지만 *수식 4 줄 풀이* + *일상 비유 모든 문단* 의 *full lettau-virtue 적용* X. LLM 비교 는 2024.01 GPT-4 vs 2026 시점 의 o1 / Claude 3.5 가 다름 — 시점 한계.

2. **"Why grokked transformer 가 LLM 의 *replacement* 인가?"**. paper §6 의 LLM 비교가 *narrow task* (composition / comparison) 에 한정. *General reasoning* 에서는 LLM 이 *압도적* (Wang 의 grokked 가 *new domain* 에 *직접 일반화 X*). 대응: "*specialist deployment* 의 *narrow domain 한정*" 강조.

3. **완성**: §1-§6 + Appendix A.1-B.2 의 *모든 explicit position*. **추가 작업**: Appendix B.3+ 의 *secondary materials* (live citation / latest LLM / repo exact match). manuscript main body 의 critical claim 에는 *추가 작업 불필요*.
