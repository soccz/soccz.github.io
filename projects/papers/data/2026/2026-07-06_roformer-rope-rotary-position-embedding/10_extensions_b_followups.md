# 10.b 사고 확장 — Follow-up 논문 3편

RoPE 를 기점으로 세 방향의 논문을 추적할 것. 선행 / 경쟁 / 후속 각 1 편.

---

### Follow-up 1 (선행) — Kazemnejad et al. 2023 · "The Impact of Positional Encoding on Length Generalization" · arXiv:2305.19466 (NeurIPS 2023) · [2026-06-08 커버 완료]

**어떤 논문인가**: 5 종 PE (NoPE / abs_sinusoid / abs_learned / t5_relative_bias / ALiBi / RoPE variants) 를 통제 실험으로 비교해 **NoPE 가 length-generalization 에서 가장 우위** 임을 보인 논문. Small-scale synthetic reasoning task (scan, addition) 에서 NoPE 트랜스포머가 RoPE, ALiBi 를 모두 뛰어넘음.

**본 논문과의 관계**: RoPE 원 논문이 "sinusoidal 보다 우위" 는 보였지만 NoPE 는 비교 대상이 아니었다. Kazemnejad 는 "PE 없음" 이라는 극단 옵션을 정면 도입해 RoPE 의 우위 주장 범위를 좁혔다. 즉 RoPE 는 **large-scale LM 이 안정성 (특히 causal decoder) 을 얻는 실용적 표준** 이지, length-generalization 의 이론적 우승자는 아니라는 것.

**무엇을 얻을 수 있는가**: (i) APF 5-way PE 비교에서 NoPE 를 기준선으로 반드시 포함해야 한다는 프로토콜 결정. (ii) "RoPE 는 감쇠라는 편향을 심는다" 는 본 해체의 주장 (§07 반박 1) 을 실증 근거로 보강. (iii) NoPE 트랜스포머의 length-generalization 이 어떻게 이루어지는지가 mech interp 관점에서 미해결 문제로 남아 있어 (Kazemnejad 도 gap 지적), 사용자 Grokking-in-TS-Transformers plan §4 실험 그리드의 흥미로운 대조군.

---

### Follow-up 2 (경쟁) — Press et al. 2022 · "Train Short, Test Long: Attention with Linear Biases Enables Input Length Extrapolation" (ALiBi) · arXiv:2108.12409 (ICLR 2022)

**어떤 논문인가**: Attention 로짓에 $-|n - m| \cdot m_\text{head}$ 라는 **선형 bias** 만 더해 상대위치를 표현. Head 별로 slope $m_\text{head}$ 를 다르게 설정해 다양한 감쇠 속도의 attention 을 확보. RoPE 와 목표는 같지만 (파라미터-free 상대위치 + length-extrapolation) 구현 철학이 정반대 (multiplicative rotation vs additive bias).

**본 논문과의 관계**: RoPE 와 ALiBi 는 2021-2022 년 동안 나란히 등장해 modern LLM 의 PE 표준 자리를 두고 경쟁. 결과적으로:
- **RoPE 채택**: LLaMA (Meta), Mistral, Qwen, DeepSeek, GPT-J, PaLM, Gemma 등 대부분의 오픈·상업 LLM.
- **ALiBi 채택**: MosaicML MPT, BLOOM.

RoPE 가 우세한 이유는 (i) 이론적 우아함 (내적 항등식), (ii) 다양한 attention head 에서 균등하게 작동, (iii) content-aware 확장 (RoPE + XPos 등) 이 잘 됨. ALiBi 는 (i) 극단적 length-extrapolation (학습 512, 실운영 8k) 에서 여전히 강함, (ii) 구현 극단적 단순, (iii) 학습 시간 단축. 즉 두 방식은 여전히 진행 중인 경쟁.

**무엇을 얻을 수 있는가**: (i) APF PE-비교 실험의 대조 축. RoPE 의 rotation 감쇠 vs ALiBi 의 linear 감쇠가 motif 지도에서 다른 패턴을 만드는지 실증적 검증. (ii) 사용자 `_index.md` priority 목록의 다음 미커버 PE 후보로, 다음 pe-attention-geometry 커버 후보. (iii) 두 감쇠 함수 형태 (sinusoidal decay via interference vs linear penalty) 의 differential geometry 관점 대조는 APF paper 의 §6 (discussion) 에서 이론적 대비 자리로 좋은 재료.

---

### Follow-up 3 (후속) — Peng et al. 2023 · "YaRN: Efficient Context Window Extension of Large Language Models" · arXiv:2309.00071

**어떤 논문인가**: RoPE 를 학습된 최대 문맥 (예: 4k) 을 훨씬 넘겨 (128k, 1M) 확장하는 방법. 핵심 아이디어는 (i) 주파수 스펙트럼 $\theta_i$ 를 **저주파수 대역만** 스케일링 (high frequency 는 그대로 유지, low frequency 는 확장 비율에 맞게 압축), (ii) attention temperature 조정을 통해 확장된 문맥에서도 attention entropy 를 유지. NTK-aware scaling 의 정교화 버전.

**본 논문과의 관계**: RoPE 원 논문의 "회전각만 계산하면 임의 위치 확장 가능" 이라는 낙관적 주장이 실전 (long-context LLM 학습) 에서 무너진 지점을 정확히 지목·수리. YaRN 은 RoPE 의 감쇠 성질이 학습 최대 위치를 크게 넘기면 attention 이 무의미해지는 **주파수-대역별 aliasing 현상** 을 진단하고, 대역별 다른 처방 (high freq 유지, low freq 압축) 으로 해결.

**무엇을 얻을 수 있는가**: (i) RoPE 의 진짜 실전 한계 (§07 암묵 4) 가 어떻게 후속 연구에서 해소되었는지의 정석 사례. (ii) 주파수 대역 별 attention 기여도를 측정하는 방법론 (YaRN §3) 은 APF motif 분석의 mech interp 관점 확장에 그대로 이식 가능. (iii) 사용자 Grokking-in-TS-Transformers plan 이 궁극적으로 long-context TS-Transformer (예: 32k tick × 다중 asset) 를 다루려면 YaRN 계열 확장을 이해해야.

---

## Follow-up 셋의 통합 시야

세 논문을 함께 읽으면 RoPE 의 시간축 궤적이 그려진다:

1. **선행 (Kazemnejad)**: RoPE 는 어떤 조건에서 우세하고 어떤 조건에서는 NoPE 에 뒤진다.
2. **경쟁 (ALiBi)**: RoPE 가 유일한 답이 아니며 다른 축의 감쇠 방식이 병존한다.
3. **후속 (YaRN)**: RoPE 의 실전 한계는 주파수-대역별 정교화로 극복된다.

APF paper 의 §2 (related work) 에 이 셋을 나란히 배치하고, §3 (motif taxonomy) 에서 각 PE 가 유도하는 motif 예상을 명시하는 것이 자연스러운 구조. Grokking track 의 PE 실험 그리드 5-way (NoPE / sinusoidal / learned / RoPE / ALiBi) 결정도 이 셋을 기반으로 확정.

**세 후속 논문의 우선순위**: 사용자 `_index.md` priority 목록의 다음 pe-attention-geometry 커버 후보로 (i) ALiBi (Tier 1 ICLR, priority 매칭) → (ii) FIRE 또는 DAPE (Tier 1, priority 매칭) → (iii) tAPE/eRPE (Tier 2, TS 특화) 순으로 진행 권장.
