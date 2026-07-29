# 8. 내 연구와의 연결

**연결 강도**: 강함(APF의 causal-intervention·probe 단계와 직결) — 단, 아래 개인 프로젝트 사실은 `_profile.md`/`_index.md`에 문자 그대로 적힌 것만 사용한다. 프로필에 없는 내부 세부(초안 절 번호 등)는 창작하지 않는다.

## 연결 대상 (프로필에 명시된 것)

- **APF (Attention Pattern Fields)** — 프로필 표기: **"PE → 2D attention motif → CNN probe → causal intervention" 프레임워크**. PE 비교(NoPE/sinusoidal/learned/RoPE/ALiBi) × motif(diagonal/stripe/block/edge/spike/checker). 상태: TMAO method가 n=12에서 falsified, motif causality 실험 진행 중.
- **Grokking in TS Transformers** — 프로필 표기: **"Grokking × TS forecasting × non-stationarity × circuit analysis" 4-way intersection**.
- 관심 영역: §B(mech interp/circuit), §C(attention as explanation / PE-attention geometry), §D(TSFM interp).
- 보유 자산: **APF synthetic motif benchmark**(trend/seasonal/regime/anomaly/freq drift) + **UCR Archive**.

## 흡수할 기법 (어느 수식을 어디에 쓸지)

1. **steering 벡터(difference-of-means, $\mathbf{S}_i=\mathbf{M}_i^s-\mathbf{M}_i^c$; 개입 $\mathbf{h}_i\leftarrow\mathbf{h}_i+\alpha\mathbf{S}_i$)를 APF의 "causal intervention" 단계에 직접 이식.** APF는 현재 motif causality를 attention 패턴 개입으로 검증 중인데, 이 논문의 residual-stream steering은 **attention이 아닌 표현 수준**에서 개입하는 상보적 인과 도구다. APF의 각 motif(예: diagonal, stripe)에 대응하는 활성 방향을 "motif 있는 입력 − 없는 입력"의 중앙값 차이로 만들어, 그 방향을 밀면 예측이 바뀌는지 본다.
2. **LDR(선형 판별비, Eq.4~5)로 APF의 "CNN probe" 단계를 보강.** 현재 CNN probe가 2D attention motif를 분류한다면, LDR은 **어느 층·어느 토큰에서 motif가 선형 분리되는가**를 층별 게이지로 준다 → PE 종류(RoPE/ALiBi/…)별로 motif가 응축되는 층이 어떻게 달라지는지 정량 비교의 축을 추가.
3. **CKA 층 유사도(Eq.1~2)로 APF 실험 모델의 층 중복 점검.** APF가 여러 PE 조건으로 학습한 소형 Transformer들에서, PE에 따라 층 중복 패턴(블록 구조)이 달라지는지 보면 "PE가 표현 계층 구조를 어떻게 바꾸나"라는 새 관찰이 나온다.

## 충돌·경쟁 지점

- **개입 층위의 차이**: 이 논문은 **residual stream 표현**을 개입한다. APF는 **attention motif**를 다룬다. 이건 충돌이 아니라 **역할 분담**이다. 오히려 이 논문은 APF에 유리한 논거를 준다 — attention 기반 설명은 "Attention is not Explanation"(2026-05-18 커버) 비판에 노출되지만, **steering은 개입(intervention)이라 그 비판을 우회**한다. 즉 APF의 인과 주장을 attention(논쟁적)에서 residual steering(개입 증거)으로 **보강·이중화**할 수 있다.
- **개념 정의 방식**: 이 논문은 개념을 합성으로 미리 정의(constant/sinusoid). APF의 motif taxonomy(6종)는 그보다 **구조가 풍부**하다 → APF motif를 이 논문의 steering 틀에 넣으면 더 세밀한 개념 조종 실험이 된다.

## 인용 포인트 (초안 문장 형태)

- APF 논문의 causal-intervention 방법 절: *"우리는 motif 인과성을 attention 개입으로 검증하는 것에 더해, residual-stream 활성 steering(Wiliński et al., ICML 2025, arXiv:2409.12915)을 병행한다. 이때 steering 방향은 해당 논문 §3.3의 difference-of-median 정의를 motif 조건부로 확장한 $\mathbf{S}_i=\mathbf{M}_i^{\text{motif}}-\mathbf{M}_i^{\neg\text{motif}}$로 둔다."*
- 관련 연구 절: *"TSFM 해석에서 표현 중복·개념 국소화·steering을 통합한 Wiliński et al.(2025)과 달리, 본 연구는 개입 대상을 attention motif로 특정하고 PE 조건별 인과성을 통제한다."*
- Grokking track(연결 약함, 전이 가능성만): *"개념이 특정 층에서 창발한다는 관찰(Wiliński et al. 2025, Fig 4)은 학습이 끝난 모델의 사후 스냅샷이다. 본 연구는 이 층별 국소화 지표(LDR)를 **학습 시간축을 따라** 추적해, grokking 전이 시점에 개념 응축이 급변하는지를 circuit-analysis 축에서 검증한다."*

## 반면교사 (이 논문이 못한 것을 내가 어떻게)

1. **정량 steering 평가 부재 → APF 자산으로 채운다.** 이 논문은 steering을 정성 시각화로만 보였다. 나는 **APF synthetic motif benchmark(trend/seasonal/regime/anomaly/freq drift)** 로 목표 motif 주입의 **정량 성공률**(주입 후 해당 motif 분류 정확도 상승분, 비목표 motif 보존율)을 측정해 그 빈틈을 메운다.
2. **합성 한정 → UCR로 실데이터 전이 검증.** 저자가 §5에서 "합성 steering 벡터의 실세계 전이 미검증"을 인정했다. 나는 보유 자산 **UCR Archive**에서 추정한 개념 방향을 다른 UCR 데이터셋에 걸어 전이 가능성을 실제로 시험한다.
3. **$\alpha$ 수동 → PE 조건별 자동 보정.** APF는 PE를 통제 변수로 쓰므로, PE마다 최적 $\alpha$가 어떻게 달라지는지를 grid로 표준화해 "수동 튜닝" 약점을 실험 설계로 전환한다.
