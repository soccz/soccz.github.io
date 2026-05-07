# 1. 3층 TL;DR

> 같은 이야기를 세 번, 청자만 바꿔 다시 한다. 어디서 멈춰도 그 층까지의 이해는 닫힌다.

---

## 🧒 초등학생 수준

수학 시간에 "친구 셋이 외운 답으로만 시험을 치다가 갑자기 어느 날 *원리* 를 깨닫는" 일을 본 적이 있을 것이다. 기계학습 모델에서도 똑같은 일이 일어난다. 작은 인공 신경망에게 "두 숫자를 더한 뒤 113으로 나눈 나머지를 맞춰봐" 라는 문제를 외우게 시킨다. 처음에는 모델이 *시험에 본 문제는 다 맞히지만* 새로운 문제는 못 맞힌다 — 그냥 외운 거다.

그런데 학습을 *아주 오래* 시키면 어느 순간, 새로운 문제도 갑자기 다 맞히기 시작한다. 이걸 "**그로킹(grokking, 깨달음)**" 이라 부른다. 이전 연구들은 "신기하긴 한데 왜 그러는지 모르겠다" 였다.

이 논문이 한 일: **모델 안을 열어보고**, "아, 모델이 사실 두 숫자를 *동그란 시계 바늘* 로 표현한 다음, *시계바늘 두 개의 합각* 을 계산하고 있었구나" 를 보여줬다. 그리고 그 *시계바늘 회로* 가 얼마나 만들어졌는지 재는 자(척도) 세 개를 만들었다. 자로 재보니, 모델은 *겉으로는 외우기만 하는 동안 속에서는 천천히 그 회로를 만들고 있었고*, 어느 순간 외운 부분이 사라지면서 회로만 남아 — 깨달은 것처럼 보이게 된 것이다.

요지: 깨달음은 **갑자기** 가 아니라, **속에서 천천히 자라던 것이 겉으로 드러난 순간** 일 뿐이다.

---

## 🎓 학부생 수준

**문제**: 1-layer transformer 에 작은 algorithmic task — 모듈러 덧셈 $(a+b) \bmod p$, $p=113$ — 를 학습시키면, **train accuracy 는 빠르게 100%** 에 도달하지만 **test accuracy 는 한참 뒤에야 100%** 에 도달한다. 두 시점 사이가 벌어지는 현상이 그로킹(Power et al. 2022).

**아이디어**: 단순 학습 곡선만 봐서는 "외우다가 어느 날 갑자기 일반화한다" 처럼 보인다. 하지만 모델 가중치를 *Fourier basis* 로 분해하면, generalization 회로의 형성 진행도가 **단조 증가** 하는 것이 보인다 — 즉 "갑작스런" 것이 아니다.

**방법**: 모델이 학습한 회로를 분석해 보면, 두 입력 $a, b$ 의 임베딩이 **소수 개의 frequency $\omega_k$** 에 대해 $\cos(\omega_k a), \sin(\omega_k a), \cos(\omega_k b), \sin(\omega_k b)$ 를 표현하고, MLP 가 trigonometric identity $\cos(\omega_k (a+b)) = \cos(\omega_k a)\cos(\omega_k b) - \sin(\omega_k a)\sin(\omega_k b)$ 로 **합각 표현** 을 만든다. Unembedding 에서 $\cos(\omega_k(a+b-c))$ 를 logit 으로 출력하면 정답 $c = a+b \pmod p$ 에서 최댓값. 이 회로의 진행도를 직접 재기 위해 **세 progress measure** — restricted loss (key frequencies 만의 logit 으로 낸 loss), excluded loss (key frequencies 를 제거한 loss), Fourier component 의 sparsity (Gini 계수) — 를 정의한다.

**결과**: 이 세 measure 가 **train/test loss 표면** 에는 안 보이는 *연속적* 진행을 드러낸다. 학습은 세 단계 — (1) memorization: train loss 급락, (2) circuit formation: test loss 정체이지만 progress measure 단조 변화, (3) cleanup: weight decay 가 memorization 가중치를 제거하면서 test loss 도 급락 — 로 분해된다. **그로킹은 generalization 의 지연이 아니라 cleanup 의 지연**.

