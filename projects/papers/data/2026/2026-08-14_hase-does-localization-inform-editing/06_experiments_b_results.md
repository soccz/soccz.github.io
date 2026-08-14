# 5. 실험 해부 (2) — 주요 표·그림 읽기

> **배경 사다리**: 표 읽는 법 하나만 익히면 된다. 이 논문의 모든 표는 열이 `Layer / Tracing Effect / Both / Diff / p-value`이고, **볼 곳은 `Diff` 열 하나**다. Diff = Both − Layer = "층을 이미 아는 상태에서 tracing effect가 추가로 설명한 분산 비율".

---

## 5.7 Figure 1 — 문제 제기의 전부

캡션 verbatim: *"We visualize where 652 facts known by GPT-J are stored within the model, as localized by Causal Tracing. Model editing methods like ROME and MEMIT can successfully change knowledge in LMs by editing layers 4-9. But many facts appear to be stored outside of this range, e.g. at layers 1-3 and 16-20. What about these facts?"*

**해석 1**: 이 그림은 결과가 아니라 **동기**다. 국소화 결과의 분포(넓게 퍼짐)와 편집 실무의 관행(4~9층 고정)이 **서로 맞지 않는다**는 불일치를 시각적으로 보여준다.

**해석 2**: 마지막 문장 *"What about these facts?"* 가 논문 전체의 연구 질문이다. 1~3층·16~20층에 저장된 것으로 보이는 사실들은, 국소화 논리대로라면 그 층에서 편집해야 한다. 그게 사실인지 확인하는 게 §4다.

**해석 3**: 그림 자체는 ROME 논문의 방법을 그대로 재현한 것이므로, **저자들이 Causal Tracing을 제대로 돌렸음을 보여주는 검증**의 역할도 한다. 반증 논문에서 이 단계가 빠지면 "구현을 잘못한 것 아니냐"는 반박에 취약해진다.

## 5.8 Figure 2 — 측정의 실물

캡션 verbatim: *"Visualizing Causal Tracing results over MLP layers with window size 10. Tokens with an asterisk are the noised subject tokens. Here, $p_\theta(o_{true}|s,r)=.923$ and $p_\theta(o_{true}|s_{noise},r)=.001$."*

**해석 1**: `.923 → .001`. 잡음이 사실 회상을 **거의 완전히** 파괴한다. 이 큰 간극이 있어야 "복원했을 때 얼마나 돌아오는가"를 잴 해상도가 생긴다. 손상이 약하면 tracing effect가 전부 0 근처로 뭉개진다.

**해석 2**: 별표로 표시된 잡음 주어 토큰 — Causal Tracing이 **토큰 자리 × 층**의 2차원 격자로 측정된다는 것을 보여준다. 이 논문의 회귀는 그중 **층 축으로 집약된** 값을 쓴다. 토큰 축의 정보를 버리는 이 집약이 정보 손실 지점이며, §7에서 다룰 반박의 근거가 된다.

**해석 3**: window size 10으로 그렸다고 명시한 것은 **정직성 신호**다. 본문 분석은 5를 쓰는데 그림만 10이면 독자가 오해할 수 있으므로 §4에 주석을 달았다(*"Note we use a tracing window size of 5 (smaller than the value of 10 used in Fig. 2)."*).

## 5.9 Table 1 / Table 2 — 주 결과와 그 방어

| | Layer | Tracing Effect | Both | **Diff** |
|---|---|---|---|---|
| **Table 1** (전체, $n=652$) | .947 | .016 | .948 | **.001** |
| **Table 2** (집중도 상위 10%) | .927 | .02 | .929 | **.002** |

**해석 1**: Table 1의 .947 vs .016은 **약 59배** 차이다. 국소화가 편집 지점 선택에 기여하는 바는 실무적으로 0이다.

**해석 2**: Table 2는 예상 반박("신호가 퍼져 있어서 안 보인 것")을 선제 차단한다. 캡션이 이를 명시한다: *"Even when facts appear to be stored at a small number of layers and not other layers, tracing effects are still not predictive of editing performance."* 부분표본에서 층 설명력이 .947 → .927로 살짝 떨어지는데도 tracing 기여는 .001 → .002로 거의 그대로다.

