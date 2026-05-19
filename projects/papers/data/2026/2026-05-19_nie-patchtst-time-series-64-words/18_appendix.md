# 18 Appendix Deep Dive — A.1 ~ A.7

paper p.13 ~ p.24 의 appendix 전체 정리.

---

## A.1 Experimental Details

### A.1.1 Datasets

paper p.13:
> We use 8 popular multivariate datasets provided in (Wu et al., 2021) for forecasting and representation learning. Weather dataset collects 21 meteorological indicators in Germany, such as humidity and air temperature. Traffic dataset records the road occupancy rates from different sensors on San Francisco freeways. Electricity is a dataset that describes 321 customers' hourly electricity consumption. ILI dataset collects the number of patients and influenza-like illness ratio in a weekly frequency. ETT (Electricity Transformer Temperature) datasets are collected from two different electric transformers labeled with 1 and 2, and each of them contains 2 different resolutions (15 minutes and 1 hour) denoted with m and h.

**Datasets URLs**:
- Weather: https://www.bgc-jena.mpg.de/wetter/
- Traffic: https://pems.dot.ca.gov/ (PEMS)
- Electricity: https://archive.ics.uci.edu/ml/datasets/ElectricityLoadDiagrams20112014 (UCI)
- ILI: https://gis.cdc.gov/grasp/fluview/fluportaldashboard.html (US CDC)
- ETT: https://github.com/zhouhaoyi/ETDataset (Informer paper)

### Why Exchange-rate is excluded

paper p.13:
> There is an additional Exchange-rate dataset mentioned in the original paper, which is the daily exchange-rate of eight different countries. However, financial datasets generally have different properties compared to time series datasets in other fields, for example the predictability. It is well known that if a market is efficient, the best prediction for $x_t$ will be just $x_{t-1}$ (Fama, 1970). Rossi (2013) argues that the toughest benchmark for exchange-rate forecasting is a random walk without drift. Also, Zeng et al. (2022) shows that by simply repeating the last value in the look-back window, the MSE loss on exchange-rate dataset can outperform or be comparable to the best results. Therefore, we are prudent in containing it into our benchmark.

→ **Efficient market hypothesis** 와 random walk 가 잘 fit — 따라서 환율 예측은 의미 없음. **Fama 1970** 의 직접 인용.

### A.1.2 Baseline Settings

paper p.13:
> The default look-back windows for different baseline models could be different. For Transformer-based models, the default look-back window is $L = 96$; and for DLinear, the default look-back window is $L = 336$. The reason of this difference is that Transformer-based baselines are easy to overfit when look-back window is long while DLinear tend to underfit. However, this can possibly lead to an under-estimation of the baselines. To address this issue, we re-run FEDformer, Autoformer and Informer by ourselves for six different look-back window $L \in \{24, 48, 96, 192, 336, 720\}$. And for each forecasting task (aka each different prediction length on each dataset), we choose the best one from those six results.

→ **공정성 강조**: PatchTST 가 L=336 으로 비교 받기 unfair 하지 않도록, Transformer baseline 들도 6 개 L 다 시도 후 best.

ILI 는 더 작은 dataset 라 특별 설정:
- Transformer-based default: L=36
- DLinear default: L=104
- 6 windows tried: $L \in \{24, 36, 48, 60, 104, 144\}$

### A.1.3 Why no LSTM, TCN, DeepAR baseline

paper p.13:
> Time series has been an ancient field of study, with many traditional models developed, for example the famous ARIMA model (Box & Jenkins, 1970). With the bloom of deep learning community, many new models were proposed for sequence modeling and time series forecasting before Transformer appears, such as LSTM (Hochreiter & Schmidhuber, 1997), TCN (Bai et al., 2018) and DeepAR (Salinas et al., 2020). However, they are demonstrated to be not as effective as Transformer-based models in long-term forecasting tasks (Zhou et al., 2021; Wu et al., 2021), thus we don't include them in our baselines.

→ Informer (2021) / Autoformer (2021) 가 이미 LSTM/TCN/DeepAR 를 outperform 함을 보였으므로 baseline 에서 제외. ARIMA 도 generation 단계가 다름.

### A.1.4 Model Parameters (가장 중요한 detail!)

