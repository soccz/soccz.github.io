# 3. 핵심 Claim 해체

논문 §1(Introduction) 끝의 contribution 3개 + §3-4 본문 + §5 conclusion 을 종합해 *방어 가능한 단위* 로 다섯 claim 으로 정리한다.

## Claim 1 — "보편 forecaster 는 세 이질성을 component 단위로 분해해 풀 수 있다"

- **주장**: 시계열의 (i) frequency, (ii) variate 차원, (iii) 분포형태 이질성은 각각 *multi-patch-size projection / any-variate attention / mixture distribution head* 라는 *분리 가능한* component 로 해결된다.
- **증거**:
  - 원문 §1 마지막 paragraph 의 contribution #1 ("novel Transformer architecture ... applicable to a broad range of Transformer variants").
  - §3.1.1–§3.1.3 의 component 별 별도 절.
  - §4.3 (Table 7) ablation: 각 component 제거 시 normalized MAE 0.655 → 1.156 (multi-patch) / 0.904 (any-variate) / 0.740 (mixture) — *분리해서 효과가 가산되며 한 component 도 dominant 가 아님*.
- **숨은 전제**: 세 이질성이 *직교(orthogonal)* 하다 — 즉 freq 가 분포에, variate 수가 freq 에 미치는 상호작용이 무시 가능. 실은 그렇지 않을 수도 있는데(예: 고주파 데이터는 통상 양수성/대칭성 분포 경향, 다변량은 cross-correlation 분포 영향), Table 7 가 *각 component 만 제거* 한 1-way ablation 만 보고 2-way 교호효과는 미보고.
- **쉬운 말 풀이**: *"국제학교에서 영어/수학/과학 선생님 셋이 있을 때, 영어 선생님이 없어지면 영어만 못 가르치고 수학·과학은 무영향" 이라는 가정으로 학교를 설계했다. 실제로 영어 선생님이 수학 영어교재 번역에도 관여했다면, 세 선생님은 사실 독립적이지 않다. 논문은 독립이라고 가정하고 1-way 만 측정했다.*

## Claim 2 — "Multi-Patch-Size Projection 으로 cross-frequency 학습이 가능하다"

- **주장**: Frequency 마다 사전정의 patch size 를 매핑하고, 같은 patch size 면 weight 를 공유하는 *제한된* multi-projection 으로 cross-frequency negative interference 를 회피할 수 있다.
- **증거**:
  - §3.1.1 본문 + Appendix B.1 의 frequency → patch size 사전정의 표(8, 16, 32, 64, 128).
  - Table 7 의 "w/o multi patch size" → 0.655 → **1.156** (악화율 +76%, 모든 ablation 중 최대).
  - "w/o patch size constraints"(임의 freq 에 임의 patch 사용) → 0.720 (+10%) — 즉 *제약 자체*가 효과.
- **숨은 전제**: (a) 사전정의 표(B.1)가 *옳다* — 임의 freq 에 대해 *최적* patch size 가 표 안에 있고, freq → patch 매핑이 monotonic 하다. (b) Patch 단위 학습이 *frequency-invariant* 한 패턴을 추출한다 (예: hourly 64-patch 와 daily 32-patch 가 같은 "trend → seasonal → residual" 분해를 학습한다).
- **쉬운 말 풀이**: *"빠른 영화는 30초씩, 느린 다큐는 5초씩 잘라 본다" 는 규칙으로 정한다. 어떤 영상이든 같은 종류의 "장면"이 잡힌다고 가정하지만, 실은 30초로 잘랐을 때만 보이는 빠른 동작과 5초로 잘랐을 때만 보이는 미세 변화는 *다른* 의미일 수 있다.*

## Claim 3 — "Any-Variate Attention 은 RoPE × 이진 attention bias 의 결합만으로 permutation-equivariant + arbitrary-variate-count 모두 만족한다"

