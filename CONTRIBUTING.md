# Contributing lecture content

## What you can change

Contributors should **only** edit files under:

```
subjects/year-{1-5}/{subject-id}/lectures/*.md
```

Do **not** edit `lectures/manifest.json` `files` by hand — CI and `npm run validate` auto-sync entries from `par*.md` (icons, badges for `parN-secN.md`).

Do **not** modify `parser/`, `renderer/`, `site-shell/`, or `build/` unless you are a maintainer.

## Add or update a lecture

1. Copy `subjects/_template/` to `subjects/year-N/your-subject/` (maintainer may do this once).
2. Generate `custom_prompt.md` from `meta-prompt.md` + `subject-brief.yaml`.
3. Use AI to produce `lectures/parN.md` following `SCHEMA.md`.
4. Open a Pull Request to `main` — **Validate lectures** auto-syncs `manifest.json` from your new files.

**الطريقة الأسهل:** افتح [/contrib/](https://shahd-abbara.github.io/lecture-site-engine/contrib/) → اختر المادة → ارفع `parN.md` مباشرة على GitHub (بدون Decap CMS).

## CI on Pull Request

Workflow **Validate lectures** runs automatically:

- `npm test` — engine smoke test
- Validates every **changed subject** (`npm run validate`)

If validation fails, the PR check is red — **do not merge** until fixed.

## After merge

Workflow **Deploy GitHub Pages** runs on `main`:

- Restores previous `dist/` from cache
- Builds changed subjects and any subject missing from `dist/`
- Generates `dist/index.html` (hub page)
- Deploys to GitHub Pages

## Local commands

```bash
npm run validate -- --subject year-3/my-subject
npm run build -- --subject year-3/my-subject
cd dist/year-3/my-subject && python3 -m http.server 8080
```

## manifest.json

Keep `settings`, `title`, `subtitle`, and optional `lectureIcons` / `lectureMatIcons` in `lectures/manifest.json`. The `files` array is **auto-generated** when you run validate, build, or open a PR:

| Filename | Auto entry |
| --- | --- |
| `par1.md` | `num: 1`, icon from `lectureIcons[0]` |
| `par1-sec1.md`, `par1-sec2.md` | same `num: 1`, badge `المحاضرة ١ — جزء ١` etc., distinct icons per file |

Example after sync for split lectures:

```json
"files": [
  { "path": "par1-sec1.md", "num": 1, "icon": "🔒", "matIcon": "lock", "badge": "المحاضرة ١ — جزء ١" },
  { "path": "par1-sec2.md", "num": 1, "icon": "⚙️", "matIcon": "settings", "badge": "المحاضرة ١ — جزء ٢" }
]
```

Icons cycle through `lectureIcons` / `lectureMatIcons` in file order. Override badges or icons by editing `manifest.json` after the first sync if needed.

### settings

Each subject must have `lectures/manifest.json` with:

```json
"settings": {
  "subjectName": "اسم المادة",
  "subjectNameEn": "English name",
  "year": "2025-2026",
  "academicYear": 3,
  "theme": "amber-default",
  "department": "القسم"
}
```

Themes: see `themes/themes.json`.
