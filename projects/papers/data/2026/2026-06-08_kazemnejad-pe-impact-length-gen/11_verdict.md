# 11 · 한 줄 판결

**"명시적 PE 5종을 동렬로 비교한 뒤 NoPE 가 이긴다는 폭로형 결과는, APF 의 PE→motif sweep 에 있어 'PE 부재 = baseline 이 아니라 강력한 비교군' 이라는 6번째 PE 칸을 강제로 만들어주는 reference."**

## 보충 (왜 이 판결인가)

본 논문은 (1) 동일 백본 / 동일 데이터 / 동일 optimizer 하에서 PE 5 종 + NoPE 의 통제 비교 protocol 을 정립하고, (2) NoPE 가 reasoning task length-gen 에서 우위임을 보이고, (3) NoPE attention 이 T5-rel 와 가장 닮음을 KL 로 측정함으로써 — NoPE 를 "단순 ablation" 에서 "PE 패러다임 자체의 회의" 로 격상시켰다. APF 가 PE × motif sweep 을 주장하려면 이제 NoPE 칸을 빠뜨릴 수 없다. Grokking 의 경우에도 NoPE 가 phase transition timing 에 어떤 영향을 주는지가 새 실험 dimension 으로 열린다. 본 환경의 본문 미확보로 절대 수치를 단정하지 못하지만, 저자 공식 GitHub README / 코드 / wandb config 의 verbatim 증거만으로도 본 판결을 내릴 근거는 충분하다.
