# 01. 메타 & 선정 이유

## 서지 요약

- **인용 수**: Semantic Scholar 정확 값은 접근 차단으로 미확인. 다만 Google Scholar 통상 인덱스 기준 arXiv:2104.09864 는 발표 4년 만에 수만 회 인용급으로 알려져 있다 (LLaMA·PaLM·GPT-NeoX·Chinchilla·Mistral·Qwen·DeepSeek·Gemma 등 대부분의 오픈 LLM 이 RoPE 를 채택하면서 사실상 modern LLM position embedding 의 de facto 표준이 됨). 본 해체에서는 "구체적 인용 수는 미확인" 으로 남기되, LLaMA·Mistral 등이 RoPE 를 채택한 사실은 각 저자 원문·기술 보고서 공개 정보로 별도 검증 대상.
- **DOI**: 10.1016/j.neucom.2023.127063
- **Canonical identifier**: arXiv:2104.09864 (v1 2021-04-20 / v5 2023-11-08) · Neurocomputing vol 568 article 127063 (2024)
- **저자 배경**: Zhuiyi Technology(追一科技) 는 중국 심천 기반 대화형 AI 스타트업. 제 1 저자 Jianlin Su(苏剑林) 는 개인 블로그 *科学空间*(spaces.ac.cn)에서 RoPE 를 초창기 (2021 년 3 월경) 아이디어 노트로 공개한 뒤 정식 논문화. Su 는 이후 GAU (Gated Attention Unit) 및 RoPE 의 다양한 후속 변형 (예: NTK-aware scaling, YaRN 방향의 초석) 을 계속 제안해 온 연구자로, Zhuiyi 그룹은 상용 시스템에 RoPE 를 실제로 적용한 최초 기업 사례로 알려짐.

## 근거 지도 (evidence map, 접근 확보 위치)

- **핵심 claim**: 저자 GitHub README + arXiv 검색 스니펫에서 abstract 세 문장 verbatim 확보 — "we propose a novel method named Rotary Position Embedding (RoPE)" / "encodes the absolute position with a rotation matrix" / "flexibility of sequence length, decaying inter-token dependency with increasing relative distances, and the capability of equipping linear self-attention with relative position encoding".
- **방법론 수식**: EleutherAI 블로그·Grokipedia·Emergent Mind·복수 파생 논문에서 RoPE 정의식 재인용을 통해 (1) 상대위치 조건 $\langle f_q(x_m,m), f_k(x_n,n)\rangle = g(x_m, x_n, m-n)$, (2) 블록대각 회전 행렬 $R^d_{\Theta,m}$, (3) 주파수 스펙트럼 $\theta_i = 10000^{-2(i-1)/d}$, (4) $q_m^T k_n = q^T R_{m-n} k$ 항등식을 원문 §3.4.2 근처 위치로 매핑.
- **실험 위치**: WMT2014 En-De (Section 4.x 원문 표: RoFormer 27.5 vs baseline Transformer 27.3 BLEU), GLUE tasks (MRPC/SST-2/QNLI/STS-B/QQP/MNLI dev/test), CAIL2019-SCM (512→1024 확장 시 68.29→69.79%), Enwik8 (character-level LM) — 각 표·그림의 정확한 번호와 소수점은 본문 PDF 차단으로 단정 안 함.
- **한계·future work**: 원문 conclusion 절 문장 그대로는 확보 못 함. 후속 논문 (Circuit Complexity Bounds for RoPE, Dimension Inefficiency, Frontiers 2025 fixed-θ 분석 등) 이 반박·확장한 지점을 통해 원 논문이 대놓고 논의하지 못한 한계를 간접 추정.

## 선정 이유 (왜 하필 오늘 이 논문인가)

1. **커버리지 균형**: 코어 버킷 tag 중 `pe-attention-geometry` 가 2 (마지막 2026-06-08 Kazemnejad) 로 가장 뒤처졌고, §C axis 도 3-4 주 공백. `_index.md` "APF — PE & Attention Geometry" priority 목록의 미커버 최상단 후보 두 개 (RoPE·ALiBi) 중 RoPE 를 우선 선정.
2. **Priority + Source Lock 동시 통과**: RoPE 는 priority 항목(`arXiv:2104.09864`)이고 저자 GitHub 로 원문 접근 우회가 확보되어 다른 미커버 priority (`FIRE`, `DAPE` — 저자 GitHub 미확인) 보다 안전.
3. **APF 프로젝트 직결**: APF 는 "PE → 2D attention motif → CNN probe → causal intervention" 파이프라인이고, RoPE 는 그 첫 화살 (PE) 의 현재 표준이다. RoPE 의 rotation 주파수 스펙트럼과 decaying inter-token dependency 성질이 어떤 motif (diagonal / stripe / block / spike) 로 사영되는지가 APF main paper §5 의 미검증 가설이다. RoPE 를 원 논문 수준에서 정확히 이해하지 않으면 그 사영을 논문에 못 쓴다.
4. **Grokking track 간접 연결**: RoPE 채택 여부가 Grokking timing 에 미치는 영향은 최근 grokking-of-transformer 문헌 (Nanda 2023 은 NoPE, Kazemnejad 2023 은 NoPE 우위) 과 대조되는 미탐 영역. 사용자 Grokking-in-TS-Transformers plan §4 실험 그리드의 PE 변수를 정하는 근거로 필요.
5. **저자 반복 규칙**: Su 등 Zhuiyi 저자는 본 레포에서 처음 다룸 (0 회) — 저자 중복 없음.
