# 08_lineage — 이론적 계보

이 논문은 세 개의 독립적 연구 전통이 교차하는 지점에 위치한다: (1) 신경망 해석 가능성(mechanistic interpretability), (2) 시계열 파운데이션 모델(TSFM), (3) 표현 학습(representation learning). 각 전통에서 이 논문의 조상, 병렬, 후계자를 추적한다.

---

## 이론적 조상 (선행 연구)

### 조상 1: Anthropic — Toy Models of Superposition (2022)

**논문**: Elhage et al., "Toy Models of Superposition," Anthropic Technical Report, 2022.

**핵심 기여**: 
- 신경망 뉴런이 "다중 의미성(polysemanticity)"을 갖는다는 수학적 증명: 특징 수가 뉴런 수를 초과할 때 모델은 다수의 특징을 각 뉴런에 중첩(superposition)하여 인코딩한다.
- Sparse Autoencoder가 이 중첩을 분해할 수 있다는 아이디어의 기원.

**이 논문과의 연결**:
- "Dissecting Chronos"가 TSFM에 SAE를 적용한 직접적 동기가 여기서 출발한다.
- Chronos의 d_model=1,024 공간이 실제로는 훨씬 많은 시계열 개념(>1,024개)을 중첩하여 인코딩한다는 가설을 검증한다.
- **차이**: "Toy Models"는 작은 합성 신경망에서 이론적으로 분석한 반면, "Dissecting Chronos"는 710M 파라미터의 실제 TSFM에서 경험적으로 검증한다.

---

### 조상 2: Bricken et al. — Towards Monosemanticity (2023)

**논문**: Bricken et al., "Towards Monosemanticity: Decomposing Language Models With Dictionary Learning," Anthropic Technical Report, 2023.

**핵심 기여**:
- 1층 MLP 언어 모델에 SAE를 적용하여 해석 가능한 특징을 발굴.
- "monosemanticity(단일 의미성)"가 실제로 달성 가능하다는 최초 경험적 증거.
- L1-penalty SAE(Vanilla SAE)를 사용하여 희소 특징을 추출하고, 각 특징에 자연어 레이블을 부여하는 방법론 확립.

**이 논문과의 연결**:
- "temporal-monosemanticity"라는 리포지토리 이름 자체가 Bricken et al.에 대한 직접적 경의다.
- SAE 방법론의 시계열 도메인 이식을 논문 제목과 구성 양쪽에서 명시적으로 표방.
- **차이**: Bricken은 단일 레이어·단일 MLP를 분석했으나, "Dissecting Chronos"는 6개 추출 지점을 비교하여 레이어 간 계층을 최초로 분석.

---

### 조상 3: Marks et al. — Sparse Feature Circuits (2024)

**논문**: Marks et al., "Sparse Feature Circuits: Discovering and Editing Interpretable Causal Graphs in Language Models," arXiv 2403.19647, 2024.

**핵심 기여**:
- SAE로 발굴한 특징들을 회로(circuit)로 연결: 특징 A → 특징 B의 인과 경로 지도 작성.
- 개별 특징의 인과 중요도를 "activation patching"으로 측정하는 방법론.
- 특징 제거(ablation)가 아닌 특징 대체(substitution)로 인과성을 더 정밀하게 검증.

**이 논문과의 연결**:
- "Dissecting Chronos"의 단일 특징 절제(ΔCRPS)는 Marks et al.의 activation patching 방법론을 CRPS 지표에 맞게 적용한 것이다.
- 단, "Dissecting Chronos"는 회로(특징 간 연결)까지는 분석하지 않고 개별 특징의 인과 기여에서 멈춘다 — 이것이 future work로 남는 이유다.

---

### 조상 4: Ansari et al. — Chronos (2024)

**논문**: Ansari et al., "Chronos: Learning the Language of Time Series," TMLR 2024.

**핵심 기여**:
- T5 아키텍처를 시계열에 그대로 적용: 시계열 값을 양자화하여 이산 토큰으로 변환, 언어 모델처럼 next-token prediction.
- 27B 관측치로 사전학습하여 제로샷 예측 달성.
- ETT, M3, M4, Tourism 등 다수 벤치마크에서 경쟁력 있는 성능.

**이 논문과의 연결**:
- 해부 대상이 Chronos-T5-Large다. "Dissecting Chronos"의 전제 자체가 Ansari et al.의 성과물.
- Chronos의 T5 아키텍처를 선택한 이유가 "NLP SAE 연구와 직접 비교 가능"이므로, 이 논문의 의의는 Chronos 논문의 아키텍처 선택에 의해 증폭된다.

