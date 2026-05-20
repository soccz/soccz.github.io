# 01. 시작하기 전에 — 미리 알아둘 개념

## 📌 이 챕터 다 읽으면 알 수 있는 것

- 본 논문이 **한 문장**으로 뭘 하는지
- 논문의 전체 구조 (5개 섹션 + 부록 → 우리 해설 18 챕터)
- **5가지 핵심 개념** (요인 모델·잠재 요인·autoencoder·conditional factor·no-arbitrage) 의 기초 정의
- 본인의 관심사에 따라 **어느 챕터부터 읽으면 좋은지** 의 추천 표

이 챕터는 **수식 못 읽는 무지식자** 도 따라올 수 있게 디자인됨. 모르는 용어 마주치면 [12_glossary.md](12_glossary.md) 도 참조.

---

## 이 논문이 뭘 하는 논문인가요?

한 문장으로:

> **"기존 자산가격결정 모델은 '주식 특성 → 위험 노출도' 가 선형이라고 가정했는데, 이를 신경망(오토인코더)으로 비선형 일반화한다."**

조금 더 풀면:

- 자산가격결정 (asset pricing) 의 표준 도구는 **요인 모델** — 주식 수익 $r$ 을 $K$ 개의 잠재 요인 $f$ 와 노출도 $\beta$ 의 곱으로 분해.
- 최근의 발견 (Kelly, Pruitt, Su 2019 = **KPS** 또는 IPCA): 노출도 $\beta$ 가 주식의 **특성** $z$ 에 의존. 즉 $\beta(z) = \Gamma' z$ (선형 변환, Eq. 2).
- 본 논문 (Gu, Kelly, Xiu 2021): "왜 굳이 선형이어야 하나? **β-network 만** 신경망으로 비선형 매핑하자. f-network 는 단일 선형층 유지 (portfolio 해석 위해)."
- 결과: 30년 OOS 실증에서 conditional autoencoder (CA2, K=6) 의 Sharpe ratio **value-weight 1.53** — IPCA 0.96, PCA −0.08, FF −0.53 압도.
- **No-arbitrage 보존**: 95 managed portfolios 중 \|t(α)\|>3 인 개수가 FF5 의 37 → CA2 의 **8** 로 축소 (잔존 α 도 < 7 bps/월).

---

## 이 해설집 구성

논문은 5개 섹션 + 부록. 우리 해설은 18 챕터로 분해:

```
[Section 1] Introduction (왜?)
        ↓
[Section 2] Methodology
   2.1 Standard autoencoder (PCA 등가성)
   2.2 Conditional autoencoder (메인 모델)
   2.3 Regularization (LASSO, early stopping, ensemble)
        ↓
[Section 3] US Equity 실증 (60년, 30K stocks, 94 chars)
   3.1-3.2 데이터·모델 비교
   3.3 Total R² + Predictive R²
   3.4 Long-short Sharpe ratio
   3.5 Mispricing α (no-arbitrage)
   3.6 Variable importance
   3.7 Robustness
        ↓
[Section 4] Monte Carlo (linear vs nonlinear truth)
        ↓
[Section 5] Conclusion
        ↓
[Appendix A] Proposition 1, 2 증명
[Appendix B] Algorithm 1 (Early Stopping), 2 (Adam), 3 (Batch Norm)
```

---

## 미리 알아둬야 하는 5가지 개념

### 1. "요인 모델 (Factor Model)" 이 뭐예요?

주식 수익률을 다음처럼 분해:
$$
r_{i,t} = \beta_{i,1} f_{1,t} + \beta_{i,2} f_{2,t} + \cdots + \beta_{i,K} f_{K,t} + u_{i,t}
$$

- $f_k$ = 시장 전체에 작용하는 K개의 공통 위험 요인 (예: 시장 등락, 가치/성장, 모멘텀, 사이즈, ...)
- $\beta_{i,k}$ = 주식 $i$ 가 요인 $k$ 에 얼마나 민감한가 (노출도)
- $u_i$ = 주식 고유의 잡음

**비유**: 학생 점수 = (수학 어려움) × (학생의 수학 약점) + (영어 어려움) × (학생의 영어 약점) + ... + 학생 컨디션.

→ 같은 시점의 시험이 같은 어려움이라도, 학생마다 받는 영향이 다른 이유는 "약점 = 노출도".

### 2. "잠재 요인 (Latent Factor)" 이 뭐예요?

