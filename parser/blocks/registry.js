/**
 * BlockRegistry — ordered list of handlers; first match wins.
 *
 * Each handler: { id, priority, test(ctx), parse(ctx) }
 * parse() returns { block?, blocks?, nextIndex }
 */
export class BlockRegistry {
  constructor() {
    /** @type {Array<{ id: string, priority: number, test: Function, parse: Function }>} */
    this.handlers = [];
  }

  /** @param {{ id: string, priority?: number, test: Function, parse: Function }} handler */
  register(handler) {
    this.handlers.push({
      priority: handler.priority ?? 0,
      ...handler,
    });
    this.handlers.sort((a, b) => b.priority - a.priority);
    return this;
  }

  /** @param {import('../core/context.js').ParseContext} ctx */
  parse(ctx) {
    for (const h of this.handlers) {
      if (h.test(ctx)) {
        const result = h.parse(ctx);
        if (result) return result;
      }
    }
    return null;
  }

  listIds() {
    return this.handlers.map(h => h.id);
  }
}
