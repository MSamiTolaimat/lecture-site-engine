/**
 * BlockRenderRegistry — ordered handlers; first match wins.
 *
 * Each handler: { id, match(block, ctx), render(block, ctx) }
 */
export class BlockRenderRegistry {
  constructor() {
    /** @type {Array<{ id: string, match: Function, render: Function }>} */
    this.handlers = [];
  }

  /** @param {{ id: string, match: Function, render: Function }} handler */
  register(handler) {
    this.handlers.push(handler);
    return this;
  }

  /** @param {object} block @param {object} ctx */
  render(block, ctx) {
    for (const h of this.handlers) {
      if (h.match(block, ctx)) return h.render(block, ctx);
    }
    return null;
  }

  listIds() {
    return this.handlers.map(h => h.id);
  }
}
