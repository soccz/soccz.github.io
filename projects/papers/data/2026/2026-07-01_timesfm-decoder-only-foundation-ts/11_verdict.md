# 11. 한 줄 판결

## 판결

TimesFM 은 "패치를 토큰처럼 다루는 디코더 전용 Transformer"라는 언어 모델 문법을 시계열에 최소 손실로 이식해서 100B time-points 코퍼스만으로 zero-shot 성능을 supervised SOTA 근처까지 밀어올린 **TSFM 패러다임의 최소 골격**이지만, 확률 예측 모듈이 논문 시점(2024)에는 미보정·실험적 부속물이었고 학습 코퍼스가 비공개라 재현이 부분적이라는 두 약점이 있다 — **APF/Grokking track 의 attention motif 관찰용 zero-shot substrate 로는 iTransformer/Chronos/MOIRAI 와 함께 3-4번째 채점판이지만, ProTran-TFA 같은 정직한 확률 예측 track 에 그대로 이식할 수는 없다.**

## 판결의 이유

1. **아키텍처 minimalism**: decoder-only + patching + regression head 라는 3-요소 최소 조합이 자연스러운 시계열-언어 이식이라는 점에서 후속 TSFM 의 vocabulary 기준점.
2. **Corpus 규모의 정공법**: 100B time-points 는 "TS foundation model 은 corpus scale 이 부족해 안 되나?" 라는 오랜 회의에 정면 답. 다만 corpus 가 비공개.
3. **정직한 스코프 표기**: 저자 스스로 "quantile heads not calibrated", "point forecasts", "univariate" 를 v1 README 에 명시 → 이 논문의 스코프 밖 응용 (확률 예측, 다변량, tail risk) 은 P1 ProTran-TFA · MOIRAI · Chronos 로 넘어가야 함이 명확.
4. **연구 지도상 위치**: 사용자의 두 active track (APF · Grokking) 에는 large-scale substrate 로, paused P1 에는 point-only baseline + calibration gap motivator 로 편입.