- **주장**: 변량을 평탄화한 시퀀스에 대해 시간축은 RoPE $R_{i-j}$, 변량축은 *두 개의 학습 스칼라* $u^{(1)}, u^{(2)}$ 와 indicator $\mathbb{1}_{m=n}$ / $\mathbb{1}_{m \ne n}$ 만 더하면 (a) 변량 순서 permutation-equivariant, (b) 변량 인덱스 permutation-invariant, (c) 임의 변량 수 지원, 셋이 동시 만족된다.
- **증거**:
  - §3.1.2 Eq.(2),(3) 명시. 본문 단언 ("fulfills the criteria of permutation equivariance/invariance w.r.t. variate ordering/indices, and can extend to arbitrary number of variates").
  - Table 7 의 "w/o Any-variate Attention" → 0.904 (+38%) — *additive learned embeddings* 으로 대체했을 때 악화.
  - §4.3 ablation 본문 ("randomizing variate index during training to encourage permutation invariance" 라는 baseline 도 부족).
- **숨은 전제**: (a) 변량의 *의미* (Salesforce 의 매출이라는 변수와 ETT 의 oil temperature 라는 변수)가 모델 입장에서 *교환 가능* 하다 — 실은 의미상 절대 교환 불가지만, 모델이 *해당 시계열 윈도우 내부의 패턴* 으로 충분히 추론한다는 가정. (b) 두 스칼라 $u^{(1)}, u^{(2)}$ 가 head/layer 별 학습되어 "변량 동일성" 의 다양한 함수를 포착하기 충분하다. 표현력 측면에서 *두 값* 만으로 모든 변량 관계를 포착 가능한가는 *비자명*하나 본문 검증 없음.
- **쉬운 말 풀이**: *"학생들이 줄 서 있는데, 같은 반 친구끼리는 '+u^{(1)} 가까이' 라고 표시하고 다른 반은 '+u^{(2)} 멀리' 라고 표시한다. 학교마다 반 이름이 달라도, '같은 반인지 다른 반인지'만 표시하면 통한다." 단, 같은 반 안에서도 친한 친구와 그렇지 않은 친구가 다를 텐데 그건 무시한다.*

## Claim 4 — "Mixture Distribution Head 가 단일분포 대비 flexible 한 forecast 분포를 만들고, NLL 학습이 target metric 학습과 경쟁력 있다"

- **주장**: 4-component mixture $p(Y|\phi) = \sum_{i=1}^c w_i p_i(Y|\phi_i)$ (Student-T / Negative Binomial / log-normal / low-var Normal) 를 NLL 로 학습하면 (a) 대칭/비대칭, 양수/실수, 이산/연속 임의 분포 표현 가능, (b) downstream 에서 CRPS / MAE / MSE 등 임의 target metric 으로 평가해도 경쟁력 있음.
- **증거**:
  - §3.1.3 Eq.(4) + Appendix B.2 각 분포 p.d.f. (Student-T df>2 하한, log-normal 양수 softplus, neg-binom continuous 확장 Awasthi et al. 2022, low-var normal σ=1e-3 고정).
  - Table 7 의 "w/o mixture distribution"(Student-T 단일 대체) → 0.740 (+13%).
  - Figure 4 의 정성 시각화: 단일 Student-T 가 peak 근처에서 *비대칭 truncation* 을 따라잡지 못하는 예 (Traffic Hourly).
  - Awasthi et al. 2022 의 보조정리 인용: NLL 최적화가 *consistent* 하게 target metric 을 다룬다는 주장 (단 인용만, 본 논문이 *재증명* 하지는 않음).
  - Appendix B.3 의 Lag-Llama / TimeGPT / LLMTime 비교: 본 논문이 *유일하게* "flexible distribution" check 만족 (저자 self-categorization, qualitative).
