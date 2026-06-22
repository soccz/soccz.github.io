# 11 · 한 줄 판결

> **Grokking 의 "느린 일반화" 가 단순한 동학 현상이 아니라 두 부분망이 경쟁하는 "기계론적 사건" 임을 sparse parity 라는 최소 substrate 위에서 입증한 워크샵급 짧은 논문 — Nanda 2023 (Fourier circuit) · IOI Circuit 2023 (path patching) 사이의 "왜 phase transition 인가" 라는 빠진 다리에 해당. 본인 Grokking-in-TS-Transformers 트랙에서 dense (regime memorization) → sparse (regime-generalizing circuit) 의 가설 substrate 로 직접 차용 가능.**

---

## 보충 (2~3 줄)

본 논문의 *질적* 결론 — sparse vs dense 부분망의 경쟁 + 노름 양극화 + DNF-닮은 sparse 구조 — 은 본 환경에서 abstract verbatim + 저자 GitHub 코드 (FF1, parity, circuit_discovery_binary, ArityFinder) 만으로 검증된다. 본문 PDF 차단으로 phase transition 의 정확한 epoch 좌표, 최종 $k^\star$ 의 수치, ablation 표의 절대값은 단정하지 않았다 — 후속 작업에서 본문 PDF 확보 시 보강 필요.

사용자 NeurIPS 2027 plan §2 Related Work 에 **6 번째 must-cite** 로 즉시 등록. TMLR backup (APF) 의 motif dynamics 절에는 **primitive (norm-ranked masking + faithfulness + arity)** 의 직접 차용. 가장 큰 가치는 "phase transition 자체를 *회로 위의 사건* 으로 재정의하는 view" — 사용자 트랙의 *progress measure* 후보 (norm bimodality CV) 의 직접 출처.
