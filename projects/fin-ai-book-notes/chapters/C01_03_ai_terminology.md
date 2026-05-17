# 1.3 AI와 그 주변 용어들 — *AI Terminology Demystified*

> **읽는 데 걸리는 시간**: 약 50분

---

## 🪧 이 절을 한 줄로

> **AI · ML · DL · GenAI · LLM · 데이터 과학** — 다 같은 말 같지만 **포함 관계가 다르다**.
> 이걸 정확히 알면 책 §1.3 이후의 모든 챕터가 어느 레벨의 기술을 다루는지 보인다.

책은 §1.3에서 AI/ML/DL 3개를 한 문단씩 정의하고 넘어간다. 이 해설집은:
1. **포함 관계와 역사**를 정확히 그리고,
2. **요즘 핫한 GenAI/LLM/RAG/Agent**까지 확장하고,
3. **각 용어가 금융에서 어떤 의미**인지 매핑한다.

### 📍 미리 그릴 큰 그림 — AI 용어 동심원

<svg viewBox="0 0 760 480" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">AI 용어 동심원 — 포함 관계가 핵심</text>
  <!-- Outer: AI -->
  <circle cx="380" cy="260" r="180" fill="#fef9e7" stroke="#8a6d2c" stroke-width="2"/>
  <text x="380" y="100" text-anchor="middle" font-size="14" font-weight="700" fill="#8a6d2c">AI (인공지능)</text>
  <text x="380" y="115" text-anchor="middle" font-size="10" fill="#8a6d2c">규칙 기반 + 머신러닝 + 기타</text>
  <!-- Layer 2: ML -->
  <circle cx="380" cy="280" r="140" fill="#fdf0ea" stroke="#c4724e" stroke-width="2"/>
  <text x="380" y="155" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">Machine Learning (ML, 머신러닝)</text>
  <text x="380" y="170" text-anchor="middle" font-size="10" fill="#c4724e">데이터로 학습하는 알고리즘</text>
  <!-- Layer 3: DL -->
  <circle cx="380" cy="300" r="100" fill="#fff" stroke="#5a7a96" stroke-width="2"/>
  <text x="380" y="210" text-anchor="middle" font-size="13" font-weight="700" fill="#5a7a96">Deep Learning (DL, 딥러닝)</text>
  <text x="380" y="225" text-anchor="middle" font-size="10" fill="#5a7a96">신경망 기반 ML</text>
  <!-- Layer 4: GenAI -->
  <circle cx="380" cy="320" r="60" fill="#edf7ef" stroke="#3a7d44" stroke-width="2"/>
  <text x="380" y="290" text-anchor="middle" font-size="12" font-weight="700" fill="#3a7d44">Generative AI</text>
  <text x="380" y="305" text-anchor="middle" font-size="9" fill="#3a7d44">생성형</text>
  <!-- Layer 5: LLM -->
  <circle cx="380" cy="340" r="30" fill="#f5e6f0" stroke="#7a6a9a" stroke-width="2"/>
  <text x="380" y="345" text-anchor="middle" font-size="11" font-weight="700" fill="#7a6a9a">LLM</text>
  <!-- Data Science overlap -->
  <ellipse cx="180" cy="280" rx="60" ry="100" fill="rgba(196,114,78,0.1)" stroke="#c4724e" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="100" y="240" font-size="12" font-weight="700" fill="#c4724e">Data Science</text>
  <text x="100" y="255" font-size="9" fill="#c4724e">(데이터 과학)</text>
  <text x="100" y="280" font-size="9" fill="#57534e">통계 + ML +</text>
  <text x="100" y="293" font-size="9" fill="#57534e">도메인 지식</text>
  <!-- Statistics -->
  <rect x="40" y="350" width="120" height="35" rx="4" fill="#fff" stroke="#a8a29e"/>
  <text x="100" y="367" text-anchor="middle" font-size="11" font-weight="700" fill="#57534e">통계학</text>
  <text x="100" y="380" text-anchor="middle" font-size="9" fill="#a8a29e">(ML의 뿌리)</text>
  <!-- Symbolic AI -->
  <rect x="600" y="180" width="140" height="35" rx="4" fill="#fff" stroke="#a8a29e"/>
  <text x="670" y="197" text-anchor="middle" font-size="11" font-weight="700" fill="#57534e">Symbolic AI</text>
  <text x="670" y="210" text-anchor="middle" font-size="9" fill="#a8a29e">(규칙 기반, 1950s)</text>
  <line x1="600" y1="200" x2="540" y2="180" stroke="#a8a29e" stroke-width="1" stroke-dasharray="2,2"/>
  <text x="380" y="465" text-anchor="middle" font-size="11" font-style="italic" fill="#57534e">"LLM은 GenAI의 한 종류, GenAI는 DL의 한 종류, DL은 ML의 한 종류, ML은 AI의 한 종류"</text>
</svg>

> 💬 책 §1.3의 NVIDIA 도해(그림 1-2)는 AI/ML/DL 3겹만 그리고 끝난다. 위 그림은 거기에 **GenAI/LLM/Data Science**까지 확장.

---

## 🟢 [초급] — 일상 비유로 잡는 감

### 💭 시작하기 전에

요즘 뉴스에서 "AI", "ChatGPT", "딥러닝", "머신러닝" 다 들어봤을 거다. 그런데 이게 **다 같은 뜻일까, 다른 뜻일까?**

답: **포함 관계**. 양파처럼 겹쳐있다.

### 1. 한 문장 비유 — 동물원 비유

```
🦁 AI = "동물" (모든 동물 = 모든 인공지능)
🐅 ML = "고양이과" (사자, 호랑이, 가축 고양이...)
🐈 DL = "가축 고양이" (특정 고양이과 동물)
😺 LLM = "특정 품종의 고양이" (예: 페르시안)
```

같은 말이 아니다. **고양이가 동물이라고 해서, 모든 동물이 고양이는 아니다**.

마찬가지:
- ChatGPT는 LLM이고, LLM은 AI다. → 맞다.
- 모든 AI가 ChatGPT 같은가? → **아니다**. (체스 프로그램, 신용평가 모델, 추천 시스템 등 다양)

### 2. 각 용어를 한 줄로

| 용어 | 한 줄 정의 | 일상 예시 |
|------|----------|---------|
| **AI** | "기계가 똑똑한 일을 하게 하는 모든 기술" | 자율주행, 음성인식, 추천, **+ 옛날 체스 프로그램까지** |
| **ML** | "예제를 보고 스스로 규칙을 찾는 AI" | 스팸 필터 (스팸 메일 100개 보고 패턴 학습) |
| **DL** | "신경망(인공 뇌)을 쓰는 ML" | 이미지 인식, 음성 인식, ChatGPT |
| **GenAI** | "새로운 것을 **생성**하는 DL" | ChatGPT (글), DALL-E (그림), Suno (음악) |
| **LLM** | "글을 다루는 GenAI" | GPT-4, Claude, Gemini, Llama |
| **데이터 과학** | "데이터로 의사결정하는 학문" | A/B 테스트, 매출 예측, 신용평가 |

### 3. 시간 순서로 보기 — 누가 먼저?

