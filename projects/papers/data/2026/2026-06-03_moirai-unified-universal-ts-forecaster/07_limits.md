# 6. 가정·한계·반박

## 명시된 가정 (저자 §5 Limitations & Future Work 직접)

1. **자원 제약 → hyperparameter tuning 거의 없음**: "Due to resource constraints, little to no hyperparameter tuning was performed". 즉 *Table 4 의 layer/dim 선택, AdamW 의 lr/wd, batch size, training step* 모두 *최적화 안 됨*. μP (Yang 2022a, 정량적 hyperparameter transfer) 를 future work 로 명시.
2. **Multi-patch-size 매핑이 heuristic**: "our approach to tackling cross-frequency learning with a multi patch size mapping is somewhat heuristic". 사전정의 lookup 표가 *경험적* — 더 *flexible / elegant* 한 디자인 필요.
3. **고차원 시계열 제약**: "the current architecture has limited support for high-dimensional time series". 변량 수 *128 cap* (beta-binomial sampling), 1000+ 변량 데이터셋은 미지원.
4. **Latent diffusion 미탐색**: 마스크드 인코더 구조가 *latent diffusion architecture* 로 확장 가능 (Feng 2024 인용) 하나 본 작업 미수행.
5. **LOTSA 의 다양성 한계**: "LOTSA can be further enhanced with greater diversity in terms of domain and frequency". Healthcare 0.01% / Econ-Fin 0.09% 같은 매우 작은 도메인이 *underrepresented*.
6. **Multi-modality 미지원**: "incorporating multi-modality such as tabular or text inputs is an exciting new direction". TSFM 의 *holistic* 통합 미달성.

## 암묵적 가정 (말 안 했지만 깔려 있음)

### A1 — 세 이질성의 *직교성* (Claim 1 의 숨은 전제 재확인)
저자들은 frequency / variate-count / 분포형태 셋이 *분리된 component* 로 다뤄질 수 있다고 가정. 실은 *고주파 데이터는 통상 분포가 더 좁고 (low-var Normal 활성), 저주파 데이터는 우측편향 (log-normal 활성)* 같은 *교호효과* 가능. Table 7 의 1-way ablation 으로는 이 교호효과 검증 불가. **반박 가능**: 2-way ablation (예: "w/o multi-patch + w/o mixture") 수행 시 *상호작용 항* 분리 측정 가능.

### A2 — 사전정의 freq → patch_size lookup 이 *최적 근사*
Appendix B.1 의 5-bucket lookup 이 *합리적 추정* 임은 의심 없으나, *모든 freq* 에 대해 그 lookup 이 *PMA* 라는 증거 없음. 새로운 freq (nano-second 거래 데이터, multi-year aggregates) 는 표 밖. **반박 가능**: input-conditional dynamic patch size (대안 B from 05_method_b) 와 정량 비교.

### A3 — 변량 의미의 *교환성*
Any-Variate Attention 의 permutation-invariance 는 *모든 변량이 의미적으로 교환 가능* 하다는 강한 가정 위에 있다. 실제로는 *주식수익률* 과 *거래량* 은 *전혀 다른 의미* — 모델이 변량별 hidden 표현으로 이를 학습해야. 학습 시 *충분히 다양한 변량 조합* 을 봤다면 가능하나, 일부 *희귀* 변량 (예: 의학 시계열의 특수 측정치) 은 zero-shot 시 잘못 분류 가능. **반박 가능**: 변량 의미 *typed* embedding (예: "is_count", "is_positive_real", "is_bounded_in_01" 같은 metadata 토큰) 추가 시 zero-shot 성능 향상 여부 측정.

### A4 — Mixture 가중치의 *implicit identifiability*
Mixture 모델은 *학습 동안* 컴포넌트 라벨 permutation 에 대해 likelihood 동일 — *어느 컴포넌트가 Student-T 인지, log-normal 인지* 가 *학습 후 fixed* 라는 보장 없음. 저자들은 *각 컴포넌트의 p.d.f. 형태* 를 *fixed* 하므로 identifiability 가 *p.d.f. 형태로* 보장된다고 추측 가능하나, *가중치* $w_i$ 가 *데이터셋별로 의미 있게 분리* 되는지는 미보고. **반박 가능**: 각 mixture component 의 *데이터셋별 평균 가중치 분포* 를 시각화. 만약 모든 데이터셋에서 가중치가 *uniform* 이라면 mixture 는 *단일 average distribution* 처럼 작동 → flexibility 무효.

### A5 — Zero-shot evaluation 데이터의 *진정 OOD 성*
Probabilistic 6 데이터셋 + Long-sequence 6 데이터셋 모두 *데이터셋 수준* 으로는 LOTSA 와 disjoint 하지만, *유사 도메인의 다른 데이터셋* 은 LOTSA 에 풍부. 예컨대 ETT (전력 데이터) 가 *진정 zero-shot* 인가 — LOTSA Energy 16.4B obs 중에 ETT 와 *통계적으로 유사한* 데이터가 있을 가능성. 본문 명시 회피: "datasets used in the following have not been included in LOTSA" — *dataset name* 매칭만 검증. **반박 가능**: ETT 와 LOTSA Energy 의 *분포 distance (예: MMD, Wasserstein)* 측정 → 진정 OOD 인지 정량 검증.

## 반박 가능한 지점

### 반박 1 — "Universal" 의 정의가 *유의미한 도메인 cover* 를 의미하지 않을 수 있다

