# 2. 문제 지형도

> 그로킹은 어떤 종류의 미스터리였는가, 그리고 *왜 mech interp 가 답일 수밖에 없었는가*.

## 배경 사다리

이 절을 이해하려면 ① **모듈러 덧셈** 이 "두 정수를 더한 뒤 어떤 수($p$) 로 나눈 나머지" 라는 것 ($p=12$ 면 시계 산수, $p=113$ 이면 더 큰 시계), ② **train accuracy / test accuracy** 가 각각 "외운 문제 / 새로운 문제" 정답률이라는 것, ③ **weight decay** 가 "쓸모없는 가중치는 시간이 지나면 사라지게 만드는 학습 정규화 항" — 이 셋만 알면 된다.

---

## 2.1 그로킹이라는 *경험적* 수수께끼 (Power et al. 2022 의 결정타)

Power 등(OpenAI, 2022) 이 발견했다. 1~2 layer 의 작은 transformer 에 다음 같은 algorithmic task — modular addition $a+b \pmod p$, modular subtraction, $S_5$ permutation composition 등 — 을 *데이터의 일부분* (train fraction $\rho \approx 0.3$~$0.5$) 으로만 학습시키면, 학습 곡선이 다음 같은 *기괴한* 형태를 보인다:

- step $\sim 10^3$: train acc $\to 100\%$, test acc $\sim$ random. (외운 상태)
- step $\sim 10^4$~$10^5$: train acc 그대로 100%, test acc 여전히 random. (긴 침묵)
- step $\sim 10^5$~$10^6$: 갑자기 test acc 가 *수직 상승* 해 100%. (그로킹)

수수께끼의 핵심은 셋이다:
1. 왜 두 시점이 *그렇게 떨어져 있나*? (memorization vs generalization 의 시간 격차)
2. 왜 일반화는 *부드럽지 않고 수직* 인가? (phase transition 형태)
3. 왜 weight decay 가 있으면 일어나고 없으면 안 일어나는가? (정규화 의존성)

Power 등의 논문은 *현상* 을 보여주고 멈췄다. 가설로는 "weight decay 가 memorization 보다 generalization 해 (sparse) 를 favor 한다" 정도가 거론됐지만, *왜 그런지 / 어떤 회로인지* 는 닫히지 않았다. 1년 가까이 그로킹은 "재미있지만 설명되지 않은 현상" 으로 남아 있었다.

---

## 2.2 기존 접근 계보 — 그로킹 설명 시도들

### 2.2.1 Liu et al. (2022) — "Effective theory of representation learning"

**무엇이었나**: 학습 동학을 representation manifold 위의 phase transition 으로 모델링. order parameter 를 정의해 학습이 어떤 critical point 를 통과한다고 주장.

**왜 부족했나**: 추상 수준이 높아 *정확히 어떤 회로* 가 형성되는지 말하지 못했다. "phase transition 이 있다" 까지가 결론.

**남긴 교훈**: 학습 동학이 *연속적* 으로 측정 가능한 order parameter 를 가질 수 있다는 발상. 본 논문의 progress measure 가 이 발상의 *구체적 instantiation* 이다.

### 2.2.2 Thilak et al. (2023) — "Slingshot Mechanism"

**무엇이었나**: 학습률 스케줄과 weight norm 의 oscillation ("slingshot") 이 grokking 직전에 관찰된다는 것을 보고. 동학적 시그니처 발견.

**왜 부족했나**: *symptom* 만 있고 cause 가 없음. slingshot 이 grokking 의 원인인지 결과인지 모호.

**남긴 교훈**: optimizer 동학이 grokking 의 표면적 신호를 만든다 — 하지만 회로 수준 설명이 따로 필요하다.

### 2.2.3 Thilak et al. (2023) — "Omnigrok"

**무엇이었나**: weight 의 norm 을 직접 조작 (특정 sphere 위로 projection) 하면 grokking 이 *임의로* 유도/억제될 수 있음을 보임. weight norm 이 핵심 변수.

**왜 부족했나**: norm 만으로는 *회로 정체* (어떤 함수가 학습됐는가) 를 말할 수 없음. "norm 이 큰 해 vs 작은 해" 의 분류가 남는다.