<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">AI 역사 타임라인 — 새 용어는 모두 옛 것 위에 쌓인다</text>
  <!-- Timeline -->
  <line x1="60" y1="200" x2="720" y2="200" stroke="#1c1917" stroke-width="2"/>
  <!-- Decades -->
  <g font-family="Noto Sans KR,sans-serif" font-size="10">
    <line x1="100" y1="195" x2="100" y2="205" stroke="#1c1917" stroke-width="1.5"/>
    <text x="100" y="225" text-anchor="middle" fill="#57534e">1950s</text>
    <line x1="200" y1="195" x2="200" y2="205" stroke="#1c1917" stroke-width="1.5"/>
    <text x="200" y="225" text-anchor="middle" fill="#57534e">1980s</text>
    <line x1="320" y1="195" x2="320" y2="205" stroke="#1c1917" stroke-width="1.5"/>
    <text x="320" y="225" text-anchor="middle" fill="#57534e">2000s</text>
    <line x1="450" y1="195" x2="450" y2="205" stroke="#1c1917" stroke-width="1.5"/>
    <text x="450" y="225" text-anchor="middle" fill="#57534e">2012</text>
    <line x1="570" y1="195" x2="570" y2="205" stroke="#1c1917" stroke-width="1.5"/>
    <text x="570" y="225" text-anchor="middle" fill="#57534e">2017</text>
    <line x1="680" y1="195" x2="680" y2="205" stroke="#1c1917" stroke-width="1.5"/>
    <text x="680" y="225" text-anchor="middle" fill="#57534e">2022</text>
  </g>
  <!-- Events -->
  <g font-family="Noto Sans KR,sans-serif">
    <!-- AI -->
    <rect x="60" y="90" width="100" height="60" rx="6" fill="#fef9e7" stroke="#8a6d2c"/>
    <text x="110" y="112" text-anchor="middle" font-size="12" font-weight="700" fill="#8a6d2c">AI 탄생</text>
    <text x="110" y="128" text-anchor="middle" font-size="10" fill="#1c1917">Dartmouth</text>
    <text x="110" y="142" text-anchor="middle" font-size="10" fill="#1c1917">1956</text>
    <line x1="110" y1="150" x2="110" y2="195" stroke="#8a6d2c" stroke-width="1" stroke-dasharray="2,2"/>
    <!-- ML -->
    <rect x="170" y="90" width="100" height="60" rx="6" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="220" y="112" text-anchor="middle" font-size="12" font-weight="700" fill="#c4724e">ML 부상</text>
    <text x="220" y="128" text-anchor="middle" font-size="10" fill="#1c1917">전문가시스템</text>
    <text x="220" y="142" text-anchor="middle" font-size="10" fill="#1c1917">SVM, Tree</text>
    <line x1="220" y1="150" x2="220" y2="195" stroke="#c4724e" stroke-width="1" stroke-dasharray="2,2"/>
    <!-- Big data -->
    <rect x="280" y="90" width="100" height="60" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="330" y="112" text-anchor="middle" font-size="12" font-weight="700" fill="#5a7a96">빅데이터</text>
    <text x="330" y="128" text-anchor="middle" font-size="10" fill="#1c1917">Hadoop</text>
    <text x="330" y="142" text-anchor="middle" font-size="10" fill="#1c1917">데이터 폭증</text>
    <line x1="330" y1="150" x2="330" y2="195" stroke="#5a7a96" stroke-width="1" stroke-dasharray="2,2"/>
    <!-- DL -->
    <rect x="400" y="90" width="100" height="60" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="450" y="112" text-anchor="middle" font-size="12" font-weight="700" fill="#3a7d44">DL 혁명</text>
    <text x="450" y="128" text-anchor="middle" font-size="10" fill="#1c1917">AlexNet</text>
    <text x="450" y="142" text-anchor="middle" font-size="10" fill="#1c1917">ImageNet 우승</text>
    <line x1="450" y1="150" x2="450" y2="195" stroke="#3a7d44" stroke-width="1" stroke-dasharray="2,2"/>
    <!-- Transformer -->
    <rect x="520" y="90" width="100" height="60" rx="6" fill="#f5e6f0" stroke="#7a6a9a"/>
    <text x="570" y="112" text-anchor="middle" font-size="12" font-weight="700" fill="#7a6a9a">Transformer</text>
    <text x="570" y="128" text-anchor="middle" font-size="10" fill="#1c1917">"Attention</text>
    <text x="570" y="142" text-anchor="middle" font-size="10" fill="#1c1917">Is All You Need"</text>
    <line x1="570" y1="150" x2="570" y2="195" stroke="#7a6a9a" stroke-width="1" stroke-dasharray="2,2"/>
    <!-- ChatGPT -->
    <rect x="630" y="90" width="100" height="60" rx="6" fill="#1c1917" stroke="#1c1917"/>
    <text x="680" y="112" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">ChatGPT</text>
    <text x="680" y="128" text-anchor="middle" font-size="10" fill="#fff">2개월 만에</text>
    <text x="680" y="142" text-anchor="middle" font-size="10" fill="#fff">1억 사용자</text>
    <line x1="680" y1="150" x2="680" y2="195" stroke="#fff" stroke-width="1" stroke-dasharray="2,2"/>
  </g>
  <text x="380" y="260" text-anchor="middle" font-size="12" font-weight="700" fill="#1c1917">≈ 70년의 누적 — 새 용어는 옛 것을 대체하지 않고 위에 쌓인다</text>
  <text x="380" y="285" text-anchor="middle" font-size="11" font-style="italic" fill="#57534e">2024년 현재도 1950년대 규칙 기반 AI가 금융 시스템에 살아있다 (예: ATM의 PIN 검증).</text>
</svg>

#### 핵심 통찰: 새 기술이 옛 기술을 대체하지 않는다

너가 ATM에서 비밀번호 4자리 누르면 → 그건 **1950년대 규칙 기반 시스템**.
신한카드 결제 사기 탐지 → **2000년대 ML (XGBoost)**.
ChatGPT로 상담 → **2022년 LLM**.

**한 은행 안에 70년치 기술이 다 살아있다**.

### 4. ChatGPT가 AI의 전부가 아니다 — 흔한 오해

요즘 "AI = ChatGPT" 같이 생각하는 사람이 많다. 사실:

| 분야 | 주로 쓰는 AI | ChatGPT 안 씀 |
|------|-------------|--------------|
| **신용평가** (Ch3) | XGBoost, Logistic Regression | ✓ |
| **사기 탐지** (Ch4) | Random Forest, GNN | ✓ |
| **알고리즘 트레이딩** (Ch2) | LSTM, RL | ✓ |
| **고객 상담** | ChatGPT/Claude (LLM) | ✗ (여기는 씀) |
| **문서 분석** | LLM + RAG | ✗ (여기는 씀) |

> 💡 **이 책 6개 챕터 중 LLM이 주역인 건 Ch6 하나뿐**. 나머지는 전통 ML/DL.
> 책은 이 점을 명확히 안 짚어줘서 "금융 AI = ChatGPT" 라고 오해할 수 있다.

> ✅ **여기까지 따라왔으면**: AI라는 큰 우산 아래 다양한 도구가 있다는 게 보일 거다. ChatGPT는 그중 가장 시끄러운 한 명일 뿐.

---

## 🟡 [중급] — 동작 원리

### 💭 시작하기 전에

이제 각 용어를 좀 더 정확히 본다:
- **어떤 문제**를 푸나
- **어떻게** 푸나
- **언제** 어느 도구를 써야 하나

### 1. AI vs. ML vs. DL — 세 가지의 정확한 차이

#### 1.1 AI (인공지능, Artificial Intelligence)

**가장 넓은 정의**: 기계가 인간의 인지 능력 (학습·추론·인식·언어)을 모방하는 모든 기술.

#### 두 가지 큰 분류

```
AI
├── Symbolic AI (규칙 기반, "Old AI")
│   └── 사람이 규칙을 직접 코딩
│       예: 체스 룰, 세금 계산기, 챗봇 응답 트리
│
└── Machine Learning (데이터 기반, "New AI")
    └── 컴퓨터가 데이터에서 규칙을 학습
        예: 스팸 필터, 신용평가, ChatGPT
```

#### 예시 — 신용평가 두 방식

**규칙 기반 (Symbolic AI)**:
```
IF 연봉 < 3000만:
    점수 = 600
ELIF 연봉 < 5000만 AND 부채 < 5000만:
    점수 = 750
ELSE:
    점수 = 800
```

**ML 방식**:
```python
model = XGBoost()
model.fit(과거_대출_데이터, 부도_여부)
점수 = model.predict(신규_신청자_정보)
```

→ ML은 **사람이 모르는 패턴**까지 찾는다.

#### 1.2 ML (Machine Learning, 머신러닝)

**정의**: 데이터로부터 패턴을 학습하는 알고리즘.

#### 학습 방식 3종

