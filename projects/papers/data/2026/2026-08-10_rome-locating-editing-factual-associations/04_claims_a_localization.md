# 3-A. 핵심 Claim 해체 — 국소화

> **배경 사다리**: ① 트랜스포머의 한 층은 은닉상태에 "어텐션이 만든 기여"와 "MLP가 만든 기여"를 **더한다**(residual stream). ② 따라서 어느 기여를 지우거나 되살리는 실험이 가능하다. ③ "간접효과"란 중간 매개 변수 하나를 통해 흐르는 효과만 따로 잰 값이다.

이 파일은 §2에서 나오는 **위치에 관한 두 Claim**을 다룬다. 편집에 관한 Claim은 [04_claims_b_editing.md](04_claims_b_editing.md)로 이어진다.

---

## Claim 1 — 사실 회상의 인과적 병목은 subject 이름의 마지막 토큰, 중간 층에 있다

**주장 (한 문장).** GPT-2 XL이 사실을 회상할 때, 출력 확률에 대한 인과적 기여가 **두 곳**에 몰리는데, 하나는 예상 가능한 "예측 직전 마지막 토큰의 후반 층(late site)"이고, 다른 하나는 **아무도 예상하지 않았던 "subject 이름의 마지막 토큰의 중간 층(early site)"** 이다.

**증거.**
- 원문 **§2.2**: 1000개 사실 문장 평균. "The ATE of this experiment is **18.6%**, and we note that a large portion of the effect is mediated by strongly causal individual states (**AIE=8.7% at layer 15**) at the last subject token."
- 저자 자신의 표현으로 신규성 주장: "The presence of strong causal states at a late site immediately before the prediction is unsurprising, but **their emergence at an early site at the last token of the subject is a new discovery**."
- **Figure 1e** (은닉상태별 효과), **Figure 2a** (평균 AIE 히트맵), **Figure 7** (같은 데이터를 95% 신뢰구간 선 그래프로 재표시 — "The confidence intervals confirm that the distinctions between peak and non-peak causal effects at both early and late sites are significant")
- 스케일 일반화: **Appendix B.3, Figure 8** — GPT-NeoX(20B)와 GPT-J(6B)에서도 같은 패턴. **Figure 9** — GPT-2 Medium·Large까지 포함한 폭넓은 스케일 비교.

**숨은 전제 (저자가 당연시한 것).**
1. **"잡음으로 망가뜨린 상태"가 '그 사실을 모르는 모델'의 좋은 대리물이다.** subject 임베딩에 $3\sigma_t$ 가우시안 잡음을 더하는 건 자연스러운 반사실이 아니라 **분포 밖(out-of-distribution) 입력**을 만드는 조작이다. 모델이 이상한 입력에 어떻게 반응하는지가 정상 입력에서의 정보 흐름과 같다는 보장은 없다. (저자도 이 불안을 감지해 Appendix B.4 Figure 13에서 다변량 가우시안·균일분포 등 다른 잡음을 비교하는데, 결과는 "효과가 측정 가능할 만큼 크지만 $3\sigma_t$보다는 작다"이다 — 즉 **결론이 잡음 선택에 정량적으로 의존한다**.)
2. **평균이 개별을 대표한다.** AIE는 1000개 문장의 평균이다. 부록 Figure 11이 보여주듯 개별 사례에서는 마지막 subject 토큰이 결정적이지 않은 경우가 흔하다.
3. **"복원 가능성 = 저장 위치".** 한 지점을 clean 값으로 되돌려 예측이 회복된다는 건, 그 지점이 정보를 **담고 있다**는 뜻일 수도 있고 단지 **통과시킨다**는 뜻일 수도 있다. 병목과 저장소는 다르다.

**쉬운 말 풀이.** 수도관에서 물이 새는 곳을 찾는다고 하자. 관 전체에 흙탕물을 흘려보낸 뒤, 딱 한 지점에만 깨끗한 물을 다시 주입해본다. 그 한 지점만 바꿨는데 수도꼭지에서 깨끗한 물이 나온다면, 그 지점이 결정적인 길목이다. 저자들은 이 실험을 GPT의 모든 (단어 위치, 층) 조합에서 반복했고, 두 군데가 튀어나왔다 — 하나는 수도꼭지 바로 앞(예상됨), 다른 하나는 **"스페이스 니들"이라는 이름을 다 읽은 순간의 한복판**(뜻밖).

---

## Claim 2 — 그 병목을 만드는 건 어텐션이 아니라 MLP다

**주장 (한 문장).** early site에서 인과효과를 만들어내는 주체는 어텐션 모듈이 아니라 중간 층 **MLP 모듈**이며, 그 MLP들의 계산을 끊으면 하위 층 은닉상태의 인과효과가 사라진다.

