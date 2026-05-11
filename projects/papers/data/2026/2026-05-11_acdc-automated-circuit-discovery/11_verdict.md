# 10. 한 줄 판결

> **ACDC 는 mech interp 의 회로 발견을 *알고리즘 + 단일 hyperparameter τ* 의 비교 인터페이스로 환원시킨 작업이며, 그 가치는 *최강 알고리즘* 으로서가 아니라 *분야의 비교 좌표축* 으로서다. APF §4 의 motif causal intervention 의 backbone, Grokking-TS §3 의 checkpoint-delta circuit isolation 의 backbone — 두 active track 모두에 *알고리즘 그대로 + 입력 차원만 바꿔* 차용한다.**

## 판결의 보충 (3 줄)

1. **수용**: edge-level recursive prune + threshold τ 의 *알고리즘 형식* 그대로 APF 와 Grokking-TS 의 인과 검증 절에 차용. tracr 류 *컴파일된 ground-truth* 접근법도 두 track 의 sanity check 표준으로 채택.
2. **경계**: ACDC 의 *greedy* 약점 (cooperative effect 누락), *단일 metric* 가정 (non-stationary task 에서 깨짐), *비용* (큰 모델에서 비현실적) 은 그대로 상속. limitation 절에서 정직히 명시 + 보완 방법 (multi-seed Jaccard, regime-aware corrupted distribution, EAP hybrid) 을 제시.
3. **대체**: 가까운 미래에 *최강 알고리즘* 자리는 EAP / EAP-IG / SFC 가 가져가도, ACDC 의 *비교 기준점* 자리는 5 년은 유지될 것 — 두 active track 의 모든 후속 작업이 *ACDC vs ours* Pareto frontier 로 비교됨을 전제로 paper 를 설계.
