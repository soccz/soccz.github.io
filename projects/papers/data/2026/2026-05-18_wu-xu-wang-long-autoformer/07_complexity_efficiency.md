# 07. Complexity & Efficiency — FFT 기반 $O(L \log L)$ + Figure 7

> 본 논문이 *어떻게 효율* 를 달성하나. *Wiener-Khinchin 정리* + *FFT* 의 결합.

---

## 7.1 챕터 한 줄 요약

> **"Autocorrelation $R(\tau)$ 의 *naive 계산* 은 $O(L^2)$ — 너무 느림. *Wiener-Khinchin 정리* 가 *R(τ) = power spectrum 의 IFFT* 임을 보장. FFT 두 번 + IFFT 한 번 = $O(L \log L)$. 모든 lag 의 R 가 *한 번에* 계산. Figure 7 가 실측 — Auto-Correlation 이 Full/LSH/ProbSparse 보다 효율."**

---

## 7.2 *왜* Efficient Computation 필요한가?

### Naive Autocorrelation 계산

Eq 5 의 정의를 *직접 계산*:

$$
R_{\mathcal{X}\mathcal{X}}(\tau) = \lim_{L \to \infty} \frac{1}{L} \sum_{t=1}^{L} X_t X_{t-\tau}
$$

각 $\tau \in \{1, 2, \ldots, L\}$ 에 대해 *L 개 항 합산*.

**복잡도**: $L$ 개 lag × $L$ 항 = $O(L^2)$.

**예**: $L = 1000$ → $10^6$ 연산 — 한 attention 자리 마다.

→ *너무 느림*. Transformer 의 $O(L^2)$ 와 *같은 복잡도* — *효율 개선 없음*.

### Autoformer 의 해법

**Wiener-Khinchin 정리** + **FFT** 사용:
- *모든 lag 의 $R(\tau)$* 를 *한 번에* 계산.
- 복잡도: $O(L \log L)$.

---

## 7.3 Wiener-Khinchin 정리 — *시간 ↔ 주파수* 의 다리

### 일상 비유

음악 의 *시간 영역 (waveform)* 과 *주파수 영역 (스펙트럼)* 은 *같은 정보 의 두 표현*:
- *시간*: t=0 에 어떤 소리, t=0.1초 에 어떤 소리 (raw audio).
- *주파수*: 440Hz (라) 가 강함, 880Hz 가 약함 (스펙트럼).

**Fourier Transform** 이 *둘 사이 변환*.

### Wiener-Khinchin 정리 (1930)

시계열 의 *autocorrelation* (시간 영역) = *power spectrum* (주파수 영역) 의 *역 푸리에 변환*.

수식:
$$
\mathcal{S}_{\mathcal{X}\mathcal{X}}(f) = \mathcal{F}(X_t) \cdot \mathcal{F}^*(X_t) = |\mathcal{F}(X_t)|^2
$$
$$
R_{\mathcal{X}\mathcal{X}}(\tau) = \mathcal{F}^{-1}(\mathcal{S}_{\mathcal{X}\mathcal{X}}(f))
$$

**기호**:
- $\mathcal{F}$: Fourier transform (실제로는 FFT — Fast Fourier Transform).
- $\mathcal{F}^*$: complex conjugate (공액).
- $\mathcal{S}(f)$: power spectrum (주파수 영역).
- $\mathcal{F}^{-1}$: Inverse FFT.

**일상 비유**: 음악 *waveform* 을 *FFT* 하면 *스펙트럼*. 스펙트럼 의 *제곱 (power spectrum)* 을 *IFFT* 하면 *autocorrelation*.

---

## 7.4 Equation 8 (paper p.6) — FFT 기반 Autocorrelation

