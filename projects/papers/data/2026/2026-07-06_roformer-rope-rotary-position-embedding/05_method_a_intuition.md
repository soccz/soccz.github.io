# 05.a 방법론 — 큰 그림 (Intuition)

## 배경 사다리

이 절을 이해하려면 ① 회전 (rotation) 이 "벡터의 크기는 그대로 두고 방향만 바꾸는 선형 변환" 이라는 것, ② 2 차원 회전 행렬 $\begin{pmatrix}\cos\theta & -\sin\theta \\ \sin\theta & \cos\theta\end{pmatrix}$ 이 원점 중심으로 각도 $\theta$ 만큼 반시계 방향 회전한다는 것, ③ 이 회전들은 각도의 합으로 합성된다 ($R(\theta_1) R(\theta_2) = R(\theta_1 + \theta_2)$) — 세 사실만 알면 된다.

## 전체 흐름 다이어그램 (지문)

```
             원본 임베딩 x_m ∈ ℝ^d
                      │
                      ▼
             W_q · x_m = q  (query)  ← 위치 무관 projection
             W_k · x_m = k  (key)    ← 위치 무관 projection
                      │
                      ▼
      ┌───────────────┴────────────────┐
      │   d 를 2 씩 쪼갠 d/2 개 부분 공간   │
      │   각 부분 공간마다 회전 각도 θ_i    │
      │   최종 회전각 = m · θ_i           │
      └───────────────┬────────────────┘
                      │
                      ▼
     R_{Θ,m} · q = [ 회전된 query ]      ← 상대위치 정보를 벡터 안에 심음
     R_{Θ,n} · k = [ 회전된 key   ]
                      │
                      ▼
     내적 = (R_{Θ,m} q)^T (R_{Θ,n} k)
          = q^T R_{Θ,m-n}^T k  ← 절대위치 소거, 상대위치만 남음
                      │
                      ▼
             softmax → attention weight
```

## 발상의 요점

세 발걸음으로 요약된다.

**발걸음 1 — 문제 재정식화 (funciton form 검색)**
"attention score 가 두 토큰의 상대 위치에만 의존" 이라는 요구를 **함수 형태를 결정하는 조건** 으로 옮긴다. 즉 $\langle f_q(x_m, m), f_k(x_n, n)\rangle = g(x_m, x_n, m-n)$ 를 강제하고, 어떤 $f_q, f_k$ 가 이 조건의 해인지를 묻는다. 이는 "attention 에 위치 정보를 어떻게 넣을까" 라는 질문을 "위치와 벡터를 결합하는 함수의 대칭성" 문제로 재구성한 것 — 논문의 진짜 기여는 이 시각 자체.

**발걸음 2 — 2 차원 케이스에서의 답 (복소수 회전)**
$d=2$ 인 경우 벡터 $q \in \mathbb{R}^2$ 를 복소수 $q = q^{(1)} + i q^{(2)}$ 로 보고, $f_q(x_m, m) = q_m e^{i m\theta}$ 라고 두면 $\langle f_q, f_k \rangle = \mathrm{Re}(q_m \bar{k}_n e^{i(m-n)\theta}) = g(m-n)$ 형태로 축약된다. 즉 벡터를 위치 $m$ 에 비례한 각도로 회전시키면 답이 된다. 이 유도가 논문의 미학적 정점.

**발걸음 3 — d 차원으로 블록대각 확장**
d 차원 벡터를 d/2 개의 2 차원 블록으로 쪼개고, 각 블록마다 다른 주파수 $\theta_i$ 로 회전한다. 최종 회전 행렬은 블록대각 (block-diagonal) $R^d_{\Theta,m} = \mathrm{diag}(R(m\theta_1), R(m\theta_2), \ldots, R(m\theta_{d/2}))$ 형태. 다양한 주파수를 겹치면 감쇠 성질과 표현력을 동시에 얻는다.

## 이 발상이 왜 우아한가

1. **파라미터 0 개**: 회전 행렬은 주파수 $\theta_i$ 만 결정하면 되고, 저자는 이를 sinusoidal PE 의 spectrum ($10000^{-2(i-1)/d}$) 으로 고정. 학습 대상 아님. Learnable Absolute PE, T5-relative bias, Transformer-XL relative embedding 모두 파라미터를 요구했던 것과 대조.
2. **Attention 내적 구조 유지**: 회전은 orthogonal 이라 norm 을 보존하고 attention 로짓의 스케일이 흐트러지지 않는다. Additive relative bias 는 로짓 크기를 별도 조정해야 했다.
3. **Linear attention 과 자연 결합**: 회전은 **곱셈** 이라 kernel feature $\phi$ 앞에 회전을 곱하면 $\phi(R q)$ 형태로 자연스럽게 들어간다. Additive bias 는 softmax 로짓에 덧셈이라 kernel 분해와 충돌.
4. **길이 확장성**: 학습 시 안 본 위치 $m > L_\text{train}$ 도 그저 $m\theta_i$ 라는 각도만 만들면 된다 — 새 벡터 학습 필요 없음.

## 조심할 점 (이 발상의 취약점 예고)

- **주파수 스펙트럼 고정**: $\theta_i = 10000^{-2(i-1)/d}$ 는 sinusoidal 유산으로 가정된 것이지 데이터에서 나온 것이 아님. Frontiers 2025 등 후속 연구가 이 고정 값을 문제 삼음.
- **감쇠는 양면성**: 저자는 이를 "long-range dependency 완화" 라는 이점으로 서술하나, 시계열이나 코드처럼 실제로 먼 토큰 정보가 필요한 상황에서는 오히려 발목잡힘.
- **Extrapolation 한계**: 학습 최대 길이를 넘는 위치 확장은 "새 각도만 만들면 되니 자유롭다" 는 이론적 주장이지만, 실제 학습된 attention 은 학습 위치 범위에 최적화되어 있어 그 밖의 각도에서는 잘 안 됨. 이는 후속 NTK-scaling, YaRN, LongRoPE 시리즈의 존재 이유.

이제 다음 두 파일 (`05_method_b`, `05_method_c`) 에서 2 차원 유도와 d 차원 확장을 수식으로 뜯고, `05_method_d` 에서 linear attention 결합을 본다.
