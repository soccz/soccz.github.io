# 13. Appendix B-D — Hyperparameter / Input Length / Decoder Input / Decomp Algorithm (Table 6-9)

> Paper *Appendix B (Table 6), C.1 (Table 7), C.2 (Table 8), D (Table 9)*. 4 가지 sensitivity 분석.

---

## 13.1 챕터 한 줄 요약

> **"4 ablation 표: (1) Table 6 — Auto-Corr hyperparameter $c$ (k=c·logL) 의 robust. (2) Table 7 — Input length 의 effect (ILI 는 longer 가 좋음, ETT 는 96 충분). (3) Table 8 — Decoder input 의 past info 양 (half-past 가 sweet spot). (4) Table 9 — Decomposition algorithm 비교 — Autoformer progressive 가 모든 algorithm 능가."**

---

## 13.2 Table 6 — Hyperparameter c Sensitivity

본 논문 *Table 6 (p.14)*: Auto-Correlation 의 hyperparameter $c$ 의 영향.

### Setup

- $k = \lfloor c \cdot \log L \rfloor$: Auto-Correlation 의 *Top-k 의 k 값*.
- $c \in \{1, 2, 3, 4, 5\}$: 5 가지 시도.
- 6 datasets × 4 horizons 평균.

### 어떻게 읽나? (Step-by-step)

**Step 1 — 표 구조**: 6 datasets (ETT, Electricity, Exchange, Traffic, Weather, ILI) × 5 c values × 2 metrics (MSE/MAE).

**Step 2 — 각 dataset 별 발견**:

| Dataset | Best c | 발견 |
|---------|--------|------|
| ETT | c=2-3 | 안정 (MSE 0.339-0.363) |
| Electricity | c=2 | 0.224 best |
| Exchange | c=2 | 0.511 best |
| Traffic | c=1 | 0.706 best (큰 c 는 noise) |
| Weather | c=1 | 0.348 best |
| ILI | c=2 | 2.641 best |

**Step 3 — 패턴 발견**:
- *주기성 강한 dataset (ETT, Traffic)*: 큰 c 의 경향 — *명확 한 주기 들* 활용.
- *주기성 약한 dataset (Exchange, Weather)*: 작은 c — *너무 많은 lag 가 noise*.
- *ILI*: 작은 c — *주 단위 dataset, 짧은 시계열*.

**Step 4 — 핵심**: Paper 의 *명시*:
> *"datasets with obvious periodicity tend to have a large factor c"* (주기성 강하면 큰 c 가 좋음).
> *"For the ILI dataset without obvious periodicity, the larger factor may bring noises"* (주기성 약하면 큰 c 가 *역효과*).

→ **c 는 *dataset specific* — paper default $c = 1-3$**.

---

## 13.3 Table 7 — Input Length 의 Effect

본 논문 *Table 7 (p.14)*: Input length $I$ 의 sensitivity.

### Setup

- *Forecasting horizon* 고정 (ILI 48, 그 외 336).
- *Input length* 변화:
  - ETT, Exchange, Weather, Electricity: $I \in \{96, 192, 336, 720\}$.
  - ILI: $I \in \{24, 36, 48, 60\}$.

### 어떻게 읽나?

**Step 1 — 표 구조**: 2 sub-table:
- *Left*: ETT 의 $I \in \{96, 192, 336, 720\}$ — MSE/MAE.
- *Right*: ILI 의 $I \in \{24, 36, 48, 60\}$ — MSE/MAE.

**Step 2 — ETT 발견**:

| Input I | ETT MSE |
|---------|---------|
| 96 | **0.339** (best) |
| 192 | 0.355 |
| 336 | 0.361 |
| 720 | 0.419 |

→ *ETT 는 $I = 96$ 이 best*. *Longer input 가 오히려 noise*.

**Step 3 — ILI 발견**:

| Input I | ILI MSE |
|---------|---------|
| 24 | 3.406 |
| 36 | 2.669 |
| 48 | **2.656** (best) |
| 60 | 2.779 |

→ *ILI 는 longer (I=36, 48) 가 좋음*. *24 (6개월) 은 부족*.

**Step 4 — 핵심**: paper 명시:
> *"For the ETT dataset with obvious periodicity, an input with length-96 is enough to provide enough information."* (주기성 강하면 짧은 input 충분.)
> *"For the ILI dataset without obvious periodicity, the model needs longer inputs to discover more informative temporal dependencies."* (주기성 약하면 더 긴 input 필요.)

→ **Dataset specific** — *주기성에 따라 다름*.

---

## 13.4 Table 8 — Decoder Input 의 Past Info

본 논문 *Table 8 (p.14)*: Decoder input 에 *과거 정보* 얼마나 포함 할지.

### Setup

- Decoder input 의 *3 가지 옵션*:
  - **$O$ (without past)**: 미래 placeholder 만.
  - **$I/2 + O$ (with half past)**: 과거 절반 + 미래 placeholder. ← Autoformer default.
  - **$I + O$ (with full past)**: 과거 전체 + 미래 placeholder.

### 어떻게 읽나?

**Step 1 — 3 column** (decoder input length):
- $O$ (without past).
- $I/2 + O$ (half past).
- $I + O$ (full past).

**Step 2 — 3 row** (MSE, MAE, Memory):

