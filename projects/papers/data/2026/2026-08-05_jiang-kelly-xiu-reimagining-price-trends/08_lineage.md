# 7. 이론적 계보

## 배경 사다리

계보를 읽는 목적은 "이 논문이 무엇의 후손이고 무엇의 조상인가"를 특정해, **인용할 때 어느 문장에 붙일지**와 **후속 연구의 빈 자리가 어디인지**를 아는 것이다. 아래에서 원문이 실제로 인용한 조상만 "조상"으로 다루고, 원문이 인용하지 않은 평행 연구는 그렇다고 명시한다.

---

## 이론적 조상 4편

### ① Lo, Mamaysky, Wang (2000) — 의제(agenda)의 직계 부모

**연결선**: 본 논문이 자기 위치를 정의하는 좌표다. 원문 §서론(p.3197) verbatim: 자신의 작업을 "**a continuation of the agenda set forth by Lo, Mamaysky, and Wang (2000)**, but with a retooled research design benefitting from 20 years of progress in machine learning and computer vision"이라고 규정한다. 그리고 논문 맨 앞 제사(epigraph)로 이들의 문장을 인용한다 — 기술적 분석이 살아남은 이유가 "시각적 분석 양식이 인간 인지에 더 부합하고, 패턴 인식은 컴퓨터가 절대 우위를 갖지 못한 몇 안 되는 반복 활동이기 때문(**yet**)"이라는 대목이다.

**무엇이 계승되고 무엇이 교체되었나**: 계승 = "차트 패턴을 알고리즘으로 다루자"는 의제. 교체 = 도구. LMW는 커널 회귀로 시계열을 평활한 뒤 국소 극값 배열로 **사람이 이미 명명한 패턴**(머리와 어깨 등)을 자동 탐지했다. 본 논문은 명명 단계 자체를 제거하고 CNN이 패턴을 발견하게 한다. 즉 **"자동 탐지"에서 "자동 발견"으로의 이동**이다.

**아이러니한 반전**: 본 논문의 §IV.C는 **LMW가 탐지 대상으로 삼았던 그 패턴들을 반박한다** — 23개 교과서 패턴 중 유의한 13개에서 8개가 역방향. 즉 부모의 의제는 계승하면서 부모가 다룬 대상의 타당성은 부정한다.

### ② Gu, Kelly, Xiu (2020) — 방법론 인프라의 직계 부모

**연결선**: 원문 §II.C 첫 문장(p.3204) verbatim: "Our workflow from training, to model tuning, and finally to prediction follows the basic procedure outlined by Gu, Kelly, and Xiu (2020)." 상속 항목이 구체적이다 — 학습/검증/테스트 분할 설계, Xavier 초기화·Adam·배치정규화·드롭아웃·early stopping의 정규화 세트, **5회 독립 재학습 후 예측 평균**의 앙상블 관행, 그리고 §IV.A 각주 12에서 특성 정의를 "table A.6 of Gu, Kelly, and Xiu (2020)"에 위임한다.

**무엇이 교체되었나 — 이 논문의 전부**: GKX의 입력은 **사람이 정의한 수백 개 firm characteristic 벡터**였다. 본 논문의 입력은 **원시 픽셀 행렬**이다. 파이프라인의 나머지는 전부 동일하다. 즉 본 논문은 **"GKX의 입력 슬롯 하나를 교체한 실험"** 으로 정확히 요약된다.

**사용자에게 특별한 함의**: `_index.md` "사전 독파 논문"에 GKX 2020이 등재되어 있으므로, 사용자는 이 논문의 하부구조를 이미 알고 있다. **새로 흡수할 것은 "입력 교체" 한 겹 + 그 교체가 드러낸 척도 효과(Table IX)뿐이다.**

### ③ Sullivan, Timmermann, White (1999) → Bajgrowicz, Scaillet (2012) — 회의론이라는 조상

