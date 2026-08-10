# 6. 가정·한계·반박

> **배경 사다리**: ① "명시된 한계"는 논문이 스스로 적은 것, "암묵적 가정"은 안 적었지만 없으면 논증이 무너지는 것이다. ② 좋은 반박은 "틀렸다"가 아니라 **"이 실험을 하면 갈릴 것이다"** 의 형태를 갖는다. ③ 재현성 평가에서 핵심은 "평균만 보고했나, 분산도 보고했나"이다.

---

## 명시된 가정·한계 (§3.7 Limitations, §6 Ethical Considerations)

저자들이 §3.7에서 직접 적은 것들이다. 짧지만 밀도가 높다.

1. **단일 사실 편집만 가능.** "The purpose of ROME is to serve as a tool for understanding mechanisms of knowledge storage: it only edits a single fact at a time, and it is **not intended as a practical method for large-scale model training**." → 방법이 아니라 **도구**임을 스스로 규정.
2. **편집의 방향성.** "Associations edited by ROME are **directional**" — "The iconic landmark in Seattle is the Space Needle"와 "The Space Needle is the iconic landmark in Seattle"가 별도 저장되어 둘 다 바꾸려면 편집이 두 번 필요하다. 이는 §4-C의 "사실 하나 = 키–값 쌍 하나" 정식화가 낳는 필연적 귀결이다.
3. **사실 연관 외의 지식은 미탐구.** "we have not investigated other kinds of learned beliefs such as **logical, spatial, or numerical knowledge**."
4. **표현 공간의 구조는 여전히 미지.** "our understanding of the structure of the vector spaces that represent learned attributes remains incomplete."
5. **편집 후 환각.** "Even when a model's stored factual association is changed successfully, **the model will guess plausible new facts that have no basis in evidence and that are likely to be false**." → §6에서 이를 "large language models should not be used as an authoritative source of factual knowledge in critical settings"라는 권고로 확장.
6. **오남용 위험 (§6).** 악의적 허위정보·편향 주입 가능성을 명시.

---

## 암묵적 가정 (말 안 했지만 깔려 있는 것)

**A1. 손상된 모델이 "그 사실을 모르는 모델"의 타당한 대리물이다.**
$3\sigma_t$ 가우시안 잡음을 임베딩에 더한 상태는 자연스러운 반사실이 아니라 **분포 밖 상태**다. 이 상태에서 관측된 정보 흐름이 정상 작동 시의 흐름과 같다는 보장이 없다. 저자들이 Appendix B.4 Figure 13에서 대안 잡음을 시험한 것은 이 불안을 감지했다는 증거이며, 결과("effects are smaller than the choice of $3\sigma_t$ used in the main paper")는 **본문 수치가 효과를 가장 크게 만드는 설정에서 나왔음**을 뜻한다.

**A2. 위키피디아 토큰 분포가 모델의 "기존 기억" 분포를 대리한다.**
Eqn. 2의 $C = KK^\top$는 실제 $K$가 아니라 위키피디아 10만 샘플의 추정치다(Appendix E.5). "최소 교란"이라는 ROME의 핵심 보장이 이 대리 추정의 품질에 걸려 있으나, 민감도 분석은 **원문에 없다**.

**A3. 원본 $W_{proj}$가 최소제곱 최적해다.**
Appendix A의 유도가 명시적으로 이 전제에서 출발한다("We assume that $W$ is the optimal least-squares solution"). 실제 $W_{proj}$는 언어모델링 손실로 학습된 것이다. 유도의 출발점이 참이 아니므로, Eqn. 2는 **정리가 보증하는 최적해가 아니라 유용한 근사**다. 논문은 이 간극을 실험 성공으로만 메운다.

**A4. 국소화의 해상도가 "층 하나"다.**
Appendix B.2가 이를 무너뜨린다 — 개별 층 복원의 효과는 "generally negligible"이고 10층 구간을 복원해야 효과가 나온다. 그런데 §2.3의 국소화 가설과 층 18 편집은 훨씬 좁은 해상도를 전제한 것처럼 서술된다. **분석의 해상도(10층)와 개입의 해상도(1층)가 다르다.**

**A5. 마지막 subject 토큰이 subject의 표준 앵커다.**
Appendix B.4 **Figure 11**이 저자 자신의 반례집이다 — 'Windows Media Player'는 **첫 단어 'Windows'** 가 결정적이고, 'Mitsubishi Electric'은 'Electric'이 무관하며, 'Madame de Montesson'은 칭호 'Madame'이 주도한다. 캡션이 직접 인정한다: "the last token of the subject name is **not always** decisive." 이 반례들이 **본문이 아니라 부록에** 배치된 편집상의 선택은 지적해둘 만하다.

