# 5.1 ~ 5.2 데이터 파이프라인 구축 + 예시 — *Data Pipeline*

> **원서 위치**: 김태헌, 《금융 AI의 이해》(제이펍, 2024), §5.1 (pp.280–282), §5.2 (pp.282–284)
> **원서 분량**: 약 5쪽
> **해설 분량**: 약 22쪽
> **읽는 데 걸리는 시간**: 약 40분

---

## 🪧 이 절을 한 줄로

> **데이터 파이프라인** = 원천 데이터 → 분석 가능한 형태로 자동 변환.
> **배치 (Batch)** vs. **스트리밍 (Streaming)** 두 방식, **Airflow + Kafka + Spark** 가 표준 도구.

책은 §5.1에서 파이프라인 개념 + 2가지 유형, §5.2에서 Pawp 사례를 다룬다. 이 해설집은:
1. **파이프라인 5요소 시각화**
2. **Airflow + Kafka + Spark 표준 스택**
3. **한국 금융권 사례** (카뱅, 토스)
4. **ETL vs. ELT 비교**

### 📍 미리 그릴 큰 그림

<svg viewBox="0 0 760 380" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">데이터 파이프라인 — Batch vs. Streaming</text>
  <defs>
    <marker id="ar7" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#1c1917"/></marker>
  </defs>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- Batch -->
    <text x="180" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#5a7a96">📦 Batch (주기적)</text>
    <rect x="20" y="70" width="100" height="50" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="70" y="92" text-anchor="middle" font-weight="700">DB</text>
    <text x="70" y="108" text-anchor="middle" font-size="9" fill="#57534e">원천</text>
    <line x1="120" y1="95" x2="150" y2="95" stroke="#1c1917" stroke-width="2" marker-end="url(#ar7)"/>
    <rect x="160" y="70" width="100" height="50" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="210" y="92" text-anchor="middle" font-weight="700">Airflow</text>
    <text x="210" y="108" text-anchor="middle" font-size="9" fill="#57534e">스케줄</text>
    <line x1="260" y1="95" x2="290" y2="95" stroke="#1c1917" stroke-width="2" marker-end="url(#ar7)"/>
    <rect x="300" y="70" width="100" height="50" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="350" y="92" text-anchor="middle" font-weight="700">Spark/SQL</text>
    <text x="350" y="108" text-anchor="middle" font-size="9" fill="#57534e">변환</text>
    <line x1="400" y1="95" x2="430" y2="95" stroke="#1c1917" stroke-width="2" marker-end="url(#ar7)"/>
    <rect x="440" y="70" width="100" height="50" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="490" y="92" text-anchor="middle" font-weight="700">DW</text>
    <text x="490" y="108" text-anchor="middle" font-size="9" fill="#57534e">저장</text>
    <line x1="540" y1="95" x2="570" y2="95" stroke="#1c1917" stroke-width="2" marker-end="url(#ar7)"/>
    <rect x="580" y="70" width="140" height="50" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="650" y="92" text-anchor="middle" font-weight="700">ML 모델</text>
    <text x="650" y="108" text-anchor="middle" font-size="9" fill="#57534e">매일 학습/예측</text>
    <text x="380" y="145" text-anchor="middle" font-size="10" font-style="italic" fill="#5a7a96">예: 매일 밤 신용평가, 매주 리포트</text>
    <!-- Streaming -->
    <text x="180" y="200" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">⚡ Streaming (실시간)</text>
    <rect x="20" y="215" width="100" height="50" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="70" y="237" text-anchor="middle" font-weight="700">거래</text>
    <text x="70" y="253" text-anchor="middle" font-size="9" fill="#57534e">실시간</text>
    <line x1="120" y1="240" x2="150" y2="240" stroke="#1c1917" stroke-width="2" marker-end="url(#ar7)"/>
    <rect x="160" y="215" width="100" height="50" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="210" y="237" text-anchor="middle" font-weight="700">Kafka</text>
    <text x="210" y="253" text-anchor="middle" font-size="9" fill="#57534e">메시지큐</text>
    <line x1="260" y1="240" x2="290" y2="240" stroke="#1c1917" stroke-width="2" marker-end="url(#ar7)"/>
    <rect x="300" y="215" width="100" height="50" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="350" y="237" text-anchor="middle" font-weight="700">Flink/Spark</text>
    <text x="350" y="253" text-anchor="middle" font-size="9" fill="#57534e">스트림처리</text>
    <line x1="400" y1="240" x2="430" y2="240" stroke="#1c1917" stroke-width="2" marker-end="url(#ar7)"/>
    <rect x="440" y="215" width="100" height="50" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="490" y="237" text-anchor="middle" font-weight="700">Redis</text>
    <text x="490" y="253" text-anchor="middle" font-size="9" fill="#57534e">캐시</text>
    <line x1="540" y1="240" x2="570" y2="240" stroke="#1c1917" stroke-width="2" marker-end="url(#ar7)"/>
    <rect x="580" y="215" width="140" height="50" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="650" y="237" text-anchor="middle" font-weight="700">ML 모델</text>
    <text x="650" y="253" text-anchor="middle" font-size="9" fill="#57534e">즉시 추론 (50ms)</text>
    <text x="380" y="290" text-anchor="middle" font-size="10" font-style="italic" fill="#3a7d44">예: 카드 결제 사기 탐지, 보이스피싱 차단</text>
    <!-- Bottom -->
    <text x="380" y="340" text-anchor="middle" font-size="12" font-weight="700" fill="#1c1917">분석용 파이프라인 + 운영용 파이프라인 (목적별 분리)</text>
  </g>
