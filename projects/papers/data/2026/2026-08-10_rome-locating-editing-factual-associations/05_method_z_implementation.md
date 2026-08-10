# 4-Z. 구현 디테일 — 재현하려는 사람을 위한 정리

> **배경 사다리**: 이 절은 앞의 수식들을 실제로 돌릴 때 필요한 숫자만 모은 것이다. 전부 **원문 Appendix E.5(ROME)와 E.1~E.4(baseline), Appendix B.1(인과추적)** 에서 직접 확인한 값이며, 원문에 없는 값은 "원문에 미보고"로 표기한다.

---

## ROME 본체 (Appendix E.5)

| 항목 | 값 | 근거 |
|---|---|---|
| 편집 층 $l^*$ | **18** (GPT-2 XL) | "We perform the intervention at **layer 18**." 근거로 Figure 1k(MLP 인과효과 중심)와 Figure 3("layer 18 is approximately when MLP outputs begin to switch from acting as keys to values")를 든다 |
| $C$ 추정 표본 | 위키피디아 **2020-05-01 스냅샷**에서 **100,000개** 은닉상태 $k$ | float32 정밀도로 수집. **특정 subject 단어에 국한하지 않고 "every token in the text"를 포함** |
| $k_*$ 접두사 | **20개** — 길이 5짜리 10개 + 길이 10짜리 10개 | (본문 §3.1은 "50 random token sequences of length 2 to 10"이라 서술 — **본문과 부록 불일치**, 재현 시 부록 우선) |
| $v_*$ 옵티마이저 | Adam, learning rate **0.5**, weight decay **$1.5\times10^{-3}$** | |
| KL 계수 $\lambda$ | **$1\times10^{2}$** | 본문 Eqn. 4에는 이 기호가 표시되지 않음 |
| 최적화 스텝 | 최대 **20** 스텝, $L(z) \le 5\times10^{-2}$ 도달 시 early stop | |
| 편집 소요 시간 | **약 2초** (NVIDIA A6000, GPT-2 XL) | |

**층 18 선택에 대한 주석.** 저자들이 두 개의 독립 근거를 댄다는 점이 중요하다 — (i) 인과효과의 중심이고 (ii) "MLP 출력이 키 역할에서 값 역할로 전환되기 시작하는 지점"이다. 후자는 Figure 3의 절단 실험에서 하위 층은 MLP 의존, 상위 층은 비의존으로 갈리는 전이점을 가리킨다. 하이퍼파라미터 탐색으로 고른 값이 **아니라** 앞선 분석에서 유도된 값이라는 서사가 논증 구조상 필수적이다.

---

## Causal Tracing 설정 (Appendix B.1, B.2)

| 항목 | 값 |
|---|---|
| 문장 표본 | **1000개** — C OUNTER FACT의 사실·템플릿으로 greedy generation 후, 다른 대문자 단어보다 먼저 정답 $o_c$를 말하는 사례만 채택하고 무작위 1000개 추출 |
| 표본의 baseline 난이도 | 정답 토큰 예측 확률 평균 **27.0%** |
| 손상 잡음 | $\epsilon \sim \mathcal{N}(0;\nu)$, $\nu = 3\sigma_t$ ($\sigma_t$ = 관측된 토큰 임베딩 표준편차) |
| 손상 반복 | 텍스트마다 **10회** 서로 다른 잡음 표본 |
| 손상 후 정답 확률 | 평균 **8.47%** (원본의 1/3 미만) |
| 단일 활성 복원 최대 효과 | 마지막 subject 토큰에서 평균 **19.5%** 회복; 층별 버킷 시 15층 근처에서 평균 **15.0%** |
| MLP 구간 복원 | $[l^*-4, \ldots, l^*+5]$ **10개 층**; 개별 텍스트 평균 최대 **23.6%**, 버킷 시 17층 중심 **15.0%** |
| Attn 구간 복원 | 평균 최대 **19.4%**; 버킷 시 **32층**·예측 직전 토큰에서 **16.5%** |
| 층 번호 규약 | **0부터 $L-1$** (1부터가 아님) |
| 더 큰 모델 잡음 | GPT-NeoX(20B) $\nu = 0.03$, GPT-J(6B) $\nu = 0.025$ — 임베딩 크기에 맞춰 조정 (Appendix B.3) |

**여기서 눈여겨볼 두 가지.** ① 손상 후에도 정답 확률이 **0이 아니라 8.47%** 다. 완전히 지워지지 않은 상태에서 복원 효과를 재는 것이라, IE 값에는 "부분적으로 남아 있던 정보"의 영향이 섞여 있다. ② 단일 활성 복원(19.5%)과 10층 구간 복원(23.6%)의 차이가 생각보다 작다 — MLP 구간 복원의 우위가 압도적이지 않다는 뜻이며, [07_limits.md](07_limits.md)의 해상도 논의로 이어진다.

