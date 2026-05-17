# 2.9 마무리 — *Chapter 2 Wrap-up & Bridge to Labs*

> **해설 분량**: 약 8쪽 (Ch2 요약 + 실습 3종 준비)

---

## 🪧 이 절을 한 줄로

> Ch2 본문 (§2.1~2.8) 은 금융 투자 + AI의 **이론 무대**. 다음은 **실습 3종** 으로 본격 코드 구현.

---

## 1. Ch2 한 페이지 요약

<svg viewBox="0 0 760 480" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="25" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="16" font-weight="700" fill="#1c1917">Ch2 「금융 투자 영역에서의 AI」 한 페이지 요약</text>
  <!-- §2.1 -->
  <rect x="20" y="55" width="350" height="100" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
  <text x="195" y="78" text-anchor="middle" font-family="Noto Sans KR,sans-serif" font-size="13" font-weight="700" fill="#c4724e">§2.1 투자 방식과 퀀트의 진화</text>
  <text x="195" y="100" text-anchor="middle" font-size="11" fill="#1c1917">5가지 자산 × 2 접근법 (재량 vs. 체계)</text>
  <text x="195" y="118" text-anchor="middle" font-size="11" fill="#1c1917">퀀트 5단계 진화 (추세→AI 시대)</text>
  <text x="195" y="136" text-anchor="middle" font-size="10" fill="#57534e">"우리는 이제 모두 퀀트다" — Harvey 2017</text>
  <!-- §2.2/2.3 -->
  <rect x="390" y="55" width="350" height="100" rx="8" fill="#eaf2f8" stroke="#5a7a96"/>
  <text x="565" y="78" text-anchor="middle" font-size="13" font-weight="700" fill="#5a7a96">§2.2/2.3 AI 동력과 장단점</text>
  <text x="565" y="100" text-anchor="middle" font-size="11" fill="#1c1917">동력: 컴퓨팅·데이터·오픈소스</text>
  <text x="565" y="118" text-anchor="middle" font-size="11" fill="#1c1917">장점: 감정 배제, 속도, 비선형 패턴</text>
  <text x="565" y="136" text-anchor="middle" font-size="10" fill="#57534e">단점: 과적합, 블랙박스, 시장 변동</text>
  <!-- §2.4/2.5 -->
  <rect x="20" y="170" width="350" height="100" rx="8" fill="#edf7ef" stroke="#3a7d44"/>
  <text x="195" y="193" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">§2.4/2.5 데이터 유형과 소스</text>
  <text x="195" y="215" text-anchor="middle" font-size="11" fill="#1c1917">3유형: 마켓 · 펀더멘털 · 대체</text>
  <text x="195" y="233" text-anchor="middle" font-size="11" fill="#1c1917">6평가 기준 (희소성이 최우선)</text>
  <text x="195" y="251" text-anchor="middle" font-size="10" fill="#57534e">한국: pykrx, FinanceDataReader, DART</text>
  <!-- §2.6 -->
  <rect x="390" y="170" width="350" height="100" rx="8" fill="#f5e6f0" stroke="#7a6a9a"/>
  <text x="565" y="193" text-anchor="middle" font-size="13" font-weight="700" fill="#7a6a9a">§2.6 전통 vs. AI 퀀트</text>
  <text x="565" y="215" text-anchor="middle" font-size="11" fill="#1c1917">8 차원 차이 (접근·데이터·해석 등)</text>
  <text x="565" y="233" text-anchor="middle" font-size="11" fill="#1c1917">5 전통 전략 + 6 AI 영역</text>
  <text x="565" y="251" text-anchor="middle" font-size="10" fill="#57534e">페어 트레이딩이 한국에서 가장 강세</text>
  <!-- §2.7/2.8 -->
  <rect x="20" y="285" width="720" height="100" rx="8" fill="#fef9e7" stroke="#8a6d2c"/>
  <text x="380" y="308" text-anchor="middle" font-size="13" font-weight="700" fill="#8a6d2c">§2.7/2.8 주의사항 + 응용사례</text>
  <text x="380" y="330" text-anchor="middle" font-size="11" fill="#1c1917">4 함정: 데이터 편향 · 시계열 특성 · 과적합 · 해석가능성</text>
  <text x="380" y="350" text-anchor="middle" font-size="11" fill="#1c1917">사례: 위성 페어 (UA vs Nike) · BloombergGPT · MAN AHL · State Street</text>
  <text x="380" y="370" text-anchor="middle" font-size="10" font-style="italic" fill="#57534e">한국: 타임폴리오 · 신한AI · KB STAR</text>
  <!-- Bridge to labs -->
  <rect x="60" y="405" width="640" height="60" rx="8" fill="#1c1917"/>
  <text x="380" y="430" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#fff">▼ 다음: 실습 3종 (전통 퀀트 → ML → DL)</text>
  <text x="380" y="453" text-anchor="middle" font-size="11" fill="#fff">실습 1: TA-Lib + 백테스팅 · 실습 2: XGBoost · 실습 3: LSTM</text>
</svg>

