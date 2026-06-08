# 03 · 문제 지형도

## 배경 사다리

이 절을 이해하려면 ① 트랜스포머의 self-attention 이 "각 토큰이 모든 다른 토큰과 얼마나 비슷한지 점수를 매기는 과정" 이라는 것, ② 트랜스포머는 그 자체로는 토큰의 순서를 모른다는 사실 (집합 처리기에 가깝다), ③ 그래서 "위치 인코딩 (PE)" 이라는 추가 신호로 순서를 알려준다는 점, 세 가지만 알면 된다.

## 실제 문제는 어떻게 생기는가

### 상황 1: 두 자리 → 세 자리 덧셈
모델에게 "13 + 47" 같은 두 자리 덧셈만 학습시킨다. 정확도 99%. 그런데 평가에서 "138 + 472" 같은 세 자리 덧셈을 주면 정확도가 30% 로 떨어진다. 이는 "학습 길이 8 토큰, 평가 길이 16 토큰" 의 극단 사례다. 본 논문의 `s2s_addition` task + `len_tr8_ts16` split 이 정확히 이 시나리오를 모사한다 (저자 wandb 메타데이터 verbatim 확인).

### 상황 2: 짧은 추론 → 긴 추론 (SCAN, 자연어 명령어 → 액션열)
"jump twice" 라는 명령은 "JUMP JUMP" 로 바꾸는 task. 짧은 명령으로만 학습한 모델에게 긴 명령 ("jump twice and walk thrice") 을 주면 acction 열의 일부를 빼먹는다. 저자가 사용한 `scan` dataset 의 `mdlen_tr25_ts48` split 이 이 경우다.

### 상황 3: 짧은 코드 → 긴 코드
LLM 을 1024 토큰 컨텍스트로 학습시킨 뒤 2048 토큰 코드 파일을 요약해달라고 하면 환각이 폭증한다. 저자가 1B-scale 후속에서 정확히 이 시나리오를 평가한다 (HuggingFace 1B CodeLLM 3 종).

이 셋의 공통 구조는 단순하다 — **학습 분포의 "위치 인덱스 분포" 와 평가 분포의 "위치 인덱스 분포" 가 다르다**. 학습에서 "위치 100 너머는 본 적 없는데" 평가에서 "위치 1500" 의 토큰이 나타난다. 이게 PE 의 분포 변화 문제다.

## 기존 접근 계보 (연대순 5 개 이정표)

### (1) Absolute Sinusoidal PE — Vaswani et al. 2017 ("Attention Is All You Need")
"위치 $i$ 마다 정해진 sin / cos 벡터 $\mathrm{PE}(i)$ 를 만들어 토큰 임베딩에 더한다."

$$\mathrm{PE}(i, 2k) = \sin\!\left(\frac{i}{10000^{2k/d}}\right), \quad \mathrm{PE}(i, 2k+1) = \cos\!\left(\frac{i}{10000^{2k/d}}\right)$$

- **기호 뜻**: $i$ = 토큰의 절대 위치, $k$ = 임베딩 차원의 인덱스, $d$ = 임베딩 차원. $10000^{2k/d}$ 는 채널마다 다른 주파수.
- **일상 비유**: 시계 침이 시·분·초·밀리초 등 서로 다른 속도로 도는 것처럼, 각 채널이 서로 다른 속도로 위치 정보를 표현.
- **왜 이 형태**: 곱셈 없이 미리 표를 만들어두면 학습 길이 외 $i$ 에 대해서도 값이 정의된다 (이론적으로는). 또 $\sin(a+b) = \sin a \cos b + \cos a \sin b$ 라서 상대 위치를 선형 결합으로 표현 가능.
- **조심할 점**: 이론적으론 외삽 가능하지만 실제로는 학습된 attention head 가 $i \in [0, L_{\text{train}}]$ 범위의 PE 패턴에만 적응해서 외삽이 망가진다.

이 부족함이 후속 PE 들의 동기였다.

### (2) Learned Absolute PE — GPT-2 / BERT 계열 (2018-2019)
"위치마다 학습 가능한 임베딩 $\mathrm{PE}_i$ 를 둔다." 시노이드보다 표현력은 더 큰데 외삽이 **본질적으로 불가능**하다 — 학습되지 않은 위치 인덱스에 대한 임베딩이 아예 없다.

### (3) T5 Relative PE — Raffel et al. 2020
"두 토큰 사이 거리 $i - j$ 를 32 개 정도 버킷으로 나눠 (가까울수록 촘촘하게, 멀수록 로그 스케일) 각 버킷마다 학습 bias 를 더한다."

