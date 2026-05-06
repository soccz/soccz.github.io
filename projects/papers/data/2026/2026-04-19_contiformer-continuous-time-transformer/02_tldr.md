## 1. 3층 TL;DR

### 🧒 초등학생용

수업시간에 친구들이 말한 시각이 5분, 7분, 23분처럼 들쭉날쭉하다고 해보자. 보통 컴퓨터는 "1분, 2분, 3분"처럼 똑같은 간격으로 줄 세워야 잘 듣는다. ContiFormer는 친구들이 **언제** 말했는지를 시계로 그대로 기억한다. 그리고 "1분 30초에는 어떤 분위기였을까?"처럼 **아무 시각에나** 끼어들어도 답을 만들어낸다. 비결은 "변화의 속도"를 가르치는 부드러운 곡선(Neural ODE) 위에 옛날 트랜스포머의 "누구 말을 더 들을지" 고르는 능력을 얹은 것이다.

### 🎓 학부생용

문제: 의료·금융처럼 **관측 시각이 불규칙한 시계열**(irregular time series)에서, 기존 RNN은 등간격 가정에 묶여 있고, Neural ODE 계열은 시계열 내부의 장거리 상관을 잘 못 잡는다. Transformer는 강력하지만 인덱스 기반이라 시각 자체가 정보로 흐르지 않는다. ContiFormer는 입력 $\{(t_i, x_i)\}$를 받아, 각 토큰의 hidden state를 **Neural ODE로 연속화**한 뒤 ($z_i(t) = z_i(t_i) + \int_{t_i}^t f_\theta(z_i(s), s)\,ds$), 임의의 query 시각 $t$에 대해 연속시간 attention $\sum_i \hat\alpha_i(t)\,\hat v_i(t)$ 를 정의한다. 결과적으로 attention score 자체가 $t$의 함수가 되며, 이를 시간에 대해 적분/평가해 출력한다. 합성 데이터·PhysioNet·Human Activity·금융 시계열에서 mTAND, Latent ODE, Neural CDE, vanilla Transformer를 일관되게 능가한다.

### 🔬 전문가용

**Contribution**: (i) Transformer의 attention을 연속시간 영역으로 확장하는 통일된 정식화 — keys/values를 ODE 궤적 $k_i(t), v_i(t)$로 lift, query는 시각 $t$의 연속함수, attention score를 $t$의 함수 $\hat\alpha_i(t)$로 정의. (ii) 표현력 정리: mTAND·Neural ODE·discrete Transformer 등 다수의 비정규 시계열 모델이 ContiFormer의 **특수해**(specific choice of vector field와 query interpolation scheme)로 환원됨을 명시. (iii) interpolation·classification·prediction 세 task에서 일관 우위. **방어 가능한 핵심 주장**: "irregular time series에서 inter-token relation을 시간 자체의 함수로 모델링하면, 시간을 단순 feature로 주입한 모든 변형(time embedding, relative time bias, mTAND의 query-time MHA)이 표현력의 부분집합이 된다." **숨은 비용**: 매 forward마다 ODE solve가 들어가 속도/메모리가 $O(N \cdot \text{NFE})$ 추가. attention 자체도 시간 적분이라 quadrature 비용까지 곱해진다.
