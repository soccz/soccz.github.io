# 7. 이론적 계보

> **배경 사다리**: 이 절은 "이 논문이 누구의 어깨 위에 서 있고, 누구와 경쟁하며, 무엇을 낳을 것인가"를 다룬다. 각 논문의 arXiv ID·venue 는 이 레포가 이미 커버해 확인한 것 또는 원문 참고문헌에서 확인한 것만 적는다.

---

## 7.1 이론적 조상

### ① Sugihara & May 1990 — Simplex projection (원문 §Appendix F.3, Figure 7 에서 직접 인용)

비선형 동역학의 예측을 **"상태공간에서 이웃을 찾아 그들의 미래를 가중평균한다"** 로 정의한 원조다. 연결선은 원문 스스로 긋는다 — Appendix F.3 은 context parroting 을 *"an in-context nearest neighbor algorithm"* 으로 규정하고 simplex projection·S-map 과의 관계를 논한다. **차이는 딱 하나: simplex 는 여러 이웃을 가중평균하고, parroting 은 최근접 하나를 그대로 베낀다.** Appendix F 의 커널 폭 $\sigma$ 가 정확히 이 축이며, $\sigma \to 0$ 이 parroting 이다. 즉 본 논문의 이론적 기여는 **새 알고리즘이 아니라 기존 알고리즘 족을 하나의 축으로 정렬한 것**이고, 그 축의 반대편 끝에 "평균으로 뭉개기"(=TSFM 실패 모드)를 배치한 것이 통찰이다.

### ② Olsson et al. 2022 — In-context Learning and Induction Heads (§2 에서 개념 인용)

원문 §2 verbatim: *"In its simplest form, an induction head copies repeating tokens in the context to make predictions."* 이 계보 덕분에 논문은 "베이스라인이 이겼다"를 넘어 **"모델이 하고 있는 일이 무엇인지"** 를 말할 자격을 얻는다. 다만 [07_limits.md](07_limits.md) 반박 1 에서 지적했듯 **유비 수준의 인용**이며, 원 계보가 갖춘 인과 개입(어텐션 헤드 절제, 활성화 패칭)은 본 논문에서 수행되지 않는다. **이 레포 관점에서 중요한 것**: 이 인용이 mech interp 어휘가 시계열 파운데이션 모델로 건너오는 다리이며, `_index.md` priority Tier 2 의 arXiv:2209.11895(미커버)가 정확히 그 다리의 반대편 기둥이다.

### ③ Gilpin 2021 — dysts 벤치마크 (§5.1)

본 논문의 실험 인프라 전체가 이 위에 있다. **135개 시스템 × Lyapunov 시간 정규화 샘플링**이라는 설계가 없었다면 $\alpha$ vs $1/d_{\mathrm{cor}}$ 검증도, "특정 시스템 트릭 아니냐"는 반론 봉쇄도 불가능했다. 동시에 [06_experiments_a](06_experiments_a_chaos.md) 에서 지적한 **저자 편향·차원 편향(3~6차원)** 의 출처이기도 하다. 벤치마크를 소유한다는 것은 논증의 자산이자 부채다.

### ④ Zhang & Gilpin 2024 — Zero-shot forecasting of chaotic systems (arXiv:2409.15771, ICLR 2025)

**이 레포가 2026-08-12 에 커버한 바로 그 논문**이며, 본 논문 §1 이 명시적으로 출발점으로 삼는다: *"It was recently observed that one such foundation model, Chronos (Ansari et al. 2024), often employs an extremely simple strategy when forecasting chaotic systems (Zhang & Gilpin 2024)."*

이 관계가 특이한 이유는 **후속작이 전작의 헤드라인을 약화시킨다**는 점이다. 전작은 "TSFM 이 카오스를 zero-shot 으로 예측한다"를 보고했고, 본작은 "그 능력의 상당 부분이 문맥 복사였다"고 되짚는다. 저자가 같으므로 논쟁이 아니라 **자기 교정**이며, 인용 관점에서는 **전작만 인용하는 것이 곧 오인용**이 되는 구조를 만든다.

## 7.2 평행 연구

### ① DynaMix (Hemmer & Durstewitz 2025) — 동역학계 전용 파운데이션 모델

본 논문의 비교군에 들어 있으면서 **가장 강한 반례**를 제공한다. Table 3 난류 행에서 DynaMix 0.005±0.008 이 Parrot 0.028±0.044 보다 낮고, Table 4 최대 Lyapunov 지수 상관에서 DynaMix 0.466±0.071 이 Parrot 0.343±0.018 을 앞선다. **즉 "범용 TSFM 은 물리를 못 배웠다"는 맞지만 "파운데이션 모델은 물리를 못 배운다"는 틀렸다.** 어느 영역에서 상대가 나은가에 대한 답: **카오스성 자체(발산율)의 재현**에서 동역학 전용 모델이 낫다. 본 논문이 이 사실을 표에 싣고도 서사에서 크게 다루지 않은 것은 아쉽다.

