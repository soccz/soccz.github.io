# 10b 사고 확장 — Follow-up 논문 3편

> **🧒 한 줄 요약**: *직접 후속*: Templeton scaling, Gemma Scope, SAE+RLHF integration, editable AI commercialization.


---

## Follow-up 1 (선행): Towards Monosemanticity — SAE의 기반
**Bricken, Templeton, et al. (Anthropic, 2023)**  
URL: transformer-circuits.pub/2023/monosemantic-features  
태그: `sae-features`

**어떤 논문인가**: SFC가 직접 기반하는 SAE 개발 논문. 512개 뉴런 → 4096개 특징으로 분해하는 SAE를 소개하고, 학습된 특징들이 인간이 이름 붙일 수 있는 개념(DNA, 법률어, 히브리 문자 등)에 대응함을 4가지 증거 방법으로 보인다. 손실함수(재건 손실 + L1 희소성)와 그 균형의 중요성을 상세히 분석.

**SFC와의 관계**: SFC는 이 논문 없이 성립할 수 없다. SAE 특징이 진짜 모노시맨틱이라는 전제를 이 논문이 제공한다. 그러나 이 논문은 "특징들이 어떻게 연결되는가"를 묻지 않는다 — SFC가 그 답을 제공한다.

**무엇을 얻을 수 있는가**: (1) SAE 학습의 세부 사항 — 어떤 하이퍼파라미터가 특징 품질에 영향을 주는가; (2) 특징 해석가능성의 4가지 검증 방법 — 내 실험에서 SAE를 처음 학습할 때 기준으로 사용; (3) 특징 보편성(universality) 예비 증거 — 다른 모델/레이어에서 비슷한 특징이 출현하는가. 이것이 시계열 Transformer에 SAE를 적용하는 근거가 된다.

---

## Follow-up 2 (경쟁): ROME — 신경망 편집의 다른 접근
**Meng, Bau, Belinkov, Goldwasser, Kim (NeurIPS 2022)**  
arXiv:2202.05262  
태그: `mech-interp-circuits / causal-intervention`

**어떤 논문인가**: GPT 계열 모델에서 "사실적 연관(factual association)"이 어느 레이어·MLP 뉴런에 저장되는가를 인과 개입으로 찾고, 그 부분을 직접 편집하여 모델의 지식을 변경하는 ROME(Rank-One Model Editing) 방법을 도입. SFC의 공저자 David Bau가 참여한 논문이기도 하다.

**SFC와의 관계**: 둘 다 인과 개입으로 특정 메커니즘을 찾고 편집하지만 접근이 다르다:
- ROME: "지식"을 MLP 가중치에 저장된 key-value 메모리로 모델링 → 가중치 직접 수정
- SFC: "행동"을 SAE 특징의 인과 경로로 모델링 → 활성화 ablation

ROME은 "무엇이 저장됐는가(정적 지식)"에 집중하고, SFC는 "어떻게 계산이 흐르는가(동적 처리)"에 집중한다. 금융 응용에서: ROME 스타일은 "이 모델이 bull 국면에 대한 지식을 어디에 저장하는가"를, SFC 스타일은 "bull 국면에서 예측 계산이 어떤 특징들을 통해 흐르는가"를 묻는다.

**무엇을 얻을 수 있는가**: ROME의 국소화(localization) 실험 방법은 APF에서 "어텐션 패턴이 어느 레이어에서 형성되는가"를 추적하는 데 참고 가능. 또한 ROME의 가중치 편집 vs SFC의 활성화 ablation의 트레이드오프 — ROME은 영구적(persistent) 편집, SFC는 추론 시 동적 편집 — 를 APF 논문에서 구분해 논의할 수 있다.

---

## Follow-up 3 (후속): Scaling SFC to Gemma 9B
**제목 확인**: "Scaling Sparse Feature Circuit Finding to Gemma 9B"  
**출처**: LessWrong / 학술 후속 연구 (검색에서 제목 확인, 정확한 arXiv ID 미확인)  
태그: `sae-features / mech-interp-circuits`

**어떤 논문/포스트인가**: SFC의 방법론을 Pythia-70M보다 훨씬 큰 Gemma 9B(90억 파라미터)에 적용하는 시도. 대형 모델에서 특징 회로 발견의 계산 비용, 품질, 발견된 회로의 특성이 소형 모델과 어떻게 다른지 탐구.

**SFC와의 관계**: SFC의 가장 자연스러운 후속이며, "소형 모델에서 성립하는 결과가 대형 모델에서도 유효한가"라는 SFC의 핵심 한계를 직접 공격한다.

**무엇을 얻을 수 있는가**: (1) 대형 모델의 SAE 특징 수와 회로 크기의 스케일링 법칙 — 내 실험이 결국 더 큰 모델로 가야 할 때의 설계 기준; (2) 계산 효율화 방법 — 대형 모델에서 IE를 효율적으로 계산하는 기법들; (3) Gemma 9B에서 발견된 회로들이 Pythia-70M과 어떻게 다른지 — 보편성(universality) 증거.

**한계 주의**: 이 논문의 정확한 arXiv ID를 확인하지 못했다 (LessWrong 포스트로 시작했을 수 있음). 이를 인용하기 전에 공식 논문 확인 필요.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **Templeton scaling 의 *Sonnet 까지 확장* 의 *technical 핵심*?**
2. **Gemma Scope 의 *democratization effect*?**
3. **SAE + RLHF 결합의 *reward hacking 방지* 적용?**

### 답변

1. **Distributed SAE training + sparse attention**. Sonnet 의 layer 수 (~80) × SAE size (1M features) = *massive parameter*. Distributed across 100+ GPUs + *efficient sparse attention* 으로 expand. Anthropic 의 internal infrastructure 가 *key enabler*.

2. **Reproduction barrier removal**. Gemma Scope = "SAE pre-trained, free download". 학계 + 학생이 *training step skip* → *circuit discovery 만* 수행 가능. *Cost*: A100 × 24h → 0 (just inference). → community 의 *SFC adoption* 폭발적 증가.

3. **Reward model debugging**. RLHF reward 의 SAE feature 분해 → "reward hacking" features (e.g., "긴 답변 prefer", "특정 phrase repeat") 식별 → 선택적 ablation. → *better-aligned RLHF*.
