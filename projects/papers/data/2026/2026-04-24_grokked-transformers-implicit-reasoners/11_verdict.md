# 11 — 한 줄 판결
> **🧒 한 줄 요약**: 한 줄 판결 — *Grokking 의 practical 가치 입증* paper. APF / Grokking manuscript 의 *baseline reference*.


## 판결

> **암묵적 추론은 Grokking 없이는 불가능하고, Grokking은 두 회로의 weight decay 심판 결과다 — 단 Composition의 OOD 실패는 트랜스포머의 비순환성이라는 구조적 천장이며, 이 논문은 사용자의 Grokking track에 "왜 grokking인가"의 메커니즘 근거와 "어떻게 실험할 것인가"의 분석 도구함을 모두 제공한다.**

## 보충 (판결의 이유)

이 논문이 내 연구 지도의 어디에 꽂히는가:

- **핵심 위치**: Grokking track (§B) 의 Related Work + Methodology 템플릿.
- **두 회로 경쟁 프레임** ($\mathcal{C}_\text{mem}$ vs $\mathcal{C}_\text{gen}$)과 **Logit Lens·Causal Tracing 방법론**은 "Grokking in Time Series Transformers" 논문의 §2(이론적 배경)와 §3(방법론)에 직접 이식 가능하다.
- **OOD 실패 발견**은 TS 예측에서의 grokking 연구가 단순 성능 향상이 아닌 **아키텍처 한계 탐색**으로 확장될 수 있음을 시사 — EOA(§A)와의 교차점이 열린다.
- **한계**: 합성 KG에 한정된 실험. 실제 TS 데이터 적용은 이 논문의 미검증 영역이며, 그것이 Grokking track의 기회다.

**요약 한 줄**: 이 논문은 Grokking track의 이론적 뼈대고, 실험 설계 도구함이다 — 읽지 않고는 트랙을 시작할 수 없다.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **"발판 vs 반박" 의 의미?**
2. **3 contribution dominance?**
3. ***unique* 특징?**

### 답변

1. paper 의 *§-references* + 본 deep dive 의 cross-reference 기반. 다른 챕터 (12-18) 의 정확 수치 + lineage 와 결합.

2. *Wang 2024 의 핵심 mechanism* (Composition + Comparison + grokking + parametric memory) 의 통합 관점.

3. APF / Grokking 트랙의 *direct baseline* — manuscript §1-§6 + Appendix 의 *모든 explicit reference position*.
