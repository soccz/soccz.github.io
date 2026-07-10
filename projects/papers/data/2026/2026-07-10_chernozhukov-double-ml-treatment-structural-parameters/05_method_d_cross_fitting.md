# 05d. 방법론 — K-fold 교차적합

## 왜 이 부분이 필요한가

Neyman 직교화 (§05c) 는 정규화 편향의 1차 항을 없앤다. 하지만 nuisance $\hat{\eta}$ 이 훈련된 표본 자체에서 다시 $\theta$ 를 evaluate 하면 **자기 표본 재사용** 이라는 별개의 문제가 남는다: $\hat{\eta}(W_i)$ 는 $W_i$ 자체에 fit 되어 있어서 in-sample 잔차가 실제보다 작게 나온다. 이 절은 K-fold 교차적합이 이 문제를 어떻게 잡는지, 그리고 이 절차가 왜 Donsker 조건을 우회하는지 정리한다.

## 알고리즘 — DoubleML `algorithms.rst` verbatim

### DML1 (fold-wise)

**입력**: 모형 (PLR/PLIV/IRM/IIVM), 데이터 $(W_i)_{i=1}^N$, Neyman 직교 점수 $\psi(W;\theta,\eta)$, nuisance ML 방법.

**단계 1 — 폴드 분할**: 관측치 인덱스 $\{1,\ldots,N\}$ 을 K 개 disjoint fold $(I_k)_{k=1}^K$ 로 무작위 분할. 각 fold 크기 $n = N/K$.

**단계 2 — Out-of-fold nuisance 학습**: 각 fold $k$ 에 대해  
$$\hat{\eta}_{0,k} = \hat{\eta}_{0,k}\left( (W_i)_{i \notin I_k} \right)$$  
즉 fold $k$ 외의 데이터만으로 nuisance ML 학습.

**단계 3 — Fold-별 $\theta$ 해**: 각 fold $k$ 에 대해  
$$\frac{1}{n} \sum_{i \in I_k} \psi(W_i; \check{\theta}_{0,k}, \hat{\eta}_{0,k}) = 0$$  
을 풀어 $\check{\theta}_{0,k}$ 를 얻는다.

**단계 4 — 평균 aggregate**: $\tilde{\theta}_0 = (1/K) \sum_{k=1}^K \check{\theta}_{0,k}$.

### DML2 (pooled) — DoubleML 기본값

DML1 과 단계 1-2 동일. 단계 3 에서 **전역 방정식** 을 푼다:  
$$\frac{1}{N} \sum_{k=1}^K \sum_{i \in I_k} \psi(W_i; \tilde{\theta}_0, \hat{\eta}_{0,k}) = 0$$

DoubleML `algorithms.rst` verbatim — "The second version of the algorithm DML2 is recommended to obtain more stable estimates."

## 수식 4줄 해석 — DML1 단계 3

**기호 뜻**: $\check{\theta}_{0,k}$ 는 fold $k$ 만으로 얻은 $\theta$ 추정치. $n = N/K$ 는 fold 크기. $\psi$ 는 직교 점수 함수.

**일상 비유**: 5 개 반으로 나눠 4 개 반에서 강의를 듣고 나머지 1 개 반에서 시험 보는 방식을 5 번 순환. 각 시험 결과를 평균.

**왜 이 형태**: $\hat{\eta}_{0,k}$ 를 계산할 때 $I_k$ 데이터를 안 봤으므로, $\psi(W_i; \cdot, \hat{\eta}_{0,k})$ 은 $W_i$ 에 대해 "out-of-sample" 이다. 자기 표본 재사용 문제가 원천 차단.

**조심할 점**: DML1 의 fold-wise 해 $\check{\theta}_{0,k}$ 는 fold 크기 $n = N/K$ 가 작을 때 finite-sample 편향이 크다. DML2 는 fold 를 nuisance 에만 쓰고 $\theta$ 는 전역 정보로 풀어 이 편향을 완화.

