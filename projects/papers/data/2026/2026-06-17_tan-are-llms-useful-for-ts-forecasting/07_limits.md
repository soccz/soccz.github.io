# 07. 가정·한계·반박

## 명시된 가정 (저자가 대놓고 말한 것)

본 환경 PDF 미접근으로 *저자가 본문에서 명시한 가정* 의 정확한 문장은 단정 불가. 단정 가능한 명시 가정 후보:

1. **평가 범위는 "LLM (자연어 사전학습) → TS" 라인**. Chronos/MOIRAI/TimesFM 같은 *시계열 사전학습* 모델은 본 결론의 적용 범위 밖. 저자들이 본문에서 이를 분명히 분리한다고 추정 (NeurIPS reviewer 가 반드시 요구하는 disclaimer).
2. **평가는 in-domain point forecast**. zero-shot, 분포 forecast, tail-aware 평가에서의 결론은 별도. 본문 Conclusion / Discussion 절에서 명시 추정.
3. **base 3 (OFA, Time-LLM, CALF) + LLaTA 가 LLM-for-TS 라인의 representative sample** 이라는 가정. 다른 LLM-for-TS 변형 (예: TEMPO, LLM4TS, Lag-Llama 의 LLM-prior 변형) 에서도 같은 결론인지는 미검증.

## 암묵적 가정 (말은 안 했지만 깔려 있는 것 — 4개)

### (1) "어댑터 + 1-layer attention 의 표현력 = LLM 백본의 표현력" 이라는 *capacity-saturation 가정*

본 ablation 이 의미 있는 것은 *어댑터+1-layer attention 만으로도 시계열 forecast 의 함수 클래스를 표현* 할 수 있을 때만이다. 만약 시계열의 어떤 *깊은* 함수 구조가 있어 LLM 의 N-layer stack 이 필요한데 이 데이터셋들은 그게 *우연히* 단순해서 1 layer 로도 충분한 거라면, *더 복잡한 시계열* (예: 다중 주파수 결합 + long-range dependency 가 강한 climate / cosmology / 금융 multi-asset) 에선 다른 결론이 나올 수 있다.

검증 가능 실험: PAttn 의 `e_layers` 를 1 → 2 → 4 → 8 로 변화시키고 성능 변화 plot. saturate 위치가 *1* 이면 본 결론 강화, *8* 이면 약화.

### (2) "표준 long-term TSF 벤치 = TS forecast 의 representative 합" 이라는 *coverage 가정*

ETT/Weather/Traffic/Illness 의 7 데이터셋은 *산업 sensor + 기상 + 의료* 의 좁은 도메인. 금융 시계열 (FX, equity returns, vol surface), 음성, 생체 신호, 천체 등 다른 도메인 에서도 같은 결론인지는 미검증. 시계열의 *통계적 구조 다양성* 이 7 데이터셋 으로 충분히 sample 됐는가는 의문.

검증 가능 실험: 본 ablation 격자를 *금융 SP500 returns (1995-2024 daily)*, *Gravity-wave LIGO*, *Speech LibriSpeech* 등 *out-of-traditional-benchmark* 도메인 에서 반복. 만약 결과가 robust 라면 본 결론은 진짜 보편적.

### (3) "Pretrained LLM 의 가치 ≈ 사전학습 가중치 자체" 라는 *attribution 가정*

본 ablation 은 *사전학습 가중치 vs 무작위 초기화* 의 비교다. 그러나 LLM 의 가치는 가중치만이 아니라:
- 아키텍처 자체 (multi-layer transformer 의 표현력)
- pretraining recipe (대규모 corpus, scaling law 의 emergent behavior)
- training algorithm 의 inductive bias

가 *합쳐서* 만들어진다. 만약 *frozen pretrained weights* 가 정말 무용하더라도, *random-init 의 multi-layer transformer* 는 *single-layer attention* 보다 더 좋을 수 있다 — 즉 *깊이* 자체가 가치일 수 있음. 본 논문은 이 분해를 안 함.

### (4) "Patch tokenization + channel-independence 의 inductive bias 가 모든 시계열에 fair" 라는 *base 유지 가정*

본 ablation 은 base method 의 입출력 구조를 그대로 유지한다. 그러나 *patch tokenization + channel independence* 자체가 강한 inductive bias 다 — 만약 다른 base (예: iTransformer 처럼 *variate-wise tokenization*) 에서 ablation 을 했다면 다른 결론이 나올 수 있다. 즉 본 ablation 의 결론은 *patch + channel-indep* 어댑터 setting 에 *조건부*.

## 반박 가능한 지점 — 3개

### 반박 1 — "Chronos / MOIRAI / TimesFM 은 이 결론에 면역이다"

