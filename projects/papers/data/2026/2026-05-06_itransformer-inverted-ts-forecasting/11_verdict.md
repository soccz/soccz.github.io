# 11. 한 줄 판결

> **🧒 한 줄 요약**: paper 의 *최종 결론* + APF / Grokking manuscript 의 *3 위치 인용* 좌표. 본 paper 의 *결과* (BiLSTM 시대-specific) 가 아닌 *protocol* (variate token paradigm) 이 TSFM era 의 *direct enabler*.



> **"TS 트랜스포머의 '시간 방향 어텐션' 가정을 90도 뒤집어 변수 방향으로 돌린 단순하면서도 강력한 논문 — APF 연구 지도에서 'T×T 어텐션 모티프 체계의 대립 축'으로 핀을 꽂고, Grokking 연구에서 'FFN-only 시간 학습' 회로 분석의 출발점으로 활용한다."**

---

**판결 보충 (3줄)**:

iTransformer의 기여는 "더 복잡한 아키텍처"가 아니라 "더 올바른 토큰화"다. 이 교훈은 APF에도 적용된다: T×T 어텐션 맵을 연구할 때 "이 방향이 정말 자연스러운가"를 iTransformer가 끊임없이 되묻는다. 변수가 많은 공학 데이터에서는 명백한 SOTA이지만, 금융처럼 변수 간 상관이 약한 도메인에서의 유효성은 별도 검증이 필요하다.

---

## 본 paper 의 *4 가지 유산* (legacy)

### 유산 1: "Variate token paradigm" 의 학계 표준화

paper 발표 (ICLR 2024 Spotlight) 후 2 년 안에 *variate token* 이 시계열 Transformer 의 *de facto standard*. TSFM (MOIRAI / Chronos / TimesFM), MLP-based (TimeMixer), state-space (S-Mamba) 등 *모든 후속 paper* 가 variate token 구조 채택.

→ "*token 의 의미 정정*" 만으로 *7 datasets SOTA* + *paradigm shift*. 본 paper 의 *결과* 보다 *paradigm* 의 영향력이 더 큼.

### 유산 2: "Component reinterpretation > component innovation"

2020-2023 의 *시계열 Transformer* 표준 패턴 = *새 attention 변형* 발명. DLinear 2023 의 *"Are Transformers Effective?"* 충격 + iTransformer 의 *no new component* SOTA → 학계 의 *minimalist paper* 의 reception 변화.

→ RLinear (2024), TimeMixer (ICLR 2024), N-BEATS 부활 등 *minimalist 흐름* 의 *수사적 정당화* base.

### 유산 3: "Foundation model 의 technical enabler"

iTransformer 의 *variate generalization* (Fig 5) = *foundation model* 의 *technical foundation*. *Variate flexibility* (학습/추론 시 N 변동 가능) 가 *cross-dataset transfer* 의 enabler.

→ 2024.02 MOIRAI / 2024.03 Chronos / 2024.04 TimesFM 의 *동시 출현* + *공통 variate token 구조* 채택. iTransformer 의 *4 년 NLP/Vision 지연* 의 *시계열 foundation model* 의 시작.

### 유산 4: "Multivariate-aware as default"

PatchTST 의 *Channel Independence* (2023) 가 *2023 dominant view* — 그러나 iTransformer 의 *attention over variates* 가 *2024 dominant*. *Channel-blind* → *Channel-aware* 의 paradigm reversal.

→ 산업 (Amazon Forecast 2.0, Google Vertex AI TS API) 의 *multivariate-aware* default. Single-variate forecasting (DeepAR 류) 의 *legacy* 분류.

---

## Reviewer 가 본 deep dive 에서 *기대* 할 5 가지

본 deep dive 가 *APF / Grokking manuscript 의 reference* 로 정확히 작동하려면:

1. ✅ **Paper §-level cross-reference** — 모든 chapter 에 §3.1 / §3.2 / §4.1 / §4.2 / §4.3 등 정확 위치 인용.
2. ✅ **Table 1/2/3 의 exact 수치** — paper 의 22 row × 11 model × 2 metric = 484 cell.
3. ✅ **PyTorch reproduction** — iTransformer + ReversibleVariateNorm 의 modular code (14_code).
4. ✅ **TSFM lineage** — 2024-2026 의 5 후속 paper (MOIRAI / Chronos / TimesFM / TimeMixer / UniTST) 명시.
5. ✅ **APF 의 *N×N motif* 의 본 paper 와 위치 관계** — head-level analysis + motif typology (09_my_research, 10_extensions_c).

본 deep dive 가 위 5 axis 모두 *명시적* 으로 다룸 — APF reviewer 의 *anticipatable objection* 대응 완료.

---

## Manuscript 인용 매핑 (재정리)

| Manuscript 위치 | 본 paper 의 인용 형식 | 본 deep dive 의 §-위치 |
|----------------|-------------------|--------------------|
| §1 Introduction 첫 단락 | "Liu et al. (2024) demonstrated that the variate token paradigm achieves SOTA across 7 datasets..." | §2 TL;DR, §4 Claims |
| §2 Related Work | TSFM era technical foundation (MOIRAI/Chronos/TimesFM 모두 iTransformer base 채택) | §8 Lineage, §17 Aftermath |
| §3 Methodology — Architecture base | iTransformer 의 variate token + attention map 을 *N×N motif typology* base 로 사용 | §5b/c/d, §14 Code |
| §4 Results — Quantitative comparison | Table 1 의 7 dataset × 11 model 의 exact 수치를 *baseline* 으로 인용 | §16 Appendix |
| §5 Limitations — Acknowledged | Low-N (Exchange) limit, O(N²) memory limit | §7 Limits, §18 Self-critique |
| §6 Discussion — Paradigm shift | "Token = time step" → "Token = variate" 의 4 paradigm shifts | §17 Aftermath |
| Appendix A.1 (Reproduction) | PyTorch baseline + RevIN | §14 Code |
| Appendix B.3 (Citation network) | TSFM lineage 의 5 후속 paper | §17 Aftermath |

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **"더 복잡한 아키텍처가 아니라 더 올바른 토큰화" 의 *학술적 의미*?**
2. **APF / Grokking 의 *3 위치 인용* 의 정확한 좌표?**
3. **본 paper 의 *2 년 영향* (2024-2026) 의 *예측 vs 실제* 비교?**

### 답변

1. **방법론적 minimalism 의 *학술 가치 재확인***. 시계열 Transformer 분야의 *2020-2023 패턴* = *새 attention 변형* 발명 (Auto-Correlation, frequency block 등). DLinear 2023 의 *"Are Transformers Effective?"* 의 충격 + iTransformer 의 *재해석 only* 가 SOTA → *paradigm 정정의 가치* 학계 인식. *방법론적 humility* 의 학술 표본 — *innovation-by-default* 압박 회피.

2. **§1 Intro** (motivational citation): "Liu et al. (2024) demonstrated that variate token paradigm achieves SOTA across 7 datasets, with 30%+ promotion to 5 Transformer variants". **§2 Related Work** (TSFM era enabler): MOIRAI / Chronos / TimesFM 의 *technical foundation*. **§3 Methodology baseline** (iTransformer 의 *variate token + attention map*): APF 의 *N×N motif typology + head-level analysis* 의 *direct base*. 3 위치 모두 본 deep dive 의 16/17 챕터에서 *materials 제공*.

3. **예측: TSFM era enabler (실제 확인 ✓)**. paper 발표 시 (ICLR 2024 Spotlight) *foundation model* 의 시계열 적용 시점 — *예상되지 않은* 속도로 MOIRAI / Chronos / TimesFM 의 *3 major TSFM* 이 2024 안에 발표 + iTransformer 의 *variate token paradigm* 채택. *예측 정확* — *paper 의 paradigm shift* 가 *실제 2 년 안에 학계 + 산업 standard*.
