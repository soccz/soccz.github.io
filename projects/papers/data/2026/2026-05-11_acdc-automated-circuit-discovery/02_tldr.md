# 1. 3 층 TL;DR

## 🧒 초등학생 수준

학교에 *수상한 사물함* 이 있다고 하자. 어느 날 옆 반 영수가 "여기 사물함 4 번, 7 번, 12 번이 같이 움직이면 매번 *과학실 자물쇠* 가 열린다" 고 말한다. 정말 그 셋이 다 필요한지 확인하려면 직접 4 번을 잠그고, 7 번을 잠그고, 12 번을 잠그면서 자물쇠가 안 열리는지 봐야 한다. 이렇게 하나씩 "꺼 보고 결과가 달라지면 그 사물함은 진짜 중요한 것" 이라는 검증 절차를, 사람이 손으로 매번 일일이 하기 귀찮으니 **로봇이 자동으로** 사물함을 하나하나 꺼 보고 "이 사물함은 진짜 필요해 / 이건 없어도 돼" 를 알려주게 만든 것이 이 논문의 알고리즘 ACDC 다.

신경망에서도 똑같다. "이 단어 (Mary) 를 떠올리려면 어떤 동그라미 (attention head) 와 어떤 화살표 (연결) 가 필요한가?" 를 알고 싶으면, 화살표를 하나씩 끊어 보고 답이 흐트러지면 그 화살표는 진짜 중요한 것이다. ACDC 는 모든 화살표를 (역방향으로) 한 번씩 끊어 보면서, **답이 별로 안 흐트러진 화살표는 버리고**, **흐트러진 화살표만 남긴** 다. 그러면 그 남은 화살표들이 모인 그림이 바로 "이 행동을 만든 회로" 다. 논문이 보여주는 자랑은: 옷날에 사람이 일주일 일해서 손으로 찾아낸 회로 (예: IOI) 와 거의 같은 그림을 ACDC 가 **혼자서** 만든다는 것이다.

## 🎓 학부생 수준

이 논문은 **mechanistic interpretability** (모델 내부 동작을 회로 수준에서 설명하려는 연구 흐름) 에서 사람들이 손으로 반복해 온 절차의 마지막 단계를 알고리즘화한다. 저자들은 이 분야의 일반 workflow 를 세 단계로 정리한다:

1. **(M1) 모델 동작 정의**: "이 모델은 어떤 행동을 하는가" 를 데이터셋 $D$ 와 메트릭 $H$ 로 못 박는다. 예: IOI 의 logit diff, KL divergence.
2. **(M2) abstract unit 식별**: head, MLP, position 단위로 *activation patching* 을 돌려 "이 unit 이 행동에 중요한가" 를 본다.
3. **(M3) unit 사이 연결 식별**: (1)–(2) 에서 남긴 unit 들 사이의 어떤 **direct edge** (residual stream 을 통해 정보가 흐르는 화살표) 가 진짜 필요한지를 가린다.

ACDC 는 (M3) 단계만 자동화한다. 절차는 단순하다. 모델을 계산 그래프 $G = (V, E)$ 로 본다 — node 는 head output / MLP / embedding, edge 는 residual stream 을 통한 직접 기여. 출력에서 입력 방향으로 (역위상정렬) 노드를 돌면서, 각 노드의 들어오는 엣지를 하나씩 끌고 (`edge.present = False`), 그 엣지를 *corrupted distribution* 에서 가져온 값으로 대체한다. 이때 메트릭 변화량 $H(M_{\setminus e}, D) - H(M, D)$ 가 임계값 $\tau$ 보다 작으면 그 엣지는 "없어도 되는 엣지" 로 영구히 제거한다. 처음엔 완전 모델로 시작해 끝에는 sparse subgraph 가 남는다. 임계값 $\tau$ 만 바꾸면 정확도-희소도 trade-off 의 Pareto frontier 가 그려진다.

평가는 6 개 태스크 — IOI, Greater-Than, Docstring, tracr-reverse, tracr-xproportion, Induction — 에서 ground-truth (사전 손작업 또는 RASP 컴파일된) 회로 와 비교해 edge-level ROC 를 그린다. 결과: GPT-2 Small Greater-Than 에서 32,000 엣지 중 **68 엣지** 만 남기며 사람이 찾은 5/5 component type 을 재발견, Docstring KL 에서 **AUC 0.982**, tracr 두 태스크는 **AUC 1.000**.

