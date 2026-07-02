import { DEFAULT_CONFIG } from './config/default-config.js';
import { createBlockRegistry, parseBlocks as runParseBlocks } from './blocks/index.js';
import { createPartRegistry, parsePart as runParsePart } from './parts/index.js';
import { parseDocument as runParseDocument, parseLecture as runParseLecture, buildSectionIndex as buildSectionIndexFn } from './document/index.js';

/**
 * Create a fully wired parser instance.
 *
 * @param {object} [options]
 * @param {object} [options.config] — override DEFAULT_CONFIG (lectureSplit, partTypes, callouts…)
 * @param {Array} [options.blockHandlers] — extra block handlers (higher priority = runs first)
 * @param {import('./parts/registry.js').PartRegistry} [options.partRegistry] — custom part registry
 *
 * @example
 * const { parseDocument } = createParser({
 *   config: { lectureSplit: /^# المختبر /m, lectureHeading: /^# المختبر / },
 * });
 * const doc = parseDocument(markdown);
 */
export function createParser(options = {}) {
  const config = { ...DEFAULT_CONFIG, ...options.config };

  const blockRegistry = createBlockRegistry(options.blockHandlers || []);
  const partRegistry = options.partRegistry || createPartRegistry({
    config,
    parseBlocksFn: (text) => runParseBlocks(text, config, blockRegistry),
  });

  const parsePartFn = (chunk) => runParsePart(
    chunk,
    config,
    partRegistry,
    (text) => runParseBlocks(text, config, blockRegistry),
  );

  return {
    config,
    blockRegistry,
    partRegistry,
    parseBlocks: (text) => runParseBlocks(text, config, blockRegistry),
    parsePart: parsePartFn,
    parseLecture: (text, index) => runParseLecture(text, index, config, parsePartFn),
    parseDocument: (md) => runParseDocument(md, config, parsePartFn),
    buildSectionIndex: buildSectionIndexFn,
  };
}

/** Default singleton parser — drop-in for subject sites. */
export const defaultParser = createParser();

export const parseDocument = defaultParser.parseDocument;
export const parseLecture = defaultParser.parseLecture;
export const parseBlocks = defaultParser.parseBlocks;
export const parsePart = defaultParser.parsePart;
export const buildSectionIndex = defaultParser.buildSectionIndex;

export { DEFAULT_CONFIG } from './config/default-config.js';
export { BlockRegistry } from './blocks/registry.js';
export { PartRegistry } from './parts/registry.js';
export { createBlockRegistry } from './blocks/index.js';
export { createPartRegistry } from './parts/index.js';
export { ParseContext } from './core/context.js';
