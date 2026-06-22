# 02 · 3층 TL;DR

> **이 절을 읽기 전 알아둘 것**: (1) "신경망" = 입력을 받아 출력을 내는 가중치들의 충돌, (2) "그록킹(grokking)" = 학습 도중 한참 동안 시험 정확도가 0 가까이 머물다가 어느 순간 갑자기 100% 로 튀는 현상, (3) "회로(circuit)" = 신경망 안에서 특정 계산을 책임지는 작은 뉴런·가중치 부분집합. 이 세 가지 개념만 잡으면 나머지는 풀어 쓸 수 있다.

---

## 🧒 초등학생 수준 (수식 없이, 비유로)

당신이 시험 공부를 한다고 해 봅시다. 처음에는 답을 무작정 외웁니다. 외운 답은 그 시험에선 맞지만, 다른 시험에 가면 다 틀려요. 그러다 한참 외우다가 어느 날 갑자기 **"아, 답이 만들어지는 규칙이 따로 있구나!"** 하고 깨달아 버립니다. 이제부터는 어떤 시험을 봐도 다 맞습니다.

신경망에서도 똑같은 일이 일어납니다. 이걸 **"그록킹(grokking)"** 이라고 부릅니다. 한국말로 직역하면 "온몸으로 이해해 버린다" 정도예요. 신경망 안에서는 무슨 일이 일어나는 걸까요?

이 논문은 답합니다: **신경망 안에 사실 두 개의 "팀" 이 살고 있다.** 하나는 "외우기 팀(조밀한 팀, dense team)" — 많은 뉴런들이 어물쩍 답을 외움. 다른 하나는 "규칙 팀(희소한 팀, sparse team)" — 소수의 뉴런이 정확한 규칙을 찾음. 처음에는 외우기 팀이 시끄럽게 답을 가로채서 시험 점수를 결정합니다. 그런데 학습이 길어지면, 작은 뉴런 몇 개가 빠르게 목소리를 키우고, 외우기 팀의 뉴런들은 천천히 사그라듭니다. 어느 순간 규칙 팀이 외우기 팀을 이깁니다. 그 순간이 바로 그록킹입니다.

논문 제목 "**Tale of Two Circuits**" 는 디킨스의 *Tale of Two Cities* (두 도시 이야기) 의 패러디입니다. 두 회로의 경쟁 이야기.

---

## 🎓 학부생 수준 (문제·아이디어·방법·결과)

**문제**: Power et al. 2022 가 보고한 grokking — 모듈러 산술 같은 알고리즘 과제에서 train acc 가 100% 에 도달한 뒤에도 한참 동안 test acc 가 chance 수준에 머물다가, **갑작스러운 phase transition** 으로 100% 로 올라간다 — 의 **내부 기계론** 은 무엇인가? Nanda et al. 2023 은 modular addition 에서 *Fourier 회로* 가 progress measure 로 발견된다고 보였지만, "왜 phase transition 인가" 는 여전히 열려 있었다.

**아이디어**: phase transition 은 **두 부분망의 경쟁** 으로 설명된다. 학습 초기에는 **조밀한 부분망 (dense subnetwork)** 이 모델의 예측을 지배하지만 일반화에 실패한다. 학습이 길어지면 **희소한 부분망 (sparse subnetwork)** 이 형성되어 결국 예측을 인수한다. 이 인수 시점이 바로 grokking 의 phase transition.

**방법**: 학습 substrate 로 **sparse parity** 를 사용 — 입력 $x \in \{-1,+1\}^n$ 에서 **처음 $k$ 비트의 곱** $y = \prod_{i=1}^{k} x_i$ 을 예측하는 binary classification 과제. 코드 default: $n=40, k=3$. 아키텍처는 단순 1-hidden-layer FF (FF1): $\mathrm{Linear}(40, 1000) \to \mathrm{ReLU} \to \mathrm{Linear}(1000, 1, \text{bias=False})$. 손실은 **hinge loss** $\max(0, 1 - y\hat{y})$. 학습은 SGD, $\text{lr}=0.1$, $\text{weight\_decay}=0.01$, $\text{batch}=32$, 300 epoch, 5 seeds. 분석은 (a) **뉴런별 노름 시계열** (b) **circuit discovery**: 노름이 큰 상위 $k^\star$ 뉴런만 켜놓고 나머지를 마스킹 → 원본과 같은 예측이 되는 최소 $k^\star$ 를 binary search 로 찾음 (c) **arity 측정**: 각 뉴런이 입력 40 비트 중 몇 비트에만 의존하는지 산출. 코드에 `--ind-norms --global-sparsity --subnetworks --faithfulness` CLI 플래그 verbatim.

