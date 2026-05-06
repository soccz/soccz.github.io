# 10. 사고 확장 — Part B: Follow-up 3편

## 후속 1 (선행 / 깊은 PE 분석) — Kazemnejad et al. 2023, *The Impact of Positional Encoding on Length Generalization in Transformers*

[NeurIPS 2023]. NoPE / ALiBi / RoPE / T5-relative / Learned 다섯 PE 의 length generalization 비교. 결과는 NoPE 가 일부 task 에서 가장 generalize 잘 한다는 반직관적 발견. **본 논문과의 관계**: TAPPA 의 framework 가 RoPE 에 한정된 가장 큰 이유는 Theorem 5.2 의 simultaneous-shift invariance 가 RoPE-특수. Kazemnejad 의 결과는 TAPPA 가 다루지 않은 PE 들에서 attention motif 가 어떻게 다른지의 base data. **읽을 가치**: TAPPA 의 framework 가 모든 PE 로 generalize 가능한지의 첫 sanity check. 만약 NoPE 모델에서도 같은 motif typology 가 보이는데 q-similarity 가 다르다면 framework 의 RoPE-의존성이 확인. APF 의 multi-PE 비교 methodology 의 base 로도 필독. 4-6 시간 read + APF 의 PE 비교 set 에 직접 추가.

## 후속 2 (경쟁 / 평행 작업) — arXiv:2601.08297, *Demystifying the Slash Pattern in Attention: The Role of RoPE*

같은 ICLR 2026 cycle, 같은 1월 등록의 직접 평행 작업. **본 논문과의 관계**: slash pattern 의 RoPE-only 설명. TAPPA 가 q-similarity 를 추가 변수로 도입한 반면 이 논문은 RoPE 단독으로 slash 를 도출. 만약 이 논문의 bound 가 더 sharp 하면 TAPPA 의 q-similarity 추가가 redundant 가능, 만약 부족하면 q-similarity 의 본질성이 확인. **읽을 가치**: 두 논문이 같은 시기 같은 venue 에 같은 phenomenon 을 다루는 자연 실험. 어느 framework 가 더 일반적인지 정확히 판단 가능. APF 의 RoPE 분석 부분에서 둘 모두 인용 + 어느 lemma 가 더 useful 한지 평가. 6-8 시간 deep read.

## 후속 3 (직접 후속 / 학습 dynamics 확장) — Lyle et al. 2025, *What Can Grokking Teach Us About Learning Under Nonstationarity?*

[arXiv:2507.20057, CoLLAs 2025] — 사용자가 이미 2026-05-01 에 다룬 논문. **본 논문과의 관계**: TAPPA 가 inference-time q-similarity 를 분석한 것을 training-time q-similarity dynamics 로 확장하면 grokking phase transition 의 새 signature 가능. Lyle 가 grokking 을 continual learning + non-stationarity 의 lens 로 본 것과 합쳐, "grokking 동안 query self-similarity 가 어떻게 evolve 하는가" 의 미답 질문이 자연스러운 follow-up. **읽을 가치**: 사용자 두 active track (APF + Grokking) 의 cross-pollination 핵심 다리. TAPPA 의 metric 을 grokking 의 phase 측정 도구로 활용 가능성 평가. APF 가 grokking 의 동시 framing 으로 가는 가능성도 시사. 사용자가 이미 읽었으므로 본 follow-up 은 "TAPPA 와 결합한 새 실험 설계" 의 두 시간 워크.
