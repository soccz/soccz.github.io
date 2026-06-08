# 08 · 이론적 계보

## 이론적 조상 (4 편)

### 조상 1 — Vaswani et al. 2017, "Attention Is All You Need" (NeurIPS 2017)
- **무엇인가**: 트랜스포머 원조 논문. Sinusoidal absolute PE 를 처음 도입.
- **본 논문과의 직접 연결선**: 본 논문은 Vaswani 의 PE 가정 ("위치 정보를 명시적으로 주입해야 한다") 자체를 회의하고 NoPE 와 head-to-head 비교한다. 즉 본 논문은 Vaswani 의 5 종 후속 PE 와 그 PE 가 없는 baseline 의 통제 비교로 transformer 의 위치 인식 메커니즘을 다시 묻는다. Vaswani 2017 → 8 년 뒤 "사실 PE 안 써도 더 잘 했다" 라는 폭로형 후속.
- **연결의 강도**: 매우 강함 (논문 전체가 Vaswani 의 PE 가정 회의).

### 조상 2 — Su et al. 2021/2024, "RoFormer: Enhanced Transformer with Rotary Position Embedding" (Neurocomputing 2024)
- **무엇인가**: Rotary PE 의 원조. Query/key 의 회전 곱으로 상대 위치 의존 만듦.
- **본 논문과의 직접 연결선**: 본 논문이 비교 baseline 으로 Rotary 를 사용 (`pe_rotary`, `pe_newRot`, `pe_rotary_rerun`). Rotary 가 length extrapolation 의 강한 baseline 으로 자리 잡은 뒤, NoPE 가 그것을 이기는 protocol 을 설계.
- **연결의 강도**: 강함 (5 종 PE 중 한 핵심 baseline).

### 조상 3 — Press et al. 2022, "Train Short, Test Long: Attention with Linear Biases Enables Input Length Extrapolation" (ICLR 2022, ALiBi)
- **무엇인가**: ALiBi 의 원조. 거리에 비례한 음의 선형 bias 로 length extrapolation 가능함을 처음 보임.
- **본 논문과의 직접 연결선**: ALiBi paper 는 sinusoidal 과 비교해 외삽 능력을 강조했지만 **NoPE 와 비교 안 함**. 본 논문은 그 비교를 추가하고 NoPE 가 더 강함을 보임. 즉 본 논문은 Press 의 framing ("PE 의 형태 차이가 외삽 능력의 핵심") 을 부분적으로 부정 — "PE 자체가 없는 게 더 강하다".
- **연결의 강도**: 중간 (baseline 으로 사용 + framing 의 부분 부정).

### 조상 4 — Haviv et al. 2022, "Transformer Language Models without Positional Encodings Still Learn Positional Information" (EMNLP findings 2022)
- **무엇인가**: NoPE 가 자연어 LM 에서 위치 정보를 학습한다는 첫 실증.
- **본 논문과의 직접 연결선**: Haviv 가 "NoPE 가 위치 정보를 학습한다" 를 보였다면, 본 논문은 "NoPE 가 그 학습된 위치 정보로 명시 PE 를 이긴다" 를 보인다. + 표현력 정리로 representational 강화.
- **연결의 강도**: 매우 강함 (본 논문의 핵심 hypothesis 의 전신).

## 평행 연구 (4 편)

### 평행 1 — Chi et al. 2022/2023, "Dissecting Transformer Length Extrapolation via the Lens of Receptive Field Analysis" (arXiv 2212.10356)
- **무엇인가**: PE 별 length extrapolation 의 메커니즘을 receptive field 분석으로 설명.
- **본 논문과의 관계**: 본 논문과 거의 동시 / 비슷한 framing — PE 의 extrapolation 차이를 분석. Receptive field analysis 라는 다른 측정 도구 사용.
- **어떤 영역에서 누가 더 나은가**: 본 논문은 "통제 비교 + NoPE" 가 강하고, Chi 의 receptive field 는 "PE 의 외삽 실패 메커니즘 설명" 이 강함. 두 접근이 보완.

