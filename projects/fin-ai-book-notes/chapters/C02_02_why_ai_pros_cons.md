# 2.2 ~ 2.3 AI가 각광받는 이유 + 장점과 단점 — *Why AI in Investment & Pros/Cons*

> **해설 분량**: 약 22쪽
> **읽는 데 걸리는 시간**: 약 40분

---

## 🪧 이 절을 한 줄로

> **AI가 투자에 들어온 이유 3가지** (컴퓨팅 폭증 · 데이터 폭증 · 오픈소스 발전) 와, **AI 투자의 양면성** (감정 배제·속도 vs. 과적합·블랙박스·편향)을 본다.

책은 §2.2를 Campbell Harvey의 3가지 이유로, §2.3을 장단점 평가로 짧게 다룬다. 이 해설집은 두 절을 통합해서 보고:
1. 컴퓨팅·데이터·오픈소스를 **숫자**로 풀고
2. 장단점을 **체크리스트** 화
3. **블랙박스 함정**의 실제 사례 (LTCM 1998, 퀀트 위기 2007)

### 📍 미리 그릴 큰 그림

<svg viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">AI 투자의 양면성 — 3가지 동력 vs. 3가지 함정</text>
  <!-- Drivers -->
  <g>
    <text x="180" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">▲ 3가지 동력 (Drivers)</text>
    <rect x="40" y="70" width="280" height="60" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="180" y="92" text-anchor="middle" font-size="12" font-weight="700" fill="#3a7d44">① 컴퓨팅 능력 폭증</text>
    <text x="180" y="112" text-anchor="middle" font-size="10" fill="#57534e">GPU·클라우드·양자</text>
    <rect x="40" y="140" width="280" height="60" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="180" y="162" text-anchor="middle" font-size="12" font-weight="700" fill="#3a7d44">② 데이터 폭증</text>
    <text x="180" y="182" text-anchor="middle" font-size="10" fill="#57534e">정형 + 비정형 (뉴스·SNS·이미지)</text>
    <rect x="40" y="210" width="280" height="60" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="180" y="232" text-anchor="middle" font-size="12" font-weight="700" fill="#3a7d44">③ 오픈소스 발전</text>
    <text x="180" y="252" text-anchor="middle" font-size="10" fill="#57534e">sklearn, PyTorch, Kaggle, GitHub</text>
  </g>
  <!-- Pitfalls -->
  <g>
    <text x="580" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">▼ 3가지 함정 (Pitfalls)</text>
    <rect x="440" y="70" width="280" height="60" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="580" y="92" text-anchor="middle" font-size="12" font-weight="700" fill="#c4724e">① 과적합 (Overfitting)</text>
    <text x="580" y="112" text-anchor="middle" font-size="10" fill="#57534e">"과거에 잘 맞아도 미래엔?"</text>
    <rect x="440" y="140" width="280" height="60" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="580" y="162" text-anchor="middle" font-size="12" font-weight="700" fill="#c4724e">② 블랙박스 (Black Box)</text>
    <text x="580" y="182" text-anchor="middle" font-size="10" fill="#57534e">"왜 이 결정 내렸나?"</text>
    <rect x="440" y="210" width="280" height="60" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="580" y="232" text-anchor="middle" font-size="12" font-weight="700" fill="#c4724e">③ 편향·윤리</text>
    <text x="580" y="252" text-anchor="middle" font-size="10" fill="#57534e">"학습 데이터의 차별 재현"</text>
  </g>
  <text x="380" y="320" text-anchor="middle" font-size="13" font-weight="700" fill="#1c1917">결론: AI는 강력하지만 만능 아님. 함정 인식하고 사용해야.</text>
</svg>

---

## 🟢 [초급] — 일상 비유로 잡는 감

### 1. 왜 AI가 갑자기 투자에 들어왔나? — 3가지 이유 비유

#### 이유 ①: 컴퓨터가 엄청 빨라졌다
- 30년 전: PC 1대로 1년 걸릴 계산
- 지금: 클라우드 GPU 1시간이면 완료
- → **머신러닝 모델 학습 = 옛날엔 불가능했던 일**

#### 이유 ②: 데이터가 엄청 많아졌다
- 30년 전: 회계장부 + 일간지
- 지금: 트위터·유튜브·위성사진·신용카드 거래 등 무한
- → **새 종류의 데이터로 새 통찰 가능**

#### 이유 ③: 라이브러리가 무료로 풀렸다
- 30년 전: 통계 패키지 $1만+, 직접 코딩
- 지금: sklearn, PyTorch 무료, ChatGPT가 코드 짜줌
- → **누구나 ML 시작 가능 (초보자도)**

### 2. AI 투자의 5가지 장점

#### 장점 ①: 감정 안 들어감
인간 투자자는 공포·탐욕으로 잘못된 결정. AI는 규칙대로만.

