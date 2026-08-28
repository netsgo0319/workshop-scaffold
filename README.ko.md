# workshop-scaffold (한국어 가이드)

*[English guide](./README.md)*

**워크샵 주제 · 시나리오 · 대상 고객**만 던지면, 사내에서 검증된 quick-\* VitePress 형식으로 핸즈온 워크샵 한 벌을 만들어 주는 Claude Code 스킬입니다. 기능 카탈로그·시나리오 실습·샘플 데이터셋·AWS 아키텍처 다이어그램·이미지 슬롯·고객 co-branding까지 생성하고, **레벨×직군 페르소나 패널**이 실제로 읽고 개선점을 냅니다.

매번 처음부터 짜는 대신 검증된 골격을 채우는 방식입니다. **이 스킬만 설치하면, 아무것도 없는 사람도 워크샵을 처음부터 끝까지 만들어 배포할 수 있게** 자체 완결형으로 구성돼 있습니다.

> 스킬 내부 문서(SKILL.md·references·templates)는 전 세계 SA와 공유하기 위해 영어로 작성돼 있습니다. 이 문서는 한국어 이용 가이드입니다.

---

## 무엇이 나오나

한 번 돌리면 대상 폴더에 이런 것들이 생깁니다.

- **VitePress 사이트** — 홈·아젠다·기능 카탈로그·시나리오별 실습 페이지. `npm run docs:dev`로 바로 보고, 빌드해서 배포합니다.
- **샘플 데이터셋** — 시나리오 로직에 맞는 현실적인 데이터(+필요 시 다국어 로케일 사본).
- **아키텍처/플로우 다이어그램** — 공식 AWS 아이콘으로 그린 그림.
- **이미지 슬롯** — 스크린샷·로고가 아직 안 들어간 자리를 “빵꾸”로 표시하고, 무엇을 캡처해야 하는지 매니페스트로 정리.
- **`brief.yaml`** — 이 워크샵의 고정값(고객사·규모·일시·직군·시나리오·기술레벨…)을 담은 단일 출처(SSOT).
- **`artifacts/`** — 단계별 중간 산출물(연구 결과·청사진·페르소나 리뷰). 왜 이렇게 만들어졌는지 되짚을 수 있습니다.

---

## 준비물

- **Claude Code** — 이 스킬이 도는 환경
- **Node.js 18+** — 생성된 VitePress 사이트를 보고 빌드할 때
- **AWS 자격증명** — 배포(예: AWS Amplify)까지 할 경우에만

---

## 설치

**플러그인으로 설치 (권장)** — 이 레포 자체가 마켓플레이스입니다:

```bash
claude plugin marketplace add netsgo0319/workshop-scaffold
claude plugin install workshop-scaffold
```

스킬 3개 — `workshop-scaffold`(전체 파이프라인), `aws-fact-check`(GA/리전/라벨 검증 단독), `persona-review`(레벨×직군 패널 평가 단독) — 와 커맨드 3개(`/new-workshop`, `/workshop-check`, `/workshop-walkthrough`)가 설치됩니다.

**또는 로컬 클론에서** (오프라인/개발용):

```bash
git clone https://github.com/netsgo0319/workshop-scaffold.git
claude plugin marketplace add ./workshop-scaffold
claude plugin install workshop-scaffold
```

설치 후 Claude Code를 다시 시작하세요. (`~/.claude/skills/`로 바로 클론하는 방식은 이제 동작하지 않습니다 — 스킬이 레포 루트가 아니라 `skills/` 아래에 있습니다.)

---

## 빠른 시작 (아무것도 없는 상태에서)

```bash
# 1. 새 폴더에 빈 워크샵 골격 생성
bash ~/.claude/skills/workshop-scaffold/scripts/new-workshop.sh ../my-workshop \
  --title "ACME × Bedrock" --name my-workshop --color "#0972d3"

cd ../my-workshop && npm install && npm run docs:dev   # 빈 골격 미리보기

# 2. 스킬로 채우기 — Claude Code에서
/workshop-scaffold
#    (또는: "이 주제로 워크샵 만들어줘: …")
```

