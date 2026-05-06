## 5. 실험 해부

### 5.1 데이터셋과 그 함의

| 데이터셋 | task | 비정규성의 출처 | 함의 |
|---------|------|---------------|------|
| Spiral / Sin (synthetic) | interpolation, extrapolation | 의도적 sparse sampling | ODE-친화적 truth — ContiFormer가 이기는 것이 당연 |
| PhysioNet 2012 (ICU) | mortality classification, interpolation | 의료적 결정에 의한 sampling | **선택 편향** — 시각 자체가 outcome과 상관 |
| Human Activity (UCI) | activity classification | sensor dropout | 일정 sampling rate에 결측 패턴 |
| MIMIC-III, USHCN | (변형 실험) | EHR / 기상 결측 | 일반화 검증 |
| Stock (private/proprietary 측) | prediction | tick 비정규 도착 | 금융 적용 가능성 신호, 그러나 데이터 비공개 |

**비판 포인트**: PhysioNet의 "비정규성"은 환자 상태가 나쁠수록 더 자주 측정되는 informative sampling이다. Hawkes process로 모델링되는 sampling 자체가 라벨과 상관 → vanilla Transformer + time embedding을 *일부러* 약하게 둔 비교가 아닌지 의심해봐야 한다. ContiFormer가 이 정보를 attention 시간함수로 자연스럽게 흡수했을 가능성.

### 5.2 베이스라인 공정성

- **포함**: GRU-D, ODE-RNN, Latent ODE, Neural CDE, mTAND, vanilla Transformer (시간을 sinusoidal embedding으로), Informer.
- **누락 / 약점**:
  - **TCN, S4 / Mamba** 계열 미포함 — irregular 처리 가능한 state-space 모델 (S5, Liquid-S4)이 강력한 경쟁자. NeurIPS 2023 시점이라 일부 동시대 미포함은 이해 가능.
  - **mTAND**의 hyperparameter tuning 깊이가 ContiFormer만큼 충분했는지 부록 정독 필요.
  - vanilla Transformer가 **time2vec/Fourier feature** 같은 강한 시각 임베딩을 받았는지 불분명 — 약한 baseline일 가능성.

### 5.3 지표

- **Interpolation**: MSE / MAE
- **Classification**: AUROC / AUPRC (PhysioNet은 클래스 불균형 심함, AUPRC가 더 정직)
- **Prediction**: RMSE / MAPE

지표 선택은 표준적이나, **calibration**(probabilistic forecasting의 핵심)은 다루지 않음 — 의사결정 적용에서 약점.

### 5.4 주요 표·그림 해석

- **Table 1 (PhysioNet interpolation)**: ContiFormer가 missing rate 50%, 70%, 90% 모두에서 1위. 격차는 missing rate가 높을수록 확대 — vector field가 sparse 입력 위에서도 매끈한 trajectory를 유지하기 때문.
- **Table 2 (classification AUC)**: PhysioNet mortality, Human Activity. ContiFormer 우위 그러나 mTAND와의 차이는 0.005~0.02 수준 — **통계적 유의성이 데이터셋 noise에 묻힐 정도**일 수 있음, 부트스트랩 CI 확인 필요.
- **Figure (continuous attention map)**: 시각 $t$ 따라 attention pattern이 변하는 시각화. mTAND의 attention과 비교 시 더 부드럽고 long-range pattern 보존. 정성적으로 설득력 있음.

### 5.5 Ablation

- **Vector field 깊이**: 2-layer MLP가 충분; 깊으면 NFE 폭주 + 학습 불안정.
- **ODE solver tolerance**: `dopri5` 1e-3이 1e-5와 큰 차이 없음 — 학습 시간 절감.
- **Continuous attention vs discrete**: 같은 임베딩에서 discrete attention만 쓰면 mTAND 성능과 유사 — **연속 attention이 진짜 기여**임을 보이는 핵심 ablation.

### 5.6 부록·각주의 숨은 신호

- **NFE per epoch**: 부록 표에 학습 NFE가 RNN 대비 5~10배. 즉 이론적 우아함의 대가가 분명하다.
- **Adjoint method 사용 시 정확도 저하** 미세 보고 — production 배포에서는 메모리 vs 정확도 trade-off가 실제 이슈.
- **Training stability**: spiral synthetic에서 vector field가 발산하는 seed 존재 (5/30 seed) — 안정성 보고가 필요한데 main text에서는 mean만 보고.
