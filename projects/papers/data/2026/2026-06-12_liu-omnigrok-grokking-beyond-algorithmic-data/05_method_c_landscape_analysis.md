# 05 · 방법 ③ 고정-norm landscape 분석 — landscape 와 grokking 의 2-way 검증

## 배경 사다리

이 절을 이해하려면 ① "$w$ 의 norm 을 학습 도중 인위적으로 일정하게 묶을 수 있다" 는 것 (예: 매 step gradient 적용 후 $w \leftarrow r_0 \cdot w/\|w\|$ 로 reproject), ② 이러면 학습은 *고정 반지름 구면 $S^{d-1}(r_0)$* 위에서만 일어난다는 것 (방향 dynamics 만 살아 있음), ③ 이 setup 에서의 final loss 를 $r_0$ 의 함수로 sweep 하면 reduced landscape 의 *실측 곡선* 을 얻을 수 있다는 것만 알면 된다.

## 왜 두 갈래 실험인가 — `landscape/` 와 `grokking/`

저자 공식 GitHub 의 각 도메인 폴더 (teacher-student, mod-addition, mnist, imdb, qm9) 는 다음 2 개의 하위 폴더로 일관되게 분기한다 (mnist-repr 제외):

- **`landscape/`** — *weight norm 을 고정* 한 채 학습. 여러 다른 $r_0$ 값 마다 final train/test loss 를 측정 → reduced landscape (L 자 train + U 자 test) 의 *직접 측정 곡선* 을 그림.
- **`grokking/`** — *표준 weight decay 학습* — norm 을 free 로 두고 standard SGD/Adam + weight decay. 학습 step 의 함수로 train/test loss 추적 → grokking 의 점프 자체를 보여 줌.

이 2-way 분할은 우연이 아니라 **저자들이 가설을 어떻게 falsifiable 하게 짰는지** 의 핵심 디자인이다.

### 두 폴더가 함께 증명하는 명제

가설 (LU mechanism + Goldilocks zone) 이 참이라면, 다음 두 시그널이 *서로 호환* 해야 한다:

1. `landscape/` 에서 측정한 reduced test loss 의 *최저점 위치* = $w_c$ (Goldilocks zone 중심).
2. `grokking/` 에서 학습 중 측정한 *grokking 시점의 $\|w\|$ 값* ≈ $w_c$.

이 두 값이 일치하면 — 두 독립 실험 setup 에서 같은 $w_c$ 가 나오면 — LU 가설의 *정량 예측* 이 확인된다. (정확한 일치도는 본 환경에서 본문 PDF 미접근으로 단정 안 함. 다만 저자가 굳이 두 폴더를 일관되게 갖춘 것은 이 비교가 본문의 핵심 시각화임을 시사.)

## Reduced landscape 측정 방법

### Step 1 — 반지름 sweep

여러 $r_0$ 값 (예: log-scaled grid) 마다 다음을 반복:

```python
# pseudo-code (저자 코드 직접 미접근, 일반적 구현 패턴)
for r0 in radius_grid:
    model.init_weights()
    project_to_norm(model, r0)            # ‖w‖ ← r0
    for step in range(N_steps):
        loss = compute_train_loss(model, batch)
        loss.backward()
        optimizer.step()
        project_to_norm(model, r0)         # 매 step norm 재조정
    train_loss[r0] = compute_train_loss(model, full_train)
    test_loss[r0]  = compute_test_loss(model, full_test)
```

여기서 `project_to_norm` 이 핵심 — gradient step 후마다 $w \leftarrow r_0 \cdot w/\|w\|$ 로 강제 rescale. 이러면 학습은 sphere 위에서만 일어나고, *방향만* 최적화된다.

**4 줄 해석**:

