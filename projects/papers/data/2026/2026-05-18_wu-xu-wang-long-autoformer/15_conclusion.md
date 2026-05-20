# 15. Conclusion + Future Work — 무엇이 남았나

> 본 논문 *결론 + 의의 + 미래 연구 방향*.

---

## 15.1 챕터 한 줄 요약

> **"Autoformer = Decomposition (inner block) + Auto-Correlation (series-wise, FFT) = 장기 시계열 SOTA. 6 datasets 평균 38% MSE 감소. $O(L \log L)$ 효율. 시계열 분야의 paradigm shift — 후속 (FEDformer, PatchTST, iTransformer) 의 building block. Future: cross-channel dependency, probabilistic forecasting, online learning."**

---

## 15.2 본 논문 *2 대 기여*

### 1. **Decomposition Architecture** — Inner Block

> **시계열 분해를 *deep network 의 inner block* 으로 통합**.

기존 *Prophet / N-BEATS / DeepGLO* 의 *사전 처리 분해* 한계 극복. *Encoder + Decoder 의 매 layer 마다* `SeriesDecomp` block 삽입 → *progressive (반복적) 분해*.

**왜 중요한가?**: 
- *Future hidden representation* 도 분해 가능.
- *Layer 마다 정제* — *trend + seasonal 의 점진적 분리*.
- Table 9 의 *5 배 차이* 가 *경험적 증명*.

### 2. **Auto-Correlation Mechanism** — Series-wise

> **Self-attention 의 *point-wise* 를 *series-wise* 로 *통째로 교체***.

기존 Transformer 변형 (Informer, Reformer, LogTrans) 의 *sparse self-attention* 한계 극복. *Auto-Correlation* 으로:
- *Top-k 주기* 발견 (FFT).
- *Roll + 가중 합* 으로 sub-series aggregation.
- $O(L \log L)$ 효율.

**왜 중요한가?**:
- *시계열 의 본질적 구조 (주기성)* 활용.
- *Point-wise 의 information bottleneck* 회피.
- Table 4 의 *모든 attention 변형 능가*.

### 3. **실증** — 38% MSE Reduction

> **6 datasets × 4 horizons 평균 38% MSE 감소** vs Informer/Reformer/LogTrans.

극단: ETTm2 predict-336 의 *74% 감소* (1.334 → 0.339).

---

## 15.3 본 논문이 *반박* 한 통념

| 학계 통념 (2019-2021) | Autoformer 발견 |
|---------------------|----------------|
| 시계열 분해 는 *사전 처리* 만 가능 | *Inner block* 가능 + *더 효과적* |
| Self-attention 의 *sparse 버전* 이 답 | Self-attention 자체 *교체* 가능 |
| Point-wise 비교 가 자연 | *Series-wise (조각 별)* 이 *시계열 본질* |
| Sparse 가 *효율 + 정확도 trade-off* | 둘 다 *동시 달성* 가능 |

---

## 15.4 본 논문의 *limitation* (저자 명시)

### Limitation 1 — Cross-channel dependency

Auto-Correlation 은 *시간 축 (temporal)* 에 집중. *변수 (channel) 간 dependency* 직접 모델링 X.

→ Multivariate forecasting 에서 *channel 간 정보* 활용 제한.

**후속 응답**:
- *iTransformer (2024)*: channel attention 으로 *cross-channel 직접 학습*.
- *Spacetime Transformer*: spatial + temporal attention 결합.

### Limitation 2 — Point Forecast 만

본 논문은 *point estimate*. *Probabilistic (확률) forecast* (예: prediction interval) 제공 X.

**후속 응답**:
- *Quantile Autoformer*: probabilistic version.
- *ProTran (2021)*: probabilistic transformer.

### Limitation 3 — 주기성 의존

Auto-Correlation 이 *주기성* 의 활용에 *최적화*. *완전 random walk* 시계열 (예: 단기 주가) 에서는 *효과 제한*.

**Exchange dataset 의 성공* 이 *이 limitation 의 완화* 증명 — *완전 random 아닌 한* 효과적.

---

## 15.5 *미래 연구 방향* (저자가 명시)

### 1. Cross-channel dependency 활용

> *(저자 명시)*: "future direction — incorporate cross-channel information while preserving series-wise advantage."

→ *iTransformer (2024)* 가 응답.

### 2. Probabilistic Forecasting

> *(저자 명시)*: "Extension to probabilistic forecast (predictive intervals, density estimates)."

→ 다양한 후속 paper.

### 3. Online / Recursive Learning

본 논문 의 *recursive* (한 번에 모든 horizon 예측). *Online learning* + *real-time adaptation* 가능성.

