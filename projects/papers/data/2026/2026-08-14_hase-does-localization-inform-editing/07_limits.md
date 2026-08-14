# 6. 가정·한계·반박

> **배경 사다리**: 반증 논문을 읽을 때는 두 겹으로 읽어야 한다. ① 원 주장(ROME 계열)의 어디가 무너졌는가, ② **반증 자체는 어디가 취약한가**. 반증도 논문이므로 반증될 수 있다.

---

## 6.1 명시된 가정 (§8 Limitations, 원문 3항목)

원문 §8은 세 가지를 스스로 못 박는다.

**(1) 데이터의 형태.** verbatim: *"We work only with the CounterFact and ZSRE datasets, which we use as short English prompts with factual completions corresponding to a specific set of relations between subject and object entities. This is a basic form of factual knowledge, and localization and editing analysis may yield different trends for other forms of knowledge."*

**(2) 모델 규모.** verbatim: *"...the conclusions from our analysis may not generalize to models larger than GPT-J (6B parameters) that are known to exhibit phase changes in their behavior under prompting."*

**(3) 기법의 범위.** verbatim: *"We use a particular set of localization and editing methods, including representation denoising and zeroing at the layer level and layer-level MLP editing methods... Our conclusions may not necessarily hold for the breadth of localization and editing methods from work related to this paper, and one should be cautious in applying our conclusions beyond our experimental setting."*

세 항목 모두 **정직하고 구체적**이다. 특히 (2)의 "phase changes" 언급은 저자들이 규모에 따른 상전이 가능성을 실제로 염두에 뒀음을 보여준다.

## 6.2 암묵적 가정 (저자가 말하지 않은 것)

**암묵 가정 1 — 층 단위 집약이 정보를 잃지 않는다.** Causal Tracing은 (토큰 자리 × 층)의 2차원 격자를 산출한다(Figure 2). 그런데 회귀에 들어가는 tracing effect는 **층 축으로 집약된** 단일 스칼라다. 만약 편집 가능성이 "주어 마지막 토큰의 특정 층"처럼 **토큰-층 결합 좌표**에 달려 있다면, 층으로 뭉갠 순간 그 신호가 사라진다. 저자들은 이 집약을 정당화하지 않는다.

**암묵 가정 2 — "저장"과 "표현 안에 실려 흐름"이 같은 것이다.** §6에서 저자들은 Causal Tracing이 *"where factual information is carried in representations in a Transformer forward pass"* 를 답한다고 정확히 말한다. 그런데 논문 전체의 프레이밍(제목·Figure 1 캡션의 "stored")은 이를 **저장(storage)** 으로 부른다. 사실 지식이 파라미터에 "저장"돼 있다는 은유 자체가 검증되지 않은 전제이며, 이 은유를 공유하는 한 반증도 원 주장과 같은 개념적 지반 위에 서 있다.

**암묵 가정 3 — 단일 사실 편집이 지식 수정의 대표 사례다.** 실제 응용에서 필요한 것은 수천 개 사실의 일괄 갱신이거나, 사실이 아니라 **행동 성향**의 수정이다. 단일 사실 편집에서 국소화가 무용하다고 해서 대량 편집에서도 그런지는 별개 문제다.

**암묵 가정 4 — 편집기가 층 선택에 대해 "공정하게" 작동한다.** ROME은 원래 중간층 편집을 전제로 설계·튜닝된 기법이다. 이를 1층이나 28층에 적용하면 그 층에서의 성능은 **기법의 설계 편향** 때문에 나쁠 수 있다. 그렇다면 "층이 94.7%를 설명한다"는 결과의 상당 부분은 **모델의 성질이 아니라 편집기의 성질**일 수 있다. 이 구분을 논문은 하지 않는다.

## 6.3 반박 가능한 지점

### 반박 1 — "층 효과 94.7%"는 모델의 사실이 아니라 편집기의 사실일 수 있다

**핵심 주장**: Table 1의 압도적인 층 설명력은 "트랜스포머에서 편집이 잘 먹는 층이 정해져 있다"는 발견처럼 읽힌다. 하지만 ROME은 rank-1 갱신을 중간층 MLP에 적용하도록 유도 편향이 설계된 기법이다. 층별 성능 곡선의 모양이 **모델 구조 때문인지 편집기 설계 때문인지** 분리되지 않았다. 만약 후자라면, 이 논문의 결론은 "국소화가 편집 지점을 예측 못 한다"가 아니라 "**국소화가 ROME의 설계 편향을 예측 못 한다**"라는 훨씬 약한 명제로 축소된다.