**관측 안 되는** 요인. 데이터에서 추론.
- 시장요인 = 관측 가능 (S&P 500 같은 지수)
- 잠재요인 = 데이터에서 PCA 같은 도구로 추출

본 논문은 **잠재** 요인 모델 (관측 요인 모델 — Fama-French — 와 비교).

### 3. "Autoencoder" 가 뭐예요?

신경망의 한 종류. 핵심 구조:
```
입력 → [Encoder] → 작은 차원 압축 (bottleneck) → [Decoder] → 입력 복원
```

**비유**: 책 한 권을 짧은 요약으로 압축 → 그 요약으로 책을 다시 복원하는 도구.
- 좋은 요약 = 책의 핵심 잘 담은 것
- 좋은 autoencoder = 입력의 핵심 패턴 잘 잡은 것

**왜 자산가격에 쓰나?**: 주식 수익률 패널을 **K 개 요인** 으로 압축 → 다시 복원. 이게 잠재요인 모델 추정과 정확히 같은 일.

→ Hinton-Salakhutdinov (2006): 깊은 autoencoder 가 PCA 보다 이미지 분류에 훨씬 좋다.
→ 본 논문: 같은 통찰을 자산가격에 적용.

### 4. "Conditional Factor Model" 이 뭐예요?

**노출도 $\beta$ 가 시간에 따라 변하는** 모델. 정적 모델의 한계:
- "애플 주식의 시장 노출도가 1.2" — 이게 30년 내내 같지 않다. 회사 성장 / 위기 / 산업 변화에 따라 시변.

해결: $\beta_{i,t-1} = $ 주식 $i$ 의 시점 $t-1$ 특성 $z_{i,t-1}$ 의 함수.
- KPS (IPCA): $\beta(z) = \Gamma' z$ (선형, Eq. 2)
- 본 논문: $\beta(z) = \text{NeuralNetwork}(z)$ (비선형)

### 5. "No-arbitrage (무차익거래)" 가 뭐예요?

자산가격결정의 기본 제약 — **위험 없는 초과수익은 없다**.
- α (pricing error) = 위험으로 설명 안 되는 수익
- 진짜 자산가격 모델이면 α = 0 (모든 수익은 위험 보상)
- α 가 통계적으로 0과 구분 안 되면 → 모델이 no-arbitrage 충족

본 논문 Fig. 3: CA2 의 \|t-stat\|>3.0 인 α 개수가 **8 (out of 95 managed portfolios)**. FF5 는 **37**. → CA 모델이 no-arbitrage 충족.

---

## 이 논문을 읽을 때의 마음가짐

### 독자 유형별 추천 경로 (★ 본 deep dive 의 차별 기능)

| 독자 유형 | 추천 경로 | 예상 시간 | 도달 이해도 |
|-----------|-----------|-----------|-------------|
| **무지식자 / 수식 못 읽음** | 02 (Abstract 일상비유) → 03 (motivation) → **각 챕터의 📌·🌱·📖 callout 만 읽기** → 13 (insights) | 1-2 시간 | 메시지·결과 70-80% |
| **금융 기초 + 수식 가능** | 01-04 → 05a·b 4-단 기호표 + 본문 → 07-08 실증 → 13 통찰 | 4-6 시간 | 전공자 수준 90% |
| **ML 전공, 자산가격 처음** | 02 → 05a (Prop 1) → 05b (구조) → 11 (증명) → 14 (코드) | 3-4 시간 | 수학·구조 100% |
| **자산가격 전공, ML 처음** | 02 → 04 (KPS 출발) → 05c (Prop 2, IPCA 동치) → 05d (정규화 일상비유) → 09 시뮬 | 3-4 시간 | 본 논문 모든 결과 검증 |
| **개발자 / 코드 우선** | 02 → 14 (PyTorch 구현) → 14 의 모든 함수 한글 주석 따라가기 | 2 시간 | 구현·재현 가능 |
| **이론·증명 좋아함** | 01 → 04 → 11 (Prop 1·2 증명 + 본 해체가 발견한 paper 표기 이슈) | 4 시간 | 수학적 완전성 |

### 기존 표 (chapter 위주)

