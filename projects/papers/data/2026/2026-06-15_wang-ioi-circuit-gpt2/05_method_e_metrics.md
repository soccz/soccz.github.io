# 05e · 방법론: 3-축 평가 (Faithfulness · Completeness · Minimality)

## 배경 사다리
이 절은 본 논문의 **검증 프레임워크** — 회로 $C$ 가 "진짜 회로인가" 를 반증 가능한 절차로 묻는 3-축 메트릭. ① **회로 $C$** = 26 head 의 집합, ② **전체 모델 $M$** = 144 head, ③ **ablate** = 그 head 의 출력을 mean/zero/resample 로 대체해 작동을 무력화. 세 개념 위에 3 축이 정의된다.

---

## 1. Faithfulness — 회로가 충분한가

### 1.1 정의
$$F(C) \;=\; \mathbb{E}_{p \sim \mathcal{D}}\!\left[ \text{LD}\!\left( M_{\text{only}(C)}(p) \right) \right]$$

- **기호 뜻**: $M_{\text{only}(C)}$ = 회로 $C$ 의 head 만 정상 작동, 나머지 144 − 26 = 118 head 는 mean ablate 한 forward. $\mathcal{D}$ = IOI 데이터셋 분포. $\mathbb{E}$ = 평균.
- **일상 비유**: "26 명만 일 시키고 나머지 118 명을 잠재웠을 때, 평균적으로 정답 점수가 얼마나 나오나."
- **왜 이 형태**: 단일 prompt 가 아니라 분포 전체의 평균을 본다 — outlier prompt 의 영향을 줄임.
- **조심할 점**: 비교 대상이 "원 모델 $F(M)$" 이 되어야 함. $F(C) / F(M)$ 비율이 흔히 보고됨. 비율 95%+ 면 faithful, 80% 이하면 회로 외부 기여가 큼.

코드 `completeness.py` 의 `circuit_eval(model, nodes)` 가 이 정확한 절차를 수행. `nodes` 가 비어 있을 때 (= no ablation within circuit) 의 결과가 $F(C)$.

본 환경에서 정확 수치 미확인. 정황 (후속 연구가 IOI 회로를 ground truth 로 쓰는 사실) 으로 95%+ 정도의 faithfulness 가 보고되었음이 추정 — **단정 안 함**.

---

## 2. Completeness — 회로가 닫혀 있는가

### 2.1 발상
Faithfulness 만으로는 부족하다. 예시: 회로 $C$ 가 "144 head 의 단순 평균" 같은 사소한 구조여도 faithfulness 가 높을 수 있다 (회로 = 모델 자체). 또 다른 예: 회로 안에 **redundant** head 가 많이 들어가 있어도 faithfulness 는 망가지지 않음.

진짜 회로라면: **회로 외부에 회로를 보충하는 백업 메커니즘이 있으면 안 된다.** 즉 회로의 일부를 빼면 외부가 보충할 수 없어야 함.

### 2.2 정의
모든 부분집합 $K \subseteq C$ 에 대해:
$$\text{IncompletenessGap}(K) \;=\; \left| F(C \setminus K) \;-\; F(M \setminus K) \right|$$

- **기호 뜻**: $F(C \setminus K)$ = 회로에서 $K$ 를 빼고 회로만 켜놨을 때의 logit difference 평균. $F(M \setminus K)$ = 전체 모델에서 $K$ 만 빼고 나머지 다 켜놨을 때의 평균.
- **일상 비유**: "26 명 중 5 명 (집합 K) 을 빼고 21 명만 일 시켰을 때 점수 vs 전체 144 명에서 같은 5 명만 빼고 139 명이 일 시켰을 때 점수. 두 점수가 같아야 한다 — 빠진 5 명을 회로 외부가 대신 채울 수 없다는 뜻."
- **왜 이 형태**: 만약 두 값이 다르다면 (외부에서 잘 채워준다면), 회로 외부에 backup 메커니즘이 존재 → 회로가 닫혀 있지 않음.
- **조심할 점**: $|K| \leq |C| = 26$ 의 모든 부분집합 = $2^{26} \approx 6.7 \times 10^7$ 개. **전수 검사 불가**. → sampling 으로 근사.

### 2.3 코드 검증
`completeness.py` verbatim:
```python
def difference_eval(model, nodes):
    return torch.abs(circuit_eval(model, nodes) - cobble_eval(model, nodes))
```
- `circuit_eval(model, nodes)` = $F(C \setminus K)$, $K$ = `nodes`.
- `cobble_eval(model, nodes)` = $F(M \setminus K)$.
- 두 값의 절대 차이 = IncompletenessGap.

검색 방식:
- **Greedy search**: 10 runs × 10 iterations × 5-10 samples per iter (코드 확인). 각 step 에서 IncompletenessGap 을 최대화하는 head 를 K 에 추가.
- **Random search**: 100 random subset 무작위 평가.

이 두 방식의 worst-case gap 이 충분히 작아야 completeness 성립. 본 환경에서 worst-case 수치 미확인.

### 2.4 숨은 가정
- "Worst-case K 를 sampling 으로 충분히 cover" — false negative (놓친 더 나쁜 K) 가능성.
- "Mean ablation" 의 distribution 가정 — 다른 ablation 방식이면 다른 결론 가능.

