#!/usr/bin/env node
/**
 * Generate dist/contrib/index.html — easy GitHub upload links (no Decap CMS / OAuth).
 */
import { existsSync } from 'node:fs';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listAllSubjectDirs } from './lib/scaffold-subject.mjs';
import { ENGINE_ROOT } from './lib/subject-paths.mjs';

const REPO = (process.env.GITHUB_REPOSITORY || 'Shahd-Abbara/lecture-site-engine');
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const GH = `https://github.com/${REPO}`;

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** @param {string} subjectRel */
async function subjectTitle(subjectRel) {
  const manifestPath = path.join(ENGINE_ROOT, 'subjects', subjectRel, 'lectures/manifest.json');
  if (existsSync(manifestPath)) {
    try {
      const m = JSON.parse(await readFile(manifestPath, 'utf8'));
      return m.settings?.subjectName || m.title || subjectRel;
    } catch { /* ignore */ }
  }
  return subjectRel;
}

/** @param {string} subjectRel */
function lecturePath(subjectRel) {
  return `subjects/${subjectRel}/lectures`;
}

/** @param {string} subjectRel */
function links(subjectRel) {
  const folder = lecturePath(subjectRel);
  const enc = folder.split('/').map(encodeURIComponent).join('/');
  return {
    newPar: `${GH}/new/${BRANCH}/${enc}?filename=parN.md`,
    upload: `${GH}/upload/${BRANCH}/${enc}`,
    folder: `${GH}/tree/${BRANCH}/${enc}`,
  };
}

async function main() {
  const subjects = (await listAllSubjectDirs()).filter(s =>
    existsSync(path.join(ENGINE_ROOT, 'subjects', s, 'lectures')),
  );

  const cards = await Promise.all(subjects.map(async s => {
    const title = await subjectTitle(s);
    const y = s.match(/^year-(\d)/)?.[1] || '?';
    const L = links(s);
    return `
      <article class="card">
        <span class="card__year">السنة ${y}</span>
        <h2 class="card__title">${esc(title)}</h2>
        <p class="card__path">${esc(lecturePath(s))}/</p>
        <div class="actions">
          <a class="btn btn--primary" href="${L.newPar}" target="_blank" rel="noopener">➕ محاضرة جديدة (parN.md)</a>
          <a class="btn" href="${L.upload}" target="_blank" rel="noopener">📤 رفع ملف</a>
          <a class="btn btn--ghost" href="${L.folder}" target="_blank" rel="noopener">📁 عرض المجلد</a>
        </div>
      </article>`;
  }));

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>رفع محاضرة — طريقة سهلة</title>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'IBM Plex Sans Arabic', sans-serif; margin: 0; padding: 2rem 1.5rem; background: #f0f4f8; color: #1a1a1a; line-height: 1.6; }
    .wrap { max-width: 720px; margin: 0 auto; }
    h1 { font-size: 1.5rem; margin: 0 0 0.5rem; }
    .lead { color: #555; margin: 0 0 1.5rem; }
    .steps { background: #fff; border-radius: 12px; padding: 1.25rem 1.5rem; margin-bottom: 1.5rem; border: 1px solid #dde3ea; }
    .steps ol { margin: 0.5rem 0 0; padding-right: 1.25rem; }
    .steps li { margin-bottom: 0.35rem; }
    .card { background: #fff; border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; border: 1px solid #dde3ea; }
    .card__year { font-size: 0.75rem; color: #888; }
    .card__title { font-size: 1.1rem; margin: 0.25rem 0; color: #1e5a8a; }
    .card__path { font-size: 0.8rem; color: #666; font-family: monospace; margin: 0 0 1rem; word-break: break-all; }
    .actions { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .btn { display: inline-block; padding: 0.5rem 0.85rem; border-radius: 8px; font-size: 0.9rem; text-decoration: none; background: #e8eef4; color: #1a1a1a; border: 1px solid #c5d0dc; }
    .btn:hover { background: #dce6f0; }
    .btn--primary { background: #1e5a8a; color: #fff; border-color: #1e5a8a; }
    .btn--primary:hover { background: #164a72; }
    .btn--ghost { background: transparent; }
    .back { display: inline-block; margin-bottom: 1rem; color: #1e5a8a; text-decoration: none; }
    .note { font-size: 0.85rem; color: #666; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #dde3ea; }
  </style>
</head>
<body>
  <div class="wrap">
    <a class="back" href="../">← الصفحة الرئيسية</a>
    <h1>📤 رفع محاضرة — طريقة سهلة</h1>
    <p class="lead">بدون Decap CMS. اضغط الزر → ارفع الملف على GitHub → افتح Pull Request.</p>

    <div class="steps">
      <strong>الخطوات:</strong>
      <ol>
        <li>اختر المادة واضغط <strong>محاضرة جديدة</strong> أو <strong>رفع ملف</strong></li>
        <li>سمِّ الملف <code>parN.md</code> أو <code>parN-sec1.md</code></li>
        <li>الصق المحتوى (حسب SCHEMA.md) واحفظ</li>
        <li>افتح <a href="${GH}/compare" target="_blank" rel="noopener">Pull Request</a> → CI يتحقق → Merge → الموقع يتحدّث</li>
      </ol>
    </div>

    ${cards.join('\n') || '<p>لا توجد مواد بعد.</p>'}

    <p class="note">
      لا تحتاج تعديل <code>manifest.json</code> — يُزامَن تلقائياً.
      <br>Decap CMS متقدّم (<a href="../admin/">/admin/</a>) — يحتاج إعداد OAuth.
    </p>
  </div>
</body>
</html>`;

  const outDir = path.join(ENGINE_ROOT, 'dist', 'contrib');
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, 'index.html'), html);
  console.log(`✓ dist/contrib/index.html (${subjects.length} subject(s))`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
