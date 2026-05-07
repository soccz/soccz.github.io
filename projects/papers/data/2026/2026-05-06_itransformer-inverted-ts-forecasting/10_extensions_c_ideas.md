# 10-C. 사고 확장 — 실험 아이디어 2개

---

## 아이디어 1: iTransformer vs 표준 Transformer — N×N 어텐션 모티프 분류 비교 실험

### 가설

iTransformer의 N×N 어텐션 맵은 APF의 T×T 모티프 분류 체계(대각선/블록/스트라이프/스파이크/체커)와 구조적으로 다른 패턴 체계를 형성한다. 특히 N×N 맵은 "변수 클러스터 블록 패턴"이 지배적이며, 이 패턴은 데이터의 도메인 구조(지리적 그룹, 계절 동기화 등)를 반영한다.

### 데이터

- APF의 기존 synthetic motif benchmark (trend/seasonal/regime/anomaly/freq drift 포함)
- ECL (321 변수, 실제 전력 데이터, 지역 그룹 구조 알려짐)
- Weather (21 변수, 소규모, 기상 변수 간 물리적 상관 명확)

### 비교 조건

| 조건 | 모델 | 어텐션 맵 크기 |
|------|------|--------------|
| A | 표준 Transformer | T×T |
| B | iTransformer | N×N |
| C | Crossformer | T×T + N×N (각각) |

### 실험 절차

1. APF 기존 코드의 `motif_classifier.py`를 수정해 N×N 어텐션 맵도 입력받을 수 있게 확장
2. 각 모델을 동일 데이터로 훈련 후, 각 레이어·헤드의 어텐션 맵을 추출
3. T×T 맵: 기존 APF 분류기로 {대각선/블록/스트라이프/스파이크/체커/엣지} 분류
4. N×N 맵: 동일 분류기 + 추가 카테고리("클러스터 블록") 적용
5. 데이터셋별, 레이어별 모티프 분포 비교

### 예상 결과

- ECL: N×N 맵에서 블록 클러스터 패턴 지배적 (전력망 지역 그룹 반영)
- Weather: N×N 맵에서 전체 밀집 패턴 (기상 변수 간 전반적 상관)
- T×T 맵: 대각선/스트라이프 패턴 지배적 (시간 인접성 반영)

### 반증 조건

N×N 맵에서도 T×T와 동일한 모티프 분포가 나타나면 "축 선택과 무관하게 동일한 기하학적 구조"라는 주장이 성립 → APF 분류 체계의 축 독립성을 지지.

### 비용 추정

- 코드 수정: 1~2일 (기존 APF 코드 기반)
- 훈련 실험: GPU 3~5일 (ECL, Weather 기준 iTransformer 훈련 10 epoch × 3 seeds)
- 분석 및 시각화: 2~3일
- **총 1.5~2주, 논문 Figure 1개 생산 가능**

---

## 아이디어 2: "변수 상관 강도 $\bar{\rho}$가 낮은 금융 TS에서의 iTransformer 성능 한계 분석"

### 가설

iTransformer의 N×N 어텐션은 변수 간 상관이 강할수록($\bar{\rho}$ 높을수록) 유리하고, 상관이 약할수록($\bar{\rho}$ 낮을수록) DLinear 또는 채널 독립 모델(PatchTST)에 미치지 못한다. 금융 TS(주가 수익률, $\bar{\rho} \approx 0.1$)는 후자에 해당한다.

### 데이터

- **강한 상관 ($\bar{\rho}$ 높음)**: ECL(전력, 동일 지역 부하 간 높은 상관), Weather(기상 변수)
- **중간 상관**: ETT(변압기 데이터)
- **약한 상관 ($\bar{\rho}$ 낮음)**: Ken French 25 포트폴리오 수익률, GSPC/IXIC 섹터 ETF 10~30개
- **생성 데이터**: $\bar{\rho}$를 0.0~0.9로 조절한 합성 다변량 TS (VAR 모델로 생성)

### 비교 조건

- iTransformer vs PatchTST(채널 독립) vs DLinear 를 각 $\bar{\rho}$ 구간에서 비교

### 실험 절차

1. 데이터셋별 $\bar{\rho}$ 계산 (훈련 셋 기준 Pearson 상관계수 절대값 평균)
2. 각 모델을 동일 조건(lookback 96, horizon 24)으로 훈련
3. MSE, MAE 기록
4. $\bar{\rho}$ vs (iTransformer MSE - DLinear MSE) 산점도 작성

### 예상 결과

선형 관계: $\bar{\rho}$가 높을수록 iTransformer 이득 커짐. $\bar{\rho} < 0.2$ 구간에서 iTransformer = DLinear 수준 또는 열등.

### 반증 조건

$\bar{\rho}$와 무관하게 iTransformer가 항상 우월하다면 — N×N 어텐션의 이점이 "변수 상관 포착"이 아닌 다른 메커니즘(예: 더 큰 효과적 표현 차원)에서 비롯되는 것이다.

### 비용 추정

- 합성 데이터 생성: 0.5일
- 실험 실행: GPU 2~3일 (소규모 데이터셋, 빠른 실험)
- 분석 및 시각화: 1~2일
- **총 1주 내, P1 ProTran-TFA 재개 시 "iTransformer 기반 금융 채널 어텐션"의 유효성을 미리 검증하는 파일럿 실험으로 활용 가능**
