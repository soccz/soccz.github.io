# 04. 핵심 Claim 해체

RoFormer 는 이론 claim 3 개 + 실증 claim 2 개로 나뉜다. 각 claim 을 주장·증거 위치·숨은 전제·쉬운 말 풀이 4 층으로 열어본다.

---

## Claim 1 — 상대위치 조건을 만족시키는 최소 함수 형태는 회전이다

- **주장**: attention 함수 $f_q(x_m, m)$, $f_k(x_n, n)$ 이 **∀ m, n** 에 대해 내적 $\langle f_q(x_m, m), f_k(x_n, n)\rangle$ 을 어떤 함수 $g(x_m, x_n, m-n)$ 으로 표현할 수 있으려면, 2 차원 케이스에서 $f_q$ 는 $q_m e^{i m\theta}$ (복소수 표현) 형태여야 한다. 이는 곧 회전 행렬 $R_{\Theta,m}$ 을 붙이는 것과 동치.
- **증거**: 원 논문 §3.2–3.3 (Formulation of Rotary Position Embedding). 저자는 2 차원 케이스에서 조건 $\langle f_q(x_m, m), f_k(x_n, n)\rangle = g(x_m, x_n, m-n)$ 을 놓고 (i) $f_q(x_m, 0) = q$ (경계 조건), (ii) $f_q$ 는 위치에 대해 연속적 매끄러움을 갖는다, 라는 가정 하 회전 형태로 축약된다는 유도를 제시. WebSearch verbatim 인덱스에서 이 유도 골자 (2 차원 → d 차원 블록대각) 를 재확인.
- **숨은 전제**: (i) $f_q, f_k$ 가 곱셈적 구조를 갖는다는 암묵 가정 — 덧셈 형태 (sinusoidal-style) 는 애초에 후보에서 배제. (ii) query·key 차원이 짝수 라는 구조적 가정 — 회전이 2 차원 부분공간 단위이므로 홀수차원은 정의 안 됨 (원 논문은 짝수차원 가정). (iii) 회전 주파수 스펙트럼 $\theta_i$ 를 학습 없이 sinusoidal 유산 그대로 고정한다는 hyperparameter 결정 — 유도 자체가 아니라 저자 선택.
- **쉬운 말 풀이**: "두 사람의 이야기 재미(내적)가 절대 자리(m, n)와 무관하고 서로 얼마나 떨어져 앉았는지(m−n)만으로 결정되게 하려면, 이야기 방향(벡터) 자체를 자리 번호에 비례해 회전시켜라. 두 회전이 겹치면 상대 회전만 남는다."

---

## Claim 2 — 회전 후 내적은 오직 상대위치에만 의존한다 (핵심 항등식)

- **주장**: 위치 $m$ 의 query 벡터를 $R_{\Theta,m} W_q x_m$, 위치 $n$ 의 key 벡터를 $R_{\Theta,n} W_k x_n$ 으로 정의하면,
  $$q_m^T k_n = (R_{\Theta,m} W_q x_m)^T (R_{\Theta,n} W_k x_n) = (W_q x_m)^T R_{\Theta,n-m} (W_k x_n)$$
  가 성립. 절대위치 $m, n$ 은 소거되고 상대위치 $n-m$ 만 남는다.