paper p.14:
> By default, PatchTST contains 3 encoder layers with head number $H = 16$ and dimension of latent space $D = 128$. The feed forward network in Transformer encoder block consists of 2 linear layers with GELU (Hendrycks & Gimpel, 2016) activation function: one projecting the hidden representation $D = 128$ to a new dimension $F = 256$, and another layer that project it back to $D = 128$. For very small datasets (ILI, ETTh1, ETTh2), a reduced size of parameters is used ($H = 4$, $D = 16$ and $F = 128$) to mitigate the possible overfitting. Dropout with probability 0.2 is applied in the encoders for all experiments.

**기본 설정** (Weather / Traffic / Electricity / ETTm1 / ETTm2):

| 항목 | 값 |
|------|---|
| Encoder layers | 3 |
| Attention heads $H$ | 16 |
| Latent dim $D$ | 128 |
| FFN dim $F$ | 256 |
| Activation | GELU |
| Dropout | 0.2 |

**축소 설정** (ILI / ETTh1 / ETTh2 — 작은 dataset):

| 항목 | 값 |
|------|---|
| Encoder layers | 3 |
| Attention heads $H$ | **4** |
| Latent dim $D$ | **16** |
| FFN dim $F$ | **128** |
| Dropout | 0.2 |

→ ILI, ETTh1, ETTh2 는 timestep 적으니 (966, 17420, 17420) parameter 줄여서 overfit 방지. **Architecture size = data size 비례**.

### A.1.5 Implementation Details — reshape trick

paper p.14:
> Although PatchTST processes channels in parallel which has to make multiple copies of the Transformer's weights, the computation can be implemented efficiently and does not require any special operator. The batch of samples of $x \in \mathbb{R}^{M \times L}$ with size $B \times M \times L$ is passed through the patching operator to generate a 4D tensor of size $B \times M \times P \times N$ which represents a batch of $x_p^{(i)} \in \mathbb{R}^{P \times N}$ in $M$ series. By reshaping the tensor to form a 3D one of size $(B \cdot M) \times P \times N$, this batch can be consumed by any standard Transformer implementation.

→ **핵심 trick**: `tensor.reshape((B*M, P, N))` 한 줄로 channel-indep 구현. 별도 operator 필요 없음. ch16 의 `x.reshape(B * M, 1, L)` 와 일치.

paper p.14:
> We further argue that our proposed PatchTST contains additional benefits: The components in Transformer backbone module shown in Figure 1 can differ across different input series, for instance the embedding layers and head layers. ... Besides, the number of variables in the multivariate time series during the training may not need to match the number of series for testing. This is especially beneficial for self-supervised pre-training where the pre-training data can have different number of variables from the fine-tuning data.

→ **추가 이점 2**: 
1. Embedding layer 를 channel group 별로 다르게 설계 가능 (필요시)
2. Pre-train data 와 fine-tune data 의 channel 수가 달라도 OK (foundation model 의 핵심)

---

## A.2 Visualization — Figure 3 (= ch10 에서 다룸)

paper p.14:
> We visualize the long-term forecasting results of supervised PatchTST/42 and other baselines in Figure 3. Here, we predict 192 steps ahead on Weather and Eletricity datasets and 60 steps ahead on ILI dataset. PatchTST provides the best forecasting both in terms of scale and bias.

→ ch10 의 [Fig 3 forecast viz](figures/Fig3_forecast_viz.png) 그대로.

---

## A.3 Univariate Forecasting — Table 8

paper p.15:
> Table 8 summaries the results of univariate forecasting on ETT datasets. There is a target feature "oil temperature" within those datasets, which is the univariate series that we are trying to forecast.

**Univariate task**: ETT 의 "oil temperature" 컬럼 하나만 예측.

### Table 8 (ETT 4 dataset × 4 horizon × 8 models, MSE 만 발췌):

| ETTh1 T | PatchTST/64 | PatchTST/42 | DLinear | FEDformer | Autoformer | Informer | LogTrans |
|---------|-------------|-------------|---------|-----------|------------|----------|----------|
| 96 | **0.059** | 0.055 | 0.056 | 0.079 | 0.071 | 0.193 | 0.283 |
| 192 | 0.074 | 0.071 | **0.071** | 0.104 | 0.114 | 0.217 | 0.234 |
| 336 | 0.076 | 0.081 | 0.098 | 0.119 | 0.107 | 0.202 | 0.386 |
| 720 | 0.087 | 0.087 | 0.189 | 0.142 | 0.126 | 0.183 | 0.475 |