</svg>

---

## 🟢 [초급] — 파이프라인이 왜 필요한가

### 1. 비유 — 공장 생산 라인

```
[원료] → [가공] → [조립] → [포장] → [배송] → [고객]
   ↓        ↓        ↓        ↓        ↓        ↓
[원천 DB] [정제] [피처] [학습] [배포] [예측]
```

→ **데이터 파이프라인 = 데이터 공장**.

### 2. 책의 2가지 목적

#### 목적 ①: 분석용 파이프라인
- 데이터 과학자/분석가용
- 데이터 → 데이터 웨어하우스 → 분석
- 빈도: 일/주 단위

#### 목적 ②: 운영 모델용 파이프라인
- ML 모델 학습/예측 자동화
- 라이프사이클 자동화
- 빈도: 실시간 또는 배치

### 3. 두 가지 처리 방식

| | Batch (배치) | Streaming (스트리밍) |
|---|---|---|
| **타이밍** | 정해진 시간 (일/주) | 실시간 |
| **데이터** | 대량 일괄 | 거래 한 건씩 |
| **활용** | 보고서, 신용평가 | 사기 탐지, 결제 |
| **도구** | Airflow, Spark | Kafka, Flink |
| **응답** | 분~시간 | 밀리초 |

### 4. 비유로 이해

#### Batch = 우체국 우편 배달
- 하루 한 번 모아서 배달
- 효율적
- 그러나 느림

#### Streaming = 카카오톡 메시지
- 즉시 전달
- 빠름
- 인프라 부담 큼

### 5. 한국 금융권 사례

#### 시중은행 (전통)
- **분석용**: 매일 밤 배치 처리 (Hadoop, Hive)
- **운영용**: 카드 승인 (실시간), 신용평가 (일배치)

#### 카카오뱅크 (인터넷 전문은행)
- 처음부터 클라우드 + 스트리밍
- Apache Kafka 100%
- 실시간 사기 탐지

> ✅ **여기까지 따라왔으면**: 파이프라인의 큰 그림이 보일 거다.

---

## 🟡 [중급] — 파이프라인 5요소

### 1. 5요소 (책 본문)

| # | 단계 | 역할 | 도구 |
|---|------|------|------|
| ① | **데이터 수집** | 원천 → 시스템 | Kafka, Kinesis |
| ② | **정제/전처리** | 결측치, 이상치 | Spark, Pandas |
| ③ | **모델 학습** | 정제 → ML 모델 | sklearn, XGBoost |
| ④ | **예측** | 새 데이터 → 결과 | API 서버 |
| ⑤ | **데이터 마트** | 분석용 저장 | DW, BI |

### 2. 데이터 수집 도구