> 💡 책 인용 (Campbell Harvey): "*최적의 알고리즘 전략은 다른 사람들의 감정적 선택을 관찰하고, 그로부터 학습하며 이익을 얻는 것이다.*"

#### 장점 ②: 빠른 정보 처리
- 분기 보고서 수백 페이지 → AI가 1분에 핵심 추출
- 뉴스 1만 건 → AI가 실시간 감정 분석

#### 장점 ③: 비선형 관계 발견
인간이 못 보는 복잡한 패턴 학습.

#### 장점 ④: 24시간 운영
주말·휴일도 매매 가능 (암호화폐 등).

#### 장점 ⑤: 일관성
같은 상황 → 같은 결정. (인간은 컨디션에 따라 다름)

### 3. AI 투자의 4가지 단점

#### 단점 ①: 과적합 (Overfitting)
"과거에 잘 맞은 모델" ≠ "미래에 잘 맞을 모델"

```
백테스팅 결과: 연 50% 수익 (10년 데이터)
실전 운영: 연 -10% 손실
   → 과적합!
```

#### 단점 ②: 블랙박스
딥러닝 모델이 왜 그 결정 내렸는지 설명 불가능.
→ 손실 났을 때 원인 분석 어려움.

#### 단점 ③: 시장 변화에 약함
2008 금융위기, 2020 코로나 — AI 모델 대거 실패.
이유: **학습 데이터에 없는 패턴**.

#### 단점 ④: 윤리·편향
학습 데이터의 차별이 그대로 모델에.
예: 특정 산업 우대, 특정 지역 회피.

> ✅ **여기까지 따라왔으면**: AI 투자의 빛과 그림자가 양쪽 다 보일 거다.

---

## 🟡 [중급] — 동작 원리와 데이터

### 1. 컴퓨팅 능력 폭증 — 정량 데이터

#### 무어의 법칙 (Moore's Law)
1965년 Gordon Moore: "**트랜지스터 수가 2년마다 2배**".

<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">컴퓨팅 능력 — 1970부터 2024까지</text>
  <line x1="80" y1="240" x2="680" y2="240" stroke="#1c1917" stroke-width="1.5"/>
  <line x1="80" y1="240" x2="80" y2="50" stroke="#1c1917" stroke-width="1.5"/>
  <g font-family="JetBrains Mono,monospace" font-size="10" fill="#57534e">
    <text x="120" y="258" text-anchor="middle">1970</text>
    <text x="220" y="258" text-anchor="middle">1980</text>
    <text x="320" y="258" text-anchor="middle">1990</text>
    <text x="420" y="258" text-anchor="middle">2000</text>
    <text x="520" y="258" text-anchor="middle">2010</text>
    <text x="620" y="258" text-anchor="middle">2024</text>
  </g>
  <!-- Log scale labels -->
  <g font-family="JetBrains Mono,monospace" font-size="9" fill="#57534e">
    <text x="75" y="244" text-anchor="end">10³</text>
    <text x="75" y="200" text-anchor="end">10⁶</text>
    <text x="75" y="155" text-anchor="end">10⁹</text>
    <text x="75" y="110" text-anchor="end">10¹²</text>
    <text x="75" y="65" text-anchor="end">10¹⁵</text>
  </g>
  <!-- Exponential curve -->
  <path d="M 120 230 Q 220 215, 320 185 T 520 100 T 620 60" fill="none" stroke="#c4724e" stroke-width="2.5"/>
  <!-- Annotations -->
  <text x="120" y="218" text-anchor="middle" font-size="9" fill="#c4724e">Intel 4004</text>
  <text x="120" y="228" text-anchor="middle" font-size="9" fill="#c4724e">2300 트랜지스터</text>
  <text x="320" y="170" text-anchor="middle" font-size="9" fill="#c4724e">Pentium</text>
  <text x="320" y="180" text-anchor="middle" font-size="9" fill="#c4724e">300만개</text>
  <text x="520" y="85" text-anchor="middle" font-size="9" fill="#c4724e">NVIDIA A100</text>
  <text x="520" y="95" text-anchor="middle" font-size="9" fill="#c4724e">540억개</text>
  <text x="620" y="45" text-anchor="middle" font-size="9" fill="#c4724e">NVIDIA H100</text>
  <text x="620" y="55" text-anchor="middle" font-size="9" fill="#c4724e">800억개</text>
  <text x="380" y="40" text-anchor="middle" font-size="11" font-style="italic" fill="#57534e">54년 만에 약 1억배 증가 (로그 스케일)</text>
</svg>

→ **머신러닝 모델 학습이 가능해진 결정적 이유**.

#### GPU 등장의 의미
- CPU: 직렬 처리 (1개 계산씩)
- GPU: 병렬 처리 (수천 개 동시)
- → 신경망 학습이 100~1000배 빨라짐
- → **딥러닝의 실용화** (2012 AlexNet)

#### 클라우드 컴퓨팅 영향
- AWS, GCP, Azure
- 누구나 GPU 100대 빌릴 수 있음 (시간당 $100)
- → 헤지펀드 수준의 인프라를 개인도 접근

