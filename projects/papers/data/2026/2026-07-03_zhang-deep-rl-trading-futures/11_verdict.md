# 11. 한 줄 판결

## 판결

**"Deep Hedging 이 완전시장 가정을 시장마찰 하로 끌어내렸다면, 이 논문은 signal-to-position mapping 을 discrete/continuous 정책으로 재정의해 TSMOM 계보의 hand-crafted rule 을 SGD 로 학습된 policy 로 대체한다 — 원거리 태그이지만 P1 ProTran-TFA 의 probabilistic forecast 출력을 volatility-scaled reward 로 연결해 trading policy 로 확장하는 substrate 로 직접 활용 가능."**

## 이유 (보충 3 줄)

1. **Tier 3 venue (JFDS)** + **rl-trading 원거리 0-count** 첫 커버 + **Zhang·Zohren·Roberts (DeepLOB 저자팀)** 자연 lineage 로 사용자 진로 (quant industry) 와 학술 (mech interp) 을 잇는 다리 potential 이 명확.
2. 방법론은 **직관적** (DQN/PG/A2C 3-종 + LSTM + vol-scaled reward) 이나 **정확 수치와 seed 통계·재현성은 취약** (본문 PDF 차단 + 저자 코드 미공개 + 2020+ 미검증) — 흡수 시 위 4 반박점을 자체 실험으로 채워야 함.
3. **직접 substrate 3 곳**: (i) P1 ProTran-TFA §4 quantile → policy 확장, (ii) AETHER §3 crypto RL baseline 이식, (iii) APF §4 non-attention baseline — 사용자 보유 자산 3 개 자연 연결 + **LSTM policy 를 mech interp 대상으로 삼는 novel 니치** (§B + rl-trading 교차) 개척 가능.
