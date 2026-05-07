# 09. 내 연구와의 연결 (APF 정면 충돌 + 흡수 전략)

## 연결 강도 진단

`_profile.md` 에 이미 명시: *"Concurrent work 2개 식별: arXiv:2511.21514 (Kalnāre 2025), **arXiv:2601.21709 (Yang ICLR 2026)**"*. 즉 본 논문은 사용자 APF 의 **명시된 직접 경쟁 작업**. 연결 강도 = 매우 강함 (§C 직접). 약한 연결 표기 불요.

## APF 와 TAPPA 의 매핑 (axis-by-axis)

| APF 의 단계 | TAPPA 의 대응 | 충돌/보완 |
|---|---|---|
| (a) PE 비교 (NoPE/sin/learned/RoPE/ALiBi) × motif 분포 측정 | RoPE 만 분석, low/high freq channel 분해 | **부분 충돌**: TAPPA 가 RoPE 만 다뤄 NoPE/ALiBi 비교는 APF 의 niche |
| (b) Motif → CNN probe → 분류 | q-similarity (학습 free metric) → motif 직접 환원 | **strong 충돌**: TAPPA 가 한 줄 metric 으로 CNN probe 의 분류 중 일부 (slash/sink/reaccess) 를 해결. APF 의 motif typology (diagonal/stripe/block/edge/spike/checker) 와 정확히 겹치지 않음 — APF 는 6개, TAPPA 는 3개. APF 의 stripe/block/edge/spike/checker 는 TAPPA 미커버 |
| (c) Causal intervention (motif swap) | 미언급 (필자 추정) | **APF 의 본질적 niche**: TAPPA 는 q-similarity 가 metric 일 뿐 attention map 을 직접 perturb 하는 intervention 부재 |

## 흡수할 기법 (구체)

### 흡수 1. q-similarity 를 APF 의 motif sweep 의 통제 변수로

APF 는 현재 motif sweep 을 PE × motif type 의 2축 격자로 진행 (`_profile.md`: "PE 비교 × motif 종류"). 여기에 TAPPA 의 q-similarity 를 **세 번째 축** 으로 추가:

- 합성 데이터 (logistic map, sin/periodic, regime-switching) 에서 query self-similarity 를 인위적으로 통제 (예: 입력 token sequence 의 autocorrelation 을 조절)
- 같은 PE 에서도 q-sim 통제로 motif 가 어떻게 바뀌는지 측정
- Result: motif typology 가 (PE, q-sim) 의 2D 함수임을 시각화

이것이 APF 의 framing 을 "PE 가 motif 결정" 에서 "PE × query dynamics 가 motif 결정" 로 격상시키는 직접 흡수. TAPPA 를 넘어서는 점은 **TS 도메인** + **multi-PE 비교** + **causal intervention**.

### 흡수 2. RoPE channel decomposition 을 APF 의 PE 분석에 차용

APF 의 PE 비교 단계에서 RoPE 의 frequency band 별 ablation 추가. 현재 APF 는 PE 별 비교 (RoPE vs ALiBi vs ...) 를 head-level 로 수행 추정. 거기에 RoPE channel 의 low/high freq 분리 ablation 을 추가하면 motif 별 PE channel response 의 정량 매핑 가능. TAPPA 의 Theorem 5.2 를 직접 lemma 로 인용.

### 흡수 3. q-similarity 를 grokking phase transition 의 signature 로 (cross-track)

사용자의 다른 active track (Grokking in TS Transformer) 에서 학습 중 q-similarity 의 evolution 을 추적. 가설: grokking 발생 직전 q-similarity 가 sharp transition 을 보일 수 있음 (representation collapse → structure 의 phase change 와 동기). 이건 TAPPA 의 inference-time metric 을 training-time signature 로 확장하는 것 — TAPPA 본문에 없는 새 use case.

## 충돌 / 경쟁 지점

### 충돌 1. APF 의 motif typology 우위가 TAPPA 의 통합 framing 으로 약화 위험

APF 의 6 motif typology (diagonal/stripe/block/edge/spike/checker) 가 만약 TAPPA 의 (slash, sink, reaccess) + "noise" 의 4-cell 분류로 환원 가능하다면, APF 의 typology contribution 이 약해짐. 대응:
- **APF 의 motif 가 TAPPA 의 4-cell 로 환원 안 되는 case** 를 명시 (예: stripe 는 multiple parallel slash, block 은 attention 이 chunk 단위로 cluster — TAPPA 의 q-sim 만으로 설명 안 됨)
- APF 의 motif 가 **TS 도메인 특화** (regime change → block, anomaly → spike) 임을 강조 — TAPPA 는 LLM 일반 도메인.

