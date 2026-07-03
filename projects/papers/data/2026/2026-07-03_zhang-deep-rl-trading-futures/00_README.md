# 00_README — Deep Reinforcement Learning for Trading (Zhang·Zohren·Roberts 2020)

## 표지 메타

- **원문 제목**: *Deep Reinforcement Learning for Trading*
- **한국어 번역**: 트레이딩을 위한 심층 강화학습
- **저자**: Zihao Zhang · Stefan Zohren · Stephen Roberts
- **소속**: Department of Engineering Science · **Oxford-Man Institute of Quantitative Finance** · University of Oxford
- **발표처**: *The Journal of Financial Data Science* (JFDS) 2(2) pp. 25–40 · 2020년 3월
- **arXiv 프리프린트**: [arXiv:1911.10107](https://arxiv.org/abs/1911.10107) (v1 2019-11-22 submitted)
- **DOI**: [10.3905/jfds.2020.1.030](https://doi.org/10.3905/jfds.2020.1.030)
- **Semantic Scholar hash**: 4b27b8b28b0959989e144ac7273aacfe05267cf8
- **저자 사이트**: [zihao-z.com/publications/](https://zihao-z.com/publications/)
- **Oxford-Man Institute PDF page**: [oxford-man.ox.ac.uk/.../Deep-Reinforcement-Learning-for-Trading.pdf](https://www.oxford-man.ox.ac.uk/wp-content/uploads/2020/06/Deep-Reinforcement-Learning-for-Trading.pdf)

## Source Lock

**4-게이트 통과 판정**: ✅ (부분 접근)

- **Canonical identifier**: `arXiv:1911.10107` + `DOI 10.3905/jfds.2020.1.030` + `JFDS 2(2) 25-40` 3중 확인
- **Metadata match**: arXiv abs 페이지 · Semantic Scholar · ideas.repec.org · zihao-z.com publication list · Oxford-Man Institute WP page 5 mirror 에서 제목·저자·소속·연도·venue 완전 일치
- **Full text access**: ⚠️ 본 환경에서 arXiv abs/PDF · ar5iv · alphaxiv · Oxford-Man 직접 PDF · Semantic Scholar · ideas.repec · deepai · axi.lims 모두 HTTP 403 차단. **본문 PDF 직접 열람 불가.**
- **대체 검증**: WebSearch verbatim 인덱스 **6회** 로 (i) abstract 정성 · (ii) algorithm 조합 (DQN + PG + A2C) · (iii) action space ({-1,0,1} discrete + [-1,1] continuous) · (iv) LSTM 아키텍처 (2-layer, 64→32 units, Leaky-ReLU) · (v) state features (60-obs lookback of MACD+RSI) · (vi) dataset (50 futures, 25 commodities + 11 equity index + 5 fixed income + 9 FX, 2011–2019) · (vii) reward (σ_{tgt}/σ_{t-1} volatility scaling with 60-day EWMA std) · (viii) baseline (TSMOM Moskowitz·Ooi·Pedersen 2012, MACD signals, Long-only, Sign(r)) · (ix) result (DQN best, A2C 2위, TSMOM 상회, transaction cost 하에서도 흑자) · (x) metric (Sharpe, Sortino) 의 **정성 골격만** 검증
- **미확인 (본문 PDF 차단)**: Table 3·4·5 등의 **정확한 Sharpe/Sortino/annualized return 소수점 값**, per-asset-class breakdown 정확 수치, transaction cost sweep 1bp/2bp/4bp 등의 정확한 결과 좌표, hyperparameter table (learning rate/batch size/replay buffer size/target update frequency 등), Appendix 세부 표, seed 통계 σ, Figure 캡션 원문, Limitations 절 정확 문장 → **본 해체 전체에서 "본문 PDF 차단으로 단정 안 함" 처리**

## 태그

- **primary**: `rl-trading` (원거리 버킷, 이전 커버 수 0 → 첫 커버)
- **secondary**: `market-microstructure` (선물 시장 미시구조 접점), `probabilistic-forecast` (RL 정책의 stochastic 자연 → tail-aware), `non-stationarity-ts` (2011–2019 시계열 국면 전환 처리)
- **cross-connection**: `deep-hedging` (Bühler 2019, 2026-06-19 커버) 의 시장마찰 하 SGD 친화 위험지표 최적화 계보 · `deeplob-market-microstructure` (Zhang·Zohren·Roberts 2019 DeepLOB, 2026-05-29 커버) 의 **같은 저자팀 이전 작업 lineage** (LOB micro → futures macro 로 시간축·상품군 이동)

## 코드·데이터 공개 여부

**공식 저자 GitHub repo 미공개**. arXiv/JFDS 원문에서 code/data availability 문구 확인 불가 (본문 PDF 차단). 서드파티 재구현은 `cbailes/awesome-deep-trading` 등 큐레이션 리스트에서 참조되나 저자 공식 아님. 데이터는 유료 상용 futures 데이터 (Pinnacle Data Corp 등) 가정, 재현 시 라이선스 필요 추정.

## 한 줄 판결

**"Deep Hedging 이 완전시장 가정을 시장마찰 하로 끌어내렸다면, 이 논문은 signal-to-position mapping 을 discrete/continuous 정책으로 재정의해 TSMOM 계보의 hand-crafted rule 을 SGD 로 학습된 policy 로 대체한다 — 원거리 태그이지만 P1 ProTran-TFA 의 probabilistic forecast 출력을 volatility-scaled reward 로 연결해 trading policy 로 확장하는 substrate 로 직접 활용 가능."**

## 목차

- [00_README.md](00_README.md) — 표지 (본 파일)
- [01_meta.md](01_meta.md) — 메타 & 선정 이유
- [02_tldr.md](02_tldr.md) — 3층 TL;DR (초등/학부/전문가)
- [03_problem.md](03_problem.md) — 문제 지형도 (TSMOM 계보, deep RL trading 위치)
- [04_claims.md](04_claims.md) — 핵심 Claim 4개 해체
- [05_method_a_rl_framework.md](05_method_a_rl_framework.md) — RL 정식화 (state/action/reward)
- [05_method_b_algorithms.md](05_method_b_algorithms.md) — DQN + PG + A2C 3-알고리즘 비교
- [05_method_c_volatility_scaling.md](05_method_c_volatility_scaling.md) — 변동성 스케일링 리워드
- [05_method_d_architecture.md](05_method_d_architecture.md) — LSTM 백본 아키텍처
- [06_experiments.md](06_experiments.md) — 50 futures × 2011-2019 실험 해부
- [07_limits.md](07_limits.md) — 가정·한계·반박 3-계층
- [08_lineage.md](08_lineage.md) — 이론적 계보 (Moody-Wu → TSMOM → Deep Hedging → 본 논문 → Momentum Transformer)
- [09_my_research.md](09_my_research.md) — P1 ProTran-TFA · AETHER · APF motif 연결
- [10_extensions_a_questions.md](10_extensions_a_questions.md) — 자문 질문 5개
- [10_extensions_b_followups.md](10_extensions_b_followups.md) — Follow-up 논문 3편
- [10_extensions_c_ideas.md](10_extensions_c_ideas.md) — 실험 아이디어 2개
- [11_verdict.md](11_verdict.md) — 한 줄 판결 (본 파일과 동일 문장)
