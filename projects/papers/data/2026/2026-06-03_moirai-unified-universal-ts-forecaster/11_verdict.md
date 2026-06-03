# 10. 한 줄 판결

**Universal Forecaster 패러다임의 가장 깨끗한 ICML 등재본 — Any-Variate Attention 의 "이진 attention bias × RoPE × 평탄화" 가 APF 의 "PE → motif → CNN probe" 줄기와 가장 정직하게 충돌하며, Mixture-of-Distribution Head 가 ProTran-TFA 의 분포 헤드 디자인 결정을 정면으로 안내한다.**

---

판결의 이유 (3 줄 보충):

1. **APF 의 다음 실험 후보 #1**: Eq.(2) 의 *시간축 RoPE + 변량축 이진 bias* 분리 가정이 APF 의 *2D motif 분해* (10_extensions_c 실험 1) 의 *천연 baseline*. MOIRAI-Small (14M, HF 공개) 가중치로 *학습 비용 0, inference 만* 의 검증 가능.
2. **ProTran-TFA 의 분포 head 청사진**: 4-mixture (Student-T + log-normal + Negative Binomial + low-var Normal) 가 *어떤 금융 시계열에 어떤 컴포넌트가 활성* 의 *경험적 기준점*. P1 plan reactivation 시 §3.2 의 *empirical motivation* 으로 직접 인용.
3. **Quasi-Universal 의 정직한 인정**: 본 논문은 *진정 universal* 이 아니라 *Energy/Transport/Climate-dominant universal* — Healthcare 0.01%, Econ-Fin 0.09% 의 *underrepresentation* 한계 명시. 이 한계가 *향후 도메인 특화 fine-tune* 의 *연구 공간* 을 정확히 열어줌. ProTran-TFA 의 *금융 특화* 가 그 공간을 차지.
