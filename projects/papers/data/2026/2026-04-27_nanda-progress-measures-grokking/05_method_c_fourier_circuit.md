# 4. 방법론 ③ — Fourier 회로의 수식 유도

> 이 절은 *논문이 결과만 명시한 것* 을 손으로 유도해 본다. 끝까지 따라오면, 왜 transformer 가 modular addition 을 풀 때 *반드시* (해의 생성공간 안에서) Fourier 회로로 수렴할 수밖에 없는지 한 번에 보일 것이다.

## 배경 사다리

이 절은 ① **Discrete Fourier transform 이 길이 $p$ 의 함수를 $p$ 개의 character $\chi_k(x) = e^{2\pi i k x / p}$ 의 합으로 분해한다는 것**, ② **trig identity 의 합각 공식**, ③ **transformer 의 forward path 가 (a) bilinear in attention QK·V (b) elementwise nonlinearity in MLP** 라는 것을 안다는 가정. 잘 모르더라도 따라오기만 하면 풀린다.

---

## 4.C.1 Group character theory 한 페이지

$\mathbb{Z}/p\mathbb{Z}$ 위의 *complex-valued 함수* 들의 공간은 $\mathbb{C}^p$ 이고, 이 공간에 group action 과 호환되는 *직교 기저* 가 존재 — 그것이 character

$$\chi_k(x) = e^{2\pi i k x / p}, \qquad k = 0, 1, ..., p-1.$$

핵심 성질:

$$\chi_k(a + b) = \chi_k(a) \cdot \chi_k(b) \quad (\text{준동형, homomorphism})$$

