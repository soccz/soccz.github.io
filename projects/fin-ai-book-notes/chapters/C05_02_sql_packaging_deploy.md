# 5.3 ~ 5.4 SQL 배치 처리 + 모델 패키징/배포 — *SQL Pipeline + Model Deploy*

> **해설 분량**: 약 25쪽
> **읽는 데 걸리는 시간**: 약 45분

---

## 🪧 이 절을 한 줄로

> **§5.3**: SQL + Airflow로 데이터 마트 자동 생성.
> **§5.4**: ML 모델을 **pickle/joblib/ONNX**로 패키징 → **Flask/FastAPI/Docker** 로 배포.

### 📍 큰 그림

<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">모델 배포 — 패키징 + 서빙</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- Packaging -->
    <text x="180" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">▼ ① 패키징 (Save)</text>
    <rect x="40" y="70" width="120" height="50" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="100" y="92" text-anchor="middle" font-weight="700">pickle</text>
    <text x="100" y="108" text-anchor="middle" font-size="9" fill="#57534e">간단</text>
    <rect x="170" y="70" width="120" height="50" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="230" y="92" text-anchor="middle" font-weight="700">joblib</text>
    <text x="230" y="108" text-anchor="middle" font-size="9" fill="#57534e">sklearn 최적</text>
    <rect x="300" y="70" width="120" height="50" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="360" y="92" text-anchor="middle" font-weight="700">ONNX</text>
    <text x="360" y="108" text-anchor="middle" font-size="9" fill="#57534e">크로스 프레임워크</text>
    <!-- Serving -->
    <text x="540" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">▼ ② 서빙 (Serve)</text>
    <rect x="440" y="70" width="120" height="50" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="500" y="92" text-anchor="middle" font-weight="700">Flask/FastAPI</text>
    <text x="500" y="108" text-anchor="middle" font-size="9" fill="#57534e">REST API</text>
    <rect x="570" y="70" width="120" height="50" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="630" y="92" text-anchor="middle" font-weight="700">TF Serving</text>
    <text x="630" y="108" text-anchor="middle" font-size="9" fill="#57534e">전용</text>
    <!-- Infrastructure -->
    <text x="380" y="180" text-anchor="middle" font-size="13" font-weight="700" fill="#5a7a96">▼ ③ 인프라 (Infra)</text>
    <rect x="100" y="195" width="140" height="60" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="170" y="217" text-anchor="middle" font-weight="700">Docker</text>
    <text x="170" y="237" text-anchor="middle" font-size="9" fill="#57534e">컨테이너화</text>
    <rect x="260" y="195" width="140" height="60" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="330" y="217" text-anchor="middle" font-weight="700">Kubernetes</text>
    <text x="330" y="237" text-anchor="middle" font-size="9" fill="#57534e">오케스트레이션</text>
    <rect x="420" y="195" width="140" height="60" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="490" y="217" text-anchor="middle" font-weight="700">AWS/GCP/Azure</text>
    <text x="490" y="237" text-anchor="middle" font-size="9" fill="#57534e">클라우드</text>
    <rect x="580" y="195" width="140" height="60" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="650" y="217" text-anchor="middle" font-weight="700">SageMaker</text>
    <text x="650" y="237" text-anchor="middle" font-size="9" fill="#57534e">관리형 ML</text>
  </g>
</svg>

---

## 🟢 [초급] — SQL + Airflow 배치 예시

### 1. 책의 예시 — 고객 월별 데이터 마트

#### 1.1 4가지 SQL 뷰

```sql
-- ① 월별 거래 집계
CREATE OR REPLACE VIEW monthly_transaction AS
SELECT
    customer_id,
    DATE_FORMAT(transaction_date, '%Y-%m') AS month,
    COUNT(*) AS transaction_count,
    SUM(amount) AS total_transaction_amount
FROM transaction_table
GROUP BY customer_id, month;

-- ② 월별 신규 상품 가입
CREATE OR REPLACE VIEW monthly_new_product AS
SELECT
    customer_id,
    DATE_FORMAT(subscription_date, '%Y-%m') AS month,
    COUNT(*) AS new_product_count
FROM subscription_table
GROUP BY customer_id, month;

-- ③ 월별 로그인 및 자산 조회
CREATE OR REPLACE VIEW monthly_login AS
SELECT
    customer_id,
    DATE_FORMAT(login_date, '%Y-%m') AS month,
    SUM(asset_view_count) AS total_asset_view_count
FROM login_table
GROUP BY customer_id, month;

-- ④ 최종 데이터 마트 (JOIN)
CREATE OR REPLACE VIEW customer_monthly_data_mart AS
SELECT
    t.customer_id,
    t.month,
    t.transaction_count,
    t.total_transaction_amount,
    p.new_product_count,
    l.total_asset_view_count
FROM monthly_transaction t
JOIN monthly_new_product p ON t.customer_id = p.customer_id AND t.month = p.month
JOIN monthly_login l ON t.customer_id = l.customer_id AND t.month = l.month;
```

