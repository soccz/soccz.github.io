# 08. 이론적 계보

> 배경 사다리: 이 절은 ① 일반 NLP 의 GLUE → SuperGLUE → SuperNaturalInstructions → BIG-bench 의 벤치마크 라인이 어떻게 분야를 형성했는가, ② Alpaca/FLAN/Self-Instruct 의 instruction tuning 라인이 PIXIU 의 직계 조상이라는 점, ③ PIXIU 후손이 1년 만에 FinBen NeurIPS 2024 / IJCAI 2024 FinLLM Challenge 로 폭발했다는 점을 알면 따라온다.

## 1. 이론적 조상 — PIXIU 가 직접 흡수한 4편

### (가) FLAN (Wei et al. 2022, ICLR) — Finetuned Language Models are Zero-Shot Learners

**무엇이었나**. Google 의 instruction tuning recipe. 137B language model 위에 60+ NLP task 의 instruction format 데이터로 fine-tune → 다양한 unseen task 의 zero-shot 능력 대폭 향상.

**PIXIU 와의 연결**. PIXIU 의 핵심 아이디어 "도메인 LLM 에도 instruction tuning 을 적용해 zero-shot 능력 향상" 이 FLAN 의 일반 NLP 결과를 도메인 (금융) 으로 옮긴 것. **FIT 의 5-카테고리 instruction format 디자인이 FLAN 의 multi-task instruction format 의 직접 후속**. README "FIT — Modality and Prompts" 표의 prompt template 구조가 FLAN 의 prompt template (task description + input + label options + example) 와 거의 동일.

**무엇을 빌려왔나**. (i) Multi-task instruction tuning recipe. (ii) Task description + label tokens 의 prompt design. (iii) Zero-shot evaluation 의 표준 protocol.

### (나) Alpaca (Taori et al. 2023, Stanford) — Stanford Alpaca: An Instruction-following LLaMA Model

**무엇이었나**. LLaMA-7B + 52K Self-Instruct 데이터로 fine-tune → GPT-3.5 와 견줄만한 instruction-following 모델. **공개 모델 + 공개 데이터** 의 첫 사례.

**PIXIU 와의 연결**. Alpaca = "LLaMA + 52K Self-Instruct" → FinMA = "LLaMA + 136K FIT". 같은 base, 같은 fine-tuning 패러다임, 같은 공개 정신. **FinMA 는 Alpaca 의 직접 후손이자 도메인 특화 사례**.

**무엇을 빌려왔나**. (i) LLaMA base 선택. (ii) FastChat 호환 conversations JSON 포맷. (iii) "공개 = academic value" 의 NeurIPS D&B Track 정신.

### (다) BIG-bench (Srivastava et al. 2022) — Beyond the Imitation Game Benchmark

**무엇이었나**. 200+ task 의 NLP 벤치마크 collaborative 작업. 442 명 저자, NeurIPS 2022 발표.

**PIXIU 와의 연결**. 벤치마크 디자인의 모범 사례. **diverse task category + open evaluation harness + collaborative authorship** 의 3-요소가 PIXIU 의 후속 FinBen NeurIPS 2024 의 32-author multi-institution 작업을 가능하게 한 모범.

**무엇을 빌려왔나**. (i) 다양한 task category 의 통합 vs 단일 task focus 의 분기. (ii) Open evaluation infrastructure 의 가치 인식. (iii) Long-tail task (rare domain) 의 정식 일원화.

### (라) BloombergGPT (Wu et al. 2023, arXiv:2303.17564) — A Large Language Model for Finance

**무엇이었나**. 50B parameter, 365B token (private financial + public) 학습 도메인 LLM. **비공개 모델, 비공개 데이터**.

**PIXIU 와의 연결**. PIXIU 가 정면에서 풀려한 문제 — 비공개성. **본 PIXIU 의 abstract / motivation 의 가장 큰 부분이 "BloombergGPT 의 비공개성 vs PIXIU 의 공개성"** 대비. BloombergGPT 가 없었다면 PIXIU 의 contribution 이 덜 sharp 했을 것.

**무엇을 빌려왔나**. (i) 도메인 LLM 이 가능하다는 proof of concept. (ii) 비교 baseline 으로 사용 (단 자기-보고 수치). (iii) "공개성 자체가 contribution" 의 negative example.

## 2. 평행 연구 — 비슷한 시기, 다른 접근

### (가) FinGPT (Yang, Liu, Wang 2023, arXiv:2306.06031) — FinGPT: Open-Source Financial Large Language Models

**무엇인가**. PIXIU 와 거의 동시 발표 (2023-06). LLaMA 위에 LoRA fine-tuning + Sentiment Analysis 중심 데이터.

**왜 PIXIU 가 이겼나** (또는 어느 영역에서 상대가 나은가).
- **PIXIU 가 우세**: 벤치마크 디자인 + 평가 인프라 (8 task, 15 dataset) 의 완성도. NeurIPS 2023 D&B Track 통과는 PIXIU.
- **FinGPT 가 우세**: LoRA fine-tuning 의 가벼움 (소비자 GPU 에서 학습 가능) + multi-task adapter 분리.

### (나) BloombergGPT (Wu 2023, arXiv:2303.17564) — 위 조상 절에서 다룸. 평행 연구로도 분류 가능.

### (다) InvestLM (Yang et al. 2023, arXiv:2309.13064) — A Financial Large Language Model Tuned with Mixed Instructions

**무엇인가**. LLaMA-65B 위에 financial instruction tuning. PIXIU 보다 큰 base, 더 좁은 instruction range.

