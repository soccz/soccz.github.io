# 9. 사고 확장 C — 실험 아이디어 2개

## 아이디어 1: TFT-Attention-Path-Patching — Interpretable MHA 의 인과적 지위 검증

**가설**: TFT 의 head-averaged attention weight $\bar{A} = \frac{1}{H}\sum_h A_h$ 는 저자가 "시간 중요도" 로 해석하지만, 이는 correlational 이다. Path patching (Wang 2023 IOI Circuit 스타일) 을 적용해 head 단위 causal effect 를 측정하면, attention weight 큰 head 와 causal effect 큰 head 가 서로 다를 수 있다.

**데이터**:
- OMI Realized Volatility (31 index, daily) — TFT 저자 원 데이터, 재현 가능.
- Favorita Retail — 5-tier 인터페이스가 가장 풍부한 데이터.
- ETTh1 (transformer benchmark 표준) — cross-domain 확인.

**실험 설계 (비교 조건)**:
1. **Baseline: 저자 원 TFT** — 저자 GitHub 코드 (google-research/tft) 로 학습, 저자 hyperparameter 그대로.
2. **Learned attention weight vs Path patching causal effect**:
   - 각 head 별 attention weight 의 magnitude (예: top-5 시점의 attention entropy) 를 학습 후 log.
   - 각 head 를 하나씩 corrupted-distribution 으로 ablation (Conmy 2023 ACDC 스타일) 하고 quantile loss 변화 측정 → causal effect.
   - Kendall τ (attention magnitude ranking, causal effect ranking) 계산.
3. **VSN weight vs Shapley 정확한 predictive importance**:
   - 각 변수의 VSN weight 평균 vs SHAP value (TFT 를 background prediction 로 두고) — 두 랭킹의 τ 상관.

**예상 결과**:
- τ < 0.3 (약한 상관): TFT 의 "interpretable" 이름표에 대한 결정적 반박.
- τ > 0.7 (강한 상관): TFT interpretability 부분 정당화.
- 두 극단 사이 (0.3~0.7): head 마다 다름 — 어떤 head 는 causal 이고 어떤 head 는 correlational, 정성적 분석 필요.

**반증 조건**:
- Path patching 결과가 baseline (random head ablation) 과 통계적으로 유의미하지 않으면 causal effect 자체가 없다는 뜻 → TFT 는 attention 을 실제로 안 쓰고 있음 (LSTM + GLU gate 만이 실질 역할). 이는 iTransformer 반박 방향과 일치.

**비용 추정**: 
- 저자 코드 재현 (TF1.x → PyTorch 이식 필요, PyTorch Forecasting 활용): 3-5 일.
- Path patching 구현 (Wang 2023 스타일): 3-5 일.
- 3 도메인 × 4-head × N-seed 실험: single GPU 1-2 주.
- **총 2-4 주, 1 GPU**.

**연계**: APF main paper §5 (motif intervention) 의 direct 실험. TFT 를 case study 로 삼아 APF 방법론의 forecasting transformer 이식 실증. Grokking track 은 이 실험 후 TFT circuit 이 학습 중 언제 형성되는지 추적하는 순간으로 확장 가능.

## 아이디어 2: TFT-5-tier-Grokking — 5-tier 인터페이스로 non-stationarity 축을 통제한 grokking 실험

**가설**: TFT 의 5-tier 입력 (static / known future / observed past / target / horizon) 은 non-stationarity 가 유입되는 축을 architecture 로 분리한다. Grokking-under-non-stationarity 실험에서 shift 를 (i) static covariate shift, (ii) known future distribution shift, (iii) observed past shift, (iv) target shift 4 유형으로 세분화하면, grokking timing 이 유형에 따라 달라진다 — 특히 target shift 가 delayed generalization 을 가장 심하게 파괴할 것.

**데이터**:
- Grokking 표준: synthetic sin/periodic + logistic map (사용자 자산 목록의 Grokking track 데이터).
- 확장: sin + regime switch (매 N 스텝 마다 주기 변경) — 이걸 TFT 의 5-tier 로 서술: static (regime label), known future (regime schedule 알려주는 flag), observed past (지난 값), target (다음 값), horizon.

**실험 설계**:
1. **Baseline: TFT + stationary synthetic (regime switch 없음)** — 저자 원 architecture 로 grokking 재현 (실제로 grokking 이 발생하는지 확인 — 일반적으로 TFT 은 depth 얕고 wd 작아 grokking 잘 안 발생, 이 gap 자체가 발견).
2. **Non-stationarity 축별 실험**:
   - **Only static shift**: 학습 중 지속적으로 static covariate 분포를 shift.
   - **Only known-future shift**: known future 의 분포만 shift.
   - **Only observed-past shift**: 관측 시계열의 분포만 shift.
   - **Only target shift**: 목표 자체가 shift (concept drift).
3. **VSN weight, GLU gate activation, attention pattern 을 학습 step 별 log**:
   - Grokking 순간 (test loss drop) 근처 VSN weight 가 재배열되는지.
   - GLU gate 가 이전 shift 를 학습으로 흡수하기 위해 열리는지 닫히는지.
   - Attention pattern 이 motif 관점에서 얼마나 재구성되는지 (APF motif taxonomy).

**예상 결과**:
- Static shift: 가장 잘 흡수됨 (TFT 의 4-경로 static injection 이 유연). Grokking timing 별 큰 변화 없음.
- Known future shift: 중간. Decoder side 의 VSN weight 재배열이 필요.
- Observed past shift: 학습 dynamics 불안정. GLU gate 가 여러 번 열고 닫힘.
- Target shift: grokking 자체가 파괴 (test loss drop 없음). 이는 Lyle 2025 (2026-05-01 커버) 의 non-stationarity + grokking 결론과 일치.

**반증 조건**:
- 4 유형 shift 모두에서 grokking timing 이 동일 → 5-tier 인터페이스가 실질적 통제 도구가 아님. 다시 mono-input architecture 로 회귀.

**비용 추정**:
- TFT PyTorch 이식 + regime-switch synthetic 데이터 파이프라인: 5-7 일.
- 4 유형 × N-seed × grokking 검출 실험: 1 GPU × 2-3 주.
- Log 분석 + APF motif 분류: 1 주.
- **총 4-6 주, 1-2 GPU**.

**연계**: Grokking track (`Grokking in Time Series Transformers`) 의 §4 (Experiment Design) 필수 실험. TFT 를 architecture level 통제 도구 로 사용해 non-stationarity axis 를 4-way 분리하는 실험은 Lyle 2025 이후 아무도 안 한 실험. NeurIPS 2027 grokking paper 의 §5 candidate.
