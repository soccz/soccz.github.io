# 2026-04-20 · 월 · 코어 버킷 해체

## 대상 논문

**ContiFormer: Continuous-Time Transformer for Irregular Time Series Modeling**
Chen, Ren, Wang, Fang, Sun, Li — NeurIPS 2023 (arXiv: 2402.10635)

## 커버 태그

- 주: `neural-ode-cde` (0 → 1)
- 부: `time-series-transformer` (0 → 1)

## 선정 근거 (요약)

- `_coverage.md`: 코어 전 태그가 0으로 동률. 가장 뒤처진 태그 기준에서 모두 동일 자격.
- `_profile.md`의 **Paper 4 ("Continuous Economic Time Attention — ContiFormer의 ODE 시간 변수 대체")** 가 이 논문을 직접 대체·확장하는 기획. 따라서 월요일 코어 1회차로 이 논문을 먼저 해부하지 않으면 이후 Paper 4 드래프트의 "무엇을 대체하고 있는가"가 공중에 뜬다.
- 2차 근거: `rope-positional`, `conditioning-mechanism` 태그도 이 논문의 연속시간 재해석을 통해 간접 터치됨.

## 대안 후보 (기각 사유)

| 후보 | 태그 | 기각 사유 |
|------|------|----------|
| Su et al. 2021 — RoFormer (RoPE) | rope-positional | Paper 1·2 base line. 이미 내부적으로 충분히 숙지. 월요일 1회차로는 자원 낭비. → 2차 후보로 보류 |
| iTransformer (Liu et al., ICLR 2024) | time-series-transformer | variate-as-token 트릭은 흥미롭지만 conditioning·연속시간 축과 직접 연결 약함 |
| Informer (Zhou et al., AAAI 2021) | time-series-transformer | 이미 고전. 해체보다 재인용이 더 자연스러움 |
| Neural CDE (Kidger et al., NeurIPS 2020) | neural-ode-cde | ContiFormer의 선행. 다음 회차에서 비교 관점으로 읽는 편이 레버리지가 큼 |

## 디렉터리 구조

```
2026-04-20_contiformer/
├── 00_README.md          (이 파일)
├── 01_meta.md            (0. 메타 & 선정 이유)
├── 02_tldr.md            (1. 3층 TL;DR)
├── 03_problem.md         (2. 문제 지형도)
├── 04_claims.md          (3. 핵심 Claim 해체)
├── 05_method.md          (4. 방법론 해부)
├── 06_experiments.md     (5. 실험 해부)
├── 07_limits.md          (6. 가정·한계·반박)
├── 08_lineage.md         (7. 이론적 계보)
├── 09_connection.md      (8. 내 연구와의 연결)
├── 10_expansion.md       (9. 사고 확장)
├── 11_verdict.md         (10. 한 줄 판결)
└── 2026-04-20.md         (위 11개 합본)
```

## 소스 접근 기록

- `arxiv.org/abs/2402.10635` → 403
- `semanticscholar.org` → 403
- `openreview.net` → 403
- `proceedings.neurips.cc` → 403
- `ar5iv.labs.arxiv.org` → 403
- `paperswithcode.com` → 403
- `github.com/microsoft/SeqML/ContiFormer` (README) → **성공**
- `github.com/microsoft/physiopro` (소스 트리) → **성공**

본 해체는 (a) 공식 구현 소스코드, (b) README에 명시된 하이퍼파라미터·데이터셋, (c) 공개된 NeurIPS 2023 프로시딩에 대한 선지식을 교차 검증해 작성. 수식 표기가 원문과 정확히 일치하지 않을 수 있으므로 인용 시 재확인 필요.
