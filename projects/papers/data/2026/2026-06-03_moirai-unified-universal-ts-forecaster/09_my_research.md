# 8. 내 연구와의 연결

이 절은 MOIRAI 를 **APF (Attention Pattern Fields, 🟢 active), Grokking in TS Transformers (🟢 active), P1 ProTran-TFA (⏸️ paused)** 세 자산에 어떻게 정확히 매핑할지를 *axis × 수식 요소 × 인용 위치* 의 구체 단위로 정리한다. 일반론 (예: "시계열 모델 참고") 은 회피하고, *내 논문의 어느 섹션 어느 식에 본 논문의 어느 수식/표/주장이 들어가는가* 의 구체 단위로 적는다.

## §A·B·C·D·E 의 어느 axis 와 연결되는가

`_profile.md` 의 관심 영역에서 본 논문의 axis 좌표:
- **§D (TS Transformers / 2D / TSFM interp)**: **주축** — MOIRAI 는 §D 의 TS transformer baseline + TSFM 일반론.
- **§C (Attention as Explanation / PE-Attention Geometry)**: **부축** — Any-Variate Attention 의 RoPE×이진 bias 는 §C 의 *RoPE / FIRE / DAPE / Yang TAPPA* 라인과 직접 충돌.
- **§E (금융 시계열 응용)**: **연결축** — Mixture Distribution Head 가 ProTran-TFA 의 분포 head 결정에 직접 안내. LOTSA 의 Econ/Fin 24.9M obs 활용 가능.
- **§B (Mech Interp / Circuit Analysis)**: **간접축** — APF 의 motif 분석을 MOIRAI 의 시간×변량 두 축에 적용 시 §B 와 교차.
- **§A (Grokking)**: **약함** — 직접 연결 약함, 단 LOTSA 의 cap=0.001 sampling 이 *non-stationarity × delayed gen* 4-way 교차의 한 축으로 활용 가능 (전이 가능성 정도).

## 흡수할 기법 — APF 직접

### 흡수 1: Any-Variate Attention 의 이중-축 PE 디자인 → APF 의 시간×변량 motif 실험으로 확장

**Mechanism**: MOIRAI Eq.(2) 의 $E_{ij,mn} = (W^Q x)^T R_{i-j} (W^K x) + u^{(1)} \mathbb{1}_{m=n} + u^{(2)} \mathbb{1}_{m \ne n}$ 가 시간축(RoPE)과 변량축(이진 bias) *두 종류 PE* 를 한 attention 안에 결합. 이는 APF 의 기존 1D PE-motif 분석을 *2D (시간×변량)* 로 확장하는 *천연 baseline*.

**APF 의 어디에 들어가는가**: `Attention Pattern Fields/paper/sections/STATUS.md` 의 motif sweep 실험 plan 에서 *현재 단일 sequence 의 motif (diagonal/stripe/block/edge/spike/checker) 분석* 이 진행 중. MOIRAI 의 *시간×변량 평탄화* 가 *기존 분석을 그대로 2-축 motif 분해* 로 확장 가능:

1. APF 의 motif 정의를 *(시간 거리, 변량 동일성)* 두 축의 *4-사분면* 으로 일반화 — (a) 같은 변량+가까운 시간 (diagonal-like), (b) 같은 변량+먼 시간 (stripe-like), (c) 다른 변량+가까운 시간 (cross-variate spike), (d) 다른 변량+먼 시간 (cross-variate block).
2. MOIRAI-Small 의 layer × head 별 *4-사분면 motif 활성도* 측정 → 어느 head 가 cross-variate 학습, 어느 head 가 self-variate 학습 분리.
3. $u^{(1)}, u^{(2)}$ 학습 스칼라가 *head 별로 어떻게 수렴* — 어떤 head 는 $u^{(1)} \gg u^{(2)}$ (self-variate 특화), 어떤 head 는 반대 (cross-variate 특화) → APF 의 *head 특화* 가설과 직접 검증.

**APF 의 인용 위치**: APF Section 3 (Method) 에서 *"우리는 1D sequence motif 를 2D (시간×변량) motif 로 확장한다. 이 확장의 자연스러운 baseline 은 Woo et al. 2024 (MOIRAI, ICML Oral) 의 Any-Variate Attention 으로, 시간축 RoPE 와 변량축 이진 bias 의 결합이 우리 framework 의 *separable PE* 가정과 부합한다 (Eq. 2 of Woo 2024)." Cite as P_d.

### 흡수 2: Multi-Patch-Size Projection 의 사전정의 lookup → APF 의 frequency-conditional motif sweep