**해석 3**: Table 2의 존재 자체가 저자들의 **적대적 자기검증** 수준을 보여준다. 반증 논문이 살아남으려면 "당신이 못 본 것뿐"이라는 반론을 미리 죽여야 한다.

## 5.10 Figure 4 — 음의 상관

Figure 4는 6층에서의 rewrite score ↔ tracing effect 산점도이며, §4.3 본문이 그 값을 명시한다: *"The correlation between ROME edit success and the tracing effect at layer 6 in GPT-J is not positive but in fact slightly negative (ρ=−0.13; p<1×10⁻³)."*

**해석 1**: 6층은 ROME의 표준 편집 층이다. **ROME 서사가 가장 강해야 할 지점에서 부호가 뒤집혔다.**

**해석 2**: $\rho=-0.13$은 크지 않다. 저자들도 "slightly negative"라고 절제해서 쓴다. 여기서 "국소화는 반대로 해석해야 한다"는 과잉 결론을 끌어내면 안 된다. **정확한 결론은 "무관하다"이고, 음수는 그 무관함의 한 실현일 뿐이다.**

**해석 3**: 다만 왜 하필 음수인가는 흥미로운 미해결 질문이다. 하나의 가설 — tracing effect가 큰 사실은 모델 내부에서 **더 강하게·중복적으로 표현**돼 있어서 오히려 덮어쓰기가 어렵다는 것이다. 이 가설은 이 논문이 제기하지 않았지만 검증 가능하다(§10 아이디어 참조).

## 5.11 Table 3 + Figure 6 — 변종 전면전

Figure 6 캡션 verbatim: *"Tracing effects are very weakly predictive of edit success across editing problems and methods. Relative to the R² of a regression predicting rewrite score based on the edit layer (blue), a regression with edit layer and tracing effects (orange) improves the R² by at most .03 points (bolded)."*

Table 3 전체(rewrite score 예측) 중 읽을 가치가 있는 행들:

| 편집 문제 | 방법 | Layer | Tracing | Both | **Diff** | p |
|---|---|---|---|---|---|---|
| Error Injection | ROME (1 layer) | .947 | .016 | .948 | .001 | ≪1e-4 |
| Error Injection | MEMIT (5 layers) | .677 | .024 | .678 | .001 | 0.199 |
| Tracing Reversal | FT (1 layer) | .067 | 0 | .067 | **0** | **0.997** |
| Tracing Reversal | ROME (1 layer) | .294 | .017 | .31 | .015 | ≪1e-4 |
| Fact Erasure | ROME (1 layer) | .857 | .019 | .858 | **0** | **0.555** |
| Fact Erasure | MEMIT (5 layers) | .925 | .019 | .925 | **0** | **0.669** |
| Fact Amplification | ROME (1 layer) | .88 | .02 | .88 | **0** | **0.654** |
| Fact Forcing | FT (5 layers) | .634 | .10 | .666 | **.032** | ≪1e-4 |
| Fact Forcing | FT (1 layer) | .697 | .104 | .724 | .027 | ≪1e-4 |
| Fact Forcing | ROME (1 layer) | .422 | .004 | .425 | .003 | ≪1e-4 |

**해석 1 — 최댓값이 .032다.** 20개 행 전체에서 가장 큰 기여가 Fact Forcing × FT(5층)의 .032이고, 이는 Figure 6 캡션 "at most .03 points"와 일치한다. 즉 **가능한 모든 조합을 뒤져서 얻은 상한이 3%p**다.

**해석 2 — 유의하지도 않은 칸들이 있다.** Fact Erasure ROME($p=0.555$), Fact Erasure MEMIT($p=0.669$), Fact Amplification ROME($p=0.654$), Tracing Reversal FT-1층($p=0.997$). **"이미 저장된 사실을 지우거나 강화하는" 조건 — 즉 저장 위치가 가장 중요할 것 같은 조건 — 에서 오히려 통계적 유의성조차 없다.** 이것이 표에서 가장 아픈 부분이며, 본문보다 표를 직접 봐야 보인다.

