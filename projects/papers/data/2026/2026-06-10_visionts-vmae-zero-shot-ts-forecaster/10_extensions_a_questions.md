# 10 · 사고 확장 (a) — 자문 질문 5개

각 질문은 본 논문이 직접 답하지 못한 영역이거나, 답했더라도 본 환경에서 본문 표 미확인이라 단정 못 하는 영역에서 출발한다. 질문 자체와 **"왜 이 질문이 중요한가"** 의 2~3 줄을 짝지어 둔다.

---

## 질문 1 — "ImageNet pretrained MAE 가 시계열을 잘 푸는 것은 (a) 시각적 prior 의 일반성 때문인가, (b) 시계열 차트가 자연 이미지의 좁은 manifold 안에 우연히 들어 있기 때문인가?"

**왜 이 질문이 중요한가**: 답이 (a) 면 본 논문의 메시지는 "모든 vision foundation 이 시계열 transfer 가능" 으로 일반화된다. (b) 면 "ImageNet 이라는 특정 pretrained corpus 와 운 좋은 일치" 로 일반성이 약해진다. 검증법: medical imaging pretrained MAE, satellite pretrained MAE, microscopy pretrained MAE 등 **다른 도메인의 MAE 가중치** 를 같은 VisionTS 인터페이스에 끼우고 zero-shot ranking 비교. ImageNet 만 잘 작동하면 (b), 모든 vision MAE 가 작동하면 (a).

**APF 연결**: APF 의 motif 분류기로 ImageNet MAE vs medical MAE vs satellite MAE 의 시계열 image 위 motif 분포를 측정하면, 어느 backbone 이 "어떤 motif" 를 만드는지 비교 가능. cross-modal motif geometry 의 새 narrative.

---

## 질문 2 — "Mask 가 contiguous block (예측 horizon) 일 때 MAE 가 random sparse mask 대비 어떤 attention re-routing 을 보이는가?"

**왜 이 질문이 중요한가**: He 2022 의 MAE 학습 분포는 random 75% mask. VisionTS inference 의 mask 는 contiguous block. 이 분포 mismatch 가 zero-shot 성공의 잠재적 약점. Mech interp 측에선 "특정 head 가 random mask 와 contiguous mask 를 다르게 처리하는가" 가 직접 측정 가능 (attention pattern 추출). 만약 그렇다면, contiguous mask 에 적응한 head 는 시계열의 인과 (왼쪽→오른쪽) 를 implicit 하게 학습한 것.

**APF 연결**: APF 의 motif 분류기 위에서, random mask vs contiguous mask 의 motif 분포 차이를 측정. **stripe motif 가 contiguous 에서 더 많아진다면** MAE 의 자기지도 학습이 시계열 인과의 implicit 회로를 갖고 있다는 강한 증거.

---

## 질문 3 — "Periodicity 외부 지정의 robustness 한계는 어디인가? FFT 자동 탐지로 대체했을 때 성능이 떨어지는가, 유지되는가, 오르는가?"

**왜 이 질문이 중요한가**: 본 논문의 단순함 (periodicity 외부 지정) 이 강점이지만, 실제 deploy 환경에서는 periodicity 가 자명하지 않은 도메인 (mixed-frequency macro, irregular events, regime-switching seasonality) 이 많다. FFT 로 자동 탐지하면 (i) zero-shot 의 free-lunch 자산 일부 깎임 (학습 가능 모듈 추가 또는 hyperparameter free 한 numerical step 추가), (ii) robustness 강화. 둘 사이 trade-off curve 가 본 논문의 follow-up 핵심.

**P1 ProTran-TFA 연결**: 금융 시계열 (자산 수익률) 은 명확한 periodicity 없음. VisionTS 의 단일 periodicity 가 작동 못 할 가능성 큼 → ProTran-TFA 의 multi-scale attention 이 우위 가능. 이 실험 자체가 P1 페이퍼의 motivation 강화.

---

## 질문 4 — "VisionTS 의 forecasting 출력이 calibrated 인가? (즉 zero-shot 으로도 quantile coverage 가 맞는가?)"

**왜 이 질문이 중요한가**: VisionTS 본문은 point forecasting. VisionTSpp 가 quantile_head_num=9 로 확장. 그런데 quantile head 가 추가로 학습됐는지, 또는 frozen pretrained MAE 의 reconstruction uncertainty 를 그대로 quantile 로 환산하는지가 calibration 의 핵심. 만약 frozen MAE 가 reconstruction noise 의 variance 를 자연스럽게 가지고 있다면, 추가 학습 없이도 calibration 이 가능한 free-lunch — 이건 본 논문의 더 강한 주장.

**P1 ProTran-TFA + 금융 응용 연결**: 금융 risk 측에선 quantile coverage 가 결정적 (VaR, ES 평가). VisionTSpp 의 calibration 정량 평가 (CRPS, pinball loss, reliability diagram) 를 ProTran-TFA 의 동일 데이터셋에서 비교하면 P1 페이퍼의 calibration 절 strong baseline.

---

## 질문 5 — "VisionTS 의 zero-shot transfer 가 통하는 시계열의 표면적 조건은 무엇이며 (low-noise / strong periodicity / smooth trend), 통하지 않는 시계열은 (regime-switch / heavy-tail / spike-train) 어떻게 식별 가능한가?"

**왜 이 질문이 중요한가**: 본 논문은 평균 ranking 으로 강하나, 도메인별 실패 case 의 분류는 본 환경에서 본문 미확인. Practical deploy 측면에선 **"이 시계열은 VisionTS 를 써도 되는가?" 를 사전 판단하는 분류기** 가 필요. 시계열의 ACF 형태 / power spectrum / kurtosis / regime shift count 등의 통계량으로 zero-shot transfer 의 적합성 score 를 만들 수 있는지가 다음 application paper 의 좋은 주제.

**연결**: APF 의 motif 분류기를 시계열의 *intrinsic* attention map (TS-native transformer 가 학습한) 에 적용하면 시계열의 type 분류 가능. 그 type 별로 VisionTS zero-shot 성능을 보면 적합성 score 가 도출됨. **APF × VisionTS** 의 직접 결합 결과.

---

## 5 질문의 종합 정리

| 질문 | 핵심 검증 도구 | 추정 결과 의의 |
|---|---|---|
| Q1 | 다른 vision MAE backbone 으로 swap 실험 | 본 논문의 일반성 boundary 결정 |
| Q2 | MAE attention map 의 mask-type 차이 분석 | implicit causality 검증 |
| Q3 | FFT 자동 탐지 변형 vs 단일 periodicity 비교 | robustness frontier |
| Q4 | Quantile coverage / CRPS / reliability | calibration free-lunch 검증 |
| Q5 | 도메인별 표면 통계 → VisionTS 성공률 회귀 | practical deploy guidance |

이 5 질문 중 Q1, Q2, Q5 는 **APF 페이퍼의 cross-modal 확장 Appendix** 와 직접 결합 가능. Q3, Q4 는 **P1 ProTran-TFA 의 finance venue 강화** 와 연결.
