# Chronos: Learning the Language of Time Series

**원문 제목**: Chronos: Learning the Language of Time Series  
**한국어 제목**: Chronos: 시계열의 언어를 배우다  
**저자**: Abdul Fatir Ansari, Lorenzo Stella, Caner Turkmen, Xiyuan Zhang, Pedro Mercado, Huibin Shen, Oleksandr Shchur, Syama Sundar Rangapuram, Sebastian Pineda Arango, Shubham Kapoor, Jasper Zschiegner, Danielle C. Maddix, Hao Wang, Michael W. Mahoney, Kari Torkkola, Andrew Gordon Wilson, Michael Bohlke-Schneider, Yuyang Wang  
**소속**: Amazon, UC Berkeley, New York University  
**발표처**: Transactions on Machine Learning Research (TMLR), 2024년 10월  
**arXiv ID**: 2403.07815  
**태그**: `ts-transformer-baseline` (주), `probabilistic-forecast` (부)  
**코드·모델**: 공개 — https://github.com/amazon-science/chronos-forecasting (Apache 2.0), 모델 5종 HuggingFace 배포  

---

## 한 줄 판결

> Chronos는 시계열을 이산 토큰의 언어로 치환하여 T5 언어모델로 학습하는 가장 단순한 형태의 TS 파운데이션 모델이다 — 그 단순함이 강점이자 한계이며, APF 시각에서는 "Transformer가 TS 토큰 시퀀스에서 어떤 어텐션 패턴을 형성하는가"라는 핵심 미답 질문을 남긴다.

---

## 목차

| 파일 | 섹션 |
|------|------|
| [01_meta.md](01_meta.md) | 0. 메타 & 선정 이유 |
| [02_tldr.md](02_tldr.md) | 1. 3층 TL;DR |
| [03_problem.md](03_problem.md) | 2. 문제 지형도 |
| [04_claims.md](04_claims.md) | 3. 핵심 Claim 해체 |
| [05_method_a_intuition.md](05_method_a_intuition.md) | 4a. 방법론 — 전체 흐름 |
| [05_method_b_tokenization.md](05_method_b_tokenization.md) | 4b. 방법론 — 토크나이제이션 |
| [05_method_c_architecture.md](05_method_c_architecture.md) | 4c. 방법론 — T5 아키텍처 |
| [05_method_d_data_augmentation.md](05_method_d_data_augmentation.md) | 4d. 방법론 — 데이터 증강 |
| [05_method_z_implementation.md](05_method_z_implementation.md) | 4z. 방법론 — 구현 디테일 |
| [06_experiments.md](06_experiments.md) | 5. 실험 해부 |
| [07_limits.md](07_limits.md) | 6. 가정·한계·반박 |
| [08_lineage.md](08_lineage.md) | 7. 이론적 계보 |
| [09_my_research.md](09_my_research.md) | 8. 내 연구와의 연결 |
| [10_extensions_a_questions.md](10_extensions_a_questions.md) | 9a. 사고 확장 — 자문 질문 |
| [10_extensions_b_followups.md](10_extensions_b_followups.md) | 9b. 사고 확장 — 후속 논문 |
| [10_extensions_c_ideas.md](10_extensions_c_ideas.md) | 9c. 사고 확장 — 실험 아이디어 |
| [11_verdict.md](11_verdict.md) | 10. 한 줄 판결 |
