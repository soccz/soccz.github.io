# 05.e 방법론: 100B 코퍼스 & Pretraining 설정

## 왜 이 부분이 필요한가

Transformer 아키텍처가 아무리 좋아도 학습 데이터가 적으면 zero-shot 파운데이션 모델이 되지 않는다. 언어 GPT 계열의 원리는 "**대량 다양 코퍼스 + 큰 모델 + 오래 학습**" 의 3중 조합. TimesFM 은 이 조합의 시계열판을 실증한다. 그 실증의 코어가 이 §4 (원 논문 기준) — **약 100B time-points 규모의 real-world + synthetic 혼합 코퍼스**.

## 코퍼스 구성

### Real-world 하위 구성 (원 논문 §4 + Google 블로그 요약)

1. **Google Trends 검색 관심도 시계열**: 세계 각지의 여러 언어권에서 수집된 대규모 검색어 관심도 시계열. 인간의 관심 (트렌드, 이벤트, 계절, 뉴스) 이 그대로 반영된 시계열이라 다양한 human-driven periodicity 를 포함. 이것이 코퍼스의 다수를 차지.
2. **Wikipedia pageviews 시계열**: 각 문서의 시간별/일별 조회수. 위와 같은 human-attention driven 통계지만 매체·주제 분포가 다르다.
3. (원 논문 §4 에 명시된 추가 real-world 도메인이 있다면 원 PDF 확인 필요 — 본 환경 접근 불가. secondary 문헌은 주로 위 두 원천만 언급.)

### Synthetic 하위 구성

원문 §4 는 real-world 만으로 커버되지 않는 통계 조각 (예: 순수 sinusoidal, ARMA, trend + seasonality, level shift) 을 인위적으로 생성한 synthetic 시계열을 추가한다. 정확한 synthetic 생성 규칙 · 각 성분의 파라미터 분포 · real vs synthetic 비율은 원 PDF §4 확인 필요.

### 총 규모 및 학습 신호

- **약 100B time-points** (secondary 문헌 verbatim + Google 블로그 요약 verbatim).
- 시계열 개수는 문서에 따라 (§4) 확인 필요.
- 각 시계열은 patch 로 잘려 학습 mini-batch 를 구성. context length $T = 512$ (v1), $T = 2048$ (v2.0), $T=16384$ (v2.5) 로 확대.

## 학습 목표 (loss)

$$
\mathcal{L}_{\text{pretrain}} = \mathbb{E}_{x \sim \mathcal{D}} \Bigl[ \frac{1}{N \cdot h} \sum_{i=1}^{N} \sum_{j=1}^{h} \bigl( \hat{y}^{(i)}_j(x) - x_{ip + j} \bigr)^2 \Bigr]
$$

즉 각 patch 위치가 다음 $h=128$ 시간점을 예측 target 으로 삼는 patch-level teacher-forcing MSE. Quantile head 가 활성화되면 quantile loss 가 sum 에 추가.

### 4줄 해석

1. **기호 뜻**:
   - $\mathcal{D}$: 100B time-points 를 담은 empirical distribution (한 시계열이 여러 patch 로 잘려 batch 화).
   - $\hat{y}^{(i)}_j$: $i$-번째 patch 토큰 위치에서 예측한 미래 $j$-번째 시간점.
   - $N \cdot h$: 한 시계열이 주는 감독 신호 개수. $T=512, p=32, h=128$ 이면 $N \times h = 16 \times 128 = 2048$ 개의 point-level 감독 신호를 한 시계열에서 뽑음.
2. **일상 비유**: 세상 온갖 관심도 그래프 1,000억 개 시간점을 다 보여주면서, 각 지점에서 "다음 128 시간점을 그려봐" 문제를 무수히 반복시켜 그림 실력을 쌓게 하는 것.
3. **왜 이 형태**: (a) patch-level teacher forcing 이 언어 next-token 과 동형이라 학습 stable + fast. (b) MSE 는 실수값에 자연스러움. (c) 각 patch 위치가 감독 신호를 주므로 sample efficiency 가 매우 높음 — 한 시계열이 2048 감독 신호 = 언어 모델의 512 토큰 시퀀스와 유사.
4. **조심할 점**:
   - **Corpus bias**: 대부분이 human-attention 시계열 (검색, 조회수) → 자연현상 (기상), 미시금융 (LOB tick), 생물학 (심박) 통계와의 겹침이 확실치 않다. 이 논문의 pretraining 이 특정 도메인 (예: 금융) 에 zero-shot 으로 얼마나 잘 넘어가는지는 도메인마다 검증이 필요.
   - **MSE 는 outlier 학습을 방해**: heavy-tailed 시계열 (금융 log-return 등) 은 학습 시 loss 가 튀어서 gradient clipping 이 강하게 걸리면 극단값을 학습 못 한다.
   - **Synthetic 비율**: 너무 많으면 real 분포와 괴리, 너무 적으면 real 이 커버 못하는 통계를 못 배움. 원 논문의 정확한 비율은 §4 확인 필요.

## 학습 설정 (알려진 사항)

- **Framework**: JAX/Flax (PAX) 로 학습, 이후 PyTorch 체크포인트도 배포 (v1 README 확인).
- **하드웨어**: TPU/GPU 조합 (Google Research 표준 인프라). 정확한 스케일은 원 §4 확인 필요.
- **Optimizer**: 대체로 AdamW + cosine schedule 로 추정 (secondary), 원 논문 §5 hyperparameter 표 확인 필요.
- **Batch size / learning rate / warmup**: 원 §5 확인 필요. 본 환경 미확인.
- **Regularization**: dropout / weight decay 유무 등 원 §5 확인 필요.

## Frequency category 조건화

앞서 §05.b 에서 언급한 대로 frequency $f \in \{0, 1, 2\}$ 가 각 시계열에 부여된 categorical label. 학습 시 이 label 을 embed 해서 첫 토큰 (혹은 모든 토큰) 에 더한다. 학습 데이터에서는 각 시계열의 실제 sampling rate 로부터 이 label 을 자동 산출. Downstream 에서는 유저가 명시 (혹은 dataframe 인 경우 letter code 로 자동 매핑).

## 대체 설계 3개

1. **Multi-task pretraining (Chronos / MOMENT)**: masked reconstruction + forecasting + classification 등 여러 task 를 섞음. TimesFM 은 forecasting 만 → 단순 · 명확.
2. **Curriculum learning**: 짧은 시계열 → 긴 시계열 순으로 학습. TimesFM 은 안 함 (혹은 원문 명시 없음).
3. **Domain reweighting**: real 도메인 별로 가중치 재조정. MOIRAI 는 sub-dataset cap ε=0.001 로 도메인 불균형 처리. TimesFM 은 상세 §4 확인 필요.

## 이 부분의 핵심 한 문장

**"Google Trends + Wiki pageviews 를 축으로 하는 약 100B time-points real-world 코퍼스에 synthetic 을 소량 섞고, patch-level teacher forcing MSE 로 처음부터 학습한다 — 코퍼스가 라이선스 사정으로 비공개라 이 부분이 재현의 가장 큰 벽."**
