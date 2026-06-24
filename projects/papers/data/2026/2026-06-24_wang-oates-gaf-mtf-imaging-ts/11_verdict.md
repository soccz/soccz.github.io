# 11. 한 줄 판결

> **시계열을 2D 이미지로 끌어올리는 분야의 *원전*: APF 의 motif typology 가 어떤 substrate (PE) 위에서 발생하는지가 핵심 질문이라면, 본 논문은 그 motif 가 *어떤 외형 격자* 위에서 직접 식별 가능해지는지를 결정한 첫 framework — 11 년이 지난 지금도 TimesNet · VisionTS · Powerformer 의 2D 화 분기가 이 한 편의 폴라 좌표 + Gram 행렬 + 양자화 전이 도식을 손도 안 대고 재활용한다.**

---

## 핀으로 꽂을 자리

- **APF main paper §3 (motif typology) + §5 (intervention)** 의 *external grid baseline* 으로 핀.
- **P1 ProTran-TFA (paused)** 의 *multimodal extension* 분기점으로 핀.
- **`_coverage.md` ts-as-2d 태그**: TimesNet (2023) ✓ + VisionTS (2024/2025) ✓ 의 *2015 ancestor* 로 핀 — *2D TS 표상 계보의 단일 원전* 자리.

## 보충 이유 (2~3 줄)

본 논문의 *기여* 는 *학습기* 가 아니라 *표상 자체* 다. 폴라 좌표 + cosine 합/차의 *2 줄 수식* 으로 시계열을 *symmetric/antisymmetric* 한 쌍의 격자로 들어 올리고, MTF 의 *양자화 + 마코프 전이* 의 *3 줄 수식* 으로 비대칭 short-range 격자를 추가한다 — 이 *결정론적 표상* 위에서 비전의 11 년치 도구 (CNN, autoencoder, image inpainting) 가 *튜닝 없이* 시계열에 적용되는 *무료 다리* 가 만들어진다. 본 논문이 2015 년에 만든 이 다리는 *2026 년 현재 APF intervention 의 control substrate*, *VisionTS 의 reshape 일반화 후보*, *P1 ProTran-TFA 의 image branch* 로 *3 개 동시 트랙* 에서 재활용 가능.
