# 10b. 사고 확장 — Follow-up 3편

> 배경 사다리: 선행 (PIXIU 가 흡수한 작업) 1편, 경쟁 (PIXIU 와 유사 시기, 다른 접근) 1편, 후속 (PIXIU 가 영향 미친 작업) 1편. 각 4-6줄.

## 선행 — FLAN (Wei et al. 2022, ICLR) — Finetuned Language Models are Zero-Shot Learners

**무엇인가**. Google 의 instruction tuning 의 첫 large-scale 검증. 137B 일반 language model 위에 60+ NLP task 의 instruction format 데이터로 fine-tune. unseen task 에서 zero-shot 능력 대폭 향상. arXiv:2109.01652, ICLR 2022.

**본 PIXIU 와의 관계**. PIXIU 의 핵심 idea "도메인 LLM 에 instruction tuning 적용" 의 일반 NLP 측 prototype. **FIT 의 5-카테고리 prompt format 디자인이 FLAN 의 60-task instruction template 의 직접 후속**. PIXIU = "FLAN 의 금융 도메인 specialization".

**얻을 수 있는 것**. (i) Instruction format 디자인의 표준 recipe — "task description + label tokens + few-shot example" 의 4-part prompt. (ii) Zero-shot evaluation protocol — unseen task 에서의 zero-shot 측정이 instruction tuning 의 marginal value 의 직접 metric. (iii) Multi-task fine-tuning 의 categorical balance 의 중요성 — FLAN 의 분석이 catastrophic forgetting 의 명시적 측정 포함.

**본 사용자에게**. P1 ProTran-TFA 의 multi-domain (US/EU/Asian markets) 확장 시 FLAN-style multi-domain instruction tuning recipe 사용 가능. NeurIPS 2027 Grokking-in-TS-Transformers 의 §2 Related Work 에서 instruction tuning 의 phase transition 측정 가능성 언급할 때 FLAN 직접 인용.

## 경쟁 — FinGPT (Yang, Liu, Wang 2023, arXiv:2306.06031) — Open-Source Financial Large Language Models

**무엇인가**. PIXIU 와 거의 동시 발표 (2023-06-10 vs PIXIU 2023-06-08). LLaMA 위에 LoRA fine-tuning + multi-task adapter. Sentiment Analysis 중심 + light-weight 학습. arXiv:2306.06031.

**본 PIXIU 와의 관계**. **같은 시기, 같은 base (LLaMA), 같은 데이터 일부 (FPB sentiment), 다른 접근 (LoRA vs full fine-tuning, single-task adapter vs multi-task unified)**. PIXIU 가 NeurIPS 2023 D&B Track 통과 → 더 큰 영향력. FinGPT 가 LoRA 의 light-weight 장점.

**얻을 수 있는 것**. (i) LoRA adapter 의 multi-task 분리 가능성 — 본 PIXIU 의 FinMA-7B-nlp vs FinMA-7B-full 의 분리 비교가 LoRA 라면 같은 base 위 2-adapter 로 깔끔히 분리 가능. (ii) light-weight 학습 의 가치 — 소비자 GPU 에서도 학습 가능 → 학계 reproducibility 향상.

**본 사용자에게**. 사용자 P1 ProTran-TFA 가 LoRA 기반으로 학습된다면 single A100 (학교 cluster) 으로도 finance venue submission 가능. **단일 GPU recipe** 의 detail 을 FinGPT 에서 차용.

## 후속 — FinBen (Xie et al. 2024, NeurIPS 2024 D&B, arXiv:2402.12659) — An Holistic Financial Benchmark for Large Language Models

**무엇인가**. PIXIU 의 직계 후손. 30+ task / 5+ language / 1 agent task (FinMem) 로 확장. **32-author / 13-institution** 의 multi-institution collaborative 작업. arXiv:2402.12659, NeurIPS 2024 D&B Track.

**본 PIXIU 와의 관계**. PIXIU 의 모든 인프라 (FIT, FLARE, FinMA, eval.py) 를 그대로 흡수 + 확장. **PIXIU 가 prototype, FinBen 이 product**. README "📢 Update (Date: 02-20-2024)" 절 명시: "our paper, 'The FinBen: An Holistic Financial Benchmark for Large Language Models', is now available at FinBen".

**얻을 수 있는 것**. (i) 30+ task 확장의 디자인 결정 — 어떤 새 task 를 추가했고 왜. credit scoring 7-dataset 의 추가, ESG classification, multi-lingual (스페인어/중국어) 등. (ii) Agent task 의 정식 일원화 — single-step prediction 에서 multi-step decision-making 으로의 전환. FinMem 의 profile + memory + decision-making 3-module. (iii) Leaderboard 의 사회적 채택 — HuggingFace Spaces 의 Open Financial LLM Leaderboard 가 PIXIU-FinBen 위에 구축됨.

**본 사용자에게**. (i) 사용자 P1 ProTran-TFA 가 finance venue 진출 시, FinBen 의 30-task evaluation 도 함께 considerate. PIXIU 만 인용하면 outdated, FinBen 까지 dual citation. (ii) FinMem agent 의 single-stock TSLA trading 시나리오는 사용자 shelved AETHER (crypto cycle) 의 직접 사전 작업 — 코드 (`pipiku915/FinMem-LLM-StockTrading`) 까지 공개. (iii) FinBen 의 32-author multi-institution 모델이 본 사용자 (석사 1인) 의 single-author paper 한계를 인식하게 함 — 대신 specific contribution (e.g., APF mech interp on FinMA) 으로 sharp 한 single-author 작업이 더 적합.

## 3편 정리

| 분류 | 논문 | 본 PIXIU 와의 거리 | 사용자 직접 활용도 |
|---|---|---|---|
| 선행 | FLAN (Wei 2022) | 1세대 위 | ⭐⭐⭐ (instruction tuning 표준 recipe) |
| 경쟁 | FinGPT (Yang 2023) | 동시기 | ⭐⭐⭐⭐ (LoRA light-weight 학습 recipe) |
| 후속 | FinBen (Xie 2024) | 1세대 아래 | ⭐⭐⭐⭐⭐ (PIXIU 의 모든 인프라 + 확장 + leaderboard) |

3편 모두 본 사용자 paper 의 §2 Related Work + §5 Experiments 의 직접 인용 후보. 특히 **FinBen** 은 PIXIU 단독 인용보다 dual citation 으로 outdated 인상 회피.
