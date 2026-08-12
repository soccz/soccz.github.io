# 3-B. Claim 2 — 점 예측이 실패한 뒤에도 어트랙터는 살아남는다

> **배경 사다리**: ① **어트랙터**는 오래 굴린 궤적이 결국 머무는 상태공간 위의 집합 — 로렌츠의 나비 날개 그림이 그것이다. ② **프랙탈 차원**은 그 집합이 "선(1차원)과 면(2차원) 사이 어디쯤인가"를 소수로 재는 값이고, 카오스 어트랙터마다 고유·불변이다. ③ **KL 발산**은 두 확률분포가 얼마나 다른지 재는 비대칭 거리다.

---

## 주장 (한 문장)

**대형 제로샷 모델은 시점별 예측이 참값에서 이탈한 뒤에도 예측 궤적이 만들어내는 어트랙터의 기하(상관차원)와 통계(상태공간 KL 발산)를 참 어트랙터와 일치시키며, 이 능력은 모델 크기에 따라 스케일한다.**

## 증거

- **§5.2 · Figure 4.** 캡션 verbatim: "Zero-shot forecast models effectively capture attractor geometry. (A) Example forecasts produced by the zero-shot and trained models, for 20 initial conditions from the Lorenz chaotic attractor. (B) The correlation between the fractal dimension of the predicted attractor and the true attractor (Spearman's rank-order coefficient, $N = 2420$ points, $p < 10^{-3}$ for all cases), versus the VPT of the corresponding model."
- 초록 verbatim: "even after point forecasts fail, large foundation models are able to preserve the geometric and statistical properties of the chaotic attractors."
- **지표 이중화**: §5.2 verbatim "To ensure that these results are not a consequence of our choice of metric, we also evaluated attractor reconstruction quality using the KL Divergence between the true and forecasted attractors, and we found the same trends (see Appendix)." → Appendix G **Figure 12** 가 $D_{stsp}$ 버전.
- **크기 스케일링의 독립 그림**: Appendix G **Figure 15** 캡션 verbatim "Zero-shot attractor reconstruction accuracy scales with model size. The Spearman correlation between the fractal dimension of Chronos's predictions, and the true fractal dimension of the underlying system, compared to the number of trainable parameters in the Chronos model."
- **반례를 저자가 먼저 제시한다**: §5.2 verbatim "the fully-trained small Transformer, which produced relatively weak forecasts, captures the attractor shape as accurately as the zero-shot models." 그리고 대비군 verbatim "we observe weak attractor reconstruction accuracy from the LSTM and NVAR models, which both operate sequentially and downweight earlier parts of their context."

## 저자의 해석과 그 취약점

§5.2 verbatim: "This observation suggests that attention-based models, which process their entire context simultaneously, have an innate advantage in capturing the long-term structure of attractors—mirroring similar results for language models (Brown, 2020)."

**이 해석은 이 논문에서 가장 흥미롭고 동시에 가장 얇은 지점이다.** 증거 구조는 사실상 2×2 관찰이다: 어텐션 계열(Chronos·소형 Transformer)은 어트랙터를 잘 잡고, 순차 계열(LSTM·NVAR)은 못 잡는다. 표본이 각 진영 2개뿐이며, 두 진영은 아키텍처 외에도 **문맥 사용 방식·파라미터 수·학습 데이터량**이 전부 다르다. "전체 문맥을 동시에 처리한다"는 성질이 원인이라면, 같은 데이터·같은 파라미터 수에서 **어텐션 마스크만 국소로 좁힌 대조군**이 필요하다 — 그 실험은 이 논문에 없다. (이 빈칸은 `10_extensions_c_ideas.md` 의 실험 아이디어 1로 이어진다.)

## 숨은 전제

1. **"어트랙터를 재현했다"의 조작적 정의가 상관 계수다.** Figure 4B 는 예측 어트랙터의 프랙탈 차원과 참 차원 사이의 **Spearman 순위상관**이다. 순위상관은 "차원이 큰 계는 예측 차원도 크다"는 단조 관계만 보증하지, 개별 계에서 차원값이 맞았다는 뜻이 아니다. 절대 정확도는 §4 에 별도 서술("report the root mean square error between the inferred correlation dimension and the ground truth")이 있으나 그 RMSE 값 자체는 그림에만 있고 본문에 수치로 나오지 않는다 — **원문에 수치 미보고**.
2. **정상성(ergodicity)이 깔려 있다.** 어트랙터가 시간이 지나도 변하지 않는다는 전제 하에서만 "장기 통계 재현"이 잘 정의된다. Appendix E 가 이 전제를 깨자마자 성능이 무너진다는 사실이 이를 뒷받침한다.
3. **어트랙터 보존이 곧 물리 이해는 아니다.** 문맥에 이미 512점 분량의 어트랙터 샘플이 들어 있으므로, 그 분포를 되풀이하기만 해도 통계는 맞을 수 있다. Claim 3(문맥 복사)이 바로 이 가능성을 확인해 준다 — 즉 Claim 2 와 Claim 3 은 서로를 보강하는 동시에 **"이해"라는 해석을 서로 깎아낸다.**

## 쉬운 말 풀이

일기예보로 치면 이렇다. "다음 주 목요일 오후에 비가 온다"는 예측은 며칠만 지나면 완전히 빗나간다. 그런데 그 모델이 1년치를 쭉 생성해 놓고 보면, **1년 동안 비 온 날의 비율과 강수량 분포는 실제와 거의 같다.** 날씨는 틀렸는데 기후는 맞은 것이다. 이 논문은 시계열 모델을 채점할 때 이 두 번째 채점표를 반드시 같이 쓰라고 말한다.

## 이 claim 의 핵심 한 문장

**"언제"를 틀려도 "어떤 세계인지"는 맞힐 수 있다 — 그러나 그 능력이 물리 이해에서 오는지 문맥 재활용에서 오는지는 이 claim 만으로 판별되지 않으며, 다음 claim 이 후자 쪽에 무게를 싣는다.**
