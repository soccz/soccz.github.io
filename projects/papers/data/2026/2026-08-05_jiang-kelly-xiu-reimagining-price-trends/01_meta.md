# 0. 메타 & 선정 이유

## 서지 정보

| 항목 | 값 |
|---|---|
| 제목 | (Re-)Imag(in)ing Price Trends |
| 저자 | Jingwen Jiang (University of Chicago) · Bryan Kelly (Yale University · AQR Capital Management · NBER) · Dacheng Xiu (University of Chicago) |
| 게재 | *The Journal of Finance* 78(6) 3193–3249, December 2023 |
| Canonical identifier | **DOI: 10.1111/jofi.13268** |
| 인용 수 | **68회** (Semantic Scholar API, DOI 조회 기준, 조회일 2026-08-05) · influential citation 1회 |

**인용 수에 대한 정직한 주석**: 68회는 2023년 12월 게재 후 약 2년 8개월 시점의 수치다. Semantic Scholar는 금융 저널의 인용 그래프를 체계적으로 과소집계하는 경향이 있으므로(finance 워킹페이퍼·SSRN 인용이 누락됨) 실제 영향력의 하한으로 읽어야 한다. 아래 품질 게이트는 **인용 수(기준 B)에 의존하지 않고 기준 A로 통과**시켰다.

## 저자 권위 배경

이 세 저자는 "머신러닝으로 자산가격을 한다"는 연구 프로그램을 실질적으로 개창한 그룹이다. 특히 **Gu·Kelly·Xiu (2020) "Empirical Asset Pricing via Machine Learning"** 이 그 출발점인데, 본 논문은 그 방법론적 인프라를 그대로 상속한다 — 원문 §II.C 첫 문장이 "Our workflow from training, to model tuning, and finally to prediction follows the basic procedure outlined by Gu, Kelly, and Xiu (2020)" (p.3204) 라고 명시하고, 학습·검증 분할, 5회 재학습 후 예측 평균, Xavier 초기화·Adam·배치정규화·드롭아웃·early stopping의 정규화 세트, 심지어 특성 정의 표(§IV.A 각주 12: "see table A.6 of Gu, Kelly, and Xiu (2020)")까지 인용한다.

이 점이 사용자에게 특별한 이점이다: `_index.md` "사전 독파 논문" 목록에 **Gu·Kelly·Xiu (2020)가 이미 등재**되어 있다. 즉 본 논문의 **방법론적 하부구조는 이미 읽은 상태**이고, 이 해체는 그 위에 얹힌 "이미지"라는 한 겹만 새로 흡수하면 된다.

Kelly는 AQR Capital Management 소속을 겸하며, 원문은 이해상충 고지에서 "AQR Capital Management is a global investment management firm, which may or may not apply similar investment techniques or methods of analysis as described herein" (p.3193 각주 `*`)이라고 밝힌다. — 실무 운용사가 유사 기법을 쓸 수도 있음을 저자가 명시적으로 열어 둔 문장으로, §7에서 다룰 "공개된 알파의 수명" 논점과 직결된다.

## 근거 지도 (원문 위치)

1. **핵심 claim** — §III.B Table I (주간 포트폴리오, p.3207–3208) · §III.C Table II (월/분기, p.3212 전후) · §IV.A Table V·VI (기존 특성과의 상관, p.3220–3221) · §V.A Table X (국제 전이, p.3234) · §V.B Table XI–XII (시간척도 전이, p.3237·3240)
2. **방법론** — §I.A~I.B (이미지 생성 규약, p.3198–3201) · §II.A (CNN 구조 개요, p.3201–3202) · §II.B (2D vs 1D 논거 + Figure 4, p.3202–3204) · §II.C **식 (1)** 교차엔트로피 손실 (p.3205) · **Appendix "Architecture Details of the CNN"** (p.3242–3247, 필터 5×3 / stride / dilation / 파라미터 수)
3. **실험** — §III.A 데이터 (CRSP 1993–2019, p.3206) · §III.D Table IV 대형주·거래비용 (p.3216 전후) · §IV.B **Table VIII·IX** 로지스틱·CNN1D 대조 (p.3226–3229) · §IV.C Figure 8 (7,846개 룰 대비, p.3231)
4. **한계** — §II.C 각주 7 (LSTM이 더 나을 가능성 자기 인정, p.3204) · §III.A (재학습 없음·단일 학습창 고백, p.3206) · §IV 도입부 ("Our attempts at interpretation are admittedly incomplete", p.3219) · §IV.C (CNN이 ground truth 아님, p.3232) · §V.A (대형 시장에서는 전이 이득 소멸, p.3236)

## 선정 이유 (품질 게이트 통과 사유 — §3 요구사항)

**통과 기준: A (탑 티어 게재 확정) + C (저자·그룹 트랙레코드) + E (읽을 가치 자기시험).**

- **기준 A**: *The Journal of Finance*는 `_prompt.md` §3의 금융 도메인 게이트 A 명단(JF/JFE/RFS/Management Science/JFQA) 최상단에 명시된 저널이다. 게재 확정·최종본 확인 완료. 워킹페이퍼가 아니라 게재본 PDF를 1차 소스로 읽었다.
- **기준 C**: Gu·Kelly·Xiu 라인의 신작이며, 사용자가 이미 읽은 Gu·Kelly·Xiu (2020)의 직계 후속이다. (기준 B는 인용 68회로 "1년 내 100+" 바를 넘지 못하므로 **주장하지 않는다** — A로 통과.)
- **기준 E (읽을 가치 자기시험, 2줄)**: ① 이 논문은 "시계열을 이미지로 바꾸면 이긴다"는 지금 유행하는 명제의 **가장 권위 있는 근거로 인용되는데, 정작 저자 자신의 Table IX가 1D CNN에 동일한 이미지 척도만 먹여도 2D CNN을 상회한다는 것을 보여준다** — 즉 이 논문을 실제로 읽는 것과 인용만 하는 것 사이에 결론이 정반대로 갈리는 희귀한 사례이므로, 읽는 행위 자체가 독자의 판단을 바꾼다. ② 사용자의 APF 프레임(`_profile.md`: "PE → 2D attention motif → CNN probe → causal intervention")에서 **"2D 표현 + CNN probe" 두 단계가 이 논문과 정확히 겹치므로**, 본 논문의 1D 대조군 설계는 APF 실험 프로토콜에 즉시 이식 가능한 반증 장치다.

**오늘 이 시점에 봐야 하는 이유** (`_profile.md`·`_coverage.md` 연결):
오늘은 수요일 = **인접 버킷(§D TS transformer/2D/TSFM interp + §E 금융 응용)**. 인접 버킷 태그 현황은 `tsfm-interp`=9로 과포화된 반면 **`fin-ts-dl`=2 (2026-07-08 TFT 이후 4주 공백)**, **`ts-as-2d`=3 (2026-06-24 GAF/MTF 이후 6주 공백)** 로 두 태그가 동시에 뒤처져 있었다. 본 논문은 이 **두 태그를 동시에** 메우는 유일한 게이트 A 후보였다. 더불어 `ts-as-2d` 계보에서 이미 커버한 GAF/MTF(2026-06-24) → TimesNet(2026-05-13) → VisionTS(2026-06-10) 세 정거장이 전부 "2D 변환이 왜 이득인가"를 **주장**만 했고 **1D 동일-척도 대조군을 세우지 않았는데**, 본 논문은 그 대조군을 유일하게 세운 사례다. 계보의 빠진 조각이 정확히 여기다.
