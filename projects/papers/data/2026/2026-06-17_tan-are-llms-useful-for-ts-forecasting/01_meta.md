# 01. 메타 & 선정 이유

## 인용 / 권위 / 식별자

- **인용 수**: Semantic Scholar 본 환경 차단으로 직접 미확인. 검색 인덱스(2026-06-17 기준 페이지 캐시 노출)에서 "highly cited paper / NeurIPS 2024 Spotlight" 라는 시그널은 보였지만 본 해체는 인용 수를 단정하지 않는다. **단정 가능한 사실은**: NeurIPS 2024 **Spotlight** 선정 — 약 top-2% 비율 채택률에 들어간 논문이라는 venue 신호 자체가 권위.
- **DOI / canonical**: arXiv:2406.16964 · OpenReview `DV15UbHCY1` · NeurIPS 2024 paper hash `6ed5bf446f59e2c6646d23058c86424b` · ACM DL DOI `10.5555/3737916.3739838`. 5개 모두 동일 논문을 가리키는 canonical identifier.
- **저자 권위 배경**:
  - **Thomas Hartvigsen** (UVA, last author) — TSALM-aware ML interpretability·robustness·healthcare ML 트랙. ICML / NeurIPS / EMNLP 다수 publication. 본 논문의 corresponding author 로 보임 (NeurIPS 2024 acm DL 페이지 first / last 표기 기준).
  - **Tim Althoff** (UW, senior author) — 행동 시계열 + 대규모 모바일/웰니스 데이터셋(Behavioral Time Series, sleep/exercise)·HCI/ML 교차. ACL / WWW / NeurIPS 다수.
  - **Mike A. Merrill** (UW) — Althoff 그룹의 박사 / 박사후. 행동 TS · LLM-for-health(예: `Behavioral · LLM4TS` 평가 vignette) 작업의 핵심 저자.
  - **Mingtian Tan** (UVA, first author) — Hartvigsen 그룹.
  - **Vinayak Gupta** (UVA) — point process / temporal modeling 백그라운드.
- **저자 페이지 신호**: 본 페이퍼는 GitHub `BennyTMT/LLMsForTimeSeries` 가 1차 코드 출처. README 의 BibTeX 가 `tan2024language` (last author Hartvigsen) 로 단정 — Source Lock 메타와 일치.

## 근거 지도 (Evidence Map)

본 환경에서 PDF 본문 직접 열람은 차단되었으므로, 작성 가능한 모든 단정의 출처를 미리 정리한다. 본 deconstruction 은 아래 4-위치의 근거 안에서만 단정한다.

| 단정 종류 | 1차 출처 |
|---|---|
| 핵심 claim · 3-ablation 정의 | WebSearch verbatim 인덱스 (NeurIPS 2024 / arXiv 2406.16964) + GitHub 루트 README "Three ablations: w/o LLM, LLM2Attn, LLM2Trsf" |
| 3-base 모델 식별 (OFA / Time-LLM / CALF, 그리고 LLaTA cross) | GitHub `/OFA`, `/Time-LLM-exp`, `/CALF` 디렉토리 trees + README |
| 데이터셋 7종 | GitHub README 의 "ETTh1/h2, ETTm1/m2, Weather, Traffic, Illness" verbatim |
| PAttn 아키텍처 | GitHub `PAttn/models/PAttn.py` 코드 + `PAttn/main.py` argparse 디폴트 |
| 학습 시간 28.2x / 2.3x / 1.2x | WebSearch verbatim 인덱스 ("Time-LLM 28.2, OFA 2.3, LLaTA 1.2 times longer than modified models") |
| Limitation / 정확한 표 수치 / Appendix 보조 | **미확인** — 본 해체에서 단정하지 않음 |

## 선정 이유 — 왜 이 논문을 지금 (`_profile.md` 연결)

**짧게**: 사용자의 두 active track(APF, Grokking) 의 공통 전제 — "TS Transformer 가 실제로 학습하는 신호 (혹은 안 하는 신호) 가 따로 있다" — 의 가장 강력한 반대 증거이자 동시에 가장 강력한 응원군이기 때문이다.

