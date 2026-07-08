# 3. 핵심 Claim 해체

## Claim 1 — 입력 typology 분리가 forecasting 정확도를 향상시킨다

- **주장 (한 문장)**: static covariate / known future input / observed past 를 architecture 수준에서 분리한 sub-network 로 처리하면, 세 종류를 flatten 해 하나의 입력 tensor 로 넣는 방식보다 quantile loss 가 유의미하게 낮아진다.
- **증거 (원문 위치)**: 실험 §5 (arXiv v3 표기; 정확 절 번호는 본문 PDF 차단으로 단정 안 함)의 Table 1-4 — Electricity·Traffic·Volatility·Retail 4 도메인에서 DeepAR/MQ-RNN/ConvTrans/N-BEATS/ARIMA/ETS 대비 P50 & P90 quantile loss (q-Risk) 3-26% 개선. Ablation §5.4 (VSN 제거 시 성능 하락 — 정확 수치는 본문 확인 필요).
- **숨은 전제**: (i) 데이터에 이미 static/known-future/observed-past 라벨이 존재해야 함 — raw multivariate 시계열 (예: 100 개 종목의 return 만) 은 이 typology 를 사용자가 사전에 붙여야 한다. (ii) 세 종류가 실제로 다르게 처리되어야 유익할 만큼 이질적이라는 가정. Electricity/Traffic 은 hour-of-day, day-of-week 같은 known future 가 큰 신호라 이 가정이 잘 성립하지만, 순수 금융 return 에는 known-future 신호가 적어 이득이 축소될 수 있다.
- **쉬운 말 풀이**: "미리 아는 미래" (내일 공휴일), "안 바뀌는 정보" (매장 위치), "과거 관측" (지난주 판매) 을 각각 다른 문으로 넣어야 예측이 나아진다는 이야기. 다 한 자루에 넣으면 서로 뒤엉킨다.

## Claim 2 — Gated Residual Network (GRN) 이 depth-adaptive 처리를 가능하게 한다

- **주장**: GRN 은 $\text{GRN}(a, c) = \text{LayerNorm}(a + \text{GLU}(\eta_1))$ 형태로 gating 을 skip connection 에 결합하여, 데이터가 단순한 경우 GLU gate 가 0 에 가까워지면서 sub-network 를 사실상 통과 (skip) 시키고, 복잡한 경우 gate 가 열려 비선형 처리를 수행한다. 이 depth-adaptive 성질은 데이터 크기가 작은 시계열에서 over-parameterization 을 완화한다.
- **증거**: 방법론 §4 (내부 아키텍처 절), 저자 공식 README verbatim ("Gating layers help filter irrelevant components"). GRN 수식 verbatim: $\text{GLU}(\eta_1) = \sigma(W_1 \eta_1 + b_1) \odot (W_2 \eta_1 + b_2)$, $\eta_1 = W_3 \eta_2 + b_3$, $\eta_2 = \text{ELU}(W_4 a + W_5 c + b_4)$ — 여기서 $c$ 는 optional static context.
- **숨은 전제**: (i) GLU gate 가 진짜로 0 근처로 학습되는가 (post-hoc analysis 없음 — 저자는 gate 활성화 분포를 명시적으로 보여주지 않음, 본문 PDF 표 확인 필요). (ii) LayerNorm 이 skip 경로를 왜곡하지 않는다는 암묵 가정 — LN 이 skip 을 통과한 원본 $a$ 의 스케일을 바꿀 수 있어 "완전 skip" 은 아니다.
- **쉬운 말 풀이**: "이 재료 필요하면 처리하고, 필요 없으면 건너뛰자" 는 스위치가 각 처리단마다 붙어 있다. 스위치는 데이터를 보고 스스로 열고 닫힘을 학습한다.

## Claim 3 — Interpretable Multi-Head Attention 이 시간 중요도의 시각화 표면이 된다

