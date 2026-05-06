# 10c — 사고 확장: 실험 아이디어 2개

---

## 아이디어 1: "TS-Grok 탐색 실험" — 시계열 트랜스포머에서 Grokking이 일어나는가?

### 가설
PatchTST (또는 iTransformer)를 합성 다중 주기 시계열(sin 합성 + 로지스틱 맵)에서 훈련할 때, 훈련 MSE 수렴 이후에도 추가 훈련을 계속하면 검증 MSE가 갑작스럽게 하락하는 grokking 유사 현상이 관찰된다.

### 데이터
- **합성 A (주기 조합)**: $y_t = \sum_{k=1}^{K} A_k \sin(2\pi t / T_k + \phi_k)$, $K=3$, 주기 $T_k \in \{7, 30, 365\}$일. 훈련: $T_1, T_2$ 주기만 있는 시퀀스. 검증 OOD: $T_3$ 주기도 포함된 시퀀스.
- **합성 B (로지스틱 맵)**: $x_{t+1} = r \cdot x_t (1 - x_t)$, 훈련 $r \in [3.5, 3.8]$, 검증 OOD: $r \in [3.8, 4.0]$ (카오스 레짐 전환).
- **사용자 보유 데이터**: ETT (Informer 벤치마크), GEFCom Wind/Solar.

### 비교 조건
| 조건 | 설명 |
|------|------|
| Baseline | PatchTST, 조기 종료 (검증 loss 최소 시) |
| Long-train | 조기 종료 없이 10× 더 훈련 |
| Long-train + WD | weight decay ($\lambda = 0.01, 0.1$) 추가 |
| Parameter-shared | 레이어 가중치 공유 버전 |

### 예상 결과
- "Long-train + WD" 조건에서 일부 태스크(특히 주기 조합 합성)에서 grokking 유사 검증 MSE 급하락 관찰될 것.
- 로지스틱 맵(카오스 레짐 전환)에서는 grokking 없음 — Composition OOD 실패와 유사한 한계 예상.

### 반증 조건
- 어느 조건에서도 검증 MSE가 단조 감소할 뿐 급격한 도약이 없다면 → TS에서 grokking이 없다는 부정적 발견. 이것도 논문으로 쓸 수 있다 (negative result paper).

### 비용 추정
- GPU: A100 1장, 합성 A 기준 각 조건 1~5만 스텝 × 4조건 × 3 시드 = 약 60 GPU-hour.
- 데이터 생성: `Grokking in Time Series Transformers/` 폴더의 기존 sin/logistic 합성 스크립트 활용 가능.
- 구현: PatchTST 공식 코드 + logit lens wrapper (~200줄 추가).

---

## 아이디어 2: "φ-TS 데이터 설계 실험" — Inferred/Atomic 비율의 TS 버전 탐색

### 가설
시계열 예측 모델이 "복합 패턴(추론된 패턴, inferred pattern)"을 학습하는 속도는 훈련 데이터 내 "복합 패턴 대 원자 패턴의 비율" $\phi_{TS}$에 의존한다. 높은 $\phi_{TS}$에서 더 빠른 일반화가 일어난다.

### TS에서의 φ 정의 (이 실험의 contribution)
$$\phi_{TS} = \frac{N_\text{compound}}{N_\text{atomic}}$$

- **원자 패턴(atomic)**: 단일 주기 sin 시퀀스, 선형 추세만 있는 시퀀스, 단일 레짐 정상 시퀀스.
- **복합 패턴(compound/inferred)**: 주기 + 추세 + 잡음 조합 시퀀스, 다중 주기 합성 시퀀스, 레짐 전환이 포함된 시퀀스.

$\phi_{TS}$는 훈련 배치 내 복합 패턴 시퀀스 비율로 조작 가능.

### 데이터 설계
| $\phi_{TS}$ | 훈련 데이터 구성 | 예상 일반화 속도 |
|------------|----------------|--------------|
| 0.0 | 100% 원자 패턴 | 매우 느림 |
| 0.3 | 70% 원자 + 30% 복합 | 중간 |
| 0.5 | 50-50 균형 | 빠름 |
| 0.8 | 20% 원자 + 80% 복합 | 매우 빠름 또는 불안정 |

검증: **OOD 복합 패턴** (훈련에 없는 주기 조합) 정확도를 훈련 스텝별로 측정.

### 비교 조건
- 데이터 총량 고정, $\phi_{TS}$만 변화 (∝ Wang et al.의 $\phi$ 실험)
- $\phi_{TS}$ 고정, 데이터 총량 변화 → 총량보다 구성이 중요한지 검증

### 예상 결과
- $\phi_{TS}$가 높을수록 일반화가 빠르게 일어남.
- 데이터 총량보다 $\phi_{TS}$가 더 중요한 결정자 (= Wang et al.의 KG 결과 재확인 + TS 도메인 일반화).

### 반증 조건
- $\phi_{TS}$와 일반화 속도 사이에 관계가 없다면 → TS 도메인의 구조가 KG와 근본적으로 다름을 시사.

### 비용 추정
- GPU: A100 1장, $\phi_{TS} \in \{0, 0.3, 0.5, 0.8\}$ × 3 시드 = 12회 실험, 각 10만 스텝 = 약 30 GPU-hour.
- 데이터 생성: 합성 TS generator 구현 (~100줄 Python).
- 이 아이디어가 성공하면 Grokking track 논문의 §4 "Data Design for Grokking in TS"로 발전 가능.
