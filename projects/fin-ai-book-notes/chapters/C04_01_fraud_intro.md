# 4.1 ~ 4.4 금융 사기 거래 탐지 도입 — *Fraud Detection Foundations*

> **원서 위치**: 김태헌, 《금융 AI의 이해》(제이펍, 2024), §4.1~4.4 (pp.203–208)
> **원서 분량**: 약 6쪽
> **해설 분량**: 약 25쪽
> **읽는 데 걸리는 시간**: 약 45분

---

## 🪧 이 절을 한 줄로

> 금융 사기 탐지 = **희박·세심·은닉·다양·진화** 5가지 특성을 가진 적과의 끊임없는 군비 경쟁.
> AI는 이 경쟁의 최신 무기.

책은 §4.1~4.4에서 사기 탐지의 중요성, 이상 탐지 vs. 사기 거래 탐지, 9가지 사기 유형, 5가지 사기 특성을 다룬다. 이 해설집은:
1. **5가지 사기 특성을 시각화**
2. **9가지 사기 유형 + 한국 사례** (보이스피싱, 스미싱)
3. **AML 글로벌 시장과 규제** 보강

### 📍 미리 그릴 큰 그림

<svg viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">금융 사기 탐지 — 군비 경쟁의 큰 그림</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- 5 characteristics -->
    <text x="380" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">▼ 사기의 5가지 특성</text>
    <rect x="20" y="70" width="135" height="60" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="87" y="92" text-anchor="middle" font-weight="700" fill="#c4724e">① 희박</text>
    <text x="87" y="110" text-anchor="middle" font-size="9" fill="#57534e">사기 비율 0.1~3%</text>
    <rect x="165" y="70" width="135" height="60" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="232" y="92" text-anchor="middle" font-weight="700" fill="#c4724e">② 세심·조직</text>
    <text x="232" y="110" text-anchor="middle" font-size="9" fill="#57534e">잘 계획된 범죄</text>
    <rect x="310" y="70" width="135" height="60" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="377" y="92" text-anchor="middle" font-weight="700" fill="#c4724e">③ 숨김</text>
    <text x="377" y="110" text-anchor="middle" font-size="9" fill="#57534e">탐지 회피 노력</text>
    <rect x="455" y="70" width="135" height="60" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="522" y="92" text-anchor="middle" font-weight="700" fill="#c4724e">④ 다양 유형</text>
    <text x="522" y="110" text-anchor="middle" font-size="9" fill="#57534e">9+ 종류</text>
    <rect x="600" y="70" width="135" height="60" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="667" y="92" text-anchor="middle" font-weight="700" fill="#c4724e">⑤ 진화</text>
    <text x="667" y="110" text-anchor="middle" font-size="9" fill="#57534e">시간 따라 변화</text>
    <!-- vs -->
    <text x="380" y="170" text-anchor="middle" font-size="14" font-weight="700" fill="#1c1917">vs.</text>
    <!-- AI defense -->
    <text x="380" y="200" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">▼ AI 방어 진화</text>
    <rect x="80" y="215" width="170" height="60" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="165" y="237" text-anchor="middle" font-weight="700" fill="#3a7d44">규칙 기반 → ML</text>
    <text x="165" y="255" text-anchor="middle" font-size="9" fill="#57534e">초기 (1980s)</text>
    <rect x="265" y="215" width="170" height="60" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="350" y="237" text-anchor="middle" font-weight="700" fill="#3a7d44">지도+비지도 ML</text>
    <text x="350" y="255" text-anchor="middle" font-size="9" fill="#57534e">2000s~</text>
    <rect x="450" y="215" width="170" height="60" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="535" y="237" text-anchor="middle" font-weight="700" fill="#3a7d44">DL + GNN</text>
    <text x="535" y="255" text-anchor="middle" font-size="9" fill="#57534e">2015~</text>
    <rect x="635" y="215" width="100" height="60" rx="6" fill="#1c1917"/>
    <text x="685" y="237" text-anchor="middle" font-weight="700" fill="#fff">LLM 통합</text>
    <text x="685" y="255" text-anchor="middle" font-size="9" fill="#fff">2023~ (보도, 공식 미확인)</text>
  </g>
  <text x="380" y="320" text-anchor="middle" font-size="11" font-style="italic" fill="#57534e">"한 발자국 앞서기" — 사기꾼과 탐지자의 무한 경쟁</text>
