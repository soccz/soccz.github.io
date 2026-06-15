# 03 · 문제 지형도

## 배경 사다리
이 절을 이해하려면 ① **attention head** 가 트랜스포머의 한 층 안에 여러 개 (GPT-2 small 은 12 개) 들어 있는 병렬 "비교 장치" 라는 점, ② 그 장치들이 layer 를 쌓아가며 **잔여 스트림 (residual stream)** 이라는 공용 통신 채널에 정보를 더해 넣는다는 점, ③ **logit** 이 LLM 의 다음-토큰 확률 분포를 만들어내는 직전의 점수라는 점만 알면 된다.

---

## 3.1 실제로 어떻게 생기는 문제

세 가지 일상 장면.

**장면 1 — 콜센터 자동응답.** "어제 박지훈 씨와 김민지 씨가 통화하셨는데, 박지훈 씨가 김민지 씨에게 전달한 서류는…" 이라는 문장을 받아쓴 음성 모델이 다음에 무엇이 나올지 예측해야 한다. 정답을 맞히려면 "박지훈 vs 김민지" 중 **이미 두 번 등장한 박지훈은 동사의 주체** 였고, **한 번만 등장한 김민지가 동사의 수신자** 임을 추론해야 한다. 이게 IOI.

**장면 2 — LLM 디버깅.** GPT-3 가 어떤 문장 앞에서 갑자기 잘못된 이름을 출력한다. 어떤 component 가 어디서 잘못된 신호를 보냈는지 모르면 패치가 불가능하다. 만약 "이 작업은 6 클래스 26 head 회로가 담당" 이라는 지도가 있다면, 그 26 개만 들여다보면 된다.

**장면 3 — 안전성 평가.** "이 모델은 인종이나 성별에 따라 차별적 token 을 출력할 회로를 가지고 있는가?" 라는 질문에 답하려면, 모델 안에서 "차별을 수행하는 부품 집합" 이 무엇인지 회로 수준으로 식별할 수 있어야 한다. IOI 의 방법론은 이 질문의 일반 절차다.

세 장면 모두 공통적으로 **"네트워크 안의 한 작업 → 그 작업을 수행하는 부품 집합"** 의 매핑이 필요하다. 그런데 그 매핑을 어떻게 정의하고, 어떻게 검증할 것인가?

---

## 3.2 기존 접근 계보 (연대순 6 이정표)

### (a) Probing — "특정 정보가 어디 있는지 분류기로 맞춰보자" (Alain & Bengio 2016 이후 다수)
무엇이었나: 트랜스포머 중간 활성을 입력으로 받아 작은 linear classifier 로 "이 위치에 명사 정보가 있는가?" 를 예측. 분류기가 잘 맞히면 그 정보가 거기 "있다" 고 해석.

왜 부족했나: probing 은 **상관 관계** 만 본다. 정보가 거기 있다 ≠ 모델이 그 정보를 실제로 사용한다. Linear probe 가 90% 맞춰도 그 표현이 회로의 일부인지는 모른다 (Hewitt & Liang 2019 의 control task 논쟁).

남긴 교훈: 표현 발견에는 **인과 개입 (causal intervention)** 이 필수. 본 논문이 path patching 으로 메우는 정확한 지점.

### (b) Attention pattern 시각화 — "그림을 보고 해석해보자" (Vig 2019, Clark 2019)
무엇이었나: BERT 의 12 layer × 12 head 의 attention weight 를 heatmap 으로 시각화. "이 head 는 syntactic dependency 를 보고 있다", "저 head 는 [SEP] 에 집중한다" 식 해석.

왜 부족했나: ① attention 의 가중치가 크다고 정보가 그쪽으로 흐른다는 보장이 없다 (Jain-Wallace 2019, 2026-05-18 cover 의 핵심 발견). ② 144 개 head 의 heatmap 144 장 만으로는 회로의 **인과 의존 그래프** 를 알 수 없다.

남긴 교훈: 시각화 → 정성 해석 만으로 회로 주장은 안 된다. **운영적 정의 + 검증** 이 필요.

### (c) Mathematical Framework (Elhage 2021 Anthropic)
무엇이었나: attention-only transformer 의 forward 를 "QK circuit" (어디를 볼지) + "OV circuit" (무엇을 옮길지) 의 곱으로 분해. residual stream 을 communication channel 로 정의.

