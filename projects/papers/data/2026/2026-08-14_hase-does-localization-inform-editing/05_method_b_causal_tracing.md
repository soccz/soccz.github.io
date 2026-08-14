# 4. 방법론 해부 (B) — Causal Tracing 해부

> **배경 사다리**: ① 언어모델은 입력 문장을 받아 다음 단어의 **확률**을 내놓는다. "에펠탑은 ___에 있다"에 대해 "파리" 확률이 0.923이라는 식이다. ② 그 계산 과정에서 각 층·각 토큰 자리마다 **중간 벡터(은닉 표현)** 가 하나씩 생긴다. ③ 그 중간 벡터를 다른 실행에서 가져와 꽂아 넣는 조작을 **activation patching**이라 한다. 이 세 가지면 충분하다.

---

## 4.5 이 부분이 왜 필요한가

"사실이 모델 어디에 있나"를 알려면, 그냥 들여다봐서는 안 된다. 6억~60억 개 숫자를 눈으로 볼 수 없기 때문이다. 그래서 **망가뜨렸다가 되살리는** 방식을 쓴다. 모델이 답을 못 맞히게 만든 다음, 부품을 하나씩 원래대로 돌려놓으면서 **어느 부품을 돌려놨을 때 답이 되살아나는지** 본다. 되살리는 힘이 큰 부품이 "그 사실을 나르고 있던 부품"이다.

이것이 Causal Tracing(§3.2)이며, 이 논문은 이 도구를 **그대로 물려받아** 측정한다.

## 4.6 수식

원문 §3.2가 정의하는 tracing effect:

$$\text{tracing effect} \;=\; p_\theta\!\left(o_{true}\mid s_{noise},\, r,\, v_{(t,\ell)}\right) \;-\; p_\theta\!\left(o_{true}\mid s_{noise},\, r\right)$$

> **① 기호 뜻**
> - $\theta$: 모델 파라미터 전체 (편집 전 원본).
> - $s$: 주어(subject) 토큰들, 예: "에펠탑". $r$: 관계(relation), 예: "~는 ___에 위치한다".
> - $o_{true}$: 정답 객체(object), 예: "파리". 단위는 **확률**(0~1).
> - $s_{noise}$: 주어 토큰 임베딩에 가우시안 잡음을 더한 손상 버전. 원문 verbatim: *"where $s_{noise}$ indicates that we add Gaussian noise with $\sigma=0.094$ to the token embeddings of $s$."*
> - $v_{(t,\ell)}$: **토큰 $t$, 층 $\ell$에서 깨끗한 forward pass의 은닉 표현을 그대로 복원해 넣었다**는 조건 표시.
> - 따라서 좌변은 "그 자리 하나만 원상복구했을 때 늘어난 정답 확률"이며, 단위는 확률 차이(퍼센트 포인트로 읽어도 된다).
>
> **② 일상 비유**
> 라디오에 잡음을 섞어 방송이 안 들리게 만든다. 그리고 부품을 하나씩 정품으로 갈아 끼워 본다. 어떤 부품을 갈았더니 방송이 다시 또렷하게 들린다면, **그 부품이 신호를 나르고 있던 것**이다. tracing effect는 "그 부품을 갈았을 때 얼마나 또렷해졌나"의 양이다.
>
> **③ 왜 이 형태인가**
> - 뺄셈이 필요한 이유: 손상 상태의 잔여 확률 $p_\theta(o_{true}\mid s_{noise}, r)$ 은 사실마다 다르다(어떤 사실은 잡음을 넣어도 어느 정도 맞힌다). 이 기저선을 빼지 않으면 **사실 난이도가 섞여** 들어온다.
> - **손상 후 복원(denoising)** 방식인 이유: 반대 방향인 "깨끗한 상태에서 부품 하나를 지우기(ablation)"도 가능하지만, 트랜스포머는 정보가 여러 경로로 중복 전달돼 **하나 지워도 성능이 안 떨어지는** 경우가 많다. 손상 상태에서 복원하면 **개별 부품의 충분성(sufficiency)** 을 측정하게 되어 신호가 훨씬 선명하다.
> - 저자들은 §4.1에서 정규화 버전(**fractional tracing effect**)도 쓴다: $$\frac{p_\theta(o_{true}\mid s_{noise},r,v_{(t,\ell)}) - p_\theta(o_{true}\mid s_{noise},r)}{p_\theta(o_{true}\mid s,r) - p_\theta(o_{true}\mid s_{noise},r)}$$ 분모는 "완전 복구했을 때의 최대 회복 가능량"이므로, 결과는 0~1의 **회복률**이 된다. 사실마다 다른 스케일을 없애 층 간 비교를 공정하게 만드는 장치다.
>
> **④ 조심할 점**
> - **충분성이지 필요성이 아니다.** tracing effect가 크다는 것은 "그 표현만 있어도 답이 되살아난다"는 뜻이지, "그게 없으면 답을 못 한다"는 뜻이 아니다. 중복 저장된 정보는 둘 다 큰 값을 받는다.
> - **$\sigma=0.094$는 임의 선택이 아니라 관행 계승**이다(원문: *"following [Meng et al. 2022a]"*). 잡음이 너무 작으면 모델이 여전히 맞혀서 회복량이 0이 되고, 너무 크면 분포 밖 입력이 되어 무의미해진다. 즉 **결과가 $\sigma$에 의존한다** — 이것이 §7(한계)에서 다룰 반박 지점 중 하나다.
> - **잡음의 무작위성**: $s_{noise}$는 매번 다른 잡음 실현이다. 같은 사실이라도 잡음을 다시 뽑으면 tracing effect가 흔들린다.

