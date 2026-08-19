# 3. 핵심 Claim 해체 (2) — induction head와 스케일링 법칙

> **배경 사다리**: 이 절을 이해하려면 ① **induction head**(유도 헤드)가 "문맥에서 `A B ... A` 를 발견하면 다음에 `B` 를 내놓는 트랜스포머 내부 회로"라는 것, ② **프랙탈 차원**이 "모양이 공간을 얼마나 빽빽하게 채우는가를 정수가 아닌 수로 잰 것"이라는 것, ③ **멱법칙(power law)** 이 "$y = c\,x^{-\alpha}$ 처럼 로그-로그 그래프에서 직선이 되는 관계"라는 것만 알면 된다.

---

## Claim 3 — context parroting 은 induction head 의 시계열 버전이며, 이것이 "LLM 을 시계열에 갖다 써도 되더라"는 보고들을 설명한다

**주장 (한 문장).** parroting 과 induction head 는 둘 다 본질적으로 복사-붙여넣기 연산이고, 이 대응이 언어모델의 시계열 전용(轉用) 성공 사례들에 대한 통일된 설명을 제공한다.

**증거 (원문 위치).**

- **§2 Related work** verbatim: *"In its simplest form, an induction head copies repeating tokens in the context to make predictions."*
- **§5.2 주변** verbatim: *"There is a clear parallel between context parroting and induction heads: both are essentially copy-and-paste operations, with context parroting involving the matching of not just one but multiple contiguous tokens."*
- 역할 분해 verbatim: *"Framed in terms of induction heads, the query lookup acts as a copy head, the nearest-neighbor match is a selector, and the exact repetition is the aggregation operation."*
- 초록 verbatim: *"We draw a parallel between context parroting and induction heads, which explains recent works showing that large language models can often be repurposed for time series forecasting."*

**숨은 전제.**

1. **"기능적 동형 = 메커니즘적 동일"이라는 도약.** induction head 는 원래 **활성화 패칭·어텐션 헤드 절제 같은 인과 개입으로 확인된 회로**다. 반면 이 논문은 알고리즘 수준의 유비만 제시하고, **TSFM 안에서 실제 induction head 를 찾아 그것을 끄면 parroting 이 사라지는지**는 보이지 않는다. 원문에서 그런 개입 실험은 확인되지 않는다.
2. **모티프 매칭이 근사(近似) 매칭이라는 점.** induction head 는 이산 토큰의 **정확 일치**를 기반으로 하지만, parroting 은 연속값 공간에서 **유클리드 거리 최소화**로 근사 일치를 찾는다. 원문 자신이 *"not just one but multiple contiguous tokens"* 라고 차이를 인정하지만, 이산 정확 일치와 연속 근사 일치 사이의 간극(양자화 폭이 곧 매칭 허용 오차가 된다)은 정량화되지 않는다.
3. **§4-bis 준수 메모**: 위 인용들은 §2 와 §5.2 본문에서 확인한 문장이다. **induction head 회로의 층·헤드 위치 같은 구체적 국소화는 원문에 없으므로 본 해체에서도 쓰지 않는다.**

**쉬운 말 풀이.** 언어모델 안에는 "아까 나온 단어 뒤에 뭐가 왔는지 기억했다가 그대로 다시 내놓는" 부품이 있다는 게 알려져 있다. 저자들은 "우리 앵무새 알고리즘이 바로 그 부품이 하는 일의 시계열판"이라고 말한다. 그렇다면 "언어모델을 시계열에 써도 잘 되더라"는 여러 보고는, 언어모델이 시간을 이해해서가 아니라 **그 복사 부품이 시계열에서도 그대로 작동해서**일 수 있다.

---

## Claim 4 — 문맥 길이에 대한 in-context 스케일링 지수는 어트랙터의 상관차원의 역수다

**주장 (한 문장).** 예측 오차가 문맥 길이에 대해 멱법칙으로 줄어드는데($e \propto L^{-\alpha}$), 그 지수 $\alpha$ 는 대상 카오스 어트랙터의 상관차원 $d_{\mathrm{cor}}$ 의 역수 $\alpha = 1/d_{\mathrm{cor}}$ 로 예측된다.

**증거 (원문 위치).**