| 항목 | O (no past) | I/2 + O (half) | I + O (full) |
|------|-------------|----------------|--------------|
| MSE | 0.360 | **0.339** | **0.333** |
| MAE | 0.383 | **0.372** | **0.369** |
| Memory | **3029 MB** | 3271 MB | 3599 MB |

**Step 3 — 발견**:
- *MSE 측면*: I + O 가 약간 더 좋음 (0.333 < 0.339). 그러나 *차이 작음*.
- *Memory 측면*: O 가 가장 작음. I + O 는 *3599 MB* — 가장 큰.

**Step 4 — Trade-off**: 본 논문 default = $I/2 + O$ — *성능 + memory 의 balance*.

> *(paper 명시)*: "We set the decoder input as $I/2 + O$ to trade off both the performance and efficiency."

---

## 13.5 Table 9 — Decomposition Algorithm 비교 (★ 중요)

본 논문 *Table 9 (p.15)*: 5 가지 decomposition algorithm 비교.

### Setup

본 논문 의 *progressive (inner) decomposition* vs *4 가지 사전 분해 algorithm*:

| Algorithm | 출처 | 종류 |
|-----------|------|------|
| **STL** | Cleveland 1990 | Loess 기반 |
| **Hodrick-Prescott Filter** | Hodrick-Prescott 1997 | Macro 통계 표준 |
| **Christiano-Fitzgerald Filter** | Christiano-Fitzgerald 2003 | Bandpass filter |
| **Baxter-King Filter** | Baxter-King 1998 | Bandpass filter |
| **Progressively (Autoformer)** ★ | 본 논문 | Inner block |

각 *사전 분해 algorithm* 의 결과 + *backbone Transformer 두 개* (seasonal + trend 각각 학습).

### 어떻게 읽나?

**Step 1 — 표 구조**: 4 horizons (96, 192, 336, 720) × 5 algorithms × MSE/MAE.

**Step 2 — 비교**:

| Horizon | STL | HP | CF | BK | **Autoformer** |
|---------|-----|------|-----|------|---------------|
| 96 | 0.523 | 0.464 | 0.373 | 0.440 | **0.255** |
| 192 | 0.638 | 0.816 | 0.819 | 0.623 | **0.281** |
| 336 | 1.004 | 0.722 | 1.083 | 0.861 | **0.339** |
| 720 | 3.678 | 2.181 | 2.462 | 2.150 | **0.422** |

**Step 3 — 발견**: 

**Autoformer 가 *모든 horizon, 모든 algorithm 능가***:
- predict-720 에서 *6-9 배 차이*.
- *Sep* (사전 분해 + 별도 학습) 의 *근본 한계*.

**Step 4 — 핵심**: paper 명시:
> *"our proposed progressive decomposition architecture consistently outperforms the separate prediction (especially the long-term forecasting setting), despite the latter being with mature decomposition algorithms and twice bigger model."*

→ **Progressive (inner) decomp 의 *근본적 우위* — 성숙 한 algorithm 도 inner block 안 됨**.

---

## 13.6 본 챕터 정리

```
   Table 6 (c hyperparameter)              Table 7 (Input length)
   ────────────────────────                ────────────────────────

   c=1-3 default                            ETT: I=96 충분 (주기성 강)
   주기 강하면 큰 c                          ILI: longer I 필요 (주기 약)
              ↓                                              ↓
              Table 8 (Decoder input)            Table 9 (Decomp algorithm)
              ─────────────────────              ─────────────────────────
              I/2 + O default                    Autoformer 가 STL, HP, CF, BK 모두
              (성능 + memory balance)            압도적 능가 (특히 long-term)
              ↓                                              ↓
                   Autoformer 의 architecture choice 의 *empirical 정당화*
```

---

## 13.7 자기점검

### 핵심 3가지
1. **Table 6 의 c hyperparameter 의 *dataset specific*?**
2. **Table 7 의 input length 의 *dataset specific*?**
3. **Table 9 의 *progressive vs pre-decomposition* 비교?**

### 답변
1. **$c$ 는 $k = c \log L$ 의 *top-k 개수 조정*. 주기성 강한 dataset (ETT, Traffic): 큰 c (2-3) — 명확 한 주기 들 활용**. **주기성 약한 dataset (Exchange, Weather, ILI): 작은 c (1) — 너무 많은 lag 가 noise**. Paper default $c = 1-3$ 의 *dataset specific*. ILI 처럼 *작은 dataset* + *비주기* 는 *큰 c 가 역효과*.
2. **(ETT) $I = 96$ best — 주기성 강해서 짧은 input 충분**. **(ILI) $I = 48$ best — 비주기 라 longer input 필요**. *Trade-off*: longer input = more info but more noise. 주기성에 따라 *sweet spot 다름*. Autoformer 의 *adaptive 행동* — input 길이 에도 robust.
3. **Table 9: 4 사전 분해 algorithm (STL, HP, CF, BK) + Autoformer progressive 비교**. predict-720 에서 Autoformer = 0.422, 최고 사전 분해 (BK) = 2.150 — **5 배 차이**. *2 backbone Transformer 학습 (seasonal + trend)* + *성숙 한 algorithm* 인데도 *Autoformer 의 1 모델* 에 *못 미침*. Pre-decomposition 의 *근본 한계* (future 의 분해 불가능) 의 *결정적 증명*. Progressive (inner) decomposition 의 *유일 정당화*.

---

다음 챕터: [14_appendix_covid.md](14_appendix_covid.md) — COVID-19 case study.
