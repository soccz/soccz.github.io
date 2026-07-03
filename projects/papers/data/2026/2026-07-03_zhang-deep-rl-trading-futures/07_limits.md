# 07. 가정·한계·반박

## 1. 명시된 가정 (논문이 대놓고 말한 것)

- **Continuous futures contracts** — 만기별 롤 처리된 연속 시계열 사용
- **Daily frequency** — 일별 종가 기반 (intraday 무시)
- **Volatility targeting** — 실무 target-vol strategy 관행 채택
- **50 유동성 최상위 선물** — sub-liquid 상품 제외
- **Transaction cost linear proportional** — c·|Δa| 형태
- **Discrete action = target order** — {-1, 0, +1} 은 직접 목표 포지션
- **2011-2019 시간 범위**

## 2. 암묵적 가정 (말 안 했지만 깔려 있는 것)

### 2.1 Stationarity of feature distribution

MACD·RSI 의 통계적 분포가 시간에 걸쳐 대체로 stationary 하다는 가정. 실제로는 leverage regime · central bank 정책 · low-rate → high-rate 전환 등에서 분포 shift 발생. LSTM 이 이를 어느 정도 흡수하나 catastrophic regime change 시 성능 급락 위험.

### 2.2 Independent per-asset trading

각 자산을 **독립적으로** trading (portfolio-level correlation 무시 추정). 실무의 diversification 은 covariance 활용이 필수. 본 논문은 asset 간 correlation 을 policy 가 자동 학습하는 mechanism 없음 → 다중 자산 동시 폭락 시 correlated loss.

### 2.3 No leverage constraint

Policy 가 vol-scaling 을 통해 자유롭게 position scale 을 조정. 실무는 leverage cap (e.g. 3x max) 이 필수. Low-vol 국면에서 σ_tgt / σ_{t-1} 가 3-4 배까지 커질 수 있어 leverage constraint 없으면 위험.

### 2.4 Reward = 즉각 손익

트레이딩 reward 는 realized P&L 이지 mark-to-market 미실현 손익 아님. 그러나 실제 리스크 관리는 미실현 손실 (unrealized MDD) 도 중요. Policy 가 이를 학습에 반영 못 함.

### 2.5 60-day EWMA 는 대표적 vol proxy

Vol proxy 로 60 일 EWMA 를 채택. GARCH, realized volatility, implied volatility 등 대안 대비 우수성 검증 없음.

### 2.6 Test-time policy 결정성

DQN 은 test 시 $\arg\max$ 로 결정론적. PG/A2C 는 stochastic policy → 매 rollout 결과 다를 수 있음. Seed 통계 미보고면 reproducibility 취약.

### 2.7 Cost = 매매 시점 즉시 부과

Roll cost, holding cost (contango/backwardation), financing cost 등 futures 특유 비용은 미반영 추정.

## 3. 반박 가능한 지점

### 반박 1: TSMOM 을 fair 하게 대접했는가?

**핵심 주장**: 본 논문은 TSMOM 을 "12 개월 lookback + vol scaling" 표준 형태로 만 비교. 그러나 최근 실무 TSMOM 은 **3-6-12 blended** (3 개월 + 6 개월 + 12 개월 signal 평균), **DMA (dual momentum)** (absolute + relative), **regime switching** (bull/bear 다른 rule) 등으로 진화. 표준 TSMOM 을 넘는다고 반드시 "DRL 이 TSMOM 계보 최고 상회" 는 아님.

**어떻게 검증**: 
1. 3-6-12 blended TSMOM 을 direct baseline 으로 추가
2. Adaptive TSMOM (Rob Carver 계열) 을 추가
3. 최근 (Slow Momentum with Fast Reversion, arXiv:2105.13727) 계보 후속작 baseline 로 추가

이 3-종 baseline 상대 승리라야 진짜 TSMOM 계보 상위 주장 가능.

### 반박 2: Seed 통계와 replicability 문제

**핵심 주장**: RL 은 seed 에 매우 민감. 하나의 seed 성공이 다른 seed 실패를 가릴 수 있음 (Henderson et al. 2018 *Deep RL that Matters*). 본 논문이 (a) 몇 개 seed 로 학습했는가, (b) seed 별 std 를 보고했는가, (c) worst-case seed 성능은 어떤가 를 명시하지 않으면 결과의 통계적 유의성 취약.