#### Kafka (실시간 스트리밍)
```python
from kafka import KafkaProducer, KafkaConsumer

# Producer (데이터 발행)
producer = KafkaProducer(bootstrap_servers=['localhost:9092'])
producer.send('transactions', b'{"amount": 100, "user": "A"}')

# Consumer (데이터 수신)
consumer = KafkaConsumer('transactions', bootstrap_servers=['localhost:9092'])
for message in consumer:
    print(message.value)
```

#### Redis (인메모리 캐시)
```python
import redis

r = redis.Redis(host='localhost', port=6379)

# 즉시 저장/조회
r.set('user:A:risk_score', '0.85')
score = r.get('user:A:risk_score')
```

### 3. 정제/전처리 — Spark

```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, when

spark = SparkSession.builder.appName('FinanceData').getOrCreate()

# 데이터 로드
df = spark.read.parquet('s3://data/transactions/')

# 결측치 처리
df_clean = df.fillna({'amount': 0, 'category': 'unknown'})

# 변환
df_transformed = df_clean.withColumn(
    'is_large',
    when(col('amount') > 1000000, 1).otherwise(0)
)

# 저장
df_transformed.write.parquet('s3://data/clean/')
```

### 4. Apache Airflow — 오케스트레이션

#### 4.1 책 본문 강조
> "에어플로는 에어비앤비에서 개발했으며, 그 사용성과 유연성으로 인해 개발자와 데이터 엔지니어 사이에서 큰 인기를 얻고 있다."

#### 4.2 핵심 개념
- **DAG** (Directed Acyclic Graph): 작업 흐름
- **Task**: 개별 작업
- **Operator**: 작업 타입 (Python, Bash, SQL)
- **Scheduler**: 자동 실행
- **Web UI**: 모니터링

#### 4.3 DAG 예시

```python
from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from datetime import datetime, timedelta

def extract_data():
    print("데이터 추출")

def transform_data():
    print("데이터 변환")

def load_data():
    print("데이터 적재")

def train_model():
    print("모델 학습")

# DAG 정의
dag = DAG(
    'credit_pipeline',
    default_args={
        'owner': 'team',
        'depends_on_past': False,
        'start_date': datetime(2024, 1, 1),
        'retries': 1,
        'retry_delay': timedelta(minutes=5),
    },
    schedule_interval='0 2 * * *',  # 매일 새벽 2시
    catchup=False,
)

# Task 정의
t1 = PythonOperator(task_id='extract', python_callable=extract_data, dag=dag)
t2 = PythonOperator(task_id='transform', python_callable=transform_data, dag=dag)
t3 = PythonOperator(task_id='load', python_callable=load_data, dag=dag)
t4 = PythonOperator(task_id='train', python_callable=train_model, dag=dag)

# 순서 정의
t1 >> t2 >> t3 >> t4
```

### 5. Airflow vs. 대안

| 도구 | 특징 | 사용처 |
|------|------|------|
| **Airflow** | 표준, 큰 커뮤니티 | Airbnb, 시중은행 |
| **Prefect** | 모던, 더 쉬움 | 신생 스타트업 |
| **Argo Workflows** | Kubernetes 기반 | 클라우드 네이티브 |
| **Kubeflow** | ML 특화 | ML 파이프라인 |
| **MLflow** | 실험 추적 | 모델 관리 |

### 6. 책의 Pawp 사례 (§5.2)

> "**Pawp**는 원격으로 아픈 동물을 진단하고 처방을 해주는 플랫폼"
> (책 본문)

#### 적용
- 동물 증상 데이터 수집 → 분석 모델 → 진단 추천
- 데이터 파이프라인 = 증상 → 진단

#### 금융 적용
- 거래 데이터 수집 → 사기 탐지 모델 → 차단/승인
- 신청 데이터 수집 → 신용평가 모델 → 승인/거절

> ✅ **여기까지 따라왔으면**: Airflow + Kafka의 기본 사용법이 보일 거다.

---

## 🔴 [고급] — ETL vs. ELT

### 1. 두 패러다임 비교

#### ETL (Extract, Transform, Load) — 전통
```
[원천 DB]
   ↓ Extract
[중간 서버 (변환)]
   ↓ Transform (Spark)
[DW (변환 완료 데이터)]
   ↓ Load
[분석/모델]
```