### 평행 2 — Anil et al. 2022, "Exploring Length Generalization in Large Language Models" (NeurIPS 2022)
- **무엇인가**: LLM 의 length generalization 을 다양한 task 에서 측정. Scratchpad / chain-of-thought 의 효과 분석.
- **본 논문과의 관계**: 본 논문이 Anil 의 task framework 를 사용/계승. Anil 은 scratchpad 의 효과를 positive 로 봤다면, 본 논문 Claim 4 는 그것을 부분 부정 ("scratchpad is not always helpful").
- **누가 더 나은가**: Anil 이 큰 모델 (PaLM 등) 에서 보이고, 본 논문은 작은 모델 (t5-base) 에서 PE 변수 통제. 두 결론을 종합하면 "scratchpad 의 효과는 모델 규모 / task / format 에 의존" — 한 단계 더 정밀.

### 평행 3 — Sun et al. 2023, "A Length-Extrapolatable Transformer" (xPos, ACL 2023)
- **무엇인가**: Rotary 를 확장한 xPos 라는 새 PE 가 length extrapolation 잘 함을 주장.
- **본 논문과의 관계**: 본 논문이 직접 비교는 안 함 (코드에 xPos 옵션 없음). 그러나 xPos 가 본 논문의 Rotary 변형 (`pe_newRot`) 에 가까울 수 있음 — 두 논문이 같은 "Rotary 의 개선" 방향을 시도하고, 본 논문은 그것을 NoPE 와 비교.
- **누가 더 나은가**: xPos 가 자연어 LM 에서 강함, 본 논문이 reasoning task 에서 NoPE 우위 주장. Task 별 ranking.

### 평행 4 — Li et al. 2024, "Functional Interpolation for Relative Positions Improves Long Context Transformers" (FIRE, ICLR 2024)
- **무엇인가**: 학습 가능한 함수로 위치 거리를 매핑하는 새 PE.
- **본 논문과의 관계**: FIRE 가 본 논문 이후. FIRE 는 Kazemnejad 의 결과를 인용하고 명시 PE 의 길이 일반화 한계를 인정하면서, 그것을 학습 가능한 함수로 극복하려는 시도. 즉 본 논문이 motivation 의 일부.
- **누가 더 나은가**: FIRE 가 새로운 PE 의 가능성을 보이고, 본 논문이 명시 PE 의 한계를 인정. 본 논문은 framework 측, FIRE 는 새 방법 측.

## 후손 예측 (3 가지 방향)

### 후손 1 — NoPE 의 mechanistic 깊이 분석 (실제 등장 가능성 매우 높음)
- 본 논문이 KL 분석으로 닮음만 측정. NoPE 의 implicit 위치 신호가 어느 layer / 어느 head 에서 정확히 emerge 하는지 mechanistic interpretability 도구 (ACDC, Sparse Feature Circuits) 로 분석하는 후속.
- 실제 등장: 2024-2026 에 다수. 본 논문 인용 횟수에서 mechanistic 후속이 큰 비율을 차지할 것으로 추정 (본 환경에서 인용 데이터 미확보로 정확한 수치 단정 X).

### 후손 2 — NoPE 의 자연어 LM 평가 검증
- 본 논문 결과가 자연어 LM 에 일반화되는지의 검증 후속. WikiText / C4 / PG-19 등에서 NoPE 가 명시 PE 와 어떻게 비교되는지.
- 실제 등장: Kazemnejad et al. 의 HuggingFace 1B CodeLLM 이 이미 부분적인 답 (코드 LM). 자연어 LM 으로의 후속은 본 논문 framing 의 핵심 한계를 메우는 작업.

### 후손 3 — TS Transformer 의 NoPE 평가 (APF 관련)
- TS 도메인 (TimesNet, PatchTST, iTransformer 등) 에서 NoPE 가 어떻게 작동하는지. TS 의 PE 는 자연어 PE 와 다르게 (시간성 / 주기성) 의미가 있으므로, NoPE 가 TS 에서도 우위인지 비자명.
- 실제 등장: 본 환경에서 확인된 직접 후속 없음. 그러나 Yang TAPPA 2026 의 frequency-channel × q-similarity 분석은 PE 의 frequency 구조의 영향을 연구하는 line — TS 에서의 NoPE 평가의 부분적 답이 될 수 있음.

## 본 논문의 위상 — 한 문장
**Vaswani 2017 → ALiBi 2022 / Rotary 2021 (명시 PE 의 개선 경쟁) → Kazemnejad 2023 (NoPE 가 더 강함을 통제 비교로 보임) → FIRE 2024 / NoPE 의 mechanistic 후속 (명시 PE 의 학습 가능 함수화 + NoPE 의 회로 분석)** 의 흐름에서, 본 논문은 **"명시 PE 경쟁의 무의미함" 을 폭로한 변곡점**.