**A6. 종합 점수 S가 중립적 심판이다.**
ES·PS·NS의 조화평균은 균형을 강제하는 설계이자 **ROME의 강점 축을 최대화하는 지표**다. 데이터셋도 지표도 공식도 전부 저자들이 만들었다.

---

## 반박 가능한 지점

### 반박 1 — "국소화가 편집 성공을 예측한다"는 논증의 순환성

**핵심 주장.** §3.4의 지도 일치는 두 독립 증거의 수렴이 아니라, **같은 계산 경로를 두 방식으로 건드린 결과**일 수 있다. 인과추적은 $h_i^{(l)}$을 복원하고 ROME은 그 $h$를 생산하는 $W_{proj}^{(l)}$를 바꾼다. 활성이 출력에 영향력이 크면 그 활성의 생산 함수를 바꾸는 것도 영향력이 큰 게 당연하다. 게다가 §3.4는 일치도를 **정량화하지 않는다** — "strong correlations"라는 서술뿐, 상관계수·순위상관·최대점 거리 모두 원문에 미보고이며 그림 두 장의 육안 비교가 논증의 결정타를 지탱한다.

**어떻게 검증할 수 있나.** 인과추적이 **낮은** AIE를 보고한 좌표들에서 ROME 편집을 시도했을 때 성공률이 어떻게 되는지를 정량 표로 보면 된다. 만약 저-AIE 좌표에서도 편집이 잘 된다면 국소화와 편집 가능성은 분리된다.

**실제로 이 검증이 수행되었고, 결과는 논문에 불리하다.** Hase, Bansal, Kim, Ghandeharioun, **"Does Localization Inform Editing? Surprising Differences in Causality-Based Localization vs. Knowledge Editing in Language Models"** (arXiv:2301.04213, **NeurIPS 2023 Spotlight**). 초록 두 번째 문장 verbatim: "In this paper, we find that we can change how a fact is stored in a model by **editing weights that are in a different location than where existing methods suggest that the fact is stored**." → 인과추적이 지목하지 **않은** 위치를 편집해도 사실이 바뀐다는 것. 이는 §3.4의 수렴 논증이 국소화를 확립하는 데 실패했음을 뜻한다. **이 논문을 인용할 때 이 반박을 함께 인용하지 않으면 결론이 왜곡된다.**

### 반박 2 — MLP와 어텐션의 분리가 구조적으로 불완전하다

**핵심 주장.** Eqn. 1에서 $m_i^{(l)}$의 입력에 $a_i^{(l)}$이 포함된다. MLP를 절단하면 어텐션이 모아온 정보의 **하류 처리**도 함께 끊긴다. 따라서 Figure 3의 결과("MLP를 끊으면 하위 층 인과효과 소멸")는 "MLP가 사실을 **저장**한다"와 "MLP가 어텐션의 산출물을 **라우팅**한다"를 구분하지 못한다. 저장소와 병목은 다른 개념이다.

**어떻게 검증할 수 있나.** 어텐션과 MLP가 **병렬**인 아키텍처(GPT-J 계열)에서 같은 절단 실험을 반복하면 된다. 병렬 구조에서는 $m$의 입력에 $a$가 없으므로 두 해석이 분리된다. 저자들은 GPT-J에서 causal trace는 돌렸지만(Figure 8) **절단 실험은 GPT-2 XL에서만** 보고한다. 그리고 부록 B.3이 GPT-NeoX·GPT-J에서 "the attention parameters may be playing a larger role in storing factual associations"라고 스스로 유보한 것은 이 반박에 힘을 싣는다.

### 반박 3 — 특이성이 하이퍼파라미터 하나에 걸려 있다

**핵심 주장.** ROME의 최대 강점은 NS 75.4(이웃 보존)인데, 이를 만드는 것은 Eqn. 4b의 KL 항이고 그 무게는 $\lambda = 100$이라는 **부록에만 등장하는 상수**다(본문 Eqn. 4에는 이 기호가 표시조차 되지 않는다). $\lambda$를 낮추면 ROME도 FT처럼 이웃을 오염시킬 가능성이 크다. 그렇다면 "MLP를 rank-1로 편집하는 것이 본질적으로 특이적"이라는 서사는 과장이고, 실제로는 **잘 조율된 정규화**가 일하고 있는 것일 수 있다.

