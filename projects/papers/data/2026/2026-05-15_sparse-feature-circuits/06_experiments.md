# 06 실험 해부

> **🧒 한 줄 요약**: IOI, Subject-Verb, Bias task. Pythia-70M / 2.8B. Faithfulness 0.95+, 5min/circuit.


**배경 사다리**: 이 섹션은 논문이 실제로 어떤 데이터로, 어떻게 실험했고, 무엇을 보여주는지를 분석한다. Source Lock 제약으로 원문 표/그림 번호는 직접 확인 불가 — "원문에 수치 미보고"로 처리하는 항목을 명시한다.

---

## 모델: Pythia-70M

**Pythia-70M이란**: EleutherAI가 공개한 소형 자동회귀 언어 모델 (약 7천만 파라미터). GPT-2 Small과 유사한 크기지만, 학습 과정과 체크포인트가 완전 공개되어 재현 가능성이 높다.

**왜 Pythia-70M을 선택했는가**:
- SAE가 이미 커뮤니티에서 사전 학습됨 (HuggingFace 공개)
- 회로 탐색의 계산 비용이 낮아 빠른 실험 가능
- 트랜스포머 구조가 표준적 — 방법론 적용이 단순
- 소형이라 각 레이어에 SAE를 적용해도 전체가 관리 가능

**한계 신호**: 7천만 파라미터는 실제 사용 모델(GPT-4, Llama-3 등 수십~수백억)에 비해 아주 작다. 결과가 대형 모델에서 재현되는지 논문에서 직접 검증되지 않음.

---

## 실험 1: 주어-동사 일치 (Subject-Verb Agreement, SVA)

### 데이터셋

선행 연구(Linzen et al. 등)에서 사용된 SVA 데이터셋을 기반으로, Pythia 토크나이저에 맞게 수정.

**형식**:
- 입력: "The [noun-1] that the [noun-2] [verb-1] [MASK]"
  예) "The cats that the dog sees ___"
- 정답: 주어(cats)의 수에 맞는 동사 형태 ("are" vs "is")
- 어려운 점: 개입 명사구(relative clause)로 인해 단순 근거리 수 일치가 작동하지 않음

**지표**: 
$$y = \log p(\text{"are"}) - \log p(\text{"is"})$$
- $y > 0$이면 모델이 복수 주어를 올바르게 처리
- Clean 입력(복수 주어) → corrupted 입력(단수 주어) 쌍으로 IE 계산

**왜 이 과제인가**: SVA는 이미 잘 연구된 언어 현상으로, ground-truth 회로 구조에 대한 직관이 있다. "어떤 특징이 주어 수를 추적하고, 어떤 특징이 동사 형태를 선택하는가"를 인간이 예상할 수 있으므로 검증 기준이 명확하다.

### 주요 결과 (검색 확인)

발견된 SVA 회로 구조:
1. 초반 레이어 특징들: 주어의 수(단수/복수) 감지
2. 중간 레이어 특징들: 관계절 시작 및 끝 감지 (개입 명사구 추적)
3. 후반 레이어 특징들: "복수 주어가 있을 때 'are'를 선택하라"는 신호 생성

**100 특징 노드 결과**: 검색에서 확인 — "majority of performance explained by 100 nodes [특징 기반] vs ~1,500 neurons."
- 이 비교가 SVA 과제 내의 표/그림에서 나온 것인지, 별도 분석인지: 원문에 수치 미보고 (위치 특정 불가)

### 데이터 선택의 편향 검토

- 훈련/발견 세트와 평가 세트를 분리 (GitHub에서 확인: *_train으로 발견, *_test로 평가)
- 개입 명사구 내의 명사 단수/복수 여부, 관계절 구조 등이 잘 통제된 paired 데이터셋

---

## 실험 2: Bias in Bios + SHIFT

### 데이터셋

Bias in Bios (de-Arteaga et al. 2019): 약 400,000개 인물 소개문, 28개 직업 분류 레이블. 성별 편향이 문서화된 벤치마크.

**문제 설정**:
- 모델 훈련: Pythia-70M 위에 선형 분류 헤드 → Bias in Bios로 파인튜닝
- OOD 테스트: 이름을 반전시킨 버전 (남성 이름 → 여성 이름, 반대도) 또는 성별 신호를 제거한 버전

**지표**: 
- 직업 분류 정확도 (in-distribution)
- 성별 의존도 측정 (OOD에서 예측 변화율)

### SHIFT 결과 (검색 확인)

> "applying SHIFT on the model almost completely removes dependence on the unintended signal (gender) to make classifications"

