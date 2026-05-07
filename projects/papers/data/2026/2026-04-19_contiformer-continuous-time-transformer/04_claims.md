## 3. 핵심 Claim 해체

### Claim 1 — 연속시간 Attention의 정식화

- **주장**: query·key·value를 모두 시각의 함수로 lift 한 attention $\text{CT-ATTN}(t) = \sum_i \hat\alpha_i(t)\,\hat v_i(t)$ 가 잘 정의되며, vanilla attention보다 *엄격히* 표현력이 크다.
- **증거**: 표현력 정리 (Sec 4 / Appendix). $f_\theta \equiv 0$ 으로 두고 query interpolation을 step function으로 두면 vanilla attention 회복; vector field를 $-\lambda h$ 형태의 exponential decay로 두면 GRU-D 식 decay 회복; query만 시간함수로 두면 mTAND 회복. 즉 **5개의 선행 모델 모두 ContiFormer의 특수해**.
- **숨은 전제**: vector field $f_\theta$ 가 Lipschitz (ODE 해의 존재·유일성). Picard–Lindelöf 가정이 깨지면 trajectory가 분기·발산. 입력 시계열의 측정 잡음이 vector field를 spike하게 만들면 실제 학습에서 깨지기 쉽다.

### Claim 2 — 비정규 시계열 벤치마크 우위

- **주장**: 합성 (spiral, sin), 의료 (PhysioNet, Human Activity), 일반 시계열 등에서 interpolation MSE / classification AUC / prediction RMSE 모두 SOTA.
- **증거**: 표 형태로 mTAND, Latent ODE, ODE-RNN, Neural CDE, vanilla Transformer, Informer 비교. 대부분 통계적으로 유의한 우위 (특히 missing rate 50% 이상에서 격차 확대).
- **숨은 전제**: 데이터셋의 "비정규성"이 진짜 정보적이라는 것. PhysioNet은 의료적 의사결정에 의해 sampling되므로 시각 자체가 leak할 수 있고, 등간격 가정 모델이 불리할 수밖에 없다 (선택 편향).

### Claim 3 — 임의 시각에서의 query 가능

- **주장**: training time의 관측 시각과 무관하게, 추론 시 임의 $t \in [0, T]$에서 출력을 만들 수 있다 (continuous-time inference).
- **증거**: interpolation task에서 학습 시 보지 못한 시각을 query로 사용. 보간 곡선이 ODE-RNN 대비 매끈하면서도 변동을 잡음.
- **숨은 전제**: ODE solver의 수치 오차가 query 시각에 따라 균일하다는 가정. 적분 구간이 길어질수록 오차 누적 → "먼 미래"의 query는 여전히 위험. extrapolation 성능은 본문에서 강조되지 않음.

### Claim 4 — 통일성 (unified framework)

- **주장**: ContiFormer는 단순한 모델이 아니라, 비정규 시계열 처리의 **설계 공간**(design space)을 제시하는 *recipe*. vector field, query interpolation, attention quadrature 세 축을 분리.
- **증거**: 표현력 정리 + ablation (각 축을 끄면 기존 모델로 환원).
- **숨은 전제**: 세 축의 분리가 직교(독립)라는 것. 실제로는 quadrature 정밀도와 vector field 표현력은 서로의 부담을 떠넘길 수 있다 — vector field가 거칠면 quadrature 오차 폭증, vector field가 매끈하면 quadrature는 1차 근사로 충분. 즉 design space의 차원이 명목상 3이지만 실효 차원은 더 낮다.
