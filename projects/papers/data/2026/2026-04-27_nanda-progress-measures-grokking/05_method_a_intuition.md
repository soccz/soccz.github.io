# 4. 방법론 해부 ① — 큰 그림

> 본 논문의 방법은 두 줄로 압축된다: **(1) 회로를 닫힌 형태로 reverse-engineer 하라. (2) 그 회로에 대한 진행도 척도를 train trajectory 에 적용하라.** 나머지 디테일은 모두 이 두 줄을 받쳐주는 보조 장치다.

## 배경 사다리

이 절을 이해하려면 ① **transformer 의 한 layer 가 attention block + MLP block 으로 구성된다는 것**, ② **임베딩 / 디임베딩이 토큰을 벡터로/벡터를 토큰으로 매핑하는 *학습된 행렬* 이라는 것**, ③ **discrete Fourier transform 이 길이 $p$ 벡터를 $p$ 개의 frequency component 로 분해하는 직교 변환** 이라는 것 — 이 셋만 알면 본 절을 따라갈 수 있다.

---

## 4.1 전체 흐름의 다이어그램 (지문)

학습이 끝난 모델을 *왼쪽에서 오른쪽으로* 추적해 보자. 입력은 토큰 시퀀스 $(a, b, =)$, 출력은 logit 벡터 $\in \mathbb{R}^p$.

1. **임베딩**: 토큰 $a$ 가 임베딩 행렬 $W_E$ 의 $a$-번째 열로 매핑된다. 이 열 벡터는 $d_{\text{model}}=128$ 차원이지만, 실제로 의미 있는 부분공간은 *$2|K|$* 차원 (각 frequency 에 대해 $\cos$ 과 $\sin$ 두 개 component). $|K| \approx 5$ 이므로 약 10 차원이 본질.

2. **Attention**: 단순화된 1-layer attention-only 모델에서 attention 은 (a, b, =) 토큰 정보를 = 위치로 *모아주는* 역할만. 즉 "a, b 두 토큰의 임베딩을 합한 정보가 = 위치의 residual stream 에 도착" — Olsson et al. 2022 의 induction-head 같은 *복잡한 회로* 가 아니라 일종의 *adder 라우터*.

3. **MLP** (또는 attention-only 의 경우 attention output 자체): 두 시계 바늘의 *곱* 을 만든다. $\cos(\omega_k a) \cdot \cos(\omega_k b)$, $\sin(\omega_k a) \cdot \sin(\omega_k b)$, $\cos(\omega_k a) \cdot \sin(\omega_k b)$, $\sin(\omega_k a) \cdot \cos(\omega_k b)$. ReLU 또는 attention softmax 의 비선형성이 *곱셈 가능* (다항 근사) 한 사실에 의존.

4. **Trig identity 적용**: 위 곱항들이 *합쳐지면서*
   $$\cos(\omega_k(a+b)) = \cos\cos - \sin\sin, \qquad \sin(\omega_k(a+b)) = \sin\cos + \cos\sin$$
   가 형성. 이건 학습이 자발적으로 발견하는 표현 — *합각 공식이 곱-합 변환의 유일한 해* 이기 때문.

5. **디임베딩 (Unembedding)**: 합각 표현이 $W_U$ 와 곱해져 logit 으로. 후보 $c$ 에 대한 logit 은
   $$\text{logit}(c) = \sum_k w_k \bigl[\cos(\omega_k(a+b))\cos(\omega_k c) + \sin(\omega_k(a+b))\sin(\omega_k c)\bigr] = \sum_k w_k \cos(\omega_k(a+b-c))$$

   이건 $c = a+b \pmod p$ 일 때 모든 cosine 이 $1$ — 최댓값.

이 5단계가 *학습이 완료된* 모델의 동작이다.

---

## 4.2 학습 과정의 큰 그림

학습이 *진행 중* 인 모델은 위 회로의 *부분적 형성 + memorization 가중치 잔여물* 의 superposition. 이 superposition 의 진행도를 잡기 위해 본 논문이 한 일:

1. **회로 가설 사전 정의**: "이 task 는 Fourier circuit 으로 풀린다" 를 사전에 가정. 가설은 *학습 후 spectral 분석* 에서 검증되지만, progress measure 는 이 가설을 *입력* 으로 받는다.

2. **두 종류 projection 정의**: 
   - $\Pi_K$: key frequency $K$ 의 character subspace 로의 projection.
   - $I - \Pi_K$: 그 보집합으로의 projection.

3. **세 척도 트리거**:
   - $\mathcal{L}_{\text{res}}$: $\Pi_K \cdot \text{logit}$ 의 cross-entropy.
   - $\mathcal{L}_{\text{exc}}$: $(I - \Pi_K) \cdot \text{logit}$ 의 cross-entropy.
   - $G$: weight matrix 의 Fourier 분해 sparsity (Gini).

4. **학습 trajectory 위에서 매 step 측정**: train/test loss 와 함께 위 세 척도를 plot. 이 plot 이 본 논문의 *figure 핵심* — plateau 가 사실은 active 임을 보임.

5. **Causal intervention 으로 validation**: 학습 후 모델에서 key frequency 만 남기고 ablate / 또는 그 반대 → generalization 성능이 어떻게 변하는지. 회로의 충분성 (key 만 남겨도 OK) 과 필요성 (key 빼면 망가짐) 이 동시에 검증.

---

## 4.3 왜 이 접근이 성공했는가 — 세 가지 이유

1. **Task 의 algebraic 정렬**: modular addition 의 group structure ($\mathbb{Z}/p\mathbb{Z}$) 와 transformer architecture 의 *bilinear structure* (attention 의 QK^T, MLP 의 W_in × W_out) 가 character theory 를 거쳐 정확히 정렬된다. 이게 깨끗한 회로의 *물리적 이유*.

2. **사전 회로 가설**: post-hoc 분석 (학습 후 처음 inspection) 이 아니라, 표현론 기반 사전 가설 → 실험 검증 → causal intervention 의 *과학적 method* 를 따른다. 이게 attention-as-explanation 논쟁 (Jain-Wallace 2019) 의 핵심 비판 — "attention map 이 post-hoc 으로 plausible 해 보이는 이야기를 만들 수 있다" — 을 회피한다.

3. **Weight decay 의 implicit margin**: AdamW 의 weight decay 가 *Fourier-sparse 해* 의 implicit bias 를 만든다. 같은 task 를 SGD + weight decay 로 풀어도 비슷한 회로가 나오지만 *훨씬 느림*. AdamW 의 adaptive scaling 이 sparse 해로의 수렴을 가속.

---

## 4.4 다음 파일들로의 연결

- `05_method_b_modadd.md`: modular addition task 의 정확한 setup (data, vocab, p=113 의 의미).
- `05_method_c_fourier_circuit.md`: Fourier 회로의 수식 유도 — character theory 가 transformer 에서 어떻게 자라는가.
- `05_method_d_progress_measures.md`: 세 progress measure 의 정확한 정의와 implementation.
- `05_method_e_implementation.md`: hyperparameter, optimizer, weight decay 값, 학습 step.

각 파일은 독립적으로 읽을 수 있도록 자체 도입부를 갖는다.
