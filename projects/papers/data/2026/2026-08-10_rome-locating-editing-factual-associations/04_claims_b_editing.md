# 3-B. 핵심 Claim 해체 — 편집 가능성

> **배경 사다리**: ① rank-1(계수 1) 행렬이란 "열벡터 하나 × 행벡터 하나"로 만들어지는, 가장 단순한 형태의 행렬 변화다. ② "일반화(generalization)"는 가르친 문장 말고 바꿔 말한 문장에서도 통하는가, "특이성(specificity)"은 안 가르친 다른 대상은 안 건드렸는가를 뜻한다. ③ 이 둘은 보통 **서로를 잡아먹는다** — 이 절의 핵심 긴장이다.

[04_claims_a_localization.md](04_claims_a_localization.md)에서 "어디"를 다뤘다면, 여기서는 "거기를 바꾸면 정말 바뀌는가"를 다룬다.

---

## Claim 3 — MLP의 출력 행렬은 선형 연상 기억이며, 사실 하나는 rank-1 업데이트 한 번으로 삽입된다

**주장 (한 문장).** 트랜스포머 MLP의 두 번째 행렬 $W_{proj}^{(l)}$을 키–값 저장소로 보면, 새로운 $(k_*, v_*)$ 쌍의 삽입은 **등식 제약이 붙은 최소제곱 문제**가 되고 반복 최적화 없이 **닫힌 해**로 풀린다.

**증거.**
- 원문 **§3.1**, **Eqn. 2**: $\text{minimize } \|\hat{W}K - V\| \text{ such that } \hat{W}k_* = v_* \text{ by setting } \hat{W} = W + \Lambda(C^{-1}k_*)^\top$
- **Appendix A** — Eqn. 5~17의 완전한 대수 유도. 라그랑지안 $L(\hat{W}, \Lambda) = \frac{1}{2}\|\hat{W}K - V\|_F^2 - \Lambda^\top(\hat{W}k_* - v_*)$ (Eqn. 8)에서 출발해 정규방정식 $WKK^\top = VK^\top$ (Eqn. 6)을 빼면 대부분 항이 소거되어 $(\hat{W} - W)KK^\top = \Lambda k_*^\top$ (Eqn. 12)이 남고, $\Lambda = \frac{v_* - Wk_*}{(C^{-1}k_*)^\top k_*}$ (Eqn. 17)를 얻는다.
- 이론적 조상 명시: Kohonen (1972), Anderson (1972)의 선형 연상 기억, 그리고 Bau et al. (2020)의 rank-1 삽입. 저자들은 차이를 분명히 한다 — "In a convolutional network, Bau et al. solve this using an optimization, but **in a fully-connected layer, we can derive a closed form solution**."
- 실행 비용 증거: **Appendix E.5** — "The entire ROME edit takes approximately **2s on an NVIDIA A6000 GPU** for GPT-2 XL."

**숨은 전제.**
1. **$W$가 애초에 최소제곱 최적해였다는 가정.** Appendix A 첫 문장이 "We assume that $W$ is the optimal least-squares solution…"이라 전제하지만, 실제 GPT의 $W_{proj}$는 언어모델링 손실로 학습된 것이다. **유도의 출발점이 사실이 아니라 편의상의 가정**이며, 이게 통하는 건 실험이 통했기 때문이지 정리가 보증해서가 아니다.
2. **$C = KK^\top$의 대리 추정이 타당하다.** 진짜 $K$는 접근 불가라 위키피디아 10만 은닉상태 샘플로 추정한다(Appendix E.5). "모델의 기억 분포 ≈ 위키피디아 토큰 분포"라는 대체가 깔려 있다.
3. **$C$가 비퇴화(nondegenerate)** — Appendix A가 명시적으로 가정한다. 조건수가 나쁘면 업데이트가 폭주한다.
4. **사실 하나 = 키–값 쌍 하나.** 이것이 §3.7이 인정하는 방향성 문제의 근원이다.

**쉬운 말 풀이.** 사서의 머릿속에 "이름표 → 정보" 카드가 잔뜩 든 서랍이 있다. 새 카드를 넣는 무식한 방법은 서랍 전체를 다시 정리하는 것(fine-tuning)인데 그러면 옆 카드들이 뒤섞인다. 저자들의 방법은 **"기존 카드를 최대한 안 건드리면서 새 카드만 들어가게 하는 최소한의 밀어넣기"를 수식으로 정확히 계산**하는 것이고, 답이 딱 하나로 나온다 — 시행착오 없이 2초면 끝난다.

---

## Claim 4 — ROME만이 일반화와 특이성을 동시에 지킨다

**주장 (한 문장).** 기존 편집 방법들은 모두 **(F1) 반사실 문장에 과적합해 일반화 실패**하거나 **(F2) 과소적합해 무관한 주체까지 오염**시키는데, ROME은 둘 다 피한다.

**증거.**
- 원문 **§3.4**의 실패 모드 정식화: "we observe that all tested methods other than ROME exhibit one or both of the following problems: **(F1)** overfitting to the counterfactual statement and failing to generalize, or **(F2)** underfitting and predicting the same new output for unrelated subjects."
- **Table 4 (주 결과)** GPT-2 XL — ROME **S=89.2**, ES 100.0(0.1), PS 96.4(0.3), **NS 75.4(0.7)**, GE 621.9(0.5), RS 41.9(0.3). 대조:
  - **FT**: ES 100.0인데 **NS 40.4** → F2 (일반화는 되지만 이웃 오염)
  - **FT+L**: NS 70.3인데 **PS 48.7** → F1 (안전하지만 패러프레이즈 실패)
  - **KE-CF**: ES 99.9, PS 95.8인데 **NS 6.9**, NM −63.2, GE 383.0 → 극단적 F2 + 유창성 붕괴. 종합 S는 **18.1**로 편집 안 한 GPT-2 XL(30.5)보다도 낮다.
  - **KN**: ES 28.7 → 애초에 편집이 안 됨 (F1+F2)
