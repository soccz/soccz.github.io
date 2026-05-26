# 11. 한 줄 판결

> **🧒 한 줄 요약**: paper 의 *최종 결론* + APF / Grokking manuscript 의 *3 위치 인용* 좌표. 본 paper 의 *결과* (BiLSTM 시대-specific) 가 아닌 *protocol* (variate token paradigm) 이 TSFM era 의 *direct enabler*.



> **"TS 트랜스포머의 '시간 방향 어텐션' 가정을 90도 뒤집어 변수 방향으로 돌린 단순하면서도 강력한 논문 — APF 연구 지도에서 'T×T 어텐션 모티프 체계의 대립 축'으로 핀을 꽂고, Grokking 연구에서 'FFN-only 시간 학습' 회로 분석의 출발점으로 활용한다."**

---

**판결 보충 (3줄)**:

iTransformer의 기여는 "더 복잡한 아키텍처"가 아니라 "더 올바른 토큰화"다. 이 교훈은 APF에도 적용된다: T×T 어텐션 맵을 연구할 때 "이 방향이 정말 자연스러운가"를 iTransformer가 끊임없이 되묻는다. 변수가 많은 공학 데이터에서는 명백한 SOTA이지만, 금융처럼 변수 간 상관이 약한 도메인에서의 유효성은 별도 검증이 필요하다.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **"더 복잡한 아키텍처가 아니라 더 올바른 토큰화" 의 *학술적 의미*?**
2. **APF / Grokking 의 *3 위치 인용* 의 정확한 좌표?**
3. **본 paper 의 *2 년 영향* (2024-2026) 의 *예측 vs 실제* 비교?**

### 답변

1. **방법론적 minimalism 의 *학술 가치 재확인***. 시계열 Transformer 분야의 *2020-2023 패턴* = *새 attention 변형* 발명 (Auto-Correlation, frequency block 등). DLinear 2023 의 *"Are Transformers Effective?"* 의 충격 + iTransformer 의 *재해석 only* 가 SOTA → *paradigm 정정의 가치* 학계 인식. *방법론적 humility* 의 학술 표본 — *innovation-by-default* 압박 회피.

2. **§1 Intro** (motivational citation): "Liu et al. (2024) demonstrated that variate token paradigm achieves SOTA across 7 datasets, with 30%+ promotion to 5 Transformer variants". **§2 Related Work** (TSFM era enabler): MOIRAI / Chronos / TimesFM 의 *technical foundation*. **§3 Methodology baseline** (iTransformer 의 *variate token + attention map*): APF 의 *N×N motif typology + head-level analysis* 의 *direct base*. 3 위치 모두 본 deep dive 의 16/17 챕터에서 *materials 제공*.

3. **예측: TSFM era enabler (실제 확인 ✓)**. paper 발표 시 (ICLR 2024 Spotlight) *foundation model* 의 시계열 적용 시점 — *예상되지 않은* 속도로 MOIRAI / Chronos / TimesFM 의 *3 major TSFM* 이 2024 안에 발표 + iTransformer 의 *variate token paradigm* 채택. *예측 정확* — *paper 의 paradigm shift* 가 *실제 2 년 안에 학계 + 산업 standard*.