### 4. *Other Frequency Tools*

Wavelet, Empirical Mode Decomposition (EMD) 등 *다른 frequency tool* 시도.

→ *FEDformer (2022)* 가 응답 — *Fourier domain* 더 깊게.

---

## 15.6 본 논문 의 *학계 임팩트*

### 단기 (2021-2022)

- NeurIPS 2021 publication. *시계열 분야 의 새 SOTA*.
- Tsinghua THUML group 의 *대표 paper*.
- *재현 가능 한 official repo* (https://github.com/thuml/Autoformer).

### 중기 (2022-2023)

- **FEDformer (Zhou et al, ICML 2022)**: *Fourier domain* 의 *더 깊은 활용*.
- **PatchTST (Nie et al, ICLR 2023)**: *Patching* + *Channel-Independence* — Autoformer 의 *progressive decomposition 정신* 의 *간단화*.
- **DLinear (Zeng et al, AAAI 2023)**: *Simple linear* 도전 — Autoformer 가 *반박 대상*.

### 장기 (2024+)

- *시계열 foundation model* 의 building block (Chronos, TimesFM, Moirai).
- *Decomposition* + *Frequency analysis* 의 *시계열 ML 표준*.
- 시계열 분야 의 *NeurIPS classic*.

---

## 15.7 *Broader Impact* — 본 논문 의 *사회적 가치*

### Real-world Applications

본 논문 명시 5 응용:
1. **에너지** (ETT, Electricity): 발전 / 전력망 관리.
2. **교통** (Traffic): 혼잡 예측.
3. **경제** (Exchange): 환율 / 시장.
4. **날씨** (Weather): 극단 기상 조기 경보.
5. **질병** (ILI, COVID-19): pandemic forecasting.

이 모두 *사회적 가치 큰 응용*. *38% MSE 감소* 의 *직접 임팩트*:
- *에너지 효율* — 발전 / 사용 의 정확 매칭.
- *생명 보호* — 기상 / 질병 조기 경보.
- *경제 안정* — 정책 결정 의 근거.

### Academic Research

- *Time series analysis 의 classic + stochastic process theory* 의 *deep learning 응용*.
- *Decomposition + Auto-Correlation* 의 *paradigm*.

---

## 15.8 본 챕터 정리

```
   Autoformer 의 2 대 contribution            본 논문 의 paradigm shift
   ────────────────────────────              ──────────────────────────

   (1) Inner Decomposition Block             기존 (2019-2021):
       (vs pre-processing)                    Sparse self-attention 변형
   (2) Auto-Correlation                       Pre-decomposition
       (vs point-wise attention)                       ↓
              ↓                              본 논문 (2021):
       38% MSE reduction (6 datasets)        Self-attention 자체 교체
       $O(L \log L)$ 효율                     Inner decomposition
              ↓                                       ↓
   후속 paper 의 building block               후속 (2022-2024):
   (FEDformer, PatchTST, iTransformer)        FEDformer, PatchTST, iTransformer
                                              모두 Autoformer 위에 build
                                                       ↓
                                            시계열 foundation model 시대
```

---

## 15.9 자기점검

### 핵심 3가지
1. **본 논문의 *2 대 기여*?**
2. **본 논문의 *3가지 limitation*?**
3. ***미래 연구 방향* 의 가장 중요한 것?**

### 답변
1. **(1) Decomposition Architecture** — 시계열 분해를 *inner block* 으로 통합 (사전 처리 X). *Progressive 분해*. Table 9 에서 사전 분해 algorithm 들 (STL, HP, CF, BK) *5 배 차이* 로 능가. **(2) Auto-Correlation Mechanism** — Self-attention 의 *point-wise dot product* 를 *series-wise FFT 기반 Auto-Correlation* 으로 *통째 교체*. $O(L \log L)$ + *모든 sparse attention 변형 능가* (Table 4).
2. **(1) Cross-channel dependency 무시** — temporal 만 집중, channel 간 X. *iTransformer (2024)* 가 해결. **(2) Point forecast 만** — probabilistic 없음. *Quantile Autoformer / ProTran* 후속. **(3) 주기성 의존** — 완전 random walk 에서 효과 제한. Exchange 성공 으로 *부분 완화*.
3. **Cross-channel dependency 활용** — Auto-Correlation 의 *temporal 우위* + *channel 간 정보* 결합. 본 논문 명시 limitation. *iTransformer (2024)* 가 직접 응답 — channel attention 으로 cross-channel advantage 회복. *시계열 foundation model* 의 building block.

---

다음 챕터: [16_glossary.md](16_glossary.md) — 용어집 + 기호 사전.
