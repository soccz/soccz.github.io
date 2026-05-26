# 15 Diagrams & Interactive Visualizations

> **🧒 한 그림이 천 마디 가치**: Lyle 2024 의 ELR trajectory, plasticity loss, re-warm cycle visualization.

## 15.1 챕터 한 줄 요약

> **"15+ ASCII 도식 + 3 viz 로 plasticity dynamics, ELR decay, re-warm benefit, NAP surgical reset 의 visual narrative."**

## 15.2 ASCII 도식 — ELR Trajectory

```
ELR OVER TRAINING (paper §3):

   ELR
        │
   0.05 ┤▮▮  (training initial, healthy)
        │ ▮
   0.04 ┤  ▮
        │   ▮▮
   0.03 ┤     ▮▮
        │        ▮▮▮
   0.02 ┤            ▮▮▮▮▮
        │                  ▮▮▮▮▮▮
   0.01 ┤── threshold ─────────▮▮▮▮▮▮▮▮▮▮ (plasticity loss zone)
        │                              ▮▮▮▮▮
   0.005┤                                    ▮▮▮▮▮▮▮ (severe)
        │                                            ▮▮▮▮▮▮▮▮▮
   0.001┤                                                    
        └─────────────────────────────────────────────────► time
        0    50K   100K   150K   200K   300K
        
  Phase 1: high ELR (active learning)
  Phase 2: gradual decay
  Phase 3: below threshold (plasticity loss)
  → Re-warm should trigger here.
```

## 15.3 ASCII 도식 — Re-warm Cycle

```
LR SCHEDULE WITH RE-WARM:

   LR
        │     ╱╲              ╱╲              ╱╲
   3e-3 ┤    ╱  ╲            ╱  ╲            ╱  ╲
        │   ╱    ╲          ╱    ╲          ╱    ╲
   2e-3 ┤  ╱      ╲        ╱      ╲        ╱      ╲
        │ ╱        ╲      ╱        ╲      ╱        ╲
   1e-3 ┤╱          ╲────╱          ╲────╱          ╲───
        │  warmup   decay  warmup   decay  warmup   decay
        └─────────────────────────────────────────────► step
        0   5K  10K  15K  20K  25K  30K  35K  40K

  Each cycle:
    - Warmup: 500 steps (LR boost)
    - Decay: 9500 steps (cosine to base)
    - Total: 10K steps per cycle
  
  → Periodic plasticity restoration.
```

## 15.4 ASCII 도식 — Dormant Neuron Distribution

```
NEURON ACTIVATION MAGNITUDE (after 100K steps):

   Count
        │
   200  ┤▮▮▮▮▮ (dormant: ~150 neurons)
        │▮▮▮▮▮
   150  ┤▮▮▮▮▮ 
        │▮▮▮▮▮▮▮
   100  ┤▮▮▮▮▮▮▮▮
        │▮▮▮▮▮▮▮▮▮▮▮▮ (active: ~250 neurons)
   50   ┤▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮
        │▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮
   0    ┤▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮
        └────────────────────────────────► activation magnitude
        0   0.01  0.05  0.1   0.3   1.0
        
  Dormant zone (< 0.01): ~30% of neurons!
  NAP target: reset these neurons.
```

## 15.5 ASCII 도식 — Plasticity Loss vs Performance

```
CONTINUAL RL (10 sequential Atari tasks):

   Performance
        │
   100% ┤●●●                  
        │   ●●               (without plasticity tools)
   80%  ┤      ●●            
        │         ●●         
   60%  ┤            ●●      
        │               ●    
   40%  ┤                 ●  
        │                   ●
   20%  ┤                    ●●●● (plasticity loss → fail)
        └────────────────────────► task #
        1    3    5    7    9   10
        
  With re-warm + NAP:
   100% ┤●●●●●●●●●●●●●●●●●●●●●●● (preserved)
        
  → Plasticity tool 이 *task transfer* enable.
```

## 15.6 Viz 카탈로그

| viz id | 챕터 | 내용 | 컨트롤 |
|--------|------|------|--------|
| `lyle-elr-trajectory` | 03, 05b, 15 | ELR over training time | re-warm on/off |
| `lyle-rewarm-cycle` | 05c, 14, 15 | LR schedule with cycles | cycle period slider |
| `lyle-dormant-dist` | 05c, 14, 15 | Neuron activation histogram | NAP threshold slider |

## 15.7 자기점검

### 핵심 3 가지

1. **ELR threshold 0.001 의 *empirical 의의*?**
2. **Re-warm cycle 의 *frequency choice*?**
3. **NAP reset 의 *quantitative scale*?**

### 답변

1. **Below 0.001 → empirical plasticity loss zone**. Lyle 의 Atari 실험: ELR 0.001 미만 시 *학습 효율 50% 감소*. Universal 아닌 *task / network 의존* — but *practical guideline*. *Early warning system* 의 threshold.

2. **10K steps 의 sweet spot**. 1K = 너무 잦음 (학습 안 끝남). 100K = 너무 드뭄 (plasticity loss 이미). 10K = *학습 + plasticity 양립*. Empirical default.

3. **30-50% of neurons dormant**. 학습 후 ~30-50% 의 neurons 가 *activation < threshold*. NAP reset 후 *capacity 50% 회복* + *performance maintained* (active 보존). → "*Network 의 effective capacity 가 capacity 의 절반*" 의 *surprising finding*.

---

## 인터랙티브 시각화

```viz:lyle-elr-trajectory:title=paper §3 — ELR Trajectory,caption=Re-warm toggle.
```

```viz:lyle-rewarm-cycle:title=paper §4 — Re-warm LR Schedule,caption=Cycle slider.
```

```viz:lyle-dormant-dist:title=paper §5 — Dormant Neuron Distribution,caption=NAP threshold slider.
```
