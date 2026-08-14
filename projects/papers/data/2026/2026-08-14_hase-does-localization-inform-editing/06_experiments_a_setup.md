# 5. 실험 해부 (1) — 데이터·모델·베이스라인의 공정성

> **배경 사다리**: ① **CounterFact**는 "(주어, 관계, 정답, 거짓답)" 네 쌍으로 이뤄진 사실 편집 벤치마크다. ② **ZSRE**는 관계 추출을 질의응답 형태로 바꾼 데이터셋으로, 편집 연구의 두 번째 표준이다. ③ 이 논문에서 "베이스라인"은 경쟁 모델이 아니라 **비교되는 편집기 4종**과 **회귀 모형 3종**을 뜻한다.

---

## 5.1 데이터셋 — CounterFact

**어떤 데이터인가.** Figure 3 캡션이 그대로 알려준다: *"An example CounterFact datapoint."* 각 데이터포인트는 주어($s$), 관계($r$), 정답 객체($o_{true}$), 그리고 심어 넣을 거짓 객체($o_{false}$)로 구성되고, 여기에 패러프레이즈 프롬프트와 이웃 주어 집합이 딸려 온다. §4.11~4.13에서 본 세 지표가 정확히 이 구조를 소비한다.

**왜 이 데이터가 이 논문의 주장에 적합한가.** 세 가지 이유가 있다.
1. **ROME 논문이 쓴 바로 그 데이터**다. 반증 논문은 반증 대상과 **같은 무대**에서 싸워야 한다. 다른 데이터를 썼다면 "데이터가 달라서 그렇다"는 탈출로가 생긴다.
2. **Causal Tracing이 요구하는 구조를 갖췄다.** 주어가 명시적으로 분리돼 있어야 주어 토큰에만 잡음을 넣을 수 있다.
3. **모델이 원래 맞히는 사실만 필터링**해 $n=652$를 만든 것이 중요하다. 모델이 모르는 사실은 "저장 위치"라는 개념 자체가 성립하지 않으므로, 이 필터가 없으면 tracing effect가 잡음이 된다.

**숨은 편향은 없는가.** 세 가지를 지적할 수 있다.
- **사실의 형태가 극도로 단순하다.** 저자들도 §8에서 인정한다: *"This is a basic form of factual knowledge, and localization and editing analysis may yield different trends for other forms of knowledge."* 다단계 추론이 필요한 지식, 절차적 지식, 수치 지식에는 결론이 전이되지 않을 수 있다.
- **주어가 고유명사에 치우쳐 있다.** 고유명사는 토큰 임베딩 단계에서부터 강한 신호를 갖기 때문에, 주어 임베딩에 잡음을 넣는 손상 방식이 특히 잘 먹는다. 일반명사 주어에서는 tracing effect의 분포 자체가 달라질 수 있다.
- **영어 단일 언어.** §8이 명시하는 제약이다.

## 5.2 데이터셋 — ZSRE (보조)

부록 결과 verbatim: *"We find that results with ZSRE match our conclusions with CounterFact, as the results are quite similar to plots and regressions with CounterFact data. Tracing effects are not predictive of edit success."*

**왜 필요한가**: CounterFact가 ROME 논문의 홈그라운드라는 점은 장점이자 위험이다 — 그 데이터에만 있는 특이성이 결론을 만들었을 수 있다. ZSRE는 다른 출처·다른 형식의 사실 데이터이므로 **데이터 특이성 반박을 차단**한다. 결론이 재현됐다는 것은 이 논문의 강건성 자산이다.

**다만 주의**: 부록 서술은 "quite similar"라는 질적 표현이며, 본문처럼 $R^2$ 표로 대조되지는 않는다(본 실행에서 확인한 범위 내에서). **정확한 ZSRE 수치는 원문 부록 표를 직접 봐야 하며, 여기서는 수치를 옮기지 않는다.**

## 5.3 모델 — GPT-J와 GPT2-XL

**GPT-J (6B)**: 주 실험 모델. §4.2 verbatim *"GPT-J is a 6 billion parameter autoregressive language model."* 편집 층 스윕이 28까지 가는 것으로 보아 28층 구조를 전제한다.

**GPT2-XL (48층)**: 보조 확인용. 부록 결과 verbatim: *"Like with GPT-J, tracing effects are very weakly predictive of edit success across editing problem variants for GPT2-XL while Fact Forcing shows the largest relationship."*