$$A_{ij} = \frac{q_i^\top k_j}{\sqrt{d}} + b_{\text{bucket}(i-j)}$$

- **장점**: 상대 거리만 보므로 절대 위치 분포 변화에 더 강건. 학습되지 않은 거리는 가장 가까운 버킷에 떨어지므로 외삽 시 graceful degradation.
- **부족함**: 버킷이 거칠어서 fine-grained 거리 정보 손실. 그리고 학습 외 거리에 대한 버킷 bias 가 학습되지 못 함.

### (4) ALiBi — Press et al. 2022
"attention score 에 거리에 비례하는 음의 선형 bias 를 head 별로 다른 기울기 $m_h$ 로 더한다."

$$A_{ij} = \frac{q_i^\top k_j}{\sqrt{d}} - m_h \cdot |i - j|$$

- **기호**: $m_h$ 는 head 마다 다른 양수, 보통 기하 수열 $m_h = 2^{-8h/H}$ 형태로 설정.
- **장점**: PE 임베딩 없음, 학습 외 거리에서도 bias 가 정의됨 (선형 외삽). Press et al. 이 보인 length extrapolation 결과로 한때 표준.
- **부족함**: bias 가 head-uniform 한 함수 형태로 강제됨. 그리고 모든 head 가 "가까운 토큰 우선" 이라는 inductive bias 를 강제로 가짐 — 멀리 보고 싶은 head 가 학습으로 만들어지기 어렵다.

### (5) Rotary PE (RoPE) — Su et al. 2021 (Neurocomputing 2024)
"query 와 key 를 각 frequency 채널 쌍 $(x_{2k}, x_{2k+1})$ 마다 각도 $i\omega_k$ 로 회전. 그러면 $q_i^\top k_j$ 가 $i - j$ 에만 의존."

$$\tilde q_i = R(i, \omega) q_i, \quad \tilde k_j = R(j, \omega) k_j, \quad \tilde q_i^\top \tilde k_j = q_i^\top R(j-i, \omega) k_j$$

- **기호**: $R(i, \omega)$ 는 2D 회전 행렬 블록의 대각 합성, $\omega_k = 10000^{-2k/d}$ 라는 주파수.
- **장점**: 절대 위치 의존 없이 상대 위치 의존만 유도, 사후 학습 길이 변경에도 어느 정도 강건.
- **부족함**: 회전 각이 학습된 attention pattern 에 강한 oscillation 을 강제 — 학습 길이 너머에서 진동의 위상이 안 본 영역으로 가면 attention 이 깨진다 (NTK / YaRN 같은 후속 보정 기법이 등장한 이유).

이상 5 종 PE 는 각자 "어떤 inductive bias 를 주입할지" 가 다르다. APE 는 절대 위치, T5/ALiBi 는 상대 거리, RoPE 는 회전 위상. **모두 "PE 가 length-gen 의 핵심 인자다" 라는 전제는 공유**.

## 기존 방법들이 공통으로 놓친 핵심 gap

**"PE 없이 (NoPE) 와 동렬 비교한 통제 실험이 없다."**

각 PE 논문은 자기 방식을 기존 PE 와 비교했지 "PE 부재" 와 동렬로 비교하지 않았다. ALiBi 논문은 sinusoidal·T5·RoPE 와는 비교했지만 NoPE 와의 head-to-head 비교를 main result 로 보고하지 않는다. 그 결과 "PE 가 필요하다" 라는 전제 자체가 한 번도 정면으로 검증되지 않은 채 PE 기법 경쟁만 격화되었다.

(주의: 이는 본 논문 저자들의 framing 이며, Haviv 2022, Tsai 2019 등 일부 선행 연구는 NoPE 의 implicit 위치 인식을 다뤘다. 본 논문의 신규성은 "5 종 PE 와 NoPE 의 통제 head-to-head" + "이론적 표현력 정리" + "attention KL 분석을 통한 NoPE 의 T5-relative 닮음" 의 결합.)

## 이 논문이 그 gap 을 어떻게 메우겠다는 건지

저자들은 **PE 만 갈아끼우는 통제 실험 protocol** 을 제안한다. 동일 T5-base decoder-only 백본 (`d_model=768`, 동일 layer 수, 동일 optimizer/scheduler), 동일 데이터셋, 동일 평가 split, 다중 seed (3 개) 하에서 5 종 PE 를 비교한다. 그 위에 **NoPE 의 표현력 정리** 와 **NoPE vs 다른 PE 의 attention 분포 KL** 분석을 얹는다. Abstract 에서 "NoPE outperforms other explicit positional encoding methods while requiring no additional computation" 가 주장이다.

다음 절 (`04_claims`) 에서 이 주장들을 Claim 단위로 해체한다.
