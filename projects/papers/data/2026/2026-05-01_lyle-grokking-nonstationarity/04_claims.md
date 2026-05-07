# 04 — 핵심 Claim 해체

> **배경 사다리**: 이 절을 이해하려면 ① '레이어 정규화(Layer Normalization)'가 각 층의 출력을 평균 0, 분산 1로 맞추는 연산이라는 것, ② '스케일-불변(scale-invariant)'이란 입력을 상수 배 해도 출력이 변하지 않는 성질이라는 것을 알면 된다. 나머지는 아래에서 차근차근 설명한다.

---

## Claim 1 — ELR 붕괴가 지연된 일반화(Grokking)의 핵심 메커니즘이다

### 주장
LayerNorm이 있는 네트워크에서 훈련이 진행될수록 파라미터 노름이 커지고, 이로 인해 **유효학습률(ELR)이 점진적으로 붕괴**한다. 이 붕괴가 네트워크를 '게으른 regime'에 가두어 일반화를 지연시킨다. Weight decay가 grokking을 가속하는 이유는 ELR을 높게 유지하기 때문이다.

### 증거
- NeurIPS 2024 NaP 논문(Lyle et al. 2024, arXiv:2407.01800)의 이론적 분석: 레이어 노름이 있는 네트워크에서 파라미터 노름 성장이 ELR 붕괴와 정확히 동치임을 수학적으로 보임.
- 이 논문(2507.20057)의 Figure: weight decay를 없애면 grokking이 발생하지 않거나 훨씬 늦어지는 반면, ELR re-warming을 적용하면 weight decay 없이도 grokking이 빠르게 달성됨.

### 숨은 전제
(a) 실험 대상 네트워크가 LayerNorm 또는 이와 유사한 정규화 층을 사용한다는 가정 — 정규화 없는 순수 MLP에서는 ELR 정의 자체가 달라짐.  
(b) 파라미터 노름이 "자연히" 증가한다는 가정 — L2 정규화가 있으면 다를 수 있음.

### 쉬운 말 풀이
수도꼭지에서 물이 나온다고 상상해봐. 학습률 $\eta$는 수압이고, 파라미터 노름 $\|\theta\|$는 호스 길이야. 호스가 길어질수록(노름이 커질수록) 수압이 같아도 수압이 점점 약해져. 결국 거의 물이 안 나오는 상태가 되는데, 이때 네트워크는 더 이상 새 표현을 배우지 못하고 기존 것만 쓴다. Weight decay는 호스 길이를 강제로 짧게 유지해준 거고, ELR re-warming은 주기적으로 호스를 짧은 걸로 바꿔주는 거다.

---

## Claim 2 — Grokking, Primacy Bias, Plasticity Loss는 구조적으로 동일하다

### 주장
세 현상은 모두 **같은 임상적 패턴**을 보인다: (1) 초기에는 좋은 성능, (2) 이후 새로운 태스크나 분포 변화에 적응 실패, (3) 충분히 강한 최적화 개입(weight decay, 리셋, ELR 재가열) 후 성능 회복. 이 구조적 동일성은 공통 메커니즘을 시사한다.

### 증거
- Grokking: 훈련 정확도 100% 도달 후 테스트 정확도 한참 뒤처짐 → weight decay 후 갑자기 일반화.
- Primacy Bias(Nikishin 2022): 초기 RL 경험에 과적합 → 주기적 파라미터 리셋 후 회복.
- Plasticity Loss(Kumar 2021; Lyle 2023): 장기 훈련 후 새 태스크 학습 속도 감소 → 정규화/리셋 후 회복.
- 이 논문: 동일한 ELR re-warming이 세 설정 모두에서 효과를 보임.

### 숨은 전제
(a) 세 실험 설정이 "충분히 비슷한" 네트워크 아키텍처와 최적화기를 사용한다는 가정.  
(b) Primacy Bias의 원인이 ELR 붕괴 외에 다른 요소(예: 경험 재현 버퍼 편향)가 없다는 단순화 — 실제로 RL에는 다른 요인도 많다.

### 쉬운 말 풀이
어떤 수영선수가 처음에는 평영만 연습했어. 나중에 자유형을 배우려 하니 평영 근육이 방해가 돼. 하지만 충분히 훈련하면 결국 자유형도 잘해. 이게 grokking이야. 이 논문은 이 패턴이 RL 에이전트나 계속 새 임무를 맡는 로봇에서도 똑같이 나타난다고 말하는 거야.

---

## Claim 3 — ELR Re-warming은 weight decay 없이도 grokking을 유발한다

### 주장
전통적인 grokking 설정에서 weight decay를 제거하고 ELR re-warming만 적용해도 일반화가 달성된다. 이것은 weight decay가 grokking을 촉진하는 이유가 **ELR 유지** 때문이었음을 역으로 확인한다.

### 증거
Ablation 실험: (a) weight decay O, ELR re-warming X → grokking 느림; (b) weight decay X, ELR re-warming O → grokking 빠름; (c) 둘 다 O → 가장 빠름. 이 비교가 논문의 핵심 실험.

### 숨은 전제
Weight decay의 유일한 역할이 ELR 유지라는 가정 — 실제로 weight decay는 implicit regularization 효과(flat minima 유도, generalization 이론과 연결)도 있어, ELR 이외의 경로로도 일반화에 기여할 수 있다.

### 쉬운 말 풀이
마치 "사과를 먹으면 건강해진다"는 말을 들었는데, 실험해보니 사과의 어떤 성분(비타민C)이 핵심이었다는 걸 알게 된 것과 같다. 비타민C만 따로 먹어도 같은 효과가 난다면, 진짜 원인은 비타민C다. 여기서 weight decay = 사과, ELR 유지 = 비타민C다.

---

## Claim 4 — ELR Re-warming은 비정상 RL에서 소성(Plasticity)을 보존한다

### 주장
비정상성(nonstationarity)이 있는 RL 환경 — 보상 함수나 환경 역학이 바뀌는 설정 — 에서 ELR re-warming을 적용하면 주기적 완전 리셋(Nikishin 2022)보다 적은 파라미터 손실로 비슷하거나 더 좋은 소성 유지 효과를 얻는다.

### 증거
벤치마크 비교: 완전 리셋(=학습한 모든 내용 폐기), NaP(ELR 일정), ELR re-warming(ELR 주기적 증가)를 Atari류 환경에서 비교. ELR re-warming이 완전 리셋 없이도 competitive한 성능을 보임.

### 숨은 전제
(a) 실험한 RL 환경이 nonstationarity의 "전형적인" 구조를 대표한다는 가정.  
(b) ELR 재가열 주기 $T$가 환경 변화 주기와 잘 맞게 설정됐다는 가정 — $T$ 선택이 민감할 수 있음.

### 쉬운 말 풀이
새 언어를 배울 때, 예전 언어 기억을 완전히 지우면(완전 리셋) 새 언어는 빨리 배우지만 모국어를 잃는다. ELR re-warming은 모국어를 유지하면서 새 언어도 배울 수 있는 '뇌 운동'에 비유할 수 있다.
