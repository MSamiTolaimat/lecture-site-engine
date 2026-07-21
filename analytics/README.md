# Study-site analytics (PostHog + Clarity)

**Microsoft Clarity** stays for heatmaps and session recordings.
**PostHog Cloud (EU)** is added so every study event carries full context
(`subject`, `page`, `content_type`, `active_seconds`, …) as **event properties**
— queryable together via HogQL and dashboards.

Both receive the same study signals. Clarity uses the familiar custom tags /
event names (`scroll_75`, `lecture_session_end`, …). PostHog stores structured
properties on each event so you can answer cross-cutting questions in SQL.

## One-time PostHog setup

1. Create an account at [eu.posthog.com](https://eu.posthog.com) (EU region).
2. Create a project named `lecture-site-engine`.
3. Copy the **Project API Key** (`phc_…`) → GitHub secret `POSTHOG_KEY`
   (also set as Netlify env `POSTHOG_KEY` if you use the sandbox).
4. Optionally set `POSTHOG_HOST=https://eu.i.posthog.com` (default in build).
5. Create a **Personal API Key** with project access → local/CI secret
   `POSTHOG_PERSONAL_API_KEY` (never ship this to the browser).
6. Note the numeric **Project ID** → `POSTHOG_PROJECT_ID`.
7. Provision dashboards:

```bash
export POSTHOG_PERSONAL_API_KEY=phx_…
export POSTHOG_PROJECT_ID=12345
npm run analytics:setup
```

Clarity project ID `xim6tigbcd` stays hardcoded (same as before) — no secret needed.

## What is tracked

### Engagement (sessions)

| Event (PostHog) | Clarity event | When | Key properties / tags |
|-----------------|---------------|------|------------------------|
| `$pageview` / `content_viewed` | tags only (`page`, …) | Home, lecture, DAWRAT, note, exam open | `subject`, `page`, `content_type`, `content_id` |
| `scroll_milestone` | `scroll_25` … `scroll_100` | Scroll depth | above + `milestone_pct` |
| `study_idle` | `{type}_idle` | 2 min without activity | above + `idle_after_seconds` |
| `study_session_end` | `{type}_session_end` | Leave content | above + `active_seconds`, `max_scroll_pct` |
| `focus_milestone` | `{type}_focus_1min` / `_5min` / `_15min` | Focus thresholds | above + `focus_minutes` |
| `hub_pageview` | `hub_pageview` | Hub index load | `site_env`, `page` |
| `hub_subject_click` | `hub_subject_click` | Subject card click | `subject_id`, `year` |

### Learning UX

| Event | When | Key properties |
|-------|------|----------------|
| `mcq_answered` | Pick an MCQ option (lecture or practice exam) | `qid`, `is_correct`, `source` (`lecture`\|`exam`), `picked_key` |
| `exam_mode_opened` | Open practice exam / mistakes bank | `exam_mode` |
| `exam_started` | Practice exam questions shown | `exam_mode`, `question_count`, `lecture_count` |
| `exam_finished` | Finish practice exam | `percent`, `correct_count`, `wrong_count`, `elapsed_seconds` |
| `lecture_progress_toggled` | Mark lecture complete / incomplete | `lecture`, `completed`, `source`, `subject_percent` |
| `search_performed` | Search query (debounced) | `query_len`, `result_count`, `has_results` (no raw query text) |
| `search_result_clicked` | Click a search hit | `lec_id`, `entry_id`, `entry_kind`, `rank` |
| `search_opened` | Open search via navbar / shortcut | `trigger` |
| `toc_navigated` | TOC / sidebar jump | `target_id`, `part_type`, `is_subsection` |
| `jump_to_summary` | Jump to summary button | `target_id`, `lecture`, `trigger` |
| `expand_original_toggled` | Expand original text mode | `enabled`, `source` |
| `theme_changed` | Dark / light toggle | `theme` |
| `content_load_failed` | Lecture / search / exam load error | `failure_kind`, `message` (truncated) |

Super properties (PostHog, subject pages): `subject`, `storage_prefix`, `site_env`
(`production` / `sandbox` / `local`).

## Build wiring

- Clarity loader: always present in `site-shell/index.html` and hub/stub pages
- PostHog placeholders: `__POSTHOG_KEY__`, `__POSTHOG_HOST__`
- Replaced at build by `build/lib/patch-analytics.mjs` from env vars
- Empty `POSTHOG_KEY` → PostHog off, Clarity still runs (local default)
- Deploy workflow injects `POSTHOG_KEY` from GitHub Actions secrets

## Export / backup (PostHog)

```bash
export POSTHOG_PERSONAL_API_KEY=phx_…
export POSTHOG_PROJECT_ID=12345
npm run analytics:export
npm run analytics:export -- --days 7 --format csv
```

Writes under `analytics/exports/` (gitignored). Optional weekly CI:
`.github/workflows/analytics-export.yml` uploads an artifact.

## Ad-hoc HogQL

Saved queries live in `analytics/queries/`. Paste into PostHog → SQL editor, or
run via `analytics:export` (summaries file).

Example — average focus time per lecture:

```sql
SELECT
  properties.subject,
  properties.content_id,
  avg(toFloat(properties.active_seconds)) AS avg_focus_sec,
  count() AS sessions
FROM events
WHERE event = 'study_session_end'
  AND properties.content_type = 'lecture'
GROUP BY 1, 2
ORDER BY sessions DESC
LIMIT 20
```

## Privacy notes

- No PII in custom properties (subject / lecture IDs only)
- PostHog session replay uses `maskAllInputs: true`
- PostHog autocapture is off — only explicit study events are sent
- Clarity continues its own session recording / heatmaps