**연결선**: 이 계보는 특이하다 — **본 논문에 반대하는 진영이 본 논문의 측정 도구를 제공했다.** STW는 7,846개 기술적 룰 우주를 구축하고 데이터 스누핑 보정을 적용해 BLL(1992)의 26개 룰이 게재 후 표본에서 유의성을 잃었음을 보였다. BS(2012)는 같은 우주를 FDR 통제로 재검토해 **유의한 룰이 하나도 없다**는 더 강한 회의론에 도달했다.

**본 논문의 재활용**: §IV.C(p.3230–3231)에서 이 7,846개 룰을 폐기하지 않고 **성능 비교의 참조 분포**로 쓴다. 각 룰을 종목별 신호로 만들어 동일한 10분위 롱숏을 구성하고, 그 샤프 분포 안에서 CNN의 백분위를 잰다(Figure 8: 주간 0/7,846). 저자들이 Scaillet에게서 코드를 받았다는 각주 13이 이를 가능하게 했다.

**교훈**: 이것이 이 논문의 가장 영리한 방법론적 수다. "당신들이 고른 벤치마크가 약했던 거 아니냐"는 반박을 원리적으로 차단하려면, **회의론자가 구축한 룰 우주 전체를 상대로 백분위를 제시**하면 된다.

### ④ Brock, Lakonishok, LeBaron (1992) — 문제 설정의 조상

**연결선**: 26개 사전정의 기술적 룰이 유의한 성과를 낸다는 최초의 대규모 실증. 본 논문 §IV.C 도입부(p.3230)가 이를 첫 문장으로 인용한다. BLL은 "기술적 분석을 학술적으로 검정 가능한 대상으로 승격"시켰고, 그 결과 STW·BS의 다중검정 반격이 가능해졌으며, 그 반격이 본 논문의 "사전정의를 포기하자"는 동기를 만들었다. **BLL → STW/BS → 본 논문은 하나의 논증 사슬이다.**

---

## 평행 연구 — 비슷한 시기, 다른 접근

### ⓐ Liu, Zhou, Zhu (2020) — 유전 프로그래밍 + 직접 전이 (원문이 concurrent work로 명시)

원문 §V.A 각주 15(p.3233) verbatim: "The direct-transfer approach similar to what we propose here is rare, with the exception of a **concurrent paper by Liu, Zhou, and Zhu (2020)**, which applies their genetic programming model trained with U.S. data directly to G7 international markets."

**대비**: 두 논문 모두 "미국 학습 → 국제 직접 전이"를 한다. 차이는 **발견 엔진**이다 — LZZ는 유전 프로그래밍(수식 트리를 진화시켜 신호를 탐색), 본 논문은 CNN(픽셀에서 필터를 학습). **누가 이겼는가**: 판정 불가. 원문은 성능을 직접 비교하지 않고 존재만 인정한다. 다만 **해석 가능성에서는 유전 프로그래밍이 유리하다** — 결과물이 명시적 수식이므로 사람이 읽을 수 있다. 본 논문은 §IV 전체를 해석에 쓰고도 로지스틱 근사로 35% 설명에 그친다. **원거리(§F) 후속 커버 후보**로 기록할 가치가 있다.

### ⓑ 컴퓨터과학 진영의 price-plot CNN 계열 (원문이 인용하며 비판)

원문 §서론(p.3197–3198)이 목록화한다 — Chen et al.(2016), Hoseinzade·Haratizadeh(2019), Kim·Kim(2019), Lee·Kim·Koh·Kang(2019). 저자들의 평가: "These papers give a short description of methods and present small-scale empirical analyses." 그리고 **대다수가 개별 종목이 아니라 종합주가지수의 시계열 예측**을 했다. Hu et al.(2018)은 가격 플롯 CNN으로 종목을 군집화, Cohen·Balch·Veloso(2020)는 기술적 패턴(볼린저밴드 교차·MACD·RSI) 이미지를 분류 — **둘 다 수익률을 예측하지 않았다.**

