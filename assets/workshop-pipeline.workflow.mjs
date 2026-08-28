export const meta = {
  name: 'workshop-pipeline',
  description: 'Build a quick-* AWS workshop end to end: research → blueprint → generate → assemble → persona review → QA → handoff',
  whenToUse: 'Run the workshop-scaffold pipeline as a multi-agent workflow (oneshot or max-parallelism). Honors the same gates/invariants as the interactive path.',
  phases: [
    { title: 'Research' },
    { title: 'Blueprint' },
    { title: 'Generate' },
    { title: 'Assemble' },
    { title: 'Persona' },
    { title: 'QA' },
    { title: 'Handoff' },
  ],
}

// The workshop root (where brief.yaml lives). Pass via Workflow args; default to CWD.
const ROOT = (args && args.root) || '.'
const REFS = 'references' // relative to the installed skill; agents resolve real paths from the skill dir

// --- schemas (gate structured outputs) ---
const FEATURE_FACTS = {
  type: 'object',
  required: ['features', 'artifactPath'],
  properties: {
    artifactPath: { type: 'string' },
    features: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'status', 'inRegion', 'confidence'],
        properties: {
          name: { type: 'string' },
          status: { enum: ['GA', 'preview', 'not-available'] },
          inRegion: { type: 'boolean' },
          confidence: { enum: ['verified', 'documented', 'assumed', 'needs-check'] },
          designImplication: { type: 'string' },
        },
      },
    },
    regionBlockers: { type: 'array', items: { type: 'string' } },
  },
}
const BLUEPRINT = {
  type: 'object',
  required: ['scenes', 'artifactPath'],
  properties: {
    artifactPath: { type: 'string' },
    scenes: {
      type: 'array',
      items: {
        type: 'object',
        required: ['scenario', 'scene', 'features'],
        properties: {
          scenario: { type: 'string' },
          scene: { type: 'string' },
          difficulty: { type: 'integer' },
          features: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    openQuestions: { type: 'array', items: { type: 'string' } },
  },
}
const WROTE = {
  type: 'object',
  required: ['path', 'ok'],
  properties: { path: { type: 'string' }, ok: { type: 'boolean' }, note: { type: 'string' } },
}
const REVIEW = {
  type: 'object',
  required: ['persona', 'findings'],
  properties: {
    persona: { type: 'string' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['severity', 'where', 'fix'],
        properties: {
          severity: { enum: ['blocker', 'major', 'minor'] },
          where: { type: 'string' },
          issue: { type: 'string' },
          fix: { type: 'string' },
        },
      },
    },
  },
}

// ── Stage 2: Research ★ ─────────────────────────────────────────
phase('Research')
const facts = await agent(
  `Read ${ROOT}/brief.yaml. Follow ${REFS}/research-discipline.md exactly. For every AWS feature the scenarios rely on, verify GA/preview status and whether it is available in the brief's region (verify freshly — web/docs, do not recall). Assign one confidence label per feature: verified | documented | assumed | needs-check, with confirmed_date and valid_until. Resolve any region mismatch with an alternative (region/service/scope). WRITE the full result to ${ROOT}/artifacts/02-feature-facts.md as a table + per-feature design implications (this file is the source of truth; INV-1). Return the structured summary.`,
  { phase: 'Research', schema: FEATURE_FACTS, effort: 'high' }
)
if (facts && facts.regionBlockers && facts.regionBlockers.length) {
  log(`Region blockers unresolved: ${facts.regionBlockers.join('; ')} — resolve before generation (GATE-2a).`)
}

// ── Stage 3: Blueprint ★ ────────────────────────────────────────
phase('Blueprint')
const blueprint = await agent(
  `Read ${ROOT}/brief.yaml and ${ROOT}/artifacts/02-feature-facts.md. Produce the workshop blueprint: scenario arc, scene decomposition with a difficulty (1..N; adjacent scenes jump ≤1; ≤2 new concepts per scene — GATE-3b), feature→scene mapping, dataset requirements, diagram list, image-slot outline, and open questions. Respect the format from ${REFS}/format-spec.md. WRITE to ${ROOT}/artifacts/03-blueprint.md (INV-1). Preserve every confidence label from feature-facts as a column in the scene tables (INV-6). Return the structured summary.`,
  { phase: 'Blueprint', schema: BLUEPRINT, effort: 'high' }
)
const scenes = (blueprint && blueprint.scenes) || []
if (blueprint && blueprint.openQuestions && blueprint.openQuestions.length) {
  log(`Open questions must be closed before generation (GATE-3a): ${blueprint.openQuestions.join('; ')}`)
}

// ── Stage 4: Generate (parallel over scenes) ────────────────────
phase('Generate')
// Each scene page is an independent cell (INV-3: a failed cell doesn't sink the rest).
const scenePages = await parallel(
  scenes.map((sc, i) => () =>
    agent(
      `Using ${REFS}/templates/scene.md and ${REFS}/component-api.md, write the page for ${sc.scenario} / ${sc.scene} into ${ROOT}/docs/${sc.scenario.toLowerCase().startsWith('scenario') ? sc.scenario.toLowerCase() : 'scenario-' + sc.scenario.toLowerCase()}/${sc.scene.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'scene' + (i + 1)}.md. Features to exercise: ${(sc.features || []).join(', ')}. Include ::: prompt and ::: talk callouts and <Screenshot> slots for any product screen (never AI-generate screenshots). Keep the confidence labels from the blueprint visible. Return {path, ok}.`,
      { phase: 'Generate', schema: WROTE, label: `scene:${sc.scenario}/${sc.scene}` }
    )
  )
)
const wrote = scenePages.filter(Boolean)
log(`Scene pages written: ${wrote.filter((w) => w.ok).length}/${scenes.length}`)
// INV-5: request count == output count
if (wrote.length !== scenes.length) log(`WARN count mismatch: requested ${scenes.length}, got ${wrote.length} (INV-5).`)

// Feature catalog + datasets + diagrams (one agent, reads the files above)
await agent(
  `Read ${ROOT}/artifacts/03-blueprint.md. Fill the feature catalog pages (${REFS}/templates/feature.md) into ${ROOT}/docs/features/, update ${ROOT}/docs/.vitepress/data/features.ts and flows.ts to match (INV-5), generate the required datasets under ${ROOT}/demo_datasets/ (satisfying scene logic — GATE-4a) with a mapping table in ${ROOT}/docs/reference/datasets.md, and produce diagrams per ${REFS}/diagram-recipes.md (official AWS icons). Record every image slot in ${ROOT}/artifacts/04-image-manifest.json. Report what you wrote.`,
  { phase: 'Generate' }
)

// ── Stage 5: Assemble ───────────────────────────────────────────
phase('Assemble')
await agent(
  `In ${ROOT}: ensure config.mts nav/sidebar/i18n reflect the generated scenarios and features, then run \`npm install && npm run docs:build\`. Fix every build error and dead link until the build passes (GATE-5). Report the last line of the build log.`,
  { phase: 'Assemble', effort: 'high' }
)

// ── Stage 6: Persona review (parallel cells) ────────────────────
phase('Persona')
// Read the active audience cells from brief.yaml, review in parallel, isolate failures (INV-3).
const personaList = await agent(
  `Read ${ROOT}/brief.yaml audience (level×role) and ${REFS}/persona-rubric.md. Return the active persona cells to review as a JSON array of short persona descriptors.`,
  { phase: 'Persona', schema: { type: 'object', required: ['personas'], properties: { personas: { type: 'array', items: { type: 'string' } } } } }
)
const personas = (personaList && personaList.personas) || []
const reviews = (
  await parallel(
    personas.map((p) => () =>
      agent(
        `You are the persona: ${p}. Read the built workshop under ${ROOT}/docs and the blueprint. Following ${REFS}/persona-rubric.md, give at least 2 concrete findings with severity (blocker|major|minor), where, and a specific fix (GATE-6b — "it's all good" is invalid). Return the structured review.`,
        { phase: 'Persona', schema: REVIEW, label: `persona:${p}` }
      )
    )
  )
).filter(Boolean)
if (reviews.length !== personas.length) log(`WARN persona panel incomplete: ${reviews.length}/${personas.length} (GATE-6a) — re-run missing cells.`)
const blockers = reviews.flatMap((r) => (r.findings || []).filter((f) => f.severity === 'blocker'))
const majors = reviews.flatMap((r) => (r.findings || []).filter((f) => f.severity === 'major'))
if (blockers.length || majors.length) {
  await agent(
    `Apply these persona fixes to the workshop under ${ROOT}, then rebuild. Blockers (must reach 0 — GATE-6c): ${JSON.stringify(blockers)}. Majors: ${JSON.stringify(majors)}. Report which you applied and any blocker you could not resolve (hand off as a known limitation).`,
    { phase: 'Persona', effort: 'high' }
  )
}

// ── Stage 7: QA gate ────────────────────────────────────────────
phase('QA')
await agent(
  `In ${ROOT}: run \`bash scripts/workshop-check.sh --full\` (assets, datasets, presenter-notes, flows + build). Confirm no presenter-only wording leaked into docs/, list unresolved image slots. Fix the mechanical issues; report anything needing judgment. WRITE ${ROOT}/artifacts/07-qa-report.md.`,
  { phase: 'QA' }
)

// ── Stage 8: Handoff ────────────────────────────────────────────
phase('Handoff')
const handoff = await agent(
  `In ${ROOT}: run \`node scripts/image-manifest.mjs .\` to list capture-pending screenshots. WRITE ${ROOT}/artifacts/08-handoff.md with: the capture manifest, a pointer to PRESENTER_NOTES.md, the Amplify deploy steps, and remaining needs-check / known limitations (re-verify any facts past valid_until before deploy — GATE-8). Report the handoff path.`,
  { phase: 'Handoff' }
)

return {
  featureFacts: facts && facts.artifactPath,
  blueprint: blueprint && blueprint.artifactPath,
  scenesWritten: wrote.filter((w) => w.ok).length,
  personaReviews: reviews.length,
  handoff: handoff,
}
