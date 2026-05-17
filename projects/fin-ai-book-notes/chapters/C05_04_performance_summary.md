# 5.8 ~ 5.9 AI 프로덕트 성과 측정 + 마무리 — *Performance Measurement & Summary*

> **원서 위치**: 김태헌, 《금융 AI의 이해》(제이펍, 2024), §5.8 (pp.297–299), §5.9 (p.299)
> **원서 분량**: 약 3쪽
> **해설 분량**: 약 18쪽

---

## 🪧 이 절을 한 줄로

> AI 프로덕트 성과 = **비즈니스 관점** (사기 탐지율 vs. 고객 경험) + **시스템적 관점** (Chip Huyen 4특성) + **정량 지표** (5단계 평가).

### 📍 큰 그림

<svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">AI 프로덕트 성과 측정 — 3가지 관점</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- Business -->
    <rect x="20" y="60" width="220" height="220" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="130" y="85" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">① 비즈니스 관점</text>
    <text x="130" y="115" text-anchor="middle" fill="#1c1917">사기 탐지율 ↑</text>
    <text x="130" y="135" text-anchor="middle" fill="#1c1917">매출 ↑</text>
    <text x="130" y="155" text-anchor="middle" fill="#1c1917">고객 만족도 ↑</text>
    <text x="130" y="180" text-anchor="middle" font-weight="700" fill="#c4724e">트레이드오프</text>
    <text x="130" y="200" text-anchor="middle" font-size="10" fill="#57534e">정확도 vs. 거짓 거부</text>
    <text x="130" y="220" text-anchor="middle" font-size="10" fill="#57534e">성능 vs. 고객 경험</text>
    <text x="130" y="245" text-anchor="middle" font-size="10" fill="#57534e">예: 사기 100% 차단</text>
    <text x="130" y="260" text-anchor="middle" font-size="10" fill="#57534e">→ 고객 이탈</text>
    <!-- System -->
    <rect x="260" y="60" width="220" height="220" rx="8" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="370" y="85" text-anchor="middle" font-size="13" font-weight="700" fill="#5a7a96">② 시스템적 관점</text>
    <text x="370" y="105" text-anchor="middle" font-size="10" fill="#57534e">(Chip Huyen 4특성)</text>
    <text x="370" y="130" text-anchor="middle" fill="#1c1917">신뢰성 (Reliability)</text>
    <text x="370" y="155" text-anchor="middle" fill="#1c1917">확장성 (Scalability)</text>
    <text x="370" y="180" text-anchor="middle" fill="#1c1917">유지보수성 (Maintainability)</text>
    <text x="370" y="205" text-anchor="middle" fill="#1c1917">적응성 (Adaptability)</text>
    <text x="370" y="240" text-anchor="middle" font-size="10" fill="#57534e">"머신러닝 시스템 설계"</text>
    <text x="370" y="258" text-anchor="middle" font-size="10" fill="#57534e">(한빛미디어, 2023)</text>
    <!-- Quantitative -->
    <rect x="500" y="60" width="220" height="220" rx="8" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="610" y="85" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">③ 정량 지표</text>
    <text x="610" y="115" text-anchor="middle" font-size="10" fill="#57534e">5단계 평가 (1~5점)</text>
    <text x="610" y="140" text-anchor="middle" fill="#1c1917">• 데이터 접근성 (20%)</text>
    <text x="610" y="160" text-anchor="middle" fill="#1c1917">• 상호 운용성 (15%)</text>
    <text x="610" y="180" text-anchor="middle" fill="#1c1917">• 분석 가능성 (15%)</text>
    <text x="610" y="200" text-anchor="middle" fill="#1c1917">• 최종 사용자 가치 (50%)</text>
    <text x="610" y="240" text-anchor="middle" font-size="10" fill="#57534e">총점 = Σ (점수 × 비율)</text>
  </g>
</svg>

---

## 🟢 [초급] — 비즈니스 관점

### 1. 트레이드오프 — 사기 탐지 예시

#### 시나리오: 사기 탐지율 vs. 고객 경험