**증거.**
- 원문 **§2.2** 정량 비교: "MLP contributions peak at **AIE 6.6%**, while attention at the last subject token is only **AIE 1.6%**; attention is more important at the last token of the prompt." → **Figure 2b**(MLP), **Figure 2c**(어텐션).
- **경로 특이적 개입 (핵심 증거)** — **Figure 3** 과 §2.2의 서술. 저자들은 계산 그래프를 수정해, 토큰 $i$에서 MLP 계산을 **잘라내고(sever)** 망가진 baseline 상태로 **얼려둔다**. 그러면 clean 상태 $h_i^{(l)}$을 주입해도 그 효과가 MLP를 경유하지 못한다. Pearl (2001)의 path-specific effect를 재는 방식이다. 결과: "the lowest layers lose their causal effect without the activity of future MLP modules, while higher layer states' effects depend little on the MLP activity. **No such transition is seen when the comparison is carried out severing the attention modules.**"
- **Appendix B.2**의 방법론적 실토: 개별 MLP·Attn 활성 **하나씩** 복원하면 효과가 대체로 무시할 수준이라, 저자들은 $[l^*-4, \ldots, l^*+5]$ **10개 층 구간을 통째로 복원**했다. 이는 "결정적 정보가 여러 층에 걸쳐 누적된다"는 뜻이다.
- 대안 방법 대비 우위 주장: §2.2 말미 — 인과추적이 integrated gradients (Sundararajan et al., 2017) 같은 gradient 기반 saliency보다 정보량이 많다(**Figure 16**).

**숨은 전제.**
1. **"어텐션 vs MLP" 이분법이 의미 있다.** Eqn. 1에서 $h_i^{(l)} = h_i^{(l-1)} + a_i^{(l)} + m_i^{(l)}$ 인데, $m_i^{(l)}$의 입력에 $a_i^{(l)}$이 들어간다. 즉 **MLP는 어텐션이 모아온 재료로 계산한다.** MLP를 끊으면 어텐션이 가져온 정보의 하류 처리도 함께 끊긴다. "MLP가 저장한다"와 "MLP가 어텐션의 산출물을 라우팅한다"를 이 실험만으로 완전히 분리하기는 어렵다.
2. **10층 구간 복원이 '모듈의 효과'를 잰다.** 한 층씩은 효과가 없고 10층 묶음은 효과가 크다면, 측정 단위가 "모듈"이 아니라 "10층짜리 블록"이다. 국소화의 해상도 주장이 이 지점에서 약해진다.
3. **각주 3의 아키텍처 가정** — Eqn. 1은 어텐션을 MLP 뒤에 순차 계산하는 Brown et al. (2020) 형태를 따른다. 저자들은 병렬 배치 변형(GPT-J)에도 적용된다고 각주에서 밝히지만, 이는 주장이지 실험 통제는 아니다.

**쉬운 말 풀이.** 공장에서 어느 기계가 제품을 만드는지 알아내려 한다. 두 종류가 있다 — **컨베이어 벨트**(어텐션: 물건을 이리저리 옮김)와 **가공기**(MLP: 물건을 실제로 바꿈). 저자들은 가공기들을 전부 꺼놓고 같은 실험을 다시 했다. 그러자 앞쪽 공정을 아무리 정상으로 되돌려도 제품이 안 나왔다. 반대로 컨베이어 벨트를 껐을 때는 그런 붕괴가 없었다. 결론: 사실을 **만들어내는** 건 가공기 쪽이다. 다만 앞서 말했듯 가공기는 벨트가 날라준 재료로 일하므로, "가공기가 원료를 창고에 보관한다"까지 단정하려면 한 걸음이 더 필요하다.

---

## Claim 1·2 종합 — §2.3의 국소화 가설

두 Claim을 합쳐 저자들은 §2.3에서 다음을 못박는다: 사실 연관은 **(i) MLP 모듈에 (ii) 특정 중간 층들에서 (iii) subject의 마지막 토큰 처리 시점에** 위치한다. 그리고 여기에 대담한 한 줄을 덧붙인다 — Zhao et al. (2021)의 "층 순서를 바꿔도 행동 변화가 적다"는 결과를 근거로, **"we propose that this picture is complete… We conjecture that any fact could be equivalently stored in any one of the middle MLP layers."**

이 conjecture가 논문 전체에서 가장 강한 주장이자 가장 약한 고리다. 강한 이유는 이게 있어야 "층 18을 골라 편집한다"는 다음 장의 임의성이 정당화되기 때문이고, 약한 이유는 **다른 논문의 서로 다른 실험 결과를 근거로 자기 도메인의 완전성을 선언**하기 때문이다. §6과 §7에서 이 지점이 실제로 어떻게 공격당했는지 다룬다.
