# 10.a 사고 확장 — 자문 질문 5개

RoPE 를 읽고 나서 스스로에게 남긴 다섯 개의 질문. 각 질문 아래 "왜 이 질문이 중요한가" 를 2-3 줄로 첨부.

---

### Q1. RoPE 의 감쇠 성질은 시계열 도메인에서 정말 불리한가?

원 논문은 감쇠 (Claim 3) 를 이점으로 선언한다 — "가까운 토큰이 더 강한 attention 을 받는다" 는 편향이 언어 모델링의 지역성 (locality) 가정과 잘 맞는다는 것. 하지만 시계열, 특히 금융 시계열은 **원거리 의존성이 지배적** (지난달 정책 이벤트가 오늘 가격에 영향) 이라 감쇠가 병목이 될 가능성.

- **왜 중요한가**: APF 의 motif 편향 가설 ("PE 가 어떤 motif 를 유리하게 만드는가") 의 핵심 실증 가능한 예측이 이 질문에 걸려 있다. RoPE = diagonal-band 유도라는 가설이 성립하면 시계열에서는 RoPE 가 아닌 대안 (ALiBi, NoPE, learnable-θ RoPE) 을 채택해야 한다.
- **검증 프로토콜 (스케치)**: 5-way PE × 3-domain (자연어 · 코드 · 시계열) × 2-model-size 격자에서 (i) motif 분류 확률, (ii) downstream 성능, (iii) 상대거리별 attention magnitude 곡선을 측정. 도메인별 편향 방향이 다르다는 결과가 나오면 이 질문의 답은 "그렇다" 로 확정.

---

### Q2. Grokking timing 을 PE 가 얼마나 shift 시킬 수 있는가?

Nanda 2023 은 modular arithmetic 에서 grokking 이 회로 형성 (특정 Fourier feature) 을 통해 일어남을 보였다. Merrill 2023 은 sparse/dense subnetwork 경쟁으로 재구성. 두 논문 모두 attention 구조 (head 수, layer 수, width) 는 실험 변수로 두었지만 **PE 는 상수** 로 다뤘다 (주로 no-PE 나 learned-PE).

- **왜 중요한가**: Grokking-in-TS-Transformers plan §4 에서 PE 를 실험 축으로 넣을 근거를 여기서 얻는다. 만약 PE 가 grokking timing 을 크게 조절한다면, 그 자체가 새로운 발견 지점이 되고 회로 형성에 PE 가 개입하는 메커니즘을 mech interp 로 파고들 수 있다.
- **검증 프로토콜**: TS-Transformer (P2 logistic 4-layer) × 5-PE × 3-seed 로 grokking curve (train/test loss vs epoch) 를 측정. PE 별 phase transition epoch 의 분산이 seed 분산보다 크면 PE 효과가 확립.

---

### Q3. RoPE 의 주파수 스펙트럼을 도메인별로 재학습하면 성능이 얼마나 개선되는가?

원 논문의 $\theta_i = 10000^{-2(i-1)/d}$ 는 Vaswani 2017 의 자의적 선택을 물려받았다. Frontiers 2025 는 fixed-θ 를 character-level LM 에서 바꾸면 성능·효율이 크게 변한다고 보고. 하지만 **도메인별 최적 스펙트럼이 다르다** 는 체계적 실험은 아직 미완성.

- **왜 중요한가**: RoPE 의 사용 표준이 굳어진 상태에서 (LLaMA, Mistral 등) 이 hyperparameter 를 바꾸는 것은 실용상 큰 impact. 특히 사용자의 시계열 도메인에서 최적 스펙트럼이 언어와 다르다면 이는 APF paper 의 최소한의 실용적 기여점이 될 수 있다.
- **검증 프로토콜**: 4-domain (자연어 · 코드 · 자연시계열 · 금융시계열) × learnable-θ (initialization: sinusoidal vs random vs linear) × 5-seed. Fine-tune 후 최적 $\theta_i$ 분포의 도메인별 차이를 시각화. 만약 자연시계열과 금융시계열이 언어와 다른 대역을 선호하면 이 질문의 답은 "예, 크다" 로 확정.

---

### Q4. RoPE 회전이 특정 attention head 를 어떤 회로 primitive 로 유리하게 만드는가?

Wang 2023 IOI Circuit 은 GPT-2 small 이 name mover / negative / duplicate 등 6-class head 로 회로를 구성함을 보였다. 이 회로들은 no-PE 나 learned-PE 로 학습된 것. RoPE 를 쓰면 회로 구성이 어떻게 변하는가? 특히 induction head 같은 상대위치 의존 head 는 RoPE 회전 감쇠에 의해 유리해지는가?

- **왜 중요한가**: Mech interp 관점에서 PE 는 회로 진화의 조건을 결정한다. RoPE 가 특정 회로를 유리하게 만든다면 (Kalnāre 2025 mech interp for TS classification 을 확장해) TS-transformer 회로 지도의 PE-dependent 편향을 밝힐 수 있다.
- **검증 프로토콜**: 동일 태스크·데이터 × 5-PE × ACDC (Conmy 2023) circuit discovery 를 반복 실행해 발견된 회로 그래프를 비교. PE 별로 발견된 회로가 통계적으로 유의미하게 다른지 (그래프 edit distance 등) 측정.

---

### Q5. RoPE 의 회전 각도 분포가 grokking 의 sudden phase transition 순간에 어떻게 변하는가?

Nanda 2023 은 grokking 순간에 "restricted loss" 가 급락하는 것을 회로 관점 progress measure 로 관찰. Merrill 2023 은 뉴런 sparsity 급증을 관찰. 그런데 **RoPE 트랜스포머의 grokking 순간에 회전각 활용 분포가 어떻게 변하는가** 는 아직 관찰되지 않은 영역.

- **왜 중요한가**: RoPE 의 회전 스펙트럼 중 실제로 사용되는 대역이 grokking 전후로 바뀐다면, 이는 회로 형성이 특정 주파수 성분에 의존한다는 새로운 progress measure 의 후보. Grokking 의 mech interp 관점 (§B) 과 PE geometry (§C) 의 교차점.
- **검증 프로토콜**: RoPE modular arithmetic 트랜스포머 (Nanda 2023 setup 을 RoPE 로 대체) 를 학습하며 매 epoch 마다 각 회전 주파수 대역 $\theta_i$ 별 attention magnitude 를 측정. Grokking 순간 전후로 사용 대역이 shift 하는지 시각화. 만약 특정 저주파 대역이 급격히 활성화되는 순간이 grokking phase transition 과 일치하면 이 질문의 답은 "예, 강한 signal" 로 확정.

---

## 다섯 질문의 종합

이 다섯 질문은 세 축을 관통한다:

- **Q1, Q3**: APF track (motif 편향, 스펙트럼 최적화)
- **Q2, Q5**: Grokking track (PE ↔ grokking timing 및 회로 진화)
- **Q4**: 두 track 의 교차점 (RoPE circuit primitive)

Q1 과 Q3 은 즉시 검증 가능한 파일럿 실험이 세팅 가능하고 (기존 APF codebase 확장), Q2·Q4·Q5 는 6 개월-1 년 단위 연구 방향의 씨앗이다. 다음 파일 (`10_extensions_b`) 에서 follow-up 논문 3 편, 그 다음 (`10_extensions_c`) 에서 이 질문들을 구체 실험 프로토콜 2 개로 구조화한다.
