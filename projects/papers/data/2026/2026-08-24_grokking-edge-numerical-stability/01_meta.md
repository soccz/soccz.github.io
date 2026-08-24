# 0. 메타 & 선정 이유

## 서지·권위

- **저자**: Lucas Prieto, Melih Barsbey, Pedro A. M. Mediano, Tolga Birdal (Imperial College London)
- **canonical identifier**: arXiv:2501.04697 (v1 2025-01-08 → v2 2025-05-19), DOI 10.48550/arXiv.2501.04697
- **venue**: ICLR 2025 Poster — `iclr.cc/virtual/2025/poster/29501` 에서 제목·저자·등급·연도 확인. arXiv `Comments:` 필드에는 venue 표기가 **없다**(확인함). 따라서 venue 근거는 arXiv 가 아니라 ICLR 공식 페이지다.
- **인용 수**: **미확인**. 본 실행 환경에서 Semantic Scholar API 호출이 승인되지 않아 정량 인용 수를 확보하지 못했다. 따라서 **품질 게이트 B(검증된 임팩트)는 주장하지 않는다.**
- **저자 트랙레코드**: Tolga Birdal 은 기하학적 딥러닝·최적화 동역학 쪽 작업으로 알려진 그룹이고, Pedro Mediano 는 정보이론·창발(emergence) 계열 연구자다. 다만 이 논문의 선정 근거는 **게이트 C(트랙레코드)가 아니라 A(ICLR 2025 게재 확정)** 이며, 프로파일 §"기준 C 단독 근거로는 약함" 규칙대로 C 는 보조로만 쓴다.

## 근거 지도 (Evidence Map)

원문에서 직접 확인한 위치만 적는다.

| 무엇 | 원문 위치 |
|---|---|
| 핵심 claim (SC 가 그로킹을 막는다 / NLM 이 지연을 만든다) | **§3 "Softmax Collapse: Floating Point Errors Prevent Grokking"**, **§4.2 "Naïve loss minimization"** |
| 방법론 수식 | **식 (1)** SCE 손실 · **식 (2)** SC 조건(§3.1) · **식 (3)(4)** SC 하 손실·기울기 붕괴 · **식 (5)(6)** StableMax 정의(Definition 4) · **식 (7)** Proposition 1 의 $g(x)$ · **식 (8)(9)** NLM 정의(Definition 5) · **식 (10)** positive homogeneity(Definition 6) · **식 (11)(12)** ⟂Grad(Definition 7) |
| 실험 (그로킹 과제) | **Figure 1, 2, 4, 5, 6** (modular arithmetic / sparse parity / MNIST) |
| 실험 (실전 규모) | **Table 1** (CIFAR10 / CIFAR100 / ImageNet-1k / WikiText-103) + **Appendix G "StableMax and ⟂Grad in Realistic Settings"** |
| 한계 | **§7 "Conclusion and Discussion"** (동차성 가정, effective learning rate 미분석) + **Appendix H "SC and the Slingshot Effect"** (연결은 제안 수준) |

## 선정 이유 (게이트 A + E, 2줄 이상 명기)

**통과 기준: A(게재 확정) + E(읽을 가치 자기시험).** B 는 인용 수 미확인이므로 주장하지 않는다.

- **A**: ICLR 2025 Poster — 공식 프로그램 페이지에서 확인. 워크샵·프리프린트가 아니다.
- **E-1**: 이 논문은 그로킹 연구의 **관측 도구 자체를 의심**한다. "정규화(weight decay) 없이는 그로킹이 잘 안 온다"는, 이 레포가 이미 커버한 여러 논문(2026-05-08 Power, 2026-06-12 Omnigrok, 2026-05-25 Liu effective theory, 2026-06-22 Merrill)이 공유하는 경험칙인데, 저자들은 그 경험칙의 상당 부분이 **float32 의 Softmax 흡수 오차로 기울기가 정확히 0 이 되어 학습이 멈춘 것**이라고 주장한다. 원인이 이론이 아니라 **수치 구현**이라면, 지금까지의 "정규화의 역할" 논쟁은 최소한 일부가 잘못된 대상을 향해 있었다는 뜻이다.
- **E-2**: 실무를 바꾼다. 그로킹 실험을 돌리는 사람은 이제 결과를 해석하기 **전에** "내 손실이 지금 0 으로 흡수돼서 기울기가 죽은 건 아닌가"를 먼저 확인해야 한다. 이건 해석이 아니라 **위생 검사**이고, 검사 비용이 거의 0 이다(정밀도 float64 로 바꿔서 같은 곡선이 나오는지 보는 것). 한 줄 판결이 "읽을 필요 없음"으로 끝날 수 없는 종류의 논문이다.

