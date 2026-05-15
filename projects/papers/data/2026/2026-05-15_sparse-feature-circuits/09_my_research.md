# 09 내 연구와의 연결

_`_profile.md`의 관심 영역 §A~F + 보유 자산 목록과 직접 연결. 구체적 mechanism/axis/수식 요소를 지정해 연결. 일반론 나열 금지._

---

## §B (Mechanistic Interpretability) × APF — 핵심 직결

### APF의 mech-interp 툴링에 SFC 이식 가능성

APF(Attention Pattern Fields) 프로젝트는 현재 "PE → 2D attention motif → CNN probe → causal intervention" 파이프라인을 개발 중이다 (`_profile.md` APF 상태 참조). 이 파이프라인의 **causal intervention 단계**에 SFC의 IE 프레임워크를 직접 연결할 수 있다.

**구체적 연결 포인트**:

현재 APF는 어텐션 패턴(motif)이 예측에 인과적으로 기여하는지를 어텐션 마스킹/패칭으로 검증한다. SFC의 접근은 한 단계 더 나아간다:

1. **APF의 어텐션 패턴 → SAE 특징 분해**: 특정 어텐션 motif(예: diagonal stripe)가 형성될 때 활성화되는 SAE 특징들을 SFC 방법으로 추출.
2. **특징 IE 측정**: "이 motif가 예측에 기여한다"는 것을 어텐션 마스킹(coarse) 대신 특징 IE(fine-grained)로 검증.
3. **SHIFT 적용 가능**: APF가 "이 motif가 통계적 허위 상관(예: Exchange-Rate 데이터의 허위 주기성)을 만든다"고 의심할 때, 해당 motif와 연계된 특징들을 ablation하여 인과 효과를 확인.

**인용 포인트 초안**: "APF §3 (인과 개입 실험 설계) 에서, 어텐션 패턴의 인과 역할을 검증하는 기존 마스킹 방법의 한계 — 어텐션 헤드 단위의 coarse-grained 해상도 — 를 지적하고, Marks et al. 2025의 SFC 프레임워크가 특징 단위의 fine-grained 인과 검증을 제공함을 각주로 언급."

---

## §A (Grokking) — 특징 회로 동역학으로 Grokking 추적

### Grokking track의 결정적 질문에 SFC가 줄 수 있는 것

Grokking in TS Transformers track의 핵심 질문 중 하나: "Grokking 국면 전환(memorization → generalization) 시 모델 내부에서 무슨 일이 일어나는가?" 기존 접근(Nanda 2023 — Fourier circuit, Power 2022 — 4단계 diagram)은 어텐션 헤드 단위의 회로 변화를 추적했다.

**SFC의 추가 기여 가능성**: Grokking 이전과 이후의 모델 체크포인트에 SAE를 적용하고, 동일한 행동(예: modular arithmetic 답 예측)에 대한 특징 회로를 두 시점에서 각각 발견. 회로의 변화 — 어떤 특징이 새로 회로에 들어오고, 어떤 특징이 회로에서 퇴장하는가 — 를 추적하면 Grokking의 특징 수준 메커니즘을 밝힐 수 있다.

**구체적 연결**:
- Nanda 2023 (Progress Measures for Grokking)에서 Fourier 주파수 기반 특징을 발견. 이것이 SAE 특징으로 어떻게 인코딩되는가?
- 내 Grokking track에서 "logistic map에서 Grokking"을 실험 중 (P2 background). 이 실험에서 각 훈련 체크포인트에 SFC를 적용하면 "Grokking=circuit 재구성"을 특징 해상도에서 보여줄 수 있다.
- 이것이 "Grokking × TS forecasting × circuit analysis 4-way intersection"의 circuit analysis 축에 깊이를 더한다.

**충돌/경쟁 지점**: SFC는 Pythia-70M 같은 언어 모델 전용으로 개발됐고, 공개된 SAE도 언어 모델용이다. Grokking 실험은 소형 수치 예측 모델(예: 4-layer MLP 또는 소형 Transformer)을 사용하므로, SAE를 처음부터 학습해야 한다. 이 추가 비용이 장벽이지만, SFC의 핵심 방법론(IE, F/C 지표)은 SAE만 있으면 모든 모델에 적용 가능.

**반면교사**: SFC는 Pythia-70M에서만 검증됐고, 소형 수치 Transformer에서 SAE 특징이 의미있게 추출되는지는 미검증. 내 실험에서 SAE 품질 검증이 선행되어야 한다.

---

## §F (원거리) — SHIFT × AETHER × 금융 응용

### AETHER와 SHIFT의 구조적 유사성

`_profile.md`에서 AETHER는 현재 Shelved 상태지만, 그 핵심 아이디어인 "시장 조건에 따른 선택적 패턴 활성화"가 SHIFT와 구조적으로 닮았다.

- **SHIFT**: 직업 분류기에서 성별 의존 특징을 제거 → 편향 없는 분류
- **AETHER 콘셉트 적용**: 암호화폐 가격 예측 모델에서 "시장 regime이 bull/bear인가"를 감지하는 특징들을 동적으로 ablation/amplification하면, 다른 regime에서 더 robust한 예측이 가능할 수 있다

이 아이디어는 현재 AETHER 설계에는 없는 것이다. SFC의 SHIFT를 금융 예측 모델에 적용하는 것 — "원치 않는 편향 특징(예: 단기 noise)을 ablation하여 장기 trend 신호만 살린다" — 이 P1 ProTran-TFA로 이어지는 금융 응용의 씨앗이 될 수 있다.

**단, 연결 강도 진단**: 이 연결은 현재로서 "아이디어 수준"이다. SFC는 언어 모델에서 검증됐고, 금융 시계열 예측 모델에 SAE를 적용하는 것은 미검증 영역. "전이 가능성만 있음"으로 표시.

---

## §B × §D — APF의 mech-interp-for-TS 문헌과 대화

Kalnāre et al. 2025 (Mechanistic Interpretability for TS Classification, arXiv:2511.21514)는 시계열 분류 Transformer에 mech interp를 처음 적용한 논문으로 APF의 concurrent work. 그 논문은 SFC 수준의 특징 회로 분석이 아닌, 어텐션 헤드 패턴 분석에 머물렀다.

**내 포지셔닝 기회**: APF 프로젝트에서 SFC 스타일의 특징 회로 분석을 시계열 Transformer에 도입하면, Kalnāre 2025보다 한 단계 더 fine-grained한 분석이 된다. APF 논문의 "미래 작업" 섹션에 "SFC 프레임워크로의 확장 가능성"을 언급하여 선점할 수 있다.

---

## 인용 우선순위 정리

| 내 프로젝트 | 인용 위치 | 인용 형태 |
|------------|-----------|-----------|
| **APF** §3 인과 개입 | SFC의 IE/AP/IG 방법론 도입 시 | "feature-level IE로 coarse 마스킹 보완" |
| **APF** §5 미래 작업 | SFC 스타일 특징 회로 확장 | "향후 SAE 기반 특징 회로 분석으로 발전 가능" |
| **Grokking** 관련 작업 | 회로 변화 추적 방법론 | "Grokking 국면 전환 시 특징 회로 변화 추적 위해" |
| **P1 ProTran-TFA** | 금융 특징 ablation 아이디어 | "원치 않는 편향 제거를 위한 SHIFT 유사 기법" (선택적) |