<svg viewBox="0 0 720 340" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">ML의 3가지 학습 방식</text>
  <g font-family="Noto Sans KR,sans-serif">
    <!-- Supervised -->
    <rect x="20" y="55" width="220" height="240" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="130" y="80" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">① 지도학습 (Supervised)</text>
    <text x="130" y="105" text-anchor="middle" font-size="11" fill="#1c1917">"정답 있음"</text>
    <text x="130" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="#1c1917">입력 → 정답</text>
    <text x="130" y="155" text-anchor="middle" font-size="10" fill="#57534e">(메일 → 스팸/정상)</text>
    <text x="130" y="185" text-anchor="middle" font-size="11" font-weight="700" fill="#c4724e">알고리즘</text>
    <text x="130" y="205" text-anchor="middle" font-size="10" fill="#57534e">Linear/Logistic Regression</text>
    <text x="130" y="222" text-anchor="middle" font-size="10" fill="#57534e">Decision Tree</text>
    <text x="130" y="239" text-anchor="middle" font-size="10" fill="#57534e">XGBoost, Random Forest</text>
    <text x="130" y="256" text-anchor="middle" font-size="10" fill="#57534e">CNN, RNN, Transformer</text>
    <text x="130" y="280" text-anchor="middle" font-size="11" font-weight="700" fill="#c4724e">금융: Ch2,3,4 대부분</text>
    <!-- Unsupervised -->
    <rect x="250" y="55" width="220" height="240" rx="8" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="360" y="80" text-anchor="middle" font-size="13" font-weight="700" fill="#5a7a96">② 비지도학습 (Unsupervised)</text>
    <text x="360" y="105" text-anchor="middle" font-size="11" fill="#1c1917">"정답 없음"</text>
    <text x="360" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="#1c1917">패턴 찾기</text>
    <text x="360" y="155" text-anchor="middle" font-size="10" fill="#57534e">(고객 그룹 발견)</text>
    <text x="360" y="185" text-anchor="middle" font-size="11" font-weight="700" fill="#5a7a96">알고리즘</text>
    <text x="360" y="205" text-anchor="middle" font-size="10" fill="#57534e">K-Means, DBSCAN</text>
    <text x="360" y="222" text-anchor="middle" font-size="10" fill="#57534e">PCA, t-SNE, UMAP</text>
    <text x="360" y="239" text-anchor="middle" font-size="10" fill="#57534e">Autoencoder, GAN</text>
    <text x="360" y="256" text-anchor="middle" font-size="10" fill="#57534e">Isolation Forest</text>
    <text x="360" y="280" text-anchor="middle" font-size="11" font-weight="700" fill="#5a7a96">금융: Ch4 (이상거래)</text>
    <!-- Reinforcement -->
    <rect x="480" y="55" width="220" height="240" rx="8" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="590" y="80" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">③ 강화학습 (RL)</text>
    <text x="590" y="105" text-anchor="middle" font-size="11" fill="#1c1917">"시행착오"</text>
    <text x="590" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="#1c1917">상태→행동→보상</text>
    <text x="590" y="155" text-anchor="middle" font-size="10" fill="#57534e">(매수/매도 결정)</text>
    <text x="590" y="185" text-anchor="middle" font-size="11" font-weight="700" fill="#3a7d44">알고리즘</text>
    <text x="590" y="205" text-anchor="middle" font-size="10" fill="#57534e">Q-Learning, DQN</text>
    <text x="590" y="222" text-anchor="middle" font-size="10" fill="#57534e">Policy Gradient, A3C</text>
    <text x="590" y="239" text-anchor="middle" font-size="10" fill="#57534e">PPO, SAC</text>
    <text x="590" y="256" text-anchor="middle" font-size="10" fill="#57534e">RLHF (LLM 학습)</text>
    <text x="590" y="280" text-anchor="middle" font-size="11" font-weight="700" fill="#3a7d44">금융: Ch2 (트레이딩)</text>
  </g>
</svg>

> 💡 **이 책 챕터별 학습 방식 매핑**:
> - Ch2 (투자): 지도(예측) + 강화(트레이딩 전략)
> - Ch3 (신용): 지도 (부도/정상)
> - Ch4 (사기): 지도(있는 라벨) + 비지도(없는 라벨, 이상치 탐지)
> - Ch6 (LLM): 자기지도학습(self-supervised) + 강화학습(RLHF)

#### 1.3 DL (Deep Learning, 딥러닝)

**정의**: ML의 한 분야. **신경망(Neural Network)** 을 여러 층(deep) 쌓은 것.

#### 신경망의 기본 단위 — 뉴런 1개

<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <defs>
    <marker id="arN" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#57534e"/></marker>
  </defs>
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">인공 뉴런 1개의 작동 — 입력에 가중치 곱하고 합산 후 활성화</text>
  <!-- Inputs -->
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <circle cx="100" cy="100" r="25" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="100" y="105" text-anchor="middle" font-weight="700">x₁</text>
    <text x="40" y="105" text-anchor="middle" fill="#57534e">연봉</text>
    <circle cx="100" cy="160" r="25" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="100" y="165" text-anchor="middle" font-weight="700">x₂</text>
    <text x="40" y="165" text-anchor="middle" fill="#57534e">부채</text>
    <circle cx="100" cy="220" r="25" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="100" y="225" text-anchor="middle" font-weight="700">x₃</text>
    <text x="40" y="225" text-anchor="middle" fill="#57534e">연체</text>
  </g>
  <!-- Edges with weights -->
  <line x1="125" y1="100" x2="305" y2="155" stroke="#57534e" stroke-width="1.5" marker-end="url(#arN)"/>
  <text x="200" y="115" font-size="11" fill="#5a7a96" font-weight="700">w₁</text>
  <line x1="125" y1="160" x2="305" y2="160" stroke="#57534e" stroke-width="1.5" marker-end="url(#arN)"/>
  <text x="200" y="155" font-size="11" fill="#5a7a96" font-weight="700">w₂</text>
  <line x1="125" y1="220" x2="305" y2="165" stroke="#57534e" stroke-width="1.5" marker-end="url(#arN)"/>
  <text x="200" y="215" font-size="11" fill="#5a7a96" font-weight="700">w₃</text>
  <!-- Neuron -->
  <circle cx="340" cy="160" r="40" fill="#eaf2f8" stroke="#5a7a96" stroke-width="2"/>
  <text x="340" y="155" text-anchor="middle" font-size="11" font-weight="700">Σ + b</text>
  <text x="340" y="172" text-anchor="middle" font-size="10">활성화 σ</text>
  <!-- Output -->
  <line x1="380" y1="160" x2="490" y2="160" stroke="#57534e" stroke-width="2" marker-end="url(#arN)"/>
  <circle cx="520" cy="160" r="25" fill="#edf7ef" stroke="#3a7d44"/>
  <text x="520" y="165" text-anchor="middle" font-size="11" font-weight="700">y</text>
  <text x="580" y="165" font-size="11" fill="#57534e">부도확률</text>
  <!-- Formula -->
  <text x="360" y="245" text-anchor="middle" font-size="13" fill="#1c1917">y = σ(w₁x₁ + w₂x₂ + w₃x₃ + b)</text>
  <text x="360" y="265" text-anchor="middle" font-size="10" font-style="italic" fill="#57534e">"입력에 가중치 곱해서 더하고, 활성화 함수 통과"</text>
</svg>

**층 (layer)** 을 여러 개 쌓으면:

```
입력 → [뉴런 100개] → [뉴런 100개] → [뉴런 100개] → 출력
      (1층)         (2층)          (3층)
```

→ **3층 = "deep"** 신경망 = 딥러닝.

> 📝 **왜 "깊다"는 게 강력한가?**
> 1층: 단순 패턴 (직선)
> 2층: 조합 패턴 (코너)
> 3층: 복잡 패턴 (모양)
> N층: 추상 개념 (고양이, 부도 위험)
>
> 각 층이 이전 층의 추상화를 한 단계 더 추상화.

#### 1.4 GenAI (Generative AI, 생성형 AI)

**정의**: 새로운 데이터를 **생성**하는 DL.

