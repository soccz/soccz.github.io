## 0. 메타 & 선정 이유

- **인용 수**: NeurIPS 2023 발표 후 약 1년 반 시점에서 Semantic Scholar 기준 200+ (대규모 비정규 시계열 트랜스포머의 *de facto* 베이스라인 진입). 정확한 수치는 접근 차단으로 미확인.
- **DOI / 발표처**: NeurIPS 2023 (`https://proceedings.neurips.cc/paper_files/paper/2023/hash/9328208f88ec69420031647e6ff97727-Abstract-Conference.html`)
- **코드·데이터 공개**: GitHub `microsoft/SeqML/ContiFormer`, MIT 라이선스. PhysioNet, Human Activity, Stock 등 공개 벤치 사용. ODE solver는 `torchdiffeq` 기반.
- **저자 권위**: Microsoft Research Asia + Fudan SeqML 그룹. Kan Ren은 시계열 RL/예측 분야 다수 1저자, Microsoft의 Qlib 시리즈와 인접.

### 선정 이유 (지금 이 시점에 왜 이걸 봐야 하는가)

`_profile.md`의 **Paper 4: Continuous Economic Time Attention**는 명시적으로 "ContiFormer의 ODE 시간 변수 대체"를 목표로 한다. 즉 Paper 4는 ContiFormer를 **출발점이자 베이스라인**으로 둔다. 그런데 코어 버킷 인덱스에는 ContiFormer 한 줄이 없다 — 베이스라인을 모른 채 그 위에 무엇을 얹을 수는 없다. 또한 Paper 1의 conditioning-space 논의(`concat_a` vs `tau_rope` vs `static`)도 결국 "조건 변수를 시간축에 어떻게 주입하느냐"인데, ContiFormer는 사실상 *ODE의 vector field에 시간을 주입*하는 가장 강한 형태다. 따라서 이 논문 한 편으로 코어 버킷 4개 태그(neural-ode-cde, time-series-transformer, conditioning-mechanism, economic-time)에 모두 발판이 생긴다. 첫 코어 슬롯으로 가장 효율적인 선택.