**왜 이 두 모델인가.** §8이 답한다: *"We work with two autoregressive Transformers chosen for their representativeness of large language models that show a capacity for expressing factual knowledge in response to natural language prompts."* 즉 "사실 지식을 프롬프트로 표현할 수 있는 최소 규모" 기준이다.

**숨은 편향.** 두 모델 모두 **ROME/MEMIT이 원래 검증된 모델**이다. 반증의 공정성 측면에서는 옳은 선택이지만, 규모 일반화 측면에서는 §8이 스스로 경고한다: *"the conclusions from our analysis may not generalize to models larger than GPT-J (6B parameters) that are known to exhibit phase changes in their behavior under prompting."* **70B급 이상에서 국소화-편집 관계가 되살아날 가능성은 이 논문이 배제하지 못한다.** (개인적으로 이것이 이 논문의 가장 실질적인 미결 지점이라고 본다 — grokking 문헌이 보여주듯 상전이는 규모·학습량에서 갑자기 나타난다.)

## 5.4 베이스라인 공정성 — 편집기 4종은 동등하게 튜닝됐는가

이 논문에서 "공정성"은 두 겹이다.

**겹 1: 편집기 간 공정성.** ROME(1층) ↔ MEMIT(5층), FT(1층) ↔ FT(5층)로 **개입 폭을 짝지어** 놓았다. 이는 "한 층만 건드려서 신호가 안 보였다"는 반박을 차단한다. 다만 각 편집기의 **하이퍼파라미터 탐색 강도**가 동등했는지는 본문에서 확인되지 않고 Appendix A(Experiment Details)로 위임된다. 편집기마다 최적 설정이 다를 수 있으므로, **편집 성능의 절대 수준 비교는 신중해야 한다.** 다행히 이 논문의 결론은 절대 성능이 아니라 **증분 $R^2$**에 의존하므로 이 취약점의 영향은 제한적이다.

**겹 2: 두 측정 사이의 공정성.** 이게 더 중요하다. 저자들은 국소화 쪽에 **의도적으로 유리한 조건**을 여러 개 줬다:
- tracing window를 관행값 10이 아니라 **5**로 줄여 층 해상도를 높였다.
- 교호작용 항($\gamma_\ell$)을 넣어 "층마다 tracing의 의미가 다르다"는 가장 관대한 모형을 허용했다.
- tracing effect가 가장 집중된 **상위 10% 부분표본**을 따로 분석했다(Table 2).
- 문제 정의 자체를 tracing 쪽으로 정렬한 변종을 **네 개** 만들었다.

**이렇게 유리하게 깔아 주고도 .001이 나왔다는 것**이 이 논문의 설득력의 원천이다. 반증 논문의 교과서적 설계다.

## 5.5 지표 선택 — 왜 $R^2$인가

**왜 $R^2$였나.** 이 논문이 답하려는 건 "관계가 있느냐"가 아니라 "**실무적으로 쓸 만한 관계냐**"이다. $n$이 수천이므로 $p$-값은 거의 모든 것에서 유의하게 나온다(실제로 Table 3의 대부분 행이 $p \ll 10^{-4}$). 따라서 **효과 크기**로 판정해야 하고, 증분 $R^2$가 그 역할을 한다.

**다른 지표였다면 결론이 바뀌었을까.**
- **상관계수만 봤다면**: 6층에서 $\rho=-0.13$이라는 인상적 숫자는 얻지만, 층 통제가 없어 "층 때문 아니냐"는 반박에 무너진다.
- **AUC·순위 지표였다면**: "tracing effect 상위 $k$개 층 중에 최적 편집 층이 들어 있는가"를 물을 수 있다. **실무 의사결정에 더 직결되는 지표**이며, 이 논문이 하지 않은 아쉬운 대안이다. 다만 방향이 바뀌진 않았을 것이다 — 6층 상관이 음수라는 사실이 순위 지표에서도 나쁘게 나올 것을 시사한다.
- **베이즈 요인이었다면**: "관계 없음" 가설을 **적극적으로 지지**할 수 있다. $R^2$ 접근은 엄밀히는 "관계를 못 찾았다"이지 "관계가 없다"의 증명이 아니다. 이 논문의 논증에서 가장 형식적으로 약한 고리다.

## 5.6 이 절의 핵심 한 문장

> **저자들은 반증 대상의 홈그라운드(CounterFact·GPT-J·ROME)에서, 국소화 쪽에 유리한 조건을 여러 겹 얹어 놓고 싸워서 이겼다 — 그래서 "설정 탓"이라는 반론이 성립하지 않는다.**