### 2. 데이터 폭증 — 정형 → 비정형

#### 전통 금융 데이터 (정형)
- 가격, 거래량, 재무제표
- 분기 단위 업데이트
- 수십 KB 크기

#### 현대 금융 데이터 (비정형)
- 뉴스 기사 (실시간)
- 트위터/Reddit 멘션
- 위성 이미지 (월마트 주차장 차량 수)
- 신용카드 거래 익명 데이터
- 검색 트렌드 (Google Trends)
- 자연어 회의록 (Fed 의사록)

#### 데이터 크기 비교

| 시대 | 한 회사 1년 분석 데이터 |
|------|--------------------|
| 1980 | 약 100KB (재무제표) |
| 2000 | 약 10MB (재무 + 일간 시세) |
| 2010 | 약 1GB (틱 데이터 + 뉴스) |
| 2024 | **약 1TB** (모든 디지털 발자취) |

#### Marcos López de Prado의 통찰

> "*Big data without AI is dumb. AI without big data is blind.*"

책 본문 인용:
> "*머신러닝은 ... 비선형, 계층적, 고차원에서의 연속되지 않는 상호작용 효과와 같은 복잡한 문제를 효과적으로 학습할 수 있다.*"

### 3. 오픈소스 발전

#### 핵심 라이브러리 타임라인

```
2007: scikit-learn 프로젝트 시작 (Google Summer of Code)
2010: scikit-learn 첫 공개 릴리스 (2010.2), pandas 0.1
2012: pandas 0.7+ 안정화
2014: NumPy 1.9 (수치 계산)
2015: TensorFlow 오픈소스 (Google)
2016: PyTorch (Facebook)
2017: XGBoost 안정화
2018: Hugging Face Transformers
2020: PyTorch Lightning
2022: 대형 LLM 공개
```

#### 금융 특화 라이브러리

| 라이브러리 | 분야 |
|----------|------|
| pandas | 데이터 처리 |
| yfinance / FinanceDataReader | 데이터 수집 |
| backtrader / zipline | 백테스팅 |
| QuantLib | 파생 가격결정 |
| TA-Lib | 기술적 지표 |
| Riskfolio-Lib | 포트폴리오 최적화 |
| FinRL | 강화학습 |
| Empyrical | 성과 측정 |

#### Kaggle 효과
- 2010 설립
- 금융 데이터 대회 다수
- 책 실습 데이터: American Express, Home Credit
- 전 세계 데이터 과학자의 베스트 솔루션 공개

### 4. AI 투자의 7가지 장점 (정리)

| # | 장점 | 설명 |
|---|------|------|
| 1 | 감정 배제 | 공포·탐욕 없음 |
| 2 | 속도 | 마이크로초 매매 |
| 3 | 정보 처리량 | 1만 뉴스/초 분석 |
| 4 | 비선형 패턴 | 인간 못 보는 관계 |
| 5 | 24시간 | 자동 운영 |
| 6 | 일관성 | 같은 입력 = 같은 출력 |
| 7 | 확장성 | 코드 한번 → 1000종목 적용 |

### 5. AI 투자의 6가지 단점 (정리)

| # | 단점 | 설명 |
|---|------|------|
| 1 | 과적합 | 과거에만 잘 맞음 |
| 2 | 블랙박스 | 설명 어려움 |
| 3 | 데이터 의존 | 데이터 품질이 모델 품질 |
| 4 | 시장 변화 약함 | 학습 외 패턴 못 잡음 |
| 5 | 편향 | 학습 데이터의 차별 재현 |
| 6 | 규제 | 설명가능성 의무 |

> ✅ **여기까지 따라왔으면**: AI 투자가 왜 가능해졌고, 왜 만능이 아닌지 입체적으로 보일 거다.

---

## 🔴 [고급] — 영문 용어와 책의 한계

### 1. 영문 용어 보강

#### 1.1 컴퓨팅
- **GPU (Graphics Processing Unit)**
- **TPU (Tensor Processing Unit)**: Google 전용
- **HPC (High-Performance Computing)**
- **Distributed Computing**: 분산 컴퓨팅
- **Cloud-Native**: 클라우드 기반

#### 1.2 데이터
- **Structured Data**: 정형
- **Unstructured Data**: 비정형
- **Semi-structured**: 반정형 (JSON, XML)
- **Streaming Data**: 스트림 데이터
- **Real-time Data**: 실시간
- **Alternative Data**: 대체 데이터

#### 1.3 ML 함정
- **Overfitting**: 과적합
- **Underfitting**: 과소적합
- **Curse of Dimensionality**: 차원의 저주
- **Multicollinearity**: 다중공선성
- **Survivorship Bias**: 생존 편향
- **Look-ahead Bias**: 미래 참조 편향
- **Data Snooping**: 데이터 스누핑
- **P-hacking**: P값 해킹

### 2. 책의 한계 6가지