</svg>

---

## 🟢 [초급] — 사기 탐지가 왜 중요한가

### 1. 일상으로 보는 사기

#### 너가 매일 보호받는 순간들
- 아침: 카드 결제 → FDS가 자동 검증 (0.05초)
- 점심: 송금 → 새 계좌면 알림 + 추가 인증
- 오후: 보이스피싱 의심 통화 → 카뱅이 송금 차단
- 저녁: 가짜 쇼핑몰 결제 → 카드사 차단

→ **하루 평균 10번 정도 너도 모르게 사기 탐지 시스템 작동**.

### 2. 사이버소스 2024 통계

> "**2022년 전 세계 이커머스 거래의 3%가 사기 거래**"
> — Cybersource, *2024 Global Fraud and Payments Report*

이 의미:
- 1조 거래 중 300억이 사기
- 하루 27억 거래 → 8000만 사기
- 1초당 약 1000건 사기 시도

### 3. 이상 탐지 vs. 사기 거래 탐지 — 같은 듯 다름

| | 이상 탐지 (Anomaly Detection) | 사기 거래 탐지 (Fraud Detection) |
|---|---|---|
| **방식** | 비지도 학습 | 지도 학습 |
| **목표** | 정상에서 벗어난 것 | 알려진 사기 패턴 |
| **데이터** | 정상 데이터만 | 라벨 (사기/정상) |
| **장점** | 새 사기 패턴 발견 | 정확함 |
| **단점** | 오탐 많음 | 신규 사기 못 잡음 |
| **활용** | 초기 경보 | 운영 모델 |

→ **실제로는 둘 다 사용** (하이브리드).

### 4. 9가지 금융 사기 유형

책 표 4-1 정리:

| # | 유형 | 한 줄 설명 | 한국 사례 |
|---|------|---------|---------|
| 1 | **신용카드 사기** | 도난 카드 불법 사용 | 카드복제 |
| 2 | **신원 도용** | 남의 정보로 거래 | 명의도용 대출 |
| 3 | **피싱** | 이메일/문자로 정보 탈취 | 스미싱 |
| 4 | **폰지/피라미드** | 가짜 고수익 약속 | 머지포인트 |
| 5 | **금융상품 사기** | 거짓 정보로 판매 | DLF 사태 |
| 6 | **보험 사기** | 거짓 청구 | 자해 보험 사기 |
| 7 | **체크 사기** | 가짜/도난 체크 | 한국 드뭄 |
| 8 | **돈세탁 (AML)** | 범죄 수익 출처 은닉 | 비트코인 세탁 |
| 9 | **증권 사기** | 시장조작·내부거래 | 작전주 |
| 10 | **모기지 사기** | 부동산 대출 위조 | 갭투자 사기 |

### 5. 새 사기 유형 — 책 본문

- **SIM 스왑**: 휴대폰 번호 옮겨 OTP 가로채기
- **ATM 스키밍**: ATM에 장치 설치, 카드 정보 훔침
- **소셜 엔지니어링**: 심리 조작으로 정보 얻기

#### 한국 특화 (책 외 보충)
- **보이스피싱**: 2023년 피해 약 **1,965억원** (전년 1,451억, 금감원 발표)
- **메신저피싱**: 가족·지인 사칭
- **로맨스 스캠**: SNS 통한 사기
- **딥페이크 사기**: AI 음성/영상 사칭

> ✅ **여기까지 따라왔으면**: 사기 종류와 탐지가 왜 어려운지 보일 거다.

---

## 🟡 [중급] — 사기의 5가지 특성

### 1. 특성 ①: 희박함 (Sparsity)

#### 1.1 의미
> "대부분의 거래는 정상이고, 사기는 극소수"

수치:
- 카드 결제: 0.1~0.5% 사기
- 보험 청구: 1~3% 사기
- 대출 신청: 5~10% 부도 (사기 ≠ 부도이지만 비슷한 비율)

#### 1.2 모델링 도전
```
99.9%가 정상이면 → "모두 정상" 예측해도 정확도 99.9%
   → Accuracy 무의미
   → PR-AUC, F1 사용
   → 불균형 학습 기법 필요 (SMOTE, Class Weight)
```

