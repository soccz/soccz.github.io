# 05b · 방법론: IOI 작업과 데이터셋

## 배경 사다리
이 절은 본 논문의 **작업 정의** 와 **데이터셋 생성 절차** 를 다룬다. ① 절차적 (procedural) 데이터셋 = 사람이 작성한 게 아니라 코드로 자동 생성된 데이터셋. ② "logit difference" = 두 토큰에 대한 모델의 점수 차이. 이 둘만 알면 된다.

---

## 1. 왜 IOI 작업인가

저자들이 골라야 했던 작업의 조건:
- (i) **자연어** (toy 합성이 아니라 실제 영어 문장).
- (ii) **단순한 정답 규칙** — 자동 평가가 가능해야 함.
- (iii) **GPT-2 small (124M) 도 푸는 작업** — 회로가 작은 모델 안에 fit 해야 분석 가능.
- (iv) **명확한 인과 구조** — 정답이 "어떤 정보 → 어떤 결정" 의 의존성에서 나옴.

**Indirect Object Identification (IOI)** 가 이 4 조건을 모두 만족하는 sweet spot. "Then, John and Mary went to the store. John gave a bottle of milk to ___" 형식에서:
- 두 이름이 나온다 (subject S = John, indirect object IO = Mary).
- S 는 **두 번** 등장 (Then... John 과 John gave...).
- IO 는 **한 번** 등장.
- 정답 = IO (Mary). 정답 규칙: "indirect object 는 한 번만 등장한 이름".

GPT-2 small 이 이 작업을 ~99% 정확도로 푼다 (정황 — 본 환경에서 정확 수치 확인 불가).

### 1.1 logit difference 정의

평가 메트릭:
$$\text{LD}(prompt) = \text{logit}(IO) - \text{logit}(S)$$

- **기호 뜻**: $\text{logit}(\text{IO})$ = 마지막 토큰 자리에서 모델이 IO 이름 (Mary) 에 부여하는 unnormalized score, $\text{logit}(S)$ = subject 이름 (John) 에 부여하는 score.
- **일상 비유**: "Mary 의 응원 점수 − John 의 응원 점수". 양수가 클수록 Mary 가 정답이라고 강하게 외치는 셈.
- **왜 이 형태**: softmax 후 확률 비교 대신 logit 차이를 쓰는 이유는 — softmax 는 다른 vocab token 의 점수에 영향을 받지만 logit difference 는 **두 후보 간** 의 비교만 본다. ablation 의 효과를 isolate 하기에 더 깨끗.
- **조심할 점**: LD 가 양수여도 정답을 "맞춘다" 와 같지 않다 (다른 단어가 더 높을 수 있음). 그러나 ablation 효과 측정에는 LD 의 **변화량** 만 보면 되므로 문제 없음.

---

## 2. 데이터셋 생성 — ABBA vs BABA × 15+15 템플릿

`ioi_dataset.py` 코드 verbatim:

### 2.1 BABA 템플릿 (15 개) — 정답 토큰 직전 위치에 IO 이름이 두 번째로 등장
예 verbatim:
```
"Then, [B] and [A] went to the [PLACE]. [B] gave a [OBJECT] to [A]"
"After [B] and [A] went to the [PLACE], [B] gave a [OBJECT] to [A]"
"While [B] and [A] were working at the [PLACE], [B] gave a [OBJECT] to [A]"
...
```
패턴: 첫 등장 순서가 **B → A**. B 가 subject (두 번 등장), A 가 IO. 정답 = A.

### 2.2 ABBA 템플릿 (15 개) — 첫 등장 순서가 A → B
"BABA_TEMPLATES 의 첫 [B] 와 [A] 를 swap 해서 생성" (코드 주석 확인). 패턴: A → B → B → A. 여전히 두 번 등장한 이름이 S, 한 번만 등장한 이름이 IO. 정답 = A 또는 B (template 에 따라).

