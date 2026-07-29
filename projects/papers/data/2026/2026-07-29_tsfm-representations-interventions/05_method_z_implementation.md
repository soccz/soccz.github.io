# 4. 방법론 해부 (Z) — 구현 디테일

**이 부분이 왜 필요한가**: 위 세 도구가 실제로 돌아가려면 "무슨 데이터로, 어떤 모델에, 어떤 설정으로"가 붙어야 한다. 재현 가능성을 위한 못 박기.

## 분석 대상 모델 (3종 아키텍처)

| 모델 | 구조 | 특징 |
|---|---|---|
| **MOMENT** | encoder-only, patch 기반 | 저자 그룹(CMU Auton Lab) 자작 TSFM — 가장 깊이 분석 |
| **Chronos** | encoder-decoder, 양자화 토큰 | 시계열을 이산 토큰으로 변환(언어모델식). Tiny/Mini/Small/Base/Large 계열 |
| **Moirai** | encoder-only, any-variate attention | 다변량 통합 어텐션. Small/Base/Large 계열 |

세 아키텍처 계열(패치 인코더 / 토큰화 seq2seq / 다변량 인코더)을 아우른 게 **일반성 주장의 근거**. Chronos-Large는 710M 파라미터. (정확한 층 수는 원문 렌더에서 명시 셀 미확인 — 파라미터 수만 보고됨.)

## 데이터

- **개념·steering용 합성 데이터**: constant(직선), sinusoid(물결), 그리고 이들의 조합(추세·주기·진폭 변주). Fig 3/10에 예시. **개념 라벨을 통제**하기 위해 실데이터가 아닌 합성 사용 — 국소화·steering의 장점(깨끗한 라벨)이자 한계(실세계 미대표).
- **가지치기 평가용 실데이터**: ETTh1/h2/m1/m2, Weather, Exchange, Traffic, ILI (예측·imputation). UCR 아카이브(분류), ECG5000(부정맥) 등 실세계 벤치마크로 "자른 뒤에도 실제 성능이 유지되나"를 확인.

## 태스크·지표

- **Imputation(결측 보간)**: Table 1 — MAE/MSE, 여러 마스킹 비율.
- **Forecasting(예측)**: Fig 9/Table 9 — MSE, 지평 96/192/336/720.
- **표현 분석**: CKA(층 유사도), LDR(개념 분리도) — 지표 자체가 산출물.

## 하이퍼파라미터·트릭

- **가지치기**: 블록 경계는 CKA 히트맵에서 식별. 첫·마지막 층 유지, 중간 층 가중치 0, skip-connection 의존.
- **steering 세기 $\alpha$**: 모델별 수동. Chronos ≈ 0.1, MOMENT = 1.0. "효과적 성능"을 위한 경험적 값.
- **활성 집계**: median(중앙값) 우선(outlier robust), multi-token(모든 토큰) 적용. mean/single-token과 비교는 Fig 12.
- **프로브**: 층·토큰별 별도 선형 분류기(constant vs sinusoid 등).

## 재현성 자산

- **코드 공개**: github.com/moment-timeseries-foundation-model/representations-in-tsfms — 합성 데이터 생성기 + CKA/probing/steering 파이프라인.
- **모델 공개**: MOMENT·Chronos·Moirai 모두 공개 가중치 → 제3자 재현 가능.
- **미공개/불명확**: steering의 $\alpha$ 선택 자동화 기준, 개념 국소화의 정량 정확도(원문은 정성 히트맵), 블록 경계 판정의 정확한 임계치.

## 의사코드 (개념 흐름)

```
얼린 TSFM M, 입력 배치 X
# 1) 층 유사도
for i,j in 층쌍: CKA[i,j] = linear_CKA(H_i, H_j)
블록 = 히트맵에서 밝은 정사각형 구간 식별
# 2) 가지치기
for 블록 (s..e): for k in (s+1..e-1): W_k = 0   # skip-conn이 우회
# 3) 개념 국소화
for i,j(층,토큰): LDR[i,j] = (μ_s-μ_c)^2 / (σ_s^2+σ_c^2)
# 4) steering
S_i = median(H_i | sinusoid) - median(H_i | constant)
추론시: h_i ← h_i + α·S_i   (모든 i, 모든 토큰)
```

**핵심 한 문장**: 얼린 공개 TSFM 3종에 합성 개념 데이터 + 실세계 벤치마크를 붙여, 학습 없이 forward만으로 세 분석을 돌린다 — 재현의 병목은 데이터·코드가 아니라 **$\alpha$·블록경계 같은 수동 판단**이다.
