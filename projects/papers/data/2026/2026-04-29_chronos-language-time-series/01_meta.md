# 01. 메타 & 선정 이유

## 기본 서지 정보

| 항목 | 내용 |
|------|------|
| 제목 | Chronos: Learning the Language of Time Series |
| arXiv | 2403.07815 (v1: 2024-03-12, v3: 최신) |
| 게재처 | Transactions on Machine Learning Research (TMLR), 2024년 10월 |
| 인용 수 | 약 600+ (Semantic Scholar, 2026-04 기준 — 페치 제한으로 정확 수치 미확인) |
| 코드 | github.com/amazon-science/chronos-forecasting (Apache 2.0) |
| 모델 | HuggingFace: amazon/chronos-t5-tiny/mini/small/base/large |

## 저자 배경

제1저자 **Abdul Fatir Ansari** (Amazon)와 **Yuyang Wang** (Amazon, 교신저자)이 이끄는 Amazon 내부팀 작업이다. **Michael W. Mahoney** (UC Berkeley) 와 **Andrew Gordon Wilson** (NYU Courant) 이 공저자로 포함되어 있어 이론적 신뢰성을 보강한다. Wilson은 GP (Gaussian Process) 분야의 대표적 권위자로, KernelSynth의 GP 기반 합성 데이터 생성이 그의 전문 영역과 직결된다. 팀 규모는 18명으로, Amazon Science 내 시계열 예측 팀의 플래그십 논문에 해당한다.

아마존 과학 블로그(Amazon Science)에 별도 페이지가 존재하며, 코드와 모델 가중치 모두 공개돼 있다. 후속작 **Chronos-2** (arXiv:2510.15821, 2025-10)가 다변량/공변량 확장을 커버하였다.

## 선정 이유

**오늘 버킷**: 수요일 = 인접 버킷 (§D + §E)

**Priority 매칭**: `_index.md` "TS Transformer baselines" 섹션의 우선 읽기 항목 (`ts-transformer-baseline` 태그, 커버 수 0).

**선정 근거 3가지**:

1. **APF 직접 입력**: Chronos는 T5 인코더-디코더로 시계열 토큰 시퀀스를 처리한다. 토큰화된 TS에서 Self-Attention이 어떤 패턴(diagonal / stripe / block / edge?)을 형성하는지는 APF 프레임워크가 즉시 탐구 가능한 미답 영역이다. 논문 자체는 어텐션 시각화를 다루지 않는다 — 빈 공간이다.

2. **Grokking 직접 입력**: Chronos 사전학습의 훈련 동학 — cross-entropy 손실로 이산 토큰을 학습하는 구조는 Power 2022, Nanda 2023이 분석한 알고리즘 grokking의 NLP 언어모델 버전이다. "TS 토큰 시퀀스에서 grokking이 일어나는가?"는 Grokking track의 핵심 확장 질문이다.

3. **금융 월 1회 규칙**: `probabilistic-forecast` 태그 교차 커버. Chronos는 분포 예측(distributional forecast) 모델이며, 금융 TS 예측에 직접 적용 가능하다. `fin-ts-dl`과 `probabilistic-forecast` 두 커버 0 태그 중 하나를 이번 실행으로 채운다.
