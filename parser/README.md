# Lecture Site Parser

Modular, component-based markdown parser for lecture study guides.  
Each **block handler** and **part parser** runs only when its pattern matches — nothing runs unless needed.

Aligned with [`SCHEMA.md`](../SCHEMA.md) v1.0.

---

## Architecture

```
markdown text
     │
     ▼
parseDocument()          ← splits lectures by config.lectureSplit
     │
     ▼
parseLecture()           ← splits ## parts, parses intro preamble
     │
     ▼
parsePart()              ← PartRegistry: MCQ / debug / trace / design / detail
     │
     ├── specialized? → parseMCQ, parseDebug, parseTraceExercise…
     │
     └── default      → parseDetailPart → parseBlocks()
                              │
                              ▼
                         BlockRegistry (first match wins)
                              │
                    fence → callout → schema blocks → table → … → paragraph
```

---

## Quick start

```js
import { createParser } from './lecture-site-engine/parser/index.js';

// Default config (المحاضرة split, all SCHEMA block types)
const { parseDocument } = createParser();
const doc = parseDocument(markdownString);

// Kotlin site override
const kotlinParser = createParser({
  config: {
    lectureSplit: /(?=^# المختبر )/m,
    lectureHeading: /^# المختبر /,
  },
});

console.log(doc.lectures[0].parts[0].blocks);
```

---

## Block registry — add a custom handler

Handlers are tried in **priority order** (higher first).  
Register extras before defaults by passing them to `createParser`:

```js
const parser = createParser({
  blockHandlers: [{
    id: 'my-custom-block',
    priority: 95,                        // runs before most defaults
    test: (ctx) => ctx.trimmed.startsWith('#### 🧪'),
    parse: (ctx) => ({
      block: { type: 'lab-note', text: ctx.trimmed },
      nextIndex: ctx.i + 1,
    }),
  }],
});
```

### Built-in block handlers

| id | Trigger | Output `type` |
| --- | --- | --- |
| `fence` | ` ```lang ` / ` ```algorithm ` / ` ```diagram ` | `code`, `algorithm`, `diagram` |
| `h4-callout` | `#### مهم للامتحان ⚠️:` etc. | `callout` |
| `h4-schema-analogy` | `#### 💡 التشبيه:` | `analogy` |
| `h4-schema-trade-off` | `#### ⚖️ المقايضة:` | `trade-off` |
| `h4-schema-before-after` | `#### 🔄 قبل / بعد:` | `before-after` |
| `h4-schema-trace` | `#### 🔍 تتبع التنفيذ:` | `trace` |
| `h4-algorithm-section` | `#### ⚙️ الخطوات / الخوارزمية:` | `algorithm-section` |
| `h4-emoji-headings` | 💻 🛠️ 🤔 📊 🖼️ code/diagram/screen/think | various |
| `h4-generic` | any other `####` | `h4` |
| `h3` | `###` | `h3` |
| `table` | GFM pipe table | `table` |
| `blockquote` | `> ` | `blockquote` |
| `qa-card` | `**Q1:**` | `qa-card` |
| `inline-meta` | imports, expected-output, compare, etc. | various |
| `ol` / `ul` | numbered / bullet lists | `ol` / `ul` |
| `hr` | `---` | `hr` |
| `paragraph` | fallback | `paragraph` |

List registered handlers:

```js
parser.blockRegistry.listIds();
```

---

## Part registry — specialized ## sections

Specialized parsers run **only** when the `##` title matches their regex:

| Match in title | Parser | Result shape |
| --- | --- | --- |
| `MCQ` / `اختيار من متعدد` | `parseMCQ` | `{ questions: [...] }` |
| `تصحيح` | `parseDebug` | `{ questions: [{ blocks }] }` |
| `تتبع` | `parseTraceExercise` | `{ questions: [{ blocks }] }` |
| `تصميم` / `صمّم` | `parseDesignQuestion` | `{ questions: [{ required, blocks, criteria }] }` |
| `نظرية` | `parseTheory` | `{ questions: [{ answer }] }` |
| `تمارين` / `تمرين` | `parseExercise` | `{ questions: [{ blocks }] }` |
| anything else | `parseDetailPart` | `{ blocks, subsections }` |

Add a custom part parser:

```js
import { PartRegistry } from './parts/registry.js';
import { createPartRegistry } from './parts/index.js';

const registry = createPartRegistry({ config, parseBlocksFn });
registry.register({
  match: /مختبر عملي/i,
  type: 'lab',
  icon: '🔬',
  parser: (title, body, ctx) => ({
    title, type: 'lab', icon: '🔬',
    blocks: ctx.parseBlocksFn(body),
  }),
});

const parser = createParser({ partRegistry: registry, config });
```

---

## Folder layout

```
parser/
├── index.js              ← createParser() — main entry
├── config/
│   └── default-config.js ← lectureSplit, partTypes, callouts
├── core/
│   ├── context.js        ← ParseContext (line cursor)
│   ├── collectors.js     ← collectBlockquote, parseTable, collectFence…
│   ├── slug.js           ← slugify, extractSubsections
│   └── utils.js          ← normalizeCodeLang, parseAlgorithmLines
├── blocks/
│   ├── registry.js       ← BlockRegistry class
│   ├── handlers.js       ← all default block handlers (one file, grouped)
│   └── index.js          ← createBlockRegistry(), parseBlocks()
├── parts/
│   ├── registry.js       ← PartRegistry class
│   ├── handlers.js       ← MCQ, debug, exercise, theory, trace, design
│   └── index.js          ← createPartRegistry(), parsePart()
├── document/
│   └── index.js          ← parseDocument(), parseLecture(), buildSectionIndex()
└── diagram/
    └── parse-yaml.js     ← minimal ```diagram fence parser
```

---

## Wiring into a subject site

Replace the monolithic `parser.js` import:

```js
// Before (kotlin/js/app.js)
import { parseDocument } from './parser.js';

// After
import { createParser } from '../lecture-site-engine/parser/index.js';
import { GUIDE_CONFIG } from './guide-config.js';

const { parseDocument, buildSectionIndex } = createParser({
  config: {
    lectureSplit: GUIDE_CONFIG.lectureSplit,
    lectureHeading: GUIDE_CONFIG.lectureHeading,
    partTypes: GUIDE_CONFIG.partTypes,
    callouts: GUIDE_CONFIG.callouts,
    arabicKey: GUIDE_CONFIG.arabicKey,
  },
});
```

The renderer (`renderer.js`) stays in each subject site — it consumes the parsed JSON tree produced here.

---

## Output shape

```js
{
  lectures: [{
    id: 'lec1',
    title: '# المحاضرة 1 — ...',
    tag: 'Kotlin Basics',
    intro: [ /* blocks from preamble */ ],
    parts: [{
      title: 'الجزء الأول: الشرح التفصيلي',
      type: 'detail',
      icon: '📖',
      blocks: [
        { type: 'h3', text: '1. Topic', id: '1-Topic' },
        { type: 'analogy', title: '💡 التشبيه:', content: '...' },
        { type: 'algorithm', steps: [{ num, step, tool, detail }] },
        { type: 'code', lang: 'kotlin', code: '...' },
      ],
      subsections: [{ level: 3, text: '1. Topic', id: '...' }],
    }, {
      title: 'الجزء الثالث: MCQ',
      type: 'mcq',
      questions: [{ num, difficulty, question, options, correct, explain }],
    }],
  }]
}
```
