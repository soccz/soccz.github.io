# 1. 메타 & 선정 이유

## 1.1 서지

- **제목**: Imaging Time-Series to Improve Classification and Imputation
- **저자**: Zhiguang Wang, Tim Oates
- **소속**: University of Maryland, Baltimore County (UMBC) — CORAL Lab (Cognition, Robotics, and Learning Lab)
- **발표**: IJCAI 2015 (Proceedings of the 24th International Joint Conference on Artificial Intelligence), AAAI Press, **pp. 3939–3945**
- **DOI**: 10.5555/2832747.2832798 (ACM DL)
- **arXiv**: 1506.00327 (2015-06)
- **DBLP**: conf/ijcai/WangO15
- **자매 워크샵 논문**: "Encoding Time Series as Images for Visual Inspection and Classification Using Tiled Convolutional Neural Networks", AAAI 2015 Workshops (저자 동일, CORAL Lab UMBC; SM1.pdf preprint URL `coral-lab.umbc.edu/wp-content/uploads/2015/05/10179-43348-1-SM1.pdf`)
- **인용 수**: 외부 인덱스 ScisSpace 기준 578+ (2026 시점 추정, ResearchGate 표시; 본 환경 직접 확인 불가) — 본 분야 (TS-as-image) 의 단일 1차 reference 로 사실상 표준
- **코드/데이터 공개**:
  - GitHub `cauchyturing/Imaging-time-series-to-improve-classification-and-imputation` (저자 본인 계정, Python 3.6+, ~114 star / 53 fork 시점 표기)
  - `serie2GAF.py` (GASF/GADF 인코딩), `serie21MTF.py` (또는 `serie2MTF.py`, MTF 인코딩), `serie2QMlib.py` (Quantile Mapping 라이브러리), `Coffee_ALL` 샘플 데이터
  - Wiki: PAA (Piecewise Aggregate Approximation) dimensionality, GAF 타입(GASF/GADF) 선택, 데이터 rescale 옵션 / MTF 의 quantile binning · full/patch/PAA reduction 옵션
  - 평가 데이터: UCR Time Series Classification Archive (공개; 외부)

## 1.2 근거 지도 (Source Lock — 본문 어느 위치를 누가 어떻게 단정하는가)

- **핵심 claim (GAF + MTF + tiled CNN 의 3-콤포넌트 framework)**: Abstract 2 문단 (cosine encoding via polar / Markov transition / tiled CNN on 20 datasets / 9 baselines compared) — abstract verbatim 으로 확인.
- **방법론 (GASF, GADF, MTF 정식 정의 + PAA + bijection)**: 외부 인덱스에서 정성 기술 verbatim 으로 확인. polar 좌표 변환 식 (`θ = arccos(X_norm), r = n/L`), GASF 가 cos-summation, GADF 가 sin-difference, MTF 가 W_{q(x_i), q(x_j)} 양자화 전이, bijection on 0/1 rescaled data — **본문 식 번호 (예: Eq. 1, 2, 3) 와 정확한 표기 변수명은 본문 PDF 차단으로 단정 안 함**.
- **실험 (20 UCR datasets, 9 baseline)**: abstract verbatim. Gun_Point 가 UCR 인 사실은 standard. **개별 데이터셋별 error rate, win/tie/loss 카운트, baseline 9 종의 정확한 이름 (DTW-1NN / FastShapelet / SAX-VSM / BoP / Bag-of-Patterns / RPCD / TSBF / LTS / Collective-of-Transformation-Ensembles 등 추정) 의 정확한 매칭은 본문 PDF 차단으로 단정 안 함**.
- **결측 보간 (Imputation)**: abstract verbatim — "Inspired by the bijection property of GASF on 0/1 rescaled data, we train Denoised Auto-encoders (DA) on the GASF images of four standard and one synthesized compound dataset. The imputation MSE on test data is reduced by 12.18%–48.02% when compared to using the raw data". 그 외 정확한 4 표준 + 1 합성 compound 데이터셋 매칭은 본문 PDF 미확인.
- **한계·Appendix·Future Work**: 본문 차단으로 직접 단정 없음. 결측 보간이 1D raw vs GASF 만 비교했는지·다른 representation 과의 비교는 있는지·Tiled CNN 외 다른 학습기 ablation 은 있는지·MTF 의 quantile 수 Q sweep 은 있는지 등은 모두 미확인.

## 1.3 선정 이유 (왜 오늘 이 논문인가)

