# 4-C. 방법론 — Rank-One 업데이트의 대수

> **배경 사다리**: ① 최소제곱(least squares)이란 "정확히 맞출 수 없을 때 오차 제곱합이 가장 작아지는 답"을 찾는 방법이다. ② 라그랑주 승수법은 "제약을 지키면서 최소화"를 푸는 표준 도구로, 제약마다 새 변수($\Lambda$)를 하나씩 붙인다. ③ rank-1 행렬은 $\Lambda u^\top$ 꼴로, 열벡터 하나와 행벡터 하나의 곱이다 — 행렬 중 가장 "얇은" 변화.

---

## 이 부분이 왜 필요한가

§2가 "중간층 MLP의 $W_{proj}$가 범인"이라고 지목했다. 이제 검정을 하려면 **그 행렬만 최소한으로 바꿔서 사실 하나를 갈아끼워야** 한다. 조건이 까다롭다.

- 새 사실은 확실히 들어가야 한다 (**등식 제약**)
- 기존에 저장된 것들은 최대한 안 건드려야 한다 (**최소 교란**)
- 반복 최적화로 하면 그 자체가 새로운 자유도라 "국소화 가설을 검정했다"는 논증이 흐려진다 (**닫힌 해가 바람직**)

---

## 부품 1: 관점 전환 — $W$는 연상 기억이다 (원문 §3.1)

$$W K \approx V, \qquad W = V K^{+}$$

**① 기호 뜻.** $K = [k_1 \mid k_2 \mid \ldots]$ = 키들을 열로 쌓은 행렬. $V = [v_1 \mid v_2 \mid \ldots]$ = 대응하는 값들. $K^{+}$ = Moore–Penrose 유사역행렬(pseudoinverse — 정사각형이 아니거나 역행렬이 없는 행렬에 대해 "가장 그럴듯한 역"을 주는 연산). $W$는 여기서 MLP의 $W_{proj}^{(l)}$.

**② 일상 비유.** 우체국 분류기. 우편번호(키)를 넣으면 배송 구역(값)이 나온다. 분류기 자체는 번호와 구역의 대응표를 **어딘가 통째로 압축해서** 갖고 있다. 각 칸에 따로 적혀 있는 게 아니라, 행렬 하나가 모든 대응을 동시에 근사한다.

**③ 왜 이 형태인가.** 여기가 Geva et al. (2021)과 갈리는 분기점이다. Geva는 **뉴런 하나 = 키 하나**로 봤다(per-neuron view). 그 관점에서는 편집이 "특정 뉴런의 행을 고쳐 쓰기"가 되고, 실제로 Dai et al. (2022)의 Knowledge Neurons가 그렇게 한다. 이 논문은 **행렬 전체 = 하나의 연상 기억**으로 본다(§3.1 명시: "note that this differs from Geva et al.'s per-neuron view"). 이 관점이어야 "새 쌍 삽입"이 **제약 최소제곱**이라는 잘 정의된 수학 문제가 되고, 닫힌 해가 나온다. Table 4에서 KN이 ES 28.7로 사실상 실패한 것은 두 관점의 실증적 판정으로도 읽힌다.

**④ 조심할 점.** $K$와 $V$는 **실재하지 않는다.** 우리는 GPT가 어떤 키–값 쌍들을 저장했는지 모른다. 이건 **해석적 허구(interpretive fiction)** 이고, 아래 유도 전체가 이 허구 위에 서 있다. 논문은 이 허구가 유용하다는 걸 실험으로만 정당화한다.

---

## 부품 2: 제약 최소제곱과 닫힌 해 (원문 §3.1, Eqn. 2)

$$\text{minimize } \|\hat{W}K - V\| \quad \text{such that} \quad \hat{W}k_* = v_* \qquad \text{by setting} \quad \hat{W} = W + \Lambda(C^{-1}k_*)^\top \tag{Eqn. 2}$$

**① 기호 뜻.**
- $\hat{W}$ = 편집 후 행렬, $W$ = 원본
- $k_*$ = 새 키 (subject를 지목하는 벡터), $v_*$ = 새 값 (새 사실을 담은 벡터)
- $C = KK^\top$ — **비중심 공분산(uncentered covariance)**. 논문 §3.1: "a constant that we pre-cache by estimating the uncentered covariance of $k$ from a sample of Wikipedia text (Appendix E.5)"
- $\Lambda = (v_* - Wk_*)/(C^{-1}k_*)^\top k_*$ — "잔차 오차에 비례하는 벡터(a vector proportional to the residual error of the new key–value pair on the original memory matrix)"

**② 일상 비유.** 꽉 찬 책장에 새 책 한 권을 꽂아야 한다. 무식하게 밀어 넣으면 옆 책들이 우수수 떨어진다. Eqn. 2는 **"어느 방향으로 얼마나 밀면 새 책이 정확히 들어가면서 옆 책 이동이 최소인가"** 를 계산해준다. $C^{-1}$이 하는 일이 재미있다 — 책장에서 **원래 책이 빽빽한 방향은 조금만** 밀고, **성긴 방향으로 크게** 밀어 넣는다. 즉 기존 기억이 밀집한 방향을 피해 간다.