## 🔬 전문가 수준

**Contributions (논문이 의도한 것)**:

1. **mech interp 절차의 정형화**: ad-hoc 하게 다양했던 "회로 찾기" 작업을 (행동 정의 → activation patching → edge pruning) 3 단계 workflow 로 모듈화하고 마지막 모듈을 알고리즘으로 환원. 이게 ACDC 의 첫 번째 그리고 가장 큰 기여 — *알고리즘 자체* 보다 *분야의 공통 인터페이스 박기*.

2. **ACDC 알고리즘**: 단일 hyperparameter $\tau$, 역위상정렬, edge-by-edge greedy ablation. metric 은 user-pluggable (default KL, 옵션 logit-diff/NLL), ablation 분포는 corrupted (data-replace) 또는 zero. 알고리즘 복잡도는 엣지 수에 선형 — 32K edge GPT-2 Small 에 대해 single GPU 시간 안에 회로 추출.

3. **6 태스크 벤치마크 패키지**: 정답 회로가 알려진 4 개 (IOI, Greater-Than, Docstring, Induction) + tracr 컴파일된 ground-truth 회로 2 개 (reverse 18 edges / xproportion 14 edges). edge-level ROC + node-level ROC + KL-vs-sparsity Pareto frontier.

4. **baseline 비교**: Subnetwork Probing (SP, learned mask) 와 Head Importance Score for Pruning (HISP) 와의 비교. SP 가 평균 AUC 에선 ACDC 를 약간 앞서지만 (cross-source: 평균 SP 0.692 vs ACDC 0.596 — Syed et al. 2024 BlackboxNLP 재측정 수치), tracr 등 일부 태스크에서 ACDC 가 perfect recovery.

**방어 가능한 주장**:
- mech interp 분야 워크플로의 마지막 손작업 단계 (edge pruning) 를 단일 hyperparameter 의 자동화로 환원 가능하다는 **존재 증명**.
- corruption 분포 + KL 메트릭 + 역위상정렬 greedy 조합이 ground-truth 회로 (IOI 류) 와 정성적·정량적으로 일치하는 회로를 뽑는다는 **재발견** 증거.
- $\tau$ 의 단일 축으로 정확도-희소도 Pareto frontier 를 그릴 수 있다는 **하이퍼파라미터 단순성**.

**이론적 기여**:
- "edge 의 중요도" 를 *corrupted distribution 으로 대체했을 때 metric 의 한계 변화* 로 정의한 것. 이는 ROME 의 *path patching* 과 Wang IOI 의 *iterative patching* 을 일반화한 형태.
- 정답 회로가 알려진 RASP 컴파일된 transformer (tracr) 를 mech interp 자동화 도구의 sanity check 표준으로 박은 것. 이건 이후 mech interp 도구의 de facto 검증 절차가 됐다.

**한계 (논문 + 후속 비판 종합)**:
- **Greedy** 라 엣지 간 cooperative effect 를 놓친다 (두 엣지가 함께만 중요한 경우 둘 다 제거될 수 있음).
- **계산 비용**: 32K 엣지 GPT-2 Small 도 분~시간 단위. 더 큰 모델 (GPT-Neo, Llama) 에서는 forward pass 수가 폭발.
- **KL 메트릭의 한계**: 클래스 평탄화 효과. logit-diff 가 더 sharp 한 신호 (특히 binary 분류 - 풍 task).
- **후속 비판 (Syed 2023, EAP-IG 2024)**: gradient 기반 attribution patching 이 거의 같은 회로를 *한 번의* backward pass 로 추출 — ACDC 의 cost-quality trade-off 가 attribution patching 에 의해 압도된다.

---


---

## 인터랙티브 시각화

```viz:acdc-algorithm-flow:title=ACDC Algorithm Step-by-step,caption=Step slider.
```

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **3 층 의의?**
2. **Edge-by-edge granularity 의 power?**
3. **Resampling 의 중요성?**

### 답변

1. paper §-references + 본 deep dive 의 cross-reference 기반.

2. ACDC (Conmy 2023) 의 핵심 mechanism (edge-by-edge ablation + KL metric) 의 통합 관점.

3. APF / Grokking 트랙의 baseline — manuscript §1-§6 + Appendix.
