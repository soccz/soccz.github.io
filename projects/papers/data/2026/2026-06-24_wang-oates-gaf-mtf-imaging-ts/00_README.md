# Imaging Time-Series to Improve Classification and Imputation

**한국어**: 시계열을 이미지로 인코딩해 분류·결측 보간 성능을 높이기 — Gramian Angular Field 와 Markov Transition Field 의 도입.

## 메타

- **저자**: Zhiguang Wang, Tim Oates
- **소속**: University of Maryland, Baltimore County (UMBC), CORAL Lab
- **발표처**: IJCAI 2015 (Proceedings of the 24th International Joint Conference on Artificial Intelligence), pp. 3939–3945
- **자매 워크샵 논문**: "Encoding Time Series as Images for Visual Inspection and Classification Using Tiled Convolutional Neural Networks", AAAI 2015 Workshops (Wang & Oates, 동일 저자)
- **연도**: 2015
- **Canonical identifier**:
  - arXiv:1506.00327
  - IJCAI 2015 Paper 553 (pp. 3939–3945)
  - DBLP: conf/ijcai/WangO15
  - ACM DL DOI: 10.5555/2832747.2832798
- **코드**: GitHub `cauchyturing/Imaging-time-series-to-improve-classification-and-imputation` (저자 본인 계정; Python 3.6+; 핵심 파일 `serie2GAF.py`, `serie21MTF.py`, `serie2QMlib.py`, `Coffee_ALL` 샘플)

## Source Lock

- **공식 PDF**: `https://www.ijcai.org/Proceedings/15/Papers/553.pdf`, `https://arxiv.org/abs/1506.00327`, ACM DL `dl.acm.org/doi/10.5555/2832747.2832798`
- **본 환경 접근**: arXiv abstract / IJCAI proceedings PDF / arXiv PDF / ar5iv / alphaxiv / dblp / Semantic Scholar / ResearchGate / ADS / ScisSpace / Liner / pyts docs / Medium 모두 HTTP 403 차단
- **대체 확인**: (1) 저자 본인 GitHub README + 폴더 트리 (`serie2GAF.py` / `serie21MTF.py` / `serie2QMlib.py` / `Coffee_ALL`) + Wiki 파라미터 메모(PAA dimensionality, GAF type 선택, 데이터 rescale 옵션 / MTF 의 quantile binning, full·patch·PAA reduction 옵션) (2) WebSearch verbatim 인덱스 — abstract 두 문단 ("Inspired by recent successes of deep learning in computer vision, we propose a novel framework for encoding time series as different types of images, namely, Gramian Angular Summation/Difference Fields (GASF/GADF) and Markov Transition Fields (MTF)" + "Inspired by the bijection property of GASF on 0/1 rescaled data, we train Denoised Auto-encoders (DA) on the GASF images of four standard and one synthesized compound dataset. The imputation MSE on test data is reduced by 12.18%-48.02% when compared to using the raw data") + GASF/GADF/MTF 정의 ("polar coordinate transformation … θ = arccos(X_norm), r = n/L" / "GASF using cosine of summation of angles … GADF using cosine of difference of angles" / "divided into a finite number of non-overlapping intervals acting as the states … M(i, j) corresponds to the transition probability from state s_i to state s_j") + 데이터·평가 ("20 standard datasets" "nine of the current best time series classification approaches" "Gun Point … one of the UCR time series datasets used")
- **확인 수준**: 제목/저자/소속/연도/venue/canonical identifier/abstract 두 문단/정성 method 컴포넌트(폴라 좌표·GASF cos·GADF sin·MTF 양자화 전이·tiled CNN·DA imputation·bijection)/UCR 20 개·9 비교·12.18-48.02% 의 abstract 수치는 모두 verbatim 또는 보조 인용을 통해 확인. **본문 표 절대 수치 (개별 UCR 데이터셋별 error rate, ablation 좌표, baseline 별 win/tie/loss 정확한 카운트, Figure 1~6 의 정확한 캡션·축·수치), Section 3·4 의 정리·증명 단계, Appendix 보조 결과는 본문 PDF 차단으로 단정 없음** — 모르는 곳은 "원문 미확인" 으로 명시한다.

## 태그

- 주: `ts-as-2d` (수요일 인접 버킷)
- 보조: `ts-transformer-baseline` 의 비-transformer 분기 (CNN backbone for TS, but downstream effort that PatchTST/TimesNet/VisionTS 가 인용·확장하는 분기점), `fin-ts-dl` 약 보조 (시계열→이미지 변환이 candlestick/주가 차트 분류 응용으로 직결, Tsai 2019 "Encoding Candlesticks" 등이 직접 후손)

## 한 줄 판결

**"시계열을 2D 이미지로 끌어올리는 분야의 *원전*: APF의 motif typology 가 어떤 substrate (PE) 위에서 발생하는지가 핵심 질문이라면, 본 논문은 그 motif 가 *어떤 외형 격자* 위에서 직접 식별 가능해지는지를 결정한 첫 framework — 11 년이 지난 지금도 TimesNet·VisionTS·Powerformer 의 2D 화 분기가 이 한 편의 폴라 좌표 + Gram 행렬 + 양자화 전이 도식을 손도 안 대고 재활용한다."**

## 목차

1. [00_README.md](./00_README.md) — 본 표지
2. [01_meta.md](./01_meta.md) — 메타 & 선정 이유
3. [02_tldr.md](./02_tldr.md) — 3층 TL;DR
4. [03_problem.md](./03_problem.md) — 문제 지형도
5. [04_claims.md](./04_claims.md) — 핵심 Claim 해체
6. [05_method_a_intuition.md](./05_method_a_intuition.md) — 방법론 ① 큰 그림
7. [05_method_b_gaf.md](./05_method_b_gaf.md) — 방법론 ② GAF (GASF/GADF)
8. [05_method_c_mtf.md](./05_method_c_mtf.md) — 방법론 ③ MTF
9. [05_method_d_tiled_cnn.md](./05_method_d_tiled_cnn.md) — 방법론 ④ Tiled CNN 학습기
10. [05_method_e_imputation.md](./05_method_e_imputation.md) — 방법론 ⑤ GASF bijection 기반 보간
11. [06_experiments.md](./06_experiments.md) — 실험 해부
12. [07_limits.md](./07_limits.md) — 가정·한계·반박
13. [08_lineage.md](./08_lineage.md) — 이론적 계보
14. [09_my_research.md](./09_my_research.md) — APF · Grokking 연결
15. [10_extensions_a_questions.md](./10_extensions_a_questions.md) — 자문 질문 5
16. [10_extensions_b_followups.md](./10_extensions_b_followups.md) — Follow-up 3 편
17. [10_extensions_c_ideas.md](./10_extensions_c_ideas.md) — 실험 아이디어 2
18. [11_verdict.md](./11_verdict.md) — 한 줄 판결