1. **APF (Attention Pattern Fields) 와의 연결 (§C: Attention as Explanation)**
   - APF 의 가설: "PE 가 다르면 attention motif 가 다르고, motif 의 종류가 forecast 의 inductive bias 를 결정한다." 즉 *어텐션 한 층의 패턴* 자체가 의미를 가진다는 주장.
   - Tan 2024 의 발견: **"LLM 백본 전체를 단일 무작위 초기화 multi-head attention 한 층으로 교체해도 성능이 같거나 더 좋다 (LLM2Attn)."**
   - 이 결과는 APF 가설을 **위협** 하는 동시에 **강화** 한다.
     - 위협: "LLM 사전학습이 의미 있는 attention 패턴을 형성할 것" 이라는 일반적 가정이 무너진다 → motif 가 의미 있다는 주장도 회의적 시선에 노출된다.
     - 강화: 단일 attention 층조차도 충분히 잘하므로, "어텐션 motif 한 종류가 어떤 시계열 신호를 잡는다" 는 명제는 더 검증 가능해진다 (LLM 차원의 노이즈가 없으므로 motif → 성능 매핑이 더 깨끗해진다).
   - APF 의 **PAttn-style 미니 베이스라인** 활용 가능성: 단일 layer attention + patch + projection 의 단순 baseline 위에서 motif sweep 을 돌리면 LLM noise 가 제거된 깨끗한 실험.

2. **Grokking in TS Transformers 와의 연결 (§D: TS Transformers / TSFM Interp)**
   - Grokking 가설: "TS Transformer 는 충분한 training + non-stationarity 조건에서 delayed generalization 을 보일 수 있다."
   - Tan 2024 의 발견: **"OFA / Time-LLM / CALF 는 사전학습된 LLM 가중치가 아니라 fine-tune 단계의 단순 패턴학습으로 잘하는 것이다."** → grokking 가능성이 있는 *진짜 학습 영역* 은 LLM 백본이 아니라 입력/출력 패치 projection 과 어텐션 한 층임.
   - Grokking 의 must-cite 22편 중 "TS 도메인에서 grokking 의 *주체* 가 누구인가" 를 정하는 데 결정적 베이스라인 — 만약 grokking 이 TS 에서 나타난다면, 그것은 Tan 2024 가 식별한 **PAttn 핵심 회로** (patch + 1-layer attention + projection) 에서 나타날 것.

3. **금융 응용 (§E) 과의 연결**
   - Tan 2024 의 데이터셋에 ETT (Electricity Transformer Temperature) 가 포함되는데, ETT 는 비정상성·다중 주기성을 가진 산업 TS 의 대표. 금융 (변동성·리짐 시프트) 와 직접 비교 가능한 통계 구조.
   - 사용자의 paused track P1 ProTran-TFA (probabilistic forecast for finance) 에 대한 함의: **"LLM-for-finance" 라는 마케팅을 따라가지 말고 작은 PAttn / patched transformer baseline 위에서 quantile head 만 갈아끼우는 것이 더 valid 한 전략** 이라는 메시지.

4. **금주 (수요일 인접) 의 선정 기준 충족**
   - `_coverage.md` 에서 `non-stationarity-ts` 가 3 cover (2026-06-03 MOIRAI 마지막) 로 인접 버킷 내 뒤처짐 → 본 논문이 메인 태그로 채움.
   - Priority list "TS Transformer baselines (수요일 인접)" 에 미커버 항목으로 명시 (Tan et al. NeurIPS 2024) — **Priority 매칭 ✓**.
   - **Tier 1 venue** (NeurIPS 2024 Spotlight) — Source Lock 통과 후 그 venue 가산.
   - 금융 연결성: ETT (industrial sensor TS) 가 포함되어 금융 시계열 backbone 평가에 그대로 전이 가능. 직접적 fin-ts-dl tag 는 아니지만, "월 1회 금융 연결성 유지" 룰의 정신은 ETT/Weather/Traffic 같은 비정상 산업 TS 까지 포함.

5. **반-쏠림 의도**
   - 본 큐레이션이 그동안 *positive* 시각(MOIRAI / Chronos / VisionTS / iTransformer / TimesNet) 으로 TSFM 을 다뤘다 — 5개 중 5개가 "이게 잘 된다" 시각.
   - Tan 2024 는 **유일한 강한 skeptic** voice. 인접 버킷의 인지적 균형을 잡는 데 필수.

### 한 줄 요약 — 선정 이유

> **"LLM-for-TS 라는 hype 를 정면으로 ablation 한 NeurIPS Spotlight 으로, APF·Grokking 양 트랙의 '시계열 트랜스포머가 실제로 학습하는 신호는 어디에서 나오는가' 라는 메타 질문에 대한 기준선 답을 제공."**
