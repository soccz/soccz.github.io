# 5.B 방법론 ② Gramian Angular Field (GASF · GADF)

## 5.B.1 이 부분이 왜 필요한가

1D 시계열 $X = (x_1, \ldots, x_n)$ 위에 *시간 짝 (time pair)* 의 *관계* 를 정의하려면 — 가장 단순한 방법이 *내적* $\langle x_i, x_j \rangle$ 이다. 그런데 각 $x_i$ 가 스칼라라 *내적* 이 그냥 $x_i x_j$ 가 되어 *비선형성* 이 없다. *비선형* 으로 들어 올리되 *해석 가능* 한 변환을 찾는 게 GAF 의 임무 — 그 답은 **polar 좌표 + cosine 의 덧셈 정리** 다.

## 5.B.2 단계 1 — 정규화 (rescale)

원 시계열 $X$ 를 $[-1, 1]$ 또는 $[0, 1]$ 로 정규화한 결과를 $\tilde{X} = (\tilde{x}_1, \ldots, \tilde{x}_n)$ 로 둔다. Min-max 정규화로:

$$\tilde{x}_i \;=\; \frac{(x_i - \max(X)) + (x_i - \min(X))}{\max(X) - \min(X)} \quad (\in [-1, 1])$$

또는 (imputation 용):

$$\tilde{x}_i^{[0,1]} \;=\; \frac{x_i - \min(X)}{\max(X) - \min(X)} \quad (\in [0, 1])$$

**4 줄 해석**:
- **기호 뜻**: $x_i$ 는 시점 $i$ 의 원 값, $\tilde{x}_i$ 는 정규화 값, $\max(X)/\min(X)$ 는 전체 시계열의 최대/최소.
- **일상 비유**: 사람들 키를 *가장 작은 사람 = -1, 가장 큰 사람 = +1* 로 재척하는 것. 절대값은 잊고 *상대적 위치* 만 남긴다.
- **왜 이 형태**: 다음 단계 $\arccos$ 가 *$[-1, 1]$ 의 입력만 받기 때문*. 그리고 $[-1, 1]$ scaling 이 *분류* 에는 충분하지만 *imputation* 에는 *부호 모호성* 때문에 $[0, 1]$ scaling 으로 다시 변환 (5.E 참조).
- **조심할 점**: 시계열에 *극단치 (outlier)* 가 있으면 $\max/\min$ 가 그쪽으로 끌려가서 *나머지 값들이 0 근처에 몰려* 정보가 사라진다. 본 논문은 outlier handling 을 명시 안 함 (본 환경 미확인).

## 5.B.3 단계 2 — 폴라 좌표 변환

정규화된 값 $\tilde{x}_i \in [-1, 1]$ 을 각도 $\phi_i \in [0, \pi]$ 와 반지름 $r_i \in \mathbb{R}^+$ 로 나눈다:

$$\begin{cases} \phi_i \;=\; \arccos(\tilde{x}_i), & \phi_i \in [0, \pi] \\[2pt] r_i \;=\; \dfrac{t_i}{N}, & r_i \in [0, 1] \end{cases}$$

여기서 $t_i$ 는 *시간 인덱스* (보통 $i$), $N$ 은 *정규화 상수* (보통 $n$ 또는 외부 인덱스가 표시한 $L$). $L$ 의 정확한 정의는 본 환경에서 *"L is scaling the temporal dimension but does not influence the final matrix"* (외부 인덱스 verbatim) 로만 확인.

**4 줄 해석**:
- **기호 뜻**: $\phi_i$ = 시점 $i$ 의 *각도* (단위: radian), $r_i$ = *반지름* (정규화된 시간), $\arccos$ = 코사인 역함수.
- **일상 비유**: 사람 키를 *시계 바늘의 각도* 로 바꾸는 것 — 가장 작은 키 (-1) 는 12 시 방향 ($\phi = \pi$), 가장 큰 키 (+1) 는 6 시 방향 ($\phi = 0$). 시간 순서는 *반지름* 으로 추가 — 첫 측정은 시계 중심에서 0 만큼, 마지막은 1 만큼 떨어진 점.
- **왜 이 형태**: $\arccos$ 가 *단사* 라서 (입력→출력 일대일), $\tilde{x} \leftrightarrow \phi$ 가 *역변환 가능*. 그리고 $r$ 이 시간 축을 *순서로만* 인코딩 (값 정보 없음) → 시간과 값이 *분리* 됨.
- **조심할 점**: $\arccos$ 가 $[-1, +1]$ 양쪽 끝에서 *미분 발산* (기울기 무한대). 즉 정규화 후 값이 ±1 근처일 때 $\phi$ 가 *작은 noise 에 민감*. 또 *$L$ 의 정확한 정의* 가 본문에 명시되는지는 본 환경 미확인 — 일부 외부 구현은 $L = N$ 으로, 일부는 $L = N$ 이 아닌 별도 hyperparameter 로 둔다.

## 5.B.4 단계 3-A — GASF (Gramian Angular Summation Field)

$n \times n$ 행렬 $G^{\text{S}} \in \mathbb{R}^{n \times n}$:

$$G^{\text{S}}_{ij} \;=\; \cos(\phi_i + \phi_j) \;=\; \tilde{x}_i\,\tilde{x}_j \;-\; \sqrt{1-\tilde{x}_i^2}\,\sqrt{1-\tilde{x}_j^2}$$

또는 행렬 형식:

$$G^{\text{S}} \;=\; \tilde{X}^\top \tilde{X} \;-\; \sqrt{I - \tilde{X}^\top \tilde{X}}\;\sqrt{I - \tilde{X}^\top \tilde{X}}$$

