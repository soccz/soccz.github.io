# 01_meta — 메타 & 선정 이유

## 논문 메타데이터

| 항목 | 내용 |
|------|------|
| **저자** | Anurag Mishra |
| **소속** | Rochester Institute of Technology (RIT), 미국 |
| **발표처** | ICLR 2026 Workshop on Time Series in the Age of Large Models (TSALM) |
| **형식** | 포스터 발표 (Workshop Paper) |
| **arXiv 최초 공개** | 2026-03-10 |
| **Canonical ID** | arXiv:2603.10071 |
| **인용 수** | 확인 불가 (원문 미접근, 게재 3개월 차 신규 논문) |

## 근거 지도 (Evidence Map)

검색 엔진 인덱스 스니펫으로 확인된 원문 위치 (절 번호는 추정):

| 내용 | 추정 위치 |
|------|----------|
| 핵심 Claim (SAE ↔ 인과성 계층 발견) | Abstract, §1 Introduction |
| SAE 구조 (TopK, d_sae=8192, k=64) | §3 Method 또는 §2 Background |
| 6개 추출 지점 정의 | §3 Method |
| 392 ablation 실험 & ΔCRPS 결과 | §4 Experiments / §4.2 Ablation |
| 레이어별 label coverage 통계 | §4.1 Feature Analysis 또는 Table/Figure |
| 한계 논의 (단일 모델, 워크숍 규모) | §5 Conclusion 또는 Limitations |

*주의: 원문 본문 미접근. 위 위치는 정보 내용 기반 추정이며, 실제 섹션 번호와 다를 수 있음.*

## 선정 이유

### 왜 지금 이 논문인가?

**오늘 버킷**: 수요일 = 인접 버킷 (§D + §E: TS transformer / TSFM 해석 가능성 + 금융 응용)

이 논문은 **tsfm-interp** 태그의 핵심 질문 — "TSFM 내부에서 실제로 무슨 일이 일어나는가?" — 에 정면으로 답한다. Priority 목록의 tsfm-interp 항목들(Wilinski 2025, Sprang 2024 Concept Bottleneck, Powerformer, AttnEmbed)은 네트워크 제한으로 Source Lock 불가 판정을 받았다. 이 논문은:

1. **신규성**: 2026-03-10 게재, ICLR 2026 TSALM Workshop 채택 — 최신 연구 동향
2. **직접성**: Chronos(우리가 이미 해체한 2026-04-29 항목)의 *내부*를 최초로 SAE로 해부 — 우리의 커버리지와 직접 연결됨
3. **APF 연관성**: SAE가 '시계열 어텐션 패턴'의 구조를 드러내는 방식 → APF 연구의 "모티프-예측 인과성" 주장과 비교 가능
4. **Grokking 연관성**: TSFM이 무엇을 배우는가(abrupt-dynamics detection) → Grokking 연구의 "TS Transformer가 무엇을 grok하는가" 질문과 맞닿음
5. **커버리지**: tsfm-interp 2→3회, sae-features에 cross-cover (금요일 원거리 균형)
6. **금융 balance**: fin-ts-dl 2026-05-20 이달 커버 ✓, probabilistic-forecast 미달이나 단독 해결 불가 → 다음 수요일 priority

### 저자 권위 배경

Anurag Mishra는 RIT의 신진 연구자로, mechanistic interpretability를 TS 영역에 적용하는 비교적 드문 연구자 포지션에 있다. 단독 저자 논문으로서 범위가 제한적이지만, 첫 적용(TSFM + SAE)의 탐색적 가치가 높다. ICLR 2026 TSALM Workshop은 TS 파운데이션 모델 연구의 공식 게이트웨이 역할을 한다.
