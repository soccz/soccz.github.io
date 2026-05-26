# 18 본 deep dive 의 자기비판

> **🧒 본 챕터는 "deep dive 자체의 한계 인정"**: ACDC deep dive 의 완성도 솔직 평가.

## 18.1 챕터 한 줄 요약

> **"본 deep dive 가 ACDC 의 algorithm + 5 tasks + lineage 의 대부분 측면 다루지만 *exact algorithm proof*, *officials repo line-by-line*, *Patchscopes/SFC 의 정확 수치*, *Industry use case detail* 까지는 미도달."**

## 18.2 못 한 6 가지

### 1. paper §3 algorithm 의 *exact proof* X
ACDC 의 *correctness proof* (paper Appendix B) 는 *summary* 만. *formal proof* 검증 X.

### 2. Official repo `ArthurConmy/Automatic-Circuit-Discovery` source line 매칭 X
14_code 는 *paper description* 기반 재구성. *exact API match* 검증 X.

### 3. 5 tasks 의 *exact circuit edges* X
16_appendix 의 task summary 는 *high-level*. 각 task 의 *26 edges 의 specific list* X.

### 4. Patchscopes / SFC 의 정확 수치 X
17_aftermath 의 후속 paper 결과는 *estimate*. exact values 미검증.

### 5. Industry use cases (Anthropic Claude 등) 의 *internal detail* X
공개 정보만 — Anthropic 의 internal mech interp pipeline 의 *exact tool stack* X.

### 6. Cross-architecture (LLaMA, Mistral 등) 의 ACDC 적용 *empirical 비교* X
GPT-2 small 만 paper 주요 — 다른 architecture 의 *replication* X.

## 18.3 추가 작업

- Phase A: paper §3 proof 정밀 분석 + official repo verification
- Phase B: 5 tasks 의 exact circuit 추출 + Patchscopes deep dive
- Phase C: cross-architecture ACDC 실험

## 18.4 공정한 평가

### 잘한 것:
1. ACDC algorithm 의 step-by-step 설명
2. IOI 26-edge circuit 의 component breakdown
3. PyTorch reproduction code
4. 25 chapters + 25/25 self-check + 25/25 wrapper
5. Mech interp era (2023-2026) 의 4 paradigm shifts

### 덜한 것:
1. Exact proof / repo source / circuit list
2. Patchscopes / SFC exact numbers
3. Cross-architecture validation

### 종합:
APF / Grokking manuscript 의 §1-§6 + Appendix 의 explicit reference position 충분. Appendix secondary materials 추가 작업.

## 18.5 자기점검

### 핵심 3 가지

1. **본 deep dive 의 *가장 critical* 결함?**
2. **APF reviewer 의 *흔한 objection*?**
3. **완성 vs 추가 작업 경계?**

### 답변

1. **5 tasks 의 *exact circuit edges* 부재**. 본 deep dive 의 IOI 26-edge 는 paper 의 *high-level summary*. APF 의 *motif typology* 비교 시 *exact edge list* 가 *direct match analysis* 필수. **paper Appendix C-D** 의 *exact tables* 정독 필요.

2. **"ACDC 의 *threshold sensitivity* 가 reproducibility 약화"**. τ=0.06 의 *empirical chosen* — 다른 task 또는 model 에서 *동일 τ* 적용 시 *over/under pruning* 위험. 대응: paper §5 의 *threshold sweep* + 본 deep dive 의 *Goldilocks zone* (0.05-0.1) 강조.

3. **완성**: §1-§6 reference + Appendix A.1-B.2. **추가 작업**: B.3+ (exact circuits, Patchscopes detail, industry adoption). manuscript main body 의 critical claim 에는 추가 작업 불필요.