**왜 본 논문이 이겼는가**: 세 가지 — ① **해상도**(개별 종목 vs 지수), ② **규모**(CRSP 전체 27년 vs 소규모), ③ **자산가격 문헌의 평가 프로토콜**(10분위 정렬·H-L·표본외 분리·거래비용·다중검정 참조 분포). 저자 주장(p.3198): "no prior paper to date performs a large-scale, thorough, and methodologically transparent analysis of return prediction for individual stocks with the fine granularity that is standard in empirical asset pricing research." **교훈: 같은 아이디어라도 평가 프로토콜의 엄밀성이 게재 저널을 결정한다.** (사용자가 ML 학회를 목표로 할 때 거꾸로 적용할 교훈 — ML 학회에서는 seed 분산·정확도 지표가 그 역할을 한다.)

### ⓒ `ts-as-2d` 계열 — 이미 커버한 세 정거장 (원문은 인용하지 않는다)

**중요한 명시**: 아래 세 논문은 **본 논문이 인용하지 않는다.** 금융 저널과 ML 학회의 문헌이 분리되어 있기 때문이다. 그러나 `_coverage.md` 계보상 직접 평행 관계이므로 대비할 가치가 있다.

| 논문 (커버일) | 2D 만드는 방식 | 1D 동일-척도 대조군 |
|---|---|---|
| **GAF/MTF** (Wang·Oates, IJCAI 2015 — 2026-06-24 ✓) | 시간 $i$와 $j$의 **쌍**을 픽셀 $(i,j)$에 인코딩 → **진짜 2차원 정보** | ❌ 없음 |
| **TimesNet** (Wu et al., ICLR 2023 — 2026-05-13 ✓) | 주기 길이로 1D를 접어 2D 텐서화 → 주기내·주기간 변동 분리 | ❌ 없음 |
| **VisionTS** (Chen et al., ICML 2025 — 2026-06-10 ✓) | 시계열을 이미지로 렌더 후 사전학습 vision MAE 사용 | ❌ 없음 |
| **본 논문** (JF 2023) | OHLC 바를 픽셀로 렌더 → **가로=시간, 세로=값이므로 실질적으로 1D의 시각화** | ✅ **Table IX** |

**이 표가 계보상 가장 중요한 발견이다.** `ts-as-2d` 계열 네 논문 중 **1D 동일-척도 대조군을 세운 것은 본 논문뿐이고, 그 대조군이 2D의 우위를 지지하지 않았다.** 그리고 아이러니하게도 본 논문의 "2D"는 네 개 중 **가장 약한 형태의 2D**다 — GAF는 시간 쌍을 픽셀에 담아 진짜 2차원 관계를 만들지만, 차트 이미지는 가로축이 시간이고 세로축이 값이므로 각 시간 열이 하나의 값(집합)만 담는다.

**따라서 정확한 결론은**: 본 논문의 Table IX는 **"2D 인코딩이 무용하다"의 증거가 아니라 "차트 렌더링은 가짜 2D였다"의 증거**다. GAF/TimesNet 같은 진짜 2D 인코딩에 대해서는 동일한 1D 대조군 실험이 **아직 수행되지 않았다.** 이것이 계보에 남은 가장 큰 빈 자리다.

---

## 후손 예측 3개

### 후손 1 — 진짜 2D 인코딩에 대한 1D 대조군 감사 (아직 없음)

**논리**: 위 표에서 도출된다. 본 논문이 차트 렌더링에 대해 한 일(척도 vs 차원 분해)을 GAF/MTF·recurrence plot·TimesNet 스타일 접힘에 대해 반복하면, `ts-as-2d` 계열 전체의 이득이 **어디까지 척도 효과이고 어디부터 진짜 2차원 관계인지** 판정할 수 있다. **예상 결과**: GAF는 시간 쌍 정보를 실제로 추가하므로 1D 대조군을 상회할 것이고, TimesNet의 주기 접힘도 주기 구조가 강한 데이터에서는 상회할 것이다. 반면 "렌더링" 계열(VisionTS 포함)은 본 논문처럼 척도 효과로 대부분 설명될 것이다. — 이 예측이 §9와 §10의 실험 아이디어로 이어진다.

### 후손 2 — 차트 이미지에 대한 mechanistic interpretability

