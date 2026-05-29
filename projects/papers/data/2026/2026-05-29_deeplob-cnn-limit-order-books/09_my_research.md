# 09_my_research — 내 연구와의 연결

**배경 사다리**: ① 본 해체는 단순 요약이 아닌 *내 active research 와의 mapping*, ② `_profile.md` 의 **관심 영역 §A~F** 와 **보유 자산 목록** 양쪽을 모두 짚는다, ③ 일반론 ("LOB 모델 참고 가능") 금지 — 구체적 mechanism / axis / 수식 요소를 지정해 연결.

---

## 1. 매핑 — 어느 §와 어느 자산에 닿나

| 채널 | 강도 | 연결의 본질 |
|------|------|-------------|
| §F (원거리, market-microstructure) | ★★★ | DeepLOB 자체가 §F 의 LOB 라인. 첫 커버. |
| §D (TS as 2D) | ★★ | LOB 의 (시간 × 특징) 행렬 → CNN 처리는 TimesNet/GAF/MTF 와 동궤 사상. APF 가설과 직접 비교 가능. |
| §E (금융 시계열 DL) | ★★ | fin-ts-dl 의 LOB 변형. ProTran/QuantileFormer 와 다른 입력 (return → LOB). |
| §C (Attention/PE-Attention) | ★ | conv 의 hard inductive bias vs attention 의 soft 의 비교축 — APF 의 PE/motif 가설과 비교 가능. |
| §B (Mech interp / Circuit) | 연결 약함 | DeepLOB 의 conv 회로를 mech interp 으로 해부한 후속 작업은 미확인. 향후 가능성. |
| §A (Grokking) | 연결 약함, 전이 가능성만 | LOB 학습에서 *generalization gap* 이 시간에 따라 어떻게 변하나 — 직접 grokking 신호 미확인. |

---

## 2. 흡수할 기법 — APF 와 Grokking 양 track 모두 적용 가능한 디테일

### (a) **APF — "2D motif" 가설 재정의에 직접 차용**

APF 의 핵심 가설: "Transformer attention pattern 의 *모양(motif: diagonal/stripe/block/edge/spike/checker)* 이 PE 와 task 에 따라 결정되며, 그 모양이 예측에 인과적으로 기여한다."

DeepLOB 의 첫 conv 1×2 는 정확히 *attention motif 와 등가의 hard prior* — "이 두 칸은 짝이다" 를 architecture 가 강제. APF 가 attention 으로 *soft 하게 발견* 하려는 motif 를 DeepLOB 는 *conv 커널 모양으로 hard 하게 강제*.

→ **APF paper 의 §3 Method**(motif typology 정의 부분) 에 다음 인용 추가 가능:

> "Architecture 의 inductive bias 가 motif 의 출현을 강제하는 또 다른 패러다임으로, Zhang et al. (2019) 의 DeepLOB 는 LOB 의 (가격·거래량)·(bid·ask)·(10 레벨) 위계를 $1 \times 2$, $1 \times 2$, $1 \times 10$ 의 conv 커널 모양으로 강제한다. 본 작업의 attention motif 가설은 *PE 의 영향으로 conv-유사 motif 가 자발적으로 출현하는가* 를 묻는다 — DeepLOB 가 motif 의 *상한* 을 architecture 에 hard-code 한 사례로 인용."

### (b) **APF — Inception 의 1-D 시간축 차용을 APF probe CNN 설계에 직접 활용**

APF 의 probe CNN 은 attention map (T × T) 를 입력으로 받아 motif class 분류. 현재 표준 CNN. DeepLOB 의 Inception 1-D 변형 (3×1, 5×1, MaxPool) 을 APF probe 의 시간축 방향으로 도입해 다중 시간 스케일 motif 식별 가능.

→ **APF code/sections/05_method.md 의 probe CNN 정의 절** 에 Inception 1-D 모듈 추가 실험.

### (c) **Grokking — "small model + 많은 data + 강한 inductive bias" 의 generalization gap 곡선 비교 baseline**

Grokking 의 본질은 *over-parameterised* 모델이 *small data* 에서 보이는 delayed generalization. DeepLOB 는 정반대: *small model (143K param) + large data (20만)*. 그러나 본 연구에서 다음 비교 실험을 설계할 수 있다:

> **실험**: 동일 FI-2010 데이터에서 DeepLOB (143K param) 와 large Transformer (10M+ param) 의 *generalization gap 시간 곡선* 을 비교. 작은 모델은 빠른 수렴, 큰 모델은 grokking 가능. 만약 큰 모델이 늦게 generalize 하며 *DeepLOB 수준 또는 그 이상 도달* 하면 — *architecture inductive bias 의 의의가 데이터·모델 크기 trade-off* 임을 정량화.

→ **Grokking paper 의 §4 Experimental Plan** 에 LOB 도메인 실험 추가 가능.

---

## 3. 충돌·경쟁 지점 — 내 주장과 부딪히는 부분

### 충돌 1: APF 의 "PE 가 attention motif 를 결정" vs DeepLOB 의 "architecture inductive bias 가 모든 것"

