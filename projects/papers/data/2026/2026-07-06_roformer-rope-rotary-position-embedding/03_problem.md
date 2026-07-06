# 03. 문제 지형도 — 트랜스포머의 "순서 감각" 문제

## 배경 사다리

이 절을 이해하려면 ① self-attention 이 "query 벡터 · key 벡터의 내적으로 두 토큰의 관련도를 재는 연산" 이라는 것, ② 그 내적은 두 벡터의 순서를 몰라 순열 대칭 (permutation-symmetric) 이라는 것, ③ 그래서 순서 정보를 인위적으로 주입해야 한다는 것 — 이 세 가지만 알면 된다.

## 실제로 어떤 상황에서 위치 임베딩이 문제가 되는가

**상황 1 — 긴 법률 문서 대조**: 두 계약서의 조항을 대조해서 유사도를 판정할 때 (원 논문의 CAIL2019-SCM 은 이 태스크), 문서가 512 토큰을 넘어가면 학습된 절대 위치 임베딩은 안 본 영역의 위치를 처리하지 못한다. 학습 때 512 개 좌표만 배웠는데 시험 때 800 번째 토큰이 나타나면 모델은 "800 번째" 라는 벡터가 없어 당황한다. **위치 확장성 (length extrapolation) 문제.**

**상황 2 — 번역**: WMT2014 En-De 처럼 한 문장 안에서 "The red car" 와 "The car red" 를 다르게 번역해야 하는 상황. attention 은 이 셋의 순서를 모르므로 위치 정보가 없다면 세 순열이 같은 표현을 얻어 결국 같은 번역이 나온다. 절대 위치를 강제로 색칠하면 되지만, 그럼 "red 다음 car" 라는 **상대적** 패턴이 학습 초반에는 잘 안 잡힌다 — 모델이 두 절대 위치를 상대 위치로 변환하는 함수를 스스로 배워야 하기 때문.

**상황 3 — 시계열 예측**: (사용자 관심 영역) 주식 tick 데이터를 512 창으로 잘라 예측할 때, 어제 종가와 오늘 종가의 attention 관계는 "1 스텝 상대 거리" 로만 결정되어야지 절대 시각 (몇 번째 tick 인지) 에 의존해서는 안 된다. 그런데 sinusoidal PE 는 절대 위치를 값으로 심으므로 모델이 상대성을 스스로 발굴해야 한다.

이 세 상황의 공통 요구는 하나다 — **"attention score 는 두 토큰의 상대 거리에만 의존해야 한다"**.

## 기존 접근 계보

### 1. Sinusoidal PE (Vaswani 2017)

원조 Transformer 는 위치 $m$ 에서 벡터 $x_m$ 에 sinusoidal 파형 $[\sin(m\theta_1), \cos(m\theta_1), \sin(m\theta_2), \cos(m\theta_2), \ldots]$ 을 **더한다**. $\theta_i = 10000^{-2i/d}$ 로 다양한 파장을 갖는다. 발상은 "삼각함수 합공식 $\sin(m+n) = \sin m \cos n + \cos m \sin n$ 이 상대 위치 정보를 자연스럽게 담을 수 있다" 였다. 그러나 **덧셈** 은 attention 내적에서 $q^T k = (x_m + p_m)^T (x_n + p_n) = x_m^T x_n + x_m^T p_n + p_m^T x_n + p_m^T p_n$ 로 풀리고, 이 중 상대 위치만 남기려면 후자 세 항이 특정 형태여야 하는데 그럴 이유가 이론적으로 없다. 실제로 sinusoidal PE 는 상대성을 부분적으로만 담고 있다는 것이 (Yun 2020 등) 후속 분석의 결론.

### 2. Learned Absolute PE (BERT, GPT-1/2)

BERT 는 위치별로 학습 가능한 벡터를 룩업 테이블로 두었다. sinusoidal 보다 자유도가 크다는 장점이 있지만, **본 적 없는 위치는 벡터가 없다** — 학습 최대 길이가 실운영 최대 길이의 상한이 된다. 이는 상황 1 의 정확한 원인이다.

### 3. Relative PE bias (Shaw 2018, T5)

Shaw 등은 attention score 에 상대 위치별 학습 가능한 스칼라 $r_{n-m}$ 을 **더하는** 방식을 제안. T5 는 이를 bucket 화해 파라미터 수를 줄였다. 명시적으로 상대성을 담으므로 상황 1·2 의 한계는 해결. 그러나 (i) additional attention bias 파라미터가 필요하고, (ii) attention 로짓에 더해지는 항이라 linear attention (내적 대신 kernel product 로 분해) 과는 결합이 어렵다. Kazemnejad 2023 이 정리했듯 T5-relative 는 length-generalization 관점에서 sinusoidal 보다는 나으나 NoPE 에는 못 미치는 애매한 위치.

### 4. Content-conditioned relative PE (Transformer-XL, XLNet)

Dai 등은 상대 위치 벡터를 학습해 attention decomposition 에 삽입하는 방식을 제안. 이는 "content-based" 와 "position-based" 항을 분리해 별도 학습. Transformer-XL 은 이 방식으로 초기의 recurrent context 확장을 성공시켰다. 한계는 (i) 두 가지 벡터 (content / position) 를 별도 관리해야 하는 복잡도, (ii) 이 상대 벡터가 attention 로짓에 additive 로 들어가 linear attention 과 결합 불가.

### 5. Rotary / Complex Number 시도 (개별 파편)

RoPE 이전에도 위치를 회전/복소수로 표현하려는 시도가 있었다. 예: complex embedding 계열 (Wang & Chen 2019), Roformer 이전의 Su 자신의 블로그 노트. 이들은 (i) 부분적 rotation, (ii) attention 재정식화 없이 embedding 만 회전, 이라 상대위치의 dot-product 항등식을 완성하지 못했다.

## 기존 방법이 공통으로 놓친 gap

**"attention score 가 상대 거리에만 의존해야 한다" 는 요구를 (1) 별도 파라미터 없이, (2) attention 내적 구조 안에서, (3) linear attention 과도 결합 가능하게 만족시키는 함수 형태를 아무도 유도하지 않았다.** 기존 방법은 (a) additive relative bias 로 상대성을 넣거나 (Shaw/T5, +파라미터), (b) sinusoidal 로 상대성이 "잘 흡수될 것" 이라고 희망 (Vaswani, 실패), (c) content/position 분리 (TXL, 복잡도) 로 우회했다.

## RoFormer 의 gap 메우기 요약

RoFormer 는 이 gap 을 **한 문장의 등식**으로 요약한다:

$$\langle f_q(x_m, m),\ f_k(x_n, n) \rangle = g(x_m, x_n, m-n)$$

이 등식이 되는 $f_q, f_k$ 의 최소 형태를 찾아 들어가면 자연스럽게 회전 함수 $f_q(x_m, m) = R_{\Theta,m} W_q x_m$ 가 나온다는 것이 유도의 골자다 (다음 §4·§5 에서 자세히). 회전은 orthogonal 이라 norm 을 보존하고, 회전 각도만 위치에 따라 늘어나므로 두 회전을 겹치면 상대각도 회전 하나로 축약된다. **파라미터 0 개, attention 내적 구조 유지, kernel-form 과 자연 결합** — 세 요구가 동시에 충족된다.
