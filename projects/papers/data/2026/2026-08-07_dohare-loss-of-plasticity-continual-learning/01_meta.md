# 0. 메타 & 선정 이유

## 서지·권위

- **DOI**: 10.1038/s41586-024-07711-7 · *Nature* 632(8026), 768–774 (2024)
- **프리프린트**: arXiv:2306.13812 (v3, 2024-04-09) — 제목이 *"Maintaining Plasticity in Deep Continual Learning"* 으로 게재본과 다르다
- **인용 수**: **미확인**. 본 실행 환경에서 Semantic Scholar API 및 nature.com 도메인이 차단되어 직접 조회하지 못했다. 정성적으로는 "가소성 상실(plasticity loss)"이라는 용어 자체를 표준화한 논문으로 후속 흐름이 형성되어 있으나, **구체 인용 수치는 주장하지 않는다.**
- **저자 권위**: 교신 저자 Richard S. Sutton 은 강화학습 교과서 *Reinforcement Learning: An Introduction* 의 공저자이자 2024년 튜링상 수상자다. A. Rupam Mahmood 과 함께 University of Alberta / Amii 라인의 "연속학습(continual learning)을 특수 사례가 아니라 기본값으로 놓자"는 오랜 프로그램의 결과물이다. 즉 이 논문은 단발 아이디어가 아니라 **연구 프로그램의 결론부**다.

## 근거 지도 (Evidence map — 원문 위치)

1. **핵심 claim** → Abstract 전문 + Main 절 + "Plasticity loss in supervised learning" 절 + Discussion 절. 대표 수치는 **Fig. 1**(Continual ImageNet), **Fig. 2**(class-incremental CIFAR-100), **Fig. 3**(비정상 ant), **Fig. 4**(정상 ant).
2. **방법론 수식** → Methods 하위절 "Specifics of continual backpropagation" 의 **식 (1)** (기여 효용), Methods 하위절 "Understanding loss of plasticity" 의 **식 (2)** (유효 랭크) 및 stable rank 정의.
3. **실험 세부** → Methods 하위절 "Details of Continual ImageNet" / "Class-incremental CIFAR-100" / "Robust loss of plasticity in permuted MNIST" / "Loss of plasticity with different activations in Slowly-Changing Regression" / "Details and further analysis in reinforcement learning". 하이퍼파라미터 격자는 **Extended Data Table 1–5**.
4. **한계·유보** → Discussion 절 마지막 문단 (*"will probably require further development to reach its most effective form"*) + Methods 의 ReDo 비교 문단(*"we perform a preliminary comparison"* — 저자 스스로 "예비적"이라 명시).

> **미확보 구간 명시**: Extended Data Table 1–5 는 PMC 렌더에서 **이미지 파일**(예: `41586_2024_7711_Tab2_ESM.jpg`)로만 제공되어 셀 값을 전사할 수 없었다. 따라서 본 해체에서 인용하는 하이퍼파라미터 수치는 **Methods 본문에 문장으로 적힌 것만**이며, 표 셀에서 온 값은 없다. Data/Code availability 정식 문구와 ReDo 비교의 정량 결과 역시 렌더 절단으로 확인 불가 → "원문 수치 미확인" 처리.

## 선정 이유 (품질 게이트 통과 근거)

**통과 기준: A + C, 그리고 E.**

- **A (탑 티어 게재 확정)**: *Nature* 게재. `_prompt.md` §3 의 Tier 3 명단("Nature/Science 계열 ML")에 정면으로 해당하며, 게재본 전문(오픈액세스)을 직접 열어 확인했다.
- **C (저자·그룹 트랙레코드)**: Sutton·Mahmood 의 Alberta/Amii 연속학습 라인. 단독 근거로는 약한 기준이므로 A 와 결합해 사용한다.
- **E (읽을 가치 자기시험, 2줄)**: ① 이 논문은 "딥러닝이 계속 학습하면 성능이 나빠진다"가 아니라 **"배우는 능력 자체가 소모된다"**는 다른 층위의 주장을 하며, 그 결론이 "경사하강만으로는 부족하고 비경사(non-gradient) 무작위 성분이 필요하다"는 **설계 원칙의 수정**까지 간다 — 실무자의 옵티마이저/정규화 선택을 실제로 바꾼다. ② 비정상성(non-stationarity) 하 학습 동학은 사용자의 Grokking-in-TS track 4-way 교차점 중 한 축이고, 이 논문은 그 축에서 **"늦게 좋아지는 현상(grokking)"의 정확한 거울상("천천히 나빠지는 현상")**을 제공한다. 즉 한 줄 판결이 "읽을 필요 없음"으로 끝날 논문이 아니다.

**기준 B 는 주장하지 않는다** — 인용 수를 직접 확인하지 못했으므로 "검증된 임팩트"를 근거로 내세우지 않는다.

## 왜 오늘(금요일 원거리) 이 논문인가

`_coverage.md` 기준 원거리 버킷 태그 중 `continual-learning` 은 **커버 1건, 마지막 2026-05-01** 로 3개월 넘게 정체된 최장 공백 태그였다. 같은 버킷의 `sae-features`(3, 07-24)·`causal-ml-finance`(1, 07-10)·`rl-trading`(1, 07-03) 은 최근 2개월 내 커버됐다.

또한 이 논문은 **2026-07-17 실행에서 이미 최우선 후보로 지목됐다가 프록시 차단으로 SKIP-DAY 처리된 항목**이다 (`skipped.log`: `2026-07-17 SKIP DOI:10.1038/s41586-024-07711-7 reason=no_fulltext`). 당시 저자 GitHub(2차)만 열려 §4-bis 를 통과하지 못했다. 오늘은 Nature 게재본 오픈액세스 전문에 직접 접근해 Q1/Q2/Q3 를 모두 원문 verbatim 으로 답했으므로 **정상 발행 자격을 얻었다**. 이는 "부분 복원 발행 금지" 규칙이 실제로 작동해 3주 뒤 온전한 근거로 회수된 사례다.

Priority 목록(`_index.md` "사용자 우선 읽기 목록") 직접 매칭은 없다. 태그 균형 + 품질 게이트 A 로 선정했다.
