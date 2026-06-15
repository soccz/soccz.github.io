# 02 · 3층 TL;DR

## 배경 사다리
이 절을 읽기 위해 미리 알아야 할 두 가지. ① **트랜스포머**는 "단어들 사이에 누구를 누가 보는지" 를 attention 이라는 가중치로 학습한 신경망이다. ② **회로(circuit)** 는 신경망 안에서 특정 기능을 수행하는 작은 부분 (몇 개의 attention head + 그들 사이의 연결) 을 가리키는 mech interp 용어다. 본 논문은 GPT-2 small (12 layer × 12 head 의 작은 LLM) 안에서 한 개의 정확한 회로를 손으로 그려낸다.

---

## 🧒 초등학생 수준 (수식 금지)

긴 문장이 하나 있다. *"가게에 갔다가, John 과 Mary 가 들어왔고, John 은 우유를 누구한테 줬을까?"* 사람이라면 당연히 "Mary" 라고 답한다. 두 번 등장한 이름 (John) 이 아니라 **한 번만 등장한 이름** (Mary) 이 정답이라는 게 이 퍼즐의 규칙이기 때문이다.

신기한 건, **GPT-2 small** 이라는 자그마한 인공지능도 이 퍼즐을 푼다. 그런데 어떻게 푸는지가 수수께끼였다. 이 인공지능 안에는 144 개의 "주목 장치 (attention head)" 가 있는데, 그 중 누가 무슨 일을 하는지 아무도 정확히는 몰랐다.

이 논문이 한 일: **그 144 개 중 26 개만 추려내고**, 각자가 어떤 작업을 맡는지 6 가지 직책으로 묶었다.
- 어떤 헤드는 **"이름 옮기기"** 담당 (앞에서 등장한 이름들을 끝쪽으로 옮겨오는 일꾼)
- 어떤 헤드는 **"중복 감지"** 담당 (John 이 두 번 나왔다는 사실을 표시)
- 어떤 헤드는 **"같은 이름 차단"** 담당 (두 번 나온 John 쪽 흐름을 꺼버림)
- 어떤 헤드는 **"바로 앞 토큰 기억"** 담당 (induction 회로의 부품)
- 이런 식으로 6 개 직책이 협업.

그리고 그 26 개만 켜놓고 나머지 118 개를 다 꺼도 — 모델은 거의 똑같이 "Mary" 라고 답한다. 반대로 그 26 개 중 한 개라도 빼면 답을 못 맞춘다. 이게 "**회로를 찾았다**" 는 증명이다.

발상의 전환: 신경망을 "뭔지 모르는 큰 덩어리" 가 아니라 **분해 가능한 부품 집합** 으로 보고, 그 부품을 끄고 켜는 실험만으로 회로를 그려낸다는 것.

---

## 🎓 학부생 수준

**문제**: GPT-2 small 같은 작은 LLM 도 자연어 작업을 수행한다. 그런데 weight matrix 수억 개 안에서 무엇이 그 작업을 담당하는지는 black box 다. Mech interp 는 그 black box 를 attention head 단위 회로로 reverse-engineer 하자고 제안한다 — 하지만 어떻게 회로를 정의하고 어떻게 그 회로가 진짜인지 검증할 것인가?

**핵심 아이디어**: 단일 자연어 작업 (**Indirect Object Identification**, IOI — "John gave a bottle to ___" 에서 ___ 자리에 indirect object 인 Mary 를 채우는 작업) 을 골라, GPT-2 small (12 × 12 = 144 attention head) 안에서 이 작업을 수행하는 **26 개 head 의 회로** 를 손으로 그려낸다. 그리고 그 회로가 진짜인지 **3 축 평가** 로 검증한다.

**방법 한 줄**: ① ABBA / BABA 라는 두 가지 명사 배치 패턴의 프롬프트 템플릿 15+15 개를 만들고 ② 각 attention head 의 출력을 다른 prompt 의 동일 위치 활성으로 갈아끼우는 **path patching** 으로 ③ "이 head 를 끄면 logit difference 가 얼마나 무너지나" 를 측정해 26 개로 추렸다.

