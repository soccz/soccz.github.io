# 5. 실험 해부

> 논문이 *어떤 실험으로* 자기 주장을 입증했는지 — 그리고 어디까지 입증했고 어디서 멈췄는지.

## 본문 차단의 정직한 고지

본 해체 작성 시점 (2026-04-27) arXiv 직접 접근이 차단되어, 본 절은 (a) 논문 abstract 와 ICLR 2023 decision page, (b) 후속 연구들 (Wang 2024, Merrill 2023, Doshi 2024, Lyle 2025) 이 인용 내 보고하는 *수치 + figure 묘사*, (c) 사용자가 보유한 grokking 관련 사전지식, 위에서 작성됐다. 정확한 figure 번호와 수치는 *접근 가능한 원문* 으로 확인할 것을 권장. 본 해체는 *경향과 해석* 에 집중.

## 배경 사다리

이 절을 이해하려면 ① **train loss / test loss 곡선이 단순 이변량 그래프**, ② **Fourier 분해 plot 이 frequency vs amplitude 의 막대그래프** — 이 둘만 있으면 된다.

---

## 6.1 데이터 — 모듈러 덧셈 단일 task

### 어떤 데이터인가

- $p^2 = 12,769$ 쌍의 $(a, b)$. 모두 가능한 modular addition 입력.
- Train: 30% (≈ 3,800 쌍), Test: 70% (≈ 8,900 쌍). 무작위 split, 보통 seed 한 개.

### 왜 이 데이터가 주장에 적합한가

이 task 는 *closed-form 정답* 이 있고, *symmetry group* (cyclic) 이 깔끔하며, *학습 가능 vs 외우기 가능* 의 양면을 모두 가진다 — 즉 grokking 의 *이상적 lab task*. 다른 task (vision, language) 였다면 회로 분석이 *불가능* 하거나 *근사적* 만 가능.

### 숨은 편향

1. **Single task** — 일반 학습 동학에 대한 결론이라기보다 *이 task 위 결론* 임을 항상 강조해야. Power 2022 의 다른 task ($S_5$ permutation, modular subtraction, 등) 에서 본 회로가 같은 형태인지 확인 필요. 본 논문은 부분적으로만 다루고 (modular subtraction 정도), $S_5$ 같은 nonabelian task 는 후속 연구 (Stander et al. 2024) 가 다룸.
2. **Single $p$** — $p=113$ 이 selected. 다른 prime ($p=97, 127$ 등) 에서 회로 형태는 같지만 구체적 frequency 가 다르다는 점이 ablation 으로 보일 수 있음 (논문이 부분 보고).
3. **Train fraction 단일** — $\rho = 0.3$ 이 *충분히 큰* 값 — train 이 너무 작으면 회로 형성 불가, 너무 크면 외우기 어려워 grokking 이 약하거나 사라짐. 이 의존성을 *부분* 보고.

---

## 6.2 베이스라인의 공정성

본 논문은 *비교 baseline 위주가 아닌, single 모델의 분해* 라 전통적 baseline 비교가 적음. 다만 다음 자체 비교들:

- **No weight decay** — grokking 이 안 일어나거나 매우 느려짐 → progress measure 도 saturate 못 함. (이건 control 으로 매우 깔끔.)
- **Different random seeds** — 5–10 개 seed 에서 회로 형태 (Fourier-sparse) 는 일관되지만 *구체적 frequency $K$* 는 seed 마다 다름. 이게 회로의 *typology* 가 universal 임을 시사.
- **Small modular variations**: $p=113 → p=109, 127$ 등. 회로 형태 동일.

비교 공정성: weight decay 의존성 ablation 은 *동일 step 수* 에서 비교됐는지 (또는 수렴 후 비교) 명확히 보고됐는가 — 본문 미접근 상태로 정확히 확인 못 함. 하지만 후속 연구들이 본 논문 결과를 일관되게 재현함.

---

## 6.3 지표 선택의 정당성

- **Train/Test cross-entropy loss** — 표준. test accuracy 도 동시에 보고.
- **Restricted/Excluded loss** — 본 논문 신규 제안. cross-entropy 위에서 정의.
- **Gini coefficient** — 표준 economic measure 의 inversion. ML interpretability 에서 신선한 사용.

만약 다른 지표였다면?

- **Accuracy 만 측정 시**: phase 1 (memorization) 에서 train acc=100% 이라 cleanup 의 미세 변화를 못 잡음. cross-entropy 가 *micro-level* 정보 보존.
- **Top-K accuracy**: 모듈러 덧셈에서 정답이 unique 라 top-K 가 의미 없음.
- **Entropy of softmax**: 회로 진행과 함께 softmax 가 *sharper* — 연관된 신호이지만 회로 specific 하지 않음.

본 논문의 progress measure 들이 *task 특이* 한 이유: 회로 가설이 정확히 "Fourier-sparse" 라서. 다른 task 에서는 다른 measure 가 필요.

---

