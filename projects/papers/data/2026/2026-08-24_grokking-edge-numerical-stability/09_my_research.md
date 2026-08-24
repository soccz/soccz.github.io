# 8. 내 연구와의 연결

> **봉인 고지 (`_prompt.md` §섹션 9 봉인 준수)**: 아래에서 사용자 프로젝트에 대해 단정하는 사실은 **`_profile.md` 와 `_index.md` 에 문자 그대로 적힌 것만**이다. 원격 실행 환경은 로컬 실물 문서(`AETHER_IDEA.md`, 각 draft 등)를 읽지 않았다. 초안의 절 번호·수식 번호는 프로필에 없으므로 **어떤 절 번호도 단정하지 않는다** — 인용 위치는 "어느 논증 자리"로만 지정한다.

---

## 먼저: 이 논문이 두 track 중 어디에 걸리는가

`_profile.md` 관심 영역 기준으로 **§A(Grokking / Delayed Generalization)** 가 주 접점, **§B(Mech interp)** 와 **§C(Attention as Explanation / PE-Attention Geometry)** 가 보조 접점이다. 그런데 이 논문의 진짜 가치는 §A 쪽 "흡수할 기법"이 아니라 **§A·§C 양쪽에 대한 위협 진단**이다. 순서대로 간다.

---

## 1. Grokking track (`Grokking in Time Series Transformers`) — 가장 중요한 발견은 "이 메커니즘이 전이되지 않는다"는 것

프로필에 적힌 이 track 의 정체는 **"Grokking × TS forecasting × non-stationarity × circuit analysis" 4-way intersection (0 papers found)** 이다. 여기서 **TS forecasting** 이라는 단어가 결정적이다.

### 1-1) 냉정한 판정: 예측(forecasting) 손실을 쓰는 한 SC 도 NLM 도 발동하지 않는다

본 논문 §5.2 verbatim: "When using MSE loss the logits can overshoot the target, meaning that larger logits often do not lead to a lower MSE loss. This explains why [prior works] observed grokking with MSE loss without regularization."

- **SC 는 소프트맥스 분모의 흡수 현상**이다. 회귀 헤드에는 소프트맥스 분모가 없다 → **SC 라는 사건 자체가 존재하지 않는다.**
- **NLM 은 식 (8)(9)를 동시에 만족하는 방향**이다. MSE 에서는 출력을 $c>1$ 배 하면 타깃을 overshoot 해 손실이 **커지므로** 식 (8)이 깨진다 → **NLM 방향이 존재하지 않는다.**

이건 나쁜 소식이 아니라 **연구 설계상 유용한 소식**이다. 두 가지 결과가 따라 나온다.

**결과 A — 이 track 이 관찰할 그로킹은 "다른 종류의 그로킹"이다.** Power 2022 이래의 modular arithmetic 그로킹은 (본 논문에 따르면) CE 손실 + one-hot 표현 + NLM 이라는 특수 조합의 산물이다. 시계열 예측에는 그 조합이 없다. 따라서 **"TS 에서 그로킹이 관찰되지 않는다"는 음성 결과가 나와도 그건 Power 계열 그로킹의 부재이지 지연 일반화 현상의 부재가 아니며, 반대로 관찰된다면 그건 반드시 다른 메커니즘이다.** 이 논증은 track 의 논문에서 **novelty 방어에 그대로 쓸 수 있다** — "선행 연구의 그로킹 메커니즘(SC/NLM)은 회귀 손실에서 원리적으로 소거되므로, TS forecasting 에서 관찰되는 지연 일반화는 새로운 설명을 요구한다."

**결과 B — 어떤 메커니즘이 남는가**: 회귀에서도 살아남는 후보는 08 절 평행 연구 ⓐ의 **Kumar et al.(lazy→rich 전이, ICLR 2024)** 계열이다. Kumar 는 다항식 회귀에서 그로킹을 만들어내므로 CE 에 의존하지 않는다. **즉 이 track 의 이론적 뼈대는 Prieto 가 아니라 Kumar 쪽에 있어야 한다.** 오늘 후보 평가에서 Kumar 를 대기 후보로 이월한 이유가 여기서 실용적 의미를 갖는다 — 다음 코어 슬롯에서 우선 커버할 근거가 하나 더 생겼다.

### 1-2) 그래도 즉시 흡수할 것: 분류 헤드를 쓰는 순간 전부 되살아난다

프로필 데이터 목록에 **regime-switching synthetic** 이 있고, 관심 영역 §E 에 **Regime detection / classification** 이 있다. 만약 이 track 이 "레짐 분류"나 "방향(up/down) 분류" 같은 **분류 헤드**를 하나라도 붙이는 순간, SC·NLM 이 전부 되살아난다. 특히:

- 레짐 분류는 클래스 수가 적고(2~4), 합성 데이터라 **완전 암기가 쉽다** → 본 논문의 "암기 무료 레짐"과 정확히 같은 조건.
- 프로필에 적힌 **logistic map** 은 `_index.md` Tier 1 의 "(2025 thesis) Grokking Applied to Chaotic Iterates of the Logistic Map" 과 직접 비교 대상으로 지정돼 있다. 그 thesis 가 회귀인지 분류인지는 **프로필 기준 미상**이지만, **분류라면 그 thesis 의 결과 전체가 SC 재감사 대상**이다. 이건 track 의 비교 실험에서 반드시 먼저 확인해야 할 항목이다.

