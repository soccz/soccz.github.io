# 9. 내 연구와의 연결 (APF · Grokking · P1 ProTran-TFA · AETHER)

## 9.1 연결 강도의 솔직한 자가 진단

| 내 자산 | 연결 강도 | 한 줄 요약 |
|---|---|---|
| **🟢 APF (Attention Pattern Fields)** | **강** | GAF 의 *외생적 $n \times n$ 격자* 와 APF 의 *attention motif 격자* 의 *대응 관계* 가 motif causality 의 *통제 변수* 가 됨 |
| **🟢 Grokking in TS Transformers** | 약 (전이 가능성만) | *대칭성 (GASF)* 이 *학습 동학의 representation prior* 에 기여하는 가설 — Liu 2022 effective theory 의 representation manifold 와 연결 가능 |
| **⏸️ P1 ProTran-TFA** | 중 | *시계열 + 캔들 차트 이미지* 의 *multimodal extension* 의 1 차 reference. GAF imputation 을 *결측치 보간* 모듈로 직접 이식 가능 |
| **🔴 AETHER** | 약 | *Crypto 거래량 / 가격 시계열의 이미지화* 로 *기술적 분석 패턴 자동화* — Tsai 2019 candlestick 응용의 연장 |

## 9.2 APF 와의 연결 — 가장 강한 자리

### 9.2.1 핵심 가설 환원

APF 의 중심 가설: *"Attention pattern (N×N matrix) 의 motif typology (diagonal / stripe / block / edge / spike / checker) 는 PE × 데이터 분포의 함수다"*. 이를 *형식적* 으로 표현하면:

$$A^{(\ell, h)}(X; \theta_{\text{PE}}) \;\sim\; \mathcal{F}\bigl(\text{data-correlation}(X), \theta_{\text{PE}}\bigr)$$

본 논문은 이 *data-correlation(X)* 의 *명시적 격자 표현* — GAF/MTF — 을 11 년 전에 정확히 제공한 작품이다. 즉:

- **APF 의 attention motif** = *학습된 내생적 N×N 격자*
- **본 논문의 GAF/MTF** = *수식으로 직접 구성된 외생적 N×N 격자*

두 격자 사이의 *correlation · alignment* 가 APF 의 *motif causality* 가설을 직접 검증할 *통제 변수* 가 된다.

### 9.2.2 구체적 연결 ① — GASF 와 attention map 의 alignment 측정

**가설**: TS Transformer 의 attention head 중 일부 (특히 *low layer, content-based head*) 는 *학습 후 attention pattern* 이 *입력 시계열의 GASF* 와 *spatial 구조적으로 닮아진다*.

**측정 방법**:
1. 학습된 TS Transformer (PatchTST / iTransformer / Chronos) 에서 layer $\ell$, head $h$ 의 attention map $A^{(\ell, h)}(X) \in \mathbb{R}^{N \times N}$ 을 추출.
2. 입력 시계열 $X$ 에 대해 GASF 계산 $G^{\text{S}}(X) \in \mathbb{R}^{n \times n}$ (PAA 로 $n = N$ 맞춤).
3. **유사도 metric**:
   - *Pearson correlation* $\rho(A^{(\ell, h)}, G^{\text{S}})$ — pixel-wise.
   - *Structural Similarity Index (SSIM)* — 시각적 유사도.
   - *Earth Mover's Distance (EMD)* — 분포 차이.
4. *Head 별 GASF-similarity 분포* 를 그려, *"GASF-aligned head"* 가 존재하는지 확인.

**예상 결과**: *Low layer / content-based / RoPE-PE 사용 head* 에서 GASF-similarity 가 가장 높을 것. 이는 *attention 이 학습 후 결국 *시계열의 cosine 유사도 행렬* 에 수렴한다* 는 Yang TAPPA 2026 의 q-similarity 가설의 *외생 격자 검증판*.

### 9.2.3 구체적 연결 ② — APF intervention 의 substrate

