# 10.b 사고 확장: Follow-up 논문 3편

TimesFM 주변에서 반드시 읽어야 할 3편을 선행 · 경쟁 · 후속 각 1편으로 배치.

## 선행 (필독) — Nie, Nguyen, Sinthong, Kalagnanam 2023 — "A Time Series is Worth 64 Words: Long-term Forecasting with Transformers (PatchTST)" (ICLR 2023, arXiv:2211.14730)

- **왜 이 논문인가**: TimesFM 의 patch = token 트릭의 지적 원조이자, 이 트릭이 시계열 예측에서 정말로 작동함을 supervised 세팅에서 실증한 정거장.
- **본 논문과의 관계**: TimesFM 은 PatchTST 의 patching 아이디어 + language model 파운데이션 트릭을 결합. PatchTST 없이 TimesFM 을 이해할 수 없음.
- **얻을 것**: (i) patch length $p$ 의 supervised 실험 sensitivity (PatchTST 는 $p=16$ 을 기본으로 사용, TimesFM 은 $p=32$ 로 확장). (ii) channel-independence 라는 원칙 — PatchTST 가 다변량을 각 채널 독립으로 처리한 이유는 TimesFM 이 univariate 만 하는 이유와 정합. (iii) instance normalization (RevIN) 트릭 — TimesFM 이 채택했는지 원 §3 확인 필요.
- **사용자 상태**: 이미 사전 독파 (`_index.md` 사전 독파 목록에 arXiv:2211.14730 등록됨). 2026-05-19 QuantileFormer 세션의 dep-cover 로도 dep-mentioned.

## 경쟁 (동시대 대안) — Woo, C. Liu, Kumar, Xiong, Savarese, Sahoo 2024 — "Unified Training of Universal Time Series Forecasting Transformers (MOIRAI)" (ICML 2024 Oral, arXiv:2402.02592) [2026-06-03 ✓]

- **왜 이 논문인가**: TimesFM 과 동시대 (같은 ICML 2024) 이면서 정반대 설계 선택 (encoder + 다변량 + mixture) 을 한 대안 TSFM. 두 논문을 나란히 두면 "TSFM 의 설계 공간" 이 뚜렷해진다.
- **본 논문과의 관계**: TimesFM 은 minimalist decoder-only + point forecast, MOIRAI 는 masked encoder + Any-Variate Attention + 4-mixture probabilistic. 두 논문이 동시대 다른 최적점.
- **얻을 것**: (i) Any-Variate Attention 이 다변량 상호작용을 어떻게 native 로 처리하는지 — TimesFM 의 univariate 한계를 어떻게 채우는가. (ii) 4-mixture distribution head 의 학습 안정성 트릭 — TimesFM v1 이 못한 확률 예측을 이 방식으로 어떻게 해결하는가. (iii) sub-dataset cap ε=0.001 로 도메인 불균형을 정공법 — TimesFM 의 corpus bias 를 이 방식으로 완화 가능. (iv) LOTSA 27.6B 9-domain 코퍼스 vs TimesFM 100B corpus 의 다양성 vs 규모 trade-off.
- **사용자 상태**: 이미 커버 (2026-06-03 ✓, MOIRAI deep dive).

## 후속 (직접 후손) — Das, Kong, Sen, Zhou, Ansari, Torkkola 2024 — "In-Context Fine-Tuning for Time-Series Foundation Models (TimesFM-ICF)" (arXiv:2410.24087)

- **왜 이 논문인가**: TimesFM 저자 자신의 후속. 원 논문의 "zero-shot 만" 을 "few-shot in-context" 로 확장. 즉 downstream 시계열의 예시 (demonstration) 를 context 에 prepend 하면 성능이 얼마나 좋아지는지 정량화.
- **본 논문과의 관계**: 원 TimesFM 은 zero-shot 실증, TimesFM-ICF 는 few-shot in-context 실증. GPT-3 의 zero → few-shot 전환과 동형. 이는 TimesFM 아키텍처의 재활용 가능성을 확장.
- **얻을 것**: (i) in-context learning 이 시계열에서도 가능한가 (언어에서와 얼마나 유사한가). (ii) demonstration 개수 · 다양성 · 길이가 성능에 미치는 sensitivity. (iii) downstream fine-tuning 대비 언제 in-context 가 유리한가. (iv) 파라미터 업데이트 없는 in-context 방식이 실용 응용 (예: production system 에서 매번 fine-tune 없이 예시만 바꿔 넣기) 에서 어떤 utility 를 갖는가.
- **APF/Grokking 연결**: in-context example 이 attention pattern 을 어떻게 재구성하는지 (motif 로 관찰) 관측하면 APF 의 in-context 실험 항목이 됨. 또한 "in-context learning 이 grokking 을 유발/억제하는가?" 는 Grokking TS track 의 open 질문.
- **사용자 상태**: 미커버. TimesFM 을 오늘 커버한 뒤 이 후속을 다음 후보로 우선순위 등록 가능 (`_index.md` 대기 후보 섹션).

## 세 논문의 배치 논리

- PatchTST 는 **"patch 트릭이 왜 시계열에 자연스러운가"** 의 기초 강의.
- MOIRAI 는 **"동일 시대 동일 목표에서 다른 답이 존재함"** 의 반증.
- TimesFM-ICF 는 **"원 논문의 존재 증명이 몇 년 뒤 어떻게 확장되는가"** 의 후속.

이 세 편을 읽으면 TimesFM 을 (i) 지적 원류, (ii) 동시대 대안, (iii) 자기 후속 세 방향에서 이해할 수 있다. 사용자 profile 의 APF + Grokking + P1 track 모두에 이 세 축이 필요한 참조점.