**기존 DL vs. GenAI**:
- 기존: "이 이미지가 고양이냐 강아지냐?" → 분류
- GenAI: "고양이 이미지를 그려줘" → 생성

#### GenAI 종류

| 모달리티 | 모델 | 예시 |
|---------|------|------|
| 텍스트 | LLM (GPT-4, Claude, Gemini) | 챗봇, 요약 |
| 이미지 | Diffusion (DALL-E, Midjourney, Stable Diffusion) | 그림 생성 |
| 음성 | TTS (ElevenLabs, Suno) | 음성 합성 |
| 비디오 | Sora, Runway | 영상 생성 |
| 코드 | Codex, Copilot | 프로그래밍 |
| 멀티모달 | GPT-4V, Gemini Pro Vision | 이미지+텍스트 |

#### 1.5 LLM (Large Language Model, 대규모 언어 모델)

**정의**: 텍스트를 다루는 GenAI 중 **수십억~수조 파라미터** 규모의 모델.

**주요 모델 (2024 기준)**:
- OpenAI: GPT-4, GPT-4o
- Anthropic: Claude 3 (Opus, Sonnet, Haiku)
- Google: Gemini 1.5 (Ultra, Pro, Flash)
- Meta: Llama 3 (오픈소스)
- 한국: HyperCLOVA X (네이버), EXAONE (LG), Solar (업스테이지)
> ⚠ 정정: 초기 작성본의 "KORANI (LG)" 는 오류. KORani는 KRAFTON 의 LLaMA 기반 모델이고, LG 의 LLM은 EXAONE 임.

### 2. 데이터 과학(Data Science) — ML과의 차이

#### 2.1 정의

**데이터 과학**: 데이터에서 **인사이트(통찰)** 를 추출하는 학문.

#### 2.2 ML vs. Data Science

| | Machine Learning | Data Science |
|---|---|---|
| **목표** | 모델 성능 (정확도, F1) | 비즈니스 의사결정 |
| **결과물** | 학습된 모델 | 리포트, 대시보드, 가설 |
| **주된 도구** | sklearn, TensorFlow | pandas, SQL, Tableau |
| **사용 기간** | 모델 운영 (months~years) | 분석 보고 (days~weeks) |
| **핵심 질문** | "예측이 얼마나 정확한가?" | "왜 매출이 떨어졌는가?" |

#### 2.3 비유

```
[데이터 과학자] 의사
  "환자(데이터)를 보고 진단(원인) 내림"
  
[ML 엔지니어] 약사
  "처방(모델)을 받아 약(예측)을 자동 조제"
```

> 💡 둘은 협업한다. 데이터 과학자가 "이 부분에 ML 도입하면 좋겠다" 하면, ML 엔지니어가 모델 만든다.

### 3. 최근 핫한 용어들 — RAG, Agent, Fine-tuning

책 §1.3은 2024년 초까지 시점이라 GenAI 관련 용어가 빠져있다. 보충:

#### 3.1 RAG (Retrieval-Augmented Generation, 검색 증강 생성)

**문제**: LLM은 학습한 데이터까지만 알고, 회사 내부 문서를 모름.

**해결**: 질문 받으면 → 회사 DB에서 관련 문서 검색 → 그 문서를 LLM에 함께 입력 → 답변.

<svg viewBox="0 0 720 240" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <defs>
    <marker id="arR" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#7a6a9a"/></marker>
  </defs>
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">RAG — LLM이 회사 문서를 보고 답변하게 하는 법</text>
  <!-- User -->
  <rect x="30" y="100" width="100" height="50" rx="6" fill="#fff" stroke="#d6d3d1"/>
  <text x="80" y="125" text-anchor="middle" font-size="12" font-weight="700">고객 질문</text>
  <text x="80" y="140" text-anchor="middle" font-size="10" fill="#57534e">"대출 한도?"</text>
  <line x1="130" y1="125" x2="160" y2="125" stroke="#7a6a9a" stroke-width="2" marker-end="url(#arR)"/>
  <!-- Retriever -->
  <rect x="165" y="100" width="120" height="50" rx="6" fill="#f5e6f0" stroke="#7a6a9a"/>
  <text x="225" y="120" text-anchor="middle" font-size="12" font-weight="700" fill="#7a6a9a">Retriever</text>
  <text x="225" y="138" text-anchor="middle" font-size="10" fill="#57534e">유사 문서 검색</text>
  <line x1="225" y1="155" x2="225" y2="180" stroke="#7a6a9a" stroke-width="1.5" stroke-dasharray="3,2"/>
  <!-- DB -->
  <rect x="170" y="185" width="110" height="40" rx="6" fill="#fff" stroke="#7a6a9a"/>
  <text x="225" y="210" text-anchor="middle" font-size="11" fill="#57534e">사내 문서 DB</text>
  <text x="225" y="220" text-anchor="middle" font-size="9" fill="#a8a29e">(Vector DB)</text>
  <line x1="285" y1="125" x2="315" y2="125" stroke="#7a6a9a" stroke-width="2" marker-end="url(#arR)"/>
  <!-- LLM -->
  <rect x="320" y="100" width="120" height="50" rx="6" fill="#1c1917"/>
  <text x="380" y="120" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">LLM</text>
  <text x="380" y="138" text-anchor="middle" font-size="10" fill="#fff">질문+문서 받음</text>
  <line x1="440" y1="125" x2="470" y2="125" stroke="#7a6a9a" stroke-width="2" marker-end="url(#arR)"/>
  <!-- Answer -->
  <rect x="475" y="100" width="220" height="50" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
  <text x="585" y="120" text-anchor="middle" font-size="12" font-weight="700" fill="#3a7d44">답변 생성</text>
  <text x="585" y="138" text-anchor="middle" font-size="10" fill="#57534e">"고객님 신용등급 기준 5000만원..."</text>
</svg>

→ **Ch6에서 자세히 다룸**.

#### 3.2 Agent (AI 에이전트)

**정의**: LLM이 **여러 도구를 스스로 사용**하며 멀티스텝 작업 수행.

**예시 — 투자 상담 Agent**:
```
사용자: "내 포트폴리오 분석해줘"

Agent:
  Step 1: [도구: 증권 API] 보유 종목 조회
  Step 2: [도구: 시장 데이터] 각 종목 시세 가져옴
  Step 3: [도구: 계산기] 수익률 계산
  Step 4: [도구: LLM] 분석 결과 자연어로 정리
  → "삼성전자 5%, NVIDIA 12% 비중. 현재 +8% 수익..."
```

#### 3.3 Fine-tuning (미세 조정)

**정의**: 사전학습된 LLM에 **회사 특화 데이터로 추가 학습**.

```
[사전학습된 GPT-4]
   ↓ + 회사 내부 문서 1만 건
[Fine-tuned GPT-4]
   ← "이 회사 톤"으로 답변
```

#### 3.4 Prompt Engineering (프롬프트 엔지니어링)

LLM에게 **잘 묻는 기술**. 모델 안 건드리고 입력만 잘 만들기.

예시:
```
[나쁨] "신용평가 코드 만들어줘"
[좋음] "Python sklearn으로 신용평가 binary classification 모델 만들어줘. 
        XGBoost 사용, AUC 0.85 이상 목표, 코드와 설명 함께."
```

> ✅ **여기까지 따라왔으면**: AI/ML/DL/GenAI/LLM/RAG/Agent의 정확한 포함관계와 차이가 보일 것이다.

---

## 🔴 [고급] — 영문 용어와 책의 한계

### 💭 시작하기 전에

이 절은 **AI 분야의 정확한 학술 용어** 와 책 §1.3의 한계 5가지.

### 1. AI 학술적 분류 — 강·약·일반 인공지능

#### 1.1 Strong AI vs. Weak AI (Searle, 1980)

| 구분 | 정의 | 현재 상태 |
|------|------|----------|
| **Strong AI / AGI** | 인간 수준의 일반 지능 | **아직 없음** |
| **Weak AI / Narrow AI** | 특정 작업만 잘하는 AI | 현재 모든 AI 시스템 |

> 💡 ChatGPT도 **Narrow AI**다. 글 잘 쓰지만 운전 못 함.

