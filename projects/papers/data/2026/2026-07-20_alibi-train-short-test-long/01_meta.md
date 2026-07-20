# 0. 메타 & 선정 이유

## 서지 정보

- **제목**: Train Short, Test Long: Attention with Linear Biases Enables Input Length Extrapolation
- **저자**: Ofir Press, Noah A. Smith, Mike Lewis
- **발표처**: ICLR 2022 (Poster)
- **identifier**: arXiv:2108.12409
- **인용 수**: 정확한 수치는 본 환경에서 Semantic Scholar API 직접 접근으로 확정하지 못함(미확인). 다만 ALiBi는 이후 BLOOM·MPT·Replit 등 다수 오픈 LLM의 위치 방법으로 채택되었고, 장문맥(long-context) 연구에서 반복 인용되는 표준 baseline이라는 점은 후속 문헌 목록에서 반복 확인된다(정성적 임팩트).

## 근거 지도 (원문 위치)

- **핵심 claim**: 초록 전문 + §4 실험(외삽 성능). "sinusoidal PE는 외삽이 매우 약하다"는 진단은 초록·§본문에서 반복 진술.
- **방법론**: **§3 "Attention with Linear Biases (ALiBi)"** — 어텐션 점수에 거리 비례 선형 편향을 더하는 단일 식과 head별 기울기 m의 정의.
- **실험**: **표 2**(WikiText-103, L=512 학습), **표 3**(L=1024 학습)에서 L_valid를 키우며 sinusoidal·rotary·T5 bias·ALiBi를 비교. 대규모 1.3B 모델 실험은 461GB 코퍼스.
- **한계/분석**: **부록 §B.1(early token curse 정의)·§B.2(외삽 이득의 원인 분해)** — ALiBi의 L_valid 증가 이득이 "더 긴 문맥 사용"이 아니라 "early token curse 완화"에서 왔을 수 있음을 저자가 스스로 분석.

> **수치 투명성**: 위 표 2·표 3의 perplexity 값과 표 캡션은 ar5iv 전문 렌더에서 직접 읽어 인용한다. 단일 seed 실행이며, 저자는 sinusoidal baseline에 대해서만 표준편차(±0.24)를 보고한다(§2.1 취지).

## 선정 이유 (지금 이 논문을 왜 보는가)

1. **품질 게이트 A(Tier 1) 충족**: ICLR 2022 정식 게재. 발표 이후 오픈 LLM의 사실상 표준 위치 방법 중 하나로 채택되어 임팩트도 검증됨(게이트 B 보강).
2. **E 자기시험 통과**: "위치를 더하지 말고 점수에서 거리만큼 깎는다"는 한 줄 발상은 PE를 바라보는 사고 자체를 바꾼다. 파라미터 0개로 길이 외삽을 얻는다는 결과는 실무(장문맥 배포)와 이론(귀납 편향으로서의 recency) 양쪽을 바꾼다. "읽을 필요 없음"으로 끝날 논문이 아니다. → **A(주 근거) + B(보조)로 통과.**
3. **사용자 연구 직접 연결**: `_profile.md` §C·§D에 명시된 APF의 **PE 비교 축(NoPE/sinusoidal/learned/RoPE/ALiBi)** 에서 ALiBi는 이미 하나의 셀이고, Grokking-TS track의 PE 5-way 그리드에도 동일하게 들어간다. RoFormer(2026-07-06 커버, RoPE=곱셈 회전)의 **정확한 대척점(순수 additive distance penalty)** 이라 PE 계보의 다음 정거장으로 자연스럽다.
4. **버킷 적합**: 월요일 코어(§C Attention-PE foundation). `_index.md` priority "APF — PE & Attention Geometry" 항목이며, RoFormer 커버 노트가 명시적으로 지목한 "다음 후보".

Source Lock 4종(canonical id·메타 일치·전문 접근·근거 지도) 모두 통과했고, §4-bis 3문 자기시험도 통과했으므로 발행 자격을 갖춘다.
