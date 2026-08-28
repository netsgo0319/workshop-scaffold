---
name: workshop-scaffold
description: SA가 워크샵 주제·시나리오·대상 고객을 던지면 검증된 quick-* VitePress 형식으로 워크샵 한 벌(기능 카탈로그·시나리오 실습·데이터셋·다이어그램·이미지 슬롯·고객 브랜딩)을 생성하고, 레벨×직군 페르소나 패널로 평가·개선까지 수행한다. 트리거: "워크샵 만들어줘", "핸즈온 워크샵 스캐폴드", "이 주제로 워크샵", workshop scaffold/builder.
---

# Workshop Scaffold

## 이 스킬이 하는 일 (WHAT)

주제 + 시나리오 + 대상 고객(레벨·직군·업종·로고)을 받아 **quick-\* VitePress 워크샵 한 벌**을 만든다. 형식은 `references/format-spec.md`에 규격화돼 있고, 빈 골격은 `assets/scaffold/`에 있다. 텍스트는 최소화하고 다이어그램·이미지 슬롯으로 설명한다.

## 언제 쓰나 (WHY)

- 형식이 이미 `ai-passport`·`media-briefing` 두 워크샵에서 검증됨 → 매번 처음부터 짜지 말고 이 골격을 채운다.
- AWS 기능은 기억이 아니라 **그때그때 검증**해야 함(GA/리전/preview) → 파이프라인에 연구 게이트가 내장돼 있다.
- 만든 사람에게만 말이 되는 워크샵을 막기 위해 → 레벨×직군 페르소나가 실제로 읽고 개선점을 낸다.

## 어떻게 (HOW) — 파이프라인 8단계

`brief.yaml`의 `mode`가 `staged`(기본)면 ★게이트에서 SA 확인을 받고, `oneshot`이면 게이트 없이 진행하되 연구 신뢰도 라벨은 유지한다.

1. **인테이크** — SA에게 받는다: 주제, 대상 AWS 서비스, 청중(레벨×직군), 시나리오 수/제목, 소요시간, 형식(부스/실습/발표주도), 언어, 고객사(이름·로고·업종·기술레벨), `mode`. → `brief.yaml`
2. **연구 ★** — `references/research-discipline.md`대로 기능을 웹+AWS문서로 검증. GA/리전/preview와 신뢰도 라벨(검증/문서/추정)을 붙인 `feature-facts.md`. 추정을 검증으로 위장 금지.
3. **청사진 ★** — 시나리오 아크·씬 분해·기능→씬 매핑·데이터셋 요구·다이어그램 목록. → `blueprint.md`
4. **생성** — `references/templates/`로 기능장·씬·데이터셋(+로케일)·다이어그램·이미지 매니페스트를 채운다. 고객 맞춤은 `references/branding.md`.
5. **조립** — `assets/scaffold/`를 `scripts/new-workshop.sh`로 복사·치환 → VitePress config/nav/i18n 배선 → 빌드.
6. **페르소나 평가** — `references/persona-rubric.md`의 레벨×직군 패널(청중에 맞는 셀만). 병렬 리뷰 → 심각도 정렬 → blocker/major 적용 → 재빌드.
7. **QA 게이트** — `scripts/workshop-check.sh`(에셋·데이터셋·발표자노트·플로우) + 빌드 통과.
8. **핸드오프** — 이미지 캡처 매니페스트(`scripts/image-manifest.mjs`), 발표자 노트, Amplify 배포 안내.

## 하네스 계약 (반드시 준수)

단계별 게이트·절차·산출물 I/O·모델 예산·실패 처리는 `references/pipeline-contract.md`에 전부 명시돼 있다. 실행 전 이 문서를 읽고, 특히 공통 불변식을 지킨다: **산출물은 파일로**(다음 단계는 파일을 읽음), **모델은 난이도로 선택**(어려운 추론엔 opus+high, 병렬·기계적 단계엔 저렴한 모델) + **스톨 내성**(재시도·작업 분할·시드 압축·resume), **구조화출력 실패는 셀 단위 격리**, **brief.yaml은 read-only SSOT**, **요청 수==산출 수 검증**, **신뢰도 라벨 보존**. staged 모드는 ★게이트(연구·청사진)에서 SA 서명, oneshot도 동일 통과조건을 검사해 위반 시 중단.

## 규칙 (협상 불가)

- **제품 스크린샷은 생성하지 않는다.** `<Screenshot>` 슬롯은 실제 캡처 대상으로만 매니페스트에 남긴다. SD/Bedrock 이미지는 개념 삽화·배경·페르소나용으로만, 라벨을 붙여서.
- **아키텍처·플로우 다이어그램은 공식 AWS 아이콘**(drawio AWS4 / `aws-diagram-design`)으로 실제 생성한다. 임의 아이콘 금지.
- **고객 로고·이름**은 실제 SA 주도 고객 워크샵의 co-branding에만. 로고 원본은 고객/브랜드 소스에서. **날조된 추천사·가짜 인용 금지.**
- **발표자 전용 문구**(녹화 지시·시연 눈속임)는 `docs/` 밖 `PRESENTER_NOTES.md`에만. 배포 페이지에 새지 않게.

## 참조

형식 규격 `references/format-spec.md` · 컴포넌트 문법 `references/component-api.md` · 템플릿 `references/templates/` · 페르소나 `references/persona-rubric.md` · 연구 규율 `references/research-discipline.md` · 다이어그램 `references/diagram-recipes.md` · 브랜딩 `references/branding.md`.
