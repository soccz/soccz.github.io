# 5. 실험 해부

## 배경 사다리

이 절을 이해하려면 ① ACDC 의 평가가 *알고리즘이 뽑은 회로* 와 *사전 알려진 ground-truth 회로* 의 일치도라는 점, ② "edge-level ROC AUC" 는 모든 가능한 edge 를 1/0 의 binary label 로 두고 ACDC 의 점수 (또는 τ-threshold 순위) 가 그 binary label 을 얼마나 잘 맞추는가의 척도라는 점, ③ baseline 인 SP/HISP 가 ACDC 와 *완전히 다른 메커니즘* (학습 mask vs 개입) 으로 같은 비교에 놓인다는 점, 이 셋만 알면 된다.

## 데이터셋 (= task) 별 해부

저자 GitHub `acdc/<task>/utils.py` 의 직접 검증 결과를 정리.

### (1) IOI — Indirect Object Identification

- **데이터**: GPT-2 small 의 prompt template "{name_A} and {name_B} ... {name_B} gave the {object} to ___". 정답 = name_A (indirect object). 약 1,000 example. corrupted dataset (`abc_dataset`) = 3 이름이 모두 random 으로 swap.
- **왜 이 데이터가 적합한가**: 정답 회로 (Wang 2023) 가 26 head 4 class 로 잘 정리된 *gold standard*. ACDC 가 이 회로를 재발견하는지가 직접 검증.
- **숨은 편향**: prompt template 의 강한 정형성. 이름은 영문권 first name 위주 (Mary, John, Tom). 한국어·동음어 token 등은 평가 밖. 실제 LLM 사용 분포 representativeness 약함.
- **메트릭**: logit-diff (name_A − name_B) 가 task-natural. KL 도 옵션. ACDC 의 IOI ROC 결과는 *정확한 수치 원문 본문 미열람* 이지만 cross-source 표에선 logit-diff 기준 high AUC, KL 기준 다소 낮은 AUC.

### (2) Greater-Than

- **데이터**: GPT-2 small. "The {noun} lasted from the year {year_start} to ___". noun 은 약 100 개 (war, conspiracy, ...). year_start 는 1100–1799. 정답 = year_start + 1 의 century 두 자리 ≥ year_start 의 last two digits.
- **왜 이 데이터가 적합한가**: Hanna 2023 가 회로를 발견함. 수치 추론 + 연도 형식의 토큰 매핑이라는 *두 기능* 회로의 조합이 ACDC 의 *복합 회로 분리* 능력을 시험.
- **숨은 편향**: 연도 century 범위 (11–17) 가 좁음. 18 이상은 GPT-2 의 출력 분포가 변동성 증가. 또 noun list 는 GPT-2 가 *익숙한* 단어 위주 — 일반화 평가에 적합하지 않음.
- **메트릭**: probability mass on year suffixes > start year, minus probability on ≤ start (Greater-Than 메트릭). 또는 KL.
- **결과 (cross-source)**: ACDC 가 32,000 edges 중 **68 edges** 만 남기며 **5/5 component type** 재발견. 이게 ACDC abstract 의 대표 결과.

### (3) Docstring

- **데이터**: 절차적으로 생성된 Python docstring. "3 matching args, 2 definition prefix args, 1 suffix arg, 0 doc prefix args" 형식의 prompt. 정답 = next argument name.
- **왜 이 데이터가 적합한가**: induction 의 *프로그래밍 도메인 응용*. Heimersheim 2023 의 docstring 회로가 ground-truth.
- **숨은 편향**: synthetic — 실제 Python 코드 분포와 다름. argument 이름은 단일 토큰으로 강제.
- **메트릭**: KL (전체 분포) / Docstring Metric (정답 logit − max 오답 logit) / NLL 등.
- **결과 (cross-source)**: KL + edge-level ROC **AUC = 0.982** (가장 높은 결과 중 하나).

### (4) tracr-reverse

- **데이터**: 컴파일된 RASP 프로그램이 만든 transformer. task = sequence reversal `[BOS, 1, 2, 3]` → `[BOS, 3, 2, 1]`.
- **왜 이 데이터가 적합한가**: RASP 컴파일은 *진짜 ground-truth* — 회로의 정확한 18 edge 가 컴파일러 출력에서 직접 나옴. mech interp 자동화 도구의 *sanity check*.
- **숨은 편향**: RASP 모델은 *기능별 모듈성이 극단적으로 보장* 됨. 자연 학습된 transformer 와는 회로 구조가 크게 다름 — ACDC 가 RASP 에서 1.000 나와도 *학습된 모델* 에서 일반화 보장은 약함.
- **메트릭**: L2 (one-hot output vs predicted output).
- **결과**: zero-ablation **AUC = 1.000** (완벽 재발견).

### (5) tracr-xproportion

- **데이터**: 같은 RASP 계열. task = vocab `{w, x, y, z}` 의 sequence 에서 누적 fraction of x.
- **왜 이 데이터가 적합한가**: tracr-reverse 와 달리 *집계* 회로 — single attention head + MLP 의 14 edge 짜리 더 단순한 ground-truth.
- **메트릭**: KL (proportional output 이 분포 형태라 KL 가능).
- **결과**: zero-ablation **AUC = 1.000**.

### (6) Induction

- **데이터**: Redwood 의 2-layer attention-only 모델. task = repeated bigram `[..., a, b, ..., a, ?]` 에서 두 번째 b 예측.
- **왜 이 데이터가 적합한가**: Olsson 2022 의 induction head circuit 이 mech interp 의 *원형*. 2-layer 모델은 회로가 *Previous Token Head + Induction Head* 의 작은 회로.
- **숨은 편향**: 모델이 toy. 더 큰 모델 (GPT-2 small+ 12-layer) 의 induction 일반화는 별도.
- **메트릭**: 마스크 위치의 NLL / KL.
- **결과 (cross-source)**: 정성적으로 induction head 재발견. 정확한 AUC 는 원문 본문 미열람.