인테이크가 `brief.yaml`을 쓰고, 이후 단계가 콘텐츠를 채우고 검증합니다.

---

## 사용법

새 워크샵을 만들 **빈 폴더**를 하나 만들고 그 안에서 Claude Code를 실행한 뒤:

```
/workshop-scaffold
```

자연어도 됩니다: `"식품 제조 고객 대상으로 Claude Code on Bedrock 워크샵 만들어줘."`

그러면 `brief.yaml`에 고정될 값들을 물어봅니다.

| 물어보는 것 | 예 |
|---|---|
| 주제 · 대상 AWS 서비스 | "Claude Code on Bedrock", "AgentCore" |
| 청중 (레벨 × 직군) | L200 개발자, L300 아키텍트 … |
| 시나리오 수 · 제목 | 3개: 개인 생산성 / 데이터 분석 / 외부 연동 |
| 소요시간 · 형식 | 4.5시간 · 실습(hands-on) / 부스(booth) / 발표주도 |
| 언어 | ko / en / ja |
| 고객사 | 이름 · 로고 · 업종 · 기술레벨 |
| 실행 모드 | `staged`(기본) 또는 `oneshot` |

입력 예시는 [`assets/brief.example.yaml`](assets/brief.example.yaml), 실제로 돌린 결과 예시는 [`examples/hanbitpay/`](examples/hanbitpay/)를 참고하세요.

---

## 진행 흐름 (8단계)

이 순서로 돕니다. `staged` 모드에서는 **★ 단계에서 잠깐 멈춰 확인을 요청**하니, 방향이 어긋나면 그 자리에서 바로잡을 수 있습니다.

1. **인테이크** — 위 값들을 받아 `brief.yaml`로 고정
2. **연구 ★** — 쓰는 AWS 기능을 웹·문서로 검증(GA/리전/preview)하고 신뢰도 라벨을 붙임
3. **청사진 ★** — 시나리오 아크·씬 분해·기능↔씬 매핑·데이터셋/다이어그램 요구 정리
4. **생성** — 기능 페이지·씬·데이터셋·다이어그램·이미지 슬롯 채우기
5. **조립** — VitePress config·내비·다국어 배선 후 빌드
6. **페르소나 평가 + 워크스루 루프** — 레벨×직군 패널이 읽고, 이어서 신선한 눈의 참가자 에이전트가 **실제로 따라합니다**(단계 실행·링크/데이터셋/빌드/배포 확인). 작성자 에이전트가 걸린 곳을 고치고, 클린 라운드가 나올 때까지 반복
7. **QA 게이트** — 에셋·데이터셋·발표자노트·플로우 점검 + 빌드 통과
8. **핸드오프** — 캡처할 이미지 목록·발표자 노트·배포 안내 정리

**두 가지 모드**
- `staged`(기본): 연구·청사진 ★에서 사람 확인을 받고 진행. 처음 쓰거나 중요한 워크샵에 권장.
- `oneshot`: 멈춤 없이 끝까지. 단, 동일한 통과 조건을 검사하고 위반 시 중단.

**워크플로우로도 실행(선택):** [`assets/workshop-pipeline.workflow.mjs`](assets/workshop-pipeline.workflow.mjs)가 파이프라인을 멀티에이전트 Workflow(연구·생성·페르소나를 병렬 셀로)로 인코딩합니다. 워크플로우 오케스트레이션 사용에 동의해야 돌아가며, 동일한 게이트를 지킵니다.

---

## 이 스킬이 지키는 규칙 (알고 쓰세요)

결과물의 신뢰를 지키기 위해 스킬이 **일부러 하지 않는 것**들이 있습니다.

