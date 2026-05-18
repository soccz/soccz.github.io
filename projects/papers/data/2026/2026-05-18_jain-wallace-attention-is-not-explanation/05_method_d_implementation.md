# 05-D 방법론 — 구현 디테일

> 본 절의 내용은 저자 공식 코드 repo (`github.com/successar/AttentionExplanation`) README + 모듈 구조에서 직접 확인된 정보. 수치 hyperparameter 는 원문 §3 또는 부록 A 미확인.

## 모델 아키텍처 격자

| 인코더 | 구조 | mixing 강도 |
|--------|------|------------|
| **Average** | Embedding 의 단순 평균 (또는 학습 가능한 weighted avg) — $h_i = e_i$ 그대로 | 없음 |
| **CNN** | Convolution + max-pool — $h_i$ 가 *국소* window context | 국소 (kernel size) |
| **BiLSTM** | Bidirectional LSTM — $h_i = [\overrightarrow{h_i}; \overleftarrow{h_i}]$ 가 *전체* sequence context | 전역 |

| Attention 종류 | 형태 | 학계 출처 |
|---------------|------|----------|
| **Additive (tanh)** | $\alpha_i \propto v^\top \tanh(W_h h_i + W_q q)$ | Bahdanau 2015 |
| **Scaled dot** | $\alpha_i \propto \exp(h_i^\top q / \sqrt{d})$ | Vaswani 2017 (단순화 버전) |

여기서 $q$ 는 *query* — 분류 task 에서는 모델이 학습한 *고정* query vector (또는 last hidden state). QA/SNLI 에서는 *질문* 또는 *premise* representation.

## 데이터셋

### 이진 분류 (Binary Classification)

| 데이터셋 | 도메인 | 입력 | 라벨 |
|----------|--------|------|------|
| **SST** | 영화 리뷰 감성 | 짧은 문장 (avg ~20 token) | positive / negative |
| **IMDB** | 영화 리뷰 감성 | 긴 리뷰 (avg ~300 token) | positive / negative |
| **20News (sports)** | 뉴스그룹 분류 | 중간 길이 게시물 | hockey / baseball |
| **Tweet (ADR)** | 트윗 분류 | 짧은 트윗 (avg ~25 token) | 약물 부작용 / 아님 |
| **Anemia** | EMR 의료 차트 | 긴 문서 (수백~수천 token) | 빈혈 양성 / 음성 |
| **Diabetes** | EMR 의료 차트 | 긴 문서 | 당뇨 양성 / 음성 |
| **AgNews** | 뉴스 분류 (서브셋) | 짧은 헤드라인 | 4-way 중 binary |

### QA / NLI

| 데이터셋 | 도메인 | 형태 |
|----------|--------|------|
| **SNLI** | NLI | 전제 + 가설 → entailment/contradiction/neutral |
| **CNN** | Cloze QA | 기사 + 질문 → 엔티티 빈칸 채우기 |
| **bAbI 1·2·3** | 합성 QA | 짧은 스토리 + 단일 fact 추론 |

→ 총 **12 데이터셋**, 도메인 다양 (감성, 의료, 뉴스, NLI, QA). 길이 다양 (짧은 트윗 ~ 긴 의료 차트). 라벨 분포 다양 (균형, 불균형).

## Hyperparameter 추정 (원문 미확인 — 학계 통용)

| 항목 | 추정 값 |
|------|---------|
| Embedding 차원 | 300 (보통 fastText/GloVe) |
| BiLSTM hidden | 128 또는 256 (양방향 합 256/512) |
| CNN filter 수 | 100, kernel sizes [3,5,7] |
| Attention dim | hidden 과 동일 또는 64 |
| Optimizer | Adam, lr ~$10^{-3}$ |
| Batch size | 32 또는 64 |
| Adversarial $\epsilon$ | TVD 약 0.05 (원문 미확인) |
| Adversarial 최적화 step 수 | 수십~수백 step (원문 미확인) |

## 평가 protocol

**모델 학습**: 표준 cross-entropy 로 학습. Test accuracy 가 baseline 수준 (각 데이터셋의 보고된 수준) 에 도달.

**분석 단계**:
1. Test set 의 각 instance 에 대해 forward pass → $\boldsymbol{\alpha}$, $\hat{y}$ 저장.
2. Gradient & LOO importance 계산 → Kendall τ 측정.
3. Permutation 다중 실행 → median TVD 분포.
4. Adversarial 최적화 → $(\text{JSD}, \text{TVD})$ 산점.
5. (인코더 × attention × 데이터셋) 격자 plot.

## 구현 의존성 (repo README 확인)

- PyTorch master branch (당시 stable 미배포 기능 사용)
- torchtext 0.4.0 from source
- spaCy English
- `Transparency` 라는 메인 모듈명 (repo의 dir 명)

→ Stable PyTorch release 가 아닌 master branch 의 *특정 기능* 에 의존 — 재현 시 PyTorch 버전 match 가 비-trivial. 본 논문이 2019 년 초 시점 nightly build 에 의존했다는 신호.

## 검토자가 주목할 만한 의사코드 (재구성)

```python
# H1 — Kendall correlation
for instance in test_set:
    alpha = model.get_attention(instance)
    grad = compute_input_gradient(model, instance)   # |∂ŷ/∂e_i|_1
    loo = []
    for i in range(len(instance)):
        masked = mask_token(instance, i)
        loo.append(abs(model(instance) - model(masked)))
    kendall_grad = kendalltau(rank(alpha), rank(grad))
    kendall_loo = kendalltau(rank(alpha), rank(loo))

# H2-a — Permutation
for instance in test_set:
    alpha = model.get_attention(instance)
    tvds = []
    for _ in range(N_perm):
        alpha_perm = np.random.permutation(alpha)
        y_perm = model.forward_with_attention(instance, alpha_perm)
        tvds.append(tvd(y, y_perm))
    median_tvd = np.median(tvds)

# H2-b — Adversarial
beta = nn.Parameter(torch.zeros(T))
opt = Adam([beta], lr=...)
for step in range(N_steps):
    alpha_adv = softmax(beta)
    y_adv = model.forward_with_attention(instance, alpha_adv)
    loss = -jsd(alpha, alpha_adv) + lam * relu(tvd(y, y_adv) - eps)
    opt.zero_grad(); loss.backward(); opt.step()
```

(위는 재구성 — 원문 정확한 구현 미확인.)

## 핵심 한 문장

> 12 데이터셋 × 3 인코더 × 2 attention 격자에서 동일한 H1/H2 protocol 을 적용하기 위한 표준화된 PyTorch 파이프라인. 재현은 PyTorch master 의존으로 비-trivial 하지만 분석 protocol 자체는 *모델 무관* 하게 일반화 가능한 구조.
