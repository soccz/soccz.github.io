# 4-B. 방법론 — Causal Tracing (인과추적)

> **배경 사다리**: ① 확률 $P[o]$는 "모델이 정답 단어 $o$를 뱉을 가능성"이며 0~1 사이 값이다. ② "매개변수(mediator)"란 원인과 결과 사이에 끼어 있는 중간 다리를 뜻한다. ③ 통계에서 **총효과 = 직접효과 + 간접효과**로 쪼개는 관습이 있고, 이 논문은 그중 간접효과만 쓴다.

---

## 이 부분이 왜 필요한가

가중치를 바꿔 사실을 편집하려면 **어느 가중치를 바꿀지** 먼저 알아야 한다. 그런데 "어텐션 가중치가 크다", "그래디언트가 크다" 같은 신호는 전부 **상관**이다. 상관은 두 방향으로 배신한다 — 중요해 보이는데 지워도 아무 일 없는 성분이 있고, 안 중요해 보이는데 지우면 무너지는 성분이 있다.

인과추적은 이 문제를 정면으로 우회한다. **"본다"가 아니라 "바꾼다"로 측정한다.** 바꿨을 때 출력이 달라지면 인과다. 정의상 그렇다.

---

## 부품 1: 은닉상태의 분해 (원문 §2, Eqn. 1)

먼저 무엇을 건드릴 수 있는지 정하려면 모델을 격자로 써야 한다.

$$h_i^{(l)} = h_i^{(l-1)} + a_i^{(l)} + m_i^{(l)}$$
$$a_i^{(l)} = \text{attn}^{(l)}\left(h_1^{(l-1)}, h_2^{(l-1)}, \ldots, h_i^{(l-1)}\right)$$
$$m_i^{(l)} = W_{proj}^{(l)}\,\sigma\!\left(W_{fc}^{(l)}\,\gamma\!\left(a_i^{(l)} + h_i^{(l-1)}\right)\right) \tag{원문 Eqn. 1}$$

**① 기호 뜻.** $h_i^{(l)}$ = 토큰 $i$, 층 $l$의 은닉상태 벡터 (차원 $H$, GPT-2 XL은 1600). $a_i^{(l)}$ = 그 자리에서 어텐션이 더한 기여. $m_i^{(l)}$ = MLP가 더한 기여. $W_{fc}^{(l)}$ = MLP 첫 번째(팽창) 행렬, $W_{proj}^{(l)}$ = 두 번째(투영) 행렬. $\sigma$ = 정류 비선형(rectifying nonlinearity), $\gamma$ = 정규화 비선형(normalizing nonlinearity, LayerNorm류). 시작점은 $h_i^{(0)} = \text{emb}(x_i) + \text{pos}(i)$, 끝은 $y = \text{decode}(h_T^{(L)})$.

**② 일상 비유.** 컨베이어 벨트 위의 상자에 스티커를 계속 덧붙이는 공정이다. $h^{(l-1)}$은 지금까지 붙은 스티커 뭉치(**떼지 않고 그대로 넘긴다** — 이게 residual). 매 층마다 두 종류의 스티커가 추가된다: 옆줄 상자들을 살펴보고 붙이는 스티커($a$), 이 상자 혼자 들여다보고 붙이는 스티커($m$).

**③ 왜 이 형태인가.** 세 가지가 중요하다. 첫째, **덧셈**이라는 점 — 곱셈이었다면 특정 기여만 따로 떼어내 복원하는 게 불가능하다. residual 구조가 "성분별 개입"이라는 실험 자체를 가능케 한다. 둘째, $m_i^{(l)}$의 입력에 $a_i^{(l)}$이 들어 있다 — 어텐션이 모아온 정보를 MLP가 가공한다. 셋째, $a$는 다른 토큰들을 보지만 $m$은 **자기 자리만** 본다 — 그래서 MLP는 "이 토큰에 대해 아는 것을 꺼내오는" 역할에 자연스럽게 맞는다.

**④ 조심할 점.** 원문 **각주 3**이 명시한다 — 이 식은 어텐션을 MLP 뒤에 **순차** 계산하는 Brown et al. (2020) 형태다. GPT-J처럼 어텐션과 MLP를 **병렬**로 두는 변형에도 방법이 적용된다고 저자들은 말하지만, 그 경우 Eqn. 1의 $m_i^{(l)}$ 입력에서 $a_i^{(l)}$이 빠지므로 "MLP를 끊으면 어텐션 정보의 하류가 끊긴다"는 §2.2 논증의 구조가 달라진다. 그리고 **Appendix B.1의 사소하지만 중요한 함정**: "layers are numbered from 0 to $L-1$ rather than 1 to $L$" — 층별 결과를 재현할 때 off-by-one이 난다.

