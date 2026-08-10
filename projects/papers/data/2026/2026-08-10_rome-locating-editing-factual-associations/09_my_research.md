# 8. 내 연구와의 연결

> **출처 규율 (§9 봉인 준수)**: 아래에서 내 프로젝트에 대해 단정하는 사실은 두 종류뿐이다 — (i) `_profile.md`·`_index.md`에 문자 그대로 적힌 것, (ii) 본 실행에서 **실제로 열어 확인한** 로컬 파일(`Attention Pattern Fields/README.md`·`PRIOR_ART.md`·`paper/PAPER.md`의 절 제목 목록, `Grokking in Time Series Transformers/README.md`). 인용 앵커는 그 파일들에서 눈으로 확인한 것만 쓰고, 확인 못 한 세부는 "미확인"으로 표기한다.

> **배경 사다리**: 두 active track은 `_profile.md` 기준 ① **APF**(PE → 2D attention motif → CNN probe → causal intervention), ② **Grokking in TS Transformers**다. ROME은 `_profile.md` **§B**의 `arXiv:2202.05262` 항목으로 등재돼 있고 `_index.md` priority **Tier 2**의 태그가 `mech-interp-circuits / causal-intervention`이다.

---

## 연결 강도 판정

**§B (mech interp) 및 APF의 causal-intervention 축과 강하게 연결된다.** 도메인은 NLP지만 훔칠 것은 도메인 지식이 아니라 **개입 프로토콜의 논증 구조**이며, 그 구조는 APF `paper/PAPER.md` **§4 "Intervention methodology"** 와 정면으로 같은 문제를 푼다. 반면 **§A (Grokking) 와는 연결이 약하다** — ROME은 학습 다이내믹스를 전혀 다루지 않는다. 강한 연결부터 쓰고 약한 곳은 약하다고 명시한다.

---

## 1. 흡수할 기법 — APF (강한 연결)

### (a) "음성 대조군으로 위치 주장을 닫는다" — Appendix I(AttnEdit) → APF §5.13

APF `paper/PAPER.md` **§5.13 "Baseline comparison: geometric masks vs attention rollout vs gradient saliency"** 는 이미 내 기하 마스크를 rollout·saliency와 비교하는데, README가 결과를 **"pooling beats geometric on 6/9 cells"** 라는 negative로 기록한다.

ROME이 쓴 수는 다르다. "우리 방법이 점수가 높다"가 아니라 **가설이 예측한 위치를 편집하면 X, 예측하지 않은 위치를 편집하면 Y** 라는 **질적 대조**로 승부했다(Appendix I). 점수 우위가 아니라 **실패 양상의 비대칭**이 증거다.

**APF에 이식할 형태:** §5.13을 "점수 비교표"에서 "**실패 양상 대조표**"로 재구성한다. ROME Figure 25의 세 프롬프트(원 프롬프트 / 재진술 / 자유 문맥)에 대응하는 TS 조건 — 원 시퀀스 / 같은 개념의 다른 인스턴스 / 다른 period — 에서 거동 차이를 표로 만든다. **pooling이 6/9 셀에서 이기더라도, pooling의 실패가 "개념 무관 전역 붕괴"이고 기하 마스크의 실패가 "해당 개념에만 국한된 붕괴"라면 그것이 국소화의 증거다.** 점수를 포기하고 구조를 얻는 수다.

### (b) $C^{-1}$ 비등방 최소간섭 → APF 마스크 설계 (§4.1)

APF §4.1 **"Mask construction (geometric templates)"** 의 마스크는 기하 템플릿으로 정의된다. ROME Eqn. 2의 $C^{-1}k_*$가 주는 교훈은 **"어디를 건드리느냐"만큼 "그 방향에 기존 정보가 얼마나 빽빽한가"가 중요하다**는 것이다.

**이식:** attention logit 행렬의 **비중심 2차 모멘트** $C_{\text{attn}} = \mathbb{E}[\ell\ell^\top]$을 사전 캐싱하고 마스크 강도를 $C_{\text{attn}}^{-1}$로 화이트닝한다. 현재의 균일 마스킹은 ROME 관점에서 FT+L의 **등방적 $L_\infty$ 제약**에 해당하는데, FT+L이 PS 48.7로 둔했던 이유가 등방성이었다면([08_lineage.md](08_lineage.md)) 같은 개선 여지가 내 마스크에도 있다.

