# 5. 실험 해부

## 5.1 실험 세트 개요

| § | 태스크 | 데이터 | 평가지표 | 주된 비교 |
|---|--------|--------|---------|----------|
| 4.1 | 연속 함수 근사 | 2D Archimedean spiral (3종, noise=0.02) | MAE / RMSE | Neural ODE, Latent ODE, ODE-RNN, mTAND |
| 4.2 | 불규칙 시계열 분류 | UEA Multivariate 2018 (Heartbeat, JapaneseVowels, ...) | Accuracy | Transformer, Informer, TST, mTAND, NeuralCDE, GRU-ODE |
| 4.3 | Temporal Point Process | Neonate EEG, Synthetic, Mimic, StackOverflow, BookOrder, Traffic | Log-likelihood / RMSE / Accuracy | THP, SAHP, Neural Hawkes, ODE-TPP |

## 5.2 데이터셋 선택의 함의

### 포함

- **Spiral**: Neural ODE 문헌의 표준 장난감. 선택 자체는 교과서적이나 "2D 저차원·결정론적·무점프" 조건의 정면. ContiFormer의 가정이 모두 성립하는 **홈그라운드**.
- **UEA**: 다변량 분류 표준 벤치마크이지만 **EEG·센서 계열이 과대표현**. 분포는 "부드러운 생리 신호 + 샘플 드롭".
- **TPP 6개**: Neonate(의료 EEG event), Synthetic(Hawkes), Mimic(의료), StackOverflow(질문 도착), BookOrder(금융 주문 도착), Traffic(교통 흐름). 이 중 **BookOrder가 내 입장에서 가장 관심이 가는 포인트**: 금융 Limit Order Book의 이벤트 도착 과정.

### 배제된 것

- **규칙 샘플 장기 예측 벤치마크(ETT, Weather, Traffic for forecasting)**: Informer·PatchTST 대비 정면 비교 없음. ContiFormer가 여기에 약하다고 의심할 근거.
- **금융 return 시계열** (일봉·분봉): 가장 jump-heavy한 도메인이 없음.
- **초장기 시계열** (수천 스텝): ODE cost의 scaling이 드러나는 구간. 의도적 회피로 보인다.

## 5.3 베이스라인 공정성 평가

### 공정한 점

- **Hyperparameter search**가 모든 baseline에 부여됨 (저자 진술).
- Seed 3개(27, 42, 1024) 평균.
- 동일 코드베이스(PhysioPro)에서 구현해 데이터 파이프라인 동일.

### 의심할 점

- **mask_ratio가 ContiFormer에 유리한 평가 셋업일 가능성**: ContiFormer는 drop에 본질적으로 강하게 설계됨. Transformer baseline은 시간 간격 feature를 제대로 받는지 불분명. 즉 "공평한 경기장"이 아니라 **"이 경기장에 맞춰 설계된 선수 vs 일반 선수"**.
- **Hyperparameter 탐색 grid의 비대칭**: README에서 ContiFormer는 activation(2) × layer_type(3) × actfn(2) × PE(2) = 24 조합 정도를 탐색. Transformer baseline에 같은 폭을 주었는지 명시 부족.
- **RoPE·ALiBi를 붙인 Transformer**는 비교에 없다. "표준 Transformer"만 이기는 것은 2023년 시점에서는 약한 baseline.

### 미싱 링크

- **파라미터 수·추론 시간 비교**가 주 본문이 아닌 부록으로 밀려 있음 (§D). ContiFormer가 **추론 시 ODE 적분 때문에 수 배 느리다**는 것은 부록에서야 드러남. 실무 적용 결정에 중요한 정보.

## 5.4 지표 선택의 함의

- **Accuracy** (UEA): 분류에서 가장 일반적이지만 class imbalance 고려 없음.
- **Log-likelihood** (TPP): intensity 모델의 표준. marginal likelihood가 아니라 sequence likelihood라 sequence 길이에 편향.
- **RMSE / MAE** (spiral + TPP time): 규모 의존. spiral은 단위 정규화됐지만 TPP time RMSE는 데이터셋별 스케일 차이 큼.
- **Extrapolation error**: spiral에서 중요한 지표지만 **별도 표로는 없음** (시각화 figure로만). 본 논문이 핵심적으로 주장해야 할 "extrapolation 우위"의 정량 표가 빈약.