**어떻게 검증할 수 있나.** $\lambda \in \{0, 1, 10, 100, 1000\}$ 스윕에서 (ES, PS, NS, S)를 측정한다. 만약 $\lambda = 0$에서 NS가 FT 수준(40대)으로 떨어진다면 반박이 성립한다. 공정한 대조를 위해 FT+L에도 동일한 essence-KL 항을 추가한 변형을 함께 돌려야 한다 — FT+L이 KL을 얻고도 여전히 PS 48.7에 머문다면 ROME의 우위는 정규화가 아니라 rank-1 구조에서 온다.

**이 반박의 검증은 원문에 없다.** $\lambda$ 민감도 분석은 수행되지 않았다.

### 반박 4 — 데이터셋·지표·점수공식의 자가 설계

**핵심 주장.** C OUNTER FACT, 다섯 지표, 조화평균 S가 모두 저자 설계다. Table 3의 "기존 벤치마크 대비 우위"도 저자가 고른 비교 축에서의 우위다.

**어떻게 검증할 수 있나.** 제3자가 만든 편집 벤치마크에서의 순위를 확인하고, S 대신 다른 결합(가중 산술평균, 최소값, 파레토 프론티어)으로 재채점한다. **완화 요인은 이미 논문 안에 있다** — zsRE(외부 벤치마크)에서도 경쟁력을 보였고(Table 1), 자기 방법의 유창성 열세를 인간 평가로 스스로 드러냈다(§3.6).

---

## 재현성 평가

**공개 수준: 상.**
- 코드·데이터셋·시각화·인터랙티브 노트북 공개 (https://rome.baulab.info, 초록·§5 명시)
- C OUNTER FACT 21,919 레코드 공개, 구성표(Table 2) 제공
- baseline 재구현 출처 명시 (KE는 Mitchell et al. 재구현 사용, KN은 EleutherAI 재구현 기본값)
- **negative ablation을 수치로 공개** (Appendix E.5 접두사 실험, Appendix B.4 잡음 실험) — 신뢰도를 크게 올리는 대목

**분산 보고: 중.**
- Table 1·4·5·6이 95% 신뢰구간을 표기하지만, 이는 **평가 레코드 수**(GPT-2 XL 7,500 / GPT-J 2,000)에 대한 구간이다. **편집 시드 반복에 대한 분산은 원문에 수치 미보고.**
- 인과추적은 텍스트당 **10회** 잡음 표본을 쓴다고 명시(Appendix B.1) — 여기는 반복이 있다.
- Figure 7이 95% 신뢰구간 선 그래프를 제공하고, 캡션이 "The confidence intervals confirm that the distinctions between peak and non-peak causal effects at both early and late sites are **significant**"라고 주장한다.
- 인간 평가(15명 / 150회)의 평가자 간 일치도·유의성 검정은 **원문에 미보고**.

**논문에 안 나온 디테일 (재현 시 막히는 지점).**
- **본문과 부록의 불일치 2건**: (i) $k_*$ 접두사 개수 — 본문 §3.1 "50 random token sequences of length 2 to 10" vs Appendix E.5 "20개(길이 5 열 개 + 길이 10 열 개)". (ii) KL 계수 $\lambda$ — 본문 Eqn. 4에 기호 없음 vs Appendix E.5 "denoted $\lambda$ in Eqn. 4, is set to $1\times10^2$".
- 층 번호 규약이 **0-indexed**(Appendix B.1) — 층별 결과 재현 시 off-by-one 위험.
- Figure 5의 layer×token 스윕 **셀별 수치 표 없음** (그림만).
- 인과추적 지도와 편집 지도의 **상관 지표 없음**.
- zsRE 10,000 레코드 슬라이스의 **선택 기준**이 §3.2에 서술되지 않음(Appendix C 참조 지시만).

---

## 이 절의 핵심 한 문장

> **이 논문의 방법론적 기여(인과추적 + rank-1 편집 + 음성 대조군)는 견고하지만, "인과추적이 지목한 곳이 곧 사실이 저장된 곳"이라는 국소화 결론은 §3.4의 정량화되지 않은 지도 일치 하나에 걸려 있었고, NeurIPS 2023 Spotlight가 바로 그 다리를 끊었다 — 따라서 이 논문은 "방법론은 인용하되 국소화 결론은 반박과 함께 인용해야 하는" 종류의 고전이다.**