#### ELT (Extract, Load, Transform) — 현대
```
[원천 DB]
   ↓ Extract + Load
[Cloud DW (원본 그대로)]
   ↓ Transform (DW 내부 SQL)
[분석 뷰]
```

### 2. 차이

| | ETL | ELT |
|---|---|---|
| 변환 위치 | 중간 서버 | DW 내부 |
| 속도 | 느림 | 빠름 |
| 비용 | 인프라 분리 | DW 통합 |
| 유연성 | 낮음 | 높음 |
| 대표 도구 | Informatica, Talend | dbt, Snowflake |

### 3. dbt (현대 ELT)

```sql
-- dbt 모델 예시 (models/credit_features.sql)
WITH transactions AS (
    SELECT * FROM {{ ref('raw_transactions') }}
)
SELECT
    customer_id,
    AVG(amount) AS avg_amount,
    COUNT(*) AS num_transactions,
    SUM(CASE WHEN is_fraud THEN 1 ELSE 0 END) AS fraud_count
FROM transactions
GROUP BY customer_id
```

### 4. Cloud DW 비교

| | AWS Redshift | Snowflake | BigQuery |
|---|---|---|---|
| 클라우드 | AWS | 멀티 클라우드 | GCP |
| 가격 | 중간 | 비쌈 | 사용량 기반 |
| 한국 인기 | 중간 | 점차 증가 | 보통 (게임·스타트업 등) |

### 5. 책의 한계 5가지

#### 한계 ①: ELT/dbt 미언급
2020년 이후 표준이 된 패러다임 없음.

#### 한계 ②: Data Lakehouse 미언급
Delta Lake, Apache Iceberg 등.

#### 한계 ③: 한국 금융권 사례 부재
KB, 신한, 카뱅 등의 실전 사례.

#### 한계 ④: 비용 관리 미언급
파이프라인 운영비 (Cloud 비용).

#### 한계 ⑤: Data Quality 미언급
Great Expectations 같은 데이터 품질 검증.

---

## 🟣 [전공자] — 학술과 표준

### 1. Lambda Architecture vs. Kappa Architecture

#### Lambda (전통)
```
[원천]
  ├─ Batch Layer (전통 ETL, 정확)
  └─ Speed Layer (Streaming, 빠름)
        ↓
[Serving Layer] (둘 결합)
```

#### Kappa (단순화)
```
[원천] → [Streaming Layer (Kafka)] → [Serving Layer]
```

→ **현대 트렌드는 Kappa** (Streaming 만으로 충분).

### 2. Data Mesh

> 📄 Dehghani, Z. (2020). *How to move beyond a monolithic data lake to a distributed data mesh*. Martin Fowler Blog.

분산된 도메인별 데이터 관리.

### 3. Apache Kafka 학술

> 📄 Kreps, J., Narkhede, N., & Rao, J. (2011). Kafka: A distributed messaging system for log processing. *NetDB*.

LinkedIn에서 개발. 현재 글로벌 표준.

### 4. Apache Airflow