**핵심 수식 (직관)**:
- **Logit difference**: $\text{LD} = \text{logit}(\text{IO}) - \text{logit}(\text{S})$ — IO 는 정답 이름 (Mary), S 는 두 번 나온 이름 (John). 모델이 정답을 선호하는 정도.
- **Faithfulness**: 회로 $C$ 만 켜고 나머지 ablate 했을 때 LD 가 전체 모델과 얼마나 닮았나.
- **Completeness**: 임의 부분집합 $K \subseteq C$ 를 동시에 회로에서·전체모델에서 꺼봤을 때 두 결과가 닮아야 함 (회로가 "충분" 함을 의미).
- **Minimality**: 회로의 어떤 head 하나라도 빼면 성능이 크게 떨어져야 함.

**결과**: 26 개 head 가 ① name mover 11, ② negative name mover 2, ③ S-inhibition 4, ④ induction 4, ⑤ duplicate token 3, ⑥ previous token 2 의 6 클래스 (코드 기준; 논문 표 차원에서는 7 클래스로 backup name mover 를 분리해 자주 인용됨) 로 분해됨. 회로 외부는 거의 기여 없음. 단, 회로는 **adversarial prompt** 에는 깨지며 (저자 본인 `advex.py` 로 보고) 이 fragility 자체가 후속 연구 화두가 됨.

---

## 🔬 전문가 수준

**Contributions** (논문이 main 으로 내세우는 것):

1. **Largest end-to-end natural-behavior circuit in a small LM**. modular addition (Nanda 2023) 같은 toy 가 아니라 GPT-2 small 의 자연어 작업에서 회로를 reverse-engineer. 회로 = 26 attention heads (코드 CIRCUIT dict 기준) grouped into functional classes, 각 클래스가 token position 별로 RELEVANT_TOKENS 매핑을 가진다.

2. **Path patching as the discovery primitive**. 단순 activation patching 이 아니라 specific **sender → receiver path** 를 patching 해 인과 의존성을 추적. 이는 후속 ACDC (Conmy 2023) 의 자동 edge ablation 의 manual prototype.

3. **Three-axis circuit validity criteria**: ① Faithfulness $F(C)$, ② Completeness via $|F(C\setminus K) - F(M\setminus K)|$ 모든 $K \subseteq C$ 에 대해, ③ Minimality via 단일 head drop 의 성능 영향. 이 3 축은 후속 회로 논문 (SFC, ACDC, HyperDAS) 의 evaluation protocol 이 되었다.

4. **Compositional structure**: 단순 부품 모음이 아니라 **다층 정보 흐름** — Previous Token (layer 2,4) → Induction (layer 5,6) → S-Inhibition (layer 7,8) → Name Movers (layer 9-11) — 의 의존 그래프. 이는 "회로 = 계층적 정보 처리 파이프라인" 이라는 mech interp 의 정형화에 기여.

**방어 가능한 주장 / 이론적 기여**:
- 회로 정의의 **운영적 (operational) 기준** 제시: 단순 "attention pattern 이 의미 있어 보임" 이 아니라 ablation-기반 인과 검증.
- 자연어 LLM 의 attention head 가 **재사용 가능한 기능 단위** 임의 증거. Induction heads (Olsson 2022) 가 IOI 회로의 부품으로 재발견됨 — head specialization 의 합성 가능성.

**한계** (저자 또는 후속 연구가 지적):
- GPT-2 small (124M) 의 단일 작업. Scale·task generality 미증명.
- adversarial prompt 에 fragility (`advex.py` 의 존재 자체가 이를 시사).
- **mean ablation** vs **zero ablation** vs **resample ablation** 선택에 따라 결론이 흔들릴 가능성 (ACDC 가 후속에서 다룸).
- "26 vs 28 head", "6 vs 7 class" 같은 표기 불일치 — 본 환경에서 PDF 표 확인 불가로 단정 불가.
