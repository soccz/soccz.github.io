# 06 — 실험 해부

> **배경 사다리**: 이 섹션을 이해하려면 ① "베이스라인"이 비교 대상이 되는 기존 방법임, ② "정확도(accuracy)"가 모델이 맞힌 비율임, ③ "ablation"이 특정 요소 하나를 제거했을 때 성능 변화를 보는 실험임을 알면 된다.

---

## 데이터셋

### 합성 Knowledge Graph (주 데이터)

**왜 이 데이터인가**: 완전한 통제 가능성. 어떤 사실이 원자적이고 어떤 것이 추론됐는지 100% 알 수 있다. 실제 LLM 사전학습 데이터에 이미 답이 있을 오염(contamination) 가능성이 없다.

구성:
- 엔티티 수 $|\mathcal{E}|$: 수천~수만 (정확한 수치는 논문 Table 참조)
- 관계 수 $|\mathcal{R}|$: 수십
- 원자 사실 수: $|\mathcal{E}| \times |\mathcal{R}|$ 규모
- 추론된 사실: $\phi \times |\text{atomic}|$ (φ 제어)

**데이터 편향 분석**: 합성 데이터 선택 자체가 편향이다. 자연어 지식베이스에서는 관계가 균일하게 분포하지 않는다. 어떤 관계는 수백만 번 등장하고 어떤 것은 수십 번만 등장한다. 균일 합성 KG에서의 발견이 실제 불균일 데이터에 그대로 적용될지는 별도 검증이 필요하다.

### LLM 비교용 실제 데이터

GPT-4-Turbo / Gemini-1.5-Pro와 비교할 때는 더 복잡한 multi-hop reasoning 태스크(대규모 search space)를 사용. 이 태스크는 합성 KG 기반이지만 엔티티와 관계 수를 크게 늘려 LLM의 non-parametric 전략(CoT, RAG)이 실패할 수밖에 없는 조건을 만든다.

---

## 베이스라인 공정성 분석

### GPT-4-Turbo / Gemini-1.5-Pro와의 비교

**공정한가?** 엄밀히 말해 완전히 공정하지 않다. 다음 비대칭이 있다:
- Grokked 트랜스포머는 합성 KG에 **맞춤 훈련됨** (task-specific fine-tuning)
- GPT-4는 범용 모델로 zero/few-shot prompting만 사용

이 비교의 진짜 요점은 "어느 모델이 더 강한가"가 아니라, **parametric memory vs. non-parametric memory의 질적 차이**를 보여주는 것이다. 즉, "in-context 검색 기반 추론이 근본적으로 실패하는 태스크에서 parametric 학습이 유일한 해결책"임을 주장한다.

그러나 이 논리는 "GPT-4를 이 KG로 파인튜닝하면 어떨까?"라는 질문에 답하지 않는다. 이것이 논문의 숨은 공백이다.

### Weight Decay Ablation

실험 설계: $\lambda \in \{0, 0.001, 0.01, 0.1, 1.0\}$ 범위에서 grokking 발생 여부와 속도 측정.

**결과 해석**:
- $\lambda = 0$: 훈련 정확도만 최적화. Grokking이 일어나지 않거나 매우 느림. $\mathcal{C}_\text{mem}$만 형성됨.
- 중간 $\lambda$: 최적 범위. Grokking이 적정 스텝에서 발생.
- 너무 큰 $\lambda$: 모델이 수렴하지 못하거나 underfitting.

**중요**: Weight decay는 grokking의 필요 조건이 아닌 **촉매**다. Weight decay 없이도 무한히 긴 훈련으로 grokking이 일어날 수 있지만, 실용적이지 않다.

---

## 주요 표·그림 해석

### Figure 1 계열 (Grokking 학습 곡선)

훈련 정확도와 검증 정확도를 스텝에 따라 그린 그래프. 핵심 패턴:

```
정확도
 100% ┤━━━━━━━━━━━━━━━━━━━━━━━━━━━  ← 훈련 정확도 (암기로 빠르게 100%)
      │
      │         grokking!
  50% ┤              ╭━━━━━━━━━━━━  ← 검증 정확도 (grokking 이후 급상승)
      │              │
   0% ┼━━━━━━━━━━━━━━┘
      0       50만     100만 스텝
```

이 갭이 바로 "grokking 구간"이다. Overfitting 이후에도 한참을 더 훈련해야 한다.

### Composition vs Comparison OOD 정확도 표

IND/OOD 정확도를 Composition·Comparison 양쪽에서 측정:

| | Composition IND | Composition OOD | Comparison IND | Comparison OOD |
|--|--|--|--|--|
| 비-grokked | ~100% | ~0% | ~100% | ~0% |
| Grokked | ~100% | **~0% (실패)** | ~100% | **높음 (성공)** |

이 비대칭이 논문의 핵심 발견이다.

**해석**: Grokked 모델도 Composition OOD에서 여전히 실패한다. 이것은 단순히 "더 훈련하면 해결되는 문제"가 아니라 **아키텍처의 구조적 한계**임을 시사한다.

### Logit Lens 히트맵

레이어(y축) vs. 훈련 스텝(x축)로 "answer 토큰 확률"을 표시. 색이 진할수록 해당 레이어에서 정답이 높은 확률로 예측됨.

**Grokking 이전**: 마지막 레이어에서만 정답 확률이 높음. 중간 레이어는 무관.
**Grokking 이후**: 레이어 3~4에서 first hop 결과가, 레이어 6~8에서 final answer가 순차적으로 나타남 → 두 단계 회로 형성의 직접 증거.

---

## Ablation: 저자가 일부러 넣은 것 vs 숨긴 것

### 명시적으로 넣은 ablation
- Weight decay 크기 변화
- $\phi$ (inferred/atomic 비율) 변화
- 데이터 총량 변화 (φ 고정)
- Parameter sharing vs 비공유

### 숨긴/빠진 ablation
1. **모델 크기 스케일링**: GPT-2 크기에서만 실험. 더 큰 모델(예: GPT-2-medium, GPT-2-large)에서도 같은 패턴인가? 저자들은 "스케일링으로 근본 문제가 해결되지 않는다"고 주장하지만, 직접 실험은 제한적.
2. **3-hop 이상**: 2-hop Composition만 다룸. 3-hop에서는 레이어가 더 많이 필요한가? 스케일링은 어떻게 되는가?
3. **GPT-4 파인튜닝 조건**: 범용 LLM을 동일 합성 KG에 맞춤 훈련했을 때 grokking이 일어나는가? 이 실험이 빠져 있다.

---

## 재현성 평가

- **코드 공개**: GitHub (OSU-NLP-Group/GrokkedTransformer). PyTorch 1.13.1, CUDA 11.6.
- **데이터**: SharePoint 링크 또는 Jupyter 노트북으로 재생성 가능.
- **LLM 비교 데이터**: GPT-4-Turbo / Gemini 출력이 캐시됨 → 재현 가능.
- **분산 미보고 (우려)**: 메인 결과 정확도를 단일 시드로만 보고하는지, 여러 시드로 평균내는지 명확하지 않음. Grokking은 시드에 따라 발생 타이밍이 크게 달라질 수 있다.
- **구체 수치 투명성**: 논문 접근 제한으로 정확한 OOD 정확도 숫자 확인 불가(본 해체 문서의 제약). 단, 방향성(Composition OOD ≈ 0%, Comparison OOD > 80%)은 다양한 출처에서 확인됨.
