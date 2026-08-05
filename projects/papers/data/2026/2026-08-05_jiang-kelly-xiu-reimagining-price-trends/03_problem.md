# 2. 문제 지형도

## 배경 사다리

이 절을 이해하려면 세 가지만 알면 된다. ① **"수익률 예측"은 곧 "시장이 완전히 효율적이지는 않다"는 주장**이다 — 과거 가격만 보고 미래를 맞힐 수 있다면, 과거 가격은 이미 가격에 다 반영되어 있어야 한다는 효율적시장가설(EMH)의 약형이 깨진다. ② **"기술적 분석(technical analysis)"** 은 재무제표·뉴스 같은 기본적 정보 없이 **가격과 거래량의 과거 궤적만으로** 예측하는 실무 전통이다. ③ **"다중검정(multiple testing)"** 문제 — 1,000개 규칙을 5% 유의수준으로 검정하면 아무 예측력이 없어도 평균 50개가 "유의"하게 나온다. 이 셋이 아래 100년 논쟁의 축이다.

---

## 이 논문이 푸는 실제 문제

### 현실 상황 1 — 실무는 이미 차트를 보는데, 학계는 그걸 설명하지 못한다

원문 결론부(§VI, p.3240)가 인용하는 숫자가 문제의 크기를 정확히 보여 준다. Menkhoff(2010)의 5개국 692명 자산운용자 설문에서 **87%가 어떤 형태로든 기술적 분석에 의존**하고, **18%는 기술적 분석이 투자 프로세스의 주요 부분**이라고 답했다. 즉 실무의 압도적 다수가 쓰는 도구를, 학계는 대부분 "미신"으로 처리해 왔다. 이 간극 자체가 연구 문제다. 만약 차트 분석이 전부 미신이라면 87%의 전문가가 왜 그것을 쓰는지 설명해야 하고, 미신이 아니라면 무엇이 작동하는지 특정해야 한다.

논문 맨 앞의 제사(epigraph)로 저자들이 Lo·Mamaysky·Wang(2000)을 인용한 것이 이 긴장을 압축한다 (p.3193 verbatim):

> "Nevertheless, technical analysis has survived through the years, perhaps because its visual mode of analysis is more conducive to human cognition, and because pattern recognition is one of the few repetitive activities for which computers do not have an absolute advantage (yet)."

마지막의 괄호 **"(yet)"** 이 본 논문의 존재 이유다. 2000년에는 컴퓨터가 시각적 패턴 인식에서 사람을 못 이겼다. 2012년 이후 컴퓨터 비전 혁명으로 그 전제가 무너졌다. 그렇다면 "차트 읽기"를 컴퓨터에게 시켜 볼 수 있다.

### 현실 상황 2 — 사람이 정의한 신호만 검정하면, 사람이 상상 못 한 패턴은 영원히 발견되지 않는다

모멘텀 하나를 발견하는 데 학계는 수십 년이 걸렸다. Jegadeesh·Titman(1993)이 "과거 3~12개월 승자를 사고 패자를 팔면 이긴다"를 문서화하기까지, 그리고 그것이 표준 팩터로 인정되기까지의 과정은 **사람의 가설 생성 능력이 병목**임을 보여 준다. 원문 §IV.A(p.3220)의 표현이 이 점을 날카롭게 짚는다 — "MOM, STR, and other common price trend variations are predictive features that have been manually curated by human researchers over a decades-long research process. But the CNN is oblivious to human-engineered features."

문제는 이것이다. 만약 예측력 있는 패턴이 **사람이 언어로 명명하기 어려운 형태**(예: "고가-저가 범위 안에서 종가의 상대 위치가 거래량 급증과 동시에 특정 조합을 이룰 때")로 존재한다면, 사전정의 검정 패러다임에서는 **원리적으로 발견 불가능**하다.

### 현실 상황 3 — 저빈도 데이터의 절대적 희소성

§V.B 도입부(p.3236)가 지적하는 문제다. 금융 데이터의 진짜 제약은 횡단면이 아니라 **시계열 차원**이다. 우리는 금융시장의 역사를 **단 하나만** 경험한다 — 월별 관측치는 최대 수백 개, 연별은 수십 개다. 월간·연간 빈도에서 경제적으로 중요한 패턴이 펼쳐지는데, 그 빈도에서는 딥러닝을 학습시킬 데이터가 없다. 동시에 소규모·신흥 시장은 종목 수 자체가 수백 개뿐이다(원문: 일본·캐나다는 월평균 약 3,000종목이지만 **중위 국가는 약 300종목**, p.3233). 데이터가 부족한 곳에서 데이터가 풍부한 곳의 지식을 빌려올 방법이 필요하다.

---

## 기존 접근 계보 (연대순)

