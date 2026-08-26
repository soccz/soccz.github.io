# 8. 내 연구와의 연결

> **§9 봉인 준수**: 아래에서 언급하는 내 프로젝트의 사실은 **`_profile.md` / `_index.md` 에 문자 그대로 적힌 것만** 근거로 삼는다. 두 파일에 없는 세부(내부 절 번호, 코드 구조, 지도교수 등)는 **"프로필 기준 미상"** 으로 표기하고 창작하지 않는다.

## 이 논문이 걸리는 축

`_profile.md` 기준으로 이 논문은 **§E(금융 시계열 응용)** 에 정면으로 놓이고, **§C(Attention as Explanation / PE-Attention Geometry)** 와 **§D(TS Transformers)** 로 전이된다. §A(Grokking)·§B(Mech interp)와의 직접 연결은 **약하다** — 이 논문에는 학습 동역학·상전이·회로 분석이 없다. 아래에서 강한 연결부터 순서대로 쓴다.

---

## 1. APF (Attention Pattern Fields) — 가장 강한 연결

`_profile.md` 는 APF 를 **"PE → 2D attention motif → CNN probe → causal intervention" framework** 로, 축을 **PE 비교(NoPE/sinusoidal/learned/RoPE/ALiBi) × motif 종류(diagonal/stripe/block/edge/spike/checker)** 로 적는다. 이 논문은 그 프레임의 **1~3단계를 금융 도메인에서 실제로 밟은 사례**이고, **4단계(causal intervention)만 빠져 있다.**

**(가) 흡수할 기법 ① — 합성 프로브(Figure 15)를 APF 의 motif benchmark 와 접붙이기.**
저자들은 경험 데이터로 학습한 모델에 **합성 사인파** $x_l=\sin(2\pi\frac{l}{30})$ 과 15일 위상 이동판을 입력해 어텐션 헤드 반응을 관찰한다. `_profile.md` 가 기록한 APF 자산 **"synthetic motif benchmark (trend/seasonal/regime/anomaly/freq drift)"** 는 정확히 같은 도구인데, APF 는 이를 **학습·평가용**으로 쓰는 반면 이 논문은 **프로브용**으로 쓴다. 흡수 지점: APF 의 5종 합성 motif 를 **학습 후 프로브 입력**으로 재사용해, 각 PE 셀에서 "어떤 motif 를 넣으면 어떤 헤드가 켜지는가"의 응답표를 만든다. 이 논문의 Figure 15 는 그 표의 1×1 칸(사인파 × NoPE)에 해당한다.

**(나) 흡수할 기법 ② — NAAG(Figure 18)를 CNN probe 의 보조 지표로.**
APF 의 3단계는 CNN probe 다. 이 논문은 probe 대신 **정규화 평균 절대 기울기(NAAG)** 로 (a) 국소 필터별 중요도와 (b) 입력 날짜별 중요도를 잰다. 두 방법은 경쟁이 아니라 상보적이다 — probe 는 "그 표현에서 무엇을 읽어낼 수 있나"(디코딩 가능성), NAAG 는 "출력이 무엇에 민감한가"(민감도). APF 실험에서 **같은 motif 에 대해 두 지표가 어긋나는 셀**이 있다면 그 자체가 발견이다(디코딩은 되는데 출력이 안 쓰는 = 표현은 있으나 사용되지 않는 motif).

**(다) 충돌/경쟁 지점 — 이 모델에는 PE 가 없다.**
§05d 에서 확인했듯 본문 §II.D.3 과 Appendix C.2 의 어텐션 정의에 **위치 인코딩 항이 없다.** 그럼에도 §III.N 은 "하락 시 최근 10일 / 상승 시 앞쪽 20일"이라는 **위치 의존적 행동**을 보고한다. APF 의 PE 축 관점에서 이건 **NoPE 셀에서 위치 민감성이 창발한 사례**이며, 그 원인은 두 가지로 좁혀진다: ① CNN 토크나이저가 국소 순서를 인코딩, ② 신호가 $h^{\text{proj}}_L$ **한 시점으로 축약**되어 "마지막으로부터의 거리"가 암묵 좌표로 들어옴. **APF 가 직접 시험할 수 있는 가설**: 동일 아키텍처에서 CNN 토크나이저를 제거(또는 $D_{\text{size}}=1$ 로 축소)하면 위치 비대칭이 사라지는가? 사라진다면 "NoPE 트랜스포머의 위치 민감성은 토크나이저가 만든다"는 명제가 되고, 이는 APF 의 PE 축 해석 전체에 영향을 준다.