### (c) essence-KL 항 (Eqn. 4b) → APF cross-example logit patching의 통제항

APF README가 개입 파이프라인을 **"region masking + cross-example logit patching"** 으로 기술하고 §5.5가 **"Anomaly motifs transfer across examples; seasonality motifs do not"** 를 낸다. 그런데 seasonality가 전이되지 않는 것이 (i) 그 motif가 정말 example-specific이어서인지 (ii) 패칭이 **시퀀스의 다른 속성까지 함께 옮겨버려서**인지 현재 설계로는 분리되지 않는다.

**이식:** ROME Eqn. 4b가 정확히 이 통제 장치다. TS에서 "{subject} is a"에 대응하는 것은 **관계를 지정하지 않은 범주 질의** — "이 창의 전역 통계(평균·분산·스펙트럼 피크)를 재구성하라"는 보조 헤드. 패칭 후에도 이 헤드 출력이 원본과 KL-가깝게 유지되도록 제약하면 "개념만 옮기고 신호 정체성은 보존"이 분리되고, 그 뒤에도 seasonality가 전이 실패하면 §5.5는 훨씬 강한 주장이 된다.

### (d) 해상도 자백을 먼저 하기 — Appendix B.2 → APF §6.1

ROME Appendix B.2의 "개별 층 복원은 효과가 negligible이라 10층 구간을 복원했다"는 자백은 **분석 해상도와 개입 해상도가 다르다**는 고백이며, 부록에 묻혀 있어 대부분의 인용자가 모른다.

APF §6.1은 README에 따르면 **"intervention magnitudes measure (motif geometry × CLS-readout pattern) joint quantity"** 를 이미 **본문에** 배치했다 — ROME보다 나은 선택이다. **이 강점을 유지하되 정량 보강을 추가한다:** 단일 셀 마스킹 vs $k$-셀 블록 마스킹의 효과 곡선으로 "내 개입의 실제 해상도는 몇 셀인가"를 수치로 못박는다.

---

## 2. 충돌·경쟁 지점

### (a) 정면 충돌 — "인과 개입이 곧 국소화 증거"라는 전제

APF의 논증 골격은 `_profile.md` 기준 "PE → 2D attention motif → CNN probe → **causal intervention**"이다. ROME은 같은 골격을 NLP에서 먼저 완주했고 **그 결론이 NeurIPS 2023 Spotlight(Hase et al., arXiv:2301.04213)에 의해 뒤집혔다.**

**이건 내 프레임에 대한 경고다.** "motif X를 마스킹했더니 성능이 떨어졌다"는 관찰은 "개념 Y가 motif X에 저장돼 있다"를 함의하지 않는다. ROME이 같은 추론을 했다가 반박당했다.

**수용 방식:** 반박을 피하려 하지 말고 **먼저 인용해서 선점**한다. APF §4 도입부에 — "*Causality-based localization does not by itself license a storage claim: Hase et al. (2023) show that editing succeeds at locations that causal localization does not identify. We therefore treat our intervention results as evidence about **which attention regions are load-bearing for a given readout**, not about where a concept is stored.*" 주장 범위를 **"load-bearing"** 으로 축소하면 반박이 무력화되면서 결과의 가치는 유지되고, README의 negative 목록(§5.12·§5.13)이 이미 이 겸손한 톤과 정합한다.

### (b) 경쟁 — ROME의 rank-1이 내 마스킹보다 우아하다

내 개입은 **마스킹**(지움)이고 ROME은 **삽입**(정확히 넣음)인데, 삽입이 더 강한 검정이다 — 지우면 "무너졌다"밖에 못 보지만 넣으면 **"내가 지정한 대로 바뀌었나"** 를 볼 수 있다.

**대응:** APF에 **삽입형 개입**을 추가한다. README가 §6.2를 **"TMAO injection-as-prior under-powered null (n=12, p ≈ 0.10)"** 으로 기록하는데, ROME의 교훈은 **injection을 prior가 아니라 rank-1 제약 최소제곱으로 풀라**는 것이다 — "이 motif를 정확히 만들되 나머지 attention 구조 교란은 최소"로 재정식화하면 자유도가 줄어 n=12에서도 검정력이 오를 수 있다. 즉 **falsified된 것은 TMAO라는 특정 injection 형태이지 injection 전략 자체가 아니다.**

---

## 3. 인용 포인트 (초안 문장)

