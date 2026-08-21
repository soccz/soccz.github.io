# 3. 핵심 Claim 해체 (b) — "혼합분포가 정규화 흐름을 파레토 지배한다"

> **배경 사다리**: ① **정규화 흐름(normalizing flow)** 은 "간단한 분포(예: 표준정규)에서 뽑은 값을 가역 함수로 주물러 복잡한 분포를 만드는" 기법이다. 함수가 가역이면 밀도가 변수변환 공식으로 계산된다. ② **혼합분포(mixture)** 는 여러 개의 단순한 봉우리를 가중합한 것이다. ③ **보편 근사(universal approximation)** 는 "성분을 충분히 많이 쓰면 어떤 목표 분포든 원하는 정밀도로 흉내 낼 수 있다"는 성질이다. 이 절의 논쟁은 "두 도구가 같은 보편 근사 성질을 가진다면, 부수 기능이 더 많은 쪽이 이긴다"는 형태다.

---

## Claim 4. 로그정규 혼합은 정규화 흐름과 동등한 표현력을 가지면서, 흐름이 잃는 닫힌형 기댓값과 해석적 샘플링을 지킨다

**주장 (한 문장).** 유연성에서 동률이고 부수 기능에서 앞서므로, 신경 TPP의 출력 분포로는 흐름이 아니라 혼합을 쓰는 것이 옳다.

**증거.**
- **표현력 동률**: §3.4에서 인용하는 **Theorem 1 (DasGupta 2008, Theorem 33.2)** — 원문 진술 요지: 연속 밀도 $p(x)$ 와 임의의 연속 밀도 $q(x)$, $\varepsilon>0$, 컴팩트 집합 $\mathcal{S}\subset\mathbb{R}$ 이 주어지면, 성분 수 $K\in\mathbb{N}$, 혼합계수 $\mathbf{w}\in\Delta^{K-1}$, 위치 $\boldsymbol{\mu}\in\mathbb{R}^K$, 척도 $\mathbf{s}\in\mathbb{R}^K_+$ 가 존재하여 혼합분포와의 상한거리(supremum distance)가 $\varepsilon$ 미만이 된다.
- **부수 기능 우위**: §3.2의 닫힌형 기댓값 $\mathbb{E}_p[\tau]=\sum_k w_k \exp(\mu_k + s_k^2/2)$ 와 3줄짜리 샘플링 절차($z\sim\text{Categorical}(\mathbf{w})$, $\varepsilon\sim\text{Normal}(0,1)$, $\tau=\exp(\mathbf{s}^\top z\cdot\varepsilon + \boldsymbol{\mu}^\top z)$).
- **흐름의 약점 진술**: §3.1에서 흐름 기반 모델에 대해 "sampling from $p(\tau)$ is also problematic and requires iterative root finding" 이고 기댓값은 "does not in general have a closed form" 이라고 명시한다.
- **표로 요약**: Table 1(§2)에서 Normalizing Flows 행은 closed-form $\mathbb{E}[\tau]$ 와 closed-form sampling 두 칸이 ✗, Mixture Distribution 행은 전부 ✓.

**숨은 전제.**
1. **"보편 근사 = 실전 표현력"**. Theorem 1은 성분 수 $K$ 에 대한 **존재 정리**다. 필요한 $K$ 가 얼마나 커지는지, 유한한 $K$ 에서의 근사 오차율이 어떤지는 말하지 않는다. 실제로 §5의 부록 **Table 3**("Performance of LogNormMix model for different numbers $K$ of mixture components.")은 $K$ 를 바꿔도 NLL이 거의 변하지 않음을 보여 주는데(예: Reddit 행 10.185~10.239, Yelp 행 13.024~13.169 범위 — 열-$K$ 대응은 렌더링에서 확정하지 못해 값 범위만 적는다), 이는 "$K$ 를 키워도 얻는 게 없다"는 뜻이기도 하고 **"이 데이터의 분포가 애초에 몇 개 봉우리로 충분할 만큼 단순하다"** 는 뜻이기도 하다. 후자라면 표현력 논쟁 자체가 이 실험에서는 결정되지 않는다.
2. **"흐름의 근사 성질과 혼합의 근사 성질이 같은 의미"**. 흐름은 변환의 **합성 깊이**로 표현력을 키우고 혼합은 **성분 수**로 키운다. 두 정리가 같은 종류의 컴팩트 집합 위 상한거리를 말한다고 해도, 고차원 조건부 밀도로 확장할 때의 파라미터 효율은 다르다. 본 논문의 대상이 **1차원 양수 확률변수 $\tau$** 라는 점이 혼합에 유리하게 작용한다 — 이 유리함은 논문의 결론을 1차원 밖으로 옮길 때 사라진다.
3. **"로그정규 성분 선택은 중립적"**. 성분을 로그정규로 고른 것은 $\tau>0$ 과 두꺼운 꼬리를 동시에 처리하려는 선택인데, 이는 **대기 시간이 로그 스케일에서 봉우리를 이룬다**는 도메인 가정이다. 사람 행동 로그(밤/낮 리듬)에는 잘 맞지만, 예컨대 정확히 주기적인 기계 신호에는 과한 유연성이고 하드한 주기성에는 부족한 표현이다.

