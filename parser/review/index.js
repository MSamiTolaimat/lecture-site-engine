import { enrichCodeLineMaps } from '../blocks/index.js';
import { extractSubsections } from '../core/slug.js';

/**
 * Parse a single review guide markdown file into structured parts.
 * Uses the shared block parser — no subject-specific logic.
 *
 * Section split strategy:
 * 1. Document title from first `#`
 * 2. Optional intro: first `##` block before any `#` major section
 * 3. Major sections split on `#` headings
 * 4. Within each major section, split on `##` (or treat whole body as one part)
 * 5. If no `#` sections exist, split the entire body on `##`
 *
 * @param {string} md
 * @param {{ parseBlocksFn: (text: string) => object[] }} deps
 */
export function parseReviewGuide(md, deps) {
  const { parseBlocksFn } = deps;

  const titleMatch = md.match(/^# (.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : 'مراجعة شاملة';
  let body = md.replace(/^# .+\n/m, '').trim();
  body = body.replace(/^>[\s\S]*?(?=\n---|\n## |\n# )/m, '').trim();

  /** @type {Array<{ title: string, type: string, blocks: object[], subsections: object[] }>} */
  const parts = [];

  const introMatch = body.match(/^## ([^\n]+)\n([\s\S]*?)(?=^# )/m);
  if (introMatch) {
    parts.push(makeReviewPart(introMatch[1].trim(), introMatch[2].trim(), parseBlocksFn));
    body = body.replace(introMatch[0], '').trim();
  }

  const majorSections = body.split(/(?=^# )/m).filter(s => /^# /.test(s));

  if (majorSections.length) {
    for (const section of majorSections) {
      const secTitle = section.match(/^# (.+)$/m)?.[1]?.trim() || '';
      const secBody = section.replace(/^# .+\n/m, '').replace(/^---+\s*/m, '').trim();
      parts.push(...splitMajorSection(secTitle, secBody, parseBlocksFn));
    }
  } else {
    for (const section of body.split(/(?=^## )/m).filter(s => /^## /.test(s))) {
      const secTitle = section.match(/^## (.+)$/m)?.[1]?.trim() || '';
      const secBody = section.replace(/^## .+\n/m, '').replace(/^---+\s*/m, '').trim();
      if (!secBody) continue;
      parts.push(makeReviewPart(secTitle, secBody, parseBlocksFn));
    }
  }

  const goalMatch = md.match(/\*\*الهدف:\*\*\s*(.+)/);
  const tag = goalMatch ? goalMatch[1].replace(/\*\*/g, '').trim() : '';

  return {
    id: 'review-full',
    kind: 'review',
    title,
    tag,
    parts,
  };
}

/**
 * @param {string} parentTitle
 * @param {string} body
 * @param {Function} parseBlocksFn
 */
function splitMajorSection(parentTitle, body, parseBlocksFn) {
  const isCheat = /cheat sheet|شيت|Cheat/i.test(parentTitle);
  const subsections = body.split(/(?=^## )/m).filter(p => /^## /.test(p));

  if (subsections.length) {
    return subsections.map(item => {
      const itemTitle = item.match(/^## (.+)$/m)?.[1]?.trim() || '';
      const itemBody = item.replace(/^## .+\n/m, '').replace(/^---+\s*/m, '').trim();
      const title = isCheat ? itemTitle : `${parentTitle} — ${itemTitle}`;
      return makeReviewPart(title, itemBody, parseBlocksFn, isCheat ? 'cheat' : 'detail');
    });
  }

  if (!body) return [];
  return [makeReviewPart(parentTitle, body, parseBlocksFn, isCheat ? 'cheat' : 'detail')];
}

/**
 * @param {string} title
 * @param {string} body
 * @param {Function} parseBlocksFn
 * @param {string} [type]
 */
function makeReviewPart(title, body, parseBlocksFn, type) {
  const partType = type || (/cheat sheet|شيت|Cheat/i.test(title) ? 'cheat' : 'detail');
  const blocks = enrichCodeLineMaps(parseBlocksFn(body));
  return {
    title,
    type: partType,
    blocks,
    subsections: extractSubsections(body),
  };
}
