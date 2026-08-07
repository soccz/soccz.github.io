# 3-b. 핵심 Claim 해체 (2) — 기전·처방 편

> **배경 사다리**: ① "경사하강(gradient descent)"은 손실이 줄어드는 방향으로만 움직이는 규칙이다 — **결정론적**이며, 현재 위치의 국소 정보만 쓴다. ② "무작위 성분(random component)"은 그 방향과 무관하게 주사위를 굴려 값을 바꾸는 것이다. ③ 아래 두 Claim 은 "왜 그렇게 되는가"와 "그래서 무엇을 해야 하는가"를 각각 맡는다.

---

## Claim 3. 가소성 상실은 망 내부 다양성의 단조 감소와 함께 진행되며, 그 다양성을 지속적으로 재주입하면 무한히 가소성이 유지된다

### 주장 (한 문장)
학습이 진행될수록 뉴런들은 **잠들고(dormant) / 과잉 개입되고(overcommitted) / 서로 닮아가며(similar to each other)**, 이 세 축의 다양성을 계속 되돌리는 알고리즘만이 가소성을 유지한다.

### 증거
- **Discussion verbatim (기전 요약)**: *"Taking a closer look, we found that, during training, many of the networks' neuron-like units become dormant, overcommitted and similar to each other, hampering the ability of the networks to learn new things. As they learn, standard deep-learning networks gradually and irreversibly lose their diversity and thus their ability to continue learning."*
- **축 ① 죽은 유닛** — Methods "Understanding loss of plasticity" verbatim: *"For the step size of 0.01, up to 25% of units die after 800 tasks."* 죽은 유닛의 정의도 같은 절: ReLU 망에서 *"the output of the activations is zero for all examples of the task"*.
- **축 ② 가중치 크기** — 같은 절 verbatim: *"the degradation of online classification accuracy … is associated with an increase in the average magnitude of the weights"*. Fig. 4d 는 RL 에서 같은 패턴을 재확인한다: *"The absolute values of the weights of the networks increased steadily under standard and tuned PPO, whereas they decreased and stayed small under L2 regularization with or without continual backpropagation."*
- **축 ③ 유효 랭크** — 같은 절 verbatim: *"loss of plasticity is accompanied by a decrease in the average effective rank of the network"*. 정의는 식 (2) (해부는 `05_method_d_diagnostics.md`).
- **개입 증거** — Fig. 1 캡션 verbatim: *"whereas the continual backpropagation, L2 regularization and Shrink and Perturb algorithms maintain plasticity, apparently indefinitely (c)."* 본문은 지평까지 명시한다: *"augmenting backpropagation with this enabled the network to continue improving its learning performance over at least 5,000 tasks"*.
- **RL 로의 전이** — Fig. 4 캡션 verbatim: *"A closer look inside the networks reveals a similar pattern as in supervised learning (compare with Fig. 2c,d)."*

### 숨은 전제 (여기가 이 논문의 가장 약한 관절이다)
1. **"동반한다(accompanied by / associated with)"는 인과가 아니다.** 저자들의 언어 선택은 정확히 상관 수준이다. 세 지표가 가소성 상실의 **원인**인지, 같은 상위 과정의 **부산물**인지는 주 결과에서 분리되지 않는다. 연속 역전파가 듣는다는 사실은 인과의 강한 정황이지만 — 그 개입이 세 축을 **동시에** 건드리므로, 어느 축이 병목인지는 여전히 미결이다.
2. **"다양성"이 세 지표로 충분히 포착된다.** 죽은 유닛·가중치 크기·유효 랭크는 다양성의 프록시(대리 지표)이지 정의가 아니다. 예컨대 유효 랭크가 높으면서도 학습이 안 되는 상태를 배제하지 못한다.
3. **"불가역적(irreversibly)"이라는 강한 단어.** Discussion 은 *"gradually and irreversibly lose their diversity"* 라고 쓴다. 그런데 이 논문 자체가 재초기화로 회복시킨다 — 즉 **표준 경사하강 내부에서는** 불가역적이라는 좁은 의미로 읽어야 한다. 이 어휘 선택은 다소 과하다.

### 쉬운 말 풀이
악단을 상상하자. 처음엔 바이올린·첼로·플루트·드럼이 다 다른 소리를 낸다. 그런데 연습을 반복할수록 이상하게 다들 비슷한 소리를 내기 시작하고, 몇몇은 아예 소리를 안 내고, 몇몇은 너무 크게만 분다. 이제 새 곡을 주면 표현할 수가 없다 — **음색의 다양성이 사라졌기 때문**이다. 해법은 지휘자가 "요즘 제일 안 쓰이는 악기 하나를 새 연주자로 교체"하는 것. 소리를 다시 다양하게 만들면 새 곡도 연주할 수 있게 된다.

---

