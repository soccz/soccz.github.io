# 08. 이론적 계보

## 이론적 조상 (RoPE 가 딛고 선 어깨들)

### 1. Vaswani 2017 — Sinusoidal Positional Encoding (arXiv:1706.03762)

RoPE 의 주파수 스펙트럼 $\theta_i = 10000^{-2(i-1)/d}$ 는 정확히 Vaswani 2017 의 sinusoidal PE 파장 선택에서 왔다. Vaswani 도 "삼각함수 합공식이 상대위치를 자연스럽게 담을 수 있다" 는 직관을 밝혔지만 (원문 §3.5), 이를 **덧셈** 형태로 구현했다. RoPE 는 그 직관을 정확히 실현하기 위해 덧셈을 **곱셈** 으로 바꾼 것. 즉 RoPE 는 Vaswani 의 미완성된 목표를 "위치를 벡터에 더하지 말고 회전시켜라" 라는 재정식화로 완성한 논문이다.

### 2. Shaw 2018 · T5 (2020) — Relative Position Representations

Shaw 등은 "attention 은 절대 위치보다 상대 위치에 의존해야 한다" 는 주장을 처음 명시적으로 attention 로짓에 additive term $r_{n-m}$ 으로 구현. T5 는 이를 bucket 화. RoPE 는 이 "상대성 강조" 라는 문제 정의를 그대로 물려받되, additive term 이 아니라 **곱셈 회전** 으로 대체한 것. Additive → multiplicative 라는 축의 진화가 곧 RoPE 의 기여.

### 3. Transformer-XL / XLNet (2019) — Content/Position Decomposition

Dai 등은 attention 로짓을 content-content, content-position, position-content, position-position 네 항으로 분해하고, position 항에 학습 가능한 상대 벡터를 삽입. 이는 attention 구조 자체를 손보는 첫 시도. RoPE 는 이 "attention 구조 재정식화" 라는 방향성을 이어받되, 더 우아하고 파라미터-free 하게 재구성. Transformer-XL 이 무거운 잔향으로 뭉쳐 놓은 아이디어를 RoPE 가 단칸 방으로 정리한 셈.

### 4. Complex Embedding 계열 (Wang & Chen 2019 등)

RoPE 이전에도 complex-valued word embedding 시도들이 있었다 (예: "Encoding word order in complex embeddings", Wang & Chen 2019 arXiv:1912.12333). 이들은 단어를 복소수 벡터로 표현하고 위상을 위치 정보로 삼는 아이디어. RoPE 는 complex → real rotation 이라는 사상을 통해 이 흐름을 attention 내적 구조 안으로 옮겼다는 점에서 계보상 직접 계승.

## 평행 연구 (같은 시기, 다른 접근)

### 1. ALiBi (Press 2022, ICLR 2022 · arXiv:2108.12409)

ALiBi 는 attention 로짓에 **선형 bias** $-|n-m| \cdot m_{\text{head}}$ 를 더해 상대위치를 표현. RoPE 처럼 additional parameter 가 없고, RoPE 처럼 length-extrapolation 이 좋다. 차이점:
- **ALiBi**: 로짓에 additive bias, 감쇠는 선형 함수.
- **RoPE**: 벡터에 multiplicative rotation, 감쇠는 sinusoidal 상쇄 간섭.

ALiBi 는 구현이 더 간단하고 (attention mask 에 bias 만 더함), 학습 시간이 짧으며, extrapolation 이 매우 잘 됨. RoPE 는 rotation 구조가 있어 정보를 잃지 않고 상대각도로 완전 인코딩. 결과적으로 LLM 이 채택한 것은 RoPE (LLaMA, Mistral 등) 이지만, MosaicML MPT, BLOOM 등은 ALiBi 를 채택. 어느 것이 절대적으로 나은지 지금까지도 논쟁 중.

### 2. Position-Aware Attention (Kazemnejad 2023 · arXiv:2305.19466, 2026-06-08 커버)

