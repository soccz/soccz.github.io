# 07. 가정·한계·반박

## 명시된 가정 (논문이 대놓고 말한 것)

1. **iid 관측**: $\{W_i\}_{i=1}^N$ 이 independent identically distributed. 시계열 · 클러스터 데이터는 표준 프레임 밖.
2. **unconfoundedness (IRM/PLR)**: 관측된 $X$ 로 처치와 결과 사이 confounder 를 모두 흡수. $\{Y(0), Y(1)\} \perp D | X$ (IRM); $\mathbb{E}[\zeta|X,D] = 0$ (PLR).
3. **overlap**: propensity $m_0(X) \in (\varepsilon, 1-\varepsilon)$ almost surely. 처치·통제 그룹이 모든 $X$ 값에서 존재.
4. **Neyman 직교 점수 존재**: 각 모형별로 canonical 유도 완료 (원 논문 §4, §5).
5. **nuisance rate 조건**: $\|\hat{\eta} - \eta_0\|_{L^2} = o_P(n^{-1/4})$ per nuisance, product $o_P(n^{-1/2})$.
6. **점수 함수의 $\theta$ 방향 미분성**: Jacobian $J_0 := \partial_\theta \mathbb{E}[\psi(W;\theta_0,\eta_0)]$ 이 정의되고 역행렬 가짐 (identification).
7. **모형 정확성**: PLR 은 $Y$-$D$ 관계가 실제로 partial linear 여야 함. 심하게 nonlinear 이면 misspecification bias.

## 암묵적 가정 (말 안 했지만 깔려 있는 것)

1. **관측된 covariate $X$ 가 confounder 를 모두 포함**: unconfoundedness 자체는 명시되었지만, **실무에서 이 조건을 어떻게 검증하는가** 는 문제. 저자들은 이를 검증 가능한 조건으로 다루지 않음 — 검증 불가 assumption 을 그대로 사용.
2. **정확한 인과 관계 구조 (DAG) 를 안다**: PLR/IRM 은 인과 그래프에서 $X \to D, X \to Y, D \to Y$ 구조를 가정. 만약 $X$ 에 collider 나 mediator 가 섞여 있으면 오히려 편향 유입. 실무 검증 부재.
3. **표본 크기가 $n \ge$ 수백**: nuisance rate 조건이 finite-sample 에서 성립하려면 각 fold 에 충분한 데이터 필요. 원 논문은 fold 크기 하한을 명시적으로 제시하지 않음.
4. **ML 예측기의 확률적 무편향**: nuisance 학습 오차 $\hat{\eta} - \eta_0$ 가 조건부로 mean-zero 여야 rate 조건이 유용. 심하게 biased 예측기 (예: 심한 regularization) 는 rate 자체가 왜곡됨.
5. **계산 자원 무제한 가정**: K-fold × ML 예측기 학습 = K 배 계산 비용. 대규모 데이터/복잡 예측기에서는 감당 어려움. 원 논문은 이 비용을 실용 문제로 다루지 않음.

## 반박 가능한 지점

### 반박 1 — Rate 조건이 실무 검증 불가능하다

**핵심 주장**: 이 논문의 이론은 nuisance rate $o_P(n^{-1/4})$ 를 요구한다. 하지만 이 rate 는 unknown DGP 의 함수이므로 실무에서 검증 불가. 어떤 예측기가 어떤 데이터에서 이 rate 를 실제로 달성하는지 알 수 없다. 특히 딥러닝 (network 폭·깊이·정규화·optimizer 에 따라 rate 변동 심함) 은 이 조건이 성립한다는 보장이 없음.

**실험 검증 방법**: (i) DGP 를 알고 있는 synthetic 데이터에서 여러 ML 예측기 (RF · lasso · boosting · MLP 다양한 configuration) 별로 $\|\hat{\eta} - \eta_0\|_{L^2}$ 를 표본 크기 sweep 으로 재고, $\log \|\hat{\eta} - \eta_0\|$ vs $\log n$ 의 기울기로 rate 추정. (ii) 이 rate 가 $-1/4$ 보다 완만한 예측기 조합에서 DML 의 유효 coverage 가 실제로 무너지는지 확인.