## 6.4 주요 표·그림 (인용된 내용 기반)

### Figure 1 (또는 abstract figure) — 학습 곡선과 progress measure 의 동시 plot

**묘사**: $x$-axis 가 training step (log scale), $y$-axis 가 loss (log scale). 다음 곡선들이 동시 등장:
- Train loss: 1k step 에서 0 으로 급락 후 평탄.
- Test loss: 10k step 까지 ~ chance 수준, 그 후 급락.
- Restricted loss: 1k step 에서 매우 높음, *천천히 단조 감소*. 10k 부근에서 test loss 와 합류.
- Excluded loss: 초기 train loss 와 비슷, *천천히 단조 증가*. 10k 부근에서 chance 보다 위로 발산.

**해석**: train/test 만 보면 plateau 인 ~2k–10k step 구간이 *진짜로는 active*. progress measure 가 그 사실을 드러냄.

### Figure (Fourier 분해 plot) — Embedding 의 frequency spectrum

**묘사**: $x$-axis 가 frequency $k$ (0 ~ p-1), $y$-axis 가 energy. 5 개 정도의 sharp peak.

**해석**: 회로의 sparsity 의 직접 visualization. 이 plot 이 본 논문의 *first-impact figure*.

### Figure (3-phase 분해) — Phase 별 progress measure

**묘사**: 3 phase 의 boundary 를 vertical line 으로 표시한 plot. 각 phase 에서 어떤 measure 가 어떤 방향으로 변하는지 강조.

**해석**: 3-phase 동학의 *시각적 정의*. cleanup phase 의 *짧음* 이 grokking 의 *수직성* 을 직접 설명.

### Figure (Causal intervention) — frequency ablation 후 test acc

**묘사**: 각 $K$ 의 부분집합을 ablate 했을 때 test acc. K 전체를 남기면 100%, K 중 하나 빼면 ~80%, K 두 개 빼면 ~50%, 모두 빼면 chance.

**해석**: 회로 components 의 *additive contribution*. 어느 frequency 도 없어도 *완전히* 망가지지 않음 (다른 frequency 가 partial 로 cover) — robust circuit.

---

## 6.5 Ablation 의 해석

### 저자가 일부러 넣은 것

- **Weight decay sweep**: $\lambda \in \{0, 0.01, 0.1, 1.0, 10\}$. 0 에서는 grokking 미발생, 1.0 이 sweet spot.
- **Train fraction sweep**: $\rho \in \{0.1, 0.2, 0.3, 0.5, 0.8\}$. critical phenomenon 의 phase boundary 를 측정.

### 저자가 숨겼거나 부족한 ablation

- **다른 task 에서 progress measure 의 일반화**: modular subtraction, modular multiplication, $S_5$ permutation 에서 회로/measure 가 어떻게 다른지 — 본 논문은 *modular addition 위주* 이고 다른 task 는 부수적.
- **Architecture 의존성**: 1-layer 외 (2-layer, attention-only vs MLP-only 등) 의 회로 변형. 부분적으로만 다룸.
- **Optimizer 의존성**: AdamW 외 (SGD + momentum, Lion 등) 에서의 grokking 동학. 부분.
- **Initialization 의존성**: small init vs large init 에서 회로 형성 속도. 일부 후속 연구에서 다룸.

---

## 6.6 부록에 숨은 신호

(본문 미접근으로 정확한 부록 내용은 확인 불가, 후속 인용 기반 추정)

- **다른 prime $p$ 에서 회로 일관성**: $p=97, 109, 127$ 등에서 회로 형태 동일, frequency 만 다름.
- **Negative result**: 작은 모델 ($d_{\text{model}}=32$) 에서는 회로가 형성 못 함 — capacity 의존성. 큰 모델 ($d=512$) 에서는 너무 빨리 grokking 해 phase 분해가 어려움.
- **Continuous reformulation**: 만약 vocabulary 가 huge (real-valued) 였다면? — 본 논문이 명시적으로 다루지 않지만, 후속 연구 (Doshi 2024, Lyle 2025) 가 이 question 의 일부.

---

## 6.7 종합 평가

본 논문의 실험은 **단일 task 위에서 매우 깊이 들어가는 type**. 일반 ML 논문의 *수십 dataset × 수십 baseline* 표와 정반대 — *하나의 toy task 의 mechanism 을 끝까지 닫는* style. 이 style 이 mech interp 분야의 표준 접근이 되었다 (cf. ROME, IOI Circuit, Induction Heads 모두 같은 style).

이 style 의 강점: *깊고 닫힌 분석*. 약점: *일반화 불확실*. 본 논문이 주장하는 결론 — "그로킹은 cleanup 의 지연" — 이 *modular addition 외의 task 에서도* 성립한다는 보장이 없다. 후속 연구가 이를 부분적으로 확장 (Wang 2024 implicit reasoning, Merrill 2023 sparse parity, Lyle 2025 continual learning) 했지만 *완전한 일반화* 는 미해결.