**(라) motif 분류상의 정밀한 관찰 — 이건 2D 가 아니라 1×L 슬라이스다.**
Figure 16(b)·17(b)~(g)의 어텐션 지도는 $H\times L$ 이지 $L\times L$ 이 아니다. 신호가 마지막 시점 투영만 쓰므로 **실효 어텐션은 $L\times L$ 행렬의 마지막 행 하나**다. APF 의 motif taxonomy(diagonal/stripe/block/edge/spike/checker) 로 옮기면, 이 논문이 관찰한 것은 **edge motif(행렬 경계 한 줄)** 에 국한된다. 따라서 "금융 잔차 트랜스포머의 어텐션은 이렇게 생겼다"는 주장은 **전체 motif 공간의 한 슬라이스에 대한 관찰**이다. APF 가 같은 세팅에서 전체 $L\times L$ 을 보면 이 논문이 못 본 diagonal/block 구조가 있을 수 있고, **그 격차 자체가 APF 의 논문거리**다.

**(마) 인용 포인트 초안** (APF main paper 의 attention-interpretability 담론 절 — *프로필 기준 절 번호 미상*):
> "Interpretability claims about attention in applied domains typically rest on observation rather than intervention. Guijarro-Ordonez, Pelger, and Zanotti (2025, *Management Science*; arXiv:2106.04028) label four attention heads of a financial CNN+Transformer as 'early reversal' and 'negative reversal' patterns on the basis of synthetic sinusoidal probes and attention heat maps (§III.N, Figures 15–17), but report no ablation of these heads. Their Table A.V further shows that halving the number of heads (4→2) leaves out-of-sample performance essentially unchanged (4.16→4.00), which is difficult to reconcile with a reading of the four heads as functionally distinct global patterns."

**(바) 반면교사**: 이 논문은 해석용 모델(8년 상수, Table VII 기준 Sharpe 2.64)과 성능용 모델(롤링, 4.16)이 다르다. APF 는 **motif 를 읽는 모델과 성능을 내는 모델을 반드시 동일하게 유지**하거나, 다르다면 그 사실을 그림 캡션이 아니라 본문에 명시해야 한다.

---

## 2. P1 ProTran-TFA (paused) — 두 번째로 강한 연결

`_profile.md` 는 P1 을 **"2022AEL probabilistic Transformer 확장, finance venue (IJF/QF) 가능"** 으로, 자산을 `paper_test/PAPER_DRAFT_V1.md` + `protran_tfa/` 로 적는다. `_index.md` 는 2022 AEL 을 **"Tactical Factor Allocation | Saejoon Kim (2022)"** 로 사전 독파 목록에 올려 두었다.

**흡수할 기법 — 목적함수 교체(식 4·5)를 확률예측에 이식.**
확률 예측 모형은 보통 pinball loss 나 NLL 로 학습된다. 이 논문의 논지는 "**예측 목적으로 추정한 신호가 투자 최적 신호가 아니다**"이고(§I, Bryzgalova 2019·Chen 2022·Cong 2020 인용), 그 해법이 식 (4)의 Sharpe/평균-분산 직접 최적화다. P1 재개 시 가장 값싼 기여는 **동일 아키텍처를 (i) pinball loss, (ii) 식 (4)의 Sharpe 목적, (iii) 둘의 가중합으로 학습해 3열 비교표를 만드는 것**이다. 금융 venue(IJF/QF)에서는 "확률 예측의 캘리브레이션과 의사결정 성과가 어긋난다"는 결과 자체가 논문이 된다.

**충돌 지점**: 식 (4)의 Sharpe 목적은 **분포를 산출하지 않는다** — 점 배분만 낸다. P1 의 정체성이 확률 예측이라면 이 논문의 목적함수를 그대로 쓸 수 없고, **CVaR·기대효용처럼 분포를 필요로 하는 결정 목적**으로 바꿔야 정합적이다. 이 논문의 식 (2)가 일반 오목 효용 $U(\cdot)$ 로 쓰여 있으므로 형식적 확장 통로는 열려 있다.

