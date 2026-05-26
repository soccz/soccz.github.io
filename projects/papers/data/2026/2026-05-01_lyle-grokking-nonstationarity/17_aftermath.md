# 17 2 년 Aftermath — Plasticity Era (2024-2026)

> **🧒 본 챕터는 "그 후의 이야기"**: Lyle 2024 발표 후 2년간 *plasticity research* 의 진화.

## 17.1 챕터 한 줄 요약

> **"ICML 2024 의 Lyle plasticity work 가 *continual learning era* trigger. 2024-2026 의 *RL foundation model plasticity*, *streaming learning industry adoption*, *plasticity-aware foundation models* 의 확장."**

## 17.2 Timeline (2024-2026)

```
2024.07: Lyle et al. ICML 2024 ★
2024.10: DeepMind RL foundation model plasticity
2025.03: Industrial robotics streaming learning
2025.07: Plasticity-aware LLM continual pre-training
2026.05: 본 deep dive 작성
```

## 17.3 Phase 1 — RL Foundation Plasticity

```
DeepMind 의 후속:
  - RL foundation model + Lyle plasticity tools
  - Gato 같은 multi-task agent에 적용
  - "Plasticity-aware foundation"
```

## 17.4 Phase 2 — Industrial Streaming Learning

```
Robotics, autonomous driving:
  - Online learning critical
  - Plasticity loss 가 deployment 한계
  - Lyle methods 도입
```

## 17.5 Phase 3 — LLM Continual Pre-training

```
LLM 의 incremental knowledge update:
  - Pre-training 후 new data 추가
  - Plasticity 유지 필요
  - Re-warm + NAP 적용
```

## 17.6 paradigm shifts

### Shift 1: "Static capacity" → "Dynamic plasticity"
### Shift 2: "Ad hoc continual learning" → "Principled ELR monitoring"
### Shift 3: "Pre-train + fix" → "Continual updating"

## 17.7 자기점검

### 핵심 3 가지

1. **Lyle 의 *2년 후 paradigm shift*?**
2. **RL foundation model 에서 plasticity 의 *critical role*?**
3. **LLM continual pre-training 의 *plasticity application*?**

### 답변

1. **"Dynamic plasticity" paradigm**. Pre-Lyle: *static network capacity* 가정. Post-Lyle: *plasticity 가 trainable + maintainable*. → "*Network 의 effective capacity 는 dynamic*" 의 *empirical recognition*. Continual learning era 의 *foundational shift*.

2. **Foundation 의 *post-pretrain plasticity* enabler**. RL foundation = massive pre-training → 새 task fine-tune. Plasticity loss 가 *fine-tuning catastrophe*. Lyle methods = "*post-pretrain plasticity 유지*" 의 *practical methodology* — RL foundation era 의 *essential tool*.

3. **LLM 의 knowledge update 의 *plasticity 제약***. Current LLM = static (pre-train fixed). Future LLM = continual update (new knowledge). Plasticity loss 가 *update bottleneck*. Lyle methods 도입 시 *clean continual update* 가능 — *2025-2026 LLM 의 active research direction*.
