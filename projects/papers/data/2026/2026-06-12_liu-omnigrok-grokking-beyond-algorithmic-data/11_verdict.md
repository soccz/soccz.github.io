# 11 · 한 줄 판결

**Omnigrok 은 grokking 의 "원인 가설" 을 *데이터·작업 종류* 가 아니라 *weight norm 공간 위 reduced loss landscape* 의 기하학(L-자 train · U-자 test) 으로 옮기면서, 그 정성적 메커니즘 하나로 알고리즘 데이터셋(modular addition) · 표준 분류(MNIST · IMDb) · 분자 회귀(QM9) 까지 한 우산으로 묶는 데 성공한 — Grokking in TS Transformers track 의 "랜드스케이프-수준 원인 가설" 슬롯에 정확히 들어맞는 ICLR 2023 Spotlight 이정표이며, APF 의 PE-attention motif framing 에도 (weight norm 대신 PE 종류를 축으로 두는) 평행한 landscape 분해 발상의 가능성을 던진다.**

## 이유 3 줄

1. **인용 슬롯**: 사용자 paper 의 *Background §"Causal Hypothesis for Grokking"* 의 가장 강한 universal-mechanism 인용 후보 — Power (discovery) · Liu Effective Theory (toy mechanism) · Nanda (algorithmic mechanistic) · Lyle (dynamic extension) 와 함께 chain 의 한 자리를 영구 차지.
2. **차별화 잡이**: 본 논문의 *static landscape* 가정이 사용자의 *non-stationary TS 의 dynamic Goldilocks zone $w_c(t)$* 가설의 직접 contrast — paper 의 differentiator 가 본 논문을 *반박이 아닌 확장* 의 포지셔닝으로 자연스럽게 잡힘.
3. **실험 비용 적은 후속**: 사용자 P2 logistic 실험 코드에 *sphere-projected reduced landscape mode* 한 줄 추가만으로 본 논문의 TS 확장 (Idea 1) 또는 APF layer-wise 확장 (Idea 2) 직접 실행 가능 — 1-2 주 sweep 으로 NeurIPS Workshop / ICLR Tiny Paper grade 결과 도출 잠재.
