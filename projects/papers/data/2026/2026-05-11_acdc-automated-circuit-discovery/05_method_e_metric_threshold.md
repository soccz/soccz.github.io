# 4. 방법론 해부 (e) — 메트릭 $H$ 와 임계값 $\tau$

> **🧒 한 줄 요약**: KL divergence metric + threshold τ 선택.


## 배경 사다리

이 파일은 "이 edge 가 중요한가?" 의 판단이 어떻게 *수치 하나* 로 환원되는지를 다룬다. 이걸 이해하려면 ① 모델 출력이 *logit 분포* 라는 점, ② 두 분포가 얼마나 다른지를 재는 KL divergence 의 기본 의미, ③ task 마다 *진짜 중요한 logit 차원* 이 다르다는 점, 이 셋만 알면 된다.

## 메트릭 $H$ 의 선택지

저자 GitHub 코드의 task-별 `utils.py` 가 노출하는 메트릭은:

### (1) KL divergence (default)

$$H_{\text{KL}}(M, D) = \frac{1}{|D|} \sum_{x \in D} D_{\text{KL}}\big(p_M(\cdot \mid x) \,\|\, p_{M_{\text{ablated}}}(\cdot \mid x)\big)$$

- **기호 뜻**: $p_M(\cdot \mid x)$ = ablation 전 모델의 토큰 분포. $p_{M_{\text{ablated}}}(\cdot \mid x)$ = ablation 후 분포. $D_{\text{KL}}(P \| Q) = \sum_y P(y) \log [P(y) / Q(y)]$. 작을수록 분포가 같음.
- **일상 비유**: 두 가게의 메뉴 가격표 비교. 모든 메뉴 항목의 가격이 비슷하면 KL 작음. 한두 항목만 크게 다르면 KL 크다 (단 그 항목의 *확률 (수요)* 가 클 때만).
- **왜 이 형태**: ablation 의 *전체 분포 영향* 을 본다. 특정 토큰의 답 뿐 아니라 *문맥적 일관성* 까지 평가. 또 두 분포 사이의 *비대칭 거리* 라 baseline = clean 분포로 고정해 평가의 일관성 보장.
- **조심할 점**: (1) *고확률 토큰의 변화에 둔감* — Mary 와 John 의 logit 이 둘 다 높을 때 둘 사이 swap 은 KL 에 큰 영향 없음. IOI 같은 binary 선택 task 에선 logit-diff 가 더 sharp. (2) *infinity* — 새 분포가 한 토큰에 0 확률을 주면 KL 발산. softmax 출력은 이런 일이 없지만 수치적 underflow 시 주의.

### (2) Logit difference

$$H_{\text{LD}}(M, D) = \frac{1}{|D|} \sum_{x \in D} \big[ \ell_M(y^+, x) - \ell_M(y^-, x) \big]$$

- **기호 뜻**: $y^+$ = task 의 정답 토큰 (예: IOI 의 indirect object). $y^-$ = 경쟁 토큰 (예: subject). $\ell_M(y, x)$ = $y$ 의 raw logit. 클수록 모델이 정답을 더 선호.
- **일상 비유**: 두 후보 가게 (A, B) 의 가격 차이. KL 이 "메뉴판 전체의 차이" 라면 logit-diff 는 "이 두 메뉴 항목의 가격차" 만 본다.
- **왜 이 형태**: binary 선택 task 에서 *정답과 경쟁자 사이* 의 sharpness 가 곧 회로의 기능. KL 보다 *기능 명세에 가까운 신호*.
- **조심할 점**: $y^+, y^-$ 의 사전 지정이 필요 — task 가 *binary 선택* 으로 잘 환원돼야 한다. multi-class 면 평균을 어떻게 잡아야 하나의 문제.

### (3) NLL (negative log-likelihood)

$$H_{\text{NLL}}(M, D) = -\frac{1}{|D|} \sum_{x \in D} \log p_M(y^+ \mid x)$$

