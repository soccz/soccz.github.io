# 9. 사고 확장 (B) — Follow-up 논문 3편

> **식별자 신뢰도 표기 규칙**: 아래에서 canonical identifier를 단정하는 것은 본 해체 과정에서 원문 또는 `_index.md`에서 직접 확인한 것만이다. 본 논문의 참고문헌 목록에 저자·연도만 확인되고 정확한 서지를 별도 검증하지 않은 항목은 **⚠️ 식별자 미검증**으로 표시한다 — 읽기 전에 canonical source를 먼저 확인해야 한다(§4 Source Lock 정신).

---

## 선행 1 — Lo, Mamaysky, Wang (2000): "Foundations of Technical Analysis"

**⚠️ 식별자 미검증** — 본 논문이 저자·연도로 반복 인용하며(제사 인용 + §서론 p.3197 + §IV.C p.3230) *Journal of Finance* 게재 논문으로 다루지만, 정확한 권·호·페이지·DOI는 본 해체 과정에서 별도 확인하지 않았다.

**어떤 논문인가**: 커널 회귀(kernel regression)로 가격 시계열을 평활한 뒤, 그 위에서 국소 극값(peak·trough)의 배열 조건으로 "머리와 어깨", "쌍바닥" 등 기술적 패턴을 **알고리즘적으로 식별**하고 통계적 추론을 붙인 논문이다. 사람의 눈 대신 명시적 정의를 준 최초의 본격적 시도다.

**본 논문과의 관계 — 의제의 직계 부모이자, §IV.C의 반박 대상**: 본 논문은 자신을 "a continuation of the agenda set forth by Lo, Mamaysky, and Wang (2000), but with a retooled research design benefitting from 20 years of progress in machine learning and computer vision"(p.3197)이라고 규정한다. 그러면서 **LMW가 탐지 대상으로 삼았던 그 패턴들을 §IV.C에서 반박한다** — 교과서 23개 패턴 중 유의한 13개에서 8개가 민간지식과 역방향. 즉 부모의 의제는 계승하고 부모가 다룬 대상의 타당성은 부정하는 관계다.

**무엇을 얻을 수 있는가**: ① **명시적 패턴 정의의 기술**을 배운다 — 본 논문의 §IV.C 시뮬레이션이 어떤 사양 선택 위에 서 있는지 판정하려면 LMW의 정의 방식을 알아야 한다([07_limits.md](07_limits.md) 반박 4). ② **"패턴을 정의해서 검정하기"와 "패턴을 학습하기"의 방법론적 대비**를 원전에서 직접 본다. ③ 제사로 인용된 "(yet)" 문장의 원맥락 — 왜 2000년에는 컴퓨터가 패턴 인식에서 사람을 못 이겼다고 봤는가.

---

## 경쟁 1 — Liu, Zhou, Zhu (2020): 유전 프로그래밍 + 국제 직접 전이

**⚠️ 식별자 미검증** — 본 논문 §V.A 각주 15(p.3233)가 **concurrent work로 명시**한다: "The direct-transfer approach similar to what we propose here is rare, with the exception of a concurrent paper by Liu, Zhou, and Zhu (2020), which applies their genetic programming model trained with U.S. data directly to G7 international markets." 정확한 제목·게재처·식별자는 본 해체 과정에서 확인하지 않았으므로, **읽기 전 canonical source 확인이 필수**다.

**어떤 논문인가 (원문이 밝힌 범위)**: 유전 프로그래밍(genetic programming — 수식 트리를 진화 알고리즘으로 탐색해 신호를 자동 생성하는 기법)으로 미국 데이터에서 예측 신호를 발견하고, 그 모델을 **재학습 없이 G7 국제 시장에 직접 적용**한다.

**본 논문과의 관계 — 같은 두 목표, 다른 발견 엔진**: 두 논문 모두 (i) 사람이 신호를 사전정의하지 않고 자동 발견하며, (ii) 미국 학습 → 국제 직접 전이를 시도한다. 차이는 발견 엔진이다 — 유전 프로그래밍은 **명시적 수식 트리**를 산출하고, CNN은 **분산된 가중치**를 산출한다. 원문은 성능을 직접 비교하지 않고 존재만 인정한다(즉 **누가 이겼는지는 판정되지 않았다**).

