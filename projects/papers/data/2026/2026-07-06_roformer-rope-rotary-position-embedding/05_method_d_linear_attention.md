# 05.d 방법론 — 선형 Attention 과의 결합

## 왜 선형 attention 과 결합해야 하는가

원조 self-attention 은 시퀀스 길이 $L$ 에 대해 $O(L^2 d)$ 의 계산·메모리를 요구한다. $L$ 이 4k, 8k, 32k 로 커지면 실용상 무리. 이를 해결하려는 흐름이 **linear attention** — attention 을 kernel 곱으로 근사해 $O(L d^2)$ 로 낮추는 계열 (Performer, Linear Transformer, Linformer).

RoPE 가 이 흐름과 결합 가능하다면 (i) 상대위치 + (ii) 계산 효율의 두 이점을 동시에 얻는다. RoPE 의 곱셈적 (multiplicative) 구조가 kernel-form 과 자연스럽게 붙는다는 것이 저자의 실증적 발견.

## 배경 사다리

- Softmax attention: $\mathrm{Att}(Q, K, V) = \mathrm{softmax}(QK^T/\sqrt{d}) V$. Softmax 는 열 정규화라 $O(L^2)$ 를 피할 수 없음.
- Linear attention (Katharopoulos 2020, Performer 2021): softmax 를 kernel $k(q, k) = \phi(q)^T \phi(k)$ 로 근사. 그러면 $\mathrm{Att} \approx \phi(Q) (\phi(K)^T V)$ 로 재정렬되어 $O(L d^2)$ 로 감쇠.
- Performer 의 kernel feature $\phi$ 는 확률적 (random feature) 이며 softmax 를 정확히는 아니지만 unbiased estimator 로 근사.

## 상대위치 방식들의 kernel-form 결합 가능성 비교

| 상대위치 방식 | 곱셈적/덧셈적 | Kernel 결합 |
|-------------|--------------|-----------|
| Additive T5-relative bias $r_{n-m}$ | 덧셈 (attention 로짓에 더함) | ❌ softmax 로짓 안이라 $\phi$ 로 분해 불가 |
| Learnable Relative Embedding (Shaw) | 덧셈 | ❌ 같은 이유 |
| Transformer-XL 상대 벡터 분해 | 부분 곱셈 (일부 항) | 부분적 (특정 조건에서) |
| RoPE 회전 | 곱셈 (벡터 앞에 곱) | ✅ $\phi(R q)$ 형태로 자연 결합 |

RoPE 의 이점은 kernel feature 계산 **전** 에 회전을 적용해도 여전히 상대위치 정보가 보존된다는 것.

## RoPE + Linear attention 결합 형식

일반 linear attention 은:

$$\mathrm{Att}_\text{linear}(Q, K, V)_m = \frac{\sum_{n=1}^{L} \phi(q_m)^T \phi(k_n) \cdot v_n}{\sum_{n=1}^{L} \phi(q_m)^T \phi(k_n)}$$

RoPE 를 씌우면 $q_m \to R_{\Theta,m} q_m$, $k_n \to R_{\Theta,n} k_n$ 으로 대체:

$$\phi(R_{\Theta,m} q_m)^T \phi(R_{\Theta,n} k_n) \tag{11}$$

- **기호 뜻**: $\phi$ 는 kernel feature 함수 (예: Performer 의 random ReLU feature 또는 positive random feature).
- **일상 비유**: "먼저 벡터를 위치에 맞게 돌린 다음, 그 위에 kernel 필터를 씌운다." 회전은 벡터의 기하학을 손대는 것이고, kernel 은 그 기하학의 특정 조각을 뽑는 것.
- **왜 이 형태**: RoPE 는 orthogonal 변환이라 벡터 norm 을 보존, 대부분 kernel $\phi$ 가 rotation-invariant (예: Gaussian kernel) 이면 $\phi(R q)^T \phi(R k) \approx \phi(q)^T \phi(k)$ 가 되어 상대위치 정보가 손실되지 않고 kernel product 로 통과. 저자는 이를 정성적으로 검증.
- **조심할 점**: (i) 일반 $\phi$ 가 정확히 rotation-invariant 인 경우는 제한적. Performer 의 positive random feature 는 근사적으로만 성립. (ii) 회전 후 kernel 근사 오차 분석이 원 논문에서 완결되지 않았다 — 후속 정리·이론이 필요.

## 실용상 대안 형식

저자는 (11) 을 그대로 쓰기보다 근사 안정성을 위해 다음 절충안을 제시:

$$\mathrm{Att}_\text{RoPE+linear}(Q, K, V)_m = \frac{\sum_n R_{\Theta,m}^T R_{\Theta,n} \phi(q_m)^T \phi(k_n) v_n}{\sum_n \phi(q_m)^T \phi(k_n)}$$

여기서 상대위치 회전 $R_{\Theta,n-m}$ 이 attention weight 자리에 들어가 (분자 kernel 곱과 결합), 분모는 순수 kernel 곱으로 유지. 이는 정확한 등가는 아니고 저자가 실용상 채택한 근사 정식화.

## 실증 결과 (원문 §4.4 Enwik8 실험)

- Vanilla Performer 대비 Performer + RoPE 는 학습 손실이 더 빨리 감소하고 최종 값이 더 낮음 (WebSearch verbatim: "yielded faster convergence and lower training loss").
- 이는 RoPE 의 상대위치 정보 주입이 순수 content-only kernel 근사보다 더 풍부한 signal 을 제공한다는 실증적 근거.
- 원문 Figure (loss curve) 의 정확한 좌표·수치는 본문 PDF 차단으로 미확인.

## Linear attention 결합의 한계

- **Kernel feature 오차**: $\phi$ 가 random projection 이면 회전 후 근사 오차가 회전에 따라 달라질 수 있는데, 원 논문은 이 오차 상한 계산을 안 함.
- **Softmax 대비 표현력**: linear attention 자체가 softmax attention 대비 표현력이 약함 (특히 low-entropy attention pattern 을 잘 표현 못함) — RoPE 를 씌워도 근본 한계는 남음.
- **Long context 에서의 감쇠 문제**: RoPE 의 감쇠 성질 (§05.c) 이 linear attention 에서는 더 심하게 작용해 매우 긴 문맥에서 정보 손실이 커질 수 있다.

## 이 방법론 파트의 통합 요약

- RoPE 의 이론적 심장은 **"위치 = 벡터의 회전"** 이라는 곱셈적 재정식화 (§05.b).
- d 차원 확장은 블록대각 + sinusoidal 스펙트럼 유산 (§05.c).
- Linear attention 결합은 곱셈적 구조의 자연스러운 부산물 (§05.d).

이 세 층이 얹어져 RoPE 는 "파라미터 0 개 상대위치 + orthogonal norm 보존 + kernel-form 호환" 이라는 세 이점의 교집합을 얻는다. Additive relative bias 계열이 갖지 못한 성질들이며, 이후 오픈 LLM 표준이 된 이유.