#### 한계 ①: 컴퓨팅 폭증의 비용 미언급
- GPU 1대 $30K
- 클라우드 GPU 시간당 $3~10
- LLM 학습: $10M+
- **AI 투자의 진입장벽이 사실 매우 높음** (개인 vs. 헤지펀드)

#### 한계 ②: 데이터 비용 미언급
- 블룸버그 터미널: $2K/월
- 위성 이미지: $1K~10K/이미지
- 신용카드 데이터: $100K~1M/년
- → **양질의 대체 데이터는 비싸다**

#### 한계 ③: 오픈소스의 한계 미언급
- 금융 특화 데이터는 여전히 유료
- 백테스팅 라이브러리의 미세 버그
- 한국 시장 특화 도구 부족

#### 한계 ④: 과적합 사례 미언급
**LTCM 1998 사건**:
- Long-Term Capital Management, 노벨상 수상자 운용
- 모델이 1998 러시아 위기 못 예측 → $4.6B 손실
- 미국 정부 구제

**2007 Quant Quake**:
- 8월 7~9일 동안 모든 퀀트 펀드 동시 대거 손실
- 이유: 같은 모델 사용 → 같은 신호에 같은 매도
- "**Crowded Trade**" 위험

#### 한계 ⑤: 블랙박스 함정의 학술적 처리 부족
- LIME, SHAP, Integrated Gradients 등 XAI 도구
- Pearl의 인과추론
- 책은 "설명가능성 중요" 만 말하고 끝

#### 한계 ⑥: 책의 윤리 논의가 일반론
- AI 알고리즘이 만들 수 있는 **시장 조작** 위험
- AI 간 충돌로 인한 flash crash
- 미래 시장의 무결성 문제

### 3. 과적합과의 싸움 — 학술적 도구

#### 3.1 Train/Validation/Test Split
```
[80% Train] [10% Validation] [10% Test]
   학습          하이퍼파라미터 튜닝     최종 평가
```

#### 3.2 Cross-Validation
- K-Fold CV
- Time Series CV (시계열 특화)
- Walk-Forward Analysis

#### 3.3 Regularization
- L1 (Lasso): 피처 선택
- L2 (Ridge): 가중치 축소
- Elastic Net: L1 + L2 결합
- Dropout (신경망): 무작위 뉴런 제거

#### 3.4 Bayesian Approaches
- 불확실성 정량화
- Posterior 분포로 신뢰구간

### 4. Quant Quake 2007 — 실제 사건

#### 사건 요약
2007년 8월 6~9일 (정확한 핵심 주간):
- 모든 유명 퀀트 헤지펀드 동시 손실
- **Goldman Sachs Global Equity Opportunities (GEO)**: 약 **-30%** (해당 주간 / YTD)
- **Renaissance RIEF**: 약 **-8.7%** (8월 한 달, Wall Street Journal/Bloomberg 보도)
- **AQR**: 약 -13% (8월 첫 10일)

> ⚠ 정정: 초기 작성본 "GEO -27%, Renaissance -7%" 는 부정확. 실제로는 GEO ~30%, Renaissance RIEF ~8.7%. AQR -13%는 확인됨.
> 출처: CNN Money (2007.8.13), AQR "August of our Discontent" 회고

#### 원인
- **Crowded Trade**: 모두가 같은 팩터 모델 사용
- 한 펀드가 디레버리징 시작 → 매도 → 가격 하락 → 다른 펀드 손실 → 또 매도 → ...
- **Liquidity Crisis** 본질

#### 교훈
- 모델이 같으면 시장 충격 시 같이 망함
- 다양성 확보 중요
- **"You are what you model"**

> 📄 Khandani, A. E., & Lo, A. W. (2007). What happened to the quants in August 2007? *Journal of Investment Management*.

---

## 🟣 [전공자] — 1차 자료

### 1. Marcos López de Prado — 금융 ML 권위자

#### 1.1 핵심 저서
- López de Prado, M. (2018). *Advances in Financial Machine Learning*. Wiley.
- López de Prado, M. (2020). *Machine Learning for Asset Managers*. CUP.

#### 1.2 핵심 주장
1. **Backtest Overfitting**: 백테스트 과적합이 가장 큰 위험
2. **Probability of Backtest Overfitting (PBO)**: 정량 측정 가능
3. **Triple-Barrier Method**: 시계열 라벨링의 새 방법
4. **Fractional Differentiation**: 시계열 정상성 + 메모리 유지

#### 1.3 PBO 공식
$$ \text{PBO} = \frac{1}{N} \sum_{i=1}^N \mathbb{1}\{\text{outperformer in IS} \cap \text{underperformer in OOS}\} $$

### 2. Campbell Harvey & Man vs. Machine

> 📄 Harvey, C. R., Rattray, S., Sinclair, A., & Van Hemert, O. (2017). Man vs. machine: comparing discretionary and systematic hedge fund performance. *JPM*, 43(4), 55–69.