| 관심 | 우선 챕터 |
|------|--------|
| 큰 그림만 | 01 (이 파일) → 02 → 03 → 07 (실증) |
| 방법론 | 04 → 05 (4 파일) → 11 (증명) |
| 신경망 / ML | 05a (PCA 등가성) → 05b (구조) → 05d (정규화) |
| 실증 / 응용 | 06 → 07 → 08 |
| Monte Carlo | 09 |
| 통찰 / 시사 | 13 |
| 실행 코드 | 14 |

---

## 한 가지 약속

- 수식은 모두 보여준다 (생략 X)
- 한 줄씩 풀어 설명한다 (의역 X)
- 처음 등장 용어는 그 자리에서 풀이한다
- 무배경 독자도 따라올 수 있게, 전공자도 새 통찰 얻게

다음 [02_abstract.md](02_abstract.md) 로 가서 제목과 Abstract 부터.

---

## 🆚 자매 paper — RPPCA 도 같이 보면 더 강력

본 deep dive 는 [RPPCA deep dive (Lettau-Pelger 2020)](../2026-05-17_lettau-pelger-rppca/00_README.md) 와 **같은 날짜·같은 주제** 의 자매 작업입니다.

| 본 논문 접근 | RPPCA 접근 |
|---------------|-------------|
| "IPCA 의 선형을 신경망으로" | "PCA 에 위험프리미엄 페널티 추가" |
| 비선형 매핑 자동 발견 | 약한 + 높은 SR 요인 검출 |

두 paper 가 **같은 한계 (PCA/IPCA)** 를 **다른 방향** 으로 풀어 학계의 거대한 빈 칸 두 개를 동시에 채움. 자세한 비교는 [13_insights.md §13.13b](13_insights.md#13_13b).

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. **본 논문이 IPCA (KPS 2019) 에 추가하는 핵심 변형은?**
2. **Autoencoder 가 자산가격에 자연스러운 이유는?**
3. **Conditional factor model 이 static 보다 좋은 이유는?**

### 답변

1. **IPCA 에 추가하는 핵심 변형**:
   - **선형 매핑 β(z) = z'Γ 를 신경망 매핑 β(z) = NN(z) 로** 일반화 (단 한 군데).
   - **나머지 모든 것은 그대로**:
     - f-network 는 모든 CA0~CA3 에서 **단일 선형층** ($L_f = 1$) — 요인의 portfolio 해석 보존.
     - $r = \beta'f + u$ 형태 (절편 없음) — no-arbitrage 자동 강제.
     - 같은 CRSP 데이터, 같은 94 특성, 같은 managed portfolio 사용.
   - → **점진적 일반화의 모범**. IPCA = CA0 (Prop 2 로 동치), CA1 부터 비선형 효과 발현.
2. **Autoencoder 가 자산가격에 자연스러운 이유**:
   - **(a) PCA 의 신경망 후예** — Proposition 1: 1층 선형 autoencoder = PCA. PCA 가 60 년간 자산가격 잠재요인 추출의 표준 (Connor-Korajczyk 1986, Bai-Ng 2002) 이라 autoencoder 는 그 자연스러운 후예.
   - **(b) Bottleneck = K 요인**: autoencoder 의 좁은 hidden layer 차원 K 가 잠재요인 수와 정확히 매핑됨.
   - **(c) 비선형 확장**: ReLU 활성화 + 다층으로 PCA 못 잡는 비선형 효과 (interaction, threshold, saturation) 자동 발견.
   - **(d) ML 도구 호환**: 신경망이라 LASSO, dropout, ensemble 등 ML 정규화 도구 그대로 적용 가능.

3. **Conditional factor model 이 static (Fama-French) 보다 좋은 이유**:
   - **β 가 시간에 따라 변함**: 회사의 size, 모멘텀, 변동성 등이 매월 바뀌면 위험 노출도도 같이 바뀜.
   - **Static 의 한계**: "애플 의 시장 노출도가 30 년 같다" 강제 → 90 년대 stable 시기 vs 닷컴 vs 금융위기를 같은 β 로 가정. 비현실적.
   - **Conditional 의 해결**: $\beta_{i,t-1} = \beta(z_{i,t-1})$ — 특성 $z$ 를 매월 업데이트하면 노출도도 자동 갱신.
   - **paper Table 1 결과**: FF (static) Total R² K=6 = **-6.1** vs IPCA (conditional) = **14.5**. 무려 20%p 차이. Conditional 효과가 결정적.
   - **본 논문의 추가 기여**: conditional **+ 비선형** — IPCA 보다 한 단계 더.
