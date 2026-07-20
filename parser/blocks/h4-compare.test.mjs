#!/usr/bin/env node
import { createParser } from '../index.js';

const md = `### الأخطاء

#### الفهم الخاطئ ❌:
الخلط بين \`Schema\` و \`Instance\`.

Schema ثابت نسبياً.

#### الفهم الصحيح ✅:
تغيير Instance لا يتطلب تغيير Schema.

---

#### الفهم الخاطئ ❌: اختصار في نفس السطر.
#### الفهم الصحيح ✅: الصحيح في نفس السطر.
`;

const { parseBlocks } = createParser();
const blocks = parseBlocks(md);
const compares = blocks.filter(b => b.type === 'compare');

if (compares.length !== 2) throw new Error(`expected 2 compare blocks, got ${compares.length}`);
if (!compares[0].wrong.includes('Schema')) throw new Error('missing multi-line wrong');
if (!compares[1].wrong.includes('اختصار')) throw new Error('missing inline wrong');

console.log('h4-compare parser test: OK');
