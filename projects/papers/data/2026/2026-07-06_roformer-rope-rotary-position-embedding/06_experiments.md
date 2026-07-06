# 06. 실험 해부

원문 §4 는 네 벤치마크로 나뉜다. 각 실험에 대해 (i) 데이터 특성 · (ii) baseline 공정성 · (iii) 지표 선택 · (iv) 저자가 강조하는 결과 · (v) 숨은 신호 · (vi) 우리 관점 해석 을 순서대로 본다. **정확한 표 번호와 소수점 이하 수치는 본문 PDF 차단으로 단정하지 않는다.**

## 실험 1 — WMT2014 English-to-German 번역

- **데이터 특성**: WMT2014 En-De 는 표준 기계번역 벤치마크. 학습 4.5M 문장쌍, 개발/시험 세트 표준. 문장 길이 대부분 100 토큰 이하 (짧은 편). 위치 임베딩의 상대성보다 절대 위치 정보만으로도 충분히 학습 가능한 도메인.
- **왜 이 데이터가 적합**: 원조 Transformer (Vaswani 2017) 가 이 벤치마크로 처음 sinusoidal PE 를 검증한 곳이라, RoPE 의 sinusoidal 대체 주장을 정면 비교하려면 필수 통과 관문.
- **숨은 편향**: 문장이 짧으므로 RoPE 의 length-extrapolation 이점이 잘 드러나지 않는다. 저자가 이 실험을 통해 얻고 싶은 것은 "긴 문장에서 유리하다" 가 아니라 "짧은 문장에서도 최소 동등" 이라는 안전지대 확보.
- **Baseline 공정성**: 원 논문에서 vanilla Transformer 를 저자가 재구현했는지 문헌 값 인용인지가 세부 검증 필요 (본 환경 PDF 차단). WebSearch 인덱스에서 확인된 것은 RoFormer 27.5 BLEU vs vanilla Transformer 27.3 BLEU 라는 두 수치. 절대 차이 +0.2 BLEU 는 WMT2014 에서 통계적으로 유의미한지 borderline — 저자가 statistical significance 검정을 수행했는지 원문 §4.1 세부 필요.
- **지표 선택**: BLEU-4. 만약 chrF, TER, COMET 같은 다른 지표였다면 결론이 다를 수 있음. RoPE 는 문장 내 상대구조를 강조하므로 word-level BLEU 보다 chunk-level 지표에서 더 유리했을 가능성.
- **우리 해석**: WMT2014 En-De 는 short-context 도메인이라 RoPE 의 이론적 이점 (long-range decay, length-extrapolation) 이 발현될 여지가 적다. +0.2 BLEU 는 "동등하거나 소폭 상회" 정도로 조심스럽게 해석해야 하며, 이 실험만으로 RoPE 우위를 주장하기 어렵다.

## 실험 2 — GLUE (자연어 이해 벤치마크 6-task)

- **데이터 특성**: MRPC (paraphrase 인식) / SST-2 (sentiment) / QNLI (질문-문장 함의) / STS-B (semantic similarity) / QQP (Quora 질문 중복) / MNLI (natural language inference). 문장 길이 대부분 128 토큰 이하. Pretrained BERT 를 fine-tune 하는 표준 파이프라인.
- **왜 이 데이터가 적합**: BERT 의 learned absolute PE 를 정면으로 대체하는 RoPE 의 실용성을 검증하기 위해. RoFormer 는 BERT 와 같은 masked language model (MLM) 로 사전학습된 뒤 GLUE 로 fine-tune.
- **숨은 편향**: 사전학습 데이터·시간·모델 크기가 BERT 와 완전히 동등하지 않을 수 있다. 원 논문의 pretraining details (WuDao corpora, Zhuiyi 사내 데이터?) 는 본문 PDF 세부 필요. 만약 사전학습 데이터가 BERT (BookCorpus + Wikipedia) 와 다르다면 RoFormer 성능 이득이 PE 덕분인지 데이터 덕분인지 불분명.
- **Baseline 공정성**: 저자가 강조하는 것은 "match or exceed BERT". 문제는 BERT 자체가 다양한 버전 (BERT-base, BERT-large, whole-word-masking) 이 있고 원 논문이 정확히 어떤 BERT 와 비교했는지 원문 §4.2 표 세부 필요.
- **지표 선택**: 각 task 의 표준 지표 (MRPC F1, SST-2 accuracy, QNLI accuracy, STS-B Pearson/Spearman, QQP F1, MNLI matched/mismatched accuracy). 이는 관례이므로 특별한 편향 없음.
- **우리 해석**: GLUE 는 short-context 에서 위치 임베딩이 큰 차이를 만들지 않는 도메인. RoPE 가 여기서 BERT 와 "동등 혹은 상회" 라는 결과는 "적어도 손해는 안 본다" 는 안전지대 확보 정도. 논문의 주력 실증은 다음 실험 (긴 문서) 에 있다.

## 실험 3 — CAIL2019-SCM 중국 법률 텍스트 매칭 (⭐ 핵심 실험)

