# 9. 사고 확장 (C) — 실험해볼 후속 아이디어 2개

## 아이디어 1 — "motif-conditioned steering": APF motif를 이 논문의 개입 틀로 정량화

- **가설**: APF의 2D attention motif(diagonal/stripe/block/edge/spike/checker) 각각에 대응하는 **residual-stream 방향**이 존재하며, 그 방향을 difference-of-means로 추정해 밀면 예측에 해당 motif가 인과적으로 주입/억제된다. 나아가 최적 개입 세기 $\alpha$와 창발 층은 **PE 종류(NoPE/sinusoidal/learned/RoPE/ALiBi)에 따라 체계적으로 달라진다.**
- **데이터**: APF synthetic motif benchmark(trend/seasonal/regime/anomaly/freq drift) — motif 라벨이 통제돼 있어 steering 방향 추정·평가에 이상적.
- **비교 조건**: (a) 개입 층위: attention 개입(APF 기존) vs residual steering(이 논문식) vs 둘 병행. (b) PE 5종. (c) 집계: mean vs median, single vs multi-token(이 논문 Fig 12 재현·확장).
- **예상 결과**: residual steering이 attention 개입보다 **부작용이 적고**(비목표 motif 보존율↑) 인과 방향이 선명. RoPE/ALiBi 같은 상대 PE에서 motif 방향이 특정 중간 층에 응축.
- **반증 조건**: steering 방향이 motif를 주입하지 못하거나(분류 정확도 상승 없음), 목표 외 motif까지 무차별 교란하면(보존율↓) "motif = 선형 방향" 가설 반박 → APF의 residual 확장 포기.
- **비용 추정**: 소형 Transformer(APF 기존 스케일) × PE 5종 × motif 6종 재학습·개입. GPU 며칠 수준, 대형 TSFM 불요(합성 벤치라 경량).

## 아이디어 2 — "grok-tracked localization": 학습 시간축을 따라 개념 응축 추적

- **가설**: 이 논문의 LDR 개념 국소화는 **학습이 끝난 스냅샷**이다. grokking(지연 일반화)이 일어나는 모델에서 LDR을 **에폭마다** 측정하면, 개념 응축(특정 층에서 LDR 급증)이 **grok 전이 시점과 동기화**되어 일어난다. 즉 "일반화의 순간 = 개념이 층에 응축되는 순간".
- **데이터**: Grokking track 보유 자산 — logistic map, sin/periodic synthetic, regime-switching synthetic(프로필 명시). grokking이 재현되는 통제 환경.
- **비교 조건**: (a) grokking 발생 vs 미발생(weight decay·데이터 크기 조절). (b) 층별 LDR 궤적 vs 검증 정확도 궤적의 시간 정렬. (c) CKA 층 중복도 함께 추적(중복이 grok 시점에 재편되는가).
- **예상 결과**: 검증 정확도가 급상승하는 grok 지점 직전/직후에 특정 층 LDR이 계단식 상승 → "개념 국소화의 창발 = 회로 형성 = grokking"의 삼각 연결.
- **반증 조건**: LDR이 grok과 무관하게 매끄럽게 증가하거나, 정확도 전이와 시간 정렬이 안 되면 "개념 응축 ≠ 일반화 전이" → 연결 가설 기각(연결 약함으로 정직히 보고).
- **비용 추정**: 소형 4-layer Transformer(프로필의 P2 logistic 실험 스케일) × 조건 몇 개 × 조밀한 체크포인트 저장. 저비용, 단 체크포인트별 LDR/CKA 재계산 파이프라인 필요.

**주의(연결 강도)**: 아이디어 1은 APF와 강결합(자산·프레임 직접 매칭). 아이디어 2는 Grokking track과 **전이 가능성** 수준 — 이 논문이 training dynamics를 다루지 않으므로, "사후 도구를 시간축으로 확장"하는 나의 가공이 개입된다. 그 가공이 성립하는지가 아이디어 2의 성패.