```
[전략 A: 엄격한 차단]
사기 탐지율: 95%
거짓 거부율: 10%
   → 사기 손실 ↓
   → 고객 100명 중 10명 거래 거부 → 불만 ↑

[전략 B: 균형]
사기 탐지율: 85%
거짓 거부율: 2%
   → 사기 손실 약간 ↑
   → 고객 경험 ↑

[전략 C: 관대]
사기 탐지율: 70%
거짓 거부율: 0.5%
   → 사기 손실 ↑↑
   → 고객 경험 ↑↑
```

→ **B (균형) 가 보통 최적**.

### 2. 비즈니스 지표 예시

| 지표 | 사기 탐지 | 신용평가 | 챗봇 |
|------|---------|---------|------|
| **주요 지표** | 사기 손실액 | 부도율 | 처리율 |
| **부지표** | 거짓 거부율 | 거절율 | 만족도 |
| **재무** | ROI | NPV | 콜센터 비용 절감 |
| **고객** | NPS | CSAT | NPS |

### 3. 한국 사례

#### 카카오뱅크 (예시 KPI 시나리오, 가상 수치)
- 사기 탐지 정확도, 거짓 거부율, 응답 시간, 고객 만족도 같은 항목을 비즈니스 KPI로 한 줄로 추적한다.
- 구체적 수치(99.99% / 0.1% / 50ms / 4.8 등)는 카뱅 공식 자료에서 확인되지 않는 **가상 예시**이므로, 실제 모니터링 대시보드에서는 자사 측정값으로 채울 것.

> ⚠ 정정: 초기 작성본의 "BAS 점수 - 99.99% / 0.1% / 50ms / 4.8" 4종 수치는 공개 출처가 없는 가상 예시였다. "BAS"라는 용어 자체도 카뱅 공식 자료에 등장하지 않으므로 인용·전파에 주의.

> ✅ **여기까지 따라왔으면**: 비즈니스 관점의 트레이드오프가 보일 거다.

---

## 🟡 [중급] — 시스템적 관점 (Chip Huyen 4특성)

### 1. 4특성 상세

#### 특성 ①: 신뢰성 (Reliability)

> "시스템이 일관된 예측 + 빠른 회복"

체크리스트:
- [ ] 99.9% 이상 가용성
- [ ] 에러 자동 감지
- [ ] Graceful Degradation (장애 시 대체)
- [ ] Failover 자동

#### 특성 ②: 확장성 (Scalability)

> "데이터/요청 증가 시 성능 유지"

체크리스트:
- [ ] 수평 확장 가능 (서버 추가)
- [ ] 로드 밸런싱
- [ ] 캐싱 (Redis)
- [ ] 비동기 처리

#### 특성 ③: 유지보수성 (Maintainability)

> "장기 운영 + 업데이트 가능"

체크리스트:
- [ ] 코드 가독성
- [ ] 모듈화
- [ ] 테스트 자동화 (CI/CD)
- [ ] 문서화
- [ ] 기술 부채 관리

#### 특성 ④: 적응성 (Adaptability)

> "외부 변화에 유연 대응"

체크리스트:
- [ ] Drift 자동 감지
- [ ] 재학습 자동화
- [ ] A/B 테스트 인프라
- [ ] 새 피처 추가 용이

### 2. 비즈니스 vs. 시스템 관점

| 관점 | 우선순위 | 측정 |
|------|---------|------|
| **비즈니스** | 단기 ROI | 매출, 손실 |
| **시스템** | 장기 안정 | SLA, MTTR |

→ **둘 다 중요** (균형).

> ✅ **여기까지 따라왔으면**: Chip Huyen 4특성 + 비즈니스 관점이 보일 거다.

---

## 🔴 [고급] — 정량 평가 (책 표 5-4)

### 1. 5단계 평가 (1~5점)

| 지표 | 비율 | 1점 | 3점 | 5점 |
|------|------|-----|-----|-----|
| **데이터 접근성** | 20% | 낮음 | 중간 | 매우 높음 |
| **상호 운용성** | 15% | 없음 | 중간 | 매우 높음 |
| **분석 가능성** | 15% | 어려움 | 중간 | 매우 쉬움 |
| **최종 사용자 가치** | **50%** | 어려움 | 중간 | 매우 높음 |

### 2. 종합 점수 계산