#### 1.2 ANI / AGI / ASI

```
ANI (Artificial Narrow Intelligence) — 현재
  ↓ ?
AGI (Artificial General Intelligence) — 가상 (인간 수준)
  ↓ ?
ASI (Artificial Super Intelligence) — 미래 (인간 초월)
```

### 2. ML 알고리즘 분류 — 본격 영문 용어

#### 2.1 학습 패러다임

| 학습 방식 | 영어 | 예시 알고리즘 |
|----------|------|--------------|
| 지도학습 | Supervised Learning | Regression, Classification |
| 비지도학습 | Unsupervised Learning | Clustering, Dimension Reduction |
| 반지도학습 | Semi-supervised | Label propagation |
| 자기지도학습 | Self-supervised | LLM 사전학습 |
| 강화학습 | Reinforcement Learning (RL) | DQN, PPO, RLHF |
| 전이학습 | Transfer Learning | Fine-tuning |
| 메타학습 | Meta-Learning | MAML |
| 연합학습 | Federated Learning | 의료/금융 데이터 |
| 능동학습 | Active Learning | 라벨링 비용 절감 |

#### 2.2 모델 아키텍처

| 아키텍처 | 영어 | 주 사용처 |
|---------|------|---------|
| 선형 모델 | Linear Models (OLS, Ridge, Lasso) | 신용평가 baseline |
| 트리 기반 | Tree-Based (Random Forest, XGBoost, LightGBM) | 정형 데이터, 표 |
| 신경망 | Neural Networks (FFN, CNN, RNN, Transformer) | 비정형 데이터 |
| 그래프 신경망 | Graph Neural Networks (GNN, GraphSAGE) | 사기 탐지 |
| 베이지안 | Bayesian (BNN, Gaussian Process) | 불확실성 정량화 |
| 앙상블 | Ensemble (Bagging, Boosting, Stacking) | 거의 모든 곳 |

### 3. DL 핵심 아키텍처 — 4가지 진화

<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">DL 아키텍처 진화 — 각각 푸는 문제가 다르다</text>
  <g font-family="Noto Sans KR,sans-serif">
    <!-- MLP -->
    <rect x="30" y="60" width="160" height="100" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="110" y="83" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">① MLP / FFN</text>
    <text x="110" y="102" text-anchor="middle" font-size="10" fill="#1c1917">기본 신경망</text>
    <text x="110" y="118" text-anchor="middle" font-size="10" fill="#57534e">정형 데이터</text>
    <text x="110" y="135" text-anchor="middle" font-size="10" fill="#57534e">표·테이블</text>
    <text x="110" y="152" text-anchor="middle" font-size="10" font-style="italic" fill="#a8a29e">1986~</text>
    <!-- CNN -->
    <rect x="200" y="60" width="160" height="100" rx="8" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="280" y="83" text-anchor="middle" font-size="13" font-weight="700" fill="#5a7a96">② CNN</text>
    <text x="280" y="102" text-anchor="middle" font-size="10" fill="#1c1917">합성곱 신경망</text>
    <text x="280" y="118" text-anchor="middle" font-size="10" fill="#57534e">이미지</text>
    <text x="280" y="135" text-anchor="middle" font-size="10" fill="#57534e">신분증 OCR, 차트</text>
    <text x="280" y="152" text-anchor="middle" font-size="10" font-style="italic" fill="#a8a29e">1989~, AlexNet 2012</text>
    <!-- RNN / LSTM -->
    <rect x="370" y="60" width="160" height="100" rx="8" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="450" y="83" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">③ RNN / LSTM</text>
    <text x="450" y="102" text-anchor="middle" font-size="10" fill="#1c1917">순환 신경망</text>
    <text x="450" y="118" text-anchor="middle" font-size="10" fill="#57534e">시계열</text>
    <text x="450" y="135" text-anchor="middle" font-size="10" fill="#57534e">주가, 거래 시퀀스</text>
    <text x="450" y="152" text-anchor="middle" font-size="10" font-style="italic" fill="#a8a29e">1997~ (LSTM)</text>
    <!-- Transformer -->
    <rect x="540" y="60" width="160" height="100" rx="8" fill="#f5e6f0" stroke="#7a6a9a"/>
    <text x="620" y="83" text-anchor="middle" font-size="13" font-weight="700" fill="#7a6a9a">④ Transformer</text>
    <text x="620" y="102" text-anchor="middle" font-size="10" fill="#1c1917">Attention 메커니즘</text>
    <text x="620" y="118" text-anchor="middle" font-size="10" fill="#57534e">자연어, 멀티모달</text>
    <text x="620" y="135" text-anchor="middle" font-size="10" fill="#57534e">ChatGPT, Claude</text>
    <text x="620" y="152" text-anchor="middle" font-size="10" font-style="italic" fill="#a8a29e">2017~</text>
    <!-- Other -->
    <rect x="30" y="180" width="320" height="100" rx="8" fill="#fef9e7" stroke="#8a6d2c"/>
    <text x="190" y="203" text-anchor="middle" font-size="13" font-weight="700" fill="#8a6d2c">⑤ 특수 아키텍처</text>
    <text x="190" y="222" text-anchor="middle" font-size="10" fill="#1c1917">GAN, VAE, Diffusion → 생성</text>
    <text x="190" y="238" text-anchor="middle" font-size="10" fill="#1c1917">GNN → 그래프 (사기 탐지)</text>
    <text x="190" y="254" text-anchor="middle" font-size="10" fill="#1c1917">Mamba / State Space → 긴 시퀀스</text>
    <text x="190" y="272" text-anchor="middle" font-size="10" fill="#1c1917">Neural ODE → 연속 시계열</text>
    <!-- This book mapping -->
    <rect x="370" y="180" width="330" height="100" rx="8" fill="#1c1917" stroke="#1c1917"/>
    <text x="535" y="203" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">이 책에 등장하는 것</text>
    <text x="535" y="222" text-anchor="middle" font-size="10" fill="#fff">Ch2: RNN/LSTM (실습 3), MLP</text>
    <text x="535" y="238" text-anchor="middle" font-size="10" fill="#fff">Ch3: 주로 Tree (XGBoost), LR</text>
    <text x="535" y="254" text-anchor="middle" font-size="10" fill="#fff">Ch4: Random Forest + GNN (NetworkX)</text>
    <text x="535" y="272" text-anchor="middle" font-size="10" fill="#fff">Ch6: Transformer (LLM)</text>
  </g>
</svg>

### 4. 책 §1.3의 한계 5가지

#### 한계 ①: GenAI/LLM 정의 부재
책 §1.3은 AI/ML/DL 3개만 정의하고 끝난다. **Ch6에서 GenAI를 본격적으로 다루는데, §1.3에 정의가 없어서 혼란**.

#### 한계 ②: 데이터 과학과 ML의 구분 모호
"데이터 과학자"라는 직무가 등장하지만 ML과 어떻게 다른지 안 짚어줌. → 위 [중급]에서 보충.

#### 한계 ③: 학습 방식(지도/비지도/강화) 미언급
이건 ML의 가장 기본 분류인데 §1.3에 없음. → Ch3, Ch4, Ch2에서 산발적으로 등장.

#### 한계 ④: NVIDIA 그림(그림 1-2)의 출처와 한계
"AI 안에 ML, 그 안에 DL"이라는 동심원은 **NVIDIA가 마케팅용으로 만든 도해**. 학계에선:
- ML ⊂ AI 는 맞음
- DL ⊂ ML 도 맞음
- 그런데 **GenAI ⊂ DL** 이 빠짐
- **데이터 과학**과의 관계도 빠짐

#### 한계 ⑤: 한국 AI 시장 통계 출처의 약점
표 1-1 "국내 AI 시장 규모"의 출처가 **한국신용정보원**인데, 이 기관은 신용정보 전문이라 AI 시장 통계의 권위가 약함. **삼정KPMG, 정보통신정책연구원(KISDI), IDC** 등이 더 권위 있는 출처.

> 💬 위 5가지는 §1.3의 분량(2쪽) 안에서 다루기 어려웠을 것. 해설집이 채우는 부분.

