# Workshop Scaffold Skill — 설계 계획서

> SA가 "주제 + 시나리오"를 던지면, 검증된 quick-* 워크샵 형식으로 워크샵 한 벌이 만들어지는 스킬.
> 데이터셋 · 기능소개 · 시나리오 실습 · 이미지 슬롯 · 다이어그램 · 고객 브랜딩 · 페르소나 평가까지.

---

## 1. 핵심 발견 — 맨땅이 아니다

워크스페이스를 뒤져 보니 이미 자산이 많다. 스캐폴드는 **발명이 아니라 추출·일반화**다.

| 자산 | 무엇 | 스캐폴드에서의 역할 |
|---|---|---|
| `ai-passport-quick-workshop` | 완성형 VitePress 워크샵(ko/en/ja, 기능 30장, 시나리오 A/B, 데이터셋+ZIP, Amplify) | **기준 골격(reference skeleton)** |
| `quick-media-briefing-workshop` | 같은 VitePress 형식의 두 번째 워크샵 | 골격이 1회성이 아님을 증명(패턴 확정) |
| `.claude/commands/workshop-check.md` + `scripts/workshop-check.sh` | 4축 QA(에셋·데이터셋·발표자노트·참가자플로우) | **QA 게이트로 그대로 상속** |
| `flash-workshop-builder` (.kiro steering) | AWS Workshop Studio용 "AI로 30분에 워크샵" 템플릿 | 대체 타깃(Workshop Studio) 프리셋의 선례 |
| `.claude/skills/aws-bento-deck` | 이미 추출된 스킬(SKILL.md+references+scripts+assets+.claude-plugin) | **스킬 파일 구조의 사내 표준** |
| `aws-diagram-design` 스킬 | 공식 AWS 아키텍처 아이콘 번들 + drawio/mermaid | 아키텍처·플로우 이미지 생성기 |

**결론:** quick-* 형식(커스텀 VitePress)을 기본 타깃으로 하고, 그 골격을 스킬 에셋으로 박제한다. Workshop Studio는 나중에 대체 이미터로.

---

## 2. quick-* 워크샵의 해부된 골격 (스캐폴드가 재현할 것)

```
docs/
  start/         overview.md, setup.md              ← 도입·환경준비
  features/      a-01-*.md … (기능 1장 = 1파일)      ← 기능 카탈로그
  scenario-a/    index.md, scene1..N.md              ← 실습(스토리형 씬)
  scenario-b/    …                                    ← 시나리오는 N개로 일반화
  reference/     datasets.md, demo-guide.md, tips.md
  public/images  (스크린샷·아이콘·로고 슬롯)
  .vitepress/    config.mts + data/{features,flows}.ts + theme/components
demo_datasets/   scenario_x/… (+ _en/_ja 로케일 사본)
PRESENTER_NOTES.md  (docs 밖 = 비배포)
scripts/workshop-check.sh
amplify.yml
```

**콘텐츠 원자 템플릿 2종(실제 파일에서 추출):**

- **기능 1장** = `<FeatureMeta>` + 기능설명 + `<Screenshot>`슬롯 + "화면에서 보이는 것"표 + `::: prompt`(해볼 프롬프트) + `::: warning`(함정) + `::: talk`(발표자 대사) + 관련 데이터셋
- **실습 씬 1개** = `<FeatureMeta>` + 내러티브 + `<Screenshot>`슬롯 + "무슨 일이 일어나는가"표 + 진행 흐름 + `<FeatureLinks>` + `::: talk` + 관련 데이터셋

**재사용 테마 키트:** `FeatureMeta`, `Screenshot(src·alt·caption)`, `FeatureLinks`, `FlowMap`, `::: prompt|warning|talk` 컨테이너.
→ `<Screenshot src="아직없는경로">`가 곧 **이미지 슬롯 "빵꾸"** 메커니즘. 새로 발명할 필요 없음.

---

## 3. 스킬 구조 (aws-bento-deck 관례 따름)

```
workshop-scaffold/
  SKILL.md                     ← 얇은 오케스트레이터(파이프라인 8단계 지시)
  .claude-plugin/plugin.json
  references/
    format-spec.md             ← quick-* 형식 규격(위 §2 전체)
    component-api.md           ← 테마 컴포넌트/컨테이너 문법 레퍼런스
    templates/
      feature.md  scene.md  scenario-index.md  dataset-spec.md
      start-overview.md  reference-datasets.md
    diagram-recipes.md         ← drawio(AWS4)·excalidraw·mermaid 언제 무엇을
    persona-rubric.md          ← 페르소나 평가 매트릭스·루브릭(§5)
    research-discipline.md     ← 기능 검증 규율(GA/리전/preview 라벨)
    branding.md                ← 고객 로고·이름·업종 주입 규약 + 정직 경계
  assets/
    scaffold/                  ← 빈 VitePress 골격 한 벌(복사해서 채움)
      docs/ .vitepress/ demo_datasets/ scripts/workshop-check.sh amplify.yml
    brand-kit/                 ← AWS 공식 아이콘 세트 포인터 + 고객로고 슬롯 규격
  scripts/
    new-workshop.sh            ← 골격 복사 + 플레이스홀더 치환
    image-manifest.mjs         ← <Screenshot> 슬롯 스캔 → 캡처/생성 매니페스트
    workshop-check.sh          ← 4축 QA(기존 것 이식)
```

