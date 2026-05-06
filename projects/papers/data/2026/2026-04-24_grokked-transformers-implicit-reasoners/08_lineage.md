# 08 — 이론적 계보

> **배경 사다리**: 이 섹션은 이 논문이 어떤 선행 연구에서 왔고, 어떤 경쟁 연구와 맞닥뜨렸으며, 어떤 후속 연구를 낳을지를 다룬다.

---

## 이론적 조상 (직접 계보)

### 조상 1: Power et al. (2022) "Grokking: Generalization Beyond Overfitting on Small Algorithmic Datasets" (arXiv:2201.02177)

**이 논문과의 직접 연결선**: Grokking 현상 자체의 발견자. 모듈 덧셈 $(a+b) \mod p$에서 훈련 정확도 100% 후 수만 스텝이 지나야 검증 정확도가 오르는 현상을 처음 명명하고 문서화.

본 논문은 이 발견을 **KG 추론 태스크**로 확장하며, "grokking이 알고리즘 태스크를 넘어 지식 조합에도 나타난다"는 보편성 주장의 근거로 삼는다. 또한 모듈 산술의 "닫힌 알고리즘" 구조와 달리, KG 추론에서 grokking이 OOD 실패를 동반한다는 차이를 발견 — Power et al.의 발견을 정교화.

### 조상 2: Nanda et al. (2023) "Progress measures for grokking via mechanistic interpretability" (ICLR 2023, arXiv:2301.05217)

**이 논문과의 직접 연결선**: Grokking의 메커니즘을 처음 해부. 모듈 덧셈에서 DFT 기반 "Fourier 회로"가 grokking의 실체임을 역공학. 훈련을 세 단계(memorization → circuit formation → cleanup)로 구분.

본 논문은 이 세 단계 구조를 KG 추론에 적용하며, "회로 형성"이 어느 레이어에서 어떻게 일어나는지를 logit lens·causal tracing으로 추적한다. 단, Nanda et al.의 Fourier 회로는 모듈 산술 특화지만, 본 논문의 $\mathcal{C}_\text{gen}$는 "two-hop 조합" 알고리즘으로 성격이 다르다.

### 조상 3: Lewis et al. (2020) "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (NeurIPS 2020)

**이 논문과의 직접 연결선**: RAG의 원류. Non-parametric memory(외부 검색)로 지식 집약적 태스크를 푸는 접근. 본 논문은 RAG가 복잡한 암묵적 추론에서 실패하는 상황을 보임으로써, parametric memory(grokking으로 획득한 내재 추론)의 차별적 가치를 부각시킨다.

---

## 평행 연구 (비슷한 시기, 다른 접근)

### 평행 1: "Unifying Grokking and Double Descent" (다양한 저자, 2023~)

**비교**: Double descent (모델 복잡도-일반화 비단조 관계)와 grokking을 같은 현상의 두 측면으로 통합하려는 이론 연구. 본 논문이 "두 회로의 경쟁" 프레임을 경험적으로 제시한다면, 이 계열은 grokking을 손실 지형(loss landscape)과 암묵적 편향(implicit bias)의 이론적 틀로 설명한다.

**왜 본 논문이 이긴 측면**: 메커니즘 분석의 구체성. Logit lens·causal tracing으로 "어느 레이어에서 무슨 일이 일어나는지"를 보여주는 경험적 해상도가 높다.

**왜 평행 연구가 더 나은 측면**: 이론적 예측력. 어떤 조건에서 grokking이 일어나는지를 수식으로 예측 가능.

### 평행 2: "Is Grokking Worthwhile?" (He et al., 2026, arXiv:2601.09049)

**비교**: 본 논문의 직접적 비판자. "Grokked 모델이 non-grokked 모델보다 downstream task에서 우수하지 않다", "일반화 회로의 전이 가능성이 제한적이다"고 주장. IND 추론에서 non-grokked와 grokked 모델의 inference path가 동일하다는 발견은 본 논문의 "$\mathcal{C}_\text{gen}$ 형성"을 의문시한다.

**관계**: 본 논문(2024) → He et al. (2026)로의 비판적 계승. 두 논문을 함께 읽어야 grokking의 실제 가치에 대한 균형 잡힌 시각을 가질 수 있다.

---

## 후손 예측 (이 논문에서 파생될 수 있는 연구)

### 후손 1: 실제 LLM에서의 Grokking 탐색

대형 LLM(LLaMA, Mistral 등)을 특정 추론 태스크에 파인튜닝할 때 grokking이 일어나는가? 일어난다면 어느 레이어에서 same pattern이 보이는가? 이 질문에 답하는 연구가 자연스러운 후속이다.

방향: logit lens·causal tracing을 LLaMA-7B에 적용, 파인튜닝 중 레이어별 representation 변화 추적.

### 후손 2: Grokking 가속 방법론

$\phi$ 조절·weight decay 최적화 외에, grokking을 더 빠르게/안정적으로 유도하는 방법 — curriculum learning, intermediate supervision, data augmentation — 에 대한 체계적 연구.

### 후손 3: Time Series에서의 Grokking (= 사용자 Grokking track)

시계열 예측 트랜스포머에서도 "훈련 loss 수렴 후 grokking 방식의 일반화 도약"이 일어나는가? 어느 레이어에서, 어떤 패턴이 형성되는가? 본 논문의 logit lens·causal tracing 방법론을 PatchTST·iTransformer에 직접 적용 가능.