- **제품 스크린샷을 AI로 만들어 내지 않습니다.** 스크린샷 자리는 “실제로 이걸 캡처하세요” 슬롯으로만 남습니다.
- **아키텍처·플로우 다이어그램은 공식 AWS 아이콘**으로만 그립니다.
- **고객 로고·이름은 실제로 진행하는 고객 워크샵의 co-branding에만** 씁니다. 날조된 추천사·가짜 인용·미승인 로고 사용은 하지 않습니다.
- **AWS 기능 사실은 기억이 아니라 그때그때 검증**합니다. 리전 가용성·GA/preview는 실행 시점에 다시 확인하며, 검증/문서/추정을 **라벨로 구분**해 남깁니다.
- **발표자 전용 내용**(시연 팁 등)은 배포되는 `docs/` 밖 `PRESENTER_NOTES.md`에만 둡니다.

생성된 사이트의 기본 테마는 [`references/format-spec.md`](references/format-spec.md)의 규격을 따릅니다(예: 내비게이션 바는 불투명 배경 + 상단 고정).

---

## 스킬 구성

| 경로 | 내용 |
|---|---|
| `skills/workshop-scaffold/` | Claude가 따르는 파이프라인 오케스트레이터 |
| `skills/aws-fact-check/` | 단독 스킬: GA/리전/preview + 신뢰도 라벨 검증 |
| `skills/persona-review/` | 단독 스킬: 아무 산출물이나 레벨×직군 패널 평가 |
| `commands/new-workshop.md` | `/new-workshop` — 워크샵 폴더 스캐폴딩 |
| `commands/workshop-check.md` | `/workshop-check` — QA 축 점검 + 참가자 플로우 리뷰 |
| `assets/scaffold/` | 복사해서 채우는 빈 VitePress 골격 |
| `assets/workshop-pipeline.workflow.mjs` | 파이프라인의 멀티에이전트 워크플로우 |
| `scripts/new-workshop.sh` | 골격을 새 폴더로 복사 + 값 치환 (강제 스크립트·훅 동봉) |
| `scripts/workshop-check.sh` | QA 점검(에셋/데이터셋/발표자노트/비주얼 + 빌드) — 생성된 워크샵에서는 Stop 훅으로도 자동 실행 |
| `scripts/gate.sh` | 단계 진입 하드 게이트 — 선행 산출물 없으면 착수 차단 |
| `scripts/image-manifest.mjs` | 캡처 대기 스크린샷 목록화 |
| `commands/workshop-walkthrough.md` | `/workshop-walkthrough` — 참가자 워크스루↔작성자 수정 루프(gate.sh 7 통과 조건) |
| `agents/participant-walker.md` | 플러그인 에이전트: 실제로 따라해 보는 신선한 눈의 참가자 |
| `references/format-spec.md` | 결과물 구조·테마 규격 |
| `references/component-api.md` | 페이지에서 쓰는 VitePress 컴포넌트 |
| `references/research-discipline.md` | AWS 사실 검증·라벨 규율 |
| `references/diagram-recipes.md` | Mermaid / drawio / Excalidraw 레시피 |
| `references/persona-rubric.md` | 레벨×직군 페르소나 평가 기준 |
| `references/branding.md` | 고객 맞춤·co-branding 규약 |
| `references/pipeline-contract.md` | 단계별 게이트·불변식(고급) |
| `references/templates/` | 기능 페이지·씬 템플릿 |
| `assets/brief.example.yaml` | 입력 예시 |
| `examples/hanbitpay/` | 실제 실행 중간 산출물 예시 |

---

## 문제가 생기면

- **스킬이 안 잡혀요** → `claude plugin list`에 `workshop-scaffold`가 enabled로 보이는지 확인하고 Claude Code를 재시작하세요.
- **빌드가 안 돼요** → 생성된 폴더에서 `npm ci` 후 `npm run docs:build`. Node 18+ 인지 확인.
- **AWS 기능 정보가 오래돼 보여요** → 리전/GA 정보는 실행 시점 기준입니다. 배포 전 `artifacts/`의 라벨과 `confirmed_date`를 다시 보세요.