### ① Brock·Lakonishok·LeBaron (1992) — "룰이 통한다"의 첫 대규모 실증

**무엇이었나**: 26개의 널리 쓰이는 사전정의 기술적 트레이딩 룰(이동평균 교차, 저항선 돌파 등)을 다우존스 장기 시계열에 체계적으로 적용해, 유의하게 양의 투자 성과를 발견했다.
**왜 부족했나**: 룰을 **사후적으로 선택**했다는 의심을 벗을 수 없었다. 그 26개는 이미 실무에서 유명해진 룰들이고, 유명해진 이유는 과거에 잘 통했기 때문일 수 있다(생존 편향).
**남긴 교훈**: 기술적 분석을 학술적으로 검정 가능한 대상으로 끌어올렸다. 이후 모든 논쟁의 기준점이 되었다.

### ② Sullivan·Timmermann·White (1999) → Bajgrowicz·Scaillet (2012) — 다중검정의 역습

**무엇이었나**: STW는 룰 우주를 **7,846개**로 확장하고, 데이터 스누핑을 통제하는 부트스트랩 리얼리티 체크를 적용했다. 결론은 이분적이었다 — BLL의 26개 룰은 게재 이후(post-publication) 표본에서 유의성을 잃었지만, 더 큰 7,846개 룰 우주 안에서는 유의한 성과의 증거를 찾았다. Bajgrowicz·Scaillet(2012)이 같은 우주를 FDR(false discovery rate) 통제로 재검토하고 **"유의한 룰은 하나도 없다"** 는 더 강한 회의론에 도달했다.
**왜 부족했나**: 이것은 "발견 방법"이 아니라 "검정 방법"의 개선이다. 다중검정을 엄격하게 통제할수록 발견 가능한 것이 줄어드는 구조적 딜레마에 갇힌다.
**남긴 교훈**: 그러나 **본 논문은 이 7,846개 룰을 폐기하지 않고 재활용한다.** §IV.C(p.3230–3231)에서 이 우주를 **"성능 비교의 참조 분포"** 로 쓴다 — 7,846개 룰을 각각 종목별 신호로 만들어 동일한 10분위 롱숏 전략을 구성하고, 그 샤프 분포 안에서 CNN의 위치를 잰다. Scaillet이 코드를 공유해 주었다는 각주 13이 이 재활용을 가능하게 했다. **회의론자의 무기를 그대로 빌려 자기 성능의 자를 만든 것**이 이 논문의 가장 영리한 수사적·방법론적 수다.

### ③ Lo·Mamaysky·Wang (2000) — "자동 패턴 인식"의 첫 시도

**무엇이었나**: 커널 회귀(kernel regression)로 가격 시계열을 매끄럽게 만든 뒤, 그 위에서 국소 극값(peak·trough)의 배열로 "머리와 어깨", "쌍바닥" 같은 기술적 패턴을 **알고리즘적으로 식별**했다. 사람의 눈 대신 통계적 정의를 준 것이다.
**왜 부족했나**: 여전히 **찾을 패턴의 목록을 사람이 먼저 정했다.** 커널 평활은 발견 도구가 아니라 사람이 이미 명명한 패턴을 자동 탐지하는 도구다.
**남긴 교훈**: 본 논문이 자기 위치를 정의하는 좌표다 — 원문 §서론(p.3197)은 자신의 작업을 "a continuation of the agenda set forth by Lo, Mamaysky, and Wang (2000), but with a retooled research design benefitting from 20 years of progress in machine learning and computer vision"이라고 규정한다. 의제는 같고, 도구가 20년 진화했다.

### ④ Han·Zhou·Zhu (2016) TREND — 사전정의 신호의 최전선

**무엇이었나**: 단기·중기·장기 가격 추세를 결합한 추세 신호. 본 논문에서 **가장 강한 벤치마크**로 기능한다.
**왜 부족했나(혹은 왜 중요한가)**: Table I에서 TREND의 동일가중 H-L 샤프는 2.92, WSTR은 2.84로 4개 벤치마크 중 최상위다. 그런데 CNN의 7.15에는 크게 못 미친다. **즉 "사전정의 신호를 가장 정교하게 조합한 최선"과 "정의하지 않고 학습한 것" 사이에 2.4배의 격차**가 있다는 것이 논문의 핵심 대비다.
**남긴 교훈**: 사전정의 신호 조합의 상한을 실증적으로 표시해 주었다.

### ⑤ Gu·Kelly·Xiu (2020) — 자산가격 ML의 방법론 인프라

