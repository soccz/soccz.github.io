# 02. 3층 TL;DR

## 🧒 초등학생 수준 (약 500자)

기차 안에서 승객끼리 서로 이야기를 나눈다고 하자. 어른들은 이 승객들이 "몇 호차 몇 번 좌석에 앉아 있는지" 를 정확히 알아야 대화가 자연스러울 거라고 생각했다. 그래서 옛날 방식은 승객 이마에 "3 호차 5 번" 같은 스티커를 붙여줬다. 그런데 문제는, 5 호차와 7 호차가 얼마나 떨어져 있는지를 매번 뺄셈으로 다시 계산해야 하는 것이다.

이 논문의 아이디어는 이렇다. **승객마다 다른 방향으로 몸을 살짝씩 돌려 앉히자.** 예를 들어 1 번 좌석 승객은 정면, 2 번은 오른쪽으로 10 도, 3 번은 20 도, 이렇게 좌석 번호에 비례해서 몸을 돌린다. 그러면 두 승객이 서로 마주 보기 위해 얼마나 몸을 더 돌려야 하는지 — 즉 두 사람의 "각도 차이" — 만 계산하면, 그것이 자연스럽게 "몇 좌석 떨어져 있는지" 를 알려주게 된다.

트랜스포머라는 AI 는 문장 속 단어들끼리 "얼마나 관련 있는지" 를 계산할 때 두 단어의 정보를 곱해서 더한다. 이 논문은 단어 정보에 좌석 스티커를 붙이는 대신 **좌석 번호에 비례해 벡터를 회전**시킨다. 그러면 곱셈 결과에 "몇 번째 단어와 몇 번째 단어의 상대적 거리" 만 자동으로 남는다. 스티커도 없고, 뺄셈도 없다. 회전 한 번이면 끝이다.

## 🎓 학부생 수준 (약 800자)

트랜스포머의 self-attention 은 query 벡터 $q$ 와 key 벡터 $k$ 의 내적으로 두 토큰 간 관련도를 측정한다. 그런데 attention 은 순서를 모른다 — 단어 순서를 뒤섞어도 결과가 같아 버린다. 이를 해결하는 것이 **위치 임베딩(Positional Embedding, PE)** 이다. 원조 Transformer (Vaswani 2017) 는 sinusoidal 파형을 벡터에 **더했고**, BERT 는 학습 가능한 벡터를 더했다. 두 방식 모두 "절대 위치를 벡터에 색칠" 하는 방식이라 상대 위치 정보는 모델이 알아서 뽑아내야 했다.

RoPE 의 발상은 다르다. 위치를 벡터에 **더하는 대신, 벡터를 회전시킨다**. 정확히 말해 위치 $m$ 에서의 query $q_m$ 을 얻으려면 원본 벡터에 회전 행렬 $R_{\Theta,m}$ 을 곱한다. 이 회전 행렬은 2 차원 부분 공간마다 각도 $m\theta_i$ 만큼 회전시키는 블록으로 이루어져 있고, 주파수 $\theta_i = 10000^{-2(i-1)/d}$ 는 원조 sinusoidal 스펙트럼을 그대로 물려받았다.

핵심은 내적 항등식이다:
$$\langle R_{\Theta,m} q,\ R_{\Theta,n} k \rangle = q^T R_{\Theta,n-m} k$$

즉 위치 $m$ 의 query 와 위치 $n$ 의 key 를 내적하면 결과가 **오직 상대 거리** $n-m$ 에만 의존한다. 절대 위치는 회전을 통해 서로 상쇄되고 상대 위치만 살아남는다. Rotation 은 orthogonal (norm 보존) 이라 벡터 크기가 흐트러지지 않는다. 게다가 두 벡터를 회전시킨 뒤 내적하면 원본 query·key 를 상대각도로만 회전시킨 결과와 같으므로, **linear attention (Performer 계열)** 처럼 커널 $\phi(q)\phi(k)$ 형태로 분해된 attention 에도 상대위치를 삽입할 수 있다. Sinusoidal 이나 Learned PE 로는 안 되던 조합이다.

## 🔬 전문가 수준 (약 900자)

주요 기여 4 개:

1. **위치 → 회전 사상 (contribution 1)**: attention score $f_q(x_m, m)^T f_k(x_n, n) = g(x_m, x_n, m-n)$ 를 만족하는 최소 함수 형태로 회전 행렬 $R^d_{\Theta,m}$ 을 유도. 저자는 이를 2 차원 케이스에서 복소수 표현 $f_q(x_m, m) = q_m e^{i m\theta}$ 로 우아하게 시작해 d 차원 블록대각으로 확장한다. 이 유도는 sinusoidal PE 를 "가법적 회전 근사" 로 재해석하는 재구성이기도 하다.

2. **상대위치의 완전 무비용 흡수**: query·key 를 각각 위치별 회전한 뒤 내적하면 상대위치 회전만 남고 절대위치가 자동 소거된다. 이는 T5-style relative bias 처럼 attention 로짓에 항을 **더하는** 방식과 달리 **곱해서 회수** — bucket-scalar table 이나 additional parameter 없이 (θ 는 hyperparameter, 학습 대상 아님) 상대위치 attention 을 얻는다.

3. **감쇠 성질 (long-range decay)**: 인접 토큰끼리는 회전각 차이가 작아 내적이 크고, 멀어질수록 회전각이 커져 서로 다른 주파수 성분들이 상쇄 간섭 (destructive interference) 을 일으켜 내적이 감쇠한다. 저자는 이를 실선 그래프로 시각화 (원문 Figure 근처) 하며 sinusoidal PE·learned PE 와 대조.

4. **선형 attention 결합 가능성**: kernel 형태 $\phi(R q)^T \phi(R k)$ 이 $\phi(q)^T R^T R \phi(k)$ 형태를 유지하지 못하는 것을 감안, 저자는 Performer 계열 kernel feature $\phi$ 앞에 회전을 적용해 상대위치 정보를 보존하는 정식화를 제시. 실험적으로 Performer+RoPE 가 vanilla Performer 보다 빠른 수렴과 낮은 학습 손실을 달성. 이 조합은 이후 EfficientNet-Attn·Linformer 계열과의 정착점이 된다.

방어 가능한 이론적 기여는 (1)-(2), 실증적 기여는 (3)-(4). 한계는 (i) 회전 주파수 스펙트럼이 sinusoidal 유산을 그대로 물려받아 hyperparameter 로 고정 — 학습 데이터에 최적화 안 됨, (ii) 감쇠 시각화가 랜덤 벡터 가정 하 기대치 계산이라 학습된 모델 실제 attention 곡선과 어긋날 여지, (iii) 원 논문 실험이 short-context (WMT / GLUE ≤512 토큰) 중심이라 long-context extrapolation 은 후속 연구 (NTK-scaling, YaRN, LongRoPE) 로 넘어감.