- **§5.2** 스케일링 관계 verbatim: *"$e \propto L^{-\alpha}$ and $\ell \propto L^{-\alpha}$"*, 그리고 *"$\alpha = 1/d_{\mathrm{cor}}$"*
- **상관차원 정의** verbatim: $d_{\mathrm{cor}} \equiv \lim_{\epsilon,\epsilon' \to 0^{+}} \dfrac{\ln[C(\epsilon)/C(\epsilon')]}{\ln(\epsilon/\epsilon')}$
- **직관 문장** verbatim: *"for a two-dimensional attractor, the distance between a random point and its nearest neighbor will decrease as $1/\sqrt{L}$"*
- **실증**: §5.2 verbatim *"Spearman correlation around 0.85"* (135개 카오스계에 대해 추정 $\alpha$ 와 $1/d_{\mathrm{cor}}$ 사이). **Figure 5** 캡션 verbatim: *"Right: Estimated scaling exponent $\alpha$ versus the inverse correlation dimension $1/d_{\mathrm{cor}}$, where each dot represents a chaotic system. For all panels we set the embedding dimension $D=10$ for the parroting algorithm."*
- **Figure 5** 중간 패널이 핵심 다리다: *"Middle: Euclidean distance between the last context point and its nearest neighbor in the delay-embedding space, as a function of context length. Again, the scaling follows a power law with the same scaling exponent $\alpha$."* — 즉 **오차의 스케일링과 이웃 거리의 스케일링이 같은 지수를 공유**한다는 것이 논증의 뼈대다.

**숨은 전제.**

1. **"이웃이 가까워지는 속도 = 오차가 줄어드는 속도"** 라는 등식은, 예측 오차가 **초기 이웃 거리에 선형으로 비례**한다고 가정해야 성립한다. 카오스계에서 초기 오차는 $e^{\lambda t}$ (λ = 최대 Lyapunov 지수)로 증폭되므로, 이 선형 비례는 **고정된 짧은 예측 지평**에서만 유효하다. 원문도 이를 "one-step forecast error"(1스텝 예측 오차)로 좁혀서 다룬다.
2. **에르고딕성과 균일한 자연측도.** 상관차원 논변은 어트랙터 위 점들이 자연측도에 따라 고르게 뿌려진다고 본다. 측도가 극도로 불균일한 구간(간헐성, intermittency)에서는 지수가 국소적으로 달라질 수 있다.
3. **Spearman 0.85 의 해석 한계.** Spearman 상관은 **순위 일치**만 재므로, $\alpha = 1/d_{\mathrm{cor}}$ 라는 **등식**의 검증으로는 약하다. 기울기 1, 절편 0 인 직선 적합이었다면 더 강한 주장이 됐을 것이다. 0.85 는 "지수가 차원과 단조적으로 연결된다"까지를 지지한다.

**쉬운 말 풀이.** 과거 데이터를 오래 모을수록 "지금과 닮은 순간"을 더 가까이 찾을 수 있다. 그런데 얼마나 빨리 가까워지는지는 **그 시스템의 상태들이 몇 차원짜리 모양 위에 흩어져 있는지**에 달려 있다. 2차원 종이 위에 점을 뿌리면 점 개수 $L$ 이 4배가 될 때 이웃 거리는 절반이 되지만, 10차원 공간이라면 거의 줄지 않는다. 그래서 **차원이 높은 시스템일수록 복사 전략의 개선 속도가 느리다.** 이것이 "왜 어떤 시스템에서는 문맥을 늘려도 소용없는가"에 대한 정량적 답이다.

**이 claim 이 실무적으로 가장 중요한 이유.** Claim 1·2 는 "지금 모델들이 못한다"는 진단이지만, Claim 4 는 **처방**이다. 대상 시스템의 상관차원을 추정하면 "문맥을 2배로 늘렸을 때 오차가 얼마나 줄어들지"를 사전에 계산할 수 있고, 따라서 **문맥 확장에 돈을 쓸지 아키텍처를 바꿀지** 결정할 수 있다.

---

## Claim 5 — 이 현상은 저차원 카오스에 국한되지 않는다

**주장 (한 문장).** 난류·심전도·실험 회로·결합 진동자 등 고차원·실측 데이터에서도 parroting 은 최상위권을 유지한다.

**증거.** §5.3 verbatim: *"Here, we show that parroting also outperforms foundation models on a broader class of SciML tasks, including real-world datasets of current scientific interest."* 그리고 *"These are all high-dimensional systems, two generated from simulations and two measured in the real world."* 구체적 수치는 Table 1(MAE)·Table 2(MSE)·Table 3(어트랙터 KL)·Table 4(장기 지평 불변량)에 있다 — [06_experiments_b_beyond_chaos.md](06_experiments_b_beyond_chaos.md) 에서 표를 그대로 펼친다.

**숨은 전제.** 네 과제 모두 **강한 준주기성 또는 반복 구조**를 갖는다. ECG 는 심박 주기, Kuramoto 는 위상 동기화, 회로는 결합 진동, 폰 카르만 소용돌이 열(Re=900)은 주기적 와류 방출이다. 즉 "고차원"이라는 표현이 곧 "복사가 어려운 조건"을 뜻하지는 않는다. **진짜 어려운 조건은 차원이 아니라 비반복성**인데, 그 축을 정면으로 겨냥한 과제(예: 구조적 레짐 전환이 일어나는 비정상 시계열)는 원문 실험 목록에서 확인되지 않는다.

**쉬운 말 풀이.** "심전도도 되고 난류도 되니 일반적이다"라고 말하지만, 심전도도 난류도 **뭔가 반복되는** 데이터다. 반복이 없는 데이터에서 앵무새가 어떻게 되는지는 이 논문이 대답하지 않았다. 그리고 금융 시계열처럼 **레짐이 갈아엎히는** 데이터가 바로 그 미검증 영역에 있다.