- **주장**: 표준 multi-head attention 에서 각 head 는 독립적 $W^V_h$ 를 갖지만, TFT 는 모든 head 가 **하나의 $W_V$ 를 공유** 하고 head 별 attention weight $A_h$ 만 다르게 학습한 뒤 output 을 head 평균으로 통합. 결과적으로 head 를 평균한 하나의 attention weight $\bar{A} = \frac{1}{H} \sum_h A_h$ 가 "시간 위치 중요도" 로 직접 해석 가능해진다.
- **증거**: 방법론 §4 "Interpretable Multi-Head Attention" 절. 실험 §5 (Analysis of TFT)에서 Electricity/Traffic 에서 24-hour periodicity, Retail 에서 weekly periodicity, Volatility 에서 뚜렷한 lag 패턴 부재 — 저자가 attention weight 를 도메인 지식과 정성적 대조.
- **숨은 전제**: (i) Attention weight = 중요도 라는 attention-as-explanation 가정 (Jain-Wallace 2019 반박의 정확한 표적). (ii) Head 평균이 head 별 특수화를 희석하지 않는다 — 표준 multi-head 의 induction bias (head 별 다른 subspace) 를 스스로 포기하는 대가. (iii) 시각화된 pattern 이 domain-knowledge 와 일치 = 검증 이라는 순환 논리 위험.
- **쉬운 말 풀이**: "여러 검토위원이 저마다 다른 관점으로 보는 대신, 다 같은 재료를 보되 어디에 얼마나 주목할지만 달리 하자. 그러면 검토위원들의 주목 지도를 평균 내서 '결국 어디를 봤는가' 를 사람이 눈으로 볼 수 있다."

## Claim 4 — 다중 quantile pinball loss 로 확률 예측을 얻는다

- **주장**: 각 지평 $\tau$ 에서 여러 quantile $q \in \{0.1, 0.5, 0.9, \ldots\}$ 를 direct 출력하고, quantile loss (pinball loss) 
  $$QL(y, \hat{y}, q) = q \cdot \max(0, y - \hat{y}) + (1-q) \cdot \max(0, \hat{y} - y)$$
  로 학습한다. 평가 지표 q-Risk 는 
  $$\rho_q = \frac{2 \sum_{y_t \in \tilde{\Omega}} \sum_{\tau} QL(y_t, \hat{y}_t(q, \tau), q)}{\sum_{y_t \in \tilde{\Omega}} \sum_{\tau} |y_t|}$$
  — 전체 target 크기의 합으로 정규화한 quantile loss.
- **증거**: 방법론 §4.7 (Quantile outputs, 정확 절 번호는 본문 PDF 차단으로 단정 안 함) + 실험 §5 P50 & P90 loss 표.
- **숨은 전제**: (i) 여러 quantile head 를 독립적으로 학습해도 quantile crossing (낮은 τ 예측이 높은 τ 예측을 초과) 이 심각하지 않다는 낙관 — TimesFM v2.5 (2025)는 이를 명시적으로 `fix_quantile_crossing=True` 옵션으로 해결하는 것으로 봐서, 이는 실제 issue 였음이 후향적으로 확인. (ii) Pinball loss 만으로 tail (P95, P99) 이 신뢰할 수 있다는 가정 — extreme quantile 은 sample 부족으로 학습이 어렵다.
- **쉬운 말 풀이**: "정확히 100 개 팔릴 거예요" 대신 "80% 확률로 80-120 개 사이일 거예요"를 답하고, 답의 좋고 나쁨을 pinball loss (한 쪽이 틀리면 다른 쪽보다 더 아프게 벌점 주는 저울) 로 측정한다.

## Claim 5 — VSN weight 로 변수 중요도의 사후 시각화가 가능하다

- **주장**: Variable Selection Network 는 각 시점에서 $d$ 개의 dynamic input 각각에 대해 sparse-softmax weight $v_{\chi}(t) \in [0,1]^d$ 를 계산하고, 이를 GRN 을 지난 각 변수 표현에 element-wise 곱해 aggregate 한다. 학습된 $v_{\chi}$ 를 데이터셋 평균으로 취하면 "어떤 변수가 얼마나 중요한가" 의 사후 지표가 된다.
- **증거**: 방법론 §4.4 (Variable Selection Networks) + 실험 §5 Analysis of TFT — 각 도메인별로 상위 3-5 개 변수 정성적 나열 (Electricity: hour-of-day + past load, Retail: promotion + past sales 등).
- **숨은 전제**: (i) VSN weight 이 correlation 이 아닌 predictive 중요도 를 잡는다 — 하지만 VSN 은 여전히 supervised loss 로 학습된 gating 이라 spurious correlation 을 담을 수 있다. (ii) 데이터셋 평균 weight 가 유의미하다 — 시점별 큰 편차가 있으면 평균이 오해를 부른다. (iii) 다른 변수에 correlated 된 변수는 VSN weight 가 저평가될 수 있음 (multi-collinearity 편향).
- **쉬운 말 풀이**: "지금 이 시점에 어느 재료가 중요한지" 를 매 시점 저울로 재는 층이 있고, 그 저울 눈금을 나중에 사람이 봐서 "그러니까 이 재료가 진짜 중요했구나" 를 아는 통로다.