```python
def calculate_product_score(scores):
    """AI 프로덕트 종합 점수"""
    weights = {
        'data_accessibility': 0.20,
        'interoperability': 0.15,
        'analyzability': 0.15,
        'end_user_value': 0.50
    }
    
    total = sum(scores[k] * weights[k] for k in scores)
    return total  # 1~5점

# 예시
scores = {
    'data_accessibility': 4,
    'interoperability': 3,
    'analyzability': 4,
    'end_user_value': 5
}
print(f"종합: {calculate_product_score(scores):.2f}점")
# 4.40점
```

### 3. 정량 지표의 4가지 장점

1. **체계적 평가**: 주관 배제
2. **개선 영역 식별**: 낮은 점수 → 집중
3. **벤치마크 가능**: 다른 프로덕트 비교
4. **장기 추적**: 시간 흐름별 추이

### 4. 추가 지표 예시 (한국 금융권)

#### 사기 탐지 KPI

| 지표 | 측정 | 목표 |
|------|------|------|
| **사기 탐지 정확도** | TP / (TP+FN) | > 90% |
| **거짓 거부율** | FP / (FP+TN) | < 1% |
| **응답 시간** | p99 latency | < 100ms |
| **사기 손실 감소** | (전년-현재)/전년 | > 30% |
| **고객 만족도** | NPS | > 50 |

#### 신용평가 KPI

| 지표 | 측정 | 목표 |
|------|------|------|
| **AUC** | ROC-AUC | > 0.80 |
| **KS** | 통계량 | > 0.40 |
| **PSI** | 안정성 | < 0.10 |
| **승인율** | 승인 / 전체 | 적정 수준 |
| **부도율** | 부도 / 승인 | < 5% |

### 5. 책의 한계 5가지

#### 한계 ①: 표 5-4의 가중치 출처 불명
"50% 최종 사용자 가치"가 왜? 근거 없음.

#### 한계 ②: SRE (Site Reliability Engineering) 미언급
구글의 SLA/SLO/SLI 프레임워크.

#### 한계 ③: Cost Metrics 부재
모델 운영비, GPU 비용 등.

#### 한계 ④: 한국 금융권 사례 없음
KB, 신한 등 실제 KPI.

#### 한계 ⑤: AI 윤리 지표 부재
Fairness, Explainability 정량화.

---

## 🟣 [전공자] — 학술적 깊이

### 1. SRE (Site Reliability Engineering)

> 📄 Beyer, B., Jones, C., Petoff, J., & Murphy, N. R. (2016). *Site Reliability Engineering*. O'Reilly.

#### SLA / SLO / SLI

- **SLA (Service Level Agreement)**: 외부 약속 (99.9% 가용성)
- **SLO (Service Level Objective)**: 내부 목표 (99.95%)
- **SLI (Service Level Indicator)**: 실제 측정 (현재 99.97%)

#### Error Budget
$$ \text{Error Budget} = 1 - SLO $$
- 99.9% SLO → 0.1% 에러 허용 (월 43분)

### 2. ROI 계산

#### 단순 ROI
$$ ROI = \frac{\text{Benefit} - \text{Cost}}{\text{Cost}} \times 100\% $$

#### NPV (Net Present Value)
$$ NPV = \sum_{t=0}^{T} \frac{C_t}{(1+r)^t} $$

#### 예시
- AI 도입 비용: $1M (초기) + $200K/년
- 사기 손실 절감: $2M/년
- 5년 NPV (r=10%): $6.6M

### 3. Chip Huyen 책 핵심

> 📄 Huyen, C. (2022). *Designing Machine Learning Systems*. O'Reilly.

#### 4가지 특성 외 추가:
- **Iterative**: 반복 개선
- **Versioned**: 모델/데이터 버전
- **Reproducible**: 재현성
- **Observable**: 관측성

### 4. Fairness Metrics

```python
from fairlearn.metrics import demographic_parity_difference, equalized_odds_difference

# Demographic Parity
dp_diff = demographic_parity_difference(
    y_true=y_test,
    y_pred=y_pred,
    sensitive_features=df_test['gender']
)

# Equalized Odds
eo_diff = equalized_odds_difference(
    y_true=y_test,
    y_pred=y_pred,
    sensitive_features=df_test['gender']
)

print(f"DP: {dp_diff:.3f}, EO: {eo_diff:.3f}")
```

