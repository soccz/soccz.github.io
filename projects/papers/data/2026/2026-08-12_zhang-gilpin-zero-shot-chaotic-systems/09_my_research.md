# 8. 내 연구와의 연결

> **§9 봉인 준수 선언**: 아래의 내 프로젝트 관련 사실은 `_profile.md` · `_index.md` 에 **문자 그대로 적힌 것만** 근거로 삼는다. 두 파일에 없는 내부 절 번호·수식 번호·파일 구조는 "프로필 기준 미상"으로 두고 창작하지 않는다. 인용 앵커는 축(axis)·메커니즘·수식 요소 이름으로 지정한다.

---

## 8.1 연결 강도 판정

| 축 (`_profile.md`) | 연결 강도 | 근거 |
|---|---|---|
| **§D. TS Transformers / TSFM Interp** | **강** | 이 논문 자체가 TSFM(Chronos) 해석 논문이며, `_profile.md` §D 의 Chronos·MOIRAI·TimesFM 라인 위에 직접 얹힌다 |
| **§F. 원거리 (continual learning 등)** | **강** | Appendix E 비정상성 스윕 + Appendix F.2 파인튜닝 시 원 코퍼스 성능 저하 = 분포 이동·가소성 문제 |
| **§B. Mech Interp / Circuit Analysis** | **중** | 이 논문 자체엔 회로 증거가 없으나, 직계 후속작(arXiv:2505.11349, ICLR 2026)이 문맥 복사를 **induction head** 와 연결 — `_profile.md` §B 의 Induction Heads(Olsson 2022) 항목과 직결 |
| **§C. Attention as Explanation / PE-Attention Geometry** | **중** | Appendix E 처방 1이 **RoPE 이식**을 명시 지목 — APF 의 PE 비교 축과 정면으로 맞물림 |
| **§A. Grokking / Delayed Generalization** | **약** | 직접 언급 없음. 단 §1 의 일반화 문헌 나열에 Power et al. 2022 가 인용되어 있어 접점만 존재 |
| **§E. 금융 시계열 응용** | **약 — 전이 가능성만** | 금융 데이터 실험 없음. 다만 "희소 상태에서 예측이 나쁘다"(Appendix C)는 꼬리 사건 예측 경고로 전이 가능 |

---

## 8.2 흡수할 기법 — 구체적으로 무엇을 어디에 쓰는가

### (1) Grokking 트랙: Appendix E 식 (3)을 **비정상성 노브**로 그대로 이식

`_profile.md` 의 Grokking 트랙은 "Grokking × TS forecasting × **non-stationarity** × circuit analysis" 4-way 교차로 정의되어 있고, 그 교차에서 발견된 선행 논문이 0편이다. 문제는 **"비정상성"을 실험에서 어떻게 연속 조절할 것인가**인데, 지금까지 이 레포가 커버한 논문 중 그 노브를 명시적 수식으로 준 것은 이 논문이 처음이다.

$$x_t \leftarrow x_t\, e^{\,t\,\frac{\log f_{\min}}{T-1}}$$

- **적용 대상**: `_profile.md` 보유 데이터 목록의 **logistic map** 과 **regime-switching synthetic**, 그리고 **sin/periodic synthetic**.
- **적용 방식**: $f_{\min} \in \{1.0, 0.8, 0.6, 0.4, 0.2\}$ 로 스윕하며 grokking 발생 시점(train/test 정확도 갈라지는 지점)이 어떻게 밀리는지 본다. 가설은 **"비정상성이 커질수록 grokking 이 늦어지거나 아예 사라진다"** — 이는 `_profile.md` §A 의 Lyle 2025(continual + non-stationarity, 이 레포 2026-05-01 커버)와 이 논문을 잇는 최단 경로다.
- **왜 이 식이어야 하나**: 곱셈형이라 계의 절대 스케일에 의존하지 않는다. 즉 logistic map(값역 [0,1])과 ETT-mini(실측 단위)에 **같은 $f_{\min}$ 을 쓰고도 비정상성 강도를 비교**할 수 있다. 가법 드리프트였다면 데이터셋마다 스케일을 다시 맞춰야 한다.

