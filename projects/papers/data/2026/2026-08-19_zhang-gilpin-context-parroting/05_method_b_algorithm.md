# 4. 방법론 해부 (b) — Algorithm 1 한 줄씩

> **배경 사다리**: 이 절을 이해하려면 ① 아래첨자 표기 $x_{a:b}$ 가 "$a$ 번째부터 $b$ 번째까지의 값들을 묶은 덩어리"라는 것, ② 유클리드 거리가 "두 숫자 목록의 차이를 제곱해 더한 뒤 제곱근"이라는 것, ③ "argmin"이 "가장 작게 만드는 것을 고른다"는 뜻이라는 것만 알면 된다.

---

## 4b.1 이 부분이 왜 필요한가

논문 전체의 주장이 이 다섯 줄 위에 얹혀 있다. 만약 이 알고리즘에 숨은 튜닝(예: 시스템마다 다른 $D$, 여러 이웃의 평균, 후처리 스무딩)이 있다면 "파라미터 0개짜리 베이스라인"이라는 수사가 무너진다. 그래서 원문이 실제로 적은 것을 **그대로** 옮기고, **적지 않은 것**을 표시하는 게 이 파일의 목적이다.

## 4b.2 원문 Algorithm 1 (verbatim)

**캡션**: *"Context Parroting"*

**입력 (verbatim)**: *"Context trajectory $x_{1:L}=\{x_1,\dots,x_L\}$, embedding dimension $D$ (i.e., the length of the motif to match), and forecast length $H$."*

**출력 (verbatim)**: *"Forecast trajectory $x_{L+1:L+H}=\{x_{L+1},\dots,x_{L+H}\}$."*

**단계 (verbatim, 4줄)**:

1. *"for all length-$D$ motif $s$: $x_{s-D+1:s}$ in the context $x_{1:L-D}$ do"*
2. *"compute the Euclidean distance $d_s$ between motif $s$ and the last motif $x_{L-D+1:L}$"*
3. *"Find the best-matching motif, $s_{opt}$, with the smallest Euclidean distance"*
4. *"Set the first $L-s_{opt}$ predicted points to be $x_{L+1:2L-s_{opt}}=x_{s_{opt}+1:L}$ and repeat until the forecast length $H$ is reached"*

> **§4-bis 준수 메모**: §3 본문에는 **번호 붙은 디스플레이 수식이 없다.** 번호 붙은 식 (1)~(5) 는 Appendix F 에 있으며 [05_method_c_scaling_law.md](05_method_c_scaling_law.md) 에서 다룬다. 따라서 여기서 "식 (n)" 이라고 부를 수 있는 대상은 없고, **Algorithm 1** 이 방법의 정본 정의다.

## 4b.3 수식 4줄 해석

### 핵심 연산: $s_{opt} = \arg\min_{s} \; d_s, \qquad d_s = \left\| x_{s-D+1:s} - x_{L-D+1:L} \right\|_2$

**① 기호 뜻**
- $x_t$ : 시각 $t$ 의 관측값. 실험에서는 정규화된 무차원 값이며, 다변량인 경우 각 성분에 대해 같은 절차를 적용한다.
- $L$ : 문맥 길이 (단위: 데이터 점 개수). §5.1 실험에서는 모든 모델에 **512** 로 통일, Figure 3 에서는 **2000**.
- $D$ : 임베딩 차원 = 맞춰볼 모티프의 길이 (단위: 점 개수). §5.1 은 **$D=5$**, Figure 5 는 **$D=10$**.
- $H$ : 예측 지평 (단위: 점 개수).
- $s$ : 후보 모티프의 **끝 인덱스**. 후보 구간은 $x_{1:L-D}$ 안이므로 질의 모티프 자기 자신은 제외된다.
- $d_s$ : 질의 모티프와 후보 모티프 사이 유클리드 거리 (단위: 관측값과 같은 단위).
- $s_{opt}$ : $d_s$ 를 최소로 만드는 $s$.

**② 일상 비유**
낯선 골목에서 길을 잃었다고 하자. 스마트폰 앱은 지도를 계산하지 않는다. 대신 **당신이 방금 지나온 다섯 개의 랜드마크 순서**(질의 모티프)를 기억해 두고, 예전에 이 동네를 걸었던 기록 전체를 뒤져 **똑같은 다섯 랜드마크를 그 순서대로 지났던 날**을 찾는다. 찾았으면 그날 그 뒤에 어디로 갔는지를 그대로 알려준다. 지도도, 나침반도 필요 없다. **과거의 나 자신을 내비게이션으로 쓰는 것**이다.

