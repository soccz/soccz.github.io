# 05-d. 방법론 — PAttn (양성 베이스라인: 최소 형태의 patch + attention 모델)

## 왜 PAttn 이 필요한가

음성 결과 ("LLM 무용") 만 던지면 *그래서 우리는 무엇을 써야 하느냐* 가 미해결로 남는다. PAttn 은 이 *constructive alternative* 를 제공:

> "복잡한 LLM 백본 없이도 patch + 1-layer attention + projection 만으로 SOTA 가 나온다."

이게 본 논문이 NeurIPS 2024 Spotlight 으로 가는 마지막 한 발의 펀치. 음성+양성 결합.

## 아키텍처 — 저자 GitHub 코드 verbatim 기반

`PAttn/models/PAttn.py` (Source Lock — 저자 공식 GitHub 코드 1차 출처):

```
Input x: (B, L, C)
↓
Normalize (last-dim mean/std)
↓
nn.ReplicationPad1d (pad to multiple of patch_size)
↓
Unfold into patches: (B, C, N_patch, patch_size)
↓
Linear in_layer: patch_size → d_model
↓
MultiHeadAttention (basic_attn, 1 layer)
↓
Flatten patches: (B, C, N_patch × d_model)
↓
Linear out_layer: N_patch × d_model → pred_len
↓
Denormalize → ŷ: (B, pred_len, C)
```

## 디폴트 하이퍼파라미터 (저자 verbatim — `PAttn/main.py` argparse)

| 파라미터 | 디폴트 값 |
|---|---|
| `seq_len` (lookback $L$) | 512 |
| `pred_len` (horizon $H$) | 96 |
| `label_len` | 48 |
| `d_model` | 768 |
| `n_heads` | 16 |
| `e_layers` | 3 |
| `d_ff` | 512 |
| `dropout` | 0.2 |
| `batch_size` | 512 |
| `learning_rate` | 1e-4 |
| `train_epochs` | 10 |
| `patience` | 3 |
| `enc_in` | 862 |
| `c_out` | 862 |
| `patch_size` | 16 |
| `kernel_size` | 25 (series_decomp moving avg) |

**관찰**:
- `d_model=768` = GPT-2 base hidden size 와 일치 → "LLM 백본의 hidden 차원을 그대로 매칭" 한 fair size 비교. PAttn 이 작은 게 아니라 *LLM 의 hidden 차원과 같은 크기 의 1-layer attention*.
- `n_heads=16` = GPT-2 medium 의 head 수와 일치 (또는 GPT-2 large 의 절반). head dim = 768/16 = 48.
- `e_layers=3` = argparse 디폴트지만 PAttn 본체에서 1 layer 만 쓰는지 확인 필요. README "single layer" 와 *불일치 가능성*. 가설: argparse 가 PatchTST 비교용 디폴트와 공유되어 있고, PAttn 모듈은 내부에서 1 layer attention 만 인스턴스화. 본 환경 PAttn.py 코드는 1-layer MultiHeadAttention 만 임포트하는 것으로 확인 → 본 가설 *상당히 robust*.
- `patch_size=16` = PatchTST 디폴트와 일치. lookback 512, patch 16 → 32 개 patch.
- `enc_in=862`, `c_out=862` 은 Traffic 데이터셋의 변수 수 (862 sensors) 에 맞춤 — 다른 데이터셋은 argparse 로 덮어씀.

## 수학 — forecast 함수

PAttn 의 forward (단순화):

$$
\hat{y} = W_{\text{out}} \cdot \text{flatten}\!\Big(\, \text{Attn}\!\big( W_{\text{in}} \cdot \text{Patch}(\tilde{x}) \big) \,\Big) + \mu
$$

where $\tilde{x} = (x - \mu)/\sigma$ 는 instance normalization, $W_{\text{in}} \in \mathbb{R}^{16 \times 768}$, $W_{\text{out}} \in \mathbb{R}^{(32 \cdot 768) \times 96}$.