### (2) Grokking 트랙: **VPT 를 grokking 지표로 승격**

`_profile.md` 보유 데이터에 **logistic map** 이 있고, priority Tier 1 에 "Grokking Applied to Chaotic Iterates of the Logistic Map (2025 thesis)" 가 직접 비교 대상으로 올라 있다. 로지스틱 사상은 카오스 계이므로 **최대 Lyapunov 지수가 정의되고 따라서 $\tau$ 도 정의된다.** 이 논문의 식 (1)

$$\mathrm{VPT} \equiv \arg\max_{t_f}\{t_f \mid \mathrm{sMAPE} < \epsilon,\ \forall t < t_f\}$$

을 그대로 쓰면, 로지스틱 실험의 성능을 **"MSE 몇"이 아니라 "Lyapunov 시간 몇 배를 버텼나"** 로 보고할 수 있다. 이점이 셋이다: (i) $r$ 값(카오스 강도)이 다른 조건들을 한 축에서 비교 가능, (ii) 물리·동역학 심사자에게 표준적인 언어, (iii) **grokking 전/후의 성능 점프가 MSE 보다 훨씬 선명하게 보인다** — MSE 는 포화하지만 VPT 는 포화하지 않기 때문.

### (3) APF 트랙: 문맥 복사 = **오프대각 stripe motif** 라는 반증 가능한 예측

`_profile.md` 의 APF 프레임은 "PE → 2D attention motif → CNN probe → causal intervention" 이고 motif 분류는 **diagonal / stripe / block / edge / spike / checker** 다. 이 논문의 문맥 복사 가설을 APF 언어로 번역하면 다음 한 문장이 된다:

> **"모델이 예측 직전 구간과 가장 상관 높은 과거 부분열을 복사한다면, 그 시차 $\Delta$ 에서 어텐션 맵에 오프대각 stripe motif 가 떠야 한다."**

이건 APF 의 motif taxonomy 를 쓰지 않으면 표현조차 되지 않는 예측이며, **CNN probe 로 검출하고 causal intervention 으로 검증하는** APF 파이프라인 그대로 시험된다. 구체 프로토콜:
1. 문맥 중복도(이 논문 §5.3 정의: 30점 이상 길이 최고상관 부분열)를 계산해 시차 $\Delta^\*$ 를 얻는다.
2. 어텐션 맵에서 $\Delta^\*$ 위치의 stripe motif 강도를 CNN probe 로 측정한다.
3. 그 stripe 를 마스킹(개입)했을 때 VPT 가 떨어지는지 본다.
3단계가 있으면 이 논문이 못 한 **인과 귀속**(`07_limits.md` 반박 2)이 완성된다. 즉 **APF 의 방법론이 이 논문의 결핍을 정확히 메운다** — 이건 우연이 아니라 APF 프레임이 원래 그 목적으로 설계됐기 때문이다.

### (4) APF 트랙: PE 축에 **비정상성 조건**을 추가

Appendix E 처방 1 verbatim: "Using Chronos's tokenizer in tandem with a modern language model with an explicit positional encoding scheme, like rotary positional embedding, would provide the model with explicit time information that would allow it to capture longer-term trends in a time series Su et al. (2024)."

APF 의 PE 비교 축은 **NoPE / sinusoidal / learned / RoPE / ALiBi** 5셀이다. 이 논문은 그 축에 대해 **저자가 직접 세운 가설**을 하나 던져준 셈이다: "명시적 위치 인코딩이 있으면 비정상성(추세)에 강해진다." 이걸 APF 그리드에 조건으로 붙이면:

| PE 셀 | 비정상성($f_{\min}<1$) 하에서의 예측 |
|---|---|
| NoPE | 절대 시각 정보 없음 → 추세 외삽 불가, 가장 취약 |
| sinusoidal / learned | 절대 위치 있음 → 중간 |
| RoPE | 상대 회전, 저자 지목 → 개선 기대 |
| ALiBi | 거리 선형 벌점 = **최근성 강제** → 추세는 못 잡지만 국소 적응은 빠를 수 있음, RoPE 와 갈릴 지점 |

ALiBi 셀의 예측이 RoPE 와 **반대 방향으로 갈릴 수 있다**는 점이 특히 좋다 — 이 레포 2026-07-20(ALiBi)·2026-07-06(RoFormer) 해체에서 정리한 "덧셈 거리벌점 vs 곱셈 회전"의 대척 구도가 비정상성이라는 새 축에서 반증 가능한 예측을 낳는다.

### (5) 양 트랙 공통: **채점표 이원화**

이 논문에서 가장 저렴하게 훔칠 수 있는 것. 시계열 실험 결과를 보고할 때 항상 두 축을 함께 낸다 — (i) 단기: VPT 또는 MSE, (ii) 장기: 생성 궤적의 분포·불변량 재현(상관차원 또는 $D_{stsp}$). `_profile.md` 보유 데이터 중 **regime-switching synthetic** 과 **logistic map** 은 불변량이 잘 정의되므로 즉시 적용 가능하다.

---

## 8.3 충돌 / 경쟁 지점

**충돌 1 — "attention 이라서 장기 구조를 잡는다"는 §5.2 주장은 APF 의 전제를 흔든다.**
APF 는 PE 종류가 motif 를 만들고 motif 가 성능을 만든다는 인과 사슬을 세운다. 그런데 이 논문 §5.2 는 "**전체 문맥 동시 처리**"라는 아키텍처 수준 성질만으로 어트랙터 재구성 우위를 설명한다 — PE 이야기가 전혀 없다. 만약 그 설명이 맞다면 PE 는 이 현상에 무관하고, APF 의 PE 축은 이 과제에서 설명력이 없다는 뜻이 된다.
**대응**: 정면 반박이 아니라 **조건 분해**로 간다. `07_limits.md` 반박 1에서 설계한 마스크 대조(전체 문맥 / 윈도우 $1\tau$ / 무작위 희소)를 PE 5셀과 교차하면 $3\times5$ 그리드가 나오고, "동시 처리"와 "PE" 중 무엇이 주효과인지 **분산분석 수준에서 분리**된다. APF 입장에서는 이 그리드가 오히려 자기 축의 설명력을 정량화할 기회다.

**충돌 2 — 이 논문의 결론이 APF·Grokking 의 전제를 절약적으로 대체할 위험.**
"성능은 문맥 복사에서 온다"가 맞다면, 정교한 회로 분석 없이도 예측 성능의 대부분이 설명된다. 즉 **오컴의 면도날이 mech interp 쪽에 불리하게 작동**한다.
**대응**: 이 프레임을 받아들이고 질문을 한 단계 올린다 — "복사가 성능을 설명한다"면 남는 mech interp 질문은 **"복사가 어디서 어떻게 구현되는가"** 이며, 이것이 정확히 induction head 문헌(`_profile.md` §B, Olsson 2022)의 영역이다. 즉 이 논문은 mech interp 를 무력화하는 게 아니라 **표적을 좁혀 준다.** APF·Grokking 양 트랙 모두 "회로가 성능을 설명한다"가 아니라 "**복사 회로가 언제 형성되고 언제 실패하는가**"로 프레이밍을 바꾸면 충돌이 자산으로 바뀐다.

**충돌 3 — P1 ProTran-TFA (paused) 와의 관계는 약하다.**
이 논문에는 확률 예측 캘리브레이션·분위수 손실 논의가 없다. Chronos 가 생성 모델이라 샘플 분산이 존재함에도 그 분산을 보고하지 않는다(`07_limits.md` 재현성 표). 따라서 **연결 약함 — 전이 가능성만 있음**: "생성 모델의 샘플 분산을 어트랙터 재구성 품질과 함께 보고해야 한다"는 방법론적 지적 정도가 옮겨갈 수 있다.