**어떻게 검증하는가**: 층별로 **기법을 그 층에 맞게 재튜닝**한 뒤(예: 층마다 학습률·정규화 강도·rank를 따로 최적화) 같은 회귀를 돌린다. 층 설명력이 .947에서 크게 떨어지고 tracing 기여가 상대적으로 커진다면 반박이 성립한다. 그대로면 이 논문의 결론이 강화된다. 부분적으로는 FT(1층/5층)가 이 역할을 하지만, FT도 층별 튜닝을 했는지는 본문에서 확인되지 않는다(Appendix A 확인 필요).

### 반박 2 — 개입의 입도(granularity) 불일치

**핵심 주장**: Causal Tracing은 **표현(activation)** 을 조작해 측정하고, ROME/MEMIT/FT는 **가중치(weight)** 를 조작한다. 서로 다른 수준의 개입이다. 표현 수준 국소화의 결과를 가중치 수준 개입에 적용했을 때 관계가 없다는 것은, **국소화가 무의미하다**가 아니라 **수준 간 번역이 실패한다**는 뜻일 수 있다. 만약 표현 수준 개입(activation steering, 표현 패칭 기반 편집)과 짝지었다면 상관이 크게 나왔을 가능성이 있다.

**어떻게 검증하는가**: 동일한 (fact, layer) 격자 위에서 종속변수를 "**그 층의 표현을 직접 조작해 출력을 바꿨을 때의 성공도**"로 바꿔 회귀를 다시 돌린다. 증분 $R^2$가 유의하게 커지면 반박 성립이고, 이때 이 논문의 결론은 "국소화 ↮ 편집"이 아니라 "**표현 국소화 → 표현 개입은 되고, 가중치 개입은 안 된다**"는 더 정밀한 명제로 바뀐다. 이는 반증이 아니라 **정련**이며, 실무적으로는 오히려 더 유용한 지침이 된다.

### 반박 3 — 선형 $R^2$가 관계를 놓쳤을 수 있다

**핵심 주장**: 증분 $R^2$는 선형(층별 교호작용을 허용해도 각 층 안에서는 여전히 선형) 관계만 잡는다. 예컨대 "tracing effect가 **극단적으로 낮을 때만** 편집이 실패한다"는 임계값형 관계라면, 전체 분산 설명력은 미미해도 **실무적으로는 유용한 규칙**이 된다("tracing effect가 바닥인 층은 피하라").

**어떻게 검증하는가**: tracing effect를 분위수로 나눈 뒤 각 구간의 평균 rewrite score를 비교하거나, 순위 지표(그 사실의 최적 편집 층이 tracing 상위 $k$개 안에 드는 비율)를 계산한다. 후자는 **의사결정에 직결되는 형태**의 질문이며, 이 논문이 답하지 않았다.

## 6.4 재현성 평가

| 항목 | 평가 |
|---|---|
| **코드 공개** | ✅ `github.com/google/belief-localization` (초록에 명시, Google 조직 계정) |
| **데이터 공개** | ✅ CounterFact·ZSRE 모두 공개 벤치마크 |
| **모델 공개** | ✅ GPT-J·GPT2-XL 모두 공개 가중치 |
| **하이퍼파라미터** | △ 본문에는 $\sigma=0.094$·window 5·층 스윕만. 나머지는 Appendix A 위임 |
| **분산/불확실성 보고** | △ $p$-값은 표에 있으나(Table 3), **$R^2$의 신뢰구간이나 부트스트랩 분산은 확인되지 않음**. 시드 반복 여부도 본 실행에서 확인 못 함 |
| **부록 재현 결과** | ✅ ZSRE·GPT2-XL 재현이 부록에 존재 (다만 질적 서술 중심) |

**종합**: 재현 가능성은 이 논문의 강점이다. 편집 실험은 GPU 시간이 들지만 6B 모델이라 학술 환경에서 재현 가능한 규모이고, 코드·데이터·모델이 모두 공개돼 있다. 다만 **$R^2$ 차이의 불확실성 정량화가 약하다** — 결론이 ".001 vs .032" 같은 작은 숫자들의 비교에 의존하는 만큼, 부트스트랩 신뢰구간이 있었다면 훨씬 단단했을 것이다.

## 6.5 이 절의 결론

이 논문의 반증은 **"국소화 무용론"이 아니라 "국소화-편집 자동 번역 금지"** 로 읽어야 정확하다. 그리고 그 반증 자체도 세 군데(층 효과의 정체, 개입 입도 불일치, 선형성 가정)에서 정련의 여지를 남긴다. 정련의 방향은 논문을 무너뜨리는 쪽이 아니라 **명제를 더 정확하게 만드는 쪽**이다.