- GPT-J(6B)에서도 동일 패턴 — ROME **S=91.5** vs FT **S=25.5**(NS 10.3으로 붕괴). Table 4 캡션이 이를 직접 짚는다: "on GPT-J, FT achieves 100% efficacy, but nearly 90% of neighborhood prompts are incorrect."
- 질적 증거 **Figure 6**: "Pierre Curie's area of work is medicine"를 삽입한 뒤 FT+L·KE·MEND는 **무관한 Robert Millikan까지** 의학자로 바꾸는 반면 ROME은 Millikan을 건드리지 않는다(f2).
- 작은 모델 확장 **Table 5**: GPT-2 M에서 ROME 87.4 vs FT+L 68.0, GPT-2 L에서 88.2 vs 71.2.

**숨은 전제.**
1. **종합 점수 S(조화평균)가 공정한 심판이다.** ES·PS·NS의 조화평균은 **한 축이 낮으면 전체가 무너지도록** 설계됐다. F1/F2를 처벌하려는 의도적 설계지만 동시에 **ROME의 강점 축(균형)을 점수화한 지표**이기도 하다.
2. **baseline 하이퍼파라미터가 충분히 탐색됐다.** 저자들은 Figure 17·18로 FT·FT+L의 층과 $\epsilon$을 스윕했고, KE·MEND는 **전용 버전(KE-CF, MEND-CF, KE-zsRE, MEND-zsRE)까지 따로 학습**시켰다(Appendix E.3, E.4). 다만 KE·MEND의 학습 하이퍼파라미터는 "default configuration"이라 명시한다 — ROME은 저자 튜닝, baseline은 기본값이라는 비대칭이 남는다.
3. **C OUNTER FACT가 편향 없는 시험장이다.** 데이터셋도 지표도 저자들이 만들었고 Table 3의 비교 기준도 저자들이 골랐다. 자기가 만든 자에서 자기가 1등인 구조다. (**완화 요인**: zsRE라는 **남의 벤치마크**에서도 Table 1로 경쟁력을 보였다.)

**쉬운 말 풀이.** 학생에게 "퀴리는 의사였다"고 잘못 가르쳤다 하자. 좋은 교정이란 ① 다르게 물어도 "의사"라 답하고(일반화) ② 다른 과학자 이야기는 원래대로 남는(특이성) 것이다. 기존 방법들은 둘 중 하나만 됐다 — 어떤 건 그 문장만 외워 다르게 물으면 도로 물리학자라 하고, 어떤 건 아예 **모든 과학자를 의사로** 만든다. ROME은 처음으로 둘을 동시에 해냈다.

---

## Claim 5 — 편집이 잘 되는 좌표와 인과추적이 지목한 좌표가 일치한다 (논증의 결정타)

**주장 (한 문장).** ROME을 모든 (층, 토큰) 조합에 적용해보면 성능 봉우리가 **§2의 인과추적이 지목한 바로 그 좌표**에 선다.

**증거.**
- 원문 **§3.4** + **Figure 5**: "rewrites are most successful at the last subject token, where both specificity and generalization peak at middle layers. Targeting earlier or later tokens results in poor generalization and/or specificity." 그리고 "**generalization peaking at the 18th layer**."
- 저자들이 수렴의 의미를 직접 선언: "This evidence suggests that we have an accurate understanding not only of **where** factual associations are stored, but also **how**."
- **음성 대조군 (Appendix I)** — 어텐션 쪽을 편집하는 **AttnEdit**. 결과는 "후반 어텐션 편집은 앵무새 반복(regurgitation)을 낳고 중간층 MLP 편집만 진짜 지식 변경을 낳는다"이며, §3.4가 이를 본문에 연결한다. 상세는 [06_experiments_b_localization.md](06_experiments_b_localization.md) 실험 2.

**숨은 전제.** **두 측정이 진짜 독립인가.** 인과추적도 ROME도 결국 "subject 마지막 토큰의 중간층 MLP"라는 같은 대상을 건드린다 — 전자는 그 활성을 **복원**하고 후자는 그 활성을 만드는 **가중치**를 바꾼다. 표적이 같으면 같은 봉우리가 나오는 게 놀랍지 않을 수 있다. 이 반론은 후속 연구(Hase et al., NeurIPS 2023 Spotlight)가 반대 방향에서 파고든 지점이며 [07_limits.md](07_limits.md)에서 정면으로 다룬다.

**쉬운 말 풀이.** 범인을 지목하는 두 방법 — ① 알리바이를 하나씩 지워보며 누가 결정적이었는지 추론하기(인과추적), ② 실제로 그 사람의 행동을 바꿔놓고 사건이 달라지는지 보기(편집). 둘이 같은 사람을 가리키면 신뢰도가 올라가고, 이 논문의 힘은 두 방법을 **한 논문 안에서** 돌려 지도를 겹친 데 있다. 다만 두 방법이 같은 사람의 같은 부위를 건드린다면 겹침이 얼마나 강한 증거인지는 따져볼 여지가 있다.
