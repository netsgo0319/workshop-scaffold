# workshop-scaffold

SA가 **워크샵 주제 · 시나리오 · 대상 고객**을 던지면, 사내에서 검증된 quick-\* VitePress 형식으로 워크샵 한 벌을 만들어 주는 Claude Code 스킬.

기능 카탈로그 · 시나리오 실습 · 샘플 데이터셋 · AWS 아키텍처 다이어그램 · 이미지 슬롯 · 고객 co-branding 을 생성하고, **레벨×직군 페르소나 패널**로 평가·개선까지 한다. 텍스트는 최소, 다이어그램·비주얼로 설명.

## 설치

```bash
git clone <this-repo> ~/.claude/skills/workshop-scaffold
# 또는 플러그인 마켓플레이스로 배포
```

## 사용

```
/workshop-scaffold
# 또는: "이 주제로 워크샵 만들어줘: ..."
```

주제·청중(레벨×직군)·시나리오·고객사(이름·로고·업종·기술레벨)·언어·모드를 물어본 뒤 파이프라인을 돈다.

## 파이프라인

인테이크 → 연구(기능 검증) → 청사진 → 생성 → 조립 → **페르소나 평가** → QA 게이트 → 핸드오프.
`mode: staged`(기본, SA 게이트)와 `mode: oneshot`(전자동) 지원.

## 구성

| 경로 | 내용 |
|---|---|
| `SKILL.md` | 오케스트레이터 |
| `references/` | 형식 규격 · 컴포넌트 API · 템플릿 · 페르소나 루브릭 · 연구 규율 · 다이어그램 레시피 · 브랜딩 |
| `assets/scaffold/` | 빈 VitePress 골격 (복사해서 채움) |
| `scripts/` | new-workshop.sh · image-manifest.mjs · workshop-check.sh |
| `PLAN.md` | 설계 계획서 |

## 근거

`ai-passport-quick-workshop`·`quick-media-briefing-workshop` 두 워크샵에서 공통 골격을 추출. 형식·QA·컴포넌트는 발명이 아니라 검증된 패턴의 일반화다.

## 상태

`v0.1.0` — 스킬 뼈대·핵심 레퍼런스 작성. 다음: `assets/scaffold/` 골격 추출, 나머지 레퍼런스, 파이프라인 스크립트, 파일럿(ai-passport 재생성 대조).
