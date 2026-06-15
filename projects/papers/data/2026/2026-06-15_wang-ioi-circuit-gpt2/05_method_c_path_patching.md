# 05c · 방법론: Path patching (인과 개입의 핵심)

## 배경 사다리
이 절은 본 논문의 **수학적 핵심** 인 path patching 을 다룬다. ① **activation patching** = 한 prompt 의 hidden state 를 다른 prompt 의 같은 위치 hidden state 로 갈아끼우는 인과 개입. ② **잔여 스트림 (residual stream)** = 각 토큰 위치에서 모든 layer 의 출력이 더해지는 공용 hidden state. 이 두 개념 위에 path patching 이 정의된다.

---

## 1. 왜 path patching 이 필요한가

### 1.1 단순 activation patching 의 한계

먼저 단순 activation patching:
$$h^{(l)}_{i}(p_{\text{clean}}) \;\;\leftarrow\;\; h^{(l)}_{i}(p_{\text{corrupted}})$$

- **기호 뜻**: $h^{(l)}_{i}$ = layer $l$, token position $i$ 에서의 hidden state. $p_{\text{clean}}$ 은 정답이 나오는 정상 prompt, $p_{\text{corrupted}}$ 는 정답을 깨뜨리려고 일부러 변형한 prompt (예: 이름 swap).
- **일상 비유**: "정상 회의의 김 부장 발언만 잠시 멈추고, 다른 회의에서 김 부장이 한 발언으로 갈아끼운다. 나머지는 그대로 정상 회의."
- **왜 이 형태**: 이 head 가 만약 정답에 인과적으로 기여한다면, corrupted 활성으로 갈아끼우면 logit difference 가 무너질 것. 무너지지 않으면 그 head 는 인과적으로 무관.
- **조심할 점**: 한 head 의 출력을 바꾸면, 그 출력이 **이후 모든 head** 에 영향을 준다. 즉 "이 head 가 직접 logit 에 기여" 와 "이 head 가 다른 head 를 통해 간접 기여" 를 구분 못 한다.

이게 결정적 한계. IOI 처럼 **다층 계층 회로** 를 그리려면 "직접 vs 간접" 의 분리가 필요하다.

### 1.2 Path patching 의 발상

저자 (그리고 선행 Goldowsky-Dill 2023) 의 답: **sender → receiver path 만 patch, 나머지는 clean**.

구체적으로: head $H_s$ (sender) 의 출력만 corrupted 로 바꾼다고 했을 때, $H_s$ 의 출력이 residual stream 으로 들어가면 이후 모든 layer 의 모든 head 가 그 변경된 stream 을 본다. 그런데 우리가 알고 싶은 건 "$H_s$ 의 변경이 **특정 receiver head $H_r$ 에만** 영향을 주는 경우" — 즉 $H_s \to H_r$ 의 직접 edge.

**Path patching 절차** (코드 `circuit_discovery.py` + `utils_circuit_discovery.py` 의 `path_patching()` 시그니처에서 정황 확인):
1. clean prompt $p_c$ 로 forward, 모든 head 의 활성 캐싱.
2. corrupted prompt $p_x$ 로 forward, sender head $H_s$ 의 활성을 캐싱.
3. 다시 clean prompt 로 forward, 단:
   - $H_s$ 의 출력은 $p_x$ 의 활성으로 대체.
   - 나머지 모든 head 는 $p_c$ 의 캐싱된 활성을 **freeze**.
   - 단 receiver head $H_r$ 의 입력 (즉 그 head 가 attend 하는 residual stream) 만 변경된 $H_s$ 가 흘러들어가도록 함.
   - 즉 $H_r$ 은 변경된 stream 을 보고 자신의 활성을 새로 계산, 다른 head 들은 원래 활성 그대로.

이 절차 후 logit difference 의 변화 $\Delta \text{LD}(H_s, H_r)$ 가 "**$H_s \to H_r$ 의 직접 인과 edge 강도**".

---

## 2. 수식으로 본 path patching

기호 정의:
- $M$ = 전체 모델.
- $H_s, H_r \in \{0,1,\dots,143\}$ = head 인덱스 (layer × head_index).
- $a_h(p)$ = prompt $p$ 에 대한 head $h$ 의 활성 (output vector).
- $M_{\text{patch}(H_s \to H_r)}(p_c, p_x)$ = 위 path patching 절차를 적용한 forward 의 결과 (logit).

