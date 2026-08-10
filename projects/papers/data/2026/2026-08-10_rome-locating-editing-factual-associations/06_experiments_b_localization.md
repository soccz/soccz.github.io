# 5-B. 실험 해부 — 국소화 교차검증

> **배경 사다리**: ① 이 절의 실험들은 "성능이 좋다"를 보이려는 게 아니라 **"§2의 위치 주장이 맞다"** 를 검정하려는 것이다. ② 좋은 검정은 가설이 **틀렸다면 다른 결과가 나왔어야 하는** 실험이다. ③ 그래서 여기서는 "잘 되는 조건"만큼 **"안 되는 조건"** 이 중요하다.

---

## 실험 1 — layer × token 전수 스윕 (§3.4, Figure 5)

**설계.** ROME을 GPT-2 XL의 **모든 (층, 토큰) 조합**에 적용하고, 각 조합에서 네 가지 지표(일반화 3개 + 특이성 1개)를 잰다. Figure 5 캡션: "The target token is determined by selecting the token index $i$ where the key representation is collected (**Eqn. 3**)."

**결과 (§3.4 본문).** "rewrites are most successful at the **last subject token**, where both specificity and generalization peak at **middle layers**. Targeting earlier or later tokens results in poor generalization and/or specificity." 구체적으로 "**generalization peaking at the 18th layer**"이며, 이는 인과추적이 지목한 early site의 중간 층과 부합한다.

**왜 이게 논문에서 가장 중요한 실험인가.** 반증 가능성이 살아 있는 유일한 실험이기 때문이다. 만약 사실이 **어디에나** 저장돼 있다면 편집 성능 지도가 평평했을 것이다. 만약 **다른 곳**에 저장돼 있다면 봉우리가 다른 좌표에 섰을 것이다. 두 경우 모두 §2의 결론을 부정한다. 실제로는 봉우리가 예측된 자리에 섰다.

**비판 지점 (반드시 짚어야 함).** 이 논증의 힘은 **두 측정의 독립성**에 달려 있는데, 그 독립성이 완전하지 않다.
- 인과추적은 층 $l$, 토큰 $i$의 **활성 $h_i^{(l)}$을 복원**한다.
- ROME은 층 $l$, 토큰 $i$의 활성을 **만들어내는 가중치 $W_{proj}^{(l)}$를 수정**한다.

둘 다 **같은 좌표의 같은 계산 경로**를 건드린다. "활성이 인과적으로 중요한 자리"와 "그 활성을 만드는 가중치를 바꿨을 때 효과가 큰 자리"가 일치하는 건, 두 독립 증거의 수렴이라기보다 **거의 동어반복에 가까울 수 있다.** 활성 $x$가 출력에 큰 영향을 준다면, $x$를 생산하는 함수를 바꾸는 것도 큰 영향을 주는 게 자연스럽다.

그리고 **§3.4는 이 일치를 정량화하지 않는다.** "strong correlations with the causal analysis"라는 서술뿐이고, 두 지도 사이의 상관계수·순위상관·최대점 거리 같은 수치가 **원문에 미보고**다. 그림 두 장의 육안 비교가 논증의 결정타를 지탱하고 있다.

이 균열이 실제로 후속 연구의 진입점이 되었다 — Hase, Bansal, Kim, Ghandeharioun의 **"Does Localization Inform Editing? Surprising Differences in Causality-Based Localization vs. Knowledge Editing in Language Models"** (arXiv:2301.04213, **NeurIPS 2023 Spotlight**)의 초록 두 번째 문장이 정확히 이 지점을 겨눈다: "In this paper, we find that we can change how a fact is stored in a model by **editing weights that are in a different location than where existing methods suggest that the fact is stored**." 상세는 [08_lineage.md](08_lineage.md)와 [10_extensions_b_followups.md](10_extensions_b_followups.md)에서 다룬다.

---

## 실험 2 — AttnEdit 음성 대조군 (Appendix I, Figure 24·25)

**설계.** §2가 "early site는 MLP, late site는 어텐션"이라고 했다. 그렇다면 **어텐션 쪽을 편집하면 어떻게 되는가?** 저자들은 층 **33**(어텐션 인과효과의 중심, Figure 1l)의 모든 헤드 $W_i^Q, W_i^K, W_i^V$에 제약 fine-tuning을 건다. $\epsilon = 0.001$은 그리드 서치(Figure 23)로, "success와 generalization 점수를 bleedover 증가로 부풀리지 않기 위해" 골랐다.

