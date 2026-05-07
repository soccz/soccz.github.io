# 08 — 이론적 계보

---

## 이론적 조상 1 — Power et al. (2022): Grokking 현상 발견

**arXiv:2201.02177** "Grokking: Generalization Beyond Overfitting on Small Algorithmic Datasets"  
저자: Alethea Power, Yuri Burda, Harri Edwards, Igor Babuschkin, Vedant Misra (OpenAI)

**이 논문과의 직접 연결선**: Lyle et al. 2025의 실험 기반 환경을 제공한 논문이다. 모듈러 산수 grokking 벤치마크, weight decay가 grokking을 촉진한다는 핵심 관찰, 그리고 "지연된 일반화"라는 현상 자체가 Power 2022에서 왔다. Lyle et al. 2025는 "왜 weight decay가 grokking을 촉진하는가?"라는 Power 2022의 미해결 질문에 ELR 관점에서 답을 제시한다.

---

## 이론적 조상 2 — Nikishin et al. (2022): Primacy Bias

**"The Primacy Bias in Deep Reinforcement Learning"** (ICML 2022)  
저자: Evgenii Nikishin, Max Schwarzer, Pierluca D'Oro, Pierre-Luc Bacon, Aaron Courville

**이 논문과의 직접 연결선**: 원시 편향(Primacy Bias)이라는 개념과 주기적 파라미터 리셋이 해결책임을 처음 제시했다. Lyle et al. 2025는 완전 리셋보다 ELR re-warming이 더 효율적이라는 점에서 Nikishin 2022를 개선하는 논문으로 위치지을 수 있다. 해결책은 같은 방향(주기적 개입)이지만, Lyle의 개입은 정보 손실이 없다.

---

## 이론적 조상 3 — Lyle et al. (2024, NeurIPS): NaP

**arXiv:2407.01800** "Normalization and effective learning rates in reinforcement learning"  
저자: Clare Lyle, Zeyu Zheng, Khimya Khetarpal, James Martens, Hado van Hasselt, Razvan Pascanu, Will Dabney

**이 논문과의 직접 연결선**: ELR의 수학적 정의, NaP 알고리즘, LayerNorm을 통한 ELR 제어 이론 전체를 제공한 선행 논문이다. Lyle et al. 2025는 이 논문의 직접적 후속 — NaP(ELR 일정 유지)를 ELR re-warming(ELR 주기적 상향)으로 확장하고, grokking과 continual learning 사이의 연결을 추가한다.

---

## 이론적 조상 4 — Liu et al. (2022): 표현 학습의 유효 이론

**"Towards Understanding Grokking: An Effective Theory of Representation Learning"** (NeurIPS 2022)  
저자: Ziming Liu, Eric J. Michaud, Max Tegmark

**이 논문과의 직접 연결선**: 신경망의 lazy regime(커널/NTK 극한) vs rich regime(feature-learning) 이분법을 통해 grokking을 이론화했다. Lyle 2025의 "ELR이 작으면 lazy, 크면 rich" 프레임워크는 Liu 2022의 표현 학습 이론과 직접 대응한다. Liu 2022가 초기화 스케일을 조작했다면, Lyle 2025는 훈련 중 ELR을 조작한다 — 결국 같은 레버를 다른 시점에 당긴다.

---

## 평행 연구 1 — Nanda et al. (2023): 진행 측도와 메커니즘

**arXiv:2301.05217** "Progress Measures for Grokking via Mechanistic Interpretability"  
저자: Neel Nanda, Lawrence Chan, Tom Lieberum, Jess Smith, Jacob Steinhardt

**관계**: Lyle 2025와 Nanda 2023은 grokking의 서로 다른 측면을 본다. Nanda 2023은 "네트워크 내부에 어떤 표현이 형성되는가"(푸리에 회로, 모노세만틱 방향)를 연구한 반면, Lyle 2025는 "왜 그 전환이 언제 일어나는가"(ELR 역학)를 연구한다. 둘은 상호보완적 — Nanda 2023의 "표현 변화"와 Lyle 2025의 "ELR 역학"을 합치면 grokking의 완전한 설명이 가능하다.

**이 논문이 이긴 부분**: Lyle 2025는 단순한 algorithmic task를 넘어 RL·warm-starting으로 적용 범위를 확대. Nanda 2023은 한 태스크(모듈러 산수)에 대한 심층 분석에 집중.

---

## 평행 연구 2 — Merrill et al. (2023): 희소 vs 밀집 서브네트워크 경쟁

**"A Tale of Two Circuits: Grokking as Competition of Sparse and Dense Subnetworks"**

**관계**: Merrill et al.은 grokking을 "희소(sparse) 일반화 회로"와 "밀집(dense) 기억 회로"의 경쟁으로 해석한다. Lyle 2025의 lazy/rich regime 이분법과 구조적으로 유사하다 — 기억 회로가 lazy regime에, 일반화 회로가 rich regime에 대응한다. 그러나 Lyle의 설명은 최적화 역학(ELR)으로 통합된 반면, Merrill의 설명은 표현 구조적이다.

---

## 평행 연구 3 — Thilak et al. (2023): Omnigrok & Slingshot

**"Omnigrok: Grokking Beyond Algorithmic Data"** + "The Slingshot Mechanism"  
저자: Vikrant Thilak et al.

**관계**: Omnigrok은 grokking이 algorithmic 데이터 외에도(비전, 언어) 발생함을 보여 범용 현상임을 확립. The Slingshot은 Adam의 내부 dynamics가 grokking 촉진에 관련됨을 주장 — Lyle 2025의 ELR 프레임워크와 연결 가능하다. Thilak의 Slingshot mechanism은 Adam의 learning-rate를 실효적으로 높이는 현상인데, 이것이 Lyle의 ELR re-warming과 같은 방향이다.

---

## 후손 예측

**후손 1 — 대규모 언어 모델 pretraining에서의 ELR 관리**  
대형 LLM 훈련에서 learning rate warmup이 표준으로 쓰이는 이유를 ELR 관점에서 재해석하고, warmup 스케줄 설계를 ELR 이론으로 최적화하는 연구. "왜 LLM이 warmup 없이 불안정한가?"에 대한 ELR 기반 설명이 가능.

**후손 2 — 시계열 비정상성에서의 ELR 관리**  
비정상(non-stationary) 시계열 예측에서 개념 드리프트(concept drift)가 발생할 때 ELR re-warming을 적용해 빠른 적응을 유도하는 연구. AETHER(비트코인 사이클 예측)나 Grokking in TS Transformers 트랙에서 직접 테스트 가능.

**후손 3 — ELR re-warming의 이론적 수렴 분석**  
Re-warming 주기 $T$, 목표 ELR, 수렴 보장 사이의 관계를 이론화하는 수학적 작업. 현재 논문은 실험적 정당화에 그치므로, 이것이 자연스러운 후속.

---

## 계보 요약

```
Power 2022 (Grokking 현상 발견)
    ↓
Liu 2022 (lazy/rich regime 이론)     Nikishin 2022 (Primacy Bias, RL 리셋)
    ↓                                        ↓
Nanda 2023 (메커니즘, 푸리에)    Kumar 2021 (plasticity loss)
    ↓                                        ↓
                     Lyle 2024 NaP (ELR 정의, 상수 유지)
                                 ↓
                  Lyle 2025 (ELR Re-warming, 세 도메인 통합)
                                 ↓
                 [LLM training dynamics] [TS nonstationarity] [이론 수렴]
```
