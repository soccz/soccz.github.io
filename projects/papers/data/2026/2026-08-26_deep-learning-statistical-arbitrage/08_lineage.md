# 7. 이론적 계보

## 이론적 조상

**① Avellaneda·Lee (2010), "Statistical arbitrage in the US equities market," *Quantitative Finance* 10, 761–782.**
이 논문의 직계 조상이자 직접 벤치마크. "PCA 로 공통 요인을 뽑고 잔차를 OU 로 모형화해 표준화 편차 임계값으로 거래한다"는 3단 구조를 확립했다. 본 논문은 이 구조를 **해체해서 각 칸을 교체 가능한 슬롯으로 만들었다** — 요인(PCA→FF/IPCA), 신호(OU→FFT/CNN+Trans), 배분(임계값→FFN). PCA 상관행렬 추정에 252일을 쓰는 것도 Avellaneda·Lee 를 그대로 따른다고 §III.B 각주 11 에 명시한다. OU 하이퍼파라미터 $c_{\text{thresh}}=1.25$, $c_{\text{crit}}=0.25$ 가 이들의 최적값과 일치한다는 확인(Appendix B)은 **"벤치마크를 약하게 만들지 않았다"는 방어선**이기도 하다.

**② Kelly·Pruitt·Su (2019) IPCA, "Characteristics Are Covariances," *JFE* 134, 501–524.**
요인 로딩을 기업 특성의 선형함수로 두는 조건부 잠재요인 모형. 본 논문은 IPCA 를 **자산가격 설명 도구가 아니라 차익 포트폴리오 생성기**로 재활용한다. 이 전용(轉用)이 §I 의 마지막 문장에 압축돼 있다 — "We do not use characteristics to get features for prediction, but rather to obtain the data orthogonal to these features." **특성을 예측의 입력이 아니라 직교화의 축으로 쓴다**는 이 한 문장이 금융 ML 문헌에서 이 논문의 위치를 정한다. 실증적으로도 IPCA 잔차가 세 계열 중 가장 높은 Sharpe 를 낸다(Table I).

**③ Vaswani et al. (2017), "Attention Is All You Need."**
본 논문 §I 마지막 단락: "The transformer method was first introduced in the groundbreaking paper by Vaswani et al. (2017). We are the first to bring this idea into the context of statistical arbitrage and adopt it to the economic problem." Appendix C.2 는 Q/K/V 정의와 헤드 결합을 원 논문 형식 그대로 따른다. **다만 위치 인코딩은 채택하지 않았다**(§05d 참조) — CNN 이 국소 순서를 담당하고 신호가 마지막 시점 투영으로 축약되기 때문이다. 이 "PE 없는 트랜스포머"라는 선택이 §09 에서 내 연구와의 접점이 된다.

**④ Lettau·Pelger (2020a,b) / Pelger (2020) / Chen·Pelger·Zhu (2022).**
저자 자신의 요인 추정 계보. 이 레포는 2026-05-17(RP-PCA)과 2026-05-18(Deep Learning in Asset Pricing)에서 이미 이 라인을 다뤘다. 본 논문은 그 라인의 **잔차 쪽 응용**이다 — 요인을 더 잘 추정하는 연구가 "그럼 그 요인으로 설명 안 되는 부분은 뭔가"로 자연스럽게 넘어간 결과물이다. 각주 13이 Pelger(2020)를 인용해 "개별 주식 수익률의 약 1/3이 잠재 4요인으로 설명된다"고 적는 대목이 그 연결점이다.

## 평행 연구 (비슷한 시기, 다른 접근)

**① Gu·Kelly·Xiu (2020), "Empirical Asset Pricing via Machine Learning," *RFS* 33, 2223–2273.** *(사용자 사전 독파 목록에 있음 — 여기서는 대조군으로만 언급)*
같은 시기 금융 ML 의 대표작이지만 목표가 정확히 반대다. GKX 는 **위험 프리미엄을 설명**하려 하고, 본 논문은 **프리미엄으로 설명되지 않는 잔차**를 노린다. 본 논문 §I 은 이 차이를 방법론 차원으로 번역한다 — 수익률 예측 문헌은 "현재 수익률과 지난 기 공변량 사이의 비모수 횡단면 모형"을 추정할 뿐 **시계열 모형을 추정하지 않는다**. **어느 쪽이 이겼나**: 서로 다른 질문이므로 승패가 아니다. 다만 "특성을 어디에 쓸 것인가"에서 본 논문의 선택(직교화)이 더 참신하다.

