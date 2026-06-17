# 10-b. 사고 확장 — Follow-up 논문 3편 (선행 / 경쟁 / 후속)

## (선행) DLinear — *"Are Transformers Effective for Time Series Forecasting?"* (Zeng et al., AAAI 2023; arXiv:2205.13504)

**어떤 논문인가**: PatchTST / Autoformer / FEDformer 등 트랜스포머 라인이 SOTA 를 자랑하던 시기에, "한 줄 linear 모델 (DLinear: trend + seasonal decomp 후 linear regression) 이 트랜스포머를 이긴다" 라고 충격적 주장. ETT/Weather/Traffic 등 표준 long-term TSF 에서 트랜스포머의 *추가 가치* 를 의심.

**본 논문과의 관계**: Tan 2024 의 *직접적 사상적 조상*. DLinear 가 *전체 트랜스포머* 의 가치를 의심했고, Tan 2024 는 *그 트랜스포머의 LLM 백본* 의 가치를 의심. 같은 *통제된 회의주의* 정신, 한 단계 더 sharp.

**무엇을 얻을 수 있는가**:
- DLinear 가 보여준 "단순함의 위력" 을 본 논문이 어디까지 확장하는지의 사상적 계보. ProTran-TFA 의 *minimal baseline* 정당화에 둘을 함께 인용.
- DLinear 후속들이 *왜 트랜스포머가 그래도 살아남았는가* 를 응답한 line (예: PatchTST 의 patch tokenization 이 인기) 의 흐름을 따라가면, *시계열에 진짜 필요한 inductive bias* 의 윤곽이 보임.
- 핵심 인용 구절: DLinear 의 "Are Transformers Effective?" 라는 질문 형식 자체를 Tan 2024 가 한 단계 더 narrow 하게 던졌다는 점.

## (경쟁) Chronos — *"Chronos: Learning the Language of Time Series"* (Ansari et al., arXiv:2403.07815; 2026-04-29 ✓)

**어떤 논문인가**: T5 backbone 을 처음부터 시계열 token (84B token) 으로 사전학습한 *진짜* 시계열 foundation 모델. zero-shot SOTA 주장.

**본 논문과의 관계**: *경쟁* 보다는 *complementary*. Tan 2024 의 결론 ("LLM 백본 무용") 의 *적용 범위 밖*. Chronos 는 *시계열* 로 사전학습됐으니 LLM-for-TS 비판이 직접 적용 안 됨. 그러나 Chronos 가 *진짜 사전학습 가치* 를 보였다면, 그 가치가 *어디서* 오는지는 본 논문의 ablation 적용이 답할 수 있는 질문.

**무엇을 얻을 수 있는가**:
- *TSFM 사전학습 가치 = 0 인가 양수인가* 의 검증. Tan 2024 ablation 을 Chronos 에 적용한 *후속* 연구가 자연스러운 다음 단계. Mishra 2026 (Dissecting Chronos SAE; 2026-05-27 ✓) 가 이미 SAE 입자로 *positive* 결과 보임.
- APF / Grokking 양 트랙에서 Chronos 의 *시계열 사전학습* 가중치를 분석할지, 아니면 *random-init PAttn* 으로 baseline 갈지의 선택 문제. 본 두 논문을 함께 읽으면 그 선택 정당화 가능.
- 핵심 인용 구절: "Chronos provides positive evidence that pretrained backbones can encode TS-specific features (Mishra 2026), but only when pretrained on TS data — not language data (Tan 2024)."

## (후속) Dissecting Chronos — *"Sparse Autoencoders Reveal Causal Feature Hierarchies in Time Series Foundation Models"* (Mishra, arXiv:2603.10071; 2026-05-27 ✓ ICLR 2026 TSALM Workshop)

**어떤 논문인가**: Tan 2024 의 *직후* 자연스러운 후속. 만약 LLM (자연어) 백본은 무용한데 Chronos (시계열 백본) 는 유용하다면, *Chronos 백본의 어떤 feature* 가 진짜 인과적 forecast 기여를 하는지를 SAE (Sparse Autoencoder) 로 분해.

**본 논문과의 관계**: Tan 2024 의 음성 결론을 *Chronos 에는 안 적용됨* 이라고 보이는 직접 검증. encoder.block.11 의 avg ΔCRPS=5.15, max=38.61 의 강력한 인과 신호.

**무엇을 얻을 수 있는가**:
- Tan 2024 의 *ablation = 거친 입자* 와 Mishra 2026 의 *SAE = 세밀 입자* 의 *상보적 toolkit*. 본 논문의 architecture-level ablation 으로 *어디까지* 가 무용한지 결정한 후, SAE 로 *살아남은 부분* 의 어떤 feature 가 critical 인지 측정.
- APF 의 motif typology + SAE feature 의 *결합* — 즉 *motif 단위 인과* 와 *feature 단위 인과* 를 동시 분해 하는 hybrid 분석. 사용자의 APF paper 가 이 hybrid 를 시도할 수 있는 *유일한 위치*.
- Grokking track 의 *grokking 중 feature 형성* 측정에 SAE 입자가 직접 채택 가능. Tan 2024 의 baseline 위에서 *grokking 시점에 SAE feature 가 polysemantic → monosemantic 으로 분리* 되는지 plot.
- 핵심 인용 구절: "Tan 2024 sets the architectural floor (1-layer attention sufficient for forecast), while Mishra 2026 reveals the feature-level ceiling (Chronos pretrained backbone encodes causal features). Our work occupies the middle: attention motif typology that operates on the floor and is detectable by the ceiling's tools."

## 세 논문의 *triangulation*

DLinear (조상) → Tan 2024 (본 논문) → Mishra 2026 (후손) 의 3-step chain 은 *시계열 ML 의 ablation-driven 인식론* 의 정확한 progression:

- **DLinear**: 전체 architecture 의 가치 의심 → linear baseline 충분.
- **Tan 2024**: LLM backbone 의 가치 의심 → 1-layer attention baseline 충분.
- **Mishra 2026**: TSFM backbone 의 feature 분해 → 특정 feature 가 인과적으로 critical.

이 chain 은 APF + Grokking 양 track 의 *방법론적 좌표* 를 정확히 설정한다 — APF 는 *attention motif 입자*, Grokking 은 *layer 깊이 + dynamics 입자*. 둘 다 위 3 논문의 *어느 한 입자* 의 sub-niche.