- **데이터 특성**: CAIL2019-SCM (Similar Case Matching) 은 중국 사법 판례 유사도 판정 태스크. 각 케이스가 판결문 여러 문단으로 이루어져 있어 실제 텍스트 길이가 512 토큰을 훨씬 초과. 저자는 최대 토큰 길이를 512 / 1024 로 나눠 실험.
- **왜 이 데이터가 적합**: 이 논문의 **가장 중요한 실증** 이다. RoPE 의 이론적 이점 (length-extrapolation 없이 자연스러운 위치 확장) 이 실제로 downstream 성능 향상으로 이어지는지를 보이는 자리. Learned absolute PE 로는 학습 최대 길이를 넘길 수 없지만, RoPE 는 회전각만 계산하면 되므로 512 → 1024 확장이 무비용.
- **핵심 결과**: WebSearch verbatim 확인 — RoFormer 를 512 → 1024 로 확장 시 정확도 68.29% → 69.79% 로 +1.5% 절대 향상. 그리고 RoFormer 는 WoBERT (word-level BERT variant) 대비 절대 +1.5% 향상. 두 개의 +1.5% 가 서로 다른 축인지 (길이 확장 축 vs baseline 비교 축) 원 논문 §4.3 표 세부 필요.
- **숨은 편향**: (i) 중국어 법률 도메인 특수성 — 이 도메인에서 성공한다고 영어·범용 long-context 에서도 같은 이득이 있다는 보장 없음. (ii) 512 → 1024 확장이 순수 PE 덕분인지 훈련 데이터 재분포 효과인지 통제 실험 필요. (iii) WoBERT 는 pretraining recipe 가 다를 수 있어 비교의 정합성 확인 필요.
- **Baseline 공정성**: BERT/WoBERT/RoBERTa 등을 같은 사전학습 스케줄로 비교해야 공정한데, 원 논문의 pretraining 세부는 본문 PDF 확인 필요.
- **지표 선택**: 정확도 (accuracy). 이 태스크가 binary classification (두 케이스가 유사한지 여부) 이면 F1, AUC 등 다른 지표도 후보. 저자가 정확도 하나만 보고했다면 class imbalance 처리를 확인해야.
- **우리 해석**: 이 실험이 RoPE 의 진짜 무기다. 이론이 실증으로 이어지는 가장 명확한 증거. 다만 도메인 (중국 법률) 이 특수해 일반화에는 후속 검증이 필요하다. LLaMA·Mistral 이 이후 실제로 32k, 128k 문맥에서 RoPE 를 검증한 것이 이 실험의 확장.

## 실험 4 — Enwik8 (character-level LM + Performer 결합)

- **데이터 특성**: Enwik8 은 English Wikipedia 초반 100M byte 를 character-level 로 처리하는 압축·LM 벤치마크. 단위가 byte 이므로 시퀀스가 매우 길고 (수천 문자), long-range dependency 가 지배적.
- **왜 이 데이터가 적합**: (i) Long-context 에서 RoPE 의 감쇠 성질이 실제로 문제인지 검증. (ii) Linear attention (Performer) 와의 결합 실효성 검증 (§4.4 § 05.d 참조).
- **핵심 결과**: Performer + RoPE 가 vanilla Performer 대비 학습 손실 수렴이 빠름 (verbatim). Vanilla Transformer + sinusoidal PE 대비 절대 성능이 어떤지는 원문 §4.4 표 필요.
- **숨은 편향**: Character-level LM 은 word-level 과 통계 분포가 매우 다름. 이 실험에서의 우위가 word-level LM (예: GPT 스타일 pretraining) 로 이전되는지는 별도 검증 필요.
- **지표 선택**: Bits-per-character (BPC). 표준 지표이므로 편향 없음.
- **우리 해석**: 이 실험은 RoPE 의 방법론적 확장 (linear attention 결합) 을 최소 검증한 파일럿이지, RoPE 우위의 결정적 증거는 아니다.

## 저자가 강조하는 것 vs 강조하지 않는 것

**강조**: (i) 길이 확장성 (CAIL2019-SCM), (ii) 이론의 우아함 (§3), (iii) 실용 벤치마크 상회 (GLUE, WMT).

**강조 안 함 (숨긴/미완성)**:
- **Ablation on frequency spectrum $\theta_i$**: sinusoidal 유산을 그대로 썼다. 다른 스펙트럼 (linear, log-normal, learnable) 과의 비교가 원 논문에 없거나 부족. 후속 연구 (Frontiers 2025) 가 이 gap 을 메움.
- **Direct comparison with T5-relative bias**: T5-relative 는 당시 가장 강력한 상대위치 방식이었는데 원 논문의 직접 비교가 부족. Kazemnejad 2023 (2026-06-08 커버) 이 이 비교를 완성.
- **Long-context (>>1024) 실험**: 512→1024 는 봤지만 4k, 8k 는 없음. 이후 LLaMA 등이 실전 검증.
- **Seed variance**: 각 벤치마크의 평균만 보고, 표준편차·seed 변동을 보였는지 원문 §4 세부 필요.

## 부록에 숨은 신호 (원문 접근 못 함, 추측 대상)

원 논문의 v5 (2023-11-08) 은 초판에서 여러 번 개정되었다. 개정 과정에서 (i) 이론 유도의 refinement, (ii) 추가 실험 도표, (iii) 후속 연구 인용이 붙었을 가능성 높음. 정확한 revision 내용은 본문 PDF 접근 필요.

## 수치 투명성 (본 해체에서 확인한 것과 안 한 것)

| 항목 | 값 | 근거 |
|------|-----|-----|
| WMT2014 En-De RoFormer BLEU | 27.5 | WebSearch verbatim |
| WMT2014 En-De vanilla Transformer BLEU | 27.3 | WebSearch verbatim |
| CAIL2019-SCM 512 tokens 정확도 | 68.29% | WebSearch verbatim |
| CAIL2019-SCM 1024 tokens 정확도 | 69.79% | WebSearch verbatim |
| RoFormer vs WoBERT 절대 향상 | +1.5% | WebSearch verbatim |
| GLUE MRPC/SST-2/QNLI/STS-B/QQP/MNLI 세부 값 | 미확인 | 본문 PDF 차단 |
| Enwik8 BPC | 미확인 | 본문 PDF 차단 |
| Performer + RoPE 정확 학습 곡선 좌표 | 미확인 | 본문 PDF 차단 |
| 각 seed variance / std | 미확인 | 본문 PDF 차단 |
