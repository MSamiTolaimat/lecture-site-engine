/**
 * PartRenderRegistry — first matching part type wins.
 */
export class PartRenderRegistry {
  constructor() {
    /** @type {Array<{ type: string, render: Function }>} */
    this.handlers = [];
  }

  /** @param {{ type: string, render: Function }} handler */
  register(handler) {
    this.handlers.push(handler);
    return this;
  }

  /** @param {string} type @param {object} part @param {object} ctx */
  render(type, part, ctx) {
    for (const h of this.handlers) {
      if (h.type === type) return h.render(part, ctx);
    }
    return null;
  }

  listTypes() {
    return this.handlers.map(h => h.type);
  }
}