- **숨은 전제**: (a) 4 component 가 *충분* 하다 — 5번째, 예컨대 zero-inflated, bimodal 등이 필요한 도메인은 검증 안 됨. (b) Mixture weights $w_i$ 가 *데이터셋별로* 의미 있게 분리된다 — 실제로 각 component 가 어느 도메인에서 활성화되는지는 본문 미보고 (해석성 약점). (c) NLL ≈ target metric 의 *경쟁력* 은 Awasthi 결과의 가정 (target metric 이 Bregman divergence 류) 에 묶인다.
- **쉬운 말 풀이**: *"미래값을 한 가지 모양 정규분포로 표현하지 말고, 종 모양 + 한쪽 치우친 + 양수만 + 점수만 네 가지 모양을 가중치 조합해서 표현한다." 단, 네 가지로 충분한지, 가중치가 의미 있게 분리되는지, 미래 어떤 도메인은 5번째 모양이 필요한지는 본문 미검증.*

## Claim 5 — "LOTSA 27.6B 의 공개 데이터 + Unified Training pipeline 으로 zero-shot 이 dataset-trained SOTA 와 동률"

- **주장**: 9-도메인 27.6B 관측치(open, public)로 한 모델만 학습해서, *전혀 학습에 사용하지 않은* 12+ 데이터셋에서 dataset-trained full-shot SOTA(iTransformer, TimesNet, PatchTST, Crossformer, TiDE, DLinear, SCINet, FEDformer)와 *동률 또는 우위* 의 CRPS / MSIS / MSE / MAE 를 달성.
- **증거**:
  - §3.2.1 Tables 2, 3 + Appendix A 의 LOTSA 도메인별 구성.
  - §4.1 Figure 3 (Monash, in-distribution) — Moirai 3 size 모두 baseline 전체보다 normalized MAE 낮음 (단, "in-distribution" 으로 분류되지만 Monash 전체가 LOTSA 의 일부이므로 holdout 만 평가).
  - §4.2 Table 5 (Probabilistic OOD): Moirai-Large CRPS 가 Electricity 0.050(2nd best), Solar 0.406(best), Weather 비교 Moirai-Small 0.049 best (cf. PatchTST 0.059, TiDE 0.054), Istanbul Traffic 0.112(거의 동률), Turkey Power 0.036(best). 단, Walmart 0.098 vs PatchTST 0.082 / TiDE 0.077 (열위), Istanbul MSIS 4.277 vs PatchTST 3.813 (열위).
  - §4.2 Table 6 (Long-sequence OOD): Moirai-Large 가 ETTh2 MSE 0.354 vs iTransformer 0.383 / TimesNet 0.414, Moirai-Base ETTm2 MAE 0.321 vs PatchTST 0.326. ETTh1 은 Moirai-Small 0.424 vs PatchTST 0.455 / DLinear 0.452 (다소 우위), ETTm1 일부 데이터셋에서 열위.
  - Ablation Table 7 "w/o LOTSA" (GluonTS+Monash 만 사용 시) → 0.809 (+24%) — *데이터 규모*가 critical.
- **숨은 전제**: (a) Monash *holdout* 이 in-distribution 으로 가정되지만, LOTSA 가 Monash 도 포함하므로 *완전한 in-dist* 가 아니라 *완벽한 OOD 도 아닌 회색지대* (저자 본문 인정: "we only include the train set, holding out the test set"). (b) Long-sequence ETT 평가는 ETT 가 LOTSA *비포함* 이라고 저자 주장하나, ETT 의 유사 도메인 (energy load)는 LOTSA Energy 16.4B 에 다수 포함. *진정한* zero-shot 인지 의문 — 다만 *데이터셋 수준* 의 holdout 은 유지. (c) Full-shot baseline 의 hyperparameter tuning 이 *공정* 하다는 가정 — §4.2 본문에 "validation CRPS 로 tuning, 5 seed 평균" 명시는 했으나 모든 baseline 의 tuning budget 이 동등한가는 미보고.
- **쉬운 말 풀이**: *"수학 문제 1조 개로 공부한 학생 하나가, 처음 본 시험에서 그 시험만 공부한 학생들과 동률 이상" 이라는 주장. 단 (a) "처음 본 시험" 이 정말 처음 본 건지(같은 출제진의 다른 시험은 본 적 있는지), (b) 다른 학생들의 공부 시간이 공정했는지, 두 의문은 남는다.*
