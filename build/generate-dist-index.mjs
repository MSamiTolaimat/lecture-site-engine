#!/usr/bin/env node
/**
 * Generate dist/index.html — hub linking to all subjects (built + placeholder stubs).
 */
import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  listAllSubjectDirs,
  parseSubjectBrief,
  parseParFilename,
  academicYearFromPath,
  toArabicDigits,
} from './lib/scaffold-subject.mjs';

const ENGINE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ENGINE_ROOT, 'dist');

/** @param {number} n */
function lectureCountLabel(n) {
  if (n === 0) return '٠ محاضرات';
  if (n === 1) return 'محاضرة واحدة';
  if (n === 2) return 'محاضرتان';
  return `${toArabicDigits(n)} محاضرات`;
}

/** @param {string} rel */
async function countLecturesForSubject(rel) {
  const lecturesDir = path.join(ENGINE_ROOT, 'subjects', rel, 'lectures');
  if (existsSync(lecturesDir)) {
    const files = await readdir(lecturesDir);
    const nums = new Set();
    for (const f of files) {
      const parsed = parseParFilename(f);
      if (parsed) nums.add(parsed.num);
    }
    if (nums.size) return nums.size;
  }

  const distManifest = path.join(DIST, rel, 'lectures/manifest.json');
  if (existsSync(distManifest)) {
    try {
      const m = JSON.parse(await readFile(distManifest, 'utf8'));
      const nums = new Set(
        (m.files || []).map(f => f.num).filter(n => typeof n === 'number' && !Number.isNaN(n)),
      );
      if (nums.size) return nums.size;
    } catch { /* ignore */ }
  }

  return 0;
}