**4줄 해석**:
1. *기호*: $\mu, \sigma$ = 입력 시계열의 channel-wise 통계, $W_{\text{in}}/W_{\text{out}}$ = 입출력 projection, $\text{Patch}$ = 길이 512 → 32 patches × 16, $\text{Attn}$ = 1-layer multi-head self-attention with 16 heads.
2. *일상 비유*: 영상 (시계열) 을 32 개의 작은 썸네일 (patch) 로 자르고, 각 썸네일을 768 차원의 색 코드로 변환하고, 썸네일끼리 비교 (attention) 한 다음, 32 × 768 색 코드를 다 펼쳐서 미래 96 점을 그리는 캔버스 위에 직접 그림.
3. *왜 이 형태*: 시계열 forecast 의 *최소 충분* 한 inductive bias 가 무엇인지에 대한 저자들의 답 — *patch 단위로 토큰화 + 토큰 간 attention + 직선 회귀*. linear projection 의 단순성 덕분에 SOTA LLM-based forecaster 와 동등 성능 가능. 추가 layer 가 *필요* 한 게 아니라 *불필요* 함을 보이는 게 본 베이스라인의 핵심.
4. *조심할 점*: PAttn 은 *channel-independent* — 즉 각 channel 을 독립적으로 처리. cross-channel 정보 활용은 없음. PatchTST 와 동일 가정. 다변량 시계열의 cross-channel 의존성 (예: 금융의 stock correlation, 전력의 multi-region coupling) 이 강한 setting 에선 한계 가능. iTransformer (Liu 2024) 의 variate-wise tokenization 과 비교 필요.

## 다른 접근으로 했다면 (대안 2개)

1. **PAttn + cross-channel attention** (iTransformer 변형): PAttn 의 patch attention 을 *variate (channel) attention* 으로 바꿨다면? iTransformer 가 보여준 대로 channel 간 의존성을 모델링하면 *Traffic / Electricity* 같은 high-channel 데이터셋에서 추가 이득 가능. PAttn 은 simplicity 를 위해 의도적으로 안 함.
2. **PAttn + RevIN / DishTS** (instance norm 강화): 본 PAttn 은 simple mean/std normalization. RevIN (Kim 2022) 의 *학습 가능* normalization 을 쓰면 추가 이득 가능. PatchTST 와 비교 가능.
3. **PAttn + Linear (DLinear/RLinear) hybrid**: 시계열의 trend 부분은 linear, 나머지는 attention 으로 분해. DLinear 가 보여준 대로 trend-residual 분해가 추가 이득 가능. README 에 `series_decomp` 모듈 (kernel_size=25) 의 흔적이 있는 것으로 보아 *실제로* 시도되었을 가능성. 본 환경 미확정.

## 학습 — 손실 함수

`PAttn/main.py` 에서 손실 옵션:
- SMAPE (symmetric MAPE)
- `nn.MSELoss` (L2)
- `nn.L1Loss` (MAE)

이중 *디폴트가 무엇인지* 는 코드만으로 단정 불가. WebSearch 인덱스에서 MSE 의 신호가 강하므로 MSE 가 메인 가설.

## Optimizer 트릭

- Dual optimizer: `Linear` projection 파라미터에 별도 lr (`1e-4`), 나머지에 configurable lr. → projection 의 단순함이 *수렴 속도* 면에서도 핵심임을 reveal.
- EarlyStopping (`patience=3`) + `adjust_learning_rate` (type1 등 PatchTST-style schedule).

## 핵심 한 문장

> **"PAttn 은 patch + 1-layer attention + 2 linear 의 *최소 차분 베이스라인* 으로, '시계열 forecast 의 inductive bias 는 LLM 까지 갈 필요 없이 patch-attention 한 층으로 충분하다' 는 본 논문의 양성 메시지를 7줄 forward code 로 실증한다."**