---

## 3. Minimality — 회로가 군더더기 없는가

### 3.1 발상
Faithfulness 와 completeness 만으로도 부족. 회로가 너무 크면 (예: 모든 144 head 포함) 둘 다 만족. "**진짜 필요한 head 만 들어 있다**" 의 조건이 추가 필요.

### 3.2 정의
각 head $v \in C$ 에 대해:
$$\text{MinimalityDrop}(v) \;=\; F(C) \;-\; F(C \setminus \{v\})$$

- **기호 뜻**: head $v$ 하나만 빼고 나머지 25 head 만 켰을 때 logit difference 의 손실.
- **일상 비유**: "26 명 중 한 명만 휴가 보내봤을 때, 회사 생산량이 얼마나 떨어지나. 떨어지면 그 사람은 진짜 필요한 사람."
- **왜 이 형태**: head 단위 *필수성* 의 직접 측정.
- **조심할 점**: ① "큰 손실" 의 임계값이 임의적. ② head 간 **substitutability** — 두 head 가 서로 백업이면 둘 중 하나만 빼는 건 손실이 작지만 둘 다 빼면 큰 손실. minimality 가 head 별로는 통과하지만 pair 로는 통과 안 할 수 있음. ③ Completeness 의 $K = \{v\}$ 사례와 본질적으로 같은데 부호가 반대 — 두 메트릭의 분리 정당성에 대한 논변 필요.

### 3.3 코드 검증
`minimality.py` verbatim 흐름:
- 각 head $v$ 를 회로에서 제거 → forward → logit_diff 계산.
- "progress from {results[head][0]} to {results[head][1]}" — 제거 전 후 logit difference 보고.
- 기본 메트릭 `logit_diff`, 옵션 `probs`.
- N = 100.

### 3.4 NAIVE circuit 과의 비교
`ioi_circuit_extraction.py` 의 `NAIVE` dict (13 head) 가 minimality 의 baseline. NAIVE 에서 한 head 라도 빼면 LD 가 크게 무너지는 head 만 모은 것 — 즉 NAIVE 는 자동으로 minimal. CIRCUIT (26 head) 의 추가 13 head 가 "minimality 를 어디까지 양보하면서까지 faithfulness/completeness 를 개선" 했는지의 trade-off 를 보여줌.

---

## 4. 3 축의 상호 관계 — 왜 셋 다 필요한가

| 회로 종류 | Faithful? | Complete? | Minimal? |
|---|---|---|---|
| 전체 모델 $C = M$ | ✓ | ✓ (trivially) | ✗ (군더더기) |
| 빈 회로 $C = \emptyset$ | ✗ | ✗ | ✓ (vacuously) |
| 진짜 회로 (의도된) | ✓ | ✓ | ✓ |
| 너무 작은 회로 (NAIVE-) | △ | ✗ (외부 보충 큼) | ✓ |
| 회로 + 무관 head 추가 | ✓ | △ | ✗ |

세 축이 동시에 성립해야 "진짜 회로". 단축 검증의 함정:
- Faithful 만 보면 → 전체 모델도 통과.
- Minimal 만 보면 → 빈 회로도 통과.
- Faithful + Minimal 만 보면 → 외부에 backup 있는 작은 회로도 통과 (completeness 가 외부 backup 차단).

이 3 축이 **mech interp 분야의 회로 검증 표준** 으로 자리잡은 이유.

---

## 5. 한계와 대안

### 5.1 본 논문의 3 축이 놓치는 것
- **Causal granularity**: head 단위 검증이지 path 단위 검증은 아님. 두 head 의 edge 가 cut 되어도 회로 그래프 의미는 바뀜.
- **Distribution-out 검증 없음**: 모두 in-distribution. Claim 4 의 fragility 는 이 한계의 직접 결과.
- **단일 metric (logit difference)** 의존: entropy 변화나 다른 token 분포 변화는 측정 안 함.

### 5.2 ACDC 의 자동화
ACDC (Conmy 2023) 가 본 논문의 발견 절차를 자동화하면서 **edge-level ablation** 으로 격상. 또 KL/LD/NLL 3 메트릭 비교를 통해 metric 선택의 영향도 검증. 본 3 축을 edge 단위 + multi-metric 으로 확장한 게 ACDC.

### 5.3 SFC 의 unit 격상
SFC (Marks 2024) 가 단위를 attention head → SAE feature 로 격상. Faithfulness/Completeness/Minimality 의 본질은 같지만 검증 대상 단위가 작아져 fragility 도 부분적으로 해소.

---

## 6. 핵심 한 문장 요약

> **"3 축 메트릭 = Faithfulness (회로만 켜도 성능 유지) + Completeness (회로 외부에 backup 없음, IncompletenessGap = |F(C\\K) − F(M\\K)| 가 모든 K 에 대해 작음) + Minimality (각 head 단독 제거 시 성능 손실 큼). 셋 다 동시 만족이 'sufficient · closed · necessary' 의 회로 정의."**

이 3 축이 본 논문의 **지속적 기여** 다 — 회로의 구체 내용 (26 head 어디) 보다, **회로 검증의 메타 절차** 가 mech interp 분야의 표준이 됐다.
