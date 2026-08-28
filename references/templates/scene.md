# 템플릿 · 실습 씬 (scenario-{x}/scene{n}.md)

스토리형 실습 한 장면. 참가자가 따라 하며 다음 씬으로 자연스럽게 이어진다. 실제 예: `ai-passport docs/scenario-a/scene1.md`.

```md
# Scene {{n}} · {{장면 제목}}

<FeatureMeta scenario="{{A}}" scenes="{{Scene 1 · 슬라이드 3}}" icon="{{아이콘키}}" />

> {{장면을 여는 내러티브 1~2문장. 사용자가 처한 상황.}}

{{무슨 일이 벌어지는지 1~2문장. 관련 기능은 [링크](/features/{{id}}).}}

<Screenshot src="/images/{{scenario_a}}/{{scene1}}.png" alt="{{화면}}" caption="{{캡션}}" />

## 무슨 일이 일어나는가

| 기능 | 동작 |
|------|------|
| **{{기능}}** | {{이 씬에서 하는 일}} |

## 진행 흐름

{{참가자가 실제로 누르는·입력하는 순서. 다음 씬으로의 전환을 명시.}}
→ [Scene {{n+1}}](./scene{{n+1}})로 이어집니다.

## 이 장면의 기능

<FeatureLinks ids="{{a-01-xxx,a-02-yyy}}" />

## 핵심 포인트

::: talk
- "{{발표자 대사 — 이 장면의 메시지}}"
:::

## 관련 데이터셋

- `{{scenario_a/xxx.csv}}` — {{역할}}
```

## 채움 규칙

- 씬은 **하나의 use_case**(brief.yaml)에 대응. 아크 전체가 use_cases를 커버하게.
- `무슨 일이 일어나는가` 표의 기능은 전부 features/에 페이지가 있어야 하고 `<FeatureLinks ids>`와 일치.
- 인접 씬 간 **난이도 점프 금지**(페르소나 평가의 감점 축).
- 다음 씬 전환을 반드시 명시 — 스토리가 끊기지 않게.