### 2. Airflow로 자동화

```python
from airflow import DAG
from airflow.providers.postgres.operators.postgres import PostgresOperator
from datetime import datetime

# DAG 정의 (매일 새벽 1시 실행)
dag = DAG(
    'customer_data_mart',
    schedule_interval='0 1 * * *',
    start_date=datetime(2024, 1, 1),
    catchup=False,
)

# 4가지 Task
t1 = PostgresOperator(
    task_id='monthly_transaction',
    sql='sql/monthly_transaction.sql',
    postgres_conn_id='postgres_default',
    dag=dag
)
t2 = PostgresOperator(
    task_id='monthly_new_product',
    sql='sql/monthly_new_product.sql',
    postgres_conn_id='postgres_default',
    dag=dag
)
t3 = PostgresOperator(
    task_id='monthly_login',
    sql='sql/monthly_login.sql',
    postgres_conn_id='postgres_default',
    dag=dag
)
t4 = PostgresOperator(
    task_id='customer_monthly_data_mart',
    sql='sql/customer_monthly_data_mart.sql',
    postgres_conn_id='postgres_default',
    dag=dag
)

# 실행 순서
[t1, t2, t3] >> t4  # 1,2,3 병렬 → 4 순차
```

### 3. Airflow UI 구성 요소 (책 본문)

| 요소 | 의미 |
|------|------|
| **노드** | 개별 작업 (사각형) |
| **화살표** | 종속성 (실행 순서) |
| **색상** | 상태 (초록=성공, 빨강=실패, 회색=대기, 파랑=실행 중) |
| **Hook** | 외부 시스템 연동 (DB, API) |
| **Operator** | 작업 유형 (Python, Bash, SQL) |
| **Task** | Operator 인스턴스 |
| **DAG** | 작업들의 그래프 |

> ✅ **여기까지 따라왔으면**: SQL + Airflow로 데이터 마트 자동화 가능.

---

## 🟡 [중급] — 모델 패키징

### 1. pickle — 가장 간단

```python
import pickle
from sklearn.ensemble import RandomForestClassifier

# 학습
model = RandomForestClassifier()
model.fit(X_train, y_train)

# 저장
with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)

# 로드
with open('model.pkl', 'rb') as f:
    loaded_model = pickle.load(f)

# 예측
predictions = loaded_model.predict(X_test)
```

**장점**: 간단
**단점**: Python 버전 호환성, 보안 위험

### 2. joblib — sklearn 최적화

```python
import joblib

# 저장 (압축)
joblib.dump(model, 'model.joblib', compress=3)

# 로드
loaded = joblib.load('model.joblib')
```

**장점**: 큰 수치 데이터 빠름
**단점**: sklearn 위주

### 3. ONNX — 크로스 프레임워크

```python
# PyTorch → ONNX
import torch
import torch.onnx

model = MyPyTorchModel()
dummy_input = torch.randn(1, 3, 224, 224)
torch.onnx.export(model, dummy_input, 'model.onnx',
                  input_names=['input'], output_names=['output'])

# TensorFlow → ONNX
import tf2onnx
spec = (tf.TensorSpec((None, 224, 224, 3), tf.float32, name='input'),)
output_path = 'model.onnx'
model_proto, _ = tf2onnx.convert.from_keras(tf_model, input_signature=spec,
                                              opset=13, output_path=output_path)

# ONNX → 다른 환경
import onnxruntime as ort

sess = ort.InferenceSession('model.onnx')
inputs = {'input': np.random.randn(1, 3, 224, 224).astype(np.float32)}
outputs = sess.run(None, inputs)
```

**장점**: PyTorch ↔ TensorFlow ↔ 모든 환경
**단점**: 일부 모델 변환 어려움

### 4. 패키징 비교

