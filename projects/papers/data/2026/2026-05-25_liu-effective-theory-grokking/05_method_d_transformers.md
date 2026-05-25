# 4d. 방법론 — 트랜스포머 실험 (§4)

> **배경 사다리**: ① "트랜스포머"(Transformer)는 자기 주의(self-attention) 메커니즘을 기반으로 한 뉴럴 네트워크 구조 — 입력 토큰들 사이의 관계를 동적으로 계산함. ② Power et al. (2022)이 grokking을 처음 보고한 세팅이 바로 transformer + modular arithmetic. ③ MLP와 transformer는 같은 과제를 다른 메커니즘으로 풀 수 있으며, 이 차이가 grokking의 양상에도 영향을 줄 수 있음.

---

## 이 부분이 왜 필요한가

Grokking이 처음 발견된 무대는 MLP가 아니라 transformer였다(Power et al. 2022). §3에서 MLP로 위상 다이어그램을 구축했지만, 원래 세팅인 transformer에서도 같은 프레임워크가 유효한지 확인해야 설명의 보편성이 확보된다. 또한, transformer에서 grokking이 MLP보다 더 극적(지연이 더 길고 전이가 더 갑작스러움)인 이유를 위상 다이어그램의 기하학으로 설명할 수 있는지가 관건.

---

## 실험 세팅

- **과제**: $\mathbb{Z}_{97}$ 위의 모듈러 덧셈 ($a + b \bmod 97$). Power et al. (2022)과 동일.
- **모델**: 소형 transformer. 입력: 두 토큰 $a, b$ (+ 연산 기호 토큰). 임베딩 → multi-head self-attention → feedforward → 출력.
- **제어 변수**: §3과 동일하게 ($\alpha$, $\lambda$) 공간을 스캔.
- **비교 대상**: 같은 과제에 대한 MLP 결과 (§3).

---

## 핵심 관찰

### 관찰 1: 4-위상 구조는 transformer에서도 재현

Transformer의 $(\alpha, \lambda)$ 위상 다이어그램에서도 comprehension, grokking, memorization, confusion 4개 위상이 관찰된다. 위상의 질적 배치(좌하단 memorization, 우하단 comprehension, 좌상단 confusion, 중간 대역 grokking)는 MLP와 동일.

### 관찰 2: Grokking zone이 memorization에 더 밀착

MLP 대비, transformer의 grokking zone이 위상 다이어그램에서 memorization 쪽으로 더 가까이 이동해 있다. 즉, grokking이 일어나는 $(\alpha, \lambda)$ 영역이 memorization과의 경계에 더 밀착.

이것이 의미하는 바:
- Memorization → grokking 전이에서, 네트워크가 넘어야 할 "에너지 장벽"이 더 높거나, 전이가 더 느린 모드로 진행.
- 결과적으로 transformer의 grokking에서 지연이 더 극적(수만~수십만 스텝)으로 나타남.

### 관찰 3: 표현 구조의 출현 타이밍

Transformer에서도 grokking 시점에 임베딩의 구조화가 관찰됨(원형 배치 출현). 하지만 이 구조화가 MLP보다 더 늦게 시작하며, 시작된 후에도 더 느리게 완성됨.

---

## MLP와의 비교 해석

| 차원 | MLP | Transformer |
|------|-----|------------|
| 일반화 전략 | 임베딩 구조화에 직접 의존 | 임베딩 + attention 패턴 + feedforward 회로의 복합 |
| 자유도 | 임베딩 파라미터가 지배적 | attention weights, FFN weights 등 추가 자유도 |
| 암기 용량 | 상대적으로 작음 | 상대적으로 큼 (attention이 입력-의존 가중치를 형성) |
| Grokking 지연 | 짧음 | 긺 |

**논문의 해석**: Transformer의 더 큰 암기 용량(특히 attention 메커니즘이 제공하는 유연성) 때문에, memorization 해의 에너지 최솟값이 더 깊다. 따라서 weight decay가 이 깊은 최솟값에서 네트워크를 빼내는 데 더 오래 걸린다.

이 해석은 직관적으로 매력적이지만, **정량적 검증이 없다**. 즉, "transformer의 memorization 최솟값이 MLP보다 더 깊다"는 주장을 loss landscape를 직접 분석하여 확인하지는 않았다 — 위상 다이어그램의 기하학적 관찰에서 간접적으로 추론한 것.

---

## 대안 분석과의 비교

이 섹션의 결과는 Nanda et al. (2023, ICLR)의 분석과 상보적이다:

- **Nanda (2023)**: Transformer 내부에서 Fourier 기반 회로가 형성됨을 mechanistic interpretability로 관찰. "무엇이 일어나는가"에 초점.
- **Liu (2022, 본 논문)**: 같은 현상을 위상 다이어그램의 관점에서 "어떤 조건에서 일어나는가"로 매핑. "언제/왜"에 초점.

두 분석을 결합하면: Nanda의 Fourier 회로는 Liu의 구조화 임베딩의 하류 결과(downstream consequence)로 이해 가능하다. 임베딩이 원형 구조를 형성하면, 이 구조를 이용하는 Fourier 회로가 자연스럽게 출현.

---

## 이 섹션의 한계

1. **단일 과제**: Transformer 실험은 $\mathbb{Z}_{97}$ 모듈러 덧셈에 국한. 다른 알고리즘적 과제나 자연어/시계열에서의 검증 없음.
2. **소형 모델**: 실험에 사용된 transformer는 1~2층 수준의 소형. 대규모 모델에서 같은 4-위상 구조가 유지되는지 미확인.
3. **인과 방향 미확인**: "임베딩 구조화 → 일반화"가 인과 관계인지, 아니면 제3의 요인(예: 특정 weight 구조)이 둘 다의 공통 원인인지를 causal intervention으로 검증하지 않음.
