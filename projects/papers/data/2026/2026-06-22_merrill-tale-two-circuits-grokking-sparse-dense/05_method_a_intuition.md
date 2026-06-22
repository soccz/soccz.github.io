# 05 · 방법론 (a) — 큰 그림 & 흐름

> **배경 사다리**: ① "MLP (multi-layer perceptron, 다층 퍼셉트론)" = 입력에 행렬을 곱하고 ReLU 같은 비선형을 끼우는 가장 단순한 신경망, ② "마스킹" = 특정 뉴런의 출력을 0 으로 강제 → 그 뉴런이 없는 것처럼 만들고 나머지로 예측 비교, ③ "binary search" = 정렬된 후보 안에서 절반씩 좁혀가며 답 찾기. 이 셋을 잡으면 본 절은 풀린다.

---

## 방법 전체의 한 다이어그램 (지문)

```
   [데이터 생성]              [모델]              [학습]            [분석]
  parity(n=40,k=3)   FF1: Linear(40,1000)         SGD              4 종 측정
        │              + ReLU + Linear(1000,1)    lr=0.1           ┌──────────────┐
        │                                         wd=0.01          │ A. 뉴런 노름 │
   1000 train  ──────────►  width 1000 MLP  ────► hinge loss  ────►│ B. 글로벌 sp.│
   많은 test                                      300 epoch        │ C. circuit   │
                                                  5 seeds          │ D. faithful. │
                                                                   └──────────────┘
                                                                       │
                                                                       ▼
                                                            sparse vs dense subnetwork
                                                            의 시계열 진화
```

이 그림이 본 논문의 "한 장 요약" 이다. 데이터 (sparse parity 합성) → 모델 (단순 2-layer FFN) → 학습 (long SGD + weight decay) → 4 종 시계열 측정 (뉴런 노름 / 글로벌 sparsity / circuit 크기 / faithfulness) → 결론 (sparse 가 dense 를 인수하는 시점 = grokking phase transition).

---

## 4 단계 흐름 (각 단계의 *왜* 와 *무엇*)

### 단계 1 — Substrate 선택: 왜 sparse parity 인가

문제는 "grokking 의 회로 수준 동학" 을 보겠다는 것이다. 그러려면 **회로의 ground truth 가 존재** 해야 한다 — 학습된 회로가 진짜 의미 있는 회로인지 비교할 기준이 필요. modular addition (Power 2022, Nanda 2023) 도 후보지만 Fourier basis 의 *연속적* 회로라 sparsity 정의가 모호. **sparse parity** $y = \prod_{i \in S} x_i$ ($|S|=k \ll n$) 는 ground truth 회로가 (a) 명백히 sparse — input 의 $k$ 비트만 의존, (b) 표현 가능한 DNF 구성이 $2^k$ 또는 더 작은 변형으로 정확히 셀 수 있음, (c) 학습 도중의 dense 회로 (모든 비트의 분산 표현) 와 명확히 구분 가능.

→ **선택 이유**: sparse parity 는 "회로의 sparsity 가 정량적으로 정의되는 가장 단순한 task". 결과를 모듈러 산술이나 더 큰 task 로 일반화하는 것은 후속 작업 (Claim 5).

### 단계 2 — 모델 선택: 왜 1-hidden FFN 인가

attention / depth / normalization 같은 "방해 변수" 를 모두 제거. ReLU 1-hidden-layer FFN 의 표현력 (universal approximator) 은 sparse parity 를 표현하기에 충분 (DNF 구성으로 직접 가능). 폭 1000 은 ground-truth (6~8 뉴런) 대비 100 배 이상 — 학습이 "당첨 티켓" 을 *자연 발견* 할 여유가 있음.

→ **선택 이유**: 결과의 해석에서 "이건 attention 의 특수 효과다" 라는 출구를 봉쇄. 회로 경쟁 현상이 attention/depth 없이도 일어남을 보임으로써 *general phenomenon* 으로 격상.

### 단계 3 — 학습 setup: 왜 SGD + 작은 weight decay + hinge loss + 긴 epoch 인가

- **SGD ($\text{lr}=0.1$)**: Adam 같은 adaptive optimizer 는 노름 동학을 흐림. SGD 가 weight 의 노름 변화를 cleanly 관측 가능하게 함.
- **weight_decay = 0.01**: 노름이 자라지 않은 뉴런을 *완만히 깎아* dense subnetwork 의 background 를 만든다. 0 이면 background decay 가 없어 sparse-dense 분리 흐려짐. 너무 크면 sparse 뉴런도 죽어버림. 0.01 은 Power 2022 의 grokking 영역과 호환되는 정도.
- **hinge loss** ($\max(0, 1 - y\hat{y})$): binary classification 에서 "margin > 1" 이 되면 loss = 0 — 학습이 train set 을 외운 뒤에도 그 외운 정도가 무한히 커지지 않게 만듦. 동시에 weight decay 와 결합되면 *생산적 노름 성장* 만 보존되어 sparse 뉴런 만 살아남는 동학을 만듦. (cross-entropy 였다면 softmax saturation 이 노름 성장의 신호를 흐림.)
- **300 epoch**: grokking 의 phase transition 이 train acc 100% 이후로 한참 늦게 발생. epoch 수가 충분해야 그 시점을 관측.

→ **선택 이유**: 각 hyperparameter 는 "회로 동학의 신호를 *흐리지 않고* 관측" 하기 위한 선택. design choice 자체가 가설 (노름 동학이 phase transition 을 결정한다) 의 반영.

### 단계 4 — 측정 4 종

(a) **개별 뉴런 노름** (`--ind-norms`): hidden layer 각 뉴런의 input weight L2 노름 시계열. → Claim 3 의 dual-population 검증.

(b) **글로벌 sparsity** (`--global-sparsity`): epoch 별 활성 뉴런 비율의 시계열. → 학습이 sparse 구조로 *흘러가는* 정도를 단일 스칼라로 추적.

(c) **subnetwork 식별** (`--subnetworks`): `circuit_discovery_binary` — 노름 ranking 기준 top-$k^\star$ 뉴런만 켜고 나머지 마스킹 → 원본과 동일 예측 가능한 최소 $k^\star$ 를 binary search 로 찾음. → sparse subnetwork 의 *크기* 시계열.

(d) **faithfulness** (`--faithfulness`): masked forward 의 sign 이 full model 의 sign 과 일치하는 비율. → sparse subnetwork 가 "logit 을 인수했는가" 의 quantitative 답.

이 네 측정이 **모두 같은 epoch 좌표** 를 가리키면 — "노름이 양극화한 epoch ≈ sparsity 가 떨어진 epoch ≈ circuit 크기가 ground-truth 근처로 수렴한 epoch ≈ faithfulness 가 1 에 도달한 epoch ≈ grokking phase transition" — 회로 경쟁 가설이 multi-corroborated 된다.

---

## 핵심 한 문장

> **방법의 정수**: "최소 task + 최소 architecture + 노름 흔적이 잘 보이는 학습 setup + 4 종 시계열 측정의 일치 검증" 으로, grokking 의 phase transition 을 *학습 동학 위의 사건* 이 아닌 *회로 위의 사건* 으로 재정의한다.

다음 절부터는 이 4 단계의 수학적 구성요소를 하나씩 해부한다 — sparse parity 의 형식 정의 (b), circuit discovery 의 primitive (c), 뉴런 노름 동학의 이론적 해석 (d).
