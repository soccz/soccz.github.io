# 4. 방법론 해부 (z) — 구현 디테일과 재현 조건

> **배경 사다리**: 이 절은 "실제로 돌려보려면 무엇을 알아야 하는가"만 다룬다. ① Lyapunov 시간(카오스계에서 오차가 $e$ 배로 커지는 데 걸리는 시간, 시스템마다 다른 자연 시계)의 존재, ② 파운데이션 모델을 쓸 때 "모델 크기"와 "설계상 문맥 상한"이 별개라는 것만 알면 된다.

---

## 4z.1 하이퍼파라미터 총목록

원문에서 **직접 확인한** 설정만 적는다.

| 항목 | 값 | 출처 |
|---|---|---|
| 임베딩 차원 $D$ (주 실험) | **5** | §5.1 verbatim *"Here we set the embedding dimension $D=5$ for the parroting algorithm."* |
| 임베딩 차원 $D$ (스케일링 실험) | **10** | Figure 5 캡션 verbatim *"For all panels we set the embedding dimension $D=10$ for the parroting algorithm."* |
| 문맥 길이 $L$ (주 비교) | **512** (전 모델 공통) | Figure 2 캡션 verbatim *"The context length is set to 512 for all models."* |
| 문맥 길이 $L$ (스펙트럼 실험) | **2000** | Figure 3 캡션 |
| 예측 길이 (스펙트럼 실험) | 문맥 종료 후 **10,000점**, 마지막 **2,000점** 표시 | Figure 3 캡션 |
| 스펙트럼 추정 | **Welch's method**, 마지막 **5,000점** | Figure 3 캡션 |
| 평가 지평 (표) | **50 steps** | Table 1·2 캡션 |
| 샘플링 밀도 (본문) | **Lyapunov 시간당 30점** | Appendix E verbatim *"In the main text, we set an intermediate granularity of 30 points per Lyapunov time."* |
| 샘플링 밀도 (강건성) | **10 / 50 점 per Lyapunov time** | Appendix E |
| 노이즈 강건성 | 정규화 궤적에 가우시안 노이즈; 수준 0.1 = 평균 10% 섭동 | Appendix E verbatim |

**의미**: 하이퍼파라미터가 사실상 $D$ 하나이고, 그마저 5 와 10 두 값만 쓰였다. 베이스라인으로서 이보다 방어하기 쉬운 구성은 드물다.

## 4z.2 비교 모델과 그 크기 (원문 §4)

| 모델 | 파라미터 | 출처 표기 |
|---|---|---|
| Chronos_base | 200M | Ansari et al. 2024 |
| Chronos-Bolt_base | 205M | Ansari et al. 2024 |
| Time-MoE_large | 200M | Shi et al. 2025 |
| TimesFM-2.0 | 500M | Das et al. 2024 |
| Moirai-2.0_small | 11M | Liu et al. 2025a |
| DynaMix | (원문에 파라미터 수 미표기) | Hemmer & Durstewitz 2025 |
| **Context parroting** | **0 (학습 파라미터 없음)** | 본 논문 |
| simplex projection | 0 | Sugihara & May 1990 (Appendix, Figure 7) |
| AutoARIMA | — | Hyndman & Athanasopoulos 2018 (Appendix, Figure 7) |

**주목할 비대칭**: Moirai 는 **11M** 짜리 small 변형이 쓰였는데, Table 1 난류 행에서 **0.382±0.189** 로 parroting(0.403±0.210)보다 낮다. 즉 이 표는 "큰 모델이 진다"가 아니라 **"모델 크기와 이 과제의 성능이 별 상관없다"** 를 보여주는 쪽에 가깝다. 이건 저자들의 주장을 약화하기는커녕 오히려 강화한다 — 스케일이 답이 아니라는 증거이기 때문이다.

## 4z.3 데이터 파이프라인

- **주 벤치마크**: `dysts` — §5.1 인용 verbatim *"dysts dataset provides a standardized benchmark of 135 low-dimensional chaotic systems, each defined by a set of ordinary differential equations between dimensionality three and six"* (Gilpin 2021). 각 시스템당 **무작위 초기조건 20개** 궤적.
- **정규화·이산화**: 시스템마다 Lyapunov 시간이 다르므로 **Lyapunov 시간당 점 수**로 샘플링을 표준화한다(본문 30점). 이것이 이 벤치마크 설계의 핵심이며, 없으면 "빠른 시스템"과 "느린 시스템"의 예측 난이도를 비교할 수 없다.
- **§5.3 추가 과제**: 폰 카르만 소용돌이 열(**Re=900**, PCA 상위 모드 시계열화), ECG(**PhysioNet QT Database**), 결합 전자회로(**28개**, Vera-Ávila et al. 2020 실측), Kuramoto 진동자(**23개**, 좌절·비상반 결합, León & Pazó 2025).

## 4z.4 계산 비용

원문 §5.1 verbatim: *"a six orders of magnitude computational gap separates Chronos and context parroting for all context lengths."*

**해석 시 조심할 점**: parroting 의 계산량은 문맥 길이 $L$ 에 대해 **naive 구현에서 $O(LD)$** 로 커진다(모든 후보 모티프와 거리 계산). 반면 트랜스포머의 어텐션은 $O(L^2)$ 다. 따라서 6자리 격차는 $L$ 이 커질수록 오히려 **벌어지는** 방향이다. 다만 원문 표현은 "모든 문맥 길이에서 6자리"이므로, 이 해체에서는 격차의 스케일링 거동을 원문 근거 없이 단정하지 않고 **관계식만 지적**한다.

## 4z.5 재현성

- **코드 공개**: Reproducibility Statement verbatim — *"A Python implementation of the context parroting algorithm and the benchmarks are available at https://github.com/y-z-zhang/parroting"*
- **재현 난이도**: 알고리즘 자체는 **20줄 이내로 독립 재구현 가능**하다. 실제 재현 리스크는 parroting 쪽이 아니라 **6개 TSFM 을 각각 올바르게 호출하는 쪽**(정규화 규약, 컨텍스트 패딩, 확률 예측의 점 예측 변환)에 있다.
- **분산 보고**: Table 1·2·3 이 **평균 ± 표준편차**를 함께 싣는다. Figure 2 캡션은 *"Solid lines represent mean and dotted lines represent median"* 으로 **평균과 중앙값을 동시에** 보고한다 — 135개 시스템 간 성능 분포가 왜곡돼 있을 가능성을 저자들이 스스로 노출시킨 것으로, 성실한 처리다.

## 4z.6 이 파일의 핵심 한 문장

**하이퍼파라미터 $D$ 하나, 공개된 20줄짜리 코드, 평균과 중앙값을 동시에 보고하는 표 — 이 논문의 재현 리스크는 제안 방법이 아니라 비교 대상 파운데이션 모델들을 공정하게 호출했는가에 전부 쏠려 있다.**