**결과 (verbal)**: (i) grokking phase transition 직후, 모델 예측은 매우 작은 sparse subnetwork 만으로도 **완전히 재현된다** (faithfulness ≈ 1). (ii) 이 sparse subnetwork 의 각 뉴런은 입력 40 비트 중 정확히 $k=3$ 비트 근처에만 의존 (arity ≈ k). (iii) sparse subnetwork 의 뉴런들은 학습 도중 노름이 **급증** 하는 소수이며, 다른 뉴런들은 weight decay 에 의해 **완만히 감쇠**. (iv) 이 두 집단의 노름 교차점이 phase transition 의 시간 좌표와 일치. (v) sparse subnetwork 는 **DNF (Disjunctive Normal Form, 논리합 정규형)** 와 닮은 구조 — 3-bit parity 라면 표준 DNF 는 8 뉴런 ($2^k = 2^3$), 변형 DNF 는 6 뉴런. (구체 phase 수치는 본문 PDF 미확인.)

---

## 🔬 전문가 수준 (contribution 분해)

1. **Mechanistic re-characterization of grokking**: 기존의 "loss/acc trace 기반 progress measure" (Liu 2022, Nanda 2023) 를 **subnetwork-level competition** 의 운영적 정의로 재설정. Phase transition 이 시간 축의 *학습 동학* 사건이 아니라 *회로 상호작용* 사건이라는 관점 전환.

2. **Circuit discovery primitive for ungrouped FFNs**: Conmy et al. 2023 의 ACDC (edge-level reverse-topological iterative ablation) 와 달리, **neuron-norm-sorted top-$k^\star$ masking + binary search** 라는 simpler primitive 를 제안. activation-based mask × 원본 모델 예측 일치성 (faithfulness) 의 dual criterion. 작은 FFN 에선 ACDC 보다 가볍고 deterministic.

3. **DNF construction proof-of-existence**: $k$-bit parity 를 ReLU MLP 로 표현하는 두 명시적 구성 (8-뉴런 표준 DNF vs 6-뉴런 변형) 을 제시 — sparse subnetwork 의 표현 가능성 상한과 학습으로 도달한 실제 sparsity 의 격차를 정량 비교 가능한 기준선 제공. (정확한 두 구성의 공식적 진술은 본문 PDF 미확인 — abstract verbatim 단편으로만 검증.)

4. **Two-population norm dynamics as the operational signature**: 학습 동안 뉴런 노름의 시계열을 두 집단으로 분리 — (a) 소수의 "급성장" 뉴런, (b) 다수의 "완만 감쇠" 뉴런. Weight decay 가 (b) 의 균질한 background 를 만들고, gradient signal 이 (a) 의 sparse activation 에 집중되어 폭발적으로 자라난다. 이 두-population view 는 grokking 을 lottery-ticket 가설 (Frankle-Carbin 2019), double descent (Belkin 2019, Davies 2023), Goldilocks zone (Liu 2022/Omnigrok) 등 인접 현상과 직접 비교 가능한 공통 좌표축으로 만든다.

5. **(한계)** 단일 task (sparse parity) + 단일 architecture (2-layer FFN) + 단일 loss (hinge) 의 *최소 substrate* 라는 점이 동시에 강점이자 약점. Transformer 와 modular arith 의 Fourier circuit (Nanda 2023) 에서도 같은 sparse-vs-dense 경쟁이 일어나는지는 후속 작업에 위임 (본 논문 본문 PDF 의 future work 절은 미확인).
