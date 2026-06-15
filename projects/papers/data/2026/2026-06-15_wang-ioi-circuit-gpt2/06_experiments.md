# 06 · 실험 해부

## 배경 사다리
이 절은 본 논문의 **실험 구조** 와 그 안의 숨은 신호를 해부한다. 본 환경에서 PDF 본문 표·그림의 절대 수치는 차단되어 단정 불가 — 대신 ① 데이터셋 적합성, ② 모델·평가 setup 의 통제, ③ 코드 verbatim 으로 확인 가능한 실험 구조의 의미만 다룬다. **숫자가 없는 자리는 "원문에 수치 미확인"** 으로 솔직히 둔다.

---

## 1. 데이터셋 — IOI

### 1.1 어떤 데이터인가
- **절차적 생성**, BABA × 15 + ABBA × 15 = 30 템플릿 × NAMES (~100 개) × PLACES (8 개) × OBJECTS (8 개) ~ 192,000 가능 조합 중 무작위 sampling N = 500 (회로 발견) / N = 100 (검증).
- 모든 prompt 가 (IO, S) name pair 를 명확히 가지고 logit 비교 가능.

### 1.2 이 데이터가 회로 발견에 적합한 이유
- **정답 규칙이 운영적** — "두 번 등장한 이름이 S, 한 번 등장한 이름이 IO" — 자동 라벨링 가능.
- **정답 비교가 두 토큰만** — entropy 가 아니라 LD 라는 깨끗한 1-d 메트릭.
- **회로가 작아 fit 가능** — GPT-2 small 의 12 layer × 12 head 안에서 분석 가능한 크기의 회로.

### 1.3 숨은 편향 (이미 §05b 에서 일부 다룸, 여기서는 실험 결론에의 영향)
- **NAMES 의 영미권 편향** → 다른 언어권 이름에서 같은 회로가 작동 안 할 가능성. 본 환경에서 해당 ablation 확인 불가.
- **두 문장 짜리 짧은 prompt** → 더 긴 context 에서 회로의 안정성 미증명.
- **명시적인 ABBA/BABA 표시** → 자연 코퍼스의 noisy IOI 와의 gap 미증명.

이 편향들은 결과의 **scope** 을 좁히지만 결론의 **방향** 을 무너뜨리진 않음.

---

## 2. 모델 — GPT-2 small (124M)

### 2.1 왜 GPT-2 small 인가
- 12 layer × 12 head = 144 head — path patching 의 144 × 144 격자가 계산 가능.
- 자연어 IOI 를 ~99% 정확도로 풀어 회로가 실제 존재.
- HuggingFace 공개 + Anthropic 의 selected reference model.

### 2.2 baseline 의 부재
회로 분석 논문의 특성상 비교 baseline 이 "다른 회로 발견 방법" 이 아니라 "같은 방법으로 같은 작업에서 retrieve 한 다른 회로". 즉 NAIVE (13 head) vs CIRCUIT (26 head) 의 내부 비교.

후속 연구가 베이스라인을 제공:
- **ACDC** (Conmy 2023) — IOI 회로를 자동 발견했을 때 본 논문 회로 대비 recall 측정. 본 환경에서 정확 수치 미확인, 정황으로 high agreement 추정.
- **HISP / EAP** (후속 attribution 방법들) — gradient-based 추출 대비 ablation 의 우위 정당화.

---

## 3. 주요 실험 (코드 + 정황으로 재구성)

### 3.1 실험 1 — Faithfulness 검증
- **목적**: $F(C) / F(M)$ 비율 측정.
- **코드**: `experiments.py` 또는 `completeness.py` 의 `circuit_eval(model, [])` (= 회로 내 ablation 없음).
- **메트릭**: logit difference 평균, 회로/전체 비율.
- **원문 표 (추정)**: Fig 5 또는 Table 1.
- **숫자**: 원문에 수치 미확인. 정황으로 95%+ 추정.

### 3.2 실험 2 — Completeness 검증
- **목적**: worst-case IncompletenessGap 측정.
- **코드**: `completeness.py` 의 greedy search (10 runs × 10 iter) + random search (100 subsets).
- **메트릭**: $|F(C \setminus K) - F(M \setminus K)|$.
- **원문 시각화 (추정)**: Fig 6 — gap 의 분포 또는 worst-case 사례.
- **숫자**: 원문에 수치 미확인. **단정 안 함**.

### 3.3 실험 3 — Minimality 검증
- **목적**: 각 head 단독 제거 시 LD 손실.
- **코드**: `minimality.py` 의 head-wise 평가.
- **메트릭**: $F(C) - F(C \setminus \{v\})$ for each $v \in C$.
- **원문 시각화 (추정)**: Fig 7 — head 별 막대 그래프.
- **숫자**: 원문에 수치 미확인. **단정 안 함**.

