# 09. 내 연구와의 연결

## 배경 사다리

이 절은 TimesFM 의 어느 부분이 내 active track 두 개 (**APF** = Attention Pattern Fields, **Grokking in TS Transformers**) 와 paused track 두 개 (**P1 ProTran-TFA**, **P2 Autonomous Research Loop**) + shelved 자산 (Paper 1~4, EOA, RegFiLM, AETHER) 에 어떻게 연결되는지 **구체적 mechanism / axis / 수식 요소** 를 지정해서 매칭한다.

## 흡수할 기법

### A. APF main paper §3 motif typology 의 zero-shot substrate 로 TimesFM

- **매칭**: `_profile.md` §C (Attention as Explanation / PE-Attention Geometry) + §D (TS Transformers / 2D Representations / TSFM Interp) 양쪽에 걸림.
- **구체 mechanism**: APF 는 다양한 PE (NoPE / sinusoidal / learned / RoPE / ALiBi) 하 다양한 motif (diagonal / stripe / block / edge / spike / checker) 가 발현 · 사라지는 조건을 실증한다. TimesFM 은 (i) causal + no-PE (v2.0 부터) 조합의 실전 pretrained 모델이라는 점에서 APF motif 분류의 **large-scale 실전 검증 substrate**. (ii) 20-50 layer × 16 head 의 각 (layer, head) attention pattern 을 저장 → APF motif classifier 로 자동 분류하면 "어느 layer 에서 어떤 motif 가 얼마나 자주" 라는 depth × motif 분포를 뽑을 수 있음.
- **인용 포인트**: APF main paper §3 (motif typology 정의 직후) 에서 "our motif taxonomy is validated on a pretrained decoder-only TSFM (Das et al. 2024, arXiv:2310.10688) by extracting attention patterns from all (layer, head) pairs and applying the taxonomy classifier — the resulting depth × motif distribution recovers the same six motif classes with X% coverage." 형태로 인용.

### B. APF PE 비교 실험 에 TimesFM 의 NoPE 관찰 이식

- **매칭**: `_profile.md` §C (PE-Attention Geometry) 직접.
- **구체 mechanism**: TimesFM v2.0 부터 `use_positional_embedding=False` 로 이동. 이는 Kazemnejad NeurIPS 2023 (arXiv:2305.19466; 2026-06-08 ✓) 의 NoPE 우위 관찰의 시계열 판. APF 의 PE 비교 실험 (NoPE vs sinusoidal vs learned vs RoPE vs ALiBi) 에서 TimesFM 이 실전 pretrained NoPE 모델의 케이스를 제공.
- **인용 포인트**: APF PE 비교 실험 절 (예: §5) 에서 "the pretrained TimesFM (v2.0, Das et al. 2024) drops positional embedding entirely, which is consistent with our observation that causal masking suffices for order encoding in TS transformers, extending Kazemnejad et al. (NeurIPS 2023) to the TS setting." 형태로 인용.

### C. Grokking track 의 "충분 데이터 → grokking-free regime" 사례

- **매칭**: `_profile.md` §A (Grokking / Delayed Generalization) + Grokking track 의 non-stationarity axis.
- **구체 mechanism**: Liu et al. NeurIPS 2022 "Towards Understanding Grokking" (2026-05-25 ✓) 의 4-phase diagram (comprehension / grokking / memorization / confusion) 에서 comprehension phase 는 "충분 데이터 + 적절 wd + 큰 model" 일 때 나타남. TimesFM 은 이 phase 의 극단 대표 — 100B time-points 코퍼스로 학습된 200M-500M 모델은 grokking 없이 immediate generalization 로 학습이 끝났을 것으로 예상. 반대로 소량 (수백 시계열) 로 finetune 하는 시나리오에서 grokking-like delayed generalization 이 관찰될지 확인하는 게 흥미로운 실험.
- **인용 포인트**: Grokking TS Transformers paper (계획 PAPER_PLAN.md) 의 Related Work 절 (예: §2.3) 에서 "at the opposite pole, TSFMs pretrained on billion-scale corpora (TimesFM, Das et al. ICML 2024, arXiv:2310.10688) sit in the comprehension phase of the Liu-Kitouni 4-phase diagram — no grokking observed because data starvation is absent — providing a control that our small-scale grokking regime is qualitatively distinct." 형태로 인용.

### D. P1 ProTran-TFA 의 반증적 baseline

- **매칭**: `_profile.md` §D (TSFM Interp) + §E (금융 시계열 응용) 그리고 paused P1 ProTran-TFA 자산.
- **구체 mechanism**: P1 은 정확히 TimesFM v1 이 self-report 한 gap ("point forecasts only, quantile heads not calibrated") 를 채우는 방향 — ProTran (Tang · Matteson NeurIPS 2021) + TFA (tactical factor allocation 2022AEL) 결합으로 calibrated quantile forecast + factor conditioning. TimesFM v1 은 P1 의 존재 근거 (motivation baseline), TimesFM v2.5 는 P1 이 다시 고려해야 할 후속 (30M continuous quantile head → conformal wrapping 필요성).
- **인용 포인트**: P1 draft `paper_test/PAPER_DRAFT_V1.md` 의 Introduction 에서 "recent TSFM (TimesFM v1, Das et al. ICML 2024, arXiv:2310.10688) explicitly reports 'quantile heads are not calibrated after pretraining' — this calibration gap is the direct target of our probabilistic ProTran-TFA extension. TimesFM v2.5 introduces a 30M continuous quantile head but calibration remains post-hoc; we argue for a calibrated-during-training approach." 형태로 인용.