**핵심 발견**:
- 헤지펀드 9000개, 1996-2014 분석
- Systematic Macro: 연 5.0% (Sharpe 0.36)
- Discretionary Macro: 연 4.7% (Sharpe 0.30)
- 차이 통계적으로 무의미
- → **둘 다 비슷한 성과**

### 3. BloombergGPT — LLM in Finance

> 📄 Wu, S., et al. (2023). BloombergGPT: A large language model for finance. arXiv:2303.17564.

**스펙**:
- 500억 파라미터 (GPT-3 1,750억 대비 약 1/3.5; GPT-3.5 파라미터는 공식 비공개)
- 데이터셋: 약 708B 토큰 (FinPile 363B + 일반 345B), 실제 학습은 **569B 토큰** 사용
- 학습: **512 A100 GPU × 53일** (64 nodes × p4d.24xlarge)

**성능**:
- 일반 LLM 벤치마크: BLOOM, GPT-NeoX, OPT 등 동급 모델과 동등하거나 약간 우수 (논문 비교 대상이 GPT-3가 아님)
- 금융 특화: 일반 LLM 압도 (FPB, FiQA SA, Headline)

> ⚠ 정정: 초기 작성본의 "GPT-3.5의 1/3" 표현은 부정확(GPT-3.5 파라미터는 비공개). "학습 데이터 7080억 토큰"도 정확히는 "데이터셋 708B 중 학습 사용 569B". 일반 LLM 벤치마크 비교 대상은 GPT-3가 아닌 BLOOM/GPT-NeoX/OPT.

### 4. Quant Quake 2007 학술 자료

> 📄 Khandani, A. E., & Lo, A. W. (2007). What happened to the quants in August 2007? *Journal of Investment Management*, 5(4), 5–54.
> 📄 Khandani, A. E., & Lo, A. W. (2011). What happened to the quants in August 2007? Evidence from factors and transactions data. *Journal of Financial Markets*, 14(1), 1–46.

**메커니즘**:
1. 한 펀드의 리스크 한도 초과 → 자산 매도
2. 같은 팩터 노출 펀드들 동시 손실
3. 마진콜 → 더 많은 매도
4. **Liquidity Spiral**

### 5. 딥러닝 + 자산 가격 학술 자료

> 📄 Gu, S., Kelly, B., & Xiu, D. (2020). Empirical asset pricing via machine learning. *RFS*, 33(5), 2223–2273.

→ 60년 미국 주식 데이터, **Neural Network가 OLS 대비 Sharpe 2배+**.

> 📄 Chen, L., Pelger, M., & Zhu, J. (2024). Deep learning in asset pricing. *Management Science*.

→ 딥러닝 기반 SDF (Stochastic Discount Factor).

---

### 🟣 [전공자 심화] — Quant Quake 2007의 한계와 후속 연구

#### 원논문 한계
- **사후 분석(post-hoc)**: Khandani-Lo(2007/2011)은 사건 후 재구성. 실시간 crowding 측정 도구는 제시하지 못함.
- **표본 한정**: 8월 6~10일 며칠간의 사건. 단일 에피소드 일반화 위험.
- **인과 vs. 상관**: liquidity spiral의 trigger를 정확히 식별하지 못함(subprime → multi-strategy fund 디레버리지 가설).
- **거래소·익명 데이터 한계**: 어떤 펀드가 어떤 포지션이었는지 직접 관측 불가, 대용량 13F·factor mimicking portfolio로 간접 추정.

#### 비판 문헌
- Pedersen, L. H. (2009). When everyone runs for the exit. *International Journal of Central Banking*, 5(4), 177–199. — Quant Quake를 일반화한 funding liquidity spiral 모델.
- Pojarliev, M., & Levich, R. M. (2011). Detecting crowded trades in currency funds. *Financial Analysts Journal*, 67(1), 26–39. — crowding을 정량 측정하는 지표 (양의 노출 펀드 비율 − 음의 노출 펀드 비율) 제안.

#### 후속 연구 동향 (2017~)
- Lo, A. W. (2017). *Adaptive Markets: Financial Evolution at the Speed of Thought*. Princeton University Press. — EMH를 진화론적으로 확장. Quant Quake를 "ecosystem disruption"으로 재해석. 시장 효율성은 환경 의존적이며 진화한다는 명제. https://press.princeton.edu/books/paperback/9780691191362/adaptive-markets
- Cont, R., & Wagalath, L. (2016). Fire sales forensics: Measuring endogenous risk. *Mathematical Finance*, 26(4), 835–866. — 펀드 동질성으로부터 fire-sale 위험을 정량 측정.
- Capponi, A., & Larsson, M. (2015). Price contagion through balance sheet linkages. *Review of Asset Pricing Studies*, 5(2), 227–253.
- Brown, G. W., Howard, P., & Lundblad, C. T. (2022). Crowded trades and tail risk. *Review of Financial Studies*, 35(7), 3231–3271. — crowding score가 미래 tail risk를 예측. https://doi.org/10.1093/rfs/hhab108
- arXiv crowding networks 연구: Goldberg, L., & Mahmoud, O. (2023). Model-free market risk hedging using crowding networks. arXiv:2306.08105. https://arxiv.org/abs/2306.08105

