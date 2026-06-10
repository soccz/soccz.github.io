# 06 · 실험 해부

본 절은 본 환경의 Source Lock 한계 안에서만 단정한다: README "Evaluation" 단락 + WebSearch 인덱스 verbatim + GitHub repo 구조 (eval_gluonts / long_term_tsf 의 하위 디렉토리·스크립트 명) 가 신뢰 근거. **본문 표의 절대 수치(MASE/MSE/MAE/CRPS 정수)는 본 환경에서 PDF 차단으로 확인 불가**, 따라서 ranking·서술 단정에 한정.

---

## 4-Grade 벤치마크 그룹 (README 발췌 verbatim)

README "Evaluation" 단락은 4 개의 평가 그룹을 정의한다:

| Grade | 데이터셋 수 | 표준 데이터셋 명 (README + GitHub 디렉토리) | 평가 setting |
|---|---|---|---|
| **Long-term TSF (zero-shot)** | 6 | ETTh1, ETTh2, ETTm1, ETTm2, Weather, ECL or Traffic (정확한 6 개는 본문 표 미확인) | Zero-shot: target dataset 학습 없음 |
| **Monash forecasting archive** | 29 | Monash repository 자동 다운로드 (Tourism, M1/M3/M4 subset, Solar, Wind, Pedestrian, etc.) | Zero-shot |
| **Probabilistic Forecasting (PF)** | 6 LTSF + 3 proprietary | LTSF 6 + Walmart sales, Istanbul Traffic, Turkey Power (README 명시) | Probabilistic, quantile/CRPS 평가 추정 — VisionTSpp 변형으로 처리 |
| **Full-shot long-term** | 8 | Long-term TSF 6 + 2 추가 (본문 표 미확인) | 대상 데이터셋 전체로 학습 후 평가 |

이 4 grade 화는 본 논문의 **claim 1 (zero-shot 성능) + claim 4 (fine-tuning 보너스)** 를 정량 비교하기 위한 설계다. 같은 모델·같은 코드로 4 가지 setting 을 모두 측정하는 점이 강력 — fair comparison 보장.

---

## 데이터셋별 의의

### ETT (Electricity Transformer Temperature) 4 개
ETTh1/h2 (1 시간 단위), ETTm1/m2 (15 분 단위). 중국 동부 2 개 county 의 변압기 7 변수. 2 년 분량 약 17K (h)~ 70K (m) 시점. 인덱스 05-13 (TimesNet), 05-06 (iTransformer), 05-19 (PatchTST), 06-03 (MOIRAI) 의 표준 LTSF 비교 데이터셋.

**왜 이 데이터가 본 논문 주장에 적합한가**: 강한 daily/weekly 주기 → periodicity=24 (h) or 96 (m) 지정 자명. VisionTS 의 reshape 가 가장 자연스럽게 작동하는 도메인.

**숨은 편향**: ETT 자체가 LTSF 표준 비교 데이터셋이라 대부분 베이스라인이 이미 잘 작동. 즉 VisionTS 가 SOTA 갱신해도 그게 본 방법의 핵심 강점인지 아니면 ETT-overfitting community 가 collectively 만든 한계인지 구분 안 됨.

### Weather (10 분 단위 21 변수, 1 년)
독일 Bautzen 의 기상 데이터. 다중 주기 (일 + 연 + 노이즈) 존재. periodicity 선택이 모호.

**숨은 편향**: VisionTS 의 단일 periodicity 가정이 가장 취약한 도메인 중 하나. 결과 표가 어떻게 나오는지가 critical evidence — 본 환경에서 표 미확인.

### ECL / Traffic (Electricity / Highway 시간단위)
ECL: 321 변수 × 26K 시점, Traffic: 862 변수 × 17K 시점. **고변량 다채널** 도메인. VisionTS 의 RGB 채널 (3) 한계로 변수 stacking 방식이 결정적. README 가 명시한 input_resize 의 multivariate 처리가 어떻게 작동하는지는 model.py 라인 미확인.

### Monash 29
M-competitions 계열, Tourism, NN5 (cash withdrawal), Solar, Wind, Pedestrian counts, Tourism quarterly/monthly/yearly 등 다양한 도메인·주기·길이. **Foundation model 비교의 표준 벤치마크** (Chronos, MOIRAI, TimesFM 도 같은 archive 사용).

**왜 이 데이터가 본 논문 주장에 적합한가**: 29 데이터셋이 도메인 분산을 크게 가지므로 **zero-shot 일반화** 의 진짜 검증. 단일 도메인 SOTA 보다 훨씬 강한 증거.

**의심 포인트**: Monash 29 의 일부는 짧은 길이 (수십~수백 시점) → 224×224 image 로 resize 할 때 너무 큰 보간 발생. 본 논문이 어떻게 처리했는지는 본문 미확인.

### PF (Probabilistic Forecasting) 그룹
LTSF 6 + Walmart sales (소매), Istanbul Traffic (도시 교통), Turkey Power (전력 수요). VisionTSpp 의 quantile_head_num=9 가 작동하는 그룹. 평가 지표는 CRPS / quantile loss 추정.

**금융 관련성**: Walmart sales 가 retail / supply chain 시계열로 가장 finance 인접. State Street 공저인 점에서 자산운용 수익률 시계열을 예상할 수도 있지만 README 에 명시 없음.

### Full-shot 8
**대상 데이터셋 전체로 학습 후 평가** — fine-tuning 의 상한선. Claim 4 ("1 epoch fine-tune 만 해도 SOTA") 의 정량 검증 그룹. VisionTS 가 full-shot 에서 다른 모델들을 능가하면 "transfer learning 덕분만이 아니라 image inpainting reformulation 자체가 강한 inductive bias" 임을 보임.

