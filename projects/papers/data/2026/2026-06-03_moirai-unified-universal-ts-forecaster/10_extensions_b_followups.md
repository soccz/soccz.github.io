# 9-B. Follow-up 논문 3편 (선행 / 경쟁 / 후속)

## 선행 — Why Attention Patterns Exist (TAPPA) [본 사이트 2026-05-04 ✓]

**arXiv:2601.21709 · ICLR 2026 · Yang, Wang, Li, Bai, Tong, Zhen, Hao, Yuan, B. Li (USTC + Huawei Noah's Ark)**

**어떤 논문인가**: Attention patterns 의 *origin* 을 q-similarity (query similarity) 의 *temporal perspective* 로 통일 분석. RoPE 의 freq-channel 분해 와 q-similarity 의 관계 정량화. APF 의 *PE → motif → CNN probe → causal intervention* framework 의 *직접 선행*.

**본 논문 (MOIRAI) 과의 관계**: TAPPA 가 *attention pattern 의 형성 메커니즘* 을 q-similarity 로 환원한다면, MOIRAI 의 Eq. (2) 의 RoPE × 이진 bias 디자인은 *그 q-similarity 가 시간×변량 두 축에서 어떻게 *분리* 되는지* 의 *구체적 architectural 인스턴스*. TAPPA framework 에 MOIRAI 의 *2-축 RoPE + binary bias* 를 *대입* 하면 attention motif 의 *4-사분면 분해* 가 *이론적으로 derivable* — APF 의 다음 실험의 *이론 백본*.

**무엇을 얻을 수 있는가**: APF Paper 의 *Theoretical Foundation* 절을 TAPPA 에 anchor 시키되, *2-축 확장* 의 specific instantiation 으로 MOIRAI 를 다루는 *triad* 구조 (이론: TAPPA → 인스턴스: MOIRAI → 검증: APF). 본 사이트의 2026-05-04 TAPPA 해체와 2026-06-03 MOIRAI 해체를 *교차참조* 시 APF 의 *Related Work* 의 §2.1, §2.2 가 결정.

## 경쟁 — Chronos: Learning the Language of Time Series [본 사이트 2026-04-29 ✓]

**arXiv:2403.07815 · TMLR 2024 · Ansari, Stella, Turkmen, Zhang, Mercado, Shen, Shchur, Rangapuram et al. (Amazon, UC Berkeley, NYU)**

**어떤 논문인가**: T5 backbone + *시계열 값을 quantization bin 으로 tokenize* + autoregressive 학습. *언어모델 패러다임* 의 시계열 직접 적용. zero-shot benchmark 에서 *univariate 시계열* 강함.

**본 논문 (MOIRAI) 과의 관계**: 정확히 동시기 (2024 ICML / TMLR), 같은 *zero-shot universal forecaster* 목표. *직접 경쟁*. 차이:
- Chronos: T5 autoregressive, categorical distribution, univariate, 텍스트 인프라 재사용.
- MOIRAI: masked encoder, 연속 mixture, 다변량, 시계열 특화 디자인.

**무엇을 얻을 수 있는가**:
1. *Encoder-only vs Decoder-only* + *Categorical vs Continuous mixture* 의 4-사분면에서 두 모델이 *어느 사분면에 강한지* 의 *정량 분기*. APF / ProTran-TFA / Grokking-TS 모두에서 *baseline 선택* 의 *guideline*.
2. Mishra 2026 의 *Dissecting Chronos: SAE* (본 사이트 2026-05-27 ✓) 가 Chronos 의 *interpretability* 를 다뤘다 — MOIRAI 에 같은 SAE 분석을 적용한 *Dissecting MOIRAI* 가 *자연스러운 후속 연구*. APF + tsfm-interp 의 교차 주제.
3. TS 의 *진정 universal forecaster* 는 *encoder + decoder hybrid* 일 가능성 — 두 논문의 *서로 다른 강점* 통합이 다음 패러다임.

## 후속 — Moirai-MoE: Empowering TS Foundation Models with Sparse Mixture of Experts

**arXiv:2410.10469 · 2024-10 · Liu, Liu, Woo, Aksu, Liang, Zimmermann, Liu, Savarese, Xiong, Sahoo (Salesforce + NUS)**

**어떤 논문인가**: 동일 저자진 (Woo, Liu, Savarese, Xiong, Sahoo) 의 *직접 후속*. MOIRAI 의 dense FFN 을 *sparse Mixture-of-Experts* 로 교체. *유효 활성 파라미터* 와 *총 파라미터* 분리해 *fixed inference cost 로 더 큰 capacity*.

**본 논문 (MOIRAI) 과의 관계**:
- MOIRAI 의 *Small/Base/Large 3 size scaling 미확실* (§4.2 본문, Large 가 Base 보다 일관 우위 아님) 한계의 *직접 해결책*. MoE 가 *parameter scaling* 의 효율 문제 우회.
- MOIRAI 의 architecture 3 component (multi-patch / any-variate / mixture head) 는 *유지*, FFN 만 교체 — *modular 개선*.

**무엇을 얻을 수 있는가**:
1. *TSFM 에서 MoE 의 효과* — NLP MoE (Switch Transformer, GLaM, Mixtral) 의 TS 도메인 transfer.
2. *MoE expert specialization* 이 *시계열 도메인 / freq 에 따라 routing* 하는지 — 만약 routing 이 *도메인별 분기* 라면 *해석 가능*; 만약 *uniform* 이라면 MoE 가 *capacity 만* 늘렸을 뿐.
3. APF 의 *motif × head specialization* 분석을 *MoE expert specialization* 으로 확장. *motif × expert × layer* 의 3-축 분석 가능.

추가 시야: Moirai-2.0 (2025) 도 동일 저자진. MOIRAI → Moirai-MoE → Moirai-2.0 의 *evolutionary line* 이 *TSFM 의 best practice* 의 *연속 update* — 본 분야의 *anchor 시리즈* 로 자리잡음.
