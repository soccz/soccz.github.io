# 09 · 내 연구와의 연결

> 이 섹션은 `_profile.md`의 Paper 1–4 라인과 구체적으로 연결한다. 일반론("참고 가능하다")은 쓰지 않는다.

---

## Paper 4 — Continuous Economic Time Attention (ContiFormer의 ODE 시간변수 대체)

### 흡수할 기법 1: SDE의 시간-변환 동치

이 논문의 핵심 SDE

$$dY_t = \mu_\theta(t, Y_t)\,dt + \sigma_\theta(t, Y_t)\,dW_t$$

에서 시간 $t$를 단조 증가 함수 $\tau = \tau(t)$로 치환하면 (Clark 1973의 time-change theorem):

$$dY_{\tau} = \tilde{\mu}_\theta(\tau, Y_\tau)\,d\tau + \tilde{\sigma}_\theta(\tau, Y_\tau)\,d\tilde{W}_\tau$$

여기서 $\tilde{W}_\tau = W_{\tau^{-1}(t)}$는 새 시간 척도에서의 브라운 운동이다. 이 변환이 합법적(법칙 동치)인 조건은 $\tau'(t) > 0$, 즉 economic time이 단조 증가할 것.

**Paper 4 §3.2 적용**: ODE 시간변수를 $\tau(t) = \int_0^t v(s)\,ds$ (거래량 기반 누적 시간)으로 교체할 때, 이 변환이 경로 측도 수준에서 합법적임을 정당화하는 데 이 논문의 **Equation (2.1)–(2.3)** (SDE time-change equivalence)를 인용할 수 있다.

구체적 인용 문장 초안:

> "Following the time-change theorem (Clark 1973; Kidger et al. 2021, §2), replacing wall-clock time $t$ with economic time $\tau(t)$ in the SDE generator corresponds to a measure-equivalent transformation of the path space, preserving the Markov property under mild regularity conditions on $\tau'(t) > 0$."

---

### 흡수할 기법 2: CDE 판별자 구조 → Paper 4의 어텐션 판별자

Paper 4에서 economic time attention의 성능을 평가할 때, 어텐션 기반 모델이 생성하는 경로 분포를 평가하는 판별자가 필요하다면 Neural CDE 구조 $dZ = f(Z)\,dX$를 채용할 수 있다. 기존 TSTR 지표보다 이론적 근거가 명확하다.

구체적으로: Paper 4의 §5 (실험) 중 "생성된 금융 경로 품질 평가" 서브섹션에서, Neural CDE discriminator를 보조 평가 도구로 도입하고 이 논문(arXiv:2102.03657)을 "판별자 아키텍처의 이론적 근거"로 인용.

---

## Paper 1 — When Multiplicative Conditioning Fails

### 충돌/경쟁 지점: 확산 항의 "조건화" 해석

Paper 1의 핵심 주장은 "입력-공간 조건화(concat_a)가 특정 조건에서 실패한다"는 것이다. 이 논문의 SDE에서 확산 항 $\sigma_\theta(t, Y_t)$는 현재 잠재 상태 $Y_t$에 조건화된다 — 이것이 바로 "상태-공간 곱셈 조건화(state-space multiplicative conditioning)"의 한 형태다.

**충돌**: Paper 1이 "곱셈 조건화(multiplicative conditioning)"가 실패한다고 주장한다면, SDE의 $\sigma_\theta(t, Y) \cdot dW$도 같은 실패 모드를 갖는가? 정확히는 다르다 — SDE의 확산 조건화는 *랜덤성의 세기*를 상태에 따라 조절하는 것이고, Paper 1이 다루는 것은 *결정론적 특징*에 대한 조건화다. 그러나 둘 다 "상태에 곱해지는 계수"라는 형태를 공유하므로, 이 구분을 Paper 1 §2.3의 "조건화 실패 분류" 항에 각주로 명시해야 한다.

**수용 방향**: "SDE의 확산 조건화는 랜덤성 크기 조절이므로 Paper 1의 실패 모드와 다르다. 단, 확산 계수가 특정 상태에서 0으로 수렴(퇴화)하면 이는 곱셈 조건화 실패의 SDE 유사체다."

---

## Paper 2 — Representation Utility Gap

### 흡수할 기법: CDE 은닉 상태 $Z_T$의 "표현 유용성" 측정

Paper 2의 "Representation Utility Gap"은 서로 다른 조건화 방식이 만드는 표현(representation)이 하류 작업(downstream task)에서 얼마나 유용한지를 측정한다.

**직접 연결**: 이 논문의 판별자 Neural CDE가 경로를 $Z_T$로 압축한다. 이 $Z_T$가 다운스트림 예측(TSTR)에서 얼마나 유용한지가 Discriminative Score의 본질이다. Paper 2의 "representation utility" 개념과 이 논문의 "TSTR score"는 동일한 측정을 다른 이름으로 부른다는 것을 Paper 2 §1의 동기 부여 단락에서 명시적으로 연결할 수 있다.

인용 문장 초안:

> "The TSTR evaluation metric (Kidger et al. 2021) can be seen as a path-space analogue of representation utility: a representation is useful if a model trained on synthetic paths transfers to real paths. This motivates our utility gap measurement across conditioning strategies."

---

## Paper 3 — TTPA (Temporal Transformer with Path Attention)

### 반면교사: TTPA의 판별자가 CDE 기반이어야 하는 이유

만약 Paper 3이 경로 기반 평가 지표를 사용한다면, 이산 MHA(multi-head attention) 기반 판별자보다 Neural CDE 판별자가 이론적으로 더 적합하다. 이 논문이 "CDE 판별자 > LSTM 판별자"를 실험적으로 보여준 것을 근거로, Paper 3의 실험 섹션에서 평가 지표 선택을 정당화할 때 인용 가능.

---

## 종합: 인용 위치 지도

| 내 논문 | 섹션 | 인용 형태 |
|---------|------|-----------|
| Paper 4 | §3.2 (τ(t) 정의) | "time-change theorem으로부터 경로 측도 동치성 근거" |
| Paper 4 | §5 (실험) | "Neural CDE discriminator를 보조 평가 도구로 도입" |
| Paper 1 | §2.3 (조건화 분류) | "SDE 확산 조건화와 결정론적 조건화의 구분" 각주 |
| Paper 2 | §1 (동기) | "TSTR = 경로 공간 표현 유용성의 동치 개념" |

## 반면교사

이 논문이 명확히 못한 것: **"경로 생성 품질이 좋은 것"과 "예측에 유용한 것"이 같지 않다.** 좋은 통계적 생성자(낮은 discriminative score)가 미래 예측력이 좋은 표현을 만들지 않는다. 내 연구(Paper 4)는 *예측*에 목표가 있으므로, 이 논문의 생성 중심 프레임워크에서 예측 중심 프레임워크로 이동하는 근거를 Paper 4 §1에서 명확히 서술해야 한다.