---

## 베이스라인 공정성

본 환경에서 본문 표 미확인이라 정확한 베이스라인 set 은 단정 불가. README 의 GIFT-EVAL ranking 비교 ("surpassing Moirai, TimesFM, Chronos") 와 GitHub eval 디렉토리 명을 토대로 추정:

| 베이스라인 | 출처 | 본 논문 비교 그룹 (추정) |
|---|---|---|
| MOIRAI | ICML 2024 (인덱스 06-03 cover) | Long-term + Monash + PF |
| TimesFM | ICML 2024 | Long-term + Monash |
| Chronos | TMLR 2024 (인덱스 04-29 cover) | Long-term + Monash |
| Lag-Llama | NeurIPS Workshop 2024 | PF 그룹 |
| GPT4TS (Time-LLM 류) | ICLR 2024 | few-shot 그룹 |
| iTransformer | ICLR 2024 (인덱스 05-06 cover) | Long-term (full-shot) |
| PatchTST | ICLR 2023 (인덱스 05-19 cover) | Long-term (full-shot) |
| TimesNet | ICLR 2023 (인덱스 05-13 cover) | Long-term (full-shot) |
| Autoformer / FEDformer | NeurIPS / ICML | Long-term (full-shot) |
| Naïve / Seasonal Naïve | 통계 베이스라인 | Monash 표준 |

**공정성 의심**: zero-shot 비교에서 TS-native foundation model 들 (Chronos / MOIRAI / TimesFM) 은 LOTSA-27B / MONASH 등의 대규모 시계열 corpus 로 사전훈련된 반면, VisionTS 는 ImageNet 의 1.3M 자연 이미지로 사전훈련. **사전훈련 데이터 규모와 도메인이 완전히 다른 비교** 라는 점에서 "ranking ≠ apples-to-apples". 다만 본 논문의 핵심 메시지가 "image domain 만으로도 가능하다" 이므로 이 비교 자체는 의미 있다.

**fine-tuning 공정성**: "1 epoch fine-tune VisionTS" vs "10+ epoch 학습 baseline" 비교는 compute 보정 없이는 공정성 떨어짐. 본 환경에서 정확한 fine-tune 조건 미확인.

---

## 지표 선택

LTSF: MSE, MAE (표준 long-term TSF 지표). Monash: MASE (Mean Absolute Scaled Error, scale-free 비교 가능). PF: CRPS (Continuous Ranked Probability Score) 추정.

**다른 지표였다면**: 
- DTW (Dynamic Time Warping) 기반 지표였다면 image inpainting 의 spatial smoothness 효과로 VisionTS 가 더 유리할 가능성.
- Quantile loss (pinball) 의 multiple 분위수 측정으론 VisionTSpp 의 quantile_head_num=9 가 직접 평가됨.
- Sharpe ratio / 수익률 기반 finance 지표는 본 논문에 없음. P1 ProTran-TFA 가 보완할 영역.

---

## Ablation (추정)

코드 + 후속 VisionTS++ motivation 으로부터 본 논문이 했을 ablation 후보 (본문 표 미확인):
1. **MAE 변형 크기** (Base/Large/Huge) 별 성능 비교.
2. **norm_const** (0.4 vs 1.0 vs 학습 가능) 비교.
3. **periodicity** 일부러 잘못 지정 (예: 24 시간 데이터에 25 또는 12) → robustness 테스트.
4. **mask alignment 방향** (horizontal vs vertical).
5. **RGB channel encoding** vs **grayscale** (단변량의 경우).
6. **fine-tuning strategy** (linear probe vs decoder-only vs end-to-end).

이 중 어느 ablation 이 main text 에 들어가고 어느 것이 appendix 인지는 본문 미확인. 다만 **(3) periodicity robustness** 가 가장 critical 한 ablation 일 것이라는 게 본 해체의 추정.

---

## 부록에 숨은 신호 (추정)

PDF 미확인이라 단정 못 하지만, MAE 의 단순 inpainting 이 LTSF/Monash 에서 그 정도로 잘 작동하면 통상 다음 보고가 부록에 있을 가능성:
- attention map 시각화 — encoder/decoder 의 attention 이 어디를 보는지 (APF cross-modal 분석 hook).
- 실패 case 분석 — 특히 short-length / extremely non-periodic 도메인.
- compute budget — 1 epoch fine-tune 의 정확한 GPU-hour vs MOIRAI/TimesFM 전체 사전훈련 비용.
- failure mode — periodicity 잘못 지정 시 격자 깨짐의 시각적 example.

본 환경에서 이들은 직접 확인 불가. 후속 검토에서 PDF 본문 접근 시 위 항목들을 우선 확인할 것.

---

## 수치 투명성

본 환경의 조건 하에서:
- **확인됨**: GIFT-EVAL 2024-11 zero-shot point forecasting (MASE) #1 ranking (README).
- **확인됨**: 베이스라인 비교 대상 명단 일부 (MOIRAI, TimesFM, Chronos — README 명시).
- **확인 안 됨**: 정확한 MASE / MSE / MAE / CRPS 절대 수치, 데이터셋별 ranking, ablation 절대값, compute budget, 학습/추론 latency, fine-tuning learning curve.

이들은 본문 PDF 확인 후 보강 필요. 본 해체에서는 추측치로 채우지 않는다.

## 이 절의 한 줄 요약

> "4 grade × ~50 데이터셋의 검증 폭은 시계열 foundation model 의 SOTA 검증으로는 강하지만, 본문 표 수치를 본 환경에서 못 봤기 때문에 본 해체에서는 ranking·서술 단정에 한정하고, 절대 수치 확인은 PDF 접근 후 보강하기로 한다."
