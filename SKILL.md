---
name: workshop-scaffold
description: Generate a complete hands-on AWS workshop from a topic, scenarios, and target customer. Produces a proven quick-* VitePress site (feature catalog, scenario labs, sample datasets, AWS architecture diagrams, image slots, customer co-branding) and evaluates it with a level×role persona panel to lock in improvements. Triggers: "build a workshop", "workshop scaffold/builder", "make a hands-on workshop", "이 주제로 워크샵 만들어줘", "핸즈온 워크샵 스캐폴드".
---

# Workshop Scaffold

## What this skill does (WHAT)

Take a topic + scenarios + target customer (level, role, industry, logo) and produce **one complete quick-\* VitePress workshop**. The format is specified in `references/format-spec.md`; the empty skeleton lives in `assets/scaffold/`. Keep text minimal — explain with diagrams and image slots.

This skill is self-contained: a user with nothing but this skill can build and deploy a workshop end to end. The skeleton (`assets/scaffold/`), the scripts (`scripts/`), and the reference docs are all bundled here.

## When to use it (WHY)

- The format is already proven in the `ai-passport` and `media-briefing` workshops → fill this skeleton instead of building from scratch every time.
- AWS capabilities must be verified fresh (GA/region/preview), not recalled from memory → a research gate is built into the pipeline.
- To prevent a workshop that only makes sense to its author → a level×role persona panel actually reads it and produces concrete improvements.

## How (HOW) — the 8-stage pipeline

If `brief.yaml`'s `mode` is `staged` (default), stop at each ★ gate for SA sign-off; if `oneshot`, proceed without stopping but check the same pass conditions and preserve the research confidence labels.

1. **Intake** — collect from the SA: topic, target AWS services, audience (level×role), scenario count/titles, duration, format (booth / hands-on / presenter-led), languages, customer (name, logo, industry, tech level), and `mode`. → `brief.yaml`
2. **Research ★** — verify each feature via web + AWS docs per `references/research-discipline.md`. Record GA/region/preview and a confidence label (verified / documented / assumed / needs-check) in `artifacts/02-feature-facts.md`. Never disguise an assumption as verified.
3. **Blueprint ★** — scenario arc, scene decomposition (difficulty), feature→scene mapping, dataset requirements, diagram list, open questions. → `artifacts/03-blueprint.md`
4. **Generate** — fill feature pages, scenes, datasets (+ locales), diagrams, and the image manifest using `references/templates/` and `references/diagram-recipes.md`. Customer tailoring per `references/branding.md`.
5. **Assemble** — copy the skeleton with `scripts/new-workshop.sh`, wire up VitePress config / nav / i18n, and build.
6. **Persona review** — run the level×role panel from `references/persona-rubric.md` (only the cells matching the audience). Parallel reviews → severity-sorted → apply blocker/major fixes → rebuild.
7. **QA gate** — `scripts/workshop-check.sh` (assets, datasets, presenter notes, flows) + a passing build.
8. **Handoff** — image capture manifest (`scripts/image-manifest.mjs`), presenter notes, deploy instructions, remaining needs-check / known limitations.

## Two ways to run the pipeline

- **Interactively (default)** — you (Claude Code) drive the 8 stages directly, following this file and the harness contract. Best for `staged` mode where the SA reviews at each ★ gate.
- **As a workflow** — `assets/workshop-pipeline.workflow.mjs` encodes the pipeline as a multi-agent Workflow (parallel research/generation/persona cells with structured outputs). Use it for `oneshot` or when you want maximum parallelism. It requires the user to opt into workflow orchestration. The workflow honors the same gates and invariants as the interactive path.

## Getting started from nothing

```bash
# 1. Create the workshop skeleton in a new folder and substitute basic values
bash scripts/new-workshop.sh ../my-workshop --title "ACME × Bedrock" --name my-workshop --color "#0972d3"
cd ../my-workshop && npm install && npm run docs:dev   # preview the empty skeleton

# 2. Run the skill to fill it: invoke /workshop-scaffold (or "build a workshop about …")
#    Intake writes brief.yaml, then stages 2–8 fill and verify the content.
```

## Harness contract (must follow)

Every gate, procedure, artifact I/O, model budget, and failure-handling rule is spelled out in `references/pipeline-contract.md`. Read it before running and honor the common invariants: **artifacts are files** (the next stage reads the file), **choose the model by difficulty** (strongest model + high effort for the hardest reasoning; cheap models for parallel/mechanical stages) **with stall resilience** (retry / split / compress / resume), **isolate structured-output failures per cell**, **`brief.yaml` is a read-only SSOT**, **verify request-count == output-count**, **preserve confidence labels**. In `staged` mode the SA signs off at the ★ gates (research, blueprint); `oneshot` checks the same pass conditions and stops on violation.

## Rules (non-negotiable)

- **Never generate a product screenshot.** `<Screenshot>` slots are left as real capture targets in the manifest. Stable Diffusion / Bedrock images are for conceptual illustration, backgrounds, and persona avatars only — and always labeled.
- **Architecture and flow diagrams use official AWS icons** (drawio AWS4 / the `aws-diagram-design` skill). No improvised icons.
- **Customer logos/names** are only for a genuine SA-led customer workshop's co-branding. Source logos from the customer / official brand assets. **No fabricated testimonials or fake quotes.**
- **Presenter-only wording** (recording cues, demo sleight-of-hand) lives only in `PRESENTER_NOTES.md`, outside `docs/` — never leaking into the deployed pages.

## References

Format spec `references/format-spec.md` · component API `references/component-api.md` · templates `references/templates/` · personas `references/persona-rubric.md` · research discipline `references/research-discipline.md` · diagrams `references/diagram-recipes.md` · branding `references/branding.md` · workflow `assets/workshop-pipeline.workflow.mjs` · example run `examples/hanbitpay/`.