---

## 병렬 연구 (동시대 경쟁/보완)

### 병렬 1: Hernandez et al. — Linearity of Relation Encoding in T5 (2024)

NLP 분야에서 T5의 내부 표현이 선형 구조를 가진다는 분석. Chronos도 T5를 사용하므로, 만약 선형성이 TS 도메인에서도 성립한다면 "Dissecting Chronos"의 비선형 SAE 접근법보다 더 단순한 선형 분해가 유효할 수 있다.

**대조점**: "Dissecting Chronos"는 비선형 SAE를 사용하여 더 복잡한 특징을 발굴하려 했지만, 단순 선형 분해와의 성능 비교가 없다.

---

### 병렬 2: Conmy et al. — Towards Automated Circuit Discovery (2023)

**ArXiv**: 2304.14997  
GPT-2에서 자동화된 회로(circuit) 발견 — "Activation Patching"을 체계화하여 NLP 모델 내부의 인과 경로를 자동 탐색.

**대조점**: "Dissecting Chronos"는 회로 수준이 아닌 특징 수준에서 멈췄다. Conmy의 방법론을 Chronos에 적용하면 인코더-디코더 간 정보 전달 회로(크로스-어텐션 경로)를 발굴할 수 있을 것이다.

---

### 병렬 3: Nie et al. — PatchTST (2023)

시계열을 패치(patch)로 분할하여 Transformer로 처리 — ETT에서 강력한 성능. PatchTST의 내부 표현에 같은 SAE 방법론을 적용하면, T5 기반 Chronos와 패치 기반 아키텍처의 특징 계층 차이를 비교할 수 있다. 이 비교가 없어서 결론의 일반성이 제한된다.

---

## 후계 예측 (이 논문이 열어놓은 방향)

### 후계 1: 멀티-TSFM 비교 SAE 연구

**예측**: Chronos, MOIRAI, TimesFM, MOMENT 등 여러 TSFM에 동일 SAE 방법론을 적용하여 아키텍처별 특징 계층을 비교하는 연구.

**왜 나올 것인가**: "Dissecting Chronos"가 단일 모델에 국한된 한계를 인정하며 이를 future work로 남겼다. 3~4개 TSFM에서 "중간 인코더 우위"가 재현된다면 TSFM의 보편적 원리로 격상된다.

**기대 타임라인**: 2026~2027. 현재 TSFM 다양성이 높아 비교 연구 수요가 크다.

---

### 후계 2: SAE 특징 회로 기반 Chronos 개선

**예측**: ΔCRPS가 가장 큰 "치명적 특징들"을 식별하여, 이들을 명시적으로 강화 훈련한 Chronos 변형이 나타날 것이다.

**메커니즘**: feat#4616(레벨 시프트 감지)이 ΔCRPS=38.61을 보이는 것을 역이용 — 이 특징을 잘 포착하도록 미세조정하면 돌발 사건 예측 성능이 향상될 것이라는 가설.

**연결**: "Steering" 방향의 mechanistic interpretability 응용 (cf. NLP에서의 activation steering, representation engineering).

---

### 후계 3: 특징 계층이 다운스트림 도메인 적응에 미치는 영향

**예측**: "최종 인코더의 계절성 특징이 예측에 덜 기여한다"는 발견을 이용, 파인튜닝 시 어떤 레이어를 얼마나 수정해야 하는지의 원칙을 만드는 연구.

**실용적 중요성**: TSFM을 특정 도메인(에너지, 금융, 의료)에 적응시킬 때, 레이어 선택적 fine-tuning (layer-wise learning rate, LoRA rank 배분)의 이론적 근거가 된다.

**예상 형태**: "Which Layers to Fine-Tune in TSFM?" 유형의 실용적 논문으로 2027년경 등장 예상.

---

## 계보 요약도

```
Elhage 2022 (Superposition Theory)
          ↓
Bricken 2023 (Monosemanticity, L1-SAE)     Ansari 2024 (Chronos-T5)
          ↓                    ↘              ↓
   TopK-SAE 변형              Mishra 2026 (Dissecting Chronos)
          ↑                    ↗              ↓
Marks 2024 (Feature Circuits)          후계: 멀티-TSFM SAE
                                            SAE 기반 모델 개선
                                            Fine-tuning 원칙
```

---

*→ 이전: `07_limits.md` | 다음: `09_my_research.md`*
