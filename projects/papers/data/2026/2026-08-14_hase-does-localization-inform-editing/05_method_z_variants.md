# 4. 방법론 해부 (Z) — 편집 문제 변종 5종과 구현 디테일

> **배경 사다리**: 앞 절들이 "무엇을 어떻게 쟀나"였다면, 여기는 **"질문 자체를 어떻게 다시 설계했나"** 다. 필요한 개념은 하나 — 두 측정이 서로 다른 조건에서 이뤄지면 무관해 보일 수 있으므로, **조건을 하나씩 맞춰 가며 재측정**해야 공정한 판정이 된다는 것.

---

## 4.22 이 부분이 왜 필요한가

Claim 1의 결론("무관하다")에 대해 정직한 연구자라면 스스로 이렇게 물어야 한다. *"내가 두 측정을 불공정하게 비교한 건 아닌가?"*

Causal Tracing과 표준 편집(Error Injection)은 두 축에서 어긋나 있다.

| 축 | Causal Tracing | Error Injection |
|---|---|---|
| **입력** | 잡음 섞인 주어 $s_{noise}$ | 깨끗한 주어 $s$ |
| **목표 출력** | 원래 정답 $o_{true}$ 회복 | 새 거짓 답 $o_{false}$ 주입 |

§5.1의 변종 설계는 이 두 축을 하나씩, 그리고 마지막엔 둘 다 맞추는 **체계적 격자 탐색**이다.

## 4.23 다섯 문제의 목적함수 (§5.1 verbatim 기반)

| 변종 | 목적함수 | 입력 | 목표 |
|---|---|---|---|
| **Error Injection** | $\max\; p_\theta(o_{false}\mid s,r)$ | 깨끗 | 거짓답 |
| **Tracing Reversal** | $\max\; p_\theta(o_{noise}\mid s,r)$ | 깨끗 | **잡음 입력이 뱉던 답** |
| **Fact Erasure** | $\min\; p_\theta(o_{true}\mid s,r)$ | 깨끗 | **정답 (제거)** |
| **Fact Amplification** | $\max\; p_\theta(o_{true}\mid s,r)$ | 깨끗 | **정답 (강화)** |
| **Fact Forcing** | $\max\; p_\theta(o_{true}\mid s_{noise},r)$ | **잡음** | **정답** |

> **① 기호 뜻**: $o_{noise}$는 주어에 잡음을 넣었을 때 모델이 실제로 뱉는 (대개 틀린) 답. 나머지 기호는 §4.6과 동일.
>
> **② 일상 비유**: 진단은 "환자가 뛸 때" 했는데 치료는 "누워서" 했다면 진단이 안 맞아 보인다. Tracing Reversal은 *목표*를 진단 쪽에 맞춘 것("잡음 상태에서 나오던 그 오답을 다시 만들어라"), Fact Erasure/Amplification은 *대상 사실*을 진단 쪽에 맞춘 것("남의 사실 말고 그 사실 자체를 건드려라"), **Fact Forcing은 자세까지 똑같이 맞춘 것**("뛰는 상태 그대로 치료하라")이다.
>
> **③ 왜 이 형태인가**: Fact Forcing이 결정적인 이유는, 이 조건에서 편집기와 Causal Tracing이 **문자 그대로 동일한 입력·동일한 목표 확률**을 다루기 때문이다. 여기서도 관계가 없다면 "조건 불일치" 변명이 남지 않는다.
> Fact Erasure가 필요한 이유는 또 다르다 — Error Injection은 **모델에 없던 정보를 새로 만들어 넣는** 일이라 "저장 위치"와 무관할 수도 있다는 반박이 가능하다. 반면 Erasure는 **이미 저장된 것을 지우는** 일이므로, 저장 위치가 중요하다면 여기서 가장 뚜렷해야 한다. 실제로는 아니었다(Table 3의 Fact Erasure 행: ROME diff = 0, $p=0.555$ — **통계적으로 유의하지도 않다**).
>
> **④ 조심할 점**: Fact Forcing에서 상관이 올라간 것(추가 3%)을 "국소화가 옳았던 증거"로 읽으면 안 된다. 두 측정이 **같은 잡음 실현을 공유**하므로, 잡음이 우연히 세게 들어간 사례에서 tracing effect와 편집 난이도가 **함께** 움직였을 수 있다. 즉 공통 원인에 의한 상관 가능성이 남는다.

## 4.24 편집 방법 4종 (§5.2)

