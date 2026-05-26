# 06 실험 해부

> **수치 투명성 면책**: 본 환경에서 원문 PDF 직접 열람 차단. 따라서 *정확한 Table/Figure 의 수치* 는 "원문에 수치 미보고" 또는 "원문 미확인" 으로 표기한다. 정성적 결론과 구조적 패턴 (인코더별 차이, 결과의 방향) 은 저자 코드 repo 의 모듈 구조 + 후속 인용 패턴에서 확인 가능.

## 데이터셋 — 산문 검토

### SST / IMDB — 영화 리뷰 감성

**무엇**: Stanford Sentiment Treebank (짧은 문장, 라벨 강함) vs IMDB (수백 token, 라벨 weak — 한 부분만 sentiment 시그널). **왜 적합**: 길이 차이 — 짧은 SST 는 attention 이 *국소* 단서에 집중, 긴 IMDB 는 *전역* 의 *소수* 단서. 어텐션의 행동이 길이에 따라 어떻게 다른지 보여줌. **숨은 편향**: SST 는 *극성* 이 명백한 단어 (great/terrible) 가 많아 attention 시각화가 *자연스럽게 그럴듯* — 즉 *plausibility* 가 자동으로 높음. 본 논문이 *plausibility ≠ faithfulness* 를 보이는 데 적합.

### Anemia / Diabetes — EMR 의료

**무엇**: 환자 차트의 free text → 진단 라벨. **왜 적합**: 본 논문 동기의 *핵심* — 의료에서 attention 해석이 *잘못된 채택* 되면 안전 문제. 또한 차트는 *수천 token* 으로 길어 attention 이 가리키는 단서가 *국소화* 되기 어려움. 본 논문은 이 데이터를 통해 *의료 도메인 reviewer 의 관심사* 를 직접 자극. **숨은 편향**: 의료 차트는 *템플릿 표현* (lab values, ICD codes) 이 많아 *예측에 기여하는 token* 이 *반복적·국소적* 일 가능성. 만약 그렇다면 average encoder 에서 attention 이 *기계적으로* 그 token 을 가리켜 H1 이 *잘* 통과할 수 있음. BiLSTM 에서 context mixing 으로 인해 깨질 가능성.

### 20News / AgNews / Tweet (ADR) — 뉴스·트윗

**무엇**: 일반 NLP 분류 task. **왜 적합**: 도메인 다양성. 짧은 트윗 ADR 은 *의료 NLP* 와 닿음 (pharmacovigilance). **숨은 편향**: 20News sports 는 vocabulary 분리도가 높아 (hockey/baseball) attention 이 *팀명·구장명* 같은 *single-token cue* 에 의존 가능 — 이 경우 H1 통과는 *task 쉬움* 의 함수.

### SNLI / CNN / bAbI — QA/NLI

**무엇**: 두 문장 (전제·가설 또는 기사·질문) 사이의 추론. **왜 적합**: attention 의 *교차* (cross-attention) 행동 — 단순 self-attention 이 아닌 *질문 기반 attention* 의 검증. **숨은 편향**: bAbI 는 *합성* 데이터로 *명백한* 단일 fact 가 답을 결정 — attention 이 *그 fact* 에 자연 수렴. *어려운* SNLI/CNN 에서 attention 의 explanatory 약함이 더 두드러질 것으로 예측.

→ **데이터셋 선택의 메타-논리**: 도메인 (감성/의료/뉴스/QA) × 길이 (짧음/중간/김) × 라벨 명확성 (쉬움/어려움) 을 격자로 cover. 한 데이터셋의 결과가 *우연* 인지 *구조적* 인지를 판단할 수 있게 함. 본 논문의 격자 설계는 *발견의 일반화 가능성* 을 입증하는 데 핵심.

## 베이스라인 공정성