| 방법 | 호환성 | 속도 | 보안 | 추천 |
|------|--------|------|------|------|
| **pickle** | 낮음 | 중간 | 위험 | 프로토타입 |
| **joblib** | 중간 | 빠름 | 보통 | sklearn 운영 |
| **ONNX** | 매우 높음 | 빠름 | 안전 | 프로덕션 |
| **TFLite** | 모바일 | 빠름 | 안전 | 모바일/엣지 |
| **CoreML** | Apple | 빠름 | 안전 | iOS |

---

## 🔴 [고급] — 모델 배포

### 1. Flask로 간단한 API

```python
from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)
model = joblib.load('model.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    features = np.array(data['features']).reshape(1, -1)
    
    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0].tolist()
    
    return jsonify({
        'prediction': int(prediction),
        'probability': probability
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

### 2. FastAPI — 더 빠르고 현대적

```python
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()
model = joblib.load('model.joblib')

class PredictionRequest(BaseModel):
    features: list[float]

class PredictionResponse(BaseModel):
    prediction: int
    probability: list[float]

@app.post('/predict', response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    features = np.array(request.features).reshape(1, -1)
    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0].tolist()
    
    return PredictionResponse(
        prediction=int(prediction),
        probability=probability
    )

# 실행: uvicorn main:app --host 0.0.0.0 --port 8000
# 자동 문서: http://localhost:8000/docs
```

### 3. Docker로 컨테이너화

```dockerfile
# Dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY model.joblib .
COPY main.py .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
# 빌드 + 실행
docker build -t credit-model:v1 .
docker run -p 8000:8000 credit-model:v1
```

### 4. Kubernetes 배포

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: credit-model
spec:
  replicas: 3
  selector:
    matchLabels:
      app: credit-model
  template:
    metadata:
      labels:
        app: credit-model
    spec:
      containers:
      - name: credit-model
        image: credit-model:v1
        ports:
        - containerPort: 8000
        resources:
          limits:
            memory: "2Gi"
            cpu: "1"
---
apiVersion: v1
kind: Service
metadata:
  name: credit-model-service
spec:
  selector:
    app: credit-model
  ports:
  - port: 80
    targetPort: 8000
  type: LoadBalancer
```

```bash
# 배포
kubectl apply -f deployment.yaml
```

### 5. 클라우드 ML 플랫폼

#### AWS SageMaker

```python
import sagemaker
from sagemaker.sklearn.estimator import SKLearn

# 학습
estimator = SKLearn(
    entry_point='train.py',
    role='SageMakerRole',
    instance_type='ml.m5.large',
    framework_version='1.0-1'
)
estimator.fit({'training': 's3://bucket/data/'})

# 배포
predictor = estimator.deploy(
    initial_instance_count=1,
    instance_type='ml.t2.medium'
)

# 예측
result = predictor.predict([1, 2, 3, 4, 5])
```

#### GCP Vertex AI / Azure ML — 유사한 패턴

### 6. 배포 패턴 비교

| 옵션 | 설정 난이도 | 비용 | 확장성 | 추천 |
|------|----------|------|--------|------|
| **Flask + EC2** | 쉬움 | 낮음 | 수동 | 소규모 |
| **FastAPI + Docker** | 중간 | 중간 | 수동 | 일반 |
| **Kubernetes** | 어려움 | 큼 | 자동 | 대규모 |
| **SageMaker** | 쉬움 | 큼 | 자동 | AWS 사용자 |
| **Serverless (Lambda)** | 쉬움 | 변동 | 자동 | 적은 트래픽 |

---

## 🟣 [전공자] — 한국 금융권 배포 현실

### 1. 한국 금융권 제약

#### 1.1 망분리
- 인터넷망 ↔ 업무망 분리
- ML 모델 학습 (인터넷망) ↔ 운영 (업무망)
- → 모델 파일 수동 이전 (USB 또는 게이트웨이)

#### 1.2 클라우드 규제 (2019 완화 이전)
- 비중요 시스템만 클라우드 가능
- AWS, GCP는 일부 (한국 데이터센터 한정)

### 2. 한국 시중은행 배포 사례 (일반적인 패턴 예시)

#### KB국민은행 (예시 패턴)
- **온프레미스**: 신용평가·코어뱅킹 시스템
- **AWS**: 일부 추천/챗봇/AI 워크로드 (공개 정보 한정)
- **모델 서버**: TF Serving·Triton 등 (사내 구체 스택 비공개)

#### 카카오뱅크 (AWS 기반)
- **Kubernetes (EKS) 중심** (자사 tech 블로그 기준)
- 펀드 배치 시스템: Airflow + Managed DB (2024 공개)
- 모델 서빙·API 구체 조합은 공개되지 않음