**논리**: [06_experiments_b](06_experiments_b_interpret_transfer.md)에서 확인한 공백이다. 본 논문은 이미지 + CNN을 쓰면서 **컴퓨터비전 해석론의 표준 도구를 하나도 쓰지 않았다** — 필터 시각화(Zeiler·Fergus 2014, 저자들이 채널 증식 논거로 인용한 바로 그 논문), Grad-CAM 계열 saliency, 활성화 최대화, 채널 절제, 회로 발견 중 무엇도 없다. §IV의 해석은 전부 **행동적 프로빙**(입출력 관계 관찰)에 머문다.

이 공백을 채우는 연구는 "CNN이 차트의 어느 영역을 보나"를 히트맵으로 직접 답할 수 있고, 저자들이 로지스틱 근사로 힘들게 추론한 결론($\tfrac{1}{2}(\text{High}+\text{Low})-\text{Close}$, 첫 lag이 가장 중요)을 **직접 검증**할 수 있다. 나아가 채널 절제로 "이 채널을 죽이면 성능이 얼마나 떨어지나"라는 **인과적** 질문에 답할 수 있다 — 상관 기반 프로빙이 원리적으로 답할 수 없는 것이다.

### 후손 3 — 계층적 베이즈 전이 (저자가 직접 지목)

**논리**: 저자들이 §V.A 끝(p.3236)에서 명시적으로 제안한다 verbatim: "A direction for further optimization of image-based prediction models would **combine a global image model to capture shared differences with a country-specific model that accommodates some degree of heterogeneity. The model weights in this combination could be dictated by the relative informativeness of global and country-specific data in a Bayesian fashion.**"

이는 Figure 9의 발견(전이 이득 ∝ 1/시장규모)에 대한 자연스러운 해법이다 — 작은 시장은 전역 모델에 강하게 축소(shrink)하고, 큰 시장은 현지 모델에 가중을 준다. 계층적 축소는 자산가격 문헌에 이미 도구가 있으므로(경험적 베이즈, Bayesian shrinkage) 구현 장벽이 낮다.

**동일 논리의 시간척도 버전이 더 흥미롭다**: Table XI에서 전이 신호와 기준선 신호의 상관이 42%뿐이라 50/50 결합이 각각보다 좋았다(2.5 > 2.2, 2.1). 이 50/50이라는 임의의 가중을 **정보량 기반 최적 가중**으로 바꾸면 추가 이득이 있을 것이다.

---

## 계보 요약 — 한 그림

```
Brock·Lakonishok·LeBaron 1992  ────┐  (룰이 통한다)
                                    │
Sullivan·Timmermann·White 1999 ────┤  (7,846 룰 + 다중검정 → 회의)
Bajgrowicz·Scaillet 2012       ────┤   └──→ 본 논문이 참조 분포로 재활용 (Fig 8)
                                    │
Lo·Mamaysky·Wang 2000          ────┤  (커널 회귀로 명명된 패턴 자동 탐지)
   └─ 의제 계승 / 대상은 §IV.C에서 반박
                                    │
Gu·Kelly·Xiu 2020              ────┤  (자산가격 ML 파이프라인)  ★사용자 사전 독파
   └─ 입력 슬롯만 교체: 특성 벡터 → 픽셀
                                    ▼
                    ★ Jiang·Kelly·Xiu 2023 (JF) ★
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
 [후손 1] 진짜 2D 인코딩의       [후손 2] 차트 CNN의        [후손 3] 계층적 베이즈
 1D 대조군 감사                  mechanistic interp        전이 (저자 직접 지목)
 (GAF/TimesNet 계열)             (필터·saliency·절제)      (국가/시간척도 최적 가중)
        │                           │
        └─ 평행: GAF/MTF(06-24 ✓)  └─ 평행: 사용자 APF 프레임
           TimesNet(05-13 ✓)           (PE → 2D motif → CNN probe
           VisionTS(06-10 ✓)            → causal intervention)
           — 셋 다 1D 대조군 없음
```
