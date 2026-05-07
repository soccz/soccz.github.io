# 4. 방법론 ② — Modular addition setup

> 논문 전체가 *하나의 toy task* 위에서 작동한다. 이 task 의 selection 자체가 강한 가설이다.

## 배경 사다리

이 절을 이해하려면 ① **소수 (prime number)** 가 1과 자기 자신 외엔 약수가 없는 정수, ② **modular arithmetic** 이 "어떤 수 $p$ 로 나눈 나머지" 산술이라는 것, ③ **시퀀스 모델의 vocabulary** 가 "토큰 → 정수 인덱스" 의 lookup table 이라는 것 — 이 셋만 있으면 된다.

## 4.B.1 Task 정의

**입력**: 정수 쌍 $(a, b) \in \{0, 1, ..., p-1\}^2$, $p = 113$.  
**시퀀스 형식**: $(a, b, =)$ — 세 토큰. = 는 special token (vocabulary 에 추가).  
**Vocabulary 크기**: $p + 1 = 114$ (정수 0~112 + = 토큰).  
**목표**: = 위치에서 $c = (a + b) \bmod p$ 를 예측.  
**Loss**: cross-entropy on the = position only.

**Train/Test split**: 가능한 모든 $(a, b)$ 쌍은 $p^2 = 12769$ 개. 이 중 *train fraction* $\rho \in \{0.3, 0.4, 0.5\}$ 정도 (논문은 보통 $\rho = 0.3$ 근처) 를 train 으로 무작위 sampling, 나머지를 test.

### 왜 $p = 113$ 인가

- **$p$ 가 소수** 이면 $\mathbb{Z}/p\mathbb{Z}$ 가 *유한체* (field) 가 되고, 모든 nonzero 원소가 unit (역원이 존재). character 가 깔끔하게 1차원 — 회로 분석이 쉬움.
- **$p \approx 100$** 정도여야 (1) 학습 가능 (vocab 너무 크면 수렴이 안 됨), (2) memorization 으로 풀기엔 충분히 큼 (12769 쌍은 1-layer 모델의 작은 capacity 로는 외우기 어렵지만, train fraction 의 ~3800 쌍은 외울 수 있음 — 그래서 두 phase 가 분리됨).
- **선행 연구 (Power 2022) 와 비교 가능**.

### 왜 1-layer transformer 인가

Power 2022 가 사용한 것과 같은 미니멀 구조. 1-layer 면 회로가 *얕고* attention + MLP 의 단일 합성으로 분해되어 reverse-engineering 이 닫힌 형태. 2-layer 이상이면 *circuit composition* 이 발생해 ($K$-frequency 가 layer 간 다르게 분배될 수 있음) 분석이 훨씬 복잡.

## 4.B.2 Architecture 디테일

논문이 사용한 (또는 재현 노트북에서 표준이 된) 설정:

- **Embedding**: $W_E \in \mathbb{R}^{d_{\text{model}} \times (p+1)}$, $d_{\text{model}} = 128$. token → 128차원 벡터.
- **Positional encoding**: 단순 learned PE (시퀀스 길이가 3 이라 거의 의미 없음 — 다만 = 토큰 위치를 구분하는 데 필요).
- **Attention layer**: 4 heads, head_dim = 32. $W_Q, W_K, W_V, W_O$.
- **MLP layer**: $W_{\text{in}} \in \mathbb{R}^{4d_{\text{model}} \times d_{\text{model}}}$, ReLU, $W_{\text{out}} \in \mathbb{R}^{d_{\text{model}} \times 4d_{\text{model}}}$. hidden dim = 512.
- **LayerNorm**: 각 sublayer 전후. (분석 시 LN 의 scale 효과 제거를 위해 *normalized* analysis 를 함.)
- **Unembedding** $W_U$: weight tying 또는 별도 행렬. 후자가 일반적.

### Total parameters

