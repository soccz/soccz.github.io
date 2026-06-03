# 9-C. 실험 아이디어 2개

## 실험 1 — APF 의 2D Motif 분해: MOIRAI Any-Variate Attention 의 head specialization

**가설**: MOIRAI-Small 의 6 layer × 6 head = 36 head 중 일부는 *self-variate motif* (같은 변량 안의 시간 attention), 일부는 *cross-variate motif* (다른 변량 사이의 시간 attention) 에 *expert specialization*. 즉 $u^{(1)}, u^{(2)}$ 의 학습된 값과 (m=n) / (m≠n) attention weight 의 분포가 head 별로 *bimodal* 분리.

**데이터**:
- HuggingFace `Salesforce/moirai-1.0-R-small` 가중치 사용 (학습 비용 무).
- ETT (4 변량) + Electricity (321 변량) + Solar (137 변량) 3 데이터셋의 *validation window* 100 개.
- 각 window 에서 *attention weight tensor* $A_{ij,mn}$ 를 layer × head 단위로 추출.

**비교 조건**:
- 조건 A: 학습된 MOIRAI-Small (with Any-Variate Attention).
- 조건 B: 같은 backbone 에서 $u^{(1)} = u^{(2)} = 0$ 로 force (이진 bias 없애기). 학습 안하고 inference 만 변경.
- 조건 C: $u^{(1)} = 100, u^{(2)} = -100$ 로 force (self-variate 강제 집중).

**예상 결과**: 조건 A 에서 head 가 *2 그룹* 으로 자연 분리 — *self-variate group* ($u^{(1)} > u^{(2)}$, self-attention dominant) vs *cross-variate group* ($u^{(2)} > u^{(1)}$, cross-attention dominant). 그룹 크기 비율은 데이터셋에 따라 (변량 수 많은 데이터셋일수록 cross-variate group 비중 큼) 변화.

**반증 조건**: 만약 36 head 모두 $u^{(1)} \approx u^{(2)}$ 이고 (m=n) / (m≠n) attention 가 *uniform* 하면, Any-Variate Attention 의 *head specialization* 가설 실패. 즉 두 스칼라가 *학습 신호 없이 noise 로 수렴* — MOIRAI 의 디자인 효과가 실제로 *작용 안 한 head 다수*.

**비용 추정**: 학습 불필요, *inference 만*. MOIRAI-Small 14M param 가중치 download (HF) 한 후, A100-40G 1대에서 300 window × 3 데이터셋 × 36 head × 3 조건 = ~10000 forward = *수 시간*. APF 의 직접 실험 (n=12 motif sweep) 과 비교해 비용 ¼ 수준. *고 ROI*.

**APF 에의 환원**: 결과를 APF Paper 의 Section 4 (Experiments) 에 *baseline case study* 로 삽입. *2D motif 분해의 첫 정량 검증* — APF 의 contribution 의 *empirical anchor*.

## 실험 2 — ProTran-TFA 의 *Mixture Head 의 금융 도메인 특화*: MOIRAI mixture vs *regime-conditional mixture*

**가설**: MOIRAI 의 4-mixture (Student-T + log-normal + Negative Binomial + low-var Normal) 를 *금융 수익률 도메인* 에 zero-shot 적용 시, $w_i$ 가중치가 *uniform* 에 가까움 (해석 불가, identifiability 실패). 반면 *2022AEL 의 regime indicator* (high-vol / low-vol regime) 를 *prior* 로 conditioning 하면, $w_i$ 가 *regime 별로 명확 분리* — high-vol 에서 *Student-T (fat-tail) 가중치 ↑*, low-vol 에서 *low-var Normal 가중치 ↑*.

**데이터**:
- Ken French 25 size-BM 포트폴리오 monthly returns (2000-2023).
- regime indicator: VIX-based binary (VIX > 25 = high-vol, else low-vol).
- Train / val / test split: 2000-2018 / 2019-2020 / 2021-2023.

**비교 조건**:
- 조건 X: MOIRAI-Small (HF 가중치) zero-shot inference. *학습된 mixture weights* 만 측정.
- 조건 Y: MOIRAI-Small backbone + 새 mixture head (4 component, regime-conditional prior $w_i = \sigma(W_r r + b_r)$, $r \in \{0,1\}$ regime indicator). 25 size-BM 의 last 5 년 fine-tune.
- 조건 Z: ProTran-TFA P1 plan 의 *기존 단일분포* head (Student-T 만). baseline.

**예상 결과**:
- 조건 X (zero-shot): $w_i$ 가 4 컴포넌트에 ~uniform 분포 — 금융 도메인 underexposure (LOTSA Econ-Fin 0.09%) 의 직접 증거.
- 조건 Y (regime-cond): high-vol regime 에서 Student-T 가중치 0.5+ , low-vol 에서 low-var Normal 가중치 0.4+ — *regime 별 분포 형태 변화* 의 mixture 표현. CRPS / MASE 가 조건 X 대비 5-15% 개선 예상.
- 조건 Z (단일 Student-T baseline): CRPS / MASE 가 *조건 Y < 조건 X < 조건 Z* 일 것으로 예상.

**반증 조건**: 만약 조건 Y 가 조건 X 대비 *유의미 개선 없음* (5% 미만 CRPS 감소), 또는 *regime-conditional weights* 가 *regime indicator 와 무관* 하게 수렴, 그러면 *regime-cond mixture* 의 가치 없음 — *ProTran-TFA 의 P1 plan 의 방향성 재검토 필요*. 만약 조건 X 가 조건 Z 보다 *우위* 이면, *uniform mixture* 도 단일 분포보다 강함 — *모든 ProTran 류는 mixture 로 가야* 라는 결론.

**비용 추정**:
- 조건 X: inference only. A100 1대 × 1시간 (Ken French data 가 작음).
- 조건 Y: fine-tune. A100 1대 × 4시간 (MOIRAI 의 작은 head 만 + 5년 monthly data).
- 조건 Z: baseline 학습. A100 1대 × 2시간.
- 총: A100 × 7시간 = ~$15-20 (cloud rental). *극저비용 고가치 실험*.

**ProTran-TFA 에의 환원**: ProTran-TFA Paper §3.2 (Probabilistic Head) 의 *empirical motivation* 으로 직접 활용. *2022AEL Tactical Factor Allocation 의 IJF/QF venue* 에 *경험적 증거* 로 등재 가능. 본 사이트 paper-수 트랙의 *직접 응용*.

## 두 실험의 관계와 우선순위

- 실험 1 은 **APF active track** 의 *direct extension* — 단기 (1-2 주) 우선순위 높음.
- 실험 2 는 **ProTran-TFA paused track 의 reactivation 트리거** — 지도교수 결정 따라 *Q3 2026* 후순위.
- 두 실험 모두 *학습 비용 거의 없음* (HF 가중치 활용) — *epistemically high ROI*.
- 둘 다 *MOIRAI 의 본문 claim 의 정량 검증* — 본 논문이 본 사이트에서 *anchor* 위치 차지하면, 두 실험이 *그 anchor 의 fortification*.