### 2. 특성 ②: 신중함 + 조직화 (Carefully Organized)

#### 2.1 의미
> "사기는 우연이 아니라 잘 계획된 범죄"

#### 2.2 사례 — 보이스피싱 조직

```
[조직 구성]
- 수금책 (한국)
- 인출책 (한국)
- 송금책 (해외)
- 콜센터 (중국, 베트남)
- 명의자 (대포통장)
- 총책 (해외)

→ 한 사기 사건에 5~10명 관여
→ 100~수천만원 단위 거래
```

→ **단일 거래만 봐서는 못 잡음**. 네트워크 분석 필요 (그래프).

### 3. 특성 ③: 미세하게 숨겨짐 (Stealth)

#### 3.1 의미
> "사기꾼은 탐지를 회피하려고 노력"

#### 3.2 회피 기법

| 방법 | 설명 |
|------|------|
| **Smurfing** | 큰 금액 → 여러 작은 금액 분할 (AML 회피) |
| **Layering** | 여러 계좌 거치기 (돈세탁) |
| **Velocity Manipulation** | 정상 패턴 모방 |
| **Adversarial ML** | AI 모델 자체 공격 |

#### 3.3 AML 신고 임계값
- **CTR**: 10,000 USD 이상 의무 신고
- **SAR**: 의심 거래 보고
- 사기꾼은 9,999 USD 단위로 분할

### 4. 특성 ④: 다양한 형태 (Variety)

#### 4.1 의미
> "사기는 모든 분야에서, 다양한 방식으로"

#### 4.2 도메인별 사기

| 도메인 | 주요 사기 |
|--------|---------|
| 카드 | CNP fraud, 카드복제 |
| 은행 | 보이스피싱, 송금 사기 |
| 보험 | 청구 사기, 자해 |
| 증권 | 시장조작, 작전 |
| 핀테크 | 계정 탈취, BNPL 악용 |
| 암호화폐 | Rug Pull, ICO 사기 |

### 5. 특성 ⑤: 시간에 따른 진화 (Evolution)

#### 5.1 의미
> "탐지 기술 발전 = 사기 기술도 발전"

#### 5.2 사례 — 한국 보이스피싱 진화

```
2010년대 초:
- "검사인데 사건 연루"
- 단순 송금 유도

2015년경:
- "은행 대출 사기 확인"
- 가짜 앱 설치 유도

2020년경:
- 콜백 피싱
- AI 음성 (이제 부모님 목소리)

2024년:
- 딥페이크 영상 통화
- ChatGPT로 자연스러운 대화
```

→ **모델도 매월 재학습** 해야 따라감.

### 6. 5가지 특성의 종합 시각화

<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">사기 탐지 모델의 5가지 도전과 대응</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <rect x="20" y="55" width="320" height="240" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="180" y="78" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">⚠ 도전 (Challenge)</text>
    <text x="40" y="105" fill="#1c1917">① 희박: 사기 0.1% → 학습 어려움</text>
    <text x="40" y="130" fill="#1c1917">② 조직: 단일 거래 → 네트워크</text>
    <text x="40" y="155" fill="#1c1917">③ 숨김: 분할/위장 → 패턴 변형</text>
    <text x="40" y="180" fill="#1c1917">④ 다양: 10+ 유형 → 모델 분산</text>
    <text x="40" y="205" fill="#1c1917">⑤ 진화: 새 수법 → 즉시 적응</text>
    <text x="40" y="240" fill="#c4724e" font-weight="700">결과:</text>
    <text x="40" y="260" fill="#57534e">• 라벨 데이터 부족</text>
    <text x="40" y="278" fill="#57534e">• 모델 성능 한계</text>
    <rect x="380" y="55" width="320" height="240" rx="8" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="540" y="78" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">✓ 대응 (Solution)</text>
    <text x="400" y="105" fill="#1c1917">① SMOTE/Cost-sensitive Learning</text>
    <text x="400" y="130" fill="#1c1917">② Graph Neural Network (GNN)</text>
    <text x="400" y="155" fill="#1c1917">③ 시계열 LSTM, Anomaly Detection</text>
    <text x="400" y="180" fill="#1c1917">④ Multi-task Learning</text>
    <text x="400" y="205" fill="#1c1917">⑤ Online Learning + 매월 재학습</text>
    <text x="400" y="240" fill="#3a7d44" font-weight="700">결과:</text>
    <text x="400" y="260" fill="#57534e">• 알리페이 1000만 중 0.64건 (2020 발표)</text>
    <text x="400" y="278" fill="#57534e">• 한국 카드사 0.001% 이하</text>
  </g>