**핵심 주장**: 본 논문의 universal 은 *LOTSA 9 도메인 + 7-8 freq + 임의 변량* 이지만, *Healthcare 0.01%, Econ-Fin 0.09%* 같은 도메인은 사실상 *zero-shot* 검증 불가. *진정 universal* 이려면 모든 도메인 *유의미 weight* 로 학습되어야 하는데, sampling cap ε=0.001 이 *너무 작은 도메인은 결국 minor* 로 만듦. 즉 본 논문의 universal 은 *Energy + Transport + Climate* 중심의 *quasi-universal*.

**어떻게 실험으로 검증할 수 있는가**:
1. *도메인별* zero-shot OOD 평가 — 특히 Healthcare / Econ-Fin / Nature 도메인의 외부 데이터셋 (없으면 합성)에서 CRPS 측정.
2. *Healthcare-dominant* 데이터로 fine-tune 한 모델과 zero-shot Moirai 비교 — fine-tune gap 이 크면 universal 주장 약화.
3. *Sub-dataset sampling cap 변화* (ε ∈ {0.001, 0.01, 0.1, 1.0}) ablation — cap 이 작으면 small domain 보호, cap 이 크면 large domain 편중. *효과 곡선* 으로 universal 의 trade-off 측정.

### 반박 2 — Table 6 의 Long-Sequence 비교는 *baseline tuning 불공정*

**핵심 주장**: Table 6 의 full-shot baseline 수치는 *Liu 2023b (iTransformer 논문)* 에서 그대로 차용 (저자 본문 명시). iTransformer 가 *자기 모델에 유리하게* baseline 을 tune 했을 가능성 (관행). MOIRAI 의 *zero-shot 우위* 가 일부는 *baseline underperformance* 일 수도. PatchTST 의 원 논문 보고 수치와 Liu 2023b 의 PatchTST 수치가 일치하는지 검증 필요.

**어떻게 실험으로 검증할 수 있는가**:
1. MOIRAI 저자들이 *직접* PatchTST / iTransformer / TimesNet 을 ETT 등에서 *동일 protocol* 로 *재학습* 후 보고.
2. PatchTST 원 논문 (Nie 2023) 의 Table 4 수치와 Liu 2023b 의 차용 수치 *cross-check*.
3. *Inference-time tuning 없는* MOIRAI vs *training-time tuning 한* baseline → 진정 *비교 가능한* zero-shot vs full-shot.

## 재현성 평가

### ✅ 강점
- **Code**: github.com/SalesforceAIResearch/uni2ts (Apache 2.0).
- **Model weights**: HuggingFace `Salesforce/moirai-1.0-R-{small,base,large}`.
- **Data**: LOTSA fully open (Apache 2.0).
- **Hyperparameters**: Table 4 + Appendix C.3 Table 19 명시.
- **Variance reporting**: Table 5 의 baseline 은 5 seed mean±std 보고. MOIRAI 자체는 단일 weight 평가 (학습 1 회 — *MOIRAI 학습 variance 미보고* 가 약점).

### ⚠️ 약점
- **MOIRAI 학습 variance 미보고**: 저자들은 *MOIRAI 를 1 회 학습 후 zero-shot 평가* → 학습 random seed 의 영향 미측정. 만약 학습 seed 영향이 ±0.05 normalized MAE 라면 Table 5 의 best 수치 우위가 noise 일 수도. *Foundation model 학습 비용이 비싸* — 100k step×3 size 만 해도 A100-40G 수백 시간 → 5 seed 학습은 비현실적. *변명 가능*하나 *과학적 흠*.
- **Sub-dataset 단위 명세 부족**: Appendix A 가 *데이터셋 수준* 만, *sub-dataset* 정의가 본문 불명확. 재현 시 동일 sub-dataset 분할이 안 될 수 있음.
- **Sequence packing 구현 디테일 미명시**: 본문 "we implement sequence packing" 만, 구체적 packing 알고리즘 (greedy / first-fit / best-fit) 미명시. 코드 참조 필요.
- **Inference-time context length tuning**: §4.2 "selecting context length from {1000, 2000, 3000, 4000, 5000} ... on the validation CRPS" — 즉 *test 시* validation 으로 1차 tuning. *완전한 zero-shot* 이라 부르기 애매. *Zero-shot* 이라 해도 *전체 inference pipeline* 에 *데이터셋별 결정* 이 포함됨.

## 한계의 임팩트 평가

저자의 6가지 한계 자기-시인 + 본 해체에서 발견한 5 암묵 가정 + 2 가능 반박 을 종합하면:

- **Critical**: A1 (직교성), A5 (진정 OOD), 반박 2 (baseline tuning) — 핵심 claim 의 *증거 강도* 에 직접 영향.
- **Moderate**: A2 (lookup 최적성), A4 (mixture identifiability), 반박 1 (universal 정의) — 실용성 + 해석성 영향.
- **Minor**: A3 (변량 교환성) — Foundation model 의 일반적 가정, 큰 약점 아님.

종합적으로 *ICML 2024 Oral 등급* 의 demonstrable contribution 은 분명하나, *진정 universal forecaster* 라는 *논문 제목의 주장* 은 *quasi-universal in Energy/Transport/Climate-dominated regime* 으로 *재해석* 해야 정확. 본 논문의 위상은 *first credible attempt* 이지 *final answer* 가 아니다.
