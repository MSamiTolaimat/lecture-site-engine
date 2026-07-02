import { parseBlocks } from '../blocks/index.js';
import { parsePart } from '../parts/index.js';
import { extractTag } from '../core/utils.js';
import { slugify } from '../core/slug.js';

/**
 * @param {object} lecture
 * @returns {Record<string, string>}
 */
export function buildSectionIndex(lecture) {
  const index = {};
  lecture.parts.forEach((part, pi) => {
    const partId = `${lecture.id}-p${pi + 1}`;
    for (const block of part.blocks || []) {
      if ((block.type === 'h3' || block.type === 'h4') && block.text && block.id) {
        const m = block.text.match(/^(\d+(?:\.\d+)*)\.?\s/);
        if (m) index[m[1]] = `${partId}-${block.id}`;
      }
    }
  });
  return index;
}

/**
 * @param {string} text
 * @param {number} index
 * @param {object} config
 * @param {Function} parsePartFn
 */
export function parseLecture(text, index, config, parsePartFn) {
  const titleMatch = text.match(/^# (.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : `محاضرة ${index + 1}`;
  const body = text.replace(/^# .+\n/m, '').trim();
  const firstH2 = body.search(/^## /m);
  const preamble = firstH2 >= 0 ? body.slice(0, firstH2).trim() : '';
  const partsBody = firstH2 >= 0 ? body.slice(firstH2).trim() : body;
  const partChunks = partsBody.split(/(?=^## )/m).filter(p => /^## /.test(p));

  const intro = preamble
    ? parseBlocks(preamble, config).filter(b => b.type !== 'hr')
    : [];

  return {
    id: `lec${index + 1}`,
    title,
    tag: extractTag(title),
    intro,
    parts: partChunks.map(chunk => parsePartFn(chunk)),
  };
}

/**
 * @param {string} md
 * @param {object} config
 * @param {Function} parsePartFn
 */
export function parseDocument(md, config, parsePartFn) {
  const lectures = [];
  const splitRe = config.lectureSplit || /(?=^# )/m;
  const headingRe = config.lectureHeading || /^# /;
  const chunks = md.split(splitRe).filter(Boolean);

  chunks.forEach((chunk, i) => {
    if (headingRe.test(chunk.trim())) {
      lectures.push(parseLecture(chunk.trim(), i, config, parsePartFn));
    }
  });

  if (!lectures.length && md.trim()) {
    lectures.push(parseLecture(md.trim(), 0, config, parsePartFn));
  }

  return { lectures };
}