---

## Baseline 설정 (Appendix E.1~E.4)

- **FT (Fine-Tuning)** — Adam + early stopping, $-\log \mathbb{P}_{G'}[o^*\mid p]$ 최소화, **한 층의 mlpproj 가중치만** 변경. GPT-2 XL은 **층 1**, GPT-J는 **층 21** (각각 Figure 17·18 하이퍼파라미터 스윕에서 neighborhood score 기준 선택). learning rate $5\times10^{-4}$, loss 0.03에서 early stop.
  - **공정성 관련 저자 자백**: "Note that focusing on MLP weights already gives our fine-tuning baselines an **advantage** over blind optimization, since we have localized changes to the module level." 즉 baseline에 ROME의 통찰을 미리 심어줬다.
- **FT+L (Constrained FT)** — 위에 $\|\theta_{G'} - \theta_G\|_\infty \le \epsilon$ 제약 추가(매 스텝 클램핑). GPT-2 XL: **층 0, $\epsilon = 5\times10^{-4}$**. GPT-J: **층 0, $\epsilon = 5\times10^{-5}$**.
- **KN (Knowledge Neurons)** — GPT-2 XL만. 하이퍼파라미터는 EleutherAI 재구현(`github.com/EleutherAI/knowledge-neurons`) 기본값.
- **KE (Knowledge Editor)** — GPT-2 XL만. 공식 코드가 GPT-2를 지원하지 않아 **Mitchell et al. (2021)의 재구현** 사용. zsRE·C OUNTER FACT 각각의 학습셋 **10,000개 부분집합**으로 KE-zsRE, KE-CF를 추가 학습. 테스트 시 스케일 팩터 기본값 1.0.
- **MEND** — GPT-2 XL과 GPT-J. 마찬가지로 MEND-zsRE, MEND-CF 추가 학습. 하이퍼파라미터는 기본 설정.
- **AttnEdit (Appendix I)** — 층 **33**의 모든 헤드 $W_i^Q, W_i^K, W_i^V$에 제약 fine-tuning. 그리드 서치(Figure 23) 후 $\epsilon = 0.001$ 선택. 층 33은 Figure 1l의 어텐션 인과효과 중심.

**공정성 평가.** baseline 튜닝에 상당한 노력이 들어갔다(층 스윕, 전용 버전 추가 학습). 다만 비대칭이 남는다 — ROME의 $\lambda$, learning rate, 스텝 수는 저자들이 정했고, KE·MEND의 학습 하이퍼파라미터는 "default configuration"이다. 상세는 [06_experiments_a_benchmarks.md](06_experiments_a_benchmarks.md)에서 다룬다.

---

## 원문에 미보고인 것들 (재현 시 막히는 지점)

- **시드(seed) 개수와 시드 간 분산** — Table 1·4·5·6은 95% 신뢰구간을 보고하지만, 이는 **평가 레코드 수**(GPT-2 XL 7,500 / GPT-J 2,000)에 대한 구간이지 **학습·편집 시드 반복**에 대한 구간이 아니다. 시드 재실행 분산은 원문에 수치 미보고.
- **$\lambda$ 민감도** — $\lambda = 100$이 어떻게 정해졌는지, 다른 값에서 NS가 어떻게 변하는지 원문에 미보고.
- **$C$ 표본 크기 민감도** — 100,000이 충분한 이유, 1,000이나 1,000,000에서의 변화 원문에 미보고.
- **층 18 외 층에서의 정확한 수치** — Figure 5가 layer×token 스윕을 **그림으로** 보여주지만, 셀별 수치 표는 원문에 없다.
- **인과추적과 편집 성능 봉우리의 정량적 일치도** — §3.4는 "strong correlations with the causal analysis"라고 서술하나 상관계수 등 **정량 지표는 원문에 미보고**. 두 지도의 일치는 그림 수준의 육안 비교다. (이 지점이 후속 반박의 표적이 된다.)

---

## 공개 자산

- 프로젝트: https://rome.baulab.info/ — 초록과 §5가 "code, dataset, visualizations, and an interactive demo notebook"을 공개했다고 명시.
- C OUNTER FACT: 21,919 레코드 (구성은 Table 2 — subjects 20,391 / objects 749 / paraphrase prompts 42,876 / neighborhood prompts 82,650 / generation prompts 62,346).
- 후속 MEMIT: https://memit.baulab.info (arXiv:2210.07229 comments 필드에서 확인).

---

## 이 부분의 핵심 한 문장

> **재현에 필요한 숫자는 대부분 부록에 성실히 적혀 있고 접두사 ablation 같은 negative 결과까지 공개돼 있지만, "층 18 vs 다른 층"의 정량 표와 "인과추적 지도 ↔ 편집 성능 지도"의 상관계수라는 두 개의 결정적 수치가 그림으로만 존재한다는 점이 이 논문의 재현성 약점이다.**