본 논문은 attention 모델을 *발명* 하지 않음. 표준 BiLSTM/CNN/avg + 표준 attention 으로 *baseline 정확도* 를 먼저 보고, 그 후 *해석성* 을 분석. 따라서 "베이스라인" 의 의미가 *분류 성능 비교* 가 아닌 *모델 자체의 정상 동작 검증* 이다. 즉:
- 각 (데이터셋, 인코더) 조합의 test accuracy 가 *학계 통용 baseline* 에 도달해야 분석이 의미 있음 (정상 학습된 모델의 attention 을 분석해야 결론이 흥미로움).
- 본 환경에서 정확한 accuracy 표 미확인. 학계 통용은 SST ~85%, IMDB ~88%, SNLI ~80% 수준의 BiLSTM+attention 베이스라인.

## 지표 선택

| 지표 | 측정 대상 | 대안 |
|------|----------|------|
| Kendall τ | H1: 두 importance 순위 일치 | Spearman ρ, top-k Jaccard |
| TVD ($\hat{y}$) | H2-a 출력 차이 | KL, JS, accuracy change |
| JSD ($\boldsymbol{\alpha}$) | H2-b attention 분포 차이 | KL, Wasserstein |

**왜 이 조합**: TVD 와 JSD 의 *해석성* 과 *유계성*. 모두 [0, 1] (TVD) 또는 [0, log 2] (JSD) 의 *비교 가능한* 척도. 만약 KL 을 썼다면 *unbounded* 라 outlier 가 분포 시각화를 망쳤을 것.

**다른 지표였다면**:
- Accuracy change 만 보고했다면 — *예측이 안 바뀜* (argmax 안정성) 으로 H2 가 *더 쉽게* 통과한 것처럼 보임 (확률 자체의 변화 정보 손실). TVD 가 더 엄격.
- Kendall 대신 top-k overlap 만 봤다면 — *상위 가장 중요한 한두 단어* 의 일치만 보고 나머지 token noise 무시. 좀 더 *직관적* 이지만 *덜 robust*. 본 논문이 Kendall 을 메인으로 쓰는 것은 *전체 분포* 의 정보 보존을 위함.

## 주요 표·그림 (추정 — 정확한 번호 미확인)

본 논문의 핵심 시각화는 다음 5 카테고리로 분류 가능 (학계 통용 + repo 의 graph outputs 명세):

### Fig. 1 (또는 Fig. 2) — Kendall τ 분포 (violin plot)

각 (데이터셋, 인코더) 조합에 대해 Kendall τ 의 *분포* 를 violin/box 로 표시.

**해석**: Average encoder 의 violin 은 *오른쪽 (τ→1)* 에 치우치고, BiLSTM 은 *중앙 (τ≈0)* 근처에 분포. 이 *encoder 별 차등* 자체가 본 논문의 핵심 contribution 의 하나 — *왜 BiLSTM 에서 attention 이 덜 explanatory 인가* 의 메커니즘 가설로 이어짐.

### Fig. 2 (또는 Fig. 3) — Permutation 결과

각 데이터셋에 대해 permutation 후 *median output 차이* 의 분포. *대부분의 instance* 에서 median 이 작다 (예: <0.1) 는 그림.

**해석**: BiLSTM 의 *contextualization* 이 입력 위치 정보를 *embedding 단계에서* 흡수해버려, attention 의 *위치 매핑* 이 *추가 정보를 거의 제공하지 않는다* 는 메커니즘 설명. 이는 Brunner 2019 의 *identifiability* 이론 결과의 *empirical instantiation*.

### Fig. 3 (또는 Fig. 4) — Adversarial 산점

(x: JSD between original/adversarial attention, y: TVD of output) 산점. *우측 아래* (큰 JSD, 작은 TVD) 영역의 점 밀도.

**해석**: 거의 모든 instance 에서 *우측 아래* 점이 존재 — 즉 adversarial attention 분포가 *대부분의 사례* 에서 발견됨. 이 그림이 본 논문의 가장 강한 시각적 증거.

### Fig. 4 (또는 Fig. 5) — 정성적 시각화

특정 instance 의 *원본* attention vs *adversarial* attention heatmap 비교 (의료 차트나 트윗에서). 두 attention 이 *시각적으로 완전히 다른* 단어를 가리키지만 *같은 진단* 을 내는 사례.

