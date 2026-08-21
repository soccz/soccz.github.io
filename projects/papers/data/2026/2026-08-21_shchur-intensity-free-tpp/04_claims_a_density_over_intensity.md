# 3. 핵심 Claim 해체 (a) — "강도를 버려도 잃는 것이 없다"

> **배경 사다리**: ① 확률변수의 분포는 밀도 $p(\tau)$ 로도, 누적분포 $F(\tau)=P(\text{대기시간} \le \tau)$ 로도, 생존함수 $S(\tau)=1-F(\tau)$ 로도 똑같이 기술할 수 있다 — 셋은 서로 변환된다. ② 강도(hazard)는 "지금까지 안 일어났다는 조건에서, 바로 지금 일어날 순간 위험률"이며 $\lambda(\tau)=p(\tau)/S(\tau)$ 로 정의된다. 즉 **강도는 밀도의 파생물**이지 독립된 원재료가 아니다. 이 사실이 이 절 전체의 지렛대다.

이 논문의 주장은 크게 두 덩어리다. 이 파일은 첫 번째 덩어리(강도 → 밀도로의 축 교체)를 다루고, 두 번째 덩어리(혼합 vs 흐름)는 [04_claims_b_mixture_vs_flows.md](04_claims_b_mixture_vs_flows.md)에서 다룬다.

---

## Claim 1. 강도함수 파라미터화는 유연성·효율·사용 편의 중 최소 하나를 반드시 포기하게 만든다

**주장 (한 문장).** 기존 신경 TPP는 강도 $\lambda^*(t)$ 를 파라미터화하기 때문에, "임의의 분포를 근사할 수 있는가 / 우도를 닫힌형으로 계산할 수 있는가 / 샘플링과 요약통계가 쉬운가" 세 축에서 적어도 하나를 잃는다.

**증거.**
- §1(Introduction)에서 세 축을 *flexibility · efficiency · ease of use* 로 명시하고, "Existing methods (Du et al. 2016; Mei & Eisner 2017; Omi et al. 2019) that are defined in terms of the conditional intensity function typically fall short in at least one of these categories" 라고 직접 진술한다.
- 근거의 구조는 §1의 3분할 논증이다: (i) 단순한 강도는 적분이 닫힌형이라 우도는 쉽지만 표현력이 제한된다, (ii) 정교한 강도는 표현력은 얻지만 로그가능도 계산에 몬테카를로 근사가 필요하다, (iii) FullyNN 계열은 "유효한 PDF를 정의하지 못하고, 샘플링이 비싸며, 기댓값을 닫힌형으로 계산할 수 없다".
- 이 주장을 표로 못 박은 것이 **Table 1**(§2 본문): "Comparison of neural temporal point process models that encode history with an RNN." 열은 *Closed-form likelihood / Flexible / Closed-form* $\mathbb{E}[\tau]$ */ Closed-form sampling*, 행은 Exponential intensity · Neural Hawkes · Fully NN · Normalizing Flows · Mixture Distribution 이다. Mixture Distribution 행만 네 칸이 모두 ✓ 다.

**숨은 전제.**
1. **"이력 인코더는 이미 해결된 문제"**. 세 축의 트레이드오프는 전부 *출력 분포* 쪽에서만 논의되고, 이력을 요약하는 RNN은 다섯 모델 모두에 공통으로 깔린 상수로 취급된다(Table 1 캡션이 "that encode history with an RNN" 이라고 범위를 못 박는다). 그래서 이 표는 **RNN이 이력을 충분히 요약한다는 가정 위에서만** 공정한 비교다.
2. **"닫힌형이 곧 좋음"**. 몬테카를로 근사가 실제로 성능을 얼마나 해치는지는 이 표에 없다. ✗ 표시는 *계산 성질*이지 *예측 성능*이 아니다. 실제로 §5의 실험에서 Neural Hawkes 계열의 문제로 지목되는 것은 정확도가 아니라 비용·편의다.
3. **"요약통계 = 기댓값"**. 저자들이 챙기는 요약통계는 $\mathbb{E}[\tau]$ 다. 그러나 대기 시간처럼 꼬리가 두꺼운 분포에서는 평균보다 **중앙값이나 분위수**가 실무적으로 더 유용한 경우가 많고, 로그정규 혼합은 중앙값·분위수가 닫힌형으로 나오지 않는다(성분이 여럿이면 CDF를 수치적으로 뒤집어야 한다). 표의 세 번째 열은 저자에게 유리한 요약통계를 고른 것이다.

