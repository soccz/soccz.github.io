# 9. 사고 확장

## 9.1 스스로에게 던질 질문 5개

### Q1. "시간 변수를 학습 가능하게 만들면 Theorem 4.1·4.2가 여전히 성립하는가?"

내가 Paper 4에서 $\tau(t)$를 학습 가능 함수로 두면, "Transformer·Neural ODE 포함관계" 증명이 자동으로 유지되는지 비자명. $\tau$가 identity로 학습되어야 ContiFormer가 복원되므로, **학습 시 $\tau$에 identity prior 혹은 regularization이 필요**할 수 있다. 이 질문에 대한 답이 Paper 4의 수학 §의 절반을 차지할 것으로 예상.

### Q2. "ContiFormer의 per-segment ODE reset 구조가 volatility clustering을 어떻게 처리하는가?"

reset은 "새 관측마다 초기화"인데, 관측이 클러스터로 몰리면 reset이 자주 발생하고, 가뭄 구간에서는 ODE가 길게 돈다. 이 비대칭이 volatility clustering 패턴을 대체 표현하는지, 아니면 단지 관측 밀도를 반영하는지 분해가 필요. **Clark의 subordination 관점에서 보면 이 reset 빈도 자체가 $\tau$의 증가율**에 해당할 수도 있다. 흥미로운 동치 가능성.

### Q3. "causal mask + ODE integration의 상호작용은 안전한가?"

causal 모드에서 $\tilde t_i = \min(t, t_i)$인데, 이는 ODE 경로를 $(t_{i-1}, t_i]$ 구간이 아니라 $(t_{i-1}, \tilde t_i]$로 잘라야 정확하다. 구현이 이를 정확히 하고 있는지 확인 필요. 만약 내가 Paper 4에서 **금융 real-time 예측**을 하려면, 이 지점이 information leakage의 원천이 될 수 있다.

### Q4. "왜 Query만 InterpLinear인가?"의 진짜 답은?

저자가 학술적 근거로 제시하지 않았지만, 가능한 실무적 이유는: (a) Query 쪽 ODE를 추가하면 계산 비용 2배, (b) attention의 "관점" 역할을 Query가 해야 하므로 과거 dependency를 주는 건 semantic 중복. **(c)** 가장 중요한 의심: Q에 ODE를 더 했을 때 **실제 실험 결과가 나빴을 것** — negative ablation을 숨기고 있을 수 있다. 내가 직접 실험해 볼 가치.

### Q5. "이 논문의 성공이 'irregular sampling의 어려움이 실은 별 게 아니었다'는 방향으로 해석될 위험은?"

ContiFormer가 거의 모든 데이터셋에서 이긴다는 사실은 "irregular sampling이 그냥 더 복잡한 모델을 넣으면 해결된다"는 반학문적 결론을 유도할 수 있다. 반대로 해석해야 할 지점: **"문제는 특정 도메인에서는 이 수준의 구조로도 해결되지만, 금융처럼 구조 자체가 다른 도메인에서는 다른 해법이 필요하다"** 는 방향. 이것이 Paper 4의 독자 설득 논거.

## 9.2 Follow-up 논문 3편 (선행 1 / 경쟁 1 / 후속 1)

### 선행: Neural CDE (Kidger et al., NeurIPS 2020)

- **왜 선행인가**: Neural CDE는 "입력 경로를 driving path로 쓴다"는 수학적으로 더 우아한 정식화. ContiFormer가 여러 면에서 CDE의 "분산화 + attention 버전"으로 읽힌다.
- **읽을 때 초점**: $X(t)$ driving path 해석과 ContiFormer의 per-segment ODE의 차이. 둘을 섞어 "CDE + attention"을 만들 수 있을지.

### 경쟁: mTAND (Shukla & Marlin, ICLR 2021)

- **왜 경쟁인가**: 연속시간 attention의 가장 가까운 선행. ContiFormer가 이 논문 대비 **순수 이익**이 얼마나 있는지가 ContiFormer 기여도의 진정한 측정치.
- **읽을 때 초점**: reference point 기반 continuous attention과 ODE-driven path 기반 continuous attention의 trade-off. 계산 비용 대비 성능의 Pareto 비교.

### 후속: Subordinated ContiFormer · Neural SDE Transformer (내가 쓸 Paper 4 + 후손)

- **왜 후속인가**: ContiFormer의 두 핵심 암묵 가정(결정론·clock time)을 각각 하나씩 풀어가는 후속 연구 축. Paper 4는 clock time 가정을 풀고, 추가 후속은 결정론 가정을 SDE로 푸는 축.

## 9.3 실험해볼 후속 아이디어 2개

### 아이디어 1 — *Q-ODE ContiFormer*

- ContiFormer의 Query도 ODE로 바꾼 symmetric 버전.
- 기대: 표현력 증가 but 계산 2배, 학습 안정성 감소 가능.
- 실제 가치: **비대칭 설계의 정당성 증명** (혹은 반박). 이 ablation이 저자 설계의 "정치적" 약점이므로, 공격 · 수비 양쪽에서 활용 가능.

### 아이디어 2 — *Explicit Time-Kernel Attention over ContiFormer*

- attention weight $\alpha_i(t)$의 분모에 명시적 time kernel $K_\sigma(t-t_i)$를 multiplicative로 곱함.
- 기대: 장기/단기 분리가 명확해져 금융 forecasting 특유의 "최근 이벤트 heavy weight" 편향을 학습 없이 주입.
- 실제 가치: 단순 수정으로 ContiFormer의 한 축 약점(§6.2 (iii))을 실용적으로 보완. Paper 2에서 "같은 representation이라도 attention weighting 재조정 시 ranking vs absolute의 gap이 어떻게 움직이는가"를 분해하는 재료.

## 9.4 연구 메타 층위 — 이 논문으로부터 얻은 생각

### 글쓰기 관찰

- 본문이 경쾌하게 진행되지만 **한계 논의를 부록에 깊이 숨기는** 패턴. 내 논문 작성 시 **한계를 본문에 정직하게 노출**하는 것이 학문적 품격이고, 장기 인용에 유리.

### 실험 관찰

- "표준 Transformer"만 baseline으로 쓴 것은 2023년 기준 이미 약한 선택. 2026년에 쓰는 내 논문들은 RoPE·ALiBi·FlashAttention 등 **"중강 상대"** 를 반드시 포함해야 한다.

### 커뮤니티 관찰

- ODE·CDE·SDE 계열이 모두 "표현력 증가 + 계산 비용 증가 + 특수 도메인에서 빛남"의 패턴을 반복. 차별화 축은 "어느 도메인의 어느 구조"를 새로 다루느냐. 금융은 이 축에서 **상대적으로 덜 개척된 필드**.

## 9.5 "이 논문을 안 읽었으면 못했을 판단" 목록

1. Paper 4의 Theorem을 "ContiFormer 복원 관계"로 프레임하는 착상. (원 논문을 읽지 않으면 이 프레임 자체가 떠오르지 않음.)
2. Query만 InterpLinear라는 비대칭이 내 Paper 1의 "어느 path에 conditioning을 주입할지"라는 자유도로 복제된다는 관찰.
3. per-segment ODE reset 구조가 volatility clustering의 자연 표현일 수 있다는 Q2.
4. hyperparameter가 데이터셋별 변동한다는 이 논문의 약점을 **내 논문의 단일-hyperparameter robust 설계의 마케팅 포인트**로 전환하는 전략.