- **기호 뜻**: 정답 토큰의 *절대* 확률을 본다. KL 보다 baseline-free.
- **일상 비유**: 정답 토큰 한 칸의 가격만 본다 — 다른 칸은 무시.
- **왜 이 형태**: 단순. ablation 으로 정답 확률이 얼마나 떨어졌는가가 직접 보임.
- **조심할 점**: 분포 모양 변화 (예: uniform → uniform' but 정답은 같음) 를 못 잡음.

### (4) Task-specific metric

Greater-Than 의 "year >X 의 확률 마진", Docstring 의 "올바른 arg 의 logit > max 오답 arg", tracr 의 L2 distance, Induction 의 mask 위치 NLL 등. *task 가 무엇을 묻는가* 를 가장 정확히 반영하지만 task 마다 정의가 다름.

## 임계값 $\tau$ 의 역할

$\tau$ 는 "이 edge 를 끄면 metric 이 얼마나 올라도 (악화돼도) 괜찮은가" 의 허용치. 두 작용:

1. **결정 기준**: $\Delta H = m_{\text{new}} - m_{\text{old}}$ 가 $\tau$ 보다 작으면 edge 제거.
2. **Pareto 축**: $\tau$ 를 0 부터 큰 값까지 sweep 하면 (남은 edge 수, 메트릭 누적 손실) 의 Pareto frontier 가 그려진다. ACDC 의 *비교 언어* 가 이 곡선.

### 코드 기본값

저자 GitHub `acdc/main.py` 의 induction 데모 기본값: `--threshold 0.71`. 이 값은 KL divergence 의 scale 에서 약 "0.71 nat" — 즉 분포가 *비교적 많이* 변해도 prune 한다는 공격적 설정. 더 보수적인 회로 (큰 회로) 가 필요하면 0.001 정도까지 낮춤. 더 공격적 (작은 회로) 면 1.0 이상도.

### $\tau$ 의 scale 문제

KL 의 단위 (nat) 와 logit-diff 의 단위 (logit) 가 다르다. 한 task 에서 KL 의 0.1 차이가 다른 task 에서 0.01 차이와 *기능적으로* 동등할 수 있음 — 즉 $\tau$ 는 *task-기반 calibration* 이 필요한 hyperparameter. 단일 $\tau$ 라는 ACDC 의 단순함은 *task 별 calibration* 의 자유도를 숨긴다.

## 메트릭 선택이 ROC 를 바꾼 사례

- **Docstring**: KL metric → AUC 0.982. logit-diff (Docstring Metric) → AUC 낮음 (cross-source: 후속 비교 표). KL 이 docstring 의 *전체 분포 모양* 변화를 더 잘 잡는 task.
- **IOI**: logit-diff 가 더 sharp. KL 은 정답·오답 토큰의 swap 을 잘 못 잡음.
- **tracr**: L2 가 더 적절 (one-hot 출력 분포는 KL 의 단점 노출). 그래도 KL/L2 모두 AUC 1.000 — 회로가 깨끗하면 어느 메트릭이든 잘 됨.

## 메트릭 × $\tau$ × ablation 의 *암묵적 hyperparameter 공간*

ACDC 의 표면적 hyperparameter 는 $\tau$ 1 개. 실효 hyperparameter 는:

$$(\text{metric}, \text{ablation}, \tau) \in \{KL, LD, NLL, \text{task}\} \times \{\text{random}, \text{zero}\} \times \mathbb{R}_{>0}$$

조합 폭이 약 $4 \times 2 \times \text{continuous}$. ROC AUC 비교를 정직하게 하려면 이 grid 의 *어디서* 측정했는지가 중요. cross-source 의 Syed et al. 2024 비판은 정확히 이 점을 짚는다 — 동일 조건에서 측정한 평균 AUC 가 ACDC 0.596 vs SP 0.692 인데, ACDC 가 *각 task 의 최적 metric+ablation 조합* 으로 측정되면 더 좋아질 수 있음.

## 다른 접근으로 했다면

### 대안 1: 메트릭을 *모델 출력의 함수가 아닌* 다운스트림 행동 지표

예: chat 어시스턴트의 toxicity score. 이러면 metric 자체가 black-box 이고 ACDC 의 *해석 가능성* 보장이 약해진다.

### 대안 2: 멀티 메트릭

KL + logit-diff 의 weighted sum 으로 평가. weight 라는 추가 hyperparam 도입.

### 대안 3: 적응형 $\tau$

layer 별·edge-type 별로 $\tau$ 를 calibrate. 단일 $\tau$ 의 scale 문제를 풀지만 단순성이 깨짐. 후속 작업 (Hypothesis testing the circuit hypothesis, Shi et al. 2024) 이 이 방향.

## 핵심 한 문장

> ACDC 의 "단일 hyperparameter τ" 라는 매력 뒤에는 (metric 종류, ablation 종류, τ scale) 의 3 차원 암묵 hyperparam 공간이 숨어 있으며, 보고된 ROC AUC 의 우열은 이 공간의 *측정 위치* 에 따라 0.05–0.30 흔들린다.

---


---

## 인터랙티브 시각화

```viz:acdc-threshold-sweep:title=Threshold τ Sweep (paper §5),caption=Threshold slider — Goldilocks zone visualization.
```

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **KL vs accuracy?**
2. **τ = 0.06 의 empirical?**
3. **Goldilocks zone?**

### 답변

1. paper §-references + 본 deep dive 의 cross-reference 기반.

2. ACDC (Conmy 2023) 의 핵심 mechanism (edge-by-edge ablation + KL metric) 의 통합 관점.

3. APF / Grokking 트랙의 baseline — manuscript §1-§6 + Appendix.