**쉬운 말 풀이.** 다음 사건이 언제 올지를 말하는 방법은 두 가지다. (A) "지금 이 순간의 위험도"를 매 순간 말해 주고, 듣는 사람이 그걸 적분해서 확률로 바꾸게 한다. (B) "다음까지 걸리는 시간의 확률 그림"을 바로 준다. 지금까지는 모두 (A)를 썼는데, (A)로 말하면서 동시에 그림이 자유롭고 계산이 쉬우려면 무리가 온다. 이 논문은 "(B)로 바로 말하면 되잖아"라고 한다.

---

## Claim 2. 밀도를 직접 모델링해도 강도 기반 접근의 장점은 하나도 잃지 않는다

**주장 (한 문장).** 밀도와 CDF만 손에 쥐고 있으면 강도·누적강도는 언제든 복원되므로, 강도 파라미터화가 제공한다고 여겨지던 세 가지 이점(해석 가능성 · 제약 자동 충족 · 독립 과정 합성의 재사용성)은 밀도 기반 모델에서도 유지된다.

**증거.**
- §3.4(Discussion)가 이 반박을 정면으로 수행한다. 세 가지 논점은 각각 (i) **해석 가능성** — 최근의 RNN 기반 강도함수 역시 사람이 읽을 수 있는 형태가 아니므로 밀도 기반 모델과 다를 바 없다, (ii) **제약 충족** — 정규화 흐름과 혼합분포는 구조상 밀도가 자동으로 1로 적분되므로 별도의 제약이 필요 없다, (iii) **재사용성** — 독립 과정을 합칠 때 강도가 더해지는 것처럼, 밀도 기반 모델에서는 CDF를 통해 대응되는 합성 규칙을 쓸 수 있다, 이다.
- 복원 가능성의 근거는 Appendix A("Intensity function of flow and mixture models")다. 원문 진술: 두 모델 모두 조건부 CDF $F^*(\tau)$ 와 PDF $p^*(\tau)$ 가 즉시 얻어지므로 "we can easily compute the respective intensity functions" 이며, CDF의 정의로부터 조건부 강도 $\lambda^*(t)$ 와 누적강도 $\Lambda^*(\tau)$ 를 각 모델에 대해 유도한다.
- §3.4의 결론 문장(verbatim): "a mixture distribution is flexible, easy to sample from and has well-defined moments, which favorably compares it to other intensity-based deep learning models."

**숨은 전제.**
1. **"복원 가능 = 동등"**. 수학적으로 밀도에서 강도를 복원할 수 있다는 것과, 학습·추론 파이프라인에서 강도가 필요한 만큼 안정적으로 얻어진다는 것은 다르다. $\lambda^*=p^*/S^*$ 는 생존확률 $S^*$ 가 0에 가까워지는 꼬리 영역에서 수치적으로 폭발한다. 원문은 이 수치적 조건을 다루지 않는다.
2. **"해석 가능성은 이미 다 잃었다"**. (i)의 논법은 "경쟁자도 해석 불가이므로 우리도 괜찮다"는 형태의 상대 논증이다. 고전 Hawkes에서 $\alpha_{j,k}$ 가 "사건 $j$ 가 사건 $k$ 를 얼마나 흥분시키는가"라는 **구조 파라미터**였다는 사실은 이 논법에서 사라진다. 해석 가능성을 실제로 요구하는 응용(예: 규제 보고, 인과 구조 추정)에서는 이 교환이 공짜가 아니다.
3. **"합성은 CDF로 충분"**. 여러 독립 과정을 겹치는 조작이 강도 공간에서는 덧셈 한 번인데 CDF 공간에서는 생존함수의 곱 → 다시 밀도로의 미분을 거친다. 성분 수가 많아지면 표현이 복잡해진다.