#### 토스 (AWS 기반)
- Kubernetes 사용 보도 (구체적인 Helm/Argo CD 조합 출처는 비공개)

> ⚠ 정정: 초기 작성본의 "카뱅: ECS+Fargate / PyTorch+ONNX / FastAPI" 와 "토스: EKS+Helm+Argo CD" 구체 조합은 공개 1차 출처가 확인되지 않는다. 카뱅은 자사 tech 블로그에서 EKS/K8s 중심임을 공개했다.

### 3. ML 모델 서버 비교

#### TensorFlow Serving

```bash
# Docker
docker pull tensorflow/serving

# 실행
docker run -p 8501:8501 \
  --mount type=bind,source=$(pwd)/model,target=/models/credit \
  -e MODEL_NAME=credit \
  -t tensorflow/serving

# 호출
curl -d '{"instances": [[1.0, 2.0, 3.0]]}' \
  -X POST http://localhost:8501/v1/models/credit:predict
```

#### NVIDIA Triton

- 다중 모델 지원
- GPU 추론 최적화
- ONNX 지원

#### Seldon Core

- Kubernetes 네이티브
- A/B 테스트 기본 지원
- Canary 배포

### 4. 배포 패턴 — Champion-Challenger

```python
# 트래픽 분할
def predict(request):
    if hash(request.user_id) % 100 < 10:  # 10%
        # Challenger (새 모델)
        return challenger_model.predict(request)
    else:
        # Champion (운영 모델)
        return champion_model.predict(request)
```

### 5. Canary Deployment

```yaml
# Istio Virtual Service
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
spec:
  http:
  - match:
    - headers:
        x-canary:
          exact: "true"
    route:
    - destination:
        host: credit-model-v2
  - route:
    - destination:
        host: credit-model-v1
      weight: 90
    - destination:
        host: credit-model-v2
      weight: 10
```

### 6. 책의 한계 5가지

#### 한계 ①: FastAPI 미언급
2024년 표준이 됨. 책은 Flask만.

#### 한계 ②: Kubernetes/Docker 미언급
모던 ML 배포의 핵심.

#### 한계 ③: ONNX의 실제 사용 사례 부족
크로스 프레임워크의 핵심.

#### 한계 ④: 모델 버전 관리 (MLflow) 미언급
프로덕션 필수.

#### 한계 ⑤: 한국 금융권 배포 제약 미언급
망분리, 규제 등 한국 특수성.

---

### 🟣 [전공자 심화] — 모델 패키징·배포의 학술적 토대

#### 원논문/실무 가이드의 한계

본 절의 pickle → joblib → ONNX, Flask/FastAPI → Docker → Kubernetes 흐름은 **공학적 best practice** 위주로 구성됐다. 그러나 학술적·구조적 한계가 존재한다.

1. **"코드 = 배포"의 단순화**: 모델 코드는 ML 시스템의 **5~10%에 불과** (Sculley 등 2015 의 핵심 주장). 나머지 90%+는 데이터 파이프라인·feature store·모니터링·서빙 인프라.
2. **재현성 가정**: Docker 이미지가 환경 재현을 보장한다는 가정 — 그러나 **데이터·라이브러리 버전·하드웨어(GPU 드라이버)** 가 변하면 재현성은 부분적.
3. **모델 버전 = 코드 버전 이라는 단순화**: 실제 ML 시스템은 **(모델 코드, 학습 데이터, 하이퍼파라미터, 피처 정의, 라벨 정의)** 5종 동시 버전 관리 필요.
4. **모놀리식 배포 가정**: 1 모델 1 API 가정이지만, 실제 추천·신용평가 시스템은 **수십~수백 개 모델 앙상블**.
5. **데이터 품질 → 모델 품질 인과 미반영**: 배포 단계의 monitoring 만으로는 데이터 단계 품질 문제(data cascade) 를 사후적으로 발견.

#### 비판 문헌 (1차 자료 검증)

