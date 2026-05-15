# 08 이론적 계보

---

## 이론적 조상

### 조상 1: Towards Monosemanticity — SAE의 기원
**Bricken, Templeton, et al. (Anthropic, Oct 2023)**  
URL: transformer-circuits.pub/2023/monosemantic-features

SFC의 가장 직접적인 부모 논문. 512개 MLP 뉴런 → 4096개 모노시맨틱 특징으로 분해하는 SAE를 소개하고, 이 특징들이 실제로 해석 가능한 개념(DNA 서열, 법률 언어, 히브리 문자, HTTP 요청 등)에 대응함을 보였다.

**SFC와의 연결**: SFC는 Monosemanticity가 발견한 특징들을 노드로 삼아 회로를 구성한다. SAE 없이는 SFC도 없다. 동시에 SFC는 Monosemanticity의 한계 — "특징들이 어떻게 연결되는가"를 묻지 않았다 — 를 채운다.

**남긴 질문**: "특징들의 인과 그래프를 어떻게 구성하는가?" → SFC가 답한다.

---

### 조상 2: ACDC — 자동화 회로 발견의 선구자
**Conmy, Mavor-Parker, Lynch, Heimersheim, Garriga-Alonso (NeurIPS 2023 Spotlight)**  
arXiv:2304.14997 — 2026-05-11 해체 완료

어텐션 헤드·MLP 단위에서 자동으로 회로를 발견하는 역방향 위상 정렬 알고리즘을 도입했다. 핵심 아이디어: 불필요한 엣지를 corrupted 분포에서 ablation하며 제거.

**SFC와의 연결**: SFC는 ACDC의 "회로를 자동으로 찾는다"는 정신을 이어받되, 세 가지를 개선한다: (1) 노드 단위를 어텐션 헤드 → SAE 특징으로 세분화; (2) 단일 τ로 모든 엣지를 결정하는 것 → IE 값을 엣지 가중치로 그대로 유지; (3) 충실도만 → 충실도 + 완전도 이중 평가.

**SFC가 이긴 영역**: 해석 가능성. ACDC의 노드(어텐션 헤드)는 "L2H5가 무엇을 하는가"를 설명하기 어렵지만, SFC의 노드("복수 명사 감지 특징")는 바로 이름을 붙일 수 있다. **SFC가 뒤처지는 영역**: 이론적 보장. ACDC는 역방향 위상 정렬로 최적성에 가까운 보장을 주지만, SFC의 IE 임계값 기반 선택은 유사한 이론적 보장이 없다.

---

### 조상 3: IOI 회로 — 메커니즘 매핑의 표준
**Wang, Variengien, Conmy, Shlegeris, Steinhardt (ICLR 2023)**  
arXiv:2211.00593

"Mary and John went to the store, Mary gave a book to ___" 과제에서 GPT-2 Small의 IOI(Indirect Object Identification) 회로를 완전히 매핑. 활성화 패칭(activation patching)을 이용한 인과 회로 발견의 방법론적 표준.

**SFC와의 연결**: SFC의 IE 계산은 IOI 논문의 활성화 패칭을 특징 수준으로 일반화한 것이다. 또한 IOI 회로의 발견 방법(특정 head가 특정 위치에 주목하는가를 패칭으로 확인)은 SFC에서 "특정 SAE 특징이 특정 다른 특징에 기여하는가"로 대응한다.

---

### 조상 4: Integrated Gradients — 어트리뷰션의 이론적 기반
**Sundararajan, Taly, Yan (ICML 2017)**  
arXiv:1703.01365

신경망 입력 변수에 대한 어트리뷰션 점수를 axiomatically 정의. "dummy" 공리(기여 없는 입력의 점수는 0)와 "linearity" 공리(선형 함수에서 gradient와 일치)를 만족하는 통합 기울기 방법을 도입.

**SFC와의 연결**: SFC의 IG 기반 IE 근사는 Sundararajan 2017의 통합 기울기를 활성화 공간에 적용한 것이다. 이론적 보장이 있는 어트리뷰션 방법을 채택함으로써, SFC의 IE 측정에 공리적 근거를 부여한다.

---

## 평행 연구 (비슷한 시기, 다른 접근)

### 평행 1: TransCoders (Dunefsky et al. 2024)
MLP 레이어를 SAE와 유사한 "transcoder"로 근사하되, 입력→출력 매핑을 직접 해석 가능한 형태로 분해. SFC가 사후(post-hoc) SAE를 쓰는 것과 달리, transcoder는 MLP 자체를 대체한다.

**왜 SFC가 이겼는가**: SFC는 기존 SAE와 기존 모델을 그대로 사용하므로, 추가 학습 없이 어떤 언어 모델에도 적용 가능하다. Transcoder는 추가 구조를 도입해야 한다.

### 평행 2: Scaling Monosemanticity / Claude SAE (Templeton et al. 2024 — Anthropic)
Monosemanticity의 후속으로, 더 큰 모델(Claude 3 Sonnet 수준)에 SAE를 적용. 수백만 개의 특징을 발견하고 "Golden Gate Bridge 특징", "감사 특징" 등의 해석 가능한 특징들을 공개.

**SFC와의 관계**: 이 논문은 SFC와 직접 경쟁하지 않는다 — SFC는 "회로"에 집중하고 이 논문은 "특징의 스케일"에 집중. 상호 보완적이다. 그러나 큰 모델의 SAE 특징들로 SFC 방법을 적용하면 어떤 결과가 나오는가가 자연스러운 후속 질문이 된다.

---

## 후손 예측 (이 논문에서 파생될 수 있는 방향)

### 후손 1: 대형 모델로의 SFC 확장
"Scaling Sparse Feature Circuit Finding to Gemma 9B" (LessWrong 포스트 — 제목에서 확인, 2024-2025)가 실제로 등장했다. Pythia-70M에서 Gemma 9B로 방법론을 확장. SFC의 자연스러운 다음 단계.

### 후손 2: SHIFT의 자동화 버전
현재 SHIFT는 인간이 "어떤 특징이 무관한가"를 판단한다. 이를 자동화(자동 해석가능성 점수 + 인과 영향 측정을 결합하여 자동으로 "과제 무관" 특징 식별)하면 실용적 debiasing 도구가 된다.

### 후손 3: 시계열 Transformer에 SAE + SFC 적용
언어 모델에서 검증된 SAE 특징 + 회로 접근을 시계열 예측 Transformer(PatchTST, iTransformer 등)에 적용하면, "Grokking 국면 전환 시 어떤 특징이 등장하는가"를 추적할 수 있다. 이것이 내 Grokking track과의 핵심 교차점이다 — 아직 존재하지 않는 연구 방향.
