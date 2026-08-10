# 6. 가정·한계·반박

> **배경 사다리**: ① "명시된 한계"는 논문이 스스로 적은 것, "암묵적 가정"은 안 적었지만 없으면 논증이 무너지는 것이다. ② 좋은 반박은 "틀렸다"가 아니라 **"이 실험을 하면 갈릴 것이다"** 의 형태다. ③ 재현성 평가의 핵심은 "분산도 보고했나"이다.

---

## 명시된 가정·한계 (§3.7 Limitations, §6 Ethical Considerations)

저자들이 §3.7에서 직접 적은 것들이다. 짧지만 밀도가 높다.

1. **단일 사실 편집만 가능.** "…it only edits a single fact at a time, and it is **not intended as a practical method for large-scale model training**." → 방법이 아니라 **도구**임을 스스로 규정.
2. **편집의 방향성.** "Associations edited by ROME are **directional**" — A→B와 B→A가 별도 저장이라 둘 다 바꾸려면 편집이 두 번 필요하다. §4-C의 "사실 하나 = 키–값 쌍 하나" 정식화가 낳는 필연적 귀결이다.
3. **사실 연관 외의 지식은 미탐구** — "logical, spatial, or numerical knowledge"는 조사하지 않았다.
4. **표현 공간의 구조는 미지** — "our understanding of the structure of the vector spaces that represent learned attributes remains incomplete."
5. **편집 후 환각.** "the model will guess plausible new facts that have no basis in evidence and that are likely to be false" → §6에서 "large language models should not be used as an authoritative source of factual knowledge in critical settings"라는 권고로 확장.
6. **오남용 위험 (§6).** 악의적 허위정보·편향 주입 가능성을 명시.

---

## 암묵적 가정 (말 안 했지만 깔려 있는 것)

**A1. 손상된 모델이 "그 사실을 모르는 모델"의 타당한 대리물이다.** $3\sigma_t$ 가우시안 잡음을 더한 상태는 자연스러운 반사실이 아니라 **분포 밖 상태**다. Appendix B.4 Figure 13의 대안 잡음 결과("effects are smaller than the choice of $3\sigma_t$ used in the main paper")는 **본문 수치가 효과를 가장 크게 만드는 설정에서 나왔음**을 뜻한다.

**A2. 위키피디아 토큰 분포가 모델의 "기존 기억" 분포를 대리한다.** Eqn. 2의 $C = KK^\top$는 실제 $K$가 아니라 위키피디아 10만 샘플의 추정치다(Appendix E.5). "최소 교란"이라는 핵심 보장이 이 대리 추정의 품질에 걸려 있으나 민감도 분석은 **원문에 없다**.

**A3. 원본 $W_{proj}$가 최소제곱 최적해다.** Appendix A가 명시적으로 이 전제에서 출발하지만("We assume that $W$ is the optimal least-squares solution") 실제 $W_{proj}$는 언어모델링 손실로 학습된 것이다. Eqn. 2는 **정리가 보증하는 최적해가 아니라 유용한 근사**이며, 논문은 이 간극을 실험 성공으로만 메운다.

**A4. 국소화의 해상도가 "층 하나"다.** Appendix B.2가 이를 무너뜨린다 — 개별 층 복원 효과는 "generally negligible"이고 10층 구간을 복원해야 효과가 나온다. **분석의 해상도(10층)와 개입의 해상도(1층)가 다르다.**

**A5. 마지막 subject 토큰이 subject의 표준 앵커다.** Appendix B.4 **Figure 11**이 저자 자신의 반례집이며 캡션이 직접 인정한다 — "the last token of the subject name is **not always** decisive." 이 반례들을 **본문이 아니라 부록에** 배치한 편집상의 선택은 지적해둘 만하다.

**A6. 종합 점수 S가 중립적 심판이다.** ES·PS·NS의 조화평균은 균형을 강제하는 설계이자 **ROME의 강점 축을 최대화하는 지표**이며, 데이터셋도 지표도 공식도 전부 저자들이 만들었다.

---

## 반박 가능한 지점

### 반박 1 — "국소화가 편집 성공을 예측한다"는 논증의 순환성

**핵심 주장.** §3.4의 지도 일치는 두 독립 증거의 수렴이 아니라 **같은 계산 경로를 두 방식으로 건드린 결과**일 수 있고(상세는 [06_experiments_b_localization.md](06_experiments_b_localization.md) 실험 1), 게다가 §3.4는 일치도를 **정량화하지 않는다**.

**어떻게 검증할 수 있나.** 인과추적이 **낮은** AIE를 보고한 좌표에서 ROME 편집을 시도했을 때의 성공률을 정량 표로 본다. 저-AIE 좌표에서도 편집이 잘 되면 국소화와 편집 가능성은 분리된다.

**실제로 이 검증이 수행되었고 결과는 논문에 불리하다** — Hase et al., arXiv:2301.04213, **NeurIPS 2023 Spotlight** (초록 verbatim은 [08_lineage.md](08_lineage.md)). 인과추적이 지목하지 **않은** 위치를 편집해도 사실이 바뀐다는 것이며, §3.4의 수렴 논증이 국소화 확립에 실패했음을 뜻한다. **이 논문을 인용할 때 이 반박을 함께 인용하지 않으면 결론이 왜곡된다.**