$$\frac{1}{p}\sum_{x=0}^{p-1} \chi_k(x) \overline{\chi_{k'}(x)} = \delta_{kk'} \quad (\text{직교성})$$

**기호 뜻**: $i$ 는 허수단위, $\delta_{kk'}$ 는 Kronecker delta (k=k' 면 1, 아니면 0), $\bar{}$ 는 복소공액.

**비유**: $\chi_k$ 는 "주파수 $k$ 의 시계 바늘 회전" — $a$ 만큼 입력하면 시계가 $2\pi k/p \cdot a$ 라디안 회전.

**왜 이 형태**: $\mathbb{Z}/p\mathbb{Z}$ 는 cyclic group of order p, 그 *Pontryagin dual* 은 또다시 $\mathbb{Z}/p\mathbb{Z}$. 1-차원 표현이 모두 character. 즉 cyclic group 위의 *모든 group-equivariant linear operation* 은 Fourier basis 에서 diagonal.

**조심할 점**: 비복소 (실수만 쓰는) transformer 는 $\chi_k$ 의 실수부 $\cos$ 과 허수부 $\sin$ 를 *쌍* 으로 다룬다. 즉 frequency $k$ 마다 2-차원 부분공간이 됨. 따라서 $|K|$ 개 frequency → $2|K|$ 차원 representation.

---

## 4.C.2 임베딩 행렬의 Fourier 표현

학습이 끝난 모델의 임베딩 행렬 $W_E \in \mathbb{R}^{d_{\text{model}} \times p}$ (= 토큰은 무시) 은, 적절한 직교 기저 변환 $U \in \mathbb{R}^{d_{\text{model}} \times d_{\text{model}}}$ 후

$$U^\top W_E[:, a] \approx \begin{pmatrix} \cos(\omega_{k_1} a) \\ \sin(\omega_{k_1} a) \\ \cos(\omega_{k_2} a) \\ \sin(\omega_{k_2} a) \\ \vdots \\ \cos(\omega_{k_5} a) \\ \sin(\omega_{k_5} a) \\ 0 \\ \vdots \\ 0 \end{pmatrix}$$

즉 $W_E[:, a]$ 는 $a$ 에 의존하는 부분공간이 $2|K| \approx 10$ 차원이고, 그 부분공간에서 $a$ 를 character 로 인코딩.

**기호 뜻**: $W_E[:, a]$ 는 a-번째 열 (정수 $a$ 의 임베딩 벡터). 

**비유**: 정수 $a=37$ 을 5 개 시계의 각도 (각각 $\omega_{k_1}\cdot 37, ..., \omega_{k_5}\cdot 37$) 로 표현. 이 5 쌍 (cos, sin) 만 보면 $a$ 가 무엇인지 *복원 가능* (인접 frequency 가 충분히 다르면).

**왜 이 형태**: 학습이 weight decay 압력 아래에서 *최소 norm + train loss 0* 의 해를 찾을 때, character 표현이 *유일하게 효율적* — 왜냐하면 (1) compositional task 의 group equivariance 가 character 와 정렬, (2) sparse Fourier 가 weight decay 이용 가장 작은 norm.

**조심할 점**: 이 표현은 *직교 변환 후* 형태 — 학습 직후 raw $W_E$ 를 print 하면 그냥 어수선한 행렬. SVD 또는 Fourier 분해 *후에야* sparse 가 보임.

---

## 4.C.3 Attention + MLP 가 합각 공식을 구현

= 위치의 residual stream 에는 (단순화하면) $a$ 와 $b$ 의 임베딩이 *합쳐진* 상태로 들어옴 — 즉

$$z_= \approx \alpha\bigl[U^\top W_E[:, a]\bigr] + \beta\bigl[U^\top W_E[:, b]\bigr]$$

(α, β 는 attention weight) — 단지 *합* 이지 곱이 아니다. 합 만으로는 $\cos(\omega_k(a+b))$ 이 나오지 않음.

곱셈은 어디서 오나? **MLP의 ReLU 비선형성** 또는 **Attention 의 softmax**. 표현하자면

$$\text{ReLU}(c_1 \cos(\omega_k a) + c_2 \cos(\omega_k b))$$

같은 항이 *Taylor 전개* 하면 cross-term $\cos(\omega_k a)\cos(\omega_k b)$ 가 나옴. 학습은 MLP 의 weight 들이 이 cross-term 을 *추출* 하도록 자가-정렬.

자세히 말하자면, MLP hidden activation 들 $h_j = \text{ReLU}\left(\sum_i W_{\text{in}, ji} z_i\right)$ 가 학습 후

$$\sum_j v_j h_j \approx \sum_k w_k \bigl[\cos(\omega_k a)\cos(\omega_k b) - \sin(\omega_k a)\sin(\omega_k b)\bigr] = \sum_k w_k \cos(\omega_k(a+b))$$

같은 합각 표현을 만드는 form 에 수렴. 

**기호 뜻**: $h_j$ MLP hidden unit, $W_{\text{in}, ji}$ MLP input weight, $v_j$ MLP output weight, $w_k$ 는 frequency $k$ 의 amplitude.

**비유**: 두 시계 바늘 a, b 를 *동시에 손가락으로 가리키며* 비선형 카메라로 사진을 찍으면, 사진에는 *둘이 만나는 위치* (= $a+b$) 가 가장 밝게 찍힌다. ReLU 가 그 카메라 — 동시에 활성화된 두 입력의 곱을 *암묵적으로* 추출한다.

**왜 이 형태**: trig 의 곱-합 변환은 *deterministic* — 즉 합각 공식은 $\cos\cos$, $\sin\sin$, $\cos\sin$ 의 4 가지 곱항으로 $\cos$ 와 $\sin$ 의 합 (a+b) 표현을 *유일하게* 결정. 학습이 이 항들 중 *맞는 부호 조합* 을 자발적으로 찾는다.

**조심할 점**: ReLU 는 곱셈을 *정확히* 구현 못 한다 — Taylor 근사 + 학습 weight 의 finely tuned 조합으로 *근사 곱셈* 만. 그래서 모델이 어느 정도 size 가 있어야 하고 (hidden 512 이상), 부족하면 progress measure 가 saturate 못 한다.

---

## 4.C.4 Unembedding 의 cosine 합

이제 = 위치의 residual stream 은 $\cos(\omega_k(a+b)), \sin(\omega_k(a+b))$ 의 쌍을 가지고 있다. Unembedding $W_U \in \mathbb{R}^{p \times d_{\text{model}}}$ 의 c-번째 행은 (학습 후)

$$W_U[c, :] \cdot U \approx \bigl[\cos(\omega_{k_1} c), \sin(\omega_{k_1} c), ..., \cos(\omega_{k_5} c), \sin(\omega_{k_5} c), 0, ..., 0\bigr]$$

즉 $W_U[c, :]$ 도 같은 character 표현. 따라서 $c$ 의 logit:

$$\text{logit}(c) = W_U[c, :] \cdot z_= \approx \sum_{k \in K} \bigl[\cos(\omega_k(a+b))\cos(\omega_k c) + \sin(\omega_k(a+b))\sin(\omega_k c)\bigr] = \sum_{k \in K} \cos(\omega_k(a+b-c))$$

**기호 뜻**: $z_=$ 는 = 위치 residual stream 의 합각 표현 부분, $W_U[c, :]$ 는 후보 c 에 대한 unembedding 벡터.

**비유**: 5 개 시계가 모두 *같은 각도* 를 가리키는 c 를 찾는 것. $a+b - c \equiv 0 \pmod p$ 면 모든 cosine 이 1 이라 logit 최댓값.

**왜 이 형태**: 합각 공식의 역방향 — $\cos(A)\cos(B) + \sin(A)\sin(B) = \cos(A-B)$. 이 항등식이 logit 을 *closed-form distance* (a+b 와 c 사이 mod p 거리의 cosine) 으로 변환.

**조심할 점**: 만약 모델이 어떤 frequency $k$ 의 $w_k$ amplitude 를 *음수* 로 학습하면 (실제로 그런 frequency 가 일부 있음), $\cos(\omega_k(a+b-c))$ 가 *음의 logit* 으로 기여 — 즉 그 frequency 는 "맞는 c 가 아닌 다른 후보" 를 favor 하기에 회로의 *fidelity* 검증에서 별도 처리 필요.

---

## 4.C.5 회로 충분성의 직관적 증명

$\sum_{k=1}^{p-1} \cos(\omega_k(a+b-c))$ 는 $a+b-c \equiv 0$ 일 때 $p-1$, 아니면 $-1$ — 즉 *완전히* 정답을 indicator. 그래서 *모든 frequency* 를 사용하면 logit 이 0/1 indicator 가 됨 (perfect classifier).

본 모델이 사용하는 5 개 frequency 만 가지고도 *충분히 sharp* 한 logit gap 을 만들 수 있는가? Discrete signal processing 의 *uncertainty principle* 에 의해, $p=113$ 위에서 5 개 frequency 의 cosine sum 은 *대략 $p/5 \approx 22$* 정도의 width 를 갖는 peak 을 만든다. 이 peak 이 *correctness margin* 으로 작동.

이게 모델이 어떤 frequency 를 선택했냐에 따라 *interference pattern* 이 달라진다. 학습은 *서로 well-separated* 한 5 개 frequency 를 선택하는 implicit bias 를 가진다 — 그래야 peak 이 sharper.

**비유**: 5 개 다른 음높이의 종이 동시에 울려, 정답 c 위치에서만 모든 종이 *공명* 한다. frequency 가 잘 분배되면 다른 위치에서는 음들이 서로 *상쇄* 되어 silent.

---

## 4.C.6 핵심 한 문장 요약

$\mathbb{Z}/p\mathbb{Z}$ 의 character theory 가 transformer 의 *embedding-bilinear-unembedding* 구조와 정렬되어, 학습이 자발적으로 발견한 회로는 *5-sparse Fourier representation* + *trig identity 합각 공식* + *cosine-distance logit* 의 합성. 이 회로는 weight decay + AdamW 의 implicit bias 아래에서 *유일* 하다.

→ 다음 파일 `05_method_d_progress_measures.md` 에서 이 회로를 어떻게 *측정* 하는지 (세 progress measure) 의 정확한 정의와 implementation 으로 들어간다.