---

## 부품 2: 세 실행과 손상(corruption) 설계 (원문 §2.1)

**clean run.** 프롬프트를 넣고 모든 $\{h_i^{(l)} \mid i \in [1,T], l \in [1,L]\}$를 저장.

**corrupted run.** 임베딩 직후에 subject에 해당하는 모든 인덱스 $i$에 대해
$$h_i^{(0)} := h_i^{(0)} + \epsilon, \qquad \epsilon \sim \mathcal{N}(0; \nu)$$

**① 기호 뜻.** $\epsilon$ = 더해지는 잡음 벡터, $\nu$ = 그 분산. **Appendix B.1**이 값을 정한다: $\nu = 3\sigma_t$, 즉 텍스트 표본에서 관측된 토큰 임베딩 표준편차 $\sigma_t$의 **3배**.

**② 일상 비유.** 사진 속 인물 얼굴에만 모자이크를 씌우는 것. 배경(질문의 나머지)은 그대로라 "누군가에 대해 묻고 있다"는 건 알지만 "누구인지"는 흐려진다.

**③ 왜 이 형태인가.** 대안은 여럿 있었다. (i) 토큰을 **삭제**하면 시퀀스 길이가 바뀌어 위치 인코딩이 어긋난다. (ii) 다른 subject로 **교체**하면(오늘날의 표준 activation patching은 이 방식을 쓴다) 그 subject의 사실이 대신 활성화되어 대조가 오염된다. (iii) 임베딩을 **0으로** 만들면 분포에서 너무 멀어진다. 가우시안 잡음은 "길이 유지 + 특정 정체성 소거 + 연속적 강도 조절 가능"의 절충이다.

**④ 조심할 점 (이 논문 최대의 방법론적 약점).** $3\sigma_t$는 **임의로 고른 값**이고, 논문의 정량 결과가 이 선택에 의존한다. 저자들은 정직하게 **Appendix B.4 Figure 13**에서 다변량 가우시안 $\mathcal{N}(\mu; \Sigma)$과 균일분포 $\pm 3\sigma$를 비교하는데, 캡션의 결론이 이것이다: "the average total effects measured between the clean run and the corrupted run are large enough to measure causal traces, but **the effects are smaller than the choice of $3\sigma_t$ used in the main paper**." 즉 본문 수치는 **효과를 가장 크게 보이게 하는 잡음 설정**에서 나왔다. 결론의 **방향**은 잡음에 강건하지만 **크기**는 아니다.

**corrupted-with-restoration run.** 망가진 채 흐르게 두되 특정 $(\hat{i}, \hat{l})$에서 clean 값 $h_{\hat{i}}^{(\hat{l})}$을 강제 출력하게 훅(hook)을 건다. 이후 계산은 **추가 개입 없이** 진행된다. 이 "이후는 자유"가 중요하다 — 한 지점의 복원이 하류로 얼마나 전파되는지를 재는 것이 목적이기 때문이다.

---

## 부품 3: 총효과와 간접효과 (원문 §2.1)

$$\text{TE} = P[o] - P_*[o], \qquad \text{IE} = P_{*,\,\text{clean } h_i^{(l)}}[o] - P_*[o]$$

**① 기호 뜻.** $P[o]$ = clean run에서 정답 $o$의 확률. $P_*[o]$ = corrupted run에서의 확률. $P_{*,\text{clean }h_i^{(l)}}[o]$ = 망가진 상태에서 그 칸 하나만 되살렸을 때의 확률. 문장 표본에 대해 평균내면 **ATE**와 **AIE**.

**② 일상 비유.** TE는 "모자이크를 씌웠을 때 정답률이 얼마나 떨어졌나"(피해 총량). IE는 "그 상태에서 딱 한 부품만 원복했더니 정답률이 얼마나 돌아왔나"(그 부품의 복구 기여). 손해액 대비 각 부품의 복구 지분을 재는 셈이다.

**③ 왜 이 형태인가.** **직접효과(direct effect)를 안 쓴 이유가 논문에 명시돼 있다.** 원문 **각주 5**: "One could also compute the direct effect, which flows through other model components besides the chosen mediator. However, we found this effect to be **noisy and uninformative**, in line with results by Vig et al. (2020b)." 이건 통계적 선택이 아니라 **경험적 포기**다 — 정직하지만, 인과 분해가 반쪽만 쓰이고 있다는 뜻이기도 하다.

