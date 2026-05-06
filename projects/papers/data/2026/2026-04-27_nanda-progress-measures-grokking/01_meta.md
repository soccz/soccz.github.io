# 0. 메타 & 선정 이유

## 인용 / 권위

- **인용 수**: 2026-04 시점 약 600+ (Semantic Scholar 직접 접근 차단 상태이지만 Wang et al. 2024, Merrill et al. 2023, Lyle et al. 2025, Doshi 2024 의 인용 그래프에서 must-cite 로 등장하는 빈도로 추정).
- **저자 권위**:
  - **Neel Nanda** — 본 논문 당시 Anthropic interpretability 팀 직전. 이후 DeepMind interpretability lead. 메커니즘 해석학 분야의 사실상 표준 교재인 *TransformerLens* 라이브러리·블로그 시리즈("A Comprehensive Mechanistic Interpretability Explainer & Glossary") 의 저자.
  - **Lawrence Chan** — Anthropic / UC Berkeley. ARC Evals 공동 설립. 본 논문의 ACDC 후속 연구(Conmy et al. 2023) 와 연결된 인물.
  - **Jacob Steinhardt** — UC Berkeley 조교수, ML safety / 해석학 분야의 핵심 PI. *Forecasting AI* / scaling laws / capability emergence 측 연구.
  - **Tom Lieberum** — DeepMind, 후속 논문 *Tracr* (compiled transformers) 공동저자.
- **DOI / venue**: ICLR 2023 poster. OpenReview ID: `9XFSbDPmdW`.
- **계보 위치**: Power et al. (2022, "Grokking") 이 *현상* 을 발견하고 → 본 논문이 *메커니즘* 을 닫는다. 이후 Merrill et al. (2023), Davies et al. (2023, double descent 통합), Doshi et al. (2024, multi-task grokking) 의 모든 후속 연구가 본 논문의 progress measure 또는 Fourier circuit 가설을 출발점으로 삼는다.

## 선정 이유 (오늘, 2026-04-27)

1. **버킷 적합도**: 월요일 = 코어. 본 논문은 `grokking-delayed-gen` + `mech-interp-circuits` 두 태그를 동시에 cover 하며, `causal-intervention` 와 `training-dynamics` 까지 보조 태그로 닿는다. `_coverage.md` 상 4개 태그 모두 0건이라 **가장 적자가 큰 영역의 단일 진입점**.
2. **Priority 매칭**: `_index.md` Tier 1 Grokking primary 의 두 번째 항목. 사용자의 Grokking active track 22 must-cite 중 *circuit 분석 측 척추*. (Power 2022 가 "현상 발견" 척추라면, 본 논문은 "메커니즘 설명" 척추.)
3. **Axis balance**: 최근 3주(4-19 ContiFormer = §D, 4-22 Neural-SDE-GAN = §D, 4-24 Wang Grokked Transformers = §A 응용) 에서 §A 가 한 번, §B (mech interp circuits) 는 0회. 본 논문은 §A + §B 교차점에 정확히 위치 — axis balance 회복.
4. **사용자 연구 직접 연결**:
   - **Grokking track**: P2 logistic 4-layer 실험에서 *진행도 측정* 이 핵심 미해결 문제. 본 논문의 restricted/excluded loss 와 Gini sparsity 가 직접 이식 가능.
   - **APF track**: motif 진행도 — *언제 diagonal stripe 가 형성되었나* — 를 attention pattern 의 frequency 분해로 측정하는 발상은 본 논문 §3 Fourier projection 의 attention map 버전이다. APF Section "motif causality" 실험에서 인용 1순위.
5. **재현성**: Colab 노트북 공개, p=113 modular addition 은 RTX 3090 1대로 1시간 재현 가능. P2 환경에서 sanity check 용 baseline 으로 활용 가능.

## 무엇을 노리는 해체인가

본 해체는 *논문 요약* 이 아니라:
- (a) Fourier 회로의 수식을 **유도** 한다 (논문은 사실관계만 적시함). 사용자가 "왜 cos(ω(a+b−c)) 형태가 logit 으로 자연스럽게 나오는지" 를 직접 손계산할 수 있도록.
- (b) 세 progress measure 가 *서로 다른 무엇을 재는지* 를 분리해 본다.
- (c) **사용자가 logistic map / TS Transformer 환경에 그대로 옮기지 못하는 부분** 을 명시한다 (본 논문의 가장 큰 한계는 algorithmic data 의존).
- (d) "circuit cleanup 의 지연" 가설이 TS non-stationarity 와 만났을 때 어떻게 깨질 수 있는지 의심해본다.