1. **기호 뜻**: $r_0$ 는 고정할 반지름 값, `project_to_norm` 는 weight 벡터의 norm 만 $r_0$ 으로 강제, train/test loss 는 평소 정의.
2. **일상 비유**: 행성을 인공적으로 고정 반지름 구 위에 묶어 둔 다음 표면을 굴리는 것. 일반 학습 (행성이 자유낙하) 과 다르게 표면 dynamics 만 본다.
3. **왜 이 형태**: reduced landscape $\tilde L(r)$ 가 무엇인지 *측정하려면* radius 를 통제 변수로 두어야 한다. 다른 방법 (post-hoc 분석) 으로는 $\hat w^*(r)$ 가 *학습이 도달 가능한* 방향인지 보장 못 함.
4. **조심할 점**: (a) `project_to_norm` 후 gradient 가 sphere 의 접선 성분만 의미 있는데, 이 일부가 무시되면 effective learning rate 가 평소와 달라짐 — 결과적으로 reduced landscape 의 *모양* 은 잘 보이지만 *수치 스케일* 은 원본 학습과 다를 수 있음. (b) sphere 위 학습이 평지 학습보다 일반적으로 더 어려운 (curvature-induced) optimization 문제로 변환됨.

### Step 2 — L · U 자 확인

각 $r_0$ 에 대한 train/test loss 를 plot. 가설이 옳다면:

- train_loss 가 작은 $r_0$ 에서 큼 → 임계 $r_0 = w_c$ 부근에서 급락 → 큰 $r_0$ 에서 평평하게 작음 → **L 자**.
- test_loss 가 작은 $r_0$ 에서 큼 → 임계 $r_0 = w_c$ 부근에서 최소 → 큰 $r_0$ 에서 다시 큼 → **U 자**.

저자 README 의 Figure mapping 으로 본 환경에서 확인되는 것: Fig 3 (MNIST 의 landscape 측정), Fig 4 (IMDb), Fig 5 (QM9) 에 이 L/U 곡선이 도메인별로 등장.

## `grokking/` 폴더의 의의

standard 학습 (free norm) 에서는:

- Step 의 함수로 train loss → 0 (보통 빠름)
- Step 의 함수로 $\|w(t)\|$ → 천천히 감소 (small weight decay)
- Step 의 함수로 test loss → train 도달 후 한참 평평하다가 어느 시점에 급락 (grokking)
- **결정적 plot**: $\|w(t)\|$ vs step 그래프와 test_loss vs step 그래프를 겹쳐 보면, test loss 가 급락하는 step 의 $\|w(t)\|$ 가 정확히 reduced landscape 의 U 자 최저점 $w_c$ 와 일치 → LU mechanism 의 *2-way 일치* 검증.

이 일치가 본 논문의 가장 설득력 있는 evidence (정성적으로) 라고 추론한다. 저자가 정량 일치도 (예: 두 $w_c$ 의 상대 오차 %) 를 본문 표로 보고했는지는 본 환경에서 PDF 미접근 → 단정 안 함.

## 다른 방법이었다면

대안 1 — **Direct landscape visualization with 2D slice**: 두 random direction 으로 slice 한 2D landscape (Li et al. 2018 의 lock-in landscape plot 류). 더 시각적이지만 *특정 slice* 에 의존하고 $w_c$ 같은 구조적 양을 직접 안 줌.

대안 2 — **Spectral methods**: weight matrix 의 spectral norm 만 보고 SAM 식 sharpness 와 비교. Norm 의 정의가 spectral 로 바뀌면 LU mechanism 의 형태도 바뀔 수 있음 — interesting 후속 가능.

대안 3 — **Path-norm**: NN 출력 함수의 *path 적분* 으로 정의되는 norm. 더 의미론적이지만 측정 비용 큼.

저자의 *$L_2$ norm + sphere projection* 선택은 가장 단순하고 weight decay regime 과 자연스럽게 호환된다는 점에서 우아.

## 한 문장 요약

`landscape/` 와 `grokking/` 의 2-way 분할이 LU mechanism 을 *예측 → 검증* 로 만든다. 두 setup 에서 같은 $w_c$ 가 나오는 것이 본 논문의 핵심 실증.
