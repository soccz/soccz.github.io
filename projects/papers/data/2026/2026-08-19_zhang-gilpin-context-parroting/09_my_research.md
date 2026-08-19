# 8. 내 연구와의 연결

> **§9 봉인 준수 선언**: 이 절의 내 프로젝트 관련 사실은 **`_profile.md` 와 `_index.md` 에 문자 그대로 적힌 것만** 근거로 쓴다. 두 파일에 없는 아키텍처·수식·절 번호·인물 정보는 **"프로필 기준 미상"** 으로 표기하고 창작하지 않는다. 인용 앵커로 쓸 파일명도 프로필에 등장하는 것만 적는다.

> **배경 사다리**: 이 절을 이해하려면 프로필에 기록된 두 active 트랙의 정의만 알면 된다. **APF** = *"PE → 2D attention motif → CNN probe → causal intervention"* framework, **Grokking** = *"Grokking × TS forecasting × non-stationarity × circuit analysis"* 4-way intersection.

---

## 8.1 연결 강도 사전 판정

이 논문은 프로필 **§D(TS Transformers / TSFM Interp)** 에 직격하고, **§B(Mechanistic Interpretability / Circuit Analysis)** 와 induction head 로 교차하며, **§F(원거리 — information theory in TS)** 와 스케일링 법칙으로 접한다. **§E(금융 응용)** 와의 연결은 **약하다** — 전이 가능성만 있고 논문에 금융 데이터는 없다. 강한 연결부터 쓰고, 약한 연결은 약하다고 명시한다.

---

## 8.2 흡수할 기법 — APF 트랙 (연결 강도: **강**)

### (1) parroting 은 APF motif 어휘의 특정 원소에 대응한다 — 가장 구체적인 다리

프로필에 기록된 APF 의 motif 종류는 **diagonal / stripe / block / edge / spike / checker** 여섯이다. 그런데 context parroting 이 어텐션 수준에서 실행된다면, 그것이 남길 흔적은 **하나로 특정된다**: 질의 위치가 문맥 내 $s_{opt}$ 를 가리키는 **오프셋 $\Delta = L - s_{opt}$ 짜리 off-diagonal stripe**. Algorithm 1 의 4번째 줄이 *"Set the first $L-s_{opt}$ predicted points to be $x_{L+1:2L-s_{opt}}=x_{s_{opt}+1:L}$"* 라고 적는 그 $L - s_{opt}$ 가 **곧 stripe 의 오프셋**이다.

이것이 왜 큰가: APF 의 motif 분류가 지금까지는 **기술적(descriptive)** 이었다면, 이 논문은 그중 한 원소(stripe)에 **알고리즘적 의미와 정량적 예측**을 붙여준다. 즉 "stripe motif 가 보인다"가 "이 모델은 지연좌표 $D$ 로 최근접이웃 복사를 하고 있다"로 번역된다. **APF 의 CNN probe 가 stripe 를 검출했을 때, 그 검출이 무엇을 뜻하는지 말할 수 있는 언어를 이 논문이 제공한다.**

**구체적 흡수 방안**: APF 의 CNN probe 라벨 체계에서 stripe 를 **오프셋 값 $\Delta$ 를 갖는 파라미터화된 motif** 로 승격시킨다. 그리고 검증은 프로필에 기록된 APF 의 네 번째 단계 **causal intervention** 으로 한다 — stripe 를 마스킹했을 때 예측이 parroting 에서 이탈하는지. 이것이 정확히 [07_limits.md](07_limits.md) 반박 1 에서 "이 논문이 하지 않은 실험"으로 지목한 것이며, **프로필 기준 APF 는 그 실험을 할 도구를 이미 갖고 있다**(프로필 Status: *"motif causality 실험 진행 중"*).

### (2) PE 축 × parroting 능력 — APF 의 주 비교축에 새 종속변수를 추가

프로필에 기록된 APF 의 PE 비교군은 **NoPE / sinusoidal / learned / RoPE / ALiBi** 다. 본 논문의 관점을 얹으면 새로운 가설이 즉시 생성된다:

> **ALiBi 는 거리에 비례하는 선형 페널티를 어텐션 점수에 더하므로, 문맥 먼 곳에 있는 최적 매칭 모티프 $s_{opt}$ 에 도달하기 구조적으로 불리하다. 따라서 ALiBi 계열은 parroting 능력이 억제되고, 그 결과 문맥 길이 $L$ 을 늘렸을 때의 개선 지수 $\alpha$ 가 $1/d_{\mathrm{cor}}$ 보다 작게 나타나야 한다.**

이 가설이 좋은 이유는 **PE 선택이 성능에 미치는 영향을 "좋다/나쁘다"가 아니라 "어떤 알고리즘의 실행 가능성"으로 환원**하기 때문이다. 그리고 반증 가능하다 — ALiBi 가 $\alpha$ 를 떨어뜨리지 않으면 가설 기각. 이 레포가 2026-07-20 에 커버한 ALiBi(arXiv:2108.12409)와 2026-07-06 커버 RoPE(arXiv:2104.09864) 해체가 그대로 이 실험의 설계 근거가 된다.

### (3) 데이터 자산이 이미 맞아떨어진다

프로필의 APF 데이터는 **synthetic motif benchmark (trend / seasonal / regime / anomaly / freq drift) + UCR Archive** 다. 이 중 **`regime` 과 `freq drift`** 가 본 논문의 가장 큰 공백([07_limits.md](07_limits.md) 반박 2: 비정상성)을 직접 겨냥한다. 즉 **원 논문이 만들지 않은 스트레스 조건을 내 벤치마크가 이미 갖고 있다.** 이건 우연한 이점이 아니라 즉시 논문화 가능한 격차다.

### (4) 충돌 지점 — 정직하게 짚어야 할 것

본 논문이 옳다면, TSFM 어텐션 패턴의 상당 부분이 **하나의 motif(복사 stripe)로 환원**될 수 있다. 이는 APF 의 전제 — 여섯 종류의 풍부한 motif 어휘가 의미 있는 구분을 만든다 — 를 **부분적으로 압박한다.** "motif 가 여섯 개인데 실제로 성능을 만드는 건 하나뿐"이라면 APF 의 분류학은 서술적 사치가 된다.

**대응 전략은 회피가 아니라 흡수다.** APF 는 이 압박을 **가설로 전환**해야 한다: "motif 다양성이 성능 다양성과 대응하는가, 아니면 stripe 하나가 성능을 지배하고 나머지는 부수현상인가?" 이 질문에 **stripe 지배**라고 답이 나와도 APF 는 살아남는다 — 그때 APF 의 기여는 "**motif 어휘 중 무엇이 인과적으로 작동하는지 causal intervention 으로 가려냈다**"가 되기 때문이다. 오히려 이쪽이 더 강한 논문이다. 프로필에 *"TMAO method falsified at n=12"* 로 기록된 선례가 있듯, 이 트랙은 이미 자기 방법을 반증하는 경험을 갖고 있다.

---

## 8.3 흡수할 기법 — Grokking 트랙 (연결 강도: **중~강**)

### (1) 즉시 실행해야 할 방어 — 내 grokking 실험에 parrot baseline 을 넣어라

프로필에 기록된 Grokking 트랙 데이터는 **sin/periodic synthetic, logistic map, regime-switching synthetic, ETT-mini, Weather-mini, Traffic-mini** 다. 여기서 위험 신호가 두 개 보인다.

- **`sin/periodic synthetic`**: 완전 주기 신호에서 context parroting 은 **거의 최적**이다. 모델이 "grokking 후 일반화했다"고 보고할 때, 그 일반화 성능이 parroting 하한선을 얼마나 초과했는지 보이지 않으면 **"grokking 이 아니라 복사 회로 획득"** 이라는 대안 설명을 배제할 수 없다.
- **`logistic map`**: 카오스 반복사상이다. 프로필의 priority Tier 1 에 *"(2025 thesis) Grokking Applied to Chaotic Iterates of the Logistic Map"* 이 등재돼 있으므로 직접 비교 대상이기도 하다. 본 논문의 §5.2 는 **카오스계에서 복사 성능이 문맥 길이에 대해 $L^{-1/d_{\mathrm{cor}}}$ 로 개선**된다고 예측한다. 로지스틱 사상의 상관차원은 낮으므로 $\alpha$ 가 크고, **복사가 꽤 잘 통한다**는 뜻이다.

