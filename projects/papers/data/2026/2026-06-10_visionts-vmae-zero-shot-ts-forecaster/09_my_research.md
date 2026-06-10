# 09 · 내 연구와의 연결

이 절은 `_profile.md` 의 관심 영역 §A~F 와 **보유 자산 목록 (특히 APF + Grokking active track + paused P1 ProTran-TFA)** 에 본 논문을 핀으로 꽂는다. 일반론 ("이 논문은 시계열 모델에 참고 가능") 은 금지, 구체 mechanism / axis / 수식 요소를 지정해 연결한다.

---

## A 라인 — Grokking in TS Transformers (`Grokking in Time Series Transformers/`)

### A-1. "Frozen pretrained 가중치로 zero-shot transfer" 가 grokking 의 phase transition 과 어떻게 다른가
Grokking 은 **train loss 가 먼저 0 으로 떨어진 뒤 test accuracy 가 따라 올라가는 지연 일반화**. VisionTS 는 **train 없이도 test 성능이 강함** (zero-shot transfer). 이 둘은 표면적으로 반대이지만, **공통 구조** 가 있다: 학습된 representation 이 task 의 generalization 에 필요한 circuit 을 이미 갖고 있다는 점. Grokking 의 Nanda 2023 (인덱스 04-27) 이 발견한 **trig identity / Fourier circuit** 처럼, VisionTS 의 MAE 가 갖고 있는 **edge / texture / gradient 회로** 가 시계열의 trend/seasonality circuit 으로 직접 transfer.

**Grokking 페이퍼 §4 (representation utility)** 라인에 본 논문을 인용할 수 있다:
> "Cross-modal transfer 가 가능한 경우 (e.g., Chen et al. 2024 VisionTS), 사전훈련된 representation 의 *task-agnostic utility* 가 grokking 의 *task-specific phase transition* 의 한 극한 사례임을 시사한다. Grokking 이 'train 중 representation 이 학습되는 시점' 을 본다면 VisionTS 는 'train 0 epoch 에 representation 이 이미 transfer 가능' 한 강한 경우다."

### A-2. Logistic map / chaotic iterate 실험에서의 직접 비교 후보
프로파일 §A 의 **Logistic map thesis 2025** (직접 비교 대상) 와의 자연스러운 짝. Grokking 의 분석 환경(logistic map의 카오스 iterate) 을 VisionTS 의 zero-shot 도메인으로 가져갈 수 있다. 즉:
- **실험 디자인**: logistic map $x_{n+1} = r x_n (1 - x_n)$ 의 시퀀스를 VisionTS 로 zero-shot forecasting. periodicity 가 정의되지 않음 (카오스). VisionTS 가 어떻게 다루는지 측정.
- **예상**: zero-shot 성능 매우 약할 것 (자연 이미지에 없는 통계). 이것 자체가 본 논문의 **한계 증명** + grokking 의 **carefully constructed task** 측 강점을 부각하는 evidence.

### A-3. 인용 포인트 (Grokking 페이퍼 must_cite.md 신규 후보)
`Grokking in Time Series Transformers/references/must_cite.md` 에 22 must-cite 가 정리돼 있다. 본 논문은 **"Tier 3 — 비교 베이스라인 (zero-shot transfer 의 극한 사례)"** 칸으로 추가 후보. 인용 문장 초안:
> "Cross-modal foundation transfer (Chen et al. 2024, ICML 2025; arXiv:2408.17253) 은 시계열 학습 없이도 zero-shot forecasting 이 가능함을 보였으나, 본 연구의 grokking 환경 (synthetic non-stationary stream) 에서는 image domain prior 가 transfer 되지 않을 것으로 예상한다."

---

## B 라인 — Attention Pattern Fields (`Attention Pattern Fields/`)

본 라인이 VisionTS 와 가장 강하게 연결된다.

### B-1. APF 의 motif 분류를 cross-modal 로 확장
APF 의 모티프 분류 (diagonal / stripe / block / edge / spike / checker) 는 TS transformer 의 self-attention 위에서 측정된다. VisionTS 는 **frozen ImageNet MAE encoder/decoder** 의 attention 을 시계열 image 위에서 자연스럽게 보여준다. 즉:

**연결 1**: VisionTS 의 forward 에서 attention map 을 추출해 APF 의 motif classifier 로 분류하면 "image domain prior 가 시계열 image 에 어떤 motif 를 만들어내는가" 를 직접 측정 가능.

**가설**:
- 인코더의 초기 layer (1~6) → **diagonal / edge** motif (이미지의 local feature 추출, 시계열의 lag-1 local correlation).
- 인코더의 중간 layer (7~18) → **stripe / block** motif (이미지의 객체 boundary, 시계열의 periodic block).
- 디코더 → **horizontal stripe → cross-block** motif (input region ↔ horizon region cross-attention).