**인용 포인트 초안** (P1 서론 — *프로필 기준 절 번호 미상*):
> "Training a forecaster on a likelihood or pinball objective and then plugging its output into a downstream allocation rule is a two-stage procedure whose first stage is not aligned with the final objective. Guijarro-Ordonez et al. (2025) make this misalignment explicit by jointly optimizing the signal and allocation functions under a Sharpe-ratio objective (their equations (2)–(5)), and report that a flexible allocation function cannot compensate for an uninformative signal (§III.G). We extend this argument to the probabilistic setting, where the decision objective must be a functional of the predictive distribution rather than of a point forecast."

---

## 3. Grokking in TS Transformers — 연결 약함, 전이 가능성만

`_profile.md` 기준 Grokking track 은 **"Grokking × TS forecasting × non-stationarity × circuit analysis" 4-way intersection**, 상태는 **Week 1 setup, P2 logistic 4-layer 실험 background 진행 중**이다. 이 논문에는 grokking 도, 학습 곡선 분석도, 회로 분석도 없다. **연결은 약하다.** 다만 하나의 구체적 접점이 있다:

**비정상성의 정량화 도구로서 Table VII/VIII.** 롤링 재추정 모형(4.16)과 상수 모형(4년 2.09 / 8년 2.64)의 격차는 "학습된 함수가 시간에 따라 얼마나 변해야 하는가"를 성능 단위로 잰 값이다. Grokking track 의 non-stationarity 축에서 쓸 수 있는 **측정 프로토콜**이 여기 있다 — 같은 구조를 `_profile.md` 가 기록한 Grokking 데이터(regime-switching synthetic, logistic map)에 적용하면 "재추정 없이 유지되는 성능 비율"을 비정상성 강도의 스칼라 지표로 삼을 수 있다. 단, 이건 **논문의 주장을 가져오는 것이 아니라 실험 설계를 가져오는 것**이다.

---

## 4. 즉시 실행 가능한 축소 재현 — 보유 데이터로 가능한가

`_profile.md` 의 **금융 backup 데이터**는 "Ken French 25, GSPC/IXIC 2022-2024, GEFCom Wind/Solar"다. 이 논문의 3계열 중 **Fama-French 잔차 버전은 부분적으로 재현 가능**하다 — Kenneth French 라이브러리 요인은 무료이고, 이 논문도 FF 로딩을 "지난 60일 회귀"라는 단순 절차로 추정한다(§III.B). 반면 **IPCA 는 46개 Compustat 특성이 필요해 불가**, PCA 는 개별종목 일별 패널이 필요해 보유 자산(지수 2개)으로는 불가.

**따라서 현실적 축소판**: Ken French 25 포트폴리오를 "자산"으로 두고 FF 3~5요인으로 잔차를 만든 뒤, 이 논문의 3종 신호(OU / FFT / CNN+Trans)를 같은 목적함수로 비교한다. 종목이 25개뿐이라 Sharpe 수준은 원문과 비교 불가하지만, **"신호 함수의 표현력 순서가 재현되는가"** 라는 정성적 명제는 시험할 수 있다. 이건 APF·Grokking 어느 쪽에도 직접 기여하지 않는 **사이드 실험**이므로 우선순위는 낮게 두되, `_profile.md` 가 적은 진로("퀀트/차트 분석 industry")를 고려하면 **포트폴리오용 재현물로서의 가치**는 별개로 있다.

---

## 5. 이 논문이 못 한 것을 내가 어떻게 다룰 것인가 (요약)

| 이 논문의 공백 | 내 쪽 대응 |
|---|---|
| 어텐션 해석에 개입 실험 없음 | APF 4단계(causal intervention)를 헤드 절제·활성 패칭으로 이 도메인에 적용 |
| $L\times L$ 어텐션 전체를 안 봄(마지막 행만) | APF motif taxonomy 로 전체 행렬 스캔 — edge 외 motif 존재 여부가 곧 기여 |
| PE 축이 아예 없음(NoPE 고정) | APF 의 PE 5셀(NoPE/sinusoidal/learned/RoPE/ALiBi)로 확장, 토크나이저 제거 대조군 추가 |
| 시드 분산·MDD 미보고 | 내 실험은 시드 ≥5, 분산·최대낙폭 동시 보고 |
| 해석 모델 ≠ 성능 모델 | 동일 모델 고정 원칙을 프로토콜에 명시 |
