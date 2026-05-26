# 01. 시작하기 전에 — 미리 알아둘 개념

> **🧒 한 줄 요약**: Paper introduction. Linear factor models 의 한계 → deep learning approach 필요성.


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

## 자기점검 (이 챕터)

### 핵심 3가지
1. **본 논문이 IPCA (KPS 2019) 에 추가하는 핵심 변형은?**
2. **Autoencoder 가 자산가격에 자연스러운 이유는?**
3. **Conditional factor model 이 static 보다 좋은 이유는?**

### 답변
1. β(z) 의 선형성을 신경망 (β-network) 으로 비선형 일반화. f-network 는 단일 선형층 유지 (portfolio 해석 위해). r = β'f 형태도 유지 (no-arbitrage 보존).
2. Autoencoder = PCA 의 신경망 후예 (Proposition 1). PCA 가 잠재요인 추출의 표준이라 autoencoder 는 그 비선형 일반화로 자연스럽게 fit.
3. β 가 시간에 따라 변하기 때문. 정적 모델은 30년 동안 같은 노출도 강제 — 회사 성장·위기·산업 변화 반영 못 함. Conditional 은 특성 z 로 매월 노출도 갱신.