**Mechanism**: MOIRAI 의 §3.1.1 의 사전정의 freq → patch_size 매핑이 *frequency 라는 외부 변수가 motif 형태를 결정* 한다는 implicit 가설을 운영. APF 의 motif sweep 에서 frequency 도 *control variable* 로 도입.

**APF 의 어디에 들어가는가**: APF motif sweep n=8 실험에 *frequency factor* 추가. ETT 의 hourly vs ETTm 의 15min vs Weather 의 10min 등 *동일 도메인 다른 freq* 에서 motif 분포가 어떻게 변하는지 측정.

**인용 위치**: APF Section 4 (Experiments) 에서 "Frequency-conditioned motif analysis follows the spirit of MOIRAI's multi-patch-size projection (Woo 2024 §3.1.1, Appendix B.1), where frequency is treated as an architectural-level prior". Cite as P_e.

### 흡수 3: Mixture Distribution Head → ProTran-TFA 분포 head 청사진

**Mechanism**: MOIRAI Eq.(4) 의 4-mixture (Student-T + log-normal + Negative Binomial + low-var Normal) 가 ProTran-TFA 의 *분포 head 디자인 결정* 에 직접 청사진 제공. 특히:
- 금융 수익률: *Student-T* (꼬리, 대칭).
- 거래량 / 변동성: *log-normal* (양수, 우측편향).
- 거래 건수 / 주문 흐름: *Negative Binomial* (이산).
- *Volatility regime indicator (낮은 분산 시점)*: *low-var Normal*.

ProTran-TFA 의 P1 plan 이 *2022AEL Tactical Factor Allocation* 확장 — 금융 수익률의 *시점별 분포 형태 변화* 를 mixture 로 모델링 가능.

**ProTran-TFA 의 어디에 들어가는가**: `paper_test/PAPER_DRAFT_V1.md` 의 분포 head section 에서, *기존* Tang & Matteson (2021) ProTran 의 *단일분포* head 한계를 *MOIRAI 의 4-mixture* 로 확장. Lag-Llama 의 *대칭 Student-T 단독* 한계 (Appendix B.3 of MOIRAI) 를 정면 인용 — *우리 ProTran-TFA 는 mixture 로 진보*.

**인용 위치**: ProTran-TFA 의 §3.2 (Probabilistic Forecasting Head) 에서 "Following Woo et al. 2024 (Eq. 4, Appendix B.2), we adopt a 4-component mixture distribution combining Student-T, log-normal, negative binomial, and low-variance normal. Unlike MOIRAI, our application is restricted to financial return distributions, and we further constrain weights $w_i$ via a regime-conditional prior (cf. our §3.3 regime indicator)". Cite as F_p.

## 충돌 / 경쟁 지점

### 충돌 1: APF 의 motif causality 와 MOIRAI 의 *flat sequence* 가정

**APF 의 주장**: PE 변경이 attention motif 의 *형태* 를 결정한다 (causality 검증 중).

**MOIRAI 의 가정 (충돌)**: 시간축과 변량축의 PE 가 *분리해서* 작동한다 (RoPE × 이진 bias 의 합). 즉 *시간 motif* 와 *변량 motif* 가 *직교적으로 결합* — 한 motif 가 다른 motif 에 영향 안 줌.

**APF 입장에서 반박**: 변량 동일성이 시간 motif 형태에 *교호효과* 가질 수 있음. 예컨대 같은 변량 (m=n) 안에서는 *diagonal motif* 가 dominant, 다른 변량 (m≠n) 사이에서는 *block motif* 가 dominant — 즉 *변량 동일성이 시간 motif 의 형태를 직접 결정*. 이는 MOIRAI 의 *분리 PE* 가정과 충돌.

**해결**: APF Paper 의 *2D motif* 분석 (위 흡수 1) 에서 (시간 동일성 × 변량 동일성) 의 *모든 4-조합* 의 motif 를 *separately 측정* → 만약 4-조합 motif 가 *각각 다른 형태* 면 MOIRAI 의 직교 가정 *틀림*. 만약 *비슷* 하면 MOIRAI 가정 *옳음* — APF 의 *causality framework* 가 그 결정에 *실험적 결판*.

### 충돌 2: Grokking-TS 의 *delayed gen* 가설과 MOIRAI 의 *1M step 학습*

**Grokking-TS 의 주장**: TS Transformer 에서도 *grokking* 같은 *delayed generalization* 이 발생할 수 있다 (active hypothesis).

**MOIRAI 의 학습 dynamics**: 1M step (Base/Large) — *충분히 길다*. 만약 Moirai 가 *학습 200k-500k step* 에서 *training loss 안정* 후 *test 성능 jump* 한다면 *grokking-like phase transition*.