**가설 (Appendix I 도입부 verbatim).** "middle-layer MLPs processing subject tokens correspond to factual recall, whereas late-layer attention modules **read this information to predict a specific word sequence**."

**결과 (Figure 25 — 에펠탑을 로마로 옮기기).**

| 프롬프트 유형 | AttnEdit | ROME |
|---|---|---|
| 원래 편집 프롬프트 | (a) "…located in Rome and it is considered one of the most important tourist attractions." → **성공** | (b) "…located in Rome, Italy." → **성공** |
| 일반화 프롬프트 | (c) "What is the Eiffel Tower? … It is a symbol of **France**, and a reminder of the French Revolution, which took place in **Paris**…" → **실패** | (d) "What is the Eiffel Tower? The Eiffel Tower is the symbol of **Rome**." → **성공** |
| 다른 문맥 | (e) "The Eiffel Tower is right across from the Eiffel Tower…" → **붕괴** | (f) "…right across from St. Peter's Basilica in **Rome**, Italy." → **성공** |

**해석.** 이것이 이 논문에서 **가장 설득력 있는 단일 증거**라고 본다. 이유는 세 가지다.
1. **음성 대조군이다.** "ROME이 잘 된다"는 것만으로는 위치의 특별함을 증명하지 못한다. **다른 위치를 같은 정성으로 편집했는데 질적으로 다른 실패가 나온다**는 것이 위치 주장의 핵심 증거다.
2. **실패의 양상이 예측과 정확히 일치한다.** 가설이 "후반 어텐션은 정보를 **읽어서 단어열로 뱉는** 역할"이라고 했다면, 그걸 편집하면 **단어열 수준의 변화(앵무새 반복)만 일어나고 지식 수준의 변화는 없어야** 한다. Figure 25 (c)가 정확히 그 모습이다 — 원래 문장은 로마라 답하면서, 자유 서술로 가면 도로 프랑스·파리를 말한다. §3.4가 이를 "editing the late-layer attention modules leads to **regurgitation**"으로 요약한다.
3. **(e)의 붕괴가 특히 진단적이다.** AttnEdit는 "The Eiffel Tower is right across from **the Eiffel Tower**"라는 자기참조 문장을 뱉는다. 어텐션 가중치를 억지로 비틀면 **문장 구성 능력 자체가 손상**되지 지식이 바뀌지 않는다는 뜻이다.

**비판 지점.** 비교가 **완전히 대칭이 아니다.** ROME은 rank-1 닫힌 해이고 AttnEdit는 제약 fine-tuning이다. AttnEdit의 실패가 "어텐션이 지식 저장소가 아니어서"인지 "fine-tuning이라는 방법이 나빠서"인지 이 실험만으로는 완전히 분리되지 않는다. 공정한 대조라면 어텐션 가중치에 대해서도 rank-1 연상기억 관점의 편집을 시도했어야 한다 — 다만 어텐션은 MLP처럼 깔끔한 키–값 구조가 아니라 그런 방법이 자명하지 않다는 점은 인정해야 한다. Figure 24가 분포(평균선 + 1.5 IQR 이상치)를 보이므로 정량적 뒷받침은 있으나, **정확한 수치는 그림으로만 존재**한다.

---

## 실험 3 — 스케일 일반화 (Appendix B.3, Figure 8·9)

**설계.** GPT-NeoX(20B), GPT-J(6B)에서 인과추적을 반복. 잡음은 임베딩 크기에 맞춰 조정($\nu = 0.03$, $0.025$). GPT-2 XL과 같은 프롬프트를 쓰되, 큰 모델이 다른 단어를 예측하는 경우는 제외.

**결과.** 패턴이 유지된다 — subject 마지막 토큰의 early site, 거기서 MLP의 큰 역할, 예측 직전 토큰에서 어텐션 우세. 저자들이 함의를 명시한다: "The similarity between the GPT-NeoX and GPT-J and GPT-2 XL traces helps us to understand **why ROME continues to work well with higher-parameter models**."

