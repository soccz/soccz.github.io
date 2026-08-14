# 3. 핵심 Claim 해체 (1) — 편집 성공은 저장 위치와 무관하다

> **배경 사다리**: 이 절은 **$R^2$(결정계수)** 하나만 알면 읽을 수 있다. $R^2$는 "내가 세운 예측식이 결과의 들쭉날쭉함(분산) 중 몇 퍼센트를 설명하는가"를 0~1로 나타낸 값이다. $R^2 = 0.95$면 95%를 설명한 것이고, $0.02$면 2%밖에 설명 못 한 것이다. 이 논문의 주장 전체가 **$R^2$의 뺄셈**으로 표현된다.

---

## Claim 1

### 주장 (한 문장)

**Causal Tracing이 재는 "사실이 그 층에 저장된 정도"(tracing effect)는 그 층을 편집했을 때의 성공도를 사실상 전혀 예측하지 못하며, 예측하는 것은 오직 "어느 층을 편집했는가"이다.**

### 증거 (원문 위치)

**§4.3 Experiment Results + Table 1.** Table 1 캡션 verbatim: *"R² values for predicting ROME edit success. Tracing effects explain essentially none of the variance in rewrite score, while the choice of edit layer is very important."*

Table 1의 ROME 행 (verbatim 수치):

| 예측 변수 | Layer | Tracing Effect | Both |
|---|---|---|---|
| $R^2$ (rewrite score 예측) | **.947** | **.016** | **.948** |

읽는 법: 편집 층만으로 rewrite score 분산의 **94.7%**를 설명한다. tracing effect만으로는 **1.6%**. 둘 다 넣으면 **94.8%** — 즉 층을 이미 알고 있을 때 **tracing effect가 추가로 주는 정보는 0.1%p**다.

§4.3 본문은 여기에 더 아픈 사실을 붙인다. verbatim: *"The correlation between ROME edit success and the tracing effect at layer 6 in GPT-J is not positive but in fact slightly negative (ρ=−0.13; p<1×10⁻³)."*

**6층**은 ROME이 기본으로 편집하는 층, 즉 ROME 서사의 심장부다. 그 층에서조차 상관은 양수가 아니라 **약한 음수**다. "여기에 더 강하게 저장돼 있는 사실일수록 편집이 더 잘된다"가 아니라, 굳이 말하면 **살짝 반대**다.

### 강건성 — 반박을 미리 차단한 설계

이 결과에 대한 가장 자연스러운 방어는 이것이다: *"tracing effect가 여러 층에 넓게 퍼져 있어서 층별 신호가 흐릿한 것 아닌가? 정말로 한두 층에 몰려 있는 사실만 보면 관계가 보일 것이다."*

저자들은 이 방어를 **Table 2**로 미리 막는다. 캡션 verbatim: *"R² values for predicting ROME edit success in Error Injection, subsetted to 10% of the data that has the most concentrated tracing effects in a small number of layers. Even when facts appear to be stored at a small number of layers and not other layers, tracing effects are still not predictive of editing performance."*

| 부분표본 (집중도 상위 10%) | Layer | Tracing Effect | Both |
|---|---|---|---|
| $R^2$ | **.927** | **.02** | **.929** |

추가 설명분산은 여전히 **0.2%p**. **국소화 신호가 가장 선명한 사실들에서조차** 편집 성능 예측력이 없다.

### 숨은 전제 (저자가 당연시한 것)

1. **rewrite score가 "편집 성공"의 타당한 조작적 정의다.** rewrite score는 목표 오답 $o_{false}$의 확률이 얼마나 올라갔는지를 잰다. 만약 "편집 성공"을 다르게 정의하면(예: 파생 질문 일반화 중심) 결론이 달라질 여지가 있다 — 저자들도 이를 알기에 §3.4에서 paraphrase·neighborhood score를 함께 정의하고 Table 4~6으로 같은 분석을 반복한다.
2. **층은 "통제해야 할 교란변수"이지 "설명 대상"이 아니다.** 이 논문은 층 효과를 회귀에 넣어 통제한 뒤 남는 것을 본다. 그런데 뒤집어 보면, **왜 층이 94.7%를 설명하는가**는 이 논문이 답하지 않는 질문이다(§6에서 부분적으로만 논의).
3. **한 층씩 편집한다는 단일 개입 가정.** ROME은 한 층의 MLP down-projection을 rank-1로 고친다. "사실이 여러 층에 분산 저장돼 있어서 여러 층을 동시에 건드려야 한다면?"이라는 시나리오는 MEMIT(5층 분산 갱신)으로 부분적으로만 다뤄진다.
4. **잡음 기반 손상($\sigma = 0.094$)이 사실 회상을 공정하게 망가뜨린다.** 잡음 크기·형태가 tracing effect의 층별 분포를 바꿀 수 있다는 점은 §8에서 "특정 국소화 기법에 한정"이라는 형태로만 인정된다.

### 쉬운 말 풀이

시험지 채점을 생각하자. 학생 100명의 점수를 예측하려는데, 두 가지 정보가 있다. ⓐ **어느 반 학생인가**(1반~28반), ⓑ **그 학생 책상 서랍에 교과서가 얼마나 들어 있나**.

결과는 이렇다. 반 정보만으로 점수의 94.7%를 맞힐 수 있다. 서랍 속 교과서 양만으로는 1.6%. 반을 이미 알고 있을 때 교과서 양을 추가로 알아도 점수 예측은 **0.1%p밖에 나아지지 않는다**. 심지어 특정 반(6반)에서는 교과서가 많은 학생이 오히려 점수가 **약간 낮다**.

여기서 "서랍 속 교과서"가 tracing effect(그 층에 사실이 저장된 정도)이고, "반"이 편집한 층이다. 즉 **"어디에 지식이 쌓여 있는가"는 "그 지식을 바꿀 수 있는가"와 거의 무관했고, 결정적인 건 그냥 어느 반을 골랐느냐였다.**
