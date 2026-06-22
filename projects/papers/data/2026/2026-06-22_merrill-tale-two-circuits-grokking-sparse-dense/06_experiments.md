# 06 · 실험 해부

> **주의**: 본 논문 본문 PDF 본 환경 차단. 본 절의 *실험 setup* (데이터·architecture·hyperparam·평가 procedure) 는 저자 GitHub `Tsili42/parity-nn` 의 `parity.py` + `utils.py` verbatim 으로 검증된다. 그러나 *결과 표·그림의 절대 수치* (phase transition epoch, faithfulness 곡선 점, sparse subnetwork 의 정확한 크기 분포) 는 **원문에 수치 미보고로 단정 안 함** — 정성적 결론만 기록한다.

---

## 1) 데이터셋 — Sparse parity (합성)

### 무엇인가
- 입력: $x \in \{-1, +1\}^{40}$, 균등 i.i.d.
- target: $y = \prod_{i=1}^{3} x_i$ (첫 3 비트의 곱).
- 학습 sample: $N=1000$, batch $B=32$.
- test sample: 별도 sampling (코드의 default test set 생성 — sample 수는 본 환경 코드 fragment 에서 확인 안 됨, 일반적으로 학습 분포 i.i.d. 의 더 큰 set).

### 왜 이 데이터가 본 논문 주장에 적합한가
- (a) **ground-truth 회로가 명시적**: $k$-bit parity 의 표현 회로는 DNF 로 분석적으로 셀 수 있음 → 학습된 sparse subnetwork 의 *크기* 와 *구조* 의 비교 기준이 존재.
- (b) **dense 회로의 일반화 실패가 분명**: $n=40, k=3$ → 가능한 입력 $2^{40} \approx 10^{12}$ 중 1000 sample 학습 = 입력 공간의 약 $10^{-9}$ 만 본 상태. 만약 모델이 sparse rule 을 못 찾고 dense memorization 만 하면 *반드시* 일반화 실패 — phase transition 의 *전 vs 후* 가 binary 하게 갈림.
- (c) **noise 비트 37 개**: target 과 무관한 비트들이 dense subnetwork 의 "외울 거리" 를 제공 — 두 회로의 competition 을 자연 발생시키는 substrate.

### 숨은 편향
- (i) **task 의 boolean 특수성**: parity 는 ± 곱 → 매우 "sparse logic" — 자연 데이터 (TS, NLP) 의 *연속/분산* 표현과는 다른 영역. "sparse-dense 경쟁" 이 *자연 데이터* 에서도 같은 형태로 나타날지는 별개 검증.
- (ii) **uniform 입력 분포**: 자연 데이터의 상관 구조 부재. 입력 비트 간 상관이 있다면 dense subnetwork 가 *더 효율적* 으로 외울 수 있어 phase transition 의 모양이 달라질 수 있음.
- (iii) **고정된 $k$-위치**: target 이 *처음 3 비트* 의 곱 — 위치 의존성이 학습에 도움. 만약 $k$-비트가 *무작위* 위치라면 sparse subnetwork 의 발견이 더 어려울 가능성. 코드에서 위치 무작위 변형이 주석 처리되어 있음 (`samples[:, n//2:n//2+k]`).

---

## 2) 베이스라인 공정성

본 논문은 *비교 대상 모델* 을 제시하지 않는 형태로 보임 (workshop 짧은 논문, 본문 PDF 미확인이라 단정 안 함). 대신 **자기 자신과의 시간 비교** 가 baseline:

- 학습 epoch 별로 (a) full model (b) top-$k^\star$ sparse subnetwork (c) bottom-$(1000-k^\star)$ "dense" subnetwork 의 train/test acc 와 faithfulness 를 비교.
- 이 비교는 *동일 모델 안의* sub-population 비교이므로 *공정성 문제는 없음* (hyperparameter 통제 불필요). 단점은 외부 baseline (예: pruning-from-scratch, lottery ticket retrain) 과의 비교가 없어, "본 논문의 sparse subnetwork 가 다른 sparse 발견 절차와 같은가" 의 질문에는 답하지 못함.

---

## 3) 지표 선택

### (a) Train / Test accuracy
- sign 일치 기반 (`acc_calc` 의 `torch.sign(squeeze(pred)) == y_batch`).
- 왜 accuracy 인가: parity 는 binary classification, sign 만 보면 충분. hinge margin 크기 자체는 학습 동학의 *세부* 이지 일반화의 *binary 판정* 에는 sign 으로 충분.
- 다른 지표였다면? margin distribution (sample 별 $y\hat{y}$ 의 histogram) 을 봤다면 dense → sparse 의 *연속 변화* 가 더 잘 보였을 가능성. 그러나 phase transition 자체의 *binary* 인 inflection 을 강조하려면 acc 가 더 직관적.