### ② 범용 TSFM 진영 (Chronos / TimesFM / MOIRAI / Time-MoE)

이 레포가 각각 2026-04-29(Chronos) · 2026-07-01(TimesFM) · 2026-06-03(MOIRAI) 에 커버한 모델들이다. 이들의 서사는 "대규모 사전학습 → 보편적 제로샷 전이"였다. **본 논문이 이긴 이유는 성능이 아니라 프레이밍이다** — 같은 성능표를 놓고 "SOTA 달성"이 아니라 "복사 하한선 대비 초과분"으로 읽는 관점을 도입했다. 반대로 이들이 나은 영역도 명확하다: **짧은 문맥**(Figure 4 verbatim: *"Chronos does better for shorter contexts"*), **확률 예측**(parroting 은 예측 구간을 못 낸다), 그리고 Table 1·2 의 **난류 과제**.

### ③ Tan et al. 2024 — Are Language Models Actually Useful for Time Series Forecasting? (arXiv:2406.16964, NeurIPS 2024 Spotlight)

이 레포가 2026-06-17 에 커버했다. 방법론적으로 **같은 장르의 논문**이다 — "화려한 구성요소를 제거해도 성능이 유지된다면 그 구성요소는 성능의 원인이 아니다"라는 제거 논증. 차이는 제거 대상이다. Tan et al. 은 **LLM 백본을 제거**했고, 본 논문은 **모델 전체를 제거**하고 검색만 남겼다. **본 논문이 더 강한 결론에 도달한 이유**는 대안을 제시했기 때문이다 — 단순히 "쓸모없다"가 아니라 "이걸 이겨야 한다"는 눈금자를 제공했다.

### ④ DLinear 계열 (Zeng et al. 2023, 사전 독파 목록)

"단순 베이스라인이 트랜스포머를 이긴다"는 시계열 분야의 반복되는 서사. 다만 DLinear 는 **학습되는** 베이스라인이었고 parroting 은 **학습 파라미터가 0개**다. 논증의 순도가 한 단계 높다.

## 7.3 후손 예측

### 후손 1 — Parrot-adjusted 리더보드 (가장 확실히 나올 것)

TSFM 벤치마크 논문들이 표에 **"Parrot" 열**을 추가하고, 성능을 절대값이 아니라 **parroting 대비 초과분(excess-over-parroting)** 으로 보고하기 시작할 것이다. 이 논문의 §6 문장이 사실상 그 요구다: *"If a foundation model cannot beat context parroting, it arguably has failed to learn the underlying physics of the system."* 코드가 공개돼 있고 20줄이면 재구현되므로 채택 장벽이 사실상 0 이다.

### 후손 2 — TSFM 안에서 induction head 를 실제로 찾는 mech interp 연구 (가장 가치 높음)

본 논문이 유비로 남긴 자리를 회로 수준에서 메우는 연구. 필요한 것은 (i) TSFM 어텐션에서 $s_{opt}$ 로 향하는 질량 측정, (ii) 해당 헤드 절제 시 parroting 이탈 여부, (iii) 층별 국소화. **이 레포 관점에서 결정적으로 중요하다** — `_index.md` priority 의 arXiv:2511.21514(Kalnāre et al., TS classification 대상 mech interp)와 본 논문이 만나는 지점이며, `_profile.md` §B·§D 교차 영역이 정확히 여기다. 그리고 2026-07-29 커버한 arXiv:2409.12915(Wiliński et al., TSFM 표현·개입)가 이미 개입 도구를 갖고 있으므로, **세 편을 합치면 실행 가능한 연구 설계가 즉시 나온다.**

### 후손 3 — 비정상성 하에서의 parroting 붕괴 곡선

[07_limits.md](07_limits.md) 반박 2 에서 설계한 실험이 그대로 논문이 된다. 어트랙터가 드리프트할 때 "복사"와 "학습된 사전지식" 중 누가 먼저 무너지는가. 이것이 **금융·기후 응용에서 유일하게 의미 있는 질문**이며, 본 논문의 dysts 실험이 구조적으로 답할 수 없는 질문이다. `_profile.md` §B(Grokking × non-stationarity)와 §E(금융 시계열) 양쪽이 여기서 만난다.

## 7.4 계보 한 줄 요약

**Sugihara–May 의 최근접이웃 예측이 Gilpin 의 벤치마크 위에서 Olsson 의 induction head 어휘를 입고 파운데이션 모델 시대로 귀환했으며, 그 귀환의 형태는 새 모델이 아니라 새 눈금자였다.**
