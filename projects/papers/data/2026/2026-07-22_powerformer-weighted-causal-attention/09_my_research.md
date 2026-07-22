# 8. 내 연구와의 연결

> **§9 봉인 준수**: 아래 사용자 프로젝트 사실은 `_profile.md`/`_index.md`에 문자 그대로 적힌 것만 근거로 한다. APF 논문 내부 절 번호 등 프로필 밖 세부는 "프로필 기준 미상"으로 표기하고 창작하지 않는다.

프로필 기준 이 논문의 연결은 **§C(PE-어텐션 기하) 직접 + §D(TSFM 해석) 직접 + §B(회로/flip-flop) 부분**이다. Grokking axis 논문이 아니라 PE-geometry 논문이므로, 프로필 지침대로 §C 를 축으로 §B/§D 와 잇는다. P1 ProTran-TFA(§E)와는 **연결 약함**을 정직히 표기한다.

## 흡수할 기법 — APF 의 PE 비교 축에 '거듭제곱 감쇠' 셀 추가

`_profile.md` APF 정의: **"PE 비교 (NoPE/sinusoidal/learned/RoPE/ALiBi) × motif 종류 (diagonal/stripe/block/edge/spike/checker)"**.

- **무엇을**: Powerformer 의 거듭제곱 편향 $f^{PL}(t) = -\alpha\log t$ (→ 가중치 공간 $t^{-\alpha}$)를 APF PE 축의 **6번째 셀 "power-law ALiBi"** 로 추가한다. 현재 축의 ALiBi 셀(지수 $e^{-\alpha t}$)과 **꼬리 두께만 다른 정확한 대비쌍** — 두 셀은 감쇠 방향은 같고 형태만 달라, motif 격자에서 형태 효과를 순수 격리하는 이상적 대조군이다.
- **어떻게(반증 가능한 motif 예측)**: $M^{(L)}$ 은 내용 무관 순수 위치 편향이므로 causal 대각 밴드를 하드코딩한다. 따라서 APF motif taxonomy 에서 **diagonal/stripe motif 강, block/checker 약**을 예측하되, ALiBi 셀과 달리 밴드가 $t^{-\alpha}$ 로 감쇠하므로 **더 넓은(heavy-tailed) 대각 밴드** — "power-law-tailed diagonal" 을 예측한다. ALiBi 셀은 좁은 대각, Powerformer 셀은 넓은 대각. 이 밴드 폭 차이가 CNN probe 로 분리되면 형태 가설이 확인, 안 되면 반증.

## 충돌/경쟁 지점 — §3.5 해석 주장 vs APF 의 "attention = explanation?" 회의

`_profile.md` §C: **"Attention is/not Explanation (Jain-Wallace 2019)"** — 본 저장소 2026-05-18 커버. APF 프레임워크는 **"PE → 2D attention motif → CNN probe → causal intervention"**.

- **충돌**: Powerformer §3.5 는 "거듭제곱 편향 = 해석 가능한 다중 스케일 주파수 필터"라 주장한다. 그러나 이 해석은 **편향 성분** $M^{(L)}$ 에 대한 것이지 내용 의존 $S_h$ 를 포함한 최종 어텐션 $C_h^{(C,L)}$ 전체가 아니다(→ 07_limits). 이는 APF 의 핵심 회의("attention weight = 중요도인가")와 정면으로 맞물린다.
- **수용/활용**: 충돌을 자산으로 전환 — Powerformer 는 **motif 의 기원이 부분적으로 알려진(하드코딩된) 통제 기질**이다. APF 의 4단계(causal intervention)에서, 마스크 $M^{(L)}$ 를 개입(제거·형태 교체)했을 때 diagonal motif 가 무너지는 정도 vs 내용 $S_h$ 만 개입했을 때의 정도를 비교하면, "어느 motif 가 편향에서 오고 어느 것이 학습에서 오는지"를 **기지(旣知) 정답과 대조**해 CNN probe·intervention 파이프라인을 캘리브레이션할 수 있다. 즉 Powerformer 를 APF intervention 단계의 **양성 대조군(positive control)** 으로 쓴다.

## 인용 포인트 (초안)

- **APF 논문 PE 비교 절(프로필 기준 절 번호 미상)**: "선형 거리 편향(ALiBi; Press et al., 2022)의 시계열 후속으로 Hegazy et al.(2026)은 감쇠 형태를 거듭제곱으로 일반화했다(arXiv:2502.06151). 우리는 이를 PE 비교 축의 별도 셀로 편입해, 지수 대 거듭제곱 감쇠가 유도하는 대각 motif 의 밴드 폭 차이를 측정한다."
- **APF intervention 절 주석**: "Powerformer 의 순수 위치 마스크 $M^{(L)}$ 는 motif 기원이 부분적으로 명시된 통제 기질을 제공하므로, 우리의 causal intervention probe 의 양성 대조로 삼는다."

## 반면교사

Powerformer 가 못한 것 = APF/내 연구가 채울 자리:
1. **비단조·주기 인지 부재**(Traffic 열세). APF 는 motif taxonomy 에 block/checker(주기·격자형)를 이미 포함하므로, "단조 감쇠가 못 잡는 주기 motif"를 명시적 실험축으로 삼을 수 있다.
2. **해석 주장이 편향에 국한**됨을 저자가 명시하지 않음. APF 의 CNN probe + causal intervention 은 "편향 유래 motif vs 학습 유래 motif"를 분리하는 **더 강한 해석 프로토콜**로 이 공백을 메운다.

## 약한 연결 (정직 표기)

- **P1 ProTran-TFA (§E, paused)**: `_profile.md` 자산 — "P1 ProTran-TFA (paper_test/PAPER_DRAFT_V1.md + protran_tfa/) — finance venue (IJF/QF) 가능". **연결 약함, 전이 가능성만**: Powerformer 는 point forecast(MSE/MAE)이고 ProTran-TFA 는 확률/quantile 축이라 직접 이식은 아니다. RBCA 마스크를 확률 트랜스포머 인코더에 드롭인하는 전이는 가능하나, 본 논문은 캘리브레이션·분위수를 다루지 않으므로 인용은 "국소성 귀납 편향의 인코더 이식" 수준의 보조 참조에 그친다.
- **Grokking track (§B, §A)**: flip-flop read/ignore/write 분석은 §B(회로) 정신과 닿지만, 본 논문은 grokking(지연 일반화)을 다루지 않는다. **전이 가능성만** — "PE 감쇠 형태가 TS 과제의 grokking 타이밍을 shift 시키는가"는 별도 실험 가설(10_extensions 참조)이지 본 논문의 주장이 아니다.
