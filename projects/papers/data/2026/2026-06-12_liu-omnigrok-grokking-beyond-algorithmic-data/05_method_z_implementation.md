# 05 · 방법 ④ 구현·재현 디테일

## 배경 사다리

이 절은 *실제로 grokking 을 자기 컴퓨터에서 재현* 하려는 사람을 위한 디테일이다. ① PyTorch 의 `torch.nn` / `optim` 모듈, ② Jupyter notebook 의 cell-by-cell 실험 흐름, ③ small-scale 실험 (수십 분 ~ 수 시간 내 grokking 관찰 가능) 의 hyperparameter 감각을 전제로 한다.

## 저자 공식 코드의 구조

`github.com/KindXiaoming/Omnigrok` (1 저자 Ziming Liu 의 핸들). 본 환경에서 README + 디렉터리 트리 까지 접근 확인:

```
Omnigrok/
├── README.md
├── teacher-student/
│   ├── landscape/   # 고정 weight norm 학습 — reduced landscape 측정
│   └── grokking/    # 표준 학습 — grokking 자체 관찰
├── mod-addition/
│   ├── landscape/
│   └── grokking/
├── mnist/
│   ├── landscape/
│   └── grokking/
├── imdb/
│   ├── landscape/
│   └── grokking/
├── qm9/
│   ├── landscape/
│   └── grokking/
└── mnist-repr/      # 단일 폴더 — representation 변화 분석 전용
```

- **언어**: Jupyter Notebook 100% (자체 Python 모듈 없음, 노트북 1 개당 self-contained).
- **라이선스**: GitHub 페이지 상 명시적 라이선스 파일 미확인 (본 환경에서 license tab 차단).
- **README 의 코드 설명**: "minimal, self-contained" — 즉 각 폴더 노트북이 dependency 분리되어 있어 단일 노트북만 열어도 그 도메인 실험 끝까지 실행 가능. 학습용 코드로서는 모범적이지만, 대규모 sweep 이나 multi-seed 통계 분석은 노트북 안에서 직접 짜야 함.

## 도메인별 구현 핵심 (저자 README + 코드 폴더 식별 기반 추정 — 정확한 hyperparam 수치는 본 환경 노트북 raw 접근 차단으로 단정 안 함)

### teacher-student/

- 작은 MLP teacher (random init, fixed) 가 라벨 생성. student MLP 가 그 라벨 학습.
- `grokking/` 노트북: standard SGD/Adam + weight decay 로 grokking induction.
- `landscape/` 노트북: sphere-projection 으로 norm 고정 → reduced landscape.
- 활용 목적: 데이터·모델이 가장 단순해서 LU mechanism 의 가장 깨끗한 시각화.

### mod-addition/

- Power et al. 2022 의 원조 셋업과 동일 / 호환: $p$-modular addition (보통 $p = 97$ 등 prime). One-layer / two-layer transformer 또는 MLP.
- `landscape/` + `grokking/` 으로 *원조 grokking task* 에서도 LU mechanism 이 작동함을 보여 줌 — Power et al. 의 발견을 LU 관점에서 재해석.

### mnist/

- MLP 또는 small CNN. MNIST 분류.
- 표준 학습에서는 보통 grokking 안 보임 → 저자가 **large initialization** + **작은 train set (예: 1k subset)** + **explicit weight decay** 의 조합으로 induce.
- LU mechanism 관점에서는 "Goldilocks zone 까지 거리" 를 인위적으로 크게 만들면 grokking 이 어디서나 induce 가능함의 시연.

### imdb/

- LSTM 으로 영화 리뷰 sentiment 분류. word embedding + LSTM + linear classifier.
- 검색 카드 verbatim 인용: *"An LSTM is used to predict IMDb reviews, with a (weak) grokking signal observed for large initializations when using 1k data, while no grokking is observed for standard initializations."*
- 즉, **standard init 에선 grokking 안 보임**. 1k data + large init 에서 *약한* signal — 저자가 정직하게 이 한계를 표기.

### qm9/

- GCNN (Graph Convolutional Neural Network) 으로 분자 graph 의 양자화학 property 회귀.
- 검색 카드: *"the training loss forms an L-shape and the test loss forms a U-shape against the weight norm, consistent with the LU mechanism."*
- 즉, regression task + graph 구조에서도 LU 가 나타남 → 가장 *vision/language 와 거리 먼* 도메인에서의 시연.

### mnist-repr/

- MNIST 의 *representation 변화* 분석. landscape/grokking 분기 없는 단일 폴더.
- 저자 README Fig 7 매핑.
- 추정: weight norm 이 변할 때 hidden representation 의 구조 (예: 자릿수 클러스터의 분리도 또는 manifold geometry) 가 어떻게 함께 변하는지 시각화.
- 본 환경에서 본문 미접근 → 정확한 representation 분석 metric 단정 안 함.

## 재현 가능성 평가

### 강점

- **완전 공개 코드** + Jupyter notebook 형식 → 재현 진입 장벽이 매우 낮음.
- **6 개 도메인 self-contained** → 한 도메인만 따로 실험 가능 (전체 setup 부담 없음).
- **저자가 GitHub 핸들 자기 이름 (KindXiaoming = Ziming Liu)** → 정통성 확실.

### 약점 / 주의

- **Multi-seed 분산 부족 가능성**: notebook 들이 단일 run 시각화 중심으로 추정 → seed 변동에 따른 grokking 시점 분산이 본문에 어떻게 표현됐는지 본 환경에서 단정 못 함.
- **Hyperparameter sweep 의 완전성**: 본문에서 어떤 (weight decay, lr, init scale) grid 를 sweep 했는지 코드 raw 접근으로 확인 필요. 본 해체에서는 abstract + 검색 카드의 정성 기술 ("small weight decay 가 큰 delay 를 만든다") 에 한해 인용.
- **License 부재 가능성**: README 직접 확인 + repo 메타 상 license 파일 식별 안 됨 → 재사용 시 저자 contact 권장.
- **Compute footprint**: 도메인별 노트북이 작은 모델 (MLP/LSTM 작은 사이즈) 위주라 GPU 1 장 이내로 실험 가능할 것으로 추정.

## 만약 내가 재현한다면 — 우선순위 한 줄

1. `mod-addition/grokking/` 부터 — Power et al. 2022 의 원조 셋업과 비교 baseline 확보.
2. `mod-addition/landscape/` — 같은 task 에서 reduced landscape 측정 → `grokking/` 과의 *$w_c$ 일치 검증*.
3. `mnist/grokking/` 으로 도메인 확장.
4. `mnist/landscape/` — 같은 도메인 일치 검증.
5. 위 4 단계가 성공하면 LU mechanism 의 *우산성 (univerality)* 이 충분히 확인된다. teacher-student / imdb / qm9 는 보조 (논문 reviewer 설득용) 로 본 해체에서는 평가.

## 한 문장 요약

코드는 self-contained Jupyter notebook 6 개 × `landscape/grokking/` 의 2-way 분기로 깔끔히 정돈되어 있어 재현 진입 장벽이 매우 낮지만, multi-seed 통계와 라이선스 명시는 보강이 필요할 수 있다.