**어떻게 검증**:
1. 최소 5-10 개 seed 로 재학습
2. Sharpe 의 mean ± std 보고
3. Worst-seed 결과가 여전히 TSMOM 상회하는지 확인
4. Statistical significance test (Deng et al. 2016 방식) 수행

### 반박 3: 재현성 (Reproducibility) 취약

**핵심 주장**: 저자 공식 GitHub repo 없음 (확인된 바로), 데이터 유료 상용, hyperparameter table 상세 미공개. 이는 (i) 재현 원천 봉쇄, (ii) 연구 후속작들이 본 논문 비교 위해 자체 재구현 필요 → 비교 부정확 위험, (iii) 실무 배포 시 저자와 다른 결과.

**어떻게 검증**:
1. 저자 공식 코드 요청 (email)
2. 서드파티 재구현 (예: `firmai/deep-reinforcement-learning-trading` 계열) 결과와 본 논문 결과 비교
3. Open dataset 대체본 (yfinance 계열 index/FX 데이터) 로 재현 시도

### 반박 4: Post-2019 out-of-sample 미검증

**핵심 주장**: 2020 년 Covid, 2021 년 인플레 급등, 2022 년 금리 급등, 2023-24 년 AI 랠리 등 강력한 non-stationarity 이벤트가 발생. 본 논문 학습기간 (2011-2019) 은 **relatively benign regime**. 이 정책을 2020+ 에 배포 시 성능 저하 가능.

**어떻게 검증**:
1. 저자 pre-trained 정책 (없다면 재현본) 을 2020-2024 데이터에 zero-shot 평가
2. 성능 저하 폭 정량화
3. Rolling retrain / online adaptation 필요 여부 진단

### 반박 5: Volatility scaling 자체가 성능의 주 원천 아닐까

**핵심 주장**: DRL policy 학습 없이도 (i) $a_t = \text{sign}(r_{t-252, t})$ (naive TSMOM signal) + (ii) $\sigma_{\text{tgt}}/\sigma_{t-1}$ vol-scaling 조합 만으로도 상당한 성능. **정말로 DRL 이 volatility scaling 그 이상을 학습하는가**?

**어떻게 검증**:
1. Vol-scaled TSMOM baseline (본 논문 실제 baseline 이 이일 가능성 높음, 확인 필요) 을 확인
2. DRL policy 를 **vol-scaling 을 제외** 하고 학습하고 그 결과가 여전히 TSMOM 상회하는지 (즉 DRL 자체의 순 기여 격리)
3. Feature ablation (MACD/RSI vs raw return): 정말 MACD/RSI 를 활용하는가

## 4. 재현성 평가

| 항목 | 상태 |
|---|---|
| 저자 공식 코드 | **미공개** (확인된 바로) |
| 데이터 공개 | **유료 상용** (Pinnacle 계열 추정) |
| Hyperparameter table 상세 | 본문 PDF 접근 차단으로 미확인 |
| Random seed 통계 | 미확인 (평균만 보고 가능성) |
| Ablation 세부 | 본 환경 미확인 |
| 서드파티 재구현 | `cbailes/awesome-deep-trading` 등 큐레이션 리스트 참조, 저자 공식 아님 |

**재현성 등급**: **저 (Low)**. Deep Hedging (저자 공식 GitHub) 계열 대비 재현 여건 열위. 이는 fin ML 논문의 흔한 문제 (proprietary data, IP 보호) 이나 학술적 재현성 관점에서는 한계.

## 5. 종합 판단

본 논문은 **정성 골격은 견고**하나 (DRL for trading 표준 정식화, 3-알고리즘 비교, vol-scaling 명시, TSMOM 대비 우세), **정량 세부와 재현성은 취약** (수치 접근, seed 통계, 코드/데이터 미공개, post-2019 미검증). 이는 (i) 학술적 novelty 인정, (ii) 실무 배포 시 자체 검증 필수, (iii) 후속 연구는 open code + open data + seed 통계 를 개선해야 함 을 의미.
