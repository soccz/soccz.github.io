# 10-B Follow-up 논문 3편

## (선행) Bahdanau et al. 2015 — *Neural Machine Translation by Jointly Learning to Align and Translate*

**어떤 논문**: Attention mechanism 을 NLP 에 *최초로* 도입한 ICLR 2015 논문. Encoder-decoder seq2seq 모델 (RNN) 에서 source 문장의 각 position 에 대한 가중치를 *학습 가능한 alignment* 로 정의. *Bahdanau attention* 의 *additive (tanh)* scoring 함수가 본 논문의 testbed.

**본 논문과의 관계**: *방법론적 출발점이자 비판 대상*. Bahdanau 의 영-불 alignment heatmap (논문 Fig. 3) 이 "attention = alignment = explanation" 의 *문화적 등식* 의 가장 강력한 시각화. 본 논문은 그 등식의 *후반부* (alignment → explanation) 를 검증·반박. *Bahdanau 의 attention 발명* 자체는 그대로 두지만 *해석적 사용* 의 정당성을 문제 삼는 구조.

**무엇을 얻을 수 있는가**: (1) Attention 분포의 *왜 그 형태인가* 의 *원래* 동기 — explanation 이 아닌 *gradient flow 의 효율* 과 *long-range dependency* 처리. (2) *Attention as soft alignment* 와 *attention as explanation* 이 *서로 다른* 주장이라는 분리 의식. (3) 시계열 도메인에서 *alignment* 가 *explanation* 보다 더 적절한 사용 사례일 수 있다는 통찰 (TS encoder-decoder forecasting 에서 alignment 의 유의미함).

## (경쟁) Wiegreffe & Pinter 2019 — *Attention is not not Explanation*

**어떤 논문**: 본 논문 발표 7개월 후 EMNLP 2019 의 *직접 rebuttal*. 4개 실험 모듈로 본 논문에 대응: (1) uniform-attention baseline 의 성능 저하 → attention 이 *어떤 정보를 담음*, (2) random seed 다중 학습 시 attention 분산 분석 → attention 의 *재현성* 이 어떤 부류 데이터에서는 견고, (3) BoW + 학습된 attention 으로 *진단 분류기* → attention 이 *유용한 prior*, (4) *적대적 attention 으로 학습된 모델* 의 정상 baseline 대비 성능 비교 → *naturally arising* attention 과 *adversarially injected* attention 의 분리.

**본 논문과의 관계**: *반박*. 본 논문이 *부정* 명제 ("attention is NOT explanation") 를 주장한 데 대해, Wiegreffe-Pinter 는 *이중 부정* ("not NOT explanation") 으로 *부분적* 반박. 핵심 통찰: 본 논문의 adversarial 분포가 *학습 가능한* 분포인지 *별 검증* 필요. 통합 결론: *attention 은 일부 task / 도메인 에서는 유의미한 정보 전달자*, 그러나 *모든 경우에 explanation 이라는 강한 주장* 은 정당화 안 됨.

**무엇을 얻을 수 있는가**: (1) 본 논문의 결론이 *어떻게 반박될 수 있는가* 의 모범 — APF reviewer 가 던질 비판의 *완성된 형태*. (2) *Plausibility vs faithfulness 분리* 의 명시적 framing. (3) 우리가 *adversarial constraint* 를 어떻게 *더 엄격하게* 설정해야 reviewer 의 *반박* 을 미연 차단할 수 있는가의 청사진. (4) "*attention 도 explanation 도 어떤 의미에서는 가치 있다*" 라는 *건설적* 입장의 학습 — APF/Grokking 의 *어떤 motif/circuit 도 explanation 일 수 있다* 라는 *positive* 주장 만들기 위한 수사 모델.

## (후속) Wilinski et al. ICML 2025 — *Exploring Representations and Interventions in Time Series Foundation Models*

**어떤 논문**: 2024-2025 의 *TSFM (Time Series Foundation Model)* 에 *mechanistic interpretability* 를 적용. *Internal representation analysis* (probing) + *intervention experiments* (특정 head/layer 의 *ablation/replacement*) 의 결합. Chronos/MOIRAI/TimesFM 류 모델에서 *어떤 component 가 어떤 forecasting subtask 를 담당* 하는지 분해. (정확한 venue: ICML 2025 — 본 환경에서 원문 미확인.)

**본 논문과의 관계**: *후손*. 본 논문의 *intervention 패러다임* (H2 의 attention 강제 교체) 이 7년 후 TSFM 의 *layer/head/circuit ablation* 으로 *확장 + 도메인 이동* 한 사례. 본 논문이 *attention 단일 layer 의 1D 분포* 만 perturb 한 것을 Wilinski 가 *층-단위 representation* 으로 일반화.

**무엇을 얻을 수 있는가**: (1) *TS 도메인 + intervention* 의 *현재 학계 최신 표준* — 내 Grokking + APF 트랙이 *비교 ground* 으로 삼아야 할 paper. (2) *Foundation model 의 attention faithfulness* 가 *task-specific* 일 수 있다는 발견 — APF 의 *motif typology × task* 격자의 정당화. (3) *Causal sufficiency 검증* 의 *modern* 절차 (logit-difference, indirect effect) 의 학습 — 본 논문의 *naive* TVD/JSD 보다 *세련된* metric 채택 가능. (4) *내 논문의 baseline* 으로 *명시 인용* 필요.

→ 이 논문은 `_index.md` 의 priority "APF — TSFM Interpretability" Tier 에 있으나 아직 미커버. 차기 수요일 (인접 버킷) 또는 다음 월요일 (코어 cross) 에 우선 다이브 후보.
