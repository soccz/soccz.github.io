# 7. 이론적 계보

## 7.1 상위 조상 (2~4편, 없으면 안 되는 뿌리)

### (i) Chen et al., *Neural Ordinary Differential Equations*, NeurIPS 2018

- ContiFormer의 Key·Value 경로 자체가 Neural ODE. "discrete layer를 continuous depth/time으로 올린다"는 세계관의 원류.
- ContiFormer가 상속받는 것: ODE solver + adjoint backward, vector field 학습 프레임.
- 상속받지 않는 것: "depth as time"의 순수 해석. ContiFormer에서는 time이 real observation time이라 depth와 분리.

### (ii) Vaswani et al., *Attention Is All You Need*, NeurIPS 2017

- Self-attention의 근본 구조. ContiFormer는 이 구조를 함수 공간으로 올린 변주.
- 상속: Q/K/V 분리, scaled dot-product, multi-head, residual + LN.
- 변형: Key·Value가 이산 행렬이 아니라 연속 경로.

### (iii) Rubanova, Chen, Duvenaud, *Latent ODEs for Irregularly-Sampled Time Series*, NeurIPS 2019

- "irregular sampling을 ODE로 해결"의 직접 선조. RNN encoder + ODE decoder 구조.
- ContiFormer가 이걸 어떻게 넘어서는가: encoder를 attention으로 교체하여 병렬성과 long-range context 확보.

### (iv) Kidger, Morrill, Foster, Lyons, *Neural Controlled Differential Equations for Irregular Time Series*, NeurIPS 2020

- 입력 경로 $X(t)$를 driving path로 사용하는 CDE 정식화. 수학적으로는 ContiFormer보다 더 우아.
- ContiFormer와의 본질적 차이: CDE는 "one path, one dynamics", ContiFormer는 "multi-head × multi-segment dynamics + attention". 즉 "attention의 다시점" 추가.

## 7.2 평행 연구 (같은 시기 비슷한 방향 2~4편)

### (i) Shukla & Marlin, *Multi-Time Attention Networks for Irregularly Sampled Time Series (mTAND)*, ICLR 2021

- Attention을 연속 시간 reference point에 대해 정의. ContiFormer와 **가장 가까운 전신**이자 경쟁자.
- 차이: mTAND은 representation이 여전히 **이산 reference points**에서 정의됨. ContiFormer는 **연속 함수 자체**.

### (ii) Chen et al., *Transformer Hawkes Process (THP)*, ICML 2020

- TPP용 Transformer. ContiFormer의 TPP 부문 직접 경쟁.
- 차이: THP의 시간 encoding은 이산. ContiFormer는 intensity를 ODE로 접근.

### (iii) Shukla et al., *HeTVAE*, 2022 · **De Brouwer et al., GRU-ODE-Bayes**, NeurIPS 2019

- 변분 추론 + ODE의 결합. ContiFormer가 포괄하지 않는 "불확실성 정량" 축.
- 미래 통합 가능성: ContiFormer + variational bottleneck.

### (iv) Zhang et al., *ODE Transformer for Machine Translation*, ACL 2022

- Transformer 레이어 사이에 ODE를 끼워 넣음. ContiFormer와 다른 방향: "depth-ODE vs time-ODE".
- 구별 감각을 잡는 데 좋은 대조군.

## 7.3 후손 예측 (이 논문에서 파생될 수 있는 방향)

### 후손 1 — *Continuous-Time SDE Transformer* (Neural SDE + Attention)

- Key·Value 경로를 ODE에서 SDE로 확장. $d\mathbf{k} = f\,dt + g\,dW$.
- 장점: 확률적 dynamics 자연 수용. 금융 latent의 noise 구조에 더 적합.
- 단점: backward의 분산 관리 어려움. pathwise gradient vs score-based gradient 선택.
- **내 체감 확률**: 1~2년 내 반드시 등장 (이미 부분적으로 preprint에 보이는 방향).

### 후손 2 — *Subordinated ContiFormer* (= 나의 Paper 4)

- 시간 축 $t$를 $\tau(t)$ (economic/volume/trade clock)로 대체. Key·Value ODE를 $d\mathbf{k}/d\tau$로.
- 장점: Clark (1973) subordination이 가진 "정보 시계 normalization"의 재현.
- 리스크: $\tau$를 어떻게 추정할지 (exogenous vs learnable) 설계 결정 필요. Paper 4의 핵심 기여 지점.

### 후손 3 — *Multi-scale ODE-Attention with Explicit Time Kernel*

- head별로 time-scale $\sigma_h$를 학습하고, attention 분모에 명시적 time kernel을 넣어 장기/단기 분리.
- 장점: Informer·FEDformer의 시간 스케일 분해 지혜를 ContiFormer 세계에 흡수.

## 7.4 계보 지도 (ASCII)

```
              Vaswani'17          Chen'18 (Neural ODE)
                  │                     │
                  │                     │
                  ▼                     ▼
        Transformer variants      Rubanova'19 (Latent ODE)
         (Informer, TST, PatchTST)  Kidger'20 (Neural CDE)
                  │                     │
                  └─────────┬───────────┘
                            │
                      Shukla'21 (mTAND)
                            │
                            ▼
                  ★ ContiFormer (2023) ★
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
   Continuous SDE       Subordinated    Multi-scale
     Transformer        ContiFormer       Time-Kernel
      (후손 1)           (Paper 4)        (후손 3)
```

## 7.5 이 계보 안에서 ContiFormer의 위치 평가

- **표현력 축**: Transformer → mTAND → ContiFormer 방향으로 시간 축 표현력이 단조 증가.
- **계산 비용 축**: 같은 방향으로 단조 증가. Neural CDE는 계산 비용/표현력 frontier 위의 또 다른 점.
- **금융 적합도 축**: 오히려 하락. 가장 좌측 Transformer가 jump-heavy 데이터에 가장 경직되게 대응하지만, Neural ODE 기반 모델들은 "연속성 전제"가 추가로 깨진다.

즉 **ContiFormer는 "smooth latent + irregular sampling" Pareto frontier의 우상단**. 금융으로 가려면 이 계보에서 옆으로 (SDE) 이동하거나 아래로 (subordinated time) 이동해야 한다. Paper 4는 후자 쪽의 한 점을 선점하는 것이 목표.
