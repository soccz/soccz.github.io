# 10b · Follow-up 논문 3편

---

## 선행 논문 — Rough Volatility (Gatheral et al., Quantitative Finance 2018)

**어떤 논문인가**: 주식 시장의 실현 변동성(realized volatility)이 Hurst 지수 $H \approx 0.1$인 fractional Brownian motion을 따른다는 실증 발견. "Rough volatility"라는 개념을 확립한 논문.

**본 논문과의 관계**: 이 논문(Neural SDE GAN)의 SDE 생성자는 표준 브라운 운동 $W_t$ ($H = 0.5$)를 사용한다. 그러나 실제 금융 변동성은 $H < 0.5$인 "거친(rough)" 경로를 따른다. Rough volatility 논문은 Neural SDE GAN의 한계(브라운 운동 가정)를 정량화하는 이론적 기준을 제공한다. "왜 표준 SDE가 금융에서 불충분한가?"를 묻는 독자에게 이 논문이 답이다.

**무엇을 얻을 수 있나**: Paper 4에서 economic time $\tau(t)$가 변동성 시계열의 rough 성질을 부분적으로 흡수할 수 있는지 — 즉, "시간 변환으로 rough 경로를 smooth하게 변환할 수 있는가?" — 를 논증하는 데 이 논문이 반례 또는 근거로 사용된다.

---

## 경쟁 논문 — Diffusion-TS (Tim Xiu, Emile Mathieu 등 2024 계열)

**어떤 논문인가**: Score-based diffusion model을 시계열 생성에 적용한 일련의 논문들. 대표적으로 TimeGrad (Rasul et al. 2021), CSDI (Tashiro et al. NeurIPS 2021), Diffusion-TS (2023) 등. 역방향 SDE로 노이즈를 제거해 경로를 생성.

**본 논문과의 관계**: 직접 경쟁. 둘 다 SDE 언어를 쓰지만 방향이 반대다: Neural SDE GAN은 순방향(노이즈 → 경로), Diffusion 기반은 역방향(경로 → 노이즈 → 경로). 최신 벤치마크에서 Diffusion 계열이 일부 지표에서 앞서는 결과가 나왔다.

**무엇을 얻을 수 있나**: 두 접근의 trade-off를 이해하면 Paper 4의 economic time attention이 어느 생성 프레임워크에 더 자연스럽게 통합되는지를 결정할 수 있다. GAN 기반은 빠른 생성, Diffusion 기반은 높은 품질(단 느림)이 일반적 특성이다.

---

## 후속 논문 — Conditional Neural SDE 계열 (2022–2023)

**어떤 논문인가**: Kidger 이후 그룹들이 Neural SDE를 조건부 생성(conditional generation)으로 확장한 일련의 작업. 대표적으로 "Score-Based SDEs for Conditional Generation" 계열. 조건 변수(예: 시장 레짐, 이자율 수준)를 생성자에 주입해 시나리오 특정 경로를 생성.

**본 논문과의 관계**: 이 논문의 직접 후손. 생성자 $dY = \mu_\theta(t, Y, c)\,dt + \sigma_\theta(t, Y, c)\,dW$에서 $c$가 조건 변수. 판별자도 동일하게 조건화.

**무엇을 얻을 수 있나**: Paper 4에서 economic time $\tau(t)$가 사실상 "시장 상태 조건 변수"의 역할을 하므로, Conditional Neural SDE의 $c$ 주입 방식(concat vs. FiLM vs. cross-attention)이 Paper 4의 conditioning space 선택 논의에 직접 참조된다. 이 논문들이 조건화 방식에 따른 성능 차이를 실험하면 Paper 1("When Multiplicative Conditioning Fails")의 논증을 SDE 영역에서 재검증하는 기회가 된다.