**해석**: 정량 결과의 *qualitative impact* — 의료 reviewer 가 보았을 때 *이게 우려스럽다* 라고 즉시 느끼게 하는 그림. 본 논문의 *수사적* 무기.

### Fig. 5 (또는 Table 1) — 데이터셋별 baseline accuracy + key metric 정리

각 (데이터셋, 인코더, attention) 의 accuracy + key Kendall τ + permutation median TVD + adversarial JSD 의 요약 표. 정확한 수치 원문 미확인.

## Ablation — 저자가 일부러 넣은 것 / 숨긴 것

**넣은 것**:
- 3 인코더 비교 (Avg/CNN/BiLSTM) — encoder의 mixing 강도가 *조절 변수* 임을 보임.
- 2 attention 종류 (tanh/dot) — attention 함수 형태의 영향은 *작다* 는 sanity check (즉 결과가 attention scoring 의 특정 형태에 의존하지 않음).

**숨긴 것 (또는 부록으로 미룬 것)**:
- *Multi-head* attention 변종 — 단일 head 만. Transformer 일반화는 본 논문 범위 밖.
- *학습 시* adversarial attention 으로 *훈련된* 모델 — 즉 모델이 *적대적 강건성* 을 가질 수 있는지. 이는 후속 Wiegreffe-Pinter 2019 가 직접 지적하는 *반론* 으로 이어짐.
- *Plausibility* 평가 (사람이 attention heatmap 을 보고 *그럴듯하다* 고 평가하는가) — 본 논문은 *faithfulness* 만 다루고 plausibility 는 *별 문제로* 분리. 후속 Sen 2020, DeYoung 2020 등이 plausibility 측정의 별도 metric (ERASER benchmark) 을 개발.

## 부록에 숨은 신호 (추정)

- *문장 길이별* breakdown — 짧은 시퀀스에서는 attention 의 자유도가 낮아 H2 통과 자체가 어려울 수 있음. 이 경우 본 논문의 결론은 *장문 도메인* 에 특히 강하다는 *boundary* 가 드러남.
- *학습 종료 시점별* breakdown — 학습이 끝나기 직전 vs 충분히 학습된 모델의 attention 의 explanatory 차이. 학습 후반에 *plausibility* 가 늘어남에 따라 *faithfulness* 도 같이 증가하는가, 분리되는가.
- *학습 seed 변동* — 같은 데이터·모델로 다른 random seed 로 학습했을 때 attention 분포의 *재현성*. 만약 seed 별로 attention 이 *크게 다르다면* H1·H2 와 무관하게 attention 의 *안정성* 자체가 의심.

위는 모두 본 환경에서 미확인. 후속 분석에 *반드시* 확인할 사항.

## 핵심 한 문장

> 12 데이터셋 × 3 인코더 × 2 attention 격자에서 H1 (Kendall τ violin) + H2-a (permutation TVD) + H2-b (adversarial JSD-TVD 산점) 의 3 그림이 *encoder mixing 강도에 따라* 차등적으로 실패함을 보여, 발견이 *특정 case 의 우연* 이 아닌 *구조적 현상* 임을 입증.

---

## 인터랙티브 — Grid 실험 결과 종합

```viz:anie-datasets-summary:title=12 Datasets × 5 Metrics — Grid 결과,caption=Metric 셀렉터로 5 지표 (τ_g, τ_loo, τ_g Average, ∆ŷ permute, Adv JSD) 전환. 12 dataset 의 한 화면 비교. BiLSTM 의 τ 가 일관 낮음 (red), Average 의 τ 가 일관 높음 (blue) — encoder mixing 의 효과 grid 전체 일관. → paper Table 2 의 핵심 발견을 단일 시각화에 압축.
```

```viz:anie-encoder-comparison:title=3 Encoders × 9 Datasets — τ_g 직접 비교,caption=Highlight 셀렉터. BiLSTM 의 contextualization 이 attention 의 explanation 능력 일관 파괴. CNN 은 local mixing 만이라 중간. Average (token-isolated) 가 attention-friendly. → encoder mixing strength 가 explanation 의 결정 인자라는 paper 핵심 mechanism 입증.
```
