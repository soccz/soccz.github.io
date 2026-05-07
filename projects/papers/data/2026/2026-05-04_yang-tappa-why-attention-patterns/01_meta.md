# 01. 메타 & 선정 이유

## 인용·발표 정보

- **인용 수**: 미확인 (Semantic Scholar 접근 차단). 2026-01-29 등록 → 4월 말 기준 3개월 미만이므로 정식 인용은 적을 것이나, 동시기 follow-up arXiv 가 빠르게 누적되는 영역 (KV cache, attention head 분류) 임은 분명.
- **DOI**: 미확인 (ICLR 2026 proceedings DOI 미발급 단계 가능)
- **저자 권위 배경**:
  - **Jie Wang** (USTC MIRA Lab 책임자, corresponding 추정): 강화학습·조합최적화·LLM 효율성 분야 다수. MIRA Lab 은 KV cache / inference acceleration 으로 NeurIPS·ICLR 다수 출판.
  - **Mingxuan Yuan, Jianye HAO** (Huawei Noah's Ark): RL · LLM scaling 권위. Hao 는 multi-agent RL 의 중국권 대표 그룹.
  - **Bin Li** (USTC, info theory / signal processing 백그라운드): "temporal continuous perspective" 라는 framing 의 출처일 가능성. APF 가 "PE → 2D motif" 로 가는 경로와 닮은 발상은 이쪽 영향.
- **컨텍스트**: MIRA Lab 에서 같은 시기 KV cache 압축 논문이 다수 나옴 (예: 같은 1월 내 arXiv:2510.00636 "Expected Attention", arXiv:2601.08297 "Demystifying the Slash Pattern" 등). TAPPA 는 그 흐름의 **이론적 우산** 으로 위치.

## 선정 이유 (왜 오늘, 왜 이 논문)

세 가지가 겹쳤다.

1. **Axis balance 강제** — `_coverage.md` 코어 §C (pe-attention-geometry / attention-as-explanation) 가 0회 커버. §A (grokking) 는 최근 Nanda(04-27) + Lyle(05-01) 연속 2회로 과대표현. 오늘 §C 를 안 채우면 5주 연속 §A 편향 가능성. axis balance 규칙(최대 5주)이 깨지진 않지만 "최소 3주 단위 교대" 권고를 따라 §C 차례.

2. **Priority 매칭이 사용자 active 트랙의 직접 concurrent work** — `_profile.md` 에 "Concurrent work 2개 식별: arXiv:2511.21514 (Kalnāre 2025), **arXiv:2601.21709 (Yang ICLR 2026)**" 라고 명시되어 있다. 이는 사용자의 APF (Attention Pattern Fields) 프로젝트가 motif sweep / PE intervention 을 진행 중인데, 정확히 같은 framing ("attention 패턴이 왜 그렇게 생기는가, PE 가 어떻게 결정하는가") 으로 ICLR 2026 에 먼저 도착한 논문. **읽지 않고 APF 를 쓰면 reviewer 가 제일 먼저 던질 비교 논문**. 우선순위 1.

3. **"내 가설" 의 사전검정 가치** — APF 는 (a) PE 별 motif 분포, (b) motif → CNN probe → 분류, (c) causal intervention (motif swap) 의 3단 사다리. TAPPA 가 (a)~(b) 사이의 **이론적 다리**(q-similarity × RoPE-frequency → motif type) 를 이미 깔았다면, APF 는 (a) 대신 그들의 다리를 인용하고 (c) 단계 — causal intervention 과 시계열 도메인 — 에 자원을 몰아야 한다. 이 판단을 위해 본 논문을 실제로 읽고 비교점을 명문화할 필요가 있다.

부수적 이유: ICLR 2026 게재라는 경량 권위, RoPE 주파수 분해라는 sub-mechanism 이 사용자의 "Spectral PE" (현재 shelved) 발상과 표면적으로 겹쳐 재개 신호가 될 수 있는지 검토 필요.