### (b) Faithfulness
- 정의: top-$k^\star$ subnetwork 만 활성화한 forward 의 sign 이 full model 의 sign 과 일치하는 비율.
- 왜 이것인가: "sparse subnetwork 가 logit 을 인수했는가" 의 직접 답.
- 다른 지표였다면? KL divergence (full vs masked logit 분포) 또는 logit-MSE 였다면 sign 변화 전 *확신도* 의 변화를 잡을 수 있음 — sparse subnetwork 가 "옳은 sign 을 *낮은 확신* 으로" 내는 epoch 을 식별 가능. 본 논문의 sign-equality 는 이 단계를 통합해 버림.

### (c) Subnetwork 크기 $k^\star$
- 정의: faithfulness = 1 을 보장하는 최소 활성 뉴런 수 (binary search 결과).
- 왜 이것인가: phase transition 의 *회로 표현 차원* 직접 측정. epoch 시계열로 그리면 *high to low* 의 sharp drop.
- 다른 지표였다면? L1 활성 sparsity (mean number of nonzero ReLU 출력) 도 가능. 본 논문의 *behavior-equivalent* 정의가 더 강한 (causal) 측정.

### (d) Arity (per neuron)
- 정의: 각 뉴런이 의존하는 입력 비트 수 (ArityFinder).
- 왜 이것인가: sparse subnetwork 의 *뉴런 단위 구조* 가 ground-truth $k=3$ 와 얼마나 가까운지의 직접 측정.
- 다른 지표였다면? mutual information $I(X_i; \text{ReLU}_j(x))$ 의 비트별 measure. arity 측정의 binary-prune-and-test 는 cheap 한 대용.

---

## 4) 주요 표·그림 추정 해석

(본문 PDF 미확인이므로, 코드 + abstract 단편으로 *예상되는* 그림의 의미를 해부 — 결과 절대 수치는 단정 안 함.)

### 그림 후보 1 — 뉴런 노름의 epoch 시계열 산점도
- y 축: $\eta_j(t)$ (각 뉴런의 input weight L2 노름).
- x 축: epoch.
- 1000 개 곡선이 두 갈래로 분리되는 그림이 예상. "rapid growth" 의 소수와 "slow decay" 의 다수의 시각화.
- 해석: 두 갈래 분리 시점이 grokking phase transition 의 시간 좌표.

### 그림 후보 2 — Sparse subnetwork 크기 $k^\star(t)$ 의 시계열
- y 축: $k^\star$ (binary search 결과).
- x 축: epoch.
- 학습 초기 $k^\star$ 가 *전체 width 근처* 에서 시작 → grokking 전후 *수 개* 로 떨어지는 step 함수형.
- 해석: 회로의 *차원* 이 dramatically 줄어드는 사건이 grokking 자체. 추정 lower asymptote 가 6 또는 8 (DNF 변형/표준) 근처일 것.

### 그림 후보 3 — Faithfulness vs $k$ for fixed epoch
- y 축: faithfulness ($k$ 뉴런만 활성화).
- x 축: $k$ (top-norm 뉴런 수).
- 여러 epoch 의 곡선 overlay — early epoch 은 $k$ 가 작을 때 faithfulness 가 낮고 width 끝에서 1; late epoch (post-grokking) 은 *매우 작은 $k$* 에서도 faithfulness ≈ 1.
- 해석: grokking 이 회로 *압축률* 의 phase transition 이라는 시각.

### 그림 후보 4 — Arity 의 epoch 진화 히스토그램
- 각 epoch 마다 1000 뉴런의 arity 분포.
- 초기엔 arity ≈ 40 (모든 비트 의존) 의 single mode → 학습 후엔 arity ≈ 3 의 sparse mode + arity ≈ 40 의 dead 모드의 bimodal.
- 해석: 회로 구조의 *bimodal* 화 시각.

### 그림 후보 5 — Train / test acc 와 sparsity 의 overlay
- 4 곡선: train acc, test acc, global sparsity, sparse subnetwork 크기 $k^\star$.
- 예상: train acc 가 100% 도달 후 한참 plateau → test acc 가 50% 에서 sharp jump → 그 시점에 $k^\star$ 도 sharp drop, sparsity 변화도 동시.
- 해석: 본 논문의 *one-figure summary* — 4 곡선의 inflection 시점이 *모두 일치* 한다는 사실이 회로 경쟁 가설의 다중 corroboration.