</svg>

> ✅ **여기까지 따라왔으면**: 사기 탐지가 왜 어렵고, AI가 어떻게 대응하는지 보일 거다.

---

## 🔴 [고급] — 영문 용어와 책의 한계

### 1. 사기 탐지 영문 용어

#### 1.1 사기 유형
- **CNP (Card Not Present) Fraud**: 비대면 카드 사기
- **CP (Card Present) Fraud**: 대면 카드 사기
- **Account Takeover (ATO)**: 계정 탈취
- **Synthetic Identity Fraud**: 합성 신원
- **First-Party Fraud**: 본인이 사기 (예: 일부러 부도)
- **Third-Party Fraud**: 타인 사칭
- **Friendly Fraud**: 차지백 남용 (본인이 했으면서 "안 했어요")
- **Phishing**: 피싱
- **Smishing**: SMS 피싱
- **Vishing**: 음성 피싱
- **Whaling**: 임원/VIP 표적 피싱

#### 1.2 AML 용어
- **AML (Anti-Money Laundering)**: 자금세탁 방지
- **KYC (Know Your Customer)**: 고객 알기 제도
- **CDD (Customer Due Diligence)**: 고객 실사
- **EDD (Enhanced Due Diligence)**: 강화 실사
- **PEP (Politically Exposed Person)**: 정치적 노출자
- **SAR (Suspicious Activity Report)**: 의심 거래 보고
- **CTR (Currency Transaction Report)**: 통화 거래 보고
- **Smurfing**: 작은 거래로 분할

#### 1.3 탐지 기법
- **Rule-Based**: 규칙 기반
- **Anomaly Detection**: 이상 탐지
- **Outlier Detection**: 이상치 탐지
- **Pattern Recognition**: 패턴 인식
- **Behavioral Analytics**: 행동 분석
- **Network Analysis**: 네트워크 분석
- **Graph Neural Network (GNN)**: 그래프 신경망

### 2. 책의 한계 5가지

#### 한계 ①: 한국 보이스피싱 미언급
한국 최대 사기 유형 (2023년 1,965억원, 금감원). 책은 글로벌 위주.

#### 한계 ②: 딥페이크 사기 미언급
2023~ AI 음성/영상 사기 폭증. 책 시점엔 적었음.

#### 한계 ③: AML 시장 미언급
글로벌 AML 시장 $2.5B (2024). 사기탐지와 별개 분야.

#### 한계 ④: 차지백 (Chargeback) 미설명
사기 확인의 주요 메커니즘. 책은 짧게 언급.

#### 한계 ⑤: Adversarial Attack 미언급
사기꾼이 AI 모델 자체를 공격하는 신종 위협.

### 3. 차지백 (Chargeback) 시스템

#### 3.1 작동 메커니즘

```
1. 고객 결제 (10만원)
2. 카드 청구서 받음
3. "이 거래 내가 안 했어요" 신고
4. 카드사가 가맹점에 문의
5. 가맹점이 증명 못 하면 차지백
6. 고객에게 환불, 가맹점 손실
```

#### 3.2 사기 탐지의 핵심 데이터
- **차지백 비율** = 사기율의 근사치
- 학습 라벨로 사용
- 단점: **30~120일 지연** (Lag)

### 4. AML 글로벌 규제

#### 4.1 FATF (Financial Action Task Force)
- 1989 설립
- 회원국 40개국 + 2개 지역기구(EU, GCC)
- AML/CFT 국제 표준 제정

#### 4.2 주요 규제

| 국가 | 법 |
|------|---|
| 미국 | Bank Secrecy Act (1970), Patriot Act (2001) |
| EU | AMLD 6 (2020) |
| 한국 | 특정금융정보법 (특정 금융거래정보의 보고 및 이용 등에 관한 법률, 법률 제6516호, **2001.9.27 제정**) |
| 글로벌 | FATF 권고안 40 |

