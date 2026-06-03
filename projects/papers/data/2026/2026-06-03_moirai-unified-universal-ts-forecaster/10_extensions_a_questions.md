# 9-A. 사고 확장 — 자문 질문 5개

각 질문은 MOIRAI 본문에 답이 *없거나 일부만 있는* 미해결 문제. 본 해체 7장 (한계) + 8장 (계보) 의 약점을 *질문 형태로 결정화*.

## Q1 — Any-Variate Attention 의 두 스칼라 $u^{(1)}, u^{(2)}$ 가 layer × head 별로 *어떻게 수렴* 하는가?

**구체 질문**: 학습 끝난 MOIRAI-Small 의 모든 (layer, head) 조합에서 $u^{(1)}$, $u^{(2)}$ 값을 추출하면 그 분포 모양은 어떤가? 일부 head 는 $u^{(1)} \gg u^{(2)}$ (self-variate 특화), 일부는 $u^{(1)} \ll u^{(2)}$ (cross-variate 특화) 로 분리되는가, 아니면 *대부분 head 가 $u^{(1)} \approx u^{(2)}$* 로 *변량 동일성에 무관* 한가?

**왜 이 질문이 중요한가**: 이 질문이 *Any-Variate Attention 의 architectural innovation 의 실제 작용* 을 직접 검증. 만약 head 들이 *분리* 되면 *변량 어휘를 layer 별 분업화* — 의도된 효과. 만약 *uniform* 이면 *두 스칼라가 사실상 noise* — 디자인의 *효과적 차원* 이 *덜* 일 수 있음. APF 의 *head specialization* 가설과도 직접 충돌.

## Q2 — Mixture 의 4 컴포넌트 가중치 $w_i$ 가 *데이터셋별 분포 특성* 과 *통계적으로 정렬* 되는가?

**구체 질문**: Electricity (대칭 가까운 실수, 양수) vs Walmart (이산 양수) vs Weather (실수 음수 가능) 에 대해, 학습된 MOIRAI 의 평균 $w_i$ 값이 *예상되는 컴포넌트* (Electricity 에서 Student-T 활성, Walmart 에서 Negative Binomial 활성) 와 align 되는가?

**왜 이 질문이 중요한가**: Mixture 모델의 *identifiability* 문제 직접 검증. 본문 미보고 — 만약 *임의 데이터셋에서 임의 컴포넌트 활성* 이라면 mixture 가 *해석 가능한 분기* 가 아니라 *redundant overparameterization*. 만약 *예상 컴포넌트 활성* 이라면 mixture 가 *해석 가능 + flexible* 의 두 마리 토끼 — 디자인 정당성 강함. ProTran-TFA 의 *regime-conditional weights* 디자인의 *prior* 결정에 직접 영향.

## Q3 — *Sub-dataset sampling cap ε* 의 변화가 *zero-shot 성능* 의 도메인별 분포에 어떻게 영향하는가?

**구체 질문**: ε ∈ {0.001 (current), 0.01, 0.1, 1.0 (no cap)} 의 4 조건으로 MOIRAI-Small 재학습 후, *6 OOD 데이터셋 × CRPS* 의 패턴이 어떻게 변하는가? 특히 Energy 도메인 (LOTSA 59%) 의 성능 vs Sales 도메인 (LOTSA 0.72%) 의 trade-off 곡선은?

**왜 이 질문이 중요한가**: *Universal* 의 정의를 *정량* 화. ε=0.001 이 *small-domain protection* 의 효과적 cap 인지, 더 큰 ε 이 *aggregate performance* 우위인지 정량 측정. *Universal forecaster 의 trade-off front* 를 처음 그려보는 실험. 본 논문 자체가 가진 약점 (반박 1 of 07_limits) 의 정량 검증.

## Q4 — Long-context scaling (Figure 5) 가 *zero-shot 모든 데이터셋* 에서 monotonic 인가, 아니면 *일부 데이터셋* 에서 *plateau / 역전* 발생하는가?

**구체 질문**: Figure 5 는 ETTm1 / Electricity / Weather 3 데이터셋에서 *context length 100 → 5000* 의 *MAE monotonic 감소* 만 보여줌. 나머지 LOTSA-내 26 데이터셋 + OOD 12 데이터셋에서도 *모두 monotonic* 인가? 만약 *일부 데이터셋* 에서 *plateau* (long context 효과 없음) 또는 *역전* (long context 가 오히려 해로움) 발생한다면, 그 *데이터셋 특성* 은 무엇인가 — short-memory? high-noise? non-stationarity?

**왜 이 질문이 중요한가**: MOIRAI 의 *zero-shot 강건성* 의 *boundary* 를 정량화. *모든 데이터셋에서 monotonic* 이면 본 논문의 long-context 주장 강함. *일부 데이터셋에서 역전* 발생하면 *inference-time context tuning* (저자 §4.2 의 1000-5000 search) 의 *실제 필요성* 이 강조. Grokking-TS 의 *non-stationarity × delayed gen* 가설과 직접 연결.

## Q5 — Multi-Patch-Size 의 *사전정의 lookup* (Appendix B.1) 이 *해당 lookup 의 5 patch size 중 어느 것이 실제로 학습 후 활성* 되는가?

**구체 질문**: 학습 끝난 MOIRAI 의 input projection weight $W_P^{in}$ 5 개 (P ∈ {8, 16, 32, 64, 128}) 의 *Frobenius norm / spectral structure* 를 비교하면 어떤가? 모든 5 개가 *비슷한 활용* 인가, 아니면 *2-3 개에 집중*? Patch size 8 (저주파 전용) 의 weight 가 *학습 step 동안* 에 거의 update 안 되었다면, 저주파 데이터가 사실상 *학습되지 않은* 셈.

**왜 이 질문이 중요한가**: LOTSA 의 *Frequency 분포* (yearly 0.003%, hourly 71.89%) 의 *극단 불균형* 이 학습된 weight 에 어떻게 반영됐는지의 *직접 진단*. 만약 *고주파 patch (64, 128)* 의 weight 가 *압도적* 으로 활성이라면, MOIRAI 는 *고주파 specialist* 일 뿐 *universal* 이 아닐 수 있음. 본 논문의 *universal* 주장 핵심 검증 — 반박 1 (07_limits) 의 정량적 결판.
