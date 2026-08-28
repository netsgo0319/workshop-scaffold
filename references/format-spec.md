# quick-* 워크샵 형식 규격

`ai-passport`·`media-briefing`에서 추출한 골격. 생성물은 이 구조를 따라야 QA 게이트를 통과한다.

## 디렉토리

```
docs/
  start/       overview.md, setup.md            # 도입·환경준비
  features/    {id}.md …                         # 기능 1장 = 1파일 (템플릿: feature.md)
  scenario-{x}/ index.md, scene1..N.md           # 실습 (템플릿: scene.md). x는 a,b,… N개
  reference/   datasets.md, demo-guide.md, tips.md
  public/images/   스크린샷·아이콘·로고 슬롯
  .vitepress/  config.mts + data/{features,flows}.ts + theme/components
demo_datasets/  scenario_{x}/…  (+ _en/_ja 로케일 사본)
PRESENTER_NOTES.md   # docs 밖 = 비배포
scripts/workshop-check.sh
amplify.yml
```

## 데이터 파일 (SSOT)

- `.vitepress/data/features.ts` — 기능 메타(id·이름·아이콘·시나리오·씬). 기능 페이지·`<FeatureMeta>`·`<FeatureLinks>`의 단일 출처.
- `.vitepress/data/flows.ts` — 시나리오별 기능 연결(FlowMap). 씬↔기능 매핑.
- 기능/씬을 추가하면 이 두 파일과 nav(config.mts)를 함께 갱신 — 안 하면 QA에서 걸림.

## 테마 컴포넌트·컨테이너 (component-api.md 상세)

`<FeatureMeta>` `<Screenshot src alt caption>` `<FeatureLinks ids>` `<FlowMap>` · `::: prompt` `::: warning` `::: talk` `::: tip`.
`<Screenshot>` = 이미지 슬롯. src가 아직 없는 경로여도 됨 → 캡처 매니페스트가 수집.

## 테마 CSS 베이스라인 (`theme/custom.css` 필수 규칙)

VitePress 기본 navbar는 반투명이라 스크롤 시 뒤 콘텐츠가 비치고, 사이드바가 있으면 로고 영역만 사이드바 색(`--vp-c-bg-alt`)을 물려받아 헤더 좌우 색이 갈려 밋밋해 보인다. **생성되는 모든 워크샵의 `custom.css`에 아래를 기본 포함**한다 — 헤더를 불투명 배경 + 하단 경계선으로 채우고, 상단 고정을 명시한다(라이트/다크 공통, `--vp-c-bg` 토큰이라 다크모드도 자동 대응). 브랜드 컬러 토큰은 이 위에 얹는다.

```css
/* 헤더(navbar): 불투명 배경 + 상단 고정 — 반투명·좌우색갈림 방지 */
.VPNav { position: fixed; top: 0; left: 0; right: 0; z-index: var(--vp-z-index-nav); background-color: var(--vp-c-bg); }
.VPNavBar { background-color: var(--vp-c-bg) !important; border-bottom: 1px solid var(--vp-c-divider); }
.VPNavBar.has-sidebar .content { background-color: transparent; }  /* 우측 투명 방지 */
.VPNavBar .title { background-color: transparent; }                /* 로고 영역 회색 제거 → 우측과 색 통일 */
```

VitePress 기본 레이아웃은 이미 navbar 높이만큼 본문 상단 여백을 확보하므로 `position: fixed`가 콘텐츠를 가리지 않는다. 테마별로 겹치면 `.VPContent { padding-top: var(--vp-nav-height); }`로 보정.

## i18n

`ko`(기본)·`en`·`ja` 3로케일. `docs/en/`·`docs/ja/`에 미러, `demo_datasets_en/`·`_ja/`에 데이터셋 사본. 로케일 추가·삭제는 brief.yaml의 `languages`로.

## 불변식 (QA가 강제)

- 발표자 전용 문구는 `PRESENTER_NOTES.md`에만, `docs/` 안엔 금지.
- 데이터셋은 3곳 일치: 다운로드 ZIP / `reference/datasets.md` 매핑표 / 기능 페이지 "관련 데이터셋".
- 약어는 최초 등장 시 풀어쓰기. 근거 없는 수치·경쟁사 단정 금지.
- 시나리오 A/B의 기능 연결·씬 구성이 페이지 간 일관.

## 빌드·배포

VitePress. `npm run dev`(로컬)·`npm run build`. 데이터셋 ZIP은 Amplify 빌드에서 자동 재생성. main push → Amplify 자동배포.
