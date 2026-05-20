# 10_extensions_b_followups — 사고 확장: 후속 논문 3편

## 📌 이 챕터 다 읽으면 알 수 있는 것

- 본 paper 이후의 follow-up 논문 3 편
- 학계 동향

---

---

## 선행 논문: Temporal Fusion Transformers for Interpretable Multi-horizon Time Series Forecasting (Lim et al., IJF 2021, arXiv:1912.09363)

**어떤 논문인가**: Google Cloud AI 팀이 개발한 TFT는 MASTER가 다루는 주제의 정신적 전신이다. TFT도 (a) variable selection networks를 통한 특징 선택, (b) LSTM 기반 지역 시간 처리, (c) self-attention 기반 장기 패턴 포착, (d) 해석 가능한 attention 시각화라는 4가지 구성요소를 가진다. MASTER의 market-guided gating과 TFT의 variable selection network는 개념적으로 동일한 문제("어떤 특징이 지금 유효한가")를 서로 다른 방법으로 해결한다.

**본 논문(MASTER)과의 관계**: TFT는 다중 도메인(소매, 전기, 교통) + 다중 예측 지평선을 타겟으로 하며, 금융 주식 예측보다 더 일반적인 설정이다. MASTER는 TFT보다 종목 간 상관관계 모델링에 특화되었고, TFT는 알려진 미래 입력(known future inputs) 처리에 강하다. 두 논문을 함께 읽으면 "시장 조건부 특징 선택"의 두 가지 설계 철학을 비교할 수 있다.

**무엇을 얻을 수 있나**: (1) TFT의 quantile regression 손실이 MASTER의 포인트 예측 손실보다 금융 리스크 관리에 유리함을 이해 → ProTran-TFA 설계에 직접 참조 가능. (2) TFT의 3가지 해석 가능성 use case (variable selection, attention, temporal pattern) → MASTER의 해석 가능성 확장 방향.

---

## 경쟁 논문: FinMamba: Market-Aware Graph Enhanced Multi-Level Mamba for Stock Movement Prediction (arXiv:2502.06707, 2025)

**어떤 논문인가**: Yifan Hu 등이 제안한 FinMamba는 Mamba(선형 복잡도 SSM) + 동적 그래프 + 시장 인식 게이팅을 결합한 주가 예측 모델이다. MASTER와 거의 동일한 문제(inter-stock 상관 + 시장 조건부 특징 선택)를 다루지만, 어텐션 대신 Mamba를 사용한다.

**본 논문(MASTER)과의 관계**: (1) 시장 인식 동적 그래프로 MASTER의 inter-stock 어텐션을 대체 → N이 매우 클 때 O(N²) 어텐션 비용 없이 inter-stock 정보 교환 가능. (2) Mamba의 linear recurrence로 MASTER의 intra-stock 어텐션 대체 → 병렬 처리와 긴 lookback window가 동시에 가능. (3) 미국 + 중국 양 시장 검증 → MASTER의 단일 시장 한계 극복 시도.

**무엇을 얻을 수 있나**: MASTER의 어텐션 기반 종목 상관과 FinMamba의 그래프+SSM 기반 종목 상관의 성능 차이를 비교하면 "금융 TS에서 어텐션이 반드시 필요한가, 아니면 SSM으로 대체 가능한가"라는 APF 연구에 중요한 질문의 답을 얻을 수 있다.

---

## 후속 논문: Enforcing Interpretability in Time Series Transformers: A Concept Bottleneck Framework (Sprang, Acar, Zuidema, arXiv:2410.06070, 2024)

**어떤 논문인가**: University of Amsterdam 연구팀이 Autoformer에 Concept Bottleneck Model(CBM)을 적용해 TS 트랜스포머의 중간 표현이 사전 정의된 개념(시간 특징, 자기회귀 서러게이트 모델)과 유사해지도록 학습하는 방법을 제안한다. Centered Kernel Alignment(CKA)를 손실 함수에 통합해 개념-표현 유사성을 강제한다. 6개 벤치마크에서 성능 저하 없이 해석 가능성을 달성.

**본 논문(MASTER)과의 관계**: MASTER가 "무엇이 선택됐는가"는 보여주지만 "왜 선택됐는가"를 설명하지 못하는 한계를 직접 해결하는 방법론이다. Concept Bottleneck을 MASTER의 inter-stock 어텐션 레이어에 적용하면:

- **Concept 1**: 산업 섹터 멤버십 (종목 $i$와 $j$가 같은 섹터인가)
- **Concept 2**: 공급망 연결 여부
- **Concept 3**: 대형주/소형주 분류

이 개념들로 inter-stock 어텐션 가중치의 의미를 강제하면, MASTER의 종목 상관이 "왜 형성됐는지" 해석 가능해진다. APF 프로젝트의 tsfm-interp 방향과도 직접 연결.

**무엇을 얻을 수 있나**: MASTER의 해석 가능성 확장 + APF의 §D (TSFM interpretability) 연구의 선행 방법론으로서 tsfm-interp 커버리지 향상에도 기여.
