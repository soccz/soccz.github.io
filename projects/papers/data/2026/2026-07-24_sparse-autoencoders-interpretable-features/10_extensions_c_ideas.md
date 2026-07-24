# 9. 사고 확장 (c) — 실험해볼 후속 아이디어 2개

각 아이디어는 가설 / 데이터 / 비교 조건 / 예상 결과 / 반증 조건 / 비용으로 적는다.

## 아이디어 1 — "TS-SAE 특징이 주기/추세/regime 축에 정렬되는가" (선형-중첩 가정의 시계열 반증 실험)

- **가설**: TS 트랜스포머 잔차 스트림에 학습한 SAE 특징은, **합성 데이터의 알려진 생성 인자**(주기·추세·regime·anomaly·frequency drift)에 **단의미적으로 정렬**된다. 즉 "이 특징 = 주기 성분", "이 특징 = regime B" 처럼 나뉜다.
- **데이터**: `_profile.md` 보유 자산 중 **APF synthetic motif benchmark**(trend/seasonal/regime/anomaly/freq drift — 문자 그대로 프로필에 명시)와 **Grokking track 의 sin/periodic synthetic·regime-switching synthetic**. 생성 인자를 우리가 알므로 ground-truth 대용이 존재 = 본 논문이 못 한 "특징 실재성 직접 검증"이 가능.
- **비교 조건**: (i) SAE(L1, Eq.4) vs SAE(TopK, Gao) vs PCA vs raw 뉴런, (ii) 잔차 vs FFN vs patch-embedding 부착 지점, (iii) 정상 vs 비정상(regime-switching) 신호.
- **예상 결과**: 정상·단일주기 신호에서는 특징이 생성 인자에 정렬(높은 mutual information). 비정상·다주기에서는 **유령 특징으로 분할**되거나 dead feature 증가 → 본 논문의 MLP 실패(§6.2)와 유사한 "구조 부적합" 패턴.
- **반증 조건**: 어떤 부착 지점·희소 방식에서도 특징-생성인자 mutual information 이 PCA 와 유의차 없으면, "SAE 가 TS 에서 특별히 나을 것 없음" → 내 방법론 전제 붕괴.
- **비용**: 합성 데이터·소형 TS 트랜스포머(수십만~수백만 param)·SAE 학습은 본 논문 기준 단일 A40 1시간 규모. 부착지점 3 × 희소방식 3 × 신호 2 = 18 run + 3 seed ≈ **GPU 2~4일**. 저비용 고정보.

## 아이디어 2 — "motif(패턴) vs feature(방향): 위치기하는 SAE 좌표계 밖인가" (APF × SAE 교차 인과 실험)

- **가설**: PE 가 유도하는 **attention motif**(diagonal/stripe/block/edge/spike/checker — 프로필 문자 그대로)의 인과 효과 중 일부는 **잔차 SAE 특징으로 환원되지 않는다**. 즉 motif 를 개입했을 때의 출력 변화가, 잔차 SAE 특징 개입으로는 재현되지 않는 잔여(residual causal effect)를 남긴다.
- **데이터**: APF 의 PE 비교 그리드(NoPE/sinusoidal/learned/RoPE/ALiBi) × motif benchmark(위 프로필 자산). 각 셀에서 CNN probe 로 motif 검출.
- **비교 조건**: 같은 예측 변화를 만들기 위해 (A) attention motif 성분에 반사실 패칭(APF 방식) vs (B) 잔차 SAE 특징에 본 논문 §5.8 개입식 패칭. 두 개입의 **KL 감소량**과 **필요 성분 수**를 매칭.
- **예상 결과**: 위치-지배 motif(diagonal/stripe)에서는 (B) 잔차 SAE 개입이 (A)를 못 따라잡음(잔여 인과 존재) → 본 논문 §3.2 "위치 패턴 사각지대"의 인과판 확증. 내용-지배 motif(block 등)에서는 두 개입이 수렴.
- **반증 조건**: 모든 motif 유형에서 잔차 SAE 특징 개입이 motif 개입과 동등한 KL 감소를 동등한 성분 수로 달성하면, "attention motif 는 잔차 특징의 재표현일 뿐" → APF 의 독립적 존재 이유 약화(중요한 반증 — 그래서 반드시 돌려봐야 함).
- **비용**: PE 5셀 × motif 6유형 × 개입 2방식 × 3 seed = 180 조건이지만 각 조건은 소형 모델·기존 APF 파이프라인 재사용 → **GPU 1~2주**. APF 의 "causal intervention" 단계에 SAE 개입을 대조군으로 끼워 넣는 것이라 추가 인프라 최소.

---

### 두 아이디어의 관계

> 아이디어 1 은 **"SAE 가 TS 에서 작동하는가"**(방법 이식 가능성), 아이디어 2 는 **"작동하더라도 attention 기하를 담는가"**(APF 의 존재 이유). 1 이 통과해야 2 가 의미 있으므로 **1 → 2 순서**로 진행하며, 둘 다 이미 보유한 합성 벤치마크·APF 파이프라인으로 저비용 실행 가능하다.