### Ch2 한 줄 요약

> **금융 투자는 5가지 자산과 2가지 접근법 위에 AI가 새 도구를 더하고 있다.** 본문 (§2.1~2.8) 은 그 이론, 실습 3종은 그 실전.

---

## 2. 실습 3종 미리보기

### 실습 1: 금융 시계열 및 파이썬을 활용한 전통 퀀트 방법 구현
- **데이터**: 미국 주식 (AAPL 등) + 한국 주식
- **라이브러리**: pandas, yfinance, **TA-Lib**, backtrader
- **목표**: 기술적 지표 (MA, RSI, MACD, Bollinger) 생성 + 백테스팅 + 성과 평가
- **난이도**: ★★★
- **소요 시간**: 4~6시간

### 실습 2: 머신러닝을 이용한 투자 전략
- **데이터**: Kaggle American Express + 한국 주식
- **라이브러리**: scikit-learn, **XGBoost**, LightGBM
- **목표**: 분류/회귀로 매수/매도 신호 생성 + 백테스팅
- **난이도**: ★★★★
- **소요 시간**: 6~10시간

### 실습 3: 딥러닝을 이용한 투자 전략
- **데이터**: 시계열 (일/분 단위)
- **라이브러리**: PyTorch, TensorFlow/Keras, **LSTM**
- **목표**: 시퀀스 모델로 가격 예측
- **난이도**: ★★★★★
- **소요 시간**: 8~15시간

---

## 3. 실습 진입 전 체크리스트

```
□ Python 3.10+ 설치
□ Jupyter Notebook 또는 Kaggle 노트북 환경
□ 기본 라이브러리 (pandas, numpy, matplotlib, sklearn)
□ 한국 주식 데이터 도구 (pykrx, FinanceDataReader)
□ 미국 주식 데이터 도구 (yfinance)
□ TA-Lib 설치 (실습 1)
□ XGBoost / LightGBM (실습 2)
□ PyTorch 또는 TensorFlow (실습 3)
□ GPU (선택, 실습 3에 도움)
```

---

## 4. 학습 자세

### 코드 따라하기 + 직접 변형

```
Phase 1: 책 코드 그대로 실행 (이해보다 동작 우선)
   ↓
Phase 2: 한 줄씩 주석 달면서 이해
   ↓
Phase 3: 파라미터 바꿔보기 (window size, threshold 등)
   ↓
Phase 4: 한국 주식 데이터로 재구성
   ↓
Phase 5: 본인만의 전략 추가
```

### 실습이 안 될 때

1. **에러 메시지 그대로 검색**: Stack Overflow, GitHub Issues
2. **GitHub 소스 코드 확인**: github.com/datakim/AI_FOR_FINANCE
3. **Kaggle 노트북 다른 사람 코드 비교**
4. **챕터 다시 읽기** (이론 이해 부족 가능)

### 막히는 흔한 곳

- **TA-Lib 설치**: macOS/Windows에서 컴파일 어려움 → Conda 설치 권장
- **데이터 라이선스**: 일부 yfinance 데이터 누락 → FinanceDataReader 보완
- **백테스팅 결과 vs 실전**: 거래비용/슬리피지 고려
- **딥러닝 학습 시간**: GPU 없으면 매우 느림 → Colab/Kaggle 활용

---

## 5. Ch2 본문 핵심 5가지 (실습 들어가기 전 다시 체크)

1. **금융 = 시간을 가로지르는 돈의 이동** (Ch1 §1.1 복습)
2. **퀀트 vs. 재량 = 같은 목표 다른 도구** (§2.1)
3. **3가지 데이터 (마켓·펀더멘털·대체)** 가 ML 입력 (§2.4)
4. **AI 함정 4가지 항상 의식** (생존편향·미래참조·과적합·해석가능성) (§2.7)
5. **백테스트 ≠ 실전** (거래비용·슬리피지·Concept Drift)

---

## 6. 실습 후 성장 경로

```
[책 실습 완료]
   ↓
Kaggle 대회 참가 (실습 데이터로)
   ↓
한국 주식 데이터로 본인 전략
   ↓
페이퍼 트레이딩 (가상 매매)
   ↓
실전 매매 (소액)
   ↓
포트폴리오 운영
```

---

## 7. 본격 실습 들어가기 — 마음가짐

> "**실패하지 않는 가장 안전한 방법은 시도하지 않는 것이다. 그러나 그것이 가장 큰 실패다.**"

실습 3종은 결코 쉽지 않다. 실습 3 (LSTM) 은 책에서 가장 어려운 부분 중 하나. **다 못 따라가도 좋다**. 실습 1만 완료해도 큰 성취. 실습 2까지 가면 평균 이상. 실습 3까지 가면 상위권.

---

## 🟣 [전공자 심화] — 양적투자 학술 지형도와 한국 적용의 한계

#### Ch2 본문의 학술적 한계 (요약)

Ch2 본문은 "양적투자 → AI 양적투자" 라는 진화 서사를 평이하게 제시하지만, 학술적으로는 다음 5가지 가정이 깔려 있다.