**쉬운 말 풀이.** "위험도(강도)로 말하는 방식에는 나름의 장점이 있지 않냐"는 반문에, 저자들은 "그 장점들은 우리 방식에서도 그대로 계산해 낼 수 있다"고 답한다. 확률 그림만 있으면 위험도는 거기서 나눗셈 한 번으로 만들어지기 때문이다. 다만 "만들 수 있다"와 "만들었을 때 수치적으로 안전하다"는 다른 이야기이고, 논문은 앞의 것만 보였다.

---

## Claim 3. 이력·메타데이터·시퀀스 정체성을 한 벡터에 합치면 결측 보간과 비지도 시퀀스 임베딩이 부산물로 딸려 온다

**주장 (한 문장).** 분포 파라미터를 문맥 벡터 $\mathbf{c}_i = [\mathbf{h}_i \,\|\, \mathbf{y}_i \,\|\, \mathbf{e}_j]$ 의 아핀 함수로 두는 단일 설계에서, 추가 메타데이터 활용(§5.3) · 결측 구간 샘플링 보간(§5.4) · 시퀀스 임베딩 학습(§5.5)이 별도 기법 없이 파생된다.

**증거.**
- §3.3: 이력 임베딩 $\mathbf{h}_i \in \mathbb{R}^H$(RNN 출력), 메타데이터 벡터 $\mathbf{y}_i$, 시퀀스별 학습 가능한 임베딩 $\mathbf{e}_j$ 를 이어 붙여 $\mathbf{c}_i$ 를 만들고, "The parameters of the distribution $p^*(\tau_i)$ are obtained as an affine function of $\mathbf{c}_i$" 라고 명시한다(식 (3)).
- §5.3: Yelp 체크인 데이터에서 요일·저녁 시간대 메타데이터를 넣자 "additional conditional information boosts performance of the LogNormMix model, regardless of whether the history embedding is used" (Figure 5).
- §5.4: 결측 데이터 처리 세 전략을 비교하고, $p^*(\tau)$ 에서 **재파라미터화 샘플링**으로 결측을 채우는 전략만이 참 분포를 학습한다(Figure 4 캡션: "By sampling the missing values from $p^*(\tau)$ during training, LogNormMix learns the true underlying data distribution. Other imputation strategies overfit the partially observed sequence.").
- §5.5: 시퀀스 임베딩만으로 "the model learns to differentiate between sequences from different distributions in a completely unsupervised way" (Figure 6, 7).

**숨은 전제.**
1. **"샘플링이 싸면 보간도 싸다"**. §5.4가 성립하는 근본 이유는 혼합분포에서 재파라미터화 샘플링(정규난수 하나 → 지수 변환)이 미분 가능하고 값싸기 때문이다. 흐름 기반이나 강도 기반 모델이었다면 같은 절차의 비용이 완전히 달라진다. 즉 §5.4는 독립된 기여가 아니라 **Claim 4(닫힌형 샘플링)의 응용**이다.
2. **"시퀀스 임베딩은 자유 파라미터로 둬도 된다"**. $\mathbf{e}_j$ 는 시퀀스마다 하나씩 학습되는 자유 벡터다. 새로운 시퀀스가 들어오면 그 임베딩은 학습되어 있지 않으므로, 이 능력은 **transductive**(학습 시 본 시퀀스에 한정)하다. 원문은 새 시퀀스로의 일반화 절차를 §5.5에서 다루지 않는다.

**쉬운 말 풀이.** 모델의 출력 분포를 "지금까지의 이력 + 요일 같은 부가 정보 + 이 시퀀스가 누구인지"라는 하나의 메모지에서 만들도록 설계했더니, 그 메모지에 뭘 더 적느냐만 바꿔서 여러 응용이 자동으로 생겼다. 다만 "이 시퀀스가 누구인지" 칸은 학습 때 본 시퀀스만 채울 수 있다.
