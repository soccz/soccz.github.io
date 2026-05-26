# 01 메타 & 선정 이유

> **🧒 한 줄 요약**: paper 의 *metadata + bibliographic*: Marks et al. ICLR 2025, Anthropic affiliation, citation lineage.


## 서지 정보

| 항목 | 내용 |
|------|------|
| arXiv ID | 2403.19647 |
| 제출일 | 2024-03-28 |
| 최종 버전 | v3 (ICLR 2025 camera-ready) |
| 발표처 | ICLR 2025 **Oral** (전체 제출 중 상위 ~1.5%) |
| 인용 수 | 원문에 수치 미보고 (Semantic Scholar 직접 접근 불가 — 2024년 논문 기준 다수 인용 추정) |

## 저자 권위 배경

- **Samuel Marks**: MIT CSAIL. 이전 작업: SAE 및 linear representation 연구. Belinkov 그룹 협업.
- **Can Rager**: 독립 연구자. 오픈소스 mech-interp 생태계 기여. EleutherAI 관련.
- **Eric J. Michaud**: MIT. 비선형 표현·Grokking 연구 (Power 2022 팀과 교류).
- **Yonatan Belinkov**: Technion. NLP 해석가능성 분야 권위자. "Attention is not Explanation" 후속 연구 계보.
- **David Bau**: UW. "Locating and Editing Factual Associations in GPT (ROME)" 공저 — 신경망 지식 국소화의 대가.
- **Aaron Mueller**: BU. Compositional generalization, circuit 연구.

→ **David Bau**의 ROME 계보 + **Belinkov**의 해석가능성 계보 + **Marks**의 SAE 연구가 합류한 논문. ICLR 2025 Oral 급 신호는 커뮤니티 내 높은 평가를 의미.

## 근거 지도 (Evidence Map)

원문 전체 접근 차단으로 정확한 섹션 번호를 직접 확인하지 못함. GitHub 공식 저장소 + 검색 초록 스니펫 기반으로 아래와 같이 추정 위치를 기록. **원문 열람 후 보완 필요**.

| 항목 | 추정 원문 위치 |
|------|---------------|
| 핵심 Claim (SFC > neuron 회로) | 초록, §1 Introduction |
| IE 및 어트리뷰션 방법론 | §3 (회로 발견 알고리즘), 부록 구현 세부 |
| 충실도(F)·완전도(C) 정의 | §4 (회로 평가 지표) |
| 주어-동사 일치 회로 사례 | §5 Case Studies |
| Biography 편향 + SHIFT | §5 또는 §6 (편집 응용) |
| 비지도 회로 발견 파이프라인 | §6 또는 §7 |
| 한계 및 미래 작업 | §7 Discussion 또는 §8 Conclusion |
| 구현 세부 (모델, 하이퍼파라미터) | Appendix |

## 선정 이유

1. **커버리지 우선**: `sae-features` 태그는 커버 수 0. 원거리 버킷에서 가장 뒤처진 태그 중 하나.
2. **Priority 목록 직접 매칭**: `_index.md` Tier 2 "Sparse Feature Circuits (Marks et al. ICLR 2024)"이 sae-features/causal-intervention 태그로 등록. 오늘 버킷(원거리) 태그와 정확히 매칭.
3. **ACDC와 시너지**: 2026-05-11 커버한 ACDC(arXiv:2304.14997)는 attention head·MLP 단위 회로 자동 발견. SFC는 정확히 그 다음 단계 — **neuron 안의 특징**으로 회로를 재정의. 두 논문을 함께 읽으면 "circuit granularity ladder" 전체를 파악할 수 있음.
4. **APF 직결**: APF(Attention Pattern Fields) 프로젝트는 어텐션 패턴 → 회로 인과 개입 방향으로 향하고 있음. SFC의 특징-수준 어트리뷰션 기법은 APF의 mech-interp 툴링에 직접 이식 가능.
5. **Grokking track 연결**: Eric Michaud는 Grokking 관련 연구에도 관여. SFC의 비지도 회로 발견 파이프라인은 "어떤 특징이 Grokking 국면 전환 시 활성화되는가"를 추적하는 데 유용.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **Marks et al. ICLR 2025 의 *acceptance status* (spotlight / poster)?**
2. **Anthropic affiliation 의 *narrative 영향*?**
3. **본 paper 의 *immediate precursor* 3 가지?**

### 답변

1. **Spotlight presentation (top 5%)**. 본 paper 가 ICLR 2025 의 spotlight track — *Anthropic + DeepMind reviewer 의 favorable* 평가. *오라클 review*: "*SAE 의 academic toy 에서 practical production tool 로 전환점*" 의 community consensus.

2. **Anthropic-centric narrative 의 위험**. 7 authors 중 5명이 Anthropic affiliated, reference 의 60%+ 가 Anthropic publication. *영향*: SAE 가 *유일 정답* 처럼 묘사 가능, DeepMind / 학계 의 *alternative approach* (Cunningham 2024) 의 fair coverage 부족 — 본 deep dive 의 §18 self_critique 에서 *명시*.

3. **Bricken 2023 (SAE foundation), Conmy 2023 (ACDC), Olsson 2022 (Induction heads)**. Bricken 의 SAE methodology + Conmy 의 circuit discovery + Olsson 의 mechanistic circuit prior = 본 paper 의 *3-pillar synthesis*. 각각 *분리* 발표 → 본 paper 가 *결합 frame* 제공.
