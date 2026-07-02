/**
 * PartRegistry — maps ## headings to specialized part parsers.
 * Each entry: { match, type, icon, parser(body, ctx) }
 * If no specialized parser matches, falls back to detail parser.
 */
export class PartRegistry {
  constructor() {
    /** @type {Array<{ match: RegExp, type: string, icon: string, parser: Function|null }>} */
    this.specialized = [];
    /** @type {Function|null} */
    this.detailParser = null;
  }

  /** Register a specialized part parser (checked before detail fallback). */
  register({ match, type, icon, parser }) {
    this.specialized.push({ match, type, icon, parser });
    return this;
  }

  setDetailParser(parser) {
    this.detailParser = parser;
    return this;
  }

  /** @param {string} title @param {string} body @param {object} ctx */
  parse(title, body, ctx) {
    for (const entry of this.specialized) {
      if (entry.match.test(title)) {
        return entry.parser(title, body, { ...ctx, type: entry.type, icon: entry.icon });
      }
    }
    if (this.detailParser) {
      return this.detailParser(title, body, { ...ctx, type: 'detail', icon: '📖' });
    }
    return { title, type: 'detail', icon: '📖', blocks: [], subsections: [] };
  }
}
