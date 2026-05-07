# 10b — 사고 확장: Follow-up 논문 3편

---

## Follow-up 1 (선행): Nanda et al. (2023) "Progress measures for grokking via mechanistic interpretability" (ICLR 2023 Oral, arXiv:2301.05217)

**어떤 논문인가**: 모듈 덧셈 $(a+b) \mod p$에서 grokking이 일어나는 이유를 역공학한 논문. 모델이 DFT 기반 "Fourier 회로"를 학습하며, 훈련을 memorization → circuit formation → cleanup 3단계로 나눌 수 있음을 보인다. ICLR 2023 Oral로 발표된 grokking 메커니즘 해석의 선행 연구.

**본 논문과의 관계**: 본 논문(Wang et al., NeurIPS 2024)의 직접적 선행. 두 회로($\mathcal{C}_\text{mem}$, $\mathcal{C}_\text{gen}$) 경쟁 프레임을 모듈 산술에서 처음 실증한 것이 Nanda et al. 본 논문은 이를 KG 추론으로 확장.

**무엇을 얻을 수 있는가**: 
- 3단계 훈련 구조(memorization/circuit formation/cleanup)의 상세 수식과 실증 방법.
- "Progress measures" (restricted loss, excluded loss 등) — grokking을 조기에 예측하는 지표. 이 지표를 TS Grokking track에 도입할 수 있다.
- Fourier 회로의 역공학 방법론 — TS 주기 패턴 회로를 역공학하는 방법의 모델.

---

## Follow-up 2 (경쟁): He et al. (2026) "Is Grokking Worthwhile? Functional Analysis and Transferability of Generalization Circuits in Transformers" (arXiv:2601.09049)

**어떤 논문인가**: 본 논문(Wang et al., NeurIPS 2024)의 직접적 비판자. 2026년 1월 발표된 신작. 핵심 주장: (1) In-distribution 쿼리에서 grokked/non-grokked 모델의 inference path가 동일하다 → "$\mathcal{C}_\text{gen}$ 형성"이 새로운 추론 능력을 주지 않는다. (2) Grokked 모델도 새 지식 통합 시 전이 가능성이 제한적이다.

**본 논문과의 관계**: Grokking이 "worthwhile"한가라는 정반대 질문을 던진다. Wang et al.이 "grokking이 implicit reasoning의 유일 경로"라고 주장한다면, He et al.은 "grokking 이후에도 진정한 체계적 추론이 달성되지 않는다"고 반박한다.

**무엇을 얻을 수 있는가**: 
- Grokking의 한계에 대한 균형 잡힌 시각 — Grokking track 논문의 "Related Work"와 "Limitations"에 반드시 인용해야 한다.
- 두 논문이 상충하는 포인트를 TS 도메인에서 직접 검증할 수 있다: TS grokked 모델이 OOD 분포에서 정말 새로운 능력을 보이는가?

---

## Follow-up 3 (후속): Power et al. (2022) "Grokking: Generalization Beyond Overfitting on Small Algorithmic Datasets" (arXiv:2201.02177)

**어떤 논문인가**: Grokking 현상 자체를 처음 명명하고 발표한 원조 논문. DeepMind 연구팀 (Alethea Power, Yuri Burda, Harri Edwards, Igor Babuschkin, Vedant Misra). 모듈 산술, 순열, 집합 연산 등 다양한 알고리즘 태스크에서 grokking을 체계적으로 기록.

**본 논문과의 관계**: Wang et al.이 "grokking이 KG 추론에서도 일어난다"를 보임으로써 Power et al.의 발견을 일반화. 그러나 Power et al.의 태스크(모듈 산술)에선 OOD 문제가 없음 — 모듈 덧셈은 닫힌 구조라 OOD 개념이 다름. 이 대조가 흥미롭다.

**무엇을 얻을 수 있는가**: 
- 다양한 알고리즘 태스크에서 grokking의 기본 조건(데이터 크기, weight decay, 모델 크기 상호작용). TS Grokking track에서 어떤 hyperparameter 범위를 탐색해야 하는지 가이드.
- "언제 grokking이 일어나는가"의 경험적 법칙: 훈련 데이터 크기가 충분히 작고, weight decay가 있고, 충분히 오래 훈련할 때. 이 조건이 TS 예측 설정에서 자연스럽게 충족되는가?