**남긴 교훈**: grokking 이 weight norm 과 phase 적으로 관련된다는 *외부* 증거. 본 논문은 이 norm 변화를 Fourier sparsity 변화로 *내적* 해석한다.

### 2.2.4 Davies et al. (2023) — "Unifying Grokking and Double Descent"

**무엇이었나**: grokking 과 model-wise / sample-wise double descent 가 같은 통계적 현상의 변형이라고 통합. EDM (effective dimension of model) 척도 도입.

**왜 부족했나**: 통합은 깔끔했지만 *왜* algorithmic task 에서 그렇게 강하게 나타나는지 — 즉 task 의 algebraic 구조가 어떻게 개입하는지 — 설명 부족.

**남긴 교훈**: grokking 이 *generic* 한 현상의 special case 일 가능성 — 즉 "algorithmic 만의 기벽" 이 아닐 수 있음. 본 논문 이후 후속 연구 (Lyle 2025 continual, Wang 2024 implicit reasoning) 가 이 generality 를 증명하는 방향으로 진행.

### 2.2.5 Merrill et al. (2023) — "Tale of Two Circuits"

**무엇이었나**: sparse parity 학습에서 grokking 을 dense (memorizing) circuit 과 sparse (generalizing) circuit 의 *경쟁* 으로 모델링. weight decay 가 sparse circuit 의 win 을 강제한다고 주장.

**왜 부족했나**: 이건 본 논문과 *동시기* 작업으로, 두 circuit 가설을 정량화한다는 점에서 본 논문과 *상보적* 이다. 다만 Merrill 측은 sparse parity 라는 다른 task 에서 작업했고 progress measure 의 정량적 정의는 약했다.

**남긴 교훈**: "두 회로 경쟁" 이라는 metaphor 가 정착. Nanda 의 본 논문은 이걸 *modular addition 에서 닫힌 형태로* 보여주는 instantiation.

---

## 2.3 공통으로 놓친 핵심 gap

**모든 선행 연구는 *외부 관찰* (loss 곡선, weight norm, EDM, slingshot) 만 봤다.** 학습이 plateau 인 동안 모델 *내부에서 무엇이 진행 중인지* 를 직접 측정한 사례는 없었다. 따라서 plateau 는 "진짜 정지" 인지 "느린 진행" 인지 알 길이 없었고, grokking 은 *현상학적 미스터리* 로 남았다.

**한 문장 gap**: 그로킹의 "지연" 이 *학습이 정말 정체된 시간* 인지, *우리가 못 보던 시간* 인지를 가르는 측정 기구가 없었다.

---

## 2.4 본 논문이 메우는 방식

Nanda 등은 두 단계로 gap 을 메운다:

1. **Reverse-engineer 부터** — modular addition 을 푸는 회로의 *닫힌 형태* 를 찾는다. weight matrix 의 SVD 가 정확히 Fourier basis 로 정렬되고, MLP 가 trig identity 를 구현한다. 이 회로는 *사전 정의* 된다 — "이런 회로가 있을 거야" 가 아니라 "이게 정확한 회로다, 손으로 검증 가능".
2. **Progress measure 정의** — 이 회로의 *진행도* 를 세 가지 기하학적/통계적 양 (restricted loss, excluded loss, Fourier sparsity) 으로 측정. 이 measure 들은 train/test loss 가 평탄한 plateau 구간에서 *단조* 변화한다.

이 두 조합이 만들어내는 결론: **그로킹의 "지연" 은 측정 도구의 한계였다.** 적절한 척도로 보면 학습은 plateau 동안에도 *연속적이고 단조* 로 진행 중이고, "갑작스런 phase transition" 처럼 보이는 부분은 단지 *memorization weights 가 weight decay 에 의해 제거되는 시점* 일 뿐이다.

이 재해석은 grokking 을 *별난 현상* 에서 *일반적 학습 동학의 special case* 로 끌어내린다. 동시에 **mech interp 의 효용** 을 입증한다 — "왜 모델이 이렇게 행동하는가" 라는 질문이, 적절한 회로 가설 + 회로 진행도 측정만 있으면 *경험적으로 답할 수 있다*.
