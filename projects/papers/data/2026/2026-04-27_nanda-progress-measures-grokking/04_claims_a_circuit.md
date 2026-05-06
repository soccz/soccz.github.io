# 3. 핵심 Claim 해체 (a) — Fourier 회로의 발견

## Claim 1. 1-layer transformer 가 modular addition 을 *Fourier basis 위의 합각 공식* 으로 푼다

### 주장 (한 문장)

학습된 모델의 입출력 함수는, 적절한 basis 변환 후 다음과 같은 닫힌 형태로 근사된다:

$$\text{logit}(c \mid a, b) \approx \sum_{k \in K} w_k \cos\bigl(\omega_k (a + b - c)\bigr), \qquad \omega_k = \frac{2\pi k}{p}$$

여기서 $K$ 는 약 5개 정도의 *key frequency* 집합, $w_k$ 는 학습된 amplitude.

### 수식 4줄 해석

- **기호 뜻**: $a, b \in \{0, ..., p-1\}$ 입력 정수 (모듈러 합의 두 피연산자), $c$ 는 출력 후보 정수, $\omega_k = 2\pi k/p$ 는 정수 주파수 $k$ 에 대응하는 각주파수 (radian/unit), $w_k$ 는 학습 후 결정되는 실수 amplitude. logit 은 softmax 직전 unnormalized score.
- **일상 비유**: 시계 바늘 5개를 동시에 돌린다고 생각하라. 각 바늘은 회전 속도 $\omega_k$ 가 다르다. 입력 $a, b$ 가 각각 바늘들을 그만큼 돌리고, 모델은 후보 $c$ 가 정확히 $a+b$ 일 때 *모든 바늘이 동시에 12시를 가리키게* 만든다 — 그 순간 cosine 합이 최대.
- **왜 이 형태**: 모듈러 덧셈 군 $\mathbb{Z}/p\mathbb{Z}$ 의 *기약 표현 (irreducible representation)* 이 정확히 $\chi_k(a) = e^{i\omega_k a}$ 인 1차원 character. transformer 의 임베딩은 이 character 들의 실수 부분 / 허수 부분 ($\cos, \sin$) 으로 자연스럽게 분해된다. 다른 basis 로는 곱셈을 합각으로 바꾸는 trig identity 가 작동하지 않는다.
- **조심할 점**: $p$ 가 합성수이거나, task 가 nonabelian group operation (예: $S_5$ permutation composition) 이면 이 *한 줄 closed form* 이 성립하지 않는다. character 가 더 이상 1차원이 아닐 수 있고, 그럼 회로가 matrix-valued representation 으로 옮겨간다. (Power 2022 의 $S_5$ 결과는 본 논문에서 다루지 않음.)

### 증거 (논문에서 어디?)

- **Embedding spectral 분석**: $W_E \in \mathbb{R}^{d_{\text{model}} \times p}$ (사전형 임베딩 행렬) 의 SVD 를 떠보면 좌특이벡터들이 정확히 $\cos(\omega_k \cdot), \sin(\omega_k \cdot)$ 형태로 정렬됨. 논문 Figure 1 또는 2 (재현 노트북 기준 첫 번째 plot) 의 spectral plot 이 약 5개의 sharp peak 을 보임.
- **MLP 분석**: hidden activation 들이 $\cos(\omega_k a) \cos(\omega_k b)$, $\sin(\omega_k a) \sin(\omega_k b)$ 같은 product 항으로 분해되며, 이는 trig 합각 공식
  $$\cos(\omega_k(a+b)) = \cos(\omega_k a)\cos(\omega_k b) - \sin(\omega_k a)\sin(\omega_k b)$$
  $$\sin(\omega_k(a+b)) = \sin(\omega_k a)\cos(\omega_k b) + \cos(\omega_k a)\sin(\omega_k b)$$
  로 합쳐져 *합각 표현* $\cos(\omega_k(a+b)), \sin(\omega_k(a+b))$ 를 만들어 냄.
- **Unembedding 분석**: $W_U^\top$ 에서 candidate $c$ 와 합각 표현의 내적이 $\cos(\omega_k(a+b))\cos(\omega_k c) + \sin(\omega_k(a+b))\sin(\omega_k c) = \cos(\omega_k(a+b-c))$ 로 떨어짐.

### 숨은 전제

1. **모델 표현이 진짜 sparse 한 frequency 집합으로 수렴함** — 일반적인 deep network 의 weight 는 기저변환 후에도 dense 일 수 있다. 본 논문은 *weight decay 를 충분히 큰 값으로 설정* 하기에 sparsity 가 강제됨. weight decay 없는 학습에서는 같은 회로를 보장 못 한다 (실제로 grokking 도 안 일어남).
2. **단일 frequency 분해가 충분히 정렬됨** — 5개 frequency 가 정확히 어디(어떤 $k$ 값) 에 위치하는지는 *학습 과정의 우연성에* 의존. 다른 random seed 면 다른 5개 frequency 가 선택될 수 있음. 회로의 *형태* (Fourier basis 위 5-sparse) 는 보존되지만, *구체적 값* 은 그렇지 않음.
3. **Attention 의 역할이 약함** — 1-layer attention-only 모델에서도 grokking 이 일어남이 알려져 있고, 그 경우 attention 은 단지 (a, b, =) 토큰의 정보를 = 위치로 모으는 *route 역할* 만. 회로의 *비선형 곱셈* 부분은 attention 의 softmax 이거나 (attention-only 의 경우) 또는 MLP 의 ReLU (1-layer + MLP 의 경우). 둘 다 trig identity 를 *근사* 로 구현 가능. 

### 쉬운 말 풀이

모델은 두 입력 숫자 $a, b$ 를 *시계 바늘의 각도* 로 바꿔 놓는다. 시계는 한 종류만 있는 게 아니라 5개 — 각각 다른 속도로 도는 시계 — 가 동시에 작동한다. 모델은 두 시계 바늘의 각도를 *더해서* 출력하는 함수를 학습한다 (각도 더하기는 sin·cos 합각 공식으로 풀 수 있다). 마지막으로, 모든 5개 시계의 더한 각도가 후보 답 $c$ 와 일치하는지 보고, 일치하면 점수 (logit) 를 높게 매긴다. 이 5개 시계 + 합각 공식 + 일치 검사 가 *전체 회로* 다.

---

## Claim 1 의 함의

이 claim 이 강력한 이유는 **반증 가능성** 때문이다. 만약 회로가 이게 아니라면:
- $\cos(\omega_k(a+b-c))$ 가 아닌 다른 logit 형태였다면 — Fourier basis 가 아닌 다른 basis 에서 sparse 했을 것.
- 5개가 아닌 임의 개수의 frequency 였다면 — sparsity 측정 (Gini 계수) 이 다른 값으로 saturate 했을 것.
- 합각 공식이 아니라면 — MLP hidden activation 의 product 항이 다른 결합으로 분해됐을 것.

본 논문은 이 가설들을 모두 *causal intervention* (관련 frequency 만 남기고 ablate, 또는 반대로 제거) 으로 검증한다. 이게 §4.4 의 progress measure 와 직접 연결된다.

→ 다음 파일 `04_claims_b_progress.md` 에서 Claim 2 (progress measure) 와 Claim 3 (3-phase 동학) 으로 이어진다.
