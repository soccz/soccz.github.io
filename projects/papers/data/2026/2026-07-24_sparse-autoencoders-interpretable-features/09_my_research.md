# 8. 내 연구와의 연결

> **§9 봉인 준수**: 아래 내 프로젝트(APF·Grokking-in-TS·P1 ProTran-TFA)의 아키텍처·목적·구성요소는 `_profile.md`/`_index.md` 에 **문자 그대로 적힌 것만** 근거로 쓴다. 프로필 밖 세부는 "프로필 기준 미상"으로 표기한다.

연결 축 판정: 이 논문은 **§B(기계적 해석/회로 분석)** 계열이므로, 프로필 정책에 따라 **§B 우선 + §C(attention-PE geometry)·APF 인과개입 축** 과 연결한다. 사용자의 명시 피벗("Mechanistic interpretability for TS Transformers")의 정중앙이라 연결 강도 **강**.

## 8.1 흡수할 기법 (어느 수식을 내 어디에)

- **활성 패칭 개입식(06_experiments_b §5.8) → APF 의 "causal intervention" 단계.** APF 는 `_profile.md` 에 "PE → 2D attention motif → CNN probe → **causal intervention**" 프레임으로 적혀 있다. 본 논문의 개입식 $x'_i = x_i + \sum_{j\in F}(\bar{c}_{ij}-c_{ij})f_j$ 를 APF 의 개입 프로토콜 **양성 대조군(positive control)** 으로 이식한다: motif 를 CNN probe 로 검출한 뒤, "motif 를 만든다고 지목된 성분"에 이 반사실 패칭을 걸어 KL 변화로 인과를 확정하는 형식. 단 **개입 단위가 다르다**(아래 8.2).
- **손실식 Eq.4 + TopK 후속(05_method_c §4.9) → Grokking-in-TS 의 "circuit analysis" 축.** `_profile.md` 는 Grokking track 을 "Grokking × TS forecasting × non-stationarity × **circuit analysis**" 4-교차로 적는다. grokking 전이 순간에 **어떤 단의미 특징이 창발하는지**를 SAE 로 추적하는 도구로 Eq.4(또는 Mishra 2026 이 쓴 TopK-SAE)를 쓴다 — 이미 커버한 Merrill 2023(sparse subnetwork 창발)·Nanda 2023(progress measure)의 "무엇이 자라나는가"를 **특징 사전 좌표**에서 재측정.

## 8.2 충돌/경쟁 지점 (내 주장과 부딪히는 곳)

- **"해석 단위" 충돌 — 패턴(motif) vs 방향(feature).** APF 의 분석 단위는 **attention motif**(diagonal/stripe/block/edge/spike/checker, `_profile.md` 문자 그대로)라는 **2D 패턴**이다. 반면 이 논문의 단위는 **잔차 스트림의 선형 방향(feature)**이다. 두 좌표계는 경쟁한다: SAE 는 "특징=방향"으로 다의성을 풀지만, attention 계산의 **위치기하(QK 상호작용에서 생기는 motif)** 는 잔차 방향으로 환원되지 않을 수 있다. → 내 APF 는 "SAE 방향으로는 안 보이는 구조가 attention motif 에 있다"를 **반증가능 주장**으로 세울 수 있다.
- **SAE 의 사각지대 = APF 의 홈그라운드.** 본 논문 §3.2 는 자동 해석 채점관이 **next/previous-token 위치 패턴을 잘 설명 못 한다**고 인정한다(06_experiments_a §5.5). 이 "위치 패턴"이야말로 APF 가 PE(NoPE/sinusoidal/learned/RoPE/ALiBi) × motif 로 정면 겨냥하는 대상이다. 즉 SAE 특징-해석이 체계적으로 놓치는 지대를 APF 가 메운다 → **경쟁이 아니라 상보**로 재구성 가능.

## 8.3 인용 포인트 (초안 문장)

- **APF 논문 Related Work / Method(인과개입 절)**: "잔차 스트림 특징 수준의 인과 개입은 Cunningham et al. (2024)이 IOI 과제에서 활성 패칭으로 확립했으나(그들의 Fig. 3), 그 개입 단위는 선형 특징 방향이다. 본 연구는 개입 단위를 **attention motif** 로 옮겨, PE 가 유도하는 위치기하 패턴이 잔차 특징으로 환원되지 않는 인과 성분을 갖는지를 시험한다." — 이렇게 **대비 인용**으로 배치.
- **Grokking-in-TS 논문 Method(circuit analysis 절)**: "grokking 전이에서 창발하는 회로를 특징 사전 좌표에서 관측하기 위해, 우리는 Cunningham et al. (2024)의 희소 오토인코더(Eq. 4의 L1-재구성 목적)를 TS 트랜스포머 잔차 스트림에 적용한다." — **방법 차용 인용**.

## 8.4 반면교사 (이 논문이 못한 것 → 내가 다르게)

- **연속 신호에서의 선형-중첩 가정.** 본 논문은 **이산 토큰 NLP** 활성에 "특징=희소 선형결합"을 가정(05_method_b §4.0)한다. 시계열은 연속·주기·추세·regime 이 섞인 신호라, 특징이 **주파수 성분**이나 **비정상(non-stationary) 국면**처럼 선형 방향에 깔끔히 안 실릴 수 있다. → 내 연구는 "TS 트랜스포머에서 SAE 특징이 **주기/추세/regime** 축에 정렬되는가, 아니면 유령 특징으로 쪼개지는가"를 **명시적 반증 실험**으로 던진다(10_extensions_c 아이디어와 연결). Mishra 2026(Chronos-SAE, 커버됨)이 이 문을 열었으니, 그 위에서 **비정상 축(§D non-stationarity)** 을 통제 변수로 추가하는 게 내 차별점.
- **재구성 목적의 함정.** 저자가 §6.2 에서 스스로 지적한 "재구성 대신 KL 목적" 문제는, 예측이 본질인 TS 모델에서 더 심각하다(재구성 잘 되는 특징 ≠ 예측을 바꾸는 특징). 내 프로토콜은 처음부터 **예측-KL 기반 특징 중요도**로 설계.

## 8.5 P1 ProTran-TFA 연결 (약함, 정직 표기)

`_profile.md` 상 P1 ProTran-TFA 는 "2022AEL probabilistic Transformer 확장, finance venue 가능"(paused)로만 적혀 있다. SAE 는 확률 예측 head 와 직접 맞물리지 않아 **연결 약함 — 전이 가능성만**: ProTran 의 잠재 표현에 SAE 를 붙여 "어떤 특징이 특정 quantile 예측을 담당하는지" 사후 진단하는 정도의 보조 도구. 강제 매칭하지 않는다.

## 8.6 한 줄 요약

> **이 논문은 내 "TS 트랜스포머 기계적 해석" 피벗의 방법론 앵커이자, APF 의 "motif(패턴) vs feature(방향)" 좌표계 경쟁을 선명하게 세워주는 상대다** — 흡수(개입식·손실식)와 반박(위치 패턴 사각지대·연속신호 가정)을 동시에 준다.