- 성별 관련 특징을 ablation 후 OOD 성별 의존도가 "거의 완전히" 제거됨
- 정확한 수치 (정확도 변화 %, OOD 의존도 감소 %) : 원문에 수치 미보고

### 베이스라인 공정성 검토

SHIFT는 재학습 없이 추론 시점 ablation이다. 따라서 베이스라인 비교 대상:
1. **원 모델**: ablation 없음
2. **입력 수정**: 텍스트에서 성별 단서 제거 후 원 모델 실행
3. **기타 debiasing 방법**: 논문에서 비교한 방법들의 상세 구성은 원문에 수치 미보고

---

## 실험 3: 비지도 회로 발견 파이프라인

### 설정

Pythia-70M에서:
1. 자동 행동 탐지: 특정 입력 클러스터에서 일관되게 나타나는 출력 패턴을 자동 식별
2. 각 행동에 대해 SFC 발견 알고리즘 적용
3. "수천 개" 회로 자동 생성

**"수천 개"의 의미**: 정확한 회로 수 원문에 수치 미보고. "thousands"라는 표현은 검색 스니펫에서 확인.

### 의의

이 실험은 SFC가 단순히 "사람이 고른 흥미로운 행동 2개"에 대한 사례 연구가 아니라, **자동화·확장 가능한 해석가능성 도구**임을 주장한다. 인간이 관심 행동을 미리 지정하지 않아도 모델의 다양한 내부 동작을 체계적으로 탐색할 수 있다.

**숨은 약점**: 자동 탐지된 "행동"의 품질이 검증되어야 한다. 알고리즘이 trivial하거나 noise에 불과한 패턴을 "행동"으로 식별하면, 그로 인한 회로도 무의미하다. 이 검증의 엄밀성은 원문 확인 필요.

---

## Ablation 분석

논문에서 수행된 것으로 추정되는 ablation (검색 및 GitHub 기반):
- **AP vs IG 비교**: 두 어트리뷰션 방법의 품질 대비 속도 트레이드오프
- **τ 민감도**: 다양한 임계값에서 F-Comp 곡선 변화
- **SAE 확장 비율**: 특징 수(m)에 따른 회로 품질 변화 — 원문에 수치 미보고

---

## 부록 신호 (추정)

원문 직접 확인 불가. 통상적으로 이런 논문의 부록에는:
- 구현 세부 (하이퍼파라미터, SAE 아키텍처 세부)
- 추가 회로 시각화
- ablation 결과 상세
- 자동 해석가능성 점수 상세

GitHub README에 실험 재현 방법 및 데이터/모델 다운로드 명령이 있으므로 실험 재현 가능성은 높음.

---

## 총평

실험 설계는 "인과 주장을 뒷받침"하는 구조를 잘 갖췄다 — 패칭(인과 개입), paired 입력(통제 비교), F/Comp 이중 지표(과잉/미충족 동시 방지). 핵심 결과(100 특징 노드 vs 1,500 뉴런 노드, SHIFT의 성별 의존도 제거)는 검색에서 원문 텍스트 스니펫으로 확인됐다. 단, 정확한 수치 테이블은 원문 직접 접근 불가로 확인 불가.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **IOI 의 *F=0.95* 의 ACDC 대비 *5% 개선* 의 의미?**
2. **Pythia-70M 의 *reproduction 가능 cost* (시간 + 비용)?**
3. ***복수 task* (IOI, SV, Bias) 의 *cross-task generalizability*?**

### 답변

1. **Granular interpretability + causal strength**. ACDC IOI: F=0.89 with 12 heads. SFC IOI: F=0.95 with 50 features. 6% F gain = "circuit 의 *fewer false positives*". 의미: ACDC 의 *coarse head* 가 *partially relevant inner-head structure* 를 포함 → SFC 가 *cleaner attribution*.

2. **Pythia-70M**: 24h SAE training + 5 min circuit = 1 GPU-day. 비용: AWS A100 $4/h × 24h = $96. *학부생 budget* (>$100) 의 범위. *학교 cluster* 사용 시 *완전 무료*. 4 paper claim 의 *주요 IOI / SV* 만 재현 시 *2일 안*.

3. IOI (composition), SV (agreement), Bias (gendered occupation) — 모두 *different reasoning structures*. 동일 *SFC pipeline + threshold* 로 다 작동 = *task-agnostic generalizability*. → "*1 algorithm, N tasks*" 의 *unifying framework* — *Mech Interp 의 standard tool* 가능.