**따라서 처방은 명확하다**: Grokking 트랙의 평가 루프에 **parrot baseline 열**을 상설로 추가하고, 보고 지표를 절대 성능이 아니라 **excess-over-parroting** 으로 바꾼다. 비용은 거의 0(20줄 코드)이고, 방어 효과는 크다. NeurIPS 2027 을 1순위로 두는 계획(프로필 기록)에서 리뷰어가 반드시 물을 질문 — "이 일반화가 단순 복사와 어떻게 다른가?" — 을 **선제적으로 봉쇄**한다.

### (2) 4-way intersection 의 빈칸을 이 논문이 절반 채운다

프로필에 기록된 Grokking 트랙의 정체성은 **"Grokking × TS forecasting × non-stationarity × circuit analysis" 4-way intersection (0 papers found)** 이다. 본 논문은 이 중 **TS forecasting × circuit analysis** 두 축에 걸친다(induction head 유비 + TSFM 예측). 즉 **교집합이 여전히 0 이라는 주장은 유지되지만**, "인접 셀이 채워지고 있다"는 신호다.

이건 위협이 아니라 **논문 서론의 재료**다. Grokking 논문의 related work 에서 "인접 두 축의 교차는 최근 다뤄지기 시작했으나(본 논문), non-stationarity 와 grokking 축은 여전히 비어 있다"는 형태로 **빈칸의 위치를 더 정밀하게 그릴 수 있다.** 빈칸 주장은 이웃 셀이 채워질수록 강해진다.

### (3) 가장 큰 기회 — 비정상성 축에서 이 논문이 못 한 실험을 내가 갖고 있다

[07_limits.md](07_limits.md) 반박 2 와 [08_lineage.md](08_lineage.md) 후손 3 에서 설계한 실험 — **어트랙터가 드리프트할 때 복사와 학습된 사전지식 중 무엇이 먼저 무너지는가** — 은 본 논문이 구조적으로 답할 수 없다(dysts 는 고정 파라미터 자율계). 그런데 프로필 기준 내 Grokking 트랙은 **`regime-switching synthetic`** 데이터를 이미 보유하고 있고, APF 는 **`regime` · `freq drift`** motif 벤치마크를 갖고 있다.

**즉 두 트랙의 데이터 자산이 이 논문의 최대 공백 위에 정확히 놓여 있다.** 이건 이 해체에서 발견한 가장 실무적인 성과다.

---

## 8.4 §E 금융 응용 (연결 강도: **약 — 전이 가능성만**)

프로필의 Paused 항목 **P1 ProTran-TFA (`paper_test/PAPER_DRAFT_V1.md` + `protran_tfa/`, finance venue IJF/QF 가능)** 와의 연결은 **약하다.** 논문에 금융 데이터가 없고, 저자들의 관심은 물리계다. 다만 **한 가지 구체적 전이**는 성립한다:

parroting 은 **점 예측만** 내놓고 예측 구간을 만들지 못한다([07_limits.md](07_limits.md) 암묵적 가정 ③). 프로필 기준 P1 이 probabilistic 계열이라면 **"parroting 이 이기지 못하는 영역이 확률 예측"** 이라는 사실이 그 라인의 존재 이유를 보강한다. 인용은 방어적으로 — "점 예측 지표에서는 무학습 복사 베이스라인이 강력하므로(Zhang & Gilpin 2026), 본 연구는 분포 예측 품질(CRPS·커버리지)을 주 지표로 삼는다" 정도. P1 의 내부 구조·수식·절 번호는 **프로필 기준 미상**이라 더 구체화하지 않는다.

---

## 8.5 인용 포인트 초안

> **주의**: 아래 초안의 **삽입 위치(절 번호)는 프로필 기준 미상**이다. 내 원고의 실제 절 번호는 파일을 열어 확인한 뒤 채운다. 문장 형태만 제시한다.