이 가설을 검증하면 APF 페이퍼의 **"PE 종류 × motif 종류" 매트릭스에 vision-pretrained 의 새 행/열 추가** 가능. 즉 PE 가 sinusoidal 2D fixed 인 MAE 가 시계열 측에서 어떤 motif 를 만드는지가 다른 PE 들 (NoPE, RoPE, ALiBi, learned, T5 relative) 과 어떻게 다른지 비교.

### B-2. APF 의 motif causality 실험에 VisionTS 추가
APF 의 현재 active 실험은 motif causality (motif 를 의도적으로 ablation 했을 때 forecasting performance 가 어떻게 깨지는지). VisionTS 는 frozen backbone 이므로:
- Encoder block N 의 motif M 을 randomized attention 으로 swap → forecasting 성능 변화 측정.
- 이 실험은 APF 의 ablation 패러다임 그대로 → 즉시 적용 가능.

**예상 결과**: encoder 중간 layer (10~16, large 의 경우) 의 motif 가 인과적으로 중요. 이는 He 2022 MAE 의 fine-tune 실험에서도 비슷한 관찰 (중간 layer 가 가장 representative) 와 일치할 것.

### B-3. APF 페이퍼 §3 인용 포인트 초안
APF 페이퍼 (TMLR 또는 NeurIPS 2027 submission 예정) 의 §3 motif typology 절에서 본 논문을 인용:
> "동일한 motif typology 가 cross-modal 사례에도 적용 가능한지 검토하기 위해 VisionTS (Chen et al., ICML 2025) 의 frozen ImageNet MAE encoder/decoder 의 attention map 을 우리의 6-motif classifier 로 분류했다 (Appendix C). 자연 이미지로만 사전훈련된 backbone 도 시계열 image 위에서 우리의 motif 분류와 양립 가능한 패턴을 보였다."

### B-4. APF concurrent work 와의 자리 매김
프로파일에 명시된 concurrent work 2개 (Kalnāre 2025 `arXiv:2511.21514`, Yang ICLR 2026 `arXiv:2601.21709` — 인덱스 05-04 cover) 와 별개로, VisionTS 는 **APF 의 cross-modal 확장 hook** 으로 작용. APF 가 TS transformer 의 motif 만 다루는 게 아니라 **TS-as-image foundation 의 motif 도 통합 분석** 한다는 narrative 가 가능.

---

## C 라인 — P1 ProTran-TFA (paused, finance venue 가능)

### C-1. VisionTSpp 의 quantile_head_num=9 를 ProTran 의 분위수 head 와 비교
`visionts/models_mae.py` 의 VisionTSpp 변형에서 `quantile_head_num=9` 가 명시. ProTran (NeurIPS 2021, 인덱스 05-19 cover) 도 probabilistic Transformer 로 분위수 head 를 갖는다. VisionTSpp 와 ProTran-TFA 의 직접 비교 실험을 P1 페이퍼의 baseline 표에 추가 가능.

**P1 페이퍼 §5 (Experiments) 베이스라인 표 갱신**: 기존 (Informer, Autoformer, PatchTST, MOIRAI, Chronos) 에 **VisionTSpp** 추가 — 같은 PF 데이터셋 (Walmart, Istanbul Traffic, Turkey Power) 으로 비교.

### C-2. State Street 공저 사실의 인용 가치
본 논문이 자산운용 대형사 State Street 와 공저인 점은 **금융 venue (IJF, QF, JFE-Comp)** 에 P1 ProTran-TFA 를 제출할 때 인용으로 **"image foundation 도 finance industry 가 검토 중"** 임을 시사하는 근거. 직접 인용 문구:
> "Cross-modal pretraining for financial time series forecasting is an active area: Chen et al. (ICML 2025), a collaboration between Salesforce, Zhejiang University, and State Street Technology, demonstrates that ImageNet-pretrained MAE achieves zero-shot SOTA on probabilistic forecasting benchmarks including retail sales (Walmart)."

### C-3. ProTran-TFA 의 attention 헤드 비교
P1 페이퍼 §3 (방법론) 의 ProTran-TFA attention 헤드 분석을 **VisionTSpp 의 frozen MAE 헤드와 비교** — APF 의 motif 분류기를 활용하면 cross-paper 매트릭스 가능.

---

## D 라인 — `_profile.md` §D (TS Transformers / 2D / TSFM Interp) 직접 채움

본 논문이 이 라인의 **ts-as-2d + tsfm-interp + ts-transformer-baseline 의 정확한 교차로** 다. `_coverage.md` 에서 ts-as-2d 가 가장 뒤처져 있었으므로 이 한 편이 §D 의 누락 영역을 가장 효율적으로 메운다.

