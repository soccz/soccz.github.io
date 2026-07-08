# 10. 한 줄 판결

**TFT 는 "해석 가능성"을 attention·gating·quantile 세 축에 심어 놓았지만, 그 셋 모두 attention-is-not-explanation 계보의 반박에 노출되어 있다 — 실무 표준으로 남을 만큼 강력하지만, mechanistic interpretability 관점에서는 attribution 이 causal intervention 없이 correlation-attribution 수준에 머물러 있음을 명시하고 인용해야 한다.**

## 이유 보충 (2-3 줄)

TFT 는 forecasting 실무에서 5-tier 인터페이스와 다중 quantile pinball 을 표준으로 확립한 결정적 논문이며, 사용자 P1 ProTran-TFA 재개 시 인용 안 하면 reviewer 가 지적할 baseline. 그러나 (i) attention weight 시각화는 Jain-Wallace 2019 반박 궤도에 그대로 노출되고, (ii) LSTM 층의 실제 기여도가 후속 iTransformer 계열에 의해 흐려졌으며, (iii) quantile crossing 을 architectural constraint 로 강제 안 한 부분이 TimesFM v2.5 의 `fix_quantile_crossing` 옵션으로 후향적 문제 확인. 그러므로 인용은 **baseline + interpretability 한계 짝** 으로 하는 것이 정직하다.