### 5. AI 영문 약어 50선 — 금융 AI 자료 읽을 때 필요한 것

#### 5.1 학습 방식
- ML (Machine Learning)
- DL (Deep Learning)
- RL (Reinforcement Learning)
- SL (Supervised Learning)
- UL (Unsupervised Learning)
- SSL (Self-Supervised Learning)
- RLHF (Reinforcement Learning from Human Feedback)

#### 5.2 모델·아키텍처
- NN (Neural Network)
- MLP (Multi-Layer Perceptron)
- FFN (Feed-Forward Network)
- CNN (Convolutional NN)
- RNN (Recurrent NN)
- LSTM (Long Short-Term Memory)
- GRU (Gated Recurrent Unit)
- GNN (Graph Neural Network)
- GAT (Graph Attention Network)
- GCN (Graph Convolutional Network)
- VAE (Variational Autoencoder)
- GAN (Generative Adversarial Network)
- LLM (Large Language Model)
- MoE (Mixture of Experts)

#### 5.3 평가 지표
- AUC (Area Under Curve)
- ROC (Receiver Operating Characteristic)
- PR (Precision-Recall)
- F1 Score
- MAE (Mean Absolute Error)
- MSE / RMSE
- KS (Kolmogorov-Smirnov)
- Gini coefficient
- IV (Information Value) — 신용평가
- WoE (Weight of Evidence) — 신용평가

#### 5.4 데이터·기법
- EDA (Exploratory Data Analysis)
- ETL (Extract, Transform, Load)
- ELT (Extract, Load, Transform)
- SMOTE (Synthetic Minority Over-sampling)
- PCA (Principal Component Analysis)
- t-SNE / UMAP
- TF-IDF

#### 5.5 GenAI 시대
- LLM (Large Language Model)
- LMM (Large Multimodal Model)
- VLM (Vision-Language Model)
- RAG (Retrieval-Augmented Generation)
- CoT (Chain of Thought)
- ICL (In-Context Learning)
- FT (Fine-Tuning)
- PEFT (Parameter-Efficient Fine-Tuning)
- LoRA (Low-Rank Adaptation)
- RAFT (Retrieval-Augmented Fine-Tuning)
- SFT (Supervised Fine-Tuning)
- DPO (Direct Preference Optimization)

#### 5.6 운영
- MLOps (ML Operations)
- LLMOps (LLM Operations)
- AIOps (AI for IT Operations)
- DataOps
- CI/CD (Continuous Integration/Deployment)

---

## 🟣 [전공자] — 1차 자료와 수식

### 1. AI 정의의 학술적 출처

#### 1.1 Russell & Norvig (1995) — 4가지 정의

표준 교과서 *Artificial Intelligence: A Modern Approach* 가 제시한 AI 정의 분류:

| | 인간처럼 (Human-like) | 합리적으로 (Rational) |
|---|---|---|
| **사고 (Thinking)** | Thinking Humanly | Thinking Rationally |
| **행동 (Acting)** | Acting Humanly | Acting Rationally |

대부분의 현대 AI 시스템은 **"Acting Rationally"** — 합리적인 결과를 얻는 데 집중.

> 📄 Russell, S., & Norvig, P. (2021). *Artificial Intelligence: A Modern Approach* (4th ed.). Pearson.

#### 1.2 Turing (1950) — Imitation Game

> "*I propose to consider the question, 'Can machines think?'*"
> — Turing, A. M. (1950). Computing machinery and intelligence. *Mind*.

**Turing Test**: 인간이 대화 상대가 기계인지 사람인지 구별 못 하면 → 그 기계는 "지능적"이라 할 수 있다.

> 2014년 챗봇 "Eugene Goostman" 이 33% 심사위원을 속여 Turing Test 일부 통과 주장.
> 2023년 GPT-4는 사실상 통과 — 그러나 "지능"의 정의가 다시 논쟁 중.

### 2. ML의 통계학적 토대

#### 2.1 PAC Learning (Valiant, 1984)

**Probably Approximately Correct** 학습 이론. ML이 "왜 작동하는가"의 학술적 정당성.

> 📄 Valiant, L. G. (1984). A theory of the learnable. *Communications of the ACM*, 27(11), 1134–1142.

#### 2.2 VC Dimension (Vapnik-Chervonenkis)

모델의 **표현력(capacity)** 을 측정하는 지표. 너무 높으면 과적합(overfitting).

$$ \text{Generalization Error} \leq \text{Training Error} + O\left(\sqrt{\frac{VC + \log(1/\delta)}{n}}\right) $$

> 📄 Vapnik, V. N., & Chervonenkis, A. Y. (1971). On the uniform convergence of relative frequencies of events to their probabilities. *Theory of Probability and Its Applications*.

#### 2.3 No Free Lunch Theorem (Wolpert, 1996)

**"모든 문제에 최고인 알고리즘은 없다"** — 문제마다 최적 알고리즘이 다름.

→ 그래서 신용평가에는 XGBoost가, NLP엔 Transformer가 좋은 식.

> 📄 Wolpert, D. H. (1996). The lack of a priori distinctions between learning algorithms. *Neural Computation*, 8(7), 1341–1390.

### 🟣 [전공자 심화] — PAC Learning / VC 이론의 한계와 후속 연구

#### 원논문 한계 (Valiant 1984, Vapnik-Chervonenkis 1971)

- **분포 독립(distribution-free) 가정**: PAC는 임의의 데이터 분포에 대해 최악 경계만 제공. 실제 금융 데이터의 자연스러운 구조(저차원 manifold, 그룹별 군집)를 활용하지 못함.
- **상한이 지나치게 느슨**: VC bound는 신경망처럼 파라미터 수가 데이터 수를 훨씬 초과하는 모델에서는 사실상 vacuous (예: $VC = O(\text{파라미터 수})$ 대입 시 generalization 보장이 의미 없음).
- **이산적 가설 클래스 가정**: PAC는 0-1 loss 기반 binary 분류에 초점. 회귀, 다중 클래스, 시퀀스 예측은 확장 필요.
- **계산 복잡도 미고려**: PAC는 표본 복잡도만 다루고 학습 알고리즘의 다항 시간 실행 가능성(efficient PAC)은 별도 가정.
- **잡음(label noise) 모델 단순화**: Valiant 원본은 노이즈가 없는 realizable case 가정. 실 금융 데이터의 라벨 잡음(차지백 지연, mislabeling)은 agnostic PAC로 별도 확장이 필요.

#### 비판 문헌

- **Zhang, C., Bengio, S., Hardt, M., Recht, B., & Vinyals, O. (2017/2021). Understanding deep learning (still) requires rethinking generalization. *Communications of the ACM*, 64(3), 107–115.** — DNN은 무작위 라벨도 0% training error로 학습 가능하지만 실제 데이터에서는 일반화함 → 고전 VC/Rademacher 경계로 설명 불가. arXiv:1611.03530
- **Belkin, M., Hsu, D., Ma, S., & Mandal, S. (2019). Reconciling modern machine learning practice and the classical bias–variance trade-off. *PNAS*, 116(32), 15849–15854.** — "Double descent" 현상: 모델 capacity가 보간 임계점을 넘으면 test error가 다시 감소. 전통적 U자형 trade-off가 깨짐.
- **Nagarajan, V., & Kolter, J. Z. (2019). Uniform convergence may be unable to explain generalization in deep learning. *NeurIPS 2019*.** — Uniform convergence 기반 어떤 bound도 DNN의 실제 generalization gap을 설명할 수 없음을 보임.

#### 후속 연구 동향 (2020~)