> ⚠ 정정: 초기 작성본의 한국 특정금융정보법 "2007"은 6년 오차. 실제 제정일은 2001.9.27이며, KoFIU(금융정보분석원)도 2001.11에 설립됐다. FATF 회원국도 "39개국"이 아니라 40개국 + 2개 지역기구다.

#### 4.3 한국 AML
- **금융정보분석원 (FIU)**: 의심 거래 신고 접수
- **고액 현금 거래**: 1000만원 이상 자동 보고
- **의심 거래 보고**: 임의 금액 의심 시 보고

### 5. 책의 한계를 보완하는 학술 자료

> 📄 Bhattacharyya, S., et al. (2011). Data mining for credit card fraud: A comparative study. *Decision Support Systems*, 50(3).

> 📄 Phua, C., et al. (2010). A comprehensive survey of data mining-based fraud detection research. arXiv:1009.6119.

---

## 🟣 [전공자] — 사기 탐지 학술

### 1. 사기 탐지 ML 벤치마크

#### 1.1 Bhattacharyya et al. (2011)
> 신용카드 사기 탐지에 가장 자주 인용되는 벤치마크.

**핵심 발견**:
- Random Forest > Neural Net > SVM > Logistic Regression
- PR-AUC 가 AUC-ROC보다 신뢰

#### 1.2 Pozzolo et al. (2014)
> 📄 Dal Pozzolo, A., Caelen, O., Le Borgne, Y. A., Waterschoot, S., & Bontempi, G. (2014). Learned lessons in credit card fraud detection from a practitioner perspective. *Expert Systems with Applications*, 41(10).

**Kaggle Credit Card Fraud 데이터셋** 의 출처. 285K 거래, 0.17% 사기.

### 2. 이상 탐지 알고리즘

#### 2.1 Isolation Forest
> 📄 Liu, F. T., Ting, K. M., & Zhou, Z.-H. (2008). Isolation forest. *ICDM*.

핵심: "이상치는 빨리 분리됨".

수식:
$$ s(x, n) = 2^{-\frac{E(h(x))}{c(n)}} $$

- $E(h(x))$: 분리에 필요한 평균 path 길이
- $c(n)$: 정상화 상수

#### 2.2 One-Class SVM
> 📄 Schölkopf, B., Platt, J. C., Shawe-Taylor, J., Smola, A. J., & Williamson, R. C. (2001). Estimating the support of a high-dimensional distribution. *Neural Computation*, 13(7).

#### 2.3 Local Outlier Factor (LOF)
> 📄 Breunig, M. M., Kriegel, H.-P., Ng, R. T., & Sander, J. (2000). LOF: identifying density-based local outliers. *SIGMOD*.

### 3. Graph Neural Network in Fraud

#### 3.1 GraphSAGE
> 📄 Hamilton, W. L., Ying, R., & Leskovec, J. (2017). Inductive representation learning on large graphs. *NeurIPS*.

#### 3.2 GAT (Graph Attention)
> 📄 Veličković, P., et al. (2018). Graph attention networks. *ICLR*.

#### 3.3 알리페이 응용
> 📄 Wang, D., et al. (2019). A semi-supervised graph attentive network for financial fraud detection. *IEEE ICDM*.

### 4. Adversarial Fraud

> 📄 Cartella, F., Anunciacao, O., Funabiki, Y., Yamaguchi, D., Akishita, T., & Elshocht, O. (2021). Adversarial attacks for tabular data: Application to fraud detection. *arXiv:2101.08030*.

사기꾼이 ML 모델 자체를 공격:
- Evasion attack
- Poisoning attack
- Membership inference

### 5. Federated Learning in Fraud

> 📄 Yang, Y., Saoud, A., et al. (2019). Federated machine learning: Concept and applications. *ACM TIST*, 10(2).

여러 은행이 협업 학습 (데이터 공유 없이).

### 🟣 [전공자 심화] — 사기 탐지 핵심 알고리즘의 한계와 후속 연구

#### 원논문 한계

**Dal Pozzolo et al. (2014)**
- Undersampling으로 학습한 모델은 출력 확률이 사후 보정(posterior correction) 없으면 편향됨 — 논문 자체가 지적했으나 후속 적용 시 종종 누락됨.
- Kaggle 데이터셋은 PCA 변환된 28개 피처만 제공 → 실제 거래 시점·MCC·디바이스 등 임상적으로 중요한 변수가 사라져 실전 일반화 검증이 어려움.
- 시계열적 splitting 부재(원논문은 시간 순 split을 강조하나, 후속 연구는 random split 남용).

