# 11_verdict — 한 줄 판결

> **"호가창은 시간 × 가격레벨 2D 이미지다" — DeepLOB 는 LOB 의 raw 40-dim × 100-tick 행렬을 1×2 → 4×1 → 1×10 으로 잘게 썰어 가격-거래량 짝과 다단계 가격레벨 의존성을 분리 추출하고, 그 위에 Inception 으로 다중 시간 스케일을, LSTM 으로 장기 의존을 얹는다. FI-2010 에서 75.35% 정확도 (3-class)·F1 0.7533 으로 동시기 SOTA 갱신했고, 학습에 한 번도 나오지 않은 종목에서도 작동하는 'universal features' 를 처음 실증해 마이크로구조 ML 의 표준 baseline 이 됐다.**

## 보충

이 논문은 *architecture engineering 의 모범 사례*. 도메인 지식 (LOB 의 가격·거래량·bid·ask·10 레벨 위계) 을 conv 커널 모양으로 흡수해 작은 모델 (143K param) 로 큰 성능을 낸 점은 *데이터·모델 크기 trade-off* 의 한 정량적 점.

그러나 그 우수성이 *실거래 PnL* 로 환산되는지, conv 위계 가정이 *진짜 본질* 인지 (vs random permute), universal features 가 *어떤 패턴* 인지 — 본 논문은 답하지 않는다. 이것이 *후속 연구의 큰 공간* 이며, 그 공간의 한 모서리가 내 APF/Grokking 작업의 자리.

**핀 위치**:
- §F market-microstructure 첫 커버 (0 → 1).
- APF paper 의 §3 Background "Hard inductive bias for spatial structure" 에 인용.
- Grokking paper 의 §4 Experimental Plan "LOB 도메인 cross-architecture 비교" 에 baseline.
