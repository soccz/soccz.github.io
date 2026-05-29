# 10-C · 확장 — 실험 아이디어 2개

---

## 아이디어 1: Grokking × ADL — 합성 ADL 데이터에서 Mirror Descent 학습 곡선 추적

### 동기

Mirror Descent는 단조롭게 수렴하는 $O(\sqrt{T})$ 후회를 보장한다. Grokking 연구에서 관찰되는 "갑작스러운 일반화 도약"과 대조적이다. ADL 학습에서 비단조 수렴(Grokking-like phase transition)이 나타나는 조건이 있다면, 이는 Grokking 연구의 새로운 도메인이 된다.

### 실험 설계

**데이터 생성**:
```python
# 합성 ADL 이벤트 생성
import numpy as np

def generate_adl_events(n_traders=100, n_rounds=500, shock_freq=0.05):
    """
    Returns: list of (D_t, {n_i, ell_i}) tuples per round
    """
    prices = np.cumprod(1 + np.random.normal(0, 0.02, n_rounds))
    events = []
    for t, p in enumerate(prices):
        # 가격 충격이 클 때만 ADL 이벤트
        if abs(prices[t]/prices[t-1] - 1) > shock_freq if t > 0 else False:
            n_i = np.random.pareto(2, n_traders) * 1e6  # 파레토 분포 명목
            ell_i = np.random.choice([5, 10, 25, 50, 100], n_traders)
            D_t = np.random.exponential(sum(n_i) * 0.001)
            events.append((D_t, n_i, ell_i))
    return events
```

**학습 알고리즘**:
- Mirror Descent (엔트로피 Bregman divergence)
- 기울기: $\nabla_{\mathbf{h}} D_t(\mathbf{h})$
- 학습률 스케줄: constant / $1/\sqrt{t}$ / adaptive

**측정**:
- 라운드별 후회 $\text{Regret}_t$
- Pro-rata 정책과의 거리 $\|\mathbf{h}_t - \mathbf{h}^{\text{pro-rata}}\|_2$
- Loss 곡선의 1차·2차 미분 — 위상 전이 탐지

**예상 관찰**:
- ADL 이벤트가 드문 환경(낮은 shock_freq)에서 학습이 느리다가 임계 이벤트 수를 넘으면 급속 수렴
- 이것이 Grokking의 패턴과 통계적으로 구별되는지 확인 — "점진 수렴 vs. 위상 전이"

**Grokking 논문 연결**:
- Power et al. (2022): 모듈 산술에서 Grokking. 본 실험의 ADL 버전은 "청산 산술"
- Nanda et al. (2023): Fourier 회로 분석 — ADL 정책의 유사 구조 탐색

**소요 자원**: Python 200줄 미만, CPU로 충분, 하루 내 결과

---

## 아이디어 2: HyperReplay 데이터로 g*-가중 vs 큐 방식 실증 재현

### 동기

논문의 "28× 과잉 사회화" 주장은 HyperReplay 블록체인 데이터로 검증됐다. 그러나 Point estimate만 보고하고 분산/신뢰구간이 없다. 또한 단일 극단 이벤트(Oct 10 2025)만 사용해 일반화 문제가 있다.

### 실험 설계

**데이터 접근**:
```bash
# 논문 공개 코드 (공개됨)
git clone https://github.com/pluriholonomic/autodeleveraging-analysis
cd autodeleveraging-analysis
pip install -r requirements.txt
python replay.py --event 2025-10-10  # Oct 10 이벤트
python replay.py --all-events        # 모든 ADL 이벤트
```

**분석 1: 28× 과잉의 분포**
- 단일 숫자(28×) 대신 모든 ADL 이벤트에서 과잉 배수 계산
- 분포 시각화: 히스토그램, 박스플롯, 꼬리 특성
- "28×는 극단값인가, 평균값인가" 질문에 답

**분석 2: g*-가중 효과의 민감도**
- $g(\ell) = \ell^\alpha$로 매개변수화하여 $\alpha \in [0, 2]$ 범위에서 sweeping
- $\alpha = 0$: 균등 배분, $\alpha = 1$: 선형(pro-rata), $\alpha = 2$: 제곱 가중
- 각 $\alpha$에서 총 부족액, PTSR, 과잉 사회화 계산
- 최적 $\alpha^*$가 이론 $g^*$와 일치하는지 확인

**분석 3: 일상 ADL 이벤트 일반화**
- Oct 10 외의 소규모 ADL 이벤트(Hyperliquid 공개 기록 전체)에서 동일 분석
- "작은 이벤트에서 큐와 pro-rata의 차이는 얼마인가?"

**출력**:
```
| 메커니즘 | 평균 과잉 | 95th 과잉 | 평균 PTSR |
|---------|---------|---------|---------|
| 큐      | 28.3×   | 84.7×   | 0.12    |
| Pro-rata| 1.0×    | 1.0×    | 0.67    |
| g*(α=1.2)| 1.0×  | 1.0×    | 0.78    |
```

**소요 자원**: 공개 코드 + 공개 데이터 (비용 없음), 3-5일 작업

**Grokking 논문 연결**: 소규모 vs. 대규모 ADL 이벤트의 차이가 "정규 체제 vs. 극단 체제" 이분법으로 나타나면 Grokking의 두 체제(암기/일반화)와 유추 가능.

**AETHER 연결**: ADL 과잉 사회화 지표($\text{Overshoot}_t / D_t$)를 BTC 가격 충격의 선행 지표로 추가.

---

## 이 절의 핵심 한 문장

**아이디어 2가 더 즉각적으로 실행 가능하다 — 공개 코드와 데이터가 있고, 일주일 내 "28× 주장의 분포적 검증"이라는 독립적인 기여를 낼 수 있다.**