$$
\mathcal{S}_{\mathcal{X}\mathcal{X}}(f) = \mathcal{F}(\mathcal{X}_t) \cdot \mathcal{F}^*(\mathcal{X}_t) = \int_{-\infty}^{\infty} \mathcal{X}_t e^{-i 2\pi t f} dt \cdot \overline{\int_{-\infty}^{\infty} \mathcal{X}_t e^{-i 2\pi t f} dt}
$$
$$
R_{\mathcal{X}\mathcal{X}}(\tau) = \mathcal{F}^{-1}(\mathcal{S}_{\mathcal{X}\mathcal{X}}(f)) = \int_{-\infty}^{\infty} \mathcal{S}_{\mathcal{X}\mathcal{X}}(f) e^{i 2\pi f \tau} df
$$

**기호 뜻**:
- $\mathcal{F}$: continuous Fourier transform (실제는 *discrete* FFT).
- $\mathcal{S}(f)$: power spectral density.
- $\mathcal{F}^{-1}$: inverse Fourier transform.
- $\overline{(\cdot)}$: complex conjugate.

**일상 비유**: 시계열 의 *autocorrelation 을 직접 계산* 하는 대신:
1. *FFT 두 번* (Q + K).
2. *곱 (Conjugate 후)* — power spectrum.
3. *IFFT 한 번* — autocorrelation 복원.

**왜 이 형태?**: 
- *FFT 의 복잡도*: $O(L \log L)$.
- *곱셈*: $O(L)$.
- *IFFT*: $O(L \log L)$.
- **총**: $O(L \log L)$.

**조심할 점**: *Discrete FFT* 사용 시 *cyclic assumption* — 시계열 의 *끝과 처음 이 연결*. *Roll* 과 자연스럽게 호환.

### Cross-Correlation 의 경우

$Q \neq K$ (cross-attention):

$$
R_{\mathcal{Q}, \mathcal{K}}(\tau) = \mathcal{F}^{-1}(\mathcal{F}(\mathcal{Q}) \cdot \mathcal{F}^*(\mathcal{K}))
$$

*FFT(Q) × Conj(FFT(K))* 으로 *동일 $O(L \log L)$*. Self-attention 의 *cross-attention 자리* 와 *형식 일치*.

---

## 7.5 복잡도 비교 — *Attention 변형 5 종*

| Model | Complexity | Type |
|-------|-----------|------|
| **Full Attention** (Transformer 2017) | $O(L^2)$ | Point-wise |
| **LogSparse** (LogTrans 2019) | $O(L (\log L)^2)$ | Point-wise sparse |
| **LSH** (Reformer 2020) | $O(L \log L)$ | Point-wise sparse |
| **ProbSparse** (Informer 2021) | $O(L \log L)$ | Point-wise sparse |
| **Auto-Correlation** (Autoformer 2021) | $O(L \log L)$ | **Series-wise** ★ |

→ Auto-Correlation 이 *같은 $O(L \log L)$* 인데 *series-wise* (이점) + *FFT 기반* (실제 더 빠름).

---

## 7.6 Figure 7 — Memory + Time 실측

![Figure 7 — Memory & Time Efficiency](figures/page10_Figs5-7_deps_lags_efficiency.png)

*paper p.10 Figure 7 (전체 figure 의 마지막 panel).*

### 어떻게 읽나? (Step-by-step)

**Step 1 — 2 panel 구조**:
- **(a) Left**: Memory (GB) vs Output Length (192, 384, 768, 1536, 3072).
- **(b) Right**: Running Time (ms) vs Output Length (512, 1024, 2048, 4096, 8192).

**Step 2 — 4 model 비교**:
- **빨강**: Auto-Correlation (Autoformer).
- **파랑**: Full Attention (Transformer).
- **녹색**: LSH Attention (Reformer).
- **검정**: ProbSparse Attention (Informer).

**Step 3 — 발견**:

**Memory (Left panel)**:
- *L = 3072* 에서:
  - Full Attention: *> 30 GB* (오버 메모리).
  - LSH: *~7 GB*.
  - ProbSparse: *~7 GB*.
  - **Auto-Correlation: *~5 GB*** ← 가장 효율.

**Time (Right panel)**:
- *L = 8192* 에서:
  - Full Attention: *~45 ms*.
  - LSH: *~22 ms*.
  - ProbSparse: *~13 ms*.
  - **Auto-Correlation: *~10 ms*** ← 가장 빠름.

