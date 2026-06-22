# 03 · 문제 지형도

> **배경 사다리**: ① "일반화(generalization)" = 학습에 쓰지 않은 새 데이터에서도 모델이 정답을 맞히는 능력, ② "암기(memorization)" = 학습 데이터의 입력↔출력 매핑을 외워두고 새 입력에는 무력함, ③ "phase transition" = 학습 곡선 위에서 어떤 양(예: test acc) 이 부드럽게 올라가지 않고 어느 시점에 급격히 점프하는 사건. 이 세 개념만 잡으면 이 절은 풀린다.

---

## 1) 이 논문이 푸는 실제 문제

다음과 같은 상황을 떠올려 보자.

**상황 1 (학습 곡선의 미스터리)**: 당신이 작은 신경망에 $40$ 비트짜리 ±1 벡터를 주고 "처음 3 비트의 곱을 알아내라" 고 학습시킨다. 5,000 epoch 까지는 train acc 100%, test acc 50% (동전 던지기) — 모델은 완벽히 외웠지만 아무것도 일반화 못 한 상태다. 그런데 8,000 epoch 쯤에서 갑자기 test acc 가 50% → 100% 로 점프한다. 이 점프 직전과 직후의 모델은 가중치 차이가 크지 않다. **무엇이 바뀐 것인가?**

**상황 2 (조기 종료의 함정)**: 같은 학습을 5,000 epoch 에서 끊고 검증 정확도 50% 를 보고 "이 모델은 일반화 못 한다" 라고 폐기한다면, 8,000 epoch 의 grokking 을 영영 보지 못한다. 검증 곡선 모니터링이 표준인 ML 실무에서, **grokking 같은 늦은 phase transition 은 시스템적으로 폐기될 위험** 이 있다.

**상황 3 (해석가능성 연구의 좌절)**: 모듈러 산술 grokked 모델에서 Nanda 2023 은 *Fourier 회로* 가 progress measure 로 등장한다고 보였다. 그러나 "Fourier 회로가 어디서 왔는가" — 무에서 생긴 것인가, 다른 것과 경쟁한 것인가 — 는 미해결. 회로의 정적인 묘사만으로는 **why-now** 의 답이 나오지 않는다.

이 세 상황은 한 질문으로 묶인다: **grokking 의 phase transition 을 학습 곡선 *바깥* 의 무엇인가가 설명해 주는가?** 본 논문의 답은 "그렇다 — 뉴런 부분집합의 *경쟁* 이 설명한다" 이다.

---

## 2) 기존 접근 계보 (연대순)

### (1) Power et al. 2022 — Grokking 원형 (`arXiv:2201.02177`, OpenAI)
- **무엇이었나**: modular arithmetic 데이터셋에서 작은 transformer 가 학습 시작 후 한참 뒤에 test acc 가 폭발적으로 올라가는 현상을 처음 명명·보고. 4-phase diagram (memorization / comprehension / generalization / confusion) 을 weight decay × data fraction 평면에서 그림.
- **왜 부족했나**: phenomenology 만 제공. *왜 그 phase transition 이 일어나는가* 의 mechanism 은 비어 있음.
- **남긴 교훈**: weight decay 와 data fraction 이 phase transition 위치를 결정한다 (regularization × dataset size 의 양면 효과). → 본 논문은 weight decay = 0.01 을 디폴트로 채택해 Power 의 *generalization phase* 영역에서 작업.

### (2) Liu et al. 2022 (Effective Theory) (`arXiv:2205.10343`) + Omnigrok 2023 (`arXiv:2210.01117`)
- **무엇이었나**: grokking 을 "representation learning 의 두 모드 (memorization vs structured)" 의 동학으로 모형화. Omnigrok 은 weight norm 의 *Goldilocks zone* (좋은 구의 껍질) 이 일반화 영역을 정의함을 제안.
- **왜 부족했나**: macroscopic order parameter (representation quality, weight norm radius) 수준에서만 작동. 어떤 뉴런이 어떤 역할을 맡는지 *회로 수준* 묘사 없음.
- **남긴 교훈**: weight decay 가 normed-landscape 위의 dynamics 를 형성한다는 시각. 본 논문은 이 시각을 받아 **개별 뉴런 노름 시계열** 을 분석 대상으로 끌어내림.

### (3) Nanda et al. 2023 — Progress Measures (`arXiv:2301.05217`, ICLR 2023)
- **무엇이었나**: modular addition 의 grokked transformer 에서 *Fourier basis* 가 회로의 핵심 기저임을 발견. progress measure (gradient symmetry, restricted loss 등) 가 grokking 을 단조 monitoring 가능한 양으로 환원.
- **왜 부족했나**: (a) modular addition 특화 — sparse parity 같은 다른 algorithmic task 로의 일반성이 자동은 아님, (b) "Fourier 회로 vs 다른 후보" 의 경쟁이 묘사되지 않음 — Fourier 회로가 등장한 뒤의 사진만 보여줌.
- **남긴 교훈**: 회로 수준 progress measure 가 가능하다는 증명. 본 논문은 progress measure 를 **"sparse subnetwork 가 logit 의 몇 % 를 설명하는가"** 라는 다른 형태로 일반화 가능함을 시사 (실제 metric 정의는 본문 PDF 미확인).

