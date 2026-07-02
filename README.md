# Lecture Site Engine

Token-efficient prompt pipeline for turning PDF lectures into interactive study-guide sites. Output is **marker-based Markdown** (not JSON) — compatible with existing site parsers in `kotlin/`, `software_eng/`, `data-operations/`, `programming_lang/`.

## Quick start

### 1. Choose or create a subject brief

Copy the master template:

```bash
cp subject-brief.template.yaml my-subject.yaml
```

Or start from an example in [`examples/`](examples/):

| File | Subject |
| --- | --- |
| `kotlin-android.yaml` | Android / Kotlin & Compose |
| `data-operations.yaml` | Systems Analysis & Design |
| `software-eng.yaml` | Software Engineering 2 |
| `programming-lang.yaml` | Programming Languages labs |
| `generic-cs.yaml` | Generic CS (OS, signals, etc.) |

Edit `enabled: true/false` for parts and blocks your subject needs.

### 2. Generate `custom_prompt.md` (one time per subject)

Send to Claude (attach all files in one message):

1. [`meta-prompt.md`](meta-prompt.md)
2. [`SCHEMA.md`](SCHEMA.md)
3. Your `my-subject.yaml` (or an example)
4. Relevant files from [`templates/`](templates/) for enabled parts/blocks

Prompt:

```
Generate custom_prompt.md for the attached subject brief.
Follow meta-prompt.md rules. Keep output under 120 lines.
```

Save the response as `custom_prompt.md` in your subject folder (e.g. `kotlin/custom_prompt.md`).

### 3. Extract each lecture (per PDF)

Send:

1. `custom_prompt.md`
2. The PDF lecture (or pasted text)

Save output as `lectures/parN.md`.

### 4. Deploy the site

Add the file to `lectures/manifest.json` and serve statically:

```bash
python3 -m http.server 8080
```

## Folder layout

```
lecture-site-engine/
├── meta-prompt.md              # Meta-prompt → custom_prompt.md
├── SCHEMA.md                   # Fixed block markers (parser contract)
├── subject-brief.template.yaml # Master template (all parts/blocks)
├── subject-brief.yaml          # → copy template or use examples/
├── templates/                  # Compact snippets for enabled parts
├── examples/                   # Filled briefs per subject
├── parser/                     # Modular block + part parser (see parser/README.md)
├── renderer/                   # Modular block + part HTML renderer (see renderer/README.md)
└── rerender/                   # (future) lint / validate CLI
```

## Pipeline

```
subject-brief.yaml  ──┐
SCHEMA.md           ──┼──► meta-prompt.md ──► custom_prompt.md
templates/          ──┘                              │
                                                     ▼
                                              PDF lecture
                                                     │
                                                     ▼
                                              lectures/parN.md
                                                     │
                                                     ▼
                                    parser/ → renderer/ → static site
```

## Parts reference (enable in brief)

| Key | Site parser type | Typical use |
| --- | --- | --- |
| `integration_map` | detail | Course roadmap table |
| `detail` | detail | Main explanation |
| `summary` | summary | Tables, glossary |
| `mcq` | mcq | Multiple choice |
| `debug` | debug | Fix buggy code |
| `exercise` | exercise | Fill gaps, code fix |
| `analysis_exercise` | exercise | Case studies (no code) |
| `interpreter_exercise` | exercise | Full interpreter labs |
| `theory` | theory | Exam essay questions |
| `cheat_sheet` | cheat | Quick reference |
| `qa_cards` | qa | Q&A flip cards |
| `reference_code` | reference | Full project code |
| `checklist` | summary | Self-review checklist |

## Blocks reference (enable in brief)

| Key | Use when |
| --- | --- |
| `code` | Real code snippets |
| `line_explain` | Line-by-line code explanation |
| `diagrams` | BPMN, flowchart, DFD + `diagram` YAML |
| `uml` | Use case, class, activity diagrams |
| `screen_description` | GIS / IDE screenshots (text only) |
| `structured_english` | Analysis pseudocode (not real code) |
| `fill_gaps` / `code_fix` | Exercise subtypes |
| `think_prompt` | Self-check questions |
| `callouts` | Exam tips, notes, lessons |

Full marker syntax: [`SCHEMA.md`](SCHEMA.md).

## Token tips (free Claude tier)

- Do **not** re-attach `SCHEMA.md` with every lecture — only `custom_prompt.md` + PDF.
- Keep `custom_prompt.md` under 120 lines (meta-prompt enforces this).
- If a lecture is cut off, ask for parts separately: "الجزء الأول والثاني فقط".
- Markdown markers use fewer tokens than JSON.

## Aligning with `guide-config.js`

Set in your brief:

- `lecture.unit_label` → must match parser split (`المختبر` vs `المحاضرة`)
- `lecture.split_regex` → same as `lectureSplit` in guide-config
- Part headings → must contain keywords in `partTypes` regex (e.g. `MCQ`, `تصحيح`, `تمارين`)

## Future work

- Wire `parser/` into remaining subject sites (replace per-site `parser.js`)
- Wire `renderer/` into remaining subject sites (kotlin done)
- `rerender/` — `lint lectures/par1.md` against SCHEMA.md
