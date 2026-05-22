# 9-A. 사고 확장 — 자문 질문 5개

---

## Q1. SAE 특징은 유일한가? 만약 아니라면 "진짜" 특징이 무엇인지 어떻게 알 수 있는가?

**왜 이 질문이 중요한가**: Monosemanticity의 가장 큰 미해결 문제다. 다른 초기화나 다른 $\lambda$에서 출발한 SAE가 전혀 다른 특징 집합을 찾는다면, 우리가 발견하는 "특징"은 모델의 진짜 내부 표현이 아니라 SAE 훈련의 부산물일 수 있다. 이 질문에 답하지 못하면 SAE 기반 해석가능성 전체가 모래 위의 집이 된다.

이 질문은 또한 인과성 주장에도 영향을 미친다 — 만약 특징이 유일하지 않다면, 절제(ablation) 결과는 특징 A를 끈 것이지 특징 B를 끈 것이 아님을 보장할 수 없다. 즉 인과 주장이 흔들린다.

**현재 연구 상태**: "Sparse Autoencoders Do Not Find Canonical Features" (ICLR 2025)가 이 방향의 비판을 제시한다. 하지만 아직 명확한 해답은 없다.

---

## Q2. MLP 레이어에 집중하는 것이 옳은가? Attention head의 QK 상호작용에도 슈퍼포지션이 있는가?

**왜 이 질문이 중요한가**: 트랜스포머의 두 핵심 구성요소는 MLP와 Attention이다. Monosemanticity는 MLP에만 집중했는데, Attention head의 내부 표현(Q/K/V 투영 공간)도 슈퍼포지션을 사용할 수 있다. 만약 그렇다면, Attention motif (APF 연구의 핵심)의 원인을 규명하려면 Attention-space SAE가 필요하다.

이 질문은 내 APF 연구와 직결된다 — "diagonal attention을 유발하는 입력 특징"을 찾으려면 QK 공간에서의 SAE가 필요할 수 있다. Monosemanticity가 열어 놓은 공간이다.

---

## Q3. 시계열 Transformer에서 SAE 특징은 자연어 모델의 특징과 어떻게 다른가?

**왜 이 질문이 중요한가**: Monosemanticity의 발견은 자연어 모델에서 나왔다 — DNA, 히브리어, HTTP 같은 인간 언어/기술 도메인 특징. 시계열 데이터에는 이런 자연어 범주가 없다. 대신 "계절성", "추세", "돌발 이벤트", "체제 전환" 같은 시간적 패턴이 특징 공간을 채울 것이다.

이 질문은 APF와 Grokking 두 연구 모두에 관련된다. 만약 시계열 SAE 특징이 자연어 SAE 특징과 질적으로 다르다면, Monosemanticity의 방법론을 그대로 이식할 수 없다 — 새로운 "시계열 해석가능성" 프레임워크가 필요할 수 있다.

---

## Q4. Grokking 전후에 SAE 특징은 어떻게 변하는가? 특히 "memorization → generalization" 전환이 특징 공간에서 어떻게 보이는가?

**왜 이 질문이 중요한가**: Nanda et al. (2023)이 modular arithmetic에서 grokking 후 Fourier 기저 특징이 나타남을 보였다. 하지만 이것은 SAE 없이 수동으로 찾은 결과다. SAE를 grokking 전후의 모델에 적용하면:
1. Memorization 단계: 훈련 데이터의 "개별 사례 특징"들이 과포화 상태
2. Grokking 이후: 더 희박하고 구조화된 특징들(Fourier 성분)로 전환
3. 이 전환이 SAE 특징 통계에서 어떻게 보이는가? 예를 들어 활성 특징 수(active features per input)가 grokking 후 감소하는가?

이 질문은 Grokking 논문의 핵심 기여가 될 수 있다.

---

## Q5. 해석 가능하지 않은 특징들이 더 중요한 계산을 담고 있지 않은가? 즉 SAE가 무엇을 놓치는가?

**왜 이 질문이 중요한가**: Monosemanticity는 "해석 가능한" 특징들에 집중한다. 하지만 모델의 성능에 기여하는 모든 특징이 인간에게 해석 가능한 것은 아닐 수 있다. 

더 구체적으로: SAE가 65% 분산을 설명한다면, 나머지 35%를 담당하는 계산이 있다. 이 35%가 단순 노이즈인가, 아니면 "해석 불가능하지만 기능적으로 중요한" 계산인가? 만약 후자라면, SAE 기반 해석가능성은 시스템의 일부만 보여주는 것이다.

이 질문은 APF 연구에서도 중요하다 — APF가 attention motif를 분석하는데, 만약 motif의 기능 중 일부가 "SAE 포착 불가능한 분산 연산"에서 나온다면 motif 분석의 completeness에 의문이 생긴다.