> 📄 Beauchemin, M. (2015). *Airflow: a workflow management platform*. Airbnb Engineering Blog. (https://medium.com/airbnb-engineering/airflow-a-workflow-management-platform-46318b977fd8)
> 📄 Apache Airflow GitHub: https://github.com/apache/airflow

Airbnb의 Maxime Beauchemin이 2014.10 사내 프로젝트로 시작 → 2015.6 오픈소스 공개 → 2016.3 Apache Incubator → **2019.1 Apache Top-Level Project**.

> ⚠ 정정: 초기 작성본의 "Beauchemin (2014). *Airflow: A workflow management platform*. Apache Software Foundation." 인용은 실존하지 않는 출판물이다. ASF는 2014년에 Airflow 관련 어떤 것도 출판하지 않았다 (당시 Airbnb 내부 프로젝트). 2015년 Airbnb Engineering Blog 글이 정확한 1차 출처다.

### 5. 한국 금융 데이터 인프라

#### 금융결제원 오픈뱅킹
- 표준 API
- 모든 시중은행 연동
- 마이데이터 인프라

#### 한국 시중은행 데이터 아키텍처
- 메인프레임 (코어)
- → 데이터 웨어하우스 (Hadoop)
- → 분석 (Spark)
- → AI 모델 (Python)

### 🟣 [전공자 심화] — Kafka·Data Mesh 의 한계와 후속 연구

#### 원논문 한계

**Kreps, Narkhede, & Rao (2011) — Kafka**
- 초기 Kafka는 *at-least-once* 보장만 가능 → 사기 탐지에서 중복 alert 위험. Exactly-once semantics(EOS)는 0.11(2017)에서야 도입되었고, 단일 파티션 내·단일 트랜잭션에만 적용되어 다중 시스템 end-to-end EOS는 여전히 어려움.
- Consumer offset 관리가 producer-side 트랜잭션과 분리됨 → idempotent consumer 패턴을 응용 레벨에서 추가 구현해야 함.
- Storage tier가 단일 broker disk에 묶여 있어 장기 보관 비용이 큼 (이후 KIP-405 Tiered Storage로 부분 해결).
- ZooKeeper 의존(2011~2021) → 운영 복잡성. KRaft(KIP-500)로 대체되었으나 2023년 이후 production GA.
- Throughput 우선 설계로 *낮은 지연(<10ms)* 보장은 별도 튜닝 필요.

**Dehghani (2020) — Data Mesh**
- 도메인 소유권 모델은 *조직이 이미 강한 데이터 엔지니어링 역량을 보유*했다는 가정을 깔고 있음. 한국 금융사처럼 중앙 IT 부서가 강한 조직에서는 전환 비용이 큼.
- 표준 인터페이스(self-serve data platform)가 추상적으로만 정의됨 → 실제 구현은 회사마다 다름.
- Federated computational governance는 정책 충돌 시 의사결정 메커니즘이 모호함.
- 학술 동료심사 없는 블로그·서적 기반 개념 → 정량적 효과 검증 부족.

#### 비판 문헌

- **Wang, G., Koshy, J., Subramanian, S., et al. (2015). Building a replicated logging system with Apache Kafka. *VLDB 2015* (산업 트랙).** — LinkedIn 후속 보고서로, exactly-once의 어려움과 cross-DC replication의 비용을 정량화.
- **Carbone, P., Katsifodimos, A., Ewen, S., Markl, V., Haridi, S., & Tzoumas, K. (2015). Apache Flink: Stream and batch processing in a single engine. *IEEE Data Eng. Bull.*, 38(4).** — Kafka Streams의 한계(상태 관리, event-time 처리)를 Flink가 어떻게 보완하는지 제시.
- **Machado, I., Costa, C., & Santos, M. Y. (2022). Data mesh: Concepts and principles of a paradigm shift in data architectures. *Procedia Computer Science*, 196.** — Data Mesh 학술 첫 정리 시도. 사례 부족과 측정 지표 부재를 한계로 지적.
- **Goedegebuure, A., Kumara, I., Driessen, S., et al. (2024). Data mesh: A systematic gray literature review.** arXiv:2304.01062 — 114건 산업 자료 검토. 절반 이상이 "이론은 매력적이나 구현 사례·정량 효과가 미흡"이라 보고.
- **Snowflake/Databricks 통합형 vs Data Mesh 분산형 논쟁**: Armbrust, M., Ghodsi, A., Xin, R., & Zaharia, M. (2021). *Lakehouse: A new generation of open platforms that unify data warehousing and advanced analytics.* CIDR 2021. — 중앙집중형 lakehouse가 mesh보다 단순함을 주장.

#### 후속 연구 동향 (2020~)

- **Stream processing 표준화**: Akidau, T., Begoli, E., Chernyak, S., et al. (2021). *Watermarks in stream processing systems: semantics and comparative analysis of Apache Flink and Google Cloud Dataflow.* VLDB 2021.
- **Tiered Storage·KRaft**: Apache Kafka KIP-405 (Tiered Storage), KIP-500/833 (KRaft consensus). https://cwiki.apache.org/confluence/display/KAFKA/KIP-500
- **Iceberg / Delta / Hudi (Lakehouse)**:
  - Armbrust, M., et al. (2020). *Delta Lake: High-performance ACID table storage over cloud object stores.* VLDB 2020.
  - Apache Iceberg / Hudi 사양: https://iceberg.apache.org/
- **Data Contracts**: Schwartz, A. et al. (2023). *Implementing data contracts.* Andrew Jones, *Driving Data Quality with Data Contracts* (Packt) — Data Mesh의 도메인 인터페이스를 스키마 계약으로 구체화.
- **Streaming SQL 표준**: Begoli, E., Camacho-Rodríguez, J., Hyde, J., et al. (2019). *One SQL to rule them all.* SIGMOD 2019. arXiv:1905.12133

#### 한국 적용 시 주의점

- **망분리·전자금융감독규정** 환경에서 Kafka exactly-once를 위해 필요한 외부 metadata store(예: 외부 schema registry, transactional coordinator)가 분리망 안에서 작동 가능한지 사전 검증 필요.
- 한국 시중은행 대부분은 데이터 거버넌스가 중앙집중형 → Data Mesh를 그대로 도입하기보다 *Lakehouse + 도메인별 data product 표면*만 부분 채택하는 하이브리드가 현실적.
- 마이데이터 정산·송금 같은 high-throughput 실시간 워크로드에서는 Kafka의 *consumer lag*가 SLA를 위협할 수 있음 → Tiered Storage·KRaft 운영 경험 부족한 상태에서 도입 시 위험. 시중은행 다수는 여전히 Kafka 2.x ZooKeeper 모드 운영.
- Data Mesh 도입 사례를 한국 금융권에서 *공식적으로* 발표한 곳은 2025년 기준 거의 없음 (블로그·콘퍼런스 발표 정도). 인용 시 1차 자료 확인 필수.

---

## 📚 책에 없지만 알면 좋은 것

### 🔍 보충 1 — 한국 금융 클라우드 정책 영향

#### 2019 이전
- 클라우드 사용 사실상 금지
- 모든 데이터 온프레미스

#### 2019 가이드라인
- 비중요 시스템 클라우드 가능
- AWS, Azure, GCP, 네이버 클라우드, KT Cloud

#### 2024 현재
- 카뱅: AWS 기반 (100% 비중·세부 워크로드 분포는 공개되지 않음)
- 토스: AWS 비중 높음
- 시중은행: 일부 비중요 워크로드 클라우드 이행 진행 중 (구체 비율 통계 부재)

> ⚠ 정정: "시중은행 30~50% 클라우드 이행"은 공개 출처가 없는 추정치다.

### 🔍 보충 2 — Data Quality 도구

```python
# Great Expectations
import great_expectations as ge

df = ge.read_csv('data.csv')

# 검증
df.expect_column_values_to_not_be_null('user_id')
df.expect_column_values_to_be_between('amount', 0, 1000000)
df.expect_column_unique_value_count_to_be_between('category', 1, 100)

# 결과
print(df.get_expectation_suite())
```

### 🔍 보충 3 — Data Catalog

대규모 조직에선 데이터 카탈로그 필수:
- **Apache Atlas**: 오픈소스
- **DataHub** (LinkedIn): 오픈소스
- **Alation, Collibra**: 상용

### 🔍 보충 4 — Data Versioning (DVC)

```bash
# DVC (Git-like for data)
dvc init
dvc add data/transactions.csv
git add data/transactions.csv.dvc
git commit -m "Add dataset v1"

# 새 버전
dvc add data/transactions.csv
dvc push

# 롤백
dvc checkout
```

### 🔍 보충 5 — Real-Time Feature Store

```python
# Feast (Open Source Feature Store)
from feast import FeatureStore

store = FeatureStore(repo_path='.')

# 실시간 피처 조회
features = store.get_online_features(
    features=['user:age', 'user:avg_amount'],
    entity_rows=[{'user_id': 'A'}]
).to_dict()
```

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. Batch와 Streaming 둘 다 필요?

**A.** **대부분 둘 다**.
- Batch: 신용평가 (일/주)
- Streaming: 사기 탐지 (실시간)
- → Lambda Architecture

### Q2. Airflow가 정말 표준?

**A.** **현재까진 표준**, 대안 부상 중.
- 표준: Airflow (Airbnb 시작)
- 모던: Prefect, Dagster
- 클라우드: AWS Step Functions

### Q3. 한국 금융권은 어떤 도구?

**A.**
- 시중은행: Airflow + Spark + Hive
- 카뱅: AWS MWAA (Managed Airflow)
- 토스: Airflow + Kafka
- 보험: 대부분 온프레미스 + 자체 도구

### Q4. ETL과 ELT 어느 게 좋나?

**A.** **상황 따라**.

- 데이터 적음, 변환 복잡: ETL
- 데이터 많음, 변환 단순: ELT
- 클라우드 DW 사용: ELT 추세

### Q5. Kafka 학습 어려움

**A.** 첫 발:
1. 로컬 Docker로 Kafka 실행
2. Python `kafka-python` 라이브러리
3. Producer/Consumer 코드 한 줄씩
4. Kafka 공식 튜토리얼

### Q6. 파이프라인 비용?

**A.** 추정:
- 소규모 (월 GB): Free Tier
- 중규모 (월 TB): $1K~10K
- 대규모 (월 PB): $100K+

### Q7. 운영 vs. 개발 차이?

**A.**
- 개발: 코드 작성, 테스트
- 운영: 모니터링, 알람, 장애 대응
- → DevOps + MLOps 통합

---

## 🎯 이 절에서 가져갈 핵심 7가지

1. **데이터 파이프라인** = 원천 → 분석/모델 자동화.
2. **2가지 유형**: 분석용 (Data Warehouse) + 운영용 (ML 모델).
3. **Batch (Airflow) vs. Streaming (Kafka)** — 응답 시간 따라.
4. **Airflow DAG** 가 오케스트레이션 표준.
5. **ETL → ELT** 패러다임 전환 (Cloud DW + dbt).
6. **한국 시중은행**: 온프레미스 중심, **카뱅**: AWS EKS 중심 하이브리드 (자사 tech 블로그 기준).
7. **Data Quality (Great Expectations)** + **Versioning (DVC)** 도 필수.

---

## 📖 더 읽을거리

### 데이터 엔지니어링
- Reis, J., & Housley, M. (2022). *Fundamentals of Data Engineering*. O'Reilly.
- Kleppmann, M. (2017). *Designing Data-Intensive Applications*. O'Reilly.

### Airflow
- Airflow 공식: https://airflow.apache.org/
- *Data Pipelines with Apache Airflow* (Manning, 2021)

### Kafka
- Narkhede, N., et al. (2017). *Kafka: The Definitive Guide*. O'Reilly.

### dbt + ELT
- dbt: https://www.getdbt.com/
- Snowflake: https://www.snowflake.com/

### 한국 사례
- 카카오뱅크 Tech Blog (AWS 이행 사례).
- 토스 Tech Blog.

---

## 📋 검증 노트 / 변경 이력

| # | 항목 | 초기 작성본 | 수정 내용 | 1차 출처 |
|---|---|---|---|---|
| 1 | Beauchemin 인용 | "Beauchemin (2014). *Airflow: A workflow management platform*. Apache Software Foundation" | **존재하지 않는 출판물** → Airbnb Engineering Blog (2015) 또는 Apache Airflow GitHub로 정정. Airflow는 2014.10 Airbnb 사내 시작 → 2015.6 오픈소스 → 2016.3 Apache Incubator → 2019.1 TLP | [Airflow History](https://airflow.apache.org/docs/apache-airflow/stable/project.html) |
| 2 | 네이버 BigQuery | "한국 인기 높음 (네이버 사용)" | 네이버는 자체 **Naver Cloud** 운영; BigQuery 한국 대표 사용자 출처 없음 → "보통 (게임·스타트업 등)" | [Naver Cloud](https://gtrekter.medium.com/naver-cloud-a-look-inside-the-south-koreas-leading-cloud-platform-63be6d529fef) |
| 3 | 시중은행 클라우드 비중 | "30~50%" | 공개 출처 없는 추정 → "일부 비중요 워크로드 이행 진행 중" | — |
| 4 | 카뱅 클라우드 | "100% AWS" | AWS 기반 (정확한 비중·세부 분포는 공개 안 됨); 실제 EKS/K8s 중심 | [카뱅 tech blog](https://tech.kakaobank.com/) |

---

> **다음 절 예고** — §5.3+5.4 SQL 배치 처리 + 모델 패키징/배포