## 베이스라인 공정성

### Subnetwork Probing (SP)

각 head/MLP 에 *학습 가능한 mask* 를 붙이고, sparsity penalty + task metric 으로 mask 를 SGD 학습. ACDC 와 비교 가능한 *희소 부분그래프 추출* 알고리즘.

**공정성 문제**: SP 의 hyperparam (sparsity coef, learning rate, mask init, schedule) 이 다중. 같은 hyperparameter 검색 예산에서 비교했는지가 불분명. Syed et al. 2024 의 재측정 (평균 SP 0.692 vs ACDC 0.596) 은 *각자 best hyperparam* 으로 비교 — 이 자체가 ACDC 에 약간 불리 (단일 τ vs 다중 hyperparam grid search).

### Head Importance Score for Pruning (HISP)

각 head 의 *gradient × activation* 으로 score. score 순으로 prune. SP / ACDC 보다 단순.

**공정성 문제**: HISP 는 *head 단위* 만 — edge 단위가 아니라 비교가 *동일 입도* 가 아님. ACDC 의 edge 출력을 head 단위로 집계해 비교한 것으로 보임. 원문 본문 미열람으로 정확한 집계 방식 미확정.

## 주요 표·그림 해석 (cross-source 기반)

원문 본문 미열람으로 정확한 표·그림 번호 인용 불가. cross-source 에서 합치된 주요 패턴:

### 패턴 1: tracr 두 task 에서 ACDC 의 dominance

zero-ablation 으로 AUC 1.000. SP, HISP 가 같은 수준에 도달하지 못함. *컴파일된 회로* 가 있으면 ACDC 의 *개입 검증* 이 정확히 옳은 답을 준다는 증거.

### 패턴 2: Docstring 에서 ACDC + KL 의 강세

AUC 0.982. SP 가 *학습 잡음* 으로 못 따라옴. KL 이 docstring 의 *전체 토큰 분포* 모양 변화를 더 잘 잡는 task.

### 패턴 3: 평균 AUC 에서 SP 가 약간 우위

Syed et al. 2024 BlackboxNLP 의 재측정: 6 task 평균 SP 0.692 vs ACDC 0.596. ACDC 가 tracr 에선 완벽이지만 *자연 task* (IOI / Greater-Than) 에선 SP 의 학습 mask 가 더 fine-grained 한 선별.

### 패턴 4: 단일 task 내 메트릭 변경의 큰 영향

같은 ACDC 라도 metric 을 KL → logit-diff 로 바꾸면 AUC 가 0.05–0.30 흔들림. *알고리즘이 강하다* 보다 *task-natural metric 의 선택이 강하다* 가 더 정확한 진단.

## Ablation (저자가 일부러 넣은 것 vs 숨긴 것)

### 명시된 ablation
- zero ablation vs random ablation 비교 — random 이 일반적으로 더 sound.
- 다른 metric (KL / LD / NLL) 비교.
- τ sweep 으로 Pareto frontier.

### 보이지 않은 (논문이 명시했는지 미확정) ablation
- *순회 순서의 중요성*: 역위상정렬 vs 무작위 순서 vs 정위상정렬 의 비교. 역위상이 옳다는 직관은 있지만 정량 비교가 본문에 있는지는 원문 본문 미열람.
- *Edge type 별 분해*: head→head edge vs head→MLP edge vs MLP→head edge 의 prune ratio 차이.
- *모델 크기 별 scaling*: GPT-2 small 외 다른 크기에서 ACDC 의 cost-quality.

## 부록에 숨은 신호 (추정)

원문 본문 미열람으로 부록 내용 직접 확인 불가. 일반적 mech interp 논문의 부록 패턴 기반 추정:
- 회로 시각화 (graphviz 그림) — 어떤 edge 가 ACDC 의 회로에 들어가는가의 정성적 그림.
- task 별 hyperparameter 표 — τ, ablation, metric 의 task-best 설정.
- 실패 사례 — ACDC 가 ground-truth 와 어긋난 task / 어긋난 edge 의 분석.

이 추정은 *해체* 가 아니라 *추정* 임을 명시한다. 부록 본문은 확인 불가.

## 수치 투명성 요약

| 항목 | 출처 | 수치 |
|---|---|---|
| Greater-Than 회로 크기 | abstract (cross-source) | 68 / 32,000 edges |
| Greater-Than 컴포넌트 재발견율 | abstract (cross-source) | 5 / 5 component types |
| Docstring KL edge-level ROC AUC | Syed et al. 2024 표 (cross-source) | 0.982 |
| tracr-reverse zero-ablation AUC | cross-source | 1.000 |
| tracr-xproportion zero-ablation AUC | cross-source | 1.000 |
| 6 task 평균 ACDC AUC | Syed et al. 2024 (cross-source) | ≈ 0.596 |
| 6 task 평균 SP AUC | Syed et al. 2024 (cross-source) | ≈ 0.692 |
| IOI AUC | 원문 본문 미열람 | 미보고 (정확 수치 확인 불가) |
| Induction AUC | 원문 본문 미열람 | 미보고 (정확 수치 확인 불가) |
| τ 기본값 (induction 데모) | 저자 코드 `--threshold 0.71` | 0.71 (KL nat 기준) |

본 해체는 표의 *cross-source* 수치에 대해 정확성을 보장하지 않는다. 원문 부록의 정확한 수치는 원문 본문 미열람으로 미확정.
