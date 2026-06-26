# 01. 메타 & 선정 이유

## 인용·권위 메타

- **Semantic Scholar 인용수**: 본 환경 차단 (Semantic Scholar API/페이지 403). GitHub Star History 차트 기준 1.5k+ stars (정확치는 README 의 "Repository stars: 871" 시점 스냅샷 — 본 글 작성 시점에는 증가했을 가능성). 정확 인용수는 단정하지 않는다.
- **DOI**: NeurIPS proceedings 의 DOI 직접 부여는 없으나 OpenReview ID `vTrRq6vCQH` 가 영구 식별자. arXiv:2306.05443 이 표준 인용 식별자.
- **저자 권위 배경**:
  - **Qianqian Xie** (현 The Fin AI) — 후속작 *FinBen* (NeurIPS 2024 D&B), *No Language is an Island* (Chinese/English unified financial LLM), *Dólares or Dollars?* (스페인어-영어 이중언어 금융 LLM) 3편 연속 발표. 금융 NLP·LLM 벤치마크 라인의 핵심 1저자.
  - **Alejandro Lopez-Lira** (University of Florida, Warrington College of Business) — 금융 학계 측 공저자. *"Can ChatGPT Forecast Stock Price Movements?"* (Lopez-Lira & Tang 2023) 의 ChatGPT-as-stock-predictor 워킹 페이퍼로 금융 LLM 응용 학계 측 대표 인물. Warrington 의 finance 교수.
  - **Min Peng** (Wuhan University, 공동 1저자급 — `*` 표시) — Wuhan University 금융 NLP 그룹 책임자.
  - **Jimin Huang** (현 The Fin AI) — 후속 IJCAI 2024 FinLLM Challenge 의 organizer. The Fin AI 의 운영 주체.
- **연구실 이전 작업**: The Fin AI 그룹은 본 PIXIU 이후 *FinBen* (NeurIPS 2024 D&B Track, arXiv:2402.12659) 로 30+ 데이터셋·다국어 확장. *FinMem* (LLM trading agent) 등 본 README 안에 별도 절로 통합. 즉 PIXIU 는 **하나의 거대한 financial-LLM 프로젝트의 출발점이자 첫 publication**.

## 근거 지도 (Evidence Map)

본 환경에서 PDF/proceedings 접근이 모두 차단되었으므로, **GitHub 공식 README 의 위치**로 근거를 기록한다. 본문 PDF 의 정확한 section/table 번호는 단정하지 않고, README 절명으로 대응한다.

| 항목 | 근거 위치 (README 절명) |
|---|---|
| 핵심 claim 1 (open-source first financial LLM·instruction·benchmark) | "📢 Update (Date: 09-22-2023)" + "Key Features — Open resources" + "FinMA v0.1" |
| 핵심 claim 2 (4-task NLP + 1-task prediction 의 통합 instruction tuning) | "FIT: Financial Instruction Dataset — Modality and Prompts" 표 |
| 핵심 claim 3 (시계열 멀티모달: tweets + 가격) | "FIT — Dataset Statistics" 표의 BigData22/ACL18/CIKM18 행 (text, time series modality) |
| 핵심 claim 4 (현실 정렬: prediction task 포함이 차별점) | "Key Features — Diversity" 절 verbatim |
| 방법론 - FIT 구성 | "FIT: Financial Instruction Dataset" 절 + 9-dataset "Dataset Statistics" 표 |
| 방법론 - FinMA fine-tuning | "FinMA v0.1" 절 (LLaMA 7B/30B base, NLP-only vs full 분리) |
| 방법론 - 자동 평가 | "Evaluation — Automated Task Assessment" 절 + `eval.py` 명령 verbatim |
| 실험 - 메트릭 9종 | "Predefined task metrics" 표 (Accuracy/F1/MissingRatio/MCC/seqeval F1/Label F1/Precision/Recall/Rouge-N/Rouge-L/EmACC) |
| 실험 - baseline 명시 | "FinBen 2.0" 절 도입부 "ChatGPT, GPT-4, and BloombergGPT et al." verbatim |
| 한계 - NER 0-shot 자동평가 | "Automated Task Assessment" 절의 "for tasks such as NER, the automated evaluation is based on a specific pattern. This might fail to extract relevant information in zero-shot settings, resulting in relatively lower performance compared to previous human-annotated results." verbatim |
| 한계 - 금융 조언 면책 | "Disclaimer" 절 verbatim ("This repository and its contents are provided for academic and educational purposes only. None of the material constitutes financial, legal, or investment advice.") |

