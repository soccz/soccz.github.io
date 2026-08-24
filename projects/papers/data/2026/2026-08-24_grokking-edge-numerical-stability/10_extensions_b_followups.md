# 9. 사고 확장 (b) — Follow-up 논문 3편

> **선정 기준**: 선행 1편(이 논문이 서 있는 지반), 경쟁 1편(같은 질문에 다른 답), 후속 1편(여기서 자라날 방향). 각각 이 레포에서의 커버 상태를 함께 적는다.

---

## 【선행】 Elhage et al. 2021 — *A Mathematical Framework for Transformer Circuits*

- **식별자**: transformer-circuits.pub (2021, Anthropic) — `_index.md` priority **Tier 2 미커버 잔여 항목**, 대기 후보 등재 상태
- **어떤 논문인가**: 트랜스포머를 residual stream 위의 읽기/쓰기 연산으로 재기술하고, embed·unembed·attention head 를 분해해 회로 단위로 볼 수 있게 만든 mech interp 의 기초 표기 체계.
- **본 논문과의 관계**: **직접 인용된다.** Figure 5 캡션 verbatim — "These are highlighted in the plot using the notation from [Elhage et al. 2021]." 최적화 동역학 논문이 NLM 정렬을 파라미터 그룹별로 쪼갤 때 그 좌표계를 여기서 빌린다.
- **무엇을 얻을 수 있나**: ① Figure 5(c)를 제대로 읽으려면 embed/unembed 분해의 의미를 알아야 한다 — 지금은 "어느 부품이 스케일을 키우는가"까지만 읽히지만, 이 프레임을 알면 "**어느 회로 경로가** 스케일을 키우는가"로 해상도가 올라간다. ② `_index.md` 기준 이 항목은 **2026-08-10 ROME 편(§2.3 인용)에 이어 두 번째로 호출**됐다. 세 번 호출되기 전에 커버하는 게 레포 정합성에 맞다. ③ 2026-07-13 SKIP 로그에 접근 실패 기록이 있으므로, 재시도 시 §4-bis 1차 소스 자격 판정이 선행돼야 한다(2026-05-22 Monosemanticity 선례 존재).

---

## 【경쟁】 Kumar, Bordelon, Gershman, Pehlevan 2024 — *Grokking as the Transition from Lazy to Rich Training Dynamics*

- **식별자**: **arXiv:2310.06110** (v3 2024-04-11) · **ICLR 2024 Poster** (`iclr.cc/virtual/2024/poster/17515`, OpenReview `vt5mnLVIVo`) — **미커버**, 오늘 후보 평가에서 대기 후보로 이월
- **어떤 논문인가**: 그로킹을 "네트워크가 초기 특징으로 커널 회귀 해를 먼저 맞추고, 그 뒤 늦게 특징 학습이 일어나 일반화 해를 찾는" 전이로 설명한다. 지연의 결정자를 ① 특징 학습 속도 ② **초기 NTK 와 타깃의 정렬**로 든다(arXiv abs 확인). 초록 첫 문장 verbatim: "We propose that the grokking phenomenon, where the train loss of a neural network decreases much earlier than its test loss, can arise due to a neural network transitioning from lazy training dynamics to a rich, feature learning regime."
- **본 논문과의 관계**: **같은 질문, 다른 층위.** Kumar 는 왜 학습이 **늦게 시작되는가**, Prieto 는 왜 학습이 **도중에 멈추는가**를 설명한다. 배타적이지 않고 겹칠 수 있다 — "정렬이 나빠 늦게 출발하는데, 출발 전에 SC 가 도착하면 영원히 못 간다"는 통합 그림이 가능하고, 이 통합은 본 실행 확인 범위에서 **아직 쓰이지 않았다**.
- **무엇을 얻을 수 있나**: **Grokking track 에는 Prieto 보다 Kumar 가 더 중요하다.** 이유는 09 절에 쓴 대로다 — Kumar 는 **다항식 회귀**에서 그로킹을 만들어 CE 손실에 의존하지 않으므로, 시계열 예측(MSE)으로 그대로 전이된다. "초기 NTK 와 타깃의 정렬"은 시계열에서 직접 측정 가능한 양이고, 비정상성(non-stationarity)이 그 정렬을 시간에 따라 무너뜨린다는 가설로 자연스럽게 이어진다.
- **주의**: 본 실행에서 이 논문의 arXiv HTML 전문을 열어 확인한 결과 **원문에 표가 하나도 없다**(NO TABLES). 커버할 때 `_prompt.md` §4-bis Q2(주 결과 표 번호+수치)의 대응 방식을 **사전에 결정**해야 한다 — 이건 접근 문제가 아니라 문서 구조 문제이므로, 2026-08-21 Neural Hawkes 건과 같은 유형이다.

---

## 【후속】 Thilak et al. — *The Slingshot Mechanism*

- **식별자**: `_index.md` priority **Tier 3** 에 "(2023) The Slingshot Mechanism | Thilak et al. (2023) | training-dynamics" 로 등재, **미커버**. **canonical identifier 는 `_index.md` 기준 `(2023)` 으로 불완전** → 선정 전 arXiv ID/venue 확인 필수(`_prompt.md` §4 Source Lock 1번 규칙).
- **어떤 논문인가**: 적응형 옵티마이저(Adam 계열)에서 훈련 손실이 급등했다가 떨어지는 "슬링샷" 현상과 그로킹의 관계를 보고한 작업으로 `_index.md` 에 기록돼 있다.
- **본 논문과의 관계**: **본 논문 Appendix H 가 이 연결선을 먼저 깔았다.** 제목 verbatim "SC and the Slingshot Effect", 저자들의 가설: 슬링샷이 "could lead to generalization because they prevent full SC" — 손실 스파이크가 로짓을 흔들어 SC 를 깨뜨리기 때문에 일반화를 부를 수 있다. 저자들 스스로 "more research would be needed to properly show this"라고 못 박았으므로, **이건 검증되지 않은 가설이다.** 인용 시 "Prieto et al. 이 슬링샷을 SC 로 설명했다"고 쓰면 과장이다.
- **무엇을 얻을 수 있나**: ① 두 편을 나란히 읽으면 "적응형 옵티마이저의 불안정성이 사실은 수치 포화에서 탈출하는 메커니즘"이라는 재해석 가설을 검증 가능한 형태로 세울 수 있다 — 슬링샷 직전에 loss==0 샘플 비율이 정점을 찍고 직후에 떨어지는지 로깅하면 바로 확인된다. ② `training-dynamics` 태그는 `_coverage.md` 기준 4건(마지막 2026-06-22)으로 코어 최소군이라 커버 명분도 있다. ③ 다만 Source Lock 상 식별자 확인이 선행돼야 하고, 워크샵/프리프린트 only 라면 게이트 A 불충족이므로 **게이트 B 증거(인용 속도·후속 흐름)가 확인될 때만** 선정 가능하다.

---

## 세 편을 함께 읽는 순서 제안

1. **Kumar 먼저** — Grokking track 의 이론 뼈대를 정하는 게 급하다(회귀로 전이되는 유일한 프레임).
2. **Elhage 다음** — APF·Grokking 양쪽에서 회로 분석 표기의 정본이고, 이미 두 번 호출됐다.
3. **Thilak 마지막** — 식별자 확인과 게이트 판정이 선행돼야 하고, 본 논문 Appendix H 가 미검증 가설이라 급하지 않다.
