# 11_verdict — 한 줄 판결

> **MASTER는 "종목 간 교차 시간 어텐션 + 시장 국면 게이팅"이라는 두 설계 원칙의 묶음으로 중국 주식 예측 벤치마크를 갱신한 견실한 공학 논문이며, APF의 inter-stock attention motif 분석 테스트베드이자 ProTran-TFA에 이식 가능한 market-conditioned feature gating의 설계 레퍼런스로 내 연구 지도에 핀을 꽂는다.**

---

**판결 근거**:

- **읽을 만한 이유**: fin-ts-dl의 0-coverage를 채우면서 APF(§C/§D)와 ProTran-TFA(§E) 모두에 구체적으로 연결되는 희귀한 논문. 공식 코드 + 체크포인트가 공개되어 있어 실험적 확장 비용이 낮다.

- **약점**: 중국 단일 시장, T=8 단일 lookback, Source Lock 전문 접근 불가로 일부 수치 미확인. Cross-time 상관 포착의 직접적 ablation 분리가 불명확.

- **연구 활용 우선순위**: (1) APF 프로젝트 §D 섹션의 금융 도메인 시각화 사례, (2) ProTran-TFA 재개 시 gating 모듈 설계 참조, (3) Grokking 트랙의 비정상 금융 TS 학습 동역학 사례 — 이 순서로 활용.