**즉시 이식할 도구**: 05_method_z 의 진단 3종을 track 의 실험 하네스에 **기본 로깅으로 상시 탑재**한다.
```
loss==0.0 샘플 비율 / cos(∇L, θ) / float64 재실행 대조
```
로깅 비용이 사실상 0 이고, 이걸 켜두면 "TS 에서 그로킹이 안 왔다"는 결과를 보고할 때 **계측 실패가 아님을 증명**할 수 있다. 프로필상 이 track 은 **Day 1-5, Week 1 setup** 단계다 — 하네스를 지금 짜고 있다면 **지금이 넣을 타이밍**이다. 나중에 넣으면 이전 실험 전부를 재실행해야 한다.

### 1-3) 인용 초안 (Grokking track 논문)

> Related work 의 "그로킹 메커니즘" 문단, Power/Nanda 소개 직후 자리:
> "Recent work has questioned whether the regularization-dependence of grokking is intrinsic: Prieto et al. (2025) show that in unregularized settings, floating-point absorption in the Softmax denominator (*Softmax Collapse*) drives per-sample gradients to exactly zero, and that the reported stopping point moves with numerical precision (float32 vs. float64). They further identify a *naïve loss minimization* direction — one that decreases cross-entropy while leaving predictions unchanged up to a positive scaling — as the driver of the delay. Crucially for our setting, both mechanisms are properties of the softmax cross-entropy objective: under a regression loss, logit rescaling overshoots the target and the NLM direction does not exist (Prieto et al., 2025, §5.2). Delayed generalization observed in time-series forecasting therefore cannot be attributed to these mechanisms and requires a separate account."

> Experimental setup 의 "measurement hygiene" 각주 자리:
> "For every run we log the fraction of samples whose loss evaluates to exactly zero and the cosine alignment between the gradient and the parameter vector, and we re-run a float64 control, following the diagnostic implied by Prieto et al. (2025, §3.2, Fig. 2). No run in this paper exhibits Softmax Collapse."

---

## 2. APF track (`Attention Pattern Fields`) — 여기가 진짜 위협이다

프로필에 적힌 APF 의 framework 는 **"PE → 2D attention motif → CNN probe → causal intervention"** 이고, 비교 축은 **PE (NoPE/sinusoidal/learned/RoPE/ALiBi) × motif 종류 (diagonal/stripe/block/edge/spike/checker)** 다. 이 두 줄에 본 논문이 정면으로 걸린다.

### 2-1) `spike` motif 가 수치 아티팩트일 가능성

어텐션 가중치는 소프트맥스로 만들어진다. **spike motif = 한 위치에 거의 모든 질량이 몰린 극단적으로 뾰족한 분포** = 본 논문 식 (2)가 기술하는 흡수 조건과 **같은 레짐**이다. Table 1 의 네 번째 행 "**Stablemax Attention**"(WikiText-103 58.52%±0.04)은 저자들이 어텐션 소프트맥스에도 같은 처방을 시도했다는 증거다 — 즉 **어텐션 소프트맥스에서의 SC 는 이 논문 프레임에서 예측되는 현상**이다.

따라서 APF 에 대한 구체적 위협은 이렇다:

> **CNN probe 가 `spike` 를 검출할 때, 그것이 모델이 학습한 어텐션 구조인지, 아니면 float32 가 뭉갠 포화 상태인지 구분되지 않는다.** 극단적으로는 서로 다른 attention logit 분포들이 모두 동일한 one-hot 에 가까운 float 표현으로 붕괴해, **정보가 있는 곳에서 정보가 사라진 motif** 가 관측될 수 있다.

이건 일반론이 아니라 **APF 의 motif 목록에 문자 그대로 적힌 항목 하나(`spike`)에 대한 지목**이다.

### 2-2) PE 축과의 교호작용 — 비교 자체가 오염될 수 있다

더 나쁜 건 이쪽이다. APF 의 핵심 비교는 **PE 종류를 바꿔가며 motif 분포가 어떻게 변하는지** 보는 것이다. 그런데 PE 마다 **어텐션 로짓의 스케일과 분포가 다르다**:

- **ALiBi** 는 거리에 비례하는 **선형 음의 바이어스를 로짓에 직접 더한다**(2026-07-20 커버). 먼 위치의 로짓이 계속 내려가므로, 긴 시퀀스에서 최댓값과의 격차가 커져 **흡수가 더 쉽게 일어난다**.
- **RoPE** 는 회전으로 위치를 넣으므로(2026-07-06 커버) 로짓 스케일에 미치는 영향이 ALiBi 와 질적으로 다르다.
- **NoPE** 는 위치 편향이 없어 로짓 격차가 상대적으로 완만할 수 있다.

