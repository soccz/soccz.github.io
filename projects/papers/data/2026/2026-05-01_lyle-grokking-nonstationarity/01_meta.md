# 01 — 메타 & 선정 이유

## 서지 정보

| 항목 | 내용 |
|------|------|
| **제목** | What Can Grokking Teach Us About Learning Under Nonstationarity? |
| **저자** | Clare Lyle, Ghada Sokar, Razvan Pascanu, András György |
| **소속** | Google DeepMind |
| **발표처** | CoLLAs 2025 (4th Conference on Lifelong Learning Agents) |
| **arXiv** | 2507.20057 (제출: 2025-07-26) |
| **인용 수** | 미확인 (2025년 7월 제출, 접근 제한으로 Semantic Scholar 수치 불가) |
| **선행 연구** | Lyle et al. NeurIPS 2024 "Normalization and effective learning rates in RL" (arXiv:2407.01800) |

## 저자 권위 배경

**Clare Lyle** (Google DeepMind): RL의 소성(plasticity) 상실 문제 전문가. "Disentangling the Causes of Plasticity Loss in Neural Networks" 등 지속학습·RL 표현 동학의 핵심 연구자. NeurIPS 2024 NaP 논문의 제1저자이기도 하며, 2025년 현재 가장 활발하게 grokking-continual learning 교차 영역을 개척하고 있다.

**Razvan Pascanu** (Google DeepMind): RNN 그래디언트 소실/폭발 이론의 고전 논문 저자, DeepMind의 이론 ML 리서처. 다수의 딥러닝 동학(dynamics) 기반 논문에 참여.

**Ghada Sokar** (Google DeepMind): 소성 상실 및 신경망 continual learning 전문. "The Dormant Neuron Phenomenon" 등 관련 작업.

**András György** (Google DeepMind): 이론 ML, 온라인 학습, 최적화 전문.

→ DeepMind plasticity/continual-learning 팀의 핵심 구성원이 직접 grokking-continual 연결을 분석한 논문이다.

## 선정 이유

1. **Priority Tier 1 매칭**: `_index.md`의 "사용자 우선 읽기 목록 Tier 1"에 "(2025) Grokking and Primacy Bias in Continual Learning | Lyle et al. (2025) | grokking-delayed-gen / continual-learning"으로 등재된 논문이다. 이것이 해당 논문의 완성된 형태임이 검색으로 확인됐다.

2. **태그 커버리지**: `continual-learning` 태그 커버 수 0 — 가장 뒤처진 원거리 태그 중 하나.

3. **Grokking 트랙 직결**: 현재 active track인 "Grokking in TS Transformers"에서 핵심 질문인 "왜 grokking이 일어나는가, 어떻게 촉진할 수 있는가"에 직접 답하는 논문이다. ELR 개념은 Grokking 실험 설계에서 weight decay의 역할을 이론적으로 설명해준다.

4. **저자 권위 + 발표처**: CoLLAs는 지속학습 분야의 핵심 학회. DeepMind 팀의 논문은 재현성·실험 품질 면에서 신뢰도가 높다.

5. **연결 폭**: Grokking(§A) × Continual Learning(§F) × RL(§E와 인접) × 소성 상실 이론을 모두 아우른다. 원거리 버킷이지만 APF·Grokking 두 active track과의 전이 가능성이 높다.
