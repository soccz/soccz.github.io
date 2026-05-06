# 05d — 방법론: Logit Lens·Causal Tracing 구체 적용

> **이 파일은 [05_method_c_circuits.md](05_method_c_circuits.md)에서 이어집니다.** 배경 사다리: ① "어텐션(attention)"이 각 토큰이 다른 토큰에 얼마나 "주목"하는지를 가중치로 표현하는 트랜스포머의 핵심 연산임, ② "intervention(개입)"이 실험에서 특정 변수를 인위적으로 바꿔 인과 효과를 측정하는 방법임을 알면 된다.

---

## Logit Lens: 레이어별 "현재 예측" 스냅샷

### 기법 설명

일반 트랜스포머에서 예측은 마지막 레이어 $L$에서만 이루어진다. 그런데 각 중간 레이어 $l$의 hidden state $\mathbf{h}^{(l)}$에 unembedding matrix $W_U$를 직접 적용하면 "이 레이어의 현재 상태로 예측한다면?"을 볼 수 있다.

$$P^{(l)}_\text{logit lens}(\text{token}) = \text{softmax}\bigl(W_U \cdot \mathbf{h}^{(l)}\bigr)$$

- **기호 뜻**: $W_U \in \mathbb{R}^{|V| \times d}$는 토큰 수($|V|$) × hidden dimension($d$) 행렬, $\mathbf{h}^{(l)} \in \mathbb{R}^d$는 특정 위치의 레이어 $l$ 표현.
- **일상 비유**: 요리 중간에 맛을 보는 것. 마지막 완성 전에 각 단계에서 "지금 이대로면 어떤 맛이 나나?"를 확인.
- **왜 이 형태**: 마지막 레이어에서만 예측하는 것보다 훨씬 더 세밀한 정보 흐름 추적이 가능.
- **조심할 점**: 초기 레이어에선 representation이 unembedding matrix와 정렬이 안 돼 있어 logit lens 값이 무의미할 수 있다. 주로 중간~후반 레이어에서 의미 있다.

### Composition에서 Logit Lens가 보여주는 것

**Grokking 이전 (amortized memorization 단계)**:
- 레이어 1~4: "민준이" 위치의 logit lens → 다른 토큰이 높음 (second hop 정보 없음)
- 레이어 5~8: "스니커즈" 확률이 낮음 → $\mathcal{C}_\text{mem}$이 직접 매핑을 하므로 중간 hop 없이 바로 최종 답을 last layer에서 꺼냄

**Grokking 이후 ($\mathcal{C}_\text{gen}$ 형성)**:
- 레이어 3~4: "민준이" 위치에서 "농구"의 확률이 급상승 (= first hop 결과 형성)
- 레이어 6~8: "스니커즈"의 확률이 점진적으로 상승 (= second hop 수행)

이 변화가 grokking의 "내부 사건"이다: 상위 레이어에 second hop을 수행하는 회로가 새로 형성된다.

**OOD 엔티티에서**:
- 레이어 3~4: "OOD 민준이" 위치에서 first hop 결과("농구") 형성 → 정상
- 레이어 6~8: second hop 답("스니커즈") 확률이 여전히 낮음 → 상위 레이어에 이 엔티티에 대한 second hop 경로가 없음

이것이 OOD 실패의 레이어 수준 증거다.

---

## Causal Tracing: "어느 레이어가 정보를 운반하는가"

### 기법 설명

세 단계로 구성된다:

**단계 1 — Clean run**: 정상 입력 $(e_1, r_1 \circ r_2, ?)$로 모델 실행. 올바른 답 $e_3$에 대한 확률 $P_\text{clean}[e_3]$ 기록.

**단계 2 — Corrupted run**: 입력 $e_1$을 랜덤 노이즈로 교체한 $(\tilde{e}_1, r_1 \circ r_2, ?)$로 실행. 모든 레이어의 hidden state 저장. 당연히 $P_\text{corrupt}[e_3] \ll P_\text{clean}[e_3]$.

**단계 3 — Patched run**: corrupted 입력을 사용하되, 특정 레이어 $l$, 위치 $p$의 hidden state만 clean run의 것으로 교체. 복원 후 확률 $P_\text{patch}[e_3]$ 기록.

$$\text{Causal Effect}(l, p) = P_\text{patch}[e_3] - P_\text{corrupt}[e_3]$$

- **기호 뜻**: Effect가 클수록 레이어 $l$, 위치 $p$가 정답 정보를 운반하는 데 중요함.
- **일상 비유**: 공장 생산라인에서 각 공정 하나씩 "정상 부품"으로 교체해보면서, 어느 공정이 불량 제품의 원인인지 찾는 것.
- **왜 이 형태**: 단순 sensitivity 분석(gradient)은 "이 변수가 출력에 얼마나 영향을 주는가"를 측정하지만, causal tracing은 "이 변수가 실제로 정보를 전달하는가"를 인과적으로 측정한다.
- **조심할 점**: Patching이 모든 레이어에서 의미 있는 것은 아니다. 두 run에서 표현 공간이 달라 패치가 자연스럽지 않을 수 있다.

### Composition에서 Causal Tracing이 밝혀낸 것

**주요 발견**: First hop ($e_1$) 토큰의 정보는 중간 레이어(대략 레이어 3~5)에서 가장 결정적인 인과 효과를 보인다. 이는 "first hop 결과가 이 구간에서 형성되고 상위 레이어로 전달된다"는 logit lens 관찰과 일치한다.

**Relation token의 역할**: $r_1, r_2$에 해당하는 토큰도 특정 레이어에서 causal effect를 보인다. 이는 "어떤 관계를 탐색할지" 정보가 특정 레이어에서 처리됨을 시사한다.

**OOD 실패의 인과 추적**: OOD 엔티티에 대해 causal tracing을 해보면, 상위 레이어에서 second hop에 해당하는 레이어/위치의 causal effect가 거의 0에 가깝다 — 해당 회로가 아예 없음을 확인.

---

## Parameter Sharing 실험의 설계

비순환 구조 한계 극복을 위한 실험:

```
일반 트랜스포머:        [L1] → [L2] → [L3] → [L4] → [L5] → [L6] → [L7] → [L8]
                        (각각 독립 가중치 θ_1, ..., θ_8)

Parameter sharing:      [L_φ] → [L_φ] → [L_φ] → ... → [L_φ]
                        (모든 레이어가 동일 가중치 θ_φ 공유)
```

Parameter sharing에서 모델은 동일한 "레이어"를 여러 번 통과한다. 이 과정에서 레이어가 이전 pass에서 얻은 정보를 "기억"하는 효과가 생긴다 (표현적으로, 순환 신경망과 유사한 역할).

**Logit lens 관찰 (parameter sharing 모델)**: OOD 엔티티에 대해서도 "마지막 몇 pass"에서 second hop 정보가 점진적으로 형성됨. 비공유 모델에선 이 현상이 없음.

---

## 분석 도구 요약 비교

| 도구 | 질문 | 한계 |
|------|------|------|
| **Logit lens** | "언제(어느 레이어에서) 정답이 나타나는가?" | 초기 레이어 해석 불안정 |
| **Causal tracing** | "어느 레이어/위치가 정보를 전달하는가?" | Patching이 non-linear 상호작용 무시 |
| **Weight norm tracking** | "$\mathcal{C}_\text{mem}$ vs $\mathcal{C}_\text{gen}$ 경쟁이 언제 전환되는가?" | 간접 증거, 직접 회로 분리 아님 |

**→ 실험 설계와 결과 해석은 [06_experiments.md](06_experiments.md)에서 계속.**
