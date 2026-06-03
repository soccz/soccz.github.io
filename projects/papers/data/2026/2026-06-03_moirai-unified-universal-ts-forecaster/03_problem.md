# 2. 문제 지형도

## 배경 사다리

이 절을 이해하려면 ① **시계열 (time series)** 이 "시간 순서로 관측된 숫자열" 이라는 것, ② **forecasting** 이 "과거 관측치로 미래값(또는 미래 분포)을 추정하는 것", ③ **deep learning 모델** 이 보통 "한 데이터셋으로 한 모델을 학습해 그 데이터셋에서만 평가" 한다는 관행 정도만 알면 된다. **Foundation model (FM)** 은 "거대 데이터로 한 번 사전학습하고, downstream task 여러 개를 추가학습 없이 zero-shot 으로 푸는 모델" 을 가리킨다. 이 절은 그 FM 패러다임을 시계열에 가져오려 할 때 어떤 일이 벌어지는지를 다룬다.

## 실제 문제가 현실에서 어떻게 생기는가

### 상황 1 — Salesforce 의 클라이언트 다양성

Salesforce 는 CRM 플랫폼이다. 클라이언트가 e-commerce 라면 시간당 sales(양수, 정수, 우측편향), 클라우드 인프라라면 분당 CPU 사용률(0-100% bounded), 에너지 회사라면 시간당 전력수요(양수, 계절성), 헬스케어라면 일별 처방 건수(이산 양수). 각 클라이언트마다 별도 forecasting 모델을 만들어 배포한다면 **N 개 모델 × M 클라이언트** 의 운영 비용이 폭발한다. 단일 사전학습 모델 하나로 *임의의 클라이언트 데이터에 zero-shot* 대응하는 게 ROI 가 좋다.

### 상황 2 — 새 데이터셋의 cold start

학술적으로도 동일하다. 새 데이터셋(예: 새로 공개된 도시 교통 흐름 데이터)이 등장하면, dataset-specific 모델은 처음부터 학습해야 한다. 학습 데이터가 적으면 overfit, 학습 시간이 길면 의사결정 지연. Universal model 이라면 *데이터셋을 처음 본 순간 바로 예측* 가능.

### 상황 3 — 다중 frequency 같은 도메인 안의 이질성

같은 "에너지" 도메인 안에도 *분 단위 스마트미터*, *시간 단위 wholesale 전력가격*, *일 단위 청구서*, *월 단위 발전소 계획* 이 공존한다. 도메인 데이터로 한 모델을 학습하고 싶은데 frequency 가 7-8 단계 흩어져 있어, *single patch size* 를 가정한 patch-based Transformer (PatchTST 등) 는 곤란. 시계열 데이터의 *patch* 는 (NLP 의 BPE token 이 글자 단위로 고정된 길이를 가지듯) 보통 16/32/64 시점 등으로 *고정* 되어 있다.

## 기존 접근 계보 (연대순 6 이정표)

### (1) DeepAR (Salinas et al. 2020) — Probabilistic RNN per dataset

**무엇이었나**: Amazon 의 LSTM 기반 확률 forecaster. 각 시계열의 미래분포를 Gaussian 또는 Student-T 한 가지로 가정해 NLL 학습.
**왜 부족했나**: (i) 한 데이터셋에 한 분포만, (ii) variate 차원이 고정, (iii) cross-dataset transfer 미고려.
**남긴 교훈**: NLL 최적화로 multi-quantile / interval 평가까지 한 헤드로 처리 가능. 본 논문은 *분포 하나* → *분포 mixture* 로 일반화.

### (2) Informer / Autoformer / FEDformer / PatchTST (2021-2023) — Long-sequence specialists

**무엇이었나**: ETT / Electricity / Weather 등 long-sequence forecasting 벤치마크에서 SOTA 다툼. ProbSparse self-attention, auto-correlation, frequency-enhanced decomposition, channel-independent patching 등 architectural innovation.
**왜 부족했나**: 한결같이 *one-model-per-dataset*. 데이터셋 간 transfer 실험 거의 없음. variate 수도 고정 (patching 은 channel-independent 하므로 부분 해소).
**남긴 교훈**: Patch-based tokenization (PatchTST) 이 long-context 처리에 핵심. 본 논문의 multi-patch-size 는 이의 보편 확장.

### (3) LLMTime (Gruver et al. 2023) — LLM 을 시계열로 reprogramming

