# 11. 한 줄 판결

> **"LLM-for-TS 라는 '대유행' 에 대해, '플라시보를 빼도 같다' 는 ablation 으로 1 년치 hype 의 공기를 빼버린 NeurIPS 24 Spotlight. APF · Grokking 양 트랙의 '시계열 트랜스포머가 실제로 뭘 학습하는가' 를 묻는 모든 후속 논문의 의무 인용 baseline."**

## 보충 — 이 판결의 이유 3줄

- 본 논문의 **3 ablation × 3 base × 7 dataset** 격자가 *attribution fallacy* 를 architecture 레벨 ablation 으로 정면 해결 — DLinear (Zeng 2023) 의 *전체-architecture 회의* 에서 *백본 회의* 로 sharpening, ACDC (Conmy 2023) 의 *회로 ablation* 정신을 architecture-block 수준으로 확장.
- **PAttn** 의 *patch + 1-layer attention + 2 linear* 의 minimum 베이스라인 + 저자 공식 GitHub 의 `seq_len=512, d_model=768, n_heads=16, patch_size=16` 디폴트는 APF 의 motif causality 실험의 *clean substrate*, Grokking track 의 *깊이 vs grokking* 측정의 *비교축*, ProTran-TFA 의 *probabilistic 확장 출발점* 으로 직접 이식 가능.
- 한계가 명확 — **자연어 사전학습 LLM** 에 한정, **point forecast (MSE/MAE)** 만, **in-domain** 만 — 이라는 점이 *오히려 본 결론을 robust* 하게 만들고, *나의 niche 영역 (분포 forecast, zero-shot, motif typology, grokking)* 의 빈 공간을 명확히 표시. Tan 2024 가 *못 다룬 곳* 이 나의 *연구 윈도우* 의 정의.

## 핀 — 내 연구 지도 위치

> **APF paper § Methods (motif backbone 선택) + Grokking paper § Background (task boundary 정당화) + ProTran-TFA paper § Related Work (LLM-finance 회의주의 baseline) 의 *세 곳에 동시* 인용 핀.**
