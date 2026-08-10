# 4-D. 방법론 — $k_*$와 $v_*$를 어떻게 정하는가

> **배경 사다리**: ① 앞 절의 Eqn. 2는 "$(k_*, v_*)$ 쌍만 주면 삽입은 자동"이라고 말한다. 그러니 남은 문제는 그 쌍을 정하는 것이다. ② KL 발산(Kullback–Leibler divergence)은 "두 확률분포가 얼마나 다른가"를 재는 자, 0이면 완전히 같다. ③ 여기서 $k_*$는 **관측**으로, $v_*$는 **최적화**로 구한다 — 이 비대칭이 핵심이다.

---

## 이 부분이 왜 필요한가

Eqn. 2는 재료를 받아 요리하는 레시피일 뿐 재료 자체는 만들어주지 않는다. 그리고 재료 선택이 곧 **"사실이란 무엇인가"에 대한 조작적 정의**가 된다 — $k_*$가 "주체를 어떻게 식별하는가"이고 $v_*$가 "새 사실이 무엇을 의미하는가"이기 때문이다.

---

## 부품 1: $k_*$ — 주체를 지목하는 열쇠 (원문 §3.1 Step 1, Eqn. 3)

$$k_* = \frac{1}{N}\sum_{j=1}^{N} k(x_j + s), \qquad \text{where}\quad k(x) = \sigma\!\left(W_{fc}^{(l^*)}\,\gamma\!\left(a_{[x],i}^{(l^*)} + h_{[x],i}^{(l^*-1)}\right)\right) \tag{Eqn. 3}$$

**① 기호 뜻.** $l^*$ = 편집 대상 층 (실제로는 18). $i$ = subject의 **마지막 토큰** 인덱스. $x_j$ = 랜덤 접두사 텍스트, $x_j + s$ = 그 접두사 뒤에 subject를 붙인 문장. $k(x)$ = MLP 첫 행렬 $W_{fc}$를 통과하고 **비선형 $\sigma$를 거친 직후**의 값(Figure 4d). $N$ = 접두사 개수.

**② 일상 비유.** 어떤 사람의 "얼굴 인식 특징"을 뽑는다고 하자. 사진 한 장으로 뽑으면 그날의 조명·각도가 섞여 들어간다. 그래서 **여러 배경에서 찍은 사진 여러 장의 평균**을 쓴다. $x_j$가 바로 그 "여러 배경"이고, 평균이 문맥 의존성을 씻어낸다.

**③ 왜 이 형태인가.** 세 가지 설계 결정이 겹쳐 있다.
- **왜 마지막 subject 토큰인가?** §2가 인과적으로 지목했기 때문이다. 논문 §3.1이 명시적으로 근거를 §2로 돌린다: "Based on the decisive role of MLP inputs at the final subject token (Section 2)".
- **왜 비선형 직후인가?** Eqn. 1에서 $m_i^{(l)} = W_{proj}^{(l)}\sigma(W_{fc}^{(l)}\gamma(\cdot))$이므로, $W_{proj}$의 입장에서 **입력**은 정확히 $\sigma(\cdot)$의 출력이다. 즉 $k_*$는 "$W_{proj}$라는 연상 기억에 실제로 들어가는 키"의 정의 그 자체다. 임의 선택이 아니라 §4-C의 키–값 관점이 강제하는 정의다.
- **왜 평균인가?** 논문이 이유를 직접 밝힌다: "Because the state will vary depending on tokens that precede $s$ in text, we set $k_*$ to an average value over a small set of texts ending with the subject $s$." 접두사가 다르면 같은 subject라도 다른 벡터가 나오므로, 평균이 **문맥 불변 핵심**을 근사한다.

**④ 조심할 점.** 평균은 **분산을 버린다**. 어떤 subject의 표현이 문맥에 따라 정말로 갈라진다면(다의어 등) 평균은 어느 쪽도 아닌 벡터가 된다. 그리고 실제 접두사 표본은 **Appendix E.5** 기준 20개로, §3.1 본문의 "50 random token sequences of length 2 to 10"과 다르다 — 재현 시 주의.

**저자들의 정직한 ablation (Appendix E.5).** 접두사 없음 $S' = 86.1$ / 더 긴 접두사(길이 50 추가) $S' = 89.3$ / 같은 길이 더 많이(각 30개) $S' = 89.2$ (본 설정 $S = 89.2$). 즉 접두사를 **쓰느냐 마느냐**는 3.1점 차이를 만들지만 **얼마나 많이·길게 쓰느냐**는 무의미하다 — "하면 이득, 더 해도 이득 없음"의 포화 구조. 이런 negative ablation을 수치로 남긴 건 신뢰를 크게 올린다.

---

## 부품 2: $v_*$ — 새 사실을 담은 값 (원문 §3.1 Step 2, Eqn. 4)

