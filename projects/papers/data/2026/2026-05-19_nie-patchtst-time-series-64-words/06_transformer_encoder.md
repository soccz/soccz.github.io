# 06. Transformer Encoder — Vanilla 그대로

> 본 논문이 사용한 *Transformer encoder* 의 구조. *시계열 specific 변형 없이* vanilla 그대로.

---

## 6.1 챕터 한 줄 요약

> **"Patching + Channel-Indep 외에는 *완전 vanilla Transformer encoder*. NLP 의 BERT, GPT 가 사용하는 *같은 구조*. 시계열 specific attention 변형 (Informer, Autoformer) 없음. *Simple is better*."**

---

## 6.2 Vanilla Transformer 가 뭐예요?

### 일상 비유 — *ChatGPT 의 기본 부품*

ChatGPT, BERT, GPT 같은 *모든 NLP 모델* 의 *기본 부품*. 2017년 Google 발명.

구성:
1. **Multi-head Self-Attention** (다중 헤드 자기 주의)
2. **Feed-Forward Network** (피드포워드 신경망)
3. **Layer Normalization** (층 정규화)
4. **Residual Connection** (잔차 연결)

본 논문: 이 *4 부품 그대로* 시계열 적용. *Modification 없음*.

---

## 6.3 Multi-head Self-Attention — 핵심 메커니즘

### 일상 비유

문장 "*The cat sat on the mat*" 을 이해할 때:
- "sat" 이 *어떤 단어* 와 연관? — *cat (주어), on (전치사), mat (위치)*.
- *각 단어가 다른 모든 단어* 와의 *관계* 측정.

본 논문: 시계열의 *각 patch* 가 *다른 모든 patch* 와의 *관계* 측정.

### Multi-head 의 의미

**Single head**: *한 관점* 의 관계 측정.

**Multi-head**: *여러 관점* 동시 측정. 예: *head 1* 은 *short-term 관계*, *head 2* 는 *long-term 관계*, *head 3* 은 *주기성 관계*.

본 논문 설정: **head 수 = 16** (Default).

### Self-attention 의 정확한 정의

각 patch 의 *query, key, value* 벡터 생성:
- $Q$ (query): "내가 *어떤 정보 찾는가*".
- $K$ (key): "*어떤 정보 가지고 있는가*".
- $V$ (value): "*실제 정보 내용*".

**Attention**: $Q$ 와 $K$ 의 유사도 (dot product) → *각 patch 의 관련도* 결정. 그 결과 *value 의 가중 평균* → output.

---

## 6.4 Feed-Forward Network — 비선형 변환

각 patch 의 *embedding 을 더 풍부하게*:
- *Linear projection → ReLU/GELU → Linear projection*.
- 본 논문: D = 128 (default) 또는 16 (작은 모델).

**일상 비유**: 단어 의미를 *더 풍부한 표현* 으로 (예: "*cat* → '*4발 동물 + 털 + 야옹*' 의 vector").

---

## 6.5 Layer Normalization + Residual Connection

### Layer Norm
각 layer 의 output 을 *normalize* — 학습 안정화.

### Residual Connection
*입력 + layer output* — *deep network 학습 가능* (vanishing gradient 방지).

본 논문: NLP Transformer 의 *정확한 설계 그대로*.

---

## 6.6 *BatchNorm 으로 교체* — 본 논문의 마이너 변경

본 논문의 *유일한 작은 modification*: **Layer Norm → Batch Norm**.

### 왜?

시계열에서 *batch norm 이 layer norm 보다 약간 더 좋음* (실증 발견). 

**일상 비유**: NLP 에서는 *문장 단위 정규화 (layer norm)* 가 자연. 시계열에서는 *batch (여러 시점 묶음) 단위 정규화 (batch norm)* 가 *통계적으로 안정*.

### Quantitative effect

본 논문 *Table 11 (Appendix)*: BN > LN 약 *2-3% MSE* 차이.

```viz:pat-table11-instance-norm:title=Table 11 — Instance/Batch Norm effect (interactive),caption=BN vs LN 비교. 시계열에서 BN 약간 우월.
```

---

## 6.7 *Vanilla Transformer 의 효과 — Simplicity Wins*

본 논문 메시지의 *재해석*:

> **"학자들이 *시계열 specific attention 변형* 에 5년 매달렸지만, *NLP 의 vanilla Transformer 그대로* 가 *효과적*."**

이건 *과학사적* 의미 큰 발견. 학자들의 *over-engineering 경향* 의 반박.

---

## 6.8 자기점검

### 핵심 3가지
1. **Vanilla Transformer 의 4 부품?**
2. **Multi-head self-attention 의 일상 비유?**
3. **본 논문의 *유일한 마이너 modification*?**

### 답변
1. **(1) Multi-head Self-Attention** — 각 token (patch) 의 *다른 token 들과의 관계* 측정. **(2) Feed-Forward Network** — 각 token 의 *비선형 변환*. **(3) Layer Normalization** — output normalize, 학습 안정. **(4) Residual Connection** — *입력 + output*, deep network 학습 가능.
2. **문장 "*The cat sat on the mat*" 의 *각 단어* 가 *다른 모든 단어* 와의 *관계* 측정**. "sat" → "cat (주어), on (전치사), mat (위치)" 의 *관련도*. Multi-head = *여러 관점* (단기/장기/주기성) 동시 측정. 본 논문: 16 head.
3. **Layer Norm → Batch Norm**. 시계열에서 *batch norm 이 layer norm 보다 약간 더 안정* (Table 11). 즉 본 논문의 *진짜 modification 은 patching + channel-indep + batch norm 3 개* — *나머지 다 vanilla NLP Transformer*.

---

다음 챕터: [07_instance_norm_loss.md](07_instance_norm_loss.md) — Instance Normalization + MSE Loss.
