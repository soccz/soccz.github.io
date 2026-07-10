# 11. 한 줄 판결

> **머신러닝 예측기의 편향을 인과 모수 θ 로부터 "직교화" 로 격리해 √n-일치성을 회수하는 프레임워크 — Neyman orthogonality + K-fold cross-fitting 이라는 두 축의 조합이 이후 EconML · DoubleML · CausalML 계열 전 생태계의 문법을 정한 canonical 논문. P1 ProTran-TFA 의 factor 회귀 alpha 검정과 2022AEL tactical allocation 의 macro covariate 조정에 직접 이식 가능한 도구.**

## 판결의 이유 3줄

1. **canonical 지위**: 원거리 버킷 `causal-ml-finance` 태그 첫 커버로서 사용자 인과 추론 어휘집의 원점. 이후 GRF · AutoDML · 시계열 DML 등 확장 라인 모두가 이 논문을 substrate 로 삼음.
2. **사용자 자산 4곳 직접 이식**: P1 ProTran-TFA (pinball loss orthogonal score), 2022AEL (macro covariate 조정), AETHER (crypto sentiment endogeneity), APF (motif intervention IRM ATE). 원거리이지만 실질적 이식 가능성이 매우 높음.
3. **실무 gap 이 곧 확장 기회**: rate 조건 실무 검증 부재, 시계열 iid 위반, overlap 위반 등의 한계가 그대로 사용자의 novel contribution 자리 (실험 A: Quantile-DML, 실험 B: DML motif intervention) 로 확장됨.

## 핀 좌표 (내 연구 지도에서의 위치)

- **주 축**: `causal-ml-finance` 원점 · **원거리 버킷 canonical**
- **부 축**: P1 ProTran-TFA §3 (alpha detection) 필수 인용 · APF §5 (motif causality) 방법론적 substrate
- **다음 여정**: BCH 2014 (선행 sparse) → **[이 논문]** → GRF 2019 (경쟁 CATE) · AutoDML 2022 (후속 자동화) · 시계열 DML 2020 (확장) 4-방향 fan-out
