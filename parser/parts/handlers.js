import { slugify, extractSubsections } from '../core/slug.js';
import { parseBlocks, enrichCodeLineMaps } from '../blocks/index.js';

/** @param {string} title @param {string} body @param {{ parseBlocksFn: Function }} ctx */
export function parseDetailPart(title, body, ctx) {
  const blocks = ctx.parseBlocksFn(body);
  enrichCodeLineMaps(blocks);
  return {
    title,
    type: ctx.type,
    icon: ctx.icon,
    blocks,
    subsections: extractSubsections(body),
  };
}

/** @param {string} text @param {object} config */
export function parseMCQ(text, config) {
  const arabicKey = config.arabicKey || {};
  return text
    .split(/(?=^(?:#{3,4} |\*\*)السؤال \d+)/m)
    .filter(c => /^(?:#{3,4} |\*\*)السؤال \d+/.test(c.trim()))
    .map(chunk => {
      const hm = chunk.match(/^(?:#{3,4} |\*\*)السؤال (\d+) \((.+?)\)(?:\*\*)?/);
      const num = hm ? hm[1] : '?';
      const difficulty = hm ? hm[2].trim() : 'متوسط';
      const answerM = chunk.match(/\*\*الإجابة الصحيحة:?\s*([أ-يabcd])\s*\*\*/i);
      const correct = answerM ? (arabicKey[answerM[1].toLowerCase()] || answerM[1].toLowerCase()) : '';
      const explainM = chunk.match(/\*\*التعليل:\*\*\s*([\s\S]+?)(?=\n---|\n(?:#{3,4} |\*\*)السؤال |$)/);
      const explain = explainM ? explainM[1].trim() : '';

      const before = chunk.split(/\*\*الإجابة الصحيحة/)[0];
      const body = before.replace(/^(?:#{3,4} |\*\*)السؤال .+\n/m, '').trim();
      const qLines = [];
      const options = [];
      const optRe = /^([أ-يabcd])\)\s*(.+)/i;

      for (const line of body.split('\n')) {
        const t = line.trim();
        if (!t || t === '---') continue;
        const om = t.match(optRe);
        if (om) {
          const key = arabicKey[om[1].toLowerCase()] || om[1].toLowerCase();
          options.push({ key, text: om[2].trim() });
        } else if (!options.length) {
          qLines.push(t);
        }
      }

      return { num, difficulty, question: qLines.join(' '), options, correct, explain };
    });
}

/** @param {string} text @param {{ parseBlocksFn: Function }} ctx */
export function parseDebug(text, ctx) {
  return text
    .split(/(?=^### سؤال تصحيح )/m)
    .filter(c => /^### سؤال تصحيح /.test(c))
    .map(chunk => {
      const hm = chunk.match(/^### (سؤال تصحيح \d+)/);
      const title = hm ? hm[1] : 'سؤال تصحيح';
      const blocks = ctx.parseBlocksFn(chunk.replace(/^### .+\n/m, ''));
      enrichCodeLineMaps(blocks);
      return { title, blocks };
    });
}

/** @param {string} text @param {{ parseBlocksFn: Function }} ctx */
export function parseExercise(text, ctx) {
  return text
    .split(/(?=^### (?:\d+\.\s*)?تمرين)/m)
    .filter(c => /^### (?:\d+\.\s*)?تمرين/.test(c))
    .map(chunk => {
      const hm = chunk.match(/^### ((?:\d+\.\s*)?تمرين[^\n]+)/);
      const title = hm ? hm[1].trim() : 'تمرين';
      const blocks = ctx.parseBlocksFn(chunk.replace(/^### .+\n/m, ''));
      enrichCodeLineMaps(blocks);
      return { title, blocks, id: slugify(title) };
    });
}

/** @param {string} text */
export function parseTheory(text) {
  return text
    .split(/(?=^### سؤال )/m)
    .filter(c => /^### سؤال /.test(c) && !c.includes('تصحيح') && !c.includes('تصميم'))
    .map(chunk => {
      const hm = chunk.match(/^### (سؤال \d+:\s*.+)/);
      const title = hm ? hm[1].trim() : 'سؤال';
      const answerM = chunk.match(/\*\*نموذج الإجابة:\*\*\s*([\s\S]+?)(?=\n---|\n### |$)/);
      const answer = answerM ? answerM[1].trim() : '';
      return { title, answer, id: slugify(title) };
    });
}

/** @param {string} text @param {{ parseBlocksFn: Function }} ctx */
export function parseTraceExercise(text, ctx) {
  return text
    .split(/(?=^### (?:تمرين تتبع|تتبع))/m)
    .filter(c => /^### (?:تمرين تتبع|تتبع)/.test(c))
    .map(chunk => {
      const hm = chunk.match(/^### ([^\n]+)/);
      const title = hm ? hm[1].trim() : 'تمرين تتبع';
      const blocks = ctx.parseBlocksFn(chunk.replace(/^### .+\n/m, ''));
      return { title, blocks, id: slugify(title) };
    });
}

/** @param {string} text @param {{ parseBlocksFn: Function }} ctx */
export function parseDesignQuestion(text, ctx) {
  return text
    .split(/(?=^### (?:سؤال تصميم|تصميم))/m)
    .filter(c => /^### (?:سؤال تصميم|تصميم)/.test(c))
    .map(chunk => {
      const hm = chunk.match(/^### ([^\n]+)/);
      const title = hm ? hm[1].trim() : 'سؤال تصميم';
      const requiredM = chunk.match(/\*\*المطلوب:\*\*\s*([\s\S]+?)(?=\*\*نموذج الإجابة|\*\*معايير|$)/);
      const required = requiredM ? requiredM[1].trim() : '';
      const answerM = chunk.match(/\*\*نموذج الإجابة:\*\*\s*([\s\S]+?)(?=\*\*معايير|$)/);
      const answerBody = answerM ? answerM[1].trim() : chunk.replace(/^### .+\n/m, '').trim();
      const criteriaM = chunk.match(/\*\*معايير التقييم:\*\*\s*([\s\S]+?)(?=\n---|\n### |$)/);
      const criteria = criteriaM
        ? criteriaM[1].trim().split('\n').map(l => l.replace(/^[-*]\s*/, '').trim()).filter(Boolean)
        : [];
      const blocks = ctx.parseBlocksFn(answerBody);
      enrichCodeLineMaps(blocks);
      return { title, required, blocks, criteria, id: slugify(title) };
    });
}