### 2.3 절차적 채움
- **NAMES** 리스트 (~100 개): Michael, Christopher, Jessica, Matthew, Ashley, Jennifer, Joshua, Amanda, ... (코드에서 102 개로 보고).
- **PLACES** (8 개): store, garden, restaurant, school, hospital, office, house, station.
- **OBJECTS** (8 개): ring, kiss, bone, basketball, computer, necklace, drink, snack.
- 한 prompt 마다 무작위로 두 이름 + 한 장소 + 한 객체 선택해서 [A], [B], [PLACE], [OBJECT] 자리 채움.

### 2.4 IOIDataset 클래스 (code verbatim)
```python
def __init__(
    self,
    prompt_type: Union[str, List[str]],   # "ABBA" | "BABA" | "mixed" | list
    N=500,                                  # 기본 샘플 수
    tokenizer=None,
    prompts=None,
    symmetric=False,
    prefixes=None,
    nb_templates=None,
    ioi_prompts_for_word_idxs=None,
    prepend_bos=False,
    manual_word_idx=None,
)
```

기본 N = 500 prompt. `completeness.py` 와 `minimality.py` 의 평가 실험에서는 N = 100 으로 축소. 즉 회로 발견은 큰 N, 검증은 작은 N (subset 탐색이 quadratic 이라).

---

## 3. 왜 이렇게 데이터셋을 만들었는가 (대안과의 비교)

### 대안 1 — 자연 코퍼스에서 IOI 문장 추출
실제 영어 corpus 에서 IOI 패턴 문장을 정규식으로 뽑는 방법. 문제:
- IOI 위치·이름의 분포가 통제 불가 → ablation 효과 측정에 noise.
- 외부 문맥 (앞·뒤 문장) 이 prompt 마다 다름 → 회로 외부 영향 제어 불가.
- **저자 선택은 절차적 생성**. 단점: 분포가 좁고 인공적 (Claim 4 의 fragility 의 원인). 장점: 분석 가능성.

### 대안 2 — 단일 prompt + token 위치별 분석
"하나의 prompt 만 가지고 layer × position × head 격자를 분석" — Anthropic Mathematical Framework 의 초기 분석 스타일. 문제:
- N=1 의 노이즈에 취약.
- "이 head 가 이 작업을 일반적으로 수행한다" 는 generality 주장 불가.
- 저자 선택은 N=500 의 균일 분포 통계.

### 대안 3 — 더 큰 데이터셋 (수만 prompt)
계산 비용. path patching 의 sender × receiver pair × token position 격자가 이미 144² 이상 — N 을 키우면 quadratic 으로 비용 증가. **N=500 이 통계적 안정성 vs 계산 비용의 sweet spot** 으로 추정.

---

## 4. 데이터셋 선택의 숨은 편향

- **이름 분포의 영어 백인-중심성**: NAMES 리스트의 102 개가 영미권 이름 위주 (Michael, Jessica 등). 다른 언어·문화권 이름에서 같은 회로가 작동하는지 미검증. → Claim 4 의 fragility 와 연결.
- **장소·객체의 단순성**: 8 장소 × 8 객체 의 좁은 어휘. 실제 자연어 IOI 의 다양성 대비 좁음.
- **문장 구조의 단조성**: "Then/After/While/Friends" 등 시작 보조구가 30 개 템플릿에 갇혀 있음. 진짜 코퍼스의 longer-range 의존 구조는 미포함.
- **single-sentence**: 두 문장 짜리 prompt 만 사용. 더 긴 context 에서 회로가 어떻게 변하는지 미증명.

이 편향들은 모두 **회로 발견을 가능하게 하기 위한 의도된 단순화** 다. 하지만 그렇게 발견된 회로의 **일반화 범위** 는 동시에 좁아진다.

---

## 5. 핵심 한 문장 요약

> **"IOI = '두 번 등장한 이름 vs 한 번 등장한 이름 중 한 번 쪽을 출력' 의 단순 정답 규칙을 가진 자연어 작업. 102 names × 8 places × 8 objects × 30 templates 의 절차적 생성으로 N=500 데이터셋. logit difference 가 평가 메트릭."**
