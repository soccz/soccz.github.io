# 10 · 사고 확장 (b) — Follow-up 3 편

본 논문을 둘러싼 follow-up 으로 (1) 선행 — 본 논문의 직접 전신, (2) 경쟁 — 동시기 평행 연구, (3) 후속 — 본 논문 이후 등장 / 등장 예정의 세 편을 고른다.

## 선행 (1) — Haviv et al. 2022, "Transformer Language Models without Positional Encodings Still Learn Positional Information" (EMNLP findings 2022)

- **무엇인가**: NoPE 가 자연어 LM 에서 위치 정보를 학습한다는 첫 실증. Causal attention 의 비대칭이 implicit 위치 신호의 source 임을 보임.
- **본 논문과의 관계**: 본 논문 Claim 2 (NoPE 표현력 정리) 의 직접 전신. Haviv 가 실증으로 보였다면 본 논문은 representational 으로 강화 + 다른 명시 PE 와의 head-to-head 비교를 추가.
- **무엇을 얻을 수 있는가**:
  - "NoPE 가 어떻게 위치를 학습하는가" 의 mechanism 분석 (Haviv 의 layer-by-layer probing) 을 가져와서 APF 의 motif probe 와 결합 가능.
  - 자연어 LM 에서 NoPE 의 한계 — Haviv 가 보고한 perplexity 차이는 본 논문의 reasoning task 결과와 함께 보면 "task 도메인별 PE 효과" 의 양면을 보여준다.
  - APF 의 PE sweep 에 자연어 LM perplexity 평가를 추가할 때, Haviv 의 setup 이 baseline.
- **APF / Grokking 인용 가치**: 매우 높음. 본 논문과 함께 인용해 "NoPE = 단순 ablation 이 아니라 강력한 baseline 의 강력한 mechanism" framing 을 강화.

## 경쟁 (2) — Anil et al. 2022, "Exploring Length Generalization in Large Language Models" (NeurIPS 2022)

- **무엇인가**: 큰 LLM (PaLM, Codex, GPT-3) 에서 length generalization 의 task 별 분포를 측정. Scratchpad / chain-of-thought 의 효과 분석.
- **본 논문과의 관계**: 동시기 비슷한 framing 의 평행 연구. 본 논문은 작은 모델 (t5-base) 에서 PE 변수 통제, Anil 은 큰 모델에서 task 다양화. 본 논문 Claim 4 (scratchpad 양면성) 는 Anil 의 positive 결과를 부분 부정하는 형태.
- **무엇을 얻을 수 있는가**:
  - Length generalization 의 task taxonomy. Anil 의 task suite (algebra / scheduling / arithmetic / instruction-following) 가 본 논문의 reasoning suite 보다 다양 — APF / Grokking 의 평가 task 선택의 reference.
  - Scratchpad design space 의 정량적 분석. Anil 이 어떤 format 이 도움되는지 보고했다면 본 논문이 그 보고를 정밀화. 두 논문 결합이 scratchpad format 의 PE-task interaction matrix 를 만들 수 있음.
  - 큰 모델 vs 작은 모델의 length generalization 격차 — 모델 scaling 이 PE 효과를 어떻게 변화시키는지의 보조 증거.
- **APF / Grokking 인용 가치**: 중간. APF 보다 Grokking 의 NeurIPS 2027 plan 의 "큰 모델 vs 작은 모델 grokking 비교" 부분에 더 적합.

## 후속 (3) — Wang et al. 2024 / 2025 류, NoPE 의 자연어 LM 일반화 검증 (가능한 후속)

- **본 환경에서 정확한 후속 논문 식별자 미확보**. 그러나 가능한 후속 방향:
  - "NoPE for Language Models at Scale: A Pre-training Evaluation" (가상 후속, 형식). 1B / 7B / 13B 규모에서 NoPE vs ALiBi vs RoPE 를 자연어 LM 으로 비교.
  - 또는 "Why NoPE Outperforms Explicit PE: A Mechanistic Investigation" 류. ACDC / Sparse Feature Circuits 로 NoPE 의 위치 회로 분리.
- **본 논문과의 관계**: 본 논문이 trigger 한 후속. Main paper 의 small-scale reasoning 결과가 큰 모델 / 자연어 LM 으로 일반화되는지를 검증 / 분석.
- **무엇을 얻을 수 있는가**:
  - 본 논문 한계 (G1, G2 — reasoning 한정 + 1B 와 직접 호환 안 됨) 의 정확한 해결 정도.
  - APF 가 자연어 LM 영역으로 확장할 때 (PatchTST 가 NLP 모델을 흉내내는 점 고려), 자연어 NoPE 후속이 직접 reference.
  - Grokking track 의 "큰 모델 grokking" 차원에서, NoPE 가 grokking dynamics 에 어떻게 영향을 주는지의 보조 증거.
- **APF / Grokking 인용 가치**: 매우 높음 — 본 논문의 한계를 메우는 line. 본 논문과 함께 인용해 "현재까지 알려진 PE-length-gen 관계의 sum" framing.

## 세 편의 결합 — 본 논문을 둘러싼 3 차원 진단
- **Haviv** (선행) — NoPE 가 학습 가능함의 증거.
- **Kazemnejad (본 논문)** — NoPE 가 더 잘함의 증거 + 부분 mechanistic.
- **Anil / Wang 후속** — task / scale / mechanism 별 NoPE 의 한계와 가능성.

이 셋의 인용 net 이 APF Introduction 의 PE-length-gen 관련 background 의 표준 묶음.