**왜 PIXIU 가 이겼나**.
- **PIXIU 가 우세**: 평가 벤치마크 명시 + 데이터 공개. InvestLM 은 평가 standardization 약함.
- **InvestLM 이 우세**: 65B 의 큰 base 로 도메인 reasoning 능력 잠재적 우위.

### (라) FinT5 / FinBERT 계열 — Encoder-only / Encoder-decoder 도메인 모델

**무엇인가**. BERT, T5 의 도메인 fine-tune 계열. NLP 측 표준이지만 generative 능력 약함.

**왜 PIXIU 가 이겼나**.
- **PIXIU 가 우세**: Generative 능력 (QA, 요약) + instruction-following.
- **FinBERT/FinT5 가 우세**: Specific task (FPB sentiment) 의 fine-tune 절대 성능. 그러나 multi-task generalist 가 아닌 specialist.

## 3. 후손 예측 — PIXIU 에서 파생된 연구 (이미 발표된 것 + 발표 예정)

### (가) FinBen (Xie et al. 2024, NeurIPS 2024 D&B, arXiv:2402.12659) ← **이미 발표됨**

**무엇인가**. PIXIU 의 직계 후손. 30+ task 로 확장 + multi-lingual (영어/스페인어/중국어 unified) + agent task (FinMem) 포함.

**연결**. PIXIU 의 모든 인프라를 그대로 흡수 + 확장. README 본문 "📢 Update (Date: 02-20-2024)" 절 명시 "our paper, 'The FinBen: An Holistic Financial Benchmark for Large Language Models', is now available at FinBen". 32-author 의 multi-institution 작업으로 폭발 — PIXIU 의 사회적 채택의 가시화.

### (나) IJCAI 2024 FinLLM Challenge ← **이미 발표됨**

**무엇인가**. README "📢 Update (Date: 05-02-2024)" 절 명시. The Fin AI 그룹이 주관한 IJCAI 2024 의 official challenge. PIXIU 평가 인프라 위에 외부 참가자들의 모델 경쟁.

**연결**. PIXIU 의 leaderboard 사회화. 학계 표준이 challenge 형식으로 확장.

### (다) FinMem: LLM Trading Agent ← **이미 발표됨**

**무엇인가**. README 의 별도 절로 통합된 LLM trading agent. Profiling + Memory + Decision-making 의 3-module. Single stock (TSLA) trading 시연.

**연결**. PIXIU 의 stock movement prediction 단일 task → trading agent 라는 end-to-end pipeline 으로 확장. **본 환경에서 별도 GitHub repo (pipiku915/FinMem-LLM-StockTrading) 로 분리**. PIXIU 가 single-step prediction 이라면 FinMem 은 multi-step decision-making.

### (라) 후손 예측 — 아직 발표되지 않은 가능성

**예측 1: PIXIU + Time Series Foundation Model 통합**. 본 PIXIU 의 stock prediction 이 LLM single-step prediction 인데, Chronos / MOIRAI / TimesFM 같은 TS foundation model 의 출력을 LLM 의 context 로 주입하는 hybrid 모델. 본 사용자 인덱스의 Chronos (2026-04-29 cover) + MOIRAI (2026-06-03 cover) + Tan 2024 (2026-06-17 cover) 의 negative result 가 정확히 이 hybrid 가 시급함을 시사.

**예측 2: PIXIU + Mech Interp**. FinMA 의 instruction tuning 으로 LLaMA attention 분포가 어떻게 재배치되는가의 mech interp 분석. 본 사용자의 APF (Attention Pattern Fields) 의 직접 후속 가능 — PE × motif × **domain-tuning** 의 3-축으로 확장.

**예측 3: PIXIU + Multimodal Time Series**. Stock prediction 의 (tweets, OHLCV) 외에 (chart image, fundamental table, news long-form) 등을 더 추가한 5+ modality 확장. VisionTS (2026-06-10 cover) 의 image-as-TS 정신을 chart 로 합쳐 확장.

## 4. 본 PIXIU 라인의 위치 — 분야 지도

```
                  GLUE/SuperGLUE (NLP standard benchmark)
                              │
                              ▼
                    FLAN (instruction tuning)
                       │
                       │  + Alpaca (LLaMA + 52K instruction)
                       ▼
                    PIXIU (NeurIPS 2023 D&B) ← 본 논문
                       │
            ┌──────────┼────────────┐
            ▼          ▼            ▼
        FinBen    IJCAI FinLLM   FinMem agent
       (NeurIPS    Challenge     (LLM trading)
         2024)     (2024)
            │
            ▼
        No Language is an Island (다국어 통합)
        Dólares or Dollars? (이중언어)
```

PIXIU 는 일반 NLP 벤치마크 라인 (GLUE/FLAN/Alpaca) 의 **도메인 전이** 의 paradigmatic 사례. 본 PIXIU 의 영향력이 가시화된 시점은 발표 1년 후 FinBen 의 multi-institution 폭발 — 즉 **벤치마크 분야의 short-feedback-loop** 의 successful 사례.

## 5. PIXIU 가 못 한 것 → 본 사용자 (석사) 가 이어받을 만한 작업

- (a) Mech interp on FinMA — APF 연결
- (b) Stock movement prediction 의 TS-LLM hybrid — Chronos/MOIRAI 연결
- (c) Multi-region 금융 시장 (Korean / Asian) 의 PIXIU-style 벤치마크 — ProTran-TFA 의 finance venue 연결
- (d) AETHER (crypto cycle) 의 sentiment+price 멀티모달 — BigData22/ACL18 substrate 활용

각각이 9_my_research.md 에서 더 자세히.
