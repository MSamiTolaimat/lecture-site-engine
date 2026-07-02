# Lecture Site Renderer

Modular HTML renderer for parsed lecture documents. Mirrors the parser architecture: **block registry** + **part registry**, with handlers invoked only when their type matches.

Aligned with [`SCHEMA.md`](../SCHEMA.md) v1.0 and [`parser/`](../parser/).

---

## Architecture

```
parsed lecture JSON
     │
     ▼
renderLecture() / renderCodeGuide() / renderReview()
     │
     ▼
renderPart()              ← PartRegistry: mcq / debug / trace / design / detail…
     │
     ├── specialized? → renderMCQ, renderTrace, renderDesign…
     │
     └── default      → renderBlocks()
                              │
                              ▼
                         BlockRenderRegistry (first match wins)
                              │
                    code → callout → analogy → algorithm → … → unknown fallback
```

---

## Quick start

```js
import { createRenderer } from './lecture-site-engine/renderer/index.js';
import { GUIDE_CONFIG } from './kotlin/js/guide-config.js';

const { renderLecture, initInteractivity } = createRenderer({ config: GUIDE_CONFIG });

// After DOM mount:
document.getElementById('content').innerHTML = renderLecture(lecture, accent, icon, refs);
initInteractivity(); // MCQ, qa-card, copy-code, line-explain (once at app init)
```

### Kotlin site (wired)

`kotlin/js/renderer.js` is a thin wrapper:

```js
import { createRenderer } from '../../lecture-site-engine/renderer/index.js';
export const { renderLecture, initInteractivity, … } = createRenderer({ config: GUIDE_CONFIG });
```

---

## Block registry — add a custom handler

Handlers are tried in registration order; **first match wins**. Register extras before defaults:

```js
const renderer = createRenderer({
  config: GUIDE_CONFIG,
  blockRenderers: [{
    id: 'my-widget',
    match: (b) => b.type === 'my-widget',
    render: (b, ctx) => `<div class="my-widget">${b.text}</div>`,
  }],
});
```

### Built-in block handlers

| id | `type` | Notes |
| --- | --- | --- |
| `h3` | `h3` | Section heading with anchor |
| `paragraph` | `paragraph` | Inline markdown |
| `blockquote` | `blockquote` | Quote or study tip |
| `code` | `code` | Terminal UI + copy / line-explain |
| `diagram` | `diagram` | Delegates to `kotlin/js/diagram.js` |
| `callout` | `callout` | Exam / note / lesson boxes |
| `compare` | `compare` | Wrong vs right |
| `analogy` | `analogy` | 💡 highlighted card |
| `trade-off` | `trade-off` | Option A vs B table |
| `before-after` | `before-after` | Side-by-side code panels |
| `trace` | `trace` | Step table with state column |
| `algorithm` | `algorithm` | Vertical flow: boxes + ↓ arrows |
| `algorithm-section` | `algorithm-section` | Purpose + flow + execution notes |
| `qa-card` | `qa-card` | Flip card (toggle via `initInteractivity`) |
| `unknown` | *(fallback)* | `console.warn` + visible error div |

Structural blocks (`code-title`, `diagram-title`, `h4` with peek-ahead) are handled in `renderBlocks()` orchestration, not the registry.

---

## Part registry

| `type` | Renderer |
| --- | --- |
| `mcq` | `renderMCQ` — progress bar + option buttons |
| `debug` | `renderDebug` — accordion per question |
| `exercise` | `renderExercise` — open accordion |
| `theory` | `renderTheory` — model answer reveal |
| `trace` | `renderTrace` — incomplete table + solution `<details>` |
| `design` | `renderDesign` — prompt + criteria + answer reveal |
| *(default)* | `renderBlocks` on `part.blocks` |

---

## Interactivity

Call `initInteractivity()` once at app startup (idempotent). Handles:

- **MCQ** — `.mcq-opt` click → score + feedback
- **qa-card** — toggle answer visibility
- **copy-code** — clipboard copy from `.code-terminal`
- **line-explain** — gutter hover tooltips in explain mode

Exports `pickMCQ` and `updateMCQProgress` for manual refresh after dynamic render.

---

## Config options

Pass via `createRenderer({ config })`:

| Key | Purpose |
| --- | --- |
| `defaultTitle` | AI disclaimer site name |
| `sectionRefPattern` | `§3.2` cross-link regex |
| `siteHashBody` | In-page hash link pattern (`#lec1-p2` etc.) |

---

## Folder layout

```
renderer/
├── index.js              ← createRenderer()
├── core/
│   ├── escape.js
│   ├── inline-md.js      ← setRefContext / inlineMd
│   └── icons.js          ← ms(), PART_MAT_ICONS
├── blocks/
│   ├── registry.js
│   ├── index.js          ← renderBlocks()
│   └── handlers.js
├── parts/
│   ├── registry.js
│   ├── index.js          ← renderPart()
│   └── handlers.js
├── lecture/
│   └── index.js          ← renderLecture, buildTocData
└── interactivity/
    └── index.js          ← initInteractivity()
```

---

## Future work

- Move `diagram.js` into `lecture-site-engine/diagram/` (remove kotlin coupling)
- Extract shared CSS for new block types (`algorithm-flow`, `trade-off-col-a`)
- Wire remaining subject sites (`software_eng/`, `data-operations/`, …)
