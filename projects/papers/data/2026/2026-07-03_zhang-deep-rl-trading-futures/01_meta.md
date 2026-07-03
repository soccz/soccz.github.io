# 01. 메타 & 선정 이유

## 기본 정보

- **저자 3인**: Zihao Zhang · Stefan Zohren · Stephen Roberts
- **소속**: Oxford-Man Institute of Quantitative Finance + Machine Learning Research Group, University of Oxford, Department of Engineering Science
- **저자 계보**:
  - **Zihao Zhang**: DeepLOB (2018/2019 IEEE TSP, 2026-05-29 커버) · DeepLOB-Attention · Multi-Horizon Forecasting for LOB · **Momentum Transformer** (arXiv:2112.08534 후속작) 등 quant deep learning 전공 박사과정 시기 작품군
  - **Stefan Zohren**: Oxford-Man Institute 부소장 (기간 중), 확률적 추론 · Gaussian process · fin ML 방법론 리더
  - **Stephen Roberts**: MLRG 그룹 리더, Oxford 공학과 교수, Bayesian ML · TS · signal processing 원로
- **인용 수 (Semantic Scholar 기준)**: 본 환경 접근 차단으로 정확 수치 미확인. 검색 스니펫 상 "highly cited" 수준으로 언급되나 정확 인용 수는 **확인 불가**

## 근거 지도 (Evidence Map)

본 해체의 근거를 논문 내부 위치로 재확인 가능한 anchor 로 요약. 본문 PDF 접근 차단으로 **정확한 절 번호는 통상적 논문 구조 추정** — WebSearch verbatim 인덱스에서 확인된 개념 anchor 만 나열.

| 주제 | 근거 위치 (추정) | 근거 상태 |
|---|---|---|
| 핵심 claim (DRL > TSMOM) | Abstract + Section 1 Introduction | Verbatim search 확인 |
| 3-알고리즘 비교 (DQN/PG/A2C) | Section 3 Reinforcement Learning Algorithms | Verbatim search 확인 |
| Action space (discrete {-1,0,1} vs continuous [-1,1]) | Section 3.1/3.2 (추정) | Verbatim search 확인 |
| Reward function + volatility scaling | Section 3.3 or 4 | Verbatim search 확인 (σ_tgt, σ_{t-1}, 60-day EWMA) |
| LSTM 백본 (2-layer 64→32 + LReLU) | Section 4 or 5 Experimental Setup | Verbatim search 확인 |
| 50 futures 데이터셋 (25+11+5+9) | Section 5 or Table 1 (추정) | Verbatim search 확인 |
| 실험 결과 (DQN 1위, A2C 2위) | Section 5 Results | Verbatim search 확인 |
| 정확 Sharpe/Sortino 수치 | Table 3, 4, 5 (추정) | **본문 PDF 차단으로 미확인** |
| Ablation (transaction cost sweep) | Table 6 or Figure 3 (추정) | **본문 PDF 차단으로 미확인** |
| Limitations | Section 6 Conclusion | **본문 PDF 차단으로 미확인** |

## 왜 지금 이 논문인가 (선정 이유)

### 1) 원거리 버킷 미커버 태그 첫 커버

`_coverage.md` 상 원거리 버킷에서 `rl-trading` 은 **커버 수 0** (지금까지 한 번도 다룬 적 없음). `causal-ml-finance` 도 0 이지만 오늘은 rl-trading 을 선택. 이유: (i) 저자 사용자 프로파일 §F 의 "RL for trading" 명시적 원거리 관심영역, (ii) `_profile.md` 진로 항목 "석사 졸업 후 퀀트 / 차트 분석 industry" 와 industry-relevance 매우 강함, (iii) 사용자 shelved 자산 **AETHER** (crypto cycle RL agent, `AETHER_IDEA.md` 611 줄) 의 기본 RL 정식화 substrate 로 직결.

### 2) Priority 우선 매칭 없음 (0-count 태그 우선 규칙 적용)

`_index.md` 의 "사용자 우선 읽기 목록" 에 rl-trading 태그 명시 항목 없음. `_prompt.md` 3) 선정 절차 규칙 (Priority 매칭 없으면 뒤처진 태그 우선) 적용 → `rl-trading` (0) 선택. `causal-ml-finance` (0) 는 다음 금요일 후보로 대기.

### 3) Venue tier 판정

- *The Journal of Financial Data Science* (JFDS) 2020 → **Tier 3 도메인 top-venue** (PM Research 발행, quant finance 도메인 인정 저널)
- 대안 후보 FinRL (arXiv:2011.09607, NeurIPS 2020 Deep RL Workshop) 은 **Tier 4 워크샵-only** 로 Tier 3 후보에 밀림
- 프롬프트 규정 "Tier 1·2 후보가 동등하면 우선 선택" → 오늘은 Tier 3 후보로 rl-trading 커버 진입

### 4) 사용자 연구 연결 강도

- **P1 ProTran-TFA** (paused, finance venue 가능): 본 논문은 signal generation 이후 단계인 policy execution 을 다룸 → ProTran 의 확률적 예측 분포 출력 → 본 논문의 discrete/continuous action space 로 mapping 하는 **확률예측→실행 파이프라인** 확장 substrate 로 직접 편입 가능
- **AETHER** (shelved crypto): 본 논문의 3-알고리즘 비교 프레임 (DQN/PG/A2C) 은 crypto RL agent 설계 첫 정거장
- **APF motif dynamics** (main track): 본 논문의 LSTM 백본은 attention 없는 baseline (mech-interp 관점 counter-factual) 로 위치. 만약 후속작 Momentum Transformer (arXiv:2112.08534) 로 확장하면 attention 도입 lineage 진입 가능

### 5) 저자 계보 자연 연결

DeepLOB (2018, 2026-05-29 커버) 은 LOB-level micro-signal 을 CNN+LSTM 으로 학습. 본 논문 (2019/2020) 은 daily-level futures 로 시간축을 확장하고 target = **직접적 트레이딩 액션** 으로 이동. 같은 저자팀의 "micro → macro, signal → policy" 진화 축을 관찰 가능. 사용자 저자 반복 규칙 (한 저자 한 달 1회) 검토: DeepLOB 커버 2026-05-29, 오늘 2026-07-03 → 35 일 경과, 규칙 준수.

### 6) 최근성

2019 년 11 월 arXiv 최초 공개, 2020 년 3 월 JFDS 게재. 6 년차이나 **RL for trading 계보의 baseline 표준** (이후 Momentum Transformer, FinRL 계열 모두 이 정식화를 인용) 으로 최근성 열위를 계보적 중요성이 상쇄.

### 7) 재현 가능성

저자 공식 GitHub repo 미공개로 확인. 데이터도 유료 상용 (Pinnacle 계열) 추정 → 재현 부담 큼. 이 부분은 07_limits.md 에서 반박점으로 별도 처리.

## 요약

**Tier 3 venue** + **rl-trading 원거리 미커버 태그 0-count 우선** + **사용자 AETHER/ProTran-TFA 직접 substrate** + **DeepLOB 저자팀 자연 lineage** + **DQN/PG/A2C 3-알고리즘 비교 프레임 표준** → 오늘 금요일 원거리 슬롯의 첫 rl-trading 정거장으로 선정.