## 4.7 tracing window — 자주 오해되는 디테일

표현 하나만 복원하면 효과가 미미할 수 있어, 실제로는 **연속된 여러 층의 같은 토큰 자리를 한꺼번에 복원**한다. 그 층 개수가 tracing window size다.

원문 §3.2 verbatim: *"The size of this set is referred to as the tracing window size."* 그리고 *"In this paper, we use a tracing window size of 5 by default."*

§4에는 이런 주석도 있다: *"Note we use a tracing window size of 5 (smaller than the value of 10 used in Fig. 2)."*

**이 디테일이 왜 중요한가**: window가 크면 tracing effect가 넓게 번져 "어느 층인지"의 해상도가 떨어진다. 이 논문은 **더 작은 window(5)** 를 써서 해상도를 높였다 — 즉 국소화 쪽에 **유리한** 조건을 준 셈이다. 그럼에도 관계가 안 나왔다는 점이 결론을 강화한다. (Figure 2는 시각적 설명을 위해 관행값 10으로 그렸고, 저자가 그 차이를 본문에 명시했다.)

Figure 2 캡션 verbatim: *"Visualizing Causal Tracing results over MLP layers with window size 10. Tokens with an asterisk are the noised subject tokens. Here, $p_\theta(o_{true}|s,r)=.923$ and $p_\theta(o_{true}|s_{noise},r)=.001$."*

이 두 숫자가 위 수식의 의미를 그대로 보여준다 — 깨끗한 입력에서 정답 확률 **.923**, 잡음을 넣으면 **.001**. 그 사이 **약 0.922의 간극**을 어느 층이 얼마나 메우는지가 tracing effect다.

## 4.8 다른 접근이었다면

- **Attention 가중치 보기**: 어느 토큰에 주목하는지만 보는 방식. 이 레포 2026-05-18(Jain & Wallace)에서 다뤘듯 **attention은 설명이 아니다** — 인과성 보증이 없다. Causal Tracing이 이 문제를 인과 개입으로 우회한 것이다.
- **경사 기반 귀인(Integrated Gradients 등)**: 입력 특징 중요도는 주지만 **층·파라미터 수준의 위치**는 주지 않는다.
- **Zeroing / knockout**: 표현을 0으로 만들어 성능 하락을 본다. 이 논문도 부록 계열 실험에서 zeroing을 언급한다(§8의 "representation denoising and zeroing at the layer level"). 중복성 때문에 신호가 약해지는 것이 단점.

## 4.9 이 절의 핵심 한 문장

> **tracing effect는 "이 표현만 되살려도 답이 돌아온다"는 충분성의 양이며, 그 값이 큰 층이 곧 편집해야 할 층이라는 보장은 정의 어디에도 들어 있지 않다.**
