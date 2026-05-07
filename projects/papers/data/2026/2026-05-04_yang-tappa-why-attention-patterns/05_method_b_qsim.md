# 05. 방법론 해부 — Part B: q-similarity 의 정의와 측정

## 왜 이 부분이 필요한가

(Q1) "attention 의 시간 변화를 설명하는 단일 변수가 있는가" 에 대한 답이 q-similarity. 이 변수가 이론적 분석 (Theorem 5.2) 의 기둥이자 실용 metric (KV/pruning 의 직접 입력) 이다. 정의를 정확히 박아야 (i) 통계적 추정의 안정성, (ii) 응용에서의 layer-wise scoring 이 의미를 가진다.

## 수식과 해석

### 정의 (저자 framing 으로부터 재구성)

$$S_l(W) := \frac{1}{|W| (|W|-1)} \sum_{\substack{(t, t') \in W \\ t \ne t'}} \cos\big(q^{(l)}_t,\ q^{(l)}_{t'}\big)$$

검색 스니펫 직접 인용: *"S_l is the cosine similarity among queries within a recent window, which instantiates q-similarity in TAPPA."*

**4줄 해석**

- **기호 뜻**: $q^{(l)}_t \in \mathbb{R}^{d_h}$ 는 layer $l$ (head 도 인덱스 가능, head 평균/concat 인지는 본문 디테일) 의 step $t$ query. $W \subseteq \{t-w, \dots, t\}$ 는 최근 window (size $w$). $\cos(\cdot, \cdot)$ 는 표준 코사인 유사도 $\frac{q^\top q'}{\|q\| \|q'\|}$. $S_l \in [-1, 1]$.
- **일상 비유**: "최근 $w$ 개 step 동안 묻는 질문들이 서로 얼마나 닮았나" 의 평균. 30분짜리 강의 중 마지막 5분간 학생 질문 3개가 모두 "이 부분 다시 설명해 주세요" 였다면 $S_l \approx 1$, "수식 / 비유 / 활용" 식으로 다른 영역이었다면 $S_l \approx 0$.
- **왜 이 형태**: 코사인 유사도는 norm 의 변동성 (token 별 $\|q_t\|$ 가 layer norm 의 영향으로 변할 수 있음) 을 normalize 해 방향성만 비교. dot-product $q_t^\top q_{t'}$ 만 쓰면 norm 이 큰 step 의 영향이 과대. 그렇다고 Pearson correlation 으로 가면 mean-centering 이 RoPE 회전과 충돌 (회전 후 mean 이 의미 변동). 그래서 **non-centered cosine** 이 자연 선택.
- **조심할 점**: (i) $w$ 가 너무 작으면 noise, 너무 크면 long-context 변동 평균돼서 "현재 phase" 신호가 흐려짐. 적정 $w$ 가 hyperparameter (논문에 ablation 가야 함). (ii) layer 간 $q^{(l)}_t$ 의 scale 이 다르면 layer 간 비교가 무의미 — 코사인이라 norm-free 라 큰 문제 없을 듯하지만 세밀한 layer-wise allocation 시 주의. (iii) head 별로 다 다른 패턴인데 layer 평균 $S_l$ 로 묶으면 head 다양성이 사라짐.

### 변종 (논문이 직접 다뤘는지 미확인 — 필자 추정)

대안 정의 후보:
- **Lag-$\Delta$ 자기상관**: $S_l(\Delta) = \mathbb{E}_t[\cos(q_t, q_{t+\Delta})]$. 단일 lag 값. window 내 평균보다 시간 상관 구조 보존.
- **Spectral measure**: $\{q_t\}$ 의 power spectral density 의 low-freq mass. 시계열 분석 표준이지만 LLM head 에는 과한 도구.
- **Top-k similarity**: 윈도우 내 가장 닮은 k 쌍의 평균. 이상치 (outlier query) 에 robust.

저자가 cosine-window 평균을 택한 이유는 **계산 비용** 일 가능성 — KV cache decision 마다 O($w^2 d_h$) 면 충분하나 spectral 은 FFT 비용 추가.

## 측정 시 실무 디테일

- **Layer-wise averaging**: 한 layer 의 모든 head 를 평균낼 수도 있고 head-wise 별도 score 를 가질 수도 있다. 본 논문 KV cache 적용은 layer-level allocation 이라 head 평균 사용 추정.
- **Window 슬라이딩**: 매 step 새 query 가 들어오면 oldest query 를 drop 하고 새로 추가 — incremental 계산 가능 (online cosine sums).
- **GQA / MQA 호환**: Llama-3 / Qwen2.5 처럼 grouped-query attention 인 모델은 그룹당 query 한 set 만 있어 상대적으로 깨끗.

## 핵심 한 문장

> **q-similarity 는 "query 시계열의 최근 window cosine 평균" 이라는 단순한 한 줄짜리 측도이지만, attention 패턴 예측가능성의 sufficient signal 이라는 본 논문의 강한 가설의 무게가 그 위에 모두 실려 있다.**