- **증거**: 원 논문 §3.4.1 근처의 유도. 이는 **회전 행렬의 직교성 (orthogonality)** $R^T R = I$ 및 **회전각의 가법성** $R_{\Theta,m}^T R_{\Theta,n} = R_{\Theta,n-m}$ 두 성질의 직접 귀결. WebSearch verbatim 에서 "$q_m^T k_n = q^T R_{m-n} k$" 유도 문장 재확인.
- **숨은 전제**: (i) 회전 각도가 위치의 선형 함수 $m\theta_i$ 라는 조건 — 만약 비선형 함수 였다면 회전각 가법성이 깨진다. (ii) 각 2 차원 블록의 회전은 서로 독립적으로 이루어져 블록 간 간섭이 없다는 블록대각 구조 가정. (iii) $W_q, W_k$ 는 위치 무관 — 만약 위치별 서로 다른 projection 이었다면 이 항등식이 성립 안 함.
- **쉬운 말 풀이**: "회전을 두 번 씌운 뒤 두 벡터를 곱하면 결과는 오직 '두 회전각의 차이' 만 담는다. 각각의 절대 회전각은 서로 상쇄된다. 이는 두 사람이 같은 만큼 몸을 돌린 뒤 서로 마주 보는 데 필요한 추가 회전각이, 처음 얼마나 돌아갔든 상관없이 원래 자세 차이만큼이라는 것과 같다."

---

## Claim 3 — RoPE 는 상대거리가 커질수록 감쇠하는 attention 을 자연 유도한다 (long-range decay)

- **주장**: RoPE 를 씌운 두 벡터의 내적은 상대거리 $|n-m|$ 이 커질수록 크기가 감쇠하는 경향을 갖는다. 이는 다양한 주파수 성분들이 큰 상대거리에서 위상 차이가 벌어져 상쇄 간섭 (destructive interference) 을 일으키기 때문.
- **증거**: 원 논문 §3.4.3 근처의 이론적 상한 유도 및 시각화 (도식 그래프). 저자는 랜덤 벡터 가정 하 기대값 $\mathbb{E}[q_m^T k_n]$ 이 $|n-m|$ 에 대한 감쇠 함수로 상한 지어진다고 계산 (Abel 변환·부분합 정리 계열 논증). 시각화는 상한 함수를 상대거리 축에 대해 그려 감쇠 형태를 확인.
- **숨은 전제**: (i) 랜덤 벡터 가정 — 실제 학습된 query/key 는 데이터 분포에 의존적이라 이 상한이 tight 하다는 보장 없음. (ii) 주파수 스펙트럼 $\theta_i = 10000^{-2(i-1)/d}$ 의 특정 선택 — 다른 스펙트럼 (예: 균등 선형) 이었다면 감쇠 형태가 달랐을 것. (iii) "long-range decay" 가 attention 에서 **원하는 성질** 이라는 가치 판단 — 실제로 시계열이나 코드 처럼 long-range dependency 가 필수인 도메인에서는 오히려 문제.
- **쉬운 말 풀이**: "여러 주파수의 파도 (회전 속도가 다른 여러 2차원 회전) 를 겹치면, 초반에는 서로 위상이 맞아 큰 값을 만들지만 시간이 지나면 파도들이 서로 상쇄되어 잔물결만 남는다. RoPE 는 상대 거리를 시간 축으로 삼아 이 상쇄 현상을 attention 감쇠 성질로 재활용한다."

---

## Claim 4 (실증) — RoPE 는 linear attention (Performer 계열) 과 결합 가능하고 학습 가속 효과가 있다

- **주장**: query 와 key 에 kernel feature map $\phi$ 를 씌우는 linear attention 형태 $\phi(q_m)^T \phi(k_n)$ 에서도 회전을 앞뒤로 곱해 상대위치 정보를 유지할 수 있다. Performer + RoPE 는 vanilla Performer 보다 학습 손실 수렴이 빠르다.
- **증거**: 원 논문 §3.5 (Linear Attention) + §4 실험 (Enwik8 학습 곡선 비교, 원문 Figure 근처). WebSearch 검증: "coupling RoPE with linear attention (Performer) yielded faster convergence and lower training loss" 문장 재확인.
- **숨은 전제**: (i) Performer 의 kernel approximation 이 회전 적용 후에도 상대위치 정보를 왜곡 없이 통과시킨다는 가정 — kernel feature 자체가 근사이므로 회전 적용 후 오차 분석이 필요한데 원 논문에서는 정성적 검증에 그침. (ii) "학습 손실이 낮다" 가 "최종 성능이 좋다" 로 이어진다는 가정.
- **쉬운 말 풀이**: "attention 을 커널 형태로 근사해 계산 비용을 낮춘 방식 (Performer) 에서도 위치 회전을 벡터 앞에 붙일 수 있고, 이렇게 하면 상대위치 정보를 잃지 않는다. 다른 상대위치 방식 (T5-relative bias) 은 attention 로짓에 더해지는 스칼라라 커널 곱셈 구조 안에 못 들어가지만, RoPE 는 회전 곱이므로 자연스럽게 커널 안으로 들어간다."