- **PAC-Bayes 부활**: Dziugaite, G. K., & Roy, D. M. (2017). *Computing nonvacuous generalization bounds for deep (stochastic) neural networks with many more parameters than training data.* UAI 2017. arXiv:1703.11008 — DNN에 적용 가능한 non-vacuous bound 최초 사례.
- **Rademacher complexity 기반 학습 이론**: Bartlett, P. L., Foster, D. J., & Telgarsky, M. J. (2017). *Spectrally-normalized margin bounds for neural networks.* NeurIPS 2017. arXiv:1706.08498
- **Neural Tangent Kernel (NTK)**: Jacot, A., Gabriel, F., & Hongler, C. (2018). *Neural tangent kernel: Convergence and generalization in neural networks.* NeurIPS 2018. arXiv:1806.07572 — 무한 폭 신경망의 학습을 커널 회귀로 정확히 분석.
- **Implicit bias / regularization**: Soudry, D., Hoffer, E., Nacson, M. S., Gunasekar, S., & Srebro, N. (2018). *The implicit bias of gradient descent on separable data.* JMLR 19(1). arXiv:1710.10345

#### 한국 적용 시 주의점

- 금융 분류기 검증 보고서에 "VC dimension이 작으니 안전" 같은 진술은 학술적으로 약함 → Rademacher / PAC-Bayes / 실측 generalization gap을 함께 제시.
- 신용평가용 XGBoost·LightGBM은 leaf 수가 곧 capacity → grid search 시 leaf 수와 OOS PR-AUC를 함께 보고하는 것이 SR 11-7 conceptual soundness 요건에 더 부합.
- DNN을 금융에 적용할 때 "더 큰 모델 = 더 나은 일반화"라는 double descent 직관을 그대로 옮기는 것은 위험. 데이터 잡음, 라벨 지연이 있는 환경에서는 여전히 capacity-control이 안전.

### 3. DL 혁명의 핵심 논문 5편

#### 3.1 LeCun et al. (1989) — CNN 원형

> 📄 LeCun, Y., Boser, B., Denker, J. S., et al. (1989). Backpropagation applied to handwritten zip code recognition. *Neural Computation*, 1(4), 541–551.

손글씨 우편번호 인식 — 미국 우편 시스템에 실제 도입.

#### 3.2 Hochreiter & Schmidhuber (1997) — LSTM

> 📄 Hochreiter, S., & Schmidhuber, J. (1997). Long short-term memory. *Neural Computation*, 9(8), 1735–1780.

RNN의 vanishing gradient 문제 해결. 시계열 분석의 표준이 됨.

#### 3.3 Krizhevsky, Sutskever, & Hinton (2012) — AlexNet

> 📄 Krizhevsky, A., Sutskever, I., & Hinton, G. E. (2012). ImageNet classification with deep convolutional neural networks. *NeurIPS*, 25.

ImageNet 우승 — DL 혁명의 시작점.

#### 3.4 Vaswani et al. (2017) — Transformer

> 📄 Vaswani, A., Shazeer, N., Parmar, N., et al. (2017). Attention is all you need. *NeurIPS*, 30.

"Attention Is All You Need" — 현재 모든 LLM의 기반.

#### 3.5 Brown et al. (2020) — GPT-3

> 📄 Brown, T. B., Mann, B., Ryder, N., et al. (2020). Language models are few-shot learners. *NeurIPS*, 33.

In-context learning의 발견. LLM 시대 개막.

### 4. LLM의 수학적 본질 — 다음 토큰 예측

LLM이 하는 일은 단순:

$$ P(w_t \mid w_1, w_2, \dots, w_{t-1}) $$

"이전 단어들을 봤을 때, 다음 단어가 무엇일 확률이 가장 높은가?"

**Loss**: Cross-entropy
$$ \mathcal{L} = -\sum_{t} \log P(w_t \mid w_{<t}) $$

이 단순한 목표를 **수조 개 토큰** 으로 학습하면 → 추론·요약·코딩까지 가능해진다.

> "*Just predicting the next token, but very well*"
> — Ilya Sutskever (OpenAI 공동창업자)

### 5. 한국 AI 시장 정량 자료 (책 표 1-1 대안 출처)

책의 한국신용정보원 출처보다 더 권위 있는 자료:

#### 5.1 IDC Korea (2024)
- 국내 AI SW 시장 규모: 2024년 **1조 4,448억원** (책 표는 1.5조)
- 연평균 성장률 (2023-2028): **22.0%**
- 산업별 비중: 제조 22%, 금융 17%, 공공 15%

#### 5.2 한국지능정보사회진흥원 (NIA, 2024)
- AI 도입 기업 비율: 28.4% (2023)
- 금융업 도입: 41.2% (전 산업 1위)

#### 5.3 BCG (2023) — 글로벌 비교
> "*By 2030, generative AI alone could increase the productivity of banking professionals by 30%.*"
> — Boston Consulting Group (2023). *Generative AI in the Finance Function of the Future*.

#### 5.4 PwC (2017, 2024)
- 2030년까지 AI의 글로벌 GDP 기여: **$15.7조** (2017 원본)
- 금융업 GDP 기여: $1.1조 (전 산업 3위)

> 📄 PwC. (2017). *Sizing the prize: What's the real value of AI for your business?*
> 📄 IDC Korea. (2024). *Korea AI Solutions Forecast*.

### 6. NVIDIA의 AI/ML/DL 도해 — 원본 검증

책 그림 1-2의 NVIDIA 출처는:

> 📄 NVIDIA Developer Blog. (2016). "What's the Difference Between Artificial Intelligence, Machine Learning, and Deep Learning?"
> https://blogs.nvidia.com/blog/whats-difference-artificial-intelligence-machine-learning-deep-learning-ai/

이 도해의 학술적 정확성:
- ✅ DL ⊂ ML ⊂ AI: 맞음
- ⚠ 그러나 ML ⊄ DL 의 예외 케이스 (예: hybrid systems)
- ⚠ Symbolic AI도 AI지만 그림에선 무시
- ⚠ 시간 축 (1950s → 2010s)이 단순화됨

**더 정확한 도해** (Sebastian Raschka, 2023):

```
AI
├── Symbolic AI
├── Machine Learning
│   ├── Classical ML (트리, SVM, 등)
│   └── Deep Learning
│       ├── Discriminative (분류·회귀)
│       └── Generative
│           ├── GAN, VAE, Diffusion
│           └── Autoregressive (LLM)
└── Hybrid Systems
```

---

## 📚 책에는 없지만 알면 좋은 것

### 🔍 보충 1 — Hype Cycle과 AI 겨울

#### Gartner Hype Cycle

```
기대   ▲
       |     ╱⎺⎺⎺╲
       |    ╱     ╲___           ___________
       |   ╱           ⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻
       |  ╱
       |─
       └────────────────────────────▶ 시간
       (1)    (2)     (3)     (4)     (5)
   촉발  과대기대  환멸의   계몽의  생산성
   기술  정점      골짜기   비탈    안정기
```

#### AI 겨울 (AI Winter)
역사상 2번 발생:
- **1차 (1974-1980)**: 초기 기대 과잉 후 자금 끊김
- **2차 (1987-1993)**: 전문가시스템 실패

#### 현재 (2024) 위치
- **GenAI**: 2024년 환멸의 골짜기 진입 추정
- **전통 ML/DL**: 생산성 안정기

> 💬 "AI 겨울이 또 올까?" — 핵심은 **실제 수익 창출** 여부.

### 🔍 보충 2 — Stochastic Parrot 논쟁

#### Bender et al. (2021)
> "*On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?*"

LLM이 진짜로 "이해"하는가, 아니면 패턴만 흉내내는 "확률적 앵무새"인가?

→ AI 윤리·해석가능성 논쟁의 핵심.

#### 의미
금융 AI에서 중요: **LLM이 신용평가 결정을 못 한다** (블랙박스, 차별 가능성). → 규제기관이 LLM의 금융 의사결정 활용에 신중.

> 📄 Bender, E. M., Gebru, T., et al. (2021). On the dangers of stochastic parrots. *FAccT '21*.

### 🔍 보충 3 — Foundation Model 개념

#### 정의 (Stanford CRFM, 2021)
> "*A model trained on broad data ... that can be adapted to a wide range of downstream tasks.*"

GPT, Claude, Gemini가 **foundation model**. 한 모델로 다양한 작업 가능.

#### 금융에서의 의미
- 전통: 신용평가 모델, 사기탐지 모델, 챗봇 — 각각 따로 학습
- Foundation Model: 한 모델로 여러 작업 — **회사 통합 LLM** 트렌드

