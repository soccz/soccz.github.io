# 3. 핵심 Claim 해체 (3) — 기계론적 이해가 개입 처방으로 번역되지 않는다

> **배경 사다리**: 앞의 두 Claim이 "숫자가 이렇게 나왔다"였다면, 이건 **그 숫자를 어떻게 해석할 것인가**에 대한 주장이다. 여기서 필요한 개념은 하나뿐이다 — 어떤 측정이 답하는 질문과, 우리가 그 측정으로 답하고 싶은 질문이 **다를 수 있다**는 것.

---

## Claim 3

### 주장 (한 문장)

**Causal Tracing이 답하는 질문("forward pass에서 사실 정보가 어느 표현에 실려 흐르는가")과 편집이 묻는 질문("출력을 바꾸려면 어디에 개입해야 하는가")은 애초에 다른 질문이며, 따라서 기계론적 이해의 진전이 행동 변경의 처방으로 자동 번역되지 않는다.**

### 증거 (원문 §6 Discussion + §7 Conclusion)

§6 verbatim: *"Causal Tracing answers a different question than model editing does. That is, Causal Tracing answers a question about where factual information is carried in representations in a Transformer forward pass, and this question turns out to be a different question than the editing question of where is best to intervene in the Transformer in order to change the factual information it expresses."*

이 문장은 이 논문에서 가장 중요한 문장이다. 저자들은 **"Causal Tracing이 틀렸다"고 말하지 않는다.** Causal Tracing은 자기가 정의한 것을 정확히 잰다. 다만 그 양이 **편집 지점 선택 함수가 아니다**.

§6은 이어 메커니즘 수준의 설명도 제시한다. verbatim: *"it is possible to 'override' the information in layer ℓ with an edit to another layer k (where k<ℓ or k>ℓ). Since ROME is typically effective across a large range of layers, it appears that ROME can override the information accrued across 5 or 10 layers of a forward pass with an edit to a single layer outside of that range of layers."*

즉 트랜스포머의 잔차 스트림(residual stream — 층을 지나며 계속 더해지는 정보 통로)은 **덮어쓰기가 가능한 구조**다. 정보가 $\ell$층에서 축적됐더라도, 그보다 앞선 층 $k<\ell$에서 입력을 바꿔 버리거나 뒤의 층 $k>\ell$에서 결과를 눌러 버리면 출력은 바뀐다. **"어디에 있는가"가 "어디를 눌러야 하는가"를 결정하지 않는 이유가 바로 이 덮어쓰기 가능성**이다.

§7 Conclusion verbatim (전문): *"We obtain the surprising result that model edit success is essentially unrelated to where factual information is stored in models, as measured by Causal Tracing. Faced with this result, we attempt to reconnect tracing-based localization with edit success by introducing four variants of the Error Injection problem using the CounterFact dataset. We find that edit success and tracing effects correlate best in our Fact Forcing setting. However, even in this case, tracing effects explain only a small fraction of the variance in editing performance, while the choice of edit layer is a much more important factor. This suggests that, counterintuitively, better mechanistic understanding of how pretrained language models work may not always translate to insights about how to best change their behavior."*

### 숨은 전제

1. **"기계론적 이해"의 대표로 Causal Tracing 하나를 세웠다.** 원문 §8이 스스로 인정하듯 국소화 기법은 층 단위 denoising/zeroing에 한정됐다. 뉴런 단위·attention head 단위·SAE 특징 단위 국소화는 다른 답을 줄 수 있다 — 실제로 후속 연구(예: arXiv:2410.12949 계열 mechanistic unlearning)가 이 틈을 파고든다.
2. **편집 기법이 "행동 변경"의 대표라는 가정.** 가중치 편집 말고 프롬프트·활성 조향(activation steering)·미세조정 등 다른 개입 수단에서는 국소화가 유용할 수 있다.
3. **"번역되지 않는다"는 결론이 도메인 독립적이라는 암묵적 확장.** 저자들은 §8에서 명시적으로 이 확장을 경계하지만("one should be cautious in applying our conclusions beyond our experimental setting"), 인용하는 쪽은 대개 그 경계를 지우고 인용한다. **이 논문을 인용할 때 가장 흔한 오용이 여기서 발생한다.**

### 쉬운 말 풀이

수도관에서 물이 새는 집을 상상하자. 정밀 장비로 "물이 가장 세게 흐르는 곳은 2층 벽 안쪽 파이프"라고 진단했다. 이제 물을 끊고 싶다.

그런데 실제로 물을 멈추려면 2층 벽을 뜯을 필요가 없다. **지하실 밸브를 잠그면 된다**. 혹은 3층 수도꼭지를 막아도 된다. "물이 어디로 흐르는가"와 "어디를 잠가야 멈추는가"는 **완전히 다른 질문**이고, 답도 다른 장소다.

트랜스포머의 잔차 스트림이 딱 이런 배관이다. 정보가 흐르는 지점을 정확히 찍어도, **그 앞이나 뒤에서 덮어쓰면** 출력은 바뀐다. 이 논문이 말하는 "국소화 ≠ 편집 지점"의 물리적 실체가 바로 이것이다.

### 이 Claim이 가장 위험한 방식으로 인용되는 경우

- **과잉 인용**: "해석가능성은 쓸모없다"는 주장의 근거로 쓰는 것. 논문은 그런 말을 하지 않는다 — §6은 Causal Tracing이 **자기 질문에는 정확히 답한다**고 전제한다.
- **과소 인용**: "우리는 층 단위가 아니라 뉴런 단위니까 해당 없음"으로 넘기는 것. 논문의 논리 구조(덮어쓰기 가능성)는 **개입 대상의 입도와 무관**하게 작동한다. 뉴런 단위라도 "여기에 정보가 있다 ⇒ 여기를 고쳐야 한다"는 추론은 여전히 별도 검증이 필요하다.
