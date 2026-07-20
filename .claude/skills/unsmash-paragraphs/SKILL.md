---
name: unsmash-paragraphs
description: Diagnoses and fixes "smashed paragraphs" on this site — bullet points, numbered steps, or other structured lines that render as one run-on paragraph (joined by spaces/dashes) instead of separate list items or blocks. Use this whenever the user says content looks "smashed", "run together", "merged", "not spaced out", or points at a lecture/notes/DAWRAT page where text that should clearly be separate lines/bullets is showing up as one dense paragraph. This is almost always a parser bug (in parser/core/collectors.js or parser/blocks/handlers.js), not a content-authoring problem — fix it at the parser level so it's solved for every lecture at once, not by manually reformatting one file.
---

# Unsmashing paragraphs

## Why this happens

This site's markdown parser (`parser/blocks/handlers.js`, backed by helpers in `parser/core/collectors.js`) decides what kind of block a line starts — heading, list, table, paragraph — using a registry of handlers tried in priority order (see `createDefaultBlockHandlers()`). A **paragraph** is the fallback: any line that isn't itself recognized as something structural gets grabbed by `collectParagraph()`, which then keeps pulling in every following non-blank line and joins them all with a single space — until it hits a blank line or something `isStructural()` recognizes (headings, `---`, code fences, tables, blockquotes).

The bug class: `collectParagraph()` used to have no idea what a list item looks like. So `**Title**` (a plain bold line, not itself a list marker) followed immediately by `- item one` / `- item two` with **no blank line in between** got treated as one continuous paragraph — the bullets never got a chance to be recognized by the `ul`/`ol` handlers, because paragraph collection swallowed them first. The fix already shipped: `collectParagraph` now stops (from the second line onward) when it hits a line matching `^[-*]\s+` or `^\d+\.\s+`, so the list handler gets a turn on the next pass. That one fix applies to every lecture file already — it's not something to redo per file.

If you hit a *different* flavor of this same symptom, the cause is the same shape: some line pattern that should stop paragraph collection isn't being recognized as structural, so the fallback paragraph handler eats content it shouldn't.

## How to diagnose it fast

1. **Confirm it's real, not just visual wrapping.** Long lines legitimately wrap across several visual lines in a narrow viewport — that's not a bug. The actual bug is content that should clearly be *separate list items or blocks* (visibly starts with `-`, `1.`, or is its own logical unit in the source `.md`) ending up as one paragraph with everything joined by spaces or awkward inline dashes.

2. **Check what DOM element the text landed in.** Open the page (or ask to preview it) and run in the browser:
   ```js
   [...document.querySelectorAll('p,li')].filter(e => e.textContent.includes('<a distinctive word from the smashed text>'))
     .map(e => ({ tag: e.tagName, text: e.textContent.slice(0, 150) }))
   ```
   If a chunk that should be 3 `<li>`s comes back as one `<p>` containing all three, that confirms a paragraph swallowed a list (or whatever structural block it should have been).

3. **Find the source markdown** for that exact text (`grep` the subject's `.md` files) and look at the raw lines. Check specifically:
   - Is there a blank line between a heading/bold line and the following list? (Missing blank lines are the most common trigger.)
   - Does the "smashed" content include a marker type that isn't `-`, `*`, or `N.` — e.g. a custom convention this subject's content uses that `isStructural()` (in `parser/core/collectors.js`) doesn't know about (only recognizes `#` headings, `---`, code fences, tables, `> ` blockquotes)?

4. **Read `collectParagraph()` and `collectList()`** in `parser/core/collectors.js` to see exactly where the loop keeps going instead of stopping. The fix is almost always: add one more line-pattern check to the paragraph collector's stop condition (or, more rarely, to `isStructural()` if the swallowed thing is a block type other than a list — a table, a blockquote, a custom marker).

## How to fix it

- Change the **stop condition**, not the content. Don't go rewrite the `.md` files to add blank lines everywhere as a workaround — that's fragile (every future lecture would need the same manual treatment) and doesn't fix the real bug for content nobody's looked at yet.
- Keep the fix narrow: only stop collecting on the pattern you've confirmed is the problem. Don't broaden `isStructural()` or the paragraph stop-check to swallow unrelated cases "just in case" — that risks breaking paragraphs that legitimately contain a line starting with something list-marker-shaped as prose (rare, but check).
- After the fix, **rebuild the affected subject** (`node build/cli.mjs --subject <year-N/subject-id>`) and re-run the same DOM check from step 2 to confirm the text now lands in the right elements (`<li>` instead of `<p>`, etc.).
- A parser change like this affects every subject, not just the one you noticed it in — a quick broader check (parse all lecture files without crashing, e.g. loop `parseDocument()` over every `subjects/**/*.md`) is good hygiene, but per the user's instruction this doesn't need a full test pass every time — use judgment on how much verification the specific change warrants.

## Where to look

- `parser/core/collectors.js` — `collectParagraph`, `collectList`, `isStructural` — the actual stop-condition logic.
- `parser/blocks/handlers.js` — the registry of block handlers (`ul`, `ol`, `paragraph`, headings, etc.) and their priority/test order — useful if the issue is a handler never getting a chance to run rather than a collector not stopping.