## 오늘 이 논문인 이유 (버킷·균형)

- **요일·버킷**: 2026-08-24 월요일 = **코어 버킷**. 프로파일상 코어는 §A(Grokking) + §B(Mech interp) + §C(Attention-PE).
- **축 균형(균형 규칙 4)**: 최근 코어 슬롯은 2026-07-06 RoPE(§C) → 2026-07-20 ALiBi(§C) → 2026-08-10 ROME(§B) → 2026-08-14 Hase(§B)로 흘렀고, **§A 는 2026-06-22 Merrill 이후 약 2개월 공백**이었다. §A 복귀가 맞다.
- **태그 균형(균형 규칙 1)**: `grokking-delayed-gen` 5건(마지막 2026-06-22) · `training-dynamics` 4건(마지막 2026-06-22) — 코어 최다인 `mech-interp-circuits`/`causal-intervention` 7건과 3건 차이. 뒤처진 태그 우선 규칙에 부합.
- **저자 중복(균형 규칙 3)**: Prieto·Barsbey·Mediano·Birdal 은 이 레포 초출.
- **대조 창**: 2026-06-12 Omnigrok(Liu·Michaud·Tegmark)이 "weight norm 이 그로킹의 축"이라는 그림을 심었는데, 본 논문 **Figure 4(middle)** 는 "정규화 없이 유도한 그로킹은 흔히 관찰되는 weight norm 급감 추세를 따르지 않는다"고 직접 반례를 든다. ROME(08-10) 다음에 Hase(08-14)를 붙였던 것과 같은 구조의 **반증 대조 배치**다.

## 후보 풀 (평가한 5편 이상 · 기록)

| # | 후보 | 판정 |
|---|---|---|
| 1 | **Prieto et al., arXiv:2501.04697 (ICLR 2025)** | **선정** — 게이트 A+E, 전문 접근 ✔, Table 1 존재로 §4-bis Q2 대응 ✔ |
| 2 | Kumar·Bordelon·Gershman·Pehlevan, arXiv:2310.06110 "Grokking as the Transition from Lazy to Rich Training Dynamics" (ICLR 2024 Poster, `iclr.cc/virtual/2024/poster/17515`) | 게이트 A 통과·전문 접근 ✔ 이나 **원문에 표가 하나도 없음(NO TABLES 확인)** → §4-bis Q2 를 표로 대응 불가. **대기 후보로 이월** |
| 3 | Lyu·Jin·Li·Du·Lee·Hu, arXiv:2311.18817 (arXiv Comments verbatim "Published as a conference paper at ICLR 2024; 40 pages, 4 figures") | 게이트 A 통과. 40쪽 4그림 이론서로 표 부재 가능성 높음 → Q2 리스크. **대기 후보로 이월** |
| 4 | Varma·Shah·Kenton·Kramár·Kumar, arXiv:2309.02390 "Explaining grokking through circuit efficiency" | arXiv **Comments 필드 없음**, v1(2023-09-05) 단일 버전 → venue 근거 미확보. **게이트 A 미충족**, B 도 인용 수 미확인 → 폐기 |
| 5 | Wiegreffe & Pinter, arXiv:1908.04626 "Attention is not not Explanation" (EMNLP 2019) | priority 목록 미커버 항목, 게이트 A(Tier 2) 통과. 다만 §C 축이고 오늘은 §A 복귀가 우선 → **다음 코어 슬롯 1순위로 이월** |
| 6 | Olsson et al., arXiv:2209.11895 "In-context Learning and Induction Heads" | priority Tier 2 미커버. transformer-circuits.pub 게재로 §4-bis 1차 소스 등급 판정이 선행돼야 함(2026-05-22 Monosemanticity 선례) → 이월 |