$$v_* = \arg\min_z \; \frac{1}{N}\sum_{j=1}^{N}\underbrace{-\log \mathbb{P}_{G(m_i^{(l^*)} := z)}\left[o^* \mid x_j + p\right]}_{\text{(a) } o^* \text{ 확률 최대화}} \;+\; \underbrace{D_{KL}\!\left(\mathbb{P}_{G(m_{i'}^{(l^*)} := z)}[x \mid p'] \,\big\|\, \mathbb{P}_G[x \mid p']\right)}_{\text{(b) essence drift 통제}} \tag{Eqn. 4}$$

**① 기호 뜻.** $z$ = 찾고 있는 벡터. $G(m_i^{(l^*)} := z)$ = "층 $l^*$, 토큰 $i$에서 MLP 출력을 강제로 $z$로 바꾼 모델". $o^*$ = 새로 넣고 싶은 답(예: "Paris"). $p$ = 편집 프롬프트, $x_j$ = 앞서와 같은 랜덤 접두사. $p'$ = **"{subject} is a"** 형태의 별도 프롬프트. $D_{KL}$ = KL 발산.

**② 일상 비유.** 배우에게 새 대사를 주는 일이다. (a)는 "이 장면에서 반드시 '파리'라고 말해라". (b)는 "**대신 네 캐릭터 자체는 바꾸지 마라**" — 직업을 바꾸랬지 사람을 딴 사람으로 만들라고는 안 했다. (b)가 없으면 배우는 대사를 맞히려고 정체성까지 갈아엎는다.

**③ 왜 이 형태인가.**
- **(a)만 있으면** 어떻게 되나. $z$가 무한정 커져서 그 자리에서 "Paris"를 강제 출력하는 극단적 벡터가 나온다. 그러면 모델은 subject에 대해 다른 걸 물어도 파리 이야기만 하게 된다 — 특이성 붕괴.
- **(b)의 프롬프트가 왜 "{subject} is a"인가.** 이게 영리하다. 이 프롬프트는 **관계를 지정하지 않은, 주체의 범주적 정체성만 묻는** 질문이다. "스페이스 니들은 ___이다" → "탑/랜드마크/건물". 도시를 바꿔도 **"탑이다"는 유지돼야** 한다. 즉 (b)는 "바꿔도 되는 것(관계 $r$의 답)"과 "바꾸면 안 되는 것(주체의 본질)"을 프롬프트 설계 하나로 분리한다. 논문 표현: "helps preserve the model's understanding of the subject's essence."
- **왜 KL이고 cross-entropy가 아닌가.** 목표가 "정답을 맞혀라"가 아니라 "**원래 모델의 분포와 달라지지 마라**"이기 때문이다. 참조 분포가 정답 레이블이 아니라 편집 전 모델 $\mathbb{P}_G$ 자신이다. 이건 정규화이지 학습 목표가 아니다.

**④ 조심할 점.**
- §3.1 말미의 중요한 구분: "**the optimization does not directly alter model weights**; it identifies a vector representation $v_*$ that, when output at the targeted MLP module, represents the new property $(r, o^*)$." 즉 Eqn. 4는 **가중치 학습이 아니라 표적 벡터 탐색**이고 가중치 변경은 Step 3의 대수가 전담한다. "ROME은 최적화 없는 닫힌 해"라는 흔한 요약이 부정확한 이유다.
- **KL 계수 $\lambda$가 본문 수식에 안 보인다.** Eqn. 4에는 명시적 가중치가 없는데 **Appendix E.5**는 "denoted $\lambda$ in Eqn. 4, is set to $1\times 10^2$"라고 한다 — 재현 시 반드시 부록을 따라야 한다. $\lambda = 100$은 작지 않은 값이고, ROME의 특이성(NS 75.4)이 이 값에 얼마나 의존하는지에 대한 민감도 분석은 **원문에 없다**.
- $p'$이 "{subject} is a" **한 형태로 고정**돼 있어, 이 프롬프트로 포착되지 않는 본질(시간적·관계적 속성)은 보호받지 못한다.

---

## 부품 3: 세 스텝의 비용 구조

Step 1($k_*$, **관측** — forward pass ×20) → Step 2($v_*$, **최적화** — Adam 최대 20 스텝, **지배적 비용**) → Step 3(삽입, **대수** — 행렬 연산 1회). 전체 2초(A6000, GPT-2 XL, Appendix E.5).

저자들이 비교 맥락도 준다 — 하이퍼네트워크(KE·MEND)는 추론이 100ms로 훨씬 빠르지만 "**require hours-to-days of additional training overhead**"다. 즉 ROME은 **선불 0, 건당 2초**, 하이퍼네트워크는 **선불 수 시간~수일, 건당 0.1초**. "메커니즘 이해 도구"라는 목적에서는 선불 0이 압도적으로 유리하다 — 새 모델마다 다시 학습시킬 필요가 없기 때문이다.

---

## 다른 접근으로 했다면

- **$v_*$를 최적화 대신 object 임베딩으로 직접 설정.** Dai et al. (2022)의 KN이 이렇게 한다("adding scaled embedding vectors", Appendix E.2). Table 4에서 KN은 ES 28.7로 사실상 편집이 안 된다. 교훈: **출력층 토큰 임베딩과 중간층 MLP의 값 공간은 같은 공간이 아니다.**
- **$k_*$를 평균 대신 단일 문맥에서.** Appendix E.5의 "No prefix" 조건, $S' = 86.1$로 3.1점 하락.
- **$p'$을 여러 형태로 확장.** 논문은 하나로 고정했다. 다중 essence 프롬프트는 자연스러운 확장이지만 시도되지 않았다 — [10_extensions_c_ideas.md](10_extensions_c_ideas.md)에서 실험 설계로 다룬다.

---

## 이 부분의 핵심 한 문장

> **$k_*$는 "§2가 지목한 좌표에서 문맥을 평균해 읽어낸 주체 식별자"이고 $v_*$는 "새 답은 강제하되 주체의 본질은 KL로 붙잡아둔 최적화 산물"이며, ROME의 특이성이라는 최대 강점은 사실상 Eqn. 4b라는 한 항과 $\lambda = 100$이라는 부록 속 숫자에 걸려 있다.**
