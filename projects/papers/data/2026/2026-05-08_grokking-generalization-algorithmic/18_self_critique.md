# 18 Self-Critique

> **🧒 본 챕터는 "자기 비판"**: 본 deep dive missing pieces.

## 18.1 챕터 한 줄 요약

> **"4 약점: (1) Modular arithmetic 의 *real ML generalization 의문*, (2) Hyperparameter 의 razor-edge sensitivity 위험, (3) Computation cost (1-10M steps) 의 학생 접근성, (4) Phenomenon-only paper 의 mechanism 부재."**

## 18.2 약점 1 — Modular Arithmetic 의 Real ML 적용 의문

Modular arithmetic = synthetic toy. *Real ML data* (image, text, multimodal) 에서 *동일 grokking phenomenon* 발견 미증명. Wang 2024 가 *partial transfer* 증명하지만 *fully general* 인지 의문.

## 18.3 약점 2 — Hyperparameter Razor-Edge Sensitivity

WD=1e-2 + Dropout 0 + train_fraction 0.3 = razor-edge configuration. *Real-world ML production* 의 *robustness* 어려움. Power 2022 의 *specific config* 의존이 *industrial deployment* 의 *open question*.

## 18.4 약점 3 — Computational Cost

1-10M training steps = *24h-10day* on V100. *학부생 budget* 으로 충분하지만 *full ablation* (4 ops × 5 WD × ...) 시 *수천 GPU-hour*. 본 deep dive 가 *full reproduction cost 분석* 부족.

## 18.5 약점 4 — Phenomenon-Only Paper

Power 2022 = *empirical phenomenon* 만. *Mechanism* 미공개 — Nanda 2023 까지 기다림. Paper 자체의 *contribution 한계* — *discovery without explanation*. 본 deep dive 가 *Power 의 limitation* 명시 안 함.

## 18.6 자기점검

### 핵심 3 가지

1. **본 deep dive 의 *가장 critical missing piece*?**
2. **Phenomenon-only paper 의 *epistemic value*?**
3. **Razor-edge hyperparameter 의 *production deployment risk*?**

### 답변

1. **Real ML 의 *grokking universality* 의 *empirical 미입증***. Power 2022 = modular toy. Wang 2024 = composition/comparison tasks (still synthetic). *Image classification, NLP, multimodal* 에서 *direct grokking* 의 *systematic study* 부재. → "*Grokking 이 toy-only* 가능성" 의 *open question*. 본 deep dive 가 *전제 가정 (universal applicability)* — *empirical caveat 부족*.

2. **Discovery > Explanation 의 priority**. Power 2022 의 *phenomenon-only* contribution = 일견 *limited*. 하지만 *discovery* 가 *후속 모든 research 의 motivation* — *epistemic priority*. *Without phenomenon discovery*, Nanda/Wang/Lyle 모두 *불가능*. → "*Right question identification*" 의 *priceless value*. *Mechanism* 은 *후속 contribution*.

3. **Production 의 *robust configuration* 필요**. Power 2022 의 WD=1e-2, Dropout 0, fraction 0.3 = *specific config*. Production ML 의 *hyperparameter robustness* 요구. *Razor-edge sensitivity* = *production deployment risk*. → 후속 paper (Liu 2023 omni grokking, Lyle plasticity) 가 *broader hyperparameter range* 의 grokking 입증 — *partial mitigation*. 그러나 *fully robust solution* 미존재.
