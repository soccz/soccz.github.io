# 10. 한 줄 판결

> **SAE(희소 오토인코더)를 "중첩 해소 → 단의미 특징 사전 → 인과 개입"의 한 파이프라인으로 처음 실증한 독립 계열의 원전.** 내 "TS Transformer 기계적 해석" 피벗의 특징-사전 방법론 앵커이자, APF 의 attention motif 를 "특징(feature)"이 아니라 "패턴(pattern)"으로 봐야 하는 이유를 되비추는 대조군이다. 다만 재구성 손실(perplexity 25→40)·MLP 학습 실패·ground-truth 부재라는 세 구멍을 그대로 물려받는다.

**보충 (왜 이 자리에 핀을 꽂나):**
- **방법론 앵커**로: 08_lineage 의 사슬(Elhage → 본 논문/Bricken → Gao TopK → Mishra Chronos-SAE)에서 "방법이 실전 파이프라인이 되는 변곡점". 내 TS-SAE 실험의 표준 인용 사슬 출발점.
- **대조군**으로: 09_my_research 의 "motif(패턴) vs feature(방향)" 좌표계 경쟁을 선명하게 세워주는 상대. 특히 §3.2 의 "위치 패턴 사각지대"가 APF 의 존재 이유를 역으로 정당화한다.
- **핀 위치**: Grokking-in-TS 의 "circuit analysis" 축과 APF 의 "causal intervention" 단계, 두 곳에 동시에 꽂는다.
- **다음 행동**: 10_extensions_c 아이디어 1(TS-SAE 특징이 주기/추세/regime 에 정렬되는가)을 보유 합성 벤치마크로 먼저 돌려, 방법 이식 가능성부터 저비용으로 확인한다.