원문 verbatim:
- *"ROME. The edit method from Sec. 4, ROME edits a single MLP layer's down-projection weight."*
- *"MEMIT. Though designed to edit multiple facts at once, when editing a single fact this method differs from ROME only by spreading out its update over several layers"*
- **Constrained Finetuning (window size 1)** / **(window size 5)** — Adam 기반 최적화에 $\ell_\infty$-norm 제약을 건 미세조정.

**설계 의도**: 방법을 4개로 늘린 것은 "ROME이라는 특정 편집기의 특성 때문 아니냐"는 반박을 막기 위해서다. 그리고 결과적으로 **의미 있는 비대칭**이 드러났다 — Fact Forcing에서 관계가 나타난 것은 **finetuning 계열(FT diff .027/.032)** 이지 ROME(.003)이 아니었다. Causal Tracing과 한 논문에서 태어난 ROME이 오히려 tracing effect와 가장 무관하다는 것은 아이러니이자, 원 논문 서사에 대한 가장 날카로운 반증이다.

**1층 vs 5층 대비**: FT(1 layer) ↔ FT(5 layers), ROME(1 layer) ↔ MEMIT(5 layers)로 **개입 폭**을 짝지어 놓은 것도 설계상 배려다. "한 층만 건드려서 안 보이는 것"이라는 반박을 차단한다.

## 4.25 구현 디테일 (§4.2, §5.2, Appendix A)

| 항목 | 값 | 출처 |
|---|---|---|
| 주 모델 | **GPT-J (6B)** | §4.2 |
| 보조 모델 | **GPT2-XL (48층)** | §5.2 |
| 주 데이터 | **CounterFact** | §4.2 |
| 보조 데이터 | **ZSRE** | §5.2 |
| 표본 크기 (주) | **$n=652$** (GPT-J가 맞히는 사실만) | §4.2 |
| 표본 크기 (Fact Erasure) | **$n=489$** — 원문 verbatim *"In this condition, we have n=489 points."* | §5 |
| 잡음 | 가우시안 $\sigma=0.094$, 주어 토큰 임베딩에 가산 | §3.2 |
| tracing window | 기본 **5** (Figure 2 시각화만 10) | §3.2, §4 |
| 편집 층 스윕 | $\{1,5,9,13,17,21,25,28\}$ (+ 층 6) | §4.1 |
| 예시 확률 | $p_\theta(o_{true}\mid s,r)=.923$, $p_\theta(o_{true}\mid s_{noise},r)=.001$ | Figure 2 캡션 |
| 코드 | github.com/google/belief-localization | 초록 |
| 부록 | A: Experiment Details / B: Additional Results / C: Robustness Experiments | 목차 |

**$n=489$가 왜 다른가**: Fact Erasure는 "이미 저장된 정답을 지운다"는 조건이므로 대상 사실의 자격 기준이 달라진다(정답 확률이 충분히 높아야 지울 것이 있다). 표본이 652 → 489로 줄어든 것은 그 필터 때문으로 읽히며, 이 조건에서만 표본이 다르다는 점은 표 간 비교 시 **주의해야 할 비대칭**이다.

## 4.26 다른 접근이었다면

- **변종을 안 만들고 Error Injection만 보고했다면**: 리뷰어가 "조건 불일치" 반박을 던졌을 것이고, 논문의 결론은 훨씬 약해졌을 것이다. 변종 설계가 이 논문을 Spotlight로 만든 요소다.
- **편집기 대신 활성 조향(activation steering)을 썼다면**: 가중치가 아니라 forward pass의 표현을 직접 밀어 주는 개입이다. Causal Tracing이 재는 것도 표현이므로 **입도가 정렬**되어 상관이 훨씬 강하게 나왔을 가능성이 있다. 이 논문이 다루지 않은, 그리고 후속 연구가 파고들 여지가 가장 큰 빈칸이다.
- **여러 사실을 동시에 편집했다면**: MEMIT의 본래 용도. 단일 사실 편집으로 통일한 것은 비교 공정성을 위해서지만, "분산 저장된 지식은 분산 편집해야 한다"는 가설은 미검증으로 남는다.

## 4.27 이 절의 핵심 한 문장

> **저자들은 "조건이 안 맞아서 상관이 없는 것"이라는 모든 탈출로를 다섯 개의 문제 변종과 네 개의 편집기로 하나씩 막았고, 가장 정렬된 조건(Fact Forcing)에서조차 얻은 것은 3%였다.**
