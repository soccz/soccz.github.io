# 11. 한 줄 판결

**TimesNet은 "주기로 접으면 2D가 된다"는 단순한 기하학적 직관을 5개 태스크에 걸쳐 구현한 backbone으로, APF의 CNN 프로브 설계와 Grokking의 inductive bias 실험에서 구체적 참조점으로 활용 가능하나, 공통 주기 가정과 non-stationary 취약성은 금융 도메인 적용 전 반드시 검증해야 할 한계다.**

---

이 논문을 내 연구 지도에서 꽂을 위치: **§D (TS Transformer / 2D Representations) + Grokking 트랙의 null hypothesis 참조점 + APF의 CNN 프로브 설계 참조점**.

APF 논문의 CNN 프로브 구조 개선에 Inception Block 설계 원칙을 인용하고, Grokking 실험에서 "FFT hardcode = grokking 없음" 조건의 구현체로 TimesNet을 사용한다. 금융 시계열(P1 ProTran-TFA)에는 non-stationary 검증을 선행하지 않으면 주기 탐지가 spurious하게 작동할 위험이 있으므로 직접 이식보다 선택적 차용을 권한다.