### 5. AI Governance Frameworks

- **NIST AI RMF**: 미국
- **EU AI Act**: 유럽 (High-Risk 분류)
- **ISO/IEC 42001**: 국제
- **금융위 AI 가이드라인**: 한국

---

### 🟣 [전공자 심화] — MLOps 측정/SLA 의 학술적 토대와 재현성 위기

#### 원논문/실무 표준의 한계

본 절의 "비즈니스 + 시스템(Chip Huyen 4특성) + 정량(5단계 평가)" 프레임은 실무 가이드 위주로 구성됐지만, 학술적으로는 다음 한계가 있다.

1. **5단계 가중치(20/15/15/50%) 의 출처 불명**: 책 표 5-4 의 가중치는 어떤 실증 연구에도 기반하지 않음.
2. **재현성(Reproducibility) 지표 부재**: 모델 성과 측정 자체가 재현 가능한지 검증되지 않으면 KPI 자체가 무의미.
3. **AI 시스템의 환경비용·사회비용 미반영**: 탄소 배출, 데이터 노동, 알고리즘 차별 등 외부효과가 KPI 에서 빠짐.
4. **모델 카드·데이터 시트 같은 투명성 산출물 부재**: 모델 단위 성과 보고서 표준이 KPI 체계에 통합되지 않음.
5. **"95% 정확도" 의 통계적 유의성 결여**: 신뢰구간·검정력 분석 없이 단일 점추정치로 의사결정.

#### 비판 문헌 (1차 자료 검증)

