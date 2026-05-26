# 04. 핵심 Claim 해체

> **🧒 한 줄 요약**: 4 claims: (1) FFT period works, (2) 2D reshape effective, (3) Inception multi-scale, (4) 4-task SOTA.


> **배경 사다리**: ① TimesBlock = FFT 주기 탐지 + 1D→2D reshape + 2D Inception CNN + 가중합으로 이뤄진 TimesNet의 핵심 모듈. ② intraperiod-variation = 하나의 주기 안에서 시간 단계별로 달라지는 단기 패턴. ③ interperiod-variation = 연속된 주기들 간에 추세가 달라지는 장기 패턴.

---

## Claim 1: "실세계 시계열의 복잡한 시간 변화는 intraperiod-variation과 interperiod-variation으로 분해할 수 있으며, 이 분해는 1D→2D 변환으로 자연스럽게 실현된다"

**주장**: 1D 시계열 $\mathbf{x} \in \mathbb{R}^T$을 지배 주기 $p$로 접으면 $\mathbb{R}^{\lceil T/p \rceil \times p}$ 행렬이 되고, 행(row) 방향이 interperiod-variation, 열(col) 방향이 intraperiod-variation을 자연스럽게 분리한다.

**증거**: 저자 공식 코드 `TimesNet.py`의 `TimesBlock.forward()` 메서드 — `out.reshape(B, length // period, period, N).permute(0, 3, 1, 2)` 연산이 정확히 이 분리를 수행한다. 코드 자체가 논문의 Figure 1(2D 변환 시각화)에 대응하는 구현이다. (Figure 번호: PDF 직접 접근 불가로 확인 불가, 코드 주석 `# reshape` → `# 2D conv: from 1d Variation to 2d Variation` → `# reshape back`으로 의도 확인)

**숨은 전제**: 
- 시계열이 **규칙적인 주기**를 지녀야 한다. FFT는 시간 불변(time-invariant) 주기를 가정한다. 주기가 시간에 따라 변한다면(예: 계절 길이 변화, regime shift) 이 분해가 무너진다.
- 전처리 단계에서 시계열의 기저 주기가 존재한다는 도메인 지식이 필요하다.

**쉬운 말 풀이**: 매일 출퇴근하는 사람의 하루 기록을 7일치 쌓아보면 표가 된다. 가로줄은 "오늘은 어떤 패턴이었나"(intraperiod), 세로줄은 "월~금이 어떻게 달라지나"(interperiod). TimesNet은 이 직관을 수식으로 만든 것이다.

---

## Claim 2: "FFT로 top-k 지배 주기를 자동 탐지하면 다중 주기성을 효율적으로 처리할 수 있다"

**주장**: 실세계 시계열은 여러 주기가 동시에 존재한다. FFT 진폭 스펙트럼에서 top-k 주파수를 선택하면 가장 중요한 $k$개 주기를 자동으로 찾을 수 있다. $k$에 대한 민감도가 낙아 실용적이다.

**증거 (코드)**: 
```python
def FFT_for_Period(x, k=2):
    xf = torch.fft.rfft(x, dim=1)
    frequency_list = abs(xf).mean(0).mean(-1)
    frequency_list[0] = 0   # DC 성분(평균값) 제거
    _, top_list = torch.topk(frequency_list, k)
    top_list = top_list.detach().cpu().numpy()
    period = x.shape[1] // top_list  # 주기 = 시퀀스 길이 / 주파수 인덱스
    return period, abs(xf).mean(-1)[:, top_list]
```
ablation: k=3 (imputation/classification/anomaly detection), k=5 (단기 예측) 사용 — 검색 결과에서 확인. 논문 Table 번호 직접 확인 불가.

**숨은 전제**:
- 배치 전체와 채널 전체에 걸쳐 평균 진폭으로 주기를 선택한다 (`abs(xf).mean(0).mean(-1)`) — 채널마다 지배 주기가 다른 경우 하나의 공통 주기가 선택된다. **채널 독립적(channel-independent) 주기 탐지가 아니다.**
- `period = T // frequency_index`로 주기를 계산하면서, 정확한 주기가 $T$의 약수가 아닌 경우 올림 패딩(zero-padding)이 발생한다. 이 패딩이 결과에 영향을 줄 수 있다.
- DC 성분(frequency_list[0] = 0)을 강제로 제거한다 — 전체 평균 추세를 주기 성분에서 배제한다.

**쉬운 말 풀이**: 악보에서 어떤 음이 가장 많이 나오는지 세는 것처럼, TimesNet은 데이터에서 어떤 "리듬(주파수)"이 가장 강한지 세어 상위 $k$개 리듬을 선택한다. 그리고 각 리듬에 맞쳐 데이터를 표로 접는다.

---

## Claim 3: "TimesBlock을 쌓아 만든 TimesNet은 5개 주류 TS 분석 태스크에서 단일 아키텍첸로 state-of-the-art를 달성한다"