$d_{\text{model}}=128$, hidden=512 의 1-layer 면 약 $128 \cdot 114 + 4 \cdot (3 \cdot 128 \cdot 128 + 128 \cdot 128) + (4 \cdot 128 \cdot 512 + 512 \cdot 128) + 128 \cdot 114 \approx 4.5\cdot 10^5$ 정도. 작은 모델이라 single GPU 에서 fast.

## 4.B.3 Optimizer & 학습 동학

- **Optimizer**: AdamW (weight decay 가 *decoupled* — gradient 와 별개로 가중치에 직접 곱연산. 이게 핵심. 일반 Adam + L2 reg 가 아님).
- **Weight decay**: $\lambda = 1.0$ — 일반적으로 사용되는 0.01~0.1 보다 *극단적으로 큼*. 이 값이 grokking 의 직접 trigger.
- **Learning rate**: 일반적 $10^{-3}$ 정도, no schedule 또는 단순 linear warmup.
- **Batch size**: train set 전체 (full batch) — 12769·0.3 ≈ 3800 쌍이 한 batch 가 됨. 작은 task 라 가능.
- **Total steps**: $\sim 4 \cdot 10^4$. memorization 은 첫 $10^3$ step, grokking 은 $\sim 10^4$ step 부근.

### 왜 weight decay = 1.0 인가

이 값은 일반적 ML training 의 표준값보다 *수십 배 크다*. 두 효과:
1. **Memorization 가중치 (large norm, dense)** 가 빠르게 줄어들도록 강제.
2. **Sparse Fourier 해 (small effective norm, sparse)** 가 implicit bias 로 favored.

만약 $\lambda$ 가 작으면 cleanup phase 가 *너무 느려* 실험 가능 시간 안에 grokking 이 안 보임. 만약 $\lambda$ 가 너무 크면 두 종류 가중치가 *동시에* 사라져 train loss 도 늘어나면서 회로가 형성 못 됨. $\lambda = 1.0$ 은 *둘 사이의 sweet spot*.

## 4.B.4 Task selection 의 강한 함의

이 task 의 선택은 *우연이 아니다*:

1. **Compositional**: $a + b$ 의 합성성이 character $\chi_k(a+b) = \chi_k(a)\chi_k(b)$ — 이게 합각 공식의 algebraic 뿌리.
2. **Cyclic**: $\mathbb{Z}/p\mathbb{Z}$ 의 cyclic 구조가 Fourier basis 의 적용 가능성을 보장. *비주기적* 산술 (e.g., 정수 덧셈 without modulo, $a + b \in \mathbb{Z}$) 였다면 Fourier 가 *유한* 기저로 안 끝남.
3. **Discrete**: vocab size $p$ 가 유한해서 character 가 *유한 차원*. 연속 task (TS forecasting 등) 였다면 character 대신 *Fourier integral* 이 필요해 회로가 정확히 sparse 해질 보장이 약해짐.

### 본 논문이 *이 task 만* 분석한 비용

이 task selection 은 회로 분석을 가능하게 만든 *방법론적 자산* 이지만, 동시에 *일반화 한계* 의 직접 원인. 본 논문의 결론 — "grokking 은 cleanup 의 지연" — 은 *algebraic 구조 + weight decay + AdamW* 의 conjunction 위에서만 깔끔하다. 이 conjunction 이 깨지는 도메인 (TS, vision, language modeling) 에서 grokking 이 같은 메커니즘을 가질지는 후속 연구의 몫.

---

## 4.B.5 핵심 한 문장 요약

Modular addition modulo prime $p$ 라는 task 는 *cyclic group character theory 가 transformer 의 bilinear architecture 와 정렬되는 가장 단순한 setup* 이며, 본 논문 전체 방법론은 이 정렬 위에서 작동한다. 이 task 자체가 강한 가설이다.

→ 다음 파일 `05_method_c_fourier_circuit.md` 에서 character theory 와 trig identity 의 회로적 구현을 수식으로 풀어낸다.
