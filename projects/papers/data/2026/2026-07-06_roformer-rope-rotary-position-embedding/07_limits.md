# 07. 가정 · 한계 · 반박

## 저자가 명시한 가정 (원문에서 대놓고 말하는 것)

1. **차원이 짝수**: 회전이 2 차원 부분공간 단위이므로 $d$ 는 짝수여야 함. 실전에서는 문제 아님 (거의 모든 트랜스포머 head dim 이 64, 128).
2. **주파수 스펙트럼 hyperparameter 고정**: $\theta_i = 10000^{-2(i-1)/d}$ 로 sinusoidal PE 유산 그대로 사용. 학습 대상 아님.
3. **회전 초기 각도 0**: $f_q(x_m, 0) = q$ (§3.2). 위치 0 은 회전 없음.
4. **위치는 정수 인덱스**: $m, n \in \mathbb{Z}_{\geq 0}$. Continuous time embedding 은 확장이 필요 (사용자 관심 영역인 economic time subordination 과 관련).

## 저자가 말 안 한 암묵적 가정 (해체가 찾아낸 것)

### 암묵 1 — Content-position 상호작용은 없다

식 (1) 은 attention score 가 $g(x_m, x_n, m-n)$ 인데, 여기서 content $x$ 와 position $m$ 은 각각 다른 인수. 실전 attention 은 content-position interaction (예: 특정 단어가 특정 위치에서 특별한 attention 패턴을 만드는 것) 이 흔한데, 이 함수형은 그 interaction 을 배제. Content-dependent PE (DAPE 2024 등) 는 이 가정을 완화.

### 암묵 2 — 회전각의 선형성

$m\theta_i$ 라는 각도는 위치의 **선형** 함수. 만약 nonlinear $g(m)\theta_i$ 였다면 회전각 가법성 $R(g(m)) R(g(n))^T = R(g(m) - g(n))$ 이 성립하지 않아 상대위치 항등식 (Claim 2) 이 무너진다. 선형성은 유도의 은밀한 기둥.

### 암묵 3 — 랜덤 벡터 가정 하 감쇠

감쇠 성질 (Claim 3) 유도는 query·key 가 랜덤 벡터라는 가정에서만 상한이 tight. 실제 학습된 트랜스포머는 query/key 가 매우 특정 방향에 집중해 있다. 이 방향이 회전 주파수 성분과 어떻게 겹치느냐에 따라 실제 감쇠 곡선이 이론 상한을 크게 벗어날 수 있다. 이는 후속 논문 (arXiv:2502.11276 "Dimension Inefficiency") 이 정면으로 지적한 지점.

### 암묵 4 — 학습 시 관찰된 최대 위치 근방에서만 stable

이론적으로는 회전각만 계산하면 임의 위치 확장 가능하지만, **학습된 query/key 는 특정 상대각도 범위에서 최적화** 되어 있다. 학습 최대 길이를 크게 넘기면 (예: 학습 512, 실운영 32k) 회전각 분포가 학습 시 안 본 영역에 들어가 성능이 급락. 이는 NTK-aware scaling, YaRN, LongRoPE 등의 존재 이유.

### 암묵 5 — Positive frequency 만 사용

$\theta_i > 0$ 이라 회전은 항상 시계 반대방향. Positive/negative frequency 를 섞으면 표현력이 넓어질 여지가 있지만 저자는 이 대칭성을 명시적으로 고려하지 않았다.

## 반박 가능한 지점

### 반박 1 — 감쇠는 시계열·코드 도메인에서 오히려 발목잡힘

- **핵심**: 저자는 감쇠 성질을 "long-range dependency 완화" 라는 이점으로 서술하나, 시계열 예측 (수주 전 뉴스 이벤트가 오늘 가격에 영향), 코드 (수백 줄 전 함수 정의), 법률 (판례의 서론과 결론 참조) 처럼 진짜 먼 토큰의 정보가 필요한 도메인에서는 오히려 성능 저하 원인.
- **검증 방법**: (i) RoPE vs NoPE vs sinusoidal 을 코드 완성 (HumanEval, MBPP) 이나 long-context QA (LongBench) 에서 비교. (ii) attention pattern probing — RoPE 를 씌운 head 가 어느 상대거리 대역에 집중하는지를 시각화. 만약 항상 근접 대역에 몰려 있다면 감쇠가 표현력 병목이라는 증거.