> 📄 Bommasani, R., et al. (2021). On the opportunities and risks of foundation models. arXiv:2108.07258.

### 🔍 보충 4 — AI 거버넌스 표준

| 표준 | 출처 | 핵심 |
|------|------|------|
| **NIST AI RMF** | 미국 표준기술원 | 위험 관리 프레임워크 |
| **EU AI Act** | EU (2024 시행) | 위험 등급별 규제 |
| **ISO/IEC 42001** | 국제표준 | AI 관리시스템 |
| **금융위 AI 가이드라인** | 한국 (2021) | 금융 AI 특화 |

금융 AI는 **EU AI Act에서 "High-Risk"** 로 분류 → 추가 의무.

### 🔍 보충 5 — LLM 평가 지표

LLM 성능 비교 시 보는 지표:

| 지표 | 측정 | 예시 |
|------|------|------|
| MMLU | 일반 지식 | GPT-4: 86.4% |
| HumanEval | 코딩 능력 | GPT-4: 67% |
| GSM8K | 수학 | GPT-4: 92% |
| HellaSwag | 상식 추론 | GPT-4: 95% |
| TruthfulQA | 진실성 | GPT-4: 59% |
| FinBen | **금융 특화** | GPT-4: 65~80% |

> 📄 Chen, Y., et al. (2023). FinBen: A holistic financial benchmark.

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. AI랑 ML이 같은 말 아닌가?

**A.** 아니다. **포함 관계**.

- **AI ⊃ ML**: ML은 AI의 한 종류.
- AI 안에는 ML 말고도 **규칙 기반 시스템**, **전문가 시스템** 등이 있음.

예시:
- 은행 대출 심사 IF-ELSE 규칙 → AI지만 ML 아님
- 신용평가 XGBoost 모델 → ML이고 AI도 됨

### Q2. 딥러닝이 머신러닝보다 항상 좋은 건가?

**A.** **데이터가 충분히 많고 비정형일 때만**.

| 데이터 상황 | 추천 |
|----------|------|
| **정형 데이터, 1만 행** | Tree (XGBoost, LightGBM) — DL 별로 |
| **정형 데이터, 100만 행** | Tree 또는 DL — 비슷 |
| **이미지, 음성** | DL (CNN) — Tree 안 됨 |
| **자연어** | DL (Transformer) — Tree 안 됨 |
| **시계열** | DL (LSTM) 또는 Tree (XGBoost) — 둘 다 가능 |

> 💡 **금융 데이터는 대부분 정형**. 그래서 신용평가/사기탐지에서 **XGBoost가 DL을 이긴다** (Ch3, Ch4 실습 결과).

### Q3. ChatGPT가 금융 AI인가?

**A.** **LLM은 금융 AI의 도구**지, 금융 AI 그 자체는 아니다.

- **신용평가 AI**: ChatGPT 안 씀. XGBoost 씀.
- **사기탐지 AI**: ChatGPT 안 씀. Random Forest 씀.
- **고객 상담 챗봇**: **ChatGPT/Claude 쓸 수 있음**.
- **문서 분석**: **ChatGPT/Claude + RAG**.

이 책 6개 챕터 중 **Ch6만 LLM이 주역**.

### Q4. 생성형 AI랑 일반 AI가 어떻게 다른가?

**A.**

| | 판별형 (Discriminative) | 생성형 (Generative) |
|---|---|---|
| 목표 | 분류·예측 | 새로운 데이터 생성 |
| 출력 | 라벨 (스팸/정상) | 데이터 (글, 이미지) |
| 학습 | $P(y \mid x)$ | $P(x)$ 또는 $P(x \mid y)$ |
| 예시 | 신용평가, 사기탐지 | ChatGPT, DALL-E |
| 금융 활용 | Ch2,3,4 | Ch6 |

### Q5. RAG가 그렇게 중요한가?

**A.** **금융 AI 도입의 거의 모든 LLM 응용에 RAG가 들어간다**. 이유:

- LLM은 **회사 내부 문서 모름**
- 금융은 **규제 문서·약관·계약서** 가 핵심
- **할루시네이션** 위험 → RAG로 출처 확인

→ Ch6에서 자세히.

### Q6. AGI는 언제 오나?

**A.** 누구도 모름. 추정:

- **DeepMind 데미스 하사비스** (2023): "10년 내"
- **Yann LeCun (Meta)**: "수십 년 더 필요"
- **샘 알트만 (OpenAI)**: "곧 (수년 내)"

→ 너무 큰 불확실성. **금융 실무에선 ANI 활용에 집중**.

### Q7. 강화학습이 금융에 정말 쓰이나?

**A.** **알고리즘 트레이딩**에서 활발히. 실제 사례:

- JPMorgan: LOXM — 주문 집행 최적화 (Deep RL 기반, 약자 정식 풀이 비공개)
- Citadel Securities: RL 기반 시장조성
- Renaissance: 비공개 (전설의 헤지펀드)

→ Ch2 실습 3에서 LSTM 기반 트레이딩 다룸 (RL은 직접 안 다룸).

---

## 🎯 이 절에서 가져갈 핵심 7가지

1. **AI ⊃ ML ⊃ DL ⊃ GenAI ⊃ LLM** — 포함 관계, 같은 말 아님.
2. **데이터 과학 ≠ ML**. 데이터 과학은 분석·의사결정, ML은 모델 운영.
3. ML 학습 방식 3가지: **지도 / 비지도 / 강화** — 이 책 챕터별로 다름.
4. DL 아키텍처 4가지: **MLP / CNN / RNN / Transformer** — 데이터 종류에 따라 선택.
5. **2017 Transformer**가 현재 LLM 시대의 전환점.
6. **GenAI 시대 핵심 용어**: RAG, Agent, Fine-tuning, LoRA, RLHF.
7. **금융 AI ≠ ChatGPT**. 금융 데이터 대부분은 정형 → Tree 모델이 여전히 강세.

---

## 📖 더 읽을거리

### AI 개론 (한국어)
- 임희석, 고려대. (2022). *데이터 분석을 위한 인공지능*. 한빛아카데미.
- 김기현. (2021). *김기현의 자연어 처리 딥러닝 캠프*. 한빛미디어.

### AI 개론 (영어)
- Russell, S., & Norvig, P. (2021). *Artificial Intelligence: A Modern Approach* (4th ed.). Pearson. — 표준 교과서.
- Goodfellow, I., Bengio, Y., & Courville, A. (2016). *Deep Learning*. MIT Press. — 무료 PDF.

### LLM 시대
- Karpathy, A. (2023). *Let's build GPT: from scratch, in code*. YouTube. — 무료.
- Stanford CS224N (NLP), CS231N (CV), CS224W (Graph) — 무료 강의.
- Anthropic. *Claude Documentation*. — RAG, Tool Use 가이드.

### 한국 AI 시장
- IDC Korea. *Korea AI Solutions Forecast* (매년).
- 한국지능정보사회진흥원 (NIA). *국가 AI 통계 보고서*.
- KISDI. *AI 산업 동향*.

### 1차 자료 (논문)
- Vaswani, A., et al. (2017). Attention is all you need. *NeurIPS*.
- Brown, T. B., et al. (2020). Language models are few-shot learners. *NeurIPS*.
- Krizhevsky, A., Sutskever, I., & Hinton, G. E. (2012). ImageNet classification with deep CNN. *NeurIPS*.
- LeCun, Y., Bengio, Y., & Hinton, G. (2015). Deep learning. *Nature*, 521(7553), 436–444.

### 금융 AI 특화
- López de Prado, M. (2018). *Advances in Financial Machine Learning*. Wiley.
- Dixon, M. F., Halperin, I., & Bilokon, P. (2020). *Machine Learning in Finance*. Springer. — 무료 PDF.

---

> **다음 절 예고** — §1.4 금융과 AI
> 본 절에서 정의한 AI 용어들이 **한국 금융 시장에서 실제로 얼마나 쓰이는지** 정량 통계로 살펴본다. 책 표 1-1의 정확한 해석과 보충.