## 선정 이유 — 왜 지금 이 논문을 봐야 하는가

**오늘은 2026-06-26 (금), 원거리 버킷.** `_coverage.md` 의 원거리 태그 11개 중 **3개가 커버 0** 이었다: `llm-finance` / `rl-trading` / `causal-ml-finance`. 이 3개 중 Tier 1 venue 후보가 있는 태그를 우선 선택. PIXIU 가 **NeurIPS 2023 D&B Track** (Tier 1) 정식 publication 이라는 점이 결정적.

### `_profile.md` 와의 4-축 연결

1. **§E (금융 시계열 응용) 의 후속 작업으로 직접 매칭**. 사용자가 "P1 ProTran-TFA (2022AEL probabilistic Transformer 확장, finance venue 가능)" 을 **paused** 로 분류 (2026-05-06 active 작업 갱신). PIXIU 가 가진 FIT 의 9-dataset 구조 + FLARE 의 8-task 평가 프로토콜은, ProTran-TFA 가 IJF/QF 같은 finance venue 로 가려 할 때 "리뷰어가 즉시 비교를 요구할 standard benchmark" 의 1순위 후보. 인용·비교 둘 다 필수.

2. **§F (원거리 쏠림 방지) — `llm-finance` 태그 보강**. 0 커버 → 1 커버 로 빈 영역 채움. PIXIU 가 *FinBen* (NeurIPS 2024 D&B) 와 그 이후 *No Language is an Island* / *Dólares or Dollars?* / IJCAI 2024 FinLLM Challenge 로 이어지는 **금융 LLM 벤치마크 라인의 시작점**이라는 점이 lineage 측면에서 결정적. 1편으로 라인 전체 진입점 확보.

3. **🔴 AETHER (BTC cycle ML, 설계만, code 부재) 의 직접 사전 작업**. AETHER 의 핵심 가설은 "sentiment (Twitter/X, news) + price/microstructure → cycle phase prediction" 인데, PIXIU 가 **이미 BigData22/ACL18/CIKM18** 의 3개 stock movement prediction 데이터셋을 tweets+OHLCV 멀티모달로 정형화해 두었다. AETHER 가 단순 crypto 응용 단계로 갈 때 stock 멀티모달 substrate 의 zero-shot transfer 가 의미 있다.

4. **🟢 APF (Attention Pattern Fields, active main candidate) 와의 약한 연결**. 직접 substrate 는 아니나, "instruction tuning 으로 LLaMA 7B/30B 의 attention 분포가 어떻게 재배치되는가" 가 향후 APF 의 PE × motif × domain 3-축 분석에 자연스러운 후속 질문이 된다. 단 본 PIXIU 자체는 mech-interp 측면이 아니므로 §C 와의 직접 매칭은 약함.

### 코어/인접 버킷 안배

`_coverage.md` 의 4-rule 점검: 한 저자 한 달 내 1회 (Xie/Han/Lopez-Lira 등은 모두 본 인덱스 첫 등장), 같은 태그 2주 연속 금지 (`llm-finance` 0 커버 → 위반 없음), axis balance (원거리 §F 의 미커버 태그 우선이라 §A/§B/§C 코어 axis 와 충돌 없음), 금융 비율 (수요일 fin-ts-dl 갱신과 무관, 원거리 §F 안에서 처리). **모두 통과**.

### Source Lock 통과 후보 vs 폐기 후보

오늘 후보 검토:

- **PIXIU (Xie 2023, NeurIPS 2023 D&B)** ← **선정**
- Zhang/Zohren/Roberts "Deep RL for Trading" (JFDS 2020, arXiv:1911.10107) → 같은 그룹의 DeepLOB 가 2026-05-29 cover → "한 저자 한 달 내 1회" rule 마진 위반 위험 + Tier 3 (JFDS 도메인 venue) → **선정 폐기**
- BloombergGPT (Wu 2023, arXiv:2303.17564) → preprint only Tier 4 + 자기-비공개 모델/데이터 → **선정 폐기**
- Lopez-Lira & Tang "Can ChatGPT Forecast Stock Price Movements?" (2023) → 워킹 페이퍼 only + Tier 4 → **선정 폐기**

**최종**: PIXIU 1편 확정. Source Lock 4-gate 모두 통과 (PDF 본문은 차단되지만 저자 공식 GitHub README 가 author-authored verbatim 1차 소스로 충분).
