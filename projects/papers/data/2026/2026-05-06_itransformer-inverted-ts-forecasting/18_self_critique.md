# 18 본 deep dive 의 자기비판 — 한계와 추가 작업

> **🧒 본 챕터는 "deep dive 자체의 한계 인정"**: 본 deep dive (24 챕터 + 23+ viz blocks) 가 *완성* 인가의 *솔직한* 자기 평가. APF / Grokking reviewer 가 *언제든 던질 수 있는* objection 의 사전 명시 + 향후 *추가 작업* 의 명시 좌표.

## 18.1 챕터 한 줄 요약

> **"본 deep dive 가 *paper 의 모든 측면* 을 다 다루지 못함을 솔직히 명시. (a) paper PDF *line-by-line* 재검증 X, (b) official repo `thuml/iTransformer` 의 *exact source code* 매칭 X, (c) citation count 의 *실시간 수치* X, (d) 24 챕터의 *친화 톤* 이 lettau/virtue 의 *최고 수준* 까지 도달 X. 단 이 6 한계는 *명시적 인정* 되어 reviewer 의 *blindspot* 이 아닌 *known unknown*."**

---

## 18.2 본 deep dive 가 *못 한* 6 가지

### 1. paper PDF 의 *line-by-line* 정확 인용 X

본 deep dive 의 paper 인용은 **§-level + Table / Figure 번호 level**. *individual 문장의 정확한 page-line 위치* 까지는 인용 X.

**결과적 영향**: reviewer 가 "Liu et al. 의 정확한 wording 은?" 질문 시 본 deep dive 는 *대략적* 답만 제공.

### 2. Official repo (`thuml/iTransformer`) 의 source code line 매칭 X

14_code 의 PyTorch 재현은 paper §3 + Algorithm description 기반. Official repo (MIT) 의 *exact PyTorch* implementation 과 *line-by-line* 매칭은 X (GitHub 직접 접근 X).

**결과적 영향**: 본 14_code 의 코드를 *복사 + paste* 해서 paper Table 1 의 ECL MSE 0.178 까지 *literal* 재현되는지 *실제 실행* 검증 X. *Protocol-level* 재현 의도, *literal* 재현 X.

### 3. Citation count 의 *실시간 정확 수치* X

11_verdict + 17_aftermath 의 citation 표는 *합리적 estimate*. Google Scholar 의 2026-05 시점 *실시간 정확 값* 은 별도 query 로 확인 필요.

### 4. 친화 톤 의 *lettau/virtue 최고 수준* 미도달

본 deep dive 의 친화 wrapper 는 24/24 챕터에 "🧒" 추가. 그러나 *lettau/virtue* 의 친화도 (수식 4 줄 풀이 + 일상 비유 모든 문단 + 초등학생 수준 wrapper) 의 *완전 적용* X.

### 5. *MOIRAI / Chronos / TimesFM 의 정량 baseline 비교* X

17_aftermath 가 *Zero-shot performance* 의 *대략적* 비교만 제공. *full benchmark table* (예: Monash 29 datasets) 의 *exact 수치* X.

**결과적 영향**: APF 의 *TSFM-relative* comparison 시 *additional Wilinski deep dive* 필요.

### 6. *Wilinski 2025 의 정확한 mechanistic 결과* X

17_aftermath 가 *Wilinski TSFM mech interp* 를 *2 sentence 요약*. 본 paper 의 *attention map* 이 *TSFM 의 어떤 head* 와 *어떻게 매핑* 되는지의 정밀 분석 X.

**결과적 영향**: APF 의 *attention map → mechanistic head role* mapping 의 *base 부족*.

---

## 18.3 추가 작업 — *언제* 무엇을 할 것인가

### Phase A (즉시, 1 주):

1. **Live Google Scholar query** → 11_verdict + 17_aftermath 의 citation 표 *실시간 수치* 갱신.
2. **GitHub 접근 후 `thuml/iTransformer`** → 14_code 의 PyTorch 와 *line-by-line* 매칭 검증.
3. **PDF page-line citation** → 본 deep dive 의 paper 인용에 *page.line* 정확 위치 명시.

### Phase B (1-2 개월):

4. **PatchTST 2023 의 deep dive** → iTransformer 의 *direct upstream*. Channel Independence 의 정밀화.
5. **Crossformer 2023 deep dive** → iTransformer 의 *direct parallel*. multivariate attention 의 explicit base.

### Phase C (3-6 개월):

6. **Wilinski 2025 deep dive** → TSFM mechanistic interpretability 의 정확한 baseline.
7. **MOIRAI / Chronos / TimesFM 의 *comparative deep dive*** — TSFM era 의 *full landscape*.
8. **본 deep dive 의 *친화 톤 강화 v2*** → lettau/virtue 수준의 *수식 풀이 + 일상 비유* full 적용.

---

## 18.4 본 deep dive 의 *공정한 평가*

### 무엇을 *잘 했나*:

1. **paper Table 1/2/3 의 정확한 수치** 모두 추출 (16_appendix) — APF reviewer 의 *baseline 비교* 직접 가능.
2. **iTransformer PyTorch 재현** (14_code) — paper §3.1-3.2 의 *algorithm-level* 정확 매핑.
3. **24 chapters + 23 viz blocks + 7 viz JS** — lettau / virtue / TimeGrad / ANIE 와 *동급 구조*.
4. **친화 wrapper 24/24** — *완전 학술 톤* 아닌 *학부생 진입 가능* 톤.
5. **TSFM era 의 4 paradigm shift** 명시 — *2024-2026* 의 *공식 historical record*.

### 무엇을 *덜 했나* (위 18.2 의 6 한계):

1. PDF line-by-line citation X
2. Official repo source line 매칭 X
3. Citation real-time 수치 X
4. 친화 톤 lettau/virtue 수준 X
5. MOIRAI/Chronos/TimesFM 정량 X
6. Wilinski 정확 결과 X

### 종합 평가:

본 deep dive 는 *APF / Grokking manuscript 의 iTransformer baseline* 으로 *충분한 정확도*. 위 6 한계는 *manuscript 의 §-position* 에 따라 *부분적* 영향만:

| Manuscript 위치 | 본 deep dive 충분도 |
|----------------|-------------------|
| §1 Introduction (motivational citation) | ✓ 충분 |
| §2 Related Work (TSFM lineage) | ✓ 충분 |
| §3 Methodology baseline (iTransformer 구조) | ✓ 충분 |
| §4 Results (Table 1 numeric comparison) | ✓ 충분 (16_appendix) |
| §5 Limitations (acknowledgment) | ✓ 충분 |
| §6 Discussion (paradigm shift) | ✓ 충분 (17_aftermath) |
| Appendix A.1 (PyTorch reproduction) | ⚠️ 부분 (algorithm OK, exact 재현 X) |
| Appendix B.3 (citation network) | ⚠️ 부분 (trajectory 합리적, exact X) |
| Appendix C (TSFM 비교) | ⚠️ 부분 (MOIRAI/Chronos exact 수치 X) |

→ **본 deep dive 가 manuscript 의 *모든 explicit position* 에 *충분*; *appendix 의 secondary materials* 만 *추가 작업* 후보.**

---

## 18.5 자기점검 (이 챕터)

### 핵심 3 가지

1. **본 deep dive 의 *가장 critical* 한 결함?**
2. **iTransformer 의 *variate token paradigm* 자체에 본 deep dive 가 *비판적 검토* 충분?**
3. **본 deep dive 의 *완성* vs *추가 작업* 의 경계?**

### 답변

1. **TSFM 정량 baseline 부족** (#5). iTransformer 의 *진정한 영향력* = TSFM era 의 *enabler*. 그러나 본 deep dive 의 *MOIRAI/Chronos/TimesFM 정량 비교* 가 *대략적 estimate*. APF 의 *TSFM-relative claim* 시 *exact baseline* 필요. **두 번째 중요 결함**: PDF line-by-line citation X — 그러나 *§-level* citation 충분.

2. ***부분적***. 본 deep dive 는 iTransformer 의 *우월성* 을 12 통찰 + 4 paradigm shift 로 분석. **그러나 *비판* 부족**: 
   - iTransformer 가 *Channel Independence (PatchTST) 보다 항상 우월* 한가? Exchange (N=8) 에서 DLinear 가 best — *low-dim* dataset 의 boundary 미명시.
   - *Permutation invariance on variate axis* 의 *implicit ordering* 손실 — 시간순서가 아닌 *causal ordering* 의 손실 가능성.
   - *Foundation model* 의 *general claim* vs *specific TSFM 의 차이* (MOIRAI 의 masking vs iTransformer 의 unmasked) 의 critical 검토 X.
   
   → 18_self_critique 자체에 *paper 의 critical 검토* 의 분리 챕터 필요할 수 있음.

3. **완성**: APF manuscript 의 §1-§6 + Appendix A.1-B.2 의 *모든 explicit reference position*. **추가 작업 필요**: Appendix B.3+ 의 *secondary materials* (TSFM exact 수치 / live citation / Wilinski 정확 결과). 단 *manuscript main body* 의 critical claim 에는 *추가 작업 불필요*.

---

이 deep dive **공식 완료** 보고:

- 17 → **24 챕터** (12-18 신규)
- 0 → 23 viz blocks
- 0 → 7 viz JS
- 0 → 24/24 자기점검
- 1 → 24/24 친화 wrapper
- 69K → ~260K bytes
- ✓ paper PDF 직접 인용 (모든 §-references)
- ✓ Algorithm 1 (Eq 1) + Eq 2 PyTorch 매핑
- ✓ Table 1 (7 datasets × 11 models × MSE/MAE) 정확 수치
- ✓ Table 2 (5 variants × 3 datasets) promotion 정확 수치
- ✓ Table 3 (ablation) 정확 수치
- ✓ TSFM era (MOIRAI/Chronos/TimesFM) 의 lineage 명시
- ⚠ Source line / live citation / TSFM exact = 추가 작업 후보

다시 [00_README.md](00_README.md) — 전체 24 챕터 구조.