핵심 수식: 모델의 logit 은 근사적으로
$$\text{logit}(c \mid a, b) \approx \sum_{k \in K} w_k \cos(\omega_k (a+b-c))$$
여기서 $K$ 는 5개 가량의 key frequency 집합, $\omega_k = 2\pi k / p$. (기호: $a, b$ 입력 정수, $c$ 출력 후보 정수, $w_k$ 학습된 amplitude. 비유: 시계 바늘 5개를 동시에 돌려, 정답 $c=a+b$ 에서 모든 바늘이 정렬되는 순간을 찾는 것. 형태이유: trig identity 가 곱셈을 합각으로 바꿔주는 *유일한* basis 가 Fourier 라서. 조심: $p$ 가 합성수면 회로가 다르게 풀린다.)

---

## 🔬 전문가 수준

본 논문의 4개 contribution:

1. **Fourier 회로의 reverse-engineering**: 1-layer attention-only transformer (또는 attention + 1 MLP) 가 $\mathbb{Z}/p\mathbb{Z}$ modular addition 을 푸는 방법을 *완전히* 닫힌 형태로 기술. 임베딩 → discrete Fourier basis projection → MLP 로 trig identity 적용 → unembedding 의 cosine 합. 핵심은 weight matrices 의 left-singular vector 가 정확히 Fourier modes 가 된다는 spectral 관찰.

2. **Progress measures 3종 정의**:
   - **Restricted loss** $\mathcal{L}_{\text{res}}$: 모델 logit 을 *key frequency K* 에 해당하는 Fourier subspace 로 projection 한 뒤 계산한 loss. *circuit completeness* 척도.
   - **Excluded loss** $\mathcal{L}_{\text{exc}}$: 반대로 $K$ 를 제거한 보집합 subspace 로 projection. *circuit non-redundancy* 척도. 
   - **Gini coefficient of squared Fourier components**: weight matrix Fourier 분해의 sparsity. *circuit cleanliness* 척도.
   세 measure 모두 train/test loss 의 plateau 구간에서 단조 변화 — 즉 plateau 가 동학적으로 active 함을 입증.

3. **3-phase 동학 분해**: 
   (i) **Memorization phase** — train loss ↓, test loss ↑ 또는 정체. 가중치는 dense 하고 Fourier 분해는 dense.
   (ii) **Circuit formation phase** — train loss flat near 0, test loss high but slowly improving. weight decay 가 Fourier-sparse 해(generalization circuit) 의 *implicit margin* 을 favor 하면서 회로가 천천히 형성. progress measure 는 단조 변화하지만 test loss 표면은 거의 평평.
   (iii) **Cleanup phase** — memorization 가중치가 weight decay 에 의해 제거되며 test loss 급락. 외형상 "갑작스런 grokking".
   이 3분해는 grokking 을 "지연된 generalization" 이 아니라 "지연된 weight cleanup" 으로 재해석한다.

4. **Causal intervention 으로 회로 검증**: 발견된 5개 key frequency 만 남기고 나머지 Fourier component 를 ablate 해도 generalization 성능 유지 → 회로의 *충분성* 입증. 반대로 key frequency 를 ablate 하면 즉시 chance-level → *필요성* 입증.

방어 가능한 주장: progress measure 들이 train/test loss 어느 쪽에도 회귀시킬 필요 없이 **사전 정의된 회로 가설** 만으로 단조 변화한다는 점에서, "post-hoc explanation" 의 회의 (cf. Jain-Wallace 2019 attention) 를 회피한다 — circuit 이 *사전* 에 정의됐고, *causal intervention* 으로 검증됐기 때문.

이론적 기여: Power 2022 의 grokking 을 (a) 동학적으로는 weight decay 가 두 종류 해(memorization vs Fourier-sparse) 의 cleanup 시간 상수를 다르게 만드는 것으로, (b) 표현론적으로는 모듈러 덧셈의 character theory 가 transformer architecture 와 정렬한 결과로 환원.

한계: (i) p=113 단일 모듈로 일반화 한계, (ii) 1-layer 에 한정, (iii) algorithmic data 의 *정확한* 대수 구조에 의존 — TS · vision 등 노이즈 있는 도메인에 그대로 옮길 수 없음. 본 해체 §6에서 상세.
