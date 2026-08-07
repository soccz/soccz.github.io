# 9-b. Follow-up 논문 3편 (선행 1 / 경쟁 1 / 후속 1)

> **출처 등급 명시**: 아래 3편은 **읽을 목록**이지 본 해체의 근거가 아니다. 각 항목의 식별자는 확인했으나 **본문 전문을 이 실행에서 열지는 않았다.** 따라서 내용 서술은 관계 설정 수준이며, 수치·표·절 번호를 단정하지 않는다. 오늘 논문에 대한 모든 사실 주장은 `00_README.md` 의 Source Lock 을 통과한 1차 소스에서만 나왔다.

---

## 【선행】 Omnigrok: Grokking Beyond Algorithmic Data

- **저자**: Ziming Liu, Eric J. Michaud, Max Tegmark (MIT Physics · IAIFI)
- **식별자**: arXiv:2210.01117 · OpenReview zDiHoIWa0q1 · **ICLR 2023 Spotlight**
- **내 인덱스 상태**: `_index.md` 커버 완료 (2026-06-12)

**어떤 논문인가.** Grokking(훈련 손실이 진작 0 인데 일반화가 한참 뒤에 오는 지연 현상)이 모듈러 산술 같은 알고리즘 데이터 밖에서도 일어나는지를 다루며 **가중치 노름**을 핵심 변수로 놓는다.

**오늘 논문과의 관계.** 두 논문은 **같은 변수를 반대 부호로** 쓴다 — Omnigrok 은 노름 동학으로 "늦게 오는 좋은 일"을 설명하고, Dohare et al. 은 가중치 크기 증가를 "천천히 오는 나쁜 일"의 동반 신호로 보고한다(*"associated with an increase in the average magnitude of the weights"*). **다만 Dohare et al. 이 Omnigrok 을 인용하는지는 참고문헌 목록을 확인하지 못했다** — 계보 관계는 내 판단이지 저자들의 주장이 아니다.

**무엇을 얻는가.** §8.2 흡수 2 의 통합 가설을 세우려면 두 편을 나란히 놓고 **노름 궤적의 정의가 서로 호환되는지** 먼저 확인해야 한다 — 층별로 재는지 전체로 재는지, 초기화 스케일을 어떻게 정규화하는지가 다르면 비교 자체가 성립하지 않는다. **재독 시 이 한 가지만 집중해서 볼 것.**

---

## 【경쟁】 The Dormant Neuron Phenomenon in Deep Reinforcement Learning (ReDo)

- **저자**: Ghada Sokar, Rishabh Agarwal, Pablo Samuel Castro, Utku Evci
- **식별자**: arXiv:2302.12902 · **ICML 2023** (PMLR v202, `sokar23a`) · OpenReview `skb34O7hFp`
- **내 인덱스 상태**: 미커버

**어떤 논문인가.** 심층 RL 에서 학습이 진행될수록 **비활성(dormant) 뉴런**이 늘어 표현력이 줄어드는 현상을 보고하고, 이를 감지해 재활용(recycle)하는 **ReDo** 를 제안한다.

**오늘 논문과의 관계 — 여기가 핵심이다.** 오늘 논문이 **직접 언급하는 유일한 경쟁 알고리즘**이다. Methods verbatim: *"In our next experiment, we perform a preliminary comparison with ReDo. ReDo is another selective reinitialization method that builds on continual backpropagation but uses a different measure of utility and strategy for reinitializing."*

읽어야 할 것이 셋이다. ① Dohare et al. 은 ReDo 를 자신들의 **후속**(*"builds on continual backpropagation"*)으로 위치시킨다 — 선행성 주장이다. ② 차이는 **효용 척도와 재초기화 전략**에 있다고 스스로 정리한다. ③ 비교를 **"preliminary"** 로 한정했으므로 **"연속 역전파가 ReDo 보다 낫다"고 인용하면 저자 의도를 넘는다.** (정량 결과는 PMC 렌더 절단으로 미확인.)

**무엇을 얻는가.** Q3("효용 함수가 정말 필요한가")에 대한 **자연 실험**이 두 논문의 차이 안에 이미 들어 있다 — 서로 다른 효용 척도를 쓰는 두 알고리즘의 성능이 비슷하면 척도 세부는 중요하지 않다는 증거이고, 크게 다르면 척도 설계가 핵심이라는 증거다. **두 논문의 효용 정의를 나란히 표로 정리하는 것**이 이 축에서 가장 값싼 기여다. 또한 ReDo 는 "dormant"를 전면에 놓으므로 **죽은 유닛 축만 공략했을 때 어디까지 가는지**의 사실상 ablation 이기도 하다 (`07_limits.md` 반박 2 · Q2 직결).

**추가 맥락**: 제1저자 Ghada Sokar 는 내가 이미 커버한 Lyle et al. 2025 의 공저자이기도 하다 (`_index.md` 2026-05-01 항목 저자 표기에서 확인). 이 라인이 grokking ↔ 가소성 축을 잇는 실제 인적 다리다.

---

## 【후속】 What Can Grokking Teach Us About Learning Under Nonstationarity?

- **저자**: Clare Lyle, Ghada Sokar, Razvan Pascanu, András György (Google DeepMind)
- **식별자**: arXiv:2507.20057
- **내 인덱스 상태**: `_index.md` 커버 완료 (2026-05-01)

**어떤 논문인가.** 제목이 곧 논지 — grokking 연구의 통찰을 비정상 환경 학습 문제에 적용한다.

**오늘 논문과의 관계.** 오늘 논문(2024)보다 나중이고 **grokking 문헌과 가소성 문헌을 잇는 다리** 위치다. 오늘 논문이 "비정상 환경에서 학습 능력이 소진된다"를 실증했다면, 이 논문은 "그 동학을 grokking 의 렌즈로 이해할 수 있는가"를 묻는다. 저자진에 Sokar(ReDo 제1저자)가 포함돼 있다는 사실이 세 논문이 하나의 대화를 이루고 있음을 보여준다.

**무엇을 얻는가.** 내 Grokking track 의 서사 골격 그 자체다. 4-way 교차점 중 **이 논문이 (Grokking × non-stationarity) 를, 오늘 논문이 (non-stationarity × training dynamics) 를 채우므로**, 내가 채울 빈칸은 **TS forecasting** 과 **circuit analysis** 두 축이다. 두 논문을 다시 읽으며 **"저들이 남긴 좌표가 정확히 어디인지"** 를 좌표계로 그리는 게 다음 작업이다.

**재독 우선순위**: 이미 커버했지만 **오늘 논문을 읽은 뒤 다시 읽어야** 한다 — 5월 시점에는 반대편 기둥이 없어서 다리로 보이지 않았을 것이다.

---

## 【보너스 리드 — 미확인】

검색 중 **arXiv:2604.01913 "The Rank and Gradient Lost in Non-stationarity: Sample Weight Decay for Mitigating Plasticity Loss in Reinforcement Learning"** 이라는 2026년 항목이 잡혔다. 제목만 보면 이 계보의 최신 후손(랭크 + 가중치 감쇠 축)으로 보이지만, **본 실행에서 본문·저자·게재처를 확인하지 않았다.** 다음 실행에서 Source Lock 을 걸어 검증할 후보로만 남긴다 — 이 상태로는 인용하지 말 것.
