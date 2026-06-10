# 10 · 사고 확장 (c) — 실험 아이디어 2개

본 논문이 열어준 자리에 직접 들어갈 수 있는 2 개의 실험을 구체적으로 디자인한다. 두 실험은 모두 (i) 1~3 주 안에 구현 가능, (ii) APF / P1 ProTran-TFA / Grokking 의 어느 한 라인에 직접 결합 가능, (iii) 실패해도 의미 있는 결과를 산출하도록 디자인.

---

## 실험 1 — "Frozen VisionTS 위에서 APF motif 분류 (cross-modal motif transfer 검증)"

### 가설
APF 의 6-class motif typology (diagonal / stripe / block / edge / spike / checker) 는 TS-native transformer 의 self-attention 위에서 정의됐다. **이 typology 가 frozen ImageNet MAE 의 attention 위 (시계열 입력) 에서도 유의미하게 작동하는가?** 만약 작동한다면 APF 의 분류기는 cross-modal universal 한 motif geometry 의 도구가 된다.

### 데이터
- **벤치마크**: LTSF 표준 4 데이터셋 (ETTh1, ETTm1, Weather, ECL) 의 표준 context-horizon (336→96).
- **시계열 입력**: VisionTS 의 forward 로 224×224 image 변환 (periodicity 표준 메타: 24/96/144/24-bin Traffic).
- **비교 baseline 모델**:
  1. TS-native PatchTST (인덱스 05-19 cover) 의 self-attention map.
  2. iTransformer (인덱스 05-06 cover) 의 variate attention.
  3. VisionTS (frozen ImageNet MAE Large) encoder/decoder attention.
  4. (선택) Chronos (인덱스 04-29) 의 T5 encoder attention.

### 비교 조건
- 모든 모델에서 동일 시계열 입력에 대해 attention map 추출 → APF 의 motif classifier (CNN probe) 로 6-class 분류 → 각 layer × head 당 motif 분포 plot.
- 핵심 측정: **VisionTS encoder/decoder layer 별 motif 분포** vs **TS-native 모델의 motif 분포** 의 KL divergence.

### 예상 결과
- **가설 H1**: VisionTS encoder 초기 layer (1~8) 는 **diagonal/edge motif 비율 높음** (이미지의 local feature 추출, 시계열의 lag-1 자기상관과 정렬). 중간 layer (9~16) 는 **stripe motif** 비율 높음 (이미지 객체 boundary, 시계열의 periodic stripe).
- **가설 H2**: VisionTS decoder 는 **horizontal block motif** 가 강함 (input region ↔ horizon region cross-attention). TS-native 모델의 decoder 와 motif 분포 유사.

### 반증 조건
- VisionTS attention 위에서 APF 분류기가 6-class 중 어느 하나로 강하게 쏠리지 않고 균등 분포 (entropy 가 max 근처) 가 나오면 가설 기각. 그 경우 (i) 시계열 image 가 MAE 의 학습 분포에서 너무 멀어 attention 이 informative 패턴을 만들지 못함, (ii) APF 의 motif typology 가 vision-pretrained 의 attention 통계와 호환 안 됨 — 둘 중 하나.

### 비용 추정
- VisionTS PyPI 패키지 + APF 분류기 코드 결합: **1 일** (코드 hook 만 추가).
- 4 데이터셋 × 4 모델 × attention 추출 + 분류 + plot: **GPU 1 대 × 1 일**.
- 분석·정리·서브섹션 1 페이지 작성: **2 일**.
- **총 1 주일 안에 명확한 결과 산출 가능**.

### 의의
- 성공 시 → APF 페이퍼의 **Appendix C 1 페이지** 추가 표 + 핵심 narrative ("APF motif typology 가 cross-modal 일반 적용 가능") → 페이퍼 review 때 강한 답변 자료.
- 실패 시 → "APF typology 는 TS-native 한정" 이라는 boundary 자체가 paper 의 honesty 강화.
- 어느 쪽이든 본 논문 (VisionTS) 의 인용 정당화 + APF 페이퍼의 1 절 강화.

---

## 실험 2 — "VisionTSpp vs ProTran-TFA on Walmart / Istanbul Traffic — Probabilistic forecasting calibration 비교"

### 가설
VisionTSpp 의 quantile head (9 분위수) 는 frozen ImageNet MAE 의 reconstruction uncertainty 위에 추가된 module. 이게 **시계열 quantile coverage 측면에서 ProTran-TFA 의 학습된 quantile head** 보다 calibration 우위인가?

만약 VisionTSpp 가 잘 calibrated 이라면 본 논문의 free-lunch 주장이 probabilistic 측면에서도 유효 → P1 ProTran-TFA 의 motivation 약화 (또는 강화 — 금융 측에선 비정상·heavy-tail 도메인 강조로 차별화).