### 충돌 2. TAPPA 가 이미 ICLR 2026 게재라 APF 의 attention-as-explanation foundation 작업이 늦어 보일 위험

대응:
- APF 가 (i) **TS 도메인** (TAPPA 는 LLM), (ii) **multi-PE 비교** (TAPPA 는 RoPE only), (iii) **causal intervention** (TAPPA 는 metric only) 의 3 niche 점유. 이 셋을 본문에서 prominently 강조.
- TAPPA 를 lemma 로 인용 (Section 2 Related Work + Section 3 Method 의 RoPE 분석 부분). "Yang et al. 2026 introduce q-similarity for LLM. We extend this lens to time series and multi-PE comparison with causal intervention."

### 충돌 3. APF 가 `TMAO method falsified at n=12` (`_profile.md`) 로 한 method 이미 fail. TAPPA 의 q-similarity 가 더 강력한 metric 이라면 APF 의 다음 method 가 같은 fate 위험

대응:
- TMAO falsification 이 APF 의 **motif causality 실험 진행 중** 으로 이어진 것은 정상적 부정적 결과 (Lyle 2025 처럼 "negative result 의 가치"). TAPPA 의 q-similarity 는 LLM 에서 작동, **TS** 에서 작동하는지는 미증명 — 이걸 APF 의 첫 sanity check 로 삼아 TAPPA 의 metric 이 TS 에서 fail 하면 APF 의 motif typology niche 가 오히려 확대.

## 인용 포인트 (구체 문장 초안)

### Pos 1. Related Work 섹션의 첫 paragraph (Recent unifying frameworks 소절)

> "Most relevant to our work is the recent TAPPA framework (Yang et al., ICLR 2026) [arXiv:2601.21709], which proposes that LLM attention patterns can be explained by query temporal self-similarity combined with RoPE frequency-channel response. While TAPPA achieves elegant unification for three LLM motifs (re-access, sink, slash) on RoPE-based language models, it does not address (i) non-RoPE positional encodings, (ii) the time-series domain where motif typology is dominated by regime-change and anomaly patterns absent in language, or (iii) causal interventions on motif structure. Our APF framework extends Yang et al.'s lens to all three settings."

### Pos 2. Method 섹션의 PE 분석 시작부 (Section 3.1 또는 Lemma 1 인용)

> "We adopt the RoPE frequency-channel decomposition of Yang et al. (2026) [Theorem 5.2 of arXiv:2601.21709], which states that under high query self-similarity, the simultaneous-shift invariance of RoPE rotation matrices propagates attention scores along the (+1, +1) diagonal. We extend this analysis by (a) measuring query self-similarity for time-series Transformers (PatchTST, iTransformer) where token-level semantics differ from language, and (b) systematically comparing across NoPE, sinusoidal, learned, RoPE, ALiBi to test the generality of the q-similarity × PE-channel decomposition."

### Pos 3. Discussion / Limitations 섹션

> "Our motif typology contains 6 categories (diagonal, stripe, block, edge, spike, checker), of which 3 (diagonal, edge, spike) directly correspond to TAPPA's (slash, sink, partial reaccess). The remaining 3 (stripe, block, checker) are time-series-domain-specific patterns reflecting periodicity, regime structure, and frequency drift — phenomena absent in language modeling and not covered by Yang et al.'s framework."

## 반면교사

- TAPPA 가 **causal intervention 부재** 는 APF 의 step (c) 가 차별화 핵심임을 재확인. APF 의 motif swap intervention (synthetically constructed attention map 을 model 에 injection 후 output 변화 측정) 이 TAPPA 가 못한 인과성 증명을 제공.
- TAPPA 가 **NoPE/ALiBi 미다룸** → APF 의 multi-PE 비교가 ICLR 2026 이후 reviewer 가 가장 먼저 요구할 ablation 의 정확한 영역. 이건 niche 확보 신호.
- TAPPA 의 GitHub 가 **부분 공개** (KVCache 만, Pruning/Visualization 미공개) → APF 가 from day 1 full code release + reproducibility 강조하면 community impact 차별화.
- TAPPA 가 **헤드라인 수치** 만 제시 (분산·서브태스크 분해 미확인) → APF 는 분산 + 서브 motif breakdown 을 default 로.

## 핵심 한 문장

> **TAPPA 는 APF 의 attention-as-explanation 사다리 중 첫 두 칸 (PE → motif framing, motif typology 의 일부) 을 닫았으나, 시계열 도메인 + multi-PE 비교 + causal intervention 의 세 niche 가 APF 에 남아 있다 — 본 논문을 인용 lemma 로 활용하면서 APF 의 차별화 3 영역을 본문에서 prominently 강조하면 reviewer 의 첫 질문 ("how does this differ from Yang 2026?") 에 즉답 가능.**