## Donsker 조건은 왜 필요 없는가

**Donsker 클래스**: nonparametric estimator $\hat{\eta}$ 이 소속된 함수 클래스 $\mathcal{H}$ 의 bracketing entropy $H_{[]}(\varepsilon, \mathcal{H}, \|\cdot\|_{L^2})$ 가 특정 rate 로 유한하다는 조건. Robinson kernel · sieve estimator 는 만족하지만 RF · boosting · NN 은 함수 클래스가 너무 커서 만족하지 않는다.

**전통적 접근 (Donsker 필요)**: nuisance 학습과 $\theta$ 추정을 같은 표본으로 하면, empirical process theory 상 uniform convergence $\sup_{\eta \in \mathcal{H}} |\mathbb{E}_n[\psi(W;\theta,\eta)] - \mathbb{E}[\psi(W;\theta,\eta)]| \to 0$ 이 필요하고, 이는 정확히 Donsker 조건.

**교차적합의 트릭**: fold $k$ 의 $\hat{\eta}_{0,k}$ 는 fold $k$ 외의 데이터로만 학습됨. 조건부로 $\hat{\eta}_{0,k}$ 를 고정 상수 함수처럼 취급 가능하고, 그 위에서의 $\mathbb{E}_n$ 은 iid sum. Uniform convergence 가 필요 없이 **pointwise CLT** 만으로 원하는 asymptotic 을 얻는다.

DoubleML `basics.html` verbatim — "$c^*$ vanishes under sample splitting". 이 $c^*$ 항이 정확히 Donsker 조건이 필요하던 항.

## 대안 접근과 비교

### 대안 1 — 단순 split-sample (K=2)

데이터를 반으로 갈라 A 로 학습, B 로 평가. 문제: 절반 표본만 씀 → asymptotic variance 두 배. 검정력 절반 소실.

### 대안 2 — Leave-one-out (K=N)

fold 크기 $n=1$. 이론적으로 유효하지만 계산 비용 $O(N)$ 배. 실무 사용 불가.

### 대안 3 — 반복 K-fold (repeated cross-fitting)

같은 데이터에 대해 무작위 fold 분할을 $R$ 번 반복하고 결과를 평균. DoubleML `resampling.rst` verbatim — `n_rep` 파라미터로 지원. 단일 fold 분할의 무작위성 감소.

### 대안 4 — Time-series / cluster splitting

iid 가정이 무너지는 시계열/클러스터 데이터에서는 표준 K-fold 부적합. **Purged K-fold** (Marcos López de Prado 2018) — fold 경계에 embargo period 를 두어 look-ahead bias 방지. **Block CV** — 연속 시간 블록으로 분할. 이론적 확장은 활발한 연구 주제 (Chernozhukov et al. 2020 arXiv:2007.15071 시계열 DML).

## fold 수 K 선택 실무

DoubleML `resampling.rst` verbatim — `n_folds` 기본값 5, `n_rep` 기본값 1.

- **K=5**: 표준 권장. 표본 크기 $N \ge 500$ 에서 안정.
- **K=2**: 이론적으로 유효하지만 fold 별 nuisance 학습에 $N/2$ 만 씀 → 각 예측기 오차 커짐 → rate 조건 (nuisance $L^2$ 오차 곱 = $o_P(n^{-1/2})$) 위험.
- **K=10**: 예측기 학습 데이터 90% 확보 → nuisance 정확도 상승. 대신 계산 비용 2배.

## 이 부분의 핵심 한 문장

**"K-fold 교차적합은 nuisance 학습 표본과 $\theta$ 평가 표본을 분리해 자기 표본 재사용 편향을 원천 차단하고, 이 분리 덕분에 강한 함수 클래스 조건 (Donsker) 이 필요 없어져 임의의 ML 예측기가 사용 가능해진다."**