**APF `paper/PAPER.md` §1.1 Related work** (절 제목 확인함) — mech interp 계보 문단에 조상으로:
> "Causal interventions on internal activations have become the standard evidence format in mechanistic interpretability, beginning with causal mediation analysis on individual hidden states (Meng et al., 2022) and extended to automated circuit search (Conmy et al., 2023) and feature-level graphs (Marks et al., 2025). We adapt this evidence format from token-level residual states to **attention-logit regions** in time-series Transformers."

**APF §4 (Intervention methodology) 도입부** — 주장 범위 축소 각주:
> "Following the caution of Hase et al. (2023), who show that successful edits occur at locations that causality-based localization does not identify (Meng et al., 2022), we frame our intervention results as claims about **load-bearing structure for a given readout**, not about storage location."

**APF §5.13** — 실패 양상 대조의 근거로:
> "Meng et al. (2022, Appendix I) establish the pattern we adopt here: an intervention at the hypothesized site produces behaviourally deep change, whereas an equally aggressive intervention at a non-hypothesized site produces only surface regurgitation. We report the analogous asymmetry across original / cross-example / period-shifted probes."

---

## 4. 반면교사 — 이 논문이 못한 것을 내가 어떻게 다룰까

| ROME이 못한 것 | 원문 근거 | 내가 할 것 |
|---|---|---|
| 두 지도의 일치를 **정량화 안 함** | §3.4 "strong correlations"만 | probe 중요도 지도와 개입 효과 지도의 **순위상관 + 최대점 거리**를 수치로 보고. 그림 겹치기 금지 |
| **$\lambda$ 민감도 없음** | Appendix E.5에 값(100)만, 스윕 없음 | 마스크 강도·영역 크기에 **반드시 스윕 곡선 제시**. 단일 설정의 성공은 보고하지 않음 |
| 반례를 **부록에 격리** | Appendix B.4 Figure 11 | negative를 본문에 유지 (README가 §5.12·§5.13·§6.2를 이미 본문 절로 배치 — 이 관행 유지) |
| **시드 반복 분산 미보고** | Table 1·4·5·6 (신뢰구간은 레코드 수 기준) | APF는 이미 **n=8~20 seeds** 설계. 이 강점을 명시적으로 대비 서술 |
| 본문–부록 **불일치 2건** 방치 | 접두사 개수(50 vs 20), $\lambda$ 표기 | 제출 전 본문 기호 ↔ 부록 하이퍼파라미터 표 **대조 체크리스트** 1회 실행 |

---

## 5. Grokking track과의 연결 (약함 — 솔직히 표기)

**연결 약함, 전이 가능성만 있음.** ROME은 **정적 pretrained 모델**만 다루며 학습 다이내믹스·상전이·delayed generalization을 전혀 건드리지 않는다. `_profile.md` §A의 핵심 문헌(Power 2022 → Nanda 2023 → Lyle 2025)과 방법론적 접점이 없다.

**단 하나의 구체적 전이 가능성:** ROME의 인과추적을 **학습 체크포인트 축**으로 확장하는 것 — "grokking 전/중/후 체크포인트 각각에서 인과추적 지도를 그려 **병목 좌표가 언제 이동·응결하는가**"를 재는 설계. Nanda 2023(2026-04-27 커버)이 progress measure를 Fourier 성분으로 정의했다면 여기서는 **AIE 지도의 집중도(entropy)를 progress measure로** 삼는 변형이 된다. ROME이 주는 건 도구뿐이고 가설은 전부 §A 문헌에서 와야 하므로 **연결은 도구 수준이지 이론 수준이 아니다.**

`_profile.md` "보유 자산"의 ⏸️ P1 ProTran-TFA, 🔴 EOA/RegFiLM/AETHER 라인과는 **연결 없음** — ROME은 확률예측·경제시간축·금융 응용 어느 쪽과도 접점이 없다. 억지 매칭을 하지 않는다.

---

## 이 절의 핵심 한 문장

> **ROME에서 가져올 것은 rank-1 수식이 아니라 "음성 대조군으로 위치 주장을 닫는 논증 구조"(Appendix I)와 "그 구조로도 국소화는 확립되지 않는다"는 반박의 존재(Hase et al. 2023)이며, 후자를 APF §4에서 먼저 인용해 주장 범위를 'storage'가 아닌 'load-bearing'으로 축소하는 것이 이번 독해의 실질 산출물이다.**