| ETTh2 T | PatchTST/64 | PatchTST/42 | DLinear | FEDformer |
|---------|-------------|-------------|---------|-----------|
| 96 | 0.131 | 0.129 | 0.131 | 0.128 |
| 192 | 0.171 | 0.168 | 0.176 | 0.185 |
| 336 | 0.171 | 0.185 | 0.209 | 0.231 |
| 720 | 0.223 | 0.224 | 0.276 | 0.278 |

→ Univariate 에서도 PatchTST 가 일반적 우세. 단 일부 cell 에서 DLinear / FEDformer 가 marginal 우세.

---

## A.4 More Ablation

### A.4.1 Varying Patch Length — Figure 4 (= ch12)

paper p.15:
> One observation from Figure 4 is that MSE scores don't vary significantly with different choices of $P$, which indicate the robustness of our model against the patch length hyperparameter. Overall, PatchTST benefits from increased patch length, not only in forecasting performance but also in the computational reduction. The ideal patch length may depend on the dataset, but $P$ between $\{8, 16\}$ seems to be general good numbers.

→ ch12 에서 다룸. P=8~16 권장.

### A.4.2 Varying Look-back Window — Table 9 (= ch10 Figure 2 와 보완)

paper p.16:
> Here we provide a full benchmark of quantitative results in Table 9 for varying look-back window in supervised PatchTST/42 regarding Figure 2 in the main text. Generally speaking, our model gains performance improvement with increasing look-back window, which show the effectiveness of our model in learning information from longer receptive field.

Table 9: PatchTST/42 의 $L \in \{24, 48, 96, 192, 336, 720\}$ 별 결과 — Figure 2 의 정량적 표.

### A.4.3 More Ablation — Table 10

Table 10: 모든 8 dataset 에 대한 ablation (P+CI / CI / P / Original) 전체 — Table 7 의 확장판.

→ ch12 의 Table 7 정신 유지, 8 dataset 모두 trend 동일: **P+CI > CI > P ≈ Original**.

---

## A.5 More Self-supervised Results

### A.5.1 Table 12 — Full benchmark multivariate forecasting

paper p.16:
> In this section we provide a full benchmark of multivariate forecasting results with self-supervised PatchTST in Table 12, which is an extended version of Table 4.

→ Table 4 (ch11) 의 8 dataset × 4 horizon × Fine-tune / Lin Prob / Sup 모두 전체.

### A.5.2 Table 13 — Full benchmark transfer learning

paper p.19:
> In this section we provide Table 13 which contains the results of pre-training on Electricity dataset then transferred to other 6 datasets. Except Traffic data, the number of time series employed in the pre-training is much larger than the number of series during fine-tuning. It is a full version with respect to Table 5 in the main text and more cogently proves the capability to do transfer learning using our PatchTST model.

→ Table 5 (ch11) 의 전체 dataset 버전. **Channel-indep + weight sharing** 덕분에 pre-train data 의 channel 수와 fine-tune data 의 channel 수가 달라도 OK.

---

## A.6 Robustness Analysis

### A.6.1 Random Seeds — Table 14

paper p.18:
> The results reported in the main text and appendix above are run with the fixed random seed 2021. To examine the robustness of our results, we train the supervised PatchTST model with 5 different random seeds: 2019, 2020, 2021, 2022, 2023 and calculate the MSE and MAE scores with each selected seed. The mean and standard derivation of the results are reported in Table 14. It is clear that the variances are considerably small which indicates the robustness against choice of random seeds of our model.

**Seeds**: 2019, 2020, 2021, 2022, 2023 (5 seeds)

paper p.18:
> We also validate the self-supervised PatchTST model on different runs. We pre-train the model once and fine-tune the model 5 times with different random batch selections. The mean and standard derivation across different runs are also provided in Table 14. We also observe that the variance is insignificant especially on large datasets while higher variance can be seen on smaller datasets.

→ **결론**: Variance 매우 작음 (대형 dataset 특히). Result reproducible.

### A.6.2 Model Parameters — Figure 5

![Fig 5 Model size sensitivity](figures/Fig5_model_size.png)

paper p.19:
> To see whether PatchTST is sensitive to the choice of Transformer settings, we perform another experiments with varying model parameters. We vary the number of Transformer layers $L = \{3, 4, 5\}$ ... 6 different sets of model hyper-parameters to examine. Figure 5