**Step 4 — 결론**: Auto-Correlation 이 *memory + time 모두* 가장 효율. *FFT 의 빠른 구현 + cache-friendly 패턴*.

```viz:autoformer-efficiency:title=Fig 7 — Memory/Time Efficiency (interactive),caption=Memory vs Output Length + Time vs Output Length. Auto-Correlation 이 4 baseline 모두 능가.
```

---

## 7.7 *왜* Auto-Correlation 이 *FFT-friendly* 한가?

### 이유 1 — FFT 의 *highly optimized*

FFT 는 *지난 60년* 동안 *최적화*: NumPy/PyTorch 의 *cuFFT* 라이브러리 등.

GPU 의 *parallel FFT* 가 *극도로 빠름*. Sparse attention 의 *irregular indexing* 보다 *cache-friendly*.

### 이유 2 — *모든 lag 한 번에*

Sparse attention (ProbSparse, LSH): *각 query 마다 따로 처리* → *L 번 반복*.

Auto-Correlation: *FFT 한 번에 모든 lag 의 R 계산* → *batch processing 자연 활용*.

### 이유 3 — *Top-k 의 효율*

$k = c \log L$ 의 *log-scale* — *L 늘어도 k 안 폭증*. 즉 *aggregation 도 효율*.

---

## 7.8 본 챕터 정리

```
   Naive Autocorrelation 계산                Autoformer (FFT 기반)
   ────────────────────────                ──────────────────────

   각 τ 마다 직접 sum                       FFT(Q) × Conj(FFT(K))
   $O(L^2)$                                 → IFFT
                                              ↓
   Transformer 와 동일                     $O(L \log L)$
   (효율 개선 X)                            모든 lag 한 번에
              ↓                                       ↓
   사용 불가                                Figure 7 실측:
                                            Memory + Time 모두 SOTA
                                                      ↓
                                            장기 시계열 (L > 1000) 가능
```

→ **Wiener-Khinchin + FFT 의 *수학적 trick* 이 Auto-Correlation 의 *실용성 보장***.

---

## 7.9 자기점검

### 핵심 3가지
1. **Naive autocorrelation 계산 의 *왜 $O(L^2)$* 인가?**
2. **Wiener-Khinchin 정리 의 의의?**
3. **Figure 7 의 *Auto-Correlation 효율 우위* 의 원인?**

### 답변
1. **Eq 5: $R(\tau) = (1/L) \sum_{t=1}^{L} X_t X_{t-\tau}$. 각 $\tau \in \{1, ..., L\}$ 에 대해 *L 항 합산***. *L 개 lag × L 항 = $O(L^2)$*. 예: L=1000 → $10^6$ 연산. *Transformer 의 $O(L^2)$ 와 동일* — 효율 개선 없음. 그래서 *naive 계산 불가*.
2. **Wiener-Khinchin (1930)**: *autocorrelation $R(\tau)$* = *power spectrum $S(f)$* 의 *IFFT*. 즉 *시간 영역 의 R = 주파수 영역 의 S 의 변환*. 음악 의 *waveform ↔ spectrum* 의 *수학적 다리*. 이 정리 덕분에 *FFT 두 번 + IFFT 한 번* 으로 *모든 lag 의 R 한 번에* 계산 가능 — $O(L \log L)$.
3. **(원인 1) FFT 의 *60년 최적화***: cuFFT 등 GPU 라이브러리 의 *극도 효율*. **(원인 2) *모든 lag 한 번에***: Sparse attention 은 query 마다 반복 (L 번), Auto-Corr 은 FFT 1번. **(원인 3) *Top-k 의 log-scale***: $k = c \log L$ — L 늘어도 *aggregation 안 폭증*. *Cache-friendly* + *parallel-friendly*. Figure 7 실측: L=8192 에서 Auto-Corr (10ms) vs Full Attention (45ms) — *4.5 배 빠름*.

---

다음 챕터: [08_data_baselines.md](08_data_baselines.md) — 6 datasets + 10 baselines.