Kazemnejad 등은 5 종 PE 를 통제 실험으로 비교해 **NoPE (positional encoding 없음)** 가 length-generalization 에서 오히려 우위임을 보였다. 이는 RoPE 를 포함해 모든 PE 방식이 특정 편향을 심는다는 반박. 즉 RoPE 는 sinusoidal 대비 우위지만, NoPE 대비는 아니라는 것 (특정 태스크 한정).

### 3. FIRE (Li 2024, ICLR 2024)

FIRE 는 위치 함수를 학습 가능하게 만드는 방향. RoPE 는 hyperparameter 로 스펙트럼을 고정, FIRE 는 데이터에서 학습. FIRE 가 특정 태스크에서 RoPE 를 상회한다는 결과. 하지만 RoPE 만큼 안정적이지는 않아 아직 LLM 표준 후보로 자리잡지는 못함.

### 4. DAPE (Zheng 2024, NeurIPS 2024)

Data-Adaptive PE. 위치 함수 자체가 입력 content 에 의존하도록 만든 방식. RoPE 의 암묵 가정 1 (content-position 상호작용 없음) 을 정면으로 완화. 아직 대규모 LLM 에 채택되지는 않았지만 방향성으로 흥미로움.

## 후손 (RoPE 의 진화)

### 1. NTK-aware scaling (2023, Reddit/HF community 발) → YaRN (Peng 2023 · arXiv:2309.00071) → LongRoPE (Ding 2024)

RoPE 의 감쇠 성질이 학습 최대 길이 (예: 2k) 를 넘기면 attention 이 붕괴하는 문제를 해결. 주파수 스펙트럼 $\theta_i$ 를 fine-tuning 시 재조정 (NTK-aware) 하거나 학습 (LongRoPE) 해 8k → 128k → 2M 문맥으로 확장. RoPE 원 논문의 "512→1024" 확장 실험이 이 계보의 시작.

### 2. Vision RoPE (2D RoPE, VRoPE, Heo 2024 ECCV)

RoPE 의 1D 회전을 2D 로 확장해 vision transformer 에 적용. 이미지 패치의 (x, y) 좌표를 두 축의 회전으로 표현. 원 논문의 1D 회전이 자연스럽게 2D 로 확장되는 것이 RoPE 의 강점.

### 3. ComRoPE (2025) · Rotary Value Embedding (2026 arXiv:2606.11275)

ComRoPE 는 회전각 행렬을 학습 가능한 commuting angle matrices 로 대체해 표현력을 늘림. RoVE 는 rotation 을 value 벡터에까지 확장. 둘 다 원 논문의 파라미터-free 정신을 부분 포기하지만 표현력을 얻음.

### 4. RoPE 회로 분석 (Circuit Complexity Bounds arXiv:2411.07602, Dimension Inefficiency arXiv:2502.11276)

Mechanistic interpretability 관점에서 RoPE 트랜스포머의 회로 복잡도·차원 활용을 이론적으로 분석. Dimension Inefficiency 논문은 RoPE 가 long-distance retrieval 에서 특정 차원을 낭비한다는 실증을 제출. 이는 사용자 관심 영역 §B (mech interp) + §C (PE geometry) 교차 지점.

## RoPE 의 계보상 위치 요약

- **선조**: Vaswani 2017 (sinusoidal 유산), Shaw 2018/T5 (상대성 요구), Transformer-XL (구조 재정식화), Wang-Chen 2019 (complex embedding).
- **동시대 경쟁자**: ALiBi (더 단순), NoPE (편향 없음), FIRE (학습 가능).
- **후손**: NTK/YaRN/LongRoPE (extrapolation), Vision RoPE (2D 확장), ComRoPE/RoVE (표현력 강화), 회로 분석 계열 (mech interp).

RoPE 는 이 계보에서 "이론과 실용의 균형점" 을 잡은 논문이다. Sinusoidal 만큼 파라미터-free 하고 T5-relative 만큼 상대성을 심으며 ALiBi 만큼 확장 가능하다. 이 세 축의 교집합에 자리잡았기 때문에 LLM 표준이 될 수 있었다.