APF 의 *motif intervention* 실험은 *학습된 attention 을 인위적으로 swap/mask* 해서 출력 변화를 측정한다. 본 논문의 GAF/MTF 는 *attention 을 *그 자리에서 외생 격자로 교체* 할 수 있는 *baseline intervention*. 즉:

- **Intervention A**: $A^{(\ell, h)} \leftarrow$ 다른 head 의 attention (motif swap)
- **Intervention B (본 논문 활용)**: $A^{(\ell, h)} \leftarrow G^{\text{S}}(X)$ — *GASF 격자로 교체*
- **Intervention C**: $A^{(\ell, h)} \leftarrow M(X)$ — *MTF 격자로 교체*

만약 *Intervention B 가 무손실 (loss 변화 없음)* 이면 → 그 head 는 *implicitly* GASF 격자를 *재계산* 하고 있었음 → motif typology 가 *데이터-결정* 임을 강한 증거.

**구현 비용**: APF 의 기존 intervention pipeline (hooks + forward pass) 에 *GAF/MTF 계산 함수* (저자 GitHub `serie2GAF.py` 또는 pyts 라이브러리) 를 *attention replacement layer* 로 끼우면 100 줄 미만. 1 일 작업.

### 9.2.4 APF 인용 포인트

APF paper §2 Related Work 또는 §3 Setup 에서 다음 문장으로 인용 가능:

> "Wang & Oates (2015) introduced Gramian Angular Fields as a deterministic $n \times n$ encoding of pairwise cosine similarity of a time series in polar coordinates. We use GASF as an *exogenous reference grid* against which learned attention patterns can be compared, providing a control variable for testing whether a head's pattern is implicitly recomputing data-driven similarity."

또는 §4 Methodology — *external grid baseline* 으로 명시:

> "As a non-trainable control for our intervention experiments, we replace learned attention with GASF (Wang & Oates 2015) computed from the input series. A head whose output is invariant to this replacement is interpreted as implicitly computing such a similarity grid."

## 9.3 Grokking in TS Transformers 와의 연결 — 약, 전이 가능성만

### 9.3.1 *대칭성* 의 representation prior 가설

GASF 의 *대칭성* ($G^{\text{S}}_{ij} = G^{\text{S}}_{ji}$) 과 GADF 의 *반대칭성* 은 *representation 의 강한 inductive bias*. Liu 2022 effective theory of grokking 의 *representation manifold structure* — *generalization 이 발생하는 시점에 weight 가 *prepresentation-rich manifold* 의 *Goldilocks zone* 에 도달* — 와 *대칭성 prior* 가 어떤 관계인지가 가능한 가설:

> "*대칭성을 강제* 한 representation (예: GAF-위 학습) 은 *grokking transition 시점 (memorization → generalization)* 이 *대칭성 없는 representation (raw 1D 위 학습)* 보다 *더 빠르거나 더 sharp 하다*."

이는 *시계열 grokking* 의 *representation-side 가속제* 의 후보 — 단 실험으로 검증되어야 함. 본 논문이 *직접* 이 가설을 다루지 않으므로 *전이 가능성 만* 표기.

### 9.3.2 P2 Logistic 4-layer 실험과의 약한 연결

P2 (Logistic Map 4-layer) 실험에서 *logistic map 의 chaotic dynamics* 를 시계열로 보고 학습. 이를 *GASF 로 변환한 후 vision-style 학습* 과 *raw 1D 학습* 의 *grokking timing 비교* — 그러나 이는 *지도교수 결정 따라 좁혀지는* 트랙이고 현재 active 우선순위 아님.

## 9.4 P1 ProTran-TFA 와의 연결 — Multimodal extension

P1 (ProTran-TFA, paused) 의 *probabilistic Transformer for finance* 는 *raw OHLCV 시계열* 만 입력. **확장 후보**: 같은 시계열을 *GASF 이미지 + ProTran TFT* 의 *late fusion* multimodal extension.

**구체 설계**:
- Branch A: 기존 ProTran encoder (OHLCV 1D × 시간).
- Branch B: GASF (RGB compound) → small ResNet18 → embedding $z_B$.
- Fusion: $z_A \oplus z_B$ → decoder.

