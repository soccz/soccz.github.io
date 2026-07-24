# 7. 이론적 계보

## 7.1 이론적 조상 (직접 연결선)

**① Elhage et al. 2022, "Toy Models of Superposition" (Anthropic).** 이 논문의 **문제 정의 전체**가 여기서 온다. Elhage 등은 장난감 모델에서 "특징 수 > 뉴런 수"일 때 모델이 특징을 과완비 방향에 겹쳐 싣는 중첩을 실증하고, 그것이 다의성의 원인임을 보였다. 본 논문은 그 가설을 **실제 대형 모델에서 되찾는 방법**으로 승격시킨다. 연결선: "중첩이 있다(Elhage)" → "그럼 희소 사전으로 풀 수 있다(본 논문)".

**② Olshausen & Field 1997, 희소 코딩(sparse coding).** "자연 신호 = 과완비 기저의 희소 선형결합"이라는 프레임과, 그로부터 국소·해석 가능한 기저가 창발한다는 발견의 원천. 본 논문의 식 (05_method_b §4.0·§4.3)은 이 희소 코딩을 트랜스포머 활성에 그대로 이식한 것이다. 연결선: 신경과학의 V1 필터 창발 = 언어모델의 단의미 특징 창발.

**③ Wright & Ma 2022, L1 복원 이론.** L1 벌점이 적절한 조건에서 ground-truth 희소 특징을 복원한다는 이론적 보증. 본 논문이 "L1 을 쓰면 왜 특징이 되찾아지는가"를 정당화하는 이론적 뒷배. 연결선: 방법의 손실항(Eq.4)의 이론적 면허.

**④ Bills et al. 2023, 자동 해석가능성(OpenAI).** "언어모델로 뉴런을 설명·채점한다"는 프로토콜의 출처. 본 논문의 평가(§3, 06_experiments_a)가 이걸 SAE 특징에 적용한 것. 연결선: 평가 방법론의 부모.

## 7.2 평행 연구 (같은 시기, 다른 접근)

**① Bricken et al. 2023, "Towards Monosemanticity" (Anthropic) — [이미 커버 2026-05-22].** 거의 **동시기에 독립적으로** 같은 아이디어(SAE 로 단의미 특징 추출)를 Anthropic 이 발표. 차이: Bricken 은 1-층 transformer 의 MLP 에 집중하고 더 정교한 특징 카탈로그·평가(human/AutoInterp/logit/case study 4-line)를 제시. 본 논문은 **더 큰 모델(Pythia-410M)의 잔차 스트림**과 **인과(IOI) 검증**에 강점. 두 논문이 서로를 강화하며 "SAE=표준"을 확립. 어느 쪽이 이겼다기보다 **독립 재현이 서로의 신뢰도를 올린** 사례.

**② Yun et al. 2021, 트랜스포머 잔차 사전 학습.** 본 논문보다 앞서 여러 잔차 층에 사전 학습을 적용. 그러나 자동 해석·인과 개입으로 **닫지 못함**. 본 논문이 "완결된 검증 파이프라인"으로 이겼다.

**③ PCA / ICA (고전 선형 분해).** 본 논문의 상시 baseline. 완비·비희소라는 구조적 한계로 해석(Figure 2)·인과(Figure 3) 모두에서 진다 — "완비 선형 분해로는 중첩을 못 푼다"는 대조군 역할.

## 7.3 후손 예측 (실제로 나온 것 포함)

**① TopK / 스케일링 계열 — Gao et al. 2024 "Scaling and evaluating sparse autoencoders" (OpenAI).** 본 논문의 두 약점($\alpha$ knee 부재, 대형 모델 확장 미검증)을 정면 공략: L1 대신 **TopK**($k$개만 켜기)로 희소를 직접 제어하고, GPT-4 활성에 1600만 latent SAE 를 학습하며 깔끔한 스케일링 법칙을 제시. 본 논문이 남긴 "다음 문제"의 직계 답.

**② 안전·조향 계열 — Anthropic "Scaling Monosemanticity" (2024, Claude 3 Sonnet).** 본 논문의 "enumerative safety"(§6.3) 비전을 실서비스 모델급에서 실현, 특징을 켜고 꺼 모델 행동을 조향. 본 논문의 인과 개입(Figure 3)의 산업 규모 후손.

**③ 시계열 적용 계열 — Mishra 2026 "Dissecting Chronos" (SAE × Chronos) [이미 커버 2026-05-27].** TopK-SAE 를 **시계열 파운데이션 모델(Chronos)** 의 활성에 적용해 인과 특징 위계를 발견. **이 계보가 곧 사용자의 연구 지대**(시계열 트랜스포머 기계적 해석)로 들어오는 지점. 본 논문 → Gao TopK → Mishra Chronos-SAE 의 3단 계보가 "SAE-for-TS"를 만든다.

**④ 회로 계열 — Marks et al. 2024 "Sparse Feature Circuits" (SFC) [이미 커버 2026-05-15].** 본 논문의 "특징 간 인과 의존을 층을 넘어 추적"(§6.2 future work)을 실현 — SAE 특징으로 **인과 그래프**를 그리고 SHIFT 로 편집. 본 논문이 지목한 방향의 직접 후손.

## 7.4 계보 한 줄 지도

> **Elhage(중첩 문제) + Olshausen-Field(희소 코딩) + Wright-Ma(L1 보증) + Bills(자동 해석)** → **본 논문(대형 모델에서 SAE 로 해석+인과 동시 실증)** → **Gao TopK(스케일·안정) · Bricken/Anthropic Scaling(안전·조향) · Marks SFC(회로) · Mishra(시계열 적용)**. 본 논문은 이 사슬의 **"방법론이 실전 파이프라인이 되는 변곡점"** 이다.