**MOIRAI 본문 미보고**: 학습 곡선 미공개 — *training/test loss vs step* 시계열 그래프 없음. Grokking 의 *training-test gap monotonic 감소* vs *plateau → jump* 구분 불가.

**해결 (전이 가능성)**: Moirai 의 공개 가중치 (HuggingFace) + uni2ts 의 학습 코드로 *재학습 시 학습 곡선 측정* → grokking 발생 여부 검증. Grokking-TS 의 *non-stationarity × delayed gen* 4-way 교차의 한 축. 단 *full retraining 의 자원 비용 매우 큼* — 약한 연결.

## 인용 포인트 — 구체 문장 초안

### APF Paper, Related Work § (Section 2)

> "최근의 보편적 시계열 예측 (universal time series forecasting) 패러다임 — 특히 MOIRAI (Woo et al. ICML 2024) — 은 시간축과 변량축을 한 평탄화된 시퀀스로 다루며, RoPE (Su et al. 2024) 와 학습 가능 이진 attention bias (Yang et al. 2022b) 의 결합으로 두 축의 위치 정보를 분리 표현한다 (Eq. 2 of Woo et al. 2024). 본 연구는 이 분리된 위치 정보가 attention motif 의 *형태* 에 어떻게 매핑되는지를 정량 검증한다."

### APF Paper, Method § 3 (PE-Motif Coupling)

> "We extend the 1D motif typology of [prior APF work] to a 2D (temporal-distance × variate-identity) plane, motivated by MOIRAI's separable PE design (Woo et al. 2024 §3.1.2). Under their formulation, attention score decomposes additively as $E_{ij,mn} = (W^Q x)^T R_{i-j}(W^K x) + u^{(1)} \mathbb{1}_{m=n} + u^{(2)} \mathbb{1}_{m \ne n}$; the question we pose is whether motif structure in the resulting attention matrix preserves this additive separability or exhibits *interactive* patterns that depend jointly on $(i-j, \mathbb{1}_{m=n})$."

### ProTran-TFA Paper §3.2 (Probabilistic Head)

> "We adopt a 4-component mixture distribution head following Woo et al. (2024, Eq. 4), with Student-T, log-normal, negative binomial, and low-variance normal components (Appendix B.2 of Woo et al. 2024). Unlike MOIRAI's universal forecasting goal, we tailor this mixture to financial return forecasting by introducing a regime-conditional prior on component weights $w_i$, addressing the implicit identifiability gap that MOIRAI leaves unverified (their Table 7 shows the *aggregate* effect of mixture but not per-component activation)."

## 반면교사 — MOIRAI 가 못한 것을 내가 어떻게 다룰까

### 1. *Mixture component 의 데이터셋별 분기* 가 본문 미보고 → APF 가 *해석 가능성* 차원에서 채움

MOIRAI 는 mixture 의 *aggregate 효과만* 보고. APF 의 *motif × head specialization* analysis 와 결합하면, *어느 head 가 어느 mixture component 의 활성에 기여* 하는지 *causal intervention* 으로 분리 가능. 이는 APF 의 *interpretability* contribution.

### 2. *Scaling law* 미보고 → Grokking-TS 가 *학습 dynamics* 차원에서 채움

MOIRAI 는 *N (parameter) × D (data) → loss* 의 scaling 미보고. Grokking-TS 의 *4-way 교차* (grokking × TS × non-stationarity × circuit) 가 *학습 step 동안의 phase transition* 을 분석 — MOIRAI 의 *Small/Base/Large 3 size 만의 단편 정보* 를 *연속적 학습 dynamics* 로 확장.

### 3. *Healthcare / Econ-Fin 도메인 zero-shot* 미평가 → ProTran-TFA 가 *금융 특화* 차원에서 채움

MOIRAI 의 LOTSA Econ-Fin 24.9M obs (0.09%) 가 거의 *학습 영향 없음*. 금융 도메인의 *진정 zero-shot 평가* 가 누락. ProTran-TFA 는 *2022AEL Tactical Factor Allocation* 의 *25 size-BM 포트폴리오* 에 MOIRAI 를 *zero-shot 평가* + ProTran-TFA 와 비교 → MOIRAI 의 *quasi-universal* 한계를 *금융 도메인 specific finetune 으로 보완* 하는 *방법론적 contribution*.

### 4. Multi-modality (텍스트+테이블+시계열) 미지원 → 향후 *AETHER 확장 시* 활용

저자 §5 명시 한계. 만약 향후 AETHER (Bitcoin cycle) 라인 재개 시, *MOIRAI 의 시계열 backbone* + *FinBERT-style 텍스트 encoder* + *cross-modal attention* 의 *hybrid* 디자인 가능. 단 현재 AETHER 는 shelved.