#### 실무 적용 시 주의점
- 한국 시장에서도 2018년 코스닥 바이오·2020년 3월 코로나 패닉 시 quant equity long-short 펀드의 동시 손실 사례 보고됨. 한국형 헤지펀드 시장이 작아 익명화된 13F 등가 데이터가 부재 → crowding 측정 어려움.
- 외국인 동시 매도 + 마진콜이 한국 특유의 fire sale 경로. 환율·외국인 수급 데이터를 crowding proxy로 활용 권장.
- 공매도 부분 재개(2024) 후 long-short 전략 crowding 위험 재평가 필요.

---

### 🟣 [전공자 심화] — BloombergGPT(Wu et al. 2023)의 한계와 후속 연구

#### 원논문 한계
- **폐쇄형**: 모델·코드·가중치 비공개. 재현 불가, 검증 어려움.
- **학습 데이터 비공개**: FinPile 363B 토큰의 정확한 출처·라이선스 미공개.
- **벤치마크 선택 편향**: 비교 대상이 BLOOM/GPT-NeoX/OPT (당시 동급 오픈). GPT-3.5/4와의 본격 비교 없음. 후속 분석은 GPT-4가 finance task에서 BloombergGPT를 상회한다고 보고.
- **fine-tuning vs. in-context learning**: 일반 LLM에 few-shot prompting만 해도 비슷한 성능 달성 가능성 → 도메인 학습의 marginal value 의문.
- **금융 추론 능력 미평가**: 감성·분류·NER 위주. 멀티스텝 reasoning (수익률 계산, 회계처리) 평가 부족.

#### 비판 문헌
- Li, X., Chan, S., Zhu, X., Pei, Y., Ma, Z., Liu, X., & Shah, S. (2023). Are ChatGPT and GPT-4 general-purpose solvers for financial text analytics? An examination on several typical tasks. arXiv:2305.05862. https://arxiv.org/abs/2305.05862 — GPT-4가 BloombergGPT와 대등하거나 우월한 task 다수.
- Shah, R. S., Chawla, K., Eidnani, D., et al. (2022). When FLUE meets FLANG: Benchmarks and large pre-trained language model for financial domain. *EMNLP 2022*. arXiv:2211.00083. — 도메인 사전학습의 marginal gain이 작다는 연구도 다수.

#### 후속 연구 동향 (2023~)
- Yang, H., Liu, X.-Y., & Wang, C. D. (2023). FinGPT: Open-source financial large language models. arXiv:2306.06031. https://arxiv.org/abs/2306.06031 — LoRA 기반 경량 파인튜닝, 오픈소스 데이터 파이프라인. AI4Finance-Foundation/FinGPT GitHub.
- Wang, N., Yang, H., & Wang, C. D. (2023). FinGPT: Instruction tuning benchmark for open-source large language models in financial datasets. arXiv:2310.04793. https://arxiv.org/abs/2310.04793
- Xie, Q., Han, W., Zhang, X., et al. (2023). PIXIU: A large language model, instruction data and evaluation benchmark for finance. *NeurIPS Datasets & Benchmarks*. arXiv:2306.05443. — 오픈 finance LLM(FinMA)과 평가 벤치마크(FLARE).
- Araci, D. (2019). FinBERT: Financial sentiment analysis with pre-trained language models. arXiv:1908.10063. — pre-LLM 시대의 BERT 기반 금융 도메인 모델. encoder-only로 fine-tuning 중심. BloombergGPT(decoder-only, generative)와 task scope 다름.
- Liu, X.-Y., Wang, G., Yang, H., & Zha, D. (2023). FinGPT: Democratizing internet-scale data for financial large language models. arXiv:2307.10485.

#### in-context learning vs. fine-tuning — 최근 합의
- 일반 LLM(GPT-4, Llama-3 70B)에 도메인 few-shot prompting + RAG가 fine-tuning만큼 효과적이라는 보고 다수.
- Fine-tuning은 (1) 데이터 프라이버시·온프레미스 요구, (2) 추론 latency 최적화, (3) 반복적 형식 강제(예: JSON 출력) 시 유리.

#### 실무 적용 시 주의점
- 한국어 금융 도메인은 SOTA 한국어 LLM(Polyglot-Ko, EXAONE, HyperCLOVA-X) 위에 한국 공시(DART)·뉴스(연합인포맥스)·증권사 보고서로 LoRA 파인튜닝하는 패턴이 일반적.
- 한국어 금융 벤치마크 부재가 가장 큰 제약. KorFin-ASA 정도가 있으나 영문 FPB/FiQA만큼 표준화 안 됨.
- 환각(hallucination) 위험: 종목 코드·재무 수치 생성 시 RAG + 검증 단계 필수. 단독 LLM 출력 신뢰 금지.

