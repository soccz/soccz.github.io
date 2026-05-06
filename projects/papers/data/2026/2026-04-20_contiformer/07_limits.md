# 6. 가정·한계·반박

## 6.1 명시된 가정

논문 본문이 명시적으로 또는 준명시적으로 깔고 가는 가정:

1. **Vector field의 Lipschitz 연속성**: ODE 해의 존재·유일성을 위해. 실제로 MLP + sigmoid/tanh는 Lipschitz이므로 이 가정은 구현적으로는 자동 충족.
2. **관측 시점의 엄격한 순서 $t_1 < t_2 < \dots$**: 동시 발생 이벤트 배제. TPP에서 동시 이벤트가 현실적일 수 있으나 omit.
3. **Query 시각 $t$의 범위 $[0, T]$ 안**: extrapolation은 short horizon만 평가. 장거리 extrapolation은 범위 밖.
4. **Interpolation 방법은 입력 측면에서 고정** (linear 기본). 학습 가능한 interpolation은 아님.

## 6.2 암묵적 가정 (저자가 말하지 않는 것)

이것들이 진짜 공략 지점이다.

### (i) 결정론적 연속 dynamics

모델 전체가 "latent $\mathbf{z}(t)$는 noise-free ODE를 따른다"는 세계관. 실세계 **확률 과정**이 latent에 있다면 Neural SDE·CDE가 더 자연스러운데, 저자는 "결정론 + 외부 관측 noise"라는 분해로 갈음. 금융에서는 이 분해가 사실과 다르다: volatility 자체가 확률 과정이다.

### (ii) 시간 축은 "벽시계 시간"이다

$t$가 real clock time임이 당연시됨. 모든 ODE·attention이 이 $t$로 돈다. **시장 개장 중·폐장 중·점심·overnight의 구분이 표현력 밖**. Clark (1973)이 지적한 "volume/trade clock"과 clock time의 차이가 연구 대상이 아님. **이것이 Paper 4의 지렛대**.

### (iii) Softmax의 분모에서 시간 가중 부재

attention weight $\alpha_i(t)$의 분모는 모든 $j$에 대한 sum이다. "먼 과거 vs 가까운 과거"의 시간 거리는 **오직 Key dynamics**를 통해 간접적으로만 반영된다. 예컨대 $\alpha_i(t) \propto K_\sigma(t-t_i) \exp(\dots)$ 같은 **명시적 time kernel**이 없다. 장기 기억과 단기 기억의 명시적 분리가 이 설계에서는 불가능.

### (iv) Multi-head가 "시간 축에서도 multi-scale"은 아님

표준 Transformer multi-head는 "feature subspace의 분할"이다. ContiFormer도 같은 관점만 가져옴. "한 head는 짧은 시간 스케일, 다른 head는 긴 시간 스케일"을 명시적으로 분리하지 않음. Informer·FEDformer 등이 탐구한 **scale decomposition**을 흡수하지 않음.

### (v) 관측치 간 constancy of information rate

관측이 드문 구간과 잦은 구간의 "정보 밀도"가 같다는 암묵적 가정. 경제적 해석으로는 **활동도(activity)가 균일**하다는 가정과 같다. 시장에서 ticks가 몰리는 이유는 정보 도착이 집중되기 때문이므로, 이 가정이 금융 data의 본질을 놓친다.

## 6.3 반박 가능한 지점 (내가 레퍼리였다면)

1. **Theorem 4.1·4.2는 "초집합" 주장이지 "우월" 주장이 아니다**. 초집합이 성능 우위를 보장하지 않음. 저자는 종종 두 주장을 혼동해 기술하는 인상.
2. **RoPE·ALiBi·T5 bucket PE 등 "강한 PE를 가진 Transformer"를 baseline에 넣지 않음**. 2023년 중반 이후 시계열에 이런 PE를 붙인 후속들과 비교가 빈약.
3. **금융·jump-heavy 데이터 없이 "irregular sampling 일반"에 대한 주장**을 한다. BookOrder 한 건만으로 금융 커버리지를 주장하긴 무리.
4. **효율성 trade-off가 주 본문이 아닌 부록**: 3~8배 계산 비용은 실무 결정에 핵심. 이게 Limitations §에 단 한 문단으로 흐려져 있다.
5. **Ablation의 공정성**: "ODE 제거" = Transformer로 축소가 정확한 Transformer baseline과 동일해야 하는데, hyperparameter가 같이 바뀌는지 모호.
6. **Robust loss·uncertainty quantification 부재**: 연속 attention이 noisy label에서 어떻게 되는지, confidence calibration은 어떤지 보고 없음.

## 6.4 내가 지금 당장 실험으로 확인하고 싶은 반박

- **Paper 4 직결**: 동일 ContiFormer 구조에서 $t$만 $\tau(t) = \int_0^t \sigma^2(s) ds$로 갈아 끼웠을 때 금융 분류·예측에서 개선이 있는가? 개선이 없으면 Paper 4의 동기가 약화. 개선이 있으면 Paper 4 논문이 성립.
- **Multi-head time-scale prior**: head $h$마다 ODE step을 $s_h \cdot dt$로 배율을 줘서 multi-scale head를 강제. 성능 향상 여부.
- **Explicit time kernel**: attention weight의 분모에 $K_\sigma(t-t_i)$를 곱해 장기/단기 분리. 이게 ContiFormer + 이 트릭 조합이 절대 쪽에서 잘 된다면, 저자 설계의 약점 증명.

## 6.5 재현성 평가

- **코드**: MIT 공개, PhysioPro 프레임워크. 관찰 가능한 결함은 "단독 모듈로 분리 어려움".
- **데이터**: UEA·TPP 데이터 공개 링크 존재. 일부(Mimic)는 credential 필요.
- **시드 다중**: 3개 시드 평균 보고. 분산은 표준편차 수준 보고되며 일부 ablation에서는 1-seed만 보고 — 아쉬움.
- **결과 변동성**: 데이터셋별 best hyperparameter가 다르다는 사실이 README에 노출되어 있어 "search budget의 공평성"이 재현 조건에 개입. 이 부분이 명시되지 않아 실제 재현 시 분산이 큼.

### 신뢰 점수 (subjective)

- 이론적 주장: ★★★☆☆ (Claim 1 강, Claim 2·3은 구조적 통합 수준)
- 경험적 주장: ★★★☆☆ (domain이 좁은 게 주된 감점)
- 코드 재현 가능성: ★★★★☆
- 실무 배포 가능성: ★★☆☆☆ (속도·메모리)
- 이론-실험 align: ★★★☆☆