**② Jiang·Kelly·Xiu (2023), "(Re-)Imag(in)ing Price Trends," *JF* 78(6) 3193–3249.** — 이 레포 **2026-08-05 커버**.
같은 "가격 시계열에서 패턴을 자동 추출한다"는 문제에 **2D 이미지 CNN** 으로 접근한 논문. 본 논문 참고문헌에도 Jiang·Kelly·Xiu (2022, *JF* forthcoming)로 등재돼 있다. **대조가 선명하다**: JKX 는 원 가격 차트를 그대로 쓰고(요인 직교화 없음) 예측 목적(교차엔트로피)으로 학습하며 2D 표현을 쓴다. 본 논문은 잔차를 쓰고 거래 목적으로 학습하며 1D 시계열 표현을 쓴다. 그리고 **2026-08-05 해체가 잡아낸 JKX 의 Table IX** — "2D 기하가 아니라 min–max 재척도화가 성능을 지배했다" — 는 본 논문에도 시사점이 있다. 본 논문 역시 **입력 정규화(instance normalization, 식 A.1/A.2)** 를 쓰는데, 그 기여도를 분해하지 않았다. 두 논문을 나란히 놓으면 "표현이 이겼는가, 정규화가 이겼는가"라는 공통 미해결 질문이 남는다.

**③ He·He·Huang·Zhou (2022), "Testing Asset Pricing Models Using Pricing Error Information."**
잔차의 시계열 정보로 롱숏을 만드는 단순 접근. 본 논문은 이를 §III.L 에서 **직접 대조군**으로 구현한다(과거 $L$기간 잔차 하위 20% 매수 / 상위 20% 매도). 결과는 Sharpe 최대 0.3(Figure 11). **본 논문이 이긴 지점**: "잔차 반전"이라는 아이디어와 "그 반전의 형태를 학습하는 것"은 성능 차이가 한 자릿수 배가 아니라 열 배 이상이다.

**④ Krauss·Doa·Huck (2017), *EJOR* 259, 689–702.**
S&P 500 에서 딥러닝·부스팅·랜덤포레스트로 통계적 차익거래. 본 논문이 각주 1 에서 유사연구로 묶는 계열이며, §I 의 비판은 "이들은 시계열 데이터를 위해 특별히 설계되지 않은 일반 비모수 함수 추정을 쓴다"이다. Lim·Zohren(2020)의 서베이를 인용해 **시간 의존성의 명시적 처리**가 중요하다는 논거를 세운다.

## 후손 예측

**① 마찰·용량 통합 최적화.**
본 논문이 §III.J 에서 남긴 4개 단순화 가정과 §III.K 의 희소성 결과를 합치면 자연스러운 후속이 나온다 — **희소성 제약 + 시장충격 모형 + 요인 거래비용을 함께 넣은 end-to-end 최적화.** 저자들 스스로 Pelger·Xiong(2020) 의 sparse proximate factors 를 이 방향의 도구로 언급한다.

**② 자기지도 사전학습된 잔차 시계열 파운데이션 모델.**
본 논문의 필터는 **단일 데이터셋(미국 대형주 잔차)에서 처음부터 학습**된다. 시계열 파운데이션 모델 계열(이 레포가 다룬 Chronos·MOIRAI·TimesFM)의 논리를 적용하면, 여러 시장·자산군의 잔차로 사전학습한 뒤 특정 시장에 전이하는 접근이 가능하다. 흥미로운 대조점: 2026-08-19 커버한 **context parroting** 이 보여준 대로, 파운데이션 모델의 강점은 정상적(stationary) 구조의 복사인데 — **잔차는 설계상 정상성을 목표로 만들어진 대상**이므로 이 계열이 유리할 조건을 갖췄다.

**③ 인과적 어텐션 해석.**
§III.N 의 관찰적 해석을 개입 기반으로 승격시키는 후속. 헤드 절제·활성 패칭·steering 벡터를 잔차 거래 모델에 적용하면 "이 헤드가 하락 국면 정책을 담당한다"를 인과적으로 확립할 수 있다. 이 방향은 이 레포가 2026-07-29(Wiliński et al., TSFM steering)와 2026-08-14(Hase et al., 국소화≠편집)에서 다룬 도구가 그대로 이식되는 자리다. **실제로 이 후속이 나왔는지는 확인하지 못했다** — 본 실행에서 후속 문헌 서베이는 수행하지 않았다.

## 계보 한 줄 요약

> **Avellaneda·Lee(구조) × Kelly·Pruitt·Su(잔차 생성) × Vaswani(신호 함수) = 본 논문**이며, 이 논문이 계보에 실제로 추가한 것은 세 부품 중 **어느 칸이 병목인지를 통제 실험으로 분해**한 것과, 그 칸의 내부를 **사후 해부 가능한 형태로 설계**한 것이다.
