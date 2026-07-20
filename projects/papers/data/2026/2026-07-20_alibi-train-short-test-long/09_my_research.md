# 8. 내 연구와의 연결

> **§9 봉인 준수**: 아래 연결은 `_profile.md`·`_index.md`에 문자 그대로 적힌 사실만 근거로 한다. APF/Grokking 프로젝트의 절 번호·지도교수 등 프로필 밖 세부는 사용하지 않으며, 미상 항목은 "프로필 기준 미상"으로 표기한다.

ALiBi는 `_profile.md`가 명시한 두 active track 모두에 **직접·강하게** 붙는다 — 우연이 아니라, ALiBi가 두 track 공통의 PE 축에 이미 하나의 셀로 들어가 있기 때문이다.

## §A/§C 연결 1 — APF: "ALiBi 셀"은 이미 실험 격자에 있다 (강한 연결)

`_profile.md`(APF)는 프레임워크를 **"PE → 2D attention motif → CNN probe → causal intervention"**, 실험 축을 **PE 비교(NoPE / sinusoidal / learned / RoPE / **ALiBi**) × motif 종류(diagonal / stripe / block / edge / spike / checker)** 로 적는다. 즉 ALiBi는 APF의 5개 PE 셀 중 하나다.

- **흡수할 기법**: ALiBi 셀의 구성을 이 논문 §3 그대로 고정한다 — 위치 임베딩 제거 + head별 기울기 $m_h=(2^{-8/n})^h$ 기하수열. 이 고정 스펙이 있어야 "ALiBi 셀"이 재현 가능한 하나의 조건이 된다.
- **구체적·검증 가능한 예측(mechanism 지정)**: ALiBi의 편향은 causal 대각선을 따라 **거리 선형으로 감쇠하는 밴드**다. 따라서 APF의 motif taxonomy에서 ALiBi 셀은 **diagonal/stripe motif가 강하게, block/checker는 약하게** 나올 것으로 예측된다 — 편향 자체가 "대각 근방 집중"을 하드코딩하기 때문. 이는 RoPE 셀(회전의 주파수 채널이 stripe/checker를 유도)과 대비되는 **명확한 반증 가능 가설**이다. RoPE=곱셈 회전 vs ALiBi=덧셈 거리벌점이라는 §08의 대수 대비가 motif 구조 예측으로 직결된다.
- **인용 포인트(초안, 절 번호 미상)**: APF 원고의 PE 축 설명 문단에서 — "additive distance-penalty 계열의 대표로 ALiBi(Press et al., 2022)를 두어, 곱셈적 RoPE(Su et al., 2021)와 대비한다. ALiBi는 value에 위치를 주입하지 않으므로(본 논문 §3), motif가 순수하게 어텐션 로짓 편향에서만 발생한다는 점에서 인과 분리(causal intervention)의 깨끗한 대조군이 된다." — 사용자 원고의 정확한 삽입 절은 프로필 기준 미상이므로 문장 형태만 제안.

## §B/§C 연결 2 — Grokking-TS: PE 5-way 그리드의 ALiBi 셀 + 비정상성 축 (강한 연결)

`_index.md`·`_coverage.md`의 RoFormer/Kazemnejad 노트가 적은 대로, Grokking-in-TS track은 **PE 축 5-way(NoPE/sinusoidal/learned/RoPE/ALiBi) 실험 그리드**를 갖고, `_profile.md`는 이 track을 **"Grokking × TS forecasting × non-stationarity × circuit analysis"** 4-교차로 적는다.

- **흡수할 기법 + 충돌 지점**: ALiBi의 recency bias는 "가까운 것에 집중"을 하드코딩한다. **비정상 시계열(regime shift)** 에서 이는 양날의 검이다 — regime 경계 직후에는 최근 정보가 곧 유효하므로 recency가 유리하지만, **먼 과거의 같은 regime을 참조해야 하는 장주기 계절성**에서는 단조 감쇠가 결정적 lag를 눌러버린다(§07 암묵 가정 1). 따라서 ALiBi 셀은 Grokking-TS의 non-stationarity 축에서 **"recency가 도움되는 shift 유형 vs 방해되는 유형"을 가르는 진단 도구**가 된다.
- **반면교사(핵심)**: 이 논문 부록 §B.2의 자기-유보 — "외삽 이득이 긴 문맥 사용이 아니라 early token curse 완화일 수 있다" — 는 Grokking-TS에 그대로 이식할 경고다. TS forecasting에서 "긴 lookback을 줬는데 성능이 유지된다"가 **정말 긴 의존성을 학습(grokking)한 것인지, 단지 붕괴하지 않은 것인지**를 구분하는 프로토콜(먼 lag에만 정답이 있는 synthetic 과제)을 반드시 설계해야 한다. ALiBi가 이 구분을 스스로 못 했다는 점이 우리 실험 설계의 필요조건을 알려준다.
- **데이터 매칭**: 프로필의 보유 자산 중 **regime-switching synthetic·logistic map**(recency 유·불리 대비용)과 **Weather-mini·Traffic-mini**(장주기 계절성으로 ALiBi 감쇠의 약점 노출용)가 위 두 진단에 바로 쓰인다.

## §E 연결 3 — P1 ProTran-TFA (연결 약함, 전이 가능성만)

paused P1 ProTran-TFA(finance venue 가능, quantile forecast)에 ALiBi를 얹는 것은 가능하나 **연결 약함**으로 표기한다: ProTran-TFA의 핵심은 확률·quantile head이지 PE 외삽이 아니며, 금융 시계열의 짧은 유효 문맥에서는 ALiBi 외삽 이득이 두드러지지 않을 수 있다. 전이 가능성은 "긴 lookback을 값싸게 학습하는 위치 방법 후보" 수준에 그친다.

## 종합: 흡수 / 충돌 / 반면교사

- **흡수**: ALiBi 셀의 §3 스펙(임베딩 제거 + 기하수열 기울기)을 APF·Grokking-TS의 PE 그리드에 재현 가능한 조건으로 편입.
- **충돌**: 단조 recency 감쇠가 장주기 의존성과 충돌 → APF motif 예측(diagonal/stripe 편중)과 Grokking-TS non-stationarity 진단의 축으로 전환.
- **반면교사**: §B.2의 "외삽≠장거리 활용" 유보를 우리 실험의 **필수 대조 프로토콜**(먼-lag-only 과제)로 승격.
