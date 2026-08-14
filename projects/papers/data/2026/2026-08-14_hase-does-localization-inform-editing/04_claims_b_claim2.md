# 3. 핵심 Claim 해체 (2) — 문제를 바꿔 끼워도 상관은 거의 살아나지 않는다

> **배경 사다리**: Claim 1이 "관계가 없다"였다면, 여기서는 **"혹시 우리가 관계를 볼 수 없는 방식으로 질문한 건 아닌가?"** 를 저자들이 스스로 검사한다. 통계에서 이런 걸 **정렬(alignment) 점검**이라 부른다 — 두 측정이 서로 다른 대상을 재고 있다면, 대상을 맞춰 준 뒤 다시 재 봐야 공정하다.

---

## Claim 2

### 주장 (한 문장)

**표준 편집 문제(Error Injection)를 Causal Tracing 쪽으로 최대한 정렬시킨 네 가지 변종을 만들어도, tracing effect가 편집 성공에 추가로 기여하는 설명력은 최대 약 3%p에 그친다.**

### 왜 이 검사가 필요했나

Causal Tracing과 표준 편집은 **입력도 다르고 목표도 다르다**.

- Causal Tracing: 주어에 **잡음이 섞인 입력** $s_{noise}$ 위에서, **원래 정답** $o_{true}$의 확률 회복을 잰다.
- Error Injection(표준 ROME 평가): **깨끗한 입력** $s$ 위에서, **새로운 거짓 답** $o_{false}$의 확률 상승을 잰다.

입력도 다르고(잡음 vs 깨끗) 대상 출력도 다르다(정답 vs 거짓답). 두 측정이 무관하게 나오는 게 오히려 당연할 수 있다. 그래서 저자들은 **정렬 축을 하나씩 맞춰 가는 변종**을 설계한다.

### 증거 — 변종 5종 (§5.1 + Figure 5)

Figure 5 캡션 verbatim: *"Depiction of editing problem variants. Rather than inject a new false fact into a model (Error Injection), we consider injecting the output obtained from noising the subject entity (Tracing Reversal), erasing a stored fact (Fact Erasure), amplifying a stored fact (Fact Amplification), or forcing a known fact onto the same kind of noisy input as used in Causal Tracing (Fact Forcing)."*

각 변종의 정의 (§5.1 verbatim):

| 변종 | 원문 정의 | 무엇을 맞췄나 |
|---|---|---|
| **Error Injection** | *"the editing problem considered in Sec. 4, the objective being to maximize $p_\theta(o_{false}\mid s,r)$"* | 기준선 (아무것도 안 맞춤) |
| **Tracing Reversal** | *"We maximize $p_\theta(o_{noise}\mid s,r)$, aiming to change the model output from $o_{true}$ back to the output for the 'original' noised input"* | **목표 출력**을 잡음 입력의 출력으로 |
| **Fact Erasure** | *"we consider erasing a fact by minimizing $p_\theta(o_{true}\mid s,r)$"* | **대상 사실**을 정답으로 |
| **Fact Amplification** | *"We reinforce known facts in the model by maximizing $p_\theta(o_{true}\mid s,r)$"* | **대상 사실**을 정답으로(방향 반대) |
| **Fact Forcing** | *"we force the model to output $o_{true}$ for this input by maximizing $p_\theta(o_{true}\mid s_{noise},r)$"* | **입력·출력 둘 다** Causal Tracing과 동일 |

**Fact Forcing이 이 설계의 정점이다.** 입력은 Causal Tracing이 쓰는 바로 그 잡음 입력 $s_{noise}$, 목표는 Causal Tracing이 회복시키려는 바로 그 $o_{true}$. **두 측정이 문자 그대로 같은 것을 겨냥하게 만든 조건**이다. 여기서도 관계가 없다면, 변명의 여지가 없다.

### 결과 (§5.3 + Table 3 + Figure 6)

§5.3 verbatim: *"We see the strongest positive relationship between edit success and tracing effects for Fact Forcing with finetuning methods. Here, we find that tracing effects explain an additional 3% of the variance in edit success (up from 1.5% for other experiments)."*

Figure 6 캡션 verbatim: *"Tracing effects are very weakly predictive of edit success across editing problems and methods. Relative to the R² of a regression predicting rewrite score based on the edit layer (blue), a regression with edit layer and tracing effects (orange) improves the R² by at most .03 points (bolded)."*

Table 3(rewrite score 예측)에서 Fact Forcing 행만 뽑으면:

| 편집 문제 | 방법 | Layer | Tracing Effect | Both | Diff |
|---|---|---|---|---|---|
| Fact Forcing | FT (1 layer) | .697 | .104 | .724 | **.027** |
| Fact Forcing | FT (5 layers) | .634 | .10 | .666 | **.032** |
| Fact Forcing | ROME (1 layer) | .422 | .004 | .425 | **.003** |
| Fact Forcing | MEMIT (5 layers) | .345 | .041 | .354 | **.009** |

읽는 법 세 가지:
1. **가장 큰 개선폭이 .032** — 전체 변종·전체 방법 통틀어 최댓값이며, Figure 6 캡션의 "at most .03 points"와 정확히 일치한다.
2. **개선은 finetuning에서만 나온다.** ROME은 .003, MEMIT은 .009로 여전히 무의미한 수준이다. 정작 Causal Tracing과 한 세트로 제안됐던 ROME이 가장 관계가 약하다.
3. **동시에 Layer의 설명력도 떨어졌다** (.947 → .42~.70). Fact Forcing은 그 자체로 더 어려운 문제라 층 효과도 약해진다. 즉 tracing effect의 상대적 비중이 커 보이는 것에는 **분모가 작아진 효과**가 섞여 있다.

§5 마지막 문장 verbatim: *"Yet, tracing effects are still weakly informative of Fact Forcing editing if they explain only 3% of the variance in edit success."*

### 숨은 전제

1. **"3%면 무시할 만하다"는 판단은 저자의 규범적 선택이다.** 통계적으로는 $p \ll 10^{-4}$로 유의하다(Table 3). 저자들은 **유의성이 아니라 효과 크기**로 판정한다 — 방법론적으로 옳은 선택이지만, "국소화가 조금은 정보를 준다"는 반대 해석도 같은 표에서 읽어낼 수 있다.
2. **네 변종이 정렬 공간을 다 덮는다는 가정.** 입력 축(깨끗/잡음)과 출력 축(정답/거짓답/잡음답)의 조합 중 저자들이 고른 다섯 개가 전부는 아니다.
3. **Fact Forcing에서 상관이 올라간 이유가 "국소화가 맞아서"라는 보장이 없다.** 잡음 입력을 공유하기 때문에 **두 측정이 같은 잡음 실현(noise realization)에 함께 반응**했을 가능성이 있다. 즉 공통 원인(잡음의 우연한 세기)이 만든 상관일 수 있다.

### 쉬운 말 풀이

의사가 "이 통증은 무릎에서 온다"고 진단했는데, 무릎을 치료해도 안 낫는다. 그래서 이렇게 반박할 수 있다. *"진단은 서 있을 때 아픈 걸 봤고, 치료는 누워서 했잖아. 조건이 달라서 그렇지."*

저자들은 그 반박을 받아들여, **진단할 때와 완전히 똑같은 자세(서 있는 상태)에서 치료**를 다시 해 봤다(= Fact Forcing). 그랬더니 이번엔 진단이 조금 맞았다 — **딱 3%만큼.** 나머지 97%는 여전히 "무릎이냐 발목이냐"가 아니라 "**어느 부위를 골라 치료했느냐**"가 결정했다.
