# 01. 메타 & 선정 이유

## 서지 정보

| 항목 | 내용 |
|------|------|
| 저자 | Yong Liu¹, Tengge Hu¹, Haoran Zhang¹, Haixu Wu¹, Shiyu Wang¹, Lintao Ma², Mingsheng Long¹ |
| 소속 | ¹Tsinghua University (thuml 랩, Long 교수 그룹) · ²Ant Group |
| arXiv 제출 | 2023-10-10 (v1) |
| 게재 | ICLR 2024 Spotlight |
| 인용 수 | 약 500+ (2024년 기준 scispace 173, 이후 급증 추정) |
| 코드 | https://github.com/thuml/iTransformer (pip install 가능, GluonTS 통합) |

## 저자 권위 배경

Mingsheng Long 교수(thuml 랩)는 Autoformer(NeurIPS 2021), TimeMixer(ICLR 2024) 등 TS 트랜스포머의 연속 발표 그룹이다. 이전 작업들이 시계열 분해 및 Auto-Correlation에 집중했다면, iTransformer는 그 흐름과 결별해 아키텍처 가정 자체를 뒤집는 방향으로 선회한다. Haixu Wu는 TimesNet(ICLR 2023) 제1저자로, 이 논문과의 계보 연결이 명확하다.

## 선정 이유

세 가지 이유로 오늘 선정했다.

첫째, **APF (Attention Pattern Fields) 직접 연결**: APF 연구의 핵심은 "T×T 어텐션 맵에 어떤 2D 모티프가 존재하는가"이다. iTransformer는 어텐션 축을 T(시간)에서 N(변수)으로 전환한다 — 즉 어텐션 맵이 N×N으로 바뀐다. 이 '축 전환'은 APF가 연구하는 T×T 모티프 분류 체계의 반증 실험군 또는 비교 기저로 필수적이다. "T×T 모티프가 예측 성능에 기여하는가?" vs "N×N 모티프가 더 효과적인가?"라는 질문을 iTransformer가 경험적으로 답한다.

둘째, **Grokking 연구 연결**: iTransformer에서 FFN이 각 변수의 시간 패턴(T-dim)을 학습한다. Grokking 연구는 "FFN이 어떤 회로로 주기 패턴을 암기→일반화하는가"를 추적하는 방향인데, iTransformer의 FFN은 정확히 그 역할(시간 방향 표현)을 명시적으로 맡는다.

셋째, **ts-transformer-baseline priority 항목**: `_index.md` 우선 읽기 목록에 등재된 미커버 항목이다.
