import { esc } from './escape.js';
import { ms } from './icons.js';

/** @type {{ lectureRef: string|null, sectionMap: Record<string, string> }|null} */
let refContext = null;

/** @type {{ sectionRefPattern: RegExp, siteHashBody: string }|null} */
let mdConfig = null;

const DEFAULT_SITE_HASH_BODY = '(?:lec\\d+(?:-p\\d+)?(?:-s\\d+)?|review-codes(?:-p\\d+)?|roadmap|home|guide)';

export function initInlineMd(config = {}) {
  mdConfig = {
    sectionRefPattern: config.sectionRefPattern || /§(\d+(?:\.\d+)*)/g,
    siteHashBody: config.siteHashBody || DEFAULT_SITE_HASH_BODY,
  };
}

function getSiteHashRe() {
  const body = mdConfig?.siteHashBody || DEFAULT_SITE_HASH_BODY;
  return {
    full: new RegExp(`#(${body})\\b`, 'g'),
    code: new RegExp(`^#(${body})$`),
  };
}

export function setRefContext(ctx) {
  refContext = ctx;
}

export function clearRefContext() {
  refContext = null;
}

function renderSiteHashLink(hash, label) {
  const display = label ?? `#${hash}`;
  return `<a href="#${esc(hash)}" class="site-hash-link" title="اذهب إلى ${esc(display)}">${esc(display)}</a>`;
}

function renderSectionRefLink(sectionNum, anchorId) {
  const hash = `#${anchorId}`;
  const title = `اذهب إلى §${sectionNum} في الشرح`;
  return `<a href="${hash}" class="lecture-ref-link" title="${esc(title)}" aria-label="${esc(title)}">` +
    `<span class="lecture-ref-link__badge" aria-hidden="true">` +
    `<span class="material-symbols-outlined lecture-ref-link__icon">menu_book</span>` +
  `§${esc(sectionNum)}</span></a>`;
}

function applySectionRefs(text) {
  if (!refContext?.sectionMap || !refContext.lectureRef) return text;
  const pattern = mdConfig?.sectionRefPattern || /§(\d+(?:\.\d+)*)/g;
  const placeholders = [];
  const withMarkers = text.replace(pattern, (full, sectionNum) => {
    const anchorId = refContext.sectionMap[sectionNum];
    if (!anchorId) return full;
    const key = `@@REF${placeholders.length}@@`;
    placeholders.push({ key, sectionNum, anchorId });
    return key;
  });
  return { withMarkers, placeholders };
}

export function inlineMd(text) {
  if (!text) return '';
  const { full: SITE_HASH_FULL_RE, code: SITE_HASH_CODE_RE } = getSiteHashRe();

  const mdLinks = [];
  let s = text.replace(/\[([^\]]+)\]\(#([^)]+)\)/g, (_, label, hash) => {
    const key = `@@MDLNK${mdLinks.length}@@`;
    mdLinks.push({ key, label, hash });
    return key;
  });

  const refData = applySectionRefs(s);
  s = typeof refData === 'string' ? refData : refData.withMarkers;
  const refPlaceholders = typeof refData !== 'string' ? refData.placeholders : [];

  s = esc(s);
  s = s.replace(/`([^`]+)`/g, (_, code) => {
    const hashMatch = code.match(SITE_HASH_CODE_RE);
    if (hashMatch) {
      const h = hashMatch[1];
      return `<a href="#${h}" class="site-hash-link"><code>#${h}</code></a>`;
    }
    return `<code>${code}</code>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  s = s.replace(SITE_HASH_FULL_RE, (match, hash, offset, full) => {
    const before = full.slice(Math.max(0, offset - 12), offset);
    if (/href=["']$/.test(before) || /<a [^>]*$/.test(before)) return match;
    return `<a href="#${hash}" class="site-hash-link">#${hash}</a>`;
  });

  for (const { key, label, hash } of mdLinks) {
    s = s.replace(esc(key), `<a href="#${esc(hash)}" class="site-hash-link">${esc(label)}</a>`);
  }

  if (refPlaceholders.length) {
    for (const p of refPlaceholders) {
      s = s.replace(
        esc(p.key),
        renderSectionRefLink(p.sectionNum, p.anchorId),
      );
    }
  }
  return s;
}
