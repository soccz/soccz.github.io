# 01 — 메타 & 선정 이유

## 서지 정보

| 항목 | 내용 |
|------|------|
| **arXiv** | 2405.15071 (초고 2024-05-24, v2 이후 NeurIPS 최종본) |
| **발표처** | NeurIPS 2024 (Poster) |
| **인용 수** | Semantic Scholar 기준 ~50회 이상 (2025년 초 기준, 신흥 급성장 논문) |
| **코드·데이터** | 공개 (github.com/OSU-NLP-Group/GrokkedTransformer), 데이터 생성 노트북 포함 |

## 저자 배경

- **Boshi Wang** (제1저자, OSU NLP PhD student): NLP 추론 및 LLM 이해 전공. OSU NLP Group의 핵심 박사과정.
- **Xiang Yue** (공동 제1저자): MMMU 벤치마크 등 다중모달 평가로 유명.
- **Yu Su** (공동 교신): OSU NLP Group 교수, knowledge-grounded NLP의 권위자.
- **Huan Sun** (교신): OSU CSE 교수, 지식 기반 AI 및 NLP 추론 다수 NeurIPS/EMNLP 발표.

OSU NLP Group은 KnowledgeBase QA, 다중 홉 추론, LLM 평가 분야에서 꾸준히 top-venue 논문을 내는 연구실이다.

## 선정 이유

**왜 지금, 이 논문인가?**

사용자는 2026-04-22 저녁에 "Grokking in Time Series Transformers" 트랙을 시작했다. 이 논문은 그 트랙의 **이론적 토대**를 제공하는 동시에, 세 가지 즉각적 가치를 갖는다:

1. **메커니즘 근거**: "왜 grokking이 필요한가"를 단순 관찰이 아닌, 두 회로(Cₘₑₘ vs Cᵍᵉⁿ)의 경쟁 메커니즘으로 설명한다. Grokking track 논문의 Related Work / Motivation 섹션을 직접 보강한다.

2. **태스크 전이 신호**: 이 논문은 알고리즘 태스크(합성 knowledge graph)에서의 grokking을 다루지만, composition·comparison 구분이 시계열 예측의 "패턴 조합 vs 임계값 비교" 구조와 구조적으로 유사하다. `_profile.md` §B·§C 교차지점.

3. **아키텍처 교훈**: cross-layer 지식 공유(parameter sharing) 실험이 EOA의 순환적 attention 설계와 직접 비교 가능한 시사점을 제공한다. `_profile.md` §A.

**원거리 버킷이지만 전이 가능성**: 이 논문은 `algorithmic-grok` 태그지만 사용자의 Grokking axis (§B)에 코어 수준으로 직결된다. 금요일 원거리 버킷의 "전이 가능성 탐색" 의무를 충분히 이행한다.