배포: **지금은 스킬 에셋 번들**(오프라인·자기완결). 나중에 공개 GitHub 스캐폴드 레포로 미러(사용자 허용). flash-workshop-builder가 "clone + AI steering" 선례.

---

## 4. 생성 파이프라인 (8단계, SA 검토 게이트 포함)

한 방에 다 뽑지 않는다. **연구 사실과 청사진은 SA 눈을 거친 뒤** 대량 생성한다.

| 단계 | 무엇 | 산출물 | 게이트 |
|---|---|---|---|
| 1 **인테이크** | 주제·대상서비스·청중(레벨×직군)·시나리오 수/제목·소요시간·형식(부스/실습/발표주도)·언어·**고객사(이름/로고/업종/기술레벨)** | `brief.yaml` | SA 확인 |
| 2 **연구** | 기능을 웹+AWS문서로 검증(GA/리전/preview), 신뢰도 라벨(검증/문서/추정) | `feature-facts.md` | ★SA 사실확인 |
| 3 **청사진** | 시나리오 아크·씬 분해·기능→씬 매핑(flows)·데이터셋 요구·다이어그램 목록 | `blueprint.md` | ★SA 승인 |
| 4 **생성** | 템플릿 채움: 기능장·씬·데이터셋(+로케일)·다이어그램·이미지 매니페스트 | `docs/**`, `demo_datasets/**` | — |
| 5 **조립** | VitePress 골격에 투입, config/nav/i18n 배선, 빌드 | 빌드되는 사이트 | 빌드 통과 |
| 6 **페르소나 평가** | 청중에 맞춘 레벨×직군 패널 → 우선순위 개선안 → 적용 루프 | `persona-review.md` + 수정 | §5 |
| 7 **QA 게이트** | 4축 점검(에셋·데이터셋·발표자노트·플로우) + 빌드 | 점검 리포트 | 통과 필수 |
| 8 **핸드오프** | 이미지 캡처 매니페스트·발표자 노트·Amplify 배포 안내 | 인수인계 패키지 | — |

---

## 5. 페르소나 평가 설계 (사용자가 강조한 부분)

**목적:** 만들어진 워크샵이 "만든 사람에게만 말이 되는" 상태로 나가지 않게, **다양한 레벨×직군이 실제로 읽고** 개선점을 확정.

**매트릭스 — 청중 니즈에 맞춰 부분집합 선택:**

| 레벨 \ 직군 | 개발자 | 아키텍트 | 의사결정자/PM | 운영/SRE | 보안 | 데이터/ML |
|---|---|---|---|---|---|---|
| L100 입문 | ✔ | | ✔ | | | |
| L200 | ✔ | ✔ | | ✔ | | ✔ |
| L300 | ✔ | ✔ | | ✔ | ✔ | ✔ |
| L400+ | | ✔ | | | ✔ | |

SA가 인테이크에서 대상을 고르면 해당 셀의 페르소나만 활성화(전부 돌리면 낭비).

**각 페르소나가 산출하는 것(스키마 고정):**
- 이 레벨/직군이 **막히는 지점**(용어가 설명 없이 튐, 사전지식 가정, 실습 난이도 점프)
- **니즈 미스매치**(이 직군이 궁금한 걸 안 다룸 / 관심 없는 걸 길게 다룸)
- **활용사례 적합성**(우리 회사 상황에 대입되는가)
- 심각도(blocker/major/minor) + **구체적 수정안**(추상적 "개선 필요" 금지)

**루프:** 페르소나 병렬 리뷰 → 중복 제거·심각도 정렬 → blocker/major 적용 → 재빌드. (이번 세션에서 쓴 "생성→적대검증→종합" 워크플로우 패턴 그대로.)

**정직 규칙:** "다 좋다"는 리뷰는 무효 처리. 각 페르소나는 최소 2개 결함을 진지하게 시도(못 찾으면 그렇게 명시).

---

## 6. 고객 맞춤·브랜딩 레이어 (mid-turn 추가 요구)

인테이크의 고객사 정보가 **시나리오 프레이밍과 비주얼**을 동시에 구동한다.