### (4) Frankle & Carbin 2019 — Lottery Ticket Hypothesis (`arXiv:1803.03635`, ICLR 2019)
- **무엇이었나**: 잘 학습된 신경망 안에는 "당첨 티켓" 같은 sparse subnetwork 가 존재하며, 처음부터 그 sparse 구조만으로도 학습이 잘 된다는 가설.
- **왜 부족했나**: post-hoc magnitude pruning 후 rewind retrain 라는 *외부 절차* 로 lottery ticket 을 찾음. 학습이 자연히 그 sparse 구조로 *흘러가는가* 는 별개.
- **남긴 교훈**: "신경망 = dense + sparse 의 혼합" 이라는 표상. 본 논문은 학습 *동학 자체* 가 sparse 회로를 self-discover 함을 보임으로써 lottery-ticket 가설을 grokking 시그널로 연결.

### (5) Olsson et al. 2022 (Induction Heads) `arXiv:2209.11895` + Wang et al. 2023 IOI Circuit `arXiv:2211.00593` + Conmy et al. 2023 ACDC `arXiv:2304.14997`
- **무엇이었나**: 모델 안에서 specific computation 을 책임지는 head/edge 들을 **수동 (Wang) 또는 자동 (Conmy)** 으로 식별하는 방법론. Faithfulness/Completeness/Minimality 의 메트릭 3 축.
- **왜 부족했나**: 회로의 *정적* 그림. 학습 과정의 어느 시점에 그 회로가 *떠올랐는가* 는 다루지 않음.
- **남긴 교훈**: 회로를 마스킹 + 원본 비교로 검증한다는 protocol. 본 논문은 이 protocol 의 *시간 축* 확장 — 같은 마스킹을 모든 epoch 에 적용하여 회로의 *역사* 를 추적.

### (6) Merrill, Tsilivis, Shukla 2023 (본 논문)
- 위 5 개 흐름의 **교차점에 다리** 를 놓음: (Power 의 phenomenology) × (Liu 의 weight-norm dynamics) × (Nanda 의 회로 수준 분석) × (Frankle 의 sparse 구조) × (Wang/Conmy 의 마스킹 protocol) → "두 부분망의 경쟁".

---

## 3) 기존 방법들이 공통으로 놓친 핵심 gap

> **한 문장 요약**: 기존 작업들은 grokking 을 (a) 외부 관측자가 보는 *학습 곡선의 한 점* 으로 보거나, (b) phase transition *이후* 의 회로 그림으로만 묘사했다. **phase transition 의 *순간* 에 무엇이 그 안에서 *경쟁* 하다가 한쪽이 *이긴* 것인지** 의 **dynamic competition view** 는 비어 있었다.

이 gap 은 단순한 미관 문제가 아니다. 그것이 메워져야:
- grokking 의 시점을 **예측·제어** 할 수 있고 (소수 뉴런의 노름 monitoring),
- 다른 task (모듈러 산술, language) 의 grokking 도 같은 frame 으로 비교할 수 있으며,
- 비-grokking 도메인 (TS forecasting 등) 으로 가설을 옮길 substrate 가 생긴다.

---

## 4) 이 논문이 gap 을 메우는 전략

본 논문은 **세 가지 결합** 으로 gap 을 닫는다.

(i) **최소 task**: sparse parity. parity 는 알려진 ground-truth 회로 (8-뉴런 표준 DNF, 6-뉴런 변형 DNF) 가 존재하는 "구조가 빤히 보이는" 과제. 이 ground-truth 와 학습된 회로를 *직접* 비교 가능.

(ii) **최소 architecture**: 1-hidden-layer FFN (FF1, width 1000). attention/normalization/depth-induced 효과를 제거한 가장 단순한 setting — sparse-dense 경쟁이 나타난다면, 그 원인은 **attention 도 depth 도 아니다** 라고 결론 가능 (반박: 더 큰 model 에선 다를 수 있음 — §07 한계 참조).

(iii) **두 관측 양식의 결합**: 뉴런별 노름 시계열 (continuous, optimization-level) + circuit-discovery masking (discrete, prediction-level). 두 측정이 같은 시간 좌표를 가리키면 경쟁 가설이 강화됨.

이 결합 덕분에 결과 한 줄이 가능해진다: **"grokking 의 phase transition = sparse subnetwork 의 logit 지배 시점 = 소수 뉴런 노름이 polynomial 으로 폭증하는 시점."**
