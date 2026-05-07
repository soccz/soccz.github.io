# 09. 내 연구와의 연결

> **이 섹션은 `_profile.md`의 §A~F와 보유 자산(APF, Grokking)을 기준으로 작성한다. 일반론 금지 — 구체적 mechanism/axis/수식 연결만.**

---

## §C + §D — APF (Attention Pattern Fields): 핵심 연결

### 연결 1: 2D 어텐션 모티프 분류 체계의 '역전 축' 비교군

APF 연구의 핵심 주장은 "TS 트랜스포머의 T×T 어텐션 맵에 대각선/블록/스트라이프/엣지/스파이크/체커 패턴 등의 2D 모티프가 존재하며, 이 모티프가 예측 성능에 인과적으로 기여한다"는 것이다.

iTransformer는 이 주장에 직접적 도전 질문을 제기한다:

> **"T×T 모티프를 완전히 포기하고 N×N 어텐션으로 대체했더니 SOTA를 달성했다 — 그렇다면 T×T 모티프의 예측 기여는 과대평가된 것인가?"**

APF 논문의 Discussion 또는 Related Work 섹션에서 iTransformer를 인용하며 이 질문에 답해야 한다. 가능한 두 가지 답:

- **답 A (APF 지지)**: iTransformer가 잘 작동하는 이유는 "변수 상관 포착"이지, T×T 모티프가 쓸모없기 때문이 아니다. 단변량 또는 저변수 TS에서는 T×T 모티프가 여전히 중요하다.
- **답 B (APF 수정)**: T×T 모티프의 기여가 실제로는 N×N 어텐션으로 대체 가능하다. 따라서 APF는 "T×T 모티프가 언제 필수이고 언제 부차적인가"를 조건부로 논의해야 한다.

**구체적 인용 초안**: APF 논문 §3(Motif Causality) 말미에:
> "이 분석은 T×T 어텐션 맵의 모티프가 예측에 인과적으로 기여함을 보인다. 단, Liu et al. [iTransformer, ICLR 2024]는 어텐션 축을 변수 방향(N×N)으로 전환함으로써 T×T 모티프 없이도 SOTA를 달성한다. 이는 T×T 모티프가 예측에 충분조건이 아님을 시사하며, 우리의 framework를 단변량·소변수 TS로 적용 범위를 명확히 한정하는 계기가 된다."

### 연결 2: PE 실험과의 관련성

APF에서 NoPE/Sinusoidal/RoPE/ALiBi에 따른 T×T 어텐션 모티프 차이를 분석한다. iTransformer는 위치 임베딩이 없다(불필요하다고 주장). 이는 "위치 임베딩이 T×T 모티프를 어떻게 형성하는가"라는 APF 질문의 대조군이 된다:

> APF 실험 확장 아이디어: "PE 없는 iTransformer의 N×N 어텐션 맵 모티프 분류" — 이것이 T×T 모티프 분류와 어떻게 다른가? 블록/클러스터 패턴이 N×N에서도 나타나는가, 아니면 전혀 다른 모티프 체계가 필요한가?

---

## §A + §B — Grokking 트랙: FFN 회로 분석

### 연결 3: FFN이 시간 패턴을 학습한다 — 어떤 회로로?

iTransformer Claim 2는 "FFN이 각 변수의 시간 패턴을 학습한다"고 주장한다. 그러나 이것이 어떤 내부 회로로 구현되는지 분석하지 않는다.

Grokking 연구에서 우리는 "FFN이 주기 패턴을 어떻게 암기→일반화하는가"를 추적한다 (Nanda 2023의 modular arithmetic에서 Fourier feature 형성과 유사). iTransformer에 Grokking 분석을 적용하면:

- 훈련 초기: FFN이 $T$개 시간 점의 단순 가중 평균을 학습? (암기 단계)
- Grokking 이후: 주기적 구조를 내재화한 회로가 형성? (일반화 단계)
- 테스트: iTransformer를 ETT(계절성 있는 TS)에서 훈련 시 Grokking이 나타나는가? 나타난다면 어느 레이어, 어느 헤드에서?

**보유 자산 활용**: Grokking 프로젝트의 synthetic periodic TS 데이터를 iTransformer에도 적용해 비교 실험. 표준 트랜스포머(T×T)와 iTransformer(N×N)에서 Grokking 발생 시점, 회로 형성 방식이 달라지는가?

---

## §E — P1 ProTran-TFA: 금융 응용 연결

iTransformer의 N×N 어텐션이 변수(자산) 간 상관을 학습한다는 것은 포트폴리오 맥락에서 직접적 응용이 가능하다:

- ProTran-TFA는 확률적 예측 Transformer를 금융 시계열에 적용. 현재 채널 독립(channel-independent) 방식.
- iTransformer의 N×N 어텐션을 ProTran에 통합하면 "자산 간 상관을 반영한 확률적 예측"이 가능해진다.
- 구체적: ProTran의 인코더를 iTransformer 블록으로 대체하되, 디코더(확률 분포 출력)는 그대로 유지하는 하이브리드.

**현실적 제약**: ProTran-TFA는 현재 ⏸️ Paused 상태. iTransformer와의 결합은 재개 시점의 첫 실험 방향으로 검토 가능.

---

## 연결이 약한 부분 — 솔직한 평가

§F(원거리: SAE, 점과정, 딥헤징) 와의 연결은 매우 약하다. iTransformer는 TS 예측 기법이며, 원거리 영역의 특수 문제(이벤트 시퀀스, 옵션 헤징)와 직접 연결되지 않는다. 전이 가능성: "희소 어텐션 → SAE(Sparse Autoencoder)와 희소 행렬 분해의 관계" 정도지만, 이것도 억지스럽다.

**종합 연결 강도**:
- APF (§C): ⬛⬛⬛⬛⬜ (매우 강)
- Grokking (§A/§B): ⬛⬛⬛⬜⬜ (강)
- ProTran-TFA (§E): ⬛⬛⬜⬜⬜ (중간, 재개 시 활용 가능)
- 원거리 §F: ⬛⬜⬜⬜⬜ (약)
