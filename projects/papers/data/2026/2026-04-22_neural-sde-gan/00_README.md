# 00 · 표지 및 네비게이션

## 원문 제목
**Neural SDEs as Infinite-Dimensional GANs**

## 한국어 번역
무한차원 GAN으로서의 신경 확률미분방정식

## 저자 및 소속
- Patrick Kidger (University of Oxford, Mathematical Institute)
- James Foster (University of Oxford)
- Xuechen Li (University of Toronto / Stanford University)
- Harald Oberhauser (University of Oxford)
- Terry Lyons (University of Oxford, Alan Turing Institute)

## 발표처 · 연도 · arXiv ID
- **학술지/학회**: ICML 2021 (Proceedings of the 38th International Conference on Machine Learning)
- **연도**: 2021
- **arXiv ID**: arXiv:2102.03657

## 태그
- **주 태그**: `neural-sde`
- **부 태그**: `fin-ts-dl`, `neural-ode-cde`

## 코드 · 데이터 공개
- 코드: [torchsde 라이브러리](https://github.com/google-research/torchsde) 활용; 실험 코드는 논문 저자 GitHub(kidger/torchsde)에 공개
- 데이터: 주식 종가(Yahoo Finance), Ornstein-Uhlenbeck 합성 데이터 사용

## 한 줄 판결
> Neural SDE(생성자)–Neural CDE(판별자)라는 이중 구조는 Paper 4의 ODE 시간변수를 economic time으로 교체할 때 이론적 근거를 제공하나, 이 논문의 목표가 **예측이 아닌 경로 생성**임을 명확히 인식하고 인용 위치를 §3·§4의 시간-변환 논의로 한정해야 한다.

---

## 목차

| 파일 | 섹션 | 내용 |
|------|------|------|
| [01_meta.md](01_meta.md) | 0. 메타 & 선정 이유 | 저자 권위, 인용, 선정 근거 |
| [02_tldr.md](02_tldr.md) | 1. 3층 TL;DR | 초등/학부/전문가 수준 요약 |
| [03_problem.md](03_problem.md) | 2. 문제 지형도 | 기존 접근 계보 및 핵심 gap |
| [04_claims_a_claim1_2.md](04_claims_a_claim1_2.md) | 3a. 핵심 Claim 1–2 | GAN 등가성·최적 판별자 |
| [04_claims_b_claim3_4.md](04_claims_b_claim3_4.md) | 3b. 핵심 Claim 3–4 | 재현 가능·금융 적용 |
| [05_method_a_intuition.md](05_method_a_intuition.md) | 4a. 방법론 큰 그림 | 전체 파이프라인 다이어그램 지문 |
| [05_method_b_sde_generator.md](05_method_b_sde_generator.md) | 4b. SDE 생성자 | 드리프트·확산 신경망 |
| [05_method_c_cde_discriminator.md](05_method_c_cde_discriminator.md) | 4c. CDE 판별자 | Neural CDE가 최적인 이유 |
| [05_method_d_training.md](05_method_d_training.md) | 4d. 학습 프로토콜 | WGAN-GP, 경사 페널티 |
| [06_experiments.md](06_experiments.md) | 5. 실험 해부 | 데이터셋·지표·표 해석 |
| [07_limits.md](07_limits.md) | 6. 가정·한계·반박 | 암묵적 가정 및 검증 방법 |
| [08_lineage.md](08_lineage.md) | 7. 이론적 계보 | 조상·평행연구·후손 예측 |
| [09_my_research.md](09_my_research.md) | 8. 내 연구와의 연결 | Paper 1–4 구체 연결 |
| [10_extensions_a_questions.md](10_extensions_a_questions.md) | 9a. 자문 질문 5개 | |
| [10_extensions_b_followups.md](10_extensions_b_followups.md) | 9b. Follow-up 논문 3편 | |
| [10_extensions_c_ideas.md](10_extensions_c_ideas.md) | 9c. 실험 아이디어 2개 | |
| [11_verdict.md](11_verdict.md) | 10. 한 줄 판결 | |