APF 는 attention pattern 의 모양이 *학습 결과* 라고 보지만, DeepLOB 의 conv 모양은 *학습 전 hard-coded*. 만약 *충분히 큰 모델 + 충분히 많은 데이터* 면 attention 으로도 같은 motif 를 학습할 수 있다는 주장 가능.

**내 응답 초안**:
> "DeepLOB 의 hard inductive bias 는 small-data (FI-2010 20만) 에서는 우세하나, large-data regime 에서는 attention 의 soft learning 이 등가의 motif 를 발견할 수 있다. 본 작업 (APF) 는 *어떤 PE 가 어떤 motif 출현을 가속하는가* 를 묻는 mechanism 연구이며, DeepLOB 는 *hard motif 가 작동한다* 의 존재 증명이다."

### 충돌 2: DeepLOB 의 75% 결과 가 "분류 정확도" 인 점

내 ProTran-TFA paper (paused) 는 *확률적 forecast + quantile* 을 핵심으로 한다. DeepLOB 의 deterministic classification 은 calibration 미보고, uncertainty 없음. 직접 비교 불가하나, 다음 차원에서 ProTran-TFA 의 *probabilistic forecast* 가 LOB 도메인으로 확장될 가능성 있음 — *post-hoc calibration* 으로 DeepLOB 위에 quantile 층 추가.

---

## 4. 인용 포인트 — 내 논문 어디에 어떤 문장으로

### APF paper 의 §3 Background → "Architectural inductive bias for spatial structure"

```markdown
Architectural inductive bias 가 attention motif 의 *hard 상한* 을 정의한 사례로, Zhang et al. (2019) [arXiv:1808.03668, IEEE TSP] 의 DeepLOB 는 LOB 의 위계적 구조 — (가격·거래량) 짝, (bid·ask) 쌍, 10 가격레벨 — 를 conv 커널 모양 $(1 \times 2, 1 \times 2, 1 \times 10)$ 으로 강제한다. 본 작업의 attention motif 가설은 이 강제 없이 attention 이 *어떤 PE 조건에서 자발적으로 유사 motif 를 발견하는가* 를 묻는다.
```

### APF paper 의 §5 Method → probe CNN 설계 절

```markdown
Probe CNN 의 시간축 처리에서 Zhang et al. (2019) 의 Inception 1-D 모듈 (branches: $1 \times 1 \to 3 \times 1$, $1 \times 1 \to 5 \times 1$, MaxPool $\to 1 \times 1$, channel-wise concat) 을 도입해 다중 시간 receptive field 를 동시 추출한다 (Appendix B 의 변형 1).
```

### Grokking paper 의 §4 Experimental Plan → LOB 실험

```markdown
LOB 도메인에서 architecture inductive bias 의 효과를 정량화하기 위해 DeepLOB (Zhang et al. 2019, 143K param) 와 동일 데이터에서 학습된 large Transformer (10M+ param) 의 generalization gap 시간 곡선을 비교한다. 가설: hard inductive bias 가 small-data regime 에서 우세, large-data regime 에서는 grokking-style 지연 일반화로 attention 이 따라잡는다.
```

---

## 5. 반면교사 — DeepLOB 가 못한 것을 내가 어떻게 다룰까

### (a) DeepLOB 의 *결과 분산 미보고* → 내 APF/Grokking 작업은 multi-seed 의무화

DeepLOB notebook 의 단일 seed 0.7535 가 신뢰 구간을 갖지 않는 점은 *학술 ML 의 일반 실수*. 내 작업에서는:
- **APF**: 12 review loops 가 이미 진행 중 — 각 motif sweep 에서 *최소 5 seed × 95% CI* 보고.
- **Grokking**: Week 1 setup 단계에서 *seed mass production* (≥10 seed/조건) 인프라 우선.

### (b) DeepLOB 의 *분류 → 거래 간극* → 내 ProTran-TFA 는 *quantile + cost-aware*

DeepLOB 가 transaction cost 를 무시했듯, 일반 ML 시계열 연구의 약점. ProTran-TFA (paused) 의 *quantile forecast + tail-aware loss* 는 cost-aware backtest 의 자연스러운 다리.

### (c) DeepLOB 의 *Inception 차용은 했지만 design rationale 미보고* → 내 APF probe CNN 은 *layer choice rationale 의무*

내 APF probe CNN 의 각 conv block 마다 "왜 이 커널 크기인지" 를 명시. design choice 의 hidden assumption 을 *논문 §6 Appendix C* 에 표로 정리.

---

## 6. 한 줄 요약

> **DeepLOB 는 §F market-microstructure 의 첫 커버이자 §D (TS as 2D) 의 LOB-도메인 실증으로, APF 의 "attention motif 자발 출현" 가설의 *hard 상한 baseline* 이며, Grokking 작업의 "inductive bias × data size × generalization gap" 비교 실험의 직접 비교 대상이다 — 동시에 분산 미보고와 거래 metric 부재는 내 작업의 *반면교사* 다.**
