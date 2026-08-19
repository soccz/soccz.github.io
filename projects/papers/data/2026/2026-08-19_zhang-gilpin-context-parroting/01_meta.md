# 0. 메타 & 선정 이유

## 서지·권위

- **저자**: Yuanzhao Zhang (Santa Fe Institute) · William Gilpin (University of Texas at Austin, 물리학과)
- **canonical identifier**: **arXiv:2505.11349** (v3, 2026-03-29) · OpenReview **EUAXc9Hlvm**
- **venue**: **ICLR 2026** (arXiv Comments 필드에 "International Conference on Learning Representations (ICLR 2026)" 명기)
- **인용 수**: **미확인**. Semantic Scholar API 접근이 이 실행 환경에서 확인되지 않아 수치를 적지 않는다. 게이트 판정은 인용 수(B)가 아니라 게재(A)로 통과시켰다.
- **저자 트랙레코드**: Gilpin 은 본 논문이 벤치마크로 쓰는 **`dysts` 데이터베이스(135개 저차원 카오스계)의 저자**다(원문 §5.1 인용 Gilpin 2021). Zhang·Gilpin 두 사람은 이 레포가 **2026-08-12 에 커버한 arXiv:2409.15771 "Zero-shot forecasting of chaotic systems" (ICLR 2025)** 의 동일 저자다. 즉 본 논문은 남이 아니라 **저자 자신이 자기 전작의 헤드라인을 뒤집는 후속작**이다.

## 근거 지도 (Evidence Map)

작성 전 원문 v3 에서 확인한 근거 위치. 이 지도 밖의 내용은 본 해체에서 단정하지 않는다.

1. **핵심 claim**: 초록 전문 · **§1 Introduction** (Chronos 의 parroting 관찰이 전작 Zhang & Gilpin 2024 에서 왔다는 서술) · **§5.1** (카오스 정면 비교) · **§5.3** (카오스 밖 4개 과제)
2. **방법론**: **§3 "Context parroting as a zero-shot forecasting strategy"** + **Algorithm 1 "Context Parroting"** (입력·출력·4단계 전문) · **Appendix F "Theoretical Properties of Context Parroting"** (F.1~F.5, 번호 붙은 식 (1)~(5) + 불변량 보존 명제)
3. **실험**: **Figure 2**(dysts 135계 × 초기조건 20개, context 512, 예측지평별 오차 + 어트랙터 KL) · **Figure 3**(파워 스펙트럼, L=2000) · **Figure 4**(문맥 길이별 parroting vs Chronos) · **Figure 5**(스케일링 지수 α vs 1/d_cor) · **Figure 6**(실패 모드) · **Figure 7**(MSE/MAE + 고전 baseline) · **Table 1**(MAE @ 50 steps) · **Table 2**(MSE @ 50 steps) · **Table 3**(어트랙터 KL) · **Table 4**(장기 지평 불변량 상관)
4. **한계**: 독립된 "Limitations" 절은 **없음**(원문에 별도 절 제목 미존재). 대신 **§6 Conclusion and future directions** · **Appendix C**(임베딩 차원 D 민감도) · **Appendix E**(노이즈·샘플링율) · **Appendix F.5**(확률적 시스템에서 스케일링 법칙 미해결)에 분산되어 있다.

## 선정 이유 — 왜 지금 이걸 봐야 하는가

**품질 게이트 통과 근거 (필수 명기):**

- **기준 A 충족**: **ICLR 2026 게재 확정** (Tier 1). arXiv Comments + OpenReview forum(EUAXc9Hlvm) 이중 확인.
- **기준 E(읽을 가치 자기시험) 통과 사유 2줄**:
  1. 이 논문은 "TSFM 이 물리를 배웠다"는 최근 3년치 서사를 **5줄짜리 최근접이웃 복사 알고리즘 하나로 반증 가능한 명제로 격하**시킨다 — 즉 독자가 앞으로 읽을 모든 TSFM 성능표의 해석 방식을 바꾼다.
  2. 실무적으로도 즉시 작동한다: 200M~500M 파라미터 모델을 돌리기 전에 **연산량 6자리(six orders of magnitude) 싼 베이스라인**(원문 §5.1 verbatim: *"a six orders of magnitude computational gap separates Chronos and context parroting for all context lengths"*)을 먼저 돌려보라는 처방이 코드와 함께 나온다.

**레포 정합성 근거 (이번 선정의 결정적 사유):**

이 레포는 **2026-08-12(지난 수요일)에 같은 저자의 arXiv:2409.15771 을 커버**했다. 그 해체는 "TSFM 이 카오스계를 zero-shot 으로 예측한다"를 다뤘다. 그런데 본 논문은 **바로 그 능력의 상당 부분이 문맥 복사였다**고 저자 스스로 되짚는다. 전작만 인덱스에 남겨두면 이 레포는 **저자 본인이 뒤집은 명제를 유통시키는 상태**가 된다. 이는 2026-08-10 ROME(arXiv:2202.05262) → 2026-08-14 Hase et al.(arXiv:2301.04213) 에서 이미 한 번 처리한 유형이며, `_index.md` 대기 후보에 **"[최우선 · 인접] 반드시 후속 커버"** 로 사전 등재돼 있었다.

**균형 규칙 예외 처리 (숨기지 않고 명기):**

`_coverage.md` 균형 규칙 중 **두 개를 의도적으로 위반**한다.
- 규칙 3 "한 저자의 논문은 한 달 내 1회" — Zhang·Gilpin 을 **7일 만에** 재선정.
- 규칙 1 "커버 수가 3 이상 벌어지면 뒤처진 태그 우선" — `tsfm-interp`(9건, 최다) 를 또 고르고 `fin-ts-dl`(3건) 을 미룬다.

근거는 `_prompt.md` §3 대원칙(**퀄리티 > 커버리지, 버킷·태그 균형은 선호이지 구속이 아니다**)과 규칙 3 의 명시적 예외 조항("프로파일 검토 후")이다. **짝 논문의 가치는 시간 간격이 짧을수록 크다** — 전작의 해체가 아직 기억에 있는 상태에서 반증을 붙여야 두 편이 하나의 판단으로 합쳐진다. 대신 **다음 수요일 슬롯은 `fin-ts-dl` 로 상환**할 것을 `_index.md` 에 지시로 남긴다.

**프로파일 연결** (`_profile.md`):

- **§D (TS Transformers / TSFM Interp)** 직접 — Chronos·TimesFM·MOIRAI 는 이 레포가 각각 2026-04-29 / 07-01 / 06-03 에 커버한 모델이고, 본 논문은 그 셋을 한 표에서 동시에 때린다.
- **§B (Mechanistic Interpretability)** 교차 — 저자들이 parroting 을 **induction head** 와 명시적으로 연결한다. APF·Grokking 두 트랙이 공유하는 회로 어휘가 시계열 파운데이션 모델 쪽으로 직접 건너오는 드문 지점이다.
- **§F (원거리)** 부분 — 카오스·프랙탈 차원·in-context 스케일링 법칙은 information theory in TS 항목과 접한다.