**정직한 차이 보고.** "The importance of attention at the **first layers** of the last subject token is more apparent in GPT-Neo and GPT-J compared to GPT-2, suggesting that **the attention parameters may be playing a larger role in storing factual associations**." 저자들은 이걸 층 수 차이(44·28 vs 48)로 설명하려 하지만 — 층이 적으면 subject 이름에 주목하는 계산을 한두 층에 몰아야 한다는 것 — **이건 사후 설명이지 검정된 가설이 아니다.** 그리고 "어텐션이 사실 저장에 더 큰 역할을 할 수도 있다"는 문장은 §2.3의 국소화 가설(MLP가 저장소)을 **저자 스스로 부록에서 부분 유보**한 것으로 읽어야 한다.

**Figure 9의 추가 유보.** GPT-2 Medium·Large까지 포함한 스케일 비교에서 "early-site MLP modules continue to have high indirect causal effects at the last subject token, although **the layers where effects peak are different from one model to another**." 즉 **"중간 층"이라는 서술은 모델마다 다른 층 번호를 뜻한다.** 층 18은 GPT-2 XL 전용 상수다.

---

## 실험 4 — 작은 모델에서의 편집 (Appendix F, Table 5·6)

**Table 5 (C OUNTER FACT):** GPT-2 M — ROME S **87.4** vs FT+L 68.0. GPT-2 L — ROME S **88.2** vs FT+L 71.2.
**Table 6 (zsRE):** GPT-2 M — ROME Paraphrase **79.8** vs FT+L 59.4. GPT-2 L — ROME **84.7** vs FT+L 56.8.

**해석.** 345M~1.5B 범위에서 ROME 우위가 안정적이다. 특히 zsRE Paraphrase 열에서 격차가 20~28점으로 크다 — **일반화 축에서의 우위가 모델 크기와 무관하게 유지**된다는 신호. 다만 이 확장 실험의 baseline은 **FT+L 하나뿐**이다(KE·MEND·KN 없음). Table 4에서 FT+L이 baseline 중 최고 S였으므로 "차선과의 비교"라는 §F 서술("ROME outperforms the next-best baseline as measured on GPT-2 XL (FT+L)")은 정당하지만, 하이퍼네트워크 계열이 작은 모델에서 어떻게 되는지는 **원문에 미보고**다.

---

## 실험 5 — 인간 평가 (§3.6, Appendix J, Figure 26~30)

**설계.** 자원자 **15명**이 50개 사실을 삽입한 모델들의 생성 텍스트를 **유창성**과 **삽입된 사실과의 일관성** 두 축에서 비교. ROME vs FT+L. Figure 26 캡션에 따르면 총 **150회 평가**.

**결과 (§3.6 verbatim 요지).** 평가자들은 ROME을 삽입 사실과 일관되다고 볼 가능성이 FT+L 대비 **1.8배** 높았다. 그러나 유창성에서는 ROME이 더 유창할 가능성이 **1.3배 낮다**. 저자들의 자기 평가: "suggesting that ROME introduces some loss in fluency that is **not captured by our other metrics**."

**해석.** 이 문장이 중요하다 — 저자들이 **자기 자동 지표(GE)의 한계를 스스로 인정**한다. Table 4에서 GE는 621.9로 FT+L(621.4)과 거의 같아 보였는데, 사람이 보면 차이가 있다. n-gram 엔트로피는 반복 붕괴는 잡아내지만(KE-CF의 383.0) 미묘한 부자연스러움은 못 잡는다.

**규모의 한계.** 15명 / 150회 평가는 작다. 평가자 간 일치도(inter-rater agreement), 평가자 배경, 통계적 유의성 검정은 **원문에 수치 미보고**(Appendix J에 지시문 전문과 샘플 화면은 있음).

---

## 이 절의 핵심 한 문장

> **국소화 주장을 지탱하는 네 다리 중 가장 튼튼한 것은 AttnEdit 음성 대조군(엉뚱한 데를 편집하면 앵무새 반복이 나온다)이고 가장 약한 것은 §3.4의 지도 일치(두 측정이 같은 계산 경로를 건드리는 데다 일치도가 정량화되지 않았다)이며, 후속 NeurIPS 2023 Spotlight가 파고든 곳이 정확히 그 약한 다리다.**