## 5.5 주요 결과 (정성·정량 혼합)

### Spiral (§4.1)

- 관측 비율이 낮을수록 (50%, 30%, 10%) ContiFormer 우위가 커짐. Neural ODE와 비교해서 extrapolation 구간 재구성 error가 **RMSE 기준 10~25% 낮음**.
- 시각화에서 Neural ODE는 원의 반지름이 점차 줄어드는 "수축 붕괴" 증세가 있으나 ContiFormer는 형상 유지.

### UEA 분류 (§4.2)

- mask_ratio ∈ {0.0, 0.3, 0.5, 0.7}. ContiFormer는 drop이 커져도 정확도 하락 곡선이 가장 완만.
- Heartbeat, JapaneseVowels 등에서 best. 몇몇 데이터셋(예: Characters, UWave)에서는 mTAND·Transformer가 근접.
- 대부분의 데이터셋에서 "통계적으로 유의한" 우위이지만, 평균 1~3%p 개선 정도 — **revolutionary가 아니라 consistent**.

### TPP (§4.3)

- Neonate EEG에서 **log-likelihood 유의 개선** (THP 대비 +5~10% 수준).
- 금융 BookOrder에서도 개선 주장. 그러나 BookOrder의 **이벤트 도착 분포 heavy-tail 특성**이 구체 분석되지 않음. "연속 latent + ODE" 가정이 깨질 영역인데 왜 이기는지에 대한 해석 없음.
- 저자가 명시하지 않지만, TPP 하이퍼파라미터가 **데이터셋마다 크게 다름** (lr, actfn, layer_type_ode, tmax 모두 다름). 이는 강건성(robustness) 주장을 약화시킨다.

## 5.6 Ablation의 실제 의미

논문에서 수행한 ablation (appendix 기준):

1. **ODE 제거** (Transformer로 축소): 전 데이터셋 성능 하락. → Claim 2의 환원을 실제로 학습하지 않음 확인.
2. **Attention 제거** (Neural ODE 축소): 마찬가지 하락. → Claim 3도 확인.
3. **Interpolation 종류** (linear / cubic / rectilinear): 대부분 linear가 robust. cubic이 때때로 유리.
4. **`actfn_ode`**: 태스크 의존. Ablation이라기보다 tuning 가이드.

### 내가 보고 싶었던, 그러나 없는 Ablation

- **Query 쪽도 ODE로** vs 현재의 InterpLinear-Q: 설계 비대칭의 타당성 검증 누락.
- **시간 축 스케일링** (real time vs $\log t$ vs 임의 monotone $\tau$): 시간 변수 자체의 선택에 대한 민감도. **Paper 4에 직접 대응**하는 핵심 ablation이 비어 있음.
- **Multi-head 수** vs Neural ODE의 "representation rank": multi-head의 의미.

## 5.7 표·그림에서 읽어야 할 숨은 신호

- **§D의 연산 시간 표**: ContiFormer가 Transformer 대비 **3~8배 느리다**. 이는 실무자에게 결정적.
- **Figure: spiral reconstruction**: Neural ODE의 붕괴가 과장된 각도(예: 100% extrapolation)에서 두드러짐. "extrapolation 거리에 비례"하는 우위가 아닌, 특정 구간에서만 확연한 우위일 수 있음.
- **TPP 하이퍼파라미터의 데이터셋별 차이** (README에 노출된 명령들): 한 세트 hyperparameter로는 전 데이터셋을 커버 못 함. **"도메인 고유성 경고등"**.

## 5.8 재현성 실무 체크리스트

- [x] 코드 공개 (MIT).
- [x] 데이터 pipeline 공개 (UEA url, TPP Google Drive).
- [x] 시드 공개.
- [x] 하이퍼파라미터 공개 (README 명령어).
- [ ] 훈련 시간·GPU 메모리 프로파일 명시 부족.
- [ ] **Adjoint vs direct backprop 모드의 결과 차이 표 없음** — 실무에서 메모리 부족 시 선택할 수 있는 trade-off 가이드 미비.

전반적으로 재현성은 이 수준의 연구로는 양호. 다만 실제 돌릴 때 **PhysioPro** 프레임워크 의존이 귀찮음. 단독 ContiFormer 블록을 떼어내 독립 패키지로 쓰기에 약간의 리팩터링 필요.
