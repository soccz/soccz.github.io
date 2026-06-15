# 05d · 방법론: 회로 추출과 헤드 분류

## 배경 사다리
이 절은 path patching 결과의 **인과 의존 그래프** 에서 회로를 추출하고, 그 회로 안의 26 개 head 를 기능별로 분류하는 절차다. 두 단계: ① **임계값 기반 head 추출**, ② **OV-circuit / Q-input 분석으로 기능 명명**.

---

## 1. Head 추출 — 인과 의존 그래프에서

§05c 의 path patching 으로 모든 (sender, receiver) 쌍의 $\Delta \text{LD}$ 가 측정됐다. 이 격자에서 어떻게 26 개 head 를 골라냈는가?

### 1.1 Top-down 발견 절차 (저자가 paper 에서 실제 사용한 순서, 코드 정황)

논리 흐름은 **logit 에서 거꾸로** 따라가는 backward search:

1. **Step A — Name Mover 발견** (가장 깊은 layer, 9~11):
   - "어떤 head 의 출력 → unembed (logit) 로 path patching 했을 때 $\Delta \text{LD}$ 가 큰가" 를 144 head 전부에 대해 측정.
   - 큰 head 11 개 추림: (9,9), (9,6), (9,7), (9,0), (10,0), (10,1), (10,2), (10,6), (10,10), (11,2), (11,9).
   - 이 head 들의 **OV circuit** 을 분석하니 "IO name token 의 정보를 옮긴다" — name mover 명명.

2. **Step B — S-Inhibition 발견** (layer 7~8):
   - Name mover 들의 **Query input** 에 path patching 했을 때 $\Delta \text{LD}$ 가 큰 sender head 를 찾음.
   - (7,3), (7,9), (8,6), (8,10) 4 개가 강한 sender.
   - 이 head 들이 하는 일을 분석: "S token (두 번 등장한 이름) 의 위치를 name mover 가 보지 못하게 차단" — s2 inhibition 명명.

3. **Step C — Induction + Duplicate Token 발견** (layer 0~6):
   - S-inhibition head 의 입력 (K, V) 에 path patching → sender 추적.
   - (5,5), (5,8), (5,9), (6,9) = induction (직전 token 시퀀스 매칭).
   - (0,1), (0,10), (3,0) = duplicate token (두 위치에 같은 token 이 있다는 신호).

4. **Step D — Previous Token 발견** (layer 2, 4):
   - Induction head 의 입력 에 path patching → (2,2), (4,11).

5. **Step E — Negative Name Mover 발견** (layer 10~11):
   - Name mover 와 동일 layer 인데 부호가 반대 — "IO 가 아닌 S 방향으로 logit 을 미는" 2 head: (10,7), (11,10).
   - 이게 회로 안의 작은 견제 메커니즘.

이렇게 추출된 26 head 가 `easy_transformer/ioi_circuit_extraction.py` 의 `CIRCUIT` dict.

### 1.2 임계값의 임의성

각 step 에서 "큰 $\Delta \text{LD}$ 의 head 만 남긴다" 가 무엇을 의미하는가?
- 코드에서 정확한 임계값을 직접 확인하지는 못했으나 (구체 numeric threshold), `CIRCUIT` vs `NAIVE` 두 dict 의 head 개수 차이가 정황 단서:
  - `NAIVE`: name mover 3 + induction 2 + duplicate 2 + previous 2 + s2 inhibition 4 = 13 heads (negative 0).
  - `CIRCUIT`: 26 heads (위 11 + 2 + 4 + 4 + 3 + 2).
- 두 dict 의 차이는 임계값을 어떻게 잡았느냐 — `CIRCUIT` 은 "$\Delta \text{LD}$ 가 일정 이상인 모든 head", `NAIVE` 는 "각 클래스의 가장 강한 1~3 개". `NAIVE` 가 minimality 의 baseline 으로 쓰임 — "최소 회로보다 큰 회로가 정말 필요한가" 의 비교.

---

## 2. 헤드 분류 — 6 (또는 7) 기능 클래스

### 2.1 클래스 별 역할 (코드 + secondary 소스 합의)

| 클래스 | 코드의 heads (layer, head) | 추정 layer 범위 | 기능 |
|---|---|---|---|
| **previous token** | (2,2), (4,11) | 얕은 (2-4) | "직전 token 이 무엇이었나" 를 현재 위치에 부착 |
| **duplicate token** | (0,1), (0,10), (3,0) | 매우 얕은 (0-3) | "같은 token 이 두 번 등장" 신호 표시 |
| **induction** | (5,5), (5,8), (5,9), (6,9) | 중간 (5-6) | "A B ... A → B" 의 시퀀스 복사 (Olsson 2022 의 induction head) |
| **s2 inhibition** | (7,3), (7,9), (8,6), (8,10) | 중상 (7-8) | S2 위치 (두 번째로 나온 subject) 를 name mover 가 attend 하지 못하게 inhibit |
| **name mover** | 11 heads in layers 9-11 | 깊은 (9-11) | IO name token 의 정보를 끝쪽 위치로 옮겨 logit 을 IO 방향으로 밀어줌 |
| **negative name mover** | (10,7), (11,10) | 깊은 (10-11) | name mover 와 반대로 logit 을 S 방향으로 미는 견제 회로 |