**쉬운 말 풀이.** 복잡한 그림을 그리는 두 가지 붓이 있다. 하나(흐름)는 고무판을 늘였다 줄였다 하며 모양을 만들고, 다른 하나(혼합)는 종 모양 스탬프 여러 개를 겹쳐 찍는다. 수학적으로는 둘 다 "어떤 그림이든 그릴 수 있다". 그런데 스탬프 방식은 그려 놓은 그림의 **무게중심(평균)** 을 즉시 계산할 수 있고, 그 그림에서 **점 하나를 뽑는 것**도 즉시 된다. 고무판 방식은 둘 다 어렵다(뽑으려면 방정식을 반복해서 풀어야 한다). 그러니 같은 그림을 그릴 수 있다면 스탬프를 쓰라는 것이다.

---

## Claim 5. 실증적으로도 단순한 혼합이 최신 흐름과 대등하거나 낫고, 단봉 분포 기반 모델은 확실히 뒤진다

**주장 (한 문장).** 6개 실제 데이터셋과 5개 합성 데이터셋의 시간 예측 NLL에서 LogNormMix는 흐름 기반(DSFlow/SOSFlow)과 대등하거나 낫고, RMTPP(Gompertz)·단일 로그정규·지수 분포 기반 모델보다 뚜렷이 앞선다.

**증거.**
- §5.1 진술 요지: 단봉 분포(Gompertz/RMTPP, LogNormal)는 보편 근사 성질을 가진 유연한 모델들에게 "always dominated" 되며, LogNormMix와 DSFlow가 일관되게 최고 수준의 손실을 낸다. Figure 3 캡션(verbatim): "NLL loss for event time prediction without marks (left) and with marks (right). NLL of each model is standardized by subtracting the score of LogNormMix. Lower score is better. Despite its simplicity, LogNormMix consistently achieves excellent loss values."
- **Table 4**(Appendix F.1, "Time prediction test NLL on real-world data.") 일부 — LogNormMix: Reddit 10.19 ± 0.078 · LastFM −2.88 ± 0.147 · MOOC 6.03 ± 0.092 · Stack Overflow 14.44 ± 0.013 · Wikipedia 8.39 ± 0.079 · Yelp 13.02 ± 0.070. 비교: RMTPP Reddit 10.88 ± 0.293 · MOOC 10.65 ± 0.023, Exponential Stack Overflow 18.48 ± 3.257, FullyNN MOOC 6.83 ± 0.152, SOSFlow LastFM −2.56 ± 0.133.
- **Table 5**(Appendix F.1, 합성 데이터) — 각 과정의 참 모델 NLL이 함께 제시된다: Renewal 참값 0.254 vs LogNormMix 0.25 ± 0.010 vs RMTPP 1.01 ± 0.023, Hawkes2 참값 −0.043 vs LogNormMix 0.02 ± 0.049 vs RMTPP 0.69 ± 0.058.
- **Table 6**(Appendix F.2, 마크 포함) — LogNormMix Reddit time NLL 10.28 ± 0.066 / total NLL 12.40 ± 0.094 / mark accuracy 0.62 ± 0.014; MOOC time NLL 5.75 ± 0.040 / mark accuracy 0.45 ± 0.003. RMTPP MOOC time NLL 10.29 ± 0.209 / mark accuracy 0.41 ± 0.006.

**숨은 전제 — 그리고 이 논문에서 가장 약한 고리.**
1. **"NLL 차이는 곧 모델 우열"**. Table 4에서 LogNormMix(10.19 ± 0.078)와 DSFlow(10.20 ± 0.074), FullyNN(10.23 ± 0.072)의 Reddit 격차는 **각자의 표준편차보다 작다**. 즉 유연한 모델들 사이의 순위는 이 표로 결정되지 않는다. 논문이 실제로 입증한 것은 "유연한 출력 분포 > 단봉 출력 분포"이지 "혼합 > 흐름"이 아니다. §5.1의 서술("dominated")이 성립하는 대상은 단봉 베이스라인이다.
2. **"합성 데이터의 참값 근접 = 올바른 학습"**. Table 5에서 Hawkes1의 참값은 0.453인데 최고 모델도 0.52 ± 0.047 수준이다. 격차가 남는 이유(유한 표본? 이력 인코더의 한계? 최적화?)는 분해되지 않는다.
3. **"마크는 시간과 독립"**. §5.2의 손실은 $-\sum_i [\log p^*_\theta(\tau_i) + \log p^*_\theta(m_i)]$ 로 시간 항과 마크 항의 합이다. 이는 이력이 주어졌을 때 **다음 사건의 시각과 종류가 조건부 독립**이라는 인수분해다(원문의 손실 형태가 이를 함의한다). "3분 뒤에 오는 사건은 A 종류, 3시간 뒤에 오는 사건은 B 종류" 같은 시간-종류 결합 구조는 이 손실로 표현되지 않는다.

**쉬운 말 풀이.** 실험이 확실히 보여 주는 것은 "봉우리 하나짜리 분포를 쓰면 진다"는 것이다. 반면 "여러 봉우리 방식(혼합)이 고무판 방식(흐름)보다 낫다"는 부분은, 표의 숫자를 보면 두 방식의 차이가 실험을 반복할 때 생기는 흔들림보다 작다. 그러니 이 논문의 진짜 결론은 "혼합을 써라"가 아니라 **"단순하면서 유연한 혼합으로도 충분하니, 복잡한 것을 쓸 이유가 없다"** 쪽으로 읽는 것이 정확하다. 저자들도 Figure 3 캡션에서 "Despite its simplicity"라고 표현한다 — 우위가 아니라 **비용 대비 동률**이 이 결과의 핵심이다.
