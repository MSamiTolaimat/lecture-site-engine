import { PartRenderRegistry } from './registry.js';
import { createDefaultPartHandlers } from './handlers.js';
import { renderBlocks } from '../blocks/index.js';

/**
 * @param {Array<{ type: string, render: Function }>} [extraHandlers]
 */
export function createPartRegistry(extraHandlers = []) {
  const registry = new PartRenderRegistry();
  for (const h of createDefaultPartHandlers(extraHandlers)) {
    registry.register(h);
  }
  return registry;
}

/**
 * @param {object} part
 * @param {object} ctx — { partId, registry, blockRegistry, ... }
 */
export function renderPart(part, ctx) {
  const registry = ctx.partRegistry || createPartRegistry();
  const blockCtx = {
    ...ctx,
    partType: part.type,
    registry: ctx.blockRegistry,
  };

  const specialized = registry.render(part.type, part, { ...blockCtx, partId: ctx.partId });
  if (specialized !== null) return specialized;

  const codeCounterRef = ctx.codeCounterRef || { n: 0 };
  if (part.type === 'cheat') {
    return `<div class="prose-content">${renderBlocks(part.blocks, { ...blockCtx, codeCounterRef })}</div>`;
  }
  return renderBlocks(part.blocks, { ...blockCtx, codeCounterRef });
}