**④ 조심할 점.** IE는 **개별 칸에 부여된 값이지만 칸들 사이의 상호작용을 담지 못한다.** 두 칸을 동시에 복원하면 각각의 IE 합보다 클 수도 작을 수도 있다. 실제로 **Appendix B.2**가 이 문제에 부딪힌다 — MLP/Attn 기여를 **하나씩** 복원하면 효과가 "generally negligible"이라, 저자들은 $[l^*-4, \ldots, l^*+5]$ **10개 층 구간을 통째로** 복원하는 방식으로 바꿨다. 이건 방법의 해상도가 "층 1개"가 아니라 "층 10개 묶음"이라는 자백이다.

---

## 부품 4: 경로 절단 (severing) — 논문에서 가장 영리한 조작 (원문 §2.2, Figure 3)

성분별 복원만으로는 "MLP가 중요하다"까지밖에 못 간다. 저자들은 한 발 더 나간다.

**조작.** ① 먼저 corrupted 조건에서 각 MLP의 기여 $m_i^{(l)}$을 기록해둔다. ② 그다음 계산 그래프를 고쳐, 토큰 $i$의 MLP 계산을 **망가진 그 값으로 얼려버린다**. 이제 clean 상태 $h_i^{(l)}$을 주입해도 그 정보가 **MLP를 통과하지 못한다** — MLP는 자기 입력이 뭐든 미리 얼려둔 값을 뱉기 때문이다.

**무엇이 측정되나.** Pearl (2001)의 **path-specific effect** — "MLP를 경유하지 않는 경로들"만의 효과.

**결과 (§2.2 verbatim).** "we observe (d) the lowest layers lose their causal effect without the activity of future MLP modules, while (f) higher layer states' effects depend little on the MLP activity. **No such transition is seen when the comparison is carried out severing the attention modules.**"

**왜 이게 결정적인가.** 성분별 복원(Figure 2b/2c)은 "MLP를 켰을 때 효과가 크다"를 보인다 — **충분조건** 쪽 증거다. 절단은 "MLP를 껐을 때 효과가 사라진다"를 보인다 — **필요조건** 쪽 증거다. 둘을 다 갖춰야 "MLP가 이 계산의 주체다"라는 말이 성립한다. 대칭 대조군(어텐션 절단)에서 같은 전이가 안 나타난다는 것까지 확인했다는 점이 설계의 완결성을 만든다.

**조심할 점.** MLP를 얼리는 건 **아주 강한 개입**이다. 모델은 이제 정상 작동 범위를 완전히 벗어난 상태다. "정상 모델에서 MLP가 하는 일"을 "MLP를 얼린 비정상 모델의 붕괴 양상"으로부터 추론하는 것이므로, 외삽 한 걸음이 들어 있다.

---

## 다른 접근으로 했다면

- **Gradient 기반 saliency (Integrated Gradients; Sundararajan et al. 2017).** 저자들이 직접 비교했고(§2.2 말미, **Figure 16**) 인과추적이 더 정보량이 많다고 결론냈다. 근본 이유: 그래디언트는 **무한소 변화**에 대한 민감도인데, 우리가 알고 싶은 건 "이 성분을 통째로 바꾸면"이라는 **유한한** 개입의 효과다.
- **어텐션 가중치 읽기.** `attention-as-explanation` 계보(2026-05-18 Jain & Wallace 커버)가 이미 무너뜨린 길. 어텐션 가중치는 인과 주장을 지탱하지 못한다.
- **프로빙 분류기.** §4가 Belinkov (2021)를 자기 인용하며 배제한 길 — "dissociated from the network's behavior".
- **가중치 절제(ablation)만.** 가중치를 0으로 만들면 영구적이라 사실 하나 단위의 세밀한 지도를 그릴 수 없다. 활성 개입은 **입력 하나·순간 하나** 단위 해상도를 준다.

---

## 이 부분의 핵심 한 문장

> **Causal Tracing은 "손상 → 선택적 복원 → 확률 회복량 측정"이라는 3박자로, 상관 기반 해석이 원리적으로 줄 수 없는 인과 지도를 만든다 — 다만 그 지도의 좌표는 손상 방식($3\sigma_t$ 가우시안)과 복원 단위(10층 구간)라는 두 개의 자유 선택에 정량적으로 의존한다.**
