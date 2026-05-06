# 08. 이론적 계보

> **배경 사다리**: 이 섹션은 Chronos가 어떤 선행 작업을 계승하고, 어떤 동시대 연구와 경쟁하며, 어떤 후속 연구로 이어지는지를 계보도로 추적한다.

---

## 이론적 조상 1: T5 — Text-to-Text Transfer Transformer (Raffel et al., 2020)

**어떤 논문**: Google이 제안한 대규모 사전학습 언어모델. 모든 NLP 태스크를 "텍스트 → 텍스트" 형식으로 통일해 하나의 모델로 처리한다. 이 논문이 "모든 문제를 토큰 시퀀스로 환원하는" 패러다임을 정착시켰다.

**Chronos와의 직접 연결선**: Chronos는 T5의 아이디어("임의 입출력을 토큰 시퀀스로 통일")를 시계열에 적용한다. 아키텍처 코드도 HuggingFace의 T5 구현을 그대로 사용한다. 다만 어휘(수치 bin)와 사전학습 데이터(TS)가 완전히 다르다.

### 조상 2: DeepAR (Salinas et al., Amazon, 2020)

**어떤 논문**: Amazon이 내부적으로 개발한 LSTM 기반 전역 확률 예측 모델. 여러 시계열을 하나의 모델로 학습하고, Gaussian/Negative Binomial 분포로 예측 분포를 출력한다. 전자상거래 수요 예측에 실제 배포된 논문.

**Chronos와의 직접 연결선**: Chronos는 DeepAR의 후계자다 — 같은 Amazon 팀의 작업으로, "전역 확률 예측 모델"이라는 아이디어를 파운데이션 모델 스케일로 확장한다. DeepAR의 한계(새 데이터셋에 재학습 필요, 분포 가정의 제약)를 Chronos가 해결하려 한다.

### 조상 3: Automatic Statistician / Duvenaud GP 커널 (2013, NIPS)

**어떤 연구**: David Duvenaud(현 Toronto/Vector Institute) 등이 제안한 "자동 GP 구조 탐색". 데이터를 보고 어떤 커널 조합이 가장 잘 설명하는지 자동으로 찾는다.

**Chronos와의 직접 연결선**: KernelSynth는 이 아이디어의 **역방향 적용**이다. Duvenaud의 작업이 "데이터 → 커널 구조 탐색"이었다면, KernelSynth는 "무작위 커널 조합 → 데이터 생성". 저자들이 논문에서 직접 "Automatic Statistician의 역방향"이라고 기술한다.

---

## 평행 연구: 동시대 TS 파운데이션 모델 경쟁

### TimeGPT-1 (Garza & Mergenthaler-Canseco, 2023, Nixtla)

**어떤 논문**: 대규모 TS 데이터로 사전학습한 Transformer 기반 파운데이션 모델. Chronos와 유사한 컨셉이지만, 값을 이산화하지 않고 연속값 예측 + 별도 확률 헤드를 사용한다. API 서비스로 배포.

**왜 Chronos가 이 영역에서 이겼나**: 모델 가중치와 학습 코드를 오픈소스로 공개했다는 점에서 학술 커뮤니티에서의 영향력이 더 크다. TimeGPT는 가중치 비공개 상업용이다.

### MOIRAI (Woo et al., Salesforce, ICML 2024)

**어떤 논문**: Multi-scale Pretrained Forecasting Transformer. 패치 기반 토크나이제이션과 다양한 주기 스케일을 함께 처리. Chronos보다 더 정교한 TS-specific 귀납적 편향을 가진다.

**어떤 영역에서 MOIRAI가 더 강한가**: 다양한 주기성을 가진 데이터(시간별, 일별, 주별을 동일 모델로 처리)에서 MOIRAI의 스케일 인식 아키텍처가 Chronos보다 유리하다. Chronos는 모든 주기를 동일하게 취급한다.

### TimesFM (Das et al., Google, ICML 2024)

**어떤 논문**: 200B 토큰의 실제 시계열 데이터로 사전학습된 디코더 전용 모델. 패치 기반 입력. Google의 내부 시계열 데이터에 접근 가능해 학습 데이터 규모가 훨씬 크다.

**어떤 영역에서 TimesFM이 강한가**: 학습 데이터 규모(200B vs 84B)와 패치 기반 입력의 국소 패턴 포착력에서 유리. 단 가중치 비공개.

---

## 후손 예측

### 실제 나온 후속: Chronos-2 (arXiv:2510.15821, 2025)

Chronos의 한계였던 단변량 제약을 깬 후속작. 인코더는 Chronos와 동일하지만, 그룹 어텐션(group attention)을 추가해 여러 관련 시계열 간의 정보를 공유한다. 다변량 + 공변량(covariate) 지원.

### 예측 2: TS 파운데이션 모델의 메커니즘 해석 연구

Chronos 수준의 사전학습 모델이 TS에서 어떤 내부 표현을 형성하는지는 거의 연구되지 않았다. "어떤 패턴을 인코더가 학습하는가?", "디코더는 어떤 위치를 가장 강하게 어텐딩하는가?" — APF 프레임워크가 이 질문에 직접 답할 수 있다 (→ 섹션 09 참조).

### 예측 3: 금융 특화 파운데이션 TS 모델

이미 "Kronos" (arXiv:2508.02739, 2025) 형태로 등장했다. 금융 시계열의 heavy-tail·변동성 클러스터링을 처리하기 위한 토크나이제이션 수정 (log-return 기반 bin), 금융 데이터 특화 학습이 방향이다.