- **Bender, Gebru, McMillan-Major, Shmitchell (2021), "On the Dangers of Stochastic Parrots: Can Language Models Be Too Big? 🦜," *Proceedings of FAccT 2021*, pp. 610–623. DOI: 10.1145/3442188.3445922.** — 대규모 LLM 의 4가지 위험: ① **환경·재무 비용** (GPT-3 학습 1회 = 자동차 평생 배출량 5배), ② **블랙박스 편향**, ③ **stochastic mimicry** (이해 없이 통계 모방), ④ **deception risk**. 금융 LLM(BloombergGPT, FinBERT) 도입 시 동일 위험. 발표 직후 Gebru·Mitchell 의 Google 해고 사건으로 논쟁. ([dl.acm.org](https://dl.acm.org/doi/10.1145/3442188.3445922))
- **Mitchell, Wu, Zaldivar, Barnes, Vasserman, Hutchinson, Spitzer, Raji, Gebru (2019), "Model Cards for Model Reporting," *Proceedings of FAT\* 2019* (현 FAccT). arXiv:1810.03993.** — 모델 별 **(의도된 용도, 평가 데이터셋, 성능 분해 — 인구·인종·성별별, 윤리적 고려, 한계)** 를 1~2 페이지 표준 카드로 보고. **Google, Hugging Face, OpenAI 가 표준 채택**. 한국 금융위 AI 가이드라인 (2021) 의 "모델 설명 보고서" 도 사실상 model card 형식. ([arxiv.org](https://arxiv.org/abs/1810.03993))
- **Hutson, M. (2018), "Artificial intelligence faces reproducibility crisis," *Science* 359(6377), 725–726. DOI: 10.1126/science.359.6377.725.** — 2018년 AAAI 가 reproducibility 를 공식 어젠다화한 시점의 *Science* 뉴스 기사. **미공개 코드·하이퍼파라미터·초기값·학습 환경**이 ML 재현성 위기의 4대 원인. 이후 NeurIPS Reproducibility Checklist (2019~), ICML Code Submission Policy (2019~) 등 학회 차원 대응 시작. ([science.org](https://www.science.org/doi/10.1126/science.359.6377.725))
- **Gebru, Morgenstern, Vecchione, Vaughan, Wallach, Daumé, Crawford (2021), "Datasheets for Datasets," *Communications of the ACM* 64(12), 86–92.** — 데이터셋 별 카드(motivation, composition, collection, preprocessing, uses, distribution, maintenance). Model Cards 의 데이터 짝.

#### 후속 연구·실무 동향 (2020~)

- **NIST AI Risk Management Framework 1.0 (2023.1)** — Govern, Map, Measure, Manage 4 함수. AI 시스템 신뢰성 표준화 시도. EU AI Act (2024 발효) high-risk AI 시스템 요건과 연동.
- **EU AI Act (Regulation (EU) 2024/1689)** — 신용평가·고용·교육 AI 를 high-risk 로 분류, **모델 카드 + 위험 평가 + 인간 감독 + 사이버보안** 의무화. 2025~2027 단계적 시행. 한국 금융 AI 도 EU 진출 시 적용.
- **ISO/IEC 42001:2023 — AI Management System** — 조직 차원 AI 거버넌스 첫 ISO 표준.
- **Reproducibility 인프라**: MLflow, Weights & Biases, DVC (Data Version Control), Hydra (설정 관리). NeurIPS·ICML 의 paperswithcode.com·Reproducibility Challenge.
- **Carbon Tracking**: CodeCarbon, ML CO2 Calculator — 학습 시 탄소 배출량 자동 측정. Bender 등 2021 의 환경비용 비판을 정량화한 도구.

#### 한국 적용 시 주의점

- **금융위 AI 가이드라인 (2021.7) + 개정 (2024.7)** — 신용평가·자산운용·고객응대 AI 의 **설명가능성·공정성·재현성·인간 감독** 요건. Model Cards (Mitchell et al. 2019) 와 사실상 동형.
- **개인정보보호위원회 AI 가이드라인 (2023, 2024)** — 학습 데이터 정당성·필요성·최소수집 원칙. 신용정보법과 중첩 적용.
- **금융보안원 (FSEC) MLSecOps 가이드** — 모델 보안(model stealing, adversarial attack, poisoning) 평가 의무. SLA 에 **모델 보안 항목 추가** 권고.
- **망분리 → 재현성 도전**: 인터넷망 학습 → 업무망 운영의 환경 차이로 학습 시 메트릭과 운영 시 메트릭이 다를 수 있음. Docker 이미지 외에 **하드웨어·라이브러리 freeze** 별도 관리 필요.
- **한국어 LLM 의 환경비용**: 한국어 corpus 부족으로 영어 LLM 대비 학습 효율 떨어짐 — KT MIDM, 네이버 HyperCLOVA X, LG EXAONE 등의 탄소비용은 비공개. Bender 2021 식 환경비용 보고가 한국 금융권에선 아직 부재.
- **한국 금융 데이터의 재현성 한계**: KRX·DART API 가 **과거 시점 스냅샷**을 제공하지 않음 (현재 시점만 제공) — 1년 전 학습 환경을 정확히 재현하기 어렵다. 사내 데이터 lake 에 raw snapshot 저장이 필수.
- **AI 윤리 위원회 부재 사례**: 카카오·네이버는 AI 윤리 헌장·위원회 보유, 시중은행은 도입 초기 단계 — Model Cards·Datasheets 운영 체계가 자리잡지 않음.

---

## 📚 책에 없지만 알면 좋은 것

### 🔍 보충 1 — Google's HEART Framework

UX 측정 5가지:
- **H**appiness: 사용자 만족
- **E**ngagement: 참여도
- **A**doption: 도입률
- **R**etention: 유지율
- **T**ask Success: 작업 완료율

### 🔍 보충 2 — North Star Metric

한 가지 핵심 지표:
- 사기 탐지: 사기 손실 비율
- 신용평가: 부도율 vs. 승인율 비율
- 챗봇: 1차 해결률 (FCR)

### 🔍 보충 3 — OKR (Objective and Key Results)

```
[목표 Q1 2024]
신용평가 모델 v2 배포

[핵심 결과]
1. AUC 0.82 → 0.85
2. 운영 비용 20% 절감
3. 거절자 항의 30% 감소
```

### 🔍 보충 4 — Data-Driven Decision Making

```python
# Bayesian Decision Theory
def optimal_threshold(cost_fp, cost_fn, prior_fraud=0.05):
    """비용 기반 최적 임계값"""
    threshold = (cost_fp * (1 - prior_fraud)) / \
                (cost_fp * (1 - prior_fraud) + cost_fn * prior_fraud)
    return threshold

# 사기 탐지: FN=10×FP
threshold = optimal_threshold(cost_fp=1, cost_fn=10)
print(f"Optimal: {threshold:.3f}")
```

### 🔍 보충 5 — Total Cost of Ownership (TCO)

```
[연간 TCO]
인프라 (서버, 클라우드): $200K
인력 (DS, MLE): $500K
도구 (MLflow, Datadog): $50K
교육: $20K
─────────────────
TCO: $770K/년
```

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. ROI 어떻게 계산?

**A.** 4단계:
1. Baseline (도입 전) 측정
2. AI 도입 후 측정
3. 차이 = 효과
4. 효과 / 비용 = ROI

### Q2. SLA 99.9% 의미?

**A.**
- 연 8.76시간 다운 허용
- 월 43.2분
- 주 10분
- → 매우 엄격

### Q3. 사기 탐지 비용 비대칭?

**A.** **보통 FN > FP**.
- FN (사기 놓침): 손실액 (대): 5천만원 평균
- FP (정상 거절): 매출 손실 (소): 5만원 평균
- 비율: 1000:1

### Q4. 모델 도입 후 ROI 음수?

**A.** **원인 점검**:
- 모델 성능 실제 효과 X
- 운영 비용 과다
- 학습 데이터 부족
- → 재평가

### Q5. Chip Huyen 책 추천?

**A.** **꼭 읽어야**. MLOps의 바이블.

### Q6. 정량 vs. 정성 평가?

**A.** **둘 다 필요**.
- 정량: 객관, 비교 가능
- 정성: 맥락, 통찰
- 균형이 답.

### Q7. AI 윤리 어떻게 측정?

**A.**
- Fairlearn (Microsoft)
- AIF360 (IBM)
- What-If Tool (Google)
- 정량적 차별 측정

---

## 🎯 §5.8+5.9 핵심 7가지

1. **3가지 관점**: 비즈니스 + 시스템 + 정량.
2. **트레이드오프**: 사기 탐지 정확도 vs. 거짓 거부.
3. **Chip Huyen 4특성**: 신뢰성·확장성·유지보수성·적응성.
4. **5단계 정량 평가** (1~5점 × 가중치).
5. **사기 탐지 KPI 5종**: 정확도, 거짓 거부율, 응답 시간, 손실 감소, NPS.
6. **SRE 표준**: SLA/SLO/SLI + Error Budget.
7. **Fairness 지표** (DP, EO) 도 측정 필수.

---

## 🌉 Ch5 마무리 — MLOps 전체 정리

### 5단계 한 페이지 요약

```
[데이터] → [모델] → [배포] → [모니터링] → [재학습]
   ↑         ↑         ↑          ↑              ↓
Airflow   sklearn   FastAPI   Evidently      MLflow
Kafka     XGBoost   Docker    Alibi          Champion-
Spark     TensorFlow Kubernetes               Challenger
```

### Ch5 핵심 10가지

1. **데이터 파이프라인** = Airflow + Kafka + Spark
2. **운영용 vs. 분석용** 파이프라인 분리
3. **Batch (정기) + Streaming (실시간)** 둘 다
4. **모델 패키징**: pickle → joblib → ONNX
5. **모델 배포**: Flask/FastAPI + Docker + Kubernetes
6. **배포 6종**: Shadow, A/B, Canary, Interleaving, Two-Stage, MAB
7. **Drift 3유형**: Covariate, Concept, Label
8. **PSI > 0.25** = 재학습 트리거
9. **Chip Huyen 4특성**: 신뢰성·확장성·유지보수성·적응성
10. **MLflow**로 모델 버전 관리

### Ch6 진입 준비

다음은 **Ch6 「금융에서의 생성형 AI 활용」** — LLM, RAG, Fine-tuning, FinGPT.

---

## 📖 더 읽을거리

### MLOps
- Huyen, C. (2022). *Designing Machine Learning Systems*. O'Reilly. — **바이블**.
- *Practical MLOps* (Noah Gift, O'Reilly, 2021).

### SRE
- Beyer, B., et al. (2016). *Site Reliability Engineering*. O'Reilly.

### Fairness
- *Fairness and Machine Learning* (Barocas, Hardt, Narayanan). — 무료.

### 한국
- 카카오뱅크 Tech Blog.
- 토스 Tech Blog.

---

> **다음** — Ch6 「금융에서의 생성형 AI 활용」
> LLM, RAG, Fine-tuning, FinGPT/BloombergGPT.