### E. Frequency indicator 의 shelved 자산 (RegFiLM, EOA) 재활용 힌트

- **매칭**: `_profile.md` §D + shelved RegFiLM (Regime-conditioned FiLM) 및 EOA (Economic ODE Attention).
- **구체 mechanism**: TimesFM 의 3-단계 frequency conditioning 은 seasonality prior 를 tokenize 하는 원시적 방식. RegFiLM 은 regime label 을 FiLM (Feature-wise Linear Modulation) 으로 주입 → 더 fine-grained conditioning 아이디어. EOA 는 economic time (τ) 을 conditioning 축으로 → sampling rate 를 economic activity 로 대체. 두 shelved 자산이 TimesFM 의 frequency conditioning 아이디어를 fine-grain / 이론화한 판.
- **인용 포인트**: 만약 RegFiLM/EOA 를 re-activate 하면 서론에서 "TimesFM (Das et al. ICML 2024) introduces a categorical 3-level frequency indicator (T/W/Q) — a coarse conditioning that we refine via [regime FiLM | economic time]." 로 인용.

## 충돌/경쟁 지점

### 충돌 1: APF motif intervention 실험 규모

- **충돌**: APF 는 mech interp 관점에서 causal intervention (motif 를 강제 제거/이식) 실험을 하려는데, TimesFM 200M-500M 규모는 forward pass 만으로도 GPU 시간이 큼. APF 의 실험 반경 (motif × PE × depth × head 격자) 을 TimesFM 크기에서 다 돌리기는 비용 부담.
- **수용/반박 전략**: (a) TimesFM 1.0 200M (가장 작은 체크포인트) 만 골라 sub-sample motif intervention 실험. (b) 이 결과가 APF 의 소규모 모델 (예: 4-layer × 4-head 소형 실험) 결과와 정성적으로 일치하면 APF 의 scale-invariance 주장을 강화, 불일치하면 새 실험 방향.

### 충돌 2: Univariate vs 다변량

- **충돌**: TimesFM 은 univariate. APF 의 motif typology 는 univariate self-attention 만 다루면 충분하지만, 실전 응용 (특히 P1 ProTran-TFA 의 factor-portfolio) 은 다변량 필수. TimesFM 을 P1 의 baseline 으로 쓰려면 각 factor 별 독립 univariate 예측을 aggregate 해야 함 → 상관 정보 소실.
- **수용/반박 전략**: MOIRAI (다변량 native) 를 P1 의 병렬 baseline 으로 함께 두고, TimesFM 은 "다변량 gap 대비 유용성" 관점에서 논함.

### 충돌 3: Point forecast vs 확률 예측

- **충돌**: TimesFM v1 은 point forecast. P1 은 확률 예측. 벤치마크 지표가 다름 → 직접 비교 불가.
- **수용/반박 전략**: P1 에서 TimesFM 을 **point-only baseline** 으로 두고 그 point forecast MSE 를 P1 의 point prediction (분포 median 으로) 과 비교, 그리고 P1 만의 확률 지표 (CRPS, calibration, quantile score) 를 별도 지표로 병기.

## 반면교사

TimesFM 이 못한 것들 중 내가 다뤄야 할 것.

1. **Corpus 재현 가능성**: TimesFM 은 corpus 를 공개 안 함. 나는 **모든 학습 코드 · corpus · seed 를 공개** 해야 재현 가능성 우위를 잡을 수 있다 (특히 Grokking track 은 재현이 중요).
2. **Tail-aware evaluation**: TimesFM 은 MSE/MASE 위주. P1 은 tail-aware (VaR/ES) 를 primary metric 으로 두어야 응용 utility 를 제대로 대변.
3. **Downstream leakage 검증**: TimesFM 은 pretrain corpus 와 downstream 의 겹침을 명시 안 함. 내 논문 (특히 Grokking TS) 은 **pretrain vs test 통계적 거리** 를 명시적 지표로 두어야 정직.
4. **Mechanistic interpretability**: TimesFM 은 "왜 잘 되는가" 를 mech interp 로 열지 않음 — Kalnāre 2025 (Mechanistic Interpretability for Transformer-based TS Classification) 이나 Mishra 2026 (Dissecting Chronos SAE) 같은 mech interp 후속이 필요. APF main paper 는 정확히 이 gap 을 채우는 방향.

## 결론: 이 논문의 내 연구 지도 상 좌표

- **APF** 에는 **large-scale zero-shot substrate** 로 §3 motif typology 검증 + §5 PE 비교의 실전 NoPE 케이스로 편입.
- **Grokking TS** 에는 **grokking-free regime 극단 사례** 로 §2 related work + §5 comparison table 에 편입.
- **P1 ProTran-TFA** 에는 **point-only baseline + calibration gap motivator** 로 §1 introduction + §5 baseline 에 편입.
- **RegFiLM/EOA** (shelved) 는 TimesFM 의 3-단계 frequency indicator 의 fine-grain 확장 논거로 재활용 가능.

일반론 없이 위 4개 track 에 각각 (i) 어느 절, (ii) 어떤 문장 형태, (iii) 어떤 수식 요소 (motif taxonomy · phase diagram · calibration · frequency conditioning) 을 지정.