**Liu, Ting, & Zhou (2008) — Isolation Forest**
- 고차원·범주형 혼합 데이터에서 random partitioning이 의미를 잃음(curse of dimensionality 변형).
- "이상치는 분리가 쉽다"는 가정이 군집형(masquerading) 사기에는 약함 — 사기단이 정상 패턴을 모방하면 path length가 정상과 유사.
- 점수의 절대값이 데이터셋 크기 $n$에 의존하는 normalization을 사용해 데이터셋 간 비교가 까다로움.

**Schölkopf et al. (2001) — One-Class SVM**
- 커널 선택과 $\nu$ 파라미터에 매우 민감, cross-validation도 라벨이 거의 없어 어렵다.
- $O(n^2) \sim O(n^3)$ 학습 복잡도 → 수백만 거래 규모에서 실시간 학습 불가.
- 분포의 *support*만 추정 → 사기 점수의 *순위*만 의미 있고 *확률* 해석 불가.

**Breunig et al. (2000) — LOF**
- $k$-nearest neighbor 기반 → 차원 증가 시 거리 metric이 무의미해짐.
- 사기 cluster가 정상 sparse region과 인접하면 LOF score가 비슷해져 분리 실패.

#### 비판 문헌

- **Aggarwal, C. C. (2017). *Outlier Analysis* (2nd ed.). Springer.** — Ch. 5에서 Isolation Forest의 고차원 성능 저하와 적절한 차원 축소 전처리의 필요성을 상세 논의.
- **Campos, G. O., Zimek, A., Sander, J., et al. (2016). On the evaluation of unsupervised outlier detection: measures, datasets, and an empirical study. *Data Mining and Knowledge Discovery*, 30(4), 891–927.** — One-Class SVM, LOF, iForest를 23개 데이터셋에서 비교 → 어느 한 알고리즘도 일관된 우위가 없음을 보임.
- **Han, S., Hu, X., Huang, H., Jiang, M., & Zhao, Y. (2022). ADBench: Anomaly detection benchmark. *NeurIPS Datasets and Benchmarks 2022*.** arXiv:2206.09426 — 57개 데이터셋·30개 알고리즘 비교: 비지도 deep AD가 고전 방법을 일관되게 이기지 못함을 실증.

#### 후속 연구 동향 (2020~)

- **Deep SVDD**: Ruff, L., Vandermeulen, R., Goernitz, N., et al. (2018). *Deep one-class classification.* ICML 2018. — One-Class SVM의 deep 버전, 잠재공간에서 hypersphere 학습. http://proceedings.mlr.press/v80/ruff18a.html
- **Deep AD survey**: Pang, G., Shen, C., Cao, L., & Hengel, A. v. d. (2021). *Deep learning for anomaly detection: A review.* ACM Computing Surveys, 54(2). arXiv:2007.02500
- **PyOD**: Zhao, Y., Nasrullah, Z., & Li, Z. (2019). *PyOD: A Python toolbox for scalable outlier detection.* JMLR 20(96). — 40+ 알고리즘 통합 벤치마크. https://pyod.readthedocs.io/
- **시계열 사기 + 자기지도학습**: Schmidl, S., Wenig, P., & Papenbrock, T. (2022). *Anomaly detection in time series: a comprehensive evaluation.* VLDB Endowment 15(9).
- **Transformer 기반 사기 탐지**: Padhi, I., Schiff, Y., Melnyk, I., et al. (2021). *Tabular transformers for modeling multivariate time series.* ICASSP 2021. arXiv:2011.01843

#### 한국 적용 시 주의점

- 카드 사기 탐지에서 Isolation Forest 단독 운영은 권장되지 않음 — masquerading 사기에 취약하므로 supervised XGBoost와 하이브리드가 표준.
- One-Class SVM은 한국 카드사 일배치 규모(수천만 행)에서 학습 불가에 가까움 → Deep SVDD 또는 Autoencoder 기반 대체 고려.
- ADBench 결과에 따르면 deep AD가 무조건 이기지 않으므로, 모델 선택 시 도메인 데이터 베이스라인 비교가 필수. 실시간 시스템은 *추론* 지연도 함께 고려.
- 한국 금융 데이터 특성상 라벨(차지백)이 30~120일 지연 → semi-supervised(PU-learning 등) 방법이 후속 연구로 적합.

