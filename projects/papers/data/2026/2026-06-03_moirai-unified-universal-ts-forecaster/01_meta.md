# 0. 메타 & 선정 이유

## 인용 / 권위 / 컨텍스트

- **인용 수**: Semantic Scholar / Google Scholar 본 환경에서 접근 차단(403)되어 정확 수치 미확인. 다만 ICML 2024 **Oral** 등재(icml.cc/virtual/2024/oral/35515) + Salesforce AI Research 의 시계열 foundation model line(Chronos / Lag-Llama 동시기 경쟁작) + 후속 작 Moirai-MoE(arXiv:2410.10469) / Moirai-2.0(2025) 가 동일 저자진에 의해 출간되어 있다는 점에서 2024-2026 시계열 foundation model 분야의 **앵커 논문 중 하나**임은 확정적.
- **저자 권위**:
  - Gerald Woo & Chenghao Liu — Salesforce AI Research 시계열팀. CoST(ICLR 2022), TS2Vec, ForecastPFN 비교군 등 시계열 표현학습 라인의 연속작.
  - Caiming Xiong & Silvio Savarese — Salesforce CodeT5, BLIP, prompt tuning 등 FM 인프라.
  - Doyen Sahoo — corresponding 연구 리더.
- **DOI / 식별자**: arXiv:2402.02592 (v1 2024-02-04, v2 2024-05-22). PMLR v235 proceedings. doi:10.48550/arXiv.2402.02592.
- **코드 공개**: github.com/SalesforceAIResearch/uni2ts (Apache 2.0). Moirai-1.0-R, Moirai-MoE-1.0-R, Moirai-2.0-R 모델 weight 공개. LOTSA 데이터셋 fully open-sourced (저자 contribution #2).

## 근거 지도 (Evidence Map)

본 해체의 모든 구체 주장은 PDF 본문 다음 위치에서 verbatim 으로 추적:

| 항목 | 위치 | 핵심 내용 |
|------|------|-----------|
| Abstract | p.1 (PDF 1열 상단) | "i) cross-frequency learning, ii) accommodating an arbitrary number of variates, iii) addressing the varying distributional properties" 세 challenge 명시 |
| Contributions (3개) | p.2 (intro 끝) | (1) novel Transformer 아키텍처, (2) LOTSA 데이터셋, (3) zero-shot 경쟁력 |
| §3.1 Architecture | p.3 + Figure 2 | 마스크드 인코더, multi-patch-size projection, 평탄화 multivariate |
| §3.1.1 Multi Patch Size | p.3 | high-freq → 큰 patch, low-freq → 작은 patch (Appendix B.1 사전정의 표) |
| §3.1.2 Any-variate Attention | p.4 + Eq. (2)(3) | RoPE(시간) + 이진 attention bias u^(1), u^(2)(변량) |
| §3.1.3 Mixture Distribution | p.4 + Eq. (4) | Student-T / Negative Binomial / log-normal / low-var Normal 4-component (Appendix B.2 p.d.f.) |
| §3.2.1 LOTSA | p.4-5 + Tables 2-3 | 27.6B 관측, 9 도메인 (Energy 59.17%, Transport 17.73%, ...), Hourly 71.89% |
| §3.2.2 Pre-training | p.5 | seq len ≤ 512 (post-flatten), 예측길이 ∝ [0.15, 0.5] of window, beta-binomial(128, 2, 5) 으로 변량수 샘플 |
| §4.1 Monash in-distribution | p.6 + Figure 3 | normalized MAE 0.655 (Small) → 0.501 (Large) 추정 - Figure 3 |
| §4.2 Probabilistic OOD | p.6-7 + Table 5 | Electricity / Solar / Walmart / Weather / Istanbul Traffic / Turkey Power 6개 데이터셋, CRPS+MSIS |
| §4.2 Long sequence | p.7 + Table 6 | ETTh1/h2, ETTm1/m2, Electricity, Weather — iTransformer / TimesNet / PatchTST / Crossformer / TiDE / DLinear / SCINet / FEDformer 비교 |
| §4.3 Ablation | p.7-8 + Table 7 | "w/o multi patch size" → 0.655 → 1.156 (최대 악화), "w/o LOTSA" → 0.809 |
| §4.4 Further Analysis | p.8 + Figs 5,6 | context length scaling, packing 61.08% → 0.38% padding |
| §5 Limitations | p.8-9 | µP 미적용 / multi-patch-size 가 "heuristic" / 고차원 변량 제약 / latent diffusion 확장 가능성 |
| Appendix B.2 | p.17-18 | 4 mixture 컴포넌트 p.d.f. 명시, df > 2 lower-bound, σ=1e-3 low-var 명시 |
| Appendix B.3 | p.18 | Lag-Llama (대칭 Student-T 만), TimeGPT (conformal, 음수 예측 문제), LLMTime (categorical) 비교 |
| Appendix C.1 | p.19 | CRPS / MSIS 공식 (Gneiting & Raftery 2007 follow) |

## 선정 이유 — 지금 이 시점에 내가 왜 이걸 봐야 하는가

`_profile.md` 의 §D (TS Transformers / 2D / TSFM interp) + §E (금융 시계열 응용 — ProTran-TFA 라인) + APF (`Attention Pattern Fields`) 의 must-cite 우선순위에서 다음 세 가지 이유로 정중앙에 꽂힌다.

1. **APF 의 "PE × motif" 가설을 정면 검증할 변량(variate) 축 케이스**: Any-variate Attention 은 RoPE(시간 차원) + 이진 attention bias(변량 동일성 표지 u^(1)/u^(2)) 의 **이중-축 PE 디자인**이다. APF 의 핵심 가설 — "PE 변경이 attention motif 형태(diagonal / block / edge / spike / checker)를 직접 결정한다" — 를 시간×변량 2-축 setting 에서 가장 정직하게 검증할 수 있는 살아있는 baseline 이다. iTransformer(2026-05-06 ✓)가 "변량을 token 으로" 라는 변수 축 발상의 한 극단을 보여줬다면, MOIRAI 는 시간·변량 두 축을 한 sequence 로 평탄화해 두 종류의 PE 를 한 attention 안에서 충돌시킨다. 그 결과 motif 가 어떻게 분해되는지가 APF 의 다음 실험 후보다.
2. **ProTran-TFA(P1, paused)의 확률 예측 헤드 결정에 직접 지침**: Mixture-of-Distributions(Student-T + Negative Binomial + log-normal + low-var Normal) 가 Lag-Llama / TimeGPT-1 의 단일분포 헤드 대비 "flexible distribution" 의 구체 spec 을 제공한다. ProTran-TFA 의 분포 헤드 설계에서 "꼬리(꼬리분포) × 양수성 × 이산성" 결정을 4-mixture 로 분기하는 정확한 청사진을 얻을 수 있다(저자 직접 비교: 본 논문 §B.3).
3. **Grokking-TS Transformer 의 비정상성 vs 통합학습 가설을 측정**: §3.2.1 LOTSA 의 도메인 sampling cap ε=0.001 정책은 "데이터 불균형 하에서 일반화 지연 / phase transition" 을 측정하는 self-contained 환경을 제공. Grokking track 의 "non-stationarity × delayed gen" 4-way 교차의 한 축으로 활용 가능.
