/**
 * ParseContext — cursor over markdown lines.
 * Handlers receive one context and return { block(s), nextIndex }.
 */
export class ParseContext {
  /** @param {string[]} lines @param {number} index @param {object} config */
  constructor(lines, index = 0, config = {}) {
    this.lines = lines;
    this.i = index;
    this.config = config;
  }

  get line() {
    return this.lines[this.i] ?? '';
  }

  get trimmed() {
    return this.line.trim();
  }

  at(index) {
    return new ParseContext(this.lines, index, this.config);
  }

  peek(offset = 1) {
    return (this.lines[this.i + offset] ?? '').trim();
  }
}