**무엇이었나**: 수백 개 firm characteristic을 입력으로 다양한 ML 모형(선형, 트리, 신경망)의 수익률 예측력을 체계 비교한 작업. 학습/검증/테스트 분할, 정규화 세트, 성능 평가 프로토콜의 표준을 세웠다.
**왜 부족했나**: **입력이 여전히 사람이 만든 특성 벡터**였다. ML을 "많은 사람-정의 특성을 비선형 결합하는 도구"로 썼을 뿐, 특성 자체의 발견은 사람 몫이었다.
**남긴 교훈**: 본 논문은 이 논문의 파이프라인을 **그대로 상속하고 입력만 바꾼다**(§II.C 첫 문장이 명시). 사람-정의 특성 벡터 → 원시 픽셀 행렬. 이 교체가 본 논문의 전부이자 핵심이다. (사용자가 이미 읽은 논문이므로, 본 해체에서 새로 흡수할 것은 정확히 이 "입력 교체" 한 겹이다.)

### ⑥ 컴퓨터과학 쪽의 선행 시도들 — 규모와 엄밀성의 부재

원문 §서론(p.3197–3198)이 별도 단락으로 정리한다. Chen et al.(2016), Hoseinzade·Haratizadeh(2019), Kim·Kim(2019), Lee·Kim·Koh·Kang(2019) 등이 가격 플롯 + CNN을 시도했으나 저자들의 평가는 냉정하다 — "These papers give a short description of methods and present small-scale empirical analyses." 그리고 **대다수가 개별 종목이 아니라 종합주가지수의 시계열 예측**을 했다. Hu et al.(2018)은 가격 플롯 CNN으로 종목을 군집화했고, Cohen·Balch·Veloso(2020)는 특정 기술적 패턴(볼린저밴드 교차, MACD, RSI)이 있는 이미지를 분류했지만 **둘 다 수익률을 예측하지 않았다**. 저자들의 자기 위치 주장: "To our knowledge, no prior paper to date performs a large-scale, thorough, and methodologically transparent analysis of return prediction for individual stocks with the fine granularity that is standard in empirical asset pricing research."

---

## 기존 방법들이 공통으로 놓친 핵심 gap

> **모든 선행 연구는 "무엇을 찾을지"를 사람이 먼저 정했고(①②③④⑤), 그 제약을 푼 소수의 시도는 개별 종목 수익률이라는 자산가격 연구의 표준 해상도에 도달하지 못했다(⑥).**

## 이 논문이 gap을 메우는 방식

저자들이 §서론(p.3195)에서 스스로 규정한 긴장 구조가 답이다. 두 개의 상충하는 요구가 있다 — **유연성**(복잡한 패턴을 찾을 만큼 자유로워야 한다)과 **해석 가능성·다루기 쉬움**(찾은 패턴을 이론에 되먹일 수 있어야 한다). 원문 표현: "On the one hand, we prefer a method that is flexible enough to find potentially complex predictive patterns. On the other hand, we prefer a method that is tractable and constrained enough that we can interpret those patterns to inform future theory."

이 절충을 **아키텍처 수준의 제약**으로 해결한다. 완전연결 신경망에 픽셀을 벡터화해 넣으면 유연하지만 파라미터가 폭발하고 위치·척도에 취약하다. CNN은 **파라미터 공유(parameter sharing)** 와 **희소 상호작용(sparse interactions)** 이라는 두 개의 강한 교차-파라미터 제약(Appendix, p.3244–3245)을 걸어 유연성을 유지한 채 파라미터를 줄이고, 나아가 **평행이동 등변성(translation equivariance)** 을 얻는다 — 같은 필터를 이미지 전 위치에 균일하게 적용하므로 패턴이 어디에 나타나도 감지한다.

**금융 문제에서 평행이동 등변성이 왜 결정적인가**: "5일 전에 급락 후 반등"과 "3일 전에 급락 후 반등"은 사람 눈에 같은 패턴이지만, 시점별로 계수를 따로 갖는 모형(예: 각 lag에 별도 계수를 주는 회귀)에게는 완전히 다른 입력이다. CNN은 이 둘을 자동으로 같은 패턴으로 묶는다. 이것이 "이미지로 만들 이유"의 가장 강한 형태의 논거이며, §5에서 다시 다룬다.

그리고 저자들은 이 절충을 **해석 단계에서 한 번 더** 실행한다. §IV 전체가 "CNN이 무엇을 배웠는가"를 (a) 기존 특성과의 상관·회귀, (b) 이미지 밑 원 숫자에 대한 로지스틱 근사 두 경로로 역추적하는 데 쓰인다. 저자들은 이 시도의 한계를 먼저 인정한다 — "Our attempts at interpretation are admittedly incomplete (as in the CNN literature more broadly). Notwithstanding, they achieve partial success" (§IV 도입부, p.3219). **이 정직한 자기평가가, 뒤에 나올 Table IX의 자기-반박을 논문에 실을 수 있게 한 태도적 기반이다.**
