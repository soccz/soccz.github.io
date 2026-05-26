# 00_README — MASTER: Market-Guided Stock Transformer for Stock Price Forecasting

> **🧒 한 줄 요약**: 본 deep dive 입구 — 17 + 7 chapters. MASTER = cross-sectional stock prediction 시대 의 peak.


## 논문 정보

| 항목 | 내용 |
|------|------|
| **원문 제목** | MASTER: Market-Guided Stock Transformer for Stock Price Forecasting |
| **한국어 제목** | 시장 정보 유도 주가 예측 트랜스포머 |
| **저자** | Tong Li, Zhaoyang Liu, Yanyan Shen, Xue Wang, Haokun Chen, Sen Huang |
| **소속** | Shanghai Jiao Tong University (SJTU) — Data Management Technology and AI Lab (DMTai) |
| **발표처** | AAAI 2024 (Proceedings of the AAAI Conference on Artificial Intelligence, Vol. 38, No. 1) |
| **연도** | 2024 (arXiv 제출: 2023-12-23) |
| **Canonical ID** | arXiv:2312.15235 · AAAI OJAS ID: 27767 · 페이지: 162–170 |

## Source Lock

| 항목 | 상태 |
|------|------|
| Canonical identifier | ✅ arXiv:2312.15235 + AAAI 2024 38(1):162–170 |
| Metadata match | ✅ 제목·저자·연도·venue 확인 (GitHub 공식 레포 + AAAI OJS 검색) |
| Full text access | ⚠️ **부분** — arXiv/AAAI OJS HTML·PDF 모두 403 차단됨. 공식 GitHub 레포 (SJTU-DMTai/MASTER) 내용 + 웹 검색 스니펫으로 대체. 스니펫은 원문 abstract·method 절 텍스트와 일치 확인 |
| Evidence map | ⚠️ **부분** — Table 2 (CSI300 비교), Figure 4 (β 온도 ablation), ablation (N1, N2 조합), 원문 섹션 번호 직접 확인 불가 |

**원문 URL**: https://ojs.aaai.org/index.php/AAAI/article/view/27767  
**arXiv HTML**: https://arxiv.org/html/2312.15235v1 (차단됨)  
**GitHub**: https://github.com/SJTU-DMTai/MASTER (접근 가능, 공식 코드)

## 코드·데이터 공개

- **코드**: MIT 라이선스로 공개 (SJTU-DMTai/MASTER)
- **데이터**: CSI300/CSI800 오픈소스 버전 OneDrive/MEGA/Baidu 제공
- **사전학습 모델**: 4개 체크포인트 제공 (csi300/csi800 × original/opensource)

## 태그

- **주 태그**: `fin-ts-dl`
- **보조 태그**: `ts-transformer-baseline`, `probabilistic-forecast` (ranking metric)

## 한 줄 판결

> **주가 예측에서 "어느 종목이 언제 상관되는가"를 시장 지수로 동적 필터링하는 5단계 교번 어텐션은, APF의 attention motif × 금융 도메인 버전으로 읽히며 ProTran-TFA의 feature selection 모듈에 직접 이식 가능한 설계 원리를 제공한다.**

## 목차

| 파일 | 내용 |
|------|------|
| [01_meta.md](01_meta.md) | 메타 & 선정 이유 |
| [02_tldr.md](02_tldr.md) | 3층 TL;DR |
| [03_problem.md](03_problem.md) | 문제 지형도 |
| [04_claims.md](04_claims.md) | 핵심 Claim 해체 |
| [05_method_a_intuition.md](05_method_a_intuition.md) | 방법론 — 전체 구조 |
| [05_method_b_gating.md](05_method_b_gating.md) | 방법론 — 시장 유도 게이팅 |
| [05_method_c_intra_inter.md](05_method_c_intra_inter.md) | 방법론 — 주내·주간 어텐션 |
| [05_method_d_temporal.md](05_method_d_temporal.md) | 방법론 — 시간 집계 & 예측 |
| [06_experiments.md](06_experiments.md) | 실험 해부 |
| [07_limits.md](07_limits.md) | 가정·한계·반박 |
| [08_lineage.md](08_lineage.md) | 이론적 계보 |
| [09_my_research.md](09_my_research.md) | 내 연구와의 연결 |
| [10_extensions_a_questions.md](10_extensions_a_questions.md) | 사고 확장 — 자문 질문 |
| [10_extensions_b_followups.md](10_extensions_b_followups.md) | 사고 확장 — 후속 논문 |
| [10_extensions_c_ideas.md](10_extensions_c_ideas.md) | 사고 확장 — 실험 아이디어 |
| [11_verdict.md](11_verdict.md) | 한 줄 판결 |

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **본 deep dive 의 권장 학습 path?**
2. **Cross-sectional paradigm shift 의 의의?**
3. **2년 후 quant industry adoption?**

### 답변

1. **선형 path**: 02 → 03 → 05a→d → 06 → 17. 시간 부족 시 02 + 05b/c + 06 + 11 핵심.

2. **Single-stock TS → Cross-sectional ranking**. Quant hedge fund 의 standard strategy (long-short) 와 직접 fit. Academic paradigm shift trigger.

3. **Open-source + industry moat**. MASTER 가 baseline → hedge fund 의 alternative data + proprietary features 추가 → real PnL strategy. *Symbiotic relationship*.