### 반박 2 — Overlap 위반이 실무에서 흔하다

**핵심 주장**: IRM 점수의 $\frac{D(Y-g_1)}{m(X)} - \frac{(1-D)(Y-g_0)}{1-m(X)}$ 항은 $m(X) \to 0$ 또는 $1$ 에서 발산. 실무 데이터에서 propensity 가 극단으로 몰리는 경우 흔함 (예: 처방약 상시 복용자, 특정 학력 층의 대학 진학률). Clipping trick 은 임시방편이며 편향을 도입.

**실험 검증 방법**: (i) 401(k) 데이터에서 propensity 분포를 sample-split fit 으로 얻고 극단값 비중 조사. (ii) 극단값 clipping threshold 를 $[0.01, 0.99]$, $[0.05, 0.95]$, $[0.1, 0.9]$ 로 sweep 하면서 ATE 추정치가 얼마나 흔들리는지. (iii) DML 대안으로 (Athey-Wager 2019) trimming rule 을 도입해 비교.

### 반박 3 — iid 가정이 금융/시계열에서 근본적으로 무너짐

**핵심 주장**: 금융 시계열은 volatility clustering, regime shift, autocorrelation, cross-sectional dependence 로 iid 위배. 표준 K-fold 는 정보 누수를 유발 (look-ahead bias). 이 논문은 시계열 확장을 다루지 않음.

**실험 검증 방법**: (i) 자산 수익률 데이터에서 표준 K-fold vs. Purged K-fold (embargo 30일) vs. Block CV 를 비교 실험. (ii) DML 추정치 편향과 CI coverage 를 각 splitting 방식별로 잰다. (iii) Chernozhukov et al. 2020 arXiv:2007.15071 의 시계열 DML 확장을 baseline 으로 비교.

### 반박 4 — Semiparametric efficiency 는 "asymptotic" 이지 finite-sample 아님

**핵심 주장**: 이론은 $n \to \infty$ 에서 성립. finite-sample ($n=500-5000$) 에서는 (i) fold 크기 작아 nuisance 학습 어려움, (ii) $b^*$ 항의 사라짐 속도가 느림, (iii) 표준오차 추정 자체가 작은 표본에서 불안. Bootstrap 대안 (Chernozhukov-Newey-Singh 2022) 필요.

**실험 검증**: 표본 크기 $n \in \{100, 500, 1000, 5000, 10000\}$ sweep 에서 CI coverage 를 조사. 명목 95% 에 도달하는 임계 표본 크기를 각 모형별로 report.

## 재현성 평가

- **코드 공개**: ★★★★★ — DoubleML 패키지 (Python + R), MIT license. `DoubleML/doubleml-for-py` GitHub 활발 유지 (마지막 커밋 2024+).
- **데이터 공개**: ★★★★☆ — 401(k) 데이터셋은 `fetch_401k` 함수로 재현 가능. 원 SIPP 1991 파일은 미국 Census Bureau 공개.
- **논문 내 디테일**: ★★★☆☆ — 이론 논문 성격상 hyperparameter · fold seed · nuisance 학습기 세부 설정 등 실증 재현에 필요한 정보는 원문 본문보다 후속작 및 패키지 문서에 흩어져 있음.
- **평균만 vs 분산 보고**: ★★★☆☆ — 원문 접근 실패로 seed 통계 (std across seeds) 가 표에 포함되었는지 미확인. 저자 진영 후속작 (arXiv:1701.08687) 은 seed 통계 포함하는 편.

## 이 절의 핵심 한 문장

**"DML 은 이론적으로 아름다우나 rate 조건 검증 불가능성 · overlap 실무 위반 · iid 가정의 시계열/금융 부적합 · finite-sample 성능의 실증적 열세라는 4 개 축에서 반박 가능하며, 이 반박들이 후속 문헌 (Athey-Wager, Chernozhukov 시계열 확장, TMLE) 의 핵심 확장 방향과 정확히 일치한다."**