---

## 📚 책에는 없지만 알면 좋은 것

### 🔍 보충 1 — LTCM 사건 1998 (AI 모델 신뢰의 위험)

#### 사건 요약
- **Long-Term Capital Management** (LTCM): 1994 설립
- 운용자: John Meriwether + Myron Scholes (1997 노벨상) + Robert Merton (1997 노벨상)
- 전략: 채권 차익 거래 (Black-Scholes 모델 응용)
- 1998 러시아 디폴트 → 모델 가정 깨짐 → $4.6B 손실
- Fed가 14개 은행 모아 구제

#### 교훈
- **모델은 가정 안에서만 옳다**
- 블랙 스완 (예측 불가 사건) 대비 필요
- 노벨상도 시장을 못 이긴다

### 🔍 보충 2 — Renaissance의 비공개 비결

#### Medallion Fund의 성공 요인 (추정)
1. **수천 개의 약한 신호** 결합 (각 신호 정확도 51~52%)
2. **빠른 트레이딩** (분/초 단위)
3. **레버리지** 활용 (자본의 12배까지)
4. **외부 자금 없음** → 규모 제한 → 알파 유지

#### 다른 펀드는 왜 못 따라하나
- 알고리즘은 일종의 **공공재 (Crowded Trade)**
- 한 알고리즘 누설되면 그 알파 사라짐
- → Renaissance는 직원 비밀 유지 + 외부 채용 안 함

### 🔍 보충 3 — 한국 퀀트 펀드 현황 (2024)

#### 주요 운용사
- **타임폴리오 자산운용**: 약 10조원 (한국 1위)
- **DS자산운용**
- **신영자산운용**
- **NH-Amundi**

#### 한국 퀀트의 특징
- 미국 대비 5~10년 뒤
- 데이터 부족 (한국 주식 30년 vs. 미국 100년)
- 코스피 변동성 큼 → 모델 안정성 어려움
- 외국인 비중 30~40% → 거시 요인 의존

### 🔍 보충 4 — XAI (Explainable AI) — 블랙박스 해결책

#### LIME (Local Interpretable Model-Agnostic Explanations)
- 임의 모델에 대해 **국지적 설명**
- 한 예측에 대해 "이 피처가 +5%, 저 피처가 -3%" 식

#### SHAP (SHapley Additive exPlanations)
- 게임 이론 Shapley value 기반
- **전역 + 국지 설명**
- 금융권 표준

#### 사용 예시 (Python)
```python
import shap
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X)
shap.summary_plot(shap_values, X)
```

### 🔍 보충 5 — 백테스트 함정과 PBO

#### 7가지 백테스트 함정 (López de Prado)
1. **Survivorship Bias**: 상장폐지 기업 제외
2. **Look-Ahead Bias**: 미래 정보 활용
3. **Data Snooping**: 같은 데이터 반복 사용
4. **Time-Period Bias**: 특정 기간 선택
5. **Selection Bias**: 좋은 결과 선별 보고
6. **Transaction Costs Ignored**: 수수료 무시
7. **Outliers Ignored**: 극단값 제외

#### Deflated Sharpe Ratio
$$ \hat{SR}_{Deflated} = \frac{SR - E[\max_n SR]}{\hat{\sigma}_{SR}} $$

여러 전략 시도 시 알파의 운(luck) 보정.

> 📄 Bailey, D. H., & López de Prado, M. (2014). The deflated Sharpe ratio. *Journal of Portfolio Management*, 40(5), 94–107.

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. AI가 인간 투자자보다 항상 좋나?

**A.** **아니다, 상황별로 다름**.
- 일반 주식 시장: AI ≈ 인간 (Harvey 2017 증명)
- HFT: AI >> 인간
- 가치 투자 장기: 인간 ≈ AI (모델 한계)
- 위기 시 (2008, 2020): **인간이 더 잘 적응**

### Q2. 과적합을 100% 피할 수 있나?

**A.** **불가능**. 줄일 수만 있음.
- 데이터를 충분히 분리 (Train/Val/Test)
- Cross-Validation
- Regularization
- Simple > Complex 원칙
- Out-of-Sample 테스트 강제

### Q3. 블랙박스 모델은 금융에서 못 쓰나?

**A.** **부분적으로 가능**.
- 한국 금융위 가이드라인: "설명가능성" 의무
- LLM 같은 블랙박스 → 신용평가에 못 씀
- 그러나 **백오피스 분석, 텍스트 처리, 챗봇**에는 가능
- → **결정 단계만 설명가능 모델 사용**

### Q4. 데이터를 안 사도 알고리즘 트레이딩 가능한가?

**A.** **가능, 그러나 제한적**.
- 무료 데이터: yfinance, FinanceDataReader, pykrx
- 일일 데이터 → 가능 (장기 전략)
- 분/초 데이터 → 유료
- 대체 데이터 (위성, 신용카드) → 매우 비싸거나 불가