### 반박 2 — MLP와 어텐션의 분리가 구조적으로 불완전하다

**핵심 주장.** Eqn. 1에서 $m_i^{(l)}$의 입력에 $a_i^{(l)}$이 포함되므로, MLP를 절단하면 어텐션이 모아온 정보의 **하류 처리**도 함께 끊긴다. 따라서 Figure 3의 결과는 "MLP가 사실을 **저장**한다"와 "MLP가 어텐션의 산출물을 **라우팅**한다"를 구분하지 못한다.

**어떻게 검증할 수 있나.** 어텐션과 MLP가 **병렬**인 아키텍처(GPT-J 계열)에서 같은 절단 실험을 반복한다 — 병렬 구조에서는 $m$의 입력에 $a$가 없어 두 해석이 분리된다. 저자들은 GPT-J에서 causal trace는 돌렸지만(Figure 8) **절단 실험은 GPT-2 XL에서만** 보고했고, 부록 B.3이 "the attention parameters may be playing a larger role in storing factual associations"라 스스로 유보한 것은 이 반박에 힘을 싣는다.

### 반박 3 — 특이성이 하이퍼파라미터 하나에 걸려 있다

**핵심 주장.** ROME의 최대 강점은 NS 75.4(이웃 보존)인데, 이를 만드는 것은 Eqn. 4b의 KL 항이고 그 무게는 $\lambda = 100$이라는 **부록에만 등장하는 상수**다(본문 Eqn. 4에는 기호조차 없다). $\lambda$를 낮추면 ROME도 이웃을 오염시킬 가능성이 크다. 그렇다면 "MLP를 rank-1로 편집하는 것이 본질적으로 특이적"이라는 서사는 과장이고, 실제 일꾼은 **잘 조율된 정규화**일 수 있다.

**어떻게 검증할 수 있나.** $\lambda \in \{0, 1, 10, 100, 1000\}$ 스윕에서 (ES, PS, NS, S)를 측정한다. $\lambda = 0$에서 NS가 FT 수준(40대)으로 떨어지면 반박이 성립한다. 공정한 대조로 FT+L에도 동일한 essence-KL을 얹은 변형을 함께 돌려야 한다 — FT+L이 KL을 얻고도 PS 48.7에 머문다면 ROME의 우위는 rank-1 구조에서 온다. **이 검증은 원문에 없다.**

### 반박 4 — 데이터셋·지표·점수공식의 자가 설계

**핵심 주장과 완화 요인**은 [06_experiments_a_benchmarks.md](06_experiments_a_benchmarks.md)의 "숨은 편향" 항에서 다뤘다. **검증 방법**만 여기 남긴다 — 제3자 편집 벤치마크에서의 순위를 확인하고, S 대신 다른 결합(가중 산술평균, 최소값, 파레토 프론티어)으로 재채점해 순위가 뒤집히는지 본다.

---

## 재현성 평가

**공개 수준: 상.** 코드·데이터셋·시각화·노트북 공개(https://rome.baulab.info), C OUNTER FACT 21,919 레코드와 구성표 제공, baseline 재구현 출처 명시. 무엇보다 **negative ablation을 수치로 공개**했다(Appendix E.5 접두사 실험, Appendix B.4 잡음 실험).

**분산 보고: 중.** Table 1·4·5·6의 95% 신뢰구간은 **평가 레코드 수**(GPT-2 XL 7,500 / GPT-J 2,000)에 대한 구간이며 **편집 시드 반복 분산은 원문에 수치 미보고**다. 인과추적은 텍스트당 10회 잡음 표본을 쓰고 Figure 7이 신뢰구간 선 그래프로 "the distinctions between peak and non-peak causal effects … are **significant**"를 주장한다. 인간 평가(15명 / 150회)의 평가자 간 일치도·유의성 검정은 **원문에 미보고**.

**재현을 실제로 막는 지점** (상세 하이퍼파라미터는 [05_method_z_implementation.md](05_method_z_implementation.md)):
- **본문–부록 불일치 2건**: $k_*$ 접두사 개수(본문 "50" vs 부록 "20"), KL 계수 $\lambda$(본문 Eqn. 4에 기호 없음 vs 부록 "$1\times10^2$").
- 층 번호 **0-indexed**(Appendix B.1) — off-by-one 위험.
- Figure 5 스윕의 **셀별 수치 표 없음**, 두 지도의 **상관 지표 없음**, zsRE 10,000 슬라이스의 **선택 기준 미서술**.

---

## 이 절의 핵심 한 문장

> **이 논문의 방법론적 기여(인과추적 + rank-1 편집 + 음성 대조군)는 견고하지만, "인과추적이 지목한 곳이 곧 사실이 저장된 곳"이라는 국소화 결론은 §3.4의 정량화되지 않은 지도 일치 하나에 걸려 있었고, NeurIPS 2023 Spotlight가 바로 그 다리를 끊었다 — 따라서 이 논문은 "방법론은 인용하되 국소화 결론은 반박과 함께 인용해야 하는" 종류의 고전이다.**
