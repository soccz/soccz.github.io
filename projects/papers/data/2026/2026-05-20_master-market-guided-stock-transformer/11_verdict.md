# 11_verdict — 한 줄 판결

## 📌 이 챕터 다 읽으면 알 수 있는 것

- 한 줄 판결 (verdict)
- 본 paper 의 최종 평가
- 연구 활용 우선순위 + APF/ProTran-TFA 와의 연결점

---

### 🌱 한 줄 판결 — 일상 비유

학생 (MASTER) 의 final grade:

| 항목 | 평가 |
|------|------|
| **장점** | 두 핵심 trick (game-changing): cross-time + market gating |
| **약점** | 단일 시장 (중국만), T=8 짧음, ablation 일부 불명 |
| **연구 가치** | APF/ProTran-TFA 와 강하게 연결됨 |
| **최종** | **★★★★☆ (Strong) — 학계 기여 + 실용 가치 + 연구 영감** |

### 🔑 핵심 통찰

> MASTER 는 "single innovation 이 아닌 design choice 의 결합" 의 모범. Cross-time relay + market gating 의 두 묘수 결합이 +13% statistical / +47% portfolio 의 증폭 효과 만듬. 후속 연구 (FinMamba 등) 의 baseline reference.

---

> **MASTER는 "종목 간 교차 시간 어텐션 + 시장 국면 게이팅"이라는 두 설계 원칙의 묶음으로 중국 주식 예측 벤치마크를 갱신한 견실한 공학 논문이며, APF의 inter-stock attention motif 분석 테스트베드이자 ProTran-TFA에 이식 가능한 market-conditioned feature gating의 설계 레퍼런스로 내 연구 지도에 핀을 꽂는다.**

---

**판결 근거**:

- **읽을 만한 이유**: fin-ts-dl의 0-coverage를 채우면서 APF(§C/§D)와 ProTran-TFA(§E) 모두에 구체적으로 연결되는 희귀한 논문. 공식 코드 + 체크포인트가 공개되어 있어 실험적 확장 비용이 낮다. 1,500+ citation (2024-05) 으로 시계열 stock prediction 의 표준 baseline.

- **약점**: 중국 단일 시장, T=8 단일 lookback, Source Lock 전문 접근 불가로 일부 수치 미확인. Cross-time 상관 포착의 직접적 ablation 분리가 불명확. 거래 비용 미반영. 동일 게이팅 (모든 종목 공통) 의 oversimplification.

- **연구 활용 우선순위**: 
  1. **APF 프로젝트 §D 섹션의 금융 도메인 시각화 사례** — inter-stock attention matrix 의 2D motif 분석
  2. **ProTran-TFA 재개 시 gating 모듈 설계 참조** — market-conditioned feature gating 의 직접 이식
  3. **Grokking 트랙의 비정상 금융 TS 학습 동역학 사례** — non-stationary 환경에서 attention 학습
  4. **후속 확장**: hierarchical gating (시장+섹터+종목), 다시장 (US/JP/KR), 거래 비용 반영 백테스팅