**무엇이었나**: GPT-3 / LLaMA-2 등 text-pretrained LLM 의 tokenizer 에 시계열을 숫자 string 으로 넣어 zero-shot 예측. *Reprogramming* 패러다임 (Zhou et al. 2023 / Jin et al. 2023 Time-LLM 동일 시기).
**왜 부족했나**: (i) tokenizer 가 숫자에 대해 최적화되어 있지 않음 — *어휘 효율* 저하, (ii) 추론 속도 매우 느림, (iii) 학습 도메인 (text) 과 평가 도메인 (시계열) 의 *modality gap* 이 모델 용량을 낭비.
**남긴 교훈**: *categorical (이산) flexible distribution* 을 LLM 으로 흉내낼 수 있음. 본 논문은 *연속 mixture* 로 그 flexibility 를 더 효율적으로 확보.

### (4) ForecastPFN (Dooley et al. 2023) — Synthetic-only PFN

**무엇이었나**: PFN (Prior-Fitted Networks) 방식. 합성 시계열 prior 60M 으로만 사전학습, 실제 zero-shot.
**왜 부족했나**: (i) synthetic 만 → real-world distribution shift 미반영, (ii) 짧은 series 만 강함, (iii) probabilistic forecast 미지원.
**남긴 교훈**: zero-shot 이 *원칙적으로 가능* 하다는 존재 증명. 단, real data 로 학습해야 cross-domain 강건성 확보.

### (5) Lag-Llama (Rasul et al. 2023) — Foundation model for probabilistic

**무엇이었나**: LLaMA architecture 를 lag features 와 함께 시계열에 적용. Monash <1B obs 로 사전학습. neural scaling laws for TS 첫 제시.
**왜 부족했나**: (i) **단일 Student-T 분포만 — 비대칭 분포 미대응** (저자들이 Section 4.3 에 직접 미래 작업으로 명시), (ii) 단변량만(multivariate 미지원), (iii) Monash 데이터셋 규모(~1B) 가 FM 기준 작음.
**남긴 교훈**: TS 에 *neural scaling laws* 가 적용된다. 본 논문은 단일분포 → mixture 로 확장하고 LOTSA 로 데이터 규모를 27 배 늘려 그 scaling 을 더 멀리 검증.

### (6) TimesFM (Das et al. 2023b) / TimeGPT-1 (Garza & Mergenthaler-Canseco 2023) — 비공개 100B 학습

**무엇이었나**: Google 의 decoder-only patch-based foundation model (TimesFM). Google Trends + Wiki pageviews + 일부 open-data 로 100B+ 시점 학습. TimeGPT-1 은 Nixtla 의 closed-source 상용.
**왜 부족했나**: (i) **데이터 비공개** — 학술적 재현 불가, (ii) TimesFM 은 *point forecast* 만, (iii) variate 차원 1차원 가정.
**남긴 교훈**: 100B 시점 규모가 TS FM 의 적정 영역. 본 논문은 *공개 자원만으로* 동등 규모 확보 (LOTSA 27.6B → 학습 시 packing 으로 실효 더 큼).

## 기존 방법들이 공통으로 놓친 핵심 gap

**한 문장**: *Zero-shot universal forecaster 가 (i) 임의 frequency, (ii) 임의 변량 수, (iii) 임의 분포형태 세 차원의 이질성을 동시에 다루면서 (iv) 공개 데이터 / 공개 가중치로 (v) full-shot SOTA 와 동률 이상을 내는 사례가 부재.*

기존 6 이정표는 각각 한두 차원을 다루지만 모두 다루지 못한다. DeepAR 는 (iii) 만, Informer 류는 (ii)/(iii) 모두 부분만, LLMTime 은 (iii) 만, ForecastPFN 은 zero-shot 이나 분포 미지원, Lag-Llama 는 (iii) 부분만, TimesFM 은 (i) 만 부분 + 비공개. 이 *동시 만족* 의 부재가 universal TSFM 패러다임을 학술적으로 안착시키지 못하게 한 1차 장애.

## 이 논문은 그 gap 을 어떻게 메우는가

세 component 가 세 이질성을 일대일로 분해한다 — **multi-patch-size projection** 가 (i) frequency, **Any-Variate Attention** 가 (ii) variate 수, **Mixture Distribution Head** 가 (iii) 분포형태. 거기에 **LOTSA** 가 (iv) 공개 자원 27.6B 규모를 보장하고, **단일 사전학습 → 12 데이터셋 zero-shot 평가** 가 (v) full-shot 대비 동등성을 실증한다. *gap 의 다섯 차원 모두에 각각 명시 component 를 매핑* 한 점이 이 논문이 ICML 2024 Oral 등재로 이어진 결정적 디자인 선택이다.