### 데이터
- **공통 PF 데이터셋**: Walmart sales (Kaggle 공개), Istanbul Traffic (govt 공개), Turkey Power (TEIAS 공개) — 본 논문 PF 그룹과 동일.
- **추가 finance 데이터셋**: S&P 500 daily log returns (1990-2023, Yahoo Finance), Bitcoin 1h log returns (2017-2023, Binance API). 비정상·heavy-tail 도메인으로 본 논문의 한계 검증.

### 비교 조건
| 모델 | 사전훈련 | fine-tune | quantile head |
|---|---|---|---|
| VisionTSpp (frozen) | ImageNet MAE Large | none (zero-shot) | 9 분위 (frozen MAE reconstruction noise) |
| VisionTSpp (1-epoch ft) | ImageNet MAE Large | 1 epoch | 9 분위 (ft) |
| ProTran-TFA | none (from scratch) | 50 epochs on target | 9 분위 학습됨 |
| Baseline-Naïve | seasonal naïve | n/a | empirical quantile from history |

### 측정 지표
- **Point**: MASE, sMAPE.
- **Probabilistic**: CRPS, pinball loss (9 분위수 평균), reliability diagram (각 분위수의 empirical coverage vs nominal).
- **Tail**: 분위수 0.05 / 0.95 의 coverage, 분위수 0.01 / 0.99 의 extreme coverage.

### 예상 결과
- **가설 H1**: 일반 PF 데이터셋 (Walmart / Istanbul Traffic / Turkey Power) 에서 VisionTSpp ≥ ProTran-TFA in CRPS, 비슷하거나 우위 in pinball.
- **가설 H2**: 금융 데이터셋 (S&P 500 / Bitcoin) 에서 ProTran-TFA > VisionTSpp 분명 — 특히 tail coverage 0.05/0.95 에서 VisionTSpp 는 underestimate 할 가능성.
- **가설 H3**: Calibration (reliability diagram) 에서 VisionTSpp 는 평균은 잘 맞으나 분위수 별로 들쭉날쭉, ProTran-TFA 는 더 smooth.

### 반증 조건
- H2 가 깨지고 VisionTSpp 가 금융 fat-tail 에서도 ProTran-TFA 와 비등하다면 → cross-modal vision prior 가 finance 의 통계 특성까지도 transfer 됨을 의미 → 강한 발견 (P1 페이퍼의 motivation 재검토 필요).
- H3 가 반대로 VisionTSpp 가 더 smooth calibration 이라면 → frozen pretrain 의 implicit regularization 효과 → P1 페이퍼에서 비교의 강한 motivation.

### 비용 추정
- VisionTSpp PyPI 코드 + ProTran-TFA 기존 자산 결합: **2 일** (기존 P1 코드 베이스 사용).
- 데이터셋 다운로드 + preprocessing (특히 Walmart sales): **1 일**.
- 5 데이터셋 × 4 모델 × 학습/평가: **GPU 1 대 × 3 일**.
- 결과 분석 + reliability diagram + 표 작성: **2 일**.
- **총 1~2 주일**.

### 의의
- 성공 시 → P1 ProTran-TFA paper 의 **Experiments §5 의 strong baseline 비교 표** 직접 사용. finance venue 측 narrative ("vision foundation 도 도전적 baseline" + "ProTran-TFA 는 fat-tail 도메인에서 우위") 강화.
- 실패 시 (H2 깨짐) → P1 의 motivation 재검토 필요 — 이건 오히려 정직성 측면에서 좋은 발견.
- 어느 쪽이든 **본 논문 (VisionTS) 의 finance 응용 boundary** 를 explicit 하게 보여주는 첫 외부 검증 결과 → 본 논문 인용 정당화 + P1 페이퍼 강화.

---

## 두 실험의 종합 일정 (현실적 추정)

| 주차 | 실험 1 진행 | 실험 2 진행 |
|---|---|---|
| W1 | VisionTS 패키지 + APF 분류기 코드 결합 | 데이터셋 다운로드 (Walmart, Istanbul, Turkey, SPX, BTC) |
| W2 | 4 데이터셋 × 4 모델 attention 추출 + motif 분류 + plot | VisionTSpp + ProTran-TFA 학습/평가 |
| W3 | 분석 + APF Appendix 작성 | Calibration plot + reliability diagram + P1 §5 표 |
| W4 | review + 추가 ablation (필요 시) | P1 페이퍼 §5 글쓰기 |

총 4 주, GPU 1 대 (RTX 4090 또는 동급) 로 충분. 두 실험 모두 본 논문 (VisionTS) 의 인용 정당성 + 내 연구 라인의 직접 강화로 보답한다.

---

## 이 절의 한 줄 요약

> "VisionTS 의 PyPI 패키지가 공개돼 있어 어느 실험이든 1 주일 이내 첫 결과 산출 가능. 실험 1 은 APF 의 cross-modal 확장, 실험 2 는 P1 ProTran-TFA 의 finance venue baseline 강화 — 두 실험 모두 본 논문의 직접 인용 가치를 정당화하면서 내 연구 진행에도 즉시 기여."