---

## 📚 책에 없지만 알면 좋은 것

### 🔍 보충 1 — 한국 보이스피싱 통계 (금감원)

| 연도 | 피해액 |
|------|------|
| 2022 | 1,451억원 |
| 2023 | **1,965억원** (전년 +35%) |
| 2024~ | 추정 (지속 감시) |

> ⚠ 정정: 초기 작성본의 "4,500억원" 은 사실 다른 사이버사기 합산 수치였음. 보이스피싱 단독은 위 표가 정확 (금감원).

주요 수단 (대략):
- 검찰/경찰 사칭
- 가족 사칭 (메신저피싱)
- 대출 사기

### 🔍 보충 2 — 카카오뱅크 FDS (AI 기반)

- AI 기반 사기 탐지 시스템 운영 (구체적 알고리즘 비공개)
- 2023년: 약 88억원 사기 피해 예방
- 2023년: 87.7~385억원 (카카오 금융안전보고서·전자신문·아시아에이; 시스템·집계 범위별 차이), 2025년 358억원 (머니S)

> ⚠ 정정: 초기 작성본의 "GNN 기반 + 보이스피싱 60% 감소" 는 출처 미확인 → 제거. 카뱅 공식 자료는 AI/ML 기반이라고만 명시 (GNN 명시 X). "2세대" 라는 공식 명칭도 확인 안 됨.

### 🔍 보충 3 — Apple Card 차별과 사기 탐지

차별과 사기 탐지의 경계:
- "이상 패턴" = 사기인가, 차별인가?
- 모델이 특정 그룹을 더 자주 의심 → 차별
- → Fairness 검증 필수

### 🔍 보충 4 — Deepfake 사기 사례

#### 홍콩 Arup 사건 (2024.2)
- **회사**: Arup (영국 엔지니어링 기업) 홍콩 지사
- 직원이 영상 회의에서 영국 본사 CFO + 동료들 보고
- 모두 **AI 생성 딥페이크**
- **HK$200M ≈ US$25.6M (약 340억원) 송금** (15회 분할)
- 출처: CNN, SCMP 등 다수 보도

> ⚠ 정정: 초기 작성본 "$2500만" 은 USD/HKD 환산 혼동. 정확히는 HK$200M = **US$25.6M**.

#### 한국 사례
- 카카오톡 가족 사칭 + 딥페이크 음성
- 2024년 피해 급증

### 🔍 보충 5 — Sanctions Screening

#### OFAC List
미국 재무부 제재 명단:
- 북한·이란·러시아 관련 인물/기업
- 송금/거래 시 자동 차단

#### 한국 적용
- 금융기관 의무 (자금세탁방지법)
- KFTC (한국금융정보분석원) 관리

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. 이상 탐지가 사기 탐지보다 못한가?

**A.** **상황 따라 다름**.

- 신규 사기 탐지: 이상 탐지 우위
- 알려진 사기 탐지: 사기 탐지 우위
- **실제 시스템**: 둘 다 사용 (하이브리드)

### Q2. AML과 사기 탐지가 같은 것?

**A.** **별개 분야**, 일부 중첩.

| | AML | Fraud Detection |
|---|---|---|
| 목표 | 자금세탁 방지 | 사기 손실 차단 |
| 규제 | 강 (의무 보고) | 약 |
| 시점 | 사후 보고 | 실시간 차단 |
| 손실 | 벌금 | 직접 손실 |

### Q3. 신용카드 사기율 0.1%가 진짜?

**A.** **글로벌 평균**. 한국은 더 낮음.

- 한국 카드사 평균: 0.02~0.05%
- 미국: 0.1~0.5%
- 인도/동남아: 0.5~2%

→ **한국 카드 사기 탐지 시스템이 글로벌 최고 수준**.

### Q4. 보이스피싱은 어떻게 막나?

**A.** 다층 방어:
1. **통신사**: 의심 번호 자동 차단
2. **은행**: 새 계좌 이체 시 추가 인증
3. **앱**: 보이스피싱 의심 알림
4. **AI**: 통화 내용 분석 (일부 서비스)

### Q5. 차지백이 사기 라벨로 쓰일 수 있나?

