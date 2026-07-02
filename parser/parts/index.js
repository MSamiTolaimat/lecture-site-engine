import { PartRegistry } from './registry.js';
import {
  parseDetailPart,
  parseMCQ,
  parseDebug,
  parseExercise,
  parseTheory,
  parseTraceExercise,
  parseDesignQuestion,
} from './handlers.js';
import { detectPartMeta } from '../core/utils.js';

/**
 * Build a part registry with all default specialized parsers.
 * Specialized parsers are invoked only when the ## title matches.
 *
 * @param {{ parseBlocksFn: Function, config: object }} deps
 * @param {PartRegistry} [registry]
 */
export function createPartRegistry(deps, registry = new PartRegistry()) {
  const ctx = { parseBlocksFn: deps.parseBlocksFn, config: deps.config };

  registry
    .register({ match: /MCQ|اختيار من متعدد/i, type: 'mcq', icon: '🎯', parser: (title, body) => ({
      title, type: 'mcq', icon: '🎯', questions: parseMCQ(body, deps.config),
    }) })
    .register({ match: /تصحيح/i, type: 'debug', icon: '🐛', parser: (title, body) => ({
      title, type: 'debug', icon: '🐛', questions: parseDebug(body, ctx),
    }) })
    .register({ match: /تتبع/i, type: 'trace', icon: '🔍', parser: (title, body) => ({
      title, type: 'trace', icon: '🔍', questions: parseTraceExercise(body, ctx),
    }) })
    .register({ match: /تصميم|صمّم/i, type: 'design', icon: '📐', parser: (title, body) => ({
      title, type: 'design', icon: '📐', questions: parseDesignQuestion(body, ctx),
    }) })
    .register({ match: /نظرية/i, type: 'theory', icon: '📝', parser: (title, body) => ({
      title, type: 'theory', icon: '📝', questions: parseTheory(body),
    }) })
    .register({ match: /تمارين|تمرين|مفسّر|مفسر/i, type: 'exercise', icon: '💻', parser: (title, body) => ({
      title, type: 'exercise', icon: '💻', questions: parseExercise(body, ctx),
    }) })
    .setDetailParser(parseDetailPart);

  return registry;
}

/**
 * Parse one ## part chunk.
 * @param {string} chunk — full text starting with `## title`
 * @param {object} config
 * @param {PartRegistry} partRegistry
 * @param {Function} parseBlocksFn
 */
export function parsePart(chunk, config, partRegistry, parseBlocksFn) {
  const titleMatch = chunk.match(/^## (.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : '';
  const body = chunk.replace(/^## .+\n/m, '').trim();
  const meta = detectPartMeta(title, config);

  // Try specialized registry first (by title keyword)
  const specialized = partRegistry.specialized.find(e => e.match.test(title));
  if (specialized) {
    return specialized.parser(title, body, {
      parseBlocksFn,
      config,
      type: specialized.type,
      icon: specialized.icon,
    });
  }

  // Detail / summary / cheat / reference / qa — all use block parser
  return parseDetailPart(title, body, {
    parseBlocksFn,
    config,
    type: meta.type,
    icon: meta.icon,
  });
}