**가설**: *이미지 branch* 가 *Hammer / Engulfing / Head-and-Shoulders* 같은 *기술적 패턴* 을 명시적으로 잡아내, 1D branch 가 못 보는 *chart-pattern signal* 을 보완한다.

**비용**: ProTran-TFA 코드 위에 *image branch 추가* + 학습. 1 주 작업. *paused* 상태라 즉시 실행은 아님.

## 9.5 AETHER (crypto) 와의 연결 — Tsai 2019 응용 분기

AETHER 의 *crypto 시장 분석* 은 *BTC cycle, lead-lag, DeFi* 등. 본 논문의 *시계열 → 이미지* 는 *crypto OHLCV → 캔들 차트 이미지 → CNN 패턴 분류* 로 직접 응용 가능. Tsai 2019 "Encoding Candlesticks" 의 *crypto 일반화* 가 후속 작업으로 자연스럽다.

단 AETHER 는 code 부재 (`AETHER_IDEA.md` 611 줄만 있음) — 실제 구현 진입은 멀다.

## 9.6 흡수할 기법 — 구체 인용 초안

### APF paper 의 §3.2 (motif typology measurement) 에서:

> "We compare learned attention patterns $A^{(\ell, h)}(X)$ against the exogenous Gramian Angular Summation Field $G^{\text{S}}(X)$ of Wang & Oates (2015), defined as $G^{\text{S}}_{ij} = \cos(\phi_i + \phi_j)$ where $\phi_i = \arccos(\tilde{x}_i)$ for $\tilde{x}_i$ the min-max normalized input. The Pearson correlation $\rho(A^{(\ell, h)}, G^{\text{S}})$ provides a quantitative measure of how closely a learned head approximates this deterministic data-grid."

### APF paper 의 §5 (intervention experiments) 에서:

> "We adopt three intervention strategies for layer $\ell$, head $h$:
> (i) *Motif swap* — replace with another head's pattern;
> (ii) *GASF replacement* — substitute $G^{\text{S}}(X)$ following Wang & Oates (2015);
> (iii) *MTF replacement* — substitute the Markov Transition Field of the same paper. Strategies (ii) and (iii) test whether the head is implicitly computing data-driven similarity or transition structure."

## 9.7 충돌·반면교사

### 본 논문이 못한 것 ① — *해석성의 *통계적* 검증 부재*
본 논문은 *GAF 가 시각적으로 의미 있는 패턴* 을 만든다고 주장하지만 — *각 클래스의 prototypical GASF* 가 *통계적으로 분리 가능* 한지 (예: cluster purity, t-SNE separability) 의 정량 평가는 본 환경 미확인. APF 는 이 부족을 *motif typology 의 정량 metric (count, area, periodicity score)* 로 메워야 함.

### 본 논문이 못한 것 ② — *시계열 *길이 sensitivity* 부족*
UCR 의 *short TS* 에 집중. *Long-term TSF* 에서의 한계는 후속 TimesNet/VisionTS 가 해결. APF 는 이 점을 인식해 *Multi-resolution motif* (짧은 lag 격자 + 긴 lag 격자) 의 분리 검증을 포함해야 함.

### 본 논문이 못한 것 ③ — *비정상 (non-stationary) 시계열의 quantile drift*
MTF 의 *single 전이 행렬* 가정이 *regime switch* 데이터 (금융 시장, climate) 에서 무너짐. APF 의 *time-varying motif* 가설은 이 한계를 명시적 검증 대상으로 삼는다.

## 9.8 한 줄 결론 (내 연구 관점)

> "본 논문은 APF 의 *attention motif 격자* 가 *외생적 데이터 격자 (GASF/MTF)* 와 어떻게 관계 맺는지를 검증할 *제어 substrate* 를 11 년 전에 미리 만들어 놨다 — *intervention experiment 의 baseline replacement 격자* 로 즉시 사용 가능하며, P1 ProTran-TFA 의 *multimodal extension* 의 1 차 reference. Grokking track 과의 연결은 *대칭성 representation prior* 의 가설 수준에 머무름."