paper Figure 5 caption:
> MSE scores with varying model parameters. Each bar indicates the MSE score of a parameter combination. The combinations $(L, D) = (3, 128), (3, 256), (4, 128), (4, 256), (5, 128), (5, 256)$ are orderly labeled from 1 to 6 in the figure. The model is run with supervised PatchTST/42 to forecast 96 steps. For Traffic and Electricity datasets, we reduce the maximum number of epochs to 50 to save computational time.

**6 가지 hyperparameter 조합**:
1. (3 layers, D=128)
2. (3 layers, D=256)
3. (4 layers, D=128)
4. (4 layers, D=256)
5. (5 layers, D=128)
6. (5 layers, D=256)

→ **결과**: 모든 조합에서 MSE 매우 비슷. **Architecture choice 에 robust**.

---

## A.7 Channel-independence Analysis

paper p.20:
> Intuitively, channel-mixing models should outperform the channel-independent ones since they have more flexibility to explore the cross-channel information, while with channel-independence the correlation is indirectly learnt via weight sharing. However, this is contrast to what we have observed.

→ **반직관적 발견**: channel-mixing 이 이론상 더 expressive 인데 실제로는 PatchTST 의 channel-indep 가 더 좋음.

### A.7.1 Why Channel-independence is Better — 3 reasons + Figure 6, 7

paper p.21:
> We find 3 key factors that makes channel-independent models more preferable:

**Reason 1 — Adaptability (Figure 6)**:

![Fig 6 Attention maps](figures/Fig6_attention_maps.png)

paper p.21:
> Since each time series is passed through the Transformer separately, it generates its own attention maps. That means different series can learn different attention patterns for their prediction, as shown in Figure 6. In contrast, with the channel mixing approach, all the series share the same attention patterns, which may be harmful if the underlying multivariate time series carries series of different behaviors.

paper p.21:
> Figure 6 reveals an interesting observation that the prediction of unrelated time series relies on different attention patterns while similar series can produce similar maps (e.g. series 11, 25, and 81 contain similar patterns while they are different from others). We suspect this adaptability is one of the main reasons why PatchTST performs much better forecasting than Informer and other channel-mixing models.

→ Figure 6: Electricity 의 series 11, 25, 81 비교 — 같은 dataset 안에서도 series 마다 다른 attention 패턴 학습. Channel-indep 의 장점 = **per-series adaptability**.

**Reason 2 — Less data hungry (Figure 7 left)**:

![Fig 7 Channel-indep vs mixing](figures/Fig7_channel_curves.png)

paper p.21:
> Channel-mixing models may need more training data to match the performance of the channel-independent ones. The flexibility of learning cross-channel correlations could be a double-edged sword, because it may need much more data to learn the information from different channels and different time steps jointly and appropriately, while channel-independent models only focus on learning information along the time axis. We examine this assumption by experiments where we train the models with varying training data size and and the result is shown on left panel of Figure 7. It is clear that channel-independent models converges faster against the size of training data. As what we have observed in the figure and Table 2, the size of those widely used time series datasets may not be large enough for channel-mixing models to obtain similar performances in supervised learning.

→ Figure 7 (left): training data size 변화. **Channel-indep 가 적은 data 로도 잘 수렴**, channel-mixing 은 더 많은 data 필요.

**Reason 3 — Less overfitting (Figure 7 right)**:

paper p.21:
> Channel-independent models are less likely to overfit data during training. We record the MSE loss on test data and plot on the right panel of Figure 7. Channel-mixing models show overfitting after a few initial epochs, while channel-independent models continue optimizing the loss with more training epochs. The best trained models are determined by validation data, which are approximately the lowest points in the test loss curves. It is clear that the forecasting performance of channel-independent models are better.

→ Figure 7 (right): training epoch 따른 test loss. **Channel-mixing 은 빠른 overfit, channel-indep 은 계속 감소**.

paper Figure 7 caption:
> Channel-independence vs channel-mixing on Weather dataset. The base model is PatchTST/42, and the prediction length is 96. We plot the mean values and error bars with 5 different random seeds: $\{2019, 2020, 2021, 2022, 2023\}$. Left Panel: Test loss vs train size. Channel-independence contributes to a quicker convergence as more training data is available. Right Panel: Test loss vs epochs. Channel-mixing model quickly overfits the data.

**3 reasons 요약**:
| Reason | 효과 | Figure |
|--------|------|--------|
| Adaptability | 각 series 가 별도 attention pattern | Fig 6 |
| Data efficiency | 적은 data 로도 잘 작동 | Fig 7 left |
| Less overfitting | epoch 늘려도 test loss 감소 | Fig 7 right |