왜 부족했나: 이론 framework 만 제시. 실제 모델에서 회로를 **그려내지는** 못함. 어떤 작업의 회로가 무엇인지 보여준 적은 없다 (논문은 induction head 라는 일반 메커니즘만 제시).

남긴 교훈: 회로 분석의 **수학적 어휘** (QK/OV, residual stream, virtual attention head) 는 이 framework. IOI 는 이 어휘로 GPT-2 small 의 **구체 회로** 를 그린다.

### (d) Induction Heads (Olsson 2022 Anthropic)
무엇이었나: "A B ... A → B" 패턴 (직전 등장 시퀀스의 다음 토큰 복사) 을 수행하는 head 를 in-context learning 의 주요 메커니즘으로 식별. 두 layer 의 협업 (previous-token head + induction head) 으로 작동.

왜 부족했나: 발견된 회로가 **단순** (2-layer composition) 하고 **합성 시퀀스** 기반. 자연어의 더 복잡한 작업이 같은 방식으로 분해 가능한지는 미증명.

남긴 교훈: 회로는 **재사용 가능한 부품** 이다 — IOI 회로의 **induction class (5 layer 의 4 head)** 가 실제로 이 induction head 의 자손임을 본 논문이 확인. 부품의 합성 가능성.

### (e) ROME / activation patching (Meng & Bau 2022, Geiger 2021)
무엇이었나: factual recall 작업 ("The Eiffel Tower is in __") 에서 특정 layer 의 MLP 활성을 다른 prompt 의 활성으로 patch → MLP 가 factual association 의 **저장소** 임을 인과적으로 보임.

왜 부족했나: ① MLP 위주, attention head 의 세분화 부족. ② 단일 노드 patch 만 사용 — **path** (sender → 특정 receiver 만의 경로) 까지 분리하지 못함. ③ "factual recall" 이라는 한 작업.

남긴 교훈: **인과 개입 = 회로 발견의 정답** 이라는 메타. 본 논문은 이를 **path-level** 로 격상시키고 (다음 절 참조) attention head 회로에 적용한 첫 large case.

### (f) Modular addition circuit (Nanda 2023)
무엇이었나: $a + b \mod p$ 를 학습한 1-layer transformer 안에서 Fourier-feature 기반 회로를 발견. progress measure 정의.

왜 부족했나: **toy 합성 작업** + **1-layer**. 자연어·다층 LLM 으로의 확장성 미증명.

남긴 교훈: progress measure 라는 **정량 검증** 의 필요성. 본 논문의 faithfulness/completeness/minimality 와 정확히 같은 메타.

---

## 3.3 공통 gap (한 문장)

**"자연어 작업을 수행하는 다층 LLM 안에서, 어떤 attention head 집합이 그 작업의 회로인지 정의하고, 그 회로가 진짜인지 반증 가능한 절차로 검증하는 방법 — 이 없다."**

(a)·(b) 는 상관·시각화에 머물고, (c) 는 이론, (d) 는 toy composition, (e) 는 MLP·단일 작업, (f) 는 toy. IOI 처럼 **자연어 + 다층 + 다부품 회로 + 3-축 검증** 의 4 박자가 동시에 필요한 case 를 푼 적이 없다.

---

## 3.4 이 논문이 gap 을 메우는 방식

① **운영적 회로 정의** — "이 작업의 회로는 다음 26 개 attention head + 그 사이의 정해진 정보 경로" 로 객체화. 이를 위해 ② **path patching** 이라는 finer-grained intervention 으로 attention head 사이의 sender-receiver 의존을 측정해 head 를 추려내고, ③ 추려진 회로의 검증을 **3 축** (faithfulness / completeness / minimality) 으로 수행해 "이 회로가 충분 (sufficient) · 필요 (necessary) · 닫혀 (closed) 있다" 는 세 속성을 동시에 주장한다. ④ 그렇게 그려진 회로는 **6 (또는 7) 기능 클래스** 의 **계층적 정보 흐름** 으로 해석된다 — 부품 재사용 + 합성의 자연어 LLM 사례.

이 4 단계가 본 논문의 메타 메시지다: **"회로 = 운영적 정의 × 인과 개입 × 3-축 검증 × 합성 해석"**. ACDC 가 ①·② 를 자동화하고, SFC 가 단위를 attention head → SAE feature 로 확장한다. 본 논문은 그 manual prototype.
