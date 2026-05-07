# 0. 메타 & 선정 이유

## 서지 정보

- **원제**: *ContiFormer: Continuous-Time Transformer for Irregular Time Series Modeling*
- **한국어 번역**: ContiFormer — 불규칙 시계열 모델링을 위한 연속시간 트랜스포머
- **저자**: Yuqi Chen (Fudan University), Kan Ren (Microsoft Research Asia, 교신), Yansen Wang (MSRA), Yuchen Fang (Shanghai Jiao Tong University), Weiwei Sun (Fudan), Dongsheng Li (MSRA)
- **발표처 / 연도**: Thirty-seventh Conference on Neural Information Processing Systems (NeurIPS 2023)
- **arXiv ID**: 2402.10635 (프리프린트는 학회 발표 후 2024-02 재업로드)
- **코드**: `github.com/microsoft/SeqML/tree/main/ContiFormer` (PhysioPro 프레임워크 내부에 통합)
- **라이선스**: MIT (Microsoft)
- **인용 수** (Semantic Scholar, 2026-04 기준 추정): ≈ 210+ (직접 조회 불가, 2025년 후반 시점 ≈ 150을 추세 보정)

## 저자 맥락

- **Kan Ren**: MSRA의 sequence/TS 그룹 리더, 이후 ShanghaiTech 이직. 시계열·금융·RL 교집합의 중량급 저자이며 이 그룹에서 PhysioPro, MASTER 등 연속/TPP 모델이 연이어 출판됨. 1급 저자로 판단.
- **Yansen Wang**: BCI·뇌신호 계열 MSRA 연구자. ContiFormer의 UEA·Neonate EEG 실험 설계가 뇌파 도메인에 자연스럽게 맞춰진 배경.
- Fudan–MSRA 인턴 파이프라인의 산물. 이 동일 저자군이 이후 "Continuous PDE Transformer", "Irregular TPP" 등 파생물을 연달아 내며, NODE + Attention 결합의 준-표준으로 자리잡는 중이다.

## 한 문장 요지

표준 self-attention이 **이산 위치 인덱스**에서만 정의된다는 제약을 풀어, Key·Value를 **Neural ODE가 구동하는 연속 함수**로 승격시킨 뒤 임의의 쿼리 시각 $t$에서 softmax-attention을 평가한다. 결과적으로 Transformer와 Neural ODE가 각각의 특수 경우로 복원되는 통합 모델.

## 선정 이유 (프로파일과의 결합)

### 프로파일 대응 (직접)

`_profile.md`의 Paper 4는 그대로 인용하면:

> *"Paper 4: Continuous Economic Time Attention (ContiFormer의 ODE 시간 변수 대체)"*

Paper 4는 ContiFormer의 **시간 축 $t$** 를 Clark (1973)식 subordinated process의 **경제시간 $\tau(t)$** 로 갈아끼우자는 기획이다. 그러려면 내가 먼저 증명책임을 져야 할 세 가지는:

1. **원본 ContiFormer에서 시간 $t$가 수학적으로 어디에 어떤 형태로 들어가는가** — ODE의 독립 변수인지, 포지셔널 인코딩의 인자인지, attention kernel의 인자인지. 이 질문에 대해 "다 들어간다"는 답은 충분하지 않다. 각 경로의 계수 민감도를 알아야 대체 수술이 가능하다.
2. **시간 축이 연속이라는 가정이 ContiFormer의 어느 이론적 보장과 연결되는가** — Theorem 4.1(Transformer를 특수해로 포함), Theorem 4.2(Neural ODE를 특수해로 포함)의 증명 구조에서 $t$의 역할을 분해해야 한다.
3. **ContiFormer가 재현하지 못하는 dynamics가 금융에서 어떤 것인가** — 점프, 체제 전환, 변동성 클러스터링. 이 목록이 Paper 4의 defensibility를 만든다.

이 1~3은 **반드시 ContiFormer 원문을 해체하고서야** 확보 가능한 근거이므로, 지금 이 순서가 논리적으로 선행이다.

### 프로파일 대응 (간접)

- **Paper 1 (When Multiplicative Conditioning Fails)**: ContiFormer는 시간을 "좌표"가 아니라 "dynamics"에 넣었기 때문에 multiplicative conditioning 관점에서 보면 **coordinate-space conditioning의 극단적 사례**로 분류된다. Paper 1이 `tau_rope` vs `concat_a`를 비교하는 축 위에서, ContiFormer는 "좌표공간 조건화를 dynamics 전체에 침투시킨 버전"의 reference point.
- **Paper 2 (Representation Utility Gap)**: ContiFormer가 ranking vs absolute 양 지표에서 어떻게 달라지는지, 원문 실험에는 분해되어 있지 않다. 이 gap 자체가 Paper 2의 재료.
- **Paper 3 (TTPA)**: ContiFormer가 TPP에 적용된 섹션 4.3이 Paper 3 baseline 재점검의 출발점.

### 왜 "지금"인가

- **코어 태그 6개 모두 0**: 첫 회차의 앵커를 선정하는 의미에서, 내가 실제로 가장 오래 사용할 **참조점**을 첫 번째로 배치하는 것이 합리적. ContiFormer는 앞으로 쓸 인접·원거리 회차에서도 ("Neural CDE와 비교하면", "Neural SDE로 대체하면") 반복 소환될 고정점.
- Paper 4 드래프트 진행 중이므로, 이 해체 결과는 **며칠 내 직접 사용**된다. 이론적 가치만이 아니라 즉시 가동성(production value)이 높다.

## 읽기 모드

- **1차 독해 각도**: "시간 변수 $t$가 어디에 어떤 수학적 형태로 들어가는가"를 추적한다. 다른 디테일은 부차.
- **2차 독해 각도**: Theorem 4.1·4.2의 증명 전제가 무엇인지. 금융 데이터에서 이 전제가 깨지는 지점은 어디인지.
- **3차 독해 각도**: 실험의 공정성. Neural ODE baseline이 hyperparameter tuning 공정성 측면에서 핸디캡을 받았는가.
