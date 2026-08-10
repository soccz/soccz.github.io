# 0. 메타 & 선정 이유

## 인용 수

- **OpenAlex** (2026-08-10 조회): 레코드 `W4281657280` **cited_by_count = 176**. 단 같은 제목의 중복 레코드 `W7133236469`(66)가 별도로 존재해 arXiv판/NeurIPS판 분할 집계 정황이 있다. 단순 합산 시 242.
- **Semantic Scholar**: 본 실행에서 API가 HTTP 429(rate limit)로 반복 실패 → **미확인**.
- 정확한 총 인용 수는 **집계 불일치로 단정하지 않는다.** 다만 저자 자신이 §3.7과 §5에서 후속작(Meng, Sen Sharma, Andonian, Belinkov, Bau 2022 = MEMIT, arXiv:2210.07229)을 명시하고, 본 논문을 직접 반박·검증하는 후속작(Hase, Bansal, Kim, Ghandeharioun, **NeurIPS 2023 Spotlight**, arXiv:2301.04213)이 존재한다는 사실은 원문/공식 arXiv 메타로 확인했다 → **후속 연구 흐름 형성은 문서로 입증됨**.

## 저자 권위 배경

- **David Bau** (Northeastern) — 생성모델 내부의 "편집 가능한 단위"를 찾는 계보를 연 연구자. 본 논문 §3.1이 명시적으로 "Bau et al. (2020)"의 rank-one 삽입 규칙을 인용해 자기 방법의 조상으로 삼는다(원문 §3.1, Appendix A 첫 단락).
- **Yonatan Belinkov** (Technion) — probing classifier 방법론의 한계를 스스로 지적해온 계보. §4 Related Work가 "such approaches suffer from various limitations, notably being dissociated from the network's behavior (Belinkov, 2021)"라며 **자기 인용으로 probing을 비판**하고 인과 개입으로 넘어간다.
- **Kevin Meng** (MIT CSAIL) — 공동 제1저자, 후속 MEMIT 제1저자.
- 지원: Open Philanthropy AI Alignment grant, DARPA SAIL-ON / XAI, ISRAEL SCIENCE FOUNDATION 448/20 (원문 Acknowledgements).

## 근거 지도 (Evidence Map — 원문 위치)

| 무엇 | 원문 위치 |
|---|---|
| **핵심 claim (국소화)** | §2.2 (AIE 수치), §2.3 "The Localized Factual Association Hypothesis" (3차원 국소화 진술), Figure 1e·f·g, Figure 2a·b·c, Figure 3 |
| **핵심 claim (편집 가능성)** | §3.2 + **Table 1** (zsRE), §3.3~§3.4 + **Table 4** (C OUNTER FACT), Figure 5 (layer×token 벤치마크), Figure 6 (생성 텍스트 비교) |
| **방법론 수식** | §2 **Eqn. 1** (은닉상태 분해), §3.1 **Eqn. 2** (제약 최소제곱 closed form), **Eqn. 3** (k\* 선택), **Eqn. 4** (v\* 최적화), Appendix A **Eqn. 5~17** (Λ 대수 유도) |
| **실험 표·그림** | Table 1(zsRE) / Table 2(데이터셋 구성) / Table 3(벤치마크 비교) / **Table 4(주 결과)** / Table 5~6(GPT-2 M·L 확장) / Figure 5·6·7·8·9·23·24·25 |
| **한계** | **§3.7 Limitations** (명시), §6 Ethical Considerations, Appendix B.4 Figure 11 (마지막 subject 토큰이 항상 결정적이지 않은 반례), Appendix B.1 (노이즈 설정), Appendix E.5 (하이퍼파라미터) |

## 선정 이유

**요일·버킷**: 2026-08-10 월요일 → 코어 버킷(§A Grokking / §B Mech interp / §C Attention-PE). `_coverage.md` 기준 코어 태그 중 **`causal-intervention`이 최장 공백**(직전 2026-06-15 IOI Circuit, 약 2개월)이고 `mech-interp-circuits`도 2026-06-22 이후 정체 상태였다. 본 논문은 두 태그를 동시에 정면으로 메운다.

**Priority 매칭**: `_index.md` "사용자 우선 읽기 목록" **Tier 2 — Mech interp methodology** 의 `arXiv:2202.05262 | Locating and Editing Factual Associations in GPT (ROME) | Meng, Bau et al. (NeurIPS 2022) | mech-interp-circuits / causal-intervention` 행에 정확히 해당한다. 이 항목은 **2026-07-13 SKIP-DAY 때 프록시 전면 차단으로 포기했던 최우선 후보**이며(`skipped.log` 첫 줄), 본 실행에서 arXiv PDF 전문 접근이 복구되어 회수했다.

**품질 게이트 통과 사유 (필수 명기)**:
1. **기준 A 충족 (주 근거)** — NeurIPS 2022 게재 확정. arXiv comments 필드 "NeurIPS 2022"와 원문 각주 "36th Conference on Neural Information Processing Systems (NeurIPS 2022)"로 이중 확인. Tier 1.
2. **기준 C 보강** — Bau·Belinkov 그룹의 계보 작품이며, 저자 자신의 직계 후속(MEMIT)과 이 논문을 겨냥한 NeurIPS 2023 Spotlight 반박작(Hase et al.)이 모두 공식 메타로 확인됨. C 단독이 아니라 A와 결합.
3. **기준 E 자기시험 통과** — ① 이 논문은 "attention weight를 보고 중요도를 논한다"는 **상관 기반 해석의 대안 프로토콜**을 완성형으로 제시한다: 인과추적으로 위치를 찾고, 그 위치의 가중치를 **직접 바꿔** 예측이 바뀌는지로 자기 가설을 반증한다. 사용자가 "Mechanistic interpretability for TS Transformers"로 피벗한 상태에서 이 2단 구조는 방법론 그 자체다. ② 판결이 "읽을 필요 없음"으로 끝날 여지가 없다 — 실제로 이 논문의 국소화 주장은 후속 Spotlight 논문에 의해 "편집 성공을 예측하지 못한다"고 정면 반박당했고, **그 반박까지 포함해야 방법론이 완성**되기 때문에 원문을 읽지 않고 인용만 하면 결론이 뒤집힌다.

**기준 B는 보수적으로 미주장** — 후속 흐름 형성은 문서로 입증되나, OpenAlex 중복 레코드로 인용 수 자체가 신뢰 구간 안에 있지 않아 "1년 내 100+" 바를 정량으로 주장하지 않는다.

**저자 반복 규칙 확인**: Meng·Bau·Andonian·Belinkov 4인 모두 본 인덱스 첫 커버. 2026-05-15 Sparse Feature Circuits(Marks, Rager, Michaud, Belinkov, Bau, Mueller) 행에 Belinkov·Bau가 포함되나 해당 실행일로부터 약 3개월 경과 → "한 저자 월 1회" 규칙 위반 없음.
