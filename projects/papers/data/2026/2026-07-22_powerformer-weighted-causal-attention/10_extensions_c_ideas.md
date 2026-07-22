# 9-c. 사고 확장 — 실험 아이디어 2개

내 APF 연구에 직접 이식 가능한, 반증 가능한 두 실험. 둘 다 07_limits·09_my_research 에서 벼려진 물음을 실험으로 옮긴 것이다.

## 실험 1 — "형태 vs 국소성": 유효 문맥 창을 일치시킨 감쇠 형태 대조

- **가설**: Powerformer 의 MSE 이득은 거듭제곱 *형태 자체*가 아니라 "먼 과거 억제(국소성 규제)" 일반에서 온다. 즉 유효 문맥 창 $\tau$ 를 같게 맞추면 거듭제곱·지수·버터워스·하드 윈도우의 예측 성능이 수렴한다(귀무가설). 대립가설: 같은 $\tau$ 에서도 거듭제곱의 heavy-tail 이 유의하게 낮은 MSE 를 준다.
- **데이터**: ETTh1/h2/m1/m2, Weather (국소성 강, Powerformer 우호) + Traffic, Electricity (주기성 강, 열세 무대). 프로필 자산의 ETT-mini/Weather-mini/Traffic-mini 로 축소 재현 가능.
- **비교 조건**: 4종 감쇠(거듭제곱 $-\alpha\log t$ / 지수 $-\alpha t$ / 버터워스 / 하드 윈도우)를, 각각 어텐션 질량의 90%가 담기는 거리 $\tau$ 가 동일해지도록 파라미터를 보정한 뒤 비교. 예측길이 96/192/336/720.
- **예상 결과**: 국소성 데이터에선 형태 간 차이가 작고(→ 국소성 규제가 주원인), Traffic 처럼 주기성 데이터에선 어떤 단조 형태도 baseline(무감쇠) 대비 열세 — 형태보다 "단조성" 자체가 병목임을 드러낼 것.
- **반증 조건**: 동일 $\tau$ 에서 거듭제곱이 다른 형태를 전 데이터셋에서 유의하게(시드 5개, ±σ 겹치지 않음) 이기면 "형태가 원천" 가설이 살고 국소성-일반 가설이 반증된다.
- **비용 추정**: 4형태 × 2룩백 × 4예측길이 × 7데이터셋(축소) × 5시드 ≈ 1,120 run. 소형 트랜스포머라 GPU 1~2장, 3~5일. (APF 인프라 재사용.)

## 실험 2 — Powerformer 를 APF causal intervention 의 양성 대조군으로

- **가설**: 어텐션 motif 의 "기원"(순수 위치 편향 $M^{(L)}$ 유래 vs 내용 $S_h$ 유래)은 causal intervention 으로 분리 가능하다. Powerformer 는 diagonal motif 의 일부가 마스크로 하드코딩된 통제 기질이므로, intervention probe 가 옳다면 "$M^{(L)}$ 제거 시 motif 붕괴량"이 "$S_h$ 교란 시 붕괴량"보다 예측 가능한 방향으로 커야 한다.
- **데이터**: APF synthetic motif benchmark (trend/seasonal/regime/anomaly/freq drift) + UCR Archive(프로필 자산). motif 라벨이 있는 합성셋이 정답 대조에 필수.
- **비교 조건**: (i) 무개입 어텐션의 motif 맵, (ii) $M^{(L)}$ 만 제거(형태별 ablation), (iii) $S_h$ 만 셔플/교란, (iv) 둘 다 제거. 각 조건에서 CNN probe 로 diagonal/stripe/block/edge/spike/checker motif 강도 측정.
- **예상 결과**: (ii)에서 diagonal/stripe 밴드가 크게 약화(편향 유래분 노출), (iii)에서 데이터 특이 motif(block/checker 등)가 무너짐 — 두 기원이 분리돼 보일 것. ALiBi 셀과 대조하면 밴드 폭 차이(heavy-tail)까지 확인.
- **반증 조건**: (ii)와 (iii)의 motif 붕괴 패턴이 구분되지 않거나, $M^{(L)}$ 제거가 예측만 망치고 motif 맵은 그대로면, "probe 가 편향/내용 기원을 분리 못 함" — APF intervention 파이프라인의 재캘리브레이션 신호.
- **비용 추정**: 4개입 조건 × 2형태(거듭제곱/지수) × 합성셋 5종 × 3시드 ≈ 120 run + probe 학습. GPU 1장, 3~4일. 결과는 APF 논문의 intervention 절 양성 대조 도표로 직행.
