## 9. 사고 확장

### 9.1 스스로에게 던질 질문 5개

1. ContiFormer의 vector field $f_\theta(z, s)$ 에서 $s$ 를 economic time $\tau(s)$ 로 치환했을 때, 표현력 정리(Sec 4) 의 "vanilla attention 회복" 부분이 여전히 성립하는가, 아니면 새 가정이 필요한가?
2. mTAND vs ContiFormer 격차의 절반 이상이 "ODE-induced smoothing" (= implicit regularizer) 으로 설명된다면, smoothing 강도(tolerance)를 매칭한 fair comparison에서 격차가 사라지는가?
3. 거래시간 gap을 "휴식 측도"(measure $\nu$ with $\nu([\text{closed hours}]) = 0$) 로 모델링한 ContiFormer는, 동일 wall-clock 데이터를 받은 vanilla ContiFormer보다 **out-of-sample 변동성 예측**에서 실제로 우월한가?
4. ContiFormer의 attention $\hat\alpha_{ij}(t)$ 가 시간함수라면, 그 함수의 spectral density (Fourier 분해) 는 시장 cycle (intraday seasonality, weekly effect) 과 어떻게 대응하는가? Attention interpretability의 새 레인즈가 될 수 있는가?
5. NFE budget을 동결한 채 vector field 표현력만 키우면 (deeper $f_\theta$), 학습 안정성은 어디서 무너지는가? Spectral norm penalty가 NFE를 어떻게 통제하는가?

### 9.2 Follow-up 논문 3편

- **선행 (배경)**: Kidger, P. et al. (2020). *Neural Controlled Differential Equations for Irregular Time Series*. NeurIPS 2020. — Neural CDE의 controlled formulation은 ContiFormer의 ODE 임베딩과 자연 결합 가능. Paper 4의 economic-time CDE 변형의 출발점.
- **경쟁 (대안 노선)**: Schirmer, M. et al. (2022). *Modeling Irregular Time Series with Continuous Recurrent Units*. ICML 2022. — Bayesian Kalman-style continuous recurrence. ContiFormer의 attention 강조와 대비되는 *probabilistic / linear-Gaussian* 노선.
- **후속 (직계 자손)**: Kidger, P., Foster, J., Li, X., & Lyons, T. (2021). *Neural SDEs as Infinite-Dimensional GANs*. ICML 2021. — ContiFormer의 deterministic ODE를 SDE로 일반화하는 자연 경로. 금융 변동성의 stochastic vol 모델링과 직접 호환.

### 9.3 실험해볼 후속 아이디어 2개

**Idea A — "$\tau$-ContiFormer" 미니 실험 (Paper 4 의 1차 검증)**

KOSPI 200 종목 일중 1분봉을 가져와 두 모델을 같은 budget으로 학습:
1. Vanilla ContiFormer: ODE 시각 $s$ = 분 단위 wall-clock
2. $\tau$-ContiFormer: $s$ = 누적 거래량 분위수 (Clark의 economic time 근사)

평가: (a) 다음 1분 변동성 prediction RMSE, (b) 거래량 급증 직후 30분의 attention 집중도 변화. 가설: $\tau$-ContiFormer 가 (a) 에서 5–15% 개선, (b) 에서 더 sharp한 attention spike. 비용: 단일 GPU 1주일 추정. 핵심 control: NFE 매칭, query 시각 매칭.

**Idea B — Attention spectral analysis (Q4 의 직접 검증)**

학습된 ContiFormer 의 $\hat\alpha_{ij}(t)$ 를 $t \in [0, T]$ 로 dense 평가 → 각 (i, j) 쌍마다 시간 함수의 FFT. 합성 데이터 (intraday seasonality 주입) 와 실제 KOSPI에서 dominant frequency 비교. 가설: 학습된 attention의 spectrum이 시장의 known cycle (1-day, 1-week) 과 일치한다면 attention 자체가 *비지도 cycle detector* 로 사용 가능. 비용: GPU 2~3일. 산출: Paper 4 의 *부록 figure* 로 직접 사용 가능.
