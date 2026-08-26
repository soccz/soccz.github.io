# 0. 메타 & 선정 이유

## 서지

- **제목**: Deep Learning Statistical Arbitrage
- **저자**: Jorge Guijarro-Ordonez (Stanford, Mathematics) · Markus Pelger (Stanford, Management Science & Engineering) · Greg Zanotti (Stanford, MS&E)
- **식별자**: **arXiv:2106.04028v2** (2022-10-07) · **DOI 10.1287/mnsc.2022.03132** (*Management Science*, Articles in Advance 2025) · SSRN 3862004
- **JEL**: C14, C38, C55, G12 (원문 표지 verbatim)
- **인용 수**: **미확인.** 본 실행 환경에서 Semantic Scholar API 미승인, 출판사 페이지 접근 권한 미승인. 검색 인덱스는 *게재본* 기준 1건을 표시하나(게재가 2025년 12월이라 당연) 프리프린트 기준 누적 인용은 확인하지 못했다 → **품질 게이트 B 는 주장하지 않는다.**
- **저자 권위**: Markus Pelger 는 잠재요인 자산가격 라인의 저자다 — 이 레포가 2026-05-17 에 다룬 Lettau·Pelger RP-PCA(JoE 2020), 2026-05-18 에 다룬 Chen·Pelger·Zhu *Deep Learning in Asset Pricing* 이 같은 저자 계열이다. 본 논문 참고문헌에도 Lettau·Pelger (2020a,b), Pelger (2020), Pelger·Xiong (2020, 2021) 이 직접 등장한다.

## 근거 지도 (원문 위치)

| 무엇 | 어디 |
|---|---|
| 핵심 claim | §I Introduction 의 "Our empirical main findings are five-fold" 문단 5개 (p.3~4) + §III.D Main Results |
| 방법론 수식 | **§II.A 식 (1)** 잔차 정의 · **§II.C 식 (2)(3)** 결합 최적화 · **식 (4)(5)** Sharpe/평균-분산 목적 · **식 (6)** 분리 추정 · §II.D.3 CNN 2층 + 어텐션 $h_i=\alpha_i\tilde{x}W_i^V$, $h^{\text{proj}}=(h_1\cdots h_H)W^O$ · **Appendix C.1 식 (A.1)~(A.3)** (bias·instance norm·residual) · **Appendix C.2** (Q/K/V 정의) |
| 주 실험 표 | **Table I** (Sharpe 목적, SR/μ/σ) · **Table II** (알파 유의성) · **Table III·IV** (평균-분산 목적) · **Table V·VI** (L=60) · **Table VII·VIII** (상수 모형) · **Table IX** (거래 마찰) |
| 해석 실험 | **Figure 14** (D=8 국소 basic pattern) · **Figure 15** (합성 사인파 입력의 어텐션 헤드 가중치) · **Figure 16·17** (H×L 어텐션 지도, 시간축 확장) · **Figure 18** (NAAG 변수 중요도) |
| 한계 | §III.J 문단 "four simplifying assumptions" (p.36~37) + Appendix C.A (하이퍼파라미터 선택 절차) + §IV Conclusion |

## 선정 이유

**① 균형 상환 이행.** `_index.md` 대기 후보에 "2026-08-19 선정이 균형 규칙 2건을 의도적으로 위반했으니 **다음 수요일 슬롯은 `fin-ts-dl` 또는 `probabilistic-forecast` 로 상환하라**"는 지시가 걸려 있었다. `fin-ts-dl` 은 인접 버킷 최소군(3건, 마지막 2026-08-05)이다. 동시에 `_index.md` 가 기록한 **원거리·금융 태그의 구조적 장애**("게이트 A를 통과하면 유료라 못 읽고, 읽히는 것은 게이트 A 미달")를 정면으로 뚫는 후보다 — *Management Science* 라는 금융 Tier 1 게재지이면서 **arXiv 에 전문이 열려 있다.**

**② 품질 게이트 통과 사유 (2줄).** **기준 A**(`_prompt.md` 금융 도메인 Tier 1 명단의 *Management Science* 게재 확정, DOI 10.1287/mnsc.2022.03132) + **기준 C**(Pelger = Lettau·Pelger / Chen·Pelger·Zhu 라인의 자산가격 ML 그룹, 단독 근거로 쓰지 않고 A·E와 결합) + **기준 E**: 이 논문은 "딥러닝으로 수익률을 더 잘 맞혔다"가 아니라 **"예측 목적함수로 학습하면 최적 거래가 안 나온다"**(§II.C 식 (4)(5) 결합 최적화)와 **"어텐션 모델은 사후에 해부해서 무엇을 배웠는지 말할 수 있다"**(§III.N)를 동시에 밀며, 후자는 사용자의 mech-interp 피벗과 직접 겹친다. 판결이 "읽을 필요 없음"으로 끝나지 않는다 — 다만 **읽어야 할 이유가 저자들이 홍보하는 Sharpe 4 가 아니라 Table IX 의 붕괴폭과 §III.N 의 절차**라는 점이 이 해체의 결론이다.

**③ 버킷 적합.** 수요일 인접 버킷(§D TS transformer/2D/TSFM interp + §E 금융 응용)의 교집합에 정확히 놓인다. 저자 반복 규칙(한 달 1회) 확인: Pelger 의 직전 등장은 2026-05-17·05-18(발표용 심화, manual)로 100일 경과 — 위반 없음.
