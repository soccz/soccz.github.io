# 6. 가정·한계·반박

> 어떤 *조건이 깨질 때* 본 논문의 결론이 무너지는가. 사용자가 자기 연구로 옮길 때 반드시 고려해야 할 부분.

## 6.1 명시된 가정 (논문이 대놓고 말한 것)

1. **Algorithmic task 에 한정**: 본 논문은 modular arithmetic — algebraic 구조가 명확한 task — 에서 회로가 *closed form* 임을 입증. *비algorithmic* task (NLP, vision, TS) 로의 일반화는 *향후 연구* 로 미룸.
2. **Single-layer architecture**: 1-layer transformer 위 분석. 2-layer 이상의 회로 *구성성* 은 다루지 않음. ([Lieberum 2023, Tracr] 같은 후속 연구로 이어짐)
3. **Weight decay 의 implicit bias 가 dominant**: weight decay 가 sparse Fourier 해를 favor 한다는 가설. 다른 정규화 (dropout, gradient noise 등) 의 효과는 분리 보고하지 않음.
4. **Cross-entropy loss + AdamW**: 다른 loss / optimizer 조합에서 동일 현상 보장 안 함.

## 6.2 암묵적 가정 (말 안 했지만 깔려 있는 것)

### 암묵 1. *회로 가설* 이 사전에 알려져 있어야 한다

Progress measure ($\mathcal{L}_{\text{res}}$, $\mathcal{L}_{\text{exc}}$) 는 모두 $K$ — 학습 종료 후 발견된 5 개 frequency 집합 — 를 *입력으로 받는다*. 즉:

- 학습 trajectory 를 *post-hoc 으로 재해석* 하는 도구이지, *실시간으로 회로를 발견하는* 도구가 아님.
- 학습 도중에 회로 가설이 없는 새 task 에서는, 학습 trajectory 의 어느 시점에 progress measure 를 계산할지 알 길이 없음.

**왜 이게 한계인가**: 본 논문이 mech interp 의 *general method* 로 보이지만, 실제로는 *회로를 알아낸 task 에 대한 사후 측정 도구* — 즉 *회로 발견 자체* 의 방법론이 아님. 회로 발견은 별도 paper (e.g., ACDC, Conmy 2023) 의 영역.

### 암묵 2. *연속 trajectory* 의 단조성이 *유일한 회로* 를 의미한다

본 논문은 progress measure 가 단조 변화함을 보였다. 그런데 단조성이 *single circuit* 의 progressive formation 을 의미하는가? 

대안 가설: *여러 회로 (5개 frequency, 또는 더 많은 frequency 조합)* 가 *시간 차이* 를 두고 형성 / 소멸. 일부 frequency 는 일찍 형성됐다가 학습 후반에 *제거* 되고, 다른 frequency 가 들어옴 — *frequency hopping*. 단순한 단조성 측정으로는 이걸 못 잡음.

**후속 연구 (Doshi et al. 2024)** 가 multi-task grokking 에서 frequency hopping 을 부분 보고. Nanda 본 논문의 깔끔한 단조 곡선은 *single task 의 luck* 일 수 있음.

### 암묵 3. *Train data 가 회로를 충분히 cover* 한다

Train fraction $\rho = 0.3$ 이 회로의 모든 frequency 를 학습할 수 있을 만큼 다양한 $(a, b)$ 쌍을 포함한다고 가정. 만약 train set 이 *한쪽으로 biased* (예: $a < 30$ 만 포함) 면 회로가 그 부분만 학습 → grokking 동학이 다르게 나타남. 본 논문은 random split 이라 이 가정이 자동 만족.

### 암묵 4. *$|K|$ 가 작다* — 회로의 sparsity

5 개 frequency 라는 결과는 *큰 weight decay 의 implicit bias* 의 결과. weight decay 가 작으면 $|K|$ 가 커지면서 (e.g., 20 개) progress measure 의 *해석* 이 변함 — sparse 가 아니라 일종의 dictionary 표현이 됨.

## 6.3 반박 가능한 지점

### 반박 1: "Cleanup phase 의 지연" 은 단지 *AdamW 의 weight decay schedule artifact* 일 수 있다

**핵심 주장**: AdamW 는 effective learning rate 를 layer-wise 다르게 적용. memorization 가중치 (high-norm) 와 회로 가중치 (low-norm) 사이의 cleanup 시간 차이는 *AdamW 의 specific dynamics* 에서 나오는 것. 다른 optimizer 에서는 cleanup 이 *정확히 같은 비대칭* 을 갖지 않을 수 있다 — 따라서 grokking 의 "수직 phase transition" 도 AdamW 특이.