- **기술 레벨** → 씬 난이도·설명 밀도·전제 지식 (L100이면 손잡고, L400이면 함정 위주)
- **업종·활용사례** → 시나리오 도메인·데이터셋 성격·"우리 얘기"로 읽히는 서사
- **고객 이름/로고** → 홈 히어로·시나리오 인트로·발표 표지에 co-branding 슬롯(`brand-kit`)
- **AWS 공식 아이콘** → 아키텍처/기능 다이어그램은 `aws-diagram-design`의 공식 AWS4 아이콘 세트 사용(임의 아이콘 금지)

**정직 경계(중요):**
- 고객 로고·이름은 **실제 SA 주도 고객 워크샵**의 정당한 co-branding 용도. 로고 원본은 고객/브랜드 소스에서 받아 사용하고 **날조된 추천사·가짜 인용은 넣지 않는다.**
- 제품 스크린샷은 SD로 생성하지 않는다(가짜를 진짜로 제시하는 것). SD/Bedrock 이미지는 **개념·삽화·배경·페르소나** 용도로만, 라벨을 붙여서.
- 아키텍처/플로우 이미지는 drawio·excalidraw·mermaid로 **실제 생성**(개념도라 진위 문제 없음).

---

## 7. 이미지·다이어그램 전략

| 종류 | 도구 | 진위 |
|---|---|---|
| 아키텍처 구성도 | drawio(AWS4 공식 아이콘) / `aws-diagram-design` | 생성=진짜 개념도 |
| 기능 플로우·참가자 여정 | excalidraw(손그림) / mermaid | 생성 |
| 시퀀스·상태 | mermaid | 생성 |
| 제품 스크린샷 | `<Screenshot>` 슬롯 → **캡처 매니페스트로 빵꾸** | 실제 캡처만(SD 금지) |
| 개념 삽화·히어로·배경 | Bedrock SD(선택) | 라벨 붙여 삽화로만 |

`scripts/image-manifest.mjs`가 모든 `<Screenshot src>`를 스캔해 **무엇을/왜/어떤 소스로** 채울지 매니페스트(JSON) 생성 → 캡처 담당이 그대로 실행. 텍스트는 최소, 비주얼로 설명이 원칙.

---

## 8. 스킬 자체를 만드는 로드맵

| 단계 | 작업 | 검증 |
|---|---|---|
| P0 | ai-passport 골격을 `assets/scaffold/`로 **일반화 추출**(플레이스홀더화) | 빈 골격이 빌드되는가 |
| P1 | 템플릿 2종 + 컴포넌트 API + 형식규격 문서화 | 템플릿→1페이지 수동 생성 성공 |
| P2 | SKILL.md 오케스트레이터 + 인테이크/연구/청사진 3단계 | 실제 주제로 청사진까지 |
| P3 | 생성·조립 단계(4·5) + image-manifest + 다이어그램 레시피 | 빌드되는 워크샵 1벌 |
| P4 | 페르소나 평가(6) 워크플로우 + 루브릭 | 개선안 적용 루프 작동 |
| P5 | QA 게이트 이식 + 브랜딩 레이어 + 핸드오프 | end-to-end 1벌 완주 |
| P6 | **드리프트 검증:** 이 스킬로 ai-passport를 재생성해 원본과 비교 | 형식 재현율 |
| P7 | 동료 SA 배포(스킬 번들) + 공개 GitHub 미러(선택) | 타 SA 1명 파일럿 |

---

## 9. 잠긴 결정 (확정)

1. **타깃 형식 = quick-* 커스텀 VitePress.** 두 예제와 동일 골격. 자체 배포(Amplify). Workshop Studio 이미터는 후순위 백로그.
2. **배포 = 스킬을 GitHub 레포로 공개, 골격은 스킬 안에 번들.** 즉 `workshop-scaffold-skill/` 레포 루트 = 스킬 = `assets/scaffold/`에 골격 포함. 자기완결 + 최신 유지 둘 다 확보.
3. **자율성 = 두 모드 지원.** `brief.yaml`의 `mode:` 플래그로 결정.
   - `staged`(기본): 연구사실(2)·청사진(3)에서 SA 게이트. 품질↑, 틀린 기능사실 전파 방지.
   - `oneshot`: 인테이크 한 번으로 끝까지. 빠름. 단 §2 연구 신뢰도 라벨은 항상 유지(원샷이라도 추정을 검증으로 위장 금지).

## 10. 스킬 레포 구조 (확정)

```
workshop-scaffold-skill/          ← GitHub 레포 루트 = 스킬
  SKILL.md  README.md  PLAN.md  .claude-plugin/plugin.json
  references/  (format-spec, component-api, persona-rubric, branding,
               research-discipline, diagram-recipes, templates/*)
  assets/scaffold/                ← ai-passport에서 추출한 빈 VitePress 골격
  assets/brand-kit/               ← AWS 공식 아이콘 포인터 + 고객로고 슬롯 규격
  scripts/  (new-workshop.sh, image-manifest.mjs, workshop-check.sh)
```
```