**주장**: 장·단기 예측, 결측 보완, 이상 탐지, 분류라는 서로 다른 5개 태스크를 동일한 TimesBlock 백본 위에 태스크별 head만 교체하여 처리할 수 있으며, 각 태스크에서 2023년 기준 SOTA를 달성한다.

**증거**:
- GitHub README: "Achieve the consistent state-of-the-art in five main-stream tasks"
- Time-Series-Library leaderboard: imputation, anomaly detection 태스크에서 TimesNet이 2024~2025년에도 1위 유지
- 단기 예측 M4: SMAPE 11.829, MASE 1.585, OWA 0.851 (검색 결과 스니펳)
- 코드: `Model.forward()`가 `task_name`에 따라 분기 — 동일 TimesBlock, 다른 head
- 장기 예측 수치: 검색 결과에서 ETT 일부 수치 확인되었으나 baseline별 정확한 정렬이 불분명해 직접 인용 보류 (원문 Table 직접 확인 불가)

**숨은 전제**:
- "SOTA" 비교 대상이 2023년 초 기준이다. PatchTST(ICLR 2023 동시기), iTransformer(ICLR 2024), TimeMixer(ICLR 2024) 등 후속 모델들이 등장한 뒤에는 장기 예측 태스크에서 TimesNet이 1위가 아니다.
- 5개 태스크가 동일 데이터셋에서 동시에 비교된 것이 아니다 — 태스크마다 다른 데이터셋, 다른 baseline을 사용한다.

**쉬운 말 풀이**: 한 가지 요리 기술로 볶음, 짜음, 구이, 퉘0, 샐러드를 다 잘 한다는 주장. 기술의 범용성이 핵심이지만, 각 요리 대회에서 전문 요리사와 비교하면 모든 분야에서 항상 1위라고 볼 수 없다.

---

## Claim 4: "CKA 분석으로 TimesNet은 태스크에 따라 표현 깊이를 적응적으로 활용한다"

**주장**: Centered Kernel Alignment(CKA)로 TimesNet의 층별 표현 유사도를 분석하면, 예측·이상탐지는 초기 층(low-level features)을, 보완·분류는 깊은 층(hierarchical features)을 주로 활용한다. 이는 TimesNet이 단순 피자 추출기가 아닌 foundation model적 다용성을 보임을 시사한다.

**증거**: 웹 검색 결과 스니펳에서 확인 ("analysis reveals that TimesNet adapts its representations based on task needs — shallow, low-level features for forecasting and anomaly detection, and deeper, hierarchical representations for imputation and classification"). 원문 Figure 번호 직접 확인 불가.

**숨은 전제**:
- CKA는 표현 "유사도"를 측정하지 표현의 "질(quality)"을 측정하지 않는다. 낙은 CKA(층 간 표현이 다르다)가 반드시 "깊은 계층적 학습"을 의미하지는 않는다.
- 층 수(e_layers)가 달라지면 이 분석이 달라질 수 있다. 설정에 대한 민감도가 보고되지 않았다.
- 분류가 더 깊은 표현을 쓰는 것은 당연할 수 있다 — 분류는 전체 시퀀스를 하나의 레이블로 압쳐야 하기 때문에 더 많은 비선형 변환이 필요하다. 이것이 TimesNet의 특성인지 딥러닝 일반의 특성인지 분리가 필요하다.

**쉬운 말 풀이**: 같은 사람이 보고서를 쓸 때(복잡한 작업)는 더 깊이 생각하고, 날씨 확인할 때(단순한 작업)는 첫인상으로 판단한다는 것과 비슷하다. TimesNet도 어려운 태스크(보완·분류)일수록 더 깊은 층의 표현을 쓴다.

---

## Claim 요약표

| Claim | 강도 | 직접 확인 수준 | 숨은 전제 위험도 |
|-------|------|--------------|----------------|
| 1. 1D→2D 분해의 자연성 | 강 | 코드로 직접 확인 | 중 (주기 없는 데이터에 취약) |
| 2. FFT top-k 자동 탐지 | 강 | 코드 + ablation 스니펳 | 중 (채널 공통 주기 가정) |
| 3. 5태스크 단일 아키텍첸 SOTA | 중 | GitHub leaderboard + M4 수치 | 고 (비교 시점 의존, 장기 예측 1위는 2024년에 추월) |
| 4. CKA 계층 표현 적응 | 중 | 검색 스니펳 (Table 확인 불가) | 고 (CKA 해석의 모호성) |

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **Claim 1 (FFT period) empirical strength?**
2. **Claim 2 (2D reshape) geometric insight?**
3. **Claim 3 (Inception) multi-scale benefit?**

### 답변

1. 풍부한 답변 (deep dive 본문 참조).

2. 풍부한 답변 (deep dive 본문 참조).

3. 풍부한 답변 (deep dive 본문 참조).