---

## 8.4 인용 포인트 (문장 초안)

> **APF 논문 · 관련연구의 "TSFM 해석" 문단**:
> "Zhang & Gilpin (ICLR 2025) show that a time series foundation model's zero-shot forecasts correlate significantly more with matched subsequences in their own context than those of the strongest trained baseline (Fig. 5B; matched t-test, $N=135$, $p<10^{-3}$), suggesting *context parroting* as the operative mechanism. Their evidence is behavioral; the attention-level signature such copying should leave — an off-diagonal stripe motif at the matched lag — remains untested, and is what our probe is designed to detect."

> **APF 논문 · PE 비교 축을 정당화하는 문단**:
> "The need for an explicit positional scheme under non-stationarity is stated by Zhang & Gilpin (ICLR 2025, Appendix E), who propose pairing a time series tokenizer with rotary positional embedding to capture longer-term trends. We test this proposal directly by sweeping NoPE / sinusoidal / learned / RoPE / ALiBi under their non-stationarity modulation (their Eq. 3)."

> **Grokking 논문 · 실험 설정 문단**:
> "We modulate non-stationarity with the exponential amplitude schedule of Zhang & Gilpin (ICLR 2025, Eq. 3), $x_t \leftarrow x_t e^{t\log f_{\min}/(T-1)}$, which parameterizes distribution shift by a single scalar $f_{\min}\in(0,1]$ and is scale-free, allowing the same sweep to be applied to the logistic map and to real-world benchmark subsets."

> **Grokking 논문 · 지표 절**:
> "Following Zhang & Gilpin (ICLR 2025, Eq. 1), we report Valid Prediction Time in units of Lyapunov time in addition to MSE, since thresholded error saturates in the chaotic regime and cannot resolve the pre-/post-grokking gap."

---

## 8.5 반면교사 — 이 논문이 못 한 것을 내가 어떻게 다룰까

1. **내부 증거 부재 → APF 가 그 자리를 채운다.** 이 논문은 §1 에서 "동역학계 기법으로 모델 내부를 이해할 가능성"을 예고해 놓고 본문에서 실행하지 않았다(`06_experiments.md` §5.5 "빠진 것" 3번). APF 는 CNN probe + causal intervention 을 이미 갖고 있으므로 **그 예고를 대신 실행하는 논문**으로 자기 위치를 잡을 수 있다.
2. **상관에서 멈춘 메커니즘 주장 → 개입으로 닫는다.** `07_limits.md` 반박 2의 문맥 치환 개입은 비용이 작고(추가 학습 없음) 결론이 이분법적이다. APF 의 causal intervention 문화가 그대로 적용된다.
3. **비정상성을 한 종류만 다룸 → 3종 분해로 확장한다.** 진폭 감쇠 / 파라미터 드리프트 / 레짐 전환. 특히 `_profile.md` 보유 데이터의 **regime-switching synthetic** 은 세 번째 종류를 이미 갖고 있다 — 이 논문이 못 한 조건을 **내가 이미 가진 데이터로** 채울 수 있다는 뜻이다.
4. **생성 확률성 분산 미보고 → 나는 보고한다.** 샘플 시드 반복 측정을 기본으로 삼는다. 이건 비용 대비 신뢰도 이득이 가장 큰 항목이다.
5. **단일 파운데이션 모델 → 최소 2종 비교.** `_profile.md` §D 에 Chronos·MOIRAI·TimesFM 이 모두 올라 있고 이 레포가 셋 다 커버했다. 문맥 복사 의존도를 모델 간 비교하면 "아키텍처가 복사 성향을 만드는가"라는 새 질문이 생긴다.
