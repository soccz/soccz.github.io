# 05a · 방법론: 큰 그림 (Intuition)

## 배경 사다리
이 절은 본 논문 방법론 전체의 **메타 흐름** 만 그린다. 수식 없이 4-step 의 다이어그램 지문. 다음 b/c/d/e 파일이 각 step 의 수학을 다룬다. ① **잔여 스트림 (residual stream)** = 각 토큰 위치에서 layer 를 거치며 더해지는 hidden state 라는 점, ② **attention head** = layer 안의 병렬 비교 장치 라는 점만 알면 된다.

---

## 0. 비유로 본 큰 그림

GPT-2 small 을 **12 층짜리 우편 분류 센터** 라고 상상하자.
- 각 층에는 **12 명의 우편 분류 직원 (attention head)** 이 있다.
- 모든 직원은 **공용 컨베이어 벨트 (residual stream)** 에 우편물을 더 올려놓는다. 빼는 일은 없다.
- 마지막 층의 컨베이어가 출력 (logit) 으로 변환된다.

저자가 풀고 싶은 문제: "John gave a bottle to ___" 이라는 우편 (prompt) 이 들어왔을 때, "Mary 라는 답" 이 컨베이어에 더해지는 데 기여한 144 명의 직원 중 누가 진짜 일했나?

답을 찾는 4 단계:

### Step 1 — 작업 정의 + 데이터 만들기
"Mary 와 John 중 누가 정답인가" 가 명확히 풀리는 프롬프트만 1000+ 개 만든다 (절차적 생성).
→ §05b (task & dataset).

### Step 2 — 각 직원의 우편 가로채기 실험 (Path patching)
"이 직원 (sender head) 의 출력만 다른 우편 (corrupted prompt) 의 같은 직원 출력으로 바꿔치기 했을 때, 끝쪽 직원 (receiver head) 의 행동이 어떻게 변하나?" 를 144 × 144 모든 쌍에 대해 측정.
→ §05c (path patching).

### Step 3 — 의존성이 큰 직원만 골라 회로 그리기
바꿔치기에 민감한 직원 26 명을 추리고, sender → receiver 의존을 따라 **6 개 부서로 그룹핑** + **계층 흐름 그래프** 작성.
→ §05d (circuit extraction & head classes).

### Step 4 — 그 26 명이 진짜 회로인지 3 축으로 검증
Faithfulness: 26 명만 일 시켜도 결과가 같나? · Completeness: 26 명에서 또 몇 명 빼는 게 전체 모델에서 그들 빼는 것과 같나? · Minimality: 26 명 중 누구 하나만 빠져도 망가지나?
→ §05e (3-axis metrics).

---

## 1. 왜 이 4 단계 순서인가

기존 방법들의 실패 패턴을 거꾸로 보면 이 순서가 강제된다.

- **Probing 만 하면 (1+2 생략)**: 정보가 어디 있는지는 알지만 "쓰이는지" 모름. → 인과 개입 필수 (Step 2).
- **단일 activation patching 만 하면 (path 분리 없음)**: 어떤 head 가 다른 head 를 통해 (간접) vs 직접 영향을 주는지 분리 불가. → path 단위 개입 필수 (Step 2 의 path patching).
- **회로를 그렸지만 검증 없음 (Step 4 생략)**: 사후 합리화 risk. "이 head 가 이런 일을 한다" 는 명명이 객관적 근거 없이 떠다님. → 3-축 메트릭 필수.

본 논문의 contribution 은 **각 step 의 발명** 이 아니라 **4 step 을 한 자연어 작업에 정확히 결합** 했다는 것. 각 component (path patching = Goldowsky-Dill 2023, activation patching = Geiger 2021, head 분류 = Olsson 2022) 는 기존 도구지만, 자연어 LLM 의 한 작업을 end-to-end 로 reverse-engineer 한 첫 사례.

---

## 2. 4-step 의 핵심 한 문장 요약

> **"작업을 명확히 정의 → path 단위 인과 개입으로 의존성 측정 → 의존성 그래프에서 회로 추출 → 3-축으로 그 회로가 sufficient·closed·necessary 임을 검증"**

이 한 문장이 본 논문 방법론의 모든 것. 이후 b/c/d/e 파일은 각 step 의 **수학적 디테일과 대안 비교** 다.