### 1.3.1 버킷과 태그
오늘 (수요일, 2026-06-24) 은 **인접 버킷** (TS transformer / 2D / TSFM interp + 금융). `_coverage.md` 기준:
- `ts-as-2d` = 2 (마지막 2026-06-10 VisionTS, 그 전 2026-05-13 TimesNet) — 인접 태그 내 **가장 뒤처진** (단 fin-ts-dl 도 1).
- 사용자 우선 읽기 목록 (`_index.md` "APF — TS as 2D") 의 priority 항목 `(2015) Imaging Time-Series to Improve Classification and Imputation (GAF / MTF) Wang & Oates 2015 ts-as-2d` — 식별자 `(2015)` 가 불완전했지만 Source Lock 작업에서 arXiv:1506.00327 / IJCAI 2015 pp 3939–3945 로 확정.
- **Tier**: 2 (IJCAI 2015). 인용 수 대량 (사실상 TS-as-image 분야의 표준 1차 reference).

### 1.3.2 사용자 연구 연결 (APF + Grokking)
- **APF (Attention Pattern Fields)** 의 핵심 가설은 "TS Transformer 의 attention map (N×N) 은 *시계열의 어떤 외형 격자* 가 PE 와 어떻게 상호작용하는가" 다. 본 논문은 그 "외형 격자" 자체를 **명시적으로 시계열로부터 구성하는** 첫 작품 — GASF 의 cos-summation 격자가 RoPE 의 frequency-channel 격자와 구조적으로 닮아 있고, MTF 의 quantile 전이 격자가 induction head 의 lookup 패턴과 닮아 있다. APF 의 motif typology (diagonal/stripe/block/edge/spike/checker) 가 *내생적* (학습된 attention) 이라면, GAF/MTF 의 격자는 *외생적* (수식으로 직접 구성) 이다. 두 격자가 *언제 일치하는가* 가 APF intervention 실험의 가설로 직접 환원된다.
- **Grokking in TS Transformers** 와의 연결은 다소 약하지만 — *대칭성 (GASF 의 G_{ij} = G_{ji}) 이 학습 동학에서 어떤 representation prior 를 만드는가* 는 Nanda 2023 의 Fourier circuit 와 Yang ICLR 2026 의 TAPPA q-similarity 양쪽에 같은 질문을 던진다.
- **금융 응용 분기**: TS-as-image 가 직접적으로 candlestick chart 패턴 분류·기술적 분석 자동화 (Tsai 2019 "Encoding Candlesticks as Images" 등) 로 분기. P1 ProTran-TFA 의 multimodal extension 가능성 (시계열 + 이미지 표상 결합) 의 1차 reference.

### 1.3.3 계보 위치
TimesNet (2023) 이 *FFT 로 주기를 찾아 2D reshape* 하는 분기를, VisionTS (2024/ICML 2025) 가 *frozen ImageNet MAE 를 시계열 이미지 표상에 그대로 적용* 하는 분기를 — 둘 다 **본 논문 (2015) 의 "TS → 2D image → vision model" 도식의 11 년 후 변종**. TimesNet 은 본 논문을 직접 인용·계승, VisionTS 는 같은 도식의 변종. 그 의미에서 본 논문은 **2D TS 표상 계보의 단일 원전**이다. 이미 cover 한 TimesNet (2026-05-13) + VisionTS (2026-06-10) 의 *조상* 을 채우는 자리.

### 1.3.4 금융 비율 점검
`_coverage.md` "금융 비율" 규칙 = "수요일 버킷에서 fin-ts-dl / probabilistic-forecast 중 최소 1 개는 월 1 회 이상 등장". 2026-06 월에는:
- fin-ts-dl: 0 (May 20 MASTER 이후 공백)
- probabilistic-forecast: 2026-06-03 MOIRAI cross + 2026-06-10 VisionTS cross + 2026-06-17 Tan 2024 cross-약함
→ probabilistic-forecast 쪽으로는 cross 충족. 단 fin-ts-dl 은 다음 수요일 (2026-06-26 또는 7월 초) 에 우선순위 상향. 본 논문은 fin-ts-dl 의 *기술 substrate* (candlestick 이미지화의 원전) 이라는 약한 보조 연결만.

### 1.3.5 Priority 매칭 마크
`_index.md` "APF — TS as 2D" 행 `(2015) Imaging Time-Series to Improve Classification and Imputation (GAF / MTF) Wang & Oates 2015 ts-as-2d` 에 `[2026-06-24 ✓]` 마크 (Section 8 마지막 단계에서 처리).