/** @returns {Promise<{ rel: string, title: string, subtitle: string, year: string, academicYear: number, hasLectures: boolean, lectureCount: number }[]>} */
async function collectHubSubjects() {
  /** @type {Awaited<ReturnType<typeof collectHubSubjects>>} */
  const items = [];

  for (const rel of await listAllSubjectDirs()) {
    const subjectPath = path.join(ENGINE_ROOT, 'subjects', rel);
    const briefPath = path.join(subjectPath, 'subject-brief.yaml');
    const lecturesDir = path.join(subjectPath, 'lectures');
    if (!existsSync(briefPath) && !existsSync(lecturesDir)) continue;

    const folderName = rel.split('/')[1];
    let title = folderName;
    let subtitle = '';
    let year = '';
    let academicYear = academicYearFromPath(rel);

    if (existsSync(briefPath)) {
      try {
        const brief = parseSubjectBrief(await readFile(briefPath, 'utf8'));
        title = brief.name_ar || title;
        subtitle = brief.tagline || '';
      } catch { /* ignore */ }
    }

    const manifestSrc = path.join(lecturesDir, 'manifest.json');
    if (existsSync(manifestSrc)) {
      try {
        const m = JSON.parse(await readFile(manifestSrc, 'utf8'));
        title = m.settings?.subjectName || m.title || title;
        subtitle = m.subtitle || subtitle;
        year = m.settings?.year || '';
        academicYear = m.settings?.academicYear ?? academicYear;
      } catch { /* ignore */ }
    }

    const lectureCount = await countLecturesForSubject(rel);
    const hasLectures = lectureCount > 0;

    items.push({ rel, title, subtitle, year, academicYear, hasLectures, lectureCount });
  }

  return items.sort((a, b) => a.rel.localeCompare(b.rel, 'ar'));
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderStubHtml(subject) {
  const msg = subject.hasLectures
    ? 'جاري تجهيز عرض المحاضرات — حاول لاحقاً.'
    : 'لا توجد محاضرات منشورة بعد لهذه المادة.';
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject.title)} — قريباً</title>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'IBM Plex Sans Arabic', sans-serif; margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; background: #f8f6f2; color: #1a1a1a; text-align: center; }
    .box { max-width: 420px; background: #fff; border: 1px solid #e8e4dc; border-radius: 16px; padding: 2rem 1.5rem; }
    h1 { font-size: 1.35rem; margin: 0 0 0.75rem; color: #5c3d8a; }
    p { color: #555; margin: 0 0 1.25rem; line-height: 1.7; }
    a { color: #1e5a8a; text-decoration: none; font-weight: 600; }
    a:hover { text-decoration: underline; }
    .badge { display: inline-block; margin-bottom: 1rem; padding: 0.25rem 0.65rem; border-radius: 999px; background: #f0ebe0; color: #7a6528; font-size: 0.8rem; }
  </style>
</head>
<body>
  <div class="box">
    <span class="badge">قيد الإعداد</span>
    <h1>${escapeHtml(subject.title)}</h1>
    <p>${escapeHtml(msg)}</p>
    <a href="../../index.html">← العودة للصفحة الرئيسية</a>
  </div>
</body>
</html>`;
}

/** @param {Awaited<ReturnType<typeof collectHubSubjects>>} subjects */
async function ensureSubjectStubs(subjects) {
  let created = 0;
  for (const s of subjects) {
    const outIndex = path.join(DIST, s.rel, 'index.html');
    const builtManifest = path.join(DIST, s.rel, 'lectures/manifest.json');
    if (existsSync(builtManifest) || existsSync(outIndex)) continue;
    await mkdir(path.dirname(outIndex), { recursive: true });
    await writeFile(outIndex, renderStubHtml(s));
    created++;
  }
  return created;
}

/** @param {Awaited<ReturnType<typeof collectHubSubjects>>} subjects */
function renderHtml(subjects) {
  const byYear = {};
  for (const s of subjects) {
    const y = s.academicYear || Number(s.rel.match(/year-(\d)/)?.[1]) || 0;
    if (!byYear[y]) byYear[y] = [];
    byYear[y].push(s);
  }

  const yearSections = Object.keys(byYear).sort((a, b) => Number(a) - Number(b)).map(y => {
    const cards = byYear[y].map(s => {
      const pending = !s.hasLectures;
      const countLabel = lectureCountLabel(s.lectureCount);
      return `
      <a class="card${pending ? ' card--pending' : ''}" href="./${s.rel}/index.html">
        <span class="card__lectures" title="${escapeHtml(countLabel)}">${toArabicDigits(s.lectureCount)}</span>
        <span class="card__year">السنة ${y}</span>
        <span class="card__title">${escapeHtml(s.title)}</span>
        ${s.subtitle ? `<span class="card__sub">${escapeHtml(s.subtitle)}</span>` : ''}
        ${s.year ? `<span class="card__meta">${escapeHtml(s.year)}</span>` : ''}
        <span class="card__count-note">${escapeHtml(countLabel)}</span>
        ${pending ? '<span class="card__badge">قيد الإعداد</span>' : ''}
      </a>`;
    }).join('\n');
    return `<section class="year-block"><h2>السنة ${y}</h2><div class="grid">${cards}</div></section>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>دلائل الدراسة — Faculty Study Guides</title>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'IBM Plex Sans Arabic', sans-serif; margin: 0; padding: 2rem; background: #f8f6f2; color: #1a1a1a; }
    h1 { text-align: center; margin-bottom: 0.25rem; }
    .lead { text-align: center; color: #555; margin-bottom: 2rem; }
    .year-block { max-width: 960px; margin: 0 auto 2rem; }
    .year-block h2 { border-bottom: 2px solid #c9a227; padding-bottom: 0.5rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }
    .card { position: relative; display: block; padding: 1.25rem 1.25rem 1rem; background: #fff; border-radius: 12px; text-decoration: none; color: inherit; border: 1px solid #e8e4dc; transition: box-shadow .2s, transform .2s; }
    .card:hover { box-shadow: 0 8px 24px rgba(0,0,0,.08); transform: translateY(-2px); }
    .card--pending { border-style: dashed; background: #faf9f7; }
    .card__lectures { position: absolute; top: -0.45rem; left: 0.85rem; min-width: 1.75rem; height: 1.75rem; padding: 0 0.4rem; display: flex; align-items: center; justify-content: center; border-radius: 999px; background: #5c3d8a; color: #fff; font-size: 0.82rem; font-weight: 700; line-height: 1; box-shadow: 0 2px 8px rgba(92,61,138,.35); }
    .card--pending .card__lectures { background: #9a8b6a; box-shadow: 0 2px 8px rgba(122,101,40,.25); }
    .card__count-note { display: block; margin-top: 0.45rem; font-size: 0.78rem; color: #777; }
    .card__year { font-size: 0.75rem; color: #888; display: block; }
    .card__title { font-size: 1.1rem; font-weight: 700; display: block; margin: 0.35rem 0; color: #5c3d8a; }
    .card__sub { font-size: 0.85rem; color: #666; display: block; }
    .card__meta { font-size: 0.75rem; color: #999; display: block; margin-top: 0.5rem; }
    .card__badge { display: inline-block; margin-top: 0.65rem; padding: 0.2rem 0.55rem; border-radius: 999px; background: #f0ebe0; color: #7a6528; font-size: 0.72rem; }
    .empty { text-align: center; color: #888; padding: 3rem; }
  </style>
</head>
<body>
  <h1>دلائل الدراسة التفاعلية</h1>
  <p class="lead">اختر المادة للبدء</p>
  ${subjects.length ? yearSections : '<p class="empty">لا توجد مواد بعد.</p>'}
</body>
</html>`;
}

async function main() {
  await mkdir(DIST, { recursive: true });
  const subjects = await collectHubSubjects();
  const stubs = await ensureSubjectStubs(subjects);
  const html = renderHtml(subjects);
  await writeFile(path.join(DIST, 'index.html'), html);
  console.log(`✓ dist/index.html (${subjects.length} subject(s), ${stubs} stub(s))`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