**③ 왜 이 형태인가.** 세 가지 대안과 비교하면 선명하다.
- **그냥 $\hat{W} = W + (v_* - Wk_*)k_*^\top / \|k_*\|^2$** (가장 단순한 rank-1 투영). 이건 $C = I$인 특수 경우다. 기존 기억의 분포를 무시하므로 빽빽한 방향을 그대로 밟는다 → 이웃 오염.
- **경사하강으로 $W$ 전체 최적화** (= FT). 자유도가 너무 크다. Table 4의 FT가 NS 40.4로 무너지는 이유.
- **하이퍼네트워크로 업데이트 예측** (= KE, MEND). 별도 학습이 필요하고, 학습 분포 밖에서 깨진다. Table 4의 KE-CF가 NS 6.9로 붕괴하는 이유.

Eqn. 2가 이기는 구조적 이유는 **"제약은 정확히, 나머지는 최소로"라는 요구를 그대로 수식으로 옮겼기** 때문이다. 자유도가 정확히 필요한 만큼만 있다.

**④ 조심할 점.**
- $C^{-1}$이 존재해야 한다 (Appendix A: "assuming $C$ is nondegenerate"). 조건수가 나쁘면 $\Lambda$가 폭발한다.
- $C$는 **위키피디아 10만 샘플**로 추정한 값이다. 도메인이 다르면(예: 시계열 수치 토큰) 이 추정 자체가 무의미해진다.
- Eqn. 2는 **한 개의 쌍**에 대한 해다. 두 사실을 연속 삽입하면 두 번째가 첫 번째를 훼손할 수 있다 — 이것이 후속작 MEMIT(arXiv:2210.07229)이 다루는 문제다.

---

## 부품 3: 유도의 실제 (원문 Appendix A, Eqn. 5~17)

논문은 부록에서 손으로 다 푼다. 흐름만 따라가 보자.

**출발점 — 원본이 최소제곱해라는 가정** (Eqn. 5~6):
$$\text{the } W \text{ that minimizes } \|WK - V\|_F^2 \quad \text{solves} \quad W K K^\top = V K^\top$$
($\|\cdot\|_F$ = Frobenius 노름 — 행렬의 모든 원소를 제곱해 더한 것. 벡터가 아니라 행렬이 최적화 대상이라 이 노름을 쓴다고 부록이 직접 설명한다.)

**제약 추가** (Eqn. 7): $\hat{W}k_* = v_*$

**라그랑지안** (Eqn. 8):
$$L(\hat{W}, \Lambda) = \tfrac{1}{2}\|\hat{W}K - V\|_F^2 - \Lambda^\top(\hat{W}k_* - v_*)$$

**미분해서 0** (Eqn. 10~11): $\hat{W}(KK^\top) - VK^\top - \Lambda k_*^\top = 0 \Rightarrow \hat{W}KK^\top = VK^\top + \Lambda k_*^\top$

**마법이 일어나는 순간** (Eqn. 12) — 여기서 Eqn. 6을 빼면 $VK^\top$이 소거된다:
$$(\hat{W} - W)KK^\top = \Lambda k_*^\top \quad\Longrightarrow\quad \hat{W} = W + \Lambda(C^{-1}k_*)^\top$$

**$\Lambda$ 풀기** (Eqn. 16~17) — $u^\top = (C^{-1}k_*)^\top$로 두고 제약에 대입:
$$\hat{W}k_* = (W + \Lambda u^\top)k_* = Wk_* + \Lambda(u^\top k_*) = v_* \quad\Longrightarrow\quad \Lambda = \frac{v_* - Wk_*}{(C^{-1}k_*)^\top k_*}$$

**여기서 읽어야 할 것.** 부록 첫 단락이 스스로 밝힌다 — "This derivation is included for clarity and completeness and is **a review of the classical solution of least-squares with equality constraints** as applied to our setting." 즉 **수학적 신규성은 0이다.** 이 논문의 기여는 새 정리가 아니라 **"트랜스포머 MLP를 이 고전 문제의 인스턴스로 읽어낸 매핑"** 이다. 그리고 그게 더 어려운 종류의 기여다.

$\Lambda$의 분모 $(C^{-1}k_*)^\top k_*$를 눈여겨볼 것. $k_*$가 기존 키 분포의 **주요 방향에 잘 정렬돼 있으면** 이 값이 커져 $\Lambda$가 작아진다(살살 민다). 반대로 $k_*$가 **희귀한 방향**이면 분모가 작아져 크게 민다. 기존 기억이 없는 곳이니 세게 밀어도 안전하다는 뜻이다. 이 한 줄에 "최소 간섭"의 기하학이 압축돼 있다.

---

## 부품 4: 왜 하필 rank-1인가

$\Lambda(C^{-1}k_*)^\top$는 열벡터 × 행벡터이므로 계수가 정확히 1이다. 이건 **선택이 아니라 결과**다 — 제약이 하나($\hat{W}k_* = v_*$)이므로 라그랑주 승수도 하나($\Lambda$)이고, 따라서 업데이트의 계수도 1이다.

**함의.** 사실 $n$개를 삽입하고 싶으면 제약이 $n$개라 rank-$n$ 업데이트가 나온다. 이것이 MEMIT의 출발점이다. 그리고 rank가 올라갈수록 "최소 교란" 보장은 약해진다 — 논문이 §3.7에서 "it only edits a single fact at a time"이라 못박고 대량 편집을 별도 논문으로 미룬 데는 이런 구조적 이유가 있다.

---

## 이 부분의 핵심 한 문장

> **Eqn. 2는 새 수학이 아니라 '제약 최소제곱'이라는 1970년대 고전을 트랜스포머 MLP 위로 정확히 옮긴 매핑이며, $C^{-1}$이라는 한 항이 "기존 기억이 빽빽한 방향은 피해서 밀어 넣는다"는 최소간섭 기하를 통째로 담당한다.**
