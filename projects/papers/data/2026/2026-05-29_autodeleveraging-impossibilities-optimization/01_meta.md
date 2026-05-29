# 01 · 메타 & 선정 이유

## 기본 서지 정보

| 항목 | 내용 |
|------|------|
| **Canonical ID** | arXiv:2512.01112 |
| **저자** | Anonymous ("pluriholonomic") — 필명. 실명·소속 공개 안 함 |
| **제출 연도** | December 2025 |
| **인용 수** | 미확인 (arXiv · Semantic Scholar 접근 차단; 제출 후 ~5개월 경과) |
| **GitHub 재현 코드** | `pluriholonomic/autodeleveraging-analysis` |
| **LaTeX 소스** | `paper/main_corrected.tex` (공개) |

## 저자 배경

저자는 필명을 사용하며 소속 기관을 밝히지 않는다. GitHub 계정(`pluriholonomic`)을 통해 논문·코드 전체를 공개했다. 인용된 문헌(Roughgarden, Hazan, Akbarpour-Li 등)의 수준으로 보아 알고리즘 게임이론·볼록 최적화에 깊이 있는 배경을 가진 연구자로 추정된다. 이 논문은 2025년 10월 10일 Hyperliquid에서 발생한 "역사상 최대 규모 ADL 이벤트"를 계기로 작성된 것으로 서문에 명시되어 있다.

## Evidence Map (원문 §/표/그림 위치)

| 증거 유형 | 원문 위치 | 핵심 내용 |
|-----------|-----------|-----------|
| **핵심 Claim — 트릴레마** | §5, Theorem 1 | "어떤 ADL 정책도 거래소 지급능력·수익·공정성을 동시에 만족할 수 없다" |
| **핵심 Claim — Pro-rata 공정성** | §5, Theorems 2–3 | "공리적 + 최적화적 의미 모두에서 pro-rata가 유일한 공정 메커니즘" |
| **핵심 Claim — 도덕적 해이 스케일** | §5, negative result | "moral hazard는 참여자 수에 따라 O(b_n/n)로 증가" |
| **방법론 수식** | §2 (Def 2.1–2.10) + §4 | PNL·지분·유동화 가격·ADL 정책 형식 정의 |
| **실험 수치** | §6 | Hyperliquid Oct 10 2025: $2.1B 청산, ~$23.2M 실제 부족, $653M 불필요 haircut |
| **한계** | §6 conclusion | "LOB 구체 모델 추상화", "영구 선물만 대상", "수동 손실 사회화 제외" |

## 선정 이유

**오늘 버킷**: 금요일 · 원거리 (§F 쏠림 방지)

**왜 지금 이 논문인가:**

1. `crypto-ml` 태그 커버 0회 → 가장 뒤처진 원거리 태그 중 하나
2. Hyperliquid의 2025년 10월 10일 사건($2.1B · 12분)은 암호화폐 시장구조를 바꾼 사건으로, 이 논문이 유일한 형식적 분석을 제공
3. 저자 AETHER 프로젝트(`AETHER_IDEA.md` 611줄)는 크립토 시장에서의 alpha 전략을 목표로 한다 — 거래소 ADL 메커니즘을 이해하지 못하면 포지션 리스크를 잘못 계산
4. **전이 가능성**: 트릴레마 불가능성 구조 → Grokking track의 "두 목적함수를 동시 최소화 불가" 현상과의 유비; pro-rata 공정성 공리화 → APF의 "어떤 어텐션 메트릭이 공정한 설명인가" 질문과의 유비

**선정 기준 체크:**
- ✅ Source Lock 통과 (전체 LaTeX GitHub 공개)
- ✅ Priority 목록 매칭 없음 → _coverage.md 기준 가장 뒤처진 태그
- ✅ 사용자 연구(AETHER) 및 원거리 §F와 연결
- ✅ 재현 가능 (전체 코드·데이터 공개)
- ⚠️ 인용 수 미확인 (신규 preprint, 접근 차단)