**무엇을 얻을 수 있는가**: ① **해석 가능성의 정반대 극단**을 본다. 본 논문은 §IV 전체를 해석에 쓰고도 로지스틱 근사로 변동의 22~35%만 설명했다(Table VIII). 유전 프로그래밍은 결과물이 읽을 수 있는 수식이므로 이 문제가 없다 — 대신 표현력이 제한된다. **"자동 발견"과 "해석 가능성"의 교환율을 두 논문의 대비로 측정할 수 있다.** ② 국제 직접 전이가 **엔진에 무관하게** 작동하는지 확인 — 두 논문이 모두 성공했다면 전이 이득이 CNN 특유가 아니라 "미국 데이터의 정보량 우위" 때문이라는 해석이 강해진다(이는 본 논문 Figure 9의 발견과 정합). ③ `_coverage.md`의 원거리(§F) 버킷 후속 커버 후보로 기록할 가치가 있다.

---

## 후속 1 — Kalnāre, Kitharidis, Bäck, van Stein (2025): "Mechanistic Interpretability for Transformer-based Time Series Classification"

**식별자: arXiv:2511.21514** — `_index.md` priority 목록("Tier 2 — Mech interp methodology", 태그 `tsfm-interp / mech-interp-circuits`)에서 확인. `_profile.md`는 이 논문을 APF의 **concurrent work 2개 중 하나**로 기록한다. **미커버 상태.**

**본 논문의 계보상 직계 후손은 아님을 먼저 명시한다** — 인용 관계가 아니고, 금융 저널과 ML 문헌은 분리되어 있다. 그러나 **JKX가 남긴 가장 큰 공백을 정확히 채우는 다음 읽을 논문**이라는 의미에서 후속으로 배치한다.

**어떤 관계인가**: [06_experiments_b](06_experiments_b_interpret_transfer.md)에서 확인했듯 본 논문 §IV의 해석은 **전부 행동적 프로빙**(입출력 상관 + 로지스틱 근사)이고, mechanistic 도구 — 필터 시각화, saliency, 활성화 최대화, 채널 절제, 회로 발견 — 를 **하나도 쓰지 않았다.** 아이러니하게도 채널 증식 논거로 Zeiler·Fergus(2014), 즉 CNN 필터 시각화의 원전을 인용하면서(p.3247) 그 기법은 쓰지 않는다. 본 논문이 도달한 최선은 "사람이 읽을 규칙 하나($\tfrac{1}{2}(\text{High}+\text{Low})-\text{Close}$) + 나머지 65% 이상은 비선형"이라는 잔차 진술이다.

**무엇을 얻을 수 있는가**: ① **시계열 도메인에서 mechanistic 도구를 실제로 어떻게 적용하는가**의 최신 사례 — 본 논문이 안 한 것의 구체적 실행 방법. ② `_profile.md` 기준 APF의 concurrent work이므로 **차별화 지점 확보에 직접 필요**하다 — 무엇을 이미 했고 무엇이 남았는지 확인하지 않으면 APF의 novelty 주장이 위험하다. ③ 본 논문과 대비하면 **"이미지+CNN 계열"과 "Transformer+circuit 계열"의 해석 방법론 격차**를 한눈에 볼 수 있고, 그 격차가 곧 APF의 포지션이다.

**우선순위 제안**: `_index.md` priority 목록의 미커버 항목 중 사용자 두 active track(APF·Grokking) 모두에 걸치고 concurrent work로 명시된 유일한 항목이다. 코어 버킷(월요일, §B mech-interp-circuits) 차기 최우선 후보로 기록한다.

---

## 세 편의 읽기 순서 제안

```
① Kalnāre 2025 (arXiv:2511.21514)   ← 지금 가장 급함
   이유: APF concurrent work + JKX의 mechanistic 공백을 채움
   → 프로필 기준 APF의 "motif causality 실험 진행 중" 단계에 즉시 영향
              │
              ▼
② Lo·Mamaysky·Wang 2000              ← 그 다음
   이유: JKX §IV.C(교과서 패턴 8/13 역방향)의 신뢰도를 판정하려면
        패턴 정의 방식의 원전이 필요
              │
              ▼
③ Liu·Zhou·Zhu 2020                  ← 여유 있을 때
   이유: 해석가능성 교환율의 대조군. 원거리 버킷 후속 커버로 미뤄도 무방
```

**①의 근거를 한 줄 더**: `_profile.md`가 APF 상태를 "TMAO method falsified at n=12, motif causality 실험 진행 중"으로 기록한다. motif causality 실험을 설계하는 시점에 concurrent work가 이미 무엇을 했는지 모르는 것은 가장 비싼 종류의 무지다 — 실험을 다 돌린 뒤에 중복을 발견하면 그 자원이 전부 매몰비용이 된다.
