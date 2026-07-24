# 9. 사고 확장 (b) — Follow-up 논문 3편

선행 1 / 경쟁 1 / 후속 1 로 배치한다.

## 선행 — Elhage et al. 2022, "Toy Models of Superposition" (Anthropic, transformer-circuits.pub)

- **어떤 논문인가**: 특징 수 > 뉴런 수일 때 신경망이 특징을 과완비 방향에 겹쳐 싣는 **중첩(superposition)** 을, 통제된 장난감 모델에서 상(phase) 다이어그램·기하(반사·오각형 등)로 실증한 원전.
- **본 논문과의 관계**: 본 논문의 **문제 정의와 존재 이유**를 제공. Elhage 가 "중첩이 있다"를 보였고, 본 논문이 "그럼 희소 사전으로 되찾을 수 있다"로 답한다.
- **무엇을 얻나**: 중첩의 **기하적 조건**(언제 특징이 겹치고 언제 안 겹치나)을 알면, TS 트랜스포머에서 SAE 가 성공/실패할 지점을 **선험적으로 예측**할 수 있다. 특히 "특징 중요도 불균형 → 중요 특징은 전용 방향, 나머지는 겹침"이라는 결과는 시계열의 "주기 성분(중요) vs 잡음(겹침)" 분리 예측에 쓸 만하다.

## 경쟁 — Bricken et al. 2023, "Towards Monosemanticity" (Anthropic) [이미 커버 2026-05-22]

- **어떤 논문인가**: 거의 동시기에 **독립적으로** SAE 로 단의미 특징을 추출한 Anthropic 판. 1-층 transformer 의 MLP 에 집중, human/AutoInterp/logit/case-study 4-line 증거로 특징을 카탈로그화.
- **본 논문과의 관계**: **평행 경쟁작이자 상호 검증**. 본 논문은 더 큰 모델(Pythia-410M)·잔차 스트림·**인과(IOI)** 검증이 강점, Bricken 은 특징 카탈로그·평가 정교함이 강점. 두 독립 재현이 "SAE=표준"을 함께 확립.
- **무엇을 얻나**: Bricken 의 **4-line 증거 프로토콜**(특히 case study·logit weight 분석)을 본 논문의 인과 개입과 **결합**하면, 내 TS 실험에서 "특징이 해석 가능(Bricken식) + 인과적(Cunningham식)"을 이중으로 닫는 평가 설계를 만들 수 있다.

## 후속 — Gao et al. 2024, "Scaling and evaluating sparse autoencoders" (OpenAI, arXiv:2406.04093)

- **어떤 논문인가**: 본 논문의 두 약점을 정면 공략. **TopK 오토인코더**($z=\mathrm{TopK}(W_\text{enc}(x-b_\text{pre}))$, §2.3 Eq.2)로 희소를 직접 제어해 $\alpha$ knee 문제·shrinkage 를 우회하고, dead latent 를 억제하며, GPT-4 활성에 **1600만 latent SAE 를 400억 토큰**으로 학습해 깔끔한 스케일링 법칙(loss ∝ size·sparsity)과 새 평가지표(가설 특징 복원·설명가능성·downstream 희소성)를 제시.
- **본 논문과의 관계**: 본 논문이 남긴 "다음 문제"(스케일·$\alpha$ 선택·dead feature)의 **직계 답**. 본 논문 = 개념·인과 증명, Gao = 공학·스케일 완성.
- **무엇을 얻나**: 실제로 TS 트랜스포머에 SAE 를 붙일 때 **TopK 를 기본값**으로 삼을 근거. Mishra 2026(Chronos-SAE, 커버됨)이 이미 TopK-SAE 를 시계열에 썼으므로, 본 논문(원리) → Gao(TopK) → Mishra(TS 적용)의 3단을 내 방법론 섹션의 **표준 인용 사슬**로 고정한다.

---

### 세 편을 잇는 한 줄

> **Elhage(왜 특징이 겹치나) → 본 논문 & Bricken(겹친 걸 어떻게 푸나) → Gao(대규모로 안정적으로 푸나)** — 이 사슬을 그대로 TS 도메인에 이식하는 것이 내 연구의 방법론 골격이 된다.
