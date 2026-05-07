## 6. 가정·한계·반박

### 6.1 명시된 가정

1. Vector field $f_\theta$ 의 Lipschitz 연속 — Picard–Lindelöf로 ODE 해의 존재·유일성 확보.
2. 관측 시각 $t_i$ 가 정확히 알려져 있음 (no measurement timing noise).
3. Sampling은 임의 (unspecified) — informative sampling을 명시적으로 다루지 않음.

### 6.2 암묵적 가정

1. **시간축은 물리시간(wall-clock)이며 측정의 의미 시계와 같다.** 의료/금융에서는 거짓일 수 있다 — 시장이 "쉬는 날"의 1초와 FOMC 발표 직후 1초는 정보량이 다르다.
2. **Vector field가 시각 $s$의 모든 $z_i$에 동일 적용**된다. 즉 토큰별 dynamics가 *공유*되며, 이는 시계열에 *single underlying generative process*가 있다는 강한 가정.
3. **ODE solver의 수치 오차가 학습 신호를 압도하지 않는다** — 실제로는 NFE 폭주 시 gradient noise가 weight 업데이트를 dominate할 수 있다.
4. **Loss는 query 시각에 대해 잘 정의된다** — extrapolation으로 갈수록 vector field의 외삽 오차가 누적되지만 본문 loss는 대개 in-distribution query에서만 평가.

### 6.3 반박 가능한 지점 (최소 1개 — 여러 개 제시)

- **반박 1 (가장 치명적)**: "ContiFormer가 mTAND를 이긴 것은 표현력이 아니라 *implicit regularization* 때문일 수 있다." Vector field가 매끈한 trajectory를 강요 → noise가 많은 데이터에서 inductive bias로 작동. 즉 ODE는 "smoother"의 다른 이름. 이를 검증하려면 spline-smoothed mTAND와 직접 비교가 필요한데 본문에 없다.
- **반박 2**: 표현력 정리는 *이론적 포함*이지 *학습 가능성*이 아니다. ContiFormer가 mTAND 특수해에 도달할 수 있다 ≠ gradient descent로 도달한다. NFE budget 안에서 학습 동역학이 mTAND-shape에 머무는지 검증 부재.
- **반박 3**: NFE 비용을 통제한 비교가 없다. wall-clock 동일 budget에서 vanilla Transformer를 더 깊게/넓게 키운 모델과 비교했어야 fair.
- **반박 4 (금융 관점)**: 거래시간 (trading hours) gap, 공휴일, 야간을 단일 ODE trajectory로 잇는 것은 **시장 미시구조 가정에 어긋난다**. 이는 Paper 4의 "Economic Time" 도입 동기가 된다 — ContiFormer 그대로는 이 한계를 노출.

### 6.4 재현성

- **+**: 코드 공개 (Microsoft SeqML), MIT, 표준 데이터셋, `torchdiffeq` 사용 → 재현 가능.
- **−**: ODE solver tolerance / random seed에 따른 분산이 main text에 충분히 보고되지 않음. 학습 NFE의 hardware 의존성. 금융 stock 데이터는 부분 비공개.
- **종합**: 재현성 B+ (학계 표준 충족, production-grade는 아님).