즉 **"PE 를 바꿨더니 motif 분포가 바뀌었다"는 APF 의 관측이, 실제로는 "PE 를 바꿨더니 소프트맥스 흡수 임계에 도달하는 정도가 바뀌었다"일 수 있다.** 이건 APF 의 주 결과에 직접 붙는 교란 요인(confounder)이며, 프로필에 적힌 **"TMAO method falsified at n=12"** 이후 진행 중이라는 **motif causality 실험**의 신뢰도에 곧바로 영향을 준다.

### 2-3) 처방 — APF 에 즉시 추가할 통제 실험

비용이 작고 방어력이 큰 순서로:

1. **어텐션 엔트로피·최대 가중치 로깅**: 각 (PE, layer, head)에서 어텐션 분포의 최대 가중치가 1.0 으로 반올림되는 비율을 잰다. 이것이 `spike` motif 검출률과 상관되는지 확인.
2. **float64 어텐션 재계산 대조**: 학습된 가중치를 고정하고 어텐션만 float64 로 다시 계산해 motif 맵을 다시 뽑는다. **맵이 바뀌면 그 motif 는 수치 아티팩트다.** 재학습이 필요 없으므로 비용이 매우 낮다 — 프로필상 APF 는 이미 **12 review loops 완료 / motif sweep n=8/PE 진행 중**이므로, 기존 체크포인트에 대해 사후 적용 가능하다.
3. **StableMax Attention 대조군**: 본 논문 Table 1 의 네 번째 행과 같은 방식으로 어텐션 소프트맥스를 교체한 모델을 PE 별로 하나씩 학습해 motif 분포를 비교한다. 분포가 유지되면 motif 는 실재, 무너지면 아티팩트.

**2번은 반나절짜리이고 APF 논문의 threats-to-validity 를 통째로 하나 막는다.** 오늘 이 논문에서 건질 수 있는 가장 실질적인 산출물이 이것이다.

### 2-4) 인용 초안 (APF 논문)

> Threats to validity / Limitations 자리:
> "One concern specific to motif taxonomies that include highly peaked patterns is numerical: Prieto et al. (2025) show that when one term dominates a softmax denominator, floating-point absorption makes the normalized distribution collapse to an exactly one-hot representation (their Eq. 2), and they report a StableMax variant applied to the attention softmax itself (their Table 1). We therefore recompute all attention maps in float64 from fixed checkpoints and verify that the detected `spike` motifs are invariant to this recomputation; motifs that are not invariant are excluded from the causal-intervention analysis."

> PE 비교 섹션의 각주:
> "Because positional schemes differ in how they shift attention logits — ALiBi adds a distance-proportional negative bias, RoPE rotates without an additive scale term — the softmax saturation threshold is not identical across PE conditions. We report the fraction of saturated attention rows per PE as a control."

---

## 3. Paused track — P1 ProTran-TFA

프로필상 P1 은 **2022AEL probabilistic Transformer 확장이며 finance venue(IJF/QF) 가능**으로 적혀 있다. 확률 예측 헤드를 쓰는 작업이므로, 본 논문의 SC/NLM 은 **직접 적용되지 않는다**(분류 CE 가 아님). 다만 분위수·분포 파라미터를 소프트맥스나 그와 유사한 정규화로 산출하는 부분이 있다면(예: 혼합 성분 가중치) 같은 흡수 문제가 잠재한다 — 2026-08-21 커버한 Shchur et al. 의 로그정규 **혼합** 밀도가 정확히 그런 구조다.

**연결 강도: 약함.** 전이 가능성만 있고, 구체 mechanism 은 "혼합 가중치 소프트맥스의 포화"라는 한 지점에 한정된다. 프로필에 P1 의 헤드 구조가 적혀 있지 않으므로 그 이상은 **프로필 기준 미상**이다.

---

## 4. 반면교사 — 이 논문이 못한 것을 내가 어떻게 다룰까

07 절 반박 2 에서 짚었듯, 본 논문은 **NLM 정렬의 설명력을 정량 분해하지 않는다**. Figure 5 는 "정렬이 높다"까지만 간다. 이 레포가 2026-08-14 Hase et al. 에서 배운 것은 **상관을 $R^2$ 증분으로 분해하기 전에는 인과의 크기를 말할 수 없다**는 것이었다.

두 track 에 적용하면:
- **APF 의 motif causality 실험**에서 "motif 가 있다 / 개입하면 성능이 떨어진다"로 멈추지 말고, **motif 존재 여부가 성능 분산의 몇 %를 설명하는지**를 회귀로 분해해 보고한다. 프로필상 이미 causal intervention 이 framework 에 들어 있으므로, 개입 결과를 분산 분해로 마무리하는 것은 추가 실험이 아니라 **분석 한 단계 추가**다.
- **Grokking track** 에서 "지연이 관찰됐다"를 보고할 때, 지연 시간을 종속변수로 두고 후보 요인들(초기화 스케일, 데이터 크기, 정렬도, 수치 정밀도)을 독립변수로 넣어 **어느 것이 몇 %를 설명하는지** 표로 낸다. 이 표 하나가 "우리는 상관만 봤다"는 리뷰어 공격을 미리 막는다.