### 반박 2 — 512→1024 향상은 PE 덕분이 아닐 수 있음

- **핵심**: CAIL2019-SCM 에서 512→1024 로 확장 시 68.29→69.79% 라는 결과. 그런데 이 향상이 (i) RoPE 의 회전 성질 덕분인지, (ii) 단순히 더 많은 컨텍스트를 보게 되어서인지 분리 안 됨. 만약 learned absolute PE 를 강제로 1024 로 늘려 재학습한 baseline 이었다면 이 향상이 대부분 사라졌을 가능성.
- **검증 방법**: BERT-1024 (사전학습 시 max length 1024, learned absolute PE) vs RoFormer-1024 를 같은 데이터·학습량으로 비교. 만약 두 모델의 성능 차이가 여전히 RoFormer 우위라면 PE 덕분이라는 결론 강해짐. 원 논문은 이 통제 실험을 하지 않은 것으로 보임 (WebSearch 인덱스 기반, 정확한 표 세부는 본문 PDF 확인 필요).

### 반박 3 — 주파수 스펙트럼의 자의성

- **핵심**: $\theta_i = 10000^{-2(i-1)/d}$ 는 Vaswani 2017 이 임의로 선택한 값 (이유: 다양한 주기 커버). RoPE 는 이를 그대로 물려받았는데, 이 값이 왜 최적인지 이론적 근거 없음.
- **검증 방법**: (i) $\theta_i$ 를 대체 스펙트럼 (linear, log-normal, learnable) 으로 바꿔 grid search. (ii) 도메인별 (텍스트, 코드, 시계열) 최적 스펙트럼이 다른지 실험. Frontiers 2025 fixed-θ 분석 (검색으로 확인) 이 실제 이 문제를 파고들었고, character-level LM 에서 fixed θ 를 바꾸면 성능·효율이 크게 달라진다는 결과 제출.

## 재현성 평가

- **코드 공개**: ✅ ZhuiyiTechnology/roformer (Apache-2.0). Python 구현 + 사전학습 8종 중국어 체크포인트 공개. HuggingFace `junnyu/roformer_*` 로 연동. LLaMA 코드 (Meta) 는 별도 구현이지만 원리 동일.
- **데이터 공개**: 벤치마크 데이터는 모두 공개 (WMT2014, GLUE, Enwik8, CAIL2019-SCM). 사전학습 데이터는 저자가 명시했는지 원문 §4 세부 필요.
- **하이퍼파라미터 명시**: 학습 스케줄·optimizer·batch size 등 원문 §4 세부 필요. 코드 repo 의 `train.py` argparse 디폴트 값을 통해 부분적 재현 가능.
- **평균만 vs 분산**: WebSearch 인덱스에서는 seed variance / std 확인 안 됨. WMT2014 En-De 의 +0.2 BLEU 는 통계 유의성 검정 없이는 판단 어려움. 원문 §4 검증 필요.
- **후속 검증**: LLaMA, GPT-J, Mistral, Qwen, DeepSeek 등이 RoPE 를 실제 대규모로 적용해 재현성이 사실상 field-scale 로 검증됨. 즉 원 논문 실험의 seed variance 는 미보고여도 실운영 수준에서는 재현성 문제 없음.

## 한계의 종합

RoPE 는 이론적으로 우아하고 실증적으로 검증된 방법이지만:
1. **주파수 스펙트럼 최적화 부재** (Frontiers 2025, ComRoPE 등이 파고듦).
2. **Long-context extrapolation 은 별도 hack 필요** (NTK, YaRN, LongRoPE).
3. **감쇠 성질이 특정 도메인 (long-range dep) 에는 손해** (Dimension Inefficiency arXiv:2502.11276).
4. **Content-position interaction 배제** (DAPE 등이 완화).

이 네 가지는 원 논문이 남긴 미완성 지점이며, 이후 4-5 년의 RoPE 관련 문헌 폭발의 원동력이 된다.
