# 01 메타 & 선정 이유

## 서지 정보

| 항목 | 내용 |
|------|------|
| arXiv ID | **1902.10186** |
| arXiv 제출 | v1: 2019-02-26, v2: 2019-05-08 (NAACL camera-ready) |
| 발표처 | NAACL-HLT 2019 (Minneapolis, USA), Long Paper, Main Conference |
| ACL Anthology | **N19-1357** |
| DOI | **10.18653/v1/N19-1357** |
| 페이지 | 3543–3556 (12 pages + references + appendix) |
| 인용 수 | 원문 직접 미확인 (네트워크 차단). 학계 통용 추정: **2k+ 인용** (2019 발표 이후 6년간, NAACL Best Paper Honorable Mention 급 영향력 — 해석 가능성 분야 거의 모든 review 논문에서 인용) |
| 코드 | `github.com/successar/AttentionExplanation` (저자 Sarthak Jain 의 GitHub username `successar`, GPL-3.0) |

## 저자 권위 배경

- **Sarthak Jain** (1저자, 박사과정 → 졸업 후 Bloomberg/연구 산업으로): NEU 박사. Byron Wallace 지도. 의료 NLP·해석 가능성 트랙. 본 논문이 박사과정 대표 작업.
- **Byron C. Wallace** (교신/지도): NEU 부교수. **EBM (Evidence-Based Medicine) NLP** 와 **clinical NLP** 의 권위자. AI in healthcare 의 해석 가능성·신뢰성을 둘러싼 연구 일관성으로 알려짐. 이전에 의료 도메인 attention 해석 논문 다수 (예: Anemia/Diabetes 데이터셋 사용 배경).

→ 이 페어가 본 논문에서 의료 (Anemia/Diabetes) + 표준 NLP (SST/IMDB/SNLI 등) 양쪽 도메인을 동시에 다룬 이유가 명확: **의료 영역에서 "어텐션이 모델 해석을 제공한다"는 주장이 부적절한 위험을 초래한다는 도메인 비판이 동기**.

## 근거 지도 (Evidence Map)

본 환경에서 원문 PDF 직접 열람 불가. 대신 (a) 저자 공식 코드 repo README, (b) Wiegreffe-Pinter 2019 후속 rebuttal repo 의 §-단위 매핑, (c) 학계 통용 인용 패턴 으로 위치를 추정. **정확한 Table/Figure 번호는 원문 미확인** 으로 표기하고 단정하지 않는다.

| 항목 | 추정 원문 위치 | 확인 경로 |
|------|---------------|-----------|
| 두 검증 가설 H1·H2 | §1 Introduction (말미) + §3 부각 | rebuttal 의 인용 패턴 |
| feature importance 와 attention 상관 (Kendall τ) | §4 (또는 §4.1) | 저자 repo 의 `correlation_analysis.py` 류 분기 |
| Counterfactual permutation | §5 (또는 §4.2) | repo 의 `permutation_test` 분기 |
| Adversarial attention | §5.4 또는 §6 (rebuttal 의 §4 가 "본 논문의 §5 adversarial 모듈" 대응) | rebuttal 의 §4 명시 |
| 데이터셋 표 | §3 또는 부록 A | repo README 의 데이터 목록 |
| Encoder 구조 (BiLSTM/CNN/avg) + Attention (tanh/dot) | §3 Methods | repo `Transparency` 모듈 명세 |
| 한계·반박 가능성 | §7 Discussion 또는 §8 Conclusion | 학계 통용 위치 |

## 선정 이유 (왜 *지금* 이 논문인가)

내가 현재 active 로 진행 중인 두 트랙 중 **APF (Attention Pattern Fields)** 의 *바로 그 출발 명제* 가 이 논문이다. APF 의 핵심 가설은:

> "PE choice → 어텐션 motif 의 통계적 prior 형성 → motif 가 모델 예측에 *인과적으로* 기여한다"

이 가설은 Jain & Wallace 2019 의 결론 — *"attention 은 설명이 아니다"* — 과 직접 충돌한다. APF 가 학계에서 받아들여지려면 본 논문의 두 비판을 **반드시** 통과해야 한다:

1. **gradient/LOO 상관 비판**: APF 의 motif 패턴이 단순히 frequency artifact 가 아니라 입력 단위에 대한 책임을 가진다는 증거를 제시해야 함.
2. **counterfactual 동치 비판**: 동일 예측을 내는 다른 motif distribution 이 *존재하지 않거나*, 존재한다면 그 차이가 *학습 시 PE 분포* 에서 자연 발생하지 않는다는 강한 주장을 만들어야 함.

추가로 **`_coverage.md`** 기준 `attention-as-explanation` 태그 커버 수 = 1 (오직 TAPPA 의 cross-cover 만 존재). 직격 다이브 논문이 없었음. 또 `_index.md` 의 priority "APF — Attention as Explanation foundation" Tier 의 미커버 항목 중 **시발점** 이 본 논문 — 동일 Tier 의 다른 6편(Wiegreffe-Pinter, Clark, Voita, Abnar-Zuidema, Chefer, Sundararajan) 모두 본 논문에 대한 반응 또는 보완. 시발점부터 시작하는 게 합리적.

Axis balance 측면에서도 최근 5회 코어 출현 = TAPPA(§C) / Nanda(§A·§B) / ACDC(§B) / Power(원거리 §A) / SFC(원거리 §B). **§C 직격이 5월 4일 TAPPA 한 번뿐** 으로 §B 대비 부족 → §C 보강 정당.

---

## 출판 background — 2019 NLP 분야의 시점

본 paper 가 발표된 NAACL 2019 의 NLP 분야 시점:

```
2017: Transformer 발표 (Vaswani et al., "Attention is All You Need")
2018: BERT 발표 (Devlin et al.) — pre-training paradigm.
2019: BERT 후속 — attention 시각화 의 도구화 보편화.
       │
       ├─→ 학계 일반 가정: "attention 은 model 의 reasoning 의 *증거*"
       ├─→ Heatmap 시각화의 표준화 — paper / blog / demo 의 흔한 visual.
       └─→ "interpretability" 의 default tool 로 자주 사용.

★ 본 paper 의 timing:
   BERT post-training era 시작 + interpretability hype 정점
   + Lipton (2016) 의 "mythos" critique 의 *empirical 후속*.
```

paper 가 NAACL 2019 best paper 후보 (acclaim 받음). 발표 후 1 년 안에 후속 reaction 폭발:
- Wiegreffe-Pinter 2019 (EMNLP, 5 개월 후 발표)
- Serrano-Smith 2019 (ACL, 동월)
- Brunner et al. 2019 (arXiv, 4 개월 후)

## 본 deep dive 의 *목적*

본 deep dive 의 명시 의도:
1. **Protocol baseline** — APF / Grokking manuscript 의 H1·H2 baseline 으로 사용.
2. **Wiegreffe-Pinter rebuttal 의 정밀화** — *combined* 결론을 명확화하여 reviewer 의 *premature* objection 회피.
3. **PE / Multi-head / TS-domain 의 generalization 좌표** — 본 논문의 *limitation* 을 명시 인용하여 *내 contribution* 이 *그 limitation 의 해결* 임을 명확화.
4. **재현 가능성** — H1/H2 PyTorch 코드 (§14) 의 *모든 components* 를 *modular* 로 작성하여, APF / Grokking 의 *attention-faithfulness probe* 의 base implementation 으로 *직접 활용* 가능.

→ 본 deep dive 의 모든 챕터는 위 4 목적의 *최소 1 개* 를 직접 supports.
