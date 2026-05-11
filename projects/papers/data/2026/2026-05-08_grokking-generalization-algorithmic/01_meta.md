# 01 — 메타 & 선정 이유

## 서지 정보

- **arXiv**: [2201.02177](https://arxiv.org/abs/2201.02177)
- **발표처**: ICLR 2022 Mathematics of Modern Machine Learning (Math-AI) Workshop
- **인용 수**: 미확인 (Semantic Scholar 접근 불가 / 1,500+ 예상 — 다수 인용 논문 확인됨)
- **저자 배경**: Alethea Power (OpenAI), Yuri Burda (RL 연구, OpenAI), Harri Edwards (OpenAI), Igor Babuschkin (OpenAI, 이후 Inflection), Vedant Misra (Google Brain으로 이동). 전원 OpenAI 연구자로 GPT 계열 훈련 dynamics 연구 배경.

## Source Lock 상세

| Lock 단계 | 결과 | 근거 |
|-----------|------|------|
| Canonical ID | ✅ | arXiv:2201.02177 — 웹 검색 10개 이상 출처 교차 확인 |
| 메타데이터 | ✅ | 제목·저자·연도·발표처 일치 확인 |
| 전문 접근 | ⚠️ | PDF 직접 열람 불가. **공식 코드 저장소** `github.com/openai/grok` (저자 직접 관리)의 `transformer.py`, `training.py`, `data.py` + xanderdavies 복제 README + 15개 이상 인용 논문 스니펫으로 방법론·실험·결과 교차 검증 |
| 근거 지도 | ✅ | 아래 참조 |

## 근거 지도

| 항목 | 출처 위치 |
|------|-----------|
| 핵심 Claim (grokking 존재) | 초록 (검색 스니펫 직접 인용) |
| Claim (데이터 크기 → 일반화 시간) | 초록 (검색 스니펫) |
| Claim (위상 다이어그램 4구간) | 검색 스니펫 (Liu 2022 인용 포함) |
| Claim (weight decay 효과) | 검색 스니펫 (원문 직접 인용) |
| 방법론 — 모델 구조 | `github.com/openai/grok` → `grok/transformer.py` (Transformer 클래스) |
| 방법론 — 최적화 | `github.com/openai/grok` → `grok/training.py` (configure_optimizers) |
| 방법론 — 과제 정의 | `github.com/openai/grok` → `grok/data.py` (VALID_OPERATORS, MODULUS=97) |
| 실험 — 모듈 나눗셈 50% 분할 | xanderdavies/grok README (50/50 split, mod 97 확인) |
| 한계 | 논문 Conclusions 섹션 (직접 열람 불가 — 알려진 한계만 기술) |

## 선정 이유

**오늘 버킷**: 원거리 (금요일). **우선순위 항목**: `_index.md` "사용자 우선 읽기 목록 Tier 1 — Grokking primary"에서 `algorithmic-grok` 태그로 등재. `sae-features` 우선 시도(Marks 2024, Bricken 2023) → PDF 전문 접근 불가로 Source Lock 실패 → `algorithmic-grok` Power 2022로 전환.

**왜 지금**: 능동 연구 트랙 "Grokking in TS Transformers"의 **출발점 논문**. Nanda 2023(Progress Measures, 이미 커버)·Lyle 2025(Nonstationarity, 이미 커버)가 모두 Power 2022를 1차 참조로 삼는다. `must_cite.md`의 최상단 항목 중 유일하게 미커버. 논문이 짧고 실험 중심이라 원 실험 설정을 코드로 완전 재현 가능하다는 점이 특징.
