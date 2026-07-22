# 0. 메타 & 선정 이유

## 서지·권위 배경

- **canonical identifier**: arXiv:2502.06151 · AISTATS 2026 (PMLR Vol. 300)
- **인용 수**: 미확인 (본 실행에서 Semantic Scholar / Google Scholar canonical 접근 미시도·보조 전용 규정, 인용 수치는 단정하지 않음). 2025-02 최초 공개, 2026 AISTATS 게재로 아직 초기.
- **저자 권위**: **Michael W. Mahoney** — 무작위 수치선형대수(RandNLA)·딥러닝 이론·시계열 분야에서 오래 인용되는 그룹(UC Berkeley/ICSI/LBNL). **N. Benjamin Erichson** — 동역학계·과학적 머신러닝(SciML) 계열 다수 논문. 제1저자 **Kareem Hegazy** (UC Berkeley 통계학과). → 품질 게이트 **C(저자·그룹 트랙레코드)** 충족의 근거.

## 근거 지도 (원문 위치)

- **핵심 claim**: §1 서론 말미 기여 목록 3개 (RBCA 프레임워크 / flip-flop 과제 검증 / Powerformer 예측 성능).
- **방법론 수식**: §3.1 Eq. 1 (`S_h = K_h Q_h^T / √D_k`), Eq. 3 (인과 마스크 `M^(C)`) · §3.2 Eq. 4 (최근성 마스크 `M^(L)`), Eq. 6 (`C_h^(C,L) = Softmax(S_h^(C,L))`) · §3.3 감쇠 함수(거듭제곱 `f^(PL)(t)=-α log t` 등 4종).
- **실험**: §4, **Table 1** (7개 데이터셋 × 예측길이 96/192/336/720 MSE·MAE), §4.4 ablation(MHA vs 인과-only vs RBCA), flip-flop 과제 **Fig. 3**, Fig. 1·2·4.
- **한계/부록**: §5 결론 + 부록(α 학습 가능성 실험 Table S10, 주기성 강한 데이터셋 열세 인정).

## 선정 이유 (`_profile.md` 연결)

이 논문은 사용자의 두 축 모두에 정확히 꽂힌다.

1. **왜 지금 이걸 봐야 하는가 (품질 게이트 A + C + E)**:
   - **A** — AISTATS 2026 게재 확정(Tier 2 상위 통계-ML 학회).
   - **C** — Mahoney/Erichson 그룹 신작.
   - **E(읽을 가치 자기시험)** — 이 논문은 사용자의 APF(Attention Pattern Fields) 프로젝트가 비교하는 PE 축(NoPE/sinusoidal/learned/RoPE/**ALiBi**)에 **새로운 감쇠 형태(거듭제곱 꼬리)**를 하나 더 얹고, "감쇠형 어텐션이 왜 해석 가능한가"(§3.5 주파수 필터링 관점)를 **실증**한다. 즉 한 줄 판결이 "읽을 필요 없음"으로 끝나지 않는다 — APF 의 PE-motif 실험 설계와 해석 논거를 직접 갱신하는 논문이다.

2. **바로 직전 코어(2026-07-20)에서 다룬 ALiBi(arXiv:2108.12409)의 시계열 직계 후손**: ALiBi 커버 노트가 후속 계보로 "Powerformer(Weighted Causal Decay Attention, arXiv:2502.06151)를 감쇠형 어텐션의 시계열 직계 후손 후보"로 명시 지목했다. ALiBi=지수 감쇠 vs Powerformer=거듭제곱 감쇠의 정확한 대비를 통해 PE 계보를 한 정거장 더 잇는다.

3. **연결 강도**: §C(PE-어텐션 기하) 직접 + §D(TSFM 해석) 직접 + §B(회로/해석, flip-flop 분석) 부분. P1 ProTran-TFA(paused)와는 연결 약함(확률/quantile head 중심 vs 본 논문 point forecast) — 뒤 §9에서 정직하게 표기한다.