**해석 3 — Fact Forcing에서만 살아나는데, 그 이유가 미심쩍다.** Fact Forcing은 Causal Tracing과 같은 잡음 입력을 공유한다. 관계가 살아난 것이 "국소화가 맞아서"인지 "같은 잡음에 함께 반응해서"인지 이 실험만으로 구분되지 않는다. 그리고 살아난 것은 FT 계열뿐, ROME은 .003이다.

**해석 4 — 층 설명력의 붕괴가 숨은 신호다.** Tracing Reversal FT(1층)에서 Layer $R^2$가 **.067**로 무너진다. 이는 그 조건에서 편집 자체가 거의 안 됐다는 뜻이다(설명할 분산이 층으로도 안 잡힘). 이런 칸에서 "Diff = 0"은 "국소화가 무의미"라기보다 "**실험 조건 자체가 정보를 안 준다**"로 읽어야 정확하다. 표를 기계적으로 읽으면 놓치는 지점이다.

## 5.12 Ablation — 저자가 넣은 것과 넣지 않은 것

**일부러 넣은 것**
- 부분표본 분석(Table 2) — "신호 희석" 반박 차단
- 지표 3종 전부에 대한 반복(Table 3~6) — "지표 탓" 반박 차단
- 편집기 4종 × 개입 폭 2종 — "편집기 탓" 반박 차단
- 모델 2종·데이터 2종(부록) — "설정 탓" 반박 차단

**넣지 않은 것 (그리고 그게 중요한 이유)**
- **비선형/순위 기반 분석 없음.** 증분 $R^2$는 선형 관계만 본다.
- **토큰 축 정보 미사용.** Causal Tracing은 (토큰 × 층) 격자를 주는데 회귀는 층 축만 쓴다. "주어 마지막 토큰의 tracing effect"처럼 토큰을 특정한 변수를 넣었다면 결과가 달랐을 가능성이 남는다.
- **활성 조향(activation steering) 계열 개입 부재.** Causal Tracing이 표현을 재므로 표현을 조작하는 개입과 짝지었어야 입도가 맞는다. **이 논문의 가장 큰 미탐색 영역.**
- **베이즈 요인·등가성 검정 부재.** "관계 없음"을 적극적으로 지지하는 통계가 없다.

## 5.13 부록에 숨은 신호

- **Appendix C가 "Robustness Experiments"라는 이름을 달고 있다** — 저자들이 강건성 검증에 별도 절을 배정했다는 뜻이며, 반증 논문으로서 필수적인 구성이다.
- **ZSRE·GPT2-XL 재현이 본문이 아니라 부록에 있다.** 결론 일반성의 핵심 근거인데 부록으로 밀린 것은 지면 제약 탓으로 보이나, **인용하는 쪽에서는 "GPT-J·CounterFact 하나만 본 논문"으로 과소평가하기 쉽다.** 인용 시 부록 근거를 함께 언급해야 정확하다.
- **Fact Erasure의 $n=489$** — 본문 표에서 이 조건만 표본이 다르다. 표 간 직접 비교 시 주의해야 하는데 본문은 이를 강조하지 않는다.

## 5.14 수치 투명성

본 해체에서 인용한 모든 수치는 원문 Table 1·2·3, Figure 2·6 캡션, §4.3·§5.3 본문에서 확인한 값이다. 다음은 **원문에서 확인하지 못해 옮기지 않았다**:
- Table 4·5·6(paraphrase/neighborhood/overall)의 개별 셀 값 — 표의 존재와 캡션만 확인.
- ZSRE·GPT2-XL 부록 실험의 정확한 $R^2$ 수치 — 질적 서술만 확인.
- Appendix A의 하이퍼파라미터 세부값.
- Causal Tracing 정의의 **식 번호** — 절 번호(§3.2)만 확인, 번호 단정 금지 원칙에 따라 식 번호 미표기.
