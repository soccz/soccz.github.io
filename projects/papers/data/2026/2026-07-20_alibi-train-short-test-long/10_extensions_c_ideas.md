# 9. 사고 확장 (c) — 실험해볼 후속 아이디어 2개

## 아이디어 1 — "외삽인가 붕괴 회피인가": ALiBi의 장거리 활용 직접 측정

- **가설**: ALiBi의 $L_{\text{valid}}$ 증가 이득은 대부분 early token curse 완화에서 오며, 먼 위치에만 정답이 있는 과제에서는 rotary+스케일링에 뒤진다. (부록 §B.2 자기-유보의 정량 확인.)
- **데이터**: synthetic "far-lag retrieval" — 시퀀스 앞부분에 key–value 쌍을 심고, 정답이 오직 그 먼 토큰에만 의존하도록 설계. lag 거리를 {학습길이 이내, 1.5×, 3×, 6×}로 스윕. 프로필 자산의 regime-switching synthetic·logistic map을 변형해 "먼 regime을 참조해야 정답"인 버전 제작.
- **비교 조건**: {NoPE, sinusoidal, learned, RoPE, RoPE+YaRN, ALiBi} × {L=512, 1024}. 지표는 perplexity가 아니라 **retrieval 정확도**(먼 정보 회수 성공률)로 분리 측정.
- **예상 결과**: perplexity에서는 ALiBi가 붕괴 안 함(기존 결과 재현). 그러나 far-lag 정확도에서는 lag가 커질수록 ALiBi가 급락하고 RoPE+YaRN이 우위. → "외삽 강건성 ≠ 장거리 활용" 확증.
- **반증 조건**: ALiBi가 far-lag 정확도에서도 lag 3×까지 유지되면 가설 기각 — ALiBi가 실제로 긴 의존성을 쓰는 것.
- **비용 추정**: WikiText-103급 소형(≈247M) 모델 6조건 × 2길이 × 3seed = 36 run, GPU 1~2대로 1~2주. Grokking-TS의 기존 셋업 재활용으로 절감 가능.

## 아이디어 2 — Domain-Adaptive ALiBi: 자기상관 스펙트럼에 맞춘 head 기울기

- **가설**: 고정 기하수열 $[1/2^1,1/2^8]$ 대신, **도메인의 자기상관(ACF)/스펙트럼에서 유도한 감쇠 스케일 분포**로 head 기울기를 두면, 장주기 계절성이 있는 시계열에서 표준 ALiBi를 능가한다. (§07 암묵 가정 2의 도메인 민감도 공략.)
- **데이터**: Weather-mini·Traffic-mini(강한 일/주 계절성) + ETT-mini. 각 데이터의 ACF 피크(예: 24-step, 168-step)에 대응하도록 일부 head의 $m$을 작게(느린 감쇠) 배치.
- **비교 조건**: {표준 ALiBi 고정수열, 학습형 $m$, ACF-유도 $m$(제안), RoPE} × forecasting horizon {단·중·장}. 지표는 MSE/MAE + far-lag ablation.
- **예상 결과**: 계절성 지평(long horizon)에서 ACF-유도 ALiBi > 표준 ALiBi. 단기 지평에서는 차이 미미(recency로 충분). → "ALiBi 감쇠 범위는 도메인 상수가 아니다"를 실증.
- **반증 조건**: ACF-유도 $m$이 표준 고정수열 대비 유의한 이득이 없으면(신뢰구간 겹침) 기각 — 언어용 기본 범위가 시계열에서도 충분히 강건하다는 뜻.
- **비용 추정**: 소형 TS 트랜스포머 4조건 × 3horizon × 3데이터 × 3seed = 108 run, GPU 1대로 1~2주. APF의 PE 셀 코드에 "ALiBi 셀" 변형만 추가하면 되어 구현 장벽 낮음.

---

**두 아이디어의 공통 축**: 둘 다 이 논문의 *정직한 약점*(외삽≠장거리 활용, 감쇠 범위의 도메인 고정)을 시계열 도메인에서 정면으로 시험한다. 성공하면 APF PE 축의 "ALiBi 셀"을 단순 baseline에서 **진단·개선 대상**으로 격상시킨다.