- **Sculley, Holt, Golovin, Davydov, Phillips, Ebner, Chaudhary, Young, Crespo, Dennison (2015), "Hidden Technical Debt in Machine Learning Systems," *Advances in Neural Information Processing Systems 28 (NIPS 2015)*, pp. 2503–2511.** — ML 시스템은 일반 코드의 모든 기술부채 + ML 특유의 추가 부채(boundary erosion, entanglement, hidden feedback loops, undeclared consumers, data dependencies, configuration debt, glue code, pipeline jungles) 가 존재. **모델 코드는 전체 시스템의 작은 검은 박스**라는 도식이 유명. ([papers.neurips.cc](https://papers.neurips.cc/paper/5656-hidden-technical-debt-in-machine-learning-systems.pdf))
- **Sambasivan, Kapania, Highfill, Akrong, Paritosh, Aroyo (2021), "'Everyone wants to do the model work, not the data work': Data Cascades in High-Stakes AI," *Proceedings of CHI 2021*. DOI: 10.1145/3411764.3445518.** — 인도·아프리카·미국 AI 종사자 53명 인터뷰. **92%가 data cascade 경험** — 데이터 단계의 작은 결함이 누적돼 다운스트림에서 큰 모델 실패. "데이터 작업은 저평가·de-glamorised" 라는 구조적 비판. ([dl.acm.org](https://dl.acm.org/doi/10.1145/3411764.3445518))

#### 후속 연구·실무 동향 (2020~)

- **MLSys 컨퍼런스 (2018~ 현재)** — Stanford·CMU·MIT 주도. ML 모델·시스템 공동 설계 (model-system co-design), 분산 학습, 효율적 추론, 책임 있는 AI 시스템이 핵심 주제. 2026년에는 **Industry Track 신설** — 운영 중 시스템의 lessons learned 공유. ([mlsys.org](https://mlsys.org/))
- **Chip Huyen (2022), *Designing Machine Learning Systems*, O'Reilly** — Sculley 2015 의 후속 정리. **4 특성(신뢰성·확장성·유지보수성·적응성) + iterative process** 제시.
- **MLflow Model Registry (Databricks)·Weights & Biases·Neptune.ai** — 모델·데이터·하이퍼파라미터·메트릭의 통합 버전 관리. Sculley 2015 의 "glue code" 문제 해결 도구.
- **Feature Store 표준화**: Feast (오픈소스), Tecton, Databricks Feature Store — 학습·서빙 시 피처 정의 일관성 보장 (training-serving skew 방지).
- **MLOps Maturity Models** — Microsoft, Google, AWS 각각의 0~4단계 성숙도 모델. 한국 금융권 평균은 **레벨 1~2** 수준 (자동 배포는 있으나 자동 재학습·모니터링 부분 도입).

#### 한국 적용 시 주의점

- **망분리 = 모델 배포 자동화의 구조적 장벽**: 인터넷망(학습) ↔ 업무망(서빙) 분리로 CI/CD 자동 파이프라인이 끊긴다. 모델 파일을 **수동 게이트웨이/매체 반출** 로 이전해야 함. → MLflow Model Registry 도 인터넷망·업무망 각각 별도 인스턴스 운영.
- **클라우드 규제 완화 (2019, 2021, 2023 단계)**: 비중요 시스템 → 일부 중요 시스템으로 확대 중. 그러나 **신용평가·이상거래탐지(FDS)** 등 핵심 시스템은 여전히 온프레미스 + 국내 리전 한정.
- **금융보안원 클라우드 가이드라인 (FSEC)**: AWS/GCP/Azure 사용 시 **국내 리전 + KISA 인증 + 침해사고 보고 의무**.
- **개인정보보호법 (PIPA) + 신용정보법**: 학습 데이터의 비식별화 + 가명정보 활용 동의 요건 — 미국 GDPR·CCPA 보다 엄격한 부분 다수.
- **금융위 AI 가이드라인 (2021.7)** — 모델 카드·데이터 시트·설명가능성 보고서가 사실상 필수. Model Cards (Mitchell et al. 2019) 표준 채택 권고.
- **한국형 모델 서빙 스택**: 카카오뱅크·토스 등 카뱅 신생 은행은 AWS EKS·K8s 중심 (자사 tech 블로그 기준). 시중은행(KB·신한·하나) 은 IBM Watson·온프레미스 GPU 클러스터 혼합. 구체 스택은 비공개가 일반적.

---

## 📚 책에 없지만 알면 좋은 것

### 🔍 보충 1 — MLflow Model Registry

```python
import mlflow
import mlflow.sklearn

# 모델 등록
mlflow.set_tracking_uri('http://mlflow-server:5000')

with mlflow.start_run():
    model.fit(X_train, y_train)
    mlflow.sklearn.log_model(model, 'credit_model')
    
    # 메트릭 기록
    mlflow.log_metric('auc', 0.85)
    mlflow.log_param('n_estimators', 200)

# 버전 관리
client = mlflow.tracking.MlflowClient()
client.transition_model_version_stage(
    name='credit_model',
    version=3,
    stage='Production'  # Staging, Production, Archived
)
```

### 🔍 보충 2 — Feature Store (Feast)

```python
from feast import FeatureStore

store = FeatureStore(repo_path='.')

# 실시간 피처 조회 (운영)
features = store.get_online_features(
    features=['user_features:age', 'user_features:income'],
    entity_rows=[{'user_id': 'A'}]
).to_dict()

# 모델 추론
prediction = model.predict(pd.DataFrame(features))
```

### 🔍 보충 3 — Model Monitoring

```python
# Prometheus + Grafana
from prometheus_client import Counter, Histogram

predictions_counter = Counter('predictions_total', 'Total predictions')
prediction_latency = Histogram('prediction_latency', 'Latency')

@app.post('/predict')
@prediction_latency.time()
def predict(request):
    predictions_counter.inc()
    return model.predict(request)
```

### 🔍 보충 4 — CI/CD for ML

```yaml
# .github/workflows/ml_cicd.yml
name: ML CI/CD
on: [push]
jobs:
  train:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Train Model
      run: python train.py
    - name: Test Model
      run: pytest tests/test_model.py
    - name: Build Docker
      run: docker build -t model:latest .
    - name: Push to Registry
      run: docker push registry.com/model:latest
```

### 🔍 보충 5 — Serverless ML

```python
# AWS Lambda
import json
import joblib

model = joblib.load('/tmp/model.joblib')

def lambda_handler(event, context):
    features = json.loads(event['body'])['features']
    prediction = model.predict([features])[0]
    
    return {
        'statusCode': 200,
        'body': json.dumps({'prediction': int(prediction)})
    }
```

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. pickle vs. joblib?

**A.** **joblib 추천** (sklearn 사용 시).
- pickle: 일반 Python 객체
- joblib: 수치 데이터 + 압축 최적화

### Q2. ONNX가 필수?

**A.** **크로스 프레임워크 시** 필수.
- PyTorch → TF Serving 으로 배포
- 모바일 배포 (Core ML, TF Lite)

### Q3. Flask vs. FastAPI?

**A.** **FastAPI** 추천.
- 더 빠름 (async)
- 자동 문서화
- Pydantic 타입 검증
- 최신 표준

### Q4. Docker 꼭 필요한가?

**A.** **운영엔 사실상 필수**.
- 환경 일관성
- 쉬운 배포
- 확장성
- 학습은 안 해도 OK, 운영은 필요

### Q5. Kubernetes 너무 어려움

**A.** **점진적 도입**.
- 1단계: Docker만 사용
- 2단계: Docker Compose
- 3단계: Kubernetes (큰 조직만)

### Q6. SageMaker가 좋은가?

**A.** **AWS 사용자**에게 편함.
- 학습/배포/모니터링 통합
- 비싸지만 편함
- 락인 위험 (다른 클라우드 이전 어려움)

### Q7. 한국 시중은행 어떻게?

**A.** **혼합 전략**.
- 학습: 클라우드 (AWS 등)
- 운영: 온프레미스 (망분리)
- → 모델 파일 수동 이전

---

## 🎯 핵심 7가지

1. **SQL + Airflow** = 데이터 마트 자동화 표준.
2. **모델 패키징 3종**: pickle (간단) → joblib (sklearn) → ONNX (크로스).
3. **FastAPI** 가 Flask 대체 (속도, 문서화, 타입 검증).
4. **Docker + Kubernetes** = 모던 배포 표준.
5. **MLflow Model Registry** 로 버전 관리.
6. **한국 금융권**: 망분리 → 학습/운영 분리.
7. **카뱅·토스**: AWS 기반 (카뱅 EKS 하이브리드 / 토스증권 AWS 적극 이전), **시중은행**: 하이브리드 (코어뱅킹 온프레미스 + 비핵심 클라우드).

---

## 📖 더 읽을거리

### 도구
- FastAPI: https://fastapi.tiangolo.com/
- Docker: https://www.docker.com/
- Kubernetes: https://kubernetes.io/
- MLflow: https://mlflow.org/
- TensorFlow Serving: https://www.tensorflow.org/tfx/serving
- Seldon Core: https://www.seldon.io/

### 책
- *Designing Machine Learning Systems* (Chip Huyen, O'Reilly, 2022).
- *Practical MLOps* (Noah Gift, O'Reilly, 2021).

### 한국
- 카카오뱅크 Tech Blog (AWS 사례).
- 토스 Tech Blog (MLOps).

---

> **다음 절 예고** — §5.5+5.6 테스트 + 모니터링