---

## 5) Ablation — 저자가 일부러 넣은 것 / 숨긴 것

### 일부러 넣었을 가능성이 높은 것
- **`n_seeds = 5` (다중 seed)**: phase transition 의 *시점* 이 seed 마다 다를 수 있음 — `mean_and_std_across_seeds()` 유틸이 존재. 분산 보고가 가능한 setup.
- **`sparsity_sampling = 10` (sparsity 측정 빈도)**: 매 10 epoch 마다 sparsity 측정 — full 300 epoch / 10 = 30 시점의 시계열.
- **`--ind-norms --global-sparsity --subnetworks --faithfulness` 4 종 동시 측정**: 한 번의 학습으로 4 종 시계열을 모두 측정 가능 → 비교 일관성.

### 숨겼을 가능성이 있는 것 (= 본 논문이 다루지 않은 ablation)
- **$k$ 의 sweep** ($k = 1, 2, 3, 4, 5$ ...): sparse subnetwork 크기가 $\Theta(2^k)$ 로 비례하는지 검증. 코드에서 가능하지만 본 논문이 보고했는지 미확인.
- **$n$ 의 sweep** ($n = 20, 40, 80, 160$ ...): noise 비트 수가 dense memorization 의 난이도를 결정 — phase transition 시점이 어떻게 scaling 되는지 검증.
- **width 의 sweep** ($W = 100, 1000, 10000$ ...): "당첨 ticket" 발견 가능성과 width 의 관계.
- **weight decay 의 sweep** ($\lambda = 0, 0.001, 0.01, 0.1$): dense background 의 *강도* 와 phase transition sharpness 의 관계 — Power 2022 의 4-phase diagram 의 *회로 수준* 재해석 가능.
- **activation 변경 (GELU, SwiGLU)**: ReLU 의 *positive homogeneity* 가 sparse-dense 분리에 기여하는지의 직접 시험.
- **multi-layer (FF2, FF3)**: depth 증가가 회로 경쟁을 어떻게 바꾸는지.

→ workshop 페이퍼 길이상 위 ablation 의 *완전* 사이즈를 보고했을 가능성은 낮음. **본문 PDF 의 ablation 절 미확인** 으로 본 논문이 어디까지 다뤘는지는 단정 안 함.

---

## 6) 부록에 숨은 신호 (추정)

코드의 `lottery ticket experiments` 와 `sensitivity calculations` (`utils.py` 의 `sensitivity_calc` 함수, `get_sensitivity`) 가 본문에 명시되지 않은 보조 측정으로 들어갔을 가능성. sensitivity 는 input bit-flip 마다 출력 sign 이 바뀌는 비율 → robustness 의 직접 측정. sparse subnetwork 가 ground-truth $k$-bit 만 의존하는 회로라면 sensitivity 가 $k/n$ 근처로 수렴해야 함.

---

## 7) 수치 투명성 — 단정 안 하는 것들

| 항목 | 본 환경 검증 가능 | 본문 PDF 필요 |
|------|-------------------|---------------|
| n, k, N, B, epochs, lr, weight_decay, width, seeds 의 값 | ✓ (argparse 디폴트 verbatim) | - |
| FF1 architecture (40, 1000, ReLU, no bias readout) | ✓ (utils.py verbatim) | - |
| circuit discovery / arity / faithfulness 의 알고리즘 | ✓ (코드 verbatim) | - |
| Loss 형태 (hinge) | ✓ (MyHingeLoss verbatim) | - |
| sparse vs dense 의 *질적* 동학 | ✓ (abstract verbatim) | - |
| Phase transition 의 정확한 epoch 좌표 | ✗ | **○ 필요** |
| 최종 $k^\star$ 의 정확한 값 (6? 8? 그 사이?) | ✗ | **○ 필요** |
| sparse subnetwork 의 test acc 값 (100%? 99%?) | ✗ | **○ 필요** |
| dense subnetwork 마스킹 후 test acc 의 값 | ✗ | **○ 필요** |
| 5 seed 의 분산 / 신뢰구간 | ✗ | **○ 필요** |
| Ablation 표 (있다면) 의 어떤 변수 sweep 했는지 | ✗ | **○ 필요** |
| Appendix 의 보조 실험 (sensitivity, lottery, modular addition 비교 등) | ✗ | **○ 필요** |

→ 본 논문의 *질적 결론* 은 abstract + 코드만으로 검증 가능. *정량 비교* 가 필요한 후속 작업에서는 본문 PDF 의 표를 *반드시* 확인해야 함.
