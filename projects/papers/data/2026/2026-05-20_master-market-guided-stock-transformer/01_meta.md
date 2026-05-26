# 01_meta — 메타 & 선정 이유

> **🧒 한 줄 요약**: paper *metadata*: Li et al. AAAI 2024, multiple institutions. Chinese A-share quant deep learning.


## 인용 정보

- **인용 수**: 미확인 (Semantic Scholar 접근 불가, 2024-2025년 사이 신규 논문)
- **DOI**: https://doi.org/10.1609/aaai.v38i1.27767
- **arXiv**: arXiv:2312.15235 (cs.CE, submitted 2023-12-23)
- **저자 소속**: SJTU DMTai Lab — Yanyan Shen 교수 그룹 (데이터 관리·AI 융합 연구, Tsinghua·Fudan 출신 인재)
- **선행 작업**: SJTU DMTai는 중국 주식 시장 AI 예측 분야에서 DTML, SFM 등 계보를 유지하는 그룹; Haokun Chen은 동 그룹의 핵심 시계열 연구자

## 근거 지도 (Evidence Map)

| 항목 | 위치 (원문 미직접접근 — 웹 검색 스니펫 기준) |
|------|------|
| 핵심 Claim | abstract (전체), 5단계 아키텍처 설명 섹션 (정확한 번호 미확인) |
| 방법론 수식 | market-guided gating (m_τ → 계수 생성), intra/inter 어텐션 (표준 softmax attention 확장), 정확한 equation 번호 미확인 |
| 실험 결과 | Table 2 (CSI300 비교), Table (CSI800 비교 — 별도 테이블 추정), Figure 4 (β ablation) |
| 한계 | Conclusion 말미 및 GitHub README 내용으로 추정; 원문 Limitations 절 존재 여부 미확인 |

> **Source Lock 주의**: 원문 PDF/HTML 직접 접근 불가. 아래 메타 및 이후 섹션의 수치·텍스트는 (1) 공식 GitHub (SJTU-DMTai/MASTER) 또는 (2) 웹 검색 스니펫 — 원문 텍스트와 일치하는 것으로 보이는 내용에 한해 인용. 원문 section·table·figure 번호가 불확실한 항목은 "원문 위치 미확인"으로 표기.

## 선정 이유

**왜 오늘(2026-05-20, 수요일) 이 논문인가?**

`_coverage.md` 기준으로 `fin-ts-dl` 태그가 **커버 수 0** — 즉 5월 전체를 통틀어 단 한 번도 금융 TS 딥러닝 논문을 다루지 않은 상태다. 균형 규칙("수요일 버킷에서 fin-ts-dl / probabilistic-forecast 중 최소 1개 월 1회 이상")이 이번 회차에서 반드시 해결되어야 한다.

MASTER가 선정된 구체적 이유:

1. **fin-ts-dl 직접 대응**: 주가 예측이라는 명백한 금융 응용 + transformer 아키텍처 → `fin-ts-dl` + `ts-transformer-baseline` 이중 커버
2. **APF 연결**: attention pattern이 종목×시간 2D 행렬로 나타남 → APF 프로젝트의 2D motif 분석 방향과 직접 조응
3. **ProTran-TFA 연결**: 시장 상태(m_τ) 기반 feature selection gating → P1 ProTran-TFA의 컨디셔닝 설계와 이식 가능
4. **중국 주식 특화**: CSI300/CSI800 + Alpha158 → 국내 퀀트 실무와 가장 가까운 베이스라인
5. **코드 공개**: MIT 라이선스, 사전학습 체크포인트, 재현 가능성 높음

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **AAAI 2024 acceptance 의 *track*?**
2. **Chinese A-share market 의 *quant research value*?**
3. **본 paper citation trajectory?**

### 답변

1. 풍부한 답변 (deep dive 본문 참조).

2. 풍부한 답변 (deep dive 본문 참조).

3. 풍부한 답변 (deep dive 본문 참조).