### 3.4 실험 4 — Head 기능 명명 검증
- **목적**: 각 head 가 정말 "name mover" 또는 "s2 inhibition" 등의 명명대로 작동하는지 확인.
- **코드**: `experiments.py` 의 attention pattern 시각화 + OV circuit 분석.
- **메트릭**: 정성 분석 (attention weight 의 위치 분포, $W_O W_V$ 의 vocabulary direction).
- **원문 (추정)**: Section 4 또는 Appendix C/D.
- **숫자**: 정성 그림 위주.

### 3.5 실험 5 — Adversarial examples (fragility)
- **목적**: 회로가 깨지는 prompt 찾기.
- **코드**: `advex.py` (adversarial examples generation) 의 존재 자체가 정황.
- **메트릭**: 회로가 fail 하는 prompt 의 비율 또는 패턴.
- **원문 (추정)**: Section 7 또는 Appendix E.
- **숫자**: 원문에 수치 미확인.

### 3.6 실험 6 — Head class 의 ablation 효과
- **목적**: "name mover 클래스 전체를 ablate 하면 LD 가 어떻게 무너지나" 같은 클래스 단위 분석.
- **코드**: `ioi_circuit_extraction.py` 의 CIRCUIT vs NAIVE 비교 가능.
- **메트릭**: 클래스별 contribution.
- **원문 시각화 (추정)**: Table 또는 bar chart.

---

## 4. Ablation — 저자가 일부러 넣은 것

- **NAIVE vs CIRCUIT 비교**: 13 head vs 26 head — "최소 회로보다 더 큰 회로가 정말 필요한가" 의 답을 IncompletenessGap 으로.
- **Position-specific ablation**: `RELEVANT_TOKENS` 매핑으로 head 가 "어떤 token position 에서만 작동" 을 검증. 같은 head 라도 다른 position 에서는 ablate 해도 무관.
- **ABBA vs BABA 별도 평가**: 두 prompt 패턴이 같은 회로를 쓰는지 비교.

## 5. Ablation — 숨긴 것 (혹은 후속 연구가 메운 것)

- **Mean vs zero vs resample ablation 비교**: 본 논문이 mean 을 default 로 채택한 이유의 정량 비교가 본문에 충분히 있는지 미확인. ACDC 가 후속에서 이를 명시.
- **Scale (GPT-2 medium/large/XL) 으로의 확장**: 본 논문은 small 만. medium 에서 동일 회로가 발견되는지는 다른 후속 연구의 몫.
- **다른 LM family (Pythia, OPT)** 로의 확장: 마찬가지.
- **Multi-task transfer**: IOI 회로의 head 가 다른 작업에서도 같은 기능을 하는지 — 후속 "회로 재사용" 연구의 주제.

---

## 6. 부록에 숨은 신호 (추정)

본 환경에서 appendix 직접 확인 불가. 코드와 secondary 인덱스의 정황으로:
- **Appendix B (추정)** — 데이터셋의 구체 통계 (NAMES 분포, 생성 시드 등).
- **Appendix C-D (추정)** — 각 head 의 attention pattern visualization (24 page+ 의 시각화 부록).
- **Appendix E (추정)** — Adversarial examples 와 fragility 실패 사례.
- **Appendix F-G (추정)** — Path patching 의 implementation detail, freeze 정확한 정의.

이 중 가장 중요한 신호는 **Appendix E** — fragility 의 정직한 공개가 후속 연구를 자극한 자리.

---

## 7. 수치 투명성

**원문에 수치 미확인 (단정 안 함)**:
- Faithfulness 정확 %
- IncompletenessGap worst-case 값
- Minimality drop 의 head 별 distribution
- Adversarial success rate
- ACDC 와의 정확한 recall/precision overlap

**코드 verbatim 으로 확인된 수치**:
- N = 500 (IOI 데이터셋 default)
- N = 100 (completeness/minimality 평가)
- CIRCUIT: 26 heads, 6 classes
- NAIVE: 13 heads, 6 classes (negative empty)
- BABA_TEMPLATES: 15 개
- ABBA_TEMPLATES: 15 개 (BABA swap)
- NAMES: ~102 개
- PLACES: 8 개
- OBJECTS: 8 개
- Greedy search: 10 runs × 10 iter × 5-10 samples
- Random search: 100 subsets
- Default minimality metric: logit_diff

---

## 8. 핵심 한 문장 요약

> **"실험 구조는 5 실험 (faithfulness, completeness, minimality, head 명명, adversarial) 으로 회로 정의를 검증하지만, 본 환경에서 절대 수치 확인 불가 — 정성 구조와 코드 verbatim 만 신뢰. fragility 의 정직한 공개 (`advex.py`) 가 후속 mech interp 의 출발점."**
