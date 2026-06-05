# 11_verdict — 한 줄 판결

## 판결

> **트랜스포머 인코더의 self-attention 으로 호크스 강도(intensity)의 비선형 누적을 대체한 첫 시도 — RNN 점과정의 4 년 패러다임을 "강도 = embedding 의 선형변환 + softplus" 라는 한 줄로 재정의한 anchor 논문이며, APF 의 "PE × motif" 가설을 사건 시각의 sinusoidal time encoding 위에서 재검증할 수 있는 가장 자연스러운 베이스라인이다.**

## 핀의 정확한 위치

- **사용자 연구 지도 위치**: §F 원거리 `point-process` 의 **첫 커버** + APF 의 PE family analysis 의 **연속시간축 case** + Grokking track 의 **점과정 도메인 grokking 검증 baseline** 의 **3중 핀**.
- **인용 우선순위**: Mech interp / Grokking 의 mid-tier (직접 contribution 은 아님, 그러나 점과정 응용의 anchor).
- **재현 우선순위**: 사용자가 직접 코드 마이그레이션 (PyTorch 1.4 → 2.x) 후 Synthetic Hawkes 위에서 10_extensions_c 의 두 실험 수행 → 2-3 주 안에 cross-track contribution 2 개 산출 가능.

## 보충 — 본 환경의 한계 명시

본 해체는 본문 PDF 직접 미접근 (arxiv/proceedings 호스트 차단) 상태에서 작성. 본문 표·도표의 절대 수치, ablation 정확값, std 보고 여부는 단정하지 않았다. 사용자가 본문에 접근하면 06_experiments §7 의 "🟡/❌" 항목을 우선 보충해야 한다.