---

## Claim 5 (실증) — RoPE 는 여러 downstream 벤치마크에서 sinusoidal/BERT-style PE 를 상회한다

- **주장**: (i) WMT2014 En-De 번역에서 RoFormer 27.5 BLEU vs vanilla Transformer 27.3 BLEU (WebSearch verbatim). (ii) GLUE 6-task (MRPC/SST-2/QNLI/STS-B/QQP/MNLI) 에서 BERT 와 동등 혹은 상회. (iii) CAIL2019-SCM 중국 법률 텍스트 매칭에서 최대 토큰 길이 512→1024 확장 시 68.29%→69.79% 로 향상되고, RoFormer 가 WoBERT 대비 절대 +1.5% 향상.
- **증거**: 원 논문 §4 (Experiments) 각 subsection 의 표. WMT (§4.1 근처), GLUE (§4.2 근처), CAIL2019-SCM (§4.3 근처), Enwik8 character-level LM (§4.4 근처). 정확한 표 번호와 각 seed 별 소수점 값은 본문 PDF 차단으로 미확인.
- **숨은 전제**: (i) 비교 baseline 이 동등하게 튜닝됐다는 가정 — 원 논문은 baseline 을 저자가 재구현한 값인지 문헌 값 인용인지 명확한 튜닝 절차 검증이 원문 §4 세부를 봐야 확실. (ii) 벤치마크 도메인 (영어 번역·GLUE·중국 법률) 이 RoPE 의 이론적 장점 (상대거리 감쇠, 길이 확장) 을 실제 유리하게 만든다는 도메인 매칭. (iii) 512→1024 확장의 성능 향상이 RoPE 덕분이라는 인과 — 두 실험이 모델 구조도 데이터도 다르게 바뀔 수 있으므로 별도 통제 필요.
- **쉬운 말 풀이**: "회전 방식 위치 임베딩은 번역·문서 이해 시험에서 기존 방식과 동등하거나 조금 낫고, 특히 문장이 매우 길어질 때 (긴 법률 문서 처리) 이점이 도드라진다. 이는 이론적으로 예측한 '길이 확장' 이점이 실제 벤치마크에서도 관측된다는 뜻이다."

---

## Claim 요약 표

| # | 종류 | 주장 요약 | 원문 위치 | 방어력 |
|---|-----|---------|-----------|-------|
| 1 | 이론 | 상대위치 조건의 최소 해는 회전 | §3.2-3.3 | 강 (2D 케이스는 완전 유도) |
| 2 | 이론 | 회전 내적은 상대위치만 남김 | §3.4.1 | 강 (직교성·가법성으로 즉시) |
| 3 | 이론+실증 | 감쇠 성질 | §3.4.3 | 중 (랜덤 벡터 가정) |
| 4 | 실증 | Linear attention 결합 | §3.5, §4.4 | 중 (kernel 근사 오차 미분석) |
| 5 | 실증 | 벤치마크 상회 | §4.1-4.3 | 중 (표 세부 미확인) |

Claim 1·2 는 RoFormer 논문의 이론적 "심장" 이다. Claim 3-5 는 그 심장에서 파생된 성질과 실증이다. APF 관점에서 중요한 것은 Claim 1·2 (motif 형태의 이론 근거) 와 Claim 3 (감쇠가 diagonal-band motif 로 사영될 수 있다는 가설의 배후) 이다.
