# 01 · 메타 & 선정 이유

## 인용·권위 메타

- **인용 수**: Semantic Scholar 본 환경 차단 → 정확 수치 미확인. 단 grokking 후속 문헌(예: arXiv:2310.19470 "Bridging Lottery Ticket and Grokking", arXiv:2405.12755 "Progress Measures for Grokking on Real-world Tasks", arXiv:2504.13292 "Accelerating Grokking", arXiv:2602.08302 "Grokking in Linear Models", arXiv:2603.25009 "Systematic Empirical Study of Grokking", arXiv:2411.05353 "Controlling Grokking with Nonlinearity") 들이 본 논문을 "circuit-competition view" 의 일차 근거로 일관 인용 — grokking literature 의 **기준점 단편** 으로 자리잡았음을 정황 확인.
- **저자 권위**:
  - **William Merrill** (NYU PhD, Allen Institute 연구원 경력) — formal language × neural net expressiveness 의 대표 이론가. RNN/Transformer 의 회로 복잡도 분석 (`The Parallelism Tradeoff` 등) 으로 ACL/EMNLP/TACL 연쇄 게재. lambdaviking.com.
  - **Nikolaos Tsilivis** (NYU PhD, Andrew Saxe / Joan Bruna 계열) — adversarial robustness × neural tangent kernel (`Can we have it all?` ICML 2022) 라인.
  - **Aman Shukla** (NYU 학부/석사) — circuit discovery 보조.
- 즉 "이론 (Merrill) × NTK 동학 (Tsilivis) × 실험 코드 (Shukla)" 의 작지만 균형 잡힌 워크샵 팀. NYU CDS 의 grokking 라인 첫 산출물.
- **DOI**: 워크샵 페이퍼라 정식 DOI 미발급 가능성. `arXiv:2303.11873` 가 사실상의 canonical identifier. OpenReview `8GZxtu46Kx` 는 ME-FoMo 워크샵 트랙.

## 근거 지도 (Evidence Map)

- **핵심 claim (sparse vs dense 부분망의 경쟁)**: 본문 PDF 미확인 → abstract verbatim 4 단편 + 저자 GitHub `parity-nn` 의 `circuit_discovery_binary/linear` 함수 + `--subnetworks --faithfulness` CLI 플래그로 검증.
- **방법론 (sparse parity + FF1 2-layer MLP)**: `utils.py` 의 `FF1` class verbatim (`Linear(40, 1000)` → ReLU → `Linear(1000, 1, bias=False)`) + `parity()` 함수 verbatim (n=40 strings of ±1, target = product of first k=3 bits) — 코드가 1차 근거.
- **하이퍼파라미터 (n=40, k=3, N=1000, B=32, epochs=300, lr=0.1, weight_decay=0.01, width=1000, seeds=5)**: `parity.py` argparse 디폴트 verbatim.
- **DNF 구성 수치 (3-bit 표준 8 뉴런 / 변형 6 뉴런)**: 검색 인덱스 verbatim 단편 + `ArityFinder.get_arities` 함수 (뉴런별 활성 입력 수 측정) 로 정황 일관.
- **노름 동학 (소수 뉴런 급증 + 나머지 완만 감쇠)**: abstract verbatim + `parity.py` 의 `--ind-norms` (individual norms) 플래그 + `--global-sparsity` 플래그 + `norms['feats'][epoch]` 인덱싱이 `circuit_discovery_*` 함수에 사용 — 노름 시계열 측정이 핵심 분석 양식.
- **본문 미확인**: phase transition epoch 의 정확 좌표, sparsity time series 의 정확 수치, sparse subnetwork 로 줄였을 때의 faithfulness % 절대값, 통계적 유의성 (분산·신뢰구간), Theorem 이 있다면 그 형식적 진술. → 해당 섹션 작성 시 **"원문 본문 미확인"** 으로 명시.

## 선정 이유 (Why today, why this paper)

1. **Axis balance** — 최근 6주 코어 버킷 정리:
   - 2026-05-04 TAPPA (§C pe-attention)
   - 2026-05-11 ACDC (§B mech interp)
   - 2026-05-18 Jain-Wallace (§C attention-as-explanation)
   - 2026-05-25 Liu effective theory (§A grokking)
   - 2026-06-08 Kazemnejad PE (§C pe-attention)
   - 2026-06-15 IOI Circuit (§B mech interp)
   - 2026-06-22 **본 논문 (§A grokking + §B mech interp 교차)** ← §A 4주 공백 해소
   - §A grokking-delayed-gen 의 마지막 cover (05-25) 이후 4주 공백 — 가장 뒤처짐.
2. **Priority 매칭** — `_index.md` 의 "Tier 3 — Grokking secondary" 행 (`arXiv:2303.11873`) 미커버.
3. **사용자 연구 직결** — `_profile.md` §A (Power 2022 → Nanda 2023 → Liu 2022 → Lyle 2025 chain) 의 빠진 다리. "왜 phase transition 인가?" 에 대한 **mechanism-level** 답을 제공: Nanda 2023 의 *progress measure* 가 "무엇이 일어나는가" 라면, 본 논문은 "어느 뉴런 집단이 무엇과 경쟁하는가" 의 회로 수준 답.
4. **Tier 4 (워크샵) 예외 정당화** — 강제 규칙상 워크샵·프리프린트 only 는 "Priority 목록 매칭 + 사용자 연구 연결이 매우 강할 때" 만 허용. 본 논문은 두 조건 모두 충족:
   - Priority Tier 3 grokking secondary 직접 매칭
   - Grokking-in-TS-Transformers 트랙의 "regime memorization → regime generalization" 가설을 회로 수준 substrate 로 직접 차용 가능 (dense subnetwork = 단순 회귀 memorization, sparse subnetwork = regime-invariant generalizing structure).
5. **Source Lock 가능성** — 저자 본인 GitHub repo 가 minimal 하게 잘 열려 있어 본문 PDF 차단 환경에서도 architecture · task · hyperparam · analysis primitive 를 verbatim 검증 가능. 추측 의존도 최소.