**A.** **표준 라벨**. 단점:
- 30~120일 지연
- "Friendly Fraud" (본인이 거짓 신고)
- 작은 사기는 차지백 안 함

### Q6. SIM 스왑 어떻게 막나?

**A.**
- 통신사: 본인 확인 강화
- 은행: SMS OTP → 앱 인증 (OTP)
- 사용자: PIN 설정

### Q7. AI vs. 사기꾼 — 누가 이길까?

**A.** **무한 경쟁**. 단기적으로는 AI 우위.
- AI: 처리 속도, 패턴 학습
- 사기꾼: 창의성, 인간 심리 이용

→ 결국 **사람 + AI 협업** 이 답.

---

## 🎯 이 절에서 가져갈 핵심 7가지

1. **금융 사기 = 0.1~3% 의 극소수** (희박함).
2. **5가지 특성**: 희박 · 조직 · 숨김 · 다양 · 진화.
3. **9가지 사기 유형** + 한국 보이스피싱 (2023년 1,965억원, 금감원).
4. **이상 탐지 (비지도) + 사기 탐지 (지도)** = 하이브리드.
5. **차지백** 이 사기 라벨의 주요 출처 (30~120일 지연).
6. **AML/KYC** 가 별도 규제 영역 (FATF, 한국 FIU).
7. **AI vs. 사기꾼** = 무한 군비 경쟁, 매월 재학습 필요.

---

## 📖 더 읽을거리

### 사기 탐지 표준
- 《부정 적발 애널리틱스》 (한울, 2019). — **책 §4.4 출처**.
- Bolton, R. J., & Hand, D. J. (2002). Statistical fraud detection: A review. *Statistical Science*, 17(3).

### 학술
- Bhattacharyya, S., et al. (2011). Data mining for credit card fraud: A comparative study. *DSS*.
- Phua, C., et al. (2010). A comprehensive survey of data mining-based fraud detection research. arXiv.

### AML
- FATF 권고안: https://www.fatf-gafi.org/
- 한국 FIU: https://www.kofiu.go.kr/

### 한국 자료
- 금융감독원. *전자금융사기 동향 분석* (매년).
- 한국인터넷진흥원. *피싱·스미싱 통계*.

### 카뱅 사례
- 카카오뱅크 Tech Blog (FDS 2세대 사례).

---

## 📋 검증 노트 / 변경 이력

> 본문 내 "⚠ 정정" 주석을 한곳에 모은 변경 이력.

| # | 항목 | 초기 작성본 | 수정 내용 | 1차 출처 |
|---|---|---|---|---|
| 1 | 보이스피싱 피해 | 4,500억원 (출처 불명) | **1,965억원 (2023, 금감원 2024.3 발표)**, 2022년 1,451억 대비 35.4% 증가 | [금감원](https://www.fss.or.kr/) |
| 2 | 알리페이 LLM 2023 도입 | "2023년 LLM 도입" | 공식 출처 미확인. AlphaRisk 마지막 공식 공개는 2020년 5세대 enhanced | [Alipay 2020 PR](https://www.businesswire.com/news/home/20200514005941/en/) |
| 3 | 알리페이 0.64건 시점 | "사기 손실률 1천만 건 중 0.64건" | **2020년 Alipay 공식 발표 수치임** 시점 명시 | 同上 |
| 4 | 특정금융정보법 | 2007 제정 | **2001.9.27 제정** (법률 제6516호); KoFIU 2001.11 설립 | [KoFIU](https://www.kofiu.go.kr/) |
| 5 | FATF 회원국 | 39개국 | **40개국 + 2개 지역기구 (EU, GCC)** | [FATF](https://www.fatf-gafi.org/en/countries.html) |
| 6 | 카뱅 사기 예방 수치 | "2024년 123~385억" 단일 묶음 | 2023년 시스템·집계 범위별: 87.7억(머신러닝)/123억(AI 전체)/385억(FDS+보이스피싱); 2025년 358억 | [카카오 금융안전보고서](https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/esg/report/2023KakaoFinancialSafetyReport.pdf) |

---

> **다음 절 예고** — §4.5+4.6 사기 탐지의 진화 + 시장
> AI 진화 (규칙→ML→GNN), 시장 규모 (글로벌 $478억), 3가지 접근 방법.