**① APF 논문 — baseline / experimental setup 절**
> "어텐션 motif 를 성능의 원인으로 주장하려면, 학습 없이 문맥을 복사하는 것만으로 도달 가능한 성능을 먼저 배제해야 한다. 우리는 Zhang & Gilpin (2026, arXiv:2505.11349) 의 context parroting (Algorithm 1, $D$=임베딩 차원) 을 모든 실험의 하한선으로 보고하며, 제안 probe 의 설명력은 **excess-over-parroting** 으로 정의한다."

**② APF 논문 — motif taxonomy 절 (stripe 정의 지점)**
> "off-diagonal stripe motif 는 오프셋 $\Delta$ 를 갖는 복사 연산으로 해석될 수 있다. Zhang & Gilpin (2026) 은 이 연산이 지연좌표 공간의 1-최근접이웃 검색과 동치이며 induction head 와 평행함을 지적했다(§3, Algorithm 1; §5.2). 본 연구는 이 해석을 causal intervention 으로 직접 검증한다 — stripe 마스킹이 예측을 parroting 에서 이탈시키는지 측정함으로써, 원 논문이 행동 수준에서만 제시한 진단을 회로 수준으로 승격시킨다."

**③ APF/Grokking 공통 — PE 비교 절**
> "PE 선택은 모델이 문맥 내 원거리 모티프에 도달할 수 있는지를 결정하며, 따라서 parroting 전략의 실행 가능성 자체를 좌우한다. ALiBi (Press et al., 2022) 의 거리 선형 페널티는 원거리 매칭을 억제하므로, Zhang & Gilpin (2026) 이 예측한 문맥 길이 스케일링 $e \propto L^{-1/d_{\mathrm{cor}}}$ 가 ALiBi 하에서 약화될 것으로 예상된다."

**④ Grokking 논문 — related work 절 (빈칸 주장 강화)**
> "TS forecasting 과 circuit-level 설명의 교차는 최근 시작됐다 — Zhang & Gilpin (2026) 은 시계열 파운데이션 모델의 제로샷 성능을 induction head 유형의 복사 전략으로 설명한다. 그러나 이 설명은 정상적 결정론계에 한정되며, non-stationarity 하의 학습 동역학(grokking)과는 아직 연결되지 않았다."

**⑤ Grokking 논문 — 실험 결과 절**
> "일반화 지표는 parroting 하한선 대비로 보고한다. 주기적 synthetic 데이터에서는 무학습 복사만으로도 낮은 오차가 달성되므로(Zhang & Gilpin, 2026), 절대 오차의 급감은 grokking 의 충분 증거가 되지 못한다."

---

## 8.6 반면교사 — 이 논문이 못 한 것을 내가 어떻게 할 것인가

| 원 논문의 공백 | 내 트랙에서의 처리 |
|---|---|
| Claim 2 가 **행동 관찰**에 머묾 (모델↔parrot 정량 유사도·개입 없음) | APF 의 **CNN probe + causal intervention** 으로 stripe motif 를 직접 절제. 프로필 기준 APF 는 이 도구를 보유(*"motif causality 실험 진행 중"*) |
| **비정상성 미검증** (dysts 는 고정 파라미터 자율계) | `regime-switching synthetic`(Grokking) + `regime`·`freq drift` motif 벤치마크(APF) 로 드리프트 하에서의 붕괴 곡선 측정 |
| $k$-NN / Theiler window **ablation 부재** | 내 baseline 구현에 두 스위치를 처음부터 넣어, "복사 성공"과 "단순 자기상관 지속성"을 분리 |
| **점 예측 지표에 편중** | 분포 지표(CRPS·커버리지) 병기. parroting 을 $k$-NN 부트스트랩으로 확률 예측화해 공정 비교 |
| $\alpha$ vs $1/d_{\mathrm{cor}}$ 검증이 **Spearman 0.85(순위 상관)** 에 그침 | 내 실험에서는 기울기·절편을 포함한 회귀로 보고해 **등식 주장의 강도**를 명시 |

## 8.7 이 절의 핵심 한 문장

**이 논문은 APF 의 stripe motif 에 알고리즘적 의미를 부여하고, Grokking 트랙에는 "당신의 일반화가 복사가 아님을 증명하라"는 방어 의무를 부과하며, 그 대가로 두 트랙 모두가 이미 보유한 비정상성 데이터 위에서 이 논문이 답하지 못한 질문을 선점할 기회를 남긴다.**