핵심 정의:
$$\Delta \text{LD}(H_s, H_r) \;=\; \text{LD}\!\left( M(p_c) \right) \;-\; \text{LD}\!\left( M_{\text{patch}(H_s \to H_r)}(p_c, p_x) \right)$$

- **기호 뜻**: $\Delta \text{LD}$ 가 클수록 $H_s \to H_r$ edge 가 IOI 작업에 강하게 기여. 0 근처면 무시 가능.
- **일상 비유**: "김 부장의 발언만 다른 회의에서 가져왔는데, 박 과장에게만 그 발언을 전달하고 다른 사람은 원래 회의의 김 부장 발언을 들었다고 가정. 그 결과 회의 결론이 얼마나 바뀌나? 많이 바뀌면 김 → 박 직접 채널이 강한 것."
- **왜 이 형태**: 단순 patch 와 달리 **edge 단위** 로 의존성을 분해. 144 × 144 = 20,736 개 edge × token position × prompt 의 격자에서 큰 값만 남기면 회로 그래프가 나옴.
- **조심할 점**: ① "다른 head freeze" 의 implementation 디테일이 결정적 — 어떤 layer 까지 freeze 할지, residual stream 의 어떤 component 만 분리할지 등. 코드 구현 의존성이 강해 재현이 까다롭다. ② receiver 가 attention head 가 아닌 logit unembed 인 경우는 별도 처리 (sender 가 unembed 에 직접 기여하는 path).

---

## 3. Sender vs Receiver 분리 — Q vs K vs V vs Output

Path patching 의 진짜 미세 단위는 receiver head 의 어떤 **subcomponent** 가 변경된 stream 을 보느냐다. attention head 는 입력 stream 을 다음 3 가지로 변환:
- **Query (Q)** — 어디를 볼지 결정.
- **Key (K)** — 다른 토큰이 어디를 보여줄지.
- **Value (V)** — 무엇을 옮길지.

그리고 출력 (output) 이 residual 에 더해진다.

저자들은 **sender 의 output → receiver 의 Q / K / V 중 어디에 patch 하는지** 를 분리해 측정. 예:
- "duplicate token head → s2 inhibition head 의 **Key**" — 즉 duplicate token head 가 "여기 같은 이름이다" 를 표시하면 s2 inhibition head 가 그 표시된 위치를 보아야 함.
- "induction head → name mover head 의 **Value**" — induction head 가 옮긴 정보를 name mover 가 받아 옮김.

이 Q/K/V 분리가 head 의 **기능 명명 (name mover, s2 inhibition 등)** 의 근거.

---

## 4. 대안과의 비교

### 4.1 vs zero ablation
Zero ablation: head 의 출력을 0 으로 setting.
문제: 모델이 그 head 의 평균적 기여를 baseline 으로 학습했기 때문에 zero 는 **distribution-out** 의 강한 개입이라 noise 가 큼.

### 4.2 vs mean ablation
Mean ablation: head 의 출력을 데이터셋 평균으로 setting.
장점: distribution-in. 본 논문도 path patching 의 sender 가 아닌 다른 head 에 대해서는 사실상 mean (또는 random sample) ablation 을 hybrid 로 사용.

### 4.3 vs resample ablation
Resample: 다른 prompt 의 활성으로 setting (path patching 의 sender 변경 부분이 이에 해당).
장점: 분포 내, 그리고 특정 다른 정보 (예: corrupted prompt 의 같은 위치) 로 변경 가능 → 인과 추적의 정밀도.

본 논문이 **resample (path patching 의 sender) + freeze (그 외 head)** 의 hybrid 를 쓴 게 핵심 발명. 이게 ACDC 가 자동화한 정확한 절차.

---

## 5. 핵심 한 문장 요약

> **"Path patching = sender head 의 활성을 corrupted prompt 로 갈아끼우고, 그 영향이 receiver head 의 Q/K/V 중 어디로 흘러가는지 freeze 기법으로 격리해, 144² 개 edge 의 인과 강도를 측정하는 절차."**

이 절차로 만들어진 **인과 의존 그래프** 에서 강한 edge 만 남기면 회로가 추출된다 — §05d 의 주제.