**핵심**: 본 ablation 은 *자연어로 사전학습된 LLM* 의 시계열 무용성을 보일 뿐, *시계열로 사전학습된 TSFM (Time Series Foundation Model)* 의 효용은 부정하지 않는다. Chronos (LM language 가 아니라 *시계열 token* 으로 T5 처음부터 학습), MOIRAI (LOTSA 27.6B token), TimesFM (decoder-only TSFM) 같은 라인은 *진짜 사전학습 가치* 가 있을 수 있다.

**저자의 가능한 반박**: 본 논문은 *LLM-for-TS* 만 다룬다고 분명히 한다. TSFM 은 *별도 평가* 필요. 그러나 *Mishra 2026 (Dissecting Chronos SAE; 2026-05-27 cover)* 가 Chronos 의 *causal feature hierarchy* 를 SAE 로 분해한 결과: encoder.block.11 평균 ΔCRPS=5.15 / max=38.61 로 *실제로 시계열 특정 feature 가 사전학습 중에 형성됨* 을 보임. 즉 TSFM 사전학습은 유효.

**검증 실험**: Chronos / MOIRAI / TimesFM 에 본 ablation 격자 적용. w/o backbone 으로 성능이 떨어지면 → TSFM 사전학습 *진짜* 가치 입증. 안 떨어지면 → 본 논문 결론 더 광범위.

### 반박 2 — "Zero-shot / cross-domain 에서는 다를 것"

**핵심**: LLM 의 진가는 in-domain fine-tune 이 아니라 *언어 사전지식이 transfer 되는 cross-domain* 에 있다. 본 논문은 *in-domain* 만 평가했으므로 LLM 의 가장 광범위한 use-case 를 놓침.

**저자의 가능한 반박**: few-shot 실험으로 부분 응답. 그러나 *진짜 zero-shot* (예: Monash 29 데이터셋 cross-domain, GIFT-EVAL benchmark) 평가는 본 논문에 없음.

**검증 실험**: OFA / Time-LLM / CALF 를 *학습 안 한 도메인* 에 zero-shot 평가하고, 그 위에 본 ablation 적용. 만약 zero-shot 에서 LLM 가치 = 양수면 *반박 성립*. 만약 zero-shot 에서도 ablation 동등이면 *본 결론 보강*.

### 반박 3 — "분포 forecast / tail-aware 에선 다를 것"

**핵심**: 본 평가는 MSE/MAE point forecast 만. *분포 forecast* (CRPS, NLL) 와 *tail-aware* (quantile loss, expected shortfall) 에서 LLM 의 *분포 prior* 는 가치를 가질 수 있다. 특히 *금융* 응용에선 tail-risk 가 점 forecast 보다 중요.

**저자의 가능한 반박**: 본 논문 범위 외. 그러나 *Tang-Matteson ProTran (2026-05-19 cover)*, *Rasul TimeGrad (2026-05-26)*, *Shao QuantileFormer (2026-05-19)* 같은 분포 forecast 라인 의 LLM 변형은 *별도 평가 필요*.

**검증 실험**: OFA + quantile head, Time-LLM + Student-T head 변형에 본 ablation 적용. CRPS 가 ablation 으로 같이 유지되면 → 본 결론 광범위. 떨어지면 → 분포 forecast 에선 LLM 가치 유의미.

## 재현성 평가

| 항목 | 평가 |
|---|---|
| 코드 공개 | ✅ 저자 공식 GitHub `BennyTMT/LLMsForTimeSeries` — 4 base method × ablation 스크립트 + PAttn 전체 코드 |
| 데이터 공개 | ✅ 모든 데이터셋이 공개 표준 벤치 (Informer 라인) — `Autoformer` repo 에서 직접 가져옴 |
| 하이퍼파라미터 명시 | ✅ argparse 디폴트 보존 / 별 script 별 args |
| Seed 평균 회수 | ⚠️ 본 환경 미확인 — 보통 3~5 seed 가 표준 |
| 분산 보고 (mean ± std) | ⚠️ 본 환경 미확인 — Appendix 에 있을 가능성 |
| 학습 시간 / 자원 | ✅ Time-LLM 28.2× / OFA 2.3× / LLaTA 1.2× 의 *상대* 절감 보고. 절대 GPU 시간은 본 환경 미확인 |
| 환경 / 라이브러리 버전 | ⚠️ requirements.txt 가 repo 에 있는지 본 환경 미확인 |

**총평**: 코드+데이터+스크립트 공개로 *재현성 인프라* 는 표준 이상. *통계적 안정성* (seed 평균, 분산 보고) 만 확인되면 NeurIPS 표준의 high-bar 재현성.

## 한계 한 줄 요약

> **"본 논문은 '*자연어 LLM 가중치를 그대로 가져온 in-domain point forecast*' 의 좁은 범위에서 LLM 무용을 강하게 보였으나, *TSFM (시계열 사전학습)*, *zero-shot/cross-domain*, *분포/tail-aware forecast*, *더 큰 데이터셋 / 더 깊은 LLM 비교* 의 4가지 차원에선 결론이 외삽되지 않는다."**
