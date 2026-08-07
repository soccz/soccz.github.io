# Loss of plasticity in deep continual learning

**한국어 제목**: 깊은 연속학습에서의 가소성 상실

---

## 서지

- **저자**: Shibhansh Dohare, J. Fernando Hernandez-Garcia, Qingfeng Lan, Parash Rahman, A. Rupam Mahmood, Richard S. Sutton
- **소속**: ¹Department of Computing Science, University of Alberta, Edmonton, Alberta Canada / ²Canada CIFAR AI Chair, Alberta Machine Intelligence Institute (Amii), Edmonton, Alberta Canada *(PMC 게재본 소속 표기 verbatim)*
- **게재**: *Nature* **632**(8026), 768–774 (2024)
- **canonical identifier**: **DOI:10.1038/s41586-024-07711-7**
- **프리프린트**: arXiv:2306.13812 (v1 2023-06-23 / v2 2023-08-18 / v3 2024-04-09, 제목 *"Maintaining Plasticity in Deep Continual Learning"* — 게재본과 **제목이 다름**, 본 해체는 이를 구분해 표기)

## Source Lock

| 항목 | 상태 |
|---|---|
| Canonical identifier | ✅ DOI:10.1038/s41586-024-07711-7 (+ arXiv:2306.13812) |
| Metadata match | ✅ 제목·저자 6인·연도·venue 일치 확인 (PMC 게재본 서지 + arXiv 공식 abs 페이지 버전 이력) |
| Full text access | ✅ **1차 소스 = Nature 게재본 오픈액세스 전문** (PMC11338828). Abstract / Main / Plasticity loss in supervised learning / Plasticity loss in reinforcement learning / Maintaining plasticity / Discussion / Methods 8개 하위절 / Fig. 1–4 / Extended Data Fig. 2–5 / Extended Data Table 1–5 위치 전부 확인 |
| Evidence map | ✅ `01_meta.md` 참조 |
| 미확보 구간 | Extended Data Table 1~5 의 **셀 값은 이미지로만 제공**되어 전사 불가 (캡션만 확인). Data/Code availability 문·ReDo 비교 문단 뒷부분은 PMC 렌더가 중간에서 잘림 → 해당 수치는 본 해체에서 **단정하지 않음** |

## §4-bis 3문 자기시험 (통과)

- **Q1** 초록 첫 문장 verbatim — "Artificial neural networks, deep-learning methods and the backpropagation algorithm form the foundation of modern machine learning and artificial intelligence."
- **Q2** 주 결과 exhibit 번호 + 수치 verbatim — **Fig. 1** ("In a sequence of binary classification tasks using ImageNet pictures (a), the conventional backpropagation algorithm loses plasticity at all step sizes (b), whereas the continual backpropagation, L2 regularization and Shrink and Perturb algorithms maintain plasticity, apparently indefinitely (c).") / 본문 verbatim "Although these networks learned up to 88% correct on the test set of the early tasks" / Methods verbatim "For the step size of 0.01, up to 25% of units die after 800 tasks."
- **Q3** 방법 절 + 식 번호 verbatim — Methods 하위절 **"Specifics of continual backpropagation"**, **식 (1)** `u_l[i]=η×u_l[i]+(1−η)×|h_{l,i,t}|×∑_{k=1}^{n_{l+1}}|w_{l,i,k,t}|` / Methods 하위절 "Understanding loss of plasticity", **식 (2)** `erank(Φ)=exp{H(p_1,…,p_q)}`
  *(주의: Nature 판본의 Methods 하위절은 번호가 아니라 제목으로 매겨진다. 절 번호를 창작하지 않았다.)*

## 태그

- **주 태그**: `continual-learning` (커버 1 → 2, 직전 커버 2026-05-01 Lyle 이후 **3개월 공백** — 원거리 버킷 최장 정체 태그)
- **보조 태그**: `training-dynamics` (cross), `rl-trading` 아님 — RL 실험은 있으나 금융 응용이 아니므로 cross 미부여

## 코드·데이터

저자 공식 저장소 `github.com/shibhansh/loss-of-plasticity` 존재 *(2차: 저자 GitHub — 구조·구현 세부만 사용, 본 해체의 수치 근거로 쓰지 않음)*. 게재본의 Data/Code availability 정식 문구는 PMC 렌더 절단으로 전사하지 못했다.

---

## 🔨 한 줄 판결

> **딥러닝의 "배우는 능력" 자체가 학습을 계속할수록 소모되어 얕은 망 수준으로 떨어진다는 것을 Nature 급 증거로 못 박고, 그 해법이 경사(gradient) 안쪽이 아니라 바깥쪽 — 지속적인 무작위 재초기화 — 에 있다고 선언한 논문. 내 Grokking-in-TS track 의 non-stationarity 축에서 "늦게 오는 일반화(grokking)"와 "느리게 사라지는 학습능력(plasticity loss)"을 같은 축의 양 끝으로 배치하는 좌표축 논문으로 핀을 꽂는다.**

---

## 목차

| 파일 | 내용 |
|---|---|
| [01_meta.md](01_meta.md) | 0. 메타 & 선정 이유 (근거 지도 포함) |
| [02_tldr.md](02_tldr.md) | 1. 3층 TL;DR (초등 / 학부 / 전문가) |
| [03_problem.md](03_problem.md) | 2. 문제 지형도 — 왜 "계속 배우기"가 안 되는가 |
| [04_claims_a_core.md](04_claims_a_core.md) | 3-a. Claim 1·2 (가소성은 사라진다 / 폭넓게 사라진다) |
| [04_claims_b_remedy.md](04_claims_b_remedy.md) | 3-b. Claim 3·4 (다양성 주입만이 살린다 / 경사만으론 부족) |
| [05_method_a_intuition.md](05_method_a_intuition.md) | 4-a. 방법론 큰 그림 |
| [05_method_b_utility.md](05_method_b_utility.md) | 4-b. 기여 효용 식 (1) 해부 |
| [05_method_c_algorithm.md](05_method_c_algorithm.md) | 4-c. 연속 역전파 알고리즘 |
| [05_method_d_diagnostics.md](05_method_d_diagnostics.md) | 4-d. 진단 지표 3종 (죽은 유닛 / 가중치 크기 / 유효 랭크 식 (2)) |
| [06_experiments_a_supervised.md](06_experiments_a_supervised.md) | 5-a. 지도학습 실험 해부 |
| [06_experiments_b_rl.md](06_experiments_b_rl.md) | 5-b. 강화학습 실험 해부 |
| [07_limits.md](07_limits.md) | 6. 가정·한계·반박 |
| [08_lineage.md](08_lineage.md) | 7. 이론적 계보 |
| [09_my_research.md](09_my_research.md) | 8. 내 연구와의 연결 |
| [10_extensions_a_questions.md](10_extensions_a_questions.md) | 9-a. 자문 질문 5개 |
| [10_extensions_b_followups.md](10_extensions_b_followups.md) | 9-b. Follow-up 3편 |
| [10_extensions_c_ideas.md](10_extensions_c_ideas.md) | 9-c. 실험 아이디어 2개 |
| [11_verdict.md](11_verdict.md) | 10. 한 줄 판결 |