1. **EMH 약형 가설 부정 가능성**: 기술적/통계적 알파의 존재를 암묵적으로 전제. Fama (1970, *JF*) 의 EMH 약형 가설과 충돌하는 부분에 대한 해소 논의 부족.
2. **"AI = 성능 우위"의 단순화**: Krauss, Do, Huck (2017, *EJOR* 259) 은 DNN·GBT·RF·앙상블의 S&P 500 통계적 차익거래에서 **수수료 차감 후 알파가 시간에 따라 감소** (1992→2015) 함을 보였다. AI 우위가 시간 의존적임을 본문은 충분히 다루지 않는다. ([sciencedirect.com](https://www.sciencedirect.com/science/article/abs/pii/S0377221716308657))
3. **백테스트 알파 ≠ 실현 알파**: Bailey, Borwein, López de Prado, Zhu (2014, *Notices of the AMS* 61(5)) 의 *Pseudo-Mathematics and Financial Charlatanism* 은 백테스트 과적합(backtest overfitting) 이 표본 수에 따라 거의 확률 1로 발생함을 증명. 본문의 "백테스트 결과" 사례들은 이 위험을 명시하지 않는다. ([ssrn.com](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2308659))
4. **데이터 분포의 비정상성**: 금융 시계열은 covariate shift, concept drift, regime change 가 상시 발생. ML 의 i.i.d. 가정과 본질적 충돌.
5. **알파 발견의 다중검정 편향**: 수백~수천 개 팩터를 검정하면 우연으로도 통계적 유의성이 발견됨 — Harvey, Liu, Zhu (2016, *RFS* 29(1)) 의 *…and the Cross-Section of Expected Returns* 가 핵심 비판.

#### 후속 연구 방향 (2020~)

- **Bryzgalova, Pelger, Zhu (2025), "Forest through the Trees: Building Cross-Sections of Stock Returns," *Journal of Finance* 80(5), 2447–2506.** — 의사결정나무로 stochastic discount factor 를 직접 spanning, 단순 sort + ML 예측 기반 포트폴리오 대비 OOS Sharpe·알파 **최대 3배**. "예측 성능"이 아닌 "경제 문제 해결력" 으로 ML 평가 기준 전환을 제안. ([wiley.com](https://onlinelibrary.wiley.com/doi/full/10.1111/jofi.13477))
- **PatchTST (Nie et al., ICLR 2023, arXiv:2211.14730)** — Patching + Channel-Independence 로 시계열 transformer 의 장기 예측을 MSE 21% 개선. 금융 시계열로의 응용은 진행 중이지만, **금융 데이터의 SNR 이 ETT/Weather 등 벤치마크보다 훨씬 낮아** transformer 우위가 자동 보장되지는 않는다. ([arxiv.org](https://arxiv.org/abs/2211.14730))
- **López de Prado (2018), *Advances in Financial Machine Learning*** — Triple Barrier Labeling, Meta Labeling, Purged k-Fold CV, Combinatorial Symmetric CV(CSCV) 등 금융 ML 의 표준 방법론 제시. Ch2 본문에는 거의 인용되지 않음.

#### 한국 적용 시 주의점

- **한국 헤지펀드 시계열 길이 부족**: 한국형 헤지펀드(전문사모 집합투자기구) 는 **2011년 자본시장법 개정 이후 출시 → 2012년 본격 시작** — 미국 헤지펀드 데이터(HFR, BarclayHedge 1990s~) 대비 **15~20년 짧다**. Sharpe·Sortino 등 위험조정 수익 지표의 통계적 검정력이 현저히 낮다.
- **KRX 데이터의 구조적 단절**: 1997년 외환위기, 2008년 글로벌 금융위기, 2020년 코로나 충격으로 **regime change 가 외국 시장보다 빈번** — walk-forward 검증에서 train-test gap 설정이 까다롭다.
- **2011년 K-IFRS 도입 단절**: 재무제표 데이터의 회계 기준이 2011년 전후로 단절돼 펀더멘털 팩터 백테스트가 **2011년 이전과 이후를 직접 비교하기 어렵다**.
- **단방향 매도(공매도) 제약**: 2020년 3월~2021년 5월, 2023년 11월~ 현재까지 **공매도 금지 기간이 반복**. long-short 전략 백테스트와 실거래 사이의 괴리가 크다.
- **외국인 비중 30~35% + 거래 시간대**: 미국 시간과 6.5시간 ~ 14시간 차이 — 미국 시장 종가 정보의 한국 시장 반영 시차가 알파 원천이자 노이즈가 동시에 됨.
- **양도세·증권거래세 변동**: 2024년 0.18% → 2025년 0.15% → 2026년 0.20% (금투세 폐지 관련 세제개편안) — 백테스트의 수수료 가정이 매년 갱신 필요.

---

> **다음** — 실습 1 「금융 시계열 및 파이썬을 활용한 전통 퀀트 방법 구현」
> 코드 중심, TA-Lib + Backtrader + 성과 지표 (CAGR, MDD, Sharpe, Sortino, Alpha, Beta).
