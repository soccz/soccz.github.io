# 10b — 사고 확장: 후속 논문 3편

---

## 선행 논문 — Lyle et al. (2024): "Normalization and Effective Learning Rates in RL"

**식별자**: arXiv:2407.01800 (NeurIPS 2024)  
**저자**: Clare Lyle, Zeyu Zheng, Khimya Khetarpal, James Martens, Hado van Hasselt, Razvan Pascanu, Will Dabney

**어떤 논문인가?**  
이 논문(2507.20057)의 직접적 선행 작업이다. LayerNorm이 있는 네트워크에서 ELR = $\eta / \|\theta\|$를 수학적으로 정의하고, 이 ELR이 훈련 중 자동으로 붕괴한다는 것을 이론적으로 보인다. 해결책으로 NaP(Normalize-and-Project)를 제안해 ELR을 일정하게 유지.

**본 논문과 어떤 관계인가?**  
기반이 되는 이론 전체가 이 논문에서 온다. ELR 정의, 스케일-불변 조건, LayerNorm 삽입 방식, NaP 알고리즘 모두 여기서 처음 제시됐다. 2507.20057은 이 토대 위에 "ELR을 일정하게 유지"에서 "ELR을 주기적으로 재가열"로 한 단계 전진하고, grokking 연결을 추가한다.

**무엇을 얻을 수 있는가?**  
ELR 이론의 수학적 기반을 완전히 이해하려면 이 논문을 먼저 읽어야 한다. 특히 "스케일-불변 레이어에서 그래디언트가 파라미터에 수직임"에 대한 Euler 동차 함수 정리 기반 증명, NaP의 Adam 호환성 분석, RL 소성 실험의 상세 결과를 제공한다. 2507.20057은 기반 논문으로 arXiv:2407.01800을 전제하므로 먼저 읽는 것을 권장.

---

## 경쟁 논문 — Nanda et al. (2023): "Progress Measures for Grokking"

**식별자**: arXiv:2301.05217 (ICLR 2023)  
**저자**: Neel Nanda, Lawrence Chan, Tom Lieberum, Jess Smith, Jacob Steinhardt

**어떤 논문인가?**  
[2026-04-27에 이미 해체 완료] Grokking을 메커니즘 해석 가능성 관점에서 분석. 훈련 중 내부 표현(restricted weight norm, excluded loss 등)의 진행 측도를 정의하고, 모듈러 산수에서 푸리에 회로가 형성되는 과정을 추적한다.

**본 논문과 어떤 관계인가?**  
Nanda 2023은 "grokking 후 무엇이 생기는가(내부 표현)"를 보고, Lyle 2025는 "왜 grokking이 늦게 일어나는가(ELR 역학)"를 본다. 둘은 서로 다른 관점에서 같은 현상을 설명한다 — 상호보완적이면서, 한편으로는 경쟁적이다. Nanda의 "restricted weight norm" 진행 측도가 Lyle의 "ELR = 1/노름"과 역수 관계임을 발견하면 두 프레임워크가 동치임을 보일 수 있다.

**무엇을 얻을 수 있는가?**  
Grokking 실험을 설계할 때, Nanda의 진행 측도를 로깅하는 동시에 Lyle의 ELR을 로깅하면 두 관점을 하나의 실험에서 통합할 수 있다. 내 Grokking TS 논문에서 "훈련 동학 분석" 절에 두 측도를 모두 포함해 선행 문헌을 포괄적으로 커버할 수 있다.

---

## 후속 논문 — Lyle et al. (2025): "The State of Plasticity in 2025" (Survey)

**URL**: https://clarelyle.com/posts/2025-09-06-plasticity-survey.html (블로그 버전)  
**연도**: 2025년 9월 (논문 전문 접근 미확인)

**어떤 논문인가?**  
Clare Lyle의 2025년 9월 블로그 포스트 "The state of plasticity in 2025"는 신경망 소성 연구의 현황을 정리한 서베이 성격의 글이다. 소성 상실의 원인들(ELR 붕괴, dead neurons, rank collapse, gradient interference)과 해결책들을 망라한다.

**본 논문과 어떤 관계인가?**  
2507.20057의 결과를 확장하고 소성 연구 전체를 조망하는 상위 개념 문서다. 2507.20057이 "ELR re-warming"이라는 한 가지 해결책에 집중했다면, 이 서베이는 다른 해결책들과의 관계를 정리한다.

**무엇을 얻을 수 있는가?**  
소성 상실 문제의 전체 지도를 얻을 수 있다. 내 Grokking TS 논문에서 소성 관련 내용을 쓸 때 이 서베이를 참조하면 관련 문헌을 체계적으로 커버할 수 있다. 특히 "내 비정상 시계열 설정에서 ELR 붕괴 이외에 어떤 소성 문제가 있을 수 있는가"를 진단하는 데 유용.
