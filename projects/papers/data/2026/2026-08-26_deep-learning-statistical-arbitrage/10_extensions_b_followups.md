# 9. 사고 확장 (b) — follow-up 3편

> 아래 3편은 본 논문의 **참고문헌 또는 이 레포의 커버 이력에서 식별자를 확인한 것만** 올린다. 인용 수·후속 흐름은 본 실행에서 확인하지 못했으므로 게이트 판정은 선정 시 재수행이 필요하다.

## 선행 1 — Avellaneda & Lee (2010), "Statistical arbitrage in the US equities market"

- **식별자**: *Quantitative Finance* 10, 761–782 (본 논문 REFERENCES 에 등재). arXiv 판 존재 여부 미확인.
- **어떤 논문인가**: PCA 로 공통요인을 뽑아 잔차를 만들고, 그 잔차 누적경로를 OU 과정으로 모형화해 표준화 편차 $\frac{X-\mu}{\sigma/\sqrt{2\kappa}}$ 가 임계값을 넘으면 반대 방향으로 베팅하는 통계적 차익거래의 표준 레시피.
- **본 논문과의 관계**: **직접 벤치마크이자 조상.** 본 논문의 OU+Thresh 모형이 이 논문의 재구현이며, 하이퍼파라미터($c_{\text{thresh}}=1.25$, $c_{\text{crit}}=0.25$)까지 일치함을 Appendix B 에서 확인한다. PCA 상관행렬 252일 추정도 이 논문을 따른다.
- **무엇을 얻는가**: 본 논문의 4.16 을 읽기 전에 **0.97 이 어떻게 만들어지는지**를 알아야 격차의 의미가 잡힌다. 그리고 OU 접근이 실패하는 구체적 형태(추세 구간에서 부호를 고정해 버림, Figure A.2(g))는 "평균회귀 가정이 언제 깨지는가"의 교과서적 사례다. 내 쪽에서는 **가장 단순한 기준선을 정직하게 구현하는 법**의 참고물.

## 경쟁 2 — Jiang, Kelly & Xiu (2023), "(Re-)Imag(in)ing Price Trends"

- **식별자**: **DOI 10.1111/jofi.13268**, *The Journal of Finance* 78(6) 3193–3249. — 이 레포 **2026-08-05 커버 완료**([폴더](../2026-08-05_jiang-kelly-xiu-reimagining-price-trends/) · [합본](../2026-08-05.md)).
- **어떤 논문인가**: 개별 종목의 OHLC 차트를 흑백 이미지로 렌더링해 2D CNN 으로 상승확률을 분류하고, 그 확률로 롱숏 포트폴리오를 만든다.
- **본 논문과의 관계**: **같은 문제(가격 시계열에서 패턴 자동 추출)의 다른 답.** 네 지점에서 정확히 대칭이다 — (i) 입력: 원 가격 vs **잔차**, (ii) 목적: 교차엔트로피 예측 vs **Sharpe 거래**, (iii) 표현: 2D 이미지 vs 1D 시계열, (iv) 해석: 로지스틱 근사·룰 추출 vs **어텐션 해부**. 본 논문 REFERENCES 에도 Jiang·Kelly·Xiu (2022, *JF* forthcoming)로 등재돼 있다.
- **무엇을 얻는가**: 2026-08-05 해체가 잡아낸 JKX 의 Table IX — "2D 기하가 아니라 min–max 재척도화가 성능을 지배했다" — 를 본 논문에 그대로 겨눌 수 있다. 본 논문도 instance normalization 을 쓰면서 그 기여를 분해하지 않았다(§10a Q3). **두 논문을 나란히 읽는 것이 각각 읽는 것보다 훨씬 많은 것을 준다** — 금융 딥러닝에서 "무엇이 이겼는가"를 물을 때 정규화·척도화라는 용의자를 항상 세워야 한다는 교훈.

## 후속 3 — Exploring Representations and Interventions in Time Series Foundation Models (Wiliński, Goswami, Potosnak, Żukowska, Dubrawski)

- **식별자**: **arXiv:2409.12915** · ICML 2025 (PMLR v267) · OpenReview goVzfYtj58. — 이 레포 **2026-07-29 커버 완료**([폴더](../2026-07-29_tsfm-representations-interventions/) · [합본](../2026-07-29.md)).
- **어떤 논문인가**: 얼린 시계열 파운데이션 모델(MOMENT·Chronos·Moirai)에 LLM 해석 도구 3종을 이식한다 — CKA 층 유사도, 선형 프로빙 + Fisher 손실, 그리고 **평균차 steering 벡터 개입** $\mathbf{h}_i\leftarrow\mathbf{h}_i+\alpha\mathbf{S}_i$.
- **본 논문과의 관계**: **본 논문이 하지 않은 4번째 단계(개입)를 하는 논문.** 본 논문은 어텐션 가중치를 **관찰**해 "early reversal 헤드"라는 라벨을 붙이는 데서 멈추고, Wiliński et al. 은 활성값을 **조작**해 개념 주입이 되는지를 본다. 두 논문의 방법을 합치면 §10a Q1 의 실험이 곧바로 설계된다.
- **무엇을 얻는가**: (i) steering 벡터 구성법(개념 조건 활성 중앙값의 차이)을 그대로 잔차 트레이딩 모델에 이식하는 레시피, (ii) 그 논문이 자인한 한계 — 합성 steering 의 실세계 OOD 전이 미검증 — 가 본 논문의 금융 세팅에서는 **실제 수익이라는 외부 검증 지표**로 해소될 수 있다는 점. 해석 실험의 성패를 "그럴듯해 보인다"가 아니라 **"헤드를 죽였더니 하락 국면 Sharpe 가 무너졌다"**로 판정할 수 있는 도메인이라는 게 금융의 드문 장점이다.