(여기서 $\tilde{X}$ 를 $1 \times n$ 행 벡터로 보고 $\sqrt{\cdot}$ 는 elementwise 인 단순 형식).

**4 줄 해석**:
- **기호 뜻**: $G^{\text{S}}_{ij}$ = 시점 $i$ 와 $j$ 의 *각도 합의 cosine*. 두 번째 등식은 *cosine 의 덧셈 정리* $\cos(\alpha + \beta) = \cos\alpha\cos\beta - \sin\alpha\sin\beta$ 를 $\cos\phi = \tilde{x}$, $\sin\phi = \sqrt{1 - \tilde{x}^2}$ 로 대입한 결과.
- **일상 비유**: 두 시점이 *유사할수록* ($\phi_i \approx \phi_j$ 이면 $\phi_i + \phi_j \approx 2\phi_i$) cosine 값이 *덜 변하고*, *정반대일수록* ($\phi_j = \pi - \phi_i$ 이면 $\phi_i + \phi_j = \pi$) cosine 이 $-1$. 즉 *유사도 + 대칭축 정보* 가 한 픽셀에 압축.
- **왜 이 형태**: *대칭성* $G^{\text{S}}_{ij} = G^{\text{S}}_{ji}$ → CNN 의 spatial locality 가정과 호환. *대각선 항* $G^{\text{S}}_{ii} = \cos(2\phi_i) = 2\tilde{x}_i^2 - 1$ → 각 시점의 *제곱* 정보가 그대로 보존 (bijection 의 핵심).
- **조심할 점**: $G^{\text{S}}$ 이 *positive semi-definite* 인지 ($\tilde{X}$ 의 외적 형식이라 *유사* 하지만 sin 차에 의해 약간 변형) 본 논문이 명시하는지 미확인. 또 $\sqrt{1 - \tilde{x}^2}$ 가 $\tilde{x} \in [-1, 1]$ 일 때 실수지만 *numerical noise* 로 $\tilde{x} = \pm 1$ 근처에서 $\sqrt{-\epsilon}$ NaN 위험 — 구현에서 clipping 필요.

## 5.B.5 단계 3-B — GADF (Gramian Angular Difference Field)

같은 폴라 좌표 위에서 *각도 차의 sine*:

$$G^{\text{D}}_{ij} \;=\; \sin(\phi_i - \phi_j) \;=\; \sqrt{1-\tilde{x}_i^2}\,\tilde{x}_j \;-\; \tilde{x}_i\,\sqrt{1-\tilde{x}_j^2}$$

**4 줄 해석**:
- **기호 뜻**: $G^{\text{D}}_{ij}$ = 시점 $i, j$ 의 *각도 차의 sine*. *sine 의 차 공식* $\sin(\alpha - \beta) = \sin\alpha\cos\beta - \cos\alpha\sin\beta$ 의 대입.
- **일상 비유**: GASF 가 "두 시점이 *얼마나 같은가*" 라면, GADF 는 "두 시점이 *어느 방향으로 얼마나 다른가*" — 즉 *부호 있는 차이*.
- **왜 이 형태**: *반대칭성* $G^{\text{D}}_{ij} = -G^{\text{D}}_{ji}$ → *시간 방향* (앞 vs 뒤) 의 *방향성* 정보가 인코딩. CNN 이 시간 방향의 *경향 (trend)* 패턴을 잡기 좋다.
- **조심할 점**: 반대칭 행렬은 *주대각선이 0* → 자기 정보를 *직접* 인코딩 안 함. GASF 와 *상보적* 으로 쓰지 않으면 자기 신호가 약하다. 그래서 본 논문은 두 인코딩의 RGB 결합을 권장.

## 5.B.6 단계 4 — PAA 차원 축소

시계열 길이 $n$ 이 크면 $n \times n$ 이 *quadratic 메모리·계산*. 본 논문은 **Piecewise Aggregate Approximation (PAA)** 으로 시계열을 길이 $m < n$ 으로 압축한 후 GAF 를 적용:

$$\bar{x}_k \;=\; \frac{m}{n} \sum_{j = \lfloor (k-1)\,n/m \rfloor + 1}^{\lfloor k\,n/m \rfloor} x_j, \quad k = 1, \ldots, m$$

(저자 GitHub Wiki 가 "PAA dimensionality" 옵션을 명시한 점으로 간접 확인.)

**4 줄 해석**:
- **기호 뜻**: $\bar{x}_k$ = $k$-번째 PAA 블록의 평균, $m$ = 압축 후 길이.
- **일상 비유**: 365 일치 키 기록을 *주별 평균* (52 주) 으로 줄이는 것. 일별 잡음은 사라지지만 주별 추세는 보존.
- **왜 이 형태**: *block-mean* 은 *비모수적 smoothing* — 윈도우 함수 선택의 자유도 없이 단순 평균. 학습 안정성 + 계산 효율의 균형.
- **조심할 점**: PAA 는 *고주파 정보를 모두 버린다* — 펄스 신호 (ECG R-peak 처럼 짧은 spike) 에서는 결정적 정보를 잃을 수 있다.

## 5.B.7 한 문장 정리

> "GAF 는 *polar 좌표 + 삼각 함수 합/차 공식* 이라는 *2 줄 수식* 으로 시계열을 *symmetric (GASF) + antisymmetric (GADF)* 한 쌍의 $n \times n$ 격자로 들어 올린다 — 그 격자는 *대각선에 자기 정보 · 모서리에 장기 lag · 부대각선에 단기 변화* 의 *해석 가능한 위치-의미 매핑* 을 갖는다."
