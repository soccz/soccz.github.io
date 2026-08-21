# 0. 메타 & 선정 이유

## 서지

- **제목**: Intensity-Free Learning of Temporal Point Processes
- **저자**: Oleksandr Shchur, Marin Biloš, Stephan Günnemann (Technical University of Munich)
- **식별자**: arXiv:1909.12127 · DOI 10.48550/arXiv.1909.12127 · OpenReview `HygOjhEYDH`
- **게재**: ICLR 2020 (arXiv Comments 필드로 확인). 결정 등급(oral/spotlight/poster)은 OpenReview 접근 차단으로 **미확인**.
- **인용 수**: **미확인** (Semantic Scholar API 호출이 본 실행 환경에서 승인되지 않아 확인 불가. 추정치로 채우지 않는다.)
- **저자 권위 배경**: Günnemann 그룹(TUM Data Analytics and Machine Learning)은 그래프·시퀀스 확률 모델링 라인을 지속해 왔고, 제1저자 Shchur는 본 논문의 공식 구현 저장소 `github.com/shchur/ifl-tpp` 를 직접 유지한다. (그룹의 다른 논문 목록은 본 실행에서 검증하지 않았으므로 나열하지 않는다.)

## 근거 지도 (evidence map)

| 무엇 | 원문 위치 |
|---|---|
| 핵심 claim (강도함수 파라미터화의 3중 트레이드오프, 밀도 직접 모델링) | 초록 · §1 Introduction · **Table 1** (§2 본문, "Comparison of neural temporal point process models that encode history with an RNN.") |
| 방법론 수식 | §2 (강도↔밀도 관계식, 우도) · **§3.1 식 (1)** (DSFlow / SOSFlow 변환) · **§3.2 식 (2)** (로그정규 혼합 밀도, 닫힌형 기댓값·샘플링) · **§3.3 식 (3)** (문맥 벡터 → 혼합 파라미터) · §3.4 Theorem 1 (DasGupta 2008, Theorem 33.2) |
| 실험 | §5.1~§5.5 (본문은 **Figure 3~7** 중심) · 수치 표는 부록 **Table 3~6** (F.1, F.2) · 데이터 통계 **Table 2** (E.2) |
| 한계·부록 신호 | §3.4 Discussion (강도 기반 모델의 장점 3가지에 대한 반박) · Appendix A (밀도로부터 강도·누적강도 복원) · Appendix D (구현 디테일) · Appendix E.1 (합성 데이터 생성 파라미터) |

## 선정 이유 (품질 게이트 통과 사유 · 2줄 필수)

1. **게이트 A 통과 (탑 티어 게재 확정)**: ICLR 2020 accepted — arXiv Comments 필드에서 직접 확인했고 arXiv 전문으로 본문·부록 전체를 열었다. 게이트 B(인용 속도)는 인용 수를 확인하지 못했으므로 **주장하지 않는다**.
2. **게이트 E 자기시험 통과**: 이 논문은 "시퀀스 확률 모델은 강도함수 λ*(t)를 파라미터화해야 한다"는 10년치 관행을 한 문장으로 회수한다 — 필요한 것은 강도가 아니라 **다음 간격의 조건부 밀도** 하나이며, 그것을 로그정규 혼합으로 두면 우도·샘플링·기댓값이 전부 닫힌형으로 떨어진다. 확률 예측 헤드를 직접 설계하는 사람의 **기본 선택지 목록 자체를 바꾸는** 논문이므로 "읽을 필요 없음"으로 끝나지 않는다.

## 지금 이 시점에 내가 왜 봐야 하는가

- `_coverage.md` 기준 `point-process` 태그는 **1건 · 마지막 2026-06-05**(Transformer Hawkes Process, Zuo et al.)로 원거리 버킷에서 가장 오래 비어 있던 축 중 하나다. `_index.md` 대기 후보에 적힌 "2026-08-14 금요일을 코어로 월경했으니 다음 금요일은 §F로 복귀" 지시를 그대로 이행한다.
- 2026-06-05에 커버한 THP는 **강도함수를 트랜스포머로 파라미터화**하는 노선의 대표작이다. 본 논문은 같은 해(2020) 같은 문제에 대해 **강도함수 자체를 버리는** 정반대 노선을 취한다. 두 편을 나란히 놓아야 "신경 TPP"라는 지형이 한 방향이 아니었다는 사실이 보인다 — 2026-08-19에 짝 논문(arXiv:2409.15771 ↔ 2505.11349)을 붙여 대조 창을 만든 것과 같은 이유다.
- `_profile.md` 관심 영역 **§E(확률/분위수/분포 예측, calibration)** 와 **§F(point processes: Hawkes, neural TPP)** 에 동시에 걸린다. 특히 paused 상태인 P1 ProTran-TFA 라인이 "확률 예측 헤드를 무엇으로 둘 것인가"에서 멈춰 있으므로, 혼합 밀도 헤드의 장단점을 원문 수준에서 확보할 실익이 있다.

## 금융 Tier 1 후보를 왜 고르지 않았는가 (후보 풀 기록)

원거리 버킷의 최장 공백 태그는 `market-microstructure`(2026-05-29)·`crypto-ml`(2026-05-29)이었고, 게이트 A를 만족하는 후보로 **Liu·Tsyvinski·Wu, "Common Risk Factors in Cryptocurrency", *Journal of Finance* 77(2) 1133-1177 (DOI 10.1111/jofi.13119)** 를 1순위로 검토했다. 그러나 출판사 전문(Wiley)이 본 실행 환경에서 열리지 않았고, PDF-only 소스는 본문 텍스트 추출에 실패해 §4-bis Q1~Q3를 1차 소스로 답할 수 없었다 → **Source Lock 실패로 폐기**(품질 문제가 아니라 접근 문제). 같은 이유로 RFS 계열 microstructure 후보도 폐기했다. 접근 가능한 게이트 A 후보 중에서 연구 연결이 가장 강한 본 논문을 선정했다. 상세 후보 목록은 `_coverage.md` 갱신 기록에 남긴다.