**참고할 수식 인덱스**:
- 정규화 `(x - mean) / (std * 0.4 + eps)` → ProTran-TFA / APF 의 normalization 과 직접 비교.
- Reshape `b n (p f) -> b n f p` → TimesNet 의 `Reshape1Dto2D` 와 정확히 같음 — 같은 논거 재사용 가능.
- Mask alignment `mask_ratio = num_patch_input/num_patch` → cross-modal forecasting 의 일반적 정렬 패턴으로 정리 가능.

---

## E 라인 — 충돌·경쟁 지점

### E-1. 본 논문의 frozen backbone vs Grokking 의 trained-from-scratch
Grokking 의 본 페이퍼 hypothesis 가 "충분히 작은 transformer 가 충분히 긴 학습으로 generalization 회로를 발견" 이라면, VisionTS 는 "큰 frozen backbone 이 학습 없이도 회로를 갖고 있음" 으로 정반대. Grokking 페이퍼의 §6 (discussion) 에서 **"학습된 회로 vs 사전학습된 회로 의 spectrum"** 으로 두 paradigm 을 통합 정리해 본 논문을 인용할 수 있음.

### E-2. 본 논문의 단순 reshape vs APF 의 PE 강조
APF 는 PE 가 attention motif 의 결정자라고 주장. VisionTS 의 MAE 는 sinusoidal 2D fixed PE 만 사용 (학습 없음). 그런데도 시계열 측에서 잘 작동. 이 관찰은 APF 의 PE 결정성 주장을 약화시키는가? 또는 강화시키는가?

**해석**: APF 가 검증한 PE 영향은 **TS-native transformer 가 시계열로 처음부터 학습됐을 때**. VisionTS 의 frozen MAE 는 **다른 도메인에서 학습된 PE 가 그대로 다른 도메인에 transfer 됐을 때**. 두 경우는 다른 question. APF 의 주장은 "같은 backbone 을 같은 도메인 데이터로 학습할 때 PE 가 motif 결정" 으로 좁히면 무손상. 본 논문은 그 좁힌 명제의 외부 boundary 를 보여주는 역할.

---

## F 라인 — 반면교사

### F-1. "frozen 사전훈련의 거대 자산 활용" 자체가 본 논문의 강점
APF / Grokking 의 자기 학습 transformer 환경은 통제 변수 측면에서 우수하나, **scaling argument 부족**. 본 논문이 ImageNet 1.3M + ViT-Huge 600M+ parameter 의 거대 사전훈련을 한 줄로 빌려쓴 단순함은 **소형 통제 실험 + 대형 사전훈련 활용의 두 가지를 통합** 한 좋은 본보기.

**나의 후속 디자인 원칙**: APF/Grokking 의 다음 실험에 (i) 통제된 작은 transformer (ii) frozen pretrained backbone (예: VisionTS 변형, MOIRAI tier-1 fine-tune) 의 **2 stream 병행** 을 표준화. 양 극단의 결과를 같은 도구 (APF motif classifier) 로 측정하면 transfer 와 학습의 두 paradigm 을 한 페이퍼 안에서 연결 가능.

### F-2. 본 논문이 **못 한** 것
- mech interp 적 해부 (attention map 시각화 외 SAE / circuit 단위 분석) — APF/Mishra 2026 이 후속으로 해야 할 영역.
- 비정상·fat-tail 도메인 (금융 returns) 에서의 explicit 검증 — P1 ProTran-TFA 가 자연스러운 후속.
- multi-channel ≥ 4 + irregular sampling — IMTS / VisionTS++ 가 이미 풀어줌.

내 후속 연구의 첫 자리는 **mech interp 측면** 일 가능성이 가장 높다. APF 의 motif 분류기를 frozen MAE 위에서 작동시키는 실험은 (i) 1 주일 이내 구현 가능 (코드 한 줄로 `visionts.VisionTS()` 로딩 + attention map hook 만 추가), (ii) APF 페이퍼 추가 표 1 개 분량의 명확한 결과 산출 가능, (iii) cross-modal 확장 narrative 의 강한 evidence.

## 이 절의 한 줄 요약

> "본 논문은 APF 페이퍼의 motif 분류기를 cross-modal 확장하는 직접적 hook 이고, Grokking 페이퍼의 representation utility 토론에 frozen-transfer 라는 극한 사례를 제공하며, P1 ProTran-TFA 의 베이스라인 표에 VisionTSpp 를 추가할 자연스러운 후보다. 단순 인용을 넘어 **APF 페이퍼에 Appendix C 1 페이지 분량의 추가 실험 (frozen MAE 위 motif 분류)** 으로 본 논문이 적극 활용될 수 있다."