**검증 실험**: 
- (a) SGD + L2 reg 으로 같은 task 학습. 회로는 형성되지만 grokking 의 *수직성* 이 약해짐을 예측. 
- (b) Lion optimizer 로 학습. cleanup 동학이 다르게 나타날 것.
- 두 결과가 본 논문 동학과 *시간 상수* 면에서 다르면 → AdamW dependency 입증.

### 반박 2: Progress measure 는 *post-hoc projection* 일 뿐, *학습 동학의 인과* 가 아니다

**핵심 주장**: $\mathcal{L}_{\text{res}}, \mathcal{L}_{\text{exc}}$ 는 *학습 종료 후* 발견된 $K$ 로 계산. 학습 trajectory 위에서 $K$ 를 *input* 으로 받는 측정은 *순환 정의* 에 가깝다 — "학습 끝에 도달할 회로의 좌표계로 학습을 측정" — 그래서 단조성이 보이는 게 *trivial* 일 수 있다.

**검증 실험**:
- *학습 도중* (e.g., 5k step) 의 모델에서 $K_{5k}$ 를 추정. 그 $K_{5k}$ 로 *전체 trajectory* 의 progress measure 계산. 학습 종료 후 $K$ 와 다른 trajectory 가 나오는가?
- 만약 두 measure 가 다르면 — *post-hoc 의존성* 이 강함. 같다면 — circuit 이 학습 처음부터 *고정된 frequency* 로 형성됨.
- Doshi 2024 가 부분 보고: frequency 가 *학습 도중 변할 수 있다*. 이는 본 논문의 결론을 약화.

### 반박 3: 결론은 *modular addition 의 algebraic 정렬* 에 의존, *generic learning dynamics* 가 아니다

**핵심 주장**: 회로의 깔끔함 + progress measure 의 정합성은 cyclic group character theory 가 transformer architecture 와 정렬한 결과. *비algebraic* task (예: TS forecasting, language modeling) 에서는 (a) 회로가 단일 closed-form 으로 닫히지 않고, (b) progress measure 의 정의 자체가 모호. 즉 본 논문은 *grokking 의 일반 이론* 이 아닌, *grokking 이 algebraic task 위에서 깔끔히 분해되는 example* 일 뿐이다.

**검증 실험**: 
- TS Transformer 에 grokking 이 발생하는지 (Nazaret 2024, Lyle 2025 가 부분 보고). 만약 발생한다면 그 회로는 어떻게 생겼는가? Fourier-sparse 가 아닌 *다른* 구조일 수 있음.
- 사용자의 P2 logistic 4-layer 실험이 정확히 이 question 의 instance.

## 6.4 재현성 평가

- **코드 / 데이터 공개**: ✅. Colab 노트북 + 비공식 GitHub repo 다수.
- **논문에 안 나온 디테일**: progress measure 의 *precise implementation* (특히 Fourier basis 의 normalization, $K$ 결정 algorithm 의 정확한 cutoff) 가 publication 본문보다 *부록 / 코드* 에 있음. 본문 차단 상태로 정확히 확인 불가.
- **분산 보고**: 5–10 random seed 의 분포 보고됨. 회로 형태 (sparse Fourier) 는 *보편적*, 구체적 frequency 만 seed 의존. 이 robustness 는 강한 결과.
- **Plot 의 log-scale**: log-log step axis 라 phase boundary 가 *시각적으로 명확*. linear scale 이었으면 cleanup phase 가 *너무 짧아* 다른 phase 와 구분 어려움. 이 시각화 선택 자체가 논문의 narrative 에 기여.

## 6.5 본 해체 자체의 한계 (정직한 고지)

본 해체는 arXiv 직접 접근이 차단된 상태에서 작성됐다. 따라서:

- 정확한 figure 번호 / 수치 / hyperparameter 가 *기억 + 후속 연구 인용* 에 의존.
- Progress measure 의 *exact 수식 정의* (특히 $\Pi_K$ 의 normalization, 어떤 weight matrix 의 Gini 를 측정했는지) 는 본 논문 원문 검토가 필요.
- 본 논문의 ablation 표 / 부록 figure 의 *세부 수치* 는 미확인.

원문 접근이 가능해지면 본 해체의 §5–§6 부분을 *검증/수정* 할 것. 핵심 아이디어 (3-phase 동학 + Fourier circuit + 세 progress measure) 는 본 해체에서 정확히 capture 된 것으로 판단되지만, *세부 수치* 차이는 가능.