### Q5. 오픈소스 라이브러리만으로 헤지펀드 수준 가능한가?

**A.** **이론은 가능, 실전은 어려움**.

가능한 이유:
- 라이브러리: sklearn, PyTorch
- 데이터: Kaggle, 무료 API
- 인프라: Google Colab (GPU 무료)

어려운 이유:
- 데이터 품질
- 백테스팅 함정
- 실전 거래 비용
- 자금 부족

### Q6. LTCM 사건이 AI 시대에 또 일어날까?

**A.** **위험은 더 큼**.
- AI 모델이 더 복잡 → 가정 깨질 가능성 큼
- 모든 펀드가 비슷한 ML 모델 사용 → Crowded Trade
- **2024 새 위험**: 모든 펀드가 LLM 사용 → 같은 답변 → 같은 매매

### Q7. 한국 퀀트가 미국보다 뒤처진 이유?

**A.** **데이터 + 인프라 + 인재 차이**.
- 데이터: 한국 30년 vs. 미국 100년
- 인프라: HFT 콜로케이션 늦음
- 인재: 카뱅/네이버가 가져감 (헤지펀드 X)
- 자본: 미국 헤지펀드 $4조 vs. 한국 30조
- 규제: 한국 시장 더 엄격

---

## 🎯 이 절에서 가져갈 핵심 7가지

1. **AI 투자 동력 3가지**: 컴퓨팅 폭증·데이터 폭증·오픈소스 발전.
2. **트랜지스터 1억배 증가** (1970~2024) — 머신러닝 가능해진 결정적 이유.
3. **AI 투자 장점**: 감정 배제·속도·정보 처리량·비선형 패턴·24시간·일관성·확장성.
4. **AI 투자 단점**: 과적합·블랙박스·데이터 의존·시장 변화 약함·편향·규제.
5. **2007 Quant Quake**: 모든 퀀트 펀드 동시 손실 → Crowded Trade 위험.
6. **LTCM 1998**: 노벨상도 시장 못 이김 → 블랙 스완 대비 필요.
7. **백테스트 함정 7가지** (López de Prado) — PBO로 정량 측정 필요.

---

## 📖 더 읽을거리

### AI 투자 입문
- 마르코스 로페즈 데 프라도. (2021). *자산운용사를 위한 금융 머신러닝*. 에이콘.
- 관련: 동일 저자군의 2020년 전작 (한빛미디어) 도 참고 가능

### 학술 (영어)
- López de Prado, M. (2018). *Advances in Financial Machine Learning*. Wiley.
- López de Prado, M. (2020). *Machine Learning for Asset Managers*. CUP.

### 1차 자료
- Harvey, C. R., et al. (2017). Man vs. machine. *JPM*, 43(4).
- Gu, S., Kelly, B., & Xiu, D. (2020). Empirical asset pricing via machine learning. *RFS*, 33(5).
- Khandani, A. E., & Lo, A. W. (2011). What happened to the quants in August 2007? *Journal of Financial Markets*.
- Bailey, D. H., & López de Prado, M. (2014). The deflated Sharpe ratio. *JPM*.

### XAI
- Lundberg, S. M., & Lee, S. I. (2017). A unified approach to interpreting model predictions. *NeurIPS*.
- Ribeiro, M. T., Singh, S., & Guestrin, C. (2016). "Why Should I Trust You?" *KDD*.

### 사례 연구
- Zuckerman, G. (2019). *The Man Who Solved the Market* (Renaissance).
- Lowenstein, R. (2000). *When Genius Failed* (LTCM).
- Lewis, M. (2014). *Flash Boys* (HFT).

---

## 📋 검증 노트 / 변경 이력

| # | 항목 | 초기 작성본 | 수정 내용 | 1차 출처 |
|---|---|---|---|---|
| 1 | scikit-learn 출시 | 2007년 출시 | **2007 GSoC 시작 / 2010.2 첫 공개 릴리스** | [scikit-learn About](https://scikit-learn.org/stable/about.html) |
| 2 | BloombergGPT 비교 | "GPT-3.5 1,750억 / 7,080억 토큰" | **GPT-3 1,750억 (GPT-3.5 비공개); 데이터셋 708B 중 학습 569B 사용; 비교군은 BLOOM/GPT-NeoX/OPT** | [arXiv 2303.17564](https://arxiv.org/abs/2303.17564) |
| 3 | RIEF 수치 출처 | "AQR Capital 발표" | **WSJ/Bloomberg 보도** (AQR는 RIEF 수치 발표 안 함) | WSJ 2007.8 |

---

> **다음 절 예고** — §2.4 + §2.5 금융 투자 데이터 유형과 소스
> 마켓 데이터·펀더멘털 데이터·대체 데이터의 3가지 유형, 그리고 무료/유료 데이터 소스 선택 가이드.
