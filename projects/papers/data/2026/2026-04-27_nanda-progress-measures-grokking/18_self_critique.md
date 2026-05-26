# 18 본 deep dive 의 자기비판 — 한계와 추가 작업

> **🧒 본 챕터는 "deep dive 자체의 한계 인정"**: 본 deep dive 가 *완성* 인가의 *솔직한* 자기 평가. APF / Grokking reviewer 의 anticipatable objection 사전 명시.

## 18.1 챕터 한 줄 요약

> **"본 deep dive 가 paper Nanda 2023 의 *대부분* 측면을 다루지만 *line-by-line PDF citation*, *official repo source code 매칭*, *critical frequencies exact values*, *친화 톤 의 lettau-virtue 최고 수준* 까지는 미도달."**

## 18.2 본 deep dive 가 *못 한* 6 가지

### 1. paper PDF line-by-line citation X
§-level + Equation/Figure 번호 까지만. *individual 문장 의 page-line* X.

### 2. Official `neelnanda-io/Grokking` repo source line 매칭 X
14_code 의 PyTorch 는 *paper description* + Nanda blog posts 기반 재구성. exact code-line 매칭 미검증.

### 3. Critical frequencies 의 *exact 값* X
paper §3.2 가 *top-6 frequencies* 언급하나 *exact values* (k=14, 25, 36, 45, 62, 78) 은 *합리적 추정*. paper supplementary 또는 repo 의 *exact values* 와 매칭 미검증.

### 4. Citation count real-time X
17_aftermath 의 ~970 citation = *합리적 estimate*. Google Scholar 실시간 X.

### 5. 친화 톤 lettau-virtue 최고 수준 X
25/25 wrapper + 25/25 self-check 추가했지만 *수식 4 줄 풀이* + *일상 비유 모든 문단* 의 *full lettau-virtue 적용* X.

### 6. Other primes ($p = 53, 257$) 의 *재현 검증* X
paper §6 의 *robustness* (다른 prime) 는 *언급* 만 — exact 결과 수치 X.

## 18.3 추가 작업

### Phase A (1 주):
1. Google Scholar live query
2. `neelnanda-io/Grokking` repo 검증
3. PDF page-line citation
4. Critical frequencies exact values

### Phase B (1-2 개월):
5. Power 2022 (선행) deep dive
6. ACDC 2023 (직접 후속) deep dive

### Phase C (3-6 개월):
7. *Foundation model 에 progress measures 적용* 실험
8. 친화 톤 v2 (lettau-virtue 수준)

## 18.4 공정한 평가

### 잘한 것:
1. Fourier circuit 의 *exact mathematical form* 명시 (paper §3.2)
2. 4-phase trajectory + 3 progress measures 의 *정확 설명*
3. PyTorch 재현 코드 (Modular task + Grokking loop + Fourier analysis)
4. 25 chapters + 25/25 self-check + 25/25 wrapper
5. Mech interp era (2023-2026) 의 *4 paradigm shifts* 명시

### 덜한 것 (18.2 의 6 한계):
1. PDF line / repo source / critical freq exact
2. lettau-virtue 친화 톤
3. Robustness (other primes) 정확 수치

### 종합:
APF / Grokking manuscript 의 *§1-§6 + Appendix* 의 *모든 explicit reference position* 충분. Appendix *secondary materials* 만 추가 작업.

## 18.5 자기점검 (이 챕터)

### 핵심 3 가지

1. **본 deep dive 의 *가장 critical* 결함?**
2. **APF reviewer 의 *흔한 objection*?**
3. **본 deep dive 의 *완성 vs 추가 작업* 경계?**

### 답변

1. **Critical frequencies exact values 부재**. paper §3.2 의 *top-6 frequencies* — 본 deep dive 는 *추정* (14, 25, 36, 45, 62, 78). exact value 가 *paper supplementary 또는 repo* 에 *명시* 있으면 *exact citation* 가능. **두 번째**: PDF line-by-line citation 부재 — §-level 까지만.

2. **"Modular arithmetic 가 *too toy* 라 real LLM 일반화 의문"**. Nanda 의 *task-specific exact* 가 *strength* (mechanism validation) but *weakness* (LLM scalability X). 대응: *Wang 2024 의 practical reasoning extension* + *ACDC / SFC 의 generalization tool* 의 *lineage* 강조.

3. **완성**: §1-§6 + Appendix A.1-B.2 의 모든 explicit position. **추가 작업**: Appendix B.3+ 의 secondary materials (live citation / exact freq values / Power 2022 deep dive). manuscript main body 의 critical claim 에는 추가 작업 불필요.