**③ 왜 이 형태인가 (대안과 비교)**
- **대안 A: 마지막 한 점만 매칭($D=1$).** 값 하나만 같은 순간은 어트랙터 위에 여러 개 있고, 그 각각에서 미래는 전혀 다르다(예: Lorenz 에서 같은 $x$ 값이라도 올라가는 중이냐 내려가는 중이냐가 다르다). $D>1$ 로 **연속된 조각**을 맞추는 것이 곧 속도·가속도 정보를 암묵적으로 포함시키는 방법이며, 이것이 지연좌표 임베딩과 정확히 같은 논리다.
- **대안 B: $k$-최근접이웃 평균($k>1$).** 여러 이웃의 미래를 평균하면 분산은 줄지만, 카오스계에서 서로 다른 궤적을 평균하면 **진폭이 죽고 평균으로 수렴**한다 — 저자들이 TSFM 의 실패 모드라고 지목한 바로 그 현상이다. 즉 $k=1$ 은 게으름이 아니라 **의도된 선택**이다. Appendix F 는 이를 정확히 커널 폭 $\sigma \to 0$ 극한으로 형식화한다.
- **대안 C: 국소 선형 외삽(S-map/simplex).** 이웃 궤적들에 가중 회귀를 적합하면 정확도가 오를 수 있으나, **파라미터와 튜닝이 생긴다.** 베이스라인의 논증력은 단순함에서 나오므로 저자들은 이 길을 택하지 않고 Appendix F.3 에서 관계만 언급한다.
- **대안 D: DTW(동적 시간 워핑) 거리.** 시간축 신축을 허용하면 매칭은 좋아지지만 계산량이 폭증하고 "6자리 싼 베이스라인"이라는 장점이 사라진다.

**④ 조심할 점**
- **단계 4는 단순 복사가 아니라 "이어붙이기 반복"이다.** 원문은 예측의 첫 $L - s_{opt}$ 개 점을 $x_{s_{opt}+1:L}$ 로 채우고, $H$ 에 도달할 때까지 **반복**한다고 적는다. 즉 $s_{opt}$ 가 문맥 끝에 가까울수록 복사할 조각이 짧아지고, 그 짧은 조각이 계속 반복 재생된다. **이것이 Figure 3 이 인정한 "예측이 주기적"인 이유의 정체다.** 카오스의 비주기성은 구조적으로 재현될 수 없다.
- **$s_{opt}$ 는 문맥 끝 근처에서 뽑히면 위험하다.** 시간적으로 인접한 구간은 자기상관 때문에 자동으로 닮아 있다(궤적이 아직 갈라지지 않았을 뿐). Theiler window(시간적으로 너무 가까운 이웃 배제) 같은 표준 방어가 동역학 문헌에는 있는데, **원문 Algorithm 1 에는 그런 배제 규칙이 명시되지 않는다.** 후보 구간이 $x_{1:L-D}$ 로만 제한된다는 것 외에는 확인되지 않았다.
- **거리가 "가장 작다"는 것이 "충분히 작다"를 뜻하지 않는다.** 문맥이 짧거나 어트랙터 차원이 높으면 최근접이웃도 멀 수 있다. 알고리즘에는 **"이웃이 너무 멀면 기권한다"는 임계값이 없다.** 그래서 parroting 은 항상 자신 있게 답을 내놓는다 — 근거가 없을 때도.

## 4b.4 임베딩 차원 $D$ 의 지위

원문 §3 verbatim: *"the last $D$ tokens of the context to query the remaining context... the embedding dimension and will use the terms embedding dimension and query length interchangeably."*

즉 $D$ 는 **알고리즘의 유일한 하이퍼파라미터**다. 그리고 저자들은 이 하나마저 무력화하려 한다. Appendix C verbatim: *"the valid prediction time stays consistent over a wide range of embedding dimension $D$. For short context windows, there is a slight advantage to small $D$. For long context windows, larger embedding dimensions are marginally better."*

이 문장은 두 가지를 동시에 한다. **방어**로는 "결과가 $D$ 튜닝의 산물이 아니다"를 확보하고, **설명**으로는 "긴 문맥일수록 큰 $D$ 가 유리하다"는 기하학적 직관(문맥이 길면 더 긴 모티프도 재방문된다)을 확인해 준다. 다만 원문에서 확인한 범위에서 Appendix C 는 **정성적 서술**이며, 구체적으로 어떤 $D$ 값들을 스윕했는지 목록은 이 해체에서 단정하지 않는다(위치 확인 불가).

## 4b.5 이 파일의 핵심 한 문장

**Algorithm 1 은 하이퍼파라미터가 $D$ 하나뿐인 1-최근접이웃 복사기이며, 그 단순함이 곧 논증력이지만 동시에 세 개의 구조적 약점(주기적 출력·시간 인접 이웃 미배제·기권 임계값 부재)을 대가로 지불한다.**
