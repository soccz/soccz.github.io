# 6. 가정·한계·반박

## 명시된 가정·한계 (저자가 §5에서 직접 말한 것)

1. **합성 → 실세계 전이 미검증**: 원문 verbatim — *"future work must evaluate whether time series foundation models can learn more complex patterns present in real-world time series and whether steering matrices estimated using synthetic data can be used to steer predictions of out-of-distribution, real-world time series."* 즉 steering·개념 국소화가 **실데이터에서도 되는지 저자도 모른다**고 명시.
2. **아키텍처 범위 제한**: verbatim — *"future research should explore other architectures such as state space models and stacked multi-layer perceptrons."* 분석은 **Transformer 계열 3종**에 한정. Mamba류 SSM·MLP-Mixer류는 미포함.
3. **개념의 단순성**: verbatim — *"our paper provides insights into how a few basic patterns are linearly represented..."* — **"few basic patterns(몇 개의 기초 패턴)"** 이라고 스스로 범위를 좁힘.

## 암묵적 가정 (말 안 했지만 깔려 있는 것)

1. **선형 표현 가설을 참으로 전제**: 개념 = 잠재공간의 방향. 이게 부분적으로만 참이면(개념이 비선형·다방향으로 얽힘), 프로빙은 "개념 없음"을, steering은 "조종 실패"를 **가짜로** 낼 수 있다. 논문의 국소화·steering 결과는 이 가설의 성립 정도에 통째로 의존한다.
2. **CKA 높음 = 기능적 중복**: 표현의 기하적 유사도를 인과적 대체가능성과 동일시. 두 층이 CKA로 닮아도 gradient 흐름·downstream 기여는 다를 수 있다. 가지치기가 대개 잘 되는 건 이 가정을 사후 지지하지만, 반례(자르면 특정 태스크만 무너짐)를 체계적으로 찾진 않았다.
3. **개념의 "일괄 개입 가능성"**: steering을 모든 층·토큰에 동시에 적용해도 개념이 깨끗이 켜진다고 가정. 개념이 층마다 다른 형태로 인코딩되면 일괄 덧셈은 부정확할 수 있다.

## 반박 가능한 지점

**반박 1 — "국소화·steering이 합성 데이터의 인공물일 수 있다."**
- 핵심 주장: constant/sinusoid는 극도로 단순해, 모델이 **개념을 이해**하는 게 아니라 **표면 통계(평균·주파수)** 를 반영할 뿐일 수 있다. steering이 "개념 주입"이 아니라 "저수준 통계량 이동"일 가능성.
- 검증 실험: 실세계 시계열(예: ETT의 실제 주기 성분)에서 steering 벡터를 추정해 **다른 실세계 시계열**에 걸어보고, 목표 개념만 바뀌고 나머지는 보존되는지 **정량 지표(주파수 스펙트럼 변화, 예측 오차)** 로 측정. 합성에서만 되고 실데이터에서 무너지면 반박 성립.

**반박 2 — "가지치기의 '정확도 유지'는 fine-tuning이 떠받친 것이지 중복 자체의 증거가 아니다."**
- 핵심 주장: zero-shot에서 all-blocks 가지치기는 열화(0.132→0.185)했고, "유지"는 대개 재학습 후다. 그렇다면 fine-tuning이 **잃은 용량을 다시 채운** 것이지, 그 층들이 원래 **불필요**했다는 증거로는 약하다.
- 검증 실험: fine-tuning 없이 **다양한 다운스트림 태스크**(예측·분류·이상탐지)에서 가지친 모델의 zero-shot 성능을 광범위 측정. 특정 태스크에서만 무너지면 "그 중간 층은 그 태스크 전용" → 단순 중복이 아님을 시사.

**반박 3 — "세 모델로 '일반성'을 주장하기엔 표본이 작다."**
- 핵심 주장: MOMENT·Chronos·Moirai는 모두 **Transformer 계열**이고, 그 중 MOMENT는 저자 자작이다. 세 개의 상관된 표본으로 "TSFM 일반의 성질"을 말하는 건 성급할 수 있다. block-redundancy가 Transformer의 residual+skip 구조에서 오는 **아키텍처 인공물**일 가능성(개념 이해와 무관)을 배제 못 한다.
- 검증 실험: §5가 지목한 대로 **SSM(Mamba류)·MLP-Mixer류**에 같은 CKA·프로빙·steering을 적용. 만약 skip-connection이 약하거나 없는 구조에서 block 중복이 사라지면, "중복은 개념 위계가 아니라 잔차 구조의 부산물"이라는 대안 설명이 강해진다. 반대로 비-Transformer에서도 나타나면 일반성 주장이 훨씬 튼튼해진다.

## 재현성 평가

- **공개**: ✅ 코드(github moment-timeseries-foundation-model/representations-in-tsfms), ✅ 분석 대상 모델 가중치(MOMENT·Chronos·Moirai 공개), ✅ 합성 데이터 생성기.
- **논문에 안 나온 디테일**: steering $\alpha$ 선택의 원칙(모델별 경험값만), 블록 경계 판정 임계치, 개념 국소화의 정량 지표.
- **분산 보고**: forecasting/imputation은 표로 수치 보고(Table 3에 std 확장). 그러나 **steering·국소화는 정성적**이라 분산·신뢰구간 없음 → 통계적 유의성 판단 불가. 이게 재현성의 가장 큰 구멍.

**핵심 한 문장**: 가지치기는 재현 가능·정량적이라 튼튼하지만, 해석론의 두 기둥(국소화·steering)은 **선형 가설 + 합성 데이터 + 정성 평가**라는 세 겹의 가정 위에 서 있어, "실세계·정량"으로 옮기는 순간 무너질 수 있는 것이 최대 취약점이다.