### Additional benefits (paper Section A.7.1 의 끝)

paper p.21:
> Furthermore, we would like to comment on a few additional technical advantages of channel-independence: (1) Possibility of learning spatial correlations across series: Although we haven't focused on this research in our paper, the channel-independence design can be naturally extended to learn cross-channel relationships by using methods like graph neural networks (Cao et al., 2020; Chen et al., 2021). (2) Multi-task learning where different loss types can be imposed on different time series where the same underlying Transformer model is shared. (3) More robust to noise: If noise is dominant in one or several series, this noise will be projected to other series in the embedding space if we mix channels. Channel independence can mitigate this problem by only retaining the noise in these noisy channels. We can further alleviate the noise by introducing smaller weights to the objective losses that associate with noisy channels.

**Additional 3 benefits**:
1. **Spatial correlation** with GNN extension (future work)
2. **Multi-task learning** — different loss per series, shared backbone
3. **Noise robustness** — noisy channel 이 다른 channel 을 오염시키지 않음

### A.7.2 Channel-indep on other models — Table 15

paper p.21:
> To show that channel-independence is a general technique that can be applied to the other models, we apply it to Informer (Zhou et al., 2021), Autoformer (Wu et al., 2021), and FEDformer (Zhou et al., 2022). The results are shown in Table 15. The channel-independent technique can improve the forecasting performance of those models generally. Although they are still not able to outperform PatchTST which is based on vanilla attention mechanism, we believe that more performance boost and computational reduction can be obtained with more advanced attention designs incorporating the channel-independence architecture.

**Table 15 결과 예시** (Weather T=96, MSE / MAE):

| Model | Original | With CI |
|-------|----------|---------|
| Informer | 0.300 / 0.384 | **0.174** / **0.232** |
| Autoformer | 0.266 / 0.336 | **0.227** / **0.289** |
| FEDformer | 0.217 / 0.296 | **0.214** / **0.278** |
| PatchTST/42 | (n/a) | **0.152** / **0.199** |

→ **Channel-indep 추가만으로 다른 Transformer 들도 개선**. PatchTST 가 여전히 best 이지만 Channel-indep 는 universal technique.

---

## 종합 — Appendix 의 5 가지 핵심 추가 발견

1. **Hyperparameter detail** (A.1.4): 큰 dataset H=16/D=128/F=256, 작은 dataset H=4/D=16/F=128
2. **Reshape trick** (A.1.5): `tensor.reshape((B*M, P, N))` 으로 channel-indep 구현
3. **Robustness** (A.6): 5 random seeds + 6 model size 모두 variance 작음
4. **Channel-indep 3 reasons** (A.7.1): Adaptability + Data efficiency + Less overfitting (Figures 6, 7)
5. **Channel-indep universality** (A.7.2): Informer / Autoformer / FEDformer 도 CI 추가로 개선

→ Main paper 의 21% MSE reduction 주장이 robustness (seeds, model size, datasets) 와 generalizability (다른 Transformer 들에도 적용) 두 측면에서 강화됨.

---

## Tables 8-15 + Figures 5-7 inventory

| 항목 | 위치 | 내용 |
|------|------|------|
| Table 8 | p.15 | Univariate forecasting (ETT × 4 horizons) |
| Table 9 | p.17 | Varying look-back full benchmark |
| Table 10 | p.18 | Full ablation (P+CI / CI / P / Original × 8 dataset) |
| Table 11 | p.20 | Instance Norm with/without |
| Table 12 | p.21 | Self-supervised full (Table 4 extension) |
| Table 13 | p.21 | Transfer learning full (Table 5 extension) |
| Table 14 | p.22 | Random seeds variance (5 seeds) |
| Table 15 | p.22 | Channel-indep on Informer/Autoformer/FEDformer |
| Figure 5 | p.20 | Model size sensitivity (6 hyperparameter combos) |
| Figure 6 | p.23 | Attention maps (Electricity series 11, 25, 81) |
| Figure 7 | p.24 | Channel-indep vs mixing (train size / epoch) |

→ 모든 appendix table / figure 가 본 chapter 또는 ch09-12 에 cross-reference.

다음 — 본 deep dive 끝. 전체 paper 17p main + p.10-24 appendix 까지 covered.