7-class 표기 (논문 본문에서 자주 인용되는) 의 추가 클래스는 **Backup Name Mover** — code 의 name mover 11 heads 중 일부가 본문에서는 "주요 + 백업" 으로 세분화된 것으로 추정. 본 환경에서 정확 분리 기준 확인 불가.

### 2.2 클래스 명명의 운영적 근거

각 클래스 명명은 **두 가지 증거** 에 기반:

**(a) OV circuit 분석** — head 의 output projection $W_O W_V$ 가 어떤 vocabulary direction 으로 정보를 옮기는가:
- name mover: $W_O W_V$ 가 name token 들의 unembed direction 으로 align.
- previous token: $W_O W_V$ 가 "이전 위치의 token embedding" 을 현재 위치에 더하는 방향.

**(b) Attention pattern 분석** — head 가 어떤 토큰 위치에 attend 하는가:
- duplicate token: 같은 token 이 등장한 두 위치 사이의 attention 큼.
- induction: 직전 시퀀스 매칭 위치에 attend.
- s2 inhibition: query 가 마지막 위치에서, key 가 S2 위치에 attend (그러나 그 정보를 **억제** 하는 방향으로).

이 두 증거가 합쳐졌을 때만 "이 head 는 X 기능" 이라고 명명. 한쪽만으로는 sufficient 하지 않음 — Jain-Wallace (2019) 가 보였듯 attention pattern 만 보고 기능을 단정하면 오해의 위험.

---

## 3. 회로 그래프 — 계층적 정보 흐름

발견된 회로의 information flow (path patching 의 강한 edge 만 남긴 그래프, 정황 재구성):

```
[input tokens]
      |
      v
[duplicate token heads]   ───┐    "John 이 두 번 등장한다는 신호"
[previous token heads]    ───┤
      |                      |
      v                      |
[induction heads]   <────────┘    "직전 토큰 패턴 매칭"
      |
      v
[s2 inhibition heads]             "S2 (두 번째 John) 위치 inhibit"
      |
      v (Q-input)
[name mover heads]                "IO (Mary) token 을 logit 으로 옮김"
[negative name mover heads]       "역방향 견제"
      |
      v
[unembed → logit]
```

이 그래프의 의미:
- **얕은 layer = 표면 신호 감지** (duplicate, previous).
- **중간 layer = 패턴 합성** (induction).
- **깊은 layer = 결정 + 견제** (name mover, negative name mover).
- **s2 inhibition 이 핵심 hinge** — 깊은 head 의 attention 을 어디로 향하게 할지 통제.

이 위계 구조 자체가 본 논문이 **mech interp 분야에 남긴 "회로는 계층적 정보 처리 파이프라인" 형식** 의 prototype 이다.

---

## 4. 대안과의 비교 — 만약 다른 추출 방식이었다면

### 4.1 Bottom-up (얕은 layer 부터) 발견
"먼저 layer 0 의 head 가 무엇을 하는지 보고, 위로 올라간다" — 가능하지만 layer 0 의 head 가 단독으로 의미 있는 작업을 한다는 보장 없음 (그저 token embedding 복제 등). Top-down 이 효율적.

### 4.2 Sparse coding 으로 head 자동 발견
SAE (Sparse Autoencoder) 를 attention 활성에 적용해 sparse feature 로 분해 — Marks 2024 (SFC) 의 접근. IOI 처럼 head 단위 직접 분석 대신 feature 단위. 본 논문은 head 단위가 충분한 abstraction 임을 보여줘 SAE 접근이 등장하기 전의 표준이 됐다.

### 4.3 Gradient-based attribution (saliency)
"이 head 의 출력에 대한 logit 의 gradient 가 크면 중요" — Integrated Gradients 류. 문제: gradient 는 **infinitesimal** 변화의 효과만 측정, large intervention 의 결과와 일치 안 함. ablation 이 더 robust.

---

## 5. 핵심 한 문장 요약

> **"144 → 26 head 추출은 logit 에서 거꾸로 path patching 으로 backward search; 26 head 의 명명은 OV circuit + attention pattern 의 두 증거 합의; 결과는 'duplicate/previous → induction → s2 inhibition → name mover + negative' 의 4-단 계층 회로."**
