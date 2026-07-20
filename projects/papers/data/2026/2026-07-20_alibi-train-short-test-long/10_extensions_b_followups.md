# 9. 사고 확장 (b) — Follow-up 논문 3편

선행 1 / 경쟁 1 / 후속 1로 배치한다.

## 선행 — RoFormer: Enhanced Transformer with Rotary Position Embedding (Su et al. 2021, arXiv:2104.09864)

- **무엇인가**: 위치를 query·key 회전으로 *곱셈적으로* 어텐션 내적에 주입하는 RoPE. 상대위치 조건 $\langle f_q(x_m,m), f_k(x_n,n)\rangle = g(x_m,x_n,m-n)$을 만족하도록 회전 행렬을 설계.
- **본 논문과의 관계**: ALiBi의 정확한 대척점. RoPE=곱셈 회전, ALiBi=덧셈 벌점. 이 논문 실험에서 rotary는 큰 $L_{\text{valid}}$ 외삽에서 ALiBi에 못 미쳤다(§4). 단, 이후 RoPE 스케일링이 격차를 좁혔다(§07 반박 2).
- **얻을 것**: "위치를 어텐션 단계에서 처리한다"는 공통 조상 아래 두 대수 구조(곱/합)의 트레이드오프. APF PE 축의 두 극점을 정의하는 쌍. (2026-07-06 커버 완료 — 직접 비교 참조 가능.)

## 경쟁 — YaRN: Efficient Context Window Extension of Large Language Models (Peng et al. 2023)

- **무엇인가**: RoPE의 주파수별 보간을 정교화(NTK-aware + 온도 조정)해 사전학습 길이를 훨씬 넘는 문맥으로 확장하는 방법. Position Interpolation·NTK 계열의 대표.
- **본 논문과의 관계**: "rotary는 외삽이 약하다"는 ALiBi의 전제에 rotary 진영이 내놓은 답. ALiBi vs YaRN은 "외삽을 어느 계열이 더 잘하는가"의 직접 경쟁 구도(§07 반박 2의 검증 대상).
- **얻을 것**: 2021 rotary가 rotary의 상한이 아님을 확인하고, ALiBi의 외삽 우위가 "구현 단순성 + recency 도메인 적합"으로 좁혀지는지 판정할 프레임. (canonical identifier·본문 접근은 선정 시 별도 Source Lock 필요.)

## 후속 — Powerformer: Weighted Causal Decay Attention (arXiv:2502.06151, `_index.md` priority)

- **무엇인가**: 시계열 트랜스포머에 인과적 감쇠 가중을 넣는 방법. "거리에 따른 어텐션 감쇠"라는 ALiBi 계보를 시계열 도메인으로 가져온 직계 후손 후보.
- **본 논문과의 관계**: ALiBi의 언어용 단조 감쇠를 시계열의 의존성 구조에 맞게 일반화·가중하는 방향. §09에서 지적한 "단조 recency가 장주기 계절성과 충돌"을 정면으로 다루는 후속으로 읽힌다.
- **얻을 것**: Grokking-TS·APF의 시계열 셋업에서 "감쇠형 위치 처리"의 도메인 적응 사례. ALiBi를 TS로 옮길 때의 설계 교훈. (수요일 인접 버킷 tsfm-interp 태그 후보 — 향후 별도 커버 시 Source Lock 필수.)
