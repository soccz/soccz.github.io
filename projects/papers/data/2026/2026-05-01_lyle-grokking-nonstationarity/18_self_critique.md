# 18 Self-Critique

> **🧒 본 챕터는 "자기 비판"**: 본 deep dive missing pieces.

## 18.1 챕터 한 줄 요약

> **"4 약점: (1) ELR threshold 의 task-dependence, (2) NAP reset 의 *new neuron 학습 시간*, (3) Re-warm cycle 의 hyperparameter sensitivity, (4) RL-centric evaluation 의 generalizability 의문."**

## 18.2 약점 1 — ELR Threshold Task-Dependence

ELR < 0.001 = "plasticity loss" — Atari 실험 에서 *empirical default*. 다른 task (LLM, robotics) 의 *optimal threshold* 미공개. *Task-specific tuning* 필요 — paper 미강조.

## 18.3 약점 2 — NAP Reset 의 *Learning Time*

NAP = dormant neurons 재초기화. 새 random initialization → *new learning 필요*. *Immediate post-NAP* 에 performance dip 가능 — paper 의 *recovery curve* 미공개.

## 18.4 약점 3 — Re-warm Cycle Sensitivity

Cycle period 10K = Atari 기준. *training dynamics, task structure 의존*. LLM 에서는 1M-10M steps 적합 가능 — *task-specific tuning*.

## 18.5 약점 4 — RL-Centric Evaluation

Paper 의 evaluation = Atari continual RL. *Vision, NLP, robotics* 에서의 *systematic study* 미충분. *Generalization claim* 의 *empirical support* limited.

## 18.6 자기점검

### 핵심 3 가지

1. **본 deep dive 의 가장 critical missing piece?**
2. **NAP 의 *short-term performance dip* 의 production impact?**
3. **RL-centric evaluation 의 *cross-domain generalization* 평가?**

### 답변

1. **Cross-domain validation 부재**. Atari 외 *vision, NLP, robotics* 에서의 *systematic experiments* 부재. 본 paper 의 *general plasticity claim* 의 *empirical support* 가 *RL only*. Future work: vision continual learning, LLM continual pre-training, robotics streaming learning 의 *full ablation*. → *Generalization claim* 의 *epistemic uncertainty*.

2. **Short-term degradation 가능**. NAP 직후 *new random neurons* = "*learning curve restart*". ~1000-5000 steps 동안 *performance dip* 가능. *Production critical system* (real-time RL) 에서 *acceptable downtime* 의문. Paper 의 *recovery curve* 정확 미공개 — *engineering question*.

3. **Atari 에서 100% transferable 아닐 가능성**. Atari = small action space, discrete time, dense reward. Vision continual = large output space, supervised. NLP continual = sequence labels, structured outputs. Robotics = continuous control, sparse reward. *Each domain 의 unique plasticity dynamics* — Lyle methods 의 *adjustment 필요* 가능. → *Cross-domain replication study* 가 *open research direction*.