## Claim 4. 지속적 딥러닝에는 경사하강만으로는 부족하며, 무작위·비경사 성분이 필수다

### 주장 (한 문장)
가소성을 무한히 유지하려면 **경사가 알려주지 않는 방향으로의 변화**(무작위 재초기화)가 학습 규칙 안에 상시 포함돼야 한다.

### 증거
- **초록 마지막 문장 verbatim** (이 논문의 최종 명제): *"Our results indicate that methods based on gradient descent are not enough—that sustained deep learning requires a random, non-gradient component to maintain variability and plasticity."*
- **초록 verbatim (조건절)**: *"Plasticity is maintained indefinitely only by algorithms that continually inject diversity into the network, such as our continual backpropagation algorithm, a variation of backpropagation in which a small fraction of less-used units are continually and randomly reinitialized."* — **"only by"** 라는 배타적 한정사가 붙어 있다는 점에 주목.
- **Discussion verbatim (일반화된 형태)**: *"Both of these algorithms extend standard deep learning by adding a source of continuing variability to the weights of the network, and continual backpropagation restricts this variability to the units of the network that are at present least used, minimizing damage to the operation of the network. That is, continual backpropagation involves a form of variation and selection in the space of neuron-like units, combined with continuing gradient descent."*

### 숨은 전제 — 그리고 이 Claim 의 내적 긴장
1. **가장 큰 긴장: L2 정규화는 무작위 성분이 아니다.** Fig. 1c 캡션은 가소성을 유지하는 알고리즘으로 *"continual backpropagation, L2 regularization and Shrink and Perturb"* 셋을 나란히 든다. 그런데 **L2 정규화는 순수 경사 기반 결정론적 항**이다(손실에 $\lambda\|w\|^2$ 를 더할 뿐). Fig. 3c 캡션도 RL 에서 *"adding continual backpropagation or L2 regularization is necessary to perform well indefinitely"* 라며 둘을 대등하게 놓는다.
   → 그렇다면 초록의 *"requires a random, non-gradient component"* 는 **저자들 자신의 Fig. 1c/3c 와 긴장한다.** 온건하게 읽으면 "가중치 크기 억제(L2) 또는 다양성 재주입(재초기화) 중 하나가 필요하다"이지, "무작위 성분이 필수"는 아니다. 이건 이 논문에서 내가 발견한 **가장 실질적인 내적 불일치**이며, `07_limits.md` 의 반박 1 로 정식화한다.
   → 저자 쪽 방어 논리를 굳이 재구성하면: L2 는 "가중치 크기" 축만 고치고 "죽은 유닛"과 "유효 랭크" 축은 못 고치므로 장기적으로는 부족하다 — 는 주장이 가능하다. 하지만 그런 장기 분리 실험이 주 결과에 명시돼 있지는 않다.
2. **"non-gradient" 의 의미가 두 겹이다.** ⓐ 경사 정보를 쓰지 않는다, ⓑ 결정론적이지 않다. 연속 역전파의 재초기화는 ⓐ·ⓑ 둘 다지만, **어느 쪽이 본질인지**는 구분되지 않았다. 만약 결정론적 재초기화(예: 효용 최하위 유닛을 고정된 값으로 리셋)도 통한다면 필요한 건 "무작위성"이 아니라 "경사 바깥"이다.
3. **효용 순위가 신뢰할 만하다.** 재초기화 대상 선택이 잘못되면 이 처방은 오히려 해가 된다. 성숙 임계치 $m$ 이 그 리스크를 막는 안전장치다.

### 쉬운 말 풀이
지금까지 딥러닝은 "언덕을 내려가는 규칙"이었다. 어디가 아래쪽인지 보고 그쪽으로 한 발씩. 이 논문은 말한다 — **계속 걸으려면 가끔 눈을 감고 아무 데로나 한 발 내딛는 것도 규칙에 넣어야 한다.** 그것도 아무렇게나가 아니라, "지금 제일 안 쓰는 다리"부터.

---

### 네 Claim 의 논리 구조

```
Claim 1 (현상 존재)
   └─ Claim 2 (설계 공간 전반) ──→ "이건 버그가 아니라 성질이다"
          └─ Claim 3 (기전 = 다양성 고갈)  ──→ 처방의 방향을 지정
                 └─ Claim 4 (해법 = 비경사 무작위 성분) ──→ 설계 원칙으로 승격
```

Claim 1→2 는 **탄탄하다** (실험 범위가 넓고 수치가 명시적). Claim 3 는 **정황이 강하지만 인과 분리가 없다**. Claim 4 는 **가장 야심 차고 가장 취약하다** — 저자 자신의 L2 결과와 긴장하기 때문이다. 이 논문을 인용할 때는 어느 층위를 인용하는지 반드시 구분해야 한다: Claim 1·2 는 사실로, Claim 3 는 가설로, Claim 4 는 **저자의 해석**으로 인용하는 것이 정확하다.
